# UI Specification Delta: Interactive States Token Migration

## ADDED Requirements

### Requirement: Focus Ring Offset Token Usage
All interactive elements with focus rings MUST use token-based focus ring offsets instead of hardcoded color values.

#### Scenario: Focus ring offset uses surface-level-0 token
- GIVEN an interactive element (button, link, input) has a focus ring
- WHEN the element receives keyboard focus
- THEN the focus ring offset MUST use `focus:ring-offset-surface-level-0` or equivalent token-based class
- AND the focus ring offset MUST NOT use hardcoded values like `focus:ring-offset-navy-900`
- AND the focus ring MUST be visible with at least 3:1 contrast ratio against the background

#### Scenario: Focus ring visible on all backgrounds
- GIVEN an interactive element is placed on any background surface (level-0, level-1, level-2)
- WHEN the element receives keyboard focus
- THEN the focus ring MUST be visible with sufficient contrast
- AND the focus ring offset MUST match the background surface level
- AND the focus ring color MUST provide adequate contrast (≥3:1 for UI components per WCAG AA)

#### Scenario: Primary action buttons use consistent focus styling
- GIVEN a primary action button (submit, save, post, etc.)
- WHEN the button receives keyboard focus
- THEN the button MUST use `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND the focus ring MUST be 2px wide
- AND the focus ring offset MUST be 2px
- AND the focus ring color MUST be blue-500

**Acceptance Criteria:**
- All buttons use `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All form inputs use token-based focus ring offsets
- All interactive links use token-based focus ring offsets where focus rings are present
- Focus rings visible on all background surfaces
- Focus rings meet WCAG AA contrast requirements (≥3:1)
- Zero instances of `focus:ring-offset-navy-900` in component files

---

### Requirement: Hover State Strategy Documentation
The UI specification MUST document a clear strategy for hover state styling to guide developers on when to use tokens vs. hardcoded values.

#### Scenario: Hover state strategy is documented
- GIVEN a developer is implementing a new interactive component
- WHEN they need to add hover state styling
- THEN the UI spec MUST provide clear guidance on:
  - When to use design tokens for hover states
  - When hardcoded fallback values are acceptable
  - Which tokens to use for common hover patterns
  - Examples of correct hover state implementation

#### Scenario: Token-first approach for hover states
- GIVEN an interactive element needs hover state styling
- WHEN appropriate design tokens exist for the hover state
- THEN the component MUST use design tokens (e.g., `hover:bg-surface-level-2` for cards)
- AND hardcoded values MUST NOT be used when tokens are available

#### Scenario: Hardcoded fallbacks for hover states without tokens
- GIVEN an interactive element needs hover state styling
- AND no appropriate design token exists for the desired hover effect
- WHEN the hover state is implemented
- THEN hardcoded values MAY be used as a pragmatic fallback (e.g., `hover:bg-navy-700` for subtle hover effects)
- AND the hardcoded value MUST be documented with a comment explaining why no token is used
- AND the hardcoded value SHOULD be consistent with the design system's color palette

**Acceptance Criteria:**
- UI spec includes "Hover State Strategy" section with clear guidelines
- Guidelines specify token-first approach
- Guidelines document acceptable hardcoded fallbacks
- Examples provided for common hover patterns
- Strategy balances design system consistency with pragmatic implementation

---

## MODIFIED Requirements

### Requirement: Registration Form with Role Selection
The registration form MUST provide visible feedback after submission and include a role selector using token-based styling consistent with Dashboard patterns.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in submit button styling
- All other requirements remain unchanged

#### Scenario: Registration form submit button uses token-based focus ring
- GIVEN a user views the registration form
- WHEN the submit button renders
- THEN the button MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND the button MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- Submit button uses `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

### Requirement: Login Page
The application MUST provide a login page at `/login` with email and password fields using token-based styling consistent with Dashboard form patterns.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in submit button styling
- All other requirements remain unchanged

#### Scenario: Login form submit button uses token-based focus ring
- GIVEN a user views the login form
- WHEN the submit button renders
- THEN the button MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND the button MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- Submit button uses `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

### Requirement: Homepage
The homepage at `/` MUST display the application name and adapt based on authentication state using token-based styling.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in all CTA buttons
- All other requirements remain unchanged

#### Scenario: Homepage CTA buttons use token-based focus rings
- GIVEN a user views the homepage
- WHEN CTA buttons render ("Get Started", "Go to Dashboard", "Sign out")
- THEN all buttons MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND buttons MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- All CTA buttons use `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

### Requirement: Gig Creation Form
The system MUST provide a form at `/gigs/new` for CLIENT users to create gigs.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in submit button styling
- All other requirements remain unchanged

#### Scenario: Gig creation submit button uses token-based focus ring
- GIVEN a CLIENT user views the gig creation form
- WHEN the submit button renders
- THEN the button MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND the button MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- Submit button uses `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

### Requirement: Gig Detail Page
The system MUST provide a page at `/gigs/[id]` showing full gig details.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in apply form submit button
- All other requirements remain unchanged

#### Scenario: Apply form submit button uses token-based focus ring
- GIVEN a SPECIALIST user views an OPEN gig detail page
- WHEN the apply form submit button renders
- THEN the button MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND the button MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- Apply form submit button uses `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

### Requirement: Profile View Page
The system MUST provide a profile view page at `/profile` showing the authenticated user's profile from their respective profile table.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in "Edit Profile" link
- All other requirements remain unchanged

#### Scenario: Edit profile link uses token-based focus ring
- GIVEN a user views their profile page
- WHEN the "Edit Profile" link renders
- THEN the link MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND the link MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- "Edit Profile" link uses `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

### Requirement: Profile Edit Page Layout Consistency
The profile edit page MUST match the visual layout and structure of the profile view page to provide a consistent user experience.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in save button
- All other requirements remain unchanged

#### Scenario: Save button uses token-based focus ring
- GIVEN a user views the profile edit page
- WHEN the save button renders
- THEN the button MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND the button MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- Save button uses `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

### Requirement: Role-Based Dashboard
The dashboard MUST render different content based on the user's role.

**Changes:**
- Updated focus ring offset from `focus:ring-offset-navy-900` to `focus:ring-offset-surface-level-0` in dashboard CTA buttons
- All other requirements remain unchanged

#### Scenario: Dashboard CTA buttons use token-based focus rings
- GIVEN a user views their dashboard
- WHEN CTA buttons render ("Post a Gig", "Browse Gigs", etc.)
- THEN all buttons MUST use `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0`
- AND buttons MUST NOT use `focus:ring-offset-navy-900`

**Acceptance Criteria:**
- All dashboard CTA buttons use `focus:ring-offset-surface-level-0` instead of `focus:ring-offset-navy-900`
- All other acceptance criteria from original requirement remain unchanged

---

## REMOVED Requirements

None. This change does not remove any existing requirements.
