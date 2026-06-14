# UI Specification Delta: component-workbench

This document contains specification changes for the `component-workbench` change.

Scope note: these requirements implement the **living catalog / dev surface** from the UI Redesign plan (#8) — a
browsable, in-app, route-based workbench under `app/workbench/` that documents every token, primitive, block, and
template (all states) from a typed registry, maps each entry to its reference render, and assembles a sample screen
from fixtures (the first affirmative `@composed-screen`). It ships **a catalog + registry + sample composition +
test only**. It does **not** install Storybook, build the pixel-diff gate (`fidelity-harness` #9), wire real routes
or data (Phase 2), add Phase 1 models, or change any kit/legacy code. F2 (token-purity) and F5 (composition) are
enforced; the automated **F1 pixel-diff** is deferred to `fidelity-harness`, which consumes this registry.

---

## ADDED Requirements

### Requirement: Living Catalog of Every System Entity
The change MUST provide a browsable, in-app workbench under `app/workbench/`, driven by a typed registry, that
documents every system entity with all its states: every token group, all 16 primitives, all 17 blocks, the 2
templates, and the 6 layout primitives. The workbench MUST be a dev-only surface.

#### Scenario: Workbench is browsable with per-kind sections
- GIVEN the change is implemented
- WHEN the workbench is opened in development
- THEN there MUST be an index plus per-kind catalog sections (tokens, primitives, blocks, templates, layout, screens)
  rendered from the typed registry

#### Scenario: Every system entity has a catalog story with all states
- GIVEN the catalog registry
- WHEN its entries are inspected
- THEN it MUST contain a story for every token group (colour, radius, spacing, type, shadow), all 16 primitives
  (each rendered in every variant/state/size), all 17 blocks (each rendered in every variant from
  `app/components/blocks/fixtures.ts`), the 2 templates (AppShell, AuthLayout), and the 6 layout primitives
  (Stack, Grid, Split, Section, Panel, Rail)

#### Scenario: Workbench is dev-only
- GIVEN the workbench routes
- WHEN `NODE_ENV` is `production`
- THEN the workbench MUST NOT render (e.g. `notFound()` via a shared `app/workbench/layout.tsx`) — it is a dev
  surface, not shipped UI

**Acceptance Criteria:**
- `app/workbench/` renders an index + per-kind sections from a typed registry
- The registry covers all token groups, 16 primitives (all states), 17 blocks (all variants), 2 templates, 6 layout primitives; dev-only

---

### Requirement: Reference-Crop Mapping (fidelity baseline registry)
Each catalog entry MUST map to a reference render that exists under `docs/design-system/reference-renders/`, and the
registry MUST expose the `(entity → reference baseline → renderable story)` mapping that `fidelity-harness` (#9) will
consume.

#### Scenario: Each entry maps to an existing reference render
- GIVEN the catalog registry
- WHEN each entry's `reference` path is resolved
- THEN it MUST point to a file that exists under `docs/design-system/reference-renders/` (e.g. primitives/tokens →
  `components/library-full.png`; blocks/templates → `components/components-frames-full.png`; the sample screen →
  `frames/specialist-dashboard.lossy.jpg`)

#### Scenario: Registry is the baseline mapping for the fidelity harness
- GIVEN the registry
- WHEN its shape is inspected
- THEN each entry MUST expose its `id`, `kind`, `reference`, and a renderable story — the triple `fidelity-harness`
  (#9) iterates to produce per-entity crops + diffs (this change maps baselines; it does NOT diff)

**Acceptance Criteria:**
- Every registry entry's `reference` file exists; the registry exposes entity→baseline→story for #9
- Per-entity crops and pixel-diffing are explicitly deferred to `fidelity-harness`

---

### Requirement: Screen Composition from Fixtures (pre-route)
The workbench MUST assemble at least one sample screen from a template + slotted blocks + fixtures, marked
`@composed-screen`, which passes the composition lint — proving screens compose from the kit before touching live
routes.

#### Scenario: A sample screen is composed from the kit + fixtures
- GIVEN the workbench
- WHEN the sample composition is inspected
- THEN it MUST compose `AppShell` + domain blocks (e.g. SidebarNav, Topbar, BannerCard, GigCard·grid, MessagesPanel)
  arranged via layout primitives, bound to `app/components/blocks/fixtures.ts` — with no backend/route/data wiring

#### Scenario: The sample composed screen passes the composition lint
- GIVEN the sample screen carries the `/* @composed-screen */` marker
- WHEN `npm run lint:composition` runs
- THEN it MUST PASS with the sample counted as a checked composed screen (≥ 1), i.e. the file imports only from
  templates/blocks/primitives/layout/data and contains no `className=` or `style=` attribute

#### Scenario: The sample screen renders from fixtures
- GIVEN the sample composition component
- WHEN it is rendered in a test
- THEN it MUST render its blocks from fixtures (e.g. a GigCard "К проекту" CTA and the SidebarNav "Дашборд" item are
  present) with no backend

**Acceptance Criteria:**
- A sample `@composed-screen` composes AppShell + blocks from fixtures; `lint:composition` PASSES with ≥1 checked
- The sample screen renders from fixtures (render test)

---

### Requirement: Coverage and Build Verification
A test MUST assert the registry covers every system entity (cross-checked against the kit barrels) and that every
entry's reference exists; the catalog MUST build and the unit suite stay green.

#### Scenario: Coverage test asserts complete entity coverage
- GIVEN `__tests__/unit/components/workbench.test.tsx`
- WHEN it runs
- THEN it MUST assert the registry's primitive ids ⊇ the 16 primitives exported by `@/app/components/primitives` and
  its block ids ⊇ the 17 blocks exported by `@/app/components/blocks`, plus the 2 templates and 6 layout primitives
- AND it MUST assert every registry entry's `reference` file exists on disk

#### Scenario: Catalog builds and suite stays green
- GIVEN the workbench routes
- WHEN `npm run build` and `npm run test:unit` run
- THEN the build MUST pass (the catalog compiles) and the overall unit suite MUST stay green

**Acceptance Criteria:**
- Coverage test passes (registry ⊇ all kit entities, cross-checked vs barrels; all references exist)
- `npm run build` + `npm run test:unit` green

---

### Requirement: Token-Purity, No-Storybook Scope, and Deferred Fidelity
The workbench MUST be token-pure and built without a Storybook dependency, leaving the automated pixel-diff to
`fidelity-harness` and all kit/legacy/route code unchanged.

#### Scenario: Workbench is token-pure
- GIVEN the workbench source under `app/workbench/`
- WHEN it is inspected
- THEN it MUST contain no raw hex/`rgb()`/`px` literals (swatches use token utility classes; resolved values, if
  shown, come from the imported token module — not source literals)
- AND `npm run lint:tokens` MUST pass with **no new baseline entries**

#### Scenario: No Storybook dependency; kit/legacy/routes unchanged
- GIVEN the change's diff and `package.json`
- WHEN inspected
- THEN no Storybook (or equivalent heavy catalog) dependency MUST be added; the catalog is in-app Next routes
- AND no primitive/block/template/legacy file, `app/(protected)/layout.tsx`, or Phase 1 model MUST be changed

#### Scenario: Automated pixel-diff deferred to fidelity-harness
- GIVEN `fidelity-harness` (#9) is not built
- WHEN the verification scope is inspected
- THEN this change MUST map entities to reference baselines and verify coverage/build/token-purity/composition now,
  and MUST explicitly defer the automated F1 pixel-diff to `fidelity-harness`

**Acceptance Criteria:**
- No raw literals in `app/workbench/`; `lint:tokens` passes with an unchanged baseline; no Storybook dependency
- No kit/legacy/route/model changes; automated F1 pixel-diff deferred to `fidelity-harness`

---

## Test Plan

This change ships a catalog + registry + sample composition + test. Validation is by deterministic commands.
Commands assume the repo root.

### Workbench + registry + sample screen present
```bash
test -f app/workbench/registry.tsx && test -f app/workbench/layout.tsx && test -f app/workbench/page.tsx && echo "registry + layout + index present"
for s in tokens primitives blocks templates layout screens; do test -f "app/workbench/$s/page.tsx" && echo "OK section $s" || echo "CHECK $s"; done
test -f app/workbench/screens/SpecialistDashboardComposition.tsx && echo "sample composed screen present"
grep -q '@composed-screen' app/workbench/screens/SpecialistDashboardComposition.tsx && echo "sample marked @composed-screen"
```

### Composition lint (now affirmative — ≥1 composed screen)
```bash
npm run lint:composition && echo "composition lint passes with the sample screen checked"
# the sample screen must contain no className/style and only kit/fixture imports (the lint enforces this)
grep -E '\b(className|style)\s*=' app/workbench/screens/SpecialistDashboardComposition.tsx && echo "CHECK styling in screen" || echo "OK no styling literals in screen"
```

### Token purity (F2) — no new baseline; dev-only
```bash
npm run lint:tokens && echo "token-purity passes"
grep -rEn '#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(|[0-9]+px' app/workbench && echo "CHECK raw literal" || echo "OK no raw literals"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "OK baseline unchanged" || echo "CHECK baseline grew"
grep -q 'notFound' app/workbench/layout.tsx && echo "OK dev-only gate present"
```

### No Storybook dependency; kit/legacy unchanged
```bash
grep -iE '"@?storybook' package.json && echo "CHECK storybook dep added" || echo "OK no storybook dependency"
git status --porcelain | grep -E 'components/(primitives|blocks|layout|templates)/|MainNav|\(protected\)/layout.tsx' && echo "CHECK kit/legacy modified" || echo "OK kit + legacy untouched"
```

### Coverage + render + build + suite
```bash
npx vitest run __tests__/unit/components/workbench.test.tsx 2>&1 | tail -8
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
```

### Manual review
1. `npm run dev`, open `/workbench` — browse tokens, primitives (all states), blocks (all variants), templates,
   layout, and the sample screen; confirm each entry shows its reference crop.
2. Confirm the sample screen composes AppShell + blocks from fixtures with no styling literals and passes the
   composition lint as a real (≥1) composed screen.
3. Confirm the registry exposes entity→reference→story and that the automated pixel-diff is deferred to
   `fidelity-harness`.
