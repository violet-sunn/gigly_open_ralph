# Spec delta — ui (reconcile-gig-browse)

Reconciles the `/gigs` browse screen to **Поиск проектов/specialist (`2860:2056`)**: a HEADER row composed of a
`SectionHeader` («Поиск проектов») + the grid/list `switcher` (hoisted out of the `FilterBar`), over the `GigCard`
grid/list spanning the full status set, with the search/filter/sort/pagination affordances preserved — all bound from
the existing `GigSearchData` VM and kept token-pure (F2) + composition-pure (F5).

## MODIFIED Requirements

### Requirement: Gig Browse Screen Reconciled to the Figma Node
The `/gigs` browse screen (`app/(protected)/gigs/GigSearch.tsx`) MUST remain a composition-pure `@composed-screen`
inside the layout's `AppShell`, reconciled to its Figma node `2860:2056`: a **HEADER row** composed of a
`SectionHeader` (title «Поиск проектов», the БЛОК heading role) on the left and the grid/list **`switcher`**
(`ViewToggle`) right-aligned in the same row, followed by the **`GigCard` grid** (`Grid columns={3}` for
`view="grid"`, a `Stack` for `view="list"`). The screen MUST NOT render the former `Section title="Поиск гигов"`
page-title heading, and MUST NOT render the grid/list switcher inside the `FilterBar`. The screen MUST be token-pure
(F2) and composition-pure (F5), and MUST preserve the search/category/sort/Рейтинг filtering, the grid⇄list view
toggle, the gig-open navigation (`/gigs/[id]?from=browse&…`), and the pagination beneath it.

#### Scenario: HEADER composes a SectionHeader + the grid/list switcher (no page-title)
- GIVEN the gig browse screen
- WHEN it renders
- THEN it MUST render a `SectionHeader` titled «Поиск проектов» and the grid/list `switcher` (`ViewToggle`) in the
  same header row
- AND it MUST NOT render the former `Section title="Поиск гигов"` page-title heading
- AND the grid/list switcher MUST NOT be rendered inside the `FilterBar`

#### Scenario: CONTENT is a GigCard grid/list spanning the full status set
- GIVEN the gig browse screen with gigs across the status set
  (`open | in-progress | review | verification | completed | rejected`)
- WHEN it renders in `view="grid"`
- THEN the cards MUST render in a `Grid columns={3}` of `GigCard`s, each opening its gig detail
  (`/gigs/[id]?from=browse&…`) on activation
- AND when `view="list"` the cards MUST render in a `Stack`
- AND a `GigCard` MUST render its status pill for each status value present

#### Scenario: Filters/search/pagination preserved; composition-pure
- GIVEN the gig browse screen
- WHEN it is interacted with
- THEN the `FilterBar` search + category + sort + Рейтинг controls MUST still drive their URL params, the header
  switcher MUST still toggle the `view` URL param, and `PaginationControls` MUST still render and paginate beneath the
  screen
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

## ADDED Requirements

### Requirement: Switcher Hoisted to the Header; Filters Retained as a Sanctioned Variant
The grid/list `switcher` MUST live in the `SectionHeader` HEADER row (matching node `2860:2056`), not inside the
`FilterBar`; the `ViewToggle` primitive is reused verbatim (same `view`/`onChange` contract) with only its placement
changed. The functional `FilterBar` (search + category + sort + Рейтинг) MUST be retained as a **sanctioned content
variant** — the node mock shows only the header + card grid (its filter UI collapsed), and the filtering is kept
because it provides functional value the static mock omits — recorded in the reconciliation note.

#### Scenario: Switcher in the header, single instance
- GIVEN the gig browse screen
- WHEN it renders
- THEN exactly one grid/list switcher MUST render, located in the `SectionHeader` header row (not in the `FilterBar`)
- AND toggling it MUST switch the `GigCard` layout between the `Grid` (grid) and the `Stack` (list)

#### Scenario: Retained filter affordance recorded as a sanctioned variant
- GIVEN the reconciled screen retains the `FilterBar` search/category/sort/Рейтинг controls the node mock omits
- WHEN the reconciliation is documented
- THEN the retention MUST be recorded as a sanctioned content variant in the reconciliation note
  (`docs/DESIGN_SYSTEM_SPEC.md` §10.x, RC-S11) with the node id `2860:2056`

### Requirement: Gig Browse Reconciliation Keeps the Suite Green
Reconciling the gig browse screen MUST update the affected E2E assertions to the new composition (the «Поиск
проектов» `SectionHeader` + the header-row switcher + the `GigCard` grid, no `Section title=` page-title, no
switcher inside the `FilterBar`) while preserving every behavioural assertion (search, category/sort/Рейтинг
filtering, grid⇄list toggle, gig-open, pagination), and MUST keep the build, token-purity lint, composition lint, and
unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-gig-browse.spec.ts` (created or extended)
- WHEN it runs after the reconciliation
- THEN the old `Section title="Поиск гигов"` / filter-bar-switcher assertions MUST be replaced by the
  `SectionHeader` «Поиск проектов» + header-row switcher + `GigCard` grid assertions
- AND the behavioural assertions (search submits, category/sort/Рейтинг filter, grid⇄list toggle, gig-open
  `/gigs/[id]?from=browse`, pagination) MUST still pass
- AND `npm run build`, `npm run lint:tokens`, `node scripts/design-system/validate-composition.js`, and
  `npm run test:unit` MUST pass
