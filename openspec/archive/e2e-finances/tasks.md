# Tasks — e2e-finances

> **Status: COMPLETE.** Baseline confirmed the 3 old tests failed (framing/«Баланс», «Пока нет операций», `bg-surface-level-3`). Rewrote `compose-finances.spec.ts` into 3 tests: CLIENT stat tiles + «Операции» ledger rows (titles/statuses/«Иван Финанс» subtitle), SPECIALIST stat tiles + role-aware budget amount + «ООО Финанс» subtitle, and the «Операций пока нет.» empty state. Two mid-flight fixes: the «Операции» count badge collided with the sidebar «Мои гиги 2» → scoped via `h2:text-is("Операции") + span`; and «100 000 ₽» appears twice (tile + row) → `.first()`. `npm run clean:test-db && npm run test:e2e compose-finances` → **3 passed**. No `app/`/`lib/` changes. Plan bumped 9/16 → 10/16.

> Run targeted: `npm run test:e2e compose-finances` (server boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). If integration pollution is suspected, `npm run clean:test-db` first. Iterate with `-g "<title>"`.
>
> **Root cause this change fixes:** `compose-finances` asserts the kit framing «Суммы логические…», a «Баланс» footer, the empty text «Пока нет операций», and the nav class `bg-surface-level-3` — none render in the rebuilt `FinancesDesign`. The rebuilt screen shows role-aware stat tiles + the «Операции» ledger + «Операций пока нет.» empty.

## Reference — the real contract (`FinancesDesign.tsx` + `lib/finances`)

- **No in-screen title** (the shell header owns «ФИНАНСЫ»). Layout = stat tiles row, then the «Операции» block.
- **Stat tiles** = `stats.stats[]`, each `{ label, value }`. Role-aware (`getFinanceStats`):
  - **CLIENT:** «Выплачено» (PAID `totalAmount`) · «В резерве» (IN_PROGRESS + REVIEW `totalAmount`) · «Сервисный сбор» (PAID `serviceFee`).
  - **SPECIALIST:** «Заработано» (PAID `budget`) · «На проверке» (REVIEW `budget`) · «В работе» (IN_PROGRESS `budget`).
- **«Операции»** = `<h2>Операции</h2>` + a count badge = `ledger.entries.length`.
- **Ledger rows** (`getLedger`, gigs with status in `IN_PROGRESS|REVIEW|COMPLETED|PAID`, newest first):
  - `label` = gig **title**; `subtitle` = counterparty (CLIENT → specialist `displayName`/email; SPECIALIST → company `companyName`/email); rendered as `{subtitle} · {date ru-RU}`.
  - `amount` = `money(role-aware)` — CLIENT = `totalAmount`, SPECIALIST = `budget` — formatted `"<ru-RU number> ₽"` (e.g. «110 000 ₽», «100 000 ₽»).
  - `status` tone + `statusLabel`: **PAID → «Оплачено»**; IN_PROGRESS → «В работе»; REVIEW → «На проверке»; COMPLETED → «Завершён» (via `STATUS_LABEL_RU`).
- **Empty ledger:** «Операций пока нет.».
- **Amounts are kopecks/100:** seed `budget: 10000000` → «100 000 ₽»; `totalAmount: 11000000` → «110 000 ₽».

## 1. [x] Baseline + capture the mismatches

- Run `npm run test:e2e compose-finances` and record the failures (expect «Суммы логические…», «Баланс», «Пока нет операций», and the `bg-surface-level-3` assertions to fail; the three CLIENT stat labels + the paid-gig title may pass).
- **Test plan:** baseline run → note exact failing assertions to replace in tasks 2–4.

## 2. [x] Rewrite the seed + the CLIENT stat/ledger test

- Seed into `file:./test.db`: a CLIENT «ООО Финанс» (`payer`), an assigned SPECIALIST «Иван Финанс» (`displayName`), and **two** lifecycle gigs both `assignedSpecialistId = spec`:
  - Gig A `PAID` — `budget: 10000000`, `serviceFee: 1000000`, `totalAmount: 11000000`, `paidAt` fixed (e.g. `2026-04-01`), title «E2E Finances Paid Gig».
  - Gig B `IN_PROGRESS` — `budget: 5000000`, `totalAmount: 5500000`, title «E2E Finances Active Gig».
  - Plus an empty CLIENT «ООО Пусто» (no gigs).
- **CLIENT test** (`setE2ESession` CLIENT payer, `goto /finances`): assert the stat labels «Выплачено», «В резерве», «Сервисный сбор»; the «Операции» heading (`getByRole('heading', { name: 'Операции' })`) + the count badge `getByText('2', { exact: true })`; both gig titles; the statuses «Оплачено» and «В работе» (use `.first()` if «В работе» collides with anything); and the specialist subtitle «Иван Финанс».
- **Test plan:** `npm run test:e2e compose-finances -g "CLIENT"` → green.

## 3. [x] Add the SPECIALIST stat/ledger test

- **SPECIALIST test** (`setE2ESession` as «Иван Финанс», `goto /finances`): assert the stat labels «Заработано», «На проверке», «В работе» (`.first()` for «В работе» since it is also Gig B's status badge); the «Операции» heading + count `2`; the company counterparty «ООО Финанс» as a row subtitle; and the role-aware budget amount «100 000 ₽» (Gig A, SPECIALIST = budget).
- **Test plan:** `npm run test:e2e compose-finances -g "SPECIALIST"` → green.

## 4. [x] Rewrite the empty-state test

- **Empty test** (`setE2ESession` as the empty CLIENT, `goto /finances`): assert `getByText('Операций пока нет.')` is visible. REMOVE the «Пока нет операций» and `bg-surface-level-3` assertions.
- **Test plan:** `npm run test:e2e compose-finances -g "empty"` → green.

## 5. [x] Full green + plan update

- Run the whole file: `npm run test:e2e compose-finances` → 0 failures.
- Grep the spec to confirm no «Суммы логические», no «Баланс», no «Пока нет операций», and no `bg-surface-level-3` remain; confirm the stat labels + «Операции» + «Операций пока нет.» are present.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `e2e-finances` in `openspec/planning/e2e-reconciliation.md` and bump progress 9/16 → 10/16.
- **Acceptance:** `npm run test:e2e compose-finances` reports 0 failures.

