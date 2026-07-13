# UI spec delta — transport-chats-finance-profile

> Reconcile the communication, finance, and profile screens to the captured prototype reference, and migrate profile editing from the standalone `/profile/edit` route into the prototype's on-screen modals. Token-NAME differences (raw CSS var vs app token) are NOT discrepancies — only visual value / structure / copy.

## ADDED Requirements

### Requirement: Chats screen matches the captured reference and stays in `/chats` after sending

The `/chats` screen (`ChatsDesign`) SHALL match `design-reference/screens/chats.specialist.*` and `chats.company.*` for the dialog list and the active thread, and sending a message SHALL keep the user on `/chats`.

#### Scenario: Dialog list matches the reference
- **WHEN** `/chats` renders with one or more conversations
- **THEN** the left pane shows the «Сообщения» header, the live client-side search field, and one row per conversation (counterparty, last-message preview, timestamp, and unread treatment) styled per the captured reference

#### Scenario: Live search filters the dialog list client-side
- **WHEN** the user types into the dialog-list search field
- **THEN** the list filters to matching conversations without a server round-trip, and clearing the field restores the full list

#### Scenario: Active thread matches the reference
- **WHEN** a conversation is selected
- **THEN** the right pane shows the counterparty header, day-separated message bubbles with the outgoing/read treatment from the reference, and the composer

#### Scenario: Sending a message keeps the user in chats
- **WHEN** the user sends a message from `/chats` via Enter or the send button
- **THEN** the message is persisted via `sendMessage` and the user remains on `/chats` with the new message shown in the thread (NOT redirected to `/gigs/[id]`)

#### Scenario: Gig-detail messaging is unaffected
- **WHEN** a message is sent from the gig-detail screen
- **THEN** `sendMessage` still redirects to `/gigs/[id]` as before (the chats behavior is opt-in via an explicit redirect target)

### Requirement: Finances screen matches the captured reference for both roles

The `/finances` screen (`FinancesDesign`) SHALL match `design-reference/screens/finance.specialist.*` (earnings) and `finance.company.*` (spend + service fee) for the stat tiles and the «Операции» ledger.

#### Scenario: Specialist earnings view
- **WHEN** a SPECIALIST opens `/finances`
- **THEN** the stat tiles show the earnings figures and the ledger lists their operations, styled per `finance.specialist`

#### Scenario: Company spend view
- **WHEN** a CLIENT opens `/finances`
- **THEN** the stat tiles show spend and the service fee, and the ledger lists their operations, styled per `finance.company`

### Requirement: Profile screen matches the captured reference for both roles

The `/profile` screen (`ProfileDesign`) SHALL match `design-reference/screens/profile.specialist.*` and `profile.company.*`.

#### Scenario: Specialist profile
- **WHEN** a SPECIALIST opens `/profile`
- **THEN** the screen shows the ID card and the Стек / Опыт / Избранные категории / Реализованные проекты blocks per the reference

#### Scenario: Company profile
- **WHEN** a CLIENT opens `/profile`
- **THEN** the screen shows the ID card and the Реквизиты panel (name / ИНН / КПП / about) per the reference

### Requirement: Profile editing is modal-based on the profile screen

Profile editing SHALL occur via modals opened from the profile screen's pencils, persisting through the existing profile actions. There SHALL be no standalone profile-edit screen.

#### Scenario: Edit description (bio) modal
- **WHEN** a SPECIALIST clicks the description pencil and saves
- **THEN** a modal matching `profile.specialist.modal-bio` («Редактировать описание») submits to `updateProfile`, the bio persists, and the other specialist fields (displayName, techStack, experienceLevel) are preserved unchanged

#### Scenario: Edit favorite categories modal
- **WHEN** a SPECIALIST clicks the categories pencil and saves a selection
- **THEN** a modal matching `profile.specialist.modal-cats` («Избранные категории», marker «Выберите направления») submits the chosen categories to `setFavoriteCategories` and the selection persists

#### Scenario: Edit stack modal
- **WHEN** a SPECIALIST clicks the stack pencil and saves
- **THEN** a modal matching `overlay.profStack` («Редактировать стек») submits to `updateProfile` with the new techStack, and the other specialist fields are preserved unchanged

#### Scenario: Edit company requisites modal
- **WHEN** a CLIENT clicks the requisites pencil and saves
- **THEN** a design-vocab modal (same skin as the specialist edit modals; no captured reference) submits company fields (companyName / inn / kpp / contactPerson / phoneNumber) to `updateProfile`, the values persist, and non-edited company fields are preserved

#### Scenario: A modal edit does not clobber sibling fields
- **WHEN** any edit modal that submits to `updateProfile` is saved
- **THEN** the request carries the profile's other current field values (hidden), so editing one field does not blank the others in the upsert

### Requirement: The `/profile/edit` route is retired

The `/profile/edit` route SHALL redirect to `/profile`; editing happens only through the on-screen modals.

#### Scenario: Visiting the old edit route
- **WHEN** a user navigates to `/profile/edit`
- **THEN** they are redirected to `/profile`

#### Scenario: Profile pencils open modals, not the route
- **WHEN** a user clicks any edit pencil on `/profile`
- **THEN** the corresponding modal opens in place (no navigation to `/profile/edit`)

## Notes (non-normative)

- **Documented edit-surface narrowing:** the captured modals cover bio / categories / stack (+ the new company requisites). `displayName` and `experienceLevel` are not exposed for post-onboarding UI editing (no captured modal); they are preserved through `updateProfile`. `setWorkExperience` (structured «Опыт» entries) has no captured modal and remains out of scope.
- **Deletion of `ProfileEditForm.tsx` / `ProfileEditHeader.tsx`** is pending user confirmation; until then they stay dormant behind the redirect. The `updateProfile` action is retained (the modals depend on it).
