# UI Specification Delta: Pagination for Gig Browsing

## MODIFIED Requirements

### Requirement: Gig Browse Page
The system MUST provide a page at `/dashboard/gigs` listing OPEN gigs with pagination support.

#### Scenario: Specialist browses gigs (first page)
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs` (no page parameter)
- THEN the page MUST display the first 25 gigs with status "OPEN"
- AND each gig MUST show: title, budget (formatted in ₽), tags, and creation date
- AND each gig MUST link to `/dashboard/gigs/[id]`
- AND the page MUST display pagination controls below the gig list
- AND the page MUST display "Showing 1-25 of X gigs" where X is the total count

#### Scenario: Specialist browses gigs (specific page)
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs?page=2`
- THEN the page MUST display gigs 26-50 (second page of 25 gigs)
- AND the pagination controls MUST show page 2 as active
- AND the URL MUST remain `/dashboard/gigs?page=2`

#### Scenario: No open gigs available
- GIVEN no gigs with status "OPEN" exist
- WHEN a SPECIALIST visits `/dashboard/gigs`
- THEN the page MUST display "No open gigs available."
- AND pagination controls MUST NOT be displayed

#### Scenario: Fewer gigs than page size
- GIVEN only 15 OPEN gigs exist
- WHEN a SPECIALIST visits `/dashboard/gigs`
- THEN the page MUST display all 15 gigs
- AND the page MUST display "Showing 1-15 of 15 gigs"
- AND pagination controls MUST NOT be displayed (only one page)

#### Scenario: Invalid page number (too high)
- GIVEN 50 OPEN gigs exist (2 pages total)
- WHEN a user navigates to `/dashboard/gigs?page=5`
- THEN the page MUST redirect to `/dashboard/gigs?page=2` (last valid page)

#### Scenario: Invalid page number (zero or negative)
- GIVEN a user navigates to `/dashboard/gigs?page=0` or `/dashboard/gigs?page=-1`
- THEN the page MUST redirect to `/dashboard/gigs` (page 1, default)

#### Scenario: Non-numeric page parameter
- GIVEN a user navigates to `/dashboard/gigs?page=abc`
- THEN the page MUST redirect to `/dashboard/gigs` (page 1, default)

#### Scenario: Pagination with filters
- GIVEN a user has applied filters (search, tags, budget range)
- WHEN they navigate to page 2
- THEN the URL MUST include both filter params and page param
- AND the query MUST apply filters first, then paginate the filtered results
- EXAMPLE: `/dashboard/gigs?search=react&tags=React&page=2`

#### Scenario: Changing filters resets pagination
- GIVEN a user is on page 3 of filtered results
- WHEN they change any filter (search, tags, budget, sort)
- THEN the page MUST redirect to page 1 with the new filters
- AND the URL MUST NOT include `page` parameter (defaults to 1)

#### Scenario: CLIENT visits browse page with pagination
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs?page=2`
- THEN the page MUST display page 2 of the gig list (read-only, no apply action)
- AND pagination controls MUST work identically to SPECIALIST view

#### Scenario: Unauthenticated user visits browse page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/page.tsx` exists as a server component
- Reads `page` from URL search params (default: 1)
- Validates page number (positive integer, within valid range)
- Queries `prisma.gig.findMany({ where: { status: 'OPEN' }, skip: (page-1)*25, take: 25 })`
- Queries `prisma.gig.count({ where: { status: 'OPEN' } })` for total count
- Applies existing filters (search, tags, budget, sort) before pagination
- Redirects invalid page numbers to valid pages
- Resets to page 1 when filters change
- Each gig links to its detail page
- Accessible to both CLIENT and SPECIALIST roles
- Pagination controls rendered below gig list
- Total results count displayed above or below gig list

---

## ADDED Requirements

### Requirement: Pagination Controls Component
The gig browse page MUST display pagination controls when results span multiple pages.

#### Scenario: Pagination controls render on multi-page results
- GIVEN more than 25 OPEN gigs exist
- WHEN a user views `/dashboard/gigs`
- THEN pagination controls MUST be displayed below the gig list
- AND controls MUST include:
  - "Previous" button
  - Page number buttons
  - "Next" button
  - Results count text

#### Scenario: Previous button on first page
- GIVEN a user is on page 1
- WHEN pagination controls render
- THEN the "Previous" button MUST be disabled
- AND the button MUST have `aria-disabled="true"`
- AND the button MUST have visual styling indicating disabled state (e.g., opacity-50, cursor-not-allowed)

#### Scenario: Previous button on subsequent pages
- GIVEN a user is on page 2 or higher
- WHEN pagination controls render
- THEN the "Previous" button MUST be enabled
- AND clicking it MUST navigate to the previous page
- EXAMPLE: On page 3, clicking "Previous" navigates to `/dashboard/gigs?page=2`

#### Scenario: Next button on last page
- GIVEN a user is on the last page of results
- WHEN pagination controls render
- THEN the "Next" button MUST be disabled
- AND the button MUST have `aria-disabled="true"`
- AND the button MUST have visual styling indicating disabled state

#### Scenario: Next button on non-last pages
- GIVEN a user is on any page except the last
- WHEN pagination controls render
- THEN the "Next" button MUST be enabled
- AND clicking it MUST navigate to the next page
- EXAMPLE: On page 2, clicking "Next" navigates to `/dashboard/gigs?page=3`

#### Scenario: Page number buttons display
- GIVEN a user is on page 5 of 10 total pages
- WHEN pagination controls render
- THEN page number buttons MUST be displayed for:
  - Current page (5) - highlighted/active state
  - 2 pages before current (3, 4)
  - 2 pages after current (6, 7)
  - First page (1) with ellipsis if gap exists
  - Last page (10) with ellipsis if gap exists
- EXAMPLE: `1 ... 3 4 [5] 6 7 ... 10`

#### Scenario: Page number buttons on early pages
- GIVEN a user is on page 2 of 10 total pages
- WHEN pagination controls render
- THEN page number buttons MUST be displayed as: `1 [2] 3 4 5 ... 10`
- AND no ellipsis before current page (no gap)

#### Scenario: Page number buttons on late pages
- GIVEN a user is on page 9 of 10 total pages
- WHEN pagination controls render
- THEN page number buttons MUST be displayed as: `1 ... 6 7 8 [9] 10`
- AND no ellipsis after current page (no gap)

#### Scenario: Page number buttons with few total pages
- GIVEN only 5 total pages exist
- WHEN pagination controls render on any page
- THEN ALL page numbers MUST be displayed (1 2 3 4 5)
- AND no ellipsis MUST be shown

#### Scenario: Clicking page number button
- GIVEN a user is on page 2
- WHEN they click the page number button for page 5
- THEN the browser MUST navigate to `/dashboard/gigs?page=5`
- AND the page MUST load gigs 101-125

#### Scenario: Current page button styling
- GIVEN a user is on page 3
- WHEN pagination controls render
- THEN the page 3 button MUST have distinct active styling
- AND the button MUST have `aria-current="page"`
- AND the button MUST NOT be clickable (not a link)

#### Scenario: Results count display
- GIVEN a user is on page 2 of 127 total gigs
- WHEN the page renders
- THEN the results count MUST display "Showing 26-50 of 127 gigs"
- AND the text MUST be positioned above or below the gig list

#### Scenario: Results count on last page (partial)
- GIVEN a user is on page 6 of 127 total gigs (last page with 2 gigs)
- WHEN the page renders
- THEN the results count MUST display "Showing 126-127 of 127 gigs"

#### Scenario: Results count on single page
- GIVEN only 15 total gigs exist (one page)
- WHEN the page renders
- THEN the results count MUST display "Showing 1-15 of 15 gigs"
- AND pagination controls MUST NOT be displayed

#### Scenario: Pagination controls are keyboard accessible
- GIVEN pagination controls are displayed
- WHEN a user navigates with keyboard (Tab key)
- THEN all enabled buttons MUST be focusable
- AND disabled buttons MUST NOT be focusable
- AND pressing Enter on a focused button MUST navigate to that page

#### Scenario: Pagination controls are screen reader accessible
- GIVEN pagination controls are displayed
- WHEN a screen reader user navigates the page
- THEN the controls MUST be announced as "pagination navigation"
- AND each button MUST have descriptive aria-label (e.g., "Go to page 3", "Previous page", "Next page")
- AND the current page MUST be announced with "Current page, page 3"

#### Scenario: Pagination preserves filter state
- GIVEN a user has filters applied: `?search=react&tags=React,TypeScript&sort=newest&page=2`
- WHEN they click "Next" button
- THEN the URL MUST become `?search=react&tags=React,TypeScript&sort=newest&page=3`
- AND all filter parameters MUST be preserved

**Acceptance Criteria:**
- New client component `PaginationControls` created at `app/components/PaginationControls.tsx`
- Component accepts props: `currentPage: number`, `totalPages: number`, `totalCount: number`, `baseUrl: string`, `searchParams: URLSearchParams`
- Previous/Next buttons use `<Link>` component with proper href construction
- Page number buttons use `<Link>` for non-current pages, `<span>` for current page
- Disabled buttons have `aria-disabled="true"` and visual styling (opacity-50, cursor-not-allowed, pointer-events-none)
- Current page has `aria-current="page"` and distinct styling (bg-indigo-600, text-white)
- All buttons have descriptive `aria-label` attributes
- Pagination nav has `role="navigation"` and `aria-label="Pagination"`
- Results count uses semantic HTML (e.g., `<p>` or `<div>` with appropriate classes)
- Component handles edge cases: 1 page (no controls), 2-5 pages (all numbers), 6+ pages (ellipsis logic)
- Ellipsis rendered as non-interactive `<span>` with `...` text
- Styling uses Tailwind classes consistent with existing design system
- Component is fully responsive (mobile-friendly)

---

### Requirement: Pagination URL State Management
The gig browse page MUST manage pagination state via URL query parameters for bookmarkability and shareability.

#### Scenario: Default page parameter
- GIVEN a user navigates to `/dashboard/gigs` (no page param)
- WHEN the page loads
- THEN the system MUST treat this as page 1
- AND the URL MUST remain `/dashboard/gigs` (no `?page=1` added)

#### Scenario: Explicit page parameter
- GIVEN a user navigates to `/dashboard/gigs?page=3`
- WHEN the page loads
- THEN the system MUST load page 3 of results
- AND the URL MUST remain `/dashboard/gigs?page=3`

#### Scenario: Bookmarking paginated results
- GIVEN a user is on `/dashboard/gigs?search=react&page=2`
- WHEN they bookmark the page
- THEN returning to the bookmark MUST load the same filtered results on page 2

#### Scenario: Sharing paginated URL
- GIVEN a user copies the URL `/dashboard/gigs?tags=React,TypeScript&page=3`
- WHEN another user visits that URL
- THEN they MUST see the same filtered results on page 3

#### Scenario: Browser back button navigation
- GIVEN a user navigates from page 1 to page 2 to page 3
- WHEN they click the browser back button twice
- THEN they MUST return to page 1
- AND the URL MUST be `/dashboard/gigs` (or `/dashboard/gigs?page=1`)

#### Scenario: Browser forward button navigation
- GIVEN a user navigated back from page 3 to page 1
- WHEN they click the browser forward button twice
- THEN they MUST return to page 3
- AND the URL MUST be `/dashboard/gigs?page=3`

**Acceptance Criteria:**
- Page number read from `searchParams.get('page')` in server component
- Default value: 1 (when param is missing, null, or invalid)
- Page parameter preserved when constructing pagination links
- All filter parameters preserved alongside page parameter
- URL updates use Next.js `<Link>` component (client-side navigation)
- No JavaScript required for pagination to work (progressive enhancement)
- Page state is never stored in cookies, localStorage, or server session

---

### Requirement: Pagination Query Performance
The gig browse page MUST use efficient database queries with LIMIT and OFFSET for pagination.

#### Scenario: Query uses LIMIT and OFFSET
- GIVEN a user requests page 3 (gigs 51-75)
- WHEN the server queries the database
- THEN the query MUST use `LIMIT 25 OFFSET 50`
- AND the query MUST return exactly 25 gigs (or fewer on last page)

#### Scenario: Count query for total pages
- GIVEN a user visits the gig browse page
- WHEN the server needs to calculate total pages
- THEN a separate COUNT query MUST be executed
- AND the count MUST respect the same WHERE clause as the main query (filters applied)

#### Scenario: Filters applied before pagination
- GIVEN a user has filters: `?search=react&tags=React&minBudget=50000`
- WHEN the server queries page 2
- THEN the WHERE clause MUST include all filter conditions
- AND LIMIT/OFFSET MUST be applied to the filtered result set
- EXAMPLE: `WHERE status='OPEN' AND title LIKE '%react%' AND tags CONTAINS 'React' AND budget >= 5000000 LIMIT 25 OFFSET 25`

#### Scenario: Sort order applied before pagination
- GIVEN a user has sort: `?sort=highest-budget`
- WHEN the server queries page 2
- THEN the ORDER BY clause MUST be applied before LIMIT/OFFSET
- EXAMPLE: `ORDER BY budget DESC LIMIT 25 OFFSET 25`

**Acceptance Criteria:**
- Main query uses `prisma.gig.findMany({ skip: (page-1)*PAGE_SIZE, take: PAGE_SIZE })`
- Count query uses `prisma.gig.count({ where: sameWhereClause })`
- PAGE_SIZE constant defined as 25
- Both queries use identical WHERE clause (filter logic)
- Queries execute in parallel using `Promise.all([findMany, count])`
- No full table scans (existing indexes on status, createdAt remain effective)
