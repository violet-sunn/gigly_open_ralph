# Tasks: Add Breadcrumb Navigation

## Task 1: Create Breadcrumb Component

**Implementation:**
1. Create `app/components/Breadcrumb.tsx` as a client component
2. Define TypeScript interface for breadcrumb items:
   ```typescript
   interface BreadcrumbItem {
     label: string
     href?: string
     current?: boolean
   }
   ```
3. Implement component that:
   - Accepts `items: BreadcrumbItem[]` prop
   - Renders `<nav aria-label="Breadcrumb">` wrapper
   - Maps over items to render links (with `href`) or text (current page)
   - Uses Next.js `Link` component for navigation
   - Adds "/" separator between items with `mx-2` spacing
   - Applies `aria-current="page"` to current item
4. Implement responsive behavior:
   - On desktop (md+): show all items
   - On mobile (<md): show first item + "..." + last item (if 3+ items)
   - Use Tailwind classes: `hidden md:inline` for middle items, conditional rendering for ellipsis
5. Apply design token styling:
   - Links: `text-sm text-neutral-strong hover:text-white transition-colors`
   - Current page: `text-sm text-neutral-weak`
   - Separator: `text-neutral-weak`
6. Add title truncation utility:
   - Truncate labels > 50 characters
   - Add `title` attribute with full text for tooltip

**Test Plan:**
- Unit test: Verify component renders correct number of items
- Unit test: Verify links have correct href attributes
- Unit test: Verify current item has `aria-current="page"`
- Unit test: Verify long labels are truncated
- Visual test: Check responsive behavior at different viewport widths
- Accessibility test: Verify keyboard navigation works (Tab through links)
- Accessibility test: Verify screen reader announces breadcrumb navigation

---

## Task 2: Add Breadcrumbs to Gig Detail Pages

**Implementation:**
1. Open `app/(protected)/gigs/[id]/page.tsx`
2. Import Breadcrumb component
3. Get user role from session (already available in page)
4. Build breadcrumb items array based on role:
   - SPECIALIST: `[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Browse Gigs', href: '/gigs' }, { label: gig.title, current: true }]`
   - CLIENT/ADMIN: `[{ label: 'Dashboard', href: '/dashboard' }, { label: gig.title, current: true }]`
5. Render `<Breadcrumb items={breadcrumbItems} />` above the page heading
6. Add `mb-4` or `mb-6` spacing between breadcrumb and heading

**Test Plan:**
- E2E test: Login as SPECIALIST, navigate to gig detail, verify breadcrumb shows "Dashboard > Browse Gigs > [Title]"
- E2E test: Login as CLIENT, navigate to gig detail, verify breadcrumb shows "Dashboard > [Title]"
- E2E test: Click "Dashboard" breadcrumb link, verify navigation to `/dashboard`
- E2E test: Click "Browse Gigs" breadcrumb link (as SPECIALIST), verify navigation to `/gigs`
- E2E test: Verify gig title in breadcrumb matches page heading
- Visual test: Verify breadcrumb appears above heading with correct spacing
- Responsive test: Verify breadcrumb collapses on mobile (< 768px)

---

## Task 3: Add Breadcrumbs to Profile Pages

**Implementation:**
1. **Profile view page** (`app/(protected)/profile/page.tsx`):
   - Import Breadcrumb component
   - Add breadcrumb items: `[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile', current: true }]`
   - Render above page heading

2. **Profile edit page** (`app/(protected)/profile/edit/page.tsx`):
   - Import Breadcrumb component
   - Add breadcrumb items: `[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile', href: '/profile' }, { label: 'Edit', current: true }]`
   - Render above page heading

3. **Public profile page** (`app/(protected)/profile/[userId]/page.tsx`):
   - Import Breadcrumb component
   - Get user name from existing page data (profile.user.email or profile.companyName/specialistProfile fields)
   - Add breadcrumb items: `[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile', href: '/profile' }, { label: userName, current: true }]`
   - Render above page heading

**Test Plan:**
- E2E test: Navigate to `/profile`, verify breadcrumb shows "Dashboard > Profile"
- E2E test: Navigate to `/profile/edit`, verify breadcrumb shows "Dashboard > Profile > Edit"
- E2E test: Navigate to `/profile/[userId]`, verify breadcrumb shows "Dashboard > Profile > [User Name]"
- E2E test: Click breadcrumb links, verify correct navigation
- Visual test: Verify consistent spacing across all profile pages
- Responsive test: Verify breadcrumbs collapse on mobile for 3-level paths

---

## Task 4: Add Breadcrumbs to Admin Pages

**Implementation:**
1. **Admin users page** (`app/admin/users/page.tsx`):
   - Import Breadcrumb component
   - Add breadcrumb items: `[{ label: 'Admin', href: '/admin' }, { label: 'Users', current: true }]`
   - Render above page heading

2. **Admin gigs page** (`app/admin/gigs/page.tsx`):
   - Import Breadcrumb component
   - Add breadcrumb items: `[{ label: 'Admin', href: '/admin' }, { label: 'Gigs', current: true }]`
   - Render above page heading

3. **Do NOT add breadcrumbs to** `/admin/page.tsx` (top-level admin dashboard)

**Test Plan:**
- E2E test: Login as ADMIN, navigate to `/admin/users`, verify breadcrumb shows "Admin > Users"
- E2E test: Navigate to `/admin/gigs`, verify breadcrumb shows "Admin > Gigs"
- E2E test: Click "Admin" breadcrumb link, verify navigation to `/admin`
- E2E test: Verify `/admin` page does NOT have breadcrumbs
- Visual test: Verify consistent spacing with other pages
- Responsive test: Verify breadcrumbs display correctly on mobile

---

## Task 5: Integration Testing and Accessibility Audit

**Implementation:**
1. Run full E2E test suite to verify no regressions
2. Test breadcrumb navigation flows:
   - Navigate through multiple pages using breadcrumbs
   - Verify browser back button still works correctly
   - Verify breadcrumbs update correctly on page navigation
3. Perform accessibility audit:
   - Use keyboard only to navigate breadcrumbs (Tab, Enter)
   - Test with screen reader (NVDA/JAWS/VoiceOver)
   - Verify ARIA attributes are correct
   - Check color contrast ratios meet WCAG AA standards
4. Test responsive behavior:
   - Test at 320px (mobile), 768px (tablet), 1024px (desktop)
   - Verify ellipsis appears/disappears at correct breakpoints
   - Verify touch targets are adequate on mobile (min 44x44px)

**Test Plan:**
- Run `npm run test:e2e` and verify all tests pass
- Manual test: Navigate using only keyboard, verify all breadcrumb links are accessible
- Manual test: Use screen reader, verify breadcrumb navigation is announced correctly
- Manual test: Resize browser window, verify responsive behavior at breakpoints
- Manual test: Test on mobile device (or emulator), verify touch interactions work
- Accessibility audit: Run Lighthouse or axe DevTools, verify no accessibility violations
- Visual regression test: Compare screenshots before/after breadcrumb addition

---

## Summary

This change adds breadcrumb navigation to deep pages (gig details, profile pages, admin pages) to improve user orientation and navigation efficiency. The implementation follows the design system, uses design tokens, and includes responsive behavior for mobile devices. All breadcrumbs are keyboard accessible and screen reader friendly.

**Files to create:**
- `app/components/Breadcrumb.tsx` (new component)

**Files to modify:**
- `app/(protected)/gigs/[id]/page.tsx` (add breadcrumbs)
- `app/(protected)/profile/page.tsx` (add breadcrumbs)
- `app/(protected)/profile/edit/page.tsx` (add breadcrumbs)
- `app/(protected)/profile/[userId]/page.tsx` (add breadcrumbs)
- `app/admin/users/page.tsx` (add breadcrumbs)
- `app/admin/gigs/page.tsx` (add breadcrumbs)

**Estimated effort:** 4-6 hours
- Component creation: 1-2 hours
- Page integration: 2-3 hours
- Testing and refinement: 1 hour
