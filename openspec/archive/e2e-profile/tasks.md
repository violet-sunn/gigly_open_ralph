# Tasks — e2e-profile

> **Status: COMPLETE.** Baseline confirmed 2 of 3 old tests failed (the composed-blocks test on «Не в сети» + the `heading 'Профиль'` count-0; the edit test on the missing «Редактировать профиль» button); the public test passed vacuously (the button-absence checks were always true). Rewrote `compose-profile.spec.ts` into 4 tests: SPECIALIST owner ID-card + four blocks (shell «ПРОФИЛЬ» heading, «На платформе с …», Стек/WebSocket, Опыт/Yandex, Избранные категории/Маркетинг, Реализованные проекты/«E2E Profile Realized Gig»); CLIENT owner «Реквизиты» (Заказчик + ИНН/value/КПП, no «Стек»); public read-only (no edit pencil); and the destructive owner edit round-trip (last). One mid-flight fix: the owner's sidebar ALSO renders «Иван Иванов» (role pill «Специалист» as its sibling), so `getByText(name).locator('following-sibling::span')` hit 2 nodes → switched the pencil locator to its **unique svg path** `span:has(path[d^="M12.146.146"])` (also used for the non-owner pencil-absence assertion). `npm run clean:test-db && npm run test:e2e compose-profile` → **4 passed (20.7s)**. No `app/`/`lib/` changes. Plan bumped 11/16 → 12/16.

> Run targeted: `npm run test:e2e compose-profile` (the Playwright `webServer` boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). If integration pollution is suspected, `npm run clean:test-db` first. Iterate one test with `-g "<title>"`.
>
> **Root cause this change fixes:** `compose-profile` asserts the kit availability pill «Не в сети», a `heading 'Профиль'` count-0, and a «Редактировать профиль» edit button — none exist in the rebuilt `ProfileDesign`. The rebuilt screen renders an `offline` pill, the shell `<h1>` «ПРОФИЛЬ», and a bare Pencil `<span>` (aria-hidden svg, no accessible name) as the edit affordance. **Tests only — no `app/`/`lib/` change** (do NOT add `role`/`aria-label` to the Pencil; locate it by DOM position).

## Reference — the real contract (`ProfileDesign.tsx` + `getProfile`)

- **No in-screen title** — the shell header owns the `<h1>` «ПРОФИЛЬ» (uppercase). A `getByRole('heading', { name: 'ПРОФИЛЬ' })` is the page-title assertion. Do NOT assert `heading 'Профиль' count 0` — the shell `<h1>` matches it case-insensitively.
- **ID card (both roles):** avatar (initials when no `avatarUrl`), `header.name` + a Pencil (owner only), `header.roleTag`, and an `offline` status pill. `roleTag` = `sp.position || sp.specialization || sp.experienceLevel || 'Специалист'` for a SPECIALIST (the seed's `position` «Senior Frontend Engineer»); `'Заказчик'` for a CLIENT.
  - **SPECIALIST extra:** if `header.verified`, the «Номер телефона верифицирован» badge; always «На платформе с {memberSince}» (`longDate(createdAt)` — assert the prefix «На платформе с», not the date).
  - **CLIENT right panel:** «Реквизиты» with «ИНН» + `company.inn` (or «—») and «КПП» + `company.kpp` (or «—»).
- **SPECIALIST blocks** (rendered only when `stack && categories && experience`):
  - «Стек» — `stack.tags[]` from `techStack.split(',')` → tag chips (seed → «Python», «Node.js», «WebSocket»); empty → «Стек не указан.».
  - «Опыт» — `experience.bio` + entries (`company` / `period` / `title` / `description`); seed → «Yandex», «Вконтакте».
  - «Избранные категории» — only `categories[].favorite` rendered as `[ label ]` (seed favorites: marketing/design/programming → «[ Маркетинг ]» …); empty → «Категории не выбраны.».
  - «Реализованные проекты» — a count badge (`realized.length`) + a design `GigCard` per realized gig (COMPLETED/PAID assigned). `GigCard` renders `vm.title` → «E2E Profile Realized Gig». Empty → «Пока нет завершённых проектов.».
- **Edit affordance (owner):** `data.isOwner` → each Pencil's `onClick` = `router.push('/profile/edit?from=profile')`. The Pencil is `<span onClick>{svg}</span>` with NO text/aria. The one beside the name is the **following sibling** of the name span: `page.getByText('Иван Иванов').locator('xpath=following-sibling::span')`. Non-owner → `edit` undefined → `Pencil` returns `null` (no pencil rendered).
- **Edit form** (`/profile/edit`, unchanged): `#displayName` input + a «Save Profile» button; on save redirects back to `/profile`.
- **Seed:** Category upserts (marketing/design/programming/development/coding) are REQUIRED before the favorites `connect` (FK). Keep the SPECIALIST «Иван Иванов» + CLIENT viewer «ООО Зритель» (`inn: '7700000001'`) + the COMPLETED realized gig + review.

## 1. [x] Baseline + capture the mismatches

- Run `npm run test:e2e compose-profile` and record failures. Expect «Не в сети», the `heading 'Профиль' count 0`, and the «Редактировать профиль» button to fail; «Senior Frontend Engineer», «Номер телефона верифицирован», «Стек»/«WebSocket», «Опыт»/«Yandex», «Избранные категории»/«Маркетинг», «Реализованные проекты»/«E2E Profile Realized Gig» may pass.
- **Test plan:** baseline run → note the exact failing assertions to replace in tasks 2–5.

## 2. [x] Rewrite the SPECIALIST ID-card + blocks test

- Keep the existing `beforeAll` seed (Category upserts → SPECIALIST «Иван Иванов» → CLIENT viewer → realized gig + review).
- Rewrite the "renders the composed blocks" test (SPECIALIST owner, `goto /profile`): replace `getByText('Не в сети')` with the member-since line `getByText(/На платформе с/)`; replace the `heading 'Профиль' count 0` with `await expect(page.getByRole('heading', { name: 'ПРОФИЛЬ' })).toBeVisible()`. Keep «Иван Иванов», «Senior Frontend Engineer», «Номер телефона верифицирован», «Стек»(exact)+«WebSocket», «Опыт»(exact)+«Yandex», «Избранные категории»+«Маркетинг», `/Реализованные проекты/`+«E2E Profile Realized Gig».
- **Test plan:** `npm run test:e2e compose-profile -g "SPECIALIST"` (or the test title) → green.

## 3. [x] Add the CLIENT «Реквизиты» test

- New test (the CLIENT viewer, `goto /profile`): assert the role tag «Заказчик», the «Реквизиты» panel, the «ИНН» label + the value «7700000001», and the «КПП» label; assert the SPECIALIST block «Стек» is absent (`getByText('Стек', { exact: true })` count 0).
- **Test plan:** `npm run test:e2e compose-profile -g "Реквизиты|CLIENT"` → green.

## 4. [x] Rewrite the public read-only test

- The public test (CLIENT viewer, `goto /profile/${specId}`): keep «Стек»(exact)+«WebSocket», «Опыт»(exact)+«Yandex»; replace the two «Редактировать…» button-absence assertions with the pencil-absence assertion: `await expect(page.getByText('Иван Иванов').locator('xpath=following-sibling::span')).toHaveCount(0)`.
- **Test plan:** `npm run test:e2e compose-profile -g "read-only|public"` → green.

## 5. [x] Rewrite the edit-round-trip test (runs last — destructive)

- Keep this test ordered LAST (it mutates the seeded specialist's `displayName`; the read-only + SPECIALIST tests above must see the pristine seed).
- SPECIALIST owner, `goto /profile`: replace the «Редактировать профиль» button click with the name's following-sibling Pencil: `await page.getByText('Иван Иванов').locator('xpath=following-sibling::span').click()`; assert `toHaveURL(/\/profile\/edit/)`; `fill('#displayName', 'Иван Обновлённый')`; click `getByRole('button', { name: /Save Profile/ })`; assert `toHaveURL(/\/profile(\?|$)/)` and `getByText('Иван Обновлённый').first()` visible.
- **Test plan:** `npm run test:e2e compose-profile -g "edit|round-trips"` → green.

## 6. [x] Full green + plan update

- Run the whole file: `npm run test:e2e compose-profile` → 0 failures (`npm run clean:test-db` first if pollution suspected).
- Grep the spec to confirm no «Не в сети», no `heading.*Профиль.*count`/`toHaveCount(0)` for the title, and no «Редактировать профиль»/«Редактировать» button names remain; confirm the `offline`-free member-since line, the shell «ПРОФИЛЬ» heading, the «Реквизиты» CLIENT assertions, and the following-sibling Pencil locators are present.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `compose-profile` (#24) in `openspec/planning/e2e-reconciliation.md` and bump progress 11/16 → 12/16.
- **Acceptance:** `npm run test:e2e compose-profile` reports 0 failures.
