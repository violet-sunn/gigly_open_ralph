# Implementation Tasks

## Task 1: Create Specialist Journey E2E Test

Create a comprehensive E2E test file that validates the complete specialist journey from authentication through gig completion.

### Implementation Notes

**File to create**: `__tests__/e2e/specialist-journey.spec.ts`

**Structure** (follow `client-journey.spec.ts` pattern):

1. **Imports and Setup**
   - Import Playwright test utilities (`test`, `expect`)
   - Import Prisma client and adapter for test database
   - Import test helpers: `createTestUser`, `createTestGig`, `createTestApplication`, `createTestSession`
   - Setup test database connection using `PrismaLibSql` adapter
   - Create Prisma client instance

2. **Test Hooks**
   - `test.afterEach`: Clean up test data (delete messages, applications, gigs, users in order)
   - `test.afterAll`: Disconnect Prisma client

3. **Test Case: "complete specialist journey from authentication to gig completion"**

   **Step 1: Setup - Create CLIENT and OPEN gig (programmatic)**
   - Create CLIENT user with `createTestUser(prisma, { role: 'CLIENT', ... })`
   - Use realistic Russian company name and INN
   - Create OPEN gig with `createTestGig(prisma, { clientId, ... })`
   - Use realistic Russian gig title and description
   - Verify gig exists in database with status OPEN
   - Log setup completion

   **Step 2: Create and authenticate SPECIALIST user (programmatic)**
   - Create SPECIALIST user with `createTestUser(prisma, { role: 'SPECIALIST', ... })`
   - Use realistic Russian displayName (e.g., "Александр Петров")
   - Use realistic techStack (e.g., "React, TypeScript, Node.js, PostgreSQL")
   - Set experienceLevel to "SENIOR"
   - Generate session token with `createTestSession(specialist)`
   - Set session cookie in browser context with `page.context().addCookies([...])`
   - Cookie config: name='session', httpOnly=true, sameSite='Lax', path='/', domain='localhost'
   - Verify authentication by navigating to `/dashboard`
   - Log authentication completion

   **Step 3: Browse gigs via UI**
   - Navigate to `http://localhost:3000/dashboard/gigs`
   - Wait for page load with `page.waitForLoadState('networkidle')`
   - Verify URL is `/dashboard/gigs`
   - Verify gig is visible on page (locate by title)
   - Log browsing step completion

   **Step 4: View gig detail via UI**
   - Click on gig link/card to navigate to detail page
   - Wait for navigation with `page.waitForLoadState('networkidle')`
   - Verify URL matches `/dashboard/gigs/[gigId]`
   - Verify gig title is visible
   - Verify application form is visible
   - Log detail view completion

   **Step 5: Apply to gig via UI**
   - Fill `textarea[name="approach"]` with Russian technical approach (100-2000 chars)
     - Example: "Буду использовать архитектуру REST с валидацией через Zod..."
   - Fill `textarea[name="questions"]` with Russian clarifying questions (50-1000 chars)
     - Example: "Какие требования к производительности API?..."
   - Fill `input[name="estimatedEffort"]` with realistic estimate (optional)
     - Example: "2 недели (80 часов)"
   - Click submit button
   - Wait for page reload with `page.waitForLoadState('networkidle')`
   - Query database to verify application was created
   - Verify application.status = PENDING
   - Verify application.gigId and application.specialistId are correct
   - Log application submission completion

   **Step 6: Accept application (programmatic)**
   - Update gig status to IN_PROGRESS with `prisma.gig.update(...)`
   - Set assignedSpecialistId to specialist.id
   - Update application status to ACCEPTED with `prisma.application.update(...)`
   - Verify database changes
   - Log acceptance completion

   **Step 7: Submit work via UI**
   - Navigate to `http://localhost:3000/dashboard/gigs/[gigId]`
   - Wait for page load
   - Locate work submission form (textarea for work description)
   - Fill work description with Russian content
     - Example: "Работа выполнена. Реализовал REST API с полным покрытием тестами..."
   - Click "Submit Work" button
   - Wait for page reload
   - Poll database (10 iterations × 500ms) until gig.status = REVIEW
   - Verify gig.workSubmittedAt is not null
   - Log work submission completion

   **Step 8: Approve work (programmatic)**
   - Update gig status to COMPLETED with `prisma.gig.update(...)`
   - Set completedAt timestamp
   - Verify database changes
   - Log approval completion

   **Step 9: Final state verification**
   - Query database for final gig state with all relations
   - Assert gig.status === 'COMPLETED'
   - Assert gig.assignedSpecialistId === specialist.id
   - Assert gig.completedAt !== null
   - Assert gig.workSubmittedAt !== null
   - Assert application.status === 'ACCEPTED'
   - Assert specialist user exists with SpecialistProfile
   - Assert specialist.specialistProfile.displayName is Russian name
   - Log final verification completion with summary

4. **Data Generation**
   - Use unique email addresses: `specialist-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`
   - Use realistic Russian data for all text fields
   - Follow validation requirements (approach 100-2000 chars, questions 50-1000 chars)

5. **Error Handling**
   - Use polling loops with timeout for async state changes
   - Include detailed console.log statements for debugging
   - Use explicit expect() assertions for all critical state

### Test Plan

**Prerequisites**:
- Next.js dev server running on `http://localhost:3000`
- Test database configured (DATABASE_URL in .env.test)
- All test helpers available in `__tests__/helpers/`

**Execution**:
```bash
npm run test:e2e -- specialist-journey.spec.ts
```

**Expected Results**:
- Test passes all assertions
- Test completes in < 30 seconds
- Console output shows all 9 steps completing successfully
- Database contains final state: gig with status COMPLETED, application with status ACCEPTED
- Exit code 0

**Verification**:
1. Run test once: `npm run test:e2e -- specialist-journey.spec.ts`
   - Verify exit code 0
   - Verify console output shows all steps
   - Verify no errors or warnings

2. Run test 10 times consecutively:
   ```bash
   for i in {1..10}; do npm run test:e2e -- specialist-journey.spec.ts || exit 1; done
   ```
   - Verify all 10 runs pass
   - Verify no unique constraint violations
   - Verify consistent timing (< 30 seconds per run)

3. Verify test cleanup:
   - After test run, query test database
   - Verify no orphaned records remain (if using proper cleanup)
   - Verify test is idempotent

4. Verify realistic data:
   - Inspect database records created during test
   - Verify all Russian text is present and realistic
   - Verify all validation requirements are met

**Success Criteria**:
- ✅ Test file exists at `__tests__/e2e/specialist-journey.spec.ts`
- ✅ Test passes consistently (10 consecutive runs)
- ✅ Test covers all 9 steps of specialist journey
- ✅ Test completes in < 30 seconds
- ✅ Test uses realistic Russian data
- ✅ Test follows AAA pattern (Arrange-Act-Assert)
- ✅ Test is documented with clear comments
- ✅ Run `npm run test:e2e -- specialist-journey.spec.ts` exits with code 0
- ✅ Test follows existing patterns from `client-journey.spec.ts`
- ✅ Test cleanup removes all test data
