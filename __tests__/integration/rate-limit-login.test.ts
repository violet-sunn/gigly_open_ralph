import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { setTestSessionToken, getTestSessionToken } from '../helpers/auth'

// Import the mocked module to override specific behaviors
import { loginRateLimiter } from '@/lib/ratelimit'

// Mock other dependencies (following existing patterns)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'x-forwarded-for') return '192.168.1.1'
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
import { loginUser } from '@/app/actions/auth'

describe('Login Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setTestSessionToken(undefined)
  })

  it('allows login when rate limit not exceeded', async () => {
    const prisma = getTestPrismaClient()

    // Override mock for this specific test
    vi.mocked(loginRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 15,
      remaining: 14,
      reset: Date.now() + 900000,
      pending: Promise.resolve()
    })

    const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        email: `user-${Date.now()}@example.com`,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    const formData = new FormData()
    formData.append('email', user.email)
    formData.append('password', 'password123')

    try {
      await loginUser(null, formData)
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
    }

    expect(loginRateLimiter.limit).toHaveBeenCalledWith('192.168.1.1')

    await prisma.user.delete({ where: { id: user.id } })
  })

  it('blocks login when rate limit exceeded', async () => {
    // Override mock to simulate rate limit exceeded
    vi.mocked(loginRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 15,
      remaining: 0,
      reset: Date.now() + 300000,
      pending: Promise.resolve()
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123')

    const result = await loginUser(null, formData)

    expect(result).toHaveProperty('error')
    expect(result.error).toContain('Too many login attempts')
    expect(loginRateLimiter.limit).toHaveBeenCalledWith('192.168.1.1')
  })

  it('checks rate limit before password validation', async () => {
    // Override mock to block
    vi.mocked(loginRateLimiter.limit).mockResolvedValueOnce({
      success: false,
      limit: 15,
      remaining: 0,
      reset: Date.now() + 300000,
      pending: Promise.resolve()
    })

    const formData = new FormData()
    formData.append('email', 'nonexistent@example.com')
    formData.append('password', 'wrongpassword')

    const result = await loginUser(null, formData)

    // Should get rate limit error, not "Invalid email or password"
    expect(result.error).toContain('Too many login attempts')
    expect(result.error).not.toContain('Invalid email or password')
  })
})
