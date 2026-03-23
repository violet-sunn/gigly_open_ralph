# Gig Specification Delta: Application Action Confirmations

## MODIFIED Requirements

### Requirement: Reject Application UI with Confirmation
The Reject Application button MUST trigger a confirmation dialog before executing the rejectApplication server action.

#### Scenario: Clicking Reject Application opens confirmation dialog
- GIVEN a CLIENT viewing a PENDING application on their gig
- WHEN they click the "Reject Application" button
- THEN a confirmation dialog MUST appear
- AND the dialog title MUST be "Reject Application"
- AND the dialog message MUST explain: "This will permanently reject this application. The specialist will be notified and cannot reapply to this gig."
- AND the rejectApplication action MUST NOT execute yet

#### Scenario: Confirming rejection executes action
- GIVEN a CLIENT with open rejection confirmation dialog
- WHEN they click "Confirm" in the dialog
- THEN the rejectApplication server action MUST be called
- AND the dialog MUST close
- AND the application status MUST update to REJECTED

#### Scenario: Canceling rejection closes dialog without action
- GIVEN a CLIENT with open rejection confirmation dialog
- WHEN they click "Cancel" in the dialog
- THEN the rejectApplication server action MUST NOT be called
- AND the dialog MUST close
- AND the application status MUST remain PENDING

**Acceptance Criteria:**
- Reject Application button opens ConfirmDialog before calling rejectApplication
- Dialog message clearly explains consequences
- Confirmation required before server action executes
- Cancel button prevents action execution
- Existing rejectApplication server action logic unchanged

---

### Requirement: Withdraw Application UI with Confirmation
The Withdraw Application button MUST trigger a confirmation dialog before executing the withdrawApplication server action.

#### Scenario: Clicking Withdraw Application opens confirmation dialog
- GIVEN a SPECIALIST viewing their PENDING application
- WHEN they click the "Withdraw Application" button
- THEN a confirmation dialog MUST appear
- AND the dialog title MUST be "Withdraw Application"
- AND the dialog message MUST explain: "This will withdraw your application. You will not be able to reapply to this gig."
- AND the withdrawApplication action MUST NOT execute yet

#### Scenario: Confirming withdrawal executes action
- GIVEN a SPECIALIST with open withdrawal confirmation dialog
- WHEN they click "Confirm" in the dialog
- THEN the withdrawApplication server action MUST be called
- AND the dialog MUST close
- AND the application status MUST update to WITHDRAWN

#### Scenario: Canceling withdrawal closes dialog without action
- GIVEN a SPECIALIST with open withdrawal confirmation dialog
- WHEN they click "Cancel" in the dialog
- THEN the withdrawApplication server action MUST NOT be called
- AND the dialog MUST close
- AND the application status MUST remain PENDING

**Acceptance Criteria:**
- Withdraw Application button opens ConfirmDialog before calling withdrawApplication
- Dialog message clearly explains consequences (cannot reapply)
- Confirmation required before server action executes
- Cancel button prevents action execution
- Existing withdrawApplication server action logic unchanged
