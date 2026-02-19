# Change Proposal: messaging-tests

## Problem Statement

The messaging system (implemented in changes 14-16) currently lacks comprehensive integration test coverage. While the implementation has been validated manually and through ad-hoc scripts, there are no automated tests in the test suite to ensure:

1. Authorization rules are correctly enforced (only CLIENT owner and assigned SPECIALIST can send/view messages)
2. Messages are properly scoped to gig participants
3. Message ordering is chronological
4. Edge cases are handled (no specialist assigned, gig closed by admin)
5. Content validation works correctly

Without automated tests, future changes to the messaging system or related features (gig lifecycle, authorization) could introduce regressions that go undetected.

## Proposed Solution

Add comprehensive integration tests for the messaging system covering all scenarios from the original specifications:

- **Authorization tests**: Verify only gig owner and assigned specialist can send/view messages
- **Visibility tests**: Ensure messages are scoped to gig participants only
- **Ordering tests**: Confirm messages are returned in chronological order
- **State validation tests**: Test restrictions when specialist not assigned or gig closed
- **Content validation tests**: Verify length limits, whitespace handling, empty content rejection

## Scope

**In Scope:**
- Integration tests for `sendMessage` server action
- Tests for message visibility and authorization
- Tests for message ordering
- Tests for edge cases (no specialist, closed gig)
- Tests for content validation

**Out of Scope:**
- UI/E2E tests (Playwright) - focus on integration layer only
- Performance/load testing
- Real-time messaging features (not implemented)
- Message editing/deletion (not implemented)

## Constraints

- Tests MUST use existing test infrastructure (Vitest, test helpers from `__tests__/helpers/`)
- Tests MUST follow patterns established in `TESTING.md`
- Tests MUST use in-memory SQLite with per-worker isolation
- Tests MUST achieve 100% coverage of messaging spec scenarios

## Success Criteria

1. All test scenarios from messaging-iteration-3 and messaging-iteration-4 specs are covered
2. All tests pass consistently
3. Tests follow established patterns (withAuthContext, createTestUser, etc.)
4. Test file is properly organized with clear describe blocks
5. Coverage report shows all messaging scenarios are tested

## Non-Goals

- Refactoring existing messaging implementation
- Adding new messaging features
- Testing UI components directly (focus on server actions and data layer)
