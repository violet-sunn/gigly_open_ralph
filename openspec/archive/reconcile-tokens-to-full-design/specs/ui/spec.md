# Spec delta — ui (reconcile-tokens-to-full-design)

Re-syncs the token SSOT to `gigly_full_design/design-system/fig-tokens.css` (189 tokens): the full per-status
radial/border/text triads, the `sm`/`lg` shadows, the complete spacing scale, a verified radius scale, and the pinned
category↔hue mapping — all additive (legacy keys preserved), regenerated into `scripts/generated-tokens.{js,css}`,
keeping `validate:tokens` / `lint:tokens` / `build` / unit green.

## ADDED Requirements

### Requirement: Per-Status Radial/Border/Text Triads Are Token-Backed
The token SSOT MUST provide, for each of the 6 statuses (`open, review, in-progress, verification, completed,
rejected`), the full triad sourced from `fig-tokens.css` `--status-{name}-*` (Figma keys mapped **new → open**,
**testing → verification**): the **text** colour (the existing `color-semantic.status.{name}` leaf), a **radial**
glow gradient (`gradient.status-{name}-glow`), and a **border** tint (`color-semantic.status-border.{name}`). The
additions MUST NOT restructure the existing `color-semantic.status.{name}` leaves (so `text-/bg-/border-status-*`
consumers keep working). The generated outputs MUST be regenerated so every new colour leaf appears in
`generated-tokens.js` `colors` and every radial in its `gradient` group.

#### Scenario: All six statuses expose a radial + border + text
- GIVEN `openspec/specs/ui/design-tokens.json` after the change
- THEN each status MUST have a `color-semantic.status.{name}` text leaf, a `gradient.status-{name}-glow` radial, and a
  `color-semantic.status-border.{name}` border leaf
- AND `npm run validate:tokens` MUST pass (no drift: every `color-semantic` leaf present in `generated-tokens.js` with
  a matching value; `gradient` + `boxShadow` groups non-empty)

#### Scenario: Existing status colour leaves and utilities are unchanged
- GIVEN the existing `color-semantic.status.{name}` leaves
- WHEN the triads are added
- THEN the existing leaves (and the `text-status-*` / `border-status-*` / `bg-status-*` Tailwind utilities) MUST be
  preserved unchanged; only new `status-border.*` + `gradient.status-*-glow` entries are introduced

### Requirement: Shadow and Spacing Scales Completed (Legacy Keys Kept)
`effect.shadow` MUST add `sm` (`0 1 2 0 rgba(0,0,0,0.3)`) and `lg` (`0 8 24 0 rgba(0,0,0,0.5)`) from `fig-tokens.css`,
keeping `card`/`popover` as legacy aliases; `numbers.spacing` MUST add `20` (=80px, Figma `5xl`) and `24` (=96px,
Figma `6xl`) to complete the scale, keeping the existing numeric keys. The `numbers.corner` (radius) scale MUST be
verified to already cover the Figma radii (xl 16 = `special`, xs 2 = `lt`) and annotated; no radius key/value changes.

#### Scenario: Shadows and spacing extended, no key removed
- GIVEN the SSOT after the change
- THEN `effect.shadow` MUST include `sm`, `md`, `lg`, `focus` (and the legacy `card`/`popover`), and `numbers.spacing`
  MUST include `20` (80) and `24` (96) alongside the existing keys
- AND `generated-tokens.js` MUST emit the `boxShadow` + `spacing` groups with the new entries, and no previously
  present token key may be removed (legacy shim intact)

### Requirement: Category↔Hue Mapping Pinned to the Design
`color-semantic.category` MUST be pinned to the design's `Category.jsx` hues: `marketing` = **#4cacff** (the design's
Category blue, = `brand.highlight`), `design` = #f45fb1 labelled **rose**, `programming` = #0cc671, `development` =
#05c9e6, `coding` = #f27c0d. The 5 category keys required by the validator MUST remain present.

#### Scenario: Marketing corrected, design relabeled rose, others confirmed
- GIVEN `color-semantic.category` after the change
- THEN `marketing` MUST be #4cacff (corrected from #0088ff), `design` MUST be #f45fb1 with a **rose** description, and
  `programming`/`development`/`coding` MUST be #0cc671/#05c9e6/#f27c0d
- AND `npm run validate:tokens` MUST still find all 5 categories; the marketing correction + the `status.open`
  gray-vs-white text divergence MUST be recorded in the reconciliation note (`docs/DESIGN_SYSTEM_SPEC.md`)

### Requirement: Token Reconciliation Keeps the Pipeline Green
Regenerating the tokens MUST keep the build, token validator, token-purity lint, and unit suite green, with the
generated outputs in sync with the JSON SSOT.

#### Scenario: Deterministic gates pass after regeneration
- GIVEN the updated SSOT + regenerated `scripts/generated-tokens.{js,css}`
- WHEN `npm run validate:tokens`, `npm run lint:tokens`, `npm run build`, and `npm run clean:test-db && npm run test:unit` run
- THEN all MUST pass — tokens valid + in sync, no new off-token literal (the purity baseline does not increase), the
  app builds, and the unit suite is green

**Acceptance Criteria:**
- 6 status radials + 6 status borders present; `shadow.sm`/`lg` + spacing `80`/`96` added; category pinned (marketing #4cacff, design rose); no legacy key removed
- `validate:tokens` + `lint:tokens` + `build` + `test:unit` green; generated outputs regenerated + in sync
- The marketing #0088ff→#4cacff correction + the `status.open` text divergence recorded in `docs/DESIGN_SYSTEM_SPEC.md`
