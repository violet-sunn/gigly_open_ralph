# Tasks — e2e-greenup-residual

> Follow-up that greens the 13 residual failures flagged by #16 (`openspec/planning/e2e-greenup-residual.md`). Reconciles **five** specs to the rebuilt auth wizard / create-gig / browse-examples screens, then confirms the **whole** suite is 0 failures. **Tests-only — no `app/`/`lib/` change.**
>
> Run targeted: `npm run test:e2e <file>`. Full suite: `npm run clean:test-db && npm run test:e2e`. The #16 FK-safe `resetE2EDb` (`__tests__/helpers/seed.ts`) is in place — don't reintroduce unscoped `deleteMany()`.

## Reference — the real contract

- **RegisterWizard (`app/register/RegisterWizard.tsx`):** 3 steps. Step 0 role (preselected from `?role=`), «Далее» (disabled until a role is set); step 1 credentials (`input[name="email"]`, `name="password"`, `name="confirmPassword"`; mismatch → «Пароли не совпадают.»), «Далее» (disabled until password+confirm match); step 2 profile (CLIENT: `companyName`/`inn`/`contactPerson`/`phoneNumber`; SPECIALIST: `displayName`/`position`/`techStack` + Select dropdowns) + a consent `Notice`; the step-3 submit is **`<Button type="submit">Продолжить</Button>`** → posts `registerUser` → `**/dashboard`. The «Зарегистрироваться» label exists ONLY as the `/auth` register navigation CTA — NOT in the wizard.
- **`/login` role card:** migrated border color **`rgb(0, 136, 255)`** (see the passing `auth-navigation` assertions at lines 40/50/100).
- **CreateGigDesign fill** (from the green `compose-create-gig` / journeys): `input[name="title"]`; category chip `getByText('Программирование', { exact: true })`; `textarea[name="description"]`; criteria editor `getByPlaceholder(/например/).fill(<≥50-char criterion>)` + `getByRole('button', { name: 'Добавить' })` (→ hidden `input[name="acceptanceCriteria"]`); `input[name="budget"]`; submit `getByRole('button', { name: 'Опубликовать гиг' })` → `**/gigs/new/success`. Seed the `programming` category (`prisma.category.upsert`).
- **Browse/examples:** `/gigs/examples` route still exists (old-kit English «Example Gigs»). The «💡 View example gigs for inspiration» link was **dropped** from `CreateGigDesign`. The rebuilt `/gigs` is `GigSearchDesign` (SPECIALIST). Confirm during baseline whether `/gigs` still gates CLIENTs and what heading/message it shows.

> **Key discovery (mid-implementation):** several auth-cluster "failures" were a **stale dev server** artifact, not content drift. The Playwright `webServer` (reuseExistingServer) had run the whole session; after repeated `clean:test-db` deleted `test.db` under it, its SQLite handle went stale → login/register couldn't see freshly-seeded users ("Invalid email or password", no `/dashboard` redirect). **Restarting the dev server** (kill the listener on :3000 so the next run boots fresh after the clean) fixed those. Always restart the server before a clean full-suite run.

## 1. [x] Baseline + capture the mismatches

- Run the five specs individually on a clean db (`npm run clean:test-db` first): `auth-flow`, `auth-navigation`, `compose-auth-onboarding`, `csrf-protection`, `gig-browse-access`. Record the exact failing assertions (expect: «Зарегистрироваться» wizard-submit not found; `rgb(2,101,220)` border; `textarea[name="acceptanceCriteria"]` timeout; the «View example gigs» link / «Example Gigs» / «only available for specialists» / «Поиск гигов» assertions).
- For `gig-browse-access`, capture what the rebuilt `/gigs` actually does for a CLIENT (redirect? message? heading) and what `/gigs/examples` renders — this drives task 4 + any user decision.
- **Test plan:** baseline → drive tasks 2–4.

## 2. [x] Fix the auth cluster (auth-flow, auth-navigation, compose-auth-onboarding)

- Replace the **wizard step-3 submit** click «Зарегистрироваться» → **«Продолжить»** in: `auth-flow`'s `registerViaWizard` + the inline CLIENT walk (`:72`) + the weak-password walk (`:250`); `auth-navigation`'s `registerViaWizard`; `compose-auth-onboarding`'s full-registration test (`:40`). Do NOT touch the `/auth` «Зарегистрироваться» navigation CTA clicks.
- In `auth-flow`, change the `/login` role-card border assertion `rgb(2, 101, 220)` → **`rgb(0, 136, 255)`** (`:40`, `:140`).
- **Test plan:** `npm run test:e2e auth-flow auth-navigation compose-auth-onboarding` → green.
- **Done — 33 passed.** Swapped the wizard step-3 submit «Зарегистрироваться» → «Продолжить» (registerViaWizard ×2 + the two inline auth-flow walks); auth-flow `/login` border `rgb(2,101,220)` → `rgb(0,136,255)`. Required a **dev-server restart** (the stale handle was making login/register fail).

## 3. [x] Fix csrf-protection

- Replace the flat create-gig fill (`textarea[name="acceptanceCriteria"]` + generic `button[type="submit"]`) with the `CreateGigDesign` sequence (seed `programming`; title → category chip → description → criteria editor «Добавить» → budget → «Опубликовать гиг»). Keep the assertion that the gig is created via the same-origin server action (queryable by title, `budget > 0`). Update the seeded title if needed so the query stays unique.
- **Test plan:** `npm run test:e2e csrf-protection` → green.
- **Done — 2 passed.** Replaced the flat fill (`textarea[name="acceptanceCriteria"]`) with the `CreateGigDesign` sequence (seed `programming`; category chip + criteria editor «Добавить» + «Опубликовать гиг» → `**/gigs/new/success`); kept the same-origin gig-created assertion.

## 4. [x] Reconcile gig-browse-access

- Using the task-1 findings, reconcile the three failing tests to the rebuilt behaviour:
  - **`:40` (CLIENT view examples):** the create-form «View example gigs» link is gone — navigate to `/gigs/examples` directly (drop the link-click + new-tab dance) and assert the examples page renders the seeded example gig; OR delete this test if the affordance was removed by design.
  - **`:111` (CLIENT cannot browse):** assert the rebuilt CLIENT-gating behaviour (real redirect/message), or remove the stale English-message assertions if gating changed.
  - **`:150` (SPECIALIST browse + examples):** assert the rebuilt `/gigs` heading (the shell `<h1>` «ПОИСК ГИГОВ» or the real in-content heading — fix `h2:has-text("Поиск гигов")` to match) + the surviving `/gigs/examples`.
  - Keep the passing unauthenticated-redirect test.
- **If the examples/gating feature was removed by design**, FLAG to the user and decide delete-vs-reconcile (like the mobile-responsive/confirmation-dialogs deletions).
- **Test plan:** `npm run test:e2e gig-browse-access` → green (or the removed tests deleted with a rationale).
- **Done — 4 passed. Both features SURVIVE (no deletion/decision needed).** `/gigs` still gates CLIENT (server-side `redirect('/dashboard?error=browse-gigs-specialists-only')`) → assert the CLIENT redirect away from `/gigs` (the error param is consumed/cleaned by the dashboard, so don't assert it). `/gigs/examples` survives, CLIENT-accessible, old-kit «Example Gigs» → `:40` reaches it directly (the dropped create-form link is gone). `:150` asserts the rebuilt `/gigs` «Найдено» heading (not the old `h2 "Поиск гигов"`) + the examples page.

## 5. [x] Full-suite greenup + close out

- `npm run clean:test-db && npm run test:e2e` → **0 failures**. Confirm the #16 FK-safe isolation still holds (no FK-cleanup throws) and no other spec regressed.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays 951/951.
- Update `openspec/planning/e2e-greenup-residual.md` (mark resolved) and note in `openspec/planning/e2e-reconciliation.md` that the suite is now fully green.
- **Acceptance:** `npm run clean:test-db && npm run test:e2e` → 0 failures; no `app/`/`lib/` behaviour change.
- **Result: COMPLETE.** After killing the stale dev server, `npm run clean:test-db && npm run test:e2e` → **199 passed (6.1m), 0 failures** — the WHOLE suite is green. The only `app/` diff is the prior change's `GigSearchDesign` aria-label (this change is tests-only). The #16 FK-safe isolation held (no cleanup throws).

## 6. [x] Close out

- Marked the flag doc resolved + noted the suite is fully green in the reconciliation plan.
