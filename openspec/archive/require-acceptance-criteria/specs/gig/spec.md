# Gig Spec Delta: Require Acceptance Criteria

## MODIFIED Requirements

### Requirement: Create Gig Server Action
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user.

#### Scenario: Successful gig creation
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with valid title, description, **acceptanceCriteria**, budget (in roubles), and tags
- THEN a Gig record MUST be created with:
  - `budget` = input budget converted to kopecks (× 100)
  - `serviceFee` = budget × 0.20
  - `totalAmount` = budget + serviceFee
  - `status` = "OPEN"
  - `clientId` = session userId
  - **`acceptanceCriteria` = input acceptanceCriteria (trimmed)**
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
- GIVEN a CLIENT user submits a gig form with empty title**, description, or acceptanceCriteria**
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Title, description, and acceptance criteria are required.' }`

#### **Scenario: Acceptance criteria too short**
- **GIVEN a CLIENT user submits a gig form with acceptanceCriteria shorter than 50 characters (after trimming)**
- **WHEN `createGig` is called**
- **THEN it MUST return `{ error: 'Acceptance criteria must be at least 50 characters.' }`**
- **AND no Gig record MUST be created**

#### Scenario: Invalid budget
- GIVEN a CLIENT user submits a gig form with budget <= 0 or non-numeric
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Budget must be a positive number.' }`

**Acceptance Criteria:**
- `createGig` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- **formData includes `acceptanceCriteria` field (textarea)**
- **acceptanceCriteria is trimmed before validation and storage**
- **acceptanceCriteria minimum length: 50 characters (after trimming)**
- Budget input is in roubles (user-facing), stored in kopecks (DB)
- Service fee is 20% of budget
- On success: redirects to `/dashboard`
- On failure: returns `{ error: string }`
