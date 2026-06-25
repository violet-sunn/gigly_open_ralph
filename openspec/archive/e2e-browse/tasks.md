# Tasks — e2e-browse

> **Status: COMPLETE.** All three specs rewritten and green — `compose-gig-search` 5 passed, `gig-pagination` 8 passed, `empty-states` 6 passed + 2 skipped. No residual kit selectors. Plan bumped 5/16 → 6/16.

> Run targeted, not the whole suite (slow boot): `npm run test:e2e <file>` or `-g "<title>"`. If integration pollution is suspected, `npm run clean:test-db` first. Playwright transpiles but does not typecheck — pre-existing tsc laxity in test files is not a blocker.

## 1. [x] Rewrite `compose-gig-search.spec.ts` to the rebuilt browse screen

- Keep the `beforeAll` seed (SPECIALIST + CLIENT + the three OPEN gigs: `design` / `development` / uncategorized; the `category.upsert` for `design`+`development` is required — FK target for `categorySlug`).
- **Render test:** replace `getByRole('search')` + `getByText(/Найдено 3/)` with:
  - the three `<select>`s via `page.getByRole('combobox')` (3 of them); assert presence (e.g. `toHaveCount(3)`), and that the category select carries `«Все категории»`, sort `«Сначала новые»`, rating `«Любой рейтинг»` (e.g. `getByRole('combobox').filter({ hasText: 'Все категории' })`).
  - the count: `const found = page.getByRole('heading', { name: 'Найдено' }); await expect(found).toBeVisible(); await expect(found.locator('..').getByText('3', { exact: true })).toBeVisible();` (scope the badge to the heading's row so card digits don't collide).
  - the seeded gig titles visible.
- **DELETE** the test `reconciled HEADER: SectionHeader «Поиск проектов» …` — no in-content title / no switcher in `GigSearchDesign`.
- **DELETE** the test `the ViewToggle switches to list layout` — no `«Сетка»/«Список»` in the rebuild.
- **Search test:** drive the shell-header input — `await page.getByPlaceholder('Поиск чего угодно...').fill('Design'); await page.getByPlaceholder('Поиск чего угодно...').press('Enter'); await page.waitForURL(/search=Design/)`. Assert count badge `1` (scoped), the `design` gig visible, the `dev` gig `toHaveCount(0)`.
- **Category test:** `await page.getByRole('combobox').filter({ hasText: 'Все категории' }).selectOption({ label: 'Дизайн' }); await page.waitForURL(/category=design/)`. Assert count badge `1` + the `design` gig visible.
- **Card-open test:** `await page.goto('/gigs?search=Design'); await page.getByRole('link', { name: /E2E Search Design Gig/ }).first().click();` then `await expect(page).toHaveURL(new RegExp(\`/gigs/${designGigId}\\?.*from=browse\`))`.
- **Add an empty-state test** (or fold into search): `await page.goto('/gigs?search=zzz-nonexistent'); await expect(page.getByText('Ничего не нашлось')).toBeVisible(); await expect(page.getByRole('button', { name: 'Сбросить фильтры' })).toBeVisible();`.
- **Test plan:** `npm run test:e2e compose-gig-search` → all green.

## 2. [x] Rewrite `gig-pagination.spec.ts` count assertions + the filter-reset step

- Keep the seed (60 OPEN gigs, 25/page) and the manual-cookie auth (it works); keep every `PaginationControls` assertion: `nav[aria-label="Pagination"]`, `a[aria-label="Next page"]`/`"Previous page"`/`"Go to page 3"`, `[aria-current="page"]`, the disabled `span[aria-label][aria-disabled="true"]` + `opacity-50`.
- Replace every `page.locator('text=Найдено 60')` / `text=Найдено 30` / `text=Найдено 1` with the scoped badge helper:
  `const count = (n: string) => page.getByRole('heading', { name: 'Найдено' }).locator('..').getByText(n, { exact: true })` → `await expect(count('60')).toBeVisible()`.
- Rewrite `should reset to page 1 when filters change`: from `/gigs?page=2`, change a filter `<select>` instead of the removed searchbox — `await page.getByRole('combobox').filter({ hasText: 'Сначала новые' }).selectOption({ label: 'Дороже' }); await page.waitForURL(/sort=budget-desc/);` then `await expect(page).not.toHaveURL(/page=/)` and `await expect(count('60')).toBeVisible()` (sort keeps all 60).
- Leave the `?tags=React` preservation test as-is except its count assertions (→ `count('30')`).
- **Test plan:** `npm run test:e2e gig-pagination` → all green (8 tests).

## 3. [x] Rewrite `empty-states.spec.ts` to the rebuilt screens via the modern harness

- Replace the register-form setup (`page.goto('/register')` + `selectOption('select[name="role"]')`) with `setE2ESession` + a Prisma seed helper (mirror the existing `seedSpecialist`; add a `seedClient`).
- **SPECIALIST browse empty:** seed a SPECIALIST, `goto('/gigs?search=nonexistentgig12345')`, assert the count badge `0` (scoped), `«Ничего не нашлось»` + `«Сбросить фильтры»` visible. (Remove the `«Поиск гигов»` h2 + `role="search"` assertions.)
- **SPECIALIST browse populated:** assert the `«Найдено»` heading visible (drop `role="search"`).
- **SPECIALIST dashboard empty:** seed a SPECIALIST, `goto('/dashboard')`, assert `«Здесь пока пусто.»` (the empty `«Мои гиги»` grid) and `«Сообщений пока нет.»` visible, and `«Найти новый гиг»` present. (Remove `role="tablist"`/`role="tab"` and `«Находите интересные гиги»`/`«Найти проект»`.)
- **CLIENT dashboard empty:** seed a CLIENT (no gigs), `goto('/dashboard')`, assert `«Здесь пока пусто.»` + `«Сообщений пока нет.»` + `«Создайте новый гиг»`. (Remove the English `Post Your First Gig`/`Create Gig`/`View Example Gigs`/`No Messages Yet`.)
- **CLIENT my-gigs empty:** `goto('/my-gigs')`, assert `«Здесь пока пусто»` (note: my-gigs has no trailing period; use a non-exact `getByText('Здесь пока пусто')`).
- **Accessibility test:** retarget to the browse empty state — `goto('/gigs?search=zzz')`, focus the `«Сбросить фильтры»` button and press Enter → assert `toHaveURL('/gigs')`. (Drop the `«View Example Gigs»` → `/gigs/examples` flow.)
- **DROP** the `«Example Gigs Page»` describe block (out-of-scope old-kit screen). **KEEP** the two ADMIN tests `test.skip()`.
- **Test plan:** `npm run test:e2e empty-states` → all green (skips counted).

## 4. [x] Full-spec green + plan update

- Run the three files: `npm run test:e2e compose-gig-search && npm run test:e2e gig-pagination && npm run test:e2e empty-states` → 0 failures.
- Grep the three specs for residual kit selectors — no content `getByRole('search')`/`searchbox`, no `«Поиск проектов»`/`«Поиск гигов»`, no `«Сетка»/«Список»`, no `getByRole('button', { name: /К проекту/ })`, no `text=Найдено `, no `role="tablist"`/`getByRole('tab'`, no `select[name="role"]`, no English kit empty strings remain.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `e2e-browse` in `openspec/planning/e2e-reconciliation.md` and bump progress 5/16 → 6/16.
- **Acceptance:** the three specs report 0 failures under `npm run test:e2e`.
