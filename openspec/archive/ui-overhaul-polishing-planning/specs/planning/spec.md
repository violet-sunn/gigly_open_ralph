# Planning Specification Reference

This change creates a planning document following the specification defined in:

**Reference:** `openspec/specs/planning/spec.md`

## Planning Document to be Created

**Path:** `openspec/planning/ui-overhaul-completion.md`

**Purpose:** Provide a systematic roadmap for completing the UI token migration that was started but left 60-70% incomplete.

## Required Sections

Per `openspec/specs/planning/spec.md`, the planning document MUST contain:

1. **Problem** - Current state of incomplete UI token migration
2. **Why This Matters** - Impact on consistency, maintainability, professionalism
3. **Scope** - All remaining areas requiring token migration
4. **Changes** - Ralphy-plan commands for each phase of completion
5. **Status** - PLANNED with checkboxes for tracking progress

## Analysis Requirements

The planning document creation process MUST:

1. **Analyze project context:**
   - Read `openspec/project.md` for design principles
   - Review `openspec/specs/ui/design-tokens.json` for available tokens
   - Review `docs/DESIGN_SYSTEM.md` for migration patterns

2. **Audit current state:**
   - Grep for old color usage patterns (`bg-navy-900`, `text-gray-*`, etc.)
   - Grep for new token usage patterns (`bg-surface-level-*`, `text-neutral-*`, etc.)
   - Identify which pages/components are migrated vs. not migrated

3. **Review archive:**
   - Check `openspec/archive/ui-*` changes to understand previous approaches
   - Learn from what worked and what didn't

4. **Categorize remaining work:**
   - Group by type (backgrounds, text, inputs, interactive states)
   - Group by page/component area (auth, dashboard, gig pages, admin, etc.)
   - Identify dependencies between changes

5. **Define phases:**
   - Order changes by dependency (foundation before components)
   - Keep each change focused and testable
   - Provide clear acceptance criteria for each phase

## Output Format

The planning document MUST follow this structure:

```markdown
# UI Overhaul Completion

**Created:** [date]
**Status:** PLANNED

## Problem

[2-5 sentences describing incomplete migration state]

## Why This Matters

[2-5 sentences on impact and importance]

## Scope

[Detailed breakdown of what needs to be completed]

## Changes

### 1. [Phase Name]
```bash
/ralphy-plan [change-name] "[description with requirements and test plan]"
```

[Repeat for each phase]

## Status

- [ ] [change-name-1]
- [ ] [change-name-2]
...

**Progress:** 0/N changes completed
```

## Validation

The planning document is complete when:

1. All remaining UI token migration work is identified
2. Work is organized into logical, independent phases
3. Each phase has a ralphy-plan command with clear requirements
4. Dependencies between phases are documented
5. Testing and validation approach is defined
6. Document follows the required format from `openspec/specs/planning/spec.md`
