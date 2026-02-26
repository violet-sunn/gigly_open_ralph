# UI Specification - Dashboard Messages and Profile Edit Improvements

## MODIFIED Requirements

### Requirement: Dashboard Sidebar Messages Section
The dashboard sidebar MUST display recent messages from gigs where the user is involved, replacing the current placeholder.

#### Scenario: Messages section displays last message per gig
- GIVEN an authenticated user (CLIENT or SPECIALIST) with messages on multiple gigs they're involved in
- WHEN they view the dashboard page
- THEN the "СООБЩЕНИЯ" (Messages) section in the sidebar MUST display the most recent message from each distinct gig
- AND each message item MUST show:
  - Gig title
  - Sender name (display name or email)
  - Message preview (first 50 characters with ellipsis if truncated)
  - Relative timestamp (e.g., "2 hours ago", "3 days ago")
- AND gigs MUST be sorted by most recent message timestamp (gigs with newest activity first)
- AND the section MUST be scrollable to show all gigs with messages (no hard limit)
- AND only ONE message per gig MUST be displayed (the most recent one)

#### Scenario: Message items are clickable and navigate to messages section
- GIVEN the messages section displays message items from multiple gigs
- WHEN the user clicks on a message item
- THEN the browser MUST navigate to `/gigs/[gigId]#messages` for that message's gig
- AND the page MUST automatically scroll to the messages section
- AND the navigation MUST preserve the current context
- AND the gig title MUST be clearly visible in the message item to provide context

#### Scenario: Empty state when no messages
- GIVEN an authenticated user with no messages on any gigs
- WHEN they view the dashboard
- THEN the messages section MUST display "No recent messages"
- AND the section MUST show a friendly icon or illustration

#### Scenario: Messages only from involved gigs
- GIVEN an authenticated CLIENT user
- WHEN the messages section queries for messages
- THEN it MUST only include messages from gigs where the user is the owner
- AND it MUST only include gigs with an assigned specialist (messages are only available after assignment)

#### Scenario: Messages only from involved gigs (SPECIALIST)
- GIVEN an authenticated SPECIALIST user
- WHEN the messages section queries for messages
- THEN it MUST only include messages from gigs where the user is the assigned specialist

#### Scenario: Performance optimization
- GIVEN the dashboard page loads
- WHEN the messages section queries the database
- THEN the query MUST use proper indexes (gigId, createdAt)
- AND the query MUST fetch only the most recent message per gig (not all messages)
- AND the query MUST include only necessary fields (no full gig data)
- AND the query execution time MUST be < 200ms even with many gigs

**Acceptance Criteria:**
- New server action `getRecentMessages` created in `app/actions/message.ts`
- Server action returns array of objects with: `{ gigId, gigTitle, senderName, contentPreview, createdAt }`
- Each object represents the most recent message from a distinct gig
- Query fetches all gigs where user is involved (owner or assigned specialist)
- For each gig, only the most recent message is included
- Results sorted by message timestamp (most recent first)
- Dashboard page calls `getRecentMessages` and passes data to Messages card component
- Messages card component displays list of clickable message items
- Each message item shows: gig title (bold), sender name, content preview, relative timestamp
- Each message item links to `/gigs/[gigId]#messages` (with hash fragment for auto-scroll)
- Gig detail page messages section has `id="messages"` attribute for hash navigation
- Empty state displays when no messages
- Messages section uses `max-h-80 overflow-y-auto` for scrolling (no hard limit on number of gigs)
- Query uses Prisma with proper relations and ordering
- Query includes sender relation with `select` for name fields only
- All existing dashboard functionality remains intact

---

### Requirement: Profile Edit Page Layout Consistency
The profile edit page MUST match the visual layout and structure of the profile view page to provide a consistent user experience.

#### Scenario: Edit page uses same header card structure
- GIVEN an authenticated user navigates to `/profile/edit`
- WHEN the page renders
- THEN the page MUST display a header card at the top
- AND the header card MUST include:
  - Avatar circle with user initial (read-only, same as profile view)
  - User name or email
  - Role label (e.g., "Specialist" or "Client")
- AND the header card MUST use the same styling as profile view: `bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md`

#### Scenario: Edit form uses 2-column grid layout
- GIVEN an authenticated SPECIALIST user on `/profile/edit`
- WHEN the page renders below the header card
- THEN the form MUST use a 2-column grid layout: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- AND the left column MUST contain: Display Name, Tech Stack, Experience Level fields
- AND the right column MUST contain: Bio field (full height textarea)
- AND both columns MUST use card styling: `bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md`

#### Scenario: Edit form uses 2-column grid layout (CLIENT)
- GIVEN an authenticated CLIENT user on `/profile/edit`
- WHEN the page renders below the header card
- THEN the form MUST use a 2-column grid layout: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- AND the left column MUST contain: Company Name, INN, KPP fields
- AND the right column MUST contain: Contact Person, Phone Number fields
- AND both columns MUST use card styling: `bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md`

#### Scenario: Form fields maintain existing validation
- GIVEN a user fills out the profile edit form
- WHEN they submit the form
- THEN all existing validation rules MUST still apply
- AND required fields MUST still be enforced (companyName, inn for CLIENT; no required fields for SPECIALIST)
- AND the `updateProfile` server action MUST remain unchanged
- AND error messages MUST display in the same manner

#### Scenario: Save and Cancel buttons positioned consistently
- GIVEN a user is on the profile edit page
- WHEN they view the form
- THEN the Save and Cancel buttons MUST be positioned at the bottom of the form
- AND the buttons MUST be outside the grid columns (full width row)
- AND the Save button MUST use primary styling: `bg-blue-500 hover:bg-blue-600`
- AND the Cancel button MUST link to `/profile`

#### Scenario: Responsive behavior on mobile
- GIVEN a user views the profile edit page on a mobile device (< 1024px width)
- WHEN the page renders
- THEN the 2-column grid MUST stack vertically (single column)
- AND the header card MUST remain at the top
- AND all form fields MUST remain fully functional
- AND the layout MUST match the profile view page's mobile behavior

#### Scenario: Visual consistency with profile view
- GIVEN a user navigates between `/profile` and `/profile/edit`
- WHEN they compare the two pages
- THEN the header card structure MUST be visually identical (avatar, name, role)
- AND the card styling MUST be identical (colors, borders, shadows, spacing)
- AND the overall page layout MUST feel like the same design system
- AND the transition between view and edit MUST feel smooth and natural

**Acceptance Criteria:**
- Profile edit page uses `max-w-7xl mx-auto px-4` container (same as profile view)
- Header card component created or inline implementation with avatar, name, role
- Form uses 2-column grid layout with proper responsive breakpoints
- Left and right columns wrapped in card containers with consistent styling
- All existing form fields preserved with same names and validation
- Save/Cancel buttons positioned below grid in full-width row
- Mobile layout stacks columns vertically
- No changes to `updateProfile` server action
- All existing profile edit tests continue to pass
- Visual regression testing confirms consistency with profile view page

---

## ADDED Requirements

None. All changes are modifications to existing requirements.

---

## REMOVED Requirements

None. All existing functionality is preserved.
