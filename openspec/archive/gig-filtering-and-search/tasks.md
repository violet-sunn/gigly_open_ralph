# Implementation Tasks: Gig Filtering & Search

## Task 1: Create GigFilters Client Component

**Implementation:**
- Create `app/dashboard/gigs/components/GigFilters.tsx` as a `'use client'` component
- Import `useRouter`, `useSearchParams` from `next/navigation`
- Import `useState` from React for local form state
- Define form state interface:
  ```typescript
  interface FilterState {
    search: string
    tags: string[]
    minBudget: string
    maxBudget: string
    sort: string
  }
  ```
- Initialize state from URL searchParams on component mount
- Render form with:
  - Text input for search (controlled)
  - Checkboxes for tags: React, Python, TypeScript, Node.js, Go, Rust, Docker, Kubernetes (controlled)
  - Number inputs for minBudget and maxBudget (controlled)
  - Select dropdown for sort: newest (default), budget-desc, budget-asc (controlled)
  - "Apply Filters" button (type="button", onClick handler)
  - "Clear Filters" button (type="button", onClick handler)
- Implement `handleApplyFilters`:
  - Create URLSearchParams from current state
  - Only add non-empty values to params
  - Call `router.push('/dashboard/gigs?' + params.toString())`
- Implement `handleClearFilters`:
  - Reset all state to empty/default values
  - Call `router.push('/dashboard/gigs')`
- Style with Tailwind CSS matching existing patterns (bg-white, rounded-lg, shadow-md, p-6)

**Test Plan:**
1. Navigate to `/dashboard/gigs`
2. Verify filter panel renders with all controls
3. Enter search text "React", click "Apply Filters"
   - Assert URL updates to `/dashboard/gigs?search=React`
4. Select tag "Python", set minBudget=50000, click "Apply Filters"
   - Assert URL updates to `/dashboard/gigs?search=React&tags=Python&minBudget=50000`
5. Click "Clear Filters"
   - Assert URL updates to `/dashboard/gigs`
   - Assert all form inputs are cleared
6. Navigate to `/dashboard/gigs?search=backend&tags=Python,Go&sort=budget-desc`
   - Assert search input shows "backend"
   - Assert Python and Go checkboxes are checked
   - Assert sort dropdown shows "Highest Budget"

---

## Task 2: Update Gig Browse Page with Filter Logic

**Implementation:**
- Modify `app/dashboard/gigs/page.tsx` to accept searchParams prop:
  ```typescript
  export default async function GigBrowsePage({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  })
  ```
- Extract filter parameters from searchParams:
  ```typescript
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const tagsParam = typeof searchParams.tags === 'string' ? searchParams.tags : undefined
  const tags = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : []
  const minBudgetParam = typeof searchParams.minBudget === 'string' ? searchParams.minBudget : undefined
  const minBudget = minBudgetParam ? parseInt(minBudgetParam, 10) : undefined
  const maxBudgetParam = typeof searchParams.maxBudget === 'string' ? searchParams.maxBudget : undefined
  const maxBudget = maxBudgetParam ? parseInt(maxBudgetParam, 10) : undefined
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest'
  ```
- Build dynamic Prisma where clause with nested AND/OR:
  ```typescript
  const andConditions: any[] = [{ status: 'OPEN' }]

  // Text search: title OR description
  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  }

  // Tag filtering: tag1 OR tag2 OR tag3
  if (tags.length > 0) {
    andConditions.push({
      OR: tags.map(tag => ({ tags: { contains: tag } }))
    })
  }

  // Budget range: combine min and max into single condition
  const budgetCondition: any = {}
  if (minBudget && !isNaN(minBudget) && minBudget > 0) {
    budgetCondition.gte = minBudget * 100
  }
  if (maxBudget && !isNaN(maxBudget) && maxBudget > 0) {
    budgetCondition.lte = maxBudget * 100
  }
  if (Object.keys(budgetCondition).length > 0) {
    andConditions.push({ budget: budgetCondition })
  }

  const where = { AND: andConditions }
  ```
- Build dynamic orderBy:
  ```typescript
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'budget-desc') orderBy = { budget: 'desc' }
  if (sort === 'budget-asc') orderBy = { budget: 'asc' }
  ```
- Update Prisma query:
  ```typescript
  const gigs = await prisma.gig.findMany({
    where,
    orderBy,
    include: { client: { select: { email: true } } },
  })
  ```
- Update empty state message to distinguish between "no open gigs" and "no results match filters"
- Import and render `<GigFilters />` component above the gig list

**Test Plan:**
1. Start dev server: `npm run dev`
2. Navigate to `/dashboard/gigs` (no filters)
   - Assert all OPEN gigs are displayed, sorted by newest first
3. Navigate to `/dashboard/gigs?search=React`
   - Assert only gigs with "React" in title or description are shown
4. Navigate to `/dashboard/gigs?tags=Python`
   - Assert only gigs with "Python" in tags are shown
5. Navigate to `/dashboard/gigs?tags=Python,TypeScript`
   - Assert gigs with "Python" OR "TypeScript" in tags are shown
6. Navigate to `/dashboard/gigs?minBudget=100000`
   - Assert only gigs with budget >= 10000000 kopecks are shown
7. Navigate to `/dashboard/gigs?maxBudget=50000`
   - Assert only gigs with budget <= 5000000 kopecks are shown
8. Navigate to `/dashboard/gigs?minBudget=50000&maxBudget=150000`
   - Assert only gigs within budget range are shown
9. Navigate to `/dashboard/gigs?sort=budget-desc`
   - Assert gigs are sorted by budget descending (highest first)
10. Navigate to `/dashboard/gigs?sort=budget-asc`
    - Assert gigs are sorted by budget ascending (lowest first)
11. Navigate to `/dashboard/gigs?search=backend&tags=Python&minBudget=100000&sort=budget-desc`
    - Assert combined filters work with AND logic: gigs must match search AND have Python tag AND meet budget requirement
    - Create test gig: title="Backend API", tags="Python,Django", budget=15000000
    - Assert this gig is shown
    - Create test gig: title="Frontend App", tags="Python", budget=15000000
    - Assert this gig is NOT shown (doesn't match search)
    - Create test gig: title="Backend Service", tags="Go", budget=15000000
    - Assert this gig is NOT shown (doesn't have Python tag)
12. Navigate to `/dashboard/gigs?tags=React,TypeScript`
    - Assert gigs with React OR TypeScript are shown (OR within tag filter)
    - Create test gig: title="App", tags="React", budget=10000000
    - Create test gig: title="Service", tags="TypeScript", budget=10000000
    - Create test gig: title="Tool", tags="Python", budget=10000000
    - Assert first two gigs are shown, third is not
12. Navigate to `/dashboard/gigs?search=nonexistentterm`
    - Assert empty state message is displayed
    - Assert filter panel is still visible

---

## Task 3: Add Integration Test Script

**Implementation:**
- Create `scripts/test-gig-filters.ts`
- Import prisma client
- Create test gigs with various titles, descriptions, tags, and budgets
- Test each filter scenario programmatically:
  - Text search
  - Tag filtering
  - Budget range filtering
  - Sort options
  - Combined filters
- Use Prisma queries matching the page implementation
- Assert expected results for each scenario
- Clean up test data at the end

**Test Plan:**
1. Run `npx tsx scripts/test-gig-filters.ts`
2. Assert all test scenarios pass
3. Verify test data is cleaned up (no leftover test gigs)

---

## Task 4: Manual End-to-End Testing

**Implementation:**
- No code changes, manual testing only

**Test Plan:**
1. As SPECIALIST user:
   - Navigate to `/dashboard/gigs`
   - Apply various filter combinations
   - Verify results are correct
   - Click on a filtered gig, view details, go back
   - Verify filters persist after navigation
   - Copy filtered URL, open in new tab
   - Verify same filtered view appears
2. As CLIENT user:
   - Navigate to `/dashboard/gigs`
   - Verify filter panel is visible
   - Verify filters work (read-only browsing)
3. Test edge cases:
   - Empty search results
   - Invalid budget values (negative, non-numeric)
   - Very large budget values
   - Special characters in search
   - Empty tag selection
4. Test responsive design:
   - Verify filter panel is usable on mobile viewport
   - Verify gig list is readable on mobile

---

## Summary

After completing all tasks:
1. Filter panel component is implemented and styled
2. Gig browse page supports dynamic filtering via URL parameters
3. All filter types work correctly (search, tags, budget, sort)
4. Filter state persists via URL (shareable/bookmarkable)
5. Empty states are handled gracefully
6. Integration tests validate query logic
7. Manual testing confirms end-to-end functionality
