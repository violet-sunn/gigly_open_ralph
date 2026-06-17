# Change Proposal: compose-specialist-dashboard

> Phase 2, change 20 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> composes the **SPECIALIST `/dashboard`** from kit blocks — within the `AppShell` the shell-cutover put in the
> protected layout — binding **real** data (profile completion %, the specialist's applications + assigned gigs as
> `GigCard`s across 5 status tabs, recent messages). Depends on: compose-shell-cutover, domain-blocks,
> ratings-reviews-model, category-taxonomy (all complete). Friction: **high** (replaces the bespoke SPECIALIST dashboard
> markup + the legacy `SpecialistDashboardTabs`).
>
> **Fidelity gate.** F3 (logical parity — the **exact 5 tabs + counts**), F5 (composition purity), the functional flows
> (gig links, find-project search), and E2E are enforced now. The **F1 ≤1% pixel-diff** vs `specialist-dashboard` stays
> deferred — dominated by the **substitute font** (SF Compact unlicensed) and the **cosmic banner raster** (an
> unexported residual asset) — exactly as recorded for compose-shell-cutover and compose-client-dashboard. The
> actual-vs-reference diff + overlay artifacts are produced for review.

## Problem Statement

The SPECIALIST `/dashboard` is **bespoke pre-redesign markup** (`app/(protected)/dashboard/page.tsx`, the
`session.role !== 'CLIENT'` branch + `app/(protected)/dashboard/SpecialistDashboardTabs.tsx`): a hand-built welcome
card, a `ProfileCompletionCard`, a `DashboardOnboarding` overlay, an English 3-tab control (Active Work / Pending
Applications / Archive) of raw-Tailwind list rows, and a sidebar of ad-hoc cards (Найти проект, Финансы, Сообщения) —
not composed from the kit. The redesign's `specialist-dashboard` is
`AppShell + BannerCard + Tabs + GigCard·grid + SearchPanel + MessagesPanel`:

- The page renders inside the new `AppShell` (from compose-shell-cutover) but its **SPECIALIST body is not composed** —
  it uses `className`/raw markup everywhere (fails F5), **English** tab labels, and ad-hoc list rows + status chips
  instead of `GigCard`s + the design `StatusBadge`.
- The tabs are **wrong for F3**: the design specifies exactly **Все · Заявки · В работе · На проверке · Завершённые
  (with counts)** (`ui-redesign-integration.md` §"Logical parity (F3)"); the current control is the English 3-tab
  Active/Pending/Archive with no counts.
- The blocks exist (domain-blocks) and the data exists (Phase 1 + the existing application/gig models), but nothing
  **binds real data into the block view-models** for this screen — there is no specialist-dashboard mapper (no unified
  `application + assigned-gig → GigCardVM` set, no 5-tab counts).
- **`SearchPanel`** — named in the design (`ui-redesign-integration.md` screen→composition map) and required by this
  composition — is **not implemented** (absent from the blocks barrel/fixtures; only the `SearchInput` primitive and
  `FilterBar` block exist). A composition gap, exactly as `CreateGigCTA` was for compose-client-dashboard.
- The bespoke `DashboardOnboarding` overlay is the full-viewport modal that (as found during compose-shell-cutover)
  sits over the sidebar; replacing it with the composed completion indicator also removes that obstruction.

The planning doc maps this exactly: compose `/dashboard` (SPECIALIST) from blocks —
`AppShell + BannerCard + Tabs(Все/Заявки/В работе/На проверке/Завершённые + counts) + GigCard·grid + SearchPanel +
MessagesPanel`, mapped to existing application/gig states. The shell + blocks + data are in place — this change makes
the SPECIALIST dashboard a thin, data-bound composition, and the **CLIENT branch is untouched** (compose-client-dashboard
owns it).

## Proposed Solution

Fill the `SearchPanel` gap, add a contract-typed specialist-dashboard mapper (reusing `toGigCardVM`), build a
composition-pure `SpecialistDashboard`, wire it into the page for the SPECIALIST role, and verify. Five deliverable
groups:

1. **`SearchPanel` block (fill the gap)** — a small additive block (`app/components/blocks/SearchPanel.tsx`) composing
   the **`SearchInput` primitive** + a primary "Найти проект" action → `/gigs`. Presentational: it owns its ephemeral
   input value and calls `onSubmit(query)` (the screen routes to `/gigs?q=…`) — the same callback pattern as
   `GigCard.onOpen`. Token-pure (primitives + tokens only); fixture + barrel export. (A composition gap surfaced here →
   added to the kit per the planning doc's "system gap" rule, mirroring `CreateGigCTA`.)

2. **Specialist-dashboard mapper (`lib/view-models.ts`, server-only, contract-typed)** — `getSpecialistDashboard(userId)`
   → `SpecialistDashboardData = { completion: number; banner: BannerCardVM; gigCards: SpecialistGigCard[];
   tabs: {value,label,count}[]; messages: MessagesPanelVM }`, where `SpecialistGigCard = GigCardVM & { tabKey: string }`.
   It fetches the specialist's **applications** (with full gig) and **assigned gigs**, maps each to a `GigCardVM` via the
   **existing `toGigCardVM`**, tags each with a `tabKey`, builds the **5-tab counts**, computes completion % from the
   specialist profile fields, and reuses `getRecentMessages`. View-model types imported `import type` (no runtime UI
   coupling). Reuses the `getClientDashboard` shape/idioms already in the file.

3. **`SpecialistDashboard` composed screen (`app/(protected)/dashboard/SpecialistDashboard.tsx`, `'use client'`,
   `@composed-screen`)** — props = the built data (serializable). Composes, via **layout primitives only** (Section/
   Grid/Stack — no `className`/`style`): `BannerCard` (welcome + completion %) · `Tabs` (**Все / Заявки / В работе /
   На проверке / Завершённые**, with counts; `useState` active) · `GigCard·grid` (filtered by the active tab's `tabKey`;
   `onOpen` → `router.push('/gigs/[id]?from=dashboard')`) · `SearchPanel` (`onSubmit` → `/gigs?q=…`) · `MessagesPanel`
   (conversations → `/gigs/[gigId]#messages`). Client (tabs state + gig-link navigation + search submit) — the same
   presentational-block + thin-wrapper pattern as `ClientDashboard`.

4. **Wire into `app/(protected)/dashboard/page.tsx`** — for `role === 'SPECIALIST'`, build the data server-side
   (`getSpecialistDashboard`) and render `<SpecialistDashboard {...data} />`, replacing the bespoke SPECIALIST branch
   (welcome card, `ProfileCompletionCard`, `SpecialistDashboardTabs`, the sidebar cards, `DashboardOnboarding` for
   SPECIALIST). The completion % subsumes the `ProfileCompletionCard`/`DashboardOnboarding` overlay for SPECIALIST
   (removing the full-viewport modal). Preserve the no-session redirect and surface the existing `?error=` notices. The
   CLIENT branch is untouched (compose-client-dashboard, #19); the unknown-role fallback is preserved.

5. **Tests + fidelity** — E2E (`compose-specialist-dashboard.spec.ts`): the SPECIALIST dashboard renders the composed
   blocks, shows the **5 RU tabs with counts**, a `GigCard` opens `/gigs/[id]`, the `SearchPanel` routes to `/gigs`,
   tabs filter the grid. Unit tests for `getSpecialistDashboard` (5-tab counts; application vs assigned-gig mapping;
   completion %). `lint:composition` (F5) on `SpecialistDashboard`; F3 parity (the exact 5 tabs + counts). The F1
   actual-vs-`specialist-dashboard` diff is **produced** (artifacts) with the ≤1% target **deferred** (font + banner
   raster).

This change emits **the `SearchPanel` block + the `getSpecialistDashboard` mapper + the `SpecialistDashboard`
composition + the page wiring + tests only**. It does **not** restyle the CLIENT dashboard (#19), build the `/gigs`,
`/finances`, or `/chats` routes (their own changes), change any data model or server action, or re-wire the shell
(compose-shell-cutover owns it).

## Constraints

### MUST Requirements
- The SPECIALIST `/dashboard` body MUST be composed from blocks (`BannerCard` + `Tabs` + `GigCard·grid` + `SearchPanel`
  + `MessagesPanel`) inside the layout's `AppShell`, as a composition-pure screen (F5): the `SpecialistDashboard` file
  MUST carry `@composed-screen`, import only kit/lib/actions/react/next, and contain **no** `className`/`style`/raw
  markup.
- The tabs MUST be exactly **Все · Заявки · В работе · На проверке · Завершённые with live counts** (F3), mapped to the
  existing states: Заявки = the specialist's PENDING applications; В работе = assigned `IN_PROGRESS`; На проверке =
  assigned `REVIEW`; Завершённые = assigned `COMPLETED`/`PAID`; Все = all.
- The composition MUST bind **real** data: profile **completion %**, the specialist's **applications + assigned gigs**
  as `GigCardVM`s (correct status/category/budget/deadline/rating mapping), and recent **messages** as a
  `MessagesPanelVM`.
- `SearchPanel` MUST be implemented (token-pure block over `SearchInput`) and exported; the find-project flow
  (`SearchPanel` submit → `/gigs?q=…`) and gig links (`GigCard` → `/gigs/[id]`) MUST work.
- The page MUST render `SpecialistDashboard` for `role === 'SPECIALIST'`, preserve the no-session redirect, leave the
  CLIENT branch and the unknown-role fallback unchanged.
- `npm run build`, `npm run test:unit`, the SPECIALIST dashboard E2E, `npm run lint:composition`, and `npm run
  lint:tokens` MUST be green; the ~865 existing tests MUST stay green.

### SHOULD Requirements
- The `getSpecialistDashboard` mapper SHOULD live in `lib/view-models.ts` (server-only, `import type` the VMs) and
  **reuse `toGigCardVM`**; the assigned-gig status mapping SHOULD be the existing `OPEN→open`,
  `IN_PROGRESS→in-progress`, `REVIEW→verification`, `COMPLETED→completed`, `PAID→completed`.
- `SpecialistDashboard` SHOULD be the only `'use client'` screen addition (tabs state + gig-link navigation + search
  submit); navigation SHOULD use `router.push`/`Link` (no business logic in the screen beyond wiring).
- The completion % SHOULD subsume the bespoke `ProfileCompletionCard`/`DashboardOnboarding` overlay for SPECIALIST
  (also removing the full-viewport modal that obstructs the sidebar).
- Reconciliation (record in the spec): the legacy English 3-tab (Active/Pending/Archive) → the design's 5 RU tabs;
  **rejected/withdrawn** applications (legacy "Archive") are surfaced only under **Все** (rendered as `GigCard`s with
  `status: 'rejected'`) so no data is lost while the primary tabs match the design exactly; PENDING-application cards in
  **Заявки** reflect the application's pending state (mapped to `review`/«На рассмотрении»), to be confirmed against the
  reference frame.

### Non-Goals
- **No CLIENT dashboard** (compose-client-dashboard, #19); **no new routes** (`/gigs`, `/finances`, `/chats` — their own
  changes); **no data-model/server-action change**; **no shell change** (compose-shell-cutover).
- **F1 ≤1% enforcement is deferred** — the diff is produced for review, but the ≤1%-vs-`specialist-dashboard` target is
  reached only once the **SF Compact font is licensed** and the **cosmic banner raster** is exported. F3/F5/functional/
  E2E are the enforced acceptance.

## Success Criteria

1. SPECIALIST `/dashboard` body composes `BannerCard`+`Tabs`+`GigCard·grid`+`SearchPanel`+`MessagesPanel` (F5-pure `@composed-screen`).
2. Tabs are exactly **Все/Заявки/В работе/На проверке/Завершённые with live counts** (F3), mapped to applications + assigned-gig states.
3. Real data bound — completion %, applications + assigned gigs (correctly mapped `GigCardVM`s), messages; `SearchPanel` implemented + exported.
4. Gig links (`GigCard` → `/gigs/[id]`) and the find-project flow (`SearchPanel` → `/gigs?q=…`) work; tabs filter by `tabKey`.
5. CLIENT branch + unknown-role fallback untouched; no-session redirect preserved; the bespoke SPECIALIST markup/`SpecialistDashboardTabs`/overlay removed.
6. `build`, `test:unit` (~865 green), SPECIALIST dashboard E2E, `lint:composition`, `lint:tokens` all green; F1 diff produced (≤1% deferred to font + banner raster).

## Affected Areas

- `app/(protected)/dashboard/page.tsx` (SPECIALIST branch → `getSpecialistDashboard` + `<SpecialistDashboard>`; CLIENT branch + unknown-role fallback unchanged)
- `app/(protected)/dashboard/SpecialistDashboard.tsx` (new — `'use client'` `@composed-screen`)
- `app/(protected)/dashboard/SpecialistDashboardTabs.tsx` (removed — superseded by the composed `Tabs` + `GigCard·grid`)
- `app/components/blocks/SearchPanel.tsx` (new block) + `app/components/blocks/index.ts` (export) + `fixtures.ts` (fixture)
- `lib/view-models.ts` (extend — `getSpecialistDashboard` + `SpecialistGigCard`/`SpecialistDashboardData`, reusing `toGigCardVM`)
- `__tests__/e2e/compose-specialist-dashboard.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests)
- read-only inputs: the blocks (`BannerCard`/`GigCard`/`MessagesPanel`/`Tabs`), the `SearchInput` primitive, `lib/reviews` (`getRatingForUser`), `lib/categories`, `app/actions/message` (`getRecentMessages`), `screens/specialist-dashboard.jpg` (F1 reference)
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements to the `ui` domain, on archive)
- (NOT modified: the CLIENT dashboard branch; data models / server actions; the shell; the block view-model contracts)

## Risks & Mitigations

**Risk**: The SPECIALIST dashboard unifies **two** data sources (applications + assigned gigs) into one `GigCard` grid — more complex than the CLIENT single-source mapper.
**Mitigation**: `getSpecialistDashboard` fetches both, maps each through the **existing `toGigCardVM`**, and tags each card with a `tabKey`; the screen filters by `tabKey`. Counts derive from the same tagged set. Unit-tested across all five tabs.

**Risk**: `GigCard`/`Tabs`/`SearchPanel` are presentational (callbacks `onOpen`/`onSelect`/`onSubmit`) — gig links, tab switching, and search need client wiring.
**Mitigation**: `SpecialistDashboard` is a `'use client'` `@composed-screen` (allowed: react/next/hooks; no className/style) — `useState` for the active tab, `router.push` for `onOpen` and `SearchPanel` submit. Same pattern proven by `ClientDashboard` + the shell cutover.

**Risk**: Replacing the bespoke SPECIALIST dashboard + `SpecialistDashboardTabs` breaks tests asserting the old markup (English tab labels "Active Work"/"Pending Applications"/"Archive", welcome text, `ProfileCompletionCard`).
**Mitigation**: Map old assertions to the composed blocks (RU tab labels + counts, `GigCard`, `SearchPanel`); preserve gig links + the find-project flow (the behavioural contract). Run the full suite + a new E2E. The CLIENT branch is untouched.

**Risk**: `SearchPanel` doesn't exist — composing it would fail.
**Mitigation**: Implement it as a small token-pure block over the `SearchInput` primitive (+ a "Найти проект" action → `/gigs`) with a fixture + barrel export — a system-gap fill recorded in the spec, mirroring `CreateGigCTA`.

**Risk**: F1 ≤1% won't pass against `specialist-dashboard`.
**Mitigation**: Documented + accepted (per compose-shell-cutover / compose-client-dashboard): the residual is the substitute font + the unexported cosmic banner raster (BannerCard `art`) — not a composition defect. The diff + 50%-overlay are produced for review; ≤1% is reached once the font is licensed and the raster exported.

**Risk**: Mapping rejected/withdrawn applications and the application-vs-gig status of PENDING cards is ambiguous.
**Mitigation**: Record the reconciliation in the spec — rejected/withdrawn surface only under **Все** (`status: 'rejected'`); PENDING-application cards reflect the application's pending state (`review`/«На рассмотрении»). The implementer confirms the chip choice against `specialist-dashboard.jpg`; no data is lost and the five primary tabs match the design.
