# Change Proposal: UI Gig Pages Token Migration

## Change ID
`ui-gig-pages`

## Status
Proposed

## Overview
Migrate gig-related pages (browse, detail, creation form) to token-based styling following the design patterns established in Dashboard (Phase 5). Apply the same visual hierarchy, status badge system, spacing rhythm, and CTA prominence patterns to ensure visual consistency across the application.

## Problem Statement
The current gig pages use hardcoded color values (bg-navy-800, border-gray-700, bg-white, etc.) instead of design tokens from the design system. This creates visual inconsistency with the recently migrated Dashboard pages and makes it difficult to maintain coherent design language across the application.

## Proposed Solution
Systematically replace hardcoded styling with design tokens across all gig pages, implementing:

1. **Card Hierarchy**: Primary containers use `bg-surface-level-1`, nested gig cards use `bg-surface-level-2` for visual depth
2. **Status Badge System**: Consistent semantic colors (OPEN=gray, IN_PROGRESS=green, REVIEW=warning, COMPLETED=success, PAID=success)
3. **Spacing Rhythm**: Section gaps 36-48px (gap-9 to gap-12), card padding 20-24px (p-5/p-6), card gaps 24px (gap-6)
4. **Filter Sidebar**: Apply sidebar pattern similar to Dashboard sidebar widgets
5. **CTA Prominence**: Primary actions solid blue (#1379f3), secondary actions text links

## Scope

### In Scope
- Gig browse page (`app/(protected)/gigs/page.tsx`)
  - Filter panel component (`GigFilters.tsx`)
  - Gig card grid with token-based styling
  - Pagination controls styling
- Gig detail page (`app/(protected)/gigs/[id]/page.tsx`)
  - Two-column layout with token-based cards
  - Status badges with semantic colors
  - Application cards hierarchy
  - Message section styling
  - Action forms (apply, submit work, approve, mark as paid)
- Gig creation form (`app/(protected)/gigs/new/gig-form.tsx`)
  - Visual sections with token-based styling
  - Form field styling consistency
  - Character counters and validation warnings
- All form field names, labels, placeholders preserved exactly
- All filter functionality preserved

### Out of Scope
- Navigation header styling (already migrated)
- Notification bell styling (already migrated)
- Admin gig management pages (separate change)
- Functional changes to gig logic
- Database schema changes
- New features or functionality

## Design Reference
Following patterns established in `ui-dashboard-pages` (Phase 5):
- Card hierarchy: bg-surface-level-1 → bg-surface-level-2
- Status badges: semantic color system
- Spacing: gap-9/gap-12, p-5/p-6, gap-6
- CTAs: solid blue primary, text link secondary

## Constraints
- MUST preserve all existing functionality (no behavioral changes)
- MUST preserve all form field names, labels, placeholders
- MUST preserve all filter functionality
- MUST maintain accessibility (ARIA labels, keyboard navigation)
- MUST pass existing integration tests (gig-creation, gig-filtering, application-flow)
- MUST use design tokens from `openspec/specs/ui/design-tokens.json`
- MUST NOT introduce new dependencies or libraries

## Success Criteria
1. All gig pages use token-based colors (bg-surface-level-1, bg-surface-level-2, border-neutral-weak)
2. Status badges use semantic color system consistently across all pages
3. Spacing follows defined rhythm (gap-9/gap-12, p-5/p-6, gap-6)
4. Filter panel uses token-based styling matching Dashboard sidebar pattern
5. Primary CTAs use solid blue (#1379f3), secondary actions use text links
6. All existing integration tests pass without modification
7. Visual consistency with Dashboard pages
8. All form functionality works identically to current implementation

## Testing Strategy
- Run `gig-creation` integration test suite
- Run `gig-filtering` integration test suite
- Run `application-flow` integration test suite
- Visual verification against Dashboard pages for consistency
- Manual testing of all gig workflows (browse, apply, create, submit, approve)
- Accessibility audit (keyboard navigation, screen reader)

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing tests | High | Run tests frequently during implementation, preserve exact DOM structure |
| Filter functionality regression | High | Preserve all filter logic, test all filter combinations |
| Form validation issues | Medium | Preserve all validation logic, test all form scenarios |
| Visual inconsistency with Dashboard | Medium | Side-by-side comparison, use exact same token values |
| Accessibility degradation | Medium | Maintain ARIA labels, test with keyboard navigation |

## Dependencies
- Design tokens must be defined in `openspec/specs/ui/design-tokens.json`
- Tailwind config must include token-based utility classes
- Dashboard pages migration (ui-dashboard-pages) completed
- No external dependencies required

## Rollout Plan
1. Implement gig browse page styling (filter panel, gig cards)
2. Implement gig detail page styling (two-column layout, status badges, forms)
3. Implement gig creation form styling (visual sections)
4. Run integration test suites
5. Visual verification against Dashboard pages
6. Merge to main branch

## Related Changes
- `ui-dashboard-pages` (Phase 5) - established design patterns
- `ui-navigation-layout` - navigation header token migration (completed)
- Admin gig management pages (future)
