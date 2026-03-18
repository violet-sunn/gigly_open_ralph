# Proposal: Create UI Overhaul Planning Document

## Change ID
`create-ui-overhaul-plan`

## Type
Planning Document Creation

## Problem Statement

The project has a comprehensive design token system (`openspec/specs/ui/design-tokens.json`) with 134KB of design tokens including colors, typography, spacing, gradients, and component styles. However, there's no clear roadmap for how to systematically apply these tokens across the entire application.

**Current State:**
- Design tokens exist in JSON format but may not be fully integrated into the codebase
- Multiple archived UI changes show previous attempts at design system work
- Current implementation uses a dark theme with navy backgrounds and blue accents
- DESIGN_SYSTEM.md documents some patterns, but may not reflect the full token system
- No systematic plan exists for migrating all UI components to use the token system

**Gap:**
Without a strategic plan, UI improvements will be ad-hoc and inconsistent. We need a planning document that:
1. Analyzes the current state of token integration
2. Identifies which pages/components need token-based styling
3. Defines the order and dependencies for UI overhaul work
4. Provides executable ralphy-plan commands for each change

## Solution Approach

Create a planning document at `openspec/planning/ui-overhaul.md` that provides a comprehensive roadmap for implementing the token-based design system across the entire application.

**The planning document will:**
- Analyze current UI implementation vs. design token system
- Identify gaps in token usage across pages and components
- Define a phased approach to UI overhaul (foundation → components → pages)
- Provide specific ralphy-plan commands for each change
- Establish dependencies and ordering for implementation
- Consider risks and mitigation strategies
- **Assess testing friction**: Identify which tests might break and provide strategies to minimize test updates

**Analysis Required:**
1. Review `openspec/specs/ui/design-tokens.json` structure and contents
2. Audit current UI implementation in `app/` directory
3. Review `tailwind.config.ts` for token integration
4. Check `app/globals.css` for CSS variable usage
5. Identify which components use token-based styling vs. ad-hoc classes
6. Review archived UI changes to understand previous approaches
7. **Analyze testing friction**: Identify tests that might break due to UI changes (selectors, snapshots, visual regression, accessibility)

## Why This Matters

From `project.md`:
- "Professional B2B Experience" is a core design principle
- "Quality Over Quantity" positioning requires polished UI
- MVP validation depends on users trusting the platform
- Poor UI undermines the "quality over quantity" positioning

A systematic UI overhaul plan ensures:
- Consistent visual language across all pages
- Maintainable design system for future development
- Professional appearance that inspires trust in B2B clients
- Efficient implementation with clear priorities and dependencies

## Scope

**In Scope:**
- Analysis of current token system and UI implementation
- Identification of all pages/components needing token-based styling
- Phased implementation plan with dependencies
- Executable ralphy-plan commands for each change
- Risk assessment and mitigation strategies
- **Testing friction analysis**: Assessment of test breakage risk and mitigation strategies for each change

**Out of Scope:**
- Actual implementation of UI changes (that comes after planning)
- Changes to design tokens themselves (tokens are the source of truth)
- New features or functionality (UI styling only)
- Changes to business logic or data models

## Constraints

1. **Zero Breaking Changes**: All existing functionality must work identically
2. **Test Compatibility**: All existing tests must pass (with minimal updates to selectors/snapshots if necessary)
3. **Accessibility**: WCAG compliance must be maintained or improved
4. **Performance**: No degradation in page load or render times
5. **Token Fidelity**: All styling must use tokens from design-tokens.json
6. **Test Stability**: Minimize test friction by preserving data-testid attributes and semantic HTML structure

## Dependencies

- Requires: `openspec/specs/ui/design-tokens.json` (exists)
- Requires: `openspec/specs/planning/spec.md` (exists)
- Blocks: All UI overhaul implementation changes

## Success Criteria

1. Planning document exists at `openspec/planning/ui-overhaul.md`
2. Document follows the format specified in `openspec/specs/planning/spec.md`
3. Document includes analysis of current state and gaps
4. Document provides ralphy-plan commands for each identified change
5. Document defines clear dependencies and implementation order
6. Document addresses risks and provides mitigation strategies
7. **Document includes testing friction assessment** for each change with specific mitigation strategies

## Estimated Effort

**Planning Phase**: 2-3 hours
- 1 hour: Analyze design tokens and current implementation
- 1 hour: Identify gaps and define changes
- 30 min: Write planning document with ralphy-plan commands
- 30 min: Review and refine

**Implementation Phase** (after planning): TBD based on planning document findings
