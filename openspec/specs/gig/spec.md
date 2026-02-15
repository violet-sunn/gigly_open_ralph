# Gig Specification

## Requirements

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

---

### Requirement: Apply to Gig Server Action
The system MUST provide an `applyToGig` server action that creates an application for the authenticated SPECIALIST user.

#### Scenario: Successful application
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `applyToGig` is called with a valid gigId and optional coverLetter
- THEN an Application record MUST be created with:
  - `gigId` = provided gig ID
  - `specialistId` = session userId
  - `coverLetter` = provided text (or empty string)
  - `status` = "PENDING"
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Non-SPECIALIST user attempts to apply
- GIVEN an authenticated user with role "CLIENT"
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Only specialists can apply to gigs.' }`
- AND no Application record MUST be created

#### Scenario: Unauthenticated user attempts to apply
- GIVEN no valid session
- WHEN `applyToGig` is called
- THEN it MUST redirect to `/login`

#### Scenario: Duplicate application
- GIVEN a SPECIALIST has already applied to a gig
- WHEN `applyToGig` is called for the same gig
- THEN it MUST return `{ error: 'You have already applied to this gig.' }`

#### Scenario: Applying to non-existent gig
- GIVEN a gigId that does not exist
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

#### Scenario: Applying to non-OPEN gig
- GIVEN a gig with status other than "OPEN"
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`

**Acceptance Criteria:**
- `applyToGig` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field) and `coverLetter` (textarea)
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`
