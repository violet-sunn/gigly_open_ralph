# Change Proposal: UI Profile Pages Token Migration

## Change ID
`ui-profile-pages`

## Status
Proposed

## Overview
Migrate profile pages (CLIENT profile view, profile edit for both roles, and public profile pages) to token-based styling following the design patterns established in Dashboard (Phase 5). The SPECIALIST profile view page was already migrated in the `specialist-profile-ui-tokens` change and serves as the reference implementation.

## Problem Statement
Profile pages currently have inconsistent styling:
- SPECIALIST profile view uses token-based styling (already migrated)
- CLIENT profile view uses hardcoded colors (bg-navy-900, bg-navy-800, border-gray-700)
- Profile edit pages use hardcoded colors and don't match the visual layout of view pages
- Public profile pages use hardcoded colors

This creates visual inconsistency across the application and makes it difficult to maintain design coherence as the system evolves.

## Proposed Solution
Systematically replace hardcoded styling with design tokens across profile pages, implementing:

1. **Card Hierarchy**: Main cards use `bg-surface-level-1`, nested sections use `bg-surface-level-2` for visual depth
2. **Spacing Rhythm**: Section gaps 36-48px (gap-9 to gap-12), card padding 20-24px (p-5/p-6), card gaps 24px (gap-6)
3. **Form Styling**: Input fields and textareas consistent with Dashboard form elements
4. **CTA Prominence**: Primary actions (Save Profile) use solid blue (#1379f3), edit links use text blue
5. **Layout Consistency**: Profile edit pages match the visual structure of their respective view pages

## Scope

### In Scope
- CLIENT profile view page (`app/(protected)/profile/page.tsx` - CLIENT section only)
  - Header card with avatar and stats
  - 2-column grid layout for company information and active projects
  - Token-based card hierarchy and spacing
- Profile edit page (`app/(protected)/profile/edit/page.tsx` and `ProfileEditForm` component)
  - Header card matching view page structure
  - 2-column grid layout for form fields
  - Token-based form styling (inputs, textareas, buttons)
  - Both CLIENT and SPECIALIST edit forms
- Public profile page (`app/(protected)/profile/[userId]/page.tsx`)
  - Token-based styling for both SPECIALIST and CLIENT public profiles
  - Consistent card hierarchy with view pages
- All form field names, labels, and validation preserved exactly
- Profile completion logic preserved

### Out of Scope
- SPECIALIST profile view page (already migrated in `specialist-profile-ui-tokens`)
- Navigation header styling (separate change)
- Dashboard profile completion hints (already using tokens)
- New profile features or functionality
- Database schema changes
- Profile image upload functionality

## Design Reference
Following patterns established in:
- Dashboard pages (`ui-dashboard-pages` change)
- SPECIALIST profile view (`specialist-profile-ui-tokens` change)

## Constraints
- MUST preserve all existing functionality (no behavioral changes)
- MUST preserve all form field names, labels, and validation rules
- MUST maintain profile completion logic
- MUST pass existing profile-related E2E tests
- MUST use design tokens from `openspec/specs/ui/design-tokens.json`
- MUST NOT introduce new dependencies or libraries
- MUST maintain accessibility (ARIA labels, keyboard navigation, form validation)

## Success Criteria
1. CLIENT profile view uses token-based colors matching SPECIALIST profile view
2. Profile edit pages use 2-column grid layout matching view pages
3. Profile edit forms use token-based styling for all inputs and buttons
4. Public profile pages use token-based styling
5. Spacing follows defined rhythm (gap-9 to gap-12, p-5/p-6, gap-6)
6. Primary CTAs use solid blue (#1379f3)
7. Edit links use text blue styling
8. All existing profile E2E tests pass without modification
9. Visual consistency with Dashboard and SPECIALIST profile view
10. Form submission and validation work identically

## Testing Strategy
- Run existing profile-related E2E tests
- Manual testing of profile view/edit flows for both roles
- Manual testing of public profile pages
- Verify profile completion hints still work
- Verify form validation and submission
- Accessibility audit (keyboard navigation, screen reader, form labels)

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking profile edit form submission | High | Preserve exact form field names and validation logic, test thoroughly |
| Visual regression on CLIENT profile | Medium | Follow SPECIALIST profile patterns, side-by-side comparison |
| Breaking profile completion hints | Medium | Test dashboard integration, preserve completion logic |
| Accessibility degradation | Medium | Maintain ARIA labels, test with keyboard navigation |

## Dependencies
- Design tokens defined in `openspec/specs/ui/design-tokens.json`
- Tailwind config includes token-based utility classes
- SPECIALIST profile view serves as reference implementation

## Rollout Plan
1. Implement CLIENT profile view styling
2. Implement profile edit page layout and styling (both roles)
3. Implement public profile page styling (both roles)
4. Run E2E test suites
5. Visual verification against SPECIALIST profile and Dashboard
6. Merge to main branch

## Related Changes
- `specialist-profile-ui-tokens` (completed) - SPECIALIST profile view migration
- `ui-dashboard-pages` (completed) - Dashboard design patterns
- Navigation header token migration (future)
- Gig pages token migration (future)
