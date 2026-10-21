# Proposal: paper-add-theoretical-model

## What

Insert a new paragraph (~200 words) into §2 of `icid-2026-paper-final.md`, immediately after the context decay paragraph (ending "...The spec replaces conversational memory as the continuity mechanism."). The paragraph is titled **"The Stateless Executor / Persistent Spec Model"** and formalizes the mechanism by which SDD prevents architectural drift.

## Why

§2 currently explains *that* SDD mitigates context decay but does not explain *why* it works at a mechanistic level. The paper makes a theoretical claim — SDD prevents architectural drift — but offers no formal model of the mechanism. Reviewers and readers need a crisp, falsifiable account of the causal chain. The proposed paragraph provides that account by:

1. Modeling an LLM invocation as a stateless pure function `f(spec, task) → implementation`.
2. Showing that architectural coherence in SDD is a property of the spec corpus (persistent, external) rather than of conversation history (stateful, decaying).
3. Drawing an analogy to Retrieval-Augmented Generation (RAG) to anchor the model in established ML literature.
4. Stating a falsifiable prediction that connects the theoretical model to the quantitative benchmark proposed in §5.

## Constraints

- Insert after the context decay paragraph, before the Gigly directory structure paragraph.
- ~200 words; must not exceed the paragraph length of surrounding text.
- Introduce as "The Stateless Executor / Persistent Spec Model" (bold heading inline or as a lead sentence).
- Add Lewis et al. (2020) NeurIPS RAG paper as reference [10].
- Renumber no existing references (append only).
- The RAG analogy must include the prescriptive/descriptive distinction.
- The falsifiable prediction must explicitly reference the §5 quantitative benchmark.

## Non-Goals

- No changes to §1, §3, §4, or §5.
- No changes to the abstract or keywords.
- No restructuring of §2 beyond the single paragraph insertion.
- No new figures or tables.
