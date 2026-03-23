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

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// Import after mocks
import { createGig, applyToGig } from '@/app/actions/gig'
import { suspendUser } from '@/app/actions/moderation'

describe('Authorization Error Clarity Tests', () => {
  beforeEach(() => {
    setTestSessionToken(undefined)
  })

  afterEach(() => {
    setTestSessionToken(undefined)
  })

  it('role-based errors clearly state required role', async () => {
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
    formData.append('acceptanceCriteria', 'Detailed acceptance criteria with more than 50 characters')
    formData.append('budget', '100000')

    await withAuthContext(specialist, async () => {
      const result = await createGig(null, formData)

      // Error should clearly state what role is required
      expect(result).toHaveProperty('error')
      expect(result.error).toContain('client')
      expect(result.error).not.toContain('unauthorized')
      expect(result.error).not.toContain('forbidden')
      // Should use clear, user-friendly language
      expect(result.error).toBe('Only clients can post gigs. Switch to a client account or register as a client to continue.')
    })

    // Cleanup
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('ownership errors clearly indicate ownership requirement', async () => {
    const prisma = getTestPrismaClient()

    // Create two CLIENTs
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

    // Create gig owned by client1
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

    await withAuthContext(client2, async () => {
      const { acceptApplication } = await import('@/app/actions/gig')
      const result = await acceptApplication(null, formData)

      // Error should clearly indicate ownership is required
      expect(result).toHaveProperty('error')
      expect(result.error).toContain('client who posted this gig')
      expect(result.error).toBe('Only the client who posted this gig can accept applications.')
    })

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client1.id } })
    await prisma.user.delete({ where: { id: client2.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('admin-only errors clearly state admin requirement', async () => {
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

    const targetUser = await prisma.user.create({
      data: {
        email: `target-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const formData = new FormData()
    formData.append('userId', targetUser.id)
    formData.append('reason', 'Some reason')

    await withAuthContext(client, async () => {
      const result = await suspendUser(null, formData)

      // Error should clearly state admin role is required
      expect(result).toHaveProperty('error')
      expect(result.error).toContain('admin')
      expect(result.error).toBe('Only admins can perform moderation actions.')
    })

    // Cleanup
    await prisma.user.delete({ where: { id: targetUser.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })

  it('errors do not expose sensitive system details', async () => {
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
    formData.append('description', 'Test')
    formData.append('acceptanceCriteria', 'Criteria')
    formData.append('budget', '100000')

    await withAuthContext(specialist, async () => {
      const result = await createGig(null, formData)

      // Error should not contain technical details
      expect(result.error).not.toContain('prisma')
      expect(result.error).not.toContain('database')
      expect(result.error).not.toContain('query')
      expect(result.error).not.toContain('SQL')
      expect(result.error).not.toContain('stack')
      expect(result.error).not.toContain('Error:')
      expect(result.error).not.toContain('at ')
    })

    // Cleanup
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('errors use consistent format and tone', async () => {
    const prisma = getTestPrismaClient()

    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

    // Test multiple error scenarios
    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
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
        status: 'OPEN'
      }
    })

    // Collect error messages
    const errors: string[] = []

    // Error 1: SPECIALIST trying to create gig
    const formData1 = new FormData()
    formData1.append('title', 'Test')
    formData1.append('description', 'Test')
    formData1.append('acceptanceCriteria', 'Criteria with enough characters')
    formData1.append('budget', '100000')

    await withAuthContext(specialist, async () => {
      const result = await createGig(null, formData1)
      if (result.error) errors.push(result.error)
    })

    // Error 2: CLIENT trying to apply to gig
    const formData2 = new FormData()
    formData2.append('gigId', gig.id)
    formData2.append('approach', 'My approach with detailed methodology and implementation plan that exceeds 100 characters minimum requirement')
    formData2.append('questions', 'My questions')

    await withAuthContext(client, async () => {
      const result = await applyToGig(null, formData2)
      if (result.error) errors.push(result.error)
    })

    // All errors should follow consistent pattern
    errors.forEach(error => {
      // Should start with "Only"
      expect(error).toMatch(/^Only/)
      // Should end with period
      expect(error).toMatch(/\.$/)
      // Should be 1-2 sentences (what + optional how to fix)
      const sentences = error.split('.').filter(s => s.trim().length > 0)
      expect(sentences.length).toBeGreaterThanOrEqual(1)
      expect(sentences.length).toBeLessThanOrEqual(2)
      // Should use lowercase for roles (except at start)
      expect(error).not.toMatch(/CLIENT|SPECIALIST|ADMIN/)
    })

    // Cleanup
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
    await prisma.user.delete({ where: { id: client.id } })
  })
})