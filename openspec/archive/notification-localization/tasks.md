# Tasks — notification-localization

## 1. Localize `getNotificationDisplayText` (`lib/notification-utils.ts`)

- [x] 1.1 Translate every branch to Russian:
  - `application_submitted` → «Новая заявка от {specialistName}» (fallback name «специалиста»)
  - `application_accepted` → «Ваша заявка принята»
  - `application_rejected` → «Ваша заявка отклонена»
  - `application_withdrawn` → «{specialistName} отозвал(а) заявку» (fallback «Специалист отозвал(а) заявку»)
  - APPLICATION default → «Обновление по заявке»
  - `PAYMENT` → «Оплата отмечена»
  - `work_submitted` → «Работа отправлена на проверку»
  - `work_approved` → «Ваша работа принята»
  - `payment_marked` → «Оплата отмечена»
  - `gig_updated` → «Условия гига обновлены» (LEAVE UNCHANGED — already Russian)
  - STATUS_CHANGE default → «Статус гига обновлён»
  - MESSAGE/default → «Новое сообщение»
- **Test plan:** `getNotificationDisplayText` returns the Russian string for each `(type, eventType)` pair; `specialistName` interpolation and both fallbacks verified.

## 2. Localize the message-aggregation path (`app/actions/notification.ts`)

- [x] 2.1 Change the hardcoded `displayText = 'New message'` (~line 79, the message-aggregation branch that does NOT call `getNotificationDisplayText`) to «Новое сообщение».
- **Test plan:** grep `app/actions/notification.ts` for `'New message'` returns nothing; a gig with unread messages surfaces «Новое сообщение» in `getUnreadNotifications`.

## 3. Localize the popover chrome (`app/components/NotificationDropdown.tsx`)

- [x] 3.1 Header «Notifications» → «Уведомления».
- [x] 3.2 Loading «Loading notifications...» → «Загрузка уведомлений…».
- [x] 3.3 Error «Failed to load notifications» (the `setError(...)` string) → «Не удалось загрузить уведомления»; «Retry» button → «Повторить».
- [x] 3.4 Empty state «No new notifications» → «Нет новых уведомлений»; «You're all caught up!» → «Вы всё просмотрели».
- [x] 3.5 Multi-update suffix «({unreadCount} updates)» → RU with correct pluralization (1 → «обновление», 2–4 → «обновления», 5+/11–14 → «обновлений»); add a small `pluralizeUpdates(n)` helper.
- [x] 3.6 `formatRelativeTime`: «just now»→«только что», «${m}m ago»→«${m} мин назад», «${h}h ago»→«${h} ч назад», «yesterday»→«вчера», «${d} days ago»→«${d} дн назад». Keep the `ru-RU` `toLocaleDateString` fallback.
- [x] 3.7 Popover `aria-label="Notifications menu"` → «Меню уведомлений».
- **Test plan:** grep the file for any ASCII-letter UI string returns nothing user-facing; render/live-check shows Russian header, states, suffix, and relative times.

## 4. Localize the bell (`app/components/NotificationBell.tsx`)

- [x] 4.1 Button `aria-label="Notifications"` → «Уведомления».
- **Test plan:** grep the file for `"Notifications"` returns nothing.

## 5. Grep sweep for residual English on the notifications surface

- [x] 5.1 Grep `app/components/Notification*.tsx`, `app/actions/notification.ts`, `lib/notification-utils.ts`, `lib/notifications.ts` for hardcoded English (`[A-Za-z]{4,}` in JSX text / string literals) and localize anything user-facing found.
- **Test plan:** the sweep surfaces no remaining user-facing English on the notifications surface.

## 6. Update tests to the Russian strings

- [x] 6.1 `__tests__/unit/notifications-helper.test.ts` — update the `getNotificationDisplayText` assertions (currently English) to the Russian strings from Task 1.
- [x] 6.2 `__tests__/integration/reconcile-data-model.test.ts` — the `toMatch(/paid/i)` assertion on the PAYMENT text must be updated (now «Оплата отмечена»).
- [x] 6.3 Confirm `__tests__/integration/gig-editing.test.ts` (asserts «Условия гига обновлены») still passes unchanged.
- **Test plan:** `npm run test:unit -- notifications-helper` and the affected integration specs pass; run `npm run clean:test-db` first if integration failures look like DB pollution.

## 7. Live verification

- [x] 7.1 Bell popover: as a CLIENT with an application notification, open the bell — title «Уведомления», body «Новая заявка от {имя}», relative time «только что» (or Russian equivalent), all Russian.
- [x] 7.2 Attention card: on a specialist dashboard with an unread acceptance notification, the «Требует внимания» card header renders «Ваша заявка принята» (Russian) — not «Your application was accepted».
- [x] 7.3 Confirm no English remains anywhere on the notifications surface (popover chrome, relative time, attention card).
- **Test plan:** live click-through per `playwright-verify-script-location` conventions (seed login `TestPass123`); no English visible in either surface.

## 8. Typecheck & spec validation

- [x] 8.1 `npx tsc --noEmit` clean — no errors in any touched file (`lib/notification-utils.ts`, `app/actions/notification.ts`, `NotificationDropdown.tsx`, `NotificationBell.tsx`, `notifications-helper.test.ts`, `reconcile-data-model.test.ts`). Remaining `tsc` errors are pre-existing, unrelated test-file drift.
- [x] 8.2 Structure validated by hand (openspec CLI not installed in this environment): each `### Requirement:` has ≥1 `#### Scenario:`; deltas use `## ADDED Requirements`; format matches archived changes.

## Verification summary

- **Unit/integration:** `notifications-helper.test.ts` (20), `reconcile-data-model.test.ts` (7), `gig-editing.test.ts` (19) — 46/46 pass (after `clean:test-db`).
- **Live (Playwright, dev server on :3000, seeded unread notifications):**
  - Bell popover (CLIENT `ivan.petrov@techcorp.ru`): «Уведомления» / «Новая заявка от Попова» / «Новое сообщение» / «1 мин назад» / «1 ч назад» / «24 июн.» / «(4 обновления)» / «(2 обновления)» — no English.
  - Attention card (SPECIALIST `alexey.ivanov@mail.ru`): «Ваша заявка принята» — not «Your application was accepted».
  - All 7 live assertions pass; no residual English on either surface.
