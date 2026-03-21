# UI Specification Delta

## ADDED Requirements

### Requirement: Form Input Token-Based Styling
All form inputs across the application MUST use design tokens for backgrounds, borders, and placeholder text to ensure visual consistency and maintainability.

#### Scenario: Form inputs use token-based background color
- GIVEN any form input (text, textarea, select) renders on any page
- WHEN the input is displayed
- THEN the input background MUST use `bg-surface-level-1` design token
- AND the input MUST NOT use hardcoded color values like `bg-navy-800`
- AND the background MUST provide proper contrast with text content

#### Scenario: Form inputs use token-based border color
- GIVEN any form input renders on any page
- WHEN the input is displayed in default state (not focused)
- THEN the input border MUST use `border-neutral-weak` design token
- AND the input MUST NOT use hardcoded values like `border-gray-600` or `border-gray-700`
- AND the border MUST be subtle but visible for input boundaries

#### Scenario: Form inputs use token-based placeholder text
- GIVEN any form input with placeholder text
- WHEN the input is empty and displays placeholder
- THEN the placeholder text MUST use `placeholder:text-neutral-weak` design token
- AND the placeholder MUST NOT use hardcoded values like `placeholder:text-gray-400`
- AND the placeholder MUST be readable but visually secondary to actual input text

#### Scenario: Focus states remain unchanged
- GIVEN any form input receives focus
- WHEN the user clicks or tabs into the input
- THEN the focus ring MUST continue to use `focus:ring-blue-500` (semantic color)
- AND the focus border MUST continue to use `focus:border-blue-500` (semantic color)
- AND focus states MUST NOT be changed to neutral tokens

#### Scenario: Authentication forms use consistent input styling
- GIVEN a user views the login page at `/login` or registration page at `/register`
- WHEN form inputs render (email, password, role selector)
- THEN all inputs MUST use `bg-surface-level-1 border border-neutral-weak`
- AND all placeholder text MUST use `placeholder:text-neutral-weak`
- AND all inputs MUST have identical visual appearance

#### Scenario: Gig forms use consistent input styling
- GIVEN a user views any gig-related form (create, apply, message, work submission)
- WHEN form inputs render (text inputs, textareas)
- THEN all inputs MUST use `bg-surface-level-1 border border-neutral-weak`
- AND all placeholder text MUST use `placeholder:text-neutral-weak`
- AND all inputs MUST have identical visual appearance across all gig forms

#### Scenario: Admin forms use consistent input styling
- GIVEN an admin user views admin forms (user filters, gig filters, moderation forms)
- WHEN form inputs render
- THEN all inputs MUST use `bg-surface-level-1 border border-neutral-weak`
- AND all placeholder text MUST use `placeholder:text-neutral-weak`
- AND all inputs MUST have identical visual appearance

#### Scenario: Profile edit form uses consistent input styling
- GIVEN a user views the profile edit page at `/profile/edit`
- WHEN form inputs render (display name, tech stack, bio, company name, etc.)
- THEN all inputs MUST use `bg-surface-level-1 border border-neutral-weak`
- AND all placeholder text MUST use `placeholder:text-neutral-weak`
- AND all inputs MUST have identical visual appearance

#### Scenario: Form functionality remains unchanged
- GIVEN any form input is migrated to token-based styling
- WHEN a user interacts with the input (typing, submitting, validation)
- THEN all form validation MUST work identically to before migration
- AND all form submission logic MUST work identically
- AND all accessibility attributes MUST be preserved (aria-labels, required, etc.)
- AND all keyboard navigation MUST work identically
- AND all error states MUST display correctly

#### Scenario: Integration tests pass without modification
- GIVEN the token migration is complete for all form inputs
- WHEN integration test suites run
- THEN all existing form-related tests MUST pass without modification
- AND no test selectors MUST be broken by styling changes
- AND no new test failures MUST be introduced

**Acceptance Criteria:**
- All form inputs use `bg-surface-level-1` instead of `bg-navy-800` (11 files updated)
- All form input borders use `border-neutral-weak` instead of `border-gray-600` or `border-gray-700` (14 files updated)
- All placeholder text uses `placeholder:text-neutral-weak` instead of `placeholder:text-gray-400` (9 files updated)
- Focus states preserved with `focus:ring-blue-500` and `focus:border-blue-500`
- All form validation, submission, and accessibility features work identically
- All existing integration tests pass without modification
- Visual consistency achieved across all forms (auth, gig, admin, profile)
- Zero functional regressions introduced
- WCAG AA contrast ratios maintained for all text/background combinations

---

## MODIFIED Requirements

None. This change adds new styling requirements without modifying existing functional requirements.

---

## REMOVED Requirements

None. This change does not remove any existing requirements.
