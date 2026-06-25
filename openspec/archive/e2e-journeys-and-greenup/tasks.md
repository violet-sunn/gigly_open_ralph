# Tasks — e2e-journeys-and-greenup

> Reconciliation change #16 (FINAL). Rewrites **three** specs — `client-journey.spec.ts`, `specialist-journey.spec.ts`, `error-scenarios.spec.ts` — to the rebuilt screens, then **greens the whole suite**. **Tests-only — no `app/`/`lib/` change** (a genuine app issue surfaced by the greenup is flagged to the user before any minimal fix).
>
> Run targeted: `npm run test:e2e <file>` (the Playwright `webServer` boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). Full suite: `npm run clean:test-db && npm run test:e2e`. Iterate one test with `-g "<title>"`.

## Reference — the real contract

- **Gig schema (`prisma/schema.prisma`):** `status` (`OPEN`→`IN_PROGRESS`→`REVIEW`→`COMPLETED`→`PAID`), `paidAt`, `closedByAdmin`, `closedAt`, `assignedSpecialistId`, `budget`/`serviceFee`/`totalAmount`. **NO `workSubmittedAt`/`completedAt`** — drop those reads/seeds; `status` encodes the same state.
- **Create-gig (`CreateGigDesign`, `/gigs/new`)** — replicate the green `compose-create-gig` fill: `input[name="title"]`; category chip `getByText('Программирование', { exact: true })` → sets `input[name="category"]='programming'`; `textarea[name="description"]`; `input[name="goal"]`; `textarea[name="deliverables"]`; criteria editor `getByPlaceholder(/например/).fill(<≥… long criterion>)` + `getByRole('button', { name: 'Добавить' })` → sets hidden `input[name="acceptanceCriteria"]`; `input[name="budget"]`; `input[name="deadlineDays"]`; submit `getByRole('button', { name: 'Опубликовать гиг' })` → `waitForURL('**/gigs/new/success')`. (tags via `getByPlaceholder(/Введите тег/)` + Enter are optional.)
- **Applications (`ApplicationsDesign`, `/gigs/[id]/applications`)** — pending applicant cards with «Принять»/«Отклонить». Accept = click «Принять» → `acceptApplication` (gig → `IN_PROGRESS` + `assignedSpecialistId`, application → `ACCEPTED`). The owner reaches it from gig-detail «Смотреть отклики (N)».
- **Gig-detail (`GigDetail`, `/gigs/[id]`)** — apply form `textarea[name="approach"]`, `textarea[name="questions"]`, `input[name="estimatedEffort"]`, submit «Отправить заявку». Assigned specialist: «Сдать работу на проверку» (submit work). Owner on REVIEW: «Принять работу» (approve) + «Вернуть на доработку». Owner on COMPLETED: «Отметить как оплаченный» (mark paid).
- **Harness:** `createTestSession(user)` (ONE arg → token) + manual `addCookies`, or `setE2ESession(page, {id,email,role})`; `createTestUser`/`createTestGig`/`createTestApplication` from `../helpers/seed`; clean with `npm run clean:test-db`.
- **PASS-AS-IS specs to re-confirm in the greenup:** `auth-flow`, `auth-landing`, `auth-navigation`, `auth-session`, `csrf-protection`, `gig-browse-access` (known flake), `admin-moderation`, `admin-pagination`, `theme-coverage`, `register-page-redesign`, `registration`, `compose-onboarding`, `compose-auth-onboarding`, `login-role-param`, `fidelity`.

> **Scope note (revised mid-implementation by user decision):** The full-suite greenup (task 5) surfaced that the suite was never run green as a whole post-reground — **47 failures**, dominated by FK-unsafe `deleteMany()` cleanup in legacy specs. The user chose **"fix isolation, flag auth-flow"**: do the tests-only isolation fix, then flag the residual genuine content-drift (pre-existing clean-db failures in PASS-AS-IS specs) for a follow-up rather than expand this change. Outcome: **47 → 13 failures**; the 13 residual are documented in `openspec/planning/e2e-greenup-residual.md`.

## 1. [x] Baseline + capture the mismatches

- Run the three specs: `npm run test:e2e client-journey`, `specialist-journey`, `error-scenarios`. Record the failing assertions (English `Accept`/`Approve`/`Mark as Paid`/`Submit Application`, the gig-detail accept flow, `textarea[name="estimatedEffort"]`, `textarea[name="workDescription"]`, the create-gig flat-form fill / dashboard redirect, and the `workSubmittedAt`/`completedAt` tsc fields — Playwright transpiles so these surface as runtime/locator failures, not type errors).
- **Test plan:** baseline → drive tasks 2–4.
- **Result:** specialist-journey failed on `textarea[name="estimatedEffort"]` (now an `input`); client-journey on the flat create-gig form + `Accept`/`Approve`/`Mark as Paid`; error-scenarios passed 15/15 at runtime but carried the tsc field errors + vacuous English-label absence checks.

## 2. [x] Rewrite `client-journey.spec.ts`

- **Create-gig (UI):** replace the old flat-form fill + dashboard-redirect with the `CreateGigDesign` sequence (see Reference) ending in `waitForURL('**/gigs/new/success')`; then look up the gig by `clientId` (newest) to get `gigId`. Keep the `status='OPEN'` + serviceFee/totalAmount assertions.
- **Apply (programmatic):** keep `createTestApplication` (PENDING).
- **Accept (UI):** navigate to `/gigs/${gigId}/applications` (optionally via gig-detail «Смотреть отклики»); click «Принять»; poll the DB until `status='IN_PROGRESS'` + `assignedSpecialistId` set + application `ACCEPTED`.
- **Submit work (programmatic):** keep `status:'REVIEW'`.
- **Approve (UI):** on `/gigs/${gigId}`, click «Принять работу»; poll until `status='COMPLETED'`.
- **Mark paid (UI):** on `/gigs/${gigId}`, click «Отметить как оплаченный»; poll until `status='PAID'` + `paidAt` truthy.
- Keep the final DB state block (profiles, budget math, ACCEPTED app).
- **Test plan:** `npm run test:e2e client-journey` → green.
- **Done — 1 passed.** Create-gig via the `CreateGigDesign` fill (category «Программирование» chip + criteria editor «Добавить») → `**/gigs/new/success`; accept on `/gigs/[id]/applications` «Принять»; approve «Принять работу»; mark-paid «Отметить как оплаченный». Full lifecycle reaches `PAID` + `paidAt`. Seeded the `programming` category idempotently.

## 3. [x] Rewrite `specialist-journey.spec.ts`

- **Browse (UI):** `/gigs`, the gig title/card is visible; click it → `/gigs/${gig.id}`.
- **Apply (UI):** fill `textarea[name="approach"]`, `textarea[name="questions"]`, **`input[name="estimatedEffort"]`** (not `textarea`); submit via `getByRole('button', { name: 'Отправить заявку' })`. Keep the DB assertions (PENDING + field values).
- Keep the programmatic accept/submit/approve steps + final assertions.
- **Test plan:** `npm run test:e2e specialist-journey` → green.
- **Done — 1 passed.** Apply via `input[name="estimatedEffort"]` + the «Отправить заявку» button.

## 4. [x] Rewrite `error-scenarios.spec.ts`

- **Field fixes:** delete `expect(gigAfter?.workSubmittedAt).toBeFalsy()` (line ~338) and `expect(gigAfter?.completedAt).toBeFalsy()` (line ~391) — the adjacent `status` assertions already cover the state; remove `workSubmittedAt: new Date()` (line ~357) and `completedAt: new Date()` (lines ~507, ~559) from the `createTestGig` seeds (status `REVIEW`/`COMPLETED`/`PAID` suffices).
- **Label fixes:** `button:has-text("Submit Application")` → «Отправить заявку» (line ~229); `button:has-text("Approve")` → «Принять работу» (line ~383); `button:has-text("Mark as Paid")` → «Отметить как оплаченный» (line ~423); the `textarea[name="workDescription"]` absence check (line ~330) → assert the «Сдать работу на проверку» button is NOT visible for the non-assigned specialist.
- **Keep** the unauthenticated-redirect (`/dashboard`,`/gigs/new`,`/gigs/[id]`,`/admin` → `/login`) and RBAC scenarios (SPECIALIST → `/gigs/new` guard, CLIENT can't see the apply form, non-ADMIN can't reach `/admin`); verify they still pass against the rebuilt routes (adjust only drifted selectors).
- **Test plan:** `npm run test:e2e error-scenarios` → green.
- **Done — 15 passed.** Dropped the non-existent `workSubmittedAt`/`completedAt` reads + seeds (status encodes the state); reconciled labels to «Отправить заявку» / «Принять работу» / «Отметить как оплаченный» / «Сдать работу на проверку» (absence). tsc field errors resolved.

## 5. [x] Full-suite greenup (revised → isolation fix + flag residual)

- `npm run clean:test-db && npm run test:e2e`. First run = **47 failed / 152 passed**. Root cause: FK-unsafe `deleteMany()` cleanup in legacy specs throwing once the shared db holds disputes/reviews/notifications/moderation-logs from `compose-*` specs that don't clean up; this cascaded and masked the true state.
- **Isolation fix (tests-only):** added a shared FK-safe `resetE2EDb(tx)` to `__tests__/helpers/seed.ts` (deletes in dependency order, mirroring `db.ts`'s `resetTestDatabase`); replaced the unscoped deletes in `auth-session`, `client-journey`, `csrf-protection`, `error-scenarios`, `gig-browse-access`, `gig-pagination`, `messaging-flow-e2e`, `specialist-journey`; added a `beforeEach` reset to `gig-browse-access` and a reset-before-seed to `compose-gig-search` (so «Найдено N» counts only its own gigs).
- **Second run = 13 failed / 186 passed.** The remaining 13 **all fail in isolation on a clean db** — pre-existing content drift in PASS-AS-IS specs (auth/register-wizard cluster ×9, `csrf-protection` stale create-gig fill ×1, `gig-browse-access` old-kit UI ×3), NOT caused by this change and NOT pollution. **FLAGGED** in `openspec/planning/e2e-greenup-residual.md` for a follow-up (`e2e-greenup-residual`) per the user decision.
- Confirmed: only `app/(protected)/gigs/GigSearchDesign.tsx` (the prior change's aria-label) is the standing `app/` diff; this change is otherwise tests + the `seed.ts` helper. Unit/integration suite unaffected.
- **Test plan:** full suite reduced 47 → 13 failures; the 3 rewritten specs + all isolation-fixed specs are green; residual flagged.

## 6. [x] Plan update + close out

- Tick `e2e-journeys-and-greenup` (#16) in `openspec/planning/e2e-reconciliation.md`; bump progress 15/16 → 16/16. The journey/error rewrites + the suite-wide isolation fix are complete; the suite is **not** fully green (13 pre-existing PASS-AS-IS content-drift failures flagged for `e2e-greenup-residual`).
- **Acceptance (revised by user decision):** the 3 rewritten specs green in isolation; the FK-safe isolation fix lands (47 → 13 failures); the residual genuine failures documented + flagged; no `app/`/`lib/` behaviour change.
