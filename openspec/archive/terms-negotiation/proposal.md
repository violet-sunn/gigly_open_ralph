# Change Proposal: terms-negotiation

> Phase 1, change 14 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> fulfills the `TermsTabs` view-model contract (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `TermsTabsVM { proposed, client }`)
> with two additive, optional `Application` fields — `proposedBudget` and `proposedDeadlineDays` — a contract-typed
> `getTermsTabs` helper exposing both tabs, and an **accept-with-terms** extension to `acceptApplication` that applies
> the agreed proposal to the gig. Additive; the existing accept/reject flow and gig lifecycle are preserved. **No UI
> wiring** (Phase 2 binds `TermsTabs` into the gig-detail screen).

## Problem Statement

`TermsTabsVM` declares `proposed: TermRow[]` and `client: TermRow[]` (rendered by the `TermsTabs` block as two tabs —
"Предложено" / "От заказчика" — each a list of `{ label, value }` rows). The library fixture
(`app/components/blocks/fixtures.ts`) shows the two negotiable terms: **Бюджет** ("300 400 ₽" proposed vs "280 000 ₽"
client) and **Срок** ("14 дней" vs "10 дней"). Today this renders **from a fixture**. There is no real data:

- A specialist's `Application` carries `approach`/`questions`/`estimatedEffort` only — there is **no proposed budget
  or timeline**, so a specialist cannot counter the gig's terms and the "Предложено" tab has nothing real to bind.
- The gig's terms (`budget`, `deadlineDays`) are the "От заказчика" side, but nothing pairs them with a proposal into
  the `{ proposed, client }` shape the block needs.
- `acceptApplication` transitions the gig to `IN_PROGRESS` and assigns the specialist, but **never reconciles the
  agreed terms** onto the gig — so even if a proposal existed, accepting it would not update the gig's budget/deadline.

The planning doc's Phase-1 worklist maps this exactly: application proposed-terms vs client terms, both-tabs data, and
accept-with-terms updating the gig — *fulfilling* the `TermsTabs` contract. This change is additive and decoupled from
the UI (the block already types/renders the `{ proposed, client }` shape).

## Proposed Solution

Add two additive, optional `Application` columns, accept them on apply (validated), expose both tabs via a
contract-typed helper, apply the agreed proposal to the gig on accept, seed sample proposals, and verify. Five
deliverable groups:

1. **`Application.proposedBudget` + `Application.proposedDeadlineDays` (additive, optional)** — `proposedBudget Int?`
   (kopecks, matching `Gig.budget`'s unit; `null` = no counter → the gig's budget stands) and `proposedDeadlineDays
   Int?` (`null` = no counter → the gig's `deadlineDays` stands). **Additive** (new nullable columns only — existing
   applications migrate to `null`, no back-fill); `npx prisma generate` regenerates the client.

2. **`applyToGig` accepts the proposal** — `applyToGig` reads optional `proposedBudget` (in roubles → kopecks, like
   `createGig`) and `proposedDeadlineDays`, validates them (budget a positive number; deadline a whole number 1–365),
   and persists them; absent → `null`. The existing application validation (approach/questions/effort) is unchanged.

3. **`getTermsTabs` helper (fulfills the contract, both tabs)** — `lib/terms.ts` `getTermsTabs(applicationId)` returns
   `TermsTabsVM` — `client` = `[{ label: 'Бюджет', value: «gig.budget ₽» }, { label: 'Срок', value: 'N дней' }]`;
   `proposed` = the same two rows using `proposedBudget ?? gig.budget` and `proposedDeadlineDays ?? gig.deadlineDays`
   (so a specialist who didn't counter shows the client's terms). Server-only; `TermsTabsVM`/`TermRow` imported
   `import type` (no runtime UI coupling), mirroring `lib/reviews.ts`/`lib/categories.ts`/`lib/profiles.ts`.

4. **Accept-with-terms** — `acceptApplication` is extended so that, **within its existing transaction**, when the
   accepted application carries proposed terms it reconciles them onto the gig: `budget = proposedBudget` (with
   `serviceFee`/`totalAmount` recalculated at the documented 10%) and/or `deadlineDays = proposedDeadlineDays`. Every
   existing behaviour is preserved — `OPEN → IN_PROGRESS`, assign the specialist, auto-reject other PENDING
   applications, notifications. An accepted application with **no** proposed terms changes the gig exactly as before.

5. **Seed + tests** — `prisma/seed.ts` sets `proposedBudget`/`proposedDeadlineDays` on a few seeded PENDING
   applications (idempotent: only when still `null`) so `TermsTabs` has real data to bind.
   `__tests__/integration/terms-negotiation.test.ts` covers propose, both-tabs/contract, accept-with-terms, the
   preserved accept/reject + lifecycle, and validation.

This change emits **two `Application` columns + an `applyToGig` input + a `getTermsTabs` helper + the accept-with-terms
reconciliation + seed + tests only**. It does **not** wire `TermsTabs` into any screen (Phase 2
`compose-gig-detail-apply`), add a propose-terms form field, add a multi-round client counter-offer, change the gig
**lifecycle transitions**, or touch any other field/flow. The block already renders the shape — this change makes the
data real.

## Constraints

### MUST Requirements
- `Application` MUST gain `proposedBudget Int?` and `proposedDeadlineDays Int?` — **additive** (new nullable columns,
  existing rows → `null`); the client MUST be regenerated.
- `applyToGig` MUST accept optional `proposedBudget` (validated: positive; stored in kopecks) and
  `proposedDeadlineDays` (validated: whole number 1–365), persisting them; absent → `null`; invalid → a clear error.
- `getTermsTabs(applicationId)` MUST return the `TermsTabsVM` shape — **both** `proposed` and `client` populated with
  `Бюджет` + `Срок` `TermRow`s — with `proposed` using `proposedBudget ?? gig.budget` and `proposedDeadlineDays ??
  gig.deadlineDays`; `TermsTabsVM`/`TermRow` imported `import type` (no runtime UI coupling).
- `acceptApplication` MUST, when the accepted application has proposed terms, reconcile them onto the gig
  (`budget`/`serviceFee`/`totalAmount` and/or `deadlineDays`) **within its existing transaction**, while preserving
  every existing behaviour (status transition, assignment, auto-reject, notifications).
- An accepted application with **no** proposed terms MUST leave the gig's terms unchanged (backward-compatible); the
  gig **lifecycle transitions** and `rejectApplication` MUST be unchanged.
- `npm run build` and `npm run test:unit` MUST stay green (additive); `npm run lint:tokens` + `npm run
  lint:composition` MUST stay green (no UI change).

### SHOULD Requirements
- The negotiable terms SHOULD be exactly **Бюджет** and **Срок** (the two `TermRow`s in the `TermsTabs` fixture);
  stage-count negotiation is out of scope (kept to the contract's two rows).
- `proposedBudget` SHOULD be stored in **kopecks** (matching `Gig.budget`) and accepted as roubles on input (like
  `createGig`); the fee recalculation on accept SHOULD use the documented 10% via the same `Math.floor(budget * 0.10)`
  rule as `createGig`.
- `getTermsTabs` SHOULD live in `lib/terms.ts` (a server data helper) with the view-model types imported `import
  type`, so Phase-2 `compose-gig-detail-apply` imports it from `@/lib/terms`.
- `proposedBudget`/`proposedDeadlineDays` SHOULD remain **optional** so existing `applyToGig`/`acceptApplication`
  callers and the 40 `gig-creation`/application tests are unaffected.

### Non-Goals
- **No UI wiring / propose-terms form field.** Binding `TermsTabs` into the gig-detail screen and adding the proposal
  inputs is Phase 2 (`compose-gig-detail-apply`). The block already renders the `{ proposed, client }` shape.
- **No multi-round counter-offer** (client counters the specialist's proposal back-and-forth) — the contract is a
  single `proposed`-vs-`client` view; a richer negotiation thread is a future additive change if a screen needs it.
- **No stage-count (этапы) negotiation** — the fixture's two rows are Бюджет + Срок; stages stay the gig's value.
- **No change to the gig lifecycle transitions**, `rejectApplication`, the service-fee model, or any other
  field/flow; no other-domain changes.

## Success Criteria

1. `Application.proposedBudget` + `proposedDeadlineDays` (both `Int?`) exist; additive; existing applications → `null`; client regenerated.
2. `applyToGig` accepts + validates optional proposed terms (budget → kopecks; deadline 1–365); absent → `null`; invalid → error.
3. `getTermsTabs` returns both tabs (Бюджет + Срок) in the `TermsTabsVM` shape; `proposed` falls back to the client's terms when not countered.
4. `acceptApplication` reconciles proposed terms onto the gig (budget/fee/total and/or deadline) within its transaction; with no proposal the gig terms are unchanged; the lifecycle + reject are preserved.
5. Seed sets sample proposals idempotently; `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; no UI changes; existing application/lifecycle tests unaffected.

## Affected Areas

- `prisma/schema.prisma` (`Application.proposedBudget Int?`, `Application.proposedDeadlineDays Int?`) → `npx prisma generate`
- `lib/terms.ts` (new — `getTermsTabs` contract-typed to `TermsTabsVM`)
- `app/actions/gig.ts` (`applyToGig` — optional, validated proposed terms; `acceptApplication` — accept-with-terms reconciliation)
- `prisma/seed.ts` (set proposed terms on a few seeded PENDING applications, idempotent)
- `__tests__/integration/terms-negotiation.test.ts` (new — propose / both-tabs / accept-with-terms / preserved accept-reject / validation)
- read-only inputs: `app/components/blocks/view-models.ts` (`TermsTabsVM`/`TermRow`), `app/components/blocks/fixtures.ts` (`termsTabsFixture`), `lib/utils/currency.ts`, `app/actions/gig.ts` (createGig fee/kopecks pattern)
- `openspec/specs/gig/spec.md` (spec delta — ADDED requirements to the existing `gig` domain, which owns applications/accept)
- (NOT modified: any UI/component/screen file; the gig lifecycle transitions; `rejectApplication`; `__tests__/helpers/db.ts` — no new table; other domains)

## Risks & Mitigations

**Risk**: Extending `acceptApplication` breaks the existing accept tests / application-management flow.
**Mitigation**: The reconciliation is **conditional** — it only adds gig fields to the update when the accepted
application has non-null proposed terms. Existing applications have `null` proposed terms → the gig update is exactly
`{ status, assignedSpecialistId }` as before. The transaction shape, auto-reject, and notifications are untouched.
Verify the full suite (incl. `gig-lifecycle`/application tests) stays green.

**Risk**: Budget unit confusion (roubles vs kopecks) corrupts the gig budget on accept.
**Mitigation**: `proposedBudget` is stored in **kopecks** at apply time (`applyToGig` converts roubles → kopecks like
`createGig`), so accept assigns kopecks directly to `Gig.budget` (also kopecks) and recalculates `serviceFee`/
`totalAmount` with the same `Math.floor(budget * 0.10)` rule. A test asserts the recalculated amounts.

**Risk**: `TermsTabsVM.proposed`/`client` are required arrays, but a legacy application has no proposal.
**Mitigation**: `getTermsTabs` always returns both arrays; `proposed` uses `proposedBudget ?? gig.budget` /
`proposedDeadlineDays ?? gig.deadlineDays`, so an un-countered application simply shows the client's terms on both
tabs — never an empty array. "Matches the contract" = the returned object is assignable to `TermsTabsVM`.

**Risk**: Two new columns on a populated dev Application table.
**Mitigation**: Both are **nullable** (`Int?`) — `prisma db push` adds them as `NULL` for existing rows; no back-fill,
no data loss. The test DB is rebuilt from the schema; no `resetTestDatabase` change is needed (no new table).

**Risk**: Coupling the data layer to the UI by referencing `TermsTabsVM`.
**Mitigation**: `import type` only (erased at build); the view-model is the SSOT for the shape; no runtime dependency
on the blocks/primitives tree — the established `lib/reviews.ts`/`lib/categories.ts`/`lib/profiles.ts` pattern.
