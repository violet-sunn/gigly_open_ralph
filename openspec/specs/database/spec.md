# Database Specification

## Requirements

### Requirement: Prisma ORM Setup
The system MUST use Prisma as the database ORM with SQLite as the database provider.

#### Scenario: Prisma initialization
- GIVEN a fresh project
- WHEN Prisma is initialized
- THEN a `prisma/schema.prisma` file MUST exist
- AND the datasource MUST be configured for SQLite
- AND the client generator MUST be configured

**Acceptance Criteria:**
- File `prisma/schema.prisma` exists
- Contains `datasource db { provider = "sqlite" }`
- Contains `generator client { provider = "prisma-client-js" }`

---

### Requirement: User Model
The system MUST define a User model with id, email, password, role fields, relations to Gig and Application, AND 1:1 relations to ClientProfile and SpecialistProfile.

#### Scenario: User schema definition
- GIVEN the Prisma schema file
- WHEN the User model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `email` field as String with @unique
  - `password` field as String
  - `role` field as String with @default("USER") for backwards compatibility
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
  - `gigs` relation field (Gig[]) via "ClientGigs"
  - `applications` relation field (Application[])
  - `assignedGigs` relation field (Gig[]) via "AssignedGigs"
  - `clientProfile` relation field (ClientProfile?)
  - `specialistProfile` relation field (SpecialistProfile?)
  - `sentMessages` relation field (Message[]) via "SentMessages"

#### Scenario: Role values
- GIVEN a new user registration
- WHEN the role is set
- THEN it MUST be one of `"CLIENT"`, `"SPECIALIST"`, or `"ADMIN"`
- AND the `registerUser` action MUST only accept `"CLIENT"` or `"SPECIALIST"`
- AND `"ADMIN"` MUST only be assignable directly in the database

#### Scenario: User has gigs relation
- GIVEN the updated User model
- WHEN queried with `include: { gigs: true }`
- THEN it MUST return the user's gigs array

#### Scenario: User has applications relation
- GIVEN the updated User model
- WHEN queried with `include: { applications: true }`
- THEN it MUST return the user's applications array

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- Model includes all required fields with correct types
- User model includes `gigs Gig[]` and `applications Application[]` relation fields
- `registerUser` validates role is `"CLIENT"` or `"SPECIALIST"`

---

### Requirement: Gig Model
The system MUST define a Gig model linked to the User model with a relation to Application and an optional assigned specialist.

#### Scenario: Gig schema definition
- GIVEN the Prisma schema file
- WHEN the Gig model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `title` field as String
  - `description` field as String
  - `acceptanceCriteria` field as String? (nullable)
  - `goal` field as String with @default("") (optional structured requirement field)
  - `deliverables` field as String with @default("") (optional structured requirement field)
  - `constraints` field as String with @default("") (optional structured requirement field)
  - `budget` field as Int (amount in kopecks)
  - `serviceFee` field as Int (calculated as 20% of budget, in kopecks)
  - `totalAmount` field as Int (budget + serviceFee, in kopecks)
  - `status` field as String with @default("OPEN")
  - `tags` field as String with @default("") (comma-separated)
  - `clientId` field as String (foreign key to User)
  - `client` relation to User model via "ClientGigs"
  - `assignedSpecialistId` field as String? (nullable, foreign key to User)
  - `assignedSpecialist` relation to User model via "AssignedGigs" (optional)
  - `paidAt` field as DateTime? (nullable, tracks payment timestamp)
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
  - `applications` relation field (Application[])
  - `messages` relation field (Message[])

#### Scenario: Gig has applications relation
- GIVEN the updated Gig model
- WHEN queried with `include: { applications: true }`
- THEN it MUST return the gig's applications array

#### Scenario: Gig transitions to IN_PROGRESS
- GIVEN a Gig with status "OPEN"
- WHEN an application is accepted
- THEN the Gig `status` MUST be updated to "IN_PROGRESS"
- AND `assignedSpecialistId` MUST be set to the accepted specialist's userId

#### Scenario: Gig transitions to PAID status
- GIVEN a Gig with status "COMPLETED"
- WHEN the gig is marked as paid
- THEN the Gig `status` MUST be updated to "PAID"
- AND `paidAt` MUST be set to the current timestamp

**Acceptance Criteria:**
- `npx prisma validate` passes
- Gig table exists in SQLite with all columns
- Gig model includes `applications Application[]` relation field
- Gig model includes `assignedSpecialistId String?` and `assignedSpecialist` relation
- Gig model includes `paidAt DateTime?` field
- Gig status supports "PAID" value

---

### Requirement: Application Model
The system MUST define an Application model linking a Specialist to a Gig with structured fields for technical approach, clarifying questions, and estimated effort.

#### Scenario: Application schema definition
- GIVEN the Prisma schema file
- WHEN the Application model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `gigId` field as String (foreign key to Gig)
  - `gig` relation to Gig model
  - `specialistId` field as String (foreign key to User)
  - `specialist` relation to User model
  - `coverLetter` field as String with @default("") (LEGACY - kept for backward compatibility)
  - `approach` field as String with @default("") (technical approach/methodology)
  - `questions` field as String with @default("") (clarifying questions about requirements)
  - `estimatedEffort` field as String with @default("") (optional effort estimate)
  - `status` field as String with @default("PENDING")
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt
- AND there MUST be a unique constraint on `[gigId, specialistId]`

#### Scenario: New applications use structured fields
- GIVEN a SPECIALIST submits a new application after this change
- WHEN the application is created
- THEN `approach` and `questions` MUST contain non-empty values
- AND `coverLetter` MUST be empty string (not used in new applications)
- AND `estimatedEffort` MAY be empty string or contain a value

#### Scenario: Legacy applications display gracefully
- GIVEN an existing application created before this change
- WHEN the application is displayed
- THEN if `approach` and `questions` are empty, the system MUST display `coverLetter` instead
- AND the UI MUST handle both old and new application formats

**Acceptance Criteria:**
- `npx prisma validate` passes
- Application table exists with unique constraint on (gigId, specialistId)
- Application model includes `approach`, `questions`, and `estimatedEffort` fields
- All new fields have @default("") for backward compatibility
- Application status supports "PENDING", "ACCEPTED", "REJECTED"
- No orphaned PENDING applications after an accept operation
- `coverLetter` field remains in schema (not removed)

---

### Requirement: ClientProfile Model
The system MUST define a ClientProfile model with a 1:1 relation to User for storing CLIENT-specific profile data.

#### Scenario: ClientProfile schema definition
- GIVEN the Prisma schema file
- WHEN the ClientProfile model is defined
- THEN it MUST include:
  - `userId` field as String with @id (primary key and foreign key)
  - `user` relation to User model
  - `companyName` field as String
  - `inn` field as String (Individual Taxpayer Number)
  - `kpp` field as String with @default("")
  - `contactPerson` field as String with @default("")
  - `phoneNumber` field as String with @default("")
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt

#### Scenario: ClientProfile is created lazily
- GIVEN a new CLIENT user who has never edited their profile
- WHEN the user record is queried
- THEN `clientProfile` MUST be null
- AND the user MUST still be able to use the platform

**Acceptance Criteria:**
- ClientProfile model uses `userId String @id` (not auto-generated id)
- User model includes `clientProfile ClientProfile?` relation field
- Migration creates ClientProfile table with CASCADE delete

---

### Requirement: SpecialistProfile Model
The system MUST define a SpecialistProfile model with a 1:1 relation to User for storing SPECIALIST-specific profile data.

#### Scenario: SpecialistProfile schema definition
- GIVEN the Prisma schema file
- WHEN the SpecialistProfile model is defined
- THEN it MUST include:
  - `userId` field as String with @id (primary key and foreign key)
  - `user` relation to User model
  - `displayName` field as String with @default("")
  - `techStack` field as String with @default("")
  - `experienceLevel` field as String with @default("")
  - `bio` field as String with @default("")
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt

#### Scenario: SpecialistProfile is created lazily
- GIVEN a new SPECIALIST user who has never edited their profile
- WHEN the user record is queried
- THEN `specialistProfile` MUST be null
- AND the user MUST still be able to use the platform

**Acceptance Criteria:**
- SpecialistProfile model uses `userId String @id` (not auto-generated id)
- User model includes `specialistProfile SpecialistProfile?` relation field
- Migration creates SpecialistProfile table with CASCADE delete
- All fields have default values (no nullable fields except the relation itself)

---

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
  - `sender` relation to User model via "SentMessages"
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

#### Scenario: One notification per user per gig
- GIVEN a user and a gig
- WHEN attempting to create multiple Notification records with the same userId and gigId
- THEN it MUST fail with a unique constraint violation
- AND only one Notification record MUST exist per user-gig pair

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

---

### Requirement: Database Migrations
The system MUST support database migrations for schema changes.

#### Scenario: Initial migration
- GIVEN a defined User model
- WHEN migrations are created and applied
- THEN the SQLite database MUST contain a User table
- AND the table MUST have all defined columns

**Acceptance Criteria:**
- Run `npx prisma migrate dev --name init` succeeds
- File `prisma/migrations/*/migration.sql` is created
- SQLite database file is created
- Run `npx prisma studio` shows User model

---

### Requirement: Prisma Query Patterns
The system MUST use Prisma's `select` and `include` options correctly to avoid validation errors.

#### Scenario: Querying relations with include
- GIVEN a Prisma query that needs to fetch related data
- WHEN using `include` to fetch relations
- THEN nested relations MUST also use `include` (not `select`)
- AND all fields of the included relation will be fetched

**Example (Correct):**
```typescript
prisma.gig.findUnique({
  where: { id },
  include: {
    client: {
      include: { clientProfile: true }
    }
  }
})
```

**Example (Incorrect - will throw validation error):**
```typescript
prisma.gig.findUnique({
  where: { id },
  include: {
    client: {
      select: { email: true },  // ❌ Cannot mix select with include
      include: { clientProfile: true }
    }
  }
})
```

#### Scenario: Querying relations with select
- GIVEN a Prisma query that needs specific fields only
- WHEN using `select` to fetch specific fields
- THEN nested relations MUST use `select` with explicit field enumeration
- AND all scalar fields must be explicitly listed

#### Scenario: Conditional includes based on user role
- GIVEN a query that conditionally includes relations based on authorization
- WHEN the condition is false
- THEN the include value MUST be `false` (not `undefined` or `null`)

**Acceptance Criteria:**
- All Prisma queries in the codebase follow consistent `include` or `select` usage
- No queries mix `select` and `include` at the same nesting level
- Conditional includes use `false` for the negative case
- `npx prisma validate` passes
- No `PrismaClientValidationError` at runtime
