# Tasks — e2e-disputes

> **Status: COMPLETE.** Baseline confirmed 5 failures (compose-disputes: gig-detail `role=button` «Открыть спор», `textarea[name="resolution"]`+«Разрешить спор», sidebar `bg-surface-level-3`; reconcile: «Заморожено»/«Хронология», the resolution-note flow) + 4 passing (incl. the empty-state passing *vacuously* — `getByText('Споров нет')` substring-matched «Открытых споров нет»). Rewrote both specs: gig-detail entry by `getByText(/Открыть спор/)`; admin resolve by clicking the verdict button «В пользу заказчика»/«В пользу специалиста» directly; participant read-only asserts the «Решение модератора» panel + verdict button absent; empty state «Открытых споров нет»; detail «Открыт» + «Ход рассмотрения»; verdict resolution «В пользу … — Спор разрешён в пользу …» (`.first()`); deleted the nav-active scenario. `npm run clean:test-db && npx playwright test compose-disputes reconcile-disputes-flow` → **8 passed (34.8s)**. No `app/`/`lib/` changes. Plan bumped 12/16 → 13/16.

> Reconciliation change #13. Rewrites **two** specs — `compose-disputes.spec.ts` + `reconcile-disputes-flow.spec.ts` — against the rebuilt `DisputesDesign` / `DisputeDetailDesign` / `NewDisputeDesign`. **Tests only — no `app/`/`lib/` change.**
>
> Run targeted: `npm run test:e2e compose-disputes` / `npm run test:e2e reconcile-disputes-flow` (the Playwright `webServer` boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). If integration pollution is suspected, `npm run clean:test-db` first. Iterate one test with `-g "<title>"`.

## Reference — the real contract (`app/(protected)/disputes/*` + `app/actions/dispute.ts`)

- **List (`DisputesDesign`):** «Споры» header + count badge; rows = avatar + gig title + `reason · opener · created` + amount + status tone; row click → `/disputes/<id>`. Empty state = **«Открытых споров нет»** (NOT «Споров нет»). No in-screen page title (shell `<h1>` «СПОРЫ»). No nav-active class to assert (the kit `bg-surface-level-3` is gone).
- **Detail (`DisputeDetailDesign`):** header card = gig title (`<h2>`) + «Причина: {reason} · открыл: {opener}» + a status pill (`STATUS_LABEL_RU`) + «Сумма по гигу» {amount}; when resolved, a green resolution banner with `dispute.resolution`. Then the **«Ход рассмотрения»** timeline (NOT «Хронология»), then the **«Доказательства»** evidence chips. Status labels: dispute `OPEN` → `'open'` → **«Открыт»**; `RESOLVED` → `'completed'` → **«Завершён»**; `REJECTED` → «Отклонён».
- **Admin resolve panel** (only `isAdmin && status==='open'`): heading **«Решение модератора»** + **three verdict submit buttons**, each its own `<form>` posting `resolveDispute` with hidden `status=RESOLVED` + `verdict` + `resolution`:
  - «В пользу специалиста» → verdict `specialist`, resolution `Спор разрешён в пользу специалиста.`
  - «В пользу заказчика» → verdict `company`, resolution `Спор разрешён в пользу заказчика.`
  - «Частичный возврат 50%» → verdict `split_50`, resolution `Частичный возврат 50%.`
  - The action prefixes the verdict: final resolution = `«{verdict label} — {hidden resolution}»` (e.g. «В пользу специалиста — Спор разрешён в пользу специалиста.»), written to `dispute.resolution` AND a moderator timeline entry → assert with **`.first()`**. There is **no** `textarea[name="resolution"]` and **no** «Разрешить спор» button. Clicking a verdict IS the submit; `resolveDispute` redirects to `**/gigs/**`.
  - The participant reply composer is **intentionally omitted** — do NOT assert it.
- **New (`NewDisputeDesign`, `/disputes/new?gig=<id>`):** «← Отмена» link, amber banner «…по проекту «{gigTitle}»…», then the form: hidden `gigId`/`reason`; «Причина спора» reason chips (REASON_OPTIONS — incl. «Результат не соответствует ТЗ»); «Опишите проблему» `textarea[name="description"]`; the **«Открыть спор»** submit button. `openDispute` redirects to `/gigs/<gigId>`. Server-gated: `getNewDisputeContext` → non-participant redirects to `/disputes`.
- **Gig-detail entry (`GigDetail.tsx`):** a clickable `<div onClick=router.push('/disputes/new?gig=<id>')>` reading **«Возникли разногласия? Открыть спор»** — match by `getByText(/Открыть спор/)`, NOT `getByRole('button', …)`.
- **Seeds:** keep both files' existing `beforeAll` seeds (CLIENT «ООО Спор», SPECIALIST «Иван Петров», ADMIN, outsider, empty user; IN_PROGRESS gigs; the read-only + resolve disputes). The resolve-flow seed already sets `openerRole`/`amount`/`evidence`/timeline.

## 1. [x] Baseline + capture the mismatches

- Run `npm run test:e2e compose-disputes` and `npm run test:e2e reconcile-disputes-flow`; record the failing assertions. Expect failures on: the gig-detail `role=button` «Открыть спор», `textarea[name="resolution"]` + «Разрешить спор», «Споров нет», `bg-surface-level-3` (compose-disputes); «Заморожено», «Хронология», the resolution-note flow (reconcile).
- **Test plan:** baseline run → note exact failing lines to replace in tasks 2–4.

## 2. [x] Rewrite `compose-disputes.spec.ts`

- **Open-from-gig test:** replace `getByRole('button', { name: 'Открыть спор' })` on the gig with `page.getByText(/Открыть спор/).click()`; keep the `/disputes/new?gig=<id>` URL assertion, the `textarea[name="description"]` fill, the **«Открыть спор»** submit (`getByRole('button', { name: 'Открыть спор' })` IS valid on the new screen), `waitForURL('**/gigs/**')`, and the `/disputes` list assertion «E2E Open-From-Gig».
- **Admin resolve test:** drop the `textarea[name="resolution"]` fill and the «Разрешить спор» click; instead `getByRole('button', { name: 'В пользу заказчика' }).click()`; keep `waitForURL('**/gigs/**')`; reopen `/disputes/<id>`; assert «Завершён» and `getByText(/В пользу заказчика/).first()`.
- **Participant read-only test:** keep the gig title + reason assertions; replace the «Разрешить спор» absence with the moderator-panel absence — `await expect(page.getByText('Решение модератора')).toHaveCount(0)` (and/or `getByRole('button', { name: 'В пользу специалиста' })` count 0).
- **Non-participant 404 test:** unchanged (reason text count 0).
- **Empty-state test:** replace «Споров нет» with **«Открытых споров нет»**.
- **Sidebar nav-active test:** **delete** it (the `bg-surface-level-3` active class no longer exists in `AppShellDesign`; nav-active styling is out of scope).
- **Test plan:** `npm run test:e2e compose-disputes` → green.

## 3. [x] Rewrite `reconcile-disputes-flow.spec.ts`

- **Gating test (A):** unchanged — verify it still passes («по проекту «RDF Open Gig»», «Результат не соответствует ТЗ», non-participant → `/disputes`).
- **Detail timeline + evidence test (B):** replace «Заморожено» with **«Открыт»**; replace «Хронология» with **«Ход рассмотрения»**; keep «Доказательства», «ТЗ.pdf», and the company entry text «Объём работ вырос относительно исходной задачи.».
- **Admin verdict test (C):** keep `getByText('В пользу специалиста').click()` (or `getByRole('button', …)`) as the submit; **remove** the `textarea[name="resolution"]` fill and the «Разрешить спор» click; keep `waitForURL('**/gigs/**')`; reopen and assert «Завершён» and `getByText(/В пользу специалиста — Спор разрешён в пользу специалиста\./).first()`.
- **Test plan:** `npm run test:e2e reconcile-disputes-flow` → green.

## 4. [x] Full green + plan update

- Run both files: `npm run test:e2e compose-disputes && npm run test:e2e reconcile-disputes-flow` → 0 failures (`npm run clean:test-db` first if pollution suspected).
- Grep both specs to confirm no «Споров нет», «Заморожено», «Хронология», `bg-surface-level-3`, `textarea[name="resolution"]`, or «Разрешить спор» remain; confirm «Открытых споров нет», «Открыт», «Ход рассмотрения», the verdict-button clicks, and the `getByText(/Открыть спор/)` gig-detail entry are present.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `e2e-disputes` (#13) in `openspec/planning/e2e-reconciliation.md` and bump progress 12/16 → 13/16.
- **Acceptance:** `npm run test:e2e compose-disputes` and `npm run test:e2e reconcile-disputes-flow` both report 0 failures.
