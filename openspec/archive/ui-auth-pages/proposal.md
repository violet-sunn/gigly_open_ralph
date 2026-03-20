# Change Proposal: UI Authentication Pages Token Migration

## Change ID
`ui-auth-pages`

## Status
Proposed

## Overview
Migrate authentication pages (login, registration, homepage) to token-based styling following the design patterns established in Dashboard (Phase 5) and the Figma prototype. This change ensures visual consistency across the application by applying the same card hierarchy, spacing rhythm, and form styling patterns to auth-specific content.

## Problem Statement
The current authentication pages (login, registration, homepage) use hardcoded color values (bg-navy-800, border-gray-700, etc.) that are inconsistent with the token-based design system established in the Dashboard migration. This creates visual discontinuity when users transition between authentication flows and the main application, and makes it difficult to maintain design consistency as the system evolves.

## Proposed Solution
Systematically replace hardcoded styling with design tokens across all authentication pages, implementing:

1. **Form Card Hierarchy**: Form containers use `bg-surface-level-1` for consistency with Dashboard card patterns
2. **Form Input Styling**: Consistent border colors, focus states, and spacing matching Dashboard form elements
3. **Spacing Rhythm**: Apply same padding (p-5/p-6 for containers, gap-6 for form fields) and spacing patterns
4. **CTA Prominence**: Primary actions (Login, Register buttons) use prominent blue (#1379f3), secondary actions use text links
5. **Error Message Styling**: Consistent error display using `text-error-500` matching Dashboard warning/error patterns
6. **Role Selector**: Maintain existing CLIENT/SPECIALIST role selector with token-based styling

## Scope

### In Scope
- Homepage (`app/page.tsx`)
  - Anonymous user view with "Get Started" and "Sign in" CTAs
  - Authenticated user view with email display and logout button
  - Token-based background and card styling
- Login page (`app/login/page.tsx`)
  - Form container card styling
  - Input field styling (email, password)
  - Submit button styling
  - Error message display
  - Link to registration page
- Registration page (`app/register/page.tsx`)
  - Form container card styling
  - Role selector styling (CLIENT/SPECIALIST radio buttons)
  - Input field styling (email, password)
  - Submit button styling
  - Error message display
  - Link to login page

### Out of Scope
- Authentication logic or server actions (functionality preserved)
- Form validation rules (preserved exactly)
- Field names, labels, or placeholder text (preserved exactly)
- Role selector values (CLIENT, SPECIALIST preserved)
- Password requirements or validation
- Session management
- Middleware route protection
- New features or functionality
- Other pages beyond authentication flow

## Design Reference
Figma prototype: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385&t=0aLnY5jB4AITgNDX-4

This prototype defines the visual hierarchy, spacing rhythm, and form styling patterns that this change implements, consistent with Dashboard (Phase 5) patterns.

## Constraints
- MUST preserve all existing functionality (no behavioral changes)
- MUST preserve all form field names, labels, and placeholder text
- MUST preserve role selector values (CLIENT, SPECIALIST)
- MUST preserve error message display logic
- MUST maintain accessibility (ARIA labels, keyboard navigation, form validation)
- MUST pass existing integration tests (login, registration)
- MUST pass existing E2E tests (authentication flow)
- MUST use design tokens from `openspec/specs/ui/design-tokens.json`
- MUST NOT introduce new dependencies or libraries
- MUST NOT modify authentication server actions or session logic

## Success Criteria
1. All form containers use `bg-surface-level-1` with `border-neutral-weak`
2. Form inputs use consistent styling with Dashboard form elements
3. Spacing follows Dashboard rhythm (p-5/p-6 padding, gap-6 for form fields)
4. Primary action buttons use solid blue (#1379f3) with hover states
5. Secondary actions use text link styling (text-blue-500 hover:text-blue-400)
6. Error messages use `text-error-500` consistently
7. Role selector maintains CLIENT/SPECIALIST values with token-based styling
8. All existing integration tests pass without modification
9. All existing E2E tests pass without modification
10. Visual consistency with Dashboard verified
11. Authentication flow works identically (login, registration, logout)
12. Role selection works identically

## Testing Strategy
- Run existing integration tests: `__tests__/integration/login.test.ts`
- Run existing integration tests: `__tests__/integration/registration.test.ts`
- Run E2E authentication flow tests
- Manual testing: login with valid/invalid credentials
- Manual testing: registration with CLIENT and SPECIALIST roles
- Manual testing: role selector interaction
- Manual testing: error message display
- Visual verification against Figma prototype
- Visual comparison with Dashboard form elements
- Accessibility audit (keyboard navigation, screen reader, form validation)

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing tests | High | Run tests frequently during implementation, preserve exact DOM structure and data attributes |
| Form validation issues | High | Preserve all HTML5 validation attributes, test all error paths |
| Role selector functionality | High | Preserve exact radio button structure, test both CLIENT and SPECIALIST paths |
| Visual regression | Medium | Side-by-side comparison with Dashboard forms and Figma prototype |
| Accessibility degradation | Medium | Maintain all ARIA labels, test with keyboard navigation and screen readers |

## Dependencies
- Design tokens must be defined in `openspec/specs/ui/design-tokens.json`
- Tailwind config must include token-based utility classes
- Dashboard (Phase 5) patterns established as reference
- No external dependencies required

## Rollout Plan
1. Update homepage styling (anonymous and authenticated views)
2. Update login page styling
3. Update registration page styling (including role selector)
4. Run integration test suites
5. Run E2E test suites
6. Visual verification against Dashboard and Figma prototype
7. Accessibility audit
8. Merge to main branch

## Related Changes
- `ui-dashboard-pages` (completed) - Established design patterns this change follows
- Navigation header token migration (future)
- Notification bell token migration (future)
- Gig pages token migration (future)
