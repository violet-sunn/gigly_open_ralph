# Tasks: Write §2 Methodology (Spec-Driven Development)

## Task 1 — Draft the SDD formal definition paragraph

Write the opening paragraph of §2 that formally defines SDD.

**Implementation notes:**
- SDD definition: structured specifications are the primary executable artifacts; code is a derivative output, not the source of truth.
- Cite [5] Piskala arXiv:2602.00180 as the source of the SDD framing.
- One paragraph, ~80–100 words.

**Test plan:**
- The paragraph contains a clear, one-sentence formal definition of SDD.
- Citation [5] is present.
- The phrase "source of truth" or equivalent appears to anchor the inversion from code-first.

---

## Task 2 — Draft the paradigm contrast paragraph

Write a paragraph contrasting SDD with traditional code-first programming and TDD.

**Implementation notes:**
- Code-first: code is written first, documentation/specs follow (or never appear).
- TDD: tests are written before code, but code remains the source of truth; specs are implicit.
- SDD: the spec is written before both code AND tests. Tests are derived from spec scenarios, not invented independently.
- Keep the contrast tight — one paragraph, ~100 words.

**Test plan:**
- All three paradigms (code-first, TDD, SDD) are named and distinguished.
- The ordering relationship (spec → tests → code) is explicit for SDD.
- No citation needed here unless a reference for TDD is warranted (none in the existing reference list — omit).

---

## Task 3 — Draft the context decay motivation paragraph

Write a paragraph explaining context decay as the core problem SDD solves.

**Implementation notes:**
- Context decay (also "context rot"): as LLM context windows fill with prior conversation turns, code generation quality degrades — the model loses coherence with earlier architectural decisions.
- Cite [4] Hong et al. Chroma Research 2025 for the empirical basis.
- Explain how SDD mitigates this: because the spec is a stable external artifact, the AI agent can be given a fresh context window for each task and still produce coherent output — the spec replaces conversational memory.
- ~100 words.

**Test plan:**
- Citation [4] is present.
- The mechanism of mitigation is explained (spec as external anchor, not conversational memory).
- The term "context decay" or "context rot" appears with a citation.

---

## Task 4 — Draft the Gigly physical implementation paragraph

Describe the openspec/ directory structure as implemented in the Gigly project.

**Implementation notes:**
- `openspec/specs/` — live canonical domain specs (authentication, gig, database, ui, etc.). These are the single source of truth for the current system state.
- `openspec/archive/` — one subdirectory per completed change. Each contains: `proposal.md` (why/what/constraints), `tasks.md` (numbered checklist with test plans), `specs/` (delta specs for that change only).
- `openspec/changes/` — in-progress changes (same structure as archive entries before completion).
- The human author creates the proposal and tasks; the AI agent reads them and implements. The AI does not modify specs.
- ~120 words.

**Test plan:**
- All three directories (`specs/`, `archive/`, `changes/`) are named and their roles described.
- The contents of an archive entry (proposal.md, tasks.md, specs/ delta) are listed.
- The human/AI division of labor is stated.

---

## Task 5 — Draft the concrete example paragraph

Provide one concrete example from the archive illustrating the spec-before-code flow.

**Implementation notes:**
- Use the `gig-creation` change from `openspec/archive/gig-creation/`.
- The spec delta at `openspec/archive/gig-creation/specs/database/spec.md` defined the Gig model fields (`budget` as Int in kopecks, `serviceFee` as 20% of budget, `totalAmount`, `status` with default "OPEN") before any Prisma schema migration was written.
- The proposal at `openspec/archive/gig-creation/proposal.md` stated constraints (budget stored in kopecks, tags as comma-separated string, CLIENT-only creation) before implementation began.
- Show the sequence: proposal written → database spec delta written → tasks written → AI agent ran migration and server action.
- ~100 words.

**Test plan:**
- The gig-creation change is named explicitly.
- At least two specific field names from the spec (e.g., `budget`, `serviceFee`, `status`) appear in the example.
- The temporal ordering (spec before code) is unambiguous.
- A reader unfamiliar with the project can understand what happened.

---

## Task 6 — Assemble and verify the complete §2 section

Combine Tasks 1–5 into a single cohesive §2 section and verify against all acceptance criteria.

**Implementation notes:**
- Target: 500–700 words total.
- Ensure paragraph transitions are smooth.
- Verify citations [4] and [5] are both present.
- Verify the openspec/ structure is clearly explained.
- Verify a reader unfamiliar with the project can understand and replicate the SDD setup.
- Output the final section text ready to paste into the paper.

**Test plan:**
- Word count is between 500 and 700.
- Citations [4] and [5] appear.
- The three directories (specs/, archive/, changes/) are named.
- The human-as-architect / AI-as-executor division is stated.
- The gig-creation example is present with specific field names.
- The formal SDD definition is present in the first paragraph.
