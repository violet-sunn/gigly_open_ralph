# create-figma-ui-reconciliation-plan

**Type:** Planning Document Change (generates a strategic planning document)
**Created:** 2026-06-17
**Generates:** `openspec/planning/figma-grounded-ui-reconciliation.md`
**References spec:** `openspec/specs/planning/spec.md` (planning-document format — not duplicated here)

## Why

The prior initiative `openspec/planning/archive/ui-redesign-integration.md` is **COMPLETE (29/29)**. It built the full UI-creation *mechanism* (tokens → primitives → blocks → layout grammar → composition → workbench → fidelity gate) and composed all screens. But it was grounded in **lossy inputs**: the `/screens/*.svg` extraction, where fonts were **outlined to paths** (unrecoverable), semantic token *names* were absent, geometry was *measured/estimated* from SVG coordinates, and the **F1 ≤1% pixel gate was explicitly deferred** (~9.8% diff dominated by the substitute font + uncomposed bodies). That plan itself flagged "Figma Dev Mode + Code Connect + a fresh token JSON" as the refinement needed to attach semantic names and cross-check geometry, and named **fonts/licence** + **locked design** as hard blockers.

Those blockers are now resolved. We have **authoritative data straight from Figma** (file `gl9wHy8VGJQTmNuQZNukqg`, Pro seat, unmetered), imported via the official Figma MCP and persisted in the repo:
- `docs/figma-tokens-export.json` — token SSOT with real semantic names (revealed type-scale drift + border/brand mapping bugs vs the committed `scripts/generated-tokens.*`).
- `docs/figma-components-export.md` — **18/18 composites** with token-mapped specs, incl. the full per-type **attention-card** map and the 5 previously-blocked composites (toggle field, check field, session, file, attention-card styling).
- `docs/figma-screens-export.md` — **all 14 app/auth screens** as composition specs (each with its Figma node-id + the blocks it composes from) **+ 9 new sub-atoms** the SVG extraction never surfaced.
- `docs/figma-component-audit.md` — atomic-primitives ↔ coded-kit gap audit (missing primitives + the tag/Category hue↔domain rename risk).

This concrete data exposes specific divergences between the *built* kit and the *authoritative* design — the "hickups" still visible in the running UI. This planning document will sequence the work to close them, so the coded UI becomes **logically and visually faithful to the Figma mockups**, and the deferred F1 fidelity gate can finally be met per-screen.

## What will be analyzed

When implemented (`/ralphy-implement create-figma-ui-reconciliation-plan`), the AI will:
1. Re-read the four Figma import docs above + `project.md` + the archived `ui-redesign-integration.md` to establish the built-vs-authoritative delta.
2. Enumerate every gap the import surfaced: token drift, the three non-token font families (Vremena Grotesk, IBM Plex Sans, Inter), the three-blue inconsistency (`#08f` vs `#006ccb` vs `#4cacff`), the new `--gig-bg #1A1A24` surface, the unbound tag/Category hues; the 9 new sub-atoms; the audit's missing primitives (IconButton, specialty tag, Button Tetriary/danger, Filter expand, Select disabled); the attention-card + settings composites; and the per-screen composition deltas for all 14 screens.
3. Map each gap to an ordered, dependency-aware list of `/ralphy-plan` commands (Phase 0 system additions → Phase 1 per-screen reconciliation → Phase 2 re-validation).

## What the planning document will contain

A document following `openspec/specs/planning/spec.md` (Problem, Why This Matters, Scope, Changes, Status), in the style and rigor of `ui-redesign-integration.md`, but **grounded in concrete Figma node-ids and extracted values** rather than SVG estimates. Each Change MUST carry: requirements (MUST/SHALL), a **generativity / zero-off-system-values** acceptance check, a test plan, and explicit dependencies. The mandate is **reconcile to the system, don't copy screens** — deliberate divergences become system variants, accidental ones are normalized and flagged.

## Scope / Non-goals

- **In scope:** producing the planning document only (analysis + executable `/ralphy-plan` commands). This change writes NO production code and modifies no app/ or component code.
- **Non-goals:** executing any reconciliation change; re-running the import (already complete); re-deriving the mechanism (it exists — this iteration *extends and corrects* it, it does not rebuild it). The font web-licence decision remains an external prerequisite for the absolute F1 gate and will be carried as a noted dependency, not resolved here.

## References

- Planning format: `openspec/specs/planning/spec.md`, `openspec/planning/README.md`
- Prior iteration: `openspec/planning/archive/ui-redesign-integration.md`
- Figma data: `docs/figma-tokens-export.json`, `docs/figma-components-export.md`, `docs/figma-screens-export.md`, `docs/figma-component-audit.md`
