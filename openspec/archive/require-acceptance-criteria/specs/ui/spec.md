# UI Spec Delta: Require Acceptance Criteria

## MODIFIED Requirements

### Requirement: Gig Creation Form
The system MUST provide a form at `/dashboard/gigs/new` for CLIENT users to create gigs.

#### Scenario: Form renders for CLIENT user
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN the page MUST display a form with:
  - Title input (text, required)
  - Description textarea (required)
  - **Acceptance Criteria textarea (required, labeled "Definition of Done" or "Acceptance Criteria")**
  - Budget input (number, required, in roubles)
  - Tags input (text, optional, comma-separated)
  - A live fee preview showing: budget, service fee (20%), and total amount
  - A "Post Gig" submit button

#### **Scenario: Acceptance criteria field has helpful guidance**
- **GIVEN a CLIENT user is on the gig creation form**
- **WHEN they view the acceptance criteria field**
- **THEN the field MUST have:**
  - **Label: "Definition of Done" or "Acceptance Criteria"**
  - **Placeholder text with example (e.g., "What does 'done' look like? Be specific: deliverables, quality standards, success metrics...")**
  - **Helper text below field: "Minimum 50 characters. Clear criteria prevent disputes and scope creep."**

#### **Scenario: Form validates acceptance criteria length**
- **GIVEN a CLIENT user enters acceptance criteria shorter than 50 characters**
- **WHEN they submit the form**
- **THEN the server action MUST return an error**
- **AND the error MUST be displayed inline on the form**

#### Scenario: Live fee calculation preview
- GIVEN a CLIENT user is on the gig creation form
- WHEN they enter a budget value (e.g., 100000)
- THEN the form MUST display in real-time:
  - "Budget: 100,000 ₽"
  - "Service fee (20%): 20,000 ₽"
  - "Total: 120,000 ₽"

#### Scenario: Form shows loading state
- GIVEN a CLIENT user submits the gig form
- WHEN the server action is processing
- THEN the submit button MUST show "Posting..." text
- AND the button MUST be disabled

#### Scenario: Form shows error
- GIVEN a CLIENT user submits invalid data
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline on the form

#### Scenario: Non-CLIENT user visits gig creation page
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN they MUST be redirected to `/dashboard`

#### Scenario: Unauthenticated user visits gig creation page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs/new`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/new/page.tsx` exists
- Uses `useActionState` with `createGig` action
- Uses `useFormStatus` for pending state on submit button
- **Acceptance criteria field:**
  - **`<textarea name="acceptanceCriteria" required rows={5} />`**
  - **Label: "Definition of Done" or "Acceptance Criteria"**
  - **Placeholder with example text**
  - **Helper text: "Minimum 50 characters. Clear criteria prevent disputes and scope creep."**
- Budget input accepts roubles, displays fee breakdown in real-time
- Displays `state?.error` when present

---

### Requirement: Gig Detail Page
The system MUST provide a page at `/dashboard/gigs/[id]` showing full gig details.

#### Scenario: Specialist views gig detail
- GIVEN an authenticated SPECIALIST user
- WHEN they navigate to `/dashboard/gigs/[id]` for an existing gig
- THEN the page MUST display: title, description, **acceptance criteria**, budget (₽), tags, status, and client email
- AND it MUST display an "Apply" form with a cover letter textarea and submit button
- AND if the specialist has already applied, the form MUST be replaced with "You have already applied" message

#### **Scenario: Acceptance criteria displayed prominently**
- **GIVEN any authenticated user views a gig detail page**
- **WHEN the page renders**
- **THEN the acceptance criteria MUST be displayed:**
  - **In a visually distinct section (e.g., bordered box or card)**
  - **With heading "Definition of Done" or "Acceptance Criteria"**
  - **Positioned between description and budget/tags (high visibility)**
  - **Formatted with preserved whitespace (white-space: pre-wrap)**

#### **Scenario: Legacy gig without acceptance criteria**
- **GIVEN a gig created before this change (acceptanceCriteria is null)**
- **WHEN any user views the gig detail page**
- **THEN the acceptance criteria section MUST display "Not specified" or similar placeholder**
- **AND the section MUST still be visible (not hidden)**

#### Scenario: CLIENT views gig detail
- GIVEN an authenticated CLIENT user
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display the gig details **(including acceptance criteria)**
- AND it MUST NOT show the apply form
- AND if the CLIENT owns the gig, it MUST show the list of applications with specialist email, cover letter, status, and date
- AND if the gig is OPEN, each PENDING application MUST show "Accept" and "Reject" buttons
- AND if the gig is IN_PROGRESS, applications MUST show status badges ("Accepted" / "Rejected") instead of buttons
- AND if the gig is IN_PROGRESS, the assigned specialist's email MUST be shown prominently

#### Scenario: Gig not found
- GIVEN a non-existent gig ID
- WHEN a user navigates to `/dashboard/gigs/[id]`
- THEN the page MUST show a "Gig not found" message with a link back to `/dashboard`

#### Scenario: Apply form shows loading state
- GIVEN a SPECIALIST submits the apply form
- WHEN the server action is processing
- THEN the submit button MUST show "Applying..." text
- AND the button MUST be disabled

#### Scenario: Apply form shows error
- GIVEN a SPECIALIST submits and the server action returns an error
- WHEN the error is returned
- THEN the error message MUST be displayed inline on the form

**Acceptance Criteria:**
- `app/dashboard/gigs/[id]/page.tsx` exists as a server component
- Queries gig by ID with `include: { client: true, assignedSpecialist: true, applications: true }`
- **Acceptance criteria section:**
  - **Heading: "Definition of Done" or "Acceptance Criteria"**
  - **Visually distinct (border, background, or card styling)**
  - **Positioned prominently (before or after description)**
  - **Handles null values gracefully (shows "Not specified")**
  - **Preserves whitespace with `white-space: pre-wrap`**
- SPECIALIST sees apply form (or "already applied" message)
- CLIENT who owns the gig sees applications list
- OPEN gigs: PENDING applications show Accept/Reject buttons via `ApplicationActions` client component
- IN_PROGRESS gigs: applications show status badges, assigned specialist email displayed
- `ApplicationActions` uses `useActionState` with `acceptApplication` / `rejectApplication`
- `ApplicationActions` uses `useFormStatus` for pending states ("Accepting..." / "Rejecting...")
- Each button submits a form with hidden `applicationId` field
- Inline error display from action state
