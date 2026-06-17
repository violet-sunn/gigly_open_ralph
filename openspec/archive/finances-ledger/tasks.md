# Implementation Tasks: finances-ledger

> **Phase-1 data change (lightest — read-only, no schema).** Fulfill the `StatPanel`/`LedgerTable` contract with a
> **logical, read-only** `lib/finances.ts` that derives a balance + ledger + stats from existing gig data
> (`budget`/`serviceFee`/`totalAmount`/`status`/`paidAt`) per role, plus the §5 `LedgerTableVM` transcription and
> boundary docs. **No schema/model/migration, no payment gateway, no mutation/action, no seed change, no
> `resetTestDatabase` change, no UI wiring** (Phase 2 binds the Финансы screen). Mirror `lib/reviews.ts`/`lib/terms.ts`.
> Friction: low–medium.

---

## Task 1: [x] Materialize `LedgerTableVM` in the view-model SSOT

**Implementation Notes:**
- In `app/components/blocks/view-models.ts`, add (transcribed verbatim from `DESIGN_SYSTEM_SPEC.md` §5, reusing the
  existing `DateISO`/`Money`/`Status` aliases already in the file). Place it near `StatPanelVM` (e.g. after the
  `StatPanelVM` interface):
  ```ts
  export interface LedgerTableVM {
    entries: { date: DateISO; label: string; amount: Money; status: Status }[];
    balance: Money;
  }
  ```
  **Type-only** — no component, no runtime. `StatPanelVM` already exists; do not change it.

**Test Plan:**
```bash
grep -qE 'interface LedgerTableVM' app/components/blocks/view-models.ts && echo "LedgerTableVM present"
grep -qE 'entries:.*date.*label.*amount.*status|balance: Money' app/components/blocks/view-models.ts && echo "shape matches §5"
```
Expected: `LedgerTableVM` materialized (verbatim §5), type-only; `StatPanelVM` unchanged.

---

## Task 2: [x] `lib/finances.ts` — read-only `getLedger` + `getFinanceStats` (contract-typed) + boundary doc

**Implementation Notes:**
- Create `lib/finances.ts` (server-only):
  ```ts
  import { prisma } from '@/lib/prisma'
  import type { LedgerTableVM, StatPanelVM } from '@/app/components/blocks/view-models'

  /**
   * LOGICAL finances view — NO payment gateway, NO real money movement, NO DB writes.
   * Balances/ledgers are DERIVED read-only from gig statuses (budget / serviceFee / totalAmount / PAID).
   * Per project.md "Escrow / Payments (MVP)": payment is the logical `PAID` status, not a real transfer.
   * Real payment-gateway/escrow integration is a POST-MVP change behind the same LedgerTableVM/StatPanelVM shapes.
   */
  type Role = 'CLIENT' | 'SPECIALIST'
  const money = (kopecks: number): string => `${new Intl.NumberFormat('ru-RU').format(kopecks / 100)} ₽`
  const ownerWhere = (userId: string, role: Role) =>
    role === 'CLIENT' ? { clientId: userId } : { assignedSpecialistId: userId }
  const amountOf = (gig: { totalAmount: number; budget: number }, role: Role) =>
    role === 'CLIENT' ? gig.totalAmount : gig.budget

  export async function getLedger(userId: string, role: Role): Promise<LedgerTableVM> {
    const paid = await prisma.gig.findMany({
      where: { ...ownerWhere(userId, role), status: 'PAID' },
      orderBy: { paidAt: 'desc' },
    })
    const entries = paid.map((g) => ({
      date: (g.paidAt ?? g.updatedAt).toISOString(),
      label: g.title,
      amount: money(amountOf(g, role)),
      status: 'completed' as const, // design Status has no `paid`; PAID → completed (green)
    }))
    const total = paid.reduce((sum, g) => sum + amountOf(g, role), 0)
    return { entries, balance: money(total) }
  }

  export async function getFinanceStats(userId: string, role: Role): Promise<StatPanelVM> {
    const where = ownerWhere(userId, role)
    const [paid, completed] = await Promise.all([
      prisma.gig.findMany({ where: { ...where, status: 'PAID' } }),
      prisma.gig.findMany({ where: { ...where, status: 'COMPLETED' } }),
    ])
    const realized = paid.reduce((s, g) => s + amountOf(g, role), 0)
    const pending = completed.reduce((s, g) => s + amountOf(g, role), 0)
    const paidLabel = role === 'CLIENT' ? 'Оплачено' : 'Заработано'
    return {
      stats: [
        { label: paidLabel, value: money(realized) },
        { label: 'Ожидает', value: money(pending) },
        { label: 'Выполнено', value: paid.length },
      ],
    }
  }
  ```
  `import type` (erased at build) → contract-typed with no runtime UI coupling. Read-only (`findMany` only). `status:
  'completed' as const` is a valid `Status` member.

**Test Plan:**
```bash
test -f lib/finances.ts && grep -qE 'import type .*(LedgerTableVM|StatPanelVM)' lib/finances.ts && echo "contract-typed"
grep -qE 'getLedger' lib/finances.ts && grep -qE 'getFinanceStats' lib/finances.ts && echo "both helpers"
grep -qiE 'logical|no.*gateway|post-MVP' lib/finances.ts && echo "boundary documented"
grep -qE '\.(create|update|delete|upsert|createMany|updateMany|deleteMany)\(' lib/finances.ts && echo "CHECK mutation" || echo "OK read-only"
```
Expected: read-only, contract-typed `getLedger`/`getFinanceStats`; post-MVP boundary documented; no mutations.

---

## Task 3: [x] Integration tests

**Implementation Notes:**
- Add `__tests__/integration/finances-ledger.test.ts` (mock `@/lib/prisma`, `next/headers`, `next/navigation`;
  `createTestUser`/`createTestGig`; import helpers after mocks — mirror `category-taxonomy.test.ts`). `createTestGig`
  accepts `budget`/`serviceFee`/`totalAmount`/`status`/`paidAt`/`clientId`/`assignedSpecialistId`. Cover:
  - **CLIENT realized ledger:** create owned gigs — PAID (budget 100000, totalAmount 110000, `paidAt` set), COMPLETED
    (unpaid), OPEN. `getLedger(client, 'CLIENT')` → `entries` has exactly the PAID gig, `amount` formatted from
    `totalAmount`; `balance` = formatted `totalAmount` sum; the OPEN/COMPLETED gigs are absent from entries.
  - **SPECIALIST realized ledger:** PAID gigs assigned to the specialist → `amount` from `budget`; `balance` = budget
    sum.
  - **reflects payment statuses:** a COMPLETED (unpaid) gig is **not** in `entries`; flip it to `PAID` (`status:
    'PAID'`, `paidAt: new Date()`) → it now appears in `entries` and `balance` increases.
  - **stats (paid + pending):** with one PAID and one COMPLETED owned gig, `getFinanceStats` → the realized tile
    reflects the PAID amount, the "Ожидает" tile reflects the COMPLETED amount, the count = number of PAID.
  - **empty:** a user with no PAID gigs → `entries = []`, `balance` is a zero amount (`noSpace(balance)` starts "0").
  - **read-only:** snapshot a gig, call both helpers, re-read the gig → unchanged.
  - **contract:** compile-time `const _l: LedgerTableVM = await getLedger(id, 'CLIENT')` and `const _s: StatPanelVM =
    await getFinanceStats(id, 'CLIENT')`.
- ru-RU groups with a non-breaking space — normalise (`s.replace(/\s/g,'')`) before comparing money strings.

**Test Plan:**
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/finances-ledger.test.ts 2>&1 | tail -12
```
Expected: per-role derivation, reflects-statuses (incl. COMPLETED→PAID), stats, empty, read-only, contract — all pass.

---

## Task 4: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec Test Plan (contract type, helper, read-only, tests, typecheck,
  build, full suite clean DB, lints).
- Confirm scope: read-only/additive; **no** schema change (`git diff --quiet prisma/schema.prisma`), no seed change,
  no action/mutation, no `resetTestDatabase` change; the only non-test source edit beyond `lib/finances.ts` is the
  type-only `LedgerTableVM` transcription in `view-models.ts` (no block/workbench/screen change).

**Test Plan:**
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/finances|view-models|finances-ledger.test" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff --quiet prisma/schema.prisma && echo "schema unchanged" || echo "CHECK schema changed"
git diff --quiet prisma/seed.ts && echo "seed unchanged" || echo "CHECK seed changed"
git status --porcelain | grep -E 'app/components/blocks/[A-Z]|app/workbench/|app/\(protected\)/' && echo "CHECK UI modified" || echo "OK no UI component/screen changes"
```
Expected: all gates green; read-only; no schema/seed/action changes; only the type-only VM addition + new lib + new test.

---

## Summary

Total tasks: 4
Estimated effort: 2–4 hours (friction: low–medium — a type transcription + a read-only derivation module + tests; no schema/model/action/seed)

**Deliverables:**
- ✅ `LedgerTableVM` materialized in `view-models.ts` (verbatim §5, type-only).
- ✅ `lib/finances.ts` — read-only, contract-typed `getLedger` (PAID entries + balance) + `getFinanceStats` (paid + pending), per role; post-MVP boundary documented.
- ✅ `finances-ledger.test.ts` (per-role / reflects-statuses / stats / empty / read-only / contract).

**Critical path:** LedgerTableVM (1) → lib/finances.ts (2) → tests (3) → acceptance (4).

**Scope guards (non-goals):**
- No schema/model/migration; no payment gateway; no mutation/action; no seed change; no `resetTestDatabase` change; no UI wiring (Phase 2 `compose-finances`); `LedgerTableVM` is the only (type-only) `view-models.ts` edit.

**Success criteria:**
- ✅ `getLedger` ⇒ `LedgerTableVM` (PAID realized) + `getFinanceStats` ⇒ `StatPanelVM` (paid + pending), per role, read-only
- ✅ Reflects payment statuses (PAID realized; COMPLETED pending; COMPLETED→PAID moves the amount); empty graceful; boundary documented
- ✅ `build` + `test:unit` (clean DB) + lints green; no schema/seed/action changes; no UI component/screen changes
