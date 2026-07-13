# transport-admin-console

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 7 of 8 — the admin moderation surface: the consolidated console, the users/gigs management tables, and the destructive-confirm dialog).

## Why

The prototype's entire admin surface is **one screen** — `dashboard.admin` («МОДЕРАЦИЯ») — that folds everything into a single console: 4 stat tiles, a «Споры на модерации» queue, a «Журнал модерации» log, a «Пользователи» list (block), and a «Гиги» list (close). Plus the captured `confirm.destructive` overlay (the block-user confirmation dialog).

The app's `/admin` (`AdminConsoleDesign.tsx`) is **already transported** on that block and wired to the moderation actions + `getAdminDashboard` VM — so for the console this is a **reconcile** to the captured reference. But the app also keeps two **paginated management tables** the prototype has no screen for — `/admin/users` (`AdminUsers.tsx`) and `/admin/gigs` (`AdminGigs.tsx`) — and those are **still on the kit** (`/* @composed-screen */`, `DataTable`/`Section`/`Stack`/primitives). This change reconciles the console and **re-skins the two kit tables to the transport vocabulary**, and adds the captured destructive-confirm dialog to the moderation actions.

This is a **reconcile / re-skin**, NOT a rebuild and NOT new moderation behavior.

## Key decision — keep the paginated tables, fold their look into the console's vocabulary (recommended)

The prototype shows users/gigs as simple inline lists inside the one console (it has tiny mock data: 5 users, 7 gigs). Production moderation needs the **paginated, filterable** `/admin/users` and `/admin/gigs` tables (shipped in `pagination-admin-pages`) — an uncapped inline list does not scale. **Recommendation: keep all three routes.** `/admin` is the console (reconciled to `dashboard.admin`) showing the **top slice** of users/gigs (the VM already does `.slice(0, 6)`) with the full lists at `/admin/users` · `/admin/gigs`; those two tables **keep their pagination + role/status filters and the moderation actions**, but their kit `DataTable` markup is **replaced with the console's transported row vocabulary** (avatar · name · role·email/title·client · status · destructive button). Since the prototype has **no reference PNG** for the table screens, the visual match target for their rows is the console's «Пользователи»/«Гиги» rows. The alternative — deleting the tables and making `/admin` the only admin screen — is **rejected** (loses pagination/filtering with no design replacement).

## Reference mapping (CRITICAL)

| App route / surface | App component | Captured reference |
|---|---|---|
| `/admin` console | `app/admin/AdminConsoleDesign.tsx` (already transported — reconcile) | `dashboard.admin` |
| block/unblock/close confirm | NEW small shared confirm dialog | `confirm.destructive` |
| `/admin/users` table | `app/admin/users/AdminUsers.tsx` (KIT → transport) | *(no PNG — reuse the console's «Пользователи» row vocabulary)* |
| `/admin/gigs` table | `app/admin/gigs/AdminGigs.tsx` (KIT → transport) | *(no PNG — reuse the console's «Гиги» row vocabulary)* |

The `disputeResolve.admin` queue target was reconciled in change 6 — here the queue's «Рассмотреть» only **links** to `/disputes/[id]`; the resolve screen is not re-touched.

## What

Reconcile/transport, preserving all existing data/action wiring:

- **Console** (`AdminConsoleDesign.tsx`): diff vs `dashboard.admin` and fix the 4 stat tiles **including their verbatim caption lines** («на платформе» / «всего опубликовано» / «пользователей» / «модерацией» — static copy, bound to `stats[].value`), the «Споры на модерации» queue (reason·amount · status pill · «Рассмотреть» → `/disputes/[id]`), the «Журнал модерации» log, the «Пользователи» rows (status «Активен/Заблокирован» · «Заблокировать»/«Разблокировать» → `suspendUser`/`unsuspendUser`), and the «Гиги» rows (status pill · «Закрыть» → `closeGig`).
- **Destructive-confirm dialog**: transport `confirm.destructive` as a small reusable client component — centred modal over a dimmed surface, title «Заблокировать пользователя?» (and the gig/unblock equivalents), body «"{name}" не сможет войти на платформу. Действие обратимо.», buttons «Отмена» (secondary) + red «Заблокировать»/«Закрыть». The destructive action MUST fire only on confirm. Used by the console AND the two tables.
- **Users/gigs tables** (`AdminUsers.tsx`, `AdminGigs.tsx`): replace the kit `DataTable`/`Section`/`Stack`/primitives markup with the console's transported row markup + `tokens.css`, **keeping** the pagination controls and the role/status filter selects (re-skinned to tokens) and the `suspendUser`/`unsuspendUser`/`closeGig` wiring. Drop the `/* @composed-screen */` kit contract.

## Constraints / Non-goals

- **Reconcile/re-skin, don't rebuild; keep routes & filenames.** Keep `/admin`, `/admin/users`, `/admin/gigs` and their component filenames. Preserve the `page.tsx → VM → component` wiring and the `getAdminDashboard` / `getAdminUsers` / `getAdminGigs` aggregators.
- **No moderation action / data-model changes.** `suspendUser`, `unsuspendUser`, `closeGig` and the `ModerationLog` / `User.suspended` / `Gig.closedByAdmin` model stay exactly as they are. The confirm dialog is a client-side gate only — it does not change what the action does.
- **Pagination & filtering preserved.** The tables keep offset pagination (30/page) and the role/status filters from `pagination-admin-pages`; only their markup changes.
- **Data gaps are additive only (Method §3).** The VM is rich (stats, queue, log, users, gigs). Stat captions are **static UI copy** (hardcoded in the component per Method §2), not a VM field — no VM change expected.
- **disputeResolve is change 6.** The queue rows only link to `/disputes/[id]`; the resolve screen is not re-touched.
- Desktop-only (1512px); reuse existing tokens; no new UI system; transport against dark first, confirm light still themes.
- **Out of scope:** auth (change 8); the gig/dispute/profile/etc. screens (changes 3–6).

## Impact

- Modifies: `app/admin/AdminConsoleDesign.tsx`, `app/admin/users/AdminUsers.tsx`, `app/admin/gigs/AdminGigs.tsx`.
- Adds: one small shared destructive-confirm dialog component (e.g. `app/_design/ConfirmDialog.tsx`).
- Possibly: `lib/view-models.ts` only if a real data gap surfaces (not expected).
- No data-model or server-action changes. Existing admin E2E (`compose-admin-dashboard`, `admin-moderation`, `admin-pagination`) must stay green; selectors updated only where markup changed.
