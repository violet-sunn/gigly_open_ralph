# Change Proposal: Auth Design Tokens

## Context

The auth screen is being overhauled based on a new Figma design (https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385). The current design token system is missing several color values, border-radius tokens, and spacing tokens that are required to implement the new auth screen design with 1:1 visual fidelity.

## Problem

The existing `openspec/specs/ui/design-tokens.json` file lacks:

1. **Color tokens**: While most colors exist, `#0088FF` (primary-blue) is only present in gradient stops, not as a standalone primitive that can be referenced in semantic tokens
2. **Border-radius tokens**: Current tokens only include 8px, 12px, 16px, and 32px. The auth design requires 10px (buttons), 20px (cards), and 25px (container)
3. **Spacing tokens**: Need to verify and potentially add 24px, 40px, and 47px spacing values for consistent padding and gaps
4. **Semantic token mappings**: Need to ensure proper semantic tokens reference the correct primitives for auth components

## Proposed Solution

**Phase 1: Update Parser to Support Spacing and Border-Radius**

1. Update `scripts/parse-design-tokens.js` to extract spacing tokens from `numbers.spacing` section
2. Create border-radius token extraction logic (either from a new section or using existing structure)
3. Ensure extracted tokens are properly added to Tailwind config and CSS variables

**Phase 2: Add Missing Tokens to design-tokens.json**

1. Add `#0088FF` as a color primitive in `color-primitives.dark.blue` (or appropriate location)
2. Add border-radius tokens in a dedicated section: 10px, 20px, 25px (following existing token structure)
3. Add spacing token for 48px (fits the scale better than 47px: 2, 4, 6, 8, 12, 24, 32, 40, 48, 80)
4. Verify 24px (spacing-300) and 40px (spacing-500) already exist

**Phase 3: Regenerate and Verify**

1. Run `node scripts/parse-design-tokens.js` to regenerate token files
2. Verify tokens are available as Tailwind classes (e.g., `rounded-[var(--radius-20)]`, `gap-[48px]`)
3. Document token usage patterns for auth components in `docs/DESIGN_SYSTEM.md`

## Constraints

- MUST maintain backward compatibility with existing token references
- MUST follow existing token naming conventions in design-tokens.json
- MUST update parser script to extract spacing and border-radius tokens (currently not extracted)
- MUST use Figma MCP tool to verify exact color values from the design
- MUST use 48px instead of 47px to fit existing spacing scale (2, 4, 6, 8, 12, 24, 32, 40, 48, 80)
- MUST regenerate both `scripts/generated-tokens.js` and `scripts/generated-tokens.css`
- MUST verify build succeeds after token changes
- MUST ensure tokens are available in Tailwind (not just in JSON)
- SHOULD document which Tailwind classes become available after token addition

## Success Criteria

1. All required color values are present in design-tokens.json as primitives
2. Border-radius tokens (10px, 20px, 25px) are available as Tailwind classes
3. Spacing tokens (24px, 40px, 47px) are available as Tailwind classes
4. `npm run build` succeeds without errors
5. Visual comparison with Figma design shows matching colors, spacing, and border-radius
6. Documentation clearly explains how to use new tokens for auth components

## Non-Goals

- Implementing the actual auth screen UI components (separate change)
- Modifying existing token values (only additions)
- Changing the token parsing script logic
- Adding tokens beyond what's needed for the auth screen
