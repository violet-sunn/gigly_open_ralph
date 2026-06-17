# Change Proposal: compose-auth-onboarding

> Phase 2, change 27 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> recomposes the **`/auth`** entry and the **`/register`** flow into a **3-step registration wizard** built from the kit
> — `AuthLayout` (template, exists) + `StepIndicator` + `RoleCards` + form primitives — replacing the pre-redesign,
> hex-laden `/auth` and `/register` pages. Step 3 **persists profile-evolution fields** (role-specific) via dropdown
> datasets, **`loginUser`/`registerUser` + validation are kept** (registration additively extended to write the
> profile + confirm-password). Depends on: layout-grammar, ui-primitives, profile-evolution (all complete). Friction:
> **medium–high**.
>
> **Fidelity gate — references exist.** Unlike compose-finances/disputes (no mock), **all four reference frames exist**:
> `screens/auth.jpg`, `screens/reg.jpg`, `screens/reg-customer.jpg`, `screens/reg-specialist.jpg`. So the wizard is
> **composed to match them** (F3 IA/layout parity + F5 composition purity enforced). **F1 ≤1% is NOT asserted** — it is
> globally **deferred on the documented font-licence gate** (substitute font + lossy/draft frames + unlocked design, per
> `__tests__/e2e/fidelity.spec.ts` and the compose-shell-cutover note); the apparatus runs and the screen is built from
> the kit. F1 ≤1% becomes reachable per-screen once the font licence + exported raster land — the same stance as every
> prior compose-* screen.

## Problem Statement

The `/auth` and `/register` pages are **pre-redesign**: `app/auth/page.tsx` and `app/register/page.tsx` are raw,
hex-literal markup (`bg-[#01030e]`, `border-[#242935]`, inline checkerboard `<svg>`, `rounded-[25px]`) composed from the
legacy `components/auth/*` + `app/components/auth/*` (AuthButton/RoleCard/AuthContainer/LogoHeader) — none token-pure,
none `@composed-screen`. They are exactly the legacy this redesign replaces, and they are **single-step**: registration
collects only role + email + password.

- **No 3-step onboarding.** The references describe a **wizard**: pick a role (`auth.jpg` / `reg.jpg`), enter
  credentials (`reg.jpg`), then fill a **role-specific profile** (`reg-customer.jpg` for a company, `reg-specialist.jpg`
  for a specialist). Today there is no step indicator, no confirm-password, and **no profile step** — a registered user
  lands with an empty `ClientProfile`/`SpecialistProfile`, so the just-built `profile-evolution` fields (companyName /
  inn / contactPerson / phone for clients; displayName / position / specialization / experienceLevel / techStack /
  timezone for specialists) are never captured at signup.
- **`registerUser` writes only `user`.** `app/actions/auth.registerUser` creates the `User` (email/password/role) and a
  session — it never creates the profile. The wizard's step 3 must persist those fields; the action must be
  **additively extended** (keep its signature, rate-limit, password-strength, role validation) to also create the
  matching profile + enforce confirm-password — backward-compatible with existing single-step callers.
- **Two composition gaps + an unused template.** The redesign composition names `AuthLayout + StepIndicator + RoleCards
  + Form primitives`. `AuthLayout` **exists** (template, with the **exported** checkerboard footer
  `public/assets/design-system/patterns/checkerboard.svg`) but is **unused by any route** (only catalogued in the
  workbench). `StepIndicator` and `RoleCards` **do not exist** — they are gap-fills (a `ProgressBar` primitive exists
  but not a labelled step wizard; a legacy `RoleCard` exists but is hex-laden and not token-pure). The form primitives
  (`Input`, `PasswordInput`, `Select`) exist.
- **Dropdown datasets exist but are unused at signup.** `lib/profiles.ts` exports `TIMEZONES` + `SPECIALIZATIONS`;
  experience levels are `['MIDDLE','SENIOR']` (validated in `updateProfile`). The specialist profile step binds these as
  dropdowns; an `EXPERIENCE_LEVELS` dataset is added alongside them.

The planning doc maps this exactly: compose `/auth` + `/register` as the 3-step wizard from `AuthLayout + StepIndicator
+ RoleCards + Form primitives`, with confirm-password, RU copy + the checkerboard footer (exported asset), step-3
writing profile-evolution fields + dropdown datasets, keeping `loginUser`/`registerUser` + validation; the Fidelity DoD
against the four references (F1 where a reference exists — here all four do; F3 steps/fields; F5), register → dashboard,
role preselect, validation, and the auth E2E updated.

## Proposed Solution

Recompose `/auth` + `/register` as kit-composed screens forming a 3-step wizard, two gap-fill components, an additive
registration extension, the experience dataset, and verification. Seven deliverable groups:

1. **`StepIndicator` primitive (gap fill)** — `app/components/primitives/StepIndicator.tsx` (+ barrel export): a
   token-pure stepper rendering N labelled steps with the current/completed/upcoming state (e.g. «1 Роль · 2 Доступ ·
   3 Профиль»). Composed from tokens only (no raw literals). Catalogued in the workbench primitives registry.

2. **`RoleCards` block (gap fill)** — `app/components/blocks/RoleCards.tsx` (+ fixture + barrel export): the two role
   options («Профиль Компании» / «Профиль специалиста») as a controlled selector — `{ value: Role | null; onSelect }` —
   each card showing the role icon (`ClientIcon`/`SpecialistIcon` from `lib/assets`) + label with a selected border
   state. Token-pure (replaces the legacy hex `RoleCard`); mirrors the interactive-block pattern (FilterBar/Select).

3. **`RegisterWizard` composed screen (`@composed-screen`, client)** — `app/register/RegisterWizard.tsx`: props = the
   `?role=` preselect. A 3-step wizard composed via `AuthLayout` + `StepIndicator` + `RoleCards` + form primitives, no
   `className`/`style`: **Step 1** role (`RoleCards`, preselected from `?role=`), **Step 2** credentials (email +
   `PasswordInput` + confirm-password, with a client-side match check + Next/Back), **Step 3** the role-specific profile
   — CLIENT (`reg-customer`): companyName · inn · contactPerson · phoneNumber; SPECIALIST (`reg-specialist`):
   displayName · position · specialization (`Select` ← `SPECIALIZATIONS`) · experienceLevel (`Select` ←
   `EXPERIENCE_LEVELS`) · techStack · timezone (`Select` ← `TIMEZONES`). Submitting step 3 posts the full `FormData`
   (role + email + password + confirmPassword + profile fields) to `registerUser` via `useActionState`; the returned
   error renders via `Notice`. RU copy throughout.

4. **`/register` page (thin)** — `app/register/page.tsx` rewritten to read `?role=` (Suspense) and render
   `<RegisterWizard role={…} />` inside the shellless `AuthLayout`. Replaces the legacy hex page.

5. **`/auth` entry recomposed** — `app/auth/page.tsx` rewritten as a composed entry (`AuthLayout` + `RoleCards` + the
   «Войти»/«Зарегистрироваться» buttons) routing to `/login?role=` / `/register?role=`, replacing the legacy hex page.
   (The legacy `components/auth/*` + `app/components/auth/*` are **left in place** — `/login` still imports them; this
   change only stops `/auth` + `/register` from using them.)

6. **`registerUser` additively extended + `EXPERIENCE_LEVELS`** — in `app/actions/auth.ts`, keep the signature, rate
   limit, password-strength, and role validation; **add**: (a) a confirm-password match check **when** `confirmPassword`
   is present (backward-compatible); (b) creating the matching `ClientProfile`/`SpecialistProfile` from the step-3
   fields **in the same transaction** as the `User` (validated/sanitized; dropdown values checked against the datasets);
   then the existing `createSession` + `redirect('/dashboard')`. Add `EXPERIENCE_LEVELS` to `lib/profiles.ts` alongside
   `TIMEZONES`/`SPECIALIZATIONS`. `loginUser` is unchanged.

7. **Tests + fidelity + auth-E2E update** — integration tests for the extended `registerUser` (CLIENT → `ClientProfile`
   persisted; SPECIALIST → `SpecialistProfile` persisted with dropdown values; confirm-password mismatch → error, no
   user created; existing single-step registration still works; weak password still rejected). E2E
   (`compose-auth-onboarding.spec.ts`): the wizard renders the 3 steps (StepIndicator); role preselect from `?role=`;
   advancing role → credentials → profile; confirm-password mismatch shows an error; a full CLIENT and SPECIALIST
   register → `/dashboard` with the profile persisted; the checkerboard footer asset loads. **Update the existing auth
   E2E** (`register-page-redesign`, `registration`, `auth-navigation`, `auth-landing`, `login-role-param` as needed) to
   the new wizard markup/`data-testid`s. `lint:composition` (F5) on the new screens; F3 steps/fields; F1 references
   exist → composed to match, ≤1% deferred (font gate) — recorded.

This change emits **the `StepIndicator` primitive + `RoleCards` block + the `RegisterWizard` composition + the
recomposed `/auth` + `/register` pages + the additive `registerUser` profile/confirm-password extension +
`EXPERIENCE_LEVELS` + tests only**. It does **not** add a data model (the `profile-evolution` fields exist), change
`loginUser`, alter the session/redirect contract, touch `/login`, or remove the legacy auth components (`/login` still
uses them).

## Constraints

### MUST Requirements
- The `/register` body MUST be a composition-pure `@composed-screen` (`RegisterWizard`) composing `AuthLayout` +
  `StepIndicator` + `RoleCards` + form primitives via layout primitives only — `@composed-screen` marker, imports only
  kit/`lib`/`react`/`next`/`@/app/actions`, **no** `className`/`style`/raw styled markup or hex literals. `/auth` MUST
  likewise be recomposed from the kit.
- The wizard MUST present **3 steps** (role → credentials → role-specific profile) with a `StepIndicator`, and step 3
  MUST be **role-specific**: the CLIENT profile (`reg-customer`) vs the SPECIALIST profile (`reg-specialist`), the
  specialist dropdowns bound to the datasets (`SPECIALIZATIONS`, `EXPERIENCE_LEVELS`, `TIMEZONES`).
- Step 2 MUST include a **confirm-password** field with a client-side match check; `registerUser` MUST reject a
  confirm-password mismatch server-side (when present) and create no user.
- Submitting the wizard MUST call the **kept** `registerUser` action (signature, rate limit, password strength, role
  validation preserved) which MUST additively **persist the step-3 profile** (`ClientProfile`/`SpecialistProfile`) in
  the same transaction as the `User`, then create the session and **redirect to `/dashboard`**.
- `/register?role=SPECIALIST` (and `=CLIENT`) MUST **preselect** that role in step 1; an absent/invalid `?role=` MUST
  start with no preselection.
- `StepIndicator` (primitive) and `RoleCards` (block) MUST be implemented token-pure with barrel exports (and a fixture
  for `RoleCards`); the **exported** checkerboard footer asset (`AuthLayout`) MUST render.
- `npm run build`, `npm run test:unit`, the new auth-onboarding E2E, the updated existing auth E2E,
  `npm run lint:composition`, and `npm run lint:tokens` MUST be green; existing single-step `registerUser`/`loginUser`
  tests MUST stay green.

### SHOULD Requirements
- The wizard SHOULD be a client `@composed-screen` (multi-step state), mirroring the `GigDetail`/`DisputeView` pattern;
  dropdowns SHOULD use the `Select` primitive (controlled + hidden input) so the screen stays F5-pure.
- `EXPERIENCE_LEVELS` SHOULD live in `lib/profiles.ts` beside `TIMEZONES`/`SPECIALIZATIONS`; step-3 values SHOULD be
  validated against the datasets server-side (as `updateProfile` does).
- The RU copy SHOULD match the references' labels («Профиль Компании»/«Профиль специалиста»/«Регистрация»/«Войти»…).

### Non-Goals
- **No data-model change** (the `profile-evolution` fields exist); **no `loginUser` change**; **no session/redirect
  contract change**; **no `/login` change** and **no removal of the legacy `components/auth/*` / `app/components/auth/*`**
  (the `/login` page still imports them — recomposing `/login` is a separate concern).
- **F1 ≤1% is NOT asserted** — it is deferred on the global font-licence gate (substitute font + lossy frames + unlocked
  design, per `fidelity.spec.ts`); the references exist, so the wizard is composed to match (F3 + F5 enforced), and the
  fidelity apparatus runs. F1 ≤1% lands per-screen once the font licence + exported raster land.

## Success Criteria

1. `/register` is an F5-pure `@composed-screen` (`RegisterWizard`) — a 3-step wizard from `AuthLayout + StepIndicator + RoleCards + form primitives`; `/auth` recomposed from the kit. No `className`/`style`/hex.
2. Step 3 is role-specific (CLIENT `reg-customer` vs SPECIALIST `reg-specialist`) with dropdowns bound to the datasets; confirm-password present with a match check.
3. `registerUser` (kept + validation) additively persists the step-3 profile + rejects confirm-password mismatch; register → session → `/dashboard` with the profile written; role preselect from `?role=` works.
4. `StepIndicator` + `RoleCards` implemented token-pure (+ fixture + exports); the exported checkerboard footer renders.
5. `build`, `test:unit` (existing auth tests green), the new + updated auth E2E, `lint:composition`, `lint:tokens` all green; F1 references-exist → composed to match, ≤1% deferred (font gate) — recorded.

## Affected Areas

- `app/register/page.tsx` (rewritten — thin: `?role=` + `<RegisterWizard>`) + `app/register/RegisterWizard.tsx` (new — `@composed-screen`, client)
- `app/auth/page.tsx` (rewritten — composed entry from the kit)
- `app/components/primitives/StepIndicator.tsx` (new) + primitives barrel + workbench registry
- `app/components/blocks/RoleCards.tsx` (new) + blocks barrel + `fixtures.ts`
- `app/actions/auth.ts` (`registerUser` additively extended: confirm-password + profile persistence; `loginUser` unchanged)
- `lib/profiles.ts` (add `EXPERIENCE_LEVELS`; reuse `TIMEZONES`/`SPECIALIZATIONS`)
- read-only / reused: `app/components/templates/AuthLayout.tsx` (+ the exported checkerboard asset), `Input`/`PasswordInput`/`Select` primitives, `lib/assets` (role icons), `lib/password`, `lib/session`
- `__tests__/e2e/compose-auth-onboarding.spec.ts` (new) + updated existing auth E2E (`register-page-redesign`, `registration`, `auth-navigation`, `auth-landing`, `login-role-param`) + `__tests__/integration/*` (registerUser profile-persistence + confirm-password)
- `openspec/specs/ui/spec.md` (spec delta — ADDED: the wizard composition) + `openspec/specs/authentication/spec.md` (spec delta — MODIFIED: Registration Action persists profile + confirm-password; Registration Page UI is the 3-step wizard)
- (NOT modified: data models; `loginUser`; the session/redirect contract; `/login`; the legacy auth components)

## Risks & Mitigations

**Risk**: Extending `registerUser` breaks existing single-step registration tests/callers (which send no confirmPassword/profile).
**Mitigation**: The extension is **conditional/additive** — confirm-password is only enforced **when** `confirmPassword` is in the form; the profile is created only when profile fields are present. The signature, rate limit, password strength, role validation, session, and redirect are unchanged. Existing registration integration tests stay green (asserted).

**Risk**: F5 — a client wizard with form fields could reintroduce raw markup/hex (the legacy pages are full of it).
**Mitigation**: The wizard composes `AuthLayout` (template) + `StepIndicator`/`RoleCards` (blocks/primitives) + `Input`/`PasswordInput`/`Select` (primitives) only; `lint:composition` (F5) forbids `className`/`style` in the screen and `lint:tokens` (F2) forbids new hex — the off-system styling that fills the legacy pages becomes impossible. The wizard is the `GigDetail`/`DisputeView` inline-client pattern.

**Risk**: Updating `/auth` + `/register` breaks the existing auth E2E (which assert the old hex markup / data-testids).
**Mitigation**: The change **explicitly updates** the affected auth specs (`register-page-redesign`, `registration`, `auth-navigation`, `auth-landing`, `login-role-param`) to the new wizard markup + `data-testid`s, and adds `compose-auth-onboarding.spec.ts`. The full E2E + unit suites are run green before completion.

**Risk**: Dropdown values could be spoofed (client `Select` posts arbitrary hidden-input values).
**Mitigation**: `registerUser` validates step-3 dropdown values against the datasets server-side (`isSpecialization`/`isTimezone`/`EXPERIENCE_LEVELS`) — exactly as `updateProfile` does — and sanitizes free-text fields; invalid values are rejected or coerced to empty.

**Risk**: F1 ≤1% cannot be asserted (font licence) — composing "by eye" could drift.
**Mitigation**: The four references exist and the wizard is composed to match their IA/step/field structure (F3); `lint:composition` (F5) + `lint:tokens` (F2) keep it on-system; the fidelity apparatus runs and records the ratio. F1 ≤1% is deferred on the documented global font gate (same as every prior compose-* screen), not faked.
