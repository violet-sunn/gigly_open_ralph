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

> **Note**: Legacy test scripts in `scripts/legacy-tests/` are archived examples of what NOT to do. They use custom test runners instead of Vitest and are not maintained. All new tests must go in `__tests__/` using Vitest or Playwright.

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
- [ ] ❌ No duplicate test setup → Use `beforeEach` for common setup
- [ ] ❌ No overly broad try-catch blocks → Let test framework handle errors

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
