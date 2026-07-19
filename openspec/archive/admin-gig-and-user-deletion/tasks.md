# Tasks — admin-gig-and-user-deletion

> Deletion is hard, guarded, transactional, with a blast-radius preview and an audit snapshot. Mirror the existing
> `app/actions/moderation.ts` pattern (ADMIN check → validation → `prisma.$transaction([...])` with a `ModerationLog` →
> `revalidatePath` → `redirect`). The cascade order is load-bearing — see the map in each task.

## 1. Deletion impact (read-only) helpers

- [x] Add `getGigDeletionImpact(gigId)` and `getUserDeletionImpact(userId)` (server, e.g. `lib/moderation-impact.ts` or in `lib/view-models.ts`).
  - Gig impact: `{ applications, messages, reviews, disputes }` counts via `prisma.<model>.count({ where: { gigId } })`.
  - User impact: purge counts `{ applications, reviewsAuthored, reviewsReceived, disputesOpened }` + `ownedGigs` count + a `blocked` field: `{ isAdmin, isSelf, ownsGigs, hasOpenDispute, activeAssignment }` so the UI can disable + explain.
  - MUST NOT write anything.
- **Test:** unit/integration — seed a gig/user with known dependents, assert exact counts; assert no data mutated; assert `blocked` flags flip for an admin target, a gig-owner, an open dispute, and a live (`IN_PROGRESS`/`REVIEW`) assignment.

## 2. `deleteGig` server action

- [x] Add `deleteGig(prevState, formData)` to `app/actions/moderation.ts`.
  - Guards: unauth → `redirect('/login')`; non-ADMIN → error; gig missing → error; empty `reason` → `{ error: 'Укажите причину удаления гига.' }`; gig has an `OPEN` dispute (`hasOpenDispute` from `lib/disputes.ts`) → refuse.
  - Snapshot the gig identity (`id`, `title`) into the audit `reason` (e.g. `` `${reason.trim()} · [гиг ${gig.id}: "${gig.title}"]` ``) BEFORE deleting.
  - `prisma.$transaction([...])` in FK-safe order:
    1. `prisma.review.deleteMany({ where: { gigId } })`
    2. `prisma.dispute.deleteMany({ where: { gigId } })`  *(DisputeEntry cascades)*
    3. `prisma.application.deleteMany({ where: { gigId } })`
    4. `prisma.moderationLog.create({ data: { action: 'DELETE_GIG', reason: snapshot, adminId: session.userId, targetGigId: gigId } })`  *(targetGigId nulls on the next step — the snapshot is the durable record)*
    5. `prisma.gig.delete({ where: { id: gigId } })`  *(Message + Notification cascade)*
  - `revalidatePath('/admin/gigs')`, `revalidatePath('/admin')`, `redirect('/admin/gigs')`.
- **Test (integration):** guard cases (non-admin, missing, empty reason, OPEN dispute → refused, nothing deleted); happy path (gig + its applications/messages/notifications/reviews/disputes+entries all gone; `prisma.gig.findUnique` → null; an unrelated gig untouched); `ModerationLog` written with `action='DELETE_GIG'` and the id+title in `reason`; whole thing rolls back on a forced mid-transaction error.

## 3. `deleteUser` server action

- [x] Add `deleteUser(prevState, formData)` to `app/actions/moderation.ts`.
  - Guards: unauth → `redirect('/login')`; non-ADMIN → error; user missing → error; empty `reason` → error; **target role is ADMIN** → refuse; **target is self** (`userId === session.userId`) → refuse; **user owns ≥1 gig** (`gig.count({ where: { clientId: userId } }) > 0`) → refuse (direct to delete those gigs first via `deleteGig`); user has any `OPEN` dispute (opener OR on a gig where client/assigned) → refuse; user is assigned specialist on any `IN_PROGRESS`/`REVIEW` gig → refuse (direct to close/reassign).
  - Snapshot identity (`id`, `email`) into the audit `reason` before deleting.
  - `prisma.$transaction([...])` in FK-safe order (NO gig deletion — the owns-gigs guard means the user has none):
    1. The user's own `Restrict` children: `review.deleteMany({ where: { OR: [{ authorId: userId }, { targetId: userId }] } })`, `dispute.deleteMany({ where: { openerId: userId } })`, `application.deleteMany({ where: { specialistId: userId } })`.
    2. `moderationLog.create({ data: { action: 'DELETE_USER', reason: snapshot, adminId: session.userId, targetUserId: userId } })`.
    3. `prisma.user.delete({ where: { id: userId } })` *(profiles + WorkExperience + sessions + notifications + FavoriteCategories cascade; `Message.senderId`, `Gig.assignedSpecialistId`, `ModerationLog.targetUserId` SetNull)*.
  - `revalidatePath('/admin/users')`, `revalidatePath('/admin')`, `redirect('/admin/users')`.
  - Note: verify the `deleteMany` ordering satisfies every `Restrict` FK to the user before `user.delete` (author/target reviews, opener disputes, specialist applications — the only Restrict FKs a non-admin, gig-less user can hold). Assert integrity in tests.
- **Test (integration):** all guard cases (non-admin caller, ADMIN target, self, **owns a gig**, OPEN dispute in each position, active assignment, empty reason → refused, nothing deleted); happy path for a gig-less user (user + profiles + sessions + notifications + applications + reviews(author/target) + opened disputes → gone; `findUnique` → null; **another user AND every gig the deleted user applied to / was assigned to survive** — only the deleted user's own applications/reviews on them are removed; a message the deleted user sent on a surviving gig remains with `senderId === null`; a terminal gig they were assigned to has `assignedSpecialistId === null`); `ModerationLog` `DELETE_USER` written with id+email in `reason`, and a pre-existing moderation log that targeted this user survives with `targetUserId` nulled; transaction rolls back on a forced error.

## 4. Admin console UI — delete controls

- [x] `app/admin/gigs/AdminGigs.tsx`: add a red «Удалить» action per row using `ConfirmAction`/`ConfirmDialog`, wired to `deleteGig` (hidden `gigId` + `reason`). The dialog body MUST render the `getGigDeletionImpact` counts (fetch on open). Keep the existing «Закрыть» action.
- [x] `app/admin/users/AdminUsers.tsx`: add a red «Удалить» action per row wired to `deleteUser`, body showing `getUserDeletionImpact`. Disable it (with a reason) for an ADMIN row, the admin's own row, a user who **owns gigs** («сначала удалите гиги»), and `blocked` users (open dispute / active assignment). Keep «Заблокировать»/«Разблокировать».
- **Test (E2E, Playwright):** admin opens `/admin/gigs`, clicks «Удалить» on a seeded gig → dialog shows the impact preview → confirm → row disappears and the gig is gone. Admin opens `/admin/users`, «Удалить» is disabled on an admin/own row, enabled on a deletable user → confirm → row disappears. (Use `waitUntil: 'domcontentloaded'` — the shell holds an SSE connection so `networkidle` never fires.)

## 5. Verify referential integrity end-to-end

- [x] After deletions in tests, run a sweep asserting no rows in any table reference the deleted id (applications/messages/notifications/reviews/disputes/entries/profiles/sessions for a user; applications/messages/notifications/reviews/disputes for a gig), and that `SetNull` targets (`ModerationLog`, surviving `Message.senderId`, `Gig.assignedSpecialistId`) are null rather than dangling.
- [x] `npm run test:clean` green; `npx tsc --noEmit` clean outside `__tests__`.
- [x] Live-verify the full admin flow once (single dev server, `DISABLE_RATE_LIMIT=true`), then archive via `/ralphy-archive`.

## Acceptance criteria (roll-up)

- `deleteGig` / `deleteUser` exist in `app/actions/moderation.ts`, ADMIN-only, reason-required, transactional, FK-safe.
- Guards refuse: non-admin, missing, empty reason, OPEN dispute (both), ADMIN/self target, active assignment, and — for `deleteUser` — a user who still owns gigs.
- A successful delete leaves **zero** orphaned rows and throws **no** FK error; unrelated users'/gigs' data is untouched.
- Each delete writes a `ModerationLog` (`DELETE_GIG`/`DELETE_USER`) whose `reason` carries the deleted identity snapshot.
- `getGigDeletionImpact`/`getUserDeletionImpact` return correct counts + block flags and mutate nothing.
- Admin tables show a guarded, preview-backed «Удалить» per row; suspend/close remain.
