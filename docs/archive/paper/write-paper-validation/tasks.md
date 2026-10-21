# Tasks: Write §4 Architectural Validation

## Task 1 — Draft the qualitative justification paragraph

Justify the qualitative evaluation approach.

**Implementation notes:**
- This is early-stage research on a novel methodology; no established benchmark exists for "architectural coherence."
- Quantitative metrics (lines of code, test coverage %) measure output properties, not structural integrity.
- Qualitative artifact analysis is the appropriate method for validating architectural claims in ASE research.
- ~80 words.

**Test plan:**
- The justification is present and reasoned, not just asserted.

---

## Task 2 — Draft Vector 1: Context Hygiene

Validate that the openspec/ structure prevents context dilution.

**Implementation notes:**
- The structural argument: `openspec/specs/` holds only the current canonical state; completed changes move to `openspec/archive/` with their full context (proposal, tasks, spec delta) self-contained.
- The AI agent for any new task receives only: canonical specs + current change artifacts. It never receives the full history of prior changes.
- Evidence: 33+ completed changes in archive, each self-contained. The live specs remain clean and current — they do not accumulate historical noise.
- Contrast with vibe coding: in a long chat session, every prior exchange pollutes the context window.
- ~150 words.

**Test plan:**
- The 33+ figure appears.
- The structural mechanism (archive isolation) is explained.
- The contrast with vibe coding context pollution is present.

---

## Task 3 — Draft Vector 2: Neutralizing Architectural Drift

Validate that backpressure forces reuse of existing interfaces.

**Implementation notes:**
- Use bug-fix-1 as the primary example.
- The AI generated a Prisma query that mixed `select` and `include` at the same nesting level — a pattern that violates Prisma's constraint.
- Prisma's type system threw a `PrismaClientValidationError` at runtime, surfaced as backpressure in the loop.
- The AI could not proceed by inventing a new query pattern; it had to consult the existing conventions in `openspec/project.md` (which explicitly document the `include`-only rule) and conform to them.
- The fix: refactor the query to use `include` consistently throughout all nested relations.
- The convention was subsequently added to `project.md` to prevent recurrence — the spec absorbed the lesson.
- ~180 words.

**Test plan:**
- bug-fix-1 is named.
- `PrismaClientValidationError` appears.
- The forced reuse of the established pattern (include-only) is stated.
- The spec update (convention added to project.md) is mentioned.

---

## Task 4 — Draft the longitudinal evidence paragraph

Frame the evidence as longitudinal, not anecdotal.

**Implementation notes:**
- 33+ changes over the full project lifecycle: from project-initialization through auth, gig lifecycle, messaging, admin moderation, pagination, rate limiting, and UI redesign.
- Each change followed the same SDD workflow: proposal → spec delta → tasks → implementation → archive.
- The consistency of the workflow across domains and complexity levels is itself evidence of the methodology's durability.
- ~80 words.

**Test plan:**
- The 33+ figure appears (may reuse from Task 2).
- Multiple domains are named to convey breadth.

---

## Task 5 — Draft the limitations paragraph

Acknowledge limitations honestly.

**Implementation notes:**
- Single case study: Gigly is one project, one founder, one tech stack. Results cannot be statistically generalized.
- No control group: there is no parallel vibe-coded version of Gigly for comparison. The counterfactual (what would have happened without SDD) is hypothetical.
- Illustrative, not exhaustive: the two validation vectors are representative examples, not a complete audit of all 33+ changes.
- Appropriate framing: these limitations are expected for early-stage ASE research and an extended abstract format. The contribution is a reproducible methodology and qualitative evidence, not a controlled experiment.
- ~120 words.

**Test plan:**
- Single case study limitation is stated.
- No control group limitation is stated.
- The framing as early-stage/extended abstract is present.
- No overclaiming language in the rest of the section.

---

## Task 6 — Assemble and write into icid-2026-paper.md

Combine Tasks 1–5 and write the complete §4 section.

**Implementation notes:**
- Target: 600–800 words.
- Write as `## §4 Architectural Validation` into `openspec/planning/icid-2026-paper.md` after §3.
- Update status: mark write-paper-validation as [x], update progress to 4/6.

**Test plan:**
- Word count 600–800.
- Both vectors present with named artifacts.
- Limitations section present.
- bug-fix-1 and PrismaClientValidationError named.
- 33+ figure present.
