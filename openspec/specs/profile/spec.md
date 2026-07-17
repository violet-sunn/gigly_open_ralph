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
- AND companyName MUST be a non-empty string
- AND инн/кпп MUST be optional (clients register with the design's minimal set and fill requisites later)
- AND the action MUST redirect to `/profile`

#### Scenario: CLIENT submits without a company name
- GIVEN a CLIENT user submits a form with an empty companyName
- WHEN `updateProfile` is called
- THEN it MUST return `{ error: 'Укажите название компании, чтобы завершить профиль.' }`
- AND no records MUST be created or modified

#### Scenario: CLIENT requisites (ИНН/КПП) are format-checked when supplied
- GIVEN a CLIENT user submits a non-empty `inn` or `kpp`
- WHEN `updateProfile` is called
- THEN a non-digit value MUST be rejected with `{ error: 'ИНН может состоять только из цифр.' }` (or the КПП
  equivalent) — ASCII digits only, so Arabic-Indic/fullwidth look-alikes and any embedded space are rejected
- AND an `inn` whose length is not 10 (organisation) or 12 (ИП) MUST be rejected with
  `{ error: 'ИНН должен содержать 10 цифр (для организации) или 12 (для ИП).' }`
- AND a `kpp` whose length is not exactly 9 MUST be rejected with `{ error: 'КПП должен содержать ровно 9 цифр.' }`
- AND the rejected value MUST NOT be persisted
- AND an EMPTY inn/kpp MUST still pass, so a client without requisites can save the rest of the profile
- AND the format MUST be owned once by `lib/requisites.ts` (`validateInn` / `validateKpp`), which stays client-safe so
  the form can mirror it; `updateProfile` is the authority — the form's `inputMode`/`maxLength` are hints only

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
- For CLIENT: validates companyName is non-empty; ИНН/КПП are optional but, when supplied, MUST satisfy
  `validateInn`/`validateKpp` from `lib/requisites.ts` (digits only; ИНН 10 or 12, КПП exactly 9)
- Requisite validation is format-only by decision (2026-07-17): no ИНН control-digit (checksum) check and no ФНС
  registry lookup, so a well-formed but fake value such as `0000000000` still passes
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

<!-- Merged from change `profile-experience-fixes` (2026-07-14): profile-screen edit affordances,
     experience-level field, and the real online indicator (heartbeat + User.lastSeenAt). -->

### Requirement: Unmistakable Edit Affordance (pencil means edit, not save)
The profile screen's per-block edit controls MUST clearly signal **edit**, open an edit surface, and
persist changes ONLY through an explicit Save action. Clicking a *displayed* field MUST NOT itself
save or mutate data. Edit controls MUST be shown to the owner only.

#### Scenario: Pencil opens edit mode and does not save
- GIVEN an owner viewing their own profile
- WHEN they activate a block's edit (pencil) control
- THEN an edit modal for that block MUST open with the current values pre-filled
- AND no data MUST be written by the act of opening (no save occurs on click)

#### Scenario: Explicit Save persists
- GIVEN an open edit modal with modified values
- WHEN the owner activates the modal's «Сохранить» button
- THEN `updateProfile` (or the relevant action) MUST persist the change
- AND on success the modal MUST close and the profile MUST reflect the new values

#### Scenario: Closing without Save discards
- GIVEN an open edit modal with modified values
- WHEN the owner dismisses the modal (✕ / overlay) without pressing Save
- THEN no change MUST be persisted and the displayed values MUST be unchanged

#### Scenario: The edit affordance is unambiguous
- GIVEN the pencil edit control
- WHEN it is inspected
- THEN it MUST carry an accessible label and `title` conveying "Редактировать" (edit), so it is not
  mistaken for a save control, and it MUST present a pointer/hover affordance

**Acceptance Criteria:**
- Every owner edit control opens a modal (does not save on click); the modal's explicit «Сохранить» is
  the only persist path; dismissing discards
- Edit controls render for `isOwner` only and expose an "edit" `aria-label`/`title` (the labeled
  `EditButton` component — pencil glyph + «Редактировать»)

### Requirement: Obvious Client-Profile Edit Entry Point
The CLIENT profile MUST present a clear, labeled «Редактировать» control (not only a bare pencil) as
the entry point to edit company data, aligning the CLIENT and SPECIALIST edit affordances.

#### Scenario: Client owner sees an obvious edit button
- GIVEN a CLIENT owner viewing their own profile
- WHEN the profile renders
- THEN a visibly labeled «Редактировать» control MUST be present as the edit entry point
- AND activating it MUST open the company requisites edit modal (companyName / inn / kpp / about)

#### Scenario: Non-owner sees no edit control
- GIVEN a viewer who is not the profile owner
- WHEN a CLIENT profile renders
- THEN no «Редактировать» control and no edit pencils MUST be shown

#### Scenario: Both roles' edit affordances are aligned
- GIVEN the SPECIALIST and CLIENT profiles
- WHEN each renders for its owner
- THEN both MUST expose a clearly labeled edit affordance (not a bare unlabeled icon) as the entry to
  editing profile data

**Acceptance Criteria:**
- CLIENT profile shows a labeled «Редактировать» button opening the requisites modal (owner-only)
- SPECIALIST and CLIENT edit entry points are consistent (labeled, obvious); non-owners see none

### Requirement: Experience Level Is Settable and Displayed
The SPECIALIST profile MUST expose `experienceLevel` (Middle / Senior) as an explicit selector in an
edit surface and MUST display the chosen level on the profile alongside Стек / Опыт.

#### Scenario: Level selector appears in the edit modal
- GIVEN a SPECIALIST owner opening the relevant profile edit modal (the «Опыт» modal)
- WHEN the modal renders
- THEN it MUST offer an explicit Middle / Senior selector pre-set to the current `experienceLevel`

#### Scenario: Level persists via updateProfile
- GIVEN the level selector set to MIDDLE or SENIOR
- WHEN the owner saves
- THEN `updateProfile` MUST persist `experienceLevel` (its existing MIDDLE/SENIOR-or-empty validation
  unchanged) and the profile MUST reflect it

#### Scenario: Level is displayed on the profile
- GIVEN a SPECIALIST profile with a non-empty `experienceLevel`
- WHEN the profile renders
- THEN the level MUST be shown explicitly (a labeled badge beside «Опыт»), not only as a `roleTag`
  fallback

#### Scenario: Empty level is graceful
- GIVEN a SPECIALIST profile with `experienceLevel === ""`
- WHEN the profile renders
- THEN it MUST render without error and MUST NOT display a misleading level

**Acceptance Criteria:**
- A Middle/Senior selector is present in a specialist edit modal, pre-filled, persisted via
  `updateProfile` (no server-action contract change)
- The chosen level is displayed explicitly on the profile (`ProfileData.experienceLevel`); empty level
  renders gracefully

### Requirement: Real Online Indicator via lastSeenAt Heartbeat
The system MUST derive a real online indicator from a last-seen timestamp updated by a lightweight
authenticated heartbeat, gated by the target user's `showOnlineStatus`, and the profile UI MUST render
that real state rather than a hardcoded value. The mechanism MUST be self-hosted (no third-party
service).

#### Scenario: User carries a nullable last-seen timestamp
- GIVEN the schema
- WHEN the `User` model is inspected
- THEN it MUST have `lastSeenAt DateTime?` (nullable, no default) — additive and backward-compatible
  (existing rows read as `null`)

#### Scenario: Heartbeat updates lastSeenAt for the authenticated user
- GIVEN an authenticated user
- WHEN the `heartbeat` server action is invoked
- THEN it MUST set that user's `lastSeenAt` to the current time
- AND an unauthenticated invocation MUST be a no-op (no write; not an error page)

#### Scenario: getProfile computes a real online state
- GIVEN a target user with `showOnlineStatus === true` and `lastSeenAt` within the online window
  (5 minutes)
- WHEN `getProfile` builds the header
- THEN `header.online` MUST be `true`
- AND a target whose `lastSeenAt` is null or older than the window MUST yield `header.online === false`

#### Scenario: showOnlineStatus off forces offline
- GIVEN a target user with `showOnlineStatus === false`
- WHEN `getProfile` builds the header
- THEN `header.online` MUST be `false` regardless of `lastSeenAt` (shown offline to all viewers)

#### Scenario: An active user is no longer shown as offline
- GIVEN an authenticated user whose client has recently sent a heartbeat and who has
  `showOnlineStatus === true`
- WHEN they view their own profile
- THEN the profile MUST show the online state (not the previously hardcoded «offline»)

#### Scenario: The profile UI renders the real online state
- GIVEN `header.online`
- WHEN `ProfileDesign` renders the status pill
- THEN the pill's dot colour and label MUST be driven by `header.online` (online vs offline), replacing
  the hardcoded offline markup

**Acceptance Criteria:**
- `User.lastSeenAt DateTime?` added (additive `db push`, no data migration)
- `heartbeat` server action (authenticated-only; unauthenticated = no-op) touches `lastSeenAt`; a
  shell-mounted client ping (`<Heartbeat/>`) fires it on an interval (~60s)
- `getProfile` sets `header.online = showOnlineStatus && lastSeenAt && (now − lastSeenAt) < 5min`
  (both SPECIALIST and CLIENT branches; the hardcoded `online:false` is removed)
- `ProfileDesign` renders the pill from `header.online` (hardcoded offline markup removed)
- No third-party/paid dependency is added
