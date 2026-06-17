# UI Specification Delta: compose-client-dashboard

This document contains specification changes for the `compose-client-dashboard` change — Phase-2 screen composition #2.
It composes the **CLIENT `/dashboard`** body from kit blocks (`BannerCard` + `Tabs` + `GigCard·grid` + `CreateGigCTA` +
`MessagesPanel`), inside the `AppShell` the shell-cutover put in the protected layout, bound to real data (completion %,
gigs, messages). It ships **a new `CreateGigCTA` block + view-model mappers + the `ClientDashboard` composition + the
page wiring + tests only** — F5 composition-pure, F3 logical parity, with the **F1 ≤1% pixel-diff deferred** (substitute
font + the unexported cosmic banner raster). It does **not** touch the SPECIALIST dashboard, data models, server
actions, the shell, or the block view-model contracts.

---

## ADDED Requirements

### Requirement: CLIENT Dashboard Composed from Blocks
The CLIENT `/dashboard` body MUST be composed from kit blocks as a composition-pure screen (F5), inside the layout's
`AppShell`.

#### Scenario: ClientDashboard is a composed screen
- GIVEN `app/(protected)/dashboard/ClientDashboard.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `BannerCard` + `Tabs` + `GigCard·grid` + `CreateGigCTA` +
  `MessagesPanel` via layout primitives (Section/Grid/Stack), import only kit/`lib`/`actions`/`react`/`next`, and
  contain **no** `className=` / `style=` / raw markup

#### Scenario: The page renders it for the CLIENT role
- GIVEN `app/(protected)/dashboard/page.tsx`
- WHEN a CLIENT loads `/dashboard`
- THEN the page MUST build the data server-side and render `<ClientDashboard>` (inside the shell), replacing the
  bespoke CLIENT markup; the no-session redirect MUST be preserved and the SPECIALIST branch MUST be unchanged

**Acceptance Criteria:**
- `ClientDashboard` is an F5-pure `@composed-screen` composing the five blocks; the page renders it for CLIENT
- No-session redirect preserved; SPECIALIST branch untouched; bespoke CLIENT markup/overlay removed

### Requirement: Real Data Binding via Contract-Typed Mappers
The dashboard MUST bind real data through server-only, contract-typed view-model mappers.

#### Scenario: Gig → GigCardVM mapping
- GIVEN a client's gig
- WHEN `toGigCardVM(gig, …)` runs
- THEN it MUST produce a `GigCardVM` with `status` mapped to the design `Status` (`OPEN→open`, `IN_PROGRESS→in-progress`,
  `REVIEW→verification`, `COMPLETED→completed`, `PAID→completed`), `category` from `categorySlug`, `budget` a formatted
  `Money` string, `deadlineDays`, and `rating` from `getRatingForUser` — assignable to `GigCardVM`

#### Scenario: Dashboard data (completion %, gigs, messages)
- GIVEN `getClientDashboard(userId)`
- WHEN it runs
- THEN it MUST return the profile **completion %**, the client's gigs as **`GigCardVM`s** (+ status tab counts), and
  recent **messages** as a **`MessagesPanelVM`** (from `getRecentMessages`) — server-only, view-model types imported
  `import type`

**Acceptance Criteria:**
- `toGigCardVM` + `getClientDashboard` (contract-typed); completion %, gigs, and messages are real
- Gig status maps to the design `Status`; budget is a formatted `Money`

### Requirement: CreateGigCTA Block (composition-gap fill)
The `CreateGigCTA` block MUST be implemented (it is required by this composition but absent from the kit).

#### Scenario: CreateGigCTA is a token-pure kit block
- GIVEN `app/components/blocks/CreateGigCTA.tsx`
- WHEN inspected
- THEN it MUST render a primary-styled action (a `Button`-token-styled `Link`) + label → href, be token-pure, have a
  fixture, and be exported from the blocks barrel

**Acceptance Criteria:**
- `CreateGigCTA` block (primary action + label → href); token-pure; fixture + barrel export

### Requirement: Gig Links, Create Flow, and Status Tabs (F3 + functional)
The composed dashboard MUST be functional and match the design's logical parity.

#### Scenario: Gig links and the create flow work
- GIVEN the composed CLIENT dashboard with gigs
- WHEN a `GigCard` is opened
- THEN it MUST navigate to `/gigs/[id]`; and the `CreateGigCTA` (and banner CTA) MUST navigate to `/gigs/new`

#### Scenario: Status tabs filter the gig grid
- GIVEN the dashboard `Tabs` (Все / В работе / На проверке / Завершённые, with counts)
- WHEN a tab is selected
- THEN the `GigCard·grid` MUST show the gigs for that status (F3 — tabs/labels/counts match the design)

**Acceptance Criteria:**
- `GigCard` → `/gigs/[id]`; `CreateGigCTA`/banner → `/gigs/new`; tabs filter the grid (RU labels + counts, F3)

### Requirement: Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the CLIENT dashboard E2E run
- THEN they MUST pass — the body is composition-pure, the blocks/tabs match the design per role (F3), gig links + the
  create flow work, and the ~860 existing tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live CLIENT dashboard captured at 1440px and diffed vs `screens/customer-dashboard.jpg`
  (`scripts/design-system/fidelity-diff.js`)
- WHEN the artifacts (diff / side-by-side / 50%-overlay) are reviewed
- THEN the composed layout MUST be visually faithful; the automated ≤1% threshold is NOT yet met — dominated by the
  **substitute font** (SF Compact unlicensed) and the **cosmic banner raster** (BannerCard `art`, unexported). The ≤1%
  gate is reached once the font is licensed and the raster exported — both outside this change

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + CLIENT dashboard E2E green
- F1 diff produced; composed layout visually faithful; ≤1% deferred to the font licence + banner raster export

---

## Test Plan

This change ships a block + mappers + a composition + page wiring + tests. Validation is by deterministic commands.
Commands assume the repo root.

### Composition + block + mappers
```bash
grep -qE '@composed-screen' app/\(protected\)/dashboard/ClientDashboard.tsx && echo "ClientDashboard composed screen (F5 marker)"
test -f app/components/blocks/CreateGigCTA.tsx && grep -qE 'CreateGigCTA' app/components/blocks/index.ts && echo "CreateGigCTA block + export"
test -f lib/view-models.ts && grep -qE 'toGigCardVM' lib/view-models.ts && grep -qE 'getClientDashboard' lib/view-models.ts && grep -qE 'import type .*GigCardVM' lib/view-models.ts && echo "contract-typed mappers"
grep -qE 'ClientDashboard' app/\(protected\)/dashboard/page.tsx && echo "page renders ClientDashboard for CLIENT"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite
```bash
npm run clean:test-db && npx vitest run __tests__/integration/client-dashboard-vm.test.ts 2>&1 | tail -10
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (~860)"
```

### CLIENT dashboard E2E (gig links + create flow + tabs)
```bash
npx playwright test __tests__/e2e/compose-client-dashboard.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 fidelity diff (artifacts; ≤1% deferred)
```bash
# capture the CLIENT /dashboard at 1440px, then:
node scripts/design-system/fidelity-diff.js <dashboard-actual.png> screens/customer-dashboard.jpg <outDir>
# review diff / side-by-side / overlay-50; ≤1% deferred (substitute font + cosmic banner raster)
```

### Manual review
1. Confirm `ClientDashboard` is an F5-pure `@composed-screen` (the five blocks via layout primitives; no className/style) rendered for CLIENT.
2. Confirm real data binding (completion %, gigs as `GigCardVM`s, messages as `MessagesPanelVM`) and the `Gig → GigCardVM` status mapping.
3. Confirm `CreateGigCTA` is implemented + exported; gig links → `/gigs/[id]`, create → `/gigs/new`, tabs filter (F3).
4. Confirm the SPECIALIST branch is untouched and the F1 diff is produced (≤1% deferred to font + banner raster).
