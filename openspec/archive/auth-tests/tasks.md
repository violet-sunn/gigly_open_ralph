# Implementation Tasks: Comprehensive Auth & Authorization Tests

## Task 1: Review Existing Test Infrastructure

Review and understand the existing test infrastructure to leverage it for auth tests.

**Implementation Notes:**
- Review `__tests__/helpers/db.ts` - per-worker database isolation with `withTestTransaction()`
- Review `__tests__/helpers/seed.ts` - existing factories: `createTestUser()`, `createTestGig()`, `createTestApplication()`
- Review `__tests__/helpers/auth.ts` - existing auth helpers: `createAuthenticatedClient()`, `createAuthenticatedSpecialist()`, `withAuthContext()`, `makeAuthenticatedRequest()`
- Understand transaction-based rollback pattern (no manual cleanup needed)
- Review existing test examples in `__tests__/integration/auth.test.ts` and `__tests__/integration/auth-helpers.test.ts`
- Identify any missing helpers needed for comprehensive auth testing

**Test Plan:**
- Run `npm run test:unit` - verify existing tests pass
- Review existing test patterns to ensure consistency
- Confirm `withTestTransaction()` provides proper isolation
- Check that existing auth helpers cover most use cases

---

## Task 2: Write User Registration Tests

Implement comprehensive tests for user registration covering role selection, password hashing, validation, and mass assignment protection.

**Implementation Notes:**
- Create `__tests__/integration/registration.test.ts`
- Import `registerUser` action from `app/actions/auth.ts`
- Import `withTestTransaction` from `__tests__/helpers/db`
- Import `bcrypt` for password hash verification
- Use `vi.mock('next/headers')` to mock cookies for session testing
- Test scenarios (all within `withTestTransaction`):
  - Register CLIENT user successfully
  - Register SPECIALIST user successfully
  - **Registration rejects ADMIN role (mass assignment attack)**
  - Registration rejects invalid roles
  - Registration prevents duplicate email
  - **Registration ignores additional privileged fields** (e.g., `suspended: false`, `isAdmin: true` in FormData)
- Use existing `createTestUser()` helper for setup where needed
- No manual cleanup needed (transactions auto-rollback)

**Test Plan:**
- Run `npm run test:unit -- registration.test.ts`
- All 6+ test scenarios should pass
- Verify test output shows clear pass/fail for each scenario
- Verify password hashing by checking stored hash format and `bcrypt.compare()` result
- **Verify mass assignment protection**: attempting to register with `role: "ADMIN"` creates no user or creates CLIENT/SPECIALIST only
- **Verify field whitelisting**: extra fields in FormData are ignored
- Confirm tests can run in parallel without conflicts

---

## Task 3: Write Login and Session Tests

Implement tests for login credential verification, session creation, and suspended user blocking.

**Implementation Notes:**
- Create `__tests__/integration/login.test.ts`
- Import `loginUser` action from `app/actions/auth.ts`
- Import `withTestTransaction` and `createTestUser` from helpers
- Use `vi.mock('next/headers')` to mock cookies
- Test scenarios (all within `withTestTransaction`):
  - Login with correct credentials (catch NEXT_REDIRECT as success)
  - Login with incorrect password
  - Login with non-existent email
  - Suspended user cannot login
- For suspended user test: use `createTestUser(tx, { suspended: true })`
- Mock Next.js redirect behavior to test session creation

**Test Plan:**
- Run `npm run test:unit -- login.test.ts`
- All 4 test scenarios should pass
- Verify suspended user test properly blocks login
- Verify error messages don't reveal whether email exists
- Check that successful login attempts trigger redirect (NEXT_REDIRECT error)

---

## Task 4: Write Session Management Tests

Implement tests for JWT session creation, reading, expiration, and destruction.

**Implementation Notes:**
- Create `__tests__/unit/session.test.ts` (unit test, no database needed)
- Import session functions from `lib/session.ts`: `createSession`, `getSession`, `destroySession`
- Use existing `createTestSession()` helper from `__tests__/helpers/auth.ts`
- Test scenarios:
  - `createSession` generates valid JWT with correct payload
  - `getSession` reads valid session correctly
  - `getSession` returns null for invalid token
  - `getSession` returns null for expired token (may need to mock time or create expired JWT)
  - `destroySession` clears cookie
- Mock `cookies()` from `next/headers` for cookie manipulation
- Use `jose` library to verify JWT structure and signature

**Test Plan:**
- Run `npm run test:unit -- session.test.ts`
- All 5 test scenarios should pass
- Verify JWT payload contains userId, email, role
- Verify JWT expiration is set to 7 days
- Verify invalid/expired tokens are handled gracefully (no errors thrown)

---

## Task 5: Write Gig Authorization Tests

Implement tests verifying role-based authorization for all gig operations.

**Implementation Notes:**
- Create `__tests__/integration/gig-authorization.test.ts`
- Import gig-related actions: `createGig`, `applyToGig`, `acceptApplication`, `submitWork`, `approveWork`, `markAsPaid`
- Import `withTestTransaction`, `createAuthenticatedClient`, `createAuthenticatedSpecialist` from helpers
- Import `withAuthContext`, `makeAuthenticatedRequest`, `expectUnauthorized` from `__tests__/helpers/auth`
- Use `vi.mock('next/headers')` to mock cookies
- Test scenarios (11 total, all within `withTestTransaction`):
  - CLIENT can create gigs
  - SPECIALIST cannot create gigs
  - SPECIALIST can apply to open gigs
  - CLIENT cannot apply to gigs
  - Gig owner can accept applications
  - Non-owner cannot accept applications
  - Assigned specialist can submit work
  - Non-assigned specialist cannot submit work
  - Gig owner can approve work
  - Non-owner cannot approve work
  - Gig owner can mark as paid
  - Non-owner cannot mark as paid
- Use `createTestGig()` and `createTestApplication()` helpers
- Use `expectUnauthorized()` for negative test cases
- No manual cleanup needed (transactions auto-rollback)

**Test Plan:**
- Run `npm run test:unit -- gig-authorization.test.ts`
- All 11+ test scenarios should pass
- Verify authorization errors have clear, actionable messages
- Verify database state only changes for authorized actions
- Check that gig lifecycle transitions work correctly (OPEN → IN_PROGRESS → REVIEW → COMPLETED)

---

## Task 6: Write Admin Authorization Tests

Implement tests verifying that admin operations are restricted to ADMIN role only.

**Implementation Notes:**
- Create `__tests__/integration/admin-authorization.test.ts`
- Import admin actions: `suspendUser`, `unsuspendUser`, `closeGig`
- Import `withTestTransaction`, `createAuthenticatedAdmin`, `createAuthenticatedClient`, `createAuthenticatedSpecialist` from helpers
- Import `withAuthContext`, `expectUnauthorized` from `__tests__/helpers/auth`
- Use `vi.mock('next/headers')` to mock cookies
- Test scenarios (all within `withTestTransaction`):
  - ADMIN can suspend users
  - CLIENT cannot suspend users
  - SPECIALIST cannot suspend users
  - ADMIN can close gigs
  - CLIENT cannot close other users' gigs
  - ADMIN can unsuspend users
- Verify ModerationLog entries are created for admin actions (query within transaction)
- Use `expectUnauthorized()` for non-ADMIN test cases
- No manual cleanup needed (transactions auto-rollback)

**Test Plan:**
- Run `npm run test:unit -- admin-authorization.test.ts`
- All 6 test scenarios should pass
- Verify ModerationLog table has entries after admin actions
- Verify suspended users cannot login (integration with login tests)
- Verify closed gigs cannot receive applications
- Check authorization error messages are clear

---

## Task 7: Write Horizontal Privilege Escalation Tests (IDOR)

Implement tests verifying that users cannot access or modify resources owned by other users of the same role.

**Implementation Notes:**
- Create `__tests__/integration/horizontal-privilege-escalation.test.ts`
- Import gig and application actions
- Import `withTestTransaction`, `createAuthenticatedClient`, `createAuthenticatedSpecialist` from helpers
- Import `withAuthContext`, `expectUnauthorized` from `__tests__/helpers/auth`
- Use `vi.mock('next/headers')` to mock cookies
- Test scenarios (all within `withTestTransaction`):
  - **Client A cannot accept applications on Client B's gig**
  - **Client A cannot approve work on Client B's gig**
  - **Client A cannot mark Client B's gig as paid**
  - **Specialist A cannot submit work for gig assigned to Specialist B**
  - **Specialist A cannot withdraw/modify Specialist B's application**
- Create multiple users of the same role (Client A, Client B, Specialist A, Specialist B)
- Use `expectUnauthorized()` to verify ownership checks
- Verify error messages clearly indicate ownership requirement

**Test Plan:**
- Run `npm run test:unit -- horizontal-privilege-escalation.test.ts`
- All 5 IDOR test scenarios should pass
- Verify ownership checks prevent horizontal escalation
- Verify error messages are clear (e.g., "Only the gig owner can accept applications")
- Confirm no database state changes occur for unauthorized attempts

---

## Task 8: Write Authorization Error Clarity Tests

Implement tests verifying that authorization errors provide clear, actionable messages.

**Implementation Notes:**
- Create `__tests__/integration/authorization-errors.test.ts`
- Import `withTestTransaction` and auth helpers
- Use `vi.mock('next/headers')` to mock cookies
- Test error message format and content for various unauthorized actions (all within `withTestTransaction`)
- Verify errors follow consistent pattern
- Verify no sensitive system details are exposed
- Check that error messages guide users appropriately
- Use `expectUnauthorized()` helper to verify error format

**Test Plan:**
- Run `npm run test:unit -- authorization-errors.test.ts`
- All error message tests should pass
- Review error messages for clarity and consistency
- Verify no stack traces or internal details in error messages

---

## Task 9: Run Coverage Report and Verify Completeness

Generate test coverage report and verify all auth scenarios from specs are covered.

**Implementation Notes:**
- Run `npm run test:coverage` to generate coverage report
- Review coverage for:
  - `app/actions/auth.ts`
  - `lib/session.ts`
  - Gig-related server actions with authorization
  - Admin-related server actions
- Identify any uncovered branches or scenarios
- Add additional tests if coverage is below 80%
- Verify all tests use `withTestTransaction()` for proper isolation
- Confirm tests can run in parallel without conflicts
- **Verify OWASP Top 10 coverage**: Mass assignment, vertical privilege escalation, horizontal privilege escalation (IDOR)

**Test Plan:**
- Run `npm run test:coverage`
- Verify coverage report shows >80% line coverage for auth code
- Verify coverage report shows >80% branch coverage for auth code
- Open HTML coverage report (`coverage/index.html`) and review uncovered lines
- Cross-reference test scenarios with archived specs to ensure completeness
- All tests should pass: `npm run test:unit`
- Verify parallel execution works: `npm run test:unit -- --reporter=verbose`
- **Security checklist**: Confirm mass assignment, vertical escalation, and IDOR tests all pass

---

## Task 10: Update Documentation

Update `TESTING.md` with auth test examples and best practices.

**Implementation Notes:**
- Add section "Authentication & Authorization Testing Examples" to `TESTING.md`
- Document common auth testing patterns:
  - Using `withTestTransaction()` for test isolation
  - Using `createAuthenticatedClient()` and `createAuthenticatedSpecialist()` helpers
  - Using `withAuthContext()` to mock authenticated sessions
  - Using `expectUnauthorized()` to test authorization failures
  - Testing role-based authorization (CLIENT vs SPECIALIST vs ADMIN)
  - Testing ownership-based authorization (gig owner vs non-owner)
- Provide example of testing suspended user scenarios
- Add notes about mocking `next/headers` for session testing
- Reference the new test files as examples

**Test Plan:**
- Review `TESTING.md` for clarity and completeness
- Verify examples are accurate and runnable
- Check that new developers can understand how to write auth tests
- Ensure documentation references the correct test files and helpers
- Verify all code examples use the current testing infrastructure (per-worker databases, transactions)

---

## Summary

**Total Tasks:** 10

**Estimated Effort:**
- Task 1 (Review Infrastructure): 1-2 hours
- Task 2 (Registration + Mass Assignment): 2-3 hours
- Task 3 (Login): 2-3 hours
- Task 4 (Session): 2-3 hours
- Task 5 (Gig Auth): 3-4 hours
- Task 6 (Admin Auth): 2-3 hours
- Task 7 (Horizontal Escalation / IDOR): 2-3 hours
- Task 8 (Error Messages): 1-2 hours
- Task 9 (Coverage): 1-2 hours
- Task 10 (Documentation): 1 hour

**Total:** ~17-26 hours

**Dependencies:**
- Tasks 2-8 depend on Task 1 (understanding existing infrastructure)
- Task 9 depends on Tasks 2-8 (all tests written)
- Task 10 depends on Task 9 (coverage verified)

**Key Infrastructure Notes:**
- All tests use `withTestTransaction()` for automatic rollback (no manual cleanup)
- Each Vitest worker gets its own isolated in-memory database
- Tests can run in parallel safely
- Existing helpers (`createAuthenticatedClient()`, `withAuthContext()`, etc.) should be leveraged
- Mock `next/headers` for session testing in all integration tests

**Success Criteria:**
- All test files created and passing
- Coverage >80% for auth code
- All scenarios from archived specs have corresponding tests
- **OWASP Top 10 security tests pass**: Mass assignment protection, vertical privilege escalation prevention, horizontal privilege escalation (IDOR) prevention
- Tests use transaction-based isolation (no manual cleanup)
- Tests can run in parallel without conflicts
- Documentation updated with auth testing examples
- Tests serve as living documentation for auth behavior
