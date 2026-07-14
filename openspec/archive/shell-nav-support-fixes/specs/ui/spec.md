# UI Specification — Delta: shell-nav-support-fixes

> Fixes four inert/broken shell chrome controls in `app/_design/AppShellDesign.tsx` and
> `app/components/NotificationDropdown.tsx`. Behavior/positioning only — the captured visual design of
> every control is preserved. Extends the canonical "Shell Wiring Preserved" and "Sidebar Reconciled To
> Captured Reference" requirements.

## ADDED Requirements

### Requirement: Sidebar Collapse Toggle Is Wired And Persisted
The sidebar collapse chevron in the app shell (`app/_design/AppShellDesign.tsx`) MUST collapse and
expand the sidebar when activated, and MUST persist the chosen state across reloads. The chevron MUST
NOT be a dead control.

#### Scenario: Chevron collapses the sidebar
- **GIVEN** an authenticated user on any protected route with the sidebar in its default (expanded) state
- **WHEN** they click the collapse chevron in the sidebar header
- **THEN** the sidebar MUST narrow to an icon-only rail (nav labels, counts, profile name/sub-label, and
  support-card body copy are hidden; nav icons remain)
- **AND** the chevron glyph MUST flip to indicate the inverse (expand) action
- **AND** the main content area MUST reflow to use the reclaimed width without clipping

#### Scenario: Chevron expands a collapsed sidebar
- **GIVEN** the sidebar is collapsed
- **WHEN** the user clicks the chevron again
- **THEN** the sidebar MUST return to its full width with labels, counts, profile text, and the support
  card restored to the captured design

#### Scenario: Collapsed state persists across reload
- **GIVEN** the user has collapsed (or expanded) the sidebar
- **WHEN** they reload the page or navigate to another protected route
- **THEN** the sidebar MUST render in the last-chosen state, read from `localStorage`
  (`gigly.sidebar.collapsed`)
- **AND** a first-time user (no stored value) MUST see the expanded default

#### Scenario: Chevron is keyboard-operable
- **GIVEN** the collapse control
- **WHEN** a keyboard user tabs to it and presses Enter/Space
- **THEN** it MUST toggle the sidebar (it is a real `<button>` with an accessible label), not an inert `<div>`

### Requirement: GIGLY Wordmark Navigates To Role-Appropriate Home
The GIGLY wordmark in the sidebar header MUST be an actionable link to the user's home screen, with the
captured wordmark typography preserved.

#### Scenario: Wordmark links home for CLIENT/SPECIALIST
- **GIVEN** an authenticated CLIENT or SPECIALIST on any protected route
- **WHEN** they click the GIGLY wordmark
- **THEN** they MUST navigate to `/dashboard`
- **AND** the wordmark MUST retain its Handjet 30px, letter-spacing-2 styling from the captured reference

#### Scenario: Wordmark links to admin home for admin shell
- **GIVEN** the admin shell is rendered (`admin === true`)
- **WHEN** the admin clicks the GIGLY wordmark
- **THEN** they MUST navigate to `/admin`

#### Scenario: Wordmark is a real link
- **GIVEN** the rendered wordmark
- **WHEN** inspected
- **THEN** it MUST be a `next/link` anchor (keyboard-focusable, middle-click/open-in-new-tab capable),
  not a plain `<div>`

### Requirement: Notification Dropdown Anchors Within The Viewport On Desktop
The notifications dropdown (`app/components/NotificationDropdown.tsx`) MUST open attached to the
notification bell and remain fully visible within the viewport on desktop widths. Because the bell sits
in the left-hand sidebar, the panel MUST NOT overflow the left, right, or bottom viewport edge.

#### Scenario: Dropdown opens on-screen from the sidebar bell
- **GIVEN** an authenticated user on a desktop viewport (≥1024 px) with the bell in the sidebar profile card
- **WHEN** they open the notifications dropdown
- **THEN** the panel MUST be anchored to the bell and open toward the content area (not off the left edge)
- **AND** the panel's left and right edges MUST lie within the viewport (no horizontal clipping)
- **AND** the panel MUST NOT be clipped by the bottom of the viewport (it scrolls internally within its
  existing max height)

#### Scenario: Dropdown content and behavior are unchanged
- **GIVEN** the repositioned dropdown
- **WHEN** it renders
- **THEN** its content (title, notification list, per-type accent borders, empty/loading/error states),
  its click-outside and Escape-to-close behavior, and its mark-as-read-on-visit behavior MUST be
  identical to before — only its on-screen position changes

### Requirement: Support Widget Performs A Real Action
The «Поддержка / Что случилось?» control in the sidebar (`app/_design/AppShellDesign.tsx`) MUST perform a
real, user-visible action leading to a working support destination. It MUST NOT be a dead control.

#### Scenario: Activating «Что случилось?» reaches support
- **GIVEN** an authenticated user on any protected route
- **WHEN** they activate the «Что случилось?» control
- **THEN** they MUST be taken to the in-app `/help` support page, which carries the
  `mailto:a.pisotskiy@gmail.com` contact and the FAQ
- **AND** the control MUST retain its captured visual styling (the «Поддержка» heading, welcome body
  copy, and the pill button with the send icon are unchanged)

#### Scenario: Control is keyboard-accessible and not inert
- **GIVEN** the support control
- **WHEN** a keyboard user focuses it and activates it
- **THEN** it MUST navigate to `/help` (it is a real link/actionable control with an accessible label),
  not a no-op button

## MODIFIED Requirements

### Requirement: Shell Wiring Preserved
Reconciling the shell's markup MUST NOT break its existing behavior, and every shell chrome control MUST
be wired to a real action (no inert controls).

#### Scenario: Interactive elements remain wired
- **GIVEN** the reconciled shell
- **WHEN** a user interacts with it
- **THEN** nav items MUST route via the existing nav builder + active-marking over `usePathname`
- **AND** the notifications bell MUST open the live notifications dropdown
- **AND** the settings gear MUST navigate to the existing `/settings` page (which is NOT restyled by this change)
- **AND** the logout control MUST invoke the existing `logoutUser` action
- **AND** the theme control MUST toggle the existing light/dark theme

#### Scenario: Previously-inert chrome controls are now wired
- **GIVEN** the reconciled shell
- **WHEN** a user interacts with the sidebar chrome
- **THEN** the collapse chevron MUST toggle (and persist) the sidebar collapsed/expanded state
- **AND** the GIGLY wordmark MUST navigate to the role-appropriate home (`/dashboard`, or `/admin` in the
  admin shell)
- **AND** the «Что случилось?» support control MUST navigate to the `/help` support page
- **AND** no shell chrome control may be a no-op (`cursor: pointer` without a handler, or a button without
  an action)
