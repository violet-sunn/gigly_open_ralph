# Change Proposal: Comprehensive Work Submission and Approval Tests

## Change Name
`work-submission-tests`

## Problem Statement

The work submission and approval functionality (from `gig-work-submission-and-approval` change) is implemented and has good test coverage in `gig-authorization.test.ts` and `gig-lifecycle.test.ts`. However, there are **specific coverage gaps**:

1. **Missing role validation tests**: CLIENT attempting to submit work, SPECIALIST attempting to approve work
2. **Incomplete state validation**: Not all invalid state combinations are tested (e.g., submit on REVIEW/COMPLETED/PAID, approve on OPEN/COMPLETED/PAID)
3. **Missing edge cases**: Non-existent gig handling, unauthenticated user redirects
4. **Loose error message validation**: Tests use `.toContain()` but don't validate exact error messages from the spec
5. **No explicit spec traceability**: Tests don't reference which spec scenarios they validate

## Proposed Solution

**Add focused tests to fill coverage gaps** rather than duplicating existing tests:

1. **Add missing role validation tests** to `gig-authorization.test.ts`:
   - CLIENT user attempting to submit work
   - SPECIALIST user attempting to approve work

2. **Add comprehensive state validation tests** to `gig-lifecycle.test.ts`:
   - Submit work on REVIEW, COMPLETED, PAID states
   - Approve work on OPEN, COMPLETED, PAID states

3. **Add edge case tests** to appropriate files:
   - Non-existent gig handling
   - Unauthenticated user redirects

4. **Strengthen error message validation**:
   - Replace `.toContain()` with exact error message checks where applicable
   - Ensure all error messages match the spec exactly

## Scope

### In Scope
- **New role validation tests**: CLIENT attempting submitWork, SPECIALIST attempting approveWork
- **Complete state validation tests**: All invalid state combinations for both actions
- **Edge case tests**: Non-existent gig, unauthenticated users
- **Exact error message validation**: Verify error messages match spec exactly
- **Spec traceability**: Add comments linking tests to spec scenarios

### Out of Scope
- Duplicating existing tests (happy path, ownership validation already covered)
- Testing other gig lifecycle transitions (application acceptance, payment marking)
- UI/E2E tests for work submission and approval buttons
- Performance or load testing
- Modifying the implementation itself

## Constraints

- Tests MUST use the existing test infrastructure (`vitest`, `getTestPrismaClient`, `withAuthContext`)
- Tests MUST be isolated and not depend on execution order
- Tests MUST clean up all created data (users, gigs, applications)
- Tests MUST use the existing mock setup for `@/lib/prisma`, `next/headers`, and `next/navigation`
- Each test MUST clearly document which spec scenario it validates

## Success Criteria

- All 11 gap-filling tests are added to existing test files
- Existing test suites run successfully: `npm test gig-authorization.test.ts` and `npm test gig-lifecycle.test.ts`
- All new tests pass and validate the expected behavior
- All existing tests continue to pass (no regressions)
- Test coverage report shows complete coverage of all `submitWork` and `approveWork` scenarios from the spec
- Each new test includes a comment linking it to the spec scenario it validates

## Dependencies

- Existing `submitWork` and `approveWork` implementations in `app/actions/gig.ts`
- Test helpers: `getTestPrismaClient`, `withAuthContext`, `createTestUser`, `createTestGig`
- Archived spec: `openspec/archive/gig-work-submission-and-approval/specs/gig/spec.md`

## Non-Goals

- This change does NOT modify the implementation of `submitWork` or `approveWork`
- This change does NOT add new functionality
- This change does NOT replace existing tests (it complements them)
