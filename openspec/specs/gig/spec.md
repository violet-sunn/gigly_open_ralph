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

---

### Requirement: Accept Application Server Action
The system MUST provide an `acceptApplication` server action that allows the gig owner to accept a PENDING application.

#### Scenario: Successful acceptance
- GIVEN an authenticated CLIENT user who owns the gig
- WHEN `acceptApplication` is called with a valid applicationId
- THEN the Application status MUST be updated to "ACCEPTED"
- AND the Gig status MUST be updated to "IN_PROGRESS"
- AND the Gig `assignedSpecialistId` MUST be set to the application's specialistId
- AND all other PENDING applications for that gig MUST be updated to "REJECTED"
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Non-owner attempts to accept
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Only the gig owner can manage applications.' }`
- AND no records MUST be modified

#### Scenario: Non-CLIENT user attempts to accept
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Only clients can manage applications.' }`

#### Scenario: Unauthenticated user attempts to accept
- GIVEN no valid session
- WHEN `acceptApplication` is called
- THEN it MUST redirect to `/login`

#### Scenario: Accept application on non-OPEN gig
- GIVEN a gig with status other than "OPEN"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`

#### Scenario: Accept non-PENDING application
- GIVEN an application with status "REJECTED" or "ACCEPTED"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'This application is no longer pending.' }`

#### Scenario: Application not found
- GIVEN an applicationId that does not exist
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Application not found.' }`

**Acceptance Criteria:**
- `acceptApplication` is exported from `app/actions/gig.ts` with `'use server'`
- All database updates (application status, gig status, auto-reject) MUST happen in a single Prisma transaction
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`

---

### Requirement: Reject Application Server Action
The system MUST provide a `rejectApplication` server action that allows the gig owner to reject a PENDING application.

#### Scenario: Successful rejection
- GIVEN an authenticated CLIENT user who owns the gig
- WHEN `rejectApplication` is called with a valid applicationId
- THEN the Application status MUST be updated to "REJECTED"
- AND the Gig status MUST remain "OPEN"
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Non-owner attempts to reject
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Only the gig owner can manage applications.' }`

#### Scenario: Non-CLIENT user attempts to reject
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Only clients can manage applications.' }`

#### Scenario: Unauthenticated user attempts to reject
- GIVEN no valid session
- WHEN `rejectApplication` is called
- THEN it MUST redirect to `/login`

#### Scenario: Reject non-PENDING application
- GIVEN an application with status "ACCEPTED" or "REJECTED"
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'This application is no longer pending.' }`

#### Scenario: Application not found
- GIVEN an applicationId that does not exist
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Application not found.' }`

**Acceptance Criteria:**
- `rejectApplication` is exported from `app/actions/gig.ts` with `'use server'`
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`

---

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
