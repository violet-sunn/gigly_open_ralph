# Categories Specification Delta: category-taxonomy

This document contains specification changes for the `category-taxonomy` change — a Phase-1 **data** change
introducing the new `categories` domain. It fulfills the `CategoryTag` / `FilterBar` / Profile view-model contracts
with a real `Category` taxonomy of **exactly five** (Маркетинг, Дизайн, Программирование, Разработка, Кодинг), a
gig⇄category relation, specialist favorite categories, query helpers, and a safe-default migration. It ships **a
model + relations + an action + helpers + a createGig field + seed + tests only** — additive, with **no UI wiring**
(Phase 2 binds categories into the blocks), no category picker UI, and no change to `Gig.tags`.

---

## ADDED Requirements

### Requirement: Category Model and Canonical Five
The schema MUST add a `Category` model (`slug` primary key = the canonical key, `name`, `order`), and a canonical
list MUST define **exactly the five** categories whose slugs equal the blocks' `Category` union, with RU names. It
MUST be additive.

#### Scenario: Exactly five categories matching the contract
- GIVEN the canonical list (`lib/categories.ts` `CATEGORIES`) and the seeded `Category` rows
- WHEN inspected
- THEN there MUST be exactly five categories whose slugs are `marketing`, `design`, `programming`, `development`,
  `coding` (the blocks' `Category` union) with names Маркетинг, Дизайн, Программирование, Разработка, Кодинг

#### Scenario: Canonical list is typed to the contract
- GIVEN `CATEGORIES`
- WHEN its type is inspected
- THEN each entry's `slug` MUST be typed as the `Category` contract (imported `import type` from the view-model SSOT),
  so off-taxonomy slugs fail to compile — no runtime UI coupling

#### Scenario: Additive and client regenerated
- GIVEN the schema diff
- WHEN inspected
- THEN only the new `Category` model + the `Gig`/`User` relations are added (no existing model/column changed)
- AND `npx prisma generate` MUST be run so `prisma.category` + types exist

**Acceptance Criteria:**
- `Category` model (`slug`/`name`/`order`) + a contract-typed `CATEGORIES` list of exactly the five
- Additive (no existing model/column changed); client regenerated

---

### Requirement: Gig ⇄ Category Relation (safe-default)
A gig MUST relate to at most one category via an optional FK (safe-default), and `createGig` MUST accept and
validate an optional category.

#### Scenario: A gig is assigned and queried by category
- GIVEN the five categories exist
- WHEN a gig is created/updated with a `categorySlug` of one of the five
- THEN the gig MUST persist that category and `gig.category` MUST resolve to the matching `Category` row

#### Scenario: createGig accepts a valid category and rejects an invalid one
- GIVEN an authenticated client calling `createGig`
- WHEN a `category` field equal to one of the five is supplied
- THEN the created gig's `categorySlug` MUST be set to it
- AND WHEN a `category` not among the five is supplied, `createGig` MUST be rejected with a clear error

#### Scenario: Category is optional (safe-default, backward-compatible)
- GIVEN `createGig` called without a `category` (the existing behaviour)
- WHEN the gig is created
- THEN `categorySlug` MUST be `null` and creation MUST succeed unchanged
- AND existing gigs migrate to `categorySlug = null` (additive, no back-fill, no data loss)

**Acceptance Criteria:**
- Optional `Gig.categorySlug` FK; `createGig` accepts + validates a category (rejects off-taxonomy); absent → `null`
- Existing gigs migrate to `null`; gig↔category is queryable

---

### Requirement: Specialist Favorite Categories
A specialist MUST be able to set favorite categories (many-to-many) via a specialist-only action with replace
semantics, queryable per user.

#### Scenario: A specialist sets and queries favorites
- GIVEN an authenticated specialist
- WHEN `setFavoriteCategories` is called with a subset of the five
- THEN `getFavoriteCategories(userId)` MUST return exactly that subset (membership), and re-calling with a different
  subset MUST **replace** (not append) the favorites

#### Scenario: Only specialists can set favorites; off-taxonomy ignored/rejected
- GIVEN a non-specialist (or an unauthenticated caller)
- WHEN `setFavoriteCategories` is called
- THEN it MUST be rejected (specialist-only; unauthenticated → `/login`)
- AND any slug not among the five MUST NOT be persisted

**Acceptance Criteria:**
- `User.favoriteCategories` m-n + `setFavoriteCategories` (specialist-only, replace); `getFavoriteCategories` works
- Off-taxonomy slugs are not persisted; non-specialists rejected

---

### Requirement: Contract Match, Query Helpers, and Verification
Query helpers MUST expose the categories for the contracts, the five MUST match the UI contract exactly, and the
suite MUST stay green with additive, FK-safe test isolation.

#### Scenario: Query helpers fulfill the FilterBar/Profile contracts
- GIVEN `lib/categories.ts`
- WHEN `getCategories()` and `getFavoriteCategories(userId)` are called
- THEN `getCategories()` MUST return the five (ordered) for `FilterBar` options, and `getFavoriteCategories` MUST
  return a user's favorites for the Profile «Избранные» — server-only (no runtime UI coupling)

#### Scenario: The five match the UI contract exactly
- GIVEN `CATEGORIES` and the UI's category keys (e.g. `CATEGORY_LABEL` / `CATEGORY_BG` keyed by `Category`)
- WHEN a test compares them
- THEN the set of category slugs MUST equal the UI's five exactly (and the RU names MUST match the UI labels)

#### Scenario: Additive — suite green, FK-safe reset
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with no change to existing flows; `resetTestDatabase` MUST delete `category` FK-safely (after
  `gig`); `npm run lint:tokens` + `npm run lint:composition` MUST stay green (no UI change)

**Acceptance Criteria:**
- `getCategories`/`getFavoriteCategories` work; the five match the UI contract exactly (slugs + names)
- `npm run build` + `npm run test:unit` green; FK-safe reset; additive

---

## Test Plan

This change ships a model + relations + action + helpers + a createGig field + seed + tests. Validation is by
deterministic commands. Commands assume the repo root.

### Schema + canonical list + client
```bash
grep -qE 'model Category' prisma/schema.prisma && grep -qE 'categorySlug' prisma/schema.prisma && grep -qE 'favoriteCategories' prisma/schema.prisma && echo "model + gig FK + favorites m-n"
test -f lib/categories.ts && grep -qE 'import type .*Category' lib/categories.ts && echo "canonical list typed to contract (import type)"
npx prisma generate >/dev/null 2>&1 && echo "client regenerated"
git diff prisma/schema.prisma | grep -E '^-' | grep -vE '^---' && echo "CHECK schema deletions" || echo "OK schema additive"
```

### createGig accepts category; favorites action present
```bash
grep -qE "formData.get\('category'\)|categorySlug" app/actions/gig.ts && echo "createGig reads category"
test -f app/actions/category.ts && grep -qE 'setFavoriteCategories' app/actions/category.ts && echo "favorites action present"
```

### Tests (assign/query, create-accepts, favorites, contract match)
```bash
npm run clean:test-db >/dev/null 2>&1 && npx vitest run __tests__/integration/category-taxonomy.test.ts 2>&1 | tail -10
```

### Seed (idempotent) + FK-safe reset
```bash
grep -qiE 'category.upsert' prisma/seed.ts && echo "seed upserts categories"
grep -qE 'prisma.category.deleteMany' __tests__/helpers/db.ts && echo "FK-safe category cleanup in reset"
```

### Typecheck + build + suite + scope (additive, no UI change)
```bash
npx tsc --noEmit 2>&1 | grep -E "lib/categories|app/actions/category|category-taxonomy.test" && echo "CHECK type error" || echo "OK new files type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green (no UI change)"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/\(protected\)/|app/dashboard/gigs/new/' && echo "CHECK UI modified" || echo "OK no UI changes"
```

### Manual review
1. Confirm `Category` is additive, seeded with exactly the five (slugs = the contract union; RU names), client regenerated.
2. Confirm `createGig` accepts + validates an optional category (rejects off-taxonomy); absent → `null` (existing tests green).
3. Confirm specialist favorites set/query/replace + specialist-only; `getCategories`/`getFavoriteCategories` work.
4. Confirm the five match the UI contract exactly and no screen/component is wired to categories yet (Phase 2).
