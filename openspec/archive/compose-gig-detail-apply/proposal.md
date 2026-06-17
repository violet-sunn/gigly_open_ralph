# Change Proposal: compose-gig-detail-apply

> Phase 2, change 22 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> composes the **`/gigs/[id]`** gig-detail screen from kit blocks — within the `AppShell` the shell-cutover put in the
> protected layout — binding **real** gig data and **preserving every functional flow** (apply, withdraw, owner
> applications + accept/reject, submit-work, approve-work, mark-as-paid, gig-scoped messaging, admin moderation, the
> example/closed states). Depends on: compose-shell-cutover, domain-blocks, terms-negotiation,
> gig-deadline-and-milestones, ratings-reviews-model (all complete). Friction: **high** (the largest, most
> multi-role page in the app).
>
> **Fidelity gate.** F3 (logical parity — every role's flows/states), F5 (composition purity), the functional flows,
> and E2E are enforced now. The **F1 ≤1% pixel-diff** vs `specialist-gig` (the SPECIALIST view the mock depicts) stays
> deferred — dominated by the **substitute font** (SF Compact unlicensed) — as recorded for the prior compose-* changes.
> The actual-vs-reference diff + overlay artifacts are produced.

## Problem Statement

The `/gigs/[id]` page is **bespoke pre-redesign markup** (`app/(protected)/gigs/[id]/page.tsx`, ~520 lines): a
hand-built details card (title/status/description/Additional-Requirements/Definition-of-Done/budget/posted-by/tags), a
SPECIALIST apply section (`ApplyForm` + withdraw + already-applied/withdrawn/not-open/example states), an
assigned-specialist submit-work form, an owner review-work + mark-as-paid + **applications list** (with accept/reject),
a messaging block (`MessageList` + `MessageForm`), an admin moderation history, a closed-by-admin notice, a sidebar
budget card, a breadcrumb + back button — all raw Tailwind. The redesign's `specialist-gig` is
`AppShell + GigHeader + RequirementCard·grid + CriteriaList + ClientCard + TermsTabs + ApplyPanel + ChatPanel`:

- The page renders inside the new `AppShell` (from compose-shell-cutover) but its **body is not composed** — raw markup
  everywhere (fails F5), English labels, and ad-hoc cards instead of the kit blocks.
- The blocks for the gig detail exist (domain-blocks: `RequirementCard`, `CriteriaList`, `ClientCard`, `TermsTabs`,
  `ApplyPanel`, `ChatPanel`, `MessageBubble`) and the data exists (Phase 1: terms-negotiation gave Application
  `proposedBudget`/`proposedDeadlineDays`; gig-deadline gave `deadlineDays`; ratings gave the owner's aggregate;
  category-taxonomy gave `categorySlug`) — but nothing **binds real data into the block view-models** for this screen.
- **`GigHeader`** — named in the design composition (`ui-redesign-integration.md` specialist-gig row) and required here —
  is **not implemented** (absent from the blocks barrel; domain-blocks built `GigCard`, not a detail `GigHeader`). A
  composition gap, exactly as `SearchPanel`/`CreateGigCTA`/`ResultCount` were.
- The presentational blocks (`ApplyPanel`/`ChatPanel`/`TermsTabs`) expose callbacks but **don't drive the real
  actions** — apply uses `applyToGig`, messaging uses `sendMessage`, lifecycle uses
  `acceptApplication`/`rejectApplication`/`submitWork`/`approveWork`/`markAsPaid`/`withdrawApplication` — so the
  composition must wire the blocks to those existing server actions.
- The F5 composition lint forbids a `@composed-screen` from importing the local `[id]/*` form components
  (`./apply-form`, `./application-actions`, …) — relative imports must reach `blocks/primitives/layout`. So the wiring
  must call the server actions **directly** (`@/app/actions/*` is an allowed import) via `useActionState` + `<form
  action>`; the bespoke form components are superseded.

The planning doc maps this exactly: compose `/gigs/[id]` from those blocks, preserving apply, the owner's view of
applications, and the unchanged lifecycle actions. This change makes the gig detail a data-bound composition for **all
three roles** while keeping the marketplace's core loop intact.

## Proposed Solution

Fill the `GigHeader` gap, add a contract-typed `getGigDetail` mapper, build a composition-pure `GigDetail` screen that
composes the blocks and wires the existing server actions, render it from a thin server page, and verify. Five
deliverable groups:

1. **`GigHeader` block (gap fill)** — `app/components/blocks/GigHeader.tsx` (+ `GigHeaderVM` added to the block
   view-model contract — additive; + fixture + barrel export): the detail header — title (display type), `StatusBadge`,
   budget (mono), deadline («Срок N дней»), `CategoryTag`, tag `Tag`s, posted date — composed from primitives + layout
   + tokens. Token-pure.

2. **`getGigDetail` mapper (`lib/view-models.ts`, server-only, contract-typed)** — `getGigDetail(gigId, viewer)` →
   `GigDetailData`: `header: GigHeaderVM`, `requirements: RequirementCardVM[]` (goal/deliverables/constraints, only the
   filled ones), `criteria: CriteriaListVM` (from `acceptanceCriteria` — the «Определение готовности» — split into
   items), `client: ClientCardVM` (owner + `getRatingForUser(clientId)` + meta), `terms: TermsTabsVM` (**proposed** =
   the viewer's application `proposedBudget`/`proposedDeadlineDays` (or the gig's if no counter) vs **client** =
   `gig.budget`/`gig.deadlineDays`), `chat: ChatPanelVM` (messages → `MessageBubbleVM` thread, in/out per viewer),
   `apply: ApplyPanelVM` (the structured fields), plus the **role/state contract**: `isOwner`, `isAssignedSpecialist`,
   `viewerApplication` (status), `applications` (owner only — specialist + status + structured fields), `lifecycle`
   (the current gig status + which actions are available), `isExample`, `closedByAdmin`, and `moderations` (admin).
   `import type` the VMs; the block view-model contract gains only the additive `GigHeaderVM`.

3. **`GigDetail` composed screen (`app/(protected)/gigs/[id]/GigDetail.tsx`, `'use client'`, `@composed-screen`)** —
   props = the `getGigDetail` result (serializable). Composes, via **layout primitives only** (Section/Grid/Split/
   Stack/Panel — no `className`/`style`): `GigHeader` · `RequirementCard·grid` · `CriteriaList` · `ClientCard` ·
   `TermsTabs` (tab state) · `ApplyPanel` (SPECIALIST, OPEN, not-applied — wired to `applyToGig` via `useActionState`
   + a `<form action>` with a hidden `gigId`; the structured field `name`s map to the action) · `ChatPanel`
   (owner/assigned-specialist when a specialist is assigned — real thread + composer wired to `sendMessage`). The
   **role-conditional functional sections** are composed + wired to the existing actions: the SPECIALIST
   applied/withdrawn/not-open/example states; the **owner applications list** (each a `ProfileCard`/`ClientCard`-style
   entry + the structured fields + accept/reject via `acceptApplication`/`rejectApplication`); submit-work
   (`submitWork`), review/approve (`approveWork`), mark-as-paid (`markAsPaid`), withdraw (`withdrawApplication`); the
   admin moderation history; and the closed-by-admin notice. All actions are imported from `@/app/actions/*` (allowed)
   and invoked via `useActionState` + `<form action>` (no `className`/`style` → F5-clean). Client (tab state + the
   action forms) — the same presentational-block + thin-wrapper pattern as the prior screens.

4. **Thin server page (`app/(protected)/gigs/[id]/page.tsx`)** — keep `getSession`/no-session redirect, the gig
   `findUnique` (or move it into `getGigDetail`), the **not-found** branch, `markNotificationAsRead`, and the
   role-gated `moderations` include; build the VM via `getGigDetail` and render `<GigDetail data={…} />` (plus the
   existing `Breadcrumb`, rendered by the page — not the composed screen — like `/gigs` renders `PaginationControls`).
   Replace the bespoke body; supersede the `[id]/*` bespoke form components (apply-form, application-actions,
   submit-work-form, approve-work-form, message-list, message-form, withdraw-application-button) — their logic moves
   into `GigDetail`'s action wiring (the server actions are unchanged).

5. **Tests + fidelity** — unit tests for `getGigDetail` (header/requirements/criteria/client-rating/terms/chat/apply +
   role flags across OPEN/IN_PROGRESS/REVIEW/COMPLETED/PAID and owner/specialist/assigned/admin). E2E
   (`compose-gig-detail-apply.spec.ts`): a SPECIALIST applies (`applyToGig`) and the application appears for the owner;
   the owner accepts (`acceptApplication`) → IN_PROGRESS; the assigned specialist submits (`submitWork`) → REVIEW; the
   owner approves (`approveWork`) → COMPLETED → marks paid (`markAsPaid`) → PAID; messaging works once assigned;
   withdraw works; example gigs can't be applied to. `lint:composition` (F5) on `GigDetail`; F3 parity. The F1
   actual-vs-`specialist-gig` diff is **produced** with ≤1% **deferred** (font).

This change emits **the `GigHeader` block + the `getGigDetail` mapper + the `GigDetail` composition + the page rewrite +
tests only**. It does **not** change any data model or **server action** (all 8 reused verbatim), the shell, or the
lifecycle **semantics**; it does not build new routes.

## Constraints

### MUST Requirements
- The `/gigs/[id]` body MUST be composed from blocks (`GigHeader` + `RequirementCard·grid` + `CriteriaList` +
  `ClientCard` + `TermsTabs` + `ApplyPanel` + `ChatPanel`) inside the layout's `AppShell`, as a composition-pure screen
  (F5): `GigDetail` MUST carry `@composed-screen`, import only kit/lib/actions/react/next, and contain **no**
  `className`/`style`/raw styled markup.
- The composition MUST **preserve every functional flow and state** for all roles: apply (`applyToGig`) + withdraw
  (`withdrawApplication`); the owner's applications list + accept/reject (`acceptApplication`/`rejectApplication`);
  submit-work (`submitWork`); approve-work (`approveWork`); mark-as-paid (`markAsPaid`); gig-scoped messaging
  (`sendMessage`, owner/assigned-specialist, gated on assignment + not closed/paid); admin moderation history; the
  example-gig and closed-by-admin states; the not-found branch; `markNotificationAsRead`.
- The composition MUST bind **real** data via `getGigDetail` — header, requirements (filled goal/deliverables/
  constraints), criteria (from `acceptanceCriteria`), the owner `ClientCard` (with the owner's aggregate rating),
  `TermsTabs` (proposed vs client terms), the message thread, and the role/state flags.
- `GigHeader` MUST be implemented (token-pure block) + exported with a fixture; the server actions MUST be wired
  **directly** (`@/app/actions/*`) via `useActionState` + `<form action>` (the bespoke `[id]/*` form components are
  superseded; their import is disallowed in a `@composed-screen`).
- The page MUST render `GigDetail` for an existing gig, preserve the no-session redirect + not-found branch, and the
  lifecycle **semantics** (status transitions, authorization) MUST be unchanged.
- `npm run build`, `npm run test:unit`, the gig-detail E2E, `npm run lint:composition`, and `npm run lint:tokens` MUST
  be green; the existing gig-lifecycle/application/messaging tests MUST stay green.

### SHOULD Requirements
- `getGigDetail` SHOULD live in `lib/view-models.ts` (server-only, `import type` the VMs) and reuse `getRatingForUser`/
  `lib/categories`; `TermsTabs` **proposed** SHOULD fall back to the gig's budget/deadline when the application has no
  counter (`proposedBudget`/`proposedDeadlineDays` null).
- `GigDetail` SHOULD be the only `'use client'` screen addition; action results (errors) SHOULD surface via
  `useActionState` + token-styled block/primitive feedback (no raw styled markup).
- The `CriteriaList` items SHOULD be derived from `acceptanceCriteria` (split on lines/bullets); when empty, a single
  «Не указано» item or an empty list.

### Non-Goals
- **No data-model or server-action change** (all 8 actions reused verbatim; lifecycle semantics unchanged); **no shell
  change**; **no new routes**; **no admin-screen redesign** (the moderation history is composed in place from
  primitives, no mock).
- **F1 ≤1% enforcement is deferred** — the diff is produced for review, but the ≤1%-vs-`specialist-gig` target is
  reached only once the **SF Compact font is licensed**. F3/F5/functional/E2E are the enforced acceptance.

## Success Criteria

1. `/gigs/[id]` body composes `GigHeader`+`RequirementCard·grid`+`CriteriaList`+`ClientCard`+`TermsTabs`+`ApplyPanel`+`ChatPanel` (F5-pure `@composed-screen`).
2. Real data bound via `getGigDetail` (header/requirements/criteria/client-rating/terms/chat/apply + role/state flags); `GigHeader` implemented + exported.
3. Every flow preserved + wired to the existing actions: apply/withdraw; owner applications + accept/reject; submit/approve/pay; messaging; admin moderation; example/closed/not-found states (F3).
4. Lifecycle semantics + all 8 server actions unchanged; the bespoke `[id]/*` form components superseded; the page renders `GigDetail` + breadcrumb.
5. `build`, `test:unit` (existing lifecycle/application/messaging tests green), gig-detail E2E, `lint:composition`, `lint:tokens` all green; F1 diff produced (≤1% deferred to font).

## Affected Areas

- `app/(protected)/gigs/[id]/page.tsx` (thin server page → `getGigDetail` + `<GigDetail>` + `Breadcrumb`; preserve redirect/not-found/markNotificationAsRead)
- `app/(protected)/gigs/[id]/GigDetail.tsx` (new — `'use client'` `@composed-screen`, wires the 8 actions)
- `app/(protected)/gigs/[id]/{apply-form,application-actions,submit-work-form,approve-work-form,message-list,message-form,withdraw-application-button}.tsx` (superseded — logic moves into `GigDetail`)
- `app/components/blocks/GigHeader.tsx` (new block) + `app/components/blocks/index.ts` (export) + `fixtures.ts` (fixture) + `app/components/blocks/view-models.ts` (additive `GigHeaderVM`)
- `lib/view-models.ts` (new — `getGigDetail` + `GigDetailData`, contract-typed)
- `__tests__/e2e/compose-gig-detail-apply.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests); update markup-asserting gig-detail E2E specs
- read-only inputs: the blocks (`RequirementCard`/`CriteriaList`/`ClientCard`/`TermsTabs`/`ApplyPanel`/`ChatPanel`/`MessageBubble`), the primitives, `@/app/actions/gig` + `@/app/actions/message` (the 8 actions), `lib/reviews`, `lib/categories`, `app/components/Breadcrumb`, `screens/specialist-gig.jpg` (F1 reference)
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements, folded on archive)
- (NOT modified: data models; the 8 server actions; the shell; lifecycle semantics)

## Risks & Mitigations

**Risk**: The page is multi-role with ~8 server actions + many states — the largest composition by far; high regression risk to the core loop.
**Mitigation**: Reuse the 8 server actions **verbatim** (no semantics change) — only the presentation/wiring changes. `getGigDetail` centralizes the role/state computation (unit-tested across roles × statuses). A full E2E walks the lifecycle (apply→accept→submit→approve→pay) + messaging + withdraw. The existing gig-lifecycle/application/messaging integration tests (which target the actions) stay green.

**Risk**: The F5 composition lint forbids importing the local `[id]/*` form components into a `@composed-screen`.
**Mitigation**: Wire the actions **directly** from `@/app/actions/*` (allowed) via `useActionState` + `<form action>` (no `className`/`style` → lint-clean); the bespoke form components are superseded. The blocks (`ApplyPanel`/`ChatPanel`) already render named fields, so binding to the FormData actions is natural.

**Risk**: `GigHeader` doesn't exist — composing it would fail.
**Mitigation**: Implement it as a token-pure block (title + `StatusBadge` + budget + deadline + `CategoryTag` + tags + date) with a `GigHeaderVM` (additive contract), fixture, and barrel export — a system-gap fill recorded in the spec.

**Risk**: `ApplyPanel`/`ChatPanel` are presentational (don't drive actions); losing the existing `ApplyForm`'s validation/guidance/counters is a regression.
**Mitigation**: Bind `ApplyPanel`'s structured fields to `applyToGig` (server-side validation already enforces the rules); surface action errors via `useActionState`. Re-add client-side counters/guidance only if cheap; otherwise document the reconciliation (server validation is the source of truth). Messaging: `ChatPanel`'s composer wired to `sendMessage`; the thread is the real messages → `MessageBubble`.

**Risk**: Replacing the bespoke page breaks tests asserting old markup (English headings, "Apply to this Gig", "Applications (N)", "Messages", status pills).
**Mitigation**: Map old assertions to the composed blocks (RU labels, the blocks' roles/text); preserve the behavioural contract (apply, accept/reject, lifecycle, messaging). Update the markup-asserting gig-detail E2E specs; keep the action-level integration tests unchanged. A new E2E covers the composed flows.

**Risk**: F1 ≤1% won't pass against `specialist-gig`.
**Mitigation**: Documented + accepted (per the prior compose-* changes): the residual is the substitute font — not a composition defect. The diff + 50%-overlay are produced for review; ≤1% is reached once the font is licensed.
