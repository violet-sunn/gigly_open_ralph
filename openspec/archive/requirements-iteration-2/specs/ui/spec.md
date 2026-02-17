# UI Spec Delta: Requirements Iteration 2

## ADDED Requirements

### Requirement: Structured Requirement Fields on Gig Creation Form
The gig creation form MUST include three optional textarea fields to guide clients through requirement articulation: goal, deliverables, and constraints.

#### Scenario: Form renders with new optional fields
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN the form MUST display three new optional textarea fields:
  - **Goal/Outcome** field with:
    - Label: "Goal / Desired Outcome" or "What problem are you solving?"
    - Placeholder: "Example: We need to migrate our user authentication from custom solution to OAuth 2.0 to improve security and reduce maintenance burden."
    - Helper text: "Optional: Describe the business or technical problem you're solving. What does success look like?"
    - `name="goal"`, `rows={3}`
  - **Deliverables** field with:
    - Label: "Specific Deliverables" or "What outputs do you expect?"
    - Placeholder: "Example: Working OAuth integration, migration script for existing users, updated documentation, deployment to staging environment."
    - Helper text: "Optional: List concrete outputs you expect (features, documentation, deployments, etc.)"
    - `name="deliverables"`, `rows={3}`
  - **Constraints/Preferences** field with:
    - Label: "Constraints & Preferences" or "Any technical or timeline constraints?"
    - Placeholder: "Example: Must use existing PostgreSQL database, prefer TypeScript over JavaScript, deadline is end of Q1, need to maintain backward compatibility."
    - Helper text: "Optional: Technical preferences, timeline considerations, compatibility requirements, or other constraints."
    - `name="constraints"`, `rows={3}`

#### Scenario: Optional fields are positioned logically
- GIVEN the gig creation form
- WHEN the page renders
- THEN the new fields MUST be positioned:
  - After the existing "Definition of Done" (acceptanceCriteria) field
  - Before the budget and tags fields
  - In the order: Goal → Deliverables → Constraints
- AND the fields MUST be visually grouped or separated from required fields (e.g., with a subheading "Additional Details (Optional)")

#### Scenario: Optional fields have no required attribute
- GIVEN the gig creation form
- WHEN a CLIENT user submits without filling goal, deliverables, or constraints
- THEN HTML5 validation MUST NOT prevent submission
- AND the form MUST submit successfully (server action handles empty values)

#### Scenario: Placeholder text provides helpful examples
- GIVEN a CLIENT user views the gig creation form
- WHEN they focus on any of the three new fields
- THEN the placeholder text MUST show a realistic, concrete example
- AND the example MUST be relevant to the Russian IT market context
- AND the language MUST be friendly and non-technical where possible

#### Scenario: Helper text explains purpose without being prescriptive
- GIVEN the gig creation form
- WHEN rendered
- THEN each new field MUST have helper text below it
- AND the helper text MUST emphasize that the field is optional
- AND the helper text MUST explain what to include without being rigid or bureaucratic

#### Scenario: Form maintains existing validation
- GIVEN the gig creation form with new optional fields
- WHEN a CLIENT submits with invalid required fields (e.g., acceptanceCriteria < 50 chars)
- THEN the existing validation MUST still work
- AND error messages MUST be displayed as before
- AND the new optional fields MUST NOT interfere with existing validation

#### Scenario: Form shows loading state unchanged
- GIVEN a CLIENT user submits the gig form
- WHEN the server action is processing
- THEN the submit button MUST show "Posting..." text
- AND all form fields (including new optional ones) MUST be disabled
- (Existing behavior preserved)

**Acceptance Criteria:**
- Three new textarea fields added to `/dashboard/gigs/new/page.tsx`
- Each field has: label, placeholder with example, helper text, name attribute, rows={3}
- Fields are optional (no `required` attribute)
- Fields positioned after acceptanceCriteria, before budget
- Visual grouping or subheading indicates these are optional
- Placeholder examples are realistic and relevant
- Helper text emphasizes optional nature
- All existing form functionality and validation preserved
- Form remains mobile-friendly (responsive textarea sizing)

---

### Requirement: Structured Requirement Fields Display on Gig Detail Page
The gig detail page MUST display the three new structured requirement fields when they contain content, positioned prominently for specialist visibility.

#### Scenario: Gig detail displays filled structured fields
- GIVEN a gig with non-empty goal, deliverables, and constraints
- WHEN any authenticated user views `/dashboard/gigs/[id]`
- THEN the page MUST display a "Requirements" or "Project Details" section containing:
  - **Goal/Outcome** subsection with heading and content (preserving whitespace with `white-space: pre-wrap`)
  - **Deliverables** subsection with heading and content
  - **Constraints** subsection with heading and content
- AND this section MUST be positioned prominently (after description, before or alongside "Definition of Done")

#### Scenario: Empty structured fields are hidden gracefully
- GIVEN a gig where goal, deliverables, and constraints are all empty strings
- WHEN any authenticated user views the gig detail page
- THEN the structured fields section MUST NOT be displayed
- OR individual empty subsections MUST be hidden (only show subsections with content)
- AND the page MUST NOT show "Not specified" for these optional fields (unlike acceptanceCriteria which is required)

#### Scenario: Partially filled structured fields
- GIVEN a gig where only goal is filled (deliverables and constraints are empty)
- WHEN any authenticated user views the gig detail page
- THEN the page MUST display only the Goal subsection
- AND empty subsections (Deliverables, Constraints) MUST be hidden
- AND the section heading MUST still be displayed (e.g., "Additional Requirements")

#### Scenario: Legacy gigs without structured fields
- GIVEN a gig created before this change (goal, deliverables, constraints are empty strings)
- WHEN any authenticated user views the gig detail page
- THEN the structured fields section MUST NOT be displayed
- AND the page MUST render normally with existing fields only
- AND no errors or warnings MUST be shown

#### Scenario: Structured fields are visually distinct
- GIVEN a gig with filled structured fields
- WHEN the gig detail page renders
- THEN each subsection MUST be visually distinct:
  - Clear heading for each subsection (e.g., "🎯 Goal", "📦 Deliverables", "⚙️ Constraints" or similar)
  - Adequate spacing between subsections
  - Consistent styling with the existing "Definition of Done" section
  - Preserved whitespace for readability (`white-space: pre-wrap`)

#### Scenario: Structured fields visible to all roles
- GIVEN a gig with filled structured fields
- WHEN viewed by CLIENT (owner or non-owner), SPECIALIST (applied or not), or ADMIN
- THEN all users MUST see the structured fields
- AND no role-based hiding MUST occur (these are public gig details)

#### Scenario: Structured fields positioned for specialist visibility
- GIVEN a SPECIALIST browsing gigs
- WHEN they view a gig detail page
- THEN the structured fields MUST be positioned:
  - High on the page (above applications section, near description)
  - Before or alongside "Definition of Done" for easy scanning
  - In a visually prominent section (not buried at the bottom)
- AND the positioning MUST help specialists quickly assess if the gig is a good fit

**Acceptance Criteria:**
- Gig detail page (`/dashboard/gigs/[id]/page.tsx`) queries gig with goal, deliverables, constraints fields
- Structured fields section only renders if at least one field has content
- Individual subsections only render if their field has content (no "Not specified" placeholders)
- Each subsection has clear heading and preserved whitespace (`white-space: pre-wrap`)
- Section positioned prominently (after description, before or alongside acceptanceCriteria)
- Consistent styling with existing gig detail sections
- Visible to all roles (no role-based hiding)
- Legacy gigs (empty fields) render without errors
- Mobile-friendly responsive layout

## MODIFIED Requirements

### Requirement: Gig Creation Form (MODIFIED)
The gig creation form at `/dashboard/gigs/new` MUST now include three additional optional fields for structured requirements.

(See ADDED Requirements above for full specification)

**Changes from existing requirement:**
- Form now has 3 additional textarea fields (goal, deliverables, constraints)
- Form layout adjusted to accommodate new fields
- All existing validation and behavior preserved

### Requirement: Gig Detail Page (MODIFIED)
The gig detail page at `/dashboard/gigs/[id]` MUST now display three additional structured requirement fields when present.

(See ADDED Requirements above for full specification)

**Changes from existing requirement:**
- Page now queries and displays goal, deliverables, constraints fields
- New "Requirements" or "Project Details" section added
- All existing sections (description, acceptanceCriteria, applications, messages) preserved
- Page layout adjusted to accommodate new section

## REMOVED Requirements

None - all existing UI functionality is preserved.
