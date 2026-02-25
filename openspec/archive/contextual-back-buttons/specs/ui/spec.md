# UI Specification Delta: Contextual Back Buttons

## ADDED Requirements

### Requirement: Context-Aware Navigation Highlighting
The top navigation MUST highlight the correct tab based on navigation context, not just URL path matching.

#### Scenario: Dashboard tab highlighted when viewing gig from dashboard
- GIVEN a user navigates to `/dashboard/gigs/[id]?from=dashboard`
- WHEN the page renders and DashboardNav component evaluates active state
- THEN the "Dashboard" tab MUST be highlighted (blue border and text)
- AND the "Browse Gigs" tab MUST NOT be highlighted

#### Scenario: Browse Gigs tab highlighted when viewing gig from browse page
- GIVEN a user navigates to `/dashboard/gigs/[id]?from=browse`
- WHEN the page renders and DashboardNav component evaluates active state
- THEN the "Browse Gigs" tab MUST be highlighted (blue border and text)
- AND the "Dashboard" tab MUST NOT be highlighted

#### Scenario: No tab highlighted when no context available
- GIVEN a user navigates directly to `/dashboard/gigs/[id]` (no query params)
- WHEN the page renders and DashboardNav component evaluates active state
- THEN no navigation tab MUST be highlighted
- OR the Dashboard tab MAY be highlighted as a safe default

#### Scenario: Navigation highlighting works on gig detail page
- GIVEN a user is on `/dashboard/gigs/[id]?from=dashboard`
- WHEN they view the top navigation
- THEN the visual state MUST clearly indicate they are in the "Dashboard" context
- AND the "Browse Gigs" tab MUST appear inactive (gray text, no border)

#### Scenario: Navigation highlighting persists during page interactions
- GIVEN a user is on `/dashboard/gigs/[id]?from=dashboard`
- WHEN they scroll, interact with forms, or perform other page actions
- THEN the "Dashboard" tab MUST remain highlighted
- AND the highlighting MUST NOT flicker or change unexpectedly

**Acceptance Criteria:**
- `DashboardNav` component reads `from` query parameter from URL
- `isActive` function updated to consider navigation context for gig detail pages
- For paths matching `/dashboard/gigs/[id]`:
  - If `from=dashboard`, treat as if user is on `/dashboard`
  - If `from=browse`, treat as if user is on `/dashboard/gigs`
  - If no `from` param, don't highlight any tab (or default to Dashboard)
- Navigation highlighting logic does not break existing behavior for other pages
- Component uses `useSearchParams()` hook to read query parameters
- **CRITICAL**: `DashboardNav` MUST be wrapped in `<Suspense>` boundary in `app/dashboard/layout.tsx` to prevent client-side rendering de-opt
- No console errors or warnings related to navigation state
- No build warnings about missing Suspense boundaries

---

### Requirement: Contextual Back Button on Gig Detail Page
The gig detail page MUST display a contextual back button that returns users to their previous list view within the same logical section.

#### Scenario: Back button appears when navigated from dashboard
- GIVEN a user navigates to `/dashboard/gigs/[id]?from=dashboard`
- WHEN the gig detail page renders
- THEN a back button MUST be displayed at the top of the page
- AND the button MUST show "← Back to Dashboard" text
- AND the button MUST link to `/dashboard`
- AND clicking the button MUST navigate to the dashboard

#### Scenario: Back button appears when navigated from browse gigs
- GIVEN a user navigates to `/dashboard/gigs/[id]?from=browse`
- WHEN the gig detail page renders
- THEN a back button MUST be displayed at the top of the page
- AND the button MUST show "← Back to Browse Gigs" text
- AND the button MUST link to `/dashboard/gigs`
- AND clicking the button MUST navigate to the browse gigs page

#### Scenario: Back button preserves browse gigs filters
- GIVEN a user is on `/dashboard/gigs?search=react&tags=TypeScript&page=2`
- AND they click a gig link that includes `?from=browse&search=react&tags=TypeScript&page=2`
- WHEN the gig detail page renders
- THEN the back button MUST link to `/dashboard/gigs?search=react&tags=TypeScript&page=2`
- AND clicking the button MUST return to browse gigs with filters intact

#### Scenario: Back button preserves specialist dashboard tab
- GIVEN a specialist user navigates to `/dashboard/gigs/[id]?from=dashboard&tab=active`
- WHEN the gig detail page renders
- THEN the back button MUST show "← Back to Dashboard" text
- AND the button MUST link to `/dashboard#active` or use client-side state to restore tab
- AND clicking the button MUST return to dashboard with Active Work tab selected

#### Scenario: Back button does not appear without context
- GIVEN a user navigates directly to `/dashboard/gigs/[id]` (no query params)
- WHEN the gig detail page renders
- THEN the back button MUST NOT be displayed
- OR the back button MUST default to a safe fallback (e.g., dashboard)

#### Scenario: Back button is visually prominent
- GIVEN a back button is displayed on the gig detail page
- WHEN the page renders
- THEN the button MUST be positioned at the top of the content area
- AND the button MUST include a left arrow icon (← or SVG)
- AND the button MUST use clear, actionable text ("Back to X")
- AND the button MUST have hover affordance (color change or underline)

#### Scenario: Back button is accessible
- GIVEN a back button is displayed
- WHEN a keyboard user navigates the page
- THEN the back button MUST be focusable via Tab key
- AND the button MUST be activatable via Enter or Space key
- AND the button MUST have appropriate ARIA attributes if needed

**Acceptance Criteria:**
- Back button component created (client or server component)
- Component accepts props: `from` (string), `preservedParams` (URLSearchParams or object)
- Component renders conditionally based on `from` value
- Button text changes based on context: "Back to Dashboard" or "Back to Browse Gigs"
- Button uses Next.js `<Link>` component for navigation
- Button includes left arrow icon (← character or SVG)
- Button styled with Tailwind classes for consistency
- Button positioned at top of gig detail page content
- Accessible via keyboard and screen readers
- **CRITICAL**: Component MUST be wrapped in `<Suspense>` boundary when used in Server Components (uses `useSearchParams()`)
- No build warnings about missing Suspense boundaries

---

### Requirement: Navigation Context Query Parameters
List views that link to gig detail pages MUST include query parameters to indicate navigation context.

#### Scenario: Client dashboard links include context
- GIVEN a CLIENT user is on `/dashboard`
- AND the "My Gigs" section displays gig links
- WHEN a gig link is rendered
- THEN the link MUST include `?from=dashboard` query parameter
- AND the full URL MUST be `/dashboard/gigs/[id]?from=dashboard`

#### Scenario: Specialist dashboard links include context and tab
- GIVEN a SPECIALIST user is on `/dashboard` with Active Work tab selected
- AND the Active Work tab displays gig links
- WHEN a gig link is rendered
- THEN the link MUST include `?from=dashboard&tab=active` query parameters
- AND the full URL MUST be `/dashboard/gigs/[id]?from=dashboard&tab=active`

#### Scenario: Specialist dashboard Pending Applications tab links include context
- GIVEN a SPECIALIST user is on `/dashboard` with Pending Applications tab selected
- AND the tab displays application links to gigs
- WHEN a gig link is rendered
- THEN the link MUST include `?from=dashboard&tab=pending` query parameters

#### Scenario: Specialist dashboard Archive tab links include context
- GIVEN a SPECIALIST user is on `/dashboard` with Archive tab selected
- AND the tab displays gig links
- WHEN a gig link is rendered
- THEN the link MUST include `?from=dashboard&tab=archive` query parameters

#### Scenario: Browse gigs page links include context and filters
- GIVEN a user is on `/dashboard/gigs?search=react&tags=TypeScript&page=2`
- AND the gig list displays gig links
- WHEN a gig link is rendered
- THEN the link MUST include `?from=browse&search=react&tags=TypeScript&page=2` query parameters
- AND all existing filter/pagination params MUST be preserved

#### Scenario: Browse gigs links without filters include minimal context
- GIVEN a user is on `/dashboard/gigs` (no filters)
- AND the gig list displays gig links
- WHEN a gig link is rendered
- THEN the link MUST include `?from=browse` query parameter only

**Acceptance Criteria:**
- Client dashboard gig links updated to include `?from=dashboard`
- Specialist dashboard gig links updated to include `?from=dashboard&tab={tabName}`
- Browse gigs page links updated to include `?from=browse` plus all existing query params
- Query param construction uses URLSearchParams API for proper encoding
- Links remain functional if query params are stripped (graceful degradation)
- No breaking changes to existing link behavior

---

### Requirement: Specialist Dashboard Tab Restoration
The specialist dashboard MUST restore the previously selected tab when navigated to with a `tab` query parameter.

#### Scenario: Dashboard restores Active Work tab from query param
- GIVEN a specialist user navigates to `/dashboard?tab=active`
- WHEN the dashboard page renders
- THEN the Active Work tab MUST be selected by default
- AND the tab content MUST be displayed

#### Scenario: Dashboard restores Pending Applications tab from query param
- GIVEN a specialist user navigates to `/dashboard?tab=pending`
- WHEN the dashboard page renders
- THEN the Pending Applications tab MUST be selected by default
- AND the tab content MUST be displayed

#### Scenario: Dashboard restores Archive tab from query param
- GIVEN a specialist user navigates to `/dashboard?tab=archive`
- WHEN the dashboard page renders
- THEN the Archive tab MUST be selected by default
- AND the tab content MUST be displayed

#### Scenario: Dashboard defaults to Active Work without query param
- GIVEN a specialist user navigates to `/dashboard` (no tab param)
- WHEN the dashboard page renders
- THEN the Active Work tab MUST be selected by default (existing behavior)

#### Scenario: Dashboard ignores invalid tab values
- GIVEN a specialist user navigates to `/dashboard?tab=invalid`
- WHEN the dashboard page renders
- THEN the Active Work tab MUST be selected by default
- AND no error MUST be thrown

**Acceptance Criteria:**
- `SpecialistDashboardTabs` component reads `tab` query param from URL
- Component uses query param to set initial tab state
- Valid tab values: "active", "pending", "archive"
- Invalid or missing tab values default to "active"
- Tab state remains client-side after initial render (user can switch tabs normally)
- No server-side errors for invalid tab values
- **CRITICAL**: Component MUST be wrapped in `<Suspense>` boundary in `app/dashboard/page.tsx` (uses `useSearchParams()`)
- No build warnings about missing Suspense boundaries

---

## MODIFIED Requirements

### Requirement: Gig Detail Page (Modified)
The gig detail page layout MUST include a back button section at the top when navigation context is available.

#### Scenario: Back button positioned above gig title
- GIVEN a user navigates to a gig detail page with `?from=dashboard` or `?from=browse`
- WHEN the page renders
- THEN the back button MUST appear above the gig title card
- AND the back button MUST have adequate spacing (mb-4 or mb-6)
- AND the back button MUST be within the same max-width container as the gig content

**Acceptance Criteria:**
- Back button component added to gig detail page layout
- Positioned before the main gig card (above title)
- Consistent spacing with existing page elements
- No layout shifts or visual regressions
- Responsive on mobile devices

---

### Requirement: Client Dashboard (Modified)
The client dashboard "My Gigs" list MUST include navigation context in gig links.

**Acceptance Criteria:**
- All gig links in "My Gigs" section include `?from=dashboard` query param
- Link construction uses template literals or URLSearchParams
- No changes to existing gig display logic

---

### Requirement: Specialist Dashboard (Modified)
The specialist dashboard tabs MUST include navigation context and tab identifier in gig links.

**Acceptance Criteria:**
- All gig links in Active Work tab include `?from=dashboard&tab=active`
- All gig links in Pending Applications tab include `?from=dashboard&tab=pending`
- All gig links in Archive tab include `?from=dashboard&tab=archive`
- Tab state is read from URL query param on initial render
- No changes to existing tab switching logic

---

### Requirement: Gig Browse Page (Modified)
The gig browse page MUST include navigation context and preserve all filter/pagination params in gig links.

**Acceptance Criteria:**
- All gig links include `?from=browse` plus existing query params
- Query param merging preserves search, tags, minBudget, maxBudget, sort, page
- Link construction uses URLSearchParams for proper encoding
- No changes to existing filter/pagination logic
