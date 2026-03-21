# Change Proposal: UI Text Color Token Migration

## Overview

Migrate all text colors from manual `text-gray-*` classes to design token-based `text-neutral-*` classes across the entire application. This change establishes consistent typography hierarchy using the automated design token system.

## Motivation

**Current State:**
- Text colors use manual Tailwind classes (`text-gray-300`, `text-gray-400`, `text-gray-500`)
- 196 instances across 32 component files
- No semantic meaning in color names (gray-300 vs gray-400 doesn't indicate hierarchy)
- Manual colors are not synced with design system tokens

**Problems:**
1. **Inconsistent hierarchy**: `text-gray-300`, `text-gray-400`, and `text-gray-500` are used interchangeably without clear semantic distinction
2. **Design system drift**: Manual colors don't reflect the automated design token system already in use for backgrounds and borders
3. **Maintenance burden**: Changes to text color hierarchy require manual find-replace across 32 files
4. **Unclear intent**: Developers must guess whether to use gray-300, gray-400, or gray-500 for secondary text

**Desired State:**
- All text colors use semantic design tokens (`text-neutral-strong`, `text-neutral-weak`)
- Clear hierarchy: strong = primary text (headings, body), weak = secondary/tertiary text (labels, metadata)
- Consistent with existing token usage for `bg-surface-level-*` and `border-neutral-*`
- Single source of truth in `design-tokens.json`

## Scope

**In Scope:**
- Replace `text-gray-300` with `text-neutral-strong` (primary text: headings, body content, important labels)
- Replace `text-gray-400` and `text-gray-500` with `text-neutral-weak` (secondary text: metadata, timestamps, helper text)
- Update all 32 affected files across:
  - Auth pages (login, register)
  - Dashboard pages (client, specialist)
  - Gig pages (browse, detail, create)
  - Profile pages (view, edit, public)
  - Admin pages (dashboard, users, gigs)
  - Shared components (navigation, notifications, pagination)
- Verify contrast ratios meet WCAG AA standards on `bg-surface-level-0` backgrounds
- Visual regression testing to ensure readability

**Out of Scope:**
- Other gray color classes (borders, backgrounds) - already migrated or not applicable
- White text (`text-white`) - remains unchanged for maximum contrast headings
- Semantic colors (`text-error-500`, `text-success-400`) - already using correct tokens
- Placeholder text colors - will be addressed in separate change if needed

## Token Mapping

| Current Class | New Token | Color Value | Usage |
|--------------|-----------|-------------|-------|
| `text-gray-300` | `text-neutral-strong` | rgba(255, 255, 255, 1.00) | Primary text: headings, body content, important labels |
| `text-gray-400` | `text-neutral-weak` | rgba(178, 178, 178, 1.00) | Secondary text: metadata, timestamps, helper text |
| `text-gray-500` | `text-neutral-weak` | rgba(178, 178, 178, 1.00) | Tertiary text: subtle labels, secondary metadata |

**Rationale:**
- `text-neutral-strong` (white) provides maximum readability for primary content
- `text-neutral-weak` (light gray) creates clear visual hierarchy for supporting information
- Two-tier system is simpler than three-tier (gray-300/400/500) and matches design token availability

## Affected Areas

**High-Impact Pages (frequent user interaction):**
1. Dashboard (client and specialist views) - 20+ instances
2. Gig detail page - 15+ instances
3. Gig browse page - 10+ instances
4. Profile pages - 8+ instances

**Medium-Impact Pages:**
5. Gig creation form - 12+ instances
6. Login/Register pages - 6+ instances
7. Admin pages - 10+ instances

**Low-Impact Components:**
8. Navigation header - 3+ instances
9. Notification components - 5+ instances
10. Shared UI components - 8+ instances

## Risks & Mitigation

**Risk 1: Reduced contrast for secondary text**
- **Impact**: `text-neutral-weak` (rgba(178, 178, 178)) may have lower contrast than `text-gray-300` (rgba(209, 213, 219))
- **Mitigation**:
  - Verify WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
  - Run automated accessibility tests
  - Visual review of all affected pages
  - Revert to `text-gray-400` if contrast is insufficient (keep manual class)

**Risk 2: Visual regression**
- **Impact**: Text hierarchy may appear different, affecting user comprehension
- **Mitigation**:
  - Side-by-side visual comparison before/after
  - Test with actual users if significant changes detected
  - Gradual rollout if needed (page by page)

**Risk 3: Breaking existing tests**
- **Impact**: Integration/E2E tests may rely on specific text colors for assertions
- **Mitigation**:
  - Run full test suite after migration
  - Update test selectors if needed (should use semantic selectors, not color classes)
  - All 493 existing tests must pass

**Risk 4: Inconsistent application**
- **Impact**: Missing some instances during find-replace could create inconsistency
- **Mitigation**:
  - Automated grep-based verification after migration
  - Code review checklist
  - Zero remaining `text-gray-300|400|500` instances in final commit

## Success Criteria

1. **Zero manual text-gray classes**: No `text-gray-300`, `text-gray-400`, or `text-gray-500` remain in component files
2. **All tests pass**: 493 existing tests pass without modification
3. **Contrast compliance**: All text meets WCAG AA standards (verified via automated tools)
4. **Visual consistency**: Side-by-side comparison shows no degradation in readability
5. **Build success**: `npm run build` completes without errors
6. **Type safety**: No TypeScript errors introduced

## Implementation Strategy

**Approach: Automated find-replace with manual verification**

1. **Phase 1: Automated replacement** (bulk changes)
   - Use grep to identify all instances
   - Replace `text-gray-300` → `text-neutral-strong`
   - Replace `text-gray-400` → `text-neutral-weak`
   - Replace `text-gray-500` → `text-neutral-weak`

2. **Phase 2: Manual review** (quality assurance)
   - Review each file for semantic correctness
   - Verify primary vs secondary text distinction
   - Check for edge cases (conditional classes, dynamic classes)

3. **Phase 3: Testing** (validation)
   - Run full test suite
   - Visual regression testing
   - Contrast ratio verification
   - Browser testing (Chrome, Firefox, Safari)

4. **Phase 4: Documentation** (knowledge transfer)
   - Update DESIGN_SYSTEM.md with text color guidelines
   - Add migration notes to project.md
   - Document token usage patterns

## Alternatives Considered

**Alternative 1: Keep manual gray classes**
- **Pros**: No migration effort, no risk of visual regression
- **Cons**: Continues design system drift, no semantic meaning, harder to maintain
- **Decision**: Rejected - inconsistent with existing token migration strategy

**Alternative 2: Three-tier token system (strong/medium/weak)**
- **Pros**: More granular control, matches current three-tier usage
- **Cons**: Design tokens only provide strong/weak, would require custom tokens
- **Decision**: Rejected - should use available design tokens, not create custom ones

**Alternative 3: Gradual migration (page by page)**
- **Pros**: Lower risk, easier to test, can revert individual pages
- **Cons**: Temporary inconsistency, longer timeline, more complex tracking
- **Decision**: Rejected - bulk migration is feasible given automated tooling and comprehensive tests

## Dependencies

- Design token system already in place (`scripts/generated-tokens.js`)
- Tailwind config already includes token-based colors
- No changes to design-tokens.json required (tokens already exist)
- No changes to token parser script required

## Timeline Estimate

- Phase 1 (Automated replacement): 30 minutes
- Phase 2 (Manual review): 1-2 hours
- Phase 3 (Testing): 1 hour
- Phase 4 (Documentation): 30 minutes
- **Total**: 3-4 hours

## Rollback Plan

If critical issues are discovered post-migration:

1. **Immediate**: Revert the commit (single atomic commit for easy rollback)
2. **Short-term**: Identify specific problematic instances, revert to manual classes for those only
3. **Long-term**: Re-evaluate token mapping, potentially request new tokens from design team
