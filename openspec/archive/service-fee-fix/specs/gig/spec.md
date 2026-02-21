# Gig Specification Changes

## MODIFIED Requirements

### Requirement: Fee Calculation
The system MUST calculate service fee as **10%** of the budget (changed from 20%).

#### Scenario: Fee calculation for 100,000 ₽ budget
- GIVEN a budget of 100000 (roubles)
- WHEN fee is calculated
- THEN serviceFee MUST be 1000000 kopecks (10,000 ₽ × 100)
- AND totalAmount MUST be 11000000 kopecks (110,000 ₽ × 100)

#### Scenario: Fee calculation rounds down for fractional kopecks
- GIVEN a budget of 333 roubles
- WHEN fee is calculated
- THEN serviceFee MUST be Math.floor(33300 × 0.10) = 3330 kopecks
- AND totalAmount MUST be 33300 + 3330 = 36630 kopecks

**Acceptance Criteria:**
- `serviceFee = Math.floor(budgetKopecks * 0.10)` (changed from 0.20)
- `totalAmount = budgetKopecks + serviceFee`
- All monetary values stored as integers (kopecks)

---

### Requirement: Create Gig Server Action
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user.

#### Scenario: Successful gig creation
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with valid title, description, acceptanceCriteria, budget (in roubles), tags, AND optional goal, deliverables, constraints
- THEN a Gig record MUST be created with:
  - `budget` = input budget converted to kopecks (× 100)
  - `serviceFee` = budget × **0.10** (changed from 0.20)
  - `totalAmount` = budget + serviceFee
  - `status` = "OPEN"
  - `clientId` = session userId
  - `acceptanceCriteria` = input acceptanceCriteria (trimmed)
  - `goal` = input goal (trimmed) or empty string if not provided
  - `deliverables` = input deliverables (trimmed) or empty string if not provided
  - `constraints` = input constraints (trimmed) or empty string if not provided
- AND the action MUST redirect to `/dashboard`

**Acceptance Criteria:**
- `createGig` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- Budget input is in roubles (user-facing), stored in kopecks (DB)
- **Service fee is 10% of budget** (changed from 20%)
- On success: redirects to `/dashboard`
- On failure: returns `{ error: string }`
