# authentication — spec deltas (reground-auth-to-design)

## MODIFIED Requirements

### Requirement: Registration Action with Session and Role

`registerUser` MUST create the account and session from credentials + role only, and MUST NOT persist profile fields or redirect. On success it MUST return `{ ok: true }` so the onboarding surface can advance to its profile-setup step. It MUST keep: rate limiting (before validation), password-strength validation, confirm-password match, role validation (CLIENT/SPECIALIST only, explicit ADMIN rejection), duplicate-email handling, and auto-login (session creation). All user-facing messages MUST be in Russian.

#### Scenario: Account created at step 2

- **WHEN** a user submits a valid email, matching passwords, and a CLIENT/SPECIALIST role via «Зарегистрироваться»
- **THEN** `registerUser` creates the User, establishes a session (auto-login), and returns `{ ok: true }` without redirecting

#### Scenario: Profile is not collected by registerUser

- **WHEN** `registerUser` succeeds
- **THEN** no `ClientProfile`/`SpecialistProfile` row is created by this action (profile setup is a separate step via `updateProfile`)

#### Scenario: ADMIN role rejected

- **WHEN** a registration submits `role=ADMIN` (or any non-CLIENT/SPECIALIST value)
- **THEN** registration fails with a Russian error and no account is created

#### Scenario: Russian error copy

- **WHEN** registration fails (duplicate email, weak password, mismatch, missing role)
- **THEN** the returned error message is in Russian

### Requirement: Login Server Action

`loginUser` MUST authenticate by email + password, block suspended accounts, create a session on success, and redirect to `/dashboard`. All user-facing messages MUST be in Russian.

#### Scenario: Successful login

- **WHEN** valid credentials are submitted
- **THEN** a session is created and the user is redirected to `/dashboard`

#### Scenario: Invalid credentials (Russian)

- **WHEN** the email is unknown or the password is wrong
- **THEN** a Russian "invalid credentials" error is returned and no session is created

#### Scenario: Suspended account (Russian)

- **WHEN** a suspended user logs in with correct credentials
- **THEN** a Russian "account suspended" error is returned and no session is created

### Requirement: Middleware Route Protection

Middleware MUST guard auth routes per the rebuilt surface. It MUST NOT reference `/auth`. It MUST redirect authenticated users away from `/login` to `/dashboard`, and MUST **allow authenticated users on `/register`** (the post-account onboarding-setup surface). It MUST keep all protected-route and admin-route guards.

#### Scenario: Authenticated user on `/login`

- **WHEN** an authenticated user navigates to `/login`
- **THEN** middleware redirects them to `/dashboard`

#### Scenario: Authenticated user on `/register`

- **WHEN** an authenticated user is on `/register` (e.g. at step-3 setup after step-2 account creation)
- **THEN** middleware allows the request (no redirect)

#### Scenario: `/auth` removed

- **WHEN** any user navigates to `/auth`
- **THEN** no auth landing is served (route + matcher entry removed)

#### Scenario: Protected/admin guards unchanged

- **WHEN** an unauthenticated user requests `/dashboard`, `/gigs`, `/profile`, or an admin route
- **THEN** middleware redirects to `/login` (admin routes still require ADMIN)

### Requirement: Homepage Authentication Entry Point

The homepage MUST send unauthenticated users to `/login` as the unified entry point and MUST NOT link to `/auth`.

#### Scenario: Unauthenticated primary CTA

- **WHEN** an unauthenticated user clicks the homepage auth CTA
- **THEN** they are navigated to `/login`

### Requirement: Registration Page UI Design

The registration page (`/register`) MUST be rendered by `AuthDesign`'s onboarding view (the `app/_design/` rebuild grounded in `gigly_full_design/Auth.dc.html`), replacing the kit `RegisterWizard`. It MUST implement two-phase registration: step-2 «Зарегистрироваться» creates the account via `registerUser`; step-3 «Продолжить» saves the role-specific profile via `updateProfile` and redirects to `/dashboard`. It MUST NOT use a `?role=` query parameter (role is chosen at step 1).

#### Scenario: New CLIENT completes onboarding

- **WHEN** a user picks «Компания», registers at step 2, fills Компания/ФИО/Должность/Местоположение+TZ at step 3, and submits «Продолжить»
- **THEN** the account exists from step 2, the client profile is saved at step 3, and the user lands on `/dashboard`

#### Scenario: New SPECIALIST completes onboarding

- **WHEN** a user picks «Специалист», registers, fills ФИО/Специализация/Местоположение+TZ, and submits
- **THEN** the specialist profile is saved and the user lands on `/dashboard`

#### Scenario: Step-3 abandonment leaves a usable account

- **WHEN** a user completes step 2 but leaves before finishing step 3
- **THEN** the account already exists (created at step 2) and the profile can be completed later in profile-edit

#### Scenario: Password mismatch caught at step 2

- **WHEN** step-2 password and confirm differ
- **THEN** «Пароли не совпадают.» is shown and registration is blocked

## ADDED Requirements

### Requirement: Login Screen Reground to Auth.dc.html

`/login` MUST be rendered by `AuthDesign`'s `login` view: the «ВХОД В GIGLY» lockup (blue G, Handjet heading, Manrope subtitle), Email + Пароль, a non-functional «Забыли пароль?» link, a «Войти» submit wired to `loginUser`, and a «Нет аккаунта? Создать аккаунт» link to onboarding. It MUST contain no English UI strings, no role selector, and no checkerboard background.

#### Scenario: Successful login

- **WHEN** valid credentials are submitted via «Войти»
- **THEN** a session is created and the user is redirected to `/dashboard`

#### Scenario: Switch to registration

- **WHEN** the user clicks «Создать аккаунт»
- **THEN** the onboarding view is shown

#### Scenario: No legacy artifacts

- **WHEN** the login screen renders
- **THEN** no «Email address»/«Password»/«Signing in...» text, role cards, or checkerboard pattern are present

### Requirement: Auth Login↔Register State Machine

The auth surface MUST implement the design's navigation: login and onboarding are linked siblings; «Создать аккаунт» (login→onboarding) and «Войти» (onboarding step 2→login); the back-arrow on onboarding step 1 returns to login. After step-2 account creation, the back-arrow MUST NOT return to the credentials step.

#### Scenario: Onboarding → login

- **WHEN** the user clicks «Войти» on onboarding step 2
- **THEN** the login view is shown

#### Scenario: Back from step 1

- **WHEN** the user presses the back-arrow on onboarding step 1
- **THEN** the login view is shown

### Requirement: Password Reset Entry Placeholder

The login view MUST show a «Забыли пароль?» link styled per the design, rendered as a non-functional placeholder (`href="#"`). A working reset flow is out of scope for this change.

#### Scenario: Link present but inert

- **WHEN** the login screen renders
- **THEN** «Забыли пароль?» is visible and does not trigger a reset flow

## REMOVED Requirements

### Requirement: Internal Authentication Links

**Reason**: The `/auth → /login?role=` inter-page scheme came from the pre-design spec; replaced by the in-surface state machine and a single `/login` homepage entry.
**Migration**: See "Homepage Authentication Entry Point" + "Auth Login↔Register State Machine".

### Requirement: Backward Compatibility for Direct Auth URLs

**Reason**: `/auth` is removed; `/login` and `/register` remain directly reachable, so the `/auth`-landing compatibility concern is moot.
**Migration**: Route wiring + middleware keep `/login` and `/register` reachable.
