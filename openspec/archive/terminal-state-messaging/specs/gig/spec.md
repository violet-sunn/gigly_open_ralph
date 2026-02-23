# Gig Specification Delta: Terminal State Messaging

## MODIFIED Requirements

### Requirement: Send Message Server Action
The system MUST provide a `sendMessage` server action that creates a message within a gig context and redirects on success.

#### Scenario: Send message to PAID gig
- GIVEN a gig with status "PAID"
- WHEN `sendMessage` is called by an authorized user (gig owner or assigned specialist)
- THEN it MUST return `{ error: 'Cannot send messages to a paid gig.' }`
- AND no Message record MUST be created

**Acceptance Criteria:**
- `sendMessage` checks `gig.status === 'PAID'` AFTER authorization checks but BEFORE creating message
- Error message is clear and actionable
- Check happens alongside existing `closedByAdmin` check (both conditions disable messaging)
- Validation order: auth → rate limit → content validation → gig state (assigned specialist, not closed, not paid)

---

### Requirement: Gig Detail Page Messaging UI
The system MUST display messaging interface on gig detail pages with appropriate access controls and state-based visibility.

#### Scenario: Display messaging UI for PAID gig
- GIVEN a gig with status "PAID"
- AND the gig has an assigned specialist
- AND the user is authorized (gig owner or assigned specialist)
- WHEN the gig detail page is rendered
- THEN the MessageList component MUST be displayed (existing messages visible)
- AND the MessageForm component MUST NOT be displayed
- AND an explanatory message MUST be displayed: "This gig has been marked as paid. Messaging is no longer available."
- AND the explanatory message MUST use the same styling as the closedByAdmin message (gray background, border, padding)

#### Scenario: Display messaging UI for COMPLETED gig
- GIVEN a gig with status "COMPLETED" (not yet PAID)
- AND the gig has an assigned specialist
- AND the user is authorized
- WHEN the gig detail page is rendered
- THEN the MessageList component MUST be displayed
- AND the MessageForm component MUST be displayed (messaging still available)
- AND no explanatory message about disabled messaging MUST be shown

**Acceptance Criteria:**
- Messaging form visibility logic checks: `!gig.closedByAdmin && gig.status !== 'PAID'`
- Explanatory message for PAID status uses consistent styling with closedByAdmin message
- Message text is clear and final: "This gig has been marked as paid. Messaging is no longer available."
- Existing messages remain visible regardless of gig status
- Both `closedByAdmin` and `status === 'PAID'` conditions independently disable messaging
- UI conditional logic is placed in the same location as existing closedByAdmin check (after MessageList, before MessageForm)
