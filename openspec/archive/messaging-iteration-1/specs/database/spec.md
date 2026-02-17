# Database Specification Delta: messaging-iteration-1

## ADDED Requirements

### Requirement: Message Model
The system MUST define a Message model for storing text messages between clients and specialists within the context of a gig.

#### Scenario: Message schema definition
- GIVEN the Prisma schema file
- WHEN the Message model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `gigId` field as String (foreign key to Gig)
  - `gig` relation to Gig model
  - `senderId` field as String (foreign key to User)
  - `sender` relation to User model
  - `content` field as String (the message text)
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
- AND there MUST be an index on `gigId` for efficient message retrieval
- AND there MUST be an index on `createdAt` for chronological ordering

#### Scenario: Message belongs to Gig
- GIVEN a Message record with a valid gigId
- WHEN queried with `include: { gig: true }`
- THEN it MUST return the associated Gig record

#### Scenario: Message belongs to User (sender)
- GIVEN a Message record with a valid senderId
- WHEN queried with `include: { sender: true }`
- THEN it MUST return the associated User record (the sender)

#### Scenario: Gig has many Messages
- GIVEN a Gig record
- WHEN queried with `include: { messages: true }`
- THEN it MUST return an array of Message records associated with that gig
- AND messages MUST be orderable by createdAt

#### Scenario: User has many sent Messages
- GIVEN a User record
- WHEN queried with `include: { sentMessages: true }`
- THEN it MUST return an array of Message records where the user is the sender

#### Scenario: Message content is required
- GIVEN an attempt to create a Message with empty or null content
- WHEN the database operation is executed
- THEN it MUST fail with a validation error (content is non-nullable String)

#### Scenario: Message requires valid foreign keys
- GIVEN an attempt to create a Message with non-existent gigId or senderId
- WHEN the database operation is executed
- THEN it MUST fail with a foreign key constraint error

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- Message model includes all required fields with correct types
- Gig model includes `messages Message[]` relation field
- User model includes `sentMessages Message[]` relation field
- Indexes exist on `gigId` and `createdAt`
- Migration creates Message table with proper foreign key constraints

---

### Requirement: Message Migration
The system MUST support database migration to add the Message table.

#### Scenario: Migration creation
- GIVEN the updated Prisma schema with Message model
- WHEN `npx prisma migrate dev --name add-message-model` is executed
- THEN a new migration file MUST be created in `prisma/migrations/`
- AND the migration SQL MUST include CREATE TABLE statement for Message
- AND the migration SQL MUST include foreign key constraints for gigId and senderId
- AND the migration SQL MUST include indexes on gigId and createdAt

#### Scenario: Migration application
- GIVEN a created migration file
- WHEN the migration is applied
- THEN the SQLite database MUST contain a Message table
- AND the table MUST have all defined columns
- AND foreign key constraints MUST be enforced

#### Scenario: Manual message creation via Prisma Studio
- GIVEN the migration has been applied
- WHEN Prisma Studio is opened (`npx prisma studio`)
- THEN the Message model MUST be visible in the UI
- AND new Message records MUST be creatable manually
- AND created messages MUST persist after closing Prisma Studio

**Acceptance Criteria:**
- Migration file exists in `prisma/migrations/`
- Migration applies without errors
- `npx prisma studio` shows Message model
- Messages can be created, read, and persisted via Prisma Studio
- Foreign key constraints prevent orphaned messages (gigId and senderId must exist)
