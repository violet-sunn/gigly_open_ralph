# Testing Specification Delta

## ADDED Requirements

### Requirement: Dashboard Reconciled E2E Coverage

The E2E suite SHALL verify the rebuilt `/dashboard` (`app/(protected)/dashboard/DashboardDesign.tsx`, both roles) against its current `gigly_full_design` markup — using the Prisma-seed (`file:./test.db`) + `setE2ESession` harness — covering the WELCOME block, the `«Мои гиги»` panel + tab chips, the design `GigCard` feed, the role panel, `«Сообщения»`, and (SPECIALIST) `«Требует внимания»`. The specs SHALL use `getByText`/`getByRole('heading')` for the `<div>` tab chips and section headings (NOT `role="tab"`/`role="tablist"`), SHALL assert the per-role tab sets correctly (CLIENT has no `«Заявки»`), and SHALL NOT reference deleted kit labels (`Активные задачи`, `Найти проект`, `Уведомления`, `Здравствуйте`, the `«К проекту»` button).

#### Scenario: The SPECIALIST dashboard renders its rebuilt blocks

- **Given** an authenticated SPECIALIST with an assigned in-progress gig, a pending application, and a notification
- **When** they open `/dashboard`
- **Then** `«Добро пожаловать в Gigly!»`, `«Мои гиги»`, the 5 tab chips (`Все/Заявки/В работе/На проверке/Завершённые`), `«Найти новый гиг»`, `«Сообщения»`, the seeded gig card, and `«Требует внимания»` SHALL all be visible
- **And** the shell page title `«ДАШБОРД»` SHALL be present (the in-screen title is gone)

#### Scenario: The CLIENT dashboard renders its rebuilt blocks

- **Given** an authenticated CLIENT with one OPEN gig
- **When** they open `/dashboard`
- **Then** `«Добро пожаловать в Gigly!»`, `«Мои гиги»`, the 4 tab chips (`Все/В работе/На проверке/Завершённые`, **no «Заявки»**), `«Создайте новый гиг»`, `«Сообщения»`, and the seeded gig card SHALL be visible
- **And** `«Требует внимания»` SHALL NOT render (CLIENT attention is empty)
- **And** the shell page title `«ДАШБОРД»` SHALL be present

#### Scenario: A dashboard gig card opens the gig detail

- **Given** an authenticated user on `/dashboard` with a seeded gig
- **When** they click the gig card link (the compact card has no `«К проекту»` button)
- **Then** the browser SHALL navigate to `/gigs/[id]`

#### Scenario: Dashboard tab and search interactions

- **Given** an authenticated SPECIALIST on `/dashboard`
- **When** they click the `«Заявки»` tab chip
- **Then** the pending-application gig SHALL be visible
- **And** typing into the `«Найти новый гиг»` search input and pressing Enter SHALL route to `/gigs`

#### Scenario: The CLIENT create CTA routes to gig creation

- **Given** an authenticated CLIENT on `/dashboard`
- **When** they click the `«Создать гиг»` link
- **Then** the browser SHALL navigate to `/gigs/new`

## REMOVED Requirements

### Requirement: Kit Dashboard E2E Coverage

**Reason for removal:** `compose-client-dashboard.spec.ts` and `compose-specialist-dashboard.spec.ts` asserted the **kit** dashboard — the `«Здравствуйте»` greeting, the `«Активные задачи»` panel, ARIA `role="tablist"`/`role="tab"` chips, the specialist `«Найти проект»` button, the `«Уведомления»` strip, a `«К проекту»` button to open a gig, and `getByRole('heading',{name:'Дашборд'}).toHaveCount(0)`. The rebuild (`DashboardDesign.tsx`) renamed every label, made the tabs plain `<div>` chips, replaced the specialist search button with an `<input>`, and moved the page title into the shell (`<h1>«ДАШБОРД»</h1>`), so the old `toHaveCount(0)` now matches the shell title and fails. The coverage is re-expressed against the rebuilt screen under the reconciled requirement above.

The platform previously SHALL have verified the kit dashboard: a `«Здравствуйте»` greeting, an `«Активные задачи»` panel with ARIA `tablist`/`tab` chips, a `«Найти проект»` button, a `«Уведомления»` strip on the specialist (none on the company), a `«К проекту»` button opening the gig, and the absence of any `«Дашборд»` heading.

#### Scenario: Kit dashboard renders the tablist and greeting

- **Given** an authenticated user on the kit `/dashboard`
- **When** the page loads
- **Then** a `«Здравствуйте»` greeting, an `«Активные задачи»` `role="tablist"`, and (specialist) a `«Найти проект»` button render, with no `«Дашборд»` heading

> Removed: the kit greeting/tablist/«Найти проект»/«Уведомления»/«К проекту» labels and the no-page-title assertion are gone; the title now lives in the shell `«ДАШБОРД»` header and the tabs are `<div>` chips. Covered by the reconciled requirement above.
