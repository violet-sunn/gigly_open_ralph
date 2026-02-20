# Testing Specification Delta

## ADDED Requirements

### Requirement: Client Journey E2E Test

The platform SHALL provide a comprehensive end-to-end test that validates the complete client journey from registration through payment using Playwright browser automation.

#### Scenario: Complete client journey test passes

**Given** the test database is clean and the Next.js dev server is running
**When** the E2E test `client-journey.spec.ts` executes
**Then** the test SHALL complete all 9 steps of the client journey
**And** the test SHALL pass all assertions
**And** the test SHALL complete in under 30 seconds
**And** the final gig status SHALL be PAID

**Acceptance Criteria**:
- Test file exists at `__tests__/e2e/client-journey.spec.ts`
- Test executes all steps: register → login → create gig → review application → accept → approve work → mark paid
- All assertions pass
- Test completes in < 30 seconds
- Run `npm run test:e2e -- client-journey.spec.ts` and verify exit code 0

#### Scenario: Client registers via UI

**Given** the test navigates to `/register`
**When** the test fills the registration form with CLIENT role, company name, INN, email, and password
**And** the test submits the form
**Then** the browser SHALL redirect to `/dashboard`
**And** the client user SHALL exist in the database
**And** the client SHALL have a ClientProfile with company details

**Acceptance Criteria**:
- Test uses `page.goto('/register')`
- Test fills all required fields: email, password, role (CLIENT), companyName, inn
- Test clicks submit button
- Test waits for navigation to `/dashboard`
- Test verifies URL is `/dashboard`
- Database contains user with CLIENT role and associated ClientProfile

#### Scenario: Client logs in via UI

**Given** a client user exists in the database
**When** the test navigates to `/login`
**And** the test fills email and password
**And** the test submits the login form
**Then** the browser SHALL redirect to `/dashboard`
**And** the session cookie SHALL be set
**And** subsequent requests SHALL be authenticated

**Acceptance Criteria**:
- Test uses `page.goto('/login')`
- Test fills email and password fields
- Test clicks login button
- Test waits for navigation to `/dashboard`
- Test verifies URL is `/dashboard`
- Session cookie exists in browser context

#### Scenario: Client creates gig via UI

**Given** the client is logged in and on the dashboard
**When** the test navigates to `/dashboard/gigs/new`
**And** the test fills all required gig fields (title, description, acceptance criteria, budget, tags)
**And** the test submits the gig creation form
**Then** the browser SHALL redirect to the gig detail page
**And** the gig SHALL exist in the database with status OPEN
**And** the gig SHALL have correct budget, serviceFee, and totalAmount

**Acceptance Criteria**:
- Test navigates to `/dashboard/gigs/new`
- Test fills: title (Russian), description (Russian), acceptanceCriteria (≥50 chars), budget (e.g., 150000), tags (e.g., "React,TypeScript")
- Test submits form
- Test waits for navigation to `/dashboard/gigs/[id]`
- Test extracts gig ID from URL
- Database contains gig with status OPEN, correct budget calculation (serviceFee = budget * 0.2, totalAmount = budget + serviceFee)

#### Scenario: Specialist applies to gig (programmatic)

**Given** a gig exists with status OPEN
**When** the test creates a specialist user and application programmatically
**Then** the application SHALL exist in the database with status PENDING
**And** the application SHALL be linked to the gig and specialist
**And** the application SHALL have structured fields (approach, questions, estimatedEffort)

**Acceptance Criteria**:
- Test uses `createTestUser(tx, { role: 'SPECIALIST' })` to create specialist
- Test uses `createTestApplication(tx, { gigId, specialistId })` to create application
- Application has status PENDING
- Application has realistic Russian content in approach and questions fields
- Database query confirms application exists and is linked correctly

#### Scenario: Client reviews and accepts application via UI

**Given** the client is on the gig detail page
**And** the gig has a PENDING application
**When** the test clicks the "Accept" button for the application
**Then** the gig status SHALL change to IN_PROGRESS
**And** the application status SHALL change to ACCEPTED
**And** the gig SHALL have assignedSpecialistId set
**And** other applications (if any) SHALL be REJECTED

**Acceptance Criteria**:
- Test is on `/dashboard/gigs/[id]` page
- Test locates "Accept" button for the application
- Test clicks the button
- Test waits for page reload or status update
- Test verifies gig status displays "IN_PROGRESS" or equivalent
- Database query confirms: gig.status = IN_PROGRESS, gig.assignedSpecialistId = specialistId, application.status = ACCEPTED

#### Scenario: Specialist submits work (programmatic)

**Given** the gig has status IN_PROGRESS and an assigned specialist
**When** the test calls `submitWork` server action programmatically
**Then** the gig status SHALL change to REVIEW
**And** the gig SHALL have workSubmittedAt timestamp

**Acceptance Criteria**:
- Test uses `withAuthContext(specialist, async () => { await submitWork(gigId, formData) })`
- FormData includes workDescription field with Russian content
- Server action executes successfully
- Database query confirms: gig.status = REVIEW, gig.workSubmittedAt is not null

#### Scenario: Client approves work via UI

**Given** the client is on the gig detail page
**And** the gig has status REVIEW
**When** the test clicks the "Approve Work" button
**Then** the gig status SHALL change to COMPLETED
**And** the gig SHALL have completedAt timestamp

**Acceptance Criteria**:
- Test is on `/dashboard/gigs/[id]` page
- Test locates "Approve Work" button
- Test clicks the button
- Test waits for page reload or status update
- Test verifies gig status displays "COMPLETED" or equivalent
- Database query confirms: gig.status = COMPLETED, gig.completedAt is not null

#### Scenario: Client marks gig as paid via UI

**Given** the client is on the gig detail page
**And** the gig has status COMPLETED
**When** the test clicks the "Mark as Paid" button
**Then** the gig status SHALL change to PAID
**And** the gig SHALL have paidAt timestamp

**Acceptance Criteria**:
- Test is on `/dashboard/gigs/[id]` page
- Test locates "Mark as Paid" button
- Test clicks the button
- Test waits for page reload or status update
- Test verifies gig status displays "PAID" or equivalent
- Database query confirms: gig.status = PAID, gig.paidAt is not null

#### Scenario: Final state verification

**Given** the client journey test has completed all steps
**When** the test performs final verification
**Then** the gig SHALL have status PAID
**And** the gig SHALL have all expected timestamps (createdAt, workSubmittedAt, completedAt, paidAt)
**And** the gig SHALL have assignedSpecialistId set
**And** the application SHALL have status ACCEPTED
**And** the client and specialist users SHALL exist with correct profiles

**Acceptance Criteria**:
- Test queries database for final gig state
- All assertions pass:
  - gig.status === 'PAID'
  - gig.assignedSpecialistId === specialistId
  - gig.paidAt !== null
  - gig.completedAt !== null
  - gig.workSubmittedAt !== null
  - application.status === 'ACCEPTED'
  - client user exists with ClientProfile
  - specialist user exists with SpecialistProfile

#### Scenario: Test is idempotent

**Given** the client journey test has run once
**When** the test runs again
**Then** the test SHALL pass again
**And** no unique constraint violations SHALL occur
**And** no stale data from previous run SHALL interfere

**Acceptance Criteria**:
- Test uses unique email addresses (timestamp-based)
- Test uses test database with proper cleanup
- Run test 10 times consecutively: `for i in {1..10}; do npm run test:e2e -- client-journey.spec.ts; done`
- All 10 runs pass
- No database errors occur

#### Scenario: Test uses realistic Russian data

**Given** the test creates users, gigs, and applications
**When** the test generates data
**Then** all text content SHALL be in Russian
**And** company names SHALL follow Russian conventions (ООО, etc.)
**And** INN SHALL be realistic (10 digits)
**And** gig titles and descriptions SHALL be in Russian
**And** budget values SHALL be realistic (e.g., 150000 kopecks = 1500 RUB)

**Acceptance Criteria**:
- Client companyName uses Russian company name (e.g., "ООО \"ТехноСтарт\"")
- Client INN is 10 digits (e.g., "7743013902")
- Gig title is Russian (e.g., "Разработка REST API для мобильного приложения")
- Gig description is Russian
- Application approach and questions are Russian
- All data passes validation
- Verify by inspecting test output or database records

---

### Requirement: E2E Test Helper for Programmatic Server Actions

The platform SHALL provide a helper function to execute server actions programmatically within E2E tests with proper authentication context.

#### Scenario: Execute server action in E2E test context

**Given** an E2E test needs to execute a server action programmatically
**When** the test calls `executeServerAction(user, action, ...args)`
**Then** the server action SHALL execute with the user's authentication context
**And** the action SHALL see the user as authenticated via `getSession()`
**And** the result SHALL be returned to the test

**Acceptance Criteria**:
- Helper function exists (may reuse existing `withAuthContext` from integration tests)
- Function accepts user object, server action, and arguments
- Server action executes successfully
- Test can verify action results via database queries
- Example: `await executeServerAction(specialist, submitWork, gigId, formData)`

#### Scenario: Helper works with FormData arguments

**Given** a server action accepts FormData
**When** the test calls the helper with FormData argument
**Then** the FormData SHALL be passed correctly
**And** the action SHALL process it normally

**Acceptance Criteria**:
- Helper works with FormData arguments
- Helper works with plain object arguments
- Test `submitWork` action with FormData containing workDescription
