# chat-realtime

**Context:** Architecture review of the messaging subsystem (2026-06-30). Chat today is a pure request-response design: a `<form action={sendMessage}>` writes the row and **`redirect('/chats?gig=<id>')`**, which re-runs the server component and re-queries SQLite. That is how even the *sender's own* bubble appears — a full page navigation per message. The counterparty sees nothing until they reload; there is no realtime layer, no SSE/WebSocket, and no polling anywhere in the app. This change brings chat up to a modern bar **without adding infrastructure or external dependencies**, and lays a seam so a richer transport can drop in later with no UI change.

## Why

- **The send path is janky.** A navigation cycle per message is the actually-awkward part of the current UX. Optimistic send removes it.
- **Receive is dead.** The other party is blind until they manually reload — unacceptable for a chat surface.
- **But we must stay lean.** Target is MVP-production in ~2 weeks; the solution must be solid, stable, **free, and free of side-dependencies** (no Pusher/Ably/Supabase, no self-hosted WebSocket server), and must not be a dead-end. Polling behind a clean seam meets all of that and works on any deploy target (serverless or a single process).

## What

**A two-part change, both in app code, no new runtime dependency:**

1. **Optimistic send.** The `/chats` composer adds the message to the thread immediately with a temporary id, then persists it and reconciles with the server echo. No navigation flash. (The no-JS path still works — see below.)

2. **Live receive via delta polling, behind a swappable seam.** The open thread subscribes through a single client hook **`useThread(gigId, initialThread)`** that polls a new server action **`getMessagesSince(gigId, afterIso)`** (~3s), fetching only messages newer than the last one held, deduping by id. Polling **pauses when the tab is hidden** (Page Visibility API) and resumes on focus. The counterparty's messages appear within one interval.

**The seam is the point.** The UI talks only to `useThread`; the receive contract is only `getMessagesSince`. Today the hook polls. Tomorrow the *same hook* can open an `EventSource` (SSE) or subscribe to a managed bus — polling, SSE, and managed all implement the same contract behind the hook, with **zero UI change**. This is the upgrade-safe foundation, not a throwaway.

**Backend shape (preserve all existing guards):**
- Extract the message-write core (`persistMessage`) — auth, rate-limit (30/hr), sanitize, validate (≤2000, non-empty), participant/assignment/closed/paid gates, `Notification` upsert — used by both send paths so nothing is duplicated or weakened.
- `sendMessage` (form action) keeps its current signature **and its `redirect(redirectTo)`** — this preserves the gig-detail composer (→ `/gigs/[id]`) and the no-JS `/chats` fallback (→ `/chats?gig=<id>`).
- New `sendMessageLive(gigId, content)` calls the shared core and **returns the created message** (no redirect) — used by the `useThread` hook for the optimistic path.
- New `getMessagesSince(gigId, afterIso)` applies the same participant gate as `getChatThread`, returns bubbles with `createdAt > afterIso` (ordered asc, capped), mapped to the existing `MessageBubbleVM`.

## Constraints / Non-goals

- **Chat still starts only after the gig has started (owner decision, unchanged).** The existing gate stays exactly: a thread/compose requires the gig to have an **assigned specialist**, not be `closedByAdmin`, not be `PAID`, and the actor to be a participant (owner or assigned specialist). **No pre-assignment / applicant chat** is introduced. `getMessagesSince`/`sendMessageLive` enforce the same gate as `getChatThread`/`sendMessage`.
- **Conversation stays gig-scoped.** No `Conversation` model, no per-message `readAt`. A conversation == a Gig (the right marketplace model: every chat tied to a billable engagement, supports disputes/escrow, discourages off-platform leakage). DMs/off-gig threads are explicitly out.
- **No new dependencies, no external service, no WebSocket/SSE *in this change*.** Polling only. SSE/managed is the documented future upgrade behind the seam, not built now.
- **No presence / typing indicators / read-receipts.** Deferred (the gimmicky tier). Unread continues to use the existing `Notification.lastReadAt` mechanism, untouched.
- **`sendMessage` semantics preserved.** Same auth/rate-limit/sanitize/validate/notification behavior; the gig-detail redirect path is unchanged.
- **Polling cadence is bounded and idle-cheap:** open thread only, ~3s, paused when hidden, simple error backoff; the conversation list may refresh on focus (no timer). No background timers when no thread is open.
- Desktop-only; both themes via existing tokens. The `/chats` markup/design is already reconciled — this change is behavior, not a visual rework.

## Impact

- **New:** `app/actions/messaging.ts` (or extend `app/actions/gig.ts`) — `sendMessageLive`, `getMessagesSince`, shared `persistMessage` core; `app/(protected)/chats/useThread.ts` (client hook: optimistic state + delta poll + visibility pause + id-dedupe).
- **Modified:** `app/(protected)/chats/ChatsDesign.tsx` — thread renders from `useThread` state; composer does optimistic submit with a no-JS form fallback. `app/actions/gig.ts` — `sendMessage` refactored to call the shared core (behavior unchanged). `lib/view-models.ts` — reuse the `MessageBubbleVM` mapper for `getMessagesSince` (extract the per-message mapper from `getChatThread` if helpful).
- **Unchanged:** `Message` schema, the `Notification.lastReadAt` unread mechanism, the gig-detail send path, the conversation-start gate.
- **Tests:** integration for `getMessagesSince` (returns only newer, enforces participant + start gate) and `sendMessageLive` (returns echo, persists, guards intact); E2E for optimistic bubble (no navigation), cross-context live receive within the poll interval, and the no-JS form fallback still landing on `/chats?gig`. Build + full suite green.
