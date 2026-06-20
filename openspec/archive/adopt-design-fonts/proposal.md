# adopt-design-fonts

**Type:** Regular change (design-system / type layer)
**Created:** 2026-06-19
**Plan:** `openspec/planning/full-design-reground.md` — Phase 0 (re-ground the source of truth)
**Capability:** `ui` (the type layer / font tokens in `openspec/specs/ui/spec.md`)
**Depends on:** none (re-grounds `typography-system`).

## Why

The type layer ships **dev-stage guesses** — `--font-sans` = Inter, `--font-mono` = JetBrains Mono — chosen back when
the redesign's intended families (SF Compact, NKDuy Mono) were declared un-embeddable and the licence was the
**single biggest fidelity risk** capping F1 ≤1% (`docs/TYPOGRAPHY.md` §1, the planning doc's risk list).

The new authoritative handoff `gigly_full_design/` **resolves that risk** — it makes an explicit, sanctioned
free-Cyrillic substitution (README + `HANDOFF.md`):

| Figma family | Role | Substitute (sanctioned) | License |
|---|---|---|---|
| **NKDuy Mono** | pixel headings, logomark, mono data (`--font-family-accent`) | **Handjet** | SIL OFL |
| **Vremena Grotesk** | grotesk + numbers — gig price/term, message bodies, job-experience | **Manrope** | SIL OFL |
| **SF Compact** | UI / body (`--font-family-primary`) | **system stack** | n/a |

Two things changed vs the current kit. First, the accent face is **Handjet — a pixel typeface**, not the
JetBrains Mono monospace; the brand's pixel-heading aesthetic comes from Handjet, so swapping it is a real visual
correction, not a like-for-like. Second, the design uses a **third family** (Vremena → Manrope) for numbers/grotesk
that the current two-family (sans/mono) model has no slot for. Adopting the sanctioned substitution turns the type
layer from "closest guess, fidelity capped" into **system fact**, and retires the F1 font cap.

## What

- **Load the three real families** (replacing Inter + JetBrains Mono):
  - `--font-mono` (the accent / NKDuy role) → **Handjet** via `next/font/local` (self-hosted woff2).
  - `--font-grotesk` (NEW, the Vremena role) → **Manrope** via `next/font/local`, exposed as a `font-grotesk`
    Tailwind utility + `fontFamily.grotesk` token.
  - `--font-sans` (the SF Compact role) → **system stack** (drop the self-hosted Inter; `--font-sans` becomes the
    explicit system font stack).
- **Keep the `--font-sans` / `--font-mono` contract names stable** (the documented stable contract). All
  `display / h1 / mono / mono-small` roles already resolve `--font-mono`, so they adopt **Handjet** with **zero
  token re-tagging**; all `h2 / title / body / label / caption` roles resolve `--font-sans` and adopt the **system
  stack**. The `--font-mono`/`font-mono` token name is retained for contract stability even though it now resolves
  the Handjet *pixel/accent* face (noted in the docs).
- **Expose `font-grotesk` (Manrope)** as a first-class, available family for the Vremena Grotesk roles. This change
  **wires and exercises** it (token + Tailwind utility + workbench typography sample); the per-component adoption
  (gig price/term, message bodies, job-experience) lands as those screens are reconciled in Phase 3 — recorded as a
  deliberate forward-pointer, not an omission.
- **Regenerate** `scripts/generated-tokens.{js,css}` from the updated `openspec/specs/ui/design-tokens.json`
  (`font.family` descriptions → the real substitutes; add `grotesk`) via `scripts/parse-design-tokens.js`.
- **Retire the F1 font cap** — rewrite `docs/TYPOGRAPHY.md` §1–§2 (the "type fidelity is CAPPED" framing → the
  resolved free-Cyrillic substitution as system fact) and strike the font-licence risk from the planning docs +
  the `design-token-engine-prep` / `figma-mcp-access` memories.

## Key facts / decisions

- **`--font-mono` is kept as the contract name for the accent face**, now Handjet. Renaming to `--font-pixel` would
  churn every consumer and the docs' "stable contract" promise; the name is retained, the resolution changes.
- **Inter is dropped, not kept as a fallback role.** The design specifies SF Compact → *system stack*; `--font-sans`
  becomes the system stack (`-apple-system, system-ui, Segoe UI, Roboto, sans-serif`). The Inter/JetBrains woff2 are
  removed; their OFL texts may stay as history.
- **Manrope is wired but adopted incrementally.** Forcibly re-tagging every numeric/price/message-body usage to
  `font-grotesk` now would balloon scope and risk; the family is made available + exercised here, and the
  reconciliations apply it on the prototype (Phase 3). Token-purity is unaffected (font tokens, not literals).

## Scope

- **Font loading:** `app/fonts.ts` (Handjet for `--font-mono`, Manrope for `--font-grotesk`, drop Inter; sans →
  system), `app/layout.tsx` (apply the Handjet + Manrope variables; `--font-sans` system stack), `app/fonts/`
  (add Handjet + Manrope woff2 + OFL; remove Inter/JetBrains woff2), `app/globals.css` (define `--font-sans` system
  stack if not variable-provided).
- **Tokens:** `openspec/specs/ui/design-tokens.json` (`font.family` + add `grotesk`), `scripts/parse-design-tokens.js`
  (emit `grotesk`), regenerated `scripts/generated-tokens.{js,css}`, `tailwind.config.ts` (consumes `fontFamily`
  incl. `grotesk` automatically via `...tokens.fontFamily`).
- **Docs/risk:** `docs/TYPOGRAPHY.md`, `openspec/planning/full-design-reground.md` (check Phase 0 item),
  `openspec/planning/figma-grounded-ui-reconciliation.md` (strike the font risk), the two memories.
- **Workbench:** the typography showcase exercises all three families (incl. `font-grotesk`).

## Non-goals

- The per-component re-tagging of every Vremena/number usage to `font-grotesk` (Phase 3 screen reconciliations).
- Licensed original SF Compact / NKDuy Mono / Vremena Grotesk files (the substitution is now the sanctioned target,
  not an interim).
- The light theme (Phase 1) — fonts are theme-invariant (Handjet + brand unchanged across themes).
- Re-running the F1 pixel gate itself (Phase 4 `refidelity-from-full-design`); this change only *unblocks* it.

## References

`gigly_full_design/README.md` + `HANDOFF.md` (the font substitution table); `gigly_full_design/design-system/fig-tokens.css`
(`--font-family-accent`/`-primary`); `app/fonts.ts`, `app/layout.tsx`, `docs/TYPOGRAPHY.md`; the token pipeline
`openspec/specs/ui/design-tokens.json` → `scripts/parse-design-tokens.js` → `scripts/generated-tokens.*` →
`tailwind.config.ts`.
