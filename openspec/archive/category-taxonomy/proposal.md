# Change Proposal: category-taxonomy

> Phase 1, change 11 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It
> fulfills the `CategoryTag` / `FilterBar` view-model contracts (canonical UI spec / `docs/DESIGN_SYSTEM_SPEC.md` §5)
> with a real **`Category`** taxonomy of **exactly five** — Маркетинг, Дизайн, Программирование, Разработка, Кодинг —
> a gig⇄category relation, specialist favorite categories, and a safe-default migration. Additive; **no UI wiring**
> (Phase 2 binds categories into GigCard/FilterBar/Profile).

## Problem Statement

The block vocabulary declares a fixed `Category` enum (`marketing | design | programming | development | coding`,
rendered by `CategoryTag` with RU labels) and `FilterBarVM.filters`, and renders them today **from fixtures**. There
is no real taxonomy:

- The schema has **no `Category` concept** — `Gig.tags` is a free-text string; nothing constrains gigs to the five
  canonical categories or lets specialists declare favorite categories.
- There is **no source of the five categories** for `FilterBar` filter options or `CategoryTag` on a gig — so
  Phase-2 screens have nothing real to bind; categories would stay mocked.
- SQLite (the project DB) has **no native Prisma enums**, so the canonical five must be modelled as a small **table**
  (the enum-as-table pattern) to support FK relations.

The planning doc's Phase-1 worklist maps this exactly: a `Category` model + relations + favorites that *fulfill* the
CategoryTag / FilterBar / Profile contracts. This change is additive and decoupled from the UI (the blocks already
type/render the `Category` shape).

## Proposed Solution

Add a `Category` table seeded with exactly the five canonical categories, a gig⇄category relation, a specialist
favorites relation + action, query helpers typed to the contract, and a safe-default migration. Five deliverable
groups:

1. **`Category` model + canonical list** — `Category { slug @id, name, order }` (`slug` = the canonical key, the PK).
   `lib/categories.ts` exports `CATEGORIES: readonly { slug: Category; name: string }[]` typed so each `slug` is the
   blocks' `Category` union (imported `import type` — compile-time guarantees the five slugs **are** the contract
   keys) with the RU names (Маркетинг/Дизайн/Программирование/Разработка/Кодинг).

2. **gig⇄category relation (safe-default)** — `Gig.categorySlug String?` + `category Category?` (optional FK, so
   existing gigs migrate to `null` — additive, no back-fill, no data loss). `createGig` accepts an **optional**
   `category` field, validates it is one of the five (rejecting off-taxonomy values), and sets it; absent → `null`.

3. **Specialist favorite categories** — a many-to-many `User.favoriteCategories ⇄ Category.favoritedBy`
   (`@relation("FavoriteCategories")`) + a `setFavoriteCategories` server action (specialist-only) with **replace**
   semantics (validates against the five).

4. **Query helpers (fulfill the contracts)** — `getCategories()` (the five, ordered → `FilterBar` options) and
   `getFavoriteCategories(userId)` (→ Profile's «Избранные»), in `lib/categories.ts`. Server-only; `Category` type
   imported `import type` (no runtime UI coupling).

5. **Seed + safe migration + tests** — `prisma/seed.ts` upserts the five categories (idempotent) and assigns a
   category to seeded gigs (inferred from tags, with a fallback). `resetTestDatabase` gains FK-safe `category`
   cleanup. `__tests__/integration/category-taxonomy.test.ts` covers assign/query, create-accepts-category (+ rejects
   invalid), favorites (set/query/replace, specialist-only), and the **exact-five contract match**.

This change emits **a model + relations + an action + query helpers + a `createGig` category field + seed + tests
only**. It does **not** wire categories into any screen/component (Phase 2 binds GigCard/FilterBar/Profile), add a
category picker UI, change `Gig.tags`, or make category required on gig creation (kept optional for backward
compatibility). The blocks already render the `Category` shape — this change makes the taxonomy real.

## Constraints

### MUST Requirements
- A `Category` model MUST exist (`slug` PK = the canonical key, `name`, `order`), seeded with **exactly the five**
  categories whose slugs are **exactly** the blocks' `Category` union (`marketing/design/programming/development/
  coding`) with RU names; it MUST be additive (no existing model/column changed) and the client regenerated.
- A gig MUST relate to **at most one** category via an **optional** `Gig.categorySlug` FK (safe-default: existing
  gigs → `null`); `createGig` MUST accept an optional `category`, validate it is one of the five (reject otherwise),
  and persist it.
- A specialist MUST be able to set **favorite categories** (many-to-many) via a specialist-only action with replace
  semantics; both `getCategories()` and `getFavoriteCategories(userId)` MUST be queryable.
- The canonical list MUST be typed to the `Category` contract (compile-time) and a test MUST assert the five
  match the UI contract exactly; the seed MUST upsert the five idempotently.
- `npm run build` and `npm run test:unit` MUST stay green (additive); `npm run lint:tokens` + `npm run
  lint:composition` MUST stay green (no UI change).

### SHOULD Requirements
- The canonical categories SHOULD live in `lib/categories.ts` (a server data helper) with the `Category` type
  imported `import type` (no runtime UI coupling), so Phase-2 screens import the helpers from `@/lib/categories`.
- `createGig`'s category SHOULD validate against the canonical list (clean error for off-taxonomy), with the FK as
  the integrity backstop; absent category → `null` (unchanged behaviour for existing callers/tests).
- `resetTestDatabase` SHOULD delete `category` after `gig` (FK-safe); category-aware tests SHOULD seed the five in
  `beforeEach` (the test DB is reset between tests).
- Favorites SHOULD use `set` semantics (replace) so a specialist's selection is authoritative.

### Non-Goals
- **No UI wiring / category picker.** Binding categories into GigCard/FilterBar/Profile (and the create-gig form
  field) is Phase 2 (`compose-*`). The blocks already render the `Category` shape from fixtures.
- **No change to `Gig.tags`** (free-text tags remain); **no required category** on gig creation (optional for
  backward compatibility); **no multi-category gigs** (the VM is a single `Category`).
- **No identity/other-domain changes**; no review/lifecycle changes.

## Success Criteria

1. `Category` model exists, seeded with exactly the five contract categories (slugs = the `Category` union; RU names); additive; client regenerated.
2. Gigs relate to an optional category; `createGig` accepts + validates a category (rejects off-taxonomy); existing gigs migrate to `null`.
3. Specialists can set/query favorite categories (m-n, replace, specialist-only).
4. `CATEGORIES` is typed to the contract and a test asserts the five match the UI's five exactly; `getCategories`/`getFavoriteCategories` work; seed idempotent.
5. `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; no UI changes.

## Affected Areas

- `prisma/schema.prisma` (new `Category` model; `Gig.categorySlug` optional FK; `User.favoriteCategories` m-n) → `npx prisma generate`
- `lib/categories.ts` (new — `CATEGORIES` typed to the contract + `getCategories`/`getFavoriteCategories`)
- `app/actions/gig.ts` (`createGig` — optional, validated `category` field) and `app/actions/category.ts` (new — `setFavoriteCategories`)
- `prisma/seed.ts` (upsert the five categories; assign categories to seeded gigs, idempotent)
- `__tests__/helpers/db.ts` (`resetTestDatabase` — FK-safe `category` cleanup)
- `__tests__/integration/category-taxonomy.test.ts` (new — assign/query, create-accepts, favorites, contract match)
- read-only inputs: `app/components/blocks/view-models.ts` (the `Category` contract), `app/components/blocks/util.ts` / `app/components/primitives/tokens.ts` (the five UI keys/labels), `app/actions/gig.ts` (createGig pattern)
- `openspec/specs/categories/spec.md` (new domain spec delta)
- (NOT modified: any UI/component/screen file; `Gig.tags`; the gig lifecycle; other domains)

## Risks & Mitigations

**Risk**: SQLite has no native Prisma enums, so a string union can't be enforced at the DB level.
**Mitigation**: Model the five as a `Category` **table** (enum-as-table) with `slug` PK; FK from `Gig` + the
favorites join enforce integrity; `CATEGORIES` typed `slug: Category` enforces the five at compile time; a test
asserts the runtime set equals the UI's five.

**Risk**: Modifying `createGig` breaks the 40 `gig-creation.test.ts` tests.
**Mitigation**: The `category` field is **optional** — absent → `null` (existing callers/tests unaffected); only a
new validation branch fires when a category is supplied. Verify the full suite stays green.

**Risk**: The new `Category` table breaks the inter-test reset on FK constraints (as the `Review` table did).
**Mitigation**: Add `prisma.category.deleteMany()` to `resetTestDatabase` **after** `gig.deleteMany()` (Gig→Category
FK); the implicit favorites join cascades on user/category delete. Category-aware tests seed the five per test.

**Risk**: `GigCardVM.category` is required, but a gig's category can be `null` (safe-default).
**Mitigation**: The data layer is the source; mapping `gig → GigCardVM.category` (defaulting/omitting on `null`) is
Phase 2's job. "Matches the contract" here = the five `Category` **values** equal the contract's five exactly.

**Risk**: Coupling the data layer to the UI by referencing `Category`.
**Mitigation**: `import type` only (erased at build); the view-model is the SSOT for the shape; no runtime dependency
on the blocks/primitives tree.
