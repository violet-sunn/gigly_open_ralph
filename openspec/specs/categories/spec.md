# Categories Specification

<!-- Created on archive from change: category-taxonomy (2026-06-15). Source delta retained in openspec/archive/category-taxonomy/specs/categories/spec.md -->

The categories domain provides the fixed five-category taxonomy (Маркетинг, Дизайн, Программирование, Разработка,
Кодинг) that fulfils the `CategoryTag` / `FilterBar` / Profile view-model contracts (canonical UI spec,
`docs/DESIGN_SYSTEM_SPEC.md` §5): a `Category` table, a gig⇄category relation, specialist favorite categories, and
the query helpers Phase-2 screens bind. SQLite has no native enums, so the five are modelled as a seeded table.

## Requirements

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
