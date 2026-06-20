# Settings Specification

This domain provides account preferences and account deletion, fulfilling the Settings (`/settings`) contract
(`docs/DESIGN_SYSTEM_SPEC.md` — AppShell + Select + Toggle·list + DangerAction). It adds `User` preference fields
(locale + notification toggles), a read/update action, a contract-shaped getter + locale dataset, and a
`deleteAccount` action (cascade + session teardown + confirmation). The Settings screen has no §5 view-model (it binds
primitives), so the "contract" is the data those primitives need. Additive — the auth/profile flows are unaffected.

## Requirements

### Requirement: User Preference Fields
`User` MUST carry a `locale` (default `"ru"`) and notification toggles (default `true`), additively, fulfilling the
Settings Select + Toggle·list.

#### Scenario: Fields exist with backward-compatible defaults
- GIVEN the schema
- WHEN the `User` model is inspected
- THEN it MUST have `locale String @default("ru")`, `notifyApplications Boolean @default(true)`,
  `notifyStatusChanges Boolean @default(true)`, and `notifyMessages Boolean @default(true)`
- AND only these columns are added (no existing column changed); existing users get the defaults

#### Scenario: Toggles align to the notification types
- GIVEN the `Notification.type` enum (`APPLICATION` / `STATUS_CHANGE` / `MESSAGE`)
- WHEN the toggles are considered
- THEN `notifyApplications` ↔ `APPLICATION`, `notifyStatusChanges` ↔ `STATUS_CHANGE`, `notifyMessages` ↔ `MESSAGE`

**Acceptance Criteria:**
- `User` +`locale` (default "ru") + three `notify*` toggles (default true); additive; client regenerated
- Toggles align to the `Notification.type` categories

### Requirement: Read and Update Preferences
`getPreferences` MUST expose the preferences for the Settings screen, and `updatePreferences` MUST update them
(authenticated, locale-validated, partial-safe).

#### Scenario: getPreferences returns the Settings data
- GIVEN a user
- WHEN `getPreferences(userId)` is called
- THEN it MUST return `{ locale, notifyApplications, notifyStatusChanges, notifyMessages }` (the Select value + the
  Toggle states); for a new user these MUST be the defaults (`"ru"`, all `true`)
- AND `LOCALES` (RU default) + `isLocale` MUST exist for the language Select

#### Scenario: updatePreferences updates the supplied fields
- GIVEN an authenticated user calling `updatePreferences`
- WHEN a valid `locale` and/or notification toggles are supplied
- THEN the user's preferences MUST be updated to those values (partial-safe — only fields present in the form), and it
  MUST succeed (`{ success: true }`, save-in-place)

#### Scenario: updatePreferences rejects an invalid locale; requires auth
- GIVEN `updatePreferences`
- WHEN `locale` is supplied but not in `LOCALES`
- THEN it MUST be rejected with a clear error and no change
- AND an unauthenticated caller MUST be redirected to `/login`

**Acceptance Criteria:**
- `getPreferences` returns locale + toggles (defaults for new users); `LOCALES`/`isLocale` exist (RU default)
- `updatePreferences` updates the supplied fields (locale validated), partial-safe, authenticated

### Requirement: Delete Account (cascade, teardown, confirm)
`deleteAccount` MUST let an authenticated user delete **their own** account — confirmed, cascading their full
footprint, and tearing down the session.

#### Scenario: A confirmed delete removes the account and full footprint
- GIVEN an authenticated user calling `deleteAccount` with `confirmEmail` equal to their email
- WHEN it runs
- THEN in a transaction it MUST delete the user's footprint — disputes, reviews, notifications, messages,
  applications, and moderation logs that reference the user **or** are on the user's gigs; unassign the user from
  others' gigs (`assignedSpecialistId → null`); delete the user's gigs; and delete the user (profiles / work
  experience / favorite categories cascade) — with **no FK error**
- AND it MUST tear down the session (`destroySession()`) and redirect

#### Scenario: A wrong/empty confirmation is rejected
- GIVEN `deleteAccount`
- WHEN `confirmEmail` does not equal the caller's email (or is empty)
- THEN it MUST be rejected with a clear error and the account MUST NOT be deleted (unauthenticated → `/login`)

#### Scenario: Only the caller's own account is affected; unrelated data survives
- GIVEN other users with their own gigs/applications/etc., and a gig owned by another client to which the deleting
  user is assigned
- WHEN `deleteAccount` runs for the user
- THEN the unrelated users and their data MUST remain intact, and the others'-gig MUST survive with
  `assignedSpecialistId = null` (not deleted)

**Acceptance Criteria:**
- `deleteAccount` (auth + `confirmEmail` = caller's email) deletes the caller's full footprint in a transaction (no FK error) + tears down the session + redirects
- Wrong/empty confirmation → no deletion; unrelated users + others' gigs survive (gig unassigned)

### Requirement: Additive Verification
The change MUST be additive with the auth/profile flows green and no table/VM/reset changes.

#### Scenario: Additive — suite green, no table/VM/reset change
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with the existing auth/profile/registration/login tests unaffected; there MUST be no new table
  (so no `resetTestDatabase` change) and no `view-models.ts` change; `npm run lint:tokens` + `npm run lint:composition`
  MUST stay green

**Acceptance Criteria:**
- No new table / `view-models.ts` / `resetTestDatabase` change; auth/profile flows green
- `npm run build` + `npm run test:unit` + lints green

## Notes

- **Out of scope (follow-up):** enforcing the notification toggles in `createNotification` (gating notification
  *creation* by the stored preferences) — this domain stores/reads/updates them; the existing notification behaviour
  is unchanged.

## Reconciled Requirements (reconcile-settings, 2026-06-20)

### Requirement: Settings Screen Reconciled to the Prototype
The `/settings` screen MUST remain a composition-pure `@composed-screen` inside `AppShell`, reconciled to the prototype
«Настройки» as four sections, each a `SectionHeader` over kit blocks: **ВНЕШНИЙ ВИД** — **Тема** (Тёмная/Светлая, kept on
the `lib/theme.ts` `[data-theme]` + localStorage switch) and **Язык** (Русский/English) via `CheckField`, and **Валюта**
(₽ Рубль / $ Доллар / € Евро) **display-only** with ₽ Рубль selected (RUB-only — nothing persisted); **УВЕДОМЛЕНИЯ** —
four `ToggleField` rows («Новые отклики», «Сообщения», «Смена статуса гига», «Уведомления об оплатах»); **ПРИВАТНОСТЬ** —
two `ToggleField` rows («Показывать рейтинг в профиле», «Показывать статус «онлайн»»); **АККАУНТ** — a danger «Выйти из
аккаунта» button (the existing `logoutUser`) with the existing delete-account flow preserved; **АКТИВНЫЕ СЕССИИ** — a
`SessionRow` list. The screen MUST be token-pure (F2) and composition-pure (F5); all on-screen text MUST be Russian.

#### Scenario: The four sections + the sessions list render
- GIVEN an authenticated user on `/settings`
- WHEN it renders
- THEN it MUST show ВНЕШНИЙ ВИД (Тема + Язык + Валюта), УВЕДОМЛЕНИЯ (4 toggles), ПРИВАТНОСТЬ (2 toggles), АККАУНТ
  («Выйти из аккаунта» + delete-account), and АКТИВНЫЕ СЕССИИ (a `SessionRow` list)
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: Валюта is display-only RUB
- GIVEN the ВНЕШНИЙ ВИД section
- THEN Валюта MUST show ₽ Рубль selected, and selecting a currency MUST NOT persist anything (the product is RUB-only)

### Requirement: Preferences Extended and Persisted
The `Preferences` type, `getPreferences`, and `updatePreferences` MUST cover `notifyPayments`, `showRatingInProfile`,
`showOnlineStatus` (each a `User` Boolean defaulting `true`) alongside the existing `locale`, `notifyApplications`,
`notifyStatusChanges`, `notifyMessages`. `updatePreferences` MUST stay partial-safe. `getSettings(viewer)` MUST return
the extended `prefs` + `email` + `sessions`.

#### Scenario: Toggling a notification/privacy pref persists across reload
- GIVEN the settings screen
- WHEN a user toggles «Уведомления об оплатах» (or «Показывать статус «онлайн»») off and saves
- THEN `updatePreferences` MUST persist it, and on reload `getSettings` MUST return the updated value while every other
  preference keeps its prior value

#### Scenario: New users get the default preferences
- GIVEN a newly-created user
- THEN `notifyPayments`, `showRatingInProfile`, `showOnlineStatus` MUST default to `true` and `locale` to `ru`

### Requirement: Active Sessions Section (SessionRow)
The settings screen MUST render an «Активные сессии» section via `SessionRow`, from `getActiveSessions(userId,
currentSid)`. The **current** session MUST render `state: "active"`; every other session MUST render `state: "Default"`
with a **terminate** action wired to `terminateSession`. Each row's title MUST be the device parsed from the user-agent
(«{browser} · {OS}») and its description the relative last-active time. Session **location MUST be omitted** (no geo
backend — not fabricated).

#### Scenario: The current session is marked and others can be terminated
- GIVEN a user with two or more sessions
- WHEN `/settings` renders the «Активные сессии» list
- THEN the current session MUST be marked `active`, and each other session MUST offer a terminate action that calls
  `terminateSession`
- AND no row MUST display a fabricated location

**Acceptance Criteria:**
- `/settings` reconciled to the four prototype sections + an «Активные сессии» list; F5-pure; `CheckField` Тема/Язык + display-only ₽ Валюта; 4 `ToggleField` notifications + 2 privacy; «Выйти из аккаунта» + preserved delete-account
- `Preferences` += `notifyPayments`/`showRatingInProfile`/`showOnlineStatus` (default true); `updatePreferences` partial-safe; persist-on-reload verified; `getSettings` returns `prefs` + `email` + `sessions`
- sessions from the real backend (location omitted); F2 + F5 lints + `build` + `test:unit` + `compose-settings` E2E green; F1 = structural (≤1% Phase 4)
- Reconciliation decisions recorded (§10.16 / RC-S25–S27)
