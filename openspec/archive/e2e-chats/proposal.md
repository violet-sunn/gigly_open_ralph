# e2e-chats

## Why

Reconciliation change #9 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). Messaging was rebuilt on the `gigly_full_design` prototype as a dedicated two-pane inbox at `/chats` (`app/(protected)/chats/ChatsDesign.tsx`): a LEFT «Сообщения» conversation list (avatar + counterparty + gig-status badge + unread + project subtitle + time + 2-line preview + live search) and a RIGHT thread (counterparty header + day-separated bubbles + composer). It is wired to the **unchanged** `sendMessage`, `getConversations`, and `getChatThread`. Crucially, the rebuilt gig-detail (`GigDetail.tsx`) **no longer embeds a chat** — the old `textarea[name="content"]` on `/gigs/[id]` is gone; messaging now lives only at `/chats`.

Both messaging specs assert the old DOM and would fail:

- **`compose-chats.spec.ts`** targets the removed kit `SearchPanel`: `getByRole('search')`, `getByRole('searchbox')`, and a «Найти» submit `button` — but the rebuilt search is a live-filtering plain `<input placeholder="Поиск по названию или описанию">` (no `role=search`, no submit button, filters on `onChange`). It also asserts `getByText('Backend-разработчик')` in the thread header, but `ChatsDesign`'s header renders only the counterparty **name + verified patch + presence** («был(-а) недавно») — it does **not** render the specialist `specialty` the view-model computes.
- **`messaging-flow-e2e.spec.ts`** drives the whole client↔specialist flow through `textarea[name="content"]` on `/gigs/[id]` — that control no longer exists on gig-detail. The flow must move to the `/chats` composer (`input[name="content"]`, `aria-label="Сообщение"`); `sendMessage` itself is unchanged (it still validates participant/assignment and `redirect`s to `/gigs/[id]`).

This change rewrites both specs to the rebuilt `/chats` two-pane against the **stable contract** the PRD pins: the composer `input[name="content"]` (aria-label «Сообщение») + send button (aria-label «Отправить»), the hidden `input[name="gigId"]`, and the unchanged `sendMessage` redirect to `/gigs/[id]`. Because gig-detail no longer renders the thread, the post-send assertion reads the bubble back by re-opening `/chats?gig=<id>` (and the DB checks in messaging-flow stay as the source of truth).

## What Changes

- **REWRITE `compose-chats.spec.ts`** against `ChatsDesign.tsx` (no behavioural/app change). Seed a CLIENT + assigned SPECIALIST («Иван Спец») + an `IN_PROGRESS` gig + **two** messages from the specialist (so the client's unread count is `2`, distinct from the conversation-count badge `1`). Cover:
  - **Conversation list:** the «Сообщения» heading, the counterparty name, the project subtitle (gig title), the 2-line preview (last message), the gig-status badge «В работе» (`IN_PROGRESS` → `in-progress`), and the unread badge `2`.
  - **Row selection → URL:** clicking a conversation row navigates to `/chats?gig=<gigId>` and opens the thread (composer visible).
  - **Thread + composer:** the day separator (`longDate`, e.g. «22 июня 2026 г.»), the message bubbles (both seeded bodies), the composer `getByRole('textbox', { name: 'Сообщение' })`, and the send button `getByLabel('Отправить')`. **Drop** the removed `Backend-разработчик` header assertion.
  - **Send via the composer:** fill + send → `sendMessage` redirects to `/gigs/<id>` (assert URL); re-open `/chats?gig=<id>` and assert the new bubble is visible (read-back through the real thread).
  - **Live search:** typing a non-matching query into `getByPlaceholder('Поиск по названию или описанию')` filters the list live (no «Найти» button) → the counterparty disappears and «Чаты не найдены.» shows.
- **REWRITE `messaging-flow-e2e.spec.ts`** to drive every UI messaging step through `/chats` instead of gig-detail (programmatic setup + DB assertions unchanged):
  - Keep the programmatic setup (CLIENT, OPEN gig, SPECIALIST, ACCEPTED application, gig → `IN_PROGRESS` + assigned) and the `afterEach` cleanup.
  - Client sends the **first** message at `/chats?gig=<id>` (the composer renders because `getChatThread` returns a thread for a participant even with zero messages) via the composer textbox + «Отправить»; assert `sendMessage` redirected to `/gigs/<id>` and the DB has 1 message from the client.
  - Specialist views + replies at `/chats?gig=<id>`; client views both at `/chats?gig=<id>`. Keep the chronological-ordering + final-state DB assertions verbatim.
- Reuse the existing harness (`setE2ESession` / `createTestSession` + direct Prisma seeding into `file:./test.db`).

## Impact

- **Affected:** `__tests__/e2e/compose-chats.spec.ts` and `__tests__/e2e/messaging-flow-e2e.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`ChatsDesign.tsx`, `sendMessage`, `getConversations`/`getChatThread`, `GigDetail.tsx`); the unit/integration suite (951/951 — must stay green); the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 8/16 → 9/16.
