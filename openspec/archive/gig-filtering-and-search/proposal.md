# Change Proposal: Gig Filtering & Search

## Problem Statement

Currently, the gig browsing page (`/dashboard/gigs`) displays all OPEN gigs in reverse chronological order with no filtering or search capabilities. As the marketplace grows, specialists need efficient ways to find relevant gigs matching their skills, budget expectations, and preferences.

## Proposed Solution

Add filtering and search functionality to the gig browsing page, enabling specialists to:
- Search gigs by text (title and description)
- Filter by tags (tech stack)
- Filter by budget range
- Sort results by different criteria (newest, highest budget, lowest budget)

## Scope

### In Scope
- Text search across gig title and description
- Multi-select tag filtering
- Budget range filtering (min/max in roubles)
- Sort options: newest first, highest budget first, lowest budget first
- URL query parameters for shareable/bookmarkable filtered views
- Filter persistence via URL state (no backend state required)
- Clear filters action

### Out of Scope
- Saved search preferences (requires user preferences table)
- Advanced search operators (AND/OR/NOT)
- Full-text search indexing (SQLite LIKE is sufficient for MVP)
- Pagination (can be added in a future change)
- Experience level filtering (gigs don't have experience requirements yet)
- Client filtering
- Date range filtering

## Constraints

- MUST use URL query parameters for filter state (no cookies/localStorage for MVP)
- MUST maintain existing role-based access (both CLIENT and SPECIALIST can browse)
- MUST preserve existing UI layout and styling patterns
- MUST handle empty states gracefully (no results found)
- Search MUST be case-insensitive
- Tag filtering MUST support multiple tags (OR logic: show gigs matching ANY selected tag)
- Budget filtering MUST work with kopecks internally but display roubles to users

## Technical Approach

- Server component with searchParams prop for reading URL query parameters
- Prisma query with dynamic where clauses based on filters
- Client component for filter UI with form submission to update URL
- Use Next.js useRouter and useSearchParams for URL manipulation
- No new database tables or migrations required

## Success Criteria

- Specialists can search for gigs by keyword
- Specialists can filter by one or more tags
- Specialists can filter by budget range
- Specialists can sort results by different criteria
- Filter state is reflected in URL and can be shared/bookmarked
- Empty states are handled gracefully
- Existing functionality (viewing gig details, applying) remains unchanged
