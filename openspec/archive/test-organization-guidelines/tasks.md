# Implementation Tasks: Test Organization Guidelines

## Task 1: Create __tests__/README.md with header and directory structure

**Implementation Notes:**
- Create new file at `__tests__/README.md`
- Write concise header (2-3 sentences) explaining purpose
- Document actual directory structure with file counts:
  ```
  __tests__/
  ├── integration/  (~26 files, 95% of tests)
  ├── unit/         (~2 files)
  ├── e2e/          (~2 files)
  ├── helpers/      (4 files: db.ts, seed.ts, auth.ts, auth-mocks.ts)
  └── setup.ts
  ```
- Explain what belongs in each directory (1 sentence per directory)
- Keep total section under 30 lines

**Test Plan:**
```bash
# Verify file exists
ls __tests__/README.md

# Verify directory structure matches reality
ls __tests__/integration/*.test.ts | wc -l  # Should show ~26
ls __tests__/unit/*.test.ts | wc -l         # Should show ~2
ls __tests__/e2e/*.spec.ts | wc -l          # Should show ~2
ls __tests__/helpers/*.ts | wc -l           # Should show 4

# Manual review: Is the structure explanation clear?
```

---

## Task 2: Document naming conventions and test types

**Implementation Notes:**
- Add "Naming Conventions" section (5-10 lines):
  - `*.test.ts` → Unit + Integration tests (Vitest)
  - `*.spec.ts` → E2E tests (Playwright)
  - Examples: `gig-creation.test.ts`, `registration.spec.ts`

- Add "Test Types" section with decision criteria (15-20 lines):
  - **Unit**: Pure functions, no DB, <10ms (e.g., `currency.test.ts`)
  - **Integration**: Server actions + DB, 50-200ms (e.g., `gig-creation.test.ts`)
  - **E2E**: Browser workflows, 1-5s (e.g., `registration.spec.ts`)

**Test Plan:**
```bash
# Verify example files exist
ls __tests__/unit/currency.test.ts
ls __tests__/integration/gig-creation.test.ts
ls __tests__/e2e/registration.spec.ts

# Manual review: Are the criteria actionable?
```

---

## Task 3: Document AAA pattern requirement

**Implementation Notes:**
- Add "AAA Pattern (Mandatory)" section (10-15 lines)
- Explain Arrange-Act-Assert structure
- Provide one concrete example from `gig-creation.test.ts`:

```typescript
it('creates gig with correct service fee', async () => {
  // Arrange
  const client = await createAuthenticatedClient(prisma)
  const input = { title: 'Test', budget: 100000, ... }

  // Act
  await withAuthContext(client.user, async () => {
    await createGig(input)
  })

  // Assert
  const gig = await prisma.gig.findFirst({ where: { title: 'Test' } })
  expect(gig?.serviceFee).toBe(20000)
})
```

**Test Plan:**
```bash
# Verify source file exists
ls __tests__/integration/gig-creation.test.ts

# Manual review: Is AAA pattern clear and mandatory?
```

---

## Task 4: Document test helpers with exact signatures

**Implementation Notes:**
- Add "Test Helpers" section (30-40 lines)
- List all 4 helper modules with key functions and TypeScript signatures:

**`__tests__/helpers/db.ts`:**
```typescript
getTestPrismaClient(): PrismaClient
withTestTransaction<T>(callback: (tx: PrismaClient) => Promise<T>): Promise<T>
```

**`__tests__/helpers/seed.ts`:**
```typescript
createTestUser(tx: PrismaClient, overrides?: Partial<UserData>): Promise<User>
createTestGig(tx: PrismaClient, overrides?: Partial<GigData>): Promise<Gig>
createTestApplication(tx: PrismaClient, overrides?: Partial<ApplicationData>): Promise<Application>
```

**`__tests__/helpers/auth.ts`:**
```typescript
withAuthContext(user: User, callback: () => Promise<void>): Promise<void>
createAuthenticatedClient(tx: PrismaClient, overrides?): Promise<{ user: User, session: string }>
createAuthenticatedSpecialist(tx: PrismaClient, overrides?): Promise<{ user: User, session: string }>
setE2ESession(page: Page, user: User): Promise<void>
```

**`__tests__/helpers/auth-mocks.ts`:**
- Internal mocking utilities (no public API)

- Add note: "See TESTING.md for comprehensive documentation"

**Test Plan:**
```bash
# Verify all helper files exist
ls __tests__/helpers/db.ts
ls __tests__/helpers/seed.ts
ls __tests__/helpers/auth.ts
ls __tests__/helpers/auth-mocks.ts

# Verify key functions are exported
grep "export.*getTestPrismaClient" __tests__/helpers/db.ts
grep "export.*withTestTransaction" __tests__/helpers/db.ts
grep "export.*createTestUser" __tests__/helpers/seed.ts
grep "export.*createTestGig" __tests__/helpers/seed.ts
grep "export.*withAuthContext" __tests__/helpers/auth.ts
grep "export.*createAuthenticatedClient" __tests__/helpers/auth.ts

# Manual review: Are signatures accurate?
```

---

## Task 5: Document common mocking patterns

**Implementation Notes:**
- Add "Common Mocking Patterns" section (20-30 lines)
- Document standard mocks from `gig-creation.test.ts`:

**Mock Prisma:**
```typescript
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  }
}))
```

**Mock Next.js cookies:**
```typescript
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
    },
    set: vi.fn(),
    delete: vi.fn()
  }))
}))
```

**Mock Next.js redirect:**
```typescript
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
}))
```

- Note: Mocks MUST be defined before imports

**Test Plan:**
```bash
# Verify source file with mocking patterns exists
ls __tests__/integration/gig-creation.test.ts

# Read file and verify mocking patterns match
head -50 __tests__/integration/gig-creation.test.ts

# Manual review: Are patterns copy-pasteable?
```

---

## Task 6: Add complete code examples

**Implementation Notes:**
- Add "Example Tests" section (40-60 lines)
- Include 3 complete examples with AAA comments:

**Example 1: Unit Test** (from `currency.test.ts`)
```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/lib/utils/currency'

describe('Currency Utils', () => {
  it('formats Russian rubles correctly', () => {
    // Arrange
    const amount = 100000

    // Act
    const result = formatCurrency(amount)

    // Assert
    expect(result).toBe('100\u00A0000\u00A0₽')
  })
})
```

**Example 2: Integration Test** (simplified from `gig-creation.test.ts`)
```typescript
import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createAuthenticatedClient, withAuthContext } from '../helpers/auth'
import { createGig } from '@/app/actions/gig'

// [Mocks here - see Mocking Patterns section]

describe('Gig Creation', () => {
  it('creates gig with correct service fee', async () => {
    // Arrange
    const prisma = getTestPrismaClient()
    const client = await createAuthenticatedClient(prisma)
    const input = {
      title: 'Test Gig',
      description: 'Test description',
      acceptanceCriteria: 'Criteria that is long enough',
      budget: 100000,
      tags: 'React,TypeScript'
    }

    // Act
    await withAuthContext(client.user, async () => {
      await createGig(input)
    })

    // Assert
    const gig = await prisma.gig.findFirst({ where: { title: 'Test Gig' } })
    expect(gig?.serviceFee).toBe(20000) // 20% of 100000
  })
})
```

**Example 3: E2E Test** (from `registration.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test('user can register as CLIENT', async ({ page }) => {
  // Arrange
  await page.goto('/register')

  // Act
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'SecurePass123!')
  await page.click('button:has-text("CLIENT")')
  await page.fill('input[name="companyName"]', 'Test Company')
  await page.fill('input[name="inn"]', '1234567890')
  await page.click('button[type="submit"]')

  // Assert
  await expect(page).toHaveURL('/dashboard')
})
```

**Test Plan:**
```bash
# Verify source files exist
ls __tests__/unit/currency.test.ts
ls __tests__/integration/gig-creation.test.ts
ls __tests__/e2e/registration.spec.ts

# Manual review: Are examples accurate and runnable?
```

---

## Task 7: Add quick reference and legacy scripts note

**Implementation Notes:**
- Add "Running Tests" section (10 lines):
  ```bash
  npm test                 # Watch mode
  npm run test:unit        # Unit + integration once
  npm run test:e2e         # E2E tests
  npm run test:coverage    # Coverage report
  npm run clean:test-db    # Clean test DB files
  ```

- Add "Legacy Scripts" note (3-4 lines):
  - "Legacy verification scripts in `scripts/legacy-tests/` are archived for historical reference"
  - "Use Vitest in `__tests__/` for all new tests"
  - "See `scripts/legacy-tests/README.md` for context"

- Add "Further Reading" (3 lines):
  - `TESTING.md` - Comprehensive testing documentation
  - Vitest: https://vitest.dev
  - Playwright: https://playwright.dev

**Test Plan:**
```bash
# Verify npm commands work
npm test --help
npm run test:unit --help
npm run test:e2e --help

# Verify referenced files exist
ls TESTING.md
ls scripts/legacy-tests/README.md

# Manual review: Is quick reference helpful?
```

---

## Task 8: Verify documentation accuracy and length

**Implementation Notes:**
- This is a verification task, no code changes
- Systematically verify all references
- Check line count target (150-250 lines)

**Test Plan:**

**File Count Verification:**
```bash
# Count lines in README
wc -l __tests__/README.md
# Target: 150-250 lines

# Verify directory structure
ls __tests__/integration/*.test.ts | wc -l  # ~26 files
ls __tests__/unit/*.test.ts | wc -l         # ~2 files
ls __tests__/e2e/*.spec.ts | wc -l          # ~2 files
```

**File Reference Verification:**
```bash
# Verify all referenced files exist
ls __tests__/unit/currency.test.ts
ls __tests__/integration/gig-creation.test.ts
ls __tests__/integration/gig-authorization.test.ts
ls __tests__/integration/application-flow.test.ts
ls __tests__/e2e/registration.spec.ts
ls __tests__/helpers/db.ts
ls __tests__/helpers/seed.ts
ls __tests__/helpers/auth.ts
ls __tests__/helpers/auth-mocks.ts
ls __tests__/setup.ts
ls TESTING.md
ls scripts/legacy-tests/README.md
```

**Helper Function Verification:**
```bash
# Verify helper functions exist and are exported
grep "export.*function getTestPrismaClient" __tests__/helpers/db.ts
grep "export.*function withTestTransaction" __tests__/helpers/db.ts
grep "export.*function createTestUser" __tests__/helpers/seed.ts
grep "export.*function createTestGig" __tests__/helpers/seed.ts
grep "export.*function createTestApplication" __tests__/helpers/seed.ts
grep "export.*function withAuthContext" __tests__/helpers/auth.ts
grep "export.*function createAuthenticatedClient" __tests__/helpers/auth.ts
grep "export.*function createAuthenticatedSpecialist" __tests__/helpers/auth.ts
grep "export.*function setE2ESession" __tests__/helpers/auth.ts
```

**npm Command Verification:**
```bash
# Verify all commands are valid
npm test --help
npm run test:unit --help
npm run test:e2e --help
npm run test:coverage --help
npm run clean:test-db --help
```

**Manual Review Checklist:**
- [ ] All file paths are valid
- [ ] All helper function signatures are accurate
- [ ] All code examples are syntactically correct
- [ ] AAA pattern is clearly mandated
- [ ] Mocking patterns are copy-pasteable
- [ ] Documentation is 150-250 lines (concise)
- [ ] Documentation is scannable (not verbose)
- [ ] No broken references or outdated information

**Success Criteria:**
- All verification commands pass
- Line count is 150-250 lines
- All references are accurate
- Documentation is clear and actionable

---

## Summary

This change creates a concise, actionable test organization reference at `__tests__/README.md` (150-250 lines) that:
- Documents actual directory structure with file counts
- Establishes naming conventions (*.test.ts vs *.spec.ts)
- Mandates AAA pattern for all tests
- Provides exact TypeScript signatures for test helpers
- Documents common mocking patterns for Next.js APIs
- Includes 3 complete AAA-pattern examples from actual tests
- Distinguishes real tests from legacy verification scripts

**Total Tasks:** 8 (7 implementation + 1 verification)

**Estimated Effort:** 2-3 hours
- Task 1: 20 minutes (structure)
- Task 2: 20 minutes (conventions and types)
- Task 3: 15 minutes (AAA pattern)
- Task 4: 30 minutes (helper signatures)
- Task 5: 20 minutes (mocking patterns)
- Task 6: 30 minutes (code examples)
- Task 7: 15 minutes (quick reference)
- Task 8: 30 minutes (verification)

**Dependencies:** None (documentation only, no code changes)

**Risk:** Low (documentation change, no functional impact)
