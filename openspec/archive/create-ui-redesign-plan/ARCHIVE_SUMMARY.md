# Archive Summary: create-ui-redesign-plan

**Archived:** 2026-06-13
**Status:** COMPLETED (planning task complete — the generated roadmap is plan-only and remains ACTIVE)

## What Was Delivered

Created the UI redesign integration planning document at
`openspec/planning/ui-redesign-integration.md` — a dependency-ordered roadmap for integrating the
new Figma redesign (`/screens`) while preserving the working marketplace logic.

## Key Accomplishments

1. **Dissected 13 desktop mockups** — grouped into onboarding mini-flow (4), shared app shell, and
   internal screens (8); flagged `customer-profile.jpg` as a duplicate of `customer-dashboard.jpg`.
2. **Mined the provided component library** — rendered `screens/tokens.svg` (via `sharp`) and
   `screens/frames.svg` (via inlined-SVG Chromium; librsvg rejects its markup). Both are the brief's
   §3 library, not a flow map. Extracted the 6-value status palette, the 5 categories, two tag
   systems, the rating component, the full primitive set, the collapsed-sidebar state, and a
   **Settings** screen absent from the JPGs.
3. **Diffed `prisma/schema.prisma`** against the mockups to fix the reskin/net-new boundary and the
   Phase 1 data-model worklist (ratings, categories, deadline/milestones, profile evolution, terms
   negotiation, finances, disputes, account preferences).
4. **Encoded `docs/DESIGNER_BRIEF.md` + `project.md`** — desktop-only, token re-export first, "new
   look / existing logic", the plan-only gate, and the MVP boundaries (logical Finances, moderation-
   based Disputes).
5. **Produced a 26-change phased roadmap** — Phase 0 Foundation (6) → Phase 1 Data & Backend (8) →
   Phase 2 Screen Assembly (12), each a copy-pasteable `/ralphy-plan` command with numbered
   requirements, a deterministic test plan, a friction level, and (Phase 2) explicit `Depends on:`.

## Deliverable

**Planning Document:** `openspec/planning/ui-redesign-integration.md` (remains ACTIVE)

Contains: Problem, Why This Matters, Scope (screen→route→gap table, Phase 1 data worklist, design-
system facts, plan-only gate, MVP boundaries, dependencies, testing friction, designer gaps,
non-goals), Changes (26 commands, Phase 0/1/2), and Status (0/26).

## Implementation Order

- **Phase 0 — Foundation:** refresh-design-tokens · redesign-typography-fonts · app-shell-scaffold ·
  visual-regression-harness · component-library-map · ui-primitives-library
- **Phase 1 — Data & Backend:** ratings-reviews-model · category-taxonomy · gig-deadline-and-milestones ·
  profile-evolution · terms-negotiation · finances-ledger · disputes-flow · account-preferences
- **Phase 2 — Screen Assembly:** redesign-shell-cutover · redesign-gig-card · redesign-client-dashboard ·
  redesign-specialist-dashboard · redesign-gig-search · redesign-gig-detail-apply · redesign-profile ·
  messaging-inbox-page · finances-page · disputes-page · redesign-auth-onboarding · redesign-settings-page

## Validation Results

All 8 acceptance criteria satisfied (verified deterministically):
- ✓ Planning document exists at `openspec/planning/ui-redesign-integration.md`
- ✓ Follows `openspec/specs/planning/spec.md` format (Problem/Why/Scope/Changes/Status + creation date)
- ✓ Contains the 13-screen inventory and screen→route→gap mapping table
- ✓ Schedules net-new features as Phase 1 data-model/backend changes (not stubs)
- ✓ Records the plan-only gate; orders all changes by dependency across Phase 0 → 1 → 2
- ✓ Each change has a ralphy-plan command, test plan, and friction level (+ Phase 2 `Depends on:`)
- ✓ Flags the MVP boundaries, the `customer-profile.jpg` duplicate, and missing designer mocks
- ✓ Status shows `PLANNED`, creation date, `0/26`

## Important: the plan is NOT executed

This change only **created the roadmap**. The 26 listed changes are **plan-only (0/26)** and gated on
the Figma design being locked. The planning document therefore **stays in `openspec/planning/`** with
status `PLANNED` — it is **not** marked COMPLETED and **not** moved to `openspec/planning/archive/`.
Move it to archive only after all 26 changes are executed (the "Completed planning document"
lifecycle).

## Next Steps

1. Request the missing designer assets: fresh token JSON, a locked 1440px layout, the «схема
   переходов» flow diagram, and full-screen mocks for client-profile / admin / Finances / Disputes /
   Settings.
2. When the design is locked, execute the roadmap in order, starting with:
   ```bash
   /ralphy-plan refresh-design-tokens "..."
   ```
3. Track progress in the Status section of `openspec/planning/ui-redesign-integration.md`.
