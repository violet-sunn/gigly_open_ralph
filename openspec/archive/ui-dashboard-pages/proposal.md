# Change Proposal: UI Dashboard Pages Token Migration

## Change ID
`ui-dashboard-pages`

## Status
Proposed

## Overview
Migrate CLIENT and SPECIALIST dashboard pages to token-based styling using the Figma prototype as design reference. This change establishes the visual hierarchy and component patterns that subsequent UI phases will follow.

## Problem Statement
The current dashboard pages use hardcoded color values (bg-navy-800, border-gray-700, etc.) instead of design tokens from the design system. This creates inconsistency with the Figma design prototype and makes it difficult to maintain visual coherence across the application as the design system evolves.

## Proposed Solution
Systematically replace hardcoded styling with design tokens across both CLIENT and SPECIALIST dashboards, implementing:

1. **Card Hierarchy**: Primary cards (My Gigs section) use `bg-surface-level-1`, nested order/gig cards use `bg-surface-level-2` for visual depth
2. **Status Badge System**: Consistent semantic colors (Created=gray #333643/#b5b5b5, In Progress=green #044329/#43c78f)
3. **Spacing Rhythm**: Section gaps 36-48px (gap-9 to gap-12), card padding 20px (p-5/p-6), card gaps 24px (gap-6)
4. **CTA Prominence**: Primary actions solid blue (#1379f3), sidebar CTA full-width blue card with gradient

## Scope

### In Scope
- CLIENT dashboard page (`app/(protected)/dashboard/page.tsx`)
  - My Gigs section card hierarchy
  - Post Gig CTA styling
  - Sidebar cards (Find Project, Finances, Messages)
- SPECIALIST dashboard page (`app/(protected)/dashboard/page.tsx`)
  - Tabs component (`SpecialistDashboardTabs.tsx`)
  - Active Work, Pending Applications, Archive tabs
  - Sidebar cards (Find Project, Finances, Messages)
- Status badge color system
- Spacing and padding consistency
- All tab labels and button text preserved exactly

### Out of Scope
- Navigation header styling (separate change)
- Notification bell styling (separate change)
- Layout container background (separate change)
- Other pages beyond dashboard
- Functional changes to dashboard logic
- Database schema changes
- New features or functionality

## Design Reference
Figma prototype: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4032-181

This prototype defines the visual hierarchy, spacing rhythm, and color system that this change implements.

## Constraints
- MUST preserve all existing functionality (no behavioral changes)
- MUST preserve all tab labels and button text exactly as-is
- MUST maintain accessibility (ARIA labels, keyboard navigation)
- MUST pass existing E2E tests (client-journey, specialist-journey)
- MUST use design tokens from `openspec/specs/ui/design-tokens.json`
- MUST NOT introduce new dependencies or libraries

## Success Criteria
1. All dashboard cards use token-based colors (bg-surface-level-1, bg-surface-level-2)
2. Status badges use semantic color system consistently
3. Spacing follows defined rhythm (gap-9 to gap-12, p-5/p-6, gap-6)
4. Primary CTAs use solid blue (#1379f3)
5. Sidebar CTA uses full-width blue card with gradient
6. All existing E2E tests pass without modification
7. Visual hierarchy matches Figma prototype conceptually
8. Tab switching and navigation work identically to current implementation

## Testing Strategy
- Run `client-journey` E2E test suite
- Run `specialist-journey` E2E test suite
- Visual verification against Figma prototype
- Manual testing of tab switching
- Manual testing of navigation flows
- Accessibility audit (keyboard navigation, screen reader)

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Design tokens missing required colors | High | Audit design-tokens.json before implementation, add missing tokens if needed |
| Breaking existing tests | High | Run tests frequently during implementation, preserve exact DOM structure |
| Visual regression | Medium | Side-by-side comparison with Figma prototype, stakeholder review |
| Accessibility degradation | Medium | Maintain ARIA labels, test with keyboard navigation |

## Dependencies
- Design tokens must be defined in `openspec/specs/ui/design-tokens.json`
- Tailwind config must include token-based utility classes
- No external dependencies required

## Rollout Plan
1. Implement CLIENT dashboard styling
2. Implement SPECIALIST dashboard styling
3. Run E2E test suites
4. Visual verification against Figma prototype
5. Merge to main branch

## Related Changes
- Navigation header token migration (future)
- Notification bell token migration (future)
- Layout container token migration (future)
- Gig detail page token migration (future)
