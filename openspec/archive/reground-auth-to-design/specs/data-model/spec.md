# data-model — spec deltas (reground-auth-to-design)

## ADDED Requirements

### Requirement: ClientProfile Location, Timezone, and Position

`ClientProfile` MUST carry `position`, `location`, and `timezone` fields (all `String @default("")`), so the design's client onboarding (Компания / ФИО / Должность / Местоположение+часовой пояс) and profile-edit can persist them. The `timezone` value MUST be validated against the `TIMEZONES` dataset (invalid → `''`), matching the specialist convention.

#### Scenario: Client onboarding persists the design fields

- **WHEN** a CLIENT completes onboarding step 3 with company, contact name (ФИО), должность, and location/timezone
- **THEN** `updateProfile` stores `companyName`, `contactPerson`, `position`, `location`, and a validated `timezone` on the `ClientProfile`

#### Scenario: Invalid timezone rejected

- **WHEN** a non-dataset timezone value is submitted for a client
- **THEN** the stored `timezone` is `''`

#### Scenario: INN/phone remain optional and out of signup

- **WHEN** a client registers
- **THEN** `inn`/`kpp`/`phoneNumber` are not required at signup and remain editable later in profile-edit
