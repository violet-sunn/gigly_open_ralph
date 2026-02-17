# Gig Specification Delta: messaging-iteration-2

## ADDED Requirements

### Requirement: Send Message Server Action
The system MUST provide a `sendMessage` server action that creates a message within a gig context.

#### Scenario: Successful message send by gig owner
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig has an assigned specialist (assignedSpecialistId is not null)
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created with:
  - `gigId` = provided gig ID
  - `senderId` = session userId
  - `content` = provided message text
  - `createdAt` = current timestamp (auto-generated)
- AND the action MUST revalidate the gig detail page path
- AND the action MUST return success (no error)

#### Scenario: Successful message send by assigned specialist
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig has an assigned specialist
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created
- AND the action MUST revalidate the gig detail page path
- AND the action MUST return success (no error)

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
- Access control checks: user is gig owner OR assigned specialist
- Content validation: non-empty after trimming
- On success: calls `revalidatePath(\`/dashboard/gigs/${gigId}\`)` and returns `{ error: undefined }`
- On failure: returns `{ error: string }`
- Uses Prisma transaction if needed for consistency

---

## MODIFIED Requirements

None. This change adds new functionality without modifying existing requirements.

---

## REMOVED Requirements

None. This change is purely additive.
