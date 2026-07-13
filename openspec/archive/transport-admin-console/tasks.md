# Tasks — transport-admin-console

Reconcile the admin console to `dashboard.admin`, transport the `confirm.destructive` dialog, and re-skin the two kit tables. **Reconcile/re-skin, don't rebuild.** Keep routes and filenames.

## 0. Baseline

- [x] 0.1 Baseline taken: killed the stale :3000 dev server first (the known login-redirect gotcha), ran the admin specs + build. The initial run surfaced only the expected selector breakage from the markup change (English labels, kit `Select`, reason-panel) — addressed below.
- [x] 0.2 Diffed `dashboard.admin` + `confirm.destructive` against the live screens. Findings: console already transported but **missing stat captions** and showed `budget·created` where the reference shows the **client** under each gig; the two tables were **still kit** (`@composed-screen` + `DataTable`); **no confirm dialog** existed for destructive actions.

## 1. Console — `AdminConsoleDesign.tsx` vs `dashboard.admin`

- [x] 1.1 Added the 4 verbatim caption lines («на платформе» / «всего опубликовано» / «пользователей» / «модерацией») via a static `STAT_META`; value binds by index. Label «Закрыто» → «Закрыто гигов» to match the reference.
- [x] 1.2 «Споры на модерации» queue (reason · amount · status · «Рассмотреть» → `/disputes/[id]`) and «Журнал модерации» log confirmed against reference.
- [x] 1.3 «Пользователи» rows (block via the confirm dialog / direct unblock) and «Гиги» rows (client subtext now, close via confirm) wired to `suspendUser`/`unsuspendUser`/`closeGig`. Extracted the shared row vocabulary to `app/admin/_parts.tsx`.

## 2. Destructive-confirm dialog — `app/_design/ConfirmDialog.tsx` vs `confirm.destructive`

- [x] 2.1 Transported as a reusable `ConfirmDialog` (centred modal over a dimmed surface, title + target-naming body + «Отмена» + red confirm) plus a `ConfirmAction` wrapper that fronts a server-action form so the action fires only on confirm.
- [x] 2.2 Gated the console's block/close on the dialog («Заблокировать пользователя?» / ««{name}» не сможет войти на платформу. Действие обратимо.»; gig variant «Закрыть гиг?»). «Отмена» is a no-op. Unblock (reversible) fires directly.

## 3. Users table — `AdminUsers.tsx` (KIT → transport)

- [x] 3.1 Dropped `/* @composed-screen */` + the kit imports (`DataTable`/`Section`/`Stack`/primitives); rebuilt on the console's row markup + `tokens.css`.
- [x] 3.2 Kept the role/status filters (now token `FilterSelect` native selects → URL params) and the page-level offset pagination; block/unblock wired behind the confirm dialog. Added `data-row="user"` for stable test scoping.

## 4. Gigs table — `AdminGigs.tsx` (KIT → transport)

- [x] 4.1 Dropped the kit contract/imports; rebuilt on the console's «Гиги» row markup (avatar · title · client·budget · status · close).
- [x] 4.2 Kept the status/closed filters + pagination; `closeGig` wired behind the confirm dialog. Added `data-row="gig"`.

## 5. Data-gap check (additive only — Method §3)

- [x] 5.1 Closed one genuine gap: added `client` to `AdminGigRow` and populated it in `getAdminGigs` (include the gig's client + clientProfile) so the console/table show the client company under each gig title (matching `dashboard.admin`). Stat captions are static copy (no VM field). No other gaps.

## 6. Verification

- [x] 6.1 `npm run build` — passes (exit 0; all routes compile).
- [x] 6.2 Admin E2E green — **21 passed** (`compose-admin-dashboard` + `admin-moderation` + `admin-pagination`). Selector updates: kit `Select` button/option → native `combobox` `selectOption`; English `Suspend`/`Close`/`Suspend User`/`Close Gig` → the Russian labels + the new confirm-dialog step; `tr:has-text` → `[data-row]`; the typed-reason assertions → the hardcoded reasons («Модерация» / «Закрыт модератором», since the confirm dialog collects no reason). `admin-dashboard-vm` integration green (1/1).
- [x] 6.3 Human-in-the-loop: the console + the open confirm dialog were reviewed against `dashboard.admin.png` / `confirm.destructive.png`; the tables now match the console's row vocabulary. Block/unblock/close + pagination/filtering verified end-to-end via E2E. User approved.

## 7. Follow-ups (user-reported, post-transport) — shipped & verified

- [x] 7.1 **Admin home routing** — `loginUser` + `middleware` route ADMIN → `/admin` (was landing on `/dashboard` mislabelled as «Компания»). Files: `app/actions/auth.ts`, `middleware.ts`.
- [x] 7.2 **Nav: «Модерация»→ exclusive active-state** — `buildAdminNav` leads with «Модерация» (disputes icon); `markActive` rewritten to longest-path match so a parent (`/admin`) isn't active on children. Added `aria-current="page"` on the active link. Files: `lib/nav.ts`, `app/_design/AppShellDesign.tsx`. Covered by `__tests__/unit/nav-active.test.ts`.
- [x] 7.3 **Dedicated `/admin/disputes` screen** — lists all disputes (open/resolved/rejected) + status filter; «Споры» nav item. Files: `app/admin/disputes/{page,AdminDisputes}.tsx`. Covered by `__tests__/e2e/admin-disputes.spec.ts`.
- [x] 7.4 **Admin shell on dispute detail** — `(protected)/layout.tsx` renders the admin shell for ADMINs (was the CLIENT shell); dispute «Назад» honours a `from` entry-point param. Files: `app/(protected)/layout.tsx`, `DisputeDetailDesign.tsx`, `AdminDisputes.tsx`, `AdminConsoleDesign.tsx`.
- [x] 7.5 **`disputeLabel`** — resolved disputes read «Решён» (not gig «Завершён») across all dispute surfaces. File: `app/_design/util.tsx`; dispute E2E assertions updated (`exact: true` to avoid matching «раз-решён»).
- [x] 7.6 **Test isolation** — `admin-disputes` afterAll scoped, FK-safe cleanup (disputes → gigs → profiles → users) so its `Dispute` rows don't break `admin-pagination`'s unscoped `gig.deleteMany()`. Validated: admin E2E **25/25** together; dispute E2E **8/8**; unit/integration **10/10**; build exit 0.
