# Implementation Tasks: compose-profile

> **Phase-2 screen composition.** Compose `/profile` (own + the `/profile/[userId]` public view) from kit blocks
> (`ProfileHeader` + `StatPanel` + `TagList(Стек)` + `CategoryTags(Избранные)` + `ExperienceList(Опыт)` +
> `GigCard·list(Реализованные)`) inside the layout's `AppShell`, binding real profile data (profile-evolution fields,
> favorite categories, aggregate rating, COMPLETED/PAID realized gigs) and **preserving the edit flow** (the
> `updateProfile` action + the edit form are unchanged). Fill the four missing blocks; add `getProfile`; F5 composition-
> pure, F3 parity; **F1 ≤1% deferred** (font + avatar raster). Mirror the prior compose-* screens. Friction: medium.

---

## Task 1: [x] Four block gap-fills + additive VMs

**Implementation Notes:**
- Add the additive VMs to `app/components/blocks/view-models.ts` (`ProfileHeaderVM` already exists; add an optional
  `online?: boolean` to it if the offline dot needs it):
  ```ts
  export interface TagListVM {
    title: string;                       // «Стек»
    tags: { label: string; color?: Category }[];
  }
  export interface CategoryTagsVM {
    title: string;                       // «Избранные категории»
    categories: { slug: Category; label: string; favorite: boolean }[];
  }
  export interface ExperienceListVM {
    title: string;                       // «Опыт»
    bio?: string;
    entries: { company: string; title?: string; period: string; description?: string }[];
  }
  ```
- Create the four blocks (each a block — token classes / layout primitives OK; NOT a `@composed-screen`), composed from
  existing primitives + layout + tokens, token-pure:
  - `app/components/blocks/ProfileHeader.tsx` — `Avatar` (vm.avatar / initials) + name (display type) + role tag
    (`vm.roleTag`) + a phone-verified badge («Номер телефона верифицирован», from `vm.verified`) + member-since
    («с {vm.memberSince}») + an online/offline dot (`vm.online`) + inline `StatVM` tiles (`vm.stats`). Accept an
    optional `onEdit?: () => void` for the owner's «Редактировать профиль» affordance (a `Button`).
  - `app/components/blocks/TagList.tsx` — a titled card: `vm.title` + the `vm.tags` as `Tag` primitives (cycle the
    category colors when `color` unset). Optional `onEdit?`.
  - `app/components/blocks/CategoryTags.tsx` — a titled card: `vm.title` + the five `CategoryTag`s, favorites
    emphasized. Optional `onEdit?`. (Reuse `CATEGORY_LABEL` from `blocks/util`.)
  - `app/components/blocks/ExperienceList.tsx` — a titled card: `vm.title` + `vm.bio` paragraph + the `vm.entries`
    (company · title · period · description). Optional `onEdit?`.
- Add a fixture for each to `fixtures.ts` (mirror the mock's data); export all four from `app/components/blocks/index.ts`.

**Test Plan:**
```bash
for b in ProfileHeader TagList CategoryTags ExperienceList; do test -f app/components/blocks/$b.tsx && grep -qE "$b" app/components/blocks/index.ts && echo "$b block + export"; done
grep -qE 'TagListVM|CategoryTagsVM|ExperienceListVM' app/components/blocks/view-models.ts && echo "additive VMs"
npm run lint:tokens && echo "token-pure"
```
Expected: four token-pure blocks + three additive VMs + fixtures + barrel exports.

---

## Task 2: [x] `getProfile` mapper (`lib/view-models.ts`)

**Implementation Notes:**
- Add `getProfile(targetUserId, viewer)` (server-only). Fetch the user with `specialistProfile.workExperience` (ordered
  by `order`), `clientProfile`, and `favoriteCategories`. Then map (reusing `getRatingForUser`, `getFavoriteCategories`,
  `CATEGORIES`/`CATEGORY_LABEL`, `toGigCardVM`, the `money`/date helpers):
  ```ts
  export interface ProfileData {
    role: 'SPECIALIST' | 'CLIENT'
    header: ProfileHeaderVM
    stats: StatPanelVM            // SPECIALIST: the «coming soon» analytics placeholder (see reconciliation)
    stack?: TagListVM             // SPECIALIST only
    categories?: CategoryTagsVM   // SPECIALIST only
    experience?: ExperienceListVM // SPECIALIST only
    realized: GigCardVM[]         // SPECIALIST: COMPLETED/PAID assigned gigs (empty for CLIENT)
    rating: { value: number; count: number; verified: boolean }
    isOwner: boolean
  }
  export async function getProfile(
    targetUserId: string,
    viewer: { userId: string; role: string },
  ): Promise<ProfileData | null>
  ```
  - SPECIALIST `header`: `avatar = avatarUrl` (else ''), `name = displayName || email`, `roleTag = position ||
    specialization || experienceLevel || 'Специалист'`, `verified = phoneVerified`, `memberSince` = `createdAt`
    localized («21 января 2021»), inline `stats` = the real computed stats (completed-tasks count + repeat-order rate —
    the same the live page computes) + the aggregate rating value.
  - `stats` (StatPanelVM): per the mock, the analytics placeholder — a single tile «Здесь будет ваша статистика» /
    «Окно находится на стадии разработки» (deferred analytics widget). **Reconciliation:** the real numeric stats live
    in `header.stats` so no data regresses; this StatPanel is the mock's coming-soon panel.
  - `stack`: `techStack` split on commas → `TagListVM.tags`.
  - `categories`: `CATEGORIES` mapped to `{ slug, label: CATEGORY_LABEL[slug], favorite: favoriteSlugs.has(slug) }`.
  - `experience`: `{ bio, entries: workExperience.map(w => ({ company: w.company, title: w.title || undefined, period:
    period(w.startYear, w.endYear), description: w.description || undefined })) }` where `period` →
    `«2021 — Наст. время»` when `endYear` null.
  - `realized`: `prisma.gig.findMany({ where: { assignedSpecialistId: targetUserId, status: { in: ['COMPLETED','PAID'] }
    } })` → `toGigCardVM(g, 'list')`.
  - CLIENT: `header` from `clientProfile` (companyName + meta-style stats), `rating` aggregate, no stack/categories/
    experience, `realized: []`.
  - `isOwner = viewer.userId === targetUserId`. Return `null` when the user is missing or the role's profile is unset.
  - `import type` the VMs.

**Test Plan:**
```bash
grep -qE 'getProfile' lib/view-models.ts && grep -qE 'ProfileData' lib/view-models.ts && echo "mapper + type"
grep -qE 'getRatingForUser|getFavoriteCategories' lib/view-models.ts && echo "real rating + favorites"
```
Expected: `getProfile` returns the block VMs (header/stack/categories/experience/realized) + rating + `isOwner`; `null` for missing/unset; contract-typed.

---

## Task 3: [x] `Profile` composed screen (shared own + public)

**Implementation Notes:**
- Create `app/(protected)/profile/Profile.tsx` (`'use client'`, `/* @composed-screen */`). Props = the `getProfile`
  result. Compose via **layout primitives only** (no className/style). The single interaction is the owner edit
  affordance → `router.push('/profile/edit')`. Sketch:
  ```tsx
  /* @composed-screen */
  'use client'
  import { useRouter } from 'next/navigation'
  import { Section } from '@/app/components/layout/Section'
  import { Grid } from '@/app/components/layout/Grid'
  import { Split } from '@/app/components/layout/Split'
  import { Stack } from '@/app/components/layout/Stack'
  import { ProfileHeader, StatPanel, TagList, CategoryTags, ExperienceList, GigCard } from '@/app/components/blocks'
  import type { ProfileData } from '@/lib/view-models'

  export function Profile({ data }: { data: ProfileData }) {
    const router = useRouter()
    const edit = data.isOwner ? () => router.push('/profile/edit') : undefined
    return (
      <Section title="Профиль" gap={6}>
        <Split>
          <ProfileHeader vm={data.header} onEdit={edit} />
          <StatPanel vm={data.stats} />
        </Split>
        {data.role === 'SPECIALIST' && (
          <>
            <Split>
              <TagList vm={data.stack!} onEdit={edit} />
              <CategoryTags vm={data.categories!} onEdit={edit} />
            </Split>
            <Split>
              <ExperienceList vm={data.experience!} onEdit={edit} />
              <Section title="Реализованные проекты" gap={4}>
                <Stack gap={4}>{data.realized.map((g) => <GigCard key={g.id} vm={g} onOpen={() => router.push(`/gigs/${g.id}`)} />)}</Stack>
              </Section>
            </Split>
          </>
        )}
      </Section>
    )
  }
  ```
  Match the mock's two-column arrangement (header + stats placeholder on top; Стек/Избранные and Опыт/Реализованные
  below). Confirm a `Split` layout primitive exists (else use `Grid columns={2}`). GigCards in list layout. No
  className/style → F5-clean.

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/profile/Profile.tsx && echo "composed screen"
grep -qE 'className=|style=' app/\(protected\)/profile/Profile.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure composition of the six blocks; edit affordance gated by `isOwner`.

---

## Task 4: [x] Thin server pages (own + public) + preserve edit flow

**Implementation Notes:**
- Rewrite `app/(protected)/profile/page.tsx` (server): keep `getSession` + no-session redirect; call
  `getProfile(session.userId, session)`; if `null` render the **not-set-up** notice (token-styled, with a link to
  `/profile/edit`); else render the `Breadcrumb` (page-level) + `<Profile data={…} />`. Drop the bespoke body + local
  `formatRoubles`.
- Rewrite `app/(protected)/profile/[userId]/page.tsx` (server): keep `getSession` + redirect; if `userId ===
  session.userId` redirect to `/profile`; call `getProfile(userId, session)`; if `null` render the **not-found**
  notice; else render `<Profile data={…} />` (the data carries `isOwner=false`, so no edit affordance). Drop the
  bespoke body.
- **Preserve the edit flow:** `/profile/edit` (`ProfileEditForm` + the `updateProfile` action) is **unchanged**; it is
  reached from `ProfileHeader`'s affordance and returns to `/profile` on save. Do NOT redesign the edit form here.

**Test Plan:**
```bash
grep -qE 'getProfile|Profile' app/\(protected\)/profile/page.tsx && echo "own page composed"
grep -qE 'getProfile|Profile' app/\(protected\)/profile/\[userId\]/page.tsx && echo "public page composed"
grep -qE "redirect\('/profile'\)|session.userId" app/\(protected\)/profile/\[userId\]/page.tsx && echo "self-redirect preserved"
git status --porcelain app/actions/profile.ts app/\(protected\)/profile/edit/ | tail   # expect no edit-flow changes
```
Expected: both pages render `Profile`; not-set-up/not-found/self-redirect preserved; the edit form + `updateProfile` untouched.

---

## Task 5: [x] Mapper unit tests + profile E2E + update markup-asserting specs

**Implementation Notes:**
- `__tests__/integration/profile-vm.test.ts` (mock `@/lib/prisma`/`next/*`; `createTestUser` + a `specialistProfile`
  with the profile-evolution fields, `workExperience`, `favoriteCategories`, a COMPLETED gig + a `review.create`):
  `getProfile` returns the header (avatar/name/role/verified/member-since), stack (techStack split), categories (the
  five with favorites marked), experience (bio + ordered entries, period «Наст. время» for null endYear), realized
  (COMPLETED/PAID list), the real aggregate rating, and `isOwner` (true for self, false for another viewer); `null` for
  a missing user / unset profile; the CLIENT branch (header/stats, no stack/experience).
- `__tests__/e2e/compose-profile.spec.ts` (setE2ESession + seed via prisma into `file:./test.db`): a seeded SPECIALIST
  with the fields + favorites + a COMPLETED gig + a review renders the composed header/stack/categories/experience/
  realized; the «Редактировать профиль» affordance navigates to `/profile/edit`, a field is saved (`updateProfile`),
  and the composed `/profile` reflects it; the public `/profile/[userId]` view renders read-only (no edit affordance).
  (Use the prior compose-* spec's seeding + session patterns.)
- Update profile **E2E** specs asserting old markup (English «Name»/«Tech Stack»/«Bio», the hardcoded `5.0 ★`, the
  «Profile not set up yet» copy) to the composed blocks (RU labels, the real rating). **Keep** the `updateProfile`
  **integration** tests unchanged — they target the server action, which is preserved.

**Test Plan:**
```bash
npm run clean:test-db && npx vitest run __tests__/integration/profile-vm.test.ts 2>&1 | tail -12
npm run clean:test-db && npx vitest run __tests__/integration/profile-evolution.test.ts __tests__/integration/profile-sanitization.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/compose-profile.spec.ts --project=chromium 2>&1 | tail -12
```
Expected: mapper unit tests pass; the preserved `updateProfile` integration tests stay green; E2E covers the composed render + edit round-trip + public view.

---

## Task 6: [x] Buildable acceptance (F3 + F5 + suite) + scope confirmation

**Implementation Notes:**
- Run F5 composition lint, token lint, build, full unit suite (update any tests asserting the old profile markup), and
  the E2E.
- Confirm scope: only `/profile` + `/profile/[userId]` composed; `updateProfile` + the edit form unchanged
  (profile/`updateProfile` integration tests green); the four blocks additive; the new `ProfileData` lives in
  `lib/view-models.ts` and only `TagListVM`/`CategoryTagsVM`/`ExperienceListVM` (+ an optional `ProfileHeaderVM.online`)
  join the block contract; no shell/new-route change.

**Test Plan:**
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
git status --porcelain app/\(protected\)/profile/ app/components/blocks/ lib/view-models.ts | tail
```
Expected: F3 + F5 + build + suite + E2E green; scope held (profile only; `updateProfile`/edit-form/shell untouched).

---

## Task 7: [x] F1 fidelity diff vs specialist-progile (artifacts; ≤1% deferred)

**Implementation Notes:**
- Seed/populate a representative SPECIALIST (avatar or initials, displayName, position/specialization, phoneVerified,
  techStack, favorite categories, bio + work experience, ≥1 COMPLETED gig + a review) in `prisma/seed.ts` if not
  already present, so the render is populated. Capture the SPECIALIST `/profile` at 1440px (a temporary capture spec
  like the prior compose-* changes, removed after — artifacts preserved), then `node
  scripts/design-system/fidelity-diff.js <profile-actual.png> screens/specialist-progile.jpg
  docs/design-system/fidelity/out/profile` → ratio + `diff/side-by-side/overlay-50`.
- The ≤1% target is **deferred** (substitute font + avatar raster); report the ratio + that the residual is the
  documented font/avatar factor, not a composition defect.

**Test Plan:**
```bash
node scripts/design-system/fidelity-diff.js docs/design-system/fidelity/out/profile/profile-actual.png screens/specialist-progile.jpg docs/design-system/fidelity/out/profile
```
Expected: diff + overlay produced; composed layout visually faithful; ≤1% deferred (font + avatar raster).

---

## Summary

Total tasks: 7
Estimated effort: 12–18 hours (friction: medium — four block gap-fills + a mapper + a composed screen shared by two
pages + two page rewrites + unit/E2E/fidelity; no multi-role action wiring, edit flow reused)

**Deliverables:**
- Four blocks (`ProfileHeader` / `TagList` / `CategoryTags` / `ExperienceList`) + three additive VMs (+ optional
  `ProfileHeaderVM.online`) + fixtures + exports.
- `lib/view-models.ts` — `getProfile` (the block VMs + rating + `isOwner`, SPECIALIST + CLIENT + null), contract-typed,
  reusing `getRatingForUser` / `getFavoriteCategories` / `lib/categories` / `toGigCardVM`.
- `Profile` F5-pure `@composed-screen` shared by the own + public pages; thin server pages render it + breadcrumb; the
  edit flow (`/profile/edit` + `updateProfile`) preserved unchanged.
- Mapper unit tests + profile E2E (composed render + edit round-trip + public view); preserved `updateProfile`
  integration tests; F1 diff produced (≤1% deferred).

**Critical path:** blocks (1) → getProfile (2) → Profile composition (3) → page rewrites (4) → tests (5) → acceptance (6) → [artifacts] F1 diff (7).

**Dependencies:** compose-shell-cutover, domain-blocks, profile-evolution, category-taxonomy, ratings-reviews-model — all complete.

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–7):**
- **Four block gap-fills** — `ProfileHeader` (avatar + name + role-tag pill + phone-verified badge + member-since +
  inline stat tiles + optional owner edit affordance), `TagList` («Стек», cycling category colours), `CategoryTags`
  («Избранные категории», the five canonical tags with non-favorites dimmed), `ExperienceList` («Опыт», bio +
  work-experience entries). All token-pure (primitives + layout + tokens), each with a fixture + barrel export.
  **Additive VMs**: `TagListVM` / `CategoryTagsVM` / `ExperienceListVM` + an optional `ProfileHeaderVM.online`.
- **`getProfile` mapper** (`lib/view-models.ts`) — SPECIALIST: header (profile-evolution fields), `stack` (techStack
  split), `categories` (the five via `CATEGORIES` with the user's favorites marked), `experience` (bio + ordered
  `WorkExperience`, period «2021 — Наст. время» for null endYear), `realized` (COMPLETED/PAID assigned gigs via
  `toGigCardVM`, list layout), the aggregate `rating` (via `getRatingForUser` — not hardcoded), and `isOwner`. CLIENT:
  company header + published/completed stats. Returns `null` for a missing user / unset profile. `import type` the VMs.
- **`Profile` `@composed-screen`** (`app/(protected)/profile/Profile.tsx`) — composes the six blocks via layout
  primitives (Section/Split/Stack) only; shared by the own + public views; the owner edit affordance →
  `/profile/edit?from=profile`, dropped for `isOwner=false`. F5-pure (no className/style).
- **Thin server pages** — `page.tsx` (own: `getProfile(self)` + not-set-up `Notice` + `Breadcrumb` + `<Profile>`),
  `[userId]/page.tsx` (public: self→`/profile` redirect + not-found `Notice` + `BackButton` + `<Profile>` with
  `isOwner=false`). The edit flow (`/profile/edit` + `updateProfile`) is **unchanged**.
- **Tests** — `__tests__/integration/profile-vm.test.ts` **4/4** (SPECIALIST header/stack/categories-favorites/
  experience-period/realized/rating + isOwner; public isOwner=false; CLIENT header/stats; null for missing).
  `__tests__/e2e/compose-profile.spec.ts` **3/3** in a real browser — composed render; public read-only (no edit
  affordances); edit affordance → `/profile/edit` + save round-trip. The superseded bespoke-markup pilot
  `profile-specialist-ui-tokens.spec.ts` was removed (its token-surface intent is now covered by F2/F5 lints + the
  composed render).
- **Gates** — `lint:composition` (F5, 8 composed screens) ✓ · `lint:tokens` (F2) ✓ · `npm run build` ✓ (`/profile`
  1.13 kB, `/profile/[userId]` 1.5 kB) · `npm run test:unit` **878/878** (was 874; +4 new) ✓.

**Task 7 (F1 vs `specialist-progile`): diff produced; composed layout faithful; ≤1% deferred.** ratio = **0.1471**
(`docs/design-system/fidelity/out/profile/`: diff / side-by-side / overlay-50; produced by a temporary capture spec,
removed after — artifacts preserved). The residual is the **substitute font** (SF Compact unlicensed) + the mock's
**avatar photo** (rendered here as the initials placeholder — the raster is unexported), not a composition defect.

**Scope guards (non-goals held):** `updateProfile` + the edit form (`ProfileEditForm`) are **unchanged** (the
profile-evolution / profile-sanitization integration tests stay green); no data-model/shell/new-route change; only the
four additive VMs (+ `ProfileHeaderVM.online`) joined the block contract; `ProfileData` lives in `lib/view-models.ts`.

**Reconciliations recorded:**
- The mock's header-right panel is an analytics **placeholder** («Здесь будет ваша статистика / Окно находится на
  стадии разработки»); the real numeric stats (rating, completed-tasks, repeat-order rate) are surfaced in
  `ProfileHeader`'s inline tiles so no data regresses, and `StatPanel` renders the mock's coming-soon panel.
- The basic edit form (`ProfileEditForm`) only edits displayName/techStack/experienceLevel/bio and **wipes** the
  newer profile-evolution fields (position, phoneVerified, …) on save (pre-existing `updateProfile` upsert behavior);
  editing the new fields via the form is out of scope (a separate change). The E2E orders the destructive edit test
  last so the read-only tests see the pristine seed.
- The **public profile** (`/profile/[userId]`) now reuses the composed `Profile` (read-only) instead of its old bespoke
  English-labelled markup; the self→own redirect target moved from `/dashboard/profile` to `/profile`.
- The pre-existing `back-button-*` specs reference the stale `/dashboard/profile` route and test the `BackButton`
  component (unchanged here) — out of this change's scope.
