# Payment Tracking Tests - Implementation Tasks

## Task 1: Add SPECIALIST role validation test
**Implementation:**
- Add test to `__tests__/integration/gig-lifecycle.test.ts` or `gig-authorization.test.ts`
- Test case: "SPECIALIST cannot mark gig as paid"
- Set up: Create COMPLETED gig, authenticate as SPECIALIST user
- Execute: Call `markAsPaid` with valid gigId
- Assert: Error "Only clients can mark gigs as paid."
- Assert: Gig status remains COMPLETED, paidAt remains null

**Test Plan:**
- Run: `npm test -- gig-lifecycle --run`
- Verify new test passes
- Verify error message matches spec exactly

---

## Task 2: Add idempotency test (already PAID)
**Implementation:**
- Add test to `__tests__/integration/gig-lifecycle.test.ts`
- Test case: "cannot mark already PAID gig as paid again"
- Set up: Create gig with status='PAID' and paidAt set to specific timestamp
- Execute: Call `markAsPaid` as owner
- Assert: Error "This gig has already been marked as paid."
- Assert: Status remains PAID
- Assert: paidAt timestamp unchanged (exact same value)

**Test Plan:**
- Run: `npm test -- gig-lifecycle --run`
- Verify idempotency is enforced
- Verify original paidAt is preserved

---

## Task 3: Add gig not found test
**Implementation:**
- Add test to `__tests__/integration/gig-lifecycle.test.ts`
- Test case: "returns error when marking non-existent gig as paid"
- Set up: Generate random/invalid gigId (e.g., 'non-existent-id')
- Execute: Call `markAsPaid` with invalid gigId as CLIENT
- Assert: Error "Gig not found."
- Assert: No database changes

**Test Plan:**
- Run: `npm test -- gig-lifecycle --run`
- Verify proper error handling
- Verify no database corruption

---

## Task 4: Add unauthenticated user test
**Implementation:**
- Add test to `__tests__/integration/gig-lifecycle.test.ts`
- Test case: "redirects unauthenticated user to login"
- Set up: Create COMPLETED gig, NO authentication (don't call withAuthContext)
- Execute: Call `markAsPaid` directly
- Assert: Redirect to /login (catch NEXT_REDIRECT error)
- Assert: No database changes

**Test Plan:**
- Run: `npm test -- gig-lifecycle --run`
- Verify redirect behavior
- Verify no unauthorized changes

---

## Task 5: Complete status validation tests
**Implementation:**
- Add tests to `__tests__/integration/gig-lifecycle.test.ts`
- Test cases (3 new tests):
  - "cannot mark OPEN gig as paid"
  - "cannot mark IN_PROGRESS gig as paid"
  - "cannot mark PAID gig as paid" (duplicate of idempotency, can combine)
- Set up: Create gigs in each status
- Execute: Call `markAsPaid` as owner
- Assert: Error "Only completed gigs can be marked as paid."
- Assert: Status unchanged

**Test Plan:**
- Run: `npm test -- gig-lifecycle --run`
- Verify all non-COMPLETED statuses are rejected
- Note: REVIEW already tested, PAID covered by idempotency test

---

## Task 6: Create payment status display tests
**Implementation:**
- Create new file: `__tests__/integration/payment-display.test.ts`
- OR add to existing `gig-detail-view.test.ts` if it exists
- Set up standard mocks (follow gig-lifecycle.test.ts pattern)
- Import necessary components/functions

**Test cases:**
- "gig detail query includes paidAt field"
  - Query gig data, assert paidAt is in result
- "COMPLETED gig shows awaiting payment status"
  - Create COMPLETED gig with paidAt=null
  - Assert status display logic shows "Awaiting Payment"
- "PAID gig shows payment date"
  - Create PAID gig with paidAt set
  - Assert status shows "Paid" and date is formatted
- "payment date uses Russian locale"
  - Create PAID gig with known date
  - Format using toLocaleDateString('ru-RU')
  - Assert format matches expected

**Test Plan:**
- Run: `npm test -- payment-display --run`
- Verify all display tests pass
- Verify date formatting is correct

---

## Task 7: Enhance existing paidAt timestamp test (optional)
**Implementation:**
- Locate existing test in `gig-lifecycle.test.ts` (line ~260)
- Enhance assertion to verify timestamp is recent:
  ```typescript
  const beforeTime = new Date()
  // ... call markAsPaid ...
  const afterTime = new Date()
  expect(updatedGig!.paidAt!.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
  expect(updatedGig!.paidAt!.getTime()).toBeLessThanOrEqual(afterTime.getTime())
  ```

**Test Plan:**
- Run: `npm test -- gig-lifecycle --run`
- Verify enhanced timestamp validation passes

---

## Task 8: Run full test suite and verify coverage
**Implementation:**
- Run all tests: `npm test -- --run`
- Run specific payment tests: `npm test -- "gig-lifecycle|payment-display" --run`
- Generate coverage report: `npm run test:coverage`
- Review coverage for `app/actions/gig.ts` (markAsPaid function)
- Verify all spec scenarios are covered

**Test Plan:**
- All tests pass: `npm test -- --run`
- Coverage report shows 100% of markAsPaid scenarios tested
- No test failures or warnings
- Test execution time is reasonable

---

## Task 9: Document test additions and update project files
**Implementation:**
- Update TESTING.md if needed (document payment test patterns)
- Update project.md "Completed Changes" section
- Create IMPLEMENTATION_SUMMARY.md documenting:
  - Tests added (5+ new scenarios)
  - Files modified (gig-lifecycle.test.ts, possibly new payment-display.test.ts)
  - Coverage achieved (100% of spec scenarios)
  - Existing tests preserved

**Test Plan:**
- Verify documentation is clear and accurate
- Verify project.md reflects completed change
- Run final validation: `npm test -- --run && npm run build`
- All checks pass before archiving
