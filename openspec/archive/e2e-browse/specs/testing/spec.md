# Testing Specification Delta

## ADDED Requirements

### Requirement: Browse + Pagination + Empty-States Reconciled E2E Coverage

The E2E suite SHALL verify the rebuilt `/gigs` browse screen (`app/(protected)/gigs/GigSearchDesign.tsx` rendering `app/_design/GigCard.tsx` in `full` mode), its pagination (`PaginationControls`, unchanged), and the cross-screen empty states — using the Prisma-seed (`file:./test.db`) + `setE2ESession` harness. The specs SHALL:

- assert the three native filter `<select>`s (category/sort/rating) and the `«Найдено»` `<h2>` heading with its separate count `<span>` badge (NOT a single `«Найдено N»` text node);
- drive **text search via the shell-header input** (`placeholder="Поиск чего угодно..."`, Enter → `/gigs?search=`), NOT a content `role="search"`/`searchbox`;
- drive the **category filter** via `selectOption` (→ `?category=`), NOT the removed kit `button`+`option` `Select`;
- open a gig by clicking the **card-wide `<Link>`** (the `«К проекту»` footer is a `<span>`, NOT a `<button>`) → `/gigs/[id]?…from=browse`;
- assert the browse **empty state** `«Ничего не нашлось»` + the `«Сбросить фильтры»` button (→ `/gigs`);
- assert the rebuilt `/dashboard` empty states (`«Здесь пока пусто.»` grid, `«Сообщений пока нет.»` messages) and the `/my-gigs` empty state (`«Здесь пока пусто»`);
- NOT reference the removed in-content `«Поиск проектов»`/`«Поиск гигов»` title, the `«Сетка»/«Список»` grid-list switcher, the kit dashboard `role="tablist"`/`role="tab"` chips, the `«Найти проект»` button, the register-form `select[name="role"]`, or the kit English empty states (`Post Your First Gig`, `Create Gig`, `View Example Gigs`, `No Messages Yet`).

The `PaginationControls` selectors (`nav[aria-label="Pagination"]`, `a[aria-label="Next page"]`/`"Previous page"`/`"Go to page N"`, `[aria-current="page"]`, the disabled `span[aria-label][aria-disabled="true"]`) and the `?page=`/filter-preservation contract are unchanged and SHALL continue to be asserted.

#### Scenario: Browse renders the filters, count, and full GigCard grid

- **Given** an authenticated SPECIALIST and three seeded OPEN gigs (one `design`, one `development`, one uncategorized) in `file:./test.db`
- **When** they open `/gigs`
- **Then** the category, sort, and rating `<select>`s SHALL be visible, the `«Найдено»` heading + a count badge of `3` SHALL be visible, and the seeded gigs' `full` `GigCard`s SHALL render
- **And** no content `role="search"` box, no in-content page title, and no `«Сетка»/«Список»` switcher SHALL be required

#### Scenario: Shell-header search narrows the results

- **Given** an authenticated SPECIALIST on `/gigs`
- **When** they type `Design` into the shell-header search input (`placeholder="Поиск чего угодно..."`) and press Enter
- **Then** the URL SHALL contain `search=Design`, the count badge SHALL read `1`, the matching gig SHALL be visible, and the non-matching gig SHALL be absent

#### Scenario: The category filter narrows the results

- **Given** an authenticated SPECIALIST on `/gigs`
- **When** they choose `Дизайн` in the category `<select>`
- **Then** the URL SHALL contain `category=design`, the count badge SHALL read `1`, and the `design` gig SHALL be visible

#### Scenario: A GigCard opens the gig detail with from=browse

- **Given** an authenticated SPECIALIST on `/gigs?search=Design`
- **When** they click the gig card link (the card is a `<Link>`; `«К проекту»` is a `<span>`, not a button)
- **Then** the browser SHALL navigate to `/gigs/[id]?…from=browse`

#### Scenario: Browse shows the empty state when nothing matches

- **Given** an authenticated SPECIALIST
- **When** they open `/gigs?search=nonexistentgig12345`
- **Then** the count badge SHALL read `0`, and the empty-state heading `«Ничего не нашлось»` and the `«Сбросить фильтры»` button SHALL be visible
- **And** activating `«Сбросить фильтры»` (click or keyboard Enter) SHALL navigate to `/gigs`

#### Scenario: Pagination navigates and preserves filters across the split count header

- **Given** an authenticated SPECIALIST and 60 seeded OPEN gigs (25 per page → 3 pages)
- **When** they open `/gigs` and use the `PaginationControls` (Next/Previous, page numbers, direct `?page=` URLs, invalid-page redirects)
- **Then** the `«Найдено»` count badge SHALL read `60` on each page (asserted by scoping to the `«Найдено»` heading's row, not a `«Найдено 60»` node), `[aria-current="page"]` SHALL track the active page, and a `?tags=React` filter SHALL be preserved with `?page=` when paginating
- **And** changing a filter `<select>` (sort) SHALL drop `?page=` (reset to page 1)

#### Scenario: The rebuilt dashboard and my-gigs empty states render

- **Given** a freshly seeded CLIENT (no gigs) and, separately, a freshly seeded SPECIALIST (no applications/gigs)
- **When** each opens `/dashboard` (and the CLIENT opens `/my-gigs`)
- **Then** the empty `«Мои гиги»` grid SHALL show `«Здесь пока пусто.»`, the empty `«Сообщения»` panel SHALL show `«Сообщений пока нет.»`, and `/my-gigs` SHALL show `«Здесь пока пусто»`
- **And** the role panel SHALL show `«Создайте новый гиг»` (CLIENT) / `«Найти новый гиг»` (SPECIALIST)

## REMOVED Requirements

### Requirement: Kit Browse + Pagination + Empty-States E2E Coverage

**Reason for removal:** `compose-gig-search.spec.ts`, `gig-pagination.spec.ts`, and `empty-states.spec.ts` asserted the **kit** browse stack: a content `<form role="search">` + `searchbox`, an in-content `«Поиск проектов»`/`«Поиск гигов»` SectionHeader, a `«Сетка»/«Список»` view switcher, the kit `Select` (`button`+`option`), `«Найдено N»` as a single text node, a `«К проекту»` `<button>`, the kit dashboard `role="tablist"`/`role="tab"` chips + `«Найти проект»` button, kit English empty states reached via the register form (`select[name="role"]`), and a `«View Example Gigs»` link on the browse empty state. The rebuild (`GigSearchDesign.tsx` + `AppShellDesign.tsx` + `DashboardDesign.tsx`) moved search to the shell header, dropped the in-content title and the view switcher, made the filters native `<select>`s, split `«Найдено»` from its count badge, made the card a `<Link>`, and replaced the dashboard/my-gigs/browse empty states with the prototype ones — so every kit selector now misses. The coverage is re-expressed against the rebuilt screens under the reconciled requirement above.

The platform previously SHALL have verified the kit browse screen (content `role="search"`, `«Поиск гигов»`/`«Поиск проектов»` title, `«Сетка»/«Список»` switcher, kit `Select`, `«Найдено N»` node, `«К проекту»` button), kit pagination count nodes (`text=Найдено 60`), and kit empty states (`Post Your First Gig`, `Create Gig`, `View Example Gigs`, `No Messages Yet`, `role="tablist"`, `«Найти проект»`).

#### Scenario: Kit browse renders the search form, title, switcher, and count node

- **Given** an authenticated SPECIALIST on the kit `/gigs`
- **When** the page loads
- **Then** a content `role="search"` form, a `«Поиск проектов»` SectionHeader, a `«Сетка»/«Список»` switcher, and a `«Найдено N»` text node render, and a `«К проекту»` button opens the gig

> Removed: the content search box, the in-content title, the view switcher, the kit `Select`, the `«Найдено N»` single node, the `«К проекту»` button, the kit dashboard tablist/`«Найти проект»`, the register-form role select, and the kit English empty states (incl. the browse `«View Example Gigs»` link) are gone. Covered by the reconciled requirement above; `/gigs/examples` is intentionally out of scope (still old-kit).
