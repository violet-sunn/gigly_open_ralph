# Gig Spec Delta — application-management

## ADDED Requirements

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
