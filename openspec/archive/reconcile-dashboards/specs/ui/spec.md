# Spec delta — ui (reconcile-dashboards)

Reconciles both `/dashboard` screens to **Дашборд/specialist (`2860:3751`)** and **Дашборд/company (`3371:5387`)**:
a WELCOME section (greeting + `OnboardingCard ×2`) replacing `BannerCard`, a 2-col BOARD (Активные задачи feed ‖
Сообщения feed), the specialist 6× `AttentionCard` strip (company: hidden), no page-title — all bound from live
data and kept token-pure + composition-pure.

## MODIFIED Requirements

### Requirement: Dashboard Screens Reconciled to the Figma Nodes
Both `/dashboard` screens (`SpecialistDashboard.tsx`, `ClientDashboard.tsx`) MUST remain composition-pure
`@composed-screen`s inside the layout's `AppShell`, reconciled to their Figma nodes: a **WELCOME** section
(a greeting heading + **two `OnboardingCard`s**) replacing the former `BannerCard`, followed by a **2-column
BOARD** — col1 «Активные задачи» (`SectionHeader` + the Tabs/Menu-switcher status filter + the `GigCard` feed),
col2 «Сообщения» (`SectionHeader` + the `MessagesPanel`) plus the role's find-project affordance (specialist:
`SearchPanel`; company: `CreateGigCTA`). The screens MUST NOT render a `"Дашборд"` page-title heading. They MUST be
token-pure (F2) and composition-pure (F5), and MUST preserve the status tabs + counts, the gig-link navigation, the
find-project search (specialist), and the create-gig affordance (company).

#### Scenario: WELCOME composes a greeting + two OnboardingCards (no BannerCard)
- GIVEN either dashboard
- WHEN it renders
- THEN it MUST render a greeting heading (name-bound, via `SectionHeader`) and **two `OnboardingCard`s**
- AND it MUST NOT render the former `BannerCard` headline

#### Scenario: BOARD is a 2-col Split with SectionHeader-led columns
- GIVEN either dashboard
- WHEN it renders
- THEN the BOARD MUST be a 2-col layout: col1 «Активные задачи» (`SectionHeader` + the status Tabs + the `GigCard`
  feed) and col2 «Сообщения» (`SectionHeader` + the `MessagesPanel`) plus the role's find-project affordance
  (specialist `SearchPanel` / company `CreateGigCTA`)
- AND each column section MUST be headed by a `SectionHeader`

#### Scenario: No page-title; status tabs + navigation preserved
- GIVEN either dashboard
- WHEN it renders and is interacted with
- THEN it MUST NOT render a `"Дашборд"` page-title heading
- AND the status Tabs (with counts) MUST still render and filter the `GigCard` feed, a `GigCard` MUST still open its
  gig detail, the specialist `SearchPanel` MUST still route to `/gigs`, and the company `CreateGigCTA` MUST still
  link to `/gigs/new`
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

### Requirement: Dashboard VMs Bind WELCOME + Attention from Live Data
`SpecialistDashboardData` and `ClientDashboardData` MUST replace `banner` with `greeting: string` +
`onboarding: OnboardingCardVM[]`, and `SpecialistDashboardData` MUST add `attention: AttentionCardVM[]`. The
`getSpecialistDashboard`/`getClientDashboard` mappers MUST bind these from live data: the greeting from the user's
name, the onboarding tiles from the real profile-completion (`completion`), and (specialist) the attention strip
from the user's recent notifications via a `getDashboardAttention(userId)` helper. `completion`, `gigCards`, `tabs`,
and `messages` MUST be preserved.

#### Scenario: Mapper emits greeting + onboarding + (specialist) attention
- GIVEN `getSpecialistDashboard(userId)` / `getClientDashboard(userId)`
- THEN each MUST return `greeting` (name-bound), `onboarding` (≥2 `OnboardingCardVM`s, the first carrying the real
  `completion` as its progress), `gigCards`, `tabs` (with counts), and `messages` — and NOT a `banner`
- AND `getSpecialistDashboard` MUST additionally return `attention: AttentionCardVM[]` (≤6, newest-first) mapped
  from the user's recent `Notification`s; each item's `type` is a valid `AttentionType` and its `embed` is a gig
  card or a message preview
- AND the returned objects MUST be assignable to the view-model contracts (`import type`)

#### Scenario: Attention helper maps notifications to typed cards
- GIVEN `getDashboardAttention(userId)`
- THEN it MUST return at most 6 `AttentionCardVM`s, newest-first, each with a valid `AttentionType` and a populated
  `embed` (gig `GigCardVM` when a gig is linked, else a message-style preview); an empty list when the user has no
  notifications

## ADDED Requirements

### Requirement: Attention Strip Is Specialist-Only; Tabs Retained as a Sanctioned Variant
The 6× `AttentionCard` strip MUST render on the **specialist** dashboard (a `SectionHeader` + a row of the
`attention` cards) when non-empty, and MUST NOT render on the **company** dashboard (the mock's `hidden=true`
strip). The col1 status Tabs MUST be kept for **both** roles as the «Активные задачи» Menu-switcher — matching the
company node and retained for the specialist as a **sanctioned content variant** (functional filtering the static
specialist feed omits), recorded in the reconciliation note.

#### Scenario: Specialist shows the strip; company hides it
- GIVEN a specialist with ≥1 notification and a company user
- WHEN each dashboard renders
- THEN the specialist dashboard MUST render the `AttentionCard` strip under its `SectionHeader`
- AND the company dashboard MUST NOT render any `AttentionCard` strip

#### Scenario: Tabs retained for both roles, divergence recorded
- GIVEN either dashboard
- WHEN it renders
- THEN col1 «Активные задачи» MUST include the status Tabs (the Menu-switcher) over the `GigCard` feed
- AND the specialist-tabs retention (vs the static node's plain feed) MUST be documented as a sanctioned content
  variant in the reconciliation note (`docs/DESIGN_SYSTEM_SPEC.md` §10.x)

### Requirement: Dashboard Reconciliation Keeps the Suite Green
Reconciling the dashboards MUST update the affected E2E/integration assertions to the new composition (greeting +
OnboardingCards + 2-col BOARD + specialist attention strip, no page-title, no `banner`) while preserving every
behavioural assertion (tabs + counts, gig-link, search, create), and MUST keep the build, token-purity lint, and
unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-{specialist,client}-dashboard.spec.ts` and
  `__tests__/integration/{specialist,client}-dashboard-vm.test.ts`
- WHEN they run after the reconciliation
- THEN the `BannerCard`/page-title assertions MUST be replaced by greeting + OnboardingCard + 2-col-BOARD (+ the
  specialist attention strip) assertions, and the VM tests MUST assert `greeting`/`onboarding`/`attention` (not
  `banner`)
- AND the behavioural assertions (five/four tabs + counts, gig-link → gig detail, specialist search → `/gigs`,
  company create → `/gigs/new`) MUST still pass
- AND `npm run build`, `npm run lint:tokens`, and `npm run test:unit` MUST pass
