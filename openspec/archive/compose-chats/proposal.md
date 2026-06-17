# Change Proposal: compose-chats

> Phase 2, change 24 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It builds
> the **new `/chats`** screen, composed from kit blocks — within the `AppShell` the shell-cutover put in the protected
> layout — as an **inbox + thread** over the existing gig-scoped `Message` model: a conversation list
> (`ConversationItem·list` + search) beside the selected conversation's `MessageBubble·thread` + composer, with **unread
> derived from `Notification.lastReadAt`** and the sidebar **«Чаты»** count wired to it. Depends on:
> compose-shell-cutover, domain-blocks (both complete). Friction: **medium**.
>
> **Fidelity gate.** F3 (logical parity — the mock's IA: conversation list + thread + composer), F5 (composition
> purity), the inbox/thread/send flows, and E2E are enforced now. The **F1 ≤1% pixel-diff** vs `specialist-chats` stays
> deferred — dominated by the **substitute font** + avatar rasters — as recorded for the prior compose-* changes. The
> actual-vs-reference diff + overlay artifacts are produced.

## Problem Statement

Gig-scoped messaging exists and works — `Message` (gigId, senderId, content), `sendMessage` (`app/actions/gig.ts`),
`markNotificationAsRead` + `Notification.lastReadAt` (`app/actions/notification.ts`), and `getRecentMessages`
(`app/actions/message.ts`) — and the gig-detail screen (compose-gig-detail-apply) already renders a per-gig `ChatPanel`.
But **there is no `/chats` inbox**: a user can only reach a conversation by navigating to its gig. The redesign's
`specialist-chats` screen is a dedicated inbox: `AppShell + ConversationItem·list + Search + MessageBubble·thread +
Composer`.

- **No `/chats` route exists** (`app/(protected)/chats/` is absent). The sidebar already links «Чаты» → `/chats` (per
  F3 logical parity, from compose-shell-cutover) but the target 404s — this change delivers it.
- **The blocks exist** (domain-blocks: `ConversationItem` {read, unread}, `MessageBubble` {in/out + receipts},
  `ChatPanel` thread + composer, `MessagesPanel` ConversationItem·list) and the data exists (the `Message` model +
  `Notification.lastReadAt`), but **nothing assembles them into the inbox**: no mapper turns the user's gigs-with-
  messages into a conversation list, and no mapper turns a selected gig's messages into the thread VM.
- **The sidebar «Чаты» count is a rough proxy.** The protected layout currently feeds the nav `chats` count from
  `prisma.notification.count({ where: { userId, lastReadAt: null } })` — a notification-record count, not a count of
  conversations with genuinely-unread messages. This change wires it to a real unread-conversation count derived from
  `Notification.lastReadAt` (the same rule the inbox uses), so the badge matches the inbox.
- **The thread needs date separators + a header** the mock shows («1 апреля 2026 г.» day separators; a thread header =
  counterparty + verified + rating + presence «был(-а) недавно»). The current `ChatPanel` renders a flat thread +
  composer with **no date grouping and no header** — small additive gap-fills, exactly as `GigHeader`/`Notice`/
  `ProfileHeader` were for prior screens.

The planning doc maps this exactly: compose `/chats` from those blocks over the `Message` model, unread via
`Notification.lastReadAt`, wire the sidebar «Чаты» count, **keep per-gig messaging intact**. This change adds the inbox
as a thin composition over the existing messaging primitives without changing any messaging semantics.

## Proposed Solution

Add the `/chats` route as a composition-pure screen with a server-rendered, URL-selected conversation, two contract-
typed mappers, two small additive block gap-fills, the sidebar-count wiring, and verification. Six deliverable groups:

1. **`ChatHeader` block (gap fill)** — `app/components/blocks/ChatHeader.tsx` (+ additive `ChatHeaderVM` + fixture +
   barrel export): the thread header — `Avatar` + counterparty name + verified + `Rating` + presence text («был(-а)
   недавно») — composed from primitives + layout + tokens. Token-pure.

2. **`ChatPanel` additive enhancements** — date separators (a token-styled day separator inserted when the day changes
   between consecutive bubbles, driven by an additive `date?: DateISO` on `MessageBubbleVM`) + an optional `header?:
   ChatHeaderVM` slot rendered above the thread. Additive + backward-compatible (existing callers — the gig-detail
   `ChatPanel` — render unchanged when `date`/`header` are absent). `ConversationItem` gains an optional additive
   `subtitle?` (the gig title, shown under the name per the mock).

3. **Two mappers (`lib/view-models.ts`, server-only, contract-typed)**:
   - `getConversations(viewer)` → `ConversationItemVM[]`: for each gig the viewer participates in (CLIENT: own gigs
     with an assigned specialist; SPECIALIST: assigned gigs) that has ≥1 message — `{ id: gigId, avatar, name
     (counterparty companyName/displayName/email), subtitle: gigTitle, preview (last message, truncated), timestamp
     (last message time), unread (count of messages from **others** created after the viewer's
     `Notification.lastReadAt` for that gig — the `getUnreadNotifications` rule) }`, sorted by last-message desc.
   - `getChatThread(gigId, viewer)` → `{ header: ChatHeaderVM; chat: ChatPanelVM } | null`: authorization (viewer is
     gig owner or assigned specialist, else `null`); the gig's messages → `MessageBubbleVM[]` (`direction` from
     `senderId === viewer.userId`, `timestamp`, `date` for separators, `readState`), composer `{ canAttach: false }`;
     `header` = the counterparty (name + avatar + verified/rating via `getRatingForUser` + presence). `import type` the
     VMs.

4. **`Chats` composed screen (`app/(protected)/chats/Chats.tsx`, `@composed-screen`)** — props = `{ conversations,
   thread, selectedGigId }`. Composes, via **layout primitives only** (Section/Split/Stack — no `className`/`style`):
   left = `Section` «Сообщения» + a search (`SearchPanel`/`SearchInput`) + `ConversationItem·list` (each opens
   `/chats?gig=<id>`); right = the selected conversation's `ChatHeader` + `ChatPanel` (thread + composer wired to
   `sendMessage` via `useActionState` + `<form action>` with a hidden `gigId`), or an empty-state `Notice` when no
   conversation is selected. Search filters the list client-side. Client (selection nav + search + the send form).

5. **Thin server page + sidebar-count wiring** — `app/(protected)/chats/page.tsx` (server): `getSession` + no-session
   redirect; `getConversations(viewer)`; if `?gig=<id>` is present, `getChatThread(id, viewer)` and (when authorized)
   `markNotificationAsRead(id)` so opening a conversation clears its unread; render `<Chats …>`. **Sidebar count**:
   replace the layout's `notification.count({ lastReadAt: null })` for the nav `chats` slot with a real unread-
   conversation count (`getUnreadChatCount(userId)` — gigs with messages from others after `lastReadAt`), so the badge
   matches the inbox. (The Topbar notification bell is unchanged.)

6. **Tests + fidelity** — unit tests for `getConversations` (list + unread per role + ordering) and `getChatThread`
   (thread direction/date/receipts + header + authorization `null`). E2E (`compose-chats.spec.ts`): the inbox lists a
   seeded conversation; opening it renders the thread + marks it read (the unread badge clears); sending a message
   (`sendMessage`) appends it; search filters the list; **per-gig messaging in the gig-detail screen still works**.
   `lint:composition` (F5) on `Chats`; F3 parity. The F1 actual-vs-`specialist-chats` diff is **produced** with ≤1%
   **deferred** (font + avatars).

This change emits **the `ChatHeader` block + the `ChatPanel`/`ConversationItem` additive enhancements + the two mappers
+ the `Chats` composition + the new `/chats` page + the sidebar-count wiring + tests only**. It does **not** add a data
model, change `sendMessage`/`markNotificationAsRead` semantics, or alter the gig-detail per-gig messaging.

## Constraints

### MUST Requirements
- The `/chats` body MUST be composed from blocks (`ConversationItem·list` + a search + `ChatHeader` + `ChatPanel` with
  `MessageBubble·thread` + composer) inside the layout's `AppShell`, as a composition-pure screen (F5): `Chats` MUST
  carry `@composed-screen`, import only kit/`lib`/`actions`/`react`/`next`, and contain **no** `className`/`style`/raw
  styled markup.
- The inbox MUST bind **real** data via `getConversations` (one conversation per the viewer's gigs-with-messages — name/
  subtitle/preview/timestamp/unread) and the thread via `getChatThread` (the selected gig's messages → in/out
  `MessageBubble`s with timestamps + read receipts + **date separators**, plus the counterparty `ChatHeader`).
- Unread MUST be derived from `Notification.lastReadAt` (messages from others created after the viewer's `lastReadAt`
  for that gig); opening a conversation MUST `markNotificationAsRead(gigId)` so its unread clears; the sidebar «Чаты»
  count MUST reflect the same unread-conversation count.
- Sending MUST wire the **existing** `sendMessage` action directly (`@/app/actions/gig`) via `useActionState` + `<form
  action>` with a hidden `gigId`; messaging **semantics** (authorization, gating on assignment/closed, validation) MUST
  be unchanged.
- `getChatThread` MUST authorize the viewer (gig owner or assigned specialist) and return `null` otherwise; the page
  MUST render the inbox with an empty/zero-state when there are no conversations or none is selected.
- **Per-gig messaging MUST stay intact** — the gig-detail `ChatPanel` (compose-gig-detail-apply) MUST keep working; the
  `ChatPanel`/`ConversationItem`/`MessageBubbleVM` changes MUST be **additive** (existing callers unaffected).
- `npm run build`, `npm run test:unit`, the chats E2E, `npm run lint:composition`, and `npm run lint:tokens` MUST be
  green; the existing messaging integration tests MUST stay green.

### SHOULD Requirements
- The mappers SHOULD live in `lib/view-models.ts` (server-only, `import type` the VMs) and reuse `getRatingForUser` +
  the `Notification.lastReadAt` rule from `getUnreadNotifications`; conversation selection SHOULD be URL-driven
  (`/chats?gig=<id>`) so the thread is server-rendered + bookmarkable (the `getGigSearch` pagination pattern).
- `Chats` SHOULD be the only `'use client'` addition (selection nav + search filter + the send form); the search SHOULD
  filter the conversation list by name/subtitle/preview.
- The `ChatPanel` date separators + optional header and the `ConversationItem` subtitle SHOULD be additive props with
  safe defaults (absent → the block renders exactly as today).

### Non-Goals
- **No new data model** (a conversation is a gig with messages; no `Conversation`/`Thread` table); **no real-time/
  websocket/polling** (server-rendered on navigation, like the rest of the app); **no `sendMessage`/
  `markNotificationAsRead` semantics change**; **no gig-detail messaging change** (per-gig `ChatPanel` untouched);
  **no read-receipt model change** (receipts shown are the existing `readState`/`lastReadAt` signals).
- **F1 ≤1% enforcement is deferred** — the diff is produced for review, but ≤1%-vs-`specialist-chats` is reached only
  once the **SF Compact font is licensed** (and avatar rasters exported). F3/F5/functional/E2E are the enforced
  acceptance.

## Success Criteria

1. `/chats` body composes `ConversationItem·list` + search + `ChatHeader` + `ChatPanel` (thread + composer) as an F5-pure `@composed-screen`, rendered by a thin server page.
2. Real data bound via `getConversations` (per-gig conversations + unread) and `getChatThread` (thread with date separators + receipts + header; `null` for unauthorized).
3. Unread derived from `Notification.lastReadAt`; opening a conversation marks it read; the sidebar «Чаты» count reflects the unread-conversation count.
4. Send wired to the existing `sendMessage`; messaging semantics unchanged; per-gig (gig-detail) messaging still works; the block changes are additive.
5. `build`, `test:unit` (existing messaging tests green), chats E2E, `lint:composition`, `lint:tokens` all green; F1 diff produced (≤1% deferred to font + avatars).

## Affected Areas

- `app/(protected)/chats/page.tsx` (new — thin server page: `getConversations` + optional `getChatThread` + `markNotificationAsRead` + `<Chats>`)
- `app/(protected)/chats/Chats.tsx` (new — `'use client'` `@composed-screen`; wires `sendMessage`)
- `app/(protected)/layout.tsx` (sidebar «Чаты» count → real unread-conversation count)
- `app/components/blocks/ChatHeader.tsx` (new block) + `app/components/blocks/index.ts` (export) + `fixtures.ts` (fixture) + `app/components/blocks/view-models.ts` (additive `ChatHeaderVM`; additive `ChatPanelVM.header?`, `MessageBubbleVM.date?`, `ConversationItemVM.subtitle?`)
- `app/components/blocks/ChatPanel.tsx` (additive: date separators + optional header) + `app/components/blocks/ConversationItem.tsx` (additive: optional subtitle)
- `lib/view-models.ts` (new — `getConversations` + `getChatThread` + `getUnreadChatCount`, contract-typed) — or `getUnreadChatCount` in `app/actions/message.ts`
- `__tests__/e2e/compose-chats.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests)
- read-only inputs: the blocks (`ConversationItem`/`MessageBubble`/`ChatPanel`/`SearchPanel`), the primitives, `@/app/actions/gig` (`sendMessage`), `@/app/actions/notification` (`markNotificationAsRead`), `lib/reviews` (`getRatingForUser`), `screens/specialist-chats.jpg` (F1 reference)
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements, folded on archive)
- (NOT modified: data models; `sendMessage`/`markNotificationAsRead` semantics; the gig-detail messaging)

## Risks & Mitigations

**Risk**: A "conversation" has no model — it is a gig with messages; ad-hoc derivation could drift from the gig-detail thread or the notification unread rule.
**Mitigation**: Centralize in `getConversations`/`getChatThread`, reusing the **same** participant rule (`getRecentMessages`) and the **same** `Notification.lastReadAt` unread rule (`getUnreadNotifications`). Unit-test both mappers across roles + unread + authorization. The thread is the same `Message` rows the gig-detail `ChatPanel` shows.

**Risk**: The sidebar count change touches the shell layout (a high-blast-radius file).
**Mitigation**: The edit is a one-line swap of the `chats` count source to `getUnreadChatCount` (a new pure helper); the gigs count + Topbar bell are untouched, and the shell E2E (`shell-cutover.spec.ts`) stays green.

**Risk**: Extending `ChatPanel` (date separators + header) could regress the gig-detail per-gig messaging that already uses it.
**Mitigation**: Both additions are **optional** props (`header?`, and `date?` on `MessageBubbleVM`) with absent-defaults — the gig-detail caller renders byte-identically. A composition/token lint + the gig-detail E2E confirm no regression.

**Risk**: `sendMessage` is gated (assignment, not closed/paid) — a conversation only exists once a specialist is assigned, but the inbox might surface gigs without a counterpart.
**Mitigation**: `getConversations` lists only gigs with an assigned specialist + ≥1 message (the `getRecentMessages` rule), so every listed conversation is sendable; the composer surfaces `sendMessage`'s error via `useActionState` when the server still rejects (closed/paid).

**Risk**: F1 ≤1% won't pass against `specialist-chats`.
**Mitigation**: Documented + accepted (per the prior compose-* changes): the residual is the substitute font + avatar rasters, not a composition defect. The diff + 50%-overlay are produced; ≤1% is reached once the font is licensed.
