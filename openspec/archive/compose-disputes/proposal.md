# Change Proposal: compose-disputes

> Phase 2, change 26 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It builds
> the **new `/disputes`** screen, composed from kit blocks — within the `AppShell` the shell-cutover put in the
> protected layout — over the **`disputes-flow`** data layer (`lib/disputes.ts` + `app/actions/dispute.ts`): `AppShell +
> DisputeList + DisputeDetail`, with an **open-dispute entry from a gig**, an **admin resolve view**, and an **empty
> state**. Depends on: compose-shell-cutover, domain-blocks, disputes-flow (all complete). Friction: **medium**.
>
> **Fidelity gate — no full-screen mock.** There is **no `Споры`/`Disputes` reference frame** in `/screens` (the
> planning doc flags this — "request a frame"). So **F1 is flagged-missing**, not run: the screen is composed **from the
> kit** and **F5 (composition purity) + F3 (logical parity) + the functional/authorization checks are enforced**. The
> missing-mock fact is recorded (a frame is requested); F1 is reached once the frame lands.

## Problem Statement

The `disputes-flow` Phase-1 change already built the **dispute data layer + actions** over the existing `ModerationLog`:
`getDisputeList(opts?)` → `DisputeListVM` (admin → all disputes; scoped → the user's disputes as opener/participant,
status-mapped, newest first) and `getDisputeDetail(id)` (a lib-local detail shape — gig, opener, reason, status,
resolution, resolvedBy); `openDispute` (participant-only, one per `[gigId, openerId]`, requires an assigned specialist)
and `resolveDispute` (admin-only, writes a linked `ModerationLog` audit in a transaction). **No screen consumes any of
it** — the data layer and both actions have no UI.

- **No `/disputes` route exists** (`app/(protected)/disputes/` is absent). The sidebar already lists «Споры» →
  `/disputes` (per F3, from compose-shell-cutover; `lib/nav.ts`) but the target 404s — this change delivers it, so the
  nav item becomes active.
- **`DisputeList` and `DisputeDetail` are composition gaps.** The redesign composition names `AppShell + DisputeList +
  DisputeDetail`; the `DisputeListVM` contract exists in the block view-model SSOT (`app/components/blocks/
  view-models.ts`) and `lib/disputes.getDisputeList` already returns exactly that shape — but **no block implements
  either** (absent from `app/components/blocks/index.ts`). `DisputeDetail` pairs the detail with the existing
  `ClientCard` block (per `lib/disputes.ts`), and **§5 has no `DisputeDetailVM`** — it must be materialized in the SSOT.
  So this change is two block gap-fills (+ one materialized contract) + the screen, exactly as `LedgerTable` was for
  finances.
- **`openDispute` has no entry point.** The action exists but nothing triggers it: a participant (the gig's client or
  assigned specialist) has no way to open a dispute. This change adds a thin **open-dispute entry from the gig detail**
  screen for participants (when a specialist is assigned), wiring the existing action.
- **The admin resolve view has no surface.** `resolveDispute` (admin-only) exists but no UI invokes it. The dispute
  detail screen MUST present the **admin resolve view** (status + a required resolution note) for an ADMIN viewer, and
  show read-only status to participants.

The planning doc maps this exactly: compose `/disputes` from `DisputeList + DisputeDetail` over `disputes-flow`, with an
open-dispute entry from a gig, an admin resolve view, and an empty state; verify open/list/resolve render and
authorization is respected; F1 only where a reference exists (else compose from blocks + flag the missing mock, F5 still
enforced). This change adds the screen + the two blocks + the wired action islands over the existing data layer.

## Proposed Solution

Add the `/disputes` route (list + detail) as composition-pure screens, two block gap-fills (+ the materialized
`DisputeDetailVM`), thin aggregator mappers, two thin action islands (open + resolve), and verification. Six deliverable
groups:

1. **`DisputeList` block (gap fill)** — `app/components/blocks/DisputeList.tsx` (+ fixture + barrel export; the
   `DisputeListVM` contract already exists): a token-pure list — a header + one row per dispute (gig · opener ·
   `StatusBadge`), each a link to `/disputes/{id}` — with an **empty state** («Споров нет») when `disputes` is empty.
   Composed from primitives (`StatusBadge`) + layout (Panel/Stack) + tokens. Token-pure.

2. **`DisputeDetail` block (gap fill) + materialized `DisputeDetailVM`** — add `DisputeDetailVM` to the SSOT
   (`view-models.ts`): `{ id; gig; opener; reason; status: Status; resolution; resolvedBy?: string | null }`; create
   `app/components/blocks/DisputeDetail.tsx` (+ fixture + export): a token-pure panel rendering gig · opener ·
   `StatusBadge` · reason · resolution (when resolved), paired with the existing `ClientCard` for the opener. Token-pure
   (no actions — the admin resolve control is a separate island).

3. **`getDisputes` + `getDispute` mappers (`lib/view-models.ts`, server-only, contract-typed)** — `getDisputes(viewer)`
   → `{ disputes: DisputeListVM; isAdmin: boolean }`: a thin aggregator over `lib/disputes.getDisputeList`, scoping by
   role (ADMIN → all; otherwise `participantId = viewer.userId`). `getDispute(id, viewer)` → `DisputeDetailVM | null`
   over `lib/disputes.getDisputeDetail`, returning `null` for a non-existent dispute **or** a viewer who is neither an
   ADMIN nor a participant (authorization). `import type` the VMs.

4. **`Disputes` + `DisputeView` composed screens (`@composed-screen`)** — `app/(protected)/disputes/Disputes.tsx` (the
   list: `DisputeList`, or its empty state, via layout primitives only) and `app/(protected)/disputes/DisputeView.tsx`
   (the detail: `DisputeDetail` + — for an ADMIN viewer — the `ResolveDisputeForm` island; read-only status for
   participants). Both composition-pure (no `className`/`style`).

5. **Two thin action islands + the gig entry** — `ResolveDisputeForm` (`'use client'`, admin resolve view: status
   select + required resolution note, `useActionState` over the existing `resolveDispute`) and `OpenDisputeForm`
   (`'use client'`, the open-dispute entry: a reason field + submit, `useActionState` over the existing `openDispute`),
   the latter surfaced on the **gig detail** screen for a participant when a specialist is assigned. Islands only — no
   new server action, both actions reused verbatim.

6. **Thin server pages + tests + missing-mock flag** — `app/(protected)/disputes/page.tsx` (`getSession` + redirect;
   `getDisputes(viewer)`; `<Disputes>`) and `app/(protected)/disputes/[id]/page.tsx` (`getSession` + redirect;
   `getDispute(id, viewer)`; 404 when `null`; `<DisputeView>`). Unit tests for `getDisputes`/`getDispute` (admin sees
   all; participant sees only theirs; non-participant → `null`; status mapping). E2E (`compose-disputes.spec.ts`):
   open-dispute entry from a gig creates a dispute and it lists; an admin resolves it (status updates); a participant
   sees their dispute's status read-only; a non-participant cannot reach the detail; the empty state renders; the
   sidebar «Споры» item is active on `/disputes`. `lint:composition` (F5) on both screens; F3 parity. **F1 is
   flagged-missing** (no `Споры` frame) — recorded; no diff is run.

This change emits **the `DisputeList` + `DisputeDetail` blocks (+ the materialized `DisputeDetailVM`) + the `getDisputes`/
`getDispute` mappers + the `Disputes`/`DisputeView` compositions + the two action islands + the `/disputes` pages + the
gig open-dispute entry + tests only**. It does **not** add or change a data model, change `lib/disputes` or
`app/actions/dispute` semantics, add any new server action, touch the existing admin moderation (suspend/close/logs), or
touch the shell.

## Constraints

### MUST Requirements
- The `/disputes` (list) and `/disputes/[id]` (detail) bodies MUST be composed from blocks (`DisputeList` /
  `DisputeDetail`) inside the layout's `AppShell`, as composition-pure screens (F5): `Disputes`/`DisputeView` MUST carry
  `@composed-screen`, import only kit/`lib`/`react`/`next`, and contain **no** `className`/`style`/raw styled markup.
- The screens MUST bind **real** data via `getDisputes`/`getDispute` over `lib/disputes` — the list reflects the
  scoped disputes (ADMIN → all; participant → their own), the detail reflects the dispute (gig, opener, reason, status,
  resolution).
- The `DisputeList` block MUST be implemented token-pure (header + dispute rows with `StatusBadge`, linking to the
  detail) with an **empty state**, a fixture, and a barrel export; the `DisputeDetail` block MUST be implemented
  token-pure (gig · opener · status · reason · resolution, paired with `ClientCard`), with a fixture and a barrel
  export; the `DisputeDetailVM` contract MUST be materialized in the SSOT.
- The **open-dispute entry** MUST appear on the gig detail screen for a participant (the gig's client or assigned
  specialist) when a specialist is assigned, wiring the existing `openDispute` action (no new action).
- The detail screen MUST present the **admin resolve view** (status + required resolution note → `resolveDispute`) for
  an ADMIN viewer, and show **read-only** status to participants. **Authorization MUST be respected**: a viewer who is
  neither ADMIN nor a participant MUST NOT see a dispute's detail (page 404s).
- The list MUST render an **empty state** when there are no disputes in scope.
- The page MUST render the screens for an authenticated user, preserve the no-session redirect, and the sidebar «Споры»
  nav item MUST be **active** on `/disputes`.
- `npm run build`, `npm run test:unit`, the disputes E2E, `npm run lint:composition`, and `npm run lint:tokens` MUST be
  green; the existing `disputes-flow` tests and the admin moderation tests MUST stay green.

### SHOULD Requirements
- `getDisputes`/`getDispute` SHOULD live in `lib/view-models.ts` (server-only, `import type` the VMs) and reuse the
  existing `getDisputeList` + `getDisputeDetail` from `lib/disputes` (no re-derivation).
- `Disputes`/`DisputeView` SHOULD be server components (no `'use client'`); only the `ResolveDisputeForm` and
  `OpenDisputeForm` action islands are client components.
- The `DisputeDetail` block SHOULD pair the detail with the existing `ClientCard` (per `lib/disputes.ts`) rather than a
  bespoke card.

### Non-Goals
- **No data-model change** (the `Dispute` model + `ModerationLog` link from `disputes-flow` are reused verbatim); **no
  `lib/disputes` or `app/actions/dispute` semantics change**; **no new server action** (both `openDispute` /
  `resolveDispute` reused); **no change to existing admin moderation** (suspend/close/logs); **no shell change**.
- **F1 ≤1% is not run** — there is **no `Споры` reference frame**; the screen is composed from the kit with F5/F3/
  functional/authorization enforced, and the missing-mock is flagged (a frame is requested). When a frame lands, F1 runs
  like the other screens (still gated on the font licence).

## Success Criteria

1. `/disputes` (list) and `/disputes/[id]` (detail) bodies compose `DisputeList` / `DisputeDetail` as F5-pure `@composed-screen`s, rendered by thin server pages.
2. Real data bound via `getDisputes`/`getDispute` over `lib/disputes` — scoped list + detail; authorization enforced (non-participant → 404).
3. `DisputeList` + `DisputeDetail` blocks implemented token-pure (with empty state + fixtures + exports); `DisputeDetailVM` materialized.
4. Open-dispute entry from a gig (participant, specialist assigned) creates a dispute; the admin resolve view resolves it; participants see read-only status; the empty state renders; the «Споры» nav item active on `/disputes`.
5. `build`, `test:unit` (existing `disputes-flow` + admin moderation tests green), disputes E2E, `lint:composition`, `lint:tokens` all green; F1 flagged-missing (no `Споры` frame — recorded, not run).

## Affected Areas

- `app/(protected)/disputes/page.tsx` (new — thin server page: `getDisputes` + `<Disputes>`)
- `app/(protected)/disputes/Disputes.tsx` (new — `@composed-screen`, the list + empty state)
- `app/(protected)/disputes/[id]/page.tsx` (new — thin server page: `getDispute` + 404 + `<DisputeView>`)
- `app/(protected)/disputes/DisputeView.tsx` (new — `'use client'` `@composed-screen`, the detail + the inlined admin resolve view over the existing `resolveDispute`)
- (the admin resolve view + the gig open-dispute entry are **inlined client wiring** over the existing actions — mirroring `GigDetail` — not standalone island files, so a `@composed-screen` stays F5-pure)
- `app/components/blocks/DisputeList.tsx` + `DisputeDetail.tsx` (new blocks) + `index.ts` (exports) + `fixtures.ts` (fixtures)
- `app/components/blocks/view-models.ts` (materialize `DisputeDetailVM`)
- `lib/view-models.ts` (new — `getDisputes` / `getDispute` aggregators, contract-typed)
- the gig detail composition (`app/(protected)/gigs/[id]/GigDetail.tsx`) — surface the open-dispute entry for participants
- `__tests__/e2e/compose-disputes.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests)
- read-only inputs: `lib/disputes` (`getDisputeList`/`getDisputeDetail`), `app/actions/dispute` (`openDispute`/`resolveDispute`), the blocks (`ClientCard`/`Notice`), the primitives (`StatusBadge`), the layout primitives
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements, folded on archive)
- (NOT modified: data models; `lib/disputes` / `app/actions/dispute` semantics; admin moderation; the shell; no new action)

## Risks & Mitigations

**Risk**: No `Споры` mock — composing "by eye" would reintroduce the parody the mechanism exists to prevent.
**Mitigation**: Compose strictly from existing system entities (`DisputeList` + the new token-pure `DisputeDetail` + `ClientCard` + `Notice` + layout primitives) — `lint:composition` (F5) + `lint:tokens` (F2) make off-system styling impossible. F1 is explicitly **flagged-missing** (a frame is requested), not faked; F3 logical parity (list + detail + resolve + empty state) + the authorization checks are the enforced bar until the frame lands.

**Risk**: The two blocks are new and `DisputeDetailVM` does not exist — getting either shape wrong would diverge from the data layer.
**Mitigation**: `DisputeList` is typed by the **existing** `DisputeListVM` that `getDisputeList` already returns (rendered verbatim). `DisputeDetailVM` is materialized to match exactly what `getDisputeDetail` already returns (gig, opener, reason, status, resolution, resolvedBy); fixtures + render assertions confirm both.

**Risk**: Authorization could leak — a non-participant seeing a dispute, or a non-admin reaching the resolve control.
**Mitigation**: `getDispute(id, viewer)` returns `null` for a non-admin non-participant (the page 404s); `getDisputes` scopes the list by role; the `ResolveDisputeForm` is rendered only for an ADMIN viewer, and `resolveDispute` itself re-checks `role === 'ADMIN'` (defence in depth). E2E asserts a non-participant cannot reach the detail and that resolve is admin-only.

**Risk**: Reusing the existing actions (which `redirect` to `/gigs/{id}`) inside new screens could surprise.
**Mitigation**: Both actions are reused **verbatim** (no semantics change); the islands wire them as-is (`openDispute` redirects to the gig; `resolveDispute` revalidates `/disputes` + `/admin` and redirects to the gig). The screens render the current data on each load — no action behaviour is altered.
