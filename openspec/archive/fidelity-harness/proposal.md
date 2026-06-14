# Change Proposal: fidelity-harness

> Phase 0, change 9 (final) of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It is the **hard visual gate + generativity harness**: the calibrated, CI-blocking pixel-diff engine that turns
> "looks close" into measured convergence (Fidelity DoD **F1**), plus the scaffold for the system-level
> **generativity** acceptance. It consumes the `component-workbench` registry (entity → reference baseline →
> renderable story) and **retires the "F1 deferred" notes** accumulated across layout-grammar, ui-primitives,
> domain-blocks, and component-workbench.

## Problem Statement

The mechanism is built (tokens → layout grammar → primitives → blocks → workbench), and every prior Phase-0 change
verified F2 (token-purity) and F5 (composition) but **explicitly deferred F1 (the pixel-diff) to this change**.
Today:

- There is **no pixel-diff gate**: nothing renders a surface and measures how far it is from a reference. "Fidelity"
  is asserted by eye, which is exactly the regression toward parody the mechanism exists to prevent.
- There is **no generativity gate**: nothing proves a *novel* screen can be assembled from the kit with **zero
  off-system values** — the system-level acceptance the whole plan hinges on (`prove-extensibility-admin`, #29).
- The CI surface (`lint:tokens`, `lint:composition`, the unit suite) covers structure but not **visual** regression.

This change wires the gate. **One reality must be stated plainly:** the existing reference renders are **not
pixel-accurate**. `docs/design-system/reference-renders/frames/README.md` says so directly ("Do not treat these
JPGs as pixel-accurate fidelity baselines"); they are lossy JPGs pending high-fidelity Figma export, the type uses a
**substitute font** (Inter, not SF Compact — `typography-system`), the cosmic banner raster is unexported, and the
design itself is a **draft** (the standing plan-only gate). So enforcing ≤1% against them is impossible now. This
change therefore **builds and proves the gate mechanism**, and **scopes the per-screen ≤1%-vs-Figma enforcement to
Phase 2** (when the design locks and real frames/fonts/raster land) — exactly as the frames README and the
plan-only gate dictate.

## Proposed Solution

Ship a calibrated, CI-blocking **pixel-diff engine** proven self-referentially, a **1440px surface-capture
apparatus**, the **diff artifacts**, and a **generativity scaffold**. Five deliverable groups:

1. **Pixel-diff engine + calibration** (`scripts/design-system/fidelity-diff.js`) — a `pixelmatch`-based
   comparator: `diff(actualPng, expectedPng, opts) → { ratio, diffImage }` with a calibrated threshold
   (`maxDiffRatio ≤ 0.01` = ~1% differing pixels), **AA/colour tolerance** (pixelmatch `threshold` + `includeAA`),
   and **region masking** (rectangles zeroed in both images before diffing, for dynamic regions). Pure Node
   (`pixelmatch` + `sharp` for image I/O — `sharp` already present). Importable as a lib **and** runnable as a CLI
   that exits non-zero when `ratio > maxDiffRatio` (CI-blocking).

2. **1440px surface capture** (`__tests__/e2e/fidelity.spec.ts`, Playwright) — renders each catalogued surface
   (the `component-workbench` `/workbench/*` pages + the composed screen) at a **1440px** viewport with the
   **seeded fixtures**, captures a PNG, and runs the engine vs the available reference render — emitting artifacts
   for human review. The webServer already runs `npm run dev`, so the dev-only workbench renders. **The per-screen
   ≤1%-vs-Figma blocking assertion is Phase-2** (capped by the lossy/draft references + substitute fonts +
   unexported raster); this change provides the rendering + diff apparatus and proves it runs.

3. **Diff artifacts** — the engine emits, per comparison, a **diff image**, a **side-by-side** composite (actual |
   expected), and a **50%-overlay** (actual blended 50% over expected) to an output dir, via `sharp`.

4. **CI-blocking harness** (`npm run fidelity`) — orchestrates the **deterministic** gates (the engine self-check +
   the generativity gate) and exits non-zero on any failure; the engine self-test also runs in the unit suite. This
   is the env-independent hard gate (no browser/cross-OS screenshot flakiness in the blocking path).

5. **Generativity scaffold** (`scripts/design-system/validate-generativity.js` + `lint:generativity`, and an
   arbitrary kit-only screen `app/workbench/screens/GenerativityProbe.tsx`) — assembles a **novel** screen (one with
   no mock) purely from the kit (`AppShell` + existing blocks + fixtures, `@composed-screen`) and asserts **zero
   off-system values**: it passes `lint:composition` (kit-only imports, no `className`/`style`) **and** `lint:tokens`
   (no off-token literals). A planted off-token value **fails** the gate. This is the scaffold
   `prove-extensibility-admin` (#29) builds the full admin proof on.

**The acceptance is self-validating and deterministic** (per the task): the engine **passes a known-good control**
(an image vs itself → ratio 0), **fails an injected 4px offset** (a structured image vs its 4px-shifted copy → ratio
≫ threshold), and the generativity/token gate **fails a planted off-token value**. None of these depend on matching
the lossy/draft Figma frames, so the gate is real and CI-blocking now while the per-screen enforcement waits for the
design lock.

This change emits **a diff engine + a capture spec + a generativity gate + tests + scripts only**. It does **not**
enforce ≤1% against the (lossy/draft) reference renders (Phase-2, design-lock-gated), build the full per-screen
baseline set (Phase-2 `compose-*`), perform the full admin generativity *proof* (`prove-extensibility-admin` #29),
add Phase-1 data, or change any token/primitive/block/template/legacy code.

## Constraints

### MUST Requirements
- A `pixelmatch`-based diff engine MUST exist that returns a differing-pixel **ratio**, supports a **calibrated
  threshold** (`maxDiffRatio ≤ 0.01`), **AA/colour tolerance**, and **region masking**, and is runnable as a
  CI-blocking CLI (non-zero exit when `ratio > maxDiffRatio`).
- The engine MUST **pass a known-good control** (image vs itself, ratio ≈ 0) and **fail an injected 4px offset**
  (structured image vs its 4px-shifted copy, ratio > threshold), verified by a deterministic test.
- The engine MUST emit **diff + side-by-side + 50%-overlay** artifacts for a comparison.
- A Playwright capture MUST render each catalogued surface at **1440px** with seeded fixtures and run the engine vs
  the reference renders, producing artifacts. (Per-screen ≤1%-vs-Figma enforcement is deferred to Phase 2 and MUST
  be flagged.)
- A generativity scaffold MUST assemble a novel kit-only screen (`@composed-screen`) and assert **zero off-system
  values** (passes `lint:composition` + `lint:tokens`); a **planted off-token value MUST fail** it.
- `npm run fidelity` MUST run the deterministic gates and exit non-zero on failure; `npm run build` and
  `npm run test:unit` MUST stay green; `npm run lint:tokens` MUST pass with **no new baseline entries**.

### SHOULD Requirements
- The threshold + tolerance + mask SHOULD be a single named config (`maxDiffRatio`, `threshold`, `includeAA`, masks)
  so Phase-2 baselines reuse one calibration.
- The harness SHOULD keep the **blocking** path env-independent (engine self-test on synthetic images + the lints) to
  avoid cross-OS browser-screenshot flakiness; the 1440px browser capture SHOULD be runnable apparatus, not a
  flaky blocking baseline yet.
- The capture SHOULD reuse the `component-workbench` registry (entity → reference → renderable) as the iteration
  source, so the same surfaces the catalog documents are the ones diffed.
- Generated artifacts SHOULD write to a dedicated output dir (e.g. `docs/design-system/fidelity/out/`) that SHOULD be
  git-ignored.

### Non-Goals
- **No ≤1%-vs-Figma enforcement.** The references are lossy/draft (frames README), fonts are substituted, raster art
  is unexported, the design is unlocked — real per-screen matching is Phase 2 (`compose-*`), gated on the design
  lock. This change proves the gate; it does not pass the (impossible-yet) screen match.
- **No committed cross-environment baselines as a hard gate** (browser screenshots differ per OS) — Phase-2 commits
  real baselines in a matched runner once the design locks.
- **No full admin generativity proof** (`prove-extensibility-admin` #29) — this is the *scaffold* only.
- **No new tokens/primitives/blocks/templates; no Phase-1 data; no legacy/shell/route changes** beyond the dev-only
  `GenerativityProbe` and the harness scripts/tests.

## Success Criteria

1. The pixel-diff engine exists, is calibrated (≤1% threshold, AA tolerance, masking), and runs as a CI-blocking CLI.
2. The engine passes a known-good control and fails an injected 4px offset (deterministic test); diff + side-by-side
   + 50%-overlay artifacts are produced.
3. A 1440px Playwright capture renders each surface with seeded fixtures and runs the engine vs the reference
   renders, emitting artifacts; ≤1%-vs-Figma enforcement explicitly deferred to Phase 2.
4. The generativity scaffold composes a novel kit-only screen with zero off-system values; a planted off-token
   value fails `lint:generativity`.
5. `npm run fidelity` is CI-blocking (non-zero on failure); `npm run build`, `npm run test:unit`, `npm run
   lint:tokens` (unchanged baseline), `npm run lint:composition` all green; no kit/legacy changes.

## Affected Areas

- `scripts/design-system/fidelity-diff.js` (new — pixelmatch+sharp engine: diff + threshold/AA/mask + artifacts; lib + CLI)
- `scripts/design-system/validate-generativity.js` (new — generativity gate)
- `app/workbench/screens/GenerativityProbe.tsx` (new — arbitrary kit-only `@composed-screen`)
- `__tests__/e2e/fidelity.spec.ts` (new — 1440px surface capture + vs-reference artifacts; Phase-2 enforcement flagged)
- `__tests__/unit/fidelity-harness.test.ts` (new — engine control/offset/mask/artifacts, deterministic)
- `package.json` (new devDep `pixelmatch`; scripts `fidelity`, `lint:generativity`), `.gitignore` (artifacts out dir)
- read-only inputs: `app/workbench/registry.tsx`, `docs/design-system/reference-renders/`, the kit, the canonical tokens
- `openspec/specs/ui/spec.md` (spec delta)
- (NOT modified: any token/primitive/block/template/legacy file; `app/(protected)/layout.tsx`)

## Risks & Mitigations

**Risk**: The reference renders are lossy/draft + fonts are substitutes → a real ≤1% match is impossible, so a
naive "diff vs reference" gate would always fail (or be meaningless).
**Mitigation**: Make the **blocking** acceptance self-referential (control/offset on images the harness controls) +
the token/generativity gate; treat the vs-Figma-frame diff as **informational artifact** output; defer ≤1%-vs-Figma
enforcement to Phase 2 (design-lock), per the frames README and the plan-only gate. The gate mechanism is real and
proven; the screen match is honestly Phase-2.

**Risk**: Browser screenshots differ across OS/CI → committed baselines flake and block spuriously.
**Mitigation**: Keep the hard, CI-blocking path **env-independent** (synthetic-image engine self-test + the lints).
The 1440px Playwright capture is runnable apparatus that emits artifacts; its baseline enforcement is Phase-2 in a
matched runner.

**Risk**: `pixelmatch` v6+ is ESM-only and would break the project's CommonJS `scripts/*.js`.
**Mitigation**: Pin `pixelmatch@^5` (CommonJS) so `require()` works in the existing script style; use `sharp`
(already present, CJS-compatible) for PNG/JPG I/O + composites — no `pngjs`/`canvas` needed.

**Risk**: A 4px shift of a flat image barely differs, making the "offset fails" test unreliable.
**Mitigation**: The control image is **structured** (a high-contrast checkerboard/striped raw buffer) so a 4px shift
flips a large pixel fraction (ratio ≫ 1%); the test asserts `controlRatio ≈ 0` and `offsetRatio > maxDiffRatio`.

**Risk**: The generativity gate duplicates the existing lints.
**Mitigation**: `validate-generativity.js` *orchestrates* `lint:tokens` + `lint:composition` over the kit-only probe
+ asserts the probe exists and is `@composed-screen` — "zero off-system values" = both lints green; the planted
off-token reuses `lint:tokens`'s new-violation failure. No lint logic is re-implemented.

**Risk**: Over-claiming that F1 is "done."
**Mitigation**: State precisely — F1 **the gate** is built, calibrated, CI-blocking, and proven; F1 **the per-screen
≤1%-vs-locked-Figma match** is Phase-2, gated on the design lock + Figma frames + fonts + raster. This *fulfils* the
prior changes' "deferred to fidelity-harness" (the harness now exists and runs) without claiming the blocked match.
