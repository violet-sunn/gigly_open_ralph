# Implementation Tasks: fidelity-harness

> **The hard visual gate + generativity harness (F1).** Build a calibrated, CI-blocking `pixelmatch` diff engine
> (threshold ≤1%, AA tolerance, masking) proven self-referentially (control passes / 4px offset fails); a 1440px
> Playwright capture of the catalogued surfaces vs the reference renders (artifacts only — ≤1%-vs-Figma deferred to
> Phase 2 per the lossy/draft frames README + design-lock); diff/side-by-side/50%-overlay artifacts; and a
> generativity scaffold (a novel kit-only screen + zero-off-system assertion; planted off-token fails). Engine +
> capture + generativity + tests + scripts only — no ≤1%-vs-Figma enforcement, no Phase-1 data, no kit/legacy edits.
> Retires the prior "F1 deferred" notes by delivering the running gate. Friction: low.

---

## Task 1: [x] Pixel-diff engine + calibration (`fidelity-diff.js`)

**Implementation Notes:**
- Add the dependency: `npm i -D pixelmatch@^5` (v5 is CommonJS — `require()`-able in the existing `scripts/*.js`;
  v6+ is ESM and would break them). `sharp` is already present for image I/O + composites; no `pngjs`/`canvas`.
- Create `scripts/design-system/fidelity-diff.js` (CommonJS) exporting:
  - `FIDELITY_CONFIG = { maxDiffRatio: 0.01, threshold: 0.15, includeAA: false }` (the single calibration).
  - `async diff(actualInput, expectedInput, opts) → { ratio, n, width, height, diffBuf }`: load both to raw RGBA via
    `sharp(...).ensureAlpha().raw().toBuffer({resolveWithObject:true})`, resize the candidate to the reference
    dimensions if they differ, **apply mask rectangles** (copy expected pixels into actual within each mask rect so
    they don't count), then `pixelmatch(actual, expected, diffBuf, w, h, { threshold, includeAA })`; `ratio = n/(w*h)`.
  - `async writeArtifacts({actualInput, expectedInput, diffBuf, width, height, outDir})`: write `diff.png` (sharp from
    `diffBuf` raw), `side-by-side.png` (a `2w×h` canvas with actual at x=0 + expected at x=w), and `overlay-50.png`
    (expected as base, actual composited at 50% alpha).
- CLI: `node fidelity-diff.js <actual> <expected> [outDir]` → diff + artifacts + print ratio + `process.exit(ratio > maxDiffRatio ? 1 : 0)`; and a `--selfcheck [outDir]` mode (Task 5).

**Test Plan:**
```bash
test -f scripts/design-system/fidelity-diff.js && echo "OK engine"
node -e "const d=require('./package.json').devDependencies; console.log('pixelmatch', d.pixelmatch)"  # expect ^5.x
node -e "const e=require('./scripts/design-system/fidelity-diff.js'); console.log(typeof e.diff, typeof e.writeArtifacts, e.FIDELITY_CONFIG.maxDiffRatio)"
```
Expected: engine exports `diff`/`writeArtifacts`/`FIDELITY_CONFIG`; pixelmatch pinned to ^5 (CJS).

---

## Task 2: [x] Engine self-test — control passes, 4px offset fails, mask works, artifacts (deterministic)

**Implementation Notes:**
- Add `__tests__/unit/fidelity-harness.test.ts` (node project — fs/sharp/pixelmatch, no browser). Synthesize a
  **structured** image as a raw RGBA buffer (e.g. a high-contrast 64×64 checkerboard, 8px cells) and a **4px-shifted**
  variant (phase the checker by 4px). Write both to temp PNGs via `sharp(buf,{raw:{width,height,channels:4}}).png()`.
  - **Control:** `diff(base, base)` → `ratio ≤ FIDELITY_CONFIG.maxDiffRatio` (pass).
  - **Offset:** `diff(base, shifted)` → `ratio > FIDELITY_CONFIG.maxDiffRatio` (fail) — the 4px shift of an 8px
    checker flips a large pixel fraction.
  - **Mask:** `diff(base, shifted, { masks: [whole-image rect] })` → `ratio ≤ maxDiffRatio` (masked region ignored).
  - **Artifacts:** `writeArtifacts({...})` → assert `diff.png`, `side-by-side.png`, `overlay-50.png` exist and are
    valid PNGs (`sharp(file).metadata()`), with `side-by-side` width = 2×base width.
- Write outputs under a temp dir (e.g. `__tests__/.tmp/fidelity/`).

**Test Plan:**
```bash
npx vitest run __tests__/unit/fidelity-harness.test.ts 2>&1 | tail -8
```
Expected: control ratio ≈ 0 (pass), 4px-offset ratio > maxDiffRatio (fail), mask zeroes the diff, 3 artifacts written.

---

## Task 3: [x] Generativity scaffold — novel kit-only screen + zero-off-system gate

**Implementation Notes:**
- Create `app/workbench/screens/GenerativityProbe.tsx`: `/* @composed-screen */` + `"use client"`, an **arbitrary
  novel** screen (NOT one of the 12 references) composed only from `@/app/components/templates/AppShell` + existing
  blocks (e.g. SidebarNav collapsed, Topbar, FilterBar, StatPanel, GigCard·list, ClientCard) + `@/app/components/
  blocks/fixtures`, arranged via layout-primitive props — **no `className`/`style`**.
- Create `app/workbench/generativity/page.tsx` (dev-only route under the workbench layout) rendering
  `<GenerativityProbe />` so it is renderable + Playwright-capturable. (New file; does not touch archived workbench.)
- Create `scripts/design-system/validate-generativity.js`: assert `GenerativityProbe.tsx` exists and contains
  `@composed-screen`; then run the existing `validate-composition.js` + `validate-token-purity.js` (via
  `child_process`) — "zero off-system values" = both PASS. Exit non-zero if the probe is missing/uncomposed or either
  lint fails. Add `"lint:generativity": "node scripts/design-system/validate-generativity.js"` to `package.json`.
- Add `__tests__/unit/components/generativity.test.tsx` (jsdom) rendering `<GenerativityProbe />` from fixtures and
  asserting it assembles (e.g. a GigCard "К проекту" CTA + a StatPanel stat appear).

**Test Plan:**
```bash
grep -q '@composed-screen' app/workbench/screens/GenerativityProbe.tsx && echo "probe marked"
grep -E '\b(className|style)\s*=' app/workbench/screens/GenerativityProbe.tsx && echo "CHECK styling" || echo "OK no styling"
npm run lint:generativity && echo "generativity PASS (zero off-system)"
npx vitest run __tests__/unit/components/generativity.test.tsx 2>&1 | tail -4
# planted off-token fails:
node -e "const fs=require('fs');const p='app/workbench/screens/GenerativityProbe.tsx';fs.writeFileSync(p, fs.readFileSync(p,'utf8').replace('\"use client\";','\"use client\";\nconst _x = \"#abcdef\";'))"
npm run lint:generativity && echo "CHECK planted accepted" || echo "OK planted off-token fails"
node -e "const fs=require('fs');const p='app/workbench/screens/GenerativityProbe.tsx';fs.writeFileSync(p, fs.readFileSync(p,'utf8').replace('\nconst _x = \"#abcdef\";',''))"
```
Expected: probe is a clean composed screen; `lint:generativity` passes; render test passes; planted off-token fails.

---

## Task 4: [x] 1440px surface capture (Playwright) + vs-reference artifacts

**Implementation Notes:**
- Create `__tests__/e2e/fidelity.spec.ts` (Playwright; webServer already runs `npm run dev`, so the dev-only
  `/workbench` renders). Set a **1440px** viewport (`page.setViewportSize({ width: 1440, height: 1024 })`), iterate
  the catalogued surfaces (`/workbench`, `/workbench/{tokens,primitives,blocks,templates,layout,screens}`,
  `/workbench/generativity`), capture `page.screenshot()` to `docs/design-system/fidelity/out/captures/`, and for the
  composed screen run `diff()` vs `docs/design-system/reference-renders/frames/specialist-dashboard.lossy.jpg`,
  writing artifacts via `writeArtifacts`.
- **Do NOT assert ≤1%-vs-Figma** — add a top-of-file comment that per-screen enforcement is **deferred to Phase 2**
  (lossy/draft frames per the frames README + substitute fonts + unexported raster + unlocked design); assert only
  that surfaces render at 1440px and artifacts are produced.

**Test Plan:**
```bash
test -f __tests__/e2e/fidelity.spec.ts && echo "OK capture spec"
grep -q '1440' __tests__/e2e/fidelity.spec.ts && echo "1440px viewport"
grep -qiE 'phase 2|deferred|design lock|lossy' __tests__/e2e/fidelity.spec.ts && echo "deferral flagged"
# full run (heavier, needs browser): npm run test:e2e -- fidelity
```
Expected: capture spec renders surfaces at 1440px, diffs the composed screen vs its lossy frame into artifacts; ≤1%
enforcement deferred.

---

## Task 5: [x] CI-blocking orchestrator + scripts + gitignore

**Implementation Notes:**
- Add `--selfcheck [outDir]` to `fidelity-diff.js`: generate the checkerboard control + 4px-offset internally, assert
  `control.ratio ≤ maxDiffRatio` AND `offset.ratio > maxDiffRatio`, write artifacts, and `exit(0)` iff the gate
  behaves (else `exit(1)`) — the env-independent proof that the gate works.
- Add scripts: `"fidelity": "node scripts/design-system/fidelity-diff.js --selfcheck && npm run lint:generativity"`
  (the deterministic, CI-blocking gate: engine self-check + generativity). Keep the browser capture under
  `npm run test:e2e`.
- Add the artifacts output dir to `.gitignore` (e.g. `docs/design-system/fidelity/out/`).

**Test Plan:**
```bash
npm run fidelity && echo "fidelity gate PASS (control + offset + generativity)"
node scripts/design-system/fidelity-diff.js --selfcheck && echo "selfcheck exit 0"
grep -q 'fidelity/out' .gitignore && echo "artifacts gitignored"
```
Expected: `npm run fidelity` runs the engine self-check + generativity and exits 0 on a clean tree (non-zero on failure).

---

## Task 6: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec delta's Test Plan (engine present + dep pinned, engine self-test,
  fidelity gate, generativity + planted-off-token, 1440px capture present, token-purity unchanged baseline,
  composition, build, unit suite).
- Confirm scope: **engine + capture + generativity + tests + scripts only** — no ≤1%-vs-Figma enforcement (deferred),
  no Phase-1 data, no kit/legacy edits (`components/{primitives,blocks,layout,templates}` `.tsx` unchanged; `MainNav`
  + shell unchanged), no admin generativity *proof* (#29). Confirm the prior "F1 deferred" notes are now satisfied by
  the running gate.

**Test Plan:**
```bash
npm run fidelity && echo "fidelity gate green"
npm run lint:tokens && git diff --quiet scripts/design-system/token-purity-baseline.json && echo "token-purity PASS, baseline unchanged"
npm run lint:composition && echo "composition PASS"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
git status --porcelain | grep -E 'components/(primitives|blocks|layout|templates)/.+\.(ts|tsx)$|MainNav|\(protected\)/layout.tsx' && echo "CHECK kit/legacy modified" || echo "OK kit + legacy untouched"
```
Expected: all gates green; baseline unchanged; kit + legacy untouched; ≤1%-vs-Figma deferred to Phase 2.

---

## Summary

Total tasks: 6
Estimated effort: 5–8 hours (friction: low — reuses Playwright, sharp, the lints, and the workbench registry; one
small new dep)

**Deliverables:**
- ✅ `scripts/design-system/fidelity-diff.js` — calibrated pixelmatch engine (threshold ≤1%, AA tolerance, masking) +
  diff/side-by-side/50%-overlay artifacts; lib + CLI + `--selfcheck`.
- ✅ `__tests__/unit/fidelity-harness.test.ts` — control passes, 4px offset fails, mask works, artifacts emitted (deterministic).
- ✅ Generativity scaffold: `GenerativityProbe.tsx` (novel kit-only `@composed-screen`) + `/workbench/generativity`
  route + `validate-generativity.js` + `lint:generativity` + a render test; planted off-token fails.
- ✅ `__tests__/e2e/fidelity.spec.ts` — 1440px capture of the catalogued surfaces + vs-reference artifacts (≤1%-vs-Figma deferred).
- ✅ `npm run fidelity` (CI-blocking: engine self-check + generativity); `pixelmatch@^5` devDep; artifacts gitignored.

**Critical path:** engine (1) → engine self-test (2) → generativity scaffold (3) → 1440px capture (4) → orchestrator
+ scripts (5) → acceptance (6).

**Scope guards (non-goals):**
- No ≤1%-vs-Figma enforcement (Phase-2, design-lock-gated — references are lossy/draft, fonts substituted, raster
  unexported); no committed cross-env baselines as a hard gate; no full admin generativity proof (#29); no new
  tokens/primitives/blocks/templates; no Phase-1 data; no legacy/shell edits.

**Success criteria:**
- ✅ Calibrated pixel-diff engine: control passes, 4px offset fails; diff + side-by-side + 50%-overlay artifacts
- ✅ 1440px capture renders surfaces vs reference renders (artifacts); ≤1%-vs-Figma deferred to Phase 2
- ✅ Generativity scaffold passes (zero off-system); planted off-token fails; `npm run fidelity` CI-blocking
- ✅ `build` + `test:unit` + `lint:tokens` (unchanged baseline) + `lint:composition` green; kit + legacy untouched
