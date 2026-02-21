# Implementation Tasks: Rate Limiting

## Task 1: Install Rate Limiting Dependencies

**Implementation:**
- Install `@upstash/ratelimit` and `@upstash/redis` packages
- Run: `npm install @upstash/ratelimit @upstash/redis`
- Verify packages are added to `package.json`

**Test Plan:**
- Run `npm list @upstash/ratelimit @upstash/redis` to verify installation
- Check that both packages appear in `package.json` dependencies
- Run `npm run build` to ensure no compilation errors

---

## Task 2: Add Environment Variables for Upstash Redis

**Implementation:**
- Add Upstash Redis configuration to `.env` file:
  ```
  UPSTASH_REDIS_REST_URL="your_upstash_redis_rest_url"
  UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token"
  ```
- Update `.env.example` (already exists) with Upstash variables and comments:
  ```
  # Database
  DATABASE_URL="file:./prisma/dev.db"

  # Authentication
  SESSION_SECRET="your_session_secret_here"

  # Rate Limiting (Upstash Redis)
  # Get free Upstash Redis credentials at https://upstash.com
  # Create a new Redis database and copy the REST URL and token
  UPSTASH_REDIS_REST_URL="your_upstash_redis_rest_url"
  UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token"
  ```

**Note about `.env.test`:**
- `.env.test` and `.env.test.example` already exist
- **DO NOT add Upstash variables to `.env.test`** - tests use mocks (see Task 9)
- Tests never make real Redis calls, so test environment doesn't need credentials

**Test Plan:**
- Verify `.env` file contains Upstash variables
- Verify `.env.example` documents all required variables with comments
- Verify `.env.test` remains unchanged (no Upstash variables needed)
- Ensure `.env` is in `.gitignore` (should already be there)

---

## Task 3: Create Rate Limiting Utility

**Implementation:**
- Create `lib/ratelimit.ts` with rate limiter configurations
- Initialize Upstash Redis client using environment variables
- Export rate limiter instances for each endpoint:
  - `loginRateLimiter`: 15 requests per 15 minutes (IP-based)
  - `registerRateLimiter`: 3 requests per 1 hour (IP-based)
  - `applicationRateLimiter`: 10 requests per 1 hour (user-based)
  - `messageRateLimiter`: 30 requests per 1 hour (user-based)
- Use `@upstash/ratelimit` with `Ratelimit.slidingWindow()` algorithm
- Use Upstash Redis for persistent, serverless-compatible storage
- Export helper function `getRateLimitError(reset: number, action: string): string` to format error messages with retry-after time

**Implementation Notes:**
```typescript
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

  if (minutesUntilReset > 1) {
    return `Too many ${action}. Please try again in ${minutesUntilReset} minutes.`
  } else {
    return `Too many ${action}. Please try again in ${secondsUntilReset} seconds.`
  }
}
```

**Test Plan:**
- Create `__tests__/unit/ratelimit.test.ts`
- Test that rate limiters are properly initialized
- Test `getRateLimitError` formats messages correctly for different time ranges
- Verify Redis client is configured with environment variables
- Verify no compilation errors with `npm run build`

---

## Task 4: Add Rate Limiting to Login Action

**Implementation:**
- Modify `app/actions/auth.ts` - `loginUser` function
- Extract IP address from request headers (use `headers()` from `next/headers`)
- Call `loginRateLimiter.limit(ipAddress)` before password validation
- If rate limit exceeded, return error with retry-after message
- Use `getRateLimitError(reset, 'login attempts')` for error message

**Implementation Notes:**
```typescript
import { headers } from 'next/headers'
import { loginRateLimiter, getRateLimitError } from '@/lib/ratelimit'

export async function loginUser(...) {
  // Get IP address for rate limiting
  const headersList = headers()
  const ipAddress = headersList.get('x-forwarded-for') ||
                    headersList.get('x-real-ip') ||
                    'unknown'

  // Check rate limit BEFORE password validation
  const { success, reset } = await loginRateLimiter.limit(ipAddress)
  if (!success) {
    return { error: getRateLimitError(reset, 'login attempts') }
  }

  // ... rest of login logic
}
```

**Test Plan:**
- Add tests to `__tests__/integration/auth.test.ts` (or create if doesn't exist)
- Test: 15 login attempts within 15 minutes are allowed
- Test: 16th login attempt is blocked with rate limit error
- Test: Error message includes retry-after time
- Test: Different IP addresses have independent rate limits
- Run: `npm run test:unit` to verify tests pass

---

## Task 5: Add Rate Limiting to Registration Action

**Implementation:**
- Modify `app/actions/auth.ts` - `registerUser` function
- Extract IP address from request headers
- Call `registerRateLimiter.limit(ipAddress)` before validation
- If rate limit exceeded, return error with retry-after message
- Use `getRateLimitError(reset, 'registration attempts')` for error message

**Implementation Notes:**
```typescript
export async function registerUser(...) {
  // Get IP address for rate limiting
  const headersList = headers()
  const ipAddress = headersList.get('x-forwarded-for') ||
                    headersList.get('x-real-ip') ||
                    'unknown'

  // Check rate limit BEFORE validation
  const { success, reset } = await registerRateLimiter.limit(ipAddress)
  if (!success) {
    return { error: getRateLimitError(reset, 'registration attempts') }
  }

  // ... rest of registration logic
}
```

**Test Plan:**
- Add tests to `__tests__/integration/auth.test.ts`
- Test: 3 registration attempts within 1 hour are allowed
- Test: 4th registration attempt is blocked with rate limit error
- Test: Error message includes retry-after time
- Test: Successful registration counts toward rate limit
- Run: `npm run test:unit` to verify tests pass

---

## Task 6: Add Rate Limiting to Application Submission Action

**Implementation:**
- Modify `app/actions/gig.ts` - `applyToGig` function
- Use `session.userId` as identifier (user-based rate limiting)
- Call `applicationRateLimiter.limit(session.userId)` after authentication but before validation
- If rate limit exceeded, return error with retry-after message
- Use `getRateLimitError(reset, 'applications')` for error message

**Implementation Notes:**
```typescript
import { applicationRateLimiter, getRateLimitError } from '@/lib/ratelimit'

export async function applyToGig(...) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'SPECIALIST') {
    return { error: 'Only specialists can apply to gigs.' }
  }

  // Check rate limit AFTER auth, BEFORE validation
  const { success, reset } = await applicationRateLimiter.limit(session.userId)
  if (!success) {
    return { error: getRateLimitError(reset, 'applications') }
  }

  // ... rest of application logic
}
```

**Test Plan:**
- Add tests to `__tests__/integration/gig-application.test.ts` (or create if doesn't exist)
- Test: 10 application submissions within 1 hour are allowed
- Test: 11th application is blocked with rate limit error
- Test: Error message includes retry-after time
- Test: Different users have independent rate limits
- Test: Failed applications (validation errors) count toward rate limit
- Run: `npm run test:unit` to verify tests pass

---

## Task 7: Add Rate Limiting to Message Sending Action

**Implementation:**
- Modify `app/actions/gig.ts` - `sendMessage` function
- Use `session.userId` as identifier (user-based rate limiting)
- Call `messageRateLimiter.limit(session.userId)` after authentication but before validation
- If rate limit exceeded, return error with retry-after message
- Use `getRateLimitError(reset, 'messages')` for error message

**Implementation Notes:**
```typescript
import { messageRateLimiter, getRateLimitError } from '@/lib/ratelimit'

export async function sendMessage(...) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Check rate limit AFTER auth, BEFORE validation
  const { success, reset } = await messageRateLimiter.limit(session.userId)
  if (!success) {
    return { error: getRateLimitError(reset, 'messages') }
  }

  // ... rest of message logic
}
```

**Test Plan:**
- Add tests to `__tests__/integration/messaging.test.ts` (or create if doesn't exist)
- Test: 30 messages within 1 hour are allowed
- Test: 31st message is blocked with rate limit error
- Test: Error message includes retry-after time
- Test: Different users have independent rate limits
- Test: Failed messages (validation errors) count toward rate limit
- Test: Rate limit is global per user (not per gig)
- Run: `npm run test:unit` to verify tests pass

---

## Task 8: Write Unit Tests for Rate Limiting Utility

**Implementation:**
- Create `__tests__/unit/ratelimit.test.ts`
- Test `getRateLimitError` function (pure function, no Redis calls)
- Do NOT test the rate limiter instances directly (they would hit Redis)

**Test Scenarios:**
1. `getRateLimitError` formats minutes correctly (> 60 seconds)
2. `getRateLimitError` formats seconds correctly (< 60 seconds)
3. `getRateLimitError` includes action name in message
4. Edge case: exactly 60 seconds formats as "1 minutes"
5. Edge case: 1 second formats as "1 seconds"

**Implementation Notes:**
```typescript
import { describe, it, expect } from 'vitest'
import { getRateLimitError } from '@/lib/ratelimit'

describe('Rate Limiting Utility', () => {
  describe('getRateLimitError', () => {
    it('formats error message with minutes when > 60 seconds', () => {
      const reset = Date.now() + 120000 // 2 minutes from now
      const error = getRateLimitError(reset, 'login attempts')
      expect(error).toContain('2 minutes')
      expect(error).toContain('login attempts')
    })

    it('formats error message with seconds when < 60 seconds', () => {
      const reset = Date.now() + 30000 // 30 seconds from now
      const error = getRateLimitError(reset, 'messages')
      expect(error).toContain('30 seconds')
      expect(error).toContain('messages')
    })

    // ... more tests
  })
})
```

**Test Plan:**
- Run: `npm run test:unit -- ratelimit.test.ts`
- Verify all 5+ unit tests pass
- Verify NO network requests are made (tests should be instant)
- Check test coverage with `npm run test:coverage`

---

## Task 9: Write Integration Tests for Rate-Limited Actions

**Integration with Existing Test Infrastructure**

Instead of creating a parallel testing approach, integrate with the existing test infrastructure:

### Step 1: Create Shared Rate Limit Mock Helper

Create `__tests__/helpers/ratelimit-mocks.ts` following the existing pattern:

```typescript
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
      if (minutesUntilReset > 1) {
        return `Too many ${action}. Please try again in ${minutesUntilReset} minutes.`
      } else {
        return `Too many ${action}. Please try again in ${secondsUntilReset} seconds.`
      }
    })
  }))
}
```

### Step 2: Add Mock to Global Test Setup

Update `__tests__/setup.ts` to include rate limiting mocks:

```typescript
import { beforeAll, afterAll } from 'vitest'
import { setupTestDatabase, cleanupTestDatabase, setTestPrismaClient } from './helpers/db'
import { setupRateLimitMocks } from './helpers/ratelimit-mocks'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import path from 'path'

// Load test environment variables
config({ path: path.resolve(process.cwd(), '.env.test') })

// Setup rate limiting mocks globally (before any imports)
setupRateLimitMocks()

let testClient: PrismaClient | undefined

// Setup: Each worker gets its own isolated in-memory database
beforeAll(async () => {
  testClient = await setupTestDatabase()
  setTestPrismaClient(testClient)
})

// Teardown: Cleanup database after all tests in this worker
afterAll(async () => {
  await cleanupTestDatabase(testClient)
})
```

### Step 3: Create Rate Limiting Specific Tests

Now create test files that override the default mocks for specific scenarios:

**File: `__tests__/integration/rate-limit-login.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'

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
  })

  it('allows login when rate limit not exceeded', async () => {
    const prisma = getTestPrismaClient()

    // Override mock for this specific test
    vi.mocked(loginRateLimiter.limit).mockResolvedValueOnce({
      success: true,
      limit: 15,
      remaining: 14,
      reset: Date.now() + 900000
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
      reset: Date.now() + 300000
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
      reset: Date.now() + 300000
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
```

**Create similar test files:**
- `__tests__/integration/rate-limit-registration.test.ts` (3 tests)
- `__tests__/integration/rate-limit-application.test.ts` (4 tests)
- `__tests__/integration/rate-limit-messaging.test.ts` (4 tests)

### Step 4: Verify Existing Tests Still Pass

**CRITICAL**: After adding rate limiting to actions, run existing tests to ensure they still pass:

```bash
npm run test:unit
```

All existing tests should pass because:
- Rate limiting is mocked globally in `setup.ts`
- Default mock always returns `success: true`
- Existing tests are unaffected by rate limiting logic

**Test Scenarios (minimum 14 tests total):**

**Login Rate Limiting (3 tests):**
1. Allows login when rate limit not exceeded
2. Blocks login when rate limit exceeded
3. Checks rate limit before password validation

**Registration Rate Limiting (3 tests):**
1. Allows registration when rate limit not exceeded
2. Blocks registration when rate limit exceeded
3. Error message includes retry-after time

**Application Rate Limiting (4 tests):**
1. Allows application when rate limit not exceeded
2. Blocks application when rate limit exceeded
3. Uses user ID as identifier (verify correct parameter)
4. Different users have independent limits (mock different user IDs)

**Message Rate Limiting (4 tests):**
1. Allows message when rate limit not exceeded
2. Blocks message when rate limit exceeded
3. Uses user ID as identifier
4. Error message includes retry-after time

**Test Plan:**
- Create `__tests__/helpers/ratelimit-mocks.ts`
- Update `__tests__/setup.ts` to call `setupRateLimitMocks()`
- Create 4 new test files for rate limiting scenarios
- Run: `npm run test:unit` to verify ALL tests pass (existing + new)
- Verify tests run FAST (no network delays)
- Verify NO real HTTP requests to Upstash Redis
- Check test coverage: `npm run test:coverage`

**Benefits of This Approach:**
- ✅ Integrates with existing test infrastructure
- ✅ No parallel testing pipeline
- ✅ Existing tests continue to work without modification
- ✅ New tests can override mocks for specific scenarios
- ✅ Follows established patterns (`setupAuthMocks()` → `setupRateLimitMocks()`)
- ✅ Fast, reliable, deterministic tests

---

## Task 10: Manual Testing & Verification

**IMPORTANT: Manual testing requires actual Upstash Redis credentials**

Before manual testing, ensure you have:
1. Created a free Upstash Redis database at https://upstash.com
2. Added `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env`
3. Restarted the development server to load new environment variables

**Implementation:**
- Start development server: `npm run dev`
- Manually test each rate-limited endpoint in browser
- Verify error messages are user-friendly
- Verify retry-after times are accurate
- Verify rate limits reset after window expires

**Manual Test Checklist:**
1. **Login Rate Limit:**
   - Attempt 16 logins with wrong password
   - Verify 16th attempt shows rate limit error
   - Verify error message is clear and includes time
   - Wait for rate limit to reset (or use different IP/incognito)

2. **Registration Rate Limit:**
   - Attempt 4 registrations from same browser
   - Verify 4th attempt shows rate limit error
   - Verify error message is clear

3. **Application Rate Limit:**
   - Create 11 applications as a specialist
   - Verify 11th application shows rate limit error
   - Verify error message is clear

4. **Message Rate Limit:**
   - Send 31 messages on a gig
   - Verify 31st message shows rate limit error
   - Verify error message is clear

**Verification:**
- All rate limits work as expected
- Error messages are user-friendly (no technical jargon)
- Legitimate users are not impacted
- Rate limits reset after window expires
- Redis connection works properly (check server logs for errors)

---

## Task 11: Documentation & Cleanup

**Implementation:**
- Update `openspec/project.md` "Completed Changes" section
- Add entry: "**rate-limiting** — Rate limiting on critical server actions (login, registration, applications, messages) using @upstash/ratelimit with Upstash Redis for persistent, serverless-compatible storage. Prevents brute force attacks, spam applications, and message flooding. Thresholds: login (15/15min), registration (3/hour), applications (10/hour), messages (30/hour). Clear error messages with retry-after information. Comprehensive test coverage with mocked Redis for fast, reliable tests."
- Update "Current State" section to mention rate limiting protection
- Update "Stack" section to include Upstash Redis dependencies
- Verify all tests pass: `npm run test:unit && npm run test:e2e`

**Test Plan:**
- Run full test suite: `npm test`
- Verify all tests pass (unit, integration, E2E)
- Verify tests run FAST (mocking prevents network delays)
- Run build: `npm run build`
- Verify no compilation errors
- Check test coverage: `npm run test:coverage`
- Verify rate limiting code is covered

---

## Summary

**Total Tasks:** 11
**Estimated Effort:** 6-8 hours
**Critical Path:** Tasks 1-7 (core implementation)
**Testing:** Tasks 8-9 (verification with mocking)
**Manual Testing:** Task 10 (requires Upstash credentials)
**Documentation:** Task 11 (cleanup)

**Dependencies:**
- Task 2 depends on Task 1 (install dependencies first)
- Task 3 depends on Tasks 1-2 (dependencies and env vars must exist)
- Tasks 4-7 depend on Task 3 (utility must exist)
- Tasks 8-9 depend on Tasks 4-7 (implementation must exist to test)
- Task 10 depends on Tasks 4-7 (manual testing requires implementation)
- Task 11 depends on all previous tasks (documentation after completion)

**Critical Testing Notes:**
- **Global mock in `__tests__/setup.ts`** provides default rate limiting mocks for ALL tests
- **Existing tests require NO changes** - they automatically get mocked rate limiters
- **New rate limiting tests** override the global mock for specific scenarios
- **Unit tests only test pure functions** (`getRateLimitError`)
- **Manual testing requires real Upstash credentials** (Task 10 only)
- **Follows existing patterns** (`setupAuthMocks()` → `setupRateLimitMocks()`)
- **Mocking ensures fast, reliable, deterministic tests** without consuming API limits

**Risk Mitigation:**
- Use Upstash Redis for persistent storage (no state loss in serverless)
- Integrate rate limiting mocks into existing test infrastructure (no parallel pipeline)
- Global mock in `setup.ts` ensures all tests work without modification
- Start with Task 3 (utility) and test it thoroughly before integrating
- Add rate limiting to one action at a time (Tasks 4-7)
- Write tests immediately after each implementation
- Use conservative rate limits initially (can relax later based on data)
- Login limit of 15/15min accommodates offices with shared NAT IPs
- Free Upstash tier (10,000 requests/day) is sufficient for MVP
