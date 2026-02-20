# Implementation Tasks

## Task 1: Create test file structure and setup

**Implementation**:
- Create `__tests__/e2e/messaging-flow-e2e.spec.ts`
- Import required dependencies: `@playwright/test`, `@prisma/client`, `@prisma/adapter-libsql`
- Import test helpers: `createTestUser`, `createTestGig`, `createTestApplication`, `createTestSession` from `../helpers/seed` and `../helpers/auth`
- Set up Prisma client with test database adapter
- Create test.describe block: `'Messaging Flow E2E'`
- Add afterEach hook to clean up test data (messages → applications → gigs → users)
- Add afterAll hook to disconnect Prisma client

**Test Plan**:
- Run `npm run test:e2e -- messaging-flow-e2e.spec.ts`
- Verify test file is discovered by Playwright
- Verify cleanup hooks execute without errors
- Verify Prisma client connects and disconnects properly

---

## Task 2: Implement test setup phase (programmatic)

**Implementation**:
- Create CLIENT user with realistic Russian profile data:
  - Unique email: `client-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
  - Password: `'TestPassword123!'`
  - companyName: `'ООО "ТехноСтарт"'`
  - inn: `'7743013902'`
- Create OPEN gig with Russian content:
  - title: `'Разработка REST API для мобильного приложения'`
  - description: Russian description (2-3 sentences)
  - acceptanceCriteria: Russian criteria (≥50 chars)
  - budget: `150000` (kopecks)
  - tags: `'React,TypeScript,Node.js'`
  - status: `'OPEN'`
- Create SPECIALIST user with realistic Russian profile data:
  - Unique email: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
  - Password: `'TestPassword123!'`
  - displayName: `'Дмитрий Соколов'`
  - techStack: `'React, TypeScript, Node.js, PostgreSQL'`
  - experienceLevel: `'SENIOR'`
- Create application with Russian structured fields:
  - approach: Russian technical approach (100-2000 chars)
  - questions: Russian clarifying questions (50-1000 chars)
  - estimatedEffort: `'2 недели (80 часов)'`
  - status: `'ACCEPTED'`
- Update gig to IN_PROGRESS with assignedSpecialistId
- Add console.log statements for each setup step
- Add database verification queries after each creation

**Test Plan**:
- Run test and verify setup completes without errors
- Verify client user exists with ClientProfile
- Verify specialist user exists with SpecialistProfile
- Verify gig exists with status IN_PROGRESS and assignedSpecialistId set
- Verify application exists with status ACCEPTED
- Check console output for setup confirmation messages

---

## Task 3: Implement client authentication and message sending (UI)

**Implementation**:
- Generate JWT session token for client using `createTestSession(client)`
- Set session cookie in browser context:
  ```typescript
  await page.context().addCookies([{
    name: 'session',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  }])
  ```
- Navigate to gig detail page: `await page.goto(\`http://localhost:3000/dashboard/gigs/\${gigId}\`)`
- Wait for page load: `await page.waitForLoadState('networkidle')`
- Verify URL matches gig detail page
- Locate message form textarea: `page.locator('textarea[name="content"]')` or similar
- Fill message form with Russian content: `'Добрый день! Когда сможете начать работу? Есть ли у вас опыт с PostgreSQL?'`
- Click submit button: `await page.click('button[type="submit"]')`
- Wait for page reload: `await page.waitForLoadState('networkidle')`
- Add small delay for database sync: `await page.waitForTimeout(500)`
- Verify message appears on page using `page.locator()` with message content
- Query database to verify message was created with correct gigId, senderId, content
- Add console.log for confirmation
- Clear cookies: `await page.context().clearCookies()`

**Test Plan**:
- Run test and verify client can authenticate
- Verify navigation to gig detail page succeeds
- Verify message form is visible and fillable
- Verify message submission succeeds
- Verify message appears on page after submission
- Verify message exists in database with correct data
- Verify cookies are cleared after step

---

## Task 4: Implement specialist authentication and message viewing (UI)

**Implementation**:
- Generate JWT session token for specialist using `createTestSession(specialist)`
- Set session cookie in browser context (same pattern as Task 3)
- Navigate to gig detail page: `await page.goto(\`http://localhost:3000/dashboard/gigs/\${gigId}\`)`
- Wait for page load: `await page.waitForLoadState('networkidle')`
- Verify URL matches gig detail page
- Locate client's message on page using `page.locator()` with message content
- Verify message is visible: `await expect(clientMessage).toBeVisible({ timeout: 5000 })`
- Verify message content matches what client sent
- Add console.log for confirmation
- Query database to verify message exists and is accessible

**Test Plan**:
- Run test and verify specialist can authenticate
- Verify navigation to gig detail page succeeds
- Verify client's message is visible on the page
- Verify message content is correct
- Verify no authentication or authorization errors

---

## Task 5: Implement specialist reply sending (UI)

**Implementation**:
- Specialist is already authenticated from Task 4
- On gig detail page `/dashboard/gigs/[gigId]`
- Locate message form textarea: `page.locator('textarea[name="content"]')` or similar
- Fill message form with Russian reply: `'Могу начать завтра. Опыт с PostgreSQL более 5 лет. Уточните требования к производительности API.'`
- Click submit button: `await page.click('button[type="submit"]')`
- Wait for page reload: `await page.waitForLoadState('networkidle')`
- Add small delay for database sync: `await page.waitForTimeout(500)`
- Verify reply appears on page using `page.locator()` with reply content
- Query database to verify reply was created with correct gigId, senderId (specialist), content
- Add console.log for confirmation
- Clear cookies: `await page.context().clearCookies()`

**Test Plan**:
- Run test and verify specialist can send reply
- Verify message form is visible and fillable
- Verify reply submission succeeds
- Verify reply appears on page after submission
- Verify reply exists in database with correct data (senderId = specialist.id)
- Verify cookies are cleared after step

---

## Task 6: Implement client re-authentication and reply viewing (UI)

**Implementation**:
- Generate JWT session token for client again using `createTestSession(client)`
- Set session cookie in browser context (same pattern as Task 3)
- Navigate to gig detail page: `await page.goto(\`http://localhost:3000/dashboard/gigs/\${gigId}\`)`
- Wait for page load: `await page.waitForLoadState('networkidle')`
- Verify URL matches gig detail page
- Locate both messages on page:
  - Client's original message
  - Specialist's reply
- Verify both messages are visible using `expect(message).toBeVisible()`
- Verify message contents match what was sent
- Add console.log for confirmation

**Test Plan**:
- Run test and verify client can re-authenticate
- Verify navigation to gig detail page succeeds
- Verify both messages are visible on the page
- Verify message contents are correct
- Verify no authentication or authorization errors

---

## Task 7: Implement chronological ordering verification

**Implementation**:
- On gig detail page with both messages visible
- Get all message elements in DOM order using `page.locator()` with a common selector
- Verify first message is client's message (check content or data attribute)
- Verify second message is specialist's reply (check content or data attribute)
- Query database for messages ordered by createdAt:
  ```typescript
  const messages = await prisma.message.findMany({
    where: { gigId },
    orderBy: { createdAt: 'asc' },
    include: { sender: true }
  })
  ```
- Verify message count is exactly 2
- Verify first message: senderId = client.id, content = client's message
- Verify second message: senderId = specialist.id, content = specialist's reply
- Verify first message createdAt < second message createdAt
- Add console.log with message order details

**Test Plan**:
- Run test and verify messages are ordered correctly in UI
- Verify DOM order matches chronological order
- Verify database query returns messages in correct order
- Verify timestamps are distinct and ascending
- Verify message count is exactly 2

---

## Task 8: Implement final state verification

**Implementation**:
- Query database for final state with all relations:
  ```typescript
  const finalGig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      client: { include: { clientProfile: true } },
      assignedSpecialist: { include: { specialistProfile: true } },
      applications: true,
      messages: { orderBy: { createdAt: 'asc' }, include: { sender: true } }
    }
  })
  ```
- Verify gig state:
  - status: `'IN_PROGRESS'`
  - assignedSpecialistId: `specialist.id`
- Verify application state:
  - status: `'ACCEPTED'`
- Verify messages:
  - Count: 2
  - First message: client sender, correct content
  - Second message: specialist sender, correct content
  - Chronological order
- Verify user profiles:
  - Client has ClientProfile with Russian company name and INN
  - Specialist has SpecialistProfile with Russian display name and tech stack
- Add comprehensive console.log with test summary

**Test Plan**:
- Run test and verify all final state assertions pass
- Verify gig has correct status and assigned specialist
- Verify application has correct status
- Verify both messages exist with correct data
- Verify user profiles have correct data
- Check console output for test summary

---

## Task 9: Add test documentation and comments

**Implementation**:
- Add file header comment explaining test purpose and flow
- Add step-by-step comments for each major section:
  - STEP 1: Setup (create users, gig, application)
  - STEP 2: Client sends message (UI)
  - STEP 3: Specialist views message (UI)
  - STEP 4: Specialist sends reply (UI)
  - STEP 5: Client views reply (UI)
  - STEP 6: Verify chronological ordering
  - STEP 7: Final state verification
- Add inline comments for complex operations (session management, polling, etc.)
- Follow existing E2E test documentation patterns from `client-journey.spec.ts` and `specialist-journey.spec.ts`

**Test Plan**:
- Review test file for clarity and readability
- Verify comments explain each step clearly
- Verify documentation follows existing patterns
- Get peer review if possible

---

## Task 10: Test execution and validation

**Implementation**:
- Run test once: `npm run test:e2e -- messaging-flow-e2e.spec.ts`
- Verify test passes
- Run test 10 times consecutively to verify idempotency:
  ```bash
  for i in {1..10}; do npm run test:e2e -- messaging-flow-e2e.spec.ts; done
  ```
- Verify all runs pass
- Measure execution time: `time npm run test:e2e -- messaging-flow-e2e.spec.ts`
- Verify execution time is under 30 seconds
- Run full E2E test suite: `npm run test:e2e`
- Verify new test doesn't break existing tests
- Check test database cleanup: verify no orphaned records after test run

**Test Plan**:
- Single run passes: ✓
- 10 consecutive runs pass: ✓
- Execution time < 30 seconds: ✓
- No unique constraint violations: ✓
- Full E2E suite passes: ✓
- Database cleanup works: ✓
- No test pollution or flakiness: ✓

---

## Task 11: Update documentation

**Implementation**:
- Update `__tests__/README.md` to mention the new messaging flow E2E test
- Add entry to E2E tests section listing `messaging-flow-e2e.spec.ts`
- Briefly describe what the test validates (messaging flow between client and specialist)
- Update file count statistics if needed
- Ensure documentation is accurate and up-to-date

**Test Plan**:
- Review `__tests__/README.md` for accuracy
- Verify new test is mentioned
- Verify file counts are correct
- Verify documentation is clear and helpful

---

## Completion Checklist

- [ ] Test file created at `__tests__/e2e/messaging-flow-e2e.spec.ts`
- [ ] Test passes when run individually
- [ ] Test passes when run 10 times consecutively (idempotency)
- [ ] Test completes in under 30 seconds
- [ ] Test uses realistic Russian message content
- [ ] Test follows existing E2E test patterns
- [ ] Test includes comprehensive documentation and comments
- [ ] Test cleanup works correctly (no orphaned data)
- [ ] Full E2E test suite passes
- [ ] Documentation updated in `__tests__/README.md`
- [ ] All 6 requirements from PRD are validated:
  1. ✓ Set up gig with assigned specialist
  2. ✓ Login as client, send message
  3. ✓ Logout, login as specialist, verify message visible
  4. ✓ Send reply as specialist
  5. ✓ Logout, login as client, verify reply visible
  6. ✓ Verify messages ordered chronologically
