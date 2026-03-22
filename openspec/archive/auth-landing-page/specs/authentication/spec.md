# Authentication Specification Delta: auth-landing-page

## MODIFIED Requirements

### Requirement: Middleware Route Protection

The system MUST use Next.js middleware to protect routes based on session state, with special handling for the `/auth` landing page.

#### Scenario: Unauthenticated access to /auth is allowed

- GIVEN no valid session cookie
- WHEN a user navigates to `/auth`
- THEN they MUST be allowed to view the page
- AND they MUST NOT be redirected to `/login`

**Acceptance Criteria:**
- Middleware matcher includes `/auth` in the list of routes to check
- Middleware logic allows unauthenticated access to `/auth`
- Unauthenticated users can view the auth landing page
- No redirect occurs for unauthenticated users on `/auth`

#### Scenario: Authenticated access to /auth redirects to dashboard

- GIVEN a valid session cookie exists
- WHEN a user navigates to `/auth`
- THEN they MUST be redirected to `/dashboard`
- AND they MUST NOT see the auth landing page

**Acceptance Criteria:**
- Middleware checks for valid session on `/auth` route
- If session exists, redirect to `/dashboard`
- Authenticated users cannot access `/auth` (already logged in)
- Redirect is immediate (no flash of content)

#### Scenario: Middleware matcher includes /auth route

- GIVEN the middleware configuration
- WHEN the middleware is initialized
- THEN the matcher MUST include `/auth` in the list of protected routes
- AND the matcher MUST NOT include `/auth` in the list of public routes

**Acceptance Criteria:**
- `middleware.ts` matcher config includes `/auth`
- Middleware function handles `/auth` route explicitly
- Route is checked for authentication status
- Test by navigating to `/auth` with and without session

---

## ADDED Requirements

### Requirement: Login Page Role Query Parameter

The login page MUST accept and handle a `role` query parameter to pre-populate or guide the login flow.

#### Scenario: Login page receives role query parameter

- GIVEN a user navigates to `/login?role=SPECIALIST`
- WHEN the login page loads
- THEN the page MUST read the `role` query parameter
- AND the page MAY display role-specific messaging or styling
- AND the role parameter MUST be preserved through the login flow

**Acceptance Criteria:**
- Login page uses `useSearchParams()` to read `role` parameter
- Valid values: `SPECIALIST`, `CLIENT`
- Invalid or missing values are handled gracefully (no error)
- Role context is maintained after successful login

#### Scenario: Login page with CLIENT role parameter

- GIVEN a user navigates to `/login?role=CLIENT`
- WHEN the login page loads
- THEN the page MUST read `role=CLIENT` from query parameters
- AND the page MAY display client-specific context

**Acceptance Criteria:**
- Query parameter is read correctly
- Page renders without errors
- Login flow completes successfully

---

### Requirement: Register Page Role Query Parameter

The register page MUST accept and handle a `role` query parameter to pre-select the user role in the registration form.

#### Scenario: Register page receives role query parameter

- GIVEN a user navigates to `/register?role=SPECIALIST`
- WHEN the register page loads
- THEN the page MUST read the `role` query parameter
- AND the role selector MUST be pre-selected to SPECIALIST
- AND the user MAY change the role selection if desired

**Acceptance Criteria:**
- Register page uses `useSearchParams()` to read `role` parameter
- Valid values: `SPECIALIST`, `CLIENT`
- Role selector is pre-selected based on query parameter
- User can still change role selection manually
- Invalid or missing values default to no selection (current behavior)

#### Scenario: Register page with CLIENT role parameter

- GIVEN a user navigates to `/register?role=CLIENT`
- WHEN the register page loads
- THEN the role selector MUST be pre-selected to CLIENT
- AND the client-specific fields (companyName, inn) MUST be visible

**Acceptance Criteria:**
- Query parameter is read correctly
- Role selector shows CLIENT as selected
- Client fields are visible immediately
- Registration flow completes successfully

#### Scenario: Register page with invalid role parameter

- GIVEN a user navigates to `/register?role=INVALID`
- WHEN the register page loads
- THEN the page MUST handle the invalid value gracefully
- AND the role selector MUST default to no selection
- AND no error MUST be displayed to the user

**Acceptance Criteria:**
- Invalid role values are ignored
- Page renders without errors
- User can select role manually
- No console errors or warnings
