# UI Specification Delta: UI Token Foundation

This document describes changes to the UI specification for the `ui-token-foundation` change.

---

## ADDED Requirements

### Requirement: Design Token Parser Script
The system MUST provide a Node.js script that parses design-tokens.json and generates usable token formats for Tailwind and CSS.

#### Scenario: Parser script reads design-tokens.json
- GIVEN the file `openspec/specs/ui/design-tokens.json` exists
- WHEN the parser script `scripts/parse-design-tokens.js` is executed
- THEN it MUST successfully read and parse the JSON file
- AND it MUST NOT throw errors for valid JSON structure

#### Scenario: Parser extracts color tokens
- GIVEN design-tokens.json contains color token definitions
- WHEN the parser processes the file
- THEN it MUST extract all color tokens with their hex values
- AND it MUST flatten nested color structures into dot-notation keys (e.g., `bg.surface.level-0` → `bg-surface-level-0`)
- AND it MUST output color tokens in a format compatible with Tailwind config

#### Scenario: Parser extracts typography tokens
- GIVEN design-tokens.json contains typography token definitions (font sizes, weights, line heights)
- WHEN the parser processes the file
- THEN it MUST extract all typography tokens
- AND it MUST separate font sizes, font weights, and line heights into distinct categories
- AND it MUST convert pixel values to rem values where appropriate (1rem = 16px)

#### Scenario: Parser extracts spacing tokens
- GIVEN design-tokens.json contains spacing token definitions
- WHEN the parser processes the file
- THEN it MUST extract all spacing tokens
- AND it MUST convert pixel values to rem values where appropriate

#### Scenario: Parser extracts effect tokens
- GIVEN design-tokens.json contains effect token definitions (shadows, borders, radii)
- WHEN the parser processes the file
- THEN it MUST extract all effect tokens
- AND it MUST format shadow values as CSS shadow strings
- AND it MUST format border radius values as CSS length values

#### Scenario: Parser generates Tailwind-compatible output
- GIVEN the parser has extracted all tokens
- WHEN it generates output for Tailwind config
- THEN it MUST export a JavaScript object with keys: `colors`, `fontSize`, `fontWeight`, `spacing`, `boxShadow`, `borderRadius`
- AND each category MUST contain key-value pairs compatible with Tailwind theme extension
- AND the output MUST be importable by tailwind.config.ts

#### Scenario: Parser generates CSS variable declarations
- GIVEN the parser has extracted all tokens
- WHEN it generates output for CSS variables
- THEN it MUST generate CSS variable declarations in the format `--[category]-[name]: [value];`
- AND it MUST group variables by category (colors, typography, spacing, effects)
- AND the output MUST be valid CSS that can be inserted into globals.css

#### Scenario: Parser handles missing or invalid tokens gracefully
- GIVEN design-tokens.json contains invalid or missing token definitions
- WHEN the parser processes the file
- THEN it MUST log warnings for invalid tokens
- AND it MUST continue processing valid tokens
- AND it MUST NOT crash or throw unhandled errors

#### Scenario: Parser executes in reasonable time
- GIVEN design-tokens.json is 134KB in size
- WHEN the parser script is executed
- THEN it MUST complete execution in less than 2 seconds
- AND it MUST NOT cause memory issues

**Acceptance Criteria:**
- Script located at `scripts/parse-design-tokens.js`
- Script is executable via `node scripts/parse-design-tokens.js`
- Script reads from `openspec/specs/ui/design-tokens.json`
- Script outputs to `scripts/generated-tokens.js` (Tailwind format)
- Script outputs to `scripts/generated-tokens.css` (CSS variables format)
- Script includes error handling and validation
- Script logs progress and warnings to console
- Script execution time < 2 seconds

---

### Requirement: Tailwind Config Token Integration
The Tailwind configuration MUST import and use parsed design tokens while maintaining backward compatibility.

#### Scenario: Tailwind config imports parsed tokens
- GIVEN the parser script has generated `scripts/generated-tokens.js`
- WHEN `tailwind.config.ts` is loaded
- THEN it MUST successfully import the generated tokens
- AND it MUST NOT throw import errors

#### Scenario: Color tokens accessible via Tailwind classes
- GIVEN parsed color tokens are integrated into Tailwind config
- WHEN a developer uses a color token class (e.g., `bg-surface-level-0`, `text-neutral-strong`)
- THEN the class MUST apply the correct color value from design-tokens.json
- AND the class MUST be available in all color utilities (bg-, text-, border-, etc.)

#### Scenario: Typography tokens accessible via Tailwind classes
- GIVEN parsed typography tokens are integrated into Tailwind config
- WHEN a developer uses a typography token class (e.g., `text-headline-xl`, `font-body-md`)
- THEN the class MUST apply the correct font size, weight, and line height
- AND the class MUST be available in all typography utilities

#### Scenario: Spacing tokens accessible via Tailwind classes
- GIVEN parsed spacing tokens are integrated into Tailwind config
- WHEN a developer uses a spacing token class (e.g., `p-spacing-md`, `gap-spacing-lg`)
- THEN the class MUST apply the correct spacing value
- AND the class MUST be available in all spacing utilities (p-, m-, gap-, etc.)

#### Scenario: Effect tokens accessible via Tailwind classes
- GIVEN parsed effect tokens are integrated into Tailwind config
- WHEN a developer uses an effect token class (e.g., `shadow-elevation-md`, `rounded-radius-lg`)
- THEN the class MUST apply the correct effect value
- AND the class MUST be available in all effect utilities

#### Scenario: Existing manual tokens remain available
- GIVEN Tailwind config previously defined manual tokens (navy, blue, gray, success, warning, error)
- WHEN parsed tokens are integrated
- THEN all existing manual token classes MUST continue to work
- AND no existing components MUST break due to missing classes

#### Scenario: Token naming follows Tailwind conventions
- GIVEN parsed tokens are integrated into Tailwind config
- WHEN a developer views the available token classes
- THEN token names MUST follow Tailwind naming conventions (kebab-case, descriptive)
- AND token names MUST be intuitive and self-documenting

**Acceptance Criteria:**
- `tailwind.config.ts` imports from `scripts/generated-tokens.js`
- Theme extension includes: `colors`, `fontSize`, `fontWeight`, `spacing`, `boxShadow`, `borderRadius`
- All parsed tokens accessible via Tailwind utility classes
- Existing manual tokens preserved in config (backward compatibility)
- No breaking changes to existing Tailwind classes
- Build succeeds without errors or warnings

---

### Requirement: CSS Variables Generation
The globals.css file MUST include comprehensive CSS variable declarations for all semantic tokens.

#### Scenario: CSS variables generated for all token categories
- GIVEN the parser script has generated `scripts/generated-tokens.css`
- WHEN `app/globals.css` is updated
- THEN it MUST include CSS variable declarations for all token categories
- AND variables MUST be organized by category with comments

#### Scenario: Color tokens available as CSS variables
- GIVEN color tokens are defined as CSS variables
- WHEN a developer uses a color variable (e.g., `var(--bg-surface-level-0)`, `var(--text-neutral-strong)`)
- THEN the variable MUST resolve to the correct color value from design-tokens.json
- AND the variable MUST be available in all CSS contexts

#### Scenario: Typography tokens available as CSS variables
- GIVEN typography tokens are defined as CSS variables
- WHEN a developer uses a typography variable (e.g., `var(--font-size-headline-xl)`, `var(--line-height-body-md)`)
- THEN the variable MUST resolve to the correct typography value
- AND the variable MUST be available in all CSS contexts

#### Scenario: Spacing tokens available as CSS variables
- GIVEN spacing tokens are defined as CSS variables
- WHEN a developer uses a spacing variable (e.g., `var(--spacing-md)`, `var(--spacing-lg)`)
- THEN the variable MUST resolve to the correct spacing value
- AND the variable MUST be available in all CSS contexts

#### Scenario: Effect tokens available as CSS variables
- GIVEN effect tokens are defined as CSS variables
- WHEN a developer uses an effect variable (e.g., `var(--shadow-elevation-md)`, `var(--radius-lg)`)
- THEN the variable MUST resolve to the correct effect value
- AND the variable MUST be available in all CSS contexts

#### Scenario: Existing manual CSS variables remain available
- GIVEN globals.css previously defined manual CSS variables
- WHEN generated CSS variables are added
- THEN all existing manual variables MUST remain available
- AND no existing styles MUST break due to missing variables

#### Scenario: CSS variable naming is consistent
- GIVEN CSS variables are generated from design tokens
- WHEN a developer views the variable names
- THEN variable names MUST follow the convention `--[category]-[subcategory]-[name]`
- AND variable names MUST match the token names from design-tokens.json

**Acceptance Criteria:**
- `app/globals.css` includes generated CSS variables in `:root` block
- Variables organized by category with clear comments
- All token categories represented: colors, typography, spacing, effects
- Existing manual CSS variables preserved (backward compatibility)
- No breaking changes to existing CSS variable usage
- Variables accessible in all CSS contexts (components, utilities, etc.)

---

### Requirement: Design System Documentation Update
The DESIGN_SYSTEM.md file MUST document token naming conventions, usage patterns, and regeneration instructions.

#### Scenario: Token naming conventions documented
- GIVEN DESIGN_SYSTEM.md is updated
- WHEN a developer reads the documentation
- THEN it MUST explain the token naming convention from design-tokens.json
- AND it MUST provide examples of token names for each category
- AND it MUST explain how token names map to Tailwind classes and CSS variables

#### Scenario: Tailwind class usage examples provided
- GIVEN DESIGN_SYSTEM.md is updated
- WHEN a developer wants to use design tokens via Tailwind
- THEN the documentation MUST provide clear usage examples
- AND examples MUST cover all token categories (colors, typography, spacing, effects)
- AND examples MUST show real code snippets

#### Scenario: CSS variable usage examples provided
- GIVEN DESIGN_SYSTEM.md is updated
- WHEN a developer wants to use design tokens via CSS variables
- THEN the documentation MUST provide clear usage examples
- AND examples MUST cover all token categories
- AND examples MUST show real CSS code snippets

#### Scenario: Token regeneration instructions provided
- GIVEN DESIGN_SYSTEM.md is updated
- WHEN a developer needs to regenerate tokens after design-tokens.json changes
- THEN the documentation MUST provide step-by-step instructions
- AND instructions MUST include the command to run the parser script
- AND instructions MUST explain what files are generated

#### Scenario: Migration guide provided
- GIVEN DESIGN_SYSTEM.md is updated
- WHEN a developer wants to migrate from manual to automated tokens
- THEN the documentation MUST provide a migration guide
- AND the guide MUST explain the benefits of automated tokens
- AND the guide MUST provide examples of before/after code

**Acceptance Criteria:**
- `docs/DESIGN_SYSTEM.md` includes new section "Design Token System"
- Section documents token naming conventions with examples
- Section provides Tailwind class usage examples for all token categories
- Section provides CSS variable usage examples for all token categories
- Section includes instructions for regenerating tokens
- Section includes migration guide from manual to automated tokens
- Documentation is clear, concise, and actionable

---

### Requirement: Core Project Documentation Update
The project.md and main UI spec MUST be updated to document the token system as a core convention, ensuring future changes discover and use the token system.

#### Scenario: project.md documents token system
- GIVEN openspec/project.md is updated
- WHEN a developer or AI agent reads the project context
- THEN the document MUST include information about the design token system
- AND it MUST explain that design-tokens.json is the single source of truth
- AND it MUST reference DESIGN_SYSTEM.md for detailed usage

#### Scenario: project.md documents token system location
- GIVEN openspec/project.md is updated
- WHEN the "Stack" or "Conventions" section is read
- THEN it MUST mention the token system alongside other core technologies
- AND it MUST explain how tokens are integrated (Tailwind config, CSS variables)

#### Scenario: Main UI spec establishes token usage as standard
- GIVEN openspec/specs/ui/spec.md (main spec) is updated
- WHEN a developer or AI agent reads the UI specification
- THEN the document MUST establish token usage as the standard approach
- AND it MUST state that new UI work SHOULD use design tokens, not hardcoded values
- AND it MUST reference design-tokens.json as the source

#### Scenario: Main UI spec provides token usage guidance
- GIVEN openspec/specs/ui/spec.md (main spec) is updated
- WHEN a developer needs guidance on styling new components
- THEN the spec MUST provide clear guidance on using tokens
- AND it MUST explain when to use Tailwind classes vs CSS variables
- AND it MUST reference DESIGN_SYSTEM.md for detailed examples

#### Scenario: Future changes can discover token system
- GIVEN project.md and main UI spec are updated
- WHEN a future change involves UI work
- THEN the change author MUST be able to discover the token system by reading core documentation
- AND the token system MUST be presented as the standard approach, not an optional enhancement

**Acceptance Criteria:**
- `openspec/project.md` updated with token system documentation
- Token system mentioned in "Stack" or "Conventions" section
- Explains design-tokens.json as single source of truth
- References DESIGN_SYSTEM.md for detailed usage
- `openspec/specs/ui/spec.md` (main spec) updated with token usage guidance
- Establishes token usage as standard approach for new UI work
- Provides guidance on when to use tokens vs manual values
- References design-tokens.json and DESIGN_SYSTEM.md
- Updates are concise and integrated naturally into existing documentation

---

## MODIFIED Requirements

None. This change adds new infrastructure without modifying existing UI requirements.

---

## REMOVED Requirements

None. This change maintains backward compatibility with all existing UI functionality.
