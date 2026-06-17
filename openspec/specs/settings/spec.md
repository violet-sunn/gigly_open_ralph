# Settings Specification

This domain provides account preferences and account deletion, fulfilling the Settings (`/settings`) contract
(`docs/DESIGN_SYSTEM_SPEC.md` — AppShell + Select + Toggle·list + DangerAction). It adds `User` preference fields
(locale + notification toggles), a read/update action, a contract-shaped getter + locale dataset, and a
`deleteAccount` action (cascade + session teardown + confirmation). The Settings screen has no §5 view-model (it binds
primitives), so the "contract" is the data those primitives need. Additive — the auth/profile flows are unaffected.

## Requirements

### Requirement: User Preference Fields
`User` MUST carry a `locale` (default `"ru"`) and notification toggles (default `true`), additively, fulfilling the
Settings Select + Toggle·list.

#### Scenario: Fields exist with backward-compatible defaults
- GIVEN the schema
- WHEN the `User` model is inspected
- THEN it MUST have `locale String @default("ru")`, `notifyApplications Boolean @default(true)`,
  `notifyStatusChanges Boolean @default(true)`, and `notifyMessages Boolean @default(true)`
- AND only these columns are added (no existing column changed); existing users get the defaults

#### Scenario: Toggles align to the notification types
- GIVEN the `Notification.type` enum (`APPLICATION` / `STATUS_CHANGE` / `MESSAGE`)
- WHEN the toggles are considered
- THEN `notifyApplications` ↔ `APPLICATION`, `notifyStatusChanges` ↔ `STATUS_CHANGE`, `notifyMessages` ↔ `MESSAGE`

**Acceptance Criteria:**
- `User` +`locale` (default "ru") + three `notify*` toggles (default true); additive; client regenerated
- Toggles align to the `Notification.type` categories

### Requirement: Read and Update Preferences
`getPreferences` MUST expose the preferences for the Settings screen, and `updatePreferences` MUST update them
(authenticated, locale-validated, partial-safe).

#### Scenario: getPreferences returns the Settings data
- GIVEN a user
- WHEN `getPreferences(userId)` is called
- THEN it MUST return `{ locale, notifyApplications, notifyStatusChanges, notifyMessages }` (the Select value + the
  Toggle states); for a new user these MUST be the defaults (`"ru"`, all `true`)
- AND `LOCALES` (RU default) + `isLocale` MUST exist for the language Select

#### Scenario: updatePreferences updates the supplied fields
- GIVEN an authenticated user calling `updatePreferences`
- WHEN a valid `locale` and/or notification toggles are supplied
- THEN the user's preferences MUST be updated to those values (partial-safe — only fields present in the form), and it
  MUST succeed (`{ success: true }`, save-in-place)

#### Scenario: updatePreferences rejects an invalid locale; requires auth
- GIVEN `updatePreferences`
- WHEN `locale` is supplied but not in `LOCALES`
- THEN it MUST be rejected with a clear error and no change
- AND an unauthenticated caller MUST be redirected to `/login`

**Acceptance Criteria:**
- `getPreferences` returns locale + toggles (defaults for new users); `LOCALES`/`isLocale` exist (RU default)
- `updatePreferences` updates the supplied fields (locale validated), partial-safe, authenticated

### Requirement: Delete Account (cascade, teardown, confirm)
`deleteAccount` MUST let an authenticated user delete **their own** account — confirmed, cascading their full
footprint, and tearing down the session.

#### Scenario: A confirmed delete removes the account and full footprint
- GIVEN an authenticated user calling `deleteAccount` with `confirmEmail` equal to their email
- WHEN it runs
- THEN in a transaction it MUST delete the user's footprint — disputes, reviews, notifications, messages,
  applications, and moderation logs that reference the user **or** are on the user's gigs; unassign the user from
  others' gigs (`assignedSpecialistId → null`); delete the user's gigs; and delete the user (profiles / work
  experience / favorite categories cascade) — with **no FK error**
- AND it MUST tear down the session (`destroySession()`) and redirect

#### Scenario: A wrong/empty confirmation is rejected
- GIVEN `deleteAccount`
- WHEN `confirmEmail` does not equal the caller's email (or is empty)
- THEN it MUST be rejected with a clear error and the account MUST NOT be deleted (unauthenticated → `/login`)

#### Scenario: Only the caller's own account is affected; unrelated data survives
- GIVEN other users with their own gigs/applications/etc., and a gig owned by another client to which the deleting
  user is assigned
- WHEN `deleteAccount` runs for the user
- THEN the unrelated users and their data MUST remain intact, and the others'-gig MUST survive with
  `assignedSpecialistId = null` (not deleted)

**Acceptance Criteria:**
- `deleteAccount` (auth + `confirmEmail` = caller's email) deletes the caller's full footprint in a transaction (no FK error) + tears down the session + redirects
- Wrong/empty confirmation → no deletion; unrelated users + others' gigs survive (gig unassigned)

### Requirement: Additive Verification
The change MUST be additive with the auth/profile flows green and no table/VM/reset changes.

#### Scenario: Additive — suite green, no table/VM/reset change
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with the existing auth/profile/registration/login tests unaffected; there MUST be no new table
  (so no `resetTestDatabase` change) and no `view-models.ts` change; `npm run lint:tokens` + `npm run lint:composition`
  MUST stay green

**Acceptance Criteria:**
- No new table / `view-models.ts` / `resetTestDatabase` change; auth/profile flows green
- `npm run build` + `npm run test:unit` + lints green

## Notes

- **Out of scope (follow-up):** enforcing the notification toggles in `createNotification` (gating notification
  *creation* by the stored preferences) — this domain stores/reads/updates them; the existing notification behaviour
  is unchanged.
