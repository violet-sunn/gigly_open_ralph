# Tasks — reconcile-auth-and-onboarding

Reconcile `app/register/RegisterWizard.tsx` so its 3 steps compose to the 5 Figma auth/onboarding nodes (role-select
`3179:3179`; create-account/specialist `3179:3863` + /company `3195:4564`; welcome/specialist `3195:4282` + /company
`3195:4704`). Swap `StepIndicator` → `AuthStepDots`, add `Logomark` + per-step headings, stay token-pure +
composition-pure, preserve `registerUser`/validation/`?role=` preselect/register→dashboard. Sources:
`docs/figma-screens-export.md` §1–2. Friction: **medium-high** (DOM restructure risks the auth E2E + register tests).

> **Implementation note (F5):** the composition lint forbids ALL `className`/markup in a `@composed-screen`, so the
> heading + subtitle text cannot live in `RegisterWizard`. The Figma auth nodes lead with a «HEADER» lockup
> (Logomark → heading + subtitle → counter), so this was coded as a new **`AuthHeader` block** (`AuthHeaderVM`,
> fixtures, workbench entry, render tests) that the wizard composes once per step. Recorded as RC-S4 in
> `docs/DESIGN_SYSTEM_SPEC.md` §10.5.

## 1. Swap the step indicator to AuthStepDots (3-step parity)
- [x] In `RegisterWizard.tsx`, replaced `<StepIndicator steps={STEPS} …>` with `<AuthHeader vm={headerFor(step,
      role)} />` (which renders `<AuthStepDots count={3} current={step} />`); dropped the `STEPS` array + the
      `StepIndicator` import. The active dot advances 1/3 → 2/3 → 3/3 as `step` changes.
- **Test:** ✅ the wizard renders the `AuthStepDots` (role="progressbar", `aria-valuenow` = step+1, max 3); the
  "Доступ/Профиль" StepIndicator labels no longer appear (E2E `getByText('Доступ').toHaveCount(0)`).

## 2. Add the Logomark + per-step heading/subtitle (via the AuthHeader block)
- [x] `AuthHeader` block (new) leads steps 1 & 2 with `<Logomark />` above the counter and renders the per-step
      heading + subtitle: step 1 "Создайте свой аккаунт" / "Выберите свою роль в Gigly."; step 2 same heading /
      "Введите свои учётные данные."; step 3 per role ("Настройте свой аккаунт" / "Введите данные." specialist;
      "Добро пожаловать" / "Настройте свой аккаунт." company). Welcome step (3) omits the Logomark per the node.
      Heading rendered as `<h1 class="text-h1 font-h1 …">` inside the block (token-pure; gives a heading role).
- **Test:** ✅ steps 1–2 render an `<img alt="Gigly">` (`gigly-logo.svg`); each step shows its heading
  (`getByRole('heading', { name: 'Создайте свой аккаунт' })`); welcome step omits the Logomark; token-pure.

## 3. Preserve behaviour (registerUser / validation / preselect / flow)
- [x] Kept `RoleCards` (step 1), the email/password/confirm inputs (step 2), and the role-specific profile fields
      (step 3) exactly as wired to `registerUser`; kept the confirm-password mismatch `Notice`, the `?role=`
      preselect, the «Войти»/«Назад» secondary buttons, the hidden `role`/`specialization`/`experienceLevel`/
      `timezone` carriers, and the «Зарегистрироваться» submit. No change to `app/actions/auth.ts`.
- [x] Kept the **full** step-3 field set (did NOT trim to the node's `Input + Select ×2`) — recorded the field-count
      divergence as a **sanctioned content variant** (RC-S6) in `docs/DESIGN_SYSTEM_SPEC.md` §10.5.
- **Test:** ✅ `?role=SPECIALIST` preselects (`aria-pressed="true"`); mismatch shows "Пароли не совпадают." and
  blocks «Далее»; a full CLIENT register lands on `/dashboard`; step 3 shows specialist vs company fields by role.

## 4. Keep it composition-pure (F5) + token-pure (F2)
- [x] `RegisterWizard.tsx` composes `AuthLayout + Section + AuthHeader + RoleCards + primitives + data` only — no
      `className`/`style`/raw markup in the screen (the heading lockup moved into the `AuthHeader` block).
- **Test:** ✅ `npm run lint:tokens` PASS (no new off-token literals); `validate-composition.js` PASS (18 composed
  screens).

## 5. Update the affected auth tests to the reconciled composition
- [x] `__tests__/e2e/compose-auth-onboarding.spec.ts`: replaced the `getByText('Роль'/'Доступ'/'Профиль')`
      assertions with `AuthStepDots`/aria (progressbar `aria-valuenow`/`aria-valuemax`) + Logomark + node-heading
      assertions; kept role-cards, `?role=` preselect, mismatch, full-CLIENT-register→`/dashboard`, specialist-step-3.
      Updated the header comment (StepIndicator → AuthHeader/AuthStepDots).
- [x] `__tests__/e2e/register-page-redesign.spec.ts`: heading → "Создайте свой аккаунт"; the 3-step-indicator test
      now asserts the dot counter + that the labels are gone; mobile-viewport heading updated.
- [x] Updated the other 3 specs that asserted the old `Регистрация` heading
      (`auth-flow`, `auth-navigation`, `registration`). Integration tests assert no indicator markup (nothing to
      change). Note: `getByText('Роль')` does case-insensitive substring matching and collides with the step-1
      subtitle "…роль…" — used the unique `Доступ` label for the "labels gone" check.
- **Test:** ✅ the updated specs pass; no test still asserts the removed `StepIndicator` labels.

## 6. Quality gates (run, assert green)
- [x] `npm run validate:tokens` — ✅ PASS (39 canonical colours; outputs in sync).
- [x] `npm run lint:tokens` — ✅ PASS (no new off-token literals).
- [x] `npm run build` — ✅ PASS (`/register` builds).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ 933/933 (96 files), +2 new AuthHeader tests.
- [x] Auth E2E green: `compose-auth-onboarding` (5/5), `register-page-redesign` + `registration` + `auth-navigation`
      (27/27 combined), `auth-flow` (16/16). DISABLE_RATE_LIMIT=true honoured by the Playwright webServer env.
- **Acceptance (Fidelity DoD):** ✅ F2 token-pure (lint green), F3 logical/flow parity (role preselect + 3-step flow
  + per-role step-3 fields + register→dashboard), F5 composition-pure (composition lint green). F1 absolute pixel
  gate deferred to Phase 2 (`refidelity-from-figma-references`) on the font-licence cap; here F1 = structural match.

## 7. Update the planning doc status
- [x] Checked `reconcile-auth-and-onboarding` under "Phase 1 — Reconcile screens"; bumped progress to `6/13`.
- **Test:** ✅ the Status checkbox reads `[x]`; progress reads `6/13`.
