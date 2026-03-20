# UI Spec Delta: Profile Pages Token Migration

## ADDED Requirements

### Requirement: CLIENT Profile View Token-Based Styling
The CLIENT profile view page MUST use design tokens to establish visual hierarchy and consistency with SPECIALIST profile view.

#### Scenario: CLIENT profile view uses token-based card hierarchy
- GIVEN an authenticated CLIENT user views `/profile`
- WHEN the page renders
- THEN the page background MUST use `bg-[var(--bg-surface-level-0)]`
- AND the header card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the company information card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the active projects card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND all cards MUST use `rounded-lg shadow-md` styling
- AND no hardcoded `bg-navy-800` or `border-gray-700` values MUST remain

#### Scenario: CLIENT profile view uses consistent spacing rhythm
- GIVEN an authenticated CLIENT user views `/profile`
- WHEN the page renders
- THEN the gap between header card and grid MUST use `mb-6` (24px)
- AND the 2-column grid MUST use `gap-6` (24px) between columns
- AND card padding MUST use `p-6` (24px)
- AND the spacing MUST match SPECIALIST profile view rhythm

#### Scenario: CLIENT profile view CTAs use prominent styling
- GIVEN an authenticated CLIENT user views `/profile`
- WHEN the page renders
- THEN the "Edit Profile" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Редактировать" links MUST use `text-blue-500 hover:text-blue-400`
- AND the "Создать заказ" link MUST use `text-blue-500 hover:text-blue-400`
- AND all buttons MUST include focus states: `focus:ring-2 focus:ring-blue-500`

#### Scenario: CLIENT profile view maintains existing functionality
- GIVEN an authenticated CLIENT user interacts with `/profile`
- WHEN they click on any link or button
- THEN all navigation MUST work identically to before migration
- AND the "Edit Profile" button MUST navigate to `/profile/edit`
- AND the "Редактировать" links MUST navigate to `/profile/edit`
- AND the "Создать заказ" link MUST navigate to `/gigs/new`
- AND profile data display MUST be unchanged

**Acceptance Criteria:**
- Page background uses `bg-[var(--bg-surface-level-0)]`
- All cards use `bg-surface-level-1 border border-neutral-weak`
- Card spacing uses `gap-6` (24px) and `mb-6` (24px)
- Card padding uses `p-6` (24px)
- Primary buttons use solid blue with hover and focus states
- Edit links use text blue styling
- All existing functionality preserved
- No hardcoded navy/gray colors remain

---

### Requirement: Profile Edit Page Layout Consistency
The profile edit page MUST match the visual layout and structure of the profile view page to provide a consistent user experience.

#### Scenario: Edit page uses same header card structure
- GIVEN an authenticated user navigates to `/profile/edit`
- WHEN the page renders
- THEN the page MUST display a header card at the top
- AND the header card MUST include:
  - Avatar circle with user initial (read-only, same as profile view)
  - User name or email
  - Role label (e.g., "Specialist" or "Client")
- AND the header card MUST use `bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md`

#### Scenario: Edit form uses 2-column grid layout (SPECIALIST)
- GIVEN an authenticated SPECIALIST user on `/profile/edit`
- WHEN the page renders below the header card
- THEN the form MUST use a 2-column grid layout: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- AND the left column MUST contain: Display Name, Tech Stack, Experience Level fields
- AND the right column MUST contain: Bio field (full height textarea)
- AND both columns MUST use card styling: `bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md`

#### Scenario: Edit form uses 2-column grid layout (CLIENT)
- GIVEN an authenticated CLIENT user on `/profile/edit`
- WHEN the page renders below the header card
- THEN the form MUST use a 2-column grid layout: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- AND the left column MUST contain: Company Name, INN, KPP fields
- AND the right column MUST contain: Contact Person, Phone Number fields
- AND both columns MUST use card styling: `bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md`

#### Scenario: Form fields use token-based styling
- GIVEN a user fills out the profile edit form
- WHEN form fields render
- THEN input fields MUST use `border-gray-600 focus:border-blue-500 focus:ring-blue-500`
- AND textarea fields MUST use same border and focus styling
- AND all fields MUST use `bg-navy-800 text-white` for dark theme consistency
- AND placeholder text MUST use `placeholder:text-gray-400`
- AND labels MUST use `text-gray-300` or `text-gray-400`

#### Scenario: Save and Cancel buttons use prominent styling
- GIVEN a user is on the profile edit page
- WHEN they view the form buttons
- THEN the Save button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the Save button MUST include focus states: `focus:ring-2 focus:ring-blue-500`
- AND the Cancel button MUST be a link to `/profile` with `text-gray-400 hover:text-gray-300`
- AND buttons MUST be positioned at the bottom of the form outside the grid columns

#### Scenario: Form maintains existing validation
- GIVEN a user fills out the profile edit form
- WHEN they submit the form
- THEN all existing validation rules MUST still apply
- AND required fields MUST still be enforced (companyName, inn for CLIENT)
- AND the `updateProfile` server action MUST remain unchanged
- AND error messages MUST display in the same manner
- AND form submission behavior MUST be identical

#### Scenario: Form pre-fills existing data
- GIVEN a user with existing profile data
- WHEN they navigate to `/profile/edit`
- THEN all form fields MUST be pre-filled with current values
- AND the pre-fill logic MUST work identically to before migration

#### Scenario: Responsive behavior on mobile
- GIVEN a user views the profile edit page on a mobile device (< 1024px width)
- WHEN the page renders
- THEN the 2-column grid MUST stack vertically (single column)
- AND the header card MUST remain at the top
- AND all form fields MUST remain fully functional
- AND the layout MUST match the profile view page's mobile behavior

**Acceptance Criteria:**
- Profile edit page uses `max-w-7xl mx-auto px-4` container
- Header card with avatar, name, role matches view page structure
- Form uses 2-column grid layout with proper responsive breakpoints
- Left and right columns wrapped in card containers with token-based styling
- All form fields use token-based borders and focus states
- Save button uses solid blue, Cancel uses text gray
- Save/Cancel buttons positioned below grid in full-width row
- Mobile layout stacks columns vertically
- No changes to `updateProfile` server action
- All existing form validation preserved
- All existing profile edit tests pass

---

### Requirement: Public Profile Page Token-Based Styling
The public profile page MUST use design tokens for consistent styling with authenticated profile views.

#### Scenario: Public SPECIALIST profile uses token-based styling
- GIVEN an authenticated user views `/profile/[userId]` for a SPECIALIST
- WHEN the page renders
- THEN the page background MUST use `bg-[var(--bg-surface-level-0)]` or `bg-navy-900`
- AND the profile card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND field labels MUST use `text-gray-300` or `text-gray-400`
- AND field values MUST use `text-white`
- AND the card MUST use `rounded-lg p-6 shadow-md` styling

#### Scenario: Public CLIENT profile uses token-based styling
- GIVEN an authenticated user views `/profile/[userId]` for a CLIENT
- WHEN the page renders
- THEN the page background MUST use `bg-[var(--bg-surface-level-0)]` or `bg-navy-900`
- AND the profile card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND field labels MUST use `text-gray-300` or `text-gray-400`
- AND field values MUST use `text-white`
- AND the card MUST use `rounded-lg p-6 shadow-md` styling

#### Scenario: Public profile hides sensitive information
- GIVEN an authenticated user views another user's public profile
- WHEN the page renders
- THEN sensitive fields MUST remain hidden (email, INN, KPP, phone for CLIENT)
- AND the hiding logic MUST work identically to before migration
- AND only public information MUST be displayed

#### Scenario: Public profile redirects own profile
- GIVEN an authenticated user navigates to their own public profile URL
- WHEN they access `/profile/[userId]` where userId matches their own
- THEN they MUST be redirected to `/profile`
- AND the redirect logic MUST work identically to before migration

**Acceptance Criteria:**
- Public profile pages use token-based backgrounds and card styling
- Profile cards use `bg-surface-level-1 border border-neutral-weak`
- Field labels and values use consistent text colors
- Sensitive information hiding logic preserved
- Own profile redirect logic preserved
- Error states (user not found, no profile) use token-based styling
- All existing public profile functionality preserved

---

### Requirement: Profile Pages Functionality Preservation
All profile page functionality MUST remain unchanged during token migration to ensure zero behavioral regressions.

#### Scenario: Profile view functionality unchanged
- GIVEN an authenticated user interacts with their profile view page
- WHEN they click on any link or button
- THEN all navigation MUST work identically to before migration
- AND profile data display MUST be unchanged
- AND profile completion hints on dashboard MUST still work
- AND stats calculations (for SPECIALIST) MUST work identically

#### Scenario: Profile edit functionality unchanged
- GIVEN a user edits their profile
- WHEN they fill out the form and submit
- THEN all validation MUST work identically
- AND form submission MUST work identically
- AND redirect after save MUST work correctly
- AND error handling MUST work identically
- AND profile update logic MUST be unchanged

#### Scenario: Public profile functionality unchanged
- GIVEN a user views a public profile
- WHEN they interact with the page
- THEN all data display MUST work identically
- AND sensitive information hiding MUST work identically
- AND redirect logic MUST work identically
- AND error handling MUST work identically

#### Scenario: Integration tests pass without modification
- GIVEN the token migration is complete
- WHEN profile-related test suites run
- THEN all existing profile tests MUST pass without modification
- AND no test selectors MUST be broken by styling changes
- AND no test assertions MUST fail due to visual changes

**Acceptance Criteria:**
- All profile view functionality works identically
- All profile edit functionality works identically
- All public profile functionality works identically
- All navigation works identically
- All form validation works identically
- All existing profile tests pass without modification
- No functional regressions introduced
- Profile completion logic preserved

---

## MODIFIED Requirements

None. This change only adds new styling requirements without modifying existing functional requirements.

---

## REMOVED Requirements

None. This change is purely additive and does not remove any existing requirements.
