# Implementation Tasks: typography-system

> **The type layer.** Resolve the font residual (SF Compact / NKDy Mono are not web-embeddable), embed the closest
> freely-licensed **substitutes** for the dev stage via `next/font`, add `font.family` tokens bound to the
> `type/*` scale that `design-token-engine` shipped, and verify metrics without layout shift. Pixel fidelity-diff
> is deferred to `fidelity-harness`; type-axis fidelity is **capped** until a licensed font exists. Friction: low.

---

## Task 1: [x] Resolve licensability and author `docs/TYPOGRAPHY.md`

**Implementation Notes:**
- Determine + document that **SF Compact** (Apple's San Francisco; licence restricted to Apple platforms) and
  **NKDy Mono** (not a generally-available web font) are **not web-embeddable** for this Next.js app. Reference the
  residual provenance: `docs/DESIGN_SYSTEM_SPEC.md` §1.4 / RC-9 and `docs/DESIGN_SPECS.md` §7.3.
- Record the **dev-stage substitute decision** with rationale: **Inter** (SIL OFL) as the closest resemblance to
  SF Compact for sans/display/UI/body; a freely-licensed monospace (e.g. **JetBrains Mono**, OFL) for `type/mono`.
- Record the **capped-fidelity flag** (type axis), the **measured glyph-metric deltas** vs the reference where
  determinable (cap-height / x-height / advance), and the **swap-in path**: replace the font source while keeping
  the `--font-sans` / `--font-mono` variable contract stable.

**Test Plan:**
```bash
test -f docs/TYPOGRAPHY.md && echo "doc exists"
grep -qiE 'SF Compact|not .*(web|embed)|licen' docs/TYPOGRAPHY.md && echo "licence finding"
grep -qiE 'Inter|JetBrains|substitute|closest' docs/TYPOGRAPHY.md && echo "substitutes"
grep -qiE 'cap(ped)? fidelity' docs/TYPOGRAPHY.md && echo "capped flag"
grep -qiE 'swap|--font-sans|--font-mono' docs/TYPOGRAPHY.md && echo "swap-in path"
```
Expected: a complete decision doc (finding, substitutes, deltas, capped flag, swap-in path).

---

## Task 2: [x] Self-host the substitute fonts (OFL `woff2`)

**Implementation Notes:**
- Add the substitute font files as `woff2` under `app/fonts/` (e.g. `Inter` variable or the needed weights; the
  mono family) so `next/font/local` is **deterministic and offline-safe** (no build-time network).
- Commit the **OFL licence** text alongside the fonts (`app/fonts/OFL.txt` or per-family). Keep only the weights
  the type scale uses (400/500/600/700 per the `type/*` tokens) to limit payload.
- `next/font/google` is an acceptable alternative **only** where build-time network is available — prefer local.

**Test Plan:**
```bash
ls app/fonts/*.woff2 2>/dev/null | head && echo "woff2 present"
ls app/fonts/OFL* app/fonts/LICENSE* 2>/dev/null && echo "licence committed"
```
Expected: self-hosted `woff2` for sans + mono with OFL licence committed.

---

## Task 3: [x] Load fonts via `next/font` in `app/layout.tsx` (CLS-safe)

**Implementation Notes:**
- In `app/layout.tsx`, load the sans + mono via `next/font/local` (point at the Task 2 `woff2`), each with
  `variable: '--font-sans'` / `'--font-mono'`, `display: 'swap'`, and `next/font`'s fallback-metric adjustment
  (`adjustFontFallback` / size-adjust) to **prevent layout shift**.
- Apply the generated `className`/variables on the root `<html>` (or `<body>`) so the whole app inherits the
  families. While here, replace the stale inline `style={{ backgroundColor: 'var(--bg-surface-level-0)' }}` left on
  `<body>` (a dead post-cutover var) with the token-backed `bg-background` utility (keeps body bg correct).
- Do **not** hardcode `font-family` strings in components — families flow from the `--font-*` variables.

**Test Plan:**
```bash
grep -qE "next/font" app/layout.tsx && echo "next/font used"
grep -qE -- "variable:|--font-sans|--font-mono" app/layout.tsx && echo "variables bound"
grep -qiE "display:\s*'swap'|adjustFontFallback" app/layout.tsx && echo "CLS-safe"
grep -q "bg-surface-level-0" app/layout.tsx && echo "CHECK stale var remains" || echo "OK stale body var replaced"
```
Expected: fonts loaded, `--font-*` applied at root, CLS-safe config, stale body var removed.

---

## Task 4: [x] Add `font.family` tokens, extend the parser, wire Tailwind

**Implementation Notes:**
- Add a `font.family` group to `openspec/specs/ui/design-tokens.json`:
  `sans = "var(--font-sans), -apple-system, system-ui, sans-serif"`,
  `mono = "var(--font-mono), ui-monospace, SFMono-Regular, monospace"` (each as `{ "value": "…" }`).
- Extend `scripts/parse-design-tokens.js` to emit a `fontFamily` group (flatten `font.family` → string values)
  into `generated-tokens.js`, and optionally `--font-family-*` CSS vars into `generated-tokens.css`. Keep existing
  behaviour intact.
- In `tailwind.config.ts`, add `fontFamily: { ...tokens.fontFamily }` so `font-sans` / `font-mono` resolve to the
  bound families. Regenerate tokens (`node scripts/parse-design-tokens.js`).

**Test Plan:**
```bash
grep -q '"family"' openspec/specs/ui/design-tokens.json && echo "family tokens present"
node scripts/parse-design-tokens.js && echo "parser clean"
grep -q "fontFamily" scripts/generated-tokens.js && echo "fontFamily emitted"
grep -q "fontFamily" tailwind.config.ts && echo "tailwind consumes fontFamily"
npm run validate:tokens && echo "no drift"
```
Expected: `font.family` tokens added; parser emits `fontFamily`; Tailwind consumes it; validation passes.

---

## Task 5: [x] Bind families to the type roles (sans for text, mono for data)

**Implementation Notes:**
- Ensure the body/root default family is `font-sans` (via the `--font-sans` variable on `<html>` + Tailwind base),
  so display/h1/h2/title/body/label/caption inherit the sans substitute at their `type/*` metrics.
- Ensure monospace data uses `font-mono` (the `--font-mono` family). Confirm the `type/*` size/weight/line-height
  tokens (already in `tokens.fontSize`/`lineHeight`/`fontWeight`) remain applied so a role yields family **+**
  metrics together.

**Test Plan:**
```bash
# sans is the default family at root; mono available
grep -qE "font-(sans|mono)|--font-(sans|mono)" app/layout.tsx app/globals.css && echo "families applied"
grep -qE '"h1"|"display"|"mono"' scripts/generated-tokens.js && echo "type roles present with metrics"
```
Expected: text roles → sans family + token metrics; mono data → mono family.

---

## Task 6: [x] Metric verification + fresh unit test + document deltas

**Implementation Notes:**
- Add a deterministic unit test (e.g. `__tests__/unit/typography.test.ts`) asserting: `font.family` tokens exist
  and parse; generated `fontFamily` is emitted and consumed; the `type/*` metric tokens (e.g. `h1` size = the 22px
  anchor) are present; mono family differs from sans. (Binding verification, not a visual guess.)
- Record the **measured glyph-metric deltas** (substitute vs reference) in `docs/TYPOGRAPHY.md`; explicitly defer
  the per-screen pixel **fidelity-diff to `fidelity-harness`** (Phase 0 #9) and restate the capped-fidelity status.
- Confirm **no layout shift**: `next/font` fallback-metric adjustment is configured (Task 3).

**Test Plan:**
```bash
npx vitest run __tests__/unit/typography.test.ts 2>&1 | tail -5
grep -qiE 'delta|cap-height|x-height|fidelity-harness' docs/TYPOGRAPHY.md && echo "deltas + deferral documented"
```
Expected: typography unit test passes; deltas + pixel-diff deferral documented.

---

## Task 7: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec delta's Test Plan (licence doc, font loading, token binding,
  build, unit suite, token-purity).
- Confirm scope discipline: type layer only — **no** new type scale, **no** component/screen restyling, **no**
  pixel-diff harness, **no** commercial SF licence purchase. Capped fidelity flagged.

**Test Plan:**
```bash
node scripts/parse-design-tokens.js && echo "parser clean"
npm run validate:tokens && echo "tokens valid"
npm run lint:tokens && echo "token-purity passes"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
```
Expected: parser clean, tokens valid, purity passes, build passes, unit suite green — all four requirements satisfied; capped fidelity flagged.

---

## Summary

Total tasks: 7
Estimated effort: 2–4 hours (friction: low)

**Deliverables:**
- ✅ `docs/TYPOGRAPHY.md` — licence finding (SF Compact/NKDy Mono not web-embeddable), dev-stage substitutes
  (Inter + OFL mono), measured deltas, capped-fidelity flag, swap-in path behind `--font-sans`/`--font-mono`.
- ✅ Self-hosted OFL `woff2` + `next/font` loading in `app/layout.tsx` (CLS-safe, root-bound variables).
- ✅ `font.family` tokens + extended parser (`fontFamily`) + `tailwind.config.ts` binding; type roles apply
  family + size + weight + line-height.
- ✅ Fresh typography unit test; measured deltas documented; pixel fidelity-diff deferred to `fidelity-harness`.

**Critical path:** licence doc (1) → self-host fonts (2) → next/font loading (3) → family tokens + parser + tailwind
(4) → bind roles (5) → verify + test + deltas (6) → acceptance (7).

**Scope guards (non-goals):**
- No new type scale (sizes/weights/line-heights already shipped by `design-token-engine`); no component/screen
  restyling; no pixel fidelity-diff harness (`fidelity-harness`); no commercial SF licence purchase.

**Success criteria:**
- ✅ Licence finding + substitutes + deltas + capped flag + swap-in path documented
- ✅ `next/font` loads sans + mono, root-bound `--font-*`, CLS-safe; token-purity still passes
- ✅ `font.family` tokens bound; Tailwind `fontFamily` consumes them; type roles bind family + metrics
- ✅ `npm run build` passes, `npm run test:unit` green, `npm run validate:tokens` + `lint:tokens` pass
