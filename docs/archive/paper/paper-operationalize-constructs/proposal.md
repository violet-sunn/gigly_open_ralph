# Proposal: paper-operationalize-constructs

## Summary

§4 of `icid-2026-paper-final.md` uses the terms "architectural drift" and "context decay" as if they are established constructs, but §2 never formally defines them as used in this study. Pan et al. [2] use "architectural drift" in a different sense (legacy architecture recovery), and "context decay" is used informally throughout without an observable proxy. Reviewers will flag both as undefined or ambiguous.

This change inserts a **Construct Definitions** paragraph (~150 words) into §2, positioned after the SDD formal definition paragraph and before the context decay motivation paragraph. The paragraph operationalizes both constructs with observable proxies and disambiguates from prior literature.

## What Changes

- One new paragraph inserted into §2 of `icid-2026-paper-final.md`
- No other sections modified
- No references added (Pan et al. [2] already cited)

## Insertion Point

After the paragraph ending:
> "...The spec is thus the single artifact from which all downstream artifacts — tests, migrations, server actions, UI components — are generated."

Before the paragraph beginning:
> "The motivating problem SDD addresses is context decay..."

## Construct Definitions (authoritative content)

### Architectural drift (as used in this study)
An observable state in which a code artifact violates one or more invariants documented in the canonical spec corpus at the time of its generation. Observable proxy: a **backpressure event** — compiler error, type system rejection, or test failure — triggered by violation of a pre-existing spec-documented convention, requiring correction to conform to that convention rather than introducing a new one.

Disambiguation: this study uses "architectural drift" in the sense of AI-generated deviation from established system invariants, distinct from Pan et al. [2] who use the term for legacy architecture recovery.

### Context decay (as used in this study)
Degradation in an AI agent's adherence to previously established architectural decisions, attributable to context window saturation rather than spec ambiguity. Observable proxy in SDD: its **absence** — no archived change introduced a regression against a prior change's spec-documented interface.

Asymmetry observation: SDD makes context decay observable by its absence in a way that vibe coding does not, because vibe coding has no external spec against which to detect deviation.

## Constraints

- ~150 words for the inserted paragraph
- Both definitions must appear before §4 uses them
- Pan et al. disambiguation must be present
- Observable proxies must be stated for both constructs
- Asymmetry observation must be present
- No other sections of the paper are in scope

## Non-Goals

- Rewriting §4 to reference the new definitions explicitly (the definitions precede §4; cross-referencing is not required)
- Adding new references
- Modifying the abstract or conclusion
