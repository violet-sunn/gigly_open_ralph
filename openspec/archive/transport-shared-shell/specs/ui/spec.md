# UI — Shared Design Shell (delta)

## ADDED Requirements

### Requirement: Shared Design Shell Wraps All Protected Routes
A single shared shell component (`app/_design/AppShellDesign.tsx`) MUST provide the sidebar + header chrome for every authenticated screen, transported from the prototype, so screens render only their own content inside a consistent frame.

#### Scenario: Protected and admin layouts render inside the shell
- **GIVEN** the protected layout (`app/(protected)/layout.tsx`) and the admin layout (`app/admin/layout.tsx`)
- **WHEN** any authenticated route renders
- **THEN** its content MUST be rendered as `children` of `AppShellDesign`
- **AND** no route may render its own sidebar/header chrome separately

#### Scenario: No competing shell renders for authenticated routes
- **GIVEN** the authenticated route tree
- **WHEN** a route renders
- **THEN** the legacy shell components (`AppShell`, `SidebarNavLive`, `TopbarLive`, `MainNav`) MUST NOT be in its render path

### Requirement: Sidebar Reconciled To Captured Reference
The sidebar MUST match the prototype's sidebar as captured in `design-reference/screens/`, with static copy transported verbatim.

#### Scenario: Sidebar structure and content
- **GIVEN** the rendered sidebar
- **WHEN** compared to the captured reference (e.g. `design-reference/screens/dashboard.specialist.png`)
- **THEN** it MUST contain, in order: the GIGLY wordmark, the profile card (avatar + name + role sub-label + notifications bell with unread badge + settings gear), the role framing, the nav list, the support/help card, and the logout control
- **AND** the support/help card's heading and body text MUST be the prototype's verbatim copy (not a paraphrase)
- **AND** the active nav item MUST show the accent active-bar and accent label/icon treatment

#### Scenario: Role framing reflects the user's actual role
- **GIVEN** a specialist, a company, or an admin session
- **WHEN** the sidebar renders
- **THEN** the role framing MUST highlight the user's actual role (admin mode highlights Админ)
- **AND** it MUST NOT offer live role-switching unless the product supports it (see proposal open decision)

### Requirement: Header Reconciled To Captured Reference
The header MUST match the prototype's header, with the page title derived per-route.

#### Scenario: Header title and controls
- **GIVEN** any authenticated route
- **WHEN** the header renders
- **THEN** it MUST show the accent vertical bar + the route's uppercase Handjet page title (matching the prototype's per-route titles)
- **AND** the top-right control MUST match the captured reference
- **AND** the search bar MUST appear only on the screens the prototype shows it on, with the prototype's verbatim placeholder text

### Requirement: Shell Wiring Preserved
Reconciling the shell's markup MUST NOT break its existing behavior.

#### Scenario: Interactive elements remain wired
- **GIVEN** the reconciled shell
- **WHEN** a user interacts with it
- **THEN** nav items MUST route via the existing nav builder + active-marking over `usePathname`
- **AND** the notifications bell MUST open the live notifications dropdown
- **AND** the settings gear MUST navigate to the existing `/settings` page (which is NOT restyled by this change)
- **AND** the logout control MUST invoke the existing `logoutUser` action
- **AND** the theme control MUST toggle the existing light/dark theme

#### Scenario: Build and existing E2E stay green
- **GIVEN** the reconciled shell
- **WHEN** `npm run build` and the existing E2E suite run
- **THEN** the build MUST pass
- **AND** the existing E2E suite MUST remain green (selectors updated where shell markup changed)
