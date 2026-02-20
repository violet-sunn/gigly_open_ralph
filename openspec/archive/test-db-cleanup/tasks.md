# Implementation Tasks: Test Database Cleanup

## Task 1: Add cleanup script to package.json

**Implementation Notes**:
- Add `clean:test-db` script that removes test database files
- Use `rimraf` for cross-platform compatibility (works on Windows/macOS/Linux)
- `rimraf` is already available as transitive dependency via eslint (rimraf@3.0.2)
- No need to install - verify with: `npm list rimraf`
- **Exact script to add:**
  ```json
  "clean:test-db": "rimraf 'memdb_*.db*' test.db"
  ```
- Pattern explanation:
  - `'memdb_*.db*'` matches memdb_1.db, memdb_1.db-wal, memdb_1.db-shm
  - `test.db` matches legacy test database
  - **Does NOT match:** dev.db, prisma/dev.db, *.sqlite3

**Test Plan**:
1. Verify rimraf is available:
   ```bash
   npm list rimraf
   # If not found: npm i -D rimraf
   ```

2. Create test database files:
   ```bash
   touch memdb_123.db memdb_123.db-wal memdb_456.db-shm test.db
   ```

3. Verify files exist:
   ```bash
   ls memdb_*.db* test.db
   # Should show: memdb_123.db memdb_123.db-wal memdb_456.db-shm test.db
   ```

4. Run cleanup script:
   ```bash
   npm run clean:test-db
   ```

5. Verify all test files removed:
   ```bash
   ls memdb_*.db* test.db
   # Should output: "No such file or directory" or "cannot access"
   ```

6. Verify production DB NOT removed (if dev.db exists):
   ```bash
   ls dev.db
   # Should still exist if it was there before
   ```

7. Test idempotency (run cleanup on clean directory):
   ```bash
   npm run clean:test-db
   echo $?
   # Should exit with code 0, no errors
   ```

8. Test on Windows (if available):
   ```cmd
   npm run clean:test-db
   # Should work without "command not found" errors
   ```

---

## Task 2: Add test:clean script to package.json

**Implementation Notes**:
- Add `test:clean` script that runs cleanup before unit tests
- Chain commands: cleanup first, then run tests
- Use `&&` to ensure cleanup completes before tests run
- **Exact script to add:**
  ```json
  "test:clean": "npm run clean:test-db && npm run test:unit"
  ```
- **Scope:** Unit tests only (not E2E tests)
- If E2E cleanup needed later, create separate `test:e2e:clean` script

**Test Plan**:
1. Create test database files:
   ```bash
   touch memdb_old.db memdb_old.db-wal test.db
   ```

2. Verify files exist:
   ```bash
   ls memdb_*.db* test.db
   # Should show the created files
   ```

3. Run test:clean script:
   ```bash
   npm run test:clean
   ```

4. Verify behavior:
   - Old test files are removed before tests start
   - Test suite executes (unit tests)
   - Exit code matches test suite result (0 if tests pass, non-zero if fail)
   - New memdb_*.db files may be created during test run (expected)

5. Check exit code:
   ```bash
   npm run test:clean
   echo $?
   # Should be 0 if all tests pass
   ```

6. Verify cleanup happens BEFORE tests:
   - Add temporary console.log to a test file
   - Run `npm run test:clean`
   - Verify old files gone before test output appears

---

## Task 3: Document cleanup scripts in TESTING.md

**Implementation Notes**:
- Add new section after "Coverage Report" section (around line 37 in TESTING.md)
- Place before "Writing Tests" section to keep all "Running Tests" content together
- Section title: "## Test Database Cleanup"
- **Exact text to add:**

```markdown
## Test Database Cleanup

Test workers create per-worker database files (`memdb_*.db`, `memdb_*.db-wal`, `memdb_*.db-shm`) that persist after test runs. Use these scripts to clean them up:

\`\`\`bash
npm run clean:test-db    # Remove memdb_*.db*, test.db (safe, cross-platform)
npm run test:clean       # Clean DB + run unit tests
\`\`\`

**When to use:**
- `clean:test-db`: After test runs leave artifacts, before `git status`/`git add`
- `test:clean`: Start tests with guaranteed clean DB state (useful for debugging)

**Verification test:**
\`\`\`bash
# Create test files
touch memdb_123.db memdb_123.db-wal test.db

# Verify they exist
ls memdb_*.db* test.db  # Should show 3 files

# Run cleanup
npm run clean:test-db

# Verify removal
ls memdb_*.db* test.db  # Should show "No such file or directory"
\`\`\`

**Note:** `.gitignore` already excludes these files from version control. This cleanup is for local development only.
```

**Test Plan**:
1. Open TESTING.md and locate the new section

2. Verify section includes:
   - Clear explanation of the problem (test worker files)
   - Both script commands with descriptions
   - "When to use" guidance
   - Verification test with exact commands
   - Note about .gitignore

3. Follow the verification test exactly as documented:
   ```bash
   touch memdb_123.db memdb_123.db-wal test.db
   ls memdb_*.db* test.db  # Should show 3 files
   npm run clean:test-db
   ls memdb_*.db* test.db  # Should show "No such file or directory"
   ```

4. Verify documentation is:
   - Concise (under 200 words)
   - Actionable (commands can be copy-pasted)
   - Clear about when to use each script

5. Check placement in TESTING.md:
   - Should be after "Coverage Report" section (line ~37)
   - Should be before "Writing Tests" section (line ~39)
   - Keeps all "Running Tests" related content together
   - Natural flow: run tests → clean up artifacts

---

## Task 4: Verify .gitignore coverage (verification only)

**Implementation Notes**:
- This is a verification task, NOT a modification task
- Check that .gitignore already contains patterns for test database files
- Expected patterns (already present):
  - `memdb_*.db`
  - `memdb_*.db-wal`
  - `memdb_*.db-shm`
  - `test.db`
- If patterns are missing, add them (but they should already be there based on project.md)
- Document findings in task completion notes

**Test Plan**:
1. Check .gitignore file:
   ```bash
   grep -E "(memdb_|test\.db)" .gitignore
   ```
2. Verify output includes:
   - memdb_*.db
   - memdb_*.db-wal
   - memdb_*.db-shm
   - test.db
3. Create a test database file and verify git ignores it:
   ```bash
   touch memdb_test.db
   git status
   # Should NOT show memdb_test.db as untracked
   ```
4. Clean up test file:
   ```bash
   rm memdb_test.db
   ```
5. Document that .gitignore already has correct patterns (no changes needed)

---

## Task 5: Verify rimraf availability and test cleanup

**Implementation Notes**:
- Verify `rimraf` is available as transitive dependency
- Test that cleanup script works correctly
- `rimraf` handles cross-platform differences automatically (no platform-specific code needed)
- rimraf@3.0.2 is deprecated but works fine for this use case

**Test Plan**:
1. Verify rimraf is available:
   ```bash
   npm list rimraf
   # Should show: eslint → file-entry-cache → flat-cache → rimraf@3.0.2
   ```

2. Test cleanup on current platform:
   ```bash
   touch memdb_test.db memdb_test.db-wal test.db
   npm run clean:test-db
   ls memdb_*.db* test.db 2>&1
   # Should show "No such file or directory" (Linux/Mac) or "cannot access" (Windows)
   ```

3. Test idempotency (no files present):
   ```bash
   npm run clean:test-db
   echo $?
   # Should exit with code 0, no errors
   ```

4. Verify production DB safety:
   ```bash
   ls dev.db
   # dev.db should still exist (not removed by cleanup)
   ```

5. Document completion:
   - Confirmed rimraf@3.0.2 available
   - Cleanup script works correctly
   - Production files safe

---

## Summary

**Total Tasks**: 5
**Estimated Effort**: 1-2 hours
**Risk Level**: Low (non-breaking change, additive only)

**Dependencies**:
- Task 2 depends on Task 1 (test:clean uses clean:test-db)
- Task 3 depends on Tasks 1 and 2 (documents the scripts)

**Rollback Plan**:
- Remove added scripts from package.json
- Remove documentation section from TESTING.md
- No database changes or code changes required
