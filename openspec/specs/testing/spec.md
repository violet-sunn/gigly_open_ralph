# Testing Specification Delta

## ADDED Requirements

### Requirement: Vitest Unit Testing Framework

The platform SHALL provide a Vitest-based unit and integration testing framework for testing business logic, server actions, and database operations with parallel execution support.

#### Scenario: Developer runs unit tests

**Given** Vitest is installed and configured
**When** the developer runs `npm run test:unit`
**Then** Vitest SHALL execute all tests in `__tests__/unit/` and `__tests__/integration/`
**And** the test results SHALL be displayed in the terminal
**And** the process SHALL exit with code 0 if all tests pass
**And** the process SHALL exit with non-zero code if any test fails

**Acceptance Criteria**:
- Running `npm run test:unit` executes Vitest
- Test output shows pass/fail status for each test
- Exit code is 0 for success, non-zero for failure
- Tests complete in under 10 seconds for initial example tests

#### Scenario: Developer runs unit tests in parallel

**Given** Vitest is configured with `fileParallelism: true`
**When** the developer runs `npm run test:unit`
**Then** Vitest SHALL execute tests in parallel
**And** tests SHALL NOT interfere with each other
**And** all tests SHALL pass
**And** execution time SHALL be faster than sequential execution

**Acceptance Criteria**:
- `fileParallelism: true` in vitest config
- Running `npm run test:unit` executes tests concurrently
- No database lock errors occur
- Test execution completes faster than with `fileParallelism: false`
- All tests pass consistently across multiple runs

#### Scenario: Developer runs tests in watch mode

**Given** Vitest is configured
**When** the developer runs `npm test`
**Then** Vitest SHALL start in watch mode
**And** Vitest SHALL re-run tests when files change
**And** the developer SHALL be able to filter tests interactively

**Acceptance Criteria**:
- `npm test` starts Vitest in watch mode
- File changes trigger automatic test re-runs
- Interactive filtering works (press 'p' to filter by filename)

#### Scenario: Vitest works with TypeScript and Next.js imports

**Given** a test file imports Next.js server actions or utilities
**When** Vitest runs the test
**Then** TypeScript SHALL be transpiled correctly
**And** Next.js module aliases (e.g., `@/lib/*`) SHALL resolve
**And** no module resolution errors SHALL occur

**Acceptance Criteria**:
- Tests can import from `@/lib/*`, `@/app/*` paths
- TypeScript types are checked during test execution
- No "Cannot find module" errors for Next.js imports

---

### Requirement: Playwright E2E Testing Framework

The platform SHALL provide a Playwright-based end-to-end testing framework for testing complete user workflows in a browser environment.

#### Scenario: Developer runs E2E tests

**Given** Playwright is installed and configured
**When** the developer runs `npm run test:e2e`
**Then** Playwright SHALL launch a browser
**And** Playwright SHALL execute all tests in `__tests__/e2e/`
**And** the test results SHALL be displayed in the terminal
**And** the browser SHALL close after tests complete

**Acceptance Criteria**:
- Running `npm run test:e2e` executes Playwright
- Browser launches and navigates to test URLs
- Test output shows pass/fail status
- Browser closes automatically after completion

#### Scenario: E2E tests use test database

**Given** an E2E test performs user registration
**When** the test runs
**Then** the test SHALL use the test database (`test.db`)
**And** the test SHALL NOT affect the development database
**And** the database SHALL be reset before the test suite runs

**Acceptance Criteria**:
- E2E tests write to `test.db`, not `dev.db`
- Development database remains unchanged after E2E tests
- Test database is cleared before each test run

#### Scenario: Playwright tests work with Next.js dev server

**Given** the Next.js development server is running
**When** Playwright tests execute
**Then** tests SHALL navigate to `http://localhost:3000`
**And** tests SHALL interact with the running application
**And** tests SHALL wait for page loads and network requests

**Acceptance Criteria**:
- Playwright connects to local dev server
- Tests can fill forms, click buttons, navigate pages
- Tests wait for dynamic content to load

---

### Requirement: Test Scripts in package.json

The platform SHALL provide npm scripts for running different types of tests and generating coverage reports.

#### Scenario: Developer runs all tests

**Given** both Vitest and Playwright are configured
**When** the developer runs `npm test`
**Then** Vitest SHALL start in watch mode for rapid feedback

**Acceptance Criteria**:
- `npm test` runs Vitest in watch mode
- Command completes successfully

#### Scenario: Developer runs unit tests only

**Given** Vitest is configured
**When** the developer runs `npm run test:unit`
**Then** only unit and integration tests SHALL execute
**And** E2E tests SHALL NOT execute

**Acceptance Criteria**:
- `npm run test:unit` runs only Vitest tests
- Playwright does not launch
- Tests in `__tests__/unit/` and `__tests__/integration/` execute

#### Scenario: Developer runs E2E tests only

**Given** Playwright is configured
**When** the developer runs `npm run test:e2e`
**Then** only E2E tests SHALL execute
**And** unit tests SHALL NOT execute

**Acceptance Criteria**:
- `npm run test:e2e` runs only Playwright tests
- Vitest does not execute
- Tests in `__tests__/e2e/` execute

#### Scenario: Developer generates coverage report

**Given** Vitest coverage is configured
**When** the developer runs `npm run test:coverage`
**Then** Vitest SHALL run all unit/integration tests
**And** a coverage report SHALL be generated
**And** the report SHALL show line, branch, and function coverage
**And** an HTML report SHALL be created in `coverage/` directory

**Acceptance Criteria**:
- `npm run test:coverage` generates coverage data
- Terminal output shows coverage percentages
- `coverage/index.html` exists and can be opened in browser
- Coverage report includes all source files in `app/` and `lib/`

---

### Requirement: Test Database Configuration

The platform SHALL use per-worker isolated databases for tests to provide fast, isolated test execution without SQLite write lock contention.

#### Scenario: Tests use isolated test database

**Given** the test environment is configured
**When** any test runs
**Then** the test SHALL connect to a worker-specific database
**And** the test SHALL NOT connect to `dev.db` or production database
**And** the test SHALL NOT create or modify shared database files

**Acceptance Criteria**:
- Each Vitest worker uses unique database URL
- Tests create/modify data in isolated databases only
- Development database file is not modified during tests
- No shared `test.db` file is created
- Run `npm run test:unit` and verify no file-based database conflicts

#### Scenario: Test database is reset before each test

**Given** a test is about to run
**When** the test begins execution
**Then** the test SHALL receive a clean transaction
**And** no data from previous tests SHALL be visible
**And** the schema SHALL be available

**Acceptance Criteria**:
- Each test starts with empty database state
- Prisma schema is available in transaction
- Tests can create data without conflicts
- No manual cleanup code required in test files
- Run tests in random order, verify all pass

---

### Requirement: Test Environment Variables

The platform SHALL support test-specific environment variables to configure test behavior.

#### Scenario: Test environment loads test configuration

**Given** a `.env.test` file exists
**When** tests run
**Then** environment variables SHALL be loaded from `.env.test`
**And** test-specific values SHALL override defaults
**And** `NODE_ENV` SHALL be set to `test`

**Acceptance Criteria**:
- `.env.test` file is read during test execution
- `DATABASE_URL` points to test database
- `SESSION_SECRET` is available for JWT tests
- `NODE_ENV=test` is set

---

### Requirement: Example Tests

The platform SHALL include example tests demonstrating how to write unit, integration, and E2E tests.

#### Scenario: Example unit test passes

**Given** an example unit test exists for a utility function
**When** the developer runs `npm run test:unit`
**Then** the example unit test SHALL pass
**And** the test SHALL demonstrate basic assertions

**Acceptance Criteria**:
- Example unit test file exists (e.g., `__tests__/unit/example.test.ts`)
- Test imports and tests a simple utility function
- Test passes successfully
- Test demonstrates `expect()` assertions

#### Scenario: Example integration test passes

**Given** an example integration test exists for a server action
**When** the developer runs `npm run test:unit`
**Then** the example integration test SHALL pass
**And** the test SHALL interact with the test database
**And** the test SHALL verify database state changes

**Acceptance Criteria**:
- Example integration test file exists (e.g., `__tests__/integration/auth.test.ts`)
- Test calls a server action (e.g., user registration)
- Test verifies data is written to database
- Test passes successfully

#### Scenario: Example E2E test passes

**Given** an example E2E test exists for user registration
**When** the developer runs `npm run test:e2e`
**Then** the example E2E test SHALL pass
**And** the test SHALL navigate to the registration page
**And** the test SHALL fill and submit the form
**And** the test SHALL verify successful registration

**Acceptance Criteria**:
- Example E2E test file exists (e.g., `__tests__/e2e/registration.spec.ts`)
- Test opens browser and navigates to `/register`
- Test fills form fields and clicks submit
- Test verifies redirect or success message
- Test passes successfully

---

### Requirement: Test Documentation

The platform SHALL provide documentation for writing and running tests.

#### Scenario: Developer reads testing documentation

**Given** testing documentation exists
**When** a developer wants to write tests
**Then** documentation SHALL explain how to run tests
**And** documentation SHALL explain how to write unit tests
**And** documentation SHALL explain how to write integration tests
**And** documentation SHALL explain how to write E2E tests
**And** documentation SHALL explain test database setup

**Acceptance Criteria**:
- `TESTING.md` or similar file exists in project root
- Documentation covers all test types
- Documentation includes code examples
- Documentation explains test scripts and coverage

---

### Requirement: Per-Worker Database Isolation

The platform SHALL use worker-specific databases for test execution to provide fast, isolated test runs without SQLite write lock contention.

#### Scenario: Each test worker uses isolated database

**Given** Vitest runs tests in parallel with multiple workers
**When** a test file executes in a worker
**Then** the worker SHALL connect to a unique database
**And** the database URL SHALL include the worker identifier
**And** other workers SHALL NOT share the same database instance
**And** no SQLite write lock errors SHALL occur

**Acceptance Criteria**:
- Each worker generates unique database URL using `process.env.VITEST_WORKER_ID` or `process.pid`
- Multiple test files running in parallel do not experience `SQLITE_BUSY` errors
- Database instances are isolated per worker (verify by checking connection strings in logs)
- Run `npm run test:unit` with `fileParallelism: true` and verify no lock errors

---

### Requirement: Transaction Rollback Pattern

The platform SHALL wrap each test within a test file in a database transaction that rolls back after test completion, ensuring perfect test isolation within a single worker.

#### Scenario: Test runs in isolated transaction

**Given** a test creates database records
**When** the test completes (pass or fail)
**Then** all database changes SHALL be rolled back
**And** subsequent tests in the same file SHALL NOT see data from previous tests
**And** the database SHALL return to clean state automatically

**Acceptance Criteria**:
- Create a user in test A, verify it doesn't exist in test B (within same file)
- Run tests in different orders, verify results are consistent
- Test failures still trigger rollback (no orphaned data)
- Run `npm run test:unit` multiple times, verify consistent results

#### Scenario: Test files run in parallel without interference

**Given** multiple test files execute concurrently in separate workers
**When** each test file creates database records
**Then** test files SHALL NOT see each other's data
**And** test files SHALL NOT experience database lock errors
**And** all tests SHALL pass regardless of execution order

**Acceptance Criteria**:
- Enable `fileParallelism: true` in vitest config
- Run `npm run test:unit` with parallel execution enabled
- Verify no "database is locked" or `SQLITE_BUSY` errors
- Verify all tests pass
- Run tests 10 times to ensure consistency

---

### Requirement: Database Setup and Teardown Utilities

The platform SHALL provide centralized database utilities for test setup and teardown in `__tests__/helpers/db.ts` with per-worker database isolation.

#### Scenario: Test worker uses database setup utility

**Given** a test file imports database helpers
**When** the test calls `setupTestDatabase()`
**Then** a worker-specific database SHALL be created
**And** the database URL SHALL include the worker identifier
**And** the Prisma schema SHALL be applied
**And** a Prisma client SHALL be returned for test use

**Acceptance Criteria**:
- `setupTestDatabase()` function exists in `__tests__/helpers/db.ts`
- Function generates unique database URL using worker ID
- Function returns a configured Prisma client
- Database schema matches production schema
- Verify by calling function in a test and querying schema

#### Scenario: Test uses transaction wrapper

**Given** a test needs database isolation
**When** the test uses `withTestTransaction(callback)`
**Then** the callback SHALL execute within a transaction
**And** the transaction SHALL roll back after callback completes
**And** database changes SHALL NOT persist

**Acceptance Criteria**:
- `withTestTransaction()` function exists in `__tests__/helpers/db.ts`
- Function accepts async callback
- Callback receives Prisma transaction client
- Changes are rolled back after callback
- Test by creating a user inside callback, verify it doesn't exist after

#### Scenario: Test cleans up database

**Given** a test has completed
**When** the test calls `cleanupTestDatabase()`
**Then** the database connection SHALL be closed
**And** resources SHALL be freed

**Acceptance Criteria**:
- `cleanupTestDatabase()` function exists
- Function closes Prisma client connection
- No memory leaks after running full test suite
- Verify with `npm run test:unit` and check for connection warnings

---

### Requirement: Seed Data Helpers

The platform SHALL provide factory functions for creating common test entities with sensible defaults in `__tests__/helpers/seed.ts`.

#### Scenario: Test creates user with defaults

**Given** a test needs a user entity
**When** the test calls `createTestUser(tx)`
**Then** a user SHALL be created with default values
**And** the user SHALL have a hashed password
**And** the user SHALL have a role-appropriate profile
**And** the user SHALL be returned to the test

**Acceptance Criteria**:
- `createTestUser()` function exists in `__tests__/helpers/seed.ts`
- Function accepts Prisma transaction client as first parameter
- Function accepts optional overrides object
- Default user has email, password, role
- CLIENT users get ClientProfile, SPECIALIST users get SpecialistProfile
- Test by calling function and verifying user exists in database

#### Scenario: Test creates user with custom values

**Given** a test needs a specific user configuration
**When** the test calls `createTestUser(tx, { email: 'custom@test.com', role: 'ADMIN' })`
**Then** a user SHALL be created with custom values
**And** default values SHALL be used for unspecified fields

**Acceptance Criteria**:
- Overrides parameter works for all user fields
- Custom email is used instead of default
- Custom role is applied
- Test by creating user with overrides and verifying values

#### Scenario: Test creates gig with client

**Given** a test needs a gig entity
**When** the test calls `createTestGig(tx)`
**Then** a gig SHALL be created with default values
**And** a client user SHALL be created automatically if not provided
**And** the gig SHALL be returned with client relation

**Acceptance Criteria**:
- `createTestGig()` function exists
- Function creates client user if not provided
- Function accepts `clientId` override to use existing client
- Default gig has title, description, budget, status
- Test by calling function and verifying gig and client exist

#### Scenario: Test creates application with related entities

**Given** a test needs an application entity
**When** the test calls `createTestApplication(tx)`
**Then** an application SHALL be created
**And** a gig SHALL be created automatically if not provided
**And** a specialist user SHALL be created automatically if not provided
**And** all related entities SHALL be returned

**Acceptance Criteria**:
- `createTestApplication()` function exists
- Function creates gig and specialist if not provided
- Function accepts overrides for gigId and specialistId
- Application has default approach, questions, status
- Test by calling function and verifying all entities exist with correct relations
