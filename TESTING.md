# Testing Guide

## Overview

Gigly uses a comprehensive testing framework with three layers:

1. **Unit Tests** (Vitest) - Test individual functions and utilities
2. **Integration Tests** (Vitest) - Test server actions and database operations
3. **E2E Tests** (Playwright) - Test complete user workflows in browser

**All supported and maintained tests live under `__tests__/`** using Vitest and Playwright. Legacy custom-runner scripts have been archived to `scripts/legacy-tests/` for historical reference only and are not run in CI.

## Quick Reference

Before committing tests, use the [Test Quality Checklist](./TESTING_CHECKLIST.md) to self-review for common issues:
- Test isolation and parallel execution
- Proper mocking of Next.js APIs
- Naming conventions and organization
- Flakiness prevention
- Coverage expectations
- Anti-patterns to avoid

The checklist provides a quick yes/no review. For comprehensive guidance, continue reading this document.

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

## Test Database Cleanup

Test workers create per-worker database files (`memdb_*.db`, `memdb_*.db-wal`, `memdb_*.db-shm`) that persist after test runs. Use these scripts to clean them up:

```bash
npm run clean:test-db    # Remove memdb_*.db*, test.db (safe, cross-platform)
npm run test:clean       # Clean DB + run unit tests
```

**When to use:**
- `clean:test-db`: After test runs leave artifacts, before `git status`/`git add`
- `test:clean`: Start tests with guaranteed clean DB state (useful for debugging)

**Verification test:**
```bash
# Create test files
touch memdb_123.db memdb_123.db-wal test.db

# Verify they exist
ls memdb_*.db* test.db  # Should show 3 files

# Run cleanup
npm run clean:test-db

# Verify removal
ls memdb_*.db* test.db  # Should show "No such file or directory"
```

**Note:** `.gitignore` already excludes these files from version control. This cleanup is for local development only.

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

**IMPORTANT:** E2E tests use a **different database architecture** than unit/integration tests. See [E2E Testing Guide](./__tests__/e2e/README.md) for comprehensive documentation.

**Key Differences:**
- **Database:** Single shared `test.db` (not per-worker isolation)
- **Execution:** Sequential (`workers: 1` in playwright.config.ts)
- **Setup:** Uses `global-setup.ts` to initialize database and load `.env.test`
- **Cleanup:** Requires `afterEach` or `afterAll` hooks to prevent data pollution
- **PrismaClient:** Must use libSQL adapter (same as production)

Example:
```typescript
import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { setE2ESession } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

// Initialize PrismaClient with libSQL adapter
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./test.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('My Feature', () => {
  // CRITICAL: Clean up test data after each test
  test.afterEach(async () => {
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('user can complete workflow', async ({ page }) => {
    // Create test user in database
    const user = await createTestUser(prisma, { role: 'CLIENT' })

    // Set authenticated session
    await setE2ESession(page, user)

    // Test workflow
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
```

**Why E2E uses shared database:**
- Dev server and browser must see the same data
- Dev server is a separate process that cannot access per-worker databases
- Playwright automatically starts dev server with shared `test.db`

**See [__tests__/e2e/README.md](./__tests__/e2e/README.md) for:**
- Complete architecture explanation
- Database setup and cleanup patterns
- Common pitfalls and troubleshooting
- Best practices for E2E tests

#### Complete Client Journey Test

The `client-journey.spec.ts` test validates the entire client workflow from registration through payment:

```bash
npm run test:e2e -- client-journey.spec.ts
```

**Test Coverage:**
1. Client registration and authentication
2. Gig creation via UI with Russian data
3. Specialist application (programmatic)
4. Application acceptance via UI
5. Work submission (programmatic)
6. Work approval via UI
7. Payment marking via UI
8. Final state verification

**Duration:** ~18-20 seconds

**Key Features:**
- Hybrid approach: Client actions via Playwright UI, specialist actions programmatically
- Uses realistic Russian company names, gig titles, and descriptions
- Verifies complete gig lifecycle: OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID
- Idempotent: Can run multiple times without conflicts
- Comprehensive state verification at each step

**Example output:**
```
✓ Created CLIENT user: cmlv6m2gh0000ykbi0rltvnah (client-1771609597788-dennou@test.com)
✓ After gig creation, redirected to: http://localhost:3000/dashboard
✓ Found created gig: cmlv6m5q40000usbishxsckbl
✓ Gig status after accept: IN_PROGRESS
✓ Assigned specialist: cmlv6m6cc0001ykbizcq7cxv0
✓ Specialist submitted work, gig status: REVIEW
✓ Gig status after approve: COMPLETED
✓ Gig status after mark as paid: PAID
✅ Complete client journey test passed!
```

#### Admin Moderation Test

The `admin-moderation.spec.ts` test validates the complete admin moderation workflow:

```bash
npm run test:e2e -- admin-moderation.spec.ts
```

**Test Coverage:**
1. Setup: Create test users (CLIENT, SPECIALIST, ADMIN) and gig programmatically
2. Admin authentication (programmatic)
3. User suspension via UI with Russian reason
4. Suspended user login verification (login blocked)
5. Admin re-authentication
6. Gig closure via UI with Russian reason
7. Moderation history verification (database)
8. Final state verification

**Duration:** ~19 seconds

**Key Features:**
- Hybrid approach: Admin actions via Playwright UI, setup programmatically
- Tests critical safety features: user suspension and gig closure
- Verifies suspended users cannot login
- Verifies ModerationLog entries are created with correct data
- Uses realistic Russian moderation reasons
- Idempotent: Can run multiple times without conflicts
- Comprehensive database verification at each step

**Example output:**
```
✓ Created CLIENT user: cmlvchroj00004gbimzfr9wz5 (client-1771619474890-akugq@test.com)
✓ Created SPECIALIST user: cmlvchrqr00014gbibx36v2pm (specialist-1771619474890-akugq@test.com)
✓ Created ADMIN user: cmlvchrsp00024gbixz372moq (admin-1771619474890-akugq@test.com)
✓ Created OPEN gig: cmlvchrt200034gbi64jlfvyz
✓ Admin authenticated successfully
✓ Suspend action completed, checking database...
✓ User suspended successfully
✓ ModerationLog entry created for SUSPEND_USER
✓ Suspended user login blocked successfully
✓ Admin re-authenticated successfully
✓ Close gig action completed, checking database...
✓ Gig closed successfully
✓ ModerationLog entry created for CLOSE_GIG
✓ Moderation history verified: 2 log entries
✓ Final state verification passed
✓ Test completed successfully
```

#### Error Scenario Testing

The `error-scenarios.spec.ts` test validates error handling and edge cases across all major workflows:

```bash
npm run test:e2e -- error-scenarios.spec.ts
```

**Test Coverage:**
1. Unauthorized access redirects (4 tests) - Unauthenticated users redirected to /login
2. Role-based access control (3 tests) - SPECIALIST/CLIENT/non-ADMIN cannot access restricted routes
3. Closed gig restrictions (2 tests) - Closed gigs reject applications via server-side validation
4. Invalid state transitions (3 tests) - Non-assigned specialists cannot submit work, non-owners cannot approve
5. Non-OPEN gig applications (3 tests) - IN_PROGRESS, COMPLETED, PAID gigs don't accept new applications

**Duration:** ~37 seconds (15 tests)

**Key Features:**
- Focuses on server-side validation and business logic errors (not HTML5 form validation)
- Verifies UI elements are hidden or error messages displayed appropriately
- Tests authorization boundaries and ownership checks
- Confirms database state remains unchanged when operations fail
- Idempotent: Can run multiple times without conflicts
- Uses unique timestamp-based identifiers to avoid conflicts

**Note:** This test suite validates existing error handling behavior. HTML5 form validation (required, minLength) shows browser-native errors that are not tested here, as the focus is on server-side validation and business logic errors visible in the UI.

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

### Comprehensive Auth Test Suite

The project includes a comprehensive authentication and authorization test suite covering all security requirements:

**Test Files:**
- `__tests__/integration/registration.test.ts` - User registration with role validation (6 tests)
- `__tests__/integration/login.test.ts` - Login credentials and suspended users (4 tests)
- `__tests__/unit/session.test.ts` - JWT session management (6 tests)
- `__tests__/integration/gig-authorization.test.ts` - Role-based gig operations (12 tests)
- `__tests__/integration/admin-authorization.test.ts` - Admin-only operations (6 tests)
- `__tests__/integration/horizontal-privilege-escalation.test.ts` - IDOR prevention (5 tests)
- `__tests__/integration/authorization-errors.test.ts` - Error message clarity (5 tests)

**Total: 44 tests covering authentication and authorization**

**Security Coverage (OWASP Top 10):**

1. **Mass Assignment Protection** - Tests verify that users cannot register with ADMIN role or inject privileged fields
2. **Vertical Privilege Escalation Prevention** - Tests verify role-based access control (CLIENT, SPECIALIST, ADMIN)
3. **Horizontal Privilege Escalation (IDOR) Prevention** - Tests verify ownership checks prevent users from accessing other users' resources

**Running Auth Tests:**

```bash
# Run all auth tests
npm run test:unit -- registration.test.ts login.test.ts session.test.ts gig-authorization.test.ts admin-authorization.test.ts horizontal-privilege-escalation.test.ts authorization-errors.test.ts

# Run specific auth test suite
npm run test:unit -- gig-authorization.test.ts
```

**Key Testing Patterns:**

All auth integration tests follow this pattern:

```typescript
import { vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, getTestSessionToken, setTestSessionToken } from '../helpers/auth'

// Mock @/lib/prisma to use test database
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
    set: vi.fn((name: string, value: string) => {
      if (name === 'session') {
        setTestSessionToken(value)
      }
    }),
    delete: vi.fn((name: string) => {
      if (name === 'session') {
        setTestSessionToken(undefined)
      }
    })
  }))
}))

// Test with authenticated context
it('CLIENT can create gigs', async () => {
  const prisma = getTestPrismaClient()
  const client = await prisma.user.create({ data: { ... } })

  await withAuthContext(client, async () => {
    const result = await createGig(null, formData)
    // Assertions
  })

  // Cleanup
  await prisma.user.delete({ where: { id: client.id } })
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
    set: vi.fn((name: string, value: string) => {
      if (name === 'session') {
        setTestSessionToken(value)
      }
    }),
    delete: vi.fn((name: string) => {
      if (name === 'session') {
        setTestSessionToken(undefined)
      }
    })
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

## Testing Admin Moderation

Admin moderation features require comprehensive testing to ensure suspended users cannot access the platform and closed gigs cannot receive activity.

### Test Coverage

The admin moderation test suite includes:

- `__tests__/integration/suspended-user-login.test.ts` - Login prevention for suspended users (4 tests)
- `__tests__/integration/closed-gig-applications.test.ts` - Application blocking for closed gigs (5 tests)
- `__tests__/integration/closed-gig-messages.test.ts` - Message blocking for closed gigs (6 tests)
- `__tests__/integration/moderation-logging.test.ts` - Audit log creation and querying (10 tests)
- `__tests__/integration/moderation-edge-cases.test.ts` - Validation and error handling (12 tests)
- `__tests__/integration/admin-authorization.test.ts` - Role-based access control (12 tests)
- `__tests__/integration/moderation-integration.test.ts` - Integration with existing features (6 tests)

**Total: 55 tests covering all admin moderation scenarios**

### Testing Suspended User Login Prevention

Verify that suspended users cannot create new sessions:

```typescript
import { loginUser } from '@/app/actions/auth'

it('suspended user cannot login with correct credentials', async () => {
  const prisma = getTestPrismaClient()

  // Create suspended user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'suspended@example.com',
      password: hashedPassword,
      role: 'CLIENT',
      suspended: true
    }
  })

  const formData = new FormData()
  formData.append('email', user.email)
  formData.append('password', 'password123')

  const result = await loginUser(null, formData)

  // Verify error message
  expect(result).toEqual({
    error: 'Your account has been suspended. Please contact support.'
  })

  // Verify no session token was created
  const sessionToken = getTestSessionToken()
  expect(sessionToken).toBeUndefined()
})
```

**Key Points:**
- Test verifies the specific error message returned
- Test confirms no session token is created
- Current implementation does not invalidate existing sessions (documented behavior)

### Testing Closed Gig Restrictions

Verify that closed gigs reject applications and messages:

```typescript
import { applyToGig } from '@/app/actions/gig'
import { sendMessage } from '@/app/actions/gig'

it('cannot apply to closed gig', async () => {
  const prisma = getTestPrismaClient()

  // Create closed gig
  const gig = await prisma.gig.create({
    data: {
      title: 'Test Gig',
      description: 'Description',
      acceptanceCriteria: 'Criteria that meets minimum length',
      budget: 10000000,
      clientId: client.id,
      status: 'OPEN',
      closedByAdmin: true,
      closedAt: new Date()
    }
  })

  const formData = new FormData()
  formData.append('gigId', gig.id)
  formData.append('approach', 'A'.repeat(100))
  formData.append('questions', 'B'.repeat(50))

  await withAuthContext(specialist, async () => {
    const result = await applyToGig(null, formData)
    expect(result).toEqual({
      error: 'This gig has been closed by administrators.'
    })
  })

  // Verify no application was created
  const applications = await prisma.application.findMany({
    where: { gigId: gig.id }
  })
  expect(applications.length).toBe(0)
})

it('cannot send message to closed gig', async () => {
  const prisma = getTestPrismaClient()

  // Create closed gig with assigned specialist
  const gig = await prisma.gig.create({
    data: {
      title: 'Test Gig',
      description: 'Description',
      acceptanceCriteria: 'Criteria',
      budget: 10000000,
      clientId: client.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id,
      closedByAdmin: true
    }
  })

  const formData = new FormData()
  formData.append('gigId', gig.id)
  formData.append('content', 'Test message')

  await withAuthContext(client, async () => {
    const result = await sendMessage(null, formData)
    expect(result).toEqual({
      error: 'Cannot send messages to a closed gig.'
    })
  })

  // Verify no message was created
  const messages = await prisma.message.findMany({
    where: { gigId: gig.id }
  })
  expect(messages.length).toBe(0)
})
```

**Key Points:**
- Test both CLIENT and SPECIALIST are blocked from messaging
- Verify no database records are created when actions fail
- Test covers different gig statuses (OPEN, IN_PROGRESS)

### Testing Moderation Logs

Verify that all moderation actions create audit logs:

```typescript
import { suspendUser, closeGig } from '@/app/actions/moderation'

it('creates log when suspending user', async () => {
  const prisma = getTestPrismaClient()

  const formData = new FormData()
  formData.append('userId', targetUser.id)
  formData.append('reason', 'Spam activity detected')

  await withAuthContext(admin, async () => {
    try {
      await suspendUser(null, formData)
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT')
    }
  })

  // Query ModerationLog
  const logs = await prisma.moderationLog.findMany({
    where: {
      action: 'SUSPEND_USER',
      adminId: admin.id,
      targetUserId: targetUser.id
    }
  })

  expect(logs.length).toBe(1)
  expect(logs[0].action).toBe('SUSPEND_USER')
  expect(logs[0].reason).toBe('Spam activity detected')
  expect(logs[0].adminId).toBe(admin.id)
  expect(logs[0].targetUserId).toBe(targetUser.id)
  expect(logs[0].createdAt).toBeInstanceOf(Date)
})

it('can query logs with relations', async () => {
  const prisma = getTestPrismaClient()

  // Query with relations
  const logs = await prisma.moderationLog.findMany({
    where: { adminId: admin.id },
    include: {
      admin: true,
      targetUser: true,
      targetGig: true
    },
    orderBy: { createdAt: 'desc' }
  })

  expect(logs[0].admin.email).toBe(admin.email)
  expect(logs[0].targetUser?.email).toBe(targetUser.email)
})
```

**Key Points:**
- Verify all required fields are populated (action, reason, adminId, targetUserId/targetGigId)
- Test that logs include relations (admin, targetUser, targetGig)
- Verify logs are ordered by createdAt DESC (newest first)
- Test that failed actions do not create logs

### Transaction Testing Pattern

Moderation actions use database transactions to ensure atomicity:

```typescript
it('uses transaction for atomicity', async () => {
  const prisma = getTestPrismaClient()

  await withAuthContext(admin, async () => {
    try {
      await suspendUser(null, formData)
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT')
    }
  })

  // Verify both user update and log creation succeeded
  const user = await prisma.user.findUnique({
    where: { id: targetUser.id }
  })
  expect(user?.suspended).toBe(true)

  const logs = await prisma.moderationLog.findMany({
    where: { adminId: admin.id, targetUserId: targetUser.id }
  })
  expect(logs.length).toBe(1)

  // Both operations succeed together (transaction ensures atomicity)
})
```

**Key Points:**
- Moderation actions use `prisma.$transaction` to wrap multiple operations
- If any operation fails, all operations roll back
- Tests verify both the primary action (suspend user) and secondary action (create log) succeed together

### Running Moderation Tests

```bash
# Run all moderation tests
npm run test:unit -- suspended-user-login.test.ts closed-gig-applications.test.ts closed-gig-messages.test.ts moderation-logging.test.ts moderation-edge-cases.test.ts admin-authorization.test.ts moderation-integration.test.ts

# Run specific test file
npm run test:unit -- suspended-user-login.test.ts

# Run with coverage
npm run test:coverage
```

## Test Database

## Mock Data Factories

The test suite includes factory functions that generate realistic Russian test data for all models. These factories guarantee validation-compliant data and support easy composition of related entities.

### Overview

Factory functions are located in `__tests__/helpers/seed.ts` and provide:

- **Realistic Russian data** - Names, companies, gig titles, and messages in Russian
- **Validation compliance** - All defaults pass model validations
- **Easy overrides** - Customize any field while keeping sensible defaults
- **Composability** - Create complex related data graphs easily
- **Transaction-safe** - Work seamlessly with `withTestTransaction()`

### Russian Data Generators

Use these functions to generate realistic Russian data directly:

```typescript
import {
  generateRussianName,
  generateRussianCompany,
  generateRussianINN,
  generateRussianGigTitle,
  generateRussianGigDescription,
  generateRussianMessage,
  generateRussianApproach,
  generateRussianQuestions,
  generateRussianEffort
} from '../helpers/seed'

// Examples
const name = generateRussianName()        // "Александр Петров"
const company = generateRussianCompany()  // "ООО \"ТехноСтарт\""
const inn = generateRussianINN()          // "7743013902"
const title = generateRussianGigTitle()   // "Разработка REST API..."
```

### Factory Functions

#### `createTestUser(tx, overrides?)`

Creates a user with appropriate profile based on role.

```typescript
import { createTestUser } from '../helpers/seed'

await withTestTransaction(async (tx) => {
  // Create CLIENT with defaults
  const client = await createTestUser(tx, { role: 'CLIENT' })
  // client.clientProfile.companyName = "ООО \"ТехноСтарт\""
  // client.clientProfile.inn = "7743013902"

  // Create SPECIALIST with defaults
  const specialist = await createTestUser(tx, { role: 'SPECIALIST' })
  // specialist.specialistProfile.displayName = "Александр Петров"
  // specialist.specialistProfile.experienceLevel = "SENIOR"

  // Create with custom values
  const customUser = await createTestUser(tx, {
    role: 'SPECIALIST',
    displayName: 'Иван Иванов',
    techStack: 'Python, Django',
    experienceLevel: 'MIDDLE'
  })
})
```

**Default Values:**

| Field | CLIENT | SPECIALIST |
|-------|--------|------------|
| email | `test-{timestamp}-{random}@example.com` (unique) | Same |
| password | `password123` (hashed) | Same |
| companyName | Random Russian company | N/A |
| inn | Random realistic INN (10 digits) | N/A |
| displayName | N/A | Random Russian name |
| techStack | N/A | "React, TypeScript" |
| experienceLevel | N/A | "SENIOR" |
| hourlyRate | N/A | 5000 (kopecks) |

#### `createTestGig(tx, overrides?)`

Creates a gig with realistic Russian content. Auto-creates client if not provided.

```typescript
import { createTestGig } from '../helpers/seed'

await withTestTransaction(async (tx) => {
  // Create with defaults
  const gig = await createTestGig(tx)
  // gig.title = "Разработка REST API..."
  // gig.budget = 150000 (kopecks)
  // gig.serviceFee = 15000 (10% of budget)
  // gig.totalAmount = 165000

  // Create with existing client
  const client = await createTestUser(tx, { role: 'CLIENT' })
  const gigForClient = await createTestGig(tx, { clientId: client.id })

  // Create with custom values
  const customGig = await createTestGig(tx, {
    title: 'Кастомный проект',
    budget: 200000,
    serviceFee: 20000,
    totalAmount: 220000,
    status: 'IN_PROGRESS'
  })
})
```

**Default Values:**

| Field | Default |
|-------|---------|
| title | Random Russian gig title |
| description | Random Russian gig description |
| budget | 150000 (kopecks) |
| serviceFee | 15000 (10% of budget) |
| totalAmount | 165000 (budget + serviceFee) |
| status | "OPEN" |
| tags | "React,TypeScript" |

#### `createTestApplication(tx, overrides?)`

Creates an application with Russian structured fields. Auto-creates gig and specialist if not provided.

```typescript
import { createTestApplication } from '../helpers/seed'

await withTestTransaction(async (tx) => {
  // Create with defaults
  const app = await createTestApplication(tx)
  // app.approach = "Буду использовать архитектуру REST..."
  // app.questions = "Какие требования к производительности..."
  // app.estimatedEffort = "2 недели"

  // Create for existing gig and specialist
  const gig = await createTestGig(tx)
  const specialist = await createTestUser(tx, { role: 'SPECIALIST' })
  const appForGig = await createTestApplication(tx, {
    gigId: gig.id,
    specialistId: specialist.id
  })

  // Create with custom content
  const customApp = await createTestApplication(tx, {
    approach: 'Мой уникальный подход длиной более 100 символов...',
    questions: 'Мои вопросы длиной более 50 символов...',
    estimatedEffort: '5 дней'
  })
})
```

**Default Values:**

| Field | Default |
|-------|---------|
| approach | Random Russian technical approach (100-500 chars) |
| questions | Random Russian clarifying questions (50-200 chars) |
| estimatedEffort | Random Russian effort estimate |
| coverLetter | "" (empty, legacy field) |
| status | "PENDING" |

#### `createTestMessage(tx, overrides?)`

Creates a message with Russian content. Auto-creates gig and sender if not provided.

```typescript
import { createTestMessage } from '../helpers/seed'

await withTestTransaction(async (tx) => {
  // Create with defaults
  const message = await createTestMessage(tx)
  // message.content = "Добрый день! Уточните, пожалуйста..."

  // Create for existing gig and sender
  const gig = await createTestGig(tx)
  const user = await createTestUser(tx)
  const msgForGig = await createTestMessage(tx, {
    gigId: gig.id,
    senderId: user.id
  })

  // Create with custom content
  const customMsg = await createTestMessage(tx, {
    content: 'Кастомное сообщение'
  })
})
```

**Default Values:**

| Field | Default |
|-------|---------|
| content | Random Russian message |

### Common Patterns

#### Creating a user with defaults

```typescript
await withTestTransaction(async (tx) => {
  const client = await createTestUser(tx, { role: 'CLIENT' })
  const specialist = await createTestUser(tx, { role: 'SPECIALIST' })

  // All data is realistic and validation-compliant
  expect(client.clientProfile?.companyName).toMatch(/ООО/)
  expect(specialist.specialistProfile?.displayName).toMatch(/[А-Яа-я]/)
})
```

#### Creating a gig with applications

```typescript
await withTestTransaction(async (tx) => {
  // Create one gig
  const gig = await createTestGig(tx)

  // Create multiple applications for the same gig
  const app1 = await createTestApplication(tx, { gigId: gig.id })
  const app2 = await createTestApplication(tx, { gigId: gig.id })
  const app3 = await createTestApplication(tx, { gigId: gig.id })

  // Each application automatically gets a different specialist
  expect(app1.specialistId).not.toBe(app2.specialistId)
})
```

#### Creating a complete workflow

```typescript
await withTestTransaction(async (tx) => {
  // 1. Create client and gig
  const client = await createTestUser(tx, { role: 'CLIENT' })
  const gig = await createTestGig(tx, { clientId: client.id })

  // 2. Create specialist and application
  const specialist = await createTestUser(tx, { role: 'SPECIALIST' })
  const app = await createTestApplication(tx, {
    gigId: gig.id,
    specialistId: specialist.id
  })

  // 3. Accept application
  await tx.gig.update({
    where: { id: gig.id },
    data: {
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id
    }
  })

  // 4. Create messages
  const msg1 = await createTestMessage(tx, {
    gigId: gig.id,
    senderId: client.id
  })
  const msg2 = await createTestMessage(tx, {
    gigId: gig.id,
    senderId: specialist.id
  })

  // All data is Russian and realistic
})
```

#### Using Russian data generators directly

```typescript
await withTestTransaction(async (tx) => {
  // Generate custom Russian data
  const customUser = await createTestUser(tx, {
    role: 'SPECIALIST',
    displayName: generateRussianName(),
    techStack: 'Go, Kubernetes, PostgreSQL'
  })

  const customGig = await createTestGig(tx, {
    title: generateRussianGigTitle(),
    description: generateRussianGigDescription()
  })
})
```

### Validation Compliance

All factory defaults are guaranteed to pass model validations:

- **User**: Email unique, password hashed, role valid
- **ClientProfile**: companyName and inn non-empty, inn is 10 digits
- **SpecialistProfile**: experienceLevel is "MIDDLE" or "SENIOR"
- **Gig**: budget > 0, serviceFee = budget * 0.10, totalAmount = budget + serviceFee
- **Application**: approach 100-2000 chars, questions 50-1000 chars
- **Message**: content non-empty, max 2000 chars

### Composability

Factories are designed to compose easily:

```typescript
// Pattern 1: Create related entities in sequence
const client = await createTestUser(tx, { role: 'CLIENT' })
const gig = await createTestGig(tx, { clientId: client.id })
const app = await createTestApplication(tx, { gigId: gig.id })

// Pattern 2: Let factories auto-create dependencies
const app = await createTestApplication(tx)
// Automatically creates gig and specialist

// Pattern 3: Mix and match
const gig = await createTestGig(tx)
const specialist = await createTestUser(tx, { role: 'SPECIALIST' })
const app = await createTestApplication(tx, {
  gigId: gig.id,
  specialistId: specialist.id
})
```

### Examples

See comprehensive examples in:
- `__tests__/integration/factory-composability.test.ts` - Complex workflows
- `__tests__/integration/factory-validation.test.ts` - Validation compliance

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

## CSRF Protection Testing

### Overview

Next.js 15 provides built-in CSRF (Cross-Site Request Forgery) protection for Server Actions via **Origin header matching**. Next.js compares the `Origin` header to the `Host` header and rejects mismatches with 403 Forbidden. No CSRF tokens are used.

### Test Files

- **E2E Tests**: `__tests__/e2e/csrf-protection.spec.ts` - Tests cross-origin request rejection
- **Config Tests**: `__tests__/unit/config-validation.test.ts` - Verifies safe configuration

### Running CSRF Tests

```bash
# Run CSRF E2E tests
npm run test:e2e -- csrf-protection

# Run config validation tests
npm test -- config-validation

# Run all tests (includes CSRF tests)
npm test
```

### Writing CSRF Tests for New Server Actions

When adding new Server Actions, add CSRF tests to verify Origin-based protection:

#### Pattern 1: Route Interception (Recommended)

This approach intercepts legitimate form submissions and modifies the Origin header to simulate a CSRF attack:

```typescript
import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { setE2ESession } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

test('Server Action rejects cross-origin requests', async ({ page }) => {
  // Setup: Create authenticated user
  const user = await createTestUser(prisma, { role: 'CLIENT' })
  await setE2ESession(page, user)

  await page.goto('http://localhost:3000/your-page')

  // Intercept Server Action requests and modify Origin header
  await page.route('**/*', async (route) => {
    const request = route.request()
    if (request.method() === 'POST' && request.headers()['next-action']) {
      // Simulate CSRF attack by spoofing Origin header
      await route.continue({
        headers: {
          ...request.headers(),
          'origin': 'https://malicious-site.com'
        }
      })
    } else {
      await route.continue()
    }
  })

  // Fill and submit form (will be intercepted with spoofed Origin)
  await page.fill('input[name="field"]', 'value')
  await page.click('button[type="submit"]')

  // Wait for response
  await page.waitForTimeout(1000)

  // Assert: Action should NOT succeed
  // Verify data was NOT created in database
  const records = await prisma.yourModel.findMany({
    where: { /* your criteria */ }
  })
  expect(records.length).toBe(0)
})
```

#### Pattern 2: Same-Origin Test (Verify Legitimate Requests Work)

Always pair cross-origin rejection tests with same-origin acceptance tests:

```typescript
test('Server Action accepts same-origin requests', async ({ page }) => {
  // Setup: Create authenticated user
  const user = await createTestUser(prisma, { role: 'CLIENT' })
  await setE2ESession(page, user)

  await page.goto('http://localhost:3000/your-page')

  // Fill and submit form (no Origin manipulation - legitimate request)
  await page.fill('input[name="field"]', 'value')
  await page.click('button[type="submit"]')

  // Wait for completion
  await page.waitForTimeout(2000)

  // Assert: Action should succeed
  const records = await prisma.yourModel.findMany({
    where: { /* your criteria */ }
  })
  expect(records.length).toBe(1)
})
```

### Key Testing Principles

1. **Dynamic Action IDs**: Next.js generates action IDs dynamically per build. Never hardcode action IDs in tests.

2. **Route Interception**: Use `page.route()` to intercept requests and modify headers. This accurately simulates real CSRF attacks.

3. **Test Both Cases**: Always test both rejection (cross-origin) and acceptance (same-origin) for each Server Action.

4. **Database Verification**: Verify that cross-origin requests do NOT create/modify data in the database.

5. **Cleanup**: Use `afterEach` hooks to clean up test data.

### Example: Complete CSRF Test Suite

```typescript
import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { setE2ESession } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
})

const prisma = new PrismaClient({
  adapter: adapter as any
})

test.describe('CSRF Protection - Your Feature', () => {
  test.afterEach(async () => {
    // Clean up test data
    await prisma.yourModel.deleteMany({})
    await prisma.user.deleteMany({})
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('rejects cross-origin requests', async ({ page }) => {
    // Test implementation (see Pattern 1 above)
  })

  test('accepts same-origin requests', async ({ page }) => {
    // Test implementation (see Pattern 2 above)
  })
})
```

### Configuration Validation

Always verify that `next.config.ts` doesn't weaken CSRF protection:

```typescript
import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('CSRF Configuration', () => {
  it('should not have dangerous allowedOrigins', () => {
    const configPath = path.join(process.cwd(), 'next.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')

    // Check for wildcards
    const hasWildcard = /allowedOrigins\s*:\s*\[.*['"`]\*['"`].*\]/.test(configContent)
    expect(hasWildcard).toBe(false)
  })
})
```

### Troubleshooting CSRF Tests

**Test fails with "Route interception not working":**
- Ensure you're using `page.route()` before navigating to the page
- Check that the route pattern matches your Server Action requests

**Test passes but CSRF protection seems broken:**
- Verify you're actually modifying the Origin header (check network logs)
- Ensure the Server Action is being called (not just form validation failing)
- Check that you're testing the right endpoint

**Database verification fails:**
- Ensure proper cleanup in `afterEach` hooks
- Use unique identifiers to avoid conflicts with other tests
- Verify database connection is using test database

### CI/CD Integration

CSRF tests run automatically as part of the E2E test suite:

```bash
# In CI pipeline
npm run test:e2e  # Includes csrf-protection.spec.ts
```

The tests are included in the standard E2E test run, so no special CI configuration is needed.

### Security Notes

- **Origin-based protection**: Next.js uses Origin header matching, NOT CSRF tokens
- **No custom implementation needed**: Protection is built into Next.js 15
- **Configuration risk**: `serverActions.allowedOrigins` can weaken protection - avoid it
- **All Server Actions protected**: Every Server Action automatically gets CSRF protection

For more details, see `SECURITY.md` (CSRF Protection section).
