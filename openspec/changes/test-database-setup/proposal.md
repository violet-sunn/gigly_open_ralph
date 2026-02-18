# Change Proposal: Test Database Setup

## Change ID
`test-database-setup`

## Problem Statement

The current test infrastructure uses file-based SQLite (`test.db`) with manual cleanup in `beforeEach` hooks. This approach has several limitations:

1. **Slow test execution**: File I/O operations add overhead to every test
2. **No test isolation**: Tests use manual `deleteMany` operations which are error-prone and don't guarantee isolation
3. **Sequential execution only**: `fileParallelism: false` in vitest config prevents parallel test execution due to DB lock concerns
4. **Brittle cleanup logic**: Each test file must manually delete related records in correct order to respect foreign key constraints
5. **No seed data utilities**: Tests manually create test data, leading to duplication and maintenance burden

These issues will become more problematic as the test suite grows.

## Proposed Solution

Implement a robust test database infrastructure with:

1. **In-memory SQLite with per-worker isolation**: Use unique in-memory database instance for each Vitest worker to avoid SQLite write lock contention
2. **Two-level isolation strategy**:
   - **Per-file isolation**: Each test file (worker) gets its own database instance for parallel execution
   - **Per-test isolation**: Within a file, wrap each test in a transaction that rolls back after completion
3. **Database utilities**: Centralized setup/teardown functions in `__tests__/helpers/db.ts`
4. **Seed data helpers**: Factory functions accepting Prisma client for creating test entities within transactions
5. **Parallel execution support**: Enable `fileParallelism: true` with worker-specific database URLs

## Constraints

- MUST maintain backward compatibility with existing tests during migration
- MUST use Prisma's existing client and schema
- MUST support both unit and integration tests
- MUST NOT require changes to Prisma schema
- SHALL use standard Prisma transaction APIs (no custom extensions)
- **MUST provide per-worker database isolation**: Each Vitest worker gets unique in-memory database instance to avoid SQLite write lock contention
- **MUST provide per-test isolation**: Within a test file, use transaction rollback pattern for test isolation

## Non-Goals

- Real-time database replication or advanced features
- Support for databases other than SQLite
- Test data persistence between test runs
- Snapshot testing or database state comparison tools

## Success Criteria

1. Tests run in parallel without interference (verify with `npm run test:unit`)
2. Test execution time improves by at least 30% compared to current file-based approach
3. Existing integration tests pass with minimal modifications
4. New tests can use seed helpers to create test data in 1-2 lines of code
5. No manual cleanup code required in test files

## Implementation Approach

### Phase 1: Database Utilities
Create `__tests__/helpers/db.ts` with:
- `setupTestDatabase()`: Initialize worker-specific in-memory DB with schema
  - Generate unique database URL using `process.env.VITEST_WORKER_ID` or `process.pid`
  - Example: `file:memdb_${workerId}?mode=memory&cache=shared`
  - Run schema migration to create tables
  - Return configured Prisma client instance
- `cleanupTestDatabase()`: Teardown function
- `getTestPrismaClient()`: Return Prisma client configured for current worker (singleton per worker)

### Phase 2: Transaction Rollback
Implement transaction wrapper:
- `withTestTransaction(callback)`: Execute test in transaction, rollback after
- Integrate with Vitest's `beforeEach`/`afterEach` hooks
- Update `__tests__/setup.ts` to configure global test behavior

### Phase 3: Seed Data Helpers
Create `__tests__/helpers/seed.ts` with factory functions:
- `createTestUser(tx, overrides?)`: Create user with sensible defaults (accepts Prisma transaction client)
- `createTestGig(tx, overrides?)`: Create gig with client (accepts Prisma transaction client)
- `createTestApplication(tx, overrides?)`: Create application with specialist and gig (accepts Prisma transaction client)
- All factories accept Prisma client as first parameter to work within test transactions
- Support for creating related entities in one call

### Phase 4: Migration & Validation
- Update existing tests to use new utilities
- Enable parallel execution in vitest config
- Verify all tests pass
- Measure performance improvement

## Risks & Mitigations

**Risk**: SQLite write lock contention when multiple test files run in parallel
**Mitigation**: **CRITICAL** - Each Vitest worker gets its own isolated in-memory database instance using unique database URL (e.g., `file:memdb_${VITEST_WORKER_ID}?mode=memory&cache=shared`). This prevents `SQLITE_BUSY` errors and deadlocks. Within a single test file, tests run sequentially using transaction rollback for isolation.

**Risk**: In-memory database might behave differently from file-based SQLite
**Mitigation**: Both use SQLite engine; differences are minimal. Run full test suite to verify.

**Risk**: Transaction rollback might not work with Prisma's connection pooling
**Mitigation**: Use `prisma.$transaction()` API which is designed for this use case.

**Risk**: Existing tests might break during migration
**Mitigation**: Implement utilities first, migrate tests incrementally, maintain backward compatibility.

## Estimated Effort

- Phase 1 (Database Utilities): 2-3 hours
- Phase 2 (Transaction Rollback): 3-4 hours
- Phase 3 (Seed Data Helpers): 2-3 hours
- Phase 4 (Migration & Validation): 2-3 hours

**Total**: 9-13 hours

## Dependencies

- Existing Prisma schema and client
- Vitest testing framework
- Current test files in `__tests__/`

## References

- Prisma Transactions: https://www.prisma.io/docs/concepts/components/prisma-client/transactions
- Vitest Setup Files: https://vitest.dev/config/#setupfiles
- SQLite In-Memory Databases: https://www.sqlite.org/inmemorydb.html
