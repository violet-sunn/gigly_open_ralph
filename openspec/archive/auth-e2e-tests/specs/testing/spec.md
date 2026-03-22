# Testing Specification Delta

## ADDED Requirements

### Requirement: Auth Flow E2E Test Suite

The platform SHALL provide comprehensive E2E tests for the authentication flow that validate complete user journeys, visual fidelity to Figma design, responsive behavior, accessibility, and error handling.

#### Scenario: Complete flow from /auth to login to dashboard (SPECIALIST)

**Given** an unauthenticated user navigates to `/auth`
**When** they select the SPECIALIST role card
**And** they click the "Войти" (Login) button
**And** they fill valid credentials on the login page
**And** they submit the login form
**Then** they MUST be redirected to `/dashboard`
**And** the session cookie MUST be set
**And** the dashboard MUST display specialist-specific content

**Acceptance Criteria:**
- Test navigates to `/auth` and verifies page loads
- Test clicks SPECIALIST role card and verifies blue border appears (2px solid #0265dc)
- Test clicks "Войти" button and verifies navigation to `/login?role=SPECIALIST`
- Test verifies SPECIALIST role card is pre-selected on login page
- Test fills email and password fields with valid credentials
- Test submits form and waits for redirect to `/dashboard`
- Test verifies URL is `/dashboard`
- Test verifies session cookie exists in browser context
- Run `npm run test:e2e -- auth-flow.spec.ts` and verify test passes

---

#### Scenario: Complete flow from /auth to register to dashboard (CLIENT)

**Given** an unauthenticated user navigates to `/auth`
**When** they select the CLIENT role card
**And** they click the "Зарегестрироватся" (Register) button
**And** they fill valid registration details on the register page
**And** they submit the registration form
**Then** they MUST be redirected to `/dashboard`
**And** the session cookie MUST be set
**And** the dashboard MUST display client-specific content

**Acceptance Criteria:**
- Test navigates to `/auth` and verifies page loads
- Test clicks CLIENT role card and verifies blue border appears
- Test clicks "Зарегестрироватся" button and verifies navigation to `/register?role=CLIENT`
- Test verifies CLIENT role card is pre-selected on register page
- Test fills all required fields: email, password, role (CLIENT), companyName, inn
- Test submits form and waits for redirect to `/dashboard`
- Test verifies URL is `/dashboard`
- Test verifies session cookie exists
- Run test and verify it passes

---

#### Scenario: Direct access to /login works (backward compatibility)

**Given** an unauthenticated user
**When** they navigate directly to `/login`
**Then** the login page MUST load successfully
**And** both role cards MUST be visible but neither pre-selected
**And** the user MUST be able to select a role and login
**And** no redirect to `/auth` MUST occur

**Acceptance Criteria:**
- Test uses `page.goto('http://localhost:3000/login')`
- Test verifies URL is `/login` (no redirect)
- Test verifies both SPECIALIST and CLIENT role cards are visible
- Test verifies neither role card has blue border initially
- Test can select role, fill credentials, and login successfully
- Run test and verify backward compatibility is maintained

---

#### Scenario: Direct access to /register works (backward compatibility)

**Given** an unauthenticated user
**When** they navigate directly to `/register`
**Then** the register page MUST load successfully
**And** both role cards MUST be visible but neither pre-selected
**And** the user MUST be able to select a role and register
**And** no redirect to `/auth` MUST occur

**Acceptance Criteria:**
- Test uses `page.goto('http://localhost:3000/register')`
- Test verifies URL is `/register` (no redirect)
- Test verifies both role cards are visible
- Test verifies neither role card has blue border initially
- Test can select role, fill all fields, and register successfully
- Run test and verify backward compatibility is maintained

---

#### Scenario: Role pre-selection from query parameter (SPECIALIST)

**Given** an unauthenticated user
**When** they navigate to `/login?role=SPECIALIST`
**Then** the SPECIALIST role card MUST be pre-selected with blue border
**And** the CLIENT role card MUST be visible but not selected
**And** the user MUST be able to login as SPECIALIST

**Acceptance Criteria:**
- Test navigates to `/login?role=SPECIALIST`
- Test verifies SPECIALIST role card has blue border (2px solid #0265dc)
- Test verifies CLIENT role card is visible but has no blue border
- Test can fill credentials and login successfully
- Test verifies user is authenticated as SPECIALIST role
- Run test and verify query parameter pre-selection works

---

#### Scenario: Role pre-selection from query parameter (CLIENT)

**Given** an unauthenticated user
**When** they navigate to `/register?role=CLIENT`
**Then** the CLIENT role card MUST be pre-selected with blue border
**And** the SPECIALIST role card MUST be visible but not selected
**And** the user MUST be able to register as CLIENT

**Acceptance Criteria:**
- Test navigates to `/register?role=CLIENT`
- Test verifies CLIENT role card has blue border
- Test verifies SPECIALIST role card is visible but has no blue border
- Test can fill all fields and register successfully
- Test verifies user is authenticated as CLIENT role
- Run test and verify query parameter pre-selection works

---

#### Scenario: Visual state - role card selection

**Given** a user is on `/auth` page
**When** they click a role card
**Then** the selected card MUST display a 2px solid blue border (#0265dc)
**And** the unselected card MUST have no blue border
**And** the visual state MUST match Figma design specifications

**Acceptance Criteria:**
- Test clicks SPECIALIST role card
- Test verifies border style: `border: 2px solid #0265dc` or equivalent
- Test clicks CLIENT role card
- Test verifies SPECIALIST border is removed and CLIENT border is added
- Test takes screenshot and compares with Figma design (< 5% pixel difference)
- Run test and verify visual states match design

---

#### Scenario: Visual state - button hover (desktop only)

**Given** a user is on `/auth` page with desktop viewport
**When** they hover over the "Войти" button
**Then** the button MUST display hover state styling
**And** the hover state MUST be visually distinct from default state

**Acceptance Criteria:**
- Test sets viewport to desktop size (1440x900)
- Test hovers over "Войти" button using `page.hover()`
- Test verifies hover state is applied (color change, opacity, etc.)
- Test takes screenshot during hover and verifies visual change
- Run test and verify hover states work correctly

---

#### Scenario: Responsive behavior - mobile viewport

**Given** a user views `/auth` page on mobile viewport (< 768px)
**When** the page renders
**Then** the container width MUST be 90vw (not fixed 418px)
**And** the container padding MUST be 20px (not 40px)
**And** role cards MUST stack vertically if needed
**And** all interactive elements MUST remain functional

**Acceptance Criteria:**
- Test sets viewport to mobile size (375x667)
- Test navigates to `/auth`
- Test verifies container width is responsive (not fixed 418px)
- Test verifies padding is reduced on mobile
- Test can select role and navigate to login/register
- Test takes screenshot and verifies mobile layout
- Run test and verify responsive behavior works

---

#### Scenario: Responsive behavior - desktop viewport

**Given** a user views `/auth` page on desktop viewport (≥ 768px)
**When** the page renders
**Then** the container width MUST be 418px
**And** the container padding MUST be 40px
**And** all Figma design specifications MUST be applied

**Acceptance Criteria:**
- Test sets viewport to desktop size (1440x900)
- Test navigates to `/auth`
- Test verifies container width is 418px
- Test verifies padding is 40px
- Test takes screenshot and compares with Figma design
- Run test and verify desktop layout matches design

---

#### Scenario: Accessibility - keyboard navigation on /auth

**Given** a user navigates to `/auth` using keyboard only
**When** they press Tab to navigate through interactive elements
**Then** focus MUST move through role cards and buttons in logical order
**And** focus indicators MUST be visible
**And** Enter/Space keys MUST activate selected elements

**Acceptance Criteria:**
- Test navigates to `/auth`
- Test uses `page.keyboard.press('Tab')` to navigate
- Test verifies focus moves to SPECIALIST card, CLIENT card, "Войти" button, "Зарегестрироватся" button
- Test verifies focus indicators are visible (outline, border, etc.)
- Test uses `page.keyboard.press('Enter')` to select role and navigate
- Test verifies keyboard-only navigation completes full flow
- Run test and verify keyboard accessibility works

---

#### Scenario: Accessibility - ARIA attributes on role cards

**Given** a user with screen reader views `/auth` page
**When** the page renders
**Then** role cards MUST have appropriate ARIA attributes
**And** selection state MUST be announced to screen readers
**And** button labels MUST be descriptive

**Acceptance Criteria:**
- Test navigates to `/auth`
- Test verifies role cards have `role="button"` or `<button>` element
- Test verifies selected role card has `aria-pressed="true"` or equivalent
- Test verifies unselected role card has `aria-pressed="false"` or equivalent
- Test verifies buttons have accessible labels (not just icons)
- Test verifies heading hierarchy is correct (h1, h2, etc.)
- Run test and verify ARIA attributes are present

---

#### Scenario: Accessibility - focus management after navigation

**Given** a user selects a role and clicks "Войти" on `/auth`
**When** they navigate to `/login?role=SPECIALIST`
**Then** focus MUST be set to a logical element (heading or first input)
**And** screen reader MUST announce page change
**And** user MUST be able to continue with keyboard navigation

**Acceptance Criteria:**
- Test navigates through `/auth` → `/login` flow using keyboard
- Test verifies focus is set after navigation (not lost)
- Test verifies user can continue keyboard navigation on login page
- Test verifies no focus traps exist
- Run test and verify focus management works correctly

---

#### Scenario: Error state - invalid credentials on login

**Given** a user is on `/login` page
**When** they enter invalid email or password
**And** they submit the login form
**Then** an error message MUST be displayed
**And** the error message MUST be clear and actionable
**And** the form MUST remain on the login page (no redirect)
**And** the user MUST be able to retry

**Acceptance Criteria:**
- Test navigates to `/login`
- Test fills email with valid format but non-existent user
- Test fills password with any value
- Test submits form
- Test verifies error message appears: "Invalid email or password."
- Test verifies URL is still `/login` (no redirect)
- Test verifies form fields are still editable
- Test can correct credentials and login successfully
- Run test and verify error handling works

---

#### Scenario: Error state - validation errors on registration

**Given** a user is on `/register` page
**When** they submit the form with invalid data (weak password, missing fields)
**Then** validation error messages MUST be displayed
**And** the messages MUST specify which fields are invalid
**And** the form MUST remain on the register page
**And** the user MUST be able to correct and resubmit

**Acceptance Criteria:**
- Test navigates to `/register`
- Test fills form with weak password (e.g., "weak")
- Test submits form
- Test verifies error message appears: "Password must be at least 8 characters long." or similar
- Test verifies URL is still `/register`
- Test corrects password to strong value
- Test submits again and verifies registration succeeds
- Run test and verify validation error handling works

---

#### Scenario: Error state - rate limiting feedback

**Given** a user has exceeded login rate limit (15 attempts in 15 minutes)
**When** they attempt to login again
**Then** a rate limit error message MUST be displayed
**And** the message MUST indicate when they can retry
**And** the form MUST be disabled or show clear feedback

**Acceptance Criteria:**
- Test creates scenario with rate limit exceeded (may require programmatic setup)
- Test attempts login
- Test verifies error message appears with retry-after information
- Test verifies message is user-friendly (e.g., "Too many login attempts. Please try again in 5 minutes.")
- Test verifies form provides clear feedback (disabled state or prominent error)
- Run test and verify rate limiting feedback works

---

#### Scenario: Visual regression - /auth page matches Figma design

**Given** the `/auth` page is rendered on desktop viewport
**When** a screenshot is taken
**Then** the screenshot MUST match the Figma design with < 5% pixel difference
**And** key visual elements MUST be pixel-perfect:
  - Container dimensions (418x540px)
  - Border radius (25px)
  - Logo positioning
  - Role card styling
  - Button colors (#0088FF for primary)
  - Decorative checkerboard pattern at bottom

**Acceptance Criteria:**
- Test navigates to `/auth` with desktop viewport (1440x900)
- Test takes full-page screenshot
- Test compares screenshot with Figma design reference image
- Test calculates pixel difference percentage
- Test verifies difference is < 5%
- Test highlights specific mismatches if difference > 5%
- Run test and verify visual fidelity to design

---

#### Scenario: Visual regression - /login page matches Figma design

**Given** the `/login` page is rendered with role pre-selected
**When** a screenshot is taken
**Then** the screenshot MUST match the Figma design with < 5% pixel difference
**And** role selection state MUST be visually correct (blue border on selected card)

**Acceptance Criteria:**
- Test navigates to `/login?role=SPECIALIST`
- Test takes screenshot of login page
- Test compares with Figma design reference
- Test verifies pixel difference < 5%
- Test verifies role card selection state is correct
- Run test and verify visual fidelity

---

#### Scenario: Visual regression - decorative pattern visibility

**Given** the `/auth` or `/login` page is rendered
**When** the page is scrolled to bottom
**Then** the decorative checkerboard pattern MUST be visible
**And** the pattern MUST use #0088ff color at 0.3 opacity
**And** the pattern MUST be 327px height and full width
**And** the pattern MUST NOT interfere with form interaction

**Acceptance Criteria:**
- Test navigates to `/auth`
- Test scrolls to bottom of page
- Test verifies decorative pattern element exists
- Test verifies pattern styling (color, opacity, dimensions)
- Test verifies pattern does not block interactive elements
- Test takes screenshot including pattern
- Run test and verify decorative pattern is correct

---

### Requirement: E2E Test Infrastructure for Auth Flow

The platform SHALL provide test infrastructure and helpers specifically for auth flow E2E testing.

#### Scenario: Test helper for creating authenticated sessions in E2E tests

**Given** an E2E test needs to bypass login UI for setup
**When** the test calls `setE2ESession(page, user)`
**Then** a valid session cookie MUST be added to browser context
**And** subsequent navigations MUST maintain authenticated state

**Acceptance Criteria:**
- Helper function `setE2ESession(page, user)` exists in `__tests__/helpers/auth.ts`
- Function accepts Playwright Page object and user object
- Function generates JWT token and adds session cookie
- Test can navigate to protected pages after calling helper
- Helper is documented in test documentation
- Run test using helper and verify authentication works

---

#### Scenario: Test helper for visual regression comparison

**Given** an E2E test needs to compare screenshots with Figma design
**When** the test calls `compareWithFigma(page, figmaNodeId, threshold)`
**Then** the helper MUST fetch Figma design screenshot
**And** the helper MUST take current page screenshot
**And** the helper MUST calculate pixel difference percentage
**And** the helper MUST return comparison result with difference percentage

**Acceptance Criteria:**
- Helper function exists for visual comparison (or use existing Playwright screenshot comparison)
- Function can fetch Figma design reference (or use pre-downloaded images)
- Function calculates pixel difference accurately
- Function respects threshold parameter (default 5%)
- Function provides detailed diff output on failure
- Run test using helper and verify comparison works

---

#### Scenario: Test data cleanup after E2E tests

**Given** E2E tests have created users and sessions
**When** tests complete (pass or fail)
**Then** all test data MUST be cleaned up from test database
**And** no orphaned records MUST remain

**Acceptance Criteria:**
- afterEach or afterAll hook cleans up test users
- Test database is isolated from development database
- Cleanup respects foreign key constraints
- Cleanup is idempotent (can run multiple times safely)
- Run tests multiple times and verify no data accumulation

---

### Requirement: E2E Test Documentation

The platform SHALL provide clear documentation for auth flow E2E tests.

#### Scenario: Test documentation explains auth flow test coverage

**Given** a developer reads test documentation
**When** they want to understand auth flow test coverage
**Then** documentation MUST list all 10 test scenarios
**And** documentation MUST explain how to run auth flow tests
**And** documentation MUST explain how to debug failing tests
**And** documentation MUST explain visual regression testing approach

**Acceptance Criteria:**
- `TESTING.md` or `__tests__/e2e/README.md` includes auth flow section
- All 10 scenarios are documented with descriptions
- Commands for running tests are provided: `npm run test:e2e -- auth-flow.spec.ts`
- Debugging tips are included (headed mode, slow-mo, screenshots)
- Visual regression approach is explained (threshold, Figma reference)
- Documentation is clear and actionable
