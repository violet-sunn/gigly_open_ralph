# Tasks: paper-redesign-validation

## Task 1: Rewrite §4 of `icid-2026-paper-final.md`

**File:** `icid-2026-paper-final.md`

**Scope:** Replace the body of §4 (lines 83–95, from "The validation approach follows…" through the end of the limitations paragraph). The section heading `## 4 Architectural Validation` and the `---` separator after the limitations paragraph are retained unchanged.

### Implementation

Produce a revised §4 with the following structure:

**Opening protocol statement (~80 words):**
- Unit of analysis: each archived change in `openspec/archive/`
- Observation method: artifact analysis of the `openspec/` corpus (directory structure, `proposal.md`, `tasks.md`, spec deltas, git history)
- Sample: stratified selection of 10 changes — 3 early lifecycle (`project-initialization`, `user-login-and-sessions`, `gig-creation`), 4 mid lifecycle (`messaging-iteration-1`, `admin-role-and-moderation`, `bug-fix-1`, `service-fee-fix`), 3 late lifecycle (`pagination-gig-browsing`, `rate-limiting`, `ui-design-system-overhaul`)
- Rationale: covers full project lifecycle and all major domain areas

**Vector 1 — Context Hygiene:**
- Retain the structural argument (separation of `openspec/specs/` from `openspec/archive/`)
- Upgrade with a protocol finding: for each of the 10 sampled changes, the canonical `openspec/specs/` directory was not modified by the change's implementation — the delta was always confined to the change's own `specs/` subdirectory
- Present as a finding: 10/10 sampled changes show clean spec separation
- Note this is verifiable by directory inspection, not measurement
- Retain the contrast with vibe coding's context accumulation failure mode

**Vector 2 — Neutralizing Architectural Drift:**
- Introduce the three-category coding scheme:
  - (a) no backpressure event recorded in `tasks.md` or git history
  - (b) backpressure triggered, AI self-corrected to existing spec-documented convention within the loop
  - (c) backpressure triggered, correction required a spec update
- Position `bug-fix-1` as a Type (b) instance: Prisma `select`/`include` mix rejected at runtime; AI corrected to `include`-only per existing convention; convention then absorbed into `project.md`
- Position `service-fee-fix` as a Type (b) instance with test-update cascade: fee constant corrected; test suite failed on 20% assertions; AI updated all 40 test cases within the loop without human intervention
- Report aggregate distribution across the 10 sampled changes as a qualitative finding (8 Type (a), 1 Type (b) with test-update cascade, 1 Type (b)+(c))

**Longitudinal paragraph:**
- Retain the argument that 33+ changes spanning different domains and complexity levels, with consistent SDD workflow application, and absence of architectural regressions, constitutes evidence that structural constraints held over time

**Limitations paragraph:**
- Retain verbatim (single case study, no control group, representative examples not complete audit)

### Test Plan

After writing the revised §4, verify:

1. **Protocol statement present with named sample:** The opening paragraph names all 10 sampled changes and states the observation method.
   - Check: search for "project-initialization", "user-login-and-sessions", "gig-creation", "messaging-iteration-1", "admin-role-and-moderation", "bug-fix-1", "service-fee-fix", "pagination-gig-browsing", "rate-limiting", "ui-design-system-overhaul" — all must appear in §4.

2. **Vector 1 reports a finding across the sample:** The text states a finding about all 10 changes, not just a structural argument.
   - Check: §4 contains language equivalent to "10/10 sampled changes show clean spec separation" or "across all 10 sampled changes, the canonical specs/ directory was not modified."

3. **Vector 2 uses the three-category coding scheme:** Categories (a), (b), (c) are defined and applied.
   - Check: §4 defines all three categories and classifies at least `bug-fix-1` and `service-fee-fix` within them.

4. **bug-fix-1 and service-fee-fix positioned within the protocol:** Both appear as named instances within the coding scheme, not as standalone anecdotes.
   - Check: both change names appear after the coding scheme is introduced, not before.

5. **No quantitative benchmarks introduced:** No percentages used as primary claims, no controlled comparisons, no metrics tables.
   - Check: search §4 for "%" — any occurrence must be in the limitations paragraph or in a qualitative framing ("8 of 10" is acceptable as a qualitative distribution report, not a benchmark).

6. **Limitations paragraph retained:** The three-limitation structure (single case, no control group, representative not complete audit) is present and unchanged in substance.
   - Check: §4 ends with a paragraph containing "single case study", "no control group", and "representative examples."

7. **Word count target:** §4 is approximately 850 words (±50).
   - Check: count words in revised §4.

8. **No changes outside §4:** §1, §2, §3, §5, abstract, references, and AI disclosure are unchanged.
   - Check: diff the file — only lines within §4 body should change.

### Acceptance Criteria

- [ ] Protocol statement present with all 10 named changes and stated observation method
- [ ] Vector 1 reports a finding across the sample (not just a structural argument)
- [ ] Vector 2 defines three-category coding scheme and applies it
- [ ] `bug-fix-1` classified as Type (b) within the protocol
- [ ] `service-fee-fix` classified as Type (b) with test-update cascade within the protocol
- [ ] Aggregate distribution reported as qualitative finding
- [ ] No quantitative benchmarks or controlled comparisons introduced
- [ ] Limitations paragraph retained verbatim in substance
- [ ] §4 word count ~850 words
- [ ] No changes outside §4
