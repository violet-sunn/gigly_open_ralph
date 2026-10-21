# Spec: §1 Introduction — ICID 2026 Paper

## ADDED Requirements

### Requirement: Self-contained introduction section

The §1 Introduction MUST be readable without prior context beyond the paper title and abstract.

#### Scenario: Reader has only read the abstract
- GIVEN a reader who has read only the paper abstract
- WHEN they read §1 Introduction
- THEN they understand the problem, the approach, the case study, and the research question without needing to consult external sources

---

### Requirement: Opening — solopreneur resource constraint

The introduction MUST open by establishing that two-sided B2B platform development traditionally demands significant capital, creating steep entry barriers for solopreneurs.

#### Scenario: Opening paragraph motivation
- GIVEN the first paragraph of §1
- WHEN read in isolation
- THEN it clearly frames the resource-constraint problem as the motivation for the research

---

### Requirement: Definition of "vibe coding" with citation [1]

The introduction MUST define "vibe coding" and attribute the definition to Meske et al. (IEEE Access 2025) via citation [1].

#### Scenario: Citation [1] present and attributed
- GIVEN the full text of §1
- WHEN searched for `[1]`
- THEN exactly one occurrence is found, adjacent to the term "vibe coding" and attributed to Meske et al.

---

### Requirement: Architectural drift as core failure mode with citation [2]

The introduction MUST introduce architectural drift as the primary failure mode of vibe coding and cite Pan et al. arXiv:2601.13007 via [2].

#### Scenario: Citation [2] present and attributed
- GIVEN the full text of §1
- WHEN searched for `[2]`
- THEN exactly one occurrence is found, adjacent to "architectural drift" and attributed to Pan et al.

---

### Requirement: Agentic Software Engineering (ASE) with citation [3]

The introduction MUST introduce ASE as the paradigm shift that addresses vibe coding's failures and cite Hoda ICSE-Companion 2026 via [3].

#### Scenario: Citation [3] present and attributed
- GIVEN the full text of §1
- WHEN searched for `[3]`
- THEN exactly one occurrence is found, adjacent to "Agentic Software Engineering" and attributed to Hoda.

---

### Requirement: Gigly case study introduction

The introduction MUST introduce Gigly as a B2B IT outsourcing marketplace for the Russian market, built entirely by a single founder using AI-native architecture.

#### Scenario: Case study context
- GIVEN the §1 text
- WHEN read
- THEN "Gigly", "Russian market" (or equivalent), "single founder", and "AI-native" concepts are all present

---

### Requirement: Explicit research question

The introduction MUST state the research question verbatim:

> "Can Spec-Driven Development combined with deterministic execution loops prevent architectural drift in LLM-assisted bootstrapped platform development?"

#### Scenario: Research question unambiguous
- GIVEN the §1 text
- WHEN searched for the research question
- THEN the exact string above is present and clearly marked as the research question

---

### Requirement: Paper structure overview paragraph

The introduction MUST end with a paragraph outlining the paper structure: §2 Methodology, §3 Implementation, §4 Validation, §5 Conclusion.

#### Scenario: Structure paragraph present
- GIVEN the final paragraph of §1
- WHEN read
- THEN references to §2, §3, §4, and §5 with their titles are all present

---

### Requirement: Word count

The body of §1 (excluding the section heading and paper-structure paragraph) MUST be 400–600 words.

#### Scenario: Word count in range
- GIVEN the body text of §1
- WHEN word count is measured
- THEN the count is between 400 and 600 inclusive
