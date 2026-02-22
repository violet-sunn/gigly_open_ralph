# Implementation Tasks: System Audit

## Task 1: Run Baseline Test Suite

**Objective:** Determine the current health of the test suite after the QA & Polish phase.

**Implementation:**
1. Run `npm run test:unit` and capture full output
2. Run `npm run test:e2e` and capture full output (if dev server is running)
3. Record:
   - Total test count
   - Passing tests
   - Failing tests
   - Skipped tests
   - Execution time
   - Any warnings or errors

**Test Plan:**
- Execute: `npm run test:unit`
- Execute: `npm run test:e2e` (requires dev server)
- Assert: Record actual pass/fail counts
- Assert: Note any unexpected failures or warnings

**Expected Findings:**
- Confirm if all 493+ tests are still passing
- Identify any new test failures introduced during QA & Polish phase
- Verify test execution time is reasonable (< 30s for unit tests)

---

## Task 2: Audit Test Infrastructure for Duplication

**Objective:** Identify redundant test configurations, mock files, or parallel testing setups.

**Implementation:**
1. Search for duplicate test configuration files:
   - `find . -name "vitest.config.*" -o -name "playwright.config.*" -o -name "jest.config.*"`
   - Expected: 1 vitest.config.ts, 1 playwright.config.ts
2. Check for redundant mock files in `__tests__/helpers/`:
   - Review `auth-mocks.ts`, `db.ts`, `seed.ts`, `auth.ts`
   - Look for duplicate session mocking logic
   - Look for duplicate database setup logic
3. Review recent test files (rate-limiting, pagination, password-requirements):
   - Check if they import from `__tests__/helpers/` or reinvent helpers
   - Check if they use `withTestTransaction()` or create their own DB setup
   - Check if they use `withAuthContext()` or create their own session mocks
4. Check for orphaned test files or legacy test scripts:
   - Verify `scripts/legacy-tests/` contains archived scripts
   - Verify no active test files exist outside `__tests__/`

**Test Plan:**
- Execute: File system searches for config files
- Execute: Code review of recent test files
- Assert: Only expected config files exist
- Assert: New tests use established helpers

**Expected Findings:**
- Identify any duplicate vitest/playwright configs
- Identify any tests that bypassed the helper infrastructure
- Identify any redundant mock implementations

---

## Task 3: Reconcile Documentation Against Codebase

**Objective:** Verify that documented features are actually implemented.

**Implementation:**
1. Read `openspec/project.md` "Implemented" section (lines 492-520)
2. For each claimed feature, verify actual implementation:
   - **Rate Limiting:** Check `lib/ratelimit.ts` exists, verify Upstash integration
   - **CSRF Protection:** Verify Next.js 15 built-in protection is active (no custom tokens)
   - **Pagination:** Check `app/dashboard/gigs/page.tsx` and `app/admin/*/page.tsx` for pagination logic
   - **Input Sanitization:** Check for `isomorphic-dompurify` usage in forms
   - **Password Requirements:** Check `lib/validation.ts` or registration action for password validation
   - **Seed Scripts:** Check `prisma/seed.ts` for example data
3. Read `strategic_roadmap.md` section 6.2 MQP
4. Cross-reference completed changes (1-28) against actual codebase
5. Check for "ghost features" (documented but not coded)
6. Check for undocumented major changes (coded but not documented)

**Test Plan:**
- Execute: File existence checks for key modules
- Execute: Code review of claimed features
- Assert: Each documented feature has corresponding implementation
- Assert: Implementation matches documented behavior

**Expected Findings:**
- Confirm all 27 completed changes are actually implemented
- Identify any missing features or stub implementations
- Identify any undocumented features added during QA & Polish

---

## Task 4: Analyze Cross-System Fragility

**Objective:** Identify potential conflicts between newly added systems and existing functionality.

**Implementation:**

### 4.1 Sanitization vs Validation
1. Review `lib/sanitize.ts` (if exists) or DOMPurify usage
2. Check gig creation form: Does DOMPurify strip HTML before Zod validation?
3. Check if sanitization removes characters that Zod expects (e.g., special chars in descriptions)
4. Test scenario: What happens if a user enters `<script>alert('xss')</script>` in gig description?
   - Does sanitization strip it?
   - Does validation still pass?
   - Does the database store the sanitized version?

### 4.2 Pagination vs Mutations
1. Review admin pages: `/admin/users` and `/admin/gigs`
2. Check Server Actions: `suspendUser`, `closeGig`
3. Verify `revalidatePath()` calls after mutations
4. Test scenario: Admin suspends user on page 2
   - Does the UI refresh correctly?
   - Does pagination state break?
   - Does the user disappear from the list?

### 4.3 Rate Limiting vs Tests
1. Review rate limiting implementation in server actions
2. Check if tests mock rate limiting or use real Upstash
3. Check `__tests__/setup.ts` for global rate limit mocking
4. Test scenario: Do E2E tests hit rate limits?
   - Are rate limiters disabled in test environment?
   - Do tests use mocked rate limiters?

### 4.4 Password Validation vs Backward Compatibility
1. Review password validation logic
2. Check if existing users with weak passwords can still login
3. Verify validation only applies to new registrations
4. Test scenario: User with password "123456" (created before validation)
   - Can they still login?
   - Are they forced to change password?

### 4.5 Prisma N+1 Query Audit
1. Review Prisma queries in list views for proper relation loading
2. Check gig browsing page (`app/dashboard/gigs/page.tsx`):
   - Does it use `include: { client: { include: { clientProfile: true } } }` to load company names?
   - Or does it risk 25+ individual queries per page (N+1 problem)?
3. Check admin user management (`app/admin/users/page.tsx`):
   - Does it use `include: { clientProfile: true, specialistProfile: true }` for profile data?
   - Or does it make separate queries for each user's profile?
4. Check gig detail page application lists:
   - Does it eagerly load specialist profiles with applications?
   - Or does it query specialist data individually for each application?
5. Review any other list views that display related data
6. Test scenario: Load gig browsing page with 25 gigs
   - Count actual database queries (should be 2: one for gigs+relations, one for count)
   - If 26+ queries, we have N+1 problem

### 4.6 Next.js 15 Async Params Sweep
1. Scan ALL `page.tsx` files across the project for `params` usage
2. Scan ALL `page.tsx` files for `searchParams` usage
3. Scan ALL `layout.tsx` files for `params` usage
4. Check for synchronous access patterns (BREAKING in Next.js 15):
   - ❌ `function Page({ params, searchParams })` - synchronous destructuring
   - ❌ `const { id } = params` - synchronous property access
   - ❌ `const page = searchParams.page` - synchronous property access
5. Verify async patterns are used (REQUIRED in Next.js 15):
   - ✅ `async function Page({ params, searchParams })`
   - ✅ `const { id } = await params`
   - ✅ `const resolvedSearchParams = await searchParams`
6. Key files to check:
   - `app/dashboard/gigs/[id]/page.tsx` - dynamic route with `params.id`
   - `app/dashboard/gigs/page.tsx` - uses `searchParams` for filters/pagination
   - `app/admin/users/page.tsx` - uses `searchParams` for filters/pagination
   - `app/admin/gigs/page.tsx` - uses `searchParams` for filters/pagination
   - Any other dynamic routes or pages with query parameters
7. Test scenario: Navigate to `/dashboard/gigs/123`
   - If params are accessed synchronously, Next.js 15 will throw runtime error
   - If params are awaited, page loads correctly

**Test Plan:**
- Execute: Code review of interaction points
- Execute: Trace data flow through sanitization → validation → storage
- Execute: Review Server Action mutation patterns
- Assert: Identify potential conflict points
- Assert: Document edge cases that might break

**Expected Findings:**
- Identify if DOMPurify conflicts with Zod validation
- Identify if pagination state breaks after mutations
- Identify if rate limiting blocks tests
- Confirm backward compatibility for password validation
- Identify N+1 query problems in list views (gig browsing, admin tables)
- Identify synchronous params/searchParams access that will break in Next.js 15

---

## Task 5: Generate Comprehensive Audit Report

**Objective:** Produce `audit_report_v1.md` with all findings and actionable recommendations.

**Implementation:**
1. Create `audit_report_v1.md` at project root
2. Structure the report:
   - **Executive Summary:** High-level findings (1-2 paragraphs)
   - **Test Suite Health:** Results from Task 1
   - **Test Infrastructure Audit:** Findings from Task 2
   - **Documentation Reconciliation:** Findings from Task 3
   - **Cross-System Fragility Analysis:** Findings from Task 4
   - **Findings Summary:** Categorized by severity (🟢 🟡 🔴)
   - **Action Plan:** Prioritized list of recommended fixes
3. Use clear severity indicators:
   - 🟢 **Healthy:** No action needed
   - 🟡 **Warning:** Technical debt, should fix eventually
   - 🔴 **Critical:** Must fix before production
4. For each finding, include:
   - Description of the issue
   - Location in codebase (file paths)
   - Potential impact
   - Recommended fix (high-level, not implementation)
5. Prioritize Action Plan by:
   - Critical errors first (broken tests, missing features)
   - Warnings second (technical debt, fragility)
   - Healthy items last (confirmation of good state)

**Test Plan:**
- Execute: Compile all findings from Tasks 1-4
- Execute: Write comprehensive report
- Assert: Report is clear and actionable
- Assert: All findings are categorized by severity
- Assert: Action Plan is prioritized

**Expected Output:**
- `audit_report_v1.md` file at project root
- Report is 500-1500 lines (comprehensive but readable)
- Report provides clear next steps for addressing issues

---

## Notes

- **READ-ONLY:** No code modifications during any task
- **Documentation Only:** Output is a single markdown report
- **Objective Analysis:** Report facts, not opinions
- **Actionable:** Each finding should have a clear recommended fix
