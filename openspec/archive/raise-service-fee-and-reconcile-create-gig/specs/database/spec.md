# Database — Spec Delta (raise-service-fee-and-reconcile-create-gig)

> `database/spec.md:83` documents `serviceFee` as "20% of budget" — wrong even before this change (the shipped code
> computed 10%). The business rate is now 17.5%; this corrects the field description. Only the documented rate changes;
> the column stays `Int` (kopecks). `goal`/`deliverables` keep their `@default("")` schema default — requiredness is
> enforced at the action layer (C1), not the column.

## MODIFIED Requirements

### Requirement: Gig Model
The Gig model MUST persist gig data including title, description, structured requirement fields, budget/fee amounts, status, assignment, and timestamps.

#### Scenario: Gig schema definition
- GIVEN the Prisma schema
- WHEN the Gig model is defined
- THEN it MUST include:
  - `id` field as String with @id and @default(cuid())
  - `title` field as String
  - `description` field as String
  - `acceptanceCriteria` field as String? (nullable)
  - `goal` field as String with @default("") (required at the action layer per the gig spec; the column default remains "")
  - `deliverables` field as String with @default("") (required at the action layer per the gig spec; the column default remains "")
  - `constraints` field as String with @default("") (optional)
  - `budget` field as Int (amount in kopecks)
  - `serviceFee` field as Int (calculated as **17.5%** of budget, in kopecks — `Math.floor(budget × SERVICE_FEE_RATE)`, see the gig spec "Service Fee Rate Is a Single Source of Truth")
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
