# Change Proposal: design-token-engine

> Phase 0, change 3 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It implements the **machine token layer** — the serialized single source of truth + the enforcement that makes
> token-purity (Fidelity DoD **F2**) structural. It consumes the canonical taxonomy from
> [`docs/DESIGN_SYSTEM_SPEC.md`](../../../docs/DESIGN_SYSTEM_SPEC.md) (the SSOT produced by the archived
> `derive-design-system`) and the raw values from [`docs/DESIGN_SPECS.md`](../../../docs/DESIGN_SPECS.md), and
> turns them into `openspec/specs/ui/design-tokens.json` → `scripts/generated-tokens.{js,css}` → Tailwind/CSS.

## Problem Statement

The design system is fully specified on paper (`docs/DESIGN_SYSTEM_SPEC.md`: canonical scales + the semantic
token taxonomy) but there is **no machine source** the app can consume. The state today:

- `openspec/specs/ui/design-tokens.json` was **deleted for good** (it held pre-redesign "parody" values + stale
  semantic names — keeping it re-introduces the drift the redesign fixes).
- `scripts/parse-design-tokens.js` still **reads that deleted JSON** (it would now crash) and has **no handling**
  for several token types the taxonomy requires (gradient, z-index, string radii like `circular`/`pill`,
  opacity, size, and the new semantic colour families `status/*`, `category/*`, `brand/*`, `surface/*`).
- `scripts/generated-tokens.{js,css}` (consumed by `tailwind.config.ts`) hold **stale March pre-redesign
  values**, and `tailwind.config.ts` carries large blocks of **legacy/parody manual palettes**
  (`navy`, `blue`, `gray`, `success`, `warning`, `error`, stale `hsl(var(--…))`).
- The deleted `scripts/validate-profile-tokens.mjs` + `__tests__/unit/profile-tokens.test.ts` (they read the
  now-missing JSON) leave **no token validation** in the suite.
- **Nothing enforces token-purity** — raw colour/spacing/radius/type literals can be committed freely, which is
  exactly how the previous "parody" accreted.

Without this change, `typography-system`, `ui-primitives`, and `domain-blocks` have no token API to build
against, and F2 (token-purity) is unenforceable.

## Proposed Solution

Serialize the `docs/DESIGN_SYSTEM_SPEC.md` taxonomy into a regenerable token pipeline, and add the lint that makes
off-token literals fail the build. Five deliverables:

1. **Seed `openspec/specs/ui/design-tokens.json`** from the **SVG-derived** canonical values
   (`docs/DESIGN_SPECS.md`), shaped to the SSOT taxonomy. The `namespace/role` taxonomy maps to nested JSON
   (`namespace.role`) which the parser flattens to `namespace-role` Tailwind keys + `--namespace-role` CSS vars.
   Figma is used **only** to attach semantic names / fill residual gaps — **never** to (re)discover values the
   SVGs already encode. **No parody values, no stale legacy names.**
2. **Regenerate via `scripts/parse-design-tokens.js`** — extend the parser to emit the token types the taxonomy
   needs (semantic colour families, **gradient**, **z-index**, string radii `circular`/`pill`, **opacity**,
   **size**) while keeping its reference-resolution / hex→rgba / px→rem behaviour, then regenerate
   `scripts/generated-tokens.{js,css}` and wire them through `tailwind.config.ts`.
3. **Cover the full token surface, named semantically:** colour (surface/text/border/brand) + **type** + **space**
   + **radius** + **shadow** + **gradient** + **z-index**, plus the **6-status palette** and the
   **5-category / tag colours** — every leaf named by meaning (`status/in-progress`, never `blue-3b82f6`).
4. **Clean cutover, NOT a legacy-name shim.** Per project guidance (`design-token-engine-prep` memory), the
   deleted JSON and its names are the parody and stay gone — so there is **nothing to shim to**. Remove the
   legacy/parody manual palettes from `tailwind.config.ts` and add **fresh token validation** to replace the
   deleted profile-tokens test. The app is **pre-launch (pure development)** and the redesign **recomposes every
   screen in Phase 2** from primitives/blocks — so the ~770 existing consumers of old token *class names*
   (`text-neutral-weak`, `success-500`, `navy-700`, …) are **not** hand-patched here (that is throwaway work on
   components Phase 2 deletes). Those `className` utilities simply go undefined (Tailwind silently drops unknown
   utilities — no build error; visual-only, irrelevant in dev). The cutover's only build-safety obligation is to
   keep **`@apply` directives and CSS-var anchors** in `app/globals.css` valid (an `@apply` of an undefined class
   *is* a compile error), by rewiring the small shadcn base layer + body styles onto canonical tokens.
   *(This deliberately diverges from the planning brief's "(4) legacy-name shim" item — see the note below.)*
5. **Token-purity lint that FAILS the build** on colour/spacing/radius/type literals outside the token system,
   proven by a planted-literal test (fails) and a token-pure control (passes).

### Divergence from the planning brief (deliberate)

The Phase-0 brief and the PRD both list "(4) legacy-name shim." The authoritative `design-token-engine-prep`
project memory (recorded 2026-06-14, after the JSON deletion) **overrides** this: *"DROP the planned legacy-name
shim — the old names ARE the parody and the JSON is gone for good, so there is nothing to shim to."* This proposal
follows the memory: a clean cutover replaces the shim. If a transitional shim is later wanted for an incremental
migration, it can be added as a follow-up — but it is **not** a goal here.

## Constraints

### MUST Requirements
- `openspec/specs/ui/design-tokens.json` MUST be (re)created, shaped to the `docs/DESIGN_SYSTEM_SPEC.md` taxonomy
  (namespaces `surface/text/border/brand/status/category/space/radius/type/shadow/gradient/z/opacity/size`).
- Every colour/radius/spacing token value MUST trace to the substrate (`docs/DESIGN_SPECS.md` → a real SVG
  fill/`rx`/coordinate). The JSON MUST NOT contain pre-redesign "parody" values, and MUST NOT re-source values
  from Figma (Figma is for names/gaps only).
- The **6 gig statuses** and **5 categories** MUST each be present as semantically-named tokens.
- `scripts/parse-design-tokens.js` MUST parse the new JSON without error and regenerate
  `scripts/generated-tokens.{js,css}`; the generated outputs MUST be in sync with the JSON (no manual drift).
- `tailwind.config.ts` MUST consume the regenerated tokens; `npm run build` MUST pass.
- The legacy/parody manual palettes MUST be removed from `tailwind.config.ts`; **no legacy-name shim** is
  introduced. `npm run build` and `npm run test:unit` MUST stay green; old token *class names* left undefined in
  Phase-2-doomed components are acceptable (visual-only), but every `@apply`/CSS-var anchor MUST remain valid.
- A **token-purity lint** MUST exist and MUST **fail** on a raw colour/spacing/radius/type literal outside the
  token system, and **pass** on token-pure code. Because ~62 raw-hex literals already exist in Phase-2-doomed
  legacy components, the lint MUST use a **baseline-then-tighten** policy: pre-existing violations are baselined
  (do not block), any **new** violation hard-fails; a later cleanup change flips it to fail-on-all once legacy is
  recomposed.
- Fresh **token validation** MUST replace the deleted `validate-profile-tokens.mjs` / `profile-tokens.test.ts`
  (assert the JSON parses, every taxonomy namespace is present, and the generated outputs match the JSON).

### SHOULD Requirements
- Token *names* SHOULD be cross-checkable against a fresh Figma token export when available, but their absence
  MUST NOT block the change (names come from the SSOT taxonomy meaning).
- Type tokens SHOULD emit the **scale structure** (role sizes/weights/line-heights) with the measurable anchor
  (the 22px auth heading); exact **font families/metrics + the SF Compact licence** remain `typography-system`'s
  residual and SHOULD be referenced, not resolved here.
- `gradient/*` SHOULD be modelled as token-based "glow" recipes (layered fills/opacity) since the SVGs contain
  **no** raw gradients; `shadow/*` SHOULD be conservative structural slots since the SVGs are flat.

### Non-Goals
- **No font embedding/licensing** — that is `typography-system` (this change emits the type *scale*, not the font
  decision).
- **No primitives/blocks/screens** — `ui-primitives`/`domain-blocks`/Phase 2 consume these tokens; they are not
  built here.
- **No legacy-name shim** and **no resurrection of the deleted parody JSON/values.**
- **No re-extraction / re-sourcing of values from Figma** — values come from `docs/DESIGN_SPECS.md` / the SVGs.
- **No new visual design** — serialization of the already-derived system only.

## Success Criteria

1. `openspec/specs/ui/design-tokens.json` exists, is shaped to the SSOT taxonomy, and every sampled colour/radius
   value traces to the SVG substrate (and no parody hex remains).
2. `node scripts/parse-design-tokens.js` runs clean and regenerates `scripts/generated-tokens.{js,css}` in sync
   with the JSON; the extended parser emits colour/type/space/radius/shadow/gradient/z-index tokens incl. the
   6-status + 5-category palettes.
3. `tailwind.config.ts` consumes the regenerated tokens with the legacy/parody palettes removed and **no** shim;
   `npm run build` passes and `npm run test:unit` is green.
4. The token-purity lint runs in the build, **fails** on a planted raw literal, and **passes** on token-pure code.
5. Fresh token validation asserts JSON integrity + generated-output sync and runs in the unit suite.

## Affected Areas

- `openspec/specs/ui/design-tokens.json` (new — the serialized token SSOT)
- `scripts/parse-design-tokens.js` (extended for new token types)
- `scripts/generated-tokens.js`, `scripts/generated-tokens.css` (regenerated)
- `tailwind.config.ts` (consume tokens; remove legacy/parody palettes; no shim)
- `app/globals.css` (import regenerated CSS vars if applicable)
- token-purity lint config (e.g. an ESLint rule / `scripts/design-system/validate-token-purity.*`) + `package.json`
  build/lint wiring
- fresh token validation (e.g. `scripts/design-system/validate-tokens.*` + a `__tests__/unit/*` test) replacing
  the deleted profile-tokens validation
- read-only inputs: `docs/DESIGN_SYSTEM_SPEC.md` (taxonomy), `docs/DESIGN_SPECS.md` (raw values),
  `screens/tokens.svg`/`frames.svg` (provenance)
- `openspec/specs/ui/spec.md` (spec delta)

## Risks & Mitigations

**Risk**: Removing the legacy/parody palettes from `tailwind.config.ts` breaks the build.
**Mitigation**: The app is pre-launch and Phase 2 recomposes every screen, so undefined `className` utilities in
doomed components are acceptable (Tailwind drops them silently — no error). The only build-breakers are `@apply`
of an undefined class and dangling CSS-var anchors in `app/globals.css`; those are rewired onto canonical tokens
(a contained edit), not the ~770 call sites. `npm run build` + `npm run test:unit` are the gate.

**Risk**: The token-purity lint is too aggressive (flags legitimate non-design literals like `z-index` in
third-party code, `0`/`100%`, data URIs).
**Mitigation**: Scope the rule to design properties (color/background/border-color/box-shadow/border-radius/
font-size/spacing) in app source only, with an allowlist for `0`, `transparent`, `currentColor`, `inherit`, and
token references; prove both directions (planted literal fails, token-pure passes).

**Risk**: The parser's non-deterministic `Generated:` timestamp makes "generated in sync with JSON" checks flaky.
**Mitigation**: The sync check compares content **excluding** the generated-date line (or re-runs the parser and
diffs); the timestamp is not part of token data.

**Risk**: Type tokens require font metrics that are a `typography-system` residual.
**Mitigation**: Emit the type **scale** (sizes/weights/line-heights) anchored on the measurable 22px heading;
reference families + licence forward to `typography-system` rather than inventing font files here.

**Risk**: Scope creep into primitives/components.
**Mitigation**: Hard non-goals; this change emits tokens + enforcement only. The deterministic test plan gates on
parser/build/lint/test, not on any rendered component.
