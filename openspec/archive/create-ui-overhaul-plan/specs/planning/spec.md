# Planning Specification Reference

This change creates a planning document following the specification defined in:

**`openspec/specs/planning/spec.md`**

## Key Requirements

The planning document MUST include:

1. **Problem Section** (2-5 sentences)
   - Describe current state or gap
   - Avoid implementation details

2. **Why This Matters Section** (2-5 sentences)
   - Explain business or technical impact
   - Reference project.md goals when applicable

3. **Scope Section**
   - List all systems/areas affected
   - Identify dependencies between changes
   - Note any risks or unknowns

4. **Changes Section**
   - Each change includes a ralphy-plan command
   - Commands are copy-pasteable
   - Commands include brief description
   - Changes ordered by dependency (prerequisites first)

5. **Status Section**
   - Status: PLANNED, IN_PROGRESS, or COMPLETED
   - Completed changes marked with checkboxes
   - Include creation date

## Planning Document Format

```markdown
# [Initiative Name]

**Created:** YYYY-MM-DD
**Status:** PLANNED

## Problem

[2-5 sentences describing current state or gap]

## Why This Matters

[2-5 sentences explaining business or technical impact]

## Scope

[List of affected systems, dependencies, risks]

## Changes

Execute these changes in order:

### 1. [Change Name]
```bash
/ralphy-plan change-name "Description. Requirements: (1) ..., (2) ..., (3) .... Test: ..."
```

[Brief explanation of why this change is needed]

### 2. [Next Change]
...

## Status

- [ ] change-name
- [ ] next-change
...

**Progress:** 0/N changes completed
**Started:** Not started
**Completed:** Not completed
```

## See Also

- Full specification: `openspec/specs/planning/spec.md`
- Example planning document in spec (lines 183-258)
