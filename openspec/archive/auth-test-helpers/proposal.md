# Change Proposal: Authentication Test Helpers

## Change ID
`auth-test-helpers`

## Problem Statement

Most features in Gigly require authentication. Currently, testing authenticated functionality is cumbersome because:

1. **No direct session creation**: Tests must go through the full registration/login flow to authenticate, which is slow and couples tests to auth implementation details.
2. **No request context mocking**: Server actions rely on `getSession()` from cookies, but there's no easy way to mock authenticated context in unit tests.
3. **Difficult authorization testing**: Verifying that users cannot access forbidden resources requires complex setup and teardown.
4. **Repetitive boilerplate**: Every test that needs authentication must duplicate session setup code.

This makes it difficult to write fast, focused tests for features like gig creation, application management, messaging, and admin moderation.

## Proposed Solution

Create a comprehensive set of authentication test helpers in `__tests__/helpers/auth.ts` that provide:

1. **`createTestSession(user)`**: Generate a valid JWT session token for a test user without going through login flow.
2. **`withAuthContext(user, callback)`**: Execute a callback with mocked session context, allowing server actions to see the user as authenticated.
3. **`makeAuthenticatedRequest(user, action, ...args)`**: Call a server action as an authenticated user in integration tests.
4. **`expectUnauthorized(callback)`**: Assert that an operation fails with authorization error.

These helpers will:
- Work seamlessly with existing `createTestUser` and `withTestTransaction` helpers
- Support all three roles: CLIENT, SPECIALIST, ADMIN
- Be usable in both unit tests (with mocked context) and integration tests (with real sessions)
- Be compatible with Playwright E2E tests (via cookie injection, not mocking)
- Reduce test boilerplate and improve test readability

## Constraints

- **MUST** use the same JWT signing logic as production (`lib/session.ts`)
- **MUST** work with the existing test database isolation (per-worker databases, transaction rollback)
- **MUST NOT** modify production authentication code
- **MUST** be compatible with both Vitest unit tests and Playwright E2E tests
- **SHOULD** provide clear error messages when authorization fails
- **SHOULD** be easy to use without deep knowledge of session internals

## Non-Goals

- Modifying the production authentication system
- Adding new authentication methods (OAuth, SSO, etc.)
- Testing actual HTTP cookie behavior (that's for E2E tests)
- Mocking bcrypt password hashing (existing helpers already handle this)

## Success Criteria

1. Tests can create authenticated sessions in a single line: `const session = await createTestSession(user)`
2. Server actions can be tested with authenticated context: `await withAuthContext(user, async () => { ... })`
3. Authorization failures can be verified: `await expectUnauthorized(async () => { ... })`
4. Existing tests can be refactored to use new helpers with less code
5. New authenticated features can be tested without duplicating session setup

## Implementation Notes

The helpers will need to:
- Import `SESSION_SECRET` from environment (same as production)
- Use `jose` library to sign JWTs (same as production)
- Mock Next.js `cookies()` function for unit tests using a **shared store pattern** (not runtime module swapping, which is problematic with ESM)
  - Use `vi.mock('next/headers')` at test file top or in setup
  - Store session tokens in a shared Map/AsyncLocalStorage
  - `withAuthContext` sets/clears values in the store
- Provide both "mock context" approach (for unit tests) and "real session" approach (for integration tests)
- Export pure JWT generation function that can be reused in Playwright E2E tests (via `page.context().addCookies()`)

## References

- Existing auth implementation: `lib/session.ts`, `app/actions/auth.ts`
- Existing test helpers: `__tests__/helpers/db.ts`, `__tests__/helpers/seed.ts`
- Testing spec: `openspec/specs/testing/spec.md`
- Authentication spec: `openspec/specs/authentication/spec.md`
