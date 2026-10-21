# Proposal: create-icid-2026-paper-plan

## What

Create a strategic planning document at `openspec/planning/icid-2026-paper.md` that structures the writing of the full scientific paper based on the extended abstract in `ICID 2026 Abstract.md`.

## Why

The abstract is accepted (or being submitted) to ICID 2026. The full paper must now be written. The paper documents the Gigly project itself — its methodology (SDD), its tooling (ralphy-spec), and its architectural outcomes. This means the paper and the codebase are deeply intertwined: the paper's claims must be grounded in the actual implementation, and the planning document must map each paper section to the evidence available in the repo.

A planning document is the right artifact here because:
- The paper has multiple distinct sections requiring different types of work (literature review, methodology description, architectural validation, writing)
- Each section maps to a concrete task that can be tracked and executed
- The Gigly codebase IS the case study — the planning document must identify which parts of the repo support which claims

## What the Planning Document Will Contain

1. **Paper structure** — full section outline derived from the abstract
2. **Evidence mapping** — which openspec artifacts, code files, and git history support each claim
3. **Gap analysis** — what evidence exists vs. what still needs to be produced or measured
4. **Writing tasks** — one ralphy-plan command per major paper section
5. **Submission checklist** — ICID 2026 formatting, word count, deadline tracking

## Constraints

- The paper is qualitative, not quantitative — validation is architectural, not benchmark-based (stated explicitly in the abstract)
- The paper must be honest about what was built: the ralphy-spec framework, the SDD methodology, the loop mechanics
- AI Disclosure Statement is already drafted and must be preserved
- References [1–7] are already identified and must be cited correctly
- The author is the sole author (solopreneur context)

## Non-Goals

- This change does NOT write the paper itself
- This change does NOT modify any application code
- This change does NOT add new features to Gigly
