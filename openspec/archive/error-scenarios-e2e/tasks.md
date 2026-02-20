# Implementation Tasks

## Task 1: Create E2E test file structure and setup

**Description**: Create `__tests__/e2e/error-scenarios.spec.ts` with proper imports, PrismaClient setup, and cleanup hooks following existing E2E patterns.

**Implementation Notes**:
- Follow patterns from `client-journey.spec.ts` and `specialist-journey.spec.ts`
- Use PrismaClient with libSQL adapter (same as production)
- Include afterEach hook to clean up test data (messages, applications, gigs, users)
- Include afterAll hook to disconnect Prisma client
- Import test helpers: `createTestUser`, `createTestGig`, `createTestApplication`, `setE2ESession`
- Use `test.describe()` to group related error scenarios

**Test Plan**:
```bash
# Verify file exists and has correct structure
ls __tests__/e2e/error-scenarios.spec.ts

# Verify imports are correct
grep "import.*PrismaClient" __tests__/e2e/error-scenarios.spec.ts
grep "import.*createTestUser" __tests__/e2e/error-scenarios.spec.ts

# Run empty test suite (should pass with 0 tests)
npm run test:e2e -- error-scenarios.spec.ts
```

**Acceptance Criteria**:
- File exists at correct path
- PrismaClient initialized with libSQL adapter
- Cleanup hooks present (afterEach, afterAll)
- Test helpers imported
- File follows TypeScript and ESLint conventions

---

## Task 2: Implement form validation error tests

**Description**: Add E2E tests that verify form validation errors are displayed in the browser for gig creation, application submission, and message sending.

**Implementation Notes**:
- Test gig creation with missing title (required field)
- Test gig creation with acceptanceCriteria < 50 chars (validation rule)
- Test application with approach < 100 chars (validation rule)
- Test application with questions < 50 chars (validation rule)
- Test message with empty content (required field)
- Use Playwright selectors to locate error messages (look for text containing "обязательн", "минимум", "требуется")
- Verify error messages are visible: `await expect(page.locator('text=...')).toBeVisible()`
- Verify no database records created after validation failure

**Test Plan**:
```bash
# Run form validation tests
npm run test:e2e -- error-scenarios.spec.ts -g "form validation"

# Expected: 5 tests pass
# - Gig creation missing title
# - Gig creation short acceptanceCriteria
# - Application short approach
# - Application short questions
# - Message empty content

# Verify error messages are in Russian
# Verify no database records created (check with Prisma queries)
```

**Acceptance Criteria**:
- 5 form validation tests implemented
- All tests verify error message visibility
- All tests verify no database records created
- All tests use Russian error message text
- Tests complete in < 15 seconds total
- All tests pass consistently

---

## Task 3: Implement unauthorized access redirect tests

**Description**: Add E2E tests that verify unauthenticated users are redirected to `/login` when accessing protected routes.

**Implementation Notes**:
- Test unauthenticated access to `/dashboard`
- Test unauthenticated access to `/dashboard/gigs/new`
- Test unauthenticated access to `/dashboard/gigs/[id]` (create gig programmatically first)
- Test unauthenticated access to `/admin`
- Do NOT set session cookie (user is unauthenticated)
- Use `await page.goto(url)` and verify redirect with `await expect(page).toHaveURL(/\/login/)`
- Verify redirect happens within 2 seconds (Playwright default timeout)

**Test Plan**:
```bash
# Run unauthorized access tests
npm run test:e2e -- error-scenarios.spec.ts -g "unauthorized access"

# Expected: 4 tests pass
# - Dashboard redirect
# - Gig creation redirect
# - Gig detail redirect
# - Admin redirect

# Verify all redirects go to /login
# Verify no protected content visible
```

**Acceptance Criteria**:
- 4 unauthorized access tests implemented
- All tests verify redirect to `/login`
- All tests complete within 2 seconds per test
- No session cookies set in tests
- All tests pass consistently

---

## Task 4: Implement role-based access control error tests

**Description**: Add E2E tests that verify role-based access control prevents users from accessing routes or performing actions restricted to other roles.

**Implementation Notes**:
- Test SPECIALIST accessing `/dashboard/gigs/new` (CLIENT-only route)
- Test CLIENT attempting to apply to gig (SPECIALIST-only action)
- Create users programmatically with appropriate roles
- Set session cookies using `setE2ESession(page, user)`
- Verify error messages or access denied behavior
- Check that unauthorized actions don't succeed (no database changes)

**Test Plan**:
```bash
# Run role-based access tests
npm run test:e2e -- error-scenarios.spec.ts -g "role-based access"

# Expected: 2 tests pass
# - SPECIALIST cannot access gig creation
# - CLIENT cannot apply to gigs

# Verify error messages shown or access denied
# Verify no unauthorized database changes
```

**Acceptance Criteria**:
- 2 role-based access tests implemented
- Tests verify error messages or access denied behavior
- Tests verify no unauthorized database changes
- Error messages (if shown) are in Russian
- All tests pass consistently

---

## Task 5: Implement closed gig error tests

**Description**: Add E2E tests that verify closed gigs (closedByAdmin = true) show appropriate error messages when users attempt to apply or interact with them.

**Implementation Notes**:
- Create gig programmatically with `closedByAdmin: true, closedAt: new Date()`
- Create SPECIALIST user and authenticate
- Navigate to gig detail page
- Attempt to submit application form
- Verify error message displayed: "Этот заказ был закрыт администраторами" or similar
- Verify no application record created in database
- Also test that closed gigs don't accept messages (if message form is visible)

**Test Plan**:
```bash
# Run closed gig tests
npm run test:e2e -- error-scenarios.spec.ts -g "closed gig"

# Expected: 1-2 tests pass
# - Cannot apply to closed gig
# - (Optional) Cannot message closed gig

# Verify error messages in Russian
# Verify no database records created
```

**Acceptance Criteria**:
- At least 1 closed gig test implemented (application blocking)
- Test verifies error message visibility
- Test verifies no application created in database
- Error message is in Russian
- Test passes consistently

---

## Task 6: Implement invalid state transition error tests

**Description**: Add E2E tests that verify invalid gig state transitions show appropriate errors (e.g., submitting work when not assigned, approving work when not owner, marking OPEN gig as paid).

**Implementation Notes**:
- Test 1: Submitting work when not assigned specialist
  - Create gig with assigned specialist A
  - Authenticate as specialist B
  - Attempt to submit work
  - Verify error message or form not visible
- Test 2: Approving work when not gig owner
  - Create gig owned by client A in REVIEW status
  - Authenticate as client B
  - Verify approve button not visible or shows error
- Test 3: Invalid state transition (OPEN → PAID)
  - Create OPEN gig (no assigned specialist)
  - Authenticate as gig owner
  - Verify "Mark as Paid" button not visible (correct behavior)
- Verify no database changes occur (status remains unchanged)

**Test Plan**:
```bash
# Run invalid state transition tests
npm run test:e2e -- error-scenarios.spec.ts -g "invalid state"

# Expected: 3 tests pass
# - Cannot submit work when not assigned
# - Cannot approve work when not owner
# - Cannot mark OPEN gig as paid

# Verify error messages or buttons not visible
# Verify no database state changes
```

**Acceptance Criteria**:
- 3 invalid state transition tests implemented
- Tests verify error messages or UI elements not visible
- Tests verify no database state changes
- Error messages (if shown) are in Russian
- All tests pass consistently

---

## Task 7: Implement non-OPEN gig application error tests

**Description**: Add E2E tests that verify gigs with status IN_PROGRESS, COMPLETED, or PAID don't accept new applications.

**Implementation Notes**:
- Create gigs programmatically with different statuses: IN_PROGRESS, COMPLETED, PAID
- Authenticate as SPECIALIST
- Navigate to gig detail pages
- Verify application form is not visible OR shows error message
- Verify no application records created in database
- May need to test multiple statuses or just one representative case

**Test Plan**:
```bash
# Run non-OPEN gig tests
npm run test:e2e -- error-scenarios.spec.ts -g "non-OPEN gig"

# Expected: 1-3 tests pass (depending on implementation)
# - Cannot apply to IN_PROGRESS gig
# - Cannot apply to COMPLETED gig
# - Cannot apply to PAID gig

# Verify form not visible or error shown
# Verify no applications created
```

**Acceptance Criteria**:
- At least 1 non-OPEN gig test implemented
- Test verifies application form not visible or error shown
- Test verifies no application created in database
- Test passes consistently

---

## Task 8: Verify error message quality

**Description**: Review all error messages tested in the suite and verify they meet quality standards (Russian language, specific, actionable, no sensitive info).

**Implementation Notes**:
- Review all error message assertions in test file
- Verify all messages are in Russian (Cyrillic characters)
- Verify messages are specific (not generic "Error" or "Something went wrong")
- Verify messages suggest corrective action when possible
- Verify no stack traces or internal details exposed
- Document any error message quality issues found
- This is primarily a review task, not implementation

**Test Plan**:
```bash
# Run all error scenario tests
npm run test:e2e -- error-scenarios.spec.ts

# Review test output for error messages
# Verify all messages are in Russian
# Verify messages are helpful and specific

# Check test file for error message assertions
grep "toBeVisible" __tests__/e2e/error-scenarios.spec.ts
grep "toContain" __tests__/e2e/error-scenarios.spec.ts
```

**Acceptance Criteria**:
- All error messages in tests are in Russian
- No generic error messages found
- Messages include actionable guidance
- No sensitive information exposed
- Quality review documented (comment in test file or PR description)

---

## Task 9: Verify test suite idempotency and performance

**Description**: Run the complete error scenario test suite multiple times to verify idempotency, performance, and consistency.

**Implementation Notes**:
- Run test suite 10 times consecutively
- Verify all runs pass without failures
- Verify no unique constraint violations or database errors
- Measure total execution time (should be < 60 seconds)
- Verify cleanup hooks work correctly (no data pollution between runs)
- Use unique email addresses (timestamp-based) to avoid conflicts

**Test Plan**:
```bash
# Run test suite 10 times
for i in {1..10}; do
  echo "Run $i"
  npm run test:e2e -- error-scenarios.spec.ts
done

# Expected: All 10 runs pass
# Expected: Total time per run < 60 seconds
# Expected: No database errors

# Verify cleanup works
npm run test:e2e -- error-scenarios.spec.ts
# Check test.db has no leftover data
sqlite3 test.db "SELECT COUNT(*) FROM User;"
# Should be 0 after cleanup
```

**Acceptance Criteria**:
- 10 consecutive runs all pass
- No unique constraint violations
- No database errors
- Total execution time < 60 seconds per run
- Cleanup hooks remove all test data
- Tests use unique identifiers (timestamp-based emails)

---

## Task 10: Update TESTING.md documentation

**Description**: Add documentation section to TESTING.md explaining the error scenario E2E test suite, coverage, and usage.

**Implementation Notes**:
- Add new section after existing E2E test documentation (after admin-moderation section)
- Title: "#### Error Scenario Testing"
- Include:
  - Brief description of test suite purpose
  - Command to run tests: `npm run test:e2e -- error-scenarios.spec.ts`
  - List of error scenarios covered (8+ scenarios)
  - Expected duration (~30-60 seconds)
  - Key features (idempotent, Russian error messages, comprehensive coverage)
- Keep documentation concise (under 200 words)
- Follow existing TESTING.md style and formatting

**Test Plan**:
```bash
# Verify documentation added
grep -A 30 "Error Scenario" TESTING.md

# Verify section includes:
# - Test command
# - List of scenarios
# - Duration estimate
# - Key features

# Verify formatting matches existing sections
```

**Acceptance Criteria**:
- TESTING.md includes "Error Scenario Testing" section
- Section lists all error scenarios covered
- Section includes command to run tests
- Section mentions duration (~30-60 seconds)
- Documentation is concise (under 200 words)
- Formatting matches existing TESTING.md style

---

## Task 11: Final verification and cleanup

**Description**: Run complete test suite (all E2E tests) to verify error scenario tests don't interfere with existing tests, and perform final cleanup.

**Implementation Notes**:
- Run all E2E tests: `npm run test:e2e`
- Verify all tests pass (existing + new error scenario tests)
- Check for any test interference or data pollution
- Verify test.db cleanup works across all tests
- Review test output for any warnings or issues
- Clean up any temporary files or test artifacts

**Test Plan**:
```bash
# Run all E2E tests
npm run test:e2e

# Expected: All tests pass
# - registration.spec.ts
# - auth-session.spec.ts
# - client-journey.spec.ts
# - specialist-journey.spec.ts
# - messaging-flow-e2e.spec.ts
# - admin-moderation.spec.ts
# - error-scenarios.spec.ts (NEW)

# Verify total execution time reasonable (< 5 minutes)
# Verify no test interference

# Clean up test database
npm run clean:test-db
```

**Acceptance Criteria**:
- All E2E tests pass (existing + new)
- No test interference or data pollution
- Total E2E suite execution time < 5 minutes
- No warnings or errors in test output
- Test database cleanup works correctly
- All tasks completed successfully
