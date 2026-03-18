# Planning Documents

Strategic planning documents that identify what needs to be built and provide executable ralphy-plan commands.

## Overview

Planning documents are created **through the OpenSpec workflow** using `/ralphy-plan` and `/ralphy-implement`. They serve as strategic analysis artifacts that bridge high-level vision with concrete implementation.

## Purpose

- **Analyze** what needs to be built based on project vision and current state
- **Identify** all systems affected by an initiative
- **Provide** executable ralphy-plan commands ready to run
- **Document** rationale and decisions for future reference

## Two Modes of Planning

### 1. Imperative Planning (You Direct)

When you know what needs to be planned:

```bash
/ralphy-plan create-ui-dark-theme-plan "We need to implement dark theme for the UI"
/ralphy-implement create-ui-dark-theme-plan
```

Result: `openspec/planning/ui-dark-theme-refactor.md` with analysis and commands

### 2. Suggestive Planning (AI Suggests)

When you want AI to suggest next steps:

```bash
/ralphy-plan analyze-next-steps "Based on project.md and current state, what should we build next?"
/ralphy-implement analyze-next-steps
```

Result: `openspec/planning/suggested-next-steps.md` with AI's recommendations

## Planning Document Format

Each planning document follows this structure:

```markdown
# [Initiative Name]

**Created:** YYYY-MM-DD
**Status:** PLANNED | IN_PROGRESS | COMPLETED

## Problem
[2-5 sentences describing current state or gap]

## Why This Matters
[2-5 sentences explaining business/technical impact]

## Scope
[List all systems affected, dependencies, risks]

## Changes
[Ordered list of ralphy-plan commands to execute]

### 1. Change Name
```bash
/ralphy-plan change-name "description with requirements and test plan"
```

### 2. Next Change
```bash
/ralphy-plan next-change "..."
```

## Status
- [ ] change-name
- [ ] next-change

**Progress:** 0/2 changes completed
```

## Workflow

### Creating a Planning Document

1. **Plan the planning:**
   ```bash
   /ralphy-plan create-notification-system-plan "We need in-app notifications"
   ```

2. **Implement (AI analyzes and creates document):**
   ```bash
   /ralphy-implement create-notification-system-plan
   ```

3. **Read the planning document:**
   ```bash
   cat openspec/planning/notification-system.md
   ```

4. **Execute the changes:**
   ```bash
   # Copy commands from the planning document
   /ralphy-plan notification-badge "..."
   /ralphy-implement notification-badge
   # ... etc
   ```

5. **Archive when done:**
   ```bash
   /ralphy-archive create-notification-system-plan
   mv openspec/planning/notification-system.md openspec/planning/archive/
   ```

### Asking for Suggestions

1. **Ask AI what to build next:**
   ```bash
   /ralphy-plan analyze-next-steps "What should we build next based on project.md?"
   ```

2. **AI analyzes and suggests:**
   ```bash
   /ralphy-implement analyze-next-steps
   ```

3. **Review suggestions:**
   ```bash
   cat openspec/planning/suggested-next-steps.md
   ```

4. **Pick a suggestion and create its planning document:**
   ```bash
   /ralphy-plan create-[chosen-initiative]-plan "..."
   ```

## Directory Structure

```
openspec/planning/
├── README.md (this file)
├── archive/
│   └── [completed planning documents]
└── [active planning documents]
```

## Integration with OpenSpec

Planning documents work within the existing OpenSpec workflow:

1. **Planning documents are created via OpenSpec changes** - Use `/ralphy-plan create-X-plan`
2. **Planning documents generate OpenSpec changes** - They contain ralphy-plan commands
3. **Both are archived when complete** - Planning doc → archive/, change → openspec/archive/

## Example: UI Dark Theme Refactor

```bash
# Step 1: Create planning document
/ralphy-plan create-ui-dark-theme-plan "We need dark theme for better UX"
/ralphy-implement create-ui-dark-theme-plan

# Step 2: Read the plan
cat openspec/planning/ui-dark-theme-refactor.md

# Step 3: Execute changes from the plan
/ralphy-plan dark-theme-color-system "Create dark theme color palette..."
/ralphy-implement dark-theme-color-system

/ralphy-plan theme-switching-mechanism "Implement theme toggle..."
/ralphy-implement theme-switching-mechanism

# ... continue with other changes

# Step 4: Archive when all done
/ralphy-archive create-ui-dark-theme-plan
mv openspec/planning/ui-dark-theme-refactor.md openspec/planning/archive/
```

## Key Principles

1. **Planning documents are created through OpenSpec** - Not manually edited
2. **One document per initiative** - Each piece of work gets its own document
3. **Documents discover scope** - Start with UI, discover it needs routing, tests, etc.
4. **Commands are executable** - Copy-paste ralphy-plan commands directly
5. **Archive when complete** - Keep active planning/ directory clean

## Specification

See `openspec/specs/planning/spec.md` for detailed requirements and format specification.
