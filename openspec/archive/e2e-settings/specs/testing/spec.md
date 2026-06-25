# testing — e2e-settings delta

## MODIFIED Requirements

### Requirement: «Настройки» screen E2E coverage

The E2E suite SHALL verify the rebuilt settings screen at `/settings` (`app/(protected)/settings/SettingsDesign.tsx`) — the five sections (ВНЕШНИЙ ВИД, УВЕДОМЛЕНИЯ, ПРИВАТНОСТЬ, АКТИВНЫЕ СЕССИИ, АККАУНТ), the theme segmented control wired to `lib/theme`, the notification/privacy persistence round-trip through `updatePreferences`, the active-sessions terminate action, and the reveal-to-confirm delete-account flow — rather than the removed kit DOM. The spec MUST NOT assert the section names as `heading` roles, MUST NOT use `getByRole('switch', …)` / `aria-checked` for the toggles (the rebuilt `Toggle` is a bare `<div>` with no role, no `aria-checked`, and no accessible name — its state is carried by the row's hidden `<input name value="true|false">`), and MUST NOT name the session-terminate button «Удалить сессию» (it is «Завершить»). App/lib behaviour (`getSettings`, `getActiveSessions`, `getPreferences`, `updatePreferences`, `terminateSession`, `deleteAccount`, `logoutUser`, `lib/theme`, `lib/user-agent`) MUST NOT change.

#### Scenario: the sidebar gear routes to /settings

- **GIVEN** an authenticated CLIENT
- **WHEN** they click the sidebar gear `a[href="/settings"]` from `/dashboard`
- **THEN** the URL is `/settings`

#### Scenario: the five sections and ВНЕШНИЙ ВИД controls render

- **GIVEN** an authenticated CLIENT «ООО Настройки» on `/settings`
- **THEN** the section labels «ВНЕШНИЙ ВИД», «УВЕДОМЛЕНИЯ», «ПРИВАТНОСТЬ», «АКТИВНЫЕ СЕССИИ», and «АККАУНТ» are visible (as text, not `heading` roles)
- **AND** the Тема segmented options «Тёмная» and «Светлая» are visible
- **AND** the Язык option «Русский» and the display-only currency «₽ Рубль» are visible
- **AND** the notification labels «Новые отклики» / «Сообщения» / «Уведомления об оплатах» and the privacy label «Показывать статус «онлайн»» are visible
- **AND** the «Выйти из аккаунта» button is visible

#### Scenario: the Тема segmented control switches the theme via lib/theme

- **GIVEN** an authenticated CLIENT on `/settings`
- **WHEN** they click «Светлая»
- **THEN** the root `<html>` has `data-theme="light"`
- **WHEN** they then click «Тёмная»
- **THEN** the root `<html>` has `data-theme="dark"`

#### Scenario: toggling a notification and saving persists through updatePreferences

- **GIVEN** an authenticated CLIENT on `/settings` whose `notifyMessages` defaults on (hidden `input[name="notifyMessages"]` value `true`)
- **WHEN** they click the «Сообщения» toggle (the toggle `<div>` following the label) and click «Сохранить»
- **THEN** «Настройки сохранены.» is visible
- **AND** the hidden `input[name="notifyMessages"]` value is now `false`
- **WHEN** the page is reloaded
- **THEN** the hidden `input[name="notifyMessages"]` value persists `false`

#### Scenario: an active session is listed and can be terminated

- **GIVEN** a CLIENT with a seeded `Session` row whose user-agent parses to «Chrome · Windows»
- **WHEN** they view `/settings`
- **THEN** the «АКТИВНЫЕ СЕССИИ» section lists «Chrome · Windows»
- **WHEN** they click that row's «Завершить» button
- **THEN** after the refresh the «Chrome · Windows» row is gone

#### Scenario: delete-account rejects a wrong email and tears down on the correct one

- **GIVEN** a SPECIALIST «Удаляемый» on `/settings`
- **WHEN** they click «Удалить аккаунт»
- **THEN** «Это действие необратимо…» and the `input[name="confirmEmail"]` are revealed
- **WHEN** they submit a non-matching email via «Подтвердить удаление»
- **THEN** an error matching `/type your account email/i` is shown and the URL is still `/settings`
- **WHEN** they (after a reload) submit their correct email
- **THEN** the account is deleted and the browser is redirected to `/`
