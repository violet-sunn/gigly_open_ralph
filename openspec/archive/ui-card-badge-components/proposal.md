# Change Proposal: Migrate Card and Badge Components to Token-Based Styling

## Change ID
`ui-card-badge-components`

## Status
Proposed

## Overview
Migrate card and badge components throughout the application to use design token-based styling instead of hardcoded Tailwind color classes. This change aligns the UI implementation with the design system defined in `openspec/specs/ui/design-tokens.json` and improves maintainability and consistency.

## Problem Statement

Currently, card and badge components use hardcoded Tailwind classes like `bg-navy-800`, `border-gray-700`, `bg-success-500/20`, etc. This approach has several issues:

1. **Inconsistency**: Manual color values are scattered across components without semantic meaning
2. **Maintainability**: Updating the design system requires finding and replacing hardcoded values across multiple files
3. **Design System Misalignment**: The project has a design token system (`design-tokens.json`) that is not being utilized
4. **Semantic Clarity**: Classes like `bg-navy-800` don't convey intent (is this a card? a surface? a container?)

## Proposed Solution

Migrate card and badge components to use semantic design tokens that align with the design system. This includes:

1. **Gig Cards**: Cards displayed on browse page, client dashboard, specialist dashboard
2. **Application Cards**: Application display cards on gig detail pages
3. **Status Badges**: Status indicators for gigs (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID) and applications (PENDING, ACCEPTED, REJECTED, WITHDRAWN)

### Token Mapping Strategy

Based on the design system documentation:

**Card Components:**
- Background: `bg-surface-level-0` or `bg-surface-level-1` (instead of `bg-navy-800`)
- Border: `border-neutral-weak` (instead of `border-gray-700`)
- Hover background: `hover:bg-surface-level-2` (instead of `hover:bg-navy-700`)
- Shadow: Use existing shadow tokens (`shadow-md`)

**Status Badges:**
- Use semantic color tokens for status-specific styling
- Maintain opacity patterns for backgrounds (e.g., `/20` for subtle backgrounds)
- Ensure consistent border and text color combinations

### Affected Components

1. `app/(protected)/gigs/page.tsx` - Gig browse cards (25 per page)
2. `app/(protected)/dashboard/page.tsx` - Client dashboard gig cards
3. `app/(protected)/dashboard/SpecialistDashboardTabs.tsx` - Specialist dashboard cards (Active Work, Pending Applications, Archive)
4. `app/(protected)/gigs/[id]/page.tsx` - Gig detail page (application cards, status badges)

## Constraints

1. **Backward Compatibility**: All existing functionality must be preserved
2. **Visual Consistency**: The visual appearance should remain nearly identical (only token-based)
3. **No Structural Changes**: Card content structure and text must not change
4. **Interactive Affordances**: Hover states, click handlers, and transitions must be maintained
5. **Test Coverage**: Existing tests must continue to pass

## Non-Goals

1. **Complete Design System Migration**: This change focuses only on cards and badges, not the entire UI
2. **New Design Tokens**: We use existing tokens from `design-tokens.json`, not creating new ones
3. **Component Refactoring**: No structural refactoring of components, only styling updates
4. **Performance Optimization**: No performance changes, purely a styling migration

## Success Criteria

1. All card components use semantic design tokens instead of hardcoded classes
2. All status badges use semantic color tokens
3. Visual appearance remains consistent with current implementation
4. All click handlers and interactive states work correctly
5. Existing tests pass without modification
6. No regressions in gig browsing, dashboard, or gig detail pages

## Risks and Mitigations

**Risk**: Design tokens may not provide exact color matches
**Mitigation**: Review design-tokens.json to ensure appropriate tokens exist; document any necessary adjustments

**Risk**: Token-based classes may not be generated correctly by Tailwind
**Mitigation**: Verify token parsing script has run and generated-tokens.js is up to date

**Risk**: Visual regressions due to subtle color differences
**Mitigation**: Manual visual testing of all affected pages before and after migration

## Dependencies

- Design token system must be properly configured (`scripts/parse-design-tokens.js` must have been run)
- Tailwind config must include generated tokens
- No changes to design-tokens.json required (use existing tokens)

## Timeline Estimate

- Implementation: 2-3 hours
- Testing: 1-2 hours
- Total: 3-5 hours
