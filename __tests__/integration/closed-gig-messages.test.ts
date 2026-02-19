import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken, withAuthContext } from '../helpers/auth'

// Mock @/lib/prisma to use test database
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

// Mock next/headers for session cookie management
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn((name: string, value: string) => {
      if (name === 'session') {
        setTestSessionToken(value)
      }
    }),
    delete: vi.fn((name: string) => {
      if (name === 'session') {
        setTestSessionToken(undefined)
      }
    })
  }))
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

// Import after mocks
import { sendMessage } from '@/app/actions/gig'

describe('Closed Gig Message Prevention', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('client cannot send message to closed gig', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create closed gig with assigned specialist
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria that is long enough to pass validation requirements',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
        closedByAdmin: true,
        closedAt: new Date()
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('content', 'Test message from client')

    await withAuthContext(client, async () => {
      const result = await sendMessage(null, formData)
      expect(result).toEqual({ error: 'Cannot send messages to a closed gig.' })
    })

    // Verify no message was created
    const messages = await prisma.message.findMany({
      where: { gigId: gig.id }
    })
    expect(messages.length).toBe(0)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('specialist cannot send message to closed gig', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create closed gig with assigned specialist
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria that is long enough to pass validation requirements',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
        closedByAdmin: true,
        closedAt: new Date()
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('content', 'Test message from specialist')

    await withAuthContext(specialist, async () => {
      const result = await sendMessage(null, formData)
      expect(result).toEqual({ error: 'Cannot send messages to a closed gig.' })
    })

    // Verify no message was created
    const messages = await prisma.message.findMany({
      where: { gigId: gig.id }
    })
    expect(messages.length).toBe(0)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('client can send message to non-closed gig', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create non-closed gig with assigned specialist
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria that is long enough to pass validation requirements',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
        closedByAdmin: false
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('content', 'Test message from client')

    await withAuthContext(client, async () => {
      try {
        await sendMessage(null, formData)
        expect.fail('Expected redirect to throw')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify message was created
    const messages = await prisma.message.findMany({
      where: { gigId: gig.id, senderId: client.id }
    })
    expect(messages.length).toBe(1)
    expect(messages[0].content).toBe('Test message from client')

    // Cleanup
    await prisma.message.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('specialist can send message to non-closed gig', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create non-closed gig with assigned specialist
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria that is long enough to pass validation requirements',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
        closedByAdmin: false
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('content', 'Test message from specialist')

    await withAuthContext(specialist, async () => {
      try {
        await sendMessage(null, formData)
        expect.fail('Expected redirect to throw')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify message was created
    const messages = await prisma.message.findMany({
      where: { gigId: gig.id, senderId: specialist.id }
    })
    expect(messages.length).toBe(1)
    expect(messages[0].content).toBe('Test message from specialist')

    // Cleanup
    await prisma.message.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('message rejection returns specific error message', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create closed gig
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria that is long enough to pass validation requirements',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
        closedByAdmin: true
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('content', 'Test message')

    await withAuthContext(client, async () => {
      const result = await sendMessage(null, formData)
      // Verify exact error message
      expect(result.error).toBe('Cannot send messages to a closed gig.')
    })

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('no message record created when gig is closed', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create closed gig
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria that is long enough to pass validation requirements',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id,
        closedByAdmin: true
      }
    })

    // Count messages before
    const beforeCount = await prisma.message.count({
      where: { gigId: gig.id }
    })
    expect(beforeCount).toBe(0)

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('content', 'Test message')

    await withAuthContext(client, async () => {
      await sendMessage(null, formData)
    })

    // Count messages after - should still be 0
    const afterCount = await prisma.message.count({
      where: { gigId: gig.id }
    })
    expect(afterCount).toBe(0)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })
})
