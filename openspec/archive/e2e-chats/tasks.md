# Tasks — e2e-chats

> **Status: COMPLETE.** Baseline confirmed all 4 old `compose-chats` tests failed (`getByRole('search')`/`searchbox`/«Найти», Bio header, gig-detail post-send). Rewrote `compose-chats.spec.ts` (5 tests: list / row-selection→`?gig` / thread+day-separator / composer-send→`/gigs`→read-back / live search) and `messaging-flow-e2e.spec.ts` (full client↔specialist flow moved to the `/chats` composer; DB assertions kept). Two mid-flight fixes: `getByText('2')` → `{ exact:true }` (substring hit "E2E" in the title), and the read-back bubble → `.last()` (the sent message is also the list preview). `npm run clean:test-db && npm run test:e2e compose-chats messaging-flow-e2e` → **6 passed**. No `app/`/`lib/` changes. Plan bumped 8/16 → 9/16.

> Run targeted: `npm run test:e2e compose-chats` and `npm run test:e2e messaging-flow-e2e` (server boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). If integration pollution is suspected, `npm run clean:test-db` first. Iterate with `-g "<title>"`.
>
> **Root cause this change fixes:** `compose-chats` asserts the removed kit `SearchPanel` (`role=search`/`searchbox`/«Найти» button) + the thread-header specialty `Backend-разработчик`; `messaging-flow-e2e` posts via `textarea[name="content"]` on `/gigs/[id]`. The rebuilt search is a live plain input, the design header shows name + presence only, and gig-detail no longer embeds chat — all messaging is at `/chats`.

## Reference — the real contract (`ChatsDesign.tsx` + view-models)

- **Two panes.** LEFT «Сообщения» list; RIGHT thread (or «Выберите чат, чтобы открыть переписку.» when no `?gig`).
- **Conversation list source — `getConversations`:** ONLY returns gigs with **≥1 message** (`messages.length > 0`). Each row: `name` (counterparty: client sees the specialist `displayName`; specialist sees the company name), `subtitle` = gig **title** (project), `preview` = last message (sliced to 50 + «…» if longer), `status` = `gigDisplayStatus(g.status)` (`IN_PROGRESS` → `in-progress` → badge **«В работе»** via `STATUS_LABEL_RU`), `unread` = messages from others after `Notification.lastReadAt`, `timestamp`.
- **Count badges collide on `1`:** the heading count badge = `conversations.length`; an unread badge = per-row unread. Seed **two** specialist messages so the client's unread badge reads **`2`** (unambiguous), conversation count stays `1`.
- **Row selection:** `onClick` → `router.push('/chats?gig=' + c.id)`.
- **Thread — `getChatThread`:** returns non-null for ANY participant (gig owner or assigned specialist) **even with zero messages** (no message-count gate) → the composer renders on direct `/chats?gig=<id>` navigation. Bubbles render `m.body`; a **day separator** renders `m.date` (= `longDate` = `toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' })`, e.g. «22 июня 2026 г.») when it differs from the previous bubble's date.
- **Header (RIGHT):** counterparty name + verified patch + presence «был(-а) недавно». It does **NOT** render `specialty` — drop any `Backend-разработчик` assertion.
- **Composer:** `<input name="content" aria-label="Сообщение" placeholder="Сообщение...">` → `getByRole('textbox', { name: 'Сообщение' })`; submit button `aria-label="Отправить"` → `getByLabel('Отправить')`; hidden `input[name="gigId"]` = selected gig.
- **`sendMessage` (UNCHANGED):** validates participant + assignment, creates the message, upserts the recipient notification, then `redirect('/gigs/<gigId>')`. Because rebuilt gig-detail no longer renders the thread, **read the bubble back by re-opening `/chats?gig=<id>`** (or assert via Prisma in messaging-flow).
- **Search:** live plain `<input placeholder="Поиск по названию или описанию">` filtering on `onChange` (`name + subtitle + preview`). No `role=search`, no `searchbox`, no «Найти» button. Empty result → «Чаты не найдены.».

## 1. [x] Baseline + capture the mismatches

- Run `npm run test:e2e compose-chats` and `npm run test:e2e messaging-flow-e2e`; record the failing selectors (expect `getByRole('search')`/`searchbox`/«Найти», `Backend-разработчик`, and the gig-detail `textarea[name="content"]` to fail).
- **Test plan:** baseline runs → note exact mismatches to replace in tasks 2–4.

## 2. [x] Rewrite `compose-chats.spec.ts` — seed + list + selection

- Keep the harness (`setE2ESession` + Prisma into `file:./test.db`). Seed: CLIENT «ООО Тест Чат», SPECIALIST `displayName` «Иван Спец», an `IN_PROGRESS` gig assigned to the specialist, and **two** messages from the specialist (e.g. «Здравствуйте! Готов приступить.» then a short last message < 50 chars so `preview` equals it).
- **List test** (`goto /chats`): assert `getByRole('heading', { name: 'Сообщения' })`, the counterparty «Иван Спец», the gig title (subtitle), the «В работе» badge, the unread badge `2` (`getByText('2')`), the last-message preview, and the search input `getByPlaceholder('Поиск по названию или описанию')`. REMOVE `getByRole('search')`.
- **Selection test** (`goto /chats`, click the row): click the conversation (e.g. the row containing «Иван Спец») → `await expect(page).toHaveURL(new RegExp('/chats\\?gig=' + gigId))` → composer `getByRole('textbox', { name: 'Сообщение' })` visible.
- **Test plan:** `npm run test:e2e compose-chats -g "inbox|selecting"` → green.

## 3. [x] Rewrite `compose-chats.spec.ts` — thread, composer send, live search

- **Thread test** (`goto /chats?gig=<id>`): assert both message bodies visible as bubbles (`.last()` to disambiguate from the list preview), the composer textbox + `getByLabel('Отправить')`, and the day separator. For the separator, compute the expected `longDate` in-test (`new Date().toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' })`) or assert a tolerant regex `/\d{1,2}\s+\S+\s+\d{4}\s*г\./`. DROP the `Backend-разработчик` assertion.
- **Send test** (`goto /chats?gig=<id>`): fill the composer with a unique message, click `getByLabel('Отправить')`, assert `await expect(page).toHaveURL(new RegExp('/gigs/' + gigId))` (the unchanged redirect), then `page.goto('/chats?gig=' + gigId)` and assert the new bubble is visible.
- **Search test** (`goto /chats`): `getByPlaceholder('Поиск по названию или описанию').fill('zzz несуществующий')` → `await expect(page.getByText('Иван Спец')).toHaveCount(0)` and `getByText('Чаты не найдены.')` visible. REMOVE the «Найти» button + `searchbox` usage.
- **Test plan:** `npm run test:e2e compose-chats` → all green.

## 4. [x] Rewrite `messaging-flow-e2e.spec.ts` — move the flow to `/chats`

- Keep the programmatic setup (`createTestUser`/`createTestGig`/`createTestApplication`, gig → `IN_PROGRESS` + `assignedSpecialistId`), the `DATABASE_URL`-based Prisma client, and the `afterEach`/`afterAll` cleanup.
- Replace every gig-detail UI step:
  - Auth as client (`createTestSession` cookie), `page.goto('/chats?gig=' + gig.id)`, fill `getByRole('textbox', { name: 'Сообщение' })`, click `getByLabel('Отправить')`. Assert `await expect(page).toHaveURL(new RegExp('/gigs/' + gig.id))`. Assert DB: 1 message, `senderId === client.id`.
  - Auth as specialist, `page.goto('/chats?gig=' + gig.id)`, assert the client's message bubble visible, fill + send the reply, assert redirect. Assert DB: 2 messages, `messages[1].senderId === specialist.id`.
  - Auth as client again, `page.goto('/chats?gig=' + gig.id)`, assert BOTH message bodies visible.
- Keep the chronological-ordering (step 6) and final-state (step 7) DB assertions verbatim — they are app-behaviour checks, unaffected by the UI move.
- Drop the hardcoded `http://localhost:3000/gigs/...` navigations and the `textarea[name="content"]` + `form.filter({ has })` button locators.
- **Test plan:** `npm run test:e2e messaging-flow-e2e` → green (1 test).

## 5. [x] Full green + plan update

- `npm run clean:test-db` then run both: `npm run test:e2e compose-chats` and `npm run test:e2e messaging-flow-e2e` → 0 failures.
- Grep both specs to confirm no `getByRole('search'`, no `searchbox`, no «Найти», no `Backend-разработчик`, and no gig-detail `textarea[name="content"]` remain; confirm the composer `getByRole('textbox', { name: 'Сообщение' })` + `getByLabel('Отправить')` are present.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `e2e-chats` in `openspec/planning/e2e-reconciliation.md` and bump progress 8/16 → 9/16.
- **Acceptance:** both `npm run test:e2e compose-chats` and `npm run test:e2e messaging-flow-e2e` report 0 failures.

