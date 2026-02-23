# Change Proposal: input-accessibility-fix

## Change Name
`input-accessibility-fix`

## Problem Statement

User input text is nearly invisible across forms (login, gig creation, messaging, profile editing) due to dark mode CSS in `app/globals.css` conflicting with light-theme UI. This creates WCAG compliance failures and poor form completion rates.

### Current State

The `app/globals.css` file contains a dark mode media query (lines 10-15) that sets CSS variables when the user's system preference is set to dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

The body element uses these variables:
```css
body {
  color: var(--foreground);
  background: var(--background);
}
```

When a user has dark mode enabled in their OS, the body background becomes nearly black (`#0a0a0a`) and text becomes light (`#ededed`). However, the application UI is built entirely for light mode:
- Input fields use `border-gray-300` (light gray borders)
- Buttons use light-theme colors (blue-600, etc.)
- Cards and sections use `bg-gray-50` (light backgrounds)

This creates severe accessibility issues:
- Input text inherits light color (`#ededed`) from body
- Input backgrounds remain white (from Tailwind defaults)
- Result: light text on white background = nearly invisible text
- Users cannot read what they're typing

### Impact

1. **Accessibility Failure**: WCAG 2.1 Level AA requires contrast ratio of at least 4.5:1 for normal text. Light text on white background fails this requirement.
2. **Poor User Experience**: Users with dark mode enabled cannot complete forms (login, registration, gig creation, messaging).
3. **Form Abandonment**: Users likely abandon forms when they cannot see their input.
4. **Inconsistent Visual Experience**: Dark mode CSS only affects text color, not the entire UI, creating a broken half-dark, half-light appearance.

### Root Cause

The dark mode implementation is incomplete:
- CSS variables change body text color based on system preference
- UI components are not designed for dark mode (all use light-theme Tailwind classes)
- Input fields don't explicitly set text color, so they inherit from body
- No dark mode variants exist for buttons, cards, borders, etc.

## Proposed Solution

Remove the dark mode CSS entirely and standardize all input styling for consistent light-theme accessibility.

### Approach

1. **Remove Dark Mode CSS**: Delete the `@media (prefers-color-scheme: dark)` block from `app/globals.css` (lines 10-15)
2. **Standardize Input Styling**: Audit all input fields across all forms and ensure consistent styling:
   - Text color: `text-gray-900` (dark text, explicitly set)
   - Background: `bg-white` or `bg-gray-50` (light backgrounds)
   - Border: `border-gray-300` (light gray)
   - Focus states: `focus:ring-blue-500 focus:border-blue-500`
3. **Test Across All Forms**: Manually verify readable input text on:
   - Login page (`/login`)
   - Registration page (`/register`)
   - Gig creation form (`/dashboard/gigs/new`)
   - Message form (`/dashboard/gigs/[id]`)
   - Profile edit form (`/dashboard/profile/edit`)

### Why Remove Dark Mode Instead of Fixing It?

**Option 1: Fix Dark Mode (NOT CHOSEN)**
- Requires updating every UI component with dark mode variants
- Requires comprehensive dark mode design system
- Requires testing across entire application
- Estimated effort: 20-40 hours
- Not in MVP scope (see `openspec/project.md` line 289: "Not a native mobile app")

**Option 2: Remove Dark Mode (CHOSEN)**
- Provides immediate accessibility fix
- Maintains consistent light-theme experience
- Aligns with current UI implementation
- Estimated effort: 2-3 hours
- Dark mode can be properly implemented post-MVP with full design system

## Scope

### In Scope

1. Remove dark mode media query from `app/globals.css`
2. Audit and update input fields in:
   - `app/login/page.tsx`
   - `app/register/page.tsx`
   - `app/dashboard/gigs/new/gig-form.tsx`
   - `app/dashboard/gigs/[id]/message-form.tsx`
   - `app/dashboard/profile/edit/page.tsx`
3. Audit and update profile view pages:
   - `app/dashboard/profile/page.tsx` (own profile view)
   - `app/dashboard/profile/[userId]/page.tsx` (public profile view)
4. Ensure all inputs have explicit `text-gray-900` class
5. Ensure all text elements (headings, labels, content) have explicit text colors
6. Ensure all inputs have consistent border and focus styling
7. Manual testing across all forms and profile pages with various system preferences

### Out of Scope

- Implementing proper dark mode support (deferred to post-MVP)
- Updating non-input elements (buttons, cards, etc.) - already use explicit Tailwind classes
- Automated accessibility testing (manual testing sufficient for this change)
- Email notification styling (no email system in MVP)

## Constraints

1. **No Breaking Changes**: Existing functionality must remain unchanged
2. **Visual Consistency**: All inputs must look identical in styling
3. **Accessibility Compliance**: Must meet WCAG 2.1 Level AA contrast requirements (4.5:1 for normal text)
4. **Browser Compatibility**: Must work across all modern browsers (Chrome, Firefox, Safari, Edge)
5. **No New Dependencies**: Use existing Tailwind classes only

## Success Criteria

1. Dark mode media query removed from `app/globals.css`
2. All input fields have `text-gray-900` or darker text color
3. All input backgrounds are `bg-white` or `bg-gray-50`
4. All inputs have `border-gray-300` with proper focus states
5. Manual testing confirms readable input text across all forms (login, register, gig creation, messaging, profile editing)
6. No visual regressions on existing pages
7. Users with dark mode system preference see consistent light-theme UI
8. All existing tests continue to pass

## Dependencies

- Existing Tailwind CSS configuration
- Existing form components (login, register, gig creation, messaging, profile edit)
- No external dependencies required

## Risks & Mitigations

**Risk**: Users who prefer dark mode might be disappointed.
**Mitigation**: Current dark mode is broken and creates accessibility issues. Removing it provides a consistent, accessible experience. Proper dark mode can be implemented in a future change with full UI support. Document this decision in project documentation.

**Risk**: Some input fields might be missed in the audit.
**Mitigation**: Use systematic approach: grep for all `<input>` and `<textarea>` elements, verify each one has explicit text color. Test all forms manually.

**Risk**: Removing CSS variables might break other parts of the UI.
**Mitigation**: The CSS variables are only used in the body element. All other UI components use explicit Tailwind classes. Verify by searching codebase for `var(--foreground)` and `var(--background)` usage.

## Technical Decisions

### Decision 1: Remove vs. Fix Dark Mode

**Recommendation**: Remove dark mode CSS

**Rationale**:
- Current dark mode is incomplete and broken
- Fixing dark mode requires comprehensive UI redesign (20-40 hours)
- MVP does not require dark mode (not in scope per project.md)
- Removal provides immediate accessibility fix
- Proper dark mode can be added post-MVP with full design system

### Decision 2: Explicit Text Color vs. Inheritance

**Recommendation**: Add explicit `text-gray-900` to all inputs

**Rationale**:
- Explicit classes prevent inheritance issues
- Makes styling predictable and maintainable
- Follows Tailwind best practices (explicit over implicit)
- Prevents future CSS variable changes from affecting inputs

### Decision 3: Manual vs. Automated Testing

**Recommendation**: Manual testing for this change

**Rationale**:
- Small scope (5 forms, ~15 input fields)
- Visual verification required (contrast, readability)
- Automated accessibility testing not yet in place
- Manual testing sufficient for MVP
- Automated testing can be added in future testing iteration

---

**Document Status**: Proposal - Ready for Implementation
**Created**: 2026-02-22
**Estimated Effort**: 2-3 hours
**Priority**: HIGH - USER EXPERIENCE & ACCESSIBILITY
