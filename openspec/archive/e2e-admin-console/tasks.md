# Tasks — e2e-admin-console

> Reconciliation change #14. Rewrites **one** spec — `__tests__/e2e/compose-admin-dashboard.spec.ts` — against the rebuilt `AdminConsoleDesign` (`/admin`). **Tests only — no `app/`/`lib/` change.**
>
> Run targeted: `npm run test:e2e compose-admin-dashboard` (the Playwright `webServer` boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). If integration pollution is suspected, `npm run clean:test-db` first. Iterate one test with `-g "<title>"`.
>
> **Scope guard:** `/admin/users` + `/admin/gigs` are still old-kit — do NOT touch `admin-moderation.spec.ts` / `admin-pagination.spec.ts` (they stay PASS-AS-IS). This change covers `/admin` only.

## Reference — the real contract (`app/admin/AdminConsoleDesign.tsx` + `getAdminDashboard` + `app/actions/moderation.ts`)

- **Route/shell:** `/admin` renders `<AdminConsoleDesign {...getAdminDashboard()} />`. The page `<h1>` «МОДЕРАЦИЯ» lives in the **shell header** (`AppShellDesign`), not in-screen — do NOT assert an in-screen title. `/admin` redirects non-ADMIN sessions to `/dashboard`.
- **Stat tiles** (`stats.stats`, 4 fixed): labels «Пользователи» / «Гиги» / «Заблокировано» / «Закрыто», each a `<span>` label + a numeric value `<span>`. NOTE «Пользователи» and «Гиги» ALSO appear as panel `<h2>` headings → disambiguate panel assertions with `getByRole('heading', { name: … })`.
- **«Споры на модерации»** (`disputes.disputes`): an amber card + an `<h2>` «Споры на модерации» + a count badge (`queue.length`). Each row = `Avatar(d.gig)` + gig title + `d.reason · d.amount` + a `StatusDot` + a **«Рассмотреть»** `<button type="button" onClick={() => router.push('/disputes/${d.id}')}>`. The row itself is **not** a link — navigation is ONLY via «Рассмотреть». Empty: «Открытых споров нет.».
- **«Пользователи»** panel (`users`, top ~6): `<h2>` «Пользователи» + rows = `Avatar(u.email)` + email + `u.role · u.registered` + a StatusDot («Активен»/«Заблокирован») + a `<form>` button: **«Заблокировать»** when `!u.suspended` (posts `suspendUser` with hidden `userId` + `reason`), **«Разблокировать»** when suspended (posts `unsuspendUser`). After submit the page re-renders with the flipped label/status.
- **«Гиги»** panel (`gigs`, top ~6): `<h2>` «Гиги» + rows = `Avatar(g.title)` + title + `g.budget · g.created` + a StatusDot (status label or «Закрыт» when `g.closed`) + a **«Закрыть»** `<form>` button (posts `closeGig` with hidden `gigId` + `reason`) shown ONLY when `!g.closed`. After close the row shows «Закрыт» and the button is gone.
- **«Журнал модерации»** (`log`, newest first, ≤10): right-hand `<h2>` «Журнал модерации» + entries = a localized action label + `e.actor · e.at`. Action labels (from `MODERATION_ACTION_LABEL` in `lib/view-models.ts`): `SUSPEND_USER`→«Заблокирован пользователь», `UNSUSPEND_USER`→«Разблокирован пользователь», `CLOSE_GIG`→«Закрыт гиг», `RESOLVE_DISPUTE`→«Спор разрешён». Empty: «Журнал пуст.».
- **Seed (extend the existing `beforeAll`):** ADMIN, CLIENT «ООО Админ» (`inn`), SPECIALIST «Спец», an IN_PROGRESS gig «CAD Dispute Gig …» (clientId + assignedSpecialistId), an OPEN `dispute` (`reason: 'Результат не соответствует ТЗ'`, captures `disputeId`), and a `CLOSE_GIG` `moderationLog` entry (`adminId`, `targetGigId`). The seeded CLIENT/SPECIALIST surface in the «Пользователи» panel (active → «Заблокировать»); the gig surfaces in «Гиги» (not closed → «Закрыть»). Use `setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })`.

## 1. [x] Baseline + capture the mismatches

- Run `npm run test:e2e compose-admin-dashboard`; record the current pass/fail. Expect the **«the dispute queue links to the dispute»** test to fail against the rebuild (it clicks `page.getByText(gigTitle)` to navigate, but the rebuilt row is not clickable — only «Рассмотреть» navigates). The first test («dispute queue + moderation log») may still pass on substring matches but under-covers the console.
- **Test plan:** baseline run → note the exact failing assertion(s) to replace in task 2.
- **Result:** baseline = **2 failed** — both the original tests broke against the rebuild. Test 2 failed on a strict-mode collision: `page.getByText(gigTitle).click()` matched the gig title in **both** the «Споры на модерации» queue **and** the «Гиги» panel (rows are no longer clickable; only «Рассмотреть» navigates). Test 1 also failed (the partial pre-reground assertions no longer line up with the consolidated console).

## 2. [x] Rewrite `compose-admin-dashboard.spec.ts`

- Retitle the `describe` to «e2e-admin-console — moderation console». Keep / extend the existing `beforeAll` seed (capture `disputeId`, the seeded user email(s), and the gig id/title).
- **Stat tiles test:** assert the 4 tile labels «Пользователи», «Гиги», «Заблокировано», «Закрыто» are visible (use a stat-tile-scoped or `.first()` locator where the text doubles as a panel heading).
- **Dispute queue test:** assert «Споры на модерации», the gig title row, and «Результат не соответствует ТЗ»; replace `page.getByText(gigTitle).click()` with clicking the row's **«Рассмотреть»** button (`getByRole('button', { name: 'Рассмотреть' }).first().click()`); assert `page.waitForURL(new RegExp('/disputes/' + disputeId))` (or `expect(page).toHaveURL(...)`).
- **Пользователи block/unblock test:** assert `getByRole('heading', { name: 'Пользователи' })` and a seeded user email; scope to that user's row, click its **«Заблокировать»** submit (`.first()` if multiple), then assert the row flips to **«Разблокировать»** / «Заблокирован» after the re-render (`waitFor`/`toBeVisible`).
- **Гиги close test:** assert `getByRole('heading', { name: 'Гиги' })` and the seeded gig; click its **«Закрыть»** submit and assert the «Закрыт» status appears (and/or the «Закрыть» button for that gig is gone — `toHaveCount(0)`).
- **Журнал модерации test:** assert «Журнал модерации» and «Закрыт гиг» (the seeded `CLOSE_GIG` log row).
- **Test plan:** `npm run test:e2e compose-admin-dashboard` → green.
- **Done.** Rewrote into 5 scenarios (stat tiles · dispute queue → «Рассмотреть» · block user · close gig · moderation log). Seeded a dedicated active user (`cad-blockme`) + a dedicated un-closed gig (`CAD Close Gig`) so the mutation tests don't couple. Panel headings located via `getByRole('heading', …)` (the texts «Пользователи»/«Гиги» also appear as stat-tile labels + sidebar nav). **Locator gotcha:** each row nests a title-only text-column `<div>`, so a bare `filter({ hasText: title }).last()` selected that inner div (which lacks the StatusDot/button siblings) — fixed by also filtering the row on its status text (`.filter({ hasText: 'Закрыт' })` / `'Заблокирован'`). Block/close mutations redirect to the old-kit `/admin/users`·`/admin/gigs`, so each verifies by re-visiting `/admin` and asserting the flipped row state.

## 3. [x] Full green + plan update

- Run `npm run test:e2e compose-admin-dashboard` → 0 failures (`npm run clean:test-db` first if pollution suspected).
- Grep the spec to confirm: no `page.getByText(gigTitle).click()` navigation remains; «Рассмотреть», «Заблокировать»/«Разблокировать», «Закрыть», the 4 stat-tile labels, and «Журнал модерации» are present; the `describe` is retitled.
- Confirm no `app/`/`lib/` files changed and the PASS-AS-IS `admin-moderation.spec.ts` / `admin-pagination.spec.ts` are untouched; the unit/integration suite stays 951/951.
- Tick `e2e-admin-console` (#14) in `openspec/planning/e2e-reconciliation.md` and bump progress 13/16 → 14/16.
- **Acceptance:** `npm run test:e2e compose-admin-dashboard` reports 0 failures.
- **Result: COMPLETE.** `npx playwright test compose-admin-dashboard` → **5 passed (34.9s)**. Grep confirms no `page.getByText(gigTitle).click()` navigation remains; «Рассмотреть» / «Заблокировать» / «Разблокировать» / «Закрыть» / «Журнал модерации» and the retitled `describe` are present. `git status` confirms only `__tests__/e2e/compose-admin-dashboard.spec.ts` changed — no `app/`/`lib/` and no `admin-moderation.spec.ts` / `admin-pagination.spec.ts` edits. Plan bumped 13/16 → 14/16.
