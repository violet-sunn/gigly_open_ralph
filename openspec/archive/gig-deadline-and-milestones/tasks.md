# Implementation Tasks: gig-deadline-and-milestones

> **Phase-1 data change (lightest yet).** Fulfill the `GigCard`/`GigHeader` deadline + stages contract with two
> additive `Gig` columns — `deadlineDays Int @default(0)` ("Срок выполнения N дней") and `stageCount Int @default(1)`
> ("[N этап]") — create inputs, backward-compatible defaults, seed, and tests. No new table/relation/domain, no
> FK-safe-reset change, **no UI wiring** (Phase 2 binds it), no `Milestone` table, no create-gig form field. Mirror
> the `createGig` category work. Friction: medium.

---

## Task 1: [x] Schema fields + regenerate client

**Implementation Notes:**
- In `prisma/schema.prisma` `Gig`, add: `deadlineDays Int @default(0)` and `stageCount Int @default(1)` (place near
  the other scalar fields, e.g. after `budget`/`totalAmount` or `tags`). **Additive** — change no existing column.
- Run `npx prisma generate`. `@default(...)` makes the migration safe (existing rows get 0 / 1 via `prisma db push`).

**Test Plan:**
```bash
grep -qE 'deadlineDays +Int +@default\(0\)' prisma/schema.prisma && grep -qE 'stageCount +Int +@default\(1\)' prisma/schema.prisma && echo "OK fields + defaults"
npx prisma generate 2>&1 | tail -1
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK deletions" || echo "OK additive"
```
Expected: both fields with defaults; additive; client regenerated.

---

## Task 2: [x] `createGig` accepts + validates deadline + stage count

**Implementation Notes:**
- In `app/actions/gig.ts` `createGig` (after the budget block, near the category validation added earlier):
  ```ts
  let deadlineDays = 0
  const deadlineRaw = formData.get('deadlineDays') as string | null
  if (deadlineRaw != null && deadlineRaw !== '') {
    const n = Number(deadlineRaw)
    if (!Number.isInteger(n) || n < 1 || n > 365) return { error: 'Срок выполнения must be a whole number of days between 1 and 365.' }
    deadlineDays = n
  }
  let stageCount = 1
  const stageRaw = formData.get('stageCount') as string | null
  if (stageRaw != null && stageRaw !== '') {
    const n = Number(stageRaw)
    if (!Number.isInteger(n) || n < 1 || n > 50) return { error: 'Number of stages (этапы) must be a whole number between 1 and 50.' }
    stageCount = n
  }
  ```
  Add `deadlineDays` and `stageCount` to `gigData`. Keep optional — absent → 0 / 1 (existing callers/tests unaffected).

**Test Plan:**
```bash
grep -qE "formData.get\('deadlineDays'\)" app/actions/gig.ts && grep -qE "formData.get\('stageCount'\)" app/actions/gig.ts && echo "reads both"
grep -qE 'deadlineDays,\s*$|deadlineDays,|stageCount,' app/actions/gig.ts && echo "added to gigData"
```
Expected: createGig accepts/validates both (1–365 / 1–50); absent → defaults; added to the created gig.

---

## Task 3: [x] Seed assigns deadline + stage count (idempotent)

**Implementation Notes:**
- In `prisma/seed.ts` (near the categories/reviews blocks): after gigs exist, set `deadlineDays`/`stageCount` for
  gigs still at the defaults — e.g. query gigs `where: { deadlineDays: 0 }`, update each with a realistic deadline
  (e.g. `7 + (index % 24)` → 7–30 days) and `stageCount` (e.g. `1 + (index % 4)` → 1–4). Idempotent (only updates
  the still-default ones). Example gigs created via `upsert` MAY also set the fields inline in their `create` data.

**Test Plan:**
```bash
grep -qiE 'deadlineDays|stageCount' prisma/seed.ts && echo "seed assigns deadline/stages"
```
Expected: seeded gigs get realistic deadline/stage values; idempotent on re-run.

---

## Task 4: [x] Integration tests

**Implementation Notes:**
- Add `__tests__/integration/gig-deadline-milestones.test.ts` (mock `@/lib/prisma`, `next/headers`,
  `next/navigation`; `createTestUser`/`createTestGig`; `withAuthContext`). A `gigForm()` helper builds valid create
  formData (title/description/acceptanceCriteria ≥50/budget) + optional `deadlineDays`/`stageCount`. Cover:
  - **create with values:** `createGig` with `deadlineDays=14`, `stageCount=3` → created gig has `deadlineDays=14`,
    `stageCount=3` (query the latest gig by `clientId`).
  - **create without values:** → `deadlineDays=0`, `stageCount=1` (defaults, backward-compatible).
  - **validation:** invalid `deadlineDays` (0, -1, 400, 'abc') and `stageCount` (0, 100, 'x') → `{ error }`, no gig.
  - **legacy graceful:** a gig created via `createTestGig` (no deadline/stage) → `deadlineDays=0`, `stageCount=1`
    (schema defaults), queryable.
  - **contract match:** `typeof gig.deadlineDays === 'number'` and a compile-time `const _c: GigCardVM['deadlineDays'] = gig.deadlineDays`
    (import type `GigCardVM`); `gig.stageCount` is a positive integer.

**Test Plan:**
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/gig-deadline-milestones.test.ts 2>&1 | tail -10
```
Expected: create (with/without), validation, legacy defaults, contract match — all pass.

---

## Task 5: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec Test Plan (schema, createGig inputs, tests, seed, typecheck, build,
  full suite clean DB, lints).
- Confirm scope: additive; no UI/screen/component changes; no `Milestone` table; no create-gig form change; no other
  field/flow change; the `gig-creation.test.ts` 40 tests still green.

**Test Plan:**
```bash
npx tsc --noEmit 2>&1 | grep -E "app/actions/gig.ts|gig-deadline-milestones" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "token baseline unchanged"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/dashboard/gigs/new/' && echo "CHECK UI modified" || echo "OK no UI changes"
```
Expected: all gates green; additive; no UI changes; `gig-creation` tests unaffected.

---

## Summary

Total tasks: 5
Estimated effort: 3–5 hours (friction: medium — two additive columns + createGig inputs + seed + tests; no new table/relation/domain)

**Deliverables:**
- ✅ `Gig.deadlineDays Int @default(0)` + `Gig.stageCount Int @default(1)`; client regenerated.
- ✅ `createGig` accepts + validates optional `deadlineDays` (1–365) and `stageCount` (1–50); absent → defaults.
- ✅ Idempotent seed assignment; `__tests__/integration/gig-deadline-milestones.test.ts` (create/validation/legacy/contract).

**Critical path:** schema (1) → createGig inputs (2) → seed (3) → tests (4) → acceptance (5).

**Scope guards (non-goals):**
- No UI wiring / create-gig form field (Phase 2); no `Milestone` table / stage-level tracking; no gig-editing; no other field/flow change.

**Success criteria:**
- ✅ `deadlineDays`/`stageCount` additive with defaults; createGig accepts + validates; legacy gigs graceful (0 / 1)
- ✅ Fields match the contract (`deadlineDays` → number; `stageCount` → "[N этап]")
- ✅ `build` + `test:unit` (clean DB) + lints green; no UI changes; `gig-creation` tests unaffected
