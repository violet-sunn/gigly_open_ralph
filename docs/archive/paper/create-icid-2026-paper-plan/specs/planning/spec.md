# Spec: Planning Document — ICID 2026 Paper

## Reference

This spec does not duplicate `openspec/specs/planning/spec.md` (which does not yet exist). It defines the requirements for the specific planning document to be created by this change.

---

## ADDED Requirements

### Requirement: Planning document MUST be created at the correct path

The implementation MUST create the file `openspec/planning/icid-2026-paper.md`.

#### Scenario: File exists after implementation

**Given** the change `create-icid-2026-paper-plan` has been implemented  
**When** the implementer checks `openspec/planning/`  
**Then** the file `icid-2026-paper.md` exists in that directory

---

### Requirement: Planning document MUST follow the standard format

The document MUST include all required sections from `openspec/planning/README.md`:
- `# [Initiative Name]` heading
- `**Created:** YYYY-MM-DD`
- `**Status:** PLANNED`
- `## Problem`
- `## Why This Matters`
- `## Scope`
- `## Changes` with numbered, executable `/ralphy-plan` commands
- `## Status` with checkbox tracking list

#### Scenario: All required sections present

**Given** the planning document has been created  
**When** a reader opens `openspec/planning/icid-2026-paper.md`  
**Then** all 7 required sections are present and non-empty

---

### Requirement: Changes section MUST contain exactly 6 executable ralphy-plan commands

One command per writing task:
1. `write-paper-introduction`
2. `write-paper-methodology`
3. `write-paper-implementation`
4. `write-paper-validation`
5. `write-paper-conclusion`
6. `assemble-paper-final`

Each command MUST be self-contained: a reader with no prior context MUST be able to copy-paste it and execute it.

#### Scenario: Commands are copy-pasteable

**Given** the planning document exists  
**When** a user copies any `/ralphy-plan` command from the Changes section  
**Then** the command contains all requirements and test plan inline, with no external references required to execute it

---

### Requirement: Planning document MUST include an evidence index

The document MUST contain a table or list mapping each paper section to at least one concrete artifact in the repository (file path, archive entry, or spec).

#### Scenario: Every paper section has evidence

**Given** the evidence index is present  
**When** checking each of the 5 paper sections (Introduction, Methodology, Implementation, Validation, Conclusion)  
**Then** each section has at least one artifact pointer (e.g., `openspec/archive/gig-creation/`, `openspec/specs/gig/spec.md`)

---

### Requirement: Planning document MUST include an evidence gap list

The document MUST explicitly list claims from the abstract that lack direct artifact evidence, with a suggested resolution for each gap.

#### Scenario: Gaps are actionable

**Given** the gap list is present  
**When** the author reads a gap entry  
**Then** the entry states: (1) the claim, (2) what evidence is missing, (3) a concrete suggestion to resolve it

---

### Requirement: Status tracking MUST use checkboxes

The `## Status` section MUST use GitHub-flavored markdown checkboxes (`- [ ]`) for all 6 writing tasks, enabling progress tracking.

#### Scenario: Checkboxes are unchecked at creation

**Given** the planning document has just been created  
**When** viewing the Status section  
**Then** all 6 checkboxes are unchecked (`- [ ]`)  
**And** `**Progress:** 0/6 changes completed` is present
