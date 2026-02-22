# Implementation Tasks: extract-deep-application-map

## Task 1: Map Authentication & Onboarding Flows

**Implementation:**
- Analyze `/app/register/page.tsx` for registration form fields
- Analyze `/app/login/page.tsx` for login form fields
- Analyze `/app/dashboard/profile/edit/page.tsx` for profile setup flows
- Extract Zod schemas from relevant Server Actions in `/app/actions/`
- Document password validation rules, rate limiting, and redirect behavior
- Document CLIENT vs SPECIALIST profile field differences

**Test Plan:**
- Verify all field names match actual form inputs in code
- Verify validation rules match Zod schemas
- Cross-reference with middleware protection rules in `/middleware.ts`
- Confirm role options match UserRole enum in Prisma schema

**Output:** Section in `current_application_map.md` documenting:
- Registration fields (email, password, role)
- Login fields and rate limiting
- CLIENT profile fields (companyName, inn, kpp, description)
- SPECIALIST profile fields (techStack, experienceLevel, hourlyRate, description)

---

## Task 2: Map the Client Journey

**Implementation:**
- Analyze `/app/dashboard/gigs/new/page.tsx` for gig creation form
- Analyze `/app/dashboard/gigs/[id]/page.tsx` for application review interface
- Extract Server Actions: `createGig`, `acceptApplication`, `rejectApplication`
- Document gig lifecycle state machine (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- Document budget conversion (roubles to kopecks) and service fee calculation
- Document application acceptance side effects (auto-reject other applications)

**Test Plan:**
- Verify all gig creation fields match form inputs and Zod schemas
- Verify state transitions match Server Action logic
- Verify service fee calculation (10% of budget)
- Cross-reference with Prisma GigStatus enum

**Output:** Section in `current_application_map.md` documenting:
- Gig creation form fields (required: title, description, acceptanceCriteria, budget; optional: goal, deliverables, constraints, tags)
- Application review interface and actions
- Gig lifecycle state machine with transitions
- Authorization rules (only gig owner can accept/reject)

---

## Task 3: Map the Specialist Journey

**Implementation:**
- Analyze `/app/dashboard/gigs/page.tsx` for gig browsing and filters
- Analyze gig detail page for application submission form
- Extract Server Actions: `submitApplication`, `submitWork`
- Document filter options (text search, tags, budget range, sort)
- Document application form fields and validation rules
- Document work submission flow and state transition (IN_PROGRESS → REVIEW)

**Test Plan:**
- Verify filter options match UI implementation
- Verify application form fields match Zod schemas
- Verify rate limiting (10 applications per hour)
- Verify pagination (25 gigs per page)

**Output:** Section in `current_application_map.md` documenting:
- Gig browsing filters (search, tags, budget, sort)
- Application submission form (approach 100-2000 chars, questions 50-1000 chars, estimatedEffort max 200 chars)
- Work submission flow and authorization
- Application lifecycle states (PENDING, ACCEPTED, REJECTED)

---

## Task 4: Map the Admin Journey

**Implementation:**
- Analyze `/app/admin/users/page.tsx` for user management interface
- Extract Server Actions: `suspendUser`, `unsuspendUser`, `closeGig`
- Document displayed columns and filters
- Document moderation actions and required fields
- Document ModerationLog creation for audit trail

**Test Plan:**
- Verify user management columns match UI implementation
- Verify moderation actions match Server Action signatures
- Verify pagination (30 users per page)
- Cross-reference with ModerationLog Prisma model

**Output:** Section in `current_application_map.md` documenting:
- User management interface (columns: email, role, suspended status, created date)
- Available filters (role filter)
- Moderation actions (suspend, unsuspend, closeGig) with required reason fields
- Audit trail via ModerationLog

---

## Task 5: Generate the Comprehensive Report

**Implementation:**
- Compile all findings into `current_application_map.md` at project root
- Structure document with clear hierarchy (H1-H4 headers)
- Format field names in bold, state transitions with arrows
- Include source file references for traceability
- Create permission matrix table for role-based access
- Create state machine diagrams using markdown

**Test Plan:**
- Verify document completeness against spec scenarios
- Verify all routes in `app/` directory are documented
- Verify all Server Actions are documented
- Verify field names match actual code (no assumptions)
- Verify validation rules match Zod schemas
- Verify state transitions match Server Action logic

**Output:** Complete `current_application_map.md` with:
1. Executive Summary
2. Authentication & Onboarding
3. Client Journey
4. Specialist Journey
5. Admin Journey
6. Shared Components
7. State Machines
8. Appendix (field validation rules, role permission matrix)

**Verification Command:**
```bash
# Verify report exists and has substantial content
test -f current_application_map.md && wc -l current_application_map.md
```

**Success Criteria:**
- Report is at least 500 lines (comprehensive detail)
- All spec scenarios are satisfied
- Design team can use as technical specification
- All field names are traceable to source code
