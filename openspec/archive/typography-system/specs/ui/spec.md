# UI Specification Delta: typography-system

This document contains specification changes for the `typography-system` change.

Scope note: these requirements cover the **type layer** — resolving the font residual (SF Compact / NKDy Mono are
not web-embeddable), embedding the closest freely-licensed **substitutes** for the dev stage, binding font
families to the `type/*` tokens that `design-token-engine` already shipped, and verifying metrics without layout
shift. They do **not** build the pixel fidelity-diff harness (`fidelity-harness`), re-derive the type scale, or
restyle components. Fidelity on the type axis is **capped** until a licensed font is obtained.

---

## ADDED Requirements

### Requirement: Font Licence Resolution and Decision
The web-licensability of SF Compact (display/UI) and NKDy Mono (mono) MUST be determined and documented, and a
dev-stage decision MUST be recorded in `docs/TYPOGRAPHY.md` — including the chosen substitutes, measured deltas,
the capped-fidelity flag, and the swap-in path to real licensed fonts.

#### Scenario: Licence finding is documented
- GIVEN SF Compact is Apple's typeface and NKDy Mono is not a generally-available web font
- WHEN `docs/TYPOGRAPHY.md` is inspected
- THEN it MUST state that SF Compact / NKDy Mono are not web-embeddable for this app
- AND it MUST reference the residual provenance (`docs/DESIGN_SYSTEM_SPEC.md` §1.4 / `docs/DESIGN_SPECS.md` §7.3)

#### Scenario: Dev-stage substitutes are selected with rationale
- GIVEN the fonts cannot be embedded
- WHEN the decision section is inspected
- THEN it MUST name a closest-resemblance substitute for the sans/display family (e.g. Inter for SF Compact) and
  for the mono family (e.g. an OFL monospace for NKDy Mono)
- AND each substitute MUST be freely licensed (e.g. SIL OFL) and justified as the closest available resemblance

#### Scenario: Capped fidelity and swap-in path are recorded
- GIVEN the substitute is not the exact reference font
- WHEN the document is inspected
- THEN it MUST flag fidelity as capped on the type axis until a licensed font is obtained
- AND it MUST describe the swap-in path: replacing the font source while keeping the `--font-sans` / `--font-mono`
  variable contract stable
- AND it MUST record the measured glyph-metric deltas (e.g. cap-height / x-height / advance) where determinable

**Acceptance Criteria:**
- `docs/TYPOGRAPHY.md` documents the licence finding, substitutes (sans + mono), capped-fidelity flag, deltas, and swap-in path
- Substitutes are freely licensed and justified as the closest resemblance

---

### Requirement: Font Loading via next/font Without Layout Shift
Fonts MUST be loaded via `next/font` (self-hosted `local` preferred; `google` acceptable) with CSS-variable
bindings applied at the app root, configured to avoid layout shift.

#### Scenario: Fonts load with CSS-variable bindings at the root
- GIVEN the substitute fonts
- WHEN `app/layout.tsx` is inspected
- THEN it MUST load them via `next/font` and expose `--font-sans` and `--font-mono` variables
- AND those variables MUST be applied on the root `<html>`/`<body>` so the whole app inherits the type families

#### Scenario: Loading is configured to avoid layout shift
- GIVEN font swapping can cause CLS
- WHEN the font loader configuration is inspected
- THEN it MUST use `display: 'swap'` and `next/font`'s fallback-metric adjustment (e.g. `adjustFontFallback` /
  size-adjust) so there is no layout shift
- AND a self-hosted `local` loader MUST reference committed `woff2` files (deterministic/offline) where used

#### Scenario: No raw font literals outside the font system
- GIVEN the token-purity discipline
- WHEN the change is inspected
- THEN font families MUST be expressed via the `--font-*` variables / `font.family` tokens, not hardcoded
  `font-family` strings scattered in components
- AND `npm run lint:tokens` MUST still pass

**Acceptance Criteria:**
- `next/font` loads sans + mono, binds `--font-sans`/`--font-mono` at the root, CLS-safe config
- Self-hosted `woff2` used for `local` loading where applicable; token-purity lint still passes

---

### Requirement: Family Tokens Bound to the Type Scale
A `font.family` token group MUST be added to `openspec/specs/ui/design-tokens.json` and `tailwind.config.ts`
`fontFamily` MUST consume it, so the `type/*` roles apply family together with the existing size/weight/
line-height tokens.

#### Scenario: Family tokens exist and regenerate cleanly
- GIVEN the token engine
- WHEN `design-tokens.json` and the generated outputs are inspected
- THEN `design-tokens.json` MUST contain a `font.family` group with `sans` and `mono` referencing the `--font-*`
  variables
- AND `node scripts/parse-design-tokens.js` MUST emit a `fontFamily` group into `scripts/generated-tokens.js`
  without error
- AND `npm run validate:tokens` MUST pass (no drift)

#### Scenario: Tailwind binds families to the type roles
- GIVEN `tailwind.config.ts`
- WHEN it is inspected
- THEN `fontFamily` MUST consume the family tokens (`font-sans` → sans, `font-mono` → mono)
- AND the `type/*` size/weight/line-height tokens MUST remain applied so a role yields family + size + weight +
  line-height together

#### Scenario: Mono role uses the mono family
- GIVEN monospace data (e.g. `300 400 ₽`, codes) uses `type/mono`
- WHEN the mono role is applied
- THEN it MUST resolve to the mono family (`--font-mono`)
- AND text roles (display/h1/h2/title/body/label/caption) MUST resolve to the sans family (`--font-sans`)

**Acceptance Criteria:**
- `font.family` tokens added + regenerated; `validate:tokens` passes
- Tailwind `fontFamily` consumes them; type roles bind family + metrics; mono role uses the mono family

---

### Requirement: Metric Verification and Capped Fidelity
The change MUST verify type metrics deterministically (no layout shift; a sample heading/label renders at the
token metrics with the bound family) and MUST flag that the full per-screen pixel fidelity-diff is deferred to
`fidelity-harness`.

#### Scenario: A sample heading/label renders at the token metrics
- GIVEN the bound type roles
- WHEN a sample heading (e.g. the 22px auth heading anchor) and a label are rendered/asserted
- THEN they MUST use the token font-size / line-height / weight and the bound family
- AND a deterministic test (unit/build) MUST confirm the binding (size + family present), not a visual guess

#### Scenario: No layout shift from the font swap
- GIVEN the global font change
- WHEN the app is built and rendered
- THEN `npm run build` MUST pass and the font loader's fallback-metric adjustment MUST be in place to prevent CLS
- AND `npm run test:unit` MUST stay green

#### Scenario: Full fidelity-diff is deferred and capped status recorded
- GIVEN `fidelity-harness` (the pixel-diff gate) is not yet built
- WHEN the verification scope is inspected
- THEN this change MUST document the measured metric deltas and explicitly defer the per-screen pixel diff to
  `fidelity-harness`
- AND it MUST record that type-axis fidelity is capped until a licensed SF Compact (or equivalent) is embedded

**Acceptance Criteria:**
- Deterministic metric/binding verification passes; `npm run build` + `npm run test:unit` green
- Measured deltas documented; pixel fidelity-diff deferred to `fidelity-harness`; capped fidelity recorded

---

## Test Plan

This change ships fonts + token bindings + documentation. Validation is by deterministic commands. Commands assume
the repo root.

### Licence decision doc
```bash
test -f docs/TYPOGRAPHY.md && echo "typography doc exists"
grep -qiE 'SF Compact|not .*(web|embed)|licen' docs/TYPOGRAPHY.md && echo "licence finding documented"
grep -qiE 'Inter|substitute|closest' docs/TYPOGRAPHY.md && echo "substitute documented"
grep -qiE 'cap(ped)? fidelity|swap' docs/TYPOGRAPHY.md && echo "capped fidelity + swap-in path"
```

### Font loading
```bash
grep -qE "next/font" app/layout.tsx && echo "next/font used"
grep -qE -- "--font-sans|--font-mono|variable:" app/layout.tsx && echo "font variables bound"
grep -qiE "display:\s*'swap'|adjustFontFallback|size-adjust" app/layout.tsx && echo "CLS-safe config"
# self-hosted woff2 (if local loader)
ls app/fonts/*.woff2 public/fonts/*.woff2 2>/dev/null | head && echo "(self-hosted fonts present if local)"
```

### Token binding + regeneration
```bash
grep -q '"family"' openspec/specs/ui/design-tokens.json && echo "font.family tokens present"
node scripts/parse-design-tokens.js && echo "parser clean"
grep -q "fontFamily" scripts/generated-tokens.js && echo "fontFamily emitted"
grep -q "fontFamily" tailwind.config.ts && echo "tailwind consumes fontFamily"
npm run validate:tokens && echo "token validation passes (no drift)"
```

### Build + suite + purity
```bash
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
npm run lint:tokens && echo "token-purity still passes"
```

### Manual review
1. Open `docs/TYPOGRAPHY.md`: confirm the SF/NKDy non-embeddability finding, the substitute choices + rationale,
   measured deltas, capped-fidelity flag, and the swap-in path behind `--font-sans` / `--font-mono`.
2. Render a page: confirm headings use the sans substitute at token sizes and mono data uses the mono substitute,
   with no visible layout shift on load.
3. Confirm the per-screen pixel fidelity-diff is explicitly deferred to `fidelity-harness`.
