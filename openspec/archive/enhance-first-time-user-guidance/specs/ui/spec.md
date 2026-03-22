# UI Specification Delta

## ADDED Requirements

### Requirement: Tooltip Component
The system MUST provide a reusable Tooltip component for displaying contextual help text next to form fields.

#### Scenario: Tooltip displays on hover (desktop)
- GIVEN a user hovers over an info icon
- WHEN the mouse enters the icon area
- THEN a tooltip MUST appear with explanatory text
- AND the tooltip MUST be positioned near the icon without obscuring the field
- AND the tooltip MUST disappear when the mouse leaves

#### Scenario: Tooltip displays on click (mobile)
- GIVEN a user on a mobile device taps an info icon
- WHEN the icon is tapped
- THEN a tooltip MUST appear with explanatory text
- AND the tooltip MUST remain visible until the user taps outside or taps the icon again
- AND the touch target MUST be at least 44x44px

#### Scenario: Tooltip content is accessible
- GIVEN a user navigating with keyboard
- WHEN the info icon receives focus
- THEN the tooltip MUST be visible
- AND the tooltip content MUST be announced by screen readers
- AND the tooltip MUST have proper ARIA attributes

#### Scenario: Tooltip positioning adapts to viewport
- GIVEN a tooltip near the edge of the viewport
- WHEN the tooltip would overflow the viewport
- THEN the tooltip MUST reposition to remain fully visible
- AND the tooltip arrow MUST point to the correct icon

**Acceptance Criteria:**
- Tooltip component created at `app/components/ui/Tooltip.tsx`
- Props: `content: string`, `children: ReactNode`, `position?: 'top' | 'bottom' | 'left' | 'right'`
- Uses Radix UI Tooltip primitive or similar accessible library
- Hover behavior on desktop (pointer: fine)
- Click behavior on mobile (pointer: coarse)
- ARIA attributes: `aria-describedby`, `role="tooltip"`
- Minimum touch target: 44x44px
- Tooltip max-width: 300px
- Tooltip z-index higher than form elements
- Smooth fade-in/out animation (150ms)

---

### Requirement: InfoIcon Component
The system MUST provide a consistent InfoIcon component for use with tooltips.

#### Scenario: InfoIcon renders with consistent styling
- GIVEN an InfoIcon is rendered next to a form field
- WHEN the component renders
- THEN it MUST display a circular "i" icon
- AND the icon MUST use neutral colors (not distracting)
- AND the icon MUST be 16x16px by default
- AND the icon MUST have a hover state (cursor: pointer, slight color change)

#### Scenario: InfoIcon is keyboard accessible
- GIVEN a user navigating with keyboard
- WHEN the user tabs to an InfoIcon
- THEN the icon MUST receive visible focus outline
- AND pressing Enter or Space MUST trigger the tooltip

**Acceptance Criteria:**
- InfoIcon component created at `app/components/ui/InfoIcon.tsx`
- Uses SVG icon (not emoji or image)
- Default size: 16x16px
- Color: text-neutral-subtle (from design tokens)
- Hover color: text-neutral-strong
- Cursor: pointer
- Focusable: tabIndex={0}
- Keyboard handlers: onKeyDown for Enter/Space
- ARIA label: "More information"

---

### Requirement: HelpBanner Component
The system MUST provide a dismissible HelpBanner component for displaying contextual guidance at the top of forms.

#### Scenario: HelpBanner displays with dismiss button
- GIVEN a first-time user views a form with guidance
- WHEN the HelpBanner renders
- THEN it MUST display the guidance text prominently
- AND it MUST include a dismiss button (X icon) in the top-right corner
- AND the banner MUST use a subtle background color (not alarming)

#### Scenario: User dismisses HelpBanner
- GIVEN a HelpBanner is visible
- WHEN the user clicks the dismiss button
- THEN the banner MUST fade out and disappear
- AND the `onDismiss` callback MUST be called
- AND the dismissal MUST be persisted via server action

#### Scenario: HelpBanner is accessible
- GIVEN a HelpBanner is rendered
- WHEN a screen reader user encounters it
- THEN the banner MUST have `role="region"` and `aria-label="Help information"`
- AND the dismiss button MUST have `aria-label="Dismiss help"`
- AND the banner MUST be keyboard navigable

#### Scenario: HelpBanner supports links
- GIVEN a HelpBanner with a link to example gigs
- WHEN the banner renders
- THEN links MUST be styled distinctly (underlined, colored)
- AND links MUST open in new tab with `target="_blank" rel="noopener noreferrer"`

**Acceptance Criteria:**
- HelpBanner component created at `app/components/ui/HelpBanner.tsx`
- Props: `title?: string`, `children: ReactNode`, `onDismiss: () => void`
- Background: bg-blue-50 (light blue, not alarming)
- Border: 1px solid bg-blue-200
- Border-radius: 8px
- Padding: 16px
- Dismiss button: top-right corner, X icon, hover state
- Fade-out animation on dismiss (200ms)
- ARIA attributes: role="region", aria-label
- Supports ReactNode children (allows links, formatting)
- Responsive: full width on mobile, max-width on desktop

---

### Requirement: Gig Creation Form Guidance
The gig creation form MUST display contextual guidance for first-time gig creators.

#### Scenario: First-time gig creator sees guidance banner
- GIVEN a user with `hasCreatedFirstGig = false` AND `gigCreationGuidanceDismissed = false`
- WHEN they navigate to `/dashboard/gigs/new`
- THEN a HelpBanner MUST appear at the top of the form
- AND the banner MUST explain the importance of clear requirements
- AND the banner MUST include a link to example gigs

#### Scenario: Guidance banner is not shown to experienced users
- GIVEN a user with `hasCreatedFirstGig = true`
- WHEN they navigate to `/dashboard/gigs/new`
- THEN no HelpBanner MUST be displayed
- AND the form MUST appear clean and uncluttered

#### Scenario: Guidance banner is not shown after dismissal
- GIVEN a user with `gigCreationGuidanceDismissed = true`
- WHEN they navigate to `/dashboard/gigs/new`
- THEN no HelpBanner MUST be displayed
- AND the dismissal state MUST persist across sessions

#### Scenario: Acceptance criteria field has tooltip
- GIVEN any user viewing the gig creation form
- WHEN they see the "Acceptance Criteria" field label
- THEN an InfoIcon MUST appear next to the label
- AND hovering/clicking the icon MUST show a tooltip explaining acceptance criteria

#### Scenario: Service fee field has tooltip
- GIVEN any user viewing the gig creation form
- WHEN they see the service fee preview
- THEN an InfoIcon MUST appear next to "Service Fee (10%)"
- AND the tooltip MUST explain that the fee is added to the budget and paid by the client

#### Scenario: Structured requirement fields have tooltips
- GIVEN any user viewing the gig creation form
- WHEN they see the optional fields (goal, deliverables, constraints)
- THEN each field label MUST have an InfoIcon
- AND tooltips MUST explain what each field is for and why it's helpful

**Acceptance Criteria:**
- HelpBanner appears at top of gig creation form for first-time users
- Banner text: "Creating your first gig? Clear requirements lead to better applications. Define what success looks like, provide context, and check out [example gigs](/dashboard/gigs/examples) for inspiration."
- Banner dismissal calls `dismissGuidance('gigCreation')` server action
- InfoIcon + Tooltip added to:
  - "Acceptance Criteria" label: "Specific, measurable criteria that define when the work is complete. Example: 'API returns user data in JSON format with <200ms response time.'"
  - "Service Fee" preview: "Gigly charges a 10% service fee on top of your budget. You pay budget + 10%, the specialist receives the full budget amount."
  - "Goal" label: "What problem are you solving? Why does this work matter? Helps specialists understand the bigger picture."
  - "Deliverables" label: "What specific outputs do you expect? (e.g., 'Working API endpoint', 'Updated documentation', 'Test coverage report')"
  - "Constraints" label: "Any technical preferences, deadlines, or limitations? (e.g., 'Must use TypeScript', 'Deadline: 2 weeks', 'No external dependencies')"
- All tooltips are accessible and mobile-friendly
- Guidance state is fetched from user record on page load

---

### Requirement: Application Form Guidance
The application form MUST display contextual guidance for first-time applicants.

#### Scenario: First-time applicant sees guidance banner
- GIVEN a user with `hasSubmittedFirstApplication = false` AND `applicationGuidanceDismissed = false`
- WHEN they view a gig detail page with an application form
- THEN a HelpBanner MUST appear above the application form
- AND the banner MUST explain what makes a strong application
- AND the banner MUST include a link to "What makes a good application?"

#### Scenario: Guidance banner is not shown to experienced applicants
- GIVEN a user with `hasSubmittedFirstApplication = true`
- WHEN they view an application form
- THEN no HelpBanner MUST be displayed

#### Scenario: Guidance banner is not shown after dismissal
- GIVEN a user with `applicationGuidanceDismissed = true`
- WHEN they view an application form
- THEN no HelpBanner MUST be displayed

#### Scenario: Technical approach field has tooltip
- GIVEN any user viewing an application form
- WHEN they see the "Technical Approach" field label
- THEN an InfoIcon MUST appear next to the label
- AND the tooltip MUST explain what to include in the technical approach

#### Scenario: Clarifying questions field has tooltip
- GIVEN any user viewing an application form
- WHEN they see the "Clarifying Questions" field label
- THEN an InfoIcon MUST appear next to the label
- AND the tooltip MUST explain the purpose of asking questions

#### Scenario: Estimated effort field has tooltip
- GIVEN any user viewing an application form
- WHEN they see the "Estimated Effort" field label
- THEN an InfoIcon MUST appear next to the label
- AND the tooltip MUST explain how to estimate effort

**Acceptance Criteria:**
- HelpBanner appears above application form for first-time applicants
- Banner text: "Submitting your first application? Focus on substance over sales. Explain your technical approach, ask clarifying questions, and demonstrate your expertise. [What makes a good application?](#)"
- Banner dismissal calls `dismissGuidance('application')` server action
- InfoIcon + Tooltip added to:
  - "Technical Approach" label: "Describe your methodology and implementation plan. What technologies will you use? What's your step-by-step approach? Be specific and technical."
  - "Clarifying Questions" label: "What do you need to know about the requirements? Asking good questions demonstrates thoroughness and helps avoid scope creep."
  - "Estimated Effort" label: "How long will this take? (e.g., '2-3 days', '1 week', '20 hours'). Optional but helps set expectations."
- "What makes a good application?" link opens modal or navigates to help page (implementation TBD)
- All tooltips are accessible and mobile-friendly
- Guidance state is fetched from user record on page load
