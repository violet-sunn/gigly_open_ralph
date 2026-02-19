# Payment Tracking Tests - Proposal

## Change Name
`payment-tracking-tests`

## Problem Statement

The payment tracking feature (change `payment-tracking-simplified`) has **partial test coverage** in existing test files:

**Existing Tests** (in `gig-lifecycle.test.ts` and `gig-authorization.test.ts`):
- ✅ Successful payment marking (COMPLETED → PAID transition)
- ✅ paidAt timestamp recording (basic check)
- ✅ Owner-only authorization
- ✅ Cannot mark REVIEW gig as paid

**Missing Test Coverage** (5 critical scenarios from spec):
- ❌ SPECIALIST role attempting to mark as paid (only CLIENT tested)
- ❌ Idempotency: marking already PAID gig returns error
- ❌ Gig not found error handling
- ❌ Unauthenticated user redirect
- ❌ Status validation for OPEN, IN_PROGRESS, PAID statuses (only REVIEW tested)
- ❌ Payment status display tests (dashboard, gig detail)

**Coverage Gap**: ~40-50% of spec scenarios tested. This creates risks:
- Critical error paths untested (idempotency, not found, role validation)
- Regressions may go undetected in untested scenarios
- Payment status display logic has zero test coverage

## Proposed Solution

**Fill the test coverage gaps** by adding the missing test scenarios to the existing test suite. The new tests will:

1. **Add missing `markAsPaid` scenarios** to `gig-lifecycle.test.ts`:
   - SPECIALIST role attempting to mark as paid (role validation)
   - Idempotency: marking already PAID gig
   - Gig not found error
   - Unauthenticated user redirect
   - Status validation for OPEN, IN_PROGRESS, PAID (currently only REVIEW tested)

2. **Create new payment display tests** (new file or existing):
   - Payment status display on gig detail page
   - Payment status display on CLIENT dashboard
   - Payment status display on SPECIALIST dashboard
   - Date formatting validation

All tests will follow the established patterns in `gig-lifecycle.test.ts` and use the same test infrastructure (in-memory SQLite, `getTestPrismaClient()`, `withAuthContext()`).

## Scope

### In Scope
- **Add missing `markAsPaid` tests** (5 scenarios):
  - SPECIALIST role validation (returns error)
  - Idempotency test (already PAID gig)
  - Gig not found error handling
  - Unauthenticated user redirect
  - Complete status validation (OPEN, IN_PROGRESS, PAID - REVIEW already tested)
- **Payment status display tests** (new):
  - Gig detail page payment status rendering
  - CLIENT dashboard payment status display
  - SPECIALIST dashboard payment status display
  - Date formatting (Russian locale)
- **Enhance existing tests** (optional):
  - Improve paidAt timestamp test (verify it's recent, not just defined)

### Out of Scope
- E2E tests with Playwright (can be added in future change)
- Tests for actual payment gateway integration (not implemented)
- Tests for payment notifications (not implemented)
- Performance/load testing
- Tests for MarkAsPaidButton client component (requires React Testing Library setup)
- Rewriting existing working tests

## Constraints

- **Test Framework**: Use Vitest (already configured in project)
- **Test Database**: Use **in-memory SQLite with per-worker isolation** (`getTestPrismaClient()`, `withTestTransaction()` from TESTING.md)
- **Test Patterns**: Follow patterns from `__tests__/integration/gig-creation.test.ts`
- **Test Helpers**: Use `withAuthContext` for authentication, `getTestPrismaClient()` for database access
- **Coverage Target**: 100% of spec scenarios (7 scenarios from markAsPaid requirement)
- **Test Isolation**: Each test must be independent and not affect others (per-worker in-memory databases)

## Success Criteria

1. **Missing scenarios are tested** (5 new tests minimum):
   - SPECIALIST role attempting markAsPaid returns proper error
   - Already PAID gig returns idempotency error
   - Non-existent gigId returns "Gig not found" error
   - Unauthenticated user redirects to /login
   - OPEN, IN_PROGRESS, PAID statuses return proper errors
2. **Payment display tests exist** (3+ new tests):
   - Gig detail page shows correct payment status
   - CLIENT dashboard displays payment dates correctly
   - SPECIALIST dashboard displays payment dates correctly
3. All new tests pass with `npm test`
4. Tests follow existing patterns from `gig-lifecycle.test.ts`
5. Test coverage for `markAsPaid` reaches 100% of spec scenarios
6. No existing tests are broken by new additions

## Dependencies

- Existing testing framework (Vitest, configured in `vitest.config.ts`)
- Test database setup (`.env.test`, test helpers)
- Existing `markAsPaid` implementation in `app/actions/gig.ts`
- Existing Gig model with `paidAt` field

## Risks & Mitigations

**Risk**: Tests may have database configuration issues (same as validation scripts).
**Mitigation**: Follow the working patterns from `gig-creation.test.ts` which successfully uses in-memory SQLite with per-worker isolation.

**Risk**: Tests may be brittle if implementation changes.
**Mitigation**: Test behavior (spec scenarios) rather than implementation details.

**Risk**: Test data setup may be complex (need COMPLETED gigs).
**Mitigation**: Create reusable test helpers for setting up gigs in various states.
