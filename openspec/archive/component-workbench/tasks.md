# Implementation Tasks: component-workbench

> **The living catalog / dev surface.** Stand up an in-app, route-based workbench under `app/workbench/` (NOT
> Storybook) driven by a typed registry that documents every token, primitive (all states), block (all variants
> from fixtures), template, and layout primitive; maps each to its reference render; and assembles a sample screen
> from fixtures (the first affirmative `@composed-screen`). Token-pure, dev-only, **catalog + registry + sample +
> test only** — no pixel gate (#9), no real routes/data (Phase 2), no Phase 1 models, no kit/legacy edits.
> Automated F1 pixel-diff deferred to `fidelity-harness`. Friction: low.

---

## Task 1: [x] Catalog registry + dev-only layout + reference mapping

**Implementation Notes:**
- Create `app/workbench/registry.tsx` exporting a typed manifest:
  ```ts
  type Kind = "token" | "primitive" | "block" | "template" | "layout";
  interface CatalogEntry { id: string; kind: Kind; title: string; reference: string; Story: () => ReactNode }
  export const CATALOG: CatalogEntry[] = [ ... ];
  ```
  - **Reference paths** point at real files (repo-root-relative): primitives + tokens →
    `docs/design-system/reference-renders/components/library-full.png`; blocks + templates + layout →
    `docs/design-system/reference-renders/components/components-frames-full.png`; the sample screen →
    `docs/design-system/reference-renders/frames/specialist-dashboard.lossy.jpg`.
  - **Stories** render all states: blocks from `@/app/components/blocks/fixtures` (every variant); primitives via
    inline state matrices (reuse the matrices from `__tests__/unit/components/ui-primitives.test.tsx`); tokens as
    swatches via token utility classes + token *names* (NO hex/px literals in source); templates = AppShell/
    AuthLayout with fixture/placeholder slots; layout = Stack/Grid/Split/Section/Panel/Rail with sample boxes.
- Create `app/workbench/layout.tsx` gating the surface to dev: `if (process.env.NODE_ENV === "production") notFound()`.

**Test Plan:**
```bash
test -f app/workbench/registry.tsx && test -f app/workbench/layout.tsx && echo "OK registry + layout"
grep -q 'notFound' app/workbench/layout.tsx && echo "dev-only gate"
grep -rEn '#[0-9a-fA-F]{3,8}\b|[0-9]+px' app/workbench/registry.tsx && echo "CHECK literal" || echo "OK token-pure registry"
```
Expected: typed registry covering all kinds; reference paths to real files; dev-only gate; no raw literals.

---

## Task 2: [x] Catalog pages — index + per-kind sections

**Implementation Notes:**
- Create `app/workbench/page.tsx` (index): list all entries grouped by kind, linking to the sections.
- Create `app/workbench/{tokens,primitives,blocks,templates,layout}/page.tsx`: each filters `CATALOG` by kind and
  renders, per entry, the `title`, the `Story()` output, and the `reference` path (as text/link — inline-image
  display would require copying crops into `public/`, deferred). Use token utilities + layout primitives for the
  catalog chrome (token-pure; these pages are NOT `@composed-screen`, so `className` is allowed here).
- Presentational/server-safe — render states without event handlers (no client boundary).

**Test Plan:**
```bash
for s in tokens primitives blocks templates layout; do test -f "app/workbench/$s/page.tsx" && echo "OK $s" || echo "CHECK $s"; done
test -f app/workbench/page.tsx && echo "OK index"
grep -rEn '#[0-9a-fA-F]{3,8}\b' app/workbench/tokens/page.tsx && echo "CHECK hex in tokens page" || echo "OK no hex literals"
```
Expected: index + 5 kind sections render the registry; token-pure.

---

## Task 3: [x] Sample composed screen from fixtures (@composed-screen) + screens section

**Implementation Notes:**
- Create `app/workbench/screens/SpecialistDashboardComposition.tsx` with a top `/* @composed-screen */` marker,
  composing `AppShell` (sidebar=`SidebarNav` from `sidebarNavClientExpanded`, topbar=`Topbar` from `topbarFixture`)
  with content = `Section` + `BannerCard` + `Tabs` + a `Grid` of `GigCard` (the `layout==='grid'` fixtures) +
  `MessagesPanel` (preview) — all from `@/app/components/blocks/fixtures`.
  - **CRITICAL (composition lint):** NO `className=` and NO `style=` anywhere; arrange only via layout-primitive
    props (`Grid columns`, `Stack gap`, `Section title`). Import only from `@/app/components/{templates,blocks,
    layout,primitives}` and `@/app/components/blocks/fixtures`.
- Create `app/workbench/screens/page.tsx` rendering the composition next to its `frames/specialist-dashboard.lossy.jpg`
  reference (this page is a catalog page, not a composed screen — `className` allowed here).

**Test Plan:**
```bash
test -f app/workbench/screens/SpecialistDashboardComposition.tsx && echo "OK composition" 
grep -q '@composed-screen' app/workbench/screens/SpecialistDashboardComposition.tsx && echo "marked composed-screen"
grep -E '\b(className|style)\s*=' app/workbench/screens/SpecialistDashboardComposition.tsx && echo "CHECK styling in screen" || echo "OK no styling literals"
npm run lint:composition && echo "composition lint passes (>=1 checked)"
```
Expected: sample screen composes AppShell + blocks from fixtures; `lint:composition` PASSES with ≥1 composed screen.

---

## Task 4: [x] Coverage + render test

**Implementation Notes:**
- Add `__tests__/unit/components/workbench.test.tsx` (jsdom; Node `fs` available) asserting:
  - the registry's `primitive` ids ⊇ the 16 primitives and `block` ids ⊇ the 17 blocks (cross-check by importing
    `@/app/components/primitives` + `@/app/components/blocks` and filtering function exports, or against an explicit
    known list), plus the 2 templates + 6 layout primitives + the token groups;
  - **every** `CATALOG[i].reference` resolves to an existing file (`fs.existsSync(path.join(process.cwd(), ref))`);
  - the sample `SpecialistDashboardComposition` renders from fixtures (e.g. a "К проекту" CTA and the "Дашборд" nav
    item appear).

**Test Plan:**
```bash
npx vitest run __tests__/unit/components/workbench.test.tsx 2>&1 | tail -8
```
Expected: coverage + reference-exists + sample-screen render tests pass.

---

## Task 5: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec delta's Test Plan (presence, composition affirmative, token-purity
  with unchanged baseline, no Storybook dep, coverage/render test, build, unit suite).
- Confirm scope discipline: **catalog + registry + sample + test only** — no Storybook dependency added
  (`package.json` unchanged deps), no kit edits (`components/{primitives,blocks,layout,templates}` unchanged), no
  legacy/shell edits, no Phase 1 models, no real routes/data. Workbench dev-only. F1 pixel-diff deferred to #9.

**Test Plan:**
```bash
npm run lint:tokens && echo "token-purity passes"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "baseline unchanged" || echo "CHECK baseline grew"
npm run lint:composition && echo "composition lint passes (affirmative)"
grep -iE '"@?storybook' package.json && echo "CHECK storybook dep" || echo "OK no storybook"
git status --porcelain | grep -E 'components/(primitives|blocks|layout|templates)/|MainNav|\(protected\)/layout.tsx' && echo "CHECK kit/legacy modified" || echo "OK kit + legacy untouched"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
```
Expected: all gates green; baseline unchanged; no Storybook; kit + legacy untouched; F1 deferred to `fidelity-harness`.

---

## Summary

Total tasks: 5
Estimated effort: 4–6 hours (friction: low — documents the existing kit; no new dependency)

**Deliverables:**
- ✅ `app/workbench/registry.tsx` — typed catalog manifest (entity → reference baseline → all-states story) + dev-only `layout.tsx`.
- ✅ Catalog pages: index + tokens/primitives/blocks/templates/layout sections, rendered from the registry, token-pure.
- ✅ `app/workbench/screens/SpecialistDashboardComposition.tsx` — the first affirmative `@composed-screen` (AppShell + blocks from fixtures), passing `lint:composition`.
- ✅ `__tests__/unit/components/workbench.test.tsx` — coverage (registry ⊇ all kit entities), reference-exists, sample-screen render.

**Critical path:** registry + dev gate (1) → catalog pages (2) → sample composed screen (3) → coverage/render test (4) → acceptance (5).

**Scope guards (non-goals):**
- No Storybook dependency (in-app route catalog instead); no pixel-diff gate (`fidelity-harness` #9); no real
  routes/data/shell cutover (Phase 2); no Phase 1 models; no new tokens/primitives/blocks/templates; no kit/legacy edits.

**Success criteria:**
- ✅ Browsable catalog of every entity (all states) from a typed registry; each maps to an existing reference render
- ✅ Sample screen composes from AppShell + blocks + fixtures and passes `lint:composition` (≥1 checked)
- ✅ Coverage test green; `npm run build` + `test:unit` + `lint:tokens` + `lint:composition` green; no Storybook; F1 deferred
