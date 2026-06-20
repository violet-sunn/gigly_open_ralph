# reconcile-tokens-to-full-design

**Type:** Regular change (design-system / token layer)
**Created:** 2026-06-19
**Plan:** `openspec/planning/full-design-reground.md` — Phase 1 (token + theme foundation)
**Capability:** `ui` (the token SSOT `openspec/specs/ui/design-tokens.json` + generated outputs)
**Depends on:** `adopt-design-fonts` (archived — Phase 0). Sibling of `add-light-theme` (the light token values build on this).

## Why

The committed token layer was reconciled to a **partial** Figma export (2026-06-17, `reconcile-design-tokens-from-figma`)
and its core values **already AGREE** with the authoritative handoff. `gigly_full_design/design-system/fig-tokens.css`
(189 tokens) is the now-complete source, and it exposes a small set of **additive gaps + one value correction** the
partial export missed:

| Area | Authoritative source (`fig-tokens.css` / `Category.jsx`) | SSOT today | Action |
|---|---|---|---|
| **Status triads** | per status: `bg-radial-1/2/3` + `border` + `text` (completed/in-progress/new/rejected/review/testing) | `status.*` text only (6) + **one** radial (`status-completed-glow`) | **add** the 5 missing radials + the 6 border tints |
| **Shadows** | `shadow-sm / md / lg / focus` | `effect.shadow` has focus / card / md / popover | **add** `sm` + `lg` (keep card/popover as legacy aliases) |
| **Spacing** | `…/2xl 40 / 3xl 48 / 4xl 64 / 5xl 80 / 6xl 96` | numeric scale tops out at `16` (=64px) | **add** `80` + `96` to complete the scale |
| **Radius** | `0 / lt 2 / sm 4 / md 8 / lg 12 / special 16 / full` | `corner` xs 2 / sm 4 / md 8 / lg 12 / xl 16 / pill / full / circular | **already complete** (xl=special, xs=lt) — verify + annotate, no structural change |
| **Category blue** | `Category.jsx` blue = `rgb(76,172,255)` = **#4cacff** | `category.marketing` = **#0088ff** (brand) | **correct** marketing → #4cacff (the design's Category blue) |
| **Category label** | Дизайн = **rose** (`#f45fb1`, confirmed in `Category.jsx`) | `category.design` value #f45fb1 **labelled "pink"** | **rename** label pink → rose (value already correct) |

Everything else (surfaces, brand, the other 4 category hues, attention palette, typography metrics) is already faithful.
This change closes the residual token gaps so the status badges, card glows, elevation, and spacing render token-backed
(not from component literals), and pins the category↔hue mapping the old plan flagged as "raw hex, unbound."

## What

- **Status radial/border/text triads** — for each of the 6 statuses, ensure the full triad is token-backed, sourced
  from `fig-tokens.css` `--status-{name}-*` (mapping the Figma keys **new → open**, **testing → verification**):
  - **text** — the existing `color-semantic.status.{name}` leaves (unchanged; they already match, except `open` —
    see decisions).
  - **radial** — add `gradient.status-{open,in-progress,review,verification,rejected}-glow` (the 6th,
    `status-completed-glow`, already exists), each the `closest-side` radial from the status' `bg-radial-1/2/3` stops.
  - **border** — add a `color-semantic.status-border.{name}` namespace (6 leaves), each the status' `border` rgba
    (≈ 30% tint). **Additive** — the existing `status.*` colour leaves are NOT restructured (consumers like
    `text-status-completed` keep working).
- **Shadows** — add `effect.shadow.sm` (`0 1 2 0 rgba(0,0,0,.3)`) + `effect.shadow.lg` (`0 8 24 0 rgba(0,0,0,.5)`)
  from `fig-tokens.css`; `md`/`focus` already match. Keep `card`/`popover` as legacy aliases (the shim).
- **Spacing** — add `numbers.spacing` `20` (=80px, Figma `5xl`) + `24` (=96px, Figma `6xl`) to complete the scale;
  the numeric keys are kept (legacy shim — no t-shirt-name churn).
- **Radius** — verify the `corner` scale already covers the Figma radii (xl 16 = `special`, xs 2 = `lt`); annotate the
  mapping in the SSOT, no value/key change.
- **Category pin** — set `category.marketing` → **#4cacff** (the design's Category blue, = `brand.highlight`),
  relabel `category.design` description **pink → rose**; the other three (programming/development/coding) are
  confirmed unchanged. Record the marketing correction as a decision.
- **Regenerate** `scripts/generated-tokens.{js,css}` via `npm run tokens:generate` so Tailwind + the CSS-var mirror
  pick up every addition; the **legacy shim** (existing token names/keys) is preserved so no consumer churns.

## Key facts / decisions

- **`category.marketing` value correction (#0088ff → #4cacff).** The design's `Category.jsx` blue variant is
  `rgb(76,172,255)` = #4cacff (= the existing `brand.highlight` / Figma `color/primary/hover`), distinct from
  `brand.default` #0088ff. Per "the design is the source of truth," marketing adopts #4cacff. This is the **one value
  change** with visible effect (marketing tags get the lighter blue); it's reversible and flagged for designer
  confirmation. The other category hues already match `Category.jsx` exactly.
- **`status.open` text stays gray (#8a8f99), not white.** `fig-tokens.css` `status-new-text` is white
  (`rgb(255,255,255)`) with a white-based glow/border; the SSOT deliberately uses gray #8a8f99 for «Открыт»
  legibility. The **text** leaf is kept gray (a sanctioned divergence); the **radial + border** for `open` are added
  from the fig white-based stops (so the glow matches). Recorded as a decision.
- **Triads are additive, never restructuring.** Borders land in a new `status-border` namespace and radials in
  `gradient.*`; the existing `status.*` colour leaves (and their `text-/bg-/border-status-*` Tailwind utilities) are
  untouched — zero consumer churn.
- **Legacy shim preserved.** No existing token key is renamed or removed (spacing numeric keys, `corner` names,
  `shadow.card`/`popover`). Additions only.

## Scope

- **Token SSOT:** `openspec/specs/ui/design-tokens.json` (status radials + `status-border` + shadows `sm`/`lg` +
  spacing `20`/`24` + category marketing/design + radius annotation).
- **Generated outputs:** regenerated `scripts/generated-tokens.{js,css}` (via `scripts/parse-design-tokens.js`); the
  parser needs no change (it flattens `color-semantic` + emits `gradient`/`spacing`/`boxShadow` groups already).
- **Docs:** a token-reconciliation note in `docs/DESIGN_SYSTEM_SPEC.md` (§ token layer) recording the marketing
  correction + the open-text divergence; check the Phase-1 item in `full-design-reground.md`.

## Non-goals

- The **light theme** token values (`add-light-theme`, the Phase-1 sibling) — this change is the dark/base scale only.
- Re-tagging components to consume the new tokens (status badges, card glows) — the tokens are made available; the
  per-component adoption rides with the Phase-3 screen reconciliations. (Any component already hardcoding a status
  glow/border literal may be migrated opportunistically if it reduces the purity-lint baseline, but that is not required.)
- Renaming the numeric spacing scale to t-shirt names, or restructuring `status.*` (both would churn consumers).
- Changing the typography metrics (owned by `adopt-design-fonts` / the type tokens).

## References

`gigly_full_design/design-system/fig-tokens.css` (the 189-token authoritative set — status triads, shadows, spacing,
radius); `gigly_full_design/design-system/source/Category.jsx` (the authoritative category hues incl. blue #4cacff /
rose #f45fb1); the SSOT `openspec/specs/ui/design-tokens.json`; the pipeline `scripts/parse-design-tokens.js` →
`scripts/generated-tokens.{js,css}`; the guardrail `scripts/design-system/validate-tokens.js`.
