# Paper Spec Delta: paper-add-related-work

## ADDED Requirements

### Requirement: §1.1 Related Work subsection

The paper MUST contain a subsection `### 1.1 Related Work` (or equivalent heading) inserted in §1 Introduction, positioned after the research question paragraph and before the paper structure paragraph ("The remainder of the paper is structured as follows…").

The subsection MUST be approximately 500 words and MUST cover exactly four literature areas in the order below.

#### Scenario: Area A — LLM context management and degradation (~100 words)

- MUST cite Hong et al. [4] (already in paper).
- MUST cite Shi et al. (2023) as [11]: "Large Language Models Easily Distracted by Irrelevant Context," arXiv:2302.00093 — demonstrates that context pollution degrades LLM reasoning, motivating external spec anchoring.
- MUST cite Liu et al. (2024) as [12]: "Lost in the Middle: How Language Models Use Long Contexts," TACL — demonstrates that LLMs attend poorly to middle-context information, motivating fresh-context-per-task design.
- MUST argue: SDD's per-task context reset directly addresses the degradation patterns documented in [4], [11], [12], and that this paper provides an architectural instantiation of that mitigation.

#### Scenario: Area B — Specification-based and contract-driven development (~120 words)

- MUST cite Piskala [5] (already in paper).
- MUST cite Meyer (1992) as [13]: "Applying Design by Contract," IEEE Computer — SDD is the AI-era descendant of Design by Contract: specs as executable contracts.
- MUST cite Claessen & Hughes (2000) as [14]: "QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs," ICFP — property-based testing derives tests from specs, the same spec-before-code ordering SDD enforces.
- MUST cite Swagger/OpenAPI Initiative (2021) as [15]: OpenAPI Specification v3.1.0 — specification-first API development as a practitioner precedent.
- MUST argue: SDD extends a 30-year tradition of specification-first development to the AI executor context; prior work in this tradition did not anticipate an autonomous AI executor operating inside a continuous loop.

#### Scenario: Area C — Human-AI teaming and role division in SE (~120 words)

- MUST cite Hoda [3] (already in paper).
- MUST cite Xu et al. (2023) as [16]: "Exploring the Role of LLMs in Software Development: A Survey," arXiv:2312.11968 — surveys human-AI collaboration patterns in SE.
- MUST cite Jiang et al. (2024) as [17]: "Self-planning Code Generation with Large Language Models," TOSEM — shows structured planning improves LLM code generation quality, supporting the spec-before-code ordering.
- MUST argue: this paper provides a concrete empirical instance of the human-architect/AI-executor division that [3] and [16] theorize; [17] validates the spec-before-code ordering at the task level, while this paper validates it at the project lifecycle level.

#### Scenario: Area D — Bootstrapped platform development and solopreneur economics (~80 words)

- MUST cite Eisenmann et al. (2006) as [18]: "Strategies for Two-Sided Markets," Harvard Business Review — canonical reference on marketplace liquidity challenges.
- MUST cite Blank (2013) as [19]: "Why the Lean Start-Up Changes Everything," Harvard Business Review — lean/bootstrapped development as the context for solopreneur platform building.
- MUST argue: the solopreneur angle is absent from ASE literature, which focuses on enterprise teams; this paper is the first to apply ASE methodology to the bootstrapped founder context where the liquidity challenges of [18] and the resource constraints of [19] are simultaneously operative.

### Requirement: References [11]–[19] added to References section

The References section MUST be extended with the following nine entries, numbered sequentially continuing from [10]:

- [11] Shi, F., et al.: Large Language Models Are Easily Distracted by Irrelevant Context. arXiv preprint arXiv:2302.00093 (2023).
- [12] Liu, N.F., et al.: Lost in the Middle: How Language Models Use Long Contexts. Transactions of the Association for Computational Linguistics 12, 157--173 (2024).
- [13] Meyer, B.: Applying Design by Contract. IEEE Computer 25(10), 40--51 (1992).
- [14] Claessen, K., Hughes, J.: QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs. In: Proceedings of the 5th ACM SIGPLAN International Conference on Functional Programming (ICFP 2000). ACM (2000).
- [15] OpenAPI Initiative: OpenAPI Specification v3.1.0. URL: https://spec.openapis.org/oas/v3.1.0 (2021).
- [16] Xu, F.F., et al.: Exploring the Role of LLMs in Software Development: A Survey. arXiv preprint arXiv:2312.11968 (2023).
- [17] Jiang, X., et al.: Self-planning Code Generation with Large Language Models. ACM Transactions on Software Engineering and Methodology 33(5), 1--30 (2024).
- [18] Eisenmann, T., Parker, G., Van Alstyne, M.W.: Strategies for Two-Sided Markets. Harvard Business Review 84(10), 92--101 (2006).
- [19] Blank, S.: Why the Lean Start-Up Changes Everything. Harvard Business Review 91(5), 63--72 (2013).

#### Scenario: Reference count validation

After this change, the paper MUST contain exactly 19 references ([1]–[19]).
