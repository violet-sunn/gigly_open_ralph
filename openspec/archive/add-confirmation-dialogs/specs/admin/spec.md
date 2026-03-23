# Admin Specification Delta: Moderation Action Confirmations

## MODIFIED Requirements

### Requirement: Close Gig UI with Confirmation
The Close Gig button MUST trigger a confirmation dialog before executing the closeGig server action.

#### Scenario: Clicking Close Gig opens confirmation dialog
- GIVEN an ADMIN viewing a gig on the admin gig management page
- WHEN they click the "Close Gig" button
- THEN a confirmation dialog MUST appear
- AND the dialog title MUST be "Close Gig"
- AND the dialog message MUST explain: "This will close the gig and prevent new applications. The gig owner and assigned specialist (if any) will no longer be able to interact with this gig. This action is logged."
- AND the closeGig action MUST NOT execute yet

#### Scenario: Confirming close executes action
- GIVEN an ADMIN with open close gig confirmation dialog
- WHEN they click "Confirm" in the dialog
- THEN the closeGig server action MUST be called
- AND the dialog MUST close
- AND the gig closedByAdmin field MUST be set to true
- AND a ModerationLog entry MUST be created

#### Scenario: Canceling close closes dialog without action
- GIVEN an ADMIN with open close gig confirmation dialog
- WHEN they click "Cancel" in the dialog
- THEN the closeGig server action MUST NOT be called
- AND the dialog MUST close
- AND the gig closedByAdmin field MUST remain unchanged

**Acceptance Criteria:**
- Close Gig button opens ConfirmDialog before calling closeGig server action
- Dialog message clearly explains consequences (prevents applications, logs action)
- Confirmation required before server action executes
- Cancel button prevents action execution
- Existing closeGig server action logic unchanged (transaction, moderation log)

---

### Requirement: Suspend User UI with Confirmation
The Suspend User button MUST trigger a confirmation dialog before executing the suspendUser server action.

#### Scenario: Clicking Suspend User opens confirmation dialog
- GIVEN an ADMIN viewing a user on the admin user management page
- WHEN they click the "Suspend" button
- THEN a confirmation dialog MUST appear
- AND the dialog title MUST be "Suspend User"
- AND the dialog message MUST explain: "This will suspend the user's account and prevent them from logging in. All their active gigs and applications will remain visible but they cannot create new ones. This action is logged."
- AND the suspendUser action MUST NOT execute yet

#### Scenario: Confirming suspension executes action
- GIVEN an ADMIN with open suspend user confirmation dialog
- WHEN they click "Confirm" in the dialog
- THEN the suspendUser server action MUST be called
- AND the dialog MUST close
- AND the user suspended field MUST be set to true
- AND a ModerationLog entry MUST be created

#### Scenario: Canceling suspension closes dialog without action
- GIVEN an ADMIN with open suspend user confirmation dialog
- WHEN they click "Cancel" in the dialog
- THEN the suspendUser server action MUST NOT be called
- AND the dialog MUST close
- AND the user suspended field MUST remain unchanged

**Acceptance Criteria:**
- Suspend User button opens ConfirmDialog before calling suspendUser server action
- Dialog message clearly explains consequences (prevents login, logs action)
- Confirmation required before server action executes
- Cancel button prevents action execution
- Existing suspendUser server action logic unchanged (transaction, moderation log)

---

### Requirement: Unsuspend User UI with Confirmation
The Unsuspend User button SHOULD trigger a confirmation dialog before executing the unsuspendUser server action for consistency.

#### Scenario: Clicking Unsuspend User opens confirmation dialog
- GIVEN an ADMIN viewing a suspended user on the admin user management page
- WHEN they click the "Unsuspend" button
- THEN a confirmation dialog MUST appear
- AND the dialog title MUST be "Unsuspend User"
- AND the dialog message MUST explain: "This will restore the user's account access and allow them to log in again. This action is logged."
- AND the unsuspendUser action MUST NOT execute yet

#### Scenario: Confirming unsuspension executes action
- GIVEN an ADMIN with open unsuspend user confirmation dialog
- WHEN they click "Confirm" in the dialog
- THEN the unsuspendUser server action MUST be called
- AND the dialog MUST close
- AND the user suspended field MUST be set to false
- AND a ModerationLog entry MUST be created

#### Scenario: Canceling unsuspension closes dialog without action
- GIVEN an ADMIN with open unsuspend user confirmation dialog
- WHEN they click "Cancel" in the dialog
- THEN the unsuspendUser server action MUST NOT be called
- AND the dialog MUST close
- AND the user suspended field MUST remain unchanged

**Acceptance Criteria:**
- Unsuspend User button opens ConfirmDialog before calling unsuspendUser server action
- Dialog message clearly explains consequences (restores access, logs action)
- Confirmation required before server action executes
- Cancel button prevents action execution
- Existing unsuspendUser server action logic unchanged
