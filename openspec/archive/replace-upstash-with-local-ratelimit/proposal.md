# Change Proposal: Replace Upstash with Local In-Memory Rate Limiting

## Change Name
`replace-upstash-with-local-ratelimit`

## Problem Statement

The current rate limiting implementation relies on `@upstash/ratelimit` and `@upstash/redis`, which requires:
- External SaaS service registration (Upstash account)
- API credentials (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- Network connectivity to foreign infrastructure
- Payment setup for production usage

For a Russian-market B2B startup (Gigly), this creates unacceptable operational risks:
1. **Payment Blocks**: International payment restrictions may prevent service access
2. **Service Denial**: Foreign SaaS providers may deny service to Russian entities
3. **Unnecessary Complexity**: MVP requires zero-dependency, out-of-the-box functionality
4. **Developer Friction**: New developers must register for external services before running the app locally

The current implementation causes immediate developer pain: the app crashes on login with "fetch failed" error when Upstash credentials are missing or invalid.

## Proposed Solution

Replace the Upstash-based rate limiting with a lightweight, in-memory implementation using Node.js built-in `Map` data structure. The solution will:

1. **Remove External Dependencies**: Eliminate `@upstash/ratelimit` and `@upstash/redis` packages
2. **Implement Sliding Window Algorithm**: Use in-memory Map to track request timestamps per identifier
3. **Maintain Interface Compatibility**: Keep the same return signature `{ success: boolean, reset?: number }`
4. **Preserve Exact Thresholds**: No changes to documented rate limits
5. **Automatic Cleanup**: Implement periodic cleanup to prevent memory leaks

## Constraints & Rules

### MUST Requirements
- **Zero External Services**: No Redis, no SaaS, no API keys required for rate limiting
- **Exact Threshold Preservation**:
  - Login: 15 attempts / 15 minutes (IP-based)
  - Register: 3 attempts / 1 hour (IP-based)
  - Applications: 10 applications / 1 hour (user-based)
  - Messages: 30 messages / 1 hour (user-based)
- **Interface Compatibility**: Return `{ success: boolean, reset?: number }` to avoid rewriting actions
- **Test Integrity**: All 521 tests MUST pass after implementation
- **No Behavioral Changes**: Rate limiting behavior MUST remain identical from user perspective

### Trade-offs Accepted for MVP
- **State Loss on Restart**: In-memory state is lost when the server restarts (acceptable for MVP)
- **Single-Instance Only**: Does not work across multiple server instances (acceptable for MVP deployment)
- **No Persistence**: Rate limit counters reset on deployment (acceptable for MVP)

These trade-offs are explicitly acceptable because:
1. MVP runs on single instance (no horizontal scaling yet)
2. Occasional rate limit resets on deployment are not critical security issues
3. Simplicity and zero-dependency operation outweigh persistence benefits for MVP validation phase

### Future Migration Path
When scaling beyond MVP (multiple instances, high availability), the implementation can be swapped for:
- Redis (self-hosted, not SaaS)
- PostgreSQL-based rate limiting (using existing database)
- Distributed cache solution

The interface compatibility ensures this migration requires minimal code changes.

## Scope

### In Scope
- Remove `@upstash/ratelimit` and `@upstash/redis` dependencies
- Implement `lib/ratelimit.ts` with in-memory Map-based rate limiting
- Maintain exact same rate limiter exports (loginRateLimiter, registerRateLimiter, etc.)
- Update `.env.example` to remove Upstash-related variables
- Update test mocks in `__tests__/helpers/ratelimit-mocks.ts` if needed
- Verify all 521 tests pass

### Out of Scope
- Changing rate limit thresholds
- Modifying server actions that use rate limiters
- Adding persistence or distributed rate limiting
- Performance optimization beyond basic cleanup
- Monitoring or observability features

## Success Criteria

1. **Functional**: App runs without Upstash credentials, login works without "fetch failed" error
2. **Test Coverage**: All 521 existing tests pass without modification
3. **Interface Compatibility**: No changes required to `app/actions/auth.ts`, `app/actions/gig.ts`, `app/actions/message.ts`
4. **Documentation**: `.env.example` updated, no Upstash references remain
5. **Behavioral Equivalence**: Rate limiting behavior identical to Upstash implementation

## Implementation Approach

### Algorithm: Sliding Window with Timestamp Array
Each rate limiter maintains a Map where:
- **Key**: Identifier (IP address or user ID)
- **Value**: Array of timestamps representing request times

On each request:
1. Get timestamp array for identifier
2. Filter out timestamps older than the time window
3. If remaining count < limit: allow request, add current timestamp
4. If remaining count >= limit: deny request, return reset time
5. Periodically clean up expired entries to prevent memory leaks

### Memory Management
- Automatic cleanup runs every 5 minutes
- Removes entries with no timestamps in the last 2 hours
- Prevents unbounded memory growth from unique IPs/users

### Error Handling
- Graceful degradation: if rate limiter throws, allow request (fail open)
- Logging for debugging (console.warn in development)

## Risk Assessment

### Low Risk
- **Interface Compatibility**: Existing return signature maintained
- **Test Coverage**: Comprehensive test suite catches regressions
- **Rollback**: Easy to revert by reinstalling Upstash packages

### Medium Risk
- **Memory Leaks**: Mitigated by periodic cleanup mechanism
- **Concurrency**: Node.js single-threaded model prevents race conditions

### Acceptable Trade-offs
- **State Loss**: Explicitly accepted for MVP simplicity
- **Single Instance**: Explicitly accepted for MVP deployment model

## Alternatives Considered

### Alternative 1: Keep Upstash, Add Fallback
- **Pros**: Maintains persistence option
- **Cons**: Adds complexity, still requires credentials for production, doesn't solve developer friction
- **Rejected**: Violates "zero external services" constraint

### Alternative 2: Use PostgreSQL for Rate Limiting
- **Pros**: Persistent, uses existing database
- **Cons**: Database queries for every rate-limited action, performance overhead, schema complexity
- **Rejected**: Over-engineering for MVP, performance concerns

### Alternative 3: Use lru-cache Package
- **Pros**: Battle-tested library, automatic eviction
- **Cons**: Adds dependency, doesn't provide sliding window out-of-box
- **Rejected**: Prefer zero-dependency solution for MVP

## References

- Current implementation: `lib/ratelimit.ts`
- Rate limit specs: `openspec/specs/security/spec.md` (lines 217-510)
- Test mocks: `__tests__/helpers/ratelimit-mocks.ts`
- Actions using rate limiting: `app/actions/auth.ts`, `app/actions/gig.ts`, `app/actions/message.ts`
