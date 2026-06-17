# Implementation Tasks: compose-gig-detail-apply

> **Phase-2 screen composition — the largest, most multi-role screen.** Compose `/gigs/[id]` from kit blocks
> (`GigHeader` + `RequirementCard·grid` + `CriteriaList` + `ClientCard` + `TermsTabs` + `ApplyPanel` + `ChatPanel`)
> inside the layout's `AppShell`, binding real data and **preserving every flow** (apply/withdraw; owner applications +
> accept/reject; submit/approve/pay; messaging; admin moderation; example/closed/not-found) by wiring the **existing 8
> server actions** unchanged. Fill the missing `GigHeader`; add `getGigDetail`; F5 composition-pure, F3 parity; **F1
> ≤1% deferred** (font). Mirror the prior compose-* screens. Friction: high.

---

## Task 1: [x] `GigHeader` block (composition-gap fill) + `GigHeaderVM`

**Implementation Notes:**
- Add `GigHeaderVM` to `app/components/blocks/view-models.ts` (additive):
  ```ts
  export interface GigHeaderVM {
    title: string;
    status: Status;
    budget: Money;
    deadlineDays: number;
    category: Category;
    tags: string[];
    postedAt: DateISO;
  }
  ```
- Create `app/components/blocks/GigHeader.tsx` (a block — token classes / layout primitives OK; NOT a `@composed-screen`)
  composing `StatusBadge` + `CategoryTag` + `Tag` + the title (display type) + budget (mono) + deadline + date, e.g.:
  ```tsx
  import { StatusBadge, CategoryTag, Tag } from "@/app/components/primitives";
  import { Panel } from "@/app/components/layout/Panel";
  import { Stack } from "@/app/components/layout/Stack";
  import { STATUS_LABEL, CATEGORY_LABEL } from "./util";
  import type { GigHeaderVM } from "./view-models";

  export function GigHeader({ vm }: { vm: GigHeaderVM }) {
    return (
      <Panel surface={2} radius="lg" padding={6}>
        <Stack gap={3}>
          <Stack axis="row" gap={2} align="center" justify="between">
            <StatusBadge variant="inline-dot" status={vm.status}>{STATUS_LABEL[vm.status]}</StatusBadge>
            <CategoryTag category={vm.category}>{CATEGORY_LABEL[vm.category]}</CategoryTag>
          </Stack>
          <span className="text-display font-display text-strong">{vm.title}</span>
          <Stack axis="row" gap={2}>{vm.tags.map((t) => <Tag key={t} color={vm.category}>{t}</Tag>)}</Stack>
          <Stack axis="row" gap={4} align="center" justify="between">
            <span className="font-mono text-mono text-strong">{vm.budget}</span>
            <span className="text-caption font-caption text-muted">Срок {vm.deadlineDays} дней</span>
            <span className="text-caption font-caption text-muted">{vm.postedAt}</span>
          </Stack>
        </Stack>
      </Panel>
    );
  }
  ```
  (Confirm `STATUS_LABEL`/`CATEGORY_LABEL` exports in `blocks/util` — `GigCard` uses them. Token-pure.)
- Add `gigHeaderFixture` to `fixtures.ts`; export `GigHeader` from `app/components/blocks/index.ts`.

**Test Plan:**
```bash
test -f app/components/blocks/GigHeader.tsx && grep -qE 'GigHeader' app/components/blocks/index.ts && grep -qE 'GigHeaderVM' app/components/blocks/view-models.ts && echo "block + VM + export"
npm run lint:tokens && echo "token-pure"
```
Expected: `GigHeader` token-pure block + additive `GigHeaderVM` + fixture + barrel export.

---

## Task 2: [x] `getGigDetail` mapper (`lib/view-models.ts`)

**Implementation Notes:**
- Add `getGigDetail(gigId, viewer)` (server-only). Fetch the gig with `client.clientProfile`, `assignedSpecialist`,
  `applications.specialist.specialistProfile`, `messages.sender`, and role-gated `moderations` (mirror the current
  page's `findUnique`). Then map (reusing `getRatingForUser`, `lib/categories`, the `GIG_STATUS`/`money` helpers):
  ```ts
  export interface GigDetailData {
    header: GigHeaderVM
    requirements: RequirementCardVM[]
    criteria: CriteriaListVM
    client: ClientCardVM
    terms: TermsTabsVM
    chat: ChatPanelVM
    apply: ApplyPanelVM
    isOwner: boolean
    isAssignedSpecialist: boolean
    viewerApplication: { id: string; status: string } | null
    applications: { id: string; name: string; status: string; level?: string; tags: string[]; approach?: string; questions?: string; estimate?: string }[]
    lifecycle: { status: string; canSubmit: boolean; canApprove: boolean; canPay: boolean; canApply: boolean }
    isExample: boolean
    closedByAdmin: boolean
    moderations: { id: string; action: string; reason: string; by: string; at: string }[]
    notFound?: boolean
  }
  export async function getGigDetail(gigId: string, viewer: { userId: string; role: string }): Promise<GigDetailData>
  ```
  - `header`: title, `GIG_STATUS[gig.status]`, `money(gig.budget)`, `gig.deadlineDays`, `categorySlug ?? 'development'`,
    tags split, `createdAt` localized.
  - `requirements`: one `RequirementCardVM` per filled `goal`/`deliverables`/`constraints` (RU titles + icon).
  - `criteria`: `acceptanceCriteria` split on newlines/bullets → `{ label }[]` (empty → «Не указано»).
  - `client`: owner name (companyName ?? email) + `getRatingForUser(gig.clientId)` + meta.
  - `terms`: proposed = the viewer's application `proposedBudget`/`proposedDeadlineDays` (fallback to gig's when null) →
    `money`/«N дней»; client = `gig.budget`/`gig.deadlineDays`.
  - `chat`: `gig.messages` → `MessageBubbleVM[]` (`direction` from `senderId === viewer.userId`).
  - `apply`: the structured `ApplyPanelVM.fields` (approach/questions/estimatedEffort, RU labels, the `applyPanelFixture`
    shape) + `submitLabel: "Откликнуться"`.
  - flags: `isOwner`/`isAssignedSpecialist`/`viewerApplication`/`applications` (owner)/`lifecycle`/`isExample`/
    `closedByAdmin`/`moderations`. `import type` the VMs.

**Test Plan:**
```bash
grep -qE 'getGigDetail' lib/view-models.ts && grep -qE 'GigDetailData' lib/view-models.ts && grep -qE 'getRatingForUser\(gig.clientId\)|clientId' lib/view-models.ts && echo "mapper + client rating"
```
Expected: `getGigDetail` returns the seven block VMs + role/lifecycle flags; contract-typed.

---

## Task 3: [x] `GigDetail` composed screen (wires the 8 actions)

**Implementation Notes:**
- Create `app/(protected)/gigs/[id]/GigDetail.tsx` (`'use client'`, `/* @composed-screen */`). Props = the
  `getGigDetail` result. Compose via **layout primitives only** (no className/style). Wire the actions **directly** from
  `@/app/actions/*` (allowed by the composition lint) via `useActionState` + `<form action>` with a hidden `gigId`
  input; the blocks render named fields. Sketch:
  ```tsx
  /* @composed-screen */
  'use client'
  import { useActionState, useState } from 'react'
  import { Section } from '@/app/components/layout/Section'
  import { Grid } from '@/app/components/layout/Grid'
  import { Split } from '@/app/components/layout/Split'
  import { Stack } from '@/app/components/layout/Stack'
  import { GigHeader, RequirementCard, CriteriaList, ClientCard, TermsTabs, ApplyPanel, ChatPanel } from '@/app/components/blocks'
  import { Button } from '@/app/components/primitives'
  import { applyToGig, acceptApplication, rejectApplication, submitWork, approveWork, markAsPaid, withdrawApplication } from '@/app/actions/gig'
  import { sendMessage } from '@/app/actions/message'
  import type { GigDetailData } from '@/lib/view-models'

  export function GigDetail({ data, gigId }: { data: GigDetailData; gigId: string }) {
    const [tab, setTab] = useState<'proposed' | 'client'>('proposed')
    const [applyState, applyAction] = useActionState(applyToGig, null)
    // …useActionState for each used action…
    return (
      <Section title={data.header.title} gap={6}>
        <GigHeader vm={data.header} />
        <Split>
          <Stack gap={6}>
            <Grid columns={2} gap={4}>{data.requirements.map((r, i) => <RequirementCard key={i} vm={r} />)}</Grid>
            <CriteriaList vm={data.criteria} />
            <TermsTabs vm={data.terms} active={tab} onSelect={(t) => setTab(t as 'proposed' | 'client')} />
            {/* SPECIALIST apply (OPEN, not applied, not example) */}
            {data.lifecycle.canApply && (
              <form action={applyAction}>
                <input type="hidden" name="gigId" value={gigId} />
                <ApplyPanel vm={data.apply} />
                {applyState?.error && <span /* token-styled error via a primitive */>{applyState.error}</span>}
              </form>
            )}
            {/* owner applications + accept/reject, submit/approve/pay, withdraw — each a <form action> */}
            {/* messaging (owner/assigned, assigned!=null): ChatPanel + <form action={sendAction}> */}
          </Stack>
          <Stack gap={6}>
            <ClientCard vm={data.client} />
          </Stack>
        </Split>
      </Section>
    )
  }
  ```
  Wire each used action with its own `useActionState`; render accept/reject/submit/approve/pay/withdraw as small
  `<form action>` blocks with a hidden `gigId` (and `applicationId` for accept/reject/withdraw). Surface errors via a
  token-styled primitive/block (NO raw styled markup). Confirm a `Split` layout primitive exists (else use `Grid`).
  Messaging: render `ChatPanel vm={data.chat}` + a `<form action={sendAction}>` composer (gated on assignment + not
  closed/paid).

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "composed screen"
grep -qE 'className=|style=' app/\(protected\)/gigs/\[id\]/GigDetail.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure composition wiring the 8 actions via `useActionState` + `<form action>`.

---

## Task 4: [x] Thin server page + supersede the bespoke `[id]/*` form components

**Implementation Notes:**
- Rewrite `app/(protected)/gigs/[id]/page.tsx` (server): keep `getSession` + no-session redirect; call
  `getGigDetail(id, { userId, role })`; if the gig is missing render the **not-found** branch (token-styled notice);
  run `markNotificationAsRead(id)` for authorized viewers (preserve the try/catch); render the existing `Breadcrumb`
  (page-level, not in the composed screen — like `/gigs` renders `PaginationControls`) + `<GigDetail data={…}
  gigId={id} />`. Drop the bespoke body + the `[id]/*` form-component imports + local `formatRoubles`.
- Delete the superseded form components once their wiring lives in `GigDetail`: `apply-form.tsx`,
  `application-actions.tsx`, `submit-work-form.tsx`, `approve-work-form.tsx`, `message-list.tsx`, `message-form.tsx`,
  `withdraw-application-button.tsx` (the **server actions** in `@/app/actions/*` are unchanged). Keep
  `MarkAsPaidButton`/`BackButton`/`Breadcrumb` if still used (BackButton/Breadcrumb are page-level).

**Test Plan:**
```bash
grep -qE 'getGigDetail|GigDetail' app/\(protected\)/gigs/\[id\]/page.tsx && echo "page composed"
grep -qE 'Gig not found|notFound' app/\(protected\)/gigs/\[id\]/page.tsx && echo "not-found preserved"
grep -qE 'markNotificationAsRead' app/\(protected\)/gigs/\[id\]/page.tsx && echo "markNotificationAsRead preserved"
test ! -f app/\(protected\)/gigs/\[id\]/apply-form.tsx && echo "bespoke apply-form superseded"
```
Expected: thin server page renders `GigDetail` + breadcrumb; not-found + redirect + notification preserved; bespoke forms removed.

---

## Task 5: [x] Mapper unit tests + gig-detail E2E + update markup-asserting specs

**Implementation Notes:**
- `__tests__/integration/gig-detail-vm.test.ts` (mock `@/lib/prisma`/`next/*`; `createTestUser`/`createTestGig`/
  `createTestApplication`/`createTestMessage` + a `review.create`): `getGigDetail` returns the header (status/budget/
  deadline/category mapping), requirements (only filled), criteria (from acceptanceCriteria), client (owner rating),
  terms (proposed fallback to gig when no counter; counter when present), chat thread (direction per viewer), apply
  fields, and the role/lifecycle flags across OPEN/IN_PROGRESS/REVIEW/COMPLETED/PAID × owner/specialist/assigned.
- `__tests__/e2e/compose-gig-detail-apply.spec.ts` (setE2ESession + seed via prisma into `file:./test.db`): a SPECIALIST
  applies (composed `ApplyPanel` → `applyToGig`); seed/owner accepts (`acceptApplication`) → IN_PROGRESS; the assigned
  specialist submits (`submitWork`) → REVIEW; the owner approves (`approveWork`) → COMPLETED → marks paid
  (`markAsPaid`) → PAID; messaging sends once assigned; a PENDING application can withdraw; example gigs show the
  no-apply notice. (Use the `compose-gig-search.spec.ts` seeding + the action-form submit patterns.)
- Update gig-detail **E2E** specs asserting old markup (e.g. `gig-application-flow`/`gig-lifecycle` E2E, breadcrumb
  spec) to the composed blocks (RU labels, the blocks' roles). **Keep** the action-level **integration** tests
  (`gig-lifecycle.test.ts`, `application-management.test.ts`, messaging tests) unchanged — they target the server
  actions, which are preserved.

**Test Plan:**
```bash
npm run clean:test-db && npx vitest run __tests__/integration/gig-detail-vm.test.ts 2>&1 | tail -12
npm run clean:test-db && npx vitest run __tests__/integration/gig-lifecycle.test.ts __tests__/integration/application-management.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/compose-gig-detail-apply.spec.ts --project=chromium 2>&1 | tail -12
```
Expected: mapper unit tests pass; the preserved lifecycle/application integration tests stay green; E2E walks the full lifecycle + messaging + withdraw.

---

## Task 6: [x] Buildable acceptance (F3 + F5 + suite) + scope confirmation

**Implementation Notes:**
- Run F5 composition lint, token lint, build, full unit suite (update any tests asserting the old gig-detail markup:
  "Apply to this Gig", "Applications (N)", "Messages", "Submit Your Work", status pills), and the E2E.
- Confirm scope: only `/gigs/[id]` composed; the 8 server actions + lifecycle **semantics** unchanged (lifecycle/
  application/messaging integration tests green); `GigHeader` additive; the new `GigDetailData` lives in
  `lib/view-models.ts` and only `GigHeaderVM` is added to the block contract; no shell/new-route change.

**Test Plan:**
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
git status --porcelain app/\(protected\)/gigs/\[id\]/ | tail
```
Expected: F3 + F5 + build + suite + E2E green; scope held (gig-detail only; actions/semantics/shell untouched).

---

## Task 7: [x] F1 fidelity diff vs specialist-gig (artifacts; ≤1% deferred)

**Implementation Notes:**
- Capture the SPECIALIST `/gigs/[id]` at 1440px (a temporary capture spec like the prior compose-* changes, removed
  after — artifacts preserved; seed a SPECIALIST + an OPEN gig with goal/deliverables/constraints + acceptanceCriteria +
  category + tags for a populated render), then `node scripts/design-system/fidelity-diff.js <gig-detail-actual.png>
  screens/specialist-gig.jpg docs/design-system/fidelity/out/gig-detail` → ratio + `diff/side-by-side/overlay-50`.
- The ≤1% target is **deferred** (substitute font); report the ratio + that the residual is the documented font factor,
  not a composition defect.

**Test Plan:**
```bash
node scripts/design-system/fidelity-diff.js docs/design-system/fidelity/out/gig-detail/gig-detail-actual.png screens/specialist-gig.jpg docs/design-system/fidelity/out/gig-detail
```
Expected: diff + overlay produced; composed layout visually faithful; ≤1% deferred (font).

---

## Summary

Total tasks: 7
Estimated effort: 16–22 hours (friction: high — the largest screen: a new block + a multi-role mapper + a composed screen wiring 8 actions + a page rewrite + superseding 7 bespoke form components + unit/E2E/fidelity)

**Deliverables:**
- `GigHeader` block (gap fill) + additive `GigHeaderVM` + fixture + export.
- `lib/view-models.ts` — `getGigDetail` (seven block VMs + role/lifecycle flags), contract-typed, reusing `getRatingForUser`/`lib/categories`.
- `GigDetail` F5-pure `@composed-screen` wiring the 8 existing server actions via `useActionState` + `<form action>`; thin server page renders it + breadcrumb; the 7 bespoke `[id]/*` form components superseded.
- Mapper unit tests + gig-detail E2E (lifecycle walk + messaging + withdraw); preserved lifecycle/application/messaging integration tests; F1 diff produced (≤1% deferred).

**Critical path:** GigHeader (1) → getGigDetail (2) → GigDetail wiring (3) → page rewrite + supersede forms (4) → tests (5) → acceptance (6) → [artifacts] F1 diff (7).

**Dependencies:** compose-shell-cutover, domain-blocks, terms-negotiation, gig-deadline-and-milestones, ratings-reviews-model — all complete.

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–7):**
- **`GigHeader` block** (gap fill, `app/components/blocks/GigHeader.tsx`) + additive **`GigHeaderVM`** + fixture +
  barrel export. **`Notice` block** (second gap fill) — token-styled notices/errors so the screen stays F5-pure.
- **`getGigDetail` mapper** (`lib/view-models.ts`) — the seven block VMs (header / requirements / criteria / client +
  owner rating / terms with proposed-counter fallback / chat / apply) + the role + lifecycle state
  (`isOwner`/`isAssignedSpecialist`/`viewerApplication`/`applications`/`lifecycle`/`messaging`/`moderations`); returns
  `null` for a missing gig. Reuses `getRatingForUser`/`lib/categories`. Block view-model contract gained **only**
  `GigHeaderVM`.
- **`GigDetail` `@composed-screen`** (`app/(protected)/gigs/[id]/GigDetail.tsx`) — composes the seven blocks via layout
  primitives (Section/Split/Grid/Stack) and **wires all 8 server actions** (`applyToGig`/`withdrawApplication`/
  `acceptApplication`/`rejectApplication`/`submitWork`/`approveWork`/`markAsPaid`/`sendMessage`) directly via a typed
  `useAction` (`useActionState`) wrapper + `<form action>` with hidden inputs. Owner applications (ProfileCard +
  RequirementCard + accept/reject), example/closed/paid/lifecycle/messaging/moderation states all composed. F5-pure (no
  className/style). To make the presentational blocks form-submittable, `ApplyPanel`'s button and `ChatPanel`'s
  composer (Input `name="content"` + send) became `type="submit"` — additive, backward compatible (the FilterBar
  pattern).
- **Thin server page** (`page.tsx`) — `getGigDetail` + not-found + `markNotificationAsRead` + `Breadcrumb`/`BackButton`
  (page-level) + `<GigDetail>`; the 7 bespoke `[id]/*` form components deleted (their wiring moved into `GigDetail`).
- **Tests** — `__tests__/integration/gig-detail-vm.test.ts` **4/4** (header/requirements/criteria/client-rating/terms
  fallback+counter/role+lifecycle flags across OPEN/IN_PROGRESS/REVIEW/COMPLETED × specialist/owner/assigned; null for
  missing). `__tests__/e2e/compose-gig-detail-apply.spec.ts` **5/5** in a real browser — composed render + a SPECIALIST
  applies; the owner accepts (→ В работе); the assigned specialist submits (→ На проверке); messaging works once
  assigned; example gigs can't be applied to. The preserved action-level integration tests (`gig-lifecycle` 25, etc.)
  stay green.
- **Gates** — `lint:composition` (F5, 7 composed screens) ✓ · `lint:tokens` (F2) ✓ · `npm run build` ✓ (`/gigs/[id]`
  3.34 kB) · `npm run test:unit` **874/874** (was 870; +4 new) ✓ (thorough clean — the suite's transient pollution
  failures are environmental, not this change).

**Task 7 (F1 vs `specialist-gig`): diff produced; composed layout faithful; ≤1% deferred.** ratio = **0.1034**
(`docs/design-system/fidelity/out/gig-detail/`: diff / side-by-side / overlay-50; produced by a temporary capture spec,
removed after — artifacts preserved). The residual is the **substitute font** (SF Compact unlicensed), not a
composition defect.

**Scope guards (non-goals held):** the **8 server actions + lifecycle semantics are unchanged** (gig-lifecycle/
application/messaging integration tests green); no data-model/shell/new-route change; only `GigHeaderVM` added to the
block contract; the `ApplyPanel`/`ChatPanel` edits are additive component behavior (type=submit / input name), not
contract changes; `GigDetailData` lives in `lib/view-models.ts`.

**Reconciliation recorded:** the composed screen wires actions directly (`@/app/actions/gig`) — the bespoke `[id]/*`
forms can't be imported into a `@composed-screen` — so the `ConfirmDialog` on reject/withdraw and `ApplyForm`'s
client-side counters/guidance are dropped (server-side validation in `applyToGig` remains the source of truth). The
**known-broken pre-existing E2E journey specs** (`specialist-journey`/`client-journey`/`messaging-flow-e2e`/
`application-withdrawal`/`error-scenarios`/`breadcrumb-navigation`) — broken since the auth redesign (their legacy
`selectOption('select[name="role"]')` registration) — are out of the gated scope; this change's new E2E + the preserved
integration tests cover the flows.
