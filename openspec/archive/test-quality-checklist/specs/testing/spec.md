# Testing Specification Delta

## ADDED Requirements

### Requirement: Test Quality Checklist Document

The platform SHALL provide a test quality checklist document at `TESTING_CHECKLIST.md` in the project root that developers can use to self-review test quality before committing code.

#### Scenario: Developer reads test quality checklist

**Given** a developer has written tests and wants to verify quality
**When** they open `TESTING_CHECKLIST.md`
**Then** the document SHALL provide a concise checklist (50-80 items) organized by concern
**And** each item SHALL be actionable with clear yes/no answer
**And** the document SHALL include sections for: test isolation, mocking, naming/organization, flakiness prevention, coverage expectations, and anti-patterns
**And** the document SHALL reference specific examples from the codebase
**And** the document SHALL link to `TESTING.md` and `__tests__/README.md` for detailed guidance

**Acceptance Criteria:**
- `TESTING_CHECKLIST.md` exists in project root
- Document is 1-2 pages (target: 200-400 lines including whitespace)
- All checklist items use checkbox format `- [ ] Item description`
- Each section has 5-15 actionable items
- Document includes at least 3 specific code examples from actual test files
- Document includes links to relevant sections in `TESTING.md`
- Run `cat TESTING_CHECKLIST.md | wc -l` and verify line count is reasonable

#### Scenario: Checklist includes test isolation section

**Given** the test quality checklist document
**When** a developer reads the "Test Isolation" section
**Then** the section SHALL include checklist items for:
- Using `withTestTransaction()` for database isolation
- Avoiding shared mutable state between tests
- Verifying tests pass individually and in parallel
- Avoiding hardcoded IDs or timestamps that could collide
- Cleaning up test session tokens between tests
**And** the section SHALL include at least one code example from actual tests

**Acceptance Criteria:**
- "Test Isolation" section exists with clear heading
- Section includes 5-10 actionable checklist items
- Items reference `withTestTransaction()`, `setTestSessionToken(undefined)`, and parallel execution
- At least one code example shows proper isolation pattern
- Items are specific and verifiable (not vague)

#### Scenario: Checklist includes mocking section

**Given** the test quality checklist document
**When** a developer reads the "Proper Mocking" section
**Then** the section SHALL include checklist items for:
- Mocking `next/headers` for session tests
- Mocking `@/lib/prisma` to use test database
- Mocking `next/navigation` redirect to throw `NEXT_REDIRECT` error
- Avoiding real network requests (mock external APIs)
- Placing mocks before imports
**And** the section SHALL reference actual mock patterns from integration tests

**Acceptance Criteria:**
- "Proper Mocking" section exists
- Section includes 5-10 checklist items covering Next.js APIs and external services
- Items reference specific mock patterns from `__tests__/integration/*.test.ts`
- At least one code example shows correct mock setup
- Items explain WHY mocking is needed (not just WHAT to mock)

#### Scenario: Checklist includes naming and organization section

**Given** the test quality checklist document
**When** a developer reads the "Test Naming and Organization" section
**Then** the section SHALL include checklist items for:
- Placing tests in correct directory (`__tests__/unit/`, `__tests__/integration/`, `__tests__/e2e/`)
- Using correct file extensions (`.test.ts` for unit/integration, `.spec.ts` for E2E)
- Following AAA pattern (Arrange-Act-Assert)
- Using descriptive test names that explain what is being tested
- Organizing tests with `describe()` blocks for related scenarios
**And** the section SHALL reference `__tests__/README.md` for detailed organization guidelines

**Acceptance Criteria:**
- "Test Naming and Organization" section exists
- Section includes 5-10 checklist items
- Items reference directory structure and naming conventions
- Items mandate AAA pattern usage
- Link to `__tests__/README.md` is included

#### Scenario: Checklist includes flakiness prevention section

**Given** the test quality checklist document
**When** a developer reads the "Avoiding Flaky Tests" section
**Then** the section SHALL include checklist items for:
- Using deterministic test data (no random values without seeds)
- Avoiding timing dependencies (no `setTimeout` without proper waits)
- Properly waiting for async operations to complete
- Using unique identifiers to avoid collisions
- Avoiding tests that depend on external state or timing
**And** the section SHALL provide examples of common flakiness causes

**Acceptance Criteria:**
- "Avoiding Flaky Tests" section exists
- Section includes 5-10 checklist items
- Items address timing, randomness, and async operations
- At least one example shows how to avoid flakiness
- Items are specific and actionable

#### Scenario: Checklist includes coverage expectations section

**Given** the test quality checklist document
**When** a developer reads the "Test Coverage Expectations" section
**Then** the section SHALL include checklist items for:
- Testing happy path (successful operations)
- Testing error cases (validation failures, authorization errors)
- Testing edge cases (empty inputs, boundary values)
- Testing authorization (role-based and ownership-based access control)
- Testing database constraints (unique violations, foreign key constraints)
**And** the section SHALL reference comprehensive test suites as examples

**Acceptance Criteria:**
- "Test Coverage Expectations" section exists
- Section includes 5-10 checklist items
- Items cover happy path, error cases, edge cases, and security
- Items reference actual test files that demonstrate good coverage
- Items are specific about what to test (not just "test everything")

#### Scenario: Checklist includes anti-patterns section

**Given** the test quality checklist document
**When** a developer reads the "What NOT to Do" section
**Then** the section SHALL include anti-patterns such as:
- Creating `test-*.ts` files in `scripts/` directory (use `__tests__/` instead)
- Leaving `console.log()` debugging statements in tests
- Committing `it.only()` or `describe.only()` that skip other tests
- Writing tests that depend on execution order
- Using real database or external services in tests
- Mixing `select` and `include` in Prisma queries
**And** the section SHALL explain WHY each anti-pattern is problematic

**Acceptance Criteria:**
- "What NOT to Do" section exists with clear heading
- Section includes 8-12 anti-pattern items
- Each item explains the problem and the correct alternative
- Items reference actual issues encountered in the project
- Section includes reference to `scripts/legacy-tests/` as example of what to avoid

#### Scenario: Checklist is actionable and specific

**Given** any checklist item in the document
**When** a developer reads the item
**Then** the item SHALL be verifiable with a clear yes/no answer
**And** the item SHALL be specific (not vague like "write good tests")
**And** the item SHALL reference concrete patterns, functions, or files when applicable

**Acceptance Criteria:**
- All checklist items use checkbox format `- [ ] Description`
- No vague items like "tests should be good" or "follow best practices"
- Items reference specific functions (`withTestTransaction`, `createTestUser`, etc.)
- Items reference specific files or patterns from the codebase
- A developer can answer yes/no to each item without ambiguity

#### Scenario: Checklist links to comprehensive documentation

**Given** the test quality checklist document
**When** a developer needs more detailed guidance
**Then** the document SHALL include links to:
- `TESTING.md` for comprehensive testing guide
- `__tests__/README.md` for test organization standards
- Specific sections in `TESTING.md` for topics like authentication testing, mocking patterns, and factories
**And** links SHALL be placed at the top of the document and in relevant sections

**Acceptance Criteria:**
- Document includes "For detailed guidance, see:" section at the top
- Links to `TESTING.md` and `__tests__/README.md` are present
- At least 3 section-specific links to `TESTING.md` are included
- All links use relative paths and are valid
- Verify links work: `ls TESTING.md __tests__/README.md` shows both files exist

#### Scenario: Checklist includes code examples

**Given** the test quality checklist document
**When** a developer reads any section
**Then** the document SHALL include at least 3 code examples from actual test files
**And** examples SHALL demonstrate correct patterns (not anti-patterns)
**And** examples SHALL be properly formatted with syntax highlighting
**And** examples SHALL include file references (e.g., "from `__tests__/integration/gig-creation.test.ts`")

**Acceptance Criteria:**
- Document includes at least 3 code examples in markdown code blocks
- Examples use TypeScript syntax highlighting (```typescript)
- Examples are taken from actual test files in the codebase
- Each example includes a comment or caption explaining what it demonstrates
- Examples are concise (5-15 lines each)
- Verify examples exist in referenced files

---

## MODIFIED Requirements

### Requirement: Test Documentation

The platform's testing documentation SHALL reference the test quality checklist as a quick reference tool.

#### Scenario: TESTING.md references checklist

**Given** `TESTING.md` exists
**When** a developer reads the testing documentation
**Then** the document SHALL include a reference to `TESTING_CHECKLIST.md` in the "Overview" or "Best Practices" section
**And** the reference SHALL explain that the checklist is a quick self-review tool
**And** the reference SHALL direct developers to use the checklist before committing tests

**Acceptance Criteria:**
- `TESTING.md` includes a section or paragraph mentioning `TESTING_CHECKLIST.md`
- Reference explains the purpose of the checklist (quick self-review)
- Reference is placed in a prominent location (near the top or in "Best Practices")
- Link to `TESTING_CHECKLIST.md` is included
- Verify: `grep -i "checklist" TESTING.md` shows the reference
