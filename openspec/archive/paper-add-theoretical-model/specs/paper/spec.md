# Paper Spec Delta: paper-add-theoretical-model

## ADDED Requirements

### Requirement: Theoretical model paragraph in §2

The paper MUST contain a paragraph titled "The Stateless Executor / Persistent Spec Model" in §2, positioned after the context decay paragraph and before the Gigly directory structure paragraph.

#### Scenario: Paragraph content — stateless function model

**Given** the paper's §2,
**When** a reader reaches the theoretical model paragraph,
**Then** the paragraph SHALL:
- Characterize an LLM invocation as a stateless function with no persistent memory between calls.
- Contrast vibe coding (coherence as a property of stateful conversation history) with SDD (coherence as a property of the persistent spec corpus).
- Express each loop iteration as a pure function call: *f*(spec, task) → implementation.
- State that architectural drift is bounded by spec completeness, not project duration or context window saturation.
- Identify the two observable failure modes: spec incompleteness and executor non-compliance.

#### Scenario: Paragraph content — RAG analogy

**Given** the theoretical model paragraph,
**When** a reader reads the analogy section,
**Then** the paragraph SHALL:
- Draw an explicit analogy to Retrieval-Augmented Generation, citing Lewis et al. [10].
- State that SDD externalizes architectural knowledge to a specification corpus, as RAG externalizes factual knowledge to a retrieval corpus.
- Distinguish SDD specs as prescriptive (define what must be true) from RAG corpora as descriptive (record what was true).

#### Scenario: Paragraph content — falsifiable prediction

**Given** the theoretical model paragraph,
**When** a reader reads the prediction,
**Then** the paragraph SHALL:
- State a falsifiable prediction: architectural drift in SDD projects is bounded by spec completeness, not project duration.
- Explicitly reference the quantitative benchmark proposed in §5 as the test vehicle for this prediction.

#### Scenario: Paragraph length

**Given** the inserted paragraph,
**When** its word count is measured,
**Then** it SHALL be approximately 180–220 words.

---

### Requirement: Reference [10] — Lewis et al. (2020)

The References section MUST contain a tenth entry for the RAG paper.

#### Scenario: Reference entry

**Given** the References section,
**When** a reader looks up [10],
**Then** the entry SHALL read:
> Lewis, P., et al.: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. In: Advances in Neural Information Processing Systems (NeurIPS 2020). Curran Associates (2020).

#### Scenario: No renumbering of existing references

**Given** the existing references [1]–[9],
**When** reference [10] is appended,
**Then** references [1]–[9] SHALL remain unchanged in content and numbering.

---

## MODIFIED Requirements

*(none)*

## REMOVED Requirements

*(none)*
