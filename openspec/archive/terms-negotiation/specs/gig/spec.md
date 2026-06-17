# Gig Specification Delta: terms-negotiation

This document contains specification changes for the `terms-negotiation` change — a Phase-1 **data** change that
extends the existing `gig` domain (which owns applications + accept/reject). It fulfills the `TermsTabs` view-model
contract (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `TermsTabsVM { proposed, client }`) with two additive, optional
`Application` fields (`proposedBudget`, `proposedDeadlineDays`), a contract-typed `getTermsTabs` helper exposing both
tabs, and an **accept-with-terms** extension to `acceptApplication`. It ships **two columns + an applyToGig input + a
helper + the accept reconciliation + seed + tests only** — additive, with **no UI wiring** (Phase 2 binds `TermsTabs`),
no propose-terms form field, no multi-round counter-offer, and no change to the gig lifecycle transitions or
`rejectApplication`.

---

## ADDED Requirements

### Requirement: Application Proposed-Terms Fields
The `Application` model MUST gain `proposedBudget` (Int?, kopecks) and `proposedDeadlineDays` (Int?), additively,
fulfilling the specialist side ("Предложено") of the `TermsTabs` contract.

#### Scenario: Fields exist as optional (backward-compatible)
- GIVEN the schema
- WHEN the `Application` model is inspected
- THEN it MUST have `proposedBudget Int?` and `proposedDeadlineDays Int?` (both nullable — `null` = no counter)
- AND only these columns are added (no existing column changed); existing applications migrate to `null`; `npx prisma
  generate` MUST be run

#### Scenario: Proposed budget is stored in kopecks
- GIVEN `Gig.budget` is stored in kopecks
- WHEN `proposedBudget` is persisted
- THEN it MUST be stored in the same unit (kopecks), so it can be assigned to `Gig.budget` directly on accept

**Acceptance Criteria:**
- `Application.proposedBudget Int?` + `Application.proposedDeadlineDays Int?`; additive; client regenerated
- Existing applications migrate to `null` (no back-fill, no data loss); `proposedBudget` in kopecks

---

### Requirement: applyToGig Accepts Proposed Terms
`applyToGig` MUST accept optional, validated `proposedBudget` and `proposedDeadlineDays` inputs and persist them;
absent inputs MUST fall back to `null`.

#### Scenario: applyToGig persists valid proposed terms
- GIVEN an authenticated specialist applying to an OPEN gig
- WHEN `proposedBudget` (a positive number of roubles) and/or `proposedDeadlineDays` (a whole number 1–365) are
  supplied
- THEN the created application MUST persist `proposedBudget` (converted roubles → kopecks) and/or `proposedDeadlineDays`

#### Scenario: applyToGig rejects invalid proposed terms
- GIVEN `applyToGig`
- WHEN `proposedBudget` is non-positive / non-numeric, or `proposedDeadlineDays` is < 1 / non-integer / > 365
- THEN it MUST be rejected with a clear error and no application created

#### Scenario: Proposed terms are optional (backward-compatible)
- GIVEN `applyToGig` called without proposed terms (the existing behaviour)
- WHEN the application is created
- THEN it MUST succeed unchanged with `proposedBudget = null` and `proposedDeadlineDays = null`; the existing
  approach/questions/effort validation is unchanged

**Acceptance Criteria:**
- `applyToGig` accepts + validates optional `proposedBudget` (positive → kopecks) and `proposedDeadlineDays` (1–365)
- Absent → `null`; invalid → error; existing application callers/tests unaffected

---

### Requirement: getTermsTabs Fulfils the TermsTabs Contract (both tabs)
`lib/terms.ts` MUST expose `getTermsTabs(applicationId)` returning the `TermsTabsVM` shape with **both** tabs
populated, server-only and contract-typed.

#### Scenario: Both tabs are returned with Бюджет and Срок rows
- GIVEN an application on a gig
- WHEN `getTermsTabs(applicationId)` is called
- THEN it MUST return `{ proposed, client }` where `client` = `[{ label: 'Бюджет', value: «gig.budget formatted ₽» },
  { label: 'Срок', value: 'N дней' }]` and `proposed` = the same two rows using `proposedBudget ?? gig.budget` and
  `proposedDeadlineDays ?? gig.deadlineDays`
- AND the result MUST be assignable to `TermsTabsVM` (types imported `import type` — no runtime UI coupling)

#### Scenario: An un-countered application shows the client's terms on both tabs
- GIVEN an application with `proposedBudget = null` and `proposedDeadlineDays = null`
- WHEN `getTermsTabs` is called
- THEN `proposed` MUST equal `client` (the fallback) — never an empty array

#### Scenario: A counter is reflected on the proposed tab
- GIVEN an application whose `proposedBudget`/`proposedDeadlineDays` differ from the gig's
- WHEN `getTermsTabs` is called
- THEN the `proposed` rows MUST reflect the proposed values and the `client` rows MUST reflect the gig's values

**Acceptance Criteria:**
- `getTermsTabs` returns both tabs (Бюджет + Срок) in the `TermsTabsVM` shape; `proposed` falls back to client terms when not countered
- Server-only; `TermsTabsVM`/`TermRow` imported `import type`

---

### Requirement: Accept-With-Terms Updates the Gig (lifecycle preserved)
`acceptApplication` MUST reconcile the accepted application's proposed terms onto the gig within its existing
transaction, while preserving every existing behaviour.

#### Scenario: Accepting an application with proposed terms updates the gig
- GIVEN a client accepting a PENDING application that has `proposedBudget` and/or `proposedDeadlineDays`
- WHEN `acceptApplication` runs
- THEN the gig MUST be updated with `budget = proposedBudget` (and `serviceFee`/`totalAmount` recalculated at 10% via
  `Math.floor(budget * 0.10)`) and/or `deadlineDays = proposedDeadlineDays`
- AND the gig MUST still transition `OPEN → IN_PROGRESS`, assign the specialist, auto-reject other PENDING
  applications, and send notifications (unchanged)

#### Scenario: Accepting an application with no proposed terms leaves the gig terms unchanged
- GIVEN a client accepting an application with `proposedBudget = null` and `proposedDeadlineDays = null` (the existing
  behaviour)
- WHEN `acceptApplication` runs
- THEN the gig's `budget`/`serviceFee`/`totalAmount`/`deadlineDays` MUST be unchanged, and the accept MUST behave
  exactly as before

#### Scenario: The lifecycle transitions and reject are preserved
- GIVEN the change
- WHEN the gig lifecycle (`OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID`) and `rejectApplication` are exercised
- THEN they MUST be unchanged — only the accept step additionally reconciles proposed terms

**Acceptance Criteria:**
- `acceptApplication` reconciles proposed terms onto the gig within its transaction (budget/fee/total and/or deadline)
- No-proposal accept leaves gig terms unchanged; status transition, assignment, auto-reject, notifications, and `rejectApplication` preserved

---

### Requirement: Seed and Verification
Sample proposals MUST be seeded idempotently, and the change MUST be additive with the suite green.

#### Scenario: Seed sets sample proposed terms idempotently
- GIVEN `prisma/seed.ts`
- WHEN it runs (or re-runs)
- THEN it MUST set `proposedBudget`/`proposedDeadlineDays` on a few seeded PENDING applications without duplicating on
  re-run (only when still `null`)

#### Scenario: Additive — suite green, no UI change
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with no change to other fields/flows (incl. the `gig-creation`/`gig-lifecycle`/application
  tests), and `npm run lint:tokens` + `npm run lint:composition` MUST stay green (no UI change)

**Acceptance Criteria:**
- Seed sets sample proposals idempotently; no `resetTestDatabase` change needed (no new table)
- `npm run build` + `npm run test:unit` green; additive; no UI changes

---

## Test Plan

This change ships two columns + an applyToGig input + a helper + the accept reconciliation + seed + tests. Validation
is by deterministic commands. Commands assume the repo root.

### Schema + helper + client
```bash
grep -qE 'proposedBudget +Int\?' prisma/schema.prisma && grep -qE 'proposedDeadlineDays +Int\?' prisma/schema.prisma && echo "proposed-terms fields present (nullable)"
test -f lib/terms.ts && grep -qE 'import type .*TermsTabsVM' lib/terms.ts && grep -qE 'getTermsTabs' lib/terms.ts && echo "getTermsTabs contract-typed"
npx prisma generate >/dev/null 2>&1 && echo "client regenerated"
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK schema deletions" || echo "OK schema additive"
```

### applyToGig accepts proposed terms; acceptApplication reconciles
```bash
grep -qE "formData.get\('proposedBudget'\)|proposedBudget" app/actions/gig.ts && grep -qE "proposedDeadlineDays" app/actions/gig.ts && echo "applyToGig reads proposed terms"
grep -qE 'proposedBudget' app/actions/gig.ts && grep -qE 'serviceFee|totalAmount' app/actions/gig.ts && echo "acceptApplication reconciles budget/fee on accept"
```

### Tests (propose / both-tabs / accept-with-terms / preserved / validation)
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/terms-negotiation.test.ts 2>&1 | tail -12
```

### Seed (idempotent)
```bash
grep -qiE 'proposedBudget|proposedDeadlineDays' prisma/seed.ts && echo "seed sets sample proposals"
```

### Typecheck + build + suite + scope (additive, no UI change)
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/terms|app/actions/gig|terms-negotiation.test" && echo "CHECK type error" || echo "OK new/changed files type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green (no UI change)"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/\(protected\)/' && echo "CHECK UI modified" || echo "OK no UI changes"
```

### Manual review
1. Confirm `proposedBudget`/`proposedDeadlineDays` are additive (nullable), client regenerated; `view-models.ts` unchanged.
2. Confirm `applyToGig` accepts + validates the optional proposed terms (budget → kopecks; deadline 1–365); absent → `null` (existing tests green).
3. Confirm `getTermsTabs` returns both tabs (Бюджет + Срок) matching `TermsTabsVM`; `proposed` falls back to client terms when not countered.
4. Confirm `acceptApplication` reconciles proposed terms onto the gig (budget/fee/total + deadline) and preserves the lifecycle/auto-reject/reject; no screen wired yet (Phase 2).
