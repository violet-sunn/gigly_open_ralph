# Routing Specification Delta

## MODIFIED Requirements

### Requirement: Application Route Structure
**Previous**: All authenticated routes MUST be nested under `/dashboard` parent route.

**New**: Gig and profile routes MUST be un-nested to top-level routes, while `/dashboard` remains as the main authenticated hub.

#### Scenario: Public routes remain unchanged
**Given** a user is not authenticated
**When** they navigate to `/`, `/login`, or `/register`
**Then** they SHALL see the public pages without authentication

#### Scenario: Dashboard remains at same URL
**Given** a user is authenticated
**When** they navigate to `/dashboard`
**Then** they SHALL see their role-based dashboard (CLIENT, SPECIALIST, or ADMIN)
**And** the page SHALL display the same content as the current `/dashboard` page

#### Scenario: Gig browsing route for specialists
**Given** a user is authenticated with SPECIALIST role
**When** they navigate to `/gigs`
**Then** they SHALL see the gig browsing page with filters
**And** the page SHALL display the same content as the current `/dashboard/gigs` page

#### Scenario: Gig browsing route blocked for clients
**Given** a user is authenticated with CLIENT role
**When** they navigate to `/gigs`
**Then** they SHALL be redirected to `/dashboard` with an error message

#### Scenario: Gig detail route with role-based access
**Given** a user is authenticated
**When** they navigate to `/gigs/[id]`
**Then** they SHALL see the gig detail page
**And** the page SHALL display role-appropriate actions (apply for SPECIALIST, manage applications for CLIENT owner)

#### Scenario: Gig creation route for clients only
**Given** a user is authenticated with CLIENT role
**When** they navigate to `/gigs/new`
**Then** they SHALL see the gig creation form

#### Scenario: Gig creation route blocked for specialists
**Given** a user is authenticated with SPECIALIST role
**When** they navigate to `/gigs/new`
**Then** they SHALL be redirected to `/dashboard` with an error message

#### Scenario: Example gigs accessible to all authenticated users
**Given** a user is authenticated with any role
**When** they navigate to `/gigs/examples`
**Then** they SHALL see the example gigs page

#### Scenario: Profile routes accessible to all authenticated users
**Given** a user is authenticated
**When** they navigate to `/profile`, `/profile/edit`, or `/profile/[userId]`
**Then** they SHALL see the respective profile pages
**And** the pages SHALL display the same content as the current `/dashboard/profile/*` pages

#### Scenario: Admin routes remain unchanged
**Given** a user is authenticated with ADMIN role
**When** they navigate to `/admin`, `/admin/users`, or `/admin/gigs`
**Then** they SHALL see the respective admin pages
**And** the routes SHALL remain at the top level (not nested under `/dashboard`)

### Requirement: Backward Compatibility Redirects
**Status**: NEW requirement

Old nested `/dashboard/gigs/*` and `/dashboard/profile/*` URLs MUST redirect to their new top-level equivalents to preserve bookmarks and external links.

#### Scenario: Gig browsing redirect
**Given** a user navigates to `/dashboard/gigs`
**When** the page loads
**Then** they SHALL be redirected to `/gigs` with HTTP 308 (Permanent Redirect)

#### Scenario: Gig detail redirect
**Given** a user navigates to `/dashboard/gigs/[id]`
**When** the page loads
**Then** they SHALL be redirected to `/gigs/[id]` with HTTP 308 (Permanent Redirect)

#### Scenario: Gig creation redirect
**Given** a user navigates to `/dashboard/gigs/new`
**When** the page loads
**Then** they SHALL be redirected to `/gigs/new` with HTTP 308 (Permanent Redirect)

#### Scenario: Gig examples redirect
**Given** a user navigates to `/dashboard/gigs/examples`
**When** the page loads
**Then** they SHALL be redirected to `/gigs/examples` with HTTP 308 (Permanent Redirect)

#### Scenario: Profile redirect
**Given** a user navigates to `/dashboard/profile` or `/dashboard/profile/*`
**When** the page loads
**Then** they SHALL be redirected to `/profile` or `/profile/*` with HTTP 308 (Permanent Redirect)

#### Scenario: Query parameters preserved in redirects
**Given** a user navigates to `/dashboard/gigs?search=react&page=2`
**When** the redirect occurs
**Then** they SHALL be redirected to `/gigs?search=react&page=2`
**And** all query parameters SHALL be preserved

#### Scenario: Dashboard URL unchanged
**Given** a user navigates to `/dashboard`
**When** the page loads
**Then** they SHALL see the dashboard page directly
**And** NO redirect SHALL occur

## ADDED Requirements

### Requirement: Route File Organization
Route files MUST be organized by functional area using Next.js Route Groups in the `app/` directory.

#### Scenario: Protected route group structure
**Given** the application codebase
**When** examining the `app/` directory
**Then** there SHALL be a `app/(protected)/` route group directory
**And** it SHALL contain a single `layout.tsx` that provides navigation to all authenticated routes
**And** it SHALL contain subdirectories: `dashboard/`, `gigs/`, `profile/`

#### Scenario: Dashboard route structure
**Given** the application codebase
**When** examining the `app/(protected)/` directory
**Then** there SHALL be a `dashboard/` directory
**And** it SHALL contain `page.tsx` (no separate layout)

#### Scenario: Gigs route structure
**Given** the application codebase
**When** examining the `app/(protected)/` directory
**Then** there SHALL be a `gigs/` directory
**And** it SHALL contain subdirectories: `[id]/`, `new/`, `examples/`
**And** each subdirectory SHALL contain `page.tsx` (no separate layout)

#### Scenario: Profile route structure
**Given** the application codebase
**When** examining the `app/(protected)/` directory
**Then** there SHALL be a `profile/` directory
**And** it SHALL contain subdirectories: `edit/`, `[userId]/`
**And** each subdirectory SHALL contain `page.tsx` (no separate layout)

## REMOVED Requirements

### Requirement: Dashboard Parent Route for Nested Pages
**Previous**: All authenticated routes MUST be nested under `/dashboard` parent route (e.g., `/dashboard/gigs`, `/dashboard/profile`).

**Status**: This requirement is REMOVED for gig and profile routes. These routes are now un-nested to top-level. The `/dashboard` route itself remains as the main authenticated hub.

#### Scenario: No nested gig routes under dashboard
**Given** the application codebase
**When** examining the `app/` directory
**Then** there SHALL NOT be a `app/dashboard/gigs/` directory
**And** gig routes SHALL be at `app/(protected)/gigs/`

#### Scenario: No nested profile routes under dashboard
**Given** the application codebase
**When** examining the `app/` directory
**Then** there SHALL NOT be a `app/dashboard/profile/` directory
**And** profile routes SHALL be at `app/(protected)/profile/`

#### Scenario: Dashboard route remains
**Given** the application codebase
**When** examining the `app/(protected)/` directory
**Then** there SHALL be a `dashboard/` directory with `page.tsx`
**And** it SHALL serve the main authenticated hub at `/dashboard`
