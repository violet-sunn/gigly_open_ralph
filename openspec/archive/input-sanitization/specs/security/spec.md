# Security Specification: Input Sanitization

## Requirements

### Requirement: Sanitization Utility Function
The system MUST provide a `sanitizeInput` utility function that removes malicious HTML/JavaScript while preserving safe text formatting.

#### Scenario: Script tags are removed
- GIVEN input text containing `<script>alert('XSS')</script>`
- WHEN `sanitizeInput` is called
- THEN the output MUST NOT contain any script tags
- AND the output MUST be safe to render in HTML context

#### Scenario: Event handlers are removed
- GIVEN input text containing `<img src=x onerror="alert('XSS')">`
- WHEN `sanitizeInput` is called
- THEN the output MUST NOT contain any event handler attributes
- AND the output MUST be safe to render

#### Scenario: Dangerous attributes are removed
- GIVEN input text containing `<a href="javascript:alert('XSS')">click</a>`
- WHEN `sanitizeInput` is called
- THEN the output MUST NOT contain javascript: protocol URLs
- AND the output MUST be safe to render

#### Scenario: Line breaks are preserved as plain text
- GIVEN input text containing "Line 1\nLine 2\nLine 3"
- WHEN `sanitizeInput` is called
- THEN the output MUST preserve line breaks as plain text `\n` characters (NOT `<br>` tags)
- AND the text content MUST remain readable
- AND UI rendering MUST use CSS `white-space: pre-wrap` to display line breaks

#### Scenario: Safe text is unchanged
- GIVEN input text containing only plain text "Hello, world!"
- WHEN `sanitizeInput` is called
- THEN the output MUST be identical to the input
- AND no characters MUST be escaped or modified

#### Scenario: Empty or whitespace-only input
- GIVEN input text that is empty string or only whitespace
- WHEN `sanitizeInput` is called
- THEN the output MUST be an empty string
- AND no errors MUST be thrown

**Acceptance Criteria:**
- `sanitizeInput` is exported from `lib/sanitize.ts`
- Uses `isomorphic-dompurify` library for sanitization
- Configuration allows basic text formatting but blocks all scripts
- Returns string type (never null or undefined)
- Handles edge cases: empty strings, very long strings (up to 2000 chars)
- Performance: < 10ms for 2000-character input

---

### Requirement: Gig Creation Sanitization
The system MUST sanitize all text fields in `createGig` server action before database storage.

#### Scenario: Gig title is sanitized
- GIVEN a CLIENT submits gig with title containing `<script>alert('XSS')</script>`
- WHEN `createGig` is called
- THEN the stored title MUST have script tags removed
- AND the gig MUST be created successfully
- AND validation rules (length, required) MUST still apply after sanitization

#### Scenario: Gig description is sanitized
- GIVEN a CLIENT submits gig with description containing malicious HTML
- WHEN `createGig` is called
- THEN the stored description MUST be sanitized
- AND line breaks MUST be preserved as plain text `\n` characters

#### Scenario: Acceptance criteria is sanitized
- GIVEN a CLIENT submits acceptanceCriteria with XSS payload
- WHEN `createGig` is called
- THEN the stored acceptanceCriteria MUST be sanitized
- AND minimum length validation (50 chars) MUST apply to sanitized content

#### Scenario: Optional fields are sanitized
- GIVEN a CLIENT submits goal, deliverables, constraints with malicious content
- WHEN `createGig` is called
- THEN all three optional fields MUST be sanitized
- AND empty fields MUST remain empty strings

#### Scenario: Sanitization happens before validation
- GIVEN a CLIENT submits title with `<script>` tags that would make it too short after sanitization
- WHEN `createGig` is called
- THEN sanitization MUST happen first
- AND validation MUST check the sanitized length
- AND appropriate error MUST be returned if sanitized content is too short

**Acceptance Criteria:**
- All text fields sanitized: title, description, acceptanceCriteria, goal, deliverables, constraints
- Sanitization occurs before validation checks
- Trimming happens after sanitization
- Existing validation rules still enforced on sanitized content
- No breaking changes to API contract

---

### Requirement: Application Submission Sanitization
The system MUST sanitize all text fields in `applyToGig` server action before database storage.

#### Scenario: Technical approach is sanitized
- GIVEN a SPECIALIST submits application with approach containing XSS payload
- WHEN `applyToGig` is called
- THEN the stored approach MUST be sanitized
- AND minimum length validation (100 chars) MUST apply to sanitized content

#### Scenario: Clarifying questions are sanitized
- GIVEN a SPECIALIST submits questions with malicious HTML
- WHEN `applyToGig` is called
- THEN the stored questions MUST be sanitized
- AND minimum length validation (50 chars) MUST apply to sanitized content

#### Scenario: Estimated effort is sanitized
- GIVEN a SPECIALIST submits estimatedEffort with XSS payload
- WHEN `applyToGig` is called
- THEN the stored estimatedEffort MUST be sanitized
- AND empty optional field MUST remain empty string

**Acceptance Criteria:**
- All text fields sanitized: approach, questions, estimatedEffort
- Sanitization occurs before validation checks
- Existing validation rules still enforced on sanitized content
- coverLetter field (legacy) also sanitized if present

---

### Requirement: Message Content Sanitization
The system MUST sanitize message content in `sendMessage` server action before database storage.

#### Scenario: Message content is sanitized
- GIVEN an authorized user sends message with XSS payload
- WHEN `sendMessage` is called
- THEN the stored content MUST be sanitized
- AND line breaks MUST be preserved as plain text `\n` characters for readability

#### Scenario: Empty message after sanitization
- GIVEN a user sends message containing only `<script></script>` tags
- WHEN `sendMessage` is called
- THEN after sanitization the content MUST be empty or whitespace
- AND validation MUST return error "Message content is required."

#### Scenario: Message length validation on sanitized content
- GIVEN a user sends message with 1900 chars of text + 200 chars of HTML tags
- WHEN `sendMessage` is called
- THEN sanitization MUST happen first
- AND length validation (2000 chars max) MUST check sanitized content
- AND message MUST be accepted if sanitized content <= 2000 chars

**Acceptance Criteria:**
- Message content field sanitized before storage
- Sanitization occurs before validation checks
- Empty content after sanitization triggers validation error
- Maximum length (2000 chars) checked on sanitized content

---

### Requirement: Profile Update Sanitization
The system MUST sanitize all text fields in `updateProfile` server action before database storage.

#### Scenario: CLIENT company name is sanitized
- GIVEN a CLIENT updates profile with companyName containing XSS payload
- WHEN `updateProfile` is called
- THEN the stored companyName MUST be sanitized
- AND required field validation MUST still apply

#### Scenario: SPECIALIST tech stack is sanitized
- GIVEN a SPECIALIST updates profile with techStack containing malicious HTML
- WHEN `updateProfile` is called
- THEN the stored techStack MUST be sanitized
- AND line breaks/commas MUST be preserved as plain text for readability

#### Scenario: Profile bio is sanitized
- GIVEN a user updates profile with bio containing XSS payload
- WHEN `updateProfile` is called
- THEN the stored bio MUST be sanitized
- AND line breaks MUST be preserved as plain text `\n` characters

**Acceptance Criteria:**
- All text fields sanitized: companyName, inn, techStack, bio, and any other text fields
- Sanitization occurs before validation checks
- Existing validation rules still enforced on sanitized content
- Role-specific fields handled correctly

---

### Requirement: XSS Test Coverage
The system MUST include comprehensive tests that verify XSS payloads are neutralized.

#### Scenario: Common XSS payloads are blocked
- GIVEN a test suite with common XSS attack vectors
- WHEN tests are executed
- THEN all of the following MUST be sanitized:
  - `<script>alert('XSS')</script>`
  - `<img src=x onerror="alert('XSS')">`
  - `<svg onload="alert('XSS')">`
  - `<iframe src="javascript:alert('XSS')"></iframe>`
  - `<a href="javascript:alert('XSS')">click</a>`
  - `<input onfocus="alert('XSS')" autofocus>`
  - `<body onload="alert('XSS')">`
  - `<div style="background:url('javascript:alert(1)')">`

#### Scenario: Sanitization integration tests
- GIVEN integration tests for each server action
- WHEN tests submit forms with XSS payloads
- THEN the stored data MUST NOT contain executable scripts
- AND the data MUST be safe to display

**Acceptance Criteria:**
- Unit tests for `sanitizeInput` utility (minimum 8 XSS payload tests)
- Integration tests for each server action with XSS payloads
- Tests verify both storage and display safety
- All tests MUST pass before deployment
