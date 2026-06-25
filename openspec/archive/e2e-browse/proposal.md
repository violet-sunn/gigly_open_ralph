# e2e-browse

## Why

Reconciliation change #6 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The `/gigs` browse screen was rebuilt on the `gigly_full_design` prototype (`app/(protected)/gigs/GigSearchDesign.tsx`, rendering the shared `app/_design/GigCard.tsx` in `full` mode), and text search moved into the shell header (`app/_design/AppShellDesign.tsx`). Three E2E specs still assert the old kit DOM and fail:

- **`compose-gig-search.spec.ts`** — asserts a content `<form role="search">` + `searchbox`, an in-content `«Поиск проектов»` SectionHeader, a `«Сетка»/«Список»` grid/list switcher, the kit `Select` (`button` «Все категории» → `option`), `getByText(/Найдено 3/)` as one node, and a `«К проекту»` `<button>`. The rebuild has **none** of these: search is the shell-header `<input placeholder="Поиск чего угодно...">` (Enter → `/gigs?search=`); there is no in-content title (shell `«ПОИСК ГИГОВ»`) and no view switcher; the filters are native `<select>`s (category/sort/rating); `«Найдено»` is an `<h2>` with a **separate** count `<span>` badge; and each `full` `GigCard` is a card-wide `<Link href="/gigs/[id]?from=browse&…">` whose `«К проекту»` is a `<span>`.
- **`gig-pagination.spec.ts`** — the `PaginationControls` component is unchanged (its `nav[aria-label="Pagination"]`, `a[aria-label="Next page"]`, `[aria-current="page"]`, disabled-`span` assertions all still hold), but every `text=Найдено 60` assertion breaks (split node) and the "reset to page 1 when filters change" step drives the removed content `searchbox`.
- **`empty-states.spec.ts`** — spans screens with stale kit assertions: the browse `«Поиск гигов»` h2 + `role="search"`; English kit dashboard empty states (`Post Your First Gig`, `Create Gig`, `View Example Gigs`, `No Messages Yet`) reached via the **old register form** (`selectOption('select[name="role"]')`, replaced by RoleCards); `role="tablist"`/`role="tab"` dashboard chips; a `«Найти проект»` button; and an accessibility test that tabs to a `«View Example Gigs»` link the rebuilt browse empty state no longer renders.

The data/query layer (`getGigSearch`, the `/gigs` page query, `PaginationControls`, the `?search=`/`?category=`/`?sort=`/`?minRating=`/`?page=` contract) is unchanged — only the assertions point at removed markup.

## What Changes

- **REWRITE `compose-gig-search.spec.ts`** to the rebuilt browse screen:
  - Assert the three native filter `<select>`s (category «Все категории», sort «Сначала новые», rating «Любой рейтинг»), the `«Найдено»` `<h2>` + its count badge, and the `full` `GigCard` grid.
  - Drive **text search via the shell-header input** (`getByPlaceholder('Поиск чего угодно...')` → fill + Enter → `/gigs?search=`) and assert it narrows results.
  - Drive the **category filter** via `selectOption` (→ `?category=`) and assert it narrows results.
  - Open a gig by clicking the **card-wide `<Link>`** (not a button) → URL `/gigs/[id]?…from=browse`.
  - Assert the **empty state** (`«Ничего не нашлось»` + `«Сбросить фильтры»` → `/gigs`).
  - **Delete** the in-content `«Поиск проектов»` SectionHeader test and the grid/list `«Сетка»/«Список»` switcher test (neither exists in the rebuild).
- **REWRITE `gig-pagination.spec.ts`** result-count assertions to the split `«Найдено»` heading + count badge; rewrite the "reset to page 1" step to change a native filter `<select>` (sort) instead of the removed content searchbox. Keep all `PaginationControls` assertions (component unchanged).
- **REWRITE `empty-states.spec.ts`** to the rebuilt screens via the modern harness (`setE2ESession` + Prisma seed, not the register form):
  - Browse empty state (`«Ничего не нашлось»` + `«Сбросить фильтры»`) and a populated `«Найдено»` count.
  - The rebuilt **`/dashboard`** empty states (`«Здесь пока пусто.»` for the empty `«Мои гиги»` grid, `«Сообщений пока нет.»` for the empty `«Сообщения»` panel) for a fresh CLIENT and SPECIALIST.
  - The rebuilt **`/my-gigs`** empty state (`«Здесь пока пусто»`).
  - **Drop** the kit `«View Example Gigs»` coupling: the accessibility test retargets the new `«Сбросить фильтры»` button (keyboard-focus + Enter → `/gigs`). Drop the stale `«Example Gigs Page»` block (that screen is out of scope, still old-kit). Keep the ADMIN tests skipped.

## Impact

- **Affected:** `__tests__/e2e/compose-gig-search.spec.ts`, `__tests__/e2e/gig-pagination.spec.ts`, `__tests__/e2e/empty-states.spec.ts`.
- **Not touched:** `app/`/`lib/` behaviour (`GigSearchDesign.tsx`, `GigCard.tsx`, `AppShellDesign.tsx`, `getGigSearch`, the `/gigs` query, `PaginationControls`); the unit/integration suite (951/951 — must stay green); `/gigs/examples` (still old-kit, deliberately out of scope); the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 5/16 → 6/16.
