# reconcile-design-tokens-from-figma

**Type:** Regular change (UI / design tokens)
**Created:** 2026-06-17
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 0, change #1
**Capability:** `ui` (extends the token requirements in `openspec/specs/ui/spec.md`)

## Why

The first wave of Figma reconciliation **already landed** on 2026-06-17: `openspec/specs/ui/design-tokens.json` was re-sourced from the authoritative Figma export (`docs/figma-tokens-export.json`) and the bugs the SVG-traced values carried are fixed — `border.default` `#3a3d45 → #5a6070`, `brand.hover` `#4cacff → #0099ff` (old tint preserved as `brand.highlight`), the gig surface `--gig-bg #1a1a24` is mapped to `surface.level-3`, the type scale is rewritten to real Figma metrics (H1 32/37, H2 24/29, H3 18/23, body 15, label 13, caption 11, data 14/12) with per-role families, and the category palette is pinned. `scripts/generated-tokens.{js,css}` are regenerated and **in sync** (verified: `--border-default: #5a6070`, `--brand-hover: #0099ff`, `--surface-level-3: #1a1a24`).

What is **not yet resolved** are the residuals the *components/screens* import surfaced *after* that token pass (`docs/figma-components-export.md`, `docs/figma-screens-export.md`) — values that live raw in component/screen designs and were never Figma variables, so the token re-source could not see them:

1. **A third blue — `#006ccb`** — the job-experience role text on the profile screen (`3088:3896`), distinct from `brand.default #0088ff` and `brand.highlight #4cacff` and the specialty atom's `#0088ff`. An unaccounted near-duplicate.
2. **Three non-token font families — `Vremena Grotesk`, `IBM Plex Sans`, `Inter`** — used raw in message/notification bodies, gig price/term values (Vremena), embedded gig titles + the file chip (IBM Plex), and the attention-card emoji markers (Inter). The token model binds only two families (`sans` = SF Compact, `mono` = NKDuy Mono). (`Inter` is already the dev *substitute* for `sans` — so only Vremena + IBM Plex are genuinely new candidates.)
3. **tag/Category hues are raw hex, unbound to variables** — the SSOT pins `category.*`, but Figma exposes the hues only as component-variant fills, and the export flags a `marketing #0088ff` vs `Blue #4cacff` ambiguity. The mapping needs a recorded confirmation, not a guess.

Until these are decided and recorded, screens that compose from them (profile, dashboards, gig detail, chats) will keep re-introducing off-token literals — the visible "hickups" — and the token-purity lint will have nothing to point them at.

## What

Finish the token reconciliation by **closing the three residual decisions, recording them in a durable reconciliation log, and adding a regression guard that the generated pipeline stays in sync with the reconciled SSOT.** This is a small, decision-and-documentation-heavy change, not a re-derivation — the colour/type/effect reconcile is already in the SSOT.

Recommended decisions (each to be ratified + recorded by this change):
- **`#006ccb` → normalize to `brand.default` (`#0088ff`)** as an accidental near-duplicate of the role/link blue; no new token. (If the designer confirms it is intentional, sanction a `brand.link` token instead — recorded either way.)
- **No new family tokens for Vremena Grotesk / IBM Plex Sans** — treat them as designer placeholders in the mockups; map message/notification/value text to `font.family.sans` and titles/data to existing roles. `Inter` stays the sans dev-substitute. Flag for designer confirmation; revisit only if confirmed intentional.
- **Category hues: keep `marketing = #0088ff` (brand); `#4cacff` is the highlight tint** used for the "Стек" Blue tag *label*, not a category. Confirm the five-hue mapping matches the `tag`/`Category` component fills.

## Scope

- **Edits:** `openspec/specs/ui/design-tokens.json` (only if a decision adds/normalizes a token — expected: none beyond an optional `brand.link`); `scripts/generated-tokens.{js,css}` (regenerate); a reconciliation log section in `docs/DESIGN_SYSTEM_SPEC.md` (or `docs/TOKEN_RECONCILIATION.md`); a sync-guard assertion in the token validation test.
- **Affected systems:** token SSOT + generation pipeline (`scripts/parse-design-tokens.js`), `tailwind.config.ts` consumption, token-purity lint (`scripts/design-system/validate-token-purity.js`), token validation unit test.

## Non-goals

- Re-doing the colour/type/effect reconcile (already landed 2026-06-17).
- Resolving the SF Compact / NKDuy Mono **web-licence** (owned by `typography-system`; remains an external cap on the absolute F1 gate).
- Touching component or screen code — that is the job of the later Phase-0 block changes and the Phase-1 screen reconciliations; this change only fixes the *token layer* and *records decisions* so those changes have a clean target.
- Flipping the token-purity lint from baseline-then-tighten to fail-on-all (a later cleanup change).

## References

- `docs/figma-tokens-export.json` (authoritative variables), `docs/figma-components-export.md`, `docs/figma-screens-export.md`, `docs/figma-component-audit.md`
- Current SSOT: `openspec/specs/ui/design-tokens.json`; pipeline: `scripts/parse-design-tokens.js` → `scripts/generated-tokens.{js,css}`; lint: `scripts/design-system/validate-token-purity.js`
- Existing token requirements in `openspec/specs/ui/spec.md`: "Serialized Token Source…", "Token Generation Pipeline", "Token-Purity Lint", "Family Tokens Bound to the Type Scale"
