# Testing Specification Delta: Login Page Redesign

## ADDED Requirements

### Requirement: E2E Tests for Role Parameter Handling
The system MUST include E2E tests verifying role parameter display and login functionality.

#### Scenario: Login with SPECIALIST role parameter shows correct visual state
- GIVEN a test navigates to `/login?role=SPECIALIST`
- WHEN the page loads
- THEN the test MUST verify:
  - Specialist role card has 2px blue border (selected state)
  - Client role card has no border (unselected state)
  - Login form is functional
- WHEN valid credentials are submitted
- THEN the test MUST verify:
  - User is redirected to `/dashboard`
  - Session is created with correct role from database

#### Scenario: Login with CLIENT role parameter shows correct visual state
- GIVEN a test navigates to `/login?role=CLIENT`
- WHEN the page loads
- THEN the test MUST verify:
  - Client role card has 2px blue border (selected state)
  - Specialist role card has no border (unselected state)
  - Login form is functional
- WHEN valid credentials are submitted
- THEN the test MUST verify:
  - User is redirected to `/dashboard`
  - Session is created with correct role from database

#### Scenario: Login without role parameter handles gracefully
- GIVEN a test navigates to `/login` (no role parameter)
- WHEN the page loads
- THEN the test MUST verify:
  - Page renders without errors
  - Login form is functional
  - Role cards display gracefully (both unselected or hidden)
- WHEN valid credentials are submitted
- THEN the test MUST verify:
  - User is redirected to `/dashboard`
  - Session is created normally

#### Scenario: Login with invalid role parameter handles gracefully
- GIVEN a test navigates to `/login?role=ADMIN` (invalid role)
- WHEN the page loads
- THEN the test MUST verify:
  - Page renders without errors
  - Login form is functional
  - Role cards display gracefully (fallback behavior)
- WHEN valid credentials are submitted
- THEN the test MUST verify:
  - User is redirected to `/dashboard`
  - Session is created normally

**Acceptance Criteria:**
- E2E test file created: `__tests__/e2e/login-role-param.spec.ts`
- Tests use Playwright to verify visual state (border colors, element presence)
- Tests verify login functionality works with all role parameter variations
- Tests verify session creation uses database role, not query parameter
- All tests pass before deployment

---

### Requirement: Visual Regression Testing for Login Page
The redesigned login page MUST be visually compared against the Figma design to ensure exact match.

#### Scenario: Visual QA checklist verifies design fidelity
- GIVEN the redesigned login page is implemented
- WHEN visual QA is performed
- THEN the following MUST be verified:
  - Container dimensions: 418x540px (desktop)
  - Border-radius: 25px
  - Padding: 40px (desktop), 20px (mobile)
  - Logo and heading typography: 22px Manrope SemiBold
  - Role card layout and selection state (2px blue border)
  - Input field styling: #10121c background, #242935 border, 20px border-radius, 20px padding
  - Button styling: 50px height, #0088FF background
  - Background pattern position and appearance
  - Spacing between all elements matches Figma

**Acceptance Criteria:**
- Visual QA checklist completed and documented
- Screenshots taken for comparison with Figma design
- All checklist items verified as matching or deviations justified
- Visual comparison performed on multiple viewports (mobile, desktop)

---

### Requirement: Existing Authentication Tests Must Pass
All existing authentication tests MUST continue to pass after login page redesign.

#### Scenario: Existing integration tests pass unchanged
- GIVEN the login page is redesigned
- WHEN existing integration tests are run
- THEN all tests in `__tests__/integration/login.test.ts` MUST pass
- AND all tests in `__tests__/integration/registration.test.ts` MUST pass
- AND no test modifications are required

#### Scenario: Existing E2E tests pass unchanged
- GIVEN the login page is redesigned
- WHEN existing E2E tests are run
- THEN all tests in `__tests__/e2e/login.spec.ts` MUST pass
- AND all tests in `__tests__/e2e/auth-flow.spec.ts` MUST pass
- AND no test modifications are required (or only selector updates)

**Acceptance Criteria:**
- Run `npm run test:unit` → all authentication tests pass
- Run `npm run test:e2e` → all authentication E2E tests pass
- Test modifications limited to selector updates if needed
- No changes to test logic or assertions
- All 493+ existing tests continue to pass

---

### Requirement: Responsive Design Testing
The login page MUST be tested on multiple viewport sizes to verify responsive behavior.

#### Scenario: Mobile viewport (375px) displays correctly
- GIVEN a test sets viewport to 375px width
- WHEN the login page loads
- THEN the test MUST verify:
  - Container width adapts to 90vw
  - Padding reduces appropriately
  - All elements remain readable and functional
  - Form submission works correctly

#### Scenario: Desktop viewport (1440px) displays correctly
- GIVEN a test sets viewport to 1440px width
- WHEN the login page loads
- THEN the test MUST verify:
  - Container width is 418px
  - Container is centered on viewport
  - All spacing matches Figma design
  - Form submission works correctly

**Acceptance Criteria:**
- E2E tests include viewport size variations
- Tests verify responsive behavior on mobile (375px) and desktop (1440px)
- Manual testing performed on additional sizes (414px, 768px, 1920px)
- All viewports maintain functionality and accessibility
