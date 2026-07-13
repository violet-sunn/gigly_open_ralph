# UI spec delta — transport-auth (change 8/8)

Reconcile the auth surface (login + 3-step onboarding) to `gigly_full_design/Auth.dc.html`. The substance shipped in the archived `reground-auth-to-design`; this delta states the fidelity + behaviour requirements that the reconcile must hold true, and closes the transport initiative.

## ADDED Requirements

### Requirement: Auth surface renders the transported Auth.dc.html shell

`/login` and `/register` SHALL render `app/_design/AuthDesign.tsx`, whose chrome matches the `Auth.dc.html` shared shell: the GIGLY wordmark with the blue **G** logomark, Handjet display + Manrope body type, the `pixel-wave.svg` accent, and the footer links — built on `app/_design/tokens.css` (no design-kit components).

#### Scenario: Login view matches the reference shell
- **WHEN** an unauthenticated visitor opens `/login`
- **THEN** the page shows the heading «ВХОД В GIGLY», the blue **G** logomark + GIGLY wordmark, email and password fields, a primary submit, the «Забыли пароль?» placeholder link, and a «Создать аккаунт» switch to registration
- **AND** no design-kit (`@composed-screen`) component is used — the markup is the transported inline-styled shell

#### Scenario: Registration renders the onboarding shell
- **WHEN** an unauthenticated visitor opens `/register`
- **THEN** the page renders `AuthDesign` in its `onboarding` view at step 1 with the role-selection chips and the step indicator, inside the same shared shell as `/login`

### Requirement: Login ↔ onboarding state machine with back navigation

`AuthDesign` SHALL implement the prototype's `view: 'login' | 'onboarding'` × `step: 1 | 2 | 3` state machine: the login view switches to onboarding and back, and onboarding advances 1→2→3 with a back control that returns to the prior step.

#### Scenario: Switch between login and registration
- **WHEN** the visitor activates «Создать аккаунт» on the login view
- **THEN** the onboarding view (step 1) is shown
- **AND** activating the «Войти» / login switch from onboarding returns to the login view

#### Scenario: Onboarding step-2 back navigation
- **WHEN** the visitor is on onboarding step 2 (credentials)
- **THEN** a back control returns to step 1 with both role chips selectable again (re-choose role)

#### Scenario: Onboarding step-3 secondary control reflects the two-phase reality
- **WHEN** the visitor is on onboarding step 3 (profile setup)
- **THEN** because the account was already created at step 2, the secondary control skips the optional setup and proceeds to the dashboard (it does NOT return to credentials, which would attempt to re-register)

### Requirement: Two-phase registration wiring preserved

The onboarding flow SHALL remain wired to the existing two-phase actions: step 2 «Зарегистрироваться» calls `registerUser` (creating the account + session), advancing to step 3; step 3 «Продолжить» calls `updateProfile` to persist the role-specific profile and redirects into the app. Login SHALL remain wired to `loginUser`.

#### Scenario: Complete onboarding creates account then profile
- **WHEN** the visitor picks a role (step 1), submits valid credentials at step 2, then completes the role-specific fields at step 3 «Продолжить»
- **THEN** `registerUser` creates the account at step 2 and `updateProfile` persists the profile at step 3
- **AND** the visitor lands authenticated on their role's destination

#### Scenario: Login error surfaces in the design
- **WHEN** the visitor submits invalid credentials on `/login`
- **THEN** a Russian error is shown within the transported login view and no session is created

### Requirement: The `/auth` route stays removed

The legacy `/auth` route SHALL NOT exist; `app/auth/` is absent and middleware references no `/auth` path. The homepage entry point SHALL link to `/login`.

#### Scenario: /auth is gone
- **WHEN** a visitor navigates to `/auth`
- **THEN** the app returns 404 (no route handler)

#### Scenario: No stray English or typo strings
- **WHEN** the auth surface is rendered
- **THEN** its visible copy is Russian, with no leftover English UI strings and no «Зарегестрироватся»-class typos
