# UI Specification Delta: compose-finances

This document contains specification changes for the `compose-finances` change — Phase-2 screen composition #8. It builds
the new **`/finances`** screen, composed from kit blocks (`AppShell + StatPanel + LedgerTable`), inside the `AppShell`
the shell-cutover put in the protected layout, over the **`finances-ledger`** logical data layer (`lib/finances.ts`) —
with an empty state and an explicit **«логические суммы, без реальных платежей»** framing. It ships **a new `LedgerTable`
block + the `getFinances` aggregator mapper + the `Finances` composition + the `/finances` page + tests only** — F5
composition-pure, F3 logical parity. **F1 is flagged-missing** (no `Финансы` reference frame — a frame is requested), not
run. It does **not** add a data model, change `lib/finances` semantics, add writes/actions, or touch the shell.

---

## ADDED Requirements

### Requirement: Finances Composed from Blocks
The `/finances` body MUST be composed from kit blocks as a composition-pure screen (F5), inside the layout's `AppShell`.

#### Scenario: Finances is a composed screen
- GIVEN `app/(protected)/finances/Finances.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `StatPanel` + `LedgerTable` (plus a token-styled
  logical-amounts framing) via layout primitives (Section/Stack), import only kit/`lib`/`react`/`next`, and contain
  **no** `className=` / `style=` / raw styled markup

#### Scenario: The page renders it
- GIVEN `app/(protected)/finances/page.tsx`
- WHEN an authenticated user loads `/finances`
- THEN the page MUST build the data server-side (`getFinances`) and render `<Finances>` (inside the shell); the
  no-session redirect MUST be preserved, and the sidebar «Финансы» nav item MUST be active on `/finances`

**Acceptance Criteria:**
- `Finances` is an F5-pure `@composed-screen` composing `StatPanel` + `LedgerTable` + the framing; the page renders it
- No-session redirect preserved; the «Финансы» nav item is active on `/finances`

### Requirement: Finances Real Data Binding via getFinances
The screen MUST bind real data through a server-only, contract-typed `getFinances` aggregator over the `finances-ledger`
data layer (`lib/finances`), with no re-derivation.

#### Scenario: Stats + ledger reflect the user's PAID gigs
- GIVEN `getFinances(viewer)`
- WHEN it runs
- THEN it MUST return `{ stats: StatPanelVM, ledger: LedgerTableVM }` by reusing `getFinanceStats` + `getLedger` from
  `lib/finances` — the `ledger.entries` are the viewer's PAID gigs (newest first) with the summed `ledger.balance`, and
  the `stats` reflect realized/pending/count, using per-role amounts (CLIENT `totalAmount`, SPECIALIST `budget`)

**Acceptance Criteria:**
- `getFinances` returns `{ stats, ledger }` from `lib/finances`; reflects PAID gigs + balance; per-role amounts; contract-typed (`import type`)

### Requirement: LedgerTable Block (composition-gap fill)
The `LedgerTable` block MUST be implemented (it is named by this composition and its `LedgerTableVM` contract exists, but
no block implements it).

#### Scenario: LedgerTable is a token-pure kit block with an empty state
- GIVEN `app/components/blocks/LedgerTable.tsx`
- WHEN inspected
- THEN it MUST render the ledger from a `LedgerTableVM` — a header + one row per entry (date · label · `StatusBadge` ·
  amount in mono) + a summed balance, and an **empty state** when `entries` is empty — be token-pure (primitives +
  layout + tokens), have a fixture, and be exported from the blocks barrel

**Acceptance Criteria:**
- `LedgerTable` token-pure block (entries + balance + empty state) + fixture + barrel export; `lint:tokens` passes

### Requirement: Logical-Amounts Framing and Empty State
The screen MUST make the MVP escrow boundary visible and handle the no-payments case.

#### Scenario: Logical-amounts framing
- GIVEN the `/finances` screen
- WHEN it renders
- THEN it MUST display an explicit framing that amounts are logical and there are no real payments (e.g. «Суммы
  логические, без реальных платежей»), consistent with `project.md`'s Escrow / Payments (MVP) boundary

#### Scenario: Empty state
- GIVEN a user with no PAID gigs
- WHEN they load `/finances`
- THEN the `LedgerTable` MUST render its empty state (e.g. «Пока нет операций») rather than an empty/broken table

**Acceptance Criteria:**
- The logical-amounts framing is present; the empty state renders for users with no realized payments

### Requirement: Finances Verification and Flagged-Missing F1
The change MUST pass F3 + F5 + the functional/E2E suite; F1 is flagged-missing (no `Финансы` reference frame).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit tests, and the
  finances E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the intended composition (stats + ledger + empty
  state + framing) (F3), the screen reflects the ledger, and the existing `finances-ledger` tests stay green

#### Scenario: F1 flagged-missing
- GIVEN there is no `Финансы` full-screen reference frame in `/screens`
- WHEN fidelity is considered
- THEN F1 ≤1% MUST NOT be run (no reference); the screen is composed from the kit with F5 enforced; the missing-mock
  fact MUST be recorded (a frame is requested) and F1 deferred until a frame lands

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit tests + finances E2E green; existing `finances-ledger` tests green
- F1 flagged-missing (no `Финансы` frame); composed from blocks; F5 still enforced

---

## Test Plan

This change ships a block + an aggregator mapper + a composition + a new page + tests. Validation is by deterministic
commands. Commands assume the repo root.

### Composition + block + mapper
```bash
grep -qE '@composed-screen' app/\(protected\)/finances/Finances.tsx && echo "Finances composed screen (F5 marker)"
grep -qE 'className=|style=' app/\(protected\)/finances/Finances.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
test -f app/components/blocks/LedgerTable.tsx && grep -qE 'LedgerTable' app/components/blocks/index.ts && echo "LedgerTable block + export"
grep -qE 'getFinances' lib/view-models.ts && grep -qE 'getLedger|getFinanceStats' lib/view-models.ts && echo "getFinances reuses lib/finances"
grep -qE 'StatPanel|LedgerTable' app/\(protected\)/finances/Finances.tsx && echo "composes StatPanel + LedgerTable"
grep -qE 'getFinances|Finances' app/\(protected\)/finances/page.tsx && echo "page renders Finances"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite (incl. preserved finances-ledger)
```bash
npm run clean:test-db && npx vitest run __tests__/integration/finances-vm.test.ts 2>&1 | tail -10
npm run clean:test-db && npx vitest run __tests__/integration/finances-ledger.test.ts 2>&1 | tail -8
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Finances E2E (stats + ledger + empty state + nav active)
```bash
npx playwright test __tests__/e2e/compose-finances.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 (flagged-missing)
```bash
# No screens/finances*.jpg reference frame exists → F1 ≤1% is NOT run.
ls screens/ | grep -i financ || echo "no Финансы reference frame — F1 flagged-missing (a frame is requested)"
```

### Manual review
1. Confirm `Finances` is an F5-pure `@composed-screen` (StatPanel + LedgerTable + framing via layout primitives; no className/style) rendered by the page.
2. Confirm `getFinances` reflects the ledger (PAID gigs → entries + balance; stats per role) by reusing `lib/finances`.
3. Confirm `LedgerTable` is implemented + exported with an empty state; the logical-amounts framing is present; the «Финансы» nav item is active.
4. Confirm no data-model / `lib/finances` / shell change, and that F1 is flagged-missing (no `Финансы` frame).
