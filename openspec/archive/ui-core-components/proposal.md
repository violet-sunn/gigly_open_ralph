# Change Proposal: ui-core-components

## Summary

Migrate core reusable UI component patterns (buttons, inputs/textareas, links) to use design tokens from `openspec/specs/ui/design-tokens.json` instead of hardcoded Tailwind color classes. This change establishes consistency with the design system and enables centralized theme management.

## Problem Statement

Currently, the codebase uses hardcoded Tailwind color classes throughout UI components:
- Buttons use `bg-blue-500`, `bg-green-500`, `bg-red-500`, etc.
- Inputs/textareas use `bg-navy-800`, `border-gray-600`, `text-white`, etc.
- Links use `text-blue-500`, `text-blue-600`, etc.

This creates several issues:
1. **Inconsistency**: Same semantic meaning (e.g., "primary button") uses different color values across files
2. **Maintenance burden**: Changing the theme requires updating dozens of files
3. **Design system disconnect**: `design-tokens.json` exists but isn't being used consistently
4. **Semantic clarity**: `bg-blue-500` doesn't convey intent as clearly as `bg-brand-primary`

## Proposed Solution

Systematically migrate core UI patterns to use design token-based Tailwind classes:

### Scope
- **Button components**: Primary, secondary, danger/destructive buttons
- **Input/textarea components**: Text inputs, textareas, error states
- **Link components**: Standard links, navigation links, hover states

### Approach
1. Audit current usage patterns across 27+ files identified via grep
2. Map hardcoded colors to semantic design tokens
3. Update components file-by-file, preserving all functionality
4. Verify no visual regressions or test failures

### Constraints
- **MUST preserve all semantic HTML** (button, input, a tags)
- **MUST preserve all existing class names** that tests might depend on
- **MUST maintain exact text content** for labels and placeholders
- **MUST NOT break any existing functionality**
- **MUST maintain accessibility** (focus states, ARIA attributes, keyboard navigation)

## Non-Goals

- Creating new component abstractions or shared component files
- Refactoring component structure or logic
- Updating non-core components (badges, cards, modals)
- Implementing new design token features
- Changing visual appearance (should be pixel-perfect match)

## Success Criteria

1. All button patterns use token-based colors (e.g., `bg-brand-primary` instead of `bg-blue-500`)
2. All input/textarea patterns use token-based styling
3. All link patterns use token-based colors and hover states
4. All integration tests pass without modification
5. All E2E tests pass without modification
6. Visual regression testing shows no differences
7. Accessibility audit shows no regressions

## Risks & Mitigation

**Risk**: Design tokens may not be fully integrated into Tailwind config
- **Mitigation**: Verify token availability before migration; update Tailwind config if needed

**Risk**: Tests may depend on specific class names
- **Mitigation**: Preserve all existing classes; only change color values

**Risk**: Visual regressions due to token mapping errors
- **Mitigation**: Careful manual review of each component; side-by-side comparison

## Dependencies

- `openspec/specs/ui/design-tokens.json` (existing)
- `docs/DESIGN_SYSTEM.md` (existing)
- Tailwind config with design token integration (may need verification)

## Estimated Effort

- Audit and mapping: 2-3 hours
- Implementation: 6-8 hours (27+ files)
- Testing and verification: 3-4 hours
- **Total**: 11-15 hours

## Rollout Plan

1. Verify design token availability in Tailwind config
2. Create token mapping document (hardcoded → token)
3. Migrate buttons (highest impact, easiest to verify)
4. Migrate inputs/textareas
5. Migrate links
6. Run full test suite after each category
7. Manual visual review of all affected pages
