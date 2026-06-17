# Implementation Tasks: terms-negotiation

> **Phase-1 data change.** Fulfill the `TermsTabs` contract with two additive, optional `Application` columns
> (`proposedBudget Int?`, `proposedDeadlineDays Int?`), an `applyToGig` input, a contract-typed `getTermsTabs` helper
> (both tabs), and an **accept-with-terms** reconciliation in `acceptApplication`. Additive; **no UI wiring** (Phase 2
> binds it), no propose-terms form field, no multi-round counter, no lifecycle/reject change, **no `resetTestDatabase`
> change** (columns on the existing `Application` table — no new model). Mirror `app/actions/gig.ts` (createGig
> kopecks/fee + acceptApplication transaction) + `lib/reviews.ts`/`lib/profiles.ts`. Friction: medium.

---

## Task 1: [x] Schema fields + regenerate client

**Implementation Notes:**
- In `prisma/schema.prisma` `Application`, add (near `estimatedEffort`): `proposedBudget Int?` and
  `proposedDeadlineDays Int?`. **Additive, nullable** — existing rows → `null` (no back-fill). `proposedBudget` is in
  **kopecks** (matching `Gig.budget`).
- Run `npx prisma generate`. `prisma db push` adds the nullable columns safely.

**Test Plan:**
```bash
grep -qE 'proposedBudget +Int\?' prisma/schema.prisma && grep -qE 'proposedDeadlineDays +Int\?' prisma/schema.prisma && echo "OK fields (nullable)"
npx prisma generate 2>&1 | tail -1
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK deletions" || echo "OK additive"
```
Expected: two nullable columns on `Application`; additive; client regenerated.

---

## Task 2: [x] `lib/terms.ts` — `getTermsTabs` (contract-typed, both tabs)

**Implementation Notes:**
- Create `lib/terms.ts` (server-only):
  ```ts
  import { prisma } from '@/lib/prisma'
  import type { TermsTabsVM, TermRow } from '@/app/components/blocks/view-models'

  // kopecks → "300 400 ₽" (matches the UI's formatRoubles + " ₽" and the TermsTabs fixture)
  const money = (kopecks: number): string => `${new Intl.NumberFormat('ru-RU').format(kopecks / 100)} ₽`
  const days = (n: number): string => `${n} дней`

  export async function getTermsTabs(applicationId: string): Promise<TermsTabsVM | null> {
    const app = await prisma.application.findUnique({ where: { id: applicationId }, include: { gig: true } })
    if (!app || !app.gig) return null
    const g = app.gig
    const client: TermRow[] = [
      { label: 'Бюджет', value: money(g.budget) },
      { label: 'Срок', value: days(g.deadlineDays) },
    ]
    const proposed: TermRow[] = [
      { label: 'Бюджет', value: money(app.proposedBudget ?? g.budget) },
      { label: 'Срок', value: days(app.proposedDeadlineDays ?? g.deadlineDays) },
    ]
    return { proposed, client }
  }
  ```
  `import type` (erased at build) makes the return compile-time-checked against `TermsTabsVM`; no runtime UI coupling.
  An un-countered application → `proposed` equals `client` (the `?? gig` fallback).

**Test Plan:**
```bash
test -f lib/terms.ts && grep -qE 'import type .*TermsTabsVM' lib/terms.ts && echo "contract-typed"
grep -qE 'getTermsTabs' lib/terms.ts && grep -qE "'Бюджет'|'Срок'" lib/terms.ts && echo "both Бюджет + Срок rows"
```
Expected: `lib/terms.ts` with contract-typed `getTermsTabs` returning both tabs (Бюджет + Срок).

---

## Task 3: [x] `applyToGig` accepts + validates optional proposed terms

**Implementation Notes:**
- In `app/actions/gig.ts` `applyToGig` (after the existing approach/questions/effort validation, before building
  `applicationData`):
  ```ts
  // Optional proposed terms (TermsTabs "Предложено"). Budget in roubles → kopecks; absent → null.
  let proposedBudget: number | null = null
  const pbRaw = formData.get('proposedBudget') as string | null
  if (pbRaw != null && pbRaw !== '') {
    const r = Number(pbRaw)
    if (!Number.isFinite(r) || r <= 0) return { error: 'Proposed budget must be a positive number in roubles.' }
    proposedBudget = Math.round(r * 100)
  }
  let proposedDeadlineDays: number | null = null
  const pdRaw = formData.get('proposedDeadlineDays') as string | null
  if (pdRaw != null && pdRaw !== '') {
    const n = Number(pdRaw)
    if (!Number.isInteger(n) || n < 1 || n > 365) return { error: 'Proposed срок must be a whole number of days between 1 and 365.' }
    proposedDeadlineDays = n
  }
  ```
  Add `proposedBudget` and `proposedDeadlineDays` to `applicationData`. Keep optional — absent → `null` (existing
  callers/tests unaffected).

**Test Plan:**
```bash
grep -qE "formData.get\('proposedBudget'\)" app/actions/gig.ts && grep -qE "formData.get\('proposedDeadlineDays'\)" app/actions/gig.ts && echo "reads proposed terms"
grep -qE 'proposedBudget,|proposedBudget:' app/actions/gig.ts && echo "added to applicationData"
```
Expected: applyToGig accepts/validates both (positive→kopecks / 1–365); absent → null; added to the created application.

---

## Task 4: [x] `acceptApplication` accept-with-terms reconciliation

**Implementation Notes:**
- In `app/actions/gig.ts` `acceptApplication`, the existing `findUnique({ where: { id }, include: { gig: true } })`
  already returns `application.proposedBudget`/`proposedDeadlineDays` (scalar columns).
- Build the gig update data conditionally and use it in the existing `$transaction` `prisma.gig.update`:
  ```ts
  const gigTerms: { budget?: number; serviceFee?: number; totalAmount?: number; deadlineDays?: number } = {}
  if (application.proposedBudget != null) {
    const budget = application.proposedBudget
    gigTerms.budget = budget
    gigTerms.serviceFee = Math.floor(budget * 0.10) // same rule as createGig
    gigTerms.totalAmount = budget + gigTerms.serviceFee
  }
  if (application.proposedDeadlineDays != null) {
    gigTerms.deadlineDays = application.proposedDeadlineDays
  }
  ```
  In the transaction's `prisma.gig.update`, spread `...gigTerms` alongside the existing
  `{ status: 'IN_PROGRESS', assignedSpecialistId: application.specialistId }`. **Preserve** the application update,
  the auto-reject `updateMany`, and both notification calls exactly as they are.
- **Backward-compatible:** when both proposed fields are `null`, `gigTerms` is empty → the gig update is unchanged.

**Test Plan:**
```bash
grep -qE 'application.proposedBudget' app/actions/gig.ts && grep -qE 'Math.floor\(budget \* 0.10\)|Math.floor\(.*0\.10\)' app/actions/gig.ts && echo "reconciles budget + fee"
grep -qE 'assignedSpecialistId: application.specialistId' app/actions/gig.ts && echo "existing accept behavior preserved"
```
Expected: accept applies proposed budget/fee/total + deadline when present; no-proposal accept unchanged; lifecycle/auto-reject/notifications preserved.

---

## Task 5: [x] Seed sample proposals (idempotent)

**Implementation Notes:**
- In `prisma/seed.ts` (a post-pass after applications are seeded): query a few PENDING applications still at the
  default (`where: { status: 'PENDING', proposedBudget: null }`, `take: 3`), and for each `prisma.application.update`
  a `proposedBudget` (e.g. the gig's budget + 10–20%) and `proposedDeadlineDays` (e.g. gig.deadlineDays + a few days,
  clamped 1–365). Fetch each application's gig to base the proposal on real terms. Idempotent (only updates the
  still-null ones).

**Test Plan:**
```bash
grep -qiE 'proposedBudget|proposedDeadlineDays' prisma/seed.ts && echo "seed sets sample proposals"
```
Expected: a few seeded PENDING applications get realistic proposed terms; idempotent on re-run.

---

## Task 6: [x] Integration tests

**Implementation Notes:**
- Add `__tests__/integration/terms-negotiation.test.ts` (mock `@/lib/prisma`, `next/headers`, `next/navigation`;
  `createTestUser`/`createTestGig`; `withAuthContext`; import actions/helpers after mocks — mirror
  `category-taxonomy.test.ts`). An `applyForm()` helper builds a valid application formData (gigId, approach ≥100,
  questions ≥50) + optional `proposedBudget`/`proposedDeadlineDays`. Cover:
  - **propose:** `applyToGig` with `proposedBudget=350000`, `proposedDeadlineDays=20` → the created application has
    `proposedBudget=35000000` (kopecks) and `proposedDeadlineDays=20`; without → both `null`.
  - **validation:** invalid `proposedBudget` (0, -5, 'abc') and `proposedDeadlineDays` (0, 400, 'x') → `{ error }`, no
    application.
  - **both-tabs / contract:** create a gig (`budget`, `deadlineDays`) + an application with proposed terms;
    `getTermsTabs(appId)` → `proposed`/`client` each have Бюджет + Срок rows; `proposed` reflects the counter, `client`
    reflects the gig; a compile-time `const _c: TermsTabsVM = (await getTermsTabs(appId))!`; an un-countered
    application → `proposed` deep-equals `client`.
  - **accept-with-terms:** a CLIENT accepts an application with `proposedBudget`/`proposedDeadlineDays` → the gig's
    `budget`/`deadlineDays` update to the proposed values, `serviceFee === Math.floor(budget*0.10)`,
    `totalAmount === budget + serviceFee`; gig `status === 'IN_PROGRESS'`; a second PENDING application is `REJECTED`.
  - **preserve accept/reject:** accept an application with **no** proposed terms → gig `budget`/`deadlineDays`
    unchanged, status `IN_PROGRESS` (normal accept); `rejectApplication` on a PENDING application → `REJECTED`, gig
    stays `OPEN`.
- Create gigs via `createTestGig({ budget, deadlineDays, ... })`; create applications via the test client or
  `applyToGig`. Use `await expect(applyToGig(...)).rejects.toThrow('NEXT_REDIRECT')` for the success path (it
  redirects), and read the created application by `gigId`/`specialistId`.

**Test Plan:**
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/terms-negotiation.test.ts 2>&1 | tail -12
```
Expected: propose, validation, both-tabs/contract, accept-with-terms, preserved accept/reject — all pass.

---

## Task 7: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec Test Plan (schema, helper, applyToGig input, accept reconciliation,
  tests, seed, typecheck, build, full suite clean DB, lints).
- Confirm scope: additive; no UI/screen/component changes (`app/components`, `app/workbench`, `app/(protected)`,
  the apply/gig-detail forms untouched); `view-models.ts` unchanged; no lifecycle/reject change; no
  `resetTestDatabase` change; the `gig-creation`/`gig-lifecycle`/application tests still green.

**Test Plan:**
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/terms|app/actions/gig|terms-negotiation.test" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff --quiet app/components/blocks/view-models.ts && echo "view-models SSOT unchanged"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/\(protected\)/' && echo "CHECK UI modified" || echo "OK no UI changes"
```
Expected: all gates green; additive; no UI changes; application/lifecycle tests unaffected.

---

## Summary

Total tasks: 7
Estimated effort: 4–6 hours (friction: medium — two additive columns + an applyToGig input + a helper + the accept reconciliation + seed + tests; no new table/relation/domain, no reset change)

**Deliverables:**
- ✅ `Application.proposedBudget Int?` + `Application.proposedDeadlineDays Int?`; client regenerated.
- ✅ `lib/terms.ts` — contract-typed `getTermsTabs` returning both tabs (Бюджет + Срок), proposed falling back to client terms.
- ✅ `applyToGig` accepts + validates optional proposed terms (budget→kopecks / deadline 1–365); `acceptApplication` reconciles them onto the gig.
- ✅ Idempotent seed of sample proposals; `terms-negotiation.test.ts` (propose/both-tabs/accept-with-terms/preserved/validation).

**Critical path:** schema (1) → helper (2) → applyToGig input (3) → accept reconciliation (4) → seed (5) → tests (6) → acceptance (7).

**Scope guards (non-goals):**
- No UI wiring / propose-terms form field (Phase 2); no multi-round counter-offer; no stage-count negotiation; no lifecycle/reject change; no `resetTestDatabase` change; no other-domain changes.

**Success criteria:**
- ✅ Additive nullable proposed-terms columns; `applyToGig` accepts + validates them; existing applications → `null`
- ✅ `getTermsTabs` matches `TermsTabsVM` (both tabs, Бюджет + Срок); `acceptApplication` reconciles terms + preserves lifecycle/reject
- ✅ `build` + `test:unit` (clean DB) + lints green; no UI changes; application/lifecycle tests unaffected
