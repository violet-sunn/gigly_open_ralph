# Reviews Specification

<!-- Created on archive from change: ratings-reviews-model (2026-06-15). Source delta retained in openspec/archive/ratings-reviews-model/specs/reviews/spec.md -->

The reviews domain provides gig-scoped ratings/reviews and the reputation aggregate that fulfils the
`RatingVM` / `GigCard` / `ProfileHeader` view-model contracts (the canonical UI spec, `docs/DESIGN_SYSTEM_SPEC.md`
§5). Reviews are created only after a gig completes; the aggregate is the server-side source Phase-2 screens bind.

## Requirements

### Requirement: Review Data Model
The schema MUST add a `Review` model recording a 1–5 rating from one party (author) about the counterparty (target)
on a specific gig, with at most one review per author per gig. It MUST be additive (no change to existing
models/columns).

#### Scenario: Review records rating, author, target, gig, and comment
- GIVEN the schema
- WHEN the `Review` model is inspected
- THEN it MUST have `rating` (integer 1–5), `comment` (default empty), a `gig` relation, an `author` relation (who
  wrote it), a `target` relation (who is reviewed), and `createdAt`

#### Scenario: At most one review per author per gig
- GIVEN a gig and an author who has already reviewed it
- WHEN a second review by the same author for the same gig is attempted
- THEN it MUST be rejected by a unique constraint (`@@unique([gigId, authorId])`)
- AND both parties (client and assigned specialist) MAY each leave one review for the same gig (two reviews max)

#### Scenario: Additive and client regenerated
- GIVEN the change
- WHEN the schema diff is inspected
- THEN only the new `Review` model + its `User`/`Gig` relations are added (no existing model/column changed)
- AND `npx prisma generate` MUST be run so the `prisma.review` client + types exist

**Acceptance Criteria:**
- `Review` model with rating (1–5)/comment/gig/author/target/createdAt + `@@unique([gigId, authorId])`
- Additive (no existing model/column changed); Prisma client regenerated

---

### Requirement: Leave-Review Action (lifecycle + authorization + validation)
The `leaveReview` server action MUST create a review only after the gig is `COMPLETED` or `PAID`, only by a party to
the gig (targeting the counterparty), with a validated rating and a sanitized comment, and one review per author
per gig.

#### Scenario: A party leaves a review after completion
- GIVEN a `COMPLETED` (or `PAID`) gig and an authenticated author who is the gig's client or assigned specialist
- WHEN `leaveReview` is called with `rating` 1–5 (and an optional comment)
- THEN it MUST create a `Review` with `authorId` = the caller and `targetId` = the counterparty (specialist for a
  client author; client for a specialist author)

#### Scenario: Review is blocked before completion
- GIVEN a gig whose status is `OPEN`, `IN_PROGRESS`, or `REVIEW`
- WHEN `leaveReview` is called
- THEN it MUST be rejected (a gig can only be reviewed after `COMPLETED`/`PAID`)

#### Scenario: Only parties can review; non-parties rejected
- GIVEN an authenticated user who is neither the gig's client nor its assigned specialist
- WHEN `leaveReview` is called
- THEN it MUST be rejected (only the two parties may review)

#### Scenario: Rating and comment are validated
- GIVEN `leaveReview`
- WHEN the rating is not an integer in 1–5 (or the comment exceeds the length cap)
- THEN it MUST be rejected with a clear error
- AND a valid comment MUST be sanitized (via `lib/sanitize`, as message/application content is)

#### Scenario: Duplicate and unauthenticated are handled
- GIVEN an author who already reviewed the gig (or an unauthenticated caller)
- WHEN `leaveReview` is called
- THEN a duplicate MUST be rejected (one per author per gig) and an unauthenticated caller MUST be redirected to
  `/login`

**Acceptance Criteria:**
- `leaveReview` creates a review only after COMPLETED/PAID, by a party, targeting the counterparty
- Rating (1–5) + sanitized comment validated; one-per-author-per-gig + auth guard enforced

---

### Requirement: Rating Aggregate Fulfilling the RatingVM Contract
A `getRatingForUser` aggregate MUST expose **exactly** the `RatingVM` contract fields (`value`, `count`, `verified`)
for a user, derived from their received reviews.

#### Scenario: Aggregate returns the contract shape
- GIVEN a user who is the `target` of one or more reviews
- WHEN `getRatingForUser(userId)` is called
- THEN it MUST return `{ value, count, verified }` where `value` = the average rating, `count` = the number of
  reviews, and `verified` = `true` (backed by ≥1 gig-verified review)
- AND the returned object MUST be assignable to `Pick<RatingVM, 'value' | 'count' | 'verified'>` (the contract,
  imported `import type` from the view-model SSOT)

#### Scenario: No reviews yields zeros
- GIVEN a user with no received reviews
- WHEN `getRatingForUser(userId)` is called
- THEN it MUST return `{ value: 0, count: 0, verified: false }`

#### Scenario: Aggregate is server-only with no runtime UI coupling
- GIVEN `lib/reviews.ts`
- WHEN its imports are inspected
- THEN the `RatingVM` contract MUST be imported as a **type only** (erased at build) — the aggregate is pure server
  data with no runtime dependency on the UI kit

**Acceptance Criteria:**
- `getRatingForUser` returns exactly `{ value, count, verified }` matching `RatingVM`; empty → `{0, 0, false}`
- The contract is referenced via `import type` (compile-time match, no runtime UI coupling)

---

### Requirement: Seeded Sample Reviews and Verification
The seed MUST add sample reviews on completed/paid gigs, and integration tests MUST cover create / aggregate /
authorization with the suite staying green.

#### Scenario: Seed adds sample reviews idempotently
- GIVEN `prisma/seed.ts`
- WHEN it runs (or re-runs)
- THEN it MUST add sample reviews on existing seeded `COMPLETED`/`PAID` gigs (both directions where both parties
  exist), without duplicating on re-run

#### Scenario: Integration tests cover create/aggregate/authorization
- GIVEN `__tests__/integration/reviews.test.ts`
- WHEN `npm run test:unit` runs
- THEN it MUST cover: a party creating a review after COMPLETED/PAID; rejection before completion; rejection of a
  non-party; rating validation; duplicate rejection; the aggregate's values + contract shape; and the empty case
- AND the overall unit suite MUST stay green

#### Scenario: Additive — existing flows unaffected
- GIVEN the change
- WHEN `npm run build` and the suite run
- THEN they MUST pass with no change to the gig lifecycle or any existing model/flow, and `npm run lint:tokens` +
  `npm run lint:composition` MUST stay green (no UI change)

**Acceptance Criteria:**
- Seed adds idempotent sample reviews on COMPLETED/PAID gigs
- Tests cover create/aggregate/authorization + the contract match; `npm run build` + `npm run test:unit` green; additive
