# Implementation Tasks: Contextual Back Buttons

## Task 1: Fix Navigation Highlighting Bug

**Description:** Update the `DashboardNav` component to correctly highlight tabs based on navigation context, not just URL path matching. This fixes the bug where "Browse Gigs" is incorrectly highlighted when viewing a gig detail page from the dashboard.

**Implementation Notes:**
- Modify file: `app/components/DashboardNav.tsx`
- Import `useSearchParams` from `next/navigation`
- Read the `from` query parameter to determine navigation context
- Update the `isActive` function to handle gig detail pages specially:
  ```tsx
  const searchParams = useSearchParams()
  const from = searchParams.get('from')

  const isActive = (path: string) => {
    // Special handling for gig detail pages
    if (pathname.startsWith('/dashboard/gigs/') && pathname !== '/dashboard/gigs' && pathname !== '/dashboard/gigs/new') {
      // We're on a gig detail page
      if (path === '/dashboard') {
        return from === 'dashboard'
      }
      if (path === '/dashboard/gigs') {
        return from === 'browse'
      }
      return false
    }

    // Original logic for other pages
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }
  ```
- Ensure the component remains a client component (`'use client'`)
- **CRITICAL - Next.js Suspense Requirement**: Modify `app/dashboard/layout.tsx` to wrap `<DashboardNav>` in a Suspense boundary:
  ```tsx
  import { Suspense } from 'react'

  // In the return statement:
  <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
    <DashboardNav userEmail={session.email} userRole={session.role} />
  </Suspense>
  ```
  This is required because `useSearchParams()` causes the component to need client-side rendering, and without Suspense, the entire route will de-opt to client-side rendering during build.
- Test that existing navigation highlighting still works for all other pages

**Test Plan:**
- Manual testing:
  1. Login as CLIENT user
  2. Navigate to `/dashboard`
  3. Click a gig from "My Gigs" (should have `?from=dashboard`)
  4. Verify "Dashboard" tab is highlighted (blue border)
  5. Verify "Browse Gigs" tab is NOT highlighted
  6. Navigate to `/dashboard/gigs`
  7. Click a gig from the list (should have `?from=browse`)
  8. Verify "Browse Gigs" tab is highlighted
  9. Verify "Dashboard" tab is NOT highlighted
  10. Navigate directly to `/dashboard/gigs/[any-id]` (no query params)
  11. Verify no tab is highlighted (or Dashboard as fallback)
  12. Test all other pages (profile, gig creation, etc.) to ensure no regressions
- Login as SPECIALIST user and repeat similar tests
- Verify no console errors or warnings

---

## Task 2: Create BackButton Component

**Description:** Create a reusable `BackButton` component that renders a contextual back link based on navigation context query parameters.

**Implementation Notes:**
- Create new file: `app/components/BackButton.tsx`
- Component should be a client component (`'use client'`) to access `useSearchParams`
- **IMPORTANT**: This component uses `useSearchParams()` and MUST be wrapped in `<Suspense>` boundary when used (see Task 3)
- Props: None (reads from URL search params directly)
- Read `from` param and any preserved params (search, tags, page, tab, etc.)
- Render different text based on `from` value:
  - `from=dashboard` → "← Back to Dashboard"
  - `from=browse` → "← Back to Browse Gigs"
  - No `from` param → return null (don't render)
- Construct destination URL:
  - For `from=dashboard`: `/dashboard` (no additional params needed for now)
  - For `from=browse`: `/dashboard/gigs` + preserve all other query params (search, tags, minBudget, maxBudget, sort, page)
- Use Next.js `<Link>` component for navigation
- Style with Tailwind: text-sm, text-blue-600, hover:text-blue-800, flex items-center gap-1
- Include left arrow character: `←` or use an SVG icon
- Add hover affordance and keyboard accessibility

**Test Plan:**
- Manual testing:
  1. Navigate to `/dashboard/gigs/[any-gig-id]?from=dashboard`
  2. Verify back button appears with "← Back to Dashboard" text
  3. Click button, verify navigation to `/dashboard`
  4. Navigate to `/dashboard/gigs/[any-gig-id]?from=browse&search=react&page=2`
  5. Verify back button appears with "← Back to Browse Gigs" text
  6. Click button, verify navigation to `/dashboard/gigs?search=react&page=2`
  7. Navigate to `/dashboard/gigs/[any-gig-id]` (no query params)
  8. Verify back button does NOT appear
- Keyboard testing:
  1. Tab to back button, verify focus ring appears
  2. Press Enter, verify navigation works
- Screen reader testing:
  1. Verify button text is announced correctly

---

## Task 3: Integrate BackButton into Gig Detail Page

**Description:** Add the `BackButton` component to the gig detail page layout, positioned above the main gig card.

**Implementation Notes:**
- Modify file: `app/dashboard/gigs/[id]/page.tsx`
- Import `BackButton` component and `Suspense` from React
- **CRITICAL - Suspense Boundary Required**: Wrap `<BackButton />` in Suspense to prevent client-side rendering de-opt:
  ```tsx
  import { Suspense } from 'react'
  import { BackButton } from '@/app/components/BackButton'

  // In the JSX, before the main gig card:
  <div className="mb-4">
    <Suspense fallback={<div className="h-8" />}>
      <BackButton />
    </Suspense>
  </div>
  ```
- Position before the main gig card (before the `<div className="bg-white rounded-lg shadow-md p-6 space-y-4">`)
- Ensure it's within the same max-width container as the rest of the content
- No changes to existing gig detail logic

**Test Plan:**
- Manual testing:
  1. Navigate to any gig detail page with `?from=dashboard`
  2. Verify back button appears above the gig title card
  3. Verify spacing looks correct (not too cramped, not too far)
  4. Test on mobile viewport (320px width), verify button is visible and clickable
  5. Navigate to gig detail without query params, verify no layout shift
- Visual regression:
  1. Compare page layout before/after on desktop and mobile
  2. Verify no unintended spacing changes to existing elements

---

## Task 4: Update Client Dashboard Gig Links

**Description:** Modify client dashboard to include `?from=dashboard` query parameter in all gig links.

**Implementation Notes:**
- Modify file: `app/dashboard/page.tsx`
- Find the gig link in the CLIENT dashboard section (line ~105):
  ```tsx
  <Link href={`/dashboard/gigs/${gig.id}`} ...>
  ```
- Change to:
  ```tsx
  <Link href={`/dashboard/gigs/${gig.id}?from=dashboard`} ...>
  ```
- No other changes needed

**Test Plan:**
- Manual testing:
  1. Login as CLIENT user
  2. Navigate to `/dashboard`
  3. Inspect a gig link in "My Gigs" section (right-click → Inspect or hover to see URL)
  4. Verify URL includes `?from=dashboard` query parameter
  5. Click a gig link
  6. Verify navigation to gig detail page with query param
  7. Verify back button appears and works correctly
- Integration test (optional):
  1. Write test that renders client dashboard
  2. Assert gig links include `?from=dashboard` in href attribute

---

## Task 5: Update Specialist Dashboard for Tab Restoration and Context Links

**Description:** Modify specialist dashboard to restore tab state from URL query params and include navigation context in all gig links.

**Implementation Notes:**
- Modify file: `app/dashboard/SpecialistDashboardTabs.tsx`
- Add `'use client'` directive if not already present
- Import `useSearchParams` from `next/navigation`
- Read `tab` query param on component mount:
  ```tsx
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as 'active' | 'pending' | 'archive' | null
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'archive'>(
    initialTab && ['active', 'pending', 'archive'].includes(initialTab) ? initialTab : 'active'
  )
  ```
- Update all gig links in Active Work tab to include `?from=dashboard&tab=active`
- Update all gig links in Pending Applications tab to include `?from=dashboard&tab=pending`
- Update all gig links in Archive tab to include `?from=dashboard&tab=archive`
- Example:
  ```tsx
  <Link href={`/dashboard/gigs/${gig.id}?from=dashboard&tab=active`}>
  ```
- **CRITICAL - Next.js Suspense Requirement**: Modify `app/dashboard/page.tsx` to wrap `<SpecialistDashboardTabs>` in a Suspense boundary:
  ```tsx
  import { Suspense } from 'react'

  // In the SPECIALIST section of the return statement:
  <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded" />}>
    <SpecialistDashboardTabs activeGigs={activeGigs} applications={applications} />
  </Suspense>
  ```
  This is required because the component now uses `useSearchParams()` to read the tab parameter. Without Suspense, the entire route will de-opt to client-side rendering during build.

**Test Plan:**
- Manual testing:
  1. Login as SPECIALIST user
  2. Navigate to `/dashboard`
  3. Verify Active Work tab is selected by default
  4. Click Pending Applications tab
  5. Inspect a gig link, verify URL includes `?from=dashboard&tab=pending`
  6. Click a gig link
  7. Verify back button appears with "← Back to Dashboard"
  8. Click back button
  9. Verify navigation to `/dashboard` and Pending Applications tab is still selected
  10. Repeat for Archive tab
  11. Navigate directly to `/dashboard?tab=archive`
  12. Verify Archive tab is selected on page load
  13. Navigate to `/dashboard?tab=invalid`
  14. Verify Active Work tab is selected (graceful fallback)
- Integration test:
  1. Test that component reads tab param correctly
  2. Test that invalid tab values default to 'active'

---

## Task 6: Update Browse Gigs Page Links to Include Context

**Description:** Modify browse gigs page to include `?from=browse` and preserve all existing filter/pagination params in gig links.

**Implementation Notes:**
- Modify file: `app/dashboard/gigs/page.tsx`
- Find the gig link rendering (line ~159):
  ```tsx
  <Link href={`/dashboard/gigs/${gig.id}`} ...>
  ```
- Construct URL with preserved params:
  ```tsx
  const gigDetailParams = new URLSearchParams()
  gigDetailParams.set('from', 'browse')
  if (search) gigDetailParams.set('search', search)
  if (tagsParam) gigDetailParams.set('tags', tagsParam)
  if (minBudgetParam) gigDetailParams.set('minBudget', minBudgetParam)
  if (maxBudgetParam) gigDetailParams.set('maxBudget', maxBudgetParam)
  if (sort !== 'newest') gigDetailParams.set('sort', sort)
  if (page > 1) gigDetailParams.set('page', page.toString())

  const gigDetailUrl = `/dashboard/gigs/${gig.id}?${gigDetailParams.toString()}`
  ```
- Update Link href to use `gigDetailUrl`
- Consider extracting this logic to a helper function if it makes the component cleaner

**Test Plan:**
- Manual testing:
  1. Navigate to `/dashboard/gigs`
  2. Inspect a gig link, verify URL includes `?from=browse`
  3. Click a gig, verify back button works
  4. Navigate to `/dashboard/gigs?search=react&tags=TypeScript&page=2`
  5. Inspect a gig link, verify URL includes all params: `?from=browse&search=react&tags=TypeScript&page=2`
  6. Click a gig
  7. Verify back button appears
  8. Click back button
  9. Verify navigation to `/dashboard/gigs?search=react&tags=TypeScript&page=2`
  10. Verify filters and pagination are preserved (search box shows "react", TypeScript tag is selected, page 2 is active)
- Edge cases:
  1. Test with special characters in search query (spaces, quotes, etc.)
  2. Verify URL encoding is correct

---

## Task 7: End-to-End Testing and Polish

**Description:** Perform comprehensive end-to-end testing of all navigation flows and polish any UX issues.

**Implementation Notes:**
- Test all user flows:
  1. CLIENT: Dashboard → Gig Detail → Back to Dashboard
  2. SPECIALIST: Dashboard (Active Work) → Gig Detail → Back to Dashboard (Active Work tab)
  3. SPECIALIST: Dashboard (Pending) → Gig Detail → Back to Dashboard (Pending tab)
  4. SPECIALIST: Dashboard (Archive) → Gig Detail → Back to Dashboard (Archive tab)
  5. Browse Gigs (no filters) → Gig Detail → Back to Browse Gigs
  6. Browse Gigs (with filters) → Gig Detail → Back to Browse Gigs (filters preserved)
- Test navigation highlighting fix:
  1. Verify "Dashboard" tab is highlighted when viewing gig from dashboard
  2. Verify "Browse Gigs" tab is highlighted when viewing gig from browse page
  3. Verify no incorrect highlighting on gig detail pages
  4. Verify all other pages still have correct navigation highlighting
- Check for visual consistency:
  - Back button styling matches the rest of the UI
  - Navigation highlighting is clear and unambiguous
  - Spacing is consistent across all pages
  - Mobile responsiveness is maintained
- Check for accessibility:
  - Keyboard navigation works
  - Screen reader announces back button correctly
  - Focus management is correct
- Performance check:
  - No unnecessary re-renders
  - No console errors or warnings

**Test Plan:**
- **CRITICAL - Verify Suspense Boundaries**: Run `npm run build` and verify:
  1. No build warnings about `useSearchParams()` causing client-side rendering
  2. No errors about missing Suspense boundaries
  3. Build completes successfully without de-opt warnings
- Execute all manual test scenarios from Tasks 1-6
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices (iOS Safari, Chrome Android)
- Run existing test suite to ensure no regressions:
  ```bash
  npm test
  npm run test:e2e
  ```
- Check for console errors in browser DevTools
- Verify no TypeScript errors:
  ```bash
  npm run type-check
  ```

---

## Summary

**Total Tasks:** 7

**Estimated Effort:**
- Task 1: 1 hour (fix navigation highlighting bug)
- Task 2: 1-2 hours (component creation + testing)
- Task 3: 30 minutes (integration)
- Task 4: 15 minutes (simple link update)
- Task 5: 1 hour (tab restoration logic + link updates)
- Task 6: 1 hour (URL construction with params)
- Task 7: 1-2 hours (comprehensive testing)

**Total:** 6-8 hours

**Dependencies:**
- Task 1 can be done independently (fixes existing bug)
- Task 3 depends on Task 2
- Tasks 1, 4, 5, 6 can be done in parallel after Task 3
- Task 7 depends on all previous tasks

**Risk Areas:**
- **Suspense boundaries**: Missing Suspense wrappers will cause Next.js build errors and client-side rendering de-opt
- Navigation highlighting logic complexity (ensure no regressions on other pages)
- URL encoding edge cases (special characters in search queries)
- Tab restoration timing (ensure query params are read before initial render)
- Mobile layout (ensure back button doesn't break responsive design)
- Client component hydration (useSearchParams in multiple components)
