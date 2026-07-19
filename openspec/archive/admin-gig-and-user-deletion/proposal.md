# Admin Gig & User Deletion

## Why

The admin console can **suspend** a user and **close** a gig, but both are soft, reversible flags — the rows stay in the database forever. There is no reliable way to actually **purge** a spam account, a junk/test gig, or an abusive user from the app. Support requests to "remove this" currently have no answer inside the product.

This change wires a real, hard deletion into the existing admin functionality (`/admin/users`, `/admin/gigs`), alongside suspend/close — not as a replacement for them.

## The core difficulty: the deletion blast radius

A plain `prisma.user.delete()` / `prisma.gig.delete()` **throws** on almost any real record, because the schema's required relations default to `Restrict`:

- **Deleting a user** is blocked by their posted gigs (`Gig.clientId`), applications, authored/received reviews, and opened disputes. Rather than recursively purging an owning client's gigs (which would reach into *other users' data* — the specialists' applications, chat, and reviews on those gigs), this change **refuses** to delete a user who still owns gigs and requires the admin to delete each gig first. So `deleteUser` only ever removes the user's own footprint.
- **Deleting a gig** is blocked by its applications, reviews, and disputes.
- Only some relations cascade automatically today: `Session`, `ClientProfile`/`SpecialistProfile` (+ `WorkExperience`), `Notification`, `Message` (gig side), and the `FavoriteCategories` join. `Message.senderId` and `Gig.assignedSpecialistId` are `SetNull`; `ModerationLog.targetUserId`/`targetGigId` are `SetNull` (so the audit row survives but loses its FK link).

So "purge" is not one Prisma call — it is a **deliberate, FK-safe, transactional cascade** that must delete `Restrict`-blocked children first, in order.

## What (decision: hard delete, guarded, with a blast-radius preview)

Two new ADMIN-only server actions — `deleteGig` and `deleteUser` — that:

1. **Guard** before doing anything irreversible: reject a non-admin caller, a missing target, deleting an ADMIN or oneself, deleting anything with an **OPEN dispute** (resolve it first — consistent with the settlement block we already ship), deleting a user who is the **assigned specialist on a live gig** (`IN_PROGRESS`/`REVIEW` — close/reassign it first), and — the key bound — deleting a user who **still owns any gig**: the admin must delete those gigs first, one at a time via `deleteGig`. Require a non-empty reason.
2. **Preview the blast radius**: before the admin confirms, the destructive-confirm dialog shows how many dependent entities will be purged (applications, messages, reviews, disputes, and — for a user — their gigs). The admin sees the cost, then confirms with a reason.
3. **Delete transactionally in FK-safe order**, so the operation is all-or-nothing and never leaves orphans or throws a constraint error mid-way.
4. **Preserve the audit**: write a `ModerationLog` (`DELETE_GIG` / `DELETE_USER`) whose `reason` embeds a snapshot of the deleted identity (id + title/email), because the log's `targetGigId`/`targetUserId` FK nulls out the moment the entity is gone.

The UI reuses the existing `ConfirmAction`/`ConfirmDialog` destructive pattern already used by suspend/close, adding a red «Удалить» action to each `/admin/users` and `/admin/gigs` row.

## Non-goals

- **No undo / soft-delete / restore.** Hard delete is permanent — that is the point. Suspend/close remain for the reversible cases.
- **No bulk delete**, no delete-by-filter. One entity at a time.
- **No GDPR-style data export** before deletion, no anonymize-only mode.
- **No deletion of ADMIN accounts or of oneself** through this path.
- **No auto-reassignment** of an orphaned active gig — the action *guards* (refuses) and tells the admin to close/reassign first, rather than silently orphaning a live engagement.
- **No recursive purge of an owning client's gigs inside `deleteUser`** — a user who owns gigs must have them deleted first (one at a time, each with its own preview). This keeps `deleteUser` from touching other users' data.
- **No cross-instance concerns** (single SQLite instance — same boundary as the rest of the app).

## Constraints & risks

- **Irreversible.** Both actions are permanent. The preview + typed-reason + confirm dialog are the mitigation; the guards prevent deletion during an unresolved conflict. The "owns gigs → delete gigs first" guard keeps `deleteUser`'s reach bounded to the user's own footprint — a client's gigs (and the other specialists' data on them) are only removed by explicit, previewed `deleteGig` calls, never as a side effect of deleting the user.
- **Audit must outlive the entity.** The `ModerationLog.reason` snapshot is load-bearing — it is the only record of who/what was deleted once the FK link nulls.
- **Transaction ordering is exact.** Children with `Restrict` FKs (`Review`, `Dispute`, `Application`) MUST be deleted before their parent; `Cascade` children (`Message`, `Notification`, profiles, sessions) go automatically. `deleteUser` never deletes gigs — a user with owned gigs is refused.
- SQLite/Prisma enforces FKs; the ordered deletes must run inside a single `prisma.$transaction`.
