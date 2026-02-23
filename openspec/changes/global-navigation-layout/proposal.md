# Proposal: Global Navigation Layout

## Problem Statement

Currently, the dashboard lacks persistent navigation infrastructure. Each page implements fragile "Back" links with hardcoded destinations that break spatial context and create disorientation:

- **No persistent navigation**: Users cannot quickly jump between core areas (Dashboard, Browse Gigs, Profile) without using browser back button or remembering URLs
- **Fragile back links**: Pages like `/dashboard/gigs/[id]/page.tsx` (line 80-82) have hardcoded `<Link href="/dashboard/gigs">← Back to Gigs</Link>` that don't adapt to user context
- **Broken spatial context**: A user who navigates Dashboard → Gig Detail has a "Back to Gigs" link that takes them to Browse Gigs instead of Dashboard
- **Increased cognitive load**: Users must remember where they came from and manually navigate back through multiple pages
- **Missing role-aware navigation**: No visual indication of available actions for each role (CLIENT can post gigs, ADMIN can access moderation)

This creates a disjointed experience where users feel lost in the application and cannot efficiently navigate between core workflows.

## Solution Approach

Implement a persistent, role-aware navigation bar in `app/dashboard/layout.tsx` that wraps all dashboard routes. The navigation will:

1. **Provide consistent access to core areas**: Always visible navigation with role-specific links
2. **Highlight active route**: Visual indication of current location using `usePathname()` hook
3. **Eliminate fragile back links**: Remove standalone "Back" links from pages now that global navigation exists
4. **Use sticky positioning**: Navigation remains visible during scroll for persistent access
5. **Adapt to user role**: Show only relevant links for CLIENT, SPECIALIST, or ADMIN roles

### Technical Architecture

**Dashboard Layout (Server Component)**
- `app/dashboard/layout.tsx` wraps all `/dashboard/*` routes
- Reads session via `getSession()` to determine user role
- Passes session data to client navigation component
- Renders children with navigation wrapper

**Navigation Component (Client Component)**
- `app/components/DashboardNav.tsx` marked with `'use client'`
- Accepts props: `userEmail: string`, `userRole: 'CLIENT' | 'SPECIALIST' | 'ADMIN'`
- Uses `usePathname()` hook to detect active route
- Renders role-specific navigation links with active state highlighting
- Includes sign out button/form

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
- Create `app/components/DashboardNav.tsx` client component
- Implement role-aware navigation with active route highlighting
- Remove standalone "Back" links from dashboard pages
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
2. Correct links displayed for each role (CLIENT, SPECIALIST, ADMIN)
3. Active route is visually highlighted
4. Navigation remains visible during scroll (sticky positioning)
5. All standalone "Back" links removed from dashboard pages
6. No broken links or navigation errors
7. Responsive design works on mobile devices
8. Accessibility: keyboard navigation and screen reader support

## Non-Goals

- Redesigning existing page layouts or content
- Adding new features beyond navigation
- Implementing breadcrumb trails
- Creating separate layouts for admin pages
- Adding user profile dropdown menus
- Implementing notification system
