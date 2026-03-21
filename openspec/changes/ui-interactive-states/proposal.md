# Change Proposal: UI Interactive States Token Migration

## Change ID
`ui-interactive-states`

## Status
Proposed

## Summary
Migrate interactive states (hover, focus, active) from hardcoded color values to token-based colors across all UI components. This change addresses the remaining hardcoded `focus:ring-offset-navy-900` values and establishes a clear strategy for hover states.

## Problem Statement

The codebase currently has inconsistent interactive state styling:

1. **Focus ring offsets use hardcoded values**: 8 files use `focus:ring-offset-navy-900` instead of token-based values
2. **Hover states lack clear strategy**: Some components use hardcoded `hover:bg-navy-700` without documentation on when to use tokens vs. hardcoded values
3. **Accessibility risk**: Inconsistent focus indicators may not be visible on all backgrounds
4. **Maintenance burden**: Hardcoded values make it difficult to maintain consistent interactive states across the application

## Motivation

### Why Now?
- The design token system is already in place and being used for backgrounds, borders, and text colors
- Interactive states are the last major area with hardcoded color values
- Accessibility compliance requires consistent, visible focus indicators
- This change completes the token migration started in previous changes

### Why This Approach?
- **Token-first strategy**: Use design tokens wherever they exist to maintain consistency with the design system
- **Pragmatic fallbacks**: Allow hardcoded values for hover states where no appropriate token exists (e.g., `hover:bg-navy-700` for subtle hover effects)
- **Accessibility-first**: Ensure all focus indicators meet WCAG AA contrast requirements
- **Preserve behavior**: No functional changes, only visual consistency improvements

## Scope

### In Scope
1. Replace all `focus:ring-offset-navy-900` with token-based focus ring offsets (8 files)
2. Document hover state strategy in UI spec
3. Update all interactive elements: buttons, links, cards, inputs
4. Ensure focus indicators remain visible for accessibility
5. Preserve all click handlers and transitions

### Out of Scope
- Creating new design tokens (use existing tokens only)
- Changing interactive behavior or functionality
- Modifying E2E test selectors or assertions
- Redesigning component layouts

## Affected Components

### Files Requiring Changes (8 files)
1. `app/register/page.tsx` - Submit button focus ring
2. `app/login/page.tsx` - Submit button focus ring
3. `app/page.tsx` - CTA buttons focus rings (3 instances)
4. `app/(protected)/profile/page.tsx` - Edit profile link focus ring
5. `app/(protected)/profile/edit/ProfileEditForm.tsx` - Save button focus ring
6. `app/(protected)/gigs/[id]/apply-form.tsx` - Apply button focus ring
7. `app/(protected)/gigs/new/gig-form.tsx` - Post gig button focus ring
8. `app/(protected)/dashboard/page.tsx` - Dashboard CTA button focus ring

### Interactive Elements Affected
- Primary action buttons (submit, save, post)
- Secondary action buttons (cancel, back)
- Text links (navigation, inline links)
- Form inputs (text, textarea, select)
- Cards with hover states
- Navigation items

## Constraints

### Technical Constraints
- Must use existing design tokens from `openspec/specs/ui/design-tokens.json`
- Must maintain WCAG AA contrast ratios for focus indicators (≥3:1 for UI components)
- Must preserve all existing functionality and behavior
- Must not break any existing E2E tests

### Design Constraints
- Focus ring offset should use `bg-surface-level-0` token (the page background color)
- Hover states should use tokens where available, hardcoded fallbacks where needed
- Focus indicators must be visible on all background surfaces

### Business Constraints
- Zero functional regressions
- No changes to user workflows or interactions
- All existing tests must pass without modification

## Success Criteria

### Acceptance Criteria
1. All 8 files with `focus:ring-offset-navy-900` updated to use token-based focus ring offsets
2. Hover state strategy documented in UI spec with clear guidelines
3. All interactive elements use consistent token-based styling
4. Focus indicators visible and meet WCAG AA contrast requirements
5. All click handlers and transitions preserved
6. All E2E tests pass without modification
7. Keyboard navigation works correctly across all pages
8. Visual regression testing confirms no unintended changes

### Testing Requirements
- Run full E2E test suite for all user flows
- Verify keyboard navigation on all pages
- Check focus indicators are visible on all backgrounds
- Test hover states on all interactive elements
- Verify transitions and animations still work
- Manual accessibility testing with keyboard-only navigation

## Risks & Mitigation

### Risk: Focus indicators not visible on some backgrounds
**Mitigation**: Use `bg-surface-level-0` as focus ring offset, which matches the page background and ensures contrast

### Risk: Breaking existing E2E tests
**Mitigation**: Only change CSS classes, not HTML structure or data attributes. Tests should not be affected.

### Risk: Hover states look different after migration
**Mitigation**: Document clear strategy: use tokens where available, preserve hardcoded values where no token exists

## Dependencies

### Upstream Dependencies
- Design token system must be in place (already completed)
- `openspec/specs/ui/design-tokens.json` must contain required tokens

### Downstream Dependencies
None - this is a visual-only change with no functional impact

## Rollback Plan

If issues are discovered after implementation:
1. Revert the 8 file changes (simple git revert)
2. No database migrations or data changes required
3. No API changes or breaking changes

## Timeline Estimate

- Implementation: 2-3 hours
- Testing: 1-2 hours
- Total: 3-5 hours

## Alternatives Considered

### Alternative 1: Create new design tokens for all interactive states
**Rejected**: Would require design system changes and token regeneration. Current tokens are sufficient.

### Alternative 2: Keep hardcoded values
**Rejected**: Inconsistent with design token strategy and makes maintenance harder.

### Alternative 3: Remove focus ring offsets entirely
**Rejected**: Focus ring offsets improve visibility on dark backgrounds. Removing them would hurt accessibility.

## References

- Design token system: `openspec/specs/ui/design-tokens.json`
- UI specification: `openspec/specs/ui/spec.md`
- WCAG 2.1 Focus Visible: https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html
