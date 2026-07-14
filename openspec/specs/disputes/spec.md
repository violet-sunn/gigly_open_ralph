# Disputes Specification

This domain provides a dispute flow over the existing `ModerationLog`, fulfilling the `DisputeList` / `DisputeDetail`
view-model contracts (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `DisputeListVM`). A participant (a gig's client or assigned
specialist) opens a dispute; an admin resolves it, writing a linked `ModerationLog` audit entry; participants can see
their disputes' status. It is additive — the existing admin moderation (suspend/close/logs) is **unaffected**.

## Requirements

### Requirement: Dispute Model Linked to ModerationLog
The schema MUST provide a `Dispute` model linked to `ModerationLog` (the resolution audit), additively.

#### Scenario: Dispute model exists with the moderation link
- GIVEN the schema
- WHEN the `Dispute` model is inspected
- THEN it MUST have `id`, `gigId` (→ `Gig`), `openerId` (→ `User`), `reason`, `status` (default `OPEN`), `resolution`
  (default `""`), `resolvedById?` (→ `User`), `resolutionLogId?` `@unique` (→ `ModerationLog`), timestamps, and
  `@@unique([gigId, openerId])`
- AND back-relations MUST exist on `Gig` (`disputes`), `User` (`disputesOpened`/`disputesResolved`), and
  `ModerationLog` (`resolvedDispute`) — additive (no column added to those tables)

#### Scenario: Additive — existing moderation unaffected
- GIVEN the schema
- WHEN the moderation actions (`suspendUser`/`unsuspendUser`/`closeGig`) and `ModerationLog` usage are exercised
- THEN they MUST be unchanged (only the new `Dispute` model + back-relations are added)

**Acceptance Criteria:**
- `Dispute` model (linked to `ModerationLog` via `resolutionLogId`); back-relations on `Gig`/`User`/`ModerationLog`; additive
- Existing moderation behaviour unaffected

### Requirement: Open Dispute (participants)
`openDispute` MUST let a participant (the gig's client or assigned specialist) open a dispute on a gig, with
validation.

#### Scenario: A participant opens a dispute
- GIVEN an authenticated user who is the gig's client or assigned specialist, on a gig with an assigned specialist
- WHEN `openDispute` is called with a non-empty `reason`
- THEN a `Dispute` MUST be created with `status = 'OPEN'`, the `openerId` = the user, and the `reason`

#### Scenario: Non-participants and invalid input are rejected
- GIVEN `openDispute`
- WHEN the caller is not the gig's client or assigned specialist, OR the `reason` is empty, OR the gig has no assigned
  specialist, OR it is an example gig, OR the user already has a dispute on that gig
- THEN it MUST be rejected with a clear error and no dispute created (unauthenticated → `/login`)

**Acceptance Criteria:**
- `openDispute` creates an `OPEN` dispute for a participant with a required reason
- Non-participant / empty reason / no assigned specialist / example gig / duplicate → error; no dispute created

### Requirement: Resolve Dispute with Audit (admin)
`resolveDispute` MUST be admin-only and resolve an `OPEN` dispute while writing a linked `ModerationLog` audit entry,
in a transaction.

#### Scenario: An admin resolves a dispute and writes the audit
- GIVEN an authenticated ADMIN and an `OPEN` dispute
- WHEN `resolveDispute` is called with a status (`RESOLVED` or `REJECTED`) and a required `resolution`
- THEN the dispute MUST be updated (`status`, `resolution`, `resolvedById` = the admin) AND a `ModerationLog` entry
  MUST be created (`action: 'RESOLVE_DISPUTE'`, `reason`: the resolution, `adminId`, `targetGigId`, `targetUserId`:
  the opener), with `Dispute.resolutionLogId` set to that log's id — all in one transaction

#### Scenario: Only admins resolve; already-resolved is rejected
- GIVEN `resolveDispute`
- WHEN the caller is not an ADMIN, OR the dispute is not `OPEN`, OR the `resolution` is empty
- THEN it MUST be rejected with a clear error and no change (unauthenticated → `/login`)

**Acceptance Criteria:**
- `resolveDispute` (admin-only) resolves an `OPEN` dispute and writes a linked `ModerationLog` audit (`RESOLVE_DISPUTE`) in a transaction
- Non-admin / non-open / empty resolution → error; `Dispute.resolutionLogId` links the audit entry

### Requirement: Dispute Contract, Status to Participants, and Verification
Query helpers MUST fulfil the `DisputeList` contract, participants MUST see their disputes' status, the `DisputeListVM`
MUST be materialized, and the change MUST be additive with FK-safe test isolation.

#### Scenario: getDisputeList fulfils the DisputeListVM contract
- GIVEN `lib/disputes.ts`
- WHEN `getDisputeList(opts?)` is called
- THEN it MUST return `DisputeListVM` — `{ disputes: { id, gig (title), status (design `Status`), opener (name) }[] }`
  — with the dispute status mapped (`OPEN→open`, `RESOLVED→completed`, `REJECTED→rejected`); assignable to
  `DisputeListVM`; `DisputeListVM` imported `import type` (no runtime UI coupling)

#### Scenario: DisputeListVM is materialized in the SSOT
- GIVEN `app/components/blocks/view-models.ts`
- WHEN inspected
- THEN it MUST export `DisputeListVM { disputes: { id: string; gig: string; status: Status; opener: string }[] }`
  (verbatim §5), type-only

#### Scenario: Status is visible to participants
- GIVEN a participant (opener) of a dispute
- WHEN `getDisputeList` scoped to that participant is called (before and after resolution)
- THEN it MUST return their dispute with the current status (`open`, then `completed`/`rejected` after resolution),
  and `getDisputeDetail(id)` MUST return the dispute's detail (gig, opener, reason, status, resolution)

#### Scenario: Additive — suite green, FK-safe reset, moderation unaffected
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with the existing moderation tests unaffected; `resetTestDatabase` MUST delete `dispute`
  FK-safely (before `moderationLog`/`gig`/`user`); `npm run lint:tokens` + `npm run lint:composition` MUST stay green

**Acceptance Criteria:**
- `getDisputeList` ⇒ `DisputeListVM` (status mapped); `getDisputeDetail` returns detail; participants see status; `DisputeListVM` materialized
- FK-safe reset (`dispute` first); existing moderation unaffected; `npm run build` + `npm run test:unit` + lints green

## Reconciled UI Requirements (reconcile-disputes-flow, 2026-06-20)

### Requirement: Dedicated «Открыть спор» Screen
The application MUST provide a dedicated open-dispute screen at `/disputes/new?gig=<gigId>`, a composition-pure
`@composed-screen` inside `AppShell`, available to a **participant** of the gig (the owner or the assigned specialist). A
non-participant MUST be redirected (to the gig or the disputes list). The screen MUST render a `SectionHeader` «Открыть
спор» with the gig context, a **reason** selector (`CheckField`) offering the six `DisputeReason` enum values, and a
**description** field (`Textarea`), wired to the existing `openDispute` action. It MUST be token-pure (F2) and
composition-pure (F5); all on-screen text MUST be Russian.

#### Scenario: A participant opens a dispute with a reason + description
- GIVEN a participant of an assigned gig on `/disputes/new?gig=<id>`
- WHEN they pick a reason (one of the six enum values) + type a description and submit
- THEN `openDispute` MUST create the dispute (with the frozen amount, the openerRole, the reason enum, and the opening
  timeline entry from the description)
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: Non-participants are redirected
- GIVEN a non-participant (or unauthenticated visitor)
- WHEN they request `/disputes/new?gig=<id>`
- THEN they MUST be redirected away and MUST NOT see the open-dispute form

#### Scenario: gig-detail links to the open-dispute screen
- GIVEN a participant on `/gigs/[id]` once a specialist is assigned
- THEN gig-detail MUST show a «Открыть спор» link to `/disputes/new?gig=<id>` (replacing the prior inline free-text form)

### Requirement: Dispute Detail Renders Amount, Parties, Evidence, and Timeline
The `DisputeDetail` block MUST render — in addition to the gig + status + opener + reason + resolution — the **frozen
amount**, the **opener role** (party), the **evidence** list (when present), and the **timeline** of `DisputeEntry`
items, each showing the author (role-labelled Специалист / Заказчик / Модератор) + the text + the date. This is
render-only: `getDisputeDetail` already supplies `amount`, `openerRole`, `evidence[]`, and `timeline[]`.

#### Scenario: The detail shows the timeline and evidence
- GIVEN a dispute with a multi-entry timeline and evidence
- WHEN `DisputeDetail` renders
- THEN it MUST show the frozen amount, the evidence file names, and each timeline entry (author + role + text + date) in
  order

### Requirement: Admin Verdict Resolve UI
The admin resolve panel on `/disputes/[id]` (shown only to ADMIN for an OPEN dispute) MUST present a **verdict** selector
(`CheckField`) with the three options — **в пользу специалиста** / **в пользу заказчика** / **частичный возврат 50%** —
alongside the status + resolution note, submitted as `verdict` to the existing `resolveDispute`. On resolve the dispute
MUST become RESOLVED (or REJECTED), the resolution MUST carry the verdict text, a `ModerationLog` entry MUST be written,
and a **moderator** timeline entry MUST be appended. The resolve panel stays inline on `/disputes/[id]` (admin-gated) —
the prototype's admin-only «РЕШЕНИЕ СПОРА» content — not a separate route.

#### Scenario: An admin resolves with a verdict
- GIVEN an ADMIN viewing an OPEN dispute
- WHEN they pick a verdict (e.g. specialist) + a note and submit
- THEN the dispute MUST become RESOLVED, its resolution MUST be prefixed «В пользу специалиста — …», a `ModerationLog`
  entry MUST be created, and a moderator timeline entry MUST be appended

#### Scenario: Non-admins do not see the resolve panel
- GIVEN a specialist or company participant viewing the dispute
- THEN the verdict/resolve panel MUST NOT be shown (read-only detail only)

**Acceptance Criteria:**
- `/disputes/new?gig=<id>` (participant-gated): «Открыть спор» + reason `CheckField` (6 enum values) + description `Textarea` → `openDispute`; gig-detail links to it; F5-pure
- `DisputeDetail` renders the frozen amount + parties + evidence + the role-labelled timeline (render-only; VM unchanged)
- admin resolve panel adds the verdict `CheckField` (specialist/company/split_50) → `resolveDispute` → RESOLVED + resolution carries «В пользу …» + `ModerationLog` + moderator timeline entry (inline, not a separate route)
- `openDispute` / `resolveDispute` reused verbatim; F2 + F5 lints + `build` + `test:unit` + `reconcile-disputes-flow` E2E green; F1 = structural (≤1% Phase 4)
- Reconciliation decisions recorded (§10.18 / RC-S31–S33)

## Gig-Detail Dispute CTA (dispute-cta-button, 2026-07-14)

### Requirement: Gig-Detail «Открыть спор» CTA Is a Legible, Comfortably-Sized Control
On the gig-detail screen (`/gigs/[id]`), when the dispute entry point is shown to a participant (the
gig's owner/client or the assigned specialist on an `IN_PROGRESS`/`REVIEW` gig, per the existing
`showDisputeLink` gate), the «Открыть спор» control MUST present as a clearly clickable, legible control —
a real button/link affordance, not muted caption text. It MUST:
- have an adequate interactive target (≥ ~44px tall),
- have a visible boundary or button chrome (a border or a filled/tinted surface, distinct from the page
  background),
- render the «Открыть спор» CTA text at sufficient contrast that it reads as actionable (NOT the
  disabled-looking muted-grey `var(--text-3)` caption tone),
- keep the ⚖ cue and the «Возникли разногласия?» lead-in, and
- keep the prototype's inline-styled token design language (Handjet/Manrope + fig-tokens) — no Tailwind
  `className`, kit-component import, or raw hard-coded palette drift beyond the existing inline-style idiom.

The control MUST preserve the existing behavior: activating it navigates to `/disputes/new?gig=<gigId>`
via `router.push`, and it is shown/hidden by the unchanged `showDisputeLink` gate.

#### Scenario: The assigned specialist sees an obvious dispute button
- GIVEN an `IN_PROGRESS` (or `REVIEW`) gig with an assigned specialist
- WHEN the assigned specialist views the gig-detail screen
- THEN they MUST see an «Открыть спор» control that reads as a button (visible boundary/chrome), is
  comfortably sized (≥ ~44px interactive height), and shows the CTA text at actionable contrast (not the
  muted-grey caption tone), with the ⚖ cue and the «Возникли разногласия?» lead-in retained

#### Scenario: The owning client sees the same obvious dispute button
- GIVEN an `IN_PROGRESS` (or `REVIEW`) gig they own
- WHEN the owning client views the gig-detail screen
- THEN they MUST see the same obvious, comfortably-sized «Открыть спор» control

#### Scenario: Activating the CTA opens the new-dispute flow for that gig
- GIVEN a participant viewing the «Открыть спор» control on gig `<gigId>`
- WHEN they click/tap it
- THEN the app MUST navigate to `/disputes/new?gig=<gigId>` (behavior unchanged from the prior inline link)

#### Scenario: The gate is unchanged
- GIVEN a gig where the dispute entry point should not show (e.g. no assigned specialist, or a
  non-participant viewer, or a status outside `IN_PROGRESS`/`REVIEW`)
- WHEN the gig-detail screen renders
- THEN the «Открыть спор» control MUST NOT appear (the `showDisputeLink` gate is preserved verbatim)

**Acceptance Criteria:**
- The gig-detail «Открыть спор» control renders as a real button/link affordance: ≥ ~44px target,
  visible boundary/chrome, actionable-contrast CTA text (not `var(--text-3)` muted grey)
- The ⚖ cue and «Возникли разногласия?» lead-in are retained; inline-styled token language preserved
  (no `className`/kit import)
- `router.push('/disputes/new?gig=<id>')` navigation and the `showDisputeLink` gate are unchanged
- Verified live: on an `IN_PROGRESS`/`REVIEW` gig, both the assigned specialist and the owning client see
  an obvious, comfortably-sized button that opens the new-dispute flow for that gig
- Implementation: `disputeBtn` inline-style builder in `app/(protected)/gigs/[id]/GigDetail.tsx`
  (`minHeight: 44`, `1px solid rgba(245,158,11,0.45)` border, `rgba(245,158,11,0.10)` surface); measured
  live at 47px tall, CTA colour `rgb(245,158,11)`
