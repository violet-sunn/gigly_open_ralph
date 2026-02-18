# Implementation Tasks

## Task 1: Install Vitest Dependencies

**Implementation Notes**:
- Install Vitest as the test runner
- Install `@vitest/ui` for browser-based test UI (optional but helpful)
- Install `@vitest/coverage-v8` for code coverage
- Install `@vitejs/plugin-react` for React component testing support
- All packages should be dev dependencies

**Commands**:
```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8 @vitejs/plugin-react
```

**Test Plan**:
- Run `npm list vitest` - should show installed version
- Run `npx vitest --version` - should display version number
- Verify `package.json` includes vitest in `devDependencies`

---

## Task 2: Configure Vitest for Next.js 15

**Implementation Notes**:
- Create `vitest.config.ts` in project root
- Configure to work with Next.js App Router and TypeScript
- Set up path aliases to match `tsconfig.json` (e.g., `@/lib/*`)
- Configure test environment as `node` (for server-side code)
- Set up coverage configuration to include `app/` and `lib/` directories
- Exclude `node_modules`, `.next`, `coverage` from coverage reports

**File**: `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/types.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
```

**Test Plan**:
- Create a simple test file: `__tests__/unit/example.test.ts`
- Run `npx vitest run` - should execute without configuration errors
- Verify path aliases work by importing from `@/lib/*`

---

## Task 3: Install Playwright Dependencies

**Implementation Notes**:
- Install Playwright test runner
- Install Playwright browsers (Chromium, Firefox, WebKit)
- Use `npm init playwright@latest` for guided setup, or manual install

**Commands**:
```bash
npm install -D @playwright/test
npx playwright install
```

**Test Plan**:
- Run `npx playwright --version` - should display version
- Verify browsers are installed: `npx playwright install --dry-run`
- Check `package.json` includes `@playwright/test` in `devDependencies`

---

## Task 4: Configure Playwright

**Implementation Notes**:
- Create `playwright.config.ts` in project root
- Configure base URL as `http://localhost:3000`
- Set up test directory as `__tests__/e2e`
- Configure to use Chromium for MVP (can add more browsers later)
- Set reasonable timeouts (30s for actions, 60s for tests)
- Configure to run tests serially (avoid database conflicts)
- Set up HTML reporter for test results

**File**: `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: false, // Run serially to avoid DB conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid DB conflicts
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

**Test Plan**:
- Run `npx playwright test --help` - should show Playwright CLI options
- Verify configuration loads: `npx playwright show-config`
- Check that `__tests__/e2e` is recognized as test directory

---

## Task 5: Set Up Test Database Configuration

**Implementation Notes**:
- Create test database setup script: `__tests__/setup-db.ts`
- Script should:
  - Set `DATABASE_URL` to point to `test.db`
  - Run Prisma migrations to create schema
  - Optionally seed minimal test data
- Create Vitest setup file that runs before tests: `__tests__/setup.ts`
- Add `test.db` to `.gitignore`

**File**: `__tests__/setup-db.ts`
```typescript
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const testDbPath = path.join(process.cwd(), 'test.db')

// Remove existing test database
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath)
}

// Set test database URL
process.env.DATABASE_URL = `file:./test.db`

// Run migrations
console.log('Setting up test database...')
execSync('npx prisma migrate deploy', { stdio: 'inherit' })
console.log('Test database ready!')
```

**File**: `__tests__/setup.ts`
```typescript
import { execSync } from 'child_process'

// Reset test database before all tests
execSync('npx tsx __tests__/setup-db.ts', { stdio: 'inherit' })
```

**File**: `.gitignore` (add line)
```
test.db
test.db-journal
```

**Test Plan**:
- Run `npx tsx __tests__/setup-db.ts` manually
- Verify `test.db` file is created
- Run `npx prisma studio --schema prisma/schema.prisma` with `DATABASE_URL=file:./test.db`
- Verify schema tables exist in test database

---

## Task 6: Create Test Environment Variables

**Implementation Notes**:
- Create `.env.test` file with test-specific configuration
- Set `DATABASE_URL` to test database
- Set `SESSION_SECRET` for JWT testing
- Set `NODE_ENV=test`
- Add `.env.test` to `.gitignore` if it contains secrets (or use example file)

**File**: `.env.test`
```
NODE_ENV=test
DATABASE_URL="file:./test.db"
SESSION_SECRET="test-secret-key-for-jwt-signing-min-32-chars"
```

**File**: `.env.test.example` (committed to repo)
```
NODE_ENV=test
DATABASE_URL="file:./test.db"
SESSION_SECRET="test-secret-key-for-jwt-signing-min-32-chars"
```

**Test Plan**:
- Verify `.env.test` file exists
- Run a test that uses `process.env.DATABASE_URL`
- Confirm it points to `test.db`, not `dev.db`

---

## Task 7: Add Test Scripts to package.json

**Implementation Notes**:
- Add `test` script for watch mode (Vitest)
- Add `test:unit` script for running unit/integration tests once
- Add `test:e2e` script for running E2E tests
- Add `test:coverage` script for generating coverage reports
- Ensure scripts load `.env.test` environment variables

**File**: `package.json` (modify `scripts` section)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Test Plan**:
- Run `npm test` - should start Vitest in watch mode
- Press `q` to quit watch mode
- Run `npm run test:unit` - should run tests once and exit
- Run `npm run test:e2e` - should show "no tests found" (expected, tests not created yet)
- Run `npm run test:coverage` - should generate coverage report

---

## Task 8: Create Example Unit Test

**Implementation Notes**:
- Create a simple utility function to test (e.g., currency formatter)
- Create corresponding test file in `__tests__/unit/`
- Demonstrate basic Vitest assertions (`expect`, `toBe`, `toEqual`)
- Test should be simple and always pass

**File**: `lib/utils/currency.ts` (if doesn't exist)
```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function calculateServiceFee(budget: number, feePercent: number = 10): number {
  return Math.round(budget * (feePercent / 100))
}
```

**File**: `__tests__/unit/currency.test.ts`
```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency, calculateServiceFee } from '@/lib/utils/currency'

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('formats Russian rubles correctly', () => {
      expect(formatCurrency(100000)).toBe('100 000 ₽')
    })

    it('handles zero amount', () => {
      expect(formatCurrency(0)).toBe('0 ₽')
    })
  })

  describe('calculateServiceFee', () => {
    it('calculates 10% fee correctly', () => {
      expect(calculateServiceFee(100000, 10)).toBe(10000)
    })

    it('uses default 10% when not specified', () => {
      expect(calculateServiceFee(100000)).toBe(10000)
    })

    it('rounds to nearest integer', () => {
      expect(calculateServiceFee(100, 15)).toBe(15)
    })
  })
})
```

**Test Plan**:
- Run `npm run test:unit`
- Verify all tests pass
- Verify test output shows "Currency Utils" describe block
- Run `npm run test:coverage` - verify `lib/utils/currency.ts` shows 100% coverage

---

## Task 9: Create Example Integration Test

**Implementation Notes**:
- Create integration test for user registration server action
- Test should interact with test database
- Verify user is created in database
- Verify password is hashed
- Clean up test data after test (or rely on database reset)

**File**: `__tests__/integration/auth.test.ts`
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('User Registration', () => {
  beforeEach(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: { email: { contains: 'test@' } }
    })
  })

  it('creates a new user with hashed password', async () => {
    const testUser = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      role: 'CLIENT' as const,
      companyName: 'Test Company'
    }

    // Hash password (simulating registration logic)
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role,
        clientProfile: {
          create: {
            companyName: testUser.companyName
          }
        }
      },
      include: {
        clientProfile: true
      }
    })

    // Assertions
    expect(user.email).toBe(testUser.email)
    expect(user.role).toBe('CLIENT')
    expect(user.password).not.toBe(testUser.password) // Password should be hashed
    expect(await bcrypt.compare(testUser.password, user.password)).toBe(true)
    expect(user.clientProfile?.companyName).toBe(testUser.companyName)
  })

  it('prevents duplicate email registration', async () => {
    const email = 'test-duplicate@example.com'

    // Create first user
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash('password123', 10),
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            techStack: 'React, Node.js',
            experienceLevel: 'SENIOR'
          }
        }
      }
    })

    // Attempt to create duplicate
    await expect(
      prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash('password456', 10),
          role: 'CLIENT',
          clientProfile: {
            create: {
              companyName: 'Another Company'
            }
          }
        }
      })
    ).rejects.toThrow()
  })
})
```

**Test Plan**:
- Run `npm run test:unit` (includes integration tests)
- Verify both tests pass
- Check test database: `npx prisma studio` with `DATABASE_URL=file:./test.db`
- Verify test users exist in database
- Run tests again - should still pass (database reset works)

---

## Task 10: Create Example E2E Test

**Implementation Notes**:
- Create E2E test for user registration flow
- Test should navigate to `/register` page
- Fill in registration form
- Submit form
- Verify redirect to dashboard or success message
- Use Playwright's auto-waiting features

**File**: `__tests__/e2e/registration.spec.ts`
```typescript
import { test, expect } from '@playwright/test'

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register')
  })

  test('allows client to register successfully', async ({ page }) => {
    // Fill in registration form
    await page.fill('input[name="email"]', `client-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'SecurePassword123!')

    // Select CLIENT role
    await page.click('input[value="CLIENT"]')

    // Fill in company name
    await page.fill('input[name="companyName"]', 'Test Company Ltd')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')

    // Verify we're on the dashboard
    expect(page.url()).toContain('/dashboard')

    // Verify welcome message or dashboard content
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('shows validation error for invalid email', async ({ page }) => {
    // Fill in invalid email
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.click('input[value="SPECIALIST"]')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show error message (adjust selector based on actual implementation)
    await expect(page.locator('text=Invalid email')).toBeVisible()
  })

  test('prevents registration with existing email', async ({ page }) => {
    const email = `existing-${Date.now()}@example.com`

    // First registration
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('input[value="CLIENT"]')
    await page.fill('input[name="companyName"]', 'First Company')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Logout
    await page.click('button:has-text("Logout")')

    // Attempt second registration with same email
    await page.goto('/register')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'DifferentPass123!')
    await page.click('input[value="SPECIALIST"]')
    await page.click('button[type="submit"]')

    // Should show error
    await expect(page.locator('text=already exists')).toBeVisible()
  })
})
```

**Test Plan**:
- Ensure dev server is running: `npm run dev`
- Run `npm run test:e2e`
- Verify browser launches and tests execute
- Verify all 3 tests pass
- Check HTML report: `npx playwright show-report`

---

## Task 11: Configure Coverage Reporting

**Implementation Notes**:
- Coverage is already configured in `vitest.config.ts` (Task 2)
- Add `coverage/` directory to `.gitignore`
- Verify coverage thresholds (optional: can set minimum coverage %)
- Generate and review initial coverage report

**File**: `.gitignore` (add line)
```
coverage/
```

**Optional**: Add coverage thresholds to `vitest.config.ts`
```typescript
coverage: {
  // ... existing config
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70
  }
}
```

**Test Plan**:
- Run `npm run test:coverage`
- Verify coverage report is generated
- Open `coverage/index.html` in browser
- Verify report shows coverage for `lib/utils/currency.ts`
- Verify `coverage/` directory is git-ignored

---

## Task 12: Create Testing Documentation

**Implementation Notes**:
- Create `TESTING.md` in project root
- Document how to run tests
- Document how to write tests
- Include examples for each test type
- Document test database setup
- Document coverage reporting

**File**: `TESTING.md`
```markdown
# Testing Guide

## Overview

Gigly uses a comprehensive testing framework with three layers:

1. **Unit Tests** (Vitest) - Test individual functions and utilities
2. **Integration Tests** (Vitest) - Test server actions and database operations
3. **E2E Tests** (Playwright) - Test complete user workflows in browser

## Running Tests

### All Tests (Watch Mode)
```bash
npm test
```
Starts Vitest in watch mode. Tests re-run automatically when files change.

### Unit & Integration Tests
```bash
npm run test:unit
```
Runs all Vitest tests once and exits.

### E2E Tests
```bash
npm run test:e2e
```
Runs Playwright tests. Requires dev server to be running (auto-started by Playwright).

### Coverage Report
```bash
npm run test:coverage
```
Generates code coverage report. Open `coverage/index.html` to view.

## Writing Tests

### Unit Tests

Location: `__tests__/unit/`

Example:
```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/utils/myFunction'

describe('myFunction', () => {
  it('returns expected result', () => {
    expect(myFunction(input)).toBe(expectedOutput)
  })
})
```

### Integration Tests

Location: `__tests__/integration/`

Example:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Feature', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.model.deleteMany()
  })

  it('performs database operation', async () => {
    const result = await prisma.model.create({ data: {...} })
    expect(result).toBeDefined()
  })
})
```

### E2E Tests

Location: `__tests__/e2e/`

Example:
```typescript
import { test, expect } from '@playwright/test'

test('user can complete workflow', async ({ page }) => {
  await page.goto('/page')
  await page.fill('input[name="field"]', 'value')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Success')).toBeVisible()
})
```

## Test Database

Tests use a separate SQLite database (`test.db`) to avoid affecting development data.

- Database is automatically reset before each test run
- Test data is isolated from development database
- Schema is applied via Prisma migrations

## Best Practices

1. **Keep tests focused** - One assertion per test when possible
2. **Use descriptive names** - Test names should explain what is being tested
3. **Clean up test data** - Use `beforeEach` or `afterEach` hooks
4. **Avoid test interdependence** - Tests should run independently
5. **Mock external services** - Don't make real API calls in tests
6. **Test edge cases** - Include tests for error conditions

## Troubleshooting

### Tests fail with "Cannot find module"
- Check path aliases in `vitest.config.ts` match `tsconfig.json`
- Ensure imports use `@/` prefix

### E2E tests timeout
- Increase timeout in `playwright.config.ts`
- Check dev server is running on port 3000

### Database errors in tests
- Verify `DATABASE_URL` in `.env.test` points to `test.db`
- Run `npx tsx __tests__/setup-db.ts` manually to reset database

## CI/CD Integration

To run tests in CI pipeline:

```yaml
- name: Run tests
  run: |
    npm run test:unit
    npm run test:e2e
    npm run test:coverage
```

Ensure `test.db` is created in CI environment before running tests.
```

**Test Plan**:
- Read through `TESTING.md`
- Follow instructions to run each test type
- Verify all commands work as documented
- Check that examples are accurate

---

## Task 13: Verify Complete Setup

**Implementation Notes**:
- Run all test commands to ensure everything works
- Verify test database isolation
- Check coverage report generation
- Confirm example tests pass
- Review documentation completeness

**Test Plan**:
1. **Clean slate test**:
   ```bash
   rm -f test.db coverage/
   npm run test:unit
   ```
   - All tests should pass
   - `test.db` should be created

2. **Watch mode test**:
   ```bash
   npm test
   ```
   - Vitest should start in watch mode
   - Press `q` to quit

3. **E2E test**:
   ```bash
   npm run test:e2e
   ```
   - Browser should launch
   - Tests should pass
   - HTML report should be generated

4. **Coverage test**:
   ```bash
   npm run test:coverage
   ```
   - Coverage report should generate
   - Open `coverage/index.html` - should display coverage data

5. **Database isolation test**:
   - Check `dev.db` file size before tests
   - Run `npm run test:unit`
   - Check `dev.db` file size after tests
   - Size should be unchanged (tests didn't touch dev DB)

6. **Documentation test**:
   - Open `TESTING.md`
   - Follow each command in the guide
   - Verify all commands work

**Success Criteria**:
- All test scripts execute without errors
- Example tests pass (unit, integration, E2E)
- Coverage report generates successfully
- Test database is isolated from development database
- Documentation is complete and accurate
- `test.db` and `coverage/` are git-ignored

---

## Summary

After completing all tasks:
- ✅ Vitest configured for unit/integration tests
- ✅ Playwright configured for E2E tests
- ✅ Test database setup with isolation
- ✅ Test scripts in package.json
- ✅ Example tests demonstrating each layer
- ✅ Coverage reporting functional
- ✅ Documentation complete

**Next Steps**:
- Begin writing tests for existing features (gig lifecycle, auth, messaging)
- Set up CI/CD pipeline to run tests automatically
- Add pre-commit hooks to run tests before commits
- Gradually increase code coverage targets
