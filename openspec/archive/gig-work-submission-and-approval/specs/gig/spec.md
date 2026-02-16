# Gig Specification Delta

## ADDED Requirements

### Requirement: Submit Work Server Action
The system MUST provide a `submitWork` server action that allows the assigned specialist to submit completed work and transition the gig from IN_PROGRESS to REVIEW.

#### Scenario: Successful work submission
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig status is "IN_PROGRESS"
- WHEN `submitWork` is called with a valid gigId
- THEN the Gig status MUST be updated to "REVIEW"
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Non-SPECIALIST user attempts to submit work
- GIVEN an authenticated user with role "CLIENT"
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Only specialists can submit work.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to submit work
- GIVEN no valid session
- WHEN `submitWork` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-assigned specialist attempts to submit work
- GIVEN an authenticated SPECIALIST user who is NOT the assigned specialist
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Only the assigned specialist can submit work.' }`
- AND no records MUST be modified

#### Scenario: Submit work on gig with wrong status
- GIVEN a gig with status other than "IN_PROGRESS" (e.g., "OPEN", "REVIEW", "COMPLETED")
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Work can only be submitted for gigs in progress.' }`
- AND no records MUST be modified

#### Scenario: Gig not found
- GIVEN a gigId that does not exist
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

**Acceptance Criteria:**
- `submitWork` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field)
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`
- Status update must be atomic (single database operation)

---

### Requirement: Approve Work Server Action
The system MUST provide an `approveWork` server action that allows the gig owner to approve submitted work and transition the gig from REVIEW to COMPLETED.

#### Scenario: Successful work approval
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig status is "REVIEW"
- WHEN `approveWork` is called with a valid gigId
- THEN the Gig status MUST be updated to "COMPLETED"
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Non-CLIENT user attempts to approve work
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Only clients can approve work.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to approve work
- GIVEN no valid session
- WHEN `approveWork` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-owner attempts to approve work
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Only the gig owner can approve work.' }`
- AND no records MUST be modified

#### Scenario: Approve work on gig with wrong status
- GIVEN a gig with status other than "REVIEW" (e.g., "OPEN", "IN_PROGRESS", "COMPLETED")
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Work can only be approved for gigs under review.' }`
- AND no records MUST be modified

#### Scenario: Gig not found
- GIVEN a gigId that does not exist
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

**Acceptance Criteria:**
- `approveWork` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field)
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`
- Status update must be atomic (single database operation)

---

## MODIFIED Requirements

None. This change adds new functionality without modifying existing requirements.

---

## REMOVED Requirements

None. This change is purely additive.
