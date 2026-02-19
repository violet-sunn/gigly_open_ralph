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
# Testing Specification Delta

## ADDED Requirements

### Requirement: Test Session Creation Helper

The platform SHALL provide a helper function to create valid JWT session tokens for test users without going through the login flow.

#### Scenario: Create session token for test user

**Given** a test user exists in the test database
**When** the test calls `createTestSession(user)`
**Then** a valid JWT token SHALL be returned
**And** the token SHALL contain the user's ID, email, and role
**And** the token SHALL be signed with the same secret as production
**And** the token SHALL have a 7-day expiration

**Acceptance Criteria**:
- `createTestSession(user)` function exists in `__tests__/helpers/auth.ts`
- Function accepts a user object with `id`, `email`, and `role` properties
- Returns a string JWT token
- Token can be verified using `jose` library with `SESSION_SECRET`
- Token payload matches user properties
- Run test: create session, verify token, decode and check payload

#### Scenario: Create session for different roles

**Given** test users with CLIENT, SPECIALIST, and ADMIN roles
**When** sessions are created for each user
**Then** each session SHALL contain the correct role
**And** each session SHALL be independently valid

**Acceptance Criteria**:
- Create sessions for all three roles
- Verify each token contains correct role in payload
- Tokens are distinct and don't interfere with each other

---

### Requirement: Authenticated Context Helper

The platform SHALL provide a helper function to execute code with mocked authenticated session context for testing server actions.

#### Scenario: Execute callback with authenticated context

**Given** a test user
**When** the test calls `withAuthContext(user, async () => { ... })`
**Then** the callback SHALL execute with `getSession()` returning the user's session data
**And** server actions called within the callback SHALL see the user as authenticated
**And** the context SHALL be cleaned up after the callback completes

**Acceptance Criteria**:
- `withAuthContext(user, callback)` function exists in `__tests__/helpers/auth.ts`
- Function accepts user object and async callback
- Mocks Next.js `cookies()` to return session token
- `getSession()` returns user data during callback execution
- Context is restored after callback (no pollution between tests)
- Run test: call server action within `withAuthContext`, verify it sees authenticated user

#### Scenario: Nested authenticated contexts

**Given** a test with nested `withAuthContext` calls
**When** the inner context uses a different user
**Then** the inner callback SHALL see the inner user
**And** the outer callback SHALL see the outer user after inner completes

**Acceptance Criteria**:
- Nested contexts work correctly
- Context switching doesn't leak between levels
- Test by nesting two `withAuthContext` calls with different users

---

### Requirement: Authenticated Request Helper

The platform SHALL provide a helper function to call server actions as an authenticated user in integration tests.

#### Scenario: Make authenticated request to server action

**Given** a test user and a server action that requires authentication
**When** the test calls `makeAuthenticatedRequest(user, serverAction, ...args)`
**Then** the server action SHALL execute with the user's session
**And** the server action SHALL see the user as authenticated via `getSession()`
**And** the result SHALL be returned to the test

**Acceptance Criteria**:
- `makeAuthenticatedRequest(user, action, ...args)` function exists
- Function accepts user, server action function, and action arguments
- Sets up authenticated context before calling action
- Passes arguments to server action correctly
- Returns action result or throws action errors
- Run test: call `createGig` action via helper, verify gig is created with correct clientId

#### Scenario: Authenticated request with form data

**Given** a server action that accepts FormData (like `registerUser`)
**When** the test calls `makeAuthenticatedRequest` with FormData argument
**Then** the FormData SHALL be passed correctly to the action
**And** the action SHALL process it normally

**Acceptance Criteria**:
- Helper works with FormData arguments
- Helper works with plain object arguments
- Test by calling form-based action with FormData

---

### Requirement: Authorization Failure Testing Helper

The platform SHALL provide a helper function to assert that operations fail with authorization errors.

#### Scenario: Verify unauthorized access is blocked

**Given** a server action that requires specific role or ownership
**When** the test calls `expectUnauthorized(async () => { ... })`
**Then** the callback SHALL throw an authorization error
**And** the test SHALL pass if authorization error is thrown
**And** the test SHALL fail if callback succeeds or throws different error

**Acceptance Criteria**:
- `expectUnauthorized(callback)` function exists in `__tests__/helpers/auth.ts`
- Function accepts async callback
- Asserts callback throws error with authorization-related message
- Provides clear error message if assertion fails
- Run test: try to accept application as non-owner, verify `expectUnauthorized` passes

#### Scenario: Test role-based authorization

**Given** a CLIENT user and an admin-only action
**When** the test calls the action within `expectUnauthorized`
**Then** the test SHALL pass because CLIENT cannot perform admin actions

**Acceptance Criteria**:
- Helper works for role-based authorization (ADMIN-only actions)
- Helper works for ownership-based authorization (gig owner actions)
- Test both scenarios and verify helper correctly detects unauthorized access

---

### Requirement: Multi-Role Test Helpers

The platform SHALL provide convenience functions for creating authenticated sessions for specific roles.

#### Scenario: Create authenticated CLIENT session

**Given** a test needs a CLIENT user
**When** the test calls `createAuthenticatedClient(tx, overrides?)`
**Then** a CLIENT user SHALL be created with profile
**And** a valid session token SHALL be returned
**And** the user object SHALL be returned

**Acceptance Criteria**:
- `createAuthenticatedClient(tx, overrides?)` function exists
- Creates CLIENT user with ClientProfile
- Returns `{ user, session }` object
- Session is valid JWT token
- Test by creating client and verifying both user and session

#### Scenario: Create authenticated SPECIALIST session

**Given** a test needs a SPECIALIST user
**When** the test calls `createAuthenticatedSpecialist(tx, overrides?)`
**Then** a SPECIALIST user SHALL be created with profile
**And** a valid session token SHALL be returned
**And** the user object SHALL be returned

**Acceptance Criteria**:
- `createAuthenticatedSpecialist(tx, overrides?)` function exists
- Creates SPECIALIST user with SpecialistProfile
- Returns `{ user, session }` object
- Session is valid JWT token

#### Scenario: Create authenticated ADMIN session

**Given** a test needs an ADMIN user
**When** the test calls `createAuthenticatedAdmin(tx, overrides?)`
**Then** an ADMIN user SHALL be created
**And** a valid session token SHALL be returned
**And** the user object SHALL be returned

**Acceptance Criteria**:
- `createAuthenticatedAdmin(tx, overrides?)` function exists
- Creates ADMIN user (no profile needed)
- Returns `{ user, session }` object
- Session is valid JWT token

---

### Requirement: Session Context Cleanup

The platform SHALL ensure that mocked session context is properly cleaned up after tests to prevent test pollution.

#### Scenario: Context cleanup after test

**Given** a test uses `withAuthContext`
**When** the test completes (pass or fail)
**Then** the mocked session context SHALL be removed
**And** subsequent tests SHALL NOT see the previous session
**And** `getSession()` SHALL return null outside authenticated context

**Acceptance Criteria**:
- Context is cleaned up after successful callback
- Context is cleaned up after callback throws error
- Test by calling `getSession()` after `withAuthContext` completes, verify it returns null
- Run multiple tests in sequence, verify no session leakage

---

### Requirement: E2E Session Helper

The platform SHALL provide a helper function to set authenticated sessions in Playwright E2E tests by injecting session cookies.

#### Scenario: Set authenticated session in E2E test

**Given** a Playwright page and a test user
**When** the test calls `setE2ESession(page, user)`
**Then** a valid session cookie SHALL be added to the browser context
**And** the cookie SHALL contain a JWT token with the user's data
**And** subsequent page navigations SHALL maintain the authenticated session
**And** the application SHALL recognize the user as authenticated

**Acceptance Criteria**:
- `setE2ESession(page, user)` function exists in `__tests__/helpers/auth.ts`
- Function accepts Playwright `Page` object and user object
- Uses `createTestSession(user)` to generate JWT token
- Adds cookie via `page.context().addCookies([...])`
- Cookie configuration matches production: name='session', httpOnly=true, sameSite='lax', path='/'
- Test by setting session and navigating to `/dashboard`, verify user is authenticated

#### Scenario: E2E session persists across navigations

**Given** an E2E test has set an authenticated session
**When** the test navigates to multiple pages
**Then** the session SHALL persist across all navigations
**And** the user SHALL remain authenticated
**And** protected pages SHALL be accessible

**Acceptance Criteria**:
- Set CLIENT session, navigate to `/dashboard`, then `/dashboard/gigs/new`, verify both pages load
- Set SPECIALIST session, navigate to `/dashboard`, then `/dashboard/gigs`, verify both pages load
- Session cookie is not cleared between navigations

#### Scenario: E2E session works for all roles

**Given** test users with different roles
**When** sessions are set for CLIENT, SPECIALIST, and ADMIN
**Then** each role SHALL have appropriate access to their dashboards
**And** role-specific features SHALL be accessible

**Acceptance Criteria**:
- CLIENT can access `/dashboard/gigs/new`
- SPECIALIST can access `/dashboard/gigs` (browse)
- ADMIN can access `/admin`
- Test all three roles in separate E2E tests

---

### Requirement: Helper Documentation and Examples

The platform SHALL provide clear documentation and examples for using authentication test helpers.

#### Scenario: Developer reads auth helper documentation

**Given** a developer wants to test authenticated functionality
**When** they read the testing documentation
**Then** documentation SHALL explain how to create test sessions
**And** documentation SHALL explain how to use `withAuthContext`
**And** documentation SHALL explain how to test authorization failures
**And** documentation SHALL include code examples for each helper

**Acceptance Criteria**:
- `TESTING.md` includes section on authentication helpers
- Each helper function is documented with purpose and usage
- Code examples show common testing patterns
- Examples cover all three roles (CLIENT, SPECIALIST, ADMIN)

#### Scenario: Example test demonstrates helper usage

**Given** example tests exist in `__tests__/integration/auth-helpers.test.ts`
**When** a developer reads the examples
**Then** examples SHALL demonstrate creating sessions
**And** examples SHALL demonstrate authenticated requests
**And** examples SHALL demonstrate authorization testing
**And** all examples SHALL pass when run

**Acceptance Criteria**:
- Example test file exists
- Examples cover all major helper functions
- Examples are well-commented
- Run `npm run test:unit` and verify examples pass
### Requirement: Russian Data Generators

The platform SHALL provide utility functions that generate realistic Russian data for test entities.

#### Scenario: Generate Russian person name

**Given** a test needs a realistic Russian person name
**When** the test calls `generateRussianName()`
**Then** a realistic Russian full name SHALL be returned
**And** the name SHALL be randomly selected from a predefined list
**And** the list SHALL include both male and female names

**Acceptance Criteria:**
- `generateRussianName()` function exists in `__tests__/helpers/seed.ts`
- Returns strings like "Александр Петров", "Мария Иванова", "Дмитрий Соколов"
- List includes at least 20 different names
- Names are realistic and commonly used in Russia

#### Scenario: Generate Russian company name

**Given** a test needs a realistic Russian company name
**When** the test calls `generateRussianCompany()`
**Then** a realistic Russian company name SHALL be returned
**And** the name SHALL follow Russian business naming conventions (ООО, ИП, etc.)

**Acceptance Criteria:**
- `generateRussianCompany()` function exists
- Returns strings like "ООО \"ТехноСтарт\"", "ООО \"Цифровые Решения\""
- List includes at least 15 different company names
- Names reflect IT/tech industry context

#### Scenario: Generate realistic INN

**Given** a test needs a realistic INN (Individual Taxpayer Number)
**When** the test calls `generateRussianINN()`
**Then** a realistic 10-digit INN SHALL be returned
**And** the INN SHALL be randomly selected from a predefined pool

**Acceptance Criteria:**
- `generateRussianINN()` function exists
- Returns 10-digit string (e.g., "7743013902", "7707083893")
- Pool includes 5-10 realistic INN values
- Random selection provides variety in test data
- Format is realistic (all digits, length 10)

#### Scenario: Generate Russian gig title

**Given** a test needs a realistic gig title
**When** the test calls `generateRussianGigTitle()`
**Then** a realistic Russian gig title SHALL be returned
**And** the title SHALL describe a concrete technical task

**Acceptance Criteria:**
- `generateRussianGigTitle()` function exists
- Returns strings like "Разработка REST API для мобильного приложения"
- List includes at least 20 different titles
- Titles cover various tech domains (backend, frontend, DevOps, etc.)

#### Scenario: Generate Russian gig description

**Given** a test needs a realistic gig description
**When** the test calls `generateRussianGigDescription()`
**Then** a realistic Russian gig description SHALL be returned
**And** the description SHALL provide context and requirements

**Acceptance Criteria:**
- `generateRussianGigDescription()` function exists
- Returns multi-sentence descriptions in Russian
- Descriptions are 2-4 sentences long
- Content is technically realistic

#### Scenario: Generate Russian message content

**Given** a test needs realistic message content
**When** the test calls `generateRussianMessage()`
**Then** a realistic Russian message SHALL be returned
**And** the message SHALL be appropriate for gig communication

**Acceptance Criteria:**
- `generateRussianMessage()` function exists
- Returns strings like "Добрый день! Уточните, пожалуйста, требования к производительности."
- List includes at least 15 different messages
- Messages cover common scenarios (questions, updates, confirmations)

---

### Requirement: Enhanced User Factory with Russian Data

The platform SHALL enhance `createTestUser()` to use realistic Russian data by default while maintaining backward compatibility.

#### Scenario: Create user with Russian name

**Given** a test calls `createTestUser(tx)` without overrides
**When** the user is created
**Then** the user SHALL have a unique email address
**And** if role is SPECIALIST, the displayName SHALL be a Russian name
**And** if role is CLIENT, the companyName SHALL be a Russian company name
**And** if role is CLIENT, the inn SHALL be a realistic Russian INN

**Acceptance Criteria:**
- Default SPECIALIST users have Russian displayName
- Default CLIENT users have Russian companyName and realistic INN
- Email remains unique (test-{timestamp}-{random}@example.com pattern)
- INN is realistic (from predefined pool, not necessarily unique)
- Overrides still work for all fields
- Existing tests continue to pass

#### Scenario: Create user with validation-compliant data

**Given** a test calls `createTestUser(tx, { role: 'SPECIALIST' })`
**When** the user is created
**Then** the experienceLevel SHALL be either "MIDDLE" or "SENIOR"
**And** the techStack SHALL contain realistic tech stack items
**And** all data SHALL pass model validations

**Acceptance Criteria:**
- experienceLevel defaults to "SENIOR" (valid value)
- techStack defaults to realistic Russian-context stack
- hourlyRate is in kopecks (e.g., 500000 for 5000 RUB)
- No validation errors when saving to database

#### Scenario: Create user with unique email

**Given** multiple tests create users in parallel
**When** each test calls `createTestUser(tx)`
**Then** each user SHALL have a unique email address
**And** no "Unique constraint failed" errors SHALL occur on email field

**Acceptance Criteria:**
- Email is automatically unique (timestamp + random suffix)
- No collisions in parallel test execution
- Overrides still allow setting specific email values
- Run 100 users in parallel, verify no unique constraint errors on email

---

### Requirement: Enhanced Gig Factory with Russian Content

The platform SHALL enhance `createTestGig()` to use realistic Russian gig data by default.

#### Scenario: Create gig with Russian content

**Given** a test calls `createTestGig(tx)` without overrides
**When** the gig is created
**Then** the title SHALL be a Russian gig title
**And** the description SHALL be a Russian gig description
**And** the tags SHALL contain realistic tech stack tags

**Acceptance Criteria:**
- Default title is Russian (e.g., "Разработка REST API")
- Default description is Russian (2-4 sentences)
- Default tags are "React,TypeScript" or similar realistic stack
- Budget defaults to realistic value (e.g., 150000 kopecks = 1500 RUB)
- serviceFee calculated correctly (10% of budget)
- totalAmount = budget + serviceFee

#### Scenario: Create gig with structured requirements

**Given** a test calls `createTestGig(tx, { goal: '...', deliverables: '...', constraints: '...' })`
**When** the gig is created
**Then** the structured requirement fields SHALL be populated
**And** the fields SHALL contain Russian content if provided

**Acceptance Criteria:**
- goal, deliverables, constraints fields are settable
- Default values are empty strings (optional fields)
- Overrides work for all fields

---

### Requirement: Enhanced Application Factory with Russian Content

The platform SHALL enhance `createTestApplication()` to use realistic Russian application data by default.

#### Scenario: Create application with Russian structured fields

**Given** a test calls `createTestApplication(tx)` without overrides
**When** the application is created
**Then** the approach field SHALL contain Russian technical approach text
**And** the questions field SHALL contain Russian clarifying questions
**And** the estimatedEffort field SHALL contain realistic effort estimate

**Acceptance Criteria:**
- Default approach is Russian (e.g., "Буду использовать архитектуру REST с валидацией через Zod")
- Default questions is Russian (e.g., "Какие требования к производительности? Нужна ли документация API?")
- Default estimatedEffort is realistic (e.g., "2 недели", "40 часов")
- coverLetter remains empty (legacy field)
- All fields pass validation (approach 100-2000 chars, questions 50-1000 chars)

---

### Requirement: Message Factory

The platform SHALL provide a factory function for creating Message entities with realistic Russian content.

#### Scenario: Create message with defaults

**Given** a test needs a message entity
**When** the test calls `createTestMessage(tx)`
**Then** a message SHALL be created with Russian content
**And** a gig SHALL be created automatically if not provided
**And** a sender user SHALL be created automatically if not provided
**And** the message SHALL be associated with the gig

**Acceptance Criteria:**
- `createTestMessage(tx, overrides?)` function exists in `__tests__/helpers/seed.ts`
- Default content is Russian message text
- Creates gig if gigId not provided
- Creates sender if senderId not provided
- Returns message with gig and sender relations included
- Content passes validation (non-empty, max 2000 chars)

#### Scenario: Create message with specific sender and gig

**Given** a test has existing gig and user
**When** the test calls `createTestMessage(tx, { gigId, senderId, content })`
**Then** a message SHALL be created linking to the provided gig and sender
**And** the custom content SHALL be used

**Acceptance Criteria:**
- Accepts gigId override to use existing gig
- Accepts senderId override to use existing sender
- Accepts content override for custom message text
- Does not create duplicate gigs or users when IDs provided

---

### Requirement: Factory Composability Patterns

The platform SHALL support composing factories to create complex related data graphs efficiently.

#### Scenario: Create gig with applications

**Given** a test needs a gig with multiple applications
**When** the test creates a gig and then creates applications referencing it
**Then** all applications SHALL be linked to the same gig
**And** each application SHALL have a different specialist

**Acceptance Criteria:**
- Can call `createTestGig(tx)` once, then `createTestApplication(tx, { gigId })` multiple times
- Each application gets unique specialist automatically
- No unique constraint violations
- All relations are correctly established

#### Scenario: Create complete gig workflow

**Given** a test needs to simulate full gig lifecycle
**When** the test creates client, gig, specialist, application, and messages
**Then** all entities SHALL be correctly related
**And** the data SHALL be realistic and validation-compliant

**Acceptance Criteria:**
- Can create: client → gig → application → accept → messages in sequence
- All Russian data is realistic and consistent
- No validation errors at any step
- Example documented in TESTING.md

---

### Requirement: Factory Documentation

The platform SHALL provide comprehensive documentation for factory functions with usage examples.

#### Scenario: Developer reads factory documentation

**Given** a developer wants to write tests with realistic data
**When** they read TESTING.md
**Then** documentation SHALL explain all factory functions
**And** documentation SHALL include examples for common scenarios
**And** documentation SHALL explain Russian data generators

**Acceptance Criteria:**
- TESTING.md includes "Mock Data Factories" section
- Each factory function is documented with signature and purpose
- Examples show: creating users, gigs, applications, messages
- Examples show: overriding fields, creating related data
- Examples show: using Russian data generators directly

#### Scenario: Example tests demonstrate factory usage

**Given** example tests exist
**When** a developer reads `__tests__/helpers/seed.test.ts`
**Then** examples SHALL demonstrate all factory functions
**And** examples SHALL show realistic test scenarios
**And** all examples SHALL pass

**Acceptance Criteria:**
- `seed.test.ts` includes tests for all factories
- Tests demonstrate overrides and defaults
- Tests verify Russian data is generated
- Tests verify validation compliance
- Run `npm run test:unit` and verify all pass

---

### Requirement: Validation Compliance Verification

The platform SHALL ensure all factory-generated data passes model validations.

#### Scenario: Factory data passes database constraints

**Given** any factory function is called with defaults
**When** the entity is saved to the database
**Then** no validation errors SHALL occur
**And** no constraint violations SHALL occur

**Acceptance Criteria:**
- User factory: email unique (auto-generated), password hashed, role valid
- User factory: CLIENT users have realistic INN (from pool)
- Gig factory: budget > 0, status valid, serviceFee calculated correctly
- Application factory: approach 100-2000 chars, questions 50-1000 chars, unique (gigId, specialistId)
- Message factory: content non-empty, valid gigId and senderId
- Test by creating entities and verifying no errors

#### Scenario: Parallel factory calls do not cause unique constraint violations

**Given** multiple tests run in parallel using factories
**When** each test creates users, gigs, applications, and messages
**Then** no "Unique constraint failed" errors SHALL occur on fields with unique constraints
**And** all entities SHALL be created successfully

**Acceptance Criteria:**
- Run 50 parallel tests, each creating 5 users
- Verify no unique constraint errors on email (has @unique)
- Verify no unique constraint errors on (gigId, specialistId) for applications (has @@unique)
- All 250 users created successfully
- Run with `fileParallelism: true` in vitest config

#### Scenario: Factory data passes business logic validations

**Given** factory-generated data is used in server actions
**When** server actions validate the data
**Then** no business logic validation errors SHALL occur

**Acceptance Criteria:**
- SPECIALIST experienceLevel is "MIDDLE" or "SENIOR" (not "JUNIOR")
- CLIENT companyName and inn are non-empty
- Gig budget meets minimum threshold (if enforced)
- Application approach and questions are non-empty
- Test by calling server actions with factory data
