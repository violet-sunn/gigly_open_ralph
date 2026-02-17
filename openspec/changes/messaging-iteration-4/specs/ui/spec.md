# UI Specification Delta: messaging-iteration-4

## MODIFIED Requirements

### Requirement: Message List Display with Sender Distinction

The system MUST display messages with visual distinction between client and specialist senders.

#### Scenario: Display client message
- GIVEN a message sent by a CLIENT user
- WHEN the message list is rendered
- THEN the message MUST be displayed with:
  - Left alignment
  - Blue accent styling (e.g., blue border-left or background tint)
  - Sender name from clientProfile.companyName or email
  - Timestamp in 'ru-RU' locale format

#### Scenario: Display specialist message
- GIVEN a message sent by a SPECIALIST user
- WHEN the message list is rendered
- THEN the message MUST be displayed with:
  - Right alignment
  - Green or purple accent styling (e.g., green border-left or background tint)
  - Sender name from specialistProfile.displayName or email
  - Timestamp in 'ru-RU' locale format

#### Scenario: Display message with current user as sender
- GIVEN a message sent by the currently logged-in user
- WHEN the message list is rendered
- THEN the message MUST be visually distinguished as "own message" (e.g., different alignment or accent color)

**Acceptance Criteria:**
- MessageList component in `app/dashboard/gigs/[id]/message-list.tsx` MUST accept currentUserId prop
- Visual distinction MUST be achieved through Tailwind CSS classes only (no custom CSS)
- Layout MUST remain simple (no chat bubbles or complex UI)
- Sender role MUST be determined from message.sender.role or by comparing senderId with gig.clientId
- All existing message data (sender name, timestamp, content) MUST still be displayed

---

### Requirement: Edge Case Messaging Display

The system MUST show context-aware messages when messaging is unavailable.

#### Scenario: No specialist assigned yet (OPEN gig)
- GIVEN a gig with status "OPEN" and assignedSpecialistId = null
- WHEN the gig detail page is rendered for the gig owner
- THEN the messaging section MUST display:
  - A message stating "Messaging will be available once a specialist is assigned to this gig."
  - No message input form
  - Clear visual indication this is informational, not an error

#### Scenario: No messages yet but specialist assigned
- GIVEN a gig with assignedSpecialistId !== null
- AND the messages array is empty
- WHEN the message list is rendered
- THEN it MUST display: "No messages yet. Start the conversation below."

#### Scenario: Gig closed by admin
- GIVEN a gig with closedByAdmin = true
- WHEN an authorized user attempts to view the messaging section
- THEN the messaging section SHOULD still display existing messages
- AND the message form SHOULD be hidden or disabled
- AND a notice SHOULD indicate the gig is closed

**Acceptance Criteria:**
- Page component in `app/dashboard/gigs/[id]/page.tsx` MUST conditionally render messaging section based on assignedSpecialistId
- When assignedSpecialistId is null, show informational message instead of MessageList + MessageForm
- When assignedSpecialistId exists but no messages, MessageList shows "No messages yet" (already implemented)
- Closed gigs MUST prevent message sending (already enforced by backend)

---

### Requirement: Message Form Whitespace Validation

The system MUST prevent submission of whitespace-only messages at the client side.

#### Scenario: User submits whitespace-only message
- GIVEN a user types only spaces, tabs, or newlines in the message textarea
- WHEN the form is submitted
- THEN the browser MUST prevent submission (HTML5 validation)
- OR the form MUST show immediate validation feedback

#### Scenario: User submits message with leading/trailing whitespace
- GIVEN a user types a message with leading or trailing whitespace
- WHEN the form is submitted
- THEN the message MUST be trimmed by the backend (already implemented)
- AND the trimmed message MUST be stored and displayed

**Acceptance Criteria:**
- MessageForm textarea MUST have `required` attribute (already implemented)
- Consider adding `pattern` attribute or client-side validation to prevent whitespace-only input
- Backend trimming MUST remain in place (already implemented in sendMessage action)
- Empty messages after trimming MUST return error from backend (already implemented)

---

## ADDED Requirements

### Requirement: Messaging Availability Across Gig Statuses

The system MUST allow messaging in all gig statuses where a specialist is assigned, except when closed by admin.

#### Scenario: Messaging in IN_PROGRESS status
- GIVEN a gig with status "IN_PROGRESS" and assignedSpecialistId !== null
- WHEN the gig owner or assigned specialist views the gig detail page
- THEN the messaging section MUST be fully functional

#### Scenario: Messaging in REVIEW status
- GIVEN a gig with status "REVIEW" and assignedSpecialistId !== null
- WHEN the gig owner or assigned specialist views the gig detail page
- THEN the messaging section MUST be fully functional

#### Scenario: Messaging in COMPLETED status
- GIVEN a gig with status "COMPLETED" and assignedSpecialistId !== null
- WHEN the gig owner or assigned specialist views the gig detail page
- THEN the messaging section MUST be fully functional (for post-completion discussion)

#### Scenario: Messaging in PAID status
- GIVEN a gig with status "PAID" and assignedSpecialistId !== null
- WHEN the gig owner or assigned specialist views the gig detail page
- THEN the messaging section MUST be fully functional (for follow-up)

#### Scenario: Messaging blocked on closed gig
- GIVEN a gig with closedByAdmin = true
- WHEN an authorized user attempts to send a message
- THEN the backend MUST return error: "Cannot send messages to a closed gig." (already implemented)
- AND the UI SHOULD provide appropriate feedback

**Acceptance Criteria:**
- Messaging availability MUST depend only on: (1) assignedSpecialistId !== null, (2) closedByAdmin = false, (3) user is owner or assigned specialist
- Gig status (OPEN/IN_PROGRESS/REVIEW/COMPLETED/PAID) MUST NOT affect messaging availability (except OPEN has no specialist)
- Test plan MUST verify messaging works in all applicable statuses
