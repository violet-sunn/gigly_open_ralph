# Spec delta — ui (reconcile-chats)

Reconciles `/chats` to the **`gigly_full_design` prototype** chats screen (two-pane: left «Сообщения» list + search +
`ConversationItem`s with status/unread; right `ChatHeader`/`Bio` + day-separated `MessageBubble` thread + composer) and
**completes the thread-header `Bio` adoption** (dynamic `user` from the counterparty role + populated `Специальность`).
Token-pure (F2) + composition-pure (F5); every messaging flow preserved.

## MODIFIED Requirements

### Requirement: Chats Screen Reconciled to the Prototype (Two-Pane)
The `/chats` screen MUST remain a composition-pure `@composed-screen` inside `AppShell`, reconciled to the
`gigly_full_design` chats prototype as a **two-pane** layout: **left** = a «Сообщения» section with a search («Поиск по
названию или описанию») over a list of `ConversationItem`s (avatar + counterparty name + gig-title subtitle + status
badge + unread pill + last-message preview + timestamp), with «Чаты не найдены» when the search empties the list;
**right** = the selected conversation's thread (a `ChatHeader` using the `Bio` identity, a day-separated `MessageBubble`
thread, and a composer «Сообщение…»), with «Выберите чат, чтобы открыть переписку» when no thread is selected. The
screen MUST be token-pure (F2) and composition-pure (F5) and MUST preserve every messaging flow (conversation selection,
search filtering, the `sendMessage` form, participant-only authorization).

#### Scenario: Two-pane layout renders
- GIVEN the `/chats` screen
- WHEN it renders
- THEN the left pane MUST show «Сообщения», the search, and the `ConversationItem` list, and the right pane MUST show the
  selected thread (Bio header + thread + composer) or «Выберите чат, чтобы открыть переписку»

#### Scenario: Messaging flows preserved; composition-pure
- GIVEN the screen
- WHEN it is interacted with
- THEN selecting a conversation opens its thread; sending via the composer appends the message; the search filters the
  list (and shows «Чаты не найдены» when empty)
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

### Requirement: Thread Header Uses the Bio Identity With a Dynamic Counterparty Role
The chat thread header MUST render the **`Bio`** identity (`acc-bio`): avatar + name + verify-patch + rating + presence
«был(-а) недавно». `Bio`'s `user` axis MUST be **driven by the counterparty's role**, not constant: when the
counterparty is a **company** (a SPECIALIST viewing the chat) the header MUST use `user: "company"` and **collapse** the
`Специальность` tag; when the counterparty is a **specialist** (a CLIENT viewing the chat) it MUST use `user:
"specialist"` and **show** the `Специальность`. `ChatHeaderVM` MUST carry the counterparty role; the prior hard-coded
`user: "specialist"` MUST be removed.

#### Scenario: Company counterparty collapses Специальность
- GIVEN a SPECIALIST viewing a chat (the counterparty is the company)
- WHEN the thread header renders
- THEN it MUST use the `Bio` company variant and MUST NOT show a `Специальность` tag

#### Scenario: Specialist counterparty shows Специальность
- GIVEN a CLIENT viewing a chat (the counterparty is the assigned specialist)
- WHEN the thread header renders
- THEN it MUST use the `Bio` specialist variant and MUST show the specialist's `Специальность`

### Requirement: getChatThread Binds Counterparty Role and Specialty
`getChatThread` MUST set `header.counterparty` from the viewer's role (CLIENT viewer → specialist counterparty;
SPECIALIST viewer → company counterparty) and MUST **populate `header.specialty`** from the assigned specialist's profile
when the counterparty is a specialist, leaving it undefined for a company. The existing presence «был(-а) недавно» and
all messaging/authorization semantics MUST be unchanged.

#### Scenario: VM binds counterparty + specialty per viewer role
- GIVEN `getChatThread(gigId, viewer)`
- WHEN the viewer is a CLIENT, `header.counterparty` MUST be `"specialist"` and `header.specialty` MUST be set from the
  specialist's profile
- AND WHEN the viewer is a SPECIALIST, `header.counterparty` MUST be `"company"` and `header.specialty` MUST be undefined

## ADDED Requirements

### Requirement: Conversation Item Shows Gig Status and Unread
Each `ConversationItem` MUST show the gig **status badge** (derived via `gigDisplayStatus`) and an **unread** indicator
alongside the counterparty name, gig-title subtitle, last-message preview, and timestamp, matching the prototype list
item. No field the prototype does not show may be invented.

#### Scenario: Conversation item renders status + unread
- GIVEN a conversation in the list
- WHEN it renders
- THEN it MUST show the gig status badge + the unread indicator + the gig-title subtitle

### Requirement: Chats Reconciliation Keeps the Suite Green
The reconciliation MUST update the affected E2E/VM/unit assertions to the prototype composition and the completed Bio
adoption while preserving every behavioural assertion, and keep the build, token-purity lint, composition lint, and
unit/E2E suites green.

#### Scenario: Tests updated, suite green
- GIVEN `compose-chats.spec.ts`, `chats-vm.test.ts`, `domain-blocks.test.tsx`
- WHEN they run after the reconciliation
- THEN they MUST assert the Bio thread header (name + presence + `Специальность` for a specialist counterparty, collapsed
  for a company) + the conversation-item status/unread, and the `getChatThread` counterparty/specialty binding
- AND the behavioural assertions (inbox list, open thread, send message, search empty-state) MUST still pass
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- `/chats` two-pane reconciled: left «Сообщения» + search + `ConversationItem`s (status badge + unread + gig-title subtitle); right `ChatHeader`/`Bio` + day-separated `MessageBubble` thread + composer «Сообщение…»
- thread header uses `Bio` with a **dynamic** `user` axis (company counterparty collapses `Специальность`, specialist shows it); hard-coded `user: "specialist"` removed
- `getChatThread` binds `header.counterparty` per viewer role + populates `header.specialty` from the specialist profile (undefined for a company); presence stays «был(-а) недавно»
- every messaging flow preserved (select, send, search, participant-only auth); F2 + F5 lints green
- `build` + `lint:tokens` + `lint:composition` + `test:unit` + `compose-chats` E2E green; F1 = structural vs the prototype `chats` frame (≤1% deferred to Phase 4)
