# Testing Specification Delta

## MODIFIED Requirements

### Requirement: Integration Test Covers Role
The integration test script MUST verify that role is persisted correctly and flows through the auth system.

#### Scenario: Register CLIENT and verify DB
- GIVEN a test user created with role "CLIENT"
- WHEN the user is queried from the database
- THEN `user.role` MUST equal `"CLIENT"`

#### Scenario: Register SPECIALIST and verify DB
- GIVEN a test user created with role "SPECIALIST"
- WHEN the user is queried from the database
- THEN `user.role` MUST equal `"SPECIALIST"`

#### Scenario: Invalid role rejected
- GIVEN a registration attempt with role "INVALID"
- WHEN the action logic validates the role
- THEN it MUST produce an error result

**Acceptance Criteria:**
- `scripts/test-auth-flow.ts` creates users with explicit roles
- Asserts `user.role` matches the provided role
- Tests invalid role rejection
- All tests PASS, exit code 0
