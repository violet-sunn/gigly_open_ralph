# Proposal: Write §3 Implementation (Continuous Deterministic Execution Loops)

## Why

The ICID 2026 paper has a 2-paragraph §3 skeleton in `ICID 2026 Abstract.md`. This section must be expanded into a full ~500–700 word section that explains the Ralph Wiggum loop methodology, the role of automated backpressure, and the ralphy-spec framework. Without a concrete §3, the paper's implementation claim is unsupported and the methodology is not reproducible.

## What

Expand the §3 skeleton into a complete section that:

1. Introduces the Ralph Wiggum loop and cites [6] Huntley.
2. Presents and explains the core loop command (`while :; do cat PROMPT.md | claude-code; done`).
3. Explains what the loop prevents: premature exit, ad-hoc human intervention, context-switching.
4. Explains automated backpressure as the feedback mechanism (TypeScript, ESLint, Vitest, Playwright, Prisma).
5. Introduces ralphy-spec and cites [7] Yu.
6. Describes the Gigly-specific backpressure stack.
7. Provides a concrete loop iteration narrative using the `service-fee-fix` change.

## Constraints

- Target length: 500–700 words.
- Citations must use existing numbering: [6] Huntley, [7] Yu.
- The concrete example MUST use `service-fee-fix`: the loop ran, integration tests failed (20% → 10% mismatch), the AI self-corrected without human input.
- The loop command must be presented verbatim: `while :; do cat PROMPT.md | claude-code; done`.
- Academic register: third-person, present tense for definitions, past tense for observations.

## Non-Goals

- Writing §1, §2, §4, or §5.
- Describing SDD in detail (that belongs in §2).
- Modifying existing abstract text.
