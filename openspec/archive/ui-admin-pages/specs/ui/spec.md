# UI Specification Delta: Admin Pages Token Migration

## ADDED Requirements

### Requirement: Admin Dashboard Card Hierarchy
The admin dashboard MUST use design tokens to establish visual hierarchy through surface levels, creating depth and organization.

#### Scenario: Statistics cards use token-based styling
- GIVEN an ADMIN user views `/admin`
- WHEN the page renders with statistics cards
- THEN each statistics card MUST use `bg-surface-level-1` background token
- AND borders MUST use `border-neutral-weak` token for subtle separation
- AND the page background MUST remain `bg-navy-900` (from layout)
- AND error-colored statistics (Suspended Users, Closed Gigs) MUST use `text-error-500`

#### Scenario: Navigation cards use token-based styling
- GIVEN an ADMIN user views the admin dashboard
- WHEN the navigation cards (User Management, Gig Management) render
- THEN each card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND on hover, cards MUST use `hover:border-blue-500` for visual feedback
- AND cards MUST use `p-8` (32px) padding for generous spacing

#### Scenario: Card spacing follows rhythm
- GIVEN statistics and navigation cards are displayed
- WHEN cards are arranged in grids
- THEN the statistics grid MUST use `gap-6` (24px) between cards
- AND the navigation grid MUST use `gap-6` (24px) between cards
- AND section spacing MUST use `mb-8` (32px) for vertical separation

**Acceptance Criteria:**
- Statistics cards use `bg-surface-level-1 border border-neutral-weak`
- Navigation cards use `bg-surface-level-1 border border-neutral-weak`
- Hover states use `hover:border-blue-500`
- Card padding uses `p-8` (32px)
- Grid gaps use `gap-6` (24px)
- All existing functionality preserved
- All text labels preserved exactly

---

### Requirement: Admin User Management Page Card Hierarchy
The user management page MUST use design tokens for filter panels and table containers, matching Dashboard patterns.

#### Scenario: Filter panel uses token-based styling
- GIVEN an ADMIN user views `/admin/users`
- WHEN the filter panel renders
- THEN the panel container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the panel MUST use `p-6` (24px) padding
- AND the panel MUST have `rounded-lg shadow-md` styling

#### Scenario: Table container uses token-based styling
- GIVEN an ADMIN user views the user management page
- WHEN the table container renders
- THEN the container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the container MUST have `rounded-lg overflow-hidden shadow-md` styling
- AND table rows MUST maintain readability with appropriate contrast

#### Scenario: User status badges use semantic colors
- GIVEN the user table displays user status
- WHEN status badges render
- THEN "Suspended" status MUST use `bg-error-500/10 text-error-400` (red, semantic)
- AND "Active" status MUST use `bg-success-500/10 text-success-400` (green, semantic)
- AND badges MUST use `px-2 py-1 text-xs font-medium rounded-full` styling

#### Scenario: Action buttons use semantic colors
- GIVEN the user table displays action buttons
- WHEN suspend/unsuspend buttons render
- THEN "Suspend" button MUST use `bg-error-500 hover:bg-error-600 text-white` (red)
- AND "Unsuspend" button MUST use `bg-success-500 hover:bg-success-600 text-white` (green)
- AND buttons MUST include focus states: `focus:ring-2 focus:ring-{color}-500`

**Acceptance Criteria:**
- Filter panel uses `bg-surface-level-1 border border-neutral-weak`
- Table container uses `bg-surface-level-1 border border-neutral-weak`
- Status badges use semantic color tokens (error for suspended, success for active)
- Suspend button uses red/error color
- Unsuspend button uses green/success color
- All existing functionality preserved (filters, pagination, actions)
- All filter labels and button text preserved exactly

---

### Requirement: Admin Gig Management Page Card Hierarchy
The gig management page MUST use design tokens for filter panels and table containers, with semantic status badges matching Dashboard patterns.

#### Scenario: Filter panel uses token-based styling
- GIVEN an ADMIN user views `/admin/gigs`
- WHEN the filter panel renders
- THEN the panel container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the panel MUST use `p-6` (24px) padding
- AND the panel MUST have `rounded-lg shadow-md` styling

#### Scenario: Table container uses token-based styling
- GIVEN an ADMIN user views the gig management page
- WHEN the table container renders
- THEN the container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the container MUST have `rounded-lg overflow-hidden shadow-md` styling
- AND table rows MUST maintain readability with appropriate contrast

#### Scenario: Gig status badges use semantic colors
- GIVEN the gig table displays gig status
- WHEN status badges render
- THEN "OPEN" status MUST use `bg-gray-500/20 text-gray-400` (gray, neutral)
- AND "IN_PROGRESS" status MUST use `bg-success-500/10 text-success-400` (green, active work)
- AND "REVIEW" status MUST use `bg-warning-500/10 text-warning-400` (yellow/orange, needs attention)
- AND "COMPLETED" status MUST use `bg-warning-500/10 text-warning-400` (yellow/orange, awaiting payment)
- AND "PAID" status MUST use `bg-success-500/10 text-success-400` (green, completed)
- AND "Closed" badge MUST use `bg-error-500/10 text-error-400` (red, admin action)
- AND badges MUST use `px-2 py-1 text-xs font-medium rounded-full` styling

#### Scenario: Close gig button uses semantic color
- GIVEN the gig table displays close action buttons
- WHEN close buttons render for non-closed gigs
- THEN "Close" button MUST use `bg-error-500 hover:bg-error-600 text-white` (red)
- AND button MUST include focus state: `focus:ring-2 focus:ring-error-500`
- AND loading state MUST show "Closing..." text

**Acceptance Criteria:**
- Filter panel uses `bg-surface-level-1 border border-neutral-weak`
- Table container uses `bg-surface-level-1 border border-neutral-weak`
- Gig status badges use semantic color tokens matching Dashboard patterns
- Close button uses red/error color
- All existing functionality preserved (filters, pagination, close action)
- All filter labels and button text preserved exactly

---

### Requirement: Admin Pages Spacing Consistency
All admin pages MUST follow consistent spacing rhythm matching Dashboard patterns.

#### Scenario: Container spacing is consistent
- GIVEN an ADMIN user views any admin page
- WHEN the page container renders
- THEN the container MUST use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- AND this MUST match Dashboard container spacing exactly

#### Scenario: Card spacing follows rhythm
- GIVEN admin pages display cards and sections
- WHEN cards are arranged vertically or in grids
- THEN card grids MUST use `gap-6` (24px) between cards
- AND section spacing MUST use `mb-6` or `mb-8` (24px or 32px) for vertical separation
- AND filter panels MUST use `mb-6` (24px) margin bottom

#### Scenario: Card padding is consistent
- GIVEN admin pages display various cards
- WHEN cards render
- THEN statistics cards MUST use `p-8` (32px) padding
- AND filter panels MUST use `p-6` (24px) padding
- AND navigation cards MUST use `p-8` (32px) padding

**Acceptance Criteria:**
- All admin pages use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8` container
- Card grids use `gap-6` (24px)
- Section spacing uses `mb-6` or `mb-8` (24px or 32px)
- Statistics/navigation cards use `p-8` (32px) padding
- Filter panels use `p-6` (24px) padding
- Spacing matches Dashboard patterns exactly

---

### Requirement: Admin Pages Functionality Preservation
All admin page functionality MUST remain unchanged during token migration to ensure zero behavioral regressions.

#### Scenario: User management functionality unchanged
- GIVEN an ADMIN user interacts with the user management page
- WHEN they use filters, pagination, or action buttons
- THEN all filter logic MUST work identically to before migration
- AND pagination MUST work identically
- AND suspend/unsuspend actions MUST work identically
- AND all URL parameters MUST be preserved

#### Scenario: Gig management functionality unchanged
- GIVEN an ADMIN user interacts with the gig management page
- WHEN they use filters, pagination, or close action
- THEN all filter logic MUST work identically to before migration
- AND pagination MUST work identically
- AND close gig action MUST work identically
- AND all URL parameters MUST be preserved

#### Scenario: Integration tests pass without modification
- GIVEN the token migration is complete
- WHEN integration test suites run
- THEN `admin-moderation` E2E tests MUST pass without modification
- AND no test selectors MUST be broken by styling changes
- AND all admin actions MUST complete successfully

**Acceptance Criteria:**
- All filter functionality works identically
- All pagination functionality works identically
- All admin actions work identically (suspend, unsuspend, close)
- All navigation works identically
- All existing E2E tests pass without modification
- No functional regressions introduced
- All URL parameters preserved correctly

---

## MODIFIED Requirements

None. This change only adds new styling requirements for admin pages without modifying existing requirements.

---

## REMOVED Requirements

None. This change is purely additive, establishing design token usage for admin pages.
