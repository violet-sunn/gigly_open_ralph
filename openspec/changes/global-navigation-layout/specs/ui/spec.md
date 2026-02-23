# UI Spec Delta: global-navigation-layout

## ADDED Requirements

### Requirement: Dashboard Layout with Persistent Navigation

The dashboard MUST provide a persistent layout with role-aware navigation that wraps all dashboard routes.

#### Scenario: Dashboard layout wraps all routes
- GIVEN an authenticated user visits any dashboard route
- WHEN the page loads
- THEN the page MUST be wrapped in a persistent layout component
- AND the layout MUST include a navigation bar at the top
- AND the layout MUST render the page content below the navigation
- AND the navigation MUST remain visible across all dashboard pages

#### Scenario: Layout reads user session
- GIVEN an authenticated user visits a dashboard route
- WHEN the layout component renders
- THEN it MUST call `getSession()` to retrieve user session
- AND it MUST pass user email and role to the navigation component
- AND if no session exists, it MUST redirect to `/login` (handled by middleware)

**Acceptance Criteria:**
- `app/dashboard/layout.tsx` exists as a server component
- Calls `getSession()` to read session data
- Passes `userEmail` and `userRole` props to `DashboardNav` component
- Wraps `{children}` to render nested routes
- No duplicate session reads (pages can still read session for authorization)

---

### Requirement: Dashboard Navigation Component

The dashboard MUST display a persistent, role-aware navigation bar with active route highlighting.

#### Scenario: Navigation displays role-specific links for CLIENT
- GIVEN a user with role "CLIENT" is on any dashboard page
- WHEN the navigation renders
- THEN it MUST display the following links in order:
  - "Dashboard" linking to `/dashboard`
  - "Post Gig" linking to `/dashboard/gigs/new`
  - "Browse Gigs" linking to `/dashboard/gigs`
  - "Profile" linking to `/dashboard/profile`
- AND it MUST display a "Sign Out" button/form
- AND it MUST NOT display admin-specific links

#### Scenario: Navigation displays role-specific links for SPECIALIST
- GIVEN a user with role "SPECIALIST" is on any dashboard page
- WHEN the navigation renders
- THEN it MUST display the following links in order:
  - "Dashboard" linking to `/dashboard`
  - "Browse Gigs" linking to `/dashboard/gigs`
  - "Profile" linking to `/dashboard/profile`
- AND it MUST display a "Sign Out" button/form
- AND it MUST NOT display "Post Gig" link
- AND it MUST NOT display admin-specific links

#### Scenario: Navigation displays role-specific links for ADMIN
- GIVEN a user with role "ADMIN" is on any dashboard page
- WHEN the navigation renders
- THEN it MUST display the following links in order:
  - "Dashboard" linking to `/dashboard`
  - "Moderation" linking to `/admin`
  - "Users" linking to `/admin/users`
  - "Gigs" linking to `/admin/gigs`
  - "Profile" linking to `/dashboard/profile`
- AND it MUST display a "Sign Out" button/form

#### Scenario: Active route is highlighted
- GIVEN a user is on `/dashboard`
- WHEN the navigation renders
- THEN the "Dashboard" link MUST be visually highlighted
- AND the highlight MUST use distinct styling (e.g., blue border-bottom, blue text color)
- AND other links MUST NOT be highlighted

#### Scenario: Active route highlighting for sub-routes
- GIVEN a user is on `/dashboard/gigs/123` (gig detail page)
- WHEN the navigation renders
- THEN the "Browse Gigs" link MUST be visually highlighted
- AND the highlighting MUST use prefix matching (`pathname.startsWith('/dashboard/gigs')`)

#### Scenario: Navigation uses sticky positioning
- GIVEN a user is on a dashboard page with scrollable content
- WHEN the user scrolls down the page
- THEN the navigation bar MUST remain visible at the top of the viewport
- AND the navigation MUST use `position: sticky` with `top: 0`
- AND the navigation MUST have appropriate z-index to stay above content

#### Scenario: Navigation is keyboard accessible
- GIVEN a user navigates using keyboard only
- WHEN they press Tab key repeatedly
- THEN focus MUST move through all navigation links in order
- AND focused links MUST have visible focus indicator
- AND pressing Enter on a focused link MUST navigate to that route

#### Scenario: Sign out button remains a form
- GIVEN a user clicks "Sign Out" in the navigation
- WHEN the sign out action triggers
- THEN it MUST submit a form with `logoutUser` server action
- AND it MUST NOT be a simple link (to prevent CSRF)
- AND it MUST redirect to homepage after logout

**Acceptance Criteria:**
- `app/components/DashboardNav.tsx` exists as a client component (`'use client'`)
- Accepts props: `userEmail: string`, `userRole: 'CLIENT' | 'SPECIALIST' | 'ADMIN'`
- Uses `usePathname()` hook from `next/navigation` to detect active route
- Renders role-specific links using conditional logic
- Active route styling: `border-b-2 border-blue-600 text-blue-600`
- Inactive link styling: `text-gray-600 hover:text-gray-900`
- Sticky positioning: `sticky top-0 z-50 bg-white border-b border-gray-200`
- Sign out implemented as form with `logoutUser` action
- All links use Next.js `<Link>` component
- Responsive design: horizontal layout on desktop, stacks on mobile if needed
- Accessible: proper focus states, keyboard navigation, semantic HTML

---

## MODIFIED Requirements

### Requirement: Gig Detail Page

**REMOVED:** Standalone "Back to Gigs" link

#### MODIFIED Scenario: Gig detail page renders without back link
- GIVEN an authenticated user views a gig detail page
- WHEN the page loads
- THEN it MUST NOT display a standalone "Back to Gigs" link
- AND navigation MUST be handled by the persistent navigation bar
- AND all other gig detail functionality MUST remain unchanged

**Rationale:** Persistent navigation bar provides consistent navigation across all pages, eliminating the need for fragile, context-unaware back links.

**Acceptance Criteria:**
- Remove `<Link href="/dashboard/gigs">← Back to Gigs</Link>` from `app/dashboard/gigs/[id]/page.tsx` (line 80-82)
- All other page functionality remains unchanged
- Navigation to other pages handled by persistent navigation bar

---

### Requirement: Gig Browse Page

**REMOVED:** Standalone back link (if present)

#### MODIFIED Scenario: Gig browse page renders without back link
- GIVEN an authenticated user views the gig browse page
- WHEN the page loads
- THEN it MUST NOT display a standalone back link to dashboard
- AND navigation MUST be handled by the persistent navigation bar

**Rationale:** Persistent navigation bar provides "Dashboard" link, eliminating need for back links.

---

### Requirement: Profile Pages

**REMOVED:** Standalone back links (if present)

#### MODIFIED Scenario: Profile pages render without back links
- GIVEN an authenticated user views any profile page (`/dashboard/profile`, `/dashboard/profile/edit`, `/dashboard/profile/[userId]`)
- WHEN the page loads
- THEN it MUST NOT display standalone back links
- AND navigation MUST be handled by the persistent navigation bar

**Rationale:** Persistent navigation bar provides consistent navigation, eliminating need for back links.

---

## Implementation Notes

### Session Reading Strategy
- Layout reads session once via `getSession()`
- Passes role to navigation component as prop
- Individual pages can still read session for authorization checks
- No performance impact (session reading is fast, JWT-based)

### Active Route Detection Logic
```typescript
const pathname = usePathname()

// Exact match for dashboard
const isDashboard = pathname === '/dashboard'

// Prefix match for sub-routes
const isGigs = pathname.startsWith('/dashboard/gigs')
const isProfile = pathname.startsWith('/dashboard/profile')
const isAdmin = pathname.startsWith('/admin')
```

### Responsive Design
- Desktop: horizontal navigation bar with inline links
- Mobile: same horizontal layout (links wrap if needed)
- No hamburger menu needed for MVP (simple link wrapping is sufficient)

### Z-Index Strategy
- Navigation: `z-50` (stays above page content)
- Modals/overlays: `z-[100]` or higher (if added in future)
- Ensures navigation doesn't cover critical UI elements
