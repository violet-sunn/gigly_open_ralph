# testing — e2e-chats delta

## MODIFIED Requirements

### Requirement: «Чаты» two-pane inbox E2E coverage

The E2E suite SHALL verify the rebuilt messaging inbox at `/chats` (`app/(protected)/chats/ChatsDesign.tsx`) — the conversation list, row selection, the thread, and the composer — rather than the removed kit `SearchPanel`/`role=search` DOM or the removed gig-detail chat. The spec MUST NOT use `getByRole('search')` / `getByRole('searchbox')` / a «Найти» submit button (search is a live-filtering plain input), MUST NOT assert the thread-header specialty `Backend-разработчик` (the design header renders name + presence only), and MUST NOT post messages via `textarea[name="content"]` on `/gigs/[id]` (that control no longer exists). App/lib behaviour (`sendMessage`, `getConversations`, `getChatThread`) MUST NOT change; `sendMessage` still redirects to `/gigs/[id]`.

#### Scenario: the inbox lists a conversation with counterparty, project, status, unread, and preview

- **GIVEN** a CLIENT viewer with an assigned `IN_PROGRESS` gig and two messages from the specialist counterparty («Иван Спец»)
- **WHEN** the client visits `/chats`
- **THEN** the «Сообщения» heading is visible
- **AND** the counterparty name «Иван Спец» is visible
- **AND** the project subtitle (the gig title) is visible
- **AND** the gig-status badge «В работе» is visible
- **AND** the unread badge `2` is visible
- **AND** the last-message preview text is visible

#### Scenario: selecting a conversation row navigates to /chats?gig=<id> and opens the thread

- **GIVEN** the inbox at `/chats`
- **WHEN** the client clicks the conversation row
- **THEN** the URL becomes `/chats?gig=<gigId>`
- **AND** the composer textbox (`getByRole('textbox', { name: 'Сообщение' })`) is visible

#### Scenario: the open thread renders the day separator, bubbles, and the composer

- **GIVEN** the client opens `/chats?gig=<gigId>`
- **THEN** a day-separator label (the `ru-RU` long date of the messages) is visible
- **AND** both seeded message bodies are visible as thread bubbles
- **AND** the composer textbox `getByRole('textbox', { name: 'Сообщение' })` is visible
- **AND** the send button `getByLabel('Отправить')` is visible

#### Scenario: sending a message via the composer reuses sendMessage and persists

- **GIVEN** the client opens `/chats?gig=<gigId>`
- **WHEN** the client fills the composer textbox and clicks «Отправить»
- **THEN** the browser navigates to `/gigs/<gigId>` (the unchanged `sendMessage` redirect)
- **AND** re-opening `/chats?gig=<gigId>` shows the new message as a thread bubble

#### Scenario: the live search filters the conversation list

- **GIVEN** the inbox at `/chats`
- **WHEN** the client types a non-matching query into `getByPlaceholder('Поиск по названию или описанию')`
- **THEN** the counterparty «Иван Спец» is no longer present (count 0)
- **AND** «Чаты не найдены.» is visible

#### Scenario: the full client↔specialist messaging flow runs through /chats

- **GIVEN** a programmatic setup (CLIENT, OPEN gig, SPECIALIST, ACCEPTED application, gig → `IN_PROGRESS` + assigned)
- **WHEN** the client sends the first message at `/chats?gig=<id>` via the composer
- **THEN** `sendMessage` redirects to `/gigs/<id>` and the DB holds 1 message from the client
- **AND** the specialist, at `/chats?gig=<id>`, sees the client's message and sends a reply (DB holds 2 messages, ordered chronologically)
- **AND** the client, re-opening `/chats?gig=<id>`, sees both messages
- **AND** the final gig/application/message DB state matches the expected `IN_PROGRESS` + `ACCEPTED` + 2-message outcome
