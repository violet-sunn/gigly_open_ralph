# Change Proposal: UI Page Backgrounds Token Migration

## Overview

Migrate all page-level background colors from the manual `bg-navy-900` class to the design token `bg-surface-level-0` to align with the automated design token system and ensure consistency across the application.

## Problem Statement

Currently, 17 files across the codebase use the hardcoded `bg-navy-900` class for page backgrounds. This creates several issues:

1. **Inconsistency with design token system**: The project has adopted an automated design token system (`openspec/specs/ui/design-tokens.json`) as the single source of truth, but page backgrounds still use manual color definitions.

2. **Maintenance burden**: Manual color values require individual updates across multiple files when design changes occur, increasing the risk of inconsistencies.

3. **Semantic clarity**: `bg-navy-900` describes the color implementation, while `bg-surface-level-0` describes the semantic purpose (base surface level), making the code more maintainable and self-documenting.

## Proposed Solution

Replace all instances of `bg-navy-900` used for page backgrounds with `bg-surface-level-0` across:

- **Auth pages** (2 files): `/register`, `/login`
- **Homepage** (1 file): `/`
- **Dashboard pages** (1 file): `/dashboard`
- **Gig pages** (1 file): `/gigs`
- **Admin pages** (3 files): `/admin`, `/admin/users`, admin layout
- **Shared components** (3 files): PaginationControls, admin forms
- **Documentation** (2 files): DESIGN_SYSTEM.md, UI spec

Total: 17 files requiring updates.

## Constraints

1. **Visual consistency**: The `bg-surface-level-0` token MUST be visually similar or identical to the current `#0A0E27` (navy-900) color to avoid visual regressions.

2. **Zero functional changes**: This is a pure styling migration. All existing functionality, DOM structure, and user interactions MUST remain unchanged.

3. **Accessibility preservation**: Text contrast ratios MUST continue to meet WCAG AA standards after the migration.

4. **Test suite stability**: All 521 existing tests MUST pass without modification, confirming no behavioral changes.

## Non-Goals

- Migrating other color classes (borders, text colors, hover states) - those remain in scope for separate changes
- Updating component-level backgrounds (cards, forms) - already covered by previous token migrations
- Changing the actual color value - this is a token substitution only

## Success Criteria

1. All 17 files updated to use `bg-surface-level-0` instead of `bg-navy-900`
2. Visual regression testing confirms no visible changes to page backgrounds
3. All 521 tests pass without modification
4. Contrast ratios verified to meet WCAG AA standards
5. Build completes successfully with no warnings

## Risk Assessment

**Low Risk**: This is a straightforward find-and-replace operation with clear success criteria. The design token system is already in place and functioning correctly for other UI elements.

**Mitigation**: Comprehensive testing (unit, integration, E2E) will catch any unexpected issues before deployment.
