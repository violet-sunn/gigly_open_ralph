# Change Proposal: compose-gig-search

> Phase 2, change 21 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> composes the **SPECIALIST `/gigs`** browse/search screen from kit blocks — within the `AppShell` the shell-cutover
> put in the protected layout — binding the **existing** OPEN-gig query (search / tags / budget / sort / pagination)
> plus the design's **category** and **Рейтинг** dimensions, rendered as `GigCard·(grid/list)` with a `ViewToggle` and
> a "Найдено N" count. Depends on: compose-shell-cutover, domain-blocks, category-taxonomy, ratings-reviews-model (all
> complete). Friction: **high** (replaces the bespoke browse page + `GigFilters`, preserves the server query +
> pagination, and adds two filter dimensions + a layout toggle).
>
> **Fidelity gate.** F3 (search/filter/sort/pagination/view parity), F5 (composition purity), the functional flows, and
> E2E are enforced now. The **F1 ≤1% pixel-diff** vs `specialist-gig-search` (in **both grid and list** layouts) stays
> deferred — dominated by the **substitute font** (SF Compact unlicensed) — exactly as recorded for compose-shell-cutover
> / compose-client-dashboard / compose-specialist-dashboard. The actual-vs-reference diff + overlay artifacts are produced.

## Problem Statement

The SPECIALIST `/gigs` browse page is **bespoke pre-redesign markup** (`app/(protected)/gigs/page.tsx` +
`GigBrowseClient` + `components/GigFilters.tsx`): a hand-built "Open Gigs" header, a raw-Tailwind filter panel (search
input, 8 tag checkboxes, min/max budget inputs, a sort `<select>`, Apply/Clear buttons), an English "Showing X-Y of Z
gigs" count, and a list of raw-Tailwind `Link` rows ("Откликнуться →") — **not composed from the kit**. The redesign's
`specialist-gig-search` is `AppShell + FilterBar + ViewToggle + GigCard·(grid/list)`:

- The page renders inside the new `AppShell` (from compose-shell-cutover) but its **body is not composed** — it uses
  `className`/raw markup everywhere (fails F5), **English** labels ("Open Gigs", "Filter Gigs", "Apply Filters",
  "Showing … of … gigs"), and ad-hoc gig rows instead of `GigCard`s.
- The **`FilterBar` block exists but is presentational-only** (`app/components/blocks/FilterBar.tsx`): a `SearchInput`
  with a `defaultValue` (no change/submit callback), a single generic `Select` (no `onSelect` wired), and a
  `ViewToggle` (`onViewChange` only). It **cannot drive the live filter/search behavior** the screen needs — a
  composition gap, exactly as `SearchPanel`/`CreateGigCTA` were for the dashboards.
- There is **no view-model mapper** binding the OPEN-gig query into `GigCardVM`s for this screen, and no **grid/list**
  layout toggle (the design's `ViewToggle`), no **category** filter (the 5 categories exist from category-taxonomy), no
  **Рейтинг** filter/sort (ratings exist from ratings-reviews-model), and no RU **"Найдено N"** count.
- `GigFilters` even routes to a **stale `/dashboard/gigs`** path (`router.push('/dashboard/gigs')`) — the live route is
  `/gigs`.

The planning doc maps this exactly: compose `/gigs` from `AppShell + FilterBar + ViewToggle + GigCard·(grid/list)` with
`rating, deadline, category` data, preserving search/filter/sort/pagination. The shell + blocks + data are in place —
this change makes `/gigs` a thin, URL-state-driven composition while **preserving the server query and pagination**.

## Proposed Solution

Extend `FilterBar` into a functional block, add a browse view-model mapper (reusing `toGigCardVM`), build a
composition-pure `GigSearch` screen that owns the URL filter/view state, extend the page query with category + rating,
wire it in, and verify. Five deliverable groups:

1. **`FilterBar` block — make it functional (gap fill, additive + backward compatible)** — extend
   `app/components/blocks/FilterBar.tsx` so it can **drive** the search/filter UI the design shows: a controlled
   `SearchInput` (value + `onSearch`/`onSubmit`), the **category** `Select` (the 5 categories), a **sort** `Select`
   (Новые / Дороже / Дешевле / По рейтингу), a **Рейтинг** `Select` (min-rating), and the `ViewToggle` — each emitting
   a typed callback. New props are **optional** (the existing `search-only`/`full` fixtures + workbench usage keep
   working). Token-pure (primitives + tokens). The tag/budget dimensions remain honored via URL params (below), so no
   filter capability is lost. (A composition gap — the block was decorative — recorded in the spec.)

2. **Browse view-model mapper (`lib/view-models.ts`, server-only, contract-typed)** — `toBrowseGigCardVM(gig, layout)`
   = `toGigCardVM(gig, layout)` then **override `rating` with the gig owner's aggregate** (`getRatingForUser(clientId)`
   — OPEN gigs have no specialist, so the card shows the **client's** reputation) and set `clientName`; and
   `getGigSearch(params)` → `{ gigCards: GigCardVM[]; filterBar: FilterBarVM; count: number; page: number; totalPages:
   number; perPage: number; view: 'grid' | 'list' }`, reusing the page's existing OPEN-gig query + `lib/categories`.
   View-model types imported `import type` (no runtime UI coupling). The block view-model contract
   (`app/components/blocks/view-models.ts`) is **unchanged** — the screen-data types live in `lib/view-models.ts`.

3. **`GigSearch` composed screen (`app/(protected)/gigs/GigSearch.tsx`, `'use client'`, `@composed-screen`)** — props =
   the built data + the initial URL state. Owns the **filter/view URL state** (the `GigFilters` logic, **retargeted to
   `/gigs`**): all of search / category / sort / Рейтинг / tags / budget / view are **URL params** (so they persist
   across pagination and are shareable). Composes, via **layout primitives only** (Section/Grid/Stack — no
   `className`/`style`): `FilterBar` (wired to push URL changes) · a "Найдено N" count · the `GigCard`s in a **`Grid`
   (grid view)** or a **`Stack` (list view)** with the matching `layout`, `onOpen` → `router.push('/gigs/[id]?from=
   browse&…')` preserving the active filters · plus the composed **empty state** (no results / filtered). Client (filter
   + view state, URL navigation) — the same presentational-block + thin-wrapper pattern as the dashboards.

4. **Wire into `app/(protected)/gigs/page.tsx` (preserve the server query + pagination)** — keep the SPECIALIST-only
   redirect, the searchParams parsing, the OPEN-gig `where`/`orderBy`, the parallel `findMany` + `count`, the
   page-validation redirects, and `PaginationControls`. **Extend** the query with the new **`category`** filter (by
   `categorySlug`, validated via `isCategorySlug`) and the **`minRating`** filter + `sort=rating` (by the gig owner's
   aggregate rating), and read the **`view`** param. Build the VM (`getGigSearch`) and render `<GigSearch … />` in place
   of the bespoke header + `GigBrowseClient` + raw rows; render `<PaginationControls … />` beneath it (it already
   preserves every query param). Existing `search`/`tags`/`minBudget`/`maxBudget`/`sort`/`page` semantics are unchanged.

5. **Tests + fidelity** — unit tests for the mappers (`toBrowseGigCardVM` rating=client + `clientName`; `getGigSearch`
   count/cards/filterBar/view); E2E (`compose-gig-search.spec.ts`): search, category filter, sort, Рейтинг, grid⇄list
   toggle, pagination, and a `GigCard` → `/gigs/[id]` with filters preserved. `lint:composition` (F5) on `GigSearch`;
   F3 parity. Update the integration/E2E specs that assert the old markup (preserving the server-query integration
   tests). The F1 diff vs `specialist-gig-search` is **produced** in **both layouts** with ≤1% **deferred** (font).

This change emits **the `FilterBar` extension + the browse view-model mappers + the `GigSearch` composition + the page
wiring + tests only**. It does **not** change the gig-detail screen (#22), build any new route, change the OPEN-gig
filter **semantics** of the existing params, change any data model or server action, or re-wire the shell.

## Constraints

### MUST Requirements
- The `/gigs` body MUST be composed from blocks (`FilterBar` + `ViewToggle` + `GigCard·(grid/list)`) inside the
  layout's `AppShell`, as a composition-pure screen (F5): `GigSearch` MUST carry `@composed-screen`, import only
  kit/lib/actions/react/next, and contain **no** `className`/`style`/raw markup.
- The composition MUST preserve **search / tag / budget / sort / pagination** behavior exactly (URL-state, 25/page,
  page-validation redirects, SPECIALIST-only access, gig-link filter preservation) and MUST add the design's
  **category** filter, **Рейтинг** filter/sort, **grid⇄list** `ViewToggle`, and the RU **"Найдено N"** count.
- `FilterBar` MUST be extended to **drive** the filter/search UI (controlled search + category/sort/rating selects +
  view toggle, each emitting a typed callback), additively and backward-compatibly; it MUST be token-pure.
- The mapper MUST bind real data — gigs as `GigCardVM`s via `toGigCardVM` (browse cards show the **client's** rating +
  `clientName`), the `FilterBarVM`, and the count — server-only, `import type` the VMs; the block view-model contract
  (`app/components/blocks/view-models.ts`) MUST be unchanged.
- The page MUST keep the server query + `PaginationControls`, extend it with `category` + `minRating`/`sort=rating` +
  `view`, render `GigSearch`, and preserve the SPECIALIST-only redirect.
- `npm run build`, `npm run test:unit`, the gig-search E2E, `npm run lint:composition`, and `npm run lint:tokens` MUST
  be green; the existing gig-browse **integration** tests (server query/pagination) MUST stay green.

### SHOULD Requirements
- Filter/view state SHOULD all be **URL params** (search/category/sort/minRating/tags/minBudget/maxBudget/view/page),
  read by the page and updated by `GigSearch` via `router.push` — so pagination preserves them and views are shareable.
- The browse mapper SHOULD reuse `toGigCardVM` (override `rating` → client aggregate, set `clientName`); the grid view
  SHOULD use `Grid` with `layout: 'grid'` cards and the list view `Stack` with `layout: 'list'` cards.
- `GigSearch` SHOULD be the only `'use client'` screen addition; the stale `/dashboard/gigs` target in the filter logic
  SHOULD be corrected to `/gigs`.

### Non-Goals
- **No gig-detail change** (compose-gig-detail-apply, #22); **no new routes**; **no change to the existing
  search/tag/budget/sort/pagination semantics**; **no data-model/server-action change** (categories/ratings/deadline
  already exist); **no shell change** (compose-shell-cutover).
- **F1 ≤1% enforcement is deferred** — the diff is produced (both layouts) for review, but the ≤1%-vs-
  `specialist-gig-search` target is reached only once the **SF Compact font is licensed**. F3/F5/functional/E2E are the
  enforced acceptance.

## Success Criteria

1. `/gigs` body composes `FilterBar` + `ViewToggle` + `GigCard·(grid/list)` + "Найдено N" (F5-pure `@composed-screen`).
2. Search / tag / budget / sort / pagination preserved (URL-state, 25/page, redirects, SPECIALIST-only); category + Рейтинг + grid⇄list added (F3).
3. `FilterBar` extended to drive the filter/search UI (additive, backward compatible, token-pure); the stale `/dashboard/gigs` target fixed to `/gigs`.
4. Real data bound — gigs as `GigCardVM`s (client rating + `clientName`), `FilterBarVM`, count; block view-model contract unchanged.
5. Gig links (`GigCard` → `/gigs/[id]?from=browse&…`) preserve active filters; the server query + `PaginationControls` reused.
6. `build`, `test:unit` (existing gig-browse integration green), gig-search E2E, `lint:composition`, `lint:tokens` all green; F1 diff produced in both layouts (≤1% deferred to font).

## Affected Areas

- `app/(protected)/gigs/page.tsx` (compose body via `getGigSearch` + `<GigSearch>`; extend query with category/rating/view; keep SPECIALIST redirect, pagination, page-validation)
- `app/(protected)/gigs/GigSearch.tsx` (new — `'use client'` `@composed-screen`)
- `app/(protected)/gigs/GigBrowseClient.tsx` + `app/(protected)/gigs/components/GigFilters.tsx` (superseded by the composed `FilterBar` + `GigSearch` URL state — removed/retired; `/`-to-focus hotkey re-homed if kept)
- `app/components/blocks/FilterBar.tsx` (extend — functional controls + callbacks) + `app/components/blocks/fixtures.ts` (fixture update)
- `lib/view-models.ts` (extend — `toBrowseGigCardVM` + `getGigSearch`, contract-typed)
- `__tests__/e2e/compose-gig-search.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests); update markup-asserting browse E2E specs
- read-only inputs: the blocks (`FilterBar`/`GigCard`), `ViewToggle`/`Select`/`SearchInput` primitives, `lib/reviews` (`getRatingForUser`), `lib/categories` (`CATEGORIES`/`getCategories`/`isCategorySlug`), `app/components/PaginationControls`, `screens/specialist-gig-search.jpg` (F1 reference)
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements, folded on archive)
- (NOT modified: the gig-detail screen; data models / server actions; the shell; the block view-model contracts; the existing search/tag/budget/sort/pagination query semantics)

## Risks & Mitigations

**Risk**: `FilterBar` is presentational-only — composing it as-is yields a dead filter UI.
**Mitigation**: Extend it additively (controlled search + category/sort/rating selects + view toggle, each with a typed callback); `GigSearch` owns URL state and passes handlers. New props optional → existing fixtures/workbench unaffected. Recorded as a system-gap fill, mirroring `SearchPanel`/`CreateGigCTA`.

**Risk**: Replacing the bespoke browse page breaks the rich existing filter/search/sort/pagination behavior (and its tests).
**Mitigation**: Keep the **server query + `PaginationControls` unchanged** (only extend with category/rating/view); preserve every URL param and the page-validation redirects. The gig-browse **integration** tests target the server logic → stay green. Update only the **E2E/markup** assertions to the composed blocks (RU labels, `GigCard`, "Найдено N").

**Risk**: "Рейтинг" is ambiguous for OPEN gigs (no assigned specialist).
**Mitigation**: Reconcile — browse cards + the Рейтинг filter/sort use the **gig owner (client) aggregate** rating (`getRatingForUser(clientId)`); recorded in the spec. The implementer confirms against `specialist-gig-search.jpg`.

**Risk**: The design's compact FilterBar vs the legacy 8-tag-checkbox + budget-range panel.
**Mitigation**: Reconcile — the composed FilterBar surfaces the design's controls (search + category + sort + Рейтинг + view); **tag** and **budget** filtering remain honored via URL params (server query unchanged) for deep links + the integration tests. Recorded as a reconciliation; the exact control arrangement matched to the reference.

**Risk**: Pagination/`PaginationControls` lives outside the composed screen.
**Mitigation**: The page renders `<GigSearch>` then `<PaginationControls>` (both in the shell content region); `view` and all filters are URL params so pagination preserves them. Keeps F5 clean and reuses the tested pagination component.

**Risk**: F1 ≤1% won't pass against `specialist-gig-search`.
**Mitigation**: Documented + accepted (per the prior compose-* changes): the residual is the substitute font — not a composition defect. The diff + 50%-overlay are produced in **both** layouts for review; ≤1% is reached once the font is licensed.
