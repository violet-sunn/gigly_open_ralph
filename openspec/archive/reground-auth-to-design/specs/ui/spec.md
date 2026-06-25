# ui — spec deltas (reground-auth-to-design)

## ADDED Requirements

### Requirement: AuthDesign Screen (login + onboarding) on app/_design

The auth surface MUST be a single `app/_design/AuthDesign.tsx` component rebuilt directly on `gigly_full_design/Auth.dc.html`, consistent with the other `*Design.tsx` screens (inline-styled prototype markup, `app/_design/tokens.css`, literal Handjet/Manrope). It MUST render a shared shell and two views (`login`, `onboarding`).

#### Scenario: Shared auth shell

- **WHEN** any auth view renders
- **THEN** it shows the GIGLY wordmark top-left, the `pixel-wave.svg` bottom band (served from `public/assets/pixel-wave.svg`), and the footer links «Политика конфиденциальности» / «Условия пользования» / «Помощь», all on the `#01030e` surface via the design tokens

#### Scenario: Token/font purity

- **WHEN** the auth screens render
- **THEN** colours and fonts resolve from `app/_design/tokens.css` (no off-design hex/font literals introduced), and the screens work in both `data-theme` modes

### Requirement: Auth Onboarding View Reground to Auth.dc.html

The onboarding view MUST reproduce the 3-step flow from `Auth.dc.html` with step-dots: step 1 role select via the diagonal floating chips (Компания / Специалист), step 2 credentials (Email + «Придумайте пароль» + «Подтвердите пароль») with «Зарегистрироваться» and a «Войти» link, step 3 role-specific setup with a back-arrow, «Продолжить», and the consent footer.

#### Scenario: Step 1 role chips

- **WHEN** onboarding step 1 renders
- **THEN** the «Компания» chip (top-right, ⌘) and «Специалист» chip (bottom-left, person icon) are shown diagonally, and the step-dots highlight position 1

#### Scenario: Step 3 role-specific headings

- **WHEN** a CLIENT reaches step 3
- **THEN** the heading is «ДОБРО ПОЖАЛОВАТЬ» with company fields; **WHEN** a SPECIALIST reaches step 3 the heading is «НАСТРОЙТЕ СВОЙ АККАУНТ» with specialist fields

#### Scenario: Consent footer

- **WHEN** onboarding step 3 renders
- **THEN** the consent line «Нажимая «Продолжить», вы соглашаетесь…» is shown

## REMOVED Requirements

### Requirement: Login Page

**Reason**: The Figma-MCP login redesign (checkerboard pattern, `AuthContainer`/`AuthButton`, bilingual «Вход»/«Login») predates `gigly_full_design` and is superseded by the `AuthDesign` login view («ВХОД В GIGLY»).
**Migration**: See authentication spec "Login Screen Reground to Auth.dc.html".

### Requirement: AuthContainer Component

**Reason**: Kit auth primitive used only by the retired login redesign; the rebuilt auth screens use the `app/_design` shell, not the kit `AuthContainer`.
**Migration**: Equivalent layout is the `AuthDesign` shared shell.

### Requirement: AuthButton Component

**Reason**: Kit auth primitive superseded by the prototype's inline-styled buttons in `AuthDesign`.
**Migration**: Buttons are part of `AuthDesign`.

### Requirement: Register Wizard Composes the Figma Auth/Onboarding Nodes

**Reason**: The kit `RegisterWizard` (`@composed-screen`) is replaced by the `AuthDesign` onboarding view rebuilt on the prototype's own markup.
**Migration**: See "Auth Onboarding View Reground to Auth.dc.html".

### Requirement: AuthHeader Block (auth «HEADER» lockup)

**Reason**: The kit `AuthHeader` block is replaced by the inline header lockup (blue G + Handjet heading + step-dots) inside `AuthDesign`.
**Migration**: Lockup lives in `AuthDesign`.

### Requirement: Onboarding Wizard Reconciled to the Prototype

**Reason**: This requirement reconciled the kit `RegisterWizard` to the older `Онбординг.dc.html` (which lacked a login screen). It is superseded by the full `Auth.dc.html` reground.
**Migration**: Superseded by "Auth Onboarding View Reground to Auth.dc.html" + the authentication login requirement.
