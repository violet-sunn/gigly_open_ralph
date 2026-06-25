# Tasks — e2e-my-gigs

> **Status: COMPLETE.** `compose-my-gigs.spec.ts` rewritten; `npm run test:e2e compose-my-gigs` → 3 passed. Plan bumped 4/16 → 5/16.

## 1. [x] Rewrite the chip + grid render assertions

- In `__tests__/e2e/compose-my-gigs.spec.ts`, keep the `beforeAll` seed as-is (one CLIENT + one `IN_PROGRESS` gig in `file:./test.db`) and the `setE2ESession` + `page.goto('/my-gigs')` setup.
- **Remove** the in-content title assertion `page.locator('#main-content').getByText('Мои гиги', { exact: true })` — there is no in-content title; the shell header supplies «МОИ ГИГИ». (Do not re-add it scoped to the shell — out of scope for this screen spec.)
- Replace the `for (const label …) getByRole('tab', { name: label })` loop with chip assertions by visible text. The chips are `<div onClick>` with a `<span>{label}</span>` — assert each of `Все/Заявки/В работе/На проверке/Завершённые` is visible. **Disambiguation:** `В работе` / `На проверке` / `Завершённые` may also appear as a `GigCard` status label (`STATUS_LABEL_RU`). Scope chip lookups to the chip row (the first `<div style="display:flex;gap:8;flexWrap:wrap">` — e.g. via a container locator or `.first()`) so a chip assertion/click does not collide with a card's status text.
- Keep the seeded gig-title assertion `getByText('E2E Мои Гиги — активный гиг')` (the own-gig `full` `GigCard`).
- Add assertions for the `full` footer labels on the populated grid: `Фикс. цена`, `Срок выполнения`, `К проекту` are visible.
- **Test plan:** `npm run test:e2e compose-my-gigs -g "chips"` (or the renamed render test) → green; the title/`role=tab`/footer assertions resolve against the rebuilt DOM.

## 2. [x] Rewrite the card-navigation assertion

- Replace `page.getByRole('button', { name: 'К проекту' }).first().click()` — `«К проекту»` is a `<span>`, not a button. Navigate by clicking the card-wide `<Link href="/gigs/[id]">`: click the seeded card (e.g. the link wrapping the gig title, or `getByText('К проекту').first()` which is inside the link).
- Keep `await expect(page).toHaveURL(new RegExp(\`/gigs/${gigId}\`))`.
- **Test plan:** `npm run test:e2e compose-my-gigs -g "detail"` → green; the browser lands on `/gigs/[id]`.

## 3. [x] Verify the empty-state assertion

- The empty-tab test already targets the rebuilt markup. Confirm it activates the `«Заявки»` chip via the text/chip-row selector (not `role="tab"`) and still asserts:
  - `«Здесь пока пусто»` visible,
  - `«Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.»` visible,
  - the seeded gig title has count 0.
- (The single seeded gig is `IN_PROGRESS` → `tabKey: 'in-progress'`, so the `«Заявки»` / `apps` chip is genuinely empty.)
- **Test plan:** `npm run test:e2e compose-my-gigs -g "empty"` → green.

## 4. [x] Full-spec green + plan update

- Run the whole file: `npm run test:e2e compose-my-gigs` → all tests green. If integration pollution is suspected from prior runs, `npm run clean:test-db` first (known test-db pollution).
- Grep the spec for residual kit selectors — no `getByRole('tab'`, no `role="tablist"`, no `getByRole('button', { name: 'К проекту' })`, no `#main-content` title assertion remain.
- Confirm no `app/`/`lib/` files changed and the unit/integration suite is untouched (951/951 stays green — not re-run here unless the spec edit implies otherwise).
- Tick `e2e-my-gigs` in `openspec/planning/e2e-reconciliation.md` and bump progress to 5/16.
- **Acceptance:** `npm run test:e2e compose-my-gigs` reports 0 failures.
