# Implementation Tasks: Pagination for Gig Browsing

## Task 1: Add pagination logic to gig browse page server component

**Implementation:**
- Open `app/dashboard/gigs/page.tsx`
- Define constant `PAGE_SIZE = 25` at top of file
- **CRITICAL (Next.js 15):** Await searchParams before reading properties:
  ```typescript
  const params = await searchParams
  const pageParam = params?.page || '1'
  ```
- Parse and validate page number:
  ```typescript
  const page = Math.max(1, parseInt(pageParam, 10) || 1)
  ```
- Build WHERE clause for filters (existing logic, no changes)
- Execute two queries in parallel:
  ```typescript
  const [gigs, totalCount] = await Promise.all([
    prisma.gig.findMany({
      where: whereClause,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: orderByClause,
      include: { client: true }
    }),
    prisma.gig.count({ where: whereClause })
  ])
  ```
- Calculate `totalPages = Math.ceil(totalCount / PAGE_SIZE)`
- Validate page is within range: if `page > totalPages && totalPages > 0`, redirect to last page
- Pass `page`, `totalPages`, `totalCount` to component for rendering

**Test Plan:**
- Unit test: `__tests__/integration/gig-pagination.test.ts`
- Test scenarios:
  1. Default page (no param) returns first 25 gigs
  2. Page 2 returns gigs 26-50
  3. Invalid page (0, negative, non-numeric) defaults to page 1
  4. Page exceeding total pages redirects to last page
  5. Pagination with filters applies filters first
  6. Count query matches filtered results
  7. Last page returns correct number of gigs (< 25 if partial)
- Assertions:
  - `gigs.length === 25` (or less on last page)
  - `skip` value calculated correctly: `(page-1) * 25`
  - `totalCount` matches database count with same WHERE clause
  - Redirect occurs for invalid pages

---

## Task 2: Create PaginationControls component

**Implementation:**
- Create `app/components/PaginationControls.tsx` as client component (`'use client'`)
- **CRITICAL (Next.js 15 RSC):** Import hooks to read URL state inside client component:
  ```typescript
  import { useSearchParams, usePathname } from 'next/navigation'
  ```
- Define props interface (NO searchParams or baseUrl props):
  ```typescript
  interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    totalCount: number
  }
  ```
- Inside component, read current URL state:
  ```typescript
  const searchParams = useSearchParams()
  const pathname = usePathname()
  ```
- Implement helper function to build page URLs:
  ```typescript
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }
  ```
- Implement page number range logic:
  - If totalPages <= 7: show all pages
  - Else: show current ± 2, first, last, with ellipsis for gaps
- Render structure:
  - `<nav role="navigation" aria-label="Pagination">`
  - Results count: "Showing X-Y of Z gigs"
  - Previous button (Link or disabled span)
  - Page number buttons (Link for non-current, span for current)
  - Next button (Link or disabled span)
- Styling: Tailwind classes consistent with existing design
- Accessibility: aria-labels, aria-current, aria-disabled

**Test Plan:**
- Unit test: `__tests__/unit/pagination-controls.test.tsx`
- Test scenarios:
  1. Previous button disabled on page 1
  2. Next button disabled on last page
  3. Current page has aria-current="page"
  4. Page numbers display correctly (ellipsis logic)
  5. URLs preserve filter parameters
  6. Results count calculates correctly
  7. Single page (totalPages=1) renders no controls
- Use React Testing Library to render component
- Assertions:
  - `screen.getByLabelText('Previous page')` has `aria-disabled="true"` on page 1
  - `screen.getByLabelText('Next page')` has `aria-disabled="true"` on last page
  - `screen.getByLabelText('Current page, page 3')` exists when currentPage=3
  - Link hrefs include filter params: `expect(link.href).toContain('search=react')`

---

## Task 3: Integrate PaginationControls into gig browse page

**Implementation:**
- Open `app/dashboard/gigs/page.tsx`
- Import `PaginationControls` component and `Suspense` from React:
  ```typescript
  import { Suspense } from 'react'
  import PaginationControls from '@/app/components/PaginationControls'
  ```
- After gig list rendering, conditionally render pagination wrapped in Suspense:
  ```typescript
  {totalPages > 1 && (
    <Suspense fallback={<div className="h-10" />}>
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </Suspense>
  )}
  ```
- **CRITICAL (Next.js 15 Best Practice):** Suspense boundary is required because PaginationControls uses `useSearchParams()` hook
- Fallback maintains layout height to prevent layout shift during hydration
- **Note:** No baseUrl or searchParams props needed - component reads URL state via hooks internally
- Add results count above or below gig list:
  ```typescript
  <p className="text-sm text-gray-600 mb-4">
    Showing {(page-1)*PAGE_SIZE + 1}-{Math.min(page*PAGE_SIZE, totalCount)} of {totalCount} gigs
  </p>
  ```
- Ensure existing filter UI (search, tags, sort) remains unchanged
- Test that filter changes reset to page 1 (handled by form submission)

**Test Plan:**
- Integration test: `__tests__/integration/gig-browse-pagination.test.ts`
- Test scenarios:
  1. Page renders with pagination controls when > 25 gigs
  2. Page renders without pagination controls when <= 25 gigs
  3. Results count displays correctly
  4. Clicking "Next" navigates to page 2
  5. Clicking page number navigates to that page
  6. Filter changes reset to page 1
- Use test database with 60 gigs seeded
- Assertions:
  - `screen.getByRole('navigation', { name: 'Pagination' })` exists when totalPages > 1
  - `screen.queryByRole('navigation', { name: 'Pagination' })` is null when totalPages === 1
  - `screen.getByText(/Showing 1-25 of 60 gigs/)` exists on page 1
  - `screen.getByText(/Showing 26-50 of 60 gigs/)` exists on page 2

---

## Task 4: Update filter form to reset pagination

**Implementation:**
- Open `app/dashboard/gigs/page.tsx` (or filter component if extracted)
- Ensure filter form submission does NOT include `page` parameter
- When filters change, URL should be `/dashboard/gigs?search=X&tags=Y` (no `page=1`)
- This naturally resets to page 1 due to default behavior
- No code changes needed if form already excludes page param

**Test Plan:**
- Integration test: `__tests__/integration/gig-filtering-pagination.test.ts`
- Test scenarios:
  1. User on page 3 changes search query → redirects to page 1
  2. User on page 2 changes tags → redirects to page 1
  3. User on page 2 changes sort → redirects to page 1
  4. URL after filter change does not include `page` parameter
- Assertions:
  - After filter change, `window.location.href` does not contain `page=`
  - After filter change, first 25 gigs are displayed (not gigs 26-50)

---

## Task 5: Add E2E tests for pagination flow

**Implementation:**
- Create `__tests__/e2e/gig-pagination.spec.ts`
- Use Playwright to test full user flow
- Seed test database with 60 gigs (3 pages)

**Test Plan:**
- E2E test scenarios:
  1. **Navigate through pages:**
     - Visit `/dashboard/gigs`
     - Verify first 25 gigs displayed
     - Click "Next" button
     - Verify URL is `/dashboard/gigs?page=2`
     - Verify gigs 26-50 displayed
     - Click "Previous" button
     - Verify back on page 1
  2. **Direct page navigation:**
     - Visit `/dashboard/gigs?page=2` directly
     - Verify page 2 loads correctly
     - Verify pagination controls show page 2 as active
  3. **Invalid page handling:**
     - Visit `/dashboard/gigs?page=999`
     - Verify redirect to last valid page
     - Visit `/dashboard/gigs?page=0`
     - Verify redirect to page 1
  4. **Pagination with filters:**
     - Apply search filter "React"
     - Verify pagination resets to page 1
     - Navigate to page 2 of filtered results
     - Verify URL includes both filter and page params
     - Change filter
     - Verify pagination resets to page 1
  5. **Bookmarking:**
     - Navigate to `/dashboard/gigs?search=react&page=2`
     - Bookmark page (store URL)
     - Navigate away
     - Return to bookmarked URL
     - Verify same filtered results on page 2 displayed
  6. **Browser navigation:**
     - Navigate page 1 → page 2 → page 3
     - Click browser back button twice
     - Verify on page 1
     - Click browser forward button
     - Verify on page 2
- Assertions:
  - `await expect(page).toHaveURL(/page=2/)`
  - `await expect(page.locator('[aria-current="page"]')).toHaveText('2')`
  - `await expect(page.locator('.gig-card')).toHaveCount(25)`
  - `await expect(page.locator('text=Showing 26-50 of 60 gigs')).toBeVisible()`

---

## Task 6: Update documentation

**Implementation:**
- Update `openspec/project.md` "Current State" section:
  - Add "Pagination on gig browsing page (25 gigs per page)" to Implemented list
  - Remove "Pagination on gig browsing" from "Not Yet Implemented" list
- Update `openspec/project.md` "Completed Changes" section:
  - Add entry: "**pagination-gig-browsing** — Offset-based pagination on gig browse page with 25 gigs per page, page number navigation, filter integration, and URL-based state management for bookmarkability."

**Test Plan:**
- Manual verification:
  - Read updated documentation
  - Verify accuracy of descriptions
  - Ensure no typos or formatting issues

---

## Task 7: Manual testing and performance validation

**Implementation:**
- Seed development database with 150+ gigs
- Test pagination manually in browser:
  - Navigate through all pages
  - Test filter combinations with pagination
  - Test sort options with pagination
  - Test edge cases (page 1, last page, invalid pages)
  - Test on mobile viewport (responsive design)
  - Test keyboard navigation (Tab, Enter)
  - Test with screen reader (VoiceOver/NVDA)
- Measure performance:
  - Use browser DevTools Network tab
  - Measure page load time with 150 gigs (should be < 1s)
  - Measure database query time (should be < 100ms)
  - Compare to non-paginated version (if available)

**Test Plan:**
- Manual test checklist:
  - [ ] Pagination controls render correctly
  - [ ] Previous/Next buttons work
  - [ ] Page number buttons work
  - [ ] Current page highlighted
  - [ ] Results count accurate
  - [ ] Filters work with pagination
  - [ ] Sort works with pagination
  - [ ] Invalid pages redirect correctly
  - [ ] URLs are bookmarkable
  - [ ] Browser back/forward works
  - [ ] Mobile responsive
  - [ ] Keyboard accessible
  - [ ] Screen reader accessible
  - [ ] Page load time < 1s with 150+ gigs
  - [ ] No console errors or warnings

---

## Summary

**Total tasks:** 7
**Estimated effort:** 6-8 hours
**Critical path:** Tasks 1-3 (core functionality)
**Testing coverage:** Unit tests, integration tests, E2E tests, manual testing

**Dependencies:**
- No external dependencies required
- Uses existing Prisma, Next.js, Tailwind setup
- Compatible with existing filter/search/sort logic

**Rollout plan:**
1. Implement tasks 1-3 (core functionality)
2. Run tasks 4-5 (testing)
3. Verify task 6 (documentation)
4. Perform task 7 (manual validation)
5. Deploy to staging for QA
6. Deploy to production after approval
