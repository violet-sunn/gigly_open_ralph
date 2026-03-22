# Proposal: Add Consistent Back Button Navigation

## Problem Statement

Several pages in the application lack consistent back button navigation, forcing users to rely on browser back buttons or manually navigate through the main navigation. This creates a disjointed user experience, especially on pages like profile edit, gig creation, admin management pages, and public profiles where users expect a clear way to return to their previous context.

Currently:
- Profile edit page has no back button
- Gig creation page has no back button
- Admin pages use manual "← Back to Dashboard" links instead of the reusable BackButton component
- Public profile page has no back button
- Examples page has no back button

The existing `BackButton` component only handles the `from=browse` context for gig browsing with filter preservation, but doesn't support other navigation contexts.

## Proposed Solution

Extend the existing `BackButton` component to support additional navigation contexts and add it consistently across all pages that need contextual back navigation:

1. **Update BackButton component** to handle new contexts:
   - `from=profile` → navigates to `/dashboard/profile`
   - `from=admin-dashboard` → navigates to `/admin`
   - `from=examples` → navigates to `/dashboard/gigs/examples`
   - `from=dashboard` → navigates to `/dashboard`
   - Preserve existing `from=browse` logic with filter/pagination params

2. **Add BackButton to pages**:
   - Profile edit page (`/profile/edit`)
   - Gig creation page (`/gigs/new`)
   - Admin users page (`/admin/users`)
   - Admin gigs page (`/admin/gigs`)
   - Public profile page (`/profile/[userId]`)
   - Examples page (`/gigs/examples`)

3. **Replace manual back links** in admin pages with BackButton component for consistency

4. **Update navigation links** throughout the app to include appropriate `from` query parameters

## Benefits

- **Consistent UX**: Users have a predictable way to navigate back from any page
- **Context preservation**: Back buttons maintain filter/pagination state where relevant
- **Code reusability**: Single BackButton component handles all navigation contexts
- **Reduced cognitive load**: Users don't need to hunt for navigation options
- **Better mobile experience**: Explicit back buttons are more discoverable than browser controls

## Constraints

- Must preserve existing `from=browse` functionality with filter/pagination params
- BackButton should only render when `from` query parameter is present (graceful degradation)
- Must use client component for `useSearchParams()` hook
- Should maintain consistent styling across all pages

## Non-Goals

- Adding back buttons to pages where they don't make sense (e.g., dashboard, login, register)
- Implementing browser history-based navigation (we use explicit context via query params)
- Adding breadcrumb navigation (separate feature)
- Changing the visual design of the BackButton component

## Success Criteria

- BackButton appears on all specified pages when navigated to with `from` parameter
- Clicking back button navigates to correct destination based on context
- Query parameters are preserved where relevant (browse filters, pagination)
- Manual back links in admin pages are replaced with BackButton component
- All existing tests pass
- No regressions in existing `from=browse` functionality
