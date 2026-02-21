import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, getTestSessionToken } from '../helpers/auth'

// Import the mocked module to override specific behaviors
import { applicationRateLimiter } from '@/lib/ratelimit'

// Mock other dependencies
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn(),
    delete: vi.fn()
  }))
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))

// Import after mocks
import { applyToGig } from '@/app/actions/gig'

describe('Application Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows application when rate limit not exceeded', async () => {
    const prisma = getTestPrismaClient()

    // Override mock for this specific test
    vi.mocked(applicationRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
      pending: Promise.resolve()
    })

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
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria with more than 50 characters here',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        tags: 'React',
        clientId: client.id
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
    formData.append('approach', 'This is my technical approach with more than 100 characters to pass validation. I will use React and TypeScript to build this feature.')
    formData.append('questions', 'What is the timeline? What are the specific requirements?')
    formData.append('estimatedEffort', '2 weeks')

    await withAuthContext(specialist, async () => {
      try {
        await applyToGig(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    expect(applicationRateLimiter.limit).toHaveBeenCalledWith(specialist.id)

    // Cleanup
    await prisma.application.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('blocks application when rate limit exceeded', async () => {
    const prisma = getTestPrismaClient()

    // Override mock to simulate rate limit exceeded
    vi.mocked(applicationRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 1800000,
      pending: Promise.resolve()
    })

    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const formData = new FormData()
    formData.append('gigId', 'fake-gig-id')
    formData.append('approach', 'This is my technical approach with more than 100 characters to pass validation. I will use React and TypeScript.')
    formData.append('questions', 'What is the timeline? What are the requirements?')

    let result
    await withAuthContext(specialist, async () => {
      result = await applyToGig(null, formData)
    })

    expect(result).toHaveProperty('error')
    expect(result.error).toContain('Too many applications')
    expect(applicationRateLimiter.limit).toHaveBeenCalledWith(specialist.id)

    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('uses user ID as identifier', async () => {
    const prisma = getTestPrismaClient()

    vi.mocked(applicationRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
      pending: Promise.resolve()
    })

    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const specialist = await prisma.user.create({
      data: {
        email: `specialist-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'SPECIALIST'
      }
    })

    const formData = new FormData()
    formData.append('gigId', 'fake-gig-id')
    formData.append('approach', 'Technical approach with more than 100 characters to pass validation. Using modern tech stack.')
    formData.append('questions', 'What are the specific requirements and timeline?')

    await withAuthContext(specialist, async () => {
      await applyToGig(null, formData)
    })

    // Verify rate limiter was called with user ID, not IP
    expect(applicationRateLimiter.limit).toHaveBeenCalledWith(specialist.id)

    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('different users have independent limits', async () => {
    const prisma = getTestPrismaClient()

    // First user hits rate limit
    vi.mocked(applicationRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 1800000,
      pending: Promise.resolve()
    })

    // Second user does not hit rate limit
    vi.mocked(applicationRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
      pending: Promise.resolve()
    })

    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
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

    const formData = new FormData()
    formData.append('gigId', 'fake-gig-id')
    formData.append('approach', 'Technical approach with more than 100 characters to pass validation. Using modern tech stack.')
    formData.append('questions', 'What are the specific requirements and timeline?')

    // First user should be blocked
    let result1
    await withAuthContext(specialist1, async () => {
      result1 = await applyToGig(null, formData)
    })
    expect(result1.error).toContain('Too many applications')

    // Second user should succeed (different user ID)
    await withAuthContext(specialist2, async () => {
      await applyToGig(null, formData)
    })

    expect(applicationRateLimiter.limit).toHaveBeenCalledWith(specialist1.id)
    expect(applicationRateLimiter.limit).toHaveBeenCalledWith(specialist2.id)

    await prisma.user.delete({ where: { id: specialist1.id } })
    await prisma.user.delete({ where: { id: specialist2.id } })
  })
})
