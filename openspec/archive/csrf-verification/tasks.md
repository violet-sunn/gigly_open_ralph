# Implementation Tasks: CSRF Verification

## Task 1: Research Next.js 15 CSRF Protection Mechanism

**Implementation Notes:**
- Read Next.js 15 documentation on Server Actions security
- Understand that Next.js implements CSRF protection via **Origin header matching** (NOT tokens)
- Next.js compares the `Origin` header to the `Host` header on Server Action requests
- If Origin doesn't match Host, the request is rejected with 403 Forbidden
- Identify configuration options that could weaken protection: `serverActions.allowedOrigins`
- Document findings: Origin-based protection, no tokens involved, default is secure

**Test Plan:**
- No automated tests for this task (research only)
- Manual verification: Review Next.js 15 release notes and Server Actions security documentation
- Expected outcome: Clear understanding that CSRF protection uses Origin header matching (no tokens)

---

## Task 2: Verify Next.js Configuration Does Not Disable CSRF

**Implementation Notes:**
- Review `next.config.ts` (or `next.config.js`) for settings that might weaken CSRF protection
- **Critical check**: Look for `serverActions.allowedOrigins` configuration
  - If present, verify it does NOT contain wildcards (`*`, `*.example.com`)
  - Verify it does NOT contain untrusted third-party domains
  - Verify no development origins are allowed in production
  - Preferred: This configuration should NOT exist (default is most secure)
- Check middleware (`middleware.ts`) to ensure it doesn't bypass Origin checks
- Document configuration requirements: avoid `allowedOrigins` unless absolutely necessary

**Test Plan:**
- Manual verification: Review `next.config.ts` and `middleware.ts`
- Automated test: Create unit test that parses config and checks for dangerous `allowedOrigins` patterns
- Run: `npm test -- config-validation.test.ts`
- Assert: No `serverActions.allowedOrigins` with wildcards or untrusted domains
- Expected outcome: Configuration is CSRF-safe (no allowedOrigins or only trusted origins)

---

## Task 3: Create CSRF Protection Verification Tests

**Implementation Notes:**
- Create test file: `e2e/csrf-protection.spec.ts` (use existing Playwright E2E infrastructure)
- Test at least 3 different Server Actions: `login`, `createGig`, `sendMessage`
- For each Server Action, create 2 tests:
  1. **Same-origin request** (legitimate) - should succeed
  2. **Cross-origin request** (CSRF attack simulation) - should fail with 403

**Critical: How to simulate CSRF attacks in Playwright:**

Next.js generates action IDs dynamically per build, so you CANNOT hardcode them. Use one of these approaches:

**Approach 1: Intercept and modify Origin header (RECOMMENDED)**
```typescript
// Intercept legitimate form submission and rewrite Origin header
test('Server Action rejects cross-origin requests', async ({ page }) => {
  await page.goto('/login');

  // Intercept the Server Action request and modify Origin header
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (request.method() === 'POST' && request.headers()['next-action']) {
      // Rewrite Origin header to simulate CSRF attack
      await route.continue({
        headers: {
          ...request.headers(),
          'origin': 'https://malicious-site.com'
        }
      });
    } else {
      await route.continue();
    }
  });

  // Fill form and submit (will be intercepted)
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Assert: Next.js should reject with error
  await expect(page.locator('text=/origin/i')).toBeVisible();
});
```

**Approach 2: Extract action ID from DOM**
```typescript
// Navigate to page, extract action ID, then make direct request
test('Server Action rejects cross-origin requests', async ({ page }) => {
  await page.goto('/login');

  // Extract action ID from form
  const formAction = await page.locator('form').getAttribute('action');
  const actionId = formAction; // or parse from hidden input

  // Make direct request with spoofed Origin
  const response = await page.request.post('http://localhost:3000/', {
    headers: {
      'Origin': 'https://malicious-site.com',
      'Next-Action': actionId,
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    data: JSON.stringify([/* action arguments */])
  });

  expect(response.status()).toBe(403);
});
```

**Recommended: Use Approach 1** (route interception) as it more accurately simulates a real CSRF attack.

- Use existing Playwright setup (playwright.config.ts already exists)
- Reuse existing test helpers if applicable
- Document test methodology in comments

**Test Plan:**
- Run: `npm run test:e2e -- csrf-protection`
- Assert for same-origin requests:
  - Server Action executes successfully
  - Expected data is created/updated
  - Response status is 200 or appropriate success code
- Assert for cross-origin requests (spoofed Origin):
  - Server Action is blocked by Next.js
  - Response status is 403 Forbidden or error message visible
  - No data is created/updated
  - Server Action handler never executes
- Run all existing tests: `npm test` (ensure no regressions in 493+ tests)
- Expected outcome: All 6+ new CSRF tests passing, all existing tests still passing

---

## Task 4: Add CSRF Requirements to Security Specification

**Implementation Notes:**
- Update `openspec/specs/security/spec.md` with CSRF requirements
- Add new section: "CSRF Protection" after rate limiting section
- Include requirements for:
  - CSRF protection verification (Origin-based, not token-based)
  - Configuration documentation (serverActions.allowedOrigins risks)
  - Test coverage (E2E tests with spoofed Origin headers)
  - Monitoring procedures
- Use MUST/SHALL language for requirements
- Include scenario-based acceptance criteria
- Clarify that Next.js uses Origin header matching, not CSRF tokens

**Test Plan:**
- Manual verification: Review updated specification
- Automated test: Run `npm test` to ensure existing security tests still pass
- Assert: Specification accurately describes Origin-based CSRF protection
- Expected outcome: Security spec updated with accurate CSRF section (no mention of tokens)

---

## Task 5: Document CSRF Protection in Project Documentation

**Implementation Notes:**
- Update `openspec/project.md` in the "Stack" or "Architecture" section
- Add CSRF protection explanation:
  - Next.js 15 provides built-in CSRF protection for Server Actions via **Origin header matching**
  - Next.js compares the `Origin` header to the `Host` header and rejects mismatches
  - **No CSRF tokens are used** (Origin-based protection only)
  - No custom implementation needed
  - Protection is enabled by default
  - Configuration risk: `serverActions.allowedOrigins` should be avoided
  - How to verify it's working (reference E2E tests in `e2e/csrf-protection.spec.ts`)
- Keep documentation concise but technically accurate

**Test Plan:**
- Manual verification: Review updated documentation
- Peer review: Have another developer read and confirm clarity
- Assert: Documentation clearly explains Origin-based CSRF protection (no mention of tokens)
- Expected outcome: Project documentation includes accurate CSRF section

---

## Task 6: Create CSRF Verification Checklist

**Implementation Notes:**
- Create or update deployment/security checklist document
- Add CSRF verification steps:
  - Run CSRF protection E2E tests before deployment (`npm run test:e2e -- csrf-protection`)
  - Verify `next.config.ts` has no `serverActions.allowedOrigins` with wildcards or untrusted domains
  - Confirm no middleware bypasses Origin header checks
  - Verify all 493+ existing tests still pass (no regressions)
- Add to code review checklist:
  - Check for `serverActions.allowedOrigins` configuration changes
  - Verify new Server Actions are covered by CSRF E2E tests
  - Ensure no middleware modifications that could bypass Origin checks
- Document in `SECURITY.md` or similar file

**Test Plan:**
- Manual verification: Review checklist completeness and accuracy
- Process test: Use checklist during next deployment
- Assert: Checklist covers all Origin-based CSRF verification steps
- Expected outcome: Checklist created with accurate CSRF verification steps

---

## Task 7: Add CSRF Tests to CI/CD Pipeline

**Implementation Notes:**
- Verify CSRF E2E tests run in existing CI/CD pipeline
- E2E tests should already be included in pipeline (Playwright tests)
- If using GitHub Actions, ensure `e2e/csrf-protection.spec.ts` is included in E2E test runs
- Add explicit CSRF test step if needed for visibility in CI/CD output
- Configure pipeline to fail if CSRF tests fail
- Document CI/CD integration in `TESTING.md`
- Ensure all 493+ existing tests continue to run and pass

**Test Plan:**
- Manual verification: Trigger CI/CD pipeline and verify CSRF E2E tests run
- Assert: CSRF tests appear in CI/CD output (look for `csrf-protection.spec.ts`)
- Assert: Pipeline fails if CSRF tests fail (test by temporarily breaking a test)
- Assert: All existing tests still run (no regressions in test suite)
- Expected outcome: CSRF E2E tests integrated into existing CI/CD pipeline

---

## Task 8: Document CSRF Testing Methodology

**Implementation Notes:**
- Update `TESTING.md` with CSRF testing section
- Explain how to write CSRF tests for new Server Actions
- Document test patterns and best practices
- Include example test code showing how to use `page.route()` to intercept and modify Origin header
- Explain Origin-based protection (not token-based)
- Clarify that tests use existing Playwright E2E infrastructure
- **Critical**: Document that Next.js action IDs are dynamic - do NOT hardcode them

**Example to include in documentation:**
```typescript
// Simulate CSRF attack by intercepting form submission and rewriting Origin header
test('Server Action rejects cross-origin requests', async ({ page }) => {
  await page.goto('/login');

  // Intercept Server Action requests and modify Origin header
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (request.method() === 'POST' && request.headers()['next-action']) {
      // Rewrite Origin header to simulate CSRF attack from malicious site
      await route.continue({
        headers: {
          ...request.headers(),
          'origin': 'https://malicious-site.com'
        }
      });
    } else {
      await route.continue();
    }
  });

  // Fill and submit form (will be intercepted with spoofed Origin)
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Assert: Next.js rejects origin mismatch
  await expect(page.locator('text=/origin/i')).toBeVisible();
});
```

**Alternative approach (extract action ID from DOM):**
```typescript
// Navigate to page, extract dynamic action ID, then make direct request
test('Server Action rejects cross-origin requests', async ({ page }) => {
  await page.goto('/login');

  // Extract action ID from form (Next.js generates these dynamically)
  const formAction = await page.locator('form').getAttribute('action');

  // Make direct request with spoofed Origin
  const response = await page.request.post('http://localhost:3000/', {
    headers: {
      'Origin': 'https://malicious-site.com',
      'Next-Action': formAction,
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    data: JSON.stringify([/* action arguments */])
  });

  expect(response.status()).toBe(403);
});
```

**Recommended: Use route interception approach** (first example) as it more accurately simulates real CSRF attacks.

**Test Plan:**
- Manual verification: Review documentation clarity
- Practical test: Have another developer write a CSRF test using the documentation
- Assert: Documentation clearly explains Origin-based protection and testing methodology
- Assert: Documentation warns against hardcoding action IDs
- Expected outcome: TESTING.md includes accurate CSRF testing guide with working code examples

---

## Verification Checklist

After completing all tasks, verify:

- [ ] CSRF protection mechanism is understood: Origin header matching (NOT tokens)
- [ ] Configuration verified: No `serverActions.allowedOrigins` with wildcards or untrusted domains
- [ ] At least 6 CSRF E2E tests are passing (2 per Server Action × 3 Server Actions)
- [ ] Tests use `page.request.post()` with spoofed Origin headers to simulate attacks
- [ ] Security specification accurately describes Origin-based CSRF protection
- [ ] Project documentation explains Origin header matching (no mention of tokens)
- [ ] Deployment checklist includes CSRF verification steps
- [ ] CSRF E2E tests run in CI/CD pipeline
- [ ] TESTING.md includes CSRF testing guide with code examples
- [ ] All existing 493+ tests still pass (no regressions)
- [ ] Team is aware of Origin-based CSRF protection mechanism

---

## Notes

- **Priority**: High (security-critical)
- **Estimated effort**: 4-7 hours total
- **Dependencies**: Next.js 15+, existing Playwright E2E infrastructure, existing Vitest unit/integration infrastructure
- **Breaking changes**: None (verification only)
- **Rollback plan**: Not applicable (documentation/testing only)
- **Critical**: Use existing test infrastructure - do NOT create new test setup/config files
- **Critical**: Ensure all 493+ existing tests continue to pass
