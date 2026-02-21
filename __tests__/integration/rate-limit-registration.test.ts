import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken } from '../helpers/auth'

// Import the mocked module to override specific behaviors
import { registerRateLimiter } from '@/lib/ratelimit'

// Mock other dependencies
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'x-forwarded-for') return '192.168.1.100'
      return null
    }
  })),
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
import { registerUser } from '@/app/actions/auth'

describe('Registration Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setTestSessionToken(undefined)
  })

  it('allows registration when rate limit not exceeded', async () => {
    const prisma = getTestPrismaClient()

    // Override mock for this specific test
    vi.mocked(registerRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 3,
      remaining: 2,
      reset: Date.now() + 3600000,
      pending: Promise.resolve()
    })

    const formData = new FormData()
    formData.append('email', `newuser-${Date.now()}@example.com`)
    formData.append('password', 'TestPass123')
    formData.append('role', 'CLIENT')

    try {
      await registerUser(null, formData)
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
    }

    expect(registerRateLimiter.limit).toHaveBeenCalledWith('192.168.1.100')

    // Cleanup
    const users = await prisma.user.findMany({
      where: { email: { contains: 'newuser-' } }
    })
    for (const user of users) {
      await prisma.user.delete({ where: { id: user.id } })
    }
  })

  it('blocks registration when rate limit exceeded', async () => {
    // Override mock to simulate rate limit exceeded
    vi.mocked(registerRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 3,
      remaining: 0,
      reset: Date.now() + 1800000,
      pending: Promise.resolve()
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'TestPass123')
    formData.append('role', 'SPECIALIST')

    const result = await registerUser(null, formData)

    expect(result).toHaveProperty('error')
    expect(result.error).toContain('Too many registration attempts')
    expect(registerRateLimiter.limit).toHaveBeenCalledWith('192.168.1.100')
  })

  it('error message includes retry-after time', async () => {
    const resetTime = Date.now() + 1800000 // 30 minutes
    vi.mocked(registerRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 3,
      remaining: 0,
      reset: resetTime,
      pending: Promise.resolve()
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'TestPass123')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result.error).toContain('registration attempts')
    expect(result.error).toMatch(/\d+ (minutes|seconds)/)
  })
})
