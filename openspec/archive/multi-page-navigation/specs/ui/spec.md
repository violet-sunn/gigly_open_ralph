# UI Specification Delta

## MODIFIED Requirements

### Requirement: Main Navigation Component
**Previous**: Navigation component MUST display links to `/dashboard` and nested routes.

**New**: Navigation component MUST display links to `/dashboard` and un-nested functional area routes.

#### Scenario: Dashboard link in navigation
**Given** a user is authenticated
**When** they view the main navigation
**Then** there SHALL be a "Dashboard" link pointing to `/dashboard`
**And** the link SHALL be active when the current route is `/dashboard`

#### Scenario: Browse Gigs link for specialists
**Given** a user is authenticated with SPECIALIST role
**When** they view the main navigation
**Then** there SHALL be a "Browse Gigs" link pointing to `/gigs`
**And** the link SHALL be active when the current route starts with `/gigs`

#### Scenario: Browse Gigs link hidden for clients
**Given** a user is authenticated with CLIENT role
**When** they view the main navigation
**Then** there SHALL NOT be a "Browse Gigs" link
**And** the navigation SHALL NOT show links to specialist-only routes

#### Scenario: Post Gig link for clients
**Given** a user is authenticated with CLIENT role
**When** they view the main navigation
**Then** there SHALL be a "Post Gig" link pointing to `/gigs/new`
**And** the link SHALL be active when the current route is `/gigs/new`

#### Scenario: Profile link for all authenticated users
**Given** a user is authenticated with any role
**When** they view the main navigation
**Then** there SHALL be a "Profile" link pointing to `/profile`
**And** the link SHALL be active when the current route starts with `/profile`

#### Scenario: Admin links for admin users
**Given** a user is authenticated with ADMIN role
**When** they view the main navigation
**Then** there SHALL be "Moderation", "Users", and "Gigs" links
**And** the links SHALL point to `/admin`, `/admin/users`, and `/admin/gigs` respectively

#### Scenario: Active link highlighting
**Given** a user is on any route
**When** the navigation renders
**Then** the link matching the current route SHALL be highlighted with a blue border
**And** other links SHALL have a transparent border

### Requirement: Internal Link Updates
All internal `<Link>` components MUST use the new route structure.

#### Scenario: Dashboard links remain unchanged
**Given** any component with a link to `/dashboard`
**When** the component renders
**Then** the link SHALL continue to point to `/dashboard`

#### Scenario: Gig detail links updated
**Given** any component with a link to `/dashboard/gigs/[id]`
**When** the component renders
**Then** the link SHALL point to `/gigs/[id]` instead

#### Scenario: Profile links updated
**Given** any component with a link to `/dashboard/profile/*`
**When** the component renders
**Then** the link SHALL point to `/profile/*` instead

#### Scenario: Query parameters preserved in links
**Given** a link includes query parameters (e.g., `?from=dashboard`)
**When** the link is updated to the new route structure
**Then** the query parameters SHALL be preserved

## ADDED Requirements

### Requirement: Shared Protected Layout
All authenticated routes MUST share a single layout component using Next.js Route Groups to avoid duplication.

#### Scenario: Dashboard layout component
**Given** the application codebase
**When** examining layout components
**Then** there SHALL be a layout at `app/(protected)/layout.tsx`
**And** it SHALL render the `MainNav` component
**And** it SHALL wrap the dashboard page at `/dashboard`
**And** it SHALL wrap all gig-related pages at `/gigs/*`
**And** it SHALL wrap all profile-related pages at `/profile/*`
**And** it SHALL perform authentication checks

#### Scenario: No duplicate layouts
**Given** the application codebase
**When** examining the `app/(protected)/` directory
**Then** there SHALL NOT be separate `layout.tsx` files in `dashboard/`, `gigs/`, or `profile/` subdirectories
**And** all authenticated routes SHALL inherit the shared layout from `(protected)/layout.tsx`

#### Scenario: Admin layout remains separate
**Given** the application codebase
**When** examining layout components
**Then** the `app/admin/layout.tsx` SHALL remain separate from the protected route group
**And** it SHALL render the `MainNav` component independently

### Requirement: Navigation Component Refactoring
The navigation component MUST be refactored to work with the new route structure.

#### Scenario: Navigation component renamed
**Given** the application codebase
**When** examining navigation components
**Then** the `DashboardNav` component SHALL be renamed to `MainNav`
**And** it SHALL be located at `app/components/MainNav.tsx`

#### Scenario: Active route detection updated
**Given** the `MainNav` component
**When** determining which link is active
**Then** it SHALL check against the new route structure (e.g., `/dashboard`, `/gigs`, `/profile`)
**And** it SHALL NOT check for nested `/dashboard/gigs` or `/dashboard/profile` routes

#### Scenario: Gig detail page active link logic
**Given** a user is on a gig detail page (`/gigs/[id]`)
**When** the navigation determines the active link
**Then** it SHALL check the `from` query parameter
**And** if `from=dashboard`, the "Dashboard" link SHALL be active
**And** if `from=browse`, the "Browse Gigs" link SHALL be active

### Requirement: Error Message Display
The dashboard page MUST display error messages passed via query parameters.

#### Scenario: Error message for specialist-only routes
**Given** a user is redirected to `/dashboard?error=gigs-specialists-only`
**When** the dashboard page renders
**Then** it SHALL display a yellow alert box
**And** the message SHALL read: "Browse Gigs is only available for specialists."

#### Scenario: Error message for client-only routes
**Given** a user is redirected to `/dashboard?error=gig-creation-clients-only`
**When** the dashboard page renders
**Then** it SHALL display a yellow alert box
**And** the message SHALL read: "Creating gigs is only available for clients."

#### Scenario: Error message for admin-only routes
**Given** a user is redirected to `/dashboard?error=admin-access-required`
**When** the dashboard page renders
**Then** it SHALL display a yellow alert box
**And** the message SHALL read: "Admin access is required for this page."

#### Scenario: No error message when parameter absent
**Given** a user navigates to `/dashboard` without an error parameter
**When** the dashboard page renders
**Then** it SHALL NOT display any error message alert box

## REMOVED Requirements

### Requirement: Dashboard-Specific Navigation
**Previous**: Navigation component MUST be named `DashboardNav` and handle dashboard-specific routing.

**Status**: This requirement is REMOVED. Navigation is now generalized for all functional areas.

#### Scenario: No DashboardNav component
**Given** the application codebase
**When** examining navigation components
**Then** there SHALL NOT be a `DashboardNav` component
**And** it SHALL be replaced by `MainNav`

#### Scenario: No dashboard-specific active link logic
**Given** the navigation component
**When** determining active links
**Then** it SHALL NOT include special logic for `/dashboard` routes
**And** it SHALL use generalized logic for all functional areas

### Requirement: Single Dashboard Layout
**Previous**: All authenticated routes MUST use a single `DashboardLayout` component.

**Status**: This requirement is REMOVED. Each functional area now has its own layout.

#### Scenario: No DashboardLayout component
**Given** the application codebase
**When** examining layout components
**Then** there SHALL NOT be a `DashboardLayout` component at `app/dashboard/layout.tsx`
**And** each functional area SHALL have its own layout component
