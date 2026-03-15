# UI Spec Delta — fix-failing-tests-alignment

## MODIFIED Requirements

### Requirement: Gig Routes Are Canonical Under /gigs
The application SHALL treat gig-related pages as routes under `/gigs`.

#### Scenario: Client navigates to gig creation
- GIVEN an authenticated user with role "CLIENT"
- WHEN the user clicks the primary CTA to create a gig
- THEN the user MUST be navigated to `/gigs/new`

#### Scenario: Specialist navigates to browse gigs
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN the user clicks "Browse Gigs"
- THEN the user MUST be navigated to `/gigs`

#### Scenario: User navigates to gig detail
- GIVEN an authenticated user is allowed to view a gig
- WHEN the user clicks a gig list item
- THEN the user MUST be navigated to `/gigs/[id]`

**Acceptance Criteria:**
- OpenSpec UI requirements for gig pages use `/gigs` as the canonical route prefix.
- Tests asserting navigation to gig pages use `/gigs` routes.
- Any legacy references to `/dashboard/gigs` in active UI requirements are either:
  - updated to `/gigs`, OR
  - explicitly documented as supported aliases (non-goal unless already implemented).

## ADDED Requirements

None.

## REMOVED Requirements

None.
