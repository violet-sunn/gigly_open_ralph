# UI Specification Delta: compose-specialist-dashboard

This document contains specification changes for the `compose-specialist-dashboard` change — Phase-2 screen
composition #3. It composes the **SPECIALIST `/dashboard`** body from kit blocks (`BannerCard` + `Tabs` +
`GigCard·grid` + `SearchPanel` + `MessagesPanel`), inside the `AppShell` the shell-cutover put in the protected layout,
bound to real data (completion %, the specialist's applications + assigned gigs across the **exact 5 status tabs**,
messages). It ships **a new `SearchPanel` block + the `getSpecialistDashboard` mapper + the `SpecialistDashboard`
composition + the page wiring + tests only** — F5 composition-pure, F3 logical parity (the design's five tabs +
counts), with the **F1 ≤1% pixel-diff deferred** (substitute font + the unexported cosmic banner raster). It does
**not** touch the CLIENT dashboard, data models, server actions, the shell, or the block view-model contracts.

---

## ADDED Requirements

### Requirement: SPECIALIST Dashboard Composed from Blocks
The SPECIALIST `/dashboard` body MUST be composed from kit blocks as a composition-pure screen (F5), inside the
layout's `AppShell`.

#### Scenario: SpecialistDashboard is a composed screen
- GIVEN `app/(protected)/dashboard/SpecialistDashboard.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `BannerCard` + `Tabs` + `GigCard·grid` + `SearchPanel` +
  `MessagesPanel` via layout primitives (Section/Grid/Stack), import only kit/`lib`/`actions`/`react`/`next`, and
  contain **no** `className=` / `style=` / raw markup

#### Scenario: The page renders it for the SPECIALIST role
- GIVEN `app/(protected)/dashboard/page.tsx`
- WHEN a SPECIALIST loads `/dashboard`
- THEN the page MUST build the data server-side and render `<SpecialistDashboard>` (inside the shell), replacing the
  bespoke SPECIALIST markup + `SpecialistDashboardTabs`; the no-session redirect MUST be preserved and the CLIENT
  branch + the unknown-role fallback MUST be unchanged

**Acceptance Criteria:**
- `SpecialistDashboard` is an F5-pure `@composed-screen` composing the five blocks; the page renders it for SPECIALIST
- No-session redirect preserved; CLIENT branch + unknown-role fallback untouched; bespoke SPECIALIST markup/`SpecialistDashboardTabs`/overlay removed

### Requirement: Exact Status Tabs with Counts (F3 logical parity)
The dashboard `Tabs` MUST be exactly the design's five, in order, with live counts, mapped to the existing
application/gig states.

#### Scenario: The five tabs render with counts
- GIVEN the composed SPECIALIST dashboard
- WHEN the `Tabs` render
- THEN they MUST be exactly **Все · Заявки · В работе · На проверке · Завершённые** (in that order), each showing a
  live count

#### Scenario: Tabs map to the existing states
- GIVEN the specialist's applications and assigned gigs
- WHEN the tab counts/filters are computed
- THEN **Заявки** = the specialist's `PENDING` applications · **В работе** = assigned gigs with `IN_PROGRESS` ·
  **На проверке** = assigned gigs with `REVIEW` · **Завершённые** = assigned gigs with `COMPLETED`/`PAID` · **Все** =
  all cards; and selecting a tab MUST show only that tab's `GigCard`s (F3)

**Acceptance Criteria:**
- Tabs are exactly Все/Заявки/В работе/На проверке/Завершённые (RU, ordered) with live counts
- Counts + filtering map to PENDING applications, assigned IN_PROGRESS/REVIEW/COMPLETED·PAID, and all

### Requirement: Real Data Binding via a Contract-Typed Mapper
The dashboard MUST bind real data through a server-only, contract-typed mapper that reuses `toGigCardVM`.

#### Scenario: Applications and assigned gigs map to GigCardVMs
- GIVEN the specialist's PENDING applications (with full gig) and assigned gigs
- WHEN `getSpecialistDashboard(userId)` runs
- THEN each MUST map through the existing `toGigCardVM` to a `GigCardVM` (status → the design `Status`, `category` from
  `categorySlug`, `budget` a formatted `Money`, `deadlineDays`, `rating` from `getRatingForUser`), each tagged with a
  `tabKey` so the screen can filter — assignable to `GigCardVM`

#### Scenario: Dashboard data (completion %, cards, tabs, messages)
- GIVEN `getSpecialistDashboard(userId)`
- WHEN it runs
- THEN it MUST return the profile **completion %**, the specialist's applications + assigned gigs as **`GigCardVM`s**
  (each with a `tabKey`), the **five-tab counts**, and recent **messages** as a **`MessagesPanelVM`** (from
  `getRecentMessages`) — server-only, view-model types imported `import type`

**Acceptance Criteria:**
- `getSpecialistDashboard` (contract-typed) reusing `toGigCardVM`; completion %, cards (with `tabKey`), tab counts, and messages are real
- Application + assigned-gig statuses map to the design `Status`; budget is a formatted `Money`

### Requirement: SearchPanel Block (composition-gap fill)
The `SearchPanel` block MUST be implemented (it is required by this composition but absent from the kit).

#### Scenario: SearchPanel is a token-pure kit block over SearchInput
- GIVEN `app/components/blocks/SearchPanel.tsx`
- WHEN inspected
- THEN it MUST compose the `SearchInput` primitive + a primary "Найти проект" action, be token-pure (primitives +
  tokens only; no raw colour/spacing literals), expose an `onSubmit(query)` callback, have a fixture, and be exported
  from the blocks barrel

**Acceptance Criteria:**
- `SearchPanel` block (SearchInput + "Найти проект" action, `onSubmit(query)`); token-pure; fixture + barrel export

### Requirement: Gig Links and Find-Project Flow (F3 + functional)
The composed dashboard MUST be functional and match the design's logical parity.

#### Scenario: Gig links work
- GIVEN the composed SPECIALIST dashboard with cards
- WHEN a `GigCard` is opened
- THEN it MUST navigate to `/gigs/[id]`

#### Scenario: The find-project search routes to browse
- GIVEN the dashboard `SearchPanel`
- WHEN a query is submitted (or the "Найти проект" action is used)
- THEN it MUST navigate to `/gigs` (carrying the query, e.g. `/gigs?q=…`)

**Acceptance Criteria:**
- `GigCard` → `/gigs/[id]`; `SearchPanel` submit → `/gigs?q=…`; tabs filter the grid by `tabKey` (RU labels + counts, F3)

### Requirement: Reconciliation of Legacy Tabs (reconcile, don't copy)
The legacy English 3-tab structure MUST be reconciled to the design's five tabs, recording the resolution.

#### Scenario: Legacy Active/Pending/Archive reconciled to the five RU tabs
- GIVEN the legacy `SpecialistDashboardTabs` (Active Work / Pending Applications / Archive, English, no counts)
- WHEN it is replaced by the composed `Tabs`
- THEN the five design tabs (Все/Заявки/В работе/На проверке/Завершённые) are authoritative; **rejected/withdrawn**
  applications (the legacy "Archive") MUST still be reachable — surfaced under **Все** as `GigCard`s with `status:
  'rejected'` — so no data is lost while the primary tabs match the design exactly

**Acceptance Criteria:**
- Legacy 3-tab → design 5-tab reconciliation recorded; rejected/withdrawn applications surfaced under Все (no data lost)

### Requirement: Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the SPECIALIST dashboard E2E run
- THEN they MUST pass — the body is composition-pure, the tabs match the design exactly (F3), gig links + the
  find-project flow work, and the ~865 existing tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live SPECIALIST dashboard captured at 1440px and diffed vs `screens/specialist-dashboard.jpg`
  (`scripts/design-system/fidelity-diff.js`)
- WHEN the artifacts (diff / side-by-side / 50%-overlay) are reviewed
- THEN the composed layout MUST be visually faithful; the automated ≤1% threshold is NOT yet met — dominated by the
  **substitute font** (SF Compact unlicensed) and the **cosmic banner raster** (BannerCard `art`, unexported). The ≤1%
  gate is reached once the font is licensed and the raster exported — both outside this change

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + SPECIALIST dashboard E2E green
- F1 diff produced; composed layout visually faithful; ≤1% deferred to the font licence + banner raster export

---

## Test Plan

This change ships a block + a mapper + a composition + page wiring + tests. Validation is by deterministic commands.
Commands assume the repo root.

### Composition + block + mapper
```bash
grep -qE '@composed-screen' app/\(protected\)/dashboard/SpecialistDashboard.tsx && echo "SpecialistDashboard composed screen (F5 marker)"
test -f app/components/blocks/SearchPanel.tsx && grep -qE 'SearchPanel' app/components/blocks/index.ts && echo "SearchPanel block + export"
grep -qE 'getSpecialistDashboard' lib/view-models.ts && grep -qE 'toGigCardVM' lib/view-models.ts && grep -qE 'import type' lib/view-models.ts && echo "contract-typed mapper reusing toGigCardVM"
grep -qE 'SpecialistDashboard' app/\(protected\)/dashboard/page.tsx && echo "page renders SpecialistDashboard for SPECIALIST"
```

### F3 — the exact five tabs
```bash
# the five RU tab labels must be present in the mapper's tab list
for t in "Все" "Заявки" "В работе" "На проверке" "Завершённые"; do grep -q "$t" lib/view-models.ts && echo "tab: $t"; done
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite
```bash
npm run clean:test-db && npx vitest run __tests__/integration/specialist-dashboard-vm.test.ts 2>&1 | tail -10
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (~865)"
```

### SPECIALIST dashboard E2E (tabs + gig links + find-project)
```bash
npx playwright test __tests__/e2e/compose-specialist-dashboard.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 fidelity diff (artifacts; ≤1% deferred)
```bash
# capture the SPECIALIST /dashboard at 1440px, then:
node scripts/design-system/fidelity-diff.js <dashboard-actual.png> screens/specialist-dashboard.jpg <outDir>
# review diff / side-by-side / overlay-50; ≤1% deferred (substitute font + cosmic banner raster)
```

### Manual review
1. Confirm `SpecialistDashboard` is an F5-pure `@composed-screen` (the five blocks via layout primitives; no className/style) rendered for SPECIALIST.
2. Confirm the tabs are exactly Все/Заявки/В работе/На проверке/Завершённые with live counts (F3), mapped to PENDING applications + assigned IN_PROGRESS/REVIEW/COMPLETED·PAID.
3. Confirm real data binding (completion %, applications + assigned gigs as `GigCardVM`s with `tabKey`, messages as `MessagesPanelVM`) reusing `toGigCardVM`.
4. Confirm `SearchPanel` is implemented + exported; gig links → `/gigs/[id]`, search → `/gigs?q=…`, tabs filter.
5. Confirm the CLIENT branch + unknown-role fallback are untouched and the F1 diff is produced (≤1% deferred to font + banner raster).
