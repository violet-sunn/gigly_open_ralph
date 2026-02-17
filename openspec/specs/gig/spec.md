# Gig Specification

## Requirements

### Requirement: Create Gig Server Action
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user.

#### Scenario: Successful gig creation
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with valid title, description, acceptanceCriteria, budget (in roubles), tags, AND optional goal, deliverables, constraints
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
- GIVEN a CLIENT user submits a gig form with empty title, description, or acceptanceCriteria
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Title, description, and acceptance criteria are required.' }`

#### Scenario: Acceptance criteria too short
- GIVEN a CLIENT user submits a gig form with acceptanceCriteria shorter than 50 characters (after trimming)
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Acceptance criteria must be at least 50 characters.' }`
- AND no Gig record MUST be created

#### Scenario: Invalid budget
- GIVEN a CLIENT user submits a gig form with budget <= 0 or non-numeric
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Budget must be a positive number.' }`

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

**Acceptance Criteria:**
- `createGig` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `acceptanceCriteria` field (textarea) and optional fields: `goal`, `deliverables`, `constraints`
- acceptanceCriteria is trimmed before validation and storage
- acceptanceCriteria minimum length: 50 characters (after trimming)
- All three optional fields are trimmed before storage
- Empty or missing optional fields default to empty string ""
- No validation errors for short or empty optional fields
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

---

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

---

### Requirement: Send Message Server Action
The system MUST provide a `sendMessage` server action that creates a message within a gig context and redirects on success.

#### Scenario: Successful message send by gig owner
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig has an assigned specialist (assignedSpecialistId is not null)
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created with:
  - `gigId` = provided gig ID
  - `senderId` = session userId
  - `content` = provided message text (trimmed)
  - `createdAt` = current timestamp (auto-generated)
- AND the action MUST redirect to `/dashboard/gigs/{gigId}` to refresh the page
- AND the form MUST be reset (handled by redirect)

#### Scenario: Successful message send by assigned specialist
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig has an assigned specialist
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created
- AND the action MUST redirect to `/dashboard/gigs/{gigId}` to refresh the page

#### Scenario: Unauthenticated user attempts to send message
- GIVEN no valid session
- WHEN `sendMessage` is called
- THEN it MUST redirect to `/login`

#### Scenario: Unauthorized user attempts to send message
- GIVEN an authenticated user who is NOT the gig owner AND NOT the assigned specialist
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'You are not authorized to send messages on this gig.' }`
- AND no Message record MUST be created

#### Scenario: Send message to gig without assigned specialist
- GIVEN a gig with status "OPEN" (no assigned specialist)
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Cannot send messages until a specialist is assigned.' }`
- AND no Message record MUST be created

#### Scenario: Send message with empty content
- GIVEN an authorized user submits a message with empty or whitespace-only content
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Message content is required.' }`
- AND no Message record MUST be created

#### Scenario: Send message exceeding max length
- GIVEN an authorized user submits a message with content longer than 2000 characters
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Message is too long. Maximum 2000 characters allowed.' }`
- AND no Message record MUST be created

#### Scenario: Send message to non-existent gig
- GIVEN a gigId that does not exist
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

#### Scenario: Send message to closed gig
- GIVEN a gig with closedByAdmin = true
- WHEN `sendMessage` is called by an authorized user
- THEN it MUST return `{ error: 'Cannot send messages to a closed gig.' }`
- AND no Message record MUST be created

**Acceptance Criteria:**
- `sendMessage` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field) and `content` (textarea)
- Content validation:
  - Non-empty after trimming
  - Maximum 2000 characters (before trimming)
- Access control checks: user is gig owner OR assigned specialist
- Gig state checks: has assigned specialist, not closed by admin
- On success: calls `redirect(\`/dashboard/gigs/${gigId}\`)` (NOT revalidatePath)
- On failure: returns `{ error: string }`
- Content is trimmed before storage
