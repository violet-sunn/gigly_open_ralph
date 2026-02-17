# UI Specification Delta

## MODIFIED Requirements

### Requirement: Gig Creation Form
The system MUST provide a form at `/dashboard/gigs/new` for CLIENT users to create gigs with real-time character count feedback.

#### Scenario: Character count displays for acceptanceCriteria field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the acceptanceCriteria textarea
- THEN the form MUST display a real-time character count below the field
- AND the count MUST show format "X / 50 characters (minimum)"
- AND the count MUST be right-aligned
- AND when character count is below 50, the text MUST be red (text-red-600)
- AND when character count is 50 or above, the text MUST be gray (text-gray-600)

#### Scenario: Character count displays for optional goal field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the goal textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST be gray (text-gray-600) when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

#### Scenario: Character count displays for optional deliverables field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the deliverables textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST be gray (text-gray-600) when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

#### Scenario: Character count displays for optional constraints field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the constraints textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST be gray (text-gray-600) when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

#### Scenario: Character count updates in real-time
- GIVEN a CLIENT user is typing in any textarea field
- WHEN they add or delete characters
- THEN the character count MUST update immediately without delay
- AND the count MUST reflect the current `.length` of the textarea value
- AND the color coding MUST update based on current count

#### Scenario: Character count is accessible
- GIVEN a CLIENT user with a screen reader is on the gig creation form
- WHEN they interact with a textarea field
- THEN the character count MUST be announced by the screen reader
- AND the count element MUST have `aria-live="polite"` attribute
- AND the count element MUST have descriptive `aria-label` or visible text

#### Scenario: Character count does not interfere with validation
- GIVEN a CLIENT user submits the form with acceptanceCriteria under 50 characters
- WHEN the form is submitted
- THEN the server-side validation MUST still reject the submission
- AND the character count display MUST NOT bypass or replace server validation
- AND the error message from server MUST still be displayed

#### Scenario: Character count layout is non-intrusive
- GIVEN a CLIENT user is viewing the gig creation form
- WHEN they see the character counts
- THEN each count MUST be positioned on the same line as the helper text
- AND each count MUST be right-aligned (text-right or ml-auto)
- AND each count MUST use small font size (text-sm)
- AND the counts MUST NOT push other form elements out of alignment

**Acceptance Criteria:**
- All four textarea fields (acceptanceCriteria, goal, deliverables, constraints) display character counts
- Character counts update in real-time via `onChange` handler
- acceptanceCriteria shows "X / 50 characters (minimum)" with red text when under 50
- Optional fields show "X / 1000 characters" with orange text when ≥900
- Character counts are right-aligned and use text-sm class
- Each count has `aria-live="polite"` for accessibility
- No performance degradation or input lag
- Existing form validation and submission logic unchanged
- Character count uses `.length` property (consistent with server-side validation after trimming)
