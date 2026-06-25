# Tasks — transport-shared-shell

> The shell already exists (`app/_design/AppShellDesign.tsx`) and is wired into both
> `app/(protected)/layout.tsx` and `app/admin/layout.tsx`. This is an AUDIT-AND-RECONCILE
> against the captured reference, not a rebuild. Preserve the working data wiring.

## 1. Baseline
- [x] Baseline established by reasoning (no test depends on the changed markup) + build; full E2E baseline deferred to `/ralphy-validate`.
- **Notes:** the shell's reference is the chrome visible in `design-reference/screens/` — use `dashboard.specialist`, `dashboard.company`, `dashboard.admin` (all-role framing), plus any screen for the header title bar.
- **Test:** baseline E2E result captured.

## 2. Reconcile the sidebar against the captured reference
- [x] Diff each sidebar element vs the captured markup and fix divergences: GIGLY wordmark; profile card (avatar, name, role sub-label, notifications bell + unread badge, settings gear); role framing; nav (icons, labels, counts, active-bar + accent treatment); support/help card; logout.
- **Notes (Method §2 — verbatim copy):** the support/help card must use the prototype's exact heading + body text (the prototype shows a «Поддержка» card with specific copy and a "Что случилось?" input, NOT a paraphrased «Нужна помощь?» textarea). Transport the real strings.
- **Test:** sidebar matches `design-reference/screens/dashboard.*` on visual inspection (user-approved screenshot); copy strings equal the prototype's.

## 3. Reconcile the header against the captured reference
- [x] Diff the header: accent bar + Handjet uppercase per-route title; top-right control; conditional search bar (verbatim placeholder; correct screen set). Fix divergences.
- **Notes:** keep the per-route title map aligned to the prototype's titles (ДАШБОРД / ПОИСК ГИГОВ / МОИ ГИГИ / ЧАТЫ / ФИНАНСЫ / СПОРЫ / ПРОЕКТ / СОЗДАТЬ ГИГ / ОТКЛИКИ / ОТКРЫТЬ СПОР / СПОР / РЕШЕНИЕ СПОРА / ПРОФИЛЬ / МОДЕРАЦИЯ).
- **Test:** header matches the captured reference; title correct on a sample of routes.

## 4. Resolve the role-switcher decision
- [x] Per the proposal's open decision, keep the non-interactive role indicator (highlights the user's actual role) unless told otherwise. Confirm before adding live role-switching.
- **Test:** specialist/company/admin sessions each highlight the correct role.

## 5. Preserve & verify wiring
- [x] Confirm nav routing (`buildSidebarNav`/`buildAdminNav`/`markActive`), `NotificationBell` + dropdown, `logoutUser`, theme toggle, and settings gear → `/settings` all still work after markup changes.
- **Test:** click-through of each interactive element works.

## 6. Coverage
- [x] Confirm the shell still wraps every protected route and the admin routes (both layouts already import it — verify nothing regressed).
- **Test:** spot-check a protected route and an admin route render inside the shell.

## Acceptance (run before marking done)
- [x] `npm run build` passes (exit 0, compiled cleanly).
- [~] Existing E2E suite — DEFERRED to `/ralphy-validate` (needs the test server, which would disrupt the running dev server). No E2E test depends on the changed markup (role switcher: 0 refs; the «Отправить» hits are unrelated chat/apply buttons).
- [x] Live shell visually approved by the user against the reference (sidebar support card + 3-segment role indicator).
- [x] Sidebar + header match `design-reference/screens/` on a user-approved screenshot (dark; spot-check light theme still themes via tokens).
- [x] Support/help card + search placeholder use the prototype's verbatim copy.
- [x] Settings gear navigates to `/settings`; that page is unchanged (no diff under `app/(protected)/settings/`).
- [x] No data-model or server-action changes; no new UI system introduced.
