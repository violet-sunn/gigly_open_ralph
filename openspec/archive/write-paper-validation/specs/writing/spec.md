# Writing Specification — §4 Architectural Validation Section

## ADDED Requirements

### Requirement: Qualitative Justification
The §4 section MUST open with a justification for the qualitative evaluation approach.

#### Scenario: Justification present
- GIVEN a reader expecting quantitative benchmarks
- WHEN they read the opening of §4
- THEN they MUST understand why qualitative artifact analysis is appropriate for this research
- AND the justification MUST be reasoned, not merely asserted

**Acceptance Criteria:**
- A justification for qualitative-over-quantitative is present in the opening paragraph.

---

### Requirement: Vector 1 — Context Hygiene
The §4 section MUST validate context hygiene via the openspec/ structural separation.

#### Scenario: Archive isolation as evidence
- GIVEN a reader evaluating the context hygiene claim
- WHEN they read Vector 1
- THEN they MUST understand how the archive/specs separation prevents context dilution
- AND the 33+ completed changes figure MUST appear as evidence of longitudinal consistency

**Acceptance Criteria:**
- The structural mechanism (archive isolation) is explained.
- The 33+ figure appears.
- The contrast with vibe coding context pollution is present.

---

### Requirement: Vector 2 — Drift Neutralization
The §4 section MUST validate drift neutralization with the bug-fix-1 example.

#### Scenario: bug-fix-1 as concrete evidence
- GIVEN a reader evaluating the drift neutralization claim
- WHEN they read Vector 2
- THEN they MUST see the bug-fix-1 change named
- AND `PrismaClientValidationError` MUST appear
- AND the forced reuse of the established include-only pattern MUST be described

**Acceptance Criteria:**
- `bug-fix-1` is named.
- `PrismaClientValidationError` appears.
- The include-only convention and its source (project.md) are referenced.

---

### Requirement: Limitations
The §4 section MUST include an honest limitations paragraph.

#### Scenario: Limitations stated
- GIVEN a peer reviewer
- WHEN they read the limitations paragraph
- THEN they MUST find: single case study, no control group, illustrative not exhaustive
- AND the framing as early-stage ASE research MUST be present

**Acceptance Criteria:**
- Single case study limitation stated.
- No control group limitation stated.
- Early-stage/extended abstract framing present.

---

### Requirement: Length
The §4 section MUST be 600–800 words.

#### Scenario: Word count check
- GIVEN the assembled §4 section
- WHEN word count is measured
- THEN it MUST be between 600 and 800 words

**Acceptance Criteria:**
- Word count: 600–800.
