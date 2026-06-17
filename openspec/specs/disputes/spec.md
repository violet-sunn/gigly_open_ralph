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
