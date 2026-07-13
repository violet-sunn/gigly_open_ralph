# UI spec delta — transport-settings

Transports the Figma settings popup (node `3121:2609`, captured at `design-reference/screens/settings.popup.png`) into the app as a true modal overlay, rendered on `app/_design/tokens.css`, with each section wired to a real backend (existing + cheap new fields). Supersedes the pre-design `/settings` layout.

## ADDED Requirements

### Requirement: Settings renders as the design's modal popup

The settings surface SHALL be presented as the Figma popup: a backdrop-dimmed, centred card (≤900px) with a sticky header «Настройки» showing a section counter and an X-close, scrolling over the current page. It SHALL be opened from the shell gear/«Настройки» control and be deep-linkable + dismissible via a URL query param (`?settings=1`), with backdrop-click / X / Esc closing it. The 6-section body SHALL be a presentational `SettingsPanel` reused by both the modal and the `/settings` route (kept as a deep-link + no-JS fallback). It MUST render on the app's existing tokens/fonts (Handjet/Manrope), not the Figma file's raw Golos Text/SF Compact.

#### Scenario: Open and close the settings modal
- **WHEN** an authenticated user activates the shell «Настройки»/gear control
- **THEN** the «Настройки» modal opens over the current page (backdrop + counter + X-close) showing the 6 section cards, and the URL carries `?settings=1`
- **AND** clicking X, the backdrop, or pressing Esc closes it and returns to the underlying page

#### Scenario: Deep-link and route fallback
- **WHEN** the user navigates directly to `?settings=1` (or to `/settings`)
- **THEN** the same 6-section `SettingsPanel` renders (modal over the page for the query param; full-page for the route)

### Requirement: Every control is either live-and-wired or grayed-and-inert

`SettingsPanel` MUST render all six design sections 1:1, where each control is EITHER fully wired (mutating visible state on interaction + persisting where backed) OR rendered grayed and inert. No control may be a static look-alike, and none fabricates a backend.

**Wired (live + persist):**
- **Учетные данные** — «Имя» edits `displayName` via `updateProfile`.
- **Платежные данные** — currency ₽ RUB / $ USD / € EUR; the selected option updates immediately and persists via the new `UserPreferences.currency`.
- **Уведомления** — all 5 email toggles flip live and persist via `updatePreferences`: `notifyPlatformNews`, `notifyNewGigs` (new fields), `notifyApplications`, `notifyMessages`, `notifyStatusChanges`.
- **Безопасность** — «Активные сессии» per-row terminate (`terminateSession`); each row shows the user's real timezone region («Часовой пояс»), so it reflects that changeable setting; «Завершить все неактивные сеансы» → new `terminateInactiveSessions`.
- **Язык и регион** — «Язык интерфейса» persists `locale` (`updatePreferences`); «Часовой пояс» persists `timezone` (`updateProfile`, `lib/profiles` TIMEZONES) — a personal preference stored on the profile and surfaced on the profile page, so changing it here updates that same value. Both dropdowns reflect the selection immediately.
- **Удалить аккаунт** — «Удалить аккаунт навсегда» runs `deleteAccount` behind its email-confirm gate; «Выйти» → `logoutUser`.

**Grayed + inert (1:1 appearance, non-interactive):**
- **Безопасность → «Двухфакторность»** — explicitly NOT wired (no `twoFactorEnabled` field).
- **Учетные данные → Email, Password, avatar «Загрузить фото»/remove** — no change/verify/storage backend.

A grayed control MUST be visibly muted (e.g. `text/disabled` color / reduced opacity), MUST set `cursor: not-allowed` + `pointer-events: none`, and MUST have no submit/onChange handler.

#### Scenario: A wired toggle visibly flips and persists
- **WHEN** the user clicks a notification toggle
- **THEN** the toggle visibly changes state and `updatePreferences` persists it, so a reload shows the new value

#### Scenario: Currency and language selection change live and persist
- **WHEN** the user selects a different currency and a different language
- **THEN** the selected currency radio and the language dropdown update immediately, and `currency` + `locale` persist (this changes the stored preference and the control's own state — NOT app-wide money reformatting or UI re-translation)

#### Scenario: Timezone persists
- **WHEN** the user picks a timezone
- **THEN** the dropdown updates and `timezone` (via `updateProfile`) is saved and reflected on reload

#### Scenario: Terminate all inactive sessions
- **GIVEN** the user has the current session plus ≥1 other
- **WHEN** they activate «Завершить все неактивные сеансы»
- **THEN** `terminateInactiveSessions` deletes every session except the current `sid`, the list collapses to the current session, and the user stays logged in

#### Scenario: Grayed controls cannot be interacted with
- **WHEN** the user tries to toggle «Двухфакторность» or edit Email / Password / upload an avatar
- **THEN** those controls render muted and do not respond — no state change, no submit, no persisted effect — making it visible they are not changeable

### Requirement: Timezone options cover Russian zones + relocation hubs

The «Часовой пояс» dropdown MUST offer **all 11 major Russian time zones** (Калининград → Камчатка, GMT+2…GMT+12), a curated set of timezones for the most popular places Russian IT specialists relocate to, **and the major world business/tech hubs** (LA, New York, London, Tokyo, etc.). `lib/profiles.TIMEZONES` MUST be the single source (so onboarding and `updateProfile` validation stay in sync), each entry rendered with a Russian `(GMT±N) City` label. Additions are validated automatically by `isTimezone`/`updateProfile` (no value drift).

#### Scenario: Dropdown lists Russian zones, relocation hubs, and major world hubs
- **WHEN** the user opens «Часовой пояс»
- **THEN** it lists the 11 Russian zones, popular relocation hubs (e.g. Тбилиси, Ереван, Алматы, Белград, Стамбул, Дубай, Кипр, Лиссабон, Бангкок/Пхукет, Бали, Ташкент, Бишкек, Буэнос-Айрес), and major world hubs (e.g. Лос-Анджелес, Нью-Йорк, Лондон, Берлин/Париж, Мумбаи, Шанхай, Сингапур, Токио, Сидней, Сан-Паулу), each with a `(GMT±N)` label, and selecting any persists via `updateProfile`

### Requirement: Cheap additive schema + extended preferences VM

The schema MUST gain `UserPreferences.currency` (default `"rub"`), `notifyPlatformNews` + `notifyNewGigs` (default `true`) via a migration; `getSettings`/`Preferences` MUST surface them. `updatePreferences` MUST accept the new fields partial-safely (only fields present in the form are written), preserving its existing semantics. No `twoFactorEnabled` field is added (2FA is grayed). Existing `terminateSession`/`deleteAccount`/`getSettings` signatures MUST be unchanged.

#### Scenario: Migration + VM expose the new fields with safe defaults
- **WHEN** the migration is applied and `getSettings` runs for a user with no prior values
- **THEN** `currency="rub"`, `notifyPlatformNews=true`, `notifyNewGigs=true` are returned, and `updatePreferences` round-trips changes to each

### Requirement: Settings transport keeps the suite green

`npm run build` MUST exit 0 and the settings tests MUST pass — `settings-vm` extended for the new fields and `compose-settings` updated for the 6-section modal (open/close, new toggles, currency, terminate-all, language/timezone), with no weakened assertions.

#### Scenario: Build and settings tests
- **WHEN** `npm run build` and the `settings-vm` + `compose-settings` specs run
- **THEN** they MUST pass (build exit 0), covering the modal open/close, the wired controls, and the new preference fields
