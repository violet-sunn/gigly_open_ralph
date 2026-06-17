# Change Proposal: compose-client-dashboard

> Phase 2, change 19 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> composes the **CLIENT `/dashboard`** from kit blocks — within the `AppShell` the shell-cutover put in the protected
> layout — binding **real** data (profile completion %, the client's gigs as `GigCard`s, recent messages). Depends on:
> compose-shell-cutover, domain-blocks, ratings-reviews-model, gig-deadline-and-milestones, category-taxonomy (all
> complete). Friction: **high** (replaces the bespoke CLIENT dashboard markup).
>
> **Fidelity gate.** F3 (logical parity), F5 (composition purity), the functional flows (gig links, create-gig), and
> E2E are enforced now. The **F1 ≤1% pixel-diff** vs `customer-dashboard` stays deferred — dominated by the
> **substitute font** (SF Compact unlicensed) and the **cosmic banner raster** (an unexported residual asset) — exactly
> as recorded for compose-shell-cutover. The actual-vs-reference diff + overlay artifacts are produced for review.

## Problem Statement

The CLIENT `/dashboard` is **bespoke pre-redesign markup** (`app/(protected)/dashboard/page.tsx`): a hand-built welcome
card, a `ProfileCompletionCard`, a `DashboardOnboarding` overlay, and a 3-column grid of raw-Tailwind cards (My Gigs
list, Find-Project card, Finances card, Messages card) — not composed from the kit. The redesign's `customer-dashboard`
is `AppShell + BannerCard + Tabs + GigCard·grid + CreateGigCTA + MessagesPanel`:

- The page renders inside the new `AppShell` (from compose-shell-cutover) but its **body is not composed** — it uses
  `className`/raw markup everywhere (fails F5), English labels, and ad-hoc gig cards instead of `GigCard`.
- The blocks exist (domain-blocks) and the data models exist (Phase 1), but nothing **binds real data into the block
  view-models** for this screen (no `Gig → GigCardVM` mapper, no `MessagesPanelVM` from conversations, no completion %).
- **`CreateGigCTA`** — listed in the design (`DESIGN_SYSTEM_SPEC.md` §3.3) and required by this composition — is **not
  implemented** (absent from the blocks barrel/fixtures). A composition gap.
- The bespoke `DashboardOnboarding` overlay is the full-viewport modal that (as found during compose-shell-cutover)
  sits over the sidebar; replacing it with a composed completion indicator also removes that obstruction.

The planning doc maps this exactly: compose `/dashboard` (CLIENT) from blocks with real completion %, gigs, messages,
no bespoke styling. The shell + blocks + data are all in place — this change makes the CLIENT dashboard a thin,
data-bound composition.

## Proposed Solution

Fill the `CreateGigCTA` gap, add contract-typed view-model mappers, build a composition-pure `ClientDashboard`, wire it
into the page for the CLIENT role, and verify. Five deliverable groups:

1. **`CreateGigCTA` block (fill the gap)** — a small additive block (`app/components/blocks/CreateGigCTA.tsx`): a
   primary-styled action (`Button`-token-styled `Link`) + label → href (`/gigs/new`). Token-pure; fixture +
   barrel export. (A composition gap surfaced here → added to the kit per the planning doc's "system gap" rule.)

2. **View-model mappers (`lib/view-models.ts`, server-only, contract-typed)** — `toGigCardVM(gig, { rating, layout })`
   → `GigCardVM` (map gig `status` → the design `Status`, `categorySlug` → the `Category` enum with a default,
   `budget` → a `Money` string, `deadlineDays`, `rating` via `getRatingForUser`, `clientName`, `isCurrent`); and
   `getClientDashboard(userId)` → `{ completion: number; banner: BannerCardVM; gigCards: GigCardVM[]; tabs:
   {value,label,count}[]; messages: MessagesPanelVM }` (reusing the gigs query, `getRatingForUser`,
   `getRecentMessages`, `lib/categories`). View-model types imported `import type` (no runtime UI coupling).

3. **`ClientDashboard` composed screen (`app/(protected)/dashboard/ClientDashboard.tsx`, `'use client'`,
   `@composed-screen`)** — props = the built data (serializable). Composes, via **layout primitives only** (Section/
   Grid/Stack — no `className`/`style`): `BannerCard` (welcome + completion % + create CTA) · `Tabs` (gig status:
   Все / В работе / На проверке / Завершённые, with counts; `useState` active) · `GigCard·grid` (filtered by the
   active tab; `onOpen` → `router.push('/gigs/[id]?from=dashboard')`) · `CreateGigCTA` (→ `/gigs/new`) · `MessagesPanel`
   (conversations → `/gigs/[gigId]#messages`). Client (tabs state + gig-link navigation) — the same presentational-block
   + thin-wrapper pattern as the shell.

4. **Wire into `app/(protected)/dashboard/page.tsx`** — for `role === 'CLIENT'`, build the data server-side
   (`getClientDashboard`) and render `<ClientDashboard data={…} />`, replacing the bespoke CLIENT branch (welcome card,
   `ProfileCompletionCard`, the 3-column grid). The completion % subsumes the `ProfileCompletionCard`/`DashboardOnboarding`
   overlay for CLIENT (removing the full-viewport modal). Preserve the no-session redirect and surface the existing
   `?error=` notices. The SPECIALIST branch is untouched (compose-specialist-dashboard, #20).

5. **Tests + fidelity** — E2E (`compose-client-dashboard.spec.ts`): the CLIENT dashboard renders the composed blocks,
   a `GigCard` opens `/gigs/[id]`, the create CTA opens `/gigs/new`, tabs filter. Unit tests for the mappers
   (`toGigCardVM`/`getClientDashboard`). `lint:composition` (F5) on `ClientDashboard`; F3 parity (tabs + blocks). The
   F1 actual-vs-`customer-dashboard` diff is **produced** (artifacts) with the ≤1% target **deferred** (font + banner
   raster).

This change emits **the `CreateGigCTA` block + view-model mappers + the `ClientDashboard` composition + the page wiring
+ tests only**. It does **not** restyle the SPECIALIST dashboard (#20), build the `/finances` or `/chats` routes (their
own changes), change any data model or server action, or re-wire the shell (compose-shell-cutover owns it).

## Constraints

### MUST Requirements
- The CLIENT `/dashboard` body MUST be composed from blocks (`BannerCard` + `Tabs` + `GigCard·grid` + `CreateGigCTA` +
  `MessagesPanel`) inside the layout's `AppShell`, as a composition-pure screen (F5): the `ClientDashboard` file MUST
  carry `@composed-screen`, import only kit/lib/actions/react/next, and contain **no** `className`/`style`/raw markup.
- The composition MUST bind **real** data: profile **completion %**, the client's **gigs** as `GigCardVM`s (correct
  status/category/budget/deadline/rating mapping), and recent **messages** as a `MessagesPanelVM`.
- `CreateGigCTA` MUST be implemented (token-pure block) and exported; the create flow (`CreateGigCTA`/banner CTA →
  `/gigs/new`) and gig links (`GigCard` → `/gigs/[id]`) MUST work.
- The page MUST render `ClientDashboard` for `role === 'CLIENT'`, preserve the no-session redirect, and leave the
  SPECIALIST branch unchanged.
- `npm run build`, `npm run test:unit`, the CLIENT dashboard E2E, `npm run lint:composition`, and `npm run lint:tokens`
  MUST be green; the ~860 existing tests MUST stay green.

### SHOULD Requirements
- View-model mappers SHOULD live in `lib/` (server-only, `import type` the VMs), reused by the page; the `Gig →
  GigCardVM` status mapping SHOULD be `OPEN→open`, `IN_PROGRESS→in-progress`, `REVIEW→verification`, `COMPLETED→completed`,
  `PAID→completed` (the design `Status` has no `paid`).
- `ClientDashboard` SHOULD be the only `'use client'` addition (tabs state + gig-link navigation); navigation SHOULD use
  `router.push`/`Link` (no `onClick` business logic in the screen beyond wiring).
- The completion % SHOULD subsume the bespoke `ProfileCompletionCard`/`DashboardOnboarding` overlay for CLIENT (also
  removing the full-viewport modal that obstructs the sidebar).

### Non-Goals
- **No SPECIALIST dashboard** (compose-specialist-dashboard, #20); **no new routes** (`/finances`, `/chats` — their own
  changes); **no data-model/server-action change**; **no shell change** (compose-shell-cutover).
- **F1 ≤1% enforcement is deferred** — the diff is produced for review, but the ≤1%-vs-`customer-dashboard` target is
  reached only once the **SF Compact font is licensed** and the **cosmic banner raster** is exported. F3/F5/functional/
  E2E are the enforced acceptance.

## Success Criteria

1. CLIENT `/dashboard` body composes `BannerCard`+`Tabs`+`GigCard·grid`+`CreateGigCTA`+`MessagesPanel` (F5-pure `@composed-screen`).
2. Real data bound — completion %, gigs (correctly mapped `GigCardVM`s), messages; `CreateGigCTA` implemented + exported.
3. Gig links (`GigCard` → `/gigs/[id]`) and the create flow (→ `/gigs/new`) work; tabs filter by status (F3).
4. SPECIALIST branch untouched; no-session redirect preserved; the bespoke CLIENT markup/overlay removed.
5. `build`, `test:unit` (~860 green), CLIENT dashboard E2E, `lint:composition`, `lint:tokens` all green; F1 diff produced (≤1% deferred to font + banner raster).

## Affected Areas

- `app/(protected)/dashboard/page.tsx` (CLIENT branch → `getClientDashboard` + `<ClientDashboard>`; SPECIALIST branch unchanged)
- `app/(protected)/dashboard/ClientDashboard.tsx` (new — `'use client'` `@composed-screen`)
- `app/components/blocks/CreateGigCTA.tsx` (new block) + `app/components/blocks/index.ts` (export) + `fixtures.ts` (fixture)
- `lib/view-models.ts` (new — `toGigCardVM` + `getClientDashboard`, contract-typed)
- `__tests__/e2e/compose-client-dashboard.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests)
- read-only inputs: the blocks (`BannerCard`/`GigCard`/`MessagesPanel`/`Tabs`), `lib/reviews` (`getRatingForUser`), `lib/categories`, `app/actions/message` (`getRecentMessages`), `screens/customer-dashboard.jpg` (F1 reference)
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements to the `ui` domain)
- (NOT modified: the SPECIALIST dashboard branch; data models / server actions; the shell; `view-models.ts` block contracts)

## Risks & Mitigations

**Risk**: `GigCard`/`Tabs` are presentational (callback `onOpen`/`onSelect`) — gig links and tab switching need client wiring.
**Mitigation**: `ClientDashboard` is a `'use client'` `@composed-screen` (allowed: react/next/hooks; no className/style) — `useState` for the active tab, `router.push` for `onOpen` gig links. Same presentational-block + thin-wrapper pattern proven by the shell cutover.

**Risk**: Replacing the bespoke CLIENT dashboard breaks tests asserting the old markup (welcome text, "Post New Gig", `ProfileCompletionCard`).
**Mitigation**: Map old assertions to the composed blocks (RU labels, `CreateGigCTA`, `GigCard`); preserve gig links + the create flow (the behavioural contract). Run the full suite + a new E2E. The SPECIALIST branch is untouched.

**Risk**: `CreateGigCTA` doesn't exist — composing it would fail.
**Mitigation**: Implement it as a small token-pure block (primary `Link`-button + label) with a fixture + barrel export — a system-gap fill recorded in the spec.

**Risk**: F1 ≤1% won't pass against `customer-dashboard`.
**Mitigation**: Documented + accepted (per compose-shell-cutover): the residual is the substitute font + the unexported cosmic banner raster (BannerCard's `art`) — not a composition defect. The diff + 50%-overlay are produced for review; ≤1% is reached once the font is licensed and the raster exported.

**Risk**: The dashboard onboarding overlay removal changes onboarding UX.
**Mitigation**: The composed dashboard surfaces the **completion %** (the real signal) in the banner/stat — the design's intent — replacing the full-viewport modal; the profile-edit path is still linked. Net a11y improvement (the modal no longer obstructs the shell).
