import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createAuthenticatedClient, createAuthenticatedSpecialist, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestGig, createTestApplication } from '../helpers/seed'

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
import { createGig, applyToGig, acceptApplication, submitWork, approveWork, markAsPaid } from '@/app/actions/gig'
import { withAuthContext } from '../helpers/auth'

describe('Gig Authorization Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('CLIENT can create gigs', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('title', 'Test Gig')
    formData.append('description', 'Test description for the gig')
    formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters to pass validation')
    formData.append('budget', '100000')
    formData.append('tags', 'React,TypeScript')

    await withAuthContext(client, async () => {
      try {
        await createGig(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT:/gigs/new/success')
      }
    })

    // Verify gig was created
    const gigs = await prisma.gig.findMany({
      where: { clientId: client.id }
    })
    expect(gigs.length).toBeGreaterThan(0)
    expect(gigs[0].title).toBe('Test Gig')

    // Cleanup
    await prisma.gig.deleteMany({ where: { clientId: client.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('SPECIALIST cannot create gigs', async () => {
    const prisma = getTestPrismaClient()

    // Create SPECIALIST user
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const formData = new FormData()
    formData.append('title', 'Test Gig')
    formData.append('description', 'Test description')
    formData.append('acceptanceCriteria', 'This is a detailed acceptance criteria with more than 50 characters')
    formData.append('budget', '100000')

    await withAuthContext(specialist, async () => {
      const result = await createGig(null, formData)
      expect(result).toEqual({ error: 'Only clients can post gigs. Switch to a client account or register as a client to continue.' })
    })

    // Cleanup
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('SPECIALIST can apply to open gigs', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT and gig
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

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

    // Create SPECIALIST
    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('approach', 'This is my technical approach with detailed methodology and implementation plan that exceeds 100 characters minimum requirement')
    formData.append('questions', 'These are my clarifying questions about the requirements and scope')
    formData.append('estimatedEffort', '2 weeks')

    await withAuthContext(specialist, async () => {
      try {
        await applyToGig(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify application was created
    const applications = await prisma.application.findMany({
      where: { gigId: gig.id, specialistId: specialist.id }
    })
    expect(applications.length).toBe(1)

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('CLIENT cannot apply to gigs', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT users
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client1 = await prisma.user.create({
      data: {
        email: `client1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const client2 = await prisma.user.create({
      data: {
        email: `client2-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client1.id,
        status: 'OPEN'
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('approach', 'This is my technical approach with detailed methodology and implementation plan that exceeds 100 characters minimum')
    formData.append('questions', 'These are my clarifying questions about requirements')

    await withAuthContext(client2, async () => {
      const result = await applyToGig(null, formData)
      expect(result).toEqual({ error: 'Only specialists can apply to gigs. Switch to a specialist account or register as a specialist to continue.' })
    })

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client1.id } })
    await prisma.user.delete({ where: { id: client2.id } })
  })

  it('Gig owner can accept applications', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT, SPECIALIST, gig, and application
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

    await withAuthContext(client, async () => {
      try {
        await acceptApplication(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify application was accepted and gig status changed
    const updatedApplication = await prisma.application.findUnique({
      where: { id: application.id }
    })
    const updatedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })

    expect(updatedApplication?.status).toBe('ACCEPTED')
    expect(updatedGig?.status).toBe('IN_PROGRESS')
    expect(updatedGig?.assignedSpecialistId).toBe(specialist.id)

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Non-owner cannot accept applications', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs, SPECIALIST, gig, and application
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client1 = await prisma.user.create({
      data: {
        email: `client1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const client2 = await prisma.user.create({
      data: {
        email: `client2-${Date.now()}@example.com`,
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

    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client1.id,
        status: 'OPEN'
      }
    })

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

    // Try to accept as non-owner
    await withAuthContext(client2, async () => {
      const result = await acceptApplication(null, formData)
      expect(result).toEqual({ error: 'Only the client who posted this gig can accept applications.' })
    })

    // Verify application status unchanged
    const unchangedApplication = await prisma.application.findUnique({
      where: { id: application.id }
    })
    expect(unchangedApplication?.status).toBe('PENDING')

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client1.id } })
    await prisma.user.delete({ where: { id: client2.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Assigned specialist can submit work', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT, SPECIALIST, and gig in IN_PROGRESS status
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
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    await withAuthContext(specialist, async () => {
      try {
        await submitWork(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify gig status changed to REVIEW
    const updatedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(updatedGig?.status).toBe('REVIEW')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Non-assigned specialist cannot submit work', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT, two SPECIALISTs, and gig assigned to specialist1
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const specialist1 = await prisma.user.create({
      data: {
        email: `specialist1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const specialist2 = await prisma.user.create({
      data: {
        email: `specialist2-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

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
        assignedSpecialistId: specialist1.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    // Try to submit as non-assigned specialist
    await withAuthContext(specialist2, async () => {
      const result = await submitWork(null, formData)
      expect(result).toEqual({ error: 'Only the assigned specialist can submit work for this gig.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.status).toBe('IN_PROGRESS')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist1.id } })
    await prisma.user.delete({ where: { id: specialist2.id } })
  })

  it('Gig owner can approve work', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT, SPECIALIST, and gig in REVIEW status
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
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    await withAuthContext(client, async () => {
      try {
        await approveWork(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify gig status changed to COMPLETED
    const updatedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(updatedGig?.status).toBe('COMPLETED')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Non-owner cannot approve work', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs, SPECIALIST, and gig in REVIEW status
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client1 = await prisma.user.create({
      data: {
        email: `client1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const client2 = await prisma.user.create({
      data: {
        email: `client2-${Date.now()}@example.com`,
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

    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client1.id,
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    // Try to approve as non-owner
    await withAuthContext(client2, async () => {
      const result = await approveWork(null, formData)
      expect(result).toEqual({ error: 'Only the client who posted this gig can approve the work.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.status).toBe('REVIEW')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client1.id } })
    await prisma.user.delete({ where: { id: client2.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Gig owner can mark as paid', async () => {
    const prisma = getTestPrismaClient()

    // Create CLIENT, SPECIALIST, and gig in COMPLETED status
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
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    await withAuthContext(client, async () => {
      try {
        await markAsPaid(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify gig was marked as paid
    const updatedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(updatedGig?.status).toBe('PAID')
    expect(updatedGig?.paidAt).toBeDefined()

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Non-owner cannot mark as paid', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs, SPECIALIST, and gig in COMPLETED status
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client1 = await prisma.user.create({
      data: {
        email: `client1-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const client2 = await prisma.user.create({
      data: {
        email: `client2-${Date.now()}@example.com`,
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

    const gig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'React',
        clientId: client1.id,
        status: 'COMPLETED',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    // Try to mark as paid as non-owner
    await withAuthContext(client2, async () => {
      const result = await markAsPaid(null, formData)
      expect(result).toEqual({ error: 'Only the client who posted this gig can mark it as paid.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(unchangedGig?.status).toBe('COMPLETED')
    expect(unchangedGig?.paidAt).toBeNull()

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client1.id } })
    await prisma.user.delete({ where: { id: client2.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  // Gap-fill tests: Role validation
  it('CLIENT cannot submit work', async () => {
    // Gap-fill: Spec scenario "Non-SPECIALIST user attempts to submit work"
    const prisma = getTestPrismaClient()
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
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    await withAuthContext(client, async () => {
      const result = await submitWork(null, formData)
      expect(result).toEqual({ error: 'Only specialists can submit work. If you\'re the client, wait for the specialist to submit their deliverables.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(unchangedGig?.status).toBe('IN_PROGRESS')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('SPECIALIST cannot approve work', async () => {
    // Gap-fill: Spec scenario "Non-CLIENT user attempts to approve work"
    const prisma = getTestPrismaClient()
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
        status: 'REVIEW',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)

    await withAuthContext(specialist, async () => {
      const result = await approveWork(null, formData)
      expect(result).toEqual({ error: 'Only clients can approve work. If you\'re the specialist, wait for the client to review your submission.' })
    })

    // Verify gig status unchanged
    const unchangedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
    expect(unchangedGig?.status).toBe('REVIEW')

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  // Gap-fill tests: Edge cases
  it('Submit work on non-existent gig', async () => {
    // Gap-fill: Spec scenario "Gig not found"
    const prisma = getTestPrismaClient()
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const formData = new FormData()
    formData.append('gigId', 'non-existent-gig-id')

    await withAuthContext(specialist, async () => {
      const result = await submitWork(null, formData)
      expect(result).toEqual({ error: 'This gig no longer exists or has been removed.' })
    })

    // Cleanup
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('Approve work on non-existent gig', async () => {
    // Gap-fill: Spec scenario "Gig not found"
    const prisma = getTestPrismaClient()
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('gigId', 'non-existent-gig-id')

    await withAuthContext(client, async () => {
      const result = await approveWork(null, formData)
      expect(result).toEqual({ error: 'This gig no longer exists or has been removed.' })
    })

    // Cleanup
    await prisma.user.delete({ where: { id: client.id } })
  })

  // Gap-fill tests: Authentication checks
  it('Unauthenticated user redirected on submitWork', async () => {
    // Gap-fill: Spec scenario "Unauthenticated user attempts to submit work"
    const formData = new FormData()
    formData.append('gigId', 'some-gig-id')

    try {
      await submitWork(null, formData)
      throw new Error('Should have redirected')
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT:/login')
    }
  })

  it('Unauthenticated user redirected on approveWork', async () => {
    // Gap-fill: Spec scenario "Unauthenticated user attempts to approve work"
    const formData = new FormData()
    formData.append('gigId', 'some-gig-id')

    try {
      await approveWork(null, formData)
      throw new Error('Should have redirected')
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT:/login')
    }
  })
})
