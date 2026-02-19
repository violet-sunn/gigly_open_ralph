# Proposal: Comprehensive Application Flow Tests

## Why

The application flow is a critical part of the Gigly marketplace - it's how specialists express interest in gigs and how clients select specialists to work with. While the functionality is implemented, there is no comprehensive test coverage validating:

1. **Application submission** - Specialists applying to gigs with structured fields
2. **Application validation** - Required fields, character limits, duplicate prevention
3. **Application management** - Clients accepting/rejecting applications
4. **Gig lifecycle transitions** - OPEN → IN_PROGRESS when application accepted
5. **Authorization** - Only gig owners can manage applications
6. **Edge cases** - Non-OPEN gigs, non-existent gigs, invalid states

The existing archived changes (specialist-gig-browsing, application-management, structured-application-fields) defined the specifications but did not include test implementation. This change fills that gap by creating a comprehensive test suite that validates all application flow scenarios.

## What

Create a comprehensive integration test suite (`__tests__/integration/application-flow.test.ts`) that validates:

1. **Application Submission (`applyToGig`)**
   - SPECIALIST can apply to OPEN gigs with structured fields
   - Required fields validation (approach ≥100 chars, questions ≥50 chars)
   - Optional field validation (estimatedEffort ≤200 chars)
   - Maximum length validation (approach ≤2000, questions ≤1000)
   - Duplicate application prevention (unique constraint)
   - Cannot apply to non-OPEN gigs (IN_PROGRESS, REVIEW, COMPLETED, PAID)
   - Cannot apply to closed gigs (closedByAdmin)
   - Cannot apply to example gigs (isExample)
   - Only SPECIALIST role can apply

2. **Application Acceptance (`acceptApplication`)**
   - CLIENT can accept PENDING applications on their own gigs
   - Accepting transitions gig status from OPEN to IN_PROGRESS
   - Accepting sets assignedSpecialistId on gig
   - Accepting auto-rejects all other PENDING applications for that gig
   - Only gig owner can accept applications
   - Cannot accept on non-OPEN gigs
   - Cannot accept non-PENDING applications
   - Only CLIENT role can accept

3. **Application Rejection (`rejectApplication`)**
   - CLIENT can reject PENDING applications on their own gigs
   - Rejecting updates application status to REJECTED
   - Rejecting does NOT change gig status (remains OPEN)
   - Only gig owner can reject applications
   - Cannot reject non-PENDING applications
   - Only CLIENT role can reject

## Constraints

- Tests MUST use existing test infrastructure (Vitest, test database helpers, auth helpers)
- Tests MUST follow patterns established in TESTING.md and gig-creation.test.ts
- Tests MUST use `withTestTransaction` for database isolation
- Tests MUST use `withAuthContext` for authenticated operations
- Tests MUST be deterministic and independent
- Tests MUST validate actual implementation behavior
- Tests MUST cover all scenarios from archived spec files (specialist-gig-browsing, application-management, structured-application-fields)

## Critical Findings During Spec Creation

### Concurrent Acceptance Race Condition
**Issue:** The current `acceptApplication` implementation checks gig status BEFORE the transaction but does NOT re-check it atomically within the transaction. This creates a race condition where two simultaneous accept requests could both pass the pre-check and potentially overwrite each other's changes.

**Current Implementation:**
```typescript
// Pre-transaction check (vulnerable to race condition)
if (application.gig.status !== 'OPEN') {
  return { error: 'This gig is no longer accepting applications.' }
}

// Transaction does NOT re-check status
await prisma.$transaction([
  prisma.gig.update({
    where: { id: application.gigId },  // No status check here
    data: { status: 'IN_PROGRESS', assignedSpecialistId: ... }
  }),
  ...
])
```

**Impact:** In a concurrent scenario (two browser tabs clicking "Accept" simultaneously), both transactions could commit, with the second overwriting the `assignedSpecialistId` set by the first.

**Test Coverage:** The test suite includes a scenario that verifies the sequential case (accept after status already changed). True concurrent testing would require explicit transaction control and is difficult to test reliably in integration tests.

**Recommendation:** Consider refactoring to use atomic check-and-update:
```typescript
const result = await prisma.gig.updateMany({
  where: {
    id: application.gigId,
    status: 'OPEN'  // Atomic check-and-update
  },
  data: { status: 'IN_PROGRESS', assignedSpecialistId: ... }
})

if (result.count === 0) {
  return { error: 'This gig is no longer accepting applications.' }
}
```

This should be addressed in a separate bug fix change after the test suite is implemented.

## Non-Goals

- Testing UI components (this is integration testing of server actions)
- Testing E2E workflows (use Playwright for that)
- Testing messaging functionality (separate test suite)
- Testing work submission/approval (separate test suite)
- Modifying application logic (only testing existing implementation)

## Success Criteria

1. All application submission validation rules are covered by tests
2. All application management authorization rules are covered by tests
3. All gig lifecycle transitions are validated
4. All tests pass consistently
5. Tests follow established patterns from TESTING.md
6. Edge cases and boundary conditions are tested
7. Test coverage includes both happy path and error scenarios
8. Tests validate data persistence (fields stored correctly in database)
9. Tests cover all scenarios from archived spec files
