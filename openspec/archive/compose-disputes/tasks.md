# Implementation Tasks: compose-disputes

> **Phase-2 screen composition.** Build the new `/disputes` screen (list + detail), composed from kit blocks (`AppShell +
> DisputeList + DisputeDetail`) inside the layout's `AppShell`, over the existing `disputes-flow` data layer
> (`lib/disputes.ts` + `app/actions/dispute.ts`) — with an **open-dispute entry from a gig**, an **admin resolve view**,
> and an **empty state**. Add the `DisputeList` + `DisputeDetail` block gap-fills (the `DisputeListVM` contract exists;
> materialize `DisputeDetailVM`); add thin `getDisputes`/`getDispute` aggregators; F5 composition-pure, F3 parity,
> authorization respected. **F1 flagged-missing** (no `Споры` reference frame — request a frame). Reuse both existing
> actions verbatim (no new action). Mirror the prior compose-* screens. Friction: medium.

---

## Task 1: [x] `DisputeList` block (composition-gap fill)

**Implementation Notes:**
- The `DisputeListVM` contract already exists in `app/components/blocks/view-models.ts`:
  ```ts
  export interface DisputeListVM {
    disputes: { id: string; gig: string; status: Status; opener: string }[];
  }
  ```
- Create `app/components/blocks/DisputeList.tsx` (a block — token classes / layout primitives OK; NOT a
  `@composed-screen`): a `Panel` with a header + one row per dispute (gig · opener · `StatusBadge`), each row a `Link`
  to `/disputes/{id}`; an **empty state** («Споров нет») when `disputes.length === 0`. Use `StatusBadge` (variant
  inline-dot) + `STATUS_LABEL` from `./util` for the status. Mirror `LedgerTable`. Token-pure. Sketch:
  ```tsx
  import Link from "next/link";
  import { StatusBadge } from "@/app/components/primitives";
  import { Panel } from "@/app/components/layout/Panel";
  import { Stack } from "@/app/components/layout/Stack";
  import { STATUS_LABEL } from "./util";
  import type { DisputeListVM } from "./view-models";

  export function DisputeList({ vm }: { vm: DisputeListVM }) {
    return (
      <Panel surface={1} radius="lg" padding={6}>
        {vm.disputes.length === 0 ? (
          <span className="text-body font-body text-muted">Споров нет</span>
        ) : (
          <Stack gap={2}>
            {vm.disputes.map((d) => (
              <Link key={d.id} href={`/disputes/${d.id}`}>
                <Stack axis="row" gap={4} align="center" justify="between">
                  <span className="text-body font-body text-strong">{d.gig}</span>
                  <span className="text-caption font-caption text-muted">{d.opener}</span>
                  <StatusBadge variant="inline-dot" status={d.status}>{STATUS_LABEL[d.status]}</StatusBadge>
                </Stack>
              </Link>
            ))}
          </Stack>
        )}
      </Panel>
    );
  }
  ```
- Add `disputeListFixture` (+ an empty variant) to `fixtures.ts`; export `DisputeList` from `app/components/blocks/index.ts`.

**Test Plan:**
```bash
test -f app/components/blocks/DisputeList.tsx && grep -qE 'DisputeList' app/components/blocks/index.ts && echo "block + export"
grep -qE 'disputeListFixture' app/components/blocks/fixtures.ts && echo "fixture"
npm run lint:tokens && echo "token-pure"
```
Expected: `DisputeList` token-pure block (rows + empty state, linking to detail) + fixture + barrel export.

---

## Task 2: [x] Materialize `DisputeDetailVM` + `DisputeDetail` block (composition-gap fill)

**Implementation Notes:**
- Add `DisputeDetailVM` to `app/components/blocks/view-models.ts` (next to `DisputeListVM`) — matching exactly what
  `lib/disputes.getDisputeDetail` already returns:
  ```ts
  export interface DisputeDetailVM {
    id: string;
    gig: string;
    opener: string;
    reason: string;
    status: Status;
    resolution: string;
    resolvedBy?: string | null;
  }
  ```
- Create `app/components/blocks/DisputeDetail.tsx` (a block; NOT a `@composed-screen`): a `Panel` rendering gig ·
  `StatusBadge` · opener · reason, and the `resolution` (+ `resolvedBy`) when present; pair the opener with the existing
  `ClientCard` block (per `lib/disputes.ts`). No actions — the admin resolve control is a separate island (Task 5).
  Token-pure. Mirror `GigHeader`/`LedgerTable`.
- Add `disputeDetailFixture` (open + resolved variants) to `fixtures.ts`; export `DisputeDetail` from
  `app/components/blocks/index.ts`.

**Test Plan:**
```bash
grep -qE 'DisputeDetailVM' app/components/blocks/view-models.ts && echo "VM materialized"
test -f app/components/blocks/DisputeDetail.tsx && grep -qE 'DisputeDetail' app/components/blocks/index.ts && echo "block + export"
grep -qE 'disputeDetailFixture' app/components/blocks/fixtures.ts && echo "fixture"
npm run lint:tokens && echo "token-pure"
```
Expected: `DisputeDetailVM` in the SSOT; `DisputeDetail` token-pure block (detail + ClientCard) + fixture + export.

---

## Task 3: [x] `getDisputes` + `getDispute` aggregator mappers (`lib/view-models.ts`)

**Implementation Notes:**
- Add both (server-only) — thin aggregators over `lib/disputes` (no re-derivation), scoping by role / enforcing
  authorization:
  ```ts
  import { getDisputeList, getDisputeDetail } from '@/lib/disputes'
  import type { DisputeListVM, DisputeDetailVM } from '@/app/components/blocks/view-models'

  export interface DisputesData { disputes: DisputeListVM; isAdmin: boolean }

  export async function getDisputes(viewer: { userId: string; role: string }): Promise<DisputesData> {
    const isAdmin = viewer.role === 'ADMIN'
    const disputes = await getDisputeList(isAdmin ? {} : { participantId: viewer.userId })
    return { disputes, isAdmin }
  }

  export async function getDispute(
    id: string,
    viewer: { userId: string; role: string }
  ): Promise<DisputeDetailVM | null> {
    const d = await getDisputeDetail(id)
    if (!d) return null
    if (viewer.role === 'ADMIN') return d
    // Participant check: the opener, or the gig's client / assigned specialist.
    const scoped = await getDisputeList({ participantId: viewer.userId })
    return scoped.disputes.some((x) => x.id === id) ? d : null
  }
  ```
  (`lib/disputes` already returns the `DisputeListVM` shape + the detail; this only scopes by role + enforces the
  detail authorization. `import type` the VMs. `getDisputeDetail`'s return shape matches `DisputeDetailVM`.)

**Test Plan:**
```bash
grep -qE 'getDisputes|getDispute' lib/view-models.ts && grep -qE 'getDisputeList|getDisputeDetail' lib/view-models.ts && echo "aggregators reuse lib/disputes"
```
Expected: `getDisputes(viewer)` → `{ disputes, isAdmin }`; `getDispute(id, viewer)` → `DisputeDetailVM | null` (null for non-participant); contract-typed.

---

## Task 4: [x] `Disputes` + `DisputeView` composed screens

**Implementation Notes:**
- Create `app/(protected)/disputes/Disputes.tsx` (`/* @composed-screen */`; **server component**). Props =
  `DisputesData`. Compose via layout primitives only:
  ```tsx
  /* @composed-screen */
  import { Section } from '@/app/components/layout/Section'
  import { DisputeList } from '@/app/components/blocks'
  import type { DisputesData } from '@/lib/view-models'

  export function Disputes({ disputes }: DisputesData) {
    return (
      <Section title="Споры" gap={6}>
        <DisputeList vm={disputes} />
      </Section>
    )
  }
  ```
  (The empty state lives in the `DisputeList` block, so no extra branch is needed here.)
- Create `app/(protected)/disputes/DisputeView.tsx` (`/* @composed-screen */`; **server component**). Props = `{
  dispute: DisputeDetailVM; isAdmin: boolean }`. Compose `DisputeDetail` + — only when `isAdmin` — the
  `ResolveDisputeForm` island (Task 5), via layout primitives. Participants see read-only status (the block) with no
  resolve control. No className/style → F5-clean.

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/disputes/Disputes.tsx && grep -qE '@composed-screen' app/\(protected\)/disputes/DisputeView.tsx && echo "composed screens"
grep -qE 'className=|style=' app/\(protected\)/disputes/Disputes.tsx app/\(protected\)/disputes/DisputeView.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure compositions (list; detail + admin-only resolve island).

---

## Task 5: [x] Action islands (admin resolve view + gig open-dispute entry) — INLINED per the GigDetail F5 pattern

**Implementation Notes:**
- **Reconciliation (F5):** standalone island files (`ResolveDisputeForm.tsx` / `OpenDisputeForm.tsx`) **cannot** be
  imported by a `@composed-screen` — the composition linter only allows a marked screen to import kit dirs
  (`templates/blocks/layout/primitives`) or `@/app/actions|data|hooks` + react/next; a relative import of a sibling
  island fails F5. So, exactly as `GigDetail` does for ALL its actions, the action wiring is **inlined into the
  composed client screens** (importing the actions from `@/app/actions/dispute`, an allowed prefix) and reuses
  `ApplyPanel` for the field markup (composed screens may not carry `className`/`style`, so raw `<textarea>` is not
  allowed — `ApplyPanel` supplies the token-styled field). No new action; no new block.
- **Admin resolve view** — inlined as `ResolveAction` inside `app/(protected)/disputes/DisputeView.tsx` (`'use client'`
  `@composed-screen`): a `<form action>` with a hidden `disputeId`, a hidden `status` carried by the `Select` primitive
  (controlled, default `RESOLVED` / `REJECTED`), the resolution note via a reused `ApplyPanel`, and the returned error
  via `Notice`; `useActionState` over the existing `resolveDispute`. Rendered only when `isAdmin && status === 'open'`.
- **Open-dispute entry from a gig** — inlined as `OpenDisputeAction` inside `app/(protected)/gigs/[id]/GigDetail.tsx`
  (already a `'use client'` `@composed-screen`): a `<form action>` with a hidden `gigId` + the reason via a reused
  `ApplyPanel`, `useActionState` over the existing `openDispute`. Surfaced for a participant
  (`data.isOwner || data.isAssignedSpecialist`) when a specialist is assigned (`data.messaging.assigned`) and the gig
  is not an example. The action redirects back to the gig on success (existing behaviour).

**Test Plan:**
```bash
grep -qE 'resolveDispute' app/\(protected\)/disputes/DisputeView.tsx && echo "resolve view reuses existing action"
grep -qE 'openDispute' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "gig open-dispute entry reuses existing action"
grep -qE 'OpenDisputeAction' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "gig entry wired"
npm run lint:composition && echo "F5 green (inlined wiring is composition-pure)"
```
Expected: the admin resolve view (inlined in `DisputeView`) over the existing `resolveDispute`; the open-dispute entry
(inlined in `GigDetail`) over the existing `openDispute`; both surfaced for the right viewer; F5 green.

---

## Task 6: [x] Thin server pages + mapper unit tests + disputes E2E + acceptance + missing-mock flag

**Implementation Notes:**
- Create `app/(protected)/disputes/page.tsx` (server): `getSession` + no-session redirect; `getDisputes({ userId,
  role })`; render `<Disputes {...data} />`. The sidebar «Споры» item becomes active via the existing `markActive`
  (prefix-matches `/disputes`) — no nav change.
- Create `app/(protected)/disputes/[id]/page.tsx` (server): `getSession` + redirect; `getDispute(id, viewer)`; render a
  `notFound()` (or a not-found panel) when `null`; otherwise `<DisputeView dispute={…} isAdmin={role === 'ADMIN'} />`.
- `__tests__/integration/disputes-vm.test.ts` (mock `@/lib/prisma`/`next/*`; create users/gig/dispute): an ADMIN →
  `getDisputes` returns all disputes; a participant → only their own; `getDispute(id, admin)` returns the detail;
  `getDispute(id, participant)` returns it; `getDispute(id, outsider)` returns `null`; status mapping
  (`OPEN→open`, `RESOLVED→completed`, `REJECTED→rejected`).
- `__tests__/e2e/compose-disputes.spec.ts` (setE2ESession + seed via prisma into `file:./test.db`): a participant opens
  a dispute from a gig (the entry → `openDispute`) and it appears in `/disputes`; an ADMIN resolves it via the resolve
  view (status updates to completed/rejected); a participant sees their dispute's status read-only (no resolve control);
  a non-participant navigating to `/disputes/{id}` gets not-found; a user with no disputes sees the empty state
  («Споров нет»); the sidebar «Споры» item is active on `/disputes`.
- **Keep** the `disputes-flow` integration tests and the admin moderation tests unchanged — they target `lib/disputes` /
  `app/actions/dispute` / moderation, preserved.
- Run F5 composition lint, token lint, build, full unit suite, and the E2E. Confirm scope: only `/disputes` (+ detail)
  added + the two blocks + the `getDisputes`/`getDispute` aggregators + the two islands + the gig entry; `lib/disputes`
  / `app/actions/dispute` semantics unchanged; no data-model change; no new action; no admin-moderation change; no shell
  change. Record the **missing-mock** flag: there is no `screens/Споры`/`disputes` frame → F1 ≤1% is not run; the screen
  is composed from the kit (F5 enforced); a frame is requested.

**Test Plan:**
```bash
grep -qE 'getDisputes|Disputes' app/\(protected\)/disputes/page.tsx && grep -qE 'getSession' app/\(protected\)/disputes/page.tsx && echo "list page composed"
grep -qE 'getDispute|notFound|DisputeView' app/\(protected\)/disputes/\[id\]/page.tsx && echo "detail page composed + 404"
npm run clean:test-db && npx vitest run __tests__/integration/disputes-vm.test.ts 2>&1 | tail -12
npm run clean:test-db && npx vitest run __tests__/integration/disputes-flow.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/compose-disputes.spec.ts --project=chromium 2>&1 | tail -12
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
ls screens/ | grep -iE 'dispute|спор' || echo "no Споры frame — F1 flagged-missing"
```
Expected: both pages render; mapper unit tests pass (incl. authorization); preserved `disputes-flow` + moderation tests stay green; E2E covers open/list/resolve + read-only status + non-participant 404 + empty state + nav active; F3 + F5 + build + suite green; F1 flagged-missing recorded.

---

## Summary

Total tasks: 6
Estimated effort: 10–14 hours (friction: medium — two new routes (list + detail) + two block gap-fills + one
materialized contract + thin aggregators + two thin action islands over existing actions + a gig entry point; no new
data model, no new action, `lib/disputes`/`app/actions/dispute` reused; no mock to diff)

**Deliverables:**
- `DisputeList` + `DisputeDetail` blocks (gap fills) + the materialized `DisputeDetailVM` + fixtures + exports.
- `lib/view-models.ts` — `getDisputes` (role-scoped list) + `getDispute` (authorized detail), reusing `lib/disputes`.
- `Disputes` + `DisputeView` F5-pure `@composed-screen`s; thin server pages (list + detail, with 404); «Споры» nav active.
- `ResolveDisputeForm` (admin resolve view) + `OpenDisputeForm` (gig open-dispute entry) islands over the existing actions.
- Mapper unit tests (incl. authorization) + disputes E2E (open/list/resolve + read-only + non-participant 404 + empty state + nav active); preserved `disputes-flow` + moderation tests; F1 flagged-missing (no `Споры` frame).

**Critical path:** DisputeList block (1) → DisputeDetail block + VM (2) → getDisputes/getDispute (3) → Disputes/DisputeView compositions (4) → action islands + gig entry (5) → pages + tests + acceptance + missing-mock flag (6).

**Dependencies:** compose-shell-cutover, domain-blocks, disputes-flow — all complete.

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–6):**
- **`DisputeList` block** (`app/components/blocks/DisputeList.tsx`) — a header + one row per dispute (gig · opener ·
  `StatusBadge`), each row a `Link` to `/disputes/{id}`, with an **empty state** («Споров нет») when empty. Token-pure,
  with `disputeListFixture` + `disputeListEmptyFixture` + barrel export (the `DisputeListVM` contract pre-existed).
- **`DisputeDetailVM` materialized** in `app/components/blocks/view-models.ts`; **`DisputeDetail` block**
  (`app/components/blocks/DisputeDetail.tsx`) — gig · `StatusBadge` · opener (paired with `ClientCard`) · reason ·
  resolution-when-resolved (+ resolver). Token-pure, with `disputeDetailFixture` + `disputeDetailResolvedFixture` +
  barrel export.
- **`getDisputes` + `getDispute` aggregators** (`lib/view-models.ts`) — `getDisputes(viewer)` → `{ disputes, isAdmin }`
  (ADMIN → all; participant → scoped via `participantId`); `getDispute(id, viewer)` → `DisputeDetailVM | null`
  (authorization: null for a non-admin non-participant). Reuse `getDisputeList`/`getDisputeDetail` from `lib/disputes`
  (no re-derivation); `import type` the VMs.
- **`Disputes` `@composed-screen`** (`app/(protected)/disputes/Disputes.tsx`) — a **server component**: Section «Споры» +
  `DisputeList`. F5-pure (no className/style).
- **`DisputeView` `@composed-screen`** (`app/(protected)/disputes/DisputeView.tsx`) — a `'use client'` component:
  `DisputeDetail` + (only for `isAdmin && status === 'open'`) the inlined `ResolveAction` (the admin resolve view, wired
  to the unchanged `resolveDispute`, reusing `Select` + `ApplyPanel`). Participants see read-only status. F5-pure.
- **Open-dispute entry from a gig** — inlined `OpenDisputeAction` in `app/(protected)/gigs/[id]/GigDetail.tsx`, wired to
  the unchanged `openDispute` (reusing `ApplyPanel`), surfaced for a participant when a specialist is assigned.
- **Thin server pages** — `app/(protected)/disputes/page.tsx` (`getSession` + redirect + `getDisputes` + `<Disputes>`)
  and `app/(protected)/disputes/[id]/page.tsx` (`getSession` + redirect + `getDispute` + `notFound()` when null +
  `<DisputeView>`). The sidebar «Споры» item becomes active via the existing `markActive` (no nav change).
- **Tests** — `__tests__/integration/disputes-vm.test.ts` **3/3** (ADMIN all / participant scoped; detail authorization
  admin/opener/gig-client → detail, outsider/missing → null; status mapping RESOLVED→completed, REJECTED→rejected).
  `__tests__/unit/components/domain-blocks.test.tsx` **+3** (DisputeList rows + empty state; DisputeDetail detail +
  resolution-only-when-resolved). `__tests__/e2e/compose-disputes.spec.ts` **6/6** in a real browser — open-from-gig →
  lists · admin resolve → «Завершён» + resolution · participant read-only (no resolve control) · non-participant →
  not-found · empty state · «Споры» nav active.
- **Gates** — `lint:composition` (F5, **12** composed screens; +2: Disputes + DisputeView) ✓ · `lint:tokens` (F2) ✓ ·
  `npm run build` ✓ (`/disputes` 191 B · `/disputes/[id]` 911 B) · preserved `disputes-flow` tests **green** ·
  `npm run test:unit` **893/894** (the single failure was an unrelated **timeout** in `gig-browse-access.test.ts` under
  whole-suite DB contention — confirmed **10/10 green in isolation**; the known test-db-pollution flakiness, not a
  disputes regression).

**Task 6 (F1): flagged-missing.** There is **no `Споры`/`Disputes` reference frame** in `/screens` (`ls screens/ |
grep -iE 'dispute|спор'` → none). F1 ≤1% is **not run**; the screen is composed from the kit with **F5 + F3 +
functional/authorization enforced**; a frame is **requested**. When a frame lands, F1 runs like the other screens.

**Reconciliation recorded (Task 5):** the planned standalone island files (`ResolveDisputeForm.tsx` /
`OpenDisputeForm.tsx`) were **not** kept — a `@composed-screen` cannot import a sibling non-kit file under the
composition linter. Instead, mirroring `GigDetail`, the action wiring is **inlined** into the composed client screens
(`DisputeView` for resolve; `GigDetail` for open), importing the existing actions from `@/app/actions/dispute` (an
allowed prefix) and reusing `ApplyPanel`/`Select`/`Notice` for the markup. No new action; no new block; F5 stays pure.

**Scope guards (non-goals held):** no data-model change (the `Dispute` model + `ModerationLog` link from
`disputes-flow` are reused verbatim); `lib/disputes` + `app/actions/dispute` semantics **unchanged** (the
`disputes-flow` tests stay green); no new server action (both `openDispute`/`resolveDispute` reused); the existing admin
moderation (suspend/close/logs) is untouched; no shell change.
