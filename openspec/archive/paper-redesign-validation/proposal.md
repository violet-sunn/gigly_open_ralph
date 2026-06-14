# Proposal: paper-redesign-validation

## What

Upgrade §4 of `icid-2026-paper-final.md` from two illustrative anecdotes to a structured artifact observation protocol. The two-vector qualitative structure committed to in the submitted abstract (context hygiene + neutralizing architectural drift) is preserved exactly. The change is methodological depth, not structural change.

## Why

The current §4 presents `bug-fix-1` and `service-fee-fix` as standalone examples. A reviewer can reasonably ask: were these cherry-picked? The upgrade answers that question by grounding both vectors in a named, stratified sample of 10 archived changes drawn from the full `openspec/archive/` corpus, with an explicit observation method and a three-category coding scheme for backpressure events. This makes the validation reproducible and the claims falsifiable by directory inspection — without introducing quantitative metrics or controlled comparisons that the single-case design cannot support.

## Constraints

1. The two-vector structure (Context Hygiene, Neutralizing Architectural Drift) must be preserved verbatim in its framing.
2. No quantitative metrics, percentages as primary claims, or controlled comparisons may be introduced. The protocol produces qualitative classifications.
3. The limitations paragraph must be retained unchanged.
4. The abstract's framing ("qualitative architectural validation") must remain accurate after the revision.
5. Target word count for §4: ~850 words (up from ~600).

## Sample

Stratified selection of 10 changes from `openspec/archive/`:

| Stratum | Changes |
|---|---|
| Early lifecycle (3) | `project-initialization`, `user-login-and-sessions`, `gig-creation` |
| Mid lifecycle (4) | `messaging-iteration-1`, `admin-role-and-moderation`, `bug-fix-1`, `service-fee-fix` |
| Late lifecycle (3) | `pagination-gig-browsing`, `rate-limiting`, `ui-design-system-overhaul` |

Rationale: covers the full project lifecycle and all major domain areas (auth, core gig loop, messaging, moderation, bug correction, fee logic, pagination, security, UI).

## Observation Method

Artifact analysis of the `openspec/` corpus: directory structure, `proposal.md`, `tasks.md`, spec deltas under each change's `specs/` subdirectory, and git history. No instrumentation, no measurement — classification by inspection.

## Vector 1 Finding

For each of the 10 sampled changes, the canonical `openspec/specs/` directory was not modified by the change's implementation. The spec delta was always confined to the change's own `specs/` subdirectory within `openspec/archive/` (or `openspec/changes/` while in progress). This is verifiable by directory inspection. Finding: 10/10 sampled changes show clean spec separation.

## Vector 2 Coding Scheme

Each of the 10 sampled changes is classified into one of three categories:

- **(a)** No backpressure event recorded in `tasks.md` or git history.
- **(b)** Backpressure triggered; AI self-corrected to existing spec-documented convention within the loop.
- **(c)** Backpressure triggered; correction required a spec update (convention absorbed into `project.md` or `specs/`).

Classification of the 10 sampled changes:

| Change | Category | Notes |
|---|---|---|
| `project-initialization` | (a) | Greenfield setup; no prior conventions to violate |
| `user-login-and-sessions` | (a) | Auth primitives established cleanly |
| `gig-creation` | (a) | First domain model; no drift opportunity |
| `messaging-iteration-1` | (a) | Schema-only change; no runtime backpressure |
| `admin-role-and-moderation` | (a) | New domain; no existing interface violated |
| `bug-fix-1` | (b) | Prisma `select`/`include` mix rejected at runtime; AI corrected to `include`-only per existing convention; convention then formally documented in `project.md` (making this also a (c) event — the correction triggered a spec update) |
| `service-fee-fix` | (b) | Fee constant corrected; test suite failed on 20% assertions; AI updated all 40 test cases within the loop; no spec update required beyond the already-correct `project.md` |
| `pagination-gig-browsing` | (a) | New feature; no prior pagination interface to violate |
| `rate-limiting` | (a) | New infrastructure layer; no existing convention violated |
| `ui-design-system-overhaul` | (a) | Additive design token system; no backpressure recorded |

Aggregate distribution: 8 Type (a), 1 Type (b) with test-update cascade (`service-fee-fix`), 1 Type (b)+(c) (`bug-fix-1`). No Type (c)-only instances.

## Non-Goals

- No new sections, no new vectors.
- No changes to §1, §2, §3, or §5.
- No changes to the abstract.
- No quantitative benchmarks.
- No controlled comparisons.
