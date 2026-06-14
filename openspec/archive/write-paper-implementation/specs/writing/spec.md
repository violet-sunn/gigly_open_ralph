# Writing Specification — §3 Implementation Section

## ADDED Requirements

### Requirement: Ralph Wiggum Loop Introduction
The §3 section MUST introduce the Ralph Wiggum loop methodology with citation [6].

#### Scenario: Loop named and cited
- GIVEN a reader unfamiliar with the Ralph Wiggum loop
- WHEN they read the opening paragraph of §3
- THEN they MUST understand it is a continuous deterministic execution pattern
- AND citation [6] (Huntley ghuntley.com/ralph 2025) MUST be present

**Acceptance Criteria:**
- The name "Ralph Wiggum" appears.
- Citation [6] is present.

---

### Requirement: Loop Command Mechanics
The §3 section MUST present the core loop command and explain its components.

#### Scenario: Command verbatim with explanation
- GIVEN a developer who wants to replicate the loop
- WHEN they read the mechanics paragraph
- THEN they MUST see the exact command: `while :; do cat PROMPT.md | claude-code; done`
- AND all three components (PROMPT.md, claude-code, infinite loop) MUST be explained
- AND the three prevented behaviors (premature exit, ad-hoc intervention, context-switching) MUST be named

**Acceptance Criteria:**
- Command appears verbatim.
- PROMPT.md, claude-code, and the infinite loop are each explained.
- At least two prevented behaviors are named.

---

### Requirement: Automated Backpressure
The §3 section MUST explain automated backpressure as the self-correction mechanism.

#### Scenario: Backpressure sources named
- GIVEN a reader who wants to understand how the loop self-corrects
- WHEN they read the backpressure paragraph
- THEN they MUST understand that compiler/linter/test failures force AI self-correction
- AND at least four specific backpressure sources from the Gigly stack MUST be named

**Acceptance Criteria:**
- At least four of: TypeScript strict mode, ESLint, Prisma validation, Vitest, Playwright are named.
- The self-correction mechanism (AI reads error, re-implements) is described.

---

### Requirement: ralphy-spec Framework
The §3 section MUST introduce ralphy-spec and cite [7].

#### Scenario: ralphy-spec bridges SDD and loop
- GIVEN a reader who has read §2 (SDD)
- WHEN they read the ralphy-spec paragraph
- THEN they MUST understand how tasks.md is translated into PROMPT.md as the loop's input
- AND citation [7] (Yu GitHub 2026) MUST be present

**Acceptance Criteria:**
- Citation [7] is present.
- The tasks.md → PROMPT.md → loop pipeline is stated.

---

### Requirement: Concrete Loop Iteration Example
The §3 section MUST include a concrete narrative of a real loop run.

#### Scenario: service-fee-fix loop narrative
- GIVEN a skeptical reader
- WHEN they read the example paragraph
- THEN they MUST see the service-fee-fix change named
- AND the failure (test assertions expecting 20%) and self-correction (updating to 10%) MUST be described
- AND the absence of human intervention MUST be stated

**Acceptance Criteria:**
- `service-fee-fix` is named.
- The test failure and self-correction sequence is described.
- No human intervention is stated explicitly.

---

### Requirement: Length and Citations
The §3 section MUST meet length and citation requirements.

#### Scenario: Word count and citation check
- GIVEN the assembled §3 section
- WHEN word count is measured
- THEN it MUST be between 500 and 700 words
- AND citations [6] and [7] MUST both be present

**Acceptance Criteria:**
- Word count: 500–700.
- `\[6\]` and `\[7\]` both present in the markdown source.
