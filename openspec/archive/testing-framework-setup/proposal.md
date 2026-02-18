# Change Proposal: Testing Framework Setup

## Change ID
`testing-framework-setup`

## Status
PROPOSED

## Context

The Gigly platform currently has no automated testing infrastructure. As the codebase grows and more features are added, the lack of tests creates significant risk:

- **Regression risk**: Changes to existing features can break functionality without detection
- **Refactoring friction**: Developers hesitate to improve code structure without test coverage
- **Deployment confidence**: No automated validation before production releases
- **Documentation gap**: Tests serve as executable documentation of expected behavior

The platform has reached a maturity level where core workflows (gig lifecycle, applications, messaging, admin moderation) are implemented and stable. This is the ideal time to establish a testing foundation before further feature development.

## Problem Statement

Without automated tests, the team cannot:
1. Verify that new changes don't break existing functionality
2. Confidently refactor code to improve maintainability
3. Validate complex user flows (e.g., full gig lifecycle from creation to payment)
4. Ensure edge cases are handled correctly (e.g., authorization checks, validation logic)
5. Measure code coverage to identify untested critical paths

## Proposed Solution

Implement a comprehensive testing framework with two complementary layers:

### 1. Unit & Integration Tests (Vitest)
- **Purpose**: Test individual functions, components, server actions, and API routes
- **Tool**: Vitest (fast, modern, excellent TypeScript support, compatible with Next.js)
- **Scope**: Business logic, data layer (Prisma queries), server actions, utility functions
- **Speed**: Fast feedback loop (< 5 seconds for full suite)

### 2. End-to-End Tests (Playwright)
- **Purpose**: Test complete user workflows from browser perspective
- **Tool**: Playwright (industry standard, multi-browser support, excellent debugging)
- **Scope**: Critical user journeys (registration → gig creation → application → approval)
- **Speed**: Slower but comprehensive (run before deployment)

### Configuration Approach

**Test Database Strategy**:
- Use separate SQLite database for tests (`test.db`)
- Reset database state before each test suite
- Seed with minimal test fixtures

**Environment Variables**:
- `.env.test` file for test-specific configuration
- `DATABASE_URL` pointing to test database
- `SESSION_SECRET` for JWT testing

**Code Coverage**:
- Vitest coverage via `@vitest/coverage-v8`
- Target: 70%+ coverage for critical paths (auth, gig lifecycle, payments)
- HTML reports for visualization

**Test Organization**:
```
__tests__/
  unit/           # Pure functions, utilities
  integration/    # Server actions, API routes, database queries
  e2e/            # Playwright browser tests
  fixtures/       # Shared test data
  helpers/        # Test utilities
```

## Constraints

### Technical Constraints
- MUST work with Next.js 15 App Router (server components, server actions)
- MUST support TypeScript strict mode
- MUST use existing Prisma schema (no test-specific schema changes)
- MUST run in CI/CD pipeline (GitHub Actions compatible)
- MUST NOT require external services (use SQLite for test database)

### Scope Constraints
- This change focuses on **framework setup and configuration only**
- Writing comprehensive tests for existing features is **out of scope** (future work)
- Only **one example test per layer** (unit, integration, E2E) to verify setup
- Performance optimization of test suite is **deferred** (acceptable for MVP)

### Non-Goals
- ❌ Achieving high code coverage immediately (incremental goal)
- ❌ Testing every existing feature (will be done iteratively)
- ❌ Visual regression testing (Chromatic, Percy) - post-MVP
- ❌ Load/performance testing - post-MVP
- ❌ Mocking external APIs (none exist yet)

## Success Criteria

The testing framework setup is complete when:

1. ✅ Vitest is installed and configured for Next.js 15
2. ✅ Playwright is installed and configured
3. ✅ Test scripts work: `npm test`, `npm run test:unit`, `npm run test:e2e`, `npm run test:coverage`
4. ✅ Test database setup is automated (reset + seed)
5. ✅ Environment variables are configured for test mode
6. ✅ Example tests pass successfully:
   - Unit test: utility function
   - Integration test: server action with database
   - E2E test: user registration flow
7. ✅ Coverage report generates successfully
8. ✅ Documentation exists for writing and running tests

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vitest incompatibility with Next.js 15 App Router | High | Use `next-test-utils` or custom setup, research community solutions |
| Test database conflicts with dev database | Medium | Use separate `test.db` file, clear documentation |
| Slow E2E tests block development | Medium | Run E2E tests only in CI, keep unit tests fast |
| Developers don't write tests | High | Provide clear examples, document patterns, make it easy |

## Dependencies

- No blocking dependencies on other changes
- This change enables future test-driven development for new features

## Estimated Effort

- **Setup & Configuration**: 4-6 hours
- **Example Tests**: 2-3 hours
- **Documentation**: 1-2 hours
- **Total**: 7-11 hours (1-2 days)

## Rollout Plan

1. Install dependencies (Vitest, Playwright, coverage tools)
2. Configure Vitest for Next.js
3. Configure Playwright
4. Set up test database and environment
5. Create example tests
6. Update package.json scripts
7. Document testing guidelines
8. Commit and verify in CI (if CI exists)

## Future Work (Post-Setup)

- Write tests for existing features (gig lifecycle, auth, messaging)
- Add pre-commit hooks to run tests (Husky)
- Set up CI/CD pipeline with test gates
- Increase coverage targets progressively
- Add visual regression testing for UI components
