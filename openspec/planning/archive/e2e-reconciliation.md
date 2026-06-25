# E2E Reconciliation

**Created:** 2026-06-21
**Status:** PLANNED

## Problem

The whole protected app + admin console were rebuilt directly on the `gigly_full_design` prototype's own markup (14 routes + the app shell + the admin shell), and the dead kit screens were deleted. The unit/integration suite is 951/951 green and `tsc` is clean in `app/`/`lib/`, but the **E2E (Playwright) suite** (`npm run test:e2e`) still asserts the *old* kit DOM/labels and has therefore diverged. It is the only regression gate the UI rebuild outdated.

## Why This Matters

The E2E suite is the app's end-to-end safety net for the gig lifecycle that project.md centres on (create → apply → choose → submit → approve → mark-paid → dispute). Right now it would fail not because the app is broken — every flow was verified by capture and the data layer is unchanged — but because the assertions point at markup that no longer exists. Restoring it green re-arms regression protection for the reground and lets future changes ship safely. Leaving it red erodes trust in CI and hides real regressions in the noise.

## Scope

**Affected:** `__tests__/e2e/*.spec.ts` only. **Not touched:** `app/`/`lib/` behaviour, the (deleted) kit, and the unit/integration suite (951/951 — must stay green).

**Harness (reused by every change):** `setE2ESession(page, {id,email,role})` from `__tests__/helpers/auth`; direct Prisma seeding into `file:./test.db`; the Playwright `webServer` runs `npm run dev` with `DISABLE_RATE_LIMIT=true` + `DATABASE_URL=file:./test.db`. Run targeted: `npm run test:e2e <file>` or `-g "<title>"`. Clean between full runs: `npm run clean:test-db` (known test-db pollution).

### Shell-wide deltas (apply to most REWRITE specs)
- The page title now lives in the **shell header** (`<h1>` «ПРОЕКТ»/«ДАШБОРД»/«МОИ ГИГИ»/…) — in-screen `SectionHeader`/title assertions move there (or are dropped).
- **Breadcrumbs and the BackButton are gone** — every breadcrumb/`← Назад`(kit) assertion is removed; screens that need "back" ship their own inline link (e.g. gig-detail «← Назад к гигам», applications «← Назад к проекту»).
- Profile + role + bell + gear live in the **sidebar** (not a topbar); the role pill shows «Специалист/Компания/Админ».
- Global search lives in the **header** and pushes `?search=` to `/gigs`.
- Theme toggle is the header **«Вид»** button (+ the settings «Тема» segmented control) — not the old kit toggle.

### Triage (all 45 specs)

| # | Spec | Route(s) | Bucket |
|---|------|----------|--------|
| 1 | accessibility-audit | /, /login, /register, /gigs | PASS-AS-IS (re-verify; axe, not labels) |
| 2 | admin-moderation | /admin/users, /admin/gigs | PASS-AS-IS (those screens still old-kit) |
| 3 | admin-pagination | /admin/users, /admin/gigs | PASS-AS-IS (still old-kit) |
| 4 | application-withdrawal | /gigs/[id] | REWRITE (gig-detail) |
| 5 | auth-flow | /auth, /login, /register | PASS-AS-IS (auth not in this reground) |
| 6 | auth-landing | /auth | PASS-AS-IS |
| 7 | auth-navigation | /, /login, /register, /auth | PASS-AS-IS |
| 8 | auth-session | /dashboard, /profile, /admin | PASS-AS-IS (redirect/session, DOM-agnostic) |
| 9 | back-button-navigation | /dashboard/profile (stale) | **DELETE** (BackButton removed + legacy routes) |
| 10 | breadcrumb-navigation | /gigs, /profile, /admin | **DELETE** (breadcrumbs removed; missing `loginAs*` helpers) |
| 11 | build-applications-screen | /gigs/[id]/applications, /gigs/[id] | REWRITE (applications) |
| 12 | client-journey | /dashboard, /gigs/new, /gigs/[id] | REWRITE (journey) |
| 13 | compose-admin-dashboard | /admin | REWRITE (admin console) |
| 14 | compose-auth-onboarding | /register | PASS-AS-IS (auth) |
| 15 | compose-chats | /chats | REWRITE (chats) |
| 16 | compose-client-dashboard | /dashboard | REWRITE (dashboard) |
| 17 | compose-create-gig | /gigs/new | REWRITE (create-gig) |
| 18 | compose-disputes | /disputes, /disputes/[id] | REWRITE (disputes) |
| 19 | compose-finances | /finances | REWRITE (finances) |
| 20 | compose-gig-detail-apply | /gigs/[id] | REWRITE (gig-detail — largest) |
| 21 | compose-gig-search | /gigs | REWRITE (browse) |
| 22 | compose-my-gigs | /my-gigs | REWRITE (my-gigs) |
| 23 | compose-onboarding | /register | PASS-AS-IS (auth) |
| 24 | compose-profile | /profile | REWRITE (profile) |
| 25 | compose-settings | /settings | REWRITE (settings) |
| 26 | compose-specialist-dashboard | /dashboard | REWRITE (dashboard) |
| 27 | confirmation-dialogs | gig/admin actions | REWRITE (light — trigger labels) |
| 28 | csrf-protection | /gigs/new | PASS-AS-IS (CSRF token, DOM-agnostic) |
| 29 | empty-states | /gigs, /dashboard, /my-gigs | REWRITE (empty-state markup) |
| 30 | error-scenarios | /dashboard, /gigs/new, /gigs/[id], /admin | REWRITE (light — error UI on rebuilt screens; also has pre-existing tsc field errors) |
| 31 | fidelity | design-system | RE-EVALUATE-FIDELITY |
| 32 | fidelity-gate | design-system goldens | RE-EVALUATE-FIDELITY |
| 33 | gig-browse-access | /gigs | PASS-AS-IS (redirect ACL; known flake) |
| 34 | gig-pagination | /gigs | REWRITE (browse grid/pagination) |
| 35 | keyboard-navigation | cross-screen | REWRITE (focus targets shifted to new shell) |
| 36 | loading-states | cross-screen (loading.tsx / Suspense) | REWRITE (light — re-verify skeletons/fallbacks on rebuilt screens) |
| 37 | login-role-param | /login?role= | PASS-AS-IS (auth) |
| 38 | messaging-flow-e2e | /chats (was gig-detail) | REWRITE (messaging now lives in /chats) |
| 39 | mobile-responsive | cross-screen | RE-EVALUATE (design is desktop-first; decide mobile scope) |
| 40 | reconcile-disputes-flow | /disputes/new, /gigs/[id] | REWRITE (disputes) |
| 41 | register-page-redesign | /register | PASS-AS-IS (auth) |
| 42 | registration | /register | PASS-AS-IS (auth) |
| 43 | shell-cutover | old AppShell | **DELETE** (shell fully rebuilt) |
| 44 | specialist-journey | /dashboard, /gigs, /gigs/[id] | REWRITE (journey) |
| 45 | theme-coverage | cross-screen | PASS-AS-IS (re-verify data-theme applies) |
| 46 | theme-switch | theme toggle | REWRITE (toggle moved to header «Вид» + settings) |

**Tally (46 specs):** ~13 PASS-AS-IS (re-verify only) · ~25 REWRITE · 3 DELETE · 2 RE-EVALUATE-FIDELITY · 1 RE-EVALUATE (mobile).

### Dependencies & risks
- **Independence:** the per-screen REWRITE changes are mutually independent (different specs) → parallelizable. The journeys change (client/specialist) depends on the per-screen deltas being known, so schedule it after the single-screen ones (or reuse their deltas).
- **No shared E2E helper change needed** — `setE2ESession` + seeding already fit; the apply-form `name=` selectors are unchanged (only visible labels moved), which keeps many edits to label strings.
- **Risk — slow cycle:** each spec needs a server-boot run; iterate with `-g`/per-file, not the whole suite. **Risk — test-db pollution:** `clean:test-db` between full runs. **Risk — pre-existing tsc laxity** in test files (rate-limit/payment-display/`fail`/error-scenarios fields) is NOT from the reground; don't get blocked on it (Playwright transpiles, doesn't typecheck).

## Changes

Execute in order; the per-screen REWRITE changes (3–13) are independent and may run in any order / in parallel.

### 1. Delete obsolete-feature specs
```bash
/ralphy-plan e2e-delete-obsolete-specs "Delete the E2E specs for features intentionally removed in the design reground. DELETE __tests__/e2e/breadcrumb-navigation.spec.ts (breadcrumbs removed — the shell header supplies the page title; the spec also imports non-existent loginAs* helpers), back-button-navigation.spec.ts (the kit BackButton was removed; the spec also navigates stale /dashboard/profile and /dashboard/gigs legacy routes), and shell-cutover.spec.ts (the old AppShell/SidebarNav/Topbar were replaced by AppShellDesign). Do NOT replace them — the features are gone by design. Test: npm run test:e2e still collects + runs the remaining specs with no missing-file/import errors."
```

### 2. Re-evaluate the design-system fidelity gates
```bash
/ralphy-plan e2e-reevaluate-fidelity "Re-evaluate fidelity.spec.ts + fidelity-gate.spec.ts against the retired F2/F5/golden gates (lint:tokens/lint:composition removed; the design is now concrete inline-styled markup, not kit-derived). Decide per spec: keep as a self-referential golden check of the workbench surfaces if still meaningful, or remove/rewrite to assert the design tokens (app/_design/tokens.css) render. Requirements: no reference to deleted kit components or removed lint scripts. Test: the chosen fidelity spec(s) pass under npm run test:e2e, or are removed with a one-line rationale in the spec's place (commit message)."
```

### 3. gig-detail
```bash
/ralphy-plan e2e-gig-detail "Rewrite compose-gig-detail-apply.spec.ts + application-withdrawal.spec.ts to the rebuilt /gigs/[id] (app/(protected)/gigs/[id]/GigDetail.tsx). Label deltas: «Откликнуться»→«Отправить заявку»; «Отозвать отклик»→«Отозвать заявку» (+ applied banner «Заявка отправлена ✓»); «Отправить работу»→«Сдать работу на проверку»; «Отметить оплаченным»→«Отметить как оплаченный»; «Принять работу» + new «Вернуть на доработку»; owner «Смотреть отклики (N)». REMOVE: the «Сообщения» chat assertions + the `textbox name=Сообщение` (gig-detail no longer embeds chat — messaging is /chats), the «Файлы» absence check, and any breadcrumb. KEEP: the apply textareas select by name (`textarea[name=approach]`, `[name=questions]`, `input[name=estimatedEffort]`) — unchanged. The «Технические требования»/«Критерии успеха»/«Бюджет проекта»/«Срок выполнения»/«Сервисный сбор (10%)» assertions still hold. Test: npm run test:e2e compose-gig-detail-apply && npm run test:e2e application-withdrawal green."
```

### 4. dashboards (client + specialist)
```bash
/ralphy-plan e2e-dashboards "Rewrite compose-client-dashboard.spec.ts + compose-specialist-dashboard.spec.ts to DashboardDesign.tsx. The in-screen page title is gone (shell header «ДАШБОРД»). Assert: WELCOME «Добро пожаловать в Gigly!», the «Мои гиги» panel + tab chips (Все/Заявки/В работе/На проверке/Завершённые), the design GigCard feed, the role panel («Создайте новый гиг» for CLIENT / «Найти новый гиг» for SPECIALIST), «Сообщения», and (specialist) «Требует внимания». Test: both specs green under npm run test:e2e."
```

### 5. my-gigs
```bash
/ralphy-plan e2e-my-gigs "Rewrite compose-my-gigs.spec.ts to MyGigsDesign.tsx: the status tab chips (Все/Заявки/В работе/На проверке/Завершённые) + a 2-col grid of FULL design GigCards (Фикс. цена/Срок/«К проекту») + the empty state «Здесь пока пусто». No in-screen title (shell «МОИ ГИГИ»). Test: npm run test:e2e compose-my-gigs green."
```

### 6. browse + pagination + empty
```bash
/ralphy-plan e2e-browse "Rewrite compose-gig-search.spec.ts + gig-pagination.spec.ts + empty-states.spec.ts to the rebuilt list screens. Browse (GigSearchDesign.tsx): the design-styled category/sort/rating <select>s, «Найдено {N}» + count badge, the FULL GigCard grid, empty «Ничего не нашлось» + «Сбросить фильтры»; text search now lives in the SHELL HEADER (?search=), not a content box; pagination + ?page= unchanged. empty-states.spec.ts spans screens — also assert the rebuilt /dashboard and /my-gigs («Здесь пока пусто») empty states; drop any stale /gigs/examples route assertion if that route is gone. Test: the three specs green under npm run test:e2e."
```

### 7. applications
```bash
/ralphy-plan e2e-applications "Rewrite build-applications-screen.spec.ts to ApplicationsDesign.tsx: «Отклики» + «на проект «{title}»», the applicant cards (name + [level] + rating + status «На рассмотрении», stack tags, Подход/Уточняющие вопросы/Оценка трудозатрат), «Принять»/«Отклонить» on pending applicants, the assigned banner, and the «← Назад к проекту» link. Test: npm run test:e2e build-applications-screen green."
```

### 8. create-gig
```bash
/ralphy-plan e2e-create-gig "Rewrite compose-create-gig.spec.ts to CreateGigDesign.tsx: the 4 cards «Что нужно сделать?»/«Как поймём, что готово?»/«Что важно учесть?»/«Условия», category chips, the criteria editor (input + «Добавить» + suggestions), tag chips, the live «Готовность брифа» checklist, the fee «Сводка», «Опубликовать гиг». Field selectors by name unchanged: title/description/goal/deliverables/constraints/budget/deadlineDays (+ hidden category/acceptanceCriteria/tags). createGig still redirects to /gigs/new/success. Test: npm run test:e2e compose-create-gig green."
```

### 9. chats + messaging
```bash
/ralphy-plan e2e-chats "Rewrite compose-chats.spec.ts + messaging-flow-e2e.spec.ts to ChatsDesign.tsx (two-pane). Assert: the «Сообщения» conversation list (counterparty + status + unread + project + preview), selecting a row → /chats?gig=<id>, the thread bubbles + day separator, and the composer (`input[name=content]`, aria-label «Сообщение», submit). messaging-flow-e2e: the flow moves from the old gig-detail chat to /chats (sendMessage is unchanged). Test: both specs green under npm run test:e2e."
```

### 10. finances
```bash
/ralphy-plan e2e-finances "Rewrite compose-finances.spec.ts to FinancesDesign.tsx: the 3 stat tiles (Заработано/На проверке/В работе for SPECIALIST etc.), «Операции» + count, and the ledger rows (title + party·date + amount + status). No breadcrumb/in-screen title. Test: npm run test:e2e compose-finances green."
```

### 11. settings
```bash
/ralphy-plan e2e-settings "Rewrite compose-settings.spec.ts to SettingsDesign.tsx (the prototype settings modal rendered as a /settings page card): ВНЕШНИЙ ВИД (Тема segmented Тёмная/Светлая → lib/theme, Язык, Валюта), УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ toggles → updatePreferences («Сохранить»), АКТИВНЫЕ СЕССИИ, «Выйти из аккаунта» + reveal-to-confirm «Удалить аккаунт». Test: npm run test:e2e compose-settings green."
```

### 12. profile
```bash
/ralphy-plan e2e-profile "Rewrite compose-profile.spec.ts to ProfileDesign.tsx: the ID card (avatar + name + role tag + verified + «на платформе с …»), and for a SPECIALIST the «Стек»/«Опыт»/«Избранные категории»/«Реализованные проекты» blocks; the owner edit pencils navigate to /profile/edit. CLIENT shows «Реквизиты» (ИНН/КПП). No breadcrumb (shell «ПРОФИЛЬ»). Test: npm run test:e2e compose-profile green."
```

### 13. disputes (list + detail + new + resolve)
```bash
/ralphy-plan e2e-disputes "Rewrite compose-disputes.spec.ts + reconcile-disputes-flow.spec.ts to the rebuilt disputes flow: DisputesDesign (list rows + «Споры» + empty «Открытых споров нет»), DisputeDetailDesign (header card + «Ход рассмотрения» timeline + «Доказательства» + the ADMIN «Решение модератора» 3 verdict buttons → resolveDispute; participant reply composer was intentionally omitted — drop that assertion), NewDisputeDesign (reason chips «Причина спора» + «Опишите проблему» + «Открыть спор» → openDispute). Test: both specs green under npm run test:e2e."
```

### 14. admin console
```bash
/ralphy-plan e2e-admin-console "Rewrite compose-admin-dashboard.spec.ts to AdminConsoleDesign.tsx (the consolidated «МОДЕРАЦИЯ» in the admin AppShellDesign): the 4 stat tiles, «Споры на модерации» queue + «Рассмотреть» (→ /disputes/[id]), «Пользователи» + «Заблокировать»/«Разблокировать», «Гиги» + «Закрыть», «Журнал модерации». NOTE: /admin/users + /admin/gigs are still old-kit (admin-moderation/admin-pagination stay PASS-AS-IS); this change covers /admin only. Test: npm run test:e2e compose-admin-dashboard green."
```

### 15. cross-cutting (dialogs, theme, a11y, keyboard)
```bash
/ralphy-plan e2e-cross-cutting "Reconcile the cross-screen specs to the new shell/screens: confirmation-dialogs.spec.ts (update the action trigger labels per screen 3–14; also fix its pre-existing 4-arg helper calls), theme-switch.spec.ts (the toggle is the header «Вид» button + the settings «Тема» control, not the old kit toggle), keyboard-navigation.spec.ts (focus targets now in AppShellDesign — #main-content skip link + sidebar nav), accessibility-audit.spec.ts (re-run axe on the rebuilt /gigs etc.), loading-states.spec.ts (re-verify the loading.tsx/Suspense skeletons on the rebuilt screens — e.g. my-gigs/loading.tsx), and mobile-responsive.spec.ts (the design is desktop-first — 1512px prototype, AppShell is desktop-only: decide WITH THE USER whether to DELETE it as out-of-scope or keep a reduced smoke check; default = skip assertions targeting responsive layouts that don't exist). Leave theme-coverage.spec.ts as PASS-AS-IS if data-theme still applies. Test: these specs green (or mobile-responsive removed with rationale) under npm run test:e2e."
```

### 16. journeys + error scenarios + final suite
```bash
/ralphy-plan e2e-journeys-and-greenup "Rewrite client-journey.spec.ts + specialist-journey.spec.ts + error-scenarios.spec.ts to chain the per-screen deltas from changes 3–14 (create-gig → apply → accept on /applications → submit → approve → mark-paid → dispute), and fix error-scenarios' pre-existing tsc field issues (workSubmittedAt/completedAt) by aligning to the current Gig schema. Then run the WHOLE suite: clean the test db and run npm run test:e2e — confirm every spec green and every PASS-AS-IS spec (auth*, csrf, gig-browse-access, admin-moderation, admin-pagination, theme-coverage, register*, *onboarding) still passes. Test: npm run clean:test-db && npm run test:e2e → 0 failures."
```

## Status

- [x] e2e-delete-obsolete-specs
- [x] e2e-reevaluate-fidelity
- [x] e2e-gig-detail
- [x] e2e-dashboards
- [x] e2e-my-gigs
- [x] e2e-browse
- [x] e2e-applications
- [x] e2e-create-gig
- [x] e2e-chats
- [x] e2e-finances
- [x] e2e-settings
- [x] e2e-profile
- [x] e2e-disputes
- [x] e2e-admin-console
- [x] e2e-cross-cutting
- [x] e2e-journeys-and-greenup (journey/error rewrites + suite-wide FK-safe isolation fix; 47 → 13 failures)

**Progress:** 16/16 changes completed
**Started:** 2026-06-21
**Completed:** 2026-06-24

> **Follow-up flagged → ✅ RESOLVED (2026-06-24):** the #16 full-suite greenup exposed 13 pre-existing PASS-AS-IS failures (auth/register-wizard cluster, `csrf-protection` stale create-gig fill, `gig-browse-access` old-kit UI). The dedicated `e2e-greenup-residual` change fixed all 13 tests-only — the **whole E2E suite is now green (199 passed, 0 failures)**. Notable: most of the auth cluster was a STALE DEV-SERVER artifact (restart the :3000 listener after `clean:test-db`), plus the wizard submit «Зарегистрироваться»→«Продолжить» and the `/login` border color; csrf → the `CreateGigDesign` fill; gig-browse-access reconciled (CLIENT-gating + `/gigs/examples` both survive). The E2E reconciliation initiative is fully complete and the suite is green end-to-end.


