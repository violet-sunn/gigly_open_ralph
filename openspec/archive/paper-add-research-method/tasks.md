# Tasks: paper-add-research-method

## Task 1: Add Research Design paragraph to §1

**Location:** `icid-2026-paper-final.md`, §1 Introduction, after the paragraph ending with the research question (*"Can Spec-Driven Development combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?"*) and before the paragraph beginning *"The remainder of the paper is structured as follows."*

**Implementation notes:**
- Paragraph heading: none (inline prose, no subheading)
- Length: ~120 words
- Content MUST cover:
  - Research design type: single-case embedded case study
  - Methodological grounding: Yin (2018) [8] and Runeson & Höst (2009) [9]
  - Unit of analysis: the Gigly development process
  - Case boundary: the 33+ archived changes in `openspec/archive/`
  - Data sources: the openspec/ artifact corpus (proposals, spec deltas, tasks, git history)
  - Validation method: qualitative artifact analysis — examining the artifacts produced by the system and the mechanisms that shaped them — consistent with the case study design

**Test plan:**
- `grep -c "case study" icid-2026-paper-final.md` returns ≥ 2 (one in §1, one in §4 Limitations)
- `grep "\[8\]" icid-2026-paper-final.md` returns a match in §1
- `grep "\[9\]" icid-2026-paper-final.md` returns a match in §1

---

## Task 2: Add references [8] and [9] to the reference list

**Location:** `icid-2026-paper-final.md`, References section, after reference [7]

**Implementation notes:**
- Reference [8] (Yin 2018):
  `Yin, R.K.: Case Study Research and Applications: Design and Methods. 6th edn. Sage Publications (2018).`
- Reference [9] (Runeson & Höst 2009):
  `Runeson, P., Höst, M.: Guidelines for conducting and reporting case study research in software engineering. Empirical Software Engineering 14(2), 131--164 (2009).`
- Format MUST match the existing LNCS style used for [1]–[7] (author, title, venue/publisher, year)

**Test plan:**
- `grep "\[8\]" icid-2026-paper-final.md` returns a match in the References section
- `grep "\[9\]" icid-2026-paper-final.md` returns a match in the References section
- `grep "Yin" icid-2026-paper-final.md` returns a match
- `grep "Runeson" icid-2026-paper-final.md` returns a match

---

## Task 3: Replace §4 opening paragraph

**Location:** `icid-2026-paper-final.md`, §4 Architectural Validation, first paragraph (currently beginning *"This research deliberately shifts focus from final quantitative metrics to qualitative architectural validation. No established benchmark exists..."*)

**Implementation notes:**
- Remove the defensive framing ("No established benchmark exists for measuring..."; "For early-stage research on a novel methodology, qualitative artifact analysis... is the appropriate evaluation method")
- Replace with a paragraph that:
  - States that the validation method follows from the research design established in §1
  - References the single-case embedded case study design
  - Briefly characterizes what qualitative artifact analysis means in this context (examining artifacts produced by the system and the mechanisms that shaped them)
  - Introduces the two validation vectors as before
- The replacement paragraph should be approximately the same length as the original (~60–80 words)

**Test plan:**
- The phrase "No established benchmark exists" MUST NOT appear in the file after this change
- The §4 opening paragraph MUST contain a reference back to §1 (e.g., "established in §1", "described in §1", or equivalent)
- The two validation vectors (Context Hygiene, Neutralizing Architectural Drift) MUST still be introduced in §4

---

## Acceptance Criteria (full change)

- [ ] `grep -i "case study" icid-2026-paper-final.md` returns matches in both §1 and §4
- [ ] `grep "\[8\]" icid-2026-paper-final.md` returns matches in §1 body and in the References section
- [ ] `grep "\[9\]" icid-2026-paper-final.md` returns matches in §1 body and in the References section
- [ ] `grep "Yin" icid-2026-paper-final.md` returns a match in the References section
- [ ] `grep "Runeson" icid-2026-paper-final.md` returns a match in the References section
- [ ] `grep "No established benchmark" icid-2026-paper-final.md` returns no match
- [ ] §4 opening paragraph contains a reference to §1 research design
- [ ] No other sections are modified (diff touches only §1 Research Design paragraph, §4 opening paragraph, and References)
