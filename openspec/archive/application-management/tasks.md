# Tasks — application-management

## 1. Add `assignedSpecialistId` to Gig model

**Implementation:**
- Add `assignedSpecialistId String?` field to the Gig model in `prisma/schema.prisma`
- Add `assignedSpecialist User? @relation("AssignedGigs", fields: [assignedSpecialistId], references: [id])` relation
- Add corresponding `assignedGigs Gig[] @relation("AssignedGigs")` on the User model
- Run `npx prisma migrate dev --name add-assigned-specialist` to create and apply migration

**Test plan:**
- Run `npx prisma validate` — MUST pass
- Run `npx prisma migrate dev` — MUST apply cleanly
- Existing gigs MUST retain their data (nullable field, no breaking change)

---

## 2. Implement `acceptApplication` server action

**Implementation:**
- Add `acceptApplication` to `app/actions/gig.ts`
- Signature: `(prevState: { error?: string } | null, formData: FormData)` — reads `applicationId` from formData
- Validate: session exists (redirect `/login`), role is CLIENT, application exists, application is PENDING, gig is OPEN, user owns the gig
- Use `prisma.$transaction()` to atomically:
  1. Update the application status to "ACCEPTED"
  2. Update the gig status to "IN_PROGRESS" and set `assignedSpecialistId`
  3. Update all other PENDING applications for the gig to "REJECTED"
- Redirect to `/dashboard/gigs/{gigId}` on success

**Test plan:**
- Create integration test `scripts/test-accept-application.ts`:
  - Create a client, two specialists, a gig, and two applications
  - Accept one application → assert gig status is "IN_PROGRESS", accepted app status is "ACCEPTED", other app status is "REJECTED", `assignedSpecialistId` is set
  - Attempt to accept on a non-OPEN gig → assert error returned
  - Attempt to accept as non-owner → assert error returned
  - Attempt to accept as SPECIALIST → assert error returned
- Run: `npx tsx scripts/test-accept-application.ts`

---

## 3. Implement `rejectApplication` server action

**Implementation:**
- Add `rejectApplication` to `app/actions/gig.ts`
- Signature: `(prevState: { error?: string } | null, formData: FormData)` — reads `applicationId` from formData
- Validate: session exists (redirect `/login`), role is CLIENT, application exists, application is PENDING, user owns the gig
- Update application status to "REJECTED"
- Redirect to `/dashboard/gigs/{gigId}` on success

**Test plan:**
- Create integration test `scripts/test-reject-application.ts`:
  - Create a client, a specialist, a gig, and an application
  - Reject the application → assert app status is "REJECTED", gig status remains "OPEN"
  - Attempt to reject an already-rejected application → assert error returned
  - Attempt to reject as non-owner → assert error returned
- Run: `npx tsx scripts/test-reject-application.ts`

---

## 4. Update gig detail page with Accept/Reject UI

**Implementation:**
- Create a client component `app/dashboard/gigs/[id]/ApplicationActions.tsx`:
  - Renders Accept and Reject buttons for each PENDING application
  - Each button is a `<form>` with hidden `applicationId` field
  - Uses `useActionState` with `acceptApplication` / `rejectApplication`
  - Uses `useFormStatus` for loading states ("Accepting..." / "Rejecting...")
  - Displays inline error from action state
- Update `app/dashboard/gigs/[id]/page.tsx`:
  - For gig owner on OPEN gigs: render `ApplicationActions` for each PENDING application
  - For IN_PROGRESS gigs: show status badges ("Accepted" / "Rejected") instead of buttons
  - Show assigned specialist email when gig is IN_PROGRESS
  - Include `assignedSpecialist` in the Prisma query

**Test plan:**
- Manual: Log in as CLIENT, navigate to owned gig with applications
  - Assert Accept/Reject buttons visible on PENDING applications
  - Click Accept → page reloads, gig shows IN_PROGRESS, accepted app shows badge, others show "Rejected"
  - Click Reject on a different gig's application → app shows "Rejected", gig stays OPEN
- Manual: Log in as SPECIALIST → assert no Accept/Reject buttons visible
- Run `npm run build` — MUST compile without errors

---

## 5. Update client dashboard to show IN_PROGRESS gig details

**Implementation:**
- Update the Prisma query in `app/dashboard/page.tsx` for CLIENT view to include `assignedSpecialist` relation
- Display assigned specialist email next to IN_PROGRESS gigs

**Test plan:**
- Manual: Log in as CLIENT with an IN_PROGRESS gig → dashboard shows specialist email
- Run `npm run build` — MUST compile without errors

---

## 6. Run validators

**Test plan:**
- `npm run typecheck` — MUST pass
- `npm run lint` — MUST pass
- `npm run build` — MUST succeed
