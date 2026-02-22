# Testing Specification - Remove Hourly Rate

## REMOVED Requirements

### Requirement: Hourly Rate in Test Data
Test data MUST NOT contain hourly rate values.

#### Scenario: Test helpers must not create hourly rate data
**Given** test helper functions
**When** creating specialist profile test data
**Then** the helpers MUST NOT set hourlyRate field
**And** the helpers MUST NOT accept hourlyRate parameter
**And** TypeScript types MUST NOT include hourlyRate

#### Scenario: Seed data must not include hourly rate
**Given** the database seed script
**When** seeding specialist profiles
**Then** the seed data MUST NOT include hourlyRate values
**And** the seed script MUST NOT reference hourlyRate field

---

### Requirement: Hourly Rate in Test Assertions
Tests MUST NOT assert on hourly rate values.

#### Scenario: Profile tests must not check hourly rate
**Given** any profile-related test
**When** asserting on profile data
**Then** the test MUST NOT check hourlyRate property
**And** the test MUST NOT validate hourlyRate format
**And** the test MUST NOT compare hourlyRate values

#### Scenario: API tests must not send hourly rate
**Given** API endpoint tests for profile updates
**When** sending profile update requests
**Then** the request payload MUST NOT include hourlyRate
**And** the response MUST NOT include hourlyRate

---

## Validation Commands

```bash
# Verify no hourlyRate in test helpers
! grep -i "hourlyRate" __tests__/helpers/auth.ts
! grep -i "hourlyRate" __tests__/helpers/seed.ts

# Verify no hourlyRate in seed script
! grep -i "hourlyRate" prisma/seed.ts

# Verify tests pass
npm test

# Verify no hourlyRate in any test files
! grep -i "hourlyRate" __tests__/**/*.ts
```
