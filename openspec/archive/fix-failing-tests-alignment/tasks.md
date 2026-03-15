# Tasks: fix-failing-tests-alignment

1. **Reproduce failures locally and capture failure inventory**
   - Implementation notes:
     - Run unit/integration and E2E suites separately to isolate scope.
     - Record failing test file paths, test names, and error output.
   - Test plan:
     - Run:
       - `npm run test:unit`
       - `npm run test:e2e`
     - Assert:
       - Output clearly lists the failing tests (baseline for the change).

2. **Classify each failure: spec mismatch vs regression vs flakiness**
   - Implementation notes:
     - For each failing test, identify the product behavior being asserted.
     - Cross-check the corresponding OpenSpec requirement.
   - Test plan:
     - For each failure, link the test to a requirement section in OpenSpec and record the classification.

3. **Align OpenSpec UI route contracts with current app routing (if needed)**
   - Implementation notes:
     - If the current app uses dashboard-scoped routes (e.g. `/dashboard/gigs`, `/dashboard/gigs/new`, `/dashboard/gigs/[id]`) ensure OpenSpec UI spec reflects those canonical routes.
     - Avoid ambiguous dual-route requirements unless both are intentionally supported.
   - Test plan:
     - Run `npm run test:unit` after spec/test updates.
     - Assert route-related tests are updated and pass.

4. **Fix tests that target outdated UI selectors/layout**
   - Implementation notes:
     - Prefer semantic selectors (labels, roles, accessible names) over brittle CSS.
     - Update navigation expectations (e.g., links and redirects) to match current pages.
   - Test plan:
     - Run `npm run test:e2e`.
     - Assert all E2E flows complete without selector failures.

5. **Fix regressions where the application violates OpenSpec requirements**
   - Implementation notes:
     - For each regression, implement the minimal code change to restore compliance.
     - Add/adjust integration tests to prevent recurrence.
   - Test plan:
     - Run `npm run test:unit`.
     - Assert regression is covered by a failing-then-passing test.

6. **Stabilize any flaky tests**
   - Implementation notes:
     - Replace arbitrary timeouts with deterministic waits (URL change, locator visible, network idle where appropriate).
     - Ensure test DB isolation and cleanup patterns are used.
   - Test plan:
     - Run `npm run test:unit` 3 times and `npm run test:e2e` 3 times.
     - Assert consistent green runs.

7. **Final verification and documentation**
   - Implementation notes:
     - Ensure no tests were weakened in a way that reduces meaningful coverage.
     - Summarize key mismatches discovered and how they were resolved.
   - Test plan:
     - Run:
       - `npm run test:unit`
       - `npm run test:e2e`
       - (optional) `npm run test:coverage`
     - Assert all commands exit 0.
