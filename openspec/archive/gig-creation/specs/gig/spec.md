# Gig Specification — Gig Creation Delta

## ADDED Requirements

### Requirement: Create Gig Server Action
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user.

#### Scenario: Successful gig creation
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with valid title, description, budget (in roubles), and tags
- THEN a Gig record MUST be created with:
  - `budget` = input budget converted to kopecks (× 100)
  - `serviceFee` = budget × 0.20
  - `totalAmount` = budget + serviceFee
  - `status` = "OPEN"
  - `clientId` = session userId
- AND the action MUST redirect to `/dashboard`

#### Scenario: Non-CLIENT user attempts gig creation
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Only clients can create gigs.' }`
- AND no Gig record MUST be created

#### Scenario: Unauthenticated user attempts gig creation
- GIVEN no valid session
- WHEN `createGig` is called
- THEN it MUST redirect to `/login`

#### Scenario: Missing required fields
- GIVEN a CLIENT user submits a gig form with empty title or description
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Title and description are required.' }`

#### Scenario: Invalid budget
- GIVEN a CLIENT user submits a gig form with budget <= 0 or non-numeric
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Budget must be a positive number.' }`

**Acceptance Criteria:**
- `createGig` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- Budget input is in roubles (user-facing), stored in kopecks (DB)
- Service fee is 20% of budget
- On success: redirects to `/dashboard`
- On failure: returns `{ error: string }`

---

### Requirement: Fee Calculation
The system MUST calculate service fee as 20% of the budget.

#### Scenario: Fee calculation for 100,000 ₽ budget
- GIVEN a budget of 100000 (roubles)
- WHEN fee is calculated
- THEN serviceFee MUST be 2000000 kopecks (20,000 ₽ × 100)
- AND totalAmount MUST be 12000000 kopecks (120,000 ₽ × 100)

#### Scenario: Fee calculation rounds down for fractional kopecks
- GIVEN a budget of 333 roubles
- WHEN fee is calculated
- THEN serviceFee MUST be Math.floor(33300 × 0.20) = 6660 kopecks
- AND totalAmount MUST be 33300 + 6660 = 39960 kopecks

**Acceptance Criteria:**
- `serviceFee = Math.floor(budgetKopecks * 0.20)`
- `totalAmount = budgetKopecks + serviceFee`
- All monetary values stored as integers (kopecks)
