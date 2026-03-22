# Implementation Tasks: Auth Navigation Updates

## Task 1: Update Homepage Authentication Link

**Implementation:**
- Open `app/page.tsx`
- Locate the "Get Started" button link (currently pointing to `/register`)
- Change the `href` from `/register` to `/auth`
- Verify the link uses Next.js `<Link>` component for client-side navigation
- Ensure button styling and accessibility attributes remain unchanged

**Test Plan:**
- Manual: Navigate to `/` and click "Get Started" → should navigate to `/auth`
- E2E: Verify homepage → `/auth` navigation in new E2E test (Task 6)
- Regression: Run existing homepage tests to ensure no breakage

---

## Task 2: Audit Internal Links to Authentication Pages

**Implementation:**
- Search codebase for all references to `/login` and `/register` in `.tsx` files
- Use command: `grep -r "href.*\/login" app/ --include="*.tsx"` and `grep -r "href.*\/register" app/ --include="*.tsx"`
- Document all findings with file paths and line numbers
- Categorize links:
  - **Update to /auth**: Homepage, navigation bars, general entry points
  - **Keep as-is**: Context-specific links (e.g., register page → login, login page → register)
  - **Verify**: Links that may need role context preserved

**Test Plan:**
- Manual: Review grep output and categorize each link
- Document: Create a list of files to update vs. files to preserve
- No automated test needed for this audit task

---

## Task 3: Update Internal Links to Use /auth Entry Point

**Implementation:**
- Based on Task 2 audit results, update identified links to point to `/auth`
- Likely candidates:
  - Any navigation components with auth links
  - Footer or header components with "Sign Up" or "Login" links
  - Error pages or fallback pages with auth links
- Preserve direct links where role context is already established (e.g., register page secondary button to login)
- Update link text if needed to match new flow (e.g., "Get Started" instead of "Sign Up")

**Test Plan:**
- Manual: Click each updated link and verify navigation to `/auth`
- Visual: Verify link styling remains consistent
- E2E: Updated links covered by new E2E tests (Task 6)
- Regression: Run all existing E2E tests to ensure no navigation breakage

---

## Task 4: Verify Middleware Configuration

**Implementation:**
- Open `middleware.ts`
- Verify `/auth` is included in the matcher configuration (should already be present)
- Verify unauthenticated users can access `/auth` (lines 54-59 already implement this)
- Verify authenticated users are redirected from `/auth` to `/dashboard` (lines 54-57 already implement this)
- No code changes expected - this is a verification task

**Test Plan:**
- Manual: Test as unauthenticated user → navigate to `/auth` → should see auth landing page
- Manual: Test as authenticated user → navigate to `/auth` → should redirect to `/dashboard`
- E2E: Verify in new E2E tests (Task 6)
- Regression: Run existing middleware tests

---

## Task 5: Verify Backward Compatibility for Direct Auth URLs

**Implementation:**
- Test direct navigation to `/login` and `/register`
- Verify no redirects to `/auth` occur for direct access
- Verify query parameters are preserved (e.g., `/login?role=SPECIALIST`)
- Verify existing middleware behavior (authenticated users → `/dashboard`)
- Review middleware code (lines 62-66) to confirm no changes needed
- No code changes expected - this is a verification task

**Test Plan:**
- Manual: Navigate directly to `/login` → should see login page (no redirect to `/auth`)
- Manual: Navigate directly to `/register` → should see register page (no redirect to `/auth`)
- Manual: Navigate to `/login?role=CLIENT` → should see login page with CLIENT pre-selected
- Manual: As authenticated user, navigate to `/login` → should redirect to `/dashboard`
- E2E: Verify in new E2E tests (Task 6)
- Regression: Run existing auth E2E tests

---

## Task 6: Create E2E Tests for Auth Navigation Flow

**Implementation:**
- Create new test file: `__tests__/e2e/auth-navigation.spec.ts`
- Import Playwright test utilities and helpers
- Implement test scenarios:
  1. **Homepage to Login Flow**: Click "Get Started" → select SPECIALIST → click "Войти" → verify at `/login?role=SPECIALIST`
  2. **Homepage to Register Flow**: Click "Get Started" → select CLIENT → click "Зарегестрироватся" → verify at `/register?role=CLIENT`
  3. **Direct Login Access**: Navigate to `/login` → verify page loads → verify can login
  4. **Direct Register Access**: Navigate to `/register` → verify page loads → verify can register
  5. **Authenticated User Redirects**: Login → navigate to `/auth` → verify redirect to `/dashboard`
  6. **Authenticated User Redirects from Login**: Login → navigate to `/login` → verify redirect to `/dashboard`
  7. **Authenticated User Redirects from Register**: Login → navigate to `/register` → verify redirect to `/dashboard`
- Use existing Playwright patterns from `__tests__/e2e/` directory
- Follow existing test structure and naming conventions

**Test Plan:**
- Run: `npm run test:e2e -- auth-navigation.spec.ts`
- Verify all 7 test scenarios pass
- Verify tests run in isolation (no test pollution)
- Verify tests clean up after themselves (logout, clear cookies)
- Run full E2E suite: `npm run test:e2e` → all tests should pass

---

## Task 7: Run Full Test Suite and Verify No Regressions

**Implementation:**
- Run unit tests: `npm run test:unit`
- Run integration tests: `npm test` (or specific integration test files)
- Run E2E tests: `npm run test:e2e`
- Verify all existing tests pass
- Fix any broken tests caused by navigation changes
- Update test snapshots if needed (e.g., homepage link changes)

**Test Plan:**
- Unit tests: `npm run test:unit` → all pass
- Integration tests: `npm test` → all pass
- E2E tests: `npm run test:e2e` → all pass
- Total test count should increase by ~7 tests (new E2E tests from Task 6)
- No existing tests should fail due to navigation changes
- If tests fail, investigate and fix (likely snapshot updates or navigation assertions)

---

## Implementation Order

1. Task 2 (Audit) - understand scope
2. Task 1 (Homepage) - quick win, high visibility
3. Task 3 (Internal Links) - based on audit results
4. Task 4 (Middleware) - verification only
5. Task 5 (Backward Compat) - verification only
6. Task 6 (E2E Tests) - comprehensive coverage
7. Task 7 (Full Test Suite) - final verification

## Rollback Plan

If issues arise:
1. Revert homepage link change: `git checkout app/page.tsx`
2. Revert internal link changes: `git checkout <affected-files>`
3. Remove new E2E tests if they're flaky: `git rm __tests__/e2e/auth-navigation.spec.ts`
4. No middleware changes expected, so no rollback needed there

## Success Criteria

- ✅ Homepage links to `/auth` instead of `/register`
- ✅ Internal links audited and updated appropriately
- ✅ Middleware allows unauthenticated access to `/auth` (verified)
- ✅ Direct access to `/login` and `/register` works (verified)
- ✅ E2E tests cover complete auth navigation flow (7 scenarios)
- ✅ All existing tests pass (no regressions)
- ✅ Total test count increases by ~7 tests
