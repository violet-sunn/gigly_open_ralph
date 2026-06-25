# e2e-create-gig

## Why

Reconciliation change #8 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The «Создать гиг» screen at `/gigs/new` was rebuilt on the `gigly_full_design` prototype (`app/(protected)/gigs/new/CreateGigDesign.tsx`): a guided four-card brief (**«Что нужно сделать?» / «Как поймём, что готово?» / «Что важно учесть?» / «Условия»**) on the left, plus a right panel with the live **«Готовность брифа»** readiness checklist and the fee **summary** (Бюджет / Сервисный сбор (10%) / Итого к оплате). It is wired to the **unchanged** `createGig` server action, which still validates (title/description/acceptanceCriteria required; criteria ≥ 50 chars; positive budget) and redirects to `/gigs/new/success` («Гиг опубликован»).

`compose-create-gig.spec.ts` currently **does not match the rebuilt component** and would fail:

- It uses `page.getByLabel('Бюджет' | 'Название' | 'Описание' | 'Цель' | 'Ожидаемый результат' | 'Критерий приёмки' | 'Срок выполнения')`, but the component's `<label>`s are **styled, unassociated** elements (no `htmlFor`/`id`, not wrapping the control) — `getByLabel` resolves nothing.
- It clicks `page.getByRole('radio', { name: 'Программирование' })`, but the category chips are clickable **`<div onClick>`** elements, not radios.
- It asserts `page.getByText('Сводка (комиссия)')`, but the summary card renders **no «Сводка» heading** — only the «Бюджет» / «Сервисный сбор (10%)» / «Итого к оплате» rows.
- Its label `'Срок выполнения'` does not exist; the field label is «Срок, дней».

This change rewrites the spec to the rebuilt markup using the **stable contract** the PRD pins: the form `name=` selectors are unchanged (`title` / `description` / `goal` / `deliverables` / `constraints` / `budget` / `deadlineDays`, plus the hidden `category` / `acceptanceCriteria` / `tags`), so the rewrite drives fields by `name=` and asserts the design surfaces (cards, category chips, criteria editor + suggestions, tag chips, readiness checklist, live fee summary, «Опубликовать гиг») by their real text/role. Publishing a valid brief still lands on `/gigs/new/success`.

## What Changes

- **REWRITE `compose-create-gig.spec.ts`** against `CreateGigDesign.tsx` (no behavioural/app change):
  - **Render test** — assert the four brief cards («Что нужно сделать?», «Как поймём, что готово?», «Что важно учесть?», «Условия»), the readiness panel «Готовность брифа» (+ «Заполнено» and the `N / 7` score), and the fee summary rows («Сервисный сбор (10%)», «Итого к оплате») render, with «Опубликовать гиг» present.
  - **Selector deltas** — replace every `getByLabel(...)` with the unchanged `name=` selectors (`input[name="title"]`, `textarea[name="description"]`, `input[name="goal"]`, `textarea[name="deliverables"]`, `textarea[name="constraints"]`, `input[name="budget"]`, `input[name="deadlineDays"]`); replace the `getByRole('radio', …)` category pick with a click on the chip **text** (e.g. «Программирование») and assert the hidden `input[name="category"]` took the slug (`programming`); replace the `getByText('Сводка (комиссия)')` assertion with «Итого к оплате».
  - **Criteria editor** — type a ≥ 50-char criterion into the criterion input (by placeholder) → click «Добавить» → assert the «Готово, когда …» row appears and the hidden `input[name="acceptanceCriteria"]` holds it; assert a suggestion chip («Есть тесты» / «Передача исходников» / «Документация») adds a criterion on click.
  - **Tag chips** — type a tag + Enter into the tag input (by placeholder) → assert the chip renders and the hidden `input[name="tags"]` holds the comma-joined value.
  - **Live fee** — filling `budget` = `100000` updates the summary live: «Сервисный сбор (10%)» = `10 000 ₽`, «Итого к оплате» = `110 000 ₽` (assert whitespace-tolerant — `ru-RU` uses a non-breaking thousands separator).
  - **Live readiness** — filling fields flips checklist rows from `○` to `✓` and advances the «Заполнено» score (e.g. title + category + a ≥ 20-char description + goal + deliverables + a criterion + budget&deadline ⇒ `7 / 7`).
  - **Publish flow** — fill a valid brief (title, category, description ≥ 20 chars, goal, deliverables, one ≥ 50-char criterion, budget, deadline) → click «Опубликовать гиг» → `waitForURL('**/gigs/new/success')` → assert «Гиг опубликован» and the «К моим гигам» button.
- Reuse the existing harness (`setE2ESession` + direct Prisma seeding into `file:./test.db`) and the existing category upsert + CLIENT seed — they already provide the data the rewrite needs.

## Impact

- **Affected:** `__tests__/e2e/compose-create-gig.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`CreateGigDesign.tsx`, `createGig`, `CreateGigSuccess`, `lib/categories`); the unit/integration suite (951/951 — must stay green); the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 7/16 → 8/16.
