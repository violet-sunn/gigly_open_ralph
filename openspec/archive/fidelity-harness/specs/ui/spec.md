# UI Specification Delta: fidelity-harness

This document contains specification changes for the `fidelity-harness` change.

Scope note: these requirements implement the **hard visual gate + generativity harness** (Fidelity DoD **F1** + the
generativity acceptance scaffold) — a calibrated, CI-blocking `pixelmatch`-based diff engine; a 1440px Playwright
capture of the catalogued surfaces; diff/side-by-side/50%-overlay artifacts; and a generativity scaffold that
assembles a novel kit-only screen and asserts zero off-system values. It ships **engine + capture + generativity +
tests + scripts only**. It **builds and proves the gate mechanism** (control passes, 4px offset fails, off-token
fails) and **retires the prior "F1 deferred" notes** (the harness now exists and runs). It does **not** enforce
≤1% against the existing reference renders — those are lossy/draft (`docs/design-system/reference-renders/frames/
README.md`), the type uses a substitute font, the banner raster is unexported, and the design is unlocked — so
per-screen ≤1%-vs-Figma enforcement is explicitly **deferred to Phase 2** (`compose-*`, gated on the design lock).

---

## ADDED Requirements

### Requirement: Calibrated Pixel-Diff Engine
The change MUST provide a `pixelmatch`-based diff engine that computes a differing-pixel ratio against a calibrated
threshold (≤ ~1%), with AA/colour tolerance and region masking, usable as a library and a CI-blocking CLI.

#### Scenario: Known-good control passes
- GIVEN a reference image and an identical candidate image
- WHEN the engine diffs them at the calibrated threshold
- THEN the differing-pixel ratio MUST be ≈ 0 (≤ `maxDiffRatio`) and the engine MUST report PASS (exit 0 via CLI)

#### Scenario: Injected 4px offset fails
- GIVEN a structured reference image and a candidate that is the same image shifted by 4px
- WHEN the engine diffs them
- THEN the differing-pixel ratio MUST exceed `maxDiffRatio` (~1%) and the engine MUST report FAIL (non-zero CLI exit)

#### Scenario: Threshold, AA tolerance, and masking are configurable
- GIVEN the engine's calibration config (`maxDiffRatio` ≤ 0.01, a pixelmatch colour `threshold`, `includeAA`, and a
  list of mask rectangles)
- WHEN a comparison is run with a masked region over an area that otherwise differs
- THEN pixels inside the mask MUST NOT count toward the ratio (dynamic regions are ignorable)
- AND the colour/AA tolerance MUST be applied so anti-aliased edge pixels do not inflate the ratio

**Acceptance Criteria:**
- The engine returns a differing-pixel ratio; control ≈ 0 (pass), 4px offset > threshold (fail)
- Threshold (≤1%), AA/colour tolerance, and region masking are configurable; CLI exits non-zero on failure

---

### Requirement: 1440px Surface Capture vs Reference Renders
The change MUST capture each catalogued surface at a 1440px viewport with seeded fixtures and run the diff engine vs
the reference renders, producing artifacts. Per-screen ≤1%-vs-Figma enforcement is deferred to Phase 2.

#### Scenario: Surfaces render at 1440px with seeded fixtures
- GIVEN the Playwright fidelity capture and the dev-only `component-workbench`
- WHEN it runs
- THEN it MUST render each catalogued surface (the `/workbench/*` pages and the composed screen) at a 1440px viewport
  with the seeded fixtures and capture a PNG per surface

#### Scenario: Captures are diffed vs the reference renders into artifacts
- GIVEN a captured surface and its mapped reference render (e.g. the composed screen vs
  `frames/specialist-dashboard.lossy.jpg`)
- WHEN the engine compares them
- THEN it MUST produce a differing-pixel ratio and emit diff/side-by-side/overlay artifacts for review

#### Scenario: Per-screen ≤1% enforcement is deferred and flagged
- GIVEN the reference frames are lossy/draft (frames README), the font is a substitute, the raster art is unexported,
  and the design is unlocked
- WHEN the verification scope is inspected
- THEN this change MUST NOT make the ≤1%-vs-Figma match a blocking assertion
- AND it MUST explicitly defer per-screen ≤1% enforcement to Phase 2 (`compose-*`, design-lock-gated), capturing
  real baselines then

**Acceptance Criteria:**
- A 1440px capture renders each surface with seeded fixtures and diffs vs the reference renders, emitting artifacts
- ≤1%-vs-Figma enforcement is deferred to Phase 2 and flagged (not a blocking assertion here)

---

### Requirement: Diff Artifacts (side-by-side + 50%-overlay)
The engine MUST emit human-reviewable artifacts for each comparison: a diff image, a side-by-side composite, and a
50%-overlay.

#### Scenario: Artifacts are emitted for a comparison
- GIVEN a comparison of two images
- WHEN the engine runs with an output directory
- THEN it MUST write a diff image (highlighting differing pixels), a side-by-side composite (actual | expected), and
  a 50%-overlay (actual blended 50% over expected) to that directory

**Acceptance Criteria:**
- diff + side-by-side + 50%-overlay artifacts are written to the output dir for a comparison

---

### Requirement: CI-Blocking Harness
The harness MUST be CI-blocking: `npm run fidelity` MUST run the deterministic gates and exit non-zero on any
failure, and the engine self-test MUST run in the unit suite, with the build and suite staying green.

#### Scenario: Failure blocks (non-zero exit)
- GIVEN a comparison whose differing-pixel ratio exceeds the threshold (or a generativity violation)
- WHEN `npm run fidelity` runs
- THEN it MUST exit non-zero (blocking CI)

#### Scenario: Control passes (zero exit) and is in the suite
- GIVEN a known-good control
- WHEN `npm run fidelity` and `npm run test:unit` run
- THEN `npm run fidelity` MUST exit 0 and the engine self-test (control passes / offset fails) MUST be part of the
  unit suite, which MUST stay green
- AND `npm run build` MUST pass and `npm run lint:tokens` MUST pass with no new baseline entries

**Acceptance Criteria:**
- `npm run fidelity` exits non-zero on failure, zero on a clean control; engine self-test runs in `test:unit`
- `npm run build` + `npm run test:unit` + `npm run lint:tokens` (unchanged baseline) green

---

### Requirement: Generativity Scaffold
The change MUST provide a generativity scaffold: a novel screen assembled purely from the kit, with an assertion of
zero off-system values, that a planted off-token value fails. This scaffolds the `prove-extensibility-admin` (#29)
proof.

#### Scenario: A novel kit-only screen has zero off-system values
- GIVEN an arbitrary screen (`app/workbench/screens/GenerativityProbe.tsx`, `@composed-screen`) assembled from
  `AppShell` + existing blocks + fixtures — not one of the reference screens
- WHEN `npm run lint:generativity` runs
- THEN it MUST PASS: the screen imports only kit modules + fixtures, contains no `className`/`style`, and introduces
  no off-token literal (it passes `lint:composition` + `lint:tokens`) — zero off-system values

#### Scenario: A planted off-system value fails the gate
- GIVEN an off-token literal (e.g. a raw hex) or an off-system `className`/import planted in the generativity probe
- WHEN `npm run lint:generativity` runs
- THEN it MUST FAIL (non-zero), identifying the off-system value

#### Scenario: Scaffold is the basis for the admin generativity proof
- GIVEN the generativity scaffold
- WHEN its purpose is inspected
- THEN it MUST be documented as the scaffold that `prove-extensibility-admin` (#29) extends to the full admin proof
  (assemble admin screens from the kit with zero new system entities) — this change ships the scaffold, not the proof

**Acceptance Criteria:**
- A novel kit-only `@composed-screen` passes `lint:generativity` (zero off-system values)
- A planted off-token/off-system value fails it; the scaffold is documented for `prove-extensibility-admin`

---

## Test Plan

This change ships an engine + capture spec + generativity gate + tests + scripts. Validation is by deterministic
commands. Commands assume the repo root.

### Engine + scripts present; dep pinned
```bash
test -f scripts/design-system/fidelity-diff.js && test -f scripts/design-system/validate-generativity.js && echo "engine + generativity gate present"
test -f __tests__/e2e/fidelity.spec.ts && test -f __tests__/unit/fidelity-harness.test.ts && echo "capture spec + engine self-test present"
node -e "const s=require('./package.json').scripts; if(s.fidelity && s['lint:generativity']) console.log('OK scripts'); else { console.log('CHECK scripts'); process.exit(1);} "
node -e "const d=require('./package.json').devDependencies; if(/\^?5\./.test(d.pixelmatch||'')) console.log('OK pixelmatch@^5 (CJS)'); else console.log('CHECK pixelmatch version', d.pixelmatch)"
```

### Engine: control passes, 4px offset fails, artifacts emitted (deterministic)
```bash
npx vitest run __tests__/unit/fidelity-harness.test.ts 2>&1 | tail -8
# expect: control ratio ~0 (pass), 4px-offset ratio > maxDiffRatio (fail), diff/side-by-side/overlay files written
```

### CI-blocking harness
```bash
npm run fidelity && echo "fidelity gate PASS (control + generativity)"
# a forced over-threshold comparison or planted off-token must make the gate exit non-zero (see negative tests below)
```

### Generativity scaffold: zero off-system; planted off-token fails
```bash
grep -q '@composed-screen' app/workbench/screens/GenerativityProbe.tsx && echo "probe is a composed screen"
npm run lint:generativity && echo "generativity PASS (zero off-system values)"
# plant an off-token, expect failure, then revert
node -e "const fs=require('fs');const p='app/workbench/screens/GenerativityProbe.tsx';const t=fs.readFileSync(p,'utf8');fs.writeFileSync(p,t.replace('@composed-screen','@composed-screen */\nconst PLANTED=\"#ff00ff\"; /*'))"
npm run lint:generativity && echo "CHECK planted off-token accepted" || echo "OK planted off-token fails generativity"
git checkout -- app/workbench/screens/GenerativityProbe.tsx 2>/dev/null || true
```

### 1440px capture renders surfaces (apparatus; ≤1%-vs-Figma deferred)
```bash
grep -qE '1440' __tests__/e2e/fidelity.spec.ts && echo "capture sets 1440px viewport"
grep -qiE 'workbench|registry' __tests__/e2e/fidelity.spec.ts && echo "capture iterates the catalogued surfaces"
grep -qiE 'phase 2|deferred|design lock|lossy' __tests__/e2e/fidelity.spec.ts && echo "per-screen ≤1%-vs-Figma deferral noted"
# full browser capture runs under: npm run test:e2e (heavier; produces artifacts)
```

### Token purity + build + suite + scope
```bash
npm run lint:tokens && git diff --quiet scripts/design-system/token-purity-baseline.json && echo "token-purity PASS, baseline unchanged"
npm run lint:composition && echo "composition PASS (probe is a clean composed screen)"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
git status --porcelain | grep -E 'components/(primitives|blocks|layout|templates)/.+\.(ts|tsx)$|MainNav|\(protected\)/layout.tsx' && echo "CHECK kit/legacy modified" || echo "OK kit + legacy untouched"
```

### Manual review
1. Run `npm run fidelity` — confirm the engine control passes, an over-threshold/offset case fails, and the
   generativity gate passes (and fails on a planted off-token).
2. Run `npm run test:e2e` (or the fidelity project) — confirm surfaces render at 1440px and diff/side-by-side/
   overlay artifacts are produced vs the reference renders.
3. Confirm the proposal/spec flag that ≤1%-vs-Figma enforcement is Phase-2 (design-lock), retiring the prior
   "F1 deferred" notes by delivering the running gate.
