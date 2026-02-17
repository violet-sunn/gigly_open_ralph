# UI Specification Delta

## MODIFIED Requirements

### Requirement: Gig Browse Page
The gig browse page MUST display a visual "Example" indicator for example gigs.

#### Scenario: Example gig displays with badge on browse page
- GIVEN an authenticated user visits `/dashboard/gigs`
- AND there are example gigs with `isExample = true` in the database
- WHEN the page renders
- THEN each example gig MUST display an "Example" badge
- AND the badge MUST be visually distinct (e.g., purple/indigo background, "✨ Example" text)
- AND the badge MUST be positioned prominently (e.g., next to the title or as a tag)

#### Scenario: Real gigs do not show example badge
- GIVEN an authenticated user visits `/dashboard/gigs`
- AND there are real gigs with `isExample = false`
- WHEN the page renders
- THEN real gigs MUST NOT display the "Example" badge

#### Scenario: Example gigs are clickable
- GIVEN an authenticated user views the gig browse page
- AND there are example gigs displayed
- WHEN the user clicks on an example gig
- THEN the browser MUST navigate to `/dashboard/gigs/[id]` (same as real gigs)

**Acceptance Criteria:**
- `app/dashboard/gigs/page.tsx` queries gigs with `isExample` field included
- Example badge component or inline badge renders for gigs where `isExample === true`
- Badge styling is visually distinct (suggested: indigo/purple bg-indigo-100 text-indigo-800, with ✨ emoji)
- Badge is positioned near the gig title for visibility
- All existing gig browsing functionality remains unchanged

---

### Requirement: Gig Detail Page
The gig detail page MUST display an "Example" badge for example gigs and prevent applications.

#### Scenario: Example gig detail shows prominent badge
- GIVEN an authenticated user navigates to `/dashboard/gigs/[id]` for an example gig
- WHEN the page renders
- THEN an "Example Gig" badge MUST be displayed prominently at the top of the page
- AND the badge MUST include explanatory text (e.g., "This is an example gig demonstrating best practices for writing clear requirements.")

#### Scenario: SPECIALIST cannot apply to example gig
- GIVEN an authenticated user with role "SPECIALIST"
- AND the gig has `isExample = true`
- WHEN they view the gig detail page
- THEN the apply form MUST NOT be displayed
- AND an informational message MUST be shown instead:
  - "This is an example gig for demonstration purposes. You cannot apply to example gigs."
  - "Use this example to understand what clear requirements look like when posting your own gigs."

#### Scenario: CLIENT views example gig detail
- GIVEN an authenticated user with role "CLIENT"
- AND the gig has `isExample = true`
- WHEN they view the gig detail page
- THEN the "Example Gig" badge MUST be displayed
- AND the full gig details MUST be visible (title, description, goal, deliverables, constraints, acceptance criteria, budget, tags)
- AND no apply form is shown (CLIENT users never see apply forms anyway)

#### Scenario: Example gig shows all structured fields
- GIVEN any authenticated user views an example gig detail page
- WHEN the page renders
- THEN all structured requirement fields MUST be visible and well-formatted:
  - Goal/Desired Outcome section with content
  - Deliverables section with content
  - Constraints/Preferences section with content
  - Definition of Done section with content
- AND these sections serve as examples of how to fill out these fields

#### Scenario: Real gig detail page unchanged
- GIVEN an authenticated user navigates to `/dashboard/gigs/[id]` for a real gig (`isExample = false`)
- WHEN the page renders
- THEN no "Example" badge MUST be displayed
- AND all existing functionality MUST work normally (apply form for SPECIALIST, applications list for CLIENT owner, etc.)

**Acceptance Criteria:**
- `app/dashboard/gigs/[id]/page.tsx` queries gig with `isExample` field included
- Example badge component renders at top of page when `gig.isExample === true`
- Badge includes icon (✨) and explanatory text
- Apply form is conditionally hidden when `gig.isExample === true` AND user is SPECIALIST
- Informational message replaces apply form for example gigs (SPECIALIST view)
- Message explains purpose of example gigs and encourages learning from them
- All existing gig detail functionality remains unchanged for real gigs
- Example gigs display all structured requirement fields (goal, deliverables, constraints, acceptance criteria)
