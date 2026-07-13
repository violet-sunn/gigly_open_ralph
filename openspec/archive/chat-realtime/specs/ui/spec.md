# UI spec delta — chat-realtime

Brings the `/chats` thread to a modern bar — optimistic send + live delta-polling — without new infrastructure or dependencies, behind a swappable client seam. Preserves the gig-scoped model, the after-gig-start gate, and all `sendMessage` guards.

## MODIFIED Requirements

### Requirement: Chats Reconciled And Stays In /chats After Send

`app/(protected)/chats/ChatsDesign.tsx` MUST match `design-reference/screens/chats.{specialist,company}` for the dialog list and the active thread, and sending a message MUST keep the user on `/chats`. Sending MUST be **optimistic**: with JS, the new message appears in the thread immediately (temporary id) without a page navigation, then persists and reconciles with the server echo (deduped by id). The legacy form-action path (`sendMessage` → `redirect(redirectTo)`) MUST remain as a no-JS progressive-enhancement fallback (landing on `/chats?gig=<id>`), and the gig-detail composer MUST still redirect to `/gigs/[id]`.

#### Scenario: Dialog list, search, and thread match
- **GIVEN** `/chats` with one or more conversations
- **THEN** the left pane MUST show «Сообщения» + count, the live client-side search, and per-conversation rows (counterparty / status / unread / subtitle / timestamp / 2-line preview) with the active row in the accent tint `rgba(0,136,255,0.08)`
- **AND** the active thread MUST show the counterparty header, day-separated bubbles with the outgoing/read ✓✓ treatment, and the composer (with the leading paperclip glyph)
- **AND** typing in the search field MUST filter the list client-side, restoring the full list when cleared

#### Scenario: Optimistic send keeps the user in the conversation
- **WHEN** the user sends a message from `/chats` via Enter or the send button (JS enabled)
- **THEN** the new bubble MUST appear in the thread immediately with no page navigation, `sendMessage`/`sendMessageLive` MUST persist it, and the optimistic bubble MUST reconcile to the persisted message (no duplicate)
- **AND** with JS disabled, the form action MUST still persist and leave the user on `/chats?gig=<id>` with the new bubble shown
- **AND** sending from the gig-detail screen MUST still redirect to `/gigs/[id]` (opt-in via the additive same-origin `redirectTo`)

## ADDED Requirements

### Requirement: Chat Thread Updates Live Via Delta Polling Behind A Swappable Seam

The open `/chats` thread MUST update with the counterparty's new messages **without a manual reload**. The client MUST subscribe through a single hook `useThread(gigId, initialThread)`; the receive contract MUST be the single server action `getMessagesSince(gigId, afterIso)`, which returns only messages newer than the supplied timestamp. The hook MUST poll on a bounded interval (≈3s) for the open thread only, fetch deltas (not the whole thread), dedupe by message id, **pause polling when the document is hidden** (Page Visibility API) and resume on focus, and run **no timer when no thread is open**. The transport MUST be encapsulated so that replacing polling with SSE or a managed bus later requires changing only the hook's internals and `getMessagesSince`’s producer — **no change to `ChatsDesign` or the message VM**.

#### Scenario: Counterparty message appears without reload
- **GIVEN** two participants of a started gig each viewing `/chats?gig=<id>`
- **WHEN** one sends a message
- **THEN** the other’s thread MUST show the new bubble within one poll interval, without any navigation or manual reload

#### Scenario: Delta fetch and dedupe
- **WHEN** the thread polls `getMessagesSince(gigId, afterIso)`
- **THEN** it MUST return only messages with `createdAt` after `afterIso` (ordered ascending, capped), and the hook MUST append only ids not already present (an optimistic bubble already reconciled MUST NOT duplicate)

#### Scenario: Idle and hidden are cheap
- **WHEN** the browser tab is hidden, or no conversation is selected
- **THEN** the thread MUST NOT poll (it resumes on focus / on selecting a conversation)

### Requirement: Chat Remains Gig-Scoped, Starts Only After Gig Start, And Is Read-Only Once Finished

The realtime change MUST NOT alter when a chat may start or its scope. A conversation MUST remain a Gig (no `Conversation` model, no per-message `readAt`). Messaging is permitted only during the **active window** of the engagement: the gig MUST have an **assigned specialist**, MUST NOT be `closedByAdmin`, and MUST be in an active status (`OPEN`…`REVIEW`) — the **terminal states `COMPLETED` and `PAID` are read-only** (the thread shows history but composing is refused). The actor MUST be a participant (gig owner or assigned specialist). `persistMessage` (shared by `sendMessage` + `sendMessageLive`) MUST enforce this gate; `getChatThread` MUST surface it as `composer.canSend` (+ a `closedReason`) so the UI hides the composer and shows a read-only notice instead of a control that would error on submit. No pre-assignment chat.

#### Scenario: Non-participant, pre-assignment, and finished gigs are refused
- **WHEN** a non-participant calls `getMessagesSince`/`sendMessageLive`, or any actor targets a gig with no assigned specialist, a `closedByAdmin` gig, or a **`COMPLETED`/`PAID`** gig
- **THEN** the write MUST be refused (no message created), identically for both send paths

#### Scenario: A finished conversation is read-only in the UI
- **WHEN** a participant opens a `COMPLETED`/`PAID` (or admin-closed) conversation
- **THEN** the message history MUST render, but the composer MUST be replaced by a read-only notice («…только для просмотра») — no text input, no send button — reflecting `composer.canSend === false`

### Requirement: Send Guards Are Preserved By A Shared Core

The message-write guards MUST be shared by both send paths via a single core (`persistMessage`): authentication, rate limiting (30/hour/user), input sanitization, length validation (≤2000, non-empty after trim), the participant/assignment/closed/paid gates, and the `Notification` upsert. `sendMessageLive` MUST apply the identical core and return the created message; `sendMessage` MUST apply the identical core and keep its `redirect(redirectTo)` semantics. No guard may be weakened or duplicated.

#### Scenario: Both paths enforce the same rules
- **WHEN** a message is sent via the optimistic path (`sendMessageLive`) or the form path (`sendMessage`)
- **THEN** both MUST enforce the same auth, rate-limit, sanitize, validation, and gating, and both MUST upsert the recipient’s unread `Notification`

### Requirement: Chat Realtime Keeps The Suite Green

`npm run build` MUST exit 0 and the messaging suites MUST pass — `messaging` / `chats-vm` integration extended for `getMessagesSince` + `sendMessageLive`, and `compose-chats` / `messaging-flow-e2e` updated for the optimistic + live behavior — with no weakened assertions and no new runtime dependency added to `package.json`.

#### Scenario: Build, tests, and no new dependency
- **WHEN** `npm run build` and the messaging integration + E2E specs run
- **THEN** they MUST pass (build exit 0), covering optimistic send, cross-context live receive, the no-JS fallback, and the preserved gates — and `package.json` MUST gain no realtime/runtime dependency
