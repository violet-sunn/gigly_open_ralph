# Testing Specification Delta: auth-landing-page

## ADDED Requirements

### Requirement: Auth Landing Page E2E Tests

The platform SHALL provide comprehensive end-to-end tests for the auth landing page navigation flows using Playwright.

#### Scenario: Auth landing page loads correctly

- GIVEN an unauthenticated user
- WHEN the user navigates to `/auth`
- THEN the page MUST load successfully
- AND the page MUST display the Gigly logo
- AND the page MUST display two role cards (Specialist and Client)
- AND the page MUST display two buttons (Login and Register)
- AND both buttons MUST be disabled initially

**Acceptance Criteria:**
- Test file exists at `__tests__/e2e/auth-landing.spec.ts`
- Test navigates to `http://localhost:3000/auth`
- Test verifies logo is visible
- Test verifies both role cards are visible
- Test verifies both buttons are visible and disabled
- Test passes consistently

#### Scenario: User selects Specialist role

- GIVEN the auth landing page is loaded
- WHEN the user clicks the Specialist role card
- THEN the Specialist card MUST show selected state (blue border)
- AND the Client card MUST show unselected state (no border)
- AND both buttons MUST become enabled

**Acceptance Criteria:**
- Test clicks Specialist role card
- Test verifies Specialist card has blue border (check CSS class or computed style)
- Test verifies Client card has no blue border
- Test verifies both buttons are enabled (not disabled)

#### Scenario: User selects Client role

- GIVEN the auth landing page is loaded
- WHEN the user clicks the Client role card
- THEN the Client card MUST show selected state (blue border)
- AND the Specialist card MUST show unselected state (no border)
- AND both buttons MUST become enabled

**Acceptance Criteria:**
- Test clicks Client role card
- Test verifies Client card has blue border
- Test verifies Specialist card has no blue border
- Test verifies both buttons are enabled

#### Scenario: User changes role selection

- GIVEN the user has selected Specialist role
- WHEN the user clicks the Client role card
- THEN the Client card MUST become selected
- AND the Specialist card MUST become unselected
- AND both buttons MUST remain enabled

**Acceptance Criteria:**
- Test clicks Specialist card, then Client card
- Test verifies only Client card is selected after second click
- Test verifies buttons remain enabled

#### Scenario: Navigate to login with Specialist role

- GIVEN the user has selected Specialist role
- WHEN the user clicks the "Войти" (Login) button
- THEN the browser MUST navigate to `/login?role=SPECIALIST`
- AND the URL MUST contain the correct query parameter

**Acceptance Criteria:**
- Test selects Specialist role
- Test clicks Login button
- Test waits for navigation
- Test verifies URL is `/login?role=SPECIALIST`
- Test verifies page loads successfully

#### Scenario: Navigate to login with Client role

- GIVEN the user has selected Client role
- WHEN the user clicks the "Войти" (Login) button
- THEN the browser MUST navigate to `/login?role=CLIENT`
- AND the URL MUST contain the correct query parameter

**Acceptance Criteria:**
- Test selects Client role
- Test clicks Login button
- Test waits for navigation
- Test verifies URL is `/login?role=CLIENT`
- Test verifies page loads successfully

#### Scenario: Navigate to register with Specialist role

- GIVEN the user has selected Specialist role
- WHEN the user clicks the "Зарегестрироватся" (Register) button
- THEN the browser MUST navigate to `/register?role=SPECIALIST`
- AND the URL MUST contain the correct query parameter

**Acceptance Criteria:**
- Test selects Specialist role
- Test clicks Register button
- Test waits for navigation
- Test verifies URL is `/register?role=SPECIALIST`
- Test verifies page loads successfully

#### Scenario: Navigate to register with Client role

- GIVEN the user has selected Client role
- WHEN the user clicks the "Зарегестрироватся" (Register) button
- THEN the browser MUST navigate to `/register?role=CLIENT`
- AND the URL MUST contain the correct query parameter

**Acceptance Criteria:**
- Test selects Client role
- Test clicks Register button
- Test waits for navigation
- Test verifies URL is `/register?role=CLIENT`
- Test verifies page loads successfully

#### Scenario: Authenticated user is redirected from /auth

- GIVEN a user is already logged in (has valid session)
- WHEN the user navigates to `/auth`
- THEN the browser MUST redirect to `/dashboard`
- AND the user MUST NOT see the auth landing page

**Acceptance Criteria:**
- Test creates authenticated session using `setE2ESession(page, user)`
- Test navigates to `/auth`
- Test waits for navigation
- Test verifies URL is `/dashboard`
- Test verifies auth landing page is not visible

#### Scenario: Responsive layout on mobile

- GIVEN the viewport is set to mobile size (375px width)
- WHEN the auth landing page loads
- THEN the card MUST have width 90vw (not fixed 418px)
- AND all content MUST remain visible and accessible
- AND role cards MUST be stacked vertically
- AND buttons MUST be stacked vertically

**Acceptance Criteria:**
- Test sets viewport to 375px × 667px (iPhone SE)
- Test navigates to `/auth`
- Test verifies card width is approximately 90% of viewport
- Test verifies all elements are visible
- Test verifies no horizontal scrolling
- Test can click role cards and buttons

---

### Requirement: Auth Landing Page Visual Regression Tests

The platform SHALL provide visual regression tests to ensure the auth landing page matches the Figma design.

#### Scenario: Visual comparison with Figma design

- GIVEN the auth landing page is rendered
- WHEN a screenshot is taken
- THEN the screenshot MUST match the Figma design reference
- AND spacing MUST be exact (47px, 17px, 21px, 30px gaps)
- AND colors MUST match (#01030e, #060813, #0265dc, etc.)

**Acceptance Criteria:**
- Test takes screenshot of auth landing page
- Screenshot is compared to Figma export (manual verification for MVP)
- Spacing is measured and verified
- Colors are sampled and verified
- Visual differences are documented

---

### Requirement: Auth Landing Page Component Tests

The platform SHALL provide integration tests for RoleCard and AuthButton components.

#### Scenario: RoleCard component renders correctly

- GIVEN a RoleCard component is rendered in a test
- WHEN the component is in default state
- THEN the component MUST render with correct styling
- AND the component MUST display the correct icon and text

**Acceptance Criteria:**
- Test file exists at `__tests__/integration/role-card.test.ts`
- Test renders RoleCard with `role="SPECIALIST"`
- Test verifies icon and text are present
- Test verifies default styling (no border)
- Test renders RoleCard with `role="CLIENT"`
- Test verifies correct icon and text for Client

#### Scenario: RoleCard component handles selection

- GIVEN a RoleCard component is rendered
- WHEN the `selected` prop changes from false to true
- THEN the component MUST display selected styling (blue border)

**Acceptance Criteria:**
- Test renders RoleCard with `selected={false}`
- Test verifies no blue border
- Test re-renders with `selected={true}`
- Test verifies blue border is present

#### Scenario: RoleCard component handles clicks

- GIVEN a RoleCard component with onClick handler
- WHEN the user clicks the card
- THEN the onClick handler MUST be called

**Acceptance Criteria:**
- Test renders RoleCard with mock onClick handler
- Test simulates click event
- Test verifies onClick was called once

#### Scenario: AuthButton component renders correctly

- GIVEN an AuthButton component is rendered
- WHEN the component is in primary variant
- THEN the component MUST render with primary styling

**Acceptance Criteria:**
- Test file exists at `__tests__/integration/auth-button.test.ts`
- Test renders AuthButton with `variant="primary"`
- Test verifies background color is #0088ff
- Test verifies text color is white

#### Scenario: AuthButton component handles disabled state

- GIVEN an AuthButton component with `disabled={true}`
- WHEN the component is rendered
- THEN the component MUST show disabled styling
- AND the onClick handler MUST NOT be called on click

**Acceptance Criteria:**
- Test renders AuthButton with `disabled={true}`
- Test verifies reduced opacity
- Test simulates click event
- Test verifies onClick was NOT called
