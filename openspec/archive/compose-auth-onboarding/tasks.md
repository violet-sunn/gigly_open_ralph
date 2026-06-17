# Implementation Tasks: compose-auth-onboarding

> **Phase-2 screen composition.** Recompose `/auth` + `/register` into a **3-step registration wizard** built from the
> kit (`AuthLayout` (template, exists) + `StepIndicator` + `RoleCards` + form primitives), replacing the pre-redesign
> hex-laden pages. Step 3 persists **profile-evolution** fields (role-specific) via dropdown datasets;
> `loginUser`/`registerUser` + validation are **kept** (registration additively extended to write the profile +
> confirm-password). Two gap-fills: `StepIndicator` (primitive) + `RoleCards` (block). **F1 references exist**
> (auth/reg/reg-customer/reg-specialist) → composed to match (F3 + F5 enforced); F1 ≤1% deferred on the global
> font-licence gate. Friction: medium–high.

---

## Task 1: [x] `StepIndicator` primitive (composition-gap fill)

**Implementation Notes:**
- Create `app/components/primitives/StepIndicator.tsx` (token-pure, presentational): props `{ steps: string[];
  current: number }` (0-based). Render a row of N segments — each a numbered marker + label — with the
  completed/current/upcoming state via tokens (e.g. brand fill for done/current, muted for upcoming). No raw hex/px.
  Mirror the existing primitives (`ProgressBar`, `StatusBadge`). Sketch:
  ```tsx
  import { cx } from "./tokens";
  export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
    return (
      <ol className="flex items-center gap-2">
        {steps.map((label, i) => {
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          return (
            <li key={i} className="flex items-center gap-2 text-label font-label">
              <span className={cx(
                "inline-flex h-6 w-6 items-center justify-center rounded-circular text-caption",
                state === "upcoming" ? "bg-surface-level-2 text-muted" : "bg-brand-default text-on-brand",
              )}>{i + 1}</span>
              <span className={cx(state === "current" ? "text-strong" : "text-muted")}>{label}</span>
            </li>
          );
        })}
      </ol>
    );
  }
  ```
- Export `StepIndicator` from `app/components/primitives/index.ts`; add it to the workbench primitives registry
  (`app/workbench/registry.tsx`) for the catalogue.

**Test Plan:**
```bash
test -f app/components/primitives/StepIndicator.tsx && grep -qE 'StepIndicator' app/components/primitives/index.ts && echo "primitive + export"
npm run lint:tokens && echo "token-pure"
```
Expected: `StepIndicator` token-pure primitive (done/current/upcoming) + barrel export.

---

## Task 2: [x] `RoleCards` block (composition-gap fill)

**Implementation Notes:**
- Create `app/components/blocks/RoleCards.tsx` (token-pure; a controlled interactive block like `FilterBar`/`Select`):
  props `{ value: "CLIENT" | "SPECIALIST" | null; onSelect: (r: "CLIENT" | "SPECIALIST") => void }`. Render two cards —
  «Профиль Компании» (`ClientIcon`) and «Профиль специалиста» (`SpecialistIcon`) from `@/lib/assets` — each a `Panel`
  with the icon + label and a **selected** border state (brand border when `value === role`). Token-pure (replaces the
  legacy hex `RoleCard`). Mirror `ClientCard`/`GigCard` panel style.
- Add `roleCardsFixture` (e.g. `{ value: "CLIENT" }`-style sample for the render test) to `fixtures.ts`; export
  `RoleCards` from `app/components/blocks/index.ts`.

**Test Plan:**
```bash
test -f app/components/blocks/RoleCards.tsx && grep -qE 'RoleCards' app/components/blocks/index.ts && echo "block + export"
grep -qE 'roleCardsFixture' app/components/blocks/fixtures.ts && echo "fixture"
npm run lint:tokens && echo "token-pure"
```
Expected: `RoleCards` token-pure controlled block (two roles + selected state, icons) + fixture + barrel export.

---

## Task 3: [x] `EXPERIENCE_LEVELS` dataset + `registerUser` additive extension

**Implementation Notes:**
- `lib/profiles.ts`: add `export const EXPERIENCE_LEVELS = ['MIDDLE','SENIOR'] as const` (+ an
  `isExperienceLevel(s)` guard), beside `TIMEZONES`/`SPECIALIZATIONS`. (Optionally a labelled map for display.)
- `app/actions/auth.ts` — extend `registerUser` **additively** (keep signature, rate limit, password strength, role
  validation, `createSession`, `redirect('/dashboard')`):
  1. Read `confirmPassword` + the step-3 profile fields from `formData`.
  2. **Confirm-password (conditional):** if `confirmPassword` is present AND `confirmPassword !== password` → return
     `{ error: 'Пароли не совпадают.' }` (no user created). (Absent → skip, for backward-compat with single-step
     callers.)
  3. Create the `User` AND, **when profile fields are present**, the matching profile in **one transaction**:
     - CLIENT → `ClientProfile { companyName, inn, contactPerson, phoneNumber }` (sanitized).
     - SPECIALIST → `SpecialistProfile { displayName, position, specialization, experienceLevel, techStack, timezone }`
       — dropdown values validated against the datasets (`isSpecialization`/`isExperienceLevel`/`isTimezone`; invalid →
       coerced to `''`), free text sanitized.
  4. Then the existing `createSession` + `redirect('/dashboard')`.
- `loginUser` is unchanged.

**Test Plan:**
```bash
grep -qE 'EXPERIENCE_LEVELS' lib/profiles.ts && echo "dataset added"
grep -qE 'confirmPassword|clientProfile|specialistProfile' app/actions/auth.ts && echo "registerUser extended"
```
Expected: `EXPERIENCE_LEVELS` dataset; `registerUser` persists the profile + enforces confirm-password (when present); `loginUser` unchanged.

---

## Task 4: [x] `RegisterWizard` composed screen + `/register` page

**Implementation Notes:**
- Create `app/register/RegisterWizard.tsx` (`/* @composed-screen */` + `'use client'`): props `{ role?: 'CLIENT' |
  'SPECIALIST' | null }`. State: `step` (0..2), `role`, `password`/`confirm` (for the client match check). Compose via
  layout primitives only (no className/style):
  - `AuthLayout` (template) wraps the card.
  - `StepIndicator steps={['Роль','Доступ','Профиль']} current={step}`.
  - **Step 0 (Роль):** `RoleCards value={role} onSelect={…}` + a «Далее» `Button` (enabled when a role is chosen).
  - **Step 1 (Доступ):** `Input name="email"`, `PasswordInput name="password"`, `PasswordInput name="confirmPassword"`;
    a client-side match check gating «Далее»; a «Назад» `Button`.
  - **Step 2 (Профиль):** role-specific — CLIENT: `Input` companyName/inn/contactPerson/phoneNumber; SPECIALIST:
    `Input` displayName/position/techStack + `Select` specialization (`SPECIALIZATIONS`) / experienceLevel
    (`EXPERIENCE_LEVELS`) / timezone (`TIMEZONES`) (each controlled + a hidden input to submit). The submit posts the
    full `FormData` (hidden `role`, the credentials, the profile fields) to `registerUser` via `useActionState`;
    `{state?.error}` → `Notice`.
  - All RU copy. No `className`/`style` → F5-clean. Mirror `DisputeView`'s inline `Select` + hidden-input pattern.
- Rewrite `app/register/page.tsx` (thin): read `?role=` in a `Suspense` boundary; render `<RegisterWizard role={…} />`.

**Test Plan:**
```bash
grep -qE '@composed-screen' app/register/RegisterWizard.tsx && echo "composed screen"
grep -qE 'className=|style=|#[0-9a-fA-F]{3,6}' app/register/RegisterWizard.tsx && echo "CHECK raw styling/hex" || echo "OK no raw styling/hex"
grep -qE 'AuthLayout|StepIndicator|RoleCards' app/register/RegisterWizard.tsx && echo "composes the kit"
grep -qE 'registerUser' app/register/RegisterWizard.tsx && echo "wired to kept action"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure 3-step wizard (AuthLayout + StepIndicator + RoleCards + form primitives) wired to `registerUser`; `/register` renders it with role preselect.

---

## Task 5: [x] `/auth` entry recomposed from the kit

**Implementation Notes:**
- Rewrite `app/auth/page.tsx` as a composed entry (`'use client'`; may carry `@composed-screen`): `AuthLayout` +
  `RoleCards` (controlled) + «Войти» / «Зарегистрироваться» `Button`s routing to `/login?role=` / `/register?role=`
  (enabled once a role is picked). RU copy. No className/style/hex — replaces the legacy hex page.
- Do **not** delete the legacy `components/auth/*` / `app/components/auth/*` — `/login` still imports them.

**Test Plan:**
```bash
grep -qE 'className=|style=|#[0-9a-fA-F]{3,6}' app/auth/page.tsx && echo "CHECK raw styling/hex" || echo "OK no raw styling/hex"
grep -qE 'AuthLayout|RoleCards' app/auth/page.tsx && echo "composed entry"
grep -qE '/register|/login' app/auth/page.tsx && echo "routes to login/register with role"
npm run lint:composition && echo "F5 green"
```
Expected: `/auth` recomposed from the kit (AuthLayout + RoleCards + buttons), routing to `/login?role=`/`/register?role=`; no hex/raw markup.

---

## Task 6: [x] Integration tests (registerUser profile + confirm-password) + auth-onboarding E2E + auth-E2E update

**Implementation Notes:**
- `__tests__/integration/register-onboarding.test.ts` (mock `@/lib/prisma`/`next/*` like the existing auth tests): a
  CLIENT register with profile fields → `User` + `ClientProfile` (companyName/inn/contactPerson/phoneNumber) persisted;
  a SPECIALIST register → `User` + `SpecialistProfile` (displayName/specialization/experienceLevel/timezone) persisted
  with dropdown values; confirm-password mismatch → error + **no** user created; an invalid dropdown value → coerced to
  `''` (not persisted verbatim); **existing single-step** `registerUser` (email/password/role only, no confirmPassword)
  → still succeeds (backward-compat); a weak password → still rejected.
- `__tests__/e2e/compose-auth-onboarding.spec.ts` (Playwright): `/register` shows the StepIndicator (3 steps);
  `/register?role=SPECIALIST` preselects the specialist role; advancing role → credentials → profile; a
  confirm-password mismatch shows «Пароли не совпадают.»; a full CLIENT register (role→email/password/confirm→company
  profile→submit) lands on `/dashboard`; a full SPECIALIST register (with dropdowns) lands on `/dashboard`; the
  checkerboard footer `<img src="/assets/design-system/patterns/checkerboard.svg">` is present.
- **Update the existing auth E2E** to the new wizard markup/`data-testid`s where they assert the old hex page:
  `register-page-redesign.spec.ts`, `registration.spec.ts`, `auth-navigation.spec.ts`, `auth-landing.spec.ts`,
  `login-role-param.spec.ts` (only as needed — `/login` itself is unchanged).

**Test Plan:**
```bash
npm run clean:test-db && npx vitest run __tests__/integration/register-onboarding.test.ts 2>&1 | tail -12
npx playwright test __tests__/e2e/compose-auth-onboarding.spec.ts --project=chromium 2>&1 | tail -12
npx playwright test __tests__/e2e/register-page-redesign.spec.ts __tests__/e2e/registration.spec.ts __tests__/e2e/auth-navigation.spec.ts __tests__/e2e/auth-landing.spec.ts __tests__/e2e/login-role-param.spec.ts --project=chromium 2>&1 | tail -12
```
Expected: registerUser persists the role-specific profile + enforces confirm-password (backward-compat held); the wizard E2E covers steps/preselect/validation/register→dashboard/footer asset; the updated existing auth E2E pass on the new markup.

---

## Task 7: [x] Buildable acceptance (F3 + F5 + suite) + fidelity (references exist) + scope confirmation

**Implementation Notes:**
- Run F5 composition lint, token lint, build, the full unit suite, and the E2E.
- Confirm scope: only `/auth` + `/register` recomposed + `StepIndicator` + `RoleCards` + `RegisterWizard` + the additive
  `registerUser` extension + `EXPERIENCE_LEVELS` + tests; no data-model change; `loginUser`, the session/redirect
  contract, `/login`, and the legacy auth components unchanged.
- **Fidelity (references exist):** all four frames are present (`screens/auth.jpg`, `reg.jpg`, `reg-customer.jpg`,
  `reg-specialist.jpg`) → the wizard is composed to match their IA/step/field structure (F3 + F5 enforced). **F1 ≤1%
  is NOT asserted** — deferred on the global font-licence gate (substitute font + lossy frames + unlocked design, per
  `__tests__/e2e/fidelity.spec.ts`); the apparatus runs. Record that F1 ≤1% lands once the font licence + exported
  raster do.

**Test Plan:**
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
ls screens/ | grep -iE 'auth|reg' && echo "references exist → composed to match; F1 ≤1% deferred (font gate)"
```
Expected: F3 + F5 + build + suite + E2E green; scope held; references-exist fidelity stance recorded (≤1% deferred).

---

## Summary

Total tasks: 7
Estimated effort: 14–20 hours (friction: medium–high — a multi-step client wizard + two gap-fill components + an
additive action extension (profile persistence + confirm-password) + recomposing two legacy pages + updating several
auth E2E specs; no new data model, `loginUser`/session/redirect unchanged, `/login` untouched)

**Deliverables:**
- `StepIndicator` primitive + `RoleCards` block (gap fills) + fixture + exports.
- `registerUser` additively extended (confirm-password + role-specific profile persistence, dataset-validated); `EXPERIENCE_LEVELS` dataset.
- `RegisterWizard` F5-pure 3-step `@composed-screen` (`AuthLayout` + `StepIndicator` + `RoleCards` + form primitives); recomposed `/register` + `/auth` pages.
- Integration tests (profile persistence + confirm-password + backward-compat) + auth-onboarding E2E + updated existing auth E2E; F1 references-exist (≤1% deferred on the font gate).

**Critical path:** StepIndicator (1) + RoleCards (2) → registerUser/EXPERIENCE_LEVELS (3) → RegisterWizard + /register (4) → /auth (5) → tests + E2E update (6) → acceptance + fidelity (7).

**Dependencies:** layout-grammar (AuthLayout + checkerboard asset), ui-primitives (Input/PasswordInput/Select), profile-evolution (the profile fields) — all complete.

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–7):**
- **`StepIndicator` primitive** (`app/components/primitives/StepIndicator.tsx`) — numbered markers + labels with
  done/current/upcoming state (brand fill + `text-inverse` on filled, surface/muted on upcoming); barrel export +
  workbench registry entry. Token-pure.
- **`RoleCards` block** (`app/components/blocks/RoleCards.tsx`) — controlled `{ value, onSelect }` two-card selector
  («Профиль Компании»/«Профиль специалиста») with role icons + `aria-pressed` selected state + `data-testid`; replaces
  the legacy hex RoleCard. `roleCardsFixture` + barrel export. Token-pure.
- **`EXPERIENCE_LEVELS` + `isExperienceLevel`** in `lib/profiles.ts` (beside `TIMEZONES`/`SPECIALIZATIONS`).
- **`registerUser` additively extended** (`app/actions/auth.ts`) — confirm-password match (only when supplied) + the
  role-specific profile created in the same `user.create` (CLIENT → `ClientProfile`; SPECIALIST → `SpecialistProfile`),
  free text sanitized, dropdown values validated against the datasets (invalid → `''`). Signature, rate limit, password
  strength, role validation, session, redirect preserved. `loginUser` unchanged.
- **`RegisterWizard` `@composed-screen`** (`app/register/RegisterWizard.tsx`, `'use client'`) — `AuthLayout` +
  `StepIndicator` + `RoleCards` + form primitives; 3 steps (role → credentials w/ confirm-password match check →
  role-specific profile with `Select` dropdowns), submit → `registerUser`. F5-pure (no className/style/hex). Multi-step
  fields stay mounted via the `hidden` attribute so the single form submits every field; `Select` values carry via
  hidden inputs (the DisputeView pattern). `/register` page is thin (Suspense + `?role=` reader). `/auth` recomposed
  from the kit (`AuthLayout` + `RoleCards` + buttons).
- **Tests** — `register-onboarding.test.ts` **6/6** (CLIENT/SPECIALIST profile persisted; confirm-password mismatch →
  no user; invalid dropdown → coerced; single-step backward-compat; weak password rejected). `compose-auth-onboarding`
  E2E **5/5** (3-step indicator + role cards + footer asset · `?role=` preselect · confirm mismatch · full CLIENT
  register → /dashboard · specialist step-3 fields). Updated existing auth E2E to the new wizard — **all 7 auth spec
  files green, 60/60** (compose-auth-onboarding, register-page-redesign, auth-landing, auth-navigation, auth-flow,
  registration, login-role-param).
- **Gates** — `lint:composition` (F5, **14** composed screens; +2: /auth + RegisterWizard) ✓ · `lint:tokens` ✓ ·
  `npm run build` ✓ (`/auth` 1.05 kB · `/register` 51.2 kB) · `npm run test:unit` **900/900** (+6) ✓ · workbench +
  domain-blocks render tests ✓.

**Task 7 (F1): references exist → composed to match, ≤1% deferred.** All four frames exist
(`screens/auth.jpg`/`reg.jpg`/`reg-customer.jpg`/`reg-specialist.jpg`); the wizard is composed to match their
step/field IA (F3 + F5 enforced). **F1 ≤1% is NOT asserted** — deferred on the global font-licence gate (substitute
font + lossy frames + unlocked design, per `__tests__/e2e/fidelity.spec.ts`), the same stance as every prior compose-*
screen.

**Reconciliations recorded:**
- **Rate-limit E2E bypass (infra):** E2E runs against the real dev server (the limiter is mocked only in vitest), so a
  single run doing many registrations hit the 3/hour register limiter. Added an env-gated bypass in `lib/ratelimit`
  (`DISABLE_RATE_LIMIT === 'true'` → `limit()` returns success) set ONLY by the E2E `webServer` env in
  `playwright.config.ts` — never in production. This also de-flakes login/message E2E. The dedicated rate-limit tests
  (which mock `@/lib/ratelimit`) are unaffected.
- **Register-button copy:** the legacy typo «Зарегестрироватся» was corrected to «Зарегистрироваться» in the composed
  `/auth` + wizard; the affected auth E2E were updated accordingly. `/login` is unchanged (still uses the legacy
  components), so `login-role-param`'s `/login` CSS-border assertions remain valid.
- **F5 field markup:** composed screens forbid `className`/`style`, so fields use primitives with placeholders (no
  styled `<label>`), the `hidden` attribute keeps multi-step fields submitting, and `Select` carries via hidden inputs —
  consistent with the `GigDetail`/`DisputeView` inline-client pattern.

**Scope guards (non-goals held):** no data-model change (profile-evolution fields reused); `loginUser`, the
session/redirect contract, and `/login` unchanged; the legacy `components/auth/*` + `app/components/auth/*` kept (only
`/login` still imports them); no new server action (registration extended in place).
