# Change Proposal: extract-svg-tokens-and-assets

> Phase 0, change 1 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> This is the one genuinely **unblocked** piece of Phase 0: it operates only on the SVGs already in
> the repo, so it does **not** wait on the Figma design lock. It grounds every later phase
> (`derive-design-system`, `design-token-engine`, `ui-primitives`, …) in measured artifacts instead of
> descriptions.

## Problem Statement

A ground-up redesign of Gigly arrived as a two-part vector component library — `screens/tokens.svg`
(1360×9175) and `screens/frames.svg` (3940×11463) — plus 13 lossy desktop JPGs. The **substrate of the
design system is already in the repo as exact vector data**: the colour fills, the corner radii, the
icon/logo/pattern geometry, and per-component dimensions are all readable directly from the SVG
coordinates.

The previous UI attempt failed because it re-derived this substrate **by eye** — re-sourcing and
approximating values we already possess exactly — which produced an architecturally inert "parody" of
the design. We must stop eyeballing and **extract** what the SVGs already encode.

The legacy design-token source (`openspec/specs/ui/design-tokens.json`) and the existing `openspec/specs/ui`
UI specs encoded those outdated values and have been retired — the JSON is now **deleted**. The build does
not break (Tailwind reads the already-generated `scripts/generated-tokens.js`), but the live token values are
stale until regenerated. The **`/screens` SVGs are the single source of truth** for the design system; this
change is what turns that truth into usable artifacts.

Without this extraction:
- Later changes (`derive-design-system`, `design-token-engine`, primitives, blocks) have no authoritative
  values to normalize and would re-introduce estimates.
- There is no committed **fidelity baseline** to diff against, so "looks close" can never become "measured".
- The reusable icon/logo/pattern assets stay locked inside two monolithic SVGs instead of an importable library.

## Proposed Solution

Extract the design-system substrate from the in-hand SVGs and emit four durable, draft-independent artifacts:

1. **A reusable SVG asset library** — slice the individual vector ids/groups into optimized, standalone SVGs:
   - **Icons** — the nav set (dashboard, my-gigs, chats, finances, disputes, search) plus the standalone
     UI icons: bell, gear, collapse, send, attach, eye, search, view-toggle, verified, and the status dot.
   - **Brand** — the GIGLY logo / wordmark.
   - **Pattern** — the checkerboard background pattern.
2. **`docs/DESIGN_SPECS.md`** — the **raw observed** colour palette (the ~22–23 distinct fills, organized by
   family: surface / neutral / brand / status / tag-category) and the **radius set** (the observed values in
   the 2–18px range), every value traceable to a concrete SVG fill or `rx` coordinate.
3. **Measured per-component geometry** (also in `docs/DESIGN_SPECS.md`) — dimensions, paddings, gaps,
   borders, and icon sizes read from SVG coordinates, **no estimates**.
4. **1440px reference renders** of every library **component** (from the SVGs), committed as the fidelity
   baseline that `fidelity-harness` (Phase 0, change 9) will later diff against.
   *(Discovery during implementation: the SVGs are the **component library**, not the 12 assembled screens —
   screen frames are staged as interim lossy JPG baselines and flagged as a Figma-sourced residual gap.)*

Then, **only for what the SVGs cannot supply**, compile an explicit **residual-gap list** and route those
items to Figma / Dev Mode: the raster banner art (the 2 `<image>` nodes), semantic token names, font metrics
(text is outlined to paths — confirmed zero `font-family` refs), and any component absent from the SVGs.

This change **extracts and documents only**. It does not normalize values into canonical scales (that is
`derive-design-system`), does not generate a machine token source (that is `design-token-engine`), and writes
no application code. Because the legacy `design-tokens.json` is now deleted, `docs/DESIGN_SPECS.md` produced
here is the **interim human-readable source of truth** — backed by the `/screens` SVGs — until
`design-token-engine` regenerates fresh machine tokens from this extraction.

## Constraints

### MUST Requirements
- Every documented colour MUST be a **real fill present in the SVGs** (verifiable by grepping the hex in
  `screens/tokens.svg` / `screens/frames.svg`) — no invented or rounded values.
- Every documented radius MUST correspond to an **`rx` value present in the SVGs** — observed set, not a
  canonicalized guess.
- Component geometry MUST be **measured from SVG coordinates**; any value that cannot be measured MUST be
  flagged as such, never estimated.
- Sliced asset SVGs MUST be valid, optimized (no editor metadata/cruft), carry a `viewBox`, and carry
  appropriate accessibility attributes (`aria-label`/`<title>` for meaningful icons; `aria-hidden`/
  `role="presentation"` for the decorative pattern).
- **Component** reference renders MUST be produced **from the SVGs** at the 1440px reference width. (Assembled
  screen frames are not in the SVGs; interim lossy JPG baselines are staged and high-fidelity frames are a
  Figma residual gap.)
- The residual-gap list MUST be **explicit and actionable** — each gap names what is missing and where it
  must come from.
- Figma/Dev Mode MUST be used **only** for residual gaps — never to re-source a value the SVGs already encode.

### SHOULD Requirements
- Icon SVGs SHOULD use a consistent square `viewBox` and SHOULD be monochrome where the source is monochrome
  (tintable via `currentColor`) so later phases can recolour them with tokens.
- `docs/DESIGN_SPECS.md` SHOULD record provenance (source file + node/coordinate hint) next to each value.
- Extraction/measurement/rendering MAY use throwaway tooling scripts (e.g. under `scripts/design-system/`),
  but these are tooling, not shipped application code.

### Non-Goals
- **No normalization / reconciliation** into canonical scales or variants — that is `derive-design-system`.
- **Does not (re)create a machine token source or run Tailwind/CSS regeneration** — the legacy
  `openspec/specs/ui/design-tokens.json` was deleted as outdated and MUST stay absent here; generating a
  fresh token source from this extraction is `design-token-engine`.
- **No React components, primitives, or blocks** — that is `ui-primitives` / `domain-blocks`.
- **No font embedding/licensing work** — fonts are a flagged residual gap only.
- **No application code, schema, or test-suite changes.**
- **No authoring or altering the design.** We extract what exists.
- **Does not require the design to be locked** — it reads only the in-hand SVGs; the design-lock gate that
  governs the rest of the plan does not apply to this change.

## Success Criteria

1. An importable asset library exists under `public/assets/design-system/` containing the named icon set,
   the GIGLY logo/wordmark, and the checkerboard pattern, each as an optimized, valid, accessible SVG.
2. `docs/DESIGN_SPECS.md` exists and documents the extracted colour palette (~22–23 fills, by family) and the
   radius set (2–18px observed values), each value traceable to the SVGs.
3. `docs/DESIGN_SPECS.md` documents measured per-component geometry (dimensions, paddings, gaps, borders,
   icon sizes) sourced from SVG coordinates, with unmeasurable items flagged rather than estimated.
4. 1440px reference renders of every library component and every screen frame are committed under
   `docs/design-system/reference-renders/`.
5. `docs/DESIGN_SPECS.md` contains an explicit, actionable **Residual Gaps** section covering the raster
   banner art, semantic token names, font metrics, and any SVG-absent component.
6. A spot check confirms a sampled palette hex and a sampled radius from the doc are present in the SVGs.

## Affected Areas

- `public/assets/design-system/icons/` (new) — sliced icon SVGs
- `public/assets/design-system/brand/` (new) — GIGLY logo / wordmark
- `public/assets/design-system/patterns/` (new) — checkerboard pattern
- `docs/DESIGN_SPECS.md` (new) — palette, radius set, measured geometry, residual-gap list
- `docs/design-system/reference-renders/` (new) — `components/` and `frames/` PNG baselines
- `scripts/design-system/` (new, optional throwaway tooling) — slice / measure / render helpers
- `screens/tokens.svg`, `screens/frames.svg` (read-only inputs)
- `openspec/specs/ui/spec.md` (spec delta for the extraction deliverables)

## Risks & Mitigations

**Risk**: `frames.svg` markup is rejected by `librsvg`/`sharp` when rendering.
**Mitigation**: Render `tokens.svg` with `sharp`; render `frames.svg` via inlined-SVG Chromium (Playwright,
already a dev dependency) — the approach validated during planning.

**Risk**: Slicing 270+ vector ids / 1300+ paths by hand is error-prone.
**Mitigation**: Use a throwaway extraction script to pull groups/ids by bounding box, then verify each
sliced asset renders identically to its crop in the reference render.

**Risk**: The real fill set differs from the planning doc's estimate (it does — e.g. `#1a1d2a`, `#3a3d45`,
`#1379f3`, `#0099ff` appear in the SVGs but were not in the planning list).
**Mitigation**: Treat the SVG fills as authoritative; document the **actually observed** set and note
deltas from the planning estimate.

**Risk**: Figma access (`mcp__figma__authenticate`) is unavailable in this environment.
**Mitigation**: Figma is needed **only** for residual gaps. If unavailable, the residual-gap list still
ships as a precise, actionable backlog (exact asset/node + what is needed), satisfying the test; the export
itself can follow once access exists.

**Risk**: Scope creep into normalization or token seeding.
**Mitigation**: Hard non-goals above; this change records **raw observed** values only and leaves
canonicalization to `derive-design-system`.
