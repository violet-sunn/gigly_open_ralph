# reground-auth-to-design

## Why

Auth is the **one screen-group never re-grounded** to the authoritative design, and it is not merely styled wrong — its **flow and data model diverge** from the design. Every other screen was rebuilt as a `*Design.tsx` on `app/_design/`; auth was left on two abandoned approaches plus a structure invented by the *pre-design* `uploads/project.md` spec:

- **`/login`** — legacy hand-rolled page (checkerboard, English labels «Email address»/«Password»/«Signing in...», the misspelling **«Зарегестрироватся»**).
- **`/auth`** — a kit `RoleCards` "Вход" landing that **does not exist in the design** (role selection is *step 1 of registration*).
- **`/register`** — a kit 3-step wizard that **over-/mis-collects** fields versus the design and submits everything in one shot at the end.

The authoritative source is **`gigly_full_design/Auth.dc.html`** (owner-added 2026-06-24), which supersedes the login-less `Онбординг.dc.html`. This change is a **design-first remake**: where the current auth process or schema is deficient or diverges from the design, we change the process and the schema — we do **not** preserve current behaviour for its own sake.

## What the design requires that the current system doesn't do

- **A real login screen** («ВХОД В GIGLY») — currently absent; `/login` is a non-design legacy page.
- **A minimal, role-correct onboarding field set** — design **client** signup = Компания / ФИО / Должность / Местоположение+часовой пояс; design **specialist** signup = ФИО / Специализация / Местоположение+TZ. The schema's `ClientProfile` **lacks `position`, `location`, `timezone`**; the current wizard collected `inn`/`phone` (not asked at signup) and the specialist wizard over-collected techStack/position/experience (design moves those to profile-edit).
- **Account created at step 2** — the design's step-2 button is «Зарегистрироваться» (account created there), step 3 is profile **setup**. The current single-submit-at-the-end loses the whole signup if step 3 is abandoned.
- **Russian throughout** — `auth.ts` returns English error strings in a Russian product.
- **One coherent surface** — login↔register as linked siblings (the design's `view` state machine), not three routes.

## What Changes

**UI (rebuild on `app/_design/`):**
- New `app/_design/AuthDesign.tsx` — shared shell (GIGLY wordmark, blue **G** logomark, Handjet/Manrope, `pixel-wave.svg`, footer links) + two views: `login` («ВХОД В GIGLY») and `onboarding` (3 steps with step-dots: diagonal role chips → credentials → role-specific setup + consent). `/login` and `/register` render it.
- Delete `/auth`; homepage → `/login`. Remove all English strings + the typo.
- «Забыли пароль?» renders as a **styled non-functional link** (matches the prototype's `href="#"`); a real reset flow is a separate, post-MVP change.

**Auth process (deliberate changes):**
- **Two-phase registration**: step-2 «Зарегистрироваться» calls `registerUser` (email + password + confirm + role) which **creates the User + session (auto-login) and returns success without redirecting**; the client advances to step 3. Step-3 «Продолжить» calls `updateProfile` with the role-specific fields, then redirects to `/dashboard`. Step-3 setup is optional/skippable (account already exists), so the flow is robust to abandonment.
- **`registerUser` slims down**: it no longer accepts/persists profile fields (that moves to `updateProfile`); `buildProfileCreate` is removed. Password validation, confirm-match, rate limiting, CLIENT/SPECIALIST validation with explicit ADMIN rejection, and suspended-account handling are kept.
- **Russianize** all `loginUser`/`registerUser` user-facing error messages.
- **Middleware**: remove `/auth` (block + matcher). Keep redirect-if-authenticated on `/login` (→ `/dashboard`), but **allow authenticated users on `/register`** so the step-3 setup surface works after the step-2 account creation. Step transitions within the surface are client-side (no per-step navigation) so middleware isn't triggered mid-flow.
- Drop the vestigial `?role=` / `RegisterRoleReader` machinery (login is role-agnostic; role is chosen at onboarding step 1).

**Data model (migration):**
- `ClientProfile` gains `position String @default("")`, `location String @default("")`, `timezone String @default("")`. `updateProfile`'s CLIENT branch is extended to persist them. `inn`/`kpp`/`phoneNumber` stay optional, edited later in profile-edit.

**Tests:** update the affected E2E specs to the rebuilt screens + two-phase flow; keep the full suite green.

## Non-Goals

- **Password reset is not implemented** here (separate change; needs email/token infra, post-MVP). The «Забыли пароль?» link is a faithful placeholder.
- No OAuth / social login, no email verification.
- No INN/КПП at signup (design omits it; collected in profile-edit).
- No change to rate-limit thresholds, password rules, or JWT/session internals (beyond the non-redirecting register success path).
- Desktop-only (prototype is desktop-only); both themes via the existing `data-theme` token layer.

## Risks / Notes

- **Mid-flow auth + middleware**: the two-phase flow means the user is authenticated on `/register` at step 3 — handled by the middleware change above. A hard reload at step 3 sends the (now-authenticated) user to `/dashboard`; acceptable since the account exists and the profile can be completed in profile-edit.
- `registerUser` is consumed by tests/specs that assume a redirect; those are updated as part of this change.
