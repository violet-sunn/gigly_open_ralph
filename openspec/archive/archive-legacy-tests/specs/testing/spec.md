# Testing Specification Delta

## MODIFIED Requirements

### Requirement: Test Scripts in package.json

The platform SHALL provide npm scripts for running different types of tests and generating coverage reports.

#### Scenario: Developer runs all tests

**Given** both Vitest and Playwright are configured
**When** the developer runs `npm test`
**Then** Vitest SHALL start in watch mode for rapid feedback
**And** legacy test scripts in `scripts/legacy-tests/` SHALL NOT execute

**Acceptance Criteria**:
- `npm test` runs Vitest in watch mode
- Command completes successfully
- **ADDED:** Legacy scripts in `scripts/legacy-tests/` are not executed
- **ADDED:** Only tests in `__tests__/` directory are executed

---

## ADDED Requirements

### Requirement: Legacy Test Scripts Archive

The platform SHALL maintain an archive of legacy test scripts in `scripts/legacy-tests/` for historical reference, clearly separated from active test infrastructure.

#### Scenario: Legacy scripts are archived and documented

**Given** the project has legacy test scripts from before proper test infrastructure existed
**When** a developer explores the `scripts/` directory
**Then** all legacy test scripts SHALL be located in `scripts/legacy-tests/` subdirectory
**And** a README.md SHALL exist in `scripts/legacy-tests/` explaining their purpose
**And** the README SHALL state these are legacy build verification scripts, not real tests
**And** the README SHALL direct developers to `__tests__/` for real tests
**And** no `test-*.ts` files SHALL exist in the root `scripts/` directory

**Acceptance Criteria**:
- All files matching `scripts/test-*.ts` pattern are moved to `scripts/legacy-tests/`
- `scripts/legacy-tests/README.md` exists
- README explains: legacy status, not maintained, historical reference only
- README directs to `__tests__/` for real tests using Vitest
- No `scripts/test-*.ts` files remain in root `scripts/` directory
- Run `ls scripts/test-*.ts` and verify "No such file or directory"
- Run `ls scripts/legacy-tests/test-*.ts` and verify 26 files exist

#### Scenario: README clearly distinguishes legacy from real tests

**Given** a developer reads `scripts/legacy-tests/README.md`
**When** they want to understand the difference between legacy and real tests
**Then** the README SHALL explain that legacy scripts use custom `pass()`/`fail()` functions
**And** the README SHALL explain that real tests use Vitest framework
**And** the README SHALL state that legacy scripts are not run in CI
**And** the README SHALL state that legacy scripts are preserved for historical reference only

**Acceptance Criteria**:
- README mentions custom test runner (pass/fail functions)
- README mentions Vitest as the current testing framework
- README states scripts are not maintained or run in CI
- README states scripts are for historical reference
- README is clear and concise (under 300 words)

#### Scenario: Legacy scripts are preserved without modification

**Given** legacy test scripts existed in `scripts/` directory
**When** they are moved to `scripts/legacy-tests/`
**Then** all script contents SHALL remain unchanged
**And** all 26 scripts SHALL be preserved
**And** no scripts SHALL be deleted

**Acceptance Criteria**:
- All 26 legacy scripts exist in `scripts/legacy-tests/`
- Script contents are byte-for-byte identical to originals
- No scripts are deleted during archival process
- Run `git diff` on moved files and verify only path changed, not contents

#### Scenario: Real tests continue to work after archival

**Given** legacy scripts have been moved to `scripts/legacy-tests/`
**When** a developer runs `npm run test:unit`
**Then** all real tests in `__tests__/` SHALL execute
**And** all tests SHALL pass
**And** no legacy scripts SHALL be executed
**And** no import errors SHALL occur

**Acceptance Criteria**:
- `npm run test:unit` runs successfully
- All tests in `__tests__/` pass
- No errors related to missing files in `scripts/`
- Test output shows only Vitest tests, not legacy scripts
- Run `npm run test:unit` and verify exit code 0

---

### Requirement: Testing Documentation Update

The platform SHALL update testing documentation to reflect the archival of legacy test scripts and clarify current testing practices.

#### Scenario: TESTING.md documents legacy script archival

**Given** `TESTING.md` exists
**When** a developer reads the testing documentation
**Then** documentation SHALL mention that legacy scripts exist in `scripts/legacy-tests/`
**And** documentation SHALL state that these are archived and not maintained
**And** documentation SHALL direct developers to use Vitest for new tests

**Acceptance Criteria**:
- `TESTING.md` includes note about legacy scripts archive
- Note explains these are historical artifacts, not active tests
- Note directs developers to write new tests in `__tests__/` using Vitest
- Note is brief (1-2 sentences) and placed in appropriate section
