# Testing Specification Delta

## ADDED Requirements

### Requirement: Specialist Journey E2E Test

The platform SHALL provide a comprehensive end-to-end test that validates the complete specialist journey from authentication through gig completion using Playwright browser automation.

#### Scenario: Complete specialist journey test passes

**Given** the test database is clean and the Next.js dev server is running
**When** the E2E test `specialist-journey.spec.ts` executes
**Then** the test SHALL complete all 8 steps of the specialist journey
**And** the test SHALL pass all assertions
**And** the test SHALL complete in under 30 seconds
**And** the final gig status SHALL be COMPLETED

**Acceptance Criteria**:
- Test file exists at `__tests__/e2e/specialist-journey.spec.ts`
- Test executes all steps: setup gig → authenticate specialist → browse gigs → view detail → apply → wait for acceptance → submit work → wait for approval → verify completion
- All assertions pass
- Test completes in < 30 seconds
- Run `npm run test:e2e -- specialist-journey.spec.ts` and verify exit code 0

#### Scenario: Test setup creates client and gig programmatically

**Given** the test begins execution
**When** the test performs setup
**Then** a CLIENT user SHALL be created programmatically
**And** an OPEN gig SHALL be created programmatically
**And** the gig SHALL have realistic Russian content
**And** the gig SHALL be ready for specialist applications

**Acceptance Criteria**:
- Uses `createTestUser(prisma, { role: 'CLIENT' })` to create client
- Uses `createTestGig(prisma, { clientId })` to create gig
- Gig has status OPEN
- Gig has Russian title and description
- Gig has realistic budget (e.g., 150000 kopecks)
- Database query confirms gig exists

#### Scenario: Specialist authenticates programmatically

**Given** the test has completed setup
**When** the test creates a specialist user
**Then** a SPECIALIST user SHALL be created with profile
**And** a valid session token SHALL be generated
**And** the session cookie SHALL be set in browser context
**And** subsequent page navigations SHALL maintain authenticated session

**Acceptance Criteria**:
- Uses `createTestUser(prisma, { role: 'SPECIALIST' })` to create specialist
- Uses `createTestSession(specialist)` to generate JWT token
- Uses `page.context().addCookies([...])` to set session cookie
- Cookie configuration matches production (httpOnly, sameSite, path)
- Specialist has SpecialistProfile with Russian displayName
- Specialist has realistic techStack and experienceLevel

#### Scenario: Specialist browses gigs via UI

**Given** the specialist is authenticated
**When** the test navigates to `/dashboard/gigs`
**Then** the gig browsing page SHALL load
**And** the page SHALL display the OPEN gig created in setup
**And** the gig title SHALL be visible
**And** the gig budget SHALL be visible

**Acceptance Criteria**:
- Test uses `page.goto('http://localhost:3000/dashboard/gigs')`
- Test waits for page load with `page.waitForLoadState('networkidle')`
- Test verifies URL is `/dashboard/gigs`
- Test locates gig title on page using `page.locator()`
- Gig is visible and clickable

#### Scenario: Specialist views gig detail via UI

**Given** the specialist is on the gig browsing page
**When** the test clicks on the gig
**Then** the browser SHALL navigate to `/dashboard/gigs/[id]`
**And** the gig detail page SHALL load
**And** the page SHALL display gig title, description, budget
**And** the page SHALL display the application form

**Acceptance Criteria**:
- Test clicks on gig link or card
- Test waits for navigation to gig detail page
- Test verifies URL matches `/dashboard/gigs/[gigId]`
- Test verifies gig title is visible
- Test verifies application form fields are visible (approach, questions, estimatedEffort)

#### Scenario: Specialist applies to gig via UI

**Given** the specialist is on the gig detail page
**When** the test fills the application form with structured fields
**And** the test submits the application
**Then** the application SHALL be created in the database
**And** the application SHALL have status PENDING
**And** the application SHALL have Russian content in approach and questions fields
**And** the page SHALL reload or redirect

**Acceptance Criteria**:
- Test fills `textarea[name="approach"]` with Russian technical approach (100-2000 chars)
- Test fills `textarea[name="questions"]` with Russian clarifying questions (50-1000 chars)
- Test fills `input[name="estimatedEffort"]` with realistic effort estimate (optional)
- Test clicks submit button
- Test waits for page reload with `page.waitForLoadState('networkidle')`
- Database query confirms application exists with status PENDING
- Application has correct gigId and specialistId

#### Scenario: Application is accepted (programmatic)

**Given** the specialist has applied to the gig
**When** the test accepts the application programmatically
**Then** the gig status SHALL change to IN_PROGRESS
**And** the application status SHALL change to ACCEPTED
**And** the gig SHALL have assignedSpecialistId set

**Acceptance Criteria**:
- Test uses direct database update: `prisma.gig.update({ where: { id: gigId }, data: { status: 'IN_PROGRESS', assignedSpecialistId: specialistId } })`
- Test uses direct database update: `prisma.application.update({ where: { id: applicationId }, data: { status: 'ACCEPTED' } })`
- Database query confirms gig.status = IN_PROGRESS
- Database query confirms application.status = ACCEPTED
- Database query confirms gig.assignedSpecialistId = specialistId
- Console log confirms acceptance

#### Scenario: Specialist submits work via UI

**Given** the gig has status IN_PROGRESS and specialist is assigned
**When** the test navigates to the gig detail page
**And** the test fills the work submission form
**And** the test submits the form
**Then** the gig status SHALL change to REVIEW
**And** the gig SHALL have workSubmittedAt timestamp
**And** the page SHALL reload or redirect

**Acceptance Criteria**:
- Test navigates to `/dashboard/gigs/[gigId]`
- Test locates work submission form (textarea for work description)
- Test fills work description with Russian content
- Test clicks "Submit Work" button
- Test waits for page reload
- Test polls database until gig.status = REVIEW (with timeout)
- Database query confirms gig.workSubmittedAt is not null
- Console log confirms work submission

#### Scenario: Work is approved (programmatic)

**Given** the gig has status REVIEW
**When** the test approves the work programmatically
**Then** the gig status SHALL change to COMPLETED
**And** the gig SHALL have completedAt timestamp

**Acceptance Criteria**:
- Test uses direct database update: `prisma.gig.update({ where: { id: gigId }, data: { status: 'COMPLETED', completedAt: new Date() } })`
- Database query confirms gig.status = COMPLETED
- Database query confirms gig.completedAt is not null
- Console log confirms work approval

#### Scenario: Final state verification

**Given** the specialist journey test has completed all steps
**When** the test performs final verification
**Then** the gig SHALL have status COMPLETED
**And** the gig SHALL have assignedSpecialistId set to specialist
**And** the application SHALL have status ACCEPTED
**And** the gig SHALL have all expected timestamps (createdAt, workSubmittedAt, completedAt)
**And** the specialist user SHALL exist with correct profile

**Acceptance Criteria**:
- Test queries database for final gig state with all relations
- All assertions pass:
  - gig.status === 'COMPLETED'
  - gig.assignedSpecialistId === specialistId
  - gig.completedAt !== null
  - gig.workSubmittedAt !== null
  - application.status === 'ACCEPTED'
  - specialist user exists with SpecialistProfile
  - specialist.specialistProfile.displayName is Russian name
- Console log confirms test completion with summary

#### Scenario: Test is idempotent

**Given** the specialist journey test has run once
**When** the test runs again
**Then** the test SHALL pass again
**And** no unique constraint violations SHALL occur
**And** no stale data from previous run SHALL interfere

**Acceptance Criteria**:
- Test uses unique email addresses (timestamp + random suffix)
- Test uses test database with proper cleanup in afterEach hook
- Run test 10 times consecutively and verify all pass
- No database errors occur
- Each run creates fresh users and gigs

#### Scenario: Test uses realistic Russian data

**Given** the test creates users, gigs, and applications
**When** the test generates data
**Then** all text content SHALL be in Russian
**And** specialist displayName SHALL be a Russian name
**And** gig titles and descriptions SHALL be in Russian
**And** application approach and questions SHALL be in Russian
**And** all data SHALL pass validation

**Acceptance Criteria**:
- Specialist displayName uses Russian name (e.g., "Александр Петров")
- Specialist techStack is realistic (e.g., "React, TypeScript, Node.js")
- Gig title is Russian (e.g., "Разработка REST API")
- Gig description is Russian
- Application approach is Russian (100-2000 chars)
- Application questions is Russian (50-1000 chars)
- All data passes model validation
- Verify by inspecting test output or database records

#### Scenario: Test cleanup removes all test data

**Given** the test has completed (pass or fail)
**When** the afterEach hook executes
**Then** all test data SHALL be removed from the database
**And** no orphaned records SHALL remain

**Acceptance Criteria**:
- afterEach hook deletes messages, applications, gigs, users in correct order
- Uses `await prisma.[model].deleteMany({})` for each model
- Respects foreign key constraints (delete children before parents)
- afterAll hook disconnects Prisma client
- Database is clean after test run
- Verify with database query after test completion
