# UI Spec Delta: Dashboard Pages Token Migration

## ADDED Requirements

### Requirement: Dashboard Card Hierarchy with Design Tokens
Dashboard pages MUST use design tokens to establish visual hierarchy through surface levels, creating depth and organization.

#### Scenario: CLIENT dashboard uses token-based card hierarchy
- GIVEN an authenticated CLIENT user views `/dashboard`
- WHEN the page renders
- THEN the main "My Gigs" section card MUST use `bg-surface-level-1` background token
- AND each individual gig card within "My Gigs" MUST use `bg-surface-level-2` background token
- AND the visual hierarchy MUST create a sense of depth (nested cards appear inset)
- AND borders MUST use `border-neutral-weak` token for subtle separation

#### Scenario: SPECIALIST dashboard uses token-based card hierarchy
- GIVEN an authenticated SPECIALIST user views `/dashboard`
- WHEN the page renders
- THEN the main tabs container card MUST use `bg-surface-level-1` background token
- AND each individual gig/application card within tabs MUST use `bg-surface-level-2` background token
- AND the visual hierarchy MUST create a sense of depth (nested cards appear inset)
- AND borders MUST use `border-neutral-weak` token for subtle separation

#### Scenario: Sidebar cards use consistent token-based styling
- GIVEN an authenticated user (CLIENT or SPECIALIST) views `/dashboard`
- WHEN the sidebar renders
- THEN the "Find Project" card MUST use `bg-blue-500/10` with `border-blue-500/20`
- AND the "Finances" card MUST use `bg-surface-level-1` with `border-neutral-weak`
- AND the "Messages" card MUST use `bg-surface-level-1` with `border-neutral-weak`
- AND all cards MUST use consistent padding of `p-6` (24px)

**Acceptance Criteria:**
- My Gigs section uses `bg-surface-level-1` for container card
- Individual gig cards use `bg-surface-level-2` for nested appearance
- Tabs container uses `bg-surface-level-1` for main card
- Individual gig/application cards in tabs use `bg-surface-level-2`
- All borders use `border-neutral-weak` token
- Sidebar cards use specified token-based backgrounds
- Visual hierarchy creates clear depth perception
- No hardcoded `bg-navy-800` or `border-gray-700` values remain

---

### Requirement: Status Badge Semantic Color System
Status badges MUST use semantic colors consistently across all dashboard views to communicate state clearly.

#### Scenario: Gig status badges use semantic colors
- GIVEN a dashboard displays gigs with various statuses
- WHEN status badges render
- THEN "OPEN" status MUST use gray colors: `bg-gray-500/20 text-gray-400 border-gray-500/30`
- AND "IN_PROGRESS" status MUST use green colors: `bg-success-weak-default text-success-default border-success-default` (maps to #044329/#43c78f)
- AND "REVIEW" status MUST use warning colors: `bg-warning-weak-default text-warning-default border-warning-default`
- AND "COMPLETED" status MUST use success colors: `bg-success-weak-default text-success-default border-success-default`
- AND "PAID" status MUST use success colors: `bg-success-weak-default text-success-default border-success-default`

#### Scenario: Application status badges use semantic colors
- GIVEN a dashboard displays applications with various statuses
- WHEN status badges render
- THEN "PENDING" status MUST use warning colors: `bg-warning-weak-default text-warning-default border-warning-default`
- AND "ACCEPTED" status MUST use success colors: `bg-success-weak-default text-success-default border-success-default`
- AND "REJECTED" status MUST use danger colors: `bg-danger-weak-default text-danger-default border-danger-default`
- AND "WITHDRAWN" status MUST use gray colors: `bg-gray-500/20 text-gray-400 border-gray-500/30`

#### Scenario: Status badge styling is consistent
- GIVEN any status badge on the dashboard
- WHEN the badge renders
- THEN it MUST use consistent sizing: `text-xs px-2 py-1`
- AND it MUST use consistent styling: `rounded-md border font-medium`
- AND color combinations MUST provide sufficient contrast (WCAG AA minimum)

**Acceptance Criteria:**
- All status badges use semantic color tokens (success, warning, danger, gray)
- OPEN/Created gigs use gray (#333643/#b5b5b5 range)
- IN_PROGRESS gigs use green (#044329/#43c78f range)
- Status badge styling is consistent across CLIENT and SPECIALIST dashboards
- No hardcoded status colors remain
- Color contrast meets WCAG AA standards

---

### Requirement: Dashboard Spacing Rhythm
Dashboard pages MUST use consistent spacing tokens to create visual rhythm and improve readability.

#### Scenario: Section gaps use consistent spacing
- GIVEN a dashboard page renders
- WHEN sections are laid out vertically
- THEN the spacing between major sections MUST use `gap-9` (36px) or `gap-12` (48px)
- AND the spacing MUST create clear visual separation between content areas
- AND the spacing MUST be consistent across CLIENT and SPECIALIST dashboards

#### Scenario: Card padding uses consistent spacing
- GIVEN dashboard cards render
- WHEN card content is displayed
- THEN primary section cards MUST use `p-8` (32px) padding for generous spacing
- AND nested cards (gig/application items) MUST use `p-6` (24px) or `p-4` (16px) padding
- AND sidebar cards MUST use `p-6` (24px) padding
- AND padding MUST be consistent for similar card types

#### Scenario: Card gaps use consistent spacing
- GIVEN a list of cards renders (gigs, applications)
- WHEN cards are stacked vertically
- THEN the gap between cards MUST use `gap-6` (24px) or `space-y-6`
- AND the gap MUST create clear separation without excessive whitespace
- AND the gap MUST be consistent across all card lists

**Acceptance Criteria:**
- Section gaps use `gap-9` (36px) or `gap-12` (48px)
- Primary cards use `p-8` (32px) padding
- Nested cards use `p-6` (24px) or `p-4` (16px) padding
- Card lists use `gap-6` (24px) or `space-y-6`
- Spacing is consistent across CLIENT and SPECIALIST dashboards
- No arbitrary spacing values remain

---

### Requirement: CTA Prominence with Design Tokens
Call-to-action buttons and cards MUST use design tokens to ensure visual prominence and guide user actions.

#### Scenario: Primary action buttons use solid blue
- GIVEN a dashboard displays primary action buttons
- WHEN the buttons render
- THEN "Post New Gig" button MUST use `bg-blue-500 hover:bg-blue-600` (maps to #1379f3)
- AND "Browse Gigs" button MUST use `bg-blue-500 hover:bg-blue-600`
- AND button text MUST use `text-white` for maximum contrast
- AND buttons MUST include focus states: `focus:ring-2 focus:ring-blue-500`

#### Scenario: Sidebar CTA card uses blue gradient
- GIVEN a dashboard sidebar renders
- WHEN the "Find Project" CTA card displays
- THEN the card MUST use `bg-blue-500/10` background with `border-blue-500/20` border
- AND the card MUST be full-width within the sidebar column
- AND the card MUST include an icon with `bg-blue-500/20` background
- AND the CTA button within the card MUST use `bg-blue-500 hover:bg-blue-600`

#### Scenario: Secondary actions use subtle styling
- GIVEN a dashboard displays secondary actions (links, text buttons)
- WHEN these elements render
- THEN profile links MUST use `text-blue-500 hover:text-blue-400`
- AND secondary text MUST use `text-gray-300` or `text-gray-400`
- AND secondary actions MUST NOT compete visually with primary CTAs

**Acceptance Criteria:**
- Primary action buttons use solid blue (#1379f3) with hover states
- Sidebar CTA card uses blue gradient background
- CTA buttons include proper focus states for accessibility
- Secondary actions use subtle blue link styling
- Visual hierarchy clearly distinguishes primary from secondary actions
- All button text preserved exactly as-is

---

### Requirement: Dashboard Functionality Preservation
All dashboard functionality MUST remain unchanged during token migration to ensure zero behavioral regressions.

#### Scenario: CLIENT dashboard functionality unchanged
- GIVEN an authenticated CLIENT user interacts with `/dashboard`
- WHEN they click on any interactive element
- THEN all navigation links MUST work identically to before migration
- AND all gig cards MUST link to correct gig detail pages
- AND "Post New Gig" button MUST navigate to `/gigs/new`
- AND profile completion hints MUST display correctly
- AND error messages MUST display correctly

#### Scenario: SPECIALIST dashboard functionality unchanged
- GIVEN an authenticated SPECIALIST user interacts with `/dashboard`
- WHEN they switch between tabs
- THEN tab switching MUST be instant (client-side state change)
- AND tab content MUST filter correctly (Active Work, Pending Applications, Archive)
- AND all gig/application cards MUST link to correct pages
- AND "Browse Gigs" button MUST navigate to `/gigs`
- AND profile completion hints MUST display correctly

#### Scenario: E2E tests pass without modification
- GIVEN the token migration is complete
- WHEN E2E test suites run
- THEN `client-journey` tests MUST pass without modification
- AND `specialist-journey` tests MUST pass without modification
- AND no test selectors MUST be broken by styling changes
- AND no test assertions MUST fail due to visual changes

**Acceptance Criteria:**
- All navigation links work identically
- Tab switching behavior unchanged
- Gig/application filtering logic unchanged
- Profile completion hints display correctly
- Error message display unchanged
- All existing E2E tests pass without modification
- No functional regressions introduced

---

## MODIFIED Requirements

None. This change only adds new styling requirements without modifying existing functional requirements.

---

## REMOVED Requirements

None. This change is purely additive and does not remove any existing requirements.
