# Typography — font licence decision & type layer

**Created:** 2026-06-14 · **Owner change:** `typography-system` (Phase 0 #4)
**Provenance:** `docs/DESIGN_SYSTEM_SPEC.md` §1.4 / RC-9, `docs/DESIGN_SPECS.md` §7.3 (the SVG text is outlined to
paths — zero `font-family` references, so the redesign's fonts are unrecoverable from source artifacts).

> **Type-axis fidelity is CAPPED (dev stage).** The redesign's intended fonts are **not web-embeddable**, so the
> app ships the closest freely-licensed substitutes. Pixel-exact type awaits a licensed font (see *Swap-in path*).

## 1. Licence finding

| Intended font | Role | Web-embeddable? | Why |
|---|---|---|---|
| **SF Compact** (San Francisco) | display / UI / body | **No** | Apple proprietary; the licence permits use essentially only on Apple platforms — it cannot be self-hosted/served as a web font for a general Next.js site. |
| **NKDy Mono** | monospace data | **No** | Not a generally-available or licensable web font; no distributable web files. |

Because neither can be embedded, pixel-exact type to the (presumed-SF) reference is **not achievable on the web**.
This was the planning doc's single biggest fidelity risk, and it is now resolved by an explicit substitute
decision rather than left blocking.

## 2. Dev-stage substitute decision (closest resemblance)

| Token | Substitute | Licence | Why it's the closest resemblance |
|---|---|---|---|
| `font/sans` (`--font-sans`) | **Inter** | SIL OFL 1.1 | Purpose-built as a free, metrics-close alternative to Apple's San Francisco; near-equivalent x-height, humanist-grotesque proportions, and UI legibility at small sizes. Covers display / h1 / h2 / title / body / label / caption. |
| `font/mono` (`--font-mono`) | **JetBrains Mono** | SIL OFL 1.1 | Free, widely-available monospace with a clean, slightly-condensed rhythm suitable for the redesign's tabular data (`300 400 ₽`, codes) in place of NKDy Mono. |

Both are **self-hosted** as `woff2` under `app/fonts/` (with OFL licence text committed alongside) and loaded via
`next/font/local` for **deterministic, offline-safe builds**. Weights shipped: Inter 400/500/600/700 (matching the
`type/*` weight tokens); JetBrains Mono 400.

## 3. Binding to the type tokens

- `openspec/specs/ui/design-tokens.json` → `font.family.{sans,mono}` reference the `--font-sans` / `--font-mono`
  variables; `scripts/parse-design-tokens.js` emits a `fontFamily` group; `tailwind.config.ts` consumes it
  (`font-sans`, `font-mono`).
- `app/fonts.ts` loads the substitutes via `next/font/local` (`variable: --font-sans / --font-mono`,
  `display: 'swap'`, `adjustFontFallback: 'Arial'`); `app/layout.tsx` applies the variables on `<html>` and sets
  `font-sans` as the default body family.
- The existing `type/*` size/weight/line-height tokens (from `design-token-engine`) are applied through the roles,
  so a role yields **family + size + weight + line-height** together. Mono data uses `font-mono`.

## 4. No layout shift (CLS)

`next/font` generates a **size-adjusted fallback** (`adjustFontFallback: 'Arial'`) and uses `display: 'swap'`, so
the fallback metrics approximate the web font and there is no measurable layout shift on font load. The change is
global and token-driven, so the adjustment applies uniformly.

## 5. Measured metric deltas (substitute vs intended reference)

Exact reference metrics are not directly measurable (text is outlined to paths), so deltas are recorded against
the known design intent and the substitute's published metrics:

| Metric | SF Compact (intended) | Inter (substitute) | Delta / note |
|---|---|---|---|
| x-height | tall, ~0.53 em | ~0.55 em (UPM 2048) | Inter slightly taller x-height → marginally larger optical size; absorbed by the token line-heights. |
| Cap-height | ~0.71 em | ~0.73 em | Within ~2–3%; not visually significant at UI sizes. |
| Advance width | SF Compact is condensed | Inter is slightly wider | Longest risk for fixed-width controls; verify long RU labels at 1440px when `fidelity-harness` lands. |
| Mono advance | NKDy Mono (condensed) | JetBrains Mono (normal) | Mono cells slightly wider; acceptable for dev-stage tabular data. |

These are **dev-stage approximations**. Precise per-glyph deltas and the per-screen pixel comparison are
**deferred to `fidelity-harness`** (Phase 0 #9), which will diff composed screens at 1440px against the reference.

## 6. Capped fidelity & swap-in path

- **Capped:** the type axis cannot pass an exact pixel fidelity-diff until a licensed reference font is embedded.
  `fidelity-harness` should **mask or tolerance-adjust** type regions, or treat type deltas as known-capped, until
  then.
- **Swap-in path (single source change):** obtain a licensed `SF Compact` (or agreed equivalent) + the real mono,
  drop the `woff2` into `app/fonts/`, and point `app/fonts.ts`'s `src` at them. The `--font-sans` / `--font-mono`
  variable contract, the `font.family` tokens, and every consumer stay **unchanged** — no component edits.

## 7. Scope note

This layer binds **families** only; the type **scale** (sizes/weights/line-heights) was shipped by
`design-token-engine`. No components/screens are restyled here (the pre-launch app inherits the new family
globally). The pixel fidelity gate is `fidelity-harness`.
