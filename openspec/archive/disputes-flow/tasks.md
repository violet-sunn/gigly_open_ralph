# Implementation Tasks: disputes-flow

> **Phase-1 data change.** Fulfill the `DisputeList`/`DisputeDetail` contract with a `Dispute` model linked to
> `ModerationLog`, an `openDispute` action (participants), a `resolveDispute` action (admin + audit), contract-typed
> helpers, the `DisputeListVM` transcription, FK-safe reset, seed, and tests. Additive; existing admin moderation
> **unaffected**; **no UI wiring** (Phase 2 binds it). Mirror `app/actions/moderation.ts` (admin gate + `$transaction`
> + `ModerationLog.create`) + `lib/reviews.ts`/`lib/finances.ts`. Friction: medium.

---

## Task 1: [x] `Dispute` model + relations + regenerate client

**Implementation Notes:**
- Add to `prisma/schema.prisma`:
  ```prisma
  model Dispute {
    id              String         @id @default(cuid())
    gigId           String
    gig             Gig            @relation(fields: [gigId], references: [id])
    openerId        String
    opener          User           @relation("DisputesOpened", fields: [openerId], references: [id])
    reason          String
    status          String         @default("OPEN") // OPEN | RESOLVED | REJECTED
    resolution      String         @default("")
    resolvedById    String?
    resolvedBy      User?          @relation("DisputesResolved", fields: [resolvedById], references: [id])
    resolutionLogId String?        @unique
    resolutionLog   ModerationLog? @relation(fields: [resolutionLogId], references: [id])
    createdAt       DateTime       @default(now())
    updatedAt       DateTime       @updatedAt

    @@unique([gigId, openerId])
    @@index([status])
    @@index([gigId])
  }
  ```
  Add back-relations (additive — no columns on those tables): `Gig` → `disputes Dispute[]`; `User` →
  `disputesOpened Dispute[] @relation("DisputesOpened")` and `disputesResolved Dispute[] @relation("DisputesResolved")`;
  `ModerationLog` → `resolvedDispute Dispute?`.
- Run `npx prisma generate`. Additive — change no existing column.

**Test Plan:**
```bash
grep -qE 'model Dispute' prisma/schema.prisma && grep -qE 'resolutionLogId +String\? +@unique' prisma/schema.prisma && echo "OK Dispute + link"
grep -qE 'resolvedDispute +Dispute\?' prisma/schema.prisma && grep -qE 'disputesOpened|disputesResolved' prisma/schema.prisma && echo "OK back-relations"
npx prisma generate 2>&1 | tail -1
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK deletions" || echo "OK additive"
```
Expected: additive `Dispute` model linked to `ModerationLog` + back-relations; client regenerated.

---

## Task 2: [x] Materialize `DisputeListVM` in the view-model SSOT

**Implementation Notes:**
- In `app/components/blocks/view-models.ts`, add (verbatim from §5, reusing the existing `Status` alias). Place near
  `LedgerTableVM`:
  ```ts
  export interface DisputeListVM {
    disputes: { id: string; gig: string; status: Status; opener: string }[];
  }
  ```
  **Type-only** — no component, no runtime.

**Test Plan:**
```bash
grep -qE 'interface DisputeListVM' app/components/blocks/view-models.ts && echo "DisputeListVM present"
```
Expected: `DisputeListVM` materialized (verbatim §5), type-only.

---

## Task 3: [x] `lib/disputes.ts` — `getDisputeList` + `getDisputeDetail` (contract-typed)

**Implementation Notes:**
- Create `lib/disputes.ts` (server-only):
  ```ts
  import { prisma } from '@/lib/prisma'
  import type { DisputeListVM } from '@/app/components/blocks/view-models'
  import type { Status } from '@/app/components/primitives'

  // Dispute status → design Status (all clean mappings)
  const STATUS_MAP: Record<string, Status> = { OPEN: 'open', RESOLVED: 'completed', REJECTED: 'rejected' }
  const toDesignStatus = (s: string): Status => STATUS_MAP[s] ?? 'open'
  const openerName = (u: { specialistProfile?: { displayName: string } | null; clientProfile?: { companyName: string } | null; email: string }) =>
    u.specialistProfile?.displayName || u.clientProfile?.companyName || u.email

  // Admin: all disputes. Scoped: disputes where the user is the opener OR the gig's client/assigned specialist.
  export async function getDisputeList(opts?: { status?: string; participantId?: string }): Promise<DisputeListVM> {
    const where: any = {}
    if (opts?.status) where.status = opts.status
    if (opts?.participantId) {
      where.OR = [
        { openerId: opts.participantId },
        { gig: { clientId: opts.participantId } },
        { gig: { assignedSpecialistId: opts.participantId } },
      ]
    }
    const rows = await prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { gig: true, opener: { include: { specialistProfile: true, clientProfile: true } } },
    })
    return {
      disputes: rows.map((d) => ({
        id: d.id,
        gig: d.gig?.title ?? '',
        status: toDesignStatus(d.status),
        opener: openerName(d.opener),
      })),
    }
  }

  export async function getDisputeDetail(id: string) {
    const d = await prisma.dispute.findUnique({
      where: { id },
      include: {
        gig: true,
        opener: { include: { specialistProfile: true, clientProfile: true } },
        resolvedBy: true,
        resolutionLog: true,
      },
    })
    if (!d) return null
    return {
      id: d.id,
      gig: d.gig?.title ?? '',
      opener: openerName(d.opener),
      reason: d.reason,
      status: toDesignStatus(d.status),
      resolution: d.resolution,
      resolvedBy: d.resolvedBy?.email ?? null,
    }
  }
  ```
  `import type` (erased at build) → contract-typed with no runtime UI coupling. `getDisputeDetail` returns a lib-local
  detail shape (§5 has no `DisputeDetailVM`; the block pairs it with a `ClientCard`).

**Test Plan:**
```bash
test -f lib/disputes.ts && grep -qE 'import type .*DisputeListVM' lib/disputes.ts && echo "contract-typed"
grep -qE 'getDisputeList' lib/disputes.ts && grep -qE 'getDisputeDetail' lib/disputes.ts && echo "both helpers"
grep -qE "OPEN: 'open'.*RESOLVED: 'completed'.*REJECTED: 'rejected'|RESOLVED: 'completed'" lib/disputes.ts && echo "status mapper"
```
Expected: read-only `getDisputeList` ⇒ `DisputeListVM` (status mapped) + `getDisputeDetail`; contract-typed.

---

## Task 4: [x] `app/actions/dispute.ts` — `openDispute` + `resolveDispute`

**Implementation Notes:**
- Create `app/actions/dispute.ts` (`'use server'`; import `redirect`, `revalidatePath`, `prisma`, `getSession`,
  `sanitizeInput`, `createNotification`):
  ```ts
  export async function openDispute(prevState, formData) {
    const session = await getSession(); if (!session) redirect('/login')
    const gigId = formData.get('gigId') as string
    const reason = sanitizeInput((formData.get('reason') as string) || '').trim()
    if (!reason) return { error: 'A reason is required to open a dispute.' }
    const gig = await prisma.gig.findUnique({ where: { id: gigId } })
    if (!gig) return { error: 'This gig no longer exists or has been removed.' }
    if (gig.isExample) return { error: 'Cannot open a dispute on an example gig.' }
    if (!gig.assignedSpecialistId) return { error: 'A dispute can only be opened once a specialist is assigned.' }
    const isParticipant = gig.clientId === session.userId || gig.assignedSpecialistId === session.userId
    if (!isParticipant) return { error: 'Only the client or the assigned specialist can open a dispute.' }
    const existing = await prisma.dispute.findUnique({ where: { gigId_openerId: { gigId, openerId: session.userId } } })
    if (existing) return { error: 'You already have a dispute on this gig.' }
    await prisma.dispute.create({ data: { gigId, openerId: session.userId, reason } })
    const otherId = gig.clientId === session.userId ? gig.assignedSpecialistId : gig.clientId
    if (otherId) createNotification(otherId, gigId, 'STATUS_CHANGE', 'dispute_opened', { openerId: session.userId })
    redirect(`/gigs/${gigId}`)
  }

  export async function resolveDispute(prevState, formData) {
    const session = await getSession(); if (!session) redirect('/login')
    if (session.role !== 'ADMIN') return { error: 'Only admins can resolve disputes.' }
    const disputeId = formData.get('disputeId') as string
    const resolution = sanitizeInput((formData.get('resolution') as string) || '').trim()
    const statusRaw = (formData.get('status') as string) || 'RESOLVED'
    const status = statusRaw === 'REJECTED' ? 'REJECTED' : 'RESOLVED'
    if (!resolution) return { error: 'A resolution note is required.' }
    const dispute = await prisma.dispute.findUnique({ where: { id: disputeId }, include: { gig: true } })
    if (!dispute) return { error: 'This dispute no longer exists.' }
    if (dispute.status !== 'OPEN') return { error: 'This dispute has already been resolved.' }
    await prisma.$transaction(async (tx) => {
      const log = await tx.moderationLog.create({
        data: { action: 'RESOLVE_DISPUTE', reason: resolution, adminId: session.userId, targetGigId: dispute.gigId, targetUserId: dispute.openerId },
      })
      await tx.dispute.update({
        where: { id: disputeId },
        data: { status, resolution, resolvedById: session.userId, resolutionLogId: log.id },
      })
    })
    createNotification(dispute.openerId, dispute.gigId, 'STATUS_CHANGE', 'dispute_resolved', { status })
    revalidatePath('/disputes'); revalidatePath('/admin')
    redirect(`/gigs/${dispute.gigId}`)
  }
  ```
  (Match the `prevState: { error?: string } | null, formData: FormData` signatures.) The interactive transaction
  captures the log id for `resolutionLogId` (the audit link). Notifications are fire-and-forget (consistent).

**Test Plan:**
```bash
test -f app/actions/dispute.ts && grep -qE 'export async function openDispute' app/actions/dispute.ts && grep -qE 'export async function resolveDispute' app/actions/dispute.ts && echo "actions present"
grep -qE "role !== 'ADMIN'" app/actions/dispute.ts && grep -qE "action: 'RESOLVE_DISPUTE'" app/actions/dispute.ts && grep -qE 'resolutionLogId: log.id' app/actions/dispute.ts && echo "admin gate + audit link"
```
Expected: `openDispute` (participant-gated) + `resolveDispute` (admin-gated, writes + links the `ModerationLog` audit).

---

## Task 5: [x] Seed sample disputes + FK-safe reset

**Implementation Notes:**
- In `prisma/seed.ts` (a post-pass after gigs/applications exist): find an IN_PROGRESS/REVIEW/COMPLETED gig with an
  `assignedSpecialistId`; if it has no dispute, `prisma.dispute.create` one opened by the assigned specialist (reason
  text). Optionally create a second one and resolve it (set `status: 'RESOLVED'`, `resolution`, `resolvedById` = an
  admin, and create + link a `ModerationLog`). Idempotent (guard with a `findFirst`/`findUnique` on `[gigId,
  openerId]`).
- In `__tests__/helpers/db.ts` `resetTestDatabase`: add `await prisma.dispute.deleteMany()` **first** (before
  `review`/`moderationLog`/`gig`/`user`) — `Dispute` references `ModerationLog`, `Gig`, and `User`.

**Test Plan:**
```bash
grep -qiE 'dispute.create|prisma.dispute' prisma/seed.ts && echo "seed opens disputes"
grep -qE 'prisma.dispute.deleteMany' __tests__/helpers/db.ts && echo "FK-safe reset (dispute first)"
```
Expected: idempotent sample disputes; reset deletes `dispute` FK-safely first.

---

## Task 6: [x] Integration tests

**Implementation Notes:**
- Add `__tests__/integration/disputes-flow.test.ts` (mock `@/lib/prisma`, `next/headers`, `next/navigation`;
  `createTestUser`/`createTestGig`; `withAuthContext`; import actions/helpers after mocks — mirror
  `category-taxonomy.test.ts`). A gig with an assigned specialist: `createTestGig({ clientId, assignedSpecialistId,
  status: 'IN_PROGRESS' })`. Cover:
  - **open:** client opens (reason) → Dispute `OPEN` created; assigned specialist opens (separate) → created;
    non-participant → `{ error }`; empty reason → `{ error }`; gig with no `assignedSpecialistId` → `{ error }`;
    duplicate `[gigId, openerId]` → `{ error }`.
  - **resolve + audit:** ADMIN `resolveDispute(status='RESOLVED', resolution)` → dispute `status='RESOLVED'`,
    `resolution` set, `resolvedById` = admin, `resolutionLogId` set; a `ModerationLog` with `action='RESOLVE_DISPUTE'`
    exists and `dispute.resolutionLogId === log.id`; non-admin → `{ error }`; already-resolved → `{ error }`.
  - **status to participants:** `getDisputeList({ participantId: opener })` shows the dispute with status `open`, then
    `completed` after `RESOLVED`; `getDisputeDetail(id)` returns reason/status/resolution.
  - **contract:** `const _l: DisputeListVM = await getDisputeList()`; `disputes[].status` ∈ design `Status`.
  - **moderation unaffected:** `closeGig` (ADMIN) still closes a gig + writes a `CLOSE_GIG` `ModerationLog` (a sanity
    check that the moderation flow is intact alongside disputes).
- Success paths that redirect → `await expect(action(...)).rejects.toThrow('NEXT_REDIRECT')`; error paths return
  `{ error }`. Create disputes via the actions or the test client.

**Test Plan:**
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/disputes-flow.test.ts 2>&1 | tail -14
```
Expected: open / resolve+audit / authorization / status / contract / moderation-unaffected — all pass.

---

## Task 7: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec Test Plan (schema, VM, helpers, actions, seed, FK-safe reset, tests,
  typecheck, build, full suite clean DB, lints).
- Confirm scope: additive; the existing moderation actions (`app/actions/moderation.ts`) are **unchanged**; only the
  type-only `DisputeListVM` is added to `view-models.ts`; no UI screen/component change; the existing
  `admin-role-and-moderation` tests still green.

**Test Plan:**
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/disputes|app/actions/dispute|view-models|disputes-flow.test" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff app/actions/moderation.ts | grep -E '^[-+]' | grep -vE '^(---|\+\+\+)' && echo "CHECK moderation changed" || echo "OK moderation unchanged"
git status --porcelain | grep -E 'app/workbench/|app/\(protected\)/' && echo "CHECK UI screen modified" || echo "OK no UI screen changes"
```
Expected: all gates green; additive; moderation unaffected; no UI changes beyond the type-only VM.

---

## Summary

Total tasks: 7
Estimated effort: 6–8 hours (friction: medium — a new model + relations + two actions + helpers + a type-only VM + FK-safe reset + seed + tests)

**Deliverables:**
- ✅ `Dispute` model linked to `ModerationLog` (`resolutionLogId`) + back-relations on `Gig`/`User`/`ModerationLog`; client regenerated.
- ✅ `DisputeListVM` materialized (verbatim §5, type-only); `lib/disputes.ts` — `getDisputeList` ⇒ `DisputeListVM` (status mapped) + `getDisputeDetail`.
- ✅ `app/actions/dispute.ts` — `openDispute` (participant-gated) + `resolveDispute` (admin-gated, writes + links the audit, transaction).
- ✅ Idempotent seed; FK-safe `resetTestDatabase` (`dispute` first); `disputes-flow.test.ts`.

**Critical path:** model (1) → VM (2) → helpers (3) → actions (4) → seed + reset (5) → tests (6) → acceptance (7).

**Scope guards (non-goals):**
- No change to existing moderation actions/behaviour; no `ModerationLog` column change (only an additive back-relation); no multi-round dispute thread; no gig-lifecycle change; no UI wiring (Phase 2 `compose-disputes`); `DisputeListVM` is the only (type-only) `view-models.ts` edit.

**Success criteria:**
- ✅ Additive `Dispute` linked to `ModerationLog`; `openDispute` (participant) + `resolveDispute` (admin + audit, transaction)
- ✅ `getDisputeList` ⇒ `DisputeListVM` (status mapped); participants see status; existing moderation unaffected
- ✅ `build` + `test:unit` (clean DB) + lints green; FK-safe reset; no UI screen/component changes
