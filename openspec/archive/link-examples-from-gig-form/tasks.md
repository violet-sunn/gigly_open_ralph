# Implementation Tasks

## Task 1: Add example link to gig creation form

**Implementation:**
- Open `app/dashboard/gigs/new/page.tsx`
- Locate the "Requirements & Success Criteria" section header
- Modify the section header to use flex layout with heading on left and link on right
- Add link element with:
  - href="/dashboard/gigs"
  - target="_blank"
  - rel="noopener noreferrer"
  - className="text-sm text-indigo-600 hover:text-indigo-800 underline"
  - Text: "💡 View example gigs for inspiration"

**Test Plan:**
1. Navigate to `/dashboard/gigs/new` as a CLIENT user
2. Verify the "Requirements & Success Criteria" section header displays the link on the right side
3. Verify the link text is "💡 View example gigs for inspiration"
4. Verify the link styling matches specification (small text, indigo color, underlined)
5. Click the link and verify it opens `/dashboard/gigs` in a new tab
6. Verify form state is preserved when returning to the original tab
7. Fill out form partially, click link, return, verify data is still there
8. Test keyboard navigation: Tab to link, press Enter, verify new tab opens
9. Test on mobile viewport (320px width): verify link is visible and tappable
10. Submit form after clicking link, verify submission works normally
11. Verify all existing form functionality (character counters, quality warnings, fee preview) still works

**Acceptance Criteria:**
- Link renders in section header with correct text and styling
- Link opens in new tab with security attributes
- Form state is preserved (natural browser behavior)
- Link is keyboard and screen reader accessible
- Link works on mobile devices
- No existing functionality is broken
