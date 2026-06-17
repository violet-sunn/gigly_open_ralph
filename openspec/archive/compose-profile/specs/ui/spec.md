# UI Specification Delta: compose-profile

This document contains specification changes for the `compose-profile` change — Phase-2 screen composition #6. It
composes the **`/profile`** body (own + the `/profile/[userId]` public view) from kit blocks (`ProfileHeader` +
`StatPanel` + `TagList(Стек)` + `CategoryTags(Избранные)` + `ExperienceList(Опыт)` + `GigCard·list(Реализованные)`),
inside the `AppShell` the shell-cutover put in the protected layout, binding real profile data (the profile-evolution
fields, the favorite categories, the aggregate rating, the COMPLETED/PAID realized gigs) and **preserving the edit
flow**. It ships **four new blocks (`ProfileHeader`/`TagList`/`CategoryTags`/`ExperienceList`) + their additive VMs + the
`getProfile` mapper + the `Profile` composition + the two page rewrites + tests only** — F5 composition-pure, F3 logical
parity, with the **F1 ≤1% pixel-diff deferred** (substitute font + avatar raster). It does **not** change data models,
the `updateProfile` action, the edit form, the shell, or routes.

---

## ADDED Requirements

### Requirement: Profile Composed from Blocks
The `/profile` body (and the `/profile/[userId]` public view) MUST be composed from kit blocks as a composition-pure
screen (F5), inside the layout's `AppShell`.

#### Scenario: Profile is a composed screen
- GIVEN `app/(protected)/profile/Profile.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose `ProfileHeader` + `StatPanel` + `TagList` + `CategoryTags` +
  `ExperienceList` + `GigCard·list` via layout primitives (Section/Grid/Split/Stack/Panel), import only
  kit/`lib`/`actions`/`react`/`next`, and contain **no** `className=` / `style=` / raw styled markup

#### Scenario: The pages render it
- GIVEN `app/(protected)/profile/page.tsx` and `app/(protected)/profile/[userId]/page.tsx`
- WHEN a user loads `/profile` or `/profile/[userId]`
- THEN each page MUST build the data server-side (`getProfile`) and render `<Profile>` (inside the shell); the own page
  renders it with `isOwner` + the `Breadcrumb`, the public page with `isOwner={false}`; the no-session redirect, the
  self→`/profile` redirect on the public route, and the **not-set-up / not-found** notice (when `getProfile` returns
  `null`) MUST be preserved

**Acceptance Criteria:**
- `Profile` is an F5-pure `@composed-screen` composing the six blocks; both pages render it (own with `isOwner`, public read-only)
- No-session redirect + self-redirect + not-set-up/not-found preserved; the bespoke profile bodies superseded

### Requirement: Real Data Binding via getProfile
The screen MUST bind real profile data through a server-only, contract-typed `getProfile` mapper (no hardcoded rating).

#### Scenario: Specialist profile data
- GIVEN `getProfile(targetUserId, viewer)` for a SPECIALIST with a set-up profile
- WHEN it runs
- THEN it MUST return `header: ProfileHeaderVM` (avatar from `avatarUrl`/initials, displayName, a role tag from
  position/specialization, `phoneVerified`, member-since from `createdAt`), `stack: TagListVM` (the `techStack` split),
  `categories: CategoryTagsVM` (the five canonical categories with the user's `favoriteCategories` marked),
  `experience: ExperienceListVM` (the `bio` + the ordered `WorkExperience` entries), `realized: GigCardVM[]` (the
  specialist's COMPLETED/PAID assigned gigs, list layout), the aggregate `rating` (via `getRatingForUser`), and
  `isOwner` — all assignable to the view-model contracts (`import type`)

#### Scenario: Client profile and unset/missing
- GIVEN `getProfile` for a CLIENT (company info) or for a missing user / unset profile
- WHEN it runs
- THEN for a CLIENT it MUST return the `header` (companyName + meta) + `stats` + `rating` from `ClientProfile` (no
  stack/categories/experience — no mock); and it MUST return `null` when the user is missing or the profile is unset, so
  the page renders the not-set-up / not-found notice

**Acceptance Criteria:**
- `getProfile` returns the block VMs + `isOwner` for a SPECIALIST; the CLIENT header/stats/rating; `null` for missing/unset
- Reuses `getRatingForUser` / `getFavoriteCategories` / `lib/categories` / `toGigCardVM`; the rating is the real aggregate, not hardcoded

### Requirement: Profile Blocks (composition-gap fills)
The four blocks named by this composition but absent from the kit MUST be implemented.

#### Scenario: ProfileHeader, TagList, CategoryTags, ExperienceList are token-pure kit blocks
- GIVEN `app/components/blocks/{ProfileHeader,TagList,CategoryTags,ExperienceList}.tsx`
- WHEN inspected
- THEN each MUST render its part of the mock from a typed view-model — `ProfileHeader` (avatar + name + role tag +
  phone-verified badge + member-since + online dot + inline stats + an owner edit affordance), `TagList` (a titled
  list of `Tag`s), `CategoryTags` (the five `CategoryTag`s with favorites marked), `ExperienceList` (bio + work-
  experience entries) — be token-pure (primitives + layout + tokens), have a fixture, and be exported from the blocks
  barrel; `TagListVM` / `CategoryTagsVM` / `ExperienceListVM` are added additively to the block view-model contract
  (`ProfileHeaderVM` already exists; any change to it is additive)

**Acceptance Criteria:**
- Four token-pure blocks + three additive VMs + fixtures + barrel exports
- `lint:tokens` (F2) passes on the new blocks

### Requirement: Preserved Edit Flow
The composition MUST preserve the profile edit flow without changing the edit form or the `updateProfile` action.

#### Scenario: Owner edits the profile
- GIVEN the profile owner viewing `/profile`
- WHEN they use the `ProfileHeader` edit affordance
- THEN it MUST navigate to `/profile/edit`, where the existing `ProfileEditForm` (driving the unchanged `updateProfile`
  action) saves and round-trips back to the composed `/profile`; the public `[userId]` view MUST NOT show the edit
  affordance

**Acceptance Criteria:**
- Edit affordance → `/profile/edit`; `ProfileEditForm` + `updateProfile` unchanged; save round-trips; public view read-only

### Requirement: Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the profile E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the mock (header/stack/categories/experience/
  realized) (F3), the composed render + edit round-trip + public read-only view work, and the existing profile/
  `updateProfile` integration tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live SPECIALIST `/profile` captured at 1440px and diffed vs `screens/specialist-progile.jpg`
- WHEN the artifacts (diff / side-by-side / 50%-overlay) are reviewed
- THEN the composed layout MUST be visually faithful; the automated ≤1% threshold is NOT yet met — dominated by the
  **substitute font** (SF Compact unlicensed) and the avatar raster, not a composition defect; ≤1% is reached once the
  font is licensed and the avatar asset is exported

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + profile E2E green; existing profile/`updateProfile` tests green
- F1 diff produced; composed layout visually faithful; ≤1% deferred to the font licence + avatar export

---

## Test Plan

This change ships four blocks + a mapper + a composition + two page rewrites + tests. Validation is by deterministic
commands. Commands assume the repo root.

### Composition + blocks + mapper
```bash
grep -qE '@composed-screen' app/\(protected\)/profile/Profile.tsx && echo "Profile composed screen (F5 marker)"
grep -qE 'className=|style=' app/\(protected\)/profile/Profile.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
for b in ProfileHeader TagList CategoryTags ExperienceList; do test -f app/components/blocks/$b.tsx && grep -qE "$b" app/components/blocks/index.ts && echo "$b block + export"; done
grep -qE 'TagListVM|CategoryTagsVM|ExperienceListVM' app/components/blocks/view-models.ts && echo "additive VMs"
grep -qE 'getProfile' lib/view-models.ts && grep -qE 'getRatingForUser|getFavoriteCategories' lib/view-models.ts && echo "getProfile mapper + real rating/favorites"
grep -qE 'Profile' app/\(protected\)/profile/page.tsx && grep -qE 'Profile' app/\(protected\)/profile/\[userId\]/page.tsx && echo "pages render Profile"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit tests + build + suite (incl. preserved profile/updateProfile)
```bash
npm run clean:test-db && npx vitest run __tests__/integration/profile-vm.test.ts 2>&1 | tail -10
npm run clean:test-db && npx vitest run __tests__/integration/profile-evolution.test.ts __tests__/integration/profile-sanitization.test.ts 2>&1 | tail -8
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Profile E2E (composed render + edit round-trip + public view)
```bash
npx playwright test __tests__/e2e/compose-profile.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 fidelity diff (artifacts; ≤1% deferred)
```bash
# capture the SPECIALIST /profile at 1440px, then:
node scripts/design-system/fidelity-diff.js <profile-actual.png> screens/specialist-progile.jpg <outDir>
# review diff / side-by-side / overlay-50; ≤1% deferred (substitute font + avatar raster)
```

### Manual review
1. Confirm `Profile` is an F5-pure `@composed-screen` (the six blocks via layout primitives; no className/style) rendered by both pages.
2. Confirm `getProfile` binds real data (avatar/name/role/phone-verified/member-since; stack; favorites among the five; bio + work experience; realized COMPLETED/PAID gigs; the real aggregate rating) + `isOwner`.
3. Confirm the four blocks are implemented + exported with fixtures; the edit affordance navigates to `/profile/edit` and a save round-trips; the public view is read-only.
4. Confirm data models + `updateProfile` + the edit form are unchanged, and the F1 diff is produced (≤1% deferred to the font + avatar raster).
