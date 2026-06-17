# Change Proposal: account-preferences

> Phase 1, change 17 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`) — the
> **final Phase-1 change**. It fulfills the Settings (`/settings`) contract (`docs/DESIGN_SYSTEM_SPEC.md` — AppShell +
> Select + Toggle·list + DangerAction) with additive `User` preference fields (locale + notification toggles), an
> `updatePreferences` action (read/update), and a `deleteAccount` action (cascade delete + session teardown +
> confirmation). Additive; **no UI wiring** (Phase 2 binds the Settings screen).

## Problem Statement

The Settings screen composes from primitives — a **Select** (language/locale, RU default), a **Toggle·list**
(notification categories), and a **DangerAction** ("Удалить аккаунт" → confirm → delete). Today there is **no account
preferences data at all**:

- `User` has account flags (`hasCreatedFirstGig`, …) but **no notification preferences** and **no locale**, so the
  Settings toggles and language Select have nothing real to bind.
- There is **no `deleteAccount`** — a user cannot remove their account, and there is no cascade/teardown for it (the
  `User` relations to gigs/applications/messages/reviews/disputes/moderation-logs have **no** `onDelete: Cascade`, so a
  naive delete would fail on FK constraints).
- Phase-2's Settings screen (`compose-settings`) has **nothing real to bind** — the primitives would stay mocked.

Unlike the other Phase-1 blocks, the Settings screen has **no dedicated §5 view-model** (it binds primitives, not a
domain block), so the "contract" here is the **data those primitives need**: the locale (Select value), the
notification toggles (Toggle states), and the delete action (DangerAction). The planning doc maps this exactly:
notification-preference fields/model, locale (RU default), and a `deleteAccount` action (cascade, session teardown,
confirm). This change is additive and decoupled from the UI.

## Proposed Solution

Add additive `User` preference fields, a read/update action, a contract-shaped getter + locale dataset, a thorough
`deleteAccount` action, and verification. Five deliverable groups:

1. **`User` preference fields (additive, defaults)** — `locale String @default("ru")` (RU default) and three
   notification toggles aligned to the `Notification.type` enum: `notifyApplications`, `notifyStatusChanges`,
   `notifyMessages` (all `Boolean @default(true)`). **Additive** (new columns only — existing users get the defaults);
   `npx prisma generate` regenerates the client. (Fields on `User` — consistent with its existing account-flag fields;
   no new table, so no FK-safe-reset change.)

2. **`getPreferences` + locale dataset (`lib/preferences.ts`)** — `getPreferences(userId)` returns the user's
   `{ locale, notifyApplications, notifyStatusChanges, notifyMessages }` (the Settings Select + Toggle·list data), and
   a canonical `LOCALES` dataset (`['ru', 'en']`, RU default) + `isLocale` validator for the Select. Server-only; the
   Settings screen has no §5 VM, so the helper returns a typed `Preferences` shape (no view-model import needed).

3. **`updatePreferences` action (read/update)** — authenticated; updates the supplied fields (validating `locale`
   against `LOCALES`; each notification toggle read explicitly). **Partial-safe** (only updates fields present in the
   form). Returns `{ success: true }` (save-in-place — the Settings page stays).

4. **`deleteAccount` action (cascade + teardown + confirm)** — authenticated; requires a confirmation
   (`confirmEmail` MUST equal the caller's email). In a **transaction**, it deletes the caller's full footprint in
   FK-safe order — disputes, reviews, notifications, messages, applications, and moderation logs (where the user is
   referenced **or** on the user's gigs), unassigns the user from others' gigs (`assignedSpecialistId → null`),
   deletes the user's gigs, then deletes the user (profiles / work experience / favorite-categories cascade via the
   existing `onDelete: Cascade`). Then it **tears down the session** (`destroySession()`, mirroring `logoutUser`) and
   redirects to `/`. A user can only delete **their own** account (no target param).

5. **Tests** — `__tests__/integration/account-preferences.test.ts` covers read/update (defaults, locale validation,
   partial update), `deleteAccount` confirmation + authorization, the **cascade** (the user + all their data gone;
   unrelated users intact; others' gigs unassigned not deleted), and session teardown.

This change emits **`User` preference fields + a getter + a locale dataset + two actions + tests only**. It does
**not** add a new model/table, change the gig lifecycle, modify `createNotification` (enforcing the toggles when
notifications are *created* is a deliberate follow-up — see Non-Goals), wire the Settings screen (Phase 2
`compose-settings`), or touch `view-models.ts` (no Settings VM). The primitives already render the shapes — this
change makes the data real.

## Constraints

### MUST Requirements
- `User` MUST gain `locale String @default("ru")`, `notifyApplications`, `notifyStatusChanges`, `notifyMessages`
  (`Boolean @default(true)`) — **additive** (existing users → defaults); the client MUST be regenerated.
- `getPreferences(userId)` MUST return the user's locale + the three notification toggles; `LOCALES`
  (RU default) + `isLocale` MUST exist for the Select.
- `updatePreferences` MUST update the supplied preference fields (validating `locale` ∈ `LOCALES`), partial-safe, for
  the authenticated user; unauthenticated → `/login`.
- `deleteAccount` MUST require a confirmation (`confirmEmail` = the caller's email), delete the caller's **full
  footprint** in a transaction without FK violations, tear down the session (`destroySession()`), and redirect; a
  wrong/empty confirmation MUST reject with no deletion; unauthenticated → `/login`.
- Deleting an account MUST NOT delete **unrelated** users' data, and gigs the user was *assigned* to (owned by others)
  MUST survive with `assignedSpecialistId = null`.
- `npm run build` and `npm run test:unit` MUST stay green (the **auth/profile flows** unaffected); `npm run
  lint:tokens` + `npm run lint:composition` MUST stay green.

### SHOULD Requirements
- Preference fields SHOULD live on `User` (consistent with its existing account flags) — no new table, so no
  `resetTestDatabase` change.
- The notification toggles SHOULD align to the `Notification.type` enum (`APPLICATION` → `notifyApplications`,
  `STATUS_CHANGE` → `notifyStatusChanges`, `MESSAGE` → `notifyMessages`).
- `deleteAccount` SHOULD mirror `logoutUser`'s teardown (`destroySession()` then `redirect`), and its cascade SHOULD
  follow the same FK-safe ordering as `resetTestDatabase`.
- `updatePreferences` SHOULD be partial-safe (only update fields present in the form) and save-in-place
  (`{ success: true }`, no redirect).

### Non-Goals
- **No UI wiring.** Composing the Settings screen (Select + Toggle·list + DangerAction) is Phase 2
  (`compose-settings`). The primitives already render the shapes.
- **No enforcement of the toggles in `createNotification`** — this change **stores/reads/updates** preferences; gating
  notification *creation* by them is a deliberate follow-up (keeps this change additive and the existing notification
  tests unaffected). Documented so Phase 2 / a later change wires it.
- **No new model/table** (preferences are `User` fields); **no `resetTestDatabase` change**; **no `view-models.ts`
  change** (the Settings screen has no §5 VM).
- **No change to existing auth actions** (`registerUser`/`loginUser`/`logoutUser`), the gig lifecycle, or other
  domains; no admin-initiated account deletion (a user deletes only their own account).

## Success Criteria

1. `User` gains `locale` (default "ru") + three `notify*` toggles (default true); additive; client regenerated.
2. `getPreferences` returns locale + toggles; `LOCALES` (RU default) + `isLocale` exist; `updatePreferences` updates them (locale validated), partial-safe, authenticated.
3. `deleteAccount` requires `confirmEmail` = the caller's email, deletes the caller's full footprint in a transaction (no FK error), tears down the session, and redirects; wrong confirmation → no deletion.
4. Unrelated users' data survives; gigs the user was assigned to survive (unassigned); the user deletes only their own account.
5. `npm run build`, `npm run test:unit` (auth/profile flows green), `npm run lint:tokens`, `npm run lint:composition` all green; no schema table/`view-models`/reset changes.

## Affected Areas

- `prisma/schema.prisma` (`User.locale`, `User.notifyApplications`/`notifyStatusChanges`/`notifyMessages`) → `npx prisma generate`
- `lib/preferences.ts` (new — `getPreferences` + `LOCALES`/`isLocale`)
- `app/actions/settings.ts` (new — `updatePreferences`, `deleteAccount`)
- `__tests__/integration/account-preferences.test.ts` (new — read/update, delete confirmation/authorization/cascade, teardown)
- read-only inputs: `lib/session.ts` (`destroySession`), `app/actions/auth.ts` (`logoutUser` pattern), `prisma/schema.prisma` (`User` relations), `__tests__/helpers/*`
- `openspec/specs/settings/spec.md` (new domain spec delta)
- (NOT modified: `view-models.ts` — no Settings VM; `__tests__/helpers/db.ts` — no new table; existing auth actions; `createNotification`; the gig lifecycle; other domains)

## Risks & Mitigations

**Risk**: `User`'s relations to gigs/applications/messages/reviews/disputes/moderation-logs have **no**
`onDelete: Cascade`, so `prisma.user.delete()` alone would fail on FK constraints.
**Mitigation**: `deleteAccount` deletes the full footprint **explicitly in a transaction**, FK-safe order (disputes →
reviews → notifications → messages → applications → moderationLogs → unassign others' gigs → delete user's gigs →
delete user). No schema `onDelete` changes (additive). A test deletes a user with a populated footprint and asserts no
error + everything gone.

**Risk**: Deleting an account could destroy **other** users' unrelated data, or break gigs the user was assigned to.
**Mitigation**: The cascade scopes strictly to the user's footprint — records referencing the user **or** on the
user's own gigs. Gigs owned by *others* (where the user is the assigned specialist) are **unassigned**
(`assignedSpecialistId → null`), not deleted. A test asserts an unrelated user's data and an others'-gig survive.

**Risk**: `deleteAccount` is destructive and irreversible.
**Mitigation**: It requires `confirmEmail` to equal the caller's email (the DangerAction confirm), deletes **only** the
caller's own account (no target param — `session.userId`), and is authenticated. Wrong/empty confirmation → rejected
with no deletion (tested).

**Risk**: Storing toggles without enforcing them in `createNotification` is hollow.
**Mitigation**: Documented as a deliberate **Non-Goal / follow-up** — this change keeps the existing notification
behaviour (and its tests) unchanged; Phase 2 / a later change gates creation by the stored preferences. The Settings
screen still reads/writes them faithfully.

**Risk**: Toggle "off" submits nothing in a form, clobbering on a partial save.
**Mitigation**: `updatePreferences` is **partial-safe** — it only updates a field when its form key is present (the
Phase-2 Toggle submits explicit `'true'`/`'false'`), so an absent field is left unchanged.
