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

### Requirement: Admin Layout with Persistent Navigation

The admin routes MUST provide the same persistent navigation layout to prevent navigation disappearing when admins leave the `/dashboard` segment.

#### Scenario: Admin layout wraps all admin routes
- GIVEN an authenticated ADMIN user visits any admin route (`/admin`, `/admin/users`, `/admin/gigs`)
- WHEN the page loads
- THEN the page MUST be wrapped in a persistent layout component
- AND the layout MUST include the same navigation bar as dashboard routes
- AND the layout MUST render the page content below the navigation
- AND the navigation MUST remain visible across all admin pages

#### Scenario: Admin layout reads user session
- GIVEN an authenticated ADMIN user visits an admin route
- WHEN the layout component renders
- THEN it MUST call `getSession()` to retrieve user session
- AND it MUST pass user email and role to the navigation component
- AND if no session exists, it MUST redirect to `/login` (handled by middleware)

**Rationale:** In Next.js App Router, `app/dashboard/layout.tsx` only applies to `/dashboard/*` routes. When an ADMIN user clicks "Moderation" (`/admin`), they leave the `/dashboard` segment and the navigation would disappear. Creating `app/admin/layout.tsx` ensures navigation persists across admin routes.

**Acceptance Criteria:**
- `app/admin/layout.tsx` exists as a server component
- Imports and uses the same `DashboardNav` component
- Calls `getSession()` to read session data
- Passes `userEmail` and `userRole` props to `DashboardNav` component
- Wraps `{children}` to render nested routes
- Identical structure to `app/dashboard/layout.tsx` (code reuse)

---

## MODIFIED Requirements

### Requirement: Dashboard Page

**REMOVED:** Redundant navigation buttons that duplicate global navigation

#### MODIFIED Scenario: Dashboard page renders without redundant navigation buttons
- GIVEN an authenticated user visits `/dashboard`
- WHEN the page loads
- THEN it MUST NOT display standalone navigation buttons ("My Profile", "Post a Gig", "Browse Gigs")
- AND it MUST NOT display standalone "Sign out" button
- AND navigation MUST be handled exclusively by the persistent navigation bar
- AND all other dashboard functionality MUST remain unchanged (profile completion hints, gig lists, tabs)

**Rationale:** The persistent navigation bar now provides all navigation actions. Keeping the large buttons on the dashboard page creates redundancy, visual clutter, and confusion about which navigation method to use.

**Acceptance Criteria:**
- Remove "My Profile" button from CLIENT dashboard (line 98-103 in `app/dashboard/page.tsx`)
- Remove "Post a Gig" button from CLIENT dashboard (line 104-109)
- Remove "My Profile" button from SPECIALIST dashboard (line 172-177)
- Remove "Browse Gigs" button from SPECIALIST dashboard (line 178-183)
- Remove "Sign out" button from bottom of page (line 195-202)
- Keep profile completion hints (they provide contextual value)
- Keep "My Gigs" section for CLIENT (core dashboard content)
- Keep `SpecialistDashboardTabs` component for SPECIALIST (core dashboard content)
- Dashboard heading, email display, and content sections remain unchanged

---

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

### Next.js App Router Layout Architecture

**Critical:** Next.js App Router layouts only apply to their segment and nested segments. This creates an architectural challenge for admin routes:

- `app/dashboard/layout.tsx` applies to `/dashboard/*` routes only
- When an ADMIN user navigates to `/admin`, they leave the `/dashboard` segment
- Without `app/admin/layout.tsx`, the navigation bar would disappear on admin pages

**Solution:** Create two layout files that both use the same `DashboardNav` component:
- `app/dashboard/layout.tsx` - wraps `/dashboard/*` routes
- `app/admin/layout.tsx` - wraps `/admin/*` routes

Both layouts have identical structure:
```typescript
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/app/components/DashboardNav'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav userEmail={session.email} userRole={session.role} />
      {children}
    </div>
  )
}
```

This ensures navigation persists across all protected routes without restructuring the entire app directory into route groups.

### Dashboard Page Simplification

The dashboard page currently renders large navigation buttons that duplicate the global navigation:
- CLIENT: "My Profile", "Post a Gig" buttons
- SPECIALIST: "My Profile", "Browse Gigs" buttons
- Both: "Sign out" button at bottom

These MUST be removed because:
1. **Redundancy**: Global nav already provides these actions
2. **Visual clutter**: Two navigation systems confuse users
3. **Inconsistent UX**: Other pages don't have these buttons, only dashboard does
4. **Spatial confusion**: Users don't know whether to use top nav or page buttons

After removal, dashboard page focuses on its core purpose:
- Profile completion hints (contextual, actionable)
- CLIENT: "My Gigs" list (primary dashboard content)
- SPECIALIST: Dashboard tabs with active work, pending applications, archive (primary dashboard content)

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
