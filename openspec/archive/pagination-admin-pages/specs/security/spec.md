# Security Specification Delta: Pagination for Admin Pages

## MODIFIED Requirements

### Requirement: Admin User Management Page
The system MUST provide a page at `/admin/users` for ADMIN users to view and moderate user accounts with pagination support.

#### Scenario: Admin views users (first page)
- GIVEN an authenticated user with role "ADMIN"
- WHEN they navigate to `/admin/users` (no page parameter)
- THEN the page MUST display the first 30 users
- AND each user MUST show: email, role, status (active/suspended), registration date, and action buttons
- AND the page MUST display pagination controls below the table
- AND the page MUST display "Showing 1-30 of X users" where X is the total count

#### Scenario: Admin views users (specific page)
- GIVEN an authenticated user with role "ADMIN"
- WHEN they navigate to `/admin/users?page=2`
- THEN the page MUST display users 31-60 (second page of 30 users)
- AND the pagination controls MUST show page 2 as active
- AND the URL MUST remain `/admin/users?page=2`

#### Scenario: No users match filters
- GIVEN an ADMIN has applied filters that match no users
- WHEN they view `/admin/users?role=CLIENT&status=suspended`
- THEN the page MUST display "No users found"
- AND pagination controls MUST NOT be displayed

#### Scenario: Fewer users than page size
- GIVEN only 20 users exist in the system
- WHEN an ADMIN visits `/admin/users`
- THEN the page MUST display all 20 users
- AND the page MUST display "Showing 1-20 of 20 users"
- AND pagination controls MUST NOT be displayed (only one page)

#### Scenario: Invalid page number (too high)
- GIVEN 80 users exist (3 pages total)
- WHEN an ADMIN navigates to `/admin/users?page=10`
- THEN the page MUST redirect to `/admin/users?page=3` (last valid page)

#### Scenario: Invalid page number (zero or negative)
- GIVEN an ADMIN navigates to `/admin/users?page=0` or `/admin/users?page=-1`
- THEN the page MUST redirect to `/admin/users` (page 1, default)

#### Scenario: Non-numeric page parameter
- GIVEN an ADMIN navigates to `/admin/users?page=abc`
- THEN the page MUST redirect to `/admin/users` (page 1, default)

#### Scenario: Pagination with role filter
- GIVEN an ADMIN has applied role filter: `?role=CLIENT`
- WHEN they navigate to page 2
- THEN the URL MUST include both filter and page param: `/admin/users?role=CLIENT&page=2`
- AND the query MUST apply filter first, then paginate the filtered results

#### Scenario: Pagination with status filter
- GIVEN an ADMIN has applied status filter: `?status=suspended`
- WHEN they navigate to page 2
- THEN the URL MUST include both filter and page param: `/admin/users?status=suspended&page=2`
- AND the query MUST apply filter first, then paginate the filtered results

#### Scenario: Changing filters resets pagination
- GIVEN an ADMIN is on page 3 of filtered results
- WHEN they change any filter (role or status)
- THEN the page MUST redirect to page 1 with the new filters
- AND the URL MUST NOT include `page` parameter (defaults to 1)

#### Scenario: Non-ADMIN user attempts access
- GIVEN an authenticated user with role "CLIENT" or "SPECIALIST"
- WHEN they navigate to `/admin/users`
- THEN they MUST be redirected to `/dashboard` (handled by existing middleware)

**Acceptance Criteria:**
- `app/admin/users/page.tsx` exists as a server component
- Reads `page` from URL search params (default: 1)
- Validates page number (positive integer, within valid range)
- Queries `prisma.user.findMany({ where, skip: (page-1)*30, take: 30 })`
- Queries `prisma.user.count({ where })` for total count
- Applies existing filters (role, status) before pagination
- Redirects invalid page numbers to valid pages
- Resets to page 1 when filters change
- Accessible only to ADMIN role
- Pagination controls rendered below table
- Total results count displayed above or below table
- Reuses existing `PaginationControls` component

---

### Requirement: Admin Gig Management Page
The system MUST provide a page at `/admin/gigs` for ADMIN users to view and moderate gigs with pagination support.

#### Scenario: Admin views gigs (first page)
- GIVEN an authenticated user with role "ADMIN"
- WHEN they navigate to `/admin/gigs` (no page parameter)
- THEN the page MUST display the first 30 gigs
- AND each gig MUST show: title, client, status, budget, creation date, and action buttons
- AND the page MUST display pagination controls below the table
- AND the page MUST display "Showing 1-30 of X gigs" where X is the total count

#### Scenario: Admin views gigs (specific page)
- GIVEN an authenticated user with role "ADMIN"
- WHEN they navigate to `/admin/gigs?page=2`
- THEN the page MUST display gigs 31-60 (second page of 30 gigs)
- AND the pagination controls MUST show page 2 as active
- AND the URL MUST remain `/admin/gigs?page=2`

#### Scenario: No gigs match filters
- GIVEN an ADMIN has applied filters that match no gigs
- WHEN they view `/admin/gigs?status=OPEN&closed=true`
- THEN the page MUST display "No gigs found"
- AND pagination controls MUST NOT be displayed

#### Scenario: Fewer gigs than page size
- GIVEN only 15 gigs exist in the system
- WHEN an ADMIN visits `/admin/gigs`
- THEN the page MUST display all 15 gigs
- AND the page MUST display "Showing 1-15 of 15 gigs"
- AND pagination controls MUST NOT be displayed (only one page)

#### Scenario: Invalid page number (too high)
- GIVEN 100 gigs exist (4 pages total)
- WHEN an ADMIN navigates to `/admin/gigs?page=10`
- THEN the page MUST redirect to `/admin/gigs?page=4` (last valid page)

#### Scenario: Invalid page number (zero or negative)
- GIVEN an ADMIN navigates to `/admin/gigs?page=0` or `/admin/gigs?page=-1`
- THEN the page MUST redirect to `/admin/gigs` (page 1, default)

#### Scenario: Non-numeric page parameter
- GIVEN an ADMIN navigates to `/admin/gigs?page=abc`
- THEN the page MUST redirect to `/admin/gigs` (page 1, default)

#### Scenario: Pagination with status filter
- GIVEN an ADMIN has applied status filter: `?status=OPEN`
- WHEN they navigate to page 2
- THEN the URL MUST include both filter and page param: `/admin/gigs?status=OPEN&page=2`
- AND the query MUST apply filter first, then paginate the filtered results

#### Scenario: Pagination with closed filter
- GIVEN an ADMIN has applied closed filter: `?closed=true`
- WHEN they navigate to page 2
- THEN the URL MUST include both filter and page param: `/admin/gigs?closed=true&page=2`
- AND the query MUST apply filter first, then paginate the filtered results

#### Scenario: Changing filters resets pagination
- GIVEN an ADMIN is on page 3 of filtered results
- WHEN they change any filter (status or closed)
- THEN the page MUST redirect to page 1 with the new filters
- AND the URL MUST NOT include `page` parameter (defaults to 1)

#### Scenario: Non-ADMIN user attempts access
- GIVEN an authenticated user with role "CLIENT" or "SPECIALIST"
- WHEN they navigate to `/admin/gigs`
- THEN they MUST be redirected to `/dashboard` (handled by existing middleware)

**Acceptance Criteria:**
- `app/admin/gigs/page.tsx` exists as a server component
- Reads `page` from URL search params (default: 1)
- Validates page number (positive integer, within valid range)
- Queries `prisma.gig.findMany({ where, skip: (page-1)*30, take: 30 })`
- Queries `prisma.gig.count({ where })` for total count
- Applies existing filters (status, closed) before pagination
- Redirects invalid page numbers to valid pages
- Resets to page 1 when filters change
- Accessible only to ADMIN role
- Pagination controls rendered below table
- Total results count displayed above or below table
- Reuses existing `PaginationControls` component

---

## ADDED Requirements

### Requirement: Admin Pagination Query Performance
Admin pages MUST use efficient database queries with LIMIT and OFFSET for pagination.

#### Scenario: Query uses LIMIT and OFFSET
- GIVEN an ADMIN requests page 3 (records 61-90)
- WHEN the server queries the database
- THEN the query MUST use `LIMIT 30 OFFSET 60`
- AND the query MUST return exactly 30 records (or fewer on last page)

#### Scenario: Count query for total pages
- GIVEN an ADMIN visits an admin page
- WHEN the server needs to calculate total pages
- THEN a separate COUNT query MUST be executed
- AND the count MUST respect the same WHERE clause as the main query (filters applied)

#### Scenario: Filters applied before pagination
- GIVEN an ADMIN has filters: `?role=CLIENT&status=active`
- WHEN the server queries page 2
- THEN the WHERE clause MUST include all filter conditions
- AND LIMIT/OFFSET MUST be applied to the filtered result set

**Acceptance Criteria:**
- Main query uses `prisma.[model].findMany({ skip: (page-1)*PAGE_SIZE, take: PAGE_SIZE })`
- Count query uses `prisma.[model].count({ where: sameWhereClause })`
- PAGE_SIZE constant defined as 30 for admin pages
- Both queries use identical WHERE clause (filter logic)
- Queries execute in parallel using `Promise.all([findMany, count])`
- No full table scans (existing indexes remain effective)
