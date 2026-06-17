# Implementation Tasks: compose-finances

> **Phase-2 screen composition.** Build the new `/finances` screen, composed from kit blocks (`AppShell + StatPanel +
> LedgerTable`) inside the layout's `AppShell`, over the existing `finances-ledger` logical data layer
> (`lib/finances.ts`) — with an empty state and the «логические суммы, без реальных платежей» framing. Add the
> `LedgerTable` block gap-fill (its `LedgerTableVM` contract already exists); add a thin `getFinances` aggregator; F5
> composition-pure, F3 parity. **F1 flagged-missing** (no `Финансы` reference frame — request a frame). Read-only (no
> writes/actions). Mirror the prior compose-* screens. Friction: medium.

---

## Task 1: [x] `LedgerTable` block (composition-gap fill)

**Implementation Notes:**
- The `LedgerTableVM` contract already exists in `app/components/blocks/view-models.ts`:
  ```ts
  export interface LedgerTableVM {
    entries: { date: DateISO; label: string; amount: Money; status: Status }[];
    balance: Money;
  }
  ```
- Create `app/components/blocks/LedgerTable.tsx` (a block — token classes / layout primitives OK; NOT a
  `@composed-screen`): a `Panel` with a header row + one row per entry (date · label · `StatusBadge` · amount in mono) +
  a summed **balance** footer; an **empty state** («Пока нет операций») when `entries.length === 0`. Format the
  `DateISO` for display (`new Date(e.date).toLocaleDateString('ru-RU')` — the VM contract: the block formats the date).
  Use `StatusBadge` (variant inline-dot) + `STATUS_LABEL` from `./util` for the status. Mirror `GigCard`/`StatPanel`.
  Token-pure. Sketch:
  ```tsx
  import { StatusBadge } from "@/app/components/primitives";
  import { Panel } from "@/app/components/layout/Panel";
  import { Stack } from "@/app/components/layout/Stack";
  import { STATUS_LABEL } from "./util";
  import type { LedgerTableVM } from "./view-models";

  export function LedgerTable({ vm }: { vm: LedgerTableVM }) {
    return (
      <Panel surface={1} radius="lg" padding={6}>
        <Stack gap={4}>
          {vm.entries.length === 0 ? (
            <span className="text-body font-body text-muted">Пока нет операций</span>
          ) : (
            <Stack gap={2}>
              {vm.entries.map((e, i) => (
                <Stack key={i} axis="row" gap={4} align="center" justify="between">
                  <span className="text-caption font-caption text-muted">{new Date(e.date).toLocaleDateString("ru-RU")}</span>
                  <span className="text-body font-body text-strong">{e.label}</span>
                  <StatusBadge variant="inline-dot" status={e.status}>{STATUS_LABEL[e.status]}</StatusBadge>
                  <span className="font-mono text-mono text-strong">{e.amount}</span>
                </Stack>
              ))}
            </Stack>
          )}
          <Stack axis="row" gap={4} align="center" justify="between">
            <span className="text-label font-label text-muted">Баланс</span>
            <span className="font-mono text-mono text-strong">{vm.balance}</span>
          </Stack>
        </Stack>
      </Panel>
    );
  }
  ```
- Add `ledgerTableFixture` (+ an empty variant) to `fixtures.ts`; export `LedgerTable` from `app/components/blocks/index.ts`.

**Test Plan:**
```bash
test -f app/components/blocks/LedgerTable.tsx && grep -qE 'LedgerTable' app/components/blocks/index.ts && echo "block + export"
grep -qE 'ledgerTableFixture' app/components/blocks/fixtures.ts && echo "fixture"
npm run lint:tokens && echo "token-pure"
```
Expected: `LedgerTable` token-pure block (entries + balance + empty state) + fixture + barrel export.

---

## Task 2: [x] `getFinances` aggregator mapper (`lib/view-models.ts`)

**Implementation Notes:**
- Add `getFinances(viewer)` (server-only) — a thin aggregator over `lib/finances` (no re-derivation):
  ```ts
  import { getLedger, getFinanceStats } from '@/lib/finances'
  import type { StatPanelVM, LedgerTableVM } from '@/app/components/blocks/view-models'

  export interface FinancesData { stats: StatPanelVM; ledger: LedgerTableVM }

  export async function getFinances(viewer: { userId: string; role: string }): Promise<FinancesData> {
    const role = viewer.role === 'SPECIALIST' ? 'SPECIALIST' : 'CLIENT'
    const [stats, ledger] = await Promise.all([
      getFinanceStats(viewer.userId, role),
      getLedger(viewer.userId, role),
    ])
    return { stats, ledger }
  }
  ```
  (`lib/finances` already returns the `StatPanelVM`/`LedgerTableVM` shapes; this only normalizes the role + bundles
  them for the screen's single data prop. `import type` the VMs.)

**Test Plan:**
```bash
grep -qE 'getFinances' lib/view-models.ts && grep -qE 'getLedger|getFinanceStats' lib/view-models.ts && echo "aggregator reuses lib/finances"
```
Expected: `getFinances(viewer)` returns `{ stats, ledger }` from `lib/finances`; contract-typed.

---

## Task 3: [x] `Finances` composed screen

**Implementation Notes:**
- Create `app/(protected)/finances/Finances.tsx` (`/* @composed-screen */`; a **server component** — read-only, no
  client interactivity). Props = `FinancesData`. Compose via **layout primitives only** (Section/Stack — no
  className/style):
  ```tsx
  /* @composed-screen */
  import { Section } from '@/app/components/layout/Section'
  import { Stack } from '@/app/components/layout/Stack'
  import { StatPanel, LedgerTable, Notice } from '@/app/components/blocks'
  import type { FinancesData } from '@/lib/view-models'

  export function Finances({ stats, ledger }: FinancesData) {
    return (
      <Section title="Финансы" gap={6}>
        <Notice tone="muted">Суммы логические, без реальных платежей.</Notice>
        <StatPanel vm={stats} variant="grid" />
        <LedgerTable vm={ledger} />
      </Section>
    )
  }
  ```
  No className/style → F5-clean. (Confirm `Notice` is exported from the blocks barrel — it is, from
  compose-gig-detail-apply.)

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/finances/Finances.tsx && echo "composed screen"
grep -qE 'className=|style=' app/\(protected\)/finances/Finances.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure composition (Notice framing + StatPanel + LedgerTable).

---

## Task 4: [x] Thin server page (nav becomes active)

**Implementation Notes:**
- Create `app/(protected)/finances/page.tsx` (server): `getSession` + no-session redirect; call `getFinances({ userId:
  session.userId, role: session.role })`; render `<Finances {...data} />`.
- No nav change needed: the sidebar already lists «Финансы» → `/finances` (lib/nav) and `markActive` prefix-matches, so
  the item becomes active once the route exists.

**Test Plan:**
```bash
grep -qE 'getFinances|Finances' app/\(protected\)/finances/page.tsx && echo "page composed"
grep -qE 'getSession' app/\(protected\)/finances/page.tsx && echo "session guard"
```
Expected: `/finances` renders `Finances`; redirect preserved; «Финансы» nav item active on `/finances`.

---

## Task 5: [x] Mapper unit tests + finances E2E

**Implementation Notes:**
- `__tests__/integration/finances-vm.test.ts` (mock `@/lib/prisma`/`next/*`; `createTestUser`/`createTestGig`): a CLIENT
  with a PAID gig → `getFinances` returns a ledger entry (label = gig title, amount = `totalAmount`, status
  `completed`), the summed balance, and stats («Оплачено»/«Ожидает»/«Выполнено»); a SPECIALIST assigned to a PAID gig →
  amount = `budget` (no fee); a user with no PAID gigs → empty `ledger.entries` (+ zeroed stats).
- `__tests__/e2e/compose-finances.spec.ts` (setE2ESession + seed via prisma into `file:./test.db`): a user with a PAID
  gig sees the ledger row + balance + the finance stats + the «Суммы логические…» framing; a user with no PAID gigs
  sees the empty state («Пока нет операций»); the sidebar «Финансы» item is active on `/finances`.
- **Keep** the `finances-ledger` integration tests (`finances-ledger.test.ts`) unchanged — they target `lib/finances`,
  preserved.

**Test Plan:**
```bash
npm run clean:test-db && npx vitest run __tests__/integration/finances-vm.test.ts 2>&1 | tail -12
npm run clean:test-db && npx vitest run __tests__/integration/finances-ledger.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/compose-finances.spec.ts --project=chromium 2>&1 | tail -12
```
Expected: mapper unit tests pass; the preserved `finances-ledger` tests stay green; the E2E covers stats + ledger + empty state + nav active.

---

## Task 6: [x] Buildable acceptance (F3 + F5 + suite) + scope confirmation + missing-mock flag

**Implementation Notes:**
- Run F5 composition lint, token lint, build, full unit suite, and the E2E.
- Confirm scope: only `/finances` added + the `LedgerTable` block + the `getFinances` aggregator; `lib/finances`
  semantics unchanged (`finances-ledger` tests green); no data-model change; no writes/actions; no shell change; the
  `LedgerTableVM` contract was already present (no block-contract addition).
- Record the **missing-mock** flag: there is no `screens/Финансы`/`finances` frame → F1 ≤1% is not run; the screen is
  composed from the kit (F5 enforced); a frame is requested.

**Test Plan:**
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
ls screens/ | grep -i financ || echo "no Финансы frame — F1 flagged-missing"
```
Expected: F3 + F5 + build + suite + E2E green; scope held (finances only; lib/finances/shell untouched); F1 flagged-missing recorded.

---

## Summary

Total tasks: 6
Estimated effort: 8–12 hours (friction: medium — a new route + one block gap-fill + a thin aggregator + a read-only
composed screen + unit/E2E; no new data model, no writes, `lib/finances` reused; no mock to diff)

**Deliverables:**
- `LedgerTable` block (gap fill — the `LedgerTableVM` contract already exists) + fixture + export.
- `lib/view-models.ts` — `getFinances` aggregator (reuses `getLedger` + `getFinanceStats`), contract-typed.
- `Finances` F5-pure `@composed-screen` (Notice framing + StatPanel + LedgerTable); thin server page; «Финансы» nav active.
- Mapper unit tests + finances E2E (stats + ledger + empty state + nav active); preserved `finances-ledger` tests; F1 flagged-missing (no `Финансы` frame).

**Critical path:** LedgerTable block (1) → getFinances (2) → Finances composition (3) → page (4) → tests (5) → acceptance + missing-mock flag (6).

**Dependencies:** compose-shell-cutover, domain-blocks, finances-ledger — all complete.

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–6):**
- **`LedgerTable` block** (`app/components/blocks/LedgerTable.tsx`) — a header row + one row per entry (date · label ·
  `StatusBadge` · mono amount) + a summed balance footer, with an **empty state** («Пока нет операций»); formats the
  `DateISO` for display. Token-pure, with `ledgerTableFixture` + `ledgerTableEmptyFixture` + barrel export. The
  `LedgerTableVM` contract pre-existed (no block-contract addition).
- **`getFinances` aggregator** (`lib/view-models.ts`) — `{ stats, ledger }` by reusing `getFinanceStats` + `getLedger`
  from `lib/finances` (no re-derivation), normalizing the session role. `import type` the VMs.
- **`Finances` `@composed-screen`** (`app/(protected)/finances/Finances.tsx`) — a **server component** (read-only):
  Section «Финансы» + a `Notice` («Суммы логические, без реальных платежей.») + `StatPanel` + `LedgerTable`, via layout
  primitives only. F5-pure (no className/style).
- **Thin server page** (`app/(protected)/finances/page.tsx`) — `getSession` + redirect + `getFinances` + `<Finances>`;
  the sidebar «Финансы» item becomes active via the existing `markActive` (no nav change).
- **Tests** — `__tests__/integration/finances-vm.test.ts` **3/3** (CLIENT PAID gig → ledger entry `totalAmount` +
  balance + «Оплачено»/«Ожидает» stats; SPECIALIST PAID gig → amount = `budget` (no fee) + «Заработано»; no-PAID →
  empty ledger). `__tests__/e2e/compose-finances.spec.ts` **3/3** in a real browser — ledger row + balance + stats +
  logical-amounts framing; empty state for no realized payments; the «Финансы» nav item active on `/finances`.
- **Gates** — `lint:composition` (F5, 10 composed screens) ✓ · `lint:tokens` (F2) ✓ · `npm run build` ✓ (`/finances`
  189 B — server component) · `npm run test:unit` **888/888** (was 885; +3 new) ✓ · preserved `finances-ledger` tests
  **7/7** ✓.

**Task 6 (F1): flagged-missing.** There is **no `Финансы` reference frame** in `/screens` (`ls screens/ | grep -i
financ` → none). F1 ≤1% is **not run**; the screen is composed from the kit with **F5 + F3 + functional enforced**; a
frame is **requested**. When a frame lands, F1 runs like the other screens (still gated on the font licence).

**Scope guards (non-goals held):** no new data model; `lib/finances` semantics **unchanged** (read-only derivation; the
`finances-ledger` integration tests stay green); no writes/actions (the screen is read-only); no shell change; the
`LedgerTableVM` contract pre-existed (no block-contract addition); `getFinances`/`FinancesData` live in
`lib/view-models.ts`.

**Reconciliations recorded:**
- F1 is **flagged-missing** (no `Финансы` mock), not faked — the honest stance the mechanism mandates; F3 logical parity
  (stats + ledger + empty state + framing) is the enforced bar until a frame is provided.
- The MVP escrow boundary («логические суммы, без реальных платежей») is surfaced on-screen via a `Notice` and recorded
  in the spec; `lib/finances` does no writes (logical PAID-status derivation), preserved verbatim.
