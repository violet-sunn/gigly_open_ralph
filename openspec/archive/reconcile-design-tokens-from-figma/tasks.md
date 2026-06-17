# Tasks — reconcile-design-tokens-from-figma

Decision-and-documentation change closing the residual token-layer items the components/screens import
surfaced. The colour/type/effect/`--gig-bg`/category reconcile already landed (2026-06-17) — do NOT redo it.
Confirm that baseline first, then resolve the three residuals, record them, and prove the pipeline stays in sync.

## 1. Confirm the prior reconcile is intact (baseline)
- [x] Verify `openspec/specs/ui/design-tokens.json` carries the corrected values: `border.default #5a6070`,
      `brand.hover #0099ff`, `brand.highlight #4cacff`, `surface.level-3 #1a1a24`, and the real Figma type scale.
- [x] Verify `scripts/generated-tokens.css` matches (`--border-default: #5a6070`, `--brand-hover: #0099ff`,
      `--surface-level-3: #1a1a24`).
- **Test:** `node scripts/parse-design-tokens.js` then `git diff --stat scripts/generated-tokens.*` shows only the
  timestamp line changed (pipeline already in sync). If more changed, the prior reconcile was not committed — stop and flag.

## 2. Resolve the third blue (`#006ccb`)  — Requirement: Screen-Level Blue Reconciliation
- [x] Decide: normalize `#006ccb` → `brand.default` (recommended) OR sanction a new `brand.link` token.
- [x] If sanctioning a token, add it to `design-tokens.json` `color-semantic.brand` with a description; otherwise
      record that JobExperienceCard role text binds to `brand.default`.
- **Test:** the reconciliation log has the decision + token target; if a token was added, parser stays clean and the
  validation test sees it. No raw `#006ccb` left without a semantic home.

## 3. Resolve the three non-token families — Requirement: Non-Token Font Family Decision
- [x] Record a resolution for `Vremena Grotesk`, `IBM Plex Sans`, `Inter`: recommended = map Vremena/IBM-Plex to
      `font.family.sans` for MVP (designer-placeholder), note `Inter` is already the sans dev-substitute; flag for
      designer confirmation.
- [x] Only add a `font.family.*` token if the designer confirms an intentional distinct family (not expected now).
- **Test:** `design-tokens.json` `font.family` still contains only justified families (expected `sans`, `mono`); the
  log carries a resolution line for each of the three families.

## 4. Confirm the category hue mapping — Requirement: Category Hue Binding Confirmation
- [x] Compare `category.{marketing,design,programming,development,coding}` to the `tag`/`Category` component fills in
      `docs/figma-components-export.md` / `docs/figma-component-audit.md`; log any divergence.
- [x] Resolve the `marketing #0088ff` vs `Blue #4cacff` ambiguity (recommended: marketing = brand `#0088ff`;
      `#4cacff` is the highlight tint for the "Стек" Blue tag label, not a category).
- **Test:** the log records the five confirmed hues + the ambiguity resolution; category token values unchanged unless
  a divergence was found and justified.

## 5. Write the reconciliation decision log — Requirement: Reconciliation Decision Log
- [x] Add a dated "Figma screen-level reconciliation" section to `docs/DESIGN_SYSTEM_SPEC.md` (or create
      `docs/TOKEN_RECONCILIATION.md`) with one entry per decision (tasks 2–4): observed value(s), decision, rationale,
      token target, and the citing import doc.
- **Test:** the log section exists, is dated 2026-06-17, and covers all three decisions with import-doc citations.

## 6. Regenerate + prove sync and lint — Requirement: Generated Pipeline Stays in Sync With the Reconciled SSOT
- [x] Run `node scripts/parse-design-tokens.js`; commit any regenerated `scripts/generated-tokens.{js,css}`.
- [x] Ensure the token validation test asserts generated outputs match the JSON (extend it if it does not).
- **Test plan (run, assert green):**
  - `node scripts/parse-design-tokens.js` exits 0; generated files differ only by timestamp (or reflect a sanctioned token edit).
  - `npm run build` passes.
  - `npm run lint:tokens` passes on the baselined codebase; planting `color: #006ccb` in app source makes it fail (then revert).
  - `npm run test:unit` green (run once; per project note, avoid repeated runs — `npm run clean:test-db` if integration tests escalate).

## 7. Update the planning doc status
- [x] In `openspec/planning/figma-grounded-ui-reconciliation.md`, check `reconcile-design-tokens-from-figma` in the
      Status section and bump progress to `1/13`.
- **Test:** the Status checkbox is `[x]` and the progress line reads `1/13`.
