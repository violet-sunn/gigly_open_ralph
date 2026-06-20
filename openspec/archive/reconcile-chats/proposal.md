# reconcile-chats

**Type:** Regular change (UI / screen reconciliation — «Чаты»)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (screen reconciliation, **authored fresh from the
prototype**)
**Capability:** `ui`
**Depends on:** `add-bio-block` (archived — the `Bio` block + its `acc-bio`×`company`/`specialist` variants the thread
header adopts), `compose-chats` (archived — the existing `/chats` two-pane screen this reconciles). All kit blocks it
composes (`Bio`, `ChatHeader`, `ChatPanel`, `ConversationItem`, `MessageBubble`, `SearchPanel`, `Notice`) exist.

## Why

`/chats` (`app/(protected)/chats/Chats.tsx`) is a kit-composed two-pane screen, but it was composed before the real
design and its thread header's **`Bio` adoption is only 90% complete**. The authoritative source is the **prototype**
(`gigly_full_design/Gigly App.dc.html` chats screen ~L1186–1256; `ROUTES.md` L12/L41). Reading it directly gives the
real composition and surfaces **two concrete gaps** in the already-started Bio adoption.

The prototype is a **two-pane layout** (left: conversation list; right: thread + composer):

- **Left — conversation list:** a «Сообщения» header + a search («Поиск по названию или описанию») + per-conversation
  `ConversationItem`s — each with avatar, the **counterparty name**, the **gig title** subtitle, a **status badge**, an
  **unread pill**, a last-message preview, and a timestamp.
- **Right — thread:** a **thread header** using the **`Bio` identity** (avatar + name + verify-patch + rating + presence
  «был(-а) недавно» + the counterparty `Специальность`), a message thread with **day separators** (e.g. «1 апреля 2026
  г.») and `MessageBubble`s, and a composer («Сообщение…»).

The thread header **already renders `Bio`** via `ChatHeader` (`add-bio-block`) — but two things are wrong/missing:

1. **`ChatHeader` hard-codes `user: "specialist"`** (`ChatHeader.tsx` L20). When the **counterparty is a company** (i.e.
   a SPECIALIST is viewing the chat), `Bio` should use `user: "company"` so it **collapses the `Специальность` tag**.
   Today a company counterparty would wrongly get a specialist's specialty treatment. The header's role must be
   **dynamic** (driven by who the counterparty is), not constant.
2. **`getChatThread` never populates `ChatHeaderVM.specialty`** (`lib/view-models.ts` ~L847–853), even though the
   counterparty specialist's profile is already fetched (`assignedSpecialist.specialistProfile`). So the
   `Специальность` line is always blank for a specialist counterparty.

This change reconciles the two-pane composition to the prototype and **closes the Bio adoption** (dynamic role +
populated specialty), so the thread header renders the full `Bio` identity exactly as designed.

## What

- **Complete the thread-header `Bio` adoption:**
  - Add a counterparty-role signal to `ChatHeaderVM` (e.g. `counterparty: "specialist" | "company"`); `ChatHeader` maps
    it to `Bio`'s `user` axis (specialist counterparty → `user: "specialist"` shows `Специальность`; company
    counterparty → `user: "company"` collapses it). **Remove the hard-coded `user: "specialist"`.**
  - `getChatThread`: set `header.counterparty` from the viewer's role (CLIENT viewer → counterparty is the assigned
    specialist; SPECIALIST viewer → counterparty is the company), and **populate `header.specialty`** from the
    specialist's profile (experience level / position) when the counterparty is a specialist; leave it undefined for a
    company. Keep the existing `presence` «был(-а) недавно».
- **Reconcile the two-pane composition to the prototype** (`Chats.tsx`): the left «Сообщения» list with search +
  `ConversationItem`s, the right thread (`ChatHeader`/`Bio` + day-separated `MessageBubble` thread + composer
  «Сообщение…»), the empty states («Чаты не найдены» when the search empties the list, «Выберите чат, чтобы открыть
  переписку» when no thread is selected). **Every messaging flow preserved verbatim** (selection nav, search filter, the
  `sendMessage` form).
- **Reconcile `ConversationItem` to the prototype item shape** — verify it carries the **status badge** and **unread
  pill** + the **gig-title subtitle**; add the status to `ConversationItemVM` + render it if missing (the prototype list
  item shows the gig status, e.g. «В работе»/«На проверке»). If the conversation list needs the gig status, derive it via
  the existing `gigDisplayStatus` (no new query).

No screen carries off-token literals (F2) or bespoke markup (F5) — it stays `Template + Blocks + data`. All on-screen
text is Russian, exactly as the prototype shows it.

## Key facts / decisions (derived from the prototype)

- **Bio is already adopted** for the thread header (`ChatHeader` → `Bio` `acc-bio`); this change **completes** it, it does
  not introduce it.
- **The `Bio` `user` axis is the counterparty's role, not a constant.** Company counterparty → `user: "company"`
  (collapses `Специальность`); specialist counterparty → `user: "specialist"` (shows it). Today it's hard-coded
  `specialist` — the bug this fixes.
- **`specialty` comes from the specialist's profile**, already fetched in `getChatThread`; bind it (don't fabricate). A
  company counterparty has no `Специальность` — leave it undefined.
- **Presence stays «был(-а) недавно»** (the prototype's hard-coded presence line) — not a real online-status feature; no
  backend invented.
- **Conversation-list item shows the gig status** (badge) + unread pill + gig-title subtitle; derive the status via
  `gigDisplayStatus`.
- **All messaging semantics unchanged** — `sendMessage`, authorization (participant-only), the `getConversations` /
  `getChatThread` data, the day-separator formatting — only the thread-header role/specialty and any missing
  conversation-item fields change.
- **F1 baselines on the prototype frame** (`Gigly Развёртка.dc.html`, the `chats` state); fonts resolved. F1 here =
  structural/overlay match; the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **Reconciled screen:** `app/(protected)/chats/Chats.tsx` (two-pane composition fidelity).
- **Blocks:** `app/components/blocks/ChatHeader.tsx` (dynamic `user` from the counterparty role; drop the hard-coded
  `specialist`); `app/components/blocks/ConversationItem.tsx` (status badge + unread pill + subtitle, if not already
  present).
- **View-models:** `app/components/blocks/view-models.ts` — `ChatHeaderVM.counterparty` (role) + `ConversationItemVM`
  status, if added. `lib/view-models.ts` — `getChatThread` populates `header.counterparty` + `header.specialty`;
  `getConversations` exposes the gig status if the item needs it.
- **Tests:** `__tests__/e2e/compose-chats.spec.ts` (the thread header renders the `Bio` identity — name + presence +,
  for a specialist counterparty, `Специальность`; a company counterparty collapses it; the conversation item shows the
  status + unread; keep all behavioural flows — inbox list, open thread, send, search empty-state);
  `__tests__/integration/chats-vm.test.ts` (`getChatThread` sets `counterparty` + `specialty` per viewer role).
- **Docs:** the reconciliation note in `docs/DESIGN_SYSTEM_SPEC.md` (the chats two-pane structure + the completed Bio
  adoption — dynamic role + specialty); check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- New blocks/primitives (none needed). A real presence / online-status feature (presence stays the prototype's static
  line). File attachments in the composer (the prototype shows the affordance; the backend is out of scope —
  `composer.canAttach` stays false unless already wired).
- Changing `sendMessage`, the messaging authorization, or the conversation/thread query semantics.
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/Gigly App.dc.html` (the `chats` screen ~L1186–1256: left list ~L1191–1220, thread header ~L1224–1232,
thread ~L1235–1245, composer ~L1248–1252; data `CONVERSATIONS`/`MESSAGES` ~L1456–1501); `ROUTES.md` L12/L41;
`Gigly Развёртка.dc.html` (the F1 frame). The current `Chats.tsx`, `ChatHeader.tsx` (L20 hard-coded `user`), `Bio.tsx`
(the `user`/`sizeFor` axes), `ConversationItem.tsx`; `lib/view-models.ts` `getConversations` (L762–805) / `getChatThread`
(L812–856); `BioVM`/`ChatHeaderVM`/`ConversationItemVM` in `app/components/blocks/view-models.ts`.
