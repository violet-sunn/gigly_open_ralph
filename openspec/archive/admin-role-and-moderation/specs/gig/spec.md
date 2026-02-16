# Gig Specification - Admin Role & Moderation Changes

## MODIFIED Requirements

### Requirement: Apply to Gig Server Action

**ADDED Scenario: Applying to admin-closed gig**
- GIVEN a gig with `closedByAdmin = true`
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'This gig has been closed by administrators.' }`
- AND no Application record MUST be created

**Acceptance Criteria:**
- `applyToGig` checks `gig.closedByAdmin` field after fetching the gig
- Closed gigs are rejected before status check (OPEN)
- Error message clearly indicates admin closure
- On success: redirects to `/dashboard/gigs/{gigId}`
- On failure: returns `{ error: string }`

---

## ADDED Requirements

### Requirement: Gig Closure by Admin
The system MUST prevent any lifecycle progression for gigs closed by administrators.

#### Scenario: Closed gig cannot accept applications
- GIVEN a gig with `closedByAdmin = true`
- WHEN a SPECIALIST attempts to apply
- THEN the application MUST be rejected with an appropriate error message

#### Scenario: Closed gig display
- GIVEN a gig with `closedByAdmin = true`
- WHEN the gig is displayed on any page (browse, detail, dashboard)
- THEN it MUST show a "Closed by Admin" badge or indicator
- AND the apply button MUST NOT be shown to specialists

#### Scenario: Closed gig in listings
- GIVEN the gig browsing page at `/dashboard/gigs`
- WHEN a SPECIALIST views the page
- THEN closed gigs (closedByAdmin = true) SHOULD be filtered out by default
- OR clearly marked as closed if included

**Acceptance Criteria:**
- `closedByAdmin` field is checked in all gig lifecycle actions
- UI components conditionally render based on closure status
- Gig detail page shows closure information if applicable
- Browse page filters or marks closed gigs appropriately
