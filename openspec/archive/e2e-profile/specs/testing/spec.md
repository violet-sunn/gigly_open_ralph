# testing — e2e-profile delta

## MODIFIED Requirements

### Requirement: «Профиль» screen E2E coverage

The E2E suite SHALL verify the rebuilt profile screen at `/profile` and `/profile/[userId]` (`app/(protected)/profile/ProfileDesign.tsx`) — the ID card (name + role tag + verified + member-since for a SPECIALIST; the «Реквизиты» ИНН/КПП panel for a CLIENT), the SPECIALIST «Стек»/«Опыт»/«Избранные категории»/«Реализованные проекты» blocks, the read-only public view, and the owner Pencil → `/profile/edit` round-trip — rather than the removed kit `ProfileHeader` DOM. The spec MUST NOT assert the availability pill «Не в сети» (the rebuilt pill renders the literal `offline`), MUST NOT assert that a `heading` named «Профиль» has count 0 (the shell header now renders an `<h1>` «ПРОФИЛЬ»), and MUST NOT drive the edit flow through a «Редактировать профиль»/«Редактировать» button (the rebuilt edit affordance is a bare Pencil `<span>` with no accessible name). App/lib behaviour (`getProfile`, `ProfileDesign`, `GigCard`, the `/profile/edit` form) MUST NOT change.

#### Scenario: a SPECIALIST owner sees the ID card and the four blocks

- **GIVEN** a SPECIALIST «Иван Иванов» with `position` «Senior Frontend Engineer», `techStack` containing «WebSocket», `phoneVerified`, a work-experience entry at «Yandex», a favorite category «Маркетинг», and a COMPLETED realized gig «E2E Profile Realized Gig», seeded into `file:./test.db`
- **WHEN** the owner visits `/profile`
- **THEN** the shell `<h1>` «ПРОФИЛЬ» is the page title
- **AND** the ID card shows «Иван Иванов», the role tag «Senior Frontend Engineer», «Номер телефона верифицирован», and a «На платформе с …» line
- **AND** the «Стек» block shows the tag «WebSocket»
- **AND** the «Опыт» block shows «Yandex»
- **AND** the «Избранные категории» block shows «Маркетинг»
- **AND** the «Реализованные проекты» block shows the realized gig card «E2E Profile Realized Gig»

#### Scenario: a CLIENT owner sees the «Реквизиты» panel

- **GIVEN** a CLIENT «ООО Зритель» with `inn` «7700000001»
- **WHEN** the client visits `/profile`
- **THEN** the role tag «Заказчик» and the «Реквизиты» panel are visible
- **AND** the «ИНН» label and the value «7700000001» and the «КПП» label are visible
- **AND** the SPECIALIST-only «Стек» block is absent

#### Scenario: the public profile renders read-only with no edit affordance

- **GIVEN** the non-owner CLIENT viewer
- **WHEN** they visit `/profile/[specId]`
- **THEN** the specialist sections «Стек» (with «WebSocket») and «Опыт» (with «Yandex») render
- **AND** there is no edit Pencil beside the name (the name span has no following-sibling pencil span)

#### Scenario: the owner edit Pencil navigates to /profile/edit and a save round-trips

- **GIVEN** the SPECIALIST owner on `/profile`
- **WHEN** they click the Pencil beside the name (the name's following-sibling `<span>`)
- **THEN** the URL matches `/profile/edit`
- **WHEN** they change `#displayName` to «Иван Обновлённый» and click «Save Profile»
- **THEN** the URL returns to `/profile`
- **AND** the new name «Иван Обновлённый» is visible
