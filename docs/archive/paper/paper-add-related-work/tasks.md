# Tasks: paper-add-related-work

## Task 1: Insert §1.1 Related Work subsection into icid-2026-paper-final.md

**Implementation notes:**
- Open `icid-2026-paper-final.md`.
- Locate the research question paragraph ending with `*"Can Spec-Driven Development combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?"*`
- Locate the paper structure paragraph beginning with `The remainder of the paper is structured as follows.`
- Insert the `### 1.1 Related Work` subsection between these two paragraphs.
- The subsection must cover four areas in order: (A) LLM context management, (B) specification-based development, (C) human-AI teaming, (D) bootstrapped platform economics.
- Each area must argue differentiation — how this paper extends or differs from cited work — not merely list references.
- Target ~500 words total for the subsection.
- Use inline citation style consistent with the rest of the paper (e.g., `[11]`, `[12]`).
- Do not duplicate content already present in §1 (the vibe coding failure mode, ASE framing, context decay, and the Gigly case description are already covered).

**Draft content for §1.1:**

```
### 1.1 Related Work

**LLM context management and degradation.** The context decay problem that motivates SDD is well-documented in the LLM literature. Hong et al. [4] demonstrate that output quality degrades measurably as the context window fills with prior conversation turns. Shi et al. show that LLMs are easily distracted by irrelevant context: even when the correct information is present, the introduction of unrelated material causes reasoning errors [11]. Liu et al. extend this finding to long-context settings, demonstrating that LLMs attend poorly to information positioned in the middle of a long context window — a phenomenon they term the "lost in the middle" effect [12]. Together, these results establish that context pollution is a structural property of transformer-based models, not a prompt-engineering failure. SDD addresses this structurally: by resetting the context window for each discrete task and supplying only the relevant spec artifacts, it eliminates the accumulation of irrelevant prior turns that [11] and [12] identify as the proximate cause of degradation. This paper provides an architectural instantiation of that mitigation across 33+ development iterations.

**Specification-based and contract-driven development.** SDD belongs to a 30-year tradition of specification-first software engineering. Meyer's Design by Contract (DbC) established the principle that software components should be governed by formal preconditions, postconditions, and invariants — executable contracts that define correct behavior independently of implementation [13]. Claessen and Hughes' QuickCheck demonstrated that deriving tests from specifications, rather than writing them independently, produces stronger correctness guarantees [14]. In practice, specification-first development has become standard in API design: the OpenAPI Initiative's specification-first workflow requires that an API contract be authored before any server or client code is written [15]. SDD extends this tradition to the AI executor context. The novel element is not the spec-before-code ordering — that is inherited from DbC and OpenAPI — but the use of the spec as the sole continuity mechanism across stateless LLM invocations operating inside a continuous execution loop. Prior work in this tradition did not anticipate an autonomous AI executor; this paper is the first to apply specification-first principles to that setting.

**Human-AI teaming and role division in software engineering.** Hoda frames ASE as a discipline requiring structured human-AI collaboration within defined boundaries [3]. Xu et al.'s survey of LLM roles in software development identifies a spectrum of collaboration patterns, from code completion to autonomous agent execution, but notes that the question of how to divide architectural authority between human and AI remains open [16]. Jiang et al. provide partial evidence: structured planning before code generation measurably improves output quality, validating the spec-before-code ordering at the task level [17]. This paper provides a concrete empirical instance of the human-architect/AI-executor division that [3] and [16] theorize. Where [17] validates structured planning for individual tasks, this paper validates it at the project lifecycle level — across 33+ changes, each governed by a human-authored proposal and spec delta before any code is written.

**Bootstrapped platform development and solopreneur economics.** The marketplace liquidity problem — the chicken-and-egg challenge of attracting both sides of a two-sided market simultaneously — is the canonical barrier to bootstrapped platform entry [18]. Blank's lean startup methodology provides the resource-constrained founder's response: validate the core value proposition with minimal investment before scaling [19]. The ASE literature, however, focuses almost exclusively on enterprise teams with dedicated engineering staff. This paper addresses a gap: the application of ASE methodology to the bootstrapped founder context, where the liquidity challenges of [18] and the resource constraints of [19] are simultaneously operative. To our knowledge, this is the first study to examine whether spec-driven agentic workflows can substitute for engineering team scale in early-stage platform development.
```

**Test plan:**
- Verify `### 1.1 Related Work` heading is present in the file.
- Verify the subsection appears after the research question paragraph and before "The remainder of the paper is structured as follows."
- Count words in the subsection: target 480–520 words.
- Verify citations [11], [12], [13], [14], [15], [16], [17], [18], [19] all appear in the subsection.
- Verify no content from the existing §1 paragraphs is duplicated verbatim.

---

## Task 2: Add references [11]–[19] to the References section

**Implementation notes:**
- Locate the References section at the end of `icid-2026-paper-final.md`.
- Append nine new entries after reference [10], numbered [11] through [19].
- Use the exact citation format consistent with existing references (author list, title, venue, year).

**References to add:**

```
11. Shi, F., et al.: Large Language Models Are Easily Distracted by Irrelevant Context. arXiv preprint arXiv:2302.00093 (2023).
12. Liu, N.F., et al.: Lost in the Middle: How Language Models Use Long Contexts. Transactions of the Association for Computational Linguistics 12, 157--173 (2024).
13. Meyer, B.: Applying Design by Contract. IEEE Computer 25(10), 40--51 (1992).
14. Claessen, K., Hughes, J.: QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs. In: Proceedings of the 5th ACM SIGPLAN International Conference on Functional Programming (ICFP 2000). ACM (2000).
15. OpenAPI Initiative: OpenAPI Specification v3.1.0. URL: https://spec.openapis.org/oas/v3.1.0 (2021).
16. Xu, F.F., et al.: Exploring the Role of LLMs in Software Development: A Survey. arXiv preprint arXiv:2312.11968 (2023).
17. Jiang, X., et al.: Self-planning Code Generation with Large Language Models. ACM Transactions on Software Engineering and Methodology 33(5), 1--30 (2024).
18. Eisenmann, T., Parker, G., Van Alstyne, M.W.: Strategies for Two-Sided Markets. Harvard Business Review 84(10), 92--101 (2006).
19. Blank, S.: Why the Lean Start-Up Changes Everything. Harvard Business Review 91(5), 63--72 (2013).
```

**Test plan:**
- Count total references in the file: MUST equal 19.
- Verify references are numbered sequentially [1]–[19] with no gaps.
- Verify each of [11]–[19] appears in the References section with correct author, title, venue, and year.
- Verify [11]–[19] are each cited at least once in the body of the paper (in §1.1).

---

## Acceptance Criteria (all must pass)

- [ ] `### 1.1 Related Work` heading present in `icid-2026-paper-final.md`
- [ ] Subsection positioned between research question paragraph and paper structure paragraph
- [ ] Four areas covered: LLM context management, specification-based development, human-AI teaming, bootstrapped platform economics
- [ ] Each area argues differentiation (not just enumeration)
- [ ] Citations [11]–[19] all appear in §1.1
- [ ] References [11]–[19] present in References section with correct bibliographic data
- [ ] Total reference count = 19
- [ ] Subsection word count ≈ 500 (480–520 acceptable)
- [ ] No verbatim duplication of existing §1 content
