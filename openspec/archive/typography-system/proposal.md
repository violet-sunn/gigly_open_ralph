# Change Proposal: typography-system

> Phase 0, change 4 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It implements the **type layer**: it binds real font families to the type tokens that `design-token-engine`
> already emitted (`type/display`, `h1`, `h2`, `title`, `body`, `label`, `caption`, `mono` — size/weight/
> line-height), and resolves the long-standing **font residual** flagged forward from `derive-design-system`
> (`docs/DESIGN_SYSTEM_SPEC.md` §1.4 / RC-9) and `docs/DESIGN_SPECS.md` §7.3.

## Problem Statement

The SVG text is **outlined to paths** (zero `font-family` references), so the redesign's fonts are unrecoverable
from the source artifacts. `derive-design-system` named the intended families — **SF Compact** (display/UI) and
**NKDy Mono** (mono) — and `design-token-engine` shipped the type **scale** (sizes/weights/line-heights as
`type/*` tokens). But:

- **No fonts are loaded.** `app/layout.tsx` has **no `next/font`** usage and there are no font files in the repo;
  text currently renders in the browser default. There is no `fontFamily` binding in `tailwind.config.ts`.
- **SF Compact is the hard blocker.** SF Compact / San Francisco is **Apple's** typeface; its licence permits use
  essentially only on Apple platforms — it is **not web-embeddable** for a general Next.js web app. So pixel-exact
  type to the (presumed-SF) reference is **not achievable** on the web; this is the single biggest fidelity risk
  the planning doc called out.
- **NKDy Mono** is not a generally-available/licensable web font either.

So the type layer cannot be "the exact font." Per the brief and the explicit instruction *"if not possible, just
find the closest resemblance for the dev stage,"* this change makes the **licence decision explicit**, embeds the
**closest freely-licensed substitutes** for the dev stage, binds them to the type tokens, and **flags capped
fidelity** — structured so swapping in a real licensed font later is a one-line change behind a stable CSS-variable
contract.

## Proposed Solution

Resolve the residual with a documented decision, then implement substitute-backed, token-bound, CLS-safe fonts.

1. **Font licence decision (the BLOCKER), documented.** Record in `docs/TYPOGRAPHY.md` (a) that SF Compact and
   NKDy Mono are **not web-licensable/embeddable**, (b) the chosen **dev-stage substitutes** and why they are the
   closest resemblance, (c) **measured metric deltas** vs the reference, and (d) the **swap-in path** to real
   licensed fonts (replace the font source; the `--font-sans` / `--font-mono` variable contract stays). Mark
   **fidelity as capped** on the type axis until a licensed font is obtained.
2. **Closest-resemblance substitutes (dev stage):**
   - **SF Compact (display/UI/body) → Inter** — purpose-built as a close, freely-licensed (SIL OFL) alternative to
     SF with near-equivalent metrics; covers display/heading/title/body/label/caption.
   - **NKDy Mono → a freely-licensed monospace** (e.g. **JetBrains Mono**, OFL) for `type/mono` data (`300 400 ₽`,
     codes).
   These are loaded **self-hosted via `next/font/local`** (deterministic, offline-safe, no build-time network) —
   `next/font/google` is an acceptable alternative where network is available.
3. **Token binding.** Add a `font.family` group to `openspec/specs/ui/design-tokens.json` (`sans`, `mono`)
   referencing the `--font-sans` / `--font-mono` variables, regenerate via `scripts/parse-design-tokens.js`
   (extended to emit `fontFamily`), and wire `tailwind.config.ts` `fontFamily` from the tokens. The existing
   `type/*` size/weight/line-height tokens are applied through the type roles so a heading uses the bound family
   **and** the token metrics.
4. **CLS-safe loading + metric verification.** Load fonts with `next/font` fallback-metric adjustment
   (`display: 'swap'`, automatic `adjustFontFallback`/`size-adjust`) so there is **no layout shift**. Record the
   measured glyph-metric deltas; the full per-screen pixel **fidelity-diff is deferred to `fidelity-harness`**
   (Phase 0 #9, not yet built) — this change verifies metrics deterministically and documents the residual.

## Constraints

### MUST Requirements
- The SF Compact / NKDy Mono **web-licensability** MUST be determined and **documented** in `docs/TYPOGRAPHY.md`,
  including the dev-stage substitute decision, measured deltas, and the swap-in path for real licensed fonts.
- Fonts MUST be loaded via **`next/font`** (`local` self-hosted preferred; `google` acceptable) with CSS-variable
  bindings (`--font-sans`, `--font-mono`) applied at the app root, configured to **avoid layout shift**.
- A `font.family` token group MUST be added to `design-tokens.json` and `tailwind.config.ts` `fontFamily` MUST
  consume it; the `type/*` roles MUST apply family **+** size + weight + line-height together (mono role → mono
  family; text roles → sans family).
- `npm run build` and `npm run test:unit` MUST stay green; the **token-purity lint MUST still pass** (no raw font
  literals introduced outside the token/font system).
- If SF Compact is not web-licensable (expected), the change MUST **flag capped fidelity** on the type axis and
  proceed with the closest substitute for the dev stage (per the explicit fallback instruction).

### SHOULD Requirements
- Substitutes SHOULD be **SIL OFL / freely licensed** and metric-close (Inter for SF; a close OFL mono for NKDy),
  self-hosted as `woff2` for deterministic, offline builds.
- The implementation SHOULD keep the real-font swap to a **single source change** behind the `--font-*` variables.
- Measured deltas SHOULD note cap-height / x-height / advance-width differences where determinable from the
  reference renders.

### Non-Goals
- **No pixel fidelity gate.** The per-screen pixel fidelity-diff harness is `fidelity-harness` (Phase 0 #9); this
  change verifies metrics + documents the residual, it does not build the diff harness.
- **No new type scale.** Sizes/weights/line-heights already exist as `type/*` tokens (`design-token-engine`); this
  change binds *families*, it does not re-derive the scale.
- **No component/screen restyling.** Primitives/blocks/screens consume the type roles later; this change does not
  recompose UI (the pre-launch app keeps rendering; only the font family/metrics change globally).
- **No purchase of a commercial SF licence** — out of scope; the swap-in path is documented for when one exists.

## Success Criteria

1. `docs/TYPOGRAPHY.md` exists and documents the licence finding (SF Compact not web-embeddable), the dev-stage
   substitutes (Inter for SF, an OFL mono for NKDy), measured deltas, capped-fidelity flag, and the swap-in path.
2. Fonts load via `next/font` with `--font-sans` / `--font-mono` applied at the root and CLS-safe configuration.
3. `font.family` tokens exist in `design-tokens.json`; `tailwind.config.ts` `fontFamily` consumes them; a sample
   heading and label render with the bound family **and** the `type/*` metrics.
4. `npm run build` passes, `npm run test:unit` is green, and `npm run lint:tokens` still passes.

## Affected Areas

- `docs/TYPOGRAPHY.md` (new — licence decision, substitutes, deltas, swap-in path)
- `app/layout.tsx` (load `next/font`, apply `--font-sans`/`--font-mono` on `<html>`/`<body>`)
- `app/fonts/` or `public/fonts/` (self-hosted OFL `woff2` for `next/font/local`)
- `openspec/specs/ui/design-tokens.json` (add `font.family`) + `scripts/parse-design-tokens.js` (emit `fontFamily`)
  + regenerated `scripts/generated-tokens.{js,css}`
- `tailwind.config.ts` (`fontFamily` from tokens; ensure type roles bind size/weight/line-height)
- read-only inputs: `docs/DESIGN_SYSTEM_SPEC.md` §1.4 (type scale + residual), `docs/DESIGN_SPECS.md` §7.3
- `openspec/specs/ui/spec.md` (spec delta)
- a fresh unit test (font binding / token integrity) under `__tests__/unit/`

## Risks & Mitigations

**Risk**: SF Compact cannot be embedded → type cannot be pixel-identical to the reference.
**Mitigation**: This is the expected, documented outcome. Use Inter (closest OFL substitute), record deltas, flag
capped fidelity, and keep a one-line swap-in path. The brief and the user explicitly accept "closest resemblance
for the dev stage."

**Risk**: `next/font/google` needs build-time network; an offline build fails.
**Mitigation**: Default to **`next/font/local`** with self-hosted `woff2` committed to the repo — deterministic and
offline-safe. `google` is a documented alternative only where network is available.

**Risk**: Swapping the global font shifts layout (CLS) across the running app.
**Mitigation**: `next/font` computes fallback metrics (`adjustFontFallback`/`size-adjust`) and `display: 'swap'`;
verify no layout shift. Because metrics are token-driven and applied globally, the change is uniform.

**Risk**: Re-introducing raw font literals (font-family strings) trips the token system.
**Mitigation**: Families live as `font.family` tokens + the `--font-*` variables from `next/font`; `tailwind`
`fontFamily` references them. `npm run lint:tokens` stays green.

**Risk**: "Fidelity-diff" can't run — `fidelity-harness` doesn't exist yet.
**Mitigation**: Scope this change's verification to deterministic metric checks + a documented delta table; the
per-screen pixel diff is explicitly deferred to `fidelity-harness` (Phase 0 #9).

**Risk**: NKDy Mono's exact look (appears pixel/condensed) is hard to match.
**Mitigation**: Pick the closest OFL mono for the dev stage, document the delta, and leave the swap-in path; exact
match awaits the real font/licence.
