# Testing Specification Delta

## ADDED Requirements

### Requirement: Auth Flow Integration Test Script
The system MUST include a runnable integration test script that exercises the core auth flow without a browser.

#### Scenario: Register a new user and verify DB state
- GIVEN a clean test environment
- WHEN `registerUser` is called with a test email and password via a FormData object
- THEN a user record MUST exist in the database with that email
- AND the stored password MUST be a valid bcrypt hash (verifiable with `bcrypt.compare()`)

#### Scenario: Login with correct credentials
- GIVEN a user was registered with email "test@example.com" and password "TestPass123!"
- WHEN `loginUser` is called with matching credentials
- THEN the result MUST indicate success (redirect is thrown by Next.js — the test catches the NEXT_REDIRECT error as proof of success)

#### Scenario: Login with wrong password
- GIVEN a user was registered with email "test@example.com"
- WHEN `loginUser` is called with the correct email but password "WrongPassword"
- THEN the result MUST be `{ error: 'Invalid email or password.' }`

#### Scenario: Login with non-existent email
- GIVEN no user exists with email "ghost@example.com"
- WHEN `loginUser` is called with that email
- THEN the result MUST be `{ error: 'Invalid email or password.' }`

**Acceptance Criteria:**
- `scripts/test-auth-flow.ts` exists and is executable via `npx tsx scripts/test-auth-flow.ts`
- The script imports `prisma` from `@/lib/prisma` (or relative path), `bcryptjs`, and the auth actions
- The script cleans up test data after itself (deletes the test user)
- Exit code 0 on all assertions passing, non-zero on any failure
- Script output clearly labels each test case as PASS or FAIL
