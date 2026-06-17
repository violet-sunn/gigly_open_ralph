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
The registration Server Action MUST accept a role, validate it, create a session, and redirect on success — and MUST
**additively** (compose-auth-onboarding) (a) enforce a confirm-password match when a confirm-password is supplied, and
(b) persist the supplied role-specific profile (`ClientProfile`/`SpecialistProfile`) in the same transaction as the
`User`. The action signature, rate limiting, password hashing, password-strength validation, and role validation are
preserved; behaviour for callers that supply only email/password/role (no confirm-password, no profile) is unchanged.

#### Scenario: Redirect and auto-login after successful registration
- GIVEN a valid registration submission with role "CLIENT" or "SPECIALIST"
- WHEN the user is created successfully
- THEN a session cookie MUST be set with the new user's ID, email, and role
- AND the action MUST redirect to `/dashboard`

#### Scenario: Registration with invalid role
- GIVEN form data with an invalid role (e.g., "HACKER", "ADMIN", "USER")
- WHEN `registerUser` is called
- THEN it MUST return an `{ error }` and no user MUST be created

#### Scenario: Confirm-password mismatch is rejected (when supplied)
- GIVEN a registration submission that includes a `confirmPassword` field
- WHEN `confirmPassword` does not equal `password`
- THEN `registerUser` MUST return an `{ error }` (e.g. «Пароли не совпадают.») AND no user MUST be created
- AND WHEN no `confirmPassword` field is supplied (single-step callers), the check MUST be skipped (unchanged behaviour)

#### Scenario: Step-3 profile is persisted with the user
- GIVEN a registration submission that includes role-specific profile fields
- WHEN the user is created
- THEN the matching profile MUST be created in the same transaction — CLIENT → `ClientProfile` (companyName, inn,
  contactPerson, phoneNumber); SPECIALIST → `SpecialistProfile` (displayName, position, specialization, experienceLevel,
  techStack, timezone) — with free-text sanitized and dropdown values validated against the datasets
  (`SPECIALIZATIONS`/`EXPERIENCE_LEVELS`/`TIMEZONES`; invalid coerced to `''`)
- AND WHEN no profile fields are supplied, no profile MUST be created (unchanged behaviour)

#### Scenario: Error returned on failure
- GIVEN a registration submission that fails (e.g., duplicate email)
- WHEN the Server Action catches the error
- THEN it MUST return an object with an error message AND the form MUST display that message

**Acceptance Criteria:**
- `registerUser` reads `formData.get('role')` and validates it is `"CLIENT"` or `"SPECIALIST"`; on success `createSession()` then `redirect('/dashboard')`; on failure `{ error: string }`; signature compatible with `useActionState`
- Confirm-password mismatch (when supplied) → error, no user; absent → skipped (backward-compatible)
- Role-specific profile (when supplied) persisted in the same transaction, dataset-validated; absent → no profile (backward-compatible)
- Rate limiting, password hashing, and password-strength validation preserved

---

### Requirement: Registration Page UI Design
The registration page (`/register`) MUST be the kit-composed 3-step onboarding wizard (`RegisterWizard`,
compose-auth-onboarding) — composed from `AuthLayout` + `StepIndicator` + `RoleCards` + form primitives, token-pure (no
hardcoded hex/px literals) — replacing the prior single-step hardcoded-Figma page. It MUST preserve role preselection
from `?role=`, the RU copy, the decorative checkerboard footer (the exported asset), responsiveness, and all existing
authentication functionality (validation, rate limiting, session creation). Fidelity is measured against the references
(auth/reg/reg-customer/reg-specialist), with F1 ≤1% deferred on the font-licence gate.

#### Scenario: Registration page is the composed 3-step wizard
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN it MUST render `<RegisterWizard>` inside `AuthLayout`, showing a `StepIndicator` with three steps (role →
  credentials → role-specific profile), the heading «Регистрация», and the exported checkerboard footer
  (`/assets/design-system/patterns/checkerboard.svg`) — composed from the kit, token-pure (no `className`/`style`/hex in
  the screen)

#### Scenario: Role pre-selection from query parameter
- GIVEN a user navigates to `/register?role=SPECIALIST` (or `=CLIENT`)
- WHEN the page renders
- THEN step 1 MUST pre-select that role; an absent/invalid `?role=` MUST start with no preselection (both roles
  selectable)

#### Scenario: Role-specific profile step
- GIVEN the wizard reaches step 3
- WHEN the chosen role is CLIENT vs SPECIALIST
- THEN it MUST present the company profile (`reg-customer`) vs the specialist profile (`reg-specialist`), the specialist
  dropdowns bound to the datasets (`SPECIALIZATIONS`/`EXPERIENCE_LEVELS`/`TIMEZONES`)

#### Scenario: Responsive
- GIVEN a user views `/register` on a mobile viewport (< 768px)
- WHEN the page renders
- THEN the composed card MUST remain functional and readable and the footer MUST scale (the `AuthLayout` is responsive
  via tokens)

**Acceptance Criteria:**
- `/register` renders the F5-pure composed `RegisterWizard` (AuthLayout + StepIndicator + RoleCards + form primitives); token-pure (no hardcoded hex/px)
- 3 steps with a `StepIndicator`; «Регистрация» heading; exported checkerboard footer renders; responsive
- Role preselect from `?role=`; role-specific step 3 with dataset-bound dropdowns
- All existing authentication functionality preserved (validation, rate limiting, session creation); fidelity vs the references with F1 ≤1% deferred on the font-licence gate

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
