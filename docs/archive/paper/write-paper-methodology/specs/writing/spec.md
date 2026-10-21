# Writing Specification — §2 Methodology Section

## ADDED Requirements

### Requirement: Formal SDD Definition
The §2 section MUST open with a formal definition of Spec-Driven Development.

#### Scenario: SDD definition paragraph
- GIVEN a reader unfamiliar with SDD
- WHEN they read the opening paragraph of §2
- THEN they MUST understand that in SDD, structured specifications are the primary executable artifacts and code is a derivative output
- AND citation [5] (Piskala arXiv:2602.00180) MUST be present

**Acceptance Criteria:**
- A single-sentence formal definition of SDD appears in the first paragraph.
- The inversion from code-first is explicit ("code is a derivative output" or equivalent).
- Citation [5] is present in the paragraph.

---

### Requirement: Paradigm Contrast
The §2 section MUST contrast SDD with code-first programming and TDD.

#### Scenario: Three-paradigm comparison
- GIVEN a reader familiar with TDD
- WHEN they read the contrast paragraph
- THEN they MUST understand the ordering distinction: in SDD the spec precedes both tests and code
- AND all three paradigms (code-first, TDD, SDD) MUST be named

**Acceptance Criteria:**
- Code-first, TDD, and SDD are each named and distinguished.
- The spec-first ordering (spec → tests → code) is explicit for SDD.

---

### Requirement: Context Decay Motivation
The §2 section MUST explain context decay as the motivating problem SDD solves.

#### Scenario: Context decay explanation with citation
- GIVEN a reader who has not encountered context rot research
- WHEN they read the motivation paragraph
- THEN they MUST understand that LLM output quality degrades as context windows fill
- AND they MUST understand how SDD mitigates this via the spec as an external anchor
- AND citation [4] (Hong et al. Chroma Research 2025) MUST be present

**Acceptance Criteria:**
- The term "context decay" or "context rot" appears with citation [4].
- The mitigation mechanism is stated: spec as stable external artifact enabling fresh context windows per task.

---

### Requirement: Physical Implementation Description
The §2 section MUST describe the openspec/ directory structure used in the Gigly project.

#### Scenario: Directory structure explanation
- GIVEN a developer who wants to replicate the SDD setup
- WHEN they read the implementation paragraph
- THEN they MUST be able to identify the three directories and their roles:
  - `openspec/specs/` — live canonical domain specs (single source of truth)
  - `openspec/archive/` — completed changes, each with proposal.md, tasks.md, specs/ delta
  - `openspec/changes/` — in-progress changes (same structure)
- AND the human/AI division of labor MUST be stated

**Acceptance Criteria:**
- All three directories are named with their roles.
- The contents of an archive entry (proposal.md, tasks.md, specs/ delta) are listed.
- The human-as-architect / AI-as-executor division is explicitly stated.

---

### Requirement: Concrete Archive Example
The §2 section MUST include one concrete example from the archive demonstrating spec-before-code flow.

#### Scenario: gig-creation example
- GIVEN a reader skeptical that specs truly precede code
- WHEN they read the example paragraph
- THEN they MUST see a named change (gig-creation) where specific data model fields were defined in a spec delta before any database migration was written
- AND the temporal ordering (spec written → code generated) MUST be unambiguous

**Acceptance Criteria:**
- The `gig-creation` change is named.
- At least two specific field names from the spec (e.g., `budget`, `serviceFee`, `status`) appear.
- The sequence (spec delta written before Prisma migration) is stated explicitly.

---

### Requirement: Length and Register
The §2 section MUST meet length and academic register requirements.

#### Scenario: Word count and style check
- GIVEN the assembled §2 section
- WHEN word count is measured
- THEN it MUST be between 500 and 700 words
- AND the register MUST be third-person academic prose
- AND both citations [4] and [5] MUST be present

**Acceptance Criteria:**
- Word count: 500–700.
- Citations [4] and [5] both present.
- Third-person, academic register throughout.
