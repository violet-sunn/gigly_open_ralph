# Change Proposal: finances-ledger

> Phase 1, change 15 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> fulfills the `StatPanel` / `LedgerTable` view-model contracts (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `StatPanelVM`,
> `LedgerTableVM`) with a **logical, read-only** finances layer (`lib/finances.ts`) that *derives* a balance + ledger
> from existing gig data (`budget` / `serviceFee` / `totalAmount` / `status` / `paidAt`) per role — **no schema, no
> payment gateway, no money movement**. Additive; **no UI wiring** (Phase 2 binds the Финансы screen).

## Problem Statement

`StatPanelVM { stats }` and `LedgerTableVM { entries: { date, label, amount, status }[]; balance }` describe the
Финансы (`/finances`) screen — a balance + a transaction history. Today there is **no finances data layer at all**:

- Money already exists in the schema — `Gig.budget` (what the specialist receives), `Gig.serviceFee` (the 10% the
  platform earns), `Gig.totalAmount` (what the client pays), and the logical `PAID` status with `paidAt` — but
  nothing **derives a ledger** (entries + balance) from it for a given user/role.
- `LedgerTableVM` is declared in `DESIGN_SYSTEM_SPEC.md` §5 but is **not yet present in
  `app/components/blocks/view-models.ts`** (which currently ends at `BannerCardVM`), so there is no typed contract in
  code for a finances helper to fulfil.
- Phase-2's Финансы screen (`compose-finances`: AppShell + StatPanel + LedgerTable) has **nothing real to bind** — the
  blocks would stay mocked.

The MVP is explicitly **not a payment processor** (`project.md` → "Escrow / Payments (MVP)": "'Payment' is a logical
status (`PAID`), not an actual financial transfer"). So this change is a **logical, read-only view** over the existing
data — exactly what the planning doc's Phase-1 worklist maps: "logical ledger/view over budget/fee/PAID" fulfilling
`StatPanel` / `LedgerTable`. It is additive and decoupled from the UI (the blocks already type/render the shapes).

## Proposed Solution

Materialize the missing `LedgerTableVM` contract in code, add a read-only `lib/finances.ts` that derives the
balance + ledger + stats per role from existing gigs, document the post-MVP boundary, and verify. Four deliverable
groups:

1. **Materialize `LedgerTableVM` in the code SSOT** — transcribe the §5 definition (`{ entries: { date: DateISO;
   label: string; amount: Money; status: Status }[]; balance: Money }`) verbatim into
   `app/components/blocks/view-models.ts` (it already holds `StatPanelVM` and the `DateISO`/`Money`/`Status` aliases).
   **Type-only** — no UI component, no runtime; brings the code SSOT in line with the spec SSOT so the helper can be
   contract-typed.

2. **`lib/finances.ts` — read-only derivation (fulfils both contracts)** — server-only helpers:
   - `getLedger(userId, role)` → `LedgerTableVM`: `entries` = the user's **PAID** gigs (the realized logical
     transactions), newest first — `{ date: paidAt, label: gig.title, amount, status: 'completed' }` where `amount` =
     `totalAmount` for a CLIENT (what they paid) or `budget` for a SPECIALIST (what they received); `balance` = the
     formatted sum of those amounts.
   - `getFinanceStats(userId, role)` → `StatPanelVM`: stat tiles that **reflect payment statuses** — paid (realized,
     from `PAID` gigs) vs pending (owed, from `COMPLETED`-but-unpaid gigs) + a count.
   No mutations, no new tables, no actions — pure queries over `Gig`. `LedgerTableVM`/`StatPanelVM` imported `import
   type` (no runtime UI coupling), mirroring `lib/reviews.ts` / `lib/terms.ts`.

3. **Document the post-MVP boundary** — a prominent header comment in `lib/finances.ts` stating this is a **logical
   view only** (no payment gateway, no money movement, no DB writes; amounts are derived from gig statuses), pointing
   to `project.md` "Escrow / Payments (MVP)" and noting that real payment-gateway/escrow integration is a post-MVP
   change behind the same shapes.

4. **Tests** — `__tests__/integration/finances-ledger.test.ts` covers the per-role derivation, that the ledger
   reflects payment statuses (a `COMPLETED` gig is pending, not in the realized balance; flipping it to `PAID` moves
   it into the ledger + balance), the empty case, that the helpers are read-only (no mutation), and the contract
   match (`getLedger` ⇒ `LedgerTableVM`, `getFinanceStats` ⇒ `StatPanelVM`).

This change emits **a `LedgerTableVM` type transcription + a read-only `lib/finances.ts` + boundary docs + tests
only**. It does **not** add any schema/model/migration, any server action or mutation, any payment-gateway
integration, any seed change (existing `PAID`/`COMPLETED` gigs supply the data), or wire the Финансы screen (Phase 2
`compose-finances`). The blocks already render the shapes — this change makes the data real, logically.

## Constraints

### MUST Requirements
- `LedgerTableVM` MUST be added to `app/components/blocks/view-models.ts`, transcribed **verbatim** from
  `DESIGN_SYSTEM_SPEC.md` §5 (`{ entries: { date, label, amount, status }[]; balance }`) — type-only (no component).
- `lib/finances.ts` MUST provide `getLedger(userId, role)` returning `LedgerTableVM` and `getFinanceStats(userId,
  role)` returning `StatPanelVM`, **derived read-only** from `Gig` (`budget`/`serviceFee`/`totalAmount`/`status`/
  `paidAt`) — **no mutation, no new table, no action, no payment gateway**.
- The ledger MUST be **per role**: a CLIENT's amounts derive from `totalAmount` (what they pay), a SPECIALIST's from
  `budget` (what they receive); `getLedger` MUST scope to the user (CLIENT → `clientId`, SPECIALIST →
  `assignedSpecialistId`).
- The result MUST **reflect payment statuses**: realized entries/balance derive from `PAID` gigs; pending amounts
  derive from `COMPLETED`-but-unpaid gigs; the contracts MUST be matched (`import type` from the view-model SSOT).
- The **post-MVP boundary** MUST be documented in `lib/finances.ts` (logical view, no gateway, no money movement),
  referencing `project.md`.
- `npm run build` and `npm run test:unit` MUST stay green; `npm run lint:tokens` + `npm run lint:composition` MUST
  stay green (the only non-test edit is the type-only `LedgerTableVM` transcription).

### SHOULD Requirements
- `getLedger` SHOULD order entries newest-first (by `paidAt` desc) and format money as kopecks → "N ₽" (matching the
  UI's `formatRoubles` + " ₽"); `balance` SHOULD be the formatted sum of the entry amounts.
- PAID gigs SHOULD map to the design `Status` value `'completed'` (the enum has no separate `paid`); the realized
  vs pending distinction SHOULD be carried by the balance/stats, not by inventing a status.
- The helpers SHOULD live in `lib/finances.ts` with the view-model types imported `import type`, so Phase-2
  `compose-finances` imports them from `@/lib/finances`.
- No seed change SHOULD be needed — the existing seeded `PAID`/`COMPLETED` gigs supply ledger data; tests create their
  own gigs.

### Non-Goals
- **No payment gateway / escrow / real money movement** — this is a logical view (MVP boundary); real integration is
  post-MVP behind the same shapes.
- **No schema/model/migration**, **no server action or mutation**, **no `resetTestDatabase` change** — the layer is
  read-only over existing `Gig` data.
- **No UI wiring** — composing the Финансы screen (AppShell + StatPanel + LedgerTable) is Phase 2
  (`compose-finances`). The only non-test source edit is the type-only `LedgerTableVM` transcription.
- **No seed change**; no change to the gig lifecycle, the service-fee model, or any other domain.

## Success Criteria

1. `LedgerTableVM` exists in `view-models.ts` (verbatim §5); `lib/finances.ts` provides read-only `getLedger`/`getFinanceStats` typed to `LedgerTableVM`/`StatPanelVM`.
2. The ledger is per-role (CLIENT → `totalAmount`/`clientId`; SPECIALIST → `budget`/`assignedSpecialistId`) and derived only from existing gigs (no mutation).
3. The result reflects payment statuses — `PAID` gigs are realized (entries + balance); `COMPLETED`-unpaid are pending (stats); flipping `COMPLETED → PAID` moves the amount into the ledger/balance.
4. The post-MVP boundary is documented in `lib/finances.ts`; the helpers match the contracts (assignable to the VMs).
5. `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; no schema/seed/action changes; no UI component/screen changes.

## Affected Areas

- `lib/finances.ts` (new — read-only `getLedger`/`getFinanceStats`, contract-typed; post-MVP boundary doc)
- `app/components/blocks/view-models.ts` (add `LedgerTableVM` — verbatim §5 transcription, type-only; no other change)
- `__tests__/integration/finances-ledger.test.ts` (new — per-role derivation / reflects-statuses / empty / read-only / contract)
- read-only inputs: `app/components/blocks/view-models.ts` (`StatPanelVM`, `Money`/`DateISO`/`Status` aliases), `app/components/primitives/tokens.ts` (`Status`), `prisma/schema.prisma` (`Gig` money fields), `lib/utils/currency.ts`
- `openspec/specs/finances/spec.md` (new domain spec delta)
- (NOT modified: `prisma/schema.prisma`; `prisma/seed.ts`; any server action; `__tests__/helpers/db.ts`; any UI component/screen; other domains)

## Risks & Mitigations

**Risk**: The design `Status` enum has no `paid` value, so a PAID ledger entry can't carry a distinct "paid" status.
**Mitigation**: Map PAID → `'completed'` (the terminal green status); carry the realized-vs-pending distinction in the
**balance** (sum of `PAID`) and the **stats** (paid vs pending tiles), not in the per-entry status. A test asserts the
balance reflects only `PAID`.

**Risk**: Adding `LedgerTableVM` touches the `view-models.ts` SSOT (untouched by prior data changes).
**Mitigation**: It is a **type-only** transcription of the existing §5 definition (the file is explicitly
"DESIGN_SYSTEM_SPEC.md §5, verbatim" and already holds `StatPanelVM`); no component, no runtime, no UI render. The
composition/token lints don't analyse type files, and no fidelity gate applies. This is the one intentional,
spec-faithful addition — scope guard for this change is "no new VM fields beyond the §5 `LedgerTableVM`; no UI
component/screen edits."

**Risk**: "Reflects payment statuses" is ambiguous (realized vs pending).
**Mitigation**: Define it precisely — realized = `PAID` (ledger entries + balance), pending = `COMPLETED`-but-unpaid
(stats only). Tests pin both, including the `COMPLETED → PAID` transition moving an amount into the realized ledger.

**Risk**: Coupling the data layer to the UI by referencing the view-models.
**Mitigation**: `import type` only (erased at build); the view-model is the SSOT for the shape; no runtime dependency
on the blocks/primitives tree — the established `lib/reviews.ts` / `lib/terms.ts` pattern.

**Risk**: A future real-payment integration diverges from this logical view.
**Mitigation**: The boundary is **documented** in `lib/finances.ts` (logical, no gateway) pointing to `project.md`;
real integration is a post-MVP change behind the same `LedgerTableVM`/`StatPanelVM` shapes, so the UI is unaffected.
