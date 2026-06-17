# Disputes Specification Delta: disputes-flow

This document contains specification changes for the `disputes-flow` change — a Phase-1 **data** change introducing
the new `disputes` domain over the existing `ModerationLog`. It fulfills the `DisputeList` / `DisputeDetail`
view-model contracts (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `DisputeListVM`) with a `Dispute` model, an open-dispute
action (participants), an admin resolve + audit action, contract-typed query helpers, and the `DisputeListVM`
transcription. It ships **a model + relations + two actions + helpers + a type-only VM + FK-safe reset + seed + tests
only** — additive, with the existing admin moderation **unaffected** and **no UI wiring** (Phase 2 binds the Споры
screen).

---

## ADDED Requirements

### Requirement: Dispute Model Linked to ModerationLog
The schema MUST add a `Dispute` model linked to `ModerationLog` (the resolution audit), additively, fulfilling the
`DisputeList`/`DisputeDetail` contract.

#### Scenario: Dispute model exists with the moderation link
- GIVEN the schema
- WHEN the `Dispute` model is inspected
- THEN it MUST have `id`, `gigId` (→ `Gig`), `openerId` (→ `User`), `reason`, `status` (default `OPEN`), `resolution`
  (default `""`), `resolvedById?` (→ `User`), `resolutionLogId?` `@unique` (→ `ModerationLog`), timestamps, and
  `@@unique([gigId, openerId])`
- AND back-relations MUST be added to `Gig` (`disputes`), `User` (`disputesOpened`/`disputesResolved`), and
  `ModerationLog` (`resolvedDispute`) — additive (no column added to those tables); `npx prisma generate` MUST be run

#### Scenario: Additive — existing moderation unaffected
- GIVEN the schema diff
- WHEN inspected
- THEN only the new `Dispute` model + the back-relations are added (no existing column changed), and the existing
  moderation actions (`suspendUser`/`unsuspendUser`/`closeGig`) and `ModerationLog` usage MUST be unchanged

**Acceptance Criteria:**
- `Dispute` model (linked to `ModerationLog` via `resolutionLogId`); back-relations on `Gig`/`User`/`ModerationLog`; additive; client regenerated
- Existing moderation behaviour unaffected

---

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

---

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

---

### Requirement: Dispute Contract, Status to Participants, and Verification
Query helpers MUST fulfil the `DisputeList` contract, participants MUST see their disputes' status, the `DisputeListVM`
MUST be materialized, and the suite MUST stay green with FK-safe isolation.

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

---

## Test Plan

This change ships a model + relations + two actions + helpers + a type-only VM + FK-safe reset + seed + tests.
Validation is by deterministic commands. Commands assume the repo root.

### Schema + helpers + VM + client
```bash
grep -qE 'model Dispute' prisma/schema.prisma && grep -qE 'resolutionLogId +String\? +@unique' prisma/schema.prisma && echo "Dispute model + ModerationLog link"
grep -qE 'resolvedDispute +Dispute\?' prisma/schema.prisma && echo "ModerationLog back-relation (additive)"
grep -qE 'DisputeListVM' app/components/blocks/view-models.ts && echo "DisputeListVM materialized"
test -f lib/disputes.ts && grep -qE 'import type .*DisputeListVM' lib/disputes.ts && grep -qE 'getDisputeList|getDisputeDetail' lib/disputes.ts && echo "helpers contract-typed"
test -f app/actions/dispute.ts && grep -qE 'openDispute' app/actions/dispute.ts && grep -qE 'resolveDispute' app/actions/dispute.ts && echo "actions present"
npx prisma generate >/dev/null 2>&1 && echo "client regenerated"
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK schema deletions" || echo "OK schema additive"
```

### Resolve writes the audit; admin gate
```bash
grep -qE "action: 'RESOLVE_DISPUTE'" app/actions/dispute.ts && grep -qE 'resolutionLogId' app/actions/dispute.ts && echo "resolve writes + links ModerationLog audit"
grep -qE "role !== 'ADMIN'" app/actions/dispute.ts && echo "resolve admin-gated"
```

### Tests (open / resolve / authorization / audit / status / contract / moderation-unaffected)
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/disputes-flow.test.ts 2>&1 | tail -14
```

### Seed (idempotent) + FK-safe reset
```bash
grep -qiE 'dispute' prisma/seed.ts && echo "seed opens sample disputes"
grep -qE 'prisma.dispute.deleteMany' __tests__/helpers/db.ts && echo "FK-safe dispute cleanup"
```

### Typecheck + build + suite + scope (additive, moderation/UI unchanged)
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/disputes|app/actions/dispute|view-models|disputes-flow.test" && echo "CHECK type error" || echo "OK new/changed files type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff app/actions/moderation.ts | grep -E '^[-+]' | grep -vE '^(---|\+\+\+)' && echo "CHECK moderation changed" || echo "OK moderation actions unchanged"
git status --porcelain | grep -E 'app/workbench/|app/\(protected\)/' && echo "CHECK UI screen modified" || echo "OK no UI screen changes"
```

### Manual review
1. Confirm `Dispute` is additive, linked to `ModerationLog` (`resolutionLogId`), client regenerated; `ModerationLog`'s columns/behaviour unchanged.
2. Confirm `openDispute` (participant-only, reason, one-per-gig-per-opener, assigned specialist) and `resolveDispute` (admin-only, audit) behave per the scenarios.
3. Confirm `getDisputeList` matches `DisputeListVM` (status mapped) and participants can see their disputes' status.
4. Confirm the existing moderation actions/tests are unaffected and no screen is wired yet (Phase 2).
