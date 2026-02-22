# Proposal: Comprehensive System & Test Infrastructure Audit

## Change Name
`system-audit-v1`

## Problem Statement

The project has recently completed the core development cycle (up to step 6.2 MQP in `strategic_roadmap.md`) and integrated several QA & Polish features:
- Rate Limiting (Upstash Redis)
- CSRF Protection (Next.js 15 built-in)
- Pagination (Gig browsing, Admin pages)
- Input Sanitization (DOMPurify)
- Seed scripts with example data
- Password strength validation

However, there is a **significant risk of architectural drift and test fragmentation**:

### 1. Test Infrastructure Fragmentation Risk
A comprehensive testing system (Vitest + Playwright, 493+ tests) was established *before* the QA & Polish phase. During the polish phase, new tests were added for rate limiting, pagination, password validation, and other features.

**Risk:** The AI agent may have created duplicate configurations, redundant mock files, or parallel testing pipelines instead of integrating seamlessly into the existing environment.

### 2. Documentation Misalignment Risk
The `project.md` and `strategic_roadmap.md` claim certain features are completed (27 changes listed as "Implemented").

**Risk:** The actual codebase might be missing features, using temporary stubs, or implementing features differently than documented.

### 3. Cross-System Regression Risk
New security layers (DOMPurify sanitization, Upstash Rate Limiting) and UI features (Pagination) were added on top of existing business logic.

**Risk:** These new systems might have silently broken existing functionality, tests, or state management without being caught by the test suite.

## Proposed Solution

Conduct a **STRICTLY READ-ONLY** comprehensive audit of the entire repository. The goal is to:
1. Evaluate the integrity of the test infrastructure
2. Reconcile the code against documentation
3. Identify hidden regressions and fragility points
4. Produce a single detailed report: `audit_report_v1.md`

## Constraints & Rules

### CRITICAL: READ-ONLY MODE
- **You MUST NOT write, modify, refactor, or delete ANY application code, configuration files, or tests during this task.**
- You are acting as a Senior Systems Auditor.
- Your only output is the markdown report.
- Do not attempt to fix the bugs you find. Just document them.

### Audit Scope

#### 1. Test Infrastructure Integrity Check
- Search for duplicate testing configurations (multiple `vitest.config.ts`, `playwright.config.ts`, `jest.config.js`)
- Check if new security/pagination tests are using the established helper files (`__tests__/helpers/...`) or if they reinvented database connections and session mocks
- Run the full test suite (`npm test` / `npm run test:unit` / `npm run test:e2e`) and record the actual passing/failing state
- Verify test database isolation is working correctly (no shared state between tests)

#### 2. Documentation vs Reality Reconciliation
- Cross-reference the "Implemented" list in `project.md` against the actual codebase
- Check `strategic_roadmap.md` up to section **6.2 MQP** - verify all steps stated as "Done" are actually implemented
- Verify that documented features (Rate Limiting, CSRF, Pagination, Sanitization) are actually present and functional

#### 3. Cross-System Fragility Check
- **Sanitization vs Validation:** Check if `isomorphic-dompurify` strips out data that causes Prisma/Zod validations to fail
- **Pagination vs Mutations:** On admin pages, if an admin suspends a user on `page=2`, does the UI state break? Are `revalidatePath` calls correctly placed in Server Actions?
- **Rate Limiting vs Tests:** Are rate limiters accidentally blocking E2E tests or seed scripts?
- **Password Validation vs Existing Users:** Are existing users with weak passwords still able to login (backward compatibility)?

## Success Criteria

1. **No code is modified during the execution** - this is a pure audit
2. **A comprehensive `audit_report_v1.md` is generated** at the project root
3. **The report clearly categorizes findings** into:
   - 🟢 **Healthy:** Systems working as expected
   - 🟡 **Warnings:** Technical debt, fragility, or minor issues
   - 🔴 **Critical Errors:** Broken tests, duplicated configs, missing features
4. **The report includes a prioritized "Action Plan"** for fixing identified issues

## Non-Goals

- Fixing any bugs or issues found (that's a separate change)
- Refactoring code or tests
- Adding new tests or features
- Modifying documentation

## Deliverables

- `audit_report_v1.md` - Comprehensive audit report with findings and action plan
