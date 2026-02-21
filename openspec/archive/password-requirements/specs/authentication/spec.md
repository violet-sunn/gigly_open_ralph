# Authentication Specification: Password Strength Requirements (DELTA)

## ADDED Requirements

### Requirement: Password Validation Utility
The system MUST provide a password validation utility that enforces minimum strength requirements and prevents bcrypt DoS attacks.

#### Scenario: Valid password passes all requirements
- GIVEN a password "SecurePass123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND no error message MUST be included

#### Scenario: Password too long (bcrypt DoS prevention)
- GIVEN a password with 73 characters
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must not exceed 72 characters." }`
- AND this prevents bcrypt from blocking the event loop with excessively long passwords

#### Scenario: Password too short
- GIVEN a password "Abc1" (4 characters)
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must be at least 8 characters long." }`

#### Scenario: Password missing uppercase letter
- GIVEN a password "lowercase123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must contain at least one uppercase letter." }`

#### Scenario: Password missing lowercase letter
- GIVEN a password "UPPERCASE123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must contain at least one lowercase letter." }`

#### Scenario: Password missing number
- GIVEN a password "NoNumbers"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password must contain at least one number." }`

#### Scenario: Password with invalid characters (Cyrillic/Unicode)
- GIVEN a password "Пароль123" (contains Cyrillic characters)
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password can only contain Latin letters, numbers, and special characters." }`
- AND character whitelist validation MUST reject non-Latin characters

#### Scenario: Password with invalid characters checked first
- GIVEN a password "Пароль" (Cyrillic, also too short and missing number)
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: false, error: "Password can only contain Latin letters, numbers, and special characters." }`
- AND character whitelist check MUST happen before other validations

#### Scenario: Password with multiple violations
- GIVEN a password "abc" (too short, no uppercase, no number)
- WHEN `validatePassword` is called
- THEN it MUST return the error for the first failed requirement
- AND it MUST check requirements in order: max length, min length, uppercase, lowercase, number

#### Scenario: Password with special characters is allowed
- GIVEN a password "Secure@Pass123!"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND special characters MUST NOT be required but MUST be allowed

#### Scenario: Password with spaces is allowed
- GIVEN a password "My Secure Pass 123"
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND spaces MUST be treated as valid characters

#### Scenario: Password at exactly 72 characters
- GIVEN a password with exactly 72 characters meeting all requirements
- WHEN `validatePassword` is called
- THEN it MUST return `{ valid: true }`
- AND 72 characters is the maximum allowed (bcrypt limit)

**Acceptance Criteria:**
- `validatePassword` is exported from `lib/password.ts`
- Function signature: `validatePassword(password: string): { valid: boolean; error?: string }`
- Validation order: character whitelist → max length (72) → min length (8) → uppercase → lowercase → number
- Returns specific error message for first failed requirement
- Uses standard ASCII regex (`/[A-Z]/` and `/[a-z]/`) for Latin-only character validation
- Character whitelist rejects Unicode/Cyrillic characters
- Maximum length check prevents bcrypt DoS (72 character limit, safe with ASCII-only)
- No external dependencies (uses built-in JavaScript)
- Pure function with no side effects

---

### Requirement: Registration Password Validation
The system MUST validate password strength during user registration before hashing.

#### Scenario: Registration with strong password succeeds
- GIVEN a user submits registration with password "SecurePass123"
- WHEN `registerUser` is called
- THEN password validation MUST pass
- AND the password MUST be hashed
- AND the user MUST be created successfully
- AND the user MUST be redirected to `/dashboard`

#### Scenario: Registration with invalid characters fails
- GIVEN a user submits registration with password "Пароль123" (contains Cyrillic)
- WHEN `registerUser` is called
- THEN password validation MUST fail
- AND it MUST return `{ error: "Password can only contain Latin letters, numbers, and special characters." }`
- AND the password MUST NOT be hashed
- AND no user MUST be created

#### Scenario: Registration with too-long password fails
- GIVEN a user submits registration with password containing 73+ characters
- WHEN `registerUser` is called
- THEN password validation MUST fail
- AND it MUST return `{ error: "Password must not exceed 72 characters." }`
- AND the password MUST NOT be hashed
- AND no user MUST be created

#### Scenario: Registration with weak password fails
- GIVEN a user submits registration with password "weak"
- WHEN `registerUser` is called
- THEN password validation MUST fail
- AND it MUST return `{ error: "Password must be at least 8 characters long." }`
- AND the password MUST NOT be hashed
- AND no user MUST be created

#### Scenario: Registration with password missing uppercase fails
- GIVEN a user submits registration with password "lowercase123"
- WHEN `registerUser` is called
- THEN it MUST return `{ error: "Password must contain at least one uppercase letter." }`
- AND no user MUST be created

#### Scenario: Registration with password missing lowercase fails
- GIVEN a user submits registration with password "UPPERCASE123"
- WHEN `registerUser` is called
- THEN it MUST return `{ error: "Password must contain at least one lowercase letter." }`
- AND no user MUST be created

#### Scenario: Registration with password missing number fails
- GIVEN a user submits registration with password "NoNumbers"
- WHEN `registerUser` is called
- THEN it MUST return `{ error: "Password must contain at least one number." }`
- AND no user MUST be created

#### Scenario: Validation happens before hashing
- GIVEN a user submits registration with invalid password
- WHEN `registerUser` is called
- THEN password validation MUST happen first
- AND `bcrypt.hash()` MUST NOT be called
- AND no database query MUST be executed

#### Scenario: Existing users can still login with old passwords
- GIVEN a user registered before password requirements were implemented
- AND their password is "weak" (does not meet current requirements)
- WHEN they attempt to login
- THEN login MUST succeed
- AND password validation MUST NOT be applied to login
- AND only registration enforces password requirements

**Acceptance Criteria:**
- `registerUser` calls `validatePassword()` before `bcrypt.hash()`
- Validation happens after extracting password from formData
- Returns validation error immediately if password is invalid
- No database operations occur if validation fails
- Existing users with weak passwords can still login (no validation on login)
- Error messages are user-friendly and actionable
- Character whitelist rejects Unicode/Cyrillic passwords with clear error message
- Maximum length check prevents bcrypt DoS attacks (safe with ASCII-only)

---

### Requirement: Password Validation Error Messages
The system MUST provide clear, specific error messages for each password requirement violation.

#### Scenario: Error message specifies maximum length requirement
- GIVEN a password that exceeds 72 characters
- WHEN validation fails
- THEN the error message MUST state "Password must not exceed 72 characters."
- AND it MUST explain this prevents bcrypt DoS attacks

#### Scenario: Error message specifies minimum length requirement
- GIVEN a password that is too short
- WHEN validation fails
- THEN the error message MUST state "Password must be at least 8 characters long."
- AND it MUST NOT use generic messages like "Password is too weak"

#### Scenario: Error message specifies uppercase requirement
- GIVEN a password missing uppercase letters
- WHEN validation fails
- THEN the error message MUST state "Password must contain at least one uppercase letter."

#### Scenario: Error message specifies lowercase requirement
- GIVEN a password missing lowercase letters
- WHEN validation fails
- THEN the error message MUST state "Password must contain at least one lowercase letter."

#### Scenario: Error message specifies number requirement
- GIVEN a password missing numbers
- WHEN validation fails
- THEN the error message MUST state "Password must contain at least one number."

#### Scenario: Only first violation is reported
- GIVEN a password with multiple violations
- WHEN validation fails
- THEN only the first failed requirement MUST be reported
- AND the user MUST fix issues one at a time

**Acceptance Criteria:**
- Error messages are specific and actionable
- Messages explain what is required, not just what is wrong
- Consistent message format across all requirements
- Messages are in English (Russian localization deferred)
- No technical jargon or implementation details
- Maximum length error message included

---

### Requirement: Password Validation Test Coverage
The system MUST include comprehensive tests verifying password validation works correctly.

#### Scenario: Unit tests verify validation logic
- GIVEN unit tests for `validatePassword` function
- WHEN tests are executed
- THEN they MUST verify:
  - Valid passwords pass (multiple examples with Latin letters only)
  - Invalid characters fail with correct error (Unicode/Cyrillic rejected)
  - Too-long passwords fail with correct error (> 72 chars)
  - Too-short passwords fail with correct error (< 8 chars)
  - Missing uppercase fails with correct error
  - Missing lowercase fails with correct error
  - Missing number fails with correct error
  - Special characters are allowed
  - Spaces are allowed
  - Character whitelist check happens first
  - Multiple violations return first error only
  - Edge cases: empty string, exactly 8 chars, exactly 72 chars

#### Scenario: Integration tests verify registration enforcement
- GIVEN integration tests added to existing `registration.test.ts` file
- WHEN tests are executed
- THEN they MUST verify:
  - Strong password allows registration
  - Invalid characters block registration with correct error (Cyrillic rejected)
  - Too-long password blocks registration with correct error
  - Too-short password blocks registration with correct error
  - Each requirement violation is tested
  - No user is created when validation fails
  - Password is not hashed when validation fails
- AND tests MUST use existing test infrastructure (no duplicate mocking)

#### Scenario: Tests verify existing users can login
- GIVEN integration tests added to existing `login.test.ts` file
- WHEN a user with weak password (created before requirements) attempts login
- THEN tests MUST verify login succeeds
- AND password validation is NOT applied to login
- AND tests MUST use existing test infrastructure (no duplicate mocking)

#### Scenario: Tests verify character whitelist enforcement
- GIVEN tests with invalid character passwords (Cyrillic, emoji, etc.)
- WHEN tests are executed
- THEN they MUST verify:
  - Unicode/Cyrillic characters are rejected with correct error
  - Character whitelist check happens before other validations
  - Only Latin letters, numbers, and standard special characters are allowed

**Acceptance Criteria:**
- Unit tests for `validatePassword` utility (minimum 12 test cases)
- Integration tests added to existing `registration.test.ts` (minimum 7 test cases)
- Integration test added to existing `login.test.ts` (1 test case for backward compatibility)
- All tests MUST pass before deployment
- Tests use realistic password examples
- Edge cases covered (empty string, exactly 8 chars, exactly 72 chars, invalid characters)
- Tests integrated into existing test infrastructure (no parallel testing pipeline)
- No duplicate mocking setup - uses existing helpers and patterns
