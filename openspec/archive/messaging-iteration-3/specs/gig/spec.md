# Gig Specification Delta: messaging-iteration-3

## MODIFIED Requirements

### Requirement: Send Message Server Action
The system MUST provide a `sendMessage` server action that creates a message within a gig context and redirects on success.

#### Scenario: Successful message send by gig owner
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig has an assigned specialist (assignedSpecialistId is not null)
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created with:
  - `gigId` = provided gig ID
  - `senderId` = session userId
  - `content` = provided message text (trimmed)
  - `createdAt` = current timestamp (auto-generated)
- AND the action MUST redirect to `/dashboard/gigs/{gigId}` to refresh the page
- AND the form MUST be reset (handled by redirect)

#### Scenario: Successful message send by assigned specialist
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig has an assigned specialist
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created
- AND the action MUST redirect to `/dashboard/gigs/{gigId}` to refresh the page

#### Scenario: Unauthenticated user attempts to send message
- GIVEN no valid session
- WHEN `sendMessage` is called
- THEN it MUST redirect to `/login`

#### Scenario: Unauthorized user attempts to send message
- GIVEN an authenticated user who is NOT the gig owner AND NOT the assigned specialist
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'You are not authorized to send messages on this gig.' }`
- AND no Message record MUST be created

#### Scenario: Send message to gig without assigned specialist
- GIVEN a gig with status "OPEN" (no assigned specialist)
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Cannot send messages until a specialist is assigned.' }`
- AND no Message record MUST be created

#### Scenario: Send message with empty content
- GIVEN an authorized user submits a message with empty or whitespace-only content
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Message content is required.' }`
- AND no Message record MUST be created

#### Scenario: Send message exceeding max length
- GIVEN an authorized user submits a message with content longer than 2000 characters
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Message is too long. Maximum 2000 characters allowed.' }`
- AND no Message record MUST be created

#### Scenario: Send message to non-existent gig
- GIVEN a gigId that does not exist
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

#### Scenario: Send message to closed gig
- GIVEN a gig with closedByAdmin = true
- WHEN `sendMessage` is called by an authorized user
- THEN it MUST return `{ error: 'Cannot send messages to a closed gig.' }`
- AND no Message record MUST be created

**Acceptance Criteria:**
- `sendMessage` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field) and `content` (textarea)
- Content validation:
  - Non-empty after trimming
  - Maximum 2000 characters (before trimming)
- Access control checks: user is gig owner OR assigned specialist
- Gig state checks: has assigned specialist, not closed by admin
- On success: calls `redirect(\`/dashboard/gigs/${gigId}\`)` (NOT revalidatePath)
- On failure: returns `{ error: string }`
- Content is trimmed before storage
