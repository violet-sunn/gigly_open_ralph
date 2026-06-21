# reconcile-finances-and-admin

**Type:** Regular change (UI + data-layer reconciliation — `/finances` role figures & operations-by-status; the admin
console's dispute queue + moderation log)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (authored fresh from the prototype)
**Capabilities:** `finances` · `ui` (the admin dashboard screen)
**Depends on:** `reconcile-disputes-flow` (archived — the admin resolves a dispute on `/disputes/[id]`, the queue's
target), `admin-role-and-moderation` (archived — the stats + moderation actions + `ModerationLog`), `compose-finances` /
`compose-admin*` (archived — the existing composed screens). The finances lib, the admin VMs, the moderation actions +
`ModerationLog`, and the `DisputeList`/`StatPanel`/`LedgerTable`/`DataTable` blocks already exist.

## Why

Two surfaces are behind the prototype, both over **complete backends** — this is data-layer enrichment + render, not
new infrastructure.

**`/finances`** (`Gigly App.dc.html` ~L1078–1113; `ROUTES.md` L13 «ФИНАНСЫ»; both roles) is already a composed screen
(`StatPanel` + `LedgerTable`, role-aware Оплачено/Заработано), but it shows **2-figure, PAID-only** data. The prototype
shows **3 role-aware summary figures** and an **operations list across the gig lifecycle**:
- **Company:** «Выплачено» (PAID) · «В резерве» (in-progress + on-review, committed-but-unpaid) · «Сервисный сбор» (the
  10% fee).
- **Specialist:** «Заработано» (PAID) · «На проверке» (on-review) · «В работе» (in-progress).
- **Operations** = the user's gigs across **В работе / На проверке / Завершён / Оплачено** (not just PAID), each row:
  counterparty + date + a role-aware **amount** (company = totalAmount, specialist = budget) + a status badge.

**The admin console** (`Gigly App.dc.html` ~L987–1076; the admin `dashboard`/«Модерация») has the stats cards, the
users/gigs moderation pages (with filtering + pagination — an enhancement we keep), and the moderation actions writing
`ModerationLog`. But the dashboard is **missing two prototype sections**:
- **«Споры на модерации»** — a queue of OPEN disputes with «Рассмотреть» → the dispute (where the admin resolves with a
  verdict, from `reconcile-disputes-flow`). Today nothing in the admin console surfaces disputes.
- **«Журнал модерации»** — the recent `ModerationLog` entries (action + actor + time). The log is written + tested but
  **never rendered**.

## What

### `/finances` — role figures + operations-by-status
- **`lib/finances.ts`** — `getFinanceStats(userId, role)` returns the **3 role-aware tiles** (company: Выплачено / В
  резерве / Сервисный сбор; specialist: Заработано / На проверке / В работе), summed from the gig lifecycle (PAID,
  IN_PROGRESS+REVIEW, the 10% fee / per-status budgets). `getLedger(userId, role)` returns the **operations across
  {IN_PROGRESS, REVIEW, COMPLETED, PAID}** (not PAID-only) — role-aware amount (company totalAmount / specialist budget),
  a counterparty **subtitle**, the status, newest first.
- **`LedgerTableVM`** entries gain an optional **`subtitle`** (the counterparty); `LedgerTable` renders it.
- **`Finances.tsx`** keeps its shape (`StatPanel` + `LedgerTable` + the «Суммы логические, без реальных платежей.»
  framing) — richer data, same composition. F5-pure, unchanged structure.

### Admin console — dispute queue + moderation log
- **`getAdminDashboard()`** — extend to also return the **OPEN dispute queue** (`getDisputeList({ status: 'OPEN' })`) and
  the **recent moderation log** (the latest `ModerationLog` entries → rows: action label + actor + time).
- **`AdminDashboard.tsx`** — add a **«Споры на модерации»** section (`DisputeList`, the open disputes, count; each row
  links to `/disputes/[id]` to resolve) and a **«Журнал модерации»** section (`DataTable`: Действие / Кто / Когда). The
  stats cards + the «Пользователи»/«Гиги» links stay; the paginated users/gigs pages are **unchanged**.
- Reuse `DisputeList` + `DataTable` + `StatPanel` — **no new blocks**. The moderation actions + `ModerationLog` writes
  are untouched.

All on-screen text Russian; both screens stay token-pure (F2) + composition-pure (F5).

## Key facts / decisions (derived from the prototype + the existing backends)

- **Backends are complete** — the finances lib, the admin stats + moderation actions + `ModerationLog`, and the dispute
  list/resolve all exist. This change enriches the finances figures/operations and **renders** the admin queue + log.
- **Finances figures are role-aware** (company spends totalAmount incl. the 10% fee; specialist earns budget); the new
  tiles add the per-lifecycle breakdown (В резерве / Сервисный сбор · На проверке / В работе). The «Суммы логические»
  MVP framing stays (logical statuses, no real payments).
- **Operations span the lifecycle** ({IN_PROGRESS, REVIEW, COMPLETED, PAID}) with the generic status badges (В работе /
  На проверке / Завершён / Оплачено) — role-awareness is carried by the **amount** + the summary figures (no bespoke
  per-role status labels — avoids over-engineering).
- **The admin dispute queue links to `/disputes/[id]`** (the admin resolve panel from `reconcile-disputes-flow`) — not a
  new resolve route. **«Журнал модерации»** renders the existing `ModerationLog` (read-only).
- **The paginated `/admin/users` + `/admin/gigs` pages are kept** (an enhancement over the prototype's single-screen,
  5-item lists) — the dashboard gains the two missing sections rather than collapsing those pages (don't-regress).
- **No new blocks** (DisputeList / DataTable / StatPanel suffice); **no schema change** (finances reads gig
  status/budget/serviceFee/totalAmount; the log reads `ModerationLog`).
- **F1 baselines on the prototype frames** (`Gigly Развёртка.dc.html` finance + admin); fonts resolved. F1 =
  structural/overlay match; the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **Finances data:** `lib/finances.ts` (`getFinanceStats` 3 role tiles; `getLedger` 4-status operations + subtitle);
  `LedgerTableVM` += `subtitle` (`app/components/blocks/view-models.ts`); `LedgerTable.tsx` renders the subtitle.
- **Admin data + screen:** `lib/view-models.ts` `getAdminDashboard` (+ open disputes + recent log);
  `app/admin/AdminDashboard.tsx` (+ the «Споры на модерации» + «Журнал модерации» sections); `app/admin/page.tsx`
  passes the extended data.
- **Tests:** `finances-vm.test.ts` / `finances-ledger.test.ts` (the new role figures — company В резерве/Сервисный сбор,
  specialist На проверке/В работе — + operations include non-PAID statuses); `compose-finances.spec.ts` (the 3 tiles +
  the lifecycle operations); a new admin-dashboard VM test (stats + open disputes + recent log); `compose-admin*`
  E2E (the dispute queue renders + links to a dispute; the log renders).
- **Docs:** the note in `docs/DESIGN_SYSTEM_SPEC.md`; check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- Real payments / a payment gateway (the «Суммы логические» MVP boundary stays).
- Collapsing the paginated `/admin/users` + `/admin/gigs` pages into the dashboard (kept as-is).
- A new admin dispute-resolve route (the queue links to the existing `/disputes/[id]` resolve panel).
- New blocks or schema changes (reuse `DisputeList`/`DataTable`/`StatPanel`; read existing fields).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/Gigly App.dc.html` (finances ~L1078–1113 + data L1835–1865 — the 3 role tiles + the 4-status
operations; admin ~L987–1076 — stats L991–997, dispute queue «Споры на модерации» L1003–1023, users L1025–1040, gigs
L1042–1059, «Журнал модерации» L1063–1073); `ROUTES.md` L9/L13. The current `lib/finances.ts` (`getLedger`/
`getFinanceStats` + `money`); `Finances.tsx`; `lib/view-models.ts` `getFinances` + `getAdminDashboard` (L1160–1251);
`AdminDashboard.tsx`; `app/actions/moderation.ts` + `ModerationLog` (`prisma/schema.prisma` L169–186); `lib/disputes.ts`
`getDisputeList`; the `StatPanel`/`LedgerTable`/`DisputeList`/`DataTable` blocks + their VMs.
