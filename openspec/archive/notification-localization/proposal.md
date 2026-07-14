# notification-localization

## Why

The app ships in Russian, but the entire notification surface still renders in English — reported twice in the second stress-test wave (`Гигли баги.pdf`):

- **Гигли баги #4** — the bell popover shows the English title «Notifications», an English body («New application from Попова …»), and an English relative time («just now»).
- **Гигли баги #6** — the «Требует внимания» dashboard card renders «Your application was accepted».

Both surfaces read from the same source: `getNotificationDisplayText` in `lib/notification-utils.ts` returns English for every branch except the single `gig_updated` case (already «Условия гига обновлены»). The popover component (`app/components/NotificationDropdown.tsx`) additionally hardcodes English chrome — the title, loading/empty/error states, the «(N updates)» suffix, and a relative-time formatter that emits «just now», «Nm ago», «Nh ago», «yesterday», «N days ago». The bell button (`app/components/NotificationBell.tsx`) uses English `aria-label`s. There is also a second English `displayText = 'New message'` hardcoded directly in `app/actions/notification.ts` (the message-aggregation path) that bypasses `getNotificationDisplayText`.

This is a purely user-facing localization defect: the data model, event routing, and layout are all correct — only the strings are wrong.

## What Changes

- **Translate every branch of `getNotificationDisplayText`** to Russian matching the app's shipped tone (application submitted/accepted/rejected/withdrawn, application default, payment, work submitted/approved, payment marked, status default, message). The existing `gig_updated` Russian string is preserved.
- **Localize the message-aggregation `displayText`** in `app/actions/notification.ts` («Новое сообщение»), which does not route through `getNotificationDisplayText`.
- **Localize the popover chrome** in `NotificationDropdown.tsx`: the «Уведомления» title, loading/empty/error/retry copy, the «(N обновлений)» suffix (with correct RU pluralization), and the relative-time formatter (`just now`/`Nm ago`/`Nh ago`/`yesterday`/`N days ago` → Russian).
- **Localize the bell `aria-label`s** in `NotificationBell.tsx` and the popover `aria-label` in `NotificationDropdown.tsx`.
- **Grep the notifications surface** for any remaining hardcoded English and localize it.
- **Update the unit test** (`__tests__/unit/notifications-helper.test.ts`) that asserts the old English strings, and the `reconcile-data-model` integration assertion that matches `/paid/i`.

## Non-Goals

- No change to notification data model, event types, `eventData` payloads, or routing.
- No change to notification creation, unread-count logic, or the attention-feed lifecycle filter (shipped separately as `attention-feed-lifecycle`).
- No new notification types or events.
- No i18n framework — strings are localized in place (consistent with the rest of the app's shipped Russian-in-source approach).

## Impact

- Affected code: `lib/notification-utils.ts`, `app/actions/notification.ts`, `app/components/NotificationDropdown.tsx`, `app/components/NotificationBell.tsx`.
- Affected specs: `ui` (notification surface localization).
- Affected tests: `__tests__/unit/notifications-helper.test.ts`, `__tests__/integration/reconcile-data-model.test.ts` (assertions on notification text). `__tests__/integration/gig-editing.test.ts` already asserts the Russian `gig_updated` string and is unaffected.
