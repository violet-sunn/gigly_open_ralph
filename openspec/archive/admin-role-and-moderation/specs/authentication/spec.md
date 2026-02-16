# Authentication Specification - Admin Role & Moderation Changes

## MODIFIED Requirements

### Requirement: Registration Action with Session and Role

**MODIFIED Scenario: Registration with invalid role**
- GIVEN form data with an invalid role (e.g., "HACKER", "ADMIN", "USER")
- WHEN `registerUser` is called
- THEN it MUST return `{ error: 'Please select a role.' }`
- AND no user MUST be created

**Acceptance Criteria:**
- `registerUser` reads `formData.get('role')` and validates it is EXACTLY `"CLIENT"` or `"SPECIALIST"`
- ADMIN role MUST be explicitly rejected during registration
- On success: `createSession()` is called with role, then `redirect('/dashboard')`
- On failure: `{ error: string }` is returned

---

### Requirement: Login Server Action

**ADDED Scenario: Login attempt by suspended user**
- GIVEN a registered user with `suspended = true`
- WHEN the `loginUser` action is called with correct credentials
- THEN it MUST return `{ error: 'Your account has been suspended. Please contact support.' }`
- AND it MUST NOT create a session
- AND the user MUST NOT be logged in

**Acceptance Criteria:**
- `loginUser` checks `user.suspended` field after password verification
- Suspended users cannot log in even with correct credentials
- Error message clearly indicates suspension status
- On success: sets session cookie (with role) and calls `redirect('/dashboard')`
- On failure: returns `{ error: string }`

---

### Requirement: Middleware Route Protection

**ADDED Scenario: Admin access to /admin routes**
- GIVEN a valid session cookie with role "ADMIN"
- WHEN a user navigates to `/admin` or `/admin/*`
- THEN they MUST be allowed access

**ADDED Scenario: Non-admin access to /admin routes**
- GIVEN a valid session cookie with role "CLIENT" or "SPECIALIST"
- WHEN a user navigates to `/admin` or `/admin/*`
- THEN they MUST be redirected to `/dashboard`

**ADDED Scenario: Unauthenticated access to /admin routes**
- GIVEN no valid session cookie
- WHEN a user navigates to `/admin` or `/admin/*`
- THEN they MUST be redirected to `/login`

**Acceptance Criteria:**
- `middleware.ts` matcher includes `/admin/:path*`
- Middleware checks session role and redirects non-ADMIN users to `/dashboard`
- ADMIN users can access both `/dashboard` and `/admin` routes
- `verifySession` return type includes `role` field

---

## ADDED Requirements

### Requirement: Admin Role in Session
The system MUST include ADMIN role in session management and recognize it as a valid role.

#### Scenario: ADMIN user session creation
- GIVEN a user with role "ADMIN" logs in successfully
- WHEN the session is created
- THEN the JWT payload MUST contain `role: "ADMIN"`
- AND the session cookie MUST be set with the ADMIN role

#### Scenario: ADMIN user session reading
- GIVEN a request with a valid session cookie containing role "ADMIN"
- WHEN `getSession()` is called
- THEN it MUST return the decoded payload with `role: "ADMIN"`

**Acceptance Criteria:**
- `createSession()` accepts "ADMIN" as a valid role parameter
- `getSession()` returns role "ADMIN" when present in JWT
- Session type definitions include "ADMIN" in role union type
