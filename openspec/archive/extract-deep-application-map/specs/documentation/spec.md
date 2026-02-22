# Application Documentation Specification

## ADDED Requirements

### Requirement: Authentication & Onboarding Documentation
The application map MUST comprehensively document all authentication and onboarding flows.

#### Scenario: Document registration form fields
**Given** the registration page at `/register`
**When** analyzing the registration form
**Then** the report MUST list all required fields: email, password, role
**And** the report MUST document password validation rules (min 8 chars, uppercase, lowercase, number, Latin-only)
**And** the report MUST document role options (CLIENT, SPECIALIST)
**And** the report MUST reference source file `app/register/page.tsx`

#### Scenario: Document login form fields
**Given** the login page at `/login`
**When** analyzing the login form
**Then** the report MUST list all required fields: email, password
**And** the report MUST document rate limiting (15 attempts per 15 minutes)
**And** the report MUST document redirect behavior (to `/dashboard` on success)

#### Scenario: Document profile setup flows
**Given** profile setup pages at `/dashboard/profile/edit`
**When** analyzing profile forms
**Then** the report MUST list CLIENT-specific fields: companyName, inn, kpp, description
**And** the report MUST list SPECIALIST-specific fields: techStack, experienceLevel, hourlyRate, description
**And** the report MUST document which fields are required vs optional

### Requirement: Client Journey Documentation
The application map MUST comprehensively document the complete CLIENT user journey.

#### Scenario: Document gig creation form fields
**Given** the gig creation page at `/dashboard/gigs/new`
**When** analyzing the gig creation form
**Then** the report MUST list all required fields: title, description, acceptanceCriteria, budget
**And** the report MUST list all optional fields: goal, deliverables, constraints, tags
**And** the report MUST document field validation rules (e.g., acceptanceCriteria min 50 chars)
**And** the report MUST document budget conversion (roubles to kopecks)
**And** the report MUST document service fee calculation (10% of budget)

#### Scenario: Document application review interface
**Given** the gig detail page showing applications
**When** analyzing application management
**Then** the report MUST document what application data is displayed
**And** the report MUST list available actions: Accept, Reject
**And** the report MUST document state transition: OPEN → IN_PROGRESS on accept
**And** the report MUST document side effect: other applications auto-rejected

#### Scenario: Document gig lifecycle states
**Given** the gig lifecycle implementation
**When** analyzing state transitions
**Then** the report MUST document all states: OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID
**And** the report MUST document transitions between states
**And** the report MUST document who can trigger each transition
**And** the report MUST document conditions for each transition

### Requirement: Specialist Journey Documentation
The application map MUST comprehensively document the complete SPECIALIST user journey.

#### Scenario: Document gig browsing filters
**Given** the gig browsing page at `/dashboard/gigs`
**When** analyzing filter options
**Then** the report MUST list all filter types: text search, tags, budget range, sort
**And** the report MUST document available tag options
**And** the report MUST document sort options: newest, highest budget, lowest budget
**And** the report MUST document pagination (25 gigs per page)

#### Scenario: Document application submission form
**Given** the gig detail page with application form
**When** analyzing application submission
**Then** the report MUST list all required fields: approach (100-2000 chars), questions (50-1000 chars)
**And** the report MUST list optional fields: estimatedEffort (max 200 chars)
**And** the report MUST document validation rules for each field
**And** the report MUST document rate limiting (10 applications per hour)

#### Scenario: Document work submission flow
**Given** the gig detail page for assigned specialist
**When** analyzing work submission
**Then** the report MUST document submitWork action
**And** the report MUST document state transition: IN_PROGRESS → REVIEW
**And** the report MUST document who can submit (assigned specialist only)

### Requirement: Admin Journey Documentation
The application map MUST comprehensively document the complete ADMIN user journey.

#### Scenario: Document user management interface
**Given** the admin users page at `/admin/users`
**When** analyzing user management
**Then** the report MUST list displayed columns: email, role, suspended status, created date
**And** the report MUST list available filters: role filter
**And** the report MUST list available actions: suspend, unsuspend
**And** the report MUST document pagination (30 users per page)

#### Scenario: Document moderation actions
**Given** admin moderation capabilities
**When** analyzing moderation actions
**Then** the report MUST document suspendUser action with required reason field
**And** the report MUST document unsuspendUser action with required reason field
**And** the report MUST document closeGig action with required reason field
**And** the report MUST document ModerationLog creation for audit trail

### Requirement: Field-Level Detail
The application map MUST document exact field specifications for all forms.

#### Scenario: Document field validation rules
**Given** any form in the application
**When** documenting form fields
**Then** each field MUST include: name, type, required/optional status
**And** each field MUST include validation rules (min/max length, format, etc.)
**And** each field MUST reference source code location

#### Scenario: Document field constraints
**Given** any form with business rule constraints
**When** documenting constraints
**Then** the report MUST document role-based restrictions
**And** the report MUST document state-based restrictions
**And** the report MUST document rate limiting constraints

### Requirement: State Transition Documentation
The application map MUST document all state machines and transitions.

#### Scenario: Document gig lifecycle state machine
**Given** the gig lifecycle implementation
**When** documenting state transitions
**Then** the report MUST show all states in a clear format
**And** the report MUST show all valid transitions with arrows (e.g., OPEN → IN_PROGRESS)
**And** the report MUST document trigger actions for each transition
**And** the report MUST document authorization rules for each transition

#### Scenario: Document application lifecycle state machine
**Given** the application lifecycle implementation
**When** documenting state transitions
**Then** the report MUST show all states: PENDING, ACCEPTED, REJECTED
**And** the report MUST document transitions and triggers
**And** the report MUST document side effects (e.g., auto-reject on accept)

### Requirement: Report Completeness
The application map MUST be comprehensive and verifiable.

#### Scenario: Document all routes
**Given** the Next.js app directory structure
**When** generating the report
**Then** the report MUST document all routes in `app/` directory
**And** the report MUST document route protection (public, authenticated, role-specific)
**And** the report MUST document middleware rules

#### Scenario: Document all Server Actions
**Given** Server Actions in `app/actions/`
**When** generating the report
**Then** the report MUST list all Server Actions
**And** the report MUST document input parameters for each action
**And** the report MUST document authorization checks for each action
**And** the report MUST document state changes caused by each action

#### Scenario: Verify report accuracy
**Given** the generated application map
**When** cross-referencing with codebase
**Then** all field names MUST match actual code
**And** all validation rules MUST match actual implementation
**And** all state transitions MUST match actual Server Action logic
**And** all source file references MUST be accurate
