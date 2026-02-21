# Testing Specification Changes

## MODIFIED Requirements

### Requirement: Gig Creation Integration Tests
All integration tests for gig creation MUST validate that the service fee is calculated as **10%** of the budget (changed from 20%).

#### Scenario: Service fee calculation test
- GIVEN a test creates a gig with budget 100,000 ₽ (10,000,000 kopecks)
- WHEN the gig is created via `createGig` action
- THEN the stored gig record MUST have:
  - `serviceFee` = 1,000,000 kopecks (10,000 ₽)
  - `totalAmount` = 11,000,000 kopecks (110,000 ₽)

#### Scenario: Fee calculation with fractional kopecks
- GIVEN a test creates a gig with budget 333 ₽ (33,300 kopecks)
- WHEN the gig is created
- THEN the stored gig record MUST have:
  - `serviceFee` = Math.floor(33300 × 0.10) = 3,330 kopecks
  - `totalAmount` = 36,630 kopecks

**Acceptance Criteria:**
- Update `__tests__/integration/gig-creation.test.ts`:
  - All assertions expecting 20% fee MUST be updated to expect 10%
  - Test case "calculates service fee as 20% of budget" MUST be renamed to "calculates service fee as 10% of budget"
  - All hardcoded expected values MUST be recalculated for 10%

---

### Requirement: E2E Tests
All E2E tests MUST validate that the UI displays the correct 10% service fee.

#### Scenario: Specialist journey E2E test
- GIVEN the E2E test creates a gig through the UI
- WHEN the test verifies the created gig in the database
- THEN the assertion MUST expect `serviceFee` to be 10% of budget

**Acceptance Criteria:**
- Update `__tests__/e2e/specialist-journey.spec.ts`:
  - Line 299: Change `expect(finalGig?.serviceFee).toBe(15000)` to expect 10% calculation
  - Recalculate expected serviceFee based on the test's budget value

---

### Requirement: Seed Data
All example gigs in seed data MUST use 10% service fee for consistency.

#### Scenario: Example gig creation
- GIVEN the seed script creates example gigs
- WHEN calculating serviceFee for each gig
- THEN it MUST use `Math.floor(budget * 0.10)` (changed from 0.20)

**Acceptance Criteria:**
- Update `prisma/seed.ts`:
  - Lines 33, 61, 89, 117, 145: Change all `* 0.20` to `* 0.10`
  - All example gigs MUST have correct serviceFee and totalAmount
