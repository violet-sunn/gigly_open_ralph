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
import { applyToGig } from '@/app/actions/gig'

describe('Closed Gig Application Prevention', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('cannot apply to closed OPEN gig', async () => {
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

    // Create closed OPEN gig
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
        status: 'OPEN',
        closedByAdmin: true,
        closedAt: new Date()
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('approach', 'A'.repeat(100)) // Min 100 chars
    formData.append('questions', 'B'.repeat(50)) // Min 50 chars
    formData.append('estimatedEffort', '2 weeks')

    await withAuthContext(specialist, async () => {
      const result = await applyToGig(null, formData)
      expect(result).toEqual({ error: 'Этот гиг закрыт администрацией и больше недоступен.' })
    })

    // Verify no application was created
    const applications = await prisma.application.findMany({
      where: { gigId: gig.id }
    })
    expect(applications.length).toBe(0)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('cannot apply to closed IN_PROGRESS gig', async () => {
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

    // Create closed IN_PROGRESS gig
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
        closedByAdmin: true,
        closedAt: new Date()
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('approach', 'A'.repeat(100))
    formData.append('questions', 'B'.repeat(50))
    formData.append('estimatedEffort', '2 weeks')

    await withAuthContext(specialist, async () => {
      const result = await applyToGig(null, formData)
      // closedByAdmin check happens before status check, so we get the closed error
      expect(result).toEqual({ error: 'Этот гиг закрыт администрацией и больше недоступен.' })
    })

    // Verify no application was created
    const applications = await prisma.application.findMany({
      where: { gigId: gig.id }
    })
    expect(applications.length).toBe(0)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('can apply to non-closed OPEN gig', async () => {
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

    // Create non-closed OPEN gig
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
        status: 'OPEN',
        closedByAdmin: false
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('approach', 'A'.repeat(100))
    formData.append('questions', 'B'.repeat(50))
    formData.append('estimatedEffort', '2 weeks')

    await withAuthContext(specialist, async () => {
      try {
        await applyToGig(null, formData)
        // Should redirect on success
        expect.fail('Expected redirect to throw')
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify application was created
    const applications = await prisma.application.findMany({
      where: { gigId: gig.id, specialistId: specialist.id }
    })
    expect(applications.length).toBe(1)
    expect(applications[0].status).toBe('PENDING')

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('closed gig returns specific error message', async () => {
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
        status: 'OPEN',
        closedByAdmin: true
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('approach', 'A'.repeat(100))
    formData.append('questions', 'B'.repeat(50))

    await withAuthContext(specialist, async () => {
      const result = await applyToGig(null, formData)
      // Verify exact error message
      expect(result.error).toBe('Этот гиг закрыт администрацией и больше недоступен.')
    })

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('no application record created when gig is closed', async () => {
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
        status: 'OPEN',
        closedByAdmin: true
      }
    })

    // Count applications before
    const beforeCount = await prisma.application.count({
      where: { gigId: gig.id }
    })
    expect(beforeCount).toBe(0)

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('approach', 'A'.repeat(100))
    formData.append('questions', 'B'.repeat(50))

    await withAuthContext(specialist, async () => {
      await applyToGig(null, formData)
    })

    // Count applications after - should still be 0
    const afterCount = await prisma.application.count({
      where: { gigId: gig.id }
    })
    expect(afterCount).toBe(0)

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })
})
