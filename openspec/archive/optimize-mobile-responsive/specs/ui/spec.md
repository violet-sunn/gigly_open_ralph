# UI Specification Delta: Mobile Responsive Optimization

This document describes changes to the UI specification to support comprehensive mobile responsive design.

---

## ADDED Requirements

### Requirement: Responsive Navigation with Hamburger Menu
The main navigation component MUST adapt to mobile viewports by using a hamburger menu to save vertical space and improve usability.

#### Scenario: Desktop navigation displays horizontal links
- GIVEN an authenticated user views the navigation on a desktop viewport (>=768px)
- WHEN the MainNav component renders
- THEN the navigation links MUST be displayed horizontally in the header
- AND the hamburger menu button MUST be hidden
- AND all navigation links MUST be visible and accessible

#### Scenario: Mobile navigation displays hamburger menu
- GIVEN an authenticated user views the navigation on a mobile viewport (<768px)
- WHEN the MainNav component renders
- THEN the horizontal navigation links MUST be hidden
- AND a hamburger menu button (☰) MUST be displayed in the header
- AND the hamburger button MUST have a minimum touch target size of 44x44px
- AND the hamburger button MUST be positioned in the top-right area of the header

#### Scenario: Hamburger menu toggles open and closed
- GIVEN a user on a mobile viewport (<768px)
- WHEN they tap the hamburger menu button
- THEN a mobile menu MUST slide in from the right or top
- AND the mobile menu MUST display all navigation links vertically
- AND tapping the hamburger button again MUST close the menu
- AND tapping outside the menu MUST close the menu

#### Scenario: Mobile menu displays all navigation links
- GIVEN a user opens the mobile menu
- WHEN the menu is displayed
- THEN all navigation links MUST be visible (Dashboard, Post Gig/Browse Gigs, Profile, Admin links)
- AND each link MUST have adequate spacing (minimum 44px height)
- AND the user's email MUST be displayed
- AND the Sign Out button MUST be displayed
- AND all links MUST be tappable with adequate touch targets

#### Scenario: Mobile menu maintains active link highlighting
- GIVEN a user is on a specific page (e.g., /dashboard)
- WHEN they open the mobile menu
- THEN the active navigation link MUST be visually highlighted
- AND the highlighting MUST match the desktop navigation style

#### Scenario: Mobile menu is keyboard accessible
- GIVEN a user opens the mobile menu
- WHEN they navigate with Tab key
- THEN focus MUST move between menu items
- AND pressing Enter on a focused link MUST navigate to that page
- AND pressing Escape MUST close the menu

**Acceptance Criteria:**
- MainNav component uses Tailwind responsive utilities: `hidden md:flex` for desktop nav, `md:hidden` for mobile button
- Hamburger button has minimum 44x44px touch target
- Mobile menu slides in with smooth transition (CSS transition or animation)
- Mobile menu has backdrop overlay (semi-transparent dark background)
- Mobile menu closes on link click, outside click, or Escape key
- Active link highlighting works in mobile menu
- All navigation functionality preserved on mobile

---

### Requirement: Table-to-Card Conversion on Mobile
Data tables MUST convert to card layouts on mobile viewports to prevent horizontal scrolling and improve readability.

#### Scenario: Admin users table displays as table on desktop
- GIVEN an admin user views the users management page on desktop (>=768px)
- WHEN the page renders
- THEN the users data MUST be displayed in a table format
- AND the table MUST show columns: Email, Role, Status, Registered, Actions
- AND the table MUST be fully visible without horizontal scrolling

#### Scenario: Admin users table displays as cards on mobile
- GIVEN an admin user views the users management page on mobile (<768px)
- WHEN the page renders
- THEN the table MUST be hidden
- AND the users data MUST be displayed as cards
- AND each card MUST show: email, role badge, status badge, registered date, action button
- AND cards MUST stack vertically
- AND cards MUST fit within viewport width without horizontal scrolling

#### Scenario: Admin gigs table displays as table on desktop
- GIVEN an admin user views the gigs management page on desktop (>=768px)
- WHEN the page renders
- THEN the gigs data MUST be displayed in a table format
- AND the table MUST show columns: Title, Status, Budget, Client, Created, Actions
- AND the table MUST be fully visible without horizontal scrolling

#### Scenario: Admin gigs table displays as cards on mobile
- GIVEN an admin user views the gigs management page on mobile (<768px)
- WHEN the page renders
- THEN the table MUST be hidden
- AND the gigs data MUST be displayed as cards
- AND each card MUST show: title, status badge, budget, client name, created date, action button
- AND cards MUST stack vertically
- AND cards MUST fit within viewport width without horizontal scrolling

#### Scenario: Card layout maintains all functionality
- GIVEN an admin user views data in card layout on mobile
- WHEN they interact with action buttons (suspend, unsuspend, close)
- THEN all functionality MUST work identically to table layout
- AND action buttons MUST have minimum 44x44px touch targets
- AND success/error feedback MUST display correctly

**Acceptance Criteria:**
- Use Tailwind responsive utilities: `hidden md:table` for tables, `md:hidden` for cards
- Card components created for user and gig data
- Cards use design tokens for styling (bg-surface-level-1, border-neutral-weak)
- Cards have adequate padding and spacing for mobile
- Action buttons in cards have minimum 44x44px touch targets
- All table functionality preserved in card layout
- No horizontal scrolling on mobile

---

### Requirement: Touch Target Size Compliance
All interactive elements MUST meet the minimum touch target size of 44x44px to ensure usability on touch devices.

#### Scenario: Buttons meet minimum touch target size
- GIVEN any page with buttons (submit, cancel, action buttons)
- WHEN the page renders on any viewport
- THEN all buttons MUST have a minimum height of 44px
- AND all buttons MUST have adequate horizontal padding to ensure minimum 44px width
- AND buttons with icons only MUST be at least 44x44px

#### Scenario: Links meet minimum touch target size
- GIVEN any page with clickable links
- WHEN the page renders on any viewport
- THEN all links MUST have adequate padding to ensure minimum 44x44px clickable area
- AND navigation links MUST have minimum 44px height
- AND inline text links MUST have adequate line-height and padding

#### Scenario: Form inputs meet minimum touch target size
- GIVEN any form with input fields
- WHEN the form renders on any viewport
- THEN all text inputs MUST have minimum height of 44px
- AND all textareas MUST have minimum height of 44px
- AND all select dropdowns MUST have minimum height of 44px
- AND all checkboxes and radio buttons MUST have minimum 44x44px clickable area

#### Scenario: Icon buttons meet minimum touch target size
- GIVEN any page with icon-only buttons (hamburger menu, close buttons, etc.)
- WHEN the page renders on any viewport
- THEN all icon buttons MUST be at least 44x44px
- AND icon buttons MUST have visible focus states for accessibility

**Acceptance Criteria:**
- All buttons have `min-h-[44px]` or equivalent padding
- All form inputs have `h-11` (44px) or larger
- All navigation links have adequate padding for 44px height
- Icon buttons have explicit width and height of 44px minimum
- Touch target audit completed and documented
- E2E tests verify critical touch targets meet minimum size

---

### Requirement: Horizontal Scroll Prevention
All pages MUST prevent horizontal scrolling on mobile viewports to ensure content fits within the viewport width.

#### Scenario: No horizontal scrolling on any page
- GIVEN a user views any page on a mobile viewport (375px width)
- WHEN the page renders
- THEN the page MUST NOT have a horizontal scrollbar
- AND all content MUST fit within the viewport width
- AND no content MUST extend beyond the right edge of the viewport

#### Scenario: Wide content adapts to viewport
- GIVEN a page with potentially wide content (tables, long text, images)
- WHEN the page renders on mobile viewport
- THEN wide tables MUST convert to card layouts or scrollable containers
- AND long text MUST wrap to multiple lines
- AND images MUST scale to fit viewport width
- AND fixed-width containers MUST use responsive width (max-w-full, w-full)

#### Scenario: Container padding respects viewport
- GIVEN any page with container padding
- WHEN the page renders on mobile viewport
- THEN container padding MUST be adjusted for mobile (e.g., px-4 instead of px-8)
- AND content MUST not be cut off by excessive padding
- AND adequate padding MUST be maintained for readability

**Acceptance Criteria:**
- All pages tested at 375px viewport width
- No horizontal scrollbar appears on any page
- Wide content uses responsive strategies (card conversion, wrapping, scaling)
- Container classes use responsive padding (px-4 sm:px-6 lg:px-8)
- E2E tests verify no horizontal scrolling
- Manual testing on actual mobile devices (iOS Safari, Android Chrome)

---

## MODIFIED Requirements

### Requirement: Gig Creation Form (Mobile Optimization)
The gig creation form MUST be optimized for mobile viewports with adequate spacing and touch-friendly inputs.

#### Scenario: Form inputs are touch-friendly on mobile
- GIVEN a CLIENT user views the gig creation form on mobile (375px viewport)
- WHEN the form renders
- THEN all input fields MUST have minimum height of 44px
- AND all input fields MUST have adequate padding (16px minimum)
- AND all textareas MUST have minimum height of 44px
- AND the submit button MUST have minimum height of 44px

#### Scenario: Form layout adapts to mobile
- GIVEN a CLIENT user views the gig creation form on mobile
- WHEN the form renders
- THEN the form container MUST fit within viewport width
- AND there MUST be no horizontal scrolling
- AND field labels MUST be clearly visible
- AND spacing between fields MUST be adequate for mobile (16px minimum)

#### Scenario: Form remains fully functional on mobile
- GIVEN a CLIENT user fills out the gig creation form on mobile
- WHEN they interact with form fields and submit
- THEN all form functionality MUST work identically to desktop
- AND validation errors MUST display clearly
- AND the budget preview MUST be visible and readable
- AND the form MUST be submittable without issues

**Acceptance Criteria:**
- All form inputs have `h-11` (44px) or larger
- Input padding adjusted for mobile: `p-4` (16px)
- Form container uses responsive width: `max-w-lg w-full`
- Spacing between fields: `space-y-4` (16px)
- E2E tests verify form usability at 375px viewport
- Manual testing on actual mobile devices

---

### Requirement: Profile Edit Form (Mobile Optimization)
The profile edit form MUST be optimized for mobile viewports with vertical stacking and touch-friendly inputs.

#### Scenario: Form stacks vertically on mobile
- GIVEN a user views the profile edit form on mobile (<1024px viewport)
- WHEN the form renders
- THEN the 2-column grid MUST stack vertically (single column)
- AND all form fields MUST be displayed in a single column
- AND the header card MUST remain at the top
- AND the layout MUST match the profile view page's mobile behavior

#### Scenario: Form inputs are touch-friendly on mobile
- GIVEN a user views the profile edit form on mobile
- WHEN the form renders
- THEN all input fields MUST have minimum height of 44px
- AND all input fields MUST have adequate padding (16px minimum)
- AND all textareas MUST have minimum height of 44px
- AND Save/Cancel buttons MUST have minimum height of 44px

#### Scenario: Form remains fully functional on mobile
- GIVEN a user fills out the profile edit form on mobile
- WHEN they interact with form fields and submit
- THEN all form functionality MUST work identically to desktop
- AND validation errors MUST display clearly
- AND the form MUST be submittable without issues
- AND there MUST be no horizontal scrolling

**Acceptance Criteria:**
- Grid layout uses `grid-cols-1 lg:grid-cols-2` (already implemented)
- All form inputs have `h-11` (44px) or larger
- Input padding adjusted for mobile: `p-4` (16px)
- Save/Cancel buttons have minimum 44px height
- E2E tests verify form usability at 375px viewport
- Manual testing on actual mobile devices

---

### Requirement: Dashboard Pages (Mobile Optimization)
The dashboard pages MUST be optimized for mobile viewports with vertical stacking and touch-friendly interactions.

#### Scenario: Dashboard layout stacks vertically on mobile
- GIVEN a user views their dashboard on mobile (<1024px viewport)
- WHEN the page renders
- THEN the 2-column grid (main content + sidebar) MUST stack vertically
- AND the main content MUST be displayed first
- AND the sidebar MUST be displayed below main content
- AND all cards MUST fit within viewport width

#### Scenario: Dashboard cards are touch-friendly
- GIVEN a user views their dashboard on mobile
- WHEN they interact with gig cards, application cards, or action buttons
- THEN all clickable elements MUST have minimum 44x44px touch targets
- AND card links MUST be easily tappable
- AND buttons MUST have adequate spacing between them

#### Scenario: Dashboard remains fully functional on mobile
- GIVEN a user interacts with their dashboard on mobile
- WHEN they tap links, buttons, or cards
- THEN all functionality MUST work identically to desktop
- AND navigation MUST work correctly
- AND there MUST be no horizontal scrolling
- AND all content MUST be readable

**Acceptance Criteria:**
- Grid layout uses `grid-cols-1 lg:grid-cols-3` or similar responsive breakpoints
- All buttons and links have adequate touch targets (44x44px minimum)
- Cards use responsive padding: `p-4 sm:p-6`
- E2E tests verify dashboard usability at 375px viewport
- Manual testing for both CLIENT and SPECIALIST dashboards

---

## REMOVED Requirements

(No requirements are being removed in this change)
