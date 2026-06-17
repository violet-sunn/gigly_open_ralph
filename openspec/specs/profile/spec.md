# Profile Specification

## Requirements

### Requirement: Update Profile Server Action
The system MUST provide an `updateProfile` server action that creates or updates the authenticated user's profile in their respective profile table (ClientProfile or SpecialistProfile).

#### Scenario: SPECIALIST creates profile for first time
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user has no SpecialistProfile record yet
- WHEN `updateProfile` is called with valid profile data
- THEN a SpecialistProfile record MUST be created with `userId` as primary key
- AND the action MUST redirect to `/profile`

#### Scenario: CLIENT creates profile for first time
- GIVEN an authenticated user with role "CLIENT"
- AND the user has no ClientProfile record yet
- WHEN `updateProfile` is called with valid profile data
- THEN a ClientProfile record MUST be created with `userId` as primary key
- AND companyName and inn MUST be non-empty strings
- AND the action MUST redirect to `/profile`

#### Scenario: CLIENT submits without required fields
- GIVEN a CLIENT user submits a form with empty companyName or inn
- WHEN `updateProfile` is called
- THEN it MUST return `{ error: 'Company name and INN are required.' }`
- AND no records MUST be created or modified

#### Scenario: Invalid experience level
- GIVEN a SPECIALIST user submits experienceLevel with value other than "", "MIDDLE", or "SENIOR"
- WHEN `updateProfile` is called
- THEN it MUST return `{ error: 'Experience level must be MIDDLE or SENIOR.' }`
- AND no records MUST be modified

#### Scenario: Upsert operation
- GIVEN a user submits the profile form
- WHEN `updateProfile` is called
- THEN it MUST use Prisma's `upsert` operation
- AND this MUST handle both first-time creation and subsequent updates

**Acceptance Criteria:**
- `updateProfile` is exported from `app/actions/profile.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)`
- Uses role-based logic to determine which profile table to upsert
- For SPECIALIST: validates experienceLevel
- For CLIENT: validates companyName and inn are non-empty
- Uses Prisma `upsert` to handle both create and update cases
- On success: redirects to `/profile`
- On failure: returns `{ error: string }`

### Requirement: Profile Identity and Professional Fields
`SpecialistProfile` MUST carry `avatarUrl`, `phoneNumber`, `phoneVerified`, `position`, `specialization`, `location`,
and `timezone`, and `ClientProfile` MUST carry `avatarUrl` and `phoneVerified`, all with backward-compatible defaults,
fulfilling the `ProfileHeaderVM` (avatar / verified / location / roleTag) contract (`docs/DESIGN_SYSTEM_SPEC.md` §5).

#### Scenario: Fields exist with backward-compatible defaults
- GIVEN the schema
- WHEN the profile models are inspected
- THEN `SpecialistProfile` MUST have `avatarUrl String @default("")`, `phoneNumber String @default("")`,
  `phoneVerified Boolean @default(false)`, `position String @default("")`, `specialization String @default("")`,
  `location String @default("")`, `timezone String @default("")`
- AND `ClientProfile` MUST have `avatarUrl String @default("")` and `phoneVerified Boolean @default(false)` (it
  already has `phoneNumber`)

#### Scenario: Phone verification is a logical flag
- GIVEN `phoneVerified`
- WHEN its semantics are considered
- THEN it MUST be a **logical** flag (no SMS gateway in the MVP, mirroring the logical `PAID` status) — settable
  without a real verification flow; `ProfileHeaderVM.verified` maps to it (identity verification), distinct from the
  rating's transaction-`verified`

**Acceptance Criteria:**
- `SpecialistProfile` +7 fields, `ClientProfile` +2 fields, all with defaults (`""` / `false`)
- `phoneVerified` is a logical flag (no real SMS verification); `avatarUrl` is a string (asset path/URL — no upload pipeline)

### Requirement: WorkExperience Model
The schema MUST provide a `WorkExperience` model (1:N from a specialist's profile) carrying a work-history entry,
fulfilling the `ExperienceList` block ("Опыт работы").

#### Scenario: WorkExperience is a profile sub-entity
- GIVEN the schema
- WHEN the `WorkExperience` model is inspected
- THEN it MUST have `id`, `profileId` (FK → `SpecialistProfile.userId`, `onDelete: Cascade`), `company`, `title`
  (default `""`), `description` (default `""`), `startYear Int?`, `endYear Int?` (null = current — "по настоящее
  время"), `order Int @default(0)`, and timestamps, indexed on `profileId`

#### Scenario: Work history is read for the ExperienceList contract
- GIVEN a specialist with work-experience entries
- WHEN `getWorkExperience(userId)` is called
- THEN it MUST return the entries **ordered** (by `order`); a specialist with none MUST yield `[]` (graceful)

**Acceptance Criteria:**
- `WorkExperience` model (1:N from `SpecialistProfile`, `onDelete: Cascade`); `getWorkExperience` returns ordered entries (or `[]`)

### Requirement: Edit Support for the New Profile Fields
`updateProfile` MUST accept + persist the new **optional** fields per role, and a `setWorkExperience` action MUST let
a specialist replace their work history — both backward-compatible.

#### Scenario: updateProfile persists the new specialist fields
- GIVEN an authenticated SPECIALIST calling `updateProfile`
- WHEN `avatarUrl`, `phoneNumber`, `phoneVerified`, `position`, `specialization`, `location`, and/or `timezone` are
  supplied (with valid `timezone`/`specialization`)
- THEN the `SpecialistProfile` MUST persist those values (alongside the existing fields)

#### Scenario: updateProfile persists the new client fields
- GIVEN an authenticated CLIENT calling `updateProfile`
- WHEN `avatarUrl` and/or `phoneVerified` are supplied
- THEN the `ClientProfile` MUST persist those values (alongside the existing company fields)

#### Scenario: New fields are optional (backward-compatible)
- GIVEN `updateProfile` called without any new fields (the existing behaviour)
- WHEN the profile is upserted
- THEN it MUST succeed unchanged, the new fields taking their defaults (`""` / `false`)
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

### Requirement: ProfileHeader Contract, Datasets, and Member-Since
`lib/profiles.ts` MUST expose helpers fulfilling the `ProfileHeaderVM`/`ExperienceList` contracts and the onboarding
datasets, with `memberSince` derived from `User.createdAt`.

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
- GIVEN a profile created without the new fields
- WHEN it is read
- THEN the new fields MUST be their defaults (`""` / `false`), `getProfileHeader` MUST still return a valid shape, and
  `getWorkExperience` MUST return `[]` — no error, fully backward-compatible

**Acceptance Criteria:**
- `getProfileHeader` returns the `ProfileHeaderVM` shape (memberSince from `createdAt`, verified from `phoneVerified`); `getWorkExperience` works; `TIMEZONES`/`SPECIALIZATIONS` typed
- Existing profiles default gracefully; the change is additive with `resetTestDatabase` deleting `workExperience` FK-safely
