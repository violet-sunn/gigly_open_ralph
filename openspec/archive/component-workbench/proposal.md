# Change Proposal: component-workbench

> Phase 0, change 8 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It is the **living catalog / dev surface**: a browsable explorer of every token, primitive, block, and template
> (with all states), each mapped to its reference render, plus the place where screens are first **assembled from
> the kit (from fixtures) before they touch real routes**. It makes the mechanism inspectable and is the registry
> the fidelity gate (`fidelity-harness` #9) will diff against.

## Problem Statement

Phase 0 has produced the full mechanism — tokens, 6 layout primitives, 2 templates, 16 primitives, 17 blocks — but
there is **no surface to see it**. Today:

- The kit is only visible through **unit tests** (assertions on classNames) — there is no rendered, browsable view
  of every primitive/block/template in every state. A developer (or the designer) cannot eyeball the system.
- Screens (Phase 2) are about to be composed, but there is **nowhere to assemble and prove a composition from
  fixtures before wiring it to a live route + real data**. The composition rule + lint exist, yet **zero composed
  screens** have ever exercised the lint affirmatively (it has only been proven by a *planted* failure).
- The reference renders (`docs/design-system/reference-renders/`) exist but are **not mapped** to the live kit
  entities, so the future pixel gate (`fidelity-harness` #9) has no registry of "entity → baseline → renderable" to
  iterate.

The planning doc (#8) calls for "the living catalog that is the dev surface … where fidelity baselines live."

## Proposed Solution

Stand up an **in-app, route-based catalog** under `app/workbench/` — a dev-only explorer driven by a typed
**catalog registry**, plus a **sample screen composed from fixtures**. Four deliverable groups:

1. **Catalog registry** (`app/workbench/registry.tsx`) — a typed manifest enumerating **every system entity**:
   - `kind: 'token' | 'primitive' | 'block' | 'template' | 'layout'`, `id`, `title`, a `reference` path (a real file
     under `docs/design-system/reference-renders/`), and a `Story` render function showing **all states**.
   - Covers token groups (colour/radius/spacing/type/shadow), the **16 primitives** (every variant/state/size), the
     **17 blocks** (every variant, rendered from `app/components/blocks/fixtures.ts`), the **2 templates**, and the
     **6 layout primitives**. This registry is the SSOT the catalog pages render and the coverage test asserts.

2. **Catalog pages** (`app/workbench/`) — an index page + per-kind sections (tokens, primitives, blocks, templates,
   layout) that render the registry's `Story` for each entry beside a thumbnail/link to its `reference` crop. A
   shared `app/workbench/layout.tsx` gates the whole surface to **non-production** (`notFound()` in production) — the
   workbench is a dev surface, not shipped UI. Token-pure (it lives in `app/`, scanned by `lint:tokens`).

3. **Sample composed screen from fixtures** (`app/workbench/screens/SpecialistDashboardComposition.tsx`) — a screen
   marked `/* @composed-screen */` that composes **`AppShell` + SidebarNav + Topbar + BannerCard + Tabs +
   GigCard·grid + MessagesPanel** from fixtures, arranged via layout primitives, with **no `className`/`style`** and
   imports only from the kit + fixtures. It **passes `lint:composition`** — the first affirmative composed screen,
   proving the whole stack (tokens → primitives → blocks → template → composition) assembles from the kit before any
   Phase 2 route exists. A `screens` catalog section renders it next to `frames/specialist-dashboard.lossy.jpg`.

4. **Coverage + render verification** (`__tests__/unit/components/workbench.test.tsx`) — asserts the registry covers
   every system entity (cross-checked against the `primitives`/`blocks` barrels so a future addition without a story
   fails), that **every entry's `reference` file exists on disk**, and that the sample composed screen renders from
   fixtures. `lint:composition` (affirmative), `lint:tokens`, `npm run build`, and `npm run test:unit` stay green.

This change emits **a catalog + a registry + a sample composition + a test only**. It does **not** install Storybook
(deliberate — see Non-Goals), build the pixel-diff gate (`fidelity-harness` #9), wire real app routes or real data
(Phase 2 `compose-*`), add Phase 1 models, or change any primitive/block/template/legacy code. It maps entities to
the **existing** reference renders; per-entity crops + the actual diffing are #9.

## Constraints

### MUST Requirements
- A browsable workbench MUST exist under `app/workbench/` documenting **every** token group, all **16 primitives**
  (all states), all **17 blocks** (all variants, from fixtures), the **2 templates**, and the **6 layout
  primitives**, driven by a typed registry.
- Each catalog entry MUST map to a **reference render** that **exists** under `docs/design-system/reference-renders/`.
- The workbench MUST assemble **at least one sample screen from fixtures**, marked `@composed-screen`, that **passes
  `npm run lint:composition`** (template + slotted blocks + data only; no `className`/`style`; kit-only imports).
- A test MUST assert the registry covers every system entity (cross-checked against the kit barrels) and that every
  entry's reference file exists; the sample screen MUST render from fixtures.
- The workbench MUST be **token-pure** (no raw hex/`rgb()`/`px` literals in source — `lint:tokens` passes with **no
  new baseline entries**) and MUST stay **dev-only** (`notFound()` in production). `npm run build` + `npm run
  test:unit` MUST stay green.

### SHOULD Requirements
- The catalog SHOULD be data-driven from the registry so the per-kind pages and the coverage test share one source
  of truth; adding a kit entity without a story SHOULD fail the coverage test.
- Token entries SHOULD display swatches/samples via token utility classes and the token *name* — and MUST NOT embed
  raw hex/px literals in source (display resolved values via the imported token module if needed, not as literals).
- The registry SHOULD expose, per entry, the `(entity → reference baseline → renderable Story)` triple that
  `fidelity-harness` (#9) will iterate to produce per-entity crops + diffs.
- Catalog pages SHOULD be presentational/server-safe (states rendered without event handlers, no client boundary).

### Non-Goals
- **No Storybook dependency.** A route-based in-app catalog is built instead (low friction, no heavy peer-dep/build
  pipeline, integrates with the existing Next build + `lint:tokens`/`lint:composition` + Vitest). "Storybook-style"
  = a browsable explorer of every entity + states, not the Storybook tool.
- **No pixel-diff gate.** The automated F1 diff + generativity scaffold is `fidelity-harness` (#9). The workbench
  *maps* entities to baselines; it does not diff. F1 stays deferred.
- **No real routes / data / shell cutover** (Phase 2 `compose-*`); **no Phase 1 models.** The sample screen is a
  fixtures-only demonstration under `/workbench`, not a live app route.
- **No new tokens/primitives/blocks/templates and no edits to existing kit or legacy code.** The workbench documents
  what exists; a gap is a prior-layer change, not a fix here.

## Success Criteria

1. `app/workbench/` renders a browsable catalog of every token group, all 16 primitives (all states), all 17 blocks
   (all variants from fixtures), 2 templates, and 6 layout primitives, from a typed registry.
2. Every registry entry maps to a reference render that exists under `docs/design-system/reference-renders/`.
3. A sample screen composed from `AppShell` + blocks + fixtures (marked `@composed-screen`) **passes
   `lint:composition`** and renders from fixtures.
4. The coverage test passes (registry ⊇ all kit entities, cross-checked vs barrels; all references exist); `npm run
   build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green.
5. No Storybook dependency added; workbench is dev-only; no kit/legacy/route/data changes; automated pixel-diff
   explicitly deferred to `fidelity-harness`.

## Affected Areas

- `app/workbench/registry.tsx` (new — typed catalog manifest + stories)
- `app/workbench/layout.tsx` (new — dev-only gate)
- `app/workbench/page.tsx` + `app/workbench/{tokens,primitives,blocks,templates,layout,screens}/page.tsx` (new — catalog sections)
- `app/workbench/screens/SpecialistDashboardComposition.tsx` (new — sample `@composed-screen` from fixtures)
- `__tests__/unit/components/workbench.test.tsx` (new — coverage + reference-exists + sample-screen render)
- read-only inputs: the kit (`app/components/{primitives,blocks,layout,templates}/`), `app/components/blocks/fixtures.ts`,
  `docs/design-system/reference-renders/`, the canonical tokens
- `openspec/specs/ui/spec.md` (spec delta)
- (NOT modified: any primitive/block/template/legacy code; `app/(protected)/layout.tsx`; `package.json` deps)

## Risks & Mitigations

**Risk**: Installing Storybook in a Next 15 / React 19 app is heavy (peer deps, separate build) — at odds with
"friction: low."
**Mitigation**: Build a route-based in-app catalog instead; document the decision. It needs no new dependency and
reuses the existing build/lint/test.

**Risk**: A token catalog that prints hex values would introduce raw `#rrggbb` literals and **fail `lint:tokens`**.
**Mitigation**: Render swatches via token *utility classes* + token names; if resolved values are shown, read them
from the imported token module at runtime (not source literals). The acceptance asserts the baseline is unchanged.

**Risk**: The sample composed screen trips `lint:composition` (it forbids **any** `className`/`style` and non-kit
imports).
**Mitigation**: Compose strictly via layout primitives (props, not className) + blocks + templates + fixtures
(`@/app/components/blocks/fixtures` is an allowed import); no `className`/`style` anywhere. The coverage test +
`lint:composition` both gate it.

**Risk**: Coverage drifts — a new primitive/block ships without a catalog story.
**Mitigation**: The coverage test cross-checks the registry against the `primitives`/`blocks` barrels (and the known
template/layout sets), failing if any entity lacks a story.

**Risk**: Per-entity reference crops don't exist (only library-full / tiles / frames do).
**Mitigation**: Map each entity to the best-available existing render (primitives/tokens → `library-full.png`;
blocks/templates → `components-frames-full.png`; the sample screen → its `frames/*.lossy.jpg`); the test asserts the
file exists. Per-entity crops + diffing are `fidelity-harness` (#9), which consumes this registry.

**Risk**: Workbench routes ship to production.
**Mitigation**: `app/workbench/layout.tsx` calls `notFound()` when `NODE_ENV === 'production'` — dev-only surface.
