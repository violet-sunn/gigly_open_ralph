# UI Spec Delta — client-gig-detail-link

## MODIFIED Requirements

### Requirement: Role-Based Dashboard (Client view — My Gigs list)

The "My Gigs" section on the Client Dashboard MUST link each gig to its detail page.

#### Scenario: Client clicks a gig in "My Gigs"
- GIVEN a CLIENT user is on `/dashboard`
- AND the "My Gigs" section lists at least one gig
- WHEN the client clicks on a gig item
- THEN the browser MUST navigate to `/dashboard/gigs/{gig.id}`

#### Scenario: Gig list item shows clickable affordance
- GIVEN a CLIENT user is on `/dashboard`
- AND the "My Gigs" section lists at least one gig
- WHEN the user hovers over a gig item
- THEN the item MUST visually indicate it is clickable (e.g., background color change or cursor pointer)

**Acceptance Criteria:**
- Each `<li>` in the "My Gigs" list MUST contain a `<Link href="/dashboard/gigs/{gig.id}">` wrapping the gig content
- The link MUST use Next.js `Link` component (already imported in the file)
- The link MUST apply a hover style (e.g., `hover:bg-gray-50`) for visual feedback
- The link MUST be rendered as a block-level element so the entire row is clickable
- Existing gig information (title, status badge, budget, application count, date, assigned specialist) MUST remain visible and unchanged
