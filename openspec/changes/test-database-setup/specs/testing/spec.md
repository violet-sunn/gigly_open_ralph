# Testing Specification Delta

## ADDED Requirements

### Requirement: In-Memory Test Database with Per-Worker Isolation

The platform SHALL use worker-specific in-memory SQLite databases for test execution to provide fast, isolated test runs without SQLite write lock contention.

#### Scenario: Each test worker uses isolated database

**Given** Vitest runs tests in parallel with multiple workers
**When** a test file executes in a worker
**Then** the worker SHALL connect to a unique in-memory SQLite database
**And** the database URL SHALL include the worker identifier (e.g., `file:memdb_${VITEST_WORKER_ID}?mode=memory&cache=shared`)
**And** other workers SHALL NOT share the same database instance
**And** no SQLite write lock errors SHALL occur

**Acceptance Criteria**:
- Each worker generates unique database URL using `process.env.VITEST_WORKER_ID` or `process.pid`
- Multiple test files running in parallel do not experience `SQLITE_BUSY` errors
- Database instances are isolated per worker (verify by checking connection strings in logs)
- Run `npm run test:unit` with `fileParallelism: true` and verify no lock errors

#### Scenario: Tests use in-memory database

**Given** the test suite is configured
**When** a test runs
**Then** the test SHALL connect to an in-memory SQLite database
**And** the test SHALL NOT write to any file-based database
**And** database operations SHALL complete faster than file-based operations

**Acceptance Criteria**:
- `DATABASE_URL` in test environment uses in-memory configuration with worker ID
- No `test.db` file is created or modified during test execution
- Test execution time for database operations is at least 30% faster than file-based approach
- Run `npm run test:unit` and verify no file I/O errors

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
**Then** a worker-specific in-memory database SHALL be created
**And** the database URL SHALL include the worker identifier
**And** the Prisma schema SHALL be applied
**And** a Prisma client SHALL be returned for test use

**Acceptance Criteria**:
- `setupTestDatabase()` function exists in `__tests__/helpers/db.ts`
- Function generates unique database URL using `process.env.VITEST_WORKER_ID` or `process.pid`
- Function returns a configured Prisma client
- Database schema matches production schema
- Function completes in under 100ms
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
**When** the test calls `createTestUser()`
**Then** a user SHALL be created with default values
**And** the user SHALL have a hashed password
**And** the user SHALL have a role-appropriate profile
**And** the user SHALL be returned to the test

**Acceptance Criteria**:
- `createTestUser()` function exists in `__tests__/helpers/seed.ts`
- Function accepts optional overrides object
- Default user has email, password, role
- CLIENT users get ClientProfile, SPECIALIST users get SpecialistProfile
- Test by calling function and verifying user exists in database

#### Scenario: Test creates user with custom values

**Given** a test needs a specific user configuration
**When** the test calls `createTestUser({ email: 'custom@test.com', role: 'ADMIN' })`
**Then** a user SHALL be created with custom values
**And** default values SHALL be used for unspecified fields

**Acceptance Criteria**:
- Overrides parameter works for all user fields
- Custom email is used instead of default
- Custom role is applied
- Test by creating user with overrides and verifying values

#### Scenario: Test creates gig with client

**Given** a test needs a gig entity
**When** the test calls `createTestGig()`
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
**When** the test calls `createTestApplication()`
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

---

## MODIFIED Requirements

### Requirement: Test Database Configuration

~~The platform SHALL use a separate SQLite database for tests to prevent interference with development data.~~

The platform SHALL use an in-memory SQLite database for tests to provide fast, isolated test execution without file I/O overhead.

#### Scenario: Tests use isolated test database

**Given** the test environment is configured
**When** any test runs
**Then** the test SHALL connect to an in-memory database
**And** the test SHALL NOT connect to `dev.db` or production database
**And** the test SHALL NOT create or modify any database files

**Acceptance Criteria**:
- `DATABASE_URL` in test environment uses in-memory configuration
- Tests create/modify data in memory only
- Development database file is not modified during tests
- No `test.db` file exists after test execution
- Run `npm run test:unit` and verify no file-based database is created

#### Scenario: Test database is reset before each test

~~**Given** the test database contains data from previous test runs~~
~~**When** the test suite starts~~
~~**Then** the database SHALL be cleared~~

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

### Requirement: Vitest Unit Testing Framework

The platform SHALL provide a Vitest-based unit and integration testing framework for testing business logic, server actions, and database operations **with parallel execution support**.

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

---

## REMOVED Requirements

None. All existing testing requirements remain valid. This change enhances the test database infrastructure without removing functionality.
