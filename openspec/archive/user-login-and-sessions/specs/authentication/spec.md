# Authentication Specification Delta

## ADDED Requirements

### Requirement: Login Server Action
The system MUST provide a `loginUser` server action that authenticates users by email and password.

#### Scenario: Successful login with valid credentials
- GIVEN a registered user with email "user@example.com" and a known password
- WHEN the `loginUser` action is called with matching email and password
- THEN it MUST verify the password against the stored bcrypt hash using `bcrypt.compare()`
- AND it MUST create a session (JWT cookie)
- AND it MUST redirect to `/`

#### Scenario: Login with incorrect password
- GIVEN a registered user with email "user@example.com"
- WHEN the `loginUser` action is called with the correct email but wrong password
- THEN it MUST return `{ error: 'Invalid email or password.' }`
- AND it MUST NOT create a session

#### Scenario: Login with non-existent email
- GIVEN no user exists with email "nobody@example.com"
- WHEN the `loginUser` action is called with that email
- THEN it MUST return `{ error: 'Invalid email or password.' }`
- AND the error message MUST NOT reveal whether the email exists

**Acceptance Criteria:**
- `loginUser` is exported from `app/actions/auth.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- Uses `bcrypt.compare()` to verify passwords
- On success: sets session cookie and calls `redirect('/')`
- On failure: returns `{ error: string }`

---

### Requirement: Session Management
The system MUST manage user sessions using signed JWTs stored in HTTP-only cookies.

#### Scenario: Session creation on login
- GIVEN a successful login
- WHEN the session is created
- THEN a JWT MUST be signed with the `SESSION_SECRET` environment variable
- AND the JWT payload MUST contain `userId` and `email`
- AND the JWT MUST have a 7-day expiration
- AND the token MUST be stored in an HTTP-only cookie named `session`

#### Scenario: Session creation on registration
- GIVEN a successful registration
- WHEN the user is created in the database
- THEN a session cookie MUST be set before redirecting
- AND the user MUST be logged in automatically

#### Scenario: Session reading
- GIVEN a request with a valid `session` cookie
- WHEN `getSession()` is called
- THEN it MUST return the decoded JWT payload with `userId` and `email`

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
- `lib/session.ts` exports `createSession(userId, email)`, `getSession()`, and `destroySession()`
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

## MODIFIED Requirements

### Requirement: Registration Action Session
The existing `registerUser` action MUST create a session after successful registration.

#### Scenario: Auto-login after registration
- GIVEN a valid registration submission
- WHEN the user is created successfully
- THEN a session cookie MUST be set with the new user's ID and email
- AND the user MUST be redirected to `/`

**Acceptance Criteria:**
- `registerUser` calls `createSession(user.id, user.email)` after `prisma.user.create()`
- The redirect still happens after session creation
