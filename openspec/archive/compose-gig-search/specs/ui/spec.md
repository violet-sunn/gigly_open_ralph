# UI Specification Delta: compose-gig-search

This document contains specification changes for the `compose-gig-search` change — Phase-2 screen composition #4. It
composes the **SPECIALIST `/gigs`** browse/search screen from kit blocks (`FilterBar` + `ViewToggle` +
`GigCard·(grid/list)`), inside the `AppShell` the shell-cutover put in the protected layout, **preserving** the existing
OPEN-gig server query (search / tags / budget / sort / pagination) and **adding** the design's **category** filter,
**Рейтинг** filter/sort, **grid⇄list** toggle, and the RU **"Найдено N"** count. It ships **a functional `FilterBar`
extension + browse view-model mappers + the `GigSearch` composition + the page wiring + tests only** — F5
composition-pure, F3 logical parity, with the **F1 ≤1% pixel-diff deferred** (substitute font; produced in both
layouts). It does **not** touch the gig-detail screen, data models, server actions, the shell, the block view-model
contracts, or the existing search/tag/budget/sort/pagination semantics.

---

## ADDED Requirements

### Requirement: Gig Search Composed from Blocks
The `/gigs` body MUST be composed from kit blocks as a composition-pure screen (F5), inside the layout's `AppShell`.

#### Scenario: GigSearch is a composed screen
- GIVEN `app/(protected)/gigs/GigSearch.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `FilterBar` + `ViewToggle` + `GigCard·(grid/list)` + the
  "Найдено N" count via layout primitives (Section/Grid/Stack), import only kit/`lib`/`actions`/`react`/`next`, and
  contain **no** `className=` / `style=` / raw markup

#### Scenario: The page renders it for SPECIALIST
- GIVEN `app/(protected)/gigs/page.tsx`
- WHEN a SPECIALIST loads `/gigs`
- THEN the page MUST build the data server-side and render `<GigSearch>` (inside the shell), replacing the bespoke
  header + `GigBrowseClient`/`GigFilters` + raw gig rows; the SPECIALIST-only redirect (CLIENT → `/dashboard?error=…`)
  MUST be preserved

**Acceptance Criteria:**
- `GigSearch` is an F5-pure `@composed-screen` composing `FilterBar` + `ViewToggle` + `GigCard·(grid/list)` + count; the page renders it for SPECIALIST
- SPECIALIST-only redirect preserved; bespoke browse markup + `GigFilters` removed/retired

### Requirement: Preserved Search / Tag / Budget / Sort / Pagination
The composition MUST preserve the existing OPEN-gig query and pagination behavior exactly.

#### Scenario: Server query + pagination unchanged
- GIVEN the existing `search` / `tags` / `minBudget` / `maxBudget` / `sort` / `page` URL params
- WHEN `/gigs` is loaded
- THEN the OPEN-gig `where`/`orderBy`, the 25-per-page parallel `findMany` + `count`, the page-validation redirects, and
  `PaginationControls` MUST behave exactly as before (URL-state, shareable); their semantics MUST NOT change

#### Scenario: Gig links preserve active filters
- GIVEN the composed results with active filters
- WHEN a `GigCard` is opened
- THEN it MUST navigate to `/gigs/[id]?from=browse&…` preserving the active filter params (the existing behavior)

**Acceptance Criteria:**
- search/tag/budget/sort/pagination preserved (URL-state, 25/page, redirects, SPECIALIST-only); the gig-browse integration tests stay green
- `GigCard` → `/gigs/[id]?from=browse&…` with filters preserved

### Requirement: Added Category, Рейтинг, View Toggle, and "Найдено N"
The composition MUST add the design's category filter, rating filter/sort, grid⇄list toggle, and RU result count.

#### Scenario: Category filter
- GIVEN the `FilterBar` category `Select` (the five categories: Маркетинг / Дизайн / Программирование / Разработка /
  Кодинг)
- WHEN a category is chosen
- THEN the results MUST filter to gigs of that `categorySlug` (via a `category` URL param, validated by `isCategorySlug`)

#### Scenario: Рейтинг filter/sort and grid⇄list toggle
- GIVEN the `Рейтинг` control and the `ViewToggle`
- WHEN a min-rating is chosen / a layout is toggled
- THEN the results MUST filter/sort by the **gig owner (client) aggregate** rating (a `minRating`/`sort=rating` URL
  param), and the `GigCard`s MUST render in **grid** (`Grid`, `layout: 'grid'`) or **list** (`Stack`, `layout: 'list'`)
  per a `view` URL param

#### Scenario: Result count
- GIVEN the total matched count
- WHEN the results render
- THEN a RU **"Найдено N"** count MUST be shown (replacing the English "Showing X-Y of Z gigs")

**Acceptance Criteria:**
- Category filter (5 categories), Рейтинг filter/sort (client aggregate), grid⇄list `ViewToggle`, "Найдено N" — all URL-param-driven (F3)

### Requirement: Functional FilterBar Block (composition-gap fill)
The `FilterBar` block MUST be extended to **drive** the filter/search UI (it is presentational-only today), additively
and backward-compatibly.

#### Scenario: FilterBar emits typed filter/search changes
- GIVEN `app/components/blocks/FilterBar.tsx`
- WHEN inspected
- THEN it MUST render a controlled `SearchInput` (value + `onSearch`/`onSubmit`), the category/sort/Рейтинг `Select`s,
  and the `ViewToggle`, each emitting a typed callback; the new props MUST be **optional** (the `search-only`/`full`
  fixtures + workbench usage keep working); it MUST be token-pure (primitives + tokens only)

**Acceptance Criteria:**
- `FilterBar` extended to drive search + category/sort/rating selects + view toggle (typed callbacks), additive + backward compatible, token-pure

### Requirement: Browse Data Binding via Contract-Typed Mappers
The screen MUST bind real data through server-only, contract-typed mappers reusing `toGigCardVM`.

#### Scenario: Browse cards show the client rating + name
- GIVEN an OPEN gig
- WHEN `toBrowseGigCardVM(gig, layout)` runs
- THEN it MUST reuse `toGigCardVM(gig, layout)` and override `rating` with the gig owner's aggregate
  (`getRatingForUser(clientId)`) and set `clientName` — assignable to `GigCardVM`

#### Scenario: getGigSearch returns cards, FilterBar VM, count, view
- GIVEN `getGigSearch(params)`
- WHEN it runs
- THEN it MUST return the gigs as `GigCardVM`s, a `FilterBarVM`, the total `count`, the pagination (`page`/`totalPages`/
  `perPage`), and the `view` — server-only, view-model types imported `import type`; the block view-model contract
  (`app/components/blocks/view-models.ts`) MUST be unchanged

**Acceptance Criteria:**
- `toBrowseGigCardVM` (client rating + `clientName`, reuses `toGigCardVM`) + `getGigSearch` (cards/filterBar/count/view); block view-model contract unchanged (screen-data types in `lib/view-models.ts`)

### Requirement: Reconciliation (reconcile, don't copy)
The legacy filter panel and the rating ambiguity MUST be reconciled, recording the resolution.

#### Scenario: Legacy tag/budget panel and rating semantics reconciled
- GIVEN the legacy 8-tag-checkbox + min/max-budget panel and the ambiguous "Рейтинг" for OPEN gigs
- WHEN they are composed into the design `FilterBar`
- THEN the FilterBar surfaces the design's controls (search + category + sort + Рейтинг + view); **tag** and **budget**
  filtering remain honored via URL params (server query unchanged) for deep links + the integration tests; **Рейтинг**
  maps to the **gig owner (client)** aggregate rating — all recorded as reconciliation, no filter capability lost

**Acceptance Criteria:**
- Reconciliation recorded: design FilterBar controls; tag/budget preserved via URL; Рейтинг = client aggregate; stale `/dashboard/gigs` target fixed to `/gigs`

### Requirement: Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced (both layouts) but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the gig-search E2E run
- THEN they MUST pass — the body is composition-pure, search/filter/sort/pagination/view match (F3), gig links work, and
  the existing gig-browse integration tests stay green

#### Scenario: F1 diff produced in both layouts; ≤1% deferred
- GIVEN the live `/gigs` captured at 1440px in **grid and list** and diffed vs `screens/specialist-gig-search.jpg`
  (`scripts/design-system/fidelity-diff.js`)
- WHEN the artifacts (diff / side-by-side / 50%-overlay) are reviewed
- THEN the composed layouts MUST be visually faithful; the automated ≤1% threshold is NOT yet met — dominated by the
  **substitute font** (SF Compact unlicensed), not a composition defect; ≤1% is reached once the font is licensed

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + gig-search E2E green; gig-browse integration tests green
- F1 diff produced in both layouts; composed layout visually faithful; ≤1% deferred to the font licence

---

## Test Plan

This change ships a block extension + mappers + a composition + page wiring + tests. Validation is by deterministic
commands. Commands assume the repo root.

### Composition + block + mappers
```bash
grep -qE '@composed-screen' app/\(protected\)/gigs/GigSearch.tsx && echo "GigSearch composed screen (F5 marker)"
grep -qE 'onSearch|onSelectFilter|onSort|onRating' app/components/blocks/FilterBar.tsx && echo "FilterBar drives filter changes"
grep -qE 'getGigSearch' lib/view-models.ts && grep -qE 'toBrowseGigCardVM' lib/view-models.ts && grep -qE 'toGigCardVM' lib/view-models.ts && echo "browse mappers reuse toGigCardVM"
grep -qE 'GigSearch' app/\(protected\)/gigs/page.tsx && echo "page renders GigSearch"
grep -q '/dashboard/gigs' app/\(protected\)/gigs/*.tsx app/\(protected\)/gigs/components/*.tsx 2>/dev/null && echo "CHECK stale /dashboard/gigs remains" || echo "stale /dashboard/gigs target fixed"
```

### F3 — added dimensions present
```bash
grep -q 'Найдено' app/\(protected\)/gigs/GigSearch.tsx && echo "Найдено N count"
grep -qE 'category|minRating|view' app/\(protected\)/gigs/page.tsx && echo "category + rating + view params in the query"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite (incl. preserved gig-browse integration)
```bash
npm run clean:test-db && npx vitest run __tests__/integration/gig-search-vm.test.ts 2>&1 | tail -10
npm run clean:test-db && npx vitest run __tests__/integration/gig-browsing.test.ts __tests__/integration/gig-filtering.test.ts __tests__/integration/gig-pagination.test.ts 2>&1 | tail -10
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Gig-search E2E (search / filter / sort / rating / view / pagination + gig links)
```bash
npx playwright test __tests__/e2e/compose-gig-search.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 fidelity diff — both layouts (artifacts; ≤1% deferred)
```bash
# capture /gigs at 1440px in grid AND list, then for each:
node scripts/design-system/fidelity-diff.js <gigs-grid-actual.png> screens/specialist-gig-search.jpg <outDir>/grid
node scripts/design-system/fidelity-diff.js <gigs-list-actual.png> screens/specialist-gig-search.jpg <outDir>/list
# review diff / side-by-side / overlay-50; ≤1% deferred (substitute font)
```

### Manual review
1. Confirm `GigSearch` is an F5-pure `@composed-screen` (FilterBar + ViewToggle + GigCard·(grid/list) + "Найдено N" via layout primitives; no className/style) rendered for SPECIALIST.
2. Confirm search/tag/budget/sort/pagination preserved (URL-state, redirects, SPECIALIST-only) and category + Рейтинг + grid⇄list + "Найдено N" added (F3).
3. Confirm `FilterBar` drives changes (extended, additive, token-pure) and the browse mapper shows the client rating + `clientName`, reusing `toGigCardVM`.
4. Confirm gig links → `/gigs/[id]?from=browse&…` preserve filters; the server query + `PaginationControls` reused; the stale `/dashboard/gigs` fixed.
5. Confirm the F1 diff is produced in **both** layouts (≤1% deferred to the font) and the block view-model contract is unchanged.
