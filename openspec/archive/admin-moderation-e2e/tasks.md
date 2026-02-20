# Implementation Tasks

## Task 1: Create test file structure and setup

**Implementation Notes:**
- Create `__tests__/e2e/admin-moderation.spec.ts`
- Import required dependencies: `@playwright/test`, `@prisma/client`, test helpers
- Set up Prisma client connection for E2E tests (using test database)
- Create test suite with `test.describe('Admin Moderation E2E', () => {})`
- Add `afterEach` hook to clean up test data (delete ModerationLog, Application, Gig, User)
- Add `afterAll` hook to disconnect Prisma client
- Follow existing E2E test patterns from `client-journey.spec.ts` and `specialist-journey.spec.ts`

**Test Plan:**
- Run `npm run test:e2e -- admin-moderation.spec.ts`
- Verify test file is discovered by Playwright
- Verify test suite structure is correct (no syntax errors)
- Verify cleanup hooks execute without errors

---

## Task 2: Implement test data setup

**Implementation Notes:**
- Create setup function or inline setup in test body
- Use `createTestUser(prisma, { role: 'CLIENT', ... })` to create CLIENT with Russian companyName and INN
- Use `createTestUser(prisma, { role: 'SPECIALIST', ... })` to create SPECIALIST with Russian displayName
- Use `createTestUser(prisma, { role: 'ADMIN', ... })` to create ADMIN user
- Use `createTestGig(prisma, { clientId, ... })` to create OPEN gig with Russian title/description
- Store user IDs and gig ID for later use in test
- Use unique email addresses: `admin-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
- Add console.log statements to confirm setup completion

**Test Plan:**
- Run test and verify setup completes without errors
- Verify database queries confirm all users exist with correct roles
- Verify CLIENT has ClientProfile with companyName and inn
- Verify SPECIALIST has SpecialistProfile with displayName
- Verify gig exists with status OPEN
- Verify all data uses realistic Russian content

---

## Task 3: Implement admin login via UI

**Implementation Notes:**
- Navigate to `/login` using `page.goto('http://localhost:3000/login')`
- Fill email field: `await page.fill('input[name="email"]', adminEmail)`
- Fill password field: `await page.fill('input[name="password"]', adminPassword)`
- Click login button: `await page.click('button[type="submit"]')` or locate by text
- Wait for navigation: `await page.waitForURL(/\/dashboard/)`
- Verify URL is `/dashboard`: `await expect(page).toHaveURL(/\/dashboard/)`
- Add console.log to confirm admin login success

**Test Plan:**
- Run test and verify admin can login via UI
- Verify browser redirects to `/dashboard`
- Verify session cookie is set in browser context
- Verify no error messages are displayed
- Test should pass this step consistently

---

## Task 4: Implement user suspension via UI

**Implementation Notes:**
- Navigate to `/admin/users`: `await page.goto('http://localhost:3000/admin/users')`
- Wait for page load: `await page.waitForLoadState('networkidle')`
- Locate the specialist user in the list (by email or ID)
- Find the suspend form for that user (may need to use data attributes or specific selectors)
- Fill suspend reason: `await page.fill('textarea[name="reason"]', 'Нарушение правил платформы')`
- Click suspend button: `await page.click('button[type="submit"]')` within the form
- Wait for page reload: `await page.waitForLoadState('networkidle')`
- Query database to verify suspension: `const user = await prisma.user.findUnique({ where: { id: specialistId } })`
- Verify `user.suspended === true`
- Query ModerationLog: `const log = await prisma.moderationLog.findFirst({ where: { action: 'SUSPEND_USER', targetUserId: specialistId } })`
- Verify log exists with correct adminId and reason
- Add console.log to confirm suspension

**Test Plan:**
- Run test and verify user suspension works via UI
- Verify database shows user.suspended = true
- Verify ModerationLog entry exists with action='SUSPEND_USER'
- Verify log contains Russian reason text
- Verify log has correct adminId and targetUserId
- Test should pass this step consistently

---

## Task 5: Implement suspended user login verification

**Implementation Notes:**
- Logout admin: Navigate to logout or clear cookies
- Navigate to `/login`: `await page.goto('http://localhost:3000/login')`
- Fill suspended user's email: `await page.fill('input[name="email"]', specialistEmail)`
- Fill suspended user's password: `await page.fill('input[name="password"]', specialistPassword)`
- Click login button: `await page.click('button[type="submit"]')`
- Wait for error message to appear (use `page.waitForSelector` or `page.locator`)
- Verify error message contains suspension text (e.g., "suspended", "заблокирован")
- Verify URL is still `/login` (no redirect): `await expect(page).toHaveURL(/\/login/)`
- Verify no session cookie exists for suspended user
- Add console.log to confirm login blocked

**Test Plan:**
- Run test and verify suspended user cannot login
- Verify error message is displayed
- Verify no redirect to dashboard occurs
- Verify no session cookie is set
- Test should pass this step consistently

---

## Task 6: Implement admin re-authentication

**Implementation Notes:**
- Navigate to `/login`: `await page.goto('http://localhost:3000/login')`
- Fill admin email: `await page.fill('input[name="email"]', adminEmail)`
- Fill admin password: `await page.fill('input[name="password"]', adminPassword)`
- Click login button: `await page.click('button[type="submit"]')`
- Wait for navigation: `await page.waitForURL(/\/dashboard/)`
- Verify URL is `/dashboard`: `await expect(page).toHaveURL(/\/dashboard/)`
- Add console.log to confirm admin re-login

**Test Plan:**
- Run test and verify admin can re-authenticate
- Verify browser redirects to `/dashboard`
- Verify session cookie is restored
- Test should pass this step consistently

---

## Task 7: Implement gig closure via UI

**Implementation Notes:**
- Navigate to `/admin/gigs`: `await page.goto('http://localhost:3000/admin/gigs')`
- Wait for page load: `await page.waitForLoadState('networkidle')`
- Locate the gig in the list (by title or ID)
- Find the close gig form for that gig
- Fill close reason: `await page.fill('textarea[name="reason"]', 'Нарушение условий платформы')`
- Click close gig button: `await page.click('button[type="submit"]')` within the form
- Wait for page reload: `await page.waitForLoadState('networkidle')`
- Query database to verify closure: `const gig = await prisma.gig.findUnique({ where: { id: gigId } })`
- Verify `gig.closedByAdmin === true` and `gig.closedAt !== null`
- Query ModerationLog: `const log = await prisma.moderationLog.findFirst({ where: { action: 'CLOSE_GIG', targetGigId: gigId } })`
- Verify log exists with correct adminId and reason
- Add console.log to confirm gig closure

**Test Plan:**
- Run test and verify gig closure works via UI
- Verify database shows gig.closedByAdmin = true
- Verify database shows gig.closedAt is not null
- Verify ModerationLog entry exists with action='CLOSE_GIG'
- Verify log contains Russian reason text
- Verify log has correct adminId and targetGigId
- Test should pass this step consistently

---

## Task 8: Implement moderation history verification

**Implementation Notes:**
- Stay on `/admin/gigs` or navigate to `/admin` or `/admin/users` (whichever shows moderation logs)
- Locate moderation log section on the page
- Verify at least 2 log entries are visible (SUSPEND_USER, CLOSE_GIG)
- Verify log entries show action types, reasons, and timestamps
- Alternative: Query database directly to verify logs exist (if UI doesn't show logs prominently)
- Query all ModerationLog entries: `const logs = await prisma.moderationLog.findMany({ where: { adminId } })`
- Verify logs.length >= 2
- Verify logs include SUSPEND_USER and CLOSE_GIG actions
- Verify logs have Russian reasons
- Add console.log to confirm moderation history

**Test Plan:**
- Run test and verify moderation logs are visible (UI or database)
- Verify at least 2 log entries exist
- Verify logs contain correct action types
- Verify logs contain Russian reasons
- Verify logs have timestamps
- Test should pass this step consistently

---

## Task 9: Implement final state verification and cleanup

**Implementation Notes:**
- Perform final database queries to verify complete state:
  - Specialist user is suspended: `user.suspended === true`
  - Gig is closed: `gig.closedByAdmin === true`, `gig.closedAt !== null`
  - ModerationLog has 2 entries (SUSPEND_USER, CLOSE_GIG)
- Add comprehensive assertions for final state
- Verify cleanup in `afterEach` hook works correctly:
  - Delete ModerationLog entries first (child records)
  - Delete Application entries (if any)
  - Delete Gig entries
  - Delete User entries (CLIENT, SPECIALIST, ADMIN)
- Verify no foreign key constraint errors during cleanup
- Add console.log to confirm test completion

**Test Plan:**
- Run test and verify final state is correct
- Verify all assertions pass
- Verify cleanup executes without errors
- Run test multiple times and verify no data pollution
- Verify database is clean after test run

---

## Task 10: Run and validate test stability

**Implementation Notes:**
- Run test 10 times consecutively to verify stability
- Check for flakiness (timing issues, race conditions)
- Verify test completes in under 30 seconds
- Verify no unique constraint violations occur
- Verify no database lock errors occur
- If flakiness detected, add appropriate waits or retries
- Document any known issues or limitations

**Test Plan:**
- Run: `for i in {1..10}; do npm run test:e2e -- admin-moderation.spec.ts; done` (bash)
- Or: `for ($i=1; $i -le 10; $i++) { npm run test:e2e -- admin-moderation.spec.ts }` (PowerShell)
- Verify all 10 runs pass
- Verify average execution time is under 30 seconds
- Verify no errors in any run
- Verify test output is consistent across runs
- Document test as stable and ready for CI

---

## Task 11: Update documentation

**Implementation Notes:**
- Update `TESTING.md` to include reference to `admin-moderation.spec.ts`
- Add entry in E2E tests section explaining what the test covers
- Include command to run the test: `npm run test:e2e -- admin-moderation.spec.ts`
- Update `__tests__/README.md` if it lists E2E tests
- Ensure documentation is consistent with other E2E test documentation

**Test Plan:**
- Verify `TESTING.md` includes admin moderation E2E test
- Verify documentation is clear and accurate
- Verify command works as documented
- Verify documentation follows existing patterns

---

## Summary

**Total Tasks**: 11
**Estimated Time**: 2-4 hours
**Dependencies**: Existing admin moderation functionality, E2E test infrastructure, test helpers

**Critical Path**:
1. Create test file structure (Task 1)
2. Implement test data setup (Task 2)
3. Implement admin login (Task 3)
4. Implement user suspension (Task 4)
5. Implement suspended login verification (Task 5)
6. Implement admin re-authentication (Task 6)
7. Implement gig closure (Task 7)
8. Implement moderation history verification (Task 8)
9. Implement final verification and cleanup (Task 9)
10. Validate test stability (Task 10)
11. Update documentation (Task 11)

**Success Criteria**:
- All tasks completed
- Test passes consistently (10/10 runs)
- Test completes in under 30 seconds
- All assertions pass
- Documentation updated
- No flakiness or data pollution issues
