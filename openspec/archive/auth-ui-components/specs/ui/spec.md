# UI Spec Delta: Auth UI Components

## ADDED Requirements

### Requirement: RoleCard Component
The RoleCard component MUST provide a selectable card UI for role selection (CLIENT/SPECIALIST) matching Figma design specifications (nodes 4113:481, 4116:396).

#### Scenario: RoleCard renders with correct dimensions and spacing
- GIVEN a RoleCard component is rendered
- WHEN the component displays
- THEN the card MUST have 20px padding on all sides
- AND the icon MUST be 32px × 32px
- AND the text MUST be 17px font size
- AND the gap between icon and text MUST be 24px
- AND the border-radius MUST be 20px

#### Scenario: RoleCard uses design tokens for styling
- GIVEN a RoleCard component is rendered
- WHEN the component displays
- THEN the background color MUST use a design token (not hardcoded)
- AND the border color MUST use a design token
- AND the text color MUST use a design token
- AND NO hardcoded color values (e.g., #060813) SHALL be present in the component code

#### Scenario: RoleCard shows hover state
- GIVEN a RoleCard component is rendered
- WHEN the user hovers over the card
- THEN the card MUST display a visual hover state
- AND the hover state MUST be distinguishable from the default state
- AND the transition MUST be smooth (CSS transition applied)

#### Scenario: RoleCard shows selected state with blue border
- GIVEN a RoleCard component is rendered with selected={true}
- WHEN the component displays
- THEN the card MUST display a 2px border with color #0265dc
- AND the selected state MUST be visually distinct from default and hover states

#### Scenario: RoleCard is keyboard accessible
- GIVEN a RoleCard component is rendered
- WHEN the user navigates using keyboard (Tab key)
- THEN the card MUST be focusable
- AND the card MUST display a visible focus indicator
- AND the user MUST be able to select the card using Enter or Space key

#### Scenario: RoleCard has proper ARIA attributes
- GIVEN a RoleCard component is rendered
- WHEN the component displays
- THEN the card MUST have role="button" or be a <button> element
- AND the card MUST have aria-pressed attribute reflecting selected state
- AND the card MUST have an accessible label describing the role

---

### Requirement: AuthContainer Component
The AuthContainer component MUST provide a centered container for auth forms matching Figma design specifications.

#### Scenario: AuthContainer renders with correct dimensions
- GIVEN an AuthContainer component is rendered
- WHEN the component displays
- THEN the container MUST have 418px width
- AND the container MUST have 540px height
- AND the border-radius MUST be 25px

#### Scenario: AuthContainer uses design tokens for colors
- GIVEN an AuthContainer component is rendered
- WHEN the component displays
- THEN the background color MUST use a design token matching #060813
- AND the border color MUST use a design token matching #242935
- AND NO hardcoded color values SHALL be present in the component code

#### Scenario: AuthContainer centers content
- GIVEN an AuthContainer component is rendered with child elements
- WHEN the component displays
- THEN the container MUST be horizontally centered on the page
- AND the container MUST be vertically centered on the page
- AND child elements MUST be laid out according to the container's flex/grid properties

---

### Requirement: LogoHeader Component
The LogoHeader component MUST provide a semi-transparent header with logo matching Figma design specifications (node 4106:615).

#### Scenario: LogoHeader renders with correct styling
- GIVEN a LogoHeader component is rendered
- WHEN the component displays
- THEN the background color MUST be rgba(49,54,67,0.5) or equivalent design token
- AND the border-radius MUST be 10px
- AND the padding MUST be 7px vertical and 9px horizontal

#### Scenario: LogoHeader displays logo image
- GIVEN a LogoHeader component is rendered with a logo prop
- WHEN the component displays
- THEN the logo image MUST be displayed
- AND the logo MUST have appropriate alt text for accessibility

---

### Requirement: AuthButton Component
The AuthButton component MUST provide primary and secondary button variants matching Figma design specifications.

#### Scenario: AuthButton primary variant renders correctly
- GIVEN an AuthButton component is rendered with variant="primary"
- WHEN the component displays
- THEN the button MUST have 50px height
- AND the background color MUST be #0088FF or equivalent design token
- AND the border-radius MUST be 10px

#### Scenario: AuthButton secondary variant renders correctly
- GIVEN an AuthButton component is rendered with variant="secondary"
- WHEN the component displays
- THEN the button MUST have 50px height
- AND the background color MUST be rgba(0,136,255,0.24) or equivalent design token
- AND the border-radius MUST be 10px

#### Scenario: AuthButton is keyboard accessible
- GIVEN an AuthButton component is rendered
- WHEN the user navigates using keyboard (Tab key)
- THEN the button MUST be focusable
- AND the button MUST display a visible focus indicator
- AND the user MUST be able to activate the button using Enter or Space key

#### Scenario: AuthButton has proper ARIA attributes
- GIVEN an AuthButton component is rendered
- WHEN the component displays
- THEN the button MUST be a <button> element or have role="button"
- AND the button MUST have an accessible label (via children or aria-label)
- AND if the button is disabled, it MUST have aria-disabled="true"

---

### Requirement: Auth Components Storybook Stories
All auth components MUST have Storybook stories demonstrating all states for visual testing and documentation.

#### Scenario: RoleCard has Storybook stories for all states
- GIVEN Storybook is running
- WHEN the developer navigates to RoleCard stories
- THEN there MUST be a story for the default state
- AND there MUST be a story for the hover state
- AND there MUST be a story for the selected state
- AND there MUST be a story for the disabled state (if applicable)

#### Scenario: AuthButton has Storybook stories for all variants
- GIVEN Storybook is running
- WHEN the developer navigates to AuthButton stories
- THEN there MUST be a story for the primary variant
- AND there MUST be a story for the secondary variant
- AND there MUST be a story for the disabled state
- AND there MUST be a story for the loading state (if applicable)

#### Scenario: AuthContainer has Storybook story
- GIVEN Storybook is running
- WHEN the developer navigates to AuthContainer stories
- THEN there MUST be at least one story showing the container with sample content

#### Scenario: LogoHeader has Storybook story
- GIVEN Storybook is running
- WHEN the developer navigates to LogoHeader stories
- THEN there MUST be at least one story showing the header with logo

---

### Requirement: Auth Components Accessibility Compliance
All auth components MUST pass accessibility audits for keyboard navigation, ARIA labels, and focus states.

#### Scenario: Components pass axe-core accessibility audit
- GIVEN all auth components are rendered in Storybook
- WHEN an axe-core accessibility audit is run
- THEN there MUST be zero critical or serious accessibility violations
- AND all interactive elements MUST be keyboard accessible
- AND all interactive elements MUST have proper ARIA attributes

#### Scenario: Components support keyboard navigation
- GIVEN any interactive auth component is rendered
- WHEN the user navigates using only keyboard (Tab, Enter, Space, Arrow keys)
- THEN the user MUST be able to reach all interactive elements
- AND the user MUST be able to activate all interactive elements
- AND the current focus MUST be visually indicated at all times

---

### Requirement: Figma Design Fidelity
Auth components MUST match Figma design specifications pixel-perfect, verified through visual comparison.

#### Scenario: Component measurements match Figma specs
- GIVEN a component is rendered in the browser
- WHEN the developer inspects the component using browser DevTools
- THEN all dimensions (width, height, padding, margin, gap) MUST match Figma specs within 1px tolerance
- AND all border-radius values MUST match Figma specs exactly
- AND all font sizes MUST match Figma specs exactly

#### Scenario: Component colors match Figma specs
- GIVEN a component is rendered in the browser
- WHEN the developer inspects the component using browser DevTools
- THEN all color values MUST match Figma specs exactly (or use equivalent design tokens)
- AND all opacity/transparency values MUST match Figma specs exactly

#### Scenario: Figma MCP tool is used to fetch specs
- GIVEN the implementation process begins
- WHEN the developer needs component specifications
- THEN the Figma MCP tool MUST be used to fetch exact measurements and colors from nodes
- AND manual measurement or guessing SHALL NOT be used
- AND the fetched specs MUST be documented in implementation notes
