# Spec delta — settings (reconcile-settings)

Reconciles `/settings` to the **`gigly_full_design` prototype** «Настройки» (four sections: ВНЕШНИЙ ВИД · УВЕДОМЛЕНИЯ ·
ПРИВАТНОСТЬ · АККАУНТ), adopting `CheckField`/`ToggleField`, adding the new persisted preferences, the logout action,
and an «Активные сессии» `SessionRow` list (backed by the new session-tracking backend — see the `authentication`
delta). Token-pure (F2) + composition-pure (F5).

## MODIFIED Requirements

### Requirement: Settings Screen Reconciled to the Prototype
The `/settings` screen MUST remain a composition-pure `@composed-screen` inside `AppShell`, reconciled to the prototype
«Настройки» as four sections, each a `SectionHeader` over kit blocks:
- **ВНЕШНИЙ ВИД** — **Тема** (Тёмная/Светлая, kept on the `lib/theme.ts` `[data-theme]` + localStorage switch) and
  **Язык** (Русский/English) rendered via `CheckField` (or the themed `Select`); **Валюта** (₽ Рубль / $ Доллар /
  € Евро) rendered **display-only** with ₽ Рубль selected and the others disabled (RUB-only — nothing persisted).
- **УВЕДОМЛЕНИЯ** — four `ToggleField` rows: «Новые отклики», «Сообщения», «Смена статуса гига», «Уведомления об оплатах».
- **ПРИВАТНОСТЬ** — two `ToggleField` rows: «Показывать рейтинг в профиле», «Показывать статус «онлайн»».
- **АККАУНТ** — a danger **«Выйти из аккаунта»** button (the existing `logoutUser` action); the existing delete-account
  flow MUST be preserved.
- **АКТИВНЫЕ СЕССИИ** — a `SessionRow` list (current session marked `active`; others `Default` + a terminate action).
The screen MUST be token-pure (F2) and composition-pure (F5), and all on-screen text MUST be Russian.

#### Scenario: The four sections + the sessions list render
- GIVEN an authenticated user on `/settings`
- WHEN it renders
- THEN it MUST show ВНЕШНИЙ ВИД (Тема + Язык + Валюта), УВЕДОМЛЕНИЯ (4 toggles), ПРИВАТНОСТЬ (2 toggles), АККАУНТ
  («Выйти из аккаунта» + delete-account), and АКТИВНЫЕ СЕССИИ (a `SessionRow` list)
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: Валюта is display-only RUB
- GIVEN the ВНЕШНИЙ ВИД section
- WHEN it renders
- THEN Валюта MUST show ₽ Рубль selected with the other options disabled, and selecting a currency MUST NOT persist
  anything (the product is RUB-only)

### Requirement: Preferences Extended and Persisted
The `Preferences` type, `getPreferences`, and the `updatePreferences` server action MUST cover the new toggles —
`notifyPayments`, `showRatingInProfile`, `showOnlineStatus` (each a `User` Boolean defaulting `true`) — alongside the
existing `locale`, `notifyApplications`, `notifyStatusChanges`, `notifyMessages`. `updatePreferences` MUST stay
partial-safe (only fields present in the form are updated). `getSettings(viewer)` MUST return the extended `prefs` +
`email` + `sessions`.

#### Scenario: Toggling a notification/privacy pref persists across reload
- GIVEN the settings screen
- WHEN a user toggles «Уведомления об оплатах» (or «Показывать статус «онлайн»») off and saves
- THEN `updatePreferences` MUST persist it, and on reload `getSettings` MUST return the updated value while every other
  preference keeps its prior value

#### Scenario: New users get the default preferences
- GIVEN a newly-created user
- WHEN `getSettings` runs
- THEN `notifyPayments`, `showRatingInProfile`, `showOnlineStatus` MUST default to `true` (with the existing
  preferences), and `locale` MUST default to `ru`

## ADDED Requirements

### Requirement: Active Sessions Section (SessionRow)
The settings screen MUST render an «Активные сессии» section listing the viewer's active sessions via the `SessionRow`
block, from `getActiveSessions(userId, currentSid)`. The **current** session MUST render with `state: "active"` (a
«Текущая»/current marker); every other session MUST render with `state: "Default"` and a **terminate** action wired to
`terminateSession`. Each row's title MUST be the device parsed from the user-agent («{browser} · {OS}») and its
description the relative last-active time. Session **location MUST be omitted** (no geo backend — not fabricated).

#### Scenario: The current session is marked and others can be terminated
- GIVEN a user with two or more sessions
- WHEN `/settings` renders the «Активные сессии» list
- THEN the current session MUST be marked `active` (no terminate action on itself beyond logout), and each other session
  MUST offer a terminate action that calls `terminateSession`
- AND no row MUST display a fabricated location

**Acceptance Criteria:**
- `/settings` reconciled to the four prototype sections (ВНЕШНИЙ ВИД/УВЕДОМЛЕНИЯ/ПРИВАТНОСТЬ/АККАУНТ) + an «Активные сессии» list; F5-pure
- `CheckField` for Тема/Язык + display-only Валюта (RUB); 4 `ToggleField` notifications + 2 `ToggleField` privacy; «Выйти из аккаунта» + preserved delete-account
- `Preferences` += `notifyPayments`/`showRatingInProfile`/`showOnlineStatus` (User Booleans, default true); `updatePreferences` partial-safe; persist-on-reload verified
- `getSettings` returns `prefs` + `email` + `sessions: SessionRowVM[]`; sessions from the real backend; location omitted
- F2 + F5 lints green; `build` + `test:unit` + `compose-settings` E2E green; F1 = structural vs the prototype (≤1% Phase 4)
