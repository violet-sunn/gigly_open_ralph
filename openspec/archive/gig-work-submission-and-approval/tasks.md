# Implementation Tasks

## Task 1: Implement `submitWork` Server Action

**Implementation Notes:**
- Add `submitWork` function to `app/actions/gig.ts`
- Use `'use server'` directive
- Signature: `async function submitWork(prevState: { error?: string } | null, formData: FormData)`
- Extract `gigId` from formData
- Get session using `getSession()` from `lib/session.ts`
- Validate:
  - User is authenticated (redirect to `/login` if not)
  - User role is "SPECIALIST" (return error if not)
  - Gig exists (return error if not)
  - Gig status is "IN_PROGRESS" (return error if not)
  - User is the assigned specialist (`session.userId === gig.assignedSpecialistId`)
- Update gig status to "REVIEW" using Prisma
- Redirect to `/dashboard/gigs/${gigId}` on success
- Return `{ error: string }` on validation failure

**Test Plan:**
```bash
# Create integration test: scripts/test-submit-work.ts
npx tsx scripts/test-submit-work.ts
```

**Test Assertions:**
- ✓ Assigned specialist can submit work on IN_PROGRESS gig → status becomes REVIEW
- ✓ Non-specialist cannot submit work → error returned
- ✓ Non-assigned specialist cannot submit work → error returned
- ✓ Cannot submit work on OPEN gig → error returned
- ✓ Cannot submit work on REVIEW gig → error returned
- ✓ Cannot submit work on COMPLETED gig → error returned
- ✓ Cannot submit work on non-existent gig → error returned

---

## Task 2: Implement `approveWork` Server Action

**Implementation Notes:**
- Add `approveWork` function to `app/actions/gig.ts`
- Use `'use server'` directive
- Signature: `async function approveWork(prevState: { error?: string } | null, formData: FormData)`
- Extract `gigId` from formData
- Get session using `getSession()` from `lib/session.ts`
- Validate:
  - User is authenticated (redirect to `/login` if not)
  - User role is "CLIENT" (return error if not)
  - Gig exists (return error if not)
  - Gig status is "REVIEW" (return error if not)
  - User is the gig owner (`session.userId === gig.clientId`)
- Update gig status to "COMPLETED" using Prisma
- Redirect to `/dashboard/gigs/${gigId}` on success
- Return `{ error: string }` on validation failure

**Test Plan:**
```bash
# Create integration test: scripts/test-approve-work.ts
npx tsx scripts/test-approve-work.ts
```

**Test Assertions:**
- ✓ Gig owner can approve work on REVIEW gig → status becomes COMPLETED
- ✓ Non-client cannot approve work → error returned
- ✓ Non-owner client cannot approve work → error returned
- ✓ Cannot approve work on OPEN gig → error returned
- ✓ Cannot approve work on IN_PROGRESS gig → error returned
- ✓ Cannot approve work on COMPLETED gig → error returned
- ✓ Cannot approve work on non-existent gig → error returned

---

## Task 3: Add Submit Work UI for Specialists

**Implementation Notes:**
- Modify `app/dashboard/gigs/[id]/page.tsx`
- Add conditional rendering for SPECIALIST role when:
  - Gig status is "IN_PROGRESS"
  - Current user is the assigned specialist (`session.userId === gig.assignedSpecialistId`)
- Create a form with:
  - Hidden input for `gigId`
  - Submit button labeled "Submit Work"
  - Use `useActionState` hook with `submitWork` action
  - Display error message if present
- Style consistently with existing forms (Tailwind CSS)

**Test Plan:**
```bash
# Manual testing steps:
# 1. Register as specialist, apply to gig
# 2. Register as client, create gig, accept specialist's application
# 3. Log in as specialist, navigate to gig detail page
# 4. Verify "Submit Work" button is visible
# 5. Click button, verify gig status changes to REVIEW
# 6. Verify button disappears after submission
```

**Test Assertions:**
- ✓ Submit Work button visible to assigned specialist on IN_PROGRESS gig
- ✓ Submit Work button NOT visible to non-assigned specialist
- ✓ Submit Work button NOT visible to client
- ✓ Submit Work button NOT visible on OPEN, REVIEW, or COMPLETED gigs
- ✓ Clicking button updates status to REVIEW
- ✓ Error message displays on validation failure

---

## Task 4: Add Approve Work UI for Clients

**Implementation Notes:**
- Modify `app/dashboard/gigs/[id]/page.tsx`
- Add conditional rendering for CLIENT role when:
  - Gig status is "REVIEW"
  - Current user is the gig owner (`session.userId === gig.clientId`)
- Create a form with:
  - Hidden input for `gigId`
  - Submit button labeled "Approve Work"
  - Use `useActionState` hook with `approveWork` action
  - Display error message if present
- Style consistently with existing forms (Tailwind CSS)

**Test Plan:**
```bash
# Manual testing steps:
# 1. Continue from Task 3 manual test (gig now in REVIEW)
# 2. Log in as client (gig owner)
# 3. Navigate to gig detail page
# 4. Verify "Approve Work" button is visible
# 5. Click button, verify gig status changes to COMPLETED
# 6. Verify button disappears after approval
```

**Test Assertions:**
- ✓ Approve Work button visible to gig owner on REVIEW gig
- ✓ Approve Work button NOT visible to non-owner client
- ✓ Approve Work button NOT visible to specialist
- ✓ Approve Work button NOT visible on OPEN, IN_PROGRESS, or COMPLETED gigs
- ✓ Clicking button updates status to COMPLETED
- ✓ Error message displays on validation failure

---

## Task 5: End-to-End Integration Test

**Implementation Notes:**
- Create comprehensive test script: `scripts/test-gig-lifecycle.ts`
- Test the complete flow:
  1. Client creates gig (OPEN)
  2. Specialist applies
  3. Client accepts application (IN_PROGRESS)
  4. Specialist submits work (REVIEW)
  5. Client approves work (COMPLETED)
- Verify status at each step
- Test error cases (wrong role, wrong status, unauthorized users)

**Test Plan:**
```bash
npx tsx scripts/test-gig-lifecycle.ts
```

**Test Assertions:**
- ✓ Complete lifecycle OPEN → IN_PROGRESS → REVIEW → COMPLETED works
- ✓ Each transition enforces correct role and ownership
- ✓ Status transitions are irreversible
- ✓ All error messages are clear and actionable

---

## Summary

Total tasks: 5
- 2 server actions (submitWork, approveWork)
- 2 UI components (submit button, approve button)
- 1 end-to-end integration test

Estimated complexity: Medium
Dependencies: Existing gig model, session management, gig detail pages
