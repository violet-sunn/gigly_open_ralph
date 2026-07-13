# Tasks — chat-realtime

> Goal: optimistic send + live delta-polling for `/chats`, **no new dependency, no external service**, behind a swappable `useThread` / `getMessagesSince` seam. Preserve the gig-scoped model, the **after-gig-start** gate, and every `sendMessage` guard. Presence/typing/receipts deferred. Reference: architecture map (2026-06-30); current send = `sendMessage` → `redirect('/chats?gig=<id>')` in `app/actions/gig.ts`.

## 1. Backend — shared core + the two new actions

- [x] **Extract `persistMessage(session, gigId, contentRaw)` core** from the current `sendMessage` (`app/actions/gig.ts`): auth already done by caller; rate-limit (`messageRateLimiter`, 30/hr), `sanitizeInput`, length (≤2000) + non-empty validation, the gig gates (exists, not `closedByAdmin`, not `PAID`, has `assignedSpecialistId`, actor ∈ {owner, assigned}), `prisma.message.create`, and the recipient `Notification` upsert. Returns the created `Message` (or a typed error). No behavior change vs today.
  - Test (`messaging.test.ts`): existing send assertions still pass against the refactor (guards, persistence, notification upsert) — no weakened assertions.
- [x] **Refactor `sendMessage(prevState, formData)`** to call `persistMessage` then keep its `redirect(redirectTo || '/gigs/${gigId}')` (same-origin guard intact). Signature + behavior unchanged (gig-detail → `/gigs/[id]`, no-JS `/chats` → `/chats?gig=<id>`).
- [x] **Add `sendMessageLive(gigId, content)`** — calls `getSession` + `persistMessage`, returns `{ message: MessageBubbleVM }` (mapped via the shared per-message mapper) on success or `{ error }` on failure. **No redirect.** Same gate as `sendMessage`.
  - Test (`messaging.test.ts`): returns the echo bubble (direction `out` for sender), persists the row, upserts the recipient notification; rejects non-participant / pre-assignment / closed / paid / over-length / rate-limited identically to `sendMessage`.
- [x] **Add `getMessagesSince(gigId, afterIso)`** (`app/actions/messaging.ts` or alongside `getChatThread`) — auth + the **same participant gate as `getChatThread`** (return `[]`/refuse if gig missing, no assigned specialist, or caller not a participant); query `messages` where `createdAt > new Date(afterIso)`, ordered asc, **capped** (e.g. 200) ; map to `MessageBubbleVM` (reuse the `getChatThread` per-message mapper — extract it in `lib/view-models.ts` if needed).
  - Test (`chats-vm.test.ts`): returns only messages strictly newer than `afterIso`; empty when none; enforces the participant + start gate; ordering ascending.

## 2. Client seam — the `useThread` hook

- [x] **Create `app/(protected)/chats/useThread.ts`** (client). Input: `gigId` (or null), `initialThread` (the server-rendered `ChatThreadVM`). State: the message list. Responsibilities:
  - **Optimistic add:** `send(content)` pushes a bubble with a temp id (`tmp-…`) + pending flag, calls `sendMessageLive`, then **reconciles** (replace temp with the returned message; on error, mark the temp bubble failed + surface the message).
  - **Delta poll:** every ~3s call `getMessagesSince(gigId, lastCreatedAtIso)`; append only ids not already present (dedupe set); advance the cursor to the newest `createdAt`. Cursor seeded from `initialThread`.
  - **Visibility pause:** no polling while `document.hidden`; resume + immediate catch-up poll on `visibilitychange`/focus. **No interval when `gigId` is null.**
  - **Backoff:** on a failed poll, skip a beat (simple linear backoff) and keep going; never tight-loop.
  - Returns `{ messages, send, sending, error }`.
  - Test: covered via E2E (below) + a light unit test of dedupe/cursor logic if practical.

## 3. Wire `ChatsDesign` to the hook

- [x] **`ChatsDesign.tsx`** — render the thread from `useThread(selectedGigId, thread)` state instead of the static `thread.chat.thread` prop. Composer: on submit (JS) → `preventDefault` → `useThread.send(content)` (optimistic), clear the input; keep the `<form action={sendMessage}>` with hidden `gigId`/`redirectTo` as the **no-JS fallback** (progressive enhancement). Preserve the existing markup/design (no visual change), the ✓✓ treatment, day separators, paperclip glyph, and client-side list search.
- [x] **Conversation list freshness (light):** refresh the left list on window focus / visibility regain (re-fetch `getConversations` or `router.refresh()`), **no timer**. (Live list updates beyond focus are out of scope.)
- [x] Confirm the **gig-detail composer** path is untouched (still `sendMessage` → `/gigs/[id]`).

## 4. Tests

- [x] **Integration** — `messaging.test.ts` (+`sendMessageLive` echo/guards), `chats-vm.test.ts` (+`getMessagesSince` newer-only/gate/order). All existing messaging assertions stay green.
- [x] **E2E `compose-chats.spec.ts`** — optimistic: after send the bubble appears with **no URL navigation** (still `/chats?gig=<id>`) and before any reload; reconciles (exactly one bubble, not two). **+ disappearing-message regression** (`optimistic bubbles never vanish`): a 4-message burst straddling poll cycles must leave every message on-screen exactly once. This guards the fix for the reported "message disappears until reload" bug — root cause was mutating `idsRef`/`cursorRef` *inside* `setMessages` updaters, which React Strict Mode (dev) double-invokes/discards, desyncing the id set from the committed list so reconcile dropped the optimistic bubble. Fixed by making every updater PURE (dedupe against `prev`; poll cursor derived from a mirror ref read outside updaters).
- [x] **E2E live receive (two contexts)** — `messaging-flow-e2e.spec.ts`: two browser contexts (owner + assigned specialist) both on `/chats?gig=<id>`; one sends; assert the other’s thread shows the bubble **within the poll interval without reload** (use `expect(...).toBeVisible({ timeout })`).
- [x] **E2E no-JS fallback** — with JS disabled (or via the raw form post), sending still lands on `/chats?gig=<id>` with the new bubble (progressive enhancement preserved).
- [x] **Gate regression** — assert `getMessagesSince`/`sendMessageLive` refuse a non-participant and a pre-assignment/closed/paid gig (mirrors existing `getChatThread`/`sendMessage` tests).

## 5. Gate

- [x] `npm run build` — exit 0.
- [x] Integration green: messaging + chats-vm (incl. new actions) + full `vitest run`.
- [x] E2E green: `compose-chats` + `messaging-flow-e2e` (optimistic, cross-context live receive, no-JS fallback).
- [x] **No new runtime dependency** added to `package.json` (assert: polling only, no realtime lib).
- [x] Human-in-the-loop: owner confirmed the live thread + polish on 2026-07-03. Follow-up fixes folded in: (1) disappearing-message bug — pure `setMessages` updaters (Strict-Mode ref-desync); (2) scroll containment — bounded-height pane + styled inset scrollbar + bottom-pinned short threads + auto-scroll; (3) finished-gig read-only — `COMPLETED`/`PAID` gate + `composer.canSend` notice.

## Test plan summary

- **Build:** `npm run build` exit 0.
- **Integration:** `getMessagesSince` (newer-only, participant + start gate, order), `sendMessageLive` (echo + guards), shared core keeps `sendMessage` behavior.
- **E2E:** optimistic bubble (no navigation), two-context live receive within the interval, no-JS fallback, gate rejections.
- **Manual:** two windows / both roles; verify live both ways, optimistic feel, idle/hidden pause; confirm no new dependency.

## Deferred (explicitly out of scope)

- SSE / managed-bus transport (the documented upgrade behind the `useThread` seam — build when the deploy target is known to be a persistent process or a bus is justified).
- Presence, typing indicators, read-receipts.
- A `Conversation` model / DMs / pre-assignment chat (chat stays gig-scoped and after-gig-start).
- Email notifications (tracked separately under `notification-preferences`).
