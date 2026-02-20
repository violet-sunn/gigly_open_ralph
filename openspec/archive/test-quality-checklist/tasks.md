# Implementation Tasks

## Task 1: Create TESTING_CHECKLIST.md with comprehensive checklist

**Description:**
Create `TESTING_CHECKLIST.md` in the project root with a concise, actionable checklist covering test isolation, mocking, naming/organization, flakiness prevention, coverage expectations, and anti-patterns.

**Implementation Notes:**
- Create file at project root: `TESTING_CHECKLIST.md`
- Target length: 200-400 lines (1-2 pages when rendered)
- Use checkbox format for all items: `- [ ] Item description`
- Include 6 main sections with 5-15 items each (target: 50-80 total items)
- Include at least 3 code examples from actual test files
- Add links to `TESTING.md` and `__tests__/README.md`
- Reference specific functions, files, and patterns from the codebase

**Structure:**
```markdown
# Test Quality Checklist

> Quick reference for self-reviewing test quality before committing code.
> For comprehensive guidance, see [TESTING.md](./TESTING.md) and [__tests__/README.md](./__tests__/README.md).

## Test Isolation
- [ ] Each test runs in isolated transaction using `withTestTransaction()`
- [ ] No shared mutable state between tests
- [ ] Tests pass when run individually: `npm run test:unit -- path/to/test.test.ts`
- [ ] Tests pass when run in parallel: `npm run test:unit` (with `fileParallelism: true`)
- [ ] No hardcoded IDs that could collide across tests
- [ ] Test session tokens cleaned up: `setTestSessionToken(undefined)` in `beforeEach`
- [ ] Factory functions use unique identifiers (timestamps, random suffixes)
- [ ] No database state leaks between tests (verify with transaction rollback)

## Proper Mocking
- [ ] `next/headers` mocked for tests using `getSession()` (see example below)
- [ ] `@/lib/prisma` mocked to use test database: `vi.mock('@/lib/prisma', () => ({ get prisma() { return getTestPrismaClient() } }))`
- [ ] `next/navigation` redirect mocked: `vi.mock('next/navigation', () => ({ redirect: vi.fn((url) => { throw new Error(\`NEXT_REDIRECT:\${url}\`) }) }))`
- [ ] External API calls mocked (no real network requests)
- [ ] Mocks placed BEFORE imports (Vitest hoisting requirement)
- [ ] Mock cleanup in `afterEach` if needed
- [ ] No real file system operations (use in-memory or mocked fs)

## Test Naming and Organization
- [ ] Tests in correct directory: `__tests__/unit/`, `__tests__/integration/`, or `__tests__/e2e/`
- [ ] Correct file extension: `.test.ts` for unit/integration, `.spec.ts` for E2E
- [ ] File named after feature/module being tested (e.g., `gig-creation.test.ts`)
- [ ] Tests follow AAA pattern: Arrange → Act → Assert
- [ ] Test names describe what is being tested: `it('CLIENT can create gig with valid data', ...)`
- [ ] Related tests grouped in `describe()` blocks
- [ ] No `test-*.ts` files in `scripts/` directory (use `__tests__/` instead)

## Avoiding Flaky Tests
- [ ] No random values without seeds (use deterministic test data)
- [ ] No `setTimeout()` without proper async waits
- [ ] All async operations properly awaited
- [ ] Unique identifiers to avoid collisions (timestamps, UUIDs, counters)
- [ ] No tests depending on external state (time, network, file system)
- [ ] No tests depending on execution order
- [ ] Playwright tests use proper waits: `await page.waitForSelector()`, not arbitrary delays
- [ ] Database operations complete before assertions

## Test Coverage Expectations
- [ ] Happy path tested (successful operations)
- [ ] Error cases tested (validation failures, not found errors)
- [ ] Authorization tested (role-based: CLIENT/SPECIALIST/ADMIN)
- [ ] Ownership tested (users can only modify their own resources)
- [ ] Edge cases tested (empty inputs, boundary values, null/undefined)
- [ ] Database constraints tested (unique violations, foreign keys)
- [ ] Redirect behavior tested (catch `NEXT_REDIRECT` errors)
- [ ] All server action return paths covered (success and error)

## What NOT to Do (Anti-Patterns)
- [ ] ❌ No `test-*.ts` files in `scripts/` directory → Use `__tests__/` instead
- [ ] ❌ No `console.log()` debugging statements → Remove before committing
- [ ] ❌ No `it.only()` or `describe.only()` → Runs only one test, skips others
- [ ] ❌ No tests depending on execution order → Each test must be independent
- [ ] ❌ No real database in tests → Use `getTestPrismaClient()` with transactions
- [ ] ❌ No mixing `select` and `include` in Prisma queries → Causes validation errors
- [ ] ❌ No hardcoded dates/times → Use `new Date()` or factories
- [ ] ❌ No skipped tests without TODO comment → Fix or document why skipped
- [ ] ❌ No empty test files → Remove or implement
- [ ] ❌ No tests without assertions → Every test must verify something

## Code Examples

### Example 1: Proper Test Isolation with Transaction
From `__tests__/integration/gig-creation.test.ts`:
```typescript
import { withTestTransaction } from '../helpers/db'
import { createTestUser } from '../helpers/seed'

it('creates gig with valid data', async () => {
  await withTestTransaction(async (tx) => {
    // Arrange: Create test user
    const client = await createTestUser(tx, { role: 'CLIENT' })

    // Act: Create gig
    const gig = await tx.gig.create({
      data: { title: 'Test Gig', clientId: client.id, ... }
    })

    // Assert: Verify gig created
    expect(gig.title).toBe('Test Gig')

    // Transaction automatically rolls back - no cleanup needed
  })
})
```

### Example 2: Proper Mocking Setup
From `__tests__/integration/gig-creation.test.ts`:
```typescript
import { vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { getTestSessionToken } from '../helpers/auth'

// Mock @/lib/prisma BEFORE imports
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))

// Mock next/headers for session management
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn(),
    delete: vi.fn()
  }))
}))

// Now import server actions
import { createGig } from '@/app/actions/gig'
```

### Example 3: Testing Authorization
From `__tests__/integration/gig-authorization.test.ts`:
```typescript
import { withAuthContext } from '../helpers/auth'
import { createAuthenticatedClient, createAuthenticatedSpecialist } from '../helpers/auth'

it('only CLIENT can create gigs', async () => {
  await withTestTransaction(async (tx) => {
    const { user: client } = await createAuthenticatedClient(tx)
    const { user: specialist } = await createAuthenticatedSpecialist(tx)

    // CLIENT can create gig
    await withAuthContext(client, async () => {
      const result = await createGig(null, formData)
      expect(result.error).toBeUndefined()
    })

    // SPECIALIST cannot create gig
    await withAuthContext(specialist, async () => {
      const result = await createGig(null, formData)
      expect(result.error).toContain('Only clients can create gigs')
    })
  })
})
```

## Quick Reference Links

- **Comprehensive Testing Guide**: [TESTING.md](./TESTING.md)
- **Test Organization Standards**: [__tests__/README.md](./__tests__/README.md)
- **Authentication Testing**: [TESTING.md - Testing Authenticated Features](./TESTING.md#testing-authenticated-features)
- **Mock Data Factories**: [TESTING.md - Mock Data Factories](./TESTING.md#mock-data-factories)
- **Common Mocking Patterns**: [__tests__/README.md - Mocking Patterns](./__tests__/README.md#mocking-patterns)

## Before You Commit

Run through this checklist:
1. ✅ All tests pass locally: `npm run test:unit`
2. ✅ Tests pass in parallel (no isolation issues)
3. ✅ No `console.log()` or debugging code left in tests
4. ✅ No `it.only()` or `describe.only()` committed
5. ✅ All new code has corresponding tests
6. ✅ Tests follow AAA pattern and are well-named
7. ✅ Mocks are properly set up for Next.js APIs
8. ✅ Test data is deterministic and isolated
```

**Files to Create:**
- `TESTING_CHECKLIST.md`

**Test Plan:**
1. Create the file and verify it exists: `ls TESTING_CHECKLIST.md`
2. Verify line count is reasonable: `cat TESTING_CHECKLIST.md | wc -l` (should be 200-400 lines)
3. Verify all sections are present:
   ```bash
   grep "## Test Isolation" TESTING_CHECKLIST.md
   grep "## Proper Mocking" TESTING_CHECKLIST.md
   grep "## Test Naming and Organization" TESTING_CHECKLIST.md
   grep "## Avoiding Flaky Tests" TESTING_CHECKLIST.md
   grep "## Test Coverage Expectations" TESTING_CHECKLIST.md
   grep "## What NOT to Do" TESTING_CHECKLIST.md
   ```
4. Verify code examples are present: `grep -c "```typescript" TESTING_CHECKLIST.md` (should be at least 3)
5. Verify links to other docs: `grep "TESTING.md" TESTING_CHECKLIST.md` and `grep "__tests__/README.md" TESTING_CHECKLIST.md`
6. Verify checkbox format: `grep -c "^- \[ \]" TESTING_CHECKLIST.md` (should be 50-80)
7. Verify referenced files exist:
   ```bash
   ls __tests__/integration/gig-creation.test.ts
   ls __tests__/integration/gig-authorization.test.ts
   ls __tests__/helpers/db.ts
   ls __tests__/helpers/auth.ts
   ls __tests__/helpers/seed.ts
   ```
8. Read through the checklist and verify all items are actionable and specific
9. Verify no vague items like "write good tests" or "follow best practices"
10. Verify anti-patterns section references `scripts/legacy-tests/` as example

---

## Task 2: Update TESTING.md to reference checklist

**Description:**
Add a reference to `TESTING_CHECKLIST.md` in the `TESTING.md` file to direct developers to use the checklist for quick self-review.

**Implementation Notes:**
- Open `TESTING.md`
- Add a new section or paragraph in the "Overview" section (near the top)
- Include a clear link to `TESTING_CHECKLIST.md`
- Explain that the checklist is a quick reference for self-reviewing test quality
- Position the reference prominently so developers see it early

**Content to Add:**
```markdown
## Quick Reference

Before committing tests, use the [Test Quality Checklist](./TESTING_CHECKLIST.md) to self-review for common issues:
- Test isolation and parallel execution
- Proper mocking of Next.js APIs
- Naming conventions and organization
- Flakiness prevention
- Coverage expectations
- Anti-patterns to avoid

The checklist provides a quick yes/no review. For comprehensive guidance, continue reading this document.
```

**Files to Modify:**
- `TESTING.md`

**Test Plan:**
1. Open `TESTING.md` and verify the new section is present
2. Verify the link to `TESTING_CHECKLIST.md` works: `ls TESTING_CHECKLIST.md`
3. Verify the reference is in the "Overview" section or near the top
4. Verify the reference explains the purpose of the checklist
5. Run: `grep -i "checklist" TESTING.md` and verify the reference appears
6. Read the updated `TESTING.md` and verify the flow makes sense
7. Verify the reference doesn't duplicate content (it should just point to the checklist)

---

## Task 3: Manual validation and review

**Description:**
Perform end-to-end validation to ensure the checklist is comprehensive, actionable, and accurate.

**Test Plan:**

### 1. Completeness Check
- [ ] Read through entire `TESTING_CHECKLIST.md`
- [ ] Verify all 6 main sections are present and complete
- [ ] Verify 50-80 total checklist items (count with `grep -c "^- \[ \]" TESTING_CHECKLIST.md`)
- [ ] Verify at least 3 code examples are included
- [ ] Verify all examples reference actual test files that exist
- [ ] Verify links to `TESTING.md` and `__tests__/README.md` work

### 2. Actionability Check
- [ ] Go through each checklist item
- [ ] Verify each item has a clear yes/no answer
- [ ] Verify no vague items (e.g., "write good tests")
- [ ] Verify items reference specific functions, files, or patterns
- [ ] Verify items are specific enough to be useful

### 3. Accuracy Check
- [ ] Verify code examples are syntactically correct
- [ ] Verify code examples match actual patterns in the codebase
- [ ] Verify file references are correct:
  ```bash
  ls __tests__/integration/gig-creation.test.ts
  ls __tests__/integration/gig-authorization.test.ts
  ls __tests__/helpers/db.ts
  ls __tests__/helpers/auth.ts
  ls __tests__/helpers/seed.ts
  ```
- [ ] Verify function names are correct:
  ```bash
  grep "withTestTransaction" __tests__/helpers/db.ts
  grep "createTestUser" __tests__/helpers/seed.ts
  grep "withAuthContext" __tests__/helpers/auth.ts
  grep "createAuthenticatedClient" __tests__/helpers/auth.ts
  ```
- [ ] Verify mock patterns match actual usage in integration tests

### 4. Anti-Patterns Section Check
- [ ] Verify "What NOT to Do" section exists
- [ ] Verify section includes 8-12 anti-pattern items
- [ ] Verify each anti-pattern explains the problem and correct alternative
- [ ] Verify reference to `scripts/legacy-tests/` as example of what to avoid
- [ ] Verify anti-patterns are based on actual issues encountered

### 5. Integration Check
- [ ] Verify `TESTING.md` references the checklist
- [ ] Verify reference is prominent (in Overview or near top)
- [ ] Verify reference explains purpose of checklist
- [ ] Verify link works: click link in rendered markdown

### 6. Usability Check
- [ ] Ask a developer (or simulate) to use the checklist on an actual test file
- [ ] Verify they can answer yes/no to each item
- [ ] Verify the checklist catches common issues (isolation, mocking, naming)
- [ ] Verify the checklist is quick to use (5-10 minutes for full review)
- [ ] Verify the checklist doesn't duplicate `TESTING.md` (it's a quick reference)

### 7. Documentation Consistency Check
- [ ] Verify checklist aligns with `TESTING.md` guidance
- [ ] Verify checklist aligns with `__tests__/README.md` organization standards
- [ ] Verify no contradictions between documents
- [ ] Verify terminology is consistent (e.g., "transaction", "mock", "factory")

### 8. Edge Cases
- [ ] Verify checklist covers both unit and integration tests
- [ ] Verify checklist covers E2E tests (Playwright-specific items)
- [ ] Verify checklist covers authentication testing patterns
- [ ] Verify checklist covers factory usage
- [ ] Verify checklist covers common Prisma issues (select/include mixing)

**Success Criteria:**
- All checklist items are actionable and specific
- All code examples are accurate and reference real files
- All links work and point to correct sections
- Checklist is concise (1-2 pages) and quick to use
- Checklist catches common test quality issues
- No contradictions with existing documentation
- Developers can use checklist without confusion

---

## Post-Implementation Notes

After completing all tasks:

1. **Announce the checklist** to the team (if applicable)
2. **Encourage usage** before PR submissions
3. **Gather feedback** after 2-3 weeks of usage
4. **Iterate** based on feedback (add missing items, remove unhelpful ones)
5. **Consider automation** for checklist items that can be enforced (future work)

The checklist is a living document and should be updated as testing practices evolve.
