# Change Proposal: Password Strength Requirements

## Problem Statement

Currently, Gigly has no password strength requirements, allowing users to register with weak passwords like "123456", "password", or "abc". This creates several security vulnerabilities:

1. **Account Takeover Risk**: Weak passwords are easily guessed or brute-forced, even with rate limiting in place
2. **Credential Stuffing**: Users who reuse weak passwords across sites are vulnerable to credential stuffing attacks
3. **Bcrypt DoS Vulnerability**: Bcrypt silently truncates passwords longer than 72 bytes, and processing excessively long passwords can block the Node.js event loop, creating a denial-of-service attack vector
4. **Professional Image**: A B2B platform allowing weak passwords undermines trust and professionalism
5. **Compliance Gap**: Many enterprise clients require vendors to enforce password policies

These vulnerabilities directly threaten the platform's core value propositions:
- **Trust Through Transparency** (Design Principle #2): Weak passwords erode user trust
- **Professional B2B Experience** (Design Principle #3): Enterprise clients expect basic security hygiene

## Proposed Solution

Implement password strength validation that enforces minimum security requirements:

1. **Validation Rules**:
   - Character whitelist: Only Latin letters (A-Z, a-z), numbers (0-9), and standard special characters allowed
   - Maximum 72 characters (bcrypt limit + DoS prevention)
   - Minimum 8 characters
   - At least one uppercase letter (A-Z, Latin only)
   - At least one lowercase letter (a-z, Latin only)
   - At least one number (0-9)

2. **Enforcement Points**:
   - Registration (immediate)
   - Password reset (when implemented in future)

3. **User Experience**:
   - Clear, specific error messages explaining which requirements are not met
   - Validation happens server-side before password hashing
   - No breaking changes for existing users (only enforced on new passwords)

4. **Implementation Approach**:
   - Create reusable `validatePassword()` utility function
   - Use standard ASCII regex (`/[A-Z]/` and `/[a-z]/`) for Latin character validation
   - Add character whitelist validation to reject Unicode/Cyrillic characters
   - Integrate into `registerUser` server action
   - Return specific error messages for each failed requirement
   - Add comprehensive test coverage

### Why These Requirements?

- **Character whitelist (Latin only)**: Enforces ASCII-only passwords to prevent encoding issues and ensure consistent behavior. Rejects Unicode/Cyrillic characters with clear error message.
- **72 characters maximum**: Bcrypt truncates passwords at 72 bytes, and processing excessively long passwords can block the Node.js event loop, creating a DoS vulnerability. Since we enforce ASCII-only, 1 character = 1 byte, making this limit perfectly safe.
- **8 characters minimum**: Industry standard, balances security and usability
- **Mixed case + number**: Significantly increases password entropy without being overly complex
- **Standard ASCII regex**: Uses `/[A-Z]/` and `/[a-z]/` for simple, reliable Latin character validation
- **No special characters required**: Avoids common UX friction while still providing good security
- **Server-side validation**: Cannot be bypassed by client manipulation

## Constraints & Non-Goals

### In Scope
✅ Password validation utility function
✅ Integration into registration flow
✅ Clear, actionable error messages
✅ Unit tests for validation logic
✅ Integration tests for registration with weak passwords
✅ Reusable design for future password reset feature

### Out of Scope (Deferred)
❌ Password strength meter UI (visual feedback)
❌ Password reset functionality (separate feature)
❌ Forcing existing users to update passwords
❌ Special character requirements (too much friction for MVP)
❌ Password history/reuse prevention
❌ Configurable password policies per role
❌ Integration with password managers (browser handles this)

### Technical Requirements

**No new dependencies**: Use built-in JavaScript regex for validation

**Latin-only character set**: Use standard ASCII regex (`/[A-Z]/` and `/[a-z]/`) to enforce Latin letters only. Reject Unicode/Cyrillic characters with error message "Password can only contain Latin letters, numbers, and special characters."

**Character whitelist validation**: Check that password only contains allowed characters (Latin letters, numbers, standard special characters) before other validations

**Maximum length enforcement**: Enforce 72 character maximum to prevent bcrypt DoS attacks. Since we enforce ASCII-only, 1 character = 1 byte, making this perfectly safe.

**Backward compatibility**: Existing users with weak passwords can still login (validation only applies to new passwords)

**Error message format**: Return specific, actionable messages like "Password must contain at least one uppercase letter" rather than generic "Password is too weak"

**Test integration**: Add tests to existing test files (`registration.test.ts`, `login.test.ts`) using existing test infrastructure - no parallel testing pipeline

## Success Criteria

1. **Security**: Users cannot register with passwords like "123456", "password", "abc123"
2. **User Experience**: Clear error messages guide users to create compliant passwords
3. **Testing**: All validation rules verified by automated tests
4. **No Breaking Changes**: Existing users unaffected, can still login with old passwords
5. **Reusability**: Validation function ready for future password reset feature

## Migration & Rollout

- **No migration needed**: Existing user passwords remain valid
- **Immediate enforcement**: New registrations must comply starting from deployment
- **No user communication needed**: Error messages provide inline guidance
- **Rollback plan**: Can disable validation by removing check from server action

## Alternative Approaches Considered

1. **Client-side validation only**: Rejected - can be bypassed, not secure
2. **Special character requirement**: Rejected - adds friction without proportional security benefit for MVP
3. **Longer minimum (12+ chars)**: Rejected - 8 chars is industry standard and sufficient with complexity rules
4. **Password strength meter**: Deferred - nice-to-have UX enhancement, not critical for MVP
5. **zxcvbn library**: Rejected - adds dependency, regex validation is sufficient for our requirements
6. **Unicode/Cyrillic support with Property Escapes**: Rejected - adds complexity and potential encoding issues. Latin-only character set is simpler and more reliable.
7. **No maximum length**: Rejected - bcrypt truncates at 72 bytes anyway, and long passwords can cause DoS by blocking event loop
8. **Higher maximum (100+ chars)**: Rejected - bcrypt limit is 72 bytes, and processing long passwords is a DoS vector

**Decision**: Enforce Latin-only character set with standard ASCII regex, enforce 72 character maximum for bcrypt compatibility and DoS prevention, and use simple regex-based validation with clear requirements, enforced server-side only.
