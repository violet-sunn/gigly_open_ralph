# Change Proposal: disputes-flow

> Phase 1, change 16 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> fulfills the `DisputeList` / `DisputeDetail` view-model contracts (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `DisputeListVM`)
> with a new **`Dispute`** model over the existing `ModerationLog`, an **open-dispute** action (participants), an
> **admin resolve + audit** action (writes a `ModerationLog` entry), and status visibility to participants. Additive;
> the existing admin moderation (suspend/close/logs) is **unaffected**; **no UI wiring** (Phase 2 binds the Споры
> screen).

## Problem Statement

`DisputeListVM { disputes: { id, gig, status, opener }[] }` describes the Споры (`/disputes`) screen — a list of
disputes with status, plus a detail view (`DisputeDetail` = Panel + ClientCard + actions). Today there is **no dispute
concept at all**:

- The schema has `ModerationLog` (admin actions: suspend user, close gig) but **no `Dispute`** — a participant cannot
  raise a dispute on a gig, and an admin has no dispute to resolve.
- `DisputeListVM` is declared in `DESIGN_SYSTEM_SPEC.md` §5 but is **not yet present in
  `app/components/blocks/view-models.ts`** (which ends at `LedgerTableVM`), so there is no typed contract in code for a
  disputes helper to fulfil.
- Phase-2's Споры screen (`compose-disputes`: AppShell + DisputeList + DisputeDetail) has **nothing real to bind** —
  the blocks would stay mocked.

The planning doc maps this exactly: a `Dispute` model linked to `ModerationLog`, an open-dispute action, admin resolve
+ audit, and status to participants — *fulfilling* the `DisputeList`/`DisputeDetail` contract, **building on**
`ModerationLog` (the audit substrate). This change is additive and decoupled from the UI (the blocks already type the
shape).

## Proposed Solution

Add a `Dispute` model linked to `ModerationLog`, an open-dispute action for participants, an admin resolve action that
writes the audit, contract-typed query helpers, the `DisputeListVM` transcription, FK-safe test cleanup, seed, and
verification. Six deliverable groups:

1. **`Dispute` model linked to `ModerationLog`** — `Dispute { id, gigId→Gig, openerId→User, reason, status
   ('OPEN'|'RESOLVED'|'REJECTED', default 'OPEN'), resolution (default ''), resolvedById?→User, resolutionLogId?
   @unique → ModerationLog, timestamps }`, `@@unique([gigId, openerId])` (one dispute per participant per gig). The
   **link to `ModerationLog`** is the `resolutionLog` relation — the audit entry written when an admin resolves.
   Back-relations are added to `Gig` (`disputes`), `User` (`disputesOpened`/`disputesResolved`), and `ModerationLog`
   (`resolvedDispute`) — **all additive** (the FK columns live on `Dispute`; no column is added to those tables, no
   moderation behaviour changes).

2. **`openDispute` action (participants)** — in `app/actions/dispute.ts`: a participant (the gig's **client** or
   **assigned specialist**) opens a dispute on a gig with a `reason`. Validates: participant-only, the gig has an
   assigned specialist (a two-party engagement), `reason` required, not an example gig, and one dispute per
   `[gigId, openerId]`. Creates the `Dispute` (status `OPEN`) and notifies the other participant (fire-and-forget).

3. **`resolveDispute` action (admin resolve + audit)** — admin-only (mirrors `app/actions/moderation.ts`): resolves an
   `OPEN` dispute to `RESOLVED` (or `REJECTED`) with a required `resolution` note. In an **interactive transaction**:
   creates a `ModerationLog` entry (`action: 'RESOLVE_DISPUTE'`, `reason`: resolution, `adminId`, `targetGigId`,
   `targetUserId`: opener) — the **audit** — then updates the dispute (status, resolution, `resolvedById`,
   `resolutionLogId` = the log's id). Notifies participants (fire-and-forget).

4. **Query helpers (`lib/disputes.ts`, fulfil the contract)** — `getDisputeList(opts?)` → `DisputeListVM` (admin: all
   disputes; or scoped to a participant), mapping each dispute to `{ id, gig: gig.title, status: «design Status»,
   opener: «name» }` with the dispute status mapped to the design `Status` (`OPEN→open`, `RESOLVED→completed`,
   `REJECTED→rejected`); `getDisputeDetail(id)` → the dispute's detail data (gig, opener, reason, status, resolution,
   resolver) for the `DisputeDetail` block (which pairs it with a `ClientCard`). Server-only; `DisputeListVM` imported
   `import type` (no runtime UI coupling).

5. **`DisputeListVM` transcription** — add `DisputeListVM` to `view-models.ts`, transcribed verbatim from §5 (the
   `DateISO`/`Status` aliases already exist) — **type-only**, so the helper is contract-typed. Same precedent as
   `finances-ledger`'s `LedgerTableVM`.

6. **FK-safe reset + seed + tests** — `resetTestDatabase` deletes `dispute` **first** (before `moderationLog`/`gig`/
   `user`, which it references). `prisma/seed.ts` opens (and resolves one) sample dispute(s) idempotently.
   `__tests__/integration/disputes-flow.test.ts` covers open/resolve/authorization, the audit link, status to
   participants, the contract match, and that admin moderation is unaffected.

This change emits **a model + relations + two actions + query helpers + a `DisputeListVM` transcription + FK-safe
reset + seed + tests only**. It does **not** change the existing moderation actions (`suspendUser`/`unsuspendUser`/
`closeGig`) or their behaviour, alter `ModerationLog`'s columns, wire the Споры screen (Phase 2 `compose-disputes`),
or touch the gig lifecycle. The blocks already type the shape — this change makes disputes real.

## Constraints

### MUST Requirements
- A `Dispute` model MUST exist (`gigId`→Gig, `openerId`→User, `reason`, `status` default `OPEN`, `resolution` default
  `""`, `resolvedById?`→User, `resolutionLogId?` @unique → `ModerationLog`, `@@unique([gigId, openerId])`), additive;
  the client MUST be regenerated.
- `openDispute` MUST let a **participant** (the gig's client or assigned specialist) open a dispute with a required
  `reason`, enforcing participant-only + one-per-`[gigId, openerId]` + an assigned specialist exists; it MUST reject
  non-participants and missing reasons.
- `resolveDispute` MUST be **admin-only**, resolve an `OPEN` dispute (to `RESOLVED`/`REJECTED`) with a required
  `resolution`, and **write a `ModerationLog` audit entry** linked via `Dispute.resolutionLogId`, in a transaction.
- `getDisputeList` MUST return `DisputeListVM` (dispute status mapped to the design `Status`; `opener` a string);
  `getDisputeDetail` MUST return a dispute's detail; participants MUST be able to see their disputes' status.
- `DisputeListVM` MUST be present in `view-models.ts` (verbatim §5, type-only).
- The existing admin moderation (`suspendUser`/`unsuspendUser`/`closeGig`, `ModerationLog`) MUST be **unaffected**;
  `npm run build` and `npm run test:unit` MUST stay green; `npm run lint:tokens` + `npm run lint:composition` MUST
  stay green (no UI change beyond the type-only VM).

### SHOULD Requirements
- `resolveDispute` SHOULD mirror `app/actions/moderation.ts` (admin gate, `$transaction`, `ModerationLog.create`,
  `revalidatePath`); the `ModerationLog` audit SHOULD use `action: 'RESOLVE_DISPUTE'`, `reason`: the resolution,
  `targetGigId`, `targetUserId`: the opener.
- The dispute status SHOULD map to the design `Status` (`OPEN→open`, `RESOLVED→completed`, `REJECTED→rejected`) — all
  clean mappings (unlike `PAID`).
- Helpers SHOULD live in `lib/disputes.ts` with `DisputeListVM` imported `import type`, so Phase-2 `compose-disputes`
  imports from `@/lib/disputes`.
- `resetTestDatabase` SHOULD delete `dispute` **before** `moderationLog`/`gig`/`user` (FK-safe); status notifications
  to participants SHOULD be fire-and-forget (consistent with the existing notification pattern).

### Non-Goals
- **No UI wiring.** Composing the Споры screen (AppShell + DisputeList + DisputeDetail) is Phase 2
  (`compose-disputes`). The blocks already type the shape.
- **No change to existing moderation** — `suspendUser`/`unsuspendUser`/`closeGig` and `ModerationLog`'s columns/usage
  are untouched (the only `ModerationLog` change is an additive back-relation field).
- **No multi-round dispute thread / messaging within a dispute**, no appeal flow — a single open→resolve cycle fulfils
  the contract; richer flows are future additive changes.
- **No gig-lifecycle change** (a dispute does not auto-transition the gig); no other-domain changes.

## Success Criteria

1. `Dispute` model exists (linked to `ModerationLog` via `resolutionLogId`), additive; back-relations on `Gig`/`User`/`ModerationLog`; client regenerated.
2. `openDispute` (participant-only, reason required, one-per-gig-per-opener, assigned specialist required) creates an `OPEN` dispute; non-participants rejected.
3. `resolveDispute` (admin-only) resolves an `OPEN` dispute with a resolution and writes a linked `ModerationLog` audit entry, in a transaction; non-admins rejected.
4. `getDisputeList` ⇒ `DisputeListVM` (status mapped to the design `Status`); participants see their disputes' status; `DisputeListVM` materialized in `view-models.ts`.
5. Existing moderation unaffected; seed opens/resolves sample disputes idempotently; `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; no UI screen/component changes.

## Affected Areas

- `prisma/schema.prisma` (new `Dispute` model; back-relations on `Gig`/`User`/`ModerationLog`) → `npx prisma generate`
- `app/components/blocks/view-models.ts` (add `DisputeListVM` — verbatim §5, type-only)
- `app/actions/dispute.ts` (new — `openDispute`, `resolveDispute`)
- `lib/disputes.ts` (new — `getDisputeList`/`getDisputeDetail`, contract-typed; dispute→design Status mapper)
- `prisma/seed.ts` (open/resolve sample disputes, idempotent)
- `__tests__/helpers/db.ts` (`resetTestDatabase` — FK-safe `dispute` cleanup, first)
- `__tests__/integration/disputes-flow.test.ts` (new — open/resolve/authorization, audit link, status, contract, moderation-unaffected)
- read-only inputs: `app/components/blocks/view-models.ts` (`DisputeListVM`/`ClientCardVM`), `app/components/primitives/tokens.ts` (`Status`), `app/actions/moderation.ts` (admin pattern), `lib/notifications.ts` (`createNotification`)
- `openspec/specs/disputes/spec.md` (new domain spec delta)
- (NOT modified: existing moderation actions/behaviour; `ModerationLog` columns; the gig lifecycle; any UI screen/component; other domains)

## Risks & Mitigations

**Risk**: Linking `Dispute` to `ModerationLog` requires a back-relation on `ModerationLog` (the moderation model).
**Mitigation**: It is an **additive, type-only** Prisma back-relation (`resolvedDispute Dispute?`) — the FK column
(`resolutionLogId`) lives on `Dispute`, so `ModerationLog`'s table is unchanged and its existing behaviour
(suspend/close/log creation) is untouched. A test asserts the existing moderation actions still work.

**Risk**: The new `Dispute` table breaks the inter-test reset on FK constraints (as `Review`/`Category`/`WorkExperience` did).
**Mitigation**: Add `prisma.dispute.deleteMany()` to `resetTestDatabase` **first** — `Dispute` references
`ModerationLog`, `Gig`, and `User`, so deleting it before all of them is FK-safe.

**Risk**: `resolveDispute` must capture the created `ModerationLog`'s id to set `resolutionLogId`.
**Mitigation**: Use an **interactive** `$transaction(async (tx) => …)` — create the log, read its id, then update the
dispute with `resolutionLogId` — atomic, mirroring the moderation pattern but capturing the id.

**Risk**: `DisputeListVM.status` is the design `Status`, but a dispute's status is `OPEN`/`RESOLVED`/`REJECTED`.
**Mitigation**: A small mapper (`OPEN→open`, `RESOLVED→completed`, `REJECTED→rejected`) — all clean members of the
design `Status` enum (no missing mapping, unlike `PAID`). A test asserts the mapping.

**Risk**: Adding `DisputeListVM` touches the `view-models.ts` SSOT.
**Mitigation**: Type-only transcription of the existing §5 definition (the same precedent as `finances-ledger`'s
`LedgerTableVM`); no component, no runtime; the composition/token lints don't analyse type files.

**Risk**: Coupling the data layer to the UI by referencing `DisputeListVM`.
**Mitigation**: `import type` only (erased at build); the view-model is the SSOT for the shape; no runtime dependency
on the blocks tree — the established `lib/reviews.ts`/`lib/terms.ts`/`lib/finances.ts` pattern.
