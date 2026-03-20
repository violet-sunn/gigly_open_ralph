# Change Proposal: UI Admin Pages Token Migration

## Change ID
`ui-admin-pages`

## Status
Proposed

## Overview
Migrate admin pages (admin dashboard, user management, gig management) to token-based styling following the design patterns established in Dashboard (Phase 5). This ensures visual consistency across the entire application and maintains the established design system.

## Problem Statement
The current admin pages use hardcoded color values (bg-navy-800, border-gray-700, etc.) instead of design tokens from the design system. This creates visual inconsistency with the recently migrated Dashboard pages and makes it difficult to maintain a cohesive design language across the application.

## Proposed Solution
Systematically replace hardcoded styling with design tokens across all three admin pages, implementing:

1. **Card Hierarchy**: Statistics cards and filter panels use `bg-surface-level-1`, table rows maintain current structure
2. **Status Badge System**: Consistent semantic colors matching Dashboard patterns (user status: suspended=red, active=green; gig status: semantic colors by state)
3. **Spacing Rhythm**: Section gaps 24-48px (gap-6 to gap-12), card padding 24px (p-6), consistent with Dashboard
4. **Action Button Colors**: Primary actions solid blue (#1379f3), moderation actions (suspend=red, unsuspend=green, close=red)

## Scope

### In Scope
- Admin dashboard page (`app/admin/page.tsx`)
  - Statistics cards (Total Users, Total Gigs, Suspended Users, Closed Gigs)
  - Navigation cards (User Management, Gig Management)
- User management page (`app/admin/users/page.tsx`)
  - Filter panel card
  - Table container
  - Status badges (verify semantic colors already applied)
  - Action buttons (Suspend/Unsuspend)
- Gig management page (`app/admin/gigs/page.tsx`)
  - Filter panel card
  - Table container
  - Status badges (migrate to semantic colors)
  - Action buttons (Close Gig)
- Spacing and padding consistency
- All filter labels, button text, and table structure preserved exactly

### Out of Scope
- Navigation header styling (already migrated)
- Layout container background (already migrated)
- Other pages beyond admin section
- Functional changes to admin logic
- Database schema changes
- New features or functionality
- Filter/pagination logic changes

## Design Reference
This change follows the patterns established in the Dashboard migration (Phase 5):
- Card hierarchy: `bg-surface-level-1` for primary containers
- Status badges: semantic color system (success/warning/error tokens)
- Spacing rhythm: gap-6 for cards, p-6 padding, gap-9 to gap-12 for sections
- CTAs: solid blue for primary actions, semantic colors for moderation actions

## Constraints
- MUST preserve all existing functionality (no behavioral changes)
- MUST preserve all filter labels, button text, and table structure exactly as-is
- MUST maintain accessibility (ARIA labels, keyboard navigation)
- MUST pass existing E2E tests (admin-moderation)
- MUST use design tokens from `openspec/specs/ui/design-tokens.json`
- MUST NOT introduce new dependencies or libraries
- MUST maintain pagination functionality

## Success Criteria
1. All admin page cards use token-based colors (bg-surface-level-1, border-neutral-weak)
2. Status badges use semantic color system consistently with Dashboard
3. Spacing follows defined rhythm (gap-6, p-6, gap-9 to gap-12)
4. Action buttons use appropriate colors (blue for primary, red for moderation)
5. All existing E2E tests pass without modification
6. Visual hierarchy matches Dashboard patterns
7. All filters, pagination, and actions work identically to current implementation

## Testing Strategy
- Run `admin-moderation` E2E test suite
- Manual testing of suspend/unsuspend user actions
- Manual testing of close gig functionality
- Manual testing of filters on both user and gig management pages
- Manual testing of pagination on both pages
- Visual verification against Dashboard patterns
- Accessibility audit (keyboard navigation, screen reader)

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing tests | High | Run tests frequently during implementation, preserve exact DOM structure |
| Visual regression | Medium | Side-by-side comparison with Dashboard, stakeholder review |
| Accessibility degradation | Medium | Maintain ARIA labels, test with keyboard navigation |
| Filter/pagination breakage | High | Preserve all query parameter logic, test thoroughly |

## Dependencies
- Design tokens must be defined in `openspec/specs/ui/design-tokens.json`
- Tailwind config must include token-based utility classes
- Dashboard migration (Phase 5) must be complete (provides design patterns)
- No external dependencies required

## Rollout Plan
1. Implement admin dashboard styling
2. Implement user management page styling
3. Implement gig management page styling
4. Run E2E test suite
5. Manual testing of all admin functionality
6. Visual verification against Dashboard patterns
7. Merge to main branch

## Related Changes
- `ui-dashboard-pages` (Phase 5) - Establishes design patterns this change follows
- `ui-navigation-layout` - Navigation header already migrated
- Future: Admin audit log page (if added)
