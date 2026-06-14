# Planning Specification Reference

This change creates a planning document following the specification defined in:

**`openspec/specs/planning/spec.md`**

It does not modify the planning specification; it produces one instance
(`openspec/planning/ui-redesign-integration.md`) that MUST conform to it.

## Key Requirements

The generated planning document MUST include:

1. **Problem Section** (2–5 sentences)
   - Describe the current UI vs. the new Figma redesign in `/screens`
   - Avoid implementation details

2. **Why This Matters Section** (2–5 sentences)
   - Explain business/technical impact; reference `project.md` goals
     ("Professional B2B Experience", "Russian Market First", "Quality Over Quantity")

3. **Scope Section**
   - The 13-screen inventory and a screen → route → gap mapping table
   - A **Phase 1 data-model worklist** for every net-new concept the design implies,
     justified against `prisma/schema.prisma`
   - The **plan-only gate**, the MVP boundaries (Finances/Disputes per `project.md`),
     dependencies, risks, and testing-friction assessment

4. **Changes Section**
   - Ordered ralphy-plan commands grouped Phase 0 (Foundation) / Phase 1 (Data & Backend) /
     Phase 2 (Screen Assembly)
   - Commands are copy-pasteable, each with numbered requirements and a deterministic test plan
   - Each change notes a testing-friction level (low/medium/high) + mitigation
   - Changes ordered by dependency; Phase 2 screens cite the Phase 1 change(s) they consume

5. **Status Section**
   - Status: PLANNED, IN_PROGRESS, or COMPLETED
   - Completed changes marked with checkboxes
   - Include creation date

## Initiative-Specific Constraints

The generated document MUST honor `docs/DESIGNER_BRIEF.md` and the two fixed product decisions:

- **Plan only, execute nothing yet** — the document is produced now; no implementation change
  (not even Phase 0) starts until the design is marked final. Phases express dependency order only.
- **Full evolutionary revamp** — net-new features the design implies (ratings, categories,
  deadlines, finances, disputes, onboarding fields, work history) are **scheduled as real
  Phase 1 data-model/backend changes**, each ordered ahead of the screen that consumes it —
  not stubbed or deferred.
- **Data before screens** — a Phase 2 screen change MUST NOT invent its own data layer; it
  consumes a completed Phase 1 change.
- **Preserve the working loop** — schema changes are additive/backward-compatible; the gig
  lifecycle, applications, messaging, profiles, admin, and notifications keep working.
- **Desktop-only** — target 1440px; no mobile/responsive design.
- **Token re-export first** — styling uses the freshly re-exported tokens, not ad-hoc values.
- **Respect MVP non-goals (`project.md`)** — Finances is a logical ledger/view (no real payment
  gateway); Disputes builds on `ModerationLog`. The plan flags these boundaries explicitly.

## Planning Document Format

```markdown
# UI Redesign Integration

**Created:** YYYY-MM-DD
**Status:** PLANNED

## Problem
[current UI vs. the /screens redesign]

## Why This Matters
[impact, with project.md references]

## Scope
[screen→route→gap table; reskin vs net-new; draft-gate; dependencies; risks; testing friction]

## Changes

> Plan only — nothing executes until the design is locked.

### Phase 0 — Foundation
### 1. [Change Name]
```bash
/ralphy-plan change-name "Description. Requirements: (1) ..., (2) .... Test: ... (friction: low/medium/high)."
```
[why this change is needed]

### Phase 1 — Data model & backend (additive; precedes its screen)
...

### Phase 2 — Screen assembly (consumes Phase 0 + Phase 1)
... (each screen cites `Depends on:` its Phase 1 change)

## Status
- [ ] change-name
...

**Progress:** 0/N changes completed
**Started:** Not started
**Completed:** Not completed
```

## See Also

- Full specification: `openspec/specs/planning/spec.md`
- Prior precedent: `openspec/archive/create-ui-overhaul-plan/` (token-migration plan)
- Designer constraints: `docs/DESIGNER_BRIEF.md`
- Mockups: `/screens/*.jpg`
