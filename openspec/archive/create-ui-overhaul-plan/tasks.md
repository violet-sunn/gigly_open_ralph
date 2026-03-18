# Tasks: Create UI Overhaul Planning Document

## Task 1: Analyze Project Context and Token System

**Objective:** Understand the current state of the design token system and UI implementation.

**Implementation Notes:**
- Read `openspec/specs/ui/design-tokens.json` to understand available tokens
- Review `tailwind.config.ts` to see how tokens are integrated
- Check `app/globals.css` for CSS variable definitions
- Review `docs/DESIGN_SYSTEM.md` for documented patterns
- Examine archived UI changes to understand previous approaches:
  - `openspec/archive/ui-design-system-overhaul/`
  - `openspec/archive/dark-theme-ui-redesign/`
  - `openspec/archive/specialist-profile-ui-tokens/`

**Test Plan:**
- Verify all referenced files exist and are readable
- Confirm understanding of token structure (colors, typography, spacing, etc.)
- Document current state findings

---

## Task 2: Audit Current UI Implementation

**Objective:** Identify which pages and components use token-based styling vs. ad-hoc classes, and assess testing friction.

**Implementation Notes:**
- List all pages in `app/` directory (dashboard, gigs, profile, admin, etc.)
- For each page, identify:
  - Which design tokens are currently used
  - Which styling is ad-hoc (hardcoded Tailwind classes)
  - Which components are reusable vs. page-specific
- Identify common patterns:
  - Navigation components
  - Form components (buttons, inputs, textareas)
  - Card components
  - Badge/status components
  - Layout patterns (grids, sidebars)
- **Analyze testing friction**:
  - Review `__tests__/` directory structure (unit, integration, e2e)
  - Identify tests that use CSS selectors, class names, or visual assertions
  - Note tests that might break if DOM structure changes
  - Identify tests using data-testid attributes (these should be stable)
  - Check for snapshot tests that capture HTML/CSS
  - Review accessibility tests that depend on specific ARIA attributes

**Test Plan:**
- Create inventory of all pages and components
- Document token usage vs. ad-hoc styling for each
- Identify patterns and inconsistencies
- **Document testing friction risk level** (low/medium/high) for each page/component

---

## Task 3: Identify Affected Systems and Dependencies

**Objective:** Determine which systems need changes and in what order, including testing friction assessment.

**Implementation Notes:**
- Group changes by type:
  - **Foundation**: Tailwind config, CSS variables, global styles
  - **Components**: Reusable UI components (buttons, inputs, cards, badges)
  - **Layouts**: Page layouts and navigation
  - **Pages**: Individual page implementations
- Identify dependencies:
  - Foundation changes must come first (tokens, config)
  - Component changes depend on foundation
  - Page changes depend on components
- Consider risks:
  - Breaking existing functionality
  - Test compatibility
  - Accessibility regression
  - Performance impact
- **Assess testing friction for each change type**:
  - **Foundation changes**: Low risk (CSS variables don't affect tests)
  - **Component changes**: Medium risk (may affect selectors, but data-testid should be stable)
  - **Layout changes**: High risk (DOM structure changes may break integration/e2e tests)
  - **Page changes**: High risk (comprehensive test updates may be needed)
- **Define mitigation strategies**:
  - Preserve data-testid attributes during refactoring
  - Maintain semantic HTML structure (headings, buttons, links)
  - Keep ARIA attributes intact for accessibility tests
  - Update snapshots only when necessary
  - Run test suite incrementally after each change

**Test Plan:**
- Verify dependency graph is logical and complete
- Confirm no circular dependencies
- Document risks for each change
- **Document testing friction level and mitigation strategy** for each change

---

## Task 4: Create Planning Document

**Objective:** Generate `openspec/planning/ui-overhaul.md` following the planning spec format with testing friction analysis.

**Implementation Notes:**
- Follow format from `openspec/specs/planning/spec.md`:
  - **Problem**: Current state and gaps in token usage
  - **Why This Matters**: Business and technical impact
  - **Scope**: All systems affected, dependencies, risks, **testing friction**
  - **Changes**: Ordered list of ralphy-plan commands
  - **Status**: PLANNED with creation date
- For each change, provide:
  - Clear description of what needs to be done
  - Ralphy-plan command with detailed requirements
  - Brief explanation of why this change is needed
  - Dependencies (what must be done first)
  - **Testing friction assessment**: Risk level and mitigation strategy
- Order changes by dependency (prerequisites first)
- Use realistic change names (kebab-case)
- **Include testing friction section in Scope**:
  - Identify test types affected (unit, integration, e2e)
  - Estimate test update effort for each change
  - Provide strategies to minimize test breakage

**Example Change Format:**
```bash
/ralphy-plan ui-token-foundation "Integrate design tokens into Tailwind config and CSS variables. Requirements: (1) Parse design-tokens.json and extract color, typography, spacing tokens, (2) Update tailwind.config.ts with custom theme, (3) Create CSS variables in globals.css, (4) Document token usage patterns. Test: verify all tokens are accessible via Tailwind classes, run full test suite to confirm zero breakage."
```

**Testing Friction Note:**
- Low risk: Foundation changes (CSS variables, Tailwind config)
- Medium risk: Component changes (preserve data-testid, semantic HTML)
- High risk: Layout/page changes (may require test selector updates)

**Test Plan:**
- Verify planning document follows spec format
- Confirm all required sections are present
- Validate ralphy-plan commands are copy-pasteable
- Check that changes are ordered by dependency
- Ensure status section includes creation date
- **Verify testing friction assessment is included** for each change

---

## Task 5: Generate Ralphy-Plan Commands

**Objective:** Provide executable commands for each identified change.

**Implementation Notes:**
- Each command should be specific and actionable
- Include clear requirements (numbered list)
- Specify test plan for validation
- Consider realistic scope (not too large, not too small)
- Typical changes might include:
  - Token foundation setup
  - Component library updates (buttons, inputs, cards)
  - Navigation redesign
  - Dashboard page updates
  - Gig pages updates
  - Profile pages updates
  - Admin pages updates
  - Form components standardization
  - Badge/status component updates

**Test Plan:**
- Verify each command is copy-pasteable
- Confirm requirements are clear and testable
- Check that test plans are deterministic
- Ensure commands follow ralphy-plan conventions

---

## Overall Test Plan

**Validation Steps:**
1. Planning document exists at `openspec/planning/ui-overhaul.md`
2. Document follows format from `openspec/specs/planning/spec.md`
3. All required sections present (Problem, Why, Scope, Changes, Status)
4. Changes section includes 5-10 ralphy-plan commands
5. Commands are ordered by dependency
6. Each command includes description, requirements, and test plan
7. Status section shows PLANNED with creation date
8. Document is well-formatted and readable
9. **Testing friction section included in Scope** with risk assessment
10. **Each change includes testing friction level** (low/medium/high) and mitigation strategy

**Success Criteria:**
- Planning document is complete and actionable
- User can execute ralphy-plan commands in order
- Each command has clear scope and validation criteria
- Dependencies are explicit and logical
- **Testing friction is assessed and mitigated** for each change
