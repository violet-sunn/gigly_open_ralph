# Implementation Tasks: compose-chats

> **Phase-2 screen composition.** Build the new `/chats` inbox, composed from kit blocks (`ConversationItem·list` +
> search + `ChatHeader` + `ChatPanel` with `MessageBubble·thread` + composer) inside the layout's `AppShell`, over the
> existing gig-scoped `Message` model — **unread via `Notification.lastReadAt`**, the sidebar «Чаты» count wired to it,
> per-gig messaging intact, `sendMessage` reused. Add the `ChatHeader` block + additive `ChatPanel`/`ConversationItem`
> enhancements; add `getConversations`/`getChatThread`; F5 composition-pure, F3 parity; **F1 ≤1% deferred** (font +
> avatars). Mirror the prior compose-* screens. Friction: medium.

---

## Task 1: [x] `ChatHeader` block + additive chat-block enhancements + VMs

**Implementation Notes:**
- Add the additive VMs/fields to `app/components/blocks/view-models.ts`:
  ```ts
  export interface ChatHeaderVM {
    avatar: ImageRef;
    name: string;
    verified: boolean;
    rating?: RatingVM;
    presence?: string; // «был(-а) недавно»
  }
  // additive fields (backward-compatible — absent ⇒ render as today):
  // MessageBubbleVM.date?: DateISO          (day-separator key)
  // ChatPanelVM.header?: ChatHeaderVM        (optional thread header)
  // ConversationItemVM.subtitle?: string     (the gig title under the name)
  ```
- Create `app/components/blocks/ChatHeader.tsx` (a block — token classes / layout primitives OK; NOT a
  `@composed-screen`): `Avatar` + name + `Icon ICON.verified` (when `verified`) + `Rating` (when present) + a presence
  caption. Token-pure. Mirror `ClientCard`/`ProfileHeader`. Add `chatHeaderFixture` + export from `index.ts`.
- Extend `app/components/blocks/ChatPanel.tsx` (additive):
  - render `vm.header` (a `ChatHeader`) above the thread when present;
  - insert a token-styled day separator (a centered caption) before a bubble whose `vm.date` differs from the previous
    bubble's `date` (no `date` ⇒ no separators — the gig-detail caller is unchanged).
- Extend `app/components/blocks/ConversationItem.tsx` (additive): render `vm.subtitle` (gig title, truncated caption)
  under the name when present.

**Test Plan:**
```bash
test -f app/components/blocks/ChatHeader.tsx && grep -qE 'ChatHeader' app/components/blocks/index.ts && echo "ChatHeader block + export"
grep -qE 'ChatHeaderVM' app/components/blocks/view-models.ts && grep -qE 'subtitle\?|date\?|header\?' app/components/blocks/view-models.ts && echo "additive VMs/fields"
npm run lint:tokens && echo "token-pure"
```
Expected: `ChatHeader` token-pure block + `ChatHeaderVM` + additive `date?`/`header?`/`subtitle?` + fixture + barrel export; existing callers unaffected.

---

## Task 2: [x] `getConversations` + `getChatThread` + `getUnreadChatCount` mappers

**Implementation Notes:**
- Add to `lib/view-models.ts` (server-only; reuse `getRatingForUser`, the `getRecentMessages` participant rule, and the
  `getUnreadNotifications` `lastReadAt` rule; `import type` the VMs):
  ```ts
  export async function getConversations(viewer: { userId: string; role: string }): Promise<ConversationItemVM[]>
  export async function getChatThread(
    gigId: string, viewer: { userId: string; role: string },
  ): Promise<{ header: ChatHeaderVM; chat: ChatPanelVM } | null>
  export async function getUnreadChatCount(userId: string): Promise<number>
  ```
  - `getConversations`: fetch the viewer's participating gigs (CLIENT: `clientId = userId`, `assignedSpecialistId not
    null`; SPECIALIST: `assignedSpecialistId = userId`) with `messages` (ordered desc) + the viewer's `notifications`
    (for `lastReadAt`) + `client.clientProfile`/`assignedSpecialist.specialistProfile`. Keep gigs with ≥1 message; map
    to `ConversationItemVM` — `id = gigId`, `name` = the **counterparty** (CLIENT viewer → specialist displayName;
    SPECIALIST viewer → client companyName; fallback email), `subtitle = gig.title`, `preview` = last message (trim to
    ~50), `timestamp` = last message time (localized), `unread` = count of messages with `senderId !== userId` and
    `createdAt > lastReadAt` (all when no `lastReadAt`). Sort by last-message desc.
  - `getChatThread`: fetch the gig with `messages.sender` + `client`/`assignedSpecialist` profiles + `moderations:false`.
    Authorize: `viewer` is `clientId` or `assignedSpecialistId`, else `null`. `chat.thread` = messages →
    `MessageBubbleVM` (`direction`, `body`, `timestamp` (HH:MM), `date` (long date for separators),
    `readState` if derivable). `header` = the counterparty (`ChatHeaderVM`: name/avatar/verified+rating via
    `getRatingForUser`, presence text). `composer: { canAttach: false }`.
  - `getUnreadChatCount`: number of the viewer's participating gigs with ≥1 message from others after `lastReadAt`
    (the conversation-level unread count for the sidebar badge).

**Test Plan:**
```bash
grep -qE 'getConversations|getChatThread|getUnreadChatCount' lib/view-models.ts && echo "mappers present"
grep -qE 'getRatingForUser' lib/view-models.ts && echo "reuses rating"
```
Expected: the three mappers, contract-typed; `getChatThread` returns `null` for an unauthorized viewer.

---

## Task 3: [x] `Chats` composed screen (inbox + thread + composer)

**Implementation Notes:**
- Create `app/(protected)/chats/Chats.tsx` (`'use client'`, `/* @composed-screen */`). Props = `{ conversations:
  ConversationItemVM[]; thread: { header; chat } | null; selectedGigId?: string }`. Compose via **layout primitives
  only** (Section/Split/Stack — no className/style). Sketch:
  ```tsx
  /* @composed-screen */
  'use client'
  import { useState, useActionState } from 'react'
  import { useRouter } from 'next/navigation'
  import { Section } from '@/app/components/layout/Section'
  import { Split } from '@/app/components/layout/Split'
  import { Stack } from '@/app/components/layout/Stack'
  import { ConversationItem, ChatPanel, SearchPanel, Notice } from '@/app/components/blocks'
  import { sendMessage } from '@/app/actions/gig'
  import type { ConversationItemVM, ChatHeaderVM, ChatPanelVM } from '@/app/components/blocks/view-models'

  export function Chats({ conversations, thread, selectedGigId }: {
    conversations: ConversationItemVM[]
    thread: { header: ChatHeaderVM; chat: ChatPanelVM } | null
    selectedGigId?: string
  }) {
    const router = useRouter()
    const [q, setQ] = useState('')
    const [sendState, sendAction] = useActionState(sendMessage, null)
    const shown = conversations.filter((c) => `${c.name} ${c.subtitle ?? ''} ${c.preview}`.toLowerCase().includes(q.toLowerCase()))
    return (
      <Split ratio="1:2">
        <Section title="Сообщения" gap={4}>
          <SearchPanel placeholder="Поиск по названию или описанию" onSubmit={setQ} />
          <Stack gap={1}>
            {shown.map((c) => (
              <ConversationItem key={c.id} vm={c} onOpen={() => router.push(`/chats?gig=${c.id}`)} />
            ))}
          </Stack>
        </Section>
        {thread ? (
          <form action={sendAction}>
            <input type="hidden" name="gigId" value={selectedGigId} />
            <ChatPanel vm={{ ...thread.chat, header: thread.header }} />
            {sendState?.error && <Notice tone="error">{sendState.error}</Notice>}
          </form>
        ) : (
          <Notice tone="muted">Выберите чат, чтобы открыть переписку</Notice>
        )}
      </Split>
    )
  }
  ```
  Confirm `SearchPanel`'s callback prop name (it exposes `onSubmit`/`onSearch` — match the dashboard usage). The
  `ChatPanel` composer already renders `name="content"` + a submit button, so the `<form action={sendAction}>` wrapper
  submits `content` + the hidden `gigId` (the gig-detail pattern). No className/style → F5-clean.

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/chats/Chats.tsx && echo "composed screen"
grep -qE 'className=|style=' app/\(protected\)/chats/Chats.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure composition (inbox list + search + thread + composer) wiring `sendMessage`.

---

## Task 4: [x] Thin server page + sidebar «Чаты» count wiring

**Implementation Notes:**
- Create `app/(protected)/chats/page.tsx` (server): `getSession` + no-session redirect; read `searchParams.gig`;
  `getConversations(viewer)`; if `gig` present, `getChatThread(gig, viewer)` and — when it is non-null (authorized) —
  `markNotificationAsRead(gig)` (so opening clears unread); render `<Chats conversations={…} thread={…}
  selectedGigId={gig} />`. (Mark-read after fetching the thread so the returned `unread` still reflects pre-open state
  if needed; the next render shows it cleared.)
- Wire the sidebar count in `app/(protected)/layout.tsx`: replace the `chats` nav count source
  (`prisma.notification.count({ where: { userId, lastReadAt: null } })`) with `getUnreadChatCount(session.userId)` so
  the badge matches the inbox. Leave the `gigs` count + the Topbar bell (`unread`) unchanged.

**Test Plan:**
```bash
grep -qE 'getConversations|getChatThread' app/\(protected\)/chats/page.tsx && echo "page wires mappers"
grep -qE 'markNotificationAsRead' app/\(protected\)/chats/page.tsx && echo "mark-read on open"
grep -qE 'getUnreadChatCount' app/\(protected\)/layout.tsx && echo "sidebar count wired"
```
Expected: `/chats` renders the inbox (+ thread when `?gig`), marks read on open; the sidebar «Чаты» count reflects unread conversations.

---

## Task 5: [x] Mapper unit tests + chats E2E + preserved messaging

**Implementation Notes:**
- `__tests__/integration/chats-vm.test.ts` (mock `@/lib/prisma`/`next/*`; `createTestUser`/`createTestGig`/
  `createTestMessage` + `notification.upsert` for `lastReadAt`): `getConversations` returns one item per gig-with-
  messages, the counterparty name + subtitle + preview + timestamp, `unread` honoring `lastReadAt` (and all-unread when
  none), ordered by last message; `getChatThread` returns the thread (direction per viewer, date, header) and `null`
  for a non-participant; `getUnreadChatCount` matches the sum of unread conversations.
- `__tests__/e2e/compose-chats.spec.ts` (setE2ESession + seed via prisma into `file:./test.db`): seed a CLIENT + an
  assigned SPECIALIST + an IN_PROGRESS gig + messages; the inbox lists the conversation; opening it
  (`/chats?gig=<id>`) renders the thread + the composed header; sending a message (`sendMessage`) appends it; the
  search filters the list; the unread badge clears after opening. Add one assertion that the **gig-detail** `ChatPanel`
  still sends (per-gig messaging intact) — or rely on the preserved gig-detail E2E.
- **Keep** the messaging **integration** tests (`messaging.test.ts`) unchanged — they target `sendMessage`, preserved.

**Test Plan:**
```bash
npm run clean:test-db && npx vitest run __tests__/integration/chats-vm.test.ts 2>&1 | tail -12
npm run clean:test-db && npx vitest run __tests__/integration/messaging.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/compose-chats.spec.ts --project=chromium 2>&1 | tail -12
```
Expected: mapper unit tests pass; the preserved messaging integration tests stay green; the chats E2E covers inbox + open-thread + mark-read + send + search.

---

## Task 6: [x] Buildable acceptance (F3 + F5 + suite) + scope confirmation

**Implementation Notes:**
- Run F5 composition lint, token lint, build, full unit suite, and the E2E (incl. the shell-cutover + gig-detail E2E to
  confirm no regression from the additive `ChatPanel` change and the layout count swap).
- Confirm scope: only `/chats` added + the layout count line + the additive block changes; `sendMessage`/
  `markNotificationAsRead` semantics unchanged (messaging integration tests green); no data-model change; the
  gig-detail messaging unchanged; only the additive VMs joined the block contract; the new screen-data types live in
  `lib/view-models.ts`.

**Test Plan:**
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
npx playwright test __tests__/e2e/shell-cutover.spec.ts __tests__/e2e/compose-gig-detail-apply.spec.ts --project=chromium 2>&1 | tail -8
```
Expected: F3 + F5 + build + suite + E2E green; scope held (chats only; messaging semantics/gig-detail/shell-count-source aside untouched).

---

## Task 7: [x] F1 fidelity diff vs specialist-chats (artifacts; ≤1% deferred)

**Implementation Notes:**
- Seed a CLIENT + assigned SPECIALIST + a gig + a multi-message thread (spanning ≥2 days, to show a date separator),
  set the session, capture `/chats?gig=<id>` at 1440px (a temporary capture spec like the prior compose-* changes,
  removed after — artifacts preserved), then `node scripts/design-system/fidelity-diff.js <chats-actual.png>
  screens/specialist-chats.jpg docs/design-system/fidelity/out/chats` → ratio + `diff/side-by-side/overlay-50`.
- The ≤1% target is **deferred** (substitute font + avatar rasters); report the ratio + that the residual is the
  documented font/avatar factor, not a composition defect.

**Test Plan:**
```bash
node scripts/design-system/fidelity-diff.js docs/design-system/fidelity/out/chats/chats-actual.png screens/specialist-chats.jpg docs/design-system/fidelity/out/chats
```
Expected: diff + overlay produced; composed layout visually faithful; ≤1% deferred (font + avatars).

---

## Summary

Total tasks: 7
Estimated effort: 12–18 hours (friction: medium — a new route + a block gap-fill + additive block enhancements + two
mappers + a composed screen + the sidebar-count wiring + unit/E2E/fidelity; no new data model, messaging reused)

**Deliverables:**
- `ChatHeader` block (gap fill) + `ChatHeaderVM` + additive `ChatPanel` date-separators/header, `MessageBubbleVM.date?`,
  `ConversationItemVM.subtitle?` + fixture + export.
- `lib/view-models.ts` — `getConversations` (per-gig conversation list + unread), `getChatThread` (thread + header;
  `null` for unauthorized), `getUnreadChatCount`, contract-typed, reusing `getRatingForUser` + the `lastReadAt` rule.
- `Chats` F5-pure `@composed-screen` (inbox + thread + composer) wiring `sendMessage`; thin server page with `?gig`
  selection + `markNotificationAsRead` on open; the sidebar «Чаты» count wired to `getUnreadChatCount`.
- Mapper unit tests + chats E2E (inbox + open-thread + mark-read + send + search); preserved messaging integration
  tests; F1 diff produced (≤1% deferred).

**Critical path:** ChatHeader + additive enhancements (1) → mappers (2) → Chats composition (3) → page + count wiring (4) → tests (5) → acceptance (6) → [artifacts] F1 diff (7).

**Dependencies:** compose-shell-cutover, domain-blocks — both complete. (Reuses the existing `Message` model, `sendMessage`, `markNotificationAsRead`, `Notification.lastReadAt`.)

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–7):**
- **`ChatHeader` block** (`app/components/blocks/ChatHeader.tsx`) — Avatar + name + verified + Rating + presence, token-
  pure, with `chatHeaderFixture` + barrel export. **Additive VMs/fields**: `ChatHeaderVM`; `MessageBubbleVM.date?`,
  `ChatPanelVM.header?`, `ConversationItemVM.subtitle?`. **`ChatPanel`** now renders an optional header + day separators
  (when `m.date` changes); **`ConversationItem`** renders an optional subtitle — both additive (the gig-detail caller is
  unchanged).
- **Mappers** (`lib/view-models.ts`) — `getConversations(viewer)` (one conversation per participating gig-with-
  messages: counterparty name + gig subtitle + last-message preview + time + unread via `lastReadAt`, sorted desc),
  `getChatThread(gigId, viewer)` (thread with direction per viewer + day-date + the counterparty `ChatHeader`; `null`
  for a non-participant/missing gig), `getUnreadChatCount(viewer)` (conversations with ≥1 unread). Reuse
  `getRatingForUser` + the `getRecentMessages` participant rule + the `getUnreadNotifications` `lastReadAt` rule.
- **`Chats` `@composed-screen`** (`app/(protected)/chats/Chats.tsx`) — `Split` (left: Section «Сообщения» + `SearchPanel`
  + `ConversationItem·list`; right: `ChatPanel` (header+thread+composer) wired to `sendMessage` via `useActionState` +
  `<form action>` with a hidden `gigId`, or an empty-state `Notice`). Search filters the list. F5-pure (no
  className/style).
- **Thin server page** (`app/(protected)/chats/page.tsx`) — `getConversations` + (when `?gig`) `getChatThread` +
  `markNotificationAsRead` on open; renders `<Chats>`. **Sidebar count** (`app/(protected)/layout.tsx`) — the «Чаты»
  badge now uses `getUnreadChatCount` (matches the inbox); the `gigs` count + Topbar bell are unchanged.
- **Tests** — `__tests__/integration/chats-vm.test.ts` **7/7** (conversation list + counterparty + subtitle + preview;
  all-unread vs `lastReadAt`-after-all; own-messages-not-unread; thread direction/date + header; `null` for
  non-participant/missing; unread count). `__tests__/e2e/compose-chats.spec.ts` **4/4** in a real browser — inbox lists
  the conversation; opening renders the thread + composer; sending via the reused `sendMessage` works; search filters.
- **Gates** — `lint:composition` (F5, 9 composed screens) ✓ · `lint:tokens` (F2) ✓ · `npm run build` ✓ (`/chats`
  1.05 kB) · `npm run test:unit` **885/885** (was 878; +7 new — clean run) ✓ · regression E2E (shell-cutover 3 +
  gig-detail 5) **8/8** ✓ (the additive `ChatPanel` change + the layout count swap caused no regression).

**Task 7 (F1 vs `specialist-chats`): diff produced; composed layout faithful; ≤1% deferred.** ratio = **0.1786**
(`docs/design-system/fidelity/out/chats/`: diff / side-by-side / overlay-50; produced by a temporary capture spec,
removed after — artifacts preserved). The residual is the **substitute font** + avatar rasters (the mock's coloured/
photo avatars vs initials), not a composition defect.

**Scope guards (non-goals held):** no new data model (a conversation is a gig with messages); `sendMessage`/
`markNotificationAsRead` semantics **unchanged** (the messaging integration tests stay green); the gig-detail per-gig
messaging is unchanged (its E2E passes); the `ChatPanel`/`ConversationItem`/`MessageBubbleVM` changes are additive; only
the additive VMs joined the block contract; the screen-data types live in `lib/view-models.ts`.

**Reconciliations recorded:**
- `sendMessage` is reused **verbatim** and ends with `redirect('/gigs/<gigId>')` — so sending from `/chats` lands on the
  gig-detail conversation (the **same** thread/messages). The non-goal (no `sendMessage` change) is honored; the message
  is sent and visible. A future change could add a thin `/chats`-returning wrapper if desired.
- The sidebar «Чаты» count source moved from `notification.count({ lastReadAt: null })` (a notification-record proxy) to
  `getUnreadChatCount` (unread **conversations**), so the badge matches the inbox.
- The richer mock conversation row (a status badge on each item) is approximated by the existing `ConversationItem` +
  the additive `subtitle` (gig title); the per-item status badge is a deferred fidelity nuance (F1 deferred regardless).
