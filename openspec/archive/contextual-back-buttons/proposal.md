# Change Proposal: Contextual Back Buttons

## Problem Statement

The project has transitioned from fixed "back to x" links to a tabs-based navigation system. However, there are two related navigation issues that create a disorienting user experience:

1. **Missing back affordance**: Users navigating from list views to detail pages (e.g., dashboard → gig detail, browse gigs → gig detail) lack a clear way to return to their previous context.

2. **Incorrect navigation highlighting**: When a user clicks a gig from their dashboard, they navigate to `/dashboard/gigs/[id]`, which causes the top navigation to incorrectly highlight "Browse Gigs" as the active tab. This is misleading because the user came from the dashboard, not from the browse gigs page. The navigation state should reflect the user's context, not just the URL structure.

## Proposed Solution

Implement contextual navigation that helps users understand where they are and easily return to their previous context:

1. **Contextual back buttons**: Add back buttons on detail pages that intelligently return users to their previous list view within the same logical section
2. **Context-aware navigation highlighting**: Fix the top navigation to highlight the correct tab based on where the user came from, not just the URL path

Both features will use the same navigation context mechanism (query parameters) to track where the user came from.

### Back Button Requirements

The back button should:
1. **Be context-aware**: Detect where the user navigated from (dashboard, browse gigs, etc.)
2. **Preserve state**: Maintain filters, pagination, and tab selection when returning to list views
3. **Be scoped to logical sections**: Only work within related pages (not a universal browser back button)
4. **Be visually consistent**: Use a standard back button design across all applicable pages

### Navigation Highlighting Requirements

The top navigation should:
1. **Reflect user context**: Highlight "Dashboard" when viewing a gig from dashboard, "Browse Gigs" when viewing from browse page
2. **Use navigation context**: Read the `from` query parameter to determine which tab should be active
3. **Graceful fallback**: If no context is available, don't highlight any tab (or default to Dashboard)

## Scope

### In Scope

- Back button on gig detail page (`/dashboard/gigs/[id]`) that returns to:
  - Client dashboard (`/dashboard`) when navigated from "My Gigs"
  - Specialist dashboard (`/dashboard`) when navigated from Active Work/Pending Applications/Archive tabs
  - Browse gigs page (`/dashboard/gigs`) when navigated from the gig list
- Preserve URL state (filters, pagination, search params) when returning to browse gigs
- Preserve tab selection when returning to specialist dashboard
- Visual affordance (back arrow icon + text label)
- Fix navigation highlighting on gig detail pages to reflect navigation context:
  - Highlight "Dashboard" tab when `from=dashboard`
  - Highlight "Browse Gigs" tab when `from=browse`
  - No highlight when no context is available

### Out of Scope

- Universal back button that works across all pages
- Back button on profile pages (profile → dashboard is not within the same logical section)
- Browser history manipulation beyond standard Next.js Link behavior
- Back button on gig creation form (separate workflow)
- Back button on admin pages (separate concern)

## Implementation Strategy

Use URL query parameters to track navigation context:

1. **From Dashboard**: Add `?from=dashboard` query param when linking to gig detail
2. **From Browse Gigs**: Add `?from=browse` query param, preserve existing filters/pagination
3. **From Specialist Dashboard Tabs**: Add `?from=dashboard&tab=active|pending|archive` to preserve tab state

The gig detail page will read these params and render an appropriate back button with the correct destination URL.

## User Experience

### Before
- User clicks gig from dashboard → views gig detail → must use browser back or navigate via header links
- User clicks gig from dashboard → "Browse Gigs" tab is incorrectly highlighted (misleading)
- User clicks gig from browse page → views gig detail → must use browser back or navigate via header links
- No clear affordance for returning to the previous list view

### After
- User clicks gig from dashboard → views gig detail → "Dashboard" tab is highlighted → sees "← Back to Dashboard" button → returns to dashboard
- User clicks gig from browse page with filters → views gig detail → "Browse Gigs" tab is highlighted → sees "← Back to Browse Gigs" button → returns to browse page with filters intact
- User clicks gig from specialist dashboard Active Work tab → views gig detail → "Dashboard" tab is highlighted → sees "← Back to Dashboard" button → returns to dashboard with Active Work tab selected
- Navigation state always reflects where the user came from, not just the URL structure

## Technical Considerations

- Use Next.js `<Link>` component for back navigation (not `router.back()`) for better control
- Query params approach is simple, stateless, and works with server components
- Preserve all existing query params when constructing back URLs
- Back button should be positioned prominently at the top of the detail page
- Graceful fallback: if no `from` param, default to dashboard or hide back button

## Non-Goals

- This is NOT a replacement for browser back button
- This is NOT a breadcrumb navigation system
- This is NOT a universal navigation history tracker
- This does NOT apply to cross-section navigation (e.g., profile → gig detail)

## Success Criteria

1. Users can easily return to their previous list view from gig detail pages
2. Filter and pagination state is preserved when returning to browse gigs
3. Tab selection is preserved when returning to specialist dashboard
4. Back button only appears when navigation context is known
5. Top navigation correctly highlights the tab that reflects where the user came from
6. Navigation highlighting bug is fixed (no more incorrect "Browse Gigs" highlight when coming from dashboard)
7. Implementation is simple, maintainable, and doesn't introduce routing complexity
