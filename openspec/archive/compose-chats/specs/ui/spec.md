# UI Specification Delta: compose-chats

This document contains specification changes for the `compose-chats` change — Phase-2 screen composition #7. It builds
the new **`/chats`** screen, composed from kit blocks (`ConversationItem·list` + a search + `ChatHeader` + `ChatPanel`
with `MessageBubble·thread` + composer), inside the `AppShell` the shell-cutover put in the protected layout, as an
inbox + thread over the existing gig-scoped `Message` model — **unread derived from `Notification.lastReadAt`**, the
sidebar «Чаты» count wired to it, and **per-gig messaging kept intact**. It ships **a new `ChatHeader` block + additive
`ChatPanel`/`ConversationItem` enhancements + the `getConversations`/`getChatThread` mappers + the `Chats` composition +
the `/chats` page + the sidebar-count wiring + tests only** — F5 composition-pure, F3 logical parity, with the **F1 ≤1%
pixel-diff deferred** (substitute font + avatars). It does **not** add a data model or change `sendMessage`/
`markNotificationAsRead` semantics or the gig-detail messaging.

---

## ADDED Requirements

### Requirement: Chats Composed from Blocks
The `/chats` body MUST be composed from kit blocks as a composition-pure screen (F5), inside the layout's `AppShell`.

#### Scenario: Chats is a composed screen
- GIVEN `app/(protected)/chats/Chats.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `ConversationItem·list` + a search + `ChatHeader` +
  `ChatPanel` (with `MessageBubble·thread` + composer) via layout primitives (Section/Split/Stack), import only
  kit/`lib`/`actions`/`react`/`next`, and contain **no** `className=` / `style=` / raw styled markup

#### Scenario: The page renders it with URL-selected conversation
- GIVEN `app/(protected)/chats/page.tsx`
- WHEN a user loads `/chats` (optionally `/chats?gig=<id>`)
- THEN the page MUST build the inbox server-side (`getConversations`) and, when `?gig=<id>` is present and the viewer is
  authorized, the thread (`getChatThread`) — rendering `<Chats>` inside the shell; the no-session redirect MUST be
  preserved, and an empty/zero-state MUST render when there are no conversations or none is selected

**Acceptance Criteria:**
- `Chats` is an F5-pure `@composed-screen` composing the inbox + thread blocks; the page renders it with URL-driven (`?gig`) selection
- No-session redirect + empty/zero-state preserved

### Requirement: Inbox and Thread Real Data Binding
The screen MUST bind real data through server-only, contract-typed `getConversations` and `getChatThread` mappers over
the gig-scoped `Message` model.

#### Scenario: Conversation list
- GIVEN `getConversations(viewer)`
- WHEN it runs
- THEN it MUST return one `ConversationItemVM` per gig the viewer participates in (CLIENT: own gigs with an assigned
  specialist; SPECIALIST: assigned gigs) that has ≥1 message — name (the counterparty), subtitle (the gig title),
  preview (the last message, truncated), timestamp (the last message time), and `unread` (messages from others created
  after the viewer's `Notification.lastReadAt` for that gig) — sorted by last-message descending

#### Scenario: Thread + header
- GIVEN `getChatThread(gigId, viewer)`
- WHEN the viewer is the gig owner or the assigned specialist
- THEN it MUST return `{ header: ChatHeaderVM (counterparty avatar/name/verified/rating/presence), chat: ChatPanelVM }`
  where the `chat.thread` is the gig's messages → `MessageBubbleVM[]` (`direction` from `senderId === viewer.userId`,
  timestamp, a `date` for day separators, read receipts); and it MUST return `null` when the viewer is not authorized

**Acceptance Criteria:**
- `getConversations` returns per-gig conversations (name/subtitle/preview/timestamp/unread), ordered by last message
- `getChatThread` returns the thread (in/out + dates + receipts) + counterparty header; `null` for an unauthorized viewer; both reuse `getRatingForUser` + the `Notification.lastReadAt` rule

### Requirement: ChatHeader Block and Additive Chat Enhancements
The `ChatHeader` block MUST be implemented, and the `ChatPanel`/`ConversationItem` blocks MUST gain additive,
backward-compatible enhancements.

#### Scenario: ChatHeader is a token-pure kit block
- GIVEN `app/components/blocks/ChatHeader.tsx`
- WHEN inspected
- THEN it MUST render the thread header (Avatar + counterparty name + verified + Rating + presence text) from a
  `ChatHeaderVM`, be token-pure (primitives + layout + tokens), have a fixture, and be exported from the blocks barrel

#### Scenario: ChatPanel date separators + header are additive
- GIVEN the `ChatPanel` block and the `MessageBubbleVM`/`ChatPanelVM`/`ConversationItemVM` contracts
- WHEN the additive props are absent (the existing gig-detail caller)
- THEN `ChatPanel` MUST render exactly as before; WHEN `MessageBubbleVM.date` differs between consecutive bubbles a
  token-styled day separator MUST render, and WHEN `ChatPanelVM.header` is present it MUST render above the thread;
  `ConversationItemVM.subtitle` (the gig title) MUST render under the name when present

**Acceptance Criteria:**
- `ChatHeader` token-pure block + `ChatHeaderVM` (additive) + fixture + barrel export
- `ChatPanel` date separators + optional header and `ConversationItem` subtitle are additive (existing callers unaffected); `lint:tokens` passes

### Requirement: Unread, Mark-Read, and the Sidebar «Чаты» Count
Unread MUST be derived from `Notification.lastReadAt`; opening a conversation MUST mark it read; the sidebar «Чаты»
count MUST reflect the unread-conversation count.

#### Scenario: Opening a conversation clears its unread
- GIVEN a conversation with messages from the other party after the viewer's `lastReadAt`
- WHEN the viewer opens it (`/chats?gig=<id>`)
- THEN the page MUST call `markNotificationAsRead(gigId)` so the conversation's `unread` becomes 0 and the sidebar
  «Чаты» count decreases accordingly

#### Scenario: Sidebar count matches the inbox
- GIVEN the protected layout building the nav counts
- WHEN it computes the `chats` count
- THEN it MUST use the unread-conversation count (gigs with messages from others after `lastReadAt`), matching the sum
  of the inbox's unread badges

**Acceptance Criteria:**
- Unread from `Notification.lastReadAt`; opening a conversation calls `markNotificationAsRead`; the sidebar «Чаты» count reflects unread conversations

### Requirement: Preserved Messaging Wired to the Existing Action
Sending MUST use the existing `sendMessage` action (no semantics change), and per-gig (gig-detail) messaging MUST stay
intact.

#### Scenario: Send a message from the thread
- GIVEN the selected conversation's composer
- WHEN the viewer submits a message
- THEN it MUST call `sendMessage` (the `content` field + a hidden `gigId`) via `useActionState` + `<form action>`; the
  message MUST appear in the thread; the action's authorization/gating/validation MUST be unchanged

#### Scenario: Per-gig messaging unaffected
- GIVEN the gig-detail screen's `ChatPanel`
- WHEN it renders after this change
- THEN it MUST keep working unchanged — the `ChatPanel`/`ConversationItem`/`MessageBubbleVM` changes are additive

**Acceptance Criteria:**
- `sendMessage` wired directly; messaging semantics unchanged; gig-detail per-gig messaging works (its tests stay green); block changes additive

### Requirement: Chats Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit tests, and the
  chats E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the mock (list + thread + composer) (F3), the
  inbox/open-thread/mark-read/send/search flows work, and the existing messaging integration tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live `/chats` captured at 1440px and diffed vs `screens/specialist-chats.jpg`
- WHEN the artifacts (diff / side-by-side / 50%-overlay) are reviewed
- THEN the composed layout MUST be visually faithful; the automated ≤1% threshold is NOT yet met — dominated by the
  **substitute font** + avatar rasters, not a composition defect; ≤1% is reached once the font is licensed

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit tests + chats E2E green; existing messaging tests green
- F1 diff produced; composed layout visually faithful; ≤1% deferred to the font licence + avatars

---

## Test Plan

This change ships a block + additive block enhancements + two mappers + a composition + a new page + the sidebar-count
wiring + tests. Validation is by deterministic commands. Commands assume the repo root.

### Composition + blocks + mappers
```bash
grep -qE '@composed-screen' app/\(protected\)/chats/Chats.tsx && echo "Chats composed screen (F5 marker)"
grep -qE 'className=|style=' app/\(protected\)/chats/Chats.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
test -f app/components/blocks/ChatHeader.tsx && grep -qE 'ChatHeader' app/components/blocks/index.ts && grep -qE 'ChatHeaderVM' app/components/blocks/view-models.ts && echo "ChatHeader block + VM + export"
grep -qE 'getConversations|getChatThread' lib/view-models.ts && echo "inbox + thread mappers"
grep -qE 'sendMessage' app/\(protected\)/chats/Chats.tsx && echo "sendMessage wired"
grep -qE 'getChatThread|getConversations|markNotificationAsRead' app/\(protected\)/chats/page.tsx && echo "page wires mappers + mark-read"
grep -qE 'getUnreadChatCount|chats:' app/\(protected\)/layout.tsx && echo "sidebar чаты count wired"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite (incl. preserved messaging)
```bash
npm run clean:test-db && npx vitest run __tests__/integration/chats-vm.test.ts 2>&1 | tail -10
npm run clean:test-db && npx vitest run __tests__/integration/messaging.test.ts 2>&1 | tail -8
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Chats E2E (inbox + thread + send + search; per-gig messaging intact)
```bash
npx playwright test __tests__/e2e/compose-chats.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 fidelity diff (artifacts; ≤1% deferred)
```bash
# capture /chats (with a selected conversation) at 1440px, then:
node scripts/design-system/fidelity-diff.js <chats-actual.png> screens/specialist-chats.jpg <outDir>
# review diff / side-by-side / overlay-50; ≤1% deferred (substitute font + avatars)
```

### Manual review
1. Confirm `Chats` is an F5-pure `@composed-screen` (the inbox + thread blocks via layout primitives; no className/style) rendered by the page with `?gig` selection.
2. Confirm `getConversations`/`getChatThread` bind real data (per-gig conversations + unread; thread with date separators + receipts + header); unauthorized → `null`.
3. Confirm unread is from `Notification.lastReadAt`, opening a conversation marks it read, and the sidebar «Чаты» count matches; `sendMessage` works and per-gig messaging is intact.
4. Confirm the block changes are additive (gig-detail messaging unchanged) and the F1 diff is produced (≤1% deferred to font + avatars).
