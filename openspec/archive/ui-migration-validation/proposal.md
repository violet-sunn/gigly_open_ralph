# Change Proposal: ui-migration-validation

## Why

The design token system has been implemented to replace hardcoded color values throughout the codebase. Before declaring the migration complete, we MUST validate that:

1. **Zero old color references remain** in active code (excluding documentation and archives)
2. **All tests pass** with the new token-based styling
3. **Visual consistency is maintained** across all pages
4. **Documentation reflects completion status** accurately

This validation is critical because:
- Incomplete migration creates maintenance debt (two styling systems)
- Hardcoded colors bypass the design system's single source of truth
- Mixed styling approaches confuse developers and lead to inconsistent UX
- Accessibility and theming depend on consistent token usage

## What

This change implements a comprehensive validation suite to verify 100% completion of the token migration from old hardcoded colors (bg-navy-900, bg-navy-800, text-gray-*, border-gray-*, placeholder:text-gray-400, focus:ring-offset-navy-900) to the design token system.

**Deliverables:**
1. Grep audit scripts that search for old color patterns in active code
2. Test suite verification (all 521 tests must pass)
3. Visual regression testing across all pages
4. Updated DESIGN_SYSTEM.md with migration completion status
5. Documentation of any intentional hardcoded fallbacks with rationale

**Success Criteria:**
- Grep commands return zero matches for old colors in active code
- All 521 tests pass
- Visual comparison shows consistent styling
- Accessibility audit passes
- Documentation is updated and accurate

## Constraints

- **Scope exclusions**: `docs/` and `archive/` directories are excluded from validation (may contain historical references)
- **No new features**: This is validation only, not implementation
- **Non-breaking**: Validation must not modify existing functionality
- **Deterministic**: All validation steps must be reproducible and automatable

## Non-Goals

- Implementing new design tokens (tokens are already defined)
- Migrating remaining code (migration should already be complete)
- Creating new UI components
- Refactoring unrelated code
