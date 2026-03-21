# UI Specification Delta: Text Color Token Migration

This spec delta modifies the UI specification to enforce text-neutral token usage for all text colors.

## MODIFIED Requirements

### Requirement: Homepage

**Modified Scenario: Anonymous user visits homepage with token-based styling**
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN it MUST display the application name "Gigly"
- AND it MUST display a "Get Started" link to `/register`
- AND it MUST display a "Sign in" link to `/login`
- AND the page background MUST use `bg-surface-level-0`
- AND the "Get Started" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Sign in" link MUST use `text-blue-500 hover:text-blue-400`
- AND descriptive text MUST use `text-neutral-strong` for primary content
- AND secondary text MUST use `text-neutral-weak` for supporting information

**Changes:**
- Replace `text-gray-300` with `text-neutral-strong` for primary descriptive text
- Replace `text-gray-400` and `text-gray-500` with `text-neutral-weak` for secondary text

---

### Requirement: Registration Form with Role Selection

**Modified Scenario: Role selector renders with token-based styling**
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN it MUST display two selectable options: "Client" and "Specialist"
- AND no role MUST be pre-selected (user must actively choose)
- AND each role option MUST use `border border-gray-600 rounded-md`
- AND selected role MUST use `peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-blue-500`
- AND unselected roles MUST use `hover:bg-navy-700` on hover
- AND role descriptions MUST use `text-neutral-weak text-xs`

**Modified Scenario: Registration page link to login uses secondary styling**
- GIVEN a user views the registration page
- WHEN the login link renders
- THEN the link text MUST use `text-blue-500 hover:text-blue-400 font-medium`
- AND the surrounding text MUST use `text-neutral-strong text-sm`

**Changes:**
- Replace `text-gray-400` with `text-neutral-weak` for role descriptions
- Replace `text-gray-300` with `text-neutral-strong` for surrounding text

---

### Requirement: Login Page

**Modified Scenario: Login page link to registration uses secondary styling**
- GIVEN a user views the login page
- WHEN the registration link renders
- THEN the link text MUST use `text-blue-500 hover:text-blue-400 font-medium`
- AND the surrounding text MUST use `text-neutral-strong text-sm`

**Changes:**
- Replace `text-gray-300` with `text-neutral-strong` for surrounding text

---

### Requirement: Role-Based Dashboard

**Modified Scenario: Client visits dashboard**
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Client Dashboard" heading
- AND it MUST show a "Post a Gig" link to `/gigs/new`
- AND it MUST show a "My Gigs" section listing the user's gigs with title, budget (₽), status, and date
- AND each gig in "My Gigs" MUST be a clickable link to `/gigs/{gig.id}`
- AND IN_PROGRESS gigs MUST show the assigned specialist's email
- AND if no gigs exist, it MUST show "No gigs posted yet."
- AND it MUST display a "Sign out" button
- AND dashboard subtitle MUST use `text-neutral-strong` for primary text
- AND section descriptions MUST use `text-neutral-strong` for readability
- AND metadata (dates, counts) MUST use `text-neutral-weak` for visual hierarchy

**Modified Scenario: Specialist visits dashboard**
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Specialist Dashboard" heading
- AND it MUST show a "Browse Gigs" link to `/gigs`
- AND it MUST show a "My Profile" link to `/profile`
- AND it MUST display three tabs: "Active Work", "Pending Applications", "Archive"
- AND the "Active Work" tab MUST be selected by default
- AND it MUST display a "Sign out" button
- AND dashboard subtitle MUST use `text-neutral-strong` for primary text
- AND section descriptions MUST use `text-neutral-strong` for readability
- AND metadata (dates, counts) MUST use `text-neutral-weak` for visual hierarchy

**Changes:**
- Replace `text-gray-300` with `text-neutral-strong` for dashboard subtitles and descriptions
- Replace `text-gray-400` and `text-gray-500` with `text-neutral-weak` for metadata, timestamps, and secondary information
- Sidebar section headers (ФИНАНСЫ, СООБЩЕНИЯ) use `text-neutral-weak` for subtle hierarchy

---

### Requirement: Gig Creation Form

**Modified Scenario: Character count displays for acceptanceCriteria field**
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the acceptanceCriteria textarea
- THEN the form MUST display a real-time character count below the field
- AND the count MUST show format "X / 50 characters (minimum)"
- AND the count MUST be right-aligned
- AND when character count is below 50, the text MUST be red (text-red-600)
- AND when character count is 50 or above, the text MUST use `text-neutral-weak`
- AND when character count is 50-149 and user has interacted, a quality guidance warning MUST appear above the counter
- AND when character count is 150+, the quality guidance warning MUST NOT appear

**Modified Scenario: Character count displays for optional goal field**
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the goal textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST use `text-neutral-weak` when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

**Modified Scenario: Character count displays for optional deliverables field**
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the deliverables textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST use `text-neutral-weak` when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

**Modified Scenario: Character count displays for optional constraints field**
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the constraints textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST use `text-neutral-weak` when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

**Changes:**
- Replace `text-gray-600` with `text-neutral-weak` for character counters in normal state
- Keep `text-red-600` for validation errors (semantic color)
- Keep `text-orange-600` for warnings (semantic color)

---

### Requirement: Gig Detail Page

**Modified Scenario: Specialist views gig detail**
- GIVEN an authenticated SPECIALIST user
- WHEN they navigate to `/gigs/[id]` for an existing gig
- THEN the page MUST display: title, description, acceptance criteria, budget (₽), tags, status, and client email
- AND it MUST display an "Apply" form with a cover letter textarea and submit button
- AND if the specialist has already applied, the form MUST be replaced with "You have already applied" message
- AND all primary content (title, description) MUST use appropriate text hierarchy
- AND metadata (dates, status labels) MUST use `text-neutral-weak` for visual distinction

**Changes:**
- Replace `text-gray-300` with `text-neutral-strong` for primary gig content
- Replace `text-gray-400` and `text-gray-500` with `text-neutral-weak` for metadata and timestamps

---

### Requirement: Dashboard Profile Integration

**Modified Scenario: CLIENT dashboard shows profile completion hint**
- GIVEN a user with role "CLIENT" is logged in
- AND the user has incomplete profile (missing companyName or inn)
- WHEN they visit `/dashboard`
- THEN the page MUST display a notice to complete their profile
- AND the notice text MUST use `text-neutral-strong` for primary message
- AND helper text MUST use `text-neutral-weak` for supporting information

**Modified Scenario: SPECIALIST dashboard shows profile completion hint**
- GIVEN a user with role "SPECIALIST" is logged in
- AND the user has incomplete profile (missing techStack or experienceLevel)
- WHEN they visit `/dashboard`
- THEN the page MUST display a notice to complete their profile
- AND the notice text MUST use `text-neutral-strong` for primary message
- AND helper text MUST use `text-neutral-weak` for supporting information

**Changes:**
- Replace `text-gray-300` with `text-neutral-strong` for primary notice text
- Replace `text-gray-400` with `text-neutral-weak` for helper text

---

### Requirement: Message Display on Gig Detail Page

**Modified Scenario: CLIENT owner views gig with messages**
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig has an assigned specialist (assignedSpecialistId is not null)
- AND the gig has at least one message
- WHEN they navigate to `/gigs/[id]`
- THEN the page MUST display a "Messages" section
- AND messages MUST be displayed in chronological order (oldest first, ordered by createdAt ASC)
- AND each message MUST show:
  - Sender name (email or specialistProfile.displayName / clientProfile.companyName if available)
  - Message content (plain text)
  - Timestamp (formatted as locale date/time string)
- AND the page MUST display a message composition form below the message list
- AND sender names MUST use `text-neutral-weak` for subtle hierarchy
- AND message content MUST use `text-neutral-strong` for readability
- AND timestamps MUST use `text-neutral-weak` for metadata

**Changes:**
- Replace `text-gray-400` with `text-neutral-weak` for sender names and timestamps
- Replace `text-gray-300` with `text-neutral-strong` for message content

---

### Requirement: Notification Dropdown Content

**Modified Scenario: Dropdown shows list of gigs with unread messages**
- GIVEN an authenticated user with unread messages on 3 gigs
- WHEN they open the notification dropdown
- THEN the dropdown MUST display a list of 3 notification items
- AND each item MUST show gig title, sender name, and relative time
- AND gig titles MUST use `text-neutral-strong` for prominence
- AND sender names MUST use `text-neutral-weak` for hierarchy
- AND timestamps MUST use `text-neutral-weak` for metadata

**Changes:**
- Replace `text-gray-300` with `text-neutral-strong` for notification titles
- Replace `text-gray-400` and `text-gray-500` with `text-neutral-weak` for sender names and timestamps

---

## ADDED Requirements

### Requirement: Text Color Token Usage Guidelines

All UI components MUST use design token-based text colors for consistency with the automated design token system.

#### Scenario: Primary text uses text-neutral-strong token
- GIVEN any component renders primary text content (headings, body text, important labels)
- WHEN the text is displayed
- THEN the text MUST use `text-neutral-strong` token
- AND the text MUST NOT use manual gray classes (`text-gray-300`, `text-gray-400`, `text-gray-500`)
- AND the text MUST be readable on `bg-surface-level-0` backgrounds

#### Scenario: Secondary text uses text-neutral-weak token
- GIVEN any component renders secondary text content (metadata, timestamps, helper text, labels)
- WHEN the text is displayed
- THEN the text MUST use `text-neutral-weak` token
- AND the text MUST NOT use manual gray classes (`text-gray-300`, `text-gray-400`, `text-gray-500`)
- AND the text MUST be readable on `bg-surface-level-0`, `bg-surface-level-1`, and `bg-surface-level-2` backgrounds

#### Scenario: Text color tokens meet WCAG AA contrast standards
- GIVEN text is displayed on any background surface
- WHEN contrast ratio is calculated
- THEN `text-neutral-strong` on `bg-surface-level-0` MUST meet WCAG AA (≥ 4.5:1 for normal text)
- AND `text-neutral-weak` on `bg-surface-level-0` MUST meet WCAG AA (≥ 4.5:1 for normal text)
- AND `text-neutral-weak` on `bg-surface-level-1` MUST meet WCAG AA (≥ 4.5:1 for normal text)
- AND `text-neutral-weak` on `bg-surface-level-2` MUST meet WCAG AA (≥ 4.5:1 for normal text)

#### Scenario: Semantic colors remain unchanged
- GIVEN a component displays status, error, success, or warning text
- WHEN the text is displayed
- THEN semantic color tokens MUST be used (e.g., `text-error-500`, `text-success-400`, `text-warning-500`)
- AND semantic colors MUST NOT be replaced with neutral tokens
- AND `text-white` MAY be used for maximum contrast headings

**Acceptance Criteria:**
- All new components use `text-neutral-strong` or `text-neutral-weak` for non-semantic text
- Zero instances of `text-gray-300`, `text-gray-400`, or `text-gray-500` in component files
- All text meets WCAG AA contrast standards
- Semantic colors (`text-error-*`, `text-success-*`, `text-warning-*`) remain unchanged
- `text-white` remains available for maximum contrast use cases

---

## REMOVED Requirements

None. This change does not remove any existing requirements, only modifies them to use design tokens instead of manual color classes.
