# Spec Delta: paper-add-research-method

## ADDED Requirements

### Domain: paper/icid-2026

#### Requirement: Research design declaration in §1

The paper MUST declare its research design in §1 Introduction, after the research question and before the "remainder of the paper" paragraph.

##### Scenario: Research Design paragraph present
- Given the paper is read by a reviewer
- When they reach §1
- Then they find a paragraph identifying the study as a single-case embedded case study per Yin (2018) [8] and Runeson & Höst (2009) [9], naming the unit of analysis, case boundary, data sources, and validation method

#### Requirement: References [8] and [9] present

The reference list MUST include:
- [8] Yin, R.K.: Case Study Research and Applications: Design and Methods. 6th edn. Sage Publications (2018).
- [9] Runeson, P., Höst, M.: Guidelines for conducting and reporting case study research in software engineering. Empirical Software Engineering 14(2), 131--164 (2009).

## MODIFIED Requirements

#### Requirement: §4 opening paragraph grounds method in research design

The §4 opening paragraph MUST ground the qualitative artifact analysis method in the case study research design declared in §1, rather than justifying it by the absence of quantitative benchmarks.

##### Scenario: §4 opening references §1
- Given the paper is read sequentially
- When the reader reaches §4
- Then the opening paragraph refers back to the research design established in §1 as the basis for the validation approach
