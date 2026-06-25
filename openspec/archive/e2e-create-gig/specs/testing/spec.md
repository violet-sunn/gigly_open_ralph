# testing — e2e-create-gig delta

## MODIFIED Requirements

### Requirement: «Создать гиг» guided-brief E2E coverage

The E2E suite SHALL verify the rebuilt create-gig screen at `/gigs/new` (`app/(protected)/gigs/new/CreateGigDesign.tsx`) by driving the form through its **stable `name=` contract** and asserting the prototype's design surfaces, rather than the removed kit/label-association DOM. The spec MUST NOT use `getByLabel(...)` for these controls (the component's `<label>`s are unassociated), MUST NOT treat the category chips as `radio`s (they are clickable `<div>`s), and MUST NOT assert a «Сводка (комиссия)» heading (it does not exist). App/lib behaviour (`createGig`, `CreateGigSuccess`, `lib/categories`) MUST NOT change.

#### Scenario: the guided brief renders with its four cards, readiness panel, and fee summary

- **GIVEN** a seeded CLIENT session (`setE2ESession`) and the canonical categories upserted into `file:./test.db`
- **WHEN** the client visits `/gigs/new`
- **THEN** the four brief cards «Что нужно сделать?», «Как поймём, что готово?», «Что важно учесть?», and «Условия» are visible
- **AND** the readiness panel «Готовность брифа» is visible with the «Заполнено» label and a `N / 7` score
- **AND** the fee summary rows «Сервисный сбор (10%)» and «Итого к оплате» are visible
- **AND** the «Опубликовать гиг» submit button is present

#### Scenario: fields fill via the unchanged name= selectors and a category chip sets the hidden slug

- **GIVEN** the create-gig screen
- **WHEN** the client fills `input[name="title"]`, `textarea[name="description"]`, `input[name="goal"]`, `textarea[name="deliverables"]`, `input[name="budget"]`, and `input[name="deadlineDays"]`
- **AND** clicks the category chip text «Программирование»
- **THEN** each field holds its typed value
- **AND** the hidden `input[name="category"]` has value `programming`

#### Scenario: the criteria editor adds a criterion via the input + «Добавить» and via a suggestion chip

- **GIVEN** the create-gig screen
- **WHEN** the client types a criterion (≥ 50 chars) into the criterion input and clicks «Добавить»
- **THEN** a «Готово, когда …» row containing that text is visible
- **AND** the hidden `input[name="acceptanceCriteria"]` holds the criterion
- **AND** clicking a suggestion chip («Есть тесты» / «Передача исходников» / «Документация») appends a second criterion row

#### Scenario: a tag chip adds via Enter and writes the hidden comma-joined tags

- **GIVEN** the create-gig screen
- **WHEN** the client types a tag into the tag input and presses Enter
- **THEN** the tag chip renders
- **AND** the hidden `input[name="tags"]` holds the comma-joined value

#### Scenario: the fee summary tracks the budget live

- **GIVEN** the create-gig screen
- **WHEN** the client fills `input[name="budget"]` with `100000`
- **THEN** the «Сервисный сбор (10%)» value shows `10 000 ₽` (whitespace-tolerant; `ru-RU` uses a non-breaking thousands separator)
- **AND** the «Итого к оплате» value shows `110 000 ₽`

#### Scenario: the readiness checklist advances as the brief is completed

- **GIVEN** the create-gig screen
- **WHEN** the client fills the title, picks a category, writes a ≥ 20-char description, fills the goal and deliverables, adds one criterion, and fills budget + deadline
- **THEN** the «Заполнено» score reaches `7 / 7`

#### Scenario: publishing a valid brief lands on the «Гиг опубликован» success screen

- **GIVEN** a completed valid brief (title, category, description ≥ 20 chars, goal, deliverables, one ≥ 50-char criterion, positive budget, deadline)
- **WHEN** the client clicks «Опубликовать гиг»
- **THEN** the browser navigates to `**/gigs/new/success`
- **AND** «Гиг опубликован» and the «К моим гигам» button are visible
