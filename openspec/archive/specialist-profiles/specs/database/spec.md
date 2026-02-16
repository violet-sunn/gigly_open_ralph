# Database Specification Delta: Specialist Profiles

## ADDED Requirements

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
  - `kpp` field as String with @default("") (Tax Registration Reason Code, optional)
  - `contactPerson` field as String with @default("")
  - `phoneNumber` field as String with @default("")
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt

#### Scenario: ClientProfile has 1:1 relation to User
- GIVEN a User with role "CLIENT"
- WHEN queried with `include: { clientProfile: true }`
- THEN it MUST return the user's clientProfile object or null if not created yet

#### Scenario: ClientProfile is created lazily
- GIVEN a new CLIENT user who has never edited their profile
- WHEN the user record is queried
- THEN `clientProfile` MUST be null
- AND the user MUST still be able to use the platform

#### Scenario: ClientProfile uses userId as primary key
- GIVEN the ClientProfile model
- WHEN a profile record is created
- THEN `userId` MUST be both the primary key and foreign key
- AND only one ClientProfile record MUST exist per user
- AND attempting to create a duplicate MUST fail with a unique constraint error

#### Scenario: Required fields for ClientProfile
- GIVEN a CLIENT user creates their profile
- WHEN the profile is saved
- THEN `companyName` and `inn` MUST be provided (non-empty strings)
- AND `kpp`, `contactPerson`, `phoneNumber` MAY be empty strings

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- ClientProfile model uses `userId String @id` (not auto-generated id)
- User model includes `clientProfile ClientProfile?` relation field
- Migration creates ClientProfile table with userId as primary key and foreign key to User(id)

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
  - `techStack` field as String with @default("") (comma-separated tags)
  - `experienceLevel` field as String with @default("") (values: "MIDDLE" or "SENIOR")
  - `bio` field as String with @default("")
  - `hourlyRate` field as Int with @default(0) (stored in kopecks)
  - `createdAt` field as DateTime with @default(now())
  - `updatedAt` field as DateTime with @updatedAt

#### Scenario: SpecialistProfile has 1:1 relation to User
- GIVEN a User with role "SPECIALIST"
- WHEN queried with `include: { specialistProfile: true }`
- THEN it MUST return the user's specialistProfile object or null if not created yet

#### Scenario: SpecialistProfile is created lazily
- GIVEN a new SPECIALIST user who has never edited their profile
- WHEN the user record is queried
- THEN `specialistProfile` MUST be null
- AND the user MUST still be able to use the platform

#### Scenario: SpecialistProfile uses userId as primary key
- GIVEN the SpecialistProfile model
- WHEN a profile record is created
- THEN `userId` MUST be both the primary key and foreign key
- AND only one SpecialistProfile record MUST exist per user
- AND attempting to create a duplicate MUST fail with a unique constraint error

#### Scenario: Experience level validation
- GIVEN a SPECIALIST user updates their profile
- WHEN experienceLevel is provided
- THEN it MUST be either "MIDDLE" or "SENIOR" or empty string
- AND any other value MUST be rejected by the application layer

#### Scenario: Hourly rate stored in kopecks
- GIVEN a SPECIALIST user sets hourly rate to 5000 roubles
- WHEN the profile is saved
- THEN hourlyRate MUST be stored as 500000 kopecks (5000 × 100)

#### Scenario: Default values for optional fields
- GIVEN a SPECIALIST user creates their profile with only displayName
- WHEN the profile is saved
- THEN other fields MUST use default values (empty strings or 0)
- AND no fields MUST be null

**Acceptance Criteria:**
- Run `npx prisma format` without errors
- Run `npx prisma validate` without errors
- SpecialistProfile model uses `userId String @id` (not auto-generated id)
- User model includes `specialistProfile SpecialistProfile?` relation field
- Migration creates SpecialistProfile table with userId as primary key and foreign key to User(id)
- All fields have default values (no nullable fields except the relation itself)

---

## MODIFIED Requirements

### Requirement: User Model
The system MUST define a User model with id, email, password, role fields, relations to Gig and Application, AND 1:1 relations to ClientProfile and SpecialistProfile.

#### Scenario: User has clientProfile relation
- GIVEN the updated User model
- WHEN queried with `include: { clientProfile: true }`
- THEN it MUST return the user's clientProfile object or null

#### Scenario: User has specialistProfile relation
- GIVEN the updated User model
- WHEN queried with `include: { specialistProfile: true }`
- THEN it MUST return the user's specialistProfile object or null

#### Scenario: User can have only one profile type
- GIVEN a User with role "CLIENT"
- WHEN the user record is queried with both profile relations
- THEN `clientProfile` MAY be present
- AND `specialistProfile` MUST be null (not enforced by DB, but by application logic)

**Acceptance Criteria:**
- User model includes `clientProfile ClientProfile?` relation field
- User model includes `specialistProfile SpecialistProfile?` relation field
- Both relations are optional (nullable)
- Existing User model fields remain unchanged
