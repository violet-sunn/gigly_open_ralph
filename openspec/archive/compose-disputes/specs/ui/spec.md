# UI Specification Delta: compose-disputes

This document contains specification changes for the `compose-disputes` change — Phase-2 screen composition #9. It builds
the new **`/disputes`** screen (list + detail), composed from kit blocks (`AppShell + DisputeList + DisputeDetail`),
inside the `AppShell` the shell-cutover put in the protected layout, over the **`disputes-flow`** data layer
(`lib/disputes.ts` + `app/actions/dispute.ts`) — with an **open-dispute entry from a gig**, an **admin resolve view**,
and an **empty state**. It ships **two new blocks (`DisputeList` + `DisputeDetail`, the latter with a materialized
`DisputeDetailVM`) + the `getDisputes`/`getDispute` aggregator mappers + the `Disputes`/`DisputeView` compositions + the
admin resolve view and gig open-dispute entry (inlined client wiring over the existing actions) + the `/disputes` pages +
tests only** — F5 composition-pure, F3 logical parity, authorization respected. (The resolve/open action wiring is
**inlined into the composed client screens** — `DisputeView` for resolve, `GigDetail` for open — mirroring the existing
`GigDetail` pattern, because the composition linter forbids a `@composed-screen` from importing a sibling non-kit island
file; both reuse the existing `resolveDispute`/`openDispute` actions, no new action.) **F1 is flagged-missing** (no `Споры` reference frame — a frame is requested), not run.
It does **not** add or change a data model, change `lib/disputes` / `app/actions/dispute` semantics, add a new server
action, touch the existing admin moderation, or touch the shell.

---

## ADDED Requirements

### Requirement: Disputes Composed from Blocks
The `/disputes` (list) and `/disputes/[id]` (detail) bodies MUST be composed from kit blocks as composition-pure screens
(F5), inside the layout's `AppShell`.

#### Scenario: Disputes screens are composed screens
- GIVEN `app/(protected)/disputes/Disputes.tsx` and `app/(protected)/disputes/DisputeView.tsx`
- WHEN they are inspected
- THEN each MUST carry the `@composed-screen` marker — `Disputes` composing `DisputeList`, `DisputeView` composing
  `DisputeDetail` (plus, for an ADMIN viewer, the resolve island) — via layout primitives (Section/Stack), import only
  kit/`lib`/`react`/`next`, and contain **no** `className=` / `style=` / raw styled markup

#### Scenario: The pages render them
- GIVEN `app/(protected)/disputes/page.tsx` and `app/(protected)/disputes/[id]/page.tsx`
- WHEN an authenticated user loads `/disputes` or `/disputes/{id}`
- THEN the pages MUST build the data server-side (`getDisputes` / `getDispute`) and render `<Disputes>` / `<DisputeView>`
  (inside the shell); the no-session redirect MUST be preserved; the detail page MUST render not-found when
  `getDispute` returns `null`; and the sidebar «Споры» nav item MUST be active on `/disputes`

**Acceptance Criteria:**
- `Disputes` / `DisputeView` are F5-pure `@composed-screen`s composing `DisputeList` / `DisputeDetail`; the pages render them
- No-session redirect preserved; non-existent/unauthorized detail → not-found; the «Споры» nav item is active on `/disputes`

### Requirement: Disputes Real Data Binding via getDisputes / getDispute
The screens MUST bind real data through server-only, contract-typed `getDisputes` / `getDispute` aggregators over the
`disputes-flow` data layer (`lib/disputes`), with no re-derivation, scoped by role and enforcing detail authorization.

#### Scenario: The list is scoped by role
- GIVEN `getDisputes(viewer)`
- WHEN it runs
- THEN it MUST return `{ disputes: DisputeListVM, isAdmin: boolean }` by reusing `getDisputeList` from `lib/disputes` —
  an ADMIN viewer sees **all** disputes; a non-admin sees only disputes where they are a participant (opener, or the
  gig's client / assigned specialist), newest first, with the dispute status mapped to the design `Status`

#### Scenario: The detail enforces authorization
- GIVEN `getDispute(id, viewer)`
- WHEN it runs
- THEN it MUST return a `DisputeDetailVM` (gig, opener, reason, status, resolution, resolvedBy) by reusing
  `getDisputeDetail` from `lib/disputes` for an ADMIN or a participant, and MUST return `null` when the dispute does not
  exist OR the viewer is neither an ADMIN nor a participant

**Acceptance Criteria:**
- `getDisputes` → `{ disputes, isAdmin }` (ADMIN all / participant scoped); `getDispute` → `DisputeDetailVM | null` (null for non-participant)
- Both reuse `lib/disputes` (no re-derivation); contract-typed (`import type`)

### Requirement: DisputeList + DisputeDetail Blocks (composition-gap fill)
The `DisputeList` and `DisputeDetail` blocks MUST be implemented (both are named by this composition; `DisputeListVM`
exists but no block implements it, and `DisputeDetailVM` is not yet materialized).

#### Scenario: DisputeList is a token-pure kit block with an empty state
- GIVEN `app/components/blocks/DisputeList.tsx`
- WHEN inspected
- THEN it MUST render the list from a `DisputeListVM` — a header + one row per dispute (gig · opener · `StatusBadge`),
  each linking to the dispute detail — and an **empty state** when `disputes` is empty — be token-pure (primitives +
  layout + tokens), have a fixture, and be exported from the blocks barrel

#### Scenario: DisputeDetail is a token-pure kit block, and DisputeDetailVM is materialized
- GIVEN `app/components/blocks/DisputeDetail.tsx` and `app/components/blocks/view-models.ts`
- WHEN inspected
- THEN `view-models.ts` MUST export `DisputeDetailVM { id; gig; opener; reason; status: Status; resolution; resolvedBy?:
  string | null }` (type-only), and `DisputeDetail` MUST render that detail (gig · opener · `StatusBadge` · reason ·
  resolution-when-resolved), paired with the existing `ClientCard` for the opener — be token-pure, have a fixture, and
  be exported from the blocks barrel

**Acceptance Criteria:**
- `DisputeList` token-pure block (rows + empty state, linking to detail) + fixture + export
- `DisputeDetailVM` materialized; `DisputeDetail` token-pure block (detail + `ClientCard`) + fixture + export; `lint:tokens` passes

### Requirement: Open-Dispute Entry, Admin Resolve View, and Authorization
The screen MUST provide the open-dispute entry from a gig and the admin resolve view, reusing the existing actions, with
authorization respected.

#### Scenario: Open-dispute entry from a gig
- GIVEN the gig detail screen and a participant (the gig's client or assigned specialist) on a gig with an assigned
  specialist
- WHEN the screen renders
- THEN it MUST surface an open-dispute entry (a reason + submit) wired to the existing `openDispute` action (no new
  action); a non-participant MUST NOT see it

#### Scenario: Admin resolve view
- GIVEN the dispute detail screen
- WHEN an ADMIN viewer loads an OPEN dispute
- THEN it MUST present the admin resolve view (a status `RESOLVED`/`REJECTED` choice + a required resolution note) wired
  to the existing `resolveDispute` action (no new action); a non-admin participant MUST see the dispute's status
  **read-only**, with no resolve control

**Acceptance Criteria:**
- Open-dispute entry on the gig detail for participants (specialist assigned) over the existing `openDispute`; hidden from non-participants
- Admin resolve view over the existing `resolveDispute` for ADMIN; read-only status for participants; no new server action

### Requirement: Disputes Verification and Flagged-Missing F1
The change MUST pass F3 + F5 + the functional/E2E/authorization suite; F1 is flagged-missing (no `Споры` reference
frame).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit tests, and the
  disputes E2E run
- THEN they MUST pass — the bodies are composition-pure, the IA matches the intended composition (list + detail + admin
  resolve + empty state) (F3), open/list/resolve render, authorization is respected (non-participant → not-found;
  resolve is admin-only), and the existing `disputes-flow` + admin moderation tests stay green

#### Scenario: F1 flagged-missing
- GIVEN there is no `Споры`/`Disputes` full-screen reference frame in `/screens`
- WHEN fidelity is considered
- THEN F1 ≤1% MUST NOT be run (no reference); the screen is composed from the kit with F5 enforced; the missing-mock
  fact MUST be recorded (a frame is requested) and F1 deferred until a frame lands

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit tests + disputes E2E green; existing `disputes-flow` + moderation tests green; authorization respected
- F1 flagged-missing (no `Споры` frame); composed from blocks; F5 still enforced

---

## Test Plan

This change ships two blocks (+ a materialized VM) + two aggregator mappers + two compositions + two action islands +
two new pages + a gig entry + tests. Validation is by deterministic commands. Commands assume the repo root.

### Composition + blocks + mappers
```bash
grep -qE '@composed-screen' app/\(protected\)/disputes/Disputes.tsx && grep -qE '@composed-screen' app/\(protected\)/disputes/DisputeView.tsx && echo "Disputes + DisputeView composed screens (F5 marker)"
grep -qE 'className=|style=' app/\(protected\)/disputes/Disputes.tsx app/\(protected\)/disputes/DisputeView.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
test -f app/components/blocks/DisputeList.tsx && test -f app/components/blocks/DisputeDetail.tsx && grep -qE 'DisputeList|DisputeDetail' app/components/blocks/index.ts && echo "blocks + exports"
grep -qE 'DisputeDetailVM' app/components/blocks/view-models.ts && echo "DisputeDetailVM materialized"
grep -qE 'getDisputes|getDispute' lib/view-models.ts && grep -qE 'getDisputeList|getDisputeDetail' lib/view-models.ts && echo "mappers reuse lib/disputes"
grep -qE 'DisputeList' app/\(protected\)/disputes/Disputes.tsx && grep -qE 'DisputeDetail' app/\(protected\)/disputes/DisputeView.tsx && echo "composes the blocks"
```

### Action islands + gig entry (reuse existing actions; no new action)
```bash
grep -qE 'resolveDispute' app/\(protected\)/disputes/ResolveDisputeForm.tsx && grep -qE 'openDispute' app/\(protected\)/disputes/OpenDisputeForm.tsx && echo "islands reuse existing actions"
grep -qE 'OpenDisputeForm' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "gig open-dispute entry wired"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite (incl. preserved disputes-flow + moderation)
```bash
npm run clean:test-db && npx vitest run __tests__/integration/disputes-vm.test.ts 2>&1 | tail -12
npm run clean:test-db && npx vitest run __tests__/integration/disputes-flow.test.ts 2>&1 | tail -8
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Disputes E2E (open/list/resolve + read-only + non-participant 404 + empty state + nav active)
```bash
npx playwright test __tests__/e2e/compose-disputes.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 (flagged-missing)
```bash
# No screens/disputes*.jpg (Споры) reference frame exists → F1 ≤1% is NOT run.
ls screens/ | grep -iE 'dispute|спор' || echo "no Споры reference frame — F1 flagged-missing (a frame is requested)"
```

### Manual review
1. Confirm `Disputes` / `DisputeView` are F5-pure `@composed-screen`s (DisputeList / DisputeDetail via layout primitives; no className/style) rendered by the pages.
2. Confirm `getDisputes` scopes the list by role and `getDispute` enforces authorization (non-participant → null → page not-found) by reusing `lib/disputes`.
3. Confirm `DisputeList` + `DisputeDetail` are implemented + exported (with the empty state + the materialized `DisputeDetailVM`); the open-dispute entry is on the gig detail for participants; the admin resolve view is admin-only; the «Споры» nav item is active.
4. Confirm no data-model / `lib/disputes` / `app/actions/dispute` / admin-moderation / shell change, no new server action, and that F1 is flagged-missing (no `Споры` frame).
