# Implementation Tasks: design-token-engine

> **Machine token layer + enforcement.** Serialize the `docs/DESIGN_SYSTEM_SPEC.md` taxonomy into
> `openspec/specs/ui/design-tokens.json`, regenerate `scripts/generated-tokens.{js,css}` via
> `scripts/parse-design-tokens.js` (extended), wire them through `tailwind.config.ts`, **remove** the legacy/parody
> palettes (no shim — per the `design-token-engine-prep` memory), add a **token-purity lint** that fails the build
> on off-token literals, and add **fresh token validation** replacing the deleted profile-tokens test. Values come
> from `docs/DESIGN_SPECS.md` / the SVGs — never re-sourced from Figma (names/gaps only). Friction: low.

---

## Task 1: [x] Map the SSOT taxonomy to the JSON shape the parser consumes

**Implementation Notes:**
- Read `docs/DESIGN_SYSTEM_SPEC.md` §1 (canonical scales) + §2 (taxonomy) and `docs/DESIGN_SPECS.md` §2/§3/§5
  (raw values). These are authoritative — do not re-source from Figma.
- Read `scripts/parse-design-tokens.js` to learn the **input contract** it expects: top-level `color-semantic`
  (flattened via `flattenObject`), `font.typography` (`{value:{fontSize,lineHeight,fontWeight}}`),
  `effect.shadow` (`{value:{offsetX,offsetY,radius,spread,color}}`), `numbers.spacing` (numeric),
  `numbers.corner` (numeric), with `{token-ref}` resolution + hex→rgba + px→rem helpers.
- Decide the JSON tree so the `namespace/role` taxonomy flattens to `namespace-role` keys: e.g.
  `color-semantic.surface.level-2` → `surface-level-2`; `color-semantic.status.in-progress` →
  `status-in-progress`; `color-semantic.category.design` → `category-design`. Plan groups for the **new** types
  the current parser doesn't handle: `gradient`, `numbers.zIndex` (z-index), string radii (`circular`/`pill`),
  `opacity`, and `size`.

**Test Plan:**
```bash
grep -nE 'color-semantic|font|effect|numbers' scripts/parse-design-tokens.js | head
grep -qiE 'surface/|status/|category/' docs/DESIGN_SYSTEM_SPEC.md && echo "taxonomy source readable"
```
Expected: a written mapping (taxonomy leaf → JSON path → flattened key) covering every namespace, with the
parser-gap types (gradient/z-index/string-radii/opacity/size) identified for Task 3.

---

## Task 2: [x] Author `openspec/specs/ui/design-tokens.json` from the substrate

**Implementation Notes:**
- Create the JSON with one canonical value per leaf, semantically named, traceable to `docs/DESIGN_SPECS.md`:
  - **Colour** (`color-semantic`): `surface` (level-0 `#01030e`, level-1 `#0e101a`, level-2 `#10121c`, level-3
    `#1a1a24`, level-3-hover `#1a1d2a`), `text` (strong `white`, inverse `white`, muted `#8a8f99`, subtle
    `#9fa0a4`), `border` (default `#3a3d45`), `brand` (default `#0088ff`, hover `#4cacff`, pressed `#0077e6`),
    `status` (open `#8a8f99`, review `#f59e0b`, in-progress `#3b82f6`, verification `#8b5cf6`, completed
    `#10b981`, rejected `#ef4444`), `category` (marketing `#0088ff`, design `#f45fb1`, programming `#0cc671`,
    development `#05c9e6`, coding `#f27c0d`).
  - **Radius** (`numbers.corner`): xs 2, sm 4, md 8, lg 12, xl 16, pill 18 (or full 9999), circular `50%` (string).
  - **Space** (`numbers.spacing`): 0,4,8,12,16,20,24,32,40,48 keyed `0,1,2,3,4,5,6,8,10,12`.
  - **Type** (`font.typography`): roles display/h1/h2/title/body/label/caption/mono with size/weight/lineHeight;
    anchor `h1`≈22px (the auth heading); families/exact metrics referenced forward to `typography-system`
    (a `$residual` note field), not invented here.
  - **Shadow** (`effect.shadow`): conservative structural slots (`none`, `card`, `popover`) — SVGs are flat.
  - **Gradient** (`gradient`): token-based "glow" recipes (layered brand fill + opacity) — SVGs have no raw
    gradients; record the recipe, not an invented gradient.
  - **z-index** (`numbers.zIndex`): base/sticky/dropdown/modal/toast; **opacity**: disabled/subtle/overlay;
    **size**: control 40, icon 16, icon-rail 20, avatar-sm 24, avatar-lg 32.
- **No parody values** (`#0A0E27`, `#0EA5E9`, `#141937`, …) and no stale legacy names.

**Test Plan:**
```bash
node -e "JSON.parse(require('fs').readFileSync('openspec/specs/ui/design-tokens.json','utf8'));console.log('valid')"
for s in open review in-progress verification completed rejected; do grep -qi "$s" openspec/specs/ui/design-tokens.json && echo "OK $s"; done
for c in marketing design programming development coding; do grep -qi "$c" openspec/specs/ui/design-tokens.json && echo "OK $c"; done
for hex in '#0088ff' '#10b981' '#f45fb1'; do grep -qi "$hex" openspec/specs/ui/design-tokens.json && { grep -qi "$hex" screens/tokens.svg || grep -qi "$hex" screens/frames.svg; } && echo "OK $hex traces"; done
for p in '#0A0E27' '#0EA5E9' '#141937'; do grep -qi "$p" openspec/specs/ui/design-tokens.json && echo "PARODY LEAK $p" || echo "OK no $p"; done
```
Expected: valid JSON shaped to the taxonomy; statuses/categories present; sampled hexes trace to SVGs; no parody.

---

## Task 3: [x] Extend `scripts/parse-design-tokens.js` for the new token types

**Implementation Notes:**
- Keep the existing behaviour (reference resolution, hex→rgba, px→rem, `flattenObject`, the `color-semantic` /
  `font.typography` / `effect.shadow` / `numbers.spacing` / `numbers.corner` extractors).
- Add extraction for: **gradient** (emit CSS gradient/recipe strings), **z-index** (`numbers.zIndex` → integers),
  **opacity** (`numbers.opacity` or `opacity` → unitless), **size** (`numbers.size` → px). Make `numbers.corner`
  tolerate **string** values (e.g. `circular: "50%"`, `pill: "9999px"`) instead of coercing to `${value}px`.
- Emit the new groups into both `generated-tokens.js` (Tailwind: `borderRadius`, `zIndex`, `opacity`,
  `backgroundImage`/`gradient`, `spacing` already present) and `generated-tokens.css` (CSS vars
  `--z-*`, `--opacity-*`, `--size-*`, `--gradient-*`). Update the summary log counts.

**Test Plan:**
```bash
node scripts/parse-design-tokens.js && echo "parser exit 0"
grep -qiE 'zIndex|z-index|--z-' scripts/generated-tokens.css scripts/generated-tokens.js && echo "z-index emitted"
grep -qiE 'gradient' scripts/generated-tokens.js && echo "gradient emitted"
grep -qiE 'circular|50%' scripts/generated-tokens.js && echo "string radius emitted (not NaN)"
grep -q 'NaN' scripts/generated-tokens.js && echo "CHECK NaN leaked" || echo "OK no NaN"
```
Expected: parser exits 0 and emits gradient/z-index/opacity/size/string-radii without `NaN`.

---

## Task 4: [x] Regenerate tokens and wire `tailwind.config.ts` (clean cutover, no shim)

**Implementation Notes:**
- Run the parser to regenerate `scripts/generated-tokens.{js,css}` from the new JSON.
- In `tailwind.config.ts`: keep the `...tokens.*` spreads; **remove** the legacy/parody manual palettes
  (`navy`, `blue`, `gray`, `success`, `warning`, `error`, and stale literal blocks) — **no parody-name shim**
  (per the `design-token-engine-prep` memory).
- **Do NOT hand-patch the ~770 old-name `className` consumers.** The app is pre-launch and Phase 2 recomposes
  every screen from primitives/blocks, so those components are doomed; undefined Tailwind utilities are silently
  dropped (no build error; visual-only, irrelevant in dev).
- **The only build-safety obligation** is to keep `app/globals.css` valid: an `@apply` of an undefined class *is*
  a compile error. Rewire the shadcn base layer + body styles (`@apply border-border`, `@apply bg-background
  text-foreground`, and the `--bg-surface-level-0` / `--border-other-focusring` anchors and `--tw-ring-*`
  references) onto canonical tokens or token-backed values so every `@apply`/CSS-var anchor resolves.
- Decide the shadcn HSL vars (`--background`, `--primary`, …): keep them as a token-backed base layer (not parody)
  so `@apply bg-background`/`border-border` keep compiling.

**Test Plan:**
```bash
for p in '#0A0E27' '#0EA5E9' 'navy:' 'success:'; do grep -q "$p" tailwind.config.ts && echo "CHECK $p remains" || echo "OK removed $p"; done
grep -q "generated-tokens" tailwind.config.ts && echo "consumes generated tokens"
npm run build && echo "build passes"   # gate: @apply/CSS-var anchors all resolve
```
Expected: parody palettes gone; no shim; no hand-patched components; Tailwind consumes regenerated tokens;
all `@apply`/CSS-var anchors resolve; `npm run build` passes.

---

## Task 5: [x] Add the token-purity lint (baseline-then-tighten)

**Implementation Notes:**
- Implement a token-purity check — `scripts/design-system/validate-token-purity.*` (and/or an ESLint rule) — that
  scans app source (`app/`, `components/`) for raw design literals: hex/rgb(a)/hsl colours and raw `#px`
  spacing/radius/font-size literals in `style=`/CSS, outside the token system. Allowlist `0`, `transparent`,
  `currentColor`, `inherit`, data URIs, and token references (Tailwind token utilities, `var(--token)`).
- **Baseline-then-tighten:** the ~62 pre-existing raw-hex literals live in Phase-2-doomed legacy components.
  Record them in a baseline file (e.g. `scripts/design-system/token-purity-baseline.json`) so they do **not**
  block; any **new** (non-baselined) violation hard-fails (non-zero). Document that a later cleanup change flips
  the policy to fail-on-all once legacy is recomposed.
- Wire it into a `lint:tokens` npm script (referenced by build/CI).

**Test Plan:**
```bash
# baselined codebase passes (pre-existing legacy violations do not block)
npm run lint:tokens && echo "baselined codebase passes"
# a NEW planted literal fails (then revert)
printf '\n.__plant{color:#123456;padding:7px;}\n' >> app/globals.css
npm run lint:tokens && echo "CHECK lint did not fail on planted literal" || echo "OK lint fails on new literal"
git checkout -- app/globals.css
```
Expected: lint passes on the baselined codebase; a new `#123456`/`7px` exits non-zero and names the literal;
reverts clean.

---

## Task 6: [x] Add fresh token validation (replace the deleted profile-tokens test)

**Implementation Notes:**
- Add `scripts/design-system/validate-tokens.*` and/or `__tests__/unit/design-tokens.test.ts` that assert:
  (a) `design-tokens.json` parses; (b) every taxonomy namespace is present (surface/text/border/brand/status/
  category/space/radius/type/shadow/gradient/z/opacity/size); (c) the 6 statuses + 5 categories exist;
  (d) the committed `scripts/generated-tokens.{js,css}` match a fresh parser run **ignoring the `Generated:`
  timestamp line** (drift detection); (e) no parody hex appears.
- Wire the test into `npm run test:unit`. Confirm the old `scripts/validate-profile-tokens.mjs` /
  `__tests__/unit/profile-tokens.test.ts` remain absent (deleted).

**Test Plan:**
```bash
npm run test:unit 2>&1 | grep -iE 'token' && echo "token validation runs"
test -f scripts/validate-profile-tokens.mjs && echo "UNEXPECTED old validator" || echo "old validator gone (correct)"
test -f __tests__/unit/profile-tokens.test.ts && echo "UNEXPECTED old test" || echo "old test gone (correct)"
npm run test:unit && echo "unit suite green"
```
Expected: fresh token validation runs in the suite, detects JSON↔generated drift, asserts taxonomy coverage;
old profile-tokens validation stays gone; suite green.

---

## Task 7: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec delta's Test Plan (token source/provenance, generation pipeline,
  cutover, lint both directions, validation).
- Confirm scope discipline: tokens + tooling only — **no** primitives/blocks/screens; **no** font files/licence
  (referenced forward to `typography-system`); **no** legacy-name shim; **no** parody values resurrected.

**Test Plan:**
```bash
node scripts/parse-design-tokens.js && echo "parser clean"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
# lint both directions (see Task 5)
# provenance + no-parody (see Task 2)
grep -riE 'shim' tailwind.config.ts scripts/generated-tokens.* && echo "CHECK shim present" || echo "OK no shim"
```
Expected: parser clean, build passes, lint fails on planted literal + passes clean, unit suite green, no shim,
no parody — all five spec requirements satisfied.

---

## Summary

Total tasks: 7
Estimated effort: 3–5 hours (friction: low)

**Deliverables:**
- ✅ `openspec/specs/ui/design-tokens.json` — serialized token SSOT shaped to the `DESIGN_SYSTEM_SPEC.md` taxonomy
  (colour/type/space/radius/shadow/gradient/z-index + 6-status + 5-category), every value traceable, no parody.
- ✅ Extended `scripts/parse-design-tokens.js` + regenerated `scripts/generated-tokens.{js,css}` consumed by
  `tailwind.config.ts` (legacy/parody palettes removed; **no shim**).
- ✅ A token-purity lint that **fails** the build on off-token literals (F2 made structural).
- ✅ Fresh token validation in `npm run test:unit` (replaces the deleted profile-tokens test).

**Critical path:** map taxonomy→JSON (1) → author JSON (2) → extend parser (3) → regenerate + cutover (4) →
purity lint (5) → validation (6) → acceptance (7).

**Scope guards (non-goals):**
- No fonts/licence (→ `typography-system`); no primitives/blocks/screens; **no legacy-name shim**; no parody
  values resurrected; no re-sourcing from Figma (names/gaps only).

**Success criteria:**
- ✅ Token JSON shaped to the taxonomy; sampled values trace to the SVGs; no parody hex
- ✅ Parser clean; generated outputs in sync; Tailwind consumes them; `npm run build` passes
- ✅ Legacy palettes removed, no shim, no dangling references; `npm run test:unit` green
- ✅ Token-purity lint fails on a planted literal and passes token-pure code
- ✅ Fresh token validation asserts integrity + drift and runs in the unit suite
