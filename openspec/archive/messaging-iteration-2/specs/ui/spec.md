# UI Specification Delta: messaging-iteration-2

## ADDED Requirements

### Requirement: Message Display on Gig Detail Page
The gig detail page MUST display messages in chronological order when the user is authorized to view them.

#### Scenario: CLIENT owner views gig with messages
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig has an assigned specialist (assignedSpecialistId is not null)
- AND the gig has at least one message
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display a "Messages" section
- AND messages MUST be displayed in chronological order (oldest first, ordered by createdAt ASC)
- AND each message MUST show:
  - Sender name (email or specialistProfile.displayName / clientProfile.companyName if available)
  - Message content (plain text)
  - Timestamp (formatted as locale date/time string)
- AND the page MUST display a message composition form below the message list

#### Scenario: Assigned SPECIALIST views gig with messages
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig has at least one message
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display a "Messages" section
- AND messages MUST be displayed in chronological order (oldest first)
- AND each message MUST show sender name, content, and timestamp
- AND the page MUST display a message composition form below the message list

#### Scenario: Non-assigned SPECIALIST views gig
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is NOT the assigned specialist (applied but was rejected)
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST NOT display the "Messages" section
- AND the page MUST NOT display the message composition form

#### Scenario: Gig with no assigned specialist
- GIVEN a gig with status "OPEN" (no assigned specialist)
- WHEN an authorized user views the gig detail page
- THEN the page MUST NOT display the "Messages" section
- AND the page MUST NOT display the message composition form

#### Scenario: Gig with assigned specialist but no messages yet
- GIVEN a gig with an assigned specialist
- AND the gig has zero messages
- WHEN an authorized user views the gig detail page
- THEN the page MUST display a "Messages" section
- AND it MUST show "No messages yet. Start the conversation below."
- AND the page MUST display the message composition form

#### Scenario: Message sender identification
- GIVEN a message sent by a CLIENT user
- WHEN the message is displayed
- THEN the sender name MUST be the client's email
- AND if clientProfile.companyName exists, it MUST be displayed instead of or alongside email

#### Scenario: Message sender identification for SPECIALIST
- GIVEN a message sent by a SPECIALIST user
- WHEN the message is displayed
- THEN the sender name MUST be the specialist's email
- AND if specialistProfile.displayName exists, it MUST be displayed instead of email

#### Scenario: Message timestamp formatting
- GIVEN a message with createdAt timestamp
- WHEN the message is displayed
- THEN the timestamp MUST be formatted as a locale date/time string (e.g., "17.02.2026, 14:30")
- AND the timestamp MUST use 'ru-RU' locale for consistency with the rest of the app

**Acceptance Criteria:**
- Gig detail page queries messages with `include: { messages: { include: { sender: { include: { clientProfile: true, specialistProfile: true } } }, orderBy: { createdAt: 'asc' } } }`
- Messages section only visible when user is owner OR assigned specialist
- Messages section only visible when gig has assigned specialist
- Messages displayed in chronological order (oldest first)
- Each message shows sender name, content, and formatted timestamp
- Empty state message when no messages exist
- Message list uses simple `<ul>` or `<div>` rendering (no complex chat UI)

---

### Requirement: Message Composition Form
The gig detail page MUST provide a form for authorized users to send messages.

#### Scenario: Form renders for authorized users
- GIVEN an authenticated user who is the gig owner OR assigned specialist
- AND the gig has an assigned specialist
- WHEN they view the gig detail page
- THEN the page MUST display a message composition form with:
  - A textarea for message content (required, placeholder text)
  - A "Send Message" submit button
  - The form MUST be below the message list

#### Scenario: Form shows loading state
- GIVEN an authorized user submits the message form
- WHEN the server action is processing
- THEN the submit button MUST show "Sending..." text
- AND the button MUST be disabled
- AND the textarea MUST be disabled

#### Scenario: Form shows error
- GIVEN an authorized user submits invalid data (e.g., empty message)
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline above the form
- AND the form MUST remain visible so the user can retry

#### Scenario: Form clears after successful send
- GIVEN an authorized user submits a valid message
- WHEN the server action succeeds
- THEN the textarea MUST be cleared (empty)
- AND the page MUST revalidate to show the new message in the list
- AND no error message MUST be displayed

#### Scenario: Form does not render for unauthorized users
- GIVEN an authenticated user who is NOT the gig owner AND NOT the assigned specialist
- WHEN they view the gig detail page
- THEN the message composition form MUST NOT be displayed

#### Scenario: Form does not render when no specialist assigned
- GIVEN a gig with status "OPEN" (no assigned specialist)
- WHEN any user views the gig detail page
- THEN the message composition form MUST NOT be displayed

**Acceptance Criteria:**
- Message form is a client component using `useActionState` with `sendMessage` action
- Uses `useFormStatus` for pending state on submit button
- Textarea has `name="content"`, `required`, `rows={3}`, and placeholder text
- Hidden input field for `gigId`
- Displays `state?.error` when present
- Form only renders when user is authorized (owner OR assigned specialist) AND gig has assigned specialist
- On successful send, form resets via `useEffect` or form.reset()

---

## MODIFIED Requirements

### Requirement: Gig Detail Page (MODIFIED)
The gig detail page specification is extended to include message display and composition.

#### Changes:
- ADD: Messages section displaying chronological message list
- ADD: Message composition form for authorized users
- ADD: Access control logic for message visibility
- ADD: Query includes messages with sender relations

**Acceptance Criteria:**
- All existing gig detail page functionality remains unchanged
- Messages section is added as a new section on the page
- Messages section is positioned logically (e.g., after applications section or before footer)
- Page layout remains responsive and accessible

---

## REMOVED Requirements

None. This change is purely additive.
