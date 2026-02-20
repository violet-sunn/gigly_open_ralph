# Testing Specification Delta

## ADDED Requirements

### Requirement: Messaging Flow E2E Test

The platform SHALL provide a comprehensive end-to-end test that validates the complete messaging flow between client and specialist using Playwright browser automation.

#### Scenario: Complete messaging flow test passes

**Given** the test database is clean and the Next.js dev server is running
**When** the E2E test `messaging-flow-e2e.spec.ts` executes
**Then** the test SHALL complete all steps of the messaging flow
**And** the test SHALL pass all assertions
**And** the test SHALL complete in under 30 seconds
**And** messages SHALL be visible to both client and specialist
**And** messages SHALL be ordered chronologically

**Acceptance Criteria**:
- Test file exists at `__tests__/e2e/messaging-flow-e2e.spec.ts`
- Test executes all steps: setup → client sends → specialist receives/replies → client receives reply → verify ordering
- All assertions pass
- Test completes in < 30 seconds
- Run `npm run test:e2e -- messaging-flow-e2e.spec.ts` and verify exit code 0

---

### Requirement: Test Setup with Assigned Specialist

The messaging flow test SHALL create a gig with an assigned specialist programmatically to enable messaging functionality.

#### Scenario: Test setup creates gig with assigned specialist

**Given** the test begins execution
**When** the test performs setup
**Then** a CLIENT user SHALL be created with profile
**And** an OPEN gig SHALL be created
**And** a SPECIALIST user SHALL be created with profile
**And** an application SHALL be created and accepted
**And** the gig status SHALL be IN_PROGRESS
**And** the gig SHALL have assignedSpecialistId set
**And** messaging SHALL be available for the gig

**Acceptance Criteria**:
- Uses `createTestUser(prisma, { role: 'CLIENT' })` to create client
- Uses `createTestGig(prisma, { clientId, status: 'OPEN' })` to create gig
- Uses `createTestUser(prisma, { role: 'SPECIALIST' })` to create specialist
- Uses `createTestApplication(prisma, { gigId, specialistId, status: 'ACCEPTED' })` to create application
- Updates gig: `status: 'IN_PROGRESS'`, `assignedSpecialistId: specialistId`
- Database query confirms gig has assigned specialist
- Both users have realistic Russian profile data

---

### Requirement: Client Sends Message via UI

The messaging flow test SHALL authenticate as client and send a message via the message form UI.

#### Scenario: Client sends message via UI

**Given** the test has completed setup with assigned specialist
**When** the test authenticates as client via session cookie
**And** the test navigates to the gig detail page
**And** the test fills the message form with Russian content
**And** the test submits the message form
**Then** the message SHALL be created in the database
**And** the message SHALL be visible on the page
**And** the message SHALL have correct gigId and senderId (client)
**And** the page SHALL reload or update to show the message

**Acceptance Criteria**:
- Uses `createTestSession(client)` to generate JWT token
- Uses `page.context().addCookies([...])` to set session cookie
- Navigates to `/dashboard/gigs/[gigId]`
- Locates message form: `textarea[name="content"]` or similar
- Fills form with Russian message content (e.g., "Добрый день! Когда сможете начать работу?")
- Clicks submit button
- Waits for page reload with `page.waitForLoadState('networkidle')`
- Verifies message appears on page using `page.locator()`
- Database query confirms message exists with correct gigId, senderId, content
- Message content is 50-500 characters (realistic length)

---

### Requirement: User Switching via Session Management

The messaging flow test SHALL switch between client and specialist users by clearing and setting session cookies.

#### Scenario: Switch from client to specialist

**Given** the client is authenticated and has sent a message
**When** the test clears all cookies
**And** the test sets specialist session cookie
**And** the test navigates to the gig detail page
**Then** the specialist SHALL be authenticated
**And** the specialist SHALL see the gig detail page
**And** the specialist SHALL see the client's message

**Acceptance Criteria**:
- Uses `page.context().clearCookies()` to clear client session
- Uses `createTestSession(specialist)` to generate specialist JWT token
- Uses `page.context().addCookies([...])` to set specialist session cookie
- Navigates to `/dashboard/gigs/[gigId]`
- Page loads successfully (no redirect to login)
- Client's message is visible on the page
- No authentication errors occur

#### Scenario: Switch from specialist back to client

**Given** the specialist is authenticated and has sent a reply
**When** the test clears all cookies
**And** the test sets client session cookie
**And** the test navigates to the gig detail page
**Then** the client SHALL be authenticated
**And** the client SHALL see the gig detail page
**And** the client SHALL see both messages (original and reply)

**Acceptance Criteria**:
- Uses `page.context().clearCookies()` to clear specialist session
- Uses `createTestSession(client)` to generate client JWT token
- Uses `page.context().addCookies([...])` to set client session cookie
- Navigates to `/dashboard/gigs/[gigId]`
- Page loads successfully
- Both messages are visible on the page
- No authentication errors occur

---

### Requirement: Specialist Receives and Views Message

The messaging flow test SHALL verify that the specialist can see the client's message after authenticating.

#### Scenario: Specialist views client message

**Given** the client has sent a message
**And** the test has switched to specialist session
**When** the test navigates to the gig detail page
**Then** the client's message SHALL be visible on the page
**And** the message SHALL display the correct content
**And** the message SHALL be visually distinguished as client message (left-aligned, blue accent)

**Acceptance Criteria**:
- Navigates to `/dashboard/gigs/[gigId]` as specialist
- Locates client's message using `page.locator()` with message content
- Verifies message is visible with `expect(messageElement).toBeVisible()`
- Message content matches what client sent
- Message is displayed in the correct visual style (client messages are left-aligned)
- No errors or missing messages

---

### Requirement: Specialist Sends Reply via UI

The messaging flow test SHALL authenticate as specialist and send a reply message via the message form UI.

#### Scenario: Specialist sends reply via UI

**Given** the specialist is authenticated and viewing the gig detail page
**When** the test fills the message form with Russian reply content
**And** the test submits the message form
**Then** the reply message SHALL be created in the database
**And** the reply message SHALL be visible on the page
**And** the reply message SHALL have correct gigId and senderId (specialist)
**And** the page SHALL reload or update to show the reply

**Acceptance Criteria**:
- Specialist is authenticated via session cookie
- On gig detail page `/dashboard/gigs/[gigId]`
- Locates message form: `textarea[name="content"]` or similar
- Fills form with Russian reply content (e.g., "Могу начать завтра. Уточните требования к API.")
- Clicks submit button
- Waits for page reload with `page.waitForLoadState('networkidle')`
- Verifies reply appears on page using `page.locator()`
- Database query confirms reply exists with correct gigId, senderId (specialist), content
- Reply content is 50-500 characters (realistic length)

---

### Requirement: Client Receives and Views Reply

The messaging flow test SHALL verify that the client can see both the original message and the specialist's reply after re-authenticating.

#### Scenario: Client views both messages

**Given** the specialist has sent a reply
**And** the test has switched back to client session
**When** the test navigates to the gig detail page
**Then** both messages SHALL be visible on the page
**And** the client's original message SHALL be visible
**And** the specialist's reply SHALL be visible
**And** messages SHALL be visually distinguished (client left/blue, specialist right/green)

**Acceptance Criteria**:
- Navigates to `/dashboard/gigs/[gigId]` as client
- Locates both messages using `page.locator()` with message content
- Verifies both messages are visible with `expect(messageElement).toBeVisible()`
- Client message content matches original
- Specialist reply content matches what specialist sent
- Messages are displayed in correct visual styles (client left, specialist right)
- No errors or missing messages

---

### Requirement: Chronological Message Ordering

The messaging flow test SHALL verify that messages are displayed in chronological order (oldest first).

#### Scenario: Messages are ordered chronologically

**Given** the client has sent a message
**And** the specialist has sent a reply
**When** the test views the gig detail page (as either user)
**Then** messages SHALL be displayed in chronological order
**And** the client's message SHALL appear before the specialist's reply
**And** message timestamps SHALL be in ascending order

**Acceptance Criteria**:
- Both messages are visible on the page
- Client message appears before specialist reply in DOM order
- Uses `page.locator()` to get all messages in order
- Verifies first message is client's message
- Verifies second message is specialist's reply
- Database query confirms messages have ascending createdAt timestamps
- Visual order matches database order

#### Scenario: Chronological ordering verified in database

**Given** the test has completed message exchange
**When** the test queries messages from database
**Then** messages SHALL be ordered by createdAt ascending
**And** client message createdAt SHALL be before specialist reply createdAt
**And** message count SHALL be exactly 2

**Acceptance Criteria**:
- Query: `prisma.message.findMany({ where: { gigId }, orderBy: { createdAt: 'asc' } })`
- Result has exactly 2 messages
- First message: senderId = client.id, content = client's message
- Second message: senderId = specialist.id, content = specialist's reply
- First message createdAt < second message createdAt
- Timestamps are distinct (no collision)

---

### Requirement: Test Data Cleanup

The messaging flow test SHALL clean up all test data after execution to prevent test pollution.

#### Scenario: Test cleanup removes all test data

**Given** the test has completed (pass or fail)
**When** the afterEach hook executes
**Then** all messages SHALL be deleted
**And** all applications SHALL be deleted
**And** all gigs SHALL be deleted
**And** all users SHALL be deleted
**And** no orphaned records SHALL remain

**Acceptance Criteria**:
- afterEach hook deletes in correct order: messages → applications → gigs → users
- Uses `await prisma.[model].deleteMany({})` for each model
- Respects foreign key constraints (delete children before parents)
- afterAll hook disconnects Prisma client
- Database is clean after test run
- Verify with database query after test completion

---

### Requirement: Test Uses Realistic Russian Data

The messaging flow test SHALL use realistic Russian message content and user data.

#### Scenario: Test uses Russian message content

**Given** the test creates messages
**When** messages are sent by client and specialist
**Then** all message content SHALL be in Russian
**And** messages SHALL be realistic and contextually appropriate
**And** messages SHALL be 50-500 characters (realistic length)

**Acceptance Criteria**:
- Client message is Russian (e.g., "Добрый день! Когда сможете начать работу? Есть ли у вас опыт с PostgreSQL?")
- Specialist reply is Russian (e.g., "Могу начать завтра. Опыт с PostgreSQL более 5 лет. Уточните требования к производительности API.")
- Messages are contextually appropriate for gig communication
- Messages pass validation (non-empty, max 2000 chars)
- User profiles have Russian names and company names
- All data passes model validation

#### Scenario: Test uses realistic user data

**Given** the test creates users
**When** users are created
**Then** client SHALL have Russian company name and realistic INN
**And** specialist SHALL have Russian display name and realistic tech stack
**And** all profile data SHALL pass validation

**Acceptance Criteria**:
- Client companyName: Russian (e.g., "ООО \"ТехноСтарт\"")
- Client INN: 10 digits (e.g., "7743013902")
- Specialist displayName: Russian name (e.g., "Дмитрий Соколов")
- Specialist techStack: realistic (e.g., "React, TypeScript, Node.js, PostgreSQL")
- Specialist experienceLevel: "SENIOR" or "MIDDLE"
- All data passes model validation

---

### Requirement: Test Idempotency

The messaging flow test SHALL be idempotent and run successfully multiple times without conflicts.

#### Scenario: Test runs successfully multiple times

**Given** the messaging flow test has run once
**When** the test runs again
**Then** the test SHALL pass again
**And** no unique constraint violations SHALL occur
**And** no stale data from previous run SHALL interfere

**Acceptance Criteria**:
- Test uses unique email addresses (timestamp + random suffix)
- Test uses test database with proper cleanup
- Run test 10 times consecutively: `for i in {1..10}; do npm run test:e2e -- messaging-flow-e2e.spec.ts; done`
- All 10 runs pass
- No database errors occur
- Each run creates fresh users, gigs, and messages

---

### Requirement: Test Performance

The messaging flow test SHALL complete in under 30 seconds to maintain fast feedback cycles.

#### Scenario: Test completes within time limit

**Given** the test executes all steps
**When** the test completes
**Then** total execution time SHALL be under 30 seconds
**And** no unnecessary delays SHALL be present

**Acceptance Criteria**:
- Test completes in < 30 seconds on typical development machine
- Uses efficient waits (`waitForLoadState`, `waitForSelector`) instead of fixed timeouts
- Minimizes use of `page.waitForTimeout()` (only when necessary)
- Database operations are fast (in-memory SQLite)
- Run test and verify execution time: `time npm run test:e2e -- messaging-flow-e2e.spec.ts`
