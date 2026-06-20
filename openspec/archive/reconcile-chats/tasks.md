# Tasks — reconcile-chats

Reconcile `/chats` (`Chats.tsx`) to the **`gigly_full_design` prototype** chats screen (`Gigly App.dc.html` ~L1186–1256)
and **complete the thread-header `Bio` adoption** (started by `add-bio-block`): two-pane layout (left «Сообщения» list +
search + `ConversationItem`s with status/unread; right `ChatHeader`/`Bio` + day-separated `MessageBubble` thread +
composer). Friction: **medium** (Bio-adoption fixes + composition fidelity; all messaging flows preserved).

## 1. Make the thread-header role dynamic (Bio `user` axis)
- [x] `view-models.ts`: add `ChatHeaderVM.counterparty: "specialist" | "company"`. `ChatHeader.tsx`: map it to `Bio`'s
      `user` axis (specialist → `user: "specialist"` shows `Специальность`; company → `user: "company"` collapses it).
      **Remove the hard-coded `user: "specialist"`** (L20).
- **Test:** `domain-blocks.test.tsx` — `ChatHeader` with `counterparty: "company"` renders Bio without `Специальность`;
  with `counterparty: "specialist"` it renders it.

## 2. Populate counterparty + specialty in getChatThread
- [x] `getChatThread` (`lib/view-models.ts` ~L847–853): set `header.counterparty` from the viewer role (CLIENT viewer →
      specialist counterparty; SPECIALIST viewer → company counterparty), and **populate `header.specialty`** from the
      assigned specialist's profile (experience level / position) when the counterparty is a specialist; leave undefined
      for a company. Keep `presence: "был(-а) недавно"`.
- **Test:** `chats-vm.test.ts` — for a CLIENT viewer `header.counterparty === "specialist"` and `header.specialty` is set
  from the profile; for a SPECIALIST viewer `header.counterparty === "company"` and `header.specialty` is undefined.

## 3. Reconcile the ConversationItem to the prototype item
- [x] Verify `ConversationItem` shows: avatar, counterparty name, the **gig-title subtitle**, a **status badge**, an
      **unread pill**, the last-message preview, and a timestamp. If the **status badge** is missing, add
      `ConversationItemVM.status` (a `Status`) + render it, and have `getConversations` derive it via `gigDisplayStatus`
      (no new query). Do not invent fields the prototype doesn't show.
- **Test:** E2E — a conversation item shows the gig status badge + the unread indicator + the gig-title subtitle.

## 4. Reconcile the two-pane composition (Chats.tsx)
- [x] `Chats.tsx`: confirm/align the left «Сообщения» `Section` (search «Поиск по названию или описанию» +
      `ConversationItem`·list, «Чаты не найдены» when filtered empty) and the right thread (`ChatPanel` → `ChatHeader`/
      `Bio` + day-separated `MessageBubble` thread + composer «Сообщение…», «Выберите чат, чтобы открыть переписку» when
      nothing selected). **All wiring moved verbatim** (selection nav `/chats?gig=<id>`, the `query` search filter, the
      `sendMessage` form + hidden `gigId`).
- **Test:** E2E — the two panes render; selecting a conversation opens its thread with the Bio header; sending a message
  appends it; the search empty-state shows «Чаты не найдены».

## 5. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `Chats.tsx` / `ChatHeader.tsx` / `ConversationItem.tsx` beyond
      layout-primitive props; all sections compose from kit blocks + layout + tokens.
- **Test:** `lint:composition` PASS (`Chats` F5-pure); `lint:tokens` PASS (no new literal).

## 6. Record the reconciliation decision (Bio adoption completed)
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the chats two-pane structure + the **completed** thread-header Bio adoption
      (dynamic `user` from counterparty role + populated `Специальность`; presence stays the static prototype line).
      Check the Phase-3 item in `full-design-reground.md`.
- **Test:** the note records the structure + the Bio-adoption completion (prototype provenance).

## 7. Update the affected tests
- [x] `compose-chats.spec.ts`: assert the thread header renders the Bio identity (name + presence + `Специальность` for a
      specialist counterparty; collapsed for a company counterparty) + the conversation item status/unread; keep ALL
      existing behavioural tests (inbox list, open thread, send, search).
- [x] `chats-vm.test.ts` (`getChatThread` counterparty + specialty per role); `domain-blocks.test.tsx` (ChatHeader role
      axis).
- **Test:** updated specs pass; no test asserts the hard-coded specialist role.

## 8. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS.
- [x] `npm run build` — PASS (`/chats`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. `chats-vm.test.ts`).
- [x] `compose-chats` E2E green (existing flows + the Bio-header + conversation-item assertions).
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype `chats` frame, F3 flow
  parity (inbox + open thread + send + search), F5 composition-pure. F1 ≤1% deferred to Phase 4.

## 9. Planning-status (Phase 3)
- [x] Check `reconcile-chats` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.
