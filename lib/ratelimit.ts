/**
 * In-Memory Rate Limiting Implementation
 *
 * Uses a sliding window algorithm with timestamp arrays to track requests per identifier.
 * This implementation is suitable for MVP single-instance deployments.
 *
 * Trade-offs:
 * - State is lost on server restart (acceptable for MVP)
 * - Does not work across multiple server instances (acceptable for MVP)
 * - Memory usage is bounded by automatic cleanup mechanism
 *
 * For production scaling with multiple instances, consider migrating to:
 * - Self-hosted Redis
 * - PostgreSQL-based rate limiting
 * - Distributed cache solution
 */

/**
 * In-memory rate limiter using sliding window algorithm
 */
class InMemoryRateLimiter {
  private store: Map<string, number[]>
  private maxRequests: number
  private window: number
  private cleanupInterval: NodeJS.Timeout | null = null

  /**
   * Create a new rate limiter
   * @param limit - Maximum number of requests allowed in the time window
   * @param window - Time window in milliseconds
   */
  constructor(limit: number, window: number) {
    this.store = new Map()
    this.maxRequests = limit
    this.window = window
    this.startCleanup()
  }

  /**
   * Check if a request should be allowed for the given identifier
   * @param identifier - Unique identifier (IP address or user ID)
   * @returns Promise resolving to success result or rate limit exceeded result with reset time
   */
  async limit(identifier: string): Promise<
    | { success: true }
    | { success: false; reset: number }
  > {
    // Test-only bypass: E2E runs against the real dev server (the limiter is mocked only in vitest), where a single
    // run legitimately performs many registrations/logins. `DISABLE_RATE_LIMIT` is set ONLY by the E2E webServer env
    // (never in production) so the in-memory window does not make registration/login E2E flaky.
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      return { success: true }
    }

    const now = Date.now()
    const windowStart = now - this.window

    // Get existing timestamps for this identifier
    let timestamps = this.store.get(identifier) || []

    // Filter out timestamps outside the window (sliding window)
    timestamps = timestamps.filter(ts => ts > windowStart)

    // Check if limit exceeded
    if (timestamps.length >= this.maxRequests) {
      const oldestTimestamp = timestamps[0]
      const resetTime = oldestTimestamp + this.window
      return { success: false, reset: resetTime }
    }

    // Allow request and record timestamp
    timestamps.push(now)
    this.store.set(identifier, timestamps)

    return { success: true }
  }

  /**
   * Start automatic cleanup to prevent memory leaks
   * Runs every 5 minutes and removes entries with no activity in the last 2 hours
   */
  private startCleanup(): void {
    const CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutes
    const EXPIRATION_THRESHOLD = 2 * 60 * 60 * 1000 // 2 hours

    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const expirationTime = now - EXPIRATION_THRESHOLD

      for (const [identifier, timestamps] of this.store.entries()) {
        // Remove entries with no recent timestamps
        const recentTimestamps = timestamps.filter(ts => ts > expirationTime)

        if (recentTimestamps.length === 0) {
          this.store.delete(identifier)
        } else if (recentTimestamps.length < timestamps.length) {
          // Update with filtered timestamps if some were removed
          this.store.set(identifier, recentTimestamps)
        }
      }
    }, CLEANUP_INTERVAL)

    // Allow process to exit even if cleanup interval is running
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref()
    }
  }

  /**
   * Stop the cleanup interval (useful for testing or graceful shutdown)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Rate limiters for different endpoints
// Login: 15 attempts per 15 minutes (IP-based)
export const loginRateLimiter = new InMemoryRateLimiter(15, 15 * 60 * 1000)

// Registration: 20 attempts per 1 hour (IP-based). Raised from 3 so a live demo/defense where several people
// register from the same IP (and may fumble a weak password a couple times) doesn't lock the IP out for an hour.
export const registerRateLimiter = new InMemoryRateLimiter(20, 60 * 60 * 1000)

// Application submission: 10 applications per 1 hour (user-based)
export const applicationRateLimiter = new InMemoryRateLimiter(10, 60 * 60 * 1000)

// Message sending: 30 messages per 1 hour (user-based)
export const messageRateLimiter = new InMemoryRateLimiter(30, 60 * 60 * 1000)

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
