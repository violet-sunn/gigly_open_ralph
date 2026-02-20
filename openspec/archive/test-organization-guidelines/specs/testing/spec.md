# Testing Specification Delta

## ADDED Requirements

### Requirement: Test Organization Documentation

The platform SHALL provide comprehensive documentation at `__tests__/README.md` that explains test organization standards, directory structure, naming conventions, test type selection guidelines, and AAA pattern requirements.

#### Scenario: Developer reads test organization documentation

**Given** a developer wants to write tests for the platform
**When** they open `__tests__/README.md`
**Then** the documentation SHALL explain the directory structure (`__tests__/unit/`, `__tests__/integration/`, `__tests__/e2e/`, `__tests__/helpers/`)
**And** the documentation SHALL explain naming conventions (*.test.ts for unit/integration, *.spec.ts for E2E)
**And** the documentation SHALL explain the difference between real tests (Vitest framework) and legacy verification scripts
**And** the documentation SHALL provide guidelines on when to write unit vs integration vs E2E tests
**And** the documentation SHALL mandate AAA pattern (Arrange-Act-Assert) for all tests
**And** the documentation SHALL document available test helpers with exact function signatures
**And** the documentation SHALL document common mocking patterns (Next.js cookies, redirect, Prisma)
**And** the documentation SHALL include at least 3 concrete AAA-pattern code examples from actual tests

**Acceptance Criteria**:
- `__tests__/README.md` file exists
- Documentation is comprehensive (covers all required topics)
- Documentation is concise (150-250 lines target)
- Documentation includes directory structure with actual file counts
- Documentation includes naming convention rules
- Documentation explains test type selection (unit/integration/E2E)
- Documentation mandates AAA pattern with explanation
- Documentation references test helpers in `__tests__/helpers/` with TypeScript signatures
- Documentation includes at least 3 code examples from actual test files
- All file paths and references are accurate and verified
- Documentation is in English (technical standard)

#### Scenario: Documentation explains directory structure

**Given** a developer reads the directory structure section
**When** they want to understand where to place tests
**Then** the documentation SHALL explain that `__tests__/unit/` contains unit tests for isolated functions and utilities (~2 files)
**And** the documentation SHALL explain that `__tests__/integration/` contains integration tests for server actions and database operations (~26 files, 95% of tests)
**And** the documentation SHALL explain that `__tests__/e2e/` contains end-to-end tests for complete user workflows (~2 files)
**And** the documentation SHALL explain that `__tests__/helpers/` contains test utilities (db.ts, seed.ts, auth.ts, auth-mocks.ts)
**And** the documentation SHALL explain that `__tests__/setup.ts` contains global test setup
**And** the documentation SHALL include actual file count statistics

**Acceptance Criteria**:
- Each directory purpose is clearly explained
- Examples of what belongs in each directory are provided
- File count statistics match actual codebase (verify with `ls __tests__/integration/*.test.ts | wc -l`)
- Directory structure matches actual codebase structure
- Explanation is clear and actionable

#### Scenario: Documentation explains naming conventions

**Given** a developer reads the naming conventions section
**When** they want to name a new test file
**Then** the documentation SHALL state that unit and integration tests use `*.test.ts` extension
**And** the documentation SHALL state that E2E tests use `*.spec.ts` extension
**And** the documentation SHALL explain that test files should be named after the feature or module they test
**And** the documentation SHALL provide examples from actual codebase files

**Acceptance Criteria**:
- Naming convention rules are explicit and clear
- Examples include actual files: `currency.test.ts`, `gig-creation.test.ts`, `registration.spec.ts`
- Rationale for different extensions is explained (Vitest convention vs Playwright convention)
- Rules match existing test file naming patterns in codebase
- Verify examples exist:
  ```bash
  ls __tests__/unit/currency.test.ts
  ls __tests__/integration/gig-creation.test.ts
  ls __tests__/e2e/registration.spec.ts
  ```

#### Scenario: Documentation mandates AAA pattern

**Given** a developer reads the test structure guidelines
**When** they want to write a new test
**Then** the documentation SHALL mandate AAA pattern (Arrange-Act-Assert) for all tests
**And** the documentation SHALL explain each phase:
  - Arrange: Set up test data and preconditions
  - Act: Execute the code under test
  - Assert: Verify the expected outcome
**And** the documentation SHALL provide a concrete example from actual codebase
**And** the documentation SHALL show AAA pattern with comments marking each section

**Acceptance Criteria**:
- AAA pattern is explicitly required (not optional)
- Each phase (Arrange, Act, Assert) is explained
- At least one complete example shows AAA pattern with inline comments
- Example is from actual test file (e.g., `gig-creation.test.ts`)
- Explanation is concise (under 100 words)
- Benefits are mentioned (readability, maintainability, debugging)

**Given** a developer reads the documentation
**When** they encounter references to legacy scripts
**Then** the documentation SHALL explain that real tests use Vitest framework with `describe()`, `it()`, `expect()` assertions
**And** the documentation SHALL explain that legacy verification scripts in `scripts/legacy-tests/` use custom `pass()`/`fail()` functions
**And** the documentation SHALL state that legacy scripts are archived for historical reference only
**And** the documentation SHALL direct developers to write new tests in `__tests__/` using Vitest

**Acceptance Criteria**:
- Clear distinction between real tests and verification scripts
- Vitest framework features are mentioned (describe, it, expect)
- Legacy scripts are clearly marked as archived/not maintained
- Developers are directed to use Vitest for new tests
- Reference to `scripts/legacy-tests/README.md` for more context

#### Scenario: Documentation provides test type selection guidelines

**Given** a developer wants to decide which test type to write
**When** they read the test type selection section
**Then** the documentation SHALL provide clear criteria for choosing unit tests (testing isolated functions, no database, fast <10ms)
**And** the documentation SHALL provide clear criteria for choosing integration tests (testing server actions, database operations, business logic, 50-200ms)
**And** the documentation SHALL provide clear criteria for choosing E2E tests (testing complete user workflows, browser interactions, full stack, 1-5s)
**And** the documentation SHALL include examples from actual test files for each type

**Acceptance Criteria**:
- Decision criteria are clear and actionable
- Examples reference actual files:
  - Unit: `__tests__/unit/currency.test.ts` - "Test formatCurrency() utility"
  - Integration: `__tests__/integration/gig-creation.test.ts` - "Test createGig server action with database"
  - E2E: `__tests__/e2e/registration.spec.ts` - "Test complete registration workflow in browser"
- Performance characteristics are mentioned (speed)
- Guidelines help developers make informed decisions
- Trade-offs are mentioned (speed vs coverage)
- Verify referenced files exist

#### Scenario: Documentation references test helpers with exact signatures

**Given** a developer wants to use test helpers
**When** they read the test helpers section
**Then** the documentation SHALL list all available helpers (`__tests__/helpers/db.ts`, `seed.ts`, `auth.ts`, `auth-mocks.ts`)
**And** the documentation SHALL provide exact TypeScript function signatures for key helpers
**And** the documentation SHALL explain the purpose of each helper module
**And** the documentation SHALL provide usage examples for common helper functions
**And** the documentation SHALL reference `TESTING.md` for comprehensive documentation

**Acceptance Criteria**:
- All helper modules are listed with descriptions
- Key functions include exact TypeScript signatures:
  - `db.ts`: `getTestPrismaClient(): PrismaClient`, `withTestTransaction<T>(callback: (tx: PrismaClient) => Promise<T>): Promise<T>`
  - `seed.ts`: `createTestUser(tx: PrismaClient, overrides?: Partial<UserData>): Promise<User>`, `createTestGig(tx: PrismaClient, overrides?: Partial<GigData>): Promise<Gig>`
  - `auth.ts`: `withAuthContext(user: User, callback: () => Promise<void>): Promise<void>`, `createAuthenticatedClient(tx: PrismaClient, overrides?: Partial<UserData>): Promise<{ user: User, session: string }>`
- At least 2 code examples showing helper usage from actual tests
- Reference to `TESTING.md` for comprehensive documentation
- Examples are realistic and follow existing patterns
- Verify helper files exist and functions are exported

#### Scenario: Documentation includes mocking patterns

**Given** a developer needs to mock Next.js APIs in tests
**When** they read the mocking patterns section
**Then** the documentation SHALL document the standard mocking pattern for `@/lib/prisma`
**And** the documentation SHALL document the standard mocking pattern for `next/headers` (cookies)
**And** the documentation SHALL document the standard mocking pattern for `next/navigation` (redirect)
**And** the documentation SHALL provide complete code examples from actual test files

**Acceptance Criteria**:
- Mocking patterns for all three Next.js APIs are documented
- Examples show exact mock setup from `__tests__/integration/gig-creation.test.ts`:
  - `vi.mock('@/lib/prisma', () => ({ get prisma() { return getTestPrismaClient() } }))`
  - `vi.mock('next/headers', () => ({ cookies: vi.fn(() => ({ get, set, delete })) }))`
  - `vi.mock('next/navigation', () => ({ redirect: vi.fn((url) => { throw new Error(\`NEXT_REDIRECT:\${url}\`) }) }))`
- Explanation of why each mock is needed
- Note about mock order (mocks before imports)
- Examples are copy-pasteable

**Given** a developer reads the documentation
**When** they want to see example test structure
**Then** the documentation SHALL include at least 3 complete code examples
**And** examples SHALL cover unit test structure
**And** examples SHALL cover integration test structure with database transaction
**And** examples SHALL cover E2E test structure with Playwright
**And** examples SHALL be realistic and follow existing conventions

**Acceptance Criteria**:
- At least 3 complete, runnable code examples
- Examples demonstrate:
  1. Simple unit test with assertions
  2. Integration test with `withTestTransaction()` and `createTestUser()`
  3. E2E test with Playwright page navigation and assertions
- Examples use actual helper functions from codebase
- Examples follow existing code style and patterns
- Examples are properly formatted with syntax highlighting

#### Scenario: Documentation is accurate and up-to-date

**Given** the documentation references files, directories, and helpers
**When** a developer follows the documentation
**Then** all file paths SHALL be correct and exist in the codebase
**And** all helper function names and signatures SHALL be correct
**And** all code examples SHALL be valid and follow current patterns
**And** no broken references or outdated information SHALL exist
**And** file count statistics SHALL match actual codebase

**Acceptance Criteria**:
- All file paths verified to exist: `__tests__/unit/`, `__tests__/integration/`, `__tests__/e2e/`, `__tests__/helpers/`
- All helper functions verified to exist with correct signatures:
  ```bash
  grep "export.*getTestPrismaClient" __tests__/helpers/db.ts
  grep "export.*withTestTransaction" __tests__/helpers/db.ts
  grep "export.*createTestUser" __tests__/helpers/seed.ts
  grep "export.*createTestGig" __tests__/helpers/seed.ts
  grep "export.*withAuthContext" __tests__/helpers/auth.ts
  grep "export.*createAuthenticatedClient" __tests__/helpers/auth.ts
  ```
- Code examples are syntactically valid TypeScript
- Examples can be copy-pasted and run successfully
- No references to deprecated or removed features
- File count statistics verified:
  ```bash
  ls __tests__/integration/*.test.ts | wc -l  # Should be ~26
  ls __tests__/unit/*.test.ts | wc -l         # Should be ~2
  ls __tests__/e2e/*.spec.ts | wc -l          # Should be ~2
  ```
