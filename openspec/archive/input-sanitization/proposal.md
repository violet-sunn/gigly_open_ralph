# Change Proposal: Input Sanitization

## Problem Statement

User-generated content (gig descriptions, messages, profiles) is currently stored and displayed without sanitization, creating a critical XSS (Cross-Site Scripting) vulnerability. Malicious users can inject JavaScript code through any text input field, which will execute when other users view the content.

**Attack vectors:**
- Gig titles/descriptions with `<script>` tags
- Application text with event handlers (`<img onerror="...">`)
- Messages with malicious HTML/JavaScript
- Profile fields with embedded scripts

**Impact:**
- Session hijacking (stealing JWT tokens)
- Unauthorized actions on behalf of victims
- Data theft from authenticated users
- Platform reputation damage

## Proposed Solution

Implement comprehensive input sanitization using **isomorphic-dompurify** library:

1. **Server-side sanitization** (primary defense): Sanitize all user inputs in server actions before database storage
2. **Plain text storage**: Strip ALL HTML tags, store as pure plain text with `\n` line breaks
3. **CSS-based rendering**: Use `white-space: pre-wrap` in UI to display line breaks (NOT `dangerouslySetInnerHTML`)
4. **Remove dangerous content**: Strip all script tags, event handlers, and dangerous attributes

## Scope

### In Scope
- Install and configure isomorphic-dompurify
- Create reusable sanitization utility functions
- Sanitize all text inputs in server actions:
  - Gig creation (title, description, acceptanceCriteria, goal, deliverables, constraints)
  - Application submission (approach, questions, estimatedEffort)
  - Messaging (message content)
  - Profile updates (companyName, techStack, bio)
- Add comprehensive tests for XSS payload detection
- Document sanitization configuration

### Out of Scope
- File upload sanitization (not implemented yet)
- Rich text editor integration (deferred to post-MVP)
- Content Security Policy headers (separate security hardening task)
- Rate limiting / DDoS protection (separate task)

## Non-Goals

- This change does NOT implement a rich text editor
- This change does NOT add HTML formatting capabilities to user content
- This change does NOT modify the UI/UX of input forms

## Constraints

- MUST preserve existing line breaks in user content (store as plain text `\n` characters, render with CSS `white-space: pre-wrap`)
- MUST NOT break existing data (backward compatible with unsanitized content)
- MUST maintain current validation rules (length limits, required fields)
- MUST NOT impact performance significantly (sanitization should be fast)

## Dependencies

- None (new library installation only)

## Risks & Mitigations

**Risk:** Over-sanitization removes legitimate content
- **Mitigation:** Use permissive DOMPurify config that allows basic text formatting, test with real-world content

**Risk:** Performance impact on large text inputs
- **Mitigation:** DOMPurify is fast; benchmark with 2000-char messages (current max length)

**Risk:** Existing unsanitized data in database
- **Mitigation:** Sanitize on display as fallback; consider one-time migration script (optional)

## Success Criteria

1. All XSS test payloads are neutralized (verified by tests)
2. Legitimate content with line breaks displays correctly
3. All existing tests continue to pass
4. No performance degradation (< 10ms per sanitization call)
