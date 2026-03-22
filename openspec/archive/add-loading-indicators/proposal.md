# Change Proposal: Add Loading Indicators

## Problem Statement

The platform currently lacks consistent loading state feedback across async operations, creating poor user experience and potential for duplicate submissions. Users cannot tell when forms are processing, leading to confusion and repeated clicks on submit buttons.

Specific gaps identified:
- Profile edit forms (CLIENT and SPECIALIST) lack loading indicators
- Admin moderation forms (suspend/unsuspend user, close gig) lack loading indicators
- Some forms have loading states but inconsistent UI patterns
- Pages with async data fetching lack Suspense boundaries for loading states
- No visual feedback during slow network conditions

## Proposed Solution

Implement comprehensive loading state management across all async operations:

1. **Audit Phase**: Systematically review all server actions and forms to identify missing loading states
2. **Form Loading States**: Add consistent loading indicators to all forms using React's `useFormStatus()` hook
3. **Consistent UI Pattern**: Standardize loading UI with spinner, disabled state, and contextual text (e.g., "Saving...", "Submitting...", "Loading...")
4. **Duplicate Prevention**: Ensure all submit buttons are disabled during async operations
5. **Page-Level Loading**: Add Suspense boundaries to pages with async data fetching where missing
6. **Testing**: Verify loading states appear correctly during simulated slow network conditions

## Design Constraints

- **MUST** use React's `useFormStatus()` hook for form submission states (Next.js 15 best practice)
- **MUST** disable submit buttons during pending state to prevent duplicate submissions
- **MUST** use consistent loading text patterns across similar operations
- **MUST** maintain existing form functionality and validation
- **SHOULD** use design tokens for loading UI styling
- **SHOULD** add Suspense boundaries only where async data fetching occurs
- **SHOULD NOT** add loading states to operations that complete instantly (< 50ms)

## Success Criteria

1. All forms with server actions display loading indicators during submission
2. All submit buttons are disabled during async operations
3. Loading text is contextual and consistent (e.g., "Saving profile...", "Submitting application...")
4. No duplicate submissions possible when clicking submit button multiple times
5. Pages with async data fetching show loading states via Suspense boundaries
6. Loading states are visually consistent across the platform
7. All existing tests pass without modification
8. New tests verify loading states appear during async operations

## Non-Goals

- Real-time progress indicators (e.g., progress bars, percentage complete)
- Optimistic UI updates (showing success before server confirmation)
- Skeleton screens for complex layouts
- Loading states for read-only operations (viewing data)
- Global loading overlay for navigation transitions

## Impact Assessment

**User Experience**: Significantly improved - users will have clear feedback during async operations and cannot accidentally submit forms multiple times.

**Performance**: Negligible impact - loading states are client-side UI updates with minimal overhead.

**Maintenance**: Low - standardized pattern makes future forms easier to implement correctly.

**Testing**: Moderate - requires new tests for loading state behavior, but pattern is straightforward.

## Dependencies

- React 18+ (already in use)
- Next.js 15+ `useFormStatus()` hook (already in use)
- Existing form components and server actions

## Rollout Plan

1. Implement loading states for profile edit forms (high user visibility)
2. Implement loading states for admin moderation forms (admin-only, lower risk)
3. Add Suspense boundaries to pages with async data fetching
4. Audit remaining forms and add loading states where missing
5. Add comprehensive test coverage
6. Deploy to production

## Alternatives Considered

**Alternative 1: Global loading overlay**
- Rejected: Too intrusive, blocks entire UI, poor UX for form-specific operations

**Alternative 2: Optimistic UI updates**
- Rejected: Adds complexity, requires rollback logic, out of scope for MVP

**Alternative 3: Custom loading state management (useState)**
- Rejected: `useFormStatus()` is the Next.js 15 recommended approach, more reliable
