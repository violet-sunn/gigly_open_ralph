# Implementation Tasks: compose-gig-search

> **Phase-2 screen composition.** Compose the SPECIALIST `/gigs` browse/search screen from kit blocks (`FilterBar` +
> `ViewToggle` + `GigCard·(grid/list)` + "Найдено N") inside the layout's `AppShell`, **preserving** the existing
> OPEN-gig query (search / tags / budget / sort / pagination) and **adding** category + Рейтинг + grid⇄list. Extend the
> presentational `FilterBar` into a functional block; add browse view-model mappers reusing `toGigCardVM`; F5
> composition-pure, F3 parity; **F1 ≤1% deferred** (substitute font; both layouts). Mirror the dashboards
> (`SpecialistDashboard.tsx` + `lib/view-models.ts::getSpecialistDashboard`). Friction: high.

---

## Task 1: [x] Make `FilterBar` functional (composition-gap fill, additive + backward compatible)

**Implementation Notes:**
- Extend `app/components/blocks/FilterBar.tsx` so it can **drive** the search/filter UI (today it is presentational —
  `SearchInput` has only `defaultValue`, the single `Select` has no `onSelect`). Add **optional** props + callbacks,
  keeping `variant: "full" | "search-only"` and the existing `vm`/`onViewChange` working (a block, so token classes /
  layout primitives are fine; it is NOT a `@composed-screen`):
  ```tsx
  import { SearchInput, Select, ViewToggle, type SelectOption } from "@/app/components/primitives";
  import { Stack } from "@/app/components/layout/Stack";
  import type { FilterBarVM } from "./view-models";

  interface FilterBarProps {
    vm: FilterBarVM;
    variant?: "full" | "search-only";
    onViewChange?: (v: "grid" | "list") => void;
    // NEW — optional so existing usage (workbench/fixtures) is unaffected:
    onSearch?: (query: string) => void;            // controlled search submit
    categories?: SelectOption[]; categoryValue?: string; onCategory?: (slug: string) => void;
    sortOptions?: SelectOption[]; sortValue?: string; onSort?: (sort: string) => void;
    ratingOptions?: SelectOption[]; ratingValue?: string; onRating?: (min: string) => void;
    // each Select is controlled by the screen (Select primitive is presentational: expanded/onToggle/onSelect)
    openSelect?: string | null; onToggleSelect?: (key: string | null) => void;
  }
  ```
  Render: a controlled `SearchInput` (value=`vm.query`, fire `onSearch` on Enter/submit), then in `full` the
  category/sort/Рейтинг `Select`s (only those whose option arrays are provided) + the `ViewToggle` (`onViewChange`).
  Each `Select` gets `expanded={openSelect === key}` + `onToggle`/`onSelect` wired to the screen. **Token-pure** — no
  raw colour/spacing literals; arrange via `Stack`. Do NOT change `FilterBarVM` (`app/components/blocks/view-models.ts`)
  — the new inputs are component props, not contract fields.
- Update the `filterBarFixture` only if needed (keep it valid; new props are optional).

**Test Plan:**
```bash
grep -qE 'onSearch|onCategory|onSort|onRating' app/components/blocks/FilterBar.tsx && echo "FilterBar drives changes"
grep -qE 'SpecialistGigCard|GigSearch' app/components/blocks/view-models.ts && echo "CONTRACT CHANGED (bad)" || echo "block contract unchanged (good)"
npm run lint:tokens && echo "token-pure"
```
Expected: `FilterBar` exposes typed filter/search callbacks (additive); block view-model contract unchanged; token lint green.

---

## Task 2: [x] Browse view-model mappers (`lib/view-models.ts`)

**Implementation Notes:**
- Extend `lib/view-models.ts` (server-only). Reuse `toGigCardVM`; browse cards show the **client's** rating (OPEN gigs
  have no specialist) + `clientName`:
  ```ts
  export type BrowseGig = GigForCard & { clientId: string; client?: { email: string; clientProfile: { companyName: string } | null } }

  /** Browse card: reuse toGigCardVM, then show the gig OWNER's rating + name (OPEN gigs have no specialist). */
  export async function toBrowseGigCardVM(gig: BrowseGig, layout: 'grid' | 'list' = 'grid'): Promise<GigCardVM> {
    const base = await toGigCardVM(gig, layout)
    const rating = await getRatingForUser(gig.clientId)
    return { ...base, rating, clientName: gig.client?.clientProfile?.companyName ?? gig.client?.email }
  }

  export interface GigSearchData {
    gigCards: GigCardVM[]
    filterBar: FilterBarVM
    count: number
    page: number
    totalPages: number
    perPage: number
    view: 'grid' | 'list'
  }

  /** Shape the browse query result + the FilterBar VM for the composed /gigs screen. */
  export async function getGigSearch(input: {
    gigs: BrowseGig[]; count: number; page: number; totalPages: number; perPage: number;
    view: 'grid' | 'list'; query: string; category?: string; sort: string; minRating?: string;
  }): Promise<GigSearchData> {
    const gigCards = await Promise.all(input.gigs.map((g) => toBrowseGigCardVM(g, input.view)))
    const filterBar: FilterBarVM = { query: input.query, view: input.view, filters: [] }
    return { gigCards, filterBar, count: input.count, page: input.page, totalPages: input.totalPages, perPage: input.perPage, view: input.view }
  }
  ```
  (Pass the already-queried gigs/count from the page so the existing OPEN-gig query stays the single source of truth.
  `import type` the VMs. The category/sort/rating **option lists** for the FilterBar come from `lib/categories`
  `CATEGORIES` + static sort/rating options, assembled in the page or here.)

**Test Plan:**
```bash
grep -qE 'toBrowseGigCardVM' lib/view-models.ts && grep -qE 'getGigSearch' lib/view-models.ts && grep -qE 'getRatingForUser\(gig.clientId\)|clientId' lib/view-models.ts && echo "browse mappers (client rating) reuse toGigCardVM"
```
Expected: `toBrowseGigCardVM` (client rating + `clientName`) + `getGigSearch` (cards/filterBar/count/view).

---

## Task 3: [x] `GigSearch` composed screen

**Implementation Notes:**
- Create `app/(protected)/gigs/GigSearch.tsx` (`'use client'`, `/* @composed-screen */`). Props = the `getGigSearch`
  result + the filter option lists. Owns the **filter/view URL state** (the `GigFilters` logic, retargeted to `/gigs`):
  read current params via `useSearchParams`, and on any change `router.push('/gigs?'+params)` (drop `page` on filter
  change). Compose via **layout primitives only** (no className/style):
  ```tsx
  /* @composed-screen */
  'use client'
  import { useState } from 'react'
  import { useRouter, useSearchParams } from 'next/navigation'
  import { Section } from '@/app/components/layout/Section'
  import { Grid } from '@/app/components/layout/Grid'
  import { Stack } from '@/app/components/layout/Stack'
  import { FilterBar, GigCard } from '@/app/components/blocks'
  import type { GigSearchData } from '@/lib/view-models'
  import type { SelectOption } from '@/app/components/primitives'

  export function GigSearch({ data, categoryOptions, sortOptions, ratingOptions }: {
    data: GigSearchData; categoryOptions: SelectOption[]; sortOptions: SelectOption[]; ratingOptions: SelectOption[]
  }) {
    const router = useRouter(); const params = useSearchParams()
    const [open, setOpen] = useState<string | null>(null)
    const nav = (mut: (p: URLSearchParams) => void) => { const p = new URLSearchParams(params.toString()); mut(p); p.delete('page'); router.push(`/gigs?${p.toString()}`) }
    const cards = data.gigCards
    return (
      <Section title="Поиск гигов" gap={6}>
        <FilterBar
          vm={data.filterBar}
          onSearch={(q) => nav((p) => (q ? p.set('search', q) : p.delete('search')))}
          categories={categoryOptions} categoryValue={params.get('category') ?? ''} onCategory={(c) => nav((p) => (c ? p.set('category', c) : p.delete('category')))}
          sortOptions={sortOptions} sortValue={params.get('sort') ?? 'newest'} onSort={(s) => nav((p) => (s && s !== 'newest' ? p.set('sort', s) : p.delete('sort')))}
          ratingOptions={ratingOptions} ratingValue={params.get('minRating') ?? ''} onRating={(r) => nav((p) => (r ? p.set('minRating', r) : p.delete('minRating')))}
          onViewChange={(v) => nav((p) => (v === 'list' ? p.set('view', 'list') : p.delete('view')))}
          openSelect={open} onToggleSelect={setOpen}
        />
        <span className="…">{/* NO — see below */}</span>
      </Section>
    )
  }
  ```
  The "Найдено N" count MUST be rendered without raw markup — use a layout/typography primitive or a small block. If no
  count primitive exists, render it via a `Section`/`Stack` + a text primitive; **if that forces raw markup, add a tiny
  token-pure `ResultCount` block** (gap-fill, like SearchPanel) rather than a `<span className>` in the screen. Then the
  results: `data.view === 'list' ? <Stack gap={4}>…list cards…</Stack> : <Grid columns={3} gap={4}>…grid cards…</Grid>`,
  each `<GigCard vm={vm} onOpen={() => router.push('/gigs/'+vm.id+'?from=browse&'+params.toString())} />`. No
  `className`/`style` in this file.

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/gigs/GigSearch.tsx && echo "composed screen"
grep -qE 'className=|style=' app/\(protected\)/gigs/GigSearch.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure composition (FilterBar + count + GigCard grid/list); ViewToggle + filters push URL state.

---

## Task 4: [x] Wire into `app/(protected)/gigs/page.tsx` (preserve query + pagination) + extend with category/rating/view

**Implementation Notes:**
- Keep the SPECIALIST-only redirect, searchParams parsing, the OPEN-gig `where`/`orderBy`, the parallel `findMany` +
  `count`, the page-validation redirects, and `PaginationControls`. Include `client` in the gig query (already does).
- **Extend** the query: parse `category` (validate via `isCategorySlug`) → add `{ categorySlug: category }` to the
  `AND`; parse `minRating` and `sort=rating` → filter/sort by the gig owner's aggregate rating (compute client ratings
  for the page's gigs via `getRatingForUser`, or pre-aggregate — keep it simple, e.g. sort/filter post-query on the
  page slice, documented). Parse `view` (`'grid' | 'list'`, default grid).
- Build the FilterBar option lists (`categoryOptions` from `CATEGORIES`; static `sortOptions` Новые/Дороже/Дешевле/По
  рейтингу; `ratingOptions` напр. 4★+/3★+) and call `getGigSearch({ gigs, count, page, totalPages, perPage: PAGE_SIZE,
  view, query: search ?? '', category, sort, minRating })`. Render `<GigSearch data={…} categoryOptions={…} … />` then
  `<PaginationControls currentPage={page} totalPages={totalPages} totalCount={totalCount} />` (it preserves every query
  param, incl. `view`/`category`/`minRating`). Replace the bespoke header + `GigBrowseClient` + raw rows + the English
  count + the bespoke empty states (use the composed empty state inside `GigSearch`, or keep a token-styled notice in
  the page).
- Remove/retire `GigBrowseClient.tsx` + `components/GigFilters.tsx` (superseded). If the `/`-to-focus-search hotkey is
  kept, re-home it into `GigSearch`. **Fix** the stale `/dashboard/gigs` push target → `/gigs`.

**Test Plan:**
```bash
grep -qE 'getGigSearch|GigSearch' app/\(protected\)/gigs/page.tsx && echo "page composed"
grep -qE "redirect\('/dashboard\?error=browse-gigs-specialists-only'\)" app/\(protected\)/gigs/page.tsx && echo "SPECIALIST-only redirect preserved"
grep -qE 'PaginationControls' app/\(protected\)/gigs/page.tsx && echo "pagination preserved"
grep -rq '/dashboard/gigs' app/\(protected\)/gigs/ 2>/dev/null && echo "CHECK stale target remains" || echo "stale /dashboard/gigs fixed"
```
Expected: page renders `GigSearch` + `PaginationControls`; query/pagination/redirects preserved; category/rating/view added; stale target fixed.

---

## Task 5: [x] Mapper unit tests + gig-search E2E + update markup-asserting specs

**Implementation Notes:**
- `__tests__/integration/gig-search-vm.test.ts` (mock `@/lib/prisma`/`next/*`; `createTestUser`/`createTestGig`/
  `createTestReview`): `toBrowseGigCardVM` shows the **client's** rating (seed a review for the client) + `clientName`,
  reusing `toGigCardVM`; `getGigSearch` returns the cards, `FilterBarVM` (query/view), count, page/totalPages, and view;
  cards assignable to `GigCardVM`.
- `__tests__/e2e/compose-gig-search.spec.ts` (setE2ESession as SPECIALIST + seed OPEN gigs with categories/budgets/tags
  via prisma into `file:./test.db` — the `compose-specialist-dashboard.spec.ts` patterns): the screen renders the
  `FilterBar` + "Найдено N" + a `GigCard`; a search narrows results (URL `?search=`); a **category** select filters; the
  **sort** changes order; **Рейтинг** filters; the **ViewToggle** switches grid⇄list (URL `?view=list`, `GigCard`
  layout changes); **pagination** works and preserves filters; a `GigCard` → `/gigs/[id]?from=browse&…`.
- Update the browse **E2E** specs that assert the old markup (`gig-browse-access.spec.ts`, `empty-states.spec.ts` gig
  sections, `gig-pagination.spec.ts` if it asserts "Showing … of …" / row markup) to the composed blocks (RU labels,
  `GigCard`, "Найдено N"). **Keep the gig-browse INTEGRATION tests** (`gig-browsing`/`gig-filtering`/`gig-pagination`)
  unchanged — they test the server query, which is preserved.

**Test Plan:**
```bash
npm run clean:test-db && npx vitest run __tests__/integration/gig-search-vm.test.ts 2>&1 | tail -12
npm run clean:test-db && npx vitest run __tests__/integration/gig-browsing.test.ts __tests__/integration/gig-filtering.test.ts __tests__/integration/gig-pagination.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/compose-gig-search.spec.ts --project=chromium 2>&1 | tail -12
```
Expected: mapper unit tests pass; the preserved gig-browse integration tests stay green; E2E confirms search/filter/sort/rating/view/pagination + gig links.

---

## Task 6: [x] Buildable acceptance (F3 + F5 + suite) + scope confirmation

**Implementation Notes:**
- Run F5 composition lint, token lint, build, full unit suite (update any tests asserting the old browse markup: "Open
  Gigs", "Filter Gigs", "Apply Filters", "Showing X-Y of Z", "Откликнуться →"), and the E2E.
- Confirm scope: only `/gigs` composed; no gig-detail change; the existing search/tag/budget/sort/pagination **semantics**
  unchanged (integration tests green); `FilterBar` extension additive; `view-models.ts` block contracts unchanged (new
  screen-data types in `lib/view-models.ts`); no data-model/server-action/shell change.

**Test Plan:**
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
git diff --stat app/\(protected\)/gigs/ lib/view-models.ts app/components/blocks/FilterBar.tsx | tail
```
Expected: F3 + F5 + build + suite + E2E green; scope held (gigs only; query semantics + contracts + shell untouched).

---

## Task 7: [x] F1 fidelity diff vs specialist-gig-search — both layouts (artifacts; ≤1% deferred)

**Implementation Notes:**
- Capture `/gigs` at 1440px in **both grid and list** (seed a SPECIALIST + a populated OPEN-gig set; a temporary capture
  spec like compose-specialist-dashboard's, removed after — artifacts preserved), then for each layout
  `node scripts/design-system/fidelity-diff.js <gigs-{grid,list}-actual.png> screens/specialist-gig-search.jpg
  docs/design-system/fidelity/out/gig-search-{grid,list}` → ratio + `diff/side-by-side/overlay-50`. Review the overlays.
- The ≤1% target is **deferred** (substitute font); report the ratios + that the residual is the documented font factor,
  not a composition defect (per the prior compose-* changes).

**Test Plan:**
```bash
node scripts/design-system/fidelity-diff.js docs/design-system/fidelity/out/gig-search-grid/gigs-grid-actual.png screens/specialist-gig-search.jpg docs/design-system/fidelity/out/gig-search-grid
node scripts/design-system/fidelity-diff.js docs/design-system/fidelity/out/gig-search-list/gigs-list-actual.png screens/specialist-gig-search.jpg docs/design-system/fidelity/out/gig-search-list
```
Expected: diffs + overlays produced for both layouts; composed layout visually faithful; ≤1% deferred (font).

---

## Summary

Total tasks: 7
Estimated effort: 12–16 hours (friction: high — a functional FilterBar + browse mappers + a composed screen with URL filter state + query extension + legacy-panel removal + unit/E2E/fidelity in two layouts)

**Deliverables:**
- `FilterBar` made functional (controlled search + category/sort/rating selects + view toggle; additive, backward compatible, token-pure).
- `lib/view-models.ts` — `toBrowseGigCardVM` (client rating + `clientName`, reuses `toGigCardVM`) + `getGigSearch` (cards/filterBar/count/view).
- `GigSearch` F5-pure `@composed-screen` (FilterBar + ViewToggle + GigCard·(grid/list) + "Найдено N"); wired into the page; server query + `PaginationControls` preserved; category/rating/view added; stale `/dashboard/gigs` fixed.
- Mapper unit tests + gig-search E2E (search/filter/sort/rating/view/pagination + gig links); preserved gig-browse integration tests; F1 diff produced in both layouts (≤1% deferred).

**Critical path:** FilterBar (1) → mappers (2) → GigSearch (3) → page wiring + query extension (4) → tests (5) → acceptance (6) → [artifacts] F1 diff (7).

**Dependencies:** compose-shell-cutover, domain-blocks, category-taxonomy, ratings-reviews-model — all complete.

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–7):**
- **`FilterBar` made functional** (`app/components/blocks/FilterBar.tsx`) — additive optional props/callbacks (`onSearch`
  + category/sort/Рейтинг `Select`s + `ViewToggle`), wrapped in a `<form role="search">` (Enter submits). Backward
  compatible (workbench/fixtures pass only `vm`+`variant`; the legacy `vm.filters` Select renders only when non-empty).
  Token-pure. The block view-model contract (`app/components/blocks/view-models.ts`) is **unchanged**.
- **`ResultCount` block** (gap fill) for the "Найдено N" count (keeps `GigSearch` F5-pure) + fixture + barrel export.
- **Browse mappers** (`lib/view-models.ts`) — `toBrowseGigCardVM` (reuses `toGigCardVM`, overrides `rating` with the
  gig **owner's** aggregate via `getRatingForUser(clientId)` + sets `clientName`) and `getGigSearch` (cards/FilterBarVM/
  count/page/totalPages/view). New screen-data types live here, not in the block contract.
- **`GigSearch` `@composed-screen`** (`app/(protected)/gigs/GigSearch.tsx`) — FilterBar + ResultCount + GigCard·(grid via
  `Grid` / list via `Stack`) via layout primitives; owns the filter/view URL state (all params), pushes URL changes,
  gig links → `/gigs/[id]?from=browse&…`. F5-pure (no className/style).
- **Page wiring** (`app/(protected)/gigs/page.tsx`) — kept the SPECIALIST-only redirect, the OPEN-gig `where`/`orderBy`,
  the 25/page parallel `findMany`+`count`, the page-validation redirects (now preserving every param), and
  `PaginationControls`. Extended with **category** (`categorySlug`, validated), **Рейтинг** (`minRating` via
  `review.groupBy` on the owner's average — correct, count-accurate), and **view**. Renders `<GigSearch>` +
  `<PaginationControls>`. Removed `GigBrowseClient`/`GigFilters` (the stale `/dashboard/gigs` target is gone with them).
- **Tests** — `__tests__/integration/gig-search-vm.test.ts` **3/3** (client rating + `clientName`; zero-rating;
  getGigSearch cards/filterBar/count/view). `__tests__/e2e/compose-gig-search.spec.ts` **5/5** in a real browser
  (FilterBar + "Найдено N" + GigCards; search narrows; category filter; grid⇄list toggle; gig → `/gigs/[id]?from=browse`).
  The preserved gig-browse **integration** tests (`gig-browsing`/`gig-filtering`/`gig-pagination`) stay green **28/28**.
  Updated markup-asserting E2E: `gig-pagination.spec.ts` ("Showing…"→"Найдено N", checkbox/Apply→URL/composed search) —
  **8/8**; `gig-browse-access.spec.ts` ("Open Gigs"→"Поиск гигов") — SPECIALIST test passes; `empty-states.spec.ts` gig
  sections rewritten to `setE2ESession` + composed assertions — **2/2**.
- **Gates** — `lint:composition` (F5, 6 composed screens) ✓ · `lint:tokens` (F2) ✓ · `npm run build` ✓ · `npm run
  test:unit` **870/870** (was 867; +3 new) ✓.

**Task 7 (F1 vs `specialist-gig-search`, both layouts): diffs produced; composed layouts faithful; ≤1% deferred.**
ratios — **grid 0.1164**, **list 0.0993** (`docs/design-system/fidelity/out/gig-search-{grid,list}/`: diff /
side-by-side / overlay-50; produced by a temporary capture spec, removed after — artifacts preserved). The residual is
the **substitute font** (SF Compact unlicensed), not a composition defect.

**Pre-existing failures (NOT this change):** a few `empty-states.spec.ts` (CLIENT/specialist dashboard, Example,
Accessibility) and `gig-browse-access.spec.ts` "CLIENT cannot access" tests fail independently of this change — the
register form was redesigned to **radio RoleCards**, so their legacy `selectOption('select[name="role"]')` flow has
been broken since the auth redesign; and the CLIENT-access test asserts text only a **dead page-level** redirect would
produce (the live path is a **middleware** redirect with a shorter message). These predate and are unrelated to /gigs.

**Scope guards (non-goals held):** no gig-detail change; no new routes; the existing search/tag/budget/sort/pagination
**semantics** unchanged (integration tests green); `FilterBar`/`ResultCount` additive; the block view-model contract
(`app/components/blocks/view-models.ts`) unchanged; no data-model/server-action/shell change.

**Reconciliation recorded:** the design FilterBar surfaces search + category + sort + Рейтинг + view; **tag**/**budget**
filtering remain honored via URL params (server query unchanged) for deep links + integration tests; **Рейтинг** = the
gig owner (client) aggregate rating; the stale `/dashboard/gigs` filter target is gone.
