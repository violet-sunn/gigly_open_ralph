# Implementation Tasks: Repository Cleanup Audit

## Task 1: Scan Root Directory for Clutter
**Status:** Pending

**Implementation Notes:**
- Use Node.js `fs` module to list files in project root
- Exclude standard directories: `.next`, `node_modules`, `.git`, `.turbo`, `__tests__`, `e2e`, `app`, `components`, `lib`, `prisma`, `scripts`, `public`
- Flag files matching patterns:
  - Stray scripts: `*.js`, `*.ts` (except standard configs like `next.config.ts`, `tailwind.config.ts`, etc.)
  - Temporary files: `temp*.*, `test*.*, `*.tmp`, `*.bak`
  - Text files: `*.txt` (except `LICENSE.txt`, `README.txt`)
- Check for redundant configs:
  - Both `.prettierrc` and `prettier.config.js`
  - Both `.eslintrc` and `eslint.config.js`
  - Multiple TypeScript configs beyond standard ones
- Document findings with path and reason

**Test Plan:**
- Manually verify the report includes root directory section
- Check that standard files (package.json, tsconfig.json, next.config.ts) are NOT flagged
- Verify any actual temporary files in root ARE flagged
- Confirm excluded directories are not scanned

**Acceptance Criteria:**
- Root directory section exists in report
- Standard project files are not flagged
- Temporary/stray files are correctly identified
- Reasoning is clear for each finding

---

## Task 2: Scan Database and Scripts Directories
**Status:** Pending

**Implementation Notes:**
- Scan `prisma/` directory:
  - Flag database backup files: `*.db.bak`, `*.db.old`, `dev.db-*`, `test.db-*`
  - Flag multiple seed files (keep only `seed.ts`)
  - Flag abandoned migration files (if any exist outside migrations/ folder)
- Scan `scripts/` directory:
  - Flag temporary scripts: `test*.ts`, `temp*.ts`, `old*.ts`, `*backup*.ts`
  - Flag scripts with dates in names: `script-2024-*.ts` (likely one-off executions)
  - Check if `legacy-tests/` subdirectory exists and document its contents
- Document findings with path, reason, and suggested action (DELETE, ARCHIVE, or INVESTIGATE)

**Test Plan:**
- Manually verify the report includes "Database & Migration Artifacts" section
- Manually verify the report includes "Scripts & Utilities" section
- Check that `prisma/schema.prisma` and `prisma/seed.ts` are NOT flagged
- Verify any actual backup files ARE flagged
- Confirm reasoning explains why each file is suspicious

**Acceptance Criteria:**
- Database artifacts section exists in report
- Scripts section exists in report
- Standard files (schema.prisma, seed.ts) are not flagged
- Backup files and temporary scripts are correctly identified
- Suggested actions are appropriate (DELETE for obvious temp files, INVESTIGATE for unclear cases)

---

## Task 3: Scan Application Structure
**Status:** Pending

**Implementation Notes:**
- Recursively scan `app/`, `components/`, and `lib/` directories
- Flag empty directories (directories with no files, only subdirectories don't count)
- Flag temporary component files in `components/`:
  - Patterns: `Test*.tsx`, `Old*.tsx`, `*Temp*.tsx`, `*Backup*.tsx`, `*Copy*.tsx`
  - Case-insensitive matching
- Flag temporary utility files in `lib/`:
  - Patterns: `temp*.ts`, `test*.ts`, `*backup*.ts`, `*old*.ts`
- Flag duplicate or unused layout files in `app/`:
  - Multiple `layout.tsx` files at same level
  - `page.tsx` files in unexpected locations
- Document findings with full relative path from project root

**Test Plan:**
- Manually verify the report includes "Application Structure" section
- Check that active components (Header, Footer, GigCard, etc.) are NOT flagged
- Check that active utilities (session.ts, prisma.ts, etc.) are NOT flagged
- Verify any actual temporary files ARE flagged
- Confirm empty directories are identified (if any exist)

**Acceptance Criteria:**
- Application structure section exists in report
- Active production files are not flagged
- Temporary/test files are correctly identified
- Empty directories are documented
- Paths are relative and use forward slashes

---

## Task 4: Scan Test Infrastructure
**Status:** Pending

**Implementation Notes:**
- Scan `__tests__/` directory recursively:
  - Flag test files not following naming convention: files not matching `*.test.ts` or `*.spec.ts`
  - Flag orphaned database files: `*.db`, `*.sqlite` files outside of `.tmp/` directory
  - Flag temporary test files: `test1.ts`, `temp*.test.ts`, `old*.test.ts`
  - Check for unused mock/fixture files (files in `mocks/` or `fixtures/` subdirectories)
- Scan `e2e/` directory:
  - Flag test files not following Playwright convention: files not matching `*.spec.ts`
  - Flag temporary or backup test files
- Document test infrastructure health:
  - Count of properly named test files
  - Count of improperly named test files
  - Count of orphaned artifacts

**Test Plan:**
- Manually verify the report includes "Test Infrastructure" section
- Check that properly named test files (e.g., `gig-creation.test.ts`) are NOT flagged
- Check that helper files (e.g., `helpers/db.ts`, `helpers/auth.ts`) are NOT flagged
- Verify any improperly named test files ARE flagged
- Confirm orphaned database files are identified

**Acceptance Criteria:**
- Test infrastructure section exists in report
- Properly named test files are not flagged
- Test helper files are not flagged
- Improperly named or temporary test files are identified
- Orphaned database files are documented

---

## Task 5: Generate Cleanup Report
**Status:** Pending

**Implementation Notes:**
- Aggregate all findings from Tasks 1-4
- Generate `cleanup_report_v1.md` at project root with structure:
  1. **Header**: Title, audit date/time, project name, total files scanned
  2. **Executive Summary**: Total findings count, breakdown by category, overall assessment
  3. **Exclusions**: List of excluded directories with reasons
  4. **Findings by Category**:
     - Root Directory Clutter
     - Database & Migration Artifacts
     - Scripts & Utilities
     - Application Structure
     - Test Infrastructure
  5. **Each Finding**: Path (inline code), reason, suggested action, severity indicator (🔴🟡🟢)
  6. **Recommendations**: Cleanup prioritization, warnings about careful review
- Use consistent Markdown formatting:
  - H1 for title
  - H2 for categories
  - H3 for subsections
  - H4 or list items for individual findings
  - Inline code for paths
  - Emojis for severity (🔴 high, 🟡 medium, 🟢 low, ✅ clean)
- If a category has zero findings, show "✅ No issues found"

**Test Plan:**
- Verify `cleanup_report_v1.md` exists at project root
- Check report structure matches specification
- Verify all required sections are present
- Confirm findings are grouped by category
- Check that paths use forward slashes and are relative to root
- Verify severity indicators are used consistently
- Confirm executive summary has accurate counts
- Check that recommendations section provides actionable guidance

**Acceptance Criteria:**
- Report file exists at project root
- Report follows Markdown formatting standards
- All required sections are present and properly formatted
- Findings are clearly documented with path, reason, and suggested action
- Executive summary provides accurate overview
- Recommendations are actionable and prioritized
- Report is human-readable and professional

---

## Verification Checklist

After completing all tasks, verify:
- [ ] No files were deleted, moved, renamed, or modified during the audit
- [ ] `cleanup_report_v1.md` exists at project root
- [ ] Report includes all five category sections
- [ ] Each finding has path, reason, and suggested action
- [ ] Standard project files are not flagged
- [ ] Temporary/suspicious files are correctly identified
- [ ] Report is formatted consistently with Markdown best practices
- [ ] Executive summary provides accurate overview
- [ ] Recommendations section guides cleanup prioritization
