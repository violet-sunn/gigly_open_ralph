# Spec delta — ui (adopt-design-fonts)

Re-grounds the type layer on `gigly_full_design`'s **sanctioned free-Cyrillic substitution**: NKDuy Mono →
**Handjet** (`--font-mono`, the accent/pixel face), Vremena Grotesk → **Manrope** (`--font-grotesk`, NEW), SF Compact
→ **system stack** (`--font-sans`). Replaces the dev-stage Inter + JetBrains Mono guesses and **retires the F1 font
cap**. The `--font-sans`/`--font-mono` contract names stay stable; `font-grotesk` is added.

## MODIFIED Requirements

### Requirement: Type Layer Binds the Sanctioned Design Fonts
The type layer MUST bind the design's sanctioned free-Cyrillic substitution rather than the dev-stage guesses. The
accent face (`--font-mono`, powering the `display / h1 / mono / mono-small` roles) MUST resolve **Handjet**; the
primary face (`--font-sans`, powering `h2 / title / body / label / label-bioname / caption`) MUST resolve a
**system font stack**; and a NEW grotesk face (`--font-grotesk`) MUST resolve **Manrope**. Handjet and Manrope MUST
be self-hosted at build (`next/font/google`, Cyrillic subset, no runtime Google request). Inter and JetBrains Mono
MUST NOT remain wired as the type families. The stable `--font-sans` / `--font-mono` contract names MUST be preserved (consumers and the
semantic `fontFamily.*` tokens are unchanged), so the heading/data roles adopt Handjet and the body roles adopt the
system stack with no per-token re-tagging.

#### Scenario: The three families resolve to the sanctioned substitutes
- GIVEN the running app
- WHEN a `font-mono` (display/h1) element, a `font-sans` (body) element, and a `font-grotesk` element render
- THEN `--font-mono` MUST resolve **Handjet**, `--font-sans` MUST resolve the **system stack**, and `--font-grotesk`
  MUST resolve **Manrope**
- AND `app/fonts.ts` MUST self-host Handjet + Manrope via `next/font/google` (build-time, no runtime Google request),
  and MUST NOT load Inter or JetBrains Mono

#### Scenario: Token pipeline regenerated and in sync
- GIVEN `openspec/specs/ui/design-tokens.json` `font.family` updated (accent → Handjet, primary → system, + `grotesk`
  → Manrope) and `scripts/parse-design-tokens.js` emitting the `grotesk` family
- WHEN `scripts/generated-tokens.{js,css}` are regenerated and `tailwind.config.ts` consumes `...tokens.fontFamily`
- THEN `npm run validate:tokens` MUST pass (generated outputs in sync), a `font-grotesk` utility MUST exist, and the
  `fontFamily` descriptions MUST name the real substitutes (no "dev sub: Inter / JetBrains Mono")

#### Scenario: Type layer is buildable, lint-clean, and suite-green
- GIVEN the change
- WHEN `npm run build`, `npm run lint:tokens`, and `npm run clean:test-db && npm run test:unit` run
- THEN all MUST pass — the body renders `font-sans`, headings render `font-mono`, and the existing typography
  assertions (the `font-mono` class is still applied) MUST still hold

## ADDED Requirements

### Requirement: Grotesk (Manrope) Family Available for the Vremena Roles
The type system MUST expose a `font-grotesk` family (Manrope) — a `fontFamily.grotesk` token + `--font-grotesk`
variable + Tailwind `font-grotesk` utility — for the Vremena Grotesk roles (numbers, gig price/term, message bodies,
job-experience). This change MUST wire and exercise it (token + utility + a workbench typography sample); per-screen
adoption MAY land incrementally with the Phase-3 reconciliations.

#### Scenario: font-grotesk is wired and exercised
- GIVEN the regenerated tokens + Tailwind config
- WHEN the workbench typography showcase renders
- THEN a `font-grotesk` sample MUST render in Manrope, and the `font-grotesk` utility MUST be available to screens
- AND applying `font-grotesk` MUST NOT introduce any off-token literal (token-purity lint stays green)

### Requirement: The F1 Font-Licence Cap Is Retired
The "type fidelity is CAPPED — fonts not web-embeddable" framing MUST be retired across the docs and planning risk
lists, replaced by the sanctioned substitution recorded as system fact. `docs/TYPOGRAPHY.md` §1–§2 MUST state the
resolved Handjet / Manrope / system mapping (not a cap), and the font-licence risk MUST be struck from
`openspec/planning/figma-grounded-ui-reconciliation.md` and the `design-token-engine-prep` / `figma-mcp-access`
memories.

#### Scenario: Docs and planning no longer frame type fidelity as capped
- GIVEN `docs/TYPOGRAPHY.md` and the planning docs after this change
- THEN they MUST describe the Handjet / Manrope / system substitution as the sanctioned target (system fact)
- AND they MUST NOT state that the font licence caps the F1 ≤1% gate; the F1 gate's only remaining dependency is the
  Phase-4 re-baseline, not the fonts
