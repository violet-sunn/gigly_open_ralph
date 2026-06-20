# reconcile-gig-browse

**Type:** Regular change (UI / screen reconciliation — specialist gig browse)
**Created:** 2026-06-18
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 1, change #9
**Capability:** `ui` (reconciles the composed gig-browse screen in `openspec/specs/ui/spec.md`)
**Depends on:** `add-profile-and-gig-detail-blocks` (archived — `SectionHeader`). All blocks exist.

## Why

The `/gigs` browse screen (`app/(protected)/gigs/GigSearch.tsx`) is kit-composed but was built in Phase 2 (compose-gig-search) **before Figma access**. It leads with a `Section title="Поиск гигов"` page-title and tucks the grid/list `ViewToggle` **inside** the `FilterBar`. That diverges from **Поиск проектов/specialist (`2860:2056`)**:

| Figma section | Built today | Action |
|---|---|---|
| HEADER row = `H/H1/BLOCK` (SectionHeader, 1029w) **+** `switcher` (grid/list 60w) | `Section title="Поиск гигов"` heading; the `ViewToggle` lives inside `FilterBar` | **adopt** `SectionHeader` for the heading and **hoist** the grid/list switcher into the header row (right-aligned), out of the filter bar |
| CONTENT col2 = **grid of 6× `Gig`** cards (~559w, **full status variants**) | `Grid columns={3}` / `Stack` of `GigCard` (grid/list) | **keep** — already a `GigCard` grid/list; assert the full status set renders |
| search / filters | `FilterBar` (search + category + sort + Рейтинг) | **preserve** as a sanctioned functional affordance (the node's filter UI is collapsed in the mock) |

Every block this needs already exists (`SectionHeader`, `FilterBar`, `GigCard`, `ResultCount`, the `ViewToggle` primitive) and the layout primitives (`Section`, `Grid`, `Stack`). **No new component is introduced** — this is a screen re-composition that moves the switcher and swaps the heading.

## What

- **HEADER** — replace the `Section title="Поиск гигов"` page-title with a **`SectionHeader`** (title «Поиск проектов», the БЛОК heading role) in a header **row**, with the grid/list **`switcher`** (`ViewToggle`) right-aligned in that same row — matching the node's `H/H1/BLOCK` + `switcher` header. The switcher keeps driving the `view` URL param.
- **Hoist the view toggle out of `FilterBar`** — the `FilterBar` keeps its search + category + sort + Рейтинг controls but **no longer renders the `ViewToggle`** (it moves to the header). `FilterBar`'s `onViewChange` is no longer wired from this screen; the header switcher owns it.
- **CONTENT** — keep the `GigCard` grid (`Grid columns={3}` for `view="grid"`) / list (`Stack` for `view="list"`); both layouts stay token-pure and composition-pure. Assert the **full status set** (`open | in-progress | review | verification | completed | rejected`) renders across the cards.
- **Preserve** the filters/search/sort/Рейтинг controls, the URL-param filter state, the gig-open navigation (`/gigs/[id]?from=browse&…`), and the `PaginationControls` beneath the screen — all unchanged behaviourally.

No screen may carry off-token literals (F2) or bespoke markup (F5) — it stays `Template + Blocks + data`.

## Key reconciliation facts

- **The switcher moves from the filter bar to the header row.** The node places the grid/list `switcher` in the `H/H1/BLOCK` header, not among the filter controls. The `ViewToggle` primitive is reused verbatim (same `view`/`onChange` contract); only its *placement* changes. `FilterBar`'s `onViewChange` becomes optional/unused from this screen — the prop stays on the block for other surfaces but is not passed here.
- **The page-title becomes a `SectionHeader`.** Like the dashboards, the screen stops using the `Section title=` page-title styling; the heading is now the БЛОК `SectionHeader` («Поиск проектов»), the role the node actually uses.
- **Filters/search are a sanctioned functional affordance.** The node mock shows only the header + card grid (its filter UI is collapsed). Per "system > single screen", the functional `FilterBar` (search + category + sort + Рейтинг) is retained as a sanctioned content variant — recorded in the reconciliation note — because it provides filtering the static mock omits. No filter/search/pagination semantics change.

## Scope

- **Reconciled screen:** `app/(protected)/gigs/GigSearch.tsx`.
- **Page wiring (if needed):** `app/(protected)/gigs/page.tsx` — only if the header-row composition needs the `view`/title threaded differently; the server query + `PaginationControls` stay unchanged.
- **Tests updated:** `__tests__/e2e/compose-gig-browse.spec.ts` (assert the `SectionHeader` «Поиск проектов» + the header-row grid/list switcher + the `GigCard` grid; keep search/filter/sort/view-toggle/gig-open/pagination assertions). If no dedicated browse spec exists, add one (or extend `gig-browse-access`).

## Non-goals

- New blocks/primitives (none needed). Changing the server query, the filter/sort/pagination semantics, or the `GigSearchData` VM shape. The CLIENT redirect / role-access guard in `page.tsx`.
- The absolute F1 ≤1% pixel gate (Phase 2 `refidelity-from-figma-references`); here F1 = structural/overlay match to the node, asserted in **both** grid and list layouts.

## References

`docs/figma-screens-export.md` §2 (Поиск проектов/specialist `2860:2056`); the screen `app/(protected)/gigs/GigSearch.tsx` + `app/(protected)/gigs/page.tsx`; blocks `SectionHeader`/`FilterBar`/`GigCard`/`ResultCount`; the `ViewToggle` primitive; VM `GigSearchData`/`GigCardVM`; the `Status` union (`app/components/primitives/tokens.ts`).
