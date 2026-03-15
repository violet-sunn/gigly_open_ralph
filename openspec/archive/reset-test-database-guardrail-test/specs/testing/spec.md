# Testing Specification Delta — reset-test-database-guardrail-test

## ADDED Requirements

### Requirement: resetTestDatabase guardrail test

The test suite SHALL include a guardrail test that verifies the test database reset helper (`resetTestDatabase`) clears all core tables used by unit and integration tests.

#### Scenario: Guardrail test detects incomplete DB reset

**Given** the Vitest test database is available for the current worker
**And** the test inserts at least one record into each core table that the reset helper is responsible for clearing
**When** `resetTestDatabase()` is executed
**Then** all inserted records SHALL be removed
**And** subsequent reads from the affected tables SHALL return empty results

**Acceptance Criteria**:
- A guardrail test file exists under `__tests__/` and is executed by `npm run test:unit`
- The guardrail test inserts at least one row into each of the following tables (directly or indirectly via factories):
  - `User`
  - `ClientProfile`
  - `SpecialistProfile`
  - `Gig`
  - `Application`
  - `Message`
  - `Notification`
  - `ModerationLog`
- The guardrail test calls `resetTestDatabase()`
- After reset, the guardrail test asserts `.count()` for each table is `0`
- Running `npm run test:unit` exits with code `0`

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
