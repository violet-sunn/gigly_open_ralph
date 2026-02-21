# Security Specification: Input Sanitization

## Requirements

### Requirement: Sanitization Utility Function
The system MUST provide a `sanitizeInput` utility function that removes malicious HTML/JavaScript while preserving safe text formatting.

#### Scenario: Script tags are removed
- GIVEN input text containing `<script>alert('XSS')</script>`
- WHEN `sanitizeInput` is called
- THEN the output MUST NOT contain any script tags
- AND the output MUST be safe to render in HTML context

#### Scenario: Event handlers are removed
- GIVEN input text containing `<img src=x onerror="alert('XSS')">`
- WHEN `sanitizeInput` is called
- THEN the output MUST NOT contain any event handler attributes
- AND the output MUST be safe to render

#### Scenario: Dangerous attributes are removed
- GIVEN input text containing `<a href="javascript:alert('XSS')">click</a>`
- WHEN `sanitizeInput` is called
- THEN the output MUST NOT contain javascript: protocol URLs
- AND the output MUST be safe to render

#### Scenario: Line breaks are preserved as plain text
- GIVEN input text containing "Line 1\nLine 2\nLine 3"
- WHEN `sanitizeInput` is called
- THEN the output MUST preserve line breaks as plain text `\n` characters (NOT `<br>` tags)
- AND the text content MUST remain readable
- AND UI rendering MUST use CSS `white-space: pre-wrap` to display line breaks

#### Scenario: Safe text is unchanged
- GIVEN input text containing only plain text "Hello, world!"
- WHEN `sanitizeInput` is called
- THEN the output MUST be identical to the input
- AND no characters MUST be escaped or modified

#### Scenario: Empty or whitespace-only input
- GIVEN input text that is empty string or only whitespace
- WHEN `sanitizeInput` is called
- THEN the output MUST be an empty string
- AND no errors MUST be thrown

**Acceptance Criteria:**
- `sanitizeInput` is exported from `lib/sanitize.ts`
- Uses `isomorphic-dompurify` library for sanitization
- Configuration allows basic text formatting but blocks all scripts
- Returns string type (never null or undefined)
- Handles edge cases: empty strings, very long strings (up to 2000 chars)
- Performance: < 10ms for 2000-character input

---

### Requirement: Gig Creation Sanitization
The system MUST sanitize all text fields in `createGig` server action before database storage.

#### Scenario: Gig title is sanitized
- GIVEN a CLIENT submits gig with title containing `<script>alert('XSS')</script>`
- WHEN `createGig` is called
- THEN the stored title MUST have script tags removed
- AND the gig MUST be created successfully
- AND validation rules (length, required) MUST still apply after sanitization

#### Scenario: Gig description is sanitized
- GIVEN a CLIENT submits gig with description containing malicious HTML
- WHEN `createGig` is called
- THEN the stored description MUST be sanitized
- AND line breaks MUST be preserved as plain text `\n` characters

#### Scenario: Acceptance criteria is sanitized
- GIVEN a CLIENT submits acceptanceCriteria with XSS payload
- WHEN `createGig` is called
- THEN the stored acceptanceCriteria MUST be sanitized
- AND minimum length validation (50 chars) MUST apply to sanitized content

#### Scenario: Optional fields are sanitized
- GIVEN a CLIENT submits goal, deliverables, constraints with malicious content
- WHEN `createGig` is called
- THEN all three optional fields MUST be sanitized
- AND empty fields MUST remain empty strings

#### Scenario: Sanitization happens before validation
- GIVEN a CLIENT submits title with `<script>` tags that would make it too short after sanitization
- WHEN `createGig` is called
- THEN sanitization MUST happen first
- AND validation MUST check the sanitized length
- AND appropriate error MUST be returned if sanitized content is too short

**Acceptance Criteria:**
- All text fields sanitized: title, description, acceptanceCriteria, goal, deliverables, constraints
- Sanitization occurs before validation checks
- Trimming happens after sanitization
- Existing validation rules still enforced on sanitized content
- No breaking changes to API contract

---

### Requirement: Application Submission Sanitization
The system MUST sanitize all text fields in `applyToGig` server action before database storage.

#### Scenario: Technical approach is sanitized
- GIVEN a SPECIALIST submits application with approach containing XSS payload
- WHEN `applyToGig` is called
- THEN the stored approach MUST be sanitized
- AND minimum length validation (100 chars) MUST apply to sanitized content

#### Scenario: Clarifying questions are sanitized
- GIVEN a SPECIALIST submits questions with malicious HTML
- WHEN `applyToGig` is called
- THEN the stored questions MUST be sanitized
- AND minimum length validation (50 chars) MUST apply to sanitized content

#### Scenario: Estimated effort is sanitized
- GIVEN a SPECIALIST submits estimatedEffort with XSS payload
- WHEN `applyToGig` is called
- THEN the stored estimatedEffort MUST be sanitized
- AND empty optional field MUST remain empty string

**Acceptance Criteria:**
- All text fields sanitized: approach, questions, estimatedEffort
- Sanitization occurs before validation checks
- Existing validation rules still enforced on sanitized content
- coverLetter field (legacy) also sanitized if present

---

### Requirement: Message Content Sanitization
The system MUST sanitize message content in `sendMessage` server action before database storage.

#### Scenario: Message content is sanitized
- GIVEN an authorized user sends message with XSS payload
- WHEN `sendMessage` is called
- THEN the stored content MUST be sanitized
- AND line breaks MUST be preserved as plain text `\n` characters for readability

#### Scenario: Empty message after sanitization
- GIVEN a user sends message containing only `<script></script>` tags
- WHEN `sendMessage` is called
- THEN after sanitization the content MUST be empty or whitespace
- AND validation MUST return error "Message content is required."

#### Scenario: Message length validation on sanitized content
- GIVEN a user sends message with 1900 chars of text + 200 chars of HTML tags
- WHEN `sendMessage` is called
- THEN sanitization MUST happen first
- AND length validation (2000 chars max) MUST check sanitized content
- AND message MUST be accepted if sanitized content <= 2000 chars

**Acceptance Criteria:**
- Message content field sanitized before storage
- Sanitization occurs before validation checks
- Empty content after sanitization triggers validation error
- Maximum length (2000 chars) checked on sanitized content

---

### Requirement: Profile Update Sanitization
The system MUST sanitize all text fields in `updateProfile` server action before database storage.

#### Scenario: CLIENT company name is sanitized
- GIVEN a CLIENT updates profile with companyName containing XSS payload
- WHEN `updateProfile` is called
- THEN the stored companyName MUST be sanitized
- AND required field validation MUST still apply

#### Scenario: SPECIALIST tech stack is sanitized
- GIVEN a SPECIALIST updates profile with techStack containing malicious HTML
- WHEN `updateProfile` is called
- THEN the stored techStack MUST be sanitized
- AND line breaks/commas MUST be preserved as plain text for readability

#### Scenario: Profile bio is sanitized
- GIVEN a user updates profile with bio containing XSS payload
- WHEN `updateProfile` is called
- THEN the stored bio MUST be sanitized
- AND line breaks MUST be preserved as plain text `\n` characters

**Acceptance Criteria:**
- All text fields sanitized: companyName, inn, techStack, bio, and any other text fields
- Sanitization occurs before validation checks
- Existing validation rules still enforced on sanitized content
- Role-specific fields handled correctly

---

### Requirement: XSS Test Coverage
The system MUST include comprehensive tests that verify XSS payloads are neutralized.

#### Scenario: Common XSS payloads are blocked
- GIVEN a test suite with common XSS attack vectors
- WHEN tests are executed
- THEN all of the following MUST be sanitized:
  - `<script>alert('XSS')</script>`
  - `<img src=x onerror="alert('XSS')">`
  - `<svg onload="alert('XSS')">`
  - `<iframe src="javascript:alert('XSS')"></iframe>`
  - `<a href="javascript:alert('XSS')">click</a>`
  - `<input onfocus="alert('XSS')" autofocus>`
  - `<body onload="alert('XSS')">`
  - `<div style="background:url('javascript:alert(1)')">`

#### Scenario: Sanitization integration tests
- GIVEN integration tests for each server action
- WHEN tests submit forms with XSS payloads
- THEN the stored data MUST NOT contain executable scripts
- AND the data MUST be safe to display

**Acceptance Criteria:**
- Unit tests for `sanitizeInput` utility (minimum 8 XSS payload tests)
- Integration tests for each server action with XSS payloads
- Tests verify both storage and display safety
- All tests MUST pass before deployment

---

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

---

### Requirement: CSRF Protection Verification
The system MUST verify that Next.js 15's built-in CSRF protection for Server Actions is enabled and functioning correctly.

#### Scenario: Server Actions reject cross-origin requests
- GIVEN a Server Action endpoint (e.g., `createGig`, `login`, `applyToGig`)
- WHEN a POST request is made with an Origin header that does not match the Host header (simulating a cross-origin attack)
- THEN the request MUST be rejected by Next.js with a 403 Forbidden or similar error
- AND the response MUST indicate an origin mismatch
- AND the Server Action handler MUST NOT be executed

#### Scenario: Server Actions accept same-origin requests
- GIVEN a Server Action endpoint
- WHEN a POST request is made with an Origin header that matches the Host header (legitimate same-origin request)
- THEN the request MUST be accepted
- AND the Server Action handler MUST execute normally
- AND the response MUST be successful (if validation passes)

#### Scenario: CSRF protection works across all Server Actions
- GIVEN all Server Actions in the application (auth, gig, application, message, profile, admin)
- WHEN each Server Action is tested for CSRF protection
- THEN all Server Actions MUST be protected by Next.js CSRF mechanism
- AND no Server Action MUST be vulnerable to CSRF attacks

#### Scenario: Origin header matching prevents CSRF attacks
- GIVEN a malicious website attempting to trigger a Server Action
- WHEN the malicious site sends a request with Origin header "https://malicious-site.com"
- THEN Next.js MUST compare the Origin header to the Host header
- AND the request MUST be rejected due to origin mismatch
- AND this MUST prevent CSRF attacks from external sites

#### Scenario: Missing Origin header is handled securely
- GIVEN a Server Action endpoint
- WHEN a request is made without an Origin header
- THEN Next.js MUST handle it securely (reject or apply fallback validation)
- AND the Server Action MUST NOT be vulnerable to CSRF
- AND legitimate browser requests MUST still work (browsers include Origin for POST)

**Acceptance Criteria:**
- Verification tests demonstrate Origin-based CSRF protection is active
- Tests cover at least 3 different Server Actions (auth, gig operations, messaging)
- Tests simulate both valid (same-origin) and invalid (cross-origin) requests using route interception with spoofed Origin headers
- Tests use existing Playwright E2E infrastructure (no new test setup required)
- Documentation includes verification methodology and results
- Tests run in CI/CD pipeline to detect regressions
- All existing tests continue to pass (no regressions)

---

### Requirement: CSRF Configuration Documentation
The system MUST document Next.js 15 CSRF protection configuration and requirements.

#### Scenario: Default configuration enables Origin-based CSRF protection
- GIVEN a Next.js 15 application with default configuration
- WHEN the application is deployed
- THEN Origin-based CSRF protection MUST be enabled by default for all Server Actions
- AND no additional configuration MUST be required
- AND this default behavior MUST be documented

#### Scenario: serverActions.allowedOrigins configuration is secure
- GIVEN the `next.config.ts` (or `next.config.js`) file
- WHEN the configuration is reviewed
- THEN if `serverActions.allowedOrigins` is present, it MUST NOT contain:
  - Wildcard domains (e.g., `*`, `*.example.com`)
  - Untrusted third-party domains
  - Development-only origins in production builds
- AND the absence of this configuration MUST be the preferred default
- AND any use of `allowedOrigins` MUST be explicitly documented and justified

#### Scenario: CSRF protection mechanism is documented
- GIVEN the security documentation
- WHEN developers or auditors review security measures
- THEN the documentation MUST explain:
  - How Next.js 15 implements CSRF protection for Server Actions (Origin header matching)
  - That Next.js compares the Origin header to the Host header
  - That no CSRF tokens are used (Origin-based protection only)
  - Why no custom implementation is needed
  - How to verify CSRF protection is working
- AND the documentation MUST be accessible in the project repository

#### Scenario: Security specification includes CSRF requirements
- GIVEN the `openspec/specs/security/spec.md` file
- WHEN the file is reviewed
- THEN it MUST include CSRF protection requirements
- AND it MUST include verification scenarios
- AND it MUST include acceptance criteria for CSRF protection

**Acceptance Criteria:**
- Security specification updated with CSRF requirements
- Project documentation includes CSRF protection section explaining Origin-based protection
- Configuration requirements documented (specifically `serverActions.allowedOrigins` risks)
- Verification steps documented for future audits
- Documentation clarifies that no CSRF tokens are used (Origin header matching only)

---

### Requirement: CSRF Test Coverage
The system MUST include automated tests that verify CSRF protection remains active.

#### Scenario: E2E tests verify Origin-based CSRF protection
- GIVEN E2E tests for Server Actions using existing Playwright infrastructure
- WHEN tests are executed
- THEN tests MUST verify that requests with spoofed Origin headers (e.g., "https://malicious-site.com") are rejected
- AND tests MUST verify that legitimate same-origin requests succeed
- AND tests MUST use route interception to modify Origin headers
- AND tests MUST cover multiple Server Actions (login, createGig, sendMessage)

#### Scenario: Tests detect CSRF protection failures
- GIVEN a scenario where CSRF protection is disabled (test simulation)
- WHEN CSRF verification tests are executed
- THEN tests MUST fail
- AND test output MUST clearly indicate CSRF protection is missing
- AND this MUST prevent deployment of vulnerable code

#### Scenario: Tests run in CI/CD pipeline
- GIVEN the CI/CD pipeline configuration
- WHEN code is pushed or pull requests are created
- THEN CSRF verification tests MUST run automatically
- AND pipeline MUST fail if CSRF tests fail
- AND this MUST prevent merging vulnerable code

#### Scenario: Tests are maintainable and documented
- GIVEN the CSRF test suite
- WHEN developers review or modify tests
- THEN tests MUST have clear comments explaining what they verify
- AND tests MUST be easy to understand and maintain
- AND test documentation MUST explain how to add CSRF tests for new Server Actions

**Acceptance Criteria:**
- Minimum 6 E2E tests verifying Origin-based CSRF protection (2 per Server Action × 3 Server Actions)
- Tests verify both rejection (spoofed Origin) and acceptance (same-origin) cases
- Tests use existing Playwright infrastructure (no new test setup/config files)
- Tests use route interception with explicit Origin header manipulation
- Tests run in CI/CD pipeline
- Tests are documented in `TESTING.md`
- Test failure messages clearly indicate Origin mismatch/CSRF protection issues
- All existing tests continue to pass (no regressions)
- Tests use realistic attack scenarios simulating cross-origin requests

---

### Requirement: CSRF Protection Monitoring
The system MUST provide a way to monitor that CSRF protection remains active in production.

#### Scenario: Configuration review checklist includes CSRF
- GIVEN a deployment or configuration change
- WHEN the change is reviewed
- THEN the review checklist MUST include CSRF protection verification
- AND reviewers MUST confirm no configuration disables CSRF
- AND this MUST be part of the standard review process

#### Scenario: Security audit includes CSRF verification
- GIVEN a security audit or penetration test
- WHEN the audit is conducted
- THEN CSRF protection MUST be explicitly tested
- AND audit documentation MUST include CSRF test results
- AND any CSRF vulnerabilities MUST be treated as critical

#### Scenario: Next.js version updates are tested for CSRF
- GIVEN a Next.js version update
- WHEN the update is tested before deployment
- THEN CSRF verification tests MUST be run
- AND tests MUST pass before the update is deployed
- AND this MUST prevent deploying versions with broken CSRF protection

**Acceptance Criteria:**
- Deployment checklist includes CSRF verification step
- Security audit procedures include CSRF testing
- Version update process includes CSRF test verification
- Documentation includes monitoring and verification procedures
- Team is trained on CSRF protection importance and verification
