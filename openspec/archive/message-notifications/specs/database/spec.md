# Database Specification Delta: Message Notifications

## ADDED Requirements

### Requirement: Notification Model
The system MUST define a Notification model for tracking unread messages per user per gig.

#### Scenario: Notification schema definition
- GIVEN the Prisma schema file
- WHEN the Notification model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `userId` field as String (foreign key to User)
  - `user` relation to User model
  - `gigId` field as String (foreign key to Gig)
  - `gig` relation to Gig model
  - `lastReadAt` field as DateTime? (nullable, tracks when user last read messages for this gig)
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
- AND there MUST be a unique constraint on `[userId, gigId]`
- AND there MUST be an index on `userId` for efficient notification fetches
- AND there MUST be an index on `gigId` for gig-based queries

#### Scenario: Notification belongs to User
- GIVEN a Notification record with a valid userId
- WHEN queried with `include: { user: true }`
- THEN it MUST return the associated User record

#### Scenario: Notification belongs to Gig
- GIVEN a Notification record with a valid gigId
- WHEN queried with `include: { gig: true }`
- THEN it MUST return the associated Gig record

#### Scenario: User has many Notifications
- GIVEN a User record
- WHEN queried with `include: { notifications: true }`
- THEN it MUST return an array of Notification records for that user

#### Scenario: Gig has many Notifications
- GIVEN a Gig record
- WHEN queried with `include: { notifications: true }`
- THEN it MUST return an array of Notification records for that gig

#### Scenario: One notification per user per gig
- GIVEN a user and a gig
- WHEN attempting to create multiple Notification records with the same userId and gigId
- THEN it MUST fail with a unique constraint violation
- AND only one Notification record MUST exist per user-gig pair

#### Scenario: Notification requires valid foreign keys
- GIVEN an attempt to create a Notification with non-existent userId or gigId
- WHEN the database operation is executed
- THEN it MUST fail with a foreign key constraint error

#### Scenario: Notification is deleted when User is deleted
- GIVEN a Notification record associated with a User
- WHEN the User is deleted
- THEN the Notification record MUST be automatically deleted (CASCADE)

#### Scenario: Notification is deleted when Gig is deleted
- GIVEN a Notification record associated with a Gig
- WHEN the Gig is deleted
- THEN the Notification record MUST be automatically deleted (CASCADE)

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- Notification model includes all required fields with correct types
- User model includes `notifications Notification[]` relation field
- Gig model includes `notifications Notification[]` relation field
- Unique constraint exists on `[userId, gigId]`
- Indexes exist on `userId` and `gigId`
- Migration creates Notification table with proper foreign key constraints and CASCADE delete
- `lastReadAt` is nullable (null means never read)
