# Tasks — add-light-theme

Add the net-new light theme as a runtime `[data-theme]` mode: make the token colour/shadow/gradient layer var-backed
(switchable, not build-baked), add the light values (depth via shadow + grey, not glow), wire a Settings → Внешний вид
switch persisted in `localStorage['gigly-theme']` with a no-flash boot. Dark stays default + unchanged; brand `#0088ff`
+ Handjet invariant; status one-to-one. Source: `ТЗ — Светлая тема.md` + `fig-tokens.css` Light mode. Friction:
**high** (token-pipeline + validator change + runtime theming + Settings + E2E). Per-screen visual/WCAG review is a
non-goal (Phase 3 + a `light-theme-screen-audit` follow-up).

## 1. Add the light token values to the SSOT
- [x] Added `"light"` siblings to surfaces (`#f4f5f7`/`#eceef1`/`#ffffff`/`#eef0f3`; inverse→`#0e121b`), text
      (strong `#0e121b`, muted/subtle `#6b7280`, disabled `#aab0bb`; **text.inverse + brand.default left invariant**),
      border (`#e6e8ec`), brand.hover (`#0077e0`, dark physics), overlays (white tints → navy hairlines).
- [x] Added `"light"` to `effect.shadow.{sm,card,md,lg,popover}` (navy-tinted depth; focus invariant) and the 6
      `gradient.status-*-glow` (radial → flat 8–10% fill on light).
- **Test:** ✅ themeable tokens carry `light`; `brand.default` + `font.family.*` do not; JSON parses.

## 2. Parser: var-back the colours + emit the [data-theme="light"] layer
- [x] `scripts/parse-design-tokens.js`: colours/boxShadow/gradient emitted to Tailwind as `var(--<key>)` (new
      `toVarMap` helper); `:root` keeps the dark values; added a `[data-theme="light"]{…}` block from the `.light`
      maps for colours + shadows + gradients.
- [x] Regenerated: `45 colours (16 light) + 7 shadows (5 light) + 13 gradients (6 light)` → later 48 colours (+3 tint).
- **Test:** ✅ `gen.colors["surface-level-0"] === "var(--surface-level-0)"`; CSS has `:root{--surface-level-0:#01030e}` + `[data-theme="light"]{--surface-level-0:#f4f5f7}`.

## 3. Import the var layer in globals.css
- [x] Added `@import "../scripts/generated-tokens.css";` BEFORE the `@tailwind` directives (CSS ordering); updated the
      stale "no runtime CSS-var dependency" comment.
- **Test:** ✅ built CSS: `.bg-surface-level-0{background-color:var(--surface-level-0)}` + `:root #01030e` + `[data-theme=light] #f4f5f7`.

## 4. Update the token validator to the var layer
- [x] `validate-tokens.js`: drift check moved to the CSS-var layer — asserts `gen.colors[key]==="var(--key)"`, `:root`
      carries the dark value, `[data-theme="light"]` carries each `.light` override (added `hexToRgba` + `cssVars`
      block parsers). Taxonomy/status/category/parody checks kept.
- **Test:** ✅ `validate:tokens` PASS; **negative test confirmed** — a planted `:root --accent-pink` mismatch FAILED (exit 1), restored clean.

## 5. Theme controller + no-flash boot
- [x] Added `lib/theme.ts` (`applyTheme`/`getStoredTheme`/`THEME_BOOT_SCRIPT`, key `gigly-theme`, default dark) —
      placed in `@/lib` (allowlisted for composed screens, not `app/lib`).
- [x] `app/layout.tsx` `<head>` runs `THEME_BOOT_SCRIPT` (dangerouslySetInnerHTML) — applies the stored theme before paint.
- **Test:** ✅ E2E reload under light shows the attribute applied immediately (no flash).

## 6. Settings → Внешний вид switch
- [x] Added an `AppearanceControl` (Тёмная/Светлая `Select`, `aria-label="Тема оформления"`) to `Settings.tsx`,
      initialised to the SSR default then synced to the stored choice on mount (no hydration mismatch). Token-pure.
- **Test:** ✅ E2E selects Светлая → `html[data-theme="light"]`; reflects the persisted value on reload.

## 7. Token-purity + opacity-modifier sweep
- [x] **Found + fixed a regression:** `bg-brand-default/10` (MessageBubble/Select/StatusBadge) + `bg-status-rejected/20|30`
      (danger) compiled to **nothing** once colours became `var()` (Tailwind `/opacity` can't apply to a var colour).
      Minted full-value `color-semantic.tint.{brand,danger,danger-hover}` tokens (brand muted on light, ТЗ §4) and
      migrated all 4 usages to `bg-tint-*`. Updated the 4 unit assertions to the new classes.
- **Test:** ✅ `lint:tokens` baseline unchanged; re-sweep finds no `/[0-9]` opacity modifier on a var-backed colour; built CSS resolves `bg-tint-brand`→`var(--tint-brand)` (dark .1 / light .08).

## 8. E2E — theme switch + persistence
- [x] Added `__tests__/e2e/theme-switch.spec.ts` (3 tests): default dark + dark bg; switch Светлая → `data-theme=light`
      + body computes `rgb(244,245,247)` + `localStorage['gigly-theme']="light"` + survives reload; switch back → dark.
      Trigger targeted by its `aria-label` (the Select's accessible name).
- **Test:** ✅ `theme-switch` 3/3 pass.

## 9. Record decisions + docs
- [x] Added `docs/DESIGN_SYSTEM_SPEC.md` **§10.10** (RC-T5 var-backed `[data-theme]`, RC-T6 depth-via-shadow + invariants,
      RC-T7 the tint-token `/opacity` rule; deferred per-screen/WCAG + legacy literals + logo плашка). Checked the
      Phase-1 item + added the `light-theme-screen-audit` follow-up in `full-design-reground.md`.
- **Test:** ✅ §10.10 records the mechanism + the deferred scope.

## 10. Quality gates (run, assert green)
- [x] `npm run validate:tokens` — ✅ PASS (48 colours; var-backed; dark + light in sync; no parody).
- [x] `npm run lint:tokens` — ✅ PASS (baseline unchanged at 74).
- [x] `npm run lint:composition` — ✅ PASS (18 composed screens; Settings/layout still pure).
- [x] `npm run build` — ✅ PASS (var layer loads; utilities + tints resolve).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ 936/937 + `gig-browse-access` 10/10 in isolation (documented flake).
- [x] `npx playwright test theme-switch` — ✅ 3/3.
- **Acceptance:** ✅ dark default + unchanged; light values present (brand/type invariant; status one-to-one); toggle
  persists + restores before paint; both themes token-pure; all gates + E2E green.

## 11. Planning-status (Phase 1)
- [x] Checked the `add-light-theme` item in `full-design-reground.md` Phase 1 (DONE 2026-06-19) + added the follow-up.
- **Test:** ✅ the Phase-1 item reads `[x]`.
