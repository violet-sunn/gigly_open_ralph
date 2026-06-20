# Tasks — reconcile-tokens-to-full-design

Re-sync the token SSOT to `gigly_full_design/design-system/fig-tokens.css` (189 tokens): add the per-status
radial/border triads, the `sm`/`lg` shadows, spacing `80`/`96`, verify the radius scale, and pin the category hues
(marketing → #4cacff, design → rose) — all additive, legacy keys kept, regenerated. Source: `fig-tokens.css` +
`Category.jsx`. Friction: **medium** (SSOT edits + regen + a value correction; no component logic; parser unchanged).

## 1. Add the status radials (gradient.status-*-glow)
- [x] Added 5 `gradient.status-{open,in-progress,review,verification,rejected}-glow` radials after the existing
      `status-completed-glow`, each `radial-gradient(closest-side, …0.5 → 0.1 → 0)` from the `fig-tokens.css`
      `--status-{key}-bg-radial` stops. Figma keys mapped **new → open** (white), **testing → verification** (purple).
- **Test:** ✅ all 6 `gradient.status-*-glow` keys in `generated-tokens.js` (13 gradient tokens total); `validate:tokens` gradient non-empty.

## 2. Add the status border tints (color-semantic.status-border.*)
- [x] Added `color-semantic.status-border` (6 leaves, 30% tints): open `rgba(255,255,255,.3)`, review/in-progress/
      verification/completed/rejected per fig. Existing `color-semantic.status.*` text leaves untouched.
- **Test:** ✅ `gen.colors` carries `status-border-{open,review,in-progress,verification,completed,rejected}`; the 6 `status.*` leaves unchanged; `validate:tokens` in sync.

## 3. Add the missing shadows (sm + lg)
- [x] Added `effect.shadow.sm` (`0 1 2 0 #0000004d`) + `lg` (`0 8 24 0 #00000080`); `md`/`focus`/`card`/`popover` kept.
- **Test:** ✅ `gen.boxShadow` includes `sm` (`0px 1px 2px 0px rgba(0,0,0,0.30)`) + `lg` (`…8px 24px…0.50`).

## 4. Complete the spacing scale (80 + 96)
- [x] Added `numbers.spacing` `"20": 80` (5xl) + `"24": 96` (6xl); all existing keys kept.
- **Test:** ✅ `gen.spacing` includes `20: "80px"` + `24: "96px"`; no key removed.

## 5. Verify the radius scale + pin the categories
- [x] Annotated `numbers.corner` `_note` (xl 16 = `special`, xs 2 = `lt`; complete) — no value/key change.
- [x] `category.marketing` → `#4cacff` (design Category blue, = brand.highlight); `design` relabeled **rose** (value
      #f45fb1); programming/development/coding confirmed #0cc671/#05c9e6/#f27c0d. (SUPERSEDES RC-S3.)
- **Test:** ✅ `validate:tokens` finds all 5 categories; `gen.colors["category-marketing"]` = `#4cacff`.

## 6. Regenerate the generated outputs
- [x] Ran `npm run tokens:generate`; `generated-tokens.{js,css}` carry the new status-border colours, status glows,
      `boxShadow` sm/lg, spacing 20/24, and `category-marketing` #4cacff. Parser unchanged.
- **Test:** ✅ `validate:tokens` PASS — **45 canonical colours** (was 39; +6 status-border), in sync, no parody.

## 7. Record the reconciliation decisions
- [x] Added `docs/DESIGN_SYSTEM_SPEC.md` **§10.9** (RC-T1 triads, RC-T2 marketing #0088ff→#4cacff **superseding
      RC-S3** w/ `Category.jsx` provenance, RC-T3 open-text gray divergence, RC-T4 shadows/spacing). Checked the
      Phase-1 item in `full-design-reground.md`.
- **Test:** ✅ §10.9 records the marketing correction (Category.jsx rgb(76,172,255)) + the open-text divergence + RC-S3 supersession.

## 8. Quality gates (run, assert green)
- [x] `npm run validate:tokens` — ✅ PASS (45 colours; in sync; no parody).
- [x] `npm run lint:tokens` — ✅ PASS (baseline unchanged at 74; no new off-token literals).
- [x] `npm run lint:composition` — ✅ PASS (18 composed screens; unaffected).
- [x] `npm run build` — ✅ PASS (compiled; Tailwind resolves the new utilities).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ 936/937 + `gig-browse-access` 10/10 in isolation (documented test-db-pollution flake; a token change can't affect a redirect test).
- **Acceptance:** ✅ full status triads + sm/lg shadows + 80/96 spacing + pinned categories; legacy keys intact;
  regenerated + in sync; decisions recorded.

## 9. Planning-status (Phase 1)
- [x] Checked the `reconcile-tokens-to-full-design` item in `full-design-reground.md` Phase 1 (DONE 2026-06-19).
- **Test:** ✅ the Phase-1 item reads `[x]`.
