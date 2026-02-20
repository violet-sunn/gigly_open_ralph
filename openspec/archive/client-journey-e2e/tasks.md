# Implementation Tasks

## Task 1: Set up test file structure and test database helpers

**Description**: Create the E2E test file with proper imports, test database setup, and cleanup utilities.

**Implementation Notes**:
- Create `__tests__/e2e/client-journey.spec.ts`
- Import Playwright test utilities: `import { test, expect } from '@playwright/test'`
- Import Prisma client for database queries: `import { PrismaClient } from '@prisma/client'`
- Import test helpers: `import { createTestUser, createTestApplication } from '../helpers/seed'`
- Import auth helpers: `import { withAuthContext } from '../helpers/auth'`
- Import server actions: `import { submitWork } from '@/app/actions/gig-actions'`
- Set up test database connection in `beforeAll` hook
- Set up cleanup in `afterAll` hook to close database connection
- Use descriptive test name: `test('complete client journey from registration to payment', async ({ page }) => { ... })`

**Test Plan**:
- Run `npm run test:e2e -- client-journey.spec.ts`
- Verify test file is discovered by Playwright
- Verify imports resolve without errors
- Verify test structure is valid (test runs even if empty)

---

## Task 2: Implement Step 1 - Client Registration via UI

**Description**: Implement the client registration step using Playwright to fill and submit the registration form.

**Implementation Notes**:
- Navigate to registration page: `await page.goto('http://localhost:3000/register')`
- Generate unique email: `const clientEmail = \`client-\${Date.now()}-\${Math.random().toString(36).substring(7)}@test.com\``
- Fill form fields:
  - Email: `await page.fill('input[name="email"]', clientEmail)`
  - Password: `await page.fill('input[name="password"]', 'TestPassword123!')`
  - Role: `await page.click('input[value="CLIENT"]')` or select CLIENT radio button
  - Company name: `await page.fill('input[name="companyName"]', 'ООО "ТехноСтарт"')`
  - INN: `await page.fill('input[name="inn"]', '7743013902')`
- Submit form: `await page.click('button[type="submit"]')`
- Wait for navigation: `await page.waitForURL('**/dashboard')`
- Verify redirect: `expect(page.url()).toContain('/dashboard')`
- Query database to verify user exists:
  ```typescript
  const client = await prisma.user.findUnique({
    where: { email: clientEmail },
    include: { clientProfile: true }
  })
  expect(client).toBeTruthy()
  expect(client.role).toBe('CLIENT')
  expect(client.clientProfile?.companyName).toBe('ООО "ТехноСтарт"')
  ```

**Test Plan**:
- Run test and verify it navigates to `/register`
- Verify form fields are filled correctly (use Playwright inspector)
- Verify form submission triggers redirect to `/dashboard`
- Verify database contains user with CLIENT role and ClientProfile
- Run test multiple times to verify unique email generation works

---

## Task 3: Implement Step 2 - Client Login via UI (Alternative Path)

**Description**: Implement client login step to verify authentication flow works. This step is optional if registration auto-logs in, but demonstrates the login flow.

**Implementation Notes**:
- After registration, log out first (if auto-login happens): `await page.goto('http://localhost:3000/logout')` or click logout button
- Navigate to login page: `await page.goto('http://localhost:3000/login')`
- Fill login form:
  - Email: `await page.fill('input[name="email"]', clientEmail)`
  - Password: `await page.fill('input[name="password"]', 'TestPassword123!')`
- Submit: `await page.click('button[type="submit"]')`
- Wait for navigation: `await page.waitForURL('**/dashboard')`
- Verify redirect: `expect(page.url()).toContain('/dashboard')`

**Alternative**: If registration auto-logs in (which it does based on project.md), skip explicit logout/login and just verify the user is already on dashboard after registration.

**Test Plan**:
- Verify login form accepts credentials
- Verify successful login redirects to dashboard
- Verify session cookie is set (check browser context)

---

## Task 4: Implement Step 3 - Gig Creation via UI

**Description**: Implement gig creation step where client fills and submits the gig creation form.

**Implementation Notes**:
- Navigate to gig creation page: `await page.goto('http://localhost:3000/dashboard/gigs/new')`
- Fill gig form fields:
  - Title: `await page.fill('input[name="title"]', 'Разработка REST API для мобильного приложения')`
  - Description: `await page.fill('textarea[name="description"]', 'Необходимо разработать REST API для мобильного приложения. Требуется опыт работы с Node.js и PostgreSQL.')`
  - Acceptance Criteria: `await page.fill('textarea[name="acceptanceCriteria"]', 'API должен поддерживать CRUD операции, иметь документацию OpenAPI, покрытие тестами не менее 80%.')`
  - Budget: `await page.fill('input[name="budget"]', '150000')` (in kopecks)
  - Tags: `await page.fill('input[name="tags"]', 'React,TypeScript,Node.js')`
- Submit form: `await page.click('button[type="submit"]')`
- Wait for navigation to gig detail page: `await page.waitForURL('**/dashboard/gigs/*')`
- Extract gig ID from URL:
  ```typescript
  const url = page.url()
  const gigId = url.split('/').pop()
  ```
- Verify gig in database:
  ```typescript
  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  expect(gig).toBeTruthy()
  expect(gig.status).toBe('OPEN')
  expect(gig.budget).toBe(150000)
  expect(gig.serviceFee).toBe(30000) // 20% of budget
  expect(gig.totalAmount).toBe(180000)
  ```

**Test Plan**:
- Verify navigation to gig creation form
- Verify all form fields are filled correctly
- Verify form submission creates gig in database
- Verify budget calculations are correct (serviceFee = budget * 0.2)
- Verify redirect to gig detail page with correct ID

---

## Task 5: Implement Step 4 - Specialist Application (Programmatic)

**Description**: Create a specialist user and application programmatically using test helpers and database operations.

**Implementation Notes**:
- Create specialist user using test helper:
  ```typescript
  const specialist = await prisma.$transaction(async (tx) => {
    return await createTestUser(tx, {
      role: 'SPECIALIST',
      email: `specialist-${Date.now()}@test.com`,
      password: 'TestPassword123!'
    })
  })
  ```
- Create application using test helper:
  ```typescript
  const application = await prisma.$transaction(async (tx) => {
    return await createTestApplication(tx, {
      gigId: gigId,
      specialistId: specialist.id,
      approach: 'Буду использовать архитектуру REST с валидацией через Zod. Применю паттерн Repository для работы с БД.',
      questions: 'Какие требования к производительности? Нужна ли документация API? Какой стек предпочтителен для тестов?',
      estimatedEffort: '2 недели (80 часов)'
    })
  })
  ```
- Verify application exists:
  ```typescript
  expect(application.status).toBe('PENDING')
  expect(application.gigId).toBe(gigId)
  expect(application.specialistId).toBe(specialist.id)
  ```

**Test Plan**:
- Verify specialist user is created with SpecialistProfile
- Verify application is created with status PENDING
- Verify application is linked to gig and specialist
- Verify structured fields (approach, questions, estimatedEffort) contain Russian content
- Query database to confirm all relations are correct

---

## Task 6: Implement Step 5 - Application Acceptance via UI

**Description**: Implement the step where client reviews and accepts the specialist's application via the gig detail page.

**Implementation Notes**:
- Reload gig detail page to see the application: `await page.reload()`
- Locate the Accept button for the application (may need to use specific selector based on UI structure)
- Click Accept button: `await page.click('button:has-text("Accept")')` or use more specific selector
- Wait for page reload or status update: `await page.waitForTimeout(1000)` or wait for specific element
- Verify gig status changed on page: `await expect(page.locator('text=/IN_PROGRESS|В работе/i')).toBeVisible()`
- Verify in database:
  ```typescript
  const updatedGig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: { applications: true }
  })
  expect(updatedGig.status).toBe('IN_PROGRESS')
  expect(updatedGig.assignedSpecialistId).toBe(specialist.id)

  const acceptedApp = updatedGig.applications.find(a => a.id === application.id)
  expect(acceptedApp.status).toBe('ACCEPTED')
  ```

**Test Plan**:
- Verify Accept button is visible on gig detail page
- Verify clicking Accept button triggers status change
- Verify gig status changes to IN_PROGRESS in database
- Verify assignedSpecialistId is set correctly
- Verify application status changes to ACCEPTED
- Verify other applications (if any) are REJECTED

---

## Task 7: Implement Step 6 - Work Submission (Programmatic)

**Description**: Simulate specialist submitting work by calling the `submitWork` server action programmatically with proper authentication context.

**Implementation Notes**:
- Import `submitWork` action: `import { submitWork } from '@/app/actions/gig-actions'`
- Import auth helper: `import { withAuthContext } from '../helpers/auth'`
- Create FormData with work description:
  ```typescript
  const formData = new FormData()
  formData.append('workDescription', 'Работа выполнена. API реализован согласно требованиям, добавлена документация OpenAPI, покрытие тестами 85%.')
  ```
- Execute action with specialist auth context:
  ```typescript
  await withAuthContext(specialist, async () => {
    await submitWork(gigId, formData)
  })
  ```
- Verify in database:
  ```typescript
  const gigAfterSubmit = await prisma.gig.findUnique({ where: { id: gigId } })
  expect(gigAfterSubmit.status).toBe('REVIEW')
  expect(gigAfterSubmit.workSubmittedAt).toBeTruthy()
  ```

**Test Plan**:
- Verify `withAuthContext` helper works in E2E test context
- Verify `submitWork` action executes successfully
- Verify gig status changes to REVIEW in database
- Verify workSubmittedAt timestamp is set
- Handle any redirect errors from server action (catch and ignore NEXT_REDIRECT)

---

## Task 8: Implement Step 7 - Work Approval via UI

**Description**: Implement the step where client approves the submitted work via the gig detail page.

**Implementation Notes**:
- Reload gig detail page: `await page.reload()`
- Locate Approve Work button: `await page.click('button:has-text("Approve")')` or use specific selector
- Wait for page reload or status update
- Verify gig status changed on page: `await expect(page.locator('text=/COMPLETED|Завершен/i')).toBeVisible()`
- Verify in database:
  ```typescript
  const completedGig = await prisma.gig.findUnique({ where: { id: gigId } })
  expect(completedGig.status).toBe('COMPLETED')
  expect(completedGig.completedAt).toBeTruthy()
  ```

**Test Plan**:
- Verify Approve Work button is visible on gig detail page
- Verify clicking button triggers status change
- Verify gig status changes to COMPLETED in database
- Verify completedAt timestamp is set

---

## Task 9: Implement Step 8 - Payment Marking via UI

**Description**: Implement the step where client marks the gig as paid via the gig detail page.

**Implementation Notes**:
- Reload gig detail page: `await page.reload()`
- Locate Mark as Paid button: `await page.click('button:has-text("Mark as Paid")')` or use specific selector
- Wait for page reload or status update
- Verify gig status changed on page: `await expect(page.locator('text=/PAID|Оплачен/i')).toBeVisible()`
- Verify in database:
  ```typescript
  const paidGig = await prisma.gig.findUnique({ where: { id: gigId } })
  expect(paidGig.status).toBe('PAID')
  expect(paidGig.paidAt).toBeTruthy()
  ```

**Test Plan**:
- Verify Mark as Paid button is visible on gig detail page
- Verify clicking button triggers status change
- Verify gig status changes to PAID in database
- Verify paidAt timestamp is set

---

## Task 10: Implement Step 9 - Final State Verification

**Description**: Implement comprehensive final verification that checks all expected state after the complete journey.

**Implementation Notes**:
- Query final gig state with all relations:
  ```typescript
  const finalGig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      client: { include: { clientProfile: true } },
      assignedSpecialist: { include: { specialistProfile: true } },
      applications: true
    }
  })
  ```
- Assert all expected state:
  ```typescript
  // Gig status and timestamps
  expect(finalGig.status).toBe('PAID')
  expect(finalGig.assignedSpecialistId).toBe(specialist.id)
  expect(finalGig.paidAt).toBeTruthy()
  expect(finalGig.completedAt).toBeTruthy()
  expect(finalGig.workSubmittedAt).toBeTruthy()

  // Application status
  const acceptedApp = finalGig.applications.find(a => a.specialistId === specialist.id)
  expect(acceptedApp.status).toBe('ACCEPTED')

  // User profiles
  expect(finalGig.client.role).toBe('CLIENT')
  expect(finalGig.client.clientProfile).toBeTruthy()
  expect(finalGig.assignedSpecialist.role).toBe('SPECIALIST')
  expect(finalGig.assignedSpecialist.specialistProfile).toBeTruthy()

  // Budget calculations
  expect(finalGig.budget).toBe(150000)
  expect(finalGig.serviceFee).toBe(30000)
  expect(finalGig.totalAmount).toBe(180000)
  ```

**Test Plan**:
- Verify all assertions pass
- Verify complete data integrity
- Verify all relations are correctly established
- Run test end-to-end and verify final state is correct

---

## Task 11: Add test documentation and comments

**Description**: Add comprehensive comments to the test file explaining each step and update testing documentation.

**Implementation Notes**:
- Add file header comment explaining test purpose:
  ```typescript
  /**
   * E2E Test: Complete Client Journey
   *
   * This test validates the entire client journey from registration to payment:
   * 1. Client registers via UI
   * 2. Client creates gig via UI
   * 3. Specialist applies (programmatic)
   * 4. Client accepts application via UI
   * 5. Specialist submits work (programmatic)
   * 6. Client approves work via UI
   * 7. Client marks as paid via UI
   * 8. Final state verification
   *
   * Uses hybrid approach: client actions via Playwright UI, specialist actions programmatically.
   */
  ```
- Add comments before each major step explaining what's being tested
- Add inline comments for complex selectors or logic
- Update `TESTING.md` with example of running this test:
  ```markdown
  ### Running Client Journey E2E Test

  ```bash
  npm run test:e2e -- client-journey.spec.ts
  ```

  This test validates the complete client journey from registration through payment.
  Expected duration: ~15-20 seconds.
  ```

**Test Plan**:
- Verify comments are clear and helpful
- Verify documentation is updated
- Verify example commands work as documented
- Run `npm run test:e2e -- client-journey.spec.ts` and verify it matches documentation

---

## Task 12: Verify test idempotency and performance

**Description**: Verify the test can run multiple times without conflicts and completes within performance requirements.

**Implementation Notes**:
- Run test multiple times consecutively:
  ```bash
  for i in {1..10}; do npm run test:e2e -- client-journey.spec.ts || exit 1; done
  ```
- Measure test execution time (should be < 30 seconds)
- Verify no unique constraint violations occur
- Verify test database cleanup works correctly
- If performance issues, optimize:
  - Reduce unnecessary `page.waitForTimeout()` calls
  - Use `page.waitForURL()` and `page.waitForSelector()` instead
  - Minimize database queries
  - Use transactions where possible

**Test Plan**:
- Run test 10 times consecutively, verify all pass
- Measure average execution time, verify < 30 seconds
- Verify no database errors or conflicts
- Verify test database is properly isolated from dev database
- Check for any flaky behavior (intermittent failures)

---

## Summary

**Total Tasks**: 12

**Estimated Implementation Time**: 4-6 hours

**Key Dependencies**:
- Existing test helpers (`createTestUser`, `createTestApplication`, `withAuthContext`)
- Playwright configuration and test database setup
- Next.js dev server running on localhost:3000
- Existing server actions (`submitWork`, `acceptApplication`, `approveWork`, `markAsPaid`)

**Risk Areas**:
- UI selectors may need adjustment based on actual component structure
- Timing issues with page reloads and async operations
- Auth context mocking in E2E environment may need special handling
- Service fee calculation (20% vs 10% inconsistency noted in project.md)

**Success Metrics**:
- Test passes consistently (10/10 runs)
- Test completes in < 30 seconds
- All 9 journey steps are covered
- Final state verification passes
- Test uses realistic Russian data
