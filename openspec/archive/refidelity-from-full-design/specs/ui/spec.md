# Spec delta — ui (refidelity-from-full-design)

Turns on the deferred **F1 ≤1% visual-fidelity gate** as a self-referential golden-image regression check (every screen
+ component, both themes), re-baselines the human F1 reference to the `gigly_full_design` prototype, and re-proves
generativity in both themes. Closes the reground (Phase 4).

## ADDED Requirements

### Requirement: F1 ≤1% Visual-Fidelity Gate (Golden-Image Regression)
The project MUST provide a fidelity gate (`npm run test:fidelity`) that, for every gated **surface** in **both themes**
(dark + light) at **1440px**, captures the live render and compares it to a committed **golden baseline** via the
`fidelity-diff.js` engine, asserting the differing-pixel **ratio ≤ 0.01 (≤1%)** (AA/colour tolerance, dynamic regions
masked). When a golden is absent (or `--update` is passed) the gate MUST write the golden instead of failing. The gate
MUST emit the F1 artifacts — `diff.png`, `side-by-side.png`, and `overlay-50.png` — for any compared surface. Goldens are
environment-pinned to the project's Playwright Chromium. The gated surfaces MUST include every screen route and every
workbench component surface.

#### Scenario: A matching render passes the ≤1% gate
- GIVEN a committed golden for a surface×theme
- WHEN the live render is captured and diffed
- THEN the differing-pixel ratio MUST be ≤ 1% and the gate MUST pass, emitting the diff/side-by-side/overlay-50 artifacts

#### Scenario: An injected offset is caught
- GIVEN the fidelity engine and a deliberately offset render (the synthetic 4px-shift case)
- WHEN it is diffed against its baseline
- THEN the ratio MUST exceed 1% and the gate MUST FAIL (drift detected)

#### Scenario: Every screen + component surface is gated in both themes
- GIVEN the gate's surface manifest
- THEN it MUST cover every screen route and every `/workbench/*` component surface, each captured in dark AND light

### Requirement: Human F1 Reference Re-Baselined to the Prototype
The workbench registry `reference` baselines MUST point at the `gigly_full_design` prototype imagery
(`screenshots/` / Развёртка) as the **human** F1 overlay/calibration reference (replacing the stale interim lossy JPGs).
The registry coverage test MUST keep asserting that every `reference` file exists. The prototype imagery is NOT the
automated pixel target (that is the golden set).

#### Scenario: References resolve to the prototype imagery and exist
- GIVEN the registry catalog
- THEN every entry's `reference` MUST resolve to a `gigly_full_design`-derived prototype image that exists on disk
- AND the coverage test MUST pass

### Requirement: Generativity Re-Proven in Both Themes
`validate-generativity` MUST pass over the `GenerativityProbe` + the admin screens + the expanded kit — asserting **zero
off-system values** (composition-purity: no `className`/`style`/non-kit imports in the marked screens; token-purity: no
off-token literals). Because the probe/admin are token-driven (F2), the proof MUST hold in **both** themes; this MUST be
verified by capturing the probe golden in light AND dark.

#### Scenario: Admin generativity = zero off-system values in both themes
- GIVEN `validate-generativity` over the probe + admin screens
- THEN composition-purity + token-purity MUST pass (zero off-system values)
- AND the probe MUST render cleanly in both dark and light (token-driven), captured as goldens

#### Scenario: A planted off-token literal fails the proof
- GIVEN a planted hex/rgb literal in a kit source
- WHEN `lint:tokens` runs
- THEN it MUST report a new (non-baselined) violation and FAIL

### Requirement: The F1 Deferral Is Closed
The `DESIGN_SYSTEM_SPEC.md` §10.x notes that deferred "the absolute ≤1% pixel gate to Phase 4" MUST be updated to record
the gate as live (the self-referential golden regression), and the Phase-4 planning item MUST be checked.

#### Scenario: Docs reflect the live gate
- GIVEN the reconciliation notes + the planning doc
- THEN they MUST state the F1 ≤1% gate is live (golden-image regression; prototype = human overlay reference) and Phase 4
  is complete

**Acceptance Criteria:**
- `npm run test:fidelity` gates every screen + workbench surface in dark + light at 1440px at ≤1% vs committed goldens (via `fidelity-diff.js`), emitting diff/side-by-side/overlay-50; `--update` (re)writes goldens; dynamic regions masked
- known-good control passes; the injected 4px offset fails; a planted off-token literal fails `lint:tokens`
- registry `reference` re-baselined to the `gigly_full_design` prototype imagery (human overlay reference); coverage test green
- `validate-generativity` = zero off-system values; the probe holds in both themes (goldens)
- the §10.x ≤1%-deferral notes flipped to "gate live"; Phase-4 planning item checked; `build` + `test:unit` + lints stay green
