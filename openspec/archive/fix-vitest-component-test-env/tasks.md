# Tasks: Fix Vitest component test environment for onboarding UI tests (RTL)

1. **Capture & document current failures (baseline)**
   - Implementation notes:
     - Run the three failing suites and record the exact error messages (missing globals, matcher errors, Next.js module issues).
     - Identify whether failures indicate missing jsdom, missing `@testing-library/jest-dom`, missing polyfills (`TextEncoder`, `ResizeObserver`, `matchMedia`), or Next.js-specific mocks.
   - Test plan:
     - Run `npm run test:unit -- __tests__/unit/components/onboarding/EmptyState.test.tsx` (and the other two).
     - Save key stack traces in the PR description / notes (no code changes yet).

2. **Define deterministic jsdom opt-in for component tests**
   - Implementation notes:
     - Keep Vitest default environment as `node`.
     - Enable `jsdom` only for component tests via one of:
       - `environmentMatchGlobs` pattern matching `__tests__/unit/components/**/*.test.tsx`, or
       - Per-file `// @vitest-environment jsdom` pragma (only if glob mapping is insufficient).
     - Prefer a directory-based convention so future component tests “just work” when placed in the right folder.
   - Test plan:
     - Run a known node-only integration test file to ensure it still runs in `node`.
     - Run a component test to confirm it is executing in jsdom (e.g., `window` is defined).

3. **Add a jsdom-only Vitest setup file for RTL**
   - Implementation notes:
     - Register RTL matchers using `@testing-library/jest-dom/vitest`.
     - Ensure React Testing Library cleanup is configured (RTL typically auto-cleans, but ensure no global leakage).
     - Ensure the setup file is only applied to jsdom tests (not node tests).
   - Test plan:
     - Re-run the three suites; confirm matcher-related errors are resolved.

4. **Add minimal polyfills required by failing onboarding suites**
   - Implementation notes:
     - Only polyfill APIs that are shown to be missing by baseline failures.
     - Candidates (apply only if needed):
       - `globalThis.TextEncoder` / `TextDecoder`
       - `window.matchMedia`
       - `ResizeObserver`
     - Prefer lightweight implementations suitable for tests.
   - Test plan:
     - Re-run the three suites; confirm the missing-global errors are resolved.

5. **Standardize Next.js DOM test mocks (Link and other client-only modules)**
   - Implementation notes:
     - If onboarding components render `<Link>`, provide a stable mock for `next/link` that renders an `<a>` element.
     - Ensure the mock is scoped to DOM tests.
   - Test plan:
     - Re-run component suites; confirm Link-related rendering failures are resolved.

6. **Repo-standard documentation note for future component tests**
   - Implementation notes:
     - Add a brief note in the test setup file(s) describing:
       - Where to place component tests to get jsdom automatically.
       - What setup is applied (jest-dom matchers, polyfills, Next.js mocks).
   - Test plan:
     - Spot-check by creating (or mentally verifying) a new component test under the pattern and confirming it would pick up jsdom + setup.

7. **Full validation**
   - Implementation notes:
     - Ensure `npm test` is green.
   - Test plan:
     - Run `npm test`.
     - Run `npm run test:unit`.
     - Specifically confirm these suites pass:
       - `__tests__/unit/components/onboarding/EmptyState.test.tsx`
       - `__tests__/unit/components/onboarding/WelcomeModal.test.tsx`
       - `__tests__/unit/components/onboarding/ProfileCompletionCard.test.tsx`
