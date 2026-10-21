# Tasks: Create Paper Depth Revision Plan

## Task 1 — Diagnose the current paper section by section

Produce a structured critique of `icid-2026-paper-final.md` identifying scientific deficiencies in each section.

**Implementation notes:**
- Read the full paper.
- For each section (§1–§5), identify: missing research method framing, unsubstantiated claims, missing operationalization, missing related work hooks, and weak validation.
- Key deficiencies to surface:
  - §1: No explicit statement of research design (case study? action research?). "Architectural drift" cited from Pan et al. [2] but not operationalized for this study.
  - §2: No theoretical model explaining the mechanism. SDD is described but not theorized. Why does externalizing specs prevent drift — what is the cognitive/computational mechanism?
  - §3: Loop mechanics described but no discussion of failure modes or boundary conditions. When does the loop NOT work?
  - §4: Two anecdotes ≠ validation. No observation protocol. No cross-change analysis. "33+ changes" cited as evidence but never analyzed as a dataset.
  - §5: Contributions stated but not differentiated from prior work. What exactly does this paper add that [5] Piskala does not already cover?
- Output: a diagnosis table with columns: Section | Claim | Deficiency | Fix Required.

**Test plan:**
- Diagnosis table covers all 5 sections.
- Each deficiency entry names a specific claim and a specific fix.
- At least 10 deficiency entries total.

---

## Task 2 — Design the theoretical model for §2

Articulate a mechanistic explanation of why SDD prevents architectural drift, suitable for insertion into §2.

**Implementation notes:**
- The core mechanism: LLM architectural coherence degrades as a function of context window saturation (Hong et al. [4]). SDD externalizes the architectural invariants to a persistent artifact (the spec corpus), decoupling coherence from context window state. Each task invocation is a fresh context window seeded with the full spec — equivalent to a stateless function call against a persistent database.
- Frame this as the "Stateless Executor / Persistent Spec" model: the AI is a stateless function; the spec is the persistent state. Architectural coherence is a property of the spec, not of the conversation.
- Contrast with vibe coding: in vibe coding, architectural coherence is a property of the conversation history — it degrades with length. In SDD, it is a property of the spec corpus — it is stable by construction.
- This model makes a falsifiable prediction: architectural drift should correlate with context window saturation in vibe-coded projects and be absent (or bounded) in SDD projects. This is the basis for the future work quantitative benchmark.
- ~200 words for the model paragraph.
- Identify whether any additional citation is needed (e.g. stateless computation theory, external memory in LLMs).

**Test plan:**
- The model is stated in one clear paragraph.
- The falsifiable prediction is explicit.
- The contrast with vibe coding is present.
- No new citation is introduced without justification.

---

## Task 3 — Map the related work gap and identify missing references

Identify the 4–6 additional references needed to situate the contribution properly, and draft the related work section.

**Implementation notes:**
- Current paper has 7 references but no dedicated related work section. The introduction gestures at prior work but does not engage with it.
- Missing reference categories:
  - (a) **External memory / retrieval-augmented generation for LLMs**: work showing that externalizing context improves LLM coherence (e.g. RAG literature, Lewis et al. 2020 or similar). This supports the theoretical model in Task 2.
  - (b) **Specification-based testing and formal methods lite**: work on using specs as the source of truth for test generation (e.g. property-based testing, contract-driven development). This situates SDD in a longer tradition.
  - (c) **Case study methodology in software engineering**: Yin (2018) "Case Study Research and Applications" or Runeson & Höst (2009) "Guidelines for conducting and reporting case study research in software engineering." Citing one of these legitimizes the qualitative approach.
  - (d) **Human-AI teaming in software development**: beyond Hoda [3], there is emerging work on role division in human-AI pairs (e.g. Xu et al. 2023 or similar). This strengthens the human-as-architect framing.
- For each missing reference: state the claim it supports, the section where it belongs, and a placeholder citation label [8]–[11].
- Draft a §1.1 Related Work subsection (~300 words) that positions the paper against these references.

**Test plan:**
- At least 4 missing reference categories identified.
- Each has a named claim it supports and a section placement.
- Related work draft is present and ~300 words.
- The draft does not merely list papers — it argues how this paper extends or differs from each.

---

## Task 4 — Operationalize "architectural drift" and "context decay" for this study

Write precise, falsifiable definitions of the two core constructs as used in this paper.

**Implementation notes:**
- **Architectural drift** (as used in this study): an observable state in which a code artifact violates one or more invariants documented in the canonical spec corpus at the time of its generation. Operationalized as: a change that required correction by backpressure (compiler, type system, or test failure) due to violation of a pre-existing spec-documented convention.
  - Observable proxy: the presence of a backpressure-triggered correction in an archived change's git history.
  - Example: bug-fix-1 — Prisma select/include mixing violated the include-only convention in project.md.
- **Context decay** (as used in this study): a degradation in the AI agent's adherence to previously established architectural decisions, attributable to context window saturation rather than spec ambiguity.
  - Observable proxy: in vibe coding, this is unobservable without logs. In SDD, its *absence* is observable: no archived change introduced a regression against a prior change's spec-documented interface.
  - This asymmetry is itself a finding: SDD makes context decay observable (by its absence) in a way that vibe coding does not.
- These definitions must appear in §2 (methodology) before the constructs are used in §4 (validation).
- ~150 words total for both definitions.

**Test plan:**
- Both constructs have a one-sentence formal definition.
- Both have an observable proxy stated.
- The asymmetry observation (SDD makes absence of decay observable) is present.
- Definitions are placed in §2, before §4 uses them.

---

## Task 5 — Redesign the §4 validation as a structured observation protocol

Replace the two-anecdote validation with a protocol applied across the full archive.

**Implementation notes:**
- The current §4 uses two examples (bug-fix-1, service-fee-fix) as if they are representative. A reviewer will ask: why these two? What about the other 31+ changes?
- Redesign as a structured observation protocol:
  - **Unit of analysis**: each archived change in `openspec/archive/`.
  - **Observation 1 (Context Hygiene)**: For each change, verify that the canonical specs in `openspec/specs/` were not modified by the change's implementation (only the delta in `specs/` subdirectory was touched). This is verifiable by inspecting the archive structure.
  - **Observation 2 (Drift Neutralization)**: For each change, identify whether a backpressure event occurred (compiler/type/test failure that required correction). Classify as: (a) no backpressure needed, (b) backpressure triggered, self-corrected within loop, (c) backpressure triggered, required spec update.
  - **Aggregate finding**: across N changes, X% required backpressure correction; in all cases, correction converged to the existing spec-documented convention rather than introducing a new one.
- This transforms §4 from "here are two stories" to "here is a protocol applied to 33+ observations."
- The protocol does not require quantitative benchmarks — it is a structured qualitative audit.
- Identify which archive changes to sample if full audit is impractical (suggest: stratified sample of 10 — 3 early, 4 mid, 3 late in project lifecycle).

**Test plan:**
- Protocol has a named unit of analysis.
- Two observation types are defined with verifiable criteria.
- Aggregate finding structure is specified (even if values are TBD pending audit).
- Sampling strategy is present if full audit is impractical.

---

## Task 6 — Sharpen the §5 contributions against prior work

Rewrite the contributions paragraph to differentiate this paper's claims from [5] Piskala and [6] Huntley.

**Implementation notes:**
- Current §5 states: "Prior work established SDD as a paradigm for AI-assisted coding; this study extends that framework to the agentic execution context." This is vague.
- Piskala [5] establishes SDD as a paradigm but does not: (a) apply it to a full production system over 33+ iterations, (b) combine it with a deterministic execution loop, (c) study the interaction between spec externalization and context decay prevention.
- Huntley [6] describes the Ralph Wiggum loop as an engineering practice but does not: (a) theorize why it works, (b) combine it with SDD, (c) study its effect on architectural coherence over time.
- This paper's specific contributions:
  1. First longitudinal case study of SDD applied to a production system over 33+ iterations.
  2. The "Stateless Executor / Persistent Spec" theoretical model explaining the mechanism of context decay prevention.
  3. Empirical demonstration that SDD + deterministic loops is sufficient for a solopreneur to build a production-grade multi-role platform — no enterprise team required.
  4. A structured observation protocol for validating architectural coherence in LLM-assisted development (the §4 redesign from Task 5).
- Rewrite the contributions paragraph (~150 words) with these four points, each differentiated from prior work.

**Test plan:**
- Four contributions are named.
- Each is differentiated from at least one prior work by name.
- No contribution is stated without a corresponding artifact or observation in the paper.

---

## Task 7 — Assemble the planning document

Combine Tasks 1–6 into `openspec/planning/paper-depth-revision.md`.

**Implementation notes:**
- Follow the planning document format from `openspec/specs/planning/spec.md`.
- The planning document must contain:
  - Problem section: the scientific deficiencies diagnosed in Task 1
  - Why This Matters: peer review risk and the paper's genuine novelty
  - Scope: files affected, dependencies, risks
  - Changes section: one ralphy-plan command per revision concern (6 changes total)
  - Status section: all unchecked
- The 6 changes to generate ralphy-plan commands for:
  1. `paper-add-research-method` — add explicit research design framing to §1 and §2
  2. `paper-add-theoretical-model` — insert the Stateless Executor / Persistent Spec model into §2
  3. `paper-add-related-work` — add §1.1 Related Work with 4–6 new references
  4. `paper-operationalize-constructs` — add formal definitions of architectural drift and context decay to §2
  5. `paper-redesign-validation` — replace §4 anecdotes with structured observation protocol
  6. `paper-sharpen-contributions` — rewrite §5 contributions paragraph against prior work
- Each ralphy-plan command must include: what to write, where in the paper, word count target, and test plan.

**Test plan:**
- Planning document exists at `openspec/planning/paper-depth-revision.md`.
- All 6 sections of the planning format are present.
- All 6 ralphy-plan commands are present and copy-pasteable.
- Each command includes a test plan.
- Status section shows 0/6 completed.
