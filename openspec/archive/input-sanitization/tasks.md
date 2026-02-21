# Implementation Tasks

## Task 1: Install isomorphic-dompurify library

Install the sanitization library that works in both Node.js and browser environments.

**Implementation:**
```bash
npm install isomorphic-dompurify
npm install --save-dev @types/dompurify
```

**Test Plan:**
- Verify package.json includes `isomorphic-dompurify` dependency
- Run `npm install` successfully
- Verify no dependency conflicts

---

## Task 2: Create sanitization utility function

Create a reusable utility function that sanitizes user input using DOMPurify.

**Implementation:**
- Create new file: `lib/sanitize.ts`
- Import `isomorphic-dompurify`
- Export `sanitizeInput(input: string): string` function
- Configure DOMPurify to:
  - Remove all script tags
  - Remove all event handlers (onclick, onerror, onload, etc.)
  - Remove javascript: protocol URLs
  - Strip ALL HTML tags (plain text only)
  - Preserve line breaks as plain text (\n characters, NOT <br> tags)
- Handle edge cases: empty strings, null/undefined (return empty string)
- **Important:** Output is pure plain text. UI rendering will use CSS `white-space: pre-wrap` to display line breaks, NOT `dangerouslySetInnerHTML`.

**DOMPurify Configuration:**
```typescript
const config = {
  ALLOWED_TAGS: [], // No HTML tags allowed (strict plain text only)
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true, // Keep text content, remove tags
  ALLOW_DATA_ATTR: false,
};
```

**Test Plan:**
- Create `__tests__/unit/sanitize.test.ts`
- Test XSS payloads are neutralized:
  - `<script>alert('XSS')</script>` → empty or safe text
  - `<img src=x onerror="alert('XSS')">` → empty or safe text
  - `<svg onload="alert('XSS')">` → empty or safe text
  - `<iframe src="javascript:alert('XSS')"></iframe>` → empty
  - `<a href="javascript:alert('XSS')">click</a>` → "click" (text only)
  - `<input onfocus="alert('XSS')" autofocus>` → empty
  - `<body onload="alert('XSS')">` → empty
  - `<div style="background:url('javascript:alert(1)')">text</div>` → "text"
- Test safe content is preserved:
  - "Hello, world!" → "Hello, world!"
  - "Line 1\nLine 2" → preserves line breaks
- Test edge cases:
  - Empty string → empty string
  - Whitespace only → empty string
  - Very long string (2000 chars) → sanitized correctly
- Run: `npm run test:unit -- sanitize.test.ts`

---

## Task 3: Add sanitization to gig creation

Sanitize all text fields in `createGig` server action before database storage.

**Implementation:**
- Modify file: `app/actions/gig.ts`
- Import `sanitizeInput` from `lib/sanitize`
- In `createGig` function, sanitize fields BEFORE validation:
  ```typescript
  const title = sanitizeInput(formData.get('title')?.toString() || '').trim();
  const description = sanitizeInput(formData.get('description')?.toString() || '').trim();
  const acceptanceCriteria = sanitizeInput(formData.get('acceptanceCriteria')?.toString() || '').trim();
  const goal = sanitizeInput(formData.get('goal')?.toString() || '').trim();
  const deliverables = sanitizeInput(formData.get('deliverables')?.toString() || '').trim();
  const constraints = sanitizeInput(formData.get('constraints')?.toString() || '').trim();
  ```
- Ensure validation happens on sanitized content
- Tags array should also be sanitized (each tag individually)

**Test Plan:**
- Add tests to `__tests__/integration/gig-creation.test.ts`
- Test XSS in title:
  - Submit gig with title `<script>alert('XSS')</script>Test Gig`
  - Verify stored title does not contain script tags
  - Verify gig is created successfully
- Test XSS in description:
  - Submit gig with description containing `<img onerror="alert('XSS')">`
  - Verify stored description is sanitized
- Test XSS in acceptanceCriteria:
  - Submit with malicious payload
  - Verify sanitized content meets 50-char minimum
- Test validation on sanitized content:
  - Submit title with only `<script></script>` (empty after sanitization)
  - Verify error: "Title, description, and acceptance criteria are required."
- Test optional fields sanitization:
  - Submit goal/deliverables/constraints with XSS payloads
  - Verify all are sanitized
- Run: `npm run test:unit -- gig-creation.test.ts`

---

## Task 4: Add sanitization to application submission

Sanitize all text fields in `applyToGig` server action before database storage.

**Implementation:**
- Modify file: `app/actions/gig.ts`
- Import `sanitizeInput` (if not already imported)
- In `applyToGig` function, sanitize fields BEFORE validation:
  ```typescript
  const approach = sanitizeInput(formData.get('approach')?.toString() || '').trim();
  const questions = sanitizeInput(formData.get('questions')?.toString() || '').trim();
  const estimatedEffort = sanitizeInput(formData.get('estimatedEffort')?.toString() || '').trim();
  ```
- Ensure validation happens on sanitized content

**Test Plan:**
- Create new test file: `__tests__/integration/application-sanitization.test.ts`
- Test XSS in approach field:
  - Submit application with approach containing `<script>alert('XSS')</script>` + valid text
  - Verify stored approach is sanitized
  - Verify application is created successfully
- Test XSS in questions field:
  - Submit with malicious payload in questions
  - Verify sanitized content meets 50-char minimum
- Test validation on sanitized content:
  - Submit approach with only HTML tags (< 100 chars after sanitization)
  - Verify error about minimum length
- Test optional estimatedEffort:
  - Submit with XSS payload
  - Verify sanitized correctly
- Run: `npm run test:unit -- application-sanitization.test.ts`

---

## Task 5: Add sanitization to messaging

Sanitize message content in `sendMessage` server action before database storage.

**Implementation:**
- Modify file: `app/actions/gig.ts`
- Import `sanitizeInput` (if not already imported)
- In `sendMessage` function, sanitize content BEFORE validation:
  ```typescript
  const content = sanitizeInput(formData.get('content')?.toString() || '').trim();
  ```
- Ensure validation happens on sanitized content

**Test Plan:**
- Create new test file: `__tests__/integration/message-sanitization.test.ts`
- Test XSS in message content:
  - Send message with `<script>alert('XSS')</script>Hello`
  - Verify stored content is sanitized
  - Verify message is created successfully
- Test empty content after sanitization:
  - Send message with only `<script></script>`
  - Verify error: "Message content is required."
- Test line breaks are preserved:
  - Send message with "Line 1\nLine 2\nLine 3"
  - Verify line breaks are preserved in stored content
- Test length validation on sanitized content:
  - Send message with 1900 chars text + 200 chars HTML tags
  - Verify sanitization happens first
  - Verify message is accepted if sanitized content <= 2000 chars
- Run: `npm run test:unit -- message-sanitization.test.ts`

---

## Task 6: Add sanitization to profile updates

Sanitize all text fields in `updateProfile` server action before database storage.

**Implementation:**
- Modify file: `app/actions/profile.ts`
- Import `sanitizeInput` from `lib/sanitize`
- Sanitize CLIENT fields:
  ```typescript
  const companyName = sanitizeInput(formData.get('companyName')?.toString() || '').trim();
  const inn = sanitizeInput(formData.get('inn')?.toString() || '').trim();
  ```
- Sanitize SPECIALIST fields:
  ```typescript
  const techStack = sanitizeInput(formData.get('techStack')?.toString() || '').trim();
  const bio = sanitizeInput(formData.get('bio')?.toString() || '').trim();
  ```
- Ensure validation happens on sanitized content

**Test Plan:**
- Create new test file: `__tests__/integration/profile-sanitization.test.ts`
- Test CLIENT companyName sanitization:
  - Update profile with companyName containing XSS payload
  - Verify stored companyName is sanitized
  - Verify required field validation still works
- Test SPECIALIST techStack sanitization:
  - Update profile with techStack containing malicious HTML
  - Verify stored techStack is sanitized
  - Verify commas/line breaks are preserved
- Test validation on sanitized content:
  - Submit companyName with only HTML tags (empty after sanitization)
  - Verify error: "Company name and INN are required."
- Run: `npm run test:unit -- profile-sanitization.test.ts`

---

## Task 7: Add comprehensive XSS test suite

Create a dedicated test suite that verifies all common XSS attack vectors are blocked.

**Implementation:**
- Create new test file: `__tests__/integration/xss-protection.test.ts`
- Test all server actions with comprehensive XSS payloads
- Use OWASP XSS cheat sheet as reference

**Test Plan:**
- Test each server action with all XSS payloads:
  - `<script>alert('XSS')</script>`
  - `<img src=x onerror="alert('XSS')">`
  - `<svg onload="alert('XSS')">`
  - `<iframe src="javascript:alert('XSS')"></iframe>`
  - `<a href="javascript:alert('XSS')">click</a>`
  - `<input onfocus="alert('XSS')" autofocus>`
  - `<body onload="alert('XSS')">`
  - `<div style="background:url('javascript:alert(1)')">`
  - `<object data="javascript:alert('XSS')">`
  - `<embed src="javascript:alert('XSS')">`
- Verify stored data does not contain executable scripts
- Verify data is safe to display in UI
- Run: `npm run test:unit -- xss-protection.test.ts`

---

## Task 8: Update documentation

Document the sanitization approach and configuration.

**Implementation:**
- Add section to `openspec/specs/security/spec.md` (already created)
- Update `README.md` or create `SECURITY.md` with:
  - Explanation of sanitization approach
  - DOMPurify configuration details
  - Guidelines for adding new user input fields
  - Testing requirements for XSS protection

**Test Plan:**
- Review documentation for completeness
- Verify all sanitization points are documented
- Verify configuration is clearly explained

---

## Task 9: Run full test suite and verify

Ensure all existing tests still pass and new tests are green.

**Implementation:**
- Run full test suite: `npm test`
- Run coverage report: `npm run test:coverage`
- Verify no regressions in existing functionality

**Test Plan:**
- All existing tests MUST pass (376 tests from previous changes)
- All new XSS tests MUST pass
- Code coverage for sanitization utility MUST be 100%
- Integration test coverage for sanitized actions MUST be > 90%
- Run: `npm test`
- Review coverage report in `coverage/index.html`

---

## Summary

**Total Tasks:** 9
**Estimated Effort:** 4-6 hours
**Critical Path:** Task 2 → Tasks 3-6 (can be done in parallel) → Task 7 → Task 9

**Next Steps:**
After completing these tasks, run `/ralphy-implement` to begin implementation, or run `/ralphy-validate` after implementation to verify against acceptance criteria.
