# Security: Input Sanitization

## Overview

All user-generated content is sanitized to prevent XSS (Cross-Site Scripting) attacks. The platform uses **isomorphic-dompurify** to strip all HTML tags and dangerous content from user inputs before storage.

## Implementation

### Sanitization Function

Location: `lib/sanitize.ts`

```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string | null | undefined): string {
  // Removes all HTML tags, scripts, event handlers, and javascript: protocols
  // Returns pure plain text
}
```

### Configuration

- **Approach**: Plain text only - ALL HTML tags are removed
- **Line breaks**: Preserved as `\n` characters in plain text
- **UI rendering**: Use CSS `white-space: pre-wrap` to display line breaks
- **Never use**: `dangerouslySetInnerHTML` for user content

### Sanitized Fields

**Gig Creation** (`app/actions/gig.ts`):
- title
- description
- acceptanceCriteria
- goal (optional)
- deliverables (optional)
- constraints (optional)
- tags

**Application Submission** (`app/actions/gig.ts`):
- approach
- questions
- estimatedEffort

**Messaging** (`app/actions/gig.ts`):
- content

**Profile Updates** (`app/actions/profile.ts`):
- CLIENT: companyName, inn, kpp, contactPerson, phoneNumber
- SPECIALIST: displayName, techStack, bio

## Process Flow

1. **User submits form** → FormData received by server action
2. **Sanitization** → `sanitizeInput()` removes all HTML tags
3. **Trimming** → Whitespace trimmed from sanitized content
4. **Validation** → Length and required field checks on sanitized content
5. **Storage** → Clean plain text stored in database
6. **Display** → Rendered with CSS `white-space: pre-wrap`

## XSS Protection

The following attack vectors are blocked:

- `<script>` tags
- Event handlers (`onclick`, `onerror`, `onload`, etc.)
- `javascript:` protocol URLs
- `<iframe>`, `<object>`, `<embed>` tags
- `<img>` tags with malicious attributes
- `<svg>` tags with event handlers
- Inline styles with `javascript:` URLs

## Testing

Comprehensive test coverage in:
- `__tests__/unit/sanitize.test.ts` - Unit tests for sanitization function
- `__tests__/integration/gig-creation.test.ts` - XSS tests for gig creation
- `__tests__/integration/application-sanitization.test.ts` - Application XSS tests
- `__tests__/integration/message-sanitization.test.ts` - Message XSS tests
- `__tests__/integration/profile-sanitization.test.ts` - Profile XSS tests
- `__tests__/integration/xss-protection.test.ts` - Comprehensive XSS test suite

## Adding New User Input Fields

When adding new user input fields:

1. **Import sanitization**: `import { sanitizeInput } from '@/lib/sanitize'`
2. **Sanitize before validation**:
   ```typescript
   const userInput = sanitizeInput(formData.get('fieldName') as string).trim()
   ```
3. **Validate sanitized content**: Check length, required fields on sanitized text
4. **Add tests**: Create XSS tests for the new field
5. **UI rendering**: Use CSS `white-space: pre-wrap` for line breaks

## Performance

- Sanitization overhead: < 10ms per field
- No impact on user experience
- Runs server-side only (no client-side performance impact)

## Backward Compatibility

- Existing unsanitized data in database is safe when displayed (sanitization happens on input, not output)
- No migration required for existing data
- All new data is automatically sanitized

## Security Notes

- **Defense in depth**: Sanitization is the primary defense, but always use proper output encoding
- **Never trust user input**: All user-provided data goes through sanitization
- **Plain text only**: No HTML formatting is allowed in user content
- **Line breaks**: Preserved as plain text `\n`, rendered with CSS

---

# Security: CSRF Protection

## Overview

Next.js 15 provides built-in CSRF (Cross-Site Request Forgery) protection for Server Actions via **Origin header matching**. Next.js compares the `Origin` header to the `Host` header on all Server Action requests and rejects mismatches with 403 Forbidden. No CSRF tokens are used.

## How It Works

1. **Browser sends request** → Includes `Origin` header with the request
2. **Next.js validates** → Compares `Origin` header to `Host` header
3. **Origin matches** → Request is allowed, Server Action executes
4. **Origin mismatch** → Request is rejected with 403 Forbidden, Server Action does NOT execute

## Configuration

**Default (Recommended)**: No configuration needed. CSRF protection is enabled by default.

**Risk**: `serverActions.allowedOrigins` in `next.config.ts` can weaken protection:
- ❌ **NEVER use wildcards**: `*`, `*.example.com`
- ❌ **NEVER allow untrusted domains**: Third-party sites
- ❌ **NEVER allow dev origins in production**: `http://localhost:*`
- ✅ **Preferred**: No `allowedOrigins` configuration (default is most secure)

## Verification

**E2E Tests**: `__tests__/e2e/csrf-protection.spec.ts`
- Tests cross-origin requests are rejected (spoofed Origin header)
- Tests same-origin requests are accepted
- Covers: login, createGig, sendMessage Server Actions

**Config Tests**: `__tests__/unit/config-validation.test.ts`
- Verifies no dangerous `allowedOrigins` configuration
- Verifies middleware doesn't bypass Origin checks

**Run Tests**:
```bash
npm run test:e2e -- csrf-protection
npm test -- config-validation
```

## Pre-Deployment Checklist

- [ ] Run CSRF E2E tests: `npm run test:e2e -- csrf-protection`
- [ ] Verify `next.config.ts` has no `serverActions.allowedOrigins` with wildcards or untrusted domains
- [ ] Check `middleware.ts` does not manipulate Origin or Host headers
- [ ] Run all tests: `npm test` (ensure no regressions)
- [ ] If Next.js version updated, verify CSRF tests still pass

## Code Review Checklist

- [ ] If `next.config.ts` modified, verify no dangerous `allowedOrigins` added
- [ ] If `middleware.ts` modified, ensure it doesn't bypass Origin checks
- [ ] If new Server Actions added, verify CSRF test coverage
- [ ] Confirm CSRF tests are passing in CI/CD

## Security Audit Checklist

- [ ] Verify Next.js Origin header matching is functioning
- [ ] Test that Server Actions reject cross-origin requests
- [ ] Verify legitimate same-origin requests work correctly
- [ ] Confirm no dangerous `allowedOrigins` configuration exists
- [ ] Review CSRF test suite for completeness

## Next.js Version Update Checklist

- [ ] Run CSRF tests before and after update
- [ ] Verify CSRF protection still works as expected
- [ ] Check Next.js release notes for CSRF-related changes
- [ ] Test in staging environment
- [ ] Ensure all tests pass with new version

## Protected Server Actions

All Server Actions are protected by Next.js CSRF mechanism:
- **Authentication**: login, register, logout
- **Gig operations**: createGig, submitWork, approveWork, markAsPaid
- **Applications**: applyToGig, acceptApplication, rejectApplication
- **Messaging**: sendMessage
- **Profile**: updateProfile
- **Admin**: suspendUser, unsuspendUser, closeGig

## Testing Methodology

See `TESTING.md` for detailed CSRF testing guide, including:
- How to write CSRF tests for new Server Actions
- Route interception patterns for spoofing Origin headers
- Example test code and best practices

