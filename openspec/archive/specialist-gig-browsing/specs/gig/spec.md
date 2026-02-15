# Gig Specification — Specialist Gig Browsing Delta

## ADDED Requirements

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
