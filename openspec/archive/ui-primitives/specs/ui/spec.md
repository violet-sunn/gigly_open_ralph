# UI Specification Delta: ui-primitives

This document contains specification changes for the `ui-primitives` change.

Scope note: these requirements implement the **primitive vocabulary** from `docs/DESIGN_SYSTEM_SPEC.md` §3.1 — the
16 variant-driven primitives (Button, Input, PasswordInput, SearchInput, Select, Radio, Filter, Tabs, Toggle, Tag,
CategoryTag, StatusBadge/Dot, Avatar, Rating, ViewToggle, ProgressBar) with typed `variant`/`state`/`size` props,
token-pure, covering every state present in the library (`docs/DESIGN_SPECS.md` §4), built to the measured geometry
(§5). They ship **components + tests only**. They do **not** build domain blocks (`domain-blocks`), compose screens
or cut over the shell (Phase 2), or remove the legacy controls. F2 (token-purity), F3 (all-states/logical parity),
F4 (real assets), and F5 (composition-leaf purity) are enforced here; the **automated F1 pixel-diff** is deferred to
`fidelity-harness` (#9) — primitives are built to §5 geometry and checked against the reference crops now.

---

## ADDED Requirements

### Requirement: Primitive Vocabulary — 16 Variant-Driven Components
The kit MUST provide the 16 primitives of `docs/DESIGN_SYSTEM_SPEC.md` §3.1 under `app/components/primitives/`, each
exposing the typed `variant`/`state`/`size` axes named there and rendering **every state present in the library**
(`docs/DESIGN_SPECS.md` §4). Each primitive is a controlled, presentational component (state is a prop).

#### Scenario: All sixteen primitives exist and render
- GIVEN the change is implemented
- WHEN each primitive is rendered with children/props
- THEN `Button`, `Input`, `PasswordInput`, `SearchInput`, `Select`, `Radio`, `Filter`, `Tabs`, `Toggle`, `Tag`,
  `CategoryTag`, `StatusBadge` (badge + inline dot), `Avatar`, `Rating`, `ViewToggle`, and `ProgressBar` MUST each
  exist as a component under `app/components/primitives/` and render its output

#### Scenario: Every library state is renderable per primitive
- GIVEN a primitive with a documented state matrix (e.g. Button `primary|secondary|ghost|link` × `default|hover|
  pressed|disabled`; Input `default|focus|filled|disabled|error`; Radio/Filter `off|hover|on|disabled`; StatusBadge
  the 6 status variants; Avatar `sm|lg` + `online`; ViewToggle `grid-active|list-active`)
- WHEN each variant/state/size in the matrix is requested via props
- THEN the primitive MUST render that exact state (the requested variant/state/size resolves to its canonical token
  styling), with no library state missing

#### Scenario: Standard controls use the canonical control geometry
- GIVEN the standard-control primitives (Button, Input, Select, StatusBadge pill)
- WHEN they are rendered at their default size
- THEN they MUST express the standard control height via the `size/control` (40px) token and `radius/md`, per
  `docs/DESIGN_SPECS.md` §5 — not a hardcoded pixel height

**Acceptance Criteria:**
- All 16 primitives exist under `app/components/primitives/` with the §3.1 variant/state/size props and render
- Every state from the library is renderable per primitive; standard controls use `size/control` + `radius/md`

---

### Requirement: Token Purity and Typed-API Enforcement (F2)
Every primitive MUST express colour/spacing/radius/type/size **only via canonical token utilities** (zero hardcoded
values), and its `variant`/`state`/`size` props MUST be typed unions so an off-system value does not type-check.

#### Scenario: Primitives are token-pure
- GIVEN the rendered primitive output
- WHEN its classes/styles are inspected
- THEN colour MUST resolve to `brand/*`, `surface/*`, `text/*`, `border/*`, `status/*`, or `category/*` tokens,
  spacing to `space/*`, radius to `radius/*`, type to `type/*`, and fixed dimensions to `size/*` — with no raw hex,
  `rgb()/hsl()`, or raw `px` literal
- AND `npm run lint:tokens` MUST pass with **no new baseline entries** (the new primitives add nothing to
  `scripts/design-system/token-purity-baseline.json`)

#### Scenario: Typed API rejects off-system values
- GIVEN a primitive with typed `variant`/`state`/`size` union props
- WHEN a non-existent variant or off-scale value is supplied (e.g. `<Button variant="purple" />`,
  `<StatusBadge status="mauve" />`)
- THEN the type-checker MUST reject it (`tsc --noEmit` / `npm run build` fails on the planted value)
- AND the clean tree (only in-system values) MUST type-check and build green

#### Scenario: Variant maps are JIT-visible static class strings
- GIVEN the primitive token map (`app/components/primitives/tokens.ts`)
- WHEN a variant/state/size is mapped to styling
- THEN it MUST resolve through a static literal-class lookup (the `app/components/layout/scale.ts` pattern), not a
  dynamically built class string, so Tailwind's JIT emits the utility

**Acceptance Criteria:**
- No raw colour/px literals in `app/components/primitives/`; `lint:tokens` passes with an unchanged baseline file
- `variant`/`state`/`size` are typed unions; a planted off-system value fails `tsc --noEmit`; the clean tree builds

---

### Requirement: Real Assets (F4)
Icon-bearing primitives MUST use the exported SVG assets in `public/assets/design-system/icons/`, not redrawn
approximations; the known asset residuals MUST be flagged rather than re-drawn.

#### Scenario: Icon primitives reference exported assets
- GIVEN SearchInput (search + clear), ViewToggle (grid/list), Rating (star + verified), Radio/Filter
  (radio-off/radio-on), and StatusBadge inline dot (status-dot)
- WHEN their icon usage is inspected
- THEN each MUST reference an exported asset from `public/assets/design-system/icons/` (e.g. `search.svg`,
  `clear.svg`, `grid.svg`, `list.svg`, `star.svg`, `verified.svg`, `radio-off.svg`, `radio-on.svg`,
  `status-dot.svg`) — not an inline redrawn glyph

#### Scenario: Missing-icon residuals are flagged, not redrawn
- GIVEN the `eye` (PasswordInput reveal) and `attach` (chat composer) icons are absent from the in-hand SVGs
  (`docs/DESIGN_SPECS.md` §7.5)
- WHEN PasswordInput's reveal control is implemented
- THEN it MUST ship with an accessible text/label fallback (not a redrawn `eye` glyph), and the residual MUST be
  flagged (routed to Figma) — preserving the `revealed` state in the typed matrix

**Acceptance Criteria:**
- Icon-bearing primitives use exported assets from `public/assets/design-system/icons/`
- `eye`/`attach` residuals are flagged (not redrawn); PasswordInput reveal has an accessible fallback

---

### Requirement: All-States Render Coverage and Verification
The primitives MUST be verified deterministically by a render-test suite covering **every variant/state/size**, plus
the typed-rejection and token-purity checks, with the unit suite and build staying green.

#### Scenario: Render tests cover every state of every primitive
- GIVEN the render-test suite (`__tests__/unit/components/ui-primitives.test.tsx`, jsdom)
- WHEN `npm run test:unit` runs
- THEN it MUST render each primitive in every documented variant/state/size and assert the expected token utility /
  asset is present (e.g. Button primary → `bg-brand-default`; StatusBadge review → `status-review`; ProgressBar
  fill → `bg-brand-default` at the bound value)
- AND the overall unit suite MUST stay green

#### Scenario: Build stays green
- GIVEN the new primitives
- WHEN `npm run build` runs
- THEN it MUST pass (the primitives compile; presentational where possible, `"use client"` only where a DOM event
  is owned)

**Acceptance Criteria:**
- Render tests pass for every variant/state/size of all 16 primitives; `npm run build` + `npm run test:unit` green

---

### Requirement: Composition-Leaf Purity and Deferred Automated Fidelity
The primitives MUST be composition leaves (token-pure presentational components that consume only tokens + exported
assets and build no domain blocks), with the automated **F1 pixel-diff** explicitly deferred to `fidelity-harness`.

#### Scenario: Primitives are leaves, not blocks
- GIVEN the primitives
- WHEN their imports/output are inspected
- THEN they MUST consume only canonical tokens + exported assets (and, where applicable, other primitives such as
  PasswordInput/SearchInput extending Input, or Filter composing Radio) — and MUST NOT import or build domain blocks
  (GigCard, SidebarNav, …) or compose screens
- AND `npm run lint:composition` MUST still pass (the change adds no composed-screen violations)

#### Scenario: F1 automated fidelity is deferred and noted
- GIVEN `fidelity-harness` (the pixel-diff gate) is not yet built
- WHEN the verification scope is inspected
- THEN the change MUST build primitives to the measured geometry of `docs/DESIGN_SPECS.md` §5 and verify F2/F3/F4/F5
  deterministically now
- AND it MUST explicitly defer the automated F1 pixel-diff (vs the reference crops in
  `docs/design-system/reference-renders/`) to `fidelity-harness` (#9)

#### Scenario: Legacy components are untouched
- GIVEN the pre-redesign controls (`app/components/ui/*`, `app/components/auth/*`, `MainNav`, `LoadingButton`, …)
- WHEN the change's diff is inspected
- THEN those files MUST be unchanged (Phase 2 recomposes/removes them); this change adds the new vocabulary only

**Acceptance Criteria:**
- Primitives consume only tokens + assets (+ other primitives), build no blocks; `lint:composition` passes
- F2/F3/F4/F5 enforced now; automated F1 pixel-diff deferred to `fidelity-harness`; legacy components untouched

---

## Test Plan

This change ships components + tests. Validation is by deterministic commands. Commands assume the repo root.

### Primitives present
```bash
for p in Button Input PasswordInput SearchInput Select Radio Filter Tabs Toggle Tag CategoryTag StatusBadge Avatar Rating ViewToggle ProgressBar; do \
  test -f "app/components/primitives/$p.tsx" && echo "OK $p" || echo "CHECK $p"; done
test -f app/components/primitives/tokens.ts && test -f app/components/primitives/index.ts && echo "token map + barrel present"
```

### Token-purity of new primitives (F2) — no new baseline
```bash
npm run lint:tokens && echo "token-purity passes (no new off-token literals)"
grep -rEn '#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(|[0-9]+px' app/components/primitives && echo "CHECK raw literal" || echo "OK no raw literals"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "OK baseline unchanged" || echo "CHECK baseline grew"
```

### Typed API rejects off-system values (F2/type)
```bash
# clean tree type-checks
npx tsc --noEmit && echo "clean tree type-checks"
# plant an off-system variant, expect a type error, then revert
printf 'import {Button} from "@/app/components/primitives";\nexport const X = <Button variant="purple" />;\n' > app/components/primitives/__typetest.tsx
npx tsc --noEmit && echo "CHECK off-system value accepted" || echo "OK off-system value rejected by tsc"
rm -f app/components/primitives/__typetest.tsx
```

### Real assets (F4)
```bash
grep -rqE 'icons/(search|clear|grid|list|star|verified|radio-off|radio-on|status-dot)' app/components/primitives && echo "OK icon primitives use exported assets"
grep -rqiE 'eye|attach' docs/DESIGN_SPECS.md && echo "OK eye/attach residuals documented"
```

### All-states render coverage (F3)
```bash
npx vitest run __tests__/unit/components/ui-primitives.test.tsx 2>&1 | tail -6
```

### Composition + build + suite (F5 + green gates)
```bash
npm run lint:composition && echo "composition lint passes"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
```

### Manual review
1. Render each primitive in every documented variant/state/size; confirm each library state is present and styled
   from tokens (no raw values).
2. Confirm standard controls (Button/Input/Select/StatusBadge pill) measure 40px via `size/control` and use
   `radius/md`; ProgressBar is 4px, track `text/subtle`, fill `brand/default`, radius `xs`.
3. Confirm icon-bearing primitives use the exported SVGs; `eye`/`attach` residuals are flagged (PasswordInput reveal
   has an accessible fallback, not a redrawn glyph).
4. Confirm the typed API rejects an off-system value and that the automated F1 pixel-diff is deferred to
   `fidelity-harness`.
