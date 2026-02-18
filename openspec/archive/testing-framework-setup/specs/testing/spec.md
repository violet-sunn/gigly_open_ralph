# Testing Specification Delta

## ADDED Requirements

### Requirement: Vitest Unit Testing Framework

The platform SHALL provide a Vitest-based unit and integration testing framework for testing business logic, server actions, and database operations.

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

The platform SHALL use a separate SQLite database for tests to prevent interference with development data.

#### Scenario: Tests use isolated test database

**Given** the test environment is configured
**When** any test runs
**Then** the test SHALL connect to `test.db`
**And** the test SHALL NOT connect to `dev.db` or production database

**Acceptance Criteria**:
- `DATABASE_URL` in test environment points to `test.db`
- Tests create/modify data in `test.db` only
- Development database file is not modified during tests

#### Scenario: Test database is reset before tests

**Given** the test database contains data from previous test runs
**When** the test suite starts
**Then** the database SHALL be cleared
**And** the schema SHALL be applied
**And** optional seed data SHALL be loaded

**Acceptance Criteria**:
- Test database is empty at start of each test run
- Prisma schema is applied to test database
- Tests start with clean state

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
