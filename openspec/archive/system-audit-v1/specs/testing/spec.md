# Testing Specification Delta - System Audit

## ADDED Requirements

### Requirement: Test Infrastructure Integrity Validation

The platform SHALL validate that the test infrastructure remains consistent and non-duplicated after the QA & Polish phase.

#### Scenario: No duplicate test configurations exist

**Given** the project has established test infrastructure (Vitest + Playwright)
**When** the audit scans for test configuration files
**Then** exactly one `vitest.config.ts` SHALL exist
**And** exactly one `playwright.config.ts` SHALL exist
**And** no `jest.config.js` or other conflicting test configs SHALL exist

**Acceptance Criteria**:
- Run: `find . -name "vitest.config.*" -o -name "playwright.config.*" -o -name "jest.config.*"`
- Assert: Only 2 files found (vitest.config.ts, playwright.config.ts)
- Document any duplicate configs in audit report

#### Scenario: New tests use established helper infrastructure

**Given** new tests were added during QA & Polish phase (rate-limiting, pagination, password-requirements)
**When** the audit reviews these test files
**Then** tests SHALL import from `__tests__/helpers/db.ts` for database setup
**And** tests SHALL import from `__tests__/helpers/auth.ts` for authentication mocking
**And** tests SHALL import from `__tests__/helpers/seed.ts` for test data creation
**And** tests SHALL NOT reinvent database connection logic
**And** tests SHALL NOT reinvent session mocking logic

**Acceptance Criteria**:
- Review: `__tests__/integration/rate-limiting.test.ts`
- Review: `__tests__/integration/pagination-*.test.ts`
- Review: `__tests__/integration/password-requirements.test.ts`
- Assert: All use `withTestTransaction()` from helpers
- Assert: All use `withAuthContext()` or similar from helpers
- Document any tests that bypassed helper infrastructure

#### Scenario: Test suite executes successfully

**Given** the test suite has 493+ tests
**When** the audit runs `npm run test:unit`
**Then** the command SHALL complete
**And** the pass/fail count SHALL be recorded
**And** any failing tests SHALL be documented
**And** execution time SHALL be recorded

**Acceptance Criteria**:
- Execute: `npm run test:unit`
- Record: Total tests, passing, failing, skipped
- Record: Execution time
- Document: Any unexpected failures or warnings

---

### Requirement: Documentation Accuracy Validation

The platform SHALL validate that documented features in `project.md` and `strategic_roadmap.md` are actually implemented in the codebase.

#### Scenario: Rate Limiting implementation matches documentation

**Given** `project.md` claims "Rate limiting on critical server actions using @upstash/ratelimit"
**When** the audit checks the codebase
**Then** `lib/ratelimit.ts` SHALL exist
**And** the file SHALL import `@upstash/ratelimit`
**And** server actions (login, register, applyToGig, sendMessage) SHALL use rate limiting
**And** rate limit thresholds SHALL match documentation

**Acceptance Criteria**:
- Check: `lib/ratelimit.ts` exists
- Check: `app/actions/auth.ts` uses rate limiting
- Check: `app/actions/gig.ts` uses rate limiting
- Check: `app/actions/message.ts` uses rate limiting
- Document: Any missing rate limiting or mismatched thresholds

#### Scenario: CSRF Protection implementation matches documentation

**Given** `project.md` claims "CSRF Protection: Next.js 15 provides built-in CSRF protection"
**When** the audit checks the codebase
**Then** no custom CSRF token implementation SHALL exist
**And** Next.js 15 built-in protection SHALL be active (Origin header matching)
**And** no `serverActions.allowedOrigins` wildcards SHALL exist in `next.config.ts`

**Acceptance Criteria**:
- Check: No custom CSRF token generation in codebase
- Check: `next.config.ts` does not weaken CSRF protection
- Check: E2E tests in `__tests__/e2e/csrf-protection.spec.ts` exist (if documented)
- Document: CSRF protection status

#### Scenario: Pagination implementation matches documentation

**Given** `project.md` claims "Pagination on gig browsing page (25 gigs per page, offset-based)"
**When** the audit checks the codebase
**Then** `app/dashboard/gigs/page.tsx` SHALL implement pagination
**And** page size SHALL be 25 items
**And** `app/admin/users/page.tsx` SHALL implement pagination (30 items)
**And** `app/admin/gigs/page.tsx` SHALL implement pagination (30 items)

**Acceptance Criteria**:
- Check: `app/dashboard/gigs/page.tsx` has pagination logic
- Check: Page size constants match documentation
- Check: Admin pages have pagination
- Document: Any missing pagination or mismatched page sizes

#### Scenario: Input Sanitization implementation matches documentation

**Given** `project.md` claims input sanitization with DOMPurify
**When** the audit checks the codebase
**Then** `isomorphic-dompurify` SHALL be installed
**And** sanitization SHALL be used in form inputs or server actions
**And** sanitization SHALL occur before database storage

**Acceptance Criteria**:
- Check: `package.json` includes `isomorphic-dompurify`
- Check: Sanitization is used in gig creation, application submission, or message sending
- Document: Sanitization implementation status

#### Scenario: All 27 completed changes are implemented

**Given** `project.md` lists 27 completed changes
**When** the audit reviews each change
**Then** each change SHALL have corresponding implementation in the codebase
**And** no "ghost features" (documented but not coded) SHALL exist

**Acceptance Criteria**:
- Review: Each of the 27 changes listed in `project.md`
- Verify: Implementation exists for each change
- Document: Any missing implementations or stub code

---

### Requirement: Cross-System Compatibility Validation

The platform SHALL validate that newly added systems (sanitization, rate limiting, pagination) do not conflict with existing functionality.

#### Scenario: Sanitization does not break validation

**Given** DOMPurify sanitization is applied to user inputs
**When** sanitized data is validated by Zod schemas
**Then** sanitization SHALL NOT remove characters that Zod expects
**And** validation SHALL pass for legitimate inputs
**And** sanitized data SHALL be stored correctly in database

**Acceptance Criteria**:
- Review: Data flow from form → sanitization → validation → storage
- Test scenario: Input with HTML tags (e.g., `<script>alert('xss')</script>`)
- Assert: Sanitization strips tags
- Assert: Validation still passes
- Document: Any conflicts between sanitization and validation

#### Scenario: Pagination state persists after mutations

**Given** admin is viewing users on page 2
**When** admin suspends a user via Server Action
**Then** the page SHALL refresh correctly
**And** pagination state SHALL NOT break
**And** `revalidatePath()` SHALL be called in the Server Action

**Acceptance Criteria**:
- Review: `app/actions/admin.ts` for `suspendUser` and `closeGig` actions
- Check: `revalidatePath()` is called after mutations
- Document: Any missing revalidation calls

#### Scenario: Rate limiting does not block tests

**Given** tests execute server actions repeatedly
**When** tests run in parallel
**Then** rate limiters SHALL NOT block test execution
**And** rate limiters SHALL be mocked in test environment
**And** tests SHALL pass consistently

**Acceptance Criteria**:
- Review: `__tests__/setup.ts` for rate limit mocking
- Review: Test files for rate limit handling
- Check: Global mock exists for `@upstash/ratelimit`
- Document: Rate limiting test strategy

#### Scenario: Password validation is backward compatible

**Given** existing users may have weak passwords (created before validation)
**When** these users attempt to login
**Then** login SHALL succeed
**And** password validation SHALL only apply to new registrations
**And** existing users SHALL NOT be forced to change passwords

**Acceptance Criteria**:
- Review: Password validation logic in registration action
- Review: Login action does not re-validate password strength
- Check: Tests verify backward compatibility
- Document: Backward compatibility status

---

## MODIFIED Requirements

None - this is a validation/audit change, not a feature modification.

## REMOVED Requirements

None - this is a validation/audit change, not a feature removal.
