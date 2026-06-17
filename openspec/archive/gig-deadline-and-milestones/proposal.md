# Change Proposal: gig-deadline-and-milestones

> Phase 1, change 12 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> fulfills the `GigCard` / `GigHeader` deadline + stages contract (`docs/DESIGN_SYSTEM_SPEC.md` §5 /
> `GigCardVM.deadlineDays`) with two additive `Gig` fields — `deadlineDays` ("Срок выполнения N дней") and
> `stageCount` ("[N этап]") — plus create inputs, backward-compatible defaults, and seed data. Additive; **no UI
> wiring** (Phase 2 binds the fields into GigCard/GigHeader).

## Problem Statement

`GigCardVM` declares `deadlineDays: number` (rendered as "Срок выполнения N дней" / "14 дней"), and the GigHeader
shows a stage count "[N этап]" — both rendered today **from fixtures**. There is no real data:

- The `Gig` model has **no deadline** and **no stage/«этапы» count** — gigs carry budget, status, and free-text
  fields only, so a card/header can't show the timeline or stage information the design requires.
- Phase-2 screens (GigCard·grid, specialist-gig GigHeader) have **nothing to bind** for the deadline/stages — they'd
  stay mocked.

The planning doc's Phase-1 worklist maps this exactly: `Gig.deadlineDays` + milestones/«этапы» that *fulfill* the
GigCard/GigHeader contract. This change is additive and decoupled from the UI (the blocks already type/render the
shape).

## Proposed Solution

Add two additive `Gig` columns with backward-compatible defaults, accept them on create (validated), seed them, and
verify. Four deliverable groups:

1. **`Gig.deadlineDays` + `Gig.stageCount`** — `deadlineDays Int @default(0)` (0 = unspecified — the
   backward-compatible default for legacy gigs; rendered gracefully) and `stageCount Int @default(1)` (every gig has
   at least one stage). **Additive** (new columns only); `npx prisma generate` regenerates the client.

2. **Create inputs** — `createGig` accepts optional `deadlineDays` and `stageCount` form fields, validates them
   (deadlineDays a positive integer ≤ 365; stageCount an integer 1–50), and persists them; absent → the defaults
   (0 / 1). (`edit` is N/A — gig editing is not implemented; when added it will accept the same fields.)

3. **Stage count, not a milestone table** — the contract requires only a **count** ("[N этап]"); a single
   `stageCount` integer fulfils GigCard/GigHeader. A richer per-stage `Milestone` model (titles/statuses) is **not**
   needed by any defined block/screen and is deferred as a future additive change if stage-level tracking is ever
   required. (The task explicitly permits "milestone model **or** stageCount".)

4. **Seed + verification** — `prisma/seed.ts` assigns realistic `deadlineDays`/`stageCount` to seeded gigs
   (idempotent). `__tests__/integration/gig-deadline-milestones.test.ts` covers create (with/without the fields),
   validation, legacy-graceful defaults, and the contract match.

This change emits **two `Gig` columns + `createGig` inputs + seed + tests only**. It does **not** wire deadline/
stages into any screen/component (Phase 2 binds GigCard/GigHeader), add a `Milestone` table or stage-level tracking,
add a create-gig form field (Phase 2), or change any other field/flow. The blocks already render the shape — this
change makes the data real.

## Constraints

### MUST Requirements
- `Gig` MUST gain `deadlineDays Int @default(0)` and `stageCount Int @default(1)` — **additive** (no existing
  column changed); the client MUST be regenerated.
- `createGig` MUST accept optional `deadlineDays` (validated: positive integer ≤ 365) and `stageCount` (validated:
  integer 1–50), persisting them; absent → the defaults (0 / 1); invalid → a clear error.
- Legacy gigs (and gigs created without the fields) MUST migrate/persist to the defaults (`deadlineDays = 0`,
  `stageCount = 1`) and remain queryable — **backward-compatible, no data loss, no break**.
- The fields MUST match the contract: `deadlineDays` is a number (= `GigCardVM.deadlineDays`) and `stageCount` is a
  positive integer (the "[N этап]" count); the seed MUST assign them idempotently.
- `npm run build` and `npm run test:unit` MUST stay green (additive); `npm run lint:tokens` + `npm run
  lint:composition` MUST stay green (no UI change).

### SHOULD Requirements
- `createGig` SHOULD mirror its existing validation style (clear `{ error }` messages) and keep the new fields
  **optional** so existing callers/tests are unaffected.
- `deadlineDays = 0` SHOULD be treated as "unspecified" (Phase-2 GigCard renders it gracefully — omit/"—"); the data
  layer just stores the number.
- Tests SHOULD assert the contract match against `GigCardVM` (e.g. `deadlineDays` is assignable to
  `GigCardVM['deadlineDays']`), following the prior data changes.

### Non-Goals
- **No UI wiring / create-gig form field.** Binding deadline/stages into GigCard/GigHeader and adding the form input
  is Phase 2 (`compose-gig-search`/`compose-gig-detail-apply`). The blocks already render the shape from fixtures.
- **No `Milestone` table / stage-level tracking** (titles, per-stage status) — a `stageCount` integer fulfils the
  contract; richer tracking is a future additive change if a screen needs it.
- **No gig-editing** (not implemented); **no change to budget/tags/lifecycle or any other field**.

## Success Criteria

1. `Gig.deadlineDays` (default 0) + `Gig.stageCount` (default 1) exist; additive; client regenerated.
2. `createGig` accepts + validates optional `deadlineDays`/`stageCount`; absent → defaults; invalid → error.
3. Legacy/no-input gigs are graceful (defaults applied, queryable); fields match the contract (number / "[N этап]").
4. Seed assigns the fields idempotently; tests cover create/display/legacy/contract.
5. `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; no UI changes; `gig-creation` tests unaffected.

## Affected Areas

- `prisma/schema.prisma` (`Gig.deadlineDays Int @default(0)`, `Gig.stageCount Int @default(1)`) → `npx prisma generate`
- `app/actions/gig.ts` (`createGig` — optional, validated `deadlineDays`/`stageCount`)
- `prisma/seed.ts` (assign `deadlineDays`/`stageCount` to seeded gigs, idempotent)
- `__tests__/integration/gig-deadline-milestones.test.ts` (new — create/validation/legacy/contract)
- read-only inputs: `app/components/blocks/view-models.ts` (`GigCardVM.deadlineDays`), `app/actions/gig.ts` (createGig pattern), `__tests__/helpers/*`
- `openspec/specs/gig/spec.md` (spec delta — ADDED requirements to the existing gig domain)
- (NOT modified: any UI/component/screen file; other `Gig` fields; the gig lifecycle; other domains)

## Risks & Mitigations

**Risk**: `GigCardVM.deadlineDays` is a required `number`, but legacy gigs have no deadline.
**Mitigation**: `deadlineDays Int @default(0)` — always a number (matches the required field); `0` is the
"unspecified" sentinel for legacy gigs, rendered gracefully by Phase-2 GigCard. No nullable mapping needed.

**Risk**: Modifying `createGig` breaks the 40 `gig-creation.test.ts` tests.
**Mitigation**: Both fields are **optional** — absent → defaults (0 / 1), existing behaviour unchanged; only new
validation branches fire when the fields are supplied. Verify the full suite stays green.

**Risk**: Choosing `stageCount` under-serves a future stage-breakdown screen.
**Mitigation**: No defined block/screen needs per-stage data (the contract is a count, "[N этап]"); a `Milestone`
table is a clean future additive change if required. Documented as a non-goal.

**Risk**: Two new non-null-with-default columns on a populated dev DB.
**Mitigation**: `@default(...)` makes the migration safe (existing rows get 0 / 1 via `prisma db push`); no
back-fill, no data loss. The test DB is rebuilt from the schema.
