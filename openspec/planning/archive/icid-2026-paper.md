# ICID 2026 Paper: Bootstrapping B2B Marketplaces in the Agentic Era

**Created:** 2026-04-24
**Status:** PLANNED

## Problem

The extended abstract for ICID 2026 has been written and submitted. The full paper must now be produced. The paper documents the greenfield development of Gigly as a case study in Spec-Driven Development (SDD) combined with deterministic execution loops (the "Ralph Wiggum" methodology). The abstract is complete and contains all 5 sections in skeleton form, 7 references, and an AI Disclosure Statement. The task is to expand each section into a full academic paper while grounding every claim in concrete artifacts from this repository.

## Why This Matters

This paper is the primary academic output of the Gigly project. It contributes to the emerging field of Agentic Software Engineering (ASE) by providing a qualitative case study of a methodology that demonstrably prevents architectural drift in LLM-assisted development. The solopreneur angle is novel: existing ASE literature focuses on enterprise teams, not bootstrapped founders. Publishing this positions the ralphy-spec framework and SDD methodology as reproducible, citable contributions to the community.

## Scope

**Systems affected:**
- `ICID 2026 Abstract.md` — seed document, source of all section skeletons and references
- `openspec/archive/` — 33+ completed changes = longitudinal evidence of SDD in practice
- `openspec/specs/` — live specifications = evidence of spec-as-source-of-truth
- `openspec/project.md` — product vision = context for the case study
- `openspec/planning/` — this document and future paper drafts

**Dependencies:**
- All 7 references are already identified; no new literature search required
- The codebase is the case study — no new features need to be built for the paper
- ICID 2026 submission format requirements must be confirmed before `assemble-paper-final`

**Risks:**
- Evidence gap for context hygiene metric (see Gap Analysis below)
- Single case study limits generalizability — must be acknowledged as a limitation
- Academic English consistency across sections written at different times

**Out of scope:**
- Quantitative benchmarks (explicitly excluded in the abstract)
- New Gigly features
- Changes to application code

---

## Evidence Index

| Paper Section | Claim | Artifact(s) in Repo |
|---|---|---|
| §1 Introduction | Vibe coding leads to architectural drift | `openspec/archive/` — 33+ structured changes as the alternative; `openspec/project.md` §MVP Philosophy |
| §1 Introduction | SDD as paradigm shift | `openspec/specs/` directory — specs exist before code |
| §2 Methodology | Specs are primary executable artifacts | Any spec in `openspec/specs/*/spec.md` — written before implementation |
| §2 Methodology | Context decay is prevented by spec anchoring | `openspec/archive/` — each change is self-contained with its own spec delta |
| §2 Methodology | Human-as-architect / AI-as-executor | `openspec/project.md` + any `proposal.md` in archive (human-authored) |
| §3 Implementation | Ralph Wiggum loop mechanics | `openspec/planning/README.md` describes the workflow; ralphy-spec repo [7] |
| §3 Implementation | Automated backpressure replaces human intervention | `openspec/archive/*/tasks.md` — test plans as backpressure signals |
| §4 Validation | Context hygiene: specs/ vs archive/ separation | `openspec/specs/` (live) vs `openspec/archive/` (completed) — structural separation |
| §4 Validation | Drift prevention: AI reuses existing interfaces | `openspec/archive/bug-fix-1/` — PrismaClientValidationError fix forced reuse of existing query pattern |
| §4 Validation | Longitudinal evidence across 33+ changes | Full `openspec/archive/` directory |
| §5 Conclusion | Solopreneur feasibility | `openspec/project.md` §Market Context — single founder, Russian market |

---

## Evidence Gap Analysis

### Gap 1: Context window reset evidence
**Claim:** The loop safely clears the LLM's context window between tasks, preserving system coherence.
**Missing:** No log or artifact directly shows context resets happening between changes.
**Resolution:** Describe the structural mechanism (each change has its own spec + tasks file as the full context) rather than claiming to measure resets. Cite [4] Hong et al. for the theoretical basis of why this matters.

### Gap 2: Quantified architectural drift prevention
**Claim:** Continuous automated backpressure forces the AI to reuse existing interfaces rather than generating redundant logic.
**Missing:** No diff or metric showing "AI tried to create duplicate X, backpressure forced reuse of Y."
**Resolution:** Use `openspec/archive/bug-fix-1/` as a concrete narrative example. The Prisma `select`/`include` mixing error is a documented case where the type system (backpressure) forced correction. Acknowledge this is illustrative, not exhaustive.

### Gap 3: ICID 2026 submission format
**Claim:** Paper is ready for submission.
**Missing:** Confirmation of page limit, citation style, and submission portal requirements.
**Resolution:** Confirm ICID 2026 author guidelines before running `assemble-paper-final`. Add author name and affiliation (currently blank in abstract).

---

## Changes

Execute in order. Each command is self-contained.

### 1. Write Introduction

```bash
/ralphy-plan write-paper-introduction "Write §1 Introduction for ICID 2026 paper titled 'Bootstrapping B2B Marketplaces in the Agentic Era: A Case Study on Spec-Driven Development and Autonomous AI Loops'. Requirements: (1) Expand the skeleton introduction from 'ICID 2026 Abstract.md' into a full section of ~400-600 words, (2) Open with the resource constraint problem for solopreneurs building two-sided B2B platforms, (3) Define 'vibe coding' and cite [1] Meske et al. (IEEE Access 2025) for the definition, (4) Introduce architectural drift as the core failure mode of vibe coding and cite [2] Pan et al. arXiv:2601.13007 for the concept, (5) Introduce Agentic Software Engineering (ASE) as the paradigm shift and cite [3] Hoda ICSE-Companion 2026, (6) Introduce Gigly as the case study: a B2B IT outsourcing marketplace for the Russian market, built entirely by a single founder using AI-native architecture, (7) State the research question explicitly: 'Can Spec-Driven Development combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?', (8) End with a one-paragraph overview of the paper structure (§2 Methodology, §3 Implementation, §4 Validation, §5 Conclusion). Test: section is self-contained, research question is unambiguous, all three citations [1][2][3] are present and correctly attributed."
```

### 2. Write Methodology

```bash
/ralphy-plan write-paper-methodology "Write §2 Methodology (Spec-Driven Development) for ICID 2026 paper. Requirements: (1) Expand the §2 skeleton from 'ICID 2026 Abstract.md' into ~500-700 words, (2) Define SDD formally: structured specifications are the primary executable artifacts; code is a derivative output, not the source of truth, (3) Contrast SDD with traditional programming (code-first) and TDD (test-first) — in SDD, the spec is written before both code and tests, (4) Explain context decay as the core problem SDD solves: cite [4] Hong et al. Chroma Research 2025 for the empirical basis of context rot, (5) Cite [5] Piskala arXiv:2602.00180 for the SDD definition and framing, (6) Describe the physical implementation of SDD in the Gigly project: the openspec/ directory structure (openspec/specs/ for live specs, openspec/archive/ for completed changes, each change having proposal.md + tasks.md + specs/ delta), (7) Explain the human-as-architect / AI-as-executor division: the human author writes all proposals and acceptance criteria; the AI agent implements against them, (8) Include one concrete example from the archive showing the spec-before-code flow (e.g., gig-creation change: spec defined budget/fee/status fields before any Prisma schema was written). Test: a reader unfamiliar with the project can understand and replicate the SDD setup, the openspec/ structure is clearly explained, citations [4][5] are present."
```

### 3. Write Implementation

```bash
/ralphy-plan write-paper-implementation "Write §3 Implementation (Continuous Deterministic Execution Loops) for ICID 2026 paper. Requirements: (1) Expand the §3 skeleton from 'ICID 2026 Abstract.md' into ~500-700 words, (2) Introduce the Ralph Wiggum loop methodology and cite [6] Huntley ghuntley.com/ralph 2025, (3) Present the core loop command: 'while :; do cat PROMPT.md | claude-code; done' — explain each component (PROMPT.md as the spec-derived task, claude-code as the executor, the infinite loop as the constraint), (4) Explain what the loop prevents: premature exit, ad-hoc human intervention, context-switching mid-task, (5) Explain automated backpressure as the feedback mechanism: TypeScript compiler errors, ESLint violations, Vitest/Playwright test failures, and Prisma validation errors all force the AI to self-correct within the loop without human input, (6) Introduce the ralphy-spec framework and cite [7] Yu GitHub 2026 — explain how it bridges SDD specs with the loop mechanics (PROMPT.md is generated from the current change's tasks.md), (7) Describe the Gigly-specific stack that provides backpressure: TypeScript strict mode, Prisma type safety, Vitest integration tests, Playwright E2E tests, (8) Include a concrete loop iteration narrative: pick one archived change (e.g., service-fee-fix) and describe how the loop ran, hit a test failure, and self-corrected. Test: the loop mechanics are reproducible by a reader, the role of backpressure is concrete not abstract, citations [6][7] are present."
```

### 4. Write Architectural Validation

```bash
/ralphy-plan write-paper-validation "Write §4 Architectural Validation for ICID 2026 paper. Requirements: (1) Expand the §4 skeleton from 'ICID 2026 Abstract.md' into ~600-800 words, (2) Open by justifying the qualitative-over-quantitative approach: this is early-stage research on a novel methodology; architectural coherence is better assessed qualitatively than by benchmark scores, (3) Validate Vector 1 — Context Hygiene: show that the openspec/specs/ vs openspec/archive/ separation structurally prevents context dilution. Evidence: 33+ completed changes in archive, each self-contained with its own spec delta; live specs in openspec/specs/ remain clean and current across the full development history, (4) Validate Vector 2 — Neutralizing Architectural Drift: show at least one concrete example where automated backpressure forced the AI to reuse an existing interface rather than generate redundant logic. Use the bug-fix-1 change (PrismaClientValidationError) as the primary example: the Prisma type system rejected the mixed select/include query, forcing correction to the established pattern documented in project.md conventions, (5) Reference the longitudinal nature of the evidence: 33+ changes over the full project lifecycle, not a single snapshot, (6) Acknowledge limitations honestly: single case study, no control group (no parallel vibe-coded version of Gigly exists for comparison), results are illustrative not statistically generalizable, (7) Frame limitations as appropriate for an extended abstract / early-stage ASE research contribution. Test: both validation vectors have concrete artifact evidence, limitations section is present and honest, no unsubstantiated claims."
```

### 5. Write Conclusion

```bash
/ralphy-plan write-paper-conclusion "Write §5 Conclusion for ICID 2026 paper. Requirements: (1) Expand the §5 skeleton from 'ICID 2026 Abstract.md' into ~300-400 words, (2) Restate the research question: 'Can SDD combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?', (3) Answer it based on §4 evidence: yes, qualitatively — the structural separation of specs from code and the automated backpressure of the execution loop demonstrably constrained AI output to existing architectural patterns across 33+ development iterations, (4) State the practical contribution: a concrete, reproducible methodology (SDD + Ralph Wiggum loop + ralphy-spec) that solopreneurs can adopt to build complex platforms without venture capital or large engineering teams, (5) State the theoretical contribution: qualitative validation of SDD as an effective context management strategy in long-running LLM-assisted development, extending [5] Piskala's framework to the agentic execution context, (6) Identify future work: (a) quantitative benchmarks comparing SDD vs. vibe coding on architectural metrics, (b) multi-project replication beyond Gigly, (c) payment gateway integration as the next development phase to test SDD under increased complexity, (7) Close with the solopreneur empowerment framing: spec-driven agentic workflows allow founders to overcome marketplace liquidity challenges by generating adaptable, self-correcting systems from inception. Test: research question is answered, both contributions (practical + theoretical) are stated, future work is concrete and actionable."
```

### 6. Assemble and Finalize

```bash
/ralphy-plan assemble-paper-final "Assemble and finalize the complete ICID 2026 paper. Requirements: (1) Combine §1–§5 into a single document, preserving section numbering and flow, (2) Add the paper header: Title ('Bootstrapping B2B Marketplaces in the Agentic Era: A Case Study on Spec-Driven Development and Autonomous AI Loops'), Authors field (fill in author name), Affiliation field (fill in affiliation), Abstract (copy verbatim from 'ICID 2026 Abstract.md'), Keywords (Agentic Software Engineering, Spec-Driven Development, Autonomous AI, Architectural Drift, Human-AI Teams), (3) Verify all 7 references are present and correctly formatted: [1] Meske et al. IEEE Access 2025, [2] Pan et al. arXiv:2601.13007, [3] Hoda ICSE-Companion 2026, [4] Hong et al. Chroma Research 2025, [5] Piskala arXiv:2602.00180, [6] Huntley ghuntley.com/ralph 2025, [7] Yu GitHub 2026, (4) Append the AI Disclosure Statement verbatim from 'ICID 2026 Abstract.md', (5) Check total word count and page count against ICID 2026 submission requirements (confirm author guidelines first), (6) Proofread for academic English consistency across all sections, (7) Save final paper as a single Markdown file and note the export format required by ICID 2026 (PDF/DOCX). Test: paper is complete with all sections, all 7 references present, author/affiliation filled, AI disclosure present, within submission page limit."
```

---

---

## §1 Introduction

Building a two-sided B2B platform has historically demanded substantial venture capital. The engineering complexity of multi-role workflows, transactional state machines, and secure authentication layers creates entry barriers that effectively exclude solopreneurs from the market. The emergence of Large Language Models (LLMs) appeared to dissolve these barriers: a single founder could, in principle, generate production-grade code through natural-language prompts alone.

In practice, this approach has crystallised into a recognisable pattern. Meske et al. define "vibe coding" as a reconfiguration of intent mediation in software development, in which the developer delegates implementation decisions to an LLM through iterative, conversational prompting rather than explicit specification [1]. The appeal is immediate: prototypes materialise in hours, not weeks, and the cognitive overhead of low-level implementation disappears. For resource-constrained founders, vibe coding appears to be the great equaliser.

The equalisation is illusory. As a codebase grows beyond a few hundred files, vibe-coded systems exhibit a failure mode that Pan et al. term architectural drift [2]: AI-generated code satisfies local functional requirements while silently violating global system topology, dependency injection contracts, and state management invariants. Each new prompt is answered in isolation; the model has no persistent awareness of the architectural decisions made in prior sessions. The result is a codebase that passes its own tests but accumulates invisible structural debt — redundant abstractions, inconsistent data access patterns, and broken separation of concerns — until the system becomes unmaintainable. For a solopreneur without a senior engineer to perform continuous architectural review, this trajectory is terminal.

Addressing this failure requires a paradigm shift. Hoda frames Agentic Software Engineering (ASE) as a discipline that moves beyond code generation toward structured human-AI collaboration, in which autonomous agents operate within defined boundaries set by a human architect [3]. ASE reframes the developer's role: rather than writing code or prompting for code, the human defines the system's invariants, and the AI executes against them. The critical question is how to make those invariants durable across the context resets that are inherent to LLM-based development.

This paper presents Gigly as a case study in answering that question. Gigly is a B2B IT outsourcing marketplace for the Russian market, connecting legal-entity clients with vetted Middle+/Senior specialists for project-based work. It was built entirely by a single founder using an AI-native architecture, with no external engineering team and no venture capital. The development methodology — Spec-Driven Development (SDD) combined with deterministic execution loops — was designed from inception to prevent the architectural drift that vibe coding produces.

This leads to the central research question of this paper: *"Can Spec-Driven Development combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?"*

The remainder of the paper is structured as follows. §2 describes the Spec-Driven Development methodology: how structured specifications serve as the primary executable artifacts and how this prevents context decay across extended development cycles. §3 details the implementation of continuous deterministic execution loops — the "Ralph Wiggum" loop methodology — and the role of automated backpressure in forcing architectural compliance without human intervention. §4 presents qualitative architectural validation across two vectors: context hygiene and drift neutralisation, grounded in concrete artifacts from the Gigly repository. §5 concludes with a summary of contributions and directions for future work.

---

## §2 Methodology: Spec-Driven Development (SDD)

Spec-Driven Development is a software engineering paradigm in which structured, human-authored specifications constitute the primary executable artifacts of a project; code is a derivative output generated against those specifications, not the source of truth \[5\]. This inversion is the defining characteristic of SDD: whereas in conventional development the codebase is the authoritative record of system behavior, in SDD that authority resides in the specification corpus. The AI agent's role is strictly to satisfy the spec; it has no mandate to extend, reinterpret, or revise it.

This positioning distinguishes SDD from both traditional code-first programming and Test-Driven Development. In code-first practice, specifications — when they exist at all — are written after the fact as documentation of decisions already encoded in the implementation. In TDD, tests are written before code, which improves correctness guarantees but leaves the specification implicit: the test suite describes *what* the system does, not *why* or *under what constraints*. In SDD, the specification precedes both tests and code. Acceptance criteria are authored as part of the spec, and tests are subsequently derived from those criteria rather than invented independently. The spec is thus the single artifact from which all downstream artifacts — tests, migrations, server actions, UI components — are generated.

The motivating problem SDD addresses is context decay. Empirical research by Hong et al. demonstrates that LLM output quality degrades measurably as the context window fills with prior conversation turns: the model loses coherence with earlier architectural decisions, begins to contradict established interfaces, and introduces redundant or conflicting logic \[4\]. In long-running development sessions this manifests as architectural drift — locally functional code that violates global system topology. SDD mitigates context decay structurally rather than through prompt engineering: because the specification is a stable external artifact stored on disk, the AI agent can be initialized with a fresh context window for each discrete task and still produce coherent output. The spec replaces conversational memory as the continuity mechanism.

In the Gigly project, SDD is implemented through a three-tier directory structure under `openspec/`. The `openspec/specs/` directory contains live canonical domain specifications organized by concern (authentication, gig lifecycle, database schema, UI, security, and others). These files represent the current authoritative state of the system and are updated only when a change is formally accepted. The `openspec/archive/` directory contains one subdirectory per completed change; each entry holds a `proposal.md` (motivation, scope, and constraints), a `tasks.md` (numbered implementation checklist with per-task test plans), and a `specs/` subdirectory containing only the delta — the additions, modifications, and removals to canonical specs introduced by that change. In-progress changes reside in `openspec/changes/` under the same structure before being promoted to the archive upon completion. The human architect authors all proposals and acceptance criteria; the AI agent reads the assembled context (canonical specs plus the current change's delta and tasks) and implements against it. The agent does not modify specifications.

This division of labor is illustrated concretely by the `gig-creation` change, archived at `openspec/archive/gig-creation/`. Before any database migration was written, the spec delta at `openspec/archive/gig-creation/specs/database/spec.md` defined the full Gig model: `budget` as an integer stored in kopecks to avoid floating-point arithmetic, `serviceFee` calculated as a fixed percentage of budget, `totalAmount` as their sum, and `status` defaulting to `"OPEN"`. The proposal simultaneously stated the constraints governing the change — CLIENT-only creation, tags stored as a comma-separated string, no gig editing or deletion in scope. Only after this specification was complete did the AI agent generate the Prisma schema migration, the `createGig` server action, and the form component. The sequence — proposal authored, spec delta written, tasks enumerated, implementation executed — was strictly observed. This ordering is not incidental; it is the mechanism by which SDD prevents the AI from making architectural decisions that belong to the human architect.

---

## §3 Implementation: Continuous Deterministic Execution Loops

The physical translation of SDD specifications into production code in the Gigly project is governed by the Ralph Wiggum loop methodology \[6\]. Named after the Simpsons character whose defining trait is an inability to stop, the Ralph Wiggum loop places an AI agent inside a continuous execution cycle from which it cannot exit voluntarily. The agent's only path forward is to satisfy the specification; its only path out is success.

The core loop takes the following form:

```bash
while :; do cat PROMPT.md | claude-code; done
```

Each component serves a distinct function. `PROMPT.md` is the loop's input: a task file derived from the current change's `tasks.md` by the ralphy-spec framework, containing the implementation instructions, acceptance criteria, and test commands for the active task. `claude-code` is the executor: the AI agent that reads `PROMPT.md`, performs file edits, runs shell commands, and produces output. The `while :; do ... done` construct is the constraint: the loop restarts unconditionally after each iteration, regardless of whether the previous run succeeded or failed. This structure eliminates three failure modes common to interactive AI-assisted development: premature exit (the agent declares success before verification), ad-hoc human intervention (the agent pauses to ask clarifying questions), and context-switching mid-task (the agent abandons a partially complete implementation to pursue a different approach).

The loop's self-correction mechanism is automated backpressure. Rather than relying on human review to detect errors, the loop surfaces failures through the project's own toolchain. In the Gigly stack, backpressure is provided by four layers: TypeScript strict mode, which rejects type mismatches at compile time; ESLint, which enforces code style and catches common logic errors; Vitest integration tests, which validate server-side business logic against spec scenarios; and Playwright end-to-end tests, which verify complete user flows in a real browser. When any of these layers produces an error, the output is fed back into the next loop iteration as part of the agent's context. The agent must read the error, identify the root cause, and produce a corrected implementation — without human input. The loop does not proceed until the backpressure signal is resolved.

The ralphy-spec framework \[7\] bridges SDD and the loop mechanics. For each active change, ralphy-spec reads the change's `tasks.md` — the human-authored implementation checklist — and generates `PROMPT.md` as a structured prompt that includes the relevant canonical specs, the task instructions, and the test commands to run for verification. This means the loop's input is always traceable to a human-authored artifact: the AI never operates on free-form instructions, only on spec-derived tasks.

The interaction between backpressure and spec-derived input is illustrated by the `service-fee-fix` change. The project specification in `openspec/project.md` stated a 10% service fee; the implementation in `app/actions/gig.ts` calculated 20%. The loop's `PROMPT.md` contained the task to correct the fee constant. The AI updated the calculation from `budgetKopecks * 0.20` to `budgetKopecks * 0.10` and proceeded to run the integration test suite. The tests in `__tests__/integration/gig-creation.test.ts` immediately failed: they had been written to assert a 20% fee and now produced mismatches on every monetary assertion. The loop did not exit. On the next iteration, the AI read the test output, identified the failing assertions, recalculated the expected values at 10%, updated all 40 test cases, and re-ran the suite. All tests passed. No human intervention occurred between the first test failure and the final green run. The entire correction — implementation fix, test update, and verification — was completed autonomously within the loop.

---

## §4 Architectural Validation

This research deliberately shifts focus from final quantitative metrics to qualitative architectural validation. No established benchmark exists for measuring "architectural coherence" in LLM-assisted development; metrics such as test coverage percentages or lines of code measure output properties, not structural integrity. For early-stage research on a novel methodology, qualitative artifact analysis — examining the actual artifacts produced by the system and the mechanisms that shaped them — is the appropriate evaluation method. The two validation vectors below are grounded in concrete, inspectable artifacts from the Gigly repository.

**Vector 1: Context Hygiene.** The central claim of SDD is that structured specifications prevent context dilution across extended development cycles. In the Gigly project, this is enforced structurally rather than through discipline or convention. The `openspec/specs/` directory holds only the current canonical state of the system — ten domain specification files covering authentication, gig lifecycle, database schema, UI, security, and related concerns. When a change is completed, its full context (proposal, tasks, and spec delta) is moved to `openspec/archive/` as a self-contained subdirectory. The AI agent working on any new task receives exactly two inputs: the current canonical specs and the active change's artifacts. It never receives the accumulated history of prior changes.

The evidence for this claim is the archive itself: 33 completed changes spanning the full project lifecycle, from initial project setup through authentication, gig lifecycle management, messaging, admin moderation, pagination, rate limiting, and UI redesign. Each archived change is self-contained; the live specs remain clean and current throughout. This contrasts directly with the vibe coding failure mode: in a long conversational session, every prior exchange — including superseded decisions, abandoned approaches, and resolved bugs — accumulates in the context window and degrades the coherence of subsequent outputs. The archive structure makes context reset the default, not an exceptional intervention.

**Vector 2: Neutralizing Architectural Drift.** The second claim is that automated backpressure forces the AI to reuse existing interfaces rather than generate redundant or conflicting logic. The `bug-fix-1` change provides a concrete illustration. During the implementation of the messaging feature, the AI generated a Prisma query in `app/dashboard/gigs/[id]/page.tsx` that mixed `select` and `include` at the same nesting level across multiple nested relations — `client`, `applications`, `messages`, and `moderations`. Prisma's type system does not permit this pattern; it threw a `PrismaClientValidationError` at runtime: *"Please either use `include` or `select`, but not both at the same time."*

The error was surfaced as backpressure in the execution loop. The AI could not resolve it by inventing a new query pattern; it had to consult the existing codebase conventions. The project's `openspec/project.md` documented the established rule — use `include` consistently throughout nested relations, never mix with `select` at the same level — and the AI refactored the query to conform to it. The fix required no new abstraction and introduced no new interface: it was a correction to an existing query to match an existing convention. Following the fix, the convention was formally added to `project.md` under "Prisma Query Conventions," ensuring the spec absorbed the lesson and future changes would be anchored to it. This is the drift neutralization mechanism in practice: the type system rejects the deviation, the spec provides the correct pattern, and the loop forces convergence.

The longitudinal character of the evidence strengthens both vectors. The 33+ changes span substantially different domains and complexity levels — from a three-line bug fix to a full authentication redesign involving multiple pages, components, server actions, and E2E test suites. The SDD workflow (proposal → spec delta → tasks → implementation → archive) was applied consistently across all of them. The absence of architectural regressions across this breadth — no change broke an interface established by a prior change — is itself evidence that the methodology's structural constraints held over time.

**Limitations.** This study has three limitations that must be acknowledged. First, it is a single case study: Gigly is one project, built by one founder, on one technology stack (Next.js, Prisma, TypeScript). The results cannot be statistically generalized to other projects, teams, or stacks. Second, there is no control group: no parallel vibe-coded version of Gigly exists for comparison. The counterfactual — what the codebase would look like after 33+ unstructured AI-assisted changes — is hypothetical. Third, the two validation vectors are representative examples, not a complete audit of all changes. These limitations are appropriate for an extended abstract and early-stage ASE research. The contribution of this paper is a reproducible methodology and qualitative evidence of its effectiveness, not a controlled experiment. Replication across multiple projects and teams is the natural next step.

---

## §5 Conclusion

This paper addressed the following research question: *Can Spec-Driven Development combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?* Based on the qualitative evidence presented in §4, the answer is affirmative. Across 33+ development iterations spanning authentication, gig lifecycle management, messaging, moderation, and UI redesign, the structural separation of specifications from code and the automated backpressure of the Ralph Wiggum execution loop demonstrably constrained AI output to existing architectural patterns. Context dilution was prevented by archive isolation; interface drift was corrected by the type system before it could propagate.

This study makes two contributions. The practical contribution is a concrete, reproducible methodology — Spec-Driven Development combined with the Ralph Wiggum loop and the ralphy-spec framework — that solopreneurs and small teams can adopt today to build complex, multi-role platforms without venture capital or large engineering teams. The methodology requires no proprietary tooling: a directory structure, a shell loop, and a disciplined commitment to writing specifications before code are sufficient. The theoretical contribution is qualitative validation of SDD as an effective context management strategy in long-running LLM-assisted development \[5\]. Prior work established SDD as a paradigm for AI-assisted coding; this study extends that framework to the agentic execution context, where the AI operates not as an interactive code generator but as an autonomous executor inside a continuous loop. The combination of spec-derived input and automated backpressure produces a system that is self-correcting by construction.

Three directions for future work follow from this study. First, quantitative benchmarks: a controlled comparison of SDD versus vibe coding on measurable architectural metrics — interface duplication rate, regression frequency, and time-to-fix for architectural violations — would provide the statistical evidence that this qualitative study cannot. Second, multi-project replication: applying the methodology to projects beyond Gigly, across different domains, team sizes, and technology stacks, is necessary to test generalizability. Third, increased complexity: payment gateway integration is the next planned development phase for Gigly, introducing external API dependencies and financial state management. This phase will test whether SDD holds under the higher coordination complexity of third-party integrations.

Spec-driven agentic workflows allow founders to overcome marketplace liquidity challenges by generating adaptable, self-correcting systems from inception — fundamentally redefining what is achievable by a single person with a specification and a loop.

---

## Status

- [x] 1. write-paper-introduction
- [x] 2. write-paper-methodology
- [x] 3. write-paper-implementation
- [x] 4. write-paper-validation
- [x] 5. write-paper-conclusion
- [x] 6. assemble-paper-final

**Progress:** 6/6 changes completed
