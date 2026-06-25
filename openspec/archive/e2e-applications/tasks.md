# Tasks — e2e-applications

> **Status: COMPLETE.** Baseline confirmed all 5 tests already passed against `ApplicationsDesign`; broadened the owner-cards test with `[SENIOR]` / rating / «На рассмотрении» / stack tag / «Уточняющие вопросы» / «Принять» + «Отклонить`. `npm run test:e2e build-applications-screen` → 5 passed. Plan bumped 6/16 → 7/16.

> Run targeted: `npm run test:e2e build-applications-screen` (server boots once). If integration pollution is suspected, `npm run clean:test-db` first. Note: the spec is already design-grounded — this change broadens coverage; expect most existing assertions to pass before edits.

## 1. [x] Confirm the current spec passes against `ApplicationsDesign`

- Run `npm run test:e2e build-applications-screen` once as a baseline — all 5 existing tests SHOULD already pass (the spec was authored against the rebuilt component; the gig-detail «Смотреть отклики (N)» is a real `<button>`, owner-gating + accept flow unchanged).
- If any baseline test fails, note the exact selector mismatch and fix it as part of the relevant broadened test below.
- **Test plan:** baseline `npm run test:e2e build-applications-screen` → record pass/fail per test.

## 2. [x] Broaden the owner-cards test to the full applicant anatomy

- In the first test (`the owner sees the applicants …`), keep the existing assertions (`Отклики`, `на проект «BA Accept Gig»`, `← Назад к проекту`, `Тест Спец`, `Подход`, `Оценка трудозатрат`) and ADD:
  - the `[level]` chip — `await expect(page.getByText('[SENIOR]')).toBeVisible()` (seed spec1 = `SENIOR`).
  - the derived status — `await expect(page.getByText('На рассмотрении').first()).toBeVisible()` (PENDING → `review`; two pending applicants → use `.first()`).
  - a stack tag — `await expect(page.getByText('React').first()).toBeVisible()` (spec1 techStack `React,TypeScript`; `.first()` since the gig itself also tags `React`).
  - the «Уточняющие вопросы» field label — `await expect(page.getByText('Уточняющие вопросы').first()).toBeVisible()`.
  - a rating row — assert the stars row is present, e.g. `await expect(page.getByText('★★★★★').first()).toBeVisible()`.
- **Test plan:** `npm run test:e2e build-applications-screen -g "owner sees"` → green.

## 3. [x] Assert both pending actions (Принять + Отклонить)

- Add an assertion (in the owner-cards test or a small new test) that a pending applicant exposes BOTH actions:
  - `await expect(page.getByRole('button', { name: 'Принять' }).first()).toBeVisible()`
  - `await expect(page.getByRole('button', { name: 'Отклонить' }).first()).toBeVisible()`
- Do this on the un-assigned gig (`gigAcceptId`) BEFORE the accept-flow test mutates it — or in a test that navigates fresh, since `AcceptReject` only renders while `a.pending && !data.assignedName`. (Playwright tests run in file order with a shared db; the accept test assigns the gig. Keep this assertion in the first/owner-cards test, which runs before the accept test, OR seed a separate un-assigned gig if ordering is fragile.)
- **Test plan:** `npm run test:e2e build-applications-screen -g "owner sees"` (or the new title) → green.

## 4. [x] Keep the remaining tests; full-spec green + plan update

- Leave the accept-flow test (Принять → `IN_PROGRESS` + «Назначен …» banner), the non-owner redirect test, and the empty-state test as-is (they already match the component); only adjust selectors if task 1 found a mismatch.
- Run the whole file: `npm run test:e2e build-applications-screen` → 0 failures.
- Grep the spec to confirm no kit selectors crept in and the new assertions are present (`[SENIOR]`, `На рассмотрении`, `Уточняющие вопросы`, `Отклонить`).
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `e2e-applications` in `openspec/planning/e2e-reconciliation.md` and bump progress 6/16 → 7/16.
- **Acceptance:** `npm run test:e2e build-applications-screen` reports 0 failures.
