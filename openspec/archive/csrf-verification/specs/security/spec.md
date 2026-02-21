# Security Specification Delta: CSRF Protection

## ADDED Requirements

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
- Tests simulate both valid (same-origin) and invalid (cross-origin) requests using `page.request.post()` with spoofed Origin headers
- Tests use existing Playwright E2E infrastructure (no new test setup required)
- Documentation includes verification methodology and results
- Tests run in CI/CD pipeline to detect regressions
- All existing 493+ tests continue to pass (no regressions)

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
- Documentation includes links to Next.js 15 Server Actions security documentation

---

### Requirement: CSRF Test Coverage
The system MUST include automated tests that verify CSRF protection remains active.

#### Scenario: E2E tests verify Origin-based CSRF protection
- GIVEN E2E tests for Server Actions using existing Playwright infrastructure
- WHEN tests are executed
- THEN tests MUST verify that requests with spoofed Origin headers (e.g., "https://malicious-site.com") are rejected
- AND tests MUST verify that legitimate same-origin requests succeed
- AND tests MUST use `page.request.post()` to directly call Server Action endpoints with custom Origin headers
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
- Tests use `page.request.post()` with explicit Origin header manipulation
- Tests run in CI/CD pipeline
- Tests are documented in `TESTING.md`
- Test failure messages clearly indicate Origin mismatch/CSRF protection issues
- All existing 493+ tests continue to pass (no regressions)
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
