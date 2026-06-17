# Profile Specification Delta: profile-evolution

This document contains specification changes for the `profile-evolution` change — a Phase-1 **data** change that
extends the existing `profile` domain. It fulfills the `ProfileHeader` / `ExperienceList` / onboarding view-model
contracts (`docs/DESIGN_SYSTEM_SPEC.md` §5 / `ProfileHeaderVM`) with additive profile fields (avatar, phone +
verified [logical], position, specialization, location, timezone), a new `WorkExperience` model, member-since derived
from `User.createdAt`, contract-typed query helpers, and onboarding dropdown datasets. It ships **profile fields + a
model + `updateProfile`/`setWorkExperience` support + helpers + datasets + seed + tests only** — additive, with **no
UI wiring** (Phase 2 binds the fields into ProfileHeader/ExperienceList and the onboarding wizard), no avatar-upload
pipeline, and no real SMS verification.

---

## ADDED Requirements

### Requirement: Profile Identity and Professional Fields
`SpecialistProfile` MUST gain `avatarUrl`, `phoneNumber`, `phoneVerified`, `position`, `specialization`, `location`,
and `timezone`, and `ClientProfile` MUST gain `avatarUrl` and `phoneVerified`, all additively with backward-compatible
defaults, fulfilling the `ProfileHeaderVM` (avatar / verified / location / roleTag) contract.

#### Scenario: Fields exist with backward-compatible defaults
- GIVEN the schema
- WHEN the profile models are inspected
- THEN `SpecialistProfile` MUST have `avatarUrl String @default("")`, `phoneNumber String @default("")`,
  `phoneVerified Boolean @default(false)`, `position String @default("")`, `specialization String @default("")`,
  `location String @default("")`, `timezone String @default("")`
- AND `ClientProfile` MUST have `avatarUrl String @default("")` and `phoneVerified Boolean @default(false)` (it
  already has `phoneNumber`)
- AND only these columns are added (no existing column changed); `npx prisma generate` MUST be run

#### Scenario: Phone verification is a logical flag
- GIVEN `phoneVerified`
- WHEN its semantics are considered
- THEN it MUST be a **logical** flag (no SMS gateway in the MVP, mirroring the logical `PAID` status) — settable
  without a real verification flow; `ProfileHeaderVM.verified` maps to it (identity verification), distinct from the
  rating's transaction-`verified`

**Acceptance Criteria:**
- `SpecialistProfile` +7 fields, `ClientProfile` +2 fields, all with defaults (`""` / `false`); additive; client regenerated
- `phoneVerified` is a logical flag (no real SMS verification); `avatarUrl` is a string (asset path/URL — no upload pipeline)

---

### Requirement: WorkExperience Model
The schema MUST add a `WorkExperience` model (1:N from a specialist's profile) carrying a work-history entry,
fulfilling the `ExperienceList` block ("Опыт работы").

#### Scenario: WorkExperience is a profile sub-entity
- GIVEN the schema
- WHEN the `WorkExperience` model is inspected
- THEN it MUST have `id`, `profileId` (FK → `SpecialistProfile.userId`, `onDelete: Cascade`), `company`, `title`
  (default `""`), `description` (default `""`), `startYear Int?`, `endYear Int?` (null = current — "по настоящее
  время"), `order Int @default(0)`, and timestamps, indexed on `profileId`
- AND it MUST be additive (no existing model/column changed); `npx prisma generate` MUST be run

#### Scenario: Work history is read for the ExperienceList contract
- GIVEN a specialist with work-experience entries
- WHEN `getWorkExperience(userId)` is called
- THEN it MUST return the entries **ordered** (by `order`) — the data the `ExperienceList` block renders; a specialist
  with none MUST yield `[]` (graceful)

**Acceptance Criteria:**
- `WorkExperience` model (1:N from `SpecialistProfile`, `onDelete: Cascade`); additive; client regenerated
- `getWorkExperience` returns ordered entries (or `[]`) for the ExperienceList contract

---

### Requirement: Edit Support for the New Profile Fields
`updateProfile` MUST accept + persist the new **optional** fields per role, and a `setWorkExperience` action MUST let
a specialist replace their work history — both backward-compatible.

#### Scenario: updateProfile persists the new specialist fields
- GIVEN an authenticated SPECIALIST calling `updateProfile`
- WHEN `avatarUrl`, `phoneNumber`, `phoneVerified`, `position`, `specialization`, `location`, and/or `timezone` are
  supplied (with valid `timezone`/`specialization`)
- THEN the `SpecialistProfile` MUST persist those values (alongside the existing `displayName`/`techStack`/
  `experienceLevel`/`bio`)

#### Scenario: updateProfile persists the new client fields
- GIVEN an authenticated CLIENT calling `updateProfile`
- WHEN `avatarUrl` and/or `phoneVerified` are supplied
- THEN the `ClientProfile` MUST persist those values (alongside the existing company fields)

#### Scenario: New fields are optional (backward-compatible)
- GIVEN `updateProfile` called without any new fields (the existing behaviour)
- WHEN the profile is upserted
- THEN it MUST succeed unchanged, the new fields taking their defaults (`""` / `false`); existing callers/tests are
  unaffected
- AND a non-empty `timezone`/`specialization` not in the canonical datasets MUST be rejected with a clear error and
  no record modified

#### Scenario: setWorkExperience replaces a specialist's work history
- GIVEN an authenticated SPECIALIST
- WHEN `setWorkExperience` is called with a list of entries (each with a non-empty `company`, sane years)
- THEN the specialist's `WorkExperience` MUST be **replaced** by exactly that list (delete + recreate); re-calling
  with a different list MUST replace (not append)
- AND a non-specialist (or unauthenticated) caller MUST be rejected (specialist-only; unauthenticated → `/login`)
- AND an entry with an empty `company` (or invalid years) MUST be rejected with a clear error

**Acceptance Criteria:**
- `updateProfile` accepts + validates + persists the new optional fields per role; absent → defaults; invalid timezone/specialization → error
- `setWorkExperience` (specialist-only, replace semantics, validated) edits the work history; existing profile flows unaffected

---

### Requirement: ProfileHeader Contract, Datasets, and Verification
`lib/profiles.ts` MUST expose helpers fulfilling the `ProfileHeaderVM`/`ExperienceList` contracts and the onboarding
datasets, the result MUST match the contract, and the suite MUST stay green with additive, FK-safe test isolation.

#### Scenario: getProfileHeader fulfils the ProfileHeaderVM contract
- GIVEN a user (with a profile)
- WHEN `getProfileHeader(userId)` is called
- THEN it MUST return the `ProfileHeaderVM` shape — `avatar` (from `avatarUrl`), `name`, `roleTag` (from `position`/
  `specialization`), `verified` (= `phoneVerified`), `memberSince` (derived from `User.createdAt`), `location`, and
  `stats` (merged from `getRatingForUser` + a completed-gig count) — assignable to `ProfileHeaderVM`; view-model types
  imported `import type` (no runtime UI coupling)

#### Scenario: Member-since is derived from createdAt (no new column)
- GIVEN a user with a `createdAt`
- WHEN `getProfileHeader` builds `memberSince`
- THEN it MUST be derived from `User.createdAt` (a `DateISO` string) — no new column is added for it

#### Scenario: Onboarding dropdown datasets exist and are typed
- GIVEN `lib/profiles.ts`
- WHEN `TIMEZONES` and `SPECIALIZATIONS` are inspected
- THEN they MUST be canonical (RU-market) datasets for the onboarding selects, with `isTimezone`/`isSpecialization`
  validators used by `updateProfile`

#### Scenario: Existing profiles are graceful (defaults)
- GIVEN a profile created without the new fields (e.g. before this change)
- WHEN it is read
- THEN the new fields MUST be their defaults (`""` / `false`), `getProfileHeader` MUST still return a valid shape, and
  `getWorkExperience` MUST return `[]` — no error, fully backward-compatible

#### Scenario: Additive — suite green, FK-safe reset
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with no change to existing flows; `resetTestDatabase` MUST delete `workExperience` FK-safely
  (before the profile/user deletes); `npm run lint:tokens` + `npm run lint:composition` MUST stay green (no UI change)

**Acceptance Criteria:**
- `getProfileHeader` returns the `ProfileHeaderVM` shape (memberSince from `createdAt`, verified from `phoneVerified`); `getWorkExperience` works; `TIMEZONES`/`SPECIALIZATIONS` typed
- Existing profiles default gracefully; `npm run build` + `npm run test:unit` green; FK-safe reset; additive

---

## Test Plan

This change ships profile fields + a `WorkExperience` model + `updateProfile`/`setWorkExperience` support + helpers +
datasets + seed + tests. Validation is by deterministic commands. Commands assume the repo root.

### Schema + helpers + client
```bash
grep -qE 'avatarUrl +String +@default' prisma/schema.prisma && grep -qE 'phoneVerified +Boolean +@default\(false\)' prisma/schema.prisma && echo "identity fields present"
grep -qE 'position +String +@default' prisma/schema.prisma && grep -qE 'specialization +String' prisma/schema.prisma && grep -qE 'timezone +String' prisma/schema.prisma && echo "professional fields present"
grep -qE 'model WorkExperience' prisma/schema.prisma && echo "WorkExperience model present"
test -f lib/profiles.ts && grep -qE 'import type .*ProfileHeaderVM' lib/profiles.ts && grep -qE 'getProfileHeader|getWorkExperience' lib/profiles.ts && grep -qE 'TIMEZONES|SPECIALIZATIONS' lib/profiles.ts && echo "helpers + datasets typed to contract"
npx prisma generate >/dev/null 2>&1 && echo "client regenerated"
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK schema deletions" || echo "OK schema additive"
```

### updateProfile accepts the new fields; setWorkExperience present
```bash
grep -qE "formData.get\('avatarUrl'\)|formData.get\('position'\)|formData.get\('timezone'\)" app/actions/profile.ts && echo "updateProfile reads new fields"
grep -qE 'setWorkExperience' app/actions/profile.ts && grep -qE "role !== 'SPECIALIST'|role === 'SPECIALIST'" app/actions/profile.ts && echo "setWorkExperience specialist-gated"
```

### Tests (edit / display / defaults / contract / validation / datasets)
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/profile-evolution.test.ts 2>&1 | tail -10
```

### Seed (idempotent) + FK-safe reset
```bash
grep -qiE 'avatarUrl|position|workExperience' prisma/seed.ts && echo "seed assigns the new fields / work experience"
grep -qE 'prisma.workExperience.deleteMany' __tests__/helpers/db.ts && echo "FK-safe workExperience cleanup in reset"
```

### Typecheck + build + suite + scope (additive, no UI change)
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/profiles|app/actions/profile|profile-evolution.test" && echo "CHECK type error" || echo "OK new/changed files type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green (no UI change)"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/\(protected\)/' && echo "CHECK UI modified" || echo "OK no UI changes"
```

### Manual review
1. Confirm the profile fields + `WorkExperience` are additive with defaults, client regenerated; `view-models.ts` unchanged.
2. Confirm `updateProfile` accepts + validates the new optional fields per role (rejects off-dataset timezone/specialization); absent → defaults (existing profile tests green).
3. Confirm `setWorkExperience` replaces a specialist's history (specialist-only, validated); `getWorkExperience` returns it ordered.
4. Confirm `getProfileHeader` matches `ProfileHeaderVM` (memberSince from `createdAt`, verified from `phoneVerified`) and no screen/form/onboarding is wired yet (Phase 2).
