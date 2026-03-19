# UI Spec Delta: ui-core-components

This document describes changes to the UI specification for design token usage in core components.

---

## ADDED Requirements

### Requirement: Button Components MUST Use Design Tokens

All button components in the application MUST use design token-based Tailwind classes instead of hardcoded color values.

#### Scenario: Primary action button uses brand tokens
- GIVEN a primary action button (e.g., "Sign in", "Post Gig", "Submit Application")
- WHEN the button is rendered
- THEN it MUST use `bg-brand-primary` for background color
- AND it MUST use `hover:bg-brand-primary-hover` for hover state
- AND it MUST use `text-white` or appropriate text token for text color
- AND it MUST use `focus:ring-brand-primary` for focus ring
- AND it MUST preserve all other classes (padding, rounded, disabled, transition)
- AND it MUST preserve semantic HTML (`<button>` tag)
- AND it MUST preserve all text content and ARIA attributes

#### Scenario: Success action button uses success tokens
- GIVEN a success/positive action button (e.g., "Accept", "Approve", "Mark as Paid")
- WHEN the button is rendered
- THEN it MUST use `bg-success-500` for background color
- AND it MUST use `hover:bg-success-600` for hover state
- AND it MUST use `text-white` for text color
- AND it MUST use `focus:ring-success-500` for focus ring
- AND it MUST preserve all other classes (padding, rounded, disabled, transition)

#### Scenario: Danger/destructive action button uses error tokens
- GIVEN a danger/destructive action button (e.g., "Reject", "Delete", "Withdraw")
- WHEN the button is rendered
- THEN it MUST use `bg-error-500` or `bg-error-600` for background color
- AND it MUST use `hover:bg-error-600` or `hover:bg-error-700` for hover state
- AND it MUST use `text-white` for text color
- AND it MUST use `focus:ring-error-500` for focus ring
- AND it MUST preserve all other classes (padding, rounded, disabled, transition)

#### Scenario: Button disabled state preserves functionality
- GIVEN any button component with design tokens
- WHEN the button is in disabled state
- THEN it MUST use `disabled:opacity-50 disabled:cursor-not-allowed` classes
- AND it MUST NOT be clickable
- AND it MUST maintain visual consistency with original implementation

**Acceptance Criteria:**
- All button components use design token classes for colors
- No hardcoded color classes (bg-blue-500, bg-green-500, bg-red-500) in button components
- All button interactions work identically to original implementation
- All integration tests pass without modification
- All E2E tests pass without modification
- Visual appearance is pixel-perfect match to original
- Accessibility unchanged (focus rings, keyboard navigation, ARIA attributes)

---

### Requirement: Input and Textarea Components MUST Use Design Tokens

All input and textarea components in the application MUST use design token-based Tailwind classes instead of hardcoded color values.

#### Scenario: Text input uses surface and neutral tokens
- GIVEN a text input field (e.g., email, password, title, budget)
- WHEN the input is rendered
- THEN it MUST use `bg-surface-level-1` or `bg-navy-800` for background color
- AND it MUST use `border-neutral-weak` or `border-gray-600` for border color
- AND it MUST use `text-neutral-strong` or `text-white` for text color
- AND it MUST use `placeholder:text-neutral-subtle` or `placeholder:text-gray-400` for placeholder
- AND it MUST use `focus:border-brand-primary` for focus border
- AND it MUST use `focus:ring-brand-primary` for focus ring
- AND it MUST preserve all other classes (padding, rounded, w-full)
- AND it MUST preserve semantic HTML (`<input>` tag)
- AND it MUST preserve all attributes (type, name, required, placeholder, maxLength)

#### Scenario: Textarea uses surface and neutral tokens
- GIVEN a textarea field (e.g., description, acceptance criteria, approach)
- WHEN the textarea is rendered
- THEN it MUST use `bg-surface-level-1` or `bg-navy-800` for background color
- AND it MUST use `border-neutral-weak` or `border-gray-600` for border color
- AND it MUST use `text-neutral-strong` or `text-white` for text color
- AND it MUST use `placeholder:text-neutral-subtle` or `placeholder:text-gray-400` for placeholder
- AND it MUST use `focus:border-brand-primary` for focus border
- AND it MUST use `focus:ring-brand-primary` for focus ring
- AND it MUST preserve all other classes (padding, rounded, w-full, rows)
- AND it MUST preserve semantic HTML (`<textarea>` tag)
- AND it MUST preserve all attributes (name, required, placeholder, maxLength, rows)

#### Scenario: Input error state uses error tokens
- GIVEN an input or textarea with validation error
- WHEN the error state is rendered
- THEN it MUST use `border-error-500` for border color
- AND it MUST use `focus:border-error-500` for focus border
- AND it MUST use `focus:ring-error-500` for focus ring
- AND error message text MUST use `text-error-500` class
- AND it MUST preserve all validation functionality

#### Scenario: Input preserves all labels and helper text
- GIVEN any input or textarea component
- WHEN the component is rendered
- THEN all label text MUST remain unchanged
- AND all placeholder text MUST remain unchanged
- AND all helper text MUST remain unchanged
- AND all character counters MUST remain functional
- AND all validation messages MUST remain unchanged

**Acceptance Criteria:**
- All input/textarea components use design token classes for colors
- No hardcoded color classes (bg-navy-800, border-gray-600, text-white) in input components
- All form validation works identically to original implementation
- All integration tests pass without modification
- All E2E tests pass without modification
- Visual appearance is pixel-perfect match to original
- Placeholder text remains visible and readable
- Error states display correctly
- Character counters remain functional

---

### Requirement: Link Components MUST Use Design Tokens

All link components in the application MUST use design token-based Tailwind classes instead of hardcoded color values.

#### Scenario: Standard link uses brand tokens
- GIVEN a standard navigation or action link (e.g., "Sign up", "Sign in", "Browse Gigs")
- WHEN the link is rendered
- THEN it MUST use `text-brand-primary` for text color
- AND it MUST use `hover:text-brand-primary-hover` for hover state
- AND it MUST preserve all other classes (font-*, underline, transition)
- AND it MUST preserve semantic HTML (`<a>` or `<Link>` tag)
- AND it MUST preserve all attributes (href, target, rel)
- AND it MUST preserve all text content

#### Scenario: Secondary link uses appropriate tokens
- GIVEN a secondary or subtle link (e.g., "Back to Dashboard", helper links)
- WHEN the link is rendered
- THEN it MUST use `text-brand-secondary` or `text-neutral-strong` for text color
- AND it MUST use appropriate hover token for hover state
- AND it MUST preserve all other classes (font-*, underline, transition)

#### Scenario: Link focus state uses brand tokens
- GIVEN any link component
- WHEN the link receives keyboard focus
- THEN it MUST use `focus:ring-brand-primary` for focus ring
- AND it MUST use `focus:ring-offset-2` for ring offset
- AND it MUST be clearly visible for keyboard navigation
- AND it MUST preserve all accessibility attributes

#### Scenario: Link preserves navigation functionality
- GIVEN any link component with design tokens
- WHEN the link is clicked
- THEN navigation MUST work identically to original implementation
- AND external links MUST open in new tab (where applicable)
- AND internal links MUST use Next.js Link component (where applicable)

**Acceptance Criteria:**
- All link components use design token classes for colors
- No hardcoded color classes (text-blue-500, text-blue-600, hover:text-blue-400) in link components
- All navigation works identically to original implementation
- All E2E tests pass without modification
- Visual appearance is pixel-perfect match to original
- Hover states work correctly
- Accessibility unchanged (focus rings, keyboard navigation)

---

## MODIFIED Requirements

### Requirement: Design Token System (Modified)

**Previous:** Design tokens SHOULD be used for new components.

**Updated:** Design tokens MUST be used for all core UI components (buttons, inputs, textareas, links). New components MUST use design tokens. Existing components SHOULD be migrated to design tokens incrementally.

#### Scenario: New component uses design tokens
- GIVEN a developer is creating a new UI component
- WHEN the component includes buttons, inputs, textareas, or links
- THEN the component MUST use design token-based Tailwind classes
- AND the component MUST NOT use hardcoded color values
- AND the component MUST follow patterns established in this change

#### Scenario: Existing component migration
- GIVEN an existing component with hardcoded color values
- WHEN the component is being updated or refactored
- THEN the developer SHOULD migrate to design token classes
- AND the migration MUST preserve all functionality
- AND the migration MUST pass all existing tests

**Acceptance Criteria:**
- Design token usage is enforced for core components
- Documentation updated to reflect MUST requirement
- Migration patterns documented for future reference
- All new components follow design token patterns

---

## REMOVED Requirements

None. This change adds requirements without removing existing ones.
