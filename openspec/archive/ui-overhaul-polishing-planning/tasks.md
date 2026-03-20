# Tasks: UI Overhaul Completion Planning

## Task 1: Analyze Project Context and Design System

**Goal:** Understand the design system, available tokens, and project requirements.

**Implementation:**
1. Read `openspec/project.md` to understand design principles ("Professional B2B Experience", "Quality Over Quantity")
2. Read `openspec/specs/ui/design-tokens.json` to understand available tokens (already done - 134KB file with comprehensive tokens)
3. Read `docs/DESIGN_SYSTEM.md` to understand migration patterns and token usage guidelines
4. Read `scripts/parse-design-tokens.js` to understand how tokens are integrated into Tailwind
5. Review `tailwind.config.ts` to see current token integration

**Test Plan:**
- Verify understanding of available tokens (surface levels, neutral colors, semantic colors)
- Verify understanding of migration patterns from DESIGN_SYSTEM.md
- Document which tokens exist vs. which require hardcoded fallbacks

---

## Task 2: Audit Current Token Adoption State

**Goal:** Comprehensively identify what's been migrated vs. what remains.

**Implementation:**
1. **Grep for old color patterns:**
   - `bg-navy-900` (page backgrounds) - found 104 instances
   - `bg-navy-800` (inputs, cards) - found 214 instances
   - `bg-navy-700` (hover states) - found 50 instances
   - `text-gray-300`, `text-gray-400`, `text-gray-500` (text colors) - found 482 instances
   - `border-gray-600`, `border-gray-700` (borders)
   - `placeholder:text-gray-400` (input placeholders)
   - `focus:ring-offset-navy-900` (focus rings)

2. **Grep for new token patterns:**
   - `bg-surface-level-1`, `bg-surface-level-2` (new backgrounds)
   - `text-neutral-strong`, `text-neutral-weak` (new text colors)
   - `border-neutral-weak`, `border-neutral-strong` (new borders)
   - Status badge tokens (`bg-success-weak-default`, etc.)

3. **Categorize by page/component area:**
   - Auth pages (`app/login`, `app/register`)
   - Dashboard pages (`app/(protected)/dashboard`)
   - Gig pages (`app/(protected)/gigs`)
   - Profile pages (`app/(protected)/profile`)
   - Admin pages (`app/admin`)
   - Shared components (`app/components`)

4. **Categorize by type:**
   - Page backgrounds (body, main containers)
   - Text colors (headings, body, secondary, placeholders)
   - Input fields (backgrounds, borders, focus states)
   - Interactive states (hover, focus, active)
   - Card components (backgrounds, borders, hover)
   - Navigation (header, links, active states)

**Test Plan:**
- Run grep commands to count instances of each pattern
- Create a matrix: [page area] x [color type] showing migration status
- Verify counts match the problem statement (104 bg-navy-900, 482 text-gray-*, etc.)
- Document findings in structured format for planning document

---

## Task 3: Review Archived UI Changes

**Goal:** Learn from previous UI overhaul attempts to understand what worked and what didn't.

**Implementation:**
1. Read archived UI change proposals:
   - `openspec/archive/ui-token-foundation/` - token infrastructure setup
   - `openspec/archive/ui-core-components/` - component token migration
   - `openspec/archive/ui-card-badge-components/` - card and badge updates
   - `openspec/archive/ui-navigation-layout/` - navigation updates
   - `openspec/archive/ui-dashboard-pages/` - dashboard updates
   - `openspec/archive/ui-gig-pages/` - gig page updates
   - `openspec/archive/ui-profile-pages/` - profile page updates
   - `openspec/archive/ui-admin-pages/` - admin page updates
   - `openspec/archive/ui-auth-pages/` - auth page updates

2. Identify patterns:
   - What was the scope of each change?
   - What validation was performed?
   - Why did validation miss the incomplete migration?
   - What testing approach was used?

3. Document lessons learned:
   - What worked well (token infrastructure, card migrations)
   - What was missed (text colors, input fields, page backgrounds)
   - How to ensure complete migration in remaining phases

**Test Plan:**
- Verify understanding of previous change scope and boundaries
- Document specific validation gaps that led to incomplete migration
- Identify validation improvements for remaining phases

---

## Task 4: Define Remaining Work Phases

**Goal:** Organize remaining work into logical, independent, testable phases.

**Implementation:**
1. **Group remaining work by logical boundaries:**
   - Phase 1: Page backgrounds and layout containers
   - Phase 2: Text colors (headings, body, secondary, placeholders)
   - Phase 3: Input fields and form controls
   - Phase 4: Interactive states (hover, focus, active)
   - Phase 5: Validation and cleanup

2. **For each phase, define:**
   - Scope: What specific changes are included
   - Requirements: What tokens to use, what patterns to follow
   - Test plan: How to verify completeness
   - Acceptance criteria: What "done" looks like
   - Dependencies: What must be completed first

3. **Identify token availability:**
   - Which tokens exist in design-tokens.json
   - Which require hardcoded fallbacks (e.g., `hover:bg-navy-700` if no level-3 token)
   - Document fallback strategy

4. **Consider testing friction:**
   - Which tests might break (snapshot tests, selector tests)
   - How to minimize test updates
   - Validation approach for each phase

**Test Plan:**
- Verify each phase is independent and deployable
- Verify dependencies are correctly identified
- Verify acceptance criteria are testable and deterministic
- Verify token availability is documented

---

## Task 5: Create Planning Document

**Goal:** Write the planning document at `openspec/planning/ui-overhaul-completion.md`.

**Implementation:**
1. **Write Problem section:**
   - Summarize incomplete migration state (30-40% done)
   - Reference specific counts (104 bg-navy-900, 482 text-gray-*, etc.)
   - Explain why visual changes are minimal
   - 2-5 sentences, clear and concise

2. **Write Why This Matters section:**
   - Reference project.md design principles
   - Explain impact on consistency, maintainability, professionalism
   - 2-5 sentences

3. **Write Scope section:**
   - List all affected systems/areas
   - Identify dependencies between phases
   - Note risks (test breakage, visual regressions)
   - Document token availability and fallback strategy

4. **Write Changes section:**
   - For each phase, provide ralphy-plan command
   - Include clear description with requirements
   - Include test plan in command description
   - Order by dependency (prerequisites first)

5. **Write Status section:**
   - Status: PLANNED
   - Checkboxes for each change
   - Creation date
   - Progress tracker (0/N completed)

6. **Follow format from `openspec/specs/planning/spec.md`:**
   - All required sections present
   - Ralphy-plan commands are copy-pasteable
   - Changes ordered by dependency
   - Clear and actionable

**Test Plan:**
- Verify document follows required format
- Verify all sections are present and complete
- Verify ralphy-plan commands are syntactically correct
- Verify changes cover all identified remaining work
- Verify dependencies are correctly ordered
- Read through document as if you're implementing it - is everything clear?

---

## Task 6: Validate Planning Document Completeness

**Goal:** Ensure the planning document is comprehensive and ready for execution.

**Implementation:**
1. **Completeness check:**
   - Does it cover all 104 instances of bg-navy-900?
   - Does it cover all 482 instances of text-gray-*?
   - Does it cover all 214 instances of bg-navy-800?
   - Does it cover all 50 instances of hover:bg-navy-700?
   - Are there any other old color patterns not addressed?

2. **Clarity check:**
   - Can someone else read this and execute it?
   - Are requirements clear and unambiguous?
   - Are test plans specific and deterministic?
   - Are dependencies explicit?

3. **Feasibility check:**
   - Is each phase independently deployable?
   - Are phases sized appropriately (not too large, not too small)?
   - Are acceptance criteria testable?
   - Is the validation approach realistic?

4. **Format check:**
   - Does it follow `openspec/specs/planning/spec.md` format?
   - Are all required sections present?
   - Are ralphy-plan commands copy-pasteable?
   - Is the status section properly formatted?

**Test Plan:**
- Cross-reference planning document against audit findings
- Verify all identified work is included in some phase
- Verify no duplicate work across phases
- Verify document is ready for `/ralphy-implement` execution

---

## Summary

This change creates a planning document that:
1. Analyzes the incomplete UI token migration (30-40% done)
2. Identifies all remaining work (60-70% to complete)
3. Organizes work into logical, testable phases
4. Provides executable ralphy-plan commands for each phase
5. Defines validation approach to ensure complete migration

The planning document will serve as the roadmap for completing the UI overhaul that was started but left incomplete.
