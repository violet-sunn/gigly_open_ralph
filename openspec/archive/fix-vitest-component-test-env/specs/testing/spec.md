# Testing Spec Delta — Fix Vitest component test environment for onboarding UI tests

## ADDED Requirements

### Requirement: Deterministic DOM (jsdom) opt-in for component tests

Vitest MUST use `node` as the default test environment.

Vitest MUST run DOM-dependent component tests in a `jsdom` environment using a deterministic, repository-standard opt-in mechanism.

#### Scenario: Node-only tests run in node by default
- GIVEN a test file that does not match the component-test pattern
- WHEN a developer runs `npm run test:unit`
- THEN Vitest MUST execute that test using the `node` environment
- AND the test MUST NOT require `window` / DOM globals to exist

**Acceptance Criteria:**
- Vitest config sets default environment to `node`.
- Running an existing integration test suite succeeds without requiring DOM globals.

#### Scenario: Component tests run in jsdom automatically by directory/pattern
- GIVEN a component test file placed under the repository’s component test pattern (e.g., `__tests__/unit/components/**`)
- WHEN a developer runs `npm run test:unit`
- THEN Vitest MUST execute that test using the `jsdom` environment
- AND `window` and `document` MUST be available

**Acceptance Criteria:**
- Vitest config maps the component-test path pattern to `jsdom` (e.g. via `environmentMatchGlobs`).
- The three onboarding suites execute under jsdom:
  - `__tests__/unit/components/onboarding/EmptyState.test.tsx`
  - `__tests__/unit/components/onboarding/WelcomeModal.test.tsx`
  - `__tests__/unit/components/onboarding/ProfileCompletionCard.test.tsx`

---

### Requirement: RTL matchers MUST be available in jsdom component tests

For tests running in `jsdom`, the repo MUST register jest-dom style matchers compatible with Vitest.

#### Scenario: `toBeInTheDocument` matcher works in component tests
- GIVEN a component test running in `jsdom`
- WHEN the test asserts `expect(element).toBeInTheDocument()`
- THEN the assertion MUST run without throwing “Invalid Chai property” or missing-matcher errors

**Acceptance Criteria:**
- A jsdom-only setup file imports `@testing-library/jest-dom/vitest`.
- The three onboarding component suites pass.

---

### Requirement: jsdom setup MUST provide required browser API polyfills (minimal)

For tests running in `jsdom`, the repo MUST provide minimal polyfills for browser APIs used by onboarding components, but ONLY those required to make the failing suites pass.

#### Scenario: Missing browser APIs do not crash component tests
- GIVEN onboarding component tests that depend on browser APIs (e.g., `matchMedia`, `ResizeObserver`, `TextEncoder`)
- WHEN the suites are executed under `jsdom`
- THEN the suites MUST NOT fail due to missing global browser APIs

**Acceptance Criteria:**
- jsdom setup provides the minimal set of polyfills indicated by the baseline failures.
- `npm run test:unit` passes.

---

### Requirement: Next.js client-only modules MUST be test-safe in component tests

For tests running in `jsdom`, Next.js client-only modules used by onboarding components (e.g. `next/link`) MUST render or be mocked in a stable way.

#### Scenario: Components rendering `next/link` do not crash tests
- GIVEN an onboarding component test that renders a component using `next/link`
- WHEN the component is rendered in RTL
- THEN the render MUST succeed
- AND the Link MUST be interactable as a normal anchor element for test assertions

**Acceptance Criteria:**
- A jsdom-only mock for `next/link` is provided (if required by baseline failures).
- The three onboarding component suites pass.

---

### Requirement: `npm test` MUST be green

#### Scenario: Developer runs the full test suite
- GIVEN a clean working tree and installed dependencies
- WHEN the developer runs `npm test`
- THEN the command MUST exit with code 0
- AND the three onboarding component suites MUST pass

**Acceptance Criteria:**
- `npm test` exits 0 locally.
- The suites listed in this change pass consistently across multiple runs.
