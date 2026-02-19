# Implementation Tasks

## Task 1: Create Database Helper Utilities

**File**: `__tests__/helpers/db.ts`

### Implementation Notes

Create a new file with the following functions:

1. **`setupTestDatabase()`**
   - **CRITICAL**: Generate unique database URL per Vitest worker to avoid SQLite write lock contention
   - Use `process.env.VITEST_WORKER_ID` or `process.pid` to create worker-specific database
   - Example: `DATABASE_URL="file:memdb_${workerId}?mode=memory&cache=shared"`
   - Create Prisma client with worker-specific URL
   - Run `prisma db push --skip-generate` to apply schema (faster than migrate for in-memory)
   - Return configured Prisma client instance
   - Handle errors gracefully (log and re-throw)

2. **`cleanupTestDatabase(client)`**
   - Disconnect Prisma client: `await client.$disconnect()`
   - Clear any cached connections
   - Return void

3. **`withTestTransaction(callback)`**
   - Use Prisma's interactive transaction API: `prisma.$transaction(async (tx) => { ... })`
   - Execute callback with transaction client
   - Automatically rollback by throwing error at end of transaction
   - Return callback result for assertions

4. **`getTestPrismaClient()`**
   - Singleton pattern per worker: return cached client if exists for current worker
   - Otherwise call setupTestDatabase() and cache result
   - Cache key should include worker ID to ensure per-worker isolation
   - Useful for tests that don't need transaction isolation

### Test Plan

**What to run**:
```bash
npm run test:unit
```

**What to assert**:
- Create a test file `__tests__/helpers/db.test.ts`
- Test `setupTestDatabase()`: verify client connects, schema exists
- Test `withTestTransaction()`: create user inside transaction, verify rollback
- Test `cleanupTestDatabase()`: verify no connection errors after cleanup
- All assertions should pass

**Validation**:
```typescript
// Example test
it('rolls back transaction after test', async () => {
  await withTestTransaction(async (tx) => {
    await tx.user.create({ data: { email: 'test@example.com', password: 'hash', role: 'CLIENT' } })
    const user = await tx.user.findUnique({ where: { email: 'test@example.com' } })
    expect(user).toBeTruthy()
  })

  // After transaction, user should not exist
  const client = getTestPrismaClient()
  const user = await client.user.findUnique({ where: { email: 'test@example.com' } })
  expect(user).toBeNull()
})
```

---

## Task 2: Create Seed Data Helpers

**File**: `__tests__/helpers/seed.ts`

### Implementation Notes

Create factory functions with sensible defaults:

1. **`createTestUser(tx, overrides?)`**
   - Accept Prisma transaction client as first parameter
   - Generate unique email: `test-${Date.now()}-${Math.random()}@example.com`
   - Hash default password: `await bcrypt.hash('password123', 10)`
   - Default role: 'CLIENT'
   - Create appropriate profile based on role:
     - CLIENT: create ClientProfile with companyName, inn
     - SPECIALIST: create SpecialistProfile with techStack, experienceLevel
     - ADMIN: no profile
   - Merge overrides with defaults
   - Return created user with profile

2. **`createTestGig(tx, overrides?)`**
   - Accept transaction client
   - Create client user if `clientId` not provided in overrides
   - Default values:
     - title: 'Test Gig'
     - description: 'Test gig description'
     - budget: 100000
     - serviceFee: 10000 (10%)
     - totalAmount: 110000
     - status: 'OPEN'
     - tags: 'React,TypeScript'
   - Merge overrides
   - Return gig with client relation

3. **`createTestApplication(tx, overrides?)`**
   - Accept transaction client
   - Create gig if `gigId` not provided
   - Create specialist user if `specialistId` not provided
   - Default values:
     - approach: 'Test technical approach'
     - questions: 'Test clarifying questions'
     - estimatedEffort: '2 weeks'
     - status: 'PENDING'
   - Merge overrides
   - Return application with gig and specialist relations

### Test Plan

**What to run**:
```bash
npm run test:unit
```

**What to assert**:
- Create test file `__tests__/helpers/seed.test.ts`
- Test `createTestUser()`: verify user created with defaults, profile exists
- Test `createTestUser()` with overrides: verify custom values applied
- Test `createTestGig()`: verify gig and client created
- Test `createTestApplication()`: verify application, gig, and specialist created
- All entities should have correct relations

**Validation**:
```typescript
it('creates user with defaults', async () => {
  await withTestTransaction(async (tx) => {
    const user = await createTestUser(tx)
    expect(user.email).toContain('test-')
    expect(user.role).toBe('CLIENT')
    expect(user.clientProfile).toBeTruthy()
  })
})

it('creates application with related entities', async () => {
  await withTestTransaction(async (tx) => {
    const app = await createTestApplication(tx)
    expect(app.gig).toBeTruthy()
    expect(app.specialist).toBeTruthy()
    expect(app.approach).toBe('Test technical approach')
  })
})
```

---

## Task 3: Update Test Setup Configuration

**Files**: `__tests__/setup.ts`, `.env.test`

### Implementation Notes

1. **Update `.env.test`**:
   - **Do NOT set a fixed DATABASE_URL for in-memory tests**
   - The database URL will be generated dynamically per worker in `setupTestDatabase()`
   - Keep `.env.test` for other environment variables only
   - If needed for E2E tests, can keep file-based URL but unit tests will override it programmatically

2. **Update `__tests__/setup.ts`**:
   - Import database helpers
   - Add global setup: initialize worker-specific in-memory database before all tests in this worker
   - Add global teardown: cleanup database after all tests in this worker
   - Each Vitest worker will run this setup independently, getting its own database instance
   - Configure Vitest hooks:
     ```typescript
     import { beforeAll, afterAll } from 'vitest'
     import { setupTestDatabase, cleanupTestDatabase } from './helpers/db'

     let testClient: PrismaClient

     beforeAll(async () => {
       // Each worker gets its own database instance
       testClient = await setupTestDatabase()
     })

     afterAll(async () => {
       await cleanupTestDatabase(testClient)
     })
     ```

### Test Plan

**What to run**:
```bash
npm run test:unit
```

**What to assert**:
- Verify no `test.db` file is created in project root or `prisma/` directory
- Verify tests can connect to database
- Verify schema is available (run a simple query)
- Check for any connection errors in test output

**Validation**:
- Run `npm run test:unit`
- Check file system: `ls prisma/*.db` should not show `test.db`
- All existing tests should still pass

---

## Task 4: Update Vitest Configuration

**File**: `vitest.config.ts`

### Implementation Notes

1. Enable parallel execution:
   - Change `fileParallelism: false` to `fileParallelism: true`
   - **This is safe now because**:
     - Each Vitest worker gets its own isolated in-memory database instance (no shared database)
     - Within a worker, tests use transaction rollback for isolation
     - SQLite write locks only affect a single database instance, not across workers

2. Verify other settings:
   - Keep `environment: 'node'`
   - Keep `setupFiles: ['__tests__/setup.ts']`
   - Coverage settings remain unchanged

### Test Plan

**What to run**:
```bash
npm run test:unit
```

**What to assert**:
- Tests run in parallel (check console output for concurrent execution)
- No "database is locked" errors
- All tests pass
- Test execution time is faster than before

**Validation**:
- Run `npm run test:unit` 5 times consecutively
- Verify consistent results (all tests pass every time)
- Measure execution time: should be 30%+ faster than sequential execution
- Check for any race conditions or flaky tests
- **Verify per-worker isolation**: Add temporary logging in `setupTestDatabase()` to print worker ID and database URL, confirm each worker gets unique database instance
- Verify no `SQLITE_BUSY` or "database is locked" errors in output

---

## Task 5: Migrate Existing Integration Tests

**File**: `__tests__/integration/auth.test.ts`

### Implementation Notes

1. Remove manual cleanup code:
   - Delete the entire `beforeEach` block (lines 6-27)
   - Tests will use transaction rollback instead

2. Wrap tests in transactions:
   - Import `withTestTransaction` from helpers
   - Wrap test body in `withTestTransaction(async (tx) => { ... })`
   - Replace `prisma` with `tx` in all database calls

3. Use seed helpers where appropriate:
   - Replace manual user creation with `createTestUser(tx, overrides)`
   - Simplifies test code and improves readability

### Test Plan

**What to run**:
```bash
npm run test:unit __tests__/integration/auth.test.ts
```

**What to assert**:
- Both tests in the file pass
- No manual cleanup code remains
- Tests run faster than before
- Tests can run in parallel with other tests

**Validation**:
```typescript
// Before (manual cleanup):
beforeEach(async () => {
  const testUsers = await prisma.user.findMany({ where: { email: { contains: 'test@' } } })
  // ... 20 lines of cleanup code
})

// After (transaction rollback):
it('creates a new user with hashed password', async () => {
  await withTestTransaction(async (tx) => {
    const user = await createTestUser(tx, {
      email: 'test@example.com',
      role: 'CLIENT',
      companyName: 'Test Company',
      inn: '1234567890'
    })

    expect(user.email).toBe('test@example.com')
    expect(user.role).toBe('CLIENT')
    expect(user.clientProfile?.companyName).toBe('Test Company')
  })
})
```

---

## Task 6: Validate and Measure Performance

### Implementation Notes

1. Run full test suite multiple times:
   - Execute `npm run test:unit` at least 10 times
   - Verify consistent results (no flaky tests)
   - Record execution times

2. Measure performance improvement:
   - Baseline: current execution time with file-based DB and sequential execution
   - New: execution time with in-memory DB and parallel execution
   - Calculate percentage improvement

3. Verify parallel execution:
   - Check Vitest output for concurrent test execution
   - Verify no database lock errors
   - Confirm tests don't interfere with each other

4. Create performance report:
   - Document baseline vs new execution times
   - Note any issues or edge cases discovered
   - Update project documentation if needed

### Test Plan

**What to run**:
```bash
# Run 10 times and measure
for i in {1..10}; do time npm run test:unit; done

# Run with verbose output to see parallel execution
npm run test:unit -- --reporter=verbose
```

**What to assert**:
- All tests pass in all 10 runs
- Average execution time is at least 30% faster
- **No "database is locked" or `SQLITE_BUSY` errors** (critical validation for per-worker isolation)
- No flaky tests (inconsistent pass/fail)
- Verify in verbose output that multiple test files run concurrently

**Validation**:
- Create a simple benchmark script or manually record times
- Compare before/after metrics
- Document results in change proposal or commit message
- Verify acceptance criteria from proposal are met:
  1. ✅ Tests run in parallel without interference
  2. ✅ Test execution time improved by 30%+
  3. ✅ Existing tests pass with minimal modifications
  4. ✅ Seed helpers reduce test code to 1-2 lines
  5. ✅ No manual cleanup code required

---

## Summary

**Total Tasks**: 6
**Estimated Time**: 9-13 hours
**Dependencies**: Tasks should be completed in order (1→2→3→4→5→6)

**Critical Success Factors**:
- **Per-worker database isolation**: Each Vitest worker MUST get unique in-memory database instance using worker ID to avoid SQLite write lock contention and `SQLITE_BUSY` errors
- Transaction rollback must work correctly with Prisma
- In-memory database must support all Prisma features used in tests
- Parallel execution must not cause race conditions
- Performance improvement must be measurable and significant

**Rollback Plan**:
If issues arise, revert changes in reverse order:
1. Disable parallel execution (set `fileParallelism: false`)
2. Restore file-based database in `.env.test`
3. Restore manual cleanup code in test files
4. Remove new helper files
