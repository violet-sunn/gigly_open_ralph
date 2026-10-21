# Tasks: Write §3 Implementation (Continuous Deterministic Execution Loops)

## Task 1 — Draft the Ralph Wiggum loop introduction paragraph

Introduce the loop methodology and cite [6].

**Implementation notes:**
- The Ralph Wiggum loop is a continuous deterministic execution pattern in which an AI agent is placed inside an infinite shell loop and deprived of the ability to exit or request human intervention.
- Cite [6] Huntley ghuntley.com/ralph 2025.
- ~80 words.

**Test plan:**
- Citation [6] is present.
- The loop is named "Ralph Wiggum loop" or "Ralph Wiggum loop methodology".

---

## Task 2 — Draft the loop mechanics paragraph

Present and explain the core loop command.

**Implementation notes:**
- Command: `while :; do cat PROMPT.md | claude-code; done`
- PROMPT.md: the spec-derived task file generated from the current change's tasks.md by ralphy-spec.
- claude-code: the AI executor.
- The infinite loop: the constraint that prevents premature exit.
- What the loop prevents: premature exit, ad-hoc human intervention, context-switching mid-task.
- ~120 words.

**Test plan:**
- The command appears verbatim.
- All three components (PROMPT.md, claude-code, infinite loop) are explained.
- The three prevented behaviors are named.

---

## Task 3 — Draft the automated backpressure paragraph

Explain backpressure as the feedback mechanism.

**Implementation notes:**
- Backpressure: compiler errors, linter violations, and test failures that the loop surfaces as signals forcing the AI to self-correct.
- Gigly-specific backpressure sources: TypeScript strict mode, ESLint, Prisma type validation, Vitest integration tests, Playwright E2E tests.
- The AI must autonomously analyze the error output, formulate a hypothesis, and re-implement — without human input.
- ~120 words.

**Test plan:**
- At least four backpressure sources are named.
- The self-correction mechanism is described.
- No citation needed (this is the paper's own observation).

---

## Task 4 — Draft the ralphy-spec framework paragraph

Introduce ralphy-spec and cite [7].

**Implementation notes:**
- ralphy-spec bridges SDD specs with loop mechanics: it reads the current change's tasks.md and generates PROMPT.md as the loop's input.
- Cite [7] Yu GitHub 2026.
- This is what makes the loop spec-driven rather than free-form: the AI's input is always derived from a human-authored spec artifact.
- ~80 words.

**Test plan:**
- Citation [7] is present.
- The relationship between tasks.md → PROMPT.md → loop is stated.

---

## Task 5 — Draft the concrete loop iteration narrative

Describe a real loop run using the service-fee-fix change.

**Implementation notes:**
- The `service-fee-fix` change: the spec and project.md stated 10% fee; the code implemented 20%.
- The loop ran: PROMPT.md contained the task to fix the fee calculation.
- The AI updated `app/actions/gig.ts` from `0.20` to `0.10`.
- Integration tests in `__tests__/integration/gig-creation.test.ts` immediately failed — they had been written to assert 20% and now needed updating.
- The loop did not exit; the AI read the test output, identified the failing assertions, updated the test expectations to 10%, and re-ran.
- All 40 integration tests passed on the next iteration. No human intervention occurred between the first failure and the final pass.
- ~130 words.

**Test plan:**
- The `service-fee-fix` change is named.
- The failure (test assertions expecting 20%) and self-correction (updating to 10%) are described.
- The absence of human intervention is stated explicitly.

---

## Task 6 — Assemble and verify the complete §3 section

Combine Tasks 1–5 and verify all acceptance criteria.

**Implementation notes:**
- Target: 500–700 words.
- Both citations [6] and [7] present.
- Loop command appears verbatim.
- Backpressure sources named (≥4).
- service-fee-fix example present.
- Write the final text into `openspec/planning/icid-2026-paper.md` as `## §3 Implementation`.

**Test plan:**
- Word count 500–700.
- Citations [6] and [7] present (as `\[6\]` and `\[7\]` in markdown).
- Loop command present verbatim.
- service-fee-fix named.
