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

### Requirement: Registration Page UI Design
The registration page MUST match the approved Figma design specifications while maintaining all existing authentication functionality.

#### Scenario: Registration page displays bilingual heading
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN the heading MUST display "Регистрация" (Russian)
- AND the page MUST be accessible to English-speaking users through visual context

#### Scenario: Registration page uses exact Figma styling
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN the container MUST be 418px wide on desktop, 90vw on mobile
- AND the container MUST have 25px border-radius
- AND the container MUST have 40px padding on desktop, 20px on mobile
- AND input fields MUST have #10121c background and #242935 border
- AND input fields MUST have 20px border-radius and 20px padding
- AND the submit button MUST be 50px height with #0088FF background
- AND the submit button text MUST be "Зарегестрироватся" (Russian)
- AND the secondary link text MUST be "Войти" (Russian)

#### Scenario: Registration page displays decorative background pattern
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN a decorative checkerboard pattern MUST be visible at the bottom
- AND the pattern MUST use #0088ff color at 0.3 opacity
- AND the pattern MUST be 327px height and full width
- AND the pattern MUST NOT interfere with form interaction

#### Scenario: Registration page pre-selects role from query parameter
- GIVEN a user navigates to `/register?role=SPECIALIST`
- WHEN the page renders
- THEN the SPECIALIST role card MUST be pre-selected with blue border
- AND the CLIENT role card MUST be visible but not selected
- AND this behavior MUST match the existing implementation

#### Scenario: Registration page shows both roles when no parameter provided
- GIVEN a user navigates to `/register` without role parameter
- WHEN the page renders
- THEN both CLIENT and SPECIALIST role cards MUST be visible
- AND neither card MUST be pre-selected
- AND the user MUST be able to select either role
- AND this behavior MUST match the existing implementation

#### Scenario: Registration page is responsive on mobile
- GIVEN a user views `/register` on a mobile device (viewport < 768px)
- WHEN the page renders
- THEN the container width MUST be 90vw
- AND the container padding MUST be 20px
- AND all form elements MUST remain functional and readable
- AND the decorative pattern MUST scale appropriately

**Acceptance Criteria:**
- Registration page at `/register` matches Figma design (node-id=4100-385)
- Heading displays "Регистрация" in 22px font
- Input fields use exact color values (#10121c, #242935) with 20px border-radius and padding
- Submit button displays "Зарегестрироватся" with 50px height and #0088FF background
- Secondary link displays "Войти" with rgba(0,136,255,0.24) background
- Decorative checkerboard pattern renders at bottom (327px height, full width)
- Role pre-selection from query parameter works correctly
- Both role cards display when no parameter provided
- Responsive design works on mobile viewports (90vw width, 20px padding)
- All existing authentication functionality preserved (validation, rate limiting, session creation)
- All existing E2E tests pass without modification

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

---

### Requirement: Password Validation Utility
The system MUST provide a password validation utility that enforces minimum strength requirements and prevents bcrypt DoS attacks.

#### Scenario: Valid password passes all requirements
- GIVEN a password "SecurePass123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND no error message MUST be included

#### Scenario: Password too long (bcrypt DoS prevention)
- GIVEN a password with 73 characters
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must not exceed 72 characters." }`
- AND this prevents bcrypt from blocking the event loop with excessively long passwords

#### Scenario: Password too short
- GIVEN a password "Abc1" (4 characters)
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must be at least 8 characters long." }`

#### Scenario: Password missing uppercase letter
- GIVEN a password "lowercase123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must contain at least one uppercase letter." }`

#### Scenario: Password missing lowercase letter
- GIVEN a password "UPPERCASE123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must contain at least one lowercase letter." }`

#### Scenario: Password missing number
- GIVEN a password "NoNumbers"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must contain at least one number." }`

#### Scenario: Password with invalid characters (Cyrillic/Unicode)
- GIVEN a password "Пароль123" (contains Cyrillic characters)
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password can only contain Latin letters, numbers, and special characters." }`
- AND character whitelist validation MUST reject non-Latin characters

#### Scenario: Password with invalid characters checked first
- GIVEN a password "Пароль" (Cyrillic, also too short and missing number)
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password can only contain Latin letters, numbers, and special characters." }`
- AND character whitelist check MUST happen before other validations

#### Scenario: Password with multiple violations
- GIVEN a password "abc" (too short, no uppercase, no number)
- WHEN `validatePassword` is called
- THEN it MUST return the error for the first failed requirement
- AND it MUST check requirements in order: max length, min length, uppercase, lowercase, number

#### Scenario: Password with special characters is allowed
- GIVEN a password "Secure@Pass123!"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND special characters MUST NOT be required but MUST be allowed

#### Scenario: Password with spaces is allowed
- GIVEN a password "My Secure Pass 123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND spaces MUST be treated as valid characters

#### Scenario: Password at exactly 72 characters
- GIVEN a password with exactly 72 characters meeting all requirements
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND 72 characters is the maximum allowed (bcrypt limit)

**Acceptance Criteria:**
- `validatePassword` is exported from `lib/password.ts`
- Function signature: `validatePassword(password: string): { valid: boolean; error?: string }`
- Validation order: character whitelist → max length (72) → min length (8) → uppercase → lowercase → number
- Returns specific error message for first failed requirement
- Uses standard ASCII regex (`/[A-Z]/` and `/[a-z]/`) for Latin-only character validation
- Character whitelist rejects Unicode/Cyrillic characters
- Maximum length check prevents bcrypt DoS (72 character limit, safe with ASCII-only)
- No external dependencies (uses built-in JavaScript)
- Pure function with no side effects

---

### Requirement: Registration Password Validation
The system MUST validate password strength during user registration before hashing.

#### Scenario: Registration with strong password succeeds
- GIVEN a user submits registration with password "SecurePass123"
- WHEN `registerUser` is called
- THEN password validation MUST pass
- AND the password MUST be hashed
- AND the user MUST be created successfully
- AND the user MUST be redirected to `/dashboard`

#### Scenario: Registration with invalid characters fails
- GIVEN a user submits registration with password "Пароль123" (contains Cyrillic)
- WHEN `registerUser` is called
- THEN password validation MUST fail
- AND it MUST return `{ error: "Password can only contain Latin letters, numbers, and special characters." }`
- AND the password MUST NOT be hashed
- AND no user MUST be created

#### Scenario: Registration with too-long password fails
- GIVEN a user submits registration with password containing 73+ characters
- WHEN `registerUser` is called
- THEN password validation MUST fail
- AND it MUST return `{ error: "Password must not exceed 72 characters." }`
- AND the password MUST NOT be hashed
- AND no user MUST be created

#### Scenario: Registration with weak password fails
- GIVEN a user submits registration with password "weak"
- WHEN `registerUser` is called
- THEN password validation MUST fail
- AND it MUST return `{ error: "Password must be at least 8 characters long." }`
- AND the password MUST NOT be hashed
- AND no user MUST be created

#### Scenario: Registration with password missing uppercase fails
- GIVEN a user submits registration with password "lowercase123"
- WHEN `registerUser` is called
- THEN it MUST return `{ error: "Password must contain at least one uppercase letter." }`
- AND no user MUST be created

#### Scenario: Registration with password missing lowercase fails
- GIVEN a user submits registration with password "UPPERCASE123"
- WHEN `registerUser` is called
- THEN it MUST return `{ error: "Password must contain at least one lowercase letter." }`
- AND no user MUST be created

#### Scenario: Registration with password missing number fails
- GIVEN a user submits registration with password "NoNumbers"
- WHEN `registerUser` is called
- THEN it MUST return `{ error: "Password must contain at least one number." }`
- AND no user MUST be created

#### Scenario: Validation happens before hashing
- GIVEN a user submits registration with invalid password
- WHEN `registerUser` is called
- THEN password validation MUST happen first
- AND `bcrypt.hash()` MUST NOT be called
- AND no database query MUST be executed

#### Scenario: Existing users can still login with old passwords
- GIVEN a user registered before password requirements were implemented
- AND their password is "weak" (does not meet current requirements)
- WHEN they attempt to login
- THEN login MUST succeed
- AND password validation MUST NOT be applied to login
- AND only registration enforces password requirements

**Acceptance Criteria:**
- `registerUser` calls `validatePassword()` before `bcrypt.hash()`
- Validation happens after extracting password from formData
- Returns validation error immediately if password is invalid
- No database operations occur if validation fails
- Existing users with weak passwords can still login (no validation on login)
- Error messages are user-friendly and actionable
- Character whitelist rejects Unicode/Cyrillic passwords with clear error message
- Maximum length check prevents bcrypt DoS attacks (safe with ASCII-only)

---

### Requirement: Password Validation Error Messages
The system MUST provide clear, specific error messages for each password requirement violation.

#### Scenario: Error message specifies maximum length requirement
- GIVEN a password that exceeds 72 characters
- WHEN validation fails
- THEN the error message MUST state "Password must not exceed 72 characters."
- AND it MUST explain this prevents bcrypt DoS attacks

#### Scenario: Error message specifies minimum length requirement
- GIVEN a password that is too short
- WHEN validation fails
- THEN the error message MUST state "Password must be at least 8 characters long."
- AND it MUST NOT use generic messages like "Password is too weak"

#### Scenario: Error message specifies uppercase requirement
- GIVEN a password missing uppercase letters
- WHEN validation fails
- THEN the error message MUST state "Password must contain at least one uppercase letter."

#### Scenario: Error message specifies lowercase requirement
- GIVEN a password missing lowercase letters
- WHEN validation fails
- THEN the error message MUST state "Password must contain at least one lowercase letter."

#### Scenario: Error message specifies number requirement
- GIVEN a password missing numbers
- WHEN validation fails
- THEN the error message MUST state "Password must contain at least one number."

#### Scenario: Only first violation is reported
- GIVEN a password with multiple violations
- WHEN validation fails
- THEN only the first failed requirement MUST be reported
- AND the user MUST fix issues one at a time

**Acceptance Criteria:**
- Error messages are specific and actionable
- Messages explain what is required, not just what is wrong
- Consistent message format across all requirements
- Messages are in English (Russian localization deferred)
- No technical jargon or implementation details
- Maximum length error message included

---

### Requirement: Password Validation Test Coverage
The system MUST include comprehensive tests verifying password validation works correctly.

#### Scenario: Unit tests verify validation logic
- GIVEN unit tests for `validatePassword` function
- WHEN tests are executed
- THEN they MUST verify:
  - Valid passwords pass (multiple examples with Latin letters only)
  - Invalid characters fail with correct error (Unicode/Cyrillic rejected)
  - Too-long passwords fail with correct error (> 72 chars)
  - Too-short passwords fail with correct error (< 8 chars)
  - Missing uppercase fails with correct error
  - Missing lowercase fails with correct error
  - Missing number fails with correct error
  - Special characters are allowed
  - Spaces are allowed
  - Character whitelist check happens first
  - Multiple violations return first error only
  - Edge cases: empty string, exactly 8 chars, exactly 72 chars

#### Scenario: Integration tests verify registration enforcement
- GIVEN integration tests added to existing `registration.test.ts` file
- WHEN tests are executed
- THEN they MUST verify:
  - Strong password allows registration
  - Invalid characters block registration with correct error (Cyrillic rejected)
  - Too-long password blocks registration with correct error
  - Too-short password blocks registration with correct error
  - Each requirement violation is tested
  - No user is created when validation fails
  - Password is not hashed when validation fails
- AND tests MUST use existing test infrastructure (no duplicate mocking)

#### Scenario: Tests verify existing users can login
- GIVEN integration tests added to existing `login.test.ts` file
- WHEN a user with weak password (created before requirements) attempts login
- THEN tests MUST verify login succeeds
- AND password validation is NOT applied to login
- AND tests MUST use existing test infrastructure (no duplicate mocking)

#### Scenario: Tests verify character whitelist enforcement
- GIVEN tests with invalid character passwords (Cyrillic, emoji, etc.)
- WHEN tests are executed
- THEN they MUST verify:
  - Unicode/Cyrillic characters are rejected with correct error
  - Character whitelist check happens before other validations
  - Only Latin letters, numbers, and standard special characters are allowed

**Acceptance Criteria:**
- Unit tests for `validatePassword` utility (minimum 12 test cases)
- Integration tests added to existing `registration.test.ts` (minimum 7 test cases)
- Integration test added to existing `login.test.ts` (1 test case for backward compatibility)
- All tests MUST pass before deployment
- Tests use realistic password examples
- Edge cases covered (empty string, exactly 8 chars, exactly 72 chars, invalid characters)
- Tests integrated into existing test infrastructure (no parallel testing pipeline)
- No duplicate mocking setup - uses existing helpers and patterns
