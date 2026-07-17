# Finances Specification

This domain provides a **logical, read-only** finances layer (`lib/finances.ts`) that *derives* a balance + ledger +
stats from existing gig data (`budget` / `serviceFee` / `totalAmount` / `status` / `paidAt`) per role, fulfilling the
`StatPanel` / `LedgerTable` view-model contracts (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `StatPanelVM`, `LedgerTableVM`). It
is a logical view only — **no payment gateway, no money movement, no DB writes** — per the MVP boundary (`project.md`
"Escrow / Payments (MVP)"). Real payment-gateway / escrow integration is a post-MVP change behind the same shapes.

## Requirements

### Requirement: LedgerTableVM Contract Materialized
The `LedgerTableVM` view-model MUST be present in `app/components/blocks/view-models.ts`, transcribed verbatim from
`DESIGN_SYSTEM_SPEC.md` §5, so the finances helper can be contract-typed.

#### Scenario: LedgerTableVM exists in the code SSOT
- GIVEN `app/components/blocks/view-models.ts`
- WHEN it is inspected
- THEN it MUST export `LedgerTableVM { entries: { date: DateISO; label: string; amount: Money; status: Status }[];
  balance: Money }` (matching §5), reusing the existing `DateISO`/`Money`/`Status` aliases
- AND the addition MUST be **type-only** (no component, no runtime); `StatPanelVM` already exists and is unchanged

**Acceptance Criteria:**
- `LedgerTableVM` present in `view-models.ts`, verbatim from §5; type-only; `StatPanelVM` reused unchanged

### Requirement: Read-Only Finances Derivation
`lib/finances.ts` MUST provide `getLedger(userId, role)` returning `LedgerTableVM` and `getFinanceStats(userId, role)`
returning `StatPanelVM`, derived read-only from `Gig` — no mutation, no new table, no action, no payment gateway.

#### Scenario: getLedger derives the realized ledger from PAID gigs
- GIVEN gigs belonging to a user (CLIENT → `clientId`, SPECIALIST → `assignedSpecialistId`)
- WHEN `getLedger(userId, role)` is called
- THEN `entries` MUST be the user's **PAID** gigs (newest first by `paidAt`), each `{ date: paidAt (DateISO), label:
  gig.title, amount, status: 'completed' }`, and `balance` MUST be the formatted sum of those amounts
- AND `amount` MUST be `totalAmount` for a CLIENT (what they pay) and `budget` for a SPECIALIST (what they receive)

#### Scenario: getFinanceStats reflects paid and pending per role
- GIVEN a user's gigs
- WHEN `getFinanceStats(userId, role)` is called
- THEN it MUST return a `StatPanelVM` whose tiles reflect **realized** amounts (from `PAID` gigs) and **pending**
  amounts (from `COMPLETED`-but-unpaid gigs) plus a count — per role (CLIENT amounts from `totalAmount`, SPECIALIST
  from `budget`)

#### Scenario: The layer is read-only
- GIVEN `lib/finances.ts`
- WHEN `getLedger` / `getFinanceStats` run
- THEN they MUST only read (`findMany`/`aggregate`/`count`) — no `create`/`update`/`delete`, no new table, no action,
  no payment-gateway call; calling them MUST NOT modify any gig

**Acceptance Criteria:**
- `getLedger` ⇒ `LedgerTableVM` (PAID entries + summed balance), `getFinanceStats` ⇒ `StatPanelVM` (paid + pending)
- Per-role amounts (CLIENT `totalAmount` / SPECIALIST `budget`); read-only; no schema/action/gateway

### Requirement: Reflects Payment Statuses
The derived finances MUST reflect the gigs' payment statuses — realized (`PAID`) vs pending (`COMPLETED`-unpaid).

#### Scenario: A COMPLETED-but-unpaid gig is pending, not realized
- GIVEN a `COMPLETED` gig (not yet `PAID`) belonging to the user
- WHEN `getLedger` and `getFinanceStats` are called
- THEN the gig MUST NOT appear in the realized `entries`/`balance`, and its amount MUST be reflected as **pending** in
  the stats

#### Scenario: Marking a gig PAID moves its amount into the ledger
- GIVEN a `COMPLETED` gig that is then transitioned to `PAID` (with `paidAt`)
- WHEN `getLedger` is called again
- THEN the gig MUST now appear in `entries` and its amount MUST be included in `balance`

#### Scenario: Empty finances are graceful
- GIVEN a user with no PAID gigs
- WHEN `getLedger` is called
- THEN `entries` MUST be `[]` and `balance` MUST be a zero amount (e.g. "0 ₽")

**Acceptance Criteria:**
- `PAID` → realized (entries + balance); `COMPLETED`-unpaid → pending (stats); `COMPLETED → PAID` moves the amount in
- Empty case: `entries = []`, zero balance

### Requirement: Post-MVP Boundary Documented
`lib/finances.ts` MUST document that it is a **logical view only** (no payment gateway, no money movement), per the
MVP boundary.

#### Scenario: The logical/no-gateway boundary is documented
- GIVEN `lib/finances.ts`
- WHEN its header is read
- THEN it MUST state that the finances are a **logical** derivation over gig statuses (no payment gateway, no real
  money movement, no DB writes), referencing `project.md` "Escrow / Payments (MVP)", and that real payment-gateway/
  escrow integration is a post-MVP change behind the same `LedgerTableVM`/`StatPanelVM` shapes

#### Scenario: The screen tells the user the payment is a manual mark, not a transfer
- GIVEN the «Финансы» screen renders
- THEN it MUST show a note that the figures reflect gig statuses and that «Оплата» is the client's manual mark, not a
  real transfer through the platform — so «Выплачено» appearing before any real money movement is not misread (the
  tester asked whether this was intended; it is)

**Acceptance Criteria:**
- `lib/finances.ts` documents the logical/no-gateway/post-MVP boundary, referencing `project.md`
- The finances screen surfaces a plain-language disclaimer that payment is a manual mark, not a real transfer

### Requirement: Additive Verification
The change MUST be additive and read-only, with the suite green and no schema/seed/action/UI changes.

#### Scenario: Additive — suite green, no schema/UI change
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with no schema/seed/action change and no UI component/screen change (the only non-test source
  edit is the type-only `LedgerTableVM` transcription), and `npm run lint:tokens` + `npm run lint:composition` MUST
  stay green

**Acceptance Criteria:**
- No schema/seed/action/`resetTestDatabase` change; `LedgerTableVM` is the only (type-only) `view-models.ts` edit
- `npm run build` + `npm run test:unit` + lints green

## Reconciled Requirements (reconcile-finances-and-admin, 2026-06-21)

### Requirement: Finances Summary Is Role-Aware With Three Figures
`getFinanceStats(userId, role)` MUST return three role-aware summary tiles, summed from the gig lifecycle (logical
amounts, no real payments): **CLIENT** → «Выплачено» (Σ PAID totalAmount) / «В резерве» (Σ IN_PROGRESS + REVIEW
totalAmount) / «Сервисный сбор» (Σ PAID serviceFee); **SPECIALIST** → «Заработано» (Σ PAID budget) / «На проверке»
(Σ REVIEW budget) / «В работе» (Σ IN_PROGRESS budget). The `/finances` screen MUST render them via `StatPanel`, keeping
the «Суммы логические, без реальных платежей.» framing.

#### Scenario: Role figures
- GIVEN a CLIENT with PAID, in-progress, and on-review gigs
- THEN `getFinanceStats` MUST return «Выплачено» (PAID totalAmount), «В резерве» (in-progress + on-review totalAmount),
  and «Сервисный сбор» (PAID fee)
- AND for a SPECIALIST it MUST return «Заработано» (PAID budget), «На проверке» (REVIEW budget), and «В работе»
  (IN_PROGRESS budget)

### Requirement: Operations List Spans the Gig Lifecycle
`getLedger(userId, role)` MUST return the user's gigs across **IN_PROGRESS / REVIEW / COMPLETED / PAID** (not PAID-only),
newest first, each as a ledger entry with: the gig title, a counterparty `subtitle`, a role-aware amount (CLIENT =
totalAmount, SPECIALIST = budget), the status, and the date; the «Баланс» footer remains the realized (PAID) total.
`LedgerTableVM` entries MUST carry optional `subtitle` + `statusLabel` (the latter renders «Оплачено» for PAID, which has
no design `Status`), and `LedgerTable` MUST render them. The empty state MUST show when there are no such gigs.

#### Scenario: Operations include non-paid lifecycle statuses
- GIVEN a SPECIALIST assigned to an IN_PROGRESS gig and a PAID gig
- WHEN `/finances` renders
- THEN the operations list MUST include both (badges В работе and Оплачено), each with the specialist's budget amount and
  the counterparty subtitle; a CLIENT MUST see the totalAmount amounts across the same statuses
- AND the «Баланс» footer MUST equal the realized (PAID) total

**Acceptance Criteria:**
- `getFinanceStats` → 3 role-aware tiles; `getLedger` → lifecycle operations (subtitle + `statusLabel`); balance = PAID total; framing kept
- F2 + F5 lints + `build` + `test:unit` (role figures) + `compose-finances` E2E green; F1 = structural (≤1% Phase 4)
- Reconciliation decisions recorded (§10.20 / RC-S37)
