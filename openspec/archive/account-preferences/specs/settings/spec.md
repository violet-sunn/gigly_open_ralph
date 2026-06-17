# Settings Specification Delta: account-preferences

This document contains specification changes for the `account-preferences` change — a Phase-1 **data** change
introducing the new `settings` domain. It fulfills the Settings (`/settings`) contract (`docs/DESIGN_SYSTEM_SPEC.md` —
AppShell + Select + Toggle·list + DangerAction) with additive `User` preference fields (locale + notification
toggles), a read/update action, a contract-shaped getter + locale dataset, and a `deleteAccount` action (cascade +
session teardown + confirmation). It ships **`User` fields + a getter + a dataset + two actions + tests only** —
additive, with **no UI wiring** (Phase 2 binds the Settings screen), no new table, no `view-models.ts` change (the
Settings screen has no §5 VM), and the auth/profile flows unaffected.

---

## ADDED Requirements

### Requirement: User Preference Fields
`User` MUST gain a `locale` (default `"ru"`) and notification toggles (default `true`), additively, fulfilling the
Settings Select + Toggle·list.

#### Scenario: Fields exist with backward-compatible defaults
- GIVEN the schema
- WHEN the `User` model is inspected
- THEN it MUST have `locale String @default("ru")`, `notifyApplications Boolean @default(true)`,
  `notifyStatusChanges Boolean @default(true)`, and `notifyMessages Boolean @default(true)`
- AND only these columns are added (no existing column changed); `npx prisma generate` MUST be run; existing users get
  the defaults

#### Scenario: Toggles align to the notification types
- GIVEN the `Notification.type` enum (`APPLICATION` / `STATUS_CHANGE` / `MESSAGE`)
- WHEN the toggles are considered
- THEN `notifyApplications` ↔ `APPLICATION`, `notifyStatusChanges` ↔ `STATUS_CHANGE`, `notifyMessages` ↔ `MESSAGE`

**Acceptance Criteria:**
- `User` +`locale` (default "ru") + three `notify*` toggles (default true); additive; client regenerated
- Toggles align to the `Notification.type` categories

---

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

---

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

---

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

---

## Test Plan

This change ships `User` fields + a getter + a dataset + two actions + tests. Validation is by deterministic commands.
Commands assume the repo root.

### Schema + helper + client
```bash
grep -qE 'locale +String +@default\("ru"\)' prisma/schema.prisma && echo "locale (ru default)"
grep -qE 'notifyApplications +Boolean +@default\(true\)' prisma/schema.prisma && grep -qE 'notifyStatusChanges' prisma/schema.prisma && grep -qE 'notifyMessages' prisma/schema.prisma && echo "notification toggles"
test -f lib/preferences.ts && grep -qE 'getPreferences' lib/preferences.ts && grep -qE 'LOCALES|isLocale' lib/preferences.ts && echo "getPreferences + LOCALES"
npx prisma generate >/dev/null 2>&1 && echo "client regenerated"
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK schema deletions" || echo "OK schema additive"
```

### Actions present; deleteAccount confirmed + tears down
```bash
test -f app/actions/settings.ts && grep -qE 'updatePreferences' app/actions/settings.ts && grep -qE 'deleteAccount' app/actions/settings.ts && echo "actions present"
grep -qE 'confirmEmail' app/actions/settings.ts && grep -qE 'destroySession' app/actions/settings.ts && echo "deleteAccount confirms + tears down session"
grep -qE '\$transaction' app/actions/settings.ts && echo "deleteAccount cascade in a transaction"
```

### Tests (read/update / delete confirmation / authorization / cascade / teardown)
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/account-preferences.test.ts 2>&1 | tail -14
```

### Typecheck + build + suite + scope (additive, no table/VM/reset change)
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/preferences|app/actions/settings|account-preferences.test" && echo "CHECK type error" || echo "OK new/changed files type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff --quiet app/components/blocks/view-models.ts && echo "view-models unchanged" || echo "CHECK view-models changed"
git diff --quiet __tests__/helpers/db.ts && echo "reset helper unchanged (no new table)" || echo "CHECK reset changed"
git diff --quiet app/actions/auth.ts && echo "auth actions unchanged" || echo "CHECK auth changed"
```

### Manual review
1. Confirm `locale` (ru) + the three `notify*` toggles are additive on `User` with defaults; client regenerated; no new table.
2. Confirm `getPreferences` returns the Settings data and `updatePreferences` updates it (locale validated, partial-safe, authenticated).
3. Confirm `deleteAccount` requires `confirmEmail` = the caller's email, cascades the full footprint in a transaction (no FK error), tears down the session, and leaves unrelated users + others' gigs intact (gig unassigned).
4. Confirm the auth/profile flows are unaffected and no screen is wired yet (Phase 2).
