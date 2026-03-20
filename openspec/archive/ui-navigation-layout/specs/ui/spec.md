# UI Spec Delta: Navigation Layout Token Migration

This spec delta adds requirements for token-based styling in navigation and layout components.

---

## ADDED Requirements

### Requirement: Navigation Header Token-Based Styling
The main navigation header MUST use design tokens for all color and spacing values to ensure consistency with the design system.

#### Scenario: Navigation header uses token-based background color
- GIVEN an authenticated user views any page with the MainNav component
- WHEN the navigation header renders
- THEN the header background MUST use `bg-surface-level-1` design token
- AND the header border MUST use `border-neutral-weak` design token
- AND the header MUST NOT use hardcoded color values like `bg-navy-800` or `border-gray-700`

#### Scenario: Navigation links maintain active and hover states
- GIVEN an authenticated user is on a specific page (e.g., /dashboard)
- WHEN the navigation header renders
- THEN the active navigation link MUST be visually highlighted
- AND the active link MUST use `border-blue-500` and `text-blue-500` for active state
- AND hovering over inactive links MUST show hover state with `hover:text-white` and `hover:bg-navy-700`
- AND all navigation link text MUST remain exactly as implemented (no text changes)

#### Scenario: Navigation header is responsive
- GIVEN an authenticated user views the navigation on a mobile device (320px width)
- WHEN the page renders
- THEN the navigation header MUST remain functional and accessible
- AND all navigation links MUST be clickable
- AND the layout MUST NOT cause horizontal scrolling
- AND the notification bell MUST remain visible and functional

**Acceptance Criteria:**
- MainNav component uses `bg-surface-level-1` for header background
- MainNav component uses `border-neutral-weak` for header border
- Active state styling uses `border-blue-500` and `text-blue-500`
- Hover states use `hover:text-white` and `hover:bg-navy-700`
- All navigation link text preserved exactly as-is
- Responsive behavior works on mobile (320px width)
- All existing E2E navigation tests pass without modification

---

### Requirement: Notification Bell Token-Based Styling
The notification bell component MUST use design tokens where appropriate while maintaining semantic color usage for badges.

#### Scenario: Notification badge uses semantic error color
- GIVEN an authenticated user (CLIENT or SPECIALIST) has unread notifications
- WHEN the notification bell renders in the navigation header
- THEN the unread count badge MUST display with `bg-error-500` background
- AND the badge MUST use `text-white` for the count text
- AND the badge MUST be positioned at the top-right of the bell icon
- AND the badge MUST be visually prominent and easily noticeable

#### Scenario: Notification bell maintains functionality
- GIVEN an authenticated user clicks the notification bell
- WHEN the dropdown opens
- THEN all notification functionality MUST work as before
- AND clicking outside the dropdown MUST close it
- AND clicking a notification item MUST navigate to the gig page
- AND the unread count MUST update correctly after viewing notifications

**Acceptance Criteria:**
- NotificationBell component uses `bg-error-500` for badge background (semantic color)
- Badge displays unread count correctly
- All notification bell functionality preserved
- Dropdown interactions work as before
- No functional regressions in notification system

---

### Requirement: Layout Container Token-Based Background
The protected layout container MUST use design tokens for background colors to ensure visual consistency across all pages.

#### Scenario: Protected layout uses token-based background
- GIVEN an authenticated user navigates to any protected page
- WHEN the layout renders
- THEN the page background MUST use `var(--bg-surface-level-0)` CSS variable
- AND the background color MUST be consistent across all protected pages
- AND the MainNav component MUST be wrapped in Suspense boundary
- AND the layout MUST provide proper fallback during loading

#### Scenario: Layout maintains responsive behavior
- GIVEN an authenticated user views a protected page on various devices
- WHEN the page renders at different viewport sizes (320px, 768px, 1024px, 1440px)
- THEN the layout MUST adapt appropriately
- AND the navigation header MUST remain sticky at the top
- AND page content MUST be properly contained with max-width constraints
- AND horizontal scrolling MUST NOT occur

**Acceptance Criteria:**
- Protected layout uses `var(--bg-surface-level-0)` for page background
- MainNav wrapped in Suspense with proper fallback
- Layout is responsive across all viewport sizes
- No horizontal scrolling on any viewport
- Consistent visual appearance across all protected pages

---

## MODIFIED Requirements

### Requirement: Role-Based Dashboard
(Existing requirement - no changes to functionality, only clarifying token usage)

**Updated Acceptance Criteria:**
- Dashboard page background uses token-based color from layout
- Navigation header uses token-based styling (see Navigation Header Token-Based Styling requirement)
- All dashboard functionality remains unchanged
- Token migration does not affect dashboard behavior or data display

---

## REMOVED Requirements

(None - this change only adds styling requirements without removing any existing functionality)

---

## Implementation Notes

1. **Token Coverage**: The design token system provides tokens for most navigation styling needs:
   - `bg-surface-level-1` for header background
   - `border-neutral-weak` for borders
   - `var(--bg-surface-level-0)` for page backgrounds

2. **Hardcoded Colors Retained**: Some colors remain hardcoded where tokens don't exist:
   - Hover states: `hover:bg-navy-700` (no hover token available)
   - Active states: `border-blue-500`, `text-blue-500` (brand colors)
   - Notification badge: `bg-error-500` (semantic error color)

3. **No Behavioral Changes**: This change is styling-only. All navigation functionality, link behavior, active states, and notification bell interactions remain exactly as implemented.

4. **Testing Strategy**: Existing E2E tests should pass without modification, confirming no functional regressions.

5. **Figma Reference**: The Figma prototype (node-id=4032-181) provides visual reference for the navigation layout, but implementation uses project's established design token system rather than exact Figma color values.
