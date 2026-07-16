# Proposal — raise-service-fee-and-reconcile-create-gig

## Why

Two things, landed together because they touch the same surfaces:

1. **Business decision: the platform service fee rises from 10% to 17.5%.** This is a real behaviour change — the fee is computed and displayed in many places — not a doc edit.
2. **The create-gig spec was already stale and self-contradicting**, and the fee is documented inconsistently across specs. Reconciling both at once avoids leaving `/gigs/new` described by a pre-reground kit form and avoids shipping a fee change against specs that still argue with each other.

### The fee is hardcoded in ~11 places with no SSOT

There is **no** `SERVICE_FEE_RATE` constant today; `0.10` / `0.1` and the string «10%» are copy-pasted. A business rate change across scattered literals is exactly the drift an SSOT prevents (the same lesson as `lib/gig-validation.ts` and `lib/terms-display.ts` this round). This change introduces `lib/pricing.ts` as the single source and routes every site through it.

**Computation sites (4):** `CreateGigDesign.tsx:69`, `EditGigDesign.tsx:86`, `app/actions/gig.ts:82` (createGig — the persisted value), `app/actions/gig.ts:538` (updateGig / accept-terms recompute). **Plus** `prisma/seed.ts` and the test fixture helper `__tests__/helpers/seed.ts:createTestGig` (explicit `serviceFee: 15000` defaults).

**User-facing «10%» labels (6):** `CreateGigDesign.tsx:392`, `EditGigDesign.tsx:399`, `GigDetail.tsx:599`, `ConditionsPanel.tsx:59`, `FeePanel.tsx:22`, `lib/finances.ts:99` («комиссия Gigly 10%»).

### The specs already disagree with each other on the fee

Verified 2026-07-16 (only `gig/spec.md` currently matches the shipped 10%; three specs say **20%**):

| Spec | Says | |
| --- | --- | --- |
| `gig/spec.md` | 10% (`serviceFee = budget × 0.10`, worked examples, accept/update recompute) | correct today, must go to 17.5% |
| `database/spec.md:83` | serviceFee "calculated as **20%** of budget" | wrong today (code is 10%) → 17.5% |
| `testing/spec.md:1001,1569` | "10% of budget" AND "serviceFee = budget * **0.2**" (contradicts itself) | → 17.5% |
| `ui/spec.md:621,643` | "service fee (**20%**)", "Total: 120,000 ₽" | inside the stale create-gig block → 17.5% |
| `ui/spec.md:7779` "Live Fee Panel" | 10%, `floor(budget × 0.10)` | correct today → 17.5% |

### The create-gig block is stale (the original task)

`ui/spec.md` still carries **three** create-gig requirements describing the pre-reground kit form:
- **"Gig Creation Form" (606)** — has partial supersession notes but still lists `goal`/`deliverables` as optional (they are **required** since C1) and quotes the 20% fee.
- **"Gig Creation Form Visual Sections" (844)** — English kit sections, `bg-gray-50`, indigo examples link → `/gigs`.
- **"Gig Creation Form Visual Sections" (1944)** — **the same requirement name defined twice** (invalid), a navy token-migration skin, wrong route `/dashboard/gigs/new`.

The live screen is already correctly specced by "Gig Creation Screen Is the Guided Brief" + companions (`:7743-7817`) and "Create Gig Reconciled To Reference" (`:8239`); these stay, updated only for the new fee.

## What

1. **Raise the fee to 17.5%** via a new `lib/pricing.ts` SSOT (`SERVICE_FEE_RATE = 0.175`), routing all 4 computation sites, both seed paths, and all 6 labels through it. Recompute the specs' worked examples.
2. **Reconcile the fee across every spec** — `gig`, `database` (20%→17.5%), `testing` (20%/10%→17.5%), `ui` (Live Fee Panel + the create-gig block) — so no spec still quotes 10% or 20%.
3. **Reconcile the create-gig spec** — MODIFY "Gig Creation Form" (required goal/deliverables, 17.5% fee, counters deferred to the localized requirement) and REMOVE both "Gig Creation Form Visual Sections".

## Decisions (made, per the instruction not to ask)

- **New label reads «Сервисный сбор (17,5%)»** — Russian decimal comma, consistent with `ru-RU` money formatting, exposed as `SERVICE_FEE_PCT_LABEL` from the SSOT so the string never drifts from the rate.
- **The test fixture helper computes the fee from the SSOT too** (not a hand-set default), so there is exactly one rate in the codebase — production and fixtures. Rate-asserting tests recompute; self-consistent seed fixtures that never check budget×rate stay green.
- **Fee raise is task 1**, before the reconciliation, since the specs' new numbers depend on the chosen rate landing first.

## Constraints

- One rate, one place: after this, `grep` for `0.1`/`0.10`/`10%`/`20%`/`0.2` as a *fee* MUST find only `lib/pricing.ts` and the derived label.
- Do not change the DB **schema** (`serviceFee Int`); only the documented rate. `goal`/`deliverables` requiredness stays enforced at the action layer (C1), not the column default.
- Do not touch validation minimums, the guided-brief structure, or any non-fee behaviour.

## Non-goals

- "Gig Creation Form (Mobile Optimization)" (`ui/spec.md:3413`) — touch-target ergonomics, no fee/validation contradiction. Left as residual.
- Collapsing "Gig Creation Form" into "Gig Creation Screen Is the Guided Brief" — bigger diff, risks dropping the access-control scenarios; deferred.
- Retroactive migration of already-persisted gigs' `serviceFee` (existing rows keep the fee they were created with; only new/edited gigs use 17.5%). Flagged as a product decision, out of scope here.

## Risks

- **Existing gigs in the DB were created at 10%.** This change does not rewrite them; finances derived from `totalAmount` stay internally consistent per gig. If the business wants old gigs re-priced, that is a separate data migration — called out, not silently done.
- **Duplicate requirement name.** The archive step MUST delete BOTH "Gig Creation Form Visual Sections" blocks; a single find-and-delete leaves the duplicate.
- **Wide test surface.** Rate-asserting tests (`gig-creation`, `factory-validation`, `factory-composability`, `client-journey`, `specialist-journey`, `gig-editing`, `compose-create-gig`, `finances-ledger`, `helpers/seed.test`) must move to 17.5%. The fixture-helper-computes-fee decision keeps this to the assertions, not every literal.
