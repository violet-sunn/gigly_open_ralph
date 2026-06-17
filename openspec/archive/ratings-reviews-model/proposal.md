# Change Proposal: ratings-reviews-model

> Phase 1, change 10 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`) — the
> first **data** change. It fulfills the `RatingVM` / `GigCard` / `ProfileHeader` view-model contracts
> (`docs/DESIGN_SYSTEM_SPEC.md` §5, now in the canonical UI spec) with a real `Review` model, a guarded
> leave-review action, and a server-side **aggregate** that exposes *exactly* the contract fields
> (`value`, `count`, `verified`). It is additive and does **not** touch the UI — Phase 2 binds the aggregate into
> the blocks (which already render this shape from fixtures).

## Problem Statement

The block vocabulary declares a typed `RatingVM { value; count; verified }` (consumed by `GigCard`, `ProfileCard`,
`ClientCard`, and the `ProfileHeader` rating stat) and renders it today **from fixtures**. There is no real data
behind it:

- The schema has **no review/rating concept** — `User`/`Gig`/`Application` carry no reputation. Nothing records that
  a client or specialist did good work.
- There is **no aggregate** producing the `{ value, count, verified }` triple the blocks need, so Phase-2 screens
  have nothing to bind — the GigCard/ProfileHeader ratings would stay mocked.
- The mechanism's promise — *data fulfills block contracts; screens bind real data* — is unmet for the rating axis.

The planning doc's Phase-1 worklist maps this exactly: a `Review` model + aggregate that *fulfills* the Rating /
GigCard / ProfileHeader contracts. This change is additive (no existing flow changes) and decoupled from the UI
(the blocks already type/​render the shape).

## Proposed Solution

Add the `Review` model, a guarded `leaveReview` server action, and a `getRatingForUser` aggregate typed to the
contract, plus seed data and tests. Four deliverable groups:

1. **`Review` model** (`prisma/schema.prisma`) — `rating` (1–5 `Int`), `comment` (default `""`), `gig`, `author`
   (who wrote it), `target` (who is reviewed), `createdAt`; `@@unique([gigId, authorId])` (one review per party per
   gig) + indexes on `targetId`/`gigId`. Adds named relations to `User` (`reviewsAuthored`/`reviewsReceived`) and a
   `reviews` relation to `Gig`. **Additive** — no change to existing models/columns; `npx prisma generate` regenerates
   the client.

2. **`leaveReview` server action** (`app/actions/review.ts`) — mirrors the lifecycle actions in `app/actions/gig.ts`:
   `getSession()` (unauthenticated → `redirect('/login')`); the gig MUST be `COMPLETED` or `PAID`; the author MUST be
   a **party** (the gig `clientId` or the `assignedSpecialistId`) — the `target` is the **counterparty**; `rating`
   MUST be an integer 1–5; `comment` is sanitized (via `lib/sanitize`, as messages/applications are) and length-
   capped; **one review per author per gig** (the unique constraint + a pre-check). On success it creates the review
   and `redirect`s to the gig.

3. **`getRatingForUser` aggregate** (`lib/reviews.ts`) — `prisma.review.aggregate` over `targetId` returning
   **exactly** the contract fields, typed `Pick<RatingVM, 'value' | 'count' | 'verified'>` (imported `import type`
   from the blocks' view-model SSOT so tsc enforces the match): `value` = average rating (`0` when none), `count` =
   review count, `verified` = backed by ≥1 gig-verified review (`count > 0`; reviews exist only after COMPLETED/PAID,
   so each is a verified transaction). Pure server data — type-only contract import, no runtime UI coupling.

4. **Seed + tests** — `prisma/seed.ts` adds sample reviews on existing seeded COMPLETED/PAID gigs (both directions),
   idempotently. `__tests__/integration/reviews.test.ts` (following the `gig-lifecycle.test.ts` harness) covers
   create / aggregate / authorization, and asserts the aggregate matches the contract shape.

This change emits **a model + an action + an aggregate + seed + tests only**. It does **not** wire ratings into any
screen or component (Phase 2 binds `getRatingForUser` into GigCard/ProfileHeader/ProfileCard/ClientCard), add review
editing/deletion, send notifications on review, or implement identity verification (`profile-evolution` #13 refines
`verified`). The blocks already render the `RatingVM` shape — this change makes the data real.

## Constraints

### MUST Requirements
- A `Review` model MUST exist with `rating` (1–5), `comment`, `gig`, `author`, `target`, `createdAt`, and
  `@@unique([gigId, authorId])` (**one review per party per gig**); it MUST be **additive** (no change to existing
  models/columns) and the Prisma client MUST be regenerated.
- `leaveReview` MUST allow a review only when the gig is `COMPLETED` or `PAID`, only by a **party** (client or
  assigned specialist), targeting the **counterparty**; it MUST validate `rating` (integer 1–5), sanitize + cap the
  `comment`, enforce one-per-author-per-gig, and redirect unauthenticated callers to `/login`.
- `getRatingForUser` MUST return **exactly** `{ value, count, verified }` (typed to the `RatingVM` contract), with
  `value` = average (`0` if none), `count` = number of reviews, `verified` = `count > 0`.
- The seed MUST add sample reviews on COMPLETED/PAID gigs (idempotently); integration tests MUST cover create /
  aggregate / authorization and assert the aggregate matches the contract.
- `npm run build` and `npm run test:unit` MUST stay green (additive; existing flows unaffected); `npm run lint:tokens`
  + `npm run lint:composition` MUST stay green (no UI change).

### SHOULD Requirements
- `leaveReview` SHOULD mirror the existing `app/actions/gig.ts` action shape (`(prevState, formData)` → `{ error }`
  or redirect) and reuse `getSession` + `lib/sanitize`.
- The aggregate SHOULD live in `lib/reviews.ts` (a server data helper, like `lib/notifications.ts`) so Phase-2
  screens import it from an allowed module (`@/lib/*`).
- The aggregate's return type SHOULD reference the `RatingVM` contract via `import type` (the SSOT) so the
  "matches the contract" guarantee is compile-time enforced, with no runtime UI dependency.
- Tests SHOULD follow the `gig-lifecycle.test.ts` harness (mock `@/lib/prisma`/`next/headers`/`next/navigation`;
  `createTestUser`/`createTestGig`), creating reviews via `prisma.review.create` (no factory-helper change, to avoid
  perturbing the parallel factory tests).

### Non-Goals
- **No UI wiring.** Binding `getRatingForUser` into GigCard/ProfileHeader/ProfileCard/ClientCard is Phase 2
  (`compose-*`). The blocks already render `RatingVM` from fixtures.
- **No review editing/deletion** (additive create only); **no review notifications** (avoids the
  `Notification @@unique([userId, gigId])` coupling; out of scope).
- **No identity `verified`.** `profile-evolution` (#13) adds phone/identity verification and will refine the
  aggregate's `verified`; here `verified` = a gig-verified review exists.
- **No changes to the gig lifecycle, existing models/columns, or any other domain.**

## Success Criteria

1. `Review` model exists (1–5 rating, author/target/gig/comment, one-per-author-per-gig), additive; client regenerated.
2. `leaveReview` creates a review only after COMPLETED/PAID, only by a party (target = counterparty), with valid
   rating + sanitized comment + one-per-party enforcement + auth guard.
3. `getRatingForUser` returns exactly `{ value, count, verified }` matching the `RatingVM` contract (empty → `{0,0,false}`).
4. Seed adds sample reviews idempotently; integration tests cover create/aggregate/authorization and the contract match.
5. `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; no UI/lifecycle changes.

## Affected Areas

- `prisma/schema.prisma` (new `Review` model + `User`/`Gig` relations) → `npx prisma generate`
- `app/actions/review.ts` (new — `leaveReview`)
- `lib/reviews.ts` (new — `getRatingForUser` aggregate typed to the contract)
- `prisma/seed.ts` (sample reviews on COMPLETED/PAID gigs, idempotent)
- `__tests__/integration/reviews.test.ts` (new — create/aggregate/authorization + contract match)
- read-only inputs: `app/components/blocks/view-models.ts` (the `RatingVM` contract), `app/actions/gig.ts`
  (action pattern), `lib/session.ts`, `lib/sanitize.ts`, `__tests__/helpers/*`
- `openspec/specs/reviews/spec.md` (new domain spec delta)
- (NOT modified: any UI/component/screen file; existing models/columns; the gig lifecycle)

## Risks & Mitigations

**Risk**: A new Prisma model breaks the test DB or the client types until regenerated.
**Mitigation**: The model is additive (new table + relations only); run `npx prisma generate` so `prisma.review`
exists for tsc + the aggregate; the test DB is built from the schema, so the table appears automatically. Verify
`npm run build` + the full suite stay green.

**Risk**: `verified` is ambiguous (the design's trust badge vs. review-backed).
**Mitigation**: Define `verified = count > 0` here (reviews exist only after COMPLETED/PAID → every review is a
verified transaction) and **document** that `profile-evolution` (#13) will fold in identity verification. The
contract field is satisfied; the semantic is honest and self-contained.

**Risk**: Coupling the server data layer to the UI by importing `RatingVM`.
**Mitigation**: Use `import type` — fully erased at compile time, no runtime dependency on the blocks/primitives
tree. It only enforces the contract match (the view-model is the SSOT for the shape).

**Risk**: Adding to the seed/factory perturbs the already-flaky parallel factory tests
(`factory-validation`/`factory-composability`).
**Mitigation**: Create reviews **inline** via `prisma.review.create` in the new test (no `helpers/seed.ts` factory
change); keep the real seed additions idempotent. Run the full suite with a clean DB (`npm run clean:test-db`) to
avoid the known stale-DB pollution.

**Risk**: Unsanitized review comments (XSS) — the project has xss-protection tests.
**Mitigation**: Sanitize + length-cap the `comment` via `lib/sanitize`, exactly as message/application content is
handled.
