# e2e-admin-console

## Why

Reconciliation change #14 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The admin moderation console at `/admin` was rebuilt on the `gigly_full_design` prototype's own `isAdminConsole` markup (`AdminConsoleDesign.tsx`) over the **unchanged** view model (`getAdminDashboard` in `lib/view-models.ts`) and moderation actions (`suspendUser` / `unsuspendUser` / `closeGig` in `app/actions/moderation.ts`). The single E2E spec `compose-admin-dashboard.spec.ts` still asserts the partial pre-reground console and is now out of date with the consolidated «МОДЕРАЦИЯ» surface.

The rebuilt `/admin` console (`AdminConsoleDesign`) renders:

- **4 stat tiles** — «Пользователи» / «Гиги» / «Заблокировано» / «Закрыто», each a label span + a numeric value.
- **«Споры на модерации»** — an amber-bordered card with the open-dispute queue + a count badge; each row is an avatar + gig title + `reason · amount` + a status dot + a **«Рассмотреть»** button that `router.push`-es to `/disputes/[id]`. Empty: «Открытых споров нет.».
- **«Пользователи»** — a panel (`<h2>`) of the top user rows (email + `role · registered` + active/blocked status dot) with a per-row **«Заблокировать»** (active) / **«Разблокировать»** (suspended) submit button posting `suspendUser` / `unsuspendUser`.
- **«Гиги»** — a panel (`<h2>`) of the top gig rows (title + `budget · created` + status dot) with a **«Закрыть»** submit button (posting `closeGig`) on every not-yet-closed gig.
- **«Журнал модерации»** — the right-hand audit log card; each entry is a localized action label (e.g. «Закрыт гиг», «Заблокирован пользователь») + `actor · at`. Empty: «Журнал пуст.».

The page title lives in the **shell header** («МОДЕРАЦИЯ» in `AppShellDesign`) — there is no in-screen `<h1>`.

The current `compose-admin-dashboard.spec.ts` is stale/insufficient:

- Its `describe` block is titled «reconcile-finances-and-admin — admin console» and only covers two of the console's five panels (the dispute queue + the log).
- **Test 2 will break against the rebuild:** it navigates to the dispute by `page.getByText(gigTitle).click()` — but in the rebuilt console the dispute row is **not** clickable; only the explicit **«Рассмотреть»** button does `router.push('/disputes/[id]')`. Clicking the title text is a no-op, so the URL assertion fails.
- The stat tiles, the «Пользователи» block/unblock controls, and the «Гиги» «Закрыть» control are **not exercised at all**.

This change rewrites the spec against the rebuilt `AdminConsoleDesign` and its stable data/action contract, and broadens coverage to the full console. **No `app/`/`lib/` behaviour changes.**

**Out of scope:** `/admin/users` and `/admin/gigs` are still the old kit screens; `admin-moderation.spec.ts` + `admin-pagination.spec.ts` stay **PASS-AS-IS** and are untouched. This change covers `/admin` only.

## What Changes

- **REWRITE `__tests__/e2e/compose-admin-dashboard.spec.ts`** against `AdminConsoleDesign` (`/admin`), retitling the `describe` to «e2e-admin-console — moderation console». Extend the existing `beforeAll` seed (ADMIN + CLIENT «ООО Админ» + SPECIALIST + an IN_PROGRESS gig + an OPEN dispute + a `CLOSE_GIG` moderation-log entry) as needed; reuse `setE2ESession` + direct Prisma seeding into `file:./test.db`.
  - **Stat tiles:** assert the 4 tile labels «Пользователи» / «Гиги» / «Заблокировано» / «Закрыто» render (locate panel headings by `getByRole('heading', …)` to avoid strict-mode collisions with the same-text stat-tile spans).
  - **Dispute queue + «Рассмотреть»:** assert «Споры на модерации», the seeded gig title row, and the reason «Результат не соответствует ТЗ»; click the row's **«Рассмотреть»** button (NOT the title text) and assert the URL matches `/disputes/<disputeId>`.
  - **Пользователи block/unblock:** assert the «Пользователи» heading and a seeded user email; click that row's **«Заблокировать»** submit, then assert the row flips to **«Разблокировать»** / status «Заблокирован» (the `suspendUser` action runs under the ADMIN session, then the page re-renders).
  - **Гиги «Закрыть»:** assert the «Гиги» heading and a seeded gig; click its **«Закрыть»** submit and assert the gig flips to the «Закрыт» status (or the «Закрыть» button is gone for that row).
  - **Журнал модерации:** assert «Журнал модерации» and the seeded log row label «Закрыт гиг» (unchanged).
- Reuse the existing harness; **no app/lib changes** — the console is located by its real labels/buttons, not by added test hooks.

## Impact

- **Affected:** `__tests__/e2e/compose-admin-dashboard.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`AdminConsoleDesign`, `getAdminDashboard`, `suspendUser`/`unsuspendUser`/`closeGig`); `/admin/users` + `/admin/gigs` and their PASS-AS-IS specs (`admin-moderation`, `admin-pagination`); the unit/integration suite (951/951 — must stay green).
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 13/16 → 14/16.
