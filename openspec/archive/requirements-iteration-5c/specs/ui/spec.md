# UI Specification Delta

## ADDED Requirements

### Requirement: Gig Creation Form Visual Sections
The gig creation form MUST organize fields into three visually distinct sections with clear headings and boundaries to improve form comprehension and reduce cognitive load.

#### Scenario: Form renders with three visual sections
- GIVEN an authenticated CLIENT user navigates to `/dashboard/gigs/new`
- WHEN the page loads
- THEN the form MUST display three visually distinct sections:
  1. "Basic Information" section
  2. "Requirements & Success Criteria" section
  3. "Budget & Details" section
- AND each section MUST have a visible boundary (border or background color)
- AND each section MUST have adequate padding and spacing

#### Scenario: Basic Information section structure
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Basic Information" section
- THEN the section MUST contain:
  - Heading: "Basic Information" (h3 or equivalent)
  - Description: "Provide a clear title and overview of the work"
  - Fields: title (text input), description (textarea)
- AND the section MUST be the first section in the form
- AND the section MUST have a light background color (e.g., bg-gray-50)
- AND the section MUST have a border (e.g., border-gray-200)

#### Scenario: Requirements & Success Criteria section structure
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Requirements & Success Criteria" section
- THEN the section MUST contain:
  - Heading: "Requirements & Success Criteria" (h3 or equivalent)
  - Description: "Define what success looks like and help specialists understand your needs"
  - Fields: acceptanceCriteria (textarea with character counter and quality warning), goal (optional textarea), deliverables (optional textarea), constraints (optional textarea)
- AND the section MUST be the second section in the form (after Basic Information)
- AND the section MUST have a light background color (e.g., bg-gray-50)
- AND the section MUST have a border (e.g., border-gray-200)
- AND all existing character counters and quality warnings MUST remain functional

#### Scenario: Budget & Details section structure
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Budget & Details" section
- THEN the section MUST contain:
  - Heading: "Budget & Details" (h3 or equivalent)
  - Description: "Set your budget and add tags to help specialists find your gig"
  - Fields: budget (number input), service fee preview (read-only display), tags (text input)
- AND the section MUST be the third section in the form (after Requirements & Success Criteria)
- AND the section MUST have a light background color (e.g., bg-gray-50)
- AND the section MUST have a border (e.g., border-gray-200)
- AND the live fee calculation preview MUST remain functional

#### Scenario: Section headings are semantically correct
- GIVEN a CLIENT user with a screen reader views the gig creation form
- WHEN they navigate through the form
- THEN each section heading MUST use proper heading tags (h3)
- AND headings MUST be in logical order (no skipped heading levels)
- AND headings MUST be announced by screen readers

#### Scenario: Sections are visually distinct but not overwhelming
- GIVEN a CLIENT user views the gig creation form
- WHEN they scan the form visually
- THEN section boundaries MUST be clear and easy to identify
- AND the visual styling MUST use subtle colors (gray-50 backgrounds, gray-200 borders)
- AND sections MUST have adequate spacing between them (e.g., mb-6 or space-y-6)
- AND the overall form MUST NOT feel cluttered or over-designed

#### Scenario: Form remains mobile responsive
- GIVEN a CLIENT user views the gig creation form on a mobile device (320px width)
- WHEN the page renders
- THEN all three sections MUST stack vertically
- AND section containers MUST NOT cause horizontal scrolling
- AND all fields MUST remain fully functional and accessible
- AND padding and spacing MUST scale appropriately for small screens

#### Scenario: Section descriptions provide helpful context
- GIVEN a CLIENT user is filling out the gig creation form
- WHEN they read the section descriptions
- THEN each description MUST clearly explain the purpose of that section
- AND descriptions MUST be concise (one sentence)
- AND descriptions MUST use plain language (no jargon)

#### Scenario: Field order within sections remains unchanged
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the fields within each section
- THEN the field order MUST match the current implementation:
  - Basic Information: title, description
  - Requirements & Success Criteria: acceptanceCriteria, goal, deliverables, constraints
  - Budget & Details: budget, tags
- AND no fields MUST be reordered or moved to different sections

#### Scenario: All existing form functionality remains intact
- GIVEN a CLIENT user interacts with the gig creation form
- WHEN they use any form feature (character counters, quality warnings, fee preview, validation)
- THEN all features MUST work exactly as before
- AND no functionality MUST be broken or degraded
- AND form submission behavior MUST remain unchanged

**Acceptance Criteria:**
- Form organized into three visual sections with clear boundaries
- Each section has heading (h3) and descriptive subtext
- Section styling uses Tailwind classes: bg-gray-50, border, border-gray-200, rounded-lg, p-6
- Sections separated with space-y-6 or mb-6 for vertical spacing
- All existing character counters, quality warnings, and fee preview remain functional
- Form remains fully responsive on mobile devices (320px and up)
- No changes to field validation, server actions, or form submission logic
- Semantic HTML structure maintained (proper heading hierarchy)
- Accessible to screen readers (headings announced, logical tab order)
- Submit button remains at the bottom of the form (outside sections)
