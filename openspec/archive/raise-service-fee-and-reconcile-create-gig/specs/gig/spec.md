# Gig — Spec Delta (raise-service-fee-and-reconcile-create-gig)

> Business decision: the platform service fee rises from 10% to **17.5%**. The rate becomes a single SSOT
> (`lib/pricing.ts` → `SERVICE_FEE_RATE = 0.175`); every computation and label derives from it. Existing persisted
> gigs are not re-priced (see the proposal's Non-goals / Risks).

## ADDED Requirements

### Requirement: Service Fee Rate Is a Single Source of Truth
The service-fee rate MUST be defined exactly once, in `lib/pricing.ts` as `SERVICE_FEE_RATE = 0.175`, and every fee computation and every user-facing fee label MUST derive from it. No literal fee rate (`0.10`, `0.1`, `0.175`, «10%», «20%») may appear anywhere else in code. `lib/pricing.ts` MUST be client-safe (pure, no Prisma import) so both the `'use server'` actions and the client design components can import it.

#### Scenario: One rate, one place
- GIVEN the codebase after this change
- WHEN one searches for a fee rate literal
- THEN `0.175` (and the derived percent label «17,5%») MUST appear only in `lib/pricing.ts`
- AND `CreateGigDesign`, `EditGigDesign`, `GigDetail`, `ConditionsPanel`, `FeePanel`, `createGig`, `updateGig`, `prisma/seed.ts`, and the test fixture helper MUST all compute the fee via `serviceFeeKopecks()` (or the roubles helper), not a local literal

#### Scenario: The displayed percent cannot drift from the rate
- GIVEN a fee label rendered on any screen (create, edit, gig-detail, fee panel, finances)
- WHEN it shows the percent
- THEN it MUST read «17,5%» sourced from `SERVICE_FEE_PCT_LABEL` in `lib/pricing.ts`
- AND no screen may hardcode «10%» or «17,5%» as a literal string

## MODIFIED Requirements

### Requirement: Fee Calculation
The system MUST calculate the service fee as **17.5%** of the budget, via the `SERVICE_FEE_RATE` SSOT.

#### Scenario: Fee calculation for 100,000 ₽ budget
- GIVEN a budget of 100000 (roubles)
- WHEN fee is calculated
- THEN serviceFee MUST be 1750000 kopecks (17,500 ₽ × 100)
- AND totalAmount MUST be 11750000 kopecks (117,500 ₽ × 100)

#### Scenario: Fee calculation rounds down for fractional kopecks
- GIVEN a budget of 333 roubles
- WHEN fee is calculated
- THEN serviceFee MUST be Math.floor(33300 × 0.175) = 5827 kopecks (floor of 5827.5)
- AND totalAmount MUST be 33300 + 5827 = 39127 kopecks

**Acceptance Criteria:**
- `serviceFee = Math.floor(budgetKopecks * SERVICE_FEE_RATE)` where `SERVICE_FEE_RATE = 0.175`
- `totalAmount = budgetKopecks + serviceFee`
- All monetary values stored as integers (kopecks)
- The same helper computes the fee in `createGig`, in the `updateGig` / accept-proposed-terms recompute, and in the live create/edit previews — so the preview always equals the persisted value

> **Reconciliation note (applied at archive):** every incidental fee reference in this spec MUST move from 10% to
> 17.5% — the "Create Gig Server Action" acceptance criteria (`serviceFee = Math.floor(budgetKopecks * 0.10)` →
> `* SERVICE_FEE_RATE`), the "Accept Application Reconciles Proposed Terms" / "Update Gig Server Action" recompute
> references (`Math.floor(budget * 0.10)` → via the SSOT), and every "10% fee" phrasing. Verified by grep: no
> `0.10` / `0.1` / `10%` fee reference remains in `gig/spec.md`.
