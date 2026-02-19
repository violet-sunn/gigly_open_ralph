# Gig Creation Test Specification

## ADDED Requirements

### Requirement: Gig creation MUST validate all required fields

The `createGig` server action MUST enforce that title, description, acceptance criteria, and budget are provided and non-empty after trimming whitespace.

#### Scenario: Create gig with all required fields
**Given** a CLIENT user is authenticated
**When** they submit a gig creation form with valid title, description, acceptance criteria (≥50 chars), and positive budget
**Then** the gig MUST be created successfully
**And** the user MUST be redirected to `/dashboard`
**And** the gig MUST exist in the database with correct field values

#### Scenario: Reject gig creation with missing title
**Given** a CLIENT user is authenticated
**When** they submit a gig creation form with empty or whitespace-only title
**Then** the action MUST return error: "Title, description, and acceptance criteria are required."
**And** no gig MUST be created in the database

#### Scenario: Reject gig creation with missing description
**Given** a CLIENT user is authenticated
**When** they submit a gig creation form with empty or whitespace-only description
**Then** the action MUST return error: "Title, description, and acceptance criteria are required."
**And** no gig MUST be created in the database

#### Scenario: Reject gig creation with missing acceptance criteria
**Given** a CLIENT user is authenticated
**When** they submit a gig creation form with empty or whitespace-only acceptance criteria
**Then** the action MUST return error: "Title, description, and acceptance criteria are required."
**And** no gig MUST be created in the database

#### Scenario: Reject gig creation with missing budget
**Given** a CLIENT user is authenticated
**When** they submit a gig creation form without a budget value
**Then** the action MUST return error: "Budget must be a positive number."
**And** no gig MUST be created in the database

---

### Requirement: Acceptance criteria MUST be at least 50 characters

To ensure clients provide meaningful success criteria, the acceptance criteria field MUST contain at least 50 characters after trimming whitespace.

#### Scenario: Accept acceptance criteria with exactly 50 characters
**Given** a CLIENT user is authenticated
**When** they submit a gig with acceptance criteria of exactly 50 characters
**Then** the gig MUST be created successfully

#### Scenario: Accept acceptance criteria with more than 50 characters
**Given** a CLIENT user is authenticated
**When** they submit a gig with acceptance criteria of 100 characters
**Then** the gig MUST be created successfully

#### Scenario: Reject acceptance criteria with less than 50 characters
**Given** a CLIENT user is authenticated
**When** they submit a gig with acceptance criteria of 49 characters
**Then** the action MUST return error: "Acceptance criteria must be at least 50 characters."
**And** no gig MUST be created in the database

---

### Requirement: Budget MUST be a positive number and correctly converted to kopecks

The budget field MUST accept positive numbers in roubles, convert them to kopecks (multiply by 100), and reject zero, negative, or non-numeric values.

#### Scenario: Accept valid positive budget
**Given** a CLIENT user is authenticated
**When** they submit a gig with budget "100000" (100,000 roubles)
**Then** the gig MUST be created with budget = 10000000 kopecks

#### Scenario: Accept budget with decimal places
**Given** a CLIENT user is authenticated
**When** they submit a gig with budget "100000.50" (100,000.50 roubles)
**Then** the gig MUST be created with budget = 10000050 kopecks (rounded)

#### Scenario: Reject zero budget
**Given** a CLIENT user is authenticated
**When** they submit a gig with budget "0"
**Then** the action MUST return error: "Budget must be a positive number."
**And** no gig MUST be created in the database

#### Scenario: Reject negative budget
**Given** a CLIENT user is authenticated
**When** they submit a gig with budget "-50000"
**Then** the action MUST return error: "Budget must be a positive number."
**And** no gig MUST be created in the database

#### Scenario: Reject non-numeric budget
**Given** a CLIENT user is authenticated
**When** they submit a gig with budget "not-a-number"
**Then** the action MUST return error: "Budget must be a positive number."
**And** no gig MUST be created in the database

---

### Requirement: Service fee MUST be calculated as 20% of budget

**IMPORTANT:** The current implementation in `app/actions/gig.ts` uses 20% (line 44: `budgetKopecks * 0.20`), which contradicts the documented 10% standard in `project.md`. This test suite validates the ACTUAL implementation (20%), not the documented standard. This inconsistency should be addressed separately.

The service fee MUST be calculated as 20% of the budget (in kopecks), floored to the nearest kopeck.

#### Scenario: Calculate service fee for 100,000 rouble budget
**Given** a CLIENT creates a gig with budget 100000 roubles (10000000 kopecks)
**Then** serviceFee MUST equal 2000000 kopecks (20% of 10000000)
**And** totalAmount MUST equal 12000000 kopecks (budget + serviceFee)

#### Scenario: Calculate service fee with floor rounding
**Given** a CLIENT creates a gig with budget that results in fractional kopecks
**Then** serviceFee MUST be floored to the nearest kopeck
**And** totalAmount MUST equal budget + serviceFee

---

### Requirement: Total amount MUST equal budget plus service fee

The totalAmount field MUST always equal the sum of budget and serviceFee.

#### Scenario: Verify total amount calculation
**Given** a CLIENT creates a gig with any valid budget
**Then** totalAmount MUST equal budget + serviceFee
**And** all three values MUST be stored correctly in the database

---

### Requirement: Gig MUST default to OPEN status

Newly created gigs MUST have status set to "OPEN" by default.

#### Scenario: New gig has OPEN status
**Given** a CLIENT creates a gig
**Then** the gig status MUST be "OPEN"
**And** the gig MUST be visible to specialists browsing open gigs

---

### Requirement: Tags MUST be stored correctly

Tags provided as a comma-separated string MUST be stored in the tags field. The current implementation trims outer whitespace from the entire tags string but does NOT normalize individual tags.

#### Scenario: Store single tag
**Given** a CLIENT creates a gig with tags "React"
**Then** the gig tags field MUST contain "React"

#### Scenario: Store multiple tags
**Given** a CLIENT creates a gig with tags "React,TypeScript,Node.js"
**Then** the gig tags field MUST contain "React,TypeScript,Node.js"

#### Scenario: Store empty tags
**Given** a CLIENT creates a gig without providing tags
**Then** the gig tags field MUST be an empty string

#### Scenario: Store tags with outer whitespace trimmed
**Given** a CLIENT creates a gig with tags "  React,TypeScript  "
**Then** the gig tags field MUST contain "React,TypeScript" (outer whitespace trimmed)

#### Scenario: Tags with inner whitespace are stored as-is (current behavior)
**Given** a CLIENT creates a gig with tags "React,  TypeScript , Node.js"
**Then** the gig tags field MUST contain "React,  TypeScript , Node.js" (inner whitespace preserved)
**Note:** This documents current behavior. Individual tag normalization may be added in a future change.

---

### Requirement: Structured requirement fields MUST be optional

The goal, deliverables, and constraints fields MUST be optional and stored as provided (or empty string if not provided).

#### Scenario: Create gig with all structured fields
**Given** a CLIENT creates a gig with goal, deliverables, and constraints
**Then** all three fields MUST be stored with the provided values

#### Scenario: Create gig without structured fields
**Given** a CLIENT creates a gig without goal, deliverables, or constraints
**Then** all three fields MUST be stored as empty strings
**And** the gig MUST be created successfully

#### Scenario: Create gig with only some structured fields
**Given** a CLIENT creates a gig with goal but no deliverables or constraints
**Then** goal MUST be stored with the provided value
**And** deliverables and constraints MUST be stored as empty strings

---

### Requirement: Only CLIENT role can create gigs

The `createGig` action MUST reject requests from non-CLIENT users.

#### Scenario: CLIENT can create gigs
**Given** a user with role CLIENT is authenticated
**When** they submit a valid gig creation form
**Then** the gig MUST be created successfully

#### Scenario: SPECIALIST cannot create gigs
**Given** a user with role SPECIALIST is authenticated
**When** they attempt to create a gig
**Then** the action MUST return error: "Only clients can create gigs."
**And** no gig MUST be created in the database

#### Scenario: Unauthenticated user cannot create gigs
**Given** no user is authenticated
**When** someone attempts to create a gig
**Then** they MUST be redirected to `/login`
**And** no gig MUST be created in the database

---

### Requirement: Gig MUST be associated with the authenticated CLIENT

The created gig MUST have its clientId set to the authenticated user's ID.

#### Scenario: Gig is owned by creator
**Given** a CLIENT user with ID "client-123" creates a gig
**Then** the gig clientId MUST equal "client-123"
**And** the gig MUST appear in the client's dashboard

---

### Requirement: Whitespace MUST be trimmed from text fields

All text input fields (title, description, acceptance criteria, goal, deliverables, constraints, tags) MUST have leading and trailing whitespace trimmed before validation and storage.

#### Scenario: Trim whitespace from title
**Given** a CLIENT submits a gig with title "  Test Gig  "
**Then** the stored title MUST be "Test Gig" (no leading/trailing spaces)

#### Scenario: Whitespace-only field is treated as empty
**Given** a CLIENT submits a gig with title "   " (only spaces)
**Then** the action MUST return error: "Title, description, and acceptance criteria are required."
