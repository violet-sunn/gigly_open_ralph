# Authentication Specification Delta

## MODIFIED Requirements

### Requirement: Route Protection Middleware
**Previous**: Middleware MUST protect all `/dashboard/*` routes with a single broad matcher.

**New**: Middleware MUST protect routes with granular matchers for each functional area, enforcing role-based access at the routing level.

#### Scenario: Dashboard route requires authentication
**Given** a user is not authenticated
**When** they attempt to access `/dashboard`
**Then** they SHALL be redirected to `/login`

#### Scenario: Gigs routes require authentication
**Given** a user is not authenticated
**When** they attempt to access any `/gigs/*` route
**Then** they SHALL be redirected to `/login`

#### Scenario: Profile routes require authentication
**Given** a user is not authenticated
**When** they attempt to access any `/profile/*` route
**Then** they SHALL be redirected to `/login`

#### Scenario: Admin routes require ADMIN role
**Given** a user is authenticated with CLIENT or SPECIALIST role
**When** they attempt to access any `/admin/*` route
**Then** they SHALL be redirected to `/dashboard`

#### Scenario: Gig browsing requires SPECIALIST role
**Given** a user is authenticated with CLIENT role
**When** they attempt to access `/gigs` (browse page)
**Then** they SHALL be redirected to `/dashboard?error=gigs-specialists-only`

#### Scenario: Gig creation requires CLIENT role
**Given** a user is authenticated with SPECIALIST role
**When** they attempt to access `/gigs/new`
**Then** they SHALL be redirected to `/dashboard?error=gig-creation-clients-only`

#### Scenario: Gig detail accessible to both roles
**Given** a user is authenticated with CLIENT or SPECIALIST role
**When** they attempt to access `/gigs/[id]`
**Then** they SHALL be allowed to access the page
**And** role-specific actions SHALL be enforced at the page level

#### Scenario: Example gigs accessible to all authenticated users
**Given** a user is authenticated with any role
**When** they attempt to access `/gigs/examples`
**Then** they SHALL be allowed to access the page

#### Scenario: Authenticated users redirected from auth pages
**Given** a user is authenticated
**When** they attempt to access `/login` or `/register`
**Then** they SHALL be redirected to `/dashboard`

### Requirement: Middleware Configuration
Middleware MUST use specific path matchers for each functional area instead of a single broad matcher.

#### Scenario: Middleware matcher includes all protected routes
**Given** the middleware configuration
**When** examining the `config.matcher` array
**Then** it SHALL include the following paths:
- `/dashboard`
- `/gigs/:path*`
- `/profile/:path*`
- `/admin/:path*`
- `/login`
- `/register`

#### Scenario: Middleware does not match public routes
**Given** the middleware configuration
**When** examining the `config.matcher` array
**Then** it SHALL NOT include `/` (landing page)
**And** it SHALL NOT include `/api/*` routes
**And** it SHALL NOT include `/_next/*` routes

### Requirement: Role-Based Route Protection
Middleware MUST enforce role-based access control for specific routes before the page component loads.

#### Scenario: CLIENT role blocked from specialist-only routes
**Given** a user is authenticated with CLIENT role
**When** middleware evaluates access to `/gigs` (browse page)
**Then** middleware SHALL redirect to `/dashboard?error=gigs-specialists-only`
**And** the page component SHALL NOT be loaded

#### Scenario: SPECIALIST role blocked from client-only routes
**Given** a user is authenticated with SPECIALIST role
**When** middleware evaluates access to `/gigs/new`
**Then** middleware SHALL redirect to `/dashboard?error=gig-creation-clients-only`
**And** the page component SHALL NOT be loaded

#### Scenario: Non-ADMIN role blocked from admin routes
**Given** a user is authenticated with CLIENT or SPECIALIST role
**When** middleware evaluates access to any `/admin/*` route
**Then** middleware SHALL redirect to `/dashboard`
**And** the page component SHALL NOT be loaded

## ADDED Requirements

### Requirement: Error Message Query Parameters
Middleware MUST pass error codes via query parameters when redirecting due to insufficient permissions.

#### Scenario: Specialist-only error code
**Given** a CLIENT user is redirected from `/gigs`
**When** they arrive at `/dashboard`
**Then** the URL SHALL include `?error=gigs-specialists-only`
**And** the dashboard page SHALL display: "Browse Gigs is only available for specialists."

#### Scenario: Client-only error code
**Given** a SPECIALIST user is redirected from `/gigs/new`
**When** they arrive at `/dashboard`
**Then** the URL SHALL include `?error=gig-creation-clients-only`
**And** the dashboard page SHALL display: "Creating gigs is only available for clients."

#### Scenario: Admin-only error code
**Given** a non-ADMIN user is redirected from `/admin`
**When** they arrive at `/dashboard`
**Then** the URL SHALL include `?error=admin-access-required`
**And** the dashboard page SHALL display: "Admin access is required for this page."

### Requirement: Session Verification Performance
Middleware MUST verify sessions efficiently without degrading performance.

#### Scenario: Session verification uses cached JWT secret
**Given** the middleware is processing a request
**When** verifying the JWT session
**Then** it SHALL use a cached `TextEncoder` instance for the secret
**And** it SHALL NOT create a new encoder on every request

#### Scenario: Session verification handles invalid tokens gracefully
**Given** a user has an invalid or expired JWT token
**When** middleware attempts to verify the session
**Then** it SHALL catch the verification error
**And** it SHALL treat the user as unauthenticated
**And** it SHALL NOT throw an unhandled exception

## REMOVED Requirements

### Requirement: Single Dashboard Matcher
**Previous**: Middleware MUST use a single `/dashboard/:path*` matcher for all authenticated routes.

**Status**: This requirement is REMOVED. Middleware now uses granular matchers for each functional area.

#### Scenario: No dashboard matcher in configuration
**Given** the middleware configuration
**When** examining the `config.matcher` array
**Then** it SHALL NOT include `/dashboard/:path*`
**And** it SHALL use specific matchers for each functional area instead
