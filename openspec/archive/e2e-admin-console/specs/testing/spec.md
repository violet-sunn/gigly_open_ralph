# testing — e2e-admin-console delta

## MODIFIED Requirements

### Requirement: Admin moderation console E2E coverage

The E2E suite SHALL verify the rebuilt admin moderation console — `AdminConsoleDesign` (`app/admin/AdminConsoleDesign.tsx`, route `/admin`) — over the **unchanged** `getAdminDashboard` view model (`lib/view-models.ts`) and the `suspendUser` / `unsuspendUser` / `closeGig` moderation actions (`app/actions/moderation.ts`) — rather than the partial pre-reground console DOM. The spec MUST cover the consolidated «МОДЕРАЦИЯ» surface's five panels: the **4 stat tiles** («Пользователи» / «Гиги» / «Заблокировано» / «Закрыто»), the **«Споры на модерации»** queue, the **«Пользователи»** block/unblock panel, the **«Гиги»** close panel, and the **«Журнал модерации»** audit log. The spec MUST navigate to a queued dispute via its row **«Рассмотреть»** button (`router.push('/disputes/[id]')`) — NOT by clicking the row title text, which is not clickable in the rebuild. Where the same Russian text appears as both a stat-tile label and a panel heading («Пользователи», «Гиги»), the spec MUST disambiguate panel assertions with `getByRole('heading', …)` to avoid Playwright strict-mode collisions. The spec MUST scope itself to `/admin` only — `/admin/users` and `/admin/gigs` remain the old kit screens covered by the PASS-AS-IS `admin-moderation` / `admin-pagination` specs. App/lib behaviour (`AdminConsoleDesign`, `getAdminDashboard`, the moderation actions) MUST NOT change.

#### Scenario: the console renders the four stat tiles

- **GIVEN** a seeded ADMIN signed in (via `setE2ESession`), with seed data in `file:./test.db`
- **WHEN** the admin visits `/admin`
- **THEN** the four stat-tile labels «Пользователи», «Гиги», «Заблокировано», and «Закрыто» are visible

#### Scenario: the dispute queue lists an open dispute and «Рассмотреть» opens it

- **GIVEN** a seeded OPEN dispute on an IN_PROGRESS gig «CAD Dispute Gig …» (reason «Результат не соответствует ТЗ») with the ADMIN signed in
- **WHEN** the admin visits `/admin`
- **THEN** the «Споры на модерации» card, the gig title row, and the reason «Результат не соответствует ТЗ» are visible
- **WHEN** the admin clicks that row's **«Рассмотреть»** button
- **THEN** the URL matches `/disputes/<disputeId>`

#### Scenario: an admin blocks a user from the «Пользователи» panel

- **GIVEN** a seeded active user listed in the «Пользователи» panel with the ADMIN signed in on `/admin`
- **THEN** the «Пользователи» panel heading and the user's email are visible, and that row shows a **«Заблокировать»** button
- **WHEN** the admin clicks the row's «Заблокировать» submit
- **THEN** `suspendUser` runs and the re-rendered row shows **«Разблокировать»** / the status «Заблокирован»

#### Scenario: an admin closes a gig from the «Гиги» panel

- **GIVEN** a seeded not-yet-closed gig listed in the «Гиги» panel with the ADMIN signed in on `/admin`
- **THEN** the «Гиги» panel heading (via `getByRole('heading')`) and the gig are visible, and the row shows a **«Закрыть»** button
- **WHEN** the admin clicks the row's «Закрыть» submit
- **THEN** `closeGig` runs and the re-rendered row shows the «Закрыт» status (and no «Закрыть» button for that row)

#### Scenario: the moderation log shows audit entries

- **GIVEN** a seeded `CLOSE_GIG` moderation-log entry with the ADMIN signed in
- **WHEN** the admin visits `/admin`
- **THEN** the «Журнал модерации» card and the localized log-row label «Закрыт гиг» are visible
