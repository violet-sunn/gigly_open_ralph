# Implementation Tasks: Password Strength Requirements

## Task 1: Create Password Validation Utility

**Implementation:**
- Create `lib/password.ts` with `validatePassword()` function
- Implement validation rules in order: length → uppercase → lowercase → number
- Return `{ valid: boolean; error?: string }` structure
- Use regex patterns for character class validation

**Implementation Notes:**
```typescript
export function validatePassword(password: string): { valid: boolean; error?: string } {
  // Check character whitelist first (Latin letters, numbers, special characters only)
  // Rejects Unicode/Cyrillic characters to prevent encoding issues
  const allowedChars = /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
  if (!allowedChars.test(password)) {
    return { valid: false, error: 'Password can only contain Latin letters, numbers, and special characters.' }
  }

  // Check maximum length (bcrypt limit + DoS prevention)
  // Since we enforce ASCII-only, 1 character = 1 byte, making this perfectly safe
  if (password.length > 72) {
    return { valid: false, error: 'Password must not exceed 72 characters.' }
  }

  // Check minimum length (8 characters)
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' }
  }

  // Check for at least one uppercase letter (Latin only)
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter.' }
  }

  // Check for at least one lowercase letter (Latin only)
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter.' }
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number.' }
  }

  return { valid: true }
}
```

**Test Plan:**
- Create `__tests__/unit/password.test.ts`
- Test valid passwords: "SecurePass123", "MyPassword1", "Test1234"
- Test invalid characters: "Пароль123" (Cyrillic - should fail)
- Test character whitelist checked first: "Пароль" (should return character error, not length error)
- Test length violation: "Abc1" (too short)
- Test max length violation: 73+ character password (bcrypt limit + DoS prevention)
- Test missing uppercase: "lowercase123"
- Test missing lowercase: "UPPERCASE123"
- Test missing number: "NoNumbers"
- Test special characters allowed: "Secure@Pass123!"
- Test spaces allowed: "My Secure Pass 123"
- Test multiple violations return first error: "abc" (should return length error)
- Test edge cases: empty string, exactly 72 characters, exactly 8 characters
- Run: `npm run test:unit -- password.test.ts`
- Verify all 12+ tests pass

---

## Task 2: Integrate Password Validation into Registration

**Implementation:**
- Modify `app/actions/auth.ts` - `registerUser` function
- Import `validatePassword` from `@/lib/password`
- Call validation after extracting password from formData
- Return validation error immediately if password is invalid
- Ensure validation happens BEFORE `bcrypt.hash()`

**Implementation Notes:**
```typescript
import { validatePassword } from '@/lib/password'

export async function registerUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  // ... existing rate limiting code ...

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  // Validate password strength BEFORE hashing
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.error }
  }

  if (!role || !['CLIENT', 'SPECIALIST'].includes(role)) {
    return { error: 'Please select a role.' }
  }

  // ... rest of registration logic (hashing, user creation, etc.) ...
}
```

**Test Plan:**
- Modify existing `__tests__/integration/registration.test.ts` or create new test file
- Test: Registration with strong password succeeds
- Test: Registration with too-short password fails with correct error
- Test: Registration with missing uppercase fails with correct error
- Test: Registration with missing lowercase fails with correct error
- Test: Registration with missing number fails with correct error
- Test: Validation happens before hashing (verify bcrypt.hash not called on invalid password)
- Run: `npm run test:unit`
- Verify all registration tests pass (existing + new)

---

## Task 3: Write Unit Tests for Password Validation

**Implementation:**
- Create `__tests__/unit/password.test.ts`
- Test all validation rules with multiple examples
- Test edge cases and boundary conditions
- Verify error messages are correct and specific

**Test Scenarios (minimum 12 tests):**
1. Valid password with all requirements: "SecurePass123"
2. Valid password with special characters: "Secure@Pass123!"
3. Valid password with spaces: "My Secure Pass 123"
4. Invalid: contains Unicode/Cyrillic characters: "Пароль123"
5. Invalid: contains Unicode, checked first: "Пароль" (should return character error, not length error)
6. Invalid: too short (< 8 chars): "Abc1"
7. Invalid: too long (> 72 chars): "A".repeat(50) + "a".repeat(23) + "1" (73 chars total)
8. Invalid: missing uppercase: "lowercase123"
9. Invalid: missing lowercase: "UPPERCASE123"
10. Invalid: missing number: "NoNumbers"
11. Invalid: multiple violations return first error: "abc" (should return length error)
12. Edge case: empty string
13. Edge case: exactly 8 characters with all requirements: "Abcd1234"
14. Edge case: exactly 72 characters with all requirements

**Implementation Notes:**
```typescript
import { describe, it, expect } from 'vitest'
import { validatePassword } from '@/lib/password'

describe('Password Validation', () => {
  describe('Valid passwords', () => {
    it('accepts password with all requirements', () => {
      const result = validatePassword('SecurePass123')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('accepts password with special characters', () => {
      const result = validatePassword('Secure@Pass123!')
      expect(result.valid).toBe(true)
    })

    it('accepts password with spaces', () => {
      const result = validatePassword('My Secure Pass 123')
      expect(result.valid).toBe(true)
    })

    it('accepts exactly 8 characters with all requirements', () => {
      const result = validatePassword('Abcd1234')
      expect(result.valid).toBe(true)
    })

    it('accepts exactly 72 characters with all requirements', () => {
      const password = 'A' + 'a'.repeat(70) + '1' // 72 chars total
      const result = validatePassword(password)
      expect(result.valid).toBe(true)
    })
  })

  describe('Invalid passwords', () => {
    it('rejects password with invalid characters (Cyrillic)', () => {
      const result = validatePassword('Пароль123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password can only contain Latin letters, numbers, and special characters.')
    })

    it('checks character whitelist before other validations', () => {
      const result = validatePassword('Пароль') // Cyrillic, also too short and missing number
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password can only contain Latin letters, numbers, and special characters.')
    })

    it('rejects password that is too long (> 72 chars)', () => {
      const password = 'A' + 'a'.repeat(71) + '1' // 73 chars total
      const result = validatePassword(password)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must not exceed 72 characters.')
    })

    it('rejects password that is too short', () => {
      const result = validatePassword('Abc1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters long.')
    })

    it('rejects password missing uppercase letter', () => {
      const result = validatePassword('lowercase123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one uppercase letter.')
    })

    it('rejects password missing lowercase letter', () => {
      const result = validatePassword('UPPERCASE123')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one lowercase letter.')
    })

    it('rejects password missing number', () => {
      const result = validatePassword('NoNumbers')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must contain at least one number.')
    })

    it('returns first error for multiple violations', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters long.')
    })
  })

  describe('Edge cases', () => {
    it('rejects empty string', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters long.')
    })
  })
})
```

**Test Plan:**
- Run: `npm run test:unit -- password.test.ts`
- Verify all 10+ tests pass
- Check test coverage: `npm run test:coverage -- password.test.ts`
- Verify 100% coverage of `validatePassword` function

---

## Task 4: Write Integration Tests for Registration with Weak Passwords

**Implementation:**
- Add tests to existing `__tests__/integration/registration.test.ts` file
- Use existing test infrastructure (no duplicate mocking needed)
- Test registration flow with various invalid passwords
- Verify no user is created when validation fails
- Verify password is not hashed when validation fails
- Test that strong passwords still allow registration

**Test Scenarios (minimum 6 tests):**
1. Registration with strong password succeeds
2. Registration with invalid characters fails (Cyrillic rejected)
3. Registration with too-short password fails
4. Registration with too-long password fails (> 72 chars)
5. Registration with missing uppercase fails
6. Registration with missing lowercase fails
7. Registration with missing number fails

**Implementation Notes:**
```typescript
// Add to existing __tests__/integration/registration.test.ts

describe('Password Strength Requirements', () => {
  it('allows registration with strong password', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'SecurePass123')
    formData.append('role', 'CLIENT')

    try {
      await registerUser(null, formData)
      throw new Error('Expected redirect but got none')
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
    }

    // Verify user was created
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeDefined()
  })

  it('rejects registration with invalid characters (Cyrillic)', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'Пароль123') // Cyrillic characters
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Password can only contain Latin letters, numbers, and special characters.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with too-short password', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'Abc1')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Password must be at least 8 characters long.' })

    // Verify no user was created
    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with too-long password', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'A' + 'a'.repeat(71) + '1') // 73 chars
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Password must not exceed 72 characters.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with missing uppercase', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'lowercase123')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Password must contain at least one uppercase letter.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with missing lowercase', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'UPPERCASE123')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Password must contain at least one lowercase letter.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })

  it('rejects registration with missing number', async () => {
    const email = `user-${Date.now()}-${Math.random()}@example.com`
    testEmails.push(email)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', 'NoNumbers')
    formData.append('role', 'CLIENT')

    const result = await registerUser(null, formData)

    expect(result).toEqual({ error: 'Password must contain at least one number.' })

    const prisma = getTestPrismaClient()
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user).toBeNull()
  })
})
```

**Test Plan:**
- Add tests to existing `__tests__/integration/registration.test.ts`
- Run: `npm run test:unit -- registration.test.ts`
- Verify all 7 new tests pass
- Verify no users are created when validation fails
- Verify existing registration tests still pass
- No duplicate mocking setup needed - uses existing infrastructure

---

## Task 5: Write Integration Test for Existing Users with Weak Passwords

**Implementation:**
- Add test to existing `__tests__/integration/login.test.ts` file
- Use existing test infrastructure (no duplicate mocking needed)
- Verify backward compatibility
- Create user with weak password directly in database (bypassing validation)
- Verify user can still login with weak password
- Ensure password validation is NOT applied to login

**Implementation Notes:**
```typescript
// Add to existing __tests__/integration/login.test.ts

it('allows existing users with weak passwords to login', async () => {
  const email = `olduser-${Date.now()}-${Math.random()}@example.com`
  testEmails.push(email)

  // Create user with weak password directly in database (simulating old user)
  const prisma = getTestPrismaClient()
  const hashedPassword = await bcrypt.hash('weak', 10)
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'CLIENT'
    }
  })

  // Attempt login with weak password
  const formData = new FormData()
  formData.append('email', email)
  formData.append('password', 'weak')

  try {
    await loginUser(null, formData)
    throw new Error('Expected redirect but got none')
  } catch (error: any) {
    expect(error.message).toContain('NEXT_REDIRECT:/dashboard')
  }

  // Verify session was created
  const sessionToken = getTestSessionToken()
  expect(sessionToken).toBeDefined()
})
```

**Test Plan:**
- Add test to existing `__tests__/integration/login.test.ts`
- Run: `npm run test:unit -- login.test.ts`
- Verify test passes
- Verify existing login tests still pass
- No duplicate mocking setup needed - uses existing infrastructure

---

## Task 6: Documentation and Cleanup

**Implementation:**
- Update `openspec/project.md` "Completed Changes" section
- Add entry: "**password-requirements** — Password strength validation enforcing Latin-only characters, minimum 8 characters, uppercase, lowercase, and number requirements. Prevents weak passwords like '123456' and rejects Unicode/Cyrillic characters during registration. Clear error messages guide users to create secure passwords. Backward compatible - existing users with weak passwords can still login. Comprehensive test coverage with unit and integration tests."
- Verify all tests pass: `npm run test:unit`
- Run build: `npm run build`
- Verify no compilation errors

**Test Plan:**
- Run full test suite: `npm run test:unit`
- Verify all tests pass (existing + new)
- Run build: `npm run build`
- Verify no TypeScript errors
- Check test coverage: `npm run test:coverage`
- Verify password validation code is covered

---

## Summary

**Total Tasks:** 6
**Estimated Effort:** 3-4 hours
**Critical Path:** Tasks 1-2 (core implementation)
**Testing:** Tasks 3-5 (verification)
**Documentation:** Task 6 (cleanup)

**Dependencies:**
- Task 2 depends on Task 1 (utility must exist)
- Tasks 3-5 depend on Tasks 1-2 (implementation must exist to test)
- Task 6 depends on all previous tasks (documentation after completion)

**Key Implementation Details:**
- Uses standard ASCII regex (`/[A-Z]/` and `/[a-z]/`) for Latin-only character validation
- Character whitelist check happens first to reject Unicode/Cyrillic characters
- Enforces 72 character maximum to prevent bcrypt DoS attacks (safe with ASCII-only)
- Validation order: character whitelist → max length → min length → uppercase → lowercase → number
- Tests integrated into existing test files (no parallel testing pipeline)
- Backward compatible - existing users with weak passwords can still login

**Risk Mitigation:**
- Start with Task 1 (utility) and test it thoroughly before integration
- Task 2 is minimal change to existing code (low risk)
- Comprehensive test coverage ensures no regressions
- Backward compatibility ensures existing users unaffected
- No breaking changes to API or user experience
- Latin-only character set prevents encoding issues and ensures consistent behavior
- Maximum length check prevents both bcrypt truncation issues and DoS attacks
