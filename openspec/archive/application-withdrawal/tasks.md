# Implementation Tasks: Application Withdrawal

## Task 1: Add withdrawApplication Server Action

**Description**: Implement `withdrawApplication` server action in `app/actions/gig.ts` following the pattern of existing actions like `applyToGig` and `acceptApplication`.

**Implementation Notes**:
- Add to `app/actions/gig.ts` after existing application actions
- Signature: `async function withdrawApplication(prevState: { error?: string } | null, formData: FormData)`
- Extract `applicationId` from formData
- Validate session exists (redirect to `/login` if not)
- Validate user role is SPECIALIST
- Fetch application with gig relation: `prisma.application.findUnique({ where: { id: applicationId }, include: { gig: true } })`
- Validate application exists
- Validate gig exists
- Validate user owns application: `application.specialistId === session.userId`
- Validate application status is PENDING (not ACCEPTED, REJECTED, or WITHDRAWN)
- Validate gig is not closed: `!gig.closedByAdmin`
- Validate gig is not example: `!gig.isExample`
- Update application status: `prisma.application.update({ where: { id: applicationId }, data: { status: 'WITHDRAWN' } })`
- Redirect to `/dashboard/gigs/${gig.id}` on success
- Return `{ error: string }` on validation failure
- Export with `'use server'` directive

**Test Plan**:
```bash
# Create integration test file
touch __tests__/integration/application-withdrawal.test.ts

# Test scenarios:
# 1. Successful withdrawal (SPECIALIST owns PENDING application)
# 2. Non-SPECIALIST role validation (CLIENT attempts withdrawal)
# 3. Unauthenticated user (no session)
# 4. Non-owner specialist (different specialist attempts withdrawal)
# 5. Non-PENDING status validation (ACCEPTED, REJECTED, WITHDRAWN)
# 6. Closed gig validation (closedByAdmin = true)
# 7. Example gig validation (isExample = true)
# 8. Application not found
# 9. Gig not found
# 10. Idempotency (already WITHDRAWN)

# Run tests
npm run test:unit -- application-withdrawal

# Expected: All 10+ test scenarios pass
```

---

## Task 2: Create WithdrawApplicationButton Component

**Description**: Create a client component for the withdraw application button with form submission and error handling.

**Implementation Notes**:
- Create `app/dashboard/gigs/[id]/withdraw-application-button.tsx`
- Mark as `'use client'`
- Import `useActionState` from 'react'
- Import `withdrawApplication` from '@/app/actions/gig'
- Props: `{ applicationId: string }`
- Use `useActionState(withdrawApplication, null)`
- Render form with hidden input for applicationId
- Submit button: red/warning styling (destructive action)
- Button text: "Withdraw Application" (normal), "Withdrawing..." (pending)
- Display error message below button if state.error exists
- Button styling: `bg-red-600 hover:bg-red-700 text-white` (destructive action)
- Disabled state during submission

**Implementation Notes (Code Structure)**:
```typescript
'use client'
import { useActionState } from 'react'
import { withdrawApplication } from '@/app/actions/gig'

export function WithdrawApplicationButton({ applicationId }: { applicationId: string }) {
  const [state, formAction, isPending] = useActionState(withdrawApplication, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="applicationId" value={applicationId} />
      {state?.error && <p className="text-sm text-red-600 mb-2">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? 'Withdrawing...' : 'Withdraw Application'}
      </button>
    </form>
  )
}
```

**Test Plan**:
```bash
# Manual testing in browser:
# 1. Apply to a gig as SPECIALIST
# 2. Navigate to gig detail page
# 3. Verify "Withdraw Application" button appears
# 4. Click button
# 5. Verify redirect to gig detail page
# 6. Verify application status shows "WITHDRAWN"
# 7. Verify button no longer appears

# E2E test will cover this flow
```

---

## Task 3: Update Gig Detail Page to Show Withdraw Button

**Description**: Modify `app/dashboard/gigs/[id]/page.tsx` to conditionally render the WithdrawApplicationButton for specialists with PENDING applications.

**Implementation Notes**:
- Import `WithdrawApplicationButton` component
- Find the section where specialist sees their application status
- Add logic to find specialist's own application: `const myApplication = gig.applications.find(app => app.specialistId === session.userId)`
- Conditionally render WithdrawApplicationButton if:
  - `session.role === 'SPECIALIST'`
  - `myApplication` exists
  - `myApplication.status === 'PENDING'`
- Place button below application status display, above "Apply" form section
- Add visual separation (margin/padding)

**Implementation Notes (Placement)**:
```typescript
// After line ~68 where hasApplied is defined
const myApplication = session.role === 'SPECIALIST'
  ? gig.applications.find(app => app.specialistId === session.userId)
  : null

// In JSX, after application status display:
{myApplication && myApplication.status === 'PENDING' && (
  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
    <p className="text-sm text-yellow-800 mb-3">
      Changed your mind? You can withdraw your application.
    </p>
    <WithdrawApplicationButton applicationId={myApplication.id} />
  </div>
)}

// Show WITHDRAWN status badge for specialist's own withdrawn application:
{myApplication && myApplication.status === 'WITHDRAWN' && (
  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">Your Application Status:</span>
      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
        WITHDRAWN
      </span>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      Withdrawn on {myApplication.updatedAt.toLocaleDateString('ru-RU')}
    </p>
  </div>
)}
```

**Test Plan**:
```bash
# Manual testing:
# 1. As SPECIALIST, apply to gig → verify button appears
# 2. As SPECIALIST with ACCEPTED application → verify button hidden
# 3. As SPECIALIST with REJECTED application → verify button hidden
# 4. As SPECIALIST with WITHDRAWN application → verify button hidden, WITHDRAWN badge shown
# 5. As CLIENT viewing own gig → verify button hidden
# 6. As SPECIALIST without application → verify button hidden

# E2E test will automate this
```

---

## Task 4: Update Specialist Dashboard Archive Tab

**Description**: Modify `app/dashboard/SpecialistDashboardTabs.tsx` to include WITHDRAWN applications in the Archive tab.

**Implementation Notes**:
- Locate the Archive tab query (currently filters for REJECTED applications)
- Update filter to include WITHDRAWN: `status: { in: ['REJECTED', 'WITHDRAWN'] }`
- **CRITICAL**: Do NOT add gig status filter - REJECTED and WITHDRAWN are terminal application states that must appear in Archive immediately, regardless of gig lifecycle
- Update status badge rendering to handle WITHDRAWN status
- Add gray styling for WITHDRAWN badge: `bg-gray-100 text-gray-700`
- Display withdrawal date using `updatedAt` field
- Sort by `updatedAt` descending (most recent first)

**Implementation Notes (Code Changes)**:
```typescript
// In Archive tab query:
// CRITICAL: NO gig status filter - terminal application states appear immediately
const archivedApplications = await prisma.application.findMany({
  where: {
    specialistId: session.userId,
    status: { in: ['REJECTED', 'WITHDRAWN'] }
  },
  include: { gig: true },
  orderBy: { updatedAt: 'desc' }
})

// In status badge rendering:
{app.status === 'WITHDRAWN' && (
  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
    WITHDRAWN
  </span>
)}

// Display withdrawal date:
{app.status === 'WITHDRAWN' && (
  <p className="text-xs text-gray-500">
    Withdrawn on {app.updatedAt.toLocaleDateString('ru-RU')}
  </p>
)}
```

**Test Plan**:
```bash
# Manual testing:
# 1. Withdraw an application as SPECIALIST
# 2. Navigate to dashboard
# 3. Click "Archive" tab
# 4. Verify WITHDRAWN application appears
# 5. Verify gray badge with "WITHDRAWN" text
# 6. Verify withdrawal date displayed
# 7. Verify sorted by withdrawal date (newest first)

# Integration test:
npm run test:unit -- SpecialistDashboardTabs
```

---

## Task 5: Update Client Applications List to Show WITHDRAWN Status

**Description**: Modify `app/dashboard/gigs/[id]/page.tsx` to display WITHDRAWN status in the applications list for gig owners.

**Implementation Notes**:
- Locate the applications list rendering (CLIENT view)
- Ensure WITHDRAWN applications are not filtered out (they should already be included)
- Update status badge rendering to handle WITHDRAWN status
- Add gray styling: `bg-gray-100 text-gray-700`
- Display withdrawal date: "Withdrawn on {updatedAt}"
- Ensure Accept/Reject buttons are not shown for WITHDRAWN applications (should already be conditional on PENDING status)

**Implementation Notes (Code Changes)**:
```typescript
// In applications list rendering (CLIENT view):
{application.status === 'WITHDRAWN' && (
  <>
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
      WITHDRAWN
    </span>
    <p className="text-xs text-gray-500 mt-1">
      Withdrawn on {application.updatedAt.toLocaleDateString('ru-RU')}
    </p>
  </>
)}
```

**Test Plan**:
```bash
# Manual testing:
# 1. As SPECIALIST, apply to a gig
# 2. As SPECIALIST, withdraw the application
# 3. As CLIENT (gig owner), view gig detail page
# 4. Verify WITHDRAWN application appears in applications list
# 5. Verify gray badge with "WITHDRAWN" text
# 6. Verify withdrawal date displayed
# 7. Verify no Accept/Reject buttons for WITHDRAWN application

# E2E test will cover this flow
```

---

## Task 6: Write Integration Tests for withdrawApplication Action

**Description**: Create comprehensive integration test suite for the `withdrawApplication` server action covering all validation scenarios.

**Implementation Notes**:
- Create `__tests__/integration/application-withdrawal.test.ts`
- Follow existing test patterns from `gig-creation.test.ts` and `gig-lifecycle.test.ts`
- Use `withAuthContext` helper for session mocking
- Use `withTestTransaction` for database isolation
- Test all 11 scenarios from spec:
  1. Successful withdrawal
  2. Non-SPECIALIST role validation
  3. Unauthenticated user
  4. Non-owner specialist
  5. ACCEPTED application (non-PENDING)
  6. REJECTED application (non-PENDING)
  7. WITHDRAWN application (idempotency)
  8. Closed gig validation
  9. Example gig validation
  10. Application not found
  11. Gig not found

**Test Plan**:
```bash
# Run integration tests
npm run test:unit -- application-withdrawal

# Expected output:
# ✓ withdrawApplication action (11 tests)
#   ✓ successfully withdraws PENDING application
#   ✓ rejects CLIENT role
#   ✓ redirects unauthenticated user
#   ✓ rejects non-owner specialist
#   ✓ rejects ACCEPTED application
#   ✓ rejects REJECTED application
#   ✓ rejects already WITHDRAWN application (idempotency)
#   ✓ rejects withdrawal from closed gig
#   ✓ rejects withdrawal from example gig
#   ✓ returns error for non-existent application
#   ✓ returns error for non-existent gig

# All tests should pass
```

---

## Task 7: Write E2E Tests for Withdrawal Flow

**Description**: Create end-to-end tests using Playwright to verify the complete user flow for application withdrawal.

**Implementation Notes**:
- Create `__tests__/e2e/application-withdrawal.spec.ts`
- Follow existing E2E test patterns from `gig-lifecycle.spec.ts`
- Test user flows:
  1. Specialist applies → withdraws → sees WITHDRAWN in Archive
  2. Client sees WITHDRAWN status in applications list
  3. Withdraw button visibility (PENDING only)
  4. Error handling (attempt to withdraw non-PENDING)
- Use Playwright page object patterns
- Clean up test data after each test

**Test Plan**:
```bash
# Run E2E tests
npm run test:e2e -- application-withdrawal

# Test scenarios:
# 1. Complete withdrawal flow:
#    - Register as SPECIALIST
#    - Apply to gig
#    - Verify "Withdraw Application" button appears
#    - Click withdraw button
#    - Verify redirect to gig detail
#    - Verify status shows WITHDRAWN
#    - Verify button no longer appears
#    - Navigate to dashboard Archive tab
#    - Verify WITHDRAWN application appears

# 2. Client view:
#    - Register as CLIENT, create gig
#    - Register as SPECIALIST, apply to gig
#    - As SPECIALIST, withdraw application
#    - As CLIENT, view gig detail
#    - Verify WITHDRAWN status in applications list

# 3. Button visibility:
#    - Apply to gig (button appears)
#    - Withdraw application (button disappears)
#    - Verify button doesn't reappear

# Expected: All E2E tests pass
```

---

## Task 8: Update Documentation

**Description**: Update project documentation to reflect the new application withdrawal feature.

**Implementation Notes**:
- Update `openspec/project.md` in "Completed Changes" section
- Add entry: "**application-withdrawal** — Specialists can withdraw PENDING applications. Added `withdrawApplication` server action, withdraw button UI on gig detail page, WITHDRAWN status in Archive tab and client applications list. Comprehensive test coverage (integration + E2E)."
- Update "Current State" section to mention withdrawal capability
- Update "Implemented" section to include application withdrawal

**Test Plan**:
```bash
# Verify documentation is clear and accurate
# Review changes with: git diff openspec/project.md
```

---

## Summary

**Total Tasks**: 8
**Estimated Effort**: 4-6 hours
**Critical Path**: Task 1 → Task 2 → Task 3 (core functionality)
**Testing**: Tasks 6-7 (comprehensive coverage)

**Dependencies**:
- Task 2 depends on Task 1 (server action must exist)
- Task 3 depends on Task 2 (component must exist)
- Tasks 4-5 can be done in parallel after Task 1
- Tasks 6-7 can be done in parallel after Tasks 1-5

**Verification Checklist**:
- [ ] `withdrawApplication` action exported from `app/actions/gig.ts`
- [ ] Withdraw button appears for PENDING applications only
- [ ] WITHDRAWN applications appear in Archive tab
- [ ] Clients see WITHDRAWN status in applications list
- [ ] All integration tests pass (11+ scenarios)
- [ ] All E2E tests pass (3+ user flows)
- [ ] Documentation updated
- [ ] No regressions in existing functionality
