# Proposal: Pagination for Gig Browsing

## Problem Statement

The gig browsing page (`/dashboard/gigs`) currently loads all OPEN gigs in a single query and renders them on one page. This creates performance issues when the platform has 100+ gigs:

- **Slow page load times**: Fetching and rendering hundreds of gigs causes noticeable delays
- **Poor user experience**: Users must scroll through long lists to find relevant gigs
- **Database inefficiency**: Queries return all records even when users only view the first few
- **Memory overhead**: Large result sets consume unnecessary client and server memory

## Proposed Solution

Implement **offset-based pagination** on the gig browsing page with the following characteristics:

### Pagination Approach: Offset-Based

**Why offset-based over cursor-based?**
- Simpler implementation for MVP (no cursor encoding/decoding)
- Allows direct page number navigation (better UX for browsing)
- Works seamlessly with existing filter/sort logic
- Acceptable performance for expected dataset size (hundreds, not millions)
- Enables "jump to page N" functionality

**Trade-offs accepted:**
- Slight performance degradation on very high page numbers (acceptable for MVP scale)
- Potential inconsistency if records are added/deleted during browsing (rare edge case)

### Page Size: 25 Gigs Per Page

**Rationale:**
- Falls within required range (20-50)
- Balances information density with scrolling
- ~2-3 screens of content on typical desktop displays
- Reduces query load by 75-95% for large datasets (100+ gigs)

### UI Design

**Pagination Controls:**
- Positioned below the gig list (after last gig card)
- Components:
  - "Previous" button (disabled on page 1)
  - Page number buttons (current page + 2 before + 2 after, with ellipsis for gaps)
  - "Next" button (disabled on last page)
  - Total results count: "Showing 1-25 of 127 gigs"
- Styling: Consistent with existing Tailwind design system
- Accessibility: Keyboard navigation, ARIA labels, focus management

**URL Structure:**
- Current: `/dashboard/gigs?search=react&tags=React,TypeScript&sort=newest`
- With pagination: `/dashboard/gigs?search=react&tags=React,TypeScript&sort=newest&page=2`
- Default: `page=1` (omitted from URL for cleaner bookmarks)

### Integration with Existing Features

**Filters and Search:**
- Pagination resets to page 1 when filters change
- Total page count recalculates based on filtered results
- URL updates to reflect both filters and current page

**Sorting:**
- Pagination persists across sort changes
- If current page exceeds new total pages after sort, redirect to last valid page

**Performance Improvement:**
- Query uses `LIMIT 25 OFFSET (page-1)*25`
- Separate count query for total results (cached for 30 seconds)
- Expected improvement: 75-95% reduction in query time for large datasets

## Constraints

- **No server-side state**: Pagination state lives entirely in URL query params
- **No infinite scroll**: Traditional pagination only (simpler, more predictable)
- **No configurable page size**: Fixed at 25 gigs per page (avoids complexity)
- **MVP scope**: Basic pagination controls only (no "jump to page" input field)

## Success Metrics

- Page load time for 100+ gig dataset: < 1 second (down from 3-5 seconds)
- Database query time: < 100ms (down from 500ms+)
- User engagement: No decrease in gig applications per visit
- Bounce rate: No increase on gig browsing page

## Non-Goals

- Cursor-based pagination (deferred to post-MVP if needed)
- Infinite scroll / "load more" pattern
- Configurable page size (user preference)
- Pagination on other list views (dashboards, admin pages) - separate changes if needed
