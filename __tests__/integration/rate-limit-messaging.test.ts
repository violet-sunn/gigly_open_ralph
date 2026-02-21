import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, getTestSessionToken } from '../helpers/auth'

// Import the mocked module to override specific behaviors
import { messageRateLimiter } from '@/lib/ratelimit'

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
import { sendMessage } from '@/app/actions/gig'

describe('Message Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows message when rate limit not exceeded', async () => {
    const prisma = getTestPrismaClient()

    // Override mock for this specific test
    vi.mocked(messageRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 30,
      remaining: 29,
      reset: Date.now() + 3600000,
      pending: Promise.resolve()
    })

    // Create CLIENT, SPECIALIST, and gig
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
        description: 'Test description',
        acceptanceCriteria: 'Test acceptance criteria with more than 50 characters here',
        budget: 10000000,
        serviceFee: 1000000,
        totalAmount: 11000000,
        tags: 'React',
        clientId: client.id,
        status: 'IN_PROGRESS',
        assignedSpecialistId: specialist.id
      }
    })

    const formData = new FormData()
    formData.append('gigId', gig.id)
    formData.append('content', 'This is a test message')

    await withAuthContext(client, async () => {
      try {
        await sendMessage(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }
    })

    expect(messageRateLimiter.limit).toHaveBeenCalledWith(client.id)

    // Cleanup
    await prisma.message.deleteMany({ where: { gigId: gig.id } })
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.delete({ where: { id: client.id } })
    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('blocks message when rate limit exceeded', async () => {
    const prisma = getTestPrismaClient()

    // Override mock to simulate rate limit exceeded
    vi.mocked(messageRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 30,
      remaining: 0,
      reset: Date.now() + 1800000,
      pending: Promise.resolve()
    })

    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('gigId', 'fake-gig-id')
    formData.append('content', 'This is a test message')

    let result
    await withAuthContext(client, async () => {
      result = await sendMessage(null, formData)
    })

    expect(result).toHaveProperty('error')
    expect(result.error).toContain('Too many messages')
    expect(messageRateLimiter.limit).toHaveBeenCalledWith(client.id)

    await prisma.user.delete({ where: { id: client.id } })
  })

  it('uses user ID as identifier', async () => {
    const prisma = getTestPrismaClient()

    vi.mocked(messageRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 30,
      remaining: 29,
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
    formData.append('content', 'Test message content')

    await withAuthContext(specialist, async () => {
      await sendMessage(null, formData)
    })

    // Verify rate limiter was called with user ID, not IP
    expect(messageRateLimiter.limit).toHaveBeenCalledWith(specialist.id)

    await prisma.user.delete({ where: { id: specialist.id } })
  })

  it('error message includes retry-after time', async () => {
    const prisma = getTestPrismaClient()

    const resetTime = Date.now() + 1200000 // 20 minutes
    vi.mocked(messageRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 30,
      remaining: 0,
      reset: resetTime,
      pending: Promise.resolve()
    })

    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const client = await prisma.user.create({
      data: {
        email: `client-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('gigId', 'fake-gig-id')
    formData.append('content', 'Test message')

    let result
    await withAuthContext(client, async () => {
      result = await sendMessage(null, formData)
    })

    expect(result.error).toContain('messages')
    expect(result.error).toMatch(/\d+ (minutes|seconds)/)

    await prisma.user.delete({ where: { id: client.id } })
  })
})
