# UI Specification Delta: extract-svg-tokens-and-assets

This document contains specification changes for the `extract-svg-tokens-and-assets` change.

Scope note: these requirements cover **extraction and documentation** of the design-system substrate
from the in-hand SVGs (`screens/tokens.svg`, `screens/frames.svg`). They produce assets, a specs document,
and reference renders — **not** application code, normalized scales, or design tokens. Normalization is
`derive-design-system`; generating the machine token source is `design-token-engine`. (The legacy
`openspec/specs/ui/design-tokens.json` has been deleted as outdated; the `/screens` SVGs are the single
source of truth, and `docs/DESIGN_SPECS.md` produced here is the interim human-readable record.)

---

## ADDED Requirements

### Requirement: Design-System SVG Asset Library
The reusable vector assets embedded in `screens/tokens.svg` and `screens/frames.svg` MUST be sliced into an
importable library of individual, optimized SVG files under `public/assets/design-system/`.

#### Scenario: Asset library directory structure exists
- GIVEN the change is implemented
- WHEN the file system is inspected
- THEN a `public/assets/design-system/` directory MUST exist
- AND it MUST contain the subdirectories `icons/`, `brand/`, and `patterns/`

#### Scenario: The named icon set is sliced into individual SVGs
- GIVEN the `public/assets/design-system/icons/` directory
- WHEN its contents are inspected
- THEN it MUST contain at least one standalone SVG for each of the following, named in kebab-case:
  - the navigation set: `dashboard`, `my-gigs`, `chats`, `finances`, `disputes`, `search`
  - the standalone UI icons present in the SVGs: `bell`, `gear`, `collapse`, `send`, `view-toggle`, `verified`, `status-dot` (plus `filter`, `radio-on`/`radio-off`, `clear`, `star` observed in the library)
- AND `attach` and `eye` are NOT present in the in-hand SVGs (chat composer / auth screen) and are recorded as Figma-sourced residual gaps rather than produced here
- AND each icon MUST be a single self-contained `.svg` file (not a sprite sheet)
- AND additional icons discovered in the SVGs that are not in this list MAY also be included

#### Scenario: Brand and pattern assets are sliced
- GIVEN the asset library
- WHEN `brand/` and `patterns/` are inspected
- THEN `brand/` MUST contain the GIGLY logo / wordmark as an SVG (e.g. `gigly-logo.svg`)
- AND `patterns/` MUST contain the checkerboard pattern as an SVG (e.g. `checkerboard.svg`)

#### Scenario: Sliced assets are faithful to the source
- GIVEN any sliced asset SVG
- WHEN it is rendered and compared to the corresponding region of the source SVG
- THEN it MUST be visually identical to that region (it is a slice, not a redraw)
- AND its colour fills MUST be the exact hex values from the source (no re-colouring or approximation)

**Acceptance Criteria:**
- `public/assets/design-system/{icons,brand,patterns}/` exist
- Every named icon, the logo/wordmark, and the checkerboard exist as individual `.svg` files
- Each asset is a slice of the source geometry, not a hand-redrawn approximation

---

### Requirement: SVG Asset Optimization and Accessibility
Every sliced asset SVG MUST be valid, optimized, and accessible.

#### Scenario: Asset SVGs are valid and carry a viewBox
- GIVEN any `.svg` file in `public/assets/design-system/`
- WHEN the markup is inspected
- THEN it MUST be well-formed XML
- AND the root `<svg>` element MUST include a `viewBox` attribute defining its coordinate system
- AND icon SVGs SHOULD use a consistent square `viewBox`

#### Scenario: Asset SVGs are optimized
- GIVEN any `.svg` file in `public/assets/design-system/`
- WHEN the markup is inspected
- THEN it MUST NOT contain editor metadata, comments, or tool artifacts (e.g. `<metadata>`, `data-figma-*`, Sketch/Illustrator namespaces)
- AND each icon file SHOULD be under 10KB

#### Scenario: Meaningful icons are labelled; decorative assets are hidden
- GIVEN an icon SVG that conveys meaning (e.g. `bell`, `gear`, `verified`)
- WHEN the markup is inspected
- THEN it MUST include either an `aria-label` with descriptive text OR a `role="img"` with a child `<title>`
- AND GIVEN the decorative checkerboard pattern SVG
- THEN it MUST include `aria-hidden="true"` and `role="presentation"`

**Acceptance Criteria:**
- All asset SVGs are well-formed XML with a `viewBox`
- No editor/tool metadata remains; icons are ≤10KB
- Meaningful icons carry accessible names; the decorative pattern is hidden from assistive tech

---

### Requirement: Extracted Colour Palette in DESIGN_SPECS.md
The colour palette MUST be derived from the SVG fills and documented in `docs/DESIGN_SPECS.md` as the raw
observed set, organized by semantic family, with every value traceable to the SVGs.

#### Scenario: DESIGN_SPECS.md documents the palette
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a colour-palette section listing the distinct fill colours observed in the SVGs
  (approximately 22–23 distinct six-digit hex values)
- AND each colour MUST be presented with its hex value and an observed usage/role label

#### Scenario: Palette covers all required families
- GIVEN the palette section
- WHEN its organization is inspected
- THEN it MUST group colours into at least these families:
  - **surface** (e.g. `#01030e`, `#10121c`, `#0e101a`, `#1a1a24`, `#1a1d2a`)
  - **neutral / border** (e.g. `#8a8f99`, `#9fa0a4`, `#3a3d45`)
  - **brand** (e.g. `#0088ff`, `#0077e6`, `#4cacff`)
  - **status** — the six gig statuses, with their colours (neutral, amber `#f59e0b`, blue `#3b82f6`, purple `#8b5cf6`, green `#10b981`/`#0cc671`, red `#ef4444`/`#ff383c`)
  - **tag / category** (e.g. pink `#f45fb1`, teal `#05c9e6`, orange `#f27c0d`)

#### Scenario: Palette values are real SVG fills (provenance)
- GIVEN any hex value documented in the palette section
- WHEN that hex is searched for in `screens/tokens.svg` or `screens/frames.svg`
- THEN it MUST be found as an actual fill value
- AND no documented colour may be invented, rounded, or carried over from a prior estimate if it does not appear in the SVGs

#### Scenario: Values are raw observed, not normalized
- GIVEN the palette section
- WHEN it is inspected
- THEN it MUST present the **observed** colours as-found
- AND it MUST NOT collapse near-duplicates or assign canonical scale names (e.g. `surface/level-0`) — normalization is deferred to `derive-design-system`

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` lists ~22–23 distinct observed fills grouped by family (surface, neutral, brand, status×6, tag/category)
- Every documented hex is grep-findable in the SVGs
- The section is explicitly labelled as observed/raw, not canonical

---

### Requirement: Extracted Radius Set in DESIGN_SPECS.md
The corner-radius set MUST be derived from the SVG `rx` geometry and documented in `docs/DESIGN_SPECS.md` as
the raw observed set.

#### Scenario: DESIGN_SPECS.md documents the radius set
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a radius section listing the distinct `rx` values observed in the SVGs
- AND the documented set MUST span the observed 2–18px range, including at minimum: `2, 2.5, 3, 3.5, 4, 4.5, 5, 8, 11, 12, 13, 16, 18`

#### Scenario: Radius values are real SVG geometry (provenance)
- GIVEN any radius value documented in the radius section
- WHEN `rx="<value>"` is searched for across `screens/tokens.svg` and `screens/frames.svg`
- THEN it MUST be found
- AND each documented radius SHOULD note an example component/context where it occurs

#### Scenario: Radii are raw observed, not normalized
- GIVEN the radius section
- WHEN it is inspected
- THEN it MUST present the observed values as-found and MUST NOT pre-collapse them into a canonical scale
  (canonicalization is deferred to `derive-design-system`)

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` lists the observed radius set spanning 2–18px
- Every documented radius is grep-findable as an `rx` in the SVGs
- The set is presented as observed, not canonical

---

### Requirement: Measured Component Geometry in DESIGN_SPECS.md
Per-component geometry MUST be measured from SVG coordinates and documented in `docs/DESIGN_SPECS.md`, with
no estimated values.

#### Scenario: Geometry is documented per library component
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a measured-geometry section covering the library components present in the SVGs,
  including at minimum: the sidebar (expanded and collapsed), the topbar, GigCard, button, input, tabs,
  filter, tag / category tag, status badge and status dot, rating, avatar, and view-toggle
- AND for each component it MUST record the measurable values among: outer dimensions, internal paddings,
  gaps between elements, border widths, and icon sizes

#### Scenario: Values are measured from coordinates, not estimated
- GIVEN any geometry value documented for a component
- WHEN its provenance is inspected
- THEN it MUST be derived from SVG coordinates (e.g. element `x`/`y`/`width`/`height`, or the delta between
  two coordinates), with a source hint recorded
- AND the section MUST state that values are measured, not estimated

#### Scenario: Unmeasurable values are flagged, not guessed
- GIVEN a property that cannot be determined from the SVG coordinates (e.g. a hover-only state, or a value
  obscured by an outlined glyph)
- WHEN it is documented
- THEN it MUST be explicitly flagged as not measurable from the SVGs (and routed to the residual-gap list if
  it requires another source)
- AND it MUST NOT be filled in with an estimated number

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` documents measured geometry for each named library component
- Each value carries a coordinate-based provenance hint
- Unmeasurable properties are flagged explicitly, never estimated

---

### Requirement: 1440px Reference Renders as the Fidelity Baseline
Reference renders of every library **component** MUST be produced from the SVGs at the 1440px reference width
and committed as the fidelity baseline. The SVGs contain the component library, **not** the 12 assembled
screens; assembled screen frames are staged as interim lossy baselines (from the JPGs) and recorded as a
Figma-sourced residual gap.

#### Scenario: Reference render directory exists
- GIVEN the change is implemented
- WHEN the file system is inspected
- THEN a `docs/design-system/reference-renders/` directory MUST exist
- AND it MUST contain `components/` and `frames/` subdirectories

#### Scenario: Assembled screen frames are staged (interim) and flagged as a Figma gap
- GIVEN the SVGs contain the component library, NOT the 12 assembled screens
- WHEN `docs/design-system/reference-renders/frames/` is inspected
- THEN it MUST contain an interim baseline per screen, sourced from the lossy `screens/*.jpg`
- AND a `README.md` there MUST state these are lossy and that high-fidelity per-screen frames must be exported from Figma
- AND the residual-gap list MUST record assembled screen frames as a Figma-sourced gap

#### Scenario: Every library component is rendered
- GIVEN the components in `screens/tokens.svg`
- WHEN `docs/design-system/reference-renders/components/` is inspected
- THEN it MUST contain a PNG render (full sheet and/or per-component crops) covering every library component
- AND renders MUST be at the 1440px reference fidelity (frames rendered to a 1440px-wide reference)

#### Scenario: Renders are valid raster images
- GIVEN any file under `docs/design-system/reference-renders/`
- WHEN it is inspected
- THEN it MUST be a valid PNG image with non-zero dimensions

**Acceptance Criteria:**
- `docs/design-system/reference-renders/{components,frames}/` exist and are populated
- Component renders cover the full library and are derived **from the SVGs** (valid non-empty PNGs at 1440px reference fidelity)
- An interim baseline per screen is staged from the JPGs (lossy), with a README flagging high-fidelity screen frames as a Figma gap

---

### Requirement: Explicit Residual-Gap List
`docs/DESIGN_SPECS.md` MUST contain an explicit, actionable list of everything the SVGs cannot supply, with
each item routed to Figma / Dev Mode.

#### Scenario: Residual-gap section exists and covers the known categories
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a "Residual Gaps" section
- AND it MUST cover at least these categories:
  - **Raster banner art** — the cosmic banner imagery (the 2 `<image>` nodes in `frames.svg`), to be exported from Figma
  - **Semantic token names** — to be attached from a fresh Figma token export (the SVGs encode values, not names)
  - **Font metrics** — SF Compact + NKDy Mono (text is outlined to paths in the SVGs; zero `font-family` references), to be obtained from Figma/source + licence
  - **Assembled screen frames** — the 12 screen JPGs are NOT in the SVGs (only the component library is); high-fidelity per-screen frames must come from Figma (interim lossy JPG baselines staged)
  - **Icons absent from the SVGs** — `attach` (chat composer) and `eye` (auth) are not in the component SVGs
  - **Components absent from the SVGs** — any other component referenced by the redesign but not present in `tokens.svg`/`frames.svg`

#### Scenario: Each gap is specific and actionable
- GIVEN any entry in the Residual Gaps section
- WHEN it is read
- THEN it MUST state what is missing, why it cannot come from the SVGs, and the source it must come from
  (e.g. a Figma node, an exported raster, a font file + licence)

#### Scenario: Figma is used only for residual gaps
- GIVEN the extraction work
- WHEN the provenance of palette colours, radii, icon/logo/pattern assets, and component geometry is reviewed
- THEN those MUST all be sourced from the SVGs
- AND Figma / Dev Mode MUST NOT have been used to re-source any value the SVGs already encode

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` has a "Residual Gaps" section covering raster banner art, semantic token names, font metrics, and SVG-absent components
- Each gap names what is missing and its required source
- All SVG-recoverable substrate is sourced from the SVGs, not Figma

---

## Test Plan

This change ships assets, a documentation file, and reference renders — **no application code**. Validation
is by deterministic file/markup checks plus a manual fidelity review. Commands assume the repo root.

### Asset library checks
```bash
# Directory structure
ls -d public/assets/design-system/icons public/assets/design-system/brand public/assets/design-system/patterns

# Named icon set present
for n in dashboard my-gigs chats finances disputes search bell gear collapse send attach eye view-toggle verified status-dot; do
  test -f "public/assets/design-system/icons/$n.svg" && echo "OK  $n" || echo "MISSING  $n"
done

# Brand + pattern present
ls public/assets/design-system/brand/*.svg public/assets/design-system/patterns/*.svg

# Every asset has a viewBox and no editor cruft; icons are small
for f in $(find public/assets/design-system -name '*.svg'); do
  grep -q 'viewBox' "$f" || echo "NO viewBox: $f"
  grep -qiE 'data-figma|<metadata|sketch:|inkscape:' "$f" && echo "CRUFT: $f"
done
find public/assets/design-system/icons -name '*.svg' -size +10k   # expect: no output
```

### DESIGN_SPECS.md content + provenance checks
```bash
test -f docs/DESIGN_SPECS.md && echo "DESIGN_SPECS.md exists"

# Palette: a documented hex must actually exist in the SVGs (sample)
grep -qi '#0088ff' docs/DESIGN_SPECS.md && grep -qi '#0088ff' screens/tokens.svg && echo "palette provenance OK"

# Radius: a documented radius must exist as an rx in the SVGs (sample)
grep -q '18' docs/DESIGN_SPECS.md && grep -q 'rx="18"' screens/frames.svg && echo "radius provenance OK"

# Required sections present
grep -qiE 'residual gap' docs/DESIGN_SPECS.md && echo "residual-gap section present"
grep -qiE 'measured|geometry' docs/DESIGN_SPECS.md && echo "geometry section present"
```

### Reference render checks
```bash
ls -d docs/design-system/reference-renders/frames docs/design-system/reference-renders/components
# One render per screen frame + component renders, all non-empty PNGs
find docs/design-system/reference-renders -name '*.png' | wc -l   # expect: >= number of screen frames
find docs/design-system/reference-renders -name '*.png' -size 0   # expect: no output
file docs/design-system/reference-renders/frames/*.png | grep -c 'PNG image data'
```

### Manual fidelity review
1. Open each render under `reference-renders/frames/` beside the corresponding region of `screens/frames.svg`.
2. Confirm the render is faithful (it is the baseline future diffs are measured against).
3. Open a sample sliced icon beside its source crop and confirm it is identical, not redrawn.

### Residual-gap completeness review
1. Read the "Residual Gaps" section of `docs/DESIGN_SPECS.md`.
2. Confirm it lists raster banner art, semantic token names, font metrics, and any SVG-absent component.
3. Confirm each entry names what is missing and the source it must come from.
