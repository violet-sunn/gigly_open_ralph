# UI Specification Delta: compose-shell-cutover

This document contains specification changes for the `compose-shell-cutover` change — the **first Phase-2
screen-composition** change. It wires the Phase-0 `AppShell` template + `SidebarNav` / `Topbar` blocks into
`app/(protected)/layout.tsx` with live data, replacing the legacy `MainNav`. It ships **a nav data layer + additive
block slots + client wrappers + the layout cutover + tests only** — composition-pure (F5), exact RU nav per role
(F3), with the **F1 pixel-fidelity** enforcement **deferred to the Figma design lock**. It does **not** build the new
Phase-2 routes, restyle page bodies, touch the admin layout, or add mobile behaviour.

---

## ADDED Requirements

### Requirement: Protected Layout Composes the AppShell
`app/(protected)/layout.tsx` MUST compose `AppShell` + `SidebarNav` + `Topbar` (replacing `MainNav`), as a
composition-pure screen (Fidelity DoD F5).

#### Scenario: The layout is a composed screen
- GIVEN `app/(protected)/layout.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, render `<AppShell sidebar={…SidebarNav…} topbar={…Topbar…}>
  {children}</AppShell>`, import only kit (`templates`/`blocks`/`layout`/`primitives`) + `lib`/`actions`, and contain
  **no** `className=` / `style=` / raw markup
- AND `MainNav` MUST no longer be rendered by the protected layout

#### Scenario: All existing protected routes render inside the shell
- GIVEN the cutover
- WHEN a CLIENT or SPECIALIST visits `/dashboard`, `/gigs`, `/gigs/new`, `/gigs/[id]`, `/profile`, `/profile/edit`, or
  `/profile/[userId]`
- THEN the page MUST render inside the `AppShell` content region (sidebar + topbar present), with no error

**Acceptance Criteria:**
- `app/(protected)/layout.tsx` composes `AppShell`+`SidebarNav`+`Topbar` (F5-pure, `@composed-screen`); `MainNav` unused by it
- Every existing protected route renders within the shell

---

### Requirement: Exact RU Navigation Per Role
The sidebar MUST show the exact RU navigation per role (Fidelity DoD F3 — logical parity).

#### Scenario: CLIENT navigation
- GIVEN an authenticated CLIENT
- WHEN the sidebar renders
- THEN it MUST show, in order: **Дашборд** (`/dashboard`), **Мои гиги**, **Чаты** (`/chats`), **Финансы**
  (`/finances`), **Споры** (`/disputes`)

#### Scenario: SPECIALIST navigation
- GIVEN an authenticated SPECIALIST
- WHEN the sidebar renders
- THEN it MUST show the CLIENT items **plus Поиск** (`/gigs`) — i.e. Дашборд, Поиск, Мои гиги, Чаты, Финансы, Споры

#### Scenario: Nav targets for not-yet-built routes are present
- GIVEN routes `/chats`, `/finances`, `/disputes` are built by later Phase-2 changes
- WHEN the sidebar renders
- THEN those items MUST still be present (F3 exact nav), pointing at their canonical hrefs; the route-render check
  covers only the **existing** protected routes

**Acceptance Criteria:**
- Sidebar shows the exact RU items/order per role (CLIENT 5 items; SPECIALIST + Поиск)
- Items point at canonical hrefs (incl. not-yet-built routes, present per F3)

---

### Requirement: Live Counts and Active State
The shell MUST reflect live data — nav counts and the active route.

#### Scenario: Live counts
- GIVEN the layout (server) computes counts
- WHEN the sidebar/topbar render
- THEN nav counts (e.g. open gigs, unread chats via `Notification.lastReadAt`) MUST reflect the current data, and the
  topbar MUST show the live unread-notification count

#### Scenario: Active state follows the route
- GIVEN the current pathname
- WHEN the sidebar renders
- THEN the nav item matching the current route MUST be marked active (computed from `usePathname` in a client wrapper)

**Acceptance Criteria:**
- Live counts (gigs, unread chats) + topbar unread count reflect real data
- The current route's nav item is active (pathname-driven)

---

### Requirement: Preserved Behaviour (auth, logout, notifications, a11y, desktop-only)
The cutover MUST preserve the protected layout's existing behaviour.

#### Scenario: Session guard preserved
- GIVEN an unauthenticated request to a protected route
- WHEN the layout runs
- THEN `getSession()` MUST redirect to `/login` (unchanged)

#### Scenario: Logout and notifications preserved
- GIVEN an authenticated CLIENT/SPECIALIST
- WHEN the shell renders
- THEN logout MUST work (the `logoutUser` action via a form in the sidebar) and the interactive `NotificationBell` MUST
  be present in the topbar

#### Scenario: Accessibility and desktop-only
- GIVEN the shell
- WHEN inspected
- THEN the skip-link target `#main-content` (the focusable `<main>` provided by `AppShell`) MUST be preserved, and the
  shell MUST be **desktop-only** (no mobile hamburger menu)

**Acceptance Criteria:**
- No-session redirect, `logoutUser` logout, and `NotificationBell` preserved; `#main-content`/skip-link intact
- Desktop-only (legacy mobile menu removed)

---

### Requirement: Additive Live-Wiring Block Slots
`SidebarNav` and `Topbar` MUST gain optional slots for the interactive pieces, additively.

#### Scenario: Optional slots, presentational by default
- GIVEN `SidebarNav` (optional `logout` slot) and `Topbar` (optional `notifications` slot)
- WHEN no slot is passed (fixtures / workbench)
- THEN the blocks MUST render exactly as before (presentational "Выйти" Button / bell Icon); `lint:composition` and the
  workbench compositions MUST be unaffected
- AND WHEN the live layout passes the slots, the blocks MUST render the supplied interactive nodes (logout form /
  `NotificationBell`) in their place

**Acceptance Criteria:**
- `SidebarNav.logout?` + `Topbar.notifications?` optional slots; additive (no-slot render unchanged)
- The live wrappers inject the `logoutUser` form + `NotificationBell` via the slots

---

### Requirement: Fidelity DoD, Gate, and Verification
The change MUST pass the buildable Fidelity DoD (F3 + F5) and the functional suite now; F1 is gated on the design lock.

#### Scenario: F5 composition + F3 parity + suite green (buildable now)
- GIVEN the change
- WHEN `npm run lint:composition`, `npm run lint:tokens`, `npm run build`, `npm run test:unit`, and the nav E2E run
- THEN they MUST pass — the layout is composition-pure (F5), the nav matches the design per role (F3), and the ~860
  existing tests stay green (selectors/ARIA preserved)

#### Scenario: F1 pixel-fidelity deferred to the design lock
- GIVEN the Figma design is **not yet locked** (fonts/licence + exported raster assets pending)
- WHEN the change is implemented
- THEN the **F1** shell pixel-diff (expanded + collapsed, ≤1% vs the Figma shell, via `scripts/design-system/
  fidelity-diff.js`) MUST be captured/enforced **once the design locks**; pre-lock acceptance is F3 + F5 + functional
  + E2E

**Acceptance Criteria:**
- `lint:composition` (F5) + F3 nav parity + `build` + `test:unit` + nav E2E green (buildable, design-lock-independent)
- F1 shell pixel-diff (expanded + collapsed) captured/enforced at the design lock

---

## Test Plan

This change ships a nav data layer + additive block slots + client wrappers + the layout cutover + tests. Validation
is by deterministic commands. Commands assume the repo root. (Run on `/ralphy-implement`, after the design-lock gate.)

### Layout composition + nav data + slots
```bash
grep -qE '@composed-screen' app/\(protected\)/layout.tsx && grep -qE 'AppShell' app/\(protected\)/layout.tsx && echo "layout composes AppShell (F5 marker)"
grep -qE 'MainNav' app/\(protected\)/layout.tsx && echo "CHECK MainNav still used" || echo "OK MainNav removed from protected layout"
test -f lib/nav.ts && grep -qE 'buildSidebarNav' lib/nav.ts && grep -qE 'markActive' lib/nav.ts && echo "nav data layer present"
grep -qE 'logout\??:' app/components/blocks/SidebarNav.tsx && grep -qE 'notifications\??:' app/components/blocks/Topbar.tsx && echo "additive block slots"
```

### F3 nav parity (RU labels per role)
```bash
grep -qE 'Дашборд|Мои гиги|Чаты|Финансы|Споры' lib/nav.ts && grep -qE 'Поиск' lib/nav.ts && echo "exact RU nav present per role"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Build + suite + nav E2E (functional)
```bash
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (~860, clean DB)"
npx playwright test __tests__/e2e/ 2>&1 | tail -15  # nav E2E updated to the sidebar; logout + route render
```

### F1 shell pixel-fidelity (GATED — run once the design is locked)
```bash
# Deferred until the Figma design lock + fonts/licence + exported assets.
node scripts/design-system/fidelity-diff.js  # shell expanded + collapsed, ≤1% vs the Figma reference
```

### Manual review
1. Confirm the protected layout is a composition-pure `@composed-screen` (AppShell + SidebarNav + Topbar; no className/style; `MainNav` unused).
2. Confirm the exact RU nav per role (CLIENT 5 items; SPECIALIST + Поиск), live counts, and active state.
3. Confirm no-session redirect, logout, `NotificationBell`, and `#main-content`/skip-link are preserved; desktop-only.
4. Confirm `SidebarNav`/`Topbar` slots are additive (fixtures/workbench unaffected), and that F1 is deferred to the design lock (F3/F5/functional enforced now).
