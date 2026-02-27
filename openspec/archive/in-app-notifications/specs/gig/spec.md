# Gig Specification Delta: In-App Notifications for Applications and Status Changes

## MODIFIED Requirements

### Requirement: Notification Model Schema
The Notification model MUST be extended to support different notification types and event metadata.

#### Scenario: Notification record includes type field
- GIVEN a notification is created for any event
- WHEN the notification record is stored
- THEN it MUST include a `type` field with one of: "MESSAGE", "APPLICATION", "STATUS_CHANGE"
- AND it MUST include an `eventType` field describing the specific event (e.g., "application_submitted", "work_approved")
- AND it MUST include an optional `eventData` JSON field for event-specific metadata

#### Scenario: Backward compatibility with existing message notifications
- GIVEN existing Notification records in the database (created before this change)
- WHEN the system queries notifications
- THEN records without a `type` field MUST be treated as "MESSAGE" type
- AND the system MUST handle null `eventType` and `eventData` gracefully

**Acceptance Criteria:**
- Notification model has `type` field (String, default "MESSAGE")
- Notification model has `eventType` field (String, optional)
- Notification model has `eventData` field (String/JSON, optional)
- Migration preserves existing notification records
- Existing message notifications continue to work without modification

---

### Requirement: Fetch Unread Notifications Server Action
The `getUnreadNotifications` server action MUST return notifications of all types with appropriate display information.

#### Scenario: Fetch includes all notification types
- GIVEN an authenticated user has unread notifications of different types
- WHEN `getUnreadNotifications` is called
- THEN it MUST return notifications for messages, applications, and status changes
- AND each notification MUST include type-specific display information

#### Scenario: Notification display text varies by type
- GIVEN a notification with type "APPLICATION" and eventType "application_submitted"
- WHEN the notification is formatted for display
- THEN the display text MUST be "New application from [specialist name]"
- AND the icon/indicator MUST be appropriate for application events

#### Scenario: Multiple notifications per gig are consolidated
- GIVEN a gig has 2 unread messages and 1 unread application
- WHEN `getUnreadNotifications` is called
- THEN it MUST return 1 notification entry for this gig
- AND the notification MUST indicate multiple unread events
- AND the most recent event MUST determine the display text

**Acceptance Criteria:**
- Returns notifications of all types (MESSAGE, APPLICATION, STATUS_CHANGE)
- Each notification includes: gigId, gigTitle, displayText, eventType, timestamp, unreadCount
- Display text is generated based on notification type and eventType
- Multiple notifications per gig are consolidated into one entry
- Sorted by most recent event first

---

## ADDED Requirements

### Requirement: Create Notification on Application Submitted
The `applyToGig` server action MUST create a notification for the gig owner when a specialist applies.

#### Scenario: Application creates notification for gig owner
- GIVEN an authenticated SPECIALIST applies to gig "abc123"
- AND the gig is owned by CLIENT user "client-456"
- WHEN the application is successfully created
- THEN a Notification record MUST be created with:
  - userId = "client-456"
  - gigId = "abc123"
  - type = "APPLICATION"
  - eventType = "application_submitted"
  - eventData = JSON with specialistId and applicationId
  - lastReadAt = null

#### Scenario: Notification creation does not block application
- GIVEN a specialist submits a valid application
- WHEN the notification creation fails
- THEN the application MUST still be created successfully
- AND the error MUST be logged but not returned to the user

**Acceptance Criteria:**
- `applyToGig` creates notification for gig owner
- Notification type is "APPLICATION"
- eventType is "application_submitted"
- eventData includes specialistId and applicationId
- Notification creation errors are logged but don't fail the application
- Transaction ensures atomicity where possible

---

### Requirement: Create Notification on Application Status Change
The `acceptApplication` and `rejectApplication` server actions MUST create notifications for the specialist.

#### Scenario: Accepting application creates notification for specialist
- GIVEN a CLIENT accepts application "app-789" from specialist "specialist-123"
- WHEN `acceptApplication` is called
- THEN a Notification record MUST be created with:
  - userId = "specialist-123"
  - gigId = gig ID from application
  - type = "APPLICATION"
  - eventType = "application_accepted"
  - eventData = JSON with applicationId
  - lastReadAt = null

#### Scenario: Rejecting application creates notification for specialist
- GIVEN a CLIENT rejects application "app-789" from specialist "specialist-123"
- WHEN `rejectApplication` is called
- THEN a Notification record MUST be created with:
  - userId = "specialist-123"
  - type = "APPLICATION"
  - eventType = "application_rejected"
  - lastReadAt = null

#### Scenario: Auto-rejected applications create notifications
- GIVEN a CLIENT accepts one application on gig "abc123"
- AND there are 3 other PENDING applications
- WHEN the accepted application triggers auto-rejection of others
- THEN notifications MUST be created for all 3 rejected specialists
- AND each notification MUST have eventType = "application_rejected"

**Acceptance Criteria:**
- `acceptApplication` creates notification for accepted specialist
- `rejectApplication` creates notification for rejected specialist
- Auto-rejection creates notifications for all rejected specialists
- Notification type is "APPLICATION"
- eventType is "application_accepted" or "application_rejected"
- eventData includes applicationId
- Errors are logged but don't fail the action

---

### Requirement: Create Notification on Application Withdrawn
The `withdrawApplication` server action MUST create a notification for the gig owner when a specialist withdraws.

#### Scenario: Withdrawing application creates notification for gig owner
- GIVEN a SPECIALIST withdraws their PENDING application on gig "abc123"
- AND the gig is owned by CLIENT user "client-456"
- WHEN `withdrawApplication` is called
- THEN a Notification record MUST be created with:
  - userId = "client-456"
  - gigId = "abc123"
  - type = "APPLICATION"
  - eventType = "application_withdrawn"
  - eventData = JSON with specialistId and applicationId
  - lastReadAt = null

**Acceptance Criteria:**
- `withdrawApplication` creates notification for gig owner
- Notification type is "APPLICATION"
- eventType is "application_withdrawn"
- eventData includes specialistId and applicationId
- Errors are logged but don't fail the withdrawal

---

### Requirement: Create Notification on Work Submitted
The `submitWork` server action MUST create a notification for the gig owner when work is submitted for review.

#### Scenario: Submitting work creates notification for gig owner
- GIVEN a SPECIALIST submits work on gig "abc123"
- AND the gig is owned by CLIENT user "client-456"
- WHEN `submitWork` is called
- THEN a Notification record MUST be created with:
  - userId = "client-456"
  - gigId = "abc123"
  - type = "STATUS_CHANGE"
  - eventType = "work_submitted"
  - eventData = JSON with specialistId
  - lastReadAt = null

**Acceptance Criteria:**
- `submitWork` creates notification for gig owner
- Notification type is "STATUS_CHANGE"
- eventType is "work_submitted"
- eventData includes specialistId
- Errors are logged but don't fail the submission

---

### Requirement: Create Notification on Work Approved
The `approveWork` server action MUST create a notification for the assigned specialist when work is approved.

#### Scenario: Approving work creates notification for specialist
- GIVEN a CLIENT approves work on gig "abc123"
- AND the gig is assigned to specialist "specialist-123"
- WHEN `approveWork` is called
- THEN a Notification record MUST be created with:
  - userId = "specialist-123"
  - gigId = "abc123"
  - type = "STATUS_CHANGE"
  - eventType = "work_approved"
  - eventData = JSON with clientId
  - lastReadAt = null

**Acceptance Criteria:**
- `approveWork` creates notification for assigned specialist
- Notification type is "STATUS_CHANGE"
- eventType is "work_approved"
- eventData includes clientId
- Errors are logged but don't fail the approval

---

### Requirement: Create Notification on Payment Marked
The `markAsPaid` server action MUST create a notification for the assigned specialist when payment is marked.

#### Scenario: Marking as paid creates notification for specialist
- GIVEN a CLIENT marks gig "abc123" as paid
- AND the gig is assigned to specialist "specialist-123"
- WHEN `markAsPaid` is called
- THEN a Notification record MUST be created with:
  - userId = "specialist-123"
  - gigId = "abc123"
  - type = "STATUS_CHANGE"
  - eventType = "payment_marked"
  - eventData = JSON with clientId and paidAt timestamp
  - lastReadAt = null

**Acceptance Criteria:**
- `markAsPaid` creates notification for assigned specialist
- Notification type is "STATUS_CHANGE"
- eventType is "payment_marked"
- eventData includes clientId and paidAt
- Errors are logged but don't fail the action

---

### Requirement: Notification Display Formatting
The notification dropdown MUST display different notification types with appropriate text and styling.

#### Scenario: Application notification displays specialist name
- GIVEN a notification with type "APPLICATION" and eventType "application_submitted"
- WHEN the notification is displayed in the dropdown
- THEN the text MUST be "New application from [specialist display name or email]"
- AND the icon MUST indicate an application event (e.g., 📝 or user icon)

#### Scenario: Status change notification displays appropriate text
- GIVEN a notification with type "STATUS_CHANGE" and eventType "work_submitted"
- WHEN the notification is displayed
- THEN the text MUST be "Work submitted for review on [gig title]"
- AND the icon MUST indicate a status change (e.g., 🔄 or status icon)

#### Scenario: Message notification displays sender name
- GIVEN a notification with type "MESSAGE" (or no type for backward compatibility)
- WHEN the notification is displayed
- THEN the text MUST be "[sender name] sent a message"
- AND the icon MUST indicate a message (e.g., 💬 or message icon)

#### Scenario: Multiple unread events show combined count
- GIVEN a gig has 2 unread messages and 1 unread application
- WHEN the notification is displayed
- THEN it MUST show "3 unread updates" or similar
- AND the most recent event MUST determine the primary display text

**Acceptance Criteria:**
- Each notification type has distinct display text format
- Display text includes relevant names (specialist, client, sender)
- Icons or visual indicators distinguish notification types
- Multiple unread events per gig show combined count
- Text is clear and actionable
- Truncation handles long names gracefully

---

### Requirement: Mark All Notifications as Read on Gig Visit
The gig detail page MUST mark all notifications for that gig as read, regardless of type.

#### Scenario: Visiting gig marks all notification types as read
- GIVEN a user has unread notifications of types MESSAGE, APPLICATION, and STATUS_CHANGE for gig "abc123"
- WHEN they visit the gig detail page
- THEN all notifications for this user-gig pair MUST be marked as read
- AND the unread count badge MUST decrease accordingly

#### Scenario: Mark as read is type-agnostic
- GIVEN the existing `markNotificationAsRead` action
- WHEN it is called for a gig
- THEN it MUST mark all notification types as read (not just messages)
- AND the implementation MUST not require changes (already gig-scoped)

**Acceptance Criteria:**
- Visiting gig page marks all notification types as read
- No changes needed to `markNotificationAsRead` (already gig-scoped)
- Unread count updates correctly after marking as read
- Works for all notification types (MESSAGE, APPLICATION, STATUS_CHANGE)
