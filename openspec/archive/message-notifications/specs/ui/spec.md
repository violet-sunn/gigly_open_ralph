# UI Specification Delta: Message Notifications

## ADDED Requirements

### Requirement: Notification Bell in Navigation
The system MUST display a notification bell icon in the navigation header that shows unread message count and opens a dropdown.

#### Scenario: Bell icon renders in navigation
- GIVEN an authenticated user (CLIENT or SPECIALIST)
- WHEN they view any page with the navigation header
- THEN the navigation MUST display a bell icon (🔔 or SVG icon)
- AND the bell icon MUST be positioned in the top-right area of the navigation
- AND the bell icon MUST be clickable

#### Scenario: Bell shows unread count badge
- GIVEN an authenticated user with unread messages on 3 gigs
- WHEN they view the navigation
- THEN the bell icon MUST display a badge with the number "3"
- AND the badge MUST be visually prominent (red or blue background, white text)
- AND the badge MUST be positioned at the top-right of the bell icon

#### Scenario: Bell shows no badge when no unread messages
- GIVEN an authenticated user with zero unread messages
- WHEN they view the navigation
- THEN the bell icon MUST be displayed
- AND the bell icon MUST NOT display a badge
- AND the bell icon MUST appear in a neutral/inactive state

#### Scenario: Bell badge updates after reading messages
- GIVEN an authenticated user with 3 unread message notifications
- WHEN they visit a gig page and mark messages as read
- AND they navigate back to the dashboard
- THEN the bell badge MUST show "2" (updated count)

#### Scenario: Clicking bell opens dropdown
- GIVEN an authenticated user
- WHEN they click the bell icon
- THEN a dropdown menu MUST appear below the bell icon
- AND the dropdown MUST overlay other page content
- AND the dropdown MUST be positioned relative to the bell icon

#### Scenario: Clicking bell again closes dropdown
- GIVEN the notification dropdown is open
- WHEN the user clicks the bell icon again
- THEN the dropdown MUST close
- AND the bell icon MUST return to its default state

#### Scenario: Clicking outside dropdown closes it
- GIVEN the notification dropdown is open
- WHEN the user clicks anywhere outside the dropdown
- THEN the dropdown MUST close

**Acceptance Criteria:**
- Bell icon component is a client component (uses useState for dropdown open/close)
- Bell icon is visible on all authenticated pages
- Badge displays unread count when > 0
- Badge is hidden when count = 0
- Dropdown opens/closes on bell click
- Dropdown closes on outside click (useEffect with click listener)
- Bell icon is accessible (keyboard navigation, ARIA labels)

---

### Requirement: Notification Dropdown Content
The notification dropdown MUST display a list of gigs with unread messages and allow navigation to those gigs.

#### Scenario: Dropdown shows list of gigs with unread messages
- GIVEN an authenticated user with unread messages on 3 gigs
- WHEN they open the notification dropdown
- THEN the dropdown MUST display a list of 3 notification items
- AND each item MUST show:
  - Gig title (truncated if too long)
  - Sender name (client company name or specialist display name)
  - Time of last message (relative time: "2 minutes ago", "1 hour ago", "yesterday")
  - Unread indicator (dot or badge)

#### Scenario: Dropdown shows empty state
- GIVEN an authenticated user with zero unread messages
- WHEN they open the notification dropdown
- THEN the dropdown MUST display "No new messages"
- AND the dropdown MUST show a friendly icon or illustration
- AND the dropdown MUST NOT show an empty list

#### Scenario: Clicking notification navigates to gig
- GIVEN the notification dropdown is open
- AND the dropdown shows a notification for gig ID "abc123"
- WHEN the user clicks on that notification item
- THEN the browser MUST navigate to `/dashboard/gigs/abc123`
- AND the dropdown MUST close
- AND the notification MUST be marked as read (handled by gig page load)

#### Scenario: Dropdown shows most recent notifications first
- GIVEN an authenticated user with unread messages on multiple gigs
- WHEN they open the notification dropdown
- THEN notifications MUST be sorted by most recent message first (descending createdAt)
- AND the most recent notification MUST appear at the top of the list

#### Scenario: Dropdown limits number of notifications shown
- GIVEN an authenticated user with unread messages on 20 gigs
- WHEN they open the notification dropdown
- THEN the dropdown MUST display the 10 most recent notifications
- AND the dropdown MUST show a "View all" link at the bottom (optional for MVP)

#### Scenario: Dropdown shows loading state
- GIVEN an authenticated user clicks the bell icon
- WHEN the notification data is being fetched
- THEN the dropdown MUST display a loading spinner or skeleton
- AND the dropdown MUST NOT show stale data

#### Scenario: Dropdown handles fetch errors gracefully
- GIVEN an authenticated user clicks the bell icon
- WHEN the notification fetch fails
- THEN the dropdown MUST display "Failed to load notifications"
- AND the dropdown MUST show a "Retry" button

**Acceptance Criteria:**
- Dropdown component fetches notifications via server action or API route
- Dropdown displays list of gigs with unread messages
- Each notification item is clickable and navigates to gig detail page
- Empty state displays when no unread messages
- Notifications sorted by most recent message first
- Loading state displays while fetching
- Error state displays on fetch failure
- Dropdown is accessible (keyboard navigation, ARIA roles)

---

### Requirement: Notification Badge Calculation
The system MUST calculate the unread message count accurately and efficiently.

#### Scenario: Count includes only gigs where user is participant
- GIVEN a SPECIALIST user who is assigned to 2 gigs and has applied to 5 other gigs
- AND the 2 assigned gigs have unread messages
- WHEN the unread count is calculated
- THEN the count MUST be 2 (only assigned gigs)
- AND the count MUST NOT include gigs where the user only applied

#### Scenario: Count includes only gigs with messages after lastReadAt
- GIVEN a user has a notification record for gig "abc123" with lastReadAt = "2026-02-20 10:00"
- AND the gig has 3 messages: one at 09:00, one at 10:30, one at 11:00
- WHEN the unread count is calculated
- THEN the count MUST include this gig (2 messages after lastReadAt)

#### Scenario: Count includes gigs with no notification record
- GIVEN a user is assigned to gig "xyz789"
- AND the gig has 2 messages
- AND no Notification record exists for this user-gig pair
- WHEN the unread count is calculated
- THEN the count MUST include this gig (never read = unread)

#### Scenario: Count excludes gigs where user is the only sender
- GIVEN a user has sent 3 messages on gig "abc123"
- AND no other user has sent messages on this gig
- WHEN the unread count is calculated
- THEN the count MUST NOT include this gig (no messages from others)

#### Scenario: Count excludes closed gigs
- GIVEN a gig with closedByAdmin = true
- AND the gig has unread messages
- WHEN the unread count is calculated
- THEN the count MUST NOT include this gig

**Acceptance Criteria:**
- Unread count query is efficient (< 100ms for 1000+ messages)
- Count only includes gigs where user is owner OR assigned specialist
- Count only includes gigs with messages from other users (not just own messages)
- Count excludes closed gigs
- Count calculation uses proper indexes (userId, gigId, createdAt)

---

### Requirement: Mark Notifications as Read on Gig Visit
The gig detail page MUST automatically mark notifications as read when the user visits the page.

#### Scenario: Visiting gig marks notification as read
- GIVEN an authenticated user with unread messages on gig "abc123"
- WHEN they navigate to `/dashboard/gigs/abc123`
- THEN the Notification record for this user-gig pair MUST be updated
- AND `lastReadAt` MUST be set to the current timestamp
- AND the unread count badge MUST decrease by 1 (on next page load)

#### Scenario: Visiting gig creates notification record if none exists
- GIVEN an authenticated user visits gig "abc123" for the first time
- AND no Notification record exists for this user-gig pair
- WHEN they navigate to `/dashboard/gigs/abc123`
- THEN a Notification record MUST be created
- AND `lastReadAt` MUST be set to the current timestamp

#### Scenario: Mark as read only for authorized users
- GIVEN a SPECIALIST user who is NOT assigned to gig "abc123"
- WHEN they navigate to `/dashboard/gigs/abc123`
- THEN no Notification record MUST be created or updated
- AND the user MUST NOT be able to mark messages as read

#### Scenario: Mark as read is idempotent
- GIVEN a user visits gig "abc123" multiple times
- WHEN they navigate to `/dashboard/gigs/abc123` again
- THEN the `lastReadAt` timestamp MUST be updated to the latest visit time
- AND no duplicate Notification records MUST be created

**Acceptance Criteria:**
- Gig detail page calls `markNotificationAsRead` server action on page load
- Server action updates or creates Notification record with current timestamp
- Server action only executes for authorized users (gig owner or assigned specialist)
- Server action uses upsert operation (create if not exists, update if exists)
- Mark as read operation is fast (< 50ms)
