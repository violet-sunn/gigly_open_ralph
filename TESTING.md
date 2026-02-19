# Testing Guide

## Overview

Gigly uses a comprehensive testing framework with three layers:

1. **Unit Tests** (Vitest) - Test individual functions and utilities
2. **Integration Tests** (Vitest) - Test server actions and database operations
3. **E2E Tests** (Playwright) - Test complete user workflows in browser

## Running Tests

### All Tests (Watch Mode)
```bash
npm test
```
Starts Vitest in watch mode. Tests re-run automatically when files change.

### Unit & Integration Tests
```bash
npm run test:unit
```
Runs all Vitest tests once and exits.

### E2E Tests
```bash
npm run test:e2e
```
Runs Playwright tests. Requires dev server to be running (auto-started by Playwright).

### Coverage Report
```bash
npm run test:coverage
```
Generates code coverage report. Open `coverage/index.html` to view.

## Writing Tests

### Unit Tests

Location: `__tests__/unit/`

Example:
```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/utils/myFunction'

describe('myFunction', () => {
  it('returns expected result', () => {
    expect(myFunction(input)).toBe(expectedOutput)
  })
})
```

### Integration Tests

Location: `__tests__/integration/`

Example:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Feature', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.model.deleteMany()
  })

  it('performs database operation', async () => {
    const result = await prisma.model.create({ data: {...} })
    expect(result).toBeDefined()
  })
})
```

### E2E Tests

Location: `__tests__/e2e/`

Example:
```typescript
import { test, expect } from '@playwright/test'

test('user can complete workflow', async ({ page }) => {
  await page.goto('/page')
  await page.fill('input[name="field"]', 'value')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Success')).toBeVisible()
})
```

## Test Database

Tests use isolated per-worker databases to enable fast parallel execution:

- Each Vitest worker gets its own in-memory SQLite database
- Tests run within transactions that automatically roll back
- No shared state between tests or workers
- Schema is applied via `prisma db push`

### Using Test Database Helpers

```typescript
import { withTestTransaction } from '../helpers/db'
import { createTestUser, createTestGig } from '../helpers/seed'

it('creates user in isolated transaction', async () => {
  await withTestTransaction(async (tx) => {
    // Create test data
    const user = await createTestUser(tx, { role: 'CLIENT' })

    // Test operations
    expect(user.role).toBe('CLIENT')

    // Data automatically rolls back after test
  })
})
```

## Testing Authenticated Features

Most features in Gigly require authentication. The authentication test helpers make it easy to test authenticated functionality without going through the full login flow.

### Available Helpers

All helpers are exported from `__tests__/helpers/auth.ts`:

#### `createTestSession(user)`

Generates a valid JWT session token for a test user.

```typescript
import { createTestSession } from '../helpers/auth'

const user = { id: 'user-id', email: 'test@example.com', role: 'CLIENT' }
const token = await createTestSession(user)
// Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### `withAuthContext(user, callback)`

Executes a callback with mocked authenticated session context. Server actions called within the callback will see the user as authenticated via `getSession()`.

```typescript
import { withAuthContext } from '../helpers/auth'
import { getSession } from '@/lib/session'

await withAuthContext(user, async () => {
  const session = await getSession()
  // session.userId === user.id
  // session.role === user.role
})
```

**Important:** You must mock `next/headers` at the top of your test file:

```typescript
import { vi } from 'vitest'
import { getTestSessionToken } from '../helpers/auth'

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
```

#### `makeAuthenticatedRequest(user, action, ...args)`

Convenience wrapper for calling server actions with authenticated context.

```typescript
import { makeAuthenticatedRequest } from '../helpers/auth'
import { createGig } from '@/app/actions/gig'

const formData = new FormData()
formData.append('title', 'Test Gig')
formData.append('description', 'Description')
formData.append('budget', '100000')

const result = await makeAuthenticatedRequest(client, createGig, null, formData)
```

#### `expectUnauthorized(callback)`

Asserts that an operation fails with an authorization error. Useful for testing that unauthorized access is properly blocked.

```typescript
import { expectUnauthorized } from '../helpers/auth'

await expectUnauthorized(async () => {
  // This should throw an authorization error
  await someRestrictedOperation()
})
```

#### Role-Specific Helpers

Create users with sessions in a single call:

```typescript
import {
  createAuthenticatedClient,
  createAuthenticatedSpecialist,
  createAuthenticatedAdmin
} from '../helpers/auth'

await withTestTransaction(async (tx) => {
  const { user: client, session } = await createAuthenticatedClient(tx, {
    companyName: 'Acme Corp'
  })

  const { user: specialist, session: specialistSession } =
    await createAuthenticatedSpecialist(tx, {
      techStack: 'React, Node.js'
    })

  const { user: admin, session: adminSession } =
    await createAuthenticatedAdmin(tx)
})
```

### Common Testing Patterns

#### Testing CLIENT-only operations

```typescript
it('CLIENT can create gig', async () => {
  await withTestTransaction(async (tx) => {
    const { user: client } = await createAuthenticatedClient(tx)

    await withAuthContext(client, async () => {
      // Call server action or business logic
      const session = await getSession()
      expect(session?.role).toBe('CLIENT')
    })
  })
})
```

#### Testing SPECIALIST-only operations

```typescript
it('SPECIALIST can apply to gig', async () => {
  await withTestTransaction(async (tx) => {
    const { user: specialist } = await createAuthenticatedSpecialist(tx)

    await withAuthContext(specialist, async () => {
      // Call server action or business logic
      const session = await getSession()
      expect(session?.role).toBe('SPECIALIST')
    })
  })
})
```

#### Testing role-based authorization

```typescript
it('only ADMIN can suspend users', async () => {
  await withTestTransaction(async (tx) => {
    const { user: client } = await createAuthenticatedClient(tx)
    const { user: admin } = await createAuthenticatedAdmin(tx)

    // Admin can perform operation
    await withAuthContext(admin, async () => {
      // Operation succeeds
    })

    // Client cannot perform operation
    await expectUnauthorized(async () => {
      await withAuthContext(client, async () => {
        // Operation should fail
      })
    })
  })
})
```

#### Testing ownership-based authorization

```typescript
it('only gig owner can accept applications', async () => {
  await withTestTransaction(async (tx) => {
    const { user: owner } = await createAuthenticatedClient(tx)
    const { user: otherUser } = await createAuthenticatedClient(tx)

    const gig = await createTestGig(tx, { clientId: owner.id })

    // Owner can accept
    await withAuthContext(owner, async () => {
      // Operation succeeds
    })

    // Other user cannot accept
    await expectUnauthorized(async () => {
      await withAuthContext(otherUser, async () => {
        // Operation should fail
      })
    })
  })
})
```

### E2E Authentication

For Playwright E2E tests, use `setE2ESession` to inject session cookies:

```typescript
import { test } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

test('authenticated user can access dashboard', async ({ page }) => {
  // Create user in test database
  const user = await createTestUser(prisma, { role: 'CLIENT' })

  // Set session cookie
  await setE2ESession(page, user)

  // Navigate to protected page
  await page.goto('http://localhost:3000/dashboard')

  // User is authenticated
})
```

### Troubleshooting Authentication Tests

#### "Session not found" errors

Make sure you've mocked `next/headers` at the top of your test file:

```typescript
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
```

#### Context not cleaned up between tests

Use `beforeEach` to clear the session store:

```typescript
import { setTestSessionToken } from '../helpers/auth'

beforeEach(() => {
  setTestSessionToken(undefined)
})
```

#### "Zero-length key is not supported"

This means `SESSION_SECRET` is not loaded. Ensure `.env.test` exists and contains:

```
SESSION_SECRET="test-secret-key-for-jwt-signing-min-32-chars"
```

## Test Database

## Best Practices

1. **Keep tests focused** - One assertion per test when possible
2. **Use descriptive names** - Test names should explain what is being tested
3. **Clean up test data** - Use `beforeEach` or `afterEach` hooks
4. **Avoid test interdependence** - Tests should run independently
5. **Mock external services** - Don't make real API calls in tests
6. **Test edge cases** - Include tests for error conditions

## Troubleshooting

### Tests fail with "Cannot find module"
- Check path aliases in `vitest.config.ts` match `tsconfig.json`
- Ensure imports use `@/` prefix

### E2E tests timeout
- Increase timeout in `playwright.config.ts`
- Check dev server is running on port 3000

### Database errors in tests
- Verify `DATABASE_URL` in `.env.test` points to `test.db`
- Run `npx tsx __tests__/setup-db.ts` manually to reset database

## CI/CD Integration

To run tests in CI pipeline:

```yaml
- name: Run tests
  run: |
    npm run test:unit
    npm run test:e2e
    npm run test:coverage
```

Ensure `test.db` is created in CI environment before running tests.
