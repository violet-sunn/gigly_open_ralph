# UI Specification Delta: design-token-engine

This document contains specification changes for the `design-token-engine` change.

Scope note: these requirements cover **serializing the canonical design-system taxonomy into a machine token
source + enforcement**. Inputs are `docs/DESIGN_SYSTEM_SPEC.md` (the SSOT taxonomy) and `docs/DESIGN_SPECS.md`
(raw observed values, traceable to `screens/tokens.svg`/`frames.svg`). They produce the regenerable token
pipeline (`openspec/specs/ui/design-tokens.json` → `scripts/generated-tokens.{js,css}` → `tailwind.config.ts`)
and the token-purity lint. They do **not** produce fonts (`typography-system`), primitives/blocks
(`ui-primitives`/`domain-blocks`), or screens (Phase 2). The deleted parody JSON/values and legacy names stay
gone — **no legacy-name shim** is introduced.

---

## ADDED Requirements

### Requirement: Serialized Token Source from the Canonical Taxonomy
`openspec/specs/ui/design-tokens.json` MUST be (re)created and shaped to the `docs/DESIGN_SYSTEM_SPEC.md`
taxonomy, with every colour/radius/spacing value tracing to the raw substrate (`docs/DESIGN_SPECS.md` → a real
SVG fill/`rx`/coordinate). It MUST NOT contain pre-redesign "parody" values and MUST NOT re-source values from
Figma (Figma is for names/gaps only).

#### Scenario: Token JSON exists and is shaped to the taxonomy
- GIVEN the canonical taxonomy in `docs/DESIGN_SYSTEM_SPEC.md` §2
- WHEN `openspec/specs/ui/design-tokens.json` is inspected
- THEN the file MUST exist and be valid JSON
- AND it MUST contain the taxonomy namespaces — surface, text, border, brand, status, category, space, radius,
  type, shadow, gradient, z (z-index), opacity, size — named semantically (`namespace/role` → nested
  `namespace.role`)
- AND token names MUST encode meaning (e.g. `status/in-progress`, `surface/level-2`), never the raw value
  (not `blue-3b82f6`, not `radius-8`)

#### Scenario: Every token value traces to the substrate; no parody values
- GIVEN the canonical scales in `docs/DESIGN_SYSTEM_SPEC.md` §1 and the raw fills in `docs/DESIGN_SPECS.md` §2
- WHEN a sample of colour tokens is inspected (e.g. `#0088ff`, `#10b981`, `#f59e0b`, `#f45fb1`)
- THEN each sampled hex MUST be grep-findable in `screens/tokens.svg` or `screens/frames.svg`
- AND no pre-redesign parody hex (e.g. `#0A0E27`, `#0EA5E9`, `#141937`) may appear in the token JSON

#### Scenario: Status and category palettes are present and named
- GIVEN the 6 gig statuses and 5 categories from the SSOT
- WHEN the colour section is inspected
- THEN there MUST be a `status/*` token for each of open, review, in-progress, verification, completed, rejected
- AND a `category/*` token for each of marketing, design, programming, development, coding

#### Scenario: Full token surface is represented
- GIVEN the deliverable list (colour/type/space/radius/shadow/gradient/z-index + status + category)
- WHEN the JSON is inspected
- THEN each of those token groups MUST be present
- AND type tokens MUST express the scale structure (role size/weight/line-height) with the measurable 22px
  heading anchor, while exact font families/metrics + licence are referenced forward to `typography-system`

**Acceptance Criteria:**
- `design-tokens.json` exists, valid, shaped to the taxonomy, semantically named
- Sampled colour/radius values trace to the SVGs; no parody values present
- 6 statuses + 5 categories named; colour/type/space/radius/shadow/gradient/z-index all represented

---

### Requirement: Token Generation Pipeline
`scripts/parse-design-tokens.js` MUST parse the new token JSON without error and regenerate
`scripts/generated-tokens.{js,css}`, which `tailwind.config.ts` MUST consume. The parser MUST be extended to emit
the token types the taxonomy requires while preserving its reference-resolution / hex→rgba / px→rem behaviour.

#### Scenario: Parser runs clean against the new JSON
- GIVEN `openspec/specs/ui/design-tokens.json` shaped to the taxonomy
- WHEN `node scripts/parse-design-tokens.js` is run
- THEN it MUST exit 0 with no error and no unresolved-reference warnings
- AND it MUST write `scripts/generated-tokens.js` and `scripts/generated-tokens.css`

#### Scenario: Parser handles the new token types
- GIVEN the taxonomy adds semantic colour families (`surface/brand/status/category/text/border`) and the groups
  gradient, z-index, opacity, size, plus string radii (`radius/circular`, `radius/pill`)
- WHEN the parser processes the JSON
- THEN it MUST emit tokens for those groups (not silently drop them)
- AND string-valued radii (e.g. `circular = 50%`) MUST be emitted as-is rather than coerced to `NaNpx`

#### Scenario: Generated outputs are in sync with the JSON
- GIVEN the committed `scripts/generated-tokens.{js,css}`
- WHEN the parser is re-run
- THEN the regenerated files MUST match the committed files (ignoring the `Generated:` timestamp line)
- AND no token may be hand-edited in the generated files (they are build artifacts of the JSON)

#### Scenario: Tailwind consumes the tokens and the build passes
- GIVEN `tailwind.config.ts` requires `./scripts/generated-tokens.js`
- WHEN `npm run build` is run
- THEN the build MUST pass
- AND the token colour/spacing/radius/type scales MUST be available as Tailwind utilities

**Acceptance Criteria:**
- Parser exits clean and regenerates both output files; outputs in sync with the JSON
- New token types (gradient, z-index, string radii, semantic colour families, opacity, size) are emitted
- Tailwind consumes the tokens; `npm run build` passes

---

### Requirement: Clean Cutover Without a Legacy-Name Shim
The legacy/parody manual palettes MUST be removed from `tailwind.config.ts` and **no legacy-name shim** may be
introduced. The deleted parody `design-tokens.json` values and names MUST NOT be resurrected. The app is
pre-launch and Phase 2 recomposes every screen, so the ~770 existing consumers of old token *class names* are NOT
hand-patched here; `npm run build` and `npm run test:unit` MUST stay green, with the only build-safety obligation
being that `@apply` directives and CSS-var anchors remain valid.

#### Scenario: Legacy/parody palettes are removed
- GIVEN the legacy manual colour blocks in `tailwind.config.ts` (`navy`, `blue`, `gray`, `success`, `warning`,
  `error`, and stale pre-redesign values)
- WHEN `tailwind.config.ts` is inspected after the change
- THEN those parody palettes MUST be removed (or replaced by token-backed values), leaving the token-driven
  scales as the source
- AND no parody hex (e.g. `#0A0E27`, `#0EA5E9`) may remain in the config

#### Scenario: No legacy-name shim is introduced
- GIVEN the project guidance that the deleted JSON/names are the parody and stay gone
- WHEN the change is inspected
- THEN there MUST NOT be a shim module/alias mapping old parody names onto new tokens
- AND the token API surface MUST be the new semantic names only

#### Scenario: Build and unit suite stay green after cutover
- GIVEN old token class names may be referenced by Phase-2-doomed components (not hand-patched here)
- WHEN `npm run build` and `npm run test:unit` are run after the cutover
- THEN both MUST pass
- AND undefined `className` utilities in doomed components are acceptable (Tailwind drops them; visual-only)
- AND every `@apply` directive and CSS-var anchor in `app/globals.css` MUST resolve to a defined token/class
  (an `@apply` of an undefined class is a build error and MUST NOT occur)

**Acceptance Criteria:**
- Legacy/parody palettes removed from `tailwind.config.ts`; no parody hex remains
- No legacy-name shim exists; the semantic names are the only token API
- `npm run build` + `npm run test:unit` pass; all `@apply`/CSS-var anchors resolve

---

### Requirement: Token-Purity Lint (baseline-then-tighten)
A token-purity lint MUST exist and MUST **fail** on raw colour/spacing/radius/type literals used outside the token
system, and **pass** on token-pure code. Because ~62 raw-hex literals already exist in Phase-2-doomed legacy
components, the lint MUST use a **baseline-then-tighten** policy: pre-existing violations are recorded in a
baseline and do not block, while any **new** violation hard-fails. This makes Fidelity DoD **F2** structural for
all new code; a later cleanup change flips the policy to fail-on-all once legacy components are recomposed.

#### Scenario: Lint runs and passes on the baselined codebase
- GIVEN the lint is wired into a `lint:tokens` script (referenced by the build/CI) with a baseline of pre-existing
  legacy violations
- WHEN the lint runs against the current codebase
- THEN the token-purity check MUST execute
- AND it MUST pass (the baselined pre-existing violations do not block)

#### Scenario: Lint fails on a new planted raw literal
- GIVEN a deliberately planted, non-baselined off-token literal (e.g. `color: #123456` or `padding: 7px`) in app
  source
- WHEN the lint runs
- THEN it MUST report the violation and exit non-zero (fail)
- AND the message MUST identify the offending literal/location

#### Scenario: Lint allows non-design literals and token references
- GIVEN allowlisted values (`0`, `transparent`, `currentColor`, `inherit`) and token-based utilities/vars
- WHEN the lint runs
- THEN those MUST NOT be flagged
- AND values expressed via tokens (Tailwind token utilities / `var(--token)`) MUST pass

**Acceptance Criteria:**
- The lint executes (in `lint:tokens`/build) and passes on the baselined codebase
- It fails (non-zero) on a new, non-baselined raw colour/spacing/radius/type literal, identifying it
- Pre-existing legacy violations are baselined; allowlisted literals and token references are not flagged

---

### Requirement: Token Validation Replacing the Deleted Profile-Tokens Test
Fresh token validation MUST replace the deleted `scripts/validate-profile-tokens.mjs` /
`__tests__/unit/profile-tokens.test.ts`, asserting the token JSON's integrity and that the generated outputs
match it.

#### Scenario: Validation asserts JSON integrity and taxonomy coverage
- GIVEN the new validation (script and/or unit test)
- WHEN it runs
- THEN it MUST assert `design-tokens.json` parses and contains every required taxonomy namespace
- AND it MUST assert the 6 statuses + 5 categories are present

#### Scenario: Validation asserts generated outputs are in sync
- GIVEN the committed `scripts/generated-tokens.{js,css}`
- WHEN the validation runs
- THEN it MUST detect drift between the JSON and the generated outputs (ignoring the timestamp line)
- AND it MUST fail if a generated file was hand-edited or left stale

#### Scenario: Validation runs in the unit suite and is green
- GIVEN the validation is wired into `npm run test:unit`
- WHEN the suite runs
- THEN the token validation MUST pass
- AND the overall unit suite MUST remain green

**Acceptance Criteria:**
- Fresh validation asserts JSON integrity + taxonomy coverage (statuses/categories included)
- It detects JSON↔generated drift and fails on staleness/hand-edits
- It runs in `npm run test:unit` and the suite is green

---

## Test Plan

This change ships tokens + tooling. Validation is by deterministic commands. Commands assume the repo root.

### Token source + provenance checks
```bash
test -f openspec/specs/ui/design-tokens.json && echo "token JSON exists"
node -e "JSON.parse(require('fs').readFileSync('openspec/specs/ui/design-tokens.json','utf8')); console.log('valid JSON')"
# Taxonomy namespaces present (sample the JSON text)
for ns in surface text border brand status category space radius type shadow gradient opacity size; do
  grep -qi "\"$ns\"" openspec/specs/ui/design-tokens.json && echo "OK  $ns" || echo "CHECK  $ns"
done
# Status (6) + category (5)
for s in open review in-progress verification completed rejected; do grep -qi "$s" openspec/specs/ui/design-tokens.json && echo "OK status $s" || echo "CHECK $s"; done
for c in marketing design programming development coding; do grep -qi "$c" openspec/specs/ui/design-tokens.json && echo "OK category $c" || echo "CHECK $c"; done
# Sampled canonical colours trace to the SVGs; no parody hex present
for hex in '#0088ff' '#10b981' '#f59e0b' '#f45fb1'; do
  grep -qi "$hex" openspec/specs/ui/design-tokens.json && { grep -qi "$hex" screens/tokens.svg || grep -qi "$hex" screens/frames.svg; } && echo "OK $hex traces" || echo "CHECK $hex"
done
for parody in '#0A0E27' '#0EA5E9' '#141937'; do
  grep -qi "$parody" openspec/specs/ui/design-tokens.json && echo "PARODY LEAK $parody" || echo "OK no parody $parody"
done
```

### Generation pipeline checks
```bash
node scripts/parse-design-tokens.js && echo "parser clean"
test -f scripts/generated-tokens.js && test -f scripts/generated-tokens.css && echo "outputs generated"
# In-sync: re-run and diff ignoring the Generated: timestamp line
node scripts/parse-design-tokens.js
git diff --stat -- scripts/generated-tokens.js scripts/generated-tokens.css | grep -qv 'Generated:' && echo "(review diff: only timestamp may change)"
npm run build && echo "build passes"
```

### Cutover checks
```bash
# Legacy/parody palettes removed; no parody hex in tailwind config
for parody in '#0A0E27' '#0EA5E9' navy: ; do
  grep -q "$parody" tailwind.config.ts && echo "CHECK legacy $parody still present" || echo "OK removed $parody"
done
npm run test:unit && echo "unit suite green"
```

### Token-purity lint checks
```bash
# Token-pure baseline passes
npm run lint:tokens || npm run build   # whichever wires the lint
# Planted literal fails (manual: add `color: #123456` to a sample app file, expect non-zero)
# Then revert the planted literal.
```

### Token validation checks
```bash
# Fresh validation runs in the unit suite (replaces deleted profile-tokens test)
npm run test:unit 2>&1 | grep -iE 'token' && echo "token validation present in suite"
test -f scripts/validate-profile-tokens.mjs && echo "UNEXPECTED old validator" || echo "old profile-tokens validator gone (correct)"
```

### Manual review
1. Open `design-tokens.json` beside `docs/DESIGN_SYSTEM_SPEC.md` §2 and confirm every taxonomy leaf has exactly
   one canonical value and a semantic name.
2. Confirm `tailwind.config.ts` no longer carries parody palettes and consumes the regenerated tokens.
3. Plant an off-token literal, confirm the lint fails the build, then revert.
4. Confirm `typography-system` residuals (font files/metrics/licence) are referenced, not resolved here.
