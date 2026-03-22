# UI Specification Delta: Loading Indicators

## ADDED Requirements

### Requirement: Form Loading States

All forms that submit data via server actions MUST display loading indicators during async operations to provide user feedback and prevent duplicate submissions.

#### Scenario: Form displays loading state during submission

**Given** a user has filled out a form with valid data
**When** the user clicks the submit button
**Then** the submit button MUST display loading text (e.g., "Saving...", "Submitting...", "Loading...")
**And** the submit button MUST be disabled
**And** the button MUST show reduced opacity (opacity-50) to indicate disabled state
**And** the cursor MUST change to not-allowed when hovering over the disabled button

**Acceptance Criteria:**
- Submit button uses `useFormStatus()` hook from 'react-dom'
- Button text changes from default to loading text when `pending` is true
- Button has `disabled={pending}` attribute
- Button styling includes `disabled:opacity-50` and `disabled:cursor-not-allowed`
- Loading text is contextual to the operation (e.g., "Saving profile...", "Posting gig...", "Submitting application...")
- Run E2E test: fill form, click submit, verify button shows loading text and is disabled

#### Scenario: Form prevents duplicate submissions

**Given** a user has submitted a form
**When** the user clicks the submit button multiple times rapidly
**Then** only one submission MUST occur
**And** subsequent clicks MUST be ignored while the first submission is pending
**And** the button MUST remain disabled until the submission completes

**Acceptance Criteria:**
- Button is disabled immediately when clicked
- Multiple rapid clicks do not trigger multiple server action calls
- Database contains only one record after multiple clicks
- Integration test verifies single submission with rapid clicks
- E2E test simulates slow network and verifies duplicate prevention

#### Scenario: Loading state clears after submission completes

**Given** a form is in loading state
**When** the server action completes (success or error)
**Then** the loading state MUST clear
**And** the button MUST return to enabled state (if form is still visible)
**And** the button text MUST return to default text (if form is still visible)
**And** if submission succeeded, the user MUST be redirected or see success feedback
**And** if submission failed, the user MUST see error message and can retry

**Acceptance Criteria:**
- Loading state clears on successful submission
- Loading state clears on failed submission
- Error messages are displayed if submission fails
- User can retry submission after error
- E2E test verifies loading state clears after completion

---

### Requirement: Profile Edit Form Loading States

The profile edit form MUST display loading indicators during profile updates for both CLIENT and SPECIALIST roles.

#### Scenario: Specialist profile edit shows loading state

**Given** a SPECIALIST user is on the profile edit page
**When** the user fills the profile form and clicks "Save Profile"
**Then** the button MUST display "Saving profile..."
**And** the button MUST be disabled
**And** the profile update server action MUST execute
**And** after completion, the user MUST be redirected to the profile view page

**Acceptance Criteria:**
- ProfileEditForm component uses `useFormStatus()` hook
- Submit button shows "Saving profile..." when pending
- Submit button is disabled when pending
- Integration test verifies loading state during profile update
- E2E test verifies loading indicator appears in browser

#### Scenario: Client profile edit shows loading state

**Given** a CLIENT user is on the profile edit page
**When** the user fills the profile form and clicks "Save Profile"
**Then** the button MUST display "Saving profile..."
**And** the button MUST be disabled
**And** the profile update server action MUST execute
**And** after completion, the user MUST be redirected to the profile view page

**Acceptance Criteria:**
- Same implementation as specialist profile edit
- Integration test verifies CLIENT profile update loading state
- E2E test verifies loading indicator for CLIENT role

---

### Requirement: Admin Moderation Form Loading States

All admin moderation forms MUST display loading indicators during moderation actions to prevent duplicate actions and provide feedback.

#### Scenario: Suspend user form shows loading state

**Given** an ADMIN user is viewing the user management page
**When** the admin clicks "Suspend" button for a user
**Then** the button MUST display "Suspending..."
**And** the button MUST be disabled
**And** the suspend user server action MUST execute
**And** after completion, the page MUST reload showing the updated user status

**Acceptance Criteria:**
- SuspendUserForm component uses `useFormStatus()` hook
- Button shows "Suspending..." when pending
- Button is disabled when pending
- Integration test verifies loading state during suspend action
- No duplicate suspend actions possible

#### Scenario: Unsuspend user form shows loading state

**Given** an ADMIN user is viewing the user management page
**When** the admin clicks "Unsuspend" button for a suspended user
**Then** the button MUST display "Unsuspending..."
**And** the button MUST be disabled
**And** the unsuspend user server action MUST execute
**And** after completion, the page MUST reload showing the updated user status

**Acceptance Criteria:**
- UnsuspendUserForm component uses `useFormStatus()` hook
- Button shows "Unsuspending..." when pending
- Button is disabled when pending
- Integration test verifies loading state during unsuspend action

#### Scenario: Close gig form shows loading state

**Given** an ADMIN user is viewing the gig management page
**When** the admin clicks "Close Gig" button for an open gig
**Then** the button MUST display "Closing..."
**And** the button MUST be disabled
**And** the close gig server action MUST execute
**And** after completion, the page MUST reload showing the updated gig status

**Acceptance Criteria:**
- CloseGigForm component uses `useFormStatus()` hook
- Button shows "Closing..." when pending
- Button is disabled when pending
- Integration test verifies loading state during close action

---

### Requirement: Consistent Loading UI Patterns

All loading indicators MUST follow consistent UI patterns for visual coherence and predictable user experience.

#### Scenario: Loading buttons use consistent styling

**Given** any form with a submit button
**When** the form is in loading state
**Then** the button MUST use consistent styling:
- Text changes to contextual loading message
- Button is disabled with `disabled={pending}`
- Opacity reduced to 50% with `disabled:opacity-50`
- Cursor changes to not-allowed with `disabled:cursor-not-allowed`
- Transition duration of 200ms for smooth state changes
- Design tokens used for colors (bg-blue-500, text-white, etc.)

**Acceptance Criteria:**
- All loading buttons use the same CSS classes for disabled state
- All loading buttons use design tokens for colors
- Visual review confirms consistent appearance across all forms
- Code review confirms no hardcoded colors or inconsistent patterns

#### Scenario: Loading text is contextual and clear

**Given** different types of forms (profile edit, gig creation, application submission, etc.)
**When** each form is in loading state
**Then** the loading text MUST be contextual to the operation:
- Profile edit: "Saving profile..."
- Gig creation: "Posting gig..." or "Creating gig..."
- Application submission: "Submitting application..."
- Work submission: "Submitting work..."
- Work approval: "Approving work..."
- Payment marking: "Marking as paid..."
- User suspension: "Suspending..."
- User unsuspension: "Unsuspending..."
- Gig closing: "Closing..."
- Message sending: "Sending..."

**Acceptance Criteria:**
- Each form has contextually appropriate loading text
- Loading text is concise (2-3 words + ellipsis)
- Loading text uses present continuous tense ("-ing" form)
- Code review confirms all loading text follows pattern

---

### Requirement: Page-Level Loading States with Suspense

Pages that fetch data asynchronously MUST use React Suspense boundaries to display loading states during data fetching.

#### Scenario: Gig detail page shows loading state

**Given** a user navigates to a gig detail page
**When** the page is fetching gig data from the database
**Then** a loading fallback MUST be displayed
**And** the loading fallback MUST show "Loading gig details..." or similar text
**And** after data loads, the full gig details MUST be displayed

**Acceptance Criteria:**
- Gig detail page wrapped in `<Suspense>` boundary
- Loading fallback displays during data fetch
- Loading fallback uses consistent styling (text-neutral-strong, padding)
- E2E test verifies loading fallback appears briefly on navigation

#### Scenario: Gig browse page shows loading state

**Given** a user navigates to the gig browse page
**When** the page is fetching gig list from the database
**Then** a loading fallback MUST be displayed
**And** the loading fallback MUST show "Loading gigs..." or similar text
**And** after data loads, the gig list MUST be displayed

**Acceptance Criteria:**
- Gig browse page wrapped in `<Suspense>` boundary
- Loading fallback displays during data fetch
- E2E test verifies loading fallback appears on navigation

#### Scenario: Dashboard pages show loading states

**Given** a user navigates to their dashboard
**When** the page is fetching user-specific data from the database
**Then** a loading fallback MUST be displayed
**And** after data loads, the dashboard content MUST be displayed

**Acceptance Criteria:**
- Dashboard pages wrapped in `<Suspense>` boundaries where async data is fetched
- Loading fallbacks use consistent text and styling
- E2E test verifies loading states on dashboard navigation

---

### Requirement: Loading States During Slow Network Conditions

Loading indicators MUST remain visible and functional during slow network conditions to provide continuous feedback to users.

#### Scenario: Loading indicator persists during slow network

**Given** a user has a slow network connection (simulated 2+ second delay)
**When** the user submits a form
**Then** the loading indicator MUST appear immediately
**And** the loading indicator MUST remain visible for the entire duration of the request
**And** the button MUST remain disabled for the entire duration
**And** after the request completes, the loading state MUST clear

**Acceptance Criteria:**
- E2E test simulates slow network using Playwright's `page.route()` API
- Loading indicator appears within 100ms of button click
- Loading indicator remains visible for full 2+ second delay
- Button remains disabled for full duration
- Test verifies loading state clears after completion

#### Scenario: Duplicate submissions prevented during slow network

**Given** a user has a slow network connection (simulated 2+ second delay)
**When** the user clicks the submit button multiple times rapidly
**Then** only one submission MUST occur
**And** the button MUST be disabled after the first click
**And** subsequent clicks MUST be ignored
**And** only one record MUST be created in the database

**Acceptance Criteria:**
- E2E test simulates slow network (2+ second delay)
- Test clicks submit button 3 times rapidly
- Button is disabled after first click
- Only one server action executes
- Database verification confirms single record created
- Test passes consistently across multiple runs

---

### Requirement: Shared LoadingButton Component

The platform SHOULD provide a shared LoadingButton component to standardize loading state implementation across all forms.

#### Scenario: LoadingButton component displays loading state

**Given** a form uses the LoadingButton component
**When** the form is submitted
**Then** the LoadingButton MUST display the loading text
**And** the button MUST be disabled
**And** the button MUST use the specified variant styling (primary, secondary, or danger)

**Acceptance Criteria:**
- LoadingButton component exists at `app/components/LoadingButton.tsx`
- Component accepts props: `loadingText`, `defaultText`, `variant`, `className`
- Component uses `useFormStatus()` hook internally
- Component supports variants: primary (blue), secondary (gray), danger (red)
- Unit test verifies component shows loading text when pending
- Unit test verifies component is disabled when pending

#### Scenario: Forms use LoadingButton for consistency

**Given** multiple forms across the platform
**When** forms are refactored to use LoadingButton
**Then** all forms MUST have consistent loading behavior
**And** all forms MUST have consistent loading styling
**And** code duplication MUST be reduced

**Acceptance Criteria:**
- At least 3 forms refactored to use LoadingButton component
- Code review confirms consistent usage pattern
- All refactored forms maintain existing functionality
- All existing tests pass after refactoring

---

## MODIFIED Requirements

### Requirement: Form Submit Buttons (existing requirement modified)

All form submit buttons MUST use the `useFormStatus()` hook to display loading states and prevent duplicate submissions.

**Changes:**
- ADDED: Requirement to use `useFormStatus()` hook
- ADDED: Requirement to display loading text during submission
- ADDED: Requirement to disable button during submission
- ADDED: Requirement to prevent duplicate submissions

**Migration:**
- Existing forms without loading states MUST be updated to include them
- Existing forms with custom loading state management SHOULD be refactored to use `useFormStatus()`
- No breaking changes to form functionality or validation

---

## REMOVED Requirements

None. This change adds new requirements without removing existing ones.
