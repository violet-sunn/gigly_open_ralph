# Spec delta — disputes (reconcile-disputes-flow)

Reconciles the dispute **UI** to the `gigly_full_design` prototype: a dedicated **«Открыть спор»** screen (reason enum +
description), the dispute **timeline** + evidence + frozen amount in the detail, and the admin **verdict** resolve UI.
The `openDispute` / `resolveDispute` actions (incl. the verdict map, the `ModerationLog` write, and the timeline entries)
are reused verbatim. Token-pure (F2) + composition-pure (F5).

## ADDED Requirements

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
and a **moderator** timeline entry MUST be appended.

#### Scenario: An admin resolves with a verdict
- GIVEN an ADMIN viewing an OPEN dispute
- WHEN they pick a verdict (e.g. specialist) + a note and submit
- THEN the dispute MUST become RESOLVED, its resolution MUST be prefixed «В пользу специалиста — …», a `ModerationLog`
  entry MUST be created, and a moderator timeline entry MUST be appended

#### Scenario: Non-admins do not see the resolve panel
- GIVEN a specialist or company participant viewing the dispute
- THEN the verdict/resolve panel MUST NOT be shown (read-only detail only)

### Requirement: Disputes Flow Reconciliation Keeps the Suite Green
The change MUST add/update the E2E + integration + block-render tests and keep the build, token-purity, composition, and
unit/E2E suites green.

#### Scenario: Tests green
- GIVEN `reconcile-disputes-flow.spec.ts`, `disputes-flow.test.ts` (verdict), `domain-blocks.test.tsx`
- WHEN they run
- THEN they MUST assert the open-via-`/disputes/new` flow (reason + description), the detail timeline/evidence/amount
  render, and the admin verdict resolve (→ RESOLVED + moderation log + moderator timeline entry)
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- `/disputes/new?gig=<id>` (participant-gated): «Открыть спор» + reason `CheckField` (6 enum values) + description `Textarea` → `openDispute`; gig-detail links to it; F5-pure
- `DisputeDetail` renders the frozen amount + parties + evidence + the role-labelled timeline (render-only; VM unchanged)
- admin resolve panel adds the verdict `CheckField` (specialist/company/split_50) → `resolveDispute` → RESOLVED + resolution carries «В пользу …» + `ModerationLog` + moderator timeline entry
- `openDispute` / `resolveDispute` reused verbatim (no action/lifecycle/moderation-log changes)
- F2 + F5 lints green; `build` + `test:unit` (open→resolve lifecycle) + `reconcile-disputes-flow` E2E green; F1 = structural vs the prototype dispute frames (≤1% deferred to Phase 4)
