# Moderation Specification

This domain covers the ADMIN moderation actions over the `ModerationLog` audit. The reversible actions (`suspendUser`
/`unsuspendUser` a user, `closeGig` a gig) are specified within the admin-console UI spec; this domain adds the
**irreversible** actions — hard deletion of a gig or a user — that actually purge an entity from the app.

Deletion is FK-blocked by the schema's `Restrict` relations, so each action runs a deliberate, ordered cascade inside a
single `prisma.$transaction` and writes a `ModerationLog` whose `reason` embeds a snapshot of the deleted identity (the
`targetGigId`/`targetUserId` FK nulls out on delete, so the snapshot is the only durable record). A blast-radius
preview lets the admin review the cost before confirming. It is additive — the existing suspend/close moderation is
**unaffected**.

## Requirements

### Requirement: Delete Gig Server Action (admin, hard, transactional)

The system MUST provide a `deleteGig(prevState, formData)` server action that hard-deletes a gig and its dependents in one transaction. It MUST be ADMIN-only, require a non-empty `reason`, refuse a gig with an OPEN dispute, purge every dependent in FK-safe order, and write a `ModerationLog` audit that survives the deletion.

The FK-safe order MUST be: delete the gig's `Review` rows, then its `Dispute` rows (their `DisputeEntry` rows cascade), then its `Application` rows, then the `Gig` itself — at which point `Message` and `Notification` rows cascade automatically and `ModerationLog.targetGigId` nulls out. All deletes MUST run inside a single `prisma.$transaction`.

#### Scenario: Non-admin or unauthenticated caller is refused
- GIVEN `deleteGig`
- WHEN the caller is unauthenticated → it MUST `redirect('/login')`
- WHEN the caller is not an ADMIN → it MUST return `{ error: 'Действия модерации доступны только администраторам.' }` and delete nothing

#### Scenario: Missing gig or missing reason is refused
- WHEN the gig does not exist → it MUST return an error and delete nothing
- WHEN `reason` is empty/whitespace → it MUST return `{ error: 'Укажите причину удаления гига.' }` and delete nothing

#### Scenario: A gig with an OPEN dispute cannot be deleted
- GIVEN a gig that has a dispute with status `OPEN`
- WHEN `deleteGig` is called
- THEN it MUST be refused with a clear message directing the admin to resolve the dispute first, and the gig MUST remain

#### Scenario: A deletable gig is purged in full, transactionally
- GIVEN a gig with applications, messages, notifications, reviews, and only non-`OPEN` (or no) disputes
- WHEN an ADMIN calls `deleteGig` with a reason
- THEN the gig and ALL of its applications, messages, notifications, reviews, and disputes (with their timeline entries) MUST be gone
- AND no orphaned rows referencing the gig id MUST remain (no FK error is thrown)
- AND unrelated gigs and their data MUST be untouched

#### Scenario: The deletion is audited with a durable snapshot
- WHEN `deleteGig` succeeds
- THEN a `ModerationLog` row MUST be written with `action: 'DELETE_GIG'`, `adminId` = the acting admin, and a `reason` that embeds the deleted gig's identity (its id and title) — because `targetGigId` nulls out once the gig is gone, the snapshot in `reason` is the only durable record
- AND `revalidatePath('/admin/gigs')` and `revalidatePath('/admin')` MUST run, then `redirect('/admin/gigs')`

### Requirement: Delete User Server Action (admin, hard, transactional)

The system MUST provide a `deleteUser(prevState, formData)` server action that hard-deletes a user and their own footprint in one transaction. It MUST be ADMIN-only, require a non-empty `reason`, and refuse in the guarded cases below.

**A user who still owns any gig (as client) MUST NOT be deletable** — the admin MUST delete those gigs first, one at a time, each via `deleteGig` with its own impact preview. This deliberately bounds the blast radius: `deleteUser` never reaches into another user's gigs or the applications/chat/reviews other users left on the deleted user's gigs; it only removes the deleted user's own footprint (their applications, reviews, and opened disputes on others' gigs), leaving those gigs intact.

It MUST purge, in FK-safe order: the user's authored and received `Review` rows, their opened `Dispute` rows, and their `Application` rows, then the `User`. The user's `ClientProfile`/`SpecialistProfile` (+ `WorkExperience`), `Session`, `Notification`, and `FavoriteCategories` rows cascade automatically; `Message.senderId`, `Gig.assignedSpecialistId`, and `ModerationLog.targetUserId` null out. All deletes MUST run inside a single `prisma.$transaction`.

#### Scenario: Non-admin, unauthenticated, or missing target is refused
- WHEN the caller is unauthenticated → `redirect('/login')`
- WHEN the caller is not an ADMIN → return `{ error: 'Действия модерации доступны только администраторам.' }`, delete nothing
- WHEN the target user does not exist → return an error, delete nothing
- WHEN `reason` is empty/whitespace → return `{ error: 'Укажите причину удаления пользователя.' }`, delete nothing

#### Scenario: Admins and self cannot be deleted through this path
- WHEN the target user is the acting admin themselves → it MUST be refused
- WHEN the target user's role is `ADMIN` → it MUST be refused (admins are removed only via the database)
- AND the self check MUST take precedence over the role check, so an admin deleting their own account gets the self-specific message

#### Scenario: A user who still owns gigs cannot be deleted
- GIVEN a user who is the client (`Gig.clientId`) of one or more gigs
- WHEN `deleteUser` is called
- THEN it MUST be refused with a message directing the admin to delete those gigs first (via `deleteGig`), and the user and their gigs MUST remain unchanged

#### Scenario: A user in an unresolved or active engagement cannot be deleted
- WHEN the user has any `OPEN` dispute (as opener, or on a gig where they are client or assigned specialist) → it MUST be refused, directing the admin to resolve it first
- WHEN the user is the assigned specialist on any non-terminal gig (`IN_PROGRESS` or `REVIEW`) → it MUST be refused, directing the admin to close or reassign that gig first
- AND in both cases the user and all data MUST remain unchanged

#### Scenario: A deletable user is purged in full, transactionally
- GIVEN a non-admin user who owns NO gigs, with applications, authored/received reviews, resolved/closed disputes, profile, sessions, and notifications, and no active/OPEN blockers
- WHEN an ADMIN calls `deleteUser` with a reason
- THEN the user, their profile(s), sessions, notifications, applications, authored/received reviews, and opened disputes MUST be gone
- AND no orphaned rows referencing the user id MUST remain, and no FK error is thrown
- AND OTHER users' gigs (including gigs where the deleted user applied or was assigned) MUST survive; the deleted user's applications/reviews on them are removed, their sent messages remain with `senderId` nulled (unattributed), and any terminal gig they were assigned to has `assignedSpecialistId` nulled

#### Scenario: The deletion is audited with a durable snapshot
- WHEN `deleteUser` succeeds
- THEN a `ModerationLog` row MUST be written with `action: 'DELETE_USER'`, `adminId` = the acting admin, and a `reason` embedding the deleted user's identity (id and email) — the durable record once `targetUserId` nulls out
- AND `revalidatePath('/admin/users')` and `revalidatePath('/admin')` MUST run, then `redirect('/admin/users')`

### Requirement: Deletion Impact Preview

The system MUST provide read-only impact functions (`getGigDeletionImpact(gigId)` / `getUserDeletionImpact(userId)`) that return the counts of dependents a deletion would purge, WITHOUT deleting anything, so the admin can review the blast radius before confirming. Both MUST be ADMIN-only (returning `null` for a non-admin or missing target).

#### Scenario: Gig impact reports its dependents
- GIVEN a gig
- WHEN `getGigDeletionImpact` is called by an ADMIN
- THEN it MUST return the number of applications, messages, reviews, and disputes attached to the gig, plus a `hasOpenDispute` flag (mirroring the `deleteGig` guard), and MUST NOT modify any data

#### Scenario: User impact reports its footprint
- GIVEN a user
- WHEN `getUserDeletionImpact` is called by an ADMIN
- THEN it MUST return the counts that WILL be purged (applications, authored/received reviews, opened disputes) and MUST NOT modify any data
- AND it MUST return the number of gigs the user owns, and surface every reason the user is currently blocked from deletion: **owns ≥1 gig**, has an open dispute, is an active assignee, is an admin, or is the acting admin themselves — so the UI can disable the action and explain why

### Requirement: Admin Console Delete Controls

The `/admin/users` and `/admin/gigs` tables MUST each expose a destructive «Удалить» control per row, reusing the `ConfirmDialog` destructive pattern (as suspend/close do). The confirm dialog MUST show the deletion-impact preview (fetched when opened) and MUST NOT fire the action until the admin confirms; the confirm MUST be disabled while the preview loads or when the entity is guarded.

#### Scenario: Deleting a gig from the console
- GIVEN an ADMIN on `/admin/gigs`
- WHEN they activate «Удалить» on a row
- THEN a destructive confirm dialog MUST appear naming the gig and showing its impact preview (applications/messages/reviews/disputes counts)
- AND only on confirm MUST `deleteGig` run; on success the row MUST disappear from the list

#### Scenario: Deleting a user from the console
- GIVEN an ADMIN on `/admin/users`
- WHEN they activate «Удалить» on a non-admin row
- THEN a destructive confirm dialog MUST appear naming the user and showing its footprint preview
- AND the control MUST be disabled (with a reason) for an ADMIN row, for the admin's own row, when the user still **owns gigs** (delete those first), or when the user is blocked by an open dispute / active assignment
- AND only on confirm MUST `deleteUser` run; on success the row MUST disappear from the list
