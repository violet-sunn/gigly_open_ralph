# UI Spec Delta: Gig Pages Token Migration

## ADDED Requirements

### Requirement: Gig Browse Page Card Hierarchy
The gig browse page MUST use design tokens to establish visual hierarchy through surface levels, creating depth and organization.

#### Scenario: Gig cards use token-based hierarchy
- GIVEN a SPECIALIST user views `/dashboard/gigs`
- WHEN the page renders with gig cards
- THEN each gig card MUST use `bg-surface-level-1` background token
- AND on hover, cards MUST use `bg-surface-level-2` for visual feedback
- AND borders MUST use `border-neutral-weak` token for subtle separation
- AND hover borders MUST use `border-neutral-strong` for emphasis
- AND the page background MUST remain `bg-navy-900` (from layout)

#### Scenario: Filter panel uses sidebar pattern
- GIVEN a SPECIALIST user views the gig browse page
- WHEN the filter panel renders
- THEN the filter panel container MUST use `bg-white` background (light theme for contrast)
- AND filter inputs MUST use `border-gray-300` with `focus:ring-blue-500`
- AND the "Apply Filters" button MUST use `bg-blue-600 hover:bg-blue-700`
- AND the "Clear Filters" button MUST use `bg-gray-200 hover:bg-gray-300`
- AND the panel MUST have `rounded-lg shadow-md p-6` styling

#### Scenario: Gig card spacing follows rhythm
- GIVEN gig cards are displayed in a list
- WHEN cards are stacked vertically
- THEN the gap between cards MUST use `space-y-4` (16px)
- AND each card MUST use `p-6` (24px) padding
- AND the card grid MUST have adequate spacing from filter panel

**Acceptance Criteria:**
- Gig cards use `bg-surface-level-1` with `border-neutral-weak`
- Hover states use `bg-surface-level-2` and `border-neutral-strong`
- Filter panel maintains light theme styling for contrast
- Card spacing uses `space-y-4` (16px gaps)
- Card padding uses `p-6` (24px)
- All existing filter functionality preserved
- Pagination controls remain functional

---

### Requirement: Gig Detail Page Two-Column Layout
The gig detail page MUST use token-based styling in a two-column layout with clear visual hierarchy.

#### Scenario: Main content column uses token-based cards
- GIVEN a user views a gig detail page at `/dashboard/gigs/[id]`
- WHEN the main content column renders
- THEN the gig details card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the applications section card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND individual application cards MUST use `bg-surface-level-2 border border-neutral-weak`
- AND the messages section card MUST use `bg-navy-800 border border-gray-700` (existing styling)
- AND all cards MUST use `rounded-lg` and appropriate padding

#### Scenario: Sidebar uses token-based styling
- GIVEN a user views a gig detail page
- WHEN the sidebar renders
- THEN the budget card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the card MUST use `p-6` (24px) padding
- AND the card MUST be sticky with `sticky top-6`

#### Scenario: Status badges use semantic colors on detail page
- GIVEN a gig detail page displays status badges
- WHEN status badges render
- THEN "OPEN" status MUST use gray colors: `bg-blue-500/10 text-blue-400`
- AND "IN_PROGRESS" status MUST use green colors: `bg-success-weak-default text-success-default`
- AND "REVIEW" status MUST use warning colors: `bg-warning-weak-default text-warning-default`
- AND "COMPLETED" status MUST use warning colors: `bg-warning-weak-default text-warning-default`
- AND "PAID" status MUST use success colors: `bg-success-weak-default text-success-default`
- AND application status badges MUST follow same semantic system

**Acceptance Criteria:**
- Main content cards use `bg-surface-level-1` for primary containers
- Nested application cards use `bg-surface-level-2` for hierarchy
- Sidebar budget card uses `bg-surface-level-1`
- Status badges use semantic color tokens consistently
- Messages section maintains existing styling (separate migration)
- Two-column layout responsive on mobile (stacks vertically)
- All existing functionality preserved

---

### Requirement: Gig Detail Page Action Forms
Action forms on the gig detail page MUST use token-based styling with prominent CTAs.

#### Scenario: Apply form uses token-based styling
- GIVEN a SPECIALIST user views an OPEN gig detail page
- WHEN the apply form renders
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the form MUST use `p-8` (32px) padding
- AND the submit button MUST use `bg-blue-500 hover:bg-blue-600`
- AND textarea fields MUST use token-based borders and focus states

#### Scenario: Submit work form uses token-based styling
- GIVEN an assigned SPECIALIST views an IN_PROGRESS gig
- WHEN the submit work form renders
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the submit button MUST use `bg-blue-500 hover:bg-blue-600`

#### Scenario: Approve work form uses token-based styling
- GIVEN a CLIENT owner views a REVIEW gig
- WHEN the approve work form renders
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the approve button MUST use `bg-blue-500 hover:bg-blue-600`

#### Scenario: Mark as paid button uses token-based styling
- GIVEN a CLIENT owner views a COMPLETED gig
- WHEN the mark as paid section renders
- THEN the container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the button MUST use `bg-blue-500 hover:bg-blue-600`

**Acceptance Criteria:**
- All action form containers use `bg-surface-level-1 border border-neutral-weak`
- All primary action buttons use `bg-blue-500 hover:bg-blue-600`
- Form padding uses `p-8` (32px) for generous spacing
- All form validation and submission logic preserved
- Error messages display correctly
- Loading states work identically

---

### Requirement: Gig Creation Form Visual Sections
The gig creation form MUST use token-based styling for visual sections while maintaining existing structure.

#### Scenario: Form sections use token-based styling
- GIVEN a CLIENT user views the gig creation form at `/dashboard/gigs/new`
- WHEN the form renders
- THEN the "Basic Information" section MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the "Requirements & Success Criteria" section MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the "Budget & Details" section MUST use `bg-surface-level-1 border border-neutral-weak`
- AND all sections MUST use `rounded-lg p-8` styling
- AND sections MUST be separated with `space-y-8` (32px gaps)

#### Scenario: Form fields maintain consistent styling
- GIVEN a CLIENT user interacts with form fields
- WHEN fields render and receive focus
- THEN input fields MUST use `border-gray-600 focus:border-blue-500 focus:ring-blue-500`
- AND textarea fields MUST use same border and focus styling
- AND all fields MUST use `bg-navy-800 text-white` for dark theme consistency
- AND placeholder text MUST use `placeholder:text-gray-400`

#### Scenario: Submit button uses prominent styling
- GIVEN a CLIENT user views the gig creation form
- WHEN the submit button renders
- THEN the button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the button MUST include focus states: `focus:ring-2 focus:ring-blue-500`
- AND the button MUST be full-width: `w-full`
- AND loading state MUST show "Posting..." text

**Acceptance Criteria:**
- All three form sections use `bg-surface-level-1 border border-neutral-weak`
- Section spacing uses `space-y-8` (32px)
- Form fields maintain dark theme styling with token-based borders
- Submit button uses solid blue with proper focus states
- All character counters remain functional
- All validation warnings remain functional
- Form submission logic unchanged
- All existing tests pass

---

### Requirement: Gig Browse Page Status Badges
Status badges on the gig browse page MUST use semantic colors consistently with Dashboard patterns.

#### Scenario: Example gig badges use blue accent
- GIVEN a gig browse page displays example gigs
- WHEN example badges render
- THEN the badge MUST use `bg-blue-500/10 text-blue-500`
- AND the badge MUST include the ✨ emoji
- AND the badge MUST use `text-xs px-2 py-0.5 rounded-full font-medium`

#### Scenario: Gig status badges use semantic colors
- GIVEN gig cards display status information
- WHEN status badges render (if shown)
- THEN badges MUST follow the same semantic color system as Dashboard
- AND "OPEN" MUST use gray colors
- AND "IN_PROGRESS" MUST use green colors
- AND other statuses MUST use appropriate semantic colors

**Acceptance Criteria:**
- Example badges use blue accent colors
- Status badges (if displayed) use semantic color tokens
- Badge styling consistent with Dashboard badges
- Badge text remains unchanged

---

### Requirement: Gig Pages Functionality Preservation
All gig page functionality MUST remain unchanged during token migration to ensure zero behavioral regressions.

#### Scenario: Gig browse functionality unchanged
- GIVEN a SPECIALIST user interacts with the gig browse page
- WHEN they use filters, pagination, or click gig cards
- THEN all filter logic MUST work identically to before migration
- AND pagination MUST work identically
- AND clicking gig cards MUST navigate to detail pages correctly
- AND all URL parameters MUST be preserved

#### Scenario: Gig detail functionality unchanged
- GIVEN a user interacts with a gig detail page
- WHEN they submit forms, view applications, or send messages
- THEN all form submissions MUST work identically
- AND application accept/reject MUST work identically
- AND work submission/approval MUST work identically
- AND messaging MUST work identically
- AND all navigation MUST work correctly

#### Scenario: Gig creation functionality unchanged
- GIVEN a CLIENT user creates a gig
- WHEN they fill out the form and submit
- THEN all validation MUST work identically
- AND character counters MUST work identically
- AND quality warnings MUST work identically
- AND form submission MUST work identically
- AND redirect after creation MUST work correctly

#### Scenario: Integration tests pass without modification
- GIVEN the token migration is complete
- WHEN integration test suites run
- THEN `gig-creation` tests MUST pass without modification
- AND `gig-filtering` tests MUST pass without modification
- AND `application-flow` tests MUST pass without modification
- AND no test selectors MUST be broken by styling changes

**Acceptance Criteria:**
- All filter functionality works identically
- All pagination functionality works identically
- All form submissions work identically
- All navigation works identically
- All existing integration tests pass without modification
- No functional regressions introduced
- All URL parameters preserved correctly

---

## MODIFIED Requirements

None. This change only adds new styling requirements without modifying existing functional requirements.

---

## REMOVED Requirements

None. This change is purely additive and does not remove any existing requirements.
