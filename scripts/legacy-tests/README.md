# Legacy Test Scripts (Archived)

## Overview

This directory contains **legacy build verification scripts** that were created before proper test infrastructure existed in the project. These scripts are **archived for historical reference only** and are no longer maintained or used.

## What Are These Scripts?

These scripts use a **custom test runner** with `pass()` and `fail()` functions instead of standard testing frameworks like Vitest or Playwright. They were originally written to verify basic functionality during early development phases.

**Pattern:** `test-*.ts` (26 files total)

**Examples:**
- `test-auth-flow.ts` - Authentication flow verification
- `test-gig-creation.ts` - Gig creation verification
- `test-gig-lifecycle.ts` - Gig lifecycle verification
- `test-messaging-iteration-2.ts` - Messaging functionality verification
- And 22 more...

## Status

- ❌ **Not maintained** - These scripts are no longer updated
- ❌ **Not run in CI** - Continuous integration uses Vitest/Playwright only
- ✅ **Preserved for history** - Available for reference if needed

## ⚠️ Important: Do NOT Add New Tests Here

**Do NOT add new tests to this directory.** All new tests MUST be written using:
- **Vitest** for unit and integration tests in `__tests__/`
- **Playwright** for end-to-end tests in `__tests__/e2e/`

## Current Testing Infrastructure

All supported and maintained tests live in the `__tests__/` directory using modern testing frameworks:

- **Unit tests:** `__tests__/unit/`
- **Integration tests:** `__tests__/integration/`
- **E2E tests:** `__tests__/e2e/`

### Test Commands

```bash
npm test              # Run tests in watch mode
npm run test:unit     # Run unit and integration tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## Why Were These Archived?

As of change #21 (testing-framework-setup), the project has comprehensive Vitest and Playwright infrastructure. These legacy scripts served their purpose during early development but are now obsolete. They have been moved here to:

1. **Eliminate confusion** between legacy scripts and real tests
2. **Establish clear testing conventions** (Vitest in `__tests__/`)
3. **Preserve historical context** without cluttering the main scripts directory

---

**For all testing needs, use the test infrastructure in `__tests__/` with Vitest and Playwright.**
