# UI Specification Changes

## ADDED Requirements

### Requirement: Acceptance Criteria Quality Guidance Warning
The gig creation form MUST display a soft validation warning when acceptance criteria is above the hard minimum but below a quality threshold, encouraging users to add more detail without blocking submission.

#### Scenario: Warning appears for brief acceptance criteria
- GIVEN a CLIENT user is on the gig creation form at `/dashboard/gigs/new`
- AND they have typed between 50-149 characters in the acceptanceCriteria textarea
- AND they have interacted with the field (onChange event has fired at least once)
- WHEN the character count is calculated
- THEN a quality guidance warning MUST be displayed below the textarea
- AND the warning MUST show the message: "💡 Consider adding more detail to prevent disputes. What specific deliverables, quality standards, or success metrics define 'done'?"
- AND the warning MUST be styled with amber/yellow colors (bg-amber-50, border-amber-300, text-amber-800)
- AND the warning MUST include a lightbulb emoji (💡) at the start
- AND the warning MUST be positioned between the textarea and the character counter

#### Scenario: Warning disappears when quality threshold is reached
- GIVEN a CLIENT user sees the quality guidance warning
- AND they continue typing in the acceptanceCriteria textarea
- WHEN the character count reaches 150 or more
- THEN the warning MUST disappear immediately
- AND the character counter MUST remain visible
- AND no error message MUST be displayed

#### Scenario: Warning does not appear on page load
- GIVEN a CLIENT user navigates to `/dashboard/gigs/new`
- WHEN the page loads with an empty acceptanceCriteria field
- THEN the quality guidance warning MUST NOT be displayed
- AND the warning MUST only appear after the user starts typing (onChange event)

#### Scenario: Warning does not appear below hard minimum
- GIVEN a CLIENT user has typed fewer than 50 characters in acceptanceCriteria
- WHEN the character count is calculated
- THEN the quality guidance warning MUST NOT be displayed
- AND the hard validation error (red character counter) MUST be displayed instead
- AND only one message MUST be visible at a time (no double-messaging)

#### Scenario: Warning does not block form submission
- GIVEN a CLIENT user sees the quality guidance warning
- AND the acceptanceCriteria field has between 50-149 characters
- WHEN they click the "Post Gig" submit button
- THEN the form MUST submit normally
- AND the server action MUST accept the submission (no new validation errors)
- AND the gig MUST be created successfully

#### Scenario: Warning is accessible to screen readers
- GIVEN a CLIENT user with a screen reader is on the gig creation form
- WHEN the quality guidance warning appears or disappears
- THEN the warning element MUST have `aria-live="polite"` attribute
- AND the warning text MUST be announced by the screen reader
- AND the announcement MUST not interrupt the user's current action

#### Scenario: Warning has smooth visual transition
- GIVEN a CLIENT user is typing in the acceptanceCriteria field
- WHEN the character count crosses the 150-character threshold (in either direction)
- THEN the warning MUST fade in or out smoothly
- AND the transition MUST not cause layout shift or jank
- AND the transition duration MUST be 200-300ms

#### Scenario: Warning styling is visually distinct but not alarming
- GIVEN the quality guidance warning is displayed
- WHEN a CLIENT user views the form
- THEN the warning MUST use amber/yellow color scheme (not red)
- AND the warning MUST have a light background (bg-amber-50)
- AND the warning MUST have a visible border (border-amber-300)
- AND the warning text MUST be dark amber (text-amber-800)
- AND the warning MUST include rounded corners and padding for visual comfort
- AND the warning MUST NOT use error icons (no ⚠️ or ❌)

#### Scenario: Warning does not interfere with existing character counter
- GIVEN the quality guidance warning is displayed
- WHEN a CLIENT user views the acceptanceCriteria field
- THEN both the warning and the character counter MUST be visible
- AND the character counter MUST remain in its original position (right-aligned below field)
- AND the warning MUST be positioned above the character counter
- AND the warning MUST NOT overlap or obscure the character counter

#### Scenario: Warning message provides actionable guidance
- GIVEN the quality guidance warning is displayed
- WHEN a CLIENT user reads the message
- THEN the message MUST include specific examples of what to add
- AND the message MUST mention "deliverables, quality standards, or success metrics"
- AND the message MUST explain the benefit ("prevent disputes")
- AND the message MUST use encouraging language ("Consider" not "You must")
- AND the message MUST be phrased as a question to invite reflection

#### Scenario: Warning state persists during form interaction
- GIVEN a CLIENT user sees the quality guidance warning
- WHEN they interact with other form fields (budget, title, etc.)
- AND they return to the acceptanceCriteria field
- THEN the warning state MUST be preserved based on current character count
- AND the warning MUST NOT reset or flicker when focus changes

#### Scenario: Warning works correctly with copy-paste
- GIVEN a CLIENT user pastes text into the acceptanceCriteria field
- WHEN the pasted text results in 50-149 characters
- THEN the quality guidance warning MUST appear immediately
- AND when the pasted text results in 150+ characters
- THEN the warning MUST NOT appear

**Acceptance Criteria:**
- New client component `AcceptanceCriteriaQualityWarning` created
- Component accepts props: `characterCount: number`, `hasInteracted: boolean`
- Component renders conditionally: `characterCount >= 50 && characterCount < 150 && hasInteracted`
- Warning styled with Tailwind classes: `bg-amber-50 border border-amber-300 text-amber-800 rounded-md p-3 mb-2`
- Warning includes `aria-live="polite"` for accessibility
- Warning includes lightbulb emoji and specific guidance text
- Warning positioned between textarea and character counter in form layout
- Smooth fade transition using Tailwind transition classes
- No changes to server-side validation logic
- No changes to form submission behavior
- Existing character counter remains functional and visible
- All existing gig creation form functionality unchanged

## MODIFIED Requirements

### Requirement: Gig Creation Form
**Change**: Add quality guidance warning component to acceptanceCriteria field section.

**Modified Scenario**: Character count displays for acceptanceCriteria field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the acceptanceCriteria textarea
- THEN the form MUST display a real-time character count below the field
- AND the count MUST show format "X / 50 characters (minimum)"
- AND the count MUST be right-aligned
- AND when character count is below 50, the text MUST be red (text-red-600)
- AND when character count is 50 or above, the text MUST be gray (text-gray-600)
- **AND when character count is 50-149 and user has interacted, a quality guidance warning MUST appear above the counter**
- **AND when character count is 150+, the quality guidance warning MUST NOT appear**

**Acceptance Criteria Updates:**
- Acceptance criteria field section now includes quality guidance warning component
- Warning component receives `characterCount` and `hasInteracted` state from parent form
- Form tracks `hasInteracted` state for acceptanceCriteria field (set to true on first onChange)
- Warning positioned between textarea and character counter
- All existing acceptance criteria validation unchanged (minimum 50 chars enforced server-side)
- Form submission logic unchanged (warning does not block submission)

## REMOVED Requirements

None.
