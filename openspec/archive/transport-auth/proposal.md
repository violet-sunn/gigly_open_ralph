# transport-auth

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 8 of 8 — the auth surface: login + 3-step onboarding. The final change of the initiative).

## Why

Auth is the last screen-group in the transport initiative. Unlike the other groups, **its substance has already shipped** — the archived `reground-auth-to-design` change rebuilt the entire auth surface directly on `gigly_full_design/Auth.dc.html`:

- `app/_design/AuthDesign.tsx` — the shared shell (GIGLY wordmark + blue **G** logomark + Handjet/Manrope + `pixel-wave.svg` + footer links) and the design's `view: 'login' | 'onboarding'` state machine with the 3-step onboarding (role select → credentials → role-specific setup), step-dots, back navigation, and the login↔register switch.
- `/login` renders `<AuthDesign initialView="login" />`; `/register` renders `<AuthDesign initialView="onboarding" />`.
- Two-phase registration wired (`registerUser` creates the account + session at step 2 «Зарегистрироваться»; `updateProfile` saves the profile at step 3 «Продолжить»), Russianised errors, the `ClientProfile` `position`/`location`/`timezone` migration, and **`/auth` deleted**.

So this change is a **reconcile + verification + close-out**, NOT a rebuild and NOT new flow/schema work. It diffs the live `AuthDesign` against `Auth.dc.html`, fixes any residual drift, proves every auth flow and the auth E2E are green, confirms `/auth` stays removed, and formally closes the initiative (8/8).

## Reference mapping (CRITICAL — use these exact files)

The reconcile target is the prototype file directly — auth was **not** part of the `design-reference/screens/` capture pipeline (no captured PNG exists). `gigly_full_design/Auth.dc.html` is the authoritative source (owner-added 2026-06-24; supersedes the login-less `Онбординг.dc.html`).

| App route / view | App component (EXISTING — reconcile in place) | Reference (Auth.dc.html) |
|---|---|---|
| `/login` («ВХОД В GIGLY») | `app/_design/AuthDesign.tsx` → `LoginView` | login view (~lines 18-48) |
| `/register` step 1 (role select) | `AuthDesign` onboarding step 1 | onboarding step 1 (diagonal role chips) |
| `/register` step 2 (credentials → «Зарегистрироваться») | `AuthDesign` onboarding step 2 | onboarding step 2 |
| `/register` step 3 (role-specific setup → «Продолжить» + consent) | `AuthDesign` onboarding step 3 | onboarding step 3 |

## What

Reconcile to `Auth.dc.html`, preserving all existing flow/action/schema wiring:

- **Diff `AuthDesign` against `Auth.dc.html`** view-by-view (login + the 3 onboarding steps) and fix any divergence in the shared shell (blue **G** logomark, Handjet/Manrope, `pixel-wave.svg` placement + its hide-on-steps-2/3 behaviour, footer links, the single-vs-default footer), the login view («ВХОД В GIGLY» + subtitle + email/password + «Забыли пароль?» placeholder + «Создать аккаунт» switch), the role chips, the credentials fields + client-side confirm-match, the role-specific setup fields, the step-dots, the consent line, and back navigation.
- **Verify the state machine + flows end-to-end**: login success/error; login→register and register→login switches; onboarding step 1→2→3 with back; step-2 account creation (auto-login) advancing to step 3; step-3 «Продолжить» persisting the role-specific profile and redirecting; abandonment robustness (account exists after step 2).
- **Confirm the negatives**: `/auth` returns 404 (route stays deleted, middleware no longer references it), no English strings / no «Зарегестрироватся» typo, homepage links to `/login`.
- **Close any residual drift only.** Touch `AuthDesign.tsx` (and, only if a genuine reference detail is missing, its sub-views) — do NOT re-architect.

## Constraints / Non-goals

- **Reconcile, don't rebuild; keep filenames & wiring.** Keep `AuthDesign.tsx`, the `/login` + `/register` pages, and the `view × step` state machine. Preserve the `loginUser` / `registerUser` / `updateProfile` wiring and the two-phase flow exactly.
- **No flow / action / schema changes.** The two-phase registration, Russianised errors, rate-limiting, password rules, JWT/session internals, and the `ClientProfile` `position`/`location`/`timezone` columns all stay as `reground-auth-to-design` shipped them.
- **Password reset stays a placeholder.** «Забыли пароль?» remains a styled non-functional link (matches the prototype's `href="#"`); a real reset flow is a separate post-MVP change.
- **No OAuth / social login / email verification; no INN/КПП at signup** (design omits it — collected later in profile-edit).
- **Auth is not added to the capture pipeline.** `Auth.dc.html` is the reconcile source; capturing auth into `design-reference/screens/` is explicitly out of scope.
- Desktop-only (prototype is desktop-only); both themes via the existing `data-theme` token layer.
- **Out of scope:** all other screen-groups (changes 1–7, archived).

## Impact

- Modifies: `app/_design/AuthDesign.tsx` only if drift is found (expected minimal — it was built from this reference).
- No data-model or server-action changes. The auth E2E (`auth-flow`, `auth-navigation`, `auth-session`, `compose-auth-onboarding`) must stay green; selectors updated only where markup changed.
- On completion: marks the transport initiative **8/8 complete**.
