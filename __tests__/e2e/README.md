# E2E Testing Guidelines

## Architecture

E2E tests use **single shared database** (`test.db`) because:
- Dev server and browser must see the same data
- Dev server is a separate process that cannot access per-worker databases
- Tests run sequentially (`workers: 1`) to avoid conflicts

This is **different from unit tests** which use per-worker isolated databases.

## Database Setup

**Global setup** (`global-setup.ts`):
1. Loads `.env.test` environment variables
2. Deletes existing `test.db`
3. Applies Prisma schema with `prisma db push`

**Dev server** (configured in `playwright.config.ts`):
- Uses same `test.db` database
- Uses same `SESSION_SECRET` from `.env.test`

## Test Isolation

**CRITICAL:** Always clean up test data to prevent pollution.

### Simple tests (independent data)

```typescript
import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./test.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('My Feature', () => {
  // Clean up after each test
  test.afterEach(async () => {
    await prisma.user.deleteMany({})
    await prisma.gig.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('my test', async ({ page }) => {
    const user = await createTestUser(prisma, { role: 'CLIENT' })
    // ... test logic ...
  })
})
```

### Complex tests (shared data across tests)

```typescript
test.describe.serial('Multi-step Journey', () => {
  let client: User
  let specialist: User
  let gig: Gig

  test.beforeAll(async () => {
    // Create shared data once
    client = await createTestUser(prisma, { role: 'CLIENT' })
    specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    gig = await createTestGig(prisma, { clientId: client.id })
  })

  test.afterAll(async () => {
    // Clean up shared data
    await prisma.gig.delete({ where: { id: gig.id } })
    await prisma.user.deleteMany({
      where: { id: { in: [client.id, specialist.id] } }
    })
  })

  test('step 1', async ({ page }) => { ... })
  test('step 2', async ({ page }) => { ... })
})
```

## Helper Functions

Use helpers from `__tests__/helpers/`:

- `createTestUser(prisma, options)` - Create test user with profile
- `createTestGig(prisma, options)` - Create test gig
- `createTestApplication(prisma, options)` - Create test application
- `setE2ESession(page, user)` - Set authenticated session cookie

All helpers use `generateUniqueEmail()` to avoid conflicts.

## Best Practices

1. **Always add cleanup hooks** - Use `afterEach` or `afterAll`
2. **Use unique emails** - Helpers do this automatically
3. **Run sequentially** - Keep `workers: 1` in config
4. **Document test data** - Comment what data each test creates
5. **Test in isolation** - Each test should work independently

## Common Pitfalls

❌ **DON'T:**
- Use `setupTestDatabase()` from `__tests__/helpers/db.ts` (that's for unit tests)
- Run E2E tests in parallel
- Forget cleanup hooks
- Share database state between unrelated tests

✅ **DO:**
- Use `global-setup.ts` for database initialization
- Clean up test data in `afterEach` or `afterAll`
- Use helper functions for creating test data
- Keep tests independent and isolated

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- auth-session.spec.ts

# Run in debug mode
npm run test:e2e -- --debug

# Run with UI
npm run test:e2e -- --ui
```

## Troubleshooting

**Tests fail with "user not found":**
- Check that dev server uses same `test.db` (see `playwright.config.ts` webServer.env)
- Check that `SESSION_SECRET` matches between test and server

**Tests fail with "table does not exist":**
- Check that `global-setup.ts` runs successfully
- Check that `prisma db push` completes without errors

**Tests are flaky:**
- Add cleanup hooks to prevent data pollution
- Check that tests don't depend on execution order
- Use `test.describe.serial()` if tests must run in order
