# Tasks — transport-auth (change 8/8, reconcile + verify + close-out)

> Scope reminder: the substance shipped in archived `reground-auth-to-design`. This is a fidelity reconcile against `gigly_full_design/Auth.dc.html` + a verification/close-out pass. Expect a small or empty diff. Do NOT rebuild, re-architect, or change actions/schema. Most tasks are *verify*; only fix on a genuine reference miss.

## 1. Establish the baseline

- [x] Read `gigly_full_design/Auth.dc.html` (the authoritative source — login view + 3 onboarding steps; no captured PNG exists). Note the shell (G logomark, wordmark, `pixel-wave.svg` placement + when it hides), the login view copy/fields, the role chips, the credentials + confirm-match, the role-specific setup fields, the step-dots, consent line, and back affordance.
- [x] Read `app/_design/AuthDesign.tsx` and the `/login` + `/register` pages. Confirm `initialView` wiring (`login` / `onboarding`), the `view × step` state, and the `loginUser` / `registerUser` / `updateProfile` action wiring. **Confirmed:** `/login` → `<AuthDesign initialView="login" />`, `/register` → `initialView="onboarding"`; state machine + two-phase wiring intact.
- [x] Capture the auth E2E baseline by listing the relevant specs: `auth-flow.spec.ts`, `auth-navigation.spec.ts`, `auth-session.spec.ts`, `compose-auth-onboarding.spec.ts` (25 tests total).

## 2. Diff & reconcile (fix only on genuine drift)

- [x] **Shared shell:** blue **G** logomark, GIGLY wordmark, Handjet/Manrope, `pixel-wave.svg` (shown on login + step 1, hidden on steps 2/3 via `hidden={view==="onboarding" && step!==1}`), footer (single consent on step 3, 3 links otherwise) — all match `Auth.dc.html`. No drift.
- [x] **Login view:** «ВХОД В GIGLY» + subtitle, email/password, primary «Войти», «Забыли пароль?» placeholder (`href="#"`), «Создать аккаунт» switch — match.
- [x] **Onboarding step 1:** diagonal role chips (Компания ⌘ / Специалист person-icon) + step dots — match.
- [x] **Onboarding step 2:** email + Придумайте/Подтвердите пароль + client-side confirm-match; primary «Зарегистрироваться» — match.
- [x] **Onboarding step 3:** role-specific fields (company: Компания/ФИО/Должность/timezone · specialist: ФИО/Специализация/timezone), consent line, primary «Продолжить» — match.
- [x] **Back navigation + dots:** step dots match. **Justified, tested divergence kept:** step 2 has a back-arrow → step 1 (re-choose role) that the static prototype lacked; step 3's secondary control skips to `/dashboard` (account already created at step 2) rather than re-registering. Both are deliberate two-phase-reality enhancements covered by passing E2E (`compose-auth-onboarding.spec.ts:41`). Spec scenarios updated to state this accurately.
- [x] No markup changed → no E2E selector updates needed.

## 3. Verify flows end-to-end (automated)

- [x] Login success → dashboard; login failure → Russian «Неверный email или пароль», no session (`auth-flow.spec.ts` ✓).
- [x] login → register («Создать аккаунт») and register → login («Войти» on step 2) switches (`auth-flow`/`auth-navigation`/`compose-auth-onboarding` ✓).
- [x] Onboarding 1→2→3; step-2 `registerUser` creates account + auto-login → step 3; step-3 «Продолжить» persists via `updateProfile` → `/dashboard` (CLIENT + SPECIALIST ✓).
- [x] Abandonment robustness: authenticated user ALLOWED on `/register` (step-3 setup runs post-account-creation); weak password rejected at step 2 without advancing (`auth-flow.spec.ts:116`, `auth-navigation.spec.ts:74` ✓).

## 4. Confirm the negatives

- [x] `/auth` removed — `app/auth/` absent (glob: no files); zero `'/auth'` references in `middleware.ts` / `app/**`.
- [x] Homepage entry links to `/login` (`app/page.tsx:36,43`; `auth-navigation` "Get Started"/"Sign in" → `/login` ✓).
- [x] No leftover English UI strings on the auth surface; spelling is «Зарегистрироваться» (no «Зарегестрироватся» typo).

## 5. Gate & close out

- [x] `npm run build` — exit 0 (`/login` + `/register` prerendered ○; no `/auth` route).
- [x] Auth E2E green: **25/25 passed** across `auth-flow`, `auth-navigation`, `auth-session`, `compose-auth-onboarding` (fresh `test.db` server; no stale `:3000`).
- [ ] Human-in-the-loop: present `/login` and `/register` (all 3 steps) for owner confirmation against `Auth.dc.html` before archiving. *(pending owner)*
- [ ] Fold this delta into `openspec/specs/ui/spec.md` (auth section) — *at archive time (`/ralphy-archive`)*.
- [ ] Mark `openspec/planning/transport-design-from-prototype.md` **8/8 complete** — *at archive time (`/ralphy-archive`)*.

## Test plan summary

- **Build:** `npm run build` exit 0.
- **E2E:** the 4 auth specs pass (fresh test.db server).
- **Deterministic checks:** `/auth` 404; no `'/auth'` refs in middleware/app; no English/typo strings on the auth surface.
- **Manual:** login (ok/err), both switches, full 3-step onboarding with back, step-2 account creation, step-3 profile persist + redirect.
