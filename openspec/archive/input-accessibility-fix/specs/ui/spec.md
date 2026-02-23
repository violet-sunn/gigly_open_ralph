# UI Spec Delta: input-accessibility-fix

This document describes changes to the UI specification for the input-accessibility-fix change.

## MODIFIED Requirements

### Requirement: Login Page

**Change**: Add explicit text color and background requirements for input fields to ensure accessibility.

#### Scenario: Login form input fields have accessible contrast
- GIVEN a user navigates to `/login`
- WHEN the page loads
- THEN all input fields (email, password) MUST have explicit text color `text-gray-900`
- AND all input fields MUST have explicit background color `bg-white`
- AND input text MUST be clearly visible and readable
- AND input fields MUST meet WCAG 2.1 Level AA contrast requirements (≥ 4.5:1)

**Acceptance Criteria:**
- Email input has `text-gray-900 bg-white` classes in addition to existing classes
- Password input has `text-gray-900 bg-white` classes in addition to existing classes
- Input text color is `#111827` (text-gray-900)
- Input background color is `#ffffff` (white)
- Contrast ratio between text and background is ≥ 4.5:1
- Inputs remain readable regardless of user's system color scheme preference

---

### Requirement: Registration Form with Role Selection

**Change**: Add explicit text color and background requirements for input fields to ensure accessibility.

#### Scenario: Registration form input fields have accessible contrast
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN all input fields (email, password) MUST have explicit text color `text-gray-900`
- AND all input fields MUST have explicit background color `bg-white`
- AND input text MUST be clearly visible and readable
- AND input fields MUST meet WCAG 2.1 Level AA contrast requirements (≥ 4.5:1)

**Acceptance Criteria:**
- Email input has `text-gray-900 bg-white` classes in addition to existing classes
- Password input has `text-gray-900 bg-white` classes in addition to existing classes
- Input text color is `#111827` (text-gray-900)
- Input background color is `#ffffff` (white)
- Contrast ratio between text and background is ≥ 4.5:1
- Inputs remain readable regardless of user's system color scheme preference
- Role radio buttons remain functional (no styling changes required)

---

### Requirement: Gig Creation Form

**Change**: Add explicit text color and background requirements for all input and textarea fields to ensure accessibility.

#### Scenario: Gig creation form fields have accessible contrast
- GIVEN an authenticated CLIENT user navigates to `/dashboard/gigs/new`
- WHEN the page loads
- THEN all input and textarea fields MUST have explicit text color `text-gray-900`
- AND all input and textarea fields MUST have explicit background color `bg-white`
- AND input text MUST be clearly visible and readable in all fields
- AND all fields MUST meet WCAG 2.1 Level AA contrast requirements (≥ 4.5:1)

**Acceptance Criteria:**
- Title input has `text-gray-900 bg-white` classes
- Description textarea has `text-gray-900 bg-white` classes
- Acceptance criteria textarea has `text-gray-900 bg-white` classes
- Goal textarea has `text-gray-900 bg-white` classes
- Deliverables textarea has `text-gray-900 bg-white` classes
- Constraints textarea has `text-gray-900 bg-white` classes
- Budget input has `text-gray-900 bg-white` classes
- Tags input has `text-gray-900 bg-white` classes
- All fields have text color `#111827` (text-gray-900)
- All fields have background color `#ffffff` (white)
- Contrast ratio between text and background is ≥ 4.5:1 for all fields
- Fields remain readable regardless of user's system color scheme preference
- All existing functionality (character counters, quality warnings, fee preview) remains unchanged

---

### Requirement: Message Composition Form

**Change**: Add explicit text color and background requirements for message textarea to ensure accessibility.

#### Scenario: Message form textarea has accessible contrast
- GIVEN an authenticated user who is the gig owner OR assigned specialist
- AND the gig has an assigned specialist
- WHEN they view the gig detail page with message form
- THEN the message textarea MUST have explicit text color `text-gray-900`
- AND the message textarea MUST have explicit background color `bg-white`
- AND input text MUST be clearly visible and readable
- AND the textarea MUST meet WCAG 2.1 Level AA contrast requirements (≥ 4.5:1)

**Acceptance Criteria:**
- Message textarea has `text-gray-900 bg-white` classes in addition to existing classes
- Textarea text color is `#111827` (text-gray-900)
- Textarea background color is `#ffffff` (white)
- Contrast ratio between text and background is ≥ 4.5:1
- Textarea remains readable regardless of user's system color scheme preference
- All existing message sending functionality remains unchanged

---

### Requirement: Profile Edit Page

**Change**: Add explicit text color and background requirements for all profile input fields to ensure accessibility.

#### Scenario: Profile edit form fields have accessible contrast
- GIVEN an authenticated user navigates to `/dashboard/profile/edit`
- WHEN the page loads
- THEN all input and textarea fields MUST have explicit text color `text-gray-900`
- AND all input and textarea fields MUST have explicit background color `bg-white`
- AND input text MUST be clearly visible and readable in all fields
- AND all fields MUST meet WCAG 2.1 Level AA contrast requirements (≥ 4.5:1)

**Acceptance Criteria:**
- All CLIENT profile fields (companyName, inn, kpp, contactPerson, phoneNumber) have `text-gray-900 bg-white` classes
- All SPECIALIST profile fields (displayName, techStack, experienceLevel, bio) have `text-gray-900 bg-white` classes
- All fields have text color `#111827` (text-gray-900)
- All fields have background color `#ffffff` (white)
- Contrast ratio between text and background is ≥ 4.5:1 for all fields
- Fields remain readable regardless of user's system color scheme preference
- All existing profile saving functionality remains unchanged

---

### Requirement: Profile View Page

**Change**: Add explicit text color requirements for all text elements to prevent inheritance from body element.

#### Scenario: Profile view page text has accessible contrast
- GIVEN an authenticated user navigates to `/dashboard/profile`
- WHEN the page loads
- THEN all text elements (headings, labels, profile data) MUST have explicit text color
- AND headings MUST have `text-gray-900` class
- AND profile data paragraphs MUST have `text-gray-900` class
- AND all text MUST be clearly visible and readable
- AND text MUST NOT inherit light color from body element when dark mode CSS is active

**Acceptance Criteria:**
- Page heading (`<h1>`) has explicit `text-gray-900` class
- All profile data `<p>` tags have explicit `text-gray-900` class
- Field labels maintain existing `text-gray-700` class (already correct)
- Container backgrounds have explicit `bg-white` or appropriate color
- "Not set" placeholders are visible with proper contrast
- Page displays correctly regardless of user's system color scheme preference
- Both CLIENT and SPECIALIST profile views work correctly
- Profile completion hints remain visible with proper styling

---

### Requirement: Public Profile View Page

**Change**: Add explicit text color requirements for all text elements to prevent inheritance from body element.

#### Scenario: Public profile page text has accessible contrast
- GIVEN an authenticated user navigates to `/dashboard/profile/[userId]`
- WHEN the page loads
- THEN all text elements (headings, labels, profile data) MUST have explicit text color
- AND headings MUST have `text-gray-900` class
- AND profile data paragraphs MUST have `text-gray-900` class
- AND all text MUST be clearly visible and readable
- AND text MUST NOT inherit light color from body element when dark mode CSS is active

**Acceptance Criteria:**
- Page heading (`<h1>`) has explicit `text-gray-900` class
- All profile data `<p>` tags have explicit `text-gray-900` class
- Field labels maintain existing `text-gray-700` class (already correct)
- Container backgrounds have explicit `bg-white` or appropriate color
- "Not specified" placeholders are visible with proper contrast
- Page displays correctly regardless of user's system color scheme preference
- Both CLIENT and SPECIALIST public profile views work correctly
- "User not found" and "Profile not available" messages remain visible

---

## ADDED Requirements

### Requirement: Global CSS Accessibility

**New Requirement**: The application MUST NOT use system color scheme preferences that conflict with UI component styling.

#### Scenario: Application displays consistent light theme
- GIVEN a user has dark mode enabled in their operating system
- WHEN they access any page in the application
- THEN the application MUST display a consistent light theme
- AND the application MUST NOT apply dark mode CSS variables
- AND all text MUST remain readable with proper contrast

#### Scenario: CSS variables do not override component styling
- GIVEN the application uses CSS variables for body styling
- WHEN UI components use explicit Tailwind classes
- THEN component styling MUST NOT be overridden by CSS variables
- AND input fields MUST have explicit text colors that do not inherit from body

**Acceptance Criteria:**
- `app/globals.css` does NOT contain `@media (prefers-color-scheme: dark)` block
- Body element uses light theme CSS variables only
- All input fields have explicit `text-gray-900` class (do not inherit from body)
- Application displays consistent light theme regardless of system preference
- No dark mode CSS applied anywhere in the application

---

## REMOVED Requirements

None. This change does not remove any existing requirements.

---

## Implementation Notes

### Files Modified
1. `app/globals.css` - Remove dark mode media query
2. `app/login/page.tsx` - Add explicit text color to inputs
3. `app/register/page.tsx` - Add explicit text color to inputs
4. `app/dashboard/gigs/new/gig-form.tsx` - Add explicit text color to all inputs/textareas
5. `app/dashboard/gigs/[id]/message-form.tsx` - Add explicit text color to textarea
6. `app/dashboard/profile/edit/page.tsx` - Add explicit text color to all inputs/textareas

### Styling Pattern
All input and textarea elements should follow this pattern:
```tsx
className="... text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ..."
```

Key classes:
- `text-gray-900` - Dark text color (#111827)
- `bg-white` - White background (#ffffff)
- `border-gray-300` - Light gray border
- `focus:ring-blue-500` - Blue focus ring
- `focus:border-blue-500` - Blue focus border

### Testing Approach
1. Manual testing with light mode system preference
2. Manual testing with dark mode system preference
3. Visual verification of text readability in all forms
4. Contrast ratio verification using browser DevTools
5. Cross-browser testing (Chrome, Firefox, Safari, Edge)
6. Existing test suite verification (unit + E2E tests)

### Backward Compatibility
This change is fully backward compatible:
- No functionality changes
- No API changes
- No database changes
- Only CSS styling changes
- All existing tests should pass without modification

### Future Considerations
If proper dark mode support is added in the future:
- Implement comprehensive dark mode design system
- Add dark mode variants to all UI components
- Use Tailwind's `dark:` prefix for dark mode styles
- Test dark mode across entire application
- Update this spec to include dark mode requirements
