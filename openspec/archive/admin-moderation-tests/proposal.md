# Change Proposal: Admin Moderation Tests

## Change Name
`admin-moderation-tests`

## Problem Statement

The admin moderation feature (change #13) is implemented but lacks comprehensive test coverage. While basic authorization tests exist, critical scenarios are untested:

1. **Login Prevention**: No tests verify that suspended users are actually blocked from logging in
2. **Gig Application Prevention**: No tests verify that closed gigs reject new applications
3. **Messaging Prevention**: No tests verify that closed gigs block new messages
4. **Moderation History**: No tests verify that admins can view moderation logs
5. **Edge Cases**: Missing tests for validation, idempotency, and error handling

This creates risk that moderation features could break without detection, potentially allowing suspended users to access the platform or closed gigs to receive activity.

## Proposed Solution

Write comprehensive integration tests covering all admin moderation scenarios specified in the original admin moderation feature. Tests will validate:

- User suspension prevents login
- Gig closure prevents applications and messages
- Moderation actions are properly logged
- Only ADMIN role can perform moderation
- Moderation history is accessible to admins
- Edge cases and validation rules

## Scope

### In Scope
- Integration tests for all moderation actions (suspend, unsuspend, close gig)
- Tests for suspended user login prevention
- Tests for closed gig application/message prevention
- Tests for moderation log creation and retrieval
- Tests for authorization (role-based access control)
- Tests for validation and edge cases

### Out of Scope
- E2E tests (Playwright) - integration tests are sufficient for server actions
- UI tests for admin dashboard pages
- Performance tests for moderation actions
- New moderation features (only testing existing functionality)

## Constraints

- Tests MUST use existing test infrastructure (Vitest, test helpers)
- Tests MUST follow patterns established in `TESTING.md`
- Tests MUST use per-worker database isolation
- Tests MUST NOT modify existing implementation code
- Tests MUST achieve 100% coverage of moderation spec scenarios

## Success Criteria

1. All 7 requirement categories have comprehensive test coverage
2. Tests verify suspended users cannot login (critical gap)
3. Tests verify closed gigs reject applications and messages
4. Tests verify moderation logs are created and retrievable
5. All tests pass consistently in parallel execution
6. Test coverage report shows >95% coverage for moderation actions
