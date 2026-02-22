# Implementation Tasks: Pagination for Admin Pages

## Task 1: Add pagination logic to admin users page

**Implementation:**
- Open `app/admin/users/page.tsx`
- Define constant `PAGE_SIZE = 30` at top of file
- **CRITICAL (Next.js 15):** The existing code already awaits searchParams correctly:
  ```typescript
  const searchParams = await props.searchParams
  ```
- After the existing filter extraction, add page parameter extraction and validation:
  ```typescript
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1'
  const parsedPage = parseInt(pageParam, 10)
  const page = Math.max(1, parsedPage || 1)

  // Redirect if page parameter is invalid (< 1)
  if (parsedPage < 1 || isNaN(parsedPage)) {
    const redirectParams = new URLSearchParams()
    if (roleFilter) redirectParams.set('role', roleFilter)
    if (statusFilter) redirectParams.set('status', statusFilter)
    const query = redirectParams.toString()
    redirect(`/admin/users${query ? `?${query}` : ''}`)
  }
  ```
- Build WHERE clause for filters (existing logic, no changes)
- Execute two queries in parallel:
  ```typescript
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        clientProfile: true,
        specialistProfile: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ])
  ```
- Calculate `totalPages = Math.ceil(totalCount / PAGE_SIZE)`
- Validate page is within range: if `page > totalPages && totalPages > 0`, redirect to last page
- Import `Suspense` from React and `PaginationControls` component
- Add results count above table:
  ```typescript
  {totalCount > 0 && (
    <p className="text-sm text-gray-600 mb-4">
      Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} users
    </p>
  )}
  ```
- Add pagination controls below table (after closing `</div>` of table container):
  ```typescript
  {totalPages > 1 && (
    <div className="mt-6">
      <Suspense fallback={<div className="h-10" />}>
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </Suspense>
    </div>
  )}
  ```

**Test Plan:**
- Integration test: `__tests__/integration/admin-users-pagination.test.ts`
- Test scenarios:
  1. Default page returns first 30 users
  2. Page 2 returns users 31-60
  3. Invalid page (0, negative, non-numeric) defaults to page 1
  4. Page exceeding total pages redirects to last page
  5. Pagination with role filter applies filter first
  6. Pagination with status filter applies filter first
  7. Count query matches filtered results
  8. Last page returns correct number of users (< 30 if partial)
- Assertions:
  - `users.length === 30` (or less on last page)
  - `skip` value calculated correctly: `(page-1) * 30`
  - `totalCount` matches database count with same WHERE clause
  - Redirect occurs for invalid pages

---

## Task 2: Add pagination logic to admin gigs page

**Implementation:**
- Open `app/admin/gigs/page.tsx`
- Define constant `PAGE_SIZE = 30` at top of file
- **CRITICAL (Next.js 15):** The existing code already awaits searchParams correctly:
  ```typescript
  const searchParams = await props.searchParams
  ```
- After the existing filter extraction, add page parameter extraction and validation:
  ```typescript
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1'
  const parsedPage = parseInt(pageParam, 10)
  const page = Math.max(1, parsedPage || 1)

  // Redirect if page parameter is invalid (< 1)
  if (parsedPage < 1 || isNaN(parsedPage)) {
    const redirectParams = new URLSearchParams()
    if (statusFilter) redirectParams.set('status', statusFilter)
    if (closedFilter) redirectParams.set('closed', closedFilter)
    const query = redirectParams.toString()
    redirect(`/admin/gigs${query ? `?${query}` : ''}`)
  }
  ```
- Build WHERE clause for filters (existing logic, no changes)
- Execute two queries in parallel:
  ```typescript
  const [gigs, totalCount] = await Promise.all([
    prisma.gig.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        client: {
          include: {
            clientProfile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.gig.count({ where })
  ])
  ```
- Calculate `totalPages = Math.ceil(totalCount / PAGE_SIZE)`
- Validate page is within range: if `page > totalPages && totalPages > 0`, redirect to last page
- Import `Suspense` from React and `PaginationControls` component
- Add results count above table:
  ```typescript
  {totalCount > 0 && (
    <p className="text-sm text-gray-600 mb-4">
      Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} gigs
    </p>
  )}
  ```
- Add pagination controls below table (after closing `</div>` of table container):
  ```typescript
  {totalPages > 1 && (
    <div className="mt-6">
      <Suspense fallback={<div className="h-10" />}>
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </Suspense>
    </div>
  )}
  ```

**Test Plan:**
- Integration test: `__tests__/integration/admin-gigs-pagination.test.ts`
- Test scenarios:
  1. Default page returns first 30 gigs
  2. Page 2 returns gigs 31-60
  3. Invalid page (0, negative, non-numeric) defaults to page 1
  4. Page exceeding total pages redirects to last page
  5. Pagination with status filter applies filter first
  6. Pagination with closed filter applies filter first
  7. Count query matches filtered results
  8. Last page returns correct number of gigs (< 30 if partial)
- Assertions:
  - `gigs.length === 30` (or less on last page)
  - `skip` value calculated correctly: `(page-1) * 30`
  - `totalCount` matches database count with same WHERE clause
  - Redirect occurs for invalid pages

---

## Task 3: Verify filter forms reset pagination

**Implementation:**
- Open `app/admin/users/UserFilters.tsx`
- Verify filter form submission does NOT include `page` parameter
- When filters change, URL should be `/admin/users?role=X` (no `page=1`)
- This naturally resets to page 1 due to default behavior
- No code changes needed if form already excludes page param

- Open `app/admin/gigs/GigFilters.tsx`
- Verify filter form submission does NOT include `page` parameter
- When filters change, URL should be `/admin/gigs?status=X` (no `page=1`)
- This naturally resets to page 1 due to default behavior
- No code changes needed if form already excludes page param

**Test Plan:**
- Integration test: `__tests__/integration/admin-filtering-pagination.test.ts`
- Test scenarios:
  1. Admin on page 3 of users changes role filter → redirects to page 1
  2. Admin on page 2 of users changes status filter → redirects to page 1
  3. Admin on page 3 of gigs changes status filter → redirects to page 1
  4. Admin on page 2 of gigs changes closed filter → redirects to page 1
  5. URL after filter change does not include `page` parameter
- Assertions:
  - After filter change, URL does not contain `page=`
  - After filter change, first 30 records are displayed

---

## Task 4: Add integration tests for admin pagination

**Implementation:**
- Create `__tests__/integration/admin-users-pagination.test.ts`
- Create `__tests__/integration/admin-gigs-pagination.test.ts`
- Use existing test helpers (getTestPrismaClient, withAuthContext, createTestUser)
- Create ADMIN user for authentication context
- Seed test data (60+ users, 60+ gigs)
- Test all scenarios from Task 1 and Task 2

**Test Plan:**
- Run integration tests:
  ```bash
  npm run test:unit -- __tests__/integration/admin-users-pagination.test.ts
  npm run test:unit -- __tests__/integration/admin-gigs-pagination.test.ts
  ```
- Expected: All tests pass (8 tests per file, 16 total)

---

## Task 5: Add E2E tests for admin pagination

**Implementation:**
- Create `__tests__/e2e/admin-pagination.spec.ts`
- Use Playwright to test full admin flow
- Seed test database with 90 users (3 pages) and 90 gigs (3 pages)
- Create ADMIN user and authenticate via session cookie

**Test Plan:**
- E2E test scenarios:
  1. **Navigate through user pages:**
     - Visit `/admin/users`
     - Verify first 30 users displayed
     - Click "Next" button
     - Verify URL is `/admin/users?page=2`
     - Verify users 31-60 displayed
     - Click "Previous" button
     - Verify back on page 1
  2. **Navigate through gig pages:**
     - Visit `/admin/gigs`
     - Verify first 30 gigs displayed
     - Click "Next" button
     - Verify URL is `/admin/gigs?page=2`
     - Verify gigs 31-60 displayed
  3. **Pagination with filters (users):**
     - Apply role filter "CLIENT"
     - Verify pagination resets to page 1
     - Navigate to page 2 of filtered results
     - Verify URL includes both filter and page params
     - Change filter
     - Verify pagination resets to page 1
  4. **Pagination with filters (gigs):**
     - Apply status filter "OPEN"
     - Verify pagination resets to page 1
     - Navigate to page 2 of filtered results
     - Verify URL includes both filter and page params
  5. **Invalid page handling:**
     - Visit `/admin/users?page=999`
     - Verify redirect to last valid page
     - Visit `/admin/gigs?page=0`
     - Verify redirect to page 1
  6. **Browser navigation:**
     - Navigate page 1 → page 2 → page 3
     - Click browser back button twice
     - Verify on page 1
     - Click browser forward button
     - Verify on page 2
- Assertions:
  - `await expect(page).toHaveURL(/page=2/)`
  - `await expect(page.locator('[aria-current="page"]')).toHaveText('2')`
  - `await expect(page.locator('tbody tr')).toHaveCount(30)`
  - `await expect(page.locator('text=Showing 31-60 of 90')).toBeVisible()`

---

## Task 6: Update documentation

**Implementation:**
- Update `openspec/project.md` "Current State" section:
  - Update "User and gig management pages with filtering" to "User and gig management pages with filtering and pagination (30 items per page)"
- Update `openspec/project.md` "Completed Changes" section:
  - Add entry: "**pagination-admin-pages** — Offset-based pagination on admin user management and gig management pages with 30 items per page, page number navigation, filter integration, and URL-based state management. Reuses existing PaginationControls component for consistency."

**Test Plan:**
- Manual verification:
  - Read updated documentation
  - Verify accuracy of descriptions
  - Ensure no typos or formatting issues

---

## Task 7: Manual testing and performance validation

**Implementation:**
- Seed development database with 150+ users and 150+ gigs
- Test pagination manually in browser as ADMIN:
  - Navigate through all pages on both admin pages
  - Test filter combinations with pagination
  - Test edge cases (page 1, last page, invalid pages)
  - Test browser back/forward navigation
  - Test keyboard navigation (Tab, Enter)
  - Test with screen reader (VoiceOver/NVDA)
- Measure performance:
  - Use browser DevTools Network tab
  - Measure page load time with 150+ records (should be < 1s)
  - Measure database query time (should be < 100ms)
  - Compare to non-paginated version

**Test Plan:**
- Manual test checklist:
  - [ ] Pagination controls render correctly on both pages
  - [ ] Previous/Next buttons work
  - [ ] Page number buttons work
  - [ ] Current page highlighted
  - [ ] Results count accurate
  - [ ] Filters work with pagination on users page
  - [ ] Filters work with pagination on gigs page
  - [ ] Invalid pages redirect correctly
  - [ ] URLs are bookmarkable
  - [ ] Browser back/forward works
  - [ ] Keyboard accessible
  - [ ] Screen reader accessible
  - [ ] Page load time < 1s with 150+ records
  - [ ] No console errors or warnings
  - [ ] Suspend/unsuspend actions work on paginated pages
  - [ ] Close gig action works on paginated pages

---

## Summary

**Total tasks:** 7
**Estimated effort:** 4-6 hours
**Critical path:** Tasks 1-2 (core functionality)
**Testing coverage:** Integration tests, E2E tests, manual testing

**Dependencies:**
- Existing `PaginationControls` component (already implemented)
- Existing admin filter components (UserFilters, GigFilters)
- Existing Prisma, Next.js, Tailwind setup

**Rollout plan:**
1. Implement tasks 1-2 (core functionality)
2. Verify task 3 (filter forms)
3. Run tasks 4-5 (testing)
4. Update task 6 (documentation)
5. Perform task 7 (manual validation)
6. Deploy to staging for QA
7. Deploy to production after approval
