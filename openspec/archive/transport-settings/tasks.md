# Tasks — transport-settings

> Reference: Figma node `3121:2609` → `design-reference/screens/settings.popup.png`. Owner decisions: **true 1:1 modal popup** + **every control live-or-gray** + **2FA NOT wired (grayed)**. Render on `app/_design/tokens.css` (Handjet/Manrope), NOT Golos Text/Tailwind. Wired controls must visibly mutate state on interaction + persist; non-wired controls (2FA, email, password, avatar upload) render 1:1 but grayed + inert (`text/disabled`, reduced opacity, `cursor:not-allowed`, `pointer-events:none`, no handler). Never fabricate a backend.

## 1. Backend — cheap additive schema + actions

- [x] **Schema fields** added to `User` — `currency String @default("rub")`, `notifyPlatformNews Boolean @default(true)`, `notifyNewGigs Boolean @default(true)`. (NO `twoFactorEnabled` — 2FA is grayed.) Applied via **`prisma db push`** (the project's de-facto mechanism — both E2E `global-setup` and the integration `db.ts` apply schema with `db push`; chosen over `migrate dev` to avoid drift and not reset dev.db) + `prisma generate`. Defaults apply to existing rows.
- [x] **Extended `updatePreferences`** (app/actions/settings.ts) partial-safely: `currency` (validated ∈ {rub,usd,eur}), `notifyPlatformNews`, `notifyNewGigs`. Existing fields + semantics untouched. (`settings-actions.test.ts` ✓)
- [x] **New partial-safe profile actions** (app/actions/settings.ts): `updateAccountName` («Имя» → SPECIALIST `displayName` / CLIENT `contactPerson`) and `updateTimezone` («Часовой пояс`). These replace using the full `updateProfile` upsert, which would CLOBBER other profile fields — verified non-clobbering in `settings-actions.test.ts`. Plus `loadSettings()` (lazy data load for the modal).
- [x] **New action `terminateInactiveSessions()`**: deletes all of the caller's `Session` rows except `session.sid`; ownership-scoped; current session preserved. (`settings-actions.test.ts`: 3 sessions → leaves exactly the current `sid` ✓)
- [x] **VM:** extended `Preferences` + `getPreferences`/`DEFAULT_PREFERENCES` + `SettingsData` (now also surfaces `timezone` + `name`). (`settings-vm.test.ts` + `account-preferences.test.ts` ✓)
- [x] **Expanded `lib/profiles.TIMEZONES`** + added the `TIMEZONE_LABELS` map + `timezoneLabel()`. 11 Russian zones + relocation/IT hubs + major world hubs, ordered by offset (`timezones.test.ts`: every entry labelled + hub coverage + `isTimezone` ✓). Mapping (IANA → label):
  - `Europe/Lisbon` → «(GMT+0) Лиссабон» · `Europe/Belgrade` → «(GMT+1) Белград, Подгорица» · `Asia/Nicosia` → «(GMT+2) Кипр (Лимасол)»
  - `Europe/Istanbul` → «(GMT+3) Стамбул» · `Asia/Tbilisi` → «(GMT+4) Тбилиси» · `Asia/Yerevan` → «(GMT+4) Ереван» · `Asia/Dubai` → «(GMT+4) Дубай»
  - `Asia/Almaty` → «(GMT+5) Алматы, Астана» · `Asia/Tashkent` → «(GMT+5) Ташкент» · `Asia/Bishkek` → «(GMT+6) Бишкек»
  - `Asia/Bangkok` → «(GMT+7) Бангкок, Пхукет» · `Asia/Makassar` → «(GMT+8) Бали» · `America/Argentina/Buenos_Aires` → «(GMT−3) Буэнос-Айрес»
  - **Major world hubs (MUST include):** `America/Los_Angeles` → «(GMT−8) Лос-Анджелес, Сан-Франциско» · `America/Chicago` → «(GMT−6) Чикаго» · `America/New_York` → «(GMT−5) Нью-Йорк» · `America/Sao_Paulo` → «(GMT−3) Сан-Паулу» · `Europe/London` → «(GMT+0) Лондон» · `Europe/Berlin` → «(GMT+1) Берлин, Париж» · `Asia/Kolkata` → «(GMT+5:30) Мумбаи, Бангалор» · `Asia/Shanghai` → «(GMT+8) Шанхай, Пекин» · `Asia/Singapore` → «(GMT+8) Сингапур» · `Asia/Tokyo` → «(GMT+9) Токио» · `Australia/Sydney` → «(GMT+10) Сидней»
  - Also label the existing Russian zones (Москва→«(GMT+3) Москва, Санкт-Петербург», etc.). Labels use each zone's standard offset (DST not dynamically computed — acceptable for a preference label).
  - Suggested ordering: group by offset ascending (GMT−8 → GMT+12) so the dropdown reads geographically.
  - Note: shared list → the onboarding step-3 timezone select widens too; `isTimezone`/`updateProfile` validation auto-covers the additions (no separate validator change).
  - Test: `isTimezone` accepts each new IANA id; the label map has an entry for every `TIMEZONES` value (no orphans).

## 2. Presentational body — `SettingsPanel`

- [x] Shared **`inert`** style (`opacity:.45`, `cursor:not-allowed`, `pointer-events:none`, no handler) on every non-wired control — consistent, obvious "can't be changed".
- [x] Created `app/(protected)/settings/SettingsPanel.tsx` — all 6 section cards **1:1** on tokens.css with inline section icons + control state. Every control WIRED (optimistic local state → autosave) or GRAYED (inert). Wired controls autosave on change (no Save button — matches the popup) with a transient «Сохранено». NOTE: section 6 is «Удалить аккаунт навсегда» only — «Выйти» stays in the sidebar (the Figma popup has no logout). Section breakdown:
  1. **Учетные данные** (person-circle) — «Фото профиля»: avatar + «Загрузить фото» + remove → **GRAYED**. «Данные аккаунта»: Имя → **WIRED** (`updateProfile` `displayName`); Email + Password → **GRAYED**.
  2. **Платежные данные** (credit-card) — «Валюта получения выплат»: ₽ RUB / $ USD / € EUR radio → **WIRED** (`currency`); the chosen radio updates immediately.
  3. **Уведомления** (bell) — «Email-уведомления»: 5 toggles, all **WIRED** + flip live (Новости и обновления платформы→`notifyPlatformNews`, Новые гиги по вашему стеку→`notifyNewGigs`, Отклики на заявки→`notifyApplications`, Новые сообщения в чатах→`notifyMessages`, Изменение статуса гига→`notifyStatusChanges`).
  4. **Безопасность** (shield-lock) — «Двухфакторность» toggle → **GRAYED/inert** (NOT wired); «Активные сессии» rows → **WIRED** (device + relative time + the user's real timezone region from «Часовой пояс», «Текущий» badge for active, trash → `terminateSession`); «Завершить все неактивные сеансы» → **WIRED** (`terminateInactiveSessions`).
  5. **Язык и регион** (globe2) — «Язык интерфейса» dropdown → **WIRED** (`locale`, reflects selection live); «Часовой пояс» dropdown → **WIRED** (`timezone`, `lib/profiles` TIMEZONES).
  6. **Удалить аккаунт** — «Удалить аккаунт навсегда» (red + trash) → **WIRED** (`deleteAccount` email-confirm gate). Plus «Выйти» → **WIRED** (`logoutUser`).
  - Done: presentational (data + actions via props/imports). Figma tokens → app tokens. Wired controls hold local state → visible change → autosave. Session-row region derived from the user's real timezone label (`timezoneCity`), never fabricated geolocation.
- [x] Folded the old `SettingsDesign.tsx` → now a thin wrapper that renders `<SettingsPanel/>` (keeps the `/settings` route + its import in `page.tsx` unchanged).

## 3. Modal overlay + trigger

- [x] **Query-param modal** `app/(protected)/settings/SettingsModal.tsx`: renders on `?settings=1` (backdrop + centred card + sticky «Настройки» header with the «6» counter + X-close) over the current page; lazy-loads via the `loadSettings` server action; body IS `SettingsPanel`. Backdrop-click / X / **Esc** strip the param. NOTE: mounted inside `AppShellDesign` (which reads `?settings=1` via `useSearchParams`) rather than the layout — Next layouts don't receive `searchParams`; the client shell is the correct seam and keeps `children` rendered underneath.
- [x] **Shell trigger:** the `AppShellDesign` gear is now a button → `router.push(...?settings=1)` on the current path.
- [x] `/settings` route kept (`page.tsx` → `SettingsDesign` → `SettingsPanel`) as the deep-link + no-JS fallback.

## 4. Tests

- [x] **`settings-vm.test.ts`** — new defaults (`currency`/`notifyPlatformNews`/`notifyNewGigs`) + `timezone`/`name` surfaced + stored-change round-trip. **`settings-actions.test.ts`** (new) — `updatePreferences` new fields, invalid-currency reject, `updateTimezone`/`updateAccountName` partial-safe (no clobber), `terminateInactiveSessions` leaves only the current session. **`timezones.test.ts`** (new) — label coverage + hub presence. **`account-preferences.test.ts`** — exact-shape assertion updated for the 3 new fields.
- [x] **`compose-settings.spec.ts`** — fully rewritten for the modal: gear opens (`?settings=1`) + all 6 sections + X closes; notification toggle flips + persists; currency persists; language + timezone persist; «Завершить все неактивные сеансы» clears sessions; grayed 2FA/Email/Password assert `disabled`; delete tears down → `/`. **`theme-switch.spec.ts`** — repointed to the shell «Вид» button (the popup has no theme control, per the Figma).
- [x] Stable selectors added: `role="switch"`/`role="radio"` + `aria-checked`, `aria-label` on selects, `[data-session-row]`, `data-section`.

## 5. Gate

- [x] `npm run build` — exit 0 (`/settings` builds; modal mounted in shell).
- [x] Integration green: full `vitest run` **967/967** (incl. settings-vm, settings-actions, timezones, account-preferences). E2E green: `compose-settings` **7/7** + `theme-switch` **3/3** (fresh `test.db`, `:3000` free).
- [x] Regression: full unit/integration suite passed; shell-mounted modal is inert without `?settings=1`.
- [x] Human-in-the-loop: owner reviewed the modal (gear → all 6 sections, contained card + inset scrollbar) and approved on 2026-06-29. **Flagged at archive:** the wired `currency`/`locale` preferences PERSIST but are NOT yet CONSUMED app-wide (money still renders in ₽ via `formatCurrency`'s hardcoded `ru-RU`/`RUB`; no i18n layer exists to act on `locale`). Accepted as a known gap — consumption tracked as the `currency-display` + `i18n-foundation` follow-up queries in `openspec/planning/transport-design-from-prototype.md`.

## Test plan summary

- **Build:** `npm run build` exit 0.
- **Integration:** `settings-vm` (new fields + `terminateInactiveSessions`).
- **E2E:** `compose-settings` (modal open/close; wired toggles/currency/language/timezone visibly change + persist; terminate-all; grayed controls inert).
- **Manual:** open from gear, scroll all 6 sections, confirm fidelity to the captured reference.
