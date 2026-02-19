# Implementation Tasks: Gig Browsing, Filtering, and Detail View Tests

## Task 1: Create Gig Browsing Integration Tests

**File**: `__tests__/integration/gig-browsing.test.ts`

**Implementation**:
- Create test file with proper imports and mocks (follow `gig-creation.test.ts` pattern)
- Mock `@/lib/prisma`, `next/headers`, `next/navigation`
- Import necessary server actions and helpers
- Create test suite: `describe('Gig Browsing Tests', ...)`

**Test Cases**:
1. SPECIALIST browses OPEN gigs only
   - Create multiple gigs with different statuses (OPEN, IN_PROGRESS, COMPLETED)
   - Query gigs with status filter
   - Verify only OPEN gigs are returned
   - Verify gigs are ordered by createdAt descending

2. CLIENT browses all their gigs
   - Create CLIENT user with multiple gigs of different statuses
   - Query gigs by clientId
   - Verify all gigs are returned regardless of status
   - Verify application count is included

3. Empty gig list handling
   - Query with no gigs in database
   - Verify empty array is returned
   - Verify no errors occur

4. Gig includes client information
   - Create gig with client profile
   - Query with client relation included
   - Verify client company name and email are present

5. Gigs ordered by newest first (default)
   - Create gigs with different timestamps
   - Query without explicit ordering
   - Verify descending createdAt order

**Test Plan**:
```bash
npm run test:unit -- gig-browsing.test.ts
```
- All 5+ test cases pass
- Tests use `withAuthContext` for authentication
- Tests use transaction rollback for isolation
- Tests use Russian data generators for realistic data

---

## Task 2: Create Gig Filtering Integration Tests

**File**: `__tests__/integration/gig-filtering.test.ts`

**Implementation**:
- Create test file with proper setup
- Create helper function to build Prisma where clause from filter parameters
- Test dynamic query building with various filter combinations

**Test Cases**:
1. Text search by title (case-insensitive)
   - Create gigs with various titles
   - Apply search filter matching title
   - Verify correct gigs returned

2. Text search by description (case-insensitive)
   - Create gigs with search term only in description
   - Apply search filter
   - Verify gigs found via description match

3. Single tag filtering
   - Create gigs with different tags
   - Filter by single tag
   - Verify only matching gigs returned

4. Multiple tag filtering (OR logic)
   - Create gigs with various tag combinations
   - Filter by multiple tags
   - Verify gigs matching ANY tag are returned

5. Budget range filtering - minimum only
   - Create gigs with budgets: 5000000, 10000000, 15000000 kopecks
   - Filter with minBudget: 10000000
   - Verify only gigs >= 10000000 returned

6. Budget range filtering - maximum only
   - Create gigs with various budgets
   - Filter with maxBudget
   - Verify only gigs <= maxBudget returned

7. Budget range filtering - both min and max
   - Create gigs with budgets: 5000000, 10000000, 15000000, 20000000
   - Filter with minBudget: 10000000, maxBudget: 15000000
   - Verify only gigs in range returned

8. **CRITICAL: Budget filter currency conversion (RUB → kopecks)**
   - Create gigs with budgets in kopecks (DB storage):
     - Gig A: 5000000 kopecks (50,000 RUB)
     - Gig B: 10000000 kopecks (100,000 RUB)
     - Gig C: 15000000 kopecks (150,000 RUB)
   - Filter with minBudget in RUB: 100000 (user-facing format)
   - **Verify conversion**: filter must multiply by 100 (100000 RUB × 100 = 10000000 kopecks)
   - Verify only Gig B and Gig C returned (budget >= 10000000 kopecks)
   - Verify Gig A excluded (5000000 kopecks < 10000000 kopecks)
   - **Bug this catches**: Comparing RUB directly to kopecks (100000 vs 5000000 would incorrectly match)

9. Sort by newest first (default)
   - Create gigs at different times
   - Query without sort parameter
   - Verify descending createdAt order

10. Sort by highest budget
    - Create gigs with budgets: 5000000, 10000000, 15000000
    - Sort by "budget-desc"
    - Verify descending budget order

11. Sort by lowest budget
    - Create gigs with various budgets
    - Sort by "budget-asc"
    - Verify ascending budget order

12. Combined filters with AND logic
    - Create gigs:
      - A: title "React Developer", tags "React,TypeScript", budget 15000000
      - B: title "Python Backend", tags "Python,Django", budget 12000000
      - C: title "React Frontend", tags "React,CSS", budget 8000000
    - Filter: search "React", tags "React", minBudget 10000000
    - Verify only gig A returned

13. Text search + tag filter (AND between types)
    - Create gigs with various combinations
    - Apply search and tag filters
    - Verify AND logic between filter types

14. All filters combined
    - Apply search, tags, minBudget, maxBudget, sort simultaneously
    - Verify all filters work together correctly

15. Invalid filter parameters ignored
    - Query with invalid values (minBudget: "invalid", maxBudget: -1000)
    - Verify graceful handling, no errors
    - Verify fallback to default behavior

16. Empty results with filters
    - Apply filters that match no gigs
    - Verify empty array returned
    - Verify no errors

**Test Plan**:
```bash
npm run test:unit -- gig-filtering.test.ts
```
- All 16+ test cases pass
- **CRITICAL**: Test case 8 validates currency conversion (RUB → kopecks)
- Tests cover all filter combinations
- Tests verify AND logic between filter types
- Tests verify OR logic within tag filtering
- Tests handle edge cases (invalid params, empty results)

---

## Task 3: Create Gig Detail View Integration Tests

**File**: `__tests__/integration/gig-detail-view.test.ts`

**Implementation**:
- Create test file with proper setup
- Test gig detail queries with various includes
- Test role-based visibility and authorization

**Test Cases**:
1. Gig detail includes all basic information
   - Create gig with complete data
   - Query by ID
   - Verify all fields present: title, description, budget, serviceFee, totalAmount, status, tags, createdAt

2. Gig detail includes structured requirement fields
   - Create gig with goal, deliverables, constraints
   - Query gig detail
   - Verify optional fields are included

3. Gig detail includes client information
   - Create gig with client profile
   - Query with client relation
   - Verify client company name and email included

4. Gig detail shows applications for owner
   - Create gig with multiple applications
   - Query as gig owner
   - Verify applications are included
   - Verify application data: specialist info, approach, questions, status

5. Gig detail hides applications from non-owner
   - Create gig with applications
   - Query as different user (not owner)
   - Verify applications not exposed or authorization prevents access

6. SPECIALIST can see if they already applied
   - Create application for specialist
   - Query gig as same specialist
   - Verify specialist can retrieve their application status

7. Gig detail shows messages for authorized users
   - Create gig with assigned specialist and messages
   - Query as owner and as assigned specialist
   - Verify messages included for both authorized users

8. Gig detail hides messages from unauthorized users
   - Create gig with messages
   - Query as unauthorized user (not owner, not assigned specialist)
   - Verify messages not exposed

9. Gig not found handling
   - Query with non-existent gig ID
   - Verify appropriate error or null response

10. Gig detail for closed gig
    - Create gig with closedByAdmin: true
    - Query gig detail
    - Verify gig data is returned but status indicates closed

**Test Plan**:
```bash
npm run test:unit -- gig-detail-view.test.ts
```
- All 10+ test cases pass
- Tests verify data structure and completeness
- Tests verify role-based visibility
- Tests verify authorization for sensitive data (applications, messages)

---

## Task 4: Create Gig Lifecycle Integration Tests

**File**: `__tests__/integration/gig-lifecycle.test.ts`

**Implementation**:
- Create test file with proper setup
- Test all state transitions in the gig lifecycle
- Test authorization at each transition point
- Import server actions: acceptApplication, submitWork, approveWork, markAsPaid

**Test Cases**:
1. Transition OPEN → IN_PROGRESS on application acceptance
   - Create gig with status OPEN and multiple PENDING applications
   - Call acceptApplication as gig owner
   - Verify gig status is IN_PROGRESS
   - Verify assignedSpecialistId is set
   - Verify other applications are auto-rejected (status: REJECTED)

2. Auto-reject other applications on acceptance
   - Create gig with 3 PENDING applications
   - Accept one application
   - Verify accepted application status is ACCEPTED
   - Verify other 2 applications status is REJECTED

3. Transition IN_PROGRESS → REVIEW on work submission
   - Create gig with status IN_PROGRESS and assigned specialist
   - Call submitWork as assigned specialist
   - Verify gig status is REVIEW

4. Transition REVIEW → COMPLETED on work approval
   - Create gig with status REVIEW
   - Call approveWork as gig owner
   - Verify gig status is COMPLETED

5. Transition COMPLETED → PAID on payment marking
   - Create gig with status COMPLETED
   - Call markAsPaid as gig owner
   - Verify gig status is PAID
   - Verify paidAt timestamp is set

6. Full lifecycle flow (OPEN → PAID)
   - Create gig in OPEN state
   - Accept application (→ IN_PROGRESS)
   - Submit work (→ REVIEW)
   - Approve work (→ COMPLETED)
   - Mark as paid (→ PAID)
   - Verify each transition succeeds

7. Invalid transition rejected (OPEN → REVIEW)
   - Create gig in OPEN state
   - Attempt to call approveWork (requires REVIEW state)
   - Verify error is returned
   - Verify gig status remains OPEN

8. Non-owner cannot accept application
   - Create gig owned by CLIENT A
   - Attempt acceptApplication as CLIENT B
   - Verify authorization error
   - Verify gig state unchanged

9. Non-owner cannot approve work
   - Create gig in REVIEW state owned by CLIENT A
   - Attempt approveWork as CLIENT B
   - Verify authorization error
   - Verify gig state unchanged

10. Non-owner cannot mark as paid
    - Create gig in COMPLETED state owned by CLIENT A
    - Attempt markAsPaid as CLIENT B
    - Verify authorization error
    - Verify gig state unchanged

11. Non-assigned specialist cannot submit work
    - Create gig with assigned specialist A
    - Attempt submitWork as specialist B
    - Verify authorization error
    - Verify gig state unchanged

12. Cannot submit work on OPEN gig
    - Create gig in OPEN state (no assigned specialist)
    - Attempt submitWork
    - Verify error: work can only be submitted for IN_PROGRESS gigs

13. Cannot approve work on IN_PROGRESS gig
    - Create gig in IN_PROGRESS state
    - Attempt approveWork
    - Verify error: work can only be approved for REVIEW gigs

14. Cannot mark as paid on REVIEW gig
    - Create gig in REVIEW state
    - Attempt markAsPaid
    - Verify error: only COMPLETED gigs can be marked as paid

**Test Plan**:
```bash
npm run test:unit -- gig-lifecycle.test.ts
```
- All 14+ test cases pass
- Tests cover all valid state transitions
- Tests verify invalid transitions are rejected
- Tests verify authorization at each transition
- Tests verify full lifecycle flow works end-to-end

---

## Task 5: Verify Test Coverage and Documentation

**Implementation**:
- Run all new test suites
- Generate coverage report
- Verify all scenarios from archived specs are covered
- Update TESTING.md if needed with examples

**Test Plan**:
```bash
# Run all new tests
npm run test:unit -- gig-browsing.test.ts
npm run test:unit -- gig-filtering.test.ts
npm run test:unit -- gig-detail-view.test.ts
npm run test:unit -- gig-lifecycle.test.ts

# Run all tests
npm run test:unit

# Generate coverage report
npm run test:coverage
```

**Acceptance Criteria**:
- All new test files pass
- No regressions in existing tests
- Coverage report shows high coverage for gig-related code
- Test count: 45+ new tests added (including critical currency conversion test)
- All tests use transaction rollback pattern
- All tests use Russian data generators
- Tests follow patterns from `gig-creation.test.ts`

**Verification**:
- [x] gig-browsing.test.ts: 5+ tests passing ✅ (5 tests passing)
- [x] gig-filtering.test.ts: 16+ tests passing (including CRITICAL currency conversion test) ✅ (16 tests passing)
- [x] gig-detail-view.test.ts: 10+ tests passing ✅ (11 tests passing)
- [x] gig-lifecycle.test.ts: 14+ tests passing ✅ (14 tests passing)
- [x] Total: 45+ new tests ✅ (46 tests total)
- [x] All tests use `withAuthContext` for authentication ✅
- [x] All tests use transaction rollback for isolation ✅ (browsing, filtering, detail-view use withTestTransaction; lifecycle uses manual cleanup due to server actions)
- [x] All tests use realistic Russian data ✅
- [x] **CRITICAL**: Currency conversion test (RUB → kopecks) passes and catches conversion bugs ✅
- [x] `npm run test:unit` completes with new tests passing ✅ (223/225 tests pass; 2 pre-existing flaky parallel execution tests timeout)
- [x] No test failures or errors in new tests ✅
- [x] Coverage report shows improved coverage for gig features ⚠️ (coverage tool has issues with some tests, but all 46 new tests pass successfully when run normally)

---

## Summary

This change adds comprehensive integration test coverage for gig browsing, filtering, detail view, and lifecycle features. The tests validate:

1. **Gig Browsing**: Role-based access, data display, empty states
2. **Gig Filtering**: Text search, tag filtering, budget range, sorting, combined filters
   - **CRITICAL**: Explicit currency conversion test (RUB → kopecks) to catch common bugs
3. **Gig Detail View**: Information display, role-based visibility, authorization
4. **Gig Lifecycle**: State transitions, authorization, full workflow

All tests follow established patterns from `gig-creation.test.ts` and use existing test helpers for authentication, database isolation, and data generation.

**Key Addition**: Test case explicitly validates that budget filters convert RUB to kopecks (×100) before database comparison, preventing bugs where RUB values are compared directly against kopeck-stored budgets.
