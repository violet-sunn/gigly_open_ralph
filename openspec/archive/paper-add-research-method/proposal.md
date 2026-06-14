# Proposal: paper-add-research-method

## Summary

Add explicit research design framing to `icid-2026-paper-final.md` to ground the validation methodology in a recognized research tradition. Currently §4 justifies qualitative artifact analysis by appealing to the absence of established benchmarks — a defensive framing. This change replaces that framing with a positive one: the validation method follows from a deliberate research design choice (single-case embedded case study), which is stated upfront in §1.

## Motivation

Reviewers of empirical software engineering papers expect the research design to be declared early and the validation method to follow from it. The current paper states the research question in §1 but does not name the research design. §4 then justifies qualitative analysis negatively ("no established benchmark exists"). This creates a logical gap: the method appears to be chosen by default rather than by design.

Grounding the study in Yin (2018) and Runeson & Höst (2009) — the two canonical references for case study research in software engineering — closes this gap and aligns the paper with the empirical SE literature.

## Scope

**In scope:**
- Add a ~120-word "Research Design" paragraph to §1, after the research question paragraph
- Add two references: Yin (2018) as [8], Runeson & Höst (2009) as [9]
- Replace the §4 opening paragraph's defensive justification with a forward reference to the §1 research design

**Out of scope:**
- No changes to §2, §3, §5, the abstract, or any other section
- No changes to existing references [1]–[7]
- No structural reorganization

## Constraints

- The Research Design paragraph MUST cite both [8] and [9]
- The paragraph MUST name: single-case embedded case study, unit of analysis (Gigly development process), case boundary (33+ archived changes in `openspec/archive/`), data sources (openspec/ artifact corpus), and validation method (qualitative artifact analysis)
- The §4 opening paragraph MUST reference the §1 research design rather than justify the method by absence of benchmarks
- References [8] and [9] MUST follow the existing LNCS citation format used in [1]–[7]
