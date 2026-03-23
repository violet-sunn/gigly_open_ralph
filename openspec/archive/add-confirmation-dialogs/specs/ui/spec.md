# UI Specification Delta: Confirmation Dialogs

## ADDED Requirements

### Requirement: ConfirmDialog Component
The system MUST provide a reusable `ConfirmDialog` component that displays a modal confirmation dialog for destructive actions.

#### Scenario: Dialog renders with custom title and message
- GIVEN a ConfirmDialog component with title "Close Gig" and message "This will prevent new applications..."
- WHEN the dialog is rendered
- THEN the title MUST be displayed prominently at the top
- AND the message MUST be displayed below the title
- AND the dialog MUST be centered on the screen with a backdrop overlay

#### Scenario: Dialog has Confirm and Cancel buttons
- GIVEN a ConfirmDialog component
- WHEN the dialog is rendered
- THEN it MUST display a "Confirm" button with destructive styling (red background)
- AND it MUST display a "Cancel" button with neutral styling (gray background)
- AND the Cancel button MUST be positioned to the left of the Confirm button

#### Scenario: Clicking Confirm executes callback
- GIVEN a ConfirmDialog with onConfirm callback
- WHEN the user clicks the "Confirm" button
- THEN the onConfirm callback MUST be executed
- AND the dialog MUST close automatically

#### Scenario: Clicking Cancel closes dialog without action
- GIVEN a ConfirmDialog with onConfirm callback
- WHEN the user clicks the "Cancel" button
- THEN the onConfirm callback MUST NOT be executed
- AND the dialog MUST close

#### Scenario: Pressing Escape closes dialog without action
- GIVEN an open ConfirmDialog
- WHEN the user presses the Escape key
- THEN the dialog MUST close
- AND the onConfirm callback MUST NOT be executed

#### Scenario: Clicking backdrop closes dialog without action
- GIVEN an open ConfirmDialog
- WHEN the user clicks the backdrop (outside the dialog)
- THEN the dialog MUST close
- AND the onConfirm callback MUST NOT be executed

#### Scenario: Dialog is keyboard accessible
- GIVEN an open ConfirmDialog
- WHEN the user navigates with Tab key
- THEN focus MUST move between Cancel and Confirm buttons
- AND pressing Enter on focused button MUST trigger that button's action

#### Scenario: Dialog traps focus
- GIVEN an open ConfirmDialog
- WHEN the user navigates with Tab key
- THEN focus MUST remain within the dialog
- AND focus MUST NOT move to elements behind the dialog

#### Scenario: Dialog has ARIA attributes
- GIVEN a ConfirmDialog component
- WHEN the dialog is rendered
- THEN it MUST have role="dialog"
- AND it MUST have aria-modal="true"
- AND it MUST have aria-labelledby pointing to the title element
- AND it MUST have aria-describedby pointing to the message element

**Acceptance Criteria:**
- Component exported from `app/components/ui/ConfirmDialog.tsx`
- Props interface: `{ isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void, confirmLabel?: string, cancelLabel?: string }`
- Default labels: confirmLabel="Confirm", cancelLabel="Cancel"
- Uses design tokens for colors (destructive button, neutral button, backdrop)
- Backdrop has semi-transparent dark overlay (rgba(0, 0, 0, 0.5))
- Dialog has white background, rounded corners, shadow
- Responsive: adapts to mobile screens (full width on small screens)
- Focus management: focuses Cancel button by default when opened
- Escape key handler and backdrop click handler
- ARIA attributes for accessibility

---

### Requirement: useConfirmDialog Hook
The system MUST provide a `useConfirmDialog` custom hook that manages dialog state and provides open/close functions.

#### Scenario: Hook provides dialog state
- GIVEN a component using useConfirmDialog hook
- WHEN the hook is initialized
- THEN it MUST return isOpen state (boolean)
- AND it MUST return openDialog function
- AND it MUST return closeDialog function
- AND it MUST return confirmDialog function

#### Scenario: openDialog sets isOpen to true
- GIVEN a component using useConfirmDialog hook
- WHEN openDialog() is called
- THEN isOpen MUST be set to true
- AND the dialog MUST become visible

#### Scenario: closeDialog sets isOpen to false
- GIVEN a component with open dialog (isOpen = true)
- WHEN closeDialog() is called
- THEN isOpen MUST be set to false
- AND the dialog MUST become hidden

#### Scenario: confirmDialog executes action and closes
- GIVEN a component using useConfirmDialog with action callback
- WHEN confirmDialog() is called
- THEN the action callback MUST be executed
- AND isOpen MUST be set to false
- AND the dialog MUST close

**Acceptance Criteria:**
- Hook exported from `app/hooks/useConfirmDialog.ts`
- Returns object: `{ isOpen: boolean, openDialog: () => void, closeDialog: () => void, confirmDialog: (action: () => void) => void }`
- confirmDialog accepts action callback and executes it before closing
- State management uses React useState
- Hook is reusable across multiple components
