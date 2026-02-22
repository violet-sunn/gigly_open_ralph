# Change Proposal: Deep Application Map & User Journey Extraction

## Change Name
`extract-deep-application-map`

## Problem Statement

Before proceeding with UI/UX redesign and alignment with designer mockups, we need a comprehensive, ground-truth documentation of the platform's current state. The existing documentation (project.md, completed changes) provides high-level context but lacks the granular detail needed for design work.

**Critical Gaps:**
- No single document showing exact form fields for each action
- State transitions and redirects not explicitly mapped
- Role-based access patterns scattered across middleware and components
- Validation rules and constraints not centrally documented
- User journey flows not visualized end-to-end

**Design Team Needs:**
- Exact field names, types, and validation rules for every form
- Complete state machine for gig lifecycle (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- Role-specific capabilities and restrictions
- Current UI patterns and interaction flows
- Data relationships and dependencies

## Proposed Solution

Conduct a **strictly read-only** deep audit of the codebase to extract a comprehensive application map. This will serve as the technical specification for the design phase.

**Deliverable:** `current_application_map.md` at project root

**Audit Scope:**
1. **Authentication & Onboarding** - Registration, login, profile setup
2. **Client Journey** - Dashboard, gig creation, application review, payment tracking
3. **Specialist Journey** - Gig browsing, application submission, work delivery, messaging
4. **Admin Journey** - User management, gig moderation, audit logs
5. **Shared Components** - Messaging, profiles, navigation

## Constraints

### Critical Constraints
- **READ-ONLY MODE:** No files shall be modified, created (except the report), or deleted
- **Ground Truth Only:** Document only what exists in the codebase, not planned features
- **Extreme Detail Required:** Every form field, validation rule, and state transition must be documented
- **Code-Based Analysis:** Extract information from actual code (Server Actions, Zod schemas, form components), not assumptions

### Scope Boundaries
- **In Scope:** Current functionality, exact field requirements, state transitions, role restrictions
- **Out of Scope:** UI/UX recommendations, refactoring suggestions, performance analysis, security audit

## Audit Methodology

For each page/view, document:

1. **Route & Access**
   - URL path (e.g., `/dashboard/gigs/new`)
   - Required role (CLIENT, SPECIALIST, ADMIN, or public)
   - Middleware protection rules

2. **Data Display**
   - What database entities are queried
   - What fields are displayed to the user
   - Computed values or transformations

3. **Interactive Elements**
   - Forms: exact field names, types, validation rules
   - Buttons: what action they trigger
   - Links: where they navigate

4. **State Transitions**
   - Before state (e.g., Gig status: OPEN)
   - Action taken (e.g., acceptApplication)
   - After state (e.g., Gig status: IN_PROGRESS)
   - Side effects (e.g., other applications rejected)

5. **Validation & Constraints**
   - Required fields
   - Field length limits
   - Format requirements (e.g., email, password strength)
   - Business rules (e.g., "only gig owner can accept applications")

## Success Criteria

1. **Completeness:** All routes in `app/` directory documented
2. **Accuracy:** Field names match actual code (Zod schemas, form inputs)
3. **Clarity:** Design team can use document as technical specification
4. **Traceability:** Each documented item references source file
5. **Actionability:** Document enables informed design decisions

## Non-Goals

- UI/UX design recommendations
- Code refactoring suggestions
- Performance optimization analysis
- Security vulnerability assessment
- API documentation (focus on user-facing flows)
- Database schema documentation (focus on user interactions)

## Deliverable Format

`current_application_map.md` will include:

1. **Executive Summary** - Platform overview, user roles, core workflows
2. **Authentication & Onboarding** - Registration, login, profile setup flows
3. **Client Journey** - Complete CLIENT user flow with exact field requirements
4. **Specialist Journey** - Complete SPECIALIST user flow with exact field requirements
5. **Admin Journey** - Complete ADMIN user flow with exact capabilities
6. **Shared Components** - Messaging, profiles, navigation patterns
7. **State Machines** - Gig lifecycle, application lifecycle
8. **Appendix** - Field validation rules, role permission matrix

**Format Standards:**
- Use markdown headers (H1-H4) for hierarchy
- Bold field names (e.g., **Title**, **Budget**)
- Use arrows for state transitions (e.g., `OPEN → IN_PROGRESS`)
- Include code references (e.g., `Source: app/actions/gig.ts`)
- Use tables for permission matrices
- Use nested lists for multi-step flows

## Expected Impact

**For Design Team:**
- Clear technical constraints for UI/UX decisions
- Exact field requirements for form designs
- Understanding of current user flows
- Basis for identifying improvement opportunities

**For Development Team:**
- Single source of truth for current functionality
- Reference for maintaining consistency during redesign
- Documentation of implicit business rules
- Baseline for measuring design impact

## Risk Assessment

**Risk Level:** 🟢 **Low**

This is a read-only documentation task with no code changes. The only risk is incomplete or inaccurate documentation, which will be mitigated by:
- Systematic code analysis (not assumptions)
- Cross-referencing multiple sources (Server Actions, forms, middleware)
- Verification against test suite (521 tests document expected behavior)
