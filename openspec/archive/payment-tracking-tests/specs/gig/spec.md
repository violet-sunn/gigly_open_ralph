# Gig Specification - Payment Tracking Tests Delta

## ADDED Requirements

### Requirement: Complete Mark as Paid Server Action Test Coverage
The test suite MUST validate all scenarios of the `markAsPaid` server action to ensure correct behavior, authorization, and error handling. **Existing tests cover ~40% of scenarios; this requirement adds the missing 60%.**

#### Existing Test Coverage (DO NOT DUPLICATE):
- ✅ Successful payment marking (gig-lifecycle.test.ts)
- ✅ Status transition COMPLETED → PAID (gig-lifecycle.test.ts)
- ✅ paidAt timestamp recorded (gig-lifecycle.test.ts - basic check)
- ✅ Owner-only authorization (gig-lifecycle.test.ts)
- ✅ Cannot mark REVIEW gig as paid (gig-lifecycle.test.ts)

#### Scenario: Test SPECIALIST role cannot mark as paid (NEW)
- GIVEN a COMPLETED gig owned by a CLIENT
- WHEN a SPECIALIST user calls `markAsPaid`
- THEN the test MUST assert:
  - Error is returned: "Only clients can mark gigs as paid."
  - Gig status remains "COMPLETED"
  - `paidAt` remains null

#### Scenario: Test idempotency - cannot mark as paid twice (NEW)
- GIVEN a gig already marked as PAID with paidAt set to a specific timestamp
- WHEN the gig owner calls `markAsPaid` again
- THEN the test MUST assert:
  - Error is returned: "This gig has already been marked as paid."
  - Gig status remains "PAID"
  - `paidAt` timestamp is NOT changed (remains the original value)

#### Scenario: Test gig not found error (NEW)
- GIVEN a non-existent gigId
- WHEN `markAsPaid` is called with this gigId
- THEN the test MUST assert:
  - Error is returned: "Gig not found."
  - No database changes occur

#### Scenario: Test unauthenticated user is redirected (NEW)
- GIVEN no valid session (unauthenticated request)
- WHEN `markAsPaid` is called
- THEN the test MUST assert:
  - Action redirects to `/login` (or throws redirect error in test context)
  - No database changes occur

#### Scenario: Test complete status validation (NEW)
- GIVEN gigs in OPEN, IN_PROGRESS, and PAID statuses (REVIEW already tested)
- WHEN the gig owner calls `markAsPaid` on each gig
- THEN the test MUST assert for each status:
  - Error is returned: "Only completed gigs can be marked as paid."
  - Gig status remains unchanged
  - `paidAt` remains null (or unchanged if already PAID)

**Acceptance Criteria:**
- New tests added to `__tests__/integration/gig-lifecycle.test.ts`
- All 5 new scenarios have corresponding test cases
- Tests use `withAuthContext` helper for authentication
- Tests use `getTestPrismaClient()` for in-memory database access
- Tests follow patterns from existing gig-lifecycle tests
- All tests pass with `npm test`
- Test coverage includes all branches of `markAsPaid` action
- Tests are independent and can run in any order
- Existing tests remain unchanged and passing

---

### Requirement: Payment Status Display Tests (NEW)
The test suite MUST validate that payment status is correctly displayed on gig detail pages and dashboards. **Currently zero test coverage for display logic.**

#### Scenario: Test gig detail query includes paidAt field
- GIVEN a test that queries gig data (simulating page data fetch)
- WHEN the test retrieves a gig from the database
- THEN the test MUST assert:
  - Query result includes `paidAt` field
  - PAID gigs have paidAt set to a Date object
  - COMPLETED gigs have paidAt as null

#### Scenario: Test payment status display logic
- GIVEN gigs in COMPLETED and PAID statuses
- WHEN the test evaluates status display logic
- THEN the test MUST assert:
  - COMPLETED gigs (paidAt=null) should display "Awaiting Payment" indicator
  - PAID gigs (paidAt set) should display "Paid" status
  - PAID gigs should display formatted payment date

#### Scenario: Test payment date formatting
- GIVEN a PAID gig with a known paidAt timestamp
- WHEN the test formats the date using toLocaleDateString('ru-RU')
- THEN the test MUST assert:
  - Date format matches Russian locale (DD.MM.YYYY)
  - Formatting is consistent across different dates
  - Null paidAt does not cause formatting errors

**Acceptance Criteria:**
- Tests can be added to existing `gig-detail-view.test.ts` or new `payment-display.test.ts`
- Tests validate data queries include `paidAt` field
- Tests validate status display logic for COMPLETED vs PAID
- Tests validate date formatting (Russian locale)
- Tests use realistic test data (actual dates, proper formatting)
- All tests pass with `npm test`
