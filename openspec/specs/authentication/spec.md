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
The registration Server Action (`registerUser`) MUST create the account and session from credentials + role ONLY
(reground-auth-to-design two-phase onboarding) and MUST NOT persist profile fields or redirect. On success it MUST
return `{ ok: true }` so the AuthDesign onboarding surface can advance to its step-3 profile-setup (which persists the
role-specific profile via `updateProfile`). It MUST keep: rate limiting (before validation), password-strength
validation, confirm-password match, role validation (CLIENT/SPECIALIST only, explicit ADMIN rejection), duplicate-email
handling, and auto-login (session creation). All user-facing messages MUST be in Russian.

#### Scenario: Account created at step 2, returns ok (no redirect)
- GIVEN a valid registration submission with role "CLIENT" or "SPECIALIST" and matching passwords
- WHEN the user is created successfully
- THEN a session cookie MUST be set with the new user's ID, email, and role (auto-login)
- AND the action MUST return `{ ok: true }` WITHOUT redirecting

#### Scenario: Profile is not collected by registerUser
- GIVEN `registerUser` succeeds
- THEN no `ClientProfile`/`SpecialistProfile` row is created by this action (profile setup is step-3's `updateProfile`)

#### Scenario: Registration with invalid role
- GIVEN form data with an invalid role (e.g., "HACKER", "ADMIN", "USER")
- WHEN `registerUser` is called
- THEN it MUST return a Russian `{ error }` and no user MUST be created

#### Scenario: Confirm-password mismatch is rejected (when supplied)
- GIVEN a registration submission that includes a `confirmPassword` field
- WHEN `confirmPassword` does not equal `password`
- THEN `registerUser` MUST return `{ error: 'Пароли не совпадают.' }` AND no user MUST be created

#### Scenario: Error returned on failure (Russian)
- GIVEN a registration submission that fails (e.g., duplicate email)
- WHEN the Server Action catches the error
- THEN it MUST return a Russian error message AND the form MUST display that message

**Acceptance Criteria:**
- `registerUser` reads `formData.get('role')`, validates `"CLIENT"`/`"SPECIALIST"` (ADMIN/invalid rejected); on success `createSession()` then returns `{ ok: true }` (no redirect, no profile); on failure `{ error: string }` (Russian); signature compatible with `useActionState`
- Confirm-password mismatch → error, no user
- Rate limiting, password hashing, and password-strength validation preserved; `buildProfileCreate` removed

---

### Requirement: Registration Page UI Design
The registration page (`/register`) MUST be rendered by `AuthDesign`'s onboarding view (the `app/_design/` rebuild
grounded in `gigly_full_design/Auth.dc.html`, reground-auth-to-design), replacing the kit `RegisterWizard`. It MUST
implement two-phase registration: step-2 «Зарегистрироваться» creates the account via `registerUser`; step-3
«Продолжить» saves the role-specific profile via `updateProfile` and redirects to `/dashboard`. Role is chosen at
step 1 (no `?role=` query). The prototype shell (GIGLY wordmark, blue-G logomark, Handjet/Manrope, pixel-wave, footer
links, diagonal role chips, step-dots) is reproduced; colours/fonts resolve from `app/_design/tokens.css`.

#### Scenario: Registration page is the AuthDesign 3-step onboarding
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN it MUST render the `AuthDesign` onboarding view: step 1 «СОЗДАЙТЕ СВОЙ АККАУНТ» with the diagonal Компания/
  Специалист chips and step-dots (no `?role=` preselection)

#### Scenario: New CLIENT completes onboarding
- GIVEN a user picks «Компания», registers at step 2, fills Компания/ФИО/Должность/Местоположение+TZ at step 3, and
  submits «Продолжить»
- THEN the account exists from step 2, the client profile is saved at step 3, and the user lands on `/dashboard`

#### Scenario: New SPECIALIST completes onboarding
- GIVEN a user picks «Специалист», registers, and fills ФИО/Специализация/Местоположение+TZ
- THEN the specialist profile is saved and the user lands on `/dashboard`

#### Scenario: Step-3 abandonment leaves a usable account
- GIVEN a user completes step 2 but leaves before finishing step 3
- THEN the account already exists (created at step 2) and the profile can be completed later in profile-edit

#### Scenario: Password mismatch caught at step 2
- GIVEN step-2 password and confirm differ
- THEN «Пароли не совпадают.» is shown and registration is blocked

**Acceptance Criteria:**
- `/register` renders `AuthDesign initialView="onboarding"`; prototype shell on `app/_design/tokens.css`
- Two-phase: step-2 `registerUser` (account), step-3 `updateProfile` (profile) → `/dashboard`; role chosen at step 1; no `?role=`
- Role-specific step 3 with dataset-bound dropdowns (`SPECIALIZATIONS`/`TIMEZONES`)

---

### Requirement: Login Server Action
The system MUST provide a `loginUser` server action that authenticates users by email and password. All user-facing
messages MUST be in Russian.

#### Scenario: Successful login with valid credentials
- GIVEN a registered user with a known email and password
- WHEN the `loginUser` action is called with matching credentials
- THEN it MUST verify the password against the stored bcrypt hash using `bcrypt.compare()`
- AND it MUST create a session (JWT cookie) including the user's role
- AND it MUST redirect to `/dashboard`

#### Scenario: Login with incorrect password (Russian)
- GIVEN a registered user
- WHEN the `loginUser` action is called with the correct email but wrong password
- THEN it MUST return `{ error: 'Неверный email или пароль. Проверьте данные и попробуйте снова.' }`
- AND it MUST NOT create a session

#### Scenario: Login with non-existent email (Russian)
- GIVEN no user exists with the provided email
- WHEN the `loginUser` action is called
- THEN it MUST return the same Russian "invalid credentials" error (MUST NOT reveal whether the email exists)

#### Scenario: Suspended account (Russian)
- GIVEN a suspended user with correct credentials
- WHEN `loginUser` is called
- THEN it MUST return a Russian "account suspended" error and MUST NOT create a session

**Acceptance Criteria:**
- `loginUser` is exported from `app/actions/auth.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- Uses `bcrypt.compare()` to verify passwords; Russian error copy
- On success: sets session cookie (with role) and calls `redirect('/dashboard')`
- On failure: returns `{ error: string }`

---

### Requirement: Login Screen and Login↔Register State Machine
`/login` MUST be rendered by `AuthDesign`'s `login` view (reground-auth-to-design): the «ВХОД В GIGLY» lockup
(blue-G logomark, Handjet heading, Manrope subtitle), Email + Пароль, a «Забыли пароль?» disclosure, a «Войти»
submit wired to `loginUser`, and a «Нет аккаунта? Создать аккаунт» link to onboarding. It MUST contain no English UI
strings, no role selector, and no checkerboard background. Login and onboarding are linked siblings.

#### Scenario: Login screen renders the design lockup
- GIVEN a user navigates to `/login`
- THEN «ВХОД В GIGLY», Email/Пароль fields, «Забыли пароль?», «Войти», and «Создать аккаунт» are shown — no English
  strings, role cards, or checkerboard

#### Scenario: Switch login → onboarding
- WHEN the user clicks «Создать аккаунт» on login
- THEN the onboarding view is shown («СОЗДАЙТЕ СВОЙ АККАУНТ»)

#### Scenario: Switch onboarding → login
- WHEN the user clicks «Войти» on onboarding step 2
- THEN the login view is shown

#### Scenario: Password reset entry routes to manual recovery
- GIVEN the login screen renders
- WHEN the user clicks «Забыли пароль?»
- THEN an inline note discloses that recovery is currently handled by hand and offers a `mailto:` contact
- AND no automated reset flow is triggered — self-service reset (token + email delivery) remains out of scope

**Acceptance Criteria:**
- `/login` renders `AuthDesign initialView="login"`; no English/role-selector/checkerboard
- «Создать аккаунт» ↔ «Войти» switch views
- «Забыли пароль?» is a `type="button"` disclosure (never a form submit) that toggles the manual-recovery note; it MUST
  NOT be a dead `href="#"` link

---

### Requirement: Password Field Visibility Toggle
Every password `<input>` rendered by `AuthDesign` MUST provide an inline show/hide control that
toggles the input's `type` between `password` (masked) and `text` (revealed). This applies to the
login «Пароль» field, the onboarding step-2 «Пароль» (create) field, and the onboarding step-2
«Подтвердите пароль» (confirm) field. The control MUST be an accessible `<button type="button">`
(so it never submits the form) with an `aria-label` that reflects the current action («Показать
пароль» when masked, «Скрыть пароль» when revealed). Toggling MUST NOT change the field's `name`,
`value`, `required`, controlled state, the password checklist, or the confirm-match logic. The
control MUST use the existing design language (Handjet/Manrope, `app/_design/tokens.css` color
tokens) and an inline SVG eye/eye-off icon — no new dependency.

#### Scenario: Login password can be revealed and re-hidden
- GIVEN a user on `/login` has typed a value into the «Пароль» field (rendered as dots)
- WHEN they activate the visibility toggle on that field
- THEN the field `type` MUST become `text` and the typed characters MUST be visible
- AND WHEN they activate the toggle again
- THEN the field `type` MUST return to `password` and the value MUST be masked again
- AND the field's `name="password"` and its value MUST be unchanged throughout

#### Scenario: Both onboarding step-2 password fields have independent toggles
- GIVEN a user on the onboarding step-2 «СОЗДАЙТЕ СВОЙ АККАУНТ» screen
- WHEN they view the «Пароль» and «Подтвердите пароль» fields
- THEN each field MUST have its own visibility toggle
- AND revealing one field MUST NOT change the masking of the other
- AND revealing the «Пароль» field MUST NOT hide or alter the password-strength checklist
- AND the confirm-mismatch indicator MUST still fire when the two values differ

#### Scenario: Toggle is accessible and non-submitting
- GIVEN any password field with a visibility toggle
- WHEN the toggle is inspected
- THEN it MUST be a `<button type="button">` (MUST NOT submit the surrounding `<form>`)
- AND it MUST expose an `aria-label` describing the action (show vs hide)
- AND it MUST be reachable and operable by keyboard

**Acceptance Criteria:**
- All three password inputs in `app/_design/AuthDesign.tsx` (login, step-2 create, step-2 confirm)
  render a show/hide toggle
- Toggle flips `type` between `password` and `text`; per-field independent state
- Toggle is `<button type="button">` with a state-reflecting `aria-label`; keyboard-operable
- No change to field `name`/`value`/`required`, checklist rendering, or confirm-match behaviour
- Icon is an inline SVG in the existing token/font style; no new package added

---

### Requirement: Login Failed-Submit Value Preservation
When a login submission fails (any error returned by `loginUser`), the `AuthDesign` login view MUST preserve the
credentials the user just entered so they can review and correct them without retyping. Both the `Email` field and the
`Пароль` field MUST retain their submitted values after the failed submit re-render. Preservation MUST be implemented
client-side via controlled inputs (React state that survives the Server Action form reset), so the entered password is
NOT sent back from the server in the action's response. The `loginUser` action's signature and return shape MUST remain
unchanged (`(prevState: { error?: string } | null, formData: FormData)`), and successful login MUST still redirect
(`/dashboard`, or `/admin` for ADMIN) with no credential values persisted client-side afterward.

#### Scenario: Email and password survive a failed login
- GIVEN a user on `/login` types an email and a wrong password and submits
- WHEN `loginUser` returns an invalid-credentials error and the login view re-renders
- THEN the `Email` field MUST still show the entered email
- AND the `Пароль` field MUST still contain the entered password (masked, or revealed if the visibility toggle is on)
- AND the user MUST be able to correct only the password and resubmit without re-typing the email

#### Scenario: Corrected credentials log in and redirect
- GIVEN a failed login left the email populated and the password field editable
- WHEN the user fixes the password to the correct value and submits
- THEN `loginUser` MUST authenticate, create the session, and redirect to `/dashboard` (or `/admin` for ADMIN)

#### Scenario: Password is not echoed by the server
- GIVEN a login attempt fails
- WHEN the `loginUser` action's returned state is inspected
- THEN it MUST NOT contain the submitted password (preservation is client-side controlled state, not a server echo)

**Acceptance Criteria:**
- The login `Email` and `Пароль` inputs in `AuthDesign`'s `LoginView` are controlled (`value` + `onChange` from local state)
- Both fields retain their values after a failed-submit re-render (verified live: wrong password → both fields still populated)
- `loginUser` in `app/actions/auth.ts` is unchanged (no new return fields, no password echo)
- The onboarding step-2 password fields and their controlled behaviour, checklist, and confirm-match logic are unaffected

---

### Requirement: Login Error Alert Presentation
The login error message rendered by `AuthDesign`'s login view MUST be presented as a self-contained, bounded alert
occupying its own row in the form flow, positioned above the «Войти» button. The alert MUST have a visible boundary
(background fill + border) with readable contrast, MUST NOT visually overlap the «Войти» button or the decorative
pixel-wave/background, and MUST use the existing design language (Handjet/Manrope fonts and `app/_design/tokens.css`
color tokens). When there is no error, no alert (and no empty reserved artifact) MUST be shown. The bare-text `ErrorNote`
remains in use for the onboarding views and is unaffected.

#### Scenario: Failed login shows a bounded, non-overlapping alert
- GIVEN a user submits invalid credentials on `/login`
- WHEN the error `«Неверный email или пароль. Проверьте данные и попробуйте снова.»` is displayed
- THEN it MUST appear inside a bounded alert (background fill, border, padding, rounded corners) on its own row
- AND the alert MUST NOT overlap the «Войти» button or the pixel-wave decoration (its fill occludes the decoration beneath)
- AND the copy MUST remain legible against the alert background

#### Scenario: No alert when there is no error
- GIVEN the login view renders with no error state
- THEN no alert block MUST be present in the DOM (no bare red text, no empty box)

#### Scenario: Alert uses the token design language
- GIVEN the login error alert renders
- THEN its colors MUST come from `app/_design/tokens.css` (e.g. the `--accents-red` token) and its typography MUST be Manrope/Handjet consistent with the surrounding auth surface

**Acceptance Criteria:**
- The login error is a bounded alert (tinted background + border + padding + border-radius), not a bare `<p>` — implemented as `LoginErrorAlert` (`role="alert"`) in `app/_design/AuthDesign.tsx`
- The alert sits on its own row above «Войти» and does not overlap the button or the pixel-wave (verified live)
- Colors/typography use `app/_design/tokens.css` tokens (`--accents-red`, Manrope); red accent for the error state
- The shared `ErrorNote` usages elsewhere in `AuthDesign` (onboarding) are not regressed by this change

---

### Requirement: Register Screen Action and Legal-Link Ordering
The `AuthDesign` onboarding (register) view MUST present the primary «Зарегистрироваться» action,
the secondary «Войти» link, and the legal «Условия пользования» text as a clean, legible top-to-
bottom hierarchy. The legal link MUST NOT be positioned visually between the two action controls
(the sandwiched layout reported as Спец #17). The legal text MUST remain visually subordinate
(smaller / muted, consistent with the existing footer link styling). The existing design language
and the login-screen footer/step-1 role picker MUST be preserved except as needed to remove the
sandwiching. Implementation: onboarding steps 2 & 3 render the `Footer` `single` variant (one
subordinate centered legal line at the page bottom, `actionLabel`-parametrized so step 2 reads
«Нажимая "Зарегистрироваться"…»); login and step-1 keep the 3-column footer.

#### Scenario: Legal link is not between the two register actions
- GIVEN a user on the onboarding step-2 register screen
- WHEN the screen renders
- THEN the «Зарегистрироваться» primary button and the «Войти» secondary link MUST read as an
  adjacent action pair
- AND the «Условия пользования» legal text MUST NOT appear vertically between «Зарегистрироваться»
  and «Войти»
- AND the legal text MUST be styled as subordinate (muted/smaller), not as a third peer action

#### Scenario: Register actions remain fully functional after re-layout
- GIVEN the re-laid-out onboarding step-2 screen
- WHEN the user submits «Зарегистрироваться» with a valid account
- THEN `registerUser` MUST still be invoked and onboarding MUST advance to step 3
- AND clicking «Войти» MUST still switch to the login view
- AND the «Условия пользования» link MUST still be present and navigable

**Acceptance Criteria:**
- On the register/onboarding view, primary button + «Войти» form an adjacent pair; the legal link is
  not sandwiched between them
- Legal link retains subordinate (muted/smaller) styling from the existing footer link style
- `registerUser` submit → step 3, and «Войти» → login, both unchanged
- Change confined to `app/_design/AuthDesign.tsx`; login footer / step-1 picker otherwise intact

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
- THEN it MUST return `{ valid: false, error: "Пароль может содержать только латинские буквы, цифры и спецсимволы — без пробелов." }`
- AND character whitelist validation MUST reject non-Latin characters

#### Scenario: Password with invalid characters checked first
- GIVEN a password "Пароль" (Cyrillic, also too short and missing number)
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Пароль может содержать только латинские буквы, цифры и спецсимволы — без пробелов." }`
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

#### Scenario: Whitespace is rejected
- GIVEN a password containing any whitespace — a plain space ("My Secure Pass 123"), a leading/trailing space, a TAB,
  a newline, or a carriage return
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false }` with the character-whitelist error
- AND this MUST hold for NON-ASCII blanks too: U+00A0 (NBSP), U+3000 (ideographic space), and U+FEFF (zero-width NBSP)
- AND the rationale is that an invisible character in a password is unrecoverable in practice — registration succeeds,
  the user later retypes the password by hand, and login fails; recovery here is manual (see «Забыли пароль?»)

#### Scenario: Password at exactly 72 characters
- GIVEN a password with exactly 72 characters meeting all requirements
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND 72 characters is the maximum allowed (bcrypt limit)
- AND because the whitelist admits ASCII only, those 72 characters are exactly 72 bytes — so the value is never
  silently truncated by bcrypt's 72-BYTE cap

**Acceptance Criteria:**
- `validatePassword` is exported from `lib/password.ts`
- Function signature: `validatePassword(password: string): { valid: boolean; error?: string }`
- Validation order: character whitelist → max length (72) → min length (8) → uppercase → lowercase → number
- Returns specific error message for first failed requirement
- Uses standard ASCII regex (`/[A-Z]/` and `/[a-z]/`) for Latin-only character validation
- The character whitelist is the printable-ASCII range **excluding space** (`/^[\x21-\x7E]*$/`), which rejects
  Unicode/Cyrillic, emoji, and every form of whitespace. It MUST stay expressed as a raw ASCII range rather than a
  hand-listed punctuation set, because the max-length check depends on that range being exactly 1 byte per character
- The whitelist MUST NOT use `\s`: it matches non-ASCII blanks (U+00A0, U+3000, U+FEFF), which are invisible on screen
  and break the one-byte-per-character invariant (72 ideographic spaces = 210 bytes)
- Maximum length check prevents bcrypt DoS (72 characters, which the ASCII-only whitelist makes exactly 72 bytes —
  bcrypt truncates beyond 72 BYTES, so the character count is a valid proxy only while that whitelist holds)
- Empty input MUST fall through the whitelist (`*`, not `+`) to the min-length error
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
The homepage MUST send unauthenticated users to `/login` as the unified authentication entry point. It MUST NOT link to
`/auth` (the `/auth` route is removed, reground-auth-to-design).

#### Scenario: Unauthenticated user clicks "Get Started" on homepage
- GIVEN an unauthenticated user visits the homepage `/`
- WHEN they click the "Get Started" (or "Sign in") link
- THEN they MUST be navigated to `/login`

**Acceptance Criteria:**
- Homepage CTAs link to `/login` (not `/auth`)
- Link uses Next.js `<Link>` component for client-side navigation

---

### Requirement: Middleware Auth Route Configuration
The middleware MUST guard the auth routes without referencing `/auth`. It MUST redirect authenticated users away from
`/login` to `/dashboard`, and MUST **allow** authenticated users on `/register` (the two-phase onboarding creates the
account at step 2, so step-3 setup runs while authenticated). All protected-route and admin-route guards are preserved.

#### Scenario: Authenticated user on /login
- GIVEN an authenticated user with a valid session
- WHEN they navigate to `/login`
- THEN the middleware MUST redirect them to `/dashboard`

#### Scenario: Authenticated user on /register
- GIVEN an authenticated user (e.g. at step-3 setup after step-2 account creation)
- WHEN they are on `/register`
- THEN the middleware MUST allow the request (no redirect)

#### Scenario: /auth route removed
- GIVEN any user navigates to `/auth`
- THEN no auth landing is served (route + matcher entry removed)

#### Scenario: Protected/admin guards unchanged
- GIVEN an unauthenticated user requests `/dashboard`, `/gigs`, `/profile`, or an admin route
- THEN the middleware redirects to `/login` (admin routes still require the ADMIN role)

**Acceptance Criteria:**
- No `/auth` block or `'/auth'` matcher entry; `/login` redirects authed users; `/register` allows authed users
- Protected/admin guards preserved

---

### Requirement: E2E Test Coverage for Auth Navigation Flow
The system MUST include E2E tests verifying the AuthDesign navigation: homepage → `/login`, the login↔register state
machine, direct route access, and authenticated-user behaviour (reground-auth-to-design).

#### Scenario: Homepage to login
- GIVEN an unauthenticated user on the homepage
- WHEN they click "Get Started" (or "Sign in")
- THEN they MUST arrive at `/login` showing «ВХОД В GIGLY»

#### Scenario: Login ↔ register are linked siblings
- GIVEN a user on `/login`
- WHEN they click «Создать аккаунт»
- THEN the onboarding view is shown; AND «Войти» on onboarding step 2 returns to login

#### Scenario: Direct access works
- GIVEN an unauthenticated user
- WHEN they navigate directly to `/login` or `/register`
- THEN they MUST see the respective AuthDesign view (no redirect)

#### Scenario: Authenticated-user behaviour
- GIVEN an authenticated user
- WHEN they navigate to `/login` THEN they MUST be redirected to `/dashboard`
- AND WHEN they navigate to `/register` THEN they MUST be allowed (onboarding setup surface)

**Acceptance Criteria:**
- E2E specs (`auth-flow`, `auth-navigation`, `compose-auth-onboarding`) cover homepage → `/login`, the state machine, direct access, and authed redirects/allowances
- Obsolete `/auth`-landing and `?role=` specs removed
- All tests pass before deployment

## Session Tracking Requirements (reconcile-settings, 2026-06-20)

### Requirement: Session Model and Login Capture
The schema MUST define a `Session` model — `id`, `userId` (FK to `User`, `onDelete: Cascade`), `userAgent`, `ipAddress`,
`createdAt`, `lastActiveAt`, indexed on `userId` — and `User.sessions Session[]`. `createSession` MUST capture the
request `user-agent` and IP (from `headers()`), create a `Session` row, and embed that row's id as `sid` in the JWT.

#### Scenario: Logging in creates a session row
- GIVEN a successful login (or registration auto-login)
- WHEN `createSession` runs
- THEN a `Session` row MUST be created for the user with the captured `userAgent` + `ipAddress`, and the issued JWT MUST
  carry its `sid`

### Requirement: Session Validation Is Backward-Compatible
`getSession` MUST continue to validate any otherwise-valid JWT, reading `sid` **when present** but NOT requiring a
`Session` row to exist — so existing tokens and the test harness's directly-minted sessions (no `sid`, no row) keep
authenticating. `destroySession` (logout) MUST delete the current session's row when a `sid` is present.

#### Scenario: A sid-less token still authenticates
- GIVEN a valid JWT with no `sid` (e.g. a test-minted session)
- WHEN `getSession` runs
- THEN it MUST return the session payload as today (no `Session` row required)

#### Scenario: Logout deletes the current session row
- GIVEN a logged-in user whose JWT carries a `sid`
- WHEN `logoutUser` / `destroySession` runs
- THEN the matching `Session` row MUST be deleted and the cookie cleared

### Requirement: Terminate Session
A `terminateSession(sessionId)` server action MUST delete a `Session` row **only if it belongs to the requesting user**.
If the terminated session is the requester's current `sid`, the action MUST also clear the cookie and redirect to
`/login`. `getActiveSessions(userId, currentSid)` MUST return the user's sessions as `SessionRowVM[]` (current →
`active`, others → `Default`), title parsed from the user-agent, with **no fabricated location**.

#### Scenario: A user terminates another of their sessions
- GIVEN a user with two sessions A (current) and B
- WHEN they terminate B
- THEN B's `Session` row MUST be deleted, A MUST remain, and the user MUST stay logged in

#### Scenario: Terminating someone else's session is rejected
- GIVEN session B belonging to another user
- WHEN a user calls `terminateSession(B)`
- THEN it MUST NOT delete B (ownership enforced)

**Acceptance Criteria:**
- `Session` model (`userAgent`/`ipAddress`/`createdAt`/`lastActiveAt`, `userId` cascade, indexed) + `User.sessions`
- `createSession` captures UA + IP, creates a row, embeds `sid`; `getSession` tolerant of sid-less/row-less tokens (harness unbroken)
- `destroySession`/`logoutUser` deletes the current row; `terminateSession(id)` ownership-checked (+ self-logout when current)
- `getActiveSessions` → `SessionRowVM[]` (UA-parsed title, current = `active`), location omitted; `session-tracking.test.ts` + the auth suite green
