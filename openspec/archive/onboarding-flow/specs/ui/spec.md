# UI Specification Delta: Onboarding Flow

## ADDED Requirements

### Requirement: Welcome Screen After Registration
The system MUST display a welcome screen immediately after successful registration, showing role-specific next steps.

#### Scenario: CLIENT user sees welcome screen after registration
- GIVEN a user completes registration with role "CLIENT"
- WHEN the registration action redirects to `/dashboard`
- THEN a welcome modal MUST be displayed overlaying the dashboard
- AND the modal MUST show heading "Welcome to Gigly!"
- AND the modal MUST display role-specific steps:
  1. "Complete your profile" with link to `/profile/edit`
  2. "Create your first gig" with link to `/gigs/new`
  3. "Review applications from specialists"
- AND the modal MUST include a "Get Started" button that dismisses the modal
- AND the modal MUST include a "Skip for now" link that dismisses the modal
- AND dismissing the modal MUST set `localStorage.setItem('onboarding_welcome_seen', 'true')`

#### Scenario: SPECIALIST user sees welcome screen after registration
- GIVEN a user completes registration with role "SPECIALIST"
- WHEN the registration action redirects to `/dashboard`
- THEN a welcome modal MUST be displayed overlaying the dashboard
- AND the modal MUST show heading "Welcome to Gigly!"
- AND the modal MUST display role-specific steps:
  1. "Complete your profile" with link to `/profile/edit`
  2. "Browse available gigs" with link to `/gigs`
  3. "Apply to gigs that match your skills"
- AND the modal MUST include a "Get Started" button that dismisses the modal
- AND the modal MUST include a "Skip for now" link that dismisses the modal
- AND dismissing the modal MUST set `localStorage.setItem('onboarding_welcome_seen', 'true')`

#### Scenario: Returning user does not see welcome screen
- GIVEN a user has previously dismissed the welcome screen
- AND `localStorage.getItem('onboarding_welcome_seen')` returns `'true'`
- WHEN they visit `/dashboard`
- THEN the welcome modal MUST NOT be displayed
- AND the dashboard MUST render normally

#### Scenario: Welcome modal is accessible
- GIVEN the welcome modal is displayed
- WHEN a user interacts with it
- THEN the modal MUST trap focus (keyboard navigation stays within modal)
- AND pressing Escape key MUST dismiss the modal
- AND the modal MUST have `role="dialog"` and `aria-modal="true"`
- AND the modal MUST have an accessible close button

#### Scenario: Welcome modal is mobile-responsive
- GIVEN a user views the welcome screen on a mobile device (< 640px width)
- WHEN the modal renders
- THEN the modal MUST fit within the viewport
- AND all text MUST be readable without horizontal scrolling
- AND all buttons MUST be easily tappable (min 44px touch target)

**Acceptance Criteria:**
- `WelcomeModal` client component created at `app/components/onboarding/WelcomeModal.tsx`
- Component accepts props: `role: 'CLIENT' | 'SPECIALIST'`, `onDismiss: () => void`
- Component uses `useEffect` to check localStorage on mount
- Component renders conditionally based on `!localStorage.getItem('onboarding_welcome_seen')`
- Modal uses Tailwind classes for styling (backdrop, centered card, responsive)
- Modal includes role-specific step lists with numbered items
- "Get Started" button and "Skip for now" link both call `onDismiss` and set localStorage
- Dashboard page integrates `WelcomeModal` component
- Modal is keyboard-accessible (focus trap, Escape to close)
- Modal has proper ARIA attributes for screen readers

---

### Requirement: Profile Completion Indicator
The dashboard MUST display a profile completion progress indicator showing percentage of required fields filled.

#### Scenario: CLIENT user sees profile completion indicator
- GIVEN an authenticated CLIENT user on `/dashboard`
- AND the user has incomplete profile (missing companyName or inn)
- WHEN the dashboard renders
- THEN a profile completion card MUST be displayed
- AND the card MUST show "Complete Your Profile" heading
- AND the card MUST display a progress bar showing completion percentage
- AND the percentage MUST be calculated as: (filled required fields / total required fields) × 100
- AND for CLIENT: required fields are companyName, inn (2 fields total)
- AND the card MUST show text "X% complete"
- AND the card MUST include a "Complete Profile" button linking to `/profile/edit`

#### Scenario: SPECIALIST user sees profile completion indicator
- GIVEN an authenticated SPECIALIST user on `/dashboard`
- AND the user has incomplete profile (missing displayName, techStack, or experienceLevel)
- WHEN the dashboard renders
- THEN a profile completion card MUST be displayed
- AND the percentage MUST be calculated as: (filled fields / total fields) × 100
- AND for SPECIALIST: tracked fields are displayName, techStack, experienceLevel, bio (4 fields total)
- AND the card MUST show progress bar and percentage
- AND the card MUST include a "Complete Profile" button linking to `/profile/edit`

#### Scenario: Profile completion indicator hidden when complete
- GIVEN an authenticated user with 100% profile completion
- WHEN they visit `/dashboard`
- THEN the profile completion card MUST NOT be displayed
- AND the dashboard MUST show normal content without the indicator

#### Scenario: Progress bar visual feedback
- GIVEN a user views the profile completion indicator
- WHEN the progress bar renders
- THEN the bar MUST use color coding:
  - 0-33%: red (bg-red-500)
  - 34-66%: yellow (bg-yellow-500)
  - 67-99%: blue (bg-blue-500)
  - 100%: green (bg-green-500, but card is hidden at 100%)
- AND the bar MUST animate smoothly when percentage changes

#### Scenario: Profile completion calculation is accurate
- GIVEN a CLIENT user with companyName filled but inn empty
- WHEN the dashboard calculates completion
- THEN the percentage MUST be 50% (1 of 2 required fields)
- AND the progress bar MUST reflect 50% width

**Acceptance Criteria:**
- `ProfileCompletionCard` component created at `app/components/onboarding/ProfileCompletionCard.tsx`
- Component accepts props: `role: 'CLIENT' | 'SPECIALIST'`, `profile: ClientProfile | SpecialistProfile | null`
- Component calculates completion percentage based on role-specific required fields
- CLIENT required fields: companyName, inn (2 fields)
- SPECIALIST tracked fields: displayName, techStack, experienceLevel, bio (4 fields, all optional but tracked)
- Progress bar uses Tailwind width utilities (e.g., `style={{ width: '${percentage}%' }}`)
- Color coding based on percentage ranges
- Component returns null when completion is 100%
- Dashboard page integrates component above existing content
- Calculation logic is pure function (testable)

---

### Requirement: First-Time Tooltip on Gig Creation
The gig creation form MUST display a dismissible tooltip on first visit explaining the form's purpose.

#### Scenario: First-time visitor sees gig creation tooltip
- GIVEN a CLIENT user navigates to `/gigs/new` for the first time
- AND `localStorage.getItem('onboarding_gig_creation_seen')` returns null
- WHEN the page renders
- THEN a tooltip MUST be displayed near the form heading
- AND the tooltip MUST show message: "💡 Tip: Be specific about your requirements and Definition of Done to attract quality specialists. Check out example gigs for inspiration!"
- AND the tooltip MUST include a "Got it" button
- AND the tooltip MUST include a small "×" close button
- AND clicking either button MUST dismiss the tooltip
- AND dismissing MUST set `localStorage.setItem('onboarding_gig_creation_seen', 'true')`

#### Scenario: Returning visitor does not see tooltip
- GIVEN a CLIENT user has previously dismissed the gig creation tooltip
- AND `localStorage.getItem('onboarding_gig_creation_seen')` returns `'true'`
- WHEN they navigate to `/gigs/new`
- THEN the tooltip MUST NOT be displayed
- AND the form MUST render normally

#### Scenario: Tooltip is dismissible and non-blocking
- GIVEN the gig creation tooltip is displayed
- WHEN a user interacts with the form without dismissing the tooltip
- THEN the form MUST remain fully functional
- AND the tooltip MUST NOT block form inputs
- AND the tooltip MUST NOT prevent form submission

**Acceptance Criteria:**
- `FirstTimeTooltip` reusable component created at `app/components/onboarding/FirstTimeTooltip.tsx`
- Component accepts props: `storageKey: string`, `message: string`, `onDismiss?: () => void`
- Component checks localStorage on mount using `useEffect`
- Component renders conditionally based on `!localStorage.getItem(storageKey)`
- Tooltip styled with Tailwind (bg-blue-50, border-blue-300, rounded, shadow)
- Tooltip includes "Got it" button and "×" close button
- Both buttons set localStorage and hide tooltip
- Gig creation page integrates tooltip near form heading
- Tooltip is positioned absolutely or relatively to not disrupt layout

---

### Requirement: First-Time Tooltip on Application Form
The application form MUST display a dismissible tooltip on first visit explaining the structured fields.

#### Scenario: First-time applicant sees application tooltip
- GIVEN a SPECIALIST user views a gig detail page with an application form
- AND `localStorage.getItem('onboarding_application_seen')` returns null
- WHEN the page renders
- THEN a tooltip MUST be displayed near the application form
- AND the tooltip MUST show message: "💡 Tip: Focus on your technical approach and ask clarifying questions. Clients value substance over sales pitches!"
- AND the tooltip MUST be dismissible with "Got it" button
- AND dismissing MUST set `localStorage.setItem('onboarding_application_seen', 'true')`

#### Scenario: Returning applicant does not see tooltip
- GIVEN a SPECIALIST user has previously dismissed the application tooltip
- WHEN they view a gig with an application form
- THEN the tooltip MUST NOT be displayed

**Acceptance Criteria:**
- Gig detail page integrates `FirstTimeTooltip` component near application form
- Uses storageKey: `'onboarding_application_seen'`
- Tooltip message emphasizes technical approach over sales
- Tooltip does not block form functionality

---

### Requirement: First-Time Tooltip on Messaging
The messaging interface MUST display a dismissible tooltip on first message send explaining messaging etiquette.

#### Scenario: First-time messenger sees messaging tooltip
- GIVEN a user (CLIENT or SPECIALIST) views a gig with messaging enabled
- AND `localStorage.getItem('onboarding_messaging_seen')` returns null
- WHEN the messages section renders
- THEN a tooltip MUST be displayed near the message form
- AND the tooltip MUST show message: "💡 Tip: Keep communication professional and on-topic. All messages are visible to both parties and may be reviewed in disputes."
- AND the tooltip MUST be dismissible with "Got it" button
- AND dismissing MUST set `localStorage.setItem('onboarding_messaging_seen', 'true')`

#### Scenario: Returning user does not see messaging tooltip
- GIVEN a user has previously dismissed the messaging tooltip
- WHEN they view a gig with messaging
- THEN the tooltip MUST NOT be displayed

**Acceptance Criteria:**
- Gig detail page integrates `FirstTimeTooltip` component near message form
- Uses storageKey: `'onboarding_messaging_seen'`
- Tooltip message emphasizes professional communication
- Tooltip does not block messaging functionality

---

### Requirement: Enhanced Empty State for No Gigs (CLIENT)
The CLIENT dashboard MUST display an actionable empty state when no gigs exist.

#### Scenario: CLIENT with no gigs sees enhanced empty state
- GIVEN an authenticated CLIENT user on `/dashboard`
- AND the user has zero gigs
- WHEN the "My Gigs" section renders
- THEN instead of "No gigs posted yet.", the section MUST display:
  - Icon or illustration (e.g., 📋 emoji or SVG)
  - Heading: "Post Your First Gig"
  - Description: "Get started by posting a gig. Describe what you need, set your budget, and receive applications from qualified specialists."
  - Primary CTA button: "Create Gig" linking to `/gigs/new`
  - Secondary link: "View Example Gigs" linking to `/gigs/examples`
- AND the empty state MUST use card styling (border, padding, centered content)

#### Scenario: CLIENT with existing gigs sees normal list
- GIVEN a CLIENT user with at least one gig
- WHEN the "My Gigs" section renders
- THEN the enhanced empty state MUST NOT be displayed
- AND the normal gig list MUST be shown

**Acceptance Criteria:**
- `EmptyState` reusable component created at `app/components/onboarding/EmptyState.tsx`
- Component accepts props: `icon: string`, `heading: string`, `description: string`, `primaryAction: { label: string, href: string }`, `secondaryAction?: { label: string, href: string }`
- Component renders centered card with icon, text, and action buttons
- Dashboard page uses `EmptyState` component when gigs array is empty
- Empty state is visually distinct from normal content (border, background, centered)

---

### Requirement: Enhanced Empty State for No Applications (SPECIALIST)
The SPECIALIST dashboard MUST display actionable empty states for each tab when no items exist.

#### Scenario: SPECIALIST with no active work sees enhanced empty state
- GIVEN an authenticated SPECIALIST user on `/dashboard`
- AND the "Active Work" tab is selected
- AND the user has zero active gigs
- WHEN the tab content renders
- THEN instead of "No active work.", the section MUST display:
  - Icon: 🔍
  - Heading: "No Active Work Yet"
  - Description: "Browse available gigs and apply to projects that match your skills. Once accepted, your work will appear here."
  - Primary CTA: "Browse Gigs" linking to `/gigs`
- AND the empty state MUST use card styling

#### Scenario: SPECIALIST with no pending applications sees enhanced empty state
- GIVEN a SPECIALIST user on the "Pending Applications" tab
- AND the user has zero pending applications
- WHEN the tab content renders
- THEN the section MUST display:
  - Icon: 📝
  - Heading: "No Pending Applications"
  - Description: "You haven't applied to any gigs yet. Browse open gigs and submit applications to get started."
  - Primary CTA: "Browse Gigs" linking to `/gigs`

#### Scenario: SPECIALIST with no archived items sees enhanced empty state
- GIVEN a SPECIALIST user on the "Archive" tab
- AND the user has zero completed gigs and zero rejected applications
- WHEN the tab content renders
- THEN the section MUST display:
  - Icon: 📦
  - Heading: "No Archived Items"
  - Description: "Completed gigs and rejected applications will appear here once you start working on projects."
  - No CTA button (archive is passive)

**Acceptance Criteria:**
- `SpecialistDashboardTabs` component updated to use `EmptyState` component
- Each tab uses appropriate empty state with role-specific messaging
- Empty states include clear CTAs where appropriate (Active Work, Pending Applications)
- Archive tab empty state has no CTA (passive state)

---

### Requirement: Enhanced Empty State for No Messages
The gig detail page MUST display an actionable empty state when no messages exist.

#### Scenario: Gig with no messages shows enhanced empty state
- GIVEN a gig with an assigned specialist
- AND the gig has zero messages
- WHEN an authorized user views the messages section
- THEN instead of "No messages yet. Start the conversation below.", the section MUST display:
  - Icon: 💬
  - Heading: "No Messages Yet"
  - Description: "Start the conversation! Use messages to clarify requirements, share updates, and coordinate work."
  - No CTA button (message form is already visible below)
- AND the empty state MUST be positioned above the message form

**Acceptance Criteria:**
- Gig detail page uses `EmptyState` component in messages section when messages array is empty
- Empty state positioned above message composition form
- Empty state uses messaging-specific copy
- No CTA button (form is already present)

---

## MODIFIED Requirements

### Requirement: Registration Action with Session and Role
**MODIFICATION**: After successful registration, the system MUST check if this is the user's first visit and conditionally display the welcome screen.

#### Scenario: First-time registration shows welcome screen
- GIVEN a user successfully completes registration
- WHEN they are redirected to `/dashboard`
- THEN the welcome modal MUST be displayed
- AND `localStorage.getItem('onboarding_welcome_seen')` MUST return null (first visit)

**Acceptance Criteria:**
- Dashboard page checks for welcome screen display on mount
- Welcome screen logic integrated into dashboard rendering
- No changes to registration server action (redirect remains `/dashboard`)

---

### Requirement: Role-Based Dashboard
**MODIFICATION**: The dashboard MUST integrate onboarding components (welcome modal, profile completion indicator) alongside existing content.

#### Scenario: CLIENT dashboard shows onboarding elements
- GIVEN a CLIENT user with incomplete profile visits `/dashboard`
- WHEN the page renders
- THEN the welcome modal MUST be displayed (if first visit)
- AND the profile completion indicator MUST be displayed (if profile incomplete)
- AND existing dashboard content (My Gigs, etc.) MUST remain visible below

#### Scenario: SPECIALIST dashboard shows onboarding elements
- GIVEN a SPECIALIST user with incomplete profile visits `/dashboard`
- WHEN the page renders
- THEN the welcome modal MUST be displayed (if first visit)
- AND the profile completion indicator MUST be displayed (if profile incomplete)
- AND existing dashboard tabs MUST remain functional

**Acceptance Criteria:**
- Dashboard page integrates `WelcomeModal` component at top level
- Dashboard page integrates `ProfileCompletionCard` component above existing content
- All existing dashboard functionality remains unchanged
- Onboarding components do not break existing layout or interactions
