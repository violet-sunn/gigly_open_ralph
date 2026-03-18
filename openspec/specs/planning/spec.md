# Planning Document Specification

## Overview

Planning documents are strategic analysis documents that identify what needs to be built and provide executable ralphy-plan commands. They are created via the OpenSpec workflow like any other change.

## Purpose

Planning documents serve as:
1. **Analysis artifacts** - Document why something needs to be built
2. **Scope definition** - Identify all systems affected by an initiative
3. **Execution guides** - Provide ralphy-plan commands ready to execute
4. **Decision records** - Capture rationale for future reference

## ADDED Requirements

### Requirement: Planning Document Format
Planning documents MUST follow a standard format for consistency and AI generation.

#### Scenario: Document has required sections
**Given** a planning document in `openspec/planning/`
**When** reviewing the document structure
**Then** the document MUST contain a "Problem" section
**And** the document MUST contain a "Why This Matters" section
**And** the document MUST contain a "Scope" section
**And** the document MUST contain a "Changes" section with ralphy-plan commands
**And** the document MUST contain a "Status" section

#### Scenario: Problem section describes current state
**Given** the "Problem" section of a planning document
**When** reviewing the problem description
**Then** the section MUST describe the current state or gap
**And** the section MUST be 2-5 sentences
**And** the section MUST avoid implementation details

#### Scenario: Why section provides rationale
**Given** the "Why This Matters" section
**When** reviewing the rationale
**Then** the section MUST explain business or technical impact
**And** the section MUST reference project.md goals when applicable
**And** the section MUST be 2-5 sentences

#### Scenario: Scope section identifies affected systems
**Given** the "Scope" section
**When** reviewing the scope
**Then** the section MUST list all systems/areas affected
**And** the section MUST identify dependencies between changes
**And** the section MUST note any risks or unknowns

#### Scenario: Changes section provides executable commands
**Given** the "Changes" section
**When** reviewing the changes
**Then** each change MUST include a ralphy-plan command
**And** each command MUST be copy-pasteable
**And** each command MUST include a brief description
**And** changes MUST be ordered by dependency (prerequisites first)

#### Scenario: Status section tracks progress
**Given** the "Status" section
**When** checking the status
**Then** the status MUST be one of: PLANNED, IN_PROGRESS, COMPLETED
**And** completed changes MUST be marked with checkboxes
**And** the section MUST include creation date

---

### Requirement: Planning Document Creation
Planning documents MUST be created via OpenSpec workflow, not manually.

#### Scenario: Create planning document via ralphy-plan
**Given** a need for strategic planning
**When** creating a planning document
**Then** the user MUST run `/ralphy-plan create-<name>-plan "description"`
**And** the change MUST create a proposal in `openspec/changes/create-<name>-plan/`
**And** the proposal MUST specify the planning document to be created

#### Scenario: Implement planning document generation
**Given** a planning document change in `openspec/changes/`
**When** running `/ralphy-implement create-<name>-plan`
**Then** the implementation MUST analyze the project context
**And** the implementation MUST read `openspec/project.md`
**And** the implementation MUST review current state (archive, specs)
**And** the implementation MUST create the planning document in `openspec/planning/`
**And** the planning document MUST follow the required format

#### Scenario: Archive planning document change
**Given** a completed planning document change
**When** running `/ralphy-archive create-<name>-plan`
**Then** the change MUST be moved to `openspec/archive/`
**And** the planning document MUST remain in `openspec/planning/`
**And** the planning document status MUST be updated to COMPLETED

---

### Requirement: Two Modes of Planning
The system MUST support both imperative and suggestive planning.

#### Scenario: Imperative planning (user-directed)
**Given** the user knows what needs to be planned
**When** running `/ralphy-plan create-ui-refactor-plan "We need dark theme"`
**Then** the AI MUST create a planning document for the specified topic
**And** the document MUST analyze how to implement the user's request
**And** the document MUST provide ralphy-plan commands for execution

#### Scenario: Suggestive planning (AI-directed)
**Given** the user wants AI to suggest next steps
**When** running `/ralphy-plan analyze-next-steps "What should we build next?"`
**Then** the AI MUST analyze project.md vision
**And** the AI MUST review current state and completed work
**And** the AI MUST identify gaps or next logical steps
**And** the AI MUST create a planning document with suggestions
**And** the document MUST explain why each suggestion matters

---

### Requirement: Planning Document Lifecycle
Planning documents MUST have a clear lifecycle and archival process.

#### Scenario: Active planning document
**Given** a planning document with status PLANNED or IN_PROGRESS
**When** executing changes from the document
**Then** the user MUST mark completed changes with checkboxes
**And** the user MUST update status to IN_PROGRESS when starting
**And** the document MUST remain in `openspec/planning/`

#### Scenario: Completed planning document
**Given** a planning document with all changes completed
**When** all checkboxes are marked
**Then** the user MUST update status to COMPLETED
**And** the user MUST move the document to `openspec/planning/archive/`
**And** the document MUST be preserved for future reference

#### Scenario: Planning document references
**Given** a completed planning document in archive
**When** referencing the planning work
**Then** the archived planning document MUST be linkable
**And** the original OpenSpec change MUST be in `openspec/archive/`
**And** both artifacts MUST be preserved

---

### Requirement: Planning Document Naming
Planning documents MUST follow a consistent naming convention.

#### Scenario: Planning document filename
**Given** a planning document in `openspec/planning/`
**When** checking the filename
**Then** the filename MUST use kebab-case
**And** the filename MUST describe the initiative
**And** the filename MUST end with `.md`
**And** the filename SHOULD NOT include dates or version numbers

**Examples:**
- ✅ `ui-dark-theme-refactor.md`
- ✅ `notification-system.md`
- ✅ `payment-integration.md`
- ❌ `2026-q1-ui-refactor.md` (no dates)
- ❌ `ui-refactor-v2.md` (no versions)

---

### Requirement: Integration with OpenSpec
Planning documents MUST integrate cleanly with the existing OpenSpec workflow.

#### Scenario: Planning documents reference specs
**Given** a planning document
**When** the document describes changes
**Then** the document MAY reference existing specs in `openspec/specs/`
**And** the document MAY note which specs will be modified
**And** the document MUST NOT duplicate spec content

#### Scenario: Changes reference planning documents
**Given** an OpenSpec change created from a planning document
**When** the change is implemented
**Then** the change proposal MAY reference the planning document
**And** the reference MUST include the planning document path
**And** the reference MUST explain how the change fits the plan

---

## Example Planning Document

```markdown
# UI Dark Theme Refactor

**Created:** 2026-03-16
**Status:** PLANNED

## Problem

The current UI uses a light theme only. Users working in low-light environments experience eye strain. The platform looks dated compared to modern applications that offer dark mode. No theme switching mechanism exists.

## Why This Matters

Dark theme is a standard feature in modern applications. Users expect it, especially developers who work long hours. This affects user satisfaction and platform perception. From project.md: "Professional B2B marketplace" - dark theme is part of that professionalism.

## Scope

This initiative affects multiple systems:

**UI Components:**
- All components need dark theme variants
- Color system needs dark palette
- Contrast ratios must meet WCAG standards

**State Management:**
- Theme preference storage (localStorage)
- Theme toggle component
- Theme context provider

**Testing:**
- Visual regression tests for dark theme
- Accessibility tests for contrast
- E2E tests for theme switching

**Dependencies:**
- Must complete before: mobile responsive design (uses same color system)
- Blocks: none

**Risks:**
- Color choices may need iteration
- Some third-party components may not support dark theme

## Changes

Execute these changes in order:

### 1. Color System Foundation
```bash
/ralphy-plan dark-theme-color-system "Create dark theme color palette and CSS variables. Requirements: (1) Define dark theme colors in Tailwind config, (2) Create CSS custom properties for theme switching, (3) Ensure WCAG AA contrast ratios, (4) Document color usage guidelines. Test: verify all colors meet contrast requirements."
```

### 2. Theme Context and Toggle
```bash
/ralphy-plan theme-switching-mechanism "Implement theme context and toggle component. Requirements: (1) Create ThemeContext with localStorage persistence, (2) Build theme toggle button component, (3) Add toggle to header, (4) Default to system preference. Test: verify theme persists across sessions, toggle works correctly."
```

### 3. Component Dark Theme Variants
```bash
/ralphy-plan component-dark-theme-styles "Apply dark theme styles to all components. Requirements: (1) Update all components to use theme-aware colors, (2) Test each component in both themes, (3) Fix any contrast issues, (4) Update Storybook with theme toggle. Test: visual regression tests pass for both themes."
```

### 4. Testing and Polish
```bash
/ralphy-plan dark-theme-testing "Add comprehensive tests for dark theme. Requirements: (1) E2E tests for theme switching, (2) Accessibility tests for contrast, (3) Visual regression tests, (4) Test all user flows in dark theme. Test: all tests pass, no visual regressions."
```

## Status

- [ ] dark-theme-color-system
- [ ] theme-switching-mechanism
- [ ] component-dark-theme-styles
- [ ] dark-theme-testing

**Progress:** 0/4 changes completed
**Started:** Not started
**Completed:** Not completed
```

---

## Workflow Example

### Creating a Planning Document

```bash
# User decides they need to plan something
/ralphy-plan create-ui-dark-theme-plan "We need to implement dark theme for the UI"

# AI creates openspec/changes/create-ui-dark-theme-plan/ with proposal
# User reviews and approves

# AI implements: analyzes project, creates openspec/planning/ui-dark-theme-refactor.md
/ralphy-implement create-ui-dark-theme-plan

# User reads the planning document
cat openspec/planning/ui-dark-theme-refactor.md

# User executes the changes listed in the document
/ralphy-plan dark-theme-color-system "..."
/ralphy-implement dark-theme-color-system
# ... etc

# When all changes done, archive the planning document change
/ralphy-archive create-ui-dark-theme-plan

# Move planning document to archive
mv openspec/planning/ui-dark-theme-refactor.md openspec/planning/archive/
```

### Asking for Suggestions

```bash
# User wants AI to suggest what to build next
/ralphy-plan analyze-next-steps "Based on project.md and current state, what should we build next?"

# AI analyzes project, creates openspec/planning/suggested-next-steps.md
/ralphy-implement analyze-next-steps

# User reads suggestions and decides what to pursue
cat openspec/planning/suggested-next-steps.md

# User picks a suggestion and creates a new planning document for it
/ralphy-plan create-notification-system-plan "Implement the notification system suggested in next-steps"
```
