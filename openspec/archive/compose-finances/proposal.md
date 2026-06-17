# Change Proposal: compose-finances

> Phase 2, change 25 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It builds
> the **new `/finances`** screen, composed from kit blocks — within the `AppShell` the shell-cutover put in the
> protected layout — over the **`finances-ledger`** logical data layer (`lib/finances.ts`): `AppShell + StatPanel +
> LedgerTable`, with an empty state and an explicit **«логические суммы, без реальных платежей»** framing. Depends on:
> compose-shell-cutover, domain-blocks, finances-ledger (all complete). Friction: **medium**.
>
> **Fidelity gate — no full-screen mock.** There is **no `Финансы` reference frame** in `/screens` (the planning doc
> flags this — "request a frame"). So **F1 is flagged-missing**, not run: the screen is composed **from the kit** and
> **F5 (composition purity) + F3 (logical parity) + the functional checks are enforced**. The missing-mock fact is
> recorded (a frame is requested); F1 is reached once the frame lands.

## Problem Statement

The `finances-ledger` Phase-1 change already built the **logical finances data layer** (`lib/finances.ts`): `getLedger(
userId, role)` → `LedgerTableVM` (the user's PAID gigs as logical transactions + the summed balance) and
`getFinanceStats(userId, role)` → `StatPanelVM` (realized vs pending vs count, per role) — **no payment gateway, no
money movement, no DB writes**, derived read-only from gig statuses (`budget`/`serviceFee`/`totalAmount`/`PAID`). But
there is **no `/finances` screen**: the data layer has no consumer.

- **No `/finances` route exists** (`app/(protected)/finances/` is absent). The sidebar already links «Финансы» →
  `/finances` (per F3, from compose-shell-cutover) but the target 404s — this change delivers it, so the nav item
  becomes active.
- **The `LedgerTable` block is a composition gap.** The redesign composition names `AppShell + StatPanel + LedgerTable`
  and the `LedgerTableVM` contract exists in the block view-model SSOT (`app/components/blocks/view-models.ts`), and
  `lib/finances.getLedger` already returns exactly that shape — but **no block implements it** (absent from
  `app/components/blocks/index.ts`). `StatPanel` exists. So this change is a single gap-fill + the screen, exactly as
  `GigHeader`/`ChatHeader` were for prior screens.
- **No mock + the MVP boundary must be visible.** There is no `Финансы` full-screen reference (a frame is requested),
  and `project.md`'s "Escrow / Payments (MVP)" requires the screen to be honest that amounts are **logical** (the `PAID`
  status, not a real transfer). The screen MUST carry that framing and an empty state for users with no realized
  payments.

The planning doc maps this exactly: compose `/finances` from `StatPanel + LedgerTable` over `finances-ledger`, with an
empty state and the "logical amounts, no real payments" framing; verify it reflects the ledger and the nav is active;
F1 only where a reference exists (else compose from blocks + flag the missing mock, F5 still enforced). This change adds
the screen as a thin, read-only composition over the existing logical data layer.

## Proposed Solution

Add the `/finances` route as a composition-pure, read-only screen, with one block gap-fill, a thin aggregator mapper,
and verification. Five deliverable groups:

1. **`LedgerTable` block (gap fill)** — `app/components/blocks/LedgerTable.tsx` (+ fixture + barrel export; the
   `LedgerTableVM` contract already exists): a token-pure table — a header row + one row per entry (date · label ·
   `StatusBadge` · amount in mono) + a summed **balance** footer, with an **empty state** («Пока нет операций») when
   `entries` is empty. Composed from primitives (`StatusBadge`) + layout (Panel/Stack/Grid) + tokens. Formats the
   `DateISO` for display (the VM contract: the block formats the date). Token-pure.

2. **`getFinances` mapper (`lib/view-models.ts`, server-only, contract-typed)** — `getFinances(viewer)` → `{ stats:
   StatPanelVM; ledger: LedgerTableVM }`: a thin aggregator over the existing `lib/finances` helpers
   (`getFinanceStats(viewer.userId, role)` + `getLedger(viewer.userId, role)`), normalizing the session role to
   `'CLIENT' | 'SPECIALIST'`. `import type` the VMs. (Keeps the screen-data assembly consistent with the other
   compose-* screens; the actual derivation stays in `lib/finances`.)

3. **`Finances` composed screen (`app/(protected)/finances/Finances.tsx`, `@composed-screen`)** — props = `{ stats,
   ledger }`. Composes, via **layout primitives only** (Section/Stack — no `className`/`style`): `Section` «Финансы» + a
   `Notice` with the «Суммы логические, без реальных платежей» framing + `StatPanel` (the finance tiles) + `LedgerTable`
   (the realized transactions, or its empty state). Read-only — no client interactivity, no actions. (Likely a server
   component; `'use client'` only if a layout primitive requires it.)

4. **Thin server page (`app/(protected)/finances/page.tsx`)** — `getSession` + no-session redirect; `getFinances(viewer)`;
   render `<Finances stats={…} ledger={…} />`. The sidebar «Финансы» item becomes **active** automatically (the existing
   `markActive` prefix-matches `/finances`).

5. **Tests + missing-mock flag** — unit tests for `getFinances` (reflects PAID gigs → ledger entries + balance + stats;
   empty when none; per-role amounts — CLIENT `totalAmount`, SPECIALIST `budget`). E2E (`compose-finances.spec.ts`): a
   seeded user with a PAID gig sees the ledger row + balance + the finance stats + the logical-amounts framing; a user
   with no PAID gigs sees the empty state; the sidebar «Финансы» item is active on `/finances`. `lint:composition` (F5)
   on `Finances`; F3 parity. **F1 is flagged-missing** (no `Финансы` frame) — recorded; no diff is run.

This change emits **the `LedgerTable` block + the `getFinances` mapper + the `Finances` composition + the new `/finances`
page + tests only**. It does **not** add a data model, change `lib/finances` semantics, add any write/action, or touch
the shell.

## Constraints

### MUST Requirements
- The `/finances` body MUST be composed from blocks (`StatPanel` + `LedgerTable`, with the logical-amounts framing)
  inside the layout's `AppShell`, as a composition-pure screen (F5): `Finances` MUST carry `@composed-screen`, import
  only kit/`lib`/`react`/`next`, and contain **no** `className`/`style`/raw styled markup.
- The screen MUST bind **real** data via `getFinances` over `lib/finances` — the `StatPanel` tiles (realized/pending/
  count, per role) and the `LedgerTable` entries (the user's PAID gigs + the summed balance), with per-role amounts
  (CLIENT `totalAmount`, SPECIALIST `budget`).
- The `LedgerTable` block MUST be implemented token-pure (header + entry rows with `StatusBadge` + mono amounts +
  balance), with an **empty state** when there are no entries, a fixture, and a barrel export.
- The screen MUST render an **empty state** for users with no realized payments and MUST display the **«логические
  суммы, без реальных платежей»** framing (the MVP escrow boundary).
- The page MUST render `Finances` for an authenticated user, preserve the no-session redirect, and the sidebar
  «Финансы» nav item MUST be **active** on `/finances`.
- `npm run build`, `npm run test:unit`, the finances E2E, `npm run lint:composition`, and `npm run lint:tokens` MUST be
  green; the existing `finances-ledger` tests MUST stay green.

### SHOULD Requirements
- `getFinances` SHOULD live in `lib/view-models.ts` (server-only, `import type` the VMs) and reuse the existing
  `getLedger` + `getFinanceStats` from `lib/finances` (no re-derivation).
- `Finances` SHOULD be a server component (no `'use client'`) — it is read-only; the framing SHOULD use the `Notice`
  block (token-styled) so the screen stays F5-pure.
- The `LedgerTable` SHOULD format the `DateISO` entries for display (the VM contract) and show the balance as a summed
  mono total.

### Non-Goals
- **No payment gateway / escrow / real money movement** (the MVP boundary — amounts are the logical `PAID` status); **no
  new data model**; **no `lib/finances` semantics change**; **no writes/actions** (the screen is read-only); **no shell
  change**.
- **F1 ≤1% is not run** — there is **no `Финансы` reference frame**; the screen is composed from the kit with F5/F3/
  functional enforced, and the missing-mock is flagged (a frame is requested). When a frame lands, F1 runs like the
  other screens (still gated on the font licence).

## Success Criteria

1. `/finances` body composes `StatPanel` + `LedgerTable` (+ the logical-amounts framing) as an F5-pure `@composed-screen`, rendered by a thin server page.
2. Real data bound via `getFinances` over `lib/finances` — finance stats + ledger entries + balance, per-role amounts; reflects PAID gigs.
3. `LedgerTable` block implemented token-pure with an empty state + fixture + export.
4. Empty state for no realized payments; the «логические суммы, без реальных платежей» framing present; the sidebar «Финансы» item active on `/finances`.
5. `build`, `test:unit` (existing `finances-ledger` tests green), finances E2E, `lint:composition`, `lint:tokens` all green; F1 flagged-missing (no `Финансы` frame — recorded, not run).

## Affected Areas

- `app/(protected)/finances/page.tsx` (new — thin server page: `getFinances` + `<Finances>`)
- `app/(protected)/finances/Finances.tsx` (new — `@composed-screen`, read-only)
- `app/components/blocks/LedgerTable.tsx` (new block) + `app/components/blocks/index.ts` (export) + `fixtures.ts` (fixture) — the `LedgerTableVM` contract already exists
- `lib/view-models.ts` (new — `getFinances` aggregator, contract-typed)
- `__tests__/e2e/compose-finances.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests)
- read-only inputs: `lib/finances` (`getLedger`/`getFinanceStats`), the blocks (`StatPanel`/`Notice`), the primitives (`StatusBadge`), the layout primitives
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements, folded on archive)
- (NOT modified: data models; `lib/finances` semantics; the shell; no writes/actions)

## Risks & Mitigations

**Risk**: No `Финансы` mock — composing "by eye" would reintroduce the parody the mechanism exists to prevent.
**Mitigation**: Compose strictly from existing system entities (`StatPanel` + the new token-pure `LedgerTable` + `Notice` + layout primitives) — `lint:composition` (F5) + `lint:tokens` (F2) make off-system styling impossible. F1 is explicitly **flagged-missing** (a frame is requested), not faked; F3 logical parity (stats + ledger + empty state + framing) is the enforced bar until the frame lands.

**Risk**: The `LedgerTable` block is new — getting its shape wrong would diverge from the `LedgerTableVM` contract that `lib/finances` already fulfills.
**Mitigation**: The block is typed by the **existing** `LedgerTableVM` (entries `{date,label,amount,status}` + `balance`), which `getLedger` already returns — the block renders that contract verbatim; a fixture + a render assertion confirm it.

**Risk**: The logical-amounts boundary could be lost, implying real payments exist.
**Mitigation**: The screen renders an explicit `Notice` («Суммы логические, без реальных платежей»); the proposal/spec record the MVP escrow boundary; `lib/finances` does no writes (read-only derivation), preserved verbatim.

**Risk**: Per-role amounts differ (CLIENT pays `totalAmount` incl. fee; SPECIALIST receives `budget`).
**Mitigation**: `getFinances` passes the session role straight to `lib/finances`, whose `amountOf` already encodes this; unit tests assert both roles (CLIENT `totalAmount`, SPECIALIST `budget`).
