# Implementation Tasks: profile-evolution

> **Phase-1 data change.** Fulfill the `ProfileHeader`/`ExperienceList`/onboarding contract with additive profile
> fields (avatar, phone + verified [logical], position, specialization, location, timezone), a new `WorkExperience`
> model, member-since derived from `User.createdAt`, contract-typed helpers + onboarding datasets, edit support, seed,
> and FK-safe test cleanup. Additive; **no UI wiring** (Phase 2 binds it), no avatar-upload pipeline, no real SMS
> verification, new fields optional on edit. Mirror `lib/reviews.ts` + `lib/categories.ts` + `app/actions/category.ts`
> + the category-taxonomy test harness. Friction: medium.

---

## Task 1: [x] Profile fields + `WorkExperience` model + regenerate client

**Implementation Notes:**
- In `prisma/schema.prisma`, add to `SpecialistProfile` (after `bio`):
  ```prisma
  avatarUrl       String   @default("")
  phoneNumber     String   @default("")
  phoneVerified   Boolean  @default(false)
  position        String   @default("")
  specialization  String   @default("")
  location        String   @default("")
  timezone        String   @default("")
  workExperience  WorkExperience[]
  ```
  Add to `ClientProfile` (it already has `phoneNumber`): `avatarUrl String @default("")` and
  `phoneVerified Boolean @default(false)`.
- Add the new model:
  ```prisma
  model WorkExperience {
    id          String            @id @default(cuid())
    profileId   String
    profile     SpecialistProfile @relation(fields: [profileId], references: [userId], onDelete: Cascade)
    company     String
    title       String            @default("")
    description String            @default("")
    startYear   Int?
    endYear     Int?              // null = "по настоящее время" (current)
    order       Int               @default(0)
    createdAt   DateTime          @default(now())
    updatedAt   DateTime          @updatedAt

    @@index([profileId])
  }
  ```
- Run `npx prisma generate`. **Additive** — change no existing column; `@default(...)` makes the migration safe
  (existing rows get `""`/`false` via `prisma db push`).

**Test Plan:**
```bash
grep -qE 'avatarUrl +String +@default' prisma/schema.prisma && grep -qE 'phoneVerified +Boolean +@default\(false\)' prisma/schema.prisma && grep -qE 'position +String' prisma/schema.prisma && grep -qE 'timezone +String' prisma/schema.prisma && echo "OK profile fields"
grep -qE 'model WorkExperience' prisma/schema.prisma && grep -qE 'references: \[userId\], onDelete: Cascade' prisma/schema.prisma && echo "OK WorkExperience model"
npx prisma generate 2>&1 | tail -1
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK deletions" || echo "OK additive"
```
Expected: additive profile fields + `WorkExperience` model with cascade; client regenerated.

---

## Task 2: [x] `lib/profiles.ts` — helpers + onboarding datasets (contract-typed)

**Implementation Notes:**
- Create `lib/profiles.ts` (server-only):
  ```ts
  import { prisma } from '@/lib/prisma'
  import { getRatingForUser } from '@/lib/reviews'
  import type { ProfileHeaderVM, StatVM } from '@/app/components/blocks/view-models'

  // Onboarding dropdown datasets (RU market). Used by updateProfile validation + the Phase-2 wizard.
  export const TIMEZONES = [
    'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Samara', 'Asia/Yekaterinburg',
    'Asia/Omsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk',
    'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Kamchatka',
  ] as const
  export const SPECIALIZATIONS = [
    'Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'Data', 'QA', 'Design', 'Management',
  ] as const
  export const isTimezone = (s: string): boolean => (TIMEZONES as readonly string[]).includes(s)
  export const isSpecialization = (s: string): boolean => (SPECIALIZATIONS as readonly string[]).includes(s)

  // The exact ProfileHeaderVM shape this helper fulfils. Imported `import type` (erased at build) — no runtime UI coupling.
  export type ProfileHeaderData = ProfileHeaderVM

  export async function getProfileHeader(userId: string): Promise<ProfileHeaderData | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { specialistProfile: true, clientProfile: true },
    })
    if (!user) return null
    const sp = user.specialistProfile
    const cp = user.clientProfile
    const rating = await getRatingForUser(userId)
    const completed = await prisma.gig.count({
      where: { assignedSpecialistId: userId, status: 'COMPLETED' },
    })
    const name = sp?.displayName || cp?.companyName || user.email
    const roleTag = sp ? (sp.position || sp.specialization || sp.experienceLevel || 'Специалист') : 'Клиент'
    const stats: StatVM[] = [
      { label: 'Рейтинг', value: rating.value },
      { label: 'Отзывы', value: rating.count },
      { label: 'Завершено задач', value: completed },
    ]
    return {
      avatar: sp?.avatarUrl || cp?.avatarUrl || '',
      name,
      roleTag,
      verified: sp?.phoneVerified ?? cp?.phoneVerified ?? false,
      memberSince: user.createdAt.toISOString(), // member-since derived from createdAt (no new column)
      location: sp?.location || undefined,
      stats,
    }
  }

  export async function getWorkExperience(userId: string) {
    return prisma.workExperience.findMany({ where: { profileId: userId }, orderBy: { order: 'asc' } })
  }
  ```
  `ProfileHeaderData = ProfileHeaderVM` (imported `import type`) makes the return compile-time-checked against the
  contract; no runtime UI coupling. `memberSince` is derived from `createdAt` — no new column.

**Test Plan:**
```bash
test -f lib/profiles.ts && grep -qE 'import type .*ProfileHeaderVM' lib/profiles.ts && echo "contract-typed"
grep -qE 'getProfileHeader|getWorkExperience' lib/profiles.ts && grep -qE 'TIMEZONES|SPECIALIZATIONS' lib/profiles.ts && echo "helpers + datasets present"
grep -qE 'createdAt.toISOString' lib/profiles.ts && echo "memberSince from createdAt"
```
Expected: `lib/profiles.ts` with contract-typed `getProfileHeader`/`getWorkExperience` + datasets + validators; memberSince from `createdAt`.

---

## Task 3: [x] `updateProfile` accepts + validates the new optional fields

**Implementation Notes:**
- In `app/actions/profile.ts`, import `{ isTimezone, isSpecialization }` from `@/lib/profiles`.
- In the **SPECIALIST** branch, read + sanitize the new fields (mirror the existing `displayName` reads):
  ```ts
  const avatarUrl = sanitizeInput((formData.get('avatarUrl') as string) || '').trim()
  const phoneNumber = sanitizeInput((formData.get('phoneNumber') as string) || '').trim()
  const phoneVerified = formData.get('phoneVerified') === 'true' || formData.get('phoneVerified') === 'on'
  const position = sanitizeInput((formData.get('position') as string) || '').trim()
  const specialization = sanitizeInput((formData.get('specialization') as string) || '').trim()
  const location = sanitizeInput((formData.get('location') as string) || '').trim()
  const timezone = sanitizeInput((formData.get('timezone') as string) || '').trim()
  if (timezone && !isTimezone(timezone)) return { error: 'Please choose a valid timezone.' }
  if (specialization && !isSpecialization(specialization)) return { error: 'Please choose a valid specialization.' }
  ```
  Add `avatarUrl, phoneNumber, phoneVerified, position, specialization, location, timezone` to **both** the `create`
  and `update` data of the `specialistProfile.upsert`.
- In the **CLIENT** branch, read `avatarUrl` (sanitized) and `phoneVerified` (as above) and add them to both `create`
  and `update` of the `clientProfile.upsert`.
- **Keep optional** — absent → `''`/`false` (existing callers/tests unaffected); only the two new validation branches
  fire when a non-empty `timezone`/`specialization` is supplied. Do **not** change the existing fields/validation.

**Test Plan:**
```bash
grep -qE "formData.get\('avatarUrl'\)" app/actions/profile.ts && grep -qE "formData.get\('position'\)" app/actions/profile.ts && grep -qE "formData.get\('timezone'\)" app/actions/profile.ts && echo "reads new specialist fields"
grep -qE 'isTimezone|isSpecialization' app/actions/profile.ts && echo "validates timezone + specialization"
grep -qE "formData.get\('phoneVerified'\)" app/actions/profile.ts && echo "reads logical phoneVerified"
```
Expected: `updateProfile` accepts + validates the new optional fields per role; absent → defaults; off-dataset → error.

---

## Task 4: [x] `setWorkExperience` action (specialist, replace semantics)

**Implementation Notes:**
- In `app/actions/profile.ts`, add (mirror `setFavoriteCategories` in `app/actions/category.ts` — session gate,
  specialist-only, replace via a transaction):
  ```ts
  export async function setWorkExperience(
    prevState: { error?: string; success?: boolean } | null,
    formData: FormData
  ) {
    const session = await getSession()
    if (!session) redirect('/login')
    if (session.role !== 'SPECIALIST') return { error: 'Only specialists can edit work experience.' }

    // Parse a JSON list of entries from the form (the Phase-2 form serializes its rows here).
    let entries: { company: string; title?: string; description?: string; startYear?: number | null; endYear?: number | null }[]
    try {
      entries = JSON.parse((formData.get('entries') as string) || '[]')
    } catch {
      return { error: 'Invalid work experience data.' }
    }
    const nowYear = new Date().getFullYear()
    const clean = []
    for (const [i, e] of entries.entries()) {
      const company = sanitizeInput((e.company || '').toString()).trim()
      if (!company) return { error: 'Each work experience entry needs a company.' }
      const startYear = e.startYear == null || e.startYear === ('' as any) ? null : Number(e.startYear)
      const endYear = e.endYear == null || e.endYear === ('' as any) ? null : Number(e.endYear)
      if (startYear != null && (!Number.isInteger(startYear) || startYear < 1970 || startYear > nowYear)) return { error: 'Start year is invalid.' }
      if (endYear != null && (!Number.isInteger(endYear) || endYear < 1970 || endYear > nowYear)) return { error: 'End year is invalid.' }
      if (startYear != null && endYear != null && endYear < startYear) return { error: 'End year cannot be before start year.' }
      clean.push({
        company,
        title: sanitizeInput((e.title || '').toString()).trim(),
        description: sanitizeInput((e.description || '').toString()).trim(),
        startYear, endYear, order: i,
      })
    }
    // Replace semantics — the specialist's list is authoritative.
    await prisma.$transaction([
      prisma.workExperience.deleteMany({ where: { profileId: session.userId } }),
      ...(clean.length ? [prisma.workExperience.createMany({ data: clean.map((c) => ({ ...c, profileId: session.userId })) })] : []),
    ])
    return { success: true }
  }
  ```
  (Ensure the file imports `prisma`, `getSession`, `redirect`, `sanitizeInput` — `redirect` and the others are
  already imported by `updateProfile`.) `createMany` requires the `SpecialistProfile` (with PK `userId`) to exist —
  the specialist's profile is created by `updateProfile`/onboarding first; document this ordering.

**Test Plan:**
```bash
grep -qE 'export async function setWorkExperience' app/actions/profile.ts && echo "action present"
grep -qE "role !== 'SPECIALIST'" app/actions/profile.ts && grep -qE 'workExperience.deleteMany' app/actions/profile.ts && echo "specialist-only + replace semantics"
```
Expected: specialist-only `setWorkExperience` with replace semantics + per-entry validation (company required, sane years).

---

## Task 5: [x] Seed the new fields + work experience + FK-safe reset

**Implementation Notes:**
- In `prisma/seed.ts` (a post-pass after specialists are upserted, mirroring the gig-deadline idempotent approach):
  for each seeded `SpecialistProfile` still at defaults (e.g. `position === ''`), `prisma.specialistProfile.update`
  with a realistic `position` (e.g. derived from `experienceLevel` + a specialization), `specialization` (from
  `SPECIALIZATIONS`), `location` (e.g. 'Москва'/'Санкт-Петербург'), `timezone` (e.g. 'Europe/Moscow'), `avatarUrl`
  (`''` or a seeded asset path), `phoneNumber`, and `phoneVerified` (set `true` for a couple). Then, for specialists
  with **no** `workExperience`, `prisma.workExperience.createMany` 1–2 entries (company/title/years/order).
  Idempotent (only touches still-default profiles / those with no experience). May `import { SPECIALIZATIONS } from
  '@/lib/profiles'` or inline the values.
- In `__tests__/helpers/db.ts` `resetTestDatabase`: add `await prisma.workExperience.deleteMany()` **before**
  `await prisma.specialistProfile.deleteMany()` (WorkExperience → SpecialistProfile → User; cascade is the backstop).

**Test Plan:**
```bash
grep -qiE 'avatarUrl|position|workExperience' prisma/seed.ts && echo "seed assigns new fields / work experience"
grep -qE 'prisma.workExperience.deleteMany' __tests__/helpers/db.ts && echo "FK-safe reset"
```
Expected: idempotent seed of the new fields + work experience; reset deletes work experience FK-safely.

---

## Task 6: [x] Integration tests

**Implementation Notes:**
- Add `__tests__/integration/profile-evolution.test.ts` (mock `@/lib/prisma`, `next/headers`, `next/navigation`;
  `createTestUser`; `withAuthContext`). Import the actions/helpers **after** the mocks. Cover:
  - **edit (specialist scalars):** as a SPECIALIST, `updateProfile` with `avatarUrl`/`phoneNumber`/`phoneVerified=true`/
    `position`/`specialization` (valid)/`location`/`timezone` (valid) → the `SpecialistProfile` persists them;
    existing `displayName`/`techStack`/`bio` still persist.
  - **edit (client scalars):** as a CLIENT, `updateProfile` with `avatarUrl`/`phoneVerified=true` → `ClientProfile`
    persists them; `companyName`/`inn` unchanged.
  - **validation:** `updateProfile` with `timezone='Mars/Phobos'` or `specialization='Astrology'` → `{ error }`, no
    change.
  - **work experience:** `setWorkExperience` (specialist) with two entries → `getWorkExperience` returns both ordered
    by `order`; re-set with one entry → replaced to one; a non-specialist → `{ error }`; an entry with empty
    `company` → `{ error }`; `endYear < startYear` → `{ error }`.
  - **display / contract:** `getProfileHeader(userId)` returns avatar/name/roleTag/verified(=phoneVerified)/
    memberSince(from `createdAt`)/location/stats; a compile-time `const _h: ProfileHeaderVM = (await
    getProfileHeader(id))!` (import type `ProfileHeaderVM`); `getWorkExperience` for a no-experience user → `[]`.
  - **existing profiles unaffected (defaults):** a profile created via `updateProfile` with only the old fields →
    `avatarUrl===''`, `phoneVerified===false`, `position===''`, etc.; `getProfileHeader` still valid.
  - **datasets:** `TIMEZONES`/`SPECIALIZATIONS` non-empty; `isTimezone('Europe/Moscow')===true`,
    `isTimezone('x')===false`.

**Test Plan:**
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/profile-evolution.test.ts 2>&1 | tail -12
```
Expected: edit (specialist/client), validation, work experience (set/query/replace/role/invalid), display/contract, defaults, datasets — all pass.

---

## Task 7: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec Test Plan (schema/helpers, updateProfile fields, setWorkExperience,
  tests, seed, FK-safe reset, typecheck, build, full suite clean DB, lints).
- Confirm scope: additive; no UI/screen/component changes (`app/components`, `app/workbench`, `app/(protected)/profile`
  and the onboarding wizard untouched); `view-models.ts` unchanged; no avatar-upload pipeline; no real SMS
  verification; the existing `profile` / auth integration + E2E tests still green.

**Test Plan:**
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/profiles|app/actions/profile|profile-evolution.test" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "token baseline unchanged"
git diff --quiet app/components/blocks/view-models.ts && echo "view-models SSOT unchanged"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/\(protected\)/' && echo "CHECK UI modified" || echo "OK no UI changes"
```
Expected: all gates green; additive; no UI changes; existing profile/auth tests unaffected.

---

## Summary

Total tasks: 7
Estimated effort: 5–7 hours (friction: medium — additive fields on two profile tables + a new model + helpers + datasets + two action paths + seed + tests)

**Deliverables:**
- ✅ `SpecialistProfile` +7 fields (avatar, phone, phoneVerified, position, specialization, location, timezone) + `ClientProfile` +2 (avatarUrl, phoneVerified); `WorkExperience` model; client regenerated.
- ✅ `lib/profiles.ts` — contract-typed `getProfileHeader` (memberSince from `createdAt`, verified from `phoneVerified`) + `getWorkExperience` + `TIMEZONES`/`SPECIALIZATIONS` datasets + validators.
- ✅ `updateProfile` accepts + validates the new optional fields per role; `setWorkExperience` (specialist-only, replace) edits the work history.
- ✅ Idempotent seed (new fields + work experience); FK-safe `resetTestDatabase`; `profile-evolution.test.ts`.

**Critical path:** schema + model (1) → helpers + datasets (2) → updateProfile fields (3) → setWorkExperience (4) → seed + reset (5) → tests (6) → acceptance (7).

**Scope guards (non-goals):**
- No UI wiring (Phase 2: `compose-profile`, `compose-auth-onboarding`); no avatar-upload pipeline; no real SMS verification; new fields optional on edit; no change to existing profile fields/flows or `view-models.ts`; no other-domain changes.

**Success criteria:**
- ✅ Additive profile fields + `WorkExperience` model with defaults; client regenerated; existing profiles graceful
- ✅ `updateProfile` accepts + validates new optional fields (rejects off-dataset timezone/specialization); `setWorkExperience` replace + specialist-only
- ✅ `getProfileHeader` matches `ProfileHeaderVM` (memberSince/verified); datasets typed; `build` + `test:unit` (clean DB) + lints green; no UI changes
