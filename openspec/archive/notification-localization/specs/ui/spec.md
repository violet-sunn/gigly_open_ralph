# ui — notification-localization delta

## ADDED Requirements

### Requirement: Notification display text SHALL be rendered in Russian

`getNotificationDisplayText` (`lib/notification-utils.ts`) SHALL return Russian text for every notification type/event branch, matching the app's shipped tone. No English SHALL remain in any branch. The dynamic specialist name from `eventData` SHALL be interpolated unchanged.

The message-aggregation path in `app/actions/notification.ts` (which sets `displayText` directly without calling `getNotificationDisplayText`) SHALL likewise set Russian text.

#### Scenario: APPLICATION events

- WHEN `type = 'APPLICATION'` and `eventType = 'application_submitted'` with `eventData.specialistName = 'Попова'`
- THEN the text SHALL be «Новая заявка от Попова»
- AND `application_accepted` SHALL be «Ваша заявка принята»
- AND `application_rejected` SHALL be «Ваша заявка отклонена»
- AND `application_withdrawn` with `specialistName = 'Попова'` SHALL be «Попова отозвал(а) заявку»
- AND an unknown/`null` application eventType SHALL be «Обновление по заявке»
- AND when `specialistName` is absent, `application_submitted` SHALL fall back to «Новая заявка от специалиста» and `application_withdrawn` to «Специалист отозвал(а) заявку»

#### Scenario: PAYMENT and STATUS_CHANGE events

- WHEN `type = 'PAYMENT'`
- THEN the text SHALL be «Оплата отмечена»
- AND `STATUS_CHANGE` / `work_submitted` SHALL be «Работа отправлена на проверку»
- AND `STATUS_CHANGE` / `work_approved` SHALL be «Ваша работа принята»
- AND `STATUS_CHANGE` / `payment_marked` SHALL be «Оплата отмечена»
- AND `STATUS_CHANGE` / `gig_updated` SHALL remain «Условия гига обновлены» (unchanged)
- AND an unknown/`null` status eventType SHALL be «Статус гига обновлён»

#### Scenario: MESSAGE / default

- WHEN `type = 'MESSAGE'` (or an unrecognized type)
- THEN `getNotificationDisplayText` SHALL return «Новое сообщение»
- AND the message-aggregation `displayText` in `app/actions/notification.ts` SHALL also be «Новое сообщение»

### Requirement: Notification popover chrome SHALL be rendered in Russian

The notifications popover (`app/components/NotificationDropdown.tsx`) SHALL render all static chrome in Russian, and the bell (`app/components/NotificationBell.tsx`) SHALL use Russian accessibility labels. No English SHALL remain in the notifications surface.

#### Scenario: Popover header, states, and update suffix

- WHEN the popover is open
- THEN the header SHALL read «Уведомления» (not «Notifications»)
- AND the loading state SHALL read Russian copy (e.g. «Загрузка уведомлений…»)
- AND the error state SHALL read Russian copy (e.g. «Не удалось загрузить уведомления») with a Russian retry control (e.g. «Повторить»)
- AND the empty state SHALL read Russian copy (e.g. «Нет новых уведомлений» / «Вы всё просмотрели»)
- AND the multi-update suffix SHALL read Russian with correct pluralization (e.g. «(3 обновления)»), replacing «(N updates)»

#### Scenario: Relative-time formatting is Russian

- WHEN a notification timestamp is formatted by the popover's relative-time helper
- THEN «just now» SHALL be Russian (e.g. «только что»)
- AND «Nm ago» SHALL be Russian (e.g. «N мин назад»)
- AND «Nh ago» SHALL be Russian (e.g. «N ч назад»)
- AND «yesterday» SHALL be «вчера»
- AND «N days ago» SHALL be Russian (e.g. «N дн назад»)
- AND the older-than-a-week fallback SHALL keep the existing `ru-RU` `toLocaleDateString` output

#### Scenario: Accessibility labels are Russian

- WHEN assistive technology reads the bell and popover
- THEN the bell button `aria-label` SHALL be Russian (e.g. «Уведомления»)
- AND the popover `aria-label` SHALL be Russian (e.g. «Меню уведомлений»)
