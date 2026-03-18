# Change Proposal: UI Token Foundation

## Change ID
`ui-token-foundation`

## Status
Proposed

## Summary
Integrate the design-tokens.json file into the Tailwind CSS configuration and CSS variables system to establish a single source of truth for design tokens, replacing manual token definitions with automated parsing and generation.

## Problem Statement

Currently, design tokens are managed manually across multiple files:
- `tailwind.config.ts` contains hardcoded color values (navy, blue, gray, success, warning, error)
- `app/globals.css` contains a small subset of manually defined CSS variables
- `docs/DESIGN_SYSTEM.md` documents the manual color system
- `openspec/specs/ui/design-tokens.json` exists as a comprehensive design token source (134KB) but is not integrated into the build system

This creates several problems:
1. **Duplication and drift**: Token values are defined in multiple places and can become inconsistent
2. **Manual maintenance burden**: Adding or updating tokens requires manual changes across multiple files
3. **Incomplete coverage**: Only a subset of tokens from design-tokens.json are currently accessible in the codebase
4. **No single source of truth**: Designers and developers reference different token sources

## Proposed Solution

Establish design-tokens.json as the single source of truth by:

1. **Token Parser Script**: Create a Node.js script (`scripts/parse-design-tokens.js`) that:
   - Reads and parses `openspec/specs/ui/design-tokens.json`
   - Extracts colors, typography, spacing, and effects tokens
   - Transforms nested token structure into flat, usable formats
   - Generates TypeScript/JavaScript objects for Tailwind config
   - Generates CSS variable declarations for globals.css

2. **Tailwind Config Integration**: Update `tailwind.config.ts` to:
   - Import parsed tokens from the parser script
   - Extend the theme with color tokens (accessible as `bg-[token-name]`, `text-[token-name]`)
   - Extend the theme with typography tokens (font sizes, weights, line heights)
   - Extend the theme with spacing tokens
   - Extend the theme with effect tokens (shadows, borders)
   - Maintain backward compatibility with existing hardcoded tokens during transition

3. **CSS Variables Generation**: Update `app/globals.css` to:
   - Include comprehensive CSS variable declarations for all semantic tokens
   - Organize variables by category (colors, typography, spacing, effects)
   - Maintain existing manually defined variables for backward compatibility
   - Use CSS variable naming convention: `--[category]-[subcategory]-[name]`

4. **Documentation Update**: Update `docs/DESIGN_SYSTEM.md` to:
   - Document the token naming conventions from design-tokens.json
   - Provide usage examples for accessing tokens via Tailwind classes
   - Provide usage examples for accessing tokens via CSS variables
   - Document the token parser script and how to regenerate tokens
   - Maintain migration guide for transitioning from manual to automated tokens

## Constraints

1. **Zero Breaking Changes**: This is a foundation change that MUST NOT break existing functionality
   - All existing Tailwind classes must continue to work
   - All existing CSS variables must remain available
   - All existing components must render identically
   - Full test suite must pass without modifications

2. **Backward Compatibility**: Existing manual token definitions MUST be preserved during transition
   - Hardcoded colors in tailwind.config.ts remain available
   - Manually defined CSS variables in globals.css remain available
   - Components can gradually migrate to new tokens

3. **Build Performance**: Token parsing MUST NOT significantly impact build times
   - Parser script should execute in < 1 second
   - Parsed tokens should be cached or generated at build time, not runtime
   - Consider using a build-time script or Tailwind plugin

4. **Token Naming**: Generated token names MUST be intuitive and follow Tailwind conventions
   - Color tokens: `bg-surface-level-0`, `text-neutral-strong`, `border-brand-default`
   - Typography tokens: `text-headline-xl`, `font-body-md`
   - Spacing tokens: `p-spacing-md`, `gap-spacing-lg`
   - Effect tokens: `shadow-elevation-md`, `rounded-radius-lg`

5. **Documentation and Discoverability**: Token usage MUST be clearly documented and discoverable by future changes
   - Developers should understand how to access tokens
   - Designers should understand how tokens map to Figma
   - Migration path from manual to automated tokens should be clear
   - **Project.md MUST be updated** to document the token system as a core convention
   - **Main UI spec MUST be updated** to establish token usage as the standard approach for all future UI work

## Success Criteria

1. **Token Accessibility**: All tokens from design-tokens.json are accessible via:
   - Tailwind utility classes (e.g., `bg-surface-level-0`, `text-neutral-strong`)
   - CSS variables (e.g., `var(--bg-surface-level-0)`, `var(--text-neutral-strong)`)

2. **Zero Test Failures**: Full test suite passes without modifications
   - All 521 existing tests pass
   - No visual regressions in existing components
   - No console errors or warnings

3. **Documentation Complete**:
   - DESIGN_SYSTEM.md includes token naming conventions, usage examples, and regeneration instructions
   - project.md documents the token system under "Conventions" or "Stack"
   - openspec/specs/ui/spec.md (main spec) establishes token usage as the standard approach

4. **Parser Script Functional**: `scripts/parse-design-tokens.js` can be executed manually to regenerate tokens

## Non-Goals

1. **Component Migration**: This change does NOT migrate existing components to use new tokens
   - Components continue using existing manual tokens
   - Migration to new tokens is a separate future change

2. **Token Validation**: This change does NOT validate token values or enforce design system rules
   - Token validation is a separate future enhancement

3. **Dynamic Theming**: This change does NOT implement runtime theme switching
   - Tokens are static at build time
   - Dynamic theming is a separate future feature

4. **Token Documentation UI**: This change does NOT create a visual token browser or documentation site
   - Documentation is text-based in DESIGN_SYSTEM.md
   - Visual documentation is a separate future enhancement

## Risks and Mitigations

**Risk**: Token parser script fails to handle complex nested token structures
- **Mitigation**: Start with simple token categories (colors, basic typography), expand incrementally
- **Mitigation**: Add comprehensive error handling and validation in parser script

**Risk**: Generated token names conflict with existing Tailwind classes
- **Mitigation**: Use namespaced token names (e.g., `dt-` prefix for design tokens)
- **Mitigation**: Test token generation against existing Tailwind class list

**Risk**: Build time increases significantly
- **Mitigation**: Cache parsed tokens in a generated file
- **Mitigation**: Only regenerate tokens when design-tokens.json changes

**Risk**: Developers continue using manual tokens instead of automated tokens
- **Mitigation**: Clear documentation and examples
- **Mitigation**: Future change to deprecate manual tokens with warnings

## Timeline

This is a foundation change that establishes infrastructure for future token-based work. Estimated effort: 1-2 days.

## Dependencies

- Node.js (already available in project)
- Tailwind CSS (already configured)
- TypeScript (already configured)

## Related Changes

- Future: Migrate existing components to use automated tokens
- Future: Add token validation and linting
- Future: Implement dynamic theming
- Future: Create visual token documentation
