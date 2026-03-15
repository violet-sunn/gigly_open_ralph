# Change Proposal: fix-failing-tests-alignment

## Summary
The current automated test suite is failing. This change defines a focused, test-first process to restore green builds by aligning tests with the current application routing, UI structure, and server-action behavior, or by correcting regressions where the application behavior has drifted from the OpenSpec requirements.

## Problem
- Developers report that "current tests fail" and suspect either:
  1) regressions in implemented features, or
  2) test expectations that no longer match the current app layout/functionality.
- The codebase has evolved (e.g., dashboard-scoped routes such as `/dashboard/gigs/...`) and some specs/tests may still assume older routes (e.g., `/gigs/...`).

## Goals
- Restore a deterministic, repeatable green test run.
- Ensure tests validate *current, intended* product behavior as captured in OpenSpec.
- When mismatch exists, prefer updating tests to match the latest approved OpenSpec behavior; if the app is wrong, update the implementation (and keep/adjust tests accordingly).

## Non-Goals
- Adding new product features.
- Large refactors of unrelated code.
- Changing business rules (fee %, lifecycle statuses, authorization rules) unless the OpenSpec is explicitly updated as part of this change.

## Constraints
- Acceptance criteria MUST be objectively verifiable via deterministic commands.
- Any change that updates behavior MUST also update or add tests.
- Any change that updates tests due to spec drift MUST also update the relevant OpenSpec requirement(s) to match the intended behavior.

## Out of Scope (Explicit)
- Performance optimizations.
- New CI setup.
- Migrating test frameworks.

## Primary Risks
- Papering over real regressions by weakening assertions.
- Fixing tests by hardcoding brittle selectors that will break again.

## Proposed Approach
1. Identify failing test files and error messages.
2. Categorize each failure:
   - **Spec mismatch** (tests/specs outdated vs current approved UX/routes)
   - **Regression** (app behavior deviates from spec)
   - **Flaky/non-deterministic test** (timing, async, shared state)
3. Apply minimal fixes:
   - Update route expectations and selectors to match the current UI.
   - Restore app behavior when it’s a regression.
   - Eliminate flakiness by waiting on deterministic UI signals (navigation, specific elements) and using isolated test data.
4. Ensure OpenSpec reflects the intended, current routing and UI contracts.

