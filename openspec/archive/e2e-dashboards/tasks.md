# Tasks — e2e-dashboards

## 1. Re-confirm the grounding (rebuilt dashboard labels + per-role shape)

- [x] `grep -nE "Добро пожаловать в Gigly|Мои гиги|Найти новый гиг|Создайте новый гиг|Требует внимания|Сообщения|Поиск по стеку" app/\(protected\)/dashboard/DashboardDesign.tsx` → all present; tabs are `<div onClick>` (no `role="tab"`).
- [x] `AppShellDesign.tsx` `pageTitle('/dashboard')` → `«ДАШБОРД»` rendered as `<h1>`; the dashboard route is wrapped by the shell, so the title is in the DOM.
- [x] `page.tsx`: CLIENT `attention: []`, SPECIALIST `attention: d.attention`. `lib/view-models.ts`: CLIENT dashboard tabs = `Все/В работе/На проверке/Завершённые` (**no «Заявки»**); SPECIALIST = `Все/Заявки/В работе/На проверке/Завершённые`.
- [x] `GigCard.tsx`: compact (`full=false`) card is a `<Link href="/gigs/[id]">` with **no** `«К проекту»` button and renders a `STATUS_LABEL_RU` status label (the source of the `«В работе»`/`«На проверке»` tab/card text collision).

**Test plan:** the grep + reads confirm every label, the per-role tab/attention split, and the shell title — the premises behind every assertion delta.

## 2. Rewrite `compose-specialist-dashboard.spec.ts`

- [x] **Test 1 (renders):** WELCOME `getByText('Добро пожаловать в Gigly!')`; `getByRole('heading',{name:'Мои гиги'})`; **remove** `getByRole('tablist')`; assert the 5 tab chips with `getByText(label).first()` for each of `Все/Заявки/В работе/На проверке/Завершённые` (`.first()` since `В работе`/`На проверке` also appear as the in-progress card's status); `getByText('Заполните профиль')`; `getByRole('heading',{name:'Найти новый гиг'})`; `getByText('E2E Spec InProgress Gig').first()`; `getByRole('heading',{name:'Требует внимания'})`; `getByRole('heading',{name:'Сообщения'})`; replace the `heading 'Дашборд' .toHaveCount(0)` line with `await expect(page.getByRole('heading',{name:'ДАШБОРД'})).toBeVisible()`.
- [x] **Test 2 (open a gig):** `await page.getByRole('link',{name:/E2E Spec InProgress Gig/}).first().click()` → `expect(page).toHaveURL(new RegExp(\`/gigs/${inProgressGigId}\`))`.
- [x] **Test 3 (Заявки tab):** `await page.getByText('Заявки').click()` → `await expect(page.getByText('E2E Spec Pending Gig')).toBeVisible()`.
- [x] **Test 4 (search → /gigs):** `await page.getByPlaceholder('Поиск по стеку или категории').fill('React')` then `.press('Enter')` → `await expect(page).toHaveURL(/\/gigs(\?|$)/)`.
- [x] Update the file's top comment to describe the rebuilt screen (drop the kit «Активные задачи»/SearchPanel/Уведомления references). No reference to removed kit components.

**Test plan:** `npm run clean:test-db && npm run test:e2e compose-specialist-dashboard` → 4 tests green.

## 3. Rewrite `compose-client-dashboard.spec.ts`

- [x] **Test 1 (renders):** WELCOME `getByText('Добро пожаловать в Gigly!')`; `getByRole('heading',{name:'Мои гиги'})`; **remove** `getByRole('tablist')`; assert the **4** CLIENT tab chips `getByText('Все').first()` / `Все/В работе/На проверке/Завершённые` (**do NOT assert «Заявки»**; the OPEN seed gig is `«Открыт»` so no card collision — `.first()` is harmless/optional here); `getByText('Заполните профиль')`; `getByRole('heading',{name:'Создайте новый гиг'})`; `getByRole('link',{name:/Создать гиг/}).first()`; `getByText('E2E Dashboard Gig')`; `getByRole('heading',{name:'Сообщения'})`; `await expect(page.getByRole('heading',{name:'Требует внимания'})).toHaveCount(0)` (CLIENT `attention=[]`); replace `heading 'Дашборд' .toHaveCount(0)` with `await expect(page.getByRole('heading',{name:'ДАШБОРД'})).toBeVisible()`.
- [x] **Test 2 (open a gig):** `await page.getByRole('link',{name:/E2E Dashboard Gig/}).first().click()` → `expect(page).toHaveURL(new RegExp(\`/gigs/${gigId}\`))`.
- [x] **Test 3 (create CTA):** keep — `await page.getByRole('link',{name:/Создать гиг/}).first().click()` → `expect(page).toHaveURL(/\/gigs\/new/)`.
- [x] Update the file's top comment to drop the kit «Активные задачи»/tablist references.

**Test plan:** `npm run clean:test-db && npm run test:e2e compose-client-dashboard` → 3 tests green.

## 4. Verify both specs + suite collection

- [x] `npm run clean:test-db && npm run test:e2e compose-specialist-dashboard && npm run test:e2e compose-client-dashboard` → both green.
- [x] `npm run test:e2e -- --list` → exit 0, both specs listed, no import errors.
- [x] `grep -nE "tablist|getByRole\('tab'|Активные задачи|Найти проект|Уведомления|Здравствуйте|К проекту" __tests__/e2e/compose-specialist-dashboard.spec.ts __tests__/e2e/compose-client-dashboard.spec.ts` → no matches in test code (header comments may paraphrase, but must not contain these as selectors).
- [x] `git status --short` → only the two e2e specs (+ this change's artifacts + plan); no `app/`/`lib/`/helper edits.

**Test plan:** both targeted runs green; `--list` clean; the old-kit grep is empty in test code.

## 5. Update the plan checklist

- [x] Tick `- [x] e2e-dashboards` in `openspec/planning/e2e-reconciliation.md` and bump **Progress** to `4/16`.

**Test plan:** the planning doc shows `e2e-dashboards` checked and `Progress: 4/16`.

## Acceptance Criteria (deterministic)

- Both specs assert the rebuilt labels (`Добро пожаловать в Gigly!`, `Мои гиги`, role panel, `Сообщения`, shell `ДАШБОРД`) and use `getByText`/`getByRole('heading')` chips — **no** `getByRole('tablist')`/`getByRole('tab')`, **no** `Активные задачи`/`Найти проект`/`Уведомления`/`Здравствуйте`/`К проекту` in test code.
- The CLIENT spec asserts only its 4 tabs (no «Заявки») and `«Требует внимания».toHaveCount(0)`; the SPECIALIST spec asserts the 5 tabs and `«Требует внимания»` visible.
- `npm run test:e2e compose-specialist-dashboard` (4 tests) and `npm run test:e2e compose-client-dashboard` (3 tests) are green after `clean:test-db`.
- `npm run test:e2e -- --list` collects with no import errors.
- No files outside `__tests__/e2e/` and the planning checklist were modified.
