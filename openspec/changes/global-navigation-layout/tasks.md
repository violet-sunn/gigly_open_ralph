# Tasks: global-navigation-layout

## Implementation Checklist

### 1. Create Dashboard Layout Component

**File:** `app/dashboard/layout.tsx`

**Implementation:**
- Create server component that wraps all dashboard routes
- Import `getSession` from `@/lib/session`
- Import `redirect` from `next/navigation`
- Import `DashboardNav` component (to be created in task 2)
- Call `getSession()` to read user session
- If no session, redirect to `/login` (defensive check, middleware should handle this)
- Pass `session.email` and `session.role` as props to `DashboardNav`
- Render `DashboardNav` above `{children}`
- Use semantic HTML: `<div className="min-h-screen">` wrapper

**Code Structure:**
```typescript
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/app/components/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

**Test Plan:**
- Visit `/dashboard` and verify layout renders
- Visit `/dashboard/gigs` and verify layout renders
- Visit `/dashboard/profile` and verify layout renders
- Verify navigation bar appears on all dashboard pages
- Verify page content renders below navigation
- Test with CLIENT, SPECIALIST, and ADMIN roles

---

### 2. Create Dashboard Navigation Component

**File:** `app/components/DashboardNav.tsx`

**Implementation:**
- Create client component with `'use client'` directive
- Import `Link` from `next/link`
- Import `usePathname` from `next/navigation`
- Import `logoutUser` from `@/app/actions/auth`
- Define props interface: `{ userEmail: string; userRole: 'CLIENT' | 'SPECIALIST' | 'ADMIN' }`
- Use `usePathname()` hook to get current pathname
- Implement active route detection logic (exact match for `/dashboard`, prefix match for sub-routes)
- Render role-specific navigation links using conditional logic
- Apply active styles: `border-b-2 border-blue-600 text-blue-600`
- Apply inactive styles: `text-gray-600 hover:text-gray-900 border-b-2 border-transparent`
- Use sticky positioning: `sticky top-0 z-50 bg-white border-b border-gray-200`
- Implement sign out as form with `logoutUser` action
- Use flexbox layout for horizontal navigation
- Add responsive design (wrap on mobile if needed)

**Code Structure:**
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutUser } from '@/app/actions/auth'

interface DashboardNavProps {
  userEmail: string
  userRole: 'CLIENT' | 'SPECIALIST' | 'ADMIN'
}

export function DashboardNav({ userEmail, userRole }: DashboardNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) => {
    const base = 'px-4 py-4 text-sm font-medium border-b-2 transition-colors'
    return isActive(path)
      ? `${base} border-blue-600 text-blue-600`
      : `${base} border-transparent text-gray-600 hover:text-gray-900`
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Link href="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>

            {userRole === 'CLIENT' && (
              <Link href="/dashboard/gigs/new" className={linkClass('/dashboard/gigs/new')}>
                Post Gig
              </Link>
            )}

            {(userRole === 'CLIENT' || userRole === 'SPECIALIST') && (
              <Link href="/dashboard/gigs" className={linkClass('/dashboard/gigs')}>
                Browse Gigs
              </Link>
            )}

            {userRole === 'ADMIN' && (
              <>
                <Link href="/admin" className={linkClass('/admin')}>
                  Moderation
                </Link>
                <Link href="/admin/users" className={linkClass('/admin/users')}>
                  Users
                </Link>
                <Link href="/admin/gigs" className={linkClass('/admin/gigs')}>
                  Gigs
                </Link>
              </>
            )}

            <Link href="/dashboard/profile" className={linkClass('/dashboard/profile')}>
              Profile
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <form action={logoutUser}>
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Test Plan:**
- Test with CLIENT role: verify "Dashboard", "Post Gig", "Browse Gigs", "Profile", "Sign Out" appear
- Test with SPECIALIST role: verify "Dashboard", "Browse Gigs", "Profile", "Sign Out" appear (no "Post Gig")
- Test with ADMIN role: verify "Dashboard", "Moderation", "Users", "Gigs", "Profile", "Sign Out" appear
- Navigate to `/dashboard` and verify "Dashboard" link is highlighted
- Navigate to `/dashboard/gigs` and verify "Browse Gigs" link is highlighted
- Navigate to `/dashboard/gigs/123` and verify "Browse Gigs" link is highlighted (prefix match)
- Navigate to `/dashboard/profile` and verify "Profile" link is highlighted
- Click each navigation link and verify navigation works
- Click "Sign Out" and verify logout works
- Test keyboard navigation: Tab through links, Enter to activate
- Test sticky positioning: scroll page and verify navigation stays at top
- Test responsive design on mobile viewport

---

### 3. Create Admin Layout Component

**File:** `app/admin/layout.tsx`

**Implementation:**
- Create server component that wraps all admin routes (`/admin`, `/admin/users`, `/admin/gigs`)
- Import `getSession` from `@/lib/session`
- Import `redirect` from `next/navigation`
- Import `DashboardNav` component (same component used in dashboard layout)
- Call `getSession()` to read user session
- If no session, redirect to `/login` (defensive check, middleware should handle this)
- Pass `session.email` and `session.role` as props to `DashboardNav`
- Render `DashboardNav` above `{children}`
- Use identical structure to `app/dashboard/layout.tsx`

**Code Structure:**
```typescript
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/app/components/DashboardNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

**Rationale:** In Next.js App Router, `app/dashboard/layout.tsx` only applies to `/dashboard/*` routes. When an ADMIN user clicks "Moderation" (`/admin`), they leave the `/dashboard` segment and the navigation would disappear without this layout. This ensures navigation persists across all admin routes.

**Test Plan:**
- Login as ADMIN user
- Visit `/dashboard` and verify navigation appears
- Click "Moderation" link in navigation
- Verify navigation remains visible on `/admin` page
- Click "Users" and "Gigs" links
- Verify navigation remains visible on `/admin/users` and `/admin/gigs`
- Verify active route highlighting works for admin routes

---

### 4. Remove Redundant Navigation Buttons from Dashboard Page

**File:** `app/dashboard/page.tsx`

**Implementation:**
- Remove "My Profile" button from CLIENT dashboard (lines 98-103)
- Remove "Post a Gig" button from CLIENT dashboard (lines 104-109)
- Remove "My Profile" button from SPECIALIST dashboard (lines 172-177)
- Remove "Browse Gigs" button from SPECIALIST dashboard (lines 178-183)
- Remove "Sign out" button from bottom of page (lines 195-202)
- Keep profile completion hints (they provide contextual value)
- Keep "My Gigs" section for CLIENT (core dashboard content)
- Keep `SpecialistDashboardTabs` component for SPECIALIST (core dashboard content)
- Adjust spacing/layout after removing buttons

**Before (CLIENT dashboard):**
```typescript
<div className="space-y-4">
  <Link href="/dashboard/profile" className="...">
    My Profile
  </Link>
  <Link href="/dashboard/gigs/new" className="...">
    Post a Gig
  </Link>
  <div className="border border-gray-200 rounded-md p-4">
    {/* My Gigs section */}
  </div>
</div>
```

**After (CLIENT dashboard):**
```typescript
<div className="space-y-4">
  <div className="border border-gray-200 rounded-md p-4">
    {/* My Gigs section */}
  </div>
</div>
```

**Before (SPECIALIST dashboard):**
```typescript
<div className="space-y-4">
  <Link href="/dashboard/profile" className="...">
    My Profile
  </Link>
  <Link href="/dashboard/gigs" className="...">
    Browse Gigs
  </Link>
  <SpecialistDashboardTabs activeGigs={activeGigs} applications={applications} />
</div>
```

**After (SPECIALIST dashboard):**
```typescript
<div className="space-y-4">
  <SpecialistDashboardTabs activeGigs={activeGigs} applications={applications} />
</div>
```

**Before (bottom of page):**
```typescript
<form action={logoutUser}>
  <button type="submit" className="...">
    Sign out
  </button>
</form>
```

**After:** Remove entire form element.

**Rationale:** The persistent navigation bar now provides all navigation actions. Keeping these large buttons creates redundancy, visual clutter, and confusion about which navigation method to use.

**Test Plan:**
- Login as CLIENT user
- Visit `/dashboard` and verify no "My Profile" or "Post a Gig" buttons appear
- Verify "My Gigs" section still displays
- Verify profile completion hint still displays (if profile incomplete)
- Verify no "Sign out" button at bottom
- Verify navigation bar provides all navigation actions
- Login as SPECIALIST user
- Visit `/dashboard` and verify no "My Profile" or "Browse Gigs" buttons appear
- Verify `SpecialistDashboardTabs` component still displays
- Verify profile completion hint still displays (if profile incomplete)
- Verify no "Sign out" button at bottom

---

### 5. Remove Back Links from Gig Detail Page

**File:** `app/dashboard/gigs/[id]/page.tsx`

**Implementation:**
- Remove lines 80-82: `<Link href="/dashboard/gigs" className="text-sm text-blue-600 hover:text-blue-700">← Back to Gigs</Link>`
- Remove the `<Link>` import if it's no longer used (check if other Links exist on the page)
- Adjust spacing/layout if needed after removing the back link
- Verify all other page functionality remains unchanged

**Before:**
```typescript
<div className="max-w-2xl mx-auto px-4">
  <Link href="/dashboard/gigs" className="text-sm text-blue-600 hover:text-blue-700">
    ← Back to Gigs
  </Link>

  <div className="mt-4 bg-white rounded-lg shadow-md p-6 space-y-4">
```

**After:**
```typescript
<div className="max-w-2xl mx-auto px-4">
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
```

**Test Plan:**
- Visit `/dashboard/gigs/[id]` and verify no "Back to Gigs" link appears
- Verify navigation bar provides "Browse Gigs" link
- Verify all gig detail functionality works (apply, accept/reject, submit work, approve, messages)
- Verify page layout looks correct without back link

---

### 6. Remove Back Links from Other Pages (if present)

**Files to check:**
- `app/dashboard/gigs/page.tsx`
- `app/dashboard/profile/page.tsx`
- `app/dashboard/profile/edit/page.tsx`
- `app/dashboard/profile/[userId]/page.tsx`
- `app/dashboard/gigs/new/page.tsx`

**Implementation:**
- Search each file for standalone back links (e.g., `← Back to`, `Back to Dashboard`)
- Remove any found back links
- Verify page layout and functionality after removal

**Test Plan:**
- Visit each page and verify no standalone back links appear
- Verify navigation bar provides navigation to all core areas
- Verify all page functionality remains unchanged

---

### 7. Update Admin Pages (if needed)

**Files:**
- `app/admin/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/gigs/page.tsx`

**Implementation:**
- Admin pages are under `/admin/*` which is outside `/dashboard/*`
- Check if admin pages have standalone back links
- If present, remove them (navigation bar provides "Dashboard" link)
- Admin pages will automatically use dashboard layout since they're accessed by ADMIN users

**Note:** Admin routes (`/admin/*`) are NOT nested under `/dashboard/*` in the file structure, so they won't automatically use the dashboard layout. We need to decide:
- Option A: Keep admin pages separate (no layout change)
- Option B: Move admin pages under dashboard layout
- Option C: Create separate admin layout with similar navigation

**Decision:** Keep admin pages separate for now. The navigation bar in dashboard layout includes admin links when role is ADMIN, so admins can navigate to admin pages from dashboard. Admin pages can have their own simple navigation or back links if needed.

**Test Plan:**
- Visit `/admin` as ADMIN user
- Verify navigation works from dashboard to admin pages
- Verify admin page functionality unchanged

---

### 8. Integration Testing

**Test Plan:**

**Navigation Appearance:**
- [ ] Navigation appears on `/dashboard`
- [ ] Navigation appears on `/dashboard/gigs`
- [ ] Navigation appears on `/dashboard/gigs/new`
- [ ] Navigation appears on `/dashboard/gigs/[id]`
- [ ] Navigation appears on `/dashboard/profile`
- [ ] Navigation appears on `/dashboard/profile/edit`
- [ ] Navigation appears on `/dashboard/profile/[userId]`

**Role-Specific Links:**
- [ ] CLIENT sees: Dashboard, Post Gig, Browse Gigs, Profile, Sign Out
- [ ] SPECIALIST sees: Dashboard, Browse Gigs, Profile, Sign Out
- [ ] ADMIN sees: Dashboard, Moderation, Users, Gigs, Profile, Sign Out

**Active Route Highlighting:**
- [ ] `/dashboard` highlights "Dashboard" link
- [ ] `/dashboard/gigs` highlights "Browse Gigs" link
- [ ] `/dashboard/gigs/new` highlights "Post Gig" link (CLIENT only)
- [ ] `/dashboard/gigs/[id]` highlights "Browse Gigs" link
- [ ] `/dashboard/profile` highlights "Profile" link
- [ ] `/dashboard/profile/edit` highlights "Profile" link
- [ ] `/dashboard/profile/[userId]` highlights "Profile" link
- [ ] `/admin` highlights "Moderation" link (ADMIN only)
- [ ] `/admin/users` highlights "Users" link (ADMIN only)
- [ ] `/admin/gigs` highlights "Gigs" link (ADMIN only)

**Navigation Functionality:**
- [ ] Click "Dashboard" navigates to `/dashboard`
- [ ] Click "Post Gig" navigates to `/dashboard/gigs/new` (CLIENT only)
- [ ] Click "Browse Gigs" navigates to `/dashboard/gigs`
- [ ] Click "Profile" navigates to `/dashboard/profile`
- [ ] Click "Moderation" navigates to `/admin` (ADMIN only)
- [ ] Click "Users" navigates to `/admin/users` (ADMIN only)
- [ ] Click "Gigs" navigates to `/admin/gigs` (ADMIN only)
- [ ] Click "Sign Out" logs out and redirects to homepage

**Sticky Positioning:**
- [ ] Scroll down on a long page (e.g., gig detail with many messages)
- [ ] Verify navigation remains visible at top of viewport
- [ ] Verify navigation doesn't cover page content

**Back Links Removed:**
- [ ] No "Back to Gigs" link on `/dashboard/gigs/[id]`
- [ ] No standalone back links on other dashboard pages

**Accessibility:**
- [ ] Tab key moves focus through navigation links in order
- [ ] Focused links have visible focus indicator
- [ ] Enter key on focused link navigates to that route
- [ ] Screen reader announces navigation links correctly

**Responsive Design:**
- [ ] Navigation displays correctly on desktop (1920px width)
- [ ] Navigation displays correctly on tablet (768px width)
- [ ] Navigation displays correctly on mobile (375px width)
- [ ] Links wrap or stack appropriately on small screens

---

### 9. Manual Testing Steps

1. **Setup:**
   - Create test users: CLIENT, SPECIALIST, ADMIN
   - Create test gigs and applications

2. **CLIENT User Testing:**
   - Login as CLIENT
   - Visit `/dashboard` - verify navigation appears with correct links
   - Click each navigation link and verify it works
   - Verify "Dashboard" link is highlighted on dashboard
   - Navigate to gig detail page - verify no back link, navigation works
   - Verify sticky positioning by scrolling

3. **SPECIALIST User Testing:**
   - Login as SPECIALIST
   - Visit `/dashboard` - verify navigation appears (no "Post Gig" link)
   - Click each navigation link and verify it works
   - Navigate to gig detail page - verify no back link, navigation works
   - Apply to a gig - verify navigation persists

4. **ADMIN User Testing:**
   - Login as ADMIN
   - Visit `/dashboard` - verify navigation appears with admin links
   - Click "Moderation", "Users", "Gigs" links - verify they work
   - Navigate between dashboard and admin pages - verify navigation works

5. **Keyboard Navigation Testing:**
   - Use Tab key to navigate through links
   - Use Enter key to activate links
   - Verify focus indicators are visible

6. **Mobile Testing:**
   - Resize browser to mobile width (375px)
   - Verify navigation displays correctly
   - Verify all links are accessible and clickable

---

## Automated Test Plan

**Integration Tests:**

Create `__tests__/integration/dashboard-navigation.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { getTestPrismaClient } from '@/lib/test-helpers'
import { withAuthContext } from '@/lib/test-helpers'

describe('Dashboard Navigation', () => {
  const prisma = getTestPrismaClient()

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should render navigation for CLIENT user', async () => {
    // Test that CLIENT sees correct navigation links
  })

  it('should render navigation for SPECIALIST user', async () => {
    // Test that SPECIALIST sees correct navigation links
  })

  it('should render navigation for ADMIN user', async () => {
    // Test that ADMIN sees correct navigation links
  })

  it('should highlight active route', async () => {
    // Test active route detection logic
  })
})
```

**E2E Tests:**

Create `__tests__/e2e/dashboard-navigation.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Dashboard Navigation E2E', () => {
  test('CLIENT user sees correct navigation', async ({ page }) => {
    // Login as CLIENT
    // Verify navigation links appear
    // Click each link and verify navigation
  })

  test('SPECIALIST user sees correct navigation', async ({ page }) => {
    // Login as SPECIALIST
    // Verify navigation links appear (no Post Gig)
    // Click each link and verify navigation
  })

  test('Active route is highlighted', async ({ page }) => {
    // Login as user
    // Navigate to different pages
    // Verify correct link is highlighted on each page
  })

  test('Navigation is sticky on scroll', async ({ page }) => {
    // Login as user
    // Navigate to page with scrollable content
    // Scroll down
    // Verify navigation remains visible
  })

  test('Sign out works from navigation', async ({ page }) => {
    // Login as user
    // Click Sign Out in navigation
    // Verify redirect to homepage
    // Verify user is logged out
  })
})
```

---

## Acceptance Criteria Summary

- [ ] `app/dashboard/layout.tsx` created and wraps all dashboard routes
- [ ] `app/components/DashboardNav.tsx` created with role-aware navigation
- [ ] Navigation appears on all dashboard pages
- [ ] Correct links displayed for CLIENT, SPECIALIST, ADMIN roles
- [ ] Active route is visually highlighted
- [ ] Sticky positioning works (navigation stays visible on scroll)
- [ ] All standalone back links removed from dashboard pages
- [ ] Sign out functionality works from navigation
- [ ] Keyboard navigation and accessibility work correctly
- [ ] Responsive design works on mobile devices
- [ ] All existing page functionality remains unchanged
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed successfully
