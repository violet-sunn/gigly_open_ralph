# e2e-settings

## Why

Reconciliation change #11 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The «Настройки» screen at `/settings` was rebuilt on the `gigly_full_design` prototype's settings modal, rendered as a centered page card (`app/(protected)/settings/SettingsDesign.tsx`). Five sections, top to bottom: **ВНЕШНИЙ ВИД** (Тема segmented «Тёмная»/«Светлая» → `lib/theme`; Язык segmented «Русский»/«English»; Валюта pills «₽ Рубль»/«$ Доллар»/«€ Евро», display-only), **УВЕДОМЛЕНИЯ** + **ПРИВАТНОСТЬ** (toggles persisted via `updatePreferences` behind «Сохранить»), **АКТИВНЫЕ СЕССИИ** (the real `Session` backend, terminate via «Завершить»), and **АККАУНТ** («Выйти из аккаунта» + a reveal-to-confirm «Удалить аккаунт»). The in-screen title is gone — the shell header supplies the `<h1>` «НАСТРОЙКИ».

`compose-settings.spec.ts` asserts the old kit DOM and is red against the rebuilt component:

- It asserts the section names as **heading roles** — `getByRole('heading', { name: 'Внешний вид' | 'Уведомления' | 'Приватность' | 'Активные сессии' })` — but the rebuilt component renders them as UPPERCASE `<span>` labels («ВНЕШНИЙ ВИД», «УВЕДОМЛЕНИЯ», «ПРИВАТНОСТЬ», «АКТИВНЫЕ СЕССИИ»), not headings.
- It asserts the notification/privacy controls as **`getByRole('switch', { name })` with `aria-checked`**, but the rebuilt `Toggle` is a bare `<div onClick>` with **no** `role="switch"`, **no** `aria-checked`, and **no** accessible name — its on/off state lives only in the inline background color and in the row's hidden `<input name="notify…|show…" value="true|false">` that the form submits.
- It asserts a session-terminate button named **«Удалить сессию»**, but the rebuilt control is **«Завершить»**.

The parts that happen to still match — the gear `a[href="/settings"]`, «Русский», «₽ Рубль», the session title «Chrome · Windows» (parsed from the seeded user-agent), «Выйти из аккаунта», and the entire delete-account flow («Удалить аккаунт» → «Это действие необратимо…» → `input[name="confirmEmail"]` → «Подтвердить удаление», wrong-email error `/type your account email/i`, correct-email redirect to `/`) — are kept. This change rewrites the rest against the rebuilt component and its **unchanged** VM/action contract (`getSettings` → `getPreferences` + `getActiveSessions`; `updatePreferences`, `terminateSession`, `deleteAccount`, `logoutUser`).

## What Changes

- **REWRITE `compose-settings.spec.ts`** against `SettingsDesign.tsx` (no behavioural/app change). Keep the existing seed shape (a CLIENT «ООО Настройки» with a real `Session` row + a SPECIALIST «Удаляемый» for the delete test, both into `file:./test.db`). Cover:
  - **Gear nav:** the sidebar `a[href="/settings"]` routes to `/settings` (kept).
  - **Sections + ВНЕШНИЙ ВИД controls:** the section labels «ВНЕШНИЙ ВИД» / «УВЕДОМЛЕНИЯ» / «ПРИВАТНОСТЬ» / «АКТИВНЫЕ СЕССИИ» / «АККАУНТ» via `getByText` (not heading roles); the Тема segmented «Тёмная»/«Светлая»; Язык «Русский»; the display-only «₽ Рубль»; the notification/privacy row labels; and «Выйти из аккаунта».
  - **Theme → `lib/theme`:** clicking «Светлая» sets `<html data-theme="light">` (and persists `gigly-theme`); clicking «Тёмная» restores `data-theme="dark"`.
  - **Notification persistence:** toggling «Сообщения» off (located via the label's following-sibling toggle `<div>`) flips the row's hidden `input[name="notifyMessages"]` to `false`, «Сохранить» shows «Настройки сохранены.», and after reload the hidden input persists `false` (the `updatePreferences` round-trip). State is asserted via the hidden `input` value — there is no `aria-checked`.
  - **Active sessions:** «АКТИВНЫЕ СЕССИИ» lists «Chrome · Windows» (the seeded UA), and the «Завершить» button terminates the seeded (non-current) session so the row disappears after `router.refresh()`.
  - **Delete account:** «Удалить аккаунт» reveals «Это действие необратимо…»; a wrong `confirmEmail` is rejected (error `/type your account email/i`, still on `/settings`); the correct email tears down and redirects to `/` (kept).
  - **Remove** the heading-role section assertions, the `getByRole('switch', …)` + `aria-checked` assertions, and the «Удалить сессию» label.
- Reuse the existing harness (`setE2ESession` + direct Prisma seeding into `file:./test.db`). **No app/lib changes** — the bare-`<div>` toggle is asserted as-is (no `role`/`aria` added).

## Impact

- **Affected:** `__tests__/e2e/compose-settings.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`SettingsDesign.tsx`, `getSettings`/`getActiveSessions`/`getPreferences`, `updatePreferences`/`terminateSession`/`deleteAccount`/`logoutUser`, `lib/theme`, `lib/user-agent`); the unit/integration suite (951/951 — must stay green); the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 10/16 → 11/16.
