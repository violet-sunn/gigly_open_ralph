# Testing Specification Delta

## ADDED Requirements

### Requirement: Admin Moderation E2E Test

The platform SHALL provide a comprehensive end-to-end test that validates the complete admin moderation workflow using Playwright browser automation.

#### Scenario: Complete admin moderation test passes

**Given** the test database is clean and the Next.js dev server is running
**When** the E2E test `admin-moderation.spec.ts` executes
**Then** the test SHALL complete all 8 steps of the admin moderation workflow
**And** the test SHALL pass all assertions
**And** the test SHALL complete in under 30 seconds
**And** the final state SHALL show suspended user and closed gig

**Acceptance Criteria**:
- Test file exists at `__tests__/e2e/admin-moderation.spec.ts`
- Test executes all steps: setup → admin login → suspend user → verify suspension → admin re-login → close gig → verify closure → verify moderation history
- All assertions pass
- Test completes in < 30 seconds
- Run `npm run test:e2e -- admin-moderation.spec.ts` and verify exit code 0

#### Scenario: Test setup creates users and gigs programmatically

**Given** the test begins execution
**When** the test performs setup
**Then** a CLIENT user SHALL be created programmatically
**And** a SPECIALIST user SHALL be created programmatically
**And** an ADMIN user SHALL be created programmatically
**And** at least one OPEN gig SHALL be created programmatically
**And** all users SHALL have realistic Russian data

**Acceptance Criteria**:
- Uses `createTestUser(prisma, { role: 'CLIENT' })` to create client with ClientProfile
- Uses `createTestUser(prisma, { role: 'SPECIALIST' })` to create specialist with SpecialistProfile
- Uses `createTestUser(prisma, { role: 'ADMIN' })` to create admin user
- Uses `createTestGig(prisma, { clientId })` to create gig with status OPEN
- All users have unique email addresses (timestamp + random suffix)
- CLIENT has Russian companyName and realistic INN
- SPECIALIST has Russian displayName
- Gig has Russian title and description
- Database queries confirm all entities exist

#### Scenario: Admin authenticates via UI

**Given** an ADMIN user exists in the database
**When** the test navigates to `/login`
**And** the test fills email and password fields
**And** the test submits the login form
**Then** the browser SHALL redirect to `/dashboard`
**And** the session cookie SHALL be set
**And** subsequent requests SHALL be authenticated as ADMIN

**Acceptance Criteria**:
- Test uses `page.goto('http://localhost:3000/login')`
- Test fills `input[name="email"]` with admin email
- Test fills `input[name="password"]` with admin password
- Test clicks login button
- Test waits for navigation to `/dashboard` with `page.waitForURL(/\/dashboard/)`
- Test verifies URL is `/dashboard`
- Session cookie exists in browser context

#### Scenario: Admin suspends user via UI

**Given** the admin is authenticated
**And** a SPECIALIST user exists
**When** the test navigates to `/admin/users`
**And** the test locates the specialist user in the list
**And** the test fills the suspend reason field
**And** the test clicks the "Suspend" button
**Then** the user SHALL be suspended in the database
**And** a ModerationLog entry SHALL be created
**And** the page SHALL reload or update to show suspended status

**Acceptance Criteria**:
- Test navigates to `/admin/users`
- Test locates user by email or ID in the user list
- Test fills suspend reason textarea with Russian text (e.g., "Нарушение правил платформы")
- Test clicks suspend button
- Test waits for page reload with `page.waitForLoadState('networkidle')`
- Database query confirms: `user.suspended = true`
- Database query confirms ModerationLog entry exists with:
  - `action = 'SUSPEND_USER'`
  - `targetUserId = specialistId`
  - `adminId = adminId`
  - `reason` contains Russian text
- Console log confirms suspension

#### Scenario: Suspended user cannot login via UI

**Given** a user has been suspended
**When** the test logs out the admin
**And** the test navigates to `/login`
**And** the test fills the suspended user's email and password
**And** the test submits the login form
**Then** the login SHALL fail
**And** an error message SHALL be displayed
**And** the user SHALL NOT be redirected to `/dashboard`
**And** no session cookie SHALL be set

**Acceptance Criteria**:
- Test clicks logout button or navigates to logout action
- Test waits for redirect to `/` (home page)
- Test navigates to `/login`
- Test fills email with suspended user's email
- Test fills password with suspended user's password
- Test clicks login button
- Test waits for error message to appear
- Test verifies error message contains text about suspension (e.g., "suspended", "заблокирован")
- Test verifies URL is still `/login` (no redirect to dashboard)
- Test verifies no session cookie exists for suspended user
- Console log confirms login blocked

#### Scenario: Admin re-authenticates after logout

**Given** the admin has logged out
**When** the test navigates to `/login`
**And** the test fills admin email and password
**And** the test submits the login form
**Then** the browser SHALL redirect to `/dashboard`
**And** the admin session SHALL be restored

**Acceptance Criteria**:
- Test navigates to `/login`
- Test fills admin credentials
- Test clicks login button
- Test waits for navigation to `/dashboard`
- Test verifies URL is `/dashboard`
- Admin session cookie exists

#### Scenario: Admin closes gig via UI

**Given** the admin is authenticated
**And** an OPEN gig exists
**When** the test navigates to `/admin/gigs`
**And** the test locates the gig in the list
**And** the test fills the close reason field
**And** the test clicks the "Close Gig" button
**Then** the gig SHALL be closed in the database
**And** a ModerationLog entry SHALL be created
**And** the page SHALL reload or update to show closed status

**Acceptance Criteria**:
- Test navigates to `/admin/gigs`
- Test locates gig by title or ID in the gig list
- Test fills close reason textarea with Russian text (e.g., "Нарушение условий платформы")
- Test clicks close gig button
- Test waits for page reload with `page.waitForLoadState('networkidle')`
- Database query confirms: `gig.closedByAdmin = true`, `gig.closedAt` is not null
- Database query confirms ModerationLog entry exists with:
  - `action = 'CLOSE_GIG'`
  - `targetGigId = gigId`
  - `adminId = adminId`
  - `reason` contains Russian text
- Console log confirms gig closure

#### Scenario: Closed gig is visible as closed

**Given** a gig has been closed by admin
**When** the test queries the database
**Then** the gig SHALL have `closedByAdmin = true`
**And** the gig SHALL have `closedAt` timestamp
**And** the gig SHALL NOT accept new applications (verified by business logic, not UI)

**Acceptance Criteria**:
- Database query confirms gig.closedByAdmin = true
- Database query confirms gig.closedAt is not null
- Console log confirms closed status
- (Optional) Test could verify that application form is not visible on gig detail page

#### Scenario: Moderation history is visible in admin dashboard

**Given** moderation actions have been performed (suspend user, close gig)
**When** the test navigates to `/admin` or `/admin/users` or `/admin/gigs`
**Then** the moderation logs SHALL be visible
**And** the logs SHALL show the actions performed
**And** the logs SHALL show the admin who performed the actions
**And** the logs SHALL show the reasons provided

**Acceptance Criteria**:
- Test navigates to admin page that displays moderation logs
- Test verifies at least 2 moderation log entries are visible (suspend user, close gig)
- Test verifies log entries contain action types (SUSPEND_USER, CLOSE_GIG)
- Test verifies log entries contain reasons in Russian
- Test verifies log entries contain timestamps
- Database query confirms ModerationLog entries exist with correct data
- Console log confirms moderation history visibility

#### Scenario: Test is idempotent

**Given** the admin moderation test has run once
**When** the test runs again
**Then** the test SHALL pass again
**And** no unique constraint violations SHALL occur
**And** no stale data from previous run SHALL interfere

**Acceptance Criteria**:
- Test uses unique email addresses (timestamp + random suffix)
- Test uses test database with proper cleanup in `afterEach` hook
- Run test 10 times consecutively and verify all pass
- No database errors occur
- Each run creates fresh users and gigs

#### Scenario: Test uses realistic Russian data

**Given** the test creates users, gigs, and moderation actions
**When** the test generates data
**Then** all text content SHALL be in Russian where appropriate
**And** user names SHALL be Russian names
**And** company names SHALL follow Russian conventions
**And** moderation reasons SHALL be in Russian
**And** all data SHALL pass validation

**Acceptance Criteria**:
- SPECIALIST displayName uses Russian name (e.g., "Александр Петров")
- CLIENT companyName uses Russian company name (e.g., "ООО \"ТехноСтарт\"")
- CLIENT INN is realistic (10 digits)
- Gig title and description are in Russian
- Suspend reason is in Russian (e.g., "Нарушение правил платформы")
- Close gig reason is in Russian (e.g., "Нарушение условий платформы")
- All data passes model validation
- Verify by inspecting test output or database records

#### Scenario: Test cleanup removes all test data

**Given** the test has completed (pass or fail)
**When** the afterEach hook executes
**Then** all test data SHALL be removed from the database
**And** no orphaned records SHALL remain

**Acceptance Criteria**:
- afterEach hook deletes ModerationLog, Application, Gig, User records in correct order
- Uses `await prisma.[model].deleteMany({})` for each model
- Respects foreign key constraints (delete children before parents)
- afterAll hook disconnects Prisma client
- Database is clean after test run
- Verify with database query after test completion

---

### Requirement: E2E Test Documentation Update

The platform SHALL update E2E test documentation to include the admin moderation test.

#### Scenario: TESTING.md documents admin moderation E2E test

**Given** `TESTING.md` exists
**When** a developer reads the E2E testing section
**Then** documentation SHALL mention the admin moderation E2E test
**And** documentation SHALL explain what the test covers
**And** documentation SHALL provide the command to run the test

**Acceptance Criteria**:
- `TESTING.md` includes reference to `admin-moderation.spec.ts`
- Documentation explains test covers: user suspension, login blocking, gig closure, moderation history
- Documentation includes command: `npm run test:e2e -- admin-moderation.spec.ts`
- Documentation is consistent with other E2E test documentation
