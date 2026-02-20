# Change Proposal: Admin Moderation E2E Test

## Change ID
`admin-moderation-e2e`

## Status
Proposed

## Context

The platform has comprehensive admin moderation functionality (implemented in change #13) that allows ADMIN users to:
- Suspend/unsuspend users (preventing login)
- Close gigs (preventing new applications)
- View moderation audit logs

While integration tests exist for these features, there is **no E2E test** that validates the complete admin moderation workflow from a user's perspective in a real browser environment.

## Problem Statement

Without E2E tests for admin moderation:
1. **No validation of UI interactions** - Integration tests verify server actions work, but don't test that buttons, forms, and navigation work correctly in the browser
2. **No verification of suspended user login blocking** - We don't test the full authentication flow where a suspended user attempts to login via the UI
3. **No verification of moderation history visibility** - We don't test that moderation logs are actually displayed to admins
4. **Gap in test coverage** - Other critical flows (client journey, specialist journey) have E2E tests, but admin moderation does not

## Proposed Solution

Create a comprehensive Playwright E2E test (`__tests__/e2e/admin-moderation.spec.ts`) that validates the complete admin moderation workflow:

1. **Setup**: Create test users (CLIENT, SPECIALIST) and gigs programmatically
2. **Admin Authentication**: Login as ADMIN via UI
3. **User Suspension**: Suspend a user with reason via UI
4. **Verify Suspension**: Logout, attempt to login as suspended user, verify login fails
5. **Admin Re-authentication**: Login as ADMIN again
6. **Gig Closure**: Close a gig with reason via UI
7. **Verify Closure**: Verify gig shows as closed and cannot receive applications
8. **Moderation History**: Verify moderation logs are visible in admin dashboard

### Test Approach

Following existing E2E test patterns (hybrid approach):
- **UI interactions**: Admin login, suspend user form, close gig form, logout, suspended user login attempt
- **Programmatic setup**: Create test users and gigs via database helpers
- **Database verification**: Query database to verify state changes (user.suspended, gig.closedByAdmin, ModerationLog entries)

### Why This Matters

Admin moderation is a **critical safety feature** for platform health:
- Prevents abuse and fraud
- Protects legitimate users from bad actors
- Provides audit trail for disputes

E2E testing ensures this functionality works correctly in production-like conditions.

## Scope

### In Scope
- E2E test for admin user suspension workflow
- E2E test for admin gig closure workflow
- Verification of suspended user login blocking
- Verification of moderation history visibility
- Test follows existing E2E patterns (Playwright, hybrid approach, Russian data)

### Out of Scope
- Testing admin user management UI (already covered by integration tests)
- Testing admin statistics dashboard (not critical for moderation workflow)
- Testing unsuspend user workflow (can be added later if needed)
- Testing moderation log filtering/search (not implemented yet)

## Dependencies

- Existing admin moderation functionality (change #13)
- Existing E2E test infrastructure (Playwright, test helpers)
- Existing test database setup (per-worker isolation)

## Risks & Mitigations

**Risk**: Test flakiness due to timing issues (page loads, redirects)
**Mitigation**: Use Playwright's built-in waiting mechanisms (`waitForLoadState`, `waitForURL`, `waitForSelector`)

**Risk**: Test data pollution between runs
**Mitigation**: Use unique email addresses (timestamp + random suffix) and proper cleanup in `afterEach` hook

**Risk**: Test becomes too slow (>30 seconds)
**Mitigation**: Use programmatic setup for non-critical steps (create users/gigs), only test critical UI interactions

## Success Criteria

1. E2E test file exists at `__tests__/e2e/admin-moderation.spec.ts`
2. Test passes consistently (10 consecutive runs)
3. Test completes in under 30 seconds
4. Test covers all 8 steps of admin moderation workflow
5. Test uses realistic Russian data
6. Test follows existing E2E patterns and conventions
7. All assertions pass (user suspension, login blocking, gig closure, moderation logs)

## Implementation Estimate

**Effort**: 2-4 hours
- Test structure and setup: 30 minutes
- Admin login and user suspension: 45 minutes
- Suspended user login verification: 30 minutes
- Gig closure and verification: 45 minutes
- Moderation history verification: 30 minutes
- Testing and refinement: 30-60 minutes

## References

- Existing E2E tests: `__tests__/e2e/client-journey.spec.ts`, `__tests__/e2e/specialist-journey.spec.ts`
- Admin moderation integration tests: `__tests__/integration/moderation-*.test.ts`
- Admin UI pages: `app/admin/users/page.tsx`, `app/admin/gigs/page.tsx`
- Testing documentation: `TESTING.md`, `__tests__/README.md`
