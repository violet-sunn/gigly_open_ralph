# Tasks — reground-auth-to-design (design-first remake)

> Source of truth: `gigly_full_design/Auth.dc.html`. Pattern to mirror: `app/_design/*Design.tsx` + `app/_design/tokens.css`.
> Decisions locked: (1) account created at **step 2**, profile setup at step 3; (2) «Забыли пароль?» = non-functional placeholder; (3) follow design — INN/phone out of signup, add ClientProfile location/timezone/position.

## 1. Data model + profile action

- [x] `prisma/schema.prisma` — add to `ClientProfile`: `position String @default("")`, `location String @default("")`, `timezone String @default("")`. Apply with `npx prisma db push` (SQLite; matches project convention).
- [x] `app/actions/profile.ts` — extend the CLIENT branch of `updateProfile` to read + persist `position`, `location`, `timezone` (validate `timezone` against `TIMEZONES`; `location`/`position` sanitized free text). SPECIALIST branch already supports specialization/location/timezone.
- Test plan: integration test — `updateProfile` for a CLIENT persists company/contactPerson/position/location/timezone; invalid timezone → `''`. `npm run test:unit` green.

## 2. Auth actions (process changes)

- [x] `app/actions/auth.ts` — **two-phase register**: `registerUser` creates User + session from `email`/`password`/`confirmPassword`/`role` only; on success **return `{ ok: true }` (do NOT redirect)** so the wizard can advance to step 3. Remove `buildProfileCreate` and all profile-field handling from `registerUser`.
  - Keep: rate limit (before validation), `validatePassword`, confirm-match, role ∈ {CLIENT, SPECIALIST} with explicit ADMIN rejection, duplicate-email handling.
- [x] **Russianize** all user-facing messages in `registerUser` and `loginUser` (invalid credentials, suspended account, duplicate email, role-missing, password errors surfaced from `validatePassword` if any are English).
- [x] Confirm `loginUser` still redirects to `/dashboard` on success (single-phase, unchanged behaviour aside from RU messages).
- Test plan: integration tests — `registerUser` returns `{ok:true}` + creates a session cookie and a User with **no** profile; duplicate email → RU error; ADMIN role rejected; `loginUser` RU errors. Update existing auth action tests that asserted a redirect/English copy.

## 3. Middleware + homepage + `/auth` removal

- [x] `middleware.ts` — remove the `/auth` block and the `'/auth'` matcher entry. Keep `/login` redirect-if-authenticated (→`/dashboard`). **Remove `/register` from the redirect-if-authenticated set** (authenticated users must reach step-3 setup); `/register` stays in the matcher only if needed for other guards (otherwise drop it). Keep all protected/admin guards.
- [x] `app/page.tsx` — change unauthenticated CTAs from `/auth` to `/login`.
- [x] Delete `app/auth/` (page) and remove any imports/links to it.
- Test plan: `/auth` no longer served; homepage → `/login`; authed user on `/login` → `/dashboard`; authed user on `/register` is **allowed** (not redirected).

## 4. Shared shell + login view (`AuthDesign.tsx`)

- [x] Copy `gigly_full_design/assets/pixel-wave.svg` → `public/assets/pixel-wave.svg` (referenced as `/assets/pixel-wave.svg`).
- [x] Create `app/_design/AuthDesign.tsx` (`"use client"`, `import "./tokens.css"`): shared shell (GIGLY wordmark top-left, pixel-wave bottom band, footer links Политика/Условия/Помощь on `#01030e`) + reusable header lockup (blue G logomark 75px `#0088ff` r18, Handjet 40px heading, Manrope subtitle, optional step-dots). Inline styles ported from `Auth.dc.html`; colours/fonts via `var(--…)`/literal Handjet-Manrope from `tokens.css`. Props: `{ initialView: "login" | "onboarding" }`.
- [x] Implement `login` view (Auth.dc.html 18–48): «ВХОД В GIGLY» / «Введите данные своего аккаунта.», Email + Пароль, right-aligned **«Забыли пароль?»** (`href="#"`, non-functional), blue «Войти» → `loginUser` via `useActionState` (inline error), and **«Нет аккаунта? Создать аккаунт»** → switch to onboarding. No step-dots. No English, no checkerboard.
- Test plan: `auth-flow`/`compose-auth-onboarding` assert «ВХОД В GIGLY», fields, bad-credential error, good-credential → `/dashboard`, and the switch link.

## 5. Onboarding view (3 steps, two-phase)

- [x] Step 1 (50–84): «СОЗДАЙТЕ СВОЙ АККАУНТ» / «Выберите свою роль в Gigly.», step-dots[1], diagonal chips «Компания» (top-right, ⌘) + «Специалист» (bottom-left, person icon). Selecting a role → step 2.
- [x] Step 2 (86–120): step-dots[2], Email + Пароль («Придумайте пароль») + Подтвердите; client-side mismatch «Пароли не совпадают.»; **«Зарегистрироваться»** → call `registerUser`; on `{ok:true}` advance to step 3 (user now authenticated). **«Войти»** link → login view.
- [x] Step 3 (122–168): step-dots[3], role-specific fields —
  - CLIENT «ДОБРО ПОЖАЛОВАТЬ» / «Настройте свой аккаунт.»: Компания / ФИО (→`contactPerson`) / Должность (→`position`) / Местоположение и часовой пояс (→`location`/`timezone`).
  - SPECIALIST «НАСТРОЙТЕ СВОЙ АККАУНТ» / «Введите данные»: ФИО (→`displayName`) / Специализация (dataset) / Местоположение и часовой пояс (→`location`/`timezone`).
  - **«Продолжить»** → `updateProfile` then redirect `/dashboard`. Back-arrow at step 3 → `/dashboard` (skip setup; account already exists — do NOT return to the credentials step, since re-registration would fail). Consent footer «Нажимая «Продолжить»…».
- [x] Step transitions are **client-side state only** (no per-step `router.push`) so middleware isn't triggered after the step-2 account creation. Mount all fields across steps (hidden) only where a single form submit is used; here step 2 and step 3 submit to **different** actions, so use two forms/handlers.
- [x] Reuse `SPECIALIZATIONS`/`TIMEZONES` from `lib/profiles` for the dropdowns.
- Test plan: `compose-auth-onboarding` walks role→register→setup for both roles; asserts step-dots, the step-2 account creation (session set), step-3 `updateProfile` persistence, back-from-step-1 → login, and final redirect to `/dashboard`.

## 6. Wire routes + retire kit auth

- [x] `app/login/page.tsx` → `<AuthDesign initialView="login" />`. `app/register/page.tsx` → `<AuthDesign initialView="onboarding" />`.
- [x] Remove the `?role=` machinery: delete `app/register/RegisterRoleReader.tsx` and `app/register/RegisterWizard.tsx`; drop `?role=` reads. (Login is role-agnostic; role chosen at step 1.)
- [x] Retire kit auth components no longer used by any route (`AuthLayout`/`AuthHeader`/`AuthFooter`/`RoleCards`/`AuthContainer`/`AuthButton`/`AuthStepDots`): delete if unreferenced, leave only if still used by the workbench/registry (note which).
- Test plan: `npm run build` green; `lint:composition` (screen count) consistent; grep shows no remaining imports of deleted modules.

## 7. E2E specs + greenup

- [x] Update/rewrite: `auth-flow`, `auth-navigation`, `compose-auth-onboarding`, `csrf-protection`, `gig-browse-access`, `client-journey`, `specialist-journey`; delete `/auth`-landing assertions and `?role=` assertions; update any helper that registers via the wizard to the two-phase flow.
  - Keep `DISABLE_RATE_LIMIT=true` in the Playwright webServer; restart the dev server before a clean full run (stale test.db handle trap).
- [~] Repo specs (`openspec/specs/authentication/spec.md`, `openspec/specs/ui/spec.md`, `data-model`) are merged from this change's `specs/` deltas by `/ralphy-archive` (the canonical OpenSpec flow), not hand-edited during implement.
- Test plan: `npm run build`; `npm run lint` (+ `lint:tokens`/`lint:contrast` — auth must be token/font-pure); `npm run test:unit` green; targeted E2E green, then **full** `npm run test:e2e` green (0 failures).

## 8. Fidelity check vs prototype

- [x] Diff live `/login` + the 3 onboarding steps against `gigly_full_design/Auth.dc.html` (text, blue-G geometry, diagonal chips, pixel-wave, footer, step-dots) in both themes.
- Test plan: screenshot each live screen, overlay vs the prototype frame; confirm no off-design literals.
