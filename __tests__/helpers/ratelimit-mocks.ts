import { vi } from 'vitest'

/**
 * Mock setup for rate limiting
 * This is called in __tests__/setup.ts to provide default mocks for all tests
 * Individual tests can override these mocks for specific rate limiting scenarios
 */
export function setupRateLimitMocks() {
  vi.mock('@/lib/ratelimit', () => ({
    loginRateLimiter: {
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 15,
        remaining: 14,
        reset: Date.now() + 900000
      })
    },
    registerRateLimiter: {
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 3,
        remaining: 2,
        reset: Date.now() + 3600000
      })
    },
    applicationRateLimiter: {
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 3600000
      })
    },
    messageRateLimiter: {
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 30,
        remaining: 29,
        reset: Date.now() + 3600000
      })
    },
    getRateLimitError: vi.fn((reset: number, action: string) => {
      const now = Date.now()
      const secondsUntilReset = Math.ceil((reset - now) / 1000)
      const minutesUntilReset = Math.ceil(secondsUntilReset / 60)
      if (secondsUntilReset >= 60) {
        return `Too many ${action}. Please try again in ${minutesUntilReset} minutes.`
      } else {
        return `Too many ${action}. Please try again in ${secondsUntilReset} seconds.`
      }
    })
  }))
}
