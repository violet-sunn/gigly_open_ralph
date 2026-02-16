# Gig Specification - Payment Tracking Delta

## ADDED Requirements

### Requirement: Mark as Paid Server Action
The system MUST provide a `markAsPaid` server action that allows the gig owner to mark a COMPLETED gig as paid.

#### Scenario: Successful payment marking
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig status is "COMPLETED"
- WHEN `markAsPaid` is called with a valid gigId
- THEN the Gig status MUST be updated to "PAID"
- AND the Gig `paidAt` MUST be set to the current timestamp (new Date())
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Non-CLIENT user attempts to mark as paid
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Only clients can mark gigs as paid.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to mark as paid
- GIVEN no valid session
- WHEN `markAsPaid` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-owner attempts to mark as paid
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Only the gig owner can mark this gig as paid.' }`
- AND no records MUST be modified

#### Scenario: Mark as paid on gig with wrong status
- GIVEN a gig with status other than "COMPLETED" (e.g., "OPEN", "IN_PROGRESS", "REVIEW", "PAID")
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Only completed gigs can be marked as paid.' }`
- AND no records MUST be modified

#### Scenario: Mark already paid gig as paid (idempotency)
- GIVEN a gig with status "PAID" and paidAt already set
- WHEN `markAsPaid` is called by the owner
- THEN it MUST return `{ error: 'This gig has already been marked as paid.' }`
- AND the existing `paidAt` value MUST NOT be changed

#### Scenario: Gig not found
- GIVEN a gigId that does not exist
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

**Acceptance Criteria:**
- `markAsPaid` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field)
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`
- Status update and paidAt timestamp must be atomic (single database operation)
- Uses `new Date()` for paidAt timestamp
