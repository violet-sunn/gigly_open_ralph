# UI Specification Delta: compose-gig-detail-apply

This document contains specification changes for the `compose-gig-detail-apply` change — Phase-2 screen composition #5,
the largest/most multi-role screen. It composes the **`/gigs/[id]`** body from kit blocks (`GigHeader` +
`RequirementCard·grid` + `CriteriaList` + `ClientCard` + `TermsTabs` + `ApplyPanel` + `ChatPanel`), inside the
`AppShell` the shell-cutover put in the protected layout, binding real gig data and **preserving every functional flow**
for all roles (apply/withdraw; owner applications + accept/reject; submit/approve/pay; messaging; admin moderation;
example/closed/not-found states) by wiring the **existing 8 server actions** unchanged. It ships **a new `GigHeader`
block (+ additive `GigHeaderVM`) + the `getGigDetail` mapper + the `GigDetail` composition + the page rewrite + tests
only** — F5 composition-pure, F3 logical parity, with the **F1 ≤1% pixel-diff deferred** (substitute font). It does
**not** change data models, the 8 server actions, lifecycle semantics, or the shell.

---

## ADDED Requirements

### Requirement: Gig Detail Composed from Blocks
The `/gigs/[id]` body MUST be composed from kit blocks as a composition-pure screen (F5), inside the layout's
`AppShell`.

#### Scenario: GigDetail is a composed screen
- GIVEN `app/(protected)/gigs/[id]/GigDetail.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `GigHeader` + `RequirementCard·grid` + `CriteriaList` +
  `ClientCard` + `TermsTabs` + `ApplyPanel` + `ChatPanel` via layout primitives (Section/Grid/Split/Stack/Panel),
  import only kit/`lib`/`actions`/`react`/`next` (the bespoke `[id]/*` form components are NOT imported), and contain
  **no** `className=` / `style=` / raw styled markup

#### Scenario: The page renders it for an existing gig
- GIVEN `app/(protected)/gigs/[id]/page.tsx`
- WHEN a user loads `/gigs/[id]`
- THEN the page MUST build the data server-side (`getGigDetail`) and render `<GigDetail>` (inside the shell) plus the
  `Breadcrumb`; the no-session redirect and the **not-found** branch MUST be preserved, and `markNotificationAsRead`
  MUST still run for authorized viewers

**Acceptance Criteria:**
- `GigDetail` is an F5-pure `@composed-screen` composing the seven blocks; the page renders it + breadcrumb
- No-session redirect + not-found branch + `markNotificationAsRead` preserved; bespoke body + `[id]/*` form components superseded

### Requirement: Real Data Binding via getGigDetail
The screen MUST bind real data through a server-only, contract-typed `getGigDetail` mapper.

#### Scenario: Header, requirements, criteria, client, terms, chat, apply
- GIVEN `getGigDetail(gigId, viewer)`
- WHEN it runs
- THEN it MUST return `header: GigHeaderVM` (title/status/budget/deadline/category/tags/date), `requirements:
  RequirementCardVM[]` (the filled goal/deliverables/constraints), `criteria: CriteriaListVM` (from
  `acceptanceCriteria`), `client: ClientCardVM` (the owner + `getRatingForUser(clientId)`), `terms: TermsTabsVM`
  (**proposed** = the viewer's application `proposedBudget`/`proposedDeadlineDays`, falling back to the gig's when null;
  **client** = `gig.budget`/`gig.deadlineDays`), `chat: ChatPanelVM` (messages → `MessageBubbleVM` thread, in/out per
  viewer), and `apply: ApplyPanelVM` (the structured fields) — assignable to the view-model contracts (`import type`)

#### Scenario: Role and lifecycle state
- GIVEN a viewer and a gig in some status
- WHEN `getGigDetail` runs
- THEN it MUST also return the role/state contract: `isOwner`, `isAssignedSpecialist`, `viewerApplication` (status),
  `applications` (owner only), the `lifecycle` state (status + which actions are available), `isExample`,
  `closedByAdmin`, and `moderations` (admin)

**Acceptance Criteria:**
- `getGigDetail` returns the seven block VMs + the role/lifecycle state; contract-typed; reuses `getRatingForUser`/`lib/categories`
- `TermsTabs` proposed falls back to the gig's budget/deadline when the application has no counter

### Requirement: GigHeader Block (composition-gap fill)
The `GigHeader` block MUST be implemented (it is required by this composition but absent from the kit).

#### Scenario: GigHeader is a token-pure kit block
- GIVEN `app/components/blocks/GigHeader.tsx`
- WHEN inspected
- THEN it MUST render the detail header (title + `StatusBadge` + budget (mono) + deadline + `CategoryTag` + tag `Tag`s +
  posted date) from a `GigHeaderVM`, be token-pure (primitives + layout + tokens), have a fixture, and be exported from
  the blocks barrel; `GigHeaderVM` is added additively to the block view-model contract

**Acceptance Criteria:**
- `GigHeader` token-pure block + `GigHeaderVM` (additive) + fixture + barrel export

### Requirement: Preserved Functional Flows Wired to the Existing Actions
The composition MUST preserve every flow for all roles, wiring the existing server actions directly (no semantics
change).

#### Scenario: Apply and withdraw (SPECIALIST)
- GIVEN a SPECIALIST viewing an OPEN, non-example gig they have not applied to
- WHEN they submit the composed `ApplyPanel`
- THEN it MUST call `applyToGig` (the structured fields via FormData); a PENDING application MUST then offer withdraw
  (`withdrawApplication`); applied/withdrawn/not-open/example states MUST render their composed notices

#### Scenario: Owner applications + accept/reject
- GIVEN the gig owner (CLIENT)
- WHEN they view the gig
- THEN they MUST see the applications list (specialist + structured fields + status) and, for PENDING applications on an
  OPEN gig, accept/reject controls wired to `acceptApplication`/`rejectApplication`

#### Scenario: Lifecycle + messaging + moderation
- GIVEN the gig in IN_PROGRESS / REVIEW / COMPLETED, and a viewer with the right role
- WHEN the relevant control is used
- THEN submit-work (`submitWork`, assigned specialist, IN_PROGRESS), approve-work (`approveWork`, owner, REVIEW), and
  mark-as-paid (`markAsPaid`, owner, COMPLETED) MUST work; gig-scoped messaging (`sendMessage`) MUST work for the owner/
  assigned specialist once a specialist is assigned (gated off when closed/paid); the admin moderation history and the
  closed-by-admin notice MUST render

**Acceptance Criteria:**
- All 8 actions (`applyToGig`/`withdrawApplication`/`acceptApplication`/`rejectApplication`/`submitWork`/`approveWork`/`markAsPaid`/`sendMessage`) wired + working; lifecycle semantics unchanged
- Owner applications list + accept/reject; messaging gating; admin moderation; example/closed/not-found states preserved (F3)

### Requirement: Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the gig-detail E2E run
- THEN they MUST pass — the body is composition-pure, every role's flows/states match (F3), the lifecycle walk
  (apply→accept→submit→approve→pay) + messaging + withdraw work, and the existing gig-lifecycle/application/messaging
  tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live SPECIALIST `/gigs/[id]` captured at 1440px and diffed vs `screens/specialist-gig.jpg`
- WHEN the artifacts (diff / side-by-side / 50%-overlay) are reviewed
- THEN the composed layout MUST be visually faithful; the automated ≤1% threshold is NOT yet met — dominated by the
  **substitute font** (SF Compact unlicensed), not a composition defect; ≤1% is reached once the font is licensed

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + gig-detail E2E green; existing lifecycle/application/messaging tests green
- F1 diff produced; composed layout visually faithful; ≤1% deferred to the font licence

---

## Test Plan

This change ships a block + a mapper + a composition + a page rewrite + tests. Validation is by deterministic commands.
Commands assume the repo root.

### Composition + block + mapper
```bash
grep -qE '@composed-screen' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "GigDetail composed screen (F5 marker)"
grep -qE 'className=|style=' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
test -f app/components/blocks/GigHeader.tsx && grep -qE 'GigHeader' app/components/blocks/index.ts && grep -qE 'GigHeaderVM' app/components/blocks/view-models.ts && echo "GigHeader block + VM + export"
grep -qE 'getGigDetail' lib/view-models.ts && echo "getGigDetail mapper"
grep -qE 'applyToGig|sendMessage|acceptApplication' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "actions wired directly"
grep -qE 'GigDetail' app/\(protected\)/gigs/\[id\]/page.tsx && echo "page renders GigDetail"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite (incl. preserved lifecycle/application/messaging)
```bash
npm run clean:test-db && npx vitest run __tests__/integration/gig-detail-vm.test.ts 2>&1 | tail -10
npm run clean:test-db && npx vitest run __tests__/integration/gig-lifecycle.test.ts __tests__/integration/application-management.test.ts 2>&1 | tail -8
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Gig-detail E2E (lifecycle walk + messaging + withdraw)
```bash
npx playwright test __tests__/e2e/compose-gig-detail-apply.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 fidelity diff (artifacts; ≤1% deferred)
```bash
# capture the SPECIALIST /gigs/[id] at 1440px, then:
node scripts/design-system/fidelity-diff.js <gig-detail-actual.png> screens/specialist-gig.jpg <outDir>
# review diff / side-by-side / overlay-50; ≤1% deferred (substitute font)
```

### Manual review
1. Confirm `GigDetail` is an F5-pure `@composed-screen` (the seven blocks via layout primitives; no className/style) rendered by the page + breadcrumb.
2. Confirm `getGigDetail` binds real data (header/requirements/criteria/client-rating/terms/chat/apply) + the role/lifecycle flags.
3. Confirm `GigHeader` is implemented + exported; the 8 actions are wired directly and every flow/state works (F3).
4. Confirm lifecycle semantics + server actions are unchanged, the bespoke `[id]/*` forms are superseded, and the F1 diff is produced (≤1% deferred to the font).
