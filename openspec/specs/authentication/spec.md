# Authentication Specification

## Requirements

### Requirement: Password Hashing
The registration Server Action MUST hash passwords before storing them in the database.

#### Scenario: Password is hashed on registration
- GIVEN a user submits a registration form with a plaintext password
- WHEN the Server Action processes the request
- THEN the password MUST be hashed using bcrypt before being saved
- AND the stored password MUST NOT equal the plaintext input

**Acceptance Criteria:**
- `bcryptjs` package is installed
- `registerUser` action hashes the password with `bcrypt.hash()` before `prisma.user.create()`
- Stored password in the database is a bcrypt hash (starts with `$2a$` or `$2b$`)

---

### Requirement: Registration Action with Session and Role
The registration Server Action MUST accept a role, validate it, create a session, and redirect on success.

#### Scenario: Redirect and auto-login after successful registration
- GIVEN a valid registration submission with role "CLIENT" or "SPECIALIST"
- WHEN the user is created successfully
- THEN a session cookie MUST be set with the new user's ID, email, and role
- AND the action MUST redirect to `/dashboard`

#### Scenario: Registration with invalid role
- GIVEN form data with an invalid role (e.g., "HACKER", "ADMIN", "USER")
- WHEN `registerUser` is called
- THEN it MUST return `{ error: 'Please select a role.' }`
- AND no user MUST be created

#### Scenario: Error returned on failure
- GIVEN a registration submission that fails (e.g., duplicate email)
- WHEN the Server Action catches the error
- THEN it MUST return an object with an error message
- AND the form MUST display that message to the user

**Acceptance Criteria:**
- `registerUser` reads `formData.get('role')` and validates it is `"CLIENT"` or `"SPECIALIST"`
- On success: `createSession()` is called with role, then `redirect('/dashboard')`
- On failure: `{ error: string }` is returned
- The `registerUser` function signature is compatible with `useActionState`

---

### Requirement: Login Server Action
The system MUST provide a `loginUser` server action that authenticates users by email and password.

#### Scenario: Successful login with valid credentials
- GIVEN a registered user with a known email and password
- WHEN the `loginUser` action is called with matching credentials
- THEN it MUST verify the password against the stored bcrypt hash using `bcrypt.compare()`
- AND it MUST create a session (JWT cookie) including the user's role
- AND it MUST redirect to `/dashboard`

#### Scenario: Login with incorrect password
- GIVEN a registered user
- WHEN the `loginUser` action is called with the correct email but wrong password
- THEN it MUST return `{ error: 'Invalid email or password.' }`
- AND it MUST NOT create a session

#### Scenario: Login with non-existent email
- GIVEN no user exists with the provided email
- WHEN the `loginUser` action is called
- THEN it MUST return `{ error: 'Invalid email or password.' }`
- AND the error message MUST NOT reveal whether the email exists

**Acceptance Criteria:**
- `loginUser` is exported from `app/actions/auth.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- Uses `bcrypt.compare()` to verify passwords
- On success: sets session cookie (with role) and calls `redirect('/dashboard')`
- On failure: returns `{ error: string }`

---

### Requirement: Session Management
The system MUST manage user sessions using signed JWTs stored in HTTP-only cookies.

#### Scenario: Session creation
- GIVEN a successful login or registration
- WHEN the session is created
- THEN a JWT MUST be signed with the `SESSION_SECRET` environment variable
- AND the JWT payload MUST contain `userId`, `email`, and `role`
- AND the JWT MUST have a 7-day expiration
- AND the token MUST be stored in an HTTP-only cookie named `session`

#### Scenario: Session reading
- GIVEN a request with a valid `session` cookie
- WHEN `getSession()` is called
- THEN it MUST return the decoded JWT payload with `userId`, `email`, and `role`

#### Scenario: Session reading with invalid/expired token
- GIVEN a request with an invalid or expired `session` cookie
- WHEN `getSession()` is called
- THEN it MUST return `null`

#### Scenario: Session destruction (logout)
- GIVEN an authenticated user
- WHEN `logoutUser()` is called
- THEN the `session` cookie MUST be deleted
- AND the user MUST be redirected to `/`

**Acceptance Criteria:**
- `lib/session.ts` exports `createSession(userId, email, role)`, `getSession()`, and `destroySession()`
- Uses `jose` library for JWT sign/verify
- Cookie settings: `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/'`
- `SESSION_SECRET` is read from environment variables
- JWT expiration is 7 days

---

### Requirement: Logout Action
The system MUST provide a `logoutUser` server action that destroys the session.

#### Scenario: Authenticated user logs out
- GIVEN an authenticated user
- WHEN the logout action is invoked
- THEN the session cookie MUST be cleared
- AND the user MUST be redirected to `/`

**Acceptance Criteria:**
- `logoutUser` is exported from `app/actions/auth.ts` with `'use server'`
- Calls `destroySession()` from `lib/session.ts`
- Redirects to `/` after clearing the cookie

---

### Requirement: Middleware Route Protection
The system MUST use Next.js middleware to protect routes based on session state.

#### Scenario: Unauthenticated access to /dashboard
- GIVEN no valid session cookie
- WHEN a user navigates to `/dashboard`
- THEN they MUST be redirected to `/login`

#### Scenario: Authenticated access to /login or /register
- GIVEN a valid session cookie
- WHEN a user navigates to `/login` or `/register`
- THEN they MUST be redirected to `/dashboard`

**Acceptance Criteria:**
- `middleware.ts` exists in project root
- Uses `jose` directly for JWT verification (Edge-compatible)
- Matcher covers `/dashboard/:path*`, `/login`, `/register`
- `verifySession` return type includes `role`
