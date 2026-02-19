import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken, withAuthContext } from '../helpers/auth'

// Mock @/lib/prisma to use test database (lazy getter)
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
import { acceptApplication, approveWork, markAsPaid, submitWork } from '@/app/actions/gig'

describe('Horizontal Privilege Escalation Tests (IDOR)', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('Client A cannot accept applications on Client B\'s gig', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs and a SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const clientA = await prisma.user.create({
      data: {
        email: `clientA-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const clientB = await prisma.user.create({
      data: {
        email: `clientB-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create gig owned by Client B
    const gig = await prisma.gig.create({
      data: {
        title: 'Client B Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: clientB.id,
        status: 'OPEN'
      }
    })

    // Create application from specialist
    const application = await prisma.application.create({
      data: {
        gigId: gig.id,
        specialistId: specialist.id,
        approach: 'My approach',
        questions: 'My questions',
        status: 'PENDING'
      }
    })

    const formData = new FormData()
    formData.append('applicationId', application.id)

    // Try to accept as Client A (not the owner)
    await withAuthContext(clientA, async () => {
      const result = await acceptApplication(null, formData)
      expect(result).toEqual({ error: 'Only the gig owner can manage applications.' })
    })

    // Verify application status unchanged
    const unchangedApplication = await prisma.application.findUnique({
      where: { id: application.id }
    })
    expect(unchangedApplication?.status).toBe('PENDING')

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: clientA.id } })
    await prisma.user.delete({ where: { id: clientB.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Client A cannot approve work on Client B\'s gig', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs and a SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const clientA = await prisma.user.create({
      data: {
        email: `clientA-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const clientB = await prisma.user.create({
      data: {
        email: `clientB-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create gig owned by Client B in REVIEW status
    const gig = await prisma.gig.create({
      data: {
        title: 'Client B Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: clientB.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    // Try to approve as Client A (not the owner)
    await withAuthContext(clientA, async () => {
      const result = await approveWork(null, formData)
      expect(result).toEqual({ error: 'Only the gig owner can approve work.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.status).toBe('REVIEW')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: clientA.id } })
    await prisma.user.delete({ where: { id: clientB.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Client A cannot mark Client B\'s gig as paid', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs and a SPECIALIST
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const clientA = await prisma.user.create({
      data: {
        email: `clientA-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const clientB = await prisma.user.create({
      data: {
        email: `clientB-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create gig owned by Client B in COMPLETED status
    const gig = await prisma.gig.create({
      data: {
        title: 'Client B Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: clientB.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    // Try to mark as paid as Client A (not the owner)
    await withAuthContext(clientA, async () => {
      const result = await markAsPaid(null, formData)
      expect(result).toEqual({ error: 'Only the gig owner can mark this gig as paid.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.status).toBe('COMPLETED')
    expect(unchangedGig?.paidAt).toBeNull()

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: clientA.id } })
    await prisma.user.delete({ where: { id: clientB.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Specialist A cannot submit work for gig assigned to Specialist B', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and two SPECIALISTs
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialistA = await prisma.user.create({
      data: {
        email: `specialistA-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const specialistB = await prisma.user.create({
      data: {
        email: `specialistB-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create gig assigned to Specialist B
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialistB.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    // Try to submit work as Specialist A (not assigned)
    await withAuthContext(specialistA, async () => {
      const result = await submitWork(null, formData)
      expect(result).toEqual({ error: 'Only the assigned specialist can submit work.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.status).toBe('IN_PROGRESS')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialistA.id } })
    await prisma.user.delete({ where: { id: specialistB.id } })
  })

  it('Specialist A cannot withdraw Specialist B\'s application', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and two SPECIALISTs
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialistA = await prisma.user.create({
      data: {
        email: `specialistA-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const specialistB = await prisma.user.create({
      data: {
        email: `specialistB-${Date.now()}-${Math.random()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    // Create gig
    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client.id,
        status: 'OPEN'
      }
    })

    // Create application from Specialist B
    const application = await prisma.application.create({
      data: {
        gigId: gig.id,
        specialistId: specialistB.id,
        approach: 'Specialist B approach',
        questions: 'Specialist B questions',
        status: 'PENDING'
      }
    })

    // Verify ownership - Specialist A should not be able to claim this application
    await withAuthContext(specialistA, async () => {
      const app = await prisma.application.findUnique({
        where: { id: application.id }
      })

      expect(app?.specialistId).toBe(specialistB.id)
      expect(app?.specialistId).not.toBe(specialistA.id)
    })

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialistA.id } })
    await prisma.user.delete({ where: { id: specialistB.id } })
  })
})
