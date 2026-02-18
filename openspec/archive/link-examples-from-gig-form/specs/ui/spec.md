# UI Specification Delta

## MODIFIED Requirements

### Requirement: Gig Creation Form Visual Sections
The gig creation form MUST include a link to example gigs in the "Requirements & Success Criteria" section header to help users understand what good requirements look like.

#### Scenario: Example link renders in section header
- GIVEN an authenticated CLIENT user navigates to `/dashboard/gigs/new`
- WHEN the page loads
- THEN the "Requirements & Success Criteria" section header MUST include a link
- AND the link text MUST be "💡 View example gigs for inspiration"
- AND the link MUST be positioned on the same line as the section heading
- AND the link MUST be right-aligned (using flex layout with justify-between or ml-auto)

#### Scenario: Example link has correct styling
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the example link
- THEN the link MUST use secondary styling:
  - Small text size (text-sm)
  - Indigo color (text-indigo-600)
  - Darker indigo on hover (hover:text-indigo-800)
  - Underlined text
  - No button or badge styling (plain link)
- AND the link MUST be visually distinct from the section heading but not overly prominent

#### Scenario: Example link navigates to gig browse page
- GIVEN a CLIENT user is on the gig creation form
- WHEN they click the "💡 View example gigs for inspiration" link
- THEN the browser MUST navigate to `/dashboard/gigs`
- AND the link MUST open in a new browser tab (target="_blank")
- AND the link MUST include rel="noopener noreferrer" for security

#### Scenario: Form state is preserved when user returns
- GIVEN a CLIENT user has partially filled out the gig creation form
- AND they have entered text in title, description, and acceptanceCriteria fields
- WHEN they click the example link (opens new tab)
- AND they view example gigs in the new tab
- AND they close the new tab or switch back to the form tab
- THEN all form fields MUST retain their values
- AND no data MUST be lost
- AND the user can continue editing where they left off

#### Scenario: Example link is accessible via keyboard
- GIVEN a CLIENT user navigating the form with keyboard only
- WHEN they press Tab to navigate through form elements
- THEN the example link MUST be reachable in the tab order
- AND the link MUST be positioned logically in the tab sequence (after section heading, before first field in section)
- AND pressing Enter on the focused link MUST open the link in a new tab

#### Scenario: Example link is accessible to screen readers
- GIVEN a CLIENT user with a screen reader is on the gig creation form
- WHEN the screen reader reads the "Requirements & Success Criteria" section
- THEN the link text "💡 View example gigs for inspiration" MUST be announced
- AND the screen reader MUST announce that the link opens in a new window/tab
- AND the link MUST have appropriate ARIA attributes if needed (e.g., aria-label if emoji causes issues)

#### Scenario: Example link works on mobile devices
- GIVEN a CLIENT user views the gig creation form on a mobile device (320px-768px width)
- WHEN the page renders
- THEN the example link MUST be visible and tappable
- AND the link MUST not cause layout issues or text overflow
- AND tapping the link MUST open `/dashboard/gigs` in a new tab
- AND the mobile browser's back button MUST return to the form with state preserved

#### Scenario: Example link does not interfere with form submission
- GIVEN a CLIENT user has filled out the gig creation form
- AND they have clicked the example link at some point (or not)
- WHEN they submit the form
- THEN the form MUST submit normally
- AND the gig MUST be created successfully
- AND the example link interaction MUST NOT affect form validation or submission

#### Scenario: Example link is positioned correctly in section header
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Requirements & Success Criteria" section
- THEN the section header MUST use a flex layout (flex, items-center, justify-between)
- AND the section heading (h3) MUST be on the left
- AND the example link MUST be on the right
- AND both elements MUST be vertically centered
- AND the layout MUST be responsive (stack on very small screens if needed)

#### Scenario: Example link text is clear and actionable
- GIVEN a CLIENT user reads the example link text
- WHEN they see "💡 View example gigs for inspiration"
- THEN the text MUST clearly communicate:
  - What the link does ("View example gigs")
  - Why it's helpful ("for inspiration")
  - That it's optional (implied by "inspiration" framing)
- AND the lightbulb emoji MUST signal "helpful tip" without being intrusive

#### Scenario: All existing form functionality remains intact
- GIVEN a CLIENT user interacts with the gig creation form
- WHEN they use any existing feature (character counters, quality warnings, fee preview, validation, section layout)
- THEN all features MUST work exactly as before
- AND the example link MUST NOT break or interfere with any existing functionality
- AND form submission behavior MUST remain unchanged

**Acceptance Criteria:**
- Link added to "Requirements & Success Criteria" section header in `app/dashboard/gigs/new/page.tsx`
- Section header uses flex layout: `<div className="flex items-center justify-between mb-2">`
- Link element: `<a href="/dashboard/gigs" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 underline">💡 View example gigs for inspiration</a>`
- Link positioned on right side of section header (heading on left, link on right)
- Link opens in new tab (target="_blank") with security attributes (rel="noopener noreferrer")
- Link is keyboard accessible (natural tab order, Enter key works)
- Link is screen reader accessible (text is clear, new tab behavior announced)
- Form state preservation works naturally (new tab doesn't affect original tab's DOM)
- Link works on mobile devices (responsive, tappable, no layout issues)
- All existing form functionality remains unchanged (character counters, quality warnings, validation, submission)
- No changes to server actions or validation logic
- No changes to other sections of the form (Basic Information, Budget & Details)
