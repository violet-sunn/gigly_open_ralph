# Authentication Specification Delta

## MODIFIED Requirements

### Requirement: Homepage Authentication Entry Point
The homepage MUST link to `/auth` as the primary authentication entry point, not directly to `/register`.

#### Scenario: Unauthenticated user clicks "Get Started" on homepage
- GIVEN an unauthenticated user visits the homepage `/`
- WHEN they click the "Get Started" button
- THEN they MUST be navigated to `/auth`
- AND they MUST see the role selection interface
- AND they can choose to login or register after selecting a role

**Acceptance Criteria:**
- Homepage "Get Started" button links to `/auth` (not `/register`)
- Link uses Next.js `<Link>` component for client-side navigation
- Button styling and accessibility remain unchanged

---

### Requirement: Internal Authentication Links
All internal application links to authentication pages MUST use `/auth` as the entry point, not direct links to `/login` or `/register`.

#### Scenario: Internal links point to unified auth entry
- GIVEN any page in the application with authentication links
- WHEN the page renders
- THEN authentication links MUST point to `/auth`
- AND direct links to `/login` or `/register` MUST be replaced with `/auth`
- EXCEPT where role-specific context is already established (e.g., register page linking to login)

#### Scenario: Register page links to login
- GIVEN a user is on the `/register` page
- WHEN they click the "Войти" (Login) button
- THEN they MAY be navigated directly to `/login` (preserving existing behavior)
- OR they MAY be navigated to `/auth` (improved consistency)
- AND this is an implementation decision based on UX considerations

**Acceptance Criteria:**
- Audit all `.tsx` files for links to `/login` and `/register`
- Update homepage and other entry points to use `/auth`
- Document any exceptions where direct links are preserved
- Maintain existing link styling and accessibility

---

### Requirement: Backward Compatibility for Direct Auth URLs
Direct access to `/login` and `/register` URLs MUST continue to work for users with bookmarked links.

#### Scenario: User accesses /login directly
- GIVEN a user has bookmarked `/login` or types it directly
- WHEN they navigate to `/login`
- THEN they MUST see the login page
- AND they MUST be able to authenticate successfully
- AND no redirect to `/auth` MUST occur (preserving direct access)

#### Scenario: User accesses /register directly
- GIVEN a user has bookmarked `/register` or types it directly
- WHEN they navigate to `/register`
- THEN they MUST see the registration page
- AND they MUST be able to register successfully
- AND no redirect to `/auth` MUST occur (preserving direct access)

#### Scenario: Query parameters are preserved
- GIVEN a user accesses `/login?role=SPECIALIST` directly
- WHEN the page loads
- THEN the role parameter MUST be preserved and displayed
- AND the existing role pre-selection behavior MUST work

**Acceptance Criteria:**
- Direct navigation to `/login` and `/register` works without redirects
- Query parameters (e.g., `?role=SPECIALIST`) are preserved
- Middleware does not redirect authenticated users from these pages to `/auth`
- Existing middleware behavior (redirect authenticated users to `/dashboard`) is preserved

---

### Requirement: Middleware Auth Route Configuration
The middleware MUST allow unauthenticated access to `/auth` and redirect authenticated users to `/dashboard`.

#### Scenario: Middleware allows unauthenticated access to /auth
- GIVEN an unauthenticated user
- WHEN they navigate to `/auth`
- THEN the middleware MUST allow the request to proceed
- AND they MUST see the auth landing page with role selection

#### Scenario: Middleware redirects authenticated users from /auth
- GIVEN an authenticated user with a valid session
- WHEN they navigate to `/auth`
- THEN the middleware MUST redirect them to `/dashboard`
- AND they MUST NOT see the auth landing page

**Acceptance Criteria:**
- Middleware configuration includes `/auth` in matcher
- Unauthenticated users can access `/auth` (existing behavior verified)
- Authenticated users are redirected from `/auth` to `/dashboard` (existing behavior verified)
- No changes to middleware logic required (already implemented correctly)

---

## ADDED Requirements

### Requirement: E2E Test Coverage for Auth Navigation Flow
The system MUST include E2E tests verifying the complete authentication navigation flow from homepage through role selection to login/register.

#### Scenario: Complete flow from homepage to login
- GIVEN an unauthenticated user on the homepage
- WHEN they click "Get Started"
- AND they select a role (SPECIALIST or CLIENT)
- AND they click "Войти" (Login)
- THEN they MUST arrive at `/login?role=SPECIALIST` or `/login?role=CLIENT`
- AND the role MUST be pre-selected on the login page

#### Scenario: Complete flow from homepage to register
- GIVEN an unauthenticated user on the homepage
- WHEN they click "Get Started"
- AND they select a role (SPECIALIST or CLIENT)
- AND they click "Зарегестрироватся" (Register)
- THEN they MUST arrive at `/register?role=SPECIALIST` or `/register?role=CLIENT`
- AND the role MUST be pre-selected on the registration page

#### Scenario: Direct login access still works
- GIVEN an unauthenticated user
- WHEN they navigate directly to `/login`
- THEN they MUST see the login page
- AND they MUST be able to login successfully
- AND no redirect to `/auth` MUST occur

#### Scenario: Direct register access still works
- GIVEN an unauthenticated user
- WHEN they navigate directly to `/register`
- THEN they MUST see the registration page
- AND they MUST be able to register successfully
- AND no redirect to `/auth` MUST occur

#### Scenario: Authenticated users redirected from auth pages
- GIVEN an authenticated user
- WHEN they navigate to `/auth`, `/login`, or `/register`
- THEN they MUST be redirected to `/dashboard`
- AND they MUST NOT see the authentication pages

**Acceptance Criteria:**
- E2E test file created at `__tests__/e2e/auth-navigation.spec.ts`
- Tests cover homepage → `/auth` → role selection → login flow
- Tests cover homepage → `/auth` → role selection → register flow
- Tests verify direct `/login` access works
- Tests verify direct `/register` access works
- Tests verify authenticated user redirects
- All tests pass before deployment
