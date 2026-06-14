# Proposal: Write §4 Architectural Validation

## Why

The ICID 2026 paper's §4 skeleton contains two bullet points. This section must be expanded into a full ~600–800 word section that validates the paper's two core claims — context hygiene and drift neutralization — with concrete artifacts from the Gigly repository. Without a rigorous §4, the paper's contribution is unsubstantiated.

## What

Expand the §4 skeleton into a complete section that:

1. Justifies the qualitative-over-quantitative evaluation approach.
2. Validates Vector 1 (Context Hygiene) via the openspec/ structural separation.
3. Validates Vector 2 (Drift Neutralization) via the bug-fix-1 PrismaClientValidationError example.
4. References the longitudinal nature of the evidence (33+ changes).
5. Acknowledges limitations honestly (single case study, no control group).

## Constraints

- Target length: 600–800 words.
- The bug-fix-1 example MUST be used for Vector 2: Prisma's type system rejected mixed select/include, forcing the AI to adopt the established `include`-only pattern documented in project.md conventions.
- The archive count MUST be stated as 33+ completed changes.
- Limitations MUST be present and honest — no overclaiming.
- Academic register: third-person, present/past tense as appropriate.
- No new references beyond the existing 7.

## Non-Goals

- Writing §1, §2, §3, or §5.
- Quantitative benchmarks.
- Modifying existing abstract or paper text.
