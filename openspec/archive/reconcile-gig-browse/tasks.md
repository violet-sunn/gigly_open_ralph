# Tasks — reconcile-gig-browse

Reconcile `/gigs` (`GigSearch.tsx`) to Поиск проектов/specialist (`2860:2056`): a `SectionHeader` («Поиск проектов»)
+ grid/list `switcher` HEADER row (switcher hoisted out of the `FilterBar`), over the `GigCard` grid/list spanning the
full status set, with search/filter/sort/pagination preserved. All blocks already exist — this is a screen
re-composition that moves the switcher and swaps the heading. Source: `docs/figma-screens-export.md` §2
(`2860:2056`). Friction: **high** (header-row recomposition + switcher hoist across the FilterBar boundary + the E2E
browse flow with filter/search/view/pagination parity to keep green).

## 1. Reconcile the HEADER — SectionHeader + grid/list switcher row
- [x] In `GigSearch.tsx`: replaced `Section title="Поиск гигов"` with `Section gap={6}` + a header **row**
      (`Stack axis="row" gap={3} align="center" justify="between"`) = `SectionHeader vm={{ title: "Поиск проектов" }}`
      (flex-1, left) + the grid/list `ViewToggle` (the `switcher`) right-aligned. The switcher reads `data.view` and
      calls `set("view", v, "grid")` — the same URL-param wiring the `FilterBar` previously owned.
- **Test:** ✅ E2E `reconciled HEADER` renders «Поиск проектов» + a header-row switcher; `Поиск гигов` count = 0.

## 2. Hoist the view toggle out of FilterBar
- [x] Stopped passing `onViewChange` to `FilterBar` from `GigSearch.tsx` (the switcher now lives in the header).
      Gated the block's `ViewToggle` on `onViewChange != null` (`{onViewChange && <ViewToggle … />}`). `FilterBar`
      keeps search + category + sort + Рейтинг unchanged. Updated `domain-blocks.test.tsx` accordingly (toggle absent
      with no handler, present when wired).
- **Test:** ✅ E2E: exactly one switcher (`Сетка`/`Список` count = 1 each), none inside `role="search"`; filter
  controls still drive URL params (search/category tests pass). Unit: FilterBar test green (42/42).

## 3. Keep the GigCard grid/list + full status set
- [x] Kept `view === "list" ? Stack : Grid columns={3}` of `GigCard`s, each `onOpen` →
      `/gigs/${vm.id}?from=browse&…` (unchanged). The `GigCard` renders every `Status` value
      (`open | in-progress | review | verification | completed | rejected`) — verified by the existing
      domain-blocks "every status × layout" render test (42/42).
- **Test:** ✅ E2E: list toggle → `view=list`; a card opens its gig detail with `from=browse`.

## 4. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals added in `GigSearch.tsx` beyond layout-primitive props; the header row,
      switcher, and grid all compose from kit blocks + layout primitives + tokens.
- **Test:** ✅ `validate-composition.js` PASS (18 screens; `GigSearch` stays F5-pure); `lint:tokens` PASS (no new
  off-token literal).

## 5. Record the reconciliation decisions
- [x] Added §10.8 to `docs/DESIGN_SYSTEM_SPEC.md`: **RC-S11** (`Section title=` page-title → `SectionHeader`
      «Поиск проектов»; grid/list `switcher` hoisted from `FilterBar` into the header row per node `2860:2056`;
      `FilterBar` renders its `ViewToggle` only when `onViewChange` is wired; the functional filters retained as a
      **sanctioned content variant** the static mock omits).
- **Test:** ✅ the note records the decision with the node id (`2860:2056`) and the sanctioned-filter rationale.

## 6. Update the affected tests to the reconciled composition
- [x] Extended the existing browse spec `__tests__/e2e/compose-gig-search.spec.ts` (the dedicated browse composition
      spec — no separate `compose-gig-browse.spec.ts` existed): added the `reconciled HEADER` test (SectionHeader +
      header-row switcher, no page-title, switcher outside the filter bar); **kept** the search/category-filter,
      grid⇄list toggle, gig-open (`/gigs/[id]?from=browse`) assertions. Pagination parity covered by the unchanged
      `gig-pagination.spec.ts`.
- **Test:** ✅ `compose-gig-search` 6/6 pass; no test asserts the old `Section title="Поиск гигов"` heading or a
  switcher inside the filter bar.

## 7. Quality gates (run, assert green)
- [x] `npm run validate:tokens` — ✅ PASS (39 colours; in sync).
- [x] `npm run lint:tokens` — ✅ PASS (no new off-token literals; 74 baselined legacy occurrences).
- [x] `node scripts/design-system/validate-composition.js` — ✅ PASS (18 composed screens).
- [x] `npm run build` — ✅ PASS (`/gigs` builds).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ 937/937 pass (incl. `gig-browse-access` 10/10).
- [x] Gig-browse E2E green: `compose-gig-search` 6/6.
- **Acceptance (Fidelity DoD):** ✅ F2 token-pure (lint green), F1 structural/overlay match to `2860:2056` in **both**
  grid and list layouts, F3 logical/flow parity (search + category + sort + Рейтинг + grid⇄list + gig-open +
  pagination), F5 composition-pure (composition lint green). F1 absolute pixel gate deferred to Phase 2
  (`refidelity-from-figma-references`).

## 8. Update the planning doc status
- [x] Checked `reconcile-gig-browse` under "Phase 1 — Reconcile screens"; bumped progress to `9/13`.
- **Test:** ✅ the Status checkbox reads `[x]`; progress reads `9/13`.
