# Tasks: write-paper-introduction

## Checklist

- [x] 1. Read `ICID 2026 Abstract.md` skeleton §1 and extract all bullet-point ideas to preserve.
  - Implementation: Read the file, note every concept already present in the skeleton.
  - Test: Confirm no idea from the skeleton is dropped in the final text.

- [x] 2. Draft opening paragraph — resource constraint problem for solopreneurs.
  - Implementation: 2–3 sentences establishing that two-sided B2B platforms traditionally require VC capital and that solopreneurs face steep entry barriers.
  - Test: Paragraph stands alone; no citation needed here.

- [x] 3. Draft "vibe coding" paragraph with citation [1].
  - Implementation: Define "vibe coding" using Meske et al. (IEEE Access 2025) [1]. One sentence definition, one sentence on its appeal for rapid prototyping.
  - Test: `[1]` appears exactly once, attributed to Meske et al.

- [x] 4. Draft architectural drift paragraph with citation [2].
  - Implementation: Introduce architectural drift as the core failure mode — AI-generated code that functions locally but violates global topology, DI patterns, and state management. Cite Pan et al. arXiv:2601.13007 [2].
  - Test: `[2]` appears exactly once, attributed to Pan et al.

- [x] 5. Draft ASE paradigm-shift paragraph with citation [3].
  - Implementation: Introduce Agentic Software Engineering (ASE) as the response to vibe coding's failures. Cite Hoda ICSE-Companion 2026 [3].
  - Test: `[3]` appears exactly once, attributed to Hoda.

- [x] 6. Draft Gigly case-study paragraph.
  - Implementation: Introduce Gigly — B2B IT outsourcing marketplace for the Russian market, built entirely by a single founder using AI-native architecture. State the human-as-architect / AI-as-executor split.
  - Test: "Gigly", "Russian market", "single founder", and "AI-native" all appear.

- [x] 7. Insert explicit research question.
  - Implementation: State verbatim — *"Can Spec-Driven Development combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?"*
  - Test: Exact string present in output.

- [x] 8. Draft paper-structure paragraph.
  - Implementation: One paragraph: §2 Methodology (SDD), §3 Implementation (deterministic loops), §4 Validation (architectural), §5 Conclusion.
  - Test: All four section references present.

- [x] 9. Verify word count and self-containment.
  - Implementation: Count body words (exclude heading). Confirm 400–600 range. Read section in isolation and verify no undefined terms.
  - Test: `wc -w` on body text returns value in [400, 600]. Result: 438 words — PASS.

- [x] 10. Write final text to `openspec/planning/icid-2026-paper.md` under `## §1 Introduction`.
  - Implementation: Append (or create) the section in the planning file.
  - Test: File exists, contains `## §1 Introduction`, contains all three `[1]` `[2]` `[3]` markers, contains verbatim research question.
