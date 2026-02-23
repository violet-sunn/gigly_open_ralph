# Gig Specification Delta: Application Withdrawal

## ADDED Requirements

### Requirement: Withdraw Application Server Action
The system MUST provide a `withdrawApplication` server action that allows specialists to withdraw their own PENDING applications.

#### Scenario: Successful application withdrawal
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user owns the application (userId === application.specialistId)
- AND the application status is "PENDING"
- AND the gig is not closed by admin (closedByAdmin = false)
- AND the gig is not an example gig (isExample = false)
- WHEN `withdrawApplication` is called with a valid applicationId
- THEN the Application status MUST be updated to "WITHDRAWN"
- AND the Application `updatedAt` MUST be set to the current timestamp
- AND the action MUST redirect to `/dashboard/gigs/{gigId}`

#### Scenario: Non-SPECIALIST user attempts to withdraw
- GIVEN an authenticated user with role "CLIENT"
- WHEN `withdrawApplication` is called
- THEN it MUST return `{ error: 'Only specialists can withdraw applications.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to withdraw
- GIVEN no valid session
- WHEN `withdrawApplication` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-owner specialist attempts to withdraw
- GIVEN an authenticated SPECIALIST user who does NOT own the application
- WHEN `withdrawApplication` is called
- THEN it MUST return `{ error: 'You can only withdraw your own applications.' }`
- AND no records MUST be modified

#### Scenario: Withdraw non-PENDING application (ACCEPTED)
- GIVEN an application with status "ACCEPTED"
- WHEN `withdrawApplication` is called by the owner
- THEN it MUST return `{ error: 'Only pending applications can be withdrawn.' }`
- AND no records MUST be modified

#### Scenario: Withdraw non-PENDING application (REJECTED)
- GIVEN an application with status "REJECTED"
- WHEN `withdrawApplication` is called by the owner
- THEN it MUST return `{ error: 'Only pending applications can be withdrawn.' }`
- AND no records MUST be modified

#### Scenario: Withdraw already WITHDRAWN application (idempotency)
- GIVEN an application with status "WITHDRAWN"
- WHEN `withdrawApplication` is called by the owner
- THEN it MUST return `{ error: 'This application has already been withdrawn.' }`
- AND the existing `updatedAt` value MUST NOT be changed

#### Scenario: Withdraw from closed gig
- GIVEN a gig with closedByAdmin = true
- AND an application with status "PENDING"
- WHEN `withdrawApplication` is called by the owner
- THEN it MUST return `{ error: 'Cannot withdraw applications from closed gigs.' }`
- AND no records MUST be modified

#### Scenario: Withdraw from example gig
- GIVEN a gig with isExample = true
- AND an application with status "PENDING"
- WHEN `withdrawApplication` is called by the owner
- THEN it MUST return `{ error: 'Cannot withdraw applications from example gigs.' }`
- AND no records MUST be modified

#### Scenario: Application not found
- GIVEN an applicationId that does not exist
- WHEN `withdrawApplication` is called
- THEN it MUST return `{ error: 'Application not found.' }`

#### Scenario: Gig not found for application
- GIVEN an application whose gig has been deleted
- WHEN `withdrawApplication` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

**Acceptance Criteria:**
- `withdrawApplication` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `applicationId` (hidden field)
- Authorization checks: user is SPECIALIST AND owns the application
- Status validation: application status is PENDING (not ACCEPTED, REJECTED, or WITHDRAWN)
- Gig state checks: not closed by admin, not example gig
- Status update must be atomic (single database operation)
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`
- No rate limiting (self-limiting action)

---

### Requirement: Withdraw Application UI Button
The system MUST display a "Withdraw Application" button on the gig detail page for specialists who own PENDING applications.

#### Scenario: Withdraw button visible for specialist with PENDING application
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has a PENDING application for the gig
- WHEN viewing the gig detail page at `/dashboard/gigs/{id}`
- THEN a "Withdraw Application" button MUST be displayed
- AND the button MUST be styled consistently with other action buttons (Submit Work, Approve Work)

#### Scenario: Withdraw button hidden for specialist with ACCEPTED application
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has an ACCEPTED application for the gig
- WHEN viewing the gig detail page
- THEN the "Withdraw Application" button MUST NOT be displayed

#### Scenario: Withdraw button hidden for specialist with REJECTED application
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has a REJECTED application for the gig
- WHEN viewing the gig detail page
- THEN the "Withdraw Application" button MUST NOT be displayed

#### Scenario: Withdraw button hidden for specialist with WITHDRAWN application
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has a WITHDRAWN application for the gig
- WHEN viewing the gig detail page
- THEN the "Withdraw Application" button MUST NOT be displayed

#### Scenario: Withdraw button hidden for CLIENT users
- GIVEN an authenticated user with role "CLIENT"
- WHEN viewing a gig detail page
- THEN the "Withdraw Application" button MUST NOT be displayed

#### Scenario: Withdraw button hidden for specialists without application
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has NOT applied to the gig
- WHEN viewing the gig detail page
- THEN the "Withdraw Application" button MUST NOT be displayed

#### Scenario: Specialist sees their own WITHDRAWN status badge
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has a WITHDRAWN application for the gig
- WHEN viewing the gig detail page
- THEN a status badge with "WITHDRAWN" text MUST be displayed
- AND the badge MUST use gray color scheme (bg-gray-100 text-gray-700)
- AND the withdrawal date MUST be displayed with label "Withdrawn on:"
- AND the "Withdraw Application" button MUST NOT be displayed

**Acceptance Criteria:**
- Button component uses `useActionState` hook with `withdrawApplication` action
- Button is placed near the application status display on gig detail page
- Button styling: red/warning color scheme (destructive action)
- Button text: "Withdraw Application"
- Error messages displayed inline below button
- Loading state: button disabled with "Withdrawing..." text during submission

---

### Requirement: WITHDRAWN Applications in Specialist Dashboard
The system MUST display WITHDRAWN applications in the Archive tab of the specialist dashboard.

#### Scenario: WITHDRAWN applications appear in Archive tab
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has applications with status "WITHDRAWN"
- WHEN viewing the specialist dashboard Archive tab
- THEN all WITHDRAWN applications MUST be displayed
- AND each WITHDRAWN application MUST show:
  - Gig title (linked to gig detail page)
  - Application status badge: "WITHDRAWN"
  - Application date (createdAt)
  - Withdrawal date (updatedAt)

#### Scenario: WITHDRAWN status badge styling
- GIVEN a WITHDRAWN application displayed in the Archive tab
- WHEN rendering the status badge
- THEN the badge MUST use gray color scheme (bg-gray-100 text-gray-700)
- AND the badge text MUST be "WITHDRAWN"

#### Scenario: WITHDRAWN applications sorted by withdrawal date
- GIVEN multiple WITHDRAWN applications
- WHEN viewing the Archive tab
- THEN applications MUST be sorted by updatedAt descending (most recently withdrawn first)

**Acceptance Criteria:**
- Archive tab includes applications with status "WITHDRAWN"
- WITHDRAWN applications are visually distinct from REJECTED applications
- Clicking on a WITHDRAWN application navigates to the gig detail page
- Archive tab query filters for status IN ['REJECTED', 'WITHDRAWN'] with NO gig status constraint (terminal application states appear immediately regardless of gig lifecycle)

---

### Requirement: WITHDRAWN Status in Client Applications List
The system MUST display WITHDRAWN status for applications in the client's gig detail view.

#### Scenario: Client sees WITHDRAWN status in applications list
- GIVEN an authenticated user with role "CLIENT"
- AND the user owns a gig with applications
- AND one or more applications have status "WITHDRAWN"
- WHEN viewing the gig detail page at `/dashboard/gigs/{id}`
- THEN each WITHDRAWN application MUST display:
  - Specialist name/email
  - Application status badge: "WITHDRAWN"
  - Application date (createdAt)
  - Withdrawal date (updatedAt) with label "Withdrawn on:"

#### Scenario: WITHDRAWN applications sorted with other applications
- GIVEN a gig with multiple applications (PENDING, ACCEPTED, REJECTED, WITHDRAWN)
- WHEN viewing the applications list as the gig owner
- THEN applications MUST be sorted by createdAt descending
- AND WITHDRAWN applications MUST appear in chronological order with other applications

#### Scenario: WITHDRAWN status badge styling in client view
- GIVEN a WITHDRAWN application in the client's applications list
- WHEN rendering the status badge
- THEN the badge MUST use gray color scheme (bg-gray-100 text-gray-700)
- AND the badge text MUST be "WITHDRAWN"

**Acceptance Criteria:**
- Applications list includes WITHDRAWN applications (not filtered out)
- WITHDRAWN status is clearly visible to gig owner
- No action buttons (Accept/Reject) displayed for WITHDRAWN applications
- Specialist profile information remains visible for WITHDRAWN applications
