# UI Specification Delta: auth-landing-page

## ADDED Requirements

### Requirement: Auth Landing Page Layout

The platform SHALL provide a dedicated authentication landing page at `/auth` that matches the Figma design with pixel-perfect accuracy.

#### Scenario: Auth landing page renders with correct layout

- GIVEN an unauthenticated user navigates to `/auth`
- WHEN the page loads
- THEN the page MUST display a full-screen dark background with color #01030e
- AND the page MUST display a centered card with dimensions 418px width × 540px height
- AND the card MUST have background color #060813 (bg-surface-level-1)
- AND the card MUST have border color #242935 (border-neutral-strong)
- AND the card MUST have border-radius 25px
- AND the card MUST have 40px padding on all sides

**Acceptance Criteria:**
- Page exists at `app/auth/page.tsx`
- Full-screen container uses `bg-[#01030e] min-h-screen flex items-center justify-center`
- Card uses exact dimensions and styling from Figma
- Visual comparison with Figma shows exact match

#### Scenario: Logo header displays at top of card

- GIVEN the auth landing page is rendered
- WHEN the user views the card
- THEN the LogoHeader component MUST be displayed at the top
- AND the logo MUST be centered horizontally
- AND the logo MUST have 47px gap below it (to content section)
- AND the logo MUST match the Gigly brand logo from Figma (node 4116:427)

**Acceptance Criteria:**
- LogoHeader component is imported and rendered
- Gap between logo and content is exactly 47px (use `gap-[47px]` or margin)
- Logo image is exported from Figma and optimized for web
- Logo is visible and properly sized

---

### Requirement: RoleCard Component

The platform SHALL provide a RoleCard component for displaying selectable user roles with visual feedback.

#### Scenario: RoleCard renders with default state

- GIVEN a RoleCard component is rendered
- WHEN the component is in default (unselected) state
- THEN the card MUST have background color #10121c (bg-surface-level-2)
- AND the card MUST have no border
- AND the card MUST have border-radius 20px
- AND the card MUST have 20px horizontal padding
- AND the card MUST have 20px vertical padding
- AND the card MUST display an icon on the left (32px × 32px)
- AND the card MUST display role text on the right (17px font size, white color)
- AND the card MUST have 24px gap between icon and text

**Acceptance Criteria:**
- Component file exists at `app/components/auth/RoleCard.tsx`
- Component accepts props: `role: 'SPECIALIST' | 'CLIENT'`, `selected: boolean`, `onClick: () => void`
- Default styling matches Figma node 4113:481
- Icon and text are properly aligned

#### Scenario: RoleCard renders with selected state

- GIVEN a RoleCard component is rendered
- WHEN the component is in selected state (`selected={true}`)
- THEN the card MUST have a 2px border with color #0265dc (border-brand-default)
- AND the card MUST maintain all other default styling
- AND the card MUST have visual distinction from unselected state

**Acceptance Criteria:**
- Selected state adds `border-2 border-[#0265dc]` classes
- Visual feedback is immediate on click
- Only one RoleCard can be selected at a time (managed by parent)

#### Scenario: RoleCard displays correct icon and text for Specialist

- GIVEN a RoleCard with `role="SPECIALIST"`
- WHEN the component renders
- THEN the card MUST display a user icon (from Figma node 4116:399)
- AND the card MUST display text "Профиль специалиста"

**Acceptance Criteria:**
- User icon is exported from Figma and used as image or SVG
- Text is in Russian
- Icon size is 32px × 32px

#### Scenario: RoleCard displays correct icon and text for Client

- GIVEN a RoleCard with `role="CLIENT"`
- WHEN the component renders
- THEN the card MUST display a briefcase icon (from Figma node 4113:535)
- AND the card MUST display text "Профиль Компании"

**Acceptance Criteria:**
- Briefcase icon is exported from Figma and used as image or SVG
- Text is in Russian
- Icon size is 32px × 32px

#### Scenario: RoleCard is keyboard accessible

- GIVEN a RoleCard component is rendered
- WHEN the user navigates with keyboard (Tab key)
- THEN the card MUST be focusable
- AND the card MUST show focus outline
- AND pressing Enter or Space MUST trigger onClick handler

**Acceptance Criteria:**
- Component uses `<button>` element or has `role="button"` and `tabIndex={0}`
- Focus styles are visible
- Keyboard interaction works correctly

---

### Requirement: AuthButton Component

The platform SHALL provide an AuthButton component for primary and secondary authentication actions.

#### Scenario: AuthButton renders with primary variant

- GIVEN an AuthButton with `variant="primary"`
- WHEN the component renders
- THEN the button MUST have background color #0088ff
- AND the button MUST have white text color
- AND the button MUST have height 50px
- AND the button MUST have border-radius 10px
- AND the button MUST have font size 16px
- AND the button MUST have font weight medium

**Acceptance Criteria:**
- Component file exists at `app/components/auth/AuthButton.tsx`
- Component accepts props: `variant: 'primary' | 'secondary'`, `children: ReactNode`, `onClick: () => void`, `disabled?: boolean`
- Primary styling matches Figma node 4103:551
- Button is full-width within container

#### Scenario: AuthButton renders with secondary variant

- GIVEN an AuthButton with `variant="secondary"`
- WHEN the component renders
- THEN the button MUST have background color rgba(0, 136, 255, 0.24)
- AND the button MUST have text color #1379f3 (text-brand-default)
- AND the button MUST have height 50px
- AND the button MUST have border-radius 10px
- AND the button MUST have font size 15px
- AND the button MUST have font weight medium

**Acceptance Criteria:**
- Secondary styling matches Figma node 4103:553
- Text color is distinct from primary
- Button is full-width within container

#### Scenario: AuthButton shows disabled state

- GIVEN an AuthButton with `disabled={true}`
- WHEN the component renders
- THEN the button MUST have reduced opacity (0.5)
- AND the button MUST not respond to clicks
- AND the button MUST have cursor-not-allowed

**Acceptance Criteria:**
- Disabled state is visually distinct
- onClick handler does not fire when disabled
- Cursor changes to not-allowed

---

### Requirement: Auth Landing Page Role Selection

The platform SHALL manage role selection state and enable/disable buttons based on selection.

#### Scenario: Page initializes with no role selected

- GIVEN the auth landing page loads
- WHEN the page renders
- THEN no RoleCard MUST be selected
- AND both AuthButtons MUST be disabled
- AND the user MUST see visual indication that selection is required

**Acceptance Criteria:**
- Initial state: `selectedRole = null`
- Both buttons have `disabled={!selectedRole}`
- User cannot proceed without selecting a role

#### Scenario: User selects Specialist role

- GIVEN the auth landing page is rendered
- WHEN the user clicks the Specialist RoleCard
- THEN the Specialist RoleCard MUST show selected state (blue border)
- AND the Client RoleCard MUST show unselected state (no border)
- AND both AuthButtons MUST become enabled

**Acceptance Criteria:**
- State updates to `selectedRole = 'SPECIALIST'`
- Visual feedback is immediate
- Buttons are enabled

#### Scenario: User selects Client role

- GIVEN the auth landing page is rendered
- WHEN the user clicks the Client RoleCard
- THEN the Client RoleCard MUST show selected state (blue border)
- AND the Specialist RoleCard MUST show unselected state (no border)
- AND both AuthButtons MUST become enabled

**Acceptance Criteria:**
- State updates to `selectedRole = 'CLIENT'`
- Visual feedback is immediate
- Buttons are enabled

#### Scenario: User changes role selection

- GIVEN the user has selected Specialist role
- WHEN the user clicks the Client RoleCard
- THEN the Client RoleCard MUST become selected
- AND the Specialist RoleCard MUST become unselected
- AND both AuthButtons MUST remain enabled

**Acceptance Criteria:**
- Only one role can be selected at a time
- Selection can be changed freely
- Buttons remain enabled after change

---

### Requirement: Auth Landing Page Navigation

The platform SHALL navigate to login or register pages with role query parameter based on user selection.

#### Scenario: User clicks Login button with Specialist role selected

- GIVEN the user has selected Specialist role
- WHEN the user clicks the "Войти" (Login) button
- THEN the browser MUST navigate to `/login?role=SPECIALIST`

**Acceptance Criteria:**
- Navigation uses Next.js `useRouter().push()`
- URL includes correct query parameter
- Role is uppercase (SPECIALIST, not specialist)

#### Scenario: User clicks Login button with Client role selected

- GIVEN the user has selected Client role
- WHEN the user clicks the "Войти" (Login) button
- THEN the browser MUST navigate to `/login?role=CLIENT`

**Acceptance Criteria:**
- Navigation uses Next.js `useRouter().push()`
- URL includes correct query parameter
- Role is uppercase (CLIENT, not client)

#### Scenario: User clicks Register button with Specialist role selected

- GIVEN the user has selected Specialist role
- WHEN the user clicks the "Зарегестрироватся" (Register) button
- THEN the browser MUST navigate to `/register?role=SPECIALIST`

**Acceptance Criteria:**
- Navigation uses Next.js `useRouter().push()`
- URL includes correct query parameter
- Role is uppercase

#### Scenario: User clicks Register button with Client role selected

- GIVEN the user has selected Client role
- WHEN the user clicks the "Зарегестрироватся" (Register) button
- THEN the browser MUST navigate to `/register?role=CLIENT`

**Acceptance Criteria:**
- Navigation uses Next.js `useRouter().push()`
- URL includes correct query parameter
- Role is uppercase

---

### Requirement: Auth Landing Page Spacing

The platform SHALL implement exact spacing from Figma design for visual consistency.

#### Scenario: Role cards section has correct spacing

- GIVEN the auth landing page is rendered
- WHEN the user views the role cards section
- THEN the two RoleCard components MUST have 17px gap between them
- AND the role cards section MUST have 30px gap below it (to buttons section)

**Acceptance Criteria:**
- Role cards container uses `flex flex-col gap-[17px]`
- Gap between sections is exactly 30px
- Visual measurement matches Figma

#### Scenario: Buttons section has correct spacing

- GIVEN the auth landing page is rendered
- WHEN the user views the buttons section
- THEN the two AuthButton components MUST have 21px gap between them

**Acceptance Criteria:**
- Buttons container uses `flex flex-col gap-[21px]`
- Visual measurement matches Figma

#### Scenario: Logo to content spacing is correct

- GIVEN the auth landing page is rendered
- WHEN the user views the card
- THEN the gap between LogoHeader and content section MUST be exactly 47px

**Acceptance Criteria:**
- Container uses `flex flex-col gap-[47px]` or equivalent margin
- Visual measurement matches Figma

---

### Requirement: Auth Landing Page Responsive Design

The platform SHALL adapt the auth landing page layout for mobile devices.

#### Scenario: Desktop layout (≥768px)

- GIVEN the viewport width is 768px or greater
- WHEN the auth landing page renders
- THEN the card MUST have fixed width 418px
- AND the card MUST be centered horizontally
- AND all spacing MUST match desktop Figma design

**Acceptance Criteria:**
- Card uses `w-[418px]` on desktop
- Card is centered with flexbox
- Layout matches Figma exactly

#### Scenario: Mobile layout (<768px)

- GIVEN the viewport width is less than 768px
- WHEN the auth landing page renders
- THEN the card MUST have width 90vw (90% of viewport width)
- AND the card MUST maintain vertical spacing
- AND the card MUST remain centered horizontally
- AND all content MUST remain readable and accessible

**Acceptance Criteria:**
- Card uses `w-[90vw] md:w-[418px]` responsive classes
- Content does not overflow or clip
- Touch targets remain accessible (min 44px)
- Tested on mobile viewport (375px width)

---

### Requirement: Decorative Background Pattern

The platform SHALL display a decorative background pattern at the bottom of the auth landing page.

#### Scenario: Background pattern renders

- GIVEN the auth landing page is rendered
- WHEN the user views the page
- THEN a decorative pattern MUST be visible at the bottom of the screen
- AND the pattern MUST match Figma node 4111:399
- AND the pattern MUST not interfere with card readability

**Acceptance Criteria:**
- Pattern image is exported from Figma using MCP tool
- Pattern is positioned at bottom of viewport
- Pattern uses `position: absolute` or `position: fixed`
- Pattern has lower z-index than card
- Pattern is optimized for web (< 100KB)
