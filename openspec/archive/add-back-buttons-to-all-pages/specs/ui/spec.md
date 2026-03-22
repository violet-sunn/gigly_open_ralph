# UI Specification Delta: Back Button Navigation

## ADDED Requirements

### Requirement: BackButton Component Context Handling

The BackButton component MUST support multiple navigation contexts via the `from` query parameter and render appropriate back navigation links.

#### Scenario: BackButton renders for profile context
- GIVEN a user navigates to a page with `?from=profile` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Profile" text
- AND it MUST link to `/dashboard/profile`

#### Scenario: BackButton renders for dashboard context
- GIVEN a user navigates to a page with `?from=dashboard` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Dashboard" text
- AND it MUST link to `/dashboard`

#### Scenario: BackButton renders for admin-dashboard context
- GIVEN a user navigates to a page with `?from=admin-dashboard` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Admin Dashboard" text
- AND it MUST link to `/admin`

#### Scenario: BackButton renders for examples context
- GIVEN a user navigates to a page with `?from=examples` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Examples" text
- AND it MUST link to `/dashboard/gigs/examples`

#### Scenario: BackButton preserves browse filters and pagination
- GIVEN a user navigates to a gig detail page with `?from=browse&search=react&tags=React&page=2` query parameters
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Browse Gigs" text
- AND it MUST link to `/gigs?search=react&tags=React&page=2`
- AND it MUST preserve all filter and pagination query parameters (search, tags, minBudget, maxBudget, sort, page)

#### Scenario: BackButton does not render without from parameter
- GIVEN a user navigates to a page without a `from` query parameter
- WHEN the BackButton component renders
- THEN it MUST return null (not render anything)

#### Scenario: BackButton does not render for unknown context
- GIVEN a user navigates to a page with `?from=unknown-context` query parameter
- WHEN the BackButton component renders
- THEN it MUST return null (not render anything)

---

### Requirement: Profile Edit Page Back Navigation

The profile edit page MUST include a BackButton component to allow users to navigate back to their profile.

#### Scenario: BackButton appears on profile edit page
- GIVEN a user navigates to `/profile/edit?from=profile`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard/profile`

#### Scenario: Profile edit links include from parameter
- GIVEN a user is viewing their profile page at `/dashboard/profile`
- WHEN they click any "Edit Profile" or "Редактировать профиль" link
- THEN they MUST be navigated to `/profile/edit?from=profile`

---

### Requirement: Gig Creation Page Back Navigation

The gig creation page MUST include a BackButton component to allow users to navigate back to the dashboard.

#### Scenario: BackButton appears on gig creation page
- GIVEN a user navigates to `/gigs/new?from=dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard`

#### Scenario: Gig creation links include from parameter
- GIVEN a user is viewing their dashboard
- WHEN they click a "Post a Gig" or "Create Gig" link
- THEN they MUST be navigated to `/gigs/new?from=dashboard`

---

### Requirement: Admin Pages Back Navigation

Admin user management and gig management pages MUST use the BackButton component for consistent navigation back to the admin dashboard.

#### Scenario: BackButton appears on admin users page
- GIVEN an admin navigates to `/admin/users?from=admin-dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the bottom of the page
- AND clicking the BackButton MUST navigate to `/admin`
- AND the manual "← Back to Admin Dashboard" link MUST be removed

#### Scenario: BackButton appears on admin gigs page
- GIVEN an admin navigates to `/admin/gigs?from=admin-dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the bottom of the page
- AND clicking the BackButton MUST navigate to `/admin`
- AND the manual "← Back to Admin Dashboard" link MUST be removed

#### Scenario: Admin dashboard links include from parameter
- GIVEN an admin is viewing the admin dashboard at `/admin`
- WHEN they click "User Management" or "Gig Management" links
- THEN they MUST be navigated to `/admin/users?from=admin-dashboard` or `/admin/gigs?from=admin-dashboard` respectively

---

### Requirement: Public Profile Page Back Navigation

The public profile page MUST include a BackButton component to allow users to navigate back to the dashboard.

#### Scenario: BackButton appears on public profile page
- GIVEN a user navigates to `/profile/[userId]?from=dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard`

#### Scenario: Public profile links include from parameter
- GIVEN a user views a specialist's name in an application list or gig details
- WHEN they click the link to view the specialist's public profile
- THEN they MUST be navigated to `/profile/[userId]?from=dashboard`

---

### Requirement: Examples Page Back Navigation

The examples page MUST include a BackButton component to allow users to navigate back to the dashboard.

#### Scenario: BackButton appears on examples page
- GIVEN a user navigates to `/gigs/examples?from=dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard`

#### Scenario: Examples page links include from parameter
- GIVEN a user is viewing the gig creation form
- WHEN they click the "💡 View example gigs for inspiration" link
- THEN they MUST be navigated to `/gigs/examples?from=dashboard` (note: link already opens in new tab, so from parameter is for consistency)

---

### Requirement: BackButton Component Implementation

The BackButton component MUST be implemented as a client component using Next.js hooks for query parameter access.

#### Scenario: BackButton uses useSearchParams hook
- GIVEN the BackButton component is rendered
- WHEN it needs to access the `from` query parameter
- THEN it MUST use the `useSearchParams()` hook from `next/navigation`
- AND it MUST be wrapped in a Suspense boundary where used

#### Scenario: BackButton maintains consistent styling
- GIVEN a BackButton is rendered on any page
- WHEN the component displays
- THEN it MUST use consistent styling: `inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors`
- AND it MUST display the arrow character "←" before the text

---

## MODIFIED Requirements

None. This change adds new functionality without modifying existing requirements.

---

## REMOVED Requirements

None. This change does not remove any existing requirements.
