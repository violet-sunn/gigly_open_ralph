# Implementation Tasks: account-preferences

> **Phase-1 data change (final Phase 1).** Fulfill the Settings contract with additive `User` preference fields
> (locale RU-default + 3 notification toggles), a read/update action, a contract-shaped getter + locale dataset, and a
> `deleteAccount` action (cascade + `destroySession()` teardown + `confirmEmail` confirm). Additive; **no new table /
> no `resetTestDatabase` change / no `view-models.ts` change** (the Settings screen has no §5 VM); **no UI wiring**
> (Phase 2 binds it); `createNotification` **not** modified (toggles stored, not yet enforced). Mirror
> `app/actions/auth.ts` (`logoutUser` → `destroySession()`) + `app/actions/profile.ts` + `lib/reviews.ts`. Friction:
> medium (the `deleteAccount` cascade is the crux).

---

## Task 1: [x] `User` preference fields + regenerate client

**Implementation Notes:**
- In `prisma/schema.prisma` `User`, add (near the other account flags, e.g. after `applicationGuidanceDismissed`):
  ```prisma
  locale               String   @default("ru")
  notifyApplications   Boolean  @default(true)
  notifyStatusChanges  Boolean  @default(true)
  notifyMessages       Boolean  @default(true)
  ```
  **Additive** — change no existing column; existing users get the defaults.
- Run `npx prisma generate`.

**Test Plan:**
```bash
grep -qE 'locale +String +@default\("ru"\)' prisma/schema.prisma && echo "OK locale (ru)"
grep -qE 'notifyApplications +Boolean +@default\(true\)' prisma/schema.prisma && grep -qE 'notifyStatusChanges' prisma/schema.prisma && grep -qE 'notifyMessages' prisma/schema.prisma && echo "OK toggles"
npx prisma generate 2>&1 | tail -1
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK deletions" || echo "OK additive"
```
Expected: additive `locale` + 3 toggles on `User`; client regenerated.

---

## Task 2: [x] `lib/preferences.ts` — `getPreferences` + `LOCALES`

**Implementation Notes:**
- Create `lib/preferences.ts` (server-only):
  ```ts
  import { prisma } from '@/lib/prisma'

  export const LOCALES = ['ru', 'en'] as const // RU default
  export const isLocale = (s: string): boolean => (LOCALES as readonly string[]).includes(s)

  export interface Preferences {
    locale: string
    notifyApplications: boolean
    notifyStatusChanges: boolean
    notifyMessages: boolean
  }

  // Settings Select value + Toggle states. Returns null if the user does not exist.
  export async function getPreferences(userId: string): Promise<Preferences | null> {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { locale: true, notifyApplications: true, notifyStatusChanges: true, notifyMessages: true },
    })
    return u ?? null
  }
  ```
  (The Settings screen has no §5 view-model — `Preferences` is the typed shape the Select + Toggle·list bind.)

**Test Plan:**
```bash
test -f lib/preferences.ts && grep -qE 'getPreferences' lib/preferences.ts && grep -qE 'LOCALES' lib/preferences.ts && grep -qE 'isLocale' lib/preferences.ts && echo "OK getPreferences + dataset"
```
Expected: `getPreferences` returns locale + toggles; `LOCALES` (RU default) + `isLocale`.

---

## Task 3: [x] `app/actions/settings.ts` — `updatePreferences` + `deleteAccount`

**Implementation Notes:**
- Create `app/actions/settings.ts` (`'use server'`; import `redirect`, `prisma`, `getSession`, `destroySession`,
  `isLocale`):
  ```ts
  export async function updatePreferences(prevState, formData) {
    const session = await getSession(); if (!session) redirect('/login')
    const data: Record<string, unknown> = {}
    if (formData.has('locale')) {
      const locale = (formData.get('locale') as string) || ''
      if (!isLocale(locale)) return { error: 'Please choose a supported language.' }
      data.locale = locale
    }
    // partial-safe: only set a toggle when its key is present (the Phase-2 Toggle submits 'true'/'false')
    for (const key of ['notifyApplications', 'notifyStatusChanges', 'notifyMessages'] as const) {
      if (formData.has(key)) data[key] = formData.get(key) === 'true' || formData.get(key) === 'on'
    }
    await prisma.user.update({ where: { id: session.userId }, data })
    return { success: true }
  }

  export async function deleteAccount(prevState, formData) {
    const session = await getSession(); if (!session) redirect('/login')
    const confirmEmail = ((formData.get('confirmEmail') as string) || '').trim()
    if (confirmEmail !== session.email) {
      return { error: 'Please type your account email to confirm deletion.' }
    }
    const userId = session.userId
    const owned = await prisma.gig.findMany({ where: { clientId: userId }, select: { id: true } })
    const gigIds = owned.map((g) => g.id)
    await prisma.$transaction(async (tx) => {
      await tx.dispute.deleteMany({ where: { OR: [{ openerId: userId }, { resolvedById: userId }, { gigId: { in: gigIds } }] } })
      await tx.review.deleteMany({ where: { OR: [{ authorId: userId }, { targetId: userId }, { gigId: { in: gigIds } }] } })
      await tx.notification.deleteMany({ where: { OR: [{ userId }, { gigId: { in: gigIds } }] } })
      await tx.message.deleteMany({ where: { OR: [{ senderId: userId }, { gigId: { in: gigIds } }] } })
      await tx.application.deleteMany({ where: { OR: [{ specialistId: userId }, { gigId: { in: gigIds } }] } })
      await tx.moderationLog.deleteMany({ where: { OR: [{ adminId: userId }, { targetUserId: userId }, { targetGigId: { in: gigIds } }] } })
      await tx.gig.updateMany({ where: { assignedSpecialistId: userId }, data: { assignedSpecialistId: null } })
      await tx.gig.deleteMany({ where: { clientId: userId } })
      await tx.user.delete({ where: { id: userId } }) // profiles / workExperience / favoriteCategories cascade
    })
    await destroySession()
    redirect('/')
  }
  ```
  Match the `(prevState: { error?: string; success?: boolean } | null, formData: FormData)` signatures. FK-safe order
  (disputes → reviews → notifications → messages → applications → moderationLogs → unassign others' gigs → delete
  user's gigs → delete user) — mirrors `resetTestDatabase`. Deletes **only** the caller's own account.

**Test Plan:**
```bash
test -f app/actions/settings.ts && grep -qE 'export async function updatePreferences' app/actions/settings.ts && grep -qE 'export async function deleteAccount' app/actions/settings.ts && echo "actions present"
grep -qE 'confirmEmail !== session.email' app/actions/settings.ts && grep -qE 'destroySession' app/actions/settings.ts && grep -qE '\$transaction' app/actions/settings.ts && echo "confirm + teardown + cascade tx"
grep -qE 'isLocale' app/actions/settings.ts && echo "locale validated"
```
Expected: `updatePreferences` (validated, partial-safe) + `deleteAccount` (confirm + cascade tx + teardown).

---

## Task 4: [x] Integration tests

**Implementation Notes:**
- Add `__tests__/integration/account-preferences.test.ts` (mock `@/lib/prisma`, `next/headers`, `next/navigation`;
  `createTestUser`/`createTestGig`/`createTestApplication`; `withAuthContext`). For session teardown, make the
  `next/headers` cookies mock's `delete` a module-level spy and assert it is called with `'session'`. Cover:
  - **read/update:** a fresh user → `getPreferences` = `{ locale: 'ru', notify*: true }`; `updatePreferences`
    (`locale='en'`, `notifyMessages='false'`) → persisted (`locale='en'`, `notifyMessages=false`, others unchanged —
    partial-safe); `updatePreferences(locale='xx')` → `{ error }`, unchanged.
  - **delete confirm/auth:** `deleteAccount` with a wrong `confirmEmail` → `{ error }`, user still exists; with the
    correct email → redirect (`rejects.toThrow('NEXT_REDIRECT')`) and the user is gone; the cookies `delete` spy was
    called with `'session'`.
  - **cascade:** a CLIENT with a gig + an application on it (from another specialist) + a message + a review + a
    dispute + a notification; `deleteAccount` (confirmed) → the user, their gig, and all those child records are gone,
    with **no FK error**; a separately-created UNRELATED user + their gig remain intact.
  - **assigned-gig survives:** another client's gig with `assignedSpecialistId` = the deleting (specialist) user →
    after deletion, that gig still exists with `assignedSpecialistId = null`.
- Success-with-redirect → `await expect(deleteAccount(...)).rejects.toThrow('NEXT_REDIRECT')`; errors return `{ error }`.

**Test Plan:**
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/account-preferences.test.ts 2>&1 | tail -14
```
Expected: read/update, delete confirm/auth, cascade (+ no FK error + unrelated intact), assigned-gig unassigned, teardown — all pass.

---

## Task 5: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec Test Plan (schema, helper, actions, tests, typecheck, build, full
  suite clean DB, lints).
- Confirm scope: additive; **no** new table, no `__tests__/helpers/db.ts` change, no `view-models.ts` change, no
  change to `app/actions/auth.ts` or `createNotification`; the existing auth/profile/registration/login/notification
  tests still green.

**Test Plan:**
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/preferences|app/actions/settings|account-preferences.test" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff --quiet app/components/blocks/view-models.ts && echo "view-models unchanged" || echo "CHECK view-models changed"
git diff --quiet __tests__/helpers/db.ts && echo "reset unchanged (no new table)" || echo "CHECK reset changed"
git diff --quiet app/actions/auth.ts && echo "auth actions unchanged" || echo "CHECK auth changed"
```
Expected: all gates green; additive; no table/VM/reset/auth changes; auth/profile flows unaffected.

---

## Summary

Total tasks: 5
Estimated effort: 4–6 hours (friction: medium — additive `User` fields + a getter + a dataset + two actions, the `deleteAccount` cascade being the crux; no new table/model)

**Deliverables:**
- ✅ `User.locale` (default "ru") + `notifyApplications`/`notifyStatusChanges`/`notifyMessages` (default true); client regenerated.
- ✅ `lib/preferences.ts` — `getPreferences` + `LOCALES`/`isLocale`.
- ✅ `app/actions/settings.ts` — `updatePreferences` (validated, partial-safe) + `deleteAccount` (confirm + cascade transaction + `destroySession()` teardown).
- ✅ `account-preferences.test.ts` (read/update, delete confirm/auth/cascade, assigned-gig survives, teardown).

**Critical path:** fields (1) → helper (2) → actions (3) → tests (4) → acceptance (5).

**Scope guards (non-goals):**
- No UI wiring (Phase 2 `compose-settings`); no enforcement of toggles in `createNotification` (follow-up); no new table / `resetTestDatabase` / `view-models.ts` change; no change to existing auth actions or other domains; a user deletes only their own account.

**Success criteria:**
- ✅ Additive `User` preference fields (locale ru-default + toggles); `getPreferences`/`LOCALES`; `updatePreferences` (validated, partial-safe)
- ✅ `deleteAccount` (confirm + full-footprint cascade transaction + session teardown); unrelated users + others' gigs survive
- ✅ `build` + `test:unit` (auth/profile flows green) + lints green; no table/VM/reset/auth changes
