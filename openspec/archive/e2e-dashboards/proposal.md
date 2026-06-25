# Reconcile the Dashboard E2E Specs to `DashboardDesign.tsx`

**Change:** `e2e-dashboards`
**Created:** 2026-06-22
**Plan:** Change #4 of `openspec/planning/e2e-reconciliation.md`

## Why

`/dashboard` was rebuilt on the `gigly_full_design` prototype as `app/(protected)/dashboard/DashboardDesign.tsx` (one component for both roles, fed by `getClientDashboard`/`getSpecialistDashboard` via `page.tsx`). Both `compose-client-dashboard.spec.ts` and `compose-specialist-dashboard.spec.ts` still assert the **old kit** dashboard and are red:

- greeting `«Здравствуйте»` → the rebuilt WELCOME is `«Добро пожаловать в Gigly!»`;
- `«Активные задачи»` panel header → now `«Мои гиги»`;
- `getByRole('tablist')` + `getByRole('tab', …)` → the tabs are plain `<div onClick>` chips (no ARIA tab roles);
- specialist `«Найти проект»` button → now a search `<input>` (placeholder `«Поиск по стеку или категории»`);
- `«Уведомления»` strip → now `«Требует внимания»`;
- `«К проекту»` *button* to open a gig → the compact dashboard `GigCard` has no such button (the whole card is a `<Link>`);
- `getByRole('heading', { name: 'Дашборд' }).toHaveCount(0)` → **now fails**: the shell (`AppShellDesign`) renders `<h1>ДАШБОРД</h1>` (`pageTitle('/dashboard')`), which matches `'Дашборд'` case-insensitively.

Restoring both green re-arms the dashboard-composition regression coverage for both roles.

## Grounding (verified against `DashboardDesign.tsx`, `page.tsx`, `GigCard.tsx`, `AppShellDesign.tsx`, `lib/view-models.ts`)

- **WELCOME** `«Добро пожаловать в Gigly!»` (`DashboardDesign.tsx:173`), both roles.
- **Onboarding** tiles render `vm.onboarding[*].title` → `«Заполните профиль»` (still present).
- **Panel header** `<h2>«Мои гиги»</h2>` (`:202`) + count badge; the feed is design `GigCard`s, or `«Здесь пока пусто.»` when empty.
- **Tab chips** are `<div onClick>` (`:231`), **not** ARIA tabs. Per-role label sets differ:
  - **CLIENT** (`view-models.ts` getClientDashboard tabs): `Все / В работе / На проверке / Завершённые` — **no «Заявки»**.
  - **SPECIALIST** (getSpecialistDashboard tabs): `Все / Заявки / В работе / На проверке / Завершённые`.
- **Role panel** (col 2): CLIENT `<h2>«Создайте новый гиг»</h2>` + a `«Создать гиг +»` link → `/gigs/new` (plus a `+` icon link, `aria-label="Создать гиг"`); SPECIALIST `<h2>«Найти новый гиг»</h2>` + a search `<input>` whose Enter routes to `/gigs?search=…` (or `/gigs`).
- **`«Сообщения»`** panel `<h2>` (`:342`) always renders (rows, or `«Сообщений пока нет.»`).
- **`«Требует внимания»`** (`:360`) renders only when `vm.attention.length > 0`. `page.tsx` sets `attention: []` for **CLIENT** (`:37`) and `attention: d.attention` for **SPECIALIST** (`:49`) — so the strip is specialist-only.
- **Shell page title** `<h1>«ДАШБОРД»</h1>` (`AppShellDesign.pageTitle('/dashboard')`) — the in-screen title is gone; the title lives in the shell header.
- **Compact `GigCard`** (`full=false`, the dashboard feed) is a `<Link href="/gigs/[id]">` with **no** `«К проекту»` footer button (that footer is `full=true`, the browse screen) — but it **does** render a status label (`STATUS_LABEL_RU[vm.status]`, e.g. `«В работе»`), which is why the `«В работе»`/`«На проверке»` **tab** labels collide with an in-progress card's status on the specialist dashboard.

## What Changes

Both specs keep their Prisma-seed + `setE2ESession` harness (already current). Per-test deltas:

### `compose-specialist-dashboard.spec.ts`

| Test | Delta |
|------|-------|
| 1 — renders | `«Здравствуйте»`→`«Добро пожаловать в Gigly!»`; `«Активные задачи»`→`getByRole('heading', {name:'Мои гиги'})`; **drop** `getByRole('tablist')`; assert the 5 tab chips via `getByText(label).first()` (`.first()` because `«В работе»`/`«На проверке»` also appear as the in-progress card's status); `getByRole('button',{name:/Найти проект/})`→`getByRole('heading',{name:'Найти новый гиг'})`; keep `getByText('E2E Spec InProgress Gig').first()`; `«Уведомления»`→`getByRole('heading',{name:'Требует внимания'})`; replace `heading 'Дашборд' .toHaveCount(0)` with `expect(getByRole('heading',{name:'ДАШБОРД'})).toBeVisible()`; add `getByRole('heading',{name:'Сообщения'})`. |
| 2 — open a gig | tabs/`«К проекту»` button are gone → open via the card link: `getByRole('link',{name:/E2E Spec InProgress Gig/}).first().click()` → `/gigs/[inProgressGigId]`. |
| 3 — Заявки tab | click the chip `getByText('Заявки').click()` (unique — no card collision) → assert `getByText('E2E Spec Pending Gig')`. |
| 4 — find-project search | no `«Найти проект»` button → `getByPlaceholder('Поиск по стеку или категории').fill('React')` + `.press('Enter')` → URL `/\/gigs(\?|$)/`. |

### `compose-client-dashboard.spec.ts`

| Test | Delta |
|------|-------|
| 1 — renders | `«Здравствуйте»`→`«Добро пожаловать в Gigly!»`; `«Активные задачи»`→`heading 'Мои гиги'`; **drop** `getByRole('tablist')`; assert the **4** CLIENT tab chips `Все/В работе/На проверке/Завершённые` (**do not assert «Заявки»** — CLIENT has none; the OPEN seed gig is `«Открыт»`, so no card/tab collision); add `heading 'Создайте новый гиг'`; keep `getByRole('link',{name:/Создать гиг/}).first()` + `getByText('E2E Dashboard Gig')`; `«Уведомления».toHaveCount(0)`→`getByRole('heading',{name:'Требует внимания'}).toHaveCount(0)` (CLIENT `attention=[]`); replace `heading 'Дашборд' .toHaveCount(0)` with `expect(heading 'ДАШБОРД').toBeVisible()`; add `heading 'Сообщения'`. |
| 2 — open a gig | `«К проекту»` button gone → `getByRole('link',{name:/E2E Dashboard Gig/}).first().click()` → `/gigs/[gigId]`. |
| 3 — create CTA | keep — `getByRole('link',{name:/Создать гиг/}).first().click()` → `/gigs/new`. |

## Non-Goals / Constraints

- **E2E specs only.** No change to `DashboardDesign.tsx`, `page.tsx`, `GigCard.tsx`, `AppShellDesign.tsx`, `lib/view-models.ts`, or the harness. Unit/integration suite (951/951) must stay green.
- **The shell (`AppShellDesign`) is not rewritten here** — these tests merely observe its `«ДАШБОРД»` title; the shell itself is covered incidentally by every protected-screen change.
- **The browse screen's full `GigCard` (`«К проекту»`/`Фикс. цена` footer) is change #6** (`e2e-browse`); the dashboard uses the compact card, so its footer is out of scope here.
- Keep the seeds as-is (they already produce the right per-role state: specialist in-progress + pending + notification; client OPEN gig).

## Impact

- **Specs (`testing`):** `## ADDED` the reconciled dashboard E2E coverage (both roles) + `## REMOVED` the kit dashboard coverage. Per the plan's convention (changes #1–#3), per-screen E2E coverage is not a canonical `testing` requirement — a no-op against `openspec/specs/`.
- **Code:** 2 files rewritten under `__tests__/e2e/`; zero `app/`/`lib/`/helper changes.
- **Tests:** `npm run test:e2e compose-specialist-dashboard` and `npm run test:e2e compose-client-dashboard` green; suite still collects.
- **Plan:** ticks `e2e-dashboards` → **4/16**.
