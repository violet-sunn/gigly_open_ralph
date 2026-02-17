# Gig Spec Delta: Requirements Iteration 2

## ADDED Requirements

None - no new server actions are required.

## MODIFIED Requirements

### Requirement: Create Gig Server Action (MODIFIED)
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user, now accepting three additional optional fields: goal, deliverables, and constraints.

#### Scenario: Successful gig creation with structured fields
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with valid title, description, acceptanceCriteria, budget, tags, AND optional goal, deliverables, constraints
- THEN a Gig record MUST be created with:
  - `budget` = input budget converted to kopecks (× 100)
  - `serviceFee` = budget × 0.20
  - `totalAmount` = budget + serviceFee
  - `status` = "OPEN"
  - `clientId` = session userId
  - `acceptanceCriteria` = input acceptanceCriteria (trimmed)
  - `goal` = input goal (trimmed) or empty string if not provided
  - `deliverables` = input deliverables (trimmed) or empty string if not provided
  - `constraints` = input constraints (trimmed) or empty string if not provided
- AND the action MUST redirect to `/dashboard`

#### Scenario: Gig creation without optional fields
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with required fields only (no goal, deliverables, or constraints)
- THEN a Gig record MUST be created successfully
- AND the optional fields MUST default to empty strings ("")
- AND the action MUST redirect to `/dashboard`

#### Scenario: Optional fields are trimmed
- GIVEN a CLIENT user provides goal, deliverables, or constraints with leading/trailing whitespace
- WHEN `createGig` is called
- THEN all three optional fields MUST be trimmed before storage
- AND empty strings after trimming MUST be stored as ""

#### Scenario: Optional fields have no minimum length requirement
- GIVEN a CLIENT user provides a goal of only 5 characters
- WHEN `createGig` is called
- THEN the gig MUST be created successfully
- AND no validation error MUST be returned
- (Note: These fields are optional guidance, not strict requirements like acceptanceCriteria)

**Acceptance Criteria:**
- `createGig` signature remains `(prevState: { error?: string } | null, formData: FormData)`
- formData now includes optional fields: `goal`, `deliverables`, `constraints`
- All three new fields are trimmed before storage
- Empty or missing optional fields default to empty string ""
- No validation errors for short or empty optional fields
- All existing validation (title, description, acceptanceCriteria, budget) remains unchanged
- On success: redirects to `/dashboard`
- On failure: returns `{ error: string }`

## REMOVED Requirements

None - existing functionality is preserved.
