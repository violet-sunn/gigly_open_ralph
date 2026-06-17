# Change Proposal: compose-profile

> Phase 2, change 23 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> composes the **`/profile`** screen from kit blocks — within the `AppShell` the shell-cutover put in the protected
> layout — binding **real** profile data (the profile-evolution fields, the favorite categories, the aggregate rating,
> and the specialist's realized COMPLETED/PAID gigs) and **preserving the edit flow**. Depends on:
> compose-shell-cutover, domain-blocks, profile-evolution, category-taxonomy, ratings-reviews-model (all complete).
> Friction: **medium** (four block gap-fills, but a read-mostly screen — no multi-role action wiring).
>
> **Fidelity gate.** F3 (logical parity — the mock's IA: header/stack/categories/experience/realized), F5 (composition
> purity), the edit flow, and E2E are enforced now. The **F1 ≤1% pixel-diff** vs `specialist-progile` (the SPECIALIST
> profile the mock depicts) stays deferred — dominated by the **substitute font** (SF Compact unlicensed) and the
> avatar raster — as recorded for the prior compose-* changes. The actual-vs-reference diff + overlay artifacts are
> produced.

## Problem Statement

The `/profile` page is **bespoke pre-redesign markup** (`app/(protected)/profile/page.tsx`, ~340 lines of raw Tailwind +
inline `style`): a hand-built specialist hero (initials avatar + name + a role pill + a stats pill with a hardcoded
`5.0 ★`, `Завершено задач`, `повторных заказов`), an «Опыт работы» card (bio + techStack), an «Избранные проекты»
empty card, plus a separate CLIENT branch (company info + stats). The public profile
(`app/(protected)/profile/[userId]/page.tsx`) is a second slab of raw markup with English labels («Name», «Tech Stack»,
«Bio»). The redesign's `specialist-progile` is
`AppShell + ProfileHeader + StatPanel + TagList(Стек) + CategoryTags(Избранные) + ExperienceList(Опыт) + GigCard(Реализованные)`:

- The page renders inside the new `AppShell` (from compose-shell-cutover) but its **body is not composed** — raw markup
  everywhere (fails F5), a hardcoded `5.0 ★` rating, English labels on the public profile, and ad-hoc cards instead of
  the kit blocks.
- The **data exists** (Phase 1): profile-evolution gave `SpecialistProfile` its `avatarUrl`, `phoneVerified`,
  `position`, `specialization`, `location`, `timezone` + the `WorkExperience` model; `createdAt` gives «member-since»;
  category-taxonomy gave `User.favoriteCategories`; ratings gave the aggregate via `getRatingForUser` — but **nothing
  binds this data into block view-models** for this screen. The current page ignores nearly all of it (no avatar, no
  phone-verified badge, no member-since, no work-experience entries, no favorite categories, a fake static rating).
- **Four blocks the design composition names are missing from the kit**: `ProfileHeader` (its `ProfileHeaderVM` view-
  model exists in the contract, but **no block implements it**), `TagList` (Стек), `CategoryTags` (Избранные), and
  `ExperienceList` (Опыт) are absent from the blocks barrel (`app/components/blocks/index.ts`). `StatPanel` and
  `GigCard` exist. So this change is dominated by **composition-gap fills**, exactly as `GigHeader`/`SearchPanel`/
  `CreateGigCTA` were for the prior screens.
- The page serves **both roles** + a **public view**, so the composition must cover the SPECIALIST profile (the mock),
  a CLIENT profile (no mock — `customer-profile.jpg` duplicates the dashboard per the planning doc), and the read-only
  `[userId]` public profile — all F5-pure.

The planning doc maps this exactly: compose `/profile` from those blocks, preserving the profile data + edit flow. This
change makes the profile a data-bound composition for both roles + the public view while keeping the edit flow intact.

## Proposed Solution

Fill the four block gaps, add a contract-typed `getProfile` mapper, build a composition-pure `Profile` screen that
composes the blocks (shared by the own + public views), render it from thin server pages, preserve the edit flow, and
verify. Five deliverable groups:

1. **Four block gap-fills** (`app/components/blocks/*` + view-models + fixtures + barrel exports — all token-pure,
   composed from primitives + layout):
   - **`ProfileHeader`** — the hero: `Avatar` (avatarUrl/initials) + name + a role tag (position/specialization) +
     a phone-verified badge («Номер телефона верифицирован») + member-since («с DD MMMM YYYY») + an online/offline dot +
     inline `StatVM` tiles, from the existing **`ProfileHeaderVM`** (additive `online?: boolean` if needed). An
     `onEdit?` callback drives the «Редактировать профиль» affordance (owner only).
   - **`TagList`** — the «Стек» card: a titled list of `Tag` primitives (tech-stack items), with an `onEdit?`
     affordance. New additive **`TagListVM`** (`{ title; tags: { label; color? }[] }`).
   - **`CategoryTags`** — the «Избранные категории» card: the five canonical `CategoryTag`s with the user's favorites
     marked. New additive **`CategoryTagsVM`** (`{ title; categories: { slug: Category; label; favorite }[] }`).
   - **`ExperienceList`** — the «Опыт» card: the bio paragraph + the `WorkExperience` entries (company · title · period
     `«2021 — Наст. время»` · description). New additive **`ExperienceListVM`**
     (`{ title; bio?; entries: { company; title?; period; description? }[] }`).

2. **`getProfile` mapper (`lib/view-models.ts`, server-only, contract-typed)** — `getProfile(targetUserId, viewer)` →
   `ProfileData | null`: for a SPECIALIST — `header: ProfileHeaderVM` (avatar, displayName, role tag, phoneVerified,
   memberSince from `createdAt`, online?), `stats: StatPanelVM` (the analytics placeholder per the mock — «Здесь будет
   ваша статистика» — see reconciliation), `stack: TagListVM` (techStack split), `categories: CategoryTagsVM` (the five
   + `getFavoriteCategories`), `experience: ExperienceListVM` (bio + `workExperience` ordered), `realized: GigCardVM[]`
   (the specialist's COMPLETED/PAID assigned gigs via `toGigCardVM`, list layout), `rating` (the aggregate via
   `getRatingForUser`), and `isOwner`. For a CLIENT — the same `header`/`stats`/`rating` from `ClientProfile`
   (companyName, inn/kpp/contactPerson as `meta`), no stack/experience/categories (no mock). Returns `null` for a
   missing user / unset profile (the page renders the not-set-up / not-found notice). Reuses `getRatingForUser`,
   `getFavoriteCategories`, `lib/categories`, `toGigCardVM`. `import type` the VMs; only the four additive VMs join the
   block contract.

3. **`Profile` composed screen (`app/(protected)/profile/Profile.tsx`, `@composed-screen`)** — props = the
   `getProfile` result + `isOwner`. Composes, via **layout primitives only** (Section/Grid/Split/Stack/Panel — no
   `className`/`style`): `ProfileHeader` (+ `StatPanel` placeholder beside it per the mock) · `TagList` (Стек) ·
   `CategoryTags` (Избранные) · `ExperienceList` (Опыт) · `GigCard·list` (Реализованные проекты, with the count). The
   SPECIALIST and CLIENT branches both compose from these blocks; the public view drops the edit affordances
   (`isOwner=false`). The single client interaction is the edit affordance → `router.push('/profile/edit')` (the
   existing edit form is unchanged). No raw markup → F5-clean.

4. **Thin server pages** — `app/(protected)/profile/page.tsx` (own: `getSession`, no-session redirect, `getProfile(
   session.userId, session)`, the not-set-up notice when `null`, render `<Profile … isOwner />` + the existing
   `Breadcrumb`) and `app/(protected)/profile/[userId]/page.tsx` (public: redirect to `/profile` for self, `getProfile(
   userId, session)`, not-found notice when `null`, render `<Profile … isOwner={false} />`). Replace the bespoke
   bodies; drop the local raw markup + duplicated `formatRoubles`. The **edit flow is preserved** — `/profile/edit`
   (`ProfileEditForm` + `updateProfile`) is unchanged and reachable from `ProfileHeader`'s affordance.

5. **Tests + fidelity** — unit tests for `getProfile` (header/stack/categories/experience/realized/rating + `isOwner`
   across SPECIALIST/CLIENT, own/public, set/unset profile). E2E (`compose-profile.spec.ts`): a seeded SPECIALIST with
   the profile-evolution fields + favorites + a COMPLETED gig + a review renders the composed header/stack/categories/
   experience/realized; the «Редактировать профиль» affordance navigates to `/profile/edit` and a save round-trips; the
   public `[userId]` view renders read-only (no edit). `lint:composition` (F5) on `Profile`; F3 parity. The F1
   actual-vs-`specialist-progile` diff is **produced** with ≤1% **deferred** (font + avatar raster).

This change emits **the four block gap-fills + their additive VMs + the `getProfile` mapper + the `Profile` composition
+ the two page rewrites + tests only**. It does **not** change any data model or **server action** (`updateProfile`
reused verbatim), the shell, the edit form, or routes.

## Constraints

### MUST Requirements
- The `/profile` body MUST be composed from blocks (`ProfileHeader` + `StatPanel` + `TagList` + `CategoryTags` +
  `ExperienceList` + `GigCard·list`) inside the layout's `AppShell`, as a composition-pure screen (F5): `Profile` MUST
  carry `@composed-screen`, import only kit/`lib`/`actions`/`react`/`next`, and contain **no** `className`/`style`/raw
  styled markup. The `[userId]` public profile MUST render the same composed `Profile` (read-only).
- The composition MUST bind **real** data via `getProfile` — the avatar/name/role-tag/phone-verified/member-since
  header, the tech-stack `TagList`, the five `CategoryTags` with the user's favorites marked, the bio + `WorkExperience`
  `ExperienceList`, the COMPLETED/PAID realized `GigCard·list`, and the aggregate rating. No hardcoded rating.
- The four missing blocks (`ProfileHeader`, `TagList`, `CategoryTags`, `ExperienceList`) MUST be implemented token-pure,
  each exported with a fixture; `TagListVM`/`CategoryTagsVM`/`ExperienceListVM` added additively to the block view-model
  contract (`ProfileHeaderVM` already exists; any additions to it are additive).
- The **edit flow MUST be preserved**: the owner's `ProfileHeader` affordance navigates to `/profile/edit`, the
  existing `ProfileEditForm` + `updateProfile` action are unchanged, and a save round-trips.
- The pages MUST render `Profile` for a set-up profile, preserve the no-session redirect, the self→`/profile` redirect
  on the public route, and render the **not-set-up / not-found** notice when `getProfile` returns `null`.
- `npm run build`, `npm run test:unit`, the profile E2E, `npm run lint:composition`, and `npm run lint:tokens` MUST be
  green; the existing profile/`updateProfile` integration tests MUST stay green.

### SHOULD Requirements
- `getProfile` SHOULD live in `lib/view-models.ts` (server-only, `import type` the VMs) and reuse `getRatingForUser`,
  `getFavoriteCategories`, `lib/categories`, and `toGigCardVM`.
- The mapper SHOULD compute the same SPECIALIST stats the live page shows (completed-tasks count + repeat-order rate),
  surfaced through the `ProfileHeader` inline stats / `StatPanel`, so no real data regresses behind the mock's
  placeholder.
- `Profile` SHOULD be the only `'use client'` addition (for the edit-affordance `router.push`); the CLIENT branch
  SHOULD compose from the same blocks (ProfileHeader + StatPanel + company `meta`), with F1 not applicable (no mock).

### Non-Goals
- **No data-model or server-action change** (`updateProfile` reused verbatim); **no shell change**; **no new routes**;
  **no edit-form redesign** — `/profile/edit` (`ProfileEditForm`) keeps its current markup and field set (it is a form
  page with no mock; redesigning it / adding inputs for the new profile-evolution fields is a separate change). The view
  renders all profile-evolution fields; editing the **new** fields (work experience, position, avatar, favorites) via
  the form is out of scope here.
- **No client-profile fidelity** — there is no client-profile mock (`customer-profile.jpg` duplicates the dashboard), so
  the CLIENT branch is composed from blocks with F5 enforced and **F1 not applicable**.
- **F1 ≤1% enforcement is deferred** — the diff is produced for review, but the ≤1%-vs-`specialist-progile` target is
  reached only once the **SF Compact font is licensed** (and the avatar raster is exported). F3/F5/edit-flow/E2E are the
  enforced acceptance.

## Success Criteria

1. `/profile` (and `/profile/[userId]`) body composes `ProfileHeader`+`StatPanel`+`TagList`+`CategoryTags`+`ExperienceList`+`GigCard·list` (F5-pure `@composed-screen`).
2. Real data bound via `getProfile` (avatar/name/role/phone-verified/member-since; stack; favorites among the five; bio + work experience; realized COMPLETED/PAID gigs; aggregate rating — no hardcoded rating); `isOwner` gates the edit affordances.
3. The four missing blocks implemented + exported with fixtures; `TagListVM`/`CategoryTagsVM`/`ExperienceListVM` added additively (`ProfileHeaderVM` already present).
4. The edit flow preserved (affordance → `/profile/edit`; `ProfileEditForm` + `updateProfile` unchanged; save round-trips); not-set-up / not-found / self-redirect preserved.
5. `build`, `test:unit` (existing profile/`updateProfile` tests green), profile E2E, `lint:composition`, `lint:tokens` all green; F1 diff produced (≤1% deferred to font + avatar raster).

## Affected Areas

- `app/(protected)/profile/page.tsx` (thin server page → `getProfile` + `<Profile isOwner>` + `Breadcrumb`; preserve redirect/not-set-up)
- `app/(protected)/profile/[userId]/page.tsx` (thin server page → `getProfile` + `<Profile isOwner={false}>`; preserve self-redirect/not-found)
- `app/(protected)/profile/Profile.tsx` (new — `@composed-screen`, shared by own + public views)
- `app/components/blocks/{ProfileHeader,TagList,CategoryTags,ExperienceList}.tsx` (new blocks) + `app/components/blocks/index.ts` (exports) + `fixtures.ts` (fixtures) + `app/components/blocks/view-models.ts` (additive `TagListVM`/`CategoryTagsVM`/`ExperienceListVM`; `ProfileHeaderVM` already present)
- `lib/view-models.ts` (new — `getProfile` + `ProfileData`, contract-typed)
- `__tests__/e2e/compose-profile.spec.ts` (new) + `__tests__/integration/*` (mapper unit tests); `prisma/seed.ts` (a populated specialist for the F1 render, if not already present)
- read-only inputs: the blocks (`StatPanel`/`GigCard`/`Avatar`/`Tag`/`CategoryTag`/`Rating`), the primitives, `@/lib/reviews` (`getRatingForUser`), `@/lib/categories` (`getFavoriteCategories`/`CATEGORIES`), `@/app/actions/profile` (`updateProfile`, unchanged), `app/components/Breadcrumb`, `screens/specialist-progile.jpg` (F1 reference)
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements, folded on archive)
- (NOT modified: data models; `updateProfile`; the edit form; the shell; routes)

## Risks & Mitigations

**Risk**: Four block gap-fills at once (more than any prior compose-* change) — risk of bespoke styling creeping into the new blocks.
**Mitigation**: Each block is composed strictly from existing primitives (`Avatar`/`Tag`/`CategoryTag`/`Rating`) + layout primitives + tokens, mirroring the existing `StatPanel`/`GigCard`/`ClientCard` blocks; `lint:tokens` (F2) fails on any literal. The blocks are presentational (a fixture each) and read-only — no action wiring — so the surface is small despite the count.

**Risk**: The mock's header-right panel is a «Здесь будет ваша статистика / Окно находится на стадии разработки» **placeholder**, but the live page computes real stats (completed-tasks, repeat-rate) — composing only the placeholder would regress real data.
**Mitigation**: Reconcile explicitly — render the real computed stats (completed count + repeat-order rate) + the aggregate rating through the `ProfileHeader` inline stats, and render the `StatPanel` as the mock's "analytics coming soon" placeholder (a deferred analytics widget). No real data is lost; the layout stays faithful. Recorded in the reconciliation note.

**Risk**: The `/profile` route serves CLIENT + SPECIALIST + a public `[userId]` view; composing only the SPECIALIST mock would leave raw CLIENT/public markup (fails F5 for the route).
**Mitigation**: `Profile` composes both roles from the same blocks and is reused for the public view (`isOwner=false` drops edit affordances). The CLIENT branch has no mock → F5 enforced, F1 not applicable (precedent: the gig-detail admin moderation history was composed in place with no mock).

**Risk**: `ProfileHeader` is named in the design composition + has a `ProfileHeaderVM`, but no block implements it; composing it would fail.
**Mitigation**: Implement it as a token-pure block from the existing `ProfileHeaderVM` (+ an additive `online?` if the offline dot needs it), with a fixture and a barrel export — a system-gap fill recorded in the spec, exactly like `GigHeader`.

**Risk**: Replacing the bespoke pages breaks tests asserting old markup (English «Name»/«Tech Stack»/«Bio», the hardcoded `5.0 ★`, the «Profile not set up yet» copy).
**Mitigation**: Map old assertions to the composed blocks (RU labels, the blocks' roles/text, the real rating); preserve the behavioural contract (edit affordance, not-set-up/not-found). Update the markup-asserting profile E2E specs; keep the `updateProfile` integration tests unchanged. A new E2E covers the composed render + edit round-trip + public view.

**Risk**: F1 ≤1% won't pass against `specialist-progile`.
**Mitigation**: Documented + accepted (per the prior compose-* changes): the residual is the substitute font + the avatar raster — not a composition defect. The diff + 50%-overlay are produced for review; ≤1% is reached once the font is licensed and the avatar asset is exported.
