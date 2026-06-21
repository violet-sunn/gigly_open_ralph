# Tasks — refidelity-from-full-design

Turn on the deferred **F1 ≤1% gate** as a self-referential golden-image regression (every screen + workbench surface,
both themes, via the Phase-0 `fidelity-diff.js` engine), re-baseline the human F1 reference to the `gigly_full_design`
prototype, and re-prove generativity in both themes. Closes Phase 4. Friction: **high** (test/infra; screenshot
capture + goldens + masking).

## 1. Golden-image fidelity harness
- [x] Add a surface manifest (the gated list): every screen route (dashboard, my-gigs, gigs[search], gigs/[id],
      gigs/new, gigs/new/success, chats, finances, settings, disputes, disputes/[id], applications, register, admin,
      admin/users, admin/gigs) + every `/workbench/{tokens,primitives,blocks,templates,layout,screens}` — each × {dark,
      light}. Add a `__tests__/e2e/fidelity-gate.spec.ts` that, per (surface, theme), sets `[data-theme]`, captures at
      1440px, and via `fidelity-diff.js`: writes the golden when absent / `FIDELITY_UPDATE=1`, else diffs vs the golden,
      asserts ratio ≤ 0.01, and emits diff/side-by-side/overlay-50. Mask dynamic regions (dates, relative times,
      avatar-initials colour) per the engine's mask API.
- [x] `package.json`: `test:fidelity` (the gate) + `test:fidelity:update` (`FIDELITY_UPDATE=1`). `.gitignore` the
      `docs/design-system/fidelity/out/` artifacts.
- **Test:** `test:fidelity:update` writes goldens; a second `test:fidelity` run passes ≤1% for every surface×theme.

## 2. Capture + commit the golden set
- [x] Run `test:fidelity:update` to capture + commit `docs/design-system/fidelity/golden/{surface}.{theme}.png` for all
      surfaces (screens + workbench, dark + light). Seed any auth/role state the screen routes need (reuse the E2E
      session/seed helpers + DISABLE_RATE_LIMIT). Document that goldens are pinned to the project's Playwright Chromium.
- **Test:** the committed goldens exist for every manifest entry; the gate is green against them.

## 3. Re-baseline the human F1 reference to the prototype
- [x] `app/workbench/registry.tsx`: repoint the `REF.*` / per-entry `reference` paths from the interim lossy JPGs to the
      `gigly_full_design` prototype imagery (`gigly_full_design/screenshots/*` — copy/curate into
      `docs/design-system/reference-renders/` as needed so paths resolve). Keep them as the human overlay reference (NOT
      the automated target).
- **Test:** `workbench.test.tsx` coverage — every `reference` resolves to a file that exists.

## 4. Generativity re-proof (both themes)
- [x] Run `validate-generativity` over the `GenerativityProbe` + the admin screens + the expanded kit; confirm zero
      off-system values (composition + token purity). Add the `GenerativityProbe` to the golden manifest in BOTH themes
      (so the proof is verified to hold visually in light + dark). `package.json`: ensure `lint:generativity`/
      `validate-generativity` is runnable.
- **Test:** `validate-generativity` PASS; the probe goldens (dark + light) gate ≤1%.

## 5. Engine proof + planted-failure checks (acceptance)
- [x] Keep `__tests__/unit/fidelity-harness.test.ts` green (control passes; the injected 4px offset exceeds 1% → caught;
      masking; artifact emission). Add (or confirm) a check that a planted hex/rgb literal makes `lint:tokens` FAIL
      (the baseline-then-tighten mechanism) — a documented manual/meta check is acceptable if a self-failing test is
      impractical.
- **Test:** control PASS + offset FAIL asserted; `lint:tokens` flags a planted literal.

## 6. Close the F1 deferral in the docs
- [x] `docs/DESIGN_SYSTEM_SPEC.md`: flip every §10.x "absolute ≤1% deferred to Phase 4" note to "F1 ≤1% gate live
      (self-referential golden regression; prototype = human overlay reference)"; add a §10.22 Fidelity-gate note (the
      harness, the golden set, both-theme coverage, env-pinning, the generativity re-proof). Check the Phase-4 item in
      `full-design-reground.md` (mark the reground complete).
- **Test:** the notes read "gate live"; the Phase-4 item reads `[x]`.

## 7. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` + `npm run lint:composition` — PASS.
- [x] `npm run build` — PASS.
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. `fidelity-harness` + `workbench` coverage).
- [x] `npm run test:fidelity` — green (≤1% for every surface×theme vs the committed goldens).
- [x] `validate-generativity` — zero off-system values.
- **Acceptance (Fidelity DoD):** F1 = the **live ≤1% golden gate** (no longer structural-only) + the prototype overlay
  reference; F2 token-pure; F3 parity (Phase-3); F4 assets; F5 composition-pure. The reground is complete.

## 8. Planning-status (Phase 4)
- [x] Check `refidelity-from-full-design` in `full-design-reground.md` Phase 4 and mark the reground **complete**.
- **Test:** the Phase-4 item reads `[x]`.
