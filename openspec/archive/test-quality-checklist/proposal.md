# Change Proposal: Test Quality Checklist

## Problem Statement

The platform has comprehensive testing infrastructure (Vitest, Playwright, test helpers, factories), but developers still encounter common test quality issues:

- **Test isolation failures**: Tests that pass individually but fail when run together due to shared state
- **Flaky tests**: Tests that intermittently fail due to timing issues, improper mocking, or race conditions
- **Poor test organization**: Tests scattered across wrong directories, inconsistent naming conventions
- **Inadequate mocking**: Tests that don't properly mock Next.js APIs or external dependencies
- **Coverage gaps**: Critical paths untested, edge cases ignored
- **Anti-patterns**: Legacy test scripts in wrong locations (e.g., `scripts/test-*.ts`), tests that don't follow AAA pattern

While `TESTING.md` provides comprehensive documentation, developers need a **quick reference checklist** they can consult before committing tests to catch issues early.

## Proposed Solution

Create `TESTING_CHECKLIST.md` in the project root as a concise, actionable checklist that developers can use to self-review test quality before submitting code. The checklist will:

1. **Provide quick yes/no checks** for common quality issues
2. **Reference specific examples** from the codebase
3. **Include "What NOT to do"** section with anti-patterns
4. **Be organized by concern** (isolation, mocking, naming, flakiness, coverage)
5. **Link to TESTING.md** for detailed guidance

## Scope

### In Scope
- Create `TESTING_CHECKLIST.md` in project root
- Checklist sections for:
  - Test isolation (no shared state between tests)
  - Proper mocking (Next.js APIs, Prisma, external services)
  - Test naming and organization (file placement, naming conventions)
  - Avoiding flaky tests (timing, race conditions, deterministic data)
  - Test coverage expectations (critical paths, edge cases, error handling)
  - Anti-patterns (what NOT to do)
- Actionable items with yes/no checkboxes
- Links to relevant sections in `TESTING.md` and `__tests__/README.md`

### Out of Scope
- Automated enforcement of checklist items (linting, pre-commit hooks)
- Detailed testing tutorials (already in `TESTING.md`)
- Test coverage thresholds configuration (separate concern)
- CI/CD integration (separate change)

## Constraints

- Checklist MUST be concise (target: 1-2 pages, ~50-80 checklist items)
- Each item MUST be actionable (clear yes/no answer)
- Checklist MUST reference existing documentation (not duplicate it)
- Checklist MUST include specific examples from the codebase
- Checklist MUST be maintainable (not too granular, not too abstract)

## Non-Goals

- This is NOT a replacement for `TESTING.md` (it's a quick reference)
- This is NOT automated tooling (it's a manual checklist)
- This is NOT a testing tutorial (it assumes familiarity with testing concepts)
- This is NOT a style guide (it focuses on quality and correctness)

## Success Metrics

- Reduction in test-related PR comments about isolation, flakiness, or organization
- Developers report using the checklist before submitting PRs
- Fewer test failures in CI due to common quality issues
- New contributors can self-review test quality without extensive guidance

## Example Checklist Items

**Test Isolation:**
- [ ] Each test runs in isolated transaction (`withTestTransaction`)
- [ ] No shared mutable state between tests
- [ ] Tests pass when run individually and in parallel
- [ ] No hardcoded IDs or timestamps that could collide

**Mocking:**
- [ ] `next/headers` mocked for tests using `getSession()`
- [ ] `@/lib/prisma` mocked to use test database
- [ ] `next/navigation` redirect mocked to throw `NEXT_REDIRECT` error
- [ ] External API calls mocked (no real network requests)

**Anti-Patterns:**
- [ ] No `test-*.ts` files in `scripts/` directory (use `__tests__/` instead)
- [ ] No `console.log()` debugging statements left in tests
- [ ] No `it.only()` or `describe.only()` committed
- [ ] No tests that depend on execution order
