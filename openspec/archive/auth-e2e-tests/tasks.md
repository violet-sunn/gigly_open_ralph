# Implementation Tasks: auth-e2e-tests

## Task 1: Create E2E test file structure and setup

**Implementation:**
- Create `__tests__/e2e/auth-flow.spec.ts` test file
- Import Playwright test utilities (`test`, `expect`)
- Import Prisma client for database operations
- Import test helpers: `createTestUser`, `createTestSession`, `setE2ESession`
- Set up `beforeEach` hook to ensure clean test state
- Set up `afterEach` hook to clean up test data (users, sessions)
- Configure test timeout (30 seconds per test)
- Add test suite description: "Auth Flow E2E Tests"

**Test Plan:**
- Run `npm run test:e2e -- auth-flow.spec.ts` and verify file is discovered
- Verify test suite structure is valid (no syntax errors)
- Verify hooks execute correctly (check console output)
- Verify test database isolation works (no impact on dev.db)

---

## Task 2: Implement happy path test - /auth to login (SPECIALIST)

**Implementation:**
- Create test: "should complete flow from /auth to login to dashboard (SPECIALIST)"
- Navigate to `http://localhost:3000/auth`
- Wait for page load with `page.waitForLoadState('networkidle')`
- Locate SPECIALIST role card using `page.locator('[data-testid="role-card-specialist"]')` or text content
- Click SPECIALIST role card
- Verify blue border appears: check computed style or class contains border styling
- Locate and click "Войти" button
- Wait for navigation to `/login?role=SPECIALIST`
- Verify URL contains `role=SPECIALIST` query parameter
- Verify SPECIALIST role card is pre-selected (has blue border)
- Create test user programmatically: `const user = await createTestUser(prisma, { role: 'SPECIALIST', email: 'test-specialist@example.com' })`
- Fill login form: email and password fields
- Submit form
- Wait for redirect to `/dashboard`
- Verify URL is `/dashboard`
- Verify session cookie exists: `const cookies = await page.context().cookies(); expect(cookies.find(c => c.name === 'session')).toBeDefined()`

**Test Plan:**
- Run test and verify it passes end-to-end
- Verify test completes in < 10 seconds
- Verify user can see dashboard after login
- Run test 3 times to ensure idempotency
- Check test database for created user (should be cleaned up after test)

---

## Task 3: Implement happy path test - /auth to register (CLIENT)

**Implementation:**
- Create test: "should complete flow from /auth to register to dashboard (CLIENT)"
- Navigate to `/auth`
- Click CLIENT role card
- Verify blue border appears on CLIENT card
- Click "Зарегестрироватся" button
- Wait for navigation to `/register?role=CLIENT`
- Verify URL contains `role=CLIENT`
- Verify CLIENT role card is pre-selected
- Generate unique test data:
  - Email: `test-client-${Date.now()}@example.com`
  - Password: `SecurePass123`
  - Company name: `ООО "ТестКомпания"`
  - INN: `7743013902`
- Fill registration form with all required fields
- Submit form
- Wait for redirect to `/dashboard`
- Verify URL is `/dashboard`
- Verify session cookie exists
- Verify user exists in database with CLIENT role

**Test Plan:**
- Run test and verify complete registration flow works
- Verify test completes in < 10 seconds
- Verify user is created with correct role and profile
- Verify session is established
- Run test multiple times with unique emails

---

## Task 4: Implement backward compatibility tests

**Implementation:**
- Create test: "should allow direct access to /login without redirect"
  - Navigate directly to `/login`
  - Verify URL is `/login` (no redirect to `/auth`)
  - Verify both role cards are visible
  - Verify neither role card has blue border initially
  - Select SPECIALIST role, fill credentials, login successfully
  - Verify redirect to `/dashboard`

- Create test: "should allow direct access to /register without redirect"
  - Navigate directly to `/register`
  - Verify URL is `/register` (no redirect)
  - Verify both role cards are visible
  - Select CLIENT role, fill all fields, register successfully
  - Verify redirect to `/dashboard`

**Test Plan:**
- Run both tests and verify backward compatibility is maintained
- Verify no redirects occur when accessing /login or /register directly
- Verify users can complete auth flows from direct URLs
- Test with bookmarked URLs to simulate real user behavior

---

## Task 5: Implement role pre-selection tests

**Implementation:**
- Create test: "should pre-select SPECIALIST role from query parameter"
  - Navigate to `/login?role=SPECIALIST`
  - Verify SPECIALIST role card has blue border (2px solid #0265dc)
  - Verify CLIENT role card is visible but not selected
  - Create test user, fill credentials, login
  - Verify authentication succeeds as SPECIALIST

- Create test: "should pre-select CLIENT role from query parameter"
  - Navigate to `/register?role=CLIENT`
  - Verify CLIENT role card has blue border
  - Verify SPECIALIST role card is visible but not selected
  - Fill all registration fields, submit
  - Verify authentication succeeds as CLIENT

**Test Plan:**
- Run both tests and verify query parameter pre-selection works
- Verify correct role card is highlighted with blue border
- Verify users can authenticate with pre-selected role
- Test with both /login and /register pages

---

## Task 6: Implement visual state tests

**Implementation:**
- Create test: "should display role card selection state correctly"
  - Navigate to `/auth`
  - Click SPECIALIST role card
  - Verify SPECIALIST card has border: `await expect(page.locator('[data-testid="role-card-specialist"]')).toHaveCSS('border', '2px solid rgb(2, 101, 220)')`
  - Verify CLIENT card has no blue border
  - Click CLIENT role card
  - Verify CLIENT card now has blue border
  - Verify SPECIALIST card no longer has blue border

- Create test: "should display button hover state (desktop)" - OPTIONAL
  - Set viewport to desktop: `await page.setViewportSize({ width: 1440, height: 900 })`
  - Navigate to `/auth`
  - Hover over "Войти" button: `await page.hover('button:has-text("Войти")')`
  - Take screenshot during hover
  - Verify hover state is visually distinct (may require visual comparison)

**Test Plan:**
- Run selection state test and verify role cards respond correctly
- Verify only one role card has blue border at a time
- Verify border styling matches Figma design (#0265dc)
- Hover test is optional - may be skipped if too complex

---

## Task 7: Implement responsive behavior tests

**Implementation:**
- Create test: "should adapt layout for mobile viewport"
  - Set viewport to mobile: `await page.setViewportSize({ width: 375, height: 667 })`
  - Navigate to `/auth`
  - Verify container width is responsive (not fixed 418px)
  - Verify padding is reduced (20px instead of 40px)
  - Select role and navigate to login
  - Verify mobile layout works correctly
  - Take screenshot for visual verification

- Create test: "should display desktop layout correctly"
  - Set viewport to desktop: `await page.setViewportSize({ width: 1440, height: 900 })`
  - Navigate to `/auth`
  - Verify container width is 418px
  - Verify padding is 40px
  - Take screenshot and compare with Figma design

**Test Plan:**
- Run both tests with different viewport sizes
- Verify layout adapts correctly to mobile and desktop
- Verify all interactive elements remain functional on mobile
- Compare screenshots with Figma design specifications

---

## Task 8: Implement accessibility tests

**Implementation:**
- Create test: "should support keyboard navigation on /auth"
  - Navigate to `/auth`
  - Use `await page.keyboard.press('Tab')` to navigate through elements
  - Verify focus moves to: SPECIALIST card → CLIENT card → "Войти" button → "Зарегестрироватся" button
  - Verify focus indicators are visible (check for outline or border)
  - Press Enter on SPECIALIST card to select it
  - Press Enter on "Войти" button to navigate
  - Verify navigation to `/login?role=SPECIALIST` works

- Create test: "should have proper ARIA attributes on role cards"
  - Navigate to `/auth`
  - Verify role cards have `role="button"` or are `<button>` elements
  - Click SPECIALIST card
  - Verify selected card has `aria-pressed="true"` or equivalent
  - Verify unselected card has `aria-pressed="false"` or equivalent
  - Verify buttons have accessible labels

**Test Plan:**
- Run keyboard navigation test using only keyboard inputs
- Verify complete auth flow can be completed without mouse
- Verify focus indicators are visible at each step
- Run ARIA test and verify all attributes are present
- Use browser dev tools to inspect ARIA attributes

---

## Task 9: Implement error state tests

**Implementation:**
- Create test: "should display error for invalid credentials"
  - Navigate to `/login`
  - Fill email with non-existent user: `invalid-user@example.com`
  - Fill password with any value
  - Submit form
  - Wait for error message to appear
  - Verify error text: "Invalid email or password."
  - Verify URL is still `/login` (no redirect)
  - Verify form fields are still editable
  - Correct credentials and verify login succeeds

- Create test: "should display validation errors on registration"
  - Navigate to `/register`
  - Fill form with weak password: `weak`
  - Submit form
  - Wait for error message
  - Verify error text contains: "Password must be at least 8 characters long"
  - Verify URL is still `/register`
  - Correct password to `SecurePass123`
  - Submit again and verify registration succeeds

- Create test: "should display rate limiting feedback" - OPTIONAL
  - This test may be complex to set up (requires triggering rate limit)
  - Consider programmatic setup or skip if too complex
  - If implemented: trigger rate limit, attempt login, verify error message with retry-after info

**Test Plan:**
- Run invalid credentials test and verify error handling works
- Verify error messages are clear and actionable
- Run validation error test and verify password requirements are enforced
- Verify users can correct errors and retry successfully
- Rate limiting test is optional - may be skipped

---

## Task 10: Implement visual regression tests

**Implementation:**
- Create test: "should match Figma design for /auth page"
  - Set viewport to desktop: `await page.setViewportSize({ width: 1440, height: 900 })`
  - Navigate to `/auth`
  - Wait for all images and fonts to load
  - Take screenshot: `await page.screenshot({ path: 'test-results/auth-page.png', fullPage: true })`
  - Compare with Figma design reference (if available)
  - Use Playwright's built-in screenshot comparison: `await expect(page).toHaveScreenshot('auth-page.png', { maxDiffPixels: 100 })`
  - Or calculate pixel difference manually and verify < 5%

- Create test: "should match Figma design for /login page with role selected"
  - Navigate to `/login?role=SPECIALIST`
  - Take screenshot
  - Compare with Figma design reference
  - Verify role selection state is correct

- Create test: "should display decorative checkerboard pattern"
  - Navigate to `/auth`
  - Scroll to bottom of page
  - Verify decorative pattern element exists
  - Verify pattern styling: color #0088ff, opacity 0.3, height 327px
  - Take screenshot including pattern
  - Verify pattern does not block interactive elements

**Test Plan:**
- Run visual regression tests and verify screenshots are generated
- Compare screenshots with Figma design manually or using diff tool
- Verify pixel difference is < 5% for key screens
- Verify decorative pattern is visible and correctly styled
- Store baseline screenshots for future comparisons
- Note: Visual regression may have some variance due to font rendering - adjust threshold as needed

---

## Task 11: Update test documentation

**Implementation:**
- Update `TESTING.md` or create `__tests__/e2e/README.md`
- Add section: "Auth Flow E2E Tests"
- Document all 10+ test scenarios with brief descriptions
- Explain how to run tests: `npm run test:e2e -- auth-flow.spec.ts`
- Explain how to run specific test: `npm run test:e2e -- auth-flow.spec.ts -g "should complete flow"`
- Explain how to debug tests:
  - Headed mode: `npm run test:e2e -- auth-flow.spec.ts --headed`
  - Slow motion: `npm run test:e2e -- auth-flow.spec.ts --headed --slow-mo=1000`
  - Screenshots on failure: automatically saved to `test-results/`
- Document visual regression approach:
  - Baseline screenshots stored in `__tests__/e2e/screenshots/`
  - Threshold: < 5% pixel difference
  - Figma design reference: node-id=4100-385
- Document test data cleanup approach
- Document known limitations (e.g., font rendering variance in visual tests)

**Test Plan:**
- Review documentation for clarity and completeness
- Verify all commands work as documented
- Verify debugging tips are accurate
- Ask another developer to follow documentation and run tests
- Update documentation based on feedback

---

## Task 12: Verify test suite completeness and CI readiness

**Implementation:**
- Run complete test suite: `npm run test:e2e -- auth-flow.spec.ts`
- Verify all tests pass
- Verify total execution time is < 2 minutes
- Verify tests are idempotent (run 5 times consecutively)
- Verify tests work in CI environment (if CI is set up)
- Verify test database isolation (no impact on dev.db)
- Review test coverage against requirements:
  - ✓ Complete flow: /auth → login → dashboard (SPECIALIST)
  - ✓ Complete flow: /auth → register → dashboard (CLIENT)
  - ✓ Direct /login access (backward compatibility)
  - ✓ Direct /register access (backward compatibility)
  - ✓ Role pre-selection from query params (SPECIALIST)
  - ✓ Role pre-selection from query params (CLIENT)
  - ✓ Visual states (role card selection)
  - ✓ Responsive behavior (mobile and desktop)
  - ✓ Accessibility (keyboard navigation, ARIA)
  - ✓ Error states (invalid credentials, validation)
  - ✓ Visual regression (Figma comparison)

**Test Plan:**
- Run full test suite and verify all tests pass
- Verify execution time is acceptable (< 2 minutes)
- Run tests 5 times and verify consistent results
- Check test coverage report (if available)
- Verify all 10 requirements from PRD are covered
- Document any skipped tests with justification
- Get approval from team lead or reviewer

---

## Summary

**Total Tasks:** 12
**Estimated Effort:** 8-12 hours
**Dependencies:** Existing Playwright setup, test helpers, auth pages
**Risk Areas:** Visual regression tests (font rendering), rate limiting test (complex setup)

**Recommended Implementation Order:**
1. Task 1 (setup) - Foundation for all other tasks
2. Tasks 2-3 (happy paths) - Core functionality
3. Tasks 4-5 (backward compatibility, pre-selection) - Important user flows
4. Task 6 (visual states) - UI verification
5. Task 7 (responsive) - Cross-device support
6. Task 8 (accessibility) - Compliance and usability
7. Task 9 (error states) - Error handling
8. Task 10 (visual regression) - Design fidelity (may be partially skipped if complex)
9. Task 11 (documentation) - Knowledge sharing
10. Task 12 (verification) - Final validation

**Success Criteria:**
- All tests pass consistently
- Test execution time < 2 minutes
- Coverage includes all 10 requirements
- Documentation is clear and complete
- Tests are maintainable and well-structured
