# UI Specification Delta: Gig Filtering & Search

## MODIFIED Requirements

### Requirement: Gig Browse Page
The system MUST provide a page at `/dashboard/gigs` listing all OPEN gigs for browsing with filtering and search capabilities.

#### Scenario: Specialist browses gigs with filters
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs`
- THEN the page MUST display a filter panel above the gig list
- AND the filter panel MUST include:
  - Text search input for searching title and description
  - Tag filter (multi-select checkboxes or dropdown)
  - Budget range inputs (min and max in roubles)
  - Sort dropdown (newest, highest budget, lowest budget)
  - "Apply Filters" button
  - "Clear Filters" button
- AND the page MUST display filtered gigs matching ALL active filter criteria
- AND each gig MUST show: title, budget (formatted in ₽), tags, and creation date
- AND each gig MUST link to `/dashboard/gigs/[id]`

#### Scenario: Text search filters gigs
- GIVEN a user is on `/dashboard/gigs`
- WHEN they enter "React" in the search input and apply filters
- THEN the page MUST display only gigs where title OR description contains "React" (case-insensitive)
- AND the URL MUST update to `/dashboard/gigs?search=React`

#### Scenario: Tag filter shows gigs with matching tags (OR within tags)
- GIVEN a user is on `/dashboard/gigs`
- WHEN they select tags "React" and "TypeScript" and apply filters
- THEN the page MUST display only gigs that have "React" OR "TypeScript" in their tags
- AND the URL MUST update to `/dashboard/gigs?tags=React,TypeScript`
- AND if combined with other filters, tags MUST be combined with AND logic (e.g., search AND tags)

#### Scenario: Budget range filter
- GIVEN a user is on `/dashboard/gigs`
- WHEN they set min budget to 50000 and max budget to 150000 and apply filters
- THEN the page MUST display only gigs where budget >= 5000000 kopecks AND budget <= 15000000 kopecks
- AND the URL MUST update to `/dashboard/gigs?minBudget=50000&maxBudget=150000`

#### Scenario: Sort by highest budget
- GIVEN a user is on `/dashboard/gigs`
- WHEN they select "Highest Budget" from the sort dropdown and apply filters
- THEN gigs MUST be ordered by budget descending (highest first)
- AND the URL MUST update to `/dashboard/gigs?sort=budget-desc`

#### Scenario: Sort by lowest budget
- GIVEN a user is on `/dashboard/gigs`
- WHEN they select "Lowest Budget" from the sort dropdown and apply filters
- THEN gigs MUST be ordered by budget ascending (lowest first)
- AND the URL MUST update to `/dashboard/gigs?sort=budget-asc`

#### Scenario: Sort by newest (default)
- GIVEN a user is on `/dashboard/gigs`
- WHEN they select "Newest First" from the sort dropdown (or no sort is selected)
- THEN gigs MUST be ordered by createdAt descending (newest first)
- AND the URL MUST be `/dashboard/gigs` or `/dashboard/gigs?sort=newest`

#### Scenario: Combined filters with AND logic between filter types
- GIVEN a user is on `/dashboard/gigs`
- WHEN they apply search="backend", tags="Python,Go", minBudget=100000, sort="budget-desc"
- THEN the page MUST display only gigs matching ALL criteria (AND logic between filter types):
  - (Title contains "backend" OR description contains "backend") (case-insensitive)
  - AND (Tags include "Python" OR tags include "Go")
  - AND Budget >= 10000000 kopecks
  - Sorted by budget descending
- AND the URL MUST reflect all parameters
- AND within each filter type, OR logic MUST be used (e.g., multiple tags use OR)

#### Scenario: Clear filters resets to default view
- GIVEN a user has active filters on `/dashboard/gigs?search=React&tags=TypeScript&minBudget=50000`
- WHEN they click "Clear Filters"
- THEN all filter inputs MUST be reset to empty/default values
- AND the URL MUST update to `/dashboard/gigs` (no query parameters)
- AND the page MUST display all OPEN gigs sorted by newest first

#### Scenario: No results found with filters
- GIVEN a user applies filters that match no gigs
- WHEN the filtered query returns an empty result set
- THEN the page MUST display "No gigs match your filters. Try adjusting your search criteria."
- AND the filter panel MUST remain visible with current filter values
- AND the "Clear Filters" button MUST be visible

#### Scenario: Filter state persists via URL
- GIVEN a user has applied filters resulting in URL `/dashboard/gigs?search=React&tags=TypeScript`
- WHEN they navigate to a gig detail page and then click "Back to Dashboard" or browser back button
- THEN they MUST return to `/dashboard/gigs?search=React&tags=TypeScript`
- AND the filter inputs MUST be pre-filled with the URL parameter values
- AND the filtered results MUST be displayed

#### Scenario: Shareable filtered URL
- GIVEN a user has applied filters resulting in URL `/dashboard/gigs?search=React&minBudget=100000`
- WHEN they copy and share this URL with another authenticated user
- THEN the recipient MUST see the same filtered view with the same filters applied

#### Scenario: CLIENT visits browse page with filters
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs` with or without filter parameters
- THEN the page MUST display the filter panel and filtered gig list (read-only, no apply action)

#### Scenario: Invalid filter parameters are ignored
- GIVEN a user navigates to `/dashboard/gigs?minBudget=invalid&maxBudget=-1000`
- WHEN the page loads
- THEN invalid parameters MUST be ignored (treated as not provided)
- AND the page MUST display all OPEN gigs with default sorting

**Acceptance Criteria:**
- `app/dashboard/gigs/page.tsx` reads searchParams prop (Next.js App Router)
- Supported query parameters: `search`, `tags` (comma-separated), `minBudget`, `maxBudget`, `sort`
- Filter panel is a client component (`'use client'`) that manages form state and updates URL
- Prisma query dynamically builds `where` clause based on active filters:
  - `search`: `{ OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }`
  - `tags`: `{ tags: { contains: tag } }` for each tag (OR logic via separate queries or string matching)
  - `minBudget`: `{ budget: { gte: minBudget * 100 } }`
  - `maxBudget`: `{ budget: { lte: maxBudget * 100 } }`
- Sort parameter maps to Prisma `orderBy`:
  - `newest` or empty: `{ createdAt: 'desc' }`
  - `budget-desc`: `{ budget: 'desc' }`
  - `budget-asc`: `{ budget: 'asc' }`
- Filter panel uses `useRouter()` and `useSearchParams()` from `next/navigation`
- "Apply Filters" button updates URL with current filter values
- "Clear Filters" button navigates to `/dashboard/gigs` (no params)
- Empty state message when filtered results are empty
- Filter inputs are pre-filled from URL parameters on page load

---

## ADDED Requirements

### Requirement: Gig Filter Panel Component
The system MUST provide a client-side filter panel component for the gig browse page.

#### Scenario: Filter panel renders with all controls
- GIVEN a user is on `/dashboard/gigs`
- WHEN the page loads
- THEN the filter panel MUST display:
  - Search input with placeholder "Search gigs..."
  - Tag filter control (checkboxes or multi-select)
  - Min budget input (number, placeholder "Min budget (₽)")
  - Max budget input (number, placeholder "Max budget (₽)")
  - Sort dropdown with options: "Newest First", "Highest Budget", "Lowest Budget"
  - "Apply Filters" button
  - "Clear Filters" button

#### Scenario: Filter panel pre-fills from URL
- GIVEN a user navigates to `/dashboard/gigs?search=React&minBudget=50000&sort=budget-desc`
- WHEN the page loads
- THEN the search input MUST contain "React"
- AND the min budget input MUST contain "50000"
- AND the sort dropdown MUST show "Highest Budget" selected

#### Scenario: Apply filters updates URL
- GIVEN a user has entered filter values in the filter panel
- WHEN they click "Apply Filters"
- THEN the URL MUST update with query parameters reflecting the filter values
- AND the page MUST re-render with filtered results (server component re-fetch)

#### Scenario: Clear filters resets form and URL
- GIVEN a user has active filters
- WHEN they click "Clear Filters"
- THEN all form inputs MUST be cleared
- AND the URL MUST update to `/dashboard/gigs` (no query parameters)

#### Scenario: Tag filter displays available tags
- GIVEN the filter panel is rendered
- WHEN the tag filter control is displayed
- THEN it MUST show a list of common tags (e.g., "React", "Python", "TypeScript", "Node.js", "Go", "Rust", "Docker", "Kubernetes")
- AND users MUST be able to select multiple tags

**Acceptance Criteria:**
- Filter panel is a client component exported from `app/dashboard/gigs/components/GigFilters.tsx`
- Uses `useRouter()` from `next/navigation` to update URL
- Uses `useSearchParams()` to read current URL parameters
- Form inputs are controlled components with local state
- "Apply Filters" constructs URLSearchParams and calls `router.push()`
- "Clear Filters" calls `router.push('/dashboard/gigs')`
- Tag filter uses checkboxes or a multi-select dropdown
- Budget inputs accept positive integers only (client-side validation)
- Component is responsive and follows existing Tailwind CSS styling patterns
