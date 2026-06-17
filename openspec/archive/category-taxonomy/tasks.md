# Implementation Tasks: category-taxonomy

> **Phase-1 data change.** Fulfill the `CategoryTag`/`FilterBar`/Profile contract with a `Category` table of exactly
> five (Маркетинг, Дизайн, Программирование, Разработка, Кодинг), a gig⇄category relation, specialist favorite
> categories, query helpers, seed, and a safe-default migration. Additive; **no UI wiring** (Phase 2 binds it), no
> category picker, no `Gig.tags` change, category optional on create. Mirror `app/actions/gig.ts` +
> `lib/reviews.ts` + the reviews test harness. Friction: low–medium.

---

## Task 1: [x] Category model + relations + canonical list (`lib/categories.ts`) + generate

**Implementation Notes:**
- Add to `prisma/schema.prisma`:
  ```prisma
  model Category {
    slug        String @id
    name        String
    order       Int    @default(0)
    gigs        Gig[]
    favoritedBy User[] @relation("FavoriteCategories")
  }
  ```
  Add to `Gig`: `categorySlug String?` and `category Category? @relation(fields: [categorySlug], references: [slug])`.
  Add to `User`: `favoriteCategories Category[] @relation("FavoriteCategories")` (implicit m-n).
- Create `lib/categories.ts`:
  ```ts
  import { prisma } from '@/lib/prisma'
  import type { Category } from '@/app/components/blocks/view-models'
  export const CATEGORIES: readonly { slug: Category; name: string }[] = [
    { slug: 'marketing', name: 'Маркетинг' },
    { slug: 'design', name: 'Дизайн' },
    { slug: 'programming', name: 'Программирование' },
    { slug: 'development', name: 'Разработка' },
    { slug: 'coding', name: 'Кодинг' },
  ] as const
  export const isCategorySlug = (s: string): s is Category => CATEGORIES.some((c) => c.slug === s)
  export async function getCategories() { return prisma.category.findMany({ orderBy: { order: 'asc' } }) }
  export async function getFavoriteCategories(userId: string) {
    const u = await prisma.user.findUnique({ where: { id: userId }, include: { favoriteCategories: { orderBy: { order: 'asc' } } } })
    return u?.favoriteCategories ?? []
  }
  ```
  `slug: Category` (typed `import type`) makes the five compile-time-checked against the contract; no runtime UI coupling.
- Run `npx prisma generate`. Additive — change no existing model/column.

**Test Plan:**
```bash
grep -qE 'model Category' prisma/schema.prisma && grep -qE 'categorySlug' prisma/schema.prisma && grep -qE 'favoriteCategories' prisma/schema.prisma && echo "OK schema"
grep -qE 'import type .*Category' lib/categories.ts && grep -qE 'getCategories|getFavoriteCategories' lib/categories.ts && echo "OK helpers"
npx prisma generate 2>&1 | tail -1
```
Expected: additive Category model + gig FK + favorites m-n; contract-typed helpers; client regenerated.

---

## Task 2: [x] `createGig` accepts + validates an optional category

**Implementation Notes:**
- In `app/actions/gig.ts` `createGig`: read `const category = (formData.get('category') as string) || null`. If
  present and `!isCategorySlug(category)` → `return { error: 'Please choose a valid category.' }`. Add
  `categorySlug: category` to `gigData` (null when absent). Import `isCategorySlug` from `@/lib/categories`.
- **Keep optional** — absent → `null`, existing behaviour/tests unaffected. The FK is the integrity backstop.

**Test Plan:**
```bash
grep -qE "formData.get\('category'\)" app/actions/gig.ts && grep -qE 'categorySlug' app/actions/gig.ts && echo "createGig reads + sets category"
grep -qE 'isCategorySlug' app/actions/gig.ts && echo "validates against the five"
```
Expected: createGig accepts a valid category, rejects off-taxonomy, and is unchanged when no category is supplied.

---

## Task 3: [x] `setFavoriteCategories` action (specialist favorites)

**Implementation Notes:**
- Create `app/actions/category.ts` (`'use server'`):
  ```ts
  import { prisma } from '@/lib/prisma'
  import { getSession } from '@/lib/session'
  import { isCategorySlug } from '@/lib/categories'
  export async function setFavoriteCategories(prevState: { error?: string } | null, formData: FormData) {
    const session = await getSession(); if (!session) { const { redirect } = await import('next/navigation'); redirect('/login') }
    if (session!.role !== 'SPECIALIST') return { error: 'Only specialists can set favorite categories.' }
    const slugs = (formData.getAll('categories') as string[]).filter(isCategorySlug)
    await prisma.user.update({ where: { id: session!.userId }, data: { favoriteCategories: { set: slugs.map((slug) => ({ slug })) } } })
    return { success: true }
  }
  ```
  (Use the same `getSession`/`redirect` pattern as `app/actions/gig.ts`.) `set` = replace semantics; off-taxonomy slugs filtered out.

**Test Plan:**
```bash
test -f app/actions/category.ts && grep -qE 'setFavoriteCategories' app/actions/category.ts && echo "action present"
grep -qE "role !== 'SPECIALIST'" app/actions/category.ts && grep -qE 'favoriteCategories: \{ set:' app/actions/category.ts && echo "specialist-only + replace semantics"
```
Expected: specialist-only favorites with replace semantics; off-taxonomy filtered.

---

## Task 4: [x] Seed the five + assign gigs + FK-safe reset

**Implementation Notes:**
- In `prisma/seed.ts`: import/define the five and `prisma.category.upsert` each (idempotent, keyed on `slug`, with
  `order`). After gigs are seeded, assign a `categorySlug` to each seeded gig — infer from `tags` (e.g. contains
  "Design"→design, "React/Vue/TypeScript"→development, "Python/Go/Node/Java"→programming, "Docker/CI"→coding, else
  marketing) with a fallback; only set when `categorySlug` is null (idempotent). Optionally set a couple of
  specialist favorites.
- In `__tests__/helpers/db.ts` `resetTestDatabase`: add `await prisma.category.deleteMany()` **after**
  `await prisma.gig.deleteMany()` (Gig→Category FK; the favorites implicit join cascades on user/category delete).

**Test Plan:**
```bash
grep -qiE 'category.upsert' prisma/seed.ts && echo "seed upserts the five"
grep -qE 'prisma.category.deleteMany' __tests__/helpers/db.ts && echo "FK-safe reset"
```
Expected: idempotent category seed + gig assignment; reset deletes categories FK-safely.

---

## Task 5: [x] Integration tests

**Implementation Notes:**
- Add `__tests__/integration/category-taxonomy.test.ts` (mock `@/lib/prisma`, `next/headers`, `next/navigation`;
  `createTestUser`/`createTestGig`; `withAuthContext`). A local `seedCategories(prisma)` upserts the five in
  `beforeEach` (the test DB is reset between tests). Cover:
  - **Model/contract:** after seeding, exactly five categories; their slugs === the UI's five (cross-check vs
    `CATEGORY_LABEL` keys from `@/app/components/blocks/util`, and names === the labels).
  - **gig⇄category:** `createGig` with `category=design` → gig.categorySlug = 'design' and `gig.category` resolves;
    `createGig` with `category=foo` → `{ error }`; `createGig` with no category → categorySlug null (success).
  - **favorites:** `setFavoriteCategories(['design','coding'])` (as specialist) → `getFavoriteCategories` = those two;
    re-set with `['marketing']` → replaced to one; non-specialist → `{ error }`; off-taxonomy slug filtered out.
- Import actions/helpers after mocks. Create gigs/categories via the test client.

**Test Plan:**
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/category-taxonomy.test.ts 2>&1 | tail -10
```
Expected: assign/query, create-accepts (+ reject invalid + optional), favorites (set/query/replace/role), contract match — all pass.

---

## Task 6: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec Test Plan (schema/helpers, createGig category, favorites action,
  tests, seed, FK-safe reset, typecheck, build, full suite clean DB, lints).
- Confirm scope: additive; no UI/screen/component changes (`app/components`, `app/workbench`, the create-gig form
  untouched); no `Gig.tags` change; gig lifecycle unchanged; the `gig-creation.test.ts` 40 tests still green.

**Test Plan:**
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/categories|app/actions/category|category-taxonomy" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "token baseline unchanged"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/dashboard/gigs/new/' && echo "CHECK UI modified" || echo "OK no UI changes"
```
Expected: all gates green; additive; no UI changes; `gig-creation` tests unaffected.

---

## Summary

Total tasks: 6
Estimated effort: 5–7 hours (friction: low–medium — additive model + relations + one action + a createGig field + helpers + seed + tests)

**Deliverables:**
- ✅ `Category` model (`slug`/`name`/`order`) + optional `Gig.categorySlug` FK + `User.favoriteCategories` m-n; client regenerated.
- ✅ `lib/categories.ts` — contract-typed `CATEGORIES` (the five) + `isCategorySlug` + `getCategories`/`getFavoriteCategories`.
- ✅ `createGig` accepts + validates an optional category; `app/actions/category.ts` `setFavoriteCategories` (specialist-only, replace).
- ✅ Idempotent seed (five + gig assignment); FK-safe `resetTestDatabase`; `category-taxonomy.test.ts`.

**Critical path:** model + helpers (1) → createGig category (2) → favorites action (3) → seed + reset (4) → tests (5) → acceptance (6).

**Scope guards (non-goals):**
- No UI wiring / category picker (Phase 2); no `Gig.tags` change; category optional on create; no multi-category gigs; no other-domain changes.

**Success criteria:**
- ✅ Exactly five contract-matched categories (slugs = the `Category` union; RU names); additive model; client regenerated
- ✅ gig⇄category optional FK + validated `createGig` category; specialist favorites (set/query/replace, specialist-only)
- ✅ `build` + `test:unit` (clean DB) + lints green; no UI changes; `gig-creation` tests unaffected
