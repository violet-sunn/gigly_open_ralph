# Tasks: Gig Creation

## Checklist

- [x] 1. Add Gig model to Prisma schema and run migration
  - **Implementation:** Add `Gig` model to `prisma/schema.prisma` with all fields (id, title, description, budget, serviceFee, totalAmount, status, tags, clientId, createdAt, updatedAt). Add `gigs Gig[]` relation to User model. Run `npx prisma migrate dev --name add-gig-model`.
  - **Test plan:** Run `npx prisma validate` — must pass. Run `npx prisma migrate dev --name add-gig-model` — must succeed. Verify migration SQL file is created.

- [x] 2. Create `createGig` server action in `app/actions/gig.ts`
  - **Implementation:** Export `createGig(prevState, formData)` with `'use server'`. Read session via `getSession()`. Validate: session exists (redirect to `/login`), role is CLIENT, title/description not empty, budget is positive number. Convert budget from roubles to kopecks (× 100). Calculate `serviceFee = Math.floor(budgetKopecks * 0.20)`, `totalAmount = budgetKopecks + serviceFee`. Create gig via `prisma.gig.create()`. Redirect to `/dashboard`.
  - **Test plan:** Covered by integration test (task 5).

- [x] 3. Create gig creation form at `app/dashboard/gigs/new/page.tsx`
  - **Implementation:** Server component wrapper checks session + role (redirect SPECIALIST to `/dashboard`, unauthenticated to `/login`). Client component form with `useActionState` + `useFormStatus`. Fields: title (text), description (textarea), budget (number input in roubles), tags (text). Live fee preview using `useState` on budget — shows budget, 20% fee, and total formatted with `Intl.NumberFormat('ru-RU')`. Error display from `state?.error`. Submit button shows "Posting..." when pending.
  - **Test plan:** `npx tsc --noEmit` — must pass. Manual: navigate to `/dashboard/gigs/new` as CLIENT, verify form renders, fee preview updates on budget input.

- [x] 4. Update Client Dashboard to link to gig form and list gigs
  - **Implementation:** In `app/dashboard/page.tsx`, import `prisma` and query `prisma.gig.findMany({ where: { clientId: session.userId }, orderBy: { createdAt: 'desc' } })`. Replace disabled "Post a Gig" button with `<Link href="/dashboard/gigs/new">`. Render gig list with title, formatted budget (kopecks → roubles), status badge, and date. Keep empty state fallback.
  - **Test plan:** `npx tsc --noEmit` — must pass. Manual: verify dashboard shows link and gig list after creation.

- [x] 5. Add integration test `scripts/test-gig-creation.ts`
  - **Implementation:** Create test script that:
    1. Creates a CLIENT user and a SPECIALIST user
    2. Tests fee calculation: budget 100000₽ → serviceFee 2000000 kopecks, totalAmount 12000000 kopecks
    3. Tests fee rounding: budget 333₽ → serviceFee 6660 kopecks, totalAmount 39960 kopecks
    4. Creates a gig via Prisma and verifies all fields
    5. Verifies gig is linked to client user (clientId matches)
    6. Verifies gig status defaults to "OPEN"
    7. Verifies a SPECIALIST user's gig count is 0 (role check logic)
    8. Cleanup test data
  - **Test plan:** Run `npx tsx scripts/test-gig-creation.ts` — all assertions must pass.

- [x] 6. Run full validation
  - **Implementation:** Run all checks: `npx tsc --noEmit`, `npm run lint`, `npx prisma validate`, `npx tsx scripts/test-auth-flow.ts`, `npx tsx scripts/test-gig-creation.ts`, `npm run build`.
  - **Test plan:** All commands must exit 0 with no errors.
