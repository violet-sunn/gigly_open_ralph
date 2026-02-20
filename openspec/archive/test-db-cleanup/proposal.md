# Change Proposal: Test Database Cleanup

## Problem Statement

Test workers create per-worker database files (`memdb_*.db`, `memdb_*.db-wal`, `memdb_*.db-shm`) that persist after test runs, currently cluttering the project root with ~30 files. Additionally, a legacy `test.db` file (empty, 0 bytes) remains from older test configurations. These files accumulate over time and create visual noise in the project directory.

While `.gitignore` already excludes these files from version control, developers need a convenient way to clean them up locally without manually identifying and deleting each file pattern.

## Proposed Solution

Add npm scripts to `package.json` that automate the cleanup of test database files:

```json
{
  "scripts": {
    "clean:test-db": "rimraf 'memdb_*.db*' test.db",
    "test:clean": "npm run clean:test-db && npm run test:unit"
  }
}
```

**Why `rimraf`?** It's the cross-platform standard for file deletion (works on Windows/macOS/Linux without shell-specific syntax like `rm -f` or `del`). It's already available as a transitive dependency via eslint (rimraf@3.0.2).

**Note:** rimraf@3 is deprecated but works perfectly for this use case. Upgrading to v4+ is out of scope for this change.

**Pattern Explanation:**
- `'memdb_*.db*'` - Matches memdb_1.db, memdb_1.db-wal, memdb_1.db-shm, etc.
- `test.db` - Legacy test database file
- **Excludes:** dev.db, prisma/dev.db, prisma/migrations/*.db, *.sqlite3

Document these scripts in `TESTING.md` so developers know when and how to use them.

## Why This Matters

- **Developer Experience**: Reduces manual cleanup burden and keeps project directory tidy
- **Onboarding**: New developers can easily clean up test artifacts without knowing file patterns
- **CI/CD Readiness**: Provides foundation for pre-test cleanup in CI environments
- **Consistency**: Standardizes cleanup approach across the team

## Constraints

- MUST use cross-platform commands (Windows, macOS, Linux) - using `rimraf`
- MUST NOT delete production database files:
  - dev.db
  - prisma/dev.db
  - prisma/migrations/*.db
  - *.sqlite3 (if used elsewhere)
- MUST be safe to run even if no test files exist (no errors on missing files)
- MUST document when to use each script
- If `rimraf` is missing: `npm i -D rimraf` (verify it works without errors)

## Non-Goals

- Automatic post-test cleanup (use manually or via watch-mode cleanup hooks)
- Cleanup of other temporary files:
  - Coverage reports (coverage/)
  - Playwright artifacts (playwright-report/, test-results/)
  - Use separate `clean:e2e-artifacts` script if needed
- Integration with git hooks or pre-commit checks

## Success Criteria

1. `npm run clean:test-db` removes `memdb_*.db*` + `test.db`
2. `npm run test:clean` → clean DB + `npm run test:unit` passes
3. Works on Windows (`rimraf` handles paths correctly)
4. No errors if no DB files exist
5. `TESTING.md` has exact cleanup script documentation
6. **Verification Test:**
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
