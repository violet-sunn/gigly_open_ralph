# Change Proposal: compose-shell-cutover

> Phase 2, change 18 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`) — the
> **first screen-composition change** and the shell cutover all other Phase-2 screens depend on. It wires the Phase-0
> **`AppShell`** template + **`SidebarNav`** / **`Topbar`** blocks into `app/(protected)/layout.tsx` with **live data**,
> replacing the legacy `MainNav`. Depends on: layout-grammar, domain-blocks, ui-primitives (all complete). Friction:
> **high** (DOM restructure of every protected route's chrome).
>
> **Plan-only gate.** Per the planning doc, Phase 2 executes only once the **Figma design is locked** (+ fonts/licence
> + exported raster assets). This change is **planned now**; `/ralphy-implement` runs when the gate opens. The
> **F1 pixel-fidelity** enforcement (≤1% vs the Figma shell) is **deferred to that lock**; the structural/functional
> acceptance (F3 logical parity, F5 composition purity, routes render, logout, notifications, counts) is buildable and
> testable independently.

## Problem Statement

The authenticated app currently renders a **legacy top-horizontal nav** (`app/components/MainNav.tsx`) with **English**
labels (Dashboard / Post Gig / Browse Gigs / Profile) and a mobile hamburger — not the redesign's **role-based RU
sidebar shell**. Phase 0 built the mechanism but deliberately did **not** wire it (the `AppShell` doc: *"NOT wired into
routes here (compose-shell-cutover, Phase 2)"*):

- `app/(protected)/layout.tsx` renders `<MainNav>` + `<main>`, not `<AppShell sidebar={<SidebarNav…>} topbar={<Topbar…>}>`.
- `SidebarNav` / `Topbar` are **presentational** blocks driven by `SidebarNavVM` / `TopbarVM` from **fixtures** — they
  render plain `<a href>` nav items, a **non-wired** "Выйти" `Button`, and a **presentational** bell `Icon`. There is
  no live wiring: no role-based RU nav built from the session, no live counts (gigs, unread chats), no `usePathname`
  active state, no working logout, and no interactive `NotificationBell`.
- So every protected route still wears the old chrome, and the 11 other Phase-2 screens (which all compose inside
  `AppShell`) have **no shell to compose into**.

The planning doc maps this exactly: wire `AppShell` + `SidebarNav` + `Topbar` into the protected layout with the exact
RU nav per role, live counts, all routes in the shell, desktop-only, preserving logout + notifications. The blocks
already type/render the shape — this change makes the shell **live**.

## Proposed Solution

Build the live nav data layer, add additive live-wiring slots to the two blocks, cut `app/(protected)/layout.tsx` over
to a composed `AppShell`, and verify. Six deliverable groups:

1. **Nav data layer (`lib/nav.ts`)** — a pure builder `buildSidebarNav(role, counts)` → the role's ordered nav items
   (RU labels + icon keys + hrefs, per the fixtures/§ design): **CLIENT** = Дашборд `/dashboard` · Мои гиги · Чаты
   `/chats` · Финансы `/finances` · Споры `/disputes`; **SPECIALIST** = the same **+ Поиск** `/gigs`. Plus a
   `markActive(items, pathname)` helper. Live **counts** (open gigs, unread chats via `Notification.lastReadAt`) are
   queried in the layout (server) and passed in.

2. **Block live-wiring slots (additive)** — extend `SidebarNav` with an optional `logout?: ReactNode` slot (rendered
   in place of the presentational "Выйти" `Button`) and `Topbar` with an optional `notifications?: ReactNode` slot
   (rendered in place of the presentational bell). **Additive** — when no slot is passed the blocks render exactly as
   today (fixtures / workbench unaffected). This makes the presentational blocks *live-wireable* without forking them
   (a system variant, not a copy).

3. **Active-state client wrappers** — small `'use client'` wrappers (`SidebarNavLive` / `TopbarLive`, co-located with
   the blocks) that take serializable props (role, counts, profile, unread), read `usePathname`, build + active-mark
   the VM via `lib/nav.ts`, and pass the **interactive slots** — a `logoutUser` form and the existing
   `NotificationBell` — into the enhanced blocks. (Active state needs the pathname, which only a client component
   has; the server layout stays a pure composition.)

4. **Layout cutover (`app/(protected)/layout.tsx`)** — rewrite it as a **composed screen** (`/* @composed-screen */`):
   `getSession()` → redirect (preserved) → compute live counts → `<AppShell sidebar={<SidebarNavLive …/>}
   topbar={<TopbarLive …/>}>{children}</AppShell>`. Preserve `SkipToMainContent` / `#main-content` (AppShell provides
   the focusable `<main>`), logout (`logoutUser`), and `NotificationBell`. **Desktop-only** (the AppShell has no mobile
   menu — the legacy hamburger is dropped). `MainNav` is no longer used by the protected layout.

5. **Exact RU nav per role + all routes render (F3)** — the sidebar shows the exact items/order per role; the existing
   protected routes (`/dashboard`, `/gigs`, `/gigs/new`, `/gigs/[id]`, `/profile`, `/profile/edit`, `/profile/[userId]`)
   all render **inside** the shell's content region. Nav targets for **not-yet-built** routes (`/chats`, `/finances`,
   `/disputes`) are present per F3; those routes are created by their own Phase-2 changes (`compose-chats` etc.).

6. **Tests + gate** — update the nav E2E (RU labels, role nav, active state, logout, counts) and add functional
   coverage (every protected route renders in the shell; no-session redirect; logout; notifications); run the **F5
   composition lint** on the new layout and assert **F3 logical parity**. The **F1** shell pixel-diff (expanded +
   collapsed, ≤1% vs the Figma shell) is a **gated** task that runs once the design is locked.

This change emits **a nav data layer + additive block slots + client wrappers + the layout cutover + tests only**. It
does **not** build the new Phase-2 routes (`/chats`/`/finances`/`/disputes`/`/settings` — their own changes), restyle
any **page body** (each page is composed by its own `compose-*` change; the cutover's fidelity target is the **shell
chrome**, per the planning doc's "Fidelity DoD on the empty shell"), touch the admin layout (`app/admin/*` —
`prove-extensibility-admin`), or add mobile/responsive behaviour (desktop-only).

## Constraints

### MUST Requirements
- `app/(protected)/layout.tsx` MUST compose `AppShell` + `SidebarNav` + `Topbar` (replacing `MainNav`), as a
  composition-pure (`@composed-screen`, F5) screen — no `className`/`style`/raw markup; imports only kit/lib/actions.
- The sidebar MUST show the **exact RU nav per role** (F3): CLIENT = Дашборд/Мои гиги/Чаты/Финансы/Споры; SPECIALIST =
  + Поиск — correct labels, order, and hrefs.
- The shell MUST show **live counts** (open gigs, unread chats) and **active state** for the current route.
- **All existing protected routes** MUST render inside the shell's content region; the **no-session redirect**
  (`getSession()` → `/login`), **logout** (`logoutUser`), the **`NotificationBell`**, and the skip-link/`#main-content`
  focus target MUST be preserved.
- The shell MUST be **desktop-only** (no mobile menu — the legacy hamburger is removed).
- `SidebarNav`/`Topbar` slot additions MUST be **additive** (fixtures / workbench / `lint:composition` unaffected when
  no slot is passed).
- `npm run build`, `npm run test:unit`, the **nav E2E** (updated), `npm run lint:tokens`, and `npm run lint:composition`
  MUST be green; the ~860 existing tests MUST stay green (preserve `data-testid`/ARIA they rely on).

### SHOULD Requirements
- Nav definitions SHOULD live in `lib/nav.ts` (a pure builder + `markActive`), so the wrappers and tests share one
  source; the client wrappers SHOULD be the only `'use client'` additions (the layout stays a server composition).
- The cutover SHOULD preserve any `data-testid`/ARIA roles the existing nav E2E and ~860 tests rely on, mapping old
  selectors to the new sidebar where labels changed (Dashboard→Дашборд, …).
- Unbuilt nav targets (`/chats`/`/finances`/`/disputes`) SHOULD point at their canonical routes (present per F3) even
  before those routes exist; they are built by `compose-chats`/`compose-finances`/`compose-disputes`.

### Non-Goals
- **No new routes** — `/chats`, `/finances`, `/disputes`, `/settings` are built by their own Phase-2 changes; the
  cutover only establishes the shell + nav targeting them.
- **No page-body restyling** — each page's content is composed by its own `compose-*` change; the cutover's fidelity
  target is the **shell chrome** (sidebar + topbar + empty content region), not the page interiors (which may show
  transitional double-padding until composed).
- **No admin shell** — `app/admin/*` has its own layout; the role-based sidebar is CLIENT/SPECIALIST (the design has no
  admin sidebar variant); admin is `prove-extensibility-admin`.
- **No mobile/responsive** — desktop-only (1440px), per the redesign non-goals.
- **F1 pixel-fidelity enforcement is deferred** to the Figma design lock (+ fonts/licence + exported assets); the
  buildable acceptance is F3 + F5 + functional + E2E.

## Success Criteria

1. `app/(protected)/layout.tsx` composes `AppShell` + `SidebarNav` + `Topbar` (replacing `MainNav`); passes `lint:composition` (F5).
2. Exact RU nav per role (F3) with live counts + active state; all existing protected routes render in the shell.
3. No-session redirect, logout, `NotificationBell`, and the skip-link/`#main-content` target preserved; desktop-only.
4. `SidebarNav`/`Topbar` slot additions additive (fixtures/workbench unaffected); nav E2E updated and green.
5. `npm run build`, `npm run test:unit` (~860 green), `npm run lint:tokens`, `npm run lint:composition` all green; F1 shell pixel-diff captured/enforced once the design locks.

## Affected Areas

- `app/(protected)/layout.tsx` (rewrite — composed `AppShell` shell; `@composed-screen`)
- `lib/nav.ts` (new — `buildSidebarNav(role, counts)` + `markActive`)
- `app/components/blocks/SidebarNav.tsx` (+ optional `logout` slot) · `app/components/blocks/Topbar.tsx` (+ optional `notifications` slot) — additive
- `app/components/blocks/SidebarNavLive.tsx` / `TopbarLive.tsx` (new — `'use client'` wrappers: usePathname → VM + interactive slots)
- `__tests__/e2e/*` (nav E2E updated to the sidebar) + a layout/route-render integration or E2E test
- read-only inputs: `app/components/templates/AppShell.tsx`, `app/components/blocks/{SidebarNav,Topbar}.tsx` + `fixtures.ts` (nav VMs/icon keys), `app/components/NotificationBell.tsx`, `app/actions/auth.ts` (`logoutUser`), `lib/session.ts`, `app/components/SkipToMainContent.tsx`
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements to the `ui` domain)
- (NOT modified: `MainNav.tsx` may remain for reference but is unused by the protected layout; page bodies; `app/admin/*`; the data models; other domains)

## Risks & Mitigations

**Risk**: Restructuring every protected route's chrome breaks the ~860 existing tests (selectors, ARIA, `#main-content`).
**Mitigation**: Preserve the focus target (`#main-content` — AppShell already provides it), the logout form
(`action={logoutUser}`), `NotificationBell`, and the no-session redirect; map old nav selectors/`data-testid` to the
new sidebar; run the full suite + nav E2E as the gate. High-friction is expected and front-loaded into the test task.

**Risk**: The presentational blocks can't carry live behaviour (plain `<a>`, non-wired logout, presentational bell).
**Mitigation**: Add **additive optional slots** (`logout` on SidebarNav, `notifications` on Topbar) + thin client
wrappers (`SidebarNavLive`/`TopbarLive`) that inject the `logoutUser` form, the `NotificationBell`, and `usePathname`
active state. Blocks stay presentational by default (fixtures/workbench unchanged) — a system *variant*, not a fork.

**Risk**: Composition lint (F5) forbids `className`/`style` and non-kit imports in the layout.
**Mitigation**: All styling/layout lives in `AppShell` + the blocks + layout primitives; the layout file is pure
composition importing only `templates`/`blocks`/`lib`/`actions`. VM-building lives in `lib/nav.ts`; interactive wiring
in the client wrappers (imported from `blocks`). The layout carries the `@composed-screen` marker.

**Risk**: Nav links target routes that don't exist yet (`/chats`/`/finances`/`/disputes`).
**Mitigation**: F3 requires the exact nav, so the items are present and point at their canonical routes; those routes
are delivered by their own Phase-2 changes. Documented as a dependency; the cutover's route-render test covers only
the **existing** protected routes.

**Risk**: ADMIN users on `(protected)` routes have no design sidebar variant.
**Mitigation**: `app/admin/*` has its own layout; the role sidebar is CLIENT/SPECIALIST. ADMIN handling on `(protected)`
is out of scope (admin screens are `prove-extensibility-admin`); the cutover degrades gracefully (e.g. falls back to
the specialist/neutral nav or routes ADMIN to `/admin`) — finalised in the admin generativity change.

**Risk**: Implementing before the design is locked yields throwaway pixel work.
**Mitigation**: The **plan-only gate** — `/ralphy-implement` runs after the lock. F1 baselines are captured then;
the F3/F5/functional/E2E acceptance is design-lock-independent and is what this change is verified against pre-lock.
