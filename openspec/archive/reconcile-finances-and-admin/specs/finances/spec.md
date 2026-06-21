# Spec delta — finances (reconcile-finances-and-admin)

Re-grounds `/finances` on the prototype: **3 role-aware summary figures** + an **operations list across the gig
lifecycle** (not PAID-only). The screen stays a composed `StatPanel` + `LedgerTable` over the finances lib (role-aware
amounts; logical-amounts framing). Token-pure (F2) + composition-pure (F5).

## MODIFIED Requirements

### Requirement: Finances Summary Is Role-Aware With Three Figures
`getFinanceStats(userId, role)` MUST return three role-aware summary tiles, summed from the gig lifecycle (logical
amounts, no real payments):
- **Company (CLIENT):** «Выплачено» (Σ PAID totalAmount) · «В резерве» (Σ IN_PROGRESS + REVIEW totalAmount) · «Сервисный
  сбор» (Σ the 10% fee).
- **Specialist:** «Заработано» (Σ PAID budget) · «На проверке» (Σ REVIEW budget) · «В работе» (Σ IN_PROGRESS budget).
The `/finances` screen MUST render them via `StatPanel`, keeping the «Суммы логические, без реальных платежей.» framing.

#### Scenario: Role figures
- GIVEN a CLIENT with PAID, in-progress, and on-review gigs
- THEN `getFinanceStats` MUST return «Выплачено» (the PAID totalAmount sum), «В резерве» (the in-progress + on-review
  totalAmount sum), and «Сервисный сбор» (the 10% fee sum)
- AND for a SPECIALIST it MUST return «Заработано» (PAID budget), «На проверке» (on-review budget), and «В работе»
  (in-progress budget)

### Requirement: Operations List Spans the Gig Lifecycle
`getLedger(userId, role)` MUST return the user's gigs across **IN_PROGRESS / REVIEW / COMPLETED / PAID** (not PAID-only),
newest first, each as a ledger entry with: the gig title, a **counterparty subtitle**, a **role-aware amount** (company =
totalAmount, specialist = budget), the status, and the date. `LedgerTableVM` entries MUST carry an optional `subtitle`,
and `LedgerTable` MUST render it. The screen MUST show its empty state when there are no such gigs.

#### Scenario: Operations include non-paid lifecycle statuses
- GIVEN a SPECIALIST assigned to an IN_PROGRESS gig and a PAID gig
- WHEN `/finances` renders
- THEN the operations list MUST include both (status badges В работе and Оплачено), each with the specialist's budget
  amount and the counterparty subtitle
- AND a CLIENT MUST see the totalAmount amounts for their own gigs across the same statuses

#### Scenario: Composition-pure
- GIVEN the `/finances` screen
- THEN it MUST compose `StatPanel` + `LedgerTable` (+ the framing Notice) with no `className=`/`style=`/hex literals (F5)

**Acceptance Criteria:**
- `getFinanceStats` → 3 role-aware tiles (company Выплачено/В резерве/Сервисный сбор; specialist Заработано/На проверке/В работе)
- `getLedger` → operations across IN_PROGRESS/REVIEW/COMPLETED/PAID, role-aware amounts, counterparty subtitle, newest first
- `LedgerTableVM` += `subtitle`; `LedgerTable` renders it; the «Суммы логические…» framing kept
- F2 + F5 lints + `build` + `test:unit` (role figures) + `compose-finances` E2E green; F1 = structural (≤1% Phase 4)
