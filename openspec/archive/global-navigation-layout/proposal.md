# Proposal: Global Navigation Layout

## Problem Statement

Currently, the dashboard lacks persistent navigation infrastructure. Each page implements fragile "Back" links with hardcoded destinations that break spatial context and create disorientation:

- **No persistent navigation**: Users cannot quickly jump between core areas (Dashboard, Browse Gigs, Profile) without using browser back button or remembering URLs
- **Fragile back links**: Pages like `/dashboard/gigs/[id]/page.tsx` (line 80-82) have hardcoded `<Link href="/dashboard/gigs">← Back to Gigs</Link>` that don't adapt to user context
- **Broken spatial context**: A user who navigates Dashboard → Gig Detail has a "Back to Gigs" link that takes them to Browse Gigs instead of Dashboard
- **Increased cognitive load**: Users must remember where they came from and manually navigate back through multiple pages
- **Missing role-aware navigation**: No visual indication of available actions for each role (CLIENT can post gigs, ADMIN can access moderation)
- **Redundant navigation buttons**: Dashboard page renders large action buttons ("My Profile", "Post Gig", "Browse Gigs", "Sign Out") that will duplicate the global navigation, creating visual clutter and confusion
- **Admin navigation trap**: Without proper layout architecture, ADMIN users will lose navigation when clicking "Moderation" link (navigating from `/dashboard` to `/admin` leaves the dashboard segment in Next.js App Router)

This creates a disjointed experience where users feel lost in the application and cannot efficiently navigate between core workflows.

## Solution Approach

Implement a persistent, role-aware navigation bar that wraps all dashboard and admin routes. The navigation will:

1. **Provide consistent access to core areas**: Always visible navigation with role-specific links
2. **Highlight active route**: Visual indication of current location using `usePathname()` hook
3. **Eliminate fragile back links**: Remove standalone "Back" links from pages now that global navigation exists
4. **Remove redundant navigation buttons**: Remove large action buttons from dashboard page that duplicate global navigation
5. **Use sticky positioning**: Navigation remains visible during scroll for persistent access
6. **Adapt to user role**: Show only relevant links for CLIENT, SPECIALIST, or ADMIN roles
7. **Solve admin navigation trap**: Create dual layouts (`app/dashboard/layout.tsx` and `app/admin/layout.tsx`) to ensure navigation persists when admins navigate between dashboard and admin routes

### Technical Architecture

**Dashboard Layout (Server Component)**
- `app/dashboard/layout.tsx` wraps all `/dashboard/*` routes
- Reads session via `getSession()` to determine user role
- Passes session data to client navigation component
- Renders children with navigation wrapper

**Admin Layout (Server Component)**
- `app/admin/layout.tsx` wraps all `/admin/*` routes
- Identical structure to dashboard layout
- Uses the same `DashboardNav` component
- **Critical for ADMIN users**: Prevents navigation from disappearing when they click "Moderation" link and leave the `/dashboard` segment

**Why Two Layouts?**
In Next.js App Router, layouts only apply to their segment and nested segments:
- `app/dashboard/layout.tsx` applies to `/dashboard/*` only
- When an ADMIN user navigates to `/admin`, they leave the `/dashboard` segment
- Without `app/admin/layout.tsx`, the navigation bar would disappear
- Creating both layouts ensures navigation persists across all protected routes

**Navigation Component (Client Component)**
- `app/components/DashboardNav.tsx` marked with `'use client'`
- Accepts props: `userEmail: string`, `userRole: 'CLIENT' | 'SPECIALIST' | 'ADMIN'`
- Uses `usePathname()` hook to detect active route
- Renders role-specific navigation links with active state highlighting
- Includes sign out button/form
- Shared by both dashboard and admin layouts (code reuse)

**Active Route Detection**
- Compare `pathname` from `usePathname()` with link `href`
- Exact match for Dashboard (`pathname === '/dashboard'`)
- Prefix match for sub-routes (`pathname.startsWith('/dashboard/gigs')`)
- Apply active styles: `border-b-2 border-blue-600 text-blue-600`

**Styling Approach**
- Sticky positioning: `sticky top-0 z-50 bg-white border-b border-gray-200`
- Horizontal navigation bar with flexbox layout
- Links styled as tabs with hover and active states
- Responsive design: stack vertically on mobile if needed
- Consistent with existing Tailwind CSS patterns in the codebase

### Role-Specific Navigation Links

**CLIENT Role:**
- Dashboard (`/dashboard`)
- Post Gig (`/dashboard/gigs/new`)
- Browse Gigs (`/dashboard/gigs`)
- Profile (`/dashboard/profile`)
- Sign Out (form action)

**SPECIALIST Role:**
- Dashboard (`/dashboard`)
- Browse Gigs (`/dashboard/gigs`)
- Profile (`/dashboard/profile`)
- Sign Out (form action)

**ADMIN Role:**
- Dashboard (`/dashboard`)
- Moderation (`/admin`)
- Users (`/admin/users`)
- Gigs (`/admin/gigs`)
- Profile (`/dashboard/profile`)
- Sign Out (form action)

## Scope

### In Scope
- Create `app/dashboard/layout.tsx` wrapping all dashboard routes
- Create `app/admin/layout.tsx` wrapping all admin routes (prevents navigation disappearing when admins visit `/admin`)
- Create `app/components/DashboardNav.tsx` client component
- Implement role-aware navigation with active route highlighting
- Remove standalone "Back" links from dashboard pages
- Remove redundant navigation buttons from dashboard page ("My Profile", "Post Gig", "Browse Gigs", "Sign Out")
- Sticky positioning for persistent visibility
- Responsive design for mobile devices

### Out of Scope
- Breadcrumb navigation (future enhancement)
- Dropdown menus or nested navigation
- User avatar or profile picture in navigation
- Notification badges or counters
- Search bar in navigation
- Mobile hamburger menu (simple responsive stacking is sufficient for MVP)
- Admin-specific layout (admin pages will use dashboard layout)

## Constraints

- Must work with existing Next.js 15 App Router architecture
- Must preserve existing authentication and session management
- Must not break existing page functionality
- Must maintain accessibility (keyboard navigation, screen readers)
- Must use existing Tailwind CSS styling patterns
- Sign out functionality must remain a form with server action (not a link)

## Success Criteria

1. Navigation appears on all dashboard pages (`/dashboard`, `/dashboard/gigs`, `/dashboard/profile`, etc.)
2. Navigation appears on all admin pages (`/admin`, `/admin/users`, `/admin/gigs`)
3. Navigation persists when ADMIN users navigate from `/dashboard` to `/admin` (no disappearing navigation)
4. Correct links displayed for each role (CLIENT, SPECIALIST, ADMIN)
5. Active route is visually highlighted
6. Navigation remains visible during scroll (sticky positioning)
7. All standalone "Back" links removed from dashboard pages
8. All redundant navigation buttons removed from dashboard page (no "My Profile", "Post Gig", "Browse Gigs", "Sign Out" buttons)
9. Dashboard page focuses on core content (profile hints, gig lists, tabs)
10. No broken links or navigation errors
11. Responsive design works on mobile devices
12. Accessibility: keyboard navigation and screen reader support

## Non-Goals

- Redesigning existing page layouts or content
- Adding new features beyond navigation
- Implementing breadcrumb trails
- Creating separate layouts for admin pages
- Adding user profile dropdown menus
- Implementing notification system
