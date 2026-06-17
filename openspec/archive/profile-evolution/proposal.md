# Change Proposal: profile-evolution

> Phase 1, change 13 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> fulfills the `ProfileHeader` / `ExperienceList` / onboarding view-model contracts (`docs/DESIGN_SYSTEM_SPEC.md` §5 /
> `ProfileHeaderVM`) with additive profile fields — **avatar**, **phone + verified (logical)**, **position**,
> **specialization**, **location**, **timezone** — a new **`WorkExperience`** model, and **member-since derived from
> `User.createdAt`**. Additive with defaults; **no UI wiring** (Phase 2 binds the fields into ProfileHeader/
> ExperienceList and the onboarding wizard).

## Problem Statement

`ProfileHeaderVM` declares `avatar`, `name`, `roleTag`, `verified`, `memberSince`, `location`, and `stats`; the
`ExperienceList` block (§3.2) renders a specialist's work history ("Опыт работы"); and the 3-step onboarding wizard's
step 3 collects professional profile fields — all rendered today **from fixtures**. There is no real data:

- `SpecialistProfile` carries only `displayName`, `techStack`, `experienceLevel`, `bio` — there is **no avatar, no
  phone/verification flag, no position/specialization/location/timezone**, so a ProfileHeader can't show the
  identity, role tag, verified badge, or location the design requires.
- There is **no work-history model** — the profile page renders `bio`/`techStack` as a stand-in for "Опыт работы";
  the `ExperienceList` block has **nothing real to bind**.
- "Member since" is shown in the header, but nothing surfaces `User.createdAt` in the view-model shape.
- The onboarding wizard's step 3 (Phase 2 `compose-auth-onboarding`) has **no fields to write** and **no dropdown
  datasets** (specialization, timezone) to populate its selects.

`lib/reviews.ts` already anticipates this change: `getRatingForUser` notes that "profile-evolution (#13) will fold in
identity verification." The planning doc's Phase-1 worklist maps this exactly: avatar, phone+verified, position,
specialization, location, timezone, and a `WorkExperience` model that *fulfill* the ProfileHeader / ExperienceList /
onboarding contracts. This change is additive and decoupled from the UI (the blocks already type/render the shape).

## Proposed Solution

Add additive profile fields with backward-compatible defaults, a `WorkExperience` model, contract-typed query
helpers + onboarding datasets, action support to edit them, seed data, and verification. Six deliverable groups:

1. **Identity + professional fields (additive, defaults)** — `SpecialistProfile` gains `avatarUrl String
   @default("")`, `phoneNumber String @default("")`, `phoneVerified Boolean @default(false)`, `position String
   @default("")`, `specialization String @default("")`, `location String @default("")`, `timezone String
   @default("")`. `ClientProfile` gains `avatarUrl String @default("")` and `phoneVerified Boolean @default(false)`
   (it already has `phoneNumber`) — `avatar` and `verified` are role-agnostic in `ProfileHeaderVM`/`ProfileCardVM`.
   **Additive** (new columns only); `npx prisma generate` regenerates the client.

2. **`WorkExperience` model (fulfills ExperienceList)** — `WorkExperience { id, profileId → SpecialistProfile.userId
   (onDelete: Cascade), company, title, description, startYear Int?, endYear Int? (null = "по настоящее время"),
   order, timestamps }`, a 1:N from a specialist's profile. This is the real "Опыт работы" data the `ExperienceList`
   block renders (a collection block — §3.2; it has no dedicated §5 view-model, so the model fulfils it directly).

3. **Phone + verified is *logical*** — `phoneVerified` is a logical flag (no SMS gateway), exactly mirroring the
   logical `PAID` status in the MVP. `ProfileHeaderVM.verified` maps to it (identity verification), distinct from the
   rating's transaction-`verified` from `ratings-reviews-model`. A post-MVP real verification flow replaces it behind
   the same field.

4. **Member-since from `createdAt`** — no new column: the query helper formats `User.createdAt` into
   `ProfileHeaderVM.memberSince` (a `DateISO` string). The blocks format it for display.

5. **Contract-typed helpers + onboarding datasets (`lib/profiles.ts`)** — `getProfileHeader(userId)` assembles the
   full `ProfileHeaderVM` shape (avatar, name, roleTag from position/specialization, `verified` = `phoneVerified`,
   `memberSince` from `createdAt`, `location`, and `stats` merged from `getRatingForUser` + completed-gig count);
   `getWorkExperience(userId)` returns the ordered entries for `ExperienceList`. Plus canonical **dropdown datasets**
   `TIMEZONES` and `SPECIALIZATIONS` (RU market) + `isTimezone`/`isSpecialization` validators for the onboarding
   selects. Server-only; view-model types imported `import type` (no runtime UI coupling), mirroring `lib/reviews.ts`
   and `lib/categories.ts`.

6. **Edit support + seed + safe migration + tests** — `updateProfile` accepts + persists the new (optional) fields
   per role (validating `timezone`/`specialization` against the datasets when supplied); a `setWorkExperience`
   action (specialist-only, **replace** semantics, validated) edits the work history. `prisma/seed.ts` assigns the
   new fields and 1–2 work-experience entries to seeded specialists (idempotent). `resetTestDatabase` gains FK-safe
   `workExperience` cleanup. `__tests__/integration/profile-evolution.test.ts` covers edit/display, existing-profiles
   -unaffected (defaults), the contract match, validation, and datasets.

This change emits **profile fields + a `WorkExperience` model + `updateProfile`/`setWorkExperience` support + query
helpers + datasets + seed + tests only**. It does **not** wire any of it into the profile page, the edit form, or the
onboarding wizard (Phase 2 binds ProfileHeader/ExperienceList/onboarding), build an avatar-upload pipeline, or
implement real SMS verification. The blocks already render the shape — this change makes the data real.

## Constraints

### MUST Requirements
- `SpecialistProfile` MUST gain `avatarUrl`, `phoneNumber`, `phoneVerified`, `position`, `specialization`,
  `location`, `timezone` and `ClientProfile` MUST gain `avatarUrl`, `phoneVerified` — all with backward-compatible
  defaults (`""` / `false`), **additive** (no existing column changed); the client MUST be regenerated.
- A `WorkExperience` model MUST exist (1:N from `SpecialistProfile` via `userId`, `onDelete: Cascade`) carrying
  `company`, `title`, `description`, `startYear?`, `endYear?`, `order` — additive, with FK-safe test cleanup.
- `updateProfile` MUST accept + persist the new **optional** fields per role (validating `timezone`/`specialization`
  against the datasets when non-empty); absent → defaults; existing callers/tests MUST be unaffected.
- A `setWorkExperience` action MUST let a **specialist** replace their work history (validated: `company` required,
  sane years); non-specialists MUST be rejected; unauthenticated → `/login`.
- `lib/profiles.ts` MUST expose `getProfileHeader` (assembling the `ProfileHeaderVM` shape, with `memberSince` derived
  from `User.createdAt` and `verified` from `phoneVerified`) and `getWorkExperience`, plus `TIMEZONES`/
  `SPECIALIZATIONS` datasets — view-model types imported `import type` (no runtime UI coupling).
- `npm run build` and `npm run test:unit` MUST stay green (additive); `npm run lint:tokens` + `npm run
  lint:composition` MUST stay green (no UI change).

### SHOULD Requirements
- `avatar` and `verified` SHOULD live on **both** profile tables (role-agnostic in `ProfileHeaderVM`/`ProfileCardVM`);
  the professional fields (`position`/`specialization`/`location`/`timezone`) and `WorkExperience` SHOULD live on the
  **specialist** profile (the `specialist-progile` screen is the contract's referent; client-profile location is a
  future additive if a client-profile mock ever needs it).
- `phoneVerified` SHOULD be documented as a **logical** flag (no real SMS in the MVP, like logical `PAID`); a real
  verification flow is a post-MVP change behind the same field.
- `setWorkExperience` SHOULD use **replace** semantics (delete + recreate in a transaction) so a specialist's list is
  authoritative, mirroring `setFavoriteCategories`.
- Tests SHOULD assert the contract match against `ProfileHeaderVM` (e.g. `getProfileHeader`'s result is assignable to
  `ProfileHeaderVM`), following the prior data changes.

### Non-Goals
- **No UI wiring.** Binding the fields into ProfileHeader/ExperienceList (the profile page + edit form) and the
  onboarding wizard is Phase 2 (`compose-profile`, `compose-auth-onboarding`). The blocks already render the shape.
- **No avatar-upload pipeline / file storage** — `avatarUrl` is a string (asset path/URL); upload UI/storage is out
  of scope (Phase 2 / post-MVP).
- **No real phone/SMS verification** — `phoneVerified` is a logical MVP flag (a real flow is post-MVP).
- **No change to the existing profile fields/flows** (`displayName`/`techStack`/`experienceLevel`/`bio`,
  `companyName`/`inn`/`kpp`/`contactPerson`); **no identity/other-domain changes**; no review/lifecycle changes.

## Success Criteria

1. `SpecialistProfile` (+`ClientProfile` for avatar/verified) gain the additive fields with defaults; `WorkExperience` model exists; additive; client regenerated.
2. `updateProfile` accepts + validates + persists the new optional fields per role; absent → defaults; invalid timezone/specialization → error; existing callers/tests unaffected.
3. `setWorkExperience` replaces a specialist's work history (validated, specialist-only); `getWorkExperience` returns it ordered.
4. `getProfileHeader` returns the `ProfileHeaderVM` shape (avatar/name/roleTag/verified/memberSince-from-createdAt/location/stats); `TIMEZONES`/`SPECIALIZATIONS` datasets exist and are typed; seed idempotent; existing profiles default gracefully.
5. `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; no UI changes; existing `profile`/auth tests unaffected.

## Affected Areas

- `prisma/schema.prisma` (`SpecialistProfile`/`ClientProfile` new fields; new `WorkExperience` model + relation) → `npx prisma generate`
- `lib/profiles.ts` (new — `getProfileHeader`/`getWorkExperience` contract-typed + `TIMEZONES`/`SPECIALIZATIONS` datasets + validators)
- `app/actions/profile.ts` (`updateProfile` — accepts the new optional fields per role; new `setWorkExperience` action)
- `prisma/seed.ts` (assign the new fields + work-experience entries to seeded specialists, idempotent)
- `__tests__/helpers/db.ts` (`resetTestDatabase` — FK-safe `workExperience` cleanup)
- `__tests__/integration/profile-evolution.test.ts` (new — edit/display, defaults, contract match, validation, datasets)
- read-only inputs: `app/components/blocks/view-models.ts` (`ProfileHeaderVM`/`StatVM`), `lib/reviews.ts` (`getRatingForUser`), `app/actions/category.ts` (action pattern), `__tests__/helpers/*`
- `openspec/specs/profile/spec.md` (spec delta — ADDED requirements to the existing `profile` domain)
- (NOT modified: any UI/component/screen file incl. `app/(protected)/profile/*` and the onboarding wizard; the existing profile fields/flows; `app/components/blocks/view-models.ts`; other domains)

## Risks & Mitigations

**Risk**: `ProfileHeaderVM` fields like `avatar`/`name`/`location` are required, but existing profiles have none.
**Mitigation**: Additive columns with `@default("")` (and `@default(false)` for `phoneVerified`) — always present;
`getProfileHeader` maps empty → graceful values (e.g. `name` falls back to email, `roleTag` to a default). Phase-2
ProfileHeader renders empties gracefully. No nullable mapping needed.

**Risk**: Extending `updateProfile` breaks the existing `profile` integration/E2E tests.
**Mitigation**: All new fields are **optional** — absent → defaults, the existing create/update/validation behaviour
is unchanged; only new validation branches fire when the new fields are supplied. The existing edit form is **not**
modified (it just won't send the new fields). Verify the full suite stays green.

**Risk**: The new `WorkExperience` table breaks the inter-test reset on FK constraints (as `Review`/`Category` did).
**Mitigation**: Add `prisma.workExperience.deleteMany()` to `resetTestDatabase` **before** the profile/user deletes
(WorkExperience → SpecialistProfile → User); `onDelete: Cascade` is the integrity backstop. Tests seed per test.

**Risk**: Modelling avatar as an upload pipeline balloons scope.
**Mitigation**: `avatarUrl` is a plain string (asset path/URL) — the model just stores it; the upload UI/storage is a
Phase-2/post-MVP concern, documented as a non-goal.

**Risk**: Coupling the data layer to the UI by referencing `ProfileHeaderVM`.
**Mitigation**: `import type` only (erased at build); the view-model is the SSOT for the shape; no runtime dependency
on the blocks/primitives tree — exactly the `lib/reviews.ts`/`lib/categories.ts` pattern.

**Risk**: Free-text `timezone`/`specialization` drift from the onboarding dropdowns.
**Mitigation**: Canonical `TIMEZONES`/`SPECIALIZATIONS` datasets in `lib/profiles.ts`; `updateProfile` validates the
supplied value against them (when non-empty) — clean error otherwise — so stored values stay within the dropdowns.
