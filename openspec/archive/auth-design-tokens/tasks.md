# Implementation Tasks: Auth Design Tokens

## Task 1: Analyze Figma Design and Extract Token Values

**Implementation:**
1. Use Figma MCP tool to fetch design context from node 4100-385
2. Extract exact color values, spacing, and border-radius from the design
3. Document all token values needed:
   - Colors: Verify #01030e, #10121c, #0265dc, #0088FF
   - Border-radius: 10px, 20px, 25px
   - Spacing: 24px, 40px, and verify if 47px or 48px is more appropriate
4. Cross-reference with existing design-tokens.json to identify gaps
5. Note: 24px (spacing-300) and 40px (spacing-500) already exist in numbers.spacing

**Test Plan:**
- Verify Figma design context is successfully fetched
- Confirm all color values match Figma specs exactly
- Verify spacing and border-radius values match Figma measurements
- Document which tokens already exist vs. need to be added
- Confirm whether 47px or 48px fits better with the design (48px fits existing scale better)

## Task 2: Update Parser to Extract Spacing Tokens

**Implementation:**
1. Open `scripts/parse-design-tokens.js`
2. Locate the spacing token extraction section (lines 152-155, currently empty)
3. Add extraction logic for `numbers.spacing` tokens:
   ```javascript
   if (tokens.numbers && tokens.numbers.spacing) {
     const flatSpacing = flattenObject(tokens.numbers.spacing);
     for (const [key, token] of Object.entries(flatSpacing)) {
       if (token.value && typeof token.value === 'number') {
         spacingTokens[key] = `${token.value}px`;
       }
     }
     console.log(`✓ Extracted ${Object.keys(spacingTokens).length} spacing tokens`);
   }
   ```
4. Ensure spacing tokens are properly added to both JS and CSS output

**Test Plan:**
- Run: `node scripts/parse-design-tokens.js`
- Assert: Console shows "✓ Extracted N spacing tokens" where N > 0
- Assert: `scripts/generated-tokens.js` contains spacing object with values like "300": "24px", "500": "40px"
- Assert: `scripts/generated-tokens.css` contains CSS variables like `--spacing-300: 24px;`
- Verify: Spacing tokens are properly formatted as pixel values

## Task 3: Update Parser to Extract Border-Radius Tokens

**Implementation:**
1. Open `scripts/parse-design-tokens.js`
2. Locate the border radius token extraction section (lines 157-160, currently empty)
3. Determine where border-radius tokens will be stored in design-tokens.json (likely `numbers.borderRadius` or similar)
4. Add extraction logic similar to spacing tokens:
   ```javascript
   if (tokens.numbers && tokens.numbers.borderRadius) {
     const flatRadius = flattenObject(tokens.numbers.borderRadius);
     for (const [key, token] of Object.entries(flatRadius)) {
       if (token.value && typeof token.value === 'number') {
         borderRadiusTokens[key] = `${token.value}px`;
       }
     }
     console.log(`✓ Extracted ${Object.keys(borderRadiusTokens).length} border radius tokens`);
   }
   ```
5. Ensure border-radius tokens are properly added to both JS and CSS output

**Test Plan:**
- Run: `node scripts/parse-design-tokens.js`
- Assert: Console shows "✓ Extracted N border radius tokens" where N > 0
- Assert: `scripts/generated-tokens.js` contains borderRadius object with values
- Assert: `scripts/generated-tokens.css` contains CSS variables like `--radius-10: 10px;`
- Verify: Border-radius tokens are properly formatted as pixel values

## Task 4: Verify Existing Color Primitives

**Implementation:**
1. Read `openspec/specs/ui/design-tokens.json`
2. Search for existing color primitives:
   - #01030e (dark-brand-1300) - should exist
   - #10121c (surface-level-2) - should exist as brand-1100
   - #0265dc (brand-blue) - should exist
   - #0088FF (primary-blue) - verify if standalone primitive exists
3. Document current token structure and naming conventions
4. Identify if #0088FF needs to be added as a standalone primitive

**Test Plan:**
- Grep for each color value in design-tokens.json
- Verify color primitives are in correct structure
- Confirm #0088FF exists as a referenceable primitive (not just in gradients)
- If missing, document where it should be added in the token hierarchy

## Task 5: Add Border-Radius Token Section to design-tokens.json

**Implementation:**
1. Open `openspec/specs/ui/design-tokens.json`
2. Create a new `borderRadius` section under `numbers` (to match spacing structure):
   ```json
   "borderRadius": {
     "10": {
       "type": "dimension",
       "value": 10,
       "extensions": {
         "org.lukasoppermann.figmaDesignTokens": {
           "collection": "numbers",
           "scopes": ["CORNER_RADIUS"],
           "exportKey": "variables"
         }
       }
     },
     "20": {
       "type": "dimension",
       "value": 20,
       "extensions": { ... }
     },
     "25": {
       "type": "dimension",
       "value": 25,
       "extensions": { ... }
     }
   }
   ```
3. Place this section after `numbers.spacing` for consistency
4. Ensure JSON syntax is valid

**Test Plan:**
- Verify JSON syntax is valid: `node -e "JSON.parse(require('fs').readFileSync('openspec/specs/ui/design-tokens.json'))"`
- Confirm new tokens follow the same structure as spacing tokens
- Check that extensions and metadata match existing patterns
- Verify the section is in the correct location in the JSON hierarchy

## Task 6: Add 48px Spacing Token to design-tokens.json

**Implementation:**
1. Open `openspec/specs/ui/design-tokens.json`
2. Locate the `numbers.spacing` section
3. Add a new spacing token for 48px between "500" (40px) and "1000" (80px):
   ```json
   "600": {
     "type": "dimension",
     "value": 48,
     "extensions": {
       "org.lukasoppermann.figmaDesignTokens": {
         "collection": "numbers",
         "scopes": ["GAP"],
         "variableId": "VariableID:custom:600",
         "exportKey": "variables"
       }
     }
   }
   ```
4. Ensure the token follows the existing naming pattern (25, 50, 75, 100, 150, 300, 400, 500, 600, 1000)
5. Note: 24px (spacing-300) and 40px (spacing-500) already exist, no need to add them

**Test Plan:**
- Verify JSON syntax is valid after addition
- Confirm 48px token fits the spacing scale pattern
- Check that the token structure matches existing spacing tokens
- Verify 24px and 40px tokens already exist and don't need modification

## Task 7: Add Primary Blue Color Primitive (if needed)

**Implementation:**
1. If #0088FF doesn't exist as a standalone primitive, add it
2. Determine correct location in token hierarchy (likely `color-primitives.dark.blue` or similar)
3. Add the color primitive with proper structure:
   ```json
   {
     "type": "color",
     "value": "#0088ffff",
     "blendMode": "normal",
     "extensions": { ... }
   }
   ```
4. Create or update semantic token to reference this primitive for button backgrounds

**Test Plan:**
- Verify #0088FF is added as a color primitive
- Confirm it's in the correct location in the token hierarchy
- Check that semantic tokens can reference it
- Validate JSON syntax and structure

## Task 8: Regenerate Tailwind Config and CSS Variables

**Implementation:**
1. Run `node scripts/parse-design-tokens.js` to regenerate token files
2. Verify `scripts/generated-tokens.js` is updated with new tokens:
   - spacing object contains: "300": "24px", "500": "40px", "600": "48px"
   - borderRadius object contains: "10": "10px", "20": "20px", "25": "25px"
   - colors object contains #0088FF (if added)
3. Verify `scripts/generated-tokens.css` is updated with new CSS variables:
   - `--spacing-300: 24px;`, `--spacing-500: 40px;`, `--spacing-600: 48px;`
   - `--radius-10: 10px;`, `--radius-20: 20px;`, `--radius-25: 25px;`
4. Check that tokens are properly formatted and follow existing patterns

**Test Plan:**
- Run: `node scripts/parse-design-tokens.js`
- Assert: Script completes without errors
- Assert: Console shows "✓ Extracted N spacing tokens" and "✓ Extracted N border radius tokens"
- Assert: `scripts/generated-tokens.js` contains spacing and borderRadius objects with expected values
- Assert: `scripts/generated-tokens.css` contains CSS variables for spacing and border-radius
- Grep: `grep -E "spacing-300|spacing-500|spacing-600" scripts/generated-tokens.js`
- Grep: `grep -E "radius-10|radius-20|radius-25" scripts/generated-tokens.js`

## Task 9: Verify Build Succeeds

**Implementation:**
1. Run `npm run build` to verify the build system accepts new tokens
2. Check for any TypeScript errors related to token usage
3. Check for any Tailwind CSS errors or warnings
4. Verify no breaking changes to existing components

**Test Plan:**
- Run: `npm run build`
- Assert: Build completes successfully with exit code 0
- Assert: No TypeScript compilation errors
- Assert: No Tailwind CSS errors in output
- Assert: Build output includes new token classes

## Task 10: Update Design System Documentation

**Implementation:**
1. Open `docs/DESIGN_SYSTEM.md`
2. Add a new section "Auth Component Tokens" with:
   - Border-radius token usage examples
   - Spacing token usage examples (24px, 40px, 48px)
   - Color token usage for auth components
3. Document how to use tokens in Tailwind:
   - Spacing: Use CSS variables like `p-[var(--spacing-600)]` or extend Tailwind config
   - Border-radius: Use CSS variables like `rounded-[var(--radius-20)]` or extend Tailwind config
   - Note: May need to extend Tailwind config to make tokens available as utility classes
4. Include code examples showing auth card, button, and container styling:
   ```tsx
   // Auth container
   <div className="rounded-[var(--radius-25)] p-[var(--spacing-500)]">

   // Auth card
   <div className="rounded-[var(--radius-20)] gap-[var(--spacing-600)]">

   // Auth button
   <button className="rounded-[var(--radius-10)] gap-[var(--spacing-300)]">
   ```

**Test Plan:**
- Verify documentation includes all new tokens (spacing-300, spacing-500, spacing-600, radius-10, radius-20, radius-25)
- Confirm code examples use correct CSS variable syntax
- Check that both CSS variable and Tailwind config extension approaches are documented
- Validate markdown syntax is correct
- Verify examples match the auth screen design requirements

## Task 11: Visual Verification Against Figma

**Implementation:**
1. Create a simple test page or component using new tokens
2. Apply tokens to match Figma design:
   - Background: dark-brand-1300 (#01030e)
   - Card background: surface-level-2 (#10121c)
   - Border: brand-default (#0265dc)
   - Button background: primary-blue (#0088FF)
   - Border-radius: 20px for cards, 10px for buttons, 25px for container
   - Spacing: 40px padding, 48px gap (adjusted from 47px), 24px internal gaps
3. Compare rendered output with Figma design visually
4. Verify that 48px gap is visually acceptable (1px difference from 47px should be imperceptible)
5. Take screenshots for documentation if needed

**Test Plan:**
- Visual comparison: Colors match Figma design exactly
- Visual comparison: Border-radius values match Figma measurements
- Visual comparison: Spacing values match Figma layout (48px vs 47px difference is acceptable)
- Verify: No visual regressions in existing components
- Document: Any discrepancies or adjustments needed
- Confirm: 48px gap is visually indistinguishable from 47px in the design

## Task 12: Commit Changes

**Implementation:**
1. Stage all modified files:
   - `scripts/parse-design-tokens.js` (parser updates)
   - `openspec/specs/ui/design-tokens.json` (new tokens)
   - `scripts/generated-tokens.js` (regenerated)
   - `scripts/generated-tokens.css` (regenerated)
   - `docs/DESIGN_SYSTEM.md` (documentation)
2. Create commit with descriptive message explaining:
   - Parser now extracts spacing and border-radius tokens
   - Added border-radius tokens (10px, 20px, 25px)
   - Added 48px spacing token
   - All tokens available via CSS variables
3. Verify all tests still pass after commit

**Test Plan:**
- Run: `git status` to verify correct files are staged
- Run: `npm test` to verify all tests pass
- Run: `npm run build` to verify build succeeds
- Verify: Commit message follows project conventions
- Verify: All 5 files are included in the commit
