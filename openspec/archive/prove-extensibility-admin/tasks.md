# Implementation Tasks: prove-extensibility-admin

> **GENERATIVITY ACCEPTANCE (Phase 2, final change).** Rebuild the admin moderation screens (`/admin`, `/admin/users`,
> `/admin/gigs` — no mock) **purely from the kit** (`AppShell` + existing blocks/primitives), proving the system is
> generative. **ZERO new tokens/primitives and ZERO bespoke styling**; the **one** genuine gap — a generic `DataTable`
> block — is added **on-system** (token-pure) and **logged to `docs/DESIGN_SYSTEM_SPEC.md`**. Preserve all admin
> behavior; reuse the moderation actions + query/pagination/filter logic verbatim. Extend the generativity gate to the
> admin screens (zero off-system values). Friction: medium–high.

---

## Task 1: [x] `DataTable` block — the one logged SYSTEM addition

**Implementation Notes:**
- Create `app/components/blocks/DataTable.tsx` (a block — token classes / layout primitives OK; NOT a
  `@composed-screen`): a generic, token-pure, **semantic** table. Props `{ columns: string[]; rows: { id: string; cells:
  ReactNode[] }[]; empty?: ReactNode }`. Render `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<td>` with **token classes only**
  (no hex/rgb/px); an empty state when `rows.length === 0`. Cells are `ReactNode` so the screen slots
  `StatusBadge`/`Tag`/plain text/inline action forms. Token-pure (mirror `LedgerTable`'s token usage). Sketch:
  ```tsx
  import type { ReactNode } from "react";
  import { Panel } from "@/app/components/layout/Panel";

  export interface DataRow { id: string; cells: ReactNode[] }
  export function DataTable({ columns, rows, empty }: { columns: string[]; rows: DataRow[]; empty?: ReactNode }) {
    return (
      <Panel surface={1} radius="lg" padding={0} border>
        <table className="w-full text-body font-body text-strong">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 text-left text-caption font-caption text-subtle">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                {r.cells.map((cell, i) => (
                  <td key={i} className="px-4 py-3 align-middle">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <span className="block px-4 py-6 text-body font-body text-muted">{empty ?? "Нет записей"}</span>}
      </Panel>
    );
  }
  ```
- Add `dataTableFixture` to `fixtures.ts`; export `DataTable` (+ `DataRow`) from `app/components/blocks/index.ts`; add a
  workbench registry entry; add a render assertion to `domain-blocks.test.tsx` (columns + rows + empty state).

**Test Plan:**
```bash
test -f app/components/blocks/DataTable.tsx && grep -qE 'DataTable' app/components/blocks/index.ts && echo "block + export"
grep -qE 'dataTableFixture' app/components/blocks/fixtures.ts && echo "fixture"
npm run lint:tokens && echo "token-pure (no new off-token literal)"
```
Expected: `DataTable` token-pure semantic-table block (+ empty state) + fixture + barrel export + workbench entry.

---

## Task 2: [x] Log the `DataTable` addition to `docs/DESIGN_SYSTEM_SPEC.md`

**Implementation Notes:**
- In `docs/DESIGN_SYSTEM_SPEC.md` §3.2 (Blocks), add `DataTable` to the block vocabulary with a one-line contract
  (generic columns + ReactNode cells + empty state), and add a short note: "**System additions from the generativity
  proof (prove-extensibility-admin):** the admin screens surfaced one genuine gap — a generic `DataTable` — added
  on-system (token-pure, from primitives) per the extensibility process; no new token/primitive/literal." This records
  that the system grew by exactly one block, via the documented process.

**Test Plan:**
```bash
grep -qE 'DataTable' docs/DESIGN_SYSTEM_SPEC.md && grep -qiE 'generativity|prove-extensibility' docs/DESIGN_SYSTEM_SPEC.md && echo "DataTable logged in DESIGN_SYSTEM_SPEC §3.2"
```
Expected: the `DataTable` addition + the generativity-proof note are recorded in `DESIGN_SYSTEM_SPEC.md`.

---

## Task 3: [x] Admin shell cutover (AppShell + admin nav)

**Implementation Notes:**
- `lib/nav.ts`: add an admin nav set (Dashboard → `/admin`, Users → `/admin/users`, Gigs → `/admin/gigs`) as
  `SidebarNavItemVM[]` (nav **data** — not a kit addition); reuse `markActive`.
- `app/admin/layout.tsx`: recompose to `AppShell` (`sidebar={<SidebarNav … admin items, active>}`, `topbar={<TopbarLive
  …>}`), preserving the `getSession` guard (and ADMIN gate). Replace `MainNav`. (Build the profile/unread the same way
  the protected layout does.)

**Test Plan:**
```bash
grep -qE 'AppShell' app/admin/layout.tsx && grep -qE 'MainNav' app/admin/layout.tsx && echo "CHECK MainNav still present" || echo "MainNav replaced by AppShell"
grep -qE 'admin|/admin' lib/nav.ts && echo "admin nav set added"
```
Expected: the admin layout uses `AppShell` + admin `SidebarNav`/`Topbar`; the active admin item highlights.

---

## Task 4: [x] Admin view-model mappers (`lib/view-models.ts`)

**Implementation Notes:**
- Add (server-only), reusing the **existing** query/pagination/filter logic verbatim:
  - `getAdminDashboard()` → `{ stats: StatPanelVM }` from the four counts (`user.count`, `gig.count`, suspended, closed).
  - `getAdminUsers(opts: { role?; status?; page })` → `{ rows: AdminUserRow[]; page; totalPages; totalCount; hasFilters }`
    (same `where`, `skip`/`take`, `PAGE_SIZE = 30`, ordering) — `AdminUserRow = { id; email; role; suspended; createdAt
    (display) }`.
  - `getAdminGigs(opts: { status?; closed?; page })` → the analogous `{ rows: AdminGigRow[]; … }`.
  (Return typed row **data**; the screen renders the cells. Mirror the existing pages' query/redirect math; the page
  keeps the invalid/over-range redirects.)

**Test Plan:**
```bash
grep -qE 'getAdminUsers|getAdminGigs|getAdminDashboard' lib/view-models.ts && echo "admin mappers added"
```
Expected: `getAdminDashboard`/`getAdminUsers`/`getAdminGigs` return the stats + paginated/filtered row data, reusing the existing logic.

---

## Task 5: [x] Three composed admin screens (+ inline moderation/filter wiring) + thin pages

**Implementation Notes:**
- `app/admin/AdminDashboard.tsx` (`/* @composed-screen */`): `Section` «Админ» + `StatPanel` (the four counts) + nav
  links (`Button`/`Link`) to `/admin/users` + `/admin/gigs`. Likely a server component.
- `app/admin/users/AdminUsers.tsx` (`/* @composed-screen */` + `'use client'`): a kit filter (FilterBar **or** `Select`
  primitives navigating via URL params — role / status) + a `DataTable` (columns Email · Role · Status · Registered ·
  Actions; rows from `AdminUserRow` with `Tag` for role, `StatusBadge` for active/suspended, and an inline `<form
  action={suspendUser|unsuspendUser}>` (Button) per row) + pagination (reuse `PaginationControls` if kit-importable,
  else a kit-composed pager) + an empty state (`DataTable.empty`). Inline the moderation forms (import
  `suspendUser`/`unsuspendUser` from `@/app/actions/moderation`). No className/style.
- `app/admin/gigs/AdminGigs.tsx` (`/* @composed-screen */` + `'use client'`): analogous, with `closeGig` + the gig
  filters (status / closed).
- Thin pages (`app/admin/page.tsx`, `app/admin/users/page.tsx`, `app/admin/gigs/page.tsx`): `getSession` + the **ADMIN**
  guard (non-admin → `/dashboard`); the invalid/over-range page redirects (preserved); call the mapper; render the
  screen. Map status/role to badges in the screen: suspended → `StatusBadge` `rejected`, active → `completed`; role →
  `Tag`. Keep the action button labels ("Suspend"/"Unsuspend"/"Close") so the admin E2E selectors survive.

**Test Plan:**
```bash
for f in app/admin/AdminDashboard.tsx app/admin/users/AdminUsers.tsx app/admin/gigs/AdminGigs.tsx; do
  grep -qE '@composed-screen' "$f" && echo "$f composed"; grep -qE 'className=|style=' "$f" && echo "  CHECK raw styling in $f" || echo "  OK $f no raw styling";
done
grep -qE 'DataTable' app/admin/users/AdminUsers.tsx && grep -qE 'DataTable' app/admin/gigs/AdminGigs.tsx && echo "compose DataTable"
grep -qE 'suspendUser|unsuspendUser' app/admin/users/AdminUsers.tsx && grep -qE 'closeGig' app/admin/gigs/AdminGigs.tsx && echo "reuse moderation actions"
npm run lint:composition && echo "F5 green"
```
Expected: three F5-pure admin `@composed-screen`s composing `DataTable` + kit, wired to the kept moderation actions; the ADMIN guard + redirects preserved.

---

## Task 6: [x] Extend the generativity gate to the admin proof

**Implementation Notes:**
- Extend `scripts/design-system/validate-generativity.js` so the **admin screens** (`AdminDashboard`/`AdminUsers`/
  `AdminGigs`) are asserted to exist and be `@composed-screen`s (in addition to the existing probe), then run the
  composition + token-purity lints (which scan them) — i.e. the admin screens assemble with **zero off-system values**.
  Keep the existing probe check. A planted off-system value in any admin screen MUST fail the gate.

**Test Plan:**
```bash
grep -qE 'AdminUsers|admin' scripts/design-system/validate-generativity.js && echo "gate extended to admin"
npm run lint:generativity && echo "generativity: admin screens assemble with zero off-system values"
```
Expected: `lint:generativity` asserts the admin screens are kit-only composed screens with zero off-system values.

---

## Task 7: [x] Behavior preservation + admin E2E update + acceptance

**Implementation Notes:**
- **Preserve** the admin integration tests (`admin-authorization`, `admin-users-pagination`, `admin-gigs-pagination`,
  `moderation-integration`, `moderation-edge-cases`, `moderation-logging`) — they target the actions/queries (unchanged).
- **Update** the admin E2E (`admin-moderation.spec.ts`, `admin-pagination.spec.ts`) to the kit markup where needed: the
  `DataTable` renders semantic `<tr>` rows and the action buttons keep their labels, so `tr:has-text(email|title)` /
  `button:has-text("Suspend"|"Close")` survive; update changed headings/containers and any old-table-specific selectors.
- Run the full battery: `lint:generativity`, `lint:composition`, `lint:tokens`, build, `test:unit`, and the admin E2E.
  Confirm scope: only the admin screens recomposed + the one `DataTable` block + the admin mappers + the shell cutover +
  the gate extension + the spec log; **no new token/primitive**, no bespoke styling, no moderation/query/pagination
  semantics change, no data-model change. Confirm the `DataTable` addition is logged in `DESIGN_SYSTEM_SPEC.md`.

**Test Plan:**
```bash
npm run lint:generativity && npm run lint:composition && npm run lint:tokens && echo "generativity + F5 + tokens green"
npm run clean:test-db && npx vitest run __tests__/integration/admin-authorization.test.ts __tests__/integration/moderation-integration.test.ts __tests__/integration/admin-users-pagination.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/admin-moderation.spec.ts __tests__/e2e/admin-pagination.spec.ts --project=chromium 2>&1 | tail -12
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```
Expected: generativity + F5 + tokens green; admin integration tests green (behavior preserved); admin E2E green on the kit markup; build + suite green; the one system addition logged.

---

## Summary

Total tasks: 7
Estimated effort: 16–22 hours (friction: medium–high — three admin screens + an admin shell cutover + one new kit block
(the logged gap) + the admin mappers + inline moderation/filter wiring + the generativity-gate extension + the spec log
+ admin E2E updates; no new token/primitive, no bespoke styling, moderation/query/pagination logic reused)

**Deliverables:**
- `DataTable` block — the **one** discovered system gap, token-pure, logged to `DESIGN_SYSTEM_SPEC.md` (+ fixture + workbench + render test).
- Admin shell cutover (`AppShell` + admin nav, active item) replacing `MainNav`.
- `getAdminDashboard`/`getAdminUsers`/`getAdminGigs` mappers (reuse the existing query/pagination/filter logic).
- Three F5-pure admin `@composed-screen`s (`AdminDashboard`/`AdminUsers`/`AdminGigs`) with inline moderation/filter wiring; thin pages (ADMIN guard + redirects).
- Generativity gate extended to the admin screens (zero off-system values); preserved admin integration tests + updated admin E2E.

**Critical path:** DataTable block (1) → log it (2) → admin shell cutover (3) → admin mappers (4) → composed screens (5) → generativity gate (6) → behavior/E2E + acceptance (7).

**Dependencies:** the full Phase 0 kit (AppShell + blocks/primitives + the generativity gate) + the moderation/pagination data layers — all complete.

---

## Implementation status (2026-06-17)

**Done + verified (Tasks 1–7) — the generativity proof holds:**
- **`DataTable` block** (`app/components/blocks/DataTable.tsx`) — the **one** gap: a generic, token-pure, **semantic**
  table (`<table>/<thead>/<tbody>/<tr>/<td>`) from `{ columns, rows: { id, cells: ReactNode[] }, empty }`. No new
  token/primitive/literal. `dataTableFixture` + barrel export (`DataTable`, `DataRow`) + workbench registry + render
  test (2). **It was already spec'd** in `DESIGN_SYSTEM_SPEC.md §3.2` under "Mapping / admin entities (generativity)" —
  the proof *implements* it; the §3.2 note now records the on-system addition (stronger story: the system anticipated
  the mock-less need).
- **Admin shell cutover** — `lib/nav.buildAdminNav()` (Дашборд/Пользователи/Гиги) + `app/admin/AdminNavLive.tsx`
  (active: exact for `/admin`, prefix for sub-routes); `app/admin/layout.tsx` recomposed to `AppShell` +
  `AdminNavLive` + `TopbarLive`, replacing `MainNav`, preserving the ADMIN guard.
- **Admin mappers** (`lib/view-models.ts`) — `getAdminDashboard` (the 4 counts → `StatPanelVM`), `getAdminUsers`,
  `getAdminGigs` (paginated/filtered rows + count), **reusing the existing `where`/`skip`/`take`/`PAGE_SIZE=30` logic
  verbatim**; return typed row data.
- **Three F5-pure `@composed-screen`s** — `AdminDashboard` (StatPanel + links), `AdminUsers` (Select role/status filters
  → URL + `DataTable` with `Tag`/`StatusBadge` + inline reveal-to-confirm suspend/unsuspend), `AdminGigs` (Select
  status/closed filters + `DataTable` + inline close), wired to the **kept** `suspendUser`/`unsuspendUser`/`closeGig`
  (reason via `ApplyPanel` → the E2E's `textarea[name="reason"]` + "Suspend User"/"Close Gig"). Thin pages preserve the
  ADMIN guard + invalid/over-range redirects; pagination + the "Showing X-Y of Z" count live in the page
  (orchestration, via the existing `PaginationControls`).
- **Generativity gate extended** (`scripts/design-system/validate-generativity.js`) — asserts the three admin screens
  exist + are `@composed-screen`s, then runs the composition + token lints over them = **zero off-system values**.
- **Cleanup** — the five legacy off-system admin islands (`SuspendUserForm`/`UnsuspendUserForm`/`UserFilters`/
  `CloseGigForm`/`GigFilters`) were **deleted** (no remaining imports); the admin directory is now kit-only.
- **Gates** — `lint:generativity` ✓ (probe + admin screens, zero off-system) · `lint:composition` (F5, **18** composed
  screens; +3 admin) ✓ · `lint:tokens` ✓ · `npm run build` ✓ (`/admin` 458 B · `/admin/users` 2.48 kB · `/admin/gigs`
  2.43 kB) · `npm run test:unit` **905/905** (+2 DataTable) · admin **integration** (authorization + moderation +
  pagination) **56/56** unchanged · admin **E2E 16/16** (moderation workflow + pagination + filters — updated to drive
  the kit `Select` filters).

**Generativity outcome.** Admin (mock-less) was rebuilt **purely from the kit** with **ZERO new tokens/primitives and
ZERO bespoke styling**; exactly **one** gap (`DataTable`, already anticipated in §3.2) was implemented **on-system** and
recorded. The gate proves zero off-system values; behavior is fully preserved (guard, filters, pagination,
suspend/unsuspend/close + logging, empty states). **No full-screen F1** (no mock) — the acceptance is generativity + F5
+ F3 + behavior.

**Reconciliation recorded:** the admin **E2E filter** tests were updated from the native `selectOption('select', …)`
to driving the kit `Select` primitive (open the trigger by aria-label → click the option); the moderation +
pagination behavioral assertions are unchanged (semantic `<tr>` rows + preserved action labels kept them working).

**Scope guards (non-goals held):** no data-model change; moderation actions + query/pagination/filter logic reused
verbatim (the 56 admin integration tests stay green); **no new token or primitive**; **no bespoke styling**; **no block
beyond the one logged `DataTable`**; the protected shell is unchanged.
