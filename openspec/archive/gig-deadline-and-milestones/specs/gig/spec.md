# Gig Specification Delta: gig-deadline-and-milestones

This document contains specification changes for the `gig-deadline-and-milestones` change — a Phase-1 **data** change
that extends the existing `gig` domain. It fulfills the `GigCard` / `GigHeader` deadline + stages contract
(`docs/DESIGN_SYSTEM_SPEC.md` §5 / `GigCardVM.deadlineDays`) with two additive `Gig` fields — `deadlineDays`
("Срок выполнения N дней") and `stageCount` ("[N этап]") — create inputs, and backward-compatible defaults. It ships
**two columns + createGig inputs + seed + tests only** — additive, with **no UI wiring** (Phase 2 binds the fields),
no `Milestone` table, and no change to any other field or flow.

---

## ADDED Requirements

### Requirement: Gig Deadline and Stage-Count Fields
The `Gig` model MUST gain `deadlineDays` (Int, default 0) and `stageCount` (Int, default 1), additively, fulfilling
the GigCard/GigHeader deadline + "[N этап]" contract.

#### Scenario: Fields exist with backward-compatible defaults
- GIVEN the schema
- WHEN the `Gig` model is inspected
- THEN it MUST have `deadlineDays Int @default(0)` (0 = unspecified) and `stageCount Int @default(1)`
- AND only these columns are added (no existing column changed); `npx prisma generate` MUST be run

#### Scenario: Fields match the contract types
- GIVEN `GigCardVM.deadlineDays: number` and the "[N этап]" stage count
- WHEN a gig is read
- THEN `gig.deadlineDays` MUST be a number (assignable to `GigCardVM['deadlineDays']`) and `gig.stageCount` MUST be a
  positive integer (the stage count)

**Acceptance Criteria:**
- `Gig.deadlineDays Int @default(0)` + `Gig.stageCount Int @default(1)`; additive; client regenerated
- Field types match the contract (`deadlineDays` → number; `stageCount` → the "[N этап]" count)

---

### Requirement: Create Inputs for Deadline and Stages
`createGig` MUST accept optional, validated `deadlineDays` and `stageCount` inputs and persist them; absent inputs
MUST fall back to the defaults.

#### Scenario: createGig accepts valid deadline and stage count
- GIVEN an authenticated client calling `createGig`
- WHEN `deadlineDays` (a positive integer ≤ 365) and/or `stageCount` (an integer 1–50) are supplied
- THEN the created gig MUST persist those values

#### Scenario: createGig rejects invalid values
- GIVEN `createGig`
- WHEN `deadlineDays` is non-positive / non-integer / > 365, or `stageCount` is < 1 / non-integer / > 50
- THEN it MUST be rejected with a clear error and the gig MUST NOT be created

#### Scenario: Inputs are optional (backward-compatible)
- GIVEN `createGig` called without `deadlineDays`/`stageCount` (the existing behaviour)
- WHEN the gig is created
- THEN it MUST succeed unchanged with `deadlineDays = 0` and `stageCount = 1` (the defaults)

**Acceptance Criteria:**
- `createGig` accepts + validates optional `deadlineDays` (1–365) and `stageCount` (1–50); persists them
- Absent → defaults (0 / 1); invalid → error; existing callers/tests unaffected

---

### Requirement: Backward-Compatible Defaults and Verification
Legacy gigs MUST remain graceful under the new fields, and the change MUST be additive with the suite green.

#### Scenario: Legacy gigs are graceful
- GIVEN a gig created without the new fields (e.g. directly, or before this change)
- WHEN it is read
- THEN `deadlineDays` MUST be `0` and `stageCount` MUST be `1` (the defaults), and the gig MUST remain queryable with
  no error — Phase-2 GigCard renders `deadlineDays = 0` gracefully (omit/"—")

#### Scenario: Seed assigns the fields idempotently
- GIVEN `prisma/seed.ts`
- WHEN it runs (or re-runs)
- THEN it MUST assign realistic `deadlineDays`/`stageCount` to seeded gigs without duplicating on re-run

#### Scenario: Additive — suite green, no UI change
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with no change to other fields/flows (incl. the `gig-creation` tests), and `npm run
  lint:tokens` + `npm run lint:composition` MUST stay green (no UI change)

**Acceptance Criteria:**
- Legacy/no-input gigs default to `0` / `1` and stay queryable; seed assigns idempotently
- `npm run build` + `npm run test:unit` green; additive; no UI changes

---

## Test Plan

This change ships two columns + createGig inputs + seed + tests. Validation is by deterministic commands. Commands
assume the repo root.

### Schema + client
```bash
grep -qE 'deadlineDays +Int' prisma/schema.prisma && grep -qE 'stageCount +Int' prisma/schema.prisma && echo "fields present with defaults"
npx prisma generate >/dev/null 2>&1 && echo "client regenerated"
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK schema deletions" || echo "OK schema additive"
```

### createGig inputs
```bash
grep -qE "formData.get\('deadlineDays'\)|deadlineDays" app/actions/gig.ts && grep -qE "stageCount" app/actions/gig.ts && echo "createGig reads deadline + stages"
```

### Tests (create / validation / legacy / contract)
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/gig-deadline-milestones.test.ts 2>&1 | tail -10
```

### Seed (idempotent)
```bash
grep -qiE 'deadlineDays|stageCount' prisma/seed.ts && echo "seed assigns the fields"
```

### Typecheck + build + suite + scope (additive, no UI change)
```bash
npx tsc --noEmit 2>&1 | grep -E "app/actions/gig.ts|gig-deadline-milestones.test" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green (no UI change)"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/dashboard/gigs/new/' && echo "CHECK UI modified" || echo "OK no UI changes"
```

### Manual review
1. Confirm `deadlineDays`/`stageCount` are additive with defaults `0`/`1`, client regenerated.
2. Confirm `createGig` accepts + validates the optional fields (rejects out-of-range); absent → defaults (existing tests green).
3. Confirm legacy gigs default gracefully and the field types match `GigCardVM` (number / count); no screen wired yet (Phase 2).
