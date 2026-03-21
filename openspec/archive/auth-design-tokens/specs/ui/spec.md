# UI Specification Delta: Auth Design Tokens

This spec delta adds design tokens required for the auth screen overhaul based on Figma design node 4100-385.

## ADDED Requirements

### Requirement: Parser Extracts Border-Radius Tokens
The design token parser MUST extract border-radius tokens from design-tokens.json and make them available in Tailwind config and CSS variables.

#### Scenario: Parser extracts border-radius tokens
- GIVEN border-radius tokens exist in design-tokens.json
- WHEN `node scripts/parse-design-tokens.js` is executed
- THEN the parser MUST extract border-radius tokens from the appropriate section
- AND the tokens MUST be added to the `borderRadius` object in generated-tokens.js
- AND the tokens MUST be added as CSS variables in generated-tokens.css
- AND the extraction logic MUST follow the same pattern as color and shadow token extraction

### Requirement: Border-Radius Tokens for Auth Components
The design token system MUST include border-radius tokens for auth screen components to match Figma specifications.

#### Scenario: Border-radius token structure in JSON
- GIVEN the design-tokens.json file is being updated
- WHEN border-radius tokens are added
- THEN the tokens MUST be in a dedicated section (e.g., `numbers.borderRadius` or `effect.borderRadius`)
- AND the tokens MUST follow the same structure as existing tokens (type, value, extensions)
- AND the tokens MUST be named consistently (e.g., "10", "20", "25" to match spacing naming)

#### Scenario: Border-radius token for buttons (10px)
- GIVEN border-radius tokens are properly structured in design-tokens.json
- WHEN the parser extracts tokens
- THEN a 10px border-radius token MUST be available
- AND the token MUST generate a Tailwind class or be usable via CSS variable
- AND the token MUST be documented for button usage

#### Scenario: Border-radius token for cards (20px)
- GIVEN border-radius tokens are properly structured in design-tokens.json
- WHEN the parser extracts tokens
- THEN a 20px border-radius token MUST be available
- AND the token MUST generate a Tailwind class or be usable via CSS variable
- AND the token MUST be documented for card usage

#### Scenario: Border-radius token for containers (25px)
- GIVEN border-radius tokens are properly structured in design-tokens.json
- WHEN the parser extracts tokens
- THEN a 25px border-radius token MUST be available
- AND the token MUST generate a Tailwind class or be usable via CSS variable
- AND the token MUST be documented for container usage

### Requirement: Parser Extracts Spacing Tokens
The design token parser MUST extract spacing tokens from design-tokens.json and make them available in Tailwind config and CSS variables.

#### Scenario: Parser extracts spacing tokens
- GIVEN spacing tokens exist in numbers.spacing section
- WHEN `node scripts/parse-design-tokens.js` is executed
- THEN the parser MUST extract spacing tokens from numbers.spacing
- AND the tokens MUST be added to the `spacing` object in generated-tokens.js
- AND the tokens MUST be added as CSS variables in generated-tokens.css
- AND the extraction logic MUST convert token names to pixel values (e.g., "300" -> "24px")

### Requirement: Spacing Tokens for Auth Layout
The design token system MUST include spacing tokens for auth screen layout to match Figma specifications.

#### Scenario: Spacing token for 24px exists (internal gaps)
- GIVEN the design-tokens.json file contains numbers.spacing section
- WHEN spacing tokens are verified
- THEN a 24px spacing token MUST exist (spacing-300)
- AND the token MUST be extracted by the parser
- AND the token MUST be available as Tailwind spacing classes
- AND the token MUST be available as a CSS variable

#### Scenario: Spacing token for 40px exists (padding)
- GIVEN the design-tokens.json file contains numbers.spacing section
- WHEN spacing tokens are verified
- THEN a 40px spacing token MUST exist (spacing-500)
- AND the token MUST be extracted by the parser
- AND the token MUST be available as Tailwind spacing classes
- AND the token MUST be available as a CSS variable

#### Scenario: Spacing token for 48px added (gap)
- GIVEN the design-tokens.json file is being updated
- WHEN spacing tokens are verified
- THEN a 48px spacing token MUST be added to numbers.spacing (following the scale: 2, 4, 6, 8, 12, 24, 32, 40, 48, 80)
- AND the token MUST follow the same structure as existing spacing tokens
- AND the token MUST be named consistently (e.g., "600" to fit between 500 and 1000)
- AND the token MUST be extracted by the parser
- AND the token MUST be available as Tailwind spacing classes
- AND the token MUST be available as a CSS variable

### Requirement: Color Primitive for Primary Blue
The design token system MUST include #0088FF as a standalone color primitive for use in semantic tokens.

#### Scenario: Primary blue color primitive exists
- GIVEN the design-tokens.json file is being updated
- WHEN color primitives are verified
- THEN #0088FF MUST exist as a color primitive (not just in gradients)
- AND the primitive MUST be in the appropriate color family (e.g., `color-primitives.dark.blue` or similar)
- AND the primitive MUST be referenceable by semantic tokens

#### Scenario: Primary blue semantic token for buttons
- GIVEN #0088FF exists as a color primitive
- WHEN semantic tokens are configured
- THEN a semantic token MUST reference #0088FF for primary button backgrounds
- AND the semantic token MUST generate appropriate Tailwind classes
- AND the semantic token MUST be available as a CSS variable

### Requirement: Token Regeneration and Build Verification
Design token changes MUST be properly regenerated and verified to work in the build system.

#### Scenario: Tailwind config regeneration
- GIVEN design-tokens.json has been updated
- WHEN `node scripts/parse-design-tokens.js` is executed
- THEN `scripts/generated-tokens.js` MUST be regenerated with new tokens
- AND the file MUST contain valid JavaScript/TypeScript syntax
- AND new tokens MUST be present in the Tailwind theme extension

#### Scenario: CSS variables regeneration
- GIVEN design-tokens.json has been updated
- WHEN `node scripts/parse-design-tokens.js` is executed
- THEN `scripts/generated-tokens.css` MUST be regenerated with new tokens
- AND the file MUST contain valid CSS syntax
- AND new tokens MUST be present as CSS custom properties

#### Scenario: Build succeeds with new tokens
- GIVEN generated token files have been updated
- WHEN `npm run build` is executed
- THEN the build MUST complete successfully without errors
- AND no TypeScript errors related to token usage MUST occur
- AND no Tailwind CSS errors MUST occur

### Requirement: Documentation of Auth Token Usage
The design system documentation MUST explain how to use new tokens for auth components.

#### Scenario: Border-radius token documentation
- GIVEN new border-radius tokens have been added
- WHEN docs/DESIGN_SYSTEM.md is updated
- THEN the documentation MUST include examples of using border-radius tokens
- AND the documentation MUST specify which Tailwind classes are available
- AND the documentation MUST show CSS variable usage

#### Scenario: Auth component token usage examples
- GIVEN new tokens have been added for auth components
- WHEN docs/DESIGN_SYSTEM.md is updated
- THEN the documentation MUST include a section on auth component styling
- AND the documentation MUST show which tokens to use for cards, buttons, and containers
- AND the documentation MUST include code examples with actual Tailwind classes

## MODIFIED Requirements

None. This change only adds new tokens without modifying existing ones.

## REMOVED Requirements

None. This change maintains backward compatibility with all existing tokens.
