# testing — e2e-finances delta

## MODIFIED Requirements

### Requirement: «Финансы» screen E2E coverage

The E2E suite SHALL verify the rebuilt finances screen at `/finances` (`app/(protected)/finances/FinancesDesign.tsx`) — the role-aware stat tiles, the «Операции» ledger (heading + count), and the operation rows — rather than the removed kit framing/footer/empty-state/nav-class DOM. The spec MUST NOT assert «Суммы логические, без реальных платежей.», a «Баланс» footer, the empty text «Пока нет операций», or the kit class `bg-surface-level-3` (none exist in the rebuilt component). App/lib behaviour (`getFinances`, `getFinanceStats`, `getLedger`) MUST NOT change.

#### Scenario: a CLIENT sees their three stat tiles and the «Операции» ledger

- **GIVEN** a CLIENT «ООО Финанс» with a `PAID` gig and an `IN_PROGRESS` gig (both assigned to specialist «Иван Финанс») seeded into `file:./test.db`
- **WHEN** the client visits `/finances`
- **THEN** the stat-tile labels «Выплачено», «В резерве», and «Сервисный сбор» are visible
- **AND** the «Операции» heading and its count badge (`2`) are visible
- **AND** the `PAID` gig title row is visible with status «Оплачено»
- **AND** the `IN_PROGRESS` gig title row is visible with status «В работе»
- **AND** the specialist counterparty name «Иван Финанс» is visible as a row subtitle

#### Scenario: a SPECIALIST sees the specialist stat tiles and role-aware ledger amounts

- **GIVEN** the assigned SPECIALIST «Иван Финанс» (same seeded gigs)
- **WHEN** the specialist visits `/finances`
- **THEN** the stat-tile labels «Заработано», «На проверке», and «В работе» are visible
- **AND** the «Операции» ledger lists the gig rows with the company counterparty «ООО Финанс» as the subtitle
- **AND** the role-aware budget amount (e.g. «100 000 ₽») is visible

#### Scenario: a user with no lifecycle gigs sees the empty ledger

- **GIVEN** a CLIENT with no `IN_PROGRESS`/`REVIEW`/`COMPLETED`/`PAID` gigs
- **WHEN** the user visits `/finances`
- **THEN** the «Операций пока нет.» empty-state text is visible
