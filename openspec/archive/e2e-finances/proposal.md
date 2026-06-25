# e2e-finances

## Why

Reconciliation change #10 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The «Финансы» screen at `/finances` was rebuilt on the `gigly_full_design` prototype (`app/(protected)/finances/FinancesDesign.tsx`): three role-aware **stat tiles** over the top, then the **«Операции»** ledger (heading + count badge) of operation rows (avatar + title + «party · date» + amount + status). It is a read-only server component wired to the **unchanged** `getFinances` → `getFinanceStats` + `getLedger` (logical amounts; no real payments). The in-screen title is gone — the shell header supplies «ФИНАНСЫ».

`compose-finances.spec.ts` asserts the old kit DOM and is partially red against the rebuilt component:

- It asserts the framing line **«Суммы логические, без реальных платежей.»** — the rebuilt component renders no such text.
- It asserts a **«Баланс»** footer — `getLedger` still computes `balance`, but `FinancesDesign` does **not** display it (the tiles carry the figures now).
- It asserts the empty state **«Пока нет операций»**, but the rebuilt empty state reads **«Операций пока нет.»**.
- It asserts the sidebar nav active state via the kit class `bg-surface-level-3`, which no longer exists in `AppShellDesign`.

The three CLIENT stat labels it checks (**«Выплачено» / «В резерве» / «Сервисный сбор»**) and the paid-gig ledger row happen to still match, but the spec as a whole fails and under-covers the rebuilt surfaces. This change rewrites it to the rebuilt component against the **stable VM contract** (`getFinanceStats` labels + `getLedger` entries), covering **both** roles' stat labels (the PRD calls out the SPECIALIST set explicitly), the «Операции» heading + count, the ledger row anatomy (title + counterparty·date + amount + status), and the empty state.

## What Changes

- **REWRITE `compose-finances.spec.ts`** against `FinancesDesign.tsx` (no behavioural/app change). Seed a CLIENT «ООО Финанс» + an assigned SPECIALIST «Иван Финанс» with two lifecycle gigs (one `PAID`, one `IN_PROGRESS`), plus an empty CLIENT. Cover:
  - **CLIENT stat tiles:** «Выплачено», «В резерве», «Сервисный сбор» (the `getFinanceStats` CLIENT set).
  - **SPECIALIST stat tiles:** «Заработано», «На проверке», «В работе» (the `getFinanceStats` SPECIALIST set) — viewed as the assigned specialist.
  - **«Операции» ledger:** the heading + the count badge (`ledger.entries.length`), and the operation rows — the gig **title**, the **counterparty subtitle** (CLIENT sees the specialist name; SPECIALIST sees the company name), the role-aware **amount** (CLIENT = `totalAmount`; SPECIALIST = `budget`), and the **status** badge («Оплачено» for `PAID`, «В работе» for `IN_PROGRESS`).
  - **Empty state:** «Операций пока нет.» for a user with no lifecycle gigs.
  - **Remove** the «Суммы логические…», «Баланс», «Пока нет операций», and `bg-surface-level-3` assertions (no in-screen title is asserted — the shell header owns it).
- Reuse the existing harness (`setE2ESession` + direct Prisma seeding into `file:./test.db`).

## Impact

- **Affected:** `__tests__/e2e/compose-finances.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`FinancesDesign.tsx`, `getFinances`/`getFinanceStats`/`getLedger`); the unit/integration suite (951/951 — must stay green); the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 9/16 → 10/16.
