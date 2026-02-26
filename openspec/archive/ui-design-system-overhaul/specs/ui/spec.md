# UI Specification - Design System Overhaul

## ADDED Requirements

### Requirement: Design System Foundation
The application MUST implement a cohesive design system with consistent colors, typography, spacing, and component styling across all pages.

#### Scenario: Tailwind configuration includes custom design tokens
- GIVEN the Tailwind configuration file exists at `tailwind.config.ts`
- WHEN the configuration is loaded
- THEN it MUST include a custom color palette with:
  - Navy background colors (e.g., `navy-900: #0A0E27`, `navy-800`, `navy-700`)
  - Bright blue accent colors (e.g., `blue-500: #0EA5E9`, `blue-600`, `blue-400`)
  - Refined gray scale for borders and text (e.g., `gray-700`, `gray-600`, `gray-500`, `gray-400`, `gray-300`)
  - Status colors (success green, warning amber, error red)
- AND it MUST include custom typography scale with font sizes, weights, and line heights
- AND it MUST include custom spacing values if needed beyond Tailwind defaults
- AND it MUST include custom border radius values for consistent rounded corners
- AND it MUST include custom shadow values for elevation system

#### Scenario: Design system documentation exists
- GIVEN the project documentation directory exists
- WHEN a developer needs to reference design tokens
- THEN a file MUST exist at `docs/DESIGN_SYSTEM.md`
- AND it MUST document the color palette with hex codes and usage guidelines
- AND it MUST document the typography scale with examples
- AND it MUST document spacing conventions
- AND it MUST document component patterns (button variants, card styles, etc.)
- AND it MUST include code examples for common patterns

**Acceptance Criteria:**
- `tailwind.config.ts` includes custom `colors` object with navy, blue, gray scales
- Custom typography tokens defined in `theme.extend`
- `docs/DESIGN_SYSTEM.md` exists with complete design token reference
- Build succeeds without errors: `npm run build`
- Custom classes available in browser dev tools

---

### Requirement: Global Page Styling
All pages MUST use the navy background color and consistent layout structure.

#### Scenario: Root layout applies navy background
- GIVEN a user visits any page in the application
- WHEN the page renders
- THEN the page background MUST use navy color (e.g., `bg-navy-900`)
- AND the text color MUST provide sufficient contrast for readability (WCAG AA minimum)
- AND the layout MUST use consistent max-width containers
- AND the layout MUST use consistent padding/margins

#### Scenario: Protected pages layout maintains styling
- GIVEN an authenticated user visits any protected page
- WHEN the page renders
- THEN the page MUST inherit the navy background from root layout
- AND the navigation MUST be visible at the top
- AND the main content area MUST have proper spacing from navigation

#### Scenario: Admin pages layout maintains styling
- GIVEN an admin user visits any admin page
- WHEN the page renders
- THEN the page MUST use the same navy background
- AND the admin navigation MUST be styled consistently
- AND the layout MUST match the design system

**Acceptance Criteria:**
- `app/layout.tsx` applies `bg-navy-900` or equivalent to body
- `app/(protected)/layout.tsx` maintains consistent styling
- `app/admin/layout.tsx` maintains consistent styling
- All pages have proper contrast ratios (WCAG AA)
- Responsive on all screen sizes (320px to 1920px)

---

### Requirement: Button Component Styling
All buttons MUST use consistent styling from the design system with proper variants and states.

#### Scenario: Primary buttons use bright blue styling
- GIVEN a primary action button exists on any page
- WHEN the button renders
- THEN it MUST have bright blue background (e.g., `bg-blue-500`)
- AND it MUST have white text color
- AND it MUST have proper padding (e.g., `px-4 py-2`)
- AND it MUST have rounded corners (e.g., `rounded-md`)
- AND it MUST have medium font weight (e.g., `font-medium`)

#### Scenario: Primary buttons have hover state
- GIVEN a primary button is rendered
- WHEN a user hovers over the button
- THEN the background color MUST darken (e.g., `hover:bg-blue-600`)
- AND the cursor MUST change to pointer
- AND the transition MUST be smooth (e.g., `transition-colors duration-200`)

#### Scenario: Primary buttons have focus state
- GIVEN a primary button is rendered
- WHEN a user focuses the button via keyboard (Tab key)
- THEN a visible focus ring MUST appear (e.g., `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`)
- AND the focus ring MUST be visible against the navy background
- AND the focus ring MUST meet WCAG visibility requirements

#### Scenario: Secondary buttons use outlined styling
- GIVEN a secondary action button exists on any page
- WHEN the button renders
- THEN it MUST have transparent background
- AND it MUST have blue border (e.g., `border border-blue-500`)
- AND it MUST have blue text color (e.g., `text-blue-500`)
- AND it MUST have proper padding and rounded corners

#### Scenario: Secondary buttons have hover state
- GIVEN a secondary button is rendered
- WHEN a user hovers over the button
- THEN the background MUST show subtle blue tint (e.g., `hover:bg-blue-500/10`)
- AND the border color MUST remain visible

#### Scenario: Danger buttons use red styling
- GIVEN a destructive action button exists (e.g., Reject, Withdraw, Suspend)
- WHEN the button renders
- THEN it MUST have red background (e.g., `bg-red-600`)
- AND it MUST have white text color
- AND it MUST have proper padding and rounded corners

#### Scenario: Disabled buttons have reduced opacity
- GIVEN any button is in disabled state
- WHEN the button renders
- THEN it MUST have reduced opacity (e.g., `disabled:opacity-50`)
- AND it MUST NOT show hover effects
- AND the cursor MUST be `not-allowed`

**Acceptance Criteria:**
- All buttons across all pages use consistent styling
- Primary buttons: `bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md`
- Secondary buttons: `border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-4 py-2 rounded-md`
- Danger buttons: `bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md`
- All buttons have focus rings: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
- Disabled state: `disabled:opacity-50 disabled:cursor-not-allowed`
- All 570+ tests pass after button styling updates

---

### Requirement: Form Input Styling
All form inputs MUST use consistent styling from the design system with proper states.

#### Scenario: Text inputs use navy background with borders
- GIVEN a text input field exists on any form
- WHEN the input renders
- THEN it MUST have navy/dark background (e.g., `bg-navy-800`)
- AND it MUST have subtle border (e.g., `border border-gray-600`)
- AND it MUST have white text color
- AND it MUST have proper padding (e.g., `px-3 py-2`)
- AND it MUST have rounded corners (e.g., `rounded-md`)

#### Scenario: Text inputs have focus state
- GIVEN a text input is rendered
- WHEN a user focuses the input
- THEN the border color MUST change to bright blue (e.g., `focus:border-blue-500`)
- AND a blue focus ring MUST appear (e.g., `focus:ring-1 focus:ring-blue-500`)
- AND the transition MUST be smooth

#### Scenario: Text inputs show error state
- GIVEN a text input has validation error
- WHEN the input renders with error
- THEN the border color MUST be red (e.g., `border-red-500`)
- AND the focus ring MUST be red (e.g., `focus:ring-red-500`)
- AND error message text MUST be red and visible

#### Scenario: Placeholder text is readable
- GIVEN a text input has placeholder text
- WHEN the input renders
- THEN the placeholder MUST have sufficient contrast (e.g., `placeholder:text-gray-400`)
- AND the placeholder MUST be readable against the navy background

#### Scenario: Textareas use same styling as text inputs
- GIVEN a textarea field exists on any form
- WHEN the textarea renders
- THEN it MUST use the same styling as text inputs
- AND it MUST have appropriate height (e.g., `rows` attribute)

#### Scenario: Select dropdowns use consistent styling
- GIVEN a select dropdown exists on any form
- WHEN the select renders
- THEN it MUST use the same styling as text inputs
- AND the dropdown arrow MUST be visible

**Acceptance Criteria:**
- All text inputs: `bg-navy-800 border border-gray-600 text-white px-3 py-2 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500`
- Error state: `border-red-500 focus:border-red-500 focus:ring-red-500`
- Placeholder: `placeholder:text-gray-400`
- All textareas use same classes
- All selects use same classes
- All form tests pass after input styling updates

---

### Requirement: Card Component Styling
All card containers MUST use consistent styling with subtle elevation and proper spacing.

#### Scenario: Cards have refined background and borders
- GIVEN a card container exists on any page
- WHEN the card renders
- THEN it MUST have slightly lighter background than page (e.g., `bg-navy-800`)
- AND it MUST have subtle border (e.g., `border border-gray-700`)
- AND it MUST have rounded corners (e.g., `rounded-lg`)
- AND it MUST have proper padding (e.g., `p-6`)

#### Scenario: Cards have subtle shadow for elevation
- GIVEN a card container is rendered
- WHEN the card is displayed
- THEN it MUST have subtle shadow (e.g., `shadow-md`)
- AND the shadow MUST be visible against the navy background
- AND the shadow MUST not be too prominent

#### Scenario: Clickable cards have hover state
- GIVEN a card is clickable (e.g., gig list item, application card)
- WHEN a user hovers over the card
- THEN the background MUST lighten slightly (e.g., `hover:bg-navy-700`)
- AND the border color MAY brighten (e.g., `hover:border-gray-600`)
- AND the cursor MUST change to pointer
- AND the transition MUST be smooth (e.g., `transition-colors duration-200`)

#### Scenario: Non-clickable cards do not have hover state
- GIVEN a card is not clickable (e.g., gig detail sections)
- WHEN a user hovers over the card
- THEN the card MUST NOT change appearance
- AND the cursor MUST remain default

**Acceptance Criteria:**
- All cards: `bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md`
- Clickable cards: `hover:bg-navy-700 hover:border-gray-600 cursor-pointer transition-colors duration-200`
- Non-clickable cards: no hover classes
- Consistent spacing between cards (e.g., `space-y-4` or `gap-4`)
- All tests pass after card styling updates

---

### Requirement: Badge Component Styling
All status badges MUST use consistent styling with intuitive color coding.

#### Scenario: Status badges have proper color coding
- GIVEN a status badge exists on any page
- WHEN the badge renders
- THEN it MUST use color coding based on status:
  - OPEN: blue background (e.g., `bg-blue-500/20 text-blue-400 border-blue-500/30`)
  - IN_PROGRESS: amber background (e.g., `bg-amber-500/20 text-amber-400 border-amber-500/30`)
  - REVIEW: purple background (e.g., `bg-purple-500/20 text-purple-400 border-purple-500/30`)
  - COMPLETED: green background (e.g., `bg-green-500/20 text-green-400 border-green-500/30`)
  - PAID: green with checkmark icon
  - PENDING: gray background (e.g., `bg-gray-500/20 text-gray-400 border-gray-500/30`)
  - ACCEPTED: green background
  - REJECTED: red background (e.g., `bg-red-500/20 text-red-400 border-red-500/30`)
  - WITHDRAWN: gray background

#### Scenario: Badges have consistent size and padding
- GIVEN any status badge is rendered
- WHEN the badge displays
- THEN it MUST have consistent padding (e.g., `px-2 py-1`)
- AND it MUST have consistent font size (e.g., `text-xs`)
- AND it MUST have consistent font weight (e.g., `font-medium`)
- AND it MUST have rounded corners (e.g., `rounded-md`)
- AND it MUST have subtle border (e.g., `border`)

#### Scenario: Badge colors are accessible
- GIVEN any status badge is rendered
- WHEN the badge displays
- THEN the text color MUST have sufficient contrast against the background (WCAG AA)
- AND the badge MUST be readable against the page background

**Acceptance Criteria:**
- All badges use consistent base classes: `px-2 py-1 text-xs font-medium rounded-md border`
- Status-specific colors defined and applied consistently
- Color contrast meets WCAG AA standards
- All tests pass after badge styling updates

---

### Requirement: Gig Detail Page 2-Column Layout
The gig detail page MUST use a 2-column grid layout with main content on the left and a sticky sidebar on the right.

#### Scenario: Desktop layout uses 2-column grid
- GIVEN a user views a gig detail page on desktop (≥1024px width)
- WHEN the page renders
- THEN the page MUST use a grid layout with `grid grid-cols-1 lg:grid-cols-3 gap-6`
- AND the main content area MUST span 2 columns (`lg:col-span-2`)
- AND the sidebar MUST span 1 column (`lg:col-span-1`)

#### Scenario: Main content column contains gig details
- GIVEN a user views a gig detail page
- WHEN the main content area renders
- THEN it MUST contain (in order):
  - Gig title and description
  - "Суть задачи" (Goal) section
  - "Технические требования" (Technical Requirements) section
  - "Формат и сроки" (Format and Timeline) section
  - Application list (for CLIENT owners)
  - Message list (when specialist assigned)

#### Scenario: Sidebar contains budget and actions
- GIVEN a user views a gig detail page
- WHEN the sidebar renders
- THEN it MUST contain:
  - Budget card with prominent price display
  - Client info section with company name
  - Apply button/form (for SPECIALISTS viewing OPEN gigs)
  - Action buttons (Submit Work, Approve Work, Mark as Paid) based on gig status and user role

#### Scenario: Sidebar is sticky on desktop
- GIVEN a user views a gig detail page on desktop
- WHEN the user scrolls down the page
- THEN the sidebar MUST remain visible using `sticky top-6`
- AND the sidebar MUST scroll with the page when it reaches the bottom

#### Scenario: Mobile layout stacks vertically
- GIVEN a user views a gig detail page on mobile (<1024px width)
- WHEN the page renders
- THEN the grid MUST collapse to single column
- AND the sidebar MUST appear below the main content
- AND the sidebar MUST NOT be sticky on mobile

**Acceptance Criteria:**
- Gig detail page uses `grid grid-cols-1 lg:grid-cols-3 gap-6`
- Main content: `lg:col-span-2`
- Sidebar: `lg:col-span-1 sticky top-6`
- All existing functionality preserved (apply, message, submit work, etc.)
- All gig tests pass (44 integration + 16 E2E)
- Responsive on mobile (sidebar stacks below content)

---

### Requirement: Profile Page Layout Structure
The profile page MUST use a header card with avatar and stats, followed by a 2-column grid for experience and projects.

#### Scenario: Header card uses horizontal flex layout
- GIVEN a user views a profile page
- WHEN the header card renders
- THEN it MUST use `flex items-start gap-6` layout
- AND the left side MUST contain avatar (large circular image, `w-24 h-24 rounded-full`)
- AND the right side MUST contain name, title, and stats in a `flex-1` container

#### Scenario: Stats row displays horizontally
- GIVEN a user views a profile page
- WHEN the stats section renders
- THEN it MUST use `flex gap-8` layout
- AND each stat MUST display as `flex flex-col` with label and value
- AND stats MUST include: rating (5.0 ⭐), completed tasks count, repeat order percentage

#### Scenario: Experience and Projects use 2-column grid
- GIVEN a user views a profile page
- WHEN the content below header renders
- THEN it MUST use `grid grid-cols-1 lg:grid-cols-2 gap-6`
- AND the left column MUST contain "Опыт работы" (Experience) section
- AND the right column MUST contain "Избранные проекты" (Featured Projects) section

#### Scenario: Mobile layout stacks vertically
- GIVEN a user views a profile page on mobile (<1024px width)
- WHEN the page renders
- THEN the 2-column grid MUST collapse to single column
- AND Experience section MUST appear above Projects section

**Acceptance Criteria:**
- Header card: `flex items-start gap-6 bg-navy-800 border border-gray-700 rounded-lg p-6`
- Avatar: `w-24 h-24 rounded-full`
- Stats row: `flex gap-8 mt-4`
- Content grid: `grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6`
- All existing functionality preserved
- All profile tests pass
- Responsive on mobile

---

### Requirement: Browse Gigs Page Layout Structure
The browse gigs page MUST use horizontal layouts for filters/search and for individual gig cards.

#### Scenario: Filter and search bar use horizontal layout
- GIVEN a user views the browse gigs page
- WHEN the filter section renders
- THEN it MUST use `flex items-center justify-between mb-6` layout
- AND filter tabs MUST use `flex gap-2` with active tab having blue underline
- AND search bar MUST be positioned on the right side of the flex container

#### Scenario: Gig cards use horizontal layout
- GIVEN a user views the browse gigs page
- WHEN a gig card renders
- THEN it MUST use `flex justify-between items-start` layout
- AND the left side MUST contain title, description, tags (stacked vertically)
- AND the right side MUST contain price and action button using `flex flex-col items-end gap-2`

#### Scenario: Company logo appears on left of card
- GIVEN a gig card has company logo/avatar available
- WHEN the card renders
- THEN it MUST use `flex gap-4` with avatar on left and content on right
- AND the avatar MUST be circular with consistent size

**Acceptance Criteria:**
- Filter section: `flex items-center justify-between mb-6`
- Filter tabs: `flex gap-2` with active state styling
- Gig cards: `flex justify-between items-start`
- Card right side: `flex flex-col items-end gap-2`
- All existing functionality preserved (filters, pagination, apply)
- All gig browse tests pass
- Responsive on mobile (cards stack vertically)

---

### Requirement: Dashboard 2-Column Layout
The dashboard MUST use a 2-column grid layout with main content on the left and a sidebar on the right.

#### Scenario: Dashboard uses 2-column grid on desktop
- GIVEN an authenticated user views the dashboard on desktop (≥1024px width)
- WHEN the page renders
- THEN it MUST use `grid grid-cols-1 lg:grid-cols-3 gap-6` layout
- AND the main content area MUST span 2 columns (`lg:col-span-2`)
- AND the sidebar MUST span 1 column (`lg:col-span-1`)

#### Scenario: Greeting card spans full width
- GIVEN an authenticated user views the dashboard
- WHEN the greeting card renders
- THEN it MUST appear above the grid layout
- AND it MUST use `flex items-center justify-between` layout
- AND it MUST display user name on left and profile link on right

#### Scenario: Main content contains gigs/applications
- GIVEN an authenticated user views the dashboard
- WHEN the main content area renders
- THEN for CLIENT: it MUST display "My Gigs" section with count badge and list
- AND for SPECIALIST: it MUST display tabbed interface (Active Work, Pending Applications, Archive)
- AND tabs MUST use `flex gap-4 border-b border-gray-700` layout with active state

#### Scenario: Sidebar contains Find Project, Finances, Messages
- GIVEN an authenticated user views the dashboard
- WHEN the sidebar renders
- THEN it MUST contain (in order):
  - "Найти проект" (Find Project) card with blue background
  - "ФИНАНСЫ" (Finances) section showing earnings
  - "СООБЩЕНИЯ" (Messages) section with recent message list

#### Scenario: Mobile layout stacks vertically
- GIVEN a user views the dashboard on mobile (<1024px width)
- WHEN the page renders
- THEN the grid MUST collapse to single column
- AND the sidebar MUST appear below the main content

**Acceptance Criteria:**
- Dashboard uses `grid grid-cols-1 lg:grid-cols-3 gap-6`
- Greeting card: `flex items-center justify-between bg-navy-800 border border-gray-700 rounded-lg p-6 mb-6`
- Main content: `lg:col-span-2`
- Sidebar: `lg:col-span-1` with Find Project, Finances, Messages cards
- Tabs (SPECIALIST): `flex gap-4 border-b border-gray-700 mb-6`
- All existing functionality preserved
- All dashboard tests pass
- Responsive on mobile

---

## MODIFIED Requirements

### Requirement: Homepage
The homepage at `/` MUST display the application name and adapt based on authentication state **with professional styling from the design system**.

#### Scenario: Anonymous user visits homepage with styled UI
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN it MUST display the application name "Gigly" **with professional typography (large, bold, white text)**
- AND it MUST display a "Get Started" link to `/register` **styled as a primary button (bright blue)**
- AND it MUST display a "Sign in" link to `/login` **styled as a secondary button (outlined blue)**
- AND the page MUST use **navy background color**
- AND the layout MUST be **centered and visually balanced**

#### Scenario: Authenticated user visits homepage with styled UI
- GIVEN a user is logged in (valid session cookie)
- WHEN they visit `/`
- THEN it MUST display their email address **with readable typography**
- AND it MUST display a logout button/form **styled as a secondary button**
- AND it MUST NOT show the "Get Started" CTA
- AND the page MUST use **navy background color**

**Acceptance Criteria:**
- `app/page.tsx` calls `getSession()` to check auth state
- Authenticated: shows email + logout form **with design system styling**
- Anonymous: shows "Get Started" link + "Sign in" link **styled as buttons**
- Page uses `bg-navy-900` or equivalent
- Typography uses design system scale
- Buttons use design system button classes

---

### Requirement: Registration Form with Role Selection
The registration form MUST provide visible feedback after submission and include a role selector **with professional styling from the design system**.

#### Scenario: Registration form renders with styled UI
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN the form MUST use **navy background with card styling**
- AND all inputs MUST use **design system input styling (navy background, blue focus ring)**
- AND the submit button MUST use **primary button styling (bright blue)**
- AND the role selector MUST be **visually prominent and styled**
- AND the "Sign in" link MUST be **styled with blue text**

**Acceptance Criteria:**
- `app/register/page.tsx` uses design system classes
- Form container uses card styling: `bg-navy-800 border border-gray-700 rounded-lg p-6`
- All inputs use input styling: `bg-navy-800 border border-gray-600 focus:border-blue-500`
- Submit button uses primary button styling
- Role selector uses custom radio button styling (if applicable)
- All existing functionality maintained
- All registration tests pass

---

### Requirement: Login Page
The application MUST provide a login page at `/login` with email and password fields **styled with the design system**.

#### Scenario: Login page renders with styled UI
- GIVEN a user navigates to `/login`
- WHEN the page loads
- THEN the form MUST use **navy background with card styling**
- AND all inputs MUST use **design system input styling**
- AND the submit button MUST use **primary button styling**
- AND the "Register" link MUST be **styled with blue text**
- AND error messages MUST be **styled with red text and proper visibility**

**Acceptance Criteria:**
- `app/login/page.tsx` uses design system classes
- Form container uses card styling
- All inputs use input styling
- Submit button uses primary button styling
- Error messages use `text-red-400` or equivalent
- All existing functionality maintained
- All login tests pass

---

### Requirement: Role-Based Dashboard
The dashboard MUST render different content based on the user's role **with professional styling from the design system**.

#### Scenario: CLIENT dashboard renders with styled UI
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST use **navy background**
- AND the "Post a Gig" button MUST use **primary button styling**
- AND the "My Gigs" section MUST use **card styling for each gig**
- AND gig cards MUST have **hover states (lighter background on hover)**
- AND status badges MUST use **design system badge styling**
- AND the layout MUST be **visually balanced with proper spacing**

#### Scenario: SPECIALIST dashboard renders with styled UI
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST use **navy background**
- AND the tabs MUST use **styled tab buttons with active state (blue underline or background)**
- AND the "Browse Gigs" button MUST use **primary button styling**
- AND application/gig cards MUST use **card styling with hover states**
- AND status badges MUST use **design system badge styling**

**Acceptance Criteria:**
- `app/(protected)/dashboard/page.tsx` uses design system classes
- All buttons use button styling from design system
- All cards use card styling from design system
- Tabs use styled tab buttons with active state
- All badges use badge styling from design system
- Proper spacing between elements
- All existing functionality maintained
- All dashboard tests pass

---

### Requirement: Gig Creation Form
The system MUST provide a form at `/gigs/new` for CLIENT users to create gigs **with professional styling from the design system**.

#### Scenario: Gig creation form renders with styled UI
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/gigs/new`
- THEN the form MUST use **navy background**
- AND form sections MUST use **card styling with proper spacing**
- AND all inputs and textareas MUST use **design system input styling**
- AND the submit button MUST use **primary button styling**
- AND character counters MUST be **styled with appropriate colors (red when under minimum, gray otherwise)**
- AND the fee preview MUST be **styled prominently with clear typography**
- AND section headings MUST use **design system typography scale**

**Acceptance Criteria:**
- `app/(protected)/gigs/new/page.tsx` and `gig-form.tsx` use design system classes
- Form sections use card styling
- All inputs use input styling
- Submit button uses primary button styling
- Character counters styled appropriately
- Fee preview uses prominent typography
- All existing functionality maintained (character counters, quality warnings, validation)
- All gig creation tests pass

---

### Requirement: Main Navigation
The application MUST provide consistent navigation across all authenticated pages **with professional styling from the design system**.

#### Scenario: Navigation renders with styled UI
- GIVEN an authenticated user views any page
- WHEN the navigation renders
- THEN the navigation bar MUST use **navy background (slightly lighter than page, e.g., bg-navy-800)**
- AND the "GIGLY" logo MUST use **white text with bold font weight**
- AND navigation links MUST use **white/gray text with hover states (brighter on hover)**
- AND the notification bell MUST be **styled with proper icon and badge**
- AND the user avatar/profile area MUST be **styled consistently**
- AND the navigation MUST have **subtle bottom border or shadow for separation**

**Acceptance Criteria:**
- `app/components/MainNav.tsx` uses design system classes
- Navigation bar: `bg-navy-800 border-b border-gray-700`
- Logo: `text-white font-bold text-xl`
- Navigation links: `text-gray-300 hover:text-white transition-colors`
- Notification bell styled with design system
- All existing functionality maintained
- Navigation tests pass

---

## REMOVED Requirements

None. All existing requirements are maintained; only visual styling is added/modified.

---

## Implementation Notes

1. **Backward Compatibility**: All existing functionality must remain unchanged. This is purely a visual overhaul.

2. **Test Compatibility**: All 570+ existing tests must pass without modification. If tests fail, it indicates a functional regression that must be fixed.

3. **Accessibility**: All WCAG AA standards must be maintained or improved. Pay special attention to:
   - Color contrast ratios (text on backgrounds)
   - Focus indicators (keyboard navigation)
   - Screen reader compatibility

4. **Performance**: No performance degradation is acceptable. Monitor:
   - Page load times
   - Bundle size
   - Render performance

5. **Responsive Design**: All styling must work on all screen sizes (320px to 1920px). Test on:
   - Mobile (320px, 375px, 414px)
   - Tablet (768px, 1024px)
   - Desktop (1280px, 1920px)

6. **Design System Consistency**: Use centralized design tokens from `tailwind.config.ts`. Avoid hardcoded colors or spacing values.

7. **Component Reusability**: Extract common patterns into reusable components or utility classes where appropriate.

8. **Documentation**: Keep `docs/DESIGN_SYSTEM.md` updated as the design system evolves.
