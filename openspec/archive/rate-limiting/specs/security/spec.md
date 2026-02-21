# Security Specification: Rate Limiting (DELTA)

## ADDED Requirements

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
- THEN it MUST return the time (in seconds) until the next request is allowed
- AND this information MUST be included in the error response

**Acceptance Criteria:**
- Rate limiting utility exported from `lib/ratelimit.ts`
- Uses `@upstash/ratelimit` library with `@upstash/redis` for persistent storage
- Upstash Redis client configured via environment variables (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- Sliding window algorithm for accurate rate limiting
- Returns `{ success: boolean, reset?: number }` structure
- Supports both IP-based and user-based identifiers
- Configuration via constants for easy adjustment
- Serverless-compatible (no state loss between function invocations)

---

### Requirement: Login Rate Limiting
The system MUST rate limit login attempts to prevent brute force attacks.

#### Scenario: Login allows legitimate retry attempts
- GIVEN a user with incorrect password
- WHEN they attempt login 10 times within 15 minutes
- THEN all 10 attempts MUST be processed
- AND appropriate "Invalid email or password" errors MUST be returned

#### Scenario: Login blocks excessive attempts
- GIVEN a user or IP making login attempts
- WHEN they exceed 15 attempts within 15 minutes
- THEN subsequent attempts MUST be blocked
- AND error message MUST state "Too many login attempts. Please try again in X minutes."
- AND the error MUST include the retry-after time

#### Scenario: Login rate limit accommodates shared office IPs
- GIVEN multiple users in an office sharing a NAT IP address
- WHEN 15 different users attempt login from the same IP within 15 minutes
- THEN all 15 attempts MUST be allowed
- AND the 16th attempt MUST be blocked
- AND this prevents blocking entire offices while still protecting against brute force

#### Scenario: Login rate limit is IP-based
- GIVEN multiple login attempts from the same IP address
- WHEN the rate limit is exceeded
- THEN all requests from that IP MUST be blocked
- AND requests from different IPs MUST NOT be affected

#### Scenario: Successful login does not bypass rate limit
- GIVEN a user who has made 4 failed login attempts
- WHEN they make a 5th successful login
- THEN the login MUST succeed
- AND the rate limit counter MUST still increment
- AND they MUST still be rate limited if they logout and try again immediately

**Acceptance Criteria:**
- Rate limit: 15 attempts per 15 minutes
- Identifier: IP address (from request headers)
- Rate limit check happens before password validation
- Clear error messages with retry-after time
- Rate limit applies to both successful and failed attempts
- Threshold accommodates offices with shared NAT IPs (multiple legitimate users)

---

### Requirement: Registration Rate Limiting
The system MUST rate limit registration attempts to prevent bot account creation.

#### Scenario: Registration allows legitimate attempts
- GIVEN a new user attempting to register
- WHEN they submit the registration form twice (e.g., fixing validation errors)
- THEN both attempts MUST be processed
- AND appropriate validation errors MUST be returned if applicable

#### Scenario: Registration blocks excessive attempts
- GIVEN an IP address making registration attempts
- WHEN they exceed 3 attempts within 1 hour
- THEN subsequent attempts MUST be blocked
- AND error message MUST state "Too many registration attempts. Please try again in X minutes."
- AND the error MUST include the retry-after time

#### Scenario: Registration rate limit is IP-based
- GIVEN multiple registration attempts from the same IP address
- WHEN the rate limit is exceeded
- THEN all requests from that IP MUST be blocked
- AND requests from different IPs MUST NOT be affected

#### Scenario: Successful registration counts toward rate limit
- GIVEN a user who successfully registers
- WHEN they attempt to register another account immediately
- THEN the second attempt MUST be rate limited
- AND they MUST wait for the window to expire

**Acceptance Criteria:**
- Rate limit: 3 attempts per 1 hour
- Identifier: IP address (from request headers)
- Rate limit check happens before validation
- Clear error messages with retry-after time
- Successful registrations count toward the limit

---

### Requirement: Application Submission Rate Limiting
The system MUST rate limit application submissions to prevent spam applications.

#### Scenario: Application allows legitimate submissions
- GIVEN a SPECIALIST browsing open gigs
- WHEN they apply to 5 different gigs within 1 hour
- THEN all 5 applications MUST be processed successfully
- AND they MUST be able to continue applying

#### Scenario: Application blocks excessive submissions
- GIVEN a SPECIALIST submitting applications
- WHEN they exceed 10 applications within 1 hour
- THEN subsequent applications MUST be blocked
- AND error message MUST state "You've submitted too many applications. Please try again in X minutes."
- AND the error MUST include the retry-after time

#### Scenario: Application rate limit is user-based
- GIVEN a SPECIALIST with user ID "user-123"
- WHEN they exceed the rate limit
- THEN only their applications MUST be blocked
- AND other specialists MUST NOT be affected

#### Scenario: Failed applications count toward rate limit
- GIVEN a SPECIALIST who attempts to apply to a closed gig
- WHEN the application fails due to validation
- THEN the attempt MUST still count toward the rate limit
- AND they MUST be rate limited after 10 total attempts (successful or failed)

#### Scenario: Rate limit resets allow continued activity
- GIVEN a SPECIALIST who hit the rate limit
- WHEN 1 hour passes
- THEN they MUST be able to submit applications again
- AND the counter MUST reset to 0

**Acceptance Criteria:**
- Rate limit: 10 applications per 1 hour
- Identifier: User ID (from session)
- Rate limit check happens after authentication but before validation
- Clear error messages with retry-after time
- Both successful and failed attempts count toward limit

---

### Requirement: Message Sending Rate Limiting
The system MUST rate limit message sending to prevent flooding and harassment.

#### Scenario: Messaging allows normal conversations
- GIVEN a CLIENT and SPECIALIST communicating about a gig
- WHEN they exchange 15 messages within 1 hour
- THEN all messages MUST be sent successfully
- AND they MUST be able to continue messaging

#### Scenario: Messaging blocks excessive sending
- GIVEN a user sending messages
- WHEN they exceed 30 messages within 1 hour
- THEN subsequent messages MUST be blocked
- AND error message MUST state "You're sending messages too quickly. Please try again in X minutes."
- AND the error MUST include the retry-after time

#### Scenario: Message rate limit is user-based
- GIVEN a user with user ID "user-456"
- WHEN they exceed the rate limit
- THEN only their messages MUST be blocked
- AND other users MUST NOT be affected
- AND they MUST still be able to receive messages

#### Scenario: Failed messages count toward rate limit
- GIVEN a user attempting to send empty messages
- WHEN the messages fail validation
- THEN the attempts MUST still count toward the rate limit
- AND they MUST be rate limited after 30 total attempts

#### Scenario: Rate limit applies per user, not per gig
- GIVEN a user messaging on multiple gigs
- WHEN they send 20 messages on gig A and 15 messages on gig B within 1 hour
- THEN the total count MUST be 35 messages
- AND they MUST be rate limited (exceeds 30 message limit)

**Acceptance Criteria:**
- Rate limit: 30 messages per 1 hour
- Identifier: User ID (from session)
- Rate limit check happens after authentication but before validation
- Clear error messages with retry-after time
- Rate limit is global per user, not per gig
- Both successful and failed attempts count toward limit

---

### Requirement: Rate Limit Error Handling
The system MUST provide clear, actionable error messages when rate limits are exceeded.

#### Scenario: Error message includes retry-after time
- GIVEN a user who exceeds a rate limit
- WHEN they receive the error response
- THEN the error message MUST include the time until they can retry
- AND the time MUST be formatted in human-readable units (minutes or seconds)

#### Scenario: Error message is user-friendly
- GIVEN a rate limit error
- WHEN the error is displayed to the user
- THEN it MUST NOT expose technical implementation details
- AND it MUST explain what action was blocked
- AND it MUST tell the user when they can try again

#### Scenario: Different endpoints have specific error messages
- GIVEN rate limit errors from different endpoints
- WHEN the errors are returned
- THEN login errors MUST mention "login attempts"
- AND registration errors MUST mention "registration attempts"
- AND application errors MUST mention "applications"
- AND message errors MUST mention "messages"

**Acceptance Criteria:**
- Error messages include action-specific context
- Retry-after time is human-readable (e.g., "5 minutes", "30 seconds")
- No technical jargon or implementation details exposed
- Consistent error format across all rate-limited endpoints

---

### Requirement: Rate Limiting Test Coverage
The system MUST include comprehensive tests verifying rate limits work correctly.

#### Scenario: Unit tests verify rate limiter utility
- GIVEN unit tests for the rate limiting utility
- WHEN tests are executed
- THEN they MUST verify:
  - Requests within limit are allowed
  - Requests exceeding limit are blocked
  - Rate limit resets after window expires
  - Retry-after time is calculated correctly

#### Scenario: Integration tests verify endpoint rate limits
- GIVEN integration tests for each rate-limited server action
- WHEN tests are executed
- THEN they MUST verify:
  - Login rate limit (15 attempts / 15 min)
  - Registration rate limit (3 attempts / 1 hour)
  - Application rate limit (10 attempts / 1 hour)
  - Message rate limit (30 messages / 1 hour)

#### Scenario: Tests verify error messages
- GIVEN integration tests for rate-limited endpoints
- WHEN rate limits are exceeded
- THEN tests MUST verify:
  - Error message contains retry-after information
  - Error message is user-friendly
  - Error message is action-specific

#### Scenario: Tests verify identifier isolation
- GIVEN tests with multiple users or IPs
- WHEN one identifier exceeds the rate limit
- THEN tests MUST verify:
  - Only that identifier is blocked
  - Other identifiers are not affected
  - Rate limits are properly isolated

**Acceptance Criteria:**
- Unit tests for rate limiting utility (minimum 6 tests)
- Integration tests for each rate-limited action (minimum 4 tests per action)
- Tests verify both success and failure cases
- Tests verify error message content and format
- Tests verify identifier isolation (IP vs user ID)
- All tests MUST pass before deployment
