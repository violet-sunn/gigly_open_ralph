# Proposal: paper-add-related-work

## Summary

Add a comprehensive §1.1 Related Work section to `icid-2026-paper-final.md`, inserting it between the research question paragraph and the paper structure paragraph in §1. The section targets ~500 words and 9 new references (bringing the total from 10 to 19), organized across four literature areas that each argue differentiation rather than merely listing prior work.

## Motivation

The current §1 Introduction moves directly from the research question to the paper structure outline. For ICID 2026 reviewers, the absence of a Related Work section is a gap: it leaves the paper's positioning relative to prior literature implicit. Explicitly situating SDD within four adjacent research traditions — LLM context management, specification-based development, human-AI teaming, and bootstrapped platform economics — strengthens the contribution claim and pre-empts reviewer objections about novelty.

## Scope

**In scope:**
- Insert `### 1.1 Related Work` subsection in §1, between the research question paragraph and the paper structure paragraph.
- Add 9 new references ([11]–[19]) to the References section.
- Each area argues how this paper extends or differs from cited work (differentiation, not enumeration).
- Total word count for §1.1: ~500 words.
- Total references after change: 19 (10 existing + 9 new).

**Out of scope:**
- Modifying §2–§5 or the Abstract.
- Adding quantitative data or new empirical claims.
- Changing existing references [1]–[10].
- Duplicating content already present in §1 Introduction.

## Constraints

- The four areas must cover: (A) LLM context management/degradation, (B) specification-based and contract-driven development, (C) human-AI teaming and role division in SE, (D) bootstrapped platform development and solopreneur economics.
- Each area must argue differentiation: how SDD/this paper extends, differs from, or fills a gap left by cited work.
- Reference numbers must be assigned sequentially: [11]–[19].
- The subsection heading must be `### 1.1 Related Work` (or equivalent markdown heading consistent with the paper's style).
- The paper structure paragraph that currently closes §1 must remain the final paragraph of §1 after the insertion.
