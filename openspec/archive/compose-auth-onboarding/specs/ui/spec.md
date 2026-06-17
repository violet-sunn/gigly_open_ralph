# UI Specification Delta: compose-auth-onboarding

This document contains specification changes for the `compose-auth-onboarding` change — Phase-2 screen composition #10.
It recomposes **`/auth`** + **`/register`** into a **3-step registration wizard** built from the kit (`AuthLayout`
(template) + `StepIndicator` + `RoleCards` + form primitives), replacing the pre-redesign hex-laden pages. Step 3
persists **profile-evolution** fields (role-specific) via dropdown datasets; `loginUser`/`registerUser` + validation are
kept (registration additively extended — see the `authentication` spec delta). It ships **the `StepIndicator` primitive
+ `RoleCards` block + the `RegisterWizard` composition + the recomposed `/auth` + `/register` pages + tests only** — F5
composition-pure, F3 steps/fields parity. **All four reference frames exist** (`auth`/`reg`/`reg-customer`/
`reg-specialist`) → the wizard is composed to match them; **F1 ≤1% is NOT asserted** — deferred on the global
font-licence gate (per `__tests__/e2e/fidelity.spec.ts`). No data model is added; `loginUser`, the session/redirect
contract, `/login`, and the legacy auth components are unchanged.

---

## ADDED Requirements

### Requirement: Auth Onboarding Composed from Blocks
The `/register` body MUST be a composition-pure `@composed-screen` (`RegisterWizard`) composing `AuthLayout` +
`StepIndicator` + `RoleCards` + form primitives, and `/auth` MUST likewise be recomposed from the kit — both via layout
primitives only (no `className`/`style`/raw styled markup or hex literals; imports only kit/`lib`/`react`/`next`/
`@/app/actions`).

#### Scenario: Register is a composed wizard
- GIVEN `app/register/RegisterWizard.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `AuthLayout` + `StepIndicator` + `RoleCards` + form
  primitives (`Input`/`PasswordInput`/`Select`) via layout primitives, import only kit/`lib`/`react`/`next`/
  `@/app/actions`, and contain **no** `className=`/`style=`/hex literals

#### Scenario: The pages render the composed auth screens
- GIVEN `app/register/page.tsx` and `app/auth/page.tsx`
- WHEN a user loads `/register` or `/auth`
- THEN `/register` MUST render `<RegisterWizard>` (reading `?role=` for preselect) and `/auth` MUST render a
  kit-composed entry (`AuthLayout` + `RoleCards` + «Войти»/«Зарегистрироваться» buttons routing to `/login?role=` /
  `/register?role=`) — both inside `AuthLayout`, with the exported checkerboard footer asset
  (`/assets/design-system/patterns/checkerboard.svg`) rendered

**Acceptance Criteria:**
- `RegisterWizard` is an F5-pure `@composed-screen` (AuthLayout + StepIndicator + RoleCards + form primitives); `/auth` recomposed from the kit; no className/style/hex
- The pages render the composed screens; the exported checkerboard footer renders

### Requirement: Three-Step Wizard with Role-Specific Profile Step
The wizard MUST present **3 steps** — role → credentials → role-specific profile — with a `StepIndicator`, and step 3
MUST differ by role (the `reg-customer` company profile vs the `reg-specialist` profile) with dropdowns bound to the
datasets.

#### Scenario: Three steps with a step indicator
- GIVEN the `/register` wizard
- WHEN it renders
- THEN a `StepIndicator` MUST show three steps (role · credentials · profile); step 1 MUST present `RoleCards`
  («Профиль Компании» / «Профиль специалиста»); step 2 MUST present email + password + a **confirm-password** field
  with a client-side match check; and Next/Back navigation MUST move between steps

#### Scenario: Step 3 is role-specific with dropdown datasets
- GIVEN step 3
- WHEN the chosen role is CLIENT
- THEN it MUST present the company profile (companyName · inn · contactPerson · phoneNumber)
- AND WHEN the chosen role is SPECIALIST
- THEN it MUST present the specialist profile (displayName · position · techStack) with **dropdowns** for specialization
  (`SPECIALIZATIONS`), experience level (`EXPERIENCE_LEVELS`), and timezone (`TIMEZONES`)

#### Scenario: Role preselect from the query parameter
- GIVEN `/register?role=SPECIALIST` (or `=CLIENT`)
- WHEN the wizard loads
- THEN step 1 MUST preselect that role; an absent/invalid `?role=` MUST start with no preselection

**Acceptance Criteria:**
- 3 steps (role → credentials → profile) with a `StepIndicator`; confirm-password with a client-side match check
- Step 3 role-specific (CLIENT company fields vs SPECIALIST fields + dropdowns from the datasets); `?role=` preselects step 1

### Requirement: StepIndicator + RoleCards (composition-gap fill)
The `StepIndicator` primitive and the `RoleCards` block MUST be implemented (both named by this composition; neither
exists token-pure today — a legacy hex `RoleCard` is replaced).

#### Scenario: StepIndicator is a token-pure primitive
- GIVEN `app/components/primitives/StepIndicator.tsx`
- WHEN inspected
- THEN it MUST render N labelled steps with the completed/current/upcoming state, be token-pure (no raw hex/px), and be
  exported from the primitives barrel

#### Scenario: RoleCards is a token-pure controlled block
- GIVEN `app/components/blocks/RoleCards.tsx`
- WHEN inspected
- THEN it MUST render the two role options («Профиль Компании»/«Профиль специалиста») with role icons and a selected
  state via a controlled `{ value, onSelect }` interface, be token-pure, have a fixture, and be exported from the blocks
  barrel

**Acceptance Criteria:**
- `StepIndicator` token-pure primitive (done/current/upcoming) + barrel export
- `RoleCards` token-pure controlled block (two roles + selected state + icons) + fixture + barrel export; `lint:tokens` passes

### Requirement: Auth Onboarding Verification and Fidelity (references exist)
The change MUST pass F3 + F5 + the functional/E2E suite; F1 references exist → composed to match, ≤1% deferred on the
font-licence gate.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the registration integration
  tests, the new auth-onboarding E2E, and the updated existing auth E2E run
- THEN they MUST pass — the wizard body is composition-pure, the IA matches the intended composition (3 steps + role
  cards + credentials + role-specific profile) (F3), register → `/dashboard` works with the profile persisted, and the
  existing single-step `registerUser`/`loginUser` tests stay green

#### Scenario: F1 references exist → composed to match, ≤1% deferred
- GIVEN the reference frames `screens/auth.jpg`, `screens/reg.jpg`, `screens/reg-customer.jpg`,
  `screens/reg-specialist.jpg` exist
- WHEN fidelity is considered
- THEN the wizard MUST be composed to match the references' step/field IA (F3 + F5 enforced); **F1 ≤1% MUST NOT be
  asserted** — it is deferred on the global font-licence gate (substitute font + lossy frames + unlocked design, per
  `__tests__/e2e/fidelity.spec.ts`); the fidelity apparatus runs and the deferral is recorded

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + registration integration tests + auth-onboarding E2E + updated auth E2E green; existing auth tests green
- F1 references exist → composed to match; ≤1% deferred (font gate), apparatus runs, deferral recorded

---

## Test Plan

This change ships a primitive + a block + a composition + two recomposed pages + an action extension + tests.
Validation is by deterministic commands. Commands assume the repo root.

### Composition + gap-fills
```bash
grep -qE '@composed-screen' app/register/RegisterWizard.tsx && echo "RegisterWizard composed screen (F5 marker)"
grep -qE 'className=|style=|#[0-9a-fA-F]{3,6}' app/register/RegisterWizard.tsx && echo "CHECK raw styling/hex" || echo "OK no raw styling/hex"
grep -qE 'AuthLayout|StepIndicator|RoleCards' app/register/RegisterWizard.tsx && echo "composes the kit"
grep -qE 'className=|style=|#[0-9a-fA-F]{3,6}' app/auth/page.tsx && echo "CHECK /auth raw styling/hex" || echo "OK /auth no raw styling/hex"
test -f app/components/primitives/StepIndicator.tsx && grep -qE 'StepIndicator' app/components/primitives/index.ts && echo "StepIndicator + export"
test -f app/components/blocks/RoleCards.tsx && grep -qE 'RoleCards' app/components/blocks/index.ts && echo "RoleCards + export"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Integration (registerUser profile + confirm-password) + build + suite
```bash
npm run clean:test-db && npx vitest run __tests__/integration/register-onboarding.test.ts 2>&1 | tail -12
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### E2E (wizard + role preselect + validation + register→dashboard + footer asset; updated existing auth E2E)
```bash
npx playwright test __tests__/e2e/compose-auth-onboarding.spec.ts --project=chromium 2>&1 | tail -12
npx playwright test __tests__/e2e/register-page-redesign.spec.ts __tests__/e2e/registration.spec.ts __tests__/e2e/auth-navigation.spec.ts __tests__/e2e/auth-landing.spec.ts __tests__/e2e/login-role-param.spec.ts --project=chromium 2>&1 | tail -12
```

### Fidelity (references exist → composed to match; ≤1% deferred)
```bash
ls screens/ | grep -iE 'auth|reg' && echo "auth/reg/reg-customer/reg-specialist references exist → composed to match; F1 ≤1% deferred (font gate)"
```

### Manual review
1. Confirm `RegisterWizard` is an F5-pure `@composed-screen` (AuthLayout + StepIndicator + RoleCards + form primitives; no className/style/hex) and `/auth` is recomposed from the kit.
2. Confirm the 3 steps (role → credentials w/ confirm-password → role-specific profile), the dropdowns bound to the datasets, and `?role=` preselect.
3. Confirm register → `/dashboard` with the profile persisted (CLIENT `reg-customer`, SPECIALIST `reg-specialist`); confirm-password mismatch shows an error.
4. Confirm the exported checkerboard footer renders; the legacy auth components remain only for `/login`; F1 ≤1% deferred (references exist).
