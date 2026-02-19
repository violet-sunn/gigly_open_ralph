# Implementation Tasks

## Task 1: Create Basic Session Token Generator

**Description**: Implement `createTestSession(user)` helper that generates valid JWT tokens for test users.

**Implementation Notes**:
- Create `__tests__/helpers/auth.ts` file
- Import `SignJWT` from `jose` library (same as production)
- Import `SESSION_SECRET` from environment variables
- Function signature: `createTestSession(user: { id: string, email: string, role: string }): Promise<string>`
- Use same JWT configuration as `lib/session.ts`:
  - Algorithm: HS256
  - Expiration: 7 days
  - Include `userId`, `email`, `role` in payload
- Return the signed JWT token string
- **Design for reusability**: This function should be pure (no side effects) so it can be used in both Vitest unit tests AND Playwright E2E tests

**Test Plan**:
- Create test file: `__tests__/unit/helpers/auth.test.ts`
- Test: Create session for CLIENT user, verify token is string
- Test: Decode token using `jwtVerify`, verify payload contains correct userId, email, role
- Test: Create sessions for all three roles (CLIENT, SPECIALIST, ADMIN), verify each has correct role
- Test: Verify token expiration is set to 7 days
- Run: `npm run test:unit` and verify all tests pass

---

## Task 1.5: Create E2E Session Helper

**Description**: Create helper for setting authenticated sessions in Playwright E2E tests.

**Implementation Notes**:
- Add to `__tests__/helpers/auth.ts`
- Function signature: `setE2ESession(page: Page, user: { id: string, email: string, role: string }): Promise<void>`
- Implementation:
  - Call `createTestSession(user)` to generate JWT token
  - Use `page.context().addCookies([...])` to set the session cookie
  - Cookie configuration should match production: httpOnly, secure (if applicable), sameSite, path, domain
- This allows E2E tests to bypass login flow and test authenticated features directly

**Test Plan**:
- Create example E2E test: `__tests__/e2e/auth-session.spec.ts`
- Test: Create CLIENT user in test database, call `setE2ESession(page, client)`, navigate to `/dashboard`, verify user is authenticated
- Test: Verify session persists across page navigations
- Test: Create SPECIALIST user, set session, verify specialist dashboard is accessible
- Run: `npm run test:e2e` and verify tests pass

---

## Task 2: Implement Session Context Mocking

**Description**: Implement `withAuthContext(user, callback)` helper that mocks Next.js cookies to provide authenticated context for server actions.

**Implementation Notes**:
- Add to `__tests__/helpers/auth.ts`
- Function signature: `withAuthContext<T>(user: { id: string, email: string, role: string }, callback: () => Promise<T>): Promise<T>`
- **Strategy (IMPORTANT - ESM Module Mocking)**:
  - Create a shared store (e.g., `Map<string, string>` or `AsyncLocalStorage`) to hold test session tokens
  - Use `vi.mock('next/headers')` at the TOP of test files (or in setup file) to create a global mock
  - The mocked `cookies()` function should read from the shared store
  - `withAuthContext` sets the token in the store, runs callback, then clears it (try/finally)
  - This avoids runtime module swapping issues with ESM
- Use `createTestSession(user)` to generate token
- Mock implementation should return object with `get(name)` method that returns `{ value: token }` when name is 'session'
- Use try/finally to ensure cleanup even if callback throws
- Export the shared store setup so tests can initialize the mock

**Test Plan**:
- Test: Call `withAuthContext` with CLIENT user, inside callback call `getSession()`, verify it returns user data
- Test: Call `withAuthContext`, verify context is cleaned up after callback (call `getSession()` outside, should return null)
- Test: Nested contexts - outer context with user A, inner context with user B, verify each sees correct user
- Test: Context cleanup on error - callback throws error, verify context is still cleaned up
- Run: `npm run test:unit` and verify all tests pass

---

## Task 3: Create Authenticated Request Helper

**Description**: Implement `makeAuthenticatedRequest(user, action, ...args)` helper for calling server actions with authenticated context in integration tests.

**Implementation Notes**:
- Add to `__tests__/helpers/auth.ts`
- Function signature: `makeAuthenticatedRequest<T>(user: { id: string, email: string, role: string }, action: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T>`
- Implementation: Wrap `action(...args)` call inside `withAuthContext(user, ...)`
- This provides a cleaner API for integration tests
- Should pass through return value and errors from the action

**Test Plan**:
- Test: Create CLIENT user and gig using `makeAuthenticatedRequest(client, createGig, formData)`
- Verify gig is created with correct clientId
- Test: Try to call action that requires authentication without helper, verify it fails
- Test: Call action with helper, verify it succeeds
- Test: Action throws error, verify error is propagated correctly
- Run: `npm run test:unit` and verify all tests pass

---

## Task 4: Implement Authorization Failure Helper

**Description**: Implement `expectUnauthorized(callback)` helper that asserts operations fail with authorization errors.

**Implementation Notes**:
- Add to `__tests__/helpers/auth.ts`
- Function signature: `expectUnauthorized(callback: () => Promise<any>): Promise<void>`
- Implementation: Call callback, expect it to throw
- Check that error message contains authorization-related keywords: "unauthorized", "forbidden", "not allowed", "permission", etc.
- If callback succeeds, throw descriptive error: "Expected operation to fail with authorization error, but it succeeded"
- If callback throws non-authorization error, throw descriptive error: "Expected authorization error, but got: [error message]"
- Use Vitest's `expect().rejects.toThrow()` or manual try/catch

**Test Plan**:
- Test: Call `expectUnauthorized` with callback that throws authorization error, verify test passes
- Test: Call `expectUnauthorized` with callback that succeeds, verify test fails with clear message
- Test: Call `expectUnauthorized` with callback that throws different error, verify test fails with clear message
- Integration test: Try to accept application as non-owner within `expectUnauthorized`, verify it passes
- Integration test: Try to perform admin action as CLIENT within `expectUnauthorized`, verify it passes
- Run: `npm run test:unit` and verify all tests pass

---

## Task 5: Create Role-Specific Convenience Helpers

**Description**: Implement `createAuthenticatedClient`, `createAuthenticatedSpecialist`, and `createAuthenticatedAdmin` helpers that create users and sessions in one call.

**Implementation Notes**:
- Add to `__tests__/helpers/auth.ts`
- Each function signature: `createAuthenticatedRole(tx: PrismaClient, overrides?: {...}): Promise<{ user: User, session: string }>`
- Implementation for each:
  - Call `createTestUser(tx, { role: 'ROLE', ...overrides })`
  - Call `createTestSession(user)`
  - Return `{ user, session }`
- `createAuthenticatedClient`: role='CLIENT', accepts client profile overrides
- `createAuthenticatedSpecialist`: role='SPECIALIST', accepts specialist profile overrides
- `createAuthenticatedAdmin`: role='ADMIN', no profile needed

**Test Plan**:
- Test: Call `createAuthenticatedClient(tx)`, verify user is CLIENT with ClientProfile, session is valid
- Test: Call `createAuthenticatedSpecialist(tx)`, verify user is SPECIALIST with SpecialistProfile, session is valid
- Test: Call `createAuthenticatedAdmin(tx)`, verify user is ADMIN, session is valid
- Test: Pass overrides to each helper, verify overrides are applied
- Test: Decode session tokens, verify they contain correct user data
- Run: `npm run test:unit` and verify all tests pass

---

## Task 6: Write Comprehensive Integration Tests

**Description**: Create comprehensive integration tests demonstrating real-world usage of auth helpers with actual server actions.

**Implementation Notes**:
- Create `__tests__/integration/auth-helpers.test.ts`
- Use `withTestTransaction` for database isolation
- Test scenarios:
  1. Create gig as authenticated CLIENT
  2. Apply to gig as authenticated SPECIALIST
  3. Accept application as gig owner
  4. Verify non-owner cannot accept application (use `expectUnauthorized`)
  5. Verify SPECIALIST cannot create gig (use `expectUnauthorized`)
  6. Verify CLIENT cannot perform admin actions (use `expectUnauthorized`)
  7. Verify ADMIN can suspend users
- Each test should demonstrate clean, readable test code using the helpers

**Test Plan**:
- Run: `npm run test:unit` and verify all integration tests pass
- Verify tests are fast (should complete in <5 seconds total)
- Verify tests are isolated (can run in any order)
- Verify test code is readable and demonstrates helper usage clearly

---

## Task 7: Update Testing Documentation

**Description**: Add comprehensive documentation for authentication test helpers to `TESTING.md`.

**Implementation Notes**:
- Add new section: "## Testing Authenticated Features"
- Document each helper function:
  - Purpose and when to use it
  - Function signature
  - Code example
  - Common patterns
- Include complete examples:
  - Testing a CLIENT-only action
  - Testing a SPECIALIST-only action
  - Testing ownership-based authorization
  - Testing role-based authorization
- Add troubleshooting section:
  - "Session not found" errors
  - Context cleanup issues
  - Common mistakes

**Test Plan**:
- Review documentation for clarity and completeness
- Verify all code examples are syntactically correct
- Verify examples match actual helper implementations
- Ask another developer to read docs and try using helpers (if possible)

---

## Task 8: Refactor Existing Tests (Optional)

**Description**: Refactor existing authentication tests to use new helpers, demonstrating improved readability.

**Implementation Notes**:
- Review `__tests__/integration/auth.test.ts`
- Identify tests that could benefit from new helpers
- Refactor to use `createAuthenticatedClient`, `createAuthenticatedSpecialist`, etc.
- Compare before/after code to demonstrate improvement
- This task is optional but valuable for validation

**Test Plan**:
- Run: `npm run test:unit` and verify refactored tests still pass
- Verify refactored tests have less boilerplate
- Verify refactored tests are more readable

---

## Implementation Order

1. Task 1: Basic session token generator (foundation)
2. Task 1.5: E2E session helper (extends Task 1 for Playwright)
3. Task 2: Context mocking (core functionality - note ESM mocking strategy)
4. Task 3: Authenticated request helper (builds on Task 2)
5. Task 4: Authorization failure helper (independent)
6. Task 5: Role-specific helpers (builds on Task 1)
7. Task 6: Integration tests (validates everything)
8. Task 7: Documentation (after implementation is stable)
9. Task 8: Refactoring (optional, after validation)

## Success Criteria

- All helpers are implemented in `__tests__/helpers/auth.ts`
- All unit tests pass (`npm run test:unit`)
- Integration tests demonstrate real-world usage
- Documentation is clear and includes examples
- Helpers reduce test boilerplate by at least 50%
- New authenticated features can be tested in <10 lines of code
