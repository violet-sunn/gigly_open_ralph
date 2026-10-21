# Spec Delta: paper-redesign-validation

## MODIFIED Requirements

### Requirement: §4 Validation Method

The §4 body MUST open with a protocol statement that:
- Names the unit of analysis as each archived change in `openspec/archive/`
- States the observation method as artifact analysis of the `openspec/` corpus
- Names the stratified sample of 10 changes with lifecycle stratum labels
- States the rationale for the sample (full lifecycle coverage, all major domain areas)

#### Scenario: Protocol statement present

**Given** the revised `icid-2026-paper-final.md`
**When** §4 is read
**Then** the opening paragraph names all 10 sampled changes and states the observation method before any vector analysis begins

---

### Requirement: §4 Vector 1 — Context Hygiene Finding

Vector 1 MUST report a protocol finding across the full sample, not merely a structural argument.

The finding MUST state that for each of the 10 sampled changes, the canonical `openspec/specs/` directory was not modified by the change's implementation — the delta was always confined to the change's own `specs/` subdirectory.

The finding MUST be presented as verifiable by directory inspection, not measurement.

#### Scenario: Finding stated across sample

**Given** the revised §4
**When** Vector 1 is read
**Then** the text reports a finding about all 10 sampled changes (e.g., "across all 10 sampled changes" or equivalent)
**And** the finding is grounded in directory structure, not a metric

---

### Requirement: §4 Vector 2 — Three-Category Coding Scheme

Vector 2 MUST define and apply a three-category coding scheme for backpressure events:

- **(a)** No backpressure event recorded in `tasks.md` or git history
- **(b)** Backpressure triggered; AI self-corrected to existing spec-documented convention within the loop
- **(c)** Backpressure triggered; correction required a spec update

`bug-fix-1` MUST be classified as Type (b): Prisma `select`/`include` mix rejected at runtime; AI corrected to `include`-only convention; convention absorbed into `project.md`.

`service-fee-fix` MUST be classified as Type (b) with test-update cascade: fee constant corrected; test suite failed on 20% assertions; AI updated all 40 test cases within the loop.

The aggregate distribution across the 10 sampled changes MUST be reported as a qualitative finding.

#### Scenario: Coding scheme defined and applied

**Given** the revised §4
**When** Vector 2 is read
**Then** all three categories (a), (b), (c) are defined
**And** `bug-fix-1` is classified within the scheme
**And** `service-fee-fix` is classified within the scheme
**And** an aggregate distribution is reported

---

### Requirement: §4 No Quantitative Benchmarks

§4 MUST NOT introduce quantitative metrics, percentages as primary claims, or controlled comparisons.

The protocol produces qualitative classifications. Aggregate distributions (e.g., "8 of 10 changes") are acceptable as qualitative findings, not benchmarks.

#### Scenario: No benchmarks present

**Given** the revised §4
**When** the text is reviewed
**Then** no percentage is used as a primary performance claim
**And** no controlled comparison to a baseline is made
**And** no metric table is introduced

---

### Requirement: §4 Limitations Paragraph Retained

The limitations paragraph MUST be retained unchanged in substance. It MUST contain:
- Acknowledgment that this is a single case study
- Acknowledgment that there is no control group
- Acknowledgment that the validation vectors are representative, not a complete audit

#### Scenario: Limitations intact

**Given** the revised §4
**When** the limitations paragraph is read
**Then** all three limitations are present
**And** no new limitations are added that contradict the abstract's framing

---

### Requirement: §4 Word Count

§4 MUST be approximately 850 words (±50), up from approximately 600 words in the prior version.

#### Scenario: Word count in range

**Given** the revised §4
**When** words are counted
**Then** the count is between 800 and 900

---

## UNCHANGED Requirements

All other sections of `icid-2026-paper-final.md` — §1 (Introduction), §2 (Methodology), §3 (Implementation), §5 (Conclusion), Abstract, References, AI Disclosure — are unchanged by this change.
