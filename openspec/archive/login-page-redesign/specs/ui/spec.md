# UI Specification Delta: Login Page Redesign

## ADDED Requirements

### Requirement: Login Page Figma Design Integration
The login page MUST fetch and implement exact design specifications from Figma using the Figma MCP tool.

#### Scenario: Fetch Figma design context for login variant
- GIVEN the Figma file URL `https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385`
- WHEN the developer uses the Figma MCP tool to fetch design context
- THEN the tool MUST return:
  - Screenshot of the login variant design
  - Exact dimensions, spacing, and layout specifications
  - Color values for backgrounds, borders, and text
  - Typography specifications (font family, size, weight)
  - Asset URLs for decorative elements (background pattern)

**Acceptance Criteria:**
- Use `mcp__figma__get_design_context` tool with fileKey and nodeId extracted from URL
- Document retrieved specifications in implementation notes
- Reference Figma screenshot during visual QA

---

### Requirement: AuthContainer Component Styling
The login page MUST use an AuthContainer with exact dimensions and styling matching the Figma design.

#### Scenario: AuthContainer renders with exact dimensions
- GIVEN a user visits `/login`
- WHEN the page renders
- THEN the auth container MUST have:
  - Width: 418px
  - Height: 540px (or min-height for content flexibility)
  - Border-radius: 25px
  - Padding: 40px
  - Background color from design tokens or Figma spec
  - Centered on viewport

**Acceptance Criteria:**
- Container dimensions match Figma spec exactly
- Container is vertically and horizontally centered
- Responsive behavior: width adapts to 90vw on mobile (< 480px), max-width 418px
- Container background uses design token or exact color from Figma

---

### Requirement: LogoHeader Component
The login page MUST display a LogoHeader component with bilingual heading.

#### Scenario: LogoHeader displays logo and bilingual heading
- GIVEN a user visits `/login`
- WHEN the page renders
- THEN the LogoHeader MUST display:
  - Gigly logo at top
  - Heading text: 'Вход' (Russian) or 'Login' (English)
  - Font: 22px Manrope SemiBold (or fallback to system sans-serif)
  - Proper spacing between logo and heading (per Figma spec)

**Acceptance Criteria:**
- Logo component reused from existing `lib/assets`
- Heading uses 22px font size, SemiBold weight
- Manrope font loaded or fallback applied gracefully
- Heading text supports both Russian and English (hardcoded for MVP, i18n later)

---

### Requirement: Role Card Display with Query Parameter
The login page MUST read the `?role=` query parameter and display role cards with visual selection state.

#### Scenario: Login with SPECIALIST role parameter shows selected specialist card
- GIVEN a user navigates to `/login?role=SPECIALIST`
- WHEN the page renders
- THEN the specialist role card MUST be displayed with:
  - 2px blue border (#0088FF or design token)
  - Visual indication of selection (e.g., background highlight)
- AND the client role card MUST be displayed without border

#### Scenario: Login with CLIENT role parameter shows selected client card
- GIVEN a user navigates to `/login?role=CLIENT`
- WHEN the page renders
- THEN the client role card MUST be displayed with:
  - 2px blue border (#0088FF or design token)
  - Visual indication of selection
- AND the specialist role card MUST be displayed without border

#### Scenario: Login without role parameter shows graceful fallback
- GIVEN a user navigates to `/login` (no role parameter)
- WHEN the page renders
- THEN the page MUST handle gracefully by either:
  - Showing both role cards unselected (no borders), OR
  - Hiding role cards entirely
- AND the login form MUST remain functional

**Acceptance Criteria:**
- `useSearchParams()` hook reads `role` query parameter
- RoleCard component (or inline styling) displays specialist and client roles
- Selected role has 2px blue border, unselected has no border
- Role cards are non-interactive (display-only, not clickable)
- Graceful handling when role parameter is missing or invalid

---

### Requirement: Input Field Exact Styling
Email and password input fields MUST use exact styling from Figma design.

#### Scenario: Input fields render with exact Figma styling
- GIVEN a user views the login form
- WHEN the input fields render
- THEN each input MUST have:
  - Background color: #10121c
  - Border color: #242935
  - Border-radius: 20px
  - Padding: 20px
  - Text color: white or design token
  - Placeholder color: muted gray or design token

**Acceptance Criteria:**
- Email and password inputs use exact color values from Figma
- Border-radius is 20px (not default rounded-md)
- Padding is 20px (not default px-4 py-3)
- Focus state maintains design consistency (blue ring or per Figma)

---

### Requirement: AuthButton Primary Component
The login page MUST use an AuthButton component for form submission with exact styling.

#### Scenario: Submit button renders with exact Figma styling
- GIVEN a user views the login form
- WHEN the submit button renders
- THEN the button MUST have:
  - Height: 50px
  - Background color: #0088FF
  - Text: 'Войти' (Russian) or 'Login' (English)
  - Border-radius: per Figma spec
  - Full width of container
  - Hover state: slightly darker blue
  - Disabled state: reduced opacity

**Acceptance Criteria:**
- Button height is exactly 50px
- Background color is #0088FF
- Button text is bilingual (Russian/English)
- Hover and disabled states implemented
- Button remains accessible (keyboard focus, ARIA labels)

---

### Requirement: Secondary Register Link
The login page MUST display a secondary link to the registration page.

#### Scenario: Register link displays below login form
- GIVEN a user views the login page
- WHEN the page renders
- THEN a secondary link MUST be displayed with:
  - Text: 'Зарегестрироватся' (Russian) or 'Register' (English)
  - Link destination: `/register`
  - Styling: secondary/muted color (not primary blue)
  - Positioned below submit button

**Acceptance Criteria:**
- Link text is bilingual
- Link navigates to `/register`
- Styling distinguishes it from primary button (secondary color)
- Link is accessible (keyboard navigation, screen reader)

---

### Requirement: Decorative Background Pattern
The login page MUST display a decorative background pattern at the bottom of the auth container.

#### Scenario: Background pattern renders at bottom of container
- GIVEN a user views the login page
- WHEN the page renders
- THEN a decorative background pattern MUST be displayed:
  - Positioned at bottom of auth container
  - Pattern asset from Figma design
  - Does not interfere with form elements
  - Responsive: scales or hides on mobile if needed

**Acceptance Criteria:**
- Background pattern asset extracted from Figma
- Pattern positioned at bottom of container (absolute or background-image)
- Pattern does not obscure form elements
- Pattern is decorative only (no functional purpose)

---

### Requirement: Responsive Login Page Design
The login page MUST adapt to mobile and desktop viewports while maintaining design fidelity.

#### Scenario: Login page adapts to mobile viewport
- GIVEN a user views `/login` on a mobile device (375px width)
- WHEN the page renders
- THEN the auth container MUST:
  - Reduce width to 90vw (max 418px)
  - Maintain padding proportionally (reduce to 20px if needed)
  - Stack elements vertically
  - Remain fully functional and readable

#### Scenario: Login page displays correctly on desktop
- GIVEN a user views `/login` on a desktop (1440px width)
- WHEN the page renders
- THEN the auth container MUST:
  - Display at 418px width
  - Be centered horizontally and vertically
  - Maintain all spacing and styling from Figma

**Acceptance Criteria:**
- Responsive breakpoints defined (mobile < 480px, desktop >= 480px)
- Container width adapts using max-width and percentage
- Padding adjusts for mobile if needed
- All elements remain accessible and functional on all viewports
