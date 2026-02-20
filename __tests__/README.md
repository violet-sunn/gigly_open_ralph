# Gigly Testing Standards

This directory contains the test suite for the Gigly platform. Tests use Vitest (unit/integration) and Playwright (E2E) frameworks with proper database isolation and test helpers.

## Directory Structure

```
__tests__/
├── integration/  (~26 files, 95% of tests) - Server actions + database operations
├── unit/         (~2 files)                 - Pure functions, no external dependencies
├── e2e/          (~2 files)                 - Browser-based end-to-end workflows
├── helpers/      (4 files)                  - Test utilities and mock data factories
│   ├── db.ts            - Database isolation (getTestPrismaClient, withTestTransaction)
│   ├── seed.ts          - Mock data factories (createTestUser, createTestGig, etc.)
│   ├── auth.ts          - Auth helpers (withAuthContext, createAuthenticatedClient)
│   └── auth-mocks.ts    - Next.js API mocks
└── setup.ts      - Global test configuration
```

## Naming Conventions

- **`*.test.ts`** → Unit and integration tests (Vitest)
- **`*.spec.ts`** → E2E tests (Playwright)
- Name files after the feature/module: `gig-creation.test.ts`, `registration.spec.ts`

## Test Types

**Unit Tests** (`__tests__/unit/`)
- Pure functions, no database, no external dependencies
- Very fast (<10ms per test)
- Example: `currency.test.ts` - Test `formatCurrency()` utility

**Integration Tests** (`__tests__/integration/`)
- Server actions with database operations
- Moderate speed (50-200ms per test)
- Example: `gig-creation.test.ts` - Test `createGig` server action with DB

**E2E Tests** (`__tests__/e2e/`)
- Complete user workflows in browser
- Slower (1-5s per test)
- Example: `registration.spec.ts` - Test full registration flow

## AAA Pattern (Mandatory)

All tests MUST follow the Arrange-Act-Assert pattern for clarity and maintainability:

```typescript
it('creates gig with correct service fee', async () => {
  // Arrange - Set up test data and preconditions
  const prisma = getTestPrismaClient()
  const client = await createAuthenticatedClient(prisma)
  const input = { title: 'Test', budget: 100000, ... }

  // Act - Execute the code under test
  await withAuthContext(client.user, async () => {
    await createGig(input)
  })

  // Assert - Verify the expected outcome
  const gig = await prisma.gig.findFirst({ where: { title: 'Test' } })
  expect(gig?.serviceFee).toBe(20000)
})
```

## Test Helpers

### `__tests__/helpers/db.ts` - Database Utilities

```typescript
getTestPrismaClient(): PrismaClient
// Get Prisma client for current test worker (per-worker isolation)

withTestTransaction<T>(callback: (tx: PrismaClient) => Promise<T>): Promise<T>
// Execute test in isolated transaction that rolls back (perfect isolation)
```

### `__tests__/helpers/seed.ts` - Mock Data Factories

```typescript
createTestUser(tx: PrismaClient, overrides?: Partial<UserData>): Promise<User>
// Create test user with role-specific profile (CLIENT/SPECIALIST/ADMIN)

createTestGig(tx: PrismaClient, overrides?: Partial<GigData>): Promise<Gig>
// Create test gig with realistic Russian data

createTestApplication(tx: PrismaClient, overrides?: Partial<ApplicationData>): Promise<Application>
// Create test application with structured fields
```

### `__tests__/helpers/auth.ts` - Authentication Helpers

```typescript
withAuthContext(user: User, callback: () => Promise<void>): Promise<void>
// Execute callback with authenticated session context

createAuthenticatedClient(tx: PrismaClient, overrides?): Promise<{ user: User, session: string }>
// Create CLIENT user with valid session token

createAuthenticatedSpecialist(tx: PrismaClient, overrides?): Promise<{ user: User, session: string }>
// Create SPECIALIST user with valid session token

setE2ESession(page: Page, user: User): Promise<void>
// Set authenticated session in Playwright E2E test
```

See `TESTING.md` for comprehensive documentation.

## Common Mocking Patterns

Integration tests require mocking Next.js APIs. **Mocks MUST be defined before imports.**

### Mock Prisma

```typescript
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))
```

### Mock Next.js Cookies

```typescript
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
    },
    set: vi.fn(),
    delete: vi.fn()
  }))
}))
```

### Mock Next.js Redirect

```typescript
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))
```

## Running Tests

```bash
npm test                 # Watch mode (recommended for development)
npm run test:unit        # Run unit + integration tests once
npm run test:e2e         # Run E2E tests (requires dev server)
npm run test:coverage    # Generate coverage report
npm run clean:test-db    # Clean up test database files
```

## Example Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/lib/utils/currency'

describe('Currency Utils', () => {
  it('formats Russian rubles correctly', () => {
    // Arrange
    const amount = 100000

    // Act
    const result = formatCurrency(amount)

    // Assert
    expect(result).toBe('100\u00A0000\u00A0₽')
  })
})
```

### Integration Test Example

```typescript
import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createAuthenticatedClient, withAuthContext } from '../helpers/auth'
import { createGig } from '@/app/actions/gig'

// [Mocks here - see Common Mocking Patterns section]

describe('Gig Creation', () => {
  it('creates gig with correct service fee', async () => {
    // Arrange
    const prisma = getTestPrismaClient()
    const client = await createAuthenticatedClient(prisma)
    const input = {
      title: 'Test Gig',
      description: 'Test description',
      acceptanceCriteria: 'Criteria that is long enough',
      budget: 100000,
      tags: 'React,TypeScript'
    }

    // Act
    await withAuthContext(client.user, async () => {
      await createGig(input)
    })

    // Assert
    const gig = await prisma.gig.findFirst({ where: { title: 'Test Gig' } })
    expect(gig?.serviceFee).toBe(20000) // 20% of 100000
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('user can register as CLIENT', async ({ page }) => {
  // Arrange
  await page.goto('/register')

  // Act
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'SecurePass123!')
  await page.click('button:has-text("CLIENT")')
  await page.fill('input[name="companyName"]', 'Test Company')
  await page.fill('input[name="inn"]', '1234567890')
  await page.click('button[type="submit"]')

  // Assert
  await expect(page).toHaveURL('/dashboard')
})
```

## Legacy Scripts

Legacy verification scripts in `scripts/legacy-tests/` are archived for historical reference. They use custom `pass()`/`fail()` functions and are NOT maintained. Use Vitest in `__tests__/` for all new tests. See `scripts/legacy-tests/README.md` for context.

## Further Reading

- `TESTING.md` - Comprehensive testing documentation
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
