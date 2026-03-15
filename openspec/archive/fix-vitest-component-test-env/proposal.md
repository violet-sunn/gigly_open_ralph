# Proposal: Fix Vitest component test environment for onboarding UI tests (RTL)

## Summary

Several React Testing Library (RTL) component test suites under `__tests__/unit/components/onboarding/*` fail under Vitest due to an unstable or incomplete DOM test environment setup (jsdom selection, matcher registration, and missing browser API polyfills / Next.js mocks).

This change defines a repo-standard, deterministic way to run DOM-dependent component tests in Vitest while preserving the existing default `node` environment for non-DOM unit/integration tests.

## Problem Statement

- `npm test` fails locally due to failing onboarding component suites:
  - `__tests__/unit/components/onboarding/EmptyState.test.tsx`
  - `__tests__/unit/components/onboarding/WelcomeModal.test.tsx`
  - `__tests__/unit/components/onboarding/ProfileCompletionCard.test.tsx`
- The failures are expected to be caused by the test runtime environment rather than application logic.
- The repository philosophy is to keep Vitest default environment as `node` and enable DOM only where required.

## Goals

1. `npm test` MUST pass locally.
2. The three onboarding component suites listed above MUST pass consistently.
3. The fix MUST be isolated to test environment configuration (Vitest config / setup files / test utilities), avoiding invasive app refactors.
4. Vitest MUST remain `node` by default, with deterministic opt-in DOM (jsdom) for DOM tests.

## Non-Goals

- UI redesign or behavior changes to onboarding components (unless strictly required for correctness).
- Broad refactors of unrelated test infrastructure.
- Weakening assertions to “make tests pass” without correcting environment behavior.

## Constraints & Notes

- Stack: Next.js (App Router) + React + TypeScript.
- Component tests use React Testing Library and jest-dom style matchers (e.g. `toBeInTheDocument`).
- The chosen approach MUST support DOM APIs required by onboarding components (e.g. `TextEncoder`, `ResizeObserver`, `matchMedia`) if failures indicate they are needed.
- Next.js `next/link` rendering SHOULD be supported; if not, it MUST be mocked in a standard way.
- The solution SHOULD be explicit and minimal (per-file environment annotation or glob-based mapping), and MUST NOT force all tests into jsdom.

## Proposed Approach

- Configure Vitest to use:
  - `environment: 'node'` as the default.
  - `environmentMatchGlobs` (or equivalent supported mechanism) to run DOM component tests under `jsdom` based on a clear pattern (directory-based for component tests).
- Add a DOM test setup file (only for jsdom tests) that:
  - Registers RTL matchers (`@testing-library/jest-dom/vitest`).
  - Adds only the necessary polyfills required by the failing suites.
  - Installs stable Next.js mocks (e.g., `next/link`) only for DOM tests.
- Ensure these changes do not impact integration tests and database isolation.

## Validation

- Run:
  - `npm test`
  - `npm run test:unit`
- Confirm the three specified onboarding component suites pass.

