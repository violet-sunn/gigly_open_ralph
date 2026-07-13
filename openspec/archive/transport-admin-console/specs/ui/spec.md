# UI — Admin Moderation Surface (transport-admin-console)

Spec deltas for reconciling the admin console to `design-reference/screens/dashboard.admin`, transporting the `confirm.destructive` dialog, and re-skinning the `/admin/users` + `/admin/gigs` tables. All requirements preserve the `page.tsx → VM → component` wiring and the `app/actions/moderation.ts` actions.

## ADDED Requirements

### Requirement: Admin console reconciled to the captured reference

`app/admin/AdminConsoleDesign.tsx` SHALL be a faithful transport of `design-reference/screens/dashboard.admin.html`: 4 stat tiles each with its verbatim caption line, the «Споры на модерации» queue, the «Журнал модерации» log, the «Пользователи» list, and the «Гиги» list — all bound to `getAdminDashboard`. Static UI copy SHALL be verbatim; only dynamic data SHALL be bound.

#### Scenario: The four stat tiles render with captions

- **WHEN** an ADMIN opens `/admin`
- **THEN** four tiles render — «Пользователи» / «Гиги» / «Заблокировано» / «Закрыто гигов» — each showing its `stats[].value` and its verbatim caption line («на платформе» / «всего опубликовано» / «пользователей» / «модерацией»)

#### Scenario: Queue, log, users and gigs sections render

- **WHEN** the console renders
- **THEN** the «Споры на модерации» queue lists OPEN disputes (reason · amount · status pill) each with a «Рассмотреть» control linking to `/disputes/[id]`
- **AND** the «Журнал модерации» panel lists recent moderation-log entries (newest first)
- **AND** the «Пользователи» list shows the top users (avatar · name · role·email · status) and the «Гиги» list shows the top gigs (avatar · title · client · status pill)

### Requirement: Destructive moderation actions are gated by the captured confirm dialog

Block / unblock / close controls SHALL open a transported `confirm.destructive` dialog before the action fires. The dialog SHALL be a centred modal over a dimmed surface with a title, an explanatory body naming the target, a secondary «Отмена», and a red confirm button; the moderation action SHALL execute only when the user confirms.

#### Scenario: Blocking a user requires confirmation

- **WHEN** an ADMIN clicks «Заблокировать» on a user
- **THEN** a dialog titled «Заблокировать пользователя?» appears with the body «"{name}" не сможет войти на платформу. Действие обратимо.» and buttons «Отмена» + a red «Заблокировать»
- **AND** `suspendUser` fires only on confirm; «Отмена» closes the dialog with no change

#### Scenario: Closing a gig requires confirmation

- **WHEN** an ADMIN clicks «Закрыть» on a gig
- **THEN** a destructive-confirm dialog appears and `closeGig` fires only on confirm

### Requirement: Admin users and gigs tables re-skinned to the transport vocabulary

`app/admin/users/AdminUsers.tsx` and `app/admin/gigs/AdminGigs.tsx` SHALL replace their kit `DataTable`/`Section`/`Stack`/primitives markup with the console's transported row vocabulary + `tokens.css`, while preserving offset pagination (30 per page) and the role/status filter controls. The `/* @composed-screen */` kit contract SHALL be removed. As the prototype has no dedicated reference screen for these tables, the visual target for their rows is the console's «Пользователи»/«Гиги» rows.

#### Scenario: Users table is transported and still paginates/filters

- **WHEN** an ADMIN opens `/admin/users`
- **THEN** users render in the transported row style (avatar · name · role·email · status · block/unblock button) with the destructive-confirm gate
- **AND** the role/status filters and the page navigation continue to work (URL-based), and `suspendUser`/`unsuspendUser` are wired

#### Scenario: Gigs table is transported and still paginates/filters

- **WHEN** an ADMIN opens `/admin/gigs`
- **THEN** gigs render in the transported row style (avatar · title · client · status pill · «Закрыть») with the destructive-confirm gate
- **AND** the status filter and page navigation continue to work, and `closeGig` is wired

### Requirement: Admin moderation behavior and the suite stay unchanged/green

The transport SHALL NOT change `suspendUser`, `unsuspendUser`, `closeGig`, the `ModerationLog`, `User.suspended`, or `Gig.closedByAdmin`. The existing admin E2E SHALL pass, with selectors updated only where transported markup changed.

#### Scenario: Build and existing admin E2E pass

- **WHEN** `npm run build` runs and the `compose-admin-dashboard` / `admin-moderation` / `admin-pagination` specs run
- **THEN** the build succeeds and those specs pass (moderation actions, user block/unblock, gig close, pagination/filtering)

## ADDED Requirements (follow-ups — admin navigation, routing & dedicated disputes screen)

> These shipped after the initial transport, addressing user-reported gaps in how an admin reaches and moves through the moderation surface.

### Requirement: Admins are routed to their moderation home

An ADMIN SHALL land on `/admin` (the moderation console), not the CLIENT/SPECIALIST `/dashboard`. Login SHALL redirect ADMINs to `/admin`; middleware SHALL redirect an authenticated ADMIN hitting `/dashboard` (and the already-logged-in `/login` bounce) to `/admin`.

#### Scenario: Admin login lands on the console

- **WHEN** an ADMIN logs in (or, already authenticated, visits `/dashboard` or `/login`)
- **THEN** they SHALL be routed to `/admin` and see the admin shell (admin nav + «Админ» indicator), never the «Компания» shell

### Requirement: Admin shell on every admin-reachable route; exclusive nav active-state

The admin shell SHALL render for an ADMIN on `(protected)` routes they can reach (e.g. a dispute detail `/disputes/[id]`), not the CLIENT shell. Exactly one sidebar item SHALL be active at a time (longest-path match), so a parent route (`/admin`) is not highlighted on its children (`/admin/users`, `/admin/gigs`, `/admin/disputes`).

#### Scenario: Admin opens a dispute detail

- **WHEN** an ADMIN opens `/disputes/[id]`
- **THEN** the admin shell renders (admin nav «Модерация»/«Споры»/«Пользователи»/«Гиги» present; the CLIENT-only «Финансы» absent)

#### Scenario: One active nav item

- **WHEN** the admin is on `/admin/users` (or `/admin/gigs`, `/admin/disputes`)
- **THEN** only that item is active — «Модерация» (`/admin`) is NOT also active

### Requirement: Dedicated admin disputes screen with status filter

`/admin/disputes` (`AdminDisputes`) SHALL list ALL disputes (open + resolved + rejected) for an ADMIN, in the console's row vocabulary, with a status filter (Все / Открытые / Разрешённые / Отклонённые) over the raw dispute status. Each row SHALL open `/disputes/[id]`, passing a `from` entry-point param so the dispute's «Назад» returns to the list (and the console's «Рассмотреть» returns to `/admin`). A «Споры» admin nav item (disputes icon) SHALL reach it.

#### Scenario: Lists every status and filters

- **WHEN** an ADMIN opens `/admin/disputes`
- **THEN** open, resolved, and rejected disputes all render; selecting «Разрешённые» narrows the list to RESOLVED

#### Scenario: Back returns to the entry point

- **WHEN** the admin opens a dispute from `/admin/disputes` and clicks «Назад к спорам»
- **THEN** they return to `/admin/disputes` (not `/admin`)

### Requirement: Disputes read «Решён», not the gig «Завершён»

A resolved dispute SHALL display the label «Решён» (via `disputeLabel`), distinct from the gig status «Завершён», across every dispute surface (admin list, console queue, participant list, detail).

#### Scenario: Resolved dispute label

- **WHEN** a RESOLVED dispute renders its status pill
- **THEN** it reads «Решён»
