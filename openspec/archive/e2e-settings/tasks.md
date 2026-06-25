# Tasks — e2e-settings

> **Status: COMPLETE.** Baseline confirmed 3 of 5 old tests failed (heading-role section labels, `getByRole('switch')`+`aria-checked` toggles, «Удалить сессию»); 2 passed (gear nav + delete-account). Rewrote `compose-settings.spec.ts` into 6 tests: gear→/settings, the five `<span>` section labels + ВНЕШНИЙ ВИД controls + logout, Тема→`lib/theme` (`html[data-theme]`), notification persistence via the hidden-input round-trip (`input[name="notifyMessages"]` true→toggle→false→Сохранить→reload→false), active-sessions «Chrome · Windows» + «Завершить» terminate, and the kept delete-account flow. One mid-flight fix: section labels «УВЕДОМЛЕНИЯ» substring-matched «Уведомления об оплатах» → added `{ exact: true }` to the four section-label assertions. `npm run clean:test-db && npm run test:e2e compose-settings` → **6 passed (26.1s)**. No `app/`/`lib/` changes. Plan bumped 10/16 → 11/16.

> Run targeted: `npm run test:e2e compose-settings` (the Playwright `webServer` boots once with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`). If integration pollution is suspected, `npm run clean:test-db` first. Iterate one test with `-g "<title>"`.
>
> **Root cause this change fixes:** `compose-settings` asserts the section names as `heading` roles, the toggles as `getByRole('switch', …)` + `aria-checked`, and the session-terminate button as «Удалить сессию» — none of which exist in the rebuilt `SettingsDesign`. The rebuilt screen renders UPPERCASE `<span>` section labels, bare-`<div>` toggles whose state lives in hidden `<input value="true|false">`, and a «Завершить» terminate button. **Tests only — no `app/`/`lib/` change** (do NOT add `role`/`aria` to the toggle to make the old assertions pass; adapt the test to the bare div).

## Reference — the real contract (`SettingsDesign.tsx` + `lib/view-models` + actions)

- **No in-screen title** — the shell header owns the `<h1>` «НАСТРОЙКИ» (uppercase). Page card with five sections.
- **Section labels** are UPPERCASE `<span>`s, NOT headings: «ВНЕШНИЙ ВИД», «УВЕДОМЛЕНИЯ», «ПРИВАТНОСТЬ», «АКТИВНЫЕ СЕССИИ», «АККАУНТ». Assert with `getByText('…')`.
- **ВНЕШНИЙ ВИД:**
  - Тема — segmented «Тёмная»/«Светлая» (`<div onClick>`), wired to `lib/theme.applyTheme` → sets `<html data-theme="dark|light">` + persists `localStorage['gigly-theme']`. Defaults to `getStoredTheme()` (dark) on mount.
  - Язык — segmented «Русский»/«English» (controlled `locale` state; default `prefs.locale || 'ru'`).
  - Валюта — three **display-only** pills «₽ Рубль» / «$ Доллар» / «€ Евро» (no onClick; «₽ Рубль» hard-active).
- **Toggles (`Toggle`)** are a bare `<div onClick>` — **no `role`, no `aria-checked`, no accessible name**. On/off shows only via inline background color. The submitted state lives in sibling hidden inputs inside the form:
  - Notify: `name="notifyApplications|notifyMessages|notifyStatusChanges|notifyPayments"`, labels «Новые отклики» / «Сообщения» / «Смена статуса гига» / «Уведомления об оплатах».
  - Privacy: `name="showRatingInProfile|showOnlineStatus"`, labels «Показывать рейтинг в профиле» / «Показывать статус «онлайн»».
  - Each row is `<div><span>{label}</span><Toggle/></div>`. **Locate the toggle** via the label's following sibling: `page.getByText('Сообщения', { exact: true }).locator('xpath=following-sibling::div')`. **Assert state** via the hidden input value: `await expect(page.locator('input[name="notifyMessages"]')).toHaveValue('true'|'false')` — there is no `aria-checked`.
- **«Сохранить»** submits the form → `updatePreferences` → success «Настройки сохранены.» (or red error). The seeded prefs default all notify/privacy on.
- **АКТИВНЫЕ СЕССИИ** — `sessions[]` from `getActiveSessions(userId, sid)`. Each row: `title` = `formatUserAgent(ua)` (the seeded UA `…Windows…Chrome…` → «Chrome · Windows»); `description` = relative time. The current session (`id === sid`) renders the «текущая» span; all others render a **«Завершить»** button → `terminateSession(id)` + `router.refresh()`. The E2E token is **sid-less**, so the seeded row is non-current → terminable «Завершить».
- **АККАУНТ:**
  - «Выйти из аккаунта» — `<form action={logoutUser}>` submit.
  - DangerAction: «Удалить аккаунт» button → reveals «Это действие необратимо. Введите вашу почту ({email}), чтобы подтвердить.» + `input[name="confirmEmail"]` + «Подтвердить удаление» submit → `deleteAccount`. Wrong email → `{ error: 'Please type your account email to confirm deletion.' }` (matches `/type your account email/i`), stays on `/settings`. Correct email → teardown + redirect to `/`.

## 1. [x] Baseline + capture the mismatches

- Run `npm run test:e2e compose-settings` and record failures. Expect the heading-role section assertions, the `getByRole('switch', …)` + `aria-checked` assertions, and the «Удалить сессию» button to fail; the gear link, «Русский», «₽ Рубль», «Выйти из аккаунта», «Chrome · Windows», and the delete-account flow may pass.
- **Test plan:** baseline run → note the exact failing assertions to replace in tasks 2–6.

## 2. [x] Keep the seed + rewrite the section/controls render test

- Keep the existing seed: CLIENT «ООО Настройки» (`prefsId`/`prefsEmail`) with a `Session` row whose `userAgent` parses to «Chrome · Windows»; SPECIALIST «Удаляемый» (`delId`/`delEmail`) for the delete test. (`beforeAll`, into `file:./test.db`.)
- Rewrite the "renders the … sections" test (CLIENT, `goto /settings`): replace the four `getByRole('heading', …)` calls with `getByText('ВНЕШНИЙ ВИД')`, `getByText('УВЕДОМЛЕНИЯ')`, `getByText('ПРИВАТНОСТЬ')`, `getByText('АККАУНТ')`. Keep `getByText('Русский')`, `getByText('₽ Рубль')`, and `getByRole('button', { name: 'Выйти из аккаунта' })`. Add `getByText('Тёмная')` + `getByText('Светлая')`. Remove the `getByRole('switch', …)` + `aria-checked` assertions here (covered in task 4) and instead assert a couple of notification/privacy labels via `getByText`.
- (Optional) keep a gear-nav test: `a[href="/settings"]` from `/dashboard` → URL `/settings`.
- **Test plan:** `npm run test:e2e compose-settings -g "render"` (or the test's title) → green.

## 3. [x] Add the theme-switch test (Тема → lib/theme)

- New test (CLIENT, `goto /settings`): click `getByText('Светлая')`, assert `await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')`; click `getByText('Тёмная')`, assert `data-theme` is `dark`.
- **Test plan:** `npm run test:e2e compose-settings -g "theme"` → green.

## 4. [x] Rewrite the notification-persistence test (hidden-input round-trip)

- Replace the `getByRole('switch', { name: 'Сообщения' })` + `aria-checked` flow with: assert `input[name="notifyMessages"]` value `true`; click the toggle via `page.getByText('Сообщения', { exact: true }).locator('xpath=following-sibling::div')`; assert the hidden value flipped to `false`; click «Сохранить»; assert «Настройки сохранены.»; `page.reload()`; assert `input[name="notifyMessages"]` value persists `false`.
- **Test plan:** `npm run test:e2e compose-settings -g "persist"` → green.

## 5. [x] Rewrite the active-sessions test

- Keep `getByText('Chrome · Windows')`; replace the section heading assertion with `getByText('АКТИВНЫЕ СЕССИИ')`; replace `getByRole('button', { name: 'Удалить сессию' })` with `getByRole('button', { name: 'Завершить' }).first()`; assert `getByText('Chrome · Windows')` has count `0` after the click + refresh.
- **Test plan:** `npm run test:e2e compose-settings -g "session"` → green.

## 6. [x] Keep the delete-account test

- The reveal-to-confirm flow already matches the rebuilt DangerAction — confirm it still passes verbatim: «Удалить аккаунт» → «Это действие необратимо» → wrong email rejected (`/type your account email/i`, still `/settings`) → reload → correct email → redirect to `/`.
- **Test plan:** `npm run test:e2e compose-settings -g "delete"` → green.

## 7. [x] Full green + plan update

- Run the whole file: `npm run test:e2e compose-settings` → 0 failures (`npm run clean:test-db` first if pollution suspected).
- Grep the spec to confirm no `getByRole('heading'` for the section names, no `getByRole('switch'`, no `aria-checked`, and no «Удалить сессию» remain; confirm the `getByText` section labels, the `html[data-theme]` theme checks, the hidden-input persistence, the «Завершить» terminate, and the delete flow are present.
- Confirm no `app/`/`lib/` files changed; the unit/integration suite stays untouched (951/951).
- Tick `compose-settings` (#25) in `openspec/planning/e2e-reconciliation.md` and bump progress 10/16 → 11/16.
- **Acceptance:** `npm run test:e2e compose-settings` reports 0 failures.
