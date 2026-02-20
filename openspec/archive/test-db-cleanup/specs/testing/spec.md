# Testing Specification Delta - Test Database Cleanup

## ADDED Requirements

### Requirement: Test Database Cleanup Script

The platform SHALL provide an npm script to remove test database files that accumulate during test execution.

#### Scenario: Developer cleans test database files

**Given** test database files exist in the project root (memdb_*.db, memdb_*.db-wal, memdb_*.db-shm, test.db)
**When** the developer runs `npm run clean:test-db`
**Then** all test database files SHALL be removed
**And** the command SHALL complete successfully
**And** the command SHALL NOT fail if no test files exist
**And** the command SHALL NOT remove development or production database files

**Acceptance Criteria**:
- Script uses `rimraf 'memdb_*.db*' test.db` for cross-platform compatibility
- Pattern `'memdb_*.db*'` matches: memdb_1.db, memdb_1.db-wal, memdb_1.db-shm
- Command works on Windows, macOS, and Linux (rimraf handles platform differences)
- Command exits with code 0 even if no files exist (rimraf is silent on missing files)
- Command does NOT remove: dev.db, prisma/dev.db, prisma/migrations/*.db, *.sqlite3
- **Verification test:**
  ```bash
  touch memdb_123.db memdb_123.db-wal test.db
  ls memdb_*.db* test.db  # Should show 3 files
  npm run clean:test-db
  ls memdb_*.db* test.db  # Should show "No such file or directory"
  ```

#### Scenario: Developer cleans before running tests

**Given** the developer wants a fresh test environment
**When** the developer runs `npm run test:clean`
**Then** all test database files SHALL be removed first
**And** then the test suite SHALL execute
**And** tests SHALL run with clean database state

**Acceptance Criteria**:
- Script is: `"test:clean": "npm run clean:test-db && npm run test:unit"`
- Cleanup runs BEFORE unit tests (uses `&&` operator)
- Tests execute after cleanup completes successfully
- Command exits with test suite exit code (0 if tests pass, non-zero if tests fail)
- Scope: unit tests only (not E2E tests)
- **Verification test:**
  ```bash
  touch memdb_old.db test.db
  npm run test:clean
  # Old files removed, unit tests run, exit code 0 if tests pass
  ```

#### Scenario: Cleanup script handles missing files gracefully

**Given** no test database files exist in the project root
**When** the developer runs `npm run clean:test-db`
**Then** the command SHALL complete successfully
**And** the command SHALL NOT output errors about missing files
**And** the command SHALL exit with code 0

**Acceptance Criteria**:
- Running cleanup on clean directory succeeds
- No "file not found" errors displayed
- Exit code is 0
- Test: run `npm run clean:test-db` in clean directory, verify exit code 0

#### Scenario: Cleanup script is cross-platform compatible

**Given** the cleanup script is defined in package.json
**When** the script runs on Windows, macOS, or Linux
**Then** the script SHALL execute successfully on all platforms
**And** the script SHALL use cross-platform compatible commands

**Acceptance Criteria**:
- Script uses `rimraf` package for guaranteed cross-platform compatibility
- `rimraf` is available as transitive dependency or installed via `npm i -D rimraf`
- Script works on Windows (PowerShell, CMD) without modification
- Script works on macOS/Linux (bash, zsh) without modification
- No platform-specific syntax (no `rm -f`, `del`, or shell-specific commands)
- Verify: `npm list rimraf` shows package in dependency tree

---

## MODIFIED Requirements

### Requirement: Test Documentation

The platform SHALL provide documentation for writing and running tests.

#### Scenario: Developer reads testing documentation

**Given** testing documentation exists
**When** a developer wants to write tests
**Then** documentation SHALL explain how to run tests
**And** documentation SHALL explain how to write unit tests
**And** documentation SHALL explain how to write integration tests
**And** documentation SHALL explain how to write E2E tests
**And** documentation SHALL explain test database setup
**And** documentation SHALL explain test database cleanup scripts *(ADDED)*

**Acceptance Criteria**:
- `TESTING.md` or similar file exists in project root
- Documentation covers all test types
- Documentation includes code examples
- Documentation explains test scripts and coverage
- **Documentation includes "Test Database Cleanup" section** *(ADDED)*
- **Section explains the problem (test worker files persist)** *(ADDED)*
- **Section shows both scripts with exact commands** *(ADDED)*
- **Section explains when to use each:**
  - `clean:test-db`: After test runs, before git operations
  - `test:clean`: Start tests with clean DB state (debugging)
- **Section includes verification test with exact commands** *(ADDED)*
- **Section notes .gitignore already excludes these files** *(ADDED)*
- **Documentation is concise (under 200 words) and actionable** *(ADDED)*
