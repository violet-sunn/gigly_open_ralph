# Spec delta — ui (reconcile-finances-and-admin)

Re-grounds the admin console dashboard on the prototype by adding the two missing sections — the **«Споры на модерации»**
dispute queue and the **«Журнал модерации»** moderation log — alongside the existing stats + the (kept) paginated
users/gigs pages. Reuses `DisputeList` + `DataTable` + `StatPanel`; the moderation actions + `ModerationLog` are unchanged.
Token-pure (F2) + composition-pure (F5).

## MODIFIED Requirements

### Requirement: Admin Dashboard Shows Stats, Dispute Queue, and Moderation Log
The admin dashboard (`/admin`, ADMIN-only) MUST remain a composition-pure `@composed-screen` and MUST render: the
platform **stats** (`StatPanel`: users / gigs / suspended / closed), a **«Споры на модерации»** queue of OPEN disputes
(via `DisputeList`, with a count; each row linking to `/disputes/[id]` to resolve), a **«Журнал модерации»** of recent
`ModerationLog` entries (via `DataTable`: Действие / Кто / Когда), and the links to the «Пользователи» and «Гиги»
moderation pages. `getAdminDashboard()` MUST return the stats + the OPEN dispute list + the recent log rows. The
paginated `/admin/users` and `/admin/gigs` pages are unchanged. The screen MUST be token-pure (F2) and
composition-pure (F5); all on-screen text Russian.

#### Scenario: The dashboard renders the queue and the log
- GIVEN an ADMIN on `/admin` with OPEN disputes and prior moderation actions
- WHEN it renders
- THEN it MUST show the stats cards, a «Споры на модерации» list of the OPEN disputes (each linking to its dispute), and
  a «Журнал модерации» list of the recent moderation-log entries (action + actor + time)
- AND the «Пользователи» / «Гиги» links MUST remain
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: The dispute queue links to the resolve panel
- GIVEN an OPEN dispute in the queue
- WHEN the admin opens it from the queue
- THEN it MUST navigate to `/disputes/[id]` (where the admin resolves with a verdict — reconcile-disputes-flow)

#### Scenario: getAdminDashboard returns stats + disputes + log
- GIVEN `getAdminDashboard()`
- THEN it MUST return the four stat tiles, the OPEN dispute list, and the recent `ModerationLog` rows (action label +
  actor + time)

**Acceptance Criteria:**
- `/admin` renders stats + «Споры на модерации» (OPEN `DisputeList`, count, → `/disputes/[id]`) + «Журнал модерации» (`DataTable`) + the «Пользователи»/«Гиги» links; F5-pure
- `getAdminDashboard()` returns stats + open disputes + recent log; reuses `DisputeList`/`DataTable`/`StatPanel` (no new blocks)
- moderation actions + `ModerationLog` writes unchanged; the paginated users/gigs pages unchanged
- F2 + F5 lints + `build` + `test:unit` + `compose-admin` E2E green; F1 = structural vs the prototype admin frame (≤1% Phase 4)
