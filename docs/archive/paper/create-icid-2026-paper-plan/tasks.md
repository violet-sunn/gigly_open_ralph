# Tasks: create-icid-2026-paper-plan

## Checklist

- [ ] 1. Analyze project context and evidence base
- [ ] 2. Map paper sections to repo artifacts
- [ ] 3. Identify evidence gaps
- [ ] 4. Create planning document at `openspec/planning/icid-2026-paper.md`

---

## Task 1: Analyze project context and evidence base

**What to do:**
- Read `openspec/project.md` for the full product vision and architecture
- Read `ICID 2026 Abstract.md` for the paper's claims and structure
- Read `openspec/planning/README.md` for planning document format
- Scan `openspec/archive/` to enumerate all 33+ completed changes as evidence of the SDD workflow in action
- Read `openspec/specs/` for current live specifications as evidence of the spec-as-source-of-truth claim

**Test plan:**
- Verify all 7 references in the abstract map to real, citable sources
- Verify the archive contains enough changes to demonstrate the loop methodology empirically

---

## Task 2: Map paper sections to repo artifacts

**What to do:**
Map each of the 5 paper sections to concrete evidence:

| Section | Claim | Evidence in repo |
|---|---|---|
| §1 Introduction | Vibe coding leads to architectural drift | openspec/archive/ shows structured alternative |
| §2 SDD Methodology | Specs are primary artifacts, not code | openspec/specs/ directory structure |
| §3 Execution Loops | `while :; do cat PROMPT.md \| claude-code; done` | ralphy-spec framework, PROMPT.md if present |
| §4 Architectural Validation | Context hygiene + no drift | openspec/specs/ vs openspec/archive/ separation |
| §5 Conclusion | SDD + loops mitigate hallucinations | Full change history as longitudinal evidence |

**Test plan:**
- Every claim in the abstract has at least one concrete artifact pointer
- No claim is made without a corresponding evidence source

---

## Task 3: Identify evidence gaps

**What to do:**
Identify what the paper claims that is NOT yet documented or measurable:

- **Context hygiene metric**: Is there a way to show context window resets between tasks? (PROMPT.md, loop logs)
- **Architectural drift prevention**: Can we show a before/after or a specific instance where backpressure forced reuse?
- **Solopreneur feasibility**: Can we quantify lines of code, number of changes, or time-to-feature?
- **Qualitative validation vectors**: Are the two vectors (context hygiene, neutralizing drift) sufficiently illustrated with examples?

Document gaps as open questions in the planning document so the author knows what to address during writing.

**Test plan:**
- Gap list is explicit and actionable
- Each gap has a suggested resolution (find artifact, add measurement, or acknowledge as limitation)

---

## Task 4: Create planning document

**What to do:**
Create `openspec/planning/icid-2026-paper.md` following the format in `openspec/planning/README.md`.

The document MUST contain:

1. **Problem** — the paper needs to be written; the abstract is the seed
2. **Why This Matters** — ICID 2026 submission; documents the methodology for the community
3. **Scope** — all 5 paper sections, evidence mapping, gap analysis
4. **Changes** — one `/ralphy-plan` command per paper section/task:

```bash
# Section 1: Introduction + Literature Review
/ralphy-plan write-paper-introduction "Write §1 Introduction for ICID 2026 paper. Requirements: (1) Expand abstract intro into full section (~400-600 words), (2) Cite [1] Meske et al. for vibe coding definition, (3) Cite [2] Pan et al. for architectural drift, (4) Cite [3] Hoda for ASE framing, (5) Introduce Gigly as the case study, (6) State research question explicitly: can SDD + deterministic loops prevent architectural drift in bootstrapped B2B platforms?, (7) End with paper structure overview. Test: section stands alone, research question is clear, all citations present."

# Section 2: Methodology
/ralphy-plan write-paper-methodology "Write §2 Methodology (SDD) for ICID 2026 paper. Requirements: (1) Expand abstract §2 into full section (~500-700 words), (2) Define SDD formally: specs as primary executable artifacts, (3) Contrast with TDD and traditional programming, (4) Cite [4] Hong et al. for context decay/rot, (5) Cite [5] Piskala for SDD definition, (6) Describe openspec/ directory structure as the physical implementation of SDD, (7) Explain the human-as-architect / AI-as-executor division of labor, (8) Include concrete example from openspec/archive/ showing spec → implementation flow. Test: methodology is reproducible by a reader, openspec structure is explained, citations correct."

# Section 3: Implementation (Execution Loops)
/ralphy-plan write-paper-implementation "Write §3 Implementation (Execution Loops) for ICID 2026 paper. Requirements: (1) Expand abstract §3 into full section (~500-700 words), (2) Describe the Ralph Wiggum loop: while :; do cat PROMPT.md | claude-code; done, (3) Cite [6] Huntley for loop methodology, (4) Cite [7] Yu for ralphy-spec framework, (5) Explain automated backpressure: compiler errors, type system, linters as feedback signals, (6) Explain how the loop prevents premature exit and ad-hoc human intervention, (7) Describe how ralphy-spec bridges SDD specs with the loop mechanics, (8) Include a concrete example of a loop iteration from the Gigly development history. Test: loop mechanics are clearly explained, a reader could replicate the setup, citations correct."

# Section 4: Architectural Validation
/ralphy-plan write-paper-validation "Write §4 Architectural Validation for ICID 2026 paper. Requirements: (1) Expand abstract §4 into full section (~600-800 words), (2) Justify qualitative-over-quantitative approach explicitly, (3) Validate context hygiene vector: show openspec/specs/ vs openspec/archive/ separation prevents context dilution across 33+ changes, (4) Validate drift prevention vector: show at least one concrete example where backpressure forced AI to reuse existing interfaces rather than generate redundant logic, (5) Reference specific archived changes as longitudinal evidence, (6) Acknowledge limitations honestly (single case study, no control group), (7) Frame limitations as appropriate for an extended abstract / early-stage research. Test: both validation vectors have concrete evidence, limitations are acknowledged, claims are falsifiable."

# Section 5: Conclusion
/ralphy-plan write-paper-conclusion "Write §5 Conclusion for ICID 2026 paper. Requirements: (1) Expand abstract §5 into full section (~300-400 words), (2) Restate research question and answer it based on §4 evidence, (3) State practical contribution: a methodology solopreneurs can adopt, (4) State theoretical contribution: qualitative validation of SDD + loops for ASE, (5) Identify future work: quantitative benchmarks, multi-project replication, payment gateway integration as next case study phase, (6) End with the solopreneur empowerment framing from the abstract. Test: conclusion answers the research question, contributions are clearly stated, future work is concrete."

# Final assembly
/ralphy-plan assemble-paper-final "Assemble and finalize ICID 2026 paper. Requirements: (1) Combine all sections into single document, (2) Verify all 7 references are correctly formatted per ICID 2026 style guide, (3) Add AI Disclosure Statement (already drafted in abstract), (4) Check word/page count against ICID 2026 submission requirements, (5) Verify author name, affiliation fields are filled, (6) Proofread for academic English consistency, (7) Export to required submission format (PDF or DOCX). Test: paper is complete, all sections present, references correct, within page limit, ready for submission."
```

5. **Status tracking** — checkbox list for all 6 writing tasks
6. **Evidence index** — quick-reference table of repo artifacts per section

**Test plan:**
- Planning document follows the format in `openspec/planning/README.md`
- All 6 ralphy-plan commands are copy-pasteable and self-contained
- Evidence index covers all 5 paper sections
- Gap list from Task 3 is included as a dedicated subsection
