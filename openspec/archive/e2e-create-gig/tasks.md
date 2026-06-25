# Tasks — e2e-create-gig

> **Status: COMPLETE.** Baseline confirmed both old tests failed (`getByLabel`, `getByRole('radio')`, and a strict-mode violation on `getByText('Готовность брифа')` — the intro banner repeats that phrase). Rewrote `compose-create-gig.spec.ts` into 3 tests driven by the unchanged `name=` selectors + design text/roles: render+live-fee, category-slug/criteria/tags hidden mirrors, and the 7/7 publish→success flow. `npm run test:e2e compose-create-gig` → **3 passed**. No `app/`/`lib/` changes. Plan bumped 7/16 → 8/16.

> Run targeted: `npm run test:e2e compose-create-gig` (server boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). If integration pollution is suspected, `npm run clean:test-db` first. Iterate single tests with `-g "<title>"`.
>
> **Root cause this change fixes:** the current spec uses `getByLabel(...)`, `getByRole('radio', …)`, and `getByText('Сводка (комиссия)')` — none of which exist in `CreateGigDesign.tsx`. Drive the form by the **unchanged `name=` selectors** and assert design surfaces by their real text/role.

## Reference — the real component contract (`CreateGigDesign.tsx`)

- **Form fields by `name=` (unchanged):** `title` (input), `description` (textarea), `goal` (input), `deliverables` (textarea), `constraints` (textarea), `budget` (input, number), `deadlineDays` (input, number). **Hidden mirrors:** `category` (slug), `acceptanceCriteria` (newline-joined criteria), `tags` (comma-joined).
- **Cards:** «Что нужно сделать?», «Как поймём, что готово?», «Что важно учесть?», «Условия».
- **Category chips:** clickable `<div>`s rendered from `categoryOptions`; click the **text** (e.g. «Программирование» → slug `programming`). Toggling off clears the hidden `category`.
- **Criteria editor:** an input (placeholder starts «…например») + a «Добавить» `<button type="button">`; Enter in the input also adds. Suggestion chips: «Есть тесты», «Передача исходников», «Документация» (click adds). Added rows read «Готово, когда {criterion}» with a ✕ to remove.
- **Tag input:** placeholder «Введите тег и нажмите Enter (напр.: Node.js)»; Enter adds a chip; click a chip to remove.
- **Readiness «Готовность брифа»:** «Заполнено» + `done / 7` score; rows = Название · Категория · Описание (≥ 20 chars) · Цель · Ожидаемый результат · Критерии приёмки (≥ 1) · Бюджет и срок (both). Hint card flips «Следующий шаг» → «Бриф готов к публикации» at 7/7.
- **Fee summary (no «Сводка» heading):** rows «Бюджет», «Сервисный сбор (10%)», «Итого к оплате» (= budget + 10%, live); «Опубликовать гиг» submit.
- **Server floor:** `createGig` requires title+description+acceptanceCriteria and **acceptanceCriteria ≥ 50 chars**; positive budget; then redirects to `/gigs/new/success` («Гиг опубликован» + «К моим гигам» button).

## 1. [x] Baseline + capture the selector mismatches

- Run `npm run test:e2e compose-create-gig` once and record which assertions fail (expect the `getByLabel`, `getByRole('radio')`, and «Сводка (комиссия)» lines to fail — they do not exist in the component).
- Confirm the `beforeAll` category upsert + CLIENT seed still applies cleanly (categories `marketing`/`design`/`programming`/`development`/`coding`).
- **Test plan:** baseline run → note exact failing selectors to replace in tasks 2–4.

## 2. [x] Rewrite the render + selector test

- Keep the seed/session setup. In the first («renders …») test:
  - Assert the four cards: `getByText('Что нужно сделать?')`, `getByText('Как поймём, что готово?')`, `getByText('Что важно учесть?')`, `getByRole('heading'|getByText, 'Условия')`.
  - Assert the readiness panel: `getByText('Готовность брифа')`, `getByText('Заполнено')`.
  - Assert the fee summary: `getByText('Сервисный сбор (10%)')`, `getByText('Итого к оплате')` (REMOVE the «Сводка (комиссия)» assertion).
  - Live fee: `page.locator('input[name="budget"]').fill('100000')` → assert «Итого к оплате» = `110 000 ₽` **whitespace-tolerant** (e.g. `getByText(/110[\s  ]?000\s*₽/)`) and «Сервисный сбор (10%)» value `10 000 ₽`. (Do NOT hard-code an ASCII space — `Intl.NumberFormat('ru-RU')` emits a non-breaking separator.)
- **Test plan:** `npm run test:e2e compose-create-gig -g "renders"` → green.

## 3. [x] Rewrite the criteria editor + category + tags coverage

- Replace `getByRole('radio', { name: 'Программирование' })` with `page.getByText('Программирование').click()`, then `expect(page.locator('input[name="category"]')).toHaveValue('programming')`.
- Criteria editor: fill the criterion input (locate by placeholder, e.g. `getByPlaceholder(/например/)`) with a ≥ 50-char string, click `getByRole('button', { name: 'Добавить' })`, assert the «Готово, когда …» row is visible and `expect(page.locator('input[name="acceptanceCriteria"]')).toHaveValue(/<text>/)`. Then click a suggestion chip («Есть тесты») and assert a second criterion row.
- Tags: fill the tag input (by placeholder «Введите тег…»), press Enter, assert the chip renders and `expect(page.locator('input[name="tags"]')).toHaveValue(/Node\.js/)` (or the typed tag).
- **Test plan:** `npm run test:e2e compose-create-gig -g "criteri|тег|category"` (or the chosen titles) → green.

## 4. [x] Rewrite the publish flow + readiness advance

- Drive every field by `name=`: `input[name="title"]`, `textarea[name="description"]` (≥ 20 chars), `input[name="goal"]`, `textarea[name="deliverables"]`, `input[name="budget"]` = `100000`, `input[name="deadlineDays"]` = `14`; pick a category chip; add ONE ≥ 50-char criterion via the editor.
- Optionally assert the readiness score reaches `7 / 7` once all rows are satisfied.
- Click `getByRole('button', { name: 'Опубликовать гиг' })` → `page.waitForURL('**/gigs/new/success')` → assert `getByText('Гиг опубликован')` and `getByRole('button', { name: 'К моим гигам' })`.
- **Test plan:** `npm run test:e2e compose-create-gig -g "Опубликовать|публик|success"` → green.

## 5. [x] Full-spec green + plan update

- Run the whole file: `npm run test:e2e compose-create-gig` → 0 failures.
- Grep the spec to confirm no `getByLabel(`, no `getByRole('radio'`, and no «Сводка (комиссия)» remain; confirm the `name=` selectors and the success-screen assertions are present.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `e2e-create-gig` in `openspec/planning/e2e-reconciliation.md` and bump progress 7/16 → 8/16.
- **Acceptance:** `npm run test:e2e compose-create-gig` reports 0 failures.

