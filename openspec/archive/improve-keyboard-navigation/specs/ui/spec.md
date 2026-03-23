# UI Specification Delta

## MODIFIED Requirements

### Requirement: All Interactive Elements MUST Have Visible Focus Indicators
All interactive elements (buttons, links, form inputs, custom components) MUST display a visible focus indicator when focused via keyboard navigation.

#### Scenario: Focus indicators use consistent design token styling
- GIVEN any focusable element in the application
- WHEN the element receives keyboard focus (via Tab key)
- THEN the element MUST display a focus ring using the `ring-2 ring-blue-500 ring-offset-2` Tailwind classes (or equivalent design token)
- AND the focus indicator MUST have at least 3:1 contrast ratio with adjacent colors
- AND the focus indicator MUST be visible on all background colors used in the application

#### Scenario: Custom interactive components have focus indicators
- GIVEN a custom interactive component (e.g., RoleCard, NotificationDropdown trigger, custom buttons)
- WHEN the component receives keyboard focus
- THEN the component MUST display the same focus indicator as standard HTML elements
- AND the component MUST use `tabIndex={0}` to make it keyboard-focusable if not using semantic HTML
- AND the component MUST handle Enter/Space key activation if using non-button elements

#### Scenario: Focus indicators are not removed by global CSS
- GIVEN the application's global CSS files
- WHEN the CSS is applied
- THEN there MUST NOT be any `outline: none` or `outline: 0` rules without replacement focus styles
- AND any custom focus styles MUST meet or exceed the visibility of default browser focus indicators

### Requirement: Modal Dialogs MUST Trap Focus and Support Keyboard Dismissal
Modal dialogs MUST trap focus within the modal and provide keyboard shortcuts for dismissal.

#### Scenario: Focus is trapped within open modals
- GIVEN a modal dialog is open (e.g., WelcomeModal)
- WHEN the user presses Tab repeatedly
- THEN focus MUST cycle through focusable elements within the modal only
- AND focus MUST NOT move to elements behind the modal backdrop
- AND pressing Tab on the last focusable element MUST move focus to the first element (wrap around)

#### Scenario: Esc key closes modal and returns focus
- GIVEN a modal dialog is open
- WHEN the user presses the Esc key
- THEN the modal MUST close
- AND focus MUST return to the element that triggered the modal (if still in DOM)
- AND if the trigger element is removed, focus MUST move to a logical fallback (e.g., main content)

### Requirement: Dropdown Menus MUST Support Keyboard Navigation
Dropdown menus (e.g., NotificationDropdown) MUST be fully keyboard-navigable.

#### Scenario: Dropdown opens and closes with keyboard
- GIVEN a dropdown trigger button (e.g., notification bell)
- WHEN the user presses Enter or Space on the trigger
- THEN the dropdown MUST open
- AND focus MUST move to the first interactive element in the dropdown
- WHEN the user presses Esc
- THEN the dropdown MUST close
- AND focus MUST return to the trigger button

#### Scenario: Arrow keys navigate dropdown items
- GIVEN a dropdown menu is open with multiple items
- WHEN the user presses the Down Arrow key
- THEN focus MUST move to the next item
- WHEN the user presses the Up Arrow key
- THEN focus MUST move to the previous item
- AND arrow key navigation MUST wrap around (last item → first item)

### Requirement: Search Inputs MUST Be Focusable via Keyboard Shortcut
Search inputs MUST support the / keyboard shortcut for quick access.

#### Scenario: Forward slash focuses search input on gig browse page
- GIVEN a user is on the gig browse page (`/dashboard/gigs`)
- AND the search input is visible
- WHEN the user presses the / key
- THEN focus MUST move to the search input
- AND the / character MUST NOT be inserted into the input
- AND the user MUST be able to immediately start typing their search query

#### Scenario: Forward slash shortcut does not activate in text inputs
- GIVEN a user is typing in a text input or textarea
- WHEN the user presses the / key
- THEN the / character MUST be inserted normally
- AND the search shortcut MUST NOT activate
- AND this applies to all text inputs (form fields, message inputs, etc.)

## ADDED Requirements

### Requirement: Skip to Main Content Link MUST Be Available
A "Skip to main content" link MUST be available as the first focusable element on each page for keyboard users.

#### Scenario: Skip link is first focusable element
- GIVEN a user navigates to any page in the application
- WHEN the user presses Tab for the first time
- THEN focus MUST move to a "Skip to main content" link
- AND the link MUST be visually hidden until focused
- AND when focused, the link MUST become visible

#### Scenario: Skip link moves focus to main content
- GIVEN the skip link is focused
- WHEN the user activates the link (Enter or Space)
- THEN focus MUST move to the main content area
- AND the main content area MUST have `id="main-content"` or similar
- AND the main content area MUST have `tabindex="-1"` to receive programmatic focus

### Requirement: Loading States MUST Maintain Focus Context
Loading states and async operations MUST preserve focus context for keyboard users.

#### Scenario: Focus remains on button during loading
- GIVEN a user activates a button that triggers an async operation (e.g., form submission)
- WHEN the operation is in progress
- THEN focus MUST remain on the button (or loading indicator)
- AND the button MUST be disabled to prevent duplicate submissions
- AND the disabled state MUST be visually indicated

#### Scenario: Focus moves to result after async operation completes
- GIVEN an async operation completes successfully (e.g., form submission)
- WHEN the page updates with new content or redirects
- THEN focus MUST move to a logical location (success message, new content, or main area)
- AND the focus target MUST be announced to screen readers (via aria-live or focus)
