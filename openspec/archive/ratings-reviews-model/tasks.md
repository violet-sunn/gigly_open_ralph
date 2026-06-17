# Implementation Tasks: ratings-reviews-model

> **First Phase-1 data change.** Fulfill the `RatingVM`/`GigCard`/`ProfileHeader` contract with a real `Review`
> model, a guarded `leaveReview` action, and a `getRatingForUser` aggregate typed to the contract — plus seed +
> tests. Additive; **no UI wiring** (Phase 2 binds it), no editing/deletion, no review notifications, no identity
> `verified`. Mirror `app/actions/gig.ts` (action) + `lib/notifications.ts` (data helper) + `gig-lifecycle.test.ts`
> (test harness). Friction: low–medium.

---

## Task 1: [x] Review model (schema + relations) + regenerate client

**Implementation Notes:**
- Add to `prisma/schema.prisma`:
  ```prisma
  model Review {
    id        String   @id @default(cuid())
    rating    Int
    comment   String   @default("")
    gigId     String
    gig       Gig      @relation(fields: [gigId], references: [id])
    authorId  String
    author    User     @relation("ReviewsAuthored", fields: [authorId], references: [id])
    targetId  String
    target    User     @relation("ReviewsReceived", fields: [targetId], references: [id])
    createdAt DateTime @default(now())

    @@unique([gigId, authorId])
    @@index([targetId])
    @@index([gigId])
  }
  ```
  Add to `User`: `reviewsAuthored Review[] @relation("ReviewsAuthored")` and `reviewsReceived Review[] @relation("ReviewsReceived")`. Add to `Gig`: `reviews Review[]`.
- Run `npx prisma generate` (so `prisma.review` + types exist). The test DB is built from the schema, so the table
  appears automatically; for the dev DB run `npx prisma db push`. **Additive** — change no existing model/column.

**Test Plan:**
```bash
grep -qE 'model Review' prisma/schema.prisma && grep -qE '@@unique\(\[gigId, authorId\]\)' prisma/schema.prisma && echo "OK Review model + constraint"
grep -qE 'ReviewsAuthored|ReviewsReceived' prisma/schema.prisma && echo "OK User relations"
npx prisma generate 2>&1 | tail -2
npx tsc --noEmit 2>&1 | grep -i 'review' && echo "CHECK type error" || echo "OK schema types resolve"
```
Expected: additive Review model with one-per-author-per-gig constraint; client regenerated.

---

## Task 2: [x] `leaveReview` server action

**Implementation Notes:**
- Create `app/actions/review.ts` (`'use server'`), mirroring `approveWork`/`markAsPaid` in `app/actions/gig.ts`:
  - `const session = await getSession(); if (!session) redirect('/login')`.
  - Read `gigId`, `rating` (`Number(formData.get('rating'))`), `comment` from `formData`.
  - Validate `rating`: `Number.isInteger(rating) && rating >= 1 && rating <= 5` else `{ error }`.
  - `const gig = await prisma.gig.findUnique({ where: { id: gigId } })`; not found → `{ error }`.
  - `if (gig.status !== 'COMPLETED' && gig.status !== 'PAID') return { error: '…only after completion…' }`.
  - Determine `targetId`: client author → `gig.assignedSpecialistId`; specialist author (`gig.assignedSpecialistId === session.userId`) → `gig.clientId`; otherwise `{ error: 'only parties…' }`. Guard missing counterparty.
  - Sanitize + cap `comment` via `lib/sanitize` (as messages/applications); enforce one-per-author-per-gig
    (pre-check `prisma.review.findUnique({ where: { gigId_authorId: { gigId, authorId: session.userId } } })`).
  - `await prisma.review.create({ data: { gigId, authorId: session.userId, targetId, rating, comment } })`; then
    `redirect('/gigs/' + gigId)`. (No notification — out of scope.)

**Test Plan:**
```bash
grep -qE "getSession|redirect\('/login'\)" app/actions/review.ts && echo "auth guard"
grep -qE "COMPLETED|PAID" app/actions/review.ts && echo "lifecycle gate"
grep -qE 'sanitize' app/actions/review.ts && echo "comment sanitized"
```
Expected: guarded create — after COMPLETED/PAID, by a party, target=counterparty, rating 1–5, sanitized comment, one-per-party.

---

## Task 3: [x] `getRatingForUser` aggregate (contract-typed)

**Implementation Notes:**
- Create `lib/reviews.ts`:
  ```ts
  import { prisma } from '@/lib/prisma'
  import type { RatingVM } from '@/app/components/blocks/view-models'

  export type RatingAggregate = Pick<RatingVM, 'value' | 'count' | 'verified'>

  export async function getRatingForUser(userId: string): Promise<RatingAggregate> {
    const r = await prisma.review.aggregate({ where: { targetId: userId }, _avg: { rating: true }, _count: { _all: true } })
    const count = r._count._all
    return { value: r._avg.rating ?? 0, count, verified: count > 0 }
  }
  ```
- `import type` keeps it server-only (no runtime UI coupling); the `Pick<RatingVM, …>` return type makes tsc enforce
  the contract match. Document `verified = count > 0` (gig-verified review present; `profile-evolution` #13 refines it).

**Test Plan:**
```bash
grep -qE 'import type .*RatingVM' lib/reviews.ts && echo "contract via import type"
grep -qE "_avg: \{ rating: true \}|_count" lib/reviews.ts && echo "aggregate query"
```
Expected: returns exactly `{ value, count, verified }` typed to the contract; empty → `{0,0,false}`.

---

## Task 4: [x] Seed sample reviews (idempotent)

**Implementation Notes:**
- In `prisma/seed.ts`, after gigs are seeded: for each seeded gig with status `COMPLETED` or `PAID` and an
  `assignedSpecialistId`, create up to two reviews — client→specialist and specialist→client — via
  `prisma.review.upsert` keyed on `{ gigId_authorId: { gigId, authorId } }` (idempotent on re-run). Use realistic
  ratings (e.g. 4–5) + short RU comments.

**Test Plan:**
```bash
grep -qiE 'review' prisma/seed.ts && echo "seed adds reviews"
# (seed runs via `npm run db:seed`/prisma seed in dev; idempotent on re-run)
```
Expected: sample reviews on COMPLETED/PAID gigs, both directions, no duplicates on re-run.

---

## Task 5: [x] Integration tests + full acceptance run

**Implementation Notes:**
- Add `__tests__/integration/reviews.test.ts` following `gig-lifecycle.test.ts` (mock `@/lib/prisma`,
  `next/headers`, `next/navigation`; `createTestUser`/`createTestGig`; `withAuthContext`/`setTestSessionToken`).
  Create reviews **inline** via `prisma.review.create` (no `helpers/seed.ts` change). Cover:
  - `leaveReview`: client→specialist after COMPLETED (created, target=specialist); specialist→client after PAID;
    rejected on OPEN/IN_PROGRESS/REVIEW; rejected for a non-party; rating <1/>5/non-integer rejected; duplicate
    (same author+gig) rejected; both parties can review (2 on one gig); unauthenticated → redirect; gig not found.
  - `getRatingForUser`: average + count + `verified:true` for a target with reviews; empty → `{0,0,false}`;
    the returned object satisfies `Pick<RatingVM,'value'|'count'|'verified'>` (shape assertion / typed const).
- Run the full deterministic suite from the spec Test Plan; confirm additive (no UI/screen/lifecycle change).

**Test Plan:**
```bash
npx vitest run __tests__/integration/reviews.test.ts 2>&1 | tail -10
npx tsc --noEmit 2>&1 | grep -E "review|reviews" && echo "CHECK type error" || echo "OK type-clean"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (clean DB)"
npm run lint:tokens && npm run lint:composition && echo "lints green"
git status --porcelain | grep -E 'app/components/|app/workbench/|app/\(protected\)/' && echo "CHECK UI modified" || echo "OK no UI changes"
```
Expected: reviews tests pass; build + suite green (clean DB); lints green; no UI/screen changes.

---

## Summary

Total tasks: 5
Estimated effort: 4–6 hours (friction: low–medium — additive model + one action + one aggregate + seed + tests)

**Deliverables:**
- ✅ `Review` model (rating 1–5, author/target/gig/comment, `@@unique([gigId, authorId])`) + `User`/`Gig` relations; client regenerated.
- ✅ `app/actions/review.ts` `leaveReview` — COMPLETED/PAID gate, party authorization (target=counterparty), rating + sanitized comment validation, one-per-party, auth guard.
- ✅ `lib/reviews.ts` `getRatingForUser` — returns exactly `{ value, count, verified }`, typed to the `RatingVM` contract (`import type`), empty → `{0,0,false}`.
- ✅ Idempotent sample reviews in `prisma/seed.ts`; `__tests__/integration/reviews.test.ts` (create/aggregate/authorization + contract match).

**Critical path:** model + generate (1) → action (2) → aggregate (3) → seed (4) → tests + acceptance (5).

**Scope guards (non-goals):**
- No UI wiring (Phase 2 binds the aggregate); no review editing/deletion; no review notifications; no identity
  `verified` (`profile-evolution` #13); no gig-lifecycle/existing-model changes.

**Success criteria:**
- ✅ Additive `Review` model + guarded `leaveReview` (lifecycle + party auth + validation + one-per-party)
- ✅ `getRatingForUser` returns exactly the `RatingVM` contract shape (empty → `{0,0,false}`)
- ✅ Seed + tests cover create/aggregate/authorization; `build` + `test:unit` (clean DB) + lints green; no UI changes
