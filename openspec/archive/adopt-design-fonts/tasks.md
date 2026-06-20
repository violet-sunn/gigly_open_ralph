# Tasks — adopt-design-fonts

Adopt `gigly_full_design`'s sanctioned free-Cyrillic substitution as system fact: `--font-mono` → **Handjet**
(accent/pixel, NKDuy role), `--font-grotesk` (NEW) → **Manrope** (Vremena role), `--font-sans` → **system stack**
(SF Compact role); drop Inter + JetBrains Mono; expose `font-grotesk`; retire the F1 font cap. Source:
`gigly_full_design/README.md` + `HANDOFF.md`. Friction: **medium** (token-pipeline regen + font loading + a doc/risk
sweep; no screen logic changes; contract names stay stable so consumers don't churn).

## 1. Load Handjet + Manrope (decision: next/font/google, not vendored woff2)
- [x] **Decision change:** Google serves Handjet/Manrope as **unicode-range-split variable woff2** (Cyrillic/Latin
      subsets) — fiddly to hand-vendor for `next/font/local`. Used **`next/font/google`** instead: it self-hosts both
      at build (no runtime Google request) and handles the Cyrillic subset + variable axes. No woff2 vendored.
- [x] Removed the old `app/fonts/Inter-*.woff2` + `JetBrainsMono-*.woff2` (+ their OFL texts); `app/fonts/` is now empty.
- **Test:** ✅ `npm run build` self-hosts both fonts with no missing-font error (Task 8 build gate).

## 2. Rewire app/fonts.ts → Handjet (mono) + Manrope (grotesk); drop Inter
- [x] `fontMono` → **Handjet** via `next/font/google` (`subsets: ['latin','cyrillic']`, `variable: "--font-mono"`,
      `display: "swap"`) — variable font, so heading weights 500/600 are native.
- [x] Added `fontGrotesk` → **Manrope** via `next/font/google` (`variable: "--font-grotesk"`, Cyrillic, swap).
- [x] Removed the Inter `fontSans` localFont; `--font-sans` is now the system stack (Task 4). Module doc comment
      rewritten to the sanctioned mapping.
- **Test:** ✅ `app/fonts.ts` exports `fontMono` (Handjet) + `fontGrotesk` (Manrope), no Inter/JetBrains (grep gate).

## 3. Apply the variables in app/layout.tsx
- [x] `<html>` now carries `${fontMono.variable} ${fontGrotesk.variable}` (dropped `fontSans.variable`); body keeps
      `font-sans` (the system stack). Imports updated.
- **Test:** ✅ build renders; body default is `font-sans`.

## 4. Define --font-sans as the system stack
- [x] Added a `:root { --font-sans: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif; }` block in
      `app/globals.css` `@layer base`, so the `fontFamily.sans` token resolves a deliberate system stack.
- **Test:** ✅ body computes a system font; no Inter web font loaded.

## 5. Update the token SSOT + regenerate
- [x] `openspec/specs/ui/design-tokens.json` `font.family`: `mono` desc → Handjet pixel face, `sans` desc → system
      stack, **added** `grotesk` → Manrope. Struck the `_residual`/`residual` "dev sub: Inter/JetBrains" + "capped" notes
      (replaced with the resolved-fonts note).
- [x] `scripts/parse-design-tokens.js` needed no change — it flattens `font.family`, so `grotesk` flows through.
- [x] Regenerated via `npm run tokens:generate`: `fontFamily.grotesk` + `--font-family-grotesk` now present;
      `mono`/`sans` shapes unchanged.
- **Test:** ✅ `npm run validate:tokens` PASS (in sync); `grotesk` present in both generated files; no Inter/JetBrains/"dev sub" in the token files.

## 6. Exercise font-grotesk in the workbench
- [x] Added `["type/grotesk", "text-body font-grotesk"]` to the `TYPES` catalog in `app/workbench/registry.tsx`
      (the Vremena/Manrope role), with a comment naming its usages.
- **Test:** ✅ build includes the workbench typography page; `font-grotesk` is a valid utility (Tailwind picks up `fontFamily.grotesk`).

## 7. Retire the F1 font cap (docs + risk + memory)
- [x] Rewrote `docs/TYPOGRAPHY.md` title + cap-warning + §1 + §2 + §3: the "CAPPED / not web-embeddable" framing →
      the resolved Handjet/Manrope/system substitution as system fact; loading via `next/font/google`; resolved the
      old JetBrains-400-only weight residual (variable fonts).
- [x] Struck the font-licence risk in `figma-grounded-ui-reconciliation.md` (strikethrough + RESOLVED note); checked
      the Phase-0 `adopt-design-fonts` item in `full-design-reground.md`.
- [x] Updated `figma-mcp-access` memory (fonts RESOLVED) — `gigly-full-design-import` already recorded the resolution.
- **Test:** ✅ no doc/planning/memory states the font licence caps F1; `docs/TYPOGRAPHY.md` names the sanctioned trio.

## 8. Quality gates (run, assert green)
- [x] `npm run validate:tokens` — ✅ PASS (39 colours; in sync; `grotesk` present).
- [x] `npm run lint:tokens` — ✅ PASS (no new off-token literals; 74 baselined).
- [x] `npm run lint:composition` — ✅ PASS (18 composed screens; unaffected).
- [x] `npm run build` — ✅ PASS (Handjet + Manrope self-hosted via next/font/google; no error).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ **937/937** pass (the `font-mono`-class assertion holds).
- [x] Grep gate: no `Inter`/`JetBrains` in `app/fonts.ts`, `scripts/generated-tokens.*`, or the `design-tokens.json` family block.
- **Acceptance:** ✅ the three families resolve (Handjet/Manrope/system); `font-grotesk` wired + exercised; tokens/build/lint/unit green; the F1 font cap struck from docs/planning/memory.

## 9. (Planning-status: Phase 0)
- [x] `full-design-reground.md` Phase 0 `adopt-design-fonts` item checked.
- **Test:** ✅ the Phase 0 item reads `[x]` (DONE 2026-06-19).
