# Typography — font substitution & type layer

**Created:** 2026-06-14 · **Owner change:** `typography-system` (Phase 0 #4) · **Resolved:** `adopt-design-fonts`
(2026-06-19) — the authoritative handoff `gigly_full_design/` fixes the substitution; the F1 type cap is retired.
**Provenance:** `docs/DESIGN_SYSTEM_SPEC.md` §1.4 / §10 (type scale re-sourced from the Figma `tokens` frame,
2026-06-17); `gigly_full_design/README.md` + `HANDOFF.md` + `styles.css` (the sanctioned font-substitution map).

> **Type fidelity is no longer capped.** The redesign's intended fonts are not web-embeddable, but the design now
> specifies concrete free, Cyrillic-capable substitutes — adopted here as **system fact**. The F1 ≤1% gate's only
> remaining dependency is the Phase-4 re-baseline (`refidelity-from-full-design`), not the fonts.

## 1. The intended families (not web-embeddable) → sanctioned substitutes

| Intended font | Role | Embeddable? | Sanctioned substitute |
|---|---|---|---|
| **SF Compact** (San Francisco) | UI / body (`primary`) | **No** (Apple proprietary) | **system stack** (`-apple-system, system-ui, "Segoe UI", Roboto, …`) |
| **NKDy Mono** | logo, pixel headings, mono data (`accent`) | **No** (no distributable web files) | **Handjet** (SIL OFL) |
| **Vremena Grotesk** | grotesk / numbers — gig price/term, message bodies, job-experience | **No** | **Manrope** (SIL OFL) |

The substitution is the design's own decision (`gigly_full_design/styles.css` font-map), not an interim guess. It is
therefore the **target**, recorded as system fact — what was the planning doc's single biggest fidelity risk is closed.

## 2. The substitution (sanctioned, OFL / system)

| Contract var | Family | Source | Covers |
|---|---|---|---|
| `font/sans` (`--font-sans`) | **system stack** | OS-native (no web font; set in `app/globals.css`) | the **sans** roles: h2 / title / body / label / label-bioname / caption (SF Compact role). |
| `font/mono` (`--font-mono`) | **Handjet** (pixel) | `next/font/google` (self-hosted at build) | the **accent** roles: display / h1 headings, logomark, mono / mono-small (`30 000 ₽`, codes) — the NKDuy Mono pixel face. The contract name `mono` is retained for stability though the face is a pixel display font, not a monospace. |
| `font/grotesk` (`--font-grotesk`) | **Manrope** | `next/font/google` (self-hosted at build) | the **Vremena Grotesk** roles: numbers, gig price/term, message bodies, job-experience. Available kit-wide; adopted per-screen during the Phase-3 reconciliations. |

Handjet + Manrope are **self-hosted at build** via `next/font/google` (no runtime Google request; the Cyrillic
subset + variable axes are handled automatically). `--font-sans` is the OS **system stack** (no web font), set in
`app/globals.css`. Because both web fonts are **variable**, the heading weights (Figma H1 600 / H2 500) are native —
there is no shipped-weight gap (the old JetBrains-Mono-400-only residual is resolved).

## 3. Binding to the type tokens

- `openspec/specs/ui/design-tokens.json` → `font.family.{sans,mono,grotesk}` reference the `--font-sans` /
  `--font-mono` / `--font-grotesk` variables; `scripts/parse-design-tokens.js` emits a `fontFamily` group;
  `tailwind.config.ts` consumes it (`font-sans`, `font-mono`, `font-grotesk`).
- `app/fonts.ts` loads Handjet (`--font-mono`) + Manrope (`--font-grotesk`) via `next/font/google`
  (`subsets: ['latin','cyrillic']`, `display: 'swap'`); `app/layout.tsx` applies those variables on `<html>` and
  keeps `font-sans` (the system stack, defined in `globals.css`) as the default body family.
- The `type/*` tokens (re-sourced from Figma, 2026-06-17) carry **size + line-height + weight + letter-spacing +
  per-role family** (`sans`/`mono`). The parser emits `fontSize` / `lineHeight` / `fontWeight` / `letterSpacing`
  groups plus a per-role `fontFamily` entry, so `text-display font-display tracking-display` yields the full style
  (mono/accent face, 32px, 600, −0.5px). Headings (display/h1) and data (mono/mono-small) resolve `font-mono`.

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

This layer binds **font files** (the licence decision + substitutes) only. The type **scale** — sizes, weights,
line-heights, letter-spacing, and per-role family assignment — is owned by the token engine and was reconciled to
the real Figma metrics on 2026-06-17 (`DESIGN_SYSTEM_SPEC.md` §1.4 / §10). No components/screens are restyled here
(the pre-launch app inherits the families globally). The pixel fidelity gate is `fidelity-harness`.
