# Tasks: paper-add-theoretical-model

## Task 1 — Insert the theoretical model paragraph into §2

**Location:** `icid-2026-paper-final.md`, §2, after the sentence ending "...The spec replaces conversational memory as the continuity mechanism." and before the paragraph beginning "In the Gigly project, SDD is implemented through a three-tier directory structure..."

**Implementation notes:**

Insert the following paragraph verbatim (adjust wording only for flow if strictly necessary):

---

**The Stateless Executor / Persistent Spec Model.** An LLM invocation is a stateless function: it has no persistent memory between calls. In vibe coding, architectural coherence is a property of the conversation history — it is stateful and degrades with length as Hong et al. [4] demonstrate. In SDD, architectural coherence is a property of the spec corpus: it is persistent, external, and independent of any single invocation's context window. Each loop iteration is structurally equivalent to a pure function call — *f*(spec, task) → implementation — where the spec is the persistent state and the AI is the stateless executor. Architectural drift is bounded by spec completeness, not by project duration or context window saturation. The only failure modes are spec incompleteness (the spec does not cover the case) and executor non-compliance (the AI deviates from the spec) — both are observable and correctable via backpressure. This model is analogous to Retrieval-Augmented Generation [10]: just as RAG externalizes factual knowledge to a retrieval corpus, SDD externalizes architectural knowledge to a specification corpus. The difference is that SDD specs are prescriptive (they define what must be true) whereas RAG corpora are descriptive (they record what was true). This yields a falsifiable prediction: architectural drift in SDD projects should be bounded by spec completeness, not by project duration — a claim directly testable via the quantitative benchmark proposed in §5.

---

**Test plan:**
- Manually verify the paragraph appears in §2 between the context decay paragraph and the Gigly directory structure paragraph.
- Word count of inserted paragraph is approximately 180–220 words.
- The phrase "Stateless Executor / Persistent Spec Model" is present.
- The citation `[10]` appears in the paragraph.
- The falsifiable prediction sentence references "§5".
- The prescriptive/descriptive distinction is explicit.
- Contrast with vibe coding is explicit (references Hong et al. [4]).

---

## Task 2 — Add reference [10] to the References section

**Location:** `icid-2026-paper-final.md`, References section, append after reference [9].

**Implementation notes:**

Append the following line:

```
10. Lewis, P., et al.: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. In: Advances in Neural Information Processing Systems (NeurIPS 2020). Curran Associates (2020).
```

**Test plan:**
- Reference [10] appears as the last entry in the References section.
- No existing references [1]–[9] are renumbered or modified.
- Citation key `[10]` in the paragraph (Task 1) resolves to this entry.

---

## Task 3 — Verify document integrity

**Test plan:**
- Read the full §2 and confirm paragraph order: (1) SDD definition paragraph, (2) TDD/code-first distinction paragraph, (3) context decay paragraph, (4) **new theoretical model paragraph**, (5) Gigly directory structure paragraph, (6) gig-creation concrete example paragraph.
- Confirm references list ends at [10] with no gaps or duplicates.
- Confirm no other sections were modified.
