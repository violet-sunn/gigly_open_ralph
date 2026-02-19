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
import { closeGig, suspendUser } from '@/app/actions/moderation'

describe('Moderation Integration', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('closed gig status is independent of closedByAdmin', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, CLIENT, and IN_PROGRESS gig
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

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
    formData.append('reason', 'Inappropriate content')

    await withAuthContext(admin, async () => {
      try {
        await closeGig(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify status remains IN_PROGRESS but closedByAdmin is true
    const closedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(closedGig?.status).toBe('IN_PROGRESS') // Status unchanged
    expect(closedGig?.closedByAdmin).toBe(true) // Admin closure flag set

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('closed IN_PROGRESS gig remains IN_PROGRESS', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, CLIENT, and IN_PROGRESS gig
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

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
        status: 'IN_PROGRESS'
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('reason', 'Closing IN_PROGRESS gig')

    await withAuthContext(admin, async () => {
      try {
        await closeGig(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify status field unchanged
    const closedGig = await prisma.gig.findUnique({
      where: { id: gig.id }
    })
    expect(closedGig?.status).toBe('IN_PROGRESS')
    expect(closedGig?.closedByAdmin).toBe(true)

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('closed gigs are queryable', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, CLIENT, and multiple gigs
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const gig1 = await prisma.gig.create({
      data: {
        title: 'Gig 1',
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

    const gig2 = await prisma.gig.create({
      data: {
        title: 'Gig 2',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'Python',
        clientId: client.id,
        status: 'OPEN'
      }
    })

    const gig3 = await prisma.gig.create({
      data: {
        title: 'Gig 3',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'Go',
        clientId: client.id,
        status: 'OPEN'
      }
    })

    // Close gig1 and gig2
    await withAuthContext(admin, async () => {
      const fd1 = new FormData()
      fd1.append('gigId', gig1.id)
      fd1.append('reason', 'Reason 1')
      try { await closeGig(null, fd1) } catch {}

      const fd2 = new FormData()
      fd2.append('gigId', gig2.id)
      fd2.append('reason', 'Reason 2')
      try { await closeGig(null, fd2) } catch {}
    })

    // Query closed gigs for this client
    const closedGigs = await prisma.gig.findMany({
      where: { closedByAdmin: true, clientId: client.id }
    })

    expect(closedGigs.length).toBe(2)
    expect(closedGigs.every(g => g.closedByAdmin === true)).toBe(true)
    expect(closedGigs.every(g => g.closedAt !== null)).toBe(true)

    // Verify closedAt timestamps are set
    closedGigs.forEach(gig => {
      expect(gig.closedAt).toBeInstanceOf(Date)
    })

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig3.id } })
    await prisma.gig.delete({ where: { id: gig2.id } })
    await prisma.gig.delete({ where: { id: gig1.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('suspended user gigs remain accessible', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN and CLIENT with gigs
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const gig1 = await prisma.gig.create({
      data: {
        title: 'Gig 1',
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

    const gig2 = await prisma.gig.create({
      data: {
        title: 'Gig 2',
        description: 'Description',
        acceptanceCriteria: 'Criteria',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        tags: 'Python',
        clientId: client.id,
        status: 'IN_PROGRESS'
      }
    })

    // Suspend the client
    const formData = new FormData()
    formData.append('userId', client.id)
    formData.append('reason', 'Suspended for testing')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify gigs still exist and are queryable
    const clientGigs = await prisma.gig.findMany({
      where: { clientId: client.id }
    })

    expect(clientGigs.length).toBe(2)
    expect(clientGigs.map(g => g.id).sort()).toEqual([gig1.id, gig2.id].sort())

    // Verify user is suspended but gigs are intact
    const suspendedClient = await prisma.user.findUnique({
      where: { id: client.id }
    })
    expect(suspendedClient?.suspended).toBe(true)

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.gig.delete({ where: { id: gig2.id } })
    await prisma.gig.delete({ where: { id: gig1.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('suspended user applications remain visible', async () => {
    const prisma = getTestPrismaClient()

    // Create ADMIN, CLIENT, SPECIALIST, gig, and application
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

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
        approach: 'A'.repeat(100),
        questions: 'B'.repeat(50),
        status: 'PENDING'
      }
    })

    // Suspend the specialist
    const formData = new FormData()
    formData.append('userId', specialist.id)
    formData.append('reason', 'Suspended for testing')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify applications still exist and are queryable
    const specialistApplications = await prisma.application.findMany({
      where: { specialistId: specialist.id }
    })

    expect(specialistApplications.length).toBe(1)
    expect(specialistApplications[0].id).toBe(application.id)

    // Verify user is suspended but applications are intact
    const suspendedSpecialist = await prisma.user.findUnique({
      where: { id: specialist.id }
    })
    expect(suspendedSpecialist?.suspended).toBe(true)

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.application.delete({ where: { id: application.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })

  it('documents session invalidation behavior', async () => {
    const prisma = getTestPrismaClient()

    // NOTE: Current implementation does not invalidate existing sessions on suspension
    // This test documents the current behavior:
    // - Suspended users cannot create NEW sessions (login is blocked)
    // - Existing sessions remain valid until expiry
    // - Future enhancement: invalidate sessions on suspension

    // Create ADMIN and CLIENT
    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const admin = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    // Suspend the client
    const formData = new FormData()
    formData.append('userId', client.id)
    formData.append('reason', 'Testing session behavior')

    await withAuthContext(admin, async () => {
      try {
        await suspendUser(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    // Verify user is suspended
    const suspendedClient = await prisma.user.findUnique({
      where: { id: client.id }
    })
    expect(suspendedClient?.suspended).toBe(true)

    // Document: If the client had an existing session, it would remain valid
    // The suspension only prevents NEW logins (tested in suspended-user-login.test.ts)
    // This is acceptable for MVP - session invalidation can be added later

    // Cleanup
    await prisma.moderationLog.deleteMany({ where: { adminId: admin.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: admin.id } })
  })
})
