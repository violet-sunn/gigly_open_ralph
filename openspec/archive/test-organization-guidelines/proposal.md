# Change Proposal: Test Organization Guidelines

## Problem Statement

The project currently has two distinct types of test-related files that serve different purposes:

1. **Real tests** in `__tests__/` using Vitest framework with proper assertions, database isolation, and test helpers
2. **Legacy build verification scripts** in `scripts/legacy-tests/` using custom `pass()`/`fail()` functions

This dual structure creates confusion for developers:
- Unclear where to write new tests
- Ambiguity about what constitutes a "real test" vs a verification script
- No clear guidance on test organization within `__tests__/` directory
- Missing documentation on when to write unit vs integration vs E2E tests
- Test helpers and utilities are not well-documented

## Proposed Solution

**Documentation Location:** `__tests__/README.md`

Create comprehensive documentation that serves as the single source of truth for test organization standards. This documentation will:

1. **Clarify the distinction** between real tests (Vitest) and legacy verification scripts
2. **Document directory structure** and naming conventions
3. **Provide clear guidelines** on test type selection (unit/integration/E2E)
4. **Document AAA pattern** (Arrange-Act-Assert) as mandatory test structure
5. **Reference available test helpers** and utilities with usage examples
6. **Include concrete examples** from actual codebase tests

### MUST Reference These Actual Files

**Integration Test Examples:**
- `__tests__/integration/gig-creation.test.ts` - Server action with database (40 tests)
- `__tests__/integration/gig-authorization.test.ts` - Authorization patterns
- `__tests__/integration/application-flow.test.ts` - Complex multi-step workflow (30 tests)
- `__tests__/integration/messaging.test.ts` - Gig-scoped messaging
- `__tests__/integration/payment-display.test.ts` - Display logic testing

**Unit Test Examples:**
- `__tests__/unit/currency.test.ts` - Pure utility functions
- `__tests__/unit/session.test.ts` - Session utilities

**E2E Test Examples:**
- `__tests__/e2e/registration.spec.ts` - Browser-based user registration
- `__tests__/e2e/auth-session.spec.ts` - Authentication flows

**Test Helpers:**
- `__tests__/helpers/db.ts` - Database utilities (`getTestPrismaClient()`, `withTestTransaction()`)
- `__tests__/helpers/seed.ts` - Mock data factories (`createTestUser()`, `createTestGig()`, `createTestApplication()`)
- `__tests__/helpers/auth.ts` - Authentication helpers (`withAuthContext()`, `createAuthenticatedClient()`, `setE2ESession()`)
- `__tests__/helpers/auth-mocks.ts` - Mock implementations for Next.js APIs

**Setup:**
- `__tests__/setup.ts` - Global test configuration and database initialization

### Actual Directory Structure

```
__tests__/
├── integration/          # Server actions + DB (95% of tests, ~26 files)
│   ├── gig-*.test.ts    # Gig lifecycle tests
│   ├── application-*.test.ts
│   ├── messaging.test.ts
│   ├── auth*.test.ts
│   └── admin-*.test.ts
├── unit/                 # Pure functions, no DB (~2 files)
│   ├── currency.test.ts
│   └── session.test.ts
├── e2e/                  # Playwright browser tests (~2 files)
│   ├── registration.spec.ts
│   └── auth-session.spec.ts
├── helpers/              # Test utilities (4 files)
│   ├── db.ts            # Database isolation
│   ├── seed.ts          # Mock data factories
│   ├── auth.ts          # Auth helpers
│   └── auth-mocks.ts    # Next.js mocks
└── setup.ts              # Global setup
```

### README.md Outline

```markdown
# Gigly Testing Standards

## 1. Where to Write Tests
## 2. Directory Structure
## 3. Naming Conventions
## 4. Test Types (Unit/Integration/E2E)
## 5. AAA Pattern (Arrange-Act-Assert)
## 6. Test Helpers Reference
## 7. Common Mocking Patterns
## 8. Running Tests
## 9. Example Tests
```

## Goals

- ✅ Eliminate confusion about where to write tests
- ✅ Establish clear naming conventions (*.test.ts for unit/integration, *.spec.ts for E2E)
- ✅ Document test organization patterns that already exist in the codebase
- ✅ Make test helpers discoverable and easy to use
- ✅ Provide actionable guidance for developers writing new tests
- ✅ Mandate AAA pattern (Arrange-Act-Assert) for all tests
- ✅ Document common mocking patterns (Next.js APIs, Prisma, navigation)

## Non-Goals

- ❌ Rewriting or refactoring existing tests
- ❌ Migrating legacy scripts to Vitest (they are archived for historical reference)
- ❌ Changing the testing framework or infrastructure
- ❌ Adding new test helpers or utilities (document existing ones only)

## Constraints

- Documentation MUST be in English (technical documentation standard)
- Documentation MUST reference actual files and patterns from the codebase
- Examples MUST be realistic and follow existing conventions
- Documentation MUST be concise and scannable (developers read docs quickly)
- All test examples MUST follow AAA pattern (Arrange-Act-Assert)
- Documentation MUST include exact helper function signatures from `__tests__/helpers/`

## Success Criteria

1. A developer new to the project can read `__tests__/README.md` and understand:
   - Where to write tests
   - What naming convention to use
   - Which test type to choose (unit/integration/E2E)
   - How to use test helpers (db, seed, auth)
   - How to structure tests using AAA pattern
   - How to mock Next.js APIs (cookies, redirect, prisma)

2. Documentation is comprehensive but concise (target: **150-250 lines**)
   - Scannable reference manual, not verbose tutorial
   - Code examples over prose explanations
   - Quick lookup for common patterns

3. Documentation includes at least 3 concrete AAA-pattern code examples from actual tests:
   - Unit test: `__tests__/unit/currency.test.ts`
   - Integration test: `__tests__/integration/gig-creation.test.ts`
   - E2E test: `__tests__/e2e/registration.spec.ts`

4. All references to files, directories, and helpers are accurate and verified

5. Documentation includes helper function signatures with TypeScript types
