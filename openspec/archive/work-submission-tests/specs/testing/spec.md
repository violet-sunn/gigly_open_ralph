# Testing Specification Delta

## ADDED Requirements

### Requirement: Complete Work Submission and Approval Test Coverage
The system MUST fill coverage gaps in existing tests for `submitWork` and `approveWork` server actions to ensure all scenarios from the `gig-work-submission-and-approval` specification are validated.

**Note:** This requirement focuses on **adding missing tests** to existing test files rather than duplicating coverage. Existing tests in `gig-authorization.test.ts` and `gig-lifecycle.test.ts` already cover:
- ✓ Happy path transitions (IN_PROGRESS → REVIEW → COMPLETED)
- ✓ Ownership validation (assigned specialist can submit, gig owner can approve)
- ✓ Some invalid state transitions (OPEN → REVIEW, IN_PROGRESS → COMPLETED)

**Coverage Gaps to Fill:**
- Missing role validation tests (CLIENT submitting, SPECIALIST approving)
- Incomplete state validation (submit on REVIEW/COMPLETED/PAID, approve on OPEN/COMPLETED/PAID)
- Edge cases (non-existent gig, unauthenticated users)
- Exact error message validation

---

#### Scenario: Test CLIENT user cannot submit work (MISSING - add to gig-authorization.test.ts)
- GIVEN a test database with CLIENT user and gig in IN_PROGRESS status
- WHEN the test calls `submitWork` as a CLIENT user
- THEN the test MUST verify the exact error is returned: `{ error: 'Only specialists can submit work.' }`
- AND the test MUST verify the gig status remains unchanged

**Rationale:** Existing tests cover SPECIALIST role validation but not CLIENT attempting to submit.

---

#### Scenario: Test SPECIALIST user cannot approve work (MISSING - add to gig-authorization.test.ts)
- GIVEN a test database with SPECIALIST user and gig in REVIEW status
- WHEN the test calls `approveWork` as a SPECIALIST user
- THEN the test MUST verify the exact error is returned: `{ error: 'Only clients can approve work.' }`
- AND the test MUST verify the gig status remains unchanged

**Rationale:** Existing tests cover CLIENT role validation but not SPECIALIST attempting to approve.

---

#### Scenario: Test cannot submit work on REVIEW gig (MISSING - add to gig-lifecycle.test.ts)
- GIVEN a test database with gig in REVIEW status
- WHEN the test calls `submitWork`
- THEN the test MUST verify the exact error is returned: `{ error: 'Work can only be submitted for gigs in progress.' }`
- AND the test MUST verify the gig status remains REVIEW

**Rationale:** Existing tests cover OPEN state but not REVIEW/COMPLETED/PAID states.

---

#### Scenario: Test cannot submit work on COMPLETED gig (MISSING - add to gig-lifecycle.test.ts)
- GIVEN a test database with gig in COMPLETED status
- WHEN the test calls `submitWork`
- THEN the test MUST verify the exact error is returned: `{ error: 'Work can only be submitted for gigs in progress.' }`
- AND the test MUST verify the gig status remains COMPLETED

**Rationale:** Existing tests cover OPEN state but not REVIEW/COMPLETED/PAID states.

---

#### Scenario: Test cannot submit work on PAID gig (MISSING - add to gig-lifecycle.test.ts)
- GIVEN a test database with gig in PAID status
- WHEN the test calls `submitWork`
- THEN the test MUST verify the exact error is returned: `{ error: 'Work can only be submitted for gigs in progress.' }`
- AND the test MUST verify the gig status remains PAID

**Rationale:** Existing tests cover OPEN state but not REVIEW/COMPLETED/PAID states.

---

#### Scenario: Test cannot approve work on OPEN gig (MISSING - add to gig-lifecycle.test.ts)
- GIVEN a test database with gig in OPEN status
- WHEN the test calls `approveWork`
- THEN the test MUST verify the exact error is returned: `{ error: 'Work can only be approved for gigs under review.' }`
- AND the test MUST verify the gig status remains OPEN

**Rationale:** Existing test covers IN_PROGRESS state but not OPEN/COMPLETED/PAID states.

---

#### Scenario: Test cannot approve work on COMPLETED gig (MISSING - add to gig-lifecycle.test.ts)
- GIVEN a test database with gig in COMPLETED status
- WHEN the test calls `approveWork`
- THEN the test MUST verify the exact error is returned: `{ error: 'Work can only be approved for gigs under review.' }`
- AND the test MUST verify the gig status remains COMPLETED

**Rationale:** Existing test covers IN_PROGRESS state but not OPEN/COMPLETED/PAID states.

---

#### Scenario: Test cannot approve work on PAID gig (MISSING - add to gig-lifecycle.test.ts)
- GIVEN a test database with gig in PAID status
- WHEN the test calls `approveWork`
- THEN the test MUST verify the exact error is returned: `{ error: 'Work can only be approved for gigs under review.' }`
- AND the test MUST verify the gig status remains PAID

**Rationale:** Existing test covers IN_PROGRESS state but not OPEN/COMPLETED/PAID states.

---

#### Scenario: Test submit work on non-existent gig (MISSING - add to gig-authorization.test.ts)
- GIVEN a non-existent gigId
- WHEN the test calls `submitWork` with the non-existent gigId
- THEN the test MUST verify the exact error is returned: `{ error: 'Gig not found.' }`

**Rationale:** Edge case not covered in existing tests.

---

#### Scenario: Test approve work on non-existent gig (MISSING - add to gig-authorization.test.ts)
- GIVEN a non-existent gigId
- WHEN the test calls `approveWork` with the non-existent gigId
- THEN the test MUST verify the exact error is returned: `{ error: 'Gig not found.' }`

**Rationale:** Edge case not covered in existing tests.

---

#### Scenario: Test unauthenticated user redirected on submitWork (MISSING - add to gig-authorization.test.ts)
- GIVEN no authenticated session
- WHEN the test calls `submitWork`
- THEN the test MUST verify a redirect to `/login` occurs

**Rationale:** Authentication check not explicitly tested for submitWork.

---

#### Scenario: Test unauthenticated user redirected on approveWork (MISSING - add to gig-authorization.test.ts)
- GIVEN no authenticated session
- WHEN the test calls `approveWork`
- THEN the test MUST verify a redirect to `/login` occurs

**Rationale:** Authentication check not explicitly tested for approveWork.

---

**Acceptance Criteria:**
- 11 new test cases added to existing test files (no new file created)
- 4 tests added to `gig-authorization.test.ts` (role validation + edge cases)
- 7 tests added to `gig-lifecycle.test.ts` (state validation)
- Each test includes a comment: `// Gap-fill: [Spec scenario]`
- All tests use exact error message matching (not `.toContain()`)
- Tests use existing test helpers and patterns
- All tests clean up created data after execution
- All existing tests continue to pass (no regressions)

---

## MODIFIED Requirements

None. This change adds new test coverage without modifying existing requirements.

---

## REMOVED Requirements

None. This change is purely additive.
