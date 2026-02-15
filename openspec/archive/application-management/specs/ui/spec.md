# UI Spec Delta — application-management

## MODIFIED Requirements

### Requirement: Gig Detail Page — Application Management
The gig detail page MUST show Accept and Reject buttons on PENDING applications when viewed by the gig owner.

#### Scenario: Gig owner views PENDING applications
- GIVEN an authenticated CLIENT user who owns the gig
- AND the gig status is "OPEN"
- WHEN they view `/dashboard/gigs/[id]`
- THEN each PENDING application MUST display:
  - Specialist email
  - Cover letter
  - Application date
  - An "Accept" button
  - A "Reject" button

#### Scenario: Gig owner views applications on IN_PROGRESS gig
- GIVEN an authenticated CLIENT user who owns the gig
- AND the gig status is "IN_PROGRESS"
- WHEN they view `/dashboard/gigs/[id]`
- THEN the ACCEPTED application MUST display with a "Accepted" badge (no buttons)
- AND REJECTED applications MUST display with a "Rejected" badge (no buttons)
- AND the page MUST show the assigned specialist's email prominently

#### Scenario: Accept button loading state
- GIVEN a CLIENT user clicks "Accept" on an application
- WHEN the server action is processing
- THEN the button MUST show "Accepting..." text
- AND both Accept and Reject buttons MUST be disabled

#### Scenario: Reject button loading state
- GIVEN a CLIENT user clicks "Reject" on an application
- WHEN the server action is processing
- THEN the button MUST show "Rejecting..." text
- AND both Accept and Reject buttons MUST be disabled

#### Scenario: Error display
- GIVEN a CLIENT user triggers an accept/reject action that fails
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline near the application

#### Scenario: Non-owner views gig detail
- GIVEN an authenticated user who does NOT own the gig
- WHEN they view `/dashboard/gigs/[id]`
- THEN they MUST NOT see Accept or Reject buttons

---

## MODIFIED Requirements

### Requirement: Role-Based Dashboard — Gig Status Display
The client dashboard MUST reflect the updated gig statuses.

#### Scenario: Client dashboard shows IN_PROGRESS gigs
- GIVEN a CLIENT user with gigs in various statuses
- WHEN they visit `/dashboard`
- THEN each gig MUST display its current status (OPEN, IN_PROGRESS, etc.)
- AND IN_PROGRESS gigs MUST show the assigned specialist's email

**Acceptance Criteria:**
- `app/dashboard/gigs/[id]/page.tsx` renders Accept/Reject buttons for gig owner on OPEN gigs
- Buttons use a client component with `useActionState` and `useFormStatus`
- Each button submits a form with hidden `applicationId` field
- Accepted/Rejected applications show status badges instead of buttons
- IN_PROGRESS gigs show assigned specialist info
- Client dashboard includes specialist email for IN_PROGRESS gigs
