# Change: Add Loading Indicators

**Status:** Proposed  
**Created:** 2026-03-23  
**Change ID:** add-loading-indicators

## Summary

Add comprehensive loading state indicators to all async operations (form submissions, data fetching) to improve user experience and prevent duplicate submissions.

## Quick Links

- [Proposal](./proposal.md) - Why this change is needed and what it solves
- [Tasks](./tasks.md) - Step-by-step implementation checklist
- [UI Spec Delta](./specs/ui/spec.md) - Detailed requirements and acceptance criteria

## Scope

**In Scope:**
- Loading indicators for all form submissions (profile edit, admin moderation, etc.)
- Consistent loading UI patterns (spinner, disabled state, contextual text)
- Duplicate submission prevention via disabled buttons
- Suspense boundaries for pages with async data fetching
- Testing under slow network conditions

**Out of Scope:**
- Real-time progress indicators (progress bars, percentages)
- Optimistic UI updates
- Skeleton screens for complex layouts
- Global loading overlays

## Implementation Checklist

- [ ] Task 1: Audit all server actions and forms for loading state presence
- [ ] Task 2: Add loading indicators to profile edit form
- [ ] Task 3: Add loading indicators to admin moderation forms
- [ ] Task 4: Audit and add loading states to remaining forms
- [ ] Task 5: Add Suspense boundaries to pages with async data fetching
- [ ] Task 6: Standardize loading UI patterns with shared LoadingButton component
- [ ] Task 7: Test loading states under slow network conditions
- [ ] Task 8: Update documentation

## Testing Strategy

- **Unit Tests:** LoadingButton component behavior
- **Integration Tests:** Loading states during server action execution
- **E2E Tests:** Loading indicators visible in browser, duplicate prevention, slow network simulation

## Next Steps

To implement this change:

1. Read the [proposal](./proposal.md) to understand the problem and solution
2. Review the [UI spec delta](./specs/ui/spec.md) for detailed requirements
3. Follow the [tasks](./tasks.md) checklist for implementation
4. Run `/ralphy-implement add-loading-indicators` to begin implementation
