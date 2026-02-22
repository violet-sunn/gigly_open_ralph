# Security Specification Delta: Replace Upstash with Local In-Memory Rate Limiting

This document describes changes to the Security specification for the `replace-upstash-with-local-ratelimit` change.

## MODIFIED Requirements

### Requirement: Rate Limiting Utility
The system MUST provide a rate limiting utility that enforces request limits per identifier (IP or user ID).

#### Scenario: Rate limiter is initialized with configuration
- GIVEN a rate limit configuration with limit and window parameters
- WHEN the rate limiter is initialized
- THEN it MUST create a rate limiter instance with the specified limits
- AND it MUST use sliding window algorithm for accurate counting

#### Scenario: Rate limit allows requests within threshold
- GIVEN a rate limiter configured for 5 requests per 15 minutes
- WHEN 3 requests are made within the window
- THEN all 3 requests MUST be allowed
- AND the response MUST indicate success

#### Scenario: Rate limit blocks requests exceeding threshold
- GIVEN a rate limiter configured for 5 requests per 15 minutes
- WHEN 6 requests are made within the window
- THEN the first 5 requests MUST be allowed
- AND the 6th request MUST be blocked
- AND the response MUST indicate rate limit exceeded

#### Scenario: Rate limit resets after window expires
- GIVEN a rate limiter configured for 5 requests per 15 minutes
- WHEN 5 requests are made and the window expires
- THEN subsequent requests MUST be allowed again
- AND the counter MUST reset to 0

#### Scenario: Rate limiter provides retry-after information
- GIVEN a request that exceeds the rate limit
- WHEN the rate limiter blocks the request
- THEN it MUST return the time (in milliseconds) until the next request is allowed
- AND this information MUST be included in the error response

#### Scenario: Rate limiter automatically cleans up old entries
- GIVEN rate limiters running over time with many unique identifiers
- WHEN entries have no timestamps in the last 2 hours
- THEN the rate limiter MUST automatically remove these entries
- AND this MUST prevent unbounded memory growth
- AND cleanup MUST run periodically (every 5 minutes)

**Acceptance Criteria:**
- Rate limiting utility exported from `lib/ratelimit.ts`
- ~~Uses `@upstash/ratelimit` library with `@upstash/redis` for persistent storage~~
- ~~Upstash Redis client configured via environment variables (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)~~
- **Uses in-memory Map data structure for storage (Map<string, number[]>)**
- **No external dependencies or environment variables required**
- Sliding window algorithm for accurate rate limiting (timestamp array filtering)
- Returns `{ success: boolean, reset?: number }` structure
- Supports both IP-based and user-based identifiers
- Configuration via constructor parameters (limit: number, window: milliseconds)
- **Automatic cleanup mechanism runs every 5 minutes to prevent memory leaks**
- **Cleanup removes entries with no activity in the last 2 hours**
- ~~Serverless-compatible (no state loss between function invocations)~~
- **Single-instance compatible (state is lost on server restart - acceptable for MVP)**
- **Not distributed across multiple instances (acceptable for MVP single-instance deployment)**

**Implementation Notes:**
- The in-memory implementation is explicitly designed for MVP single-instance deployment
- State loss on restart is an accepted trade-off for zero-dependency operation
- Future scaling to multiple instances will require migration to persistent storage (self-hosted Redis or PostgreSQL)
- The interface (`{ success: boolean, reset?: number }`) is maintained for easy future migration

---

## REMOVED Requirements

None. All rate limiting requirements remain in place with identical behavior from the user perspective.

---

## ADDED Requirements

### Requirement: Rate Limiter Memory Management
The in-memory rate limiter MUST implement automatic cleanup to prevent memory leaks.

#### Scenario: Cleanup removes expired entries
- GIVEN a rate limiter that has processed requests from 1000 unique IP addresses
- WHEN 2 hours pass with no activity from 900 of those IPs
- THEN the cleanup mechanism MUST remove the 900 inactive entries
- AND only the 100 active entries MUST remain in memory

#### Scenario: Cleanup runs periodically
- GIVEN a rate limiter running continuously
- WHEN 5 minutes elapse
- THEN the cleanup mechanism MUST execute automatically
- AND it MUST scan all entries for expiration
- AND it MUST remove entries with no timestamps in the last 2 hours

#### Scenario: Cleanup does not affect active entries
- GIVEN a rate limiter with both active and expired entries
- WHEN cleanup runs
- THEN active entries (with recent timestamps) MUST NOT be removed
- AND rate limiting for active identifiers MUST continue to work correctly

**Acceptance Criteria:**
- Cleanup interval: 5 minutes (300,000 milliseconds)
- Expiration threshold: 2 hours (7,200,000 milliseconds)
- Cleanup uses `setInterval` to run periodically
- Cleanup iterates through Map entries and removes expired ones
- Cleanup does not block request processing (runs asynchronously)
- Cleanup interval is started when rate limiter is instantiated
- Memory usage remains bounded even with high traffic and many unique identifiers

---

## Notes on Behavioral Equivalence

The in-memory implementation maintains **identical behavior** from the user and application perspective:

1. **Same Rate Limits**: All thresholds unchanged (15/15min, 3/1hr, 10/1hr, 30/1hr)
2. **Same Interface**: Return type `{ success: boolean, reset?: number }` unchanged
3. **Same Error Messages**: `getRateLimitError` helper unchanged
4. **Same Algorithm**: Sliding window with timestamp tracking
5. **Same Identifiers**: IP-based for auth, user-based for applications/messages

The only differences are internal implementation details:
- Storage: Upstash Redis → In-memory Map
- Persistence: Persistent → Ephemeral (state lost on restart)
- Distribution: Multi-instance → Single-instance only
- Dependencies: External packages → Zero dependencies

These differences are **explicitly accepted trade-offs** for MVP simplicity and zero-dependency operation.
