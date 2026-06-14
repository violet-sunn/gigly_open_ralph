# Proposal: Create Paper Depth Revision Plan

**Change name:** create-paper-depth-revision-plan
**Type:** Planning document creation

## Problem

`icid-2026-paper-final.md` is a well-structured but shallow descriptive document. It narrates what SDD and the Ralph Wiggum loop are, but does not argue for them scientifically. The paper currently:

- Makes claims without falsifiability criteria (e.g. "demonstrably constrained AI output" — demonstrated how, measured against what?)
- Treats two anecdotes (bug-fix-1, service-fee-fix) as validation without framing them as structured observations
- Offers no theoretical model — it describes a practice but does not explain *why* it works at a mechanistic level
- Positions itself as a case study but applies no recognized case study research methodology (e.g. Yin 2018, Runeson & Höst 2009)
- Lacks a related work section that situates SDD and agentic loops within the existing ASE, context management, and specification literature
- Uses "architectural drift" and "context decay" as if they are established constructs, but does not operationalize them for this study
- The §4 validation section is the weakest: two vectors with one example each is not validation — it is illustration

## Why This Matters

ICID is a peer-reviewed venue. Reviewers will ask: (1) What is the research method? (2) What would falsify your claims? (3) How does this relate to prior work? (4) What is the theoretical contribution beyond "we built a thing and it worked?" The current paper cannot answer any of these questions. Without revision, it risks desk rejection or a "reject — insufficient scientific rigor" verdict. The solopreneur angle and the SDD+loop methodology are genuinely novel; the paper deserves to make that case properly.

## What the Planning Document Will Contain

A structured revision plan for `icid-2026-paper-final.md` with the following components:

1. **Diagnosis** — a section-by-section critique identifying exactly what is missing and why it matters scientifically
2. **Theoretical model** — a proposed mechanistic explanation of why SDD prevents architectural drift (the "spec as external memory" model), suitable for §2
3. **Related work map** — identification of the 4–6 additional references needed to situate the contribution (context management in LLMs, specification-based testing, case study methodology in SE)
4. **Operationalization** — definitions of "architectural drift" and "context decay" as observable, falsifiable constructs for this study
5. **Validation redesign** — a structured observation protocol for §4 that applies across all 33+ archive changes, not just two anecdotes
6. **Ordered ralphy-plan commands** — one change per revision concern, executable in sequence

## Scope

**Files affected:**
- `icid-2026-paper-final.md` — primary revision target
- `openspec/archive/` — source of structured observations for §4 redesign
- `openspec/specs/` — evidence for theoretical model

**Dependencies:**
- No new Gigly features required
- No new external references required beyond what the planning document identifies
- Each revision change is independent and can be reviewed before the next is executed

**Risks:**
- Adding related work may reveal that SDD is less novel than claimed — must be addressed honestly
- Operationalizing "architectural drift" retroactively from archive artifacts requires careful framing to avoid post-hoc rationalization
- Page limit constraints (ICID format TBD) may require prioritization of which depth improvements to include

**Out of scope:**
- Quantitative benchmarks (excluded by the abstract's stated scope)
- Changes to Gigly application code
- Rewriting the abstract (it was submitted; only the full paper is being revised)
