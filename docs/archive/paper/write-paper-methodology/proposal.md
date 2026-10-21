# Proposal: Write §2 Methodology (Spec-Driven Development)

## Why

The ICID 2026 paper has a skeleton §2 in `ICID 2026 Abstract.md` that needs to be expanded into a full methodology section (~500–700 words). This section is the intellectual core of the paper: it defines SDD, contrasts it with prior paradigms, explains the problem it solves (context decay), and grounds the theory in the concrete Gigly implementation. Without a rigorous §2, the paper's contribution claim is unsupported.

## What

Expand the §2 skeleton into a complete methodology section that:

1. Formally defines Spec-Driven Development (SDD).
2. Contrasts SDD with code-first and TDD paradigms.
3. Explains context decay as the motivating problem, citing [4] Hong et al.
4. Cites [5] Piskala arXiv:2602.00180 for the SDD definition and framing.
5. Describes the physical openspec/ directory structure used in Gigly.
6. Explains the human-as-architect / AI-as-executor division of labor.
7. Provides one concrete archive example (gig-creation change) showing spec-before-code flow.

## Constraints

- Target length: 500–700 words for the section body.
- Citations must use the existing reference list numbering from the abstract ([4] Hong et al., [5] Piskala).
- The concrete example MUST reference the gig-creation archive: `openspec/archive/gig-creation/specs/database/spec.md` defined `budget`, `serviceFee`, `totalAmount`, and `status` fields before any Prisma schema was written.
- The openspec/ directory structure must be described accurately: `openspec/specs/` (live canonical specs), `openspec/archive/` (completed changes, each containing `proposal.md`, `tasks.md`, `specs/` delta), `openspec/changes/` (in-progress changes).
- Human-as-architect means: the human author writes all proposals and acceptance criteria; the AI agent reads specs and implements against them without modifying the spec.
- Academic register: third-person, present tense for definitions, past tense for observations.
- No new references beyond those already in the abstract's reference list.

## Non-Goals

- Writing §1, §3, §4, or §5 (those sections already exist in the abstract).
- Quantitative evaluation or metrics.
- Describing the ralphy-spec tooling in detail (that belongs in §3).
- Modifying the existing abstract text.
