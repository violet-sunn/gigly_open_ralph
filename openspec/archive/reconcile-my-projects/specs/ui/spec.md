# Spec delta — ui (reconcile-my-projects)

Adds the standalone **«Мои гиги»** screen at a new route `/my-gigs` (both roles), reconciled to the `gigly_full_design`
prototype `gigs` screen: a `SectionHeader` «Мои гиги» + a `Tabs` status bar (Все / Заявки / В работе / На проверке /
Завершённые, with counts) over a 2-col `GigCard` grid of the **viewer's own gigs**, with the prototype empty state and
skeleton loading. The public browse/search at `/gigs` is unchanged. Token-pure (F2) + composition-pure (F5).

## ADDED Requirements

### Requirement: «Мои гиги» Screen at /my-gigs (Role-Aware Own Gigs)
The application MUST provide a standalone **«Мои гиги»** screen at `/my-gigs`, available to **both** CLIENT and
SPECIALIST, as a composition-pure `@composed-screen` inside `AppShell`. It MUST list the **viewer's own gigs** — for a
CLIENT, the gigs they posted; for a SPECIALIST, the gigs they applied to or are assigned to — as a 2-column `GigCard`
grid under a `SectionHeader` «Мои гиги» and a `Tabs` status bar. Each card MUST link to `/gigs/[id]`. The public
browse/search screen at `/gigs` MUST remain unchanged. The screen MUST be token-pure (F2) and composition-pure (F5),
composing only existing kit blocks (`SectionHeader`, `Tabs`, `GigCard`, an empty-state block) + layout + tokens. All
on-screen text MUST be Russian, matching the prototype.

#### Scenario: /my-gigs renders the header, tabs, and own-gig grid
- GIVEN an authenticated CLIENT (or SPECIALIST) on `/my-gigs`
- WHEN it renders
- THEN it MUST show a `SectionHeader` «Мои гиги», a `Tabs` status bar with per-tab counts, and a 2-column `GigCard` grid
  of the **viewer's own** gigs
- AND each `GigCard` MUST link to `/gigs/[id]`

#### Scenario: Role-aware content on one route
- GIVEN the `/my-gigs` screen
- WHEN a CLIENT views it, the grid MUST contain gigs the client posted
- AND WHEN a SPECIALIST views it, the grid MUST contain gigs the specialist applied to or is assigned to
- AND the public browse/search at `/gigs` MUST be unaffected by this change

### Requirement: Five Status Tabs With Counts (Both Roles)
The «Мои гиги» screen MUST present the prototype's five status tabs — **Все / Заявки / В работе / На проверке /
Завершённые** — for both roles, each showing a count, with client-side filtering of the grid by the active tab (Все =
all). The **«Заявки»** tab is role-specific in what it counts: for a CLIENT it MUST count the client's own OPEN gigs that
have received applications (the derived «На рассмотрении» status, OPEN + applications>0); for a SPECIALIST it MUST count
the specialist's own PENDING applications. The status derivation MUST reuse `gigDisplayStatus` (no new status semantics).

#### Scenario: Tabs render with counts and filter the grid
- GIVEN the «Мои гиги» screen with gigs across statuses
- WHEN it renders
- THEN the five tabs (Все / Заявки / В работе / На проверке / Завершённые) MUST each show a count
- AND selecting a tab MUST filter the grid to that status (Все shows all)

#### Scenario: «Заявки» is role-aware
- GIVEN the «Заявки» tab
- WHEN a CLIENT views it, it MUST count own OPEN gigs with applications (derived «На рассмотрении»)
- AND WHEN a SPECIALIST views it, it MUST count own PENDING applications

### Requirement: Prototype Empty State and Skeleton Loading
When the active tab has no gigs, the screen MUST render the prototype empty state — the title **«Здесь пока пусто»** and
the subtitle **«Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.»**. While the server data
resolves, the route MUST render a 2-column **skeleton** grid (a `loading.tsx` / Suspense fallback), matching the
prototype loading state.

#### Scenario: Empty tab shows the prototype empty state
- GIVEN a tab with no gigs
- WHEN that tab is active
- THEN the screen MUST show «Здесь пока пусто» and the subtitle «Гигов с таким статусом нет. Они появятся здесь, когда
  изменится статус работ.»

#### Scenario: Loading shows the skeleton grid
- GIVEN navigation to `/my-gigs` before data resolves
- THEN a 2-column skeleton grid MUST be shown via the route's loading boundary

### Requirement: getMyGigs View-Model
`lib/view-models.ts` MUST expose `getMyGigs(viewer)` returning the role-aware own-gig cards (each tagged with its tab)
and the five-tab descriptor (labels + counts). It MUST reuse `toGigCardVM` and `gigDisplayStatus` and the same gig
queries the dashboards already use — no new gig query semantics, no migration.

#### Scenario: getMyGigs returns role-aware cards and tab counts
- GIVEN `getMyGigs({ userId, role })`
- WHEN role is CLIENT, it MUST return the client's own gigs as cards (with «На рассмотрении» derived on OPEN+applications)
  and the five tabs with counts
- AND WHEN role is SPECIALIST, it MUST return the specialist's PENDING applications + assigned gigs as cards and the five
  tabs with counts

### Requirement: Navigation Points «Мои гиги» at /my-gigs
The sidebar navigation MUST expose «Мои гиги» → `/my-gigs` for **both** roles, and keep «Поиск» → `/gigs` for the
specialist. The nav fixtures MUST be reconciled so «Мои гиги» references `/my-gigs` (correcting the current `/gigs` /
`/projects` disagreement).

#### Scenario: Nav navigates to /my-gigs
- GIVEN the sidebar nav for either role
- WHEN «Мои гиги» is activated
- THEN it MUST navigate to `/my-gigs`
- AND the nav fixtures MUST reference `/my-gigs` for «Мои гиги»

### Requirement: My-Gigs Reconciliation Keeps the Suite Green
The change MUST add E2E and VM tests for the new screen and keep the build, token-purity lint, composition lint, and
unit/E2E suites green.

#### Scenario: Tests green
- GIVEN `compose-my-gigs.spec.ts` and `my-gigs-vm.test.ts`
- WHEN they run
- THEN they MUST assert the header + the five tabs with counts + tab filtering + the empty state + role-aware content +
  card→`/gigs/[id]` navigation
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- `/my-gigs` exists (both roles), F5-pure: `SectionHeader` «Мои гиги» + `Tabs` (5 tabs, counts) + 2-col `GigCard` grid of own gigs; `/gigs` browse unchanged
- 5-tab set Все/Заявки/В работе/На проверке/Завершённые for both roles; «Заявки» role-aware (client OPEN+apps «На рассмотрении» / specialist PENDING); reuses `gigDisplayStatus`
- prototype empty state («Здесь пока пусто» + subtitle) + a 2-col skeleton `loading.tsx`
- `getMyGigs(viewer)` factors the dashboards' own-gig logic (reuses `toGigCardVM`); nav «Мои гиги» → `/my-gigs` (both roles); fixtures reconciled
- F2 + F5 lints green; `build` + `test:unit` + `compose-my-gigs` E2E green; F1 = structural vs the prototype `gigs` frame (≤1% deferred to Phase 4)
