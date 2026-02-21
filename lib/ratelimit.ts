import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiters for different endpoints
export const loginRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '15 m'),
  analytics: true,
  prefix: 'ratelimit:login',
})

export const registerRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: 'ratelimit:register',
})

export const applicationRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: 'ratelimit:application',
})

export const messageRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 h'),
  analytics: true,
  prefix: 'ratelimit:message',
})

// Helper to format retry-after time
export function getRateLimitError(reset: number, action: string): string {
  const now = Date.now()
  const secondsUntilReset = Math.ceil((reset - now) / 1000)
  const minutesUntilReset = Math.ceil(secondsUntilReset / 60)

  if (secondsUntilReset >= 60) {
    return `Too many ${action}. Please try again in ${minutesUntilReset} minutes.`
  } else {
    return `Too many ${action}. Please try again in ${secondsUntilReset} seconds.`
  }
}
