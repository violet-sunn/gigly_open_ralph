# UI — Dashboards, Browse & My-Gigs (delta)

> Reconciles existing campaign-4 screens to the captured reference. See the proposal's reference-mapping table — the prototype's `search` route maps to the app's `/gigs` (browse) and the prototype's `gigs` route maps to the app's `/my-gigs`.

## ADDED Requirements

### Requirement: Shared Feed Components Reconciled To Reference
`app/_design/GigCard.tsx` and `app/_design/AttentionCardDesign.tsx` MUST match the gig cards and attention strip as captured in `design-reference/screens/`, since they are shared across multiple screens.

#### Scenario: GigCard matches the reference in both modes
- **GIVEN** the rendered `GigCard`
- **WHEN** compared to the gig cards in `design-reference/screens/` (compact: `dashboard.specialist`; full: `search.specialist`)
- **THEN** the compact mode (feed) and the `full` mode (browse/my-gigs footer with fixed price / deadline / «К проекту») MUST match the reference
- **AND** the status dot/label, company/rating row, tags, and timeline/progress treatments MUST match

#### Scenario: Reconciling shared components does not regress their other consumers
- **GIVEN** that `GigCard` is also used by profile, gig-detail, and applications
- **WHEN** the shared components are reconciled
- **THEN** those screens MUST NOT visually regress as a side effect (spot-check them)

### Requirement: Dashboard Reconciled To Reference
The dashboard MUST match `dashboard.specialist` (SPECIALIST) and `dashboard.company` (CLIENT) from the captured reference, preserving the existing `DashboardVM` wiring.

#### Scenario: Specialist dashboard regions
- **GIVEN** a SPECIALIST session on `/dashboard`
- **WHEN** the page renders
- **THEN** it MUST match `dashboard.specialist` for: the welcome/onboarding tiles, the «Мои гиги» board (status tabs + gig feed), the right-column «Найти новый гиг» search panel, the «Сообщения» panel, and the «Требует внимания» attention strip
- **AND** static copy (section headings, empty-state text) MUST be the prototype's verbatim text

#### Scenario: Client dashboard regions
- **GIVEN** a CLIENT session on `/dashboard`
- **WHEN** the page renders
- **THEN** it MUST match `dashboard.company` for: the onboarding tiles, the «Мои гиги» board, the right-column create-gig CTA, and the «Сообщения» panel (no attention strip)

#### Scenario: Dashboard tab filtering still works
- **GIVEN** the dashboard board tabs
- **WHEN** a tab is selected
- **THEN** the feed MUST filter by the existing client-side tab state (no regression to the VM-provided tabs/counts)

### Requirement: Browse (/gigs) Reconciled To Reference
The browse screen (`GigSearchDesign`) MUST match the prototype's «ПОИСК ГИГОВ» as captured in `search.specialist` / `search.company`.

#### Scenario: Browse results and filters
- **GIVEN** the `/gigs` browse screen with results
- **WHEN** it renders
- **THEN** it MUST match the reference for the filter row (category / budget / sort), the results header, and the results grid of `full` GigCards

#### Scenario: Browse empty state
- **GIVEN** a search/filter combination with no results
- **WHEN** the screen renders
- **THEN** it MUST show the prototype's empty state («Ничего не нашлось» + reset), matching the reference
- **AND** the existing URL-param filter wiring MUST be preserved

### Requirement: My-Gigs Reconciled To Reference
The my-gigs screen (`MyGigsDesign`) MUST match the prototype's «МОИ ГИГИ» as captured in `gigs.specialist` (all-tab) and `myGigs.specialist.*` (per-tab variants).

#### Scenario: My-gigs tabs and feed
- **GIVEN** the `/my-gigs` screen
- **WHEN** it renders
- **THEN** it MUST show the status tabs (Все / Заявки / В работе / На проверке / Завершённые) and the feed of `full` GigCards matching the reference
- **AND** selecting each tab MUST filter the feed (matching the per-tab reference variants) via the existing client-side tab state
- **AND** an empty tab MUST show the prototype's empty state

### Requirement: Build And Existing E2E Stay Green
Reconciling these screens MUST NOT break the build or the existing E2E for these routes.

#### Scenario: Build and route E2E
- **GIVEN** the reconciled screens
- **WHEN** `npm run build` and the existing E2E suite run
- **THEN** the build MUST pass
- **AND** the existing dashboard / browse / my-gigs E2E specs MUST remain green (selectors updated only where markup changed)
