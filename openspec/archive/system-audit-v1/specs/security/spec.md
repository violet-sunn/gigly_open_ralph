# Security Specification Delta - System Audit

## ADDED Requirements

### Requirement: Rate Limiting Implementation Validation

The platform SHALL validate that rate limiting is correctly implemented on all critical server actions as documented.

#### Scenario: Rate limiting exists on authentication actions

**Given** the documentation claims rate limiting on login and registration
**When** the audit reviews authentication server actions
**Then** `app/actions/auth.ts` SHALL import rate limiting utilities
**And** `loginUser` action SHALL check rate limits before processing
**And** `registerUser` action SHALL check rate limits before processing
**And** rate limit thresholds SHALL match documentation (login: 15/15min, registration: 3/hour)

**Acceptance Criteria**:
- Check: `app/actions/auth.ts` imports from `@/lib/ratelimit`
- Check: Rate limit check occurs before validation
- Check: Thresholds match documented values
- Document: Any missing rate limiting or incorrect thresholds

#### Scenario: Rate limiting exists on application submission

**Given** the documentation claims rate limiting on application submission
**When** the audit reviews gig server actions
**Then** `app/actions/gig.ts` SHALL implement rate limiting on `applyToGig`
**And** rate limit threshold SHALL be 10 applications per hour per user

**Acceptance Criteria**:
- Check: `applyToGig` action uses rate limiting
- Check: Threshold is 10/hour per user
- Document: Rate limiting implementation status

#### Scenario: Rate limiting exists on message sending

**Given** the documentation claims rate limiting on message sending
**When** the audit reviews message server actions
**Then** `app/actions/message.ts` SHALL implement rate limiting on `sendMessage`
**And** rate limit threshold SHALL be 30 messages per hour per user

**Acceptance Criteria**:
- Check: `sendMessage` action uses rate limiting
- Check: Threshold is 30/hour per user
- Document: Rate limiting implementation status

#### Scenario: Rate limiting is properly mocked in tests

**Given** tests execute rate-limited actions repeatedly
**When** the audit reviews test infrastructure
**Then** `__tests__/setup.ts` or test files SHALL mock `@upstash/ratelimit`
**And** mocked rate limiter SHALL always return success in tests
**And** tests SHALL NOT make real calls to Upstash Redis

**Acceptance Criteria**:
- Check: Global mock exists for rate limiting
- Check: Tests do not require real Upstash credentials
- Check: Tests pass consistently without rate limit errors
- Document: Rate limiting test strategy

---

### Requirement: CSRF Protection Validation

The platform SHALL validate that CSRF protection is active and correctly configured.

#### Scenario: Next.js 15 built-in CSRF protection is active

**Given** the documentation claims Next.js 15 built-in CSRF protection
**When** the audit reviews the configuration
**Then** no custom CSRF token implementation SHALL exist in the codebase
**And** Next.js SHALL use Origin header matching for Server Actions
**And** `next.config.ts` SHALL NOT weaken CSRF protection with wildcards

**Acceptance Criteria**:
- Check: No custom CSRF token generation code exists
- Check: No `csrf` or `token` fields in forms (except session tokens)
- Check: `next.config.ts` does not have `serverActions.allowedOrigins` with wildcards
- Document: CSRF protection configuration status

#### Scenario: CSRF protection is tested

**Given** the documentation mentions CSRF protection
**When** the audit checks for CSRF tests
**Then** E2E tests SHALL verify CSRF protection is active
**And** tests SHALL verify cross-origin requests are blocked

**Acceptance Criteria**:
- Check: `__tests__/e2e/csrf-protection.spec.ts` exists (if documented)
- Check: Tests verify Origin header matching
- Document: CSRF test coverage

---

### Requirement: Input Sanitization Validation

The platform SHALL validate that input sanitization is correctly implemented without breaking validation or business logic.

#### Scenario: DOMPurify is installed and used

**Given** the documentation claims input sanitization with DOMPurify
**When** the audit checks the codebase
**Then** `isomorphic-dompurify` SHALL be listed in `package.json`
**And** sanitization SHALL be used in user-facing forms or server actions
**And** sanitization SHALL occur before database storage

**Acceptance Criteria**:
- Check: `package.json` includes `isomorphic-dompurify` dependency
- Check: Sanitization is imported and used in relevant files
- Document: Sanitization implementation locations

#### Scenario: Sanitization does not conflict with Zod validation

**Given** user inputs are sanitized with DOMPurify
**When** sanitized data is validated by Zod schemas
**Then** sanitization SHALL NOT remove characters required by validation
**And** legitimate inputs SHALL pass validation after sanitization
**And** validation errors SHALL be meaningful

**Acceptance Criteria**:
- Review: Data flow from input → sanitization → validation
- Check: Sanitization happens before or after validation (document order)
- Identify: Any potential conflicts (e.g., HTML in descriptions)
- Document: Sanitization vs validation interaction

#### Scenario: Sanitization is tested

**Given** input sanitization is implemented
**When** the audit checks for sanitization tests
**Then** tests SHALL verify XSS prevention
**And** tests SHALL verify legitimate content is preserved
**And** tests SHALL verify sanitized data is stored correctly

**Acceptance Criteria**:
- Check: Tests exist for sanitization logic
- Check: Tests cover XSS attack vectors
- Document: Sanitization test coverage

---

### Requirement: Password Validation Backward Compatibility

The platform SHALL validate that password strength requirements do not break existing user logins.

#### Scenario: Password validation only applies to registration

**Given** password strength validation was added in change #26
**When** the audit reviews authentication logic
**Then** password validation SHALL exist in `registerUser` action
**And** password validation SHALL NOT exist in `loginUser` action
**And** existing users with weak passwords SHALL be able to login

**Acceptance Criteria**:
- Check: `app/actions/auth.ts` has password validation in registration
- Check: Login action does not re-validate password strength
- Check: Tests verify backward compatibility
- Document: Password validation implementation

#### Scenario: Password requirements are documented

**Given** password validation is implemented
**When** the audit checks documentation
**Then** password requirements SHALL be documented
**And** requirements SHALL match implementation (8+ chars, uppercase, lowercase, number, Latin-only)

**Acceptance Criteria**:
- Check: Password requirements are documented in `project.md` or user-facing docs
- Check: Requirements match actual validation logic
- Document: Password validation documentation status

---

## MODIFIED Requirements

None - this is a validation/audit change, not a feature modification.

## REMOVED Requirements

None - this is a validation/audit change, not a feature removal.
