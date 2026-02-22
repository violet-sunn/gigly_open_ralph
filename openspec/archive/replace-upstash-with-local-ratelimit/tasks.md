# Implementation Tasks: Replace Upstash with Local In-Memory Rate Limiting

## Task 1: Remove Upstash Dependencies

**Objective**: Remove `@upstash/ratelimit` and `@upstash/redis` packages and related environment variables.

**Implementation Steps**:
1. Run `npm uninstall @upstash/ratelimit @upstash/redis`
2. Open `.env.example` and remove the entire "Rate Limiting (Upstash Redis)" section (lines 65-86)
3. Remove the following environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Update the comment in `.env.example` if there are references to Upstash elsewhere

**Test Plan**:
- Verify `package.json` no longer lists `@upstash/ratelimit` or `@upstash/redis` in dependencies
- Verify `package-lock.json` no longer contains Upstash packages
- Run `npm list @upstash/ratelimit` and confirm "empty" or "not found"
- Verify `.env.example` contains no references to "Upstash" or "UPSTASH_REDIS"
- Run `grep -r "UPSTASH" .env.example` and confirm no matches

**Expected Outcome**: Clean removal of Upstash dependencies and configuration.

---

## Task 2: Implement Local In-Memory Rate Limiter

**Objective**: Rewrite `lib/ratelimit.ts` to use in-memory Map-based rate limiting with sliding window algorithm.

**Implementation Steps**:

1. **Create Rate Limiter Class**:
   - Create `InMemoryRateLimiter` class with constructor accepting `limit` (number) and `window` (milliseconds)
   - Use `Map<string, number[]>` to store identifier → timestamps array
   - Implement `limit(identifier: string)` method returning `Promise<{ success: boolean; reset?: number }>`

2. **Implement Sliding Window Algorithm**:
   ```typescript
   async limit(identifier: string): Promise<{ success: boolean; reset?: number }> {
     const now = Date.now()
     const windowStart = now - this.window

     // Get existing timestamps for this identifier
     let timestamps = this.store.get(identifier) || []

     // Filter out timestamps outside the window (sliding window)
     timestamps = timestamps.filter(ts => ts > windowStart)

     // Check if limit exceeded
     if (timestamps.length >= this.limit) {
       const oldestTimestamp = timestamps[0]
       const resetTime = oldestTimestamp + this.window
       return { success: false, reset: resetTime }
     }

     // Allow request and record timestamp
     timestamps.push(now)
     this.store.set(identifier, timestamps)

     return { success: true }
   }
   ```

3. **Implement Automatic Cleanup**:
   - Add `startCleanup()` method that runs `setInterval` every 5 minutes
   - Cleanup removes entries with no timestamps in the last 2 hours
   - Store cleanup interval ID to allow stopping if needed

4. **Create Rate Limiter Instances**:
   - Export `loginRateLimiter`: 15 attempts / 15 minutes (900,000 ms)
   - Export `registerRateLimiter`: 3 attempts / 1 hour (3,600,000 ms)
   - Export `applicationRateLimiter`: 10 attempts / 1 hour (3,600,000 ms)
   - Export `messageRateLimiter`: 30 attempts / 1 hour (3,600,000 ms)

5. **Keep `getRateLimitError` Helper**:
   - No changes needed to this function
   - It already formats retry-after time correctly

**Implementation Notes**:
- Use `async` methods to maintain interface compatibility (even though in-memory is synchronous)
- Add JSDoc comments explaining the sliding window algorithm
- Consider adding optional logging for debugging (console.warn in development)
- Ensure cleanup interval doesn't prevent process exit (use `unref()` if available)

**Test Plan**:
- Run `npm run test:unit` and verify all rate limiting integration tests pass
- Specifically check these test files:
  - `__tests__/integration/rate-limiting.test.ts` (14 tests)
  - `__tests__/integration/registration.test.ts` (rate limit scenarios)
  - `__tests__/integration/login.test.ts` (rate limit scenarios)
  - `__tests__/integration/application-submission.test.ts` (rate limit scenarios)
  - `__tests__/integration/messaging.test.ts` (rate limit scenarios)
- Verify test output shows all 521 tests passing
- Check for any warnings or errors related to rate limiting

**Expected Outcome**:
- `lib/ratelimit.ts` contains in-memory implementation
- All rate limiter exports maintain same interface
- All existing tests pass without modification

---

## Task 3: Update Test Mocks (If Needed)

**Objective**: Verify test mocks in `__tests__/helpers/ratelimit-mocks.ts` work with new implementation.

**Implementation Steps**:
1. Review `__tests__/helpers/ratelimit-mocks.ts`
2. Check if mocks need updates (likely no changes needed since we're maintaining interface)
3. If the mock structure matches the new implementation's return type, no changes needed
4. If changes are needed, update mock to match new `InMemoryRateLimiter` interface

**Test Plan**:
- Run `npm run test:unit`
- Verify all tests pass
- Check that mocked rate limiters return expected `{ success: boolean, reset?: number }` structure
- Verify `getRateLimitError` mock still works correctly

**Expected Outcome**: Test mocks work seamlessly with new implementation, no test failures.

---

## Task 4: Verify No Upstash References Remain

**Objective**: Ensure complete removal of Upstash-related code and documentation.

**Implementation Steps**:
1. Search codebase for Upstash references:
   ```bash
   grep -r "upstash" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.md" .
   grep -r "Upstash" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.md" .
   grep -r "@upstash" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" .
   ```
2. Check specific files:
   - `lib/ratelimit.ts` - should have no Upstash imports
   - `.env.example` - should have no UPSTASH variables
   - `package.json` - should have no @upstash dependencies
   - `openspec/project.md` - update line 423 if it mentions Upstash
3. Review and update any documentation that mentions Upstash

**Test Plan**:
- Run grep commands and verify no matches (except in this change proposal)
- Manually review `openspec/project.md` line 423 (Stack section)
- Verify documentation accurately describes new in-memory implementation

**Expected Outcome**: Zero references to Upstash in active codebase.

---

## Task 5: Manual Testing and Verification

**Objective**: Verify rate limiting works correctly in running application.

**Implementation Steps**:
1. Start development server: `npm run dev`
2. Test login rate limiting:
   - Attempt login 15 times with wrong password
   - Verify 16th attempt shows rate limit error with retry-after time
3. Test registration rate limiting:
   - Attempt registration 3 times (use different emails or expect duplicate errors)
   - Verify 4th attempt shows rate limit error
4. Test application rate limiting:
   - Login as SPECIALIST
   - Apply to 10 different gigs
   - Verify 11th application shows rate limit error
5. Test message rate limiting:
   - Send 30 messages in a gig chat
   - Verify 31st message shows rate limit error
6. Test rate limit reset:
   - Wait for time window to expire (or manually advance system time in test)
   - Verify requests are allowed again

**Test Plan**:
- Document each manual test result
- Verify error messages match expected format: "Too many [action]. Please try again in X minutes."
- Verify retry-after time is accurate
- Test that successful requests still work normally

**Expected Outcome**: All rate limiting scenarios work identically to Upstash implementation.

---

## Task 6: Run Full Test Suite

**Objective**: Ensure no regressions across entire application.

**Implementation Steps**:
1. Run unit tests: `npm run test:unit`
2. Run E2E tests: `npm run test:e2e`
3. Run full test suite: `npm test`
4. Check test coverage: `npm run test:coverage`

**Test Plan**:
- Verify all 521 tests pass
- Check for any new warnings or errors in test output
- Verify rate limiting tests specifically pass (14 integration tests)
- Review coverage report to ensure rate limiting code is covered

**Expected Outcome**:
- Test output shows "521 passed"
- No new test failures
- No degradation in test coverage
- Rate limiting integration tests all pass

---

## Task 7: Update Project Documentation

**Objective**: Update `openspec/project.md` to reflect new rate limiting implementation.

**Implementation Steps**:
1. Open `openspec/project.md`
2. Find line 423 in the "Stack" section
3. Update the rate limiting line from:
   ```
   - Rate Limiting: @upstash/ratelimit with Upstash Redis (persistent, serverless-compatible storage)
   ```
   to:
   ```
   - Rate Limiting: In-memory sliding window (Map-based, single-instance)
   ```
4. Update "Completed Changes" section (line 487+) to add this change:
   ```
   28. **replace-upstash-with-local-ratelimit** — Replaced Upstash Redis rate limiting with in-memory Map-based implementation using sliding window algorithm. Removed external dependencies (@upstash/ratelimit, @upstash/redis) and environment variables (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN). Maintains exact same rate limits (login: 15/15min, register: 3/1hr, applications: 10/1hr, messages: 30/1hr) and interface compatibility. Zero-dependency solution suitable for MVP single-instance deployment. Trade-offs: state lost on restart, not distributed across instances. All 521 tests passing.
   ```

**Test Plan**:
- Verify `openspec/project.md` accurately describes current implementation
- Check that "Stack" section is up-to-date
- Verify "Completed Changes" section includes this change

**Expected Outcome**: Project documentation reflects new in-memory rate limiting implementation.

---

## Summary Checklist

- [ ] Task 1: Upstash packages removed from package.json
- [ ] Task 1: Upstash env vars removed from .env.example
- [ ] Task 2: lib/ratelimit.ts rewritten with in-memory implementation
- [ ] Task 2: All rate limiter exports maintain same interface
- [ ] Task 3: Test mocks verified/updated
- [ ] Task 4: No Upstash references remain in codebase
- [ ] Task 5: Manual testing confirms rate limiting works
- [ ] Task 6: All 521 tests pass
- [ ] Task 7: openspec/project.md updated

**Definition of Done**:
- App runs without Upstash credentials
- Login works without "fetch failed" error
- All 521 tests pass
- No Upstash references in codebase
- Documentation updated
- Manual testing confirms identical behavior
