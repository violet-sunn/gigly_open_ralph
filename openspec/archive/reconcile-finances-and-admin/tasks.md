# Tasks — reconcile-finances-and-admin

Re-ground two surfaces on the prototype, both over complete backends: **/finances** (3 role-aware figures + an
operations list across the gig lifecycle) and the **admin dashboard** (add the «Споры на модерации» dispute queue + the
«Журнал модерации» log). Reuse `StatPanel`/`LedgerTable`/`DisputeList`/`DataTable` — no new blocks, no schema change.
Friction: **medium** (data-layer enrichment + render; actions/log/stats untouched).

## 1. Finances — role-aware figures (3 tiles)
- [x] `lib/finances.ts` `getFinanceStats(userId, role)`: return 3 tiles — **company**: «Выплачено» (Σ PAID totalAmount) /
      «В резерве» (Σ IN_PROGRESS+REVIEW totalAmount) / «Сервисный сбор» (Σ PAID serviceFee); **specialist**: «Заработано»
      (Σ PAID budget) / «На проверке» (Σ REVIEW budget) / «В работе» (Σ IN_PROGRESS budget). Reuse the `money()` helper.
- **Test:** `finances-vm.test.ts` — company tiles labelled Выплачено/В резерве/Сервисный сбор with correct sums;
  specialist Заработано/На проверке/В работе.

## 2. Finances — operations across the lifecycle
- [x] `lib/finances.ts` `getLedger(userId, role)`: include gigs with status in {IN_PROGRESS, REVIEW, COMPLETED, PAID}
      for the user (owner/assignee), newest first; each entry = role-aware amount (CLIENT totalAmount / SPECIALIST
      budget), the gig title (label), the counterparty (`subtitle`), the status (mapped to the design `Status`), the
      date. `LedgerTableVM` entries += optional `subtitle`; `LedgerTable.tsx` renders it under the label.
- **Test:** `finances-ledger.test.ts` — a SPECIALIST sees an IN_PROGRESS + a PAID gig (budget amounts, subtitle); a
  CLIENT sees totalAmount amounts; empty state when none.

## 3. Finances screen
- [x] `Finances.tsx`: unchanged composition (`StatPanel` + `LedgerTable` + the «Суммы логические…» Notice) — richer data
      only. Confirm F5-pure.
- **Test:** E2E `compose-finances.spec.ts` — the 3 role tiles render; the operations list shows lifecycle statuses (not
  PAID-only) with amounts + counterparty.

## 4. Admin dashboard data
- [x] `lib/view-models.ts` `getAdminDashboard()`: in addition to the 4 stats, return the **OPEN dispute queue**
      (`getDisputeList({ status: 'OPEN' })`) and the **recent moderation log** — the latest `ModerationLog` entries mapped
      to rows `{ action: <RU label>, actor: admin.email, at: <formatted> }` (action labels: SUSPEND_USER → «Заблокирован
      пользователь», UNSUSPEND_USER → «Разблокирован пользователь», CLOSE_GIG → «Закрыт гиг»).
- **Test:** admin-dashboard VM test — stats + the OPEN disputes (excludes resolved) + the recent log rows (action label +
  actor + time, newest first).

## 5. Admin dashboard screen
- [x] `app/admin/AdminDashboard.tsx`: add a «Споры на модерации» section (`SectionHeader` + count) rendering
      `DisputeList` (the open disputes; rows link to `/disputes/[id]`) and a «Журнал модерации» section rendering
      `DataTable` (columns Действие / Кто / Когда). Keep the stats `StatPanel` + the «Пользователи»/«Гиги» links. Template
      + blocks + data only — no className/style.
- [x] `app/admin/page.tsx`: pass the extended dashboard data.
- **Test:** E2E `compose-admin*.spec.ts` — the dashboard shows «Споры на модерации» (an OPEN dispute, linking to the
  dispute) + «Журнал модерации» (a log row); the stats + Пользователи/Гиги links remain.

## 6. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `Finances.tsx` / `AdminDashboard.tsx` beyond layout-primitive props;
      `LedgerTable` (a block) stays token-pure.
- **Test:** `lint:composition` PASS (Finances + AdminDashboard F5-pure); `lint:tokens` PASS (no new literal).

## 7. Record the decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the 3 role-aware finance figures + lifecycle operations; the admin dispute
      queue + moderation-log render (+ the kept paginated users/gigs pages, the queue→`/disputes/[id]` decision). Check
      the Phase-3 item in `full-design-reground.md`.
- **Test:** the note records the structure + the decisions.

## 8. Tests (add/update)
- [x] `finances-vm.test.ts` / `finances-ledger.test.ts`: the new role figures + lifecycle operations + subtitle.
- [x] `compose-finances.spec.ts`: the 3 tiles + lifecycle operations.
- [x] admin-dashboard VM test (stats + open disputes + recent log).
- [x] `compose-admin*.spec.ts`: the dispute queue + the moderation log render; queue → dispute link.
- **Test:** all pass.

## 9. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS.
- [x] `npm run build` — PASS (`/finances` + `/admin`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. the finances role figures + the admin-dashboard VM).
- [x] `compose-finances` + `compose-admin*` E2E green.
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype finance + admin frames, F3
  flow parity (role figures + operations; admin stats + dispute queue + moderation log + the kept moderation actions),
  F5 composition-pure. F1 ≤1% deferred to Phase 4.

## 10. Planning-status (Phase 3)
- [x] Check `reconcile-finances-and-admin` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.
