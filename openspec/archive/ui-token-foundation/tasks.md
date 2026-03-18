# Implementation Tasks: UI Token Foundation

This document outlines the implementation tasks for the `ui-token-foundation` change.

---

## Task 1: Create Token Parser Script

**Objective:** Create a Node.js script that parses design-tokens.json and generates usable token formats.

**Implementation Notes:**
- Create `scripts/parse-design-tokens.js`
- Use Node.js built-in `fs` module to read `openspec/specs/ui/design-tokens.json`
- Parse JSON structure and extract token categories:
  - Colors: Extract from nested structure, flatten to dot-notation keys
  - Typography: Extract font sizes, weights, line heights, convert px to rem
  - Spacing: Extract spacing values, convert px to rem
  - Effects: Extract shadows, borders, radii
- Generate two output files:
  - `scripts/generated-tokens.js`: JavaScript object for Tailwind config import
  - `scripts/generated-tokens.css`: CSS variable declarations
- Token naming convention:
  - Tailwind: kebab-case (e.g., `bg-surface-level-0`, `text-neutral-strong`)
  - CSS variables: double-dash prefix (e.g., `--bg-surface-level-0`, `--text-neutral-strong`)
- Include error handling for invalid JSON or missing tokens
- Add console logging for progress and warnings
- Script should be idempotent (safe to run multiple times)

**Test Plan:**
1. Run `node scripts/parse-design-tokens.js` from project root
2. Verify script completes without errors in < 2 seconds
3. Verify `scripts/generated-tokens.js` is created and contains:
   - `colors` object with color tokens
   - `fontSize` object with typography tokens
   - `fontWeight` object with weight tokens
   - `spacing` object with spacing tokens
   - `boxShadow` object with shadow tokens
   - `borderRadius` object with radius tokens
4. Verify `scripts/generated-tokens.css` is created and contains:
   - CSS variable declarations in `:root` block
   - Variables organized by category with comments
   - Valid CSS syntax (no syntax errors)
5. Manually inspect generated files to verify token values match design-tokens.json
6. Test with invalid JSON input to verify error handling

---

## Task 2: Update Tailwind Config with Parsed Tokens

**Objective:** Integrate parsed design tokens into Tailwind configuration while maintaining backward compatibility.

**Implementation Notes:**
- Update `tailwind.config.ts`
- Import generated tokens: `import tokens from './scripts/generated-tokens.js'`
- Extend theme with parsed tokens:
  ```typescript
  theme: {
    extend: {
      colors: {
        ...tokens.colors,
        // Existing manual tokens (backward compatibility)
        navy: { ... },
        blue: { ... },
        // etc.
      },
      fontSize: {
        ...tokens.fontSize,
        // Existing manual sizes preserved
      },
      // Similar for other categories
    }
  }
  ```
- Ensure existing manual tokens are preserved (navy, blue, gray, success, warning, error)
- Token order: Place parsed tokens first, then manual tokens (manual tokens can override if needed)
- Add comment explaining token source and regeneration

**Test Plan:**
1. Run `npm run build` to verify build succeeds
2. Verify no TypeScript errors in tailwind.config.ts
3. Test token class availability:
   - Create a test HTML file with token classes (e.g., `bg-surface-level-0`, `text-neutral-strong`)
   - Run dev server: `npm run dev`
   - Inspect element in browser dev tools
   - Verify classes apply correct color values from design-tokens.json
4. Test backward compatibility:
   - Verify existing classes still work (e.g., `bg-navy-900`, `text-blue-500`)
   - Run full test suite: `npm test`
   - Verify all 521 tests pass
5. Test all token categories:
   - Colors: `bg-[token]`, `text-[token]`, `border-[token]`
   - Typography: `text-[size]`, `font-[weight]`
   - Spacing: `p-[spacing]`, `m-[spacing]`, `gap-[spacing]`
   - Effects: `shadow-[effect]`, `rounded-[radius]`

---

## Task 3: Update globals.css with Generated CSS Variables

**Objective:** Add comprehensive CSS variable declarations to globals.css for all semantic tokens.

**Implementation Notes:**
- Update `app/globals.css`
- Copy content from `scripts/generated-tokens.css` into the `:root` block
- Organize variables by category with clear comments:
  ```css
  :root {
    /* Design Tokens - Colors */
    --bg-surface-level-0: #01030e;
    --bg-surface-level-1: #060813;
    /* ... */

    /* Design Tokens - Typography */
    --font-size-headline-xl: 3rem;
    --line-height-headline-xl: 3.5rem;
    /* ... */

    /* Design Tokens - Spacing */
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    /* ... */

    /* Design Tokens - Effects */
    --shadow-elevation-md: 0 4px 6px rgba(0,0,0,0.1);
    --radius-lg: 0.75rem;
    /* ... */

    /* Existing manual variables (backward compatibility) */
    --background: 220 15% 6%;
    /* ... */
  }
  ```
- Preserve all existing manual CSS variables
- Add comment explaining token source and regeneration
- Ensure no duplicate variable names

**Test Plan:**
1. Run `npm run dev` to start dev server
2. Open browser dev tools → Elements → Computed styles
3. Verify CSS variables are defined in `:root`
4. Test variable usage in a component:
   - Create a test component using CSS variables
   - Example: `<div style={{ backgroundColor: 'var(--bg-surface-level-0)' }}>`
   - Verify correct color is applied
5. Test backward compatibility:
   - Verify existing CSS variable usage still works
   - Check components using manual variables (e.g., `var(--background)`)
6. Run full test suite: `npm test`
7. Verify all 521 tests pass (no breaking changes)

---

## Task 4: Update Documentation for Discoverability

**Objective:** Document token system in DESIGN_SYSTEM.md, project.md, and main UI spec to ensure future changes discover and use the token system.

**Implementation Notes:**

**Part A: Update DESIGN_SYSTEM.md**
- Update `docs/DESIGN_SYSTEM.md`
- Add new section: "Design Token System" (after introduction, before Color Palette)
- Document token naming conventions:
  - Explain design-tokens.json as single source of truth
  - Show token naming pattern: `[category]-[subcategory]-[name]`
  - Provide examples for each category
- Add subsection: "Using Tokens via Tailwind Classes"
  - Provide code examples for colors, typography, spacing, effects
  - Show real component examples
- Add subsection: "Using Tokens via CSS Variables"
  - Provide CSS code examples
  - Show when to use CSS variables vs Tailwind classes
- Add subsection: "Regenerating Tokens"
  - Step-by-step instructions:
    1. Update `openspec/specs/ui/design-tokens.json`
    2. Run `node scripts/parse-design-tokens.js`
    3. Verify generated files updated
    4. Commit changes
  - Explain when regeneration is needed
- Add subsection: "Migration Guide"
  - Explain benefits of automated tokens
  - Provide before/after examples
  - Recommend gradual migration approach
- Maintain existing sections (Color Palette, Typography, etc.) for backward compatibility
- Add note that manual tokens will be deprecated in future

**Part B: Update project.md**
- Update `openspec/project.md`
- Add token system documentation to "Stack" or "Conventions" section
- Content to add:
  - "Design tokens are managed via `openspec/specs/ui/design-tokens.json` (single source of truth)"
  - "Tokens are automatically parsed and integrated into Tailwind config and CSS variables"
  - "See `docs/DESIGN_SYSTEM.md` for detailed usage and token naming conventions"
  - "New UI work should use design tokens, not hardcoded values"
- Keep addition concise (3-5 lines) and integrate naturally into existing documentation

**Part C: Update main UI spec**
- Update `openspec/specs/ui/spec.md` (the main spec, not the change delta)
- Add a new section or subsection about design tokens (location: near the beginning, after any introduction)
- Content to add:
  - Establish token usage as the standard approach for UI styling
  - Reference `openspec/specs/ui/design-tokens.json` as the source
  - Explain that new components SHOULD use tokens via Tailwind classes or CSS variables
  - Reference `docs/DESIGN_SYSTEM.md` for detailed examples
  - Note that hardcoded values should be avoided unless tokens don't exist
- Keep addition concise (1 paragraph or small section) and integrate naturally

**Test Plan:**
1. **DESIGN_SYSTEM.md verification:**
   - Read through updated documentation for clarity and accuracy
   - Follow "Regenerating Tokens" instructions to verify they work
   - Test code examples in documentation:
     - Copy Tailwind class examples into a test component
     - Copy CSS variable examples into a test stylesheet
     - Verify examples work as documented
   - Check for typos and formatting issues
   - Verify all links and references are correct

2. **project.md verification:**
   - Read the updated "Stack" or "Conventions" section
   - Verify token system is mentioned alongside other core technologies
   - Verify the addition is concise and naturally integrated
   - Confirm it references DESIGN_SYSTEM.md for details

3. **Main UI spec verification:**
   - Read the updated `openspec/specs/ui/spec.md`
   - Verify token usage is established as the standard approach
   - Verify it references design-tokens.json and DESIGN_SYSTEM.md
   - Confirm the addition is concise and naturally integrated
   - Ensure it doesn't conflict with existing requirements

4. **Discoverability test:**
   - Imagine you're starting a new UI change
   - Read project.md → should discover token system exists
   - Read openspec/specs/ui/spec.md → should understand tokens are the standard
   - Read DESIGN_SYSTEM.md → should understand how to use tokens
   - Verify the documentation chain is complete and logical

---

## Task 5: Verify Zero Breaking Changes

**Objective:** Ensure the change introduces no breaking changes to existing functionality.

**Implementation Notes:**
- This is a verification task, not an implementation task
- Run comprehensive tests across all layers
- Check for visual regressions on key pages
- Verify build and dev server work correctly
- Confirm all existing Tailwind classes and CSS variables still work

**Test Plan:**
1. **Unit and Integration Tests:**
   - Run full test suite: `npm test`
   - Verify all 521 tests pass
   - Check for any new warnings or errors in test output
   - If any tests fail, investigate and fix before proceeding

2. **Build Verification:**
   - Run production build: `npm run build`
   - Verify build completes without errors
   - Check build output for warnings
   - Verify build time has not increased significantly (< 10% increase acceptable)

3. **Dev Server Verification:**
   - Start dev server: `npm run dev`
   - Verify server starts without errors
   - Check console for warnings or errors
   - Verify hot reload works correctly

4. **Visual Regression Testing:**
   - Navigate to key pages in browser:
     - Homepage (`/`)
     - Login page (`/login`)
     - Registration page (`/register`)
     - Dashboard (`/dashboard`) - both CLIENT and SPECIALIST views
     - Gig creation form (`/dashboard/gigs/new`)
     - Gig browse page (`/dashboard/gigs`)
     - Gig detail page (`/dashboard/gigs/[id]`)
     - Profile pages (`/dashboard/profile`, `/dashboard/profile/edit`)
   - For each page, verify:
     - Layout renders correctly
     - Colors match expected values
     - Typography is correct
     - Spacing is correct
     - Interactive elements work (buttons, forms, links)
     - No console errors or warnings

5. **Token Class Verification:**
   - Test new token classes work:
     - Add test elements with new token classes to a page
     - Verify classes apply correct styles
   - Test existing manual token classes still work:
     - Verify `bg-navy-900`, `text-blue-500`, etc. still work
     - Check components using these classes render correctly

6. **CSS Variable Verification:**
   - Open browser dev tools → Elements → Computed styles
   - Verify new CSS variables are defined
   - Verify existing CSS variables still work
   - Test components using CSS variables render correctly

7. **Cross-Browser Testing (if time permits):**
   - Test in Chrome, Firefox, Safari
   - Verify consistent rendering across browsers

8. **Documentation Review:**
   - Verify DESIGN_SYSTEM.md is accurate and complete
   - Test all code examples in documentation
   - Verify regeneration instructions work

**Success Criteria:**
- All 521 tests pass
- Build succeeds without errors
- Dev server runs without errors
- No visual regressions on any page
- All existing Tailwind classes work
- All existing CSS variables work
- New token classes and variables work correctly
- Documentation is accurate and complete

---

## Summary

**Total Tasks:** 5

**Estimated Effort:** 1-2 days

**Critical Path:**
1. Task 1 (Parser Script) → Task 2 (Tailwind Config) → Task 5 (Verification)
2. Task 1 (Parser Script) → Task 3 (CSS Variables) → Task 5 (Verification)
3. Task 4 (Documentation) can be done in parallel with Tasks 2-3

**Dependencies:**
- Task 2 depends on Task 1 (needs generated tokens)
- Task 3 depends on Task 1 (needs generated CSS)
- Task 5 depends on Tasks 1-4 (verification of all changes)

**Next Steps:**
After completing all tasks and verification, run `/ralphy-implement ui-token-foundation` to begin implementation.
