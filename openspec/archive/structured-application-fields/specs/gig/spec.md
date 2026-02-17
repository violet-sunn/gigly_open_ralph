# Gig Specification Delta

## MODIFIED Requirements

### Requirement: Apply to Gig Server Action
The system MUST provide an `applyToGig` server action that creates an application with structured fields for technical approach, clarifying questions, and optional estimated effort.

#### Scenario: Successful application with structured fields
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `applyToGig` is called with valid gigId, approach, questions, and optional estimatedEffort
- THEN an Application record MUST be created with:
  - `gigId` = provided gig ID
  - `specialistId` = session userId
  - `approach` = provided technical approach (trimmed)
  - `questions` = provided clarifying questions (trimmed)
  - `estimatedEffort` = provided effort estimate (trimmed) or empty string
  - `coverLetter` = empty string (legacy field, not used)
  - `status` = "PENDING"
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Missing required approach field
- GIVEN a SPECIALIST submits an application with empty or whitespace-only approach
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Technical approach is required.' }`
- AND no Application record MUST be created

#### Scenario: Missing required questions field
- GIVEN a SPECIALIST submits an application with empty or whitespace-only questions
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Clarifying questions are required.' }`
- AND no Application record MUST be created

#### Scenario: Approach too short
- GIVEN a SPECIALIST submits an application with approach shorter than 100 characters (after trimming)
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Technical approach must be at least 100 characters. Please provide more detail about your methodology.' }`
- AND no Application record MUST be created

#### Scenario: Questions too short
- GIVEN a SPECIALIST submits an application with questions shorter than 50 characters (after trimming)
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Clarifying questions must be at least 50 characters. What do you need to know about the requirements?' }`
- AND no Application record MUST be created

#### Scenario: Approach exceeds maximum length
- GIVEN a SPECIALIST submits an application with approach longer than 2000 characters
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Technical approach is too long. Maximum 2000 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Questions exceed maximum length
- GIVEN a SPECIALIST submits an application with questions longer than 1000 characters
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Clarifying questions are too long. Maximum 1000 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Estimated effort exceeds maximum length
- GIVEN a SPECIALIST submits an application with estimatedEffort longer than 200 characters
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Estimated effort is too long. Maximum 200 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Optional estimated effort is empty
- GIVEN a SPECIALIST submits an application without estimatedEffort
- WHEN `applyToGig` is called with valid approach and questions
- THEN an Application record MUST be created successfully
- AND `estimatedEffort` MUST be stored as empty string ""

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
- formData includes `gigId` (hidden field), `approach` (textarea), `questions` (textarea), `estimatedEffort` (textarea, optional)
- All text fields are trimmed before validation and storage
- Validation order: required fields first, then length checks
- Minimum lengths: approach 100 chars, questions 50 chars
- Maximum lengths: approach 2000 chars, questions 1000 chars, estimatedEffort 200 chars
- Empty or missing estimatedEffort defaults to empty string ""
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }` with clear, actionable error messages
- `coverLetter` field is set to empty string (not used in new applications)
