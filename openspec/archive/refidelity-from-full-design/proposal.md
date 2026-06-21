# refidelity-from-full-design

**Type:** Regular change (Phase-4 capstone — the F1 ≤1% visual-fidelity gate + the generativity re-proof)
**Created:** 2026-06-21
**Plan:** `openspec/planning/full-design-reground.md` — Phase 4 (the final item; closes the reground)
**Capability:** `ui`
**Depends on:** all Phase-3 reconciliations (archived — every screen reconciled to `gigly_full_design`), the Phase-0
fidelity engine (`scripts/design-system/fidelity-diff.js`, calibrated to ≤1% with masking + artifacts), the
generativity scaffold (`scripts/design-system/validate-generativity.js`), the dual-theme token layer + resolved fonts.

## Why

Across all eight Phase-3 changes, F1 visual fidelity was delivered as a **structural/overlay match** and the **absolute
≤1% pixel gate was explicitly deferred to Phase 4** (`DESIGN_SYSTEM_SPEC.md` §10.x repeatedly). Phase 0 already built
the mechanism — a calibrated pixel-diff engine (proven by a synthetic control/offset unit test) + a 1440px capture
apparatus (`fidelity.spec.ts`, currently **informational-only**) + the registry + the generativity lints. This change
turns the deferred gate **on** and re-runs the generativity proof against the now-expanded kit + light theme.

**The gate target — decided with the product owner.** The only prototype imagery available is
`gigly_full_design/screenshots/*.png` — browser renders of the hand-built `.dc.html` prototype (different renderer,
fonts, antialiasing, dynamic content). Pixel-diffing the live Next.js app against those at ≤1% is **not a sound
automated gate** (it would be perpetually red / constantly masked; the repo's own baseline README says "do not treat
these as pixel-accurate"). So the **automated ≤1% F1 gate is self-referential**: it captures the **live app's own
renders** (every screen + workbench surface, in **both themes**) as committed **golden baselines** and gates future
renders at ≤1% vs those goldens (standard visual-regression — catches drift). The **prototype frames
(`Gigly Развёртка.dc.html` / `screenshots/`) become the human F1 overlay/calibration reference** (the registry's
`reference`), not the machine target.

## What

- **Golden-image F1 harness** — a fidelity gate (`scripts/design-system/` + a Playwright spec) that, for each
  **(surface × theme)**, captures the live render at **1440px** and, via the existing `fidelity-diff.js` engine:
  - on first run / `--update` (no golden present) → writes the golden;
  - otherwise → diffs the actual vs the committed golden, asserts **ratio ≤ 0.01 (≤1%)**, and emits the F1 artifacts
    (diff.png + side-by-side.png + **overlay-50.png** — the DoD's "50%-overlay shows no layout drift").
  Dynamic regions (dates, relative times, avatar-initials colour) are **masked** so the gate is deterministic.
- **Golden set** committed under `docs/design-system/fidelity/golden/{surface}.{theme}.png`; actuals + artifacts under
  `docs/design-system/fidelity/out/…` (gitignored). Goldens are **environment-pinned** to the project's Playwright
  Chromium (regenerate with `--update` if the pinned Chromium changes; documented).
- **Surfaces gated** — every **screen** (the live routes: dashboard, my-gigs, gigs[search], gigs/[id], gigs/new + success,
  chats, finances, settings, disputes, applications, register/onboarding, admin + admin/users + admin/gigs) and every
  **component** surface (the workbench `/workbench/{tokens,primitives,blocks,templates,layout,screens}`), each in **dark
  + light**.
- **Re-baseline the human F1 reference to the prototype** — repoint the registry/screen `reference` paths from the stale
  interim lossy JPGs to the `gigly_full_design` prototype imagery (`screenshots/` / Развёртка); keep the registry
  coverage test (every `reference` exists).
- **Generativity re-proof (both themes)** — run `validate-generativity` (composition-purity + token-purity over the
  `GenerativityProbe` + the admin screens + the expanded kit) and assert **zero off-system values**; add a **both-theme**
  assertion (the probe + admin render token-only, so they hold in light *and* dark — guaranteed by token-purity + the
  dual-theme token layer; verified by capturing the probe golden in both themes).
- **npm script** `test:fidelity` to run the gate; wire it into the docs.

## Key facts / decisions

- **Self-referential goldens (owner-confirmed)** — the automated ≤1% gate is regression-detection vs the live app's own
  committed goldens; the prototype frames are the human overlay reference. This is the sound, stable interpretation of
  "the ≤1% gate" (Playwright/pixelmatch golden-image practice).
- **Reuse the Phase-0 engine** — `fidelity-diff.js` (≤1% threshold, masking, overlay-50 artifact) + the synthetic
  control/offset unit test are kept and extended; no new diff engine.
- **The gate is a dedicated run (`test:fidelity`)**, not part of the default `test:unit` — browser screenshots are slow
  and environment-sensitive; goldens are env-pinned. The synthetic engine proof + the lints stay in the fast suite.
- **Generativity "both themes" = token-driven by construction** — the probe/admin have zero off-token literals (F2), so
  every value resolves through the dual-theme token layer; "zero off-system values in both themes" is asserted by the
  lints (theme-independent static analysis) + a both-theme probe golden.
- **Closes the reground** — flips every §10.x "≤1% deferred to Phase 4" note to "F1 gate live"; F1 becomes the standing
  visual-regression gate.

## Scope

- **Harness:** a fidelity-gate Playwright spec (capture + diff via `fidelity-diff.js`) + a small golden-manifest (the
  surface×theme list) + `--update` baseline mode; `package.json` `test:fidelity`; `.gitignore` for the `out/` artifacts.
- **Goldens:** capture + commit `docs/design-system/fidelity/golden/*.png` (screens + workbench, dark + light), with the
  per-surface dynamic-region masks.
- **Registry:** `app/workbench/registry.tsx` — repoint `reference` paths to the `gigly_full_design` prototype imagery;
  `__tests__/unit/components/workbench.test.tsx` stays green (reference-exists).
- **Generativity:** `validate-generativity.js` (run over the expanded kit) + a both-theme probe golden + the gate.
- **Tests:** keep `fidelity-harness.test.ts` (control passes + injected offset fails); the golden gate (≤1% per
  surface×theme); a token-purity planted-literal failure check; `validate-generativity` (zero off-system, both themes).
- **Docs:** flip the §10.x deferral notes in `DESIGN_SYSTEM_SPEC.md`; add a §10.22 Fidelity-gate note; check the Phase-4
  item in `full-design-reground.md`.

## Non-goals

- True pixel-diff of the live app against the external `.dc.html` prototype screenshots (unsound — the prototype frames
  stay the human overlay reference only).
- Making the screenshot gate part of the default `test:unit` (it's a dedicated `test:fidelity` run; env-pinned goldens).
- New design changes / screen edits (this is a fidelity *gate*, not a reconciliation — if a surface fails ≤1% vs its
  golden, that's a regression to investigate, not a redesign).
- Cross-browser/responsive fidelity (the gate is Chromium @ 1440px, matching the design frames).

## Acceptance (from the PRD)

- **Known-good control passes** — actual == golden (and the synthetic control image-vs-itself ≈ 0) → ≤1% PASS.
- **Injected offset fails** — a deliberately shifted render (the synthetic 4px-offset case) exceeds the threshold → the
  gate FAILS (catches drift).
- **Planted off-token fails** — a planted hex/rgb literal makes `lint:tokens` FAIL (non-baselined new violation).
- **Admin generativity = zero off-system values in both themes** — `validate-generativity` passes (composition +
  token-purity over the probe + admin), and the probe holds in light + dark.

## References

`scripts/design-system/fidelity-diff.js` (the engine + `FIDELITY_CONFIG` ≤1% + masking + artifacts);
`__tests__/unit/fidelity-harness.test.ts` (control/offset/mask/artifact); `__tests__/e2e/fidelity.spec.ts` (the 1440px
capture, currently informational L57–58); `app/workbench/registry.tsx` (CatalogEntry + REF paths L24–37) +
`__tests__/unit/components/workbench.test.tsx` (reference-exists L26–49); `scripts/design-system/validate-generativity.js`
+ `app/workbench/screens/GenerativityProbe.tsx`; `lib/theme.ts` (`[data-theme]` toggle) + `app/globals.css` (the CSS-var
layer) + `app/fonts.ts`/`app/layout.tsx` (Handjet/Manrope resolved); `gigly_full_design/Gigly Развёртка.dc.html` +
`gigly_full_design/screenshots/` (the human F1 reference); the F1–F5 DoD
(`openspec/planning/archive/ui-redesign-integration.md` L54–60).
