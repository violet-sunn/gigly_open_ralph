# Tasks: paper-operationalize-constructs

## Task 1: Insert Construct Definitions paragraph into §2

**File:** `icid-2026-paper-final.md`

**Implementation notes:**

Locate the exact insertion point in §2. The paragraph immediately before the insertion point ends with:

> "...The spec is thus the single artifact from which all downstream artifacts — tests, migrations, server actions, UI components — are generated."

The paragraph immediately after the insertion point begins with:

> "The motivating problem SDD addresses is context decay..."

Insert the following paragraph between them:

---

**Construct Definitions.** Two constructs used throughout this paper require operational definition. *Architectural drift* (as used in this study) denotes an observable state in which a code artifact violates one or more invariants documented in the canonical spec corpus at the time of its generation. Its observable proxy is a backpressure event — a compiler error, type system rejection, or test failure — triggered by violation of a pre-existing spec-documented convention and requiring correction to conform to that convention rather than introducing a new one. This study uses "architectural drift" in the sense of AI-generated deviation from established system invariants, distinct from Pan et al. [2], who use the term for legacy architecture recovery. *Context decay* (as used in this study) denotes degradation in an AI agent's adherence to previously established architectural decisions, attributable to context window saturation rather than spec ambiguity. Its observable proxy in SDD is its absence: no archived change introduced a regression against a prior change's spec-documented interface. This asymmetry is itself a finding — SDD makes context decay observable by its absence in a way that vibe coding cannot, because vibe coding has no external spec against which to detect deviation.

---

**Test plan:**

1. Confirm the paragraph appears after "...tests, migrations, server actions, UI components — are generated." and before "The motivating problem SDD addresses is context decay..."
2. Confirm "architectural drift" is defined with its observable proxy (backpressure event).
3. Confirm "context decay" is defined with its observable proxy (absence of regression).
4. Confirm Pan et al. [2] disambiguation is present.
5. Confirm the asymmetry observation is present.
6. Count words in the inserted paragraph: must be between 130 and 170.
7. Confirm no other paragraphs in §2 or any other section were modified.
