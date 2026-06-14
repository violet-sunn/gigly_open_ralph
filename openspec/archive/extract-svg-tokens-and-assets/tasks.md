# Implementation Tasks: extract-svg-tokens-and-assets

> **No application code.** Deliverables are: sliced SVG assets, `docs/DESIGN_SPECS.md`, and PNG reference
> renders, plus an explicit residual-gap list. Extraction/measurement/rendering MAY use throwaway tooling
> under `scripts/design-system/`, but that tooling is not shipped application code. Inputs `screens/tokens.svg`
> (1360×9175) and `screens/frames.svg` (3940×11463) are read-only. Friction: low.

---

## Task 1: Catalogue the SVG substrate and confirm the render toolchain

**Implementation Notes:**
- Inventory `screens/tokens.svg` and `screens/frames.svg`: list the top-level `<g>` groups / ids, and note
  the bounding boxes of the regions that correspond to icons, the logo/wordmark, the checkerboard, and each
  library component.
- Map the planning brief's named assets to concrete regions: nav set (dashboard, my-gigs, chats, finances,
  disputes, search), bell, gear, collapse, send, attach, eye, view-toggle, verified, status-dot; logo; pattern.
- Confirm the render toolchain: `tokens.svg` renders with `sharp`; `frames.svg` must be rendered via
  inlined-SVG Chromium (Playwright, already a dev dependency) because librsvg/sharp reject its markup.
- Produce a short inventory note (can live at the top of `docs/DESIGN_SPECS.md` or a scratch file) mapping
  asset/component → source file + region.

**Test Plan:**
```bash
# Group/id inventory is non-trivial
grep -oE '<g[^>]*id="[^"]*"' screens/tokens.svg | head
grep -oc '<g' screens/tokens.svg; grep -oc '<g' screens/frames.svg
# Confirm Playwright is available for the frames render path
npx playwright --version
```
Expected: a written inventory mapping every named asset and component to a source region; render path confirmed.

---

## Task 2: Set up output structure and extraction tooling

**Implementation Notes:**
- Create the deliverable directories:
  - `public/assets/design-system/{icons,brand,patterns}/`
  - `docs/design-system/reference-renders/{components,frames}/`
- Add throwaway tooling under `scripts/design-system/` as needed (e.g. a slicer that extracts a group/bbox to
  a standalone SVG, a measurer that reads coordinates, a renderer for tokens (sharp) and frames (Chromium)).
- These scripts are tooling only — do not wire them into the app, the build, or the test suite.

**Test Plan:**
```bash
ls -d public/assets/design-system/{icons,brand,patterns}
ls -d docs/design-system/reference-renders/{components,frames}
```
Expected: all directories exist.

---

## Task 3: Slice the icon set into individual optimized SVGs

**Implementation Notes:**
- Extract each named icon from the source into its own file under `public/assets/design-system/icons/`,
  kebab-cased: `dashboard, my-gigs, chats, finances, disputes, search, bell, gear, collapse, send, attach,
  eye, view-toggle, verified, status-dot` (include any extra icons discovered).
- Give each a consistent square `viewBox`; keep monochrome icons monochrome (prefer `currentColor` or the
  source fill) so later phases can tint via tokens.
- Optimize: strip editor metadata/comments/namespaces; target <10KB per icon.
- Add accessibility: `aria-label` (or `role="img"` + `<title>`) for meaningful icons.
- Each slice must be visually identical to its source region (it is a slice, not a redraw).

**Test Plan:**
```bash
for n in dashboard my-gigs chats finances disputes search bell gear collapse send attach eye view-toggle verified status-dot; do
  test -f "public/assets/design-system/icons/$n.svg" && echo "OK  $n" || echo "MISSING  $n"
done
# viewBox + no cruft + size
for f in public/assets/design-system/icons/*.svg; do
  grep -q 'viewBox' "$f" || echo "NO viewBox: $f"
  grep -qiE 'data-figma|<metadata|sketch:|inkscape:' "$f" && echo "CRUFT: $f"
done
find public/assets/design-system/icons -name '*.svg' -size +10k   # expect: empty
```
Expected: every named icon present, each with a `viewBox`, no editor cruft, ≤10KB; meaningful icons carry an accessible name.

---

## Task 4: Slice the GIGLY logo / wordmark

**Implementation Notes:**
- Extract the GIGLY logo / wordmark to `public/assets/design-system/brand/gigly-logo.svg` (add an icon-only
  variant if the source clearly contains one, e.g. `gigly-mark.svg`).
- Preserve exact paths and fills; add `viewBox` and `aria-label="Gigly"`; optimize.

**Test Plan:**
```bash
ls public/assets/design-system/brand/*.svg
grep -q 'viewBox' public/assets/design-system/brand/gigly-logo.svg && echo "viewBox OK"
grep -qE 'aria-label|<title' public/assets/design-system/brand/gigly-logo.svg && echo "labelled"
```
Expected: logo/wordmark SVG exists, has a `viewBox` and an accessible name, visually matches the source.

---

## Task 5: Slice the checkerboard pattern

**Implementation Notes:**
- Extract the checkerboard background pattern to `public/assets/design-system/patterns/checkerboard.svg`.
- Mark it decorative: `aria-hidden="true"` and `role="presentation"`; add `viewBox`; optimize.
- Note: an existing `public/assets/auth/background-pattern.svg` already covers the auth footer pattern — this
  design-system slice is the canonical/general version; document the relationship if they differ.

**Test Plan:**
```bash
test -f public/assets/design-system/patterns/checkerboard.svg && echo "pattern exists"
grep -q 'aria-hidden="true"' public/assets/design-system/patterns/checkerboard.svg && \
grep -q 'role="presentation"' public/assets/design-system/patterns/checkerboard.svg && echo "decorative attrs OK"
```
Expected: checkerboard SVG exists, is marked decorative, has a `viewBox`.

---

## Task 6: Extract the colour palette into docs/DESIGN_SPECS.md

**Implementation Notes:**
- Enumerate the distinct fills actually present in the SVGs (do not copy the planning estimate):
  ```bash
  { grep -oiE 'fill="#[0-9a-f]{3,6}"' screens/tokens.svg; grep -oiE 'fill="#[0-9a-f]{3,6}"' screens/frames.svg; } \
    | tr 'A-F' 'a-f' | sort | uniq -c | sort -rn
  ```
  Also capture any `stroke="#..."`, `fill-opacity`, and `stop-color` values.
- In `docs/DESIGN_SPECS.md`, document the ~22–23 distinct colours grouped by family: **surface**
  (`#01030e, #10121c, #0e101a, #1a1a24, #1a1d2a`), **neutral/border** (`#8a8f99, #9fa0a4, #3a3d45`),
  **brand** (`#0088ff, #0077e6, #4cacff`, plus `#1379f3/#0099ff` if confirmed), **status** (the six gig
  statuses: neutral, amber `#f59e0b`, blue `#3b82f6`, purple `#8b5cf6`, green `#10b981`/`#0cc671`, red
  `#ef4444`/`#ff383c`), **tag/category** (pink `#f45fb1`, teal `#05c9e6`, orange `#f27c0d`).
- Record each value with its hex, an observed role, and a provenance hint. Note deltas from the planning
  estimate (e.g. `#1a1d2a, #3a3d45, #1379f3, #0099ff` appear in the SVGs but were not in the planning list).
- Present values **as observed** — no canonical scale names, no collapsing near-duplicates (that is
  `derive-design-system`).

**Test Plan:**
```bash
test -f docs/DESIGN_SPECS.md
# Sampled provenance: documented hex exists in the SVGs
for hex in '#0088ff' '#f59e0b' '#f45fb1' '#10121c'; do
  grep -qi "$hex" docs/DESIGN_SPECS.md && grep -qi "$hex" screens/tokens.svg && echo "OK  $hex" || echo "CHECK  $hex"
done
# Roughly the expected count of documented six-digit hexes
grep -oiE '#[0-9a-f]{6}' docs/DESIGN_SPECS.md | tr 'A-F' 'a-f' | sort -u | wc -l   # expect: ~22-23
```
Expected: palette documented by family; every sampled hex is grep-findable in the SVGs; count ≈ 22–23.

---

## Task 7: Extract the radius set into docs/DESIGN_SPECS.md

**Implementation Notes:**
- Enumerate observed `rx` values:
  ```bash
  { grep -oE 'rx="[0-9.]+"' screens/tokens.svg; grep -oE 'rx="[0-9.]+"' screens/frames.svg; } | sort -u
  ```
  (Observed set spans 2–18px: `2, 2.5, 3, 3.5, 4, 4.5, 5, 8, 11, 12, 13, 16, 18`.)
- Document the radius set in `docs/DESIGN_SPECS.md` with each value and an example context (e.g. `8` →
  cards/inputs, `18` → pill/large container). Present as observed — do not pre-collapse into a canonical scale.

**Test Plan:**
```bash
# Each documented radius is grep-findable as an rx in the SVGs (sample)
for r in 2 4.5 8 12 16 18; do
  grep -q "$r" docs/DESIGN_SPECS.md && { grep -q "rx=\"$r\"" screens/tokens.svg || grep -q "rx=\"$r\"" screens/frames.svg; } \
    && echo "OK  rx=$r" || echo "CHECK  rx=$r"
done
```
Expected: radius set documented spanning 2–18px; each sampled radius traceable to an `rx` in the SVGs.

---

## Task 8: Measure per-component geometry into docs/DESIGN_SPECS.md

**Implementation Notes:**
- For each library component present in the SVGs — sidebar (expanded + collapsed), topbar, GigCard, button,
  input, tabs, filter, tag / category tag, status badge + status dot, rating, avatar, view-toggle (and others
  found) — read coordinates and record the measurable values: outer dimensions, internal paddings, gaps,
  border widths, icon sizes.
- Derive every value from coordinates (element `x/y/width/height`, or deltas between coordinates) and record a
  provenance hint. State clearly that values are **measured, not estimated**.
- Any property not determinable from the SVG (hover-only states, glyph-obscured metrics) MUST be flagged as
  not measurable (and routed to the residual-gap list if it needs another source) — never filled with a guess.

**Test Plan:**
```bash
grep -qiE 'measured|geometry' docs/DESIGN_SPECS.md && echo "geometry section present"
# Spot-check a few component headings exist
for c in sidebar topbar gigcard button input tabs rating avatar; do
  grep -qi "$c" docs/DESIGN_SPECS.md && echo "OK  $c" || echo "CHECK  $c"
done
```
Expected: measured-geometry section covers each named component with coordinate-based provenance; unmeasurable items flagged, not estimated.

---

## Task 9: Produce 1440px reference renders

**Implementation Notes:**
- Render the component library from `screens/tokens.svg` (via `sharp`) to
  `docs/design-system/reference-renders/components/` — full sheet + tiles covering every library component.
  Also stage the `frames.svg` ("components") render here (via inlined-SVG Chromium / Playwright — libvips
  rejects its markup).
- **Discovery:** the SVGs are the component library, **not** the 12 assembled screens. Stage interim **lossy**
  per-screen baselines from `screens/*.jpg` under `reference-renders/frames/` with a `README.md` noting they
  are lossy and that high-fidelity per-screen frames must be exported from **Figma** (residual gap).
- These component renders are the committed fidelity baseline that `fidelity-harness` (Phase 0, change 9) will
  diff against.

**Test Plan:**
```bash
ls -d docs/design-system/reference-renders/{frames,components}
find docs/design-system/reference-renders/components -name '*.png' | wc -l   # expect: >= 1 (full + tiles)
find docs/design-system/reference-renders -name '*.png' -size 0              # expect: empty (no zero-byte files)
ls docs/design-system/reference-renders/frames/*.jpg | wc -l                 # expect: 13 interim screen baselines
test -f docs/design-system/reference-renders/frames/README.md && echo "frames README present"
```
Manual: open each frame render beside its `frames.svg` region and confirm fidelity. Expected: one render per screen frame, component renders cover the library, all valid non-empty PNGs derived from the SVGs.

---

## Task 10: Compile the explicit residual-gap list

**Implementation Notes:**
- Add a "Residual Gaps" section to `docs/DESIGN_SPECS.md` enumerating everything the SVGs cannot supply:
  - **Raster banner art** — the cosmic banner (the 2 `<image>` nodes in `frames.svg`); export from Figma/source.
  - **Semantic token names** — values are in the SVGs but names are not; attach from a fresh Figma token export.
  - **Font metrics** — SF Compact + NKDy Mono; text is outlined to paths (zero `font-family` refs), so
    unrecoverable here; obtain files + web-embedding licence from Figma/source.
  - **SVG-absent components** — any redesign component not present in `tokens.svg`/`frames.svg`.
- For each gap, state what is missing, why it cannot come from the SVGs, and its required source (Figma node /
  exported raster / font file + licence).
- Use Figma / Dev Mode **only** for these residual gaps. If Figma access (`mcp__figma__authenticate`) is
  unavailable, still ship the precise, actionable list (exact node/asset + what is needed); the export can
  follow once access exists. Do **not** re-source any value the SVGs already encode.

**Test Plan:**
```bash
grep -qiE 'residual gap' docs/DESIGN_SPECS.md && echo "section present"
for term in 'banner' 'token name' 'font' 'absent'; do
  grep -qi "$term" docs/DESIGN_SPECS.md && echo "OK  $term" || echo "CHECK  $term"
done
# Confirm the raster gap is real: image nodes exist in frames.svg, none used as palette source
grep -oc '<image' screens/frames.svg
```
Expected: a "Residual Gaps" section covering all four categories, each specific and actionable; SVG-recoverable substrate is sourced from the SVGs, not Figma.

---

## Task 11: Final verification and spec confirmation

**Implementation Notes:**
- Run the full deterministic check suite from the spec delta's Test Plan (asset, doc/provenance, render, and
  residual-gap checks).
- Do a manual fidelity pass: sample icons vs source crops; frame renders vs `frames.svg` regions.
- Confirm scope discipline: no application code, no schema/test changes, no machine token source (re)created
  — the deleted `openspec/specs/ui/design-tokens.json` stays absent (regeneration is `design-token-engine`),
  and no normalization performed.
- Confirm all seven added requirements in the spec delta are satisfied.

**Test Plan:**
```bash
# Scope guards
git status --porcelain | grep -E '\.(ts|tsx)$' && echo "UNEXPECTED code change" || echo "no code changes"
test -f openspec/specs/ui/design-tokens.json && echo "UNEXPECTED: token source present (design-token-engine creates it, not this change)" || echo "no token source recreated (correct — stays deleted until design-token-engine)"
# Deliverables present
test -f docs/DESIGN_SPECS.md && ls public/assets/design-system/icons/*.svg >/dev/null && \
  find docs/design-system/reference-renders -name '*.png' | head -1 && echo "deliverables present"
```
Expected: all deterministic checks pass; manual fidelity confirmed; no out-of-scope changes; all seven requirements met.

---

## Summary

Total tasks: 11
Estimated effort: 4–6 hours (friction: low)

**Deliverables:**
- ✅ Asset library: `public/assets/design-system/{icons,brand,patterns}/` — named icon set, GIGLY logo/wordmark, checkerboard
- ✅ `docs/DESIGN_SPECS.md`: extracted palette (~22–23 fills by family) + radius set (2–18px) + measured per-component geometry + residual-gap list
- ✅ `docs/design-system/reference-renders/{components,frames}/`: 1440px PNG fidelity baseline from the SVGs

**Critical path:**
1. Catalogue substrate + confirm render path (Task 1)
2. Output dirs + tooling (Task 2)
3. Slice assets — icons, logo, pattern (Tasks 3–5)
4. Extract palette + radii + geometry into DESIGN_SPECS.md (Tasks 6–8)
5. Reference renders (Task 9)
6. Residual-gap list (Task 10)
7. Verify + confirm scope (Task 11)

**Scope guards (non-goals):**
- No application/TS/React code; no schema or test-suite changes
- No machine token source (re)created — the deleted `openspec/specs/ui/design-tokens.json` stays absent (regeneration is `design-token-engine`)
- No normalization into canonical scales (that is `derive-design-system`) — raw observed values only
- Figma used only for residual gaps; never to re-source SVG-encoded values
- Does not require the design lock (operates only on in-hand SVGs)

**Success criteria:**
- ✅ Importable asset library (named icons + logo + pattern), each optimized, valid, accessible
- ✅ `docs/DESIGN_SPECS.md` with palette + radii + measured geometry, every value traceable to the SVGs
- ✅ 1440px reference renders of every component and screen frame, committed as the fidelity baseline
- ✅ Explicit, actionable residual-gap list (raster banner, token names, fonts, SVG-absent components)
