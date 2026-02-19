# Testing Specification Delta

## ADDED Requirements

### Requirement: Test Session Creation Helper

The platform SHALL provide a helper function to create valid JWT session tokens for test users without going through the login flow.

#### Scenario: Create session token for test user

**Given** a test user exists in the test database
**When** the test calls `createTestSession(user)`
**Then** a valid JWT token SHALL be returned
**And** the token SHALL contain the user's ID, email, and role
**And** the token SHALL be signed with the same secret as production
**And** the token SHALL have a 7-day expiration

**Acceptance Criteria**:
- `createTestSession(user)` function exists in `__tests__/helpers/auth.ts`
- Function accepts a user object with `id`, `email`, and `role` properties
- Returns a string JWT token
- Token can be verified using `jose` library with `SESSION_SECRET`
- Token payload matches user properties
- Run test: create session, verify token, decode and check payload

#### Scenario: Create session for different roles

**Given** test users with CLIENT, SPECIALIST, and ADMIN roles
**When** sessions are created for each user
**Then** each session SHALL contain the correct role
**And** each session SHALL be independently valid

**Acceptance Criteria**:
- Create sessions for all three roles
- Verify each token contains correct role in payload
- Tokens are distinct and don't interfere with each other

---

### Requirement: Authenticated Context Helper

The platform SHALL provide a helper function to execute code with mocked authenticated session context for testing server actions.

#### Scenario: Execute callback with authenticated context

**Given** a test user
**When** the test calls `withAuthContext(user, async () => { ... })`
**Then** the callback SHALL execute with `getSession()` returning the user's session data
**And** server actions called within the callback SHALL see the user as authenticated
**And** the context SHALL be cleaned up after the callback completes

**Acceptance Criteria**:
- `withAuthContext(user, callback)` function exists in `__tests__/helpers/auth.ts`
- Function accepts user object and async callback
- Mocks Next.js `cookies()` to return session token
- `getSession()` returns user data during callback execution
- Context is restored after callback (no pollution between tests)
- Run test: call server action within `withAuthContext`, verify it sees authenticated user

#### Scenario: Nested authenticated contexts

**Given** a test with nested `withAuthContext` calls
**When** the inner context uses a different user
**Then** the inner callback SHALL see the inner user
**And** the outer callback SHALL see the outer user after inner completes

**Acceptance Criteria**:
- Nested contexts work correctly
- Context switching doesn't leak between levels
- Test by nesting two `withAuthContext` calls with different users

---

### Requirement: Authenticated Request Helper

The platform SHALL provide a helper function to call server actions as an authenticated user in integration tests.

#### Scenario: Make authenticated request to server action

**Given** a test user and a server action that requires authentication
**When** the test calls `makeAuthenticatedRequest(user, serverAction, ...args)`
**Then** the server action SHALL execute with the user's session
**And** the server action SHALL see the user as authenticated via `getSession()`
**And** the result SHALL be returned to the test

**Acceptance Criteria**:
- `makeAuthenticatedRequest(user, action, ...args)` function exists
- Function accepts user, server action function, and action arguments
- Sets up authenticated context before calling action
- Passes arguments to server action correctly
- Returns action result or throws action errors
- Run test: call `createGig` action via helper, verify gig is created with correct clientId

#### Scenario: Authenticated request with form data

**Given** a server action that accepts FormData (like `registerUser`)
**When** the test calls `makeAuthenticatedRequest` with FormData argument
**Then** the FormData SHALL be passed correctly to the action
**And** the action SHALL process it normally

**Acceptance Criteria**:
- Helper works with FormData arguments
- Helper works with plain object arguments
- Test by calling form-based action with FormData

---

### Requirement: Authorization Failure Testing Helper

The platform SHALL provide a helper function to assert that operations fail with authorization errors.

#### Scenario: Verify unauthorized access is blocked

**Given** a server action that requires specific role or ownership
**When** the test calls `expectUnauthorized(async () => { ... })`
**Then** the callback SHALL throw an authorization error
**And** the test SHALL pass if authorization error is thrown
**And** the test SHALL fail if callback succeeds or throws different error

**Acceptance Criteria**:
- `expectUnauthorized(callback)` function exists in `__tests__/helpers/auth.ts`
- Function accepts async callback
- Asserts callback throws error with authorization-related message
- Provides clear error message if assertion fails
- Run test: try to accept application as non-owner, verify `expectUnauthorized` passes

#### Scenario: Test role-based authorization

**Given** a CLIENT user and an admin-only action
**When** the test calls the action within `expectUnauthorized`
**Then** the test SHALL pass because CLIENT cannot perform admin actions

**Acceptance Criteria**:
- Helper works for role-based authorization (ADMIN-only actions)
- Helper works for ownership-based authorization (gig owner actions)
- Test both scenarios and verify helper correctly detects unauthorized access

---

### Requirement: Multi-Role Test Helpers

The platform SHALL provide convenience functions for creating authenticated sessions for specific roles.

#### Scenario: Create authenticated CLIENT session

**Given** a test needs a CLIENT user
**When** the test calls `createAuthenticatedClient(tx, overrides?)`
**Then** a CLIENT user SHALL be created with profile
**And** a valid session token SHALL be returned
**And** the user object SHALL be returned

**Acceptance Criteria**:
- `createAuthenticatedClient(tx, overrides?)` function exists
- Creates CLIENT user with ClientProfile
- Returns `{ user, session }` object
- Session is valid JWT token
- Test by creating client and verifying both user and session

#### Scenario: Create authenticated SPECIALIST session

**Given** a test needs a SPECIALIST user
**When** the test calls `createAuthenticatedSpecialist(tx, overrides?)`
**Then** a SPECIALIST user SHALL be created with profile
**And** a valid session token SHALL be returned
**And** the user object SHALL be returned

**Acceptance Criteria**:
- `createAuthenticatedSpecialist(tx, overrides?)` function exists
- Creates SPECIALIST user with SpecialistProfile
- Returns `{ user, session }` object
- Session is valid JWT token

#### Scenario: Create authenticated ADMIN session

**Given** a test needs an ADMIN user
**When** the test calls `createAuthenticatedAdmin(tx, overrides?)`
**Then** an ADMIN user SHALL be created
**And** a valid session token SHALL be returned
**And** the user object SHALL be returned

**Acceptance Criteria**:
- `createAuthenticatedAdmin(tx, overrides?)` function exists
- Creates ADMIN user (no profile needed)
- Returns `{ user, session }` object
- Session is valid JWT token

---

### Requirement: Session Context Cleanup

The platform SHALL ensure that mocked session context is properly cleaned up after tests to prevent test pollution.

#### Scenario: Context cleanup after test

**Given** a test uses `withAuthContext`
**When** the test completes (pass or fail)
**Then** the mocked session context SHALL be removed
**And** subsequent tests SHALL NOT see the previous session
**And** `getSession()` SHALL return null outside authenticated context

**Acceptance Criteria**:
- Context is cleaned up after successful callback
- Context is cleaned up after callback throws error
- Test by calling `getSession()` after `withAuthContext` completes, verify it returns null
- Run multiple tests in sequence, verify no session leakage

---

### Requirement: E2E Session Helper

The platform SHALL provide a helper function to set authenticated sessions in Playwright E2E tests by injecting session cookies.

#### Scenario: Set authenticated session in E2E test

**Given** a Playwright page and a test user
**When** the test calls `setE2ESession(page, user)`
**Then** a valid session cookie SHALL be added to the browser context
**And** the cookie SHALL contain a JWT token with the user's data
**And** subsequent page navigations SHALL maintain the authenticated session
**And** the application SHALL recognize the user as authenticated

**Acceptance Criteria**:
- `setE2ESession(page, user)` function exists in `__tests__/helpers/auth.ts`
- Function accepts Playwright `Page` object and user object
- Uses `createTestSession(user)` to generate JWT token
- Adds cookie via `page.context().addCookies([...])`
- Cookie configuration matches production: name='session', httpOnly=true, sameSite='lax', path='/'
- Test by setting session and navigating to `/dashboard`, verify user is authenticated

#### Scenario: E2E session persists across navigations

**Given** an E2E test has set an authenticated session
**When** the test navigates to multiple pages
**Then** the session SHALL persist across all navigations
**And** the user SHALL remain authenticated
**And** protected pages SHALL be accessible

**Acceptance Criteria**:
- Set CLIENT session, navigate to `/dashboard`, then `/dashboard/gigs/new`, verify both pages load
- Set SPECIALIST session, navigate to `/dashboard`, then `/dashboard/gigs`, verify both pages load
- Session cookie is not cleared between navigations

#### Scenario: E2E session works for all roles

**Given** test users with different roles
**When** sessions are set for CLIENT, SPECIALIST, and ADMIN
**Then** each role SHALL have appropriate access to their dashboards
**And** role-specific features SHALL be accessible

**Acceptance Criteria**:
- CLIENT can access `/dashboard/gigs/new`
- SPECIALIST can access `/dashboard/gigs` (browse)
- ADMIN can access `/admin`
- Test all three roles in separate E2E tests

---

### Requirement: Helper Documentation and Examples

The platform SHALL provide clear documentation and examples for using authentication test helpers.

#### Scenario: Developer reads auth helper documentation

**Given** a developer wants to test authenticated functionality
**When** they read the testing documentation
**Then** documentation SHALL explain how to create test sessions
**And** documentation SHALL explain how to use `withAuthContext`
**And** documentation SHALL explain how to test authorization failures
**And** documentation SHALL include code examples for each helper

**Acceptance Criteria**:
- `TESTING.md` includes section on authentication helpers
- Each helper function is documented with purpose and usage
- Code examples show common testing patterns
- Examples cover all three roles (CLIENT, SPECIALIST, ADMIN)

#### Scenario: Example test demonstrates helper usage

**Given** example tests exist in `__tests__/integration/auth-helpers.test.ts`
**When** a developer reads the examples
**Then** examples SHALL demonstrate creating sessions
**And** examples SHALL demonstrate authenticated requests
**And** examples SHALL demonstrate authorization testing
**And** all examples SHALL pass when run

**Acceptance Criteria**:
- Example test file exists
- Examples cover all major helper functions
- Examples are well-commented
- Run `npm run test:unit` and verify examples pass
