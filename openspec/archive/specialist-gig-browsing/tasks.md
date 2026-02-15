# Tasks: Specialist Gig Browsing & Application Flow

## Checklist

- [x] 1. Add Application model to Prisma schema and run migration
  - **Implementation:** Add `Application` model to `prisma/schema.prisma` with fields (id, gigId, specialistId, coverLetter, status, createdAt, updatedAt). Add `@@unique([gigId, specialistId])`. Add `applications Application[]` relation to both User and Gig models. Run `npx prisma migrate dev --name add-application-model`.
  - **Test plan:** Run `npx prisma validate` — must pass. Migration must succeed. Verify migration SQL includes unique constraint.

- [x] 2. Create `applyToGig` server action in `app/actions/gig.ts`
  - **Implementation:** Add `applyToGig(prevState, formData)` to existing `app/actions/gig.ts`. Read session via `getSession()`. Validate: session exists (redirect `/login`), role is SPECIALIST, gig exists, gig status is OPEN, no duplicate application. Read `gigId` and `coverLetter` from formData. Create application via `prisma.application.create()`. Redirect to `/dashboard/gigs/{gigId}`.
  - **Test plan:** Covered by integration test (task 6).

- [x] 3. Create gig browse page at `app/dashboard/gigs/page.tsx`
  - **Implementation:** Server component. Query `prisma.gig.findMany({ where: { status: 'OPEN' }, orderBy: { createdAt: 'desc' }, include: { client: { select: { email: true } } } })`. Render list with title, budget (formatted ₽), tags, date. Each item links to `/dashboard/gigs/[id]`. Empty state: "No open gigs available." Accessible to both roles.
  - **Test plan:** `npx tsc --noEmit` — must pass.

- [x] 4. Create gig detail page at `app/dashboard/gigs/[id]/page.tsx`
  - **Implementation:** Server component. Query gig by `params.id` with `include: { client: true, applications: { include: { specialist: { select: { email: true } } } } }`. Show full gig details (title, description, budget, tags, status, client email). For SPECIALIST: show apply form (client component with `useActionState` + `useFormStatus`) or "already applied" message. For CLIENT who owns the gig: show applications list. 404 fallback with link to `/dashboard`.
  - **Test plan:** `npx tsc --noEmit` — must pass.

- [x] 5. Update dashboard for both roles
  - **Implementation:** In `app/dashboard/page.tsx`:
    - SPECIALIST: Replace disabled "Browse Gigs" button with `<Link href="/dashboard/gigs">`. Query `prisma.application.findMany({ where: { specialistId: session.userId }, include: { gig: { select: { title: true } } }, orderBy: { createdAt: 'desc' } })`. List applications with gig title, status badge, date. Empty state: "No applications yet."
    - CLIENT: Update gig query to include `_count: { select: { applications: true } }`. Show application count next to each gig.
  - **Test plan:** `npx tsc --noEmit` — must pass.

- [x] 6. Add integration test `scripts/test-gig-applications.ts`
  - **Implementation:** Create test script that:
    1. Creates a CLIENT user and two SPECIALIST users
    2. Creates an OPEN gig owned by the CLIENT
    3. Creates an application from SPECIALIST-1 — verifies all fields
    4. Verifies duplicate application is prevented (unique constraint)
    5. Verifies application is linked to correct gig and specialist
    6. Verifies application status defaults to "PENDING"
    7. Creates a second application from SPECIALIST-2 — verifies gig has 2 applications
    8. Verifies gig applications count via `_count`
    9. Creates a non-OPEN gig (status "IN_PROGRESS") — verifies it's excluded from OPEN query
    10. Cleanup test data
  - **Test plan:** Run `npx tsx scripts/test-gig-applications.ts` — all assertions must pass.

- [x] 7. Run full validation
  - **Implementation:** Run all checks: `npx tsc --noEmit`, `npm run lint`, `npx prisma validate`, `npx tsx scripts/test-auth-flow.ts`, `npx tsx scripts/test-gig-creation.ts`, `npx tsx scripts/test-gig-applications.ts`, `npm run build`.
  - **Test plan:** All commands must exit 0 with no errors.
