# Gigly Strategic Roadmap & Next Steps

**Document Version:** 3.0 (Development Cycle Complete - QA & Polish Phase)
**Date:** February 18, 2026
**Current Project State:** 20 completed changes, Functional MVP - Ready for QA & Polish

---

## Executive Summary

This document provides a comprehensive strategic assessment of the Gigly platform's current state and outlines the transition from **Development Phase** to **QA & Polish Phase**.

**Development Cycle Status:** ✅ **COMPLETE** - All 20 planned changes have been implemented via ralphy-spec methodology. The core marketplace loop is fully functional with all critical features in place.

**Current Phase:** The project has reached the end of the initial development cycle and is now entering **QA & Polish Phase**, where the focus shifts from feature development to:

- Security hardening
- Infrastructure preparation
- UI/UX refinement
- Production readiness validation

**Key Achievement:** The platform successfully implements the **MVP-first philosophy** - operational value (companies get work done, specialists earn more) is fully functional with logical status tracking, while heavy infrastructure (real payments, legal verification) is appropriately deferred to post-MVP.

**Requirements Clarity as Core Value:** Gigly differentiates by helping clients define success upfront (structured requirements, Definition of Done) and specialists demonstrate competence (approach, clarifying questions). This "Project Success System" reduces disputes and scope creep.

**Strategic Decision Point:** With a functional MVP codebase in hand, the organization must now decide whether to commit to custom code development or pivot to alternative platforms (e.g., Bubble.com) for initial market validation.

---

## Product-Market-Fit Assessment

### Current Stage: Functional MVP → QA & Polish Phase

**✅ COMPLETED - Development Cycle (20 Changes):**

- ✅ Complete core marketplace loop functional
- ✅ All three user roles (CLIENT, SPECIALIST, ADMIN) fully implemented
- ✅ Full gig lifecycle with state management (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- ✅ **In-platform messaging** (gig-scoped communication between client and assigned specialist)
- ✅ **Structured requirements** (acceptance criteria, goal, deliverables, constraints)
- ✅ **Structured applications** (technical approach, clarifying questions, estimated effort)
- ✅ Admin moderation and audit logging (suspend users, close gigs)
- ✅ Profile system with role-specific data (client company info, specialist tech stack)
- ✅ Search and filtering capabilities (text search, tags, budget range, sorting)
- ✅ Payment tracking (logical PAID status for workflow management)
- ✅ Example gigs with link from creation form

**⚠️ CRITICAL GAPS - Production Blockers:**

- ❌ **Security vulnerabilities** (no input sanitization, no rate limiting, no CSRF protection)
- ❌ **Service fee discrepancy** (20% in code vs 10% in documentation)
- ❌ **SQLite database** (not production-ready for multi-user web apps)
- ❌ **No test coverage** (zero tests, cannot deploy confidently)
- ❌ **No error tracking** (blind to production issues)
- ❌ **No email notifications** (users miss critical updates)
- ❌ **No password reset** (users permanently locked out if forgotten)
- ❌ **UI/UX quality** (functional but not polished, needs designer implementation)

**⏸️ POST-MVP GOALS (Important but NOT MVP Blockers):**

- ⏸️ Real payment gateway integration (logical status sufficient for beta)
- ⏸️ Legal entity verification (manual handling acceptable for beta)
- ⏸️ Contract/agreement system (deferred to post-MVP)
- ⏸️ Rating/review system (reputation building is post-MVP)
- ⏸️ Advanced search and recommendations
- ⏸️ Multi-milestone gigs

**Verdict:** The platform has **completed the development cycle** with all core features functional. The next phase focuses on **hardening for production** (security, infrastructure, testing) and **UI/UX polish** (designer implementation) before real user validation.

---

## Implementation Strategy

### Development Cycle: COMPLETE ✅

**Status:** All 20 planned changes have been successfully implemented via ralphy-spec methodology.

**Completed Changes (Changes 1-20):**

1. ✅ **project-initialization** - Next.js 15+ with App Router, Prisma + SQLite, Tailwind CSS, User model
2. ✅ **homepage-and-registration-flow** - Landing page, registration with role selection, password hashing
3. ✅ **user-login-and-sessions** - JWT sessions, login/logout, middleware route protection
4. ✅ **role-selection-and-dashboards** - Role-based dashboards (CLIENT, SPECIALIST, ADMIN)
5. ✅ **gig-creation** - Gig creation form with budget + 20% service fee calculation
6. ✅ **specialist-gig-browsing** - Browse OPEN gigs, gig detail page, application system
7. ✅ **application-management** - Accept/reject applications with auto-reject logic
8. ✅ **client-gig-detail-link** - Clickable gig links from client dashboard
9. ✅ **gig-work-submission-and-approval** - Submit work (SPECIALIST) and approve work (CLIENT)
10. ✅ **specialist-profiles** - Profile view/edit/public pages with role-specific fields
11. ✅ **payment-tracking-simplified** - Mark as paid, paidAt field, payment status display
12. ✅ **gig-filtering-and-search** - Text search, multi-tag filtering, budget range, sorting
13. ✅ **admin-role-and-moderation** - Suspend/unsuspend users, close gigs, audit logging
14. ✅ **messaging-iteration-1** - Message model with database relations
15. ✅ **messaging-iteration-3** - sendMessage action, message form, validation
16. ✅ **messaging-iteration-4** - Visual distinction (client/specialist), edge case handling
17. ✅ **bug-fix-1** - Fixed Prisma query mixing select/include
18. ✅ **requirements-iteration-2** - Goal, deliverables, constraints fields (optional)
19. ✅ **structured-application-fields** - Approach, questions, estimatedEffort (required)
20. ✅ **link-examples-from-gig-form** - Link to example gigs in form header

**Development Methodology:** All changes implemented using ralphy-spec with structured proposals, specs, tasks, and validation reports documented in `openspec/archive/`.

**Code Quality:** ~1,280 lines of clean, maintainable TypeScript code following Next.js 15 conventions. Business logic is sound, state management is correct, authorization checks are properly implemented.

---

## QA & Polish Phase: CURRENT FOCUS

### Phase Overview

**Goal:** Transform the functional MVP into a production-ready platform through security hardening, infrastructure preparation, UI/UX refinement, and comprehensive testing.

**Timeline:** 2-3 months (depending on resource availability)

**Key Principle:** This phase does NOT add new features. Focus is on hardening, polishing, and preparing what exists for real users.

---

### Immediate Priority (Weeks 1-3) - PRODUCTION BLOCKERS

**Goal:** Address critical security vulnerabilities and infrastructure issues that prevent production deployment.

#### WTBD-1: Security Hardening

**Priority:** **CRITICAL - PRODUCTION BLOCKER** | **Estimated Effort:** 2-3 weeks

**Critical Issues:**

1. **Service Fee Discrepancy** (1 day)
   - Code implements 20% fee (app/actions/gig.ts line 44)
   - Documentation states 10% fee (project.md, STRATEGIC_ROADMAP.md)
   - **Decision required:** Update code to 10% OR update all documentation to 20%
   - **Impact:** Clients currently pay double the documented fee

2. **Input Sanitization** (2-3 days)
   - No XSS protection on user inputs (gig descriptions, messages, profiles)
   - **Risk:** Malicious users can inject scripts
   - **Solution:** Add DOMPurify or similar sanitization library
   - **Scope:** Sanitize all user-generated content before storage and display

3. **Rate Limiting** (2-3 days)
   - No rate limiting on server actions
   - **Risk:** Spam applications, message flooding, brute force attacks
   - **Solution:** Add @upstash/ratelimit or similar middleware
   - **Scope:** Protect login, registration, application submission, message sending

4. **CSRF Protection** (1 day)
   - Verify Next.js 15 built-in CSRF protection is enabled
   - **Risk:** Cross-site request forgery attacks
   - **Solution:** Confirm Server Actions CSRF protection is active

5. **Environment Variables** (1 day)
   - No .env.example file for deployment guidance
   - **Risk:** Weak SESSION_SECRET compromises all sessions
   - **Solution:** Create .env.example with strong secret generation instructions
   - **Scope:** Document all required environment variables

6. **Password Requirements** (1 day)
   - No minimum length or complexity requirements
   - **Risk:** Weak passwords = account compromise
   - **Solution:** Add validation (min 8 chars, complexity rules)

**Acceptance Criteria:**

- Service fee matches documentation
- All user inputs sanitized (XSS protection)
- Rate limiting active on all critical endpoints
- CSRF protection verified
- .env.example created with documentation
- Password requirements enforced

---

#### WTBD-2: Infrastructure Migration

**Priority:** **CRITICAL - PRODUCTION BLOCKER** | **Estimated Effort:** 1 week

**Critical Issues:**

1. **PostgreSQL Migration** (3-5 days)
   - SQLite is not production-ready (no concurrent writes, file-based locking)
   - **Solution:** Migrate to PostgreSQL (Neon, Supabase, or Railway)
   - **Scope:** Update Prisma schema, migrate data, test all queries
   - **Impact:** Required for multi-user production environment

2. **Error Tracking Setup** (1 day)
   - No Sentry or similar error tracking
   - **Risk:** Production bugs are invisible
   - **Solution:** Set up Sentry or similar service
   - **Scope:** Capture errors, track performance, monitor uptime

3. **Production Hosting** (1-2 days)
   - Configure production deployment (Vercel, Railway, or Russian providers)
   - Set up staging + production environments
   - Configure environment variables securely
   - Set up monitoring and logging

**Acceptance Criteria:**

- PostgreSQL database configured and tested
- All data migrated successfully
- Error tracking active and tested
- Staging and production environments deployed
- Monitoring and logging operational

---

### Short-Term Priority (Weeks 4-6) - CRITICAL FEATURES

**Goal:** Add essential features that significantly impact user experience and retention.

#### WTBD-3: Email Notifications

**Priority:** **HIGH - USER EXPERIENCE** | **Estimated Effort:** 1 week

**Why Critical:**

- Users miss critical updates (application accepted, work submitted, messages received)
- Manual dashboard checking creates friction
- Reduces engagement and retention

**Scope:**

- Set up email service (SendGrid, Postmark, or similar)
- Implement notification triggers for critical events:
  - Application received (CLIENT)
  - Application accepted/rejected (SPECIALIST)
  - Work submitted for review (CLIENT)
  - Work approved (SPECIALIST)
  - New message received (both)
  - Gig closed by admin (both)
- Email templates (simple, text-based acceptable for MVP)
- Unsubscribe mechanism

**Acceptance Criteria:**

- Email service configured and tested
- All critical events trigger notifications
- Emails are delivered reliably
- Unsubscribe mechanism works
- Email templates are professional and clear

---

#### WTBD-4: Password Reset

**Priority:** **HIGH - USER EXPERIENCE** | **Estimated Effort:** 2-3 days

**Why Critical:**

- Users who forget passwords are permanently locked out
- Creates support burden
- Poor user experience

**Scope:**

- Generate secure reset tokens
- Send reset email with time-limited link
- Reset password form with validation
- Invalidate old sessions after reset

**Acceptance Criteria:**

- Users can request password reset via email
- Reset tokens are secure and time-limited
- Password reset flow works end-to-end
- Old sessions invalidated after reset

---

#### WTBD-5: Pagination

**Priority:** **MEDIUM - PERFORMANCE** | **Estimated Effort:** 2-3 days

**Why Important:**

- Current implementation loads ALL open gigs at once
- Performance degradation with 100+ gigs
- Poor user experience with large datasets

**Scope:**

- Add pagination to gig browsing (/dashboard/gigs)
- Add pagination to admin user/gig management
- Maintain filter/search functionality with pagination
- Show page numbers and navigation

**Acceptance Criteria:**

- Gig browsing shows 20-50 gigs per page
- Pagination controls work correctly
- Filters and search work with pagination
- Performance improved for large datasets

---

### Medium-Term Priority (Weeks 7-10) - QUALITY & POLISH

**Goal:** Improve code quality, add test coverage, and refine UI/UX.

#### WTBD-6: Test Coverage

**Priority:** **HIGH - CODE QUALITY** | **Estimated Effort:** 2-3 weeks

**Why Important:**

- Zero test coverage = cannot deploy confidently
- Regressions will go unnoticed
- Business logic bugs undetected

**Scope:**

- Set up testing framework (Jest, Vitest)
- Unit tests for critical business logic:
  - Gig lifecycle state transitions
  - Application acceptance/rejection
  - Authorization checks
  - Service fee calculations
- Integration tests for critical paths:
  - User registration → gig creation → application → acceptance → completion → payment
  - Messaging flow
  - Admin moderation
- E2E tests for critical user journeys (Playwright)

**Acceptance Criteria:**

- Testing framework configured
- Critical business logic covered by unit tests
- Critical paths covered by integration tests
- Key user journeys covered by E2E tests
- Tests run in CI/CD pipeline

---

#### WTBD-7: UI/UX Implementation

**Priority:** **HIGH - USER EXPERIENCE** | **Estimated Effort:** 4-6 weeks

**Why Important:**

- Current UI is functional but not polished
- Designer team needs to implement proper designs
- Professional UI critical for B2B marketplace credibility

**Approach Options:**

**Option A: AI-Assisted Implementation (Desktop-Only)**

- Install shadcn/ui component library
- Create design system document (colors, spacing, typography)
- Designer exports Figma screens as PNG (1280px width)
- Use Claude with vision to implement designs
- Iterate 2-3 times per page for accuracy
- **Estimated accuracy:** 80-90% with 2-3 iterations
- **Timeline:** 4-6 weeks
- **Cost:** $20/month for v0.dev (optional)

**Option B: Hire Frontend Developer (Part-Time)**

- Find frontend dev for 40-80 hours
- They implement designer's Figma mockups
- **Timeline:** 2-3 weeks
- **Cost:** 50k-100k RUB one-time

**Option C: Hybrid Approach**

- Use shadcn/ui for component foundation
- AI implements layout and structure
- Frontend dev polishes and perfects
- **Timeline:** 3-4 weeks
- **Cost:** 30k-50k RUB

**Scope:**

- Implement designs for all key pages:
  - Landing page
  - Registration/login
  - Client dashboard
  - Specialist dashboard
  - Gig creation form
  - Gig detail page
  - Gig browsing with filters
  - Profile pages
  - Admin dashboard
  - Messaging interface
- Ensure visual consistency across all pages
- Desktop-only (1280px+ width)
- Maintain all existing functionality

**Acceptance Criteria:**

- All pages match designer's mockups (80%+ accuracy)
- Visual consistency maintained across platform
- All existing functionality preserved
- Design system documented
- Component library established

---

### Long-Term Priority (Weeks 11-12) - PRODUCTION READINESS

**Goal:** Final validation and preparation for real user deployment.

#### WTBD-8: Production Validation

**Priority:** **CRITICAL - LAUNCH READINESS** | **Estimated Effort:** 1-2 weeks

**Scope:**

1. **Security Audit**
   - Review all security fixes
   - Penetration testing (basic)
   - Verify HTTPS, secure cookies, CSRF protection
   - Check for common vulnerabilities (OWASP Top 10)

2. **Performance Testing**
   - Load testing with realistic user volumes
   - Database query optimization
   - Identify and fix bottlenecks
   - Set up performance monitoring

3. **End-to-End Testing**
   - Complete user journeys with real data
   - Test all edge cases and error scenarios
   - Verify email notifications work
   - Test admin moderation flows

4. **Documentation**
   - Deployment guide
   - Environment setup instructions
   - Troubleshooting guide
   - API documentation (if needed)

5. **Beta Testing**
   - Deploy to staging environment
   - Recruit 5-10 friendly beta testers
   - Gather feedback on functionality and UX
   - Fix critical issues discovered

**Acceptance Criteria:**

- Security audit passed
- Performance meets targets (page load <2s, API response <500ms)
- All critical paths tested end-to-end
- Documentation complete
- Beta testing completed with positive feedback
- All critical bugs fixed

---

---

## Completed Development Changes (Archive)

### Changes 1-20: COMPLETE ✅

All 20 changes have been successfully implemented and archived in `openspec/archive/`. Each change includes:

- Proposal document (problem statement, solution approach, constraints)
- Technical specs (database, UI, business logic)
- Task breakdown
- Validation reports
- Archive summaries

**Key Achievements:**

**Core Marketplace (Changes 1-9):**

- User authentication and role-based access control
- Gig creation with budget + service fee calculation
- Application system with accept/reject workflow
- Full gig lifecycle (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- Work submission and approval flows

**User Experience (Changes 10-13):**

- Role-specific profiles (client company info, specialist tech stack)
- Gig filtering and search (text, tags, budget range, sorting)
- Admin moderation (suspend users, close gigs, audit logs)
- Payment tracking (logical PAID status)

**Requirements Clarity System (Changes 14-20):**

- Gig-scoped messaging (prevents platform leakage)
- Structured gig requirements (acceptance criteria, goal, deliverables, constraints)
- Structured applications (technical approach, clarifying questions, estimated effort)
- Example gigs with discoverable link from creation form
- Visual distinction in messaging (client vs specialist)
- Bug fixes and UX polish

**Documentation:** All changes documented in `openspec/archive/[change-name]/` with proposals, specs, tasks, and validation reports.

---

## Post-MVP Features (Deferred - NOT Abandoned)

### Strategic Post-MVP Goals

These features remain important long-term goals but are appropriately deferred until after MVP validation with real users.

#### Change 16: payment-gateway-integration

**Priority:** **CRITICAL - MVP BLOCKER** | **Size:** S-M | **Estimated Effort:** 1-2 weeks

**Strategic Context:**
This is one of TWO features blocking MVP launch. Without in-platform messaging, users will negotiate in Telegram, causing:

- **Platform leakage:** Payments happen outside Gigly
- **Lost dispute context:** No record of agreements
- **Reduced retention:** Users don't return to platform

**MVP Scope (Keep Simple):**

- Basic "Gig Chat" or "Context Comments" on gig detail page
- Text-only messages (no file uploads, no read receipts)
- Visible to client and assigned specialist only
- Message history persists
- NO real-time updates needed (page refresh is fine)
- NO notifications (users check manually)

**Business Rationale:**
Prevents platform leakage and maintains context for disputes. This is the minimum viable communication to keep users on-platform and enable dispute resolution.

---

### Implementation Iterations (Ralph Loop)

**Each iteration should take 2-4 hours and be independently testable.**

#### Iteration 14.1: Add Message Model and Basic Storage

**Estimated Time:** 2-3 hours

**Goal:** Enable persistent storage of conversations between clients and specialists.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-1 "Without in-platform messaging, users negotiate in Telegram and the platform loses context for disputes. Build the data foundation for storing gig-scoped conversations between clients and assigned specialists. Requirements: (1) Messages must be permanently stored and retrievable, (2) Each message must be linked to a specific gig and sender, (3) Messages must maintain chronological order, (4) Data structure must support future features (editing, deletion, etc.). Propose: database schema, relations, indexes, and constraints. No UI needed yet - focus on data layer correctness. Test: manually create messages and verify data integrity and relationships."
```

**Acceptance Criteria:**

- Messages can be stored persistently in the database
- Each message is linked to its gig and sender
- Messages maintain chronological order
- Data relationships are correct and enforceable
- Can verify data integrity through database tools

**Test:** Manually create messages via database tools, verify they persist correctly with proper relationships to gigs and users.

---

#### Iteration 14.2: Display Messages on Gig Detail Page

**Estimated Time:** 2-3 hours

**Goal:** Enable users to view conversation history for context and dispute resolution.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-2 "Users need to see the conversation history between client and specialist to maintain context and resolve disputes. Display existing messages on the gig detail page with proper access control. Requirements: (1) Only authorized users (gig owner and assigned specialist) should see messages, (2) Messages should be presented in a way that's easy to follow, (3) Each message should show who sent it and when, (4) Should work with messages created in iteration 14.1. Propose: where to display messages, how to show sender/timestamp, ordering approach, and access control implementation. See project.md for access control principles. Test: verify authorized users see messages and unauthorized users don't."
```

**Acceptance Criteria:**

- Conversation history is visible to authorized users only
- Messages are presented in an easy-to-follow format
- Each message clearly shows sender and timing
- Access control prevents unauthorized viewing
- Works with existing message data

**Test:** View gig as client (see messages). View as assigned specialist (see messages). View as non-assigned specialist (don't see messages).

---

#### Iteration 14.3: Add Message Sending Form

**Estimated Time:** 2-3 hours

**Goal:** Enable two-way communication to prevent platform leakage and maintain context.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-3 "Users can now view message history, but they need to be able to respond to keep conversations on-platform. Without sending capability, users will move to Telegram and the platform loses dispute context. Add message sending functionality with proper validation and access control. Requirements: (1) Only authorized users (client and assigned specialist) can send messages, (2) Messages must be validated to prevent abuse (empty messages, excessive length), (3) New messages should appear immediately after sending, (4) Errors should be handled gracefully. Propose: form design, validation rules, submission handling, and user feedback approach. See project.md for server action patterns. Test: verify authorized users can send messages and they appear correctly, unauthorized users cannot send."
```

**Acceptance Criteria:**

- Authorized users can send messages successfully
- Messages are validated appropriately before saving
- New messages appear after sending
- Unauthorized users cannot send messages
- Errors are handled and communicated clearly

**Test:** Send message as client (succeeds and appears). Send as assigned specialist (succeeds and appears). Try as non-assigned user (fails with clear error).

---

#### Iteration 14.4: Polish and Edge Cases

**Estimated Time:** 1-2 hours

**Goal:** Ensure messaging works smoothly across all scenarios and gig states.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-4 "The basic messaging functionality works, but real-world usage involves edge cases that need handling: gigs without specialists yet, conversations with no messages, distinguishing who said what, closed gigs, etc. Polish the messaging experience to handle these scenarios gracefully. Requirements: (1) Users should understand why messaging isn't available when it's not (e.g., no specialist assigned), (2) Empty conversations should have helpful messaging, (3) Users should easily distinguish between their messages and the other party's messages, (4) Messaging should behave appropriately across all gig statuses. Propose: how to handle each edge case, visual design for message distinction, and what messaging states need special handling. Test: verify messaging works correctly across all gig lifecycle states and edge cases."
```

**Acceptance Criteria:**

- Edge cases are handled with clear, helpful messaging
- Users can easily distinguish between senders in conversation
- Messaging behaves appropriately for each gig status
- Empty states provide helpful context
- No confusing or broken states

**Test:** Check messaging on gig without specialist (clear explanation). Check empty conversation (helpful message). Check closed gig (appropriate behavior). Verify sender distinction is clear.

---

**Total for Change 14:** 4 iterations × 2-3 hours = 8-12 hours (matches original estimate)

---

#### Change 15: structured-requirements-and-applications

**Priority:** **CRITICAL - MVP BLOCKER** | **Size:** M | **Estimated Effort:** 1-2 weeks

**Strategic Context:**
This is one of TWO features blocking MVP launch. Fuzzy requirements and unclear "definition of done" are the root cause of most project failures (not lack of talent). Without structured requirements:

- **Scope creep:** Projects expand endlessly without clear boundaries
- **Disputes:** Client and specialist have different expectations of "done"
- **Low completion rate:** Fuzzy requirements lead to abandoned projects
- **Poor retention:** Bad experiences prevent repeat usage

**Core Philosophy:**
This is NOT about building complex tooling or AI assistance. It's about **thoughtful UX design** that guides non-technical clients to articulate clear requirements and specialists to demonstrate competence through substance (not marketing fluff).

**MVP Scope (Lightweight but Serious):**

**Gig Creation (Client Side):**

- **Required field:** "Definition of Done / Acceptance Criteria" (separate from description, clearly labeled)
- **Optional but guided fields:** Prompts for "Goal/Outcome", "Deliverables", "Existing Context", "Constraints"
- **Helpful UX:** Placeholder text, inline examples, progressive disclosure
- **Soft validation:** Warning before publish if acceptance criteria is too short/vague
- **Example gigs:** 3-5 seeded realistic examples showing what "clear requirements" look like

**Application Form (Specialist Side):**

- **Required fields:**
  - "How will you approach this?" (brief plan/methodology)
  - "Questions/Clarifications needed?" (shows they read carefully)
- **Optional field:** "Estimated time/effort" (helps client compare)
- **Helpful UX:** Prompts that speak to engineering competence, not sales pitches

**Quality Filter (Good Friction):**

- Clients who won't spend 5-10 minutes defining requirements probably aren't serious
- Specialists who won't write a brief approach probably aren't Middle+/Senior
- This creates self-selection on both sides for quality

**Explicitly Deferred to Post-MVP:**

- ❌ AI-assisted requirement generation
- ❌ Structured templates library by gig type
- ❌ Requirement negotiation/clarification flow
- ❌ Automated acceptance criteria validation
- ❌ Requirement versioning/change tracking

**Business Rationale:**
Requirements clarity is a first-class differentiator. FL.ru/Habr are "post and pray" platforms. Gigly is a "Project Success System" that helps define success upfront, then delivers it. The 10% fee is justified by the structure that makes projects succeed, not just gatekeeping.

**Positioning Impact:**

- **vs FL.ru/Habr:** "We help you define success upfront, not just post and pray"
- **vs Toptal:** "Quality through process, not just curation"
- **Value prop:** The 10% fee is for operational value (structure that makes projects succeed), not gatekeeping

---

### Implementation Iterations (Ralph Loop)

**Each iteration should take 2-4 hours and be independently testable.**

#### Iteration 15.1: Add Acceptance Criteria Field to Gig Model

**Estimated Time:** 2-3 hours

**Goal:** Enable clients to define clear success criteria for their gigs.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-1 "Fuzzy requirements cause most project failures - clients and specialists have different expectations of 'done'. Add a dedicated field for clients to define what 'done' looks like, separate from the general description. Requirements: (1) Field must be required (cannot create gig without it), (2) Should be clearly labeled to communicate its purpose, (3) Should have reasonable minimum length to prevent trivial entries, (4) Must be visible to specialists when browsing/applying. Propose: field name, label text, validation rules, and where to display it. See project.md Design Principle #1 (Clarity Through Structure). Test: verify gigs cannot be created without this field, and specialists can see it when evaluating gigs."
```

**Acceptance Criteria:**

- Gig model includes field for defining success criteria
- Field is required during gig creation
- Field has appropriate validation to ensure meaningful content
- Success criteria is visible to specialists on gig detail page
- Label clearly communicates the field's purpose

**Test:** Try to create gig without defining success criteria (should fail). Create gig with success criteria, verify it saves and displays to specialists.

---

#### Iteration 15.2: Add Optional Structured Fields to Gig Creation

**Estimated Time:** 2-3 hours

**Goal:** Help clients articulate requirements through guided prompts without overwhelming them.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-2 "Non-technical clients often struggle to translate their needs into clear requirements. Beyond the required acceptance criteria, provide optional guided fields to help them think through and articulate: what they're trying to achieve, what specific outputs they need, and any constraints or preferences. Requirements: (1) Fields must be optional to avoid form feeling like homework, (2) Use helpful prompts/placeholders to guide thinking, (3) Display filled fields prominently for specialists, (4) Should feel helpful, not bureaucratic. Propose: what aspects to guide clients on, field labels, placeholder text, and display approach. See project.md CLIENT persona pain points. Test: verify clients can create gigs with or without these fields, and filled fields help specialists understand the context."
```

**Acceptance Criteria:**

- Optional fields help clients articulate requirements more clearly
- Prompts guide thinking without feeling mandatory
- Filled fields are visible to specialists when evaluating gigs
- Can create gig without filling optional fields
- Fields feel helpful rather than bureaucratic

**Test:** Create gig with optional fields filled, verify specialists see helpful context. Create gig with only required fields, verify it works smoothly.

---

#### Iteration 15.3: Add Structured Fields to Application Form

**Estimated Time:** 2-3 hours

**Goal:** Enable specialists to demonstrate competence through substance rather than sales pitches.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-3 "Specialists are tired of writing generic 'hire me' cover letters and prefer concrete technical discussions. Replace generic application form with structured fields that let specialists demonstrate competence: how they'd approach the work, what questions they have about requirements, and optionally their time estimate. Requirements: (1) Fields should emphasize technical thinking over marketing, (2) Required fields ensure specialists actually read and think about the gig, (3) Clients should see this information prominently when reviewing applications, (4) Should feel like a professional technical discussion, not a sales pitch. Propose: what information to collect, field labels, prompts, validation rules, and how to display to clients. See project.md SPECIALIST persona - they prefer concrete technical discussions over marketing fluff. Test: verify specialists cannot submit generic applications, and clients receive substantive information to evaluate candidates."
```

**Acceptance Criteria:**

- Application form collects technical substance, not sales pitches
- Required fields ensure specialists engage with the requirements
- Optional fields allow specialists to provide additional context
- Clients see substantive information when reviewing applications
- Form prompts encourage engineering competence over marketing

**Test:** Try to submit minimal application (should require substance). Submit application with technical approach and questions, verify client sees meaningful information for evaluation.

---

#### Iteration 15.4: Create Seed Example Gigs

**Estimated Time:** 2-3 hours

**Goal:** Teach clients what excellent requirements look like through realistic examples.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-4 "First-time clients often don't know what 'good requirements' look like or how detailed to be. Create seed example gigs that demonstrate best practices and teach by example. Requirements: (1) Examples should be realistic and cover diverse project types relevant to the platform, (2) Each example should showcase clear acceptance criteria, well-articulated goals, and appropriate level of detail, (3) Examples should be distinguishable from real gigs when browsing, (4) Should serve as learning tools without cluttering the real marketplace. Propose: how many examples to create, which project types to cover, what makes each a 'good example', and how to mark/display them. Test: verify examples are accessible, demonstrate quality requirements, and don't confuse users as real gigs."
```

**Acceptance Criteria:**

- Seed examples demonstrate what quality requirements look like
- Examples cover diverse, realistic project types
- Examples are clearly marked as educational/examples
- Examples are accessible to users who need inspiration
- Examples don't clutter or confuse the real marketplace

**Test:** Browse gigs as a new client, verify you can find and learn from example gigs. Verify examples demonstrate the level of detail and clarity expected.

---

#### Iteration 15.5a: Add Character Counters

**Estimated Time:** 1-2 hours

**Goal:** Help users gauge field completeness through length feedback.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-5a "Users need feedback on how much they've written in textarea fields to gauge completeness. Add character count feedback for acceptanceCriteria, goal, deliverables, and constraints fields in gig creation form. Requirements: (1) Feedback updates as user types, (2) Shows current length relative to maximum allowed, (3) Styling should be subtle and not distract from form. Propose: display format, placement, and update mechanism. Test: verify users can see their progress while typing in any textarea field."
```

**Acceptance Criteria:**

- Users receive real-time feedback on field length
- Feedback shows relationship between current and maximum length
- Feedback is visible but not visually distracting
- Works for all textarea fields in the form

**Test:** Type in any textarea field, verify you can see how much you've written and how much space remains.

---

#### Iteration 15.5b: Add Soft Validation Warning

**Estimated Time:** 1-2 hours

**Goal:** Guide users toward detailed acceptance criteria without blocking submission.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-5b "Users sometimes write very brief acceptance criteria, which leads to disputes and scope creep. Add soft validation to encourage more detailed criteria without blocking submission. Requirements: (1) Detect when acceptance criteria seems too brief, (2) Provide helpful, encouraging feedback (not punitive), (3) Must NOT prevent form submission, (4) Feedback should clear when user adds sufficient detail. Propose: threshold for 'too brief', warning message text, visual styling, and when to show/hide the warning. Test: verify warning appears for brief input, disappears for detailed input, and never blocks submission."
```

**Acceptance Criteria:**

- Users receive feedback when acceptance criteria is too brief
- Feedback is encouraging and explains why detail matters
- Feedback does not prevent form submission
- Feedback disappears when user provides sufficient detail

**Test:** Enter minimal acceptance criteria (see helpful feedback). Add more detail (feedback disappears). Submit form with brief criteria (submission succeeds despite feedback).

---

#### Iteration 15.5c: Add Visual Form Sections

**Estimated Time:** 1-2 hours

**Goal:** Improve form readability through clear visual organization.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-5c "The gig creation form has many fields that serve different purposes, making it hard for users to understand what information goes where. Organize the form into logical visual sections to improve clarity and reduce cognitive load. Requirements: (1) Group related fields together logically, (2) Make section boundaries visually clear, (3) Use headings to explain what each section is for, (4) Maintain mobile responsiveness. Propose: section groupings, visual styling approach, and heading text. Test: verify users can quickly understand form structure and find the fields they need."
```

**Acceptance Criteria:**

- Form fields are grouped into logical sections
- Section boundaries are visually distinct
- Each section has a clear, descriptive heading
- Layout works well on both desktop and mobile
- Visual hierarchy guides users through the form

**Test:** View gig creation form and verify you can quickly understand what information is needed and where to enter it. Check on mobile to ensure sections remain clear.

---

#### Iteration 15.5d: Link to Example Gigs

**Estimated Time:** 1 hour

**Goal:** Help users learn what good requirements look like through examples.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-5d "Users creating their first gig may not know what good requirements look like or how detailed they should be. Provide easy access to example gigs (created in iteration 15.4) from the gig creation form for inspiration. Requirements: (1) Link should be discoverable without being intrusive, (2) Should clearly communicate its purpose (showing examples), (3) Navigation should not lose user's form progress, (4) Should feel helpful, not mandatory. Propose: link placement, styling, text, and navigation approach (new tab, modal, etc.). Test: verify users can easily find and view example gigs while creating their own."
```

**Acceptance Criteria:**

- Users can easily discover how to view example gigs
- Link purpose is clear from its text/context
- Viewing examples doesn't disrupt form completion
- Link feels helpful rather than mandatory or distracting

**Test:** As a first-time user creating a gig, verify you can find and view example gigs for inspiration without losing your form progress.

---

**Total for Change 15:** 4 iterations (15.1-15.4) × 2-3 hours + 4 sub-iterations (15.5a-15.5d) × 1-2 hours = 12-19 hours

---

---

## ═══════════════════════════════════════════════════════════════════════════════

## PHASE 1.5: MVP QA & POLISH (Production Readiness)

## ═══════════════════════════════════════════════════════════════════════════════

**Phase Status:** 🔄 **CURRENT PHASE** - Development cycle complete, transitioning to production readiness

**Phase Goal:** Verify the platform actually WORKS through comprehensive testing, then harden and polish for production deployment.

**Phase Duration:** 6-10 weeks (depending on resource availability and AI vs human implementation approach)

**Key Principle:** FIRST verify the platform works (tests, mock data, workflow validation). THEN add security and polish features. Testing is not optional - it's the foundation that proves the MVP is functional.

**Priority Order:**

1. **Verify It Works** - Testing foundation, spec-based tests, E2E workflows, mock data
2. **Make It Secure** - Security hardening, input sanitization, rate limiting
3. **Make It Polished** - Pagination, UI/UX improvements, documentation
4. **Make It Production-Ready** - Infrastructure, email, final validation

---

### AI Feasibility Legend

Each change includes an AI feasibility assessment:

- ✅ **FULLY FEASIBLE** - AI can complete with high confidence via ralphy-spec
- ⚠️ **PARTIALLY FEASIBLE** - AI can implement, human review/setup required
- 🔴 **HUMAN REQUIRED** - Cannot be done by AI, requires human expertise
- ⏸️ **BLOCKED** - Depends on external factors (credentials, services, infrastructure)

---

---

#### Change MQP-1: testing-foundation-setup

**Priority:** **CRITICAL - VERIFICATION FOUNDATION** | **Size:** M | **Estimated Effort:** 3-5 days

**AI Feasibility:** ✅ **FULLY FEASIBLE** (90% AI, 10% human verification)

**Strategic Context:**

Zero test coverage means we cannot confidently say the platform works. Before adding security features or polish, we must build the testing infrastructure that will verify the 20 completed changes actually function as specified. This is the foundation for all subsequent testing work.

**Why This Change:**

- Cannot verify platform works without tests
- Need infrastructure before writing tests (can't build skyscraper on flaky foundation)
- Testing framework must support unit, integration, and E2E tests
- Must use openspec documentation as source of truth for test scenarios
- AI needs concrete, verifiable outputs for each iteration

**Scope:**

1. **Testing Framework Setup** - Vitest for unit/integration, Playwright for E2E
2. **Test Database Infrastructure** - In-memory SQLite for fast tests, transaction rollback, seed data helpers
3. **Test Utilities & Helpers** - Authentication helpers, database factories, assertion utilities
4. **Mock Data Generators** - Realistic test data for users, gigs, applications, messages
5. **Example Tests** - Verify setup works with simple passing tests

**AI Implementation Notes:**

This is ideal for AI implementation:

- Well-defined technical setup with clear acceptance criteria
- No external dependencies or credentials needed
- Each iteration produces concrete, verifiable output (tests that run)
- Can be validated by running tests and checking they pass
- Foundation work that naturally groups together

**Explicitly Deferred:**

- ❌ Writing actual feature tests (that's MQP-2)
- ❌ E2E test implementation (that's MQP-3)
- ❌ Production database setup (that's later, infrastructure work)

---

### Implementation Iterations (Ralph Loop)

**Iteration Strategy:** Group naturally connected infrastructure tasks together. Each iteration should produce working, testable infrastructure that subsequent iterations can build upon.

#### Iteration MQP-1.1: Testing Framework Setup & Configuration

**Estimated Time:** 3-4 hours

**Goal:** Install and configure Vitest for unit/integration tests and Playwright for E2E tests.

**Ralphy-Plan Command:**

```
/ralphy-plan testing-framework-setup "Set up comprehensive testing framework for the Gigly platform. We need both unit/integration tests (Vitest) and E2E tests (Playwright). Requirements: (1) Install and configure Vitest for Next.js 15 App Router, (2) Install and configure Playwright for E2E testing, (3) Configure test scripts in package.json (test, test:unit, test:e2e, test:coverage), (4) Set up code coverage reporting with Vitest, (5) Configure test environment variables, (6) Create basic example test to verify setup works. Propose: configuration approach, test script organization, environment setup. Reference: The project uses Next.js 15, Prisma, SQLite. Test: verify example tests run successfully with both frameworks."
```

**Acceptance Criteria:**

- Vitest installed and configured for Next.js 15
- Playwright installed and configured for E2E tests
- Test scripts in package.json work correctly
- Code coverage reporting configured
- Test environment variables configured
- Example tests pass for both frameworks
- Documentation on how to run tests

**Test:** Run `npm test`, verify example test passes. Run `npm run test:coverage`, verify coverage report generated. Run `npm run test:e2e`, verify Playwright test passes.

---

#### Iteration MQP-1.2: Test Database Infrastructure

**Estimated Time:** 3-4 hours

**Goal:** Set up test database with transaction rollback, seed data, and cleanup utilities.

**Ralphy-Plan Command:**

```
/ralphy-plan test-database-setup "Tests need a clean database for each test run. Set up test database infrastructure with transaction rollback and seed data helpers. Requirements: (1) Use in-memory SQLite for fast test execution, (2) Implement transaction rollback pattern (each test runs in transaction, rolled back after), (3) Create database setup/teardown utilities, (4) Create seed data helpers for common test scenarios, (5) Ensure tests are isolated (one test cannot affect another), (6) Support parallel test execution. Propose: database setup approach, transaction management, seed data structure. Reference: Project uses Prisma with SQLite. Test: verify multiple tests can run in parallel without interfering with each other."
```

**Acceptance Criteria:**

- In-memory SQLite configured for tests
- Transaction rollback pattern implemented
- Database setup/teardown utilities created
- Seed data helpers for common scenarios
- Tests are isolated from each other
- Parallel test execution supported
- Fast test execution (in-memory database)

**Test:** Run multiple tests in parallel, verify they don't interfere. Verify database is clean between tests. Verify seed data helpers work correctly.

---

#### Iteration MQP-1.3: Authentication & Session Test Helpers

**Estimated Time:** 2-3 hours

**Goal:** Create utilities for testing authenticated routes and user sessions.

**Ralphy-Plan Command:**

```
/ralphy-plan auth-test-helpers "Most features require authentication. Create test helpers for easily creating authenticated sessions in tests. Requirements: (1) Helper to create test user with specific role (CLIENT, SPECIALIST, ADMIN), (2) Helper to create authenticated session for test user, (3) Helper to make authenticated requests in tests, (4) Support for testing authorization (verify user cannot access forbidden resources), (5) Easy to use in both unit and integration tests. Propose: helper API design, how to create sessions, how to test authorization. Reference: Project uses iron-session for authentication. Test: verify helpers can create users and sessions, and authenticated requests work."
```

**Acceptance Criteria:**

- Helper to create test users with specific roles
- Helper to create authenticated sessions
- Helper to make authenticated requests
- Easy to test authorization failures
- Works in both unit and integration tests
- Clear, simple API for test writers

**Test:** Create CLIENT user, create session, make authenticated request, verify it works. Try to access ADMIN-only resource as CLIENT, verify it fails.

---

#### Iteration MQP-1.4: Mock Data Generators & Factories

**Estimated Time:** 3-4 hours

**Goal:** Create factories for generating realistic test data for all models.

**Ralphy-Plan Command:**

```
/ralphy-plan mock-data-factories "Tests need realistic data for users, gigs, applications, messages, etc. Create factory functions that generate valid test data with sensible defaults. Requirements: (1) Factory for each model (User, Gig, Application, Message, etc.), (2) Factories should create valid data that passes all validations, (3) Support overriding specific fields for test scenarios, (4) Support creating related data (e.g., gig with applications), (5) Use realistic Russian names, companies, and content, (6) Factories should be easy to use and composable. Propose: factory API design, default values, how to handle relations. Reference: Check openspec/archive/ for examples of valid data. Test: verify factories create valid data that can be saved to database."
```

**Acceptance Criteria:**

- Factory for each model (User, Gig, Application, Message, etc.)
- Factories create valid data that passes validations
- Can override specific fields for test scenarios
- Can create related data easily
- Uses realistic Russian content
- Easy to use and composable
- Well-documented with examples

**Test:** Use factories to create user, gig, application, message. Verify all data is valid and can be saved. Verify overriding fields works. Verify creating related data works.

---

**Total for Change MQP-1:** 4 iterations × 2-4 hours = 11-15 hours

---

---

#### Change MQP-1.5: test-infrastructure-maintenance

**Priority:** **MEDIUM - QUALITY ASSURANCE** | **Size:** S | **Estimated Effort:** 1-2 days

**AI Feasibility:** ✅ **FULLY FEASIBLE** (95% AI, 5% human review)

**Strategic Context:**

During the development cycle, the project accumulated legacy test scripts in `scripts/test-*.ts` (26 files) that served as build verification scripts before proper test infrastructure existed. Now that comprehensive testing infrastructure is in place (MQP-1), these legacy scripts create confusion and maintenance burden. Additionally, test database files (`memdb_*.db`) accumulate in the project root, cluttering the workspace.

**Why This Change:**

- **Prevent confusion:** Legacy scripts use custom test runner (pass/fail functions) vs real tests use Vitest framework
- **Risk of AI confusion:** Future AI agents might mistake legacy scripts for real tests and skip proper test implementation
- **Workspace pollution:** 32+ .db files accumulate in project root (3.5+ MB)
- **Maintenance burden:** Two parallel "test" systems create confusion for developers
- **Quality assurance:** Establish clear standards for test organization going forward

**Problem Analysis:**

1. **Legacy Scripts Pattern:**
   - Located in `scripts/test-*.ts` (26 files)
   - Use custom test runner: `function pass(name)`, `function fail(name, reason)`
   - Directly manipulate database without proper isolation
   - More like "smoke tests" than proper unit/integration tests

2. **Real Tests Pattern:**
   - Located in `__tests__/` directory
   - Use Vitest framework: `describe()`, `it()`, `expect()`
   - Proper test isolation, mocking, and fixtures
   - 376 tests with comprehensive coverage

3. **Database File Pollution:**
   - Test workers create per-worker databases (`memdb_0.db` through `memdb_29.db`)
   - Files persist after test runs (not cleaned up automatically)
   - `.gitignore` correctly excludes them, but workspace remains cluttered

**Scope:**

1. **Archive Legacy Test Scripts** - Move `scripts/test-*.ts` to `scripts/legacy-tests/` with README explaining their historical purpose
2. **Test Organization Guidelines** - Document clear standards for test file organization and naming
3. **Database Cleanup Automation** - Add npm script to clean test database files
4. **Prevention Mechanism** - Add documentation and linting rules to prevent future confusion
5. **Test Infrastructure Documentation** - Create comprehensive guide for writing tests

**AI Implementation Notes:**

This is ideal for AI implementation:

- Clear file operations (move, create documentation)
- Well-defined acceptance criteria
- No external dependencies
- Easy to verify (check files moved, scripts work)

**Explicitly Deferred:**

- ❌ Deleting legacy scripts (preserve for historical reference)
- ❌ Rewriting legacy scripts as proper tests (not needed - functionality already covered)
- ❌ Changing test framework or infrastructure (already established in MQP-1)

---

### Implementation Iterations (Ralph Loop)

**Iteration Strategy:** Group related cleanup and documentation tasks together. Each iteration produces concrete, verifiable improvements to test infrastructure organization.

#### Iteration MQP-1.5.1: Archive Legacy Test Scripts

**Estimated Time:** 1-2 hours

**Goal:** Move legacy test scripts to archive location with clear documentation of their purpose.

**Ralphy-Plan Command:**

```
/ralphy-plan archive-legacy-tests "The project has 26 legacy test scripts in scripts/test-*.ts that were created before proper test infrastructure existed. These scripts use a custom test runner (pass/fail functions) and can be confused with real tests in __tests__/. Archive these scripts to prevent confusion while preserving them for historical reference. Requirements: (1) Create scripts/legacy-tests/ directory, (2) Move all scripts/test-*.ts files to scripts/legacy-tests/, (3) Create scripts/legacy-tests/README.md explaining these are legacy build verification scripts, not real tests, (4) Document that real tests are in __tests__/ directory using Vitest, (5) Preserve scripts for historical reference (do not delete). Propose: directory structure, README content, what to document. Test: verify all test-*.ts files moved, README is clear, real tests in __tests__/ still work."
```

**Acceptance Criteria:**

- All `scripts/test-*.ts` files moved to `scripts/legacy-tests/`
- `scripts/legacy-tests/README.md` created with clear explanation
- README explains difference between legacy scripts and real tests
- README directs developers to `__tests__/` for real tests
- No test-\*.ts files remain in `scripts/` root
- Real tests in `__tests__/` still run correctly

**Test:** Run `ls scripts/test-*.ts`, verify no files found. Run `ls scripts/legacy-tests/`, verify 26 files present. Run `npm test`, verify real tests still work.

---

#### Iteration MQP-1.5.2: Add Test Database Cleanup Automation

**Estimated Time:** 1 hour

**Goal:** Automate cleanup of test database files that accumulate in project root.

**Ralphy-Plan Command:**

```
/ralphy-plan test-db-cleanup "Test workers create per-worker database files (memdb_*.db) that persist after test runs, cluttering the project root with 30+ files. Add npm script to clean these files automatically. Requirements: (1) Add 'clean:test-db' script to package.json that removes memdb_*.db, memdb_*.db-wal, memdb_*.db-shm, and test.db files, (2) Add 'test:clean' script that runs cleanup before tests, (3) Document cleanup scripts in README or test documentation, (4) Ensure .gitignore already excludes these files (verify, don't modify). Propose: script commands, when to run cleanup, documentation approach. Test: create dummy .db files, run cleanup script, verify files removed."
```

**Acceptance Criteria:**

- `clean:test-db` script added to package.json
- Script removes all test database files (memdb\_\*.db, test.db, and WAL/SHM files)
- `test:clean` script runs cleanup before tests
- Scripts documented in appropriate location
- `.gitignore` verified to exclude test database files
- Scripts work on both Unix and Windows

**Test:** Create dummy `memdb_test.db` file. Run `npm run clean:test-db`, verify file removed. Run `npm run test:clean`, verify tests run after cleanup.

---

#### Iteration MQP-1.5.3: Create Test Organization Guidelines

**Estimated Time:** 2-3 hours

**Goal:** Document clear standards for test organization to prevent future confusion.

**Ralphy-Plan Command:**

```
/ralphy-plan test-organization-guidelines "Create comprehensive documentation for test organization standards to prevent confusion between real tests and build verification scripts. Requirements: (1) Create __tests__/README.md documenting test organization, (2) Explain directory structure (__tests__/unit/, __tests__/integration/, __tests__/e2e/), (3) Document naming conventions (*.test.ts for real tests), (4) Explain difference between real tests (Vitest framework) and build verification scripts, (5) Provide examples of proper test structure, (6) Document when to write unit vs integration vs E2E tests, (7) Reference test helpers and utilities available. Propose: documentation structure, what to include, examples to provide. Test: verify documentation is clear and comprehensive."
```

**Acceptance Criteria:**

- `__tests__/README.md` created with comprehensive guidelines
- Directory structure clearly documented
- Naming conventions explained
- Difference between test types explained
- Examples of proper test structure provided
- Guidelines for when to write each test type
- References to test helpers and utilities
- Clear statement that scripts/ is NOT for tests

**Test:** Read documentation, verify it's clear and comprehensive. Verify examples are accurate. Verify it prevents confusion about where tests belong.

---

#### Iteration MQP-1.5.4: Add Test Quality Checklist

**Estimated Time:** 1-2 hours

**Goal:** Create checklist for reviewing test quality and preventing common issues.

**Ralphy-Plan Command:**

```
/ralphy-plan test-quality-checklist "Create a test quality checklist to ensure consistent test quality and prevent common issues. Requirements: (1) Create TESTING_CHECKLIST.md in project root or docs/, (2) Include checklist items for test isolation (no shared state), (3) Include items for proper mocking and fixtures, (4) Include items for test naming and organization, (5) Include items for avoiding flaky tests, (6) Include items for test coverage expectations, (7) Include section on what NOT to do (e.g., don't create test-*.ts in scripts/), (8) Make checklist actionable and specific. Propose: checklist structure, what items to include, how to make it actionable. Test: verify checklist is comprehensive and actionable."
```

**Acceptance Criteria:**

- Test quality checklist created
- Checklist covers test isolation
- Checklist covers mocking and fixtures
- Checklist covers naming and organization
- Checklist covers avoiding flaky tests
- Checklist covers coverage expectations
- Checklist includes "what NOT to do" section
- Checklist is actionable and specific
- Checklist can be used for code reviews

**Test:** Review checklist against existing tests, verify it catches real issues. Verify checklist is practical and not just theoretical.

---

**Total for Change MQP-1.5:** 4 iterations × 1-3 hours = 5-8 hours (1-2 days)

**OUTCOME:** Clear test organization standards, no confusion between legacy scripts and real tests, automated cleanup of test artifacts, comprehensive documentation for future development.

---

---

#### Change MQP-2: spec-based-feature-tests

**Priority:** **CRITICAL - VERIFICATION** | **Size:** XL | **Estimated Effort:** 3-4 weeks

**AI Feasibility:** ⚠️ **PARTIALLY FEASIBLE** (70% AI, 30% human review)

**Strategic Context:**

The platform has 20 completed changes documented in openspec/archive/. Each change has detailed specs with requirements and scenarios. We must verify that the implementation matches these specs through comprehensive unit and integration tests. This is not "write some tests and hope they pass" - this is methodical verification using the spec documentation as the source of truth.

**Why This Change:**

- 20 completed changes with zero test coverage
- Extensive spec documentation available in openspec/archive/
- Each spec has clear requirements and scenarios to test
- AI can read specs and write accurate tests (not guessing edge cases)
- Must verify business logic, state transitions, authorization, and workflows

**Scope:**

Write comprehensive tests for all 20 completed changes:

1. **Authentication & Authorization** (Changes 1-3) - Registration, login, role-based access
2. **Gig Lifecycle** (Changes 4-7) - Creation, browsing, filtering, state transitions
3. **Application Flow** (Changes 8-9) - Apply, accept/reject, auto-reject logic
4. **Work Submission** (Changes 10-11) - Submit work, approve work, state transitions
5. **Payment Tracking** (Change 12) - Mark as paid, payment status
6. **Messaging** (Change 13) - Send messages, view messages, authorization
7. **Admin Moderation** (Change 14) - Suspend users, close gigs, moderation logs
8. **Requirements Quality** (Change 15) - Gig creation form, validation, examples

**AI Implementation Notes:**

AI can write accurate tests because:

- ✅ Specs provide clear requirements and scenarios
- ✅ Each change has VALIDATION_REPORT.md showing what was tested
- ✅ Specs use MUST/SHALL language for requirements
- ⚠️ Human review needed to ensure tests catch real bugs
- ⚠️ May miss edge cases not documented in specs

**Test Coverage Goals:**

- Unit tests: >80% coverage for business logic
- Integration tests: All critical user journeys
- Authorization tests: All role-based and ownership checks
- State transition tests: All valid and invalid transitions

---

### Implementation Iterations (Ralph Loop)

**Iteration Strategy:** One iteration per openspec change (or group of related changes). Each iteration reads the spec documentation and writes comprehensive tests for that feature area.

#### Iteration MQP-2.1: Authentication & Authorization Tests (Changes 1-3)

**Estimated Time:** 6-8 hours

**Goal:** Verify registration, login, and role-based authorization work correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan auth-tests "Write comprehensive tests for authentication and authorization features. Read the specs from openspec/archive/01-user-registration/, openspec/archive/02-user-login/, and openspec/archive/03-role-based-access/ to understand requirements. Requirements: (1) Test user registration with CLIENT and SPECIALIST roles, (2) Test password hashing with bcrypt, (3) Test login with correct/incorrect credentials, (4) Test session creation and persistence, (5) Test role-based authorization (CLIENT can create gigs, SPECIALIST can apply, ADMIN can moderate), (6) Test unauthorized access is blocked with clear errors. Use the spec scenarios as test cases. Propose: test structure, what scenarios to cover, how to verify authorization. Test: all tests pass and cover the spec requirements."
```

**Acceptance Criteria:**

- Tests for user registration (CLIENT and SPECIALIST roles)
- Tests for password hashing and validation
- Tests for login success and failure scenarios
- Tests for session creation and persistence
- Tests for role-based authorization checks
- Tests verify unauthorized access is blocked
- All spec scenarios covered
- Tests reference spec documentation

**Test:** Run tests, verify all pass. Check coverage for auth code is >80%. Verify tests catch bugs when auth logic is broken.

---

#### Iteration MQP-2.2: Gig Creation & Validation Tests (Change 4)

**Estimated Time:** 4-5 hours

**Goal:** Verify gig creation and validation work correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan gig-creation-tests "Write comprehensive tests for gig creation. Read the following files from openspec/archive/04-gig-creation/: proposal.md, specs/gig/spec.md, and VALIDATION_REPORT.md to understand requirements and scenarios. Requirements: (1) Test gig creation with all required fields (title, description, budget, acceptance criteria), (2) Test structured fields (goal, deliverables, constraints), (3) Test validation (budget must be positive, acceptance criteria required, etc.), (4) Test only CLIENT can create gigs, (5) Test gig defaults to OPEN status, (6) Test tags are stored correctly. Use spec scenarios as test cases. Propose: test structure, what scenarios to cover, validation edge cases. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for gig creation with all required fields
- Tests for structured fields (goal, deliverables, constraints)
- Tests for validation (budget, acceptance criteria, etc.)
- Tests for authorization (only CLIENT can create)
- Tests for default status (OPEN)
- Tests for tags storage
- All spec scenarios covered
- Tests reference spec documentation

**Test:** Run tests, verify all pass. Check coverage for gig creation code is >80%. Verify tests catch validation bugs.

---

#### Iteration MQP-2.3: Gig Browsing, Filtering & Detail View Tests (Changes 5-7)

**Estimated Time:** 4-5 hours

**Goal:** Verify gig browsing, filtering, and detail view work correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan gig-browsing-tests "Write comprehensive tests for gig browsing, filtering, and detail view. Read the following files from openspec/archive/05-gig-browsing/, 06-gig-filtering/, and 07-gig-detail-view/: proposal.md, specs/*/spec.md, and VALIDATION_REPORT.md from each change folder. Requirements: (1) Test gig browsing returns correct gigs for each role, (2) Test filtering by status (OPEN, IN_PROGRESS, etc.), (3) Test filtering by tags, (4) Test filtering by budget range, (5) Test gig detail view shows all information, (6) Test gig detail view shows applications for owner, (7) Test state transitions (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID). Use spec scenarios as test cases. Propose: test structure, what scenarios to cover. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for gig browsing (returns correct gigs per role)
- Tests for filtering by status, tags, budget range
- Tests for gig detail view (all information displayed)
- Tests for gig detail view authorization (applications visible to owner)
- Tests for state transitions (valid and invalid)
- All spec scenarios covered
- Tests reference spec documentation

**Test:** Run tests, verify all pass. Check coverage for gig browsing/filtering code is >80%. Verify tests catch filtering bugs.

---

#### Iteration MQP-2.4: Application Flow Tests (Changes 8-9)

**Estimated Time:** 6-8 hours

**Goal:** Verify application submission, acceptance, rejection, and auto-reject logic work correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan application-tests "Write comprehensive tests for application flow. Read the following files from openspec/archive/08-application-submission/ and 09-application-management/: proposal.md, specs/*/spec.md, and VALIDATION_REPORT.md from each change folder. Requirements: (1) Test SPECIALIST can apply to OPEN gigs, (2) Test application includes approach, questions, estimated effort, (3) Test duplicate applications are prevented, (4) Test CLIENT can accept/reject applications, (5) Test accepting application transitions gig to IN_PROGRESS, (6) Test accepting application auto-rejects other applications, (7) Test only gig owner can accept/reject, (8) Test cannot apply to non-OPEN gigs. Use spec scenarios as test cases. Propose: test structure, what scenarios to cover. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for application submission with all fields
- Tests for duplicate prevention
- Tests for application acceptance flow
- Tests for auto-reject logic when application accepted
- Tests for application rejection
- Tests for authorization (only owner can accept/reject)
- Tests for edge cases (gig not OPEN, already has specialist)
- All spec scenarios covered

**Test:** Run tests, verify all pass. Check coverage for application code is >80%. Verify auto-reject logic works correctly.

---

#### Iteration MQP-2.5: Work Submission & Approval Tests (Changes 10-11)

**Estimated Time:** 4-6 hours

**Goal:** Verify work submission and approval flow work correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan work-submission-tests "Write comprehensive tests for work submission and approval. Read the following files from openspec/archive/10-work-submission/ and 11-work-approval/: proposal.md, specs/*/spec.md, and VALIDATION_REPORT.md from each change folder. Requirements: (1) Test assigned specialist can submit work when gig is IN_PROGRESS, (2) Test submitting work transitions gig to REVIEW, (3) Test CLIENT can approve submitted work, (4) Test approving work transitions gig to COMPLETED, (5) Test only assigned specialist can submit work, (6) Test only gig owner can approve work, (7) Test cannot submit/approve in wrong states. Use spec scenarios as test cases. Propose: test structure, what scenarios to cover. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for work submission by assigned specialist
- Tests for state transition to REVIEW
- Tests for work approval by client
- Tests for state transition to COMPLETED
- Tests for authorization (only assigned specialist, only owner)
- Tests for invalid state transitions
- All spec scenarios covered

**Test:** Run tests, verify all pass. Check coverage for work submission code is >80%. Verify state transitions work correctly.

---

#### Iteration MQP-2.6: Payment Tracking Tests (Change 12)

**Estimated Time:** 3-4 hours

**Goal:** Verify payment tracking (mark as paid) works correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-tracking-tests "Write comprehensive tests for payment tracking. Read the following files from openspec/archive/12-payment-tracking/: proposal.md, specs/gig/spec.md, and VALIDATION_REPORT.md. Requirements: (1) Test CLIENT can mark COMPLETED gig as PAID, (2) Test marking as paid transitions gig to PAID status, (3) Test paidAt timestamp is recorded, (4) Test only gig owner can mark as paid, (5) Test cannot mark as paid if not COMPLETED, (6) Test payment status is displayed correctly. Use spec scenarios as test cases. Propose: test structure, what scenarios to cover. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for marking gig as paid
- Tests for state transition to PAID
- Tests for paidAt timestamp
- Tests for authorization (only owner)
- Tests for invalid state transitions
- All spec scenarios covered

**Test:** Run tests, verify all pass. Check coverage for payment tracking code is >80%.

---

#### Iteration MQP-2.7: Messaging Tests (Change 13)

**Estimated Time:** 4-6 hours

**Goal:** Verify messaging between client and assigned specialist works correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-tests "Write comprehensive tests for messaging. Read the following files from openspec/archive/13-messaging-system/: proposal.md, specs/messaging/spec.md, and VALIDATION_REPORT.md. Requirements: (1) Test CLIENT and assigned SPECIALIST can send messages, (2) Test messages are only visible to gig participants, (3) Test messages are ordered chronologically, (4) Test cannot send messages before specialist is assigned, (5) Test cannot send messages if gig is closed by admin, (6) Test authorization (only client and assigned specialist). Use spec scenarios as test cases. Propose: test structure, what scenarios to cover. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for sending messages
- Tests for message visibility (only participants)
- Tests for message ordering
- Tests for authorization (only client and assigned specialist)
- Tests for edge cases (no specialist assigned, gig closed)
- All spec scenarios covered

**Test:** Run tests, verify all pass. Check coverage for messaging code is >80%. Verify authorization works correctly.

---

#### Iteration MQP-2.8: Admin Moderation Tests (Change 14)

**Estimated Time:** 4-6 hours

**Goal:** Verify admin moderation features work correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan admin-moderation-tests "Write comprehensive tests for admin moderation. Read the following files from openspec/archive/14-admin-moderation/: proposal.md, specs/admin/spec.md, and VALIDATION_REPORT.md. Requirements: (1) Test ADMIN can suspend users, (2) Test suspended users cannot login, (3) Test ADMIN can close gigs with reason, (4) Test closed gigs cannot receive applications or messages, (5) Test moderation actions are logged, (6) Test only ADMIN can perform moderation actions, (7) Test moderation history is visible to admins. Use spec scenarios as test cases. Propose: test structure, what scenarios to cover. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for user suspension
- Tests for suspended user login prevention
- Tests for gig closure
- Tests for closed gig restrictions
- Tests for moderation logging
- Tests for authorization (only ADMIN)
- Tests for moderation history
- All spec scenarios covered

**Test:** Run tests, verify all pass. Check coverage for admin code is >80%. Verify suspended users cannot login.

---

#### Iteration MQP-2.9: Requirements Quality Tests (Change 15)

**Estimated Time:** 3-4 hours

**Goal:** Verify gig creation form improvements work correctly.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-quality-tests "Write comprehensive tests for requirements quality features. Read the following files from openspec/archive/15-requirements-quality/: proposal.md, specs/ui/spec.md, and VALIDATION_REPORT.md. Requirements: (1) Test gig creation form has all required fields, (2) Test structured fields (goal, deliverables, constraints) are saved correctly, (3) Test acceptance criteria field is required, (4) Test example gigs are marked with isExample flag, (5) Test example gigs cannot receive applications, (6) Test form validation works correctly. Use spec scenarios as test cases. Propose: test structure, what scenarios to cover. Test: all tests pass and cover spec requirements."
```

**Acceptance Criteria:**

- Tests for gig creation with structured fields
- Tests for acceptance criteria requirement
- Tests for example gig creation
- Tests for example gig restrictions
- Tests for form validation
- All spec scenarios covered

**Test:** Run tests, verify all pass. Check coverage for gig creation code is >80%. Verify example gigs cannot receive applications.

---

**Total for Change MQP-2:** 9 iterations × 3-6 hours = 40-62 hours (3-4 weeks)

**HUMAN REVIEW REQUIRED:** All tests must be reviewed by human to ensure they test the right behavior and catch real bugs, not just pass because they test the wrong things.

---

---

#### Change MQP-3: e2e-workflow-tests

**Priority:** **HIGH - VERIFICATION** | **Size:** M | **Estimated Effort:** 1-2 weeks

**AI Feasibility:** ⚠️ **PARTIALLY FEASIBLE** (60% AI, 40% human review)

**Strategic Context:**

Unit and integration tests verify individual features work, but E2E tests verify complete user journeys work from start to finish. These tests simulate real user behavior in a browser and catch integration issues that unit tests miss. E2E tests are the final verification that the platform actually works as users will experience it.

**Why This Change:**

- Verify complete user journeys work end-to-end
- Catch integration issues between features
- Test real browser behavior (forms, navigation, sessions)
- Validate critical workflows before production
- Provide confidence that platform works for real users

**Scope:**

Write E2E tests for critical user journeys:

1. **Client Journey** - Register → Create gig → Review applications → Accept specialist → Approve work → Mark as paid
2. **Specialist Journey** - Register → Browse gigs → Apply to gig → Submit work → Receive payment
3. **Messaging Flow** - Client and specialist exchange messages after assignment
4. **Admin Moderation** - Admin suspends user, closes gig, views moderation logs
5. **Error Scenarios** - Invalid inputs, unauthorized access, edge cases

**AI Implementation Notes:**

AI can write E2E tests but:

- ⚠️ May miss important user interactions
- ⚠️ May not test realistic scenarios
- ⚠️ Playwright selectors may be fragile
- 🔴 Human review needed to ensure tests are comprehensive
- ⚠️ Tests may be flaky and need stabilization

**Test Coverage Goals:**

- All critical user journeys covered
- Happy path and error scenarios tested
- Tests are stable and not flaky
- Tests run in reasonable time (<5 minutes total)

---

### Implementation Iterations (Ralph Loop)

**Iteration Strategy:** One iteration per major user journey. Each iteration writes complete E2E test for that workflow.

#### Iteration MQP-3.1: Client Complete Journey E2E Test

**Estimated Time:** 4-6 hours

**Goal:** Verify complete client journey from registration to payment works end-to-end.

**Ralphy-Plan Command:**

```
/ralphy-plan client-journey-e2e "Write E2E test for complete client journey using Playwright. Requirements: (1) Register as CLIENT, (2) Login, (3) Create gig with all required fields, (4) Wait for specialist to apply (create specialist and application in test setup), (5) Review and accept application, (6) Wait for work submission (submit work in test), (7) Approve work, (8) Mark as paid, (9) Verify gig status is PAID at end. Test should simulate real user interactions with browser. Propose: test structure, how to handle async operations, how to verify each step. Test: E2E test passes and covers complete client journey."
```

**Acceptance Criteria:**

- E2E test covers complete client journey
- Test registers, logs in, creates gig
- Test accepts application and approves work
- Test marks gig as paid
- Test verifies final state is correct
- Test is stable and not flaky
- Test uses realistic data

**Test:** Run E2E test, verify it passes. Run multiple times, verify it's stable.

---

#### Iteration MQP-3.2: Specialist Complete Journey E2E Test

**Estimated Time:** 4-6 hours

**Goal:** Verify complete specialist journey from registration to work submission works end-to-end.

**Ralphy-Plan Command:**

```
/ralphy-plan specialist-journey-e2e "Write E2E test for complete specialist journey using Playwright. Requirements: (1) Register as SPECIALIST, (2) Login, (3) Browse available gigs, (4) Apply to gig with approach and questions, (5) Wait for acceptance (accept application in test setup), (6) Submit work with description, (7) Wait for approval (approve work in test), (8) Verify gig status is COMPLETED. Consider whether the suggestions are enough. Test should simulate real user interactions. Propose: test structure, how to handle async operations, how to verify each step. Test: E2E test passes and covers complete specialist journey."
```

**Acceptance Criteria:**

- E2E test covers complete specialist journey
- Test registers, logs in, browses gigs
- Test applies to gig with all fields
- Test submits work after acceptance
- Test verifies final state is correct
- Test is stable and not flaky
- Test uses realistic data

**Test:** Run E2E test, verify it passes. Run multiple times, verify it's stable.

---

#### Iteration MQP-3.3: Messaging Flow E2E Test

**Estimated Time:** 3-4 hours

**Goal:** Verify messaging between client and specialist works end-to-end.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-flow-e2e "Write E2E test for messaging flow using Playwright. Requirements: (1) Set up gig with assigned specialist (create in test setup), (2) Login as client, send message to specialist, (3) Logout, login as specialist, verify message is visible, (4) Send reply as specialist, (5) Logout, login as client, verify reply is visible, (6) Verify messages are ordered chronologically. Consider whether the suggestions are enough. Test should simulate real user interactions. Propose: test structure, how to switch users, how to verify messages. Test: E2E test passes and covers messaging flow."
```

**Acceptance Criteria:**

- E2E test covers messaging flow
- Test sends messages as both client and specialist
- Test verifies messages are visible to both parties
- Test verifies message ordering
- Test switches between users correctly
- Test is stable and not flaky

**Test:** Run E2E test, verify it passes. Verify messages are exchanged correctly.

---

#### Iteration MQP-3.4: Admin Moderation E2E Test

**Estimated Time:** 3-4 hours

**Goal:** Verify admin moderation features work end-to-end.

**Ralphy-Plan Command:**

```
/ralphy-plan admin-moderation-e2e "Write E2E test for admin moderation using Playwright. Requirements: (1) Create test users and gigs (in test setup), (2) Login as ADMIN, (3) Suspend a user with reason, (4) Logout, try to login as suspended user, verify login fails, (5) Login as ADMIN again, (6) Close a gig with reason, (7) Verify gig shows as closed, (8) Verify moderation history is visible. Consider whether the suggestions are enough. Test should simulate real admin actions. Propose: test structure, how to verify moderation effects. Test: E2E test passes and covers admin moderation."
```

**Acceptance Criteria:**

- E2E test covers admin moderation
- Test suspends user and verifies login fails
- Test closes gig and verifies it's closed
- Test verifies moderation history
- Test uses realistic moderation reasons
- Test is stable and not flaky

**Test:** Run E2E test, verify it passes. Verify suspended user cannot login.

---

#### Iteration MQP-3.5: Error Scenarios E2E Test

**Estimated Time:** 3-4 hours

**Goal:** Verify error handling and edge cases work correctly in browser.

**Ralphy-Plan Command:**

```
/ralphy-plan error-scenarios-e2e "Write E2E test for error scenarios and edge cases using Playwright. Requirements: (1) Test form validation errors are displayed, (2) Test unauthorized access redirects to login, (3) Test trying to apply to closed gig shows error, (4) Test trying to submit work when not assigned shows error, (5) Test invalid state transitions show errors, (6) Verify error messages are clear and helpful. Consider whether the suggestions are enough. Test should cover common error scenarios. Propose: test structure, what errors to test. Test: E2E test passes and covers error scenarios."
```

**Acceptance Criteria:**

- E2E test covers error scenarios
- Test verifies form validation errors
- Test verifies unauthorized access handling
- Test verifies invalid operations show errors
- Test verifies error messages are clear
- Test is stable and not flaky

**Test:** Run E2E test, verify it passes. Verify errors are handled gracefully.

---

**Total for Change MQP-3:** 5 iterations × 3-6 hours = 17-30 hours (1-2 weeks)

**HUMAN REVIEW REQUIRED:** E2E tests must be reviewed to ensure they cover realistic scenarios and are not flaky.

---

---

#### Change MQP-4: security-hardening-core

**Priority:** **CRITICAL - PRODUCTION BLOCKER** | **Size:** M | **Estimated Effort:** 1 week

**AI Feasibility:** ⚠️ **PARTIALLY FEASIBLE** (70% AI, 30% human review)

**Strategic Context:**

Now that we've verified the platform works through comprehensive testing, we must harden it for production. Current codebase has critical security vulnerabilities that must be fixed before real users can use the platform. These are production blockers that could lead to data breaches, account compromises, and platform abuse.

**Why This Change:**

- **XSS vulnerability:** No input sanitization allows script injection
- **Spam vulnerability:** No rate limiting allows abuse
- **Weak passwords:** No requirements allow easy compromise
- **Service fee bug:** 20% in code vs 10% in docs (overcharging users)
- **Missing documentation:** No .env.example for secure deployment

**Scope:**

1. Fix service fee discrepancy (decide 10% or 20%, update code OR docs)
2. Add input sanitization (DOMPurify) for all user-generated content
3. Add rate limiting to prevent spam and brute force attacks
4. Add password requirements (min 8 chars, complexity rules)
5. Create .env.example with secure configuration guidance
6. Verify CSRF protection is active (Next.js 15 built-in)

**AI Implementation Notes:**

AI can implement all code changes, but:

- ⚠️ Rate limiting thresholds require human judgment
- 🔴 Security review by human required before production
- ⚠️ Service fee decision requires business decision

**CRITICAL:** All security changes must be reviewed by human with security expertise before production deployment.

---

### Implementation Iterations (Ralph Loop)

**Iteration Strategy:** One iteration per security fix. Each iteration addresses one vulnerability with tests.

#### Iteration MQP-4.1: Fix Service Fee Discrepancy

**Estimated Time:** 1-2 hours

**Goal:** Resolve discrepancy between documented (10%) and implemented (20%) service fee.

**Ralphy-Plan Command:**

```
/ralphy-plan service-fee-fix "There's a critical discrepancy: documentation states 10% service fee, but code implements 20%. This means clients are being overcharged. Fix this discrepancy by updating code to 10% to match documentation. Requirements: (1) Update service fee calculation in app/actions/gig.ts to 10%, (2) Update any UI text that mentions the fee, (3) Ensure consistency across codebase, (4) Add test to verify fee calculation is correct. Propose: what needs to be changed, how to ensure consistency. Test: verify service fee calculation is 10% and matches documentation."
```

**Acceptance Criteria:**

- Service fee is 10% (matches documentation)
- Fee calculation in code is correct
- All UI text mentions 10%
- Test verifies correct fee calculation
- Consistency across codebase

**Test:** Create gig with 100,000 RUB budget. Verify service fee is 10,000 RUB (10%). Check all docs mention 10%.

---

#### Iteration MQP-4.2: Add Input Sanitization

**Estimated Time:** 3-4 hours

**Goal:** Prevent XSS attacks by sanitizing all user-generated content.

**Ralphy-Plan Command:**

```
/ralphy-plan input-sanitization "User-generated content (gig descriptions, messages, profiles) is not sanitized, allowing XSS attacks. Add DOMPurify to sanitize all user inputs before storage and display. Requirements: (1) Install isomorphic-dompurify library, (2) Sanitize all user inputs in server actions before database storage, (3) Sanitize on display as additional safety layer, (4) Preserve safe formatting (line breaks), (5) Remove all script tags, event handlers, and dangerous attributes, (6) Add tests to verify XSS payloads are sanitized. Propose: where to add sanitization, DOMPurify configuration. Test: verify malicious scripts are removed while safe content is preserved."
```

**Acceptance Criteria:**

- DOMPurify installed and configured
- All user inputs sanitized before storage
- Sanitization applied to: gig descriptions, messages, profile fields, application text
- Script tags and event handlers removed
- Safe formatting preserved
- Tests verify XSS payloads are sanitized

**Test:** Try to submit gig with `<script>alert('XSS')</script>` in description. Verify script is removed but description is saved. Try various XSS payloads, verify all are sanitized.

---

#### Iteration MQP-4.3: Add Rate Limiting

**Estimated Time:** 4-5 hours

**Goal:** Prevent spam and brute force attacks with rate limiting.

**Ralphy-Plan Command:**

```
/ralphy-plan rate-limiting "Server actions have no rate limiting, allowing spam applications, message flooding, and brute force login attempts. Add rate limiting to critical endpoints using upstash/ratelimit or similar. Requirements: (1) Install rate limiting library, (2) Add rate limits to: login (5 attempts/15min), registration (3 attempts/hour), application submission (10/hour), message sending (30/hour), (3) Return clear error messages when rate limit exceeded, (4) Use IP-based rate limiting for anonymous endpoints, user-based for authenticated, (5) Conservative defaults, (6) Add tests to verify rate limits work. Propose: which library to use, rate limit thresholds, error handling. Test: verify rate limits work and show clear errors."
```

**Acceptance Criteria:**

- Rate limiting library installed and configured
- Rate limits applied to: login, registration, applications, messages
- Conservative thresholds set
- Clear error messages when limit exceeded
- IP-based limiting for anonymous endpoints
- User-based limiting for authenticated endpoints
- Tests verify rate limits work

**Test:** Attempt 6 logins in 15 minutes, verify 6th is blocked. Submit 11 applications in 1 hour, verify 11th is blocked. Send 31 messages in 1 hour, verify 31st is blocked.

---

#### Iteration MQP-4.4: Add Password Requirements

**Estimated Time:** 2-3 hours

**Goal:** Enforce strong password requirements to prevent account compromise.

**Ralphy-Plan Command:**

```
/ralphy-plan password-requirements "No password requirements allow weak passwords like '123456'. Add validation to enforce strong passwords. Requirements: (1) Minimum 8 characters, (2) At least one uppercase letter, (3) At least one lowercase letter, (4) At least one number, (5) Clear error messages explaining requirements, (6) Apply to both registration and password reset (when implemented), (7) Add tests to verify validation works. Propose: validation logic, error messages, where to enforce. Test: verify weak passwords are rejected with clear errors."
```

**Acceptance Criteria:**

- Password validation enforced on registration
- Minimum 8 characters required
- Must contain uppercase, lowercase, and number
- Clear error messages explain requirements
- Validation on both client (UX) and server (security)
- Tests verify validation works
- Existing users not affected

**Test:** Try to register with '123456', verify rejected. Try 'Password1', verify accepted. Try 'password1', verify rejected (no uppercase). Try 'PASSWORD1', verify rejected (no lowercase).

---

#### Iteration MQP-4.5: Create .env.example

**Estimated Time:** 1 hour

**Goal:** Provide secure configuration guidance for deployment.

**Ralphy-Plan Command:**

```
/ralphy-plan env-example "No .env.example file means developers don't know what environment variables are required or how to set them securely. Create comprehensive .env.example with all required variables and security guidance. Requirements: (1) Document all required environment variables, (2) Provide example values (not real secrets), (3) Include comments explaining each variable, (4) Provide guidance for generating secure SESSION_SECRET, (5) Include optional variables with defaults. Propose: what variables to document, example values, security guidance. Test: verify .env.example is complete and clear."
```

**Acceptance Criteria:**

- .env.example file created in project root
- All required variables documented
- Example values provided (not real secrets)
- Comments explain purpose of each variable
- Guidance for generating secure SESSION_SECRET
- Optional variables documented with defaults
- Clear instructions for deployment

**Test:** Delete .env, copy .env.example to .env, fill in values following guidance, verify app works.

---

#### Iteration MQP-4.6: Verify CSRF Protection

**Estimated Time:** 1 hour

**Goal:** Confirm Next.js 15 built-in CSRF protection is active.

**Ralphy-Plan Command:**

```
/ralphy-plan csrf-verification "Next.js 15 has built-in CSRF protection for Server Actions, but we need to verify it's active and working. Check that CSRF protection is enabled and document it. Requirements: (1) Verify Next.js CSRF protection is enabled by default, (2) Document CSRF protection status, (3) Ensure no configuration disables CSRF protection, (4) Add note to security documentation. Propose: how to verify CSRF protection, what to document. Test: verify CSRF protection is active."
```

**Acceptance Criteria:**

- Next.js 15 CSRF protection verified as active
- No configuration disables CSRF protection
- CSRF protection status documented
- Team understands CSRF protection is active

**Test:** Verify Server Actions have CSRF protection enabled. Document that Next.js 15 provides built-in CSRF protection.

---

**Total for Change MQP-4:** 6 iterations × 1-5 hours = 12-20 hours (1 week)

**CRITICAL:** Human security review required after implementation before production deployment.

---

---

#### Change MQP-5: mock-data-environment-setup

**Priority:** **HIGH - VERIFICATION** | **Size:** S | **Estimated Effort:** 2-3 days

**AI Feasibility:** ✅ **FULLY FEASIBLE** (90% AI, 10% human verification)

**Strategic Context:**

Tests verify the platform works programmatically, but manual workflow verification is essential. The user's stated priority includes "mock data" and "workflow validation" as part of verification. A realistic development environment with seed data enables manual testing of complete workflows, stakeholder demos, and catching UX issues that automated tests miss.

**Why This Change Belongs in Verification Phase:**

- User explicitly mentioned "mock data" and "workflow validation" as verification priorities
- Enables manual verification of complete workflows (register → create gig → apply → accept → submit → approve → pay)
- Allows stakeholders to see and interact with working platform
- Catches UX issues that automated tests miss
- Relatively small effort (7-11 hours) for high verification value

**Why This Change:**

- Manual testing requires realistic data
- Stakeholders need to see working platform
- Development is easier with pre-populated data
- Can verify workflows by clicking through UI
- Complements automated tests with manual verification

**Scope:**

1. **Seed Script** - Script to populate database with realistic data
2. **Realistic Users** - CLIENT, SPECIALIST, ADMIN accounts with Russian names
3. **Realistic Gigs** - Various gigs in different states (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID)
4. **Applications** - Multiple applications per gig with realistic content
5. **Messages** - Message threads between clients and specialists
6. **Complete Workflows** - At least one complete workflow from start to finish

**AI Implementation Notes:**

This is ideal for AI implementation:

- Well-defined data structure (follows Prisma schema)
- Can reuse test factories from MQP-1
- Clear acceptance criteria (realistic Russian content)
- Easy to verify (run script, check database)

---

### Implementation Iterations (Ralph Loop)

**Iteration Strategy:** Group related seed data together. Create foundation users first, then build gigs and workflows on top.

#### Iteration MQP-5.1: Create Seed Script & Foundation Users

**Estimated Time:** 2-3 hours

**Goal:** Create seed script infrastructure and foundation user accounts.

**Ralphy-Plan Command:**

```
/ralphy-plan seed-script-foundation "Create seed script to populate development database with realistic data. Requirements: (1) Create seed script that can be run with npm command, (2) Clear existing data before seeding (for clean state), (3) Create foundation users: 2 CLIENTs (with company profiles), 3 SPECIALISTs (with profiles and tech stacks), 1 ADMIN, (4) Use realistic Russian names and companies, (5) Use consistent test passwords for easy login, (6) Log created users for reference. Propose: seed script structure, how to clear data safely, what user data to create. Test: run seed script, verify users are created and can login."
```

**Acceptance Criteria:**

- Seed script can be run with npm command
- Script clears existing data safely
- Creates 2 CLIENT users with company profiles
- Creates 3 SPECIALIST users with profiles
- Creates 1 ADMIN user
- Uses realistic Russian names and companies
- Consistent test passwords for easy login
- Logs created users for reference

**Test:** Run `npm run seed`, verify users are created. Login as each user, verify profiles are complete.

---

#### Iteration MQP-5.2: Create Realistic Gigs in Various States

**Estimated Time:** 3-4 hours

**Goal:** Create gigs in all lifecycle states to demonstrate complete workflows.

**Ralphy-Plan Command:**

```
/ralphy-plan seed-gigs-workflows "Create realistic gigs in various states to demonstrate complete platform workflows. Requirements: (1) Create 3-4 OPEN gigs (accepting applications), (2) Create 2 IN_PROGRESS gigs (specialist assigned, work in progress), (3) Create 1 REVIEW gig (work submitted, awaiting approval), (4) Create 1 COMPLETED gig (work approved, awaiting payment), (5) Create 1 PAID gig (complete workflow), (6) Use realistic Russian gig descriptions and requirements, (7) Vary budgets and tags, (8) Include example gig (isExample=true). Propose: what gigs to create, realistic content. Test: browse gigs, verify all states are represented."
```

**Acceptance Criteria:**

- Gigs in all lifecycle states created
- Realistic Russian descriptions and requirements
- Varied budgets and tags
- Example gig included
- Gigs demonstrate complete workflows
- Easy to understand what each gig represents

**Test:** Browse gigs as different users, verify all states are visible. Check gig details, verify content is realistic.

---

#### Iteration MQP-5.3: Create Applications and Messages

**Estimated Time:** 2-3 hours

**Goal:** Create applications for gigs and message threads for assigned gigs.

**Ralphy-Plan Command:**

```
/ralphy-plan seed-applications-messages "Create applications and messages to complete the realistic development environment. Requirements: (1) Create 2-3 applications per OPEN gig (from different specialists), (2) Create applications with realistic approach and questions, (3) For IN_PROGRESS/REVIEW/COMPLETED/PAID gigs, create accepted application, (4) Create message threads between client and assigned specialist (3-5 messages each), (5) Use realistic Russian content for applications and messages. Propose: what applications to create, realistic message content. Test: view applications and messages, verify content is realistic."
```

**Acceptance Criteria:**

- Applications created for all gigs
- Realistic approach and questions in applications
- Accepted applications for assigned gigs
- Message threads for assigned gigs
- Realistic Russian content
- Easy to test messaging and application flows

**Test:** View gig applications, verify content is realistic. View messages, verify conversations make sense.

---

**Total for Change MQP-5:** 3 iterations × 2-4 hours = 7-11 hours (2-3 days)

---

---

#### Change MQP-6: pagination-implementation

**Priority:** **LOW - POLISH (OPTIONAL)** | **Size:** S | **Estimated Effort:** 2-3 days

**AI Feasibility:** ✅ **FULLY FEASIBLE** (95% AI, 5% human testing)

**Strategic Context:**

Current implementation loads ALL gigs at once, causing performance degradation with 100+ gigs. Pagination is a polish feature that improves UX and performance, but it does NOT verify that the platform works. It can be deferred to a later phase if time is limited.

**Why This Change is OPTIONAL:**

- **Does not verify platform works** - This is polish, not verification
- **Not critical for MVP validation** - Platform works without pagination
- **Can be deferred** - Can be added after verification is complete
- **User's priority:** "FIRST verify the platform works. THEN add security and polish."

**When to Implement:**

- **Option A (Recommended):** Defer to post-verification phase after MQP-1 through MQP-4 are complete
- **Option B:** Implement only if time permits and all verification work is done

**Why This Change (if implemented):**

- Performance issue: Loading all gigs causes slow page loads
- Poor UX: Users must scroll through hundreds of gigs
- Scalability blocker: Will break with 500+ gigs
- Standard feature: Users expect pagination on listing pages

**Scope:**

- Add pagination to gig browsing (`/dashboard/gigs`)
- Add pagination to admin user management (`/admin/users`)
- Add pagination to admin gig management (`/admin/gigs`)
- Maintain all existing filter/search functionality
- Show page numbers and navigation controls
- Default: 20-50 items per page

---

### Implementation Iterations (Ralph Loop)

#### Iteration MQP-6.1: Add Pagination to Gig Browsing

**Estimated Time:** 2-3 hours

**Goal:** Enable paginated browsing of gigs to improve performance with large datasets.

**Ralphy-Plan Command:**

```
/ralphy-plan pagination-gig-browsing "Loading all gigs at once causes performance issues with 100+ gigs. Add pagination to gig browsing page to load gigs in manageable chunks. Requirements: (1) Show 20-50 gigs per page, (2) Display page numbers and next/prev navigation, (3) Maintain existing filter and search functionality with pagination, (4) URL should reflect current page for bookmarking, (5) Performance should improve significantly with large datasets. Propose: pagination approach (offset-based), page size, UI design for navigation controls, and how to integrate with existing filters. Test: verify pagination works correctly, filters work with pagination, and performance improves with large datasets."
```

**Acceptance Criteria:**

- Gig browsing shows 20-50 gigs per page
- Page navigation controls work correctly
- Existing filters and search work with pagination
- URL reflects current page
- Performance improved with 100+ gigs
- Edge cases handled

**Test:** Create 100+ test gigs. Browse gigs, verify only 20-50 load per page. Apply filters, verify pagination resets. Navigate pages, verify correct gigs display.

---

#### Iteration MQP-6.2: Add Pagination to Admin Pages

**Estimated Time:** 2-3 hours

**Goal:** Add pagination to admin user and gig management pages.

**Ralphy-Plan Command:**

```
/ralphy-plan pagination-admin-pages "Admin pages will become unusable with 100+ users/gigs. Add pagination to admin user management and gig management pages. Requirements: (1) Show 20-50 items per page on both admin pages, (2) Maintain existing filters with pagination, (3) Display page navigation controls, (4) URL should reflect current page. Propose: how to integrate pagination with existing filters, UI placement for navigation controls. Test: verify pagination works with filters on both admin pages."
```

**Acceptance Criteria:**

- Admin user list shows 20-50 users per page
- Admin gig list shows 20-50 gigs per page
- Page navigation controls work correctly
- Filters work with pagination
- URL reflects current page
- Performance improved with 100+ items

**Test:** Create 100+ test users and gigs. View admin pages, verify pagination works. Apply filters, verify pagination resets.

---

**Total for Change MQP-6:** 2 iterations × 2-3 hours = 4-6 hours (2-3 days)

---

---

## ═══════════════════════════════════════════════════════════════════════════════

## END OF PHASE 1.5: MVP QA & POLISH

## ═══════════════════════════════════════════════════════════════════════════════

**Phase Summary:**

- **Total Changes:** 7 (MQP-1 through MQP-6, including MQP-1.5)
- **Core Changes (Required):** 6 (MQP-1, MQP-1.5, MQP-2, MQP-3, MQP-4, MQP-5)
- **Optional Changes:** 1 (MQP-6 - Pagination)
- **Total Estimated Effort (Core):** 90-142 hours (6-9 weeks)
- **Total Estimated Effort (With Optional):** 94-148 hours (6-10 weeks)
- **AI-Feasible:** 6 changes (MQP-1, MQP-1.5, MQP-2 partial, MQP-3 partial, MQP-5, MQP-6)
- **Human Review Required:** 3 changes (MQP-2, MQP-3, MQP-4)

**Priority Order:**

1. **VERIFY IT WORKS** (Weeks 1-6)
   - MQP-1: Testing Foundation Setup (3-5 days)
   - MQP-1.5: Test Infrastructure Maintenance (1-2 days) - **Cleanup and documentation**
   - MQP-2: Spec-Based Feature Tests (3-4 weeks) - **9 iterations with specific file references**
   - MQP-3: E2E Workflow Tests (1-2 weeks)
   - MQP-5: Mock Data Environment Setup (2-3 days) - **Manual workflow verification**

2. **MAKE IT SECURE** (Week 7)
   - MQP-4: Security Hardening Core (1 week)

3. **MAKE IT POLISHED (OPTIONAL)** (Week 8)
   - MQP-6: Pagination Implementation (2-3 days) - **Can be deferred**

**Recommended Implementation Sequence:**

```
Week 1: MQP-1 (Testing Foundation)
  ↓
Week 1: MQP-1.5 (Test Infrastructure Maintenance) - Cleanup legacy scripts, add automation
  ↓
Weeks 2-5: MQP-2 (Spec-Based Tests) - Verify all 20 changes work
  ↓
Week 5-6: MQP-3 (E2E Tests) - Verify complete workflows work
  ↓
Week 6: MQP-5 (Mock Data) - Manual workflow verification
  ↓
Week 7: MQP-4 (Security Hardening) - Fix vulnerabilities
  ↓
Week 8 (Optional): MQP-6 (Pagination) - Polish feature, can be deferred
```

**Key Improvements Made:**

- ✅ **Split MQP-2.2** into two iterations for consistent granularity (4-5 hours each)
- ✅ **Added specific file references** to all MQP-2 iterations (proposal.md, specs/\*/spec.md, VALIDATION_REPORT.md)
- ✅ **Elevated MQP-5** to HIGH priority as part of verification (manual workflow testing)
- ✅ **Marked MQP-6** as OPTIONAL - can be deferred to post-verification phase

**Key Principles:**

- **Testing First:** Cannot add features until we verify existing features work
- **Spec-Driven:** Use openspec documentation as source of truth for tests
- **AI-Friendly:** Small, concrete iterations with verifiable outputs
- **Human Review:** Tests must be reviewed to ensure they catch real bugs
- **No New Features:** This phase only verifies, hardens, and polishes existing work

**Deferred to Later:**

- ⏸️ **Password Reset** - Requires email service and infrastructure (not critical for MVP)
- ⏸️ **Email Notifications** - Requires infrastructure and email service setup
- ⏸️ **Infrastructure Migration** - PostgreSQL, hosting, monitoring (human DevOps work)
- ⏸️ **UI/UX Polish** - Designer mockups and implementation (can launch with functional UI)
- ⏸️ **Production Validation** - Security audit, performance testing, beta testing (final gate)

**What This Phase Achieves:**

✅ Comprehensive test coverage (unit, integration, E2E)
✅ Verification that all 20 changes work as specified
✅ Manual workflow verification with realistic seed data
✅ Security hardening (XSS, rate limiting, password requirements)
✅ Confidence to deploy to production
⚠️ Performance improvements (pagination) - **OPTIONAL, can be deferred**

**What's Still Needed for Production:**

- Infrastructure setup (PostgreSQL, hosting, domain)
- Email service integration
- UI/UX polish from designer team
- Security audit by human expert
- Performance testing and optimization
- Beta testing with real users

**Budget Estimate:**

- AI implementation (core): Included in development time (6-9 weeks)
- AI implementation (with optional): Included in development time (6-10 weeks)
- Human security review: 20-40k RUB (after MQP-4)
- Infrastructure (later): $50-100/month
- UI/UX polish (later): 30-50k RUB
- **Total for Phase 1.5 (core): 20-40k RUB + 6-9 weeks AI work**
- **Total for Phase 1.5 (with optional): 20-40k RUB + 6-10 weeks AI work**

---

---

### Phase 2: Post-MVP Infrastructure (Build After Validation)

---

#### Change 16: payment-gateway-integration

**Priority:** **POST-MVP** (Downgraded from CRITICAL) | **Size:** XL | **Estimated Effort:** 4-6 weeks

**MVP Status:** ⏸️ **DEFERRED - NOT ABANDONED**

**Why Downgraded for MVP:**

- MVP uses logical PAID status (flag in database), not real financial transactions
- Goal is to validate that users complete the core loop, not process real money
- Real payment integration comes AFTER proving operational value

**MVP Alternative:**

- Clients mark gigs as PAID manually (logical status only)
- No actual money transfer through platform
- Users handle payments externally (bank transfer, etc.)
- Platform tracks status for workflow management

**When to Build:**

- AFTER validating >30% organic retention
- AFTER proving users complete core loop (>60% completion rate)
- AFTER reaching 20+ active clients posting regularly

**Strategic Importance:**
This remains a **critical post-MVP goal**. Real payment processing with escrow is core to the long-term value proposition. But it's not needed to validate that companies will use the platform to find specialists and specialists will use it to find work.

**Business Rationale (Post-MVP):**
Without real payments, Gigly is a coordination tool. With real payments and escrow, Gigly becomes a financial guarantor. The escrow model is the core value proposition for scaling, but not for MVP validation.

---

### Implementation Iterations (Ralph Loop)

**Each iteration should take 2-4 hours and be independently testable.**

#### Iteration 16.1: Research and Select Payment Provider

**Estimated Time:** 3-4 hours

**Goal:** Choose the right payment provider for Russian B2B marketplace with escrow needs.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-1 "The platform needs real payment processing with escrow capability for the Russian market. Research and select a payment provider that fits the business model and technical requirements. Requirements: (1) Must support Russian market (RUB, local regulations), (2) Must support escrow or hold-and-release functionality for marketplace model, (3) Must have B2B features suitable for legal entities, (4) API must be developer-friendly and well-documented, (5) Fees must be reasonable for the business model. Propose: which providers to evaluate, evaluation criteria, and recommendation with rationale. Set up test account with chosen provider and verify API access. Document integration requirements and constraints. Test: successfully authenticate with test API credentials and confirm escrow capability exists."
```

**Acceptance Criteria:**

- Payment provider selected with clear rationale documented
- Provider supports Russian market, escrow, and B2B needs
- Test account created and API access verified
- Integration requirements and constraints documented
- Team understands fees, limitations, and capabilities

**Test:** Successfully authenticate with test API credentials and verify escrow/hold functionality is available.

---

#### Iteration 16.2: Add Payment Model to Database

**Estimated Time:** 2-3 hours

**Goal:** Enable tracking of payment transactions and their lifecycle states.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-2 "The platform needs to track payment transactions through their lifecycle: initiated, held in escrow, released to specialist, or refunded. Build the data foundation for payment tracking. Requirements: (1) Each payment must be linked to its gig, (2) Payment status must be trackable through all states, (3) Must store provider transaction identifiers for reconciliation, (4) Must track all relevant timestamps for audit trail, (5) Should support future features like invoicing and refunds. Propose: database schema, status enum values, required fields, relations, and constraints. Test: manually create payment records and verify data integrity and relationships."
```

**Acceptance Criteria:**

- Payment transactions can be stored and tracked
- Payment status lifecycle is properly modeled
- Each payment is linked to its gig
- Provider transaction IDs are stored for reconciliation
- Timestamps provide complete audit trail
- Data structure supports future payment features

**Test:** Manually create payment records via database tools, verify they link correctly to gigs and support all required status transitions.

---

#### Iteration 16.3: Implement Basic Payment Initiation

**Estimated Time:** 3-4 hours

**Goal:** Enable clients to pay for gigs when accepting specialists, with funds held in escrow.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-3 "When a client accepts a specialist's application, they commit to paying for the work. Integrate payment charging at this point to collect funds and hold them in escrow until work is completed. Requirements: (1) Payment must be initiated when client accepts application, (2) Funds must be held (not immediately released to specialist), (3) If payment fails, application acceptance must be blocked to prevent work starting without payment, (4) Must work in test mode initially for safe development, (5) Transaction details must be stored for tracking and reconciliation. Propose: integration approach, error handling strategy, user feedback, and how to handle payment failures gracefully. See project.md for service fee model (10% on top of budget). Test: verify payment is charged in test mode, funds are held, and failures prevent application acceptance."
```

**Acceptance Criteria:**

- Payment is initiated when client accepts application
- Funds are held in escrow (not immediately released)
- Payment failures prevent application acceptance
- Transaction details are stored for tracking
- Works in test mode with test payment methods
- Errors are handled gracefully without breaking the application

**Test:** Accept application with test payment method (succeeds, payment held). Try with failing test payment method (application acceptance blocked with clear error).

---

#### Iteration 16.4: Implement Payment Release

**Estimated Time:** 2-3 hours

**Goal:** Enable funds to be released to specialists when work is approved and paid.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-4 "Funds are held in escrow after client accepts application. When the client marks work as PAID (after approving completed work), the specialist should receive their payment. Implement escrow release functionality. Requirements: (1) Funds must be released when gig transitions to PAID status, (2) Payment status must be updated to reflect release, (3) Release timestamp must be recorded for audit trail, (4) API errors should be logged but not block the status transition (can be retried manually if needed), (5) Must work with test transactions from iteration 16.3. Propose: when to trigger release, how to handle errors, and what to update in the database. Test: verify funds are released when gig marked as PAID and payment status is updated correctly."
```

**Acceptance Criteria:**

- Funds are released to specialist when gig marked as PAID
- Payment status reflects successful release
- Release timestamp is recorded
- API errors are handled gracefully (logged, can retry)
- Works with test transactions from previous iteration

**Test:** Mark gig as PAID, verify payment provider release API is called, verify payment status updated to released, verify timestamp recorded.

---

#### Iteration 16.5: Add Invoice Generation

**Estimated Time:** 3-4 hours

**Goal:** Provide legally compliant invoices for B2B clients' accounting needs.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-5 "Russian B2B clients need proper invoices for their accounting and tax compliance. When a payment is initiated, generate a formal invoice document that clients can use for their records. Requirements: (1) Invoice must include all legally required information for Russian B2B transactions (company details, INN/KPP, amounts, dates), (2) Must break down budget vs service fee clearly, (3) Must be generated automatically when payment is initiated, (4) Must be downloadable by the client, (5) Should be stored permanently for audit trail. Propose: what information to include, document format (PDF recommended), generation approach, storage strategy, and how clients access their invoices. See project.md for B2B context and Russian market requirements. Test: verify invoices are generated correctly with all required information and clients can download them."
```

**Acceptance Criteria:**

- Invoices are generated automatically when payment initiated
- Invoices include all legally required B2B information
- Budget and service fee are clearly broken down
- Invoices are stored permanently and accessible
- Clients can easily download their invoices
- Invoice format is professional and compliant

**Test:** Initiate payment, verify invoice is generated automatically, download invoice, verify all required fields are present and correct (company details, INN/KPP, amounts, dates).

---

#### Iteration 16.6: Implement Refund Handling

**Estimated Time:** 2-3 hours

**Goal:** Enable dispute resolution through payment refunds when projects fail.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-6 "Sometimes gigs fail or disputes arise that require refunding the client. Admins need the ability to refund payments as part of dispute resolution. Requirements: (1) Only admins should be able to initiate refunds, (2) Refunds must be processed through the payment provider, (3) Payment status must be updated to reflect refund, (4) Refund actions must be logged for audit trail with reason, (5) Admins need a way to initiate refunds from the admin interface. Propose: refund workflow, authorization approach, what information to log, and how to present refund capability in admin UI. Test: verify admins can refund payments, refunds are processed correctly, and all actions are logged."
```

**Acceptance Criteria:**

- Admins can initiate refunds for dispute resolution
- Refunds are processed through payment provider
- Payment status reflects refund state
- All refund actions are logged with reason for audit trail
- Refund capability is accessible in admin interface
- Only admins have refund permission

**Test:** As admin, refund a test payment, verify payment provider processes refund, verify payment status updated, verify moderation log entry created with reason.

---

#### Iteration 16.7: Add Payment Webhooks

**Estimated Time:** 3-4 hours

**Goal:** Keep payment status synchronized with payment provider through automated callbacks.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-7 "Payment providers send asynchronous notifications (webhooks) when payment status changes (succeeded, failed, refunded, etc.). The platform needs to receive and process these notifications to keep payment status synchronized. Requirements: (1) Must receive and process payment provider callbacks securely, (2) Must verify callbacks are authentic (not spoofed), (3) Must update database to reflect payment status changes, (4) Must handle various payment events appropriately, (5) Must log all webhook activity for debugging and audit. Propose: webhook endpoint design, signature verification approach, event handling strategy, and what to log. Register webhook URL with payment provider. Test: verify webhooks are received and processed correctly using provider's testing tools."
```

**Acceptance Criteria:**

- Platform receives payment provider callbacks
- Webhook authenticity is verified (signature checking)
- Payment status is updated based on webhook events
- Various payment events are handled appropriately
- All webhook activity is logged for audit and debugging
- Webhook URL is registered with payment provider

**Test:** Use payment provider's webhook testing tool to send test events (payment succeeded, payment failed, refund processed), verify database updates correctly for each event type.

---

#### Iteration 16.8: Production Mode and Testing

**Estimated Time:** 4-6 hours

**Goal:** Validate the complete payment system works reliably with real transactions.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-8 "The payment system has been built and tested with test transactions. Before launching to real users, switch to production mode and validate the entire payment flow works correctly with real money. Requirements: (1) Configure production API credentials securely, (2) Test the complete payment lifecycle end-to-end with real (small) transactions, (3) Verify all error scenarios are handled gracefully, (4) Ensure refund flow works in production, (5) Set up monitoring and alerting for payment failures, (6) Document production setup for operations team. Propose: production configuration approach, testing strategy, what to monitor, and how to handle production issues. Test: conduct end-to-end validation with real small-value transactions covering all scenarios."
```

**Acceptance Criteria:**

- Production API credentials configured securely
- Complete payment flow tested end-to-end with real transactions
- All payment states work correctly (charge, hold, release, refund)
- Error scenarios are handled gracefully in production
- Monitoring and alerting is in place for payment issues
- Production setup is documented for operations

**Test:** Complete full gig lifecycle with real (small value) payment: accept application → charge client → hold funds → complete work → release to specialist. Test refund scenario. Verify all steps work correctly and monitoring captures events.

---

**Total for Change 16:** 8 iterations × 2-4 hours = 16-32 hours (matches original 4-6 week estimate with other work)

---

#### Change 17: notification-system

**Priority:** **POST-MVP** (Downgraded from HIGH) | **Size:** M | **Estimated Effort:** 1-2 weeks

**MVP Status:** ⏸️ **DEFERRED - NOT ABANDONED**

**Why Downgraded for MVP:**

- Users can check platform manually for updates
- Not critical for core loop validation
- Nice-to-have for engagement, not essential for proving value

**MVP Alternative:**

- Users check dashboard manually for gig status updates
- No email notifications
- Platform shows status changes clearly in UI

**When to Build:**

- AFTER MVP validation shows users are engaged
- AFTER identifying notification fatigue risks
- When scaling beyond 50 active users

**Strategic Importance:**
Notifications improve engagement and response time, but aren't needed to prove the core value proposition. Build after validating users find value in the platform itself.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 17.1: Set Up Email Service Provider

**Estimated Time:** 2-3 hours

**Goal:** Establish reliable email delivery infrastructure for platform notifications.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-1 "The platform needs to send transactional emails to users (application updates, work status changes, messages). Set up email delivery infrastructure that's reliable and suitable for production use. Requirements: (1) Must reliably deliver transactional emails, (2) Must be cost-effective for expected volume, (3) Must provide delivery tracking and debugging capabilities, (4) Should support Russian market (no delivery issues to Russian email providers), (5) Configuration should be secure and maintainable. Propose: which email service provider to use, how to configure it, and how to verify it works. Document setup for operations team. Test: verify emails can be sent and delivered successfully to various email providers."
```

**Acceptance Criteria:**

- Email service provider selected and configured
- Platform can send emails reliably
- Delivery to major email providers works (Gmail, Yandex, Mail.ru, etc.)
- Configuration is secure and documented
- Can verify email delivery for debugging

**Test:** Send test emails to various email providers (Gmail, Yandex, Mail.ru), verify they arrive in inbox (not spam).

---

#### Iteration 17.2: Create Notification Preferences Model

**Estimated Time:** 2 hours

**Goal:** Give users control over which notifications they receive to prevent fatigue.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-2 "Users have different preferences for how much they want to be notified. Some want every update, others only critical ones. Build notification preference management to give users control. Requirements: (1) Users should be able to control which event types trigger emails, (2) Preferences should be granular enough to be useful but not overwhelming, (3) Sensible defaults should be set (important notifications on by default), (4) Preferences should be easy to find and modify, (5) Preferences must be respected by all notification code. Propose: what notification types to offer control over, default settings, where to put preferences UI, and how to store preferences. Test: verify users can change preferences and they persist correctly."
```

**Acceptance Criteria:**

- Users can control which notification types they receive
- Notification preferences are granular but not overwhelming
- Sensible defaults are set for new users
- Preferences are easy to find and modify
- Preferences persist correctly across sessions
- All notification code respects user preferences

**Test:** Change notification preferences for various event types, verify they persist after logout/login, verify preferences are respected when events occur.

---

#### Iteration 17.3: Implement Application Notifications

**Estimated Time:** 2-3 hours

**Goal:** Keep users informed about application activity to improve response times.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-3 "The application lifecycle involves multiple state changes that both clients and specialists need to know about promptly. Implement email notifications for application events to keep users engaged and responsive. Requirements: (1) Clients should be notified when they receive new applications, (2) Specialists should be notified when their applications are accepted or rejected, (3) Emails should provide enough context to be useful without requiring login, (4) Emails should link back to the platform for action, (5) Must respect user notification preferences from iteration 17.2. Propose: what information to include in each email type, email design/template approach, and when to send each notification. Test: verify emails are sent at appropriate times with correct content and links."
```

**Acceptance Criteria:**

- Clients receive emails when specialists apply to their gigs
- Specialists receive emails when applications are accepted/rejected
- Emails provide useful context and clear next steps
- Emails link back to relevant platform pages
- User notification preferences are respected
- Email content is clear and actionable

**Test:** Apply to gig as specialist, verify client receives email with application details. Accept application as client, verify specialist receives email. Reject application, verify specialist receives email. Verify users with notifications disabled don't receive emails.

---

#### Iteration 17.4: Implement Work Status Notifications

**Estimated Time:** 2-3 hours

**Goal:** Keep both parties informed as work progresses through review and completion.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-4 "After work begins, both clients and specialists need to stay informed about progress through the work lifecycle. Implement notifications for key work status transitions to maintain engagement and reduce delays. Requirements: (1) Clients should be notified when work is submitted for review, (2) Specialists should be notified when work is approved, (3) Specialists should be notified when payment is marked complete, (4) Emails should provide context about what happened and what comes next, (5) Must respect user notification preferences. Propose: which work status transitions warrant notifications, what information to include, and email timing. Test: verify notifications are sent at appropriate work lifecycle transitions with correct content."
```

**Acceptance Criteria:**

- Clients receive emails when specialists submit work for review
- Specialists receive emails when clients approve their work
- Specialists receive emails when payment is marked complete
- Emails provide clear context and next steps
- User notification preferences are respected
- Notifications improve workflow without creating noise

**Test:** Complete full gig workflow (submit work → approve work → mark paid), verify appropriate emails are sent at each transition with correct content and links.

---

#### Iteration 17.5: Implement Message Notifications

**Estimated Time:** 2 hours

**Goal:** Keep conversations active while preventing notification spam from rapid exchanges.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-5 "In-platform messaging enables communication, but users need to know when they receive messages to respond promptly. However, back-and-forth conversations could generate excessive emails. Implement message notifications with smart rate limiting. Requirements: (1) Users should be notified when they receive new messages, (2) Emails should include enough message preview to provide context, (3) Must prevent notification spam during active conversations (rate limiting), (4) Must respect user notification preferences, (5) Should encourage users to return to platform rather than conduct full conversations via email. Propose: notification timing, rate limiting strategy (e.g., digest approach, time-based throttling), what to include in email, and how to balance responsiveness with spam prevention. Test: verify single messages trigger notifications, rapid message exchanges don't spam, and rate limiting works correctly."
```

**Acceptance Criteria:**

- Users receive email notifications for new messages
- Emails include message preview for context
- Rate limiting prevents spam during active conversations
- User notification preferences are respected
- Emails encourage returning to platform
- Balance between responsiveness and notification fatigue

**Test:** Send single message, verify recipient receives email. Send multiple messages in quick succession, verify rate limiting prevents spam (e.g., only one email sent, or messages batched). Verify users with message notifications disabled don't receive emails.

**Test:** Send message, verify recipient gets email. Send multiple messages quickly, verify rate limiting works.

---

**Total for Change 17:** 5 iterations × 2-3 hours = 10-15 hours

---

#### Change 18: production-database-migration

**Priority:** **POST-MVP** (Downgraded from HIGH) | **Size:** M | **Estimated Effort:** 1 week

**MVP Status:** ⏸️ **DEFERRED - NOT ABANDONED**

**Why Downgraded for MVP:**

- SQLite is sufficient for MVP scale (10-20 clients, 50-100 specialists)
- No concurrent user issues at MVP scale
- Migration can happen when scaling beyond MVP targets

**MVP Alternative:**

- Continue using SQLite for MVP
- Monitor performance and concurrent user issues
- Migrate when approaching 100+ active users

**When to Build:**

- AFTER reaching 50+ active clients
- AFTER identifying SQLite performance issues
- Before scaling to 100+ concurrent users

**Strategic Importance:**
PostgreSQL is essential for production scale, but SQLite is fine for MVP validation. Premature optimization wastes time that should be spent validating core value.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 18.1: Set Up PostgreSQL Database

**Estimated Time:** 2-3 hours

**Goal:** Establish production-grade database infrastructure for scaling beyond MVP.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-1 "SQLite is sufficient for MVP but won't scale to production user volumes. Provision a PostgreSQL database instance for production use. Requirements: (1) Must be reliable and suitable for production workloads, (2) Must be accessible from development and production environments, (3) Must have backup and recovery capabilities, (4) Cost should be reasonable for expected scale, (5) Current SQLite data must be backed up before proceeding. Propose: which hosting provider to use, instance configuration, security setup, and backup strategy. Document connection details securely for team. Test: verify connectivity from development environment and confirm database is ready for schema migration."
```

**Acceptance Criteria:**

- PostgreSQL instance provisioned and accessible
- Connection verified from development environment
- SQLite database backed up before proceeding
- Connection details documented securely
- Hosting provider suitable for production needs
- Backup and recovery capabilities in place

**Test:** Connect to PostgreSQL from local machine using database client (psql, pgAdmin, etc.), verify connection works and database is empty and ready.

---

#### Iteration 18.2: Update Prisma Schema for PostgreSQL

**Estimated Time:** 2 hours

**Goal:** Adapt the database schema to work with PostgreSQL's capabilities and constraints.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-2 "The application currently uses SQLite, which has different capabilities and constraints than PostgreSQL. Migrate the Prisma schema to PostgreSQL, handling dialect differences. Requirements: (1) Update datasource configuration to point to PostgreSQL, (2) Handle any SQLite-specific features that need PostgreSQL equivalents, (3) Ensure all data types are appropriate for PostgreSQL, (4) Run migrations to create schema in PostgreSQL, (5) Verify all tables, relations, and constraints are created correctly. Propose: what schema changes are needed, how to handle dialect differences, and verification approach. Test: confirm schema is created correctly in PostgreSQL with all tables, relations, and constraints intact."
```

**Acceptance Criteria:**

- Prisma schema configured for PostgreSQL
- All SQLite-specific features adapted for PostgreSQL
- Data types are appropriate for PostgreSQL
- Migrations run successfully
- All tables, relations, and constraints created correctly
- Schema matches SQLite functionality

**Test:** Run migration against PostgreSQL, verify all tables exist using database client, verify relations and constraints are correct.

---

#### Iteration 18.3: Add Performance Indexes

**Estimated Time:** 2-3 hours

**Goal:** Optimize query performance for production workloads through strategic indexing.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-3 "PostgreSQL can handle much larger datasets than SQLite, but only with proper indexing. Analyze the application's query patterns and add indexes to optimize performance for production scale. Requirements: (1) Identify fields frequently used in WHERE clauses, JOIN conditions, and ORDER BY statements, (2) Add indexes that will improve query performance without excessive overhead, (3) Consider composite indexes where multiple fields are queried together, (4) Verify indexes are actually being used by the query planner, (5) Balance index benefits against write performance costs. Propose: which fields to index, whether to use single or composite indexes, and how to verify effectiveness. Test: verify indexes improve query performance with realistic data volumes."
```

**Acceptance Criteria:**

- Frequently queried fields are indexed appropriately
- Indexes improve query performance measurably
- Query planner uses indexes (verified with EXPLAIN)
- Index overhead is reasonable for write operations
- Composite indexes used where appropriate
- Performance tested with realistic data volumes

**Test:** Seed large dataset (1000+ records), run common queries with EXPLAIN ANALYZE, verify indexes are used and performance is acceptable.

---

#### Iteration 18.4: Migrate Data from SQLite

**Estimated Time:** 3-4 hours

**Goal:** Transfer all existing data to PostgreSQL without loss or corruption.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-4 "The PostgreSQL schema is ready, but the SQLite database contains valuable production data that must be migrated safely. Create and execute a data migration that preserves all data, relationships, and integrity. Requirements: (1) All data must be transferred completely (no records lost), (2) All relationships and foreign keys must remain intact, (3) IDs and references must be preserved correctly, (4) Data integrity must be verified after migration, (5) Application must work identically with PostgreSQL as it did with SQLite, (6) Migration should be repeatable in case of issues. Propose: migration approach (script, tool, manual), how to verify data integrity, and rollback strategy if problems occur. Test: verify all data transferred correctly and application functions identically."
```

**Acceptance Criteria:**

- All data transferred from SQLite to PostgreSQL
- Record counts match between databases
- All relationships and foreign keys intact
- Data integrity verified (no corruption)
- Application works identically with PostgreSQL
- Migration process is documented and repeatable

**Test:** Run migration script, compare record counts between SQLite and PostgreSQL for all tables, test all application features with PostgreSQL, verify data relationships are correct.

---

#### Iteration 18.5: Configure Connection Pooling

**Estimated Time:** 2 hours

**Goal:** Enable efficient handling of concurrent users through connection pooling.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-5 "PostgreSQL connections are expensive resources. Without connection pooling, the application will struggle under concurrent load as each request creates a new database connection. Configure connection pooling to handle production traffic efficiently. Requirements: (1) Must support expected concurrent user load (50-100+ simultaneous users), (2) Must reuse connections efficiently to minimize overhead, (3) Must handle connection failures gracefully, (4) Pool size must be tuned appropriately (not too small, not wastefully large), (5) Must work with the application's deployment architecture. Propose: pooling solution (PgBouncer, Prisma's built-in pooling, etc.), pool configuration (size, timeout), and how to verify it works under load. Document configuration for production deployment. Test: verify connection pooling handles concurrent load without exhausting connections."
```

**Acceptance Criteria:**

- Connection pooling configured and operational
- Handles expected concurrent user load efficiently
- Connections are reused appropriately
- Pool size is tuned for expected traffic
- Connection failures handled gracefully
- Configuration documented for production
- Verified under simulated load

**Test:** Simulate concurrent requests (50+ users), verify connection pooling works correctly, monitor connection usage to ensure limits aren't exceeded and connections are reused.

```

**Test:** Simulate concurrent requests, verify connection pooling works, check connection limits.

---

**Total for Change 18:** 5 iterations × 2-3 hours = 10-15 hours

---

#### Change 19: legal-entity-verification

**Priority:** **POST-MVP** (Downgraded from HIGH) | **Size:** L | **Estimated Effort:** 2-3 weeks

**MVP Status:** ⏸️ **DEFERRED - NOT ABANDONED**

**Why Downgraded for MVP:**

- Manual verification acceptable for MVP scale (10-20 clients)
- Admin can manually check INN/KPP for early clients
- Automated verification needed only when scaling

**MVP Alternative:**

- Admin manually verifies client company details
- Simple verification badge (manually assigned)
- No automated INN/KPP API integration

**When to Build:**

- AFTER reaching 30+ clients (manual verification becomes bottleneck)
- AFTER proving clients value verification badges
- When fraud/fake accounts become a concern

**Strategic Importance:**
Legal entity verification builds trust and differentiates from consumer platforms, but manual handling is sufficient for MVP. Automate when manual process becomes a bottleneck.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 19.1: Add Verification Status to ClientProfile

**Estimated Time:** 2 hours

**Goal:** Enable tracking and display of client verification status to build trust.

**Ralphy-Plan Command:**

```

/ralphy-plan verification-iteration-1 "Verified legal entities are more trustworthy than unverified ones. Build the foundation for tracking and displaying client verification status. Requirements: (1) Must track verification state through its lifecycle (unverified, pending review, verified, rejected), (2) Verification status must be visible to specialists evaluating gigs, (3) Verified status should be displayed prominently as a trust signal, (4) Status changes must be timestamped for audit trail. Propose: how to model verification states, where to display verification badges, and what visual indicators to use. Test: verify verification status can be tracked and displayed correctly across the platform."

```

**Acceptance Criteria:**

- Client verification status can be tracked through all states
- Verification status is visible on client profiles
- Verified clients have visible trust badge on gig listings
- Status changes are timestamped
- Visual indicators are clear and professional

**Test:** Manually set client to VERIFIED status in database, verify badge displays on profile and gig listings. Set to PENDING, verify appropriate indicator shows.

---

#### Iteration 19.2: Create Verification Request Flow

**Estimated Time:** 3 hours

**Goal:** Enable clients to initiate verification and provide required legal entity information.

**Ralphy-Plan Command:**

```

/ralphy-plan verification-iteration-2 "Clients need a way to request verification and provide their legal entity information. Build the client-facing verification request flow. Requirements: (1) Clients must be able to submit verification requests with required legal information, (2) Must collect INN (required for Russian legal entities), (3) Form should guide clients on what information is needed, (4) After submission, status should update to pending review, (5) Clients should be able to see their verification request status. Propose: what information to collect, form design, validation rules, and how to communicate status to clients. Test: verify clients can submit verification requests and see their pending status."

```

**Acceptance Criteria:**

- Clients can submit verification requests
- Required legal entity information is collected (including INN)
- Form guides clients on what's needed
- Status updates to pending after submission
- Clients can view their verification request status
- Validation ensures required information is provided

**Test:** As client, submit verification request with legal entity information, verify status changes to PENDING and is visible in UI.

---

#### Iteration 19.3: Build Admin Verification Workflow

**Estimated Time:** 3-4 hours

**Goal:** Enable admins to review and process verification requests efficiently.

**Ralphy-Plan Command:**

```

/ralphy-plan verification-iteration-3 "Verification requests need admin review to confirm legal entity legitimacy. Build the admin workflow for processing verification requests. Requirements: (1) Admins must see all pending verification requests with relevant information, (2) Admins must be able to approve or reject requests with reasoning, (3) Approval should grant verified status with timestamp, (4) Rejection should update status and record reason for transparency, (5) All verification decisions must be logged for audit trail. Propose: admin interface design, what information to show admins for decision-making, approval/rejection workflow, and logging approach. Test: verify admins can efficiently process verification requests and clients see updated status."

```

**Acceptance Criteria:**

- Admins can view all pending verification requests
- Relevant client information is displayed for decision-making
- Admins can approve requests (client becomes verified)
- Admins can reject requests with reason
- All decisions are logged in moderation log
- Clients see updated verification status after admin action

**Test:** As admin, approve a verification request, verify client sees VERIFIED badge and timestamp. Reject a request with reason, verify client sees rejection and can understand why.

---

#### Iteration 19.4: Integrate INN Validation API

**Estimated Time:** 4-5 hours

**Goal:** Automate INN validation to reduce admin workload and catch errors early.

**Ralphy-Plan Command:**

```

/ralphy-plan verification-iteration-4 "Manual INN verification is time-consuming and error-prone. Integrate automated INN validation to verify legal entity information against official Russian registries. Requirements: (1) Must validate INN format before submission, (2) Must check if company exists in official registry, (3) Should retrieve and store company information from registry when available, (4) Invalid or non-existent INNs should be rejected immediately with clear error, (5) Valid INNs proceed to admin review with pre-populated company data. Propose: which INN validation service to use (Russian tax service API or third-party), integration approach, what company data to retrieve, and error handling strategy. Test: verify validation works correctly for valid, invalid, and non-existent INNs."

```

**Acceptance Criteria:**

- INN format is validated automatically
- Company existence is verified against official registry
- Company information is retrieved and stored when available
- Invalid INNs are rejected with clear error messages
- Valid INNs proceed to admin review with pre-populated data
- Integration is reliable and handles API errors gracefully

**Test:** Submit verification with valid INN (succeeds, company data retrieved). Submit with invalid format INN (fails with format error). Submit with non-existent INN (fails with "company not found" error).

---

#### Iteration 19.5: Add Document Upload (Optional)

**Estimated Time:** 3-4 hours

**Goal:** Allow clients to provide supporting documentation for verification when needed.

**Ralphy-Plan Command:**

```

/ralphy-plan verification-iteration-5 "Some verification cases may require additional documentation beyond INN validation (e.g., recent registration, name changes, special cases). Add optional document upload capability to support these scenarios. Requirements: (1) Clients should be able to upload supporting documents (registration certificates, charters, etc.), (2) Documents must be stored securely and permanently, (3) Admins must be able to view uploaded documents during verification review, (4) Upload should be optional (not required for all cases), (5) Should support common document formats (PDF, images). Propose: file storage solution, what document types to accept, file size limits, and how to present documents to admins. Test: verify clients can upload documents and admins can access them during review."

```

**Acceptance Criteria:**

- Clients can optionally upload supporting documents
- Documents are stored securely and permanently
- Admins can view uploaded documents during verification review
- Common document formats are supported (PDF, JPG, PNG)
- File size limits are reasonable and enforced
- Upload process is clear and user-friendly

**Test:** Upload documents (PDF and images) during verification request, verify they're stored correctly, verify admin can view them on verification review page.

---

**Total for Change 19:** 5 iterations × 3-4 hours = 15-20 hours

---

### Phase 3: Trust & Scale (Post-MVP, After Validation)

**Note:** All changes in this phase are **post-MVP goals**. Build these AFTER validating operational value and achieving MVP success metrics (>30% organic retention, >60% completion rate).

---

#### Change 20: rating-and-review-system

**Priority:** MEDIUM (Post-MVP) | **Size:** M | **Estimated Effort:** 2 weeks

**Build After:** MVP validation shows users complete gigs and return for more

Quality assurance for high-end marketplace. Specialists need reputation building, clients need confidence in selection. Reviews provide feedback loop and accountability.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 20.1: Add Review Model

**Estimated Time:** 2-3 hours

**Goal:** Enable tracking of bidirectional feedback between clients and specialists.

**Ralphy-Plan Command:**

```

/ralphy-plan review-iteration-1 "Reputation and accountability are essential for marketplace trust. After gigs complete, both clients and specialists need to provide feedback about their experience. Build the data foundation for storing reviews and ratings. Requirements: (1) Must support bidirectional reviews (client reviews specialist, specialist reviews client), (2) Each review must be linked to a specific completed gig, (3) Must track both quantitative ratings and qualitative comments, (4) Must identify both reviewer and reviewee, (5) Should support future features like moderation and aggregation. Propose: database schema, rating scale, required vs optional fields, and relationships. Test: verify review data can be stored with all necessary relationships intact."

```

**Acceptance Criteria:**

- Reviews can be stored for completed gigs
- Bidirectional reviews supported (both parties can review each other)
- Ratings and comments are tracked
- Reviewer and reviewee are clearly identified
- Data structure supports future features (moderation, aggregation)

**Test:** Manually create reviews in database for a completed gig, verify both client-to-specialist and specialist-to-client reviews can be stored with proper relationships.

---

#### Iteration 20.2: Implement Review Submission

**Estimated Time:** 3 hours

**Goal:** Enable users to provide feedback after successful gig completion.

**Ralphy-Plan Command:**

```

/ralphy-plan review-iteration-2 "After a gig completes successfully, both parties should be able to share their experience. Build the review submission flow for completed gigs. Requirements: (1) Reviews should only be possible after gig is marked as PAID, (2) Both client and specialist should be able to review each other, (3) Users should only be able to review gigs they actually participated in, (4) Review form should collect both rating and optional detailed feedback, (5) Should prevent duplicate reviews (one review per user per gig). Propose: when to prompt for reviews, form design, validation rules, and how to prevent abuse. Test: verify both parties can submit reviews after gig completion and reviews are properly associated."

```

**Acceptance Criteria:**

- Reviews can only be submitted for completed (PAID) gigs
- Both client and specialist can review each other
- Users can only review gigs they participated in
- Form collects rating and optional comment
- Duplicate reviews are prevented
- Reviews are properly associated with gig and users

**Test:** Complete a gig and mark as PAID. Submit review as client, verify it saves correctly. Submit review as specialist, verify it saves correctly. Try to submit duplicate review (should be prevented).

---

#### Iteration 20.3: Display Reviews on Profiles

**Estimated Time:** 2-3 hours

**Goal:** Make reputation visible to help users make informed decisions.

**Ralphy-Plan Command:**

```

/ralphy-plan review-iteration-3 "Reviews are only valuable if they're visible and help users make decisions. Display reviews and ratings on user profiles so specialists can showcase their reputation and clients can evaluate candidates. Requirements: (1) Average rating should be prominently displayed as a trust signal, (2) Individual reviews should be listed with relevant context, (3) Both client and specialist profiles should display their reviews, (4) Should handle profiles with many reviews gracefully (pagination or limiting), (5) Reviews should include enough context to be useful (rating, comment, when, from whom). Propose: profile layout design, how to calculate and display average rating, pagination approach, and what review information to show. Test: verify reviews display correctly and average ratings are calculated accurately."

```

**Acceptance Criteria:**

- Average rating is prominently displayed on profiles
- Individual reviews are listed with context
- Both client and specialist profiles show reviews
- Pagination or limiting handles many reviews gracefully
- Average rating calculation is accurate
- Reviews provide useful context for decision-making

**Test:** View profile with multiple reviews, verify average rating is correct, verify individual reviews display with all relevant information, verify pagination works if many reviews exist.

---

#### Iteration 20.4: Add Admin Moderation

**Estimated Time:** 2 hours

**Goal:** Protect platform quality by enabling removal of inappropriate reviews.

**Ralphy-Plan Command:**

```

/ralphy-plan review-iteration-4 "Not all reviews are appropriate or constructive. Some may contain offensive content, personal attacks, or violate platform policies. Give admins the ability to moderate reviews while preserving data for audit purposes. Requirements: (1) Admins must be able to hide inappropriate reviews from public view, (2) Hidden reviews should remain in database for audit trail, (3) Hiding reviews should be logged with reason for transparency, (4) Hidden reviews should not affect average rating calculations, (5) Admins need an interface to review and moderate flagged or reported reviews. Propose: moderation workflow, how to mark reviews as hidden, logging approach, and admin interface design. Test: verify admins can hide reviews and they disappear from public view while remaining in database."

```

**Acceptance Criteria:**

- Admins can hide inappropriate reviews
- Hidden reviews remain in database for audit
- Moderation actions are logged with reasons
- Hidden reviews don't affect public rating calculations
- Admin interface makes moderation efficient
- Hidden reviews are not visible to public users

**Test:** As admin, hide a review with reason, verify it no longer displays on profile, verify it still exists in database, verify moderation log entry created, verify average rating recalculates without hidden review.

---

**Total:** 4 iterations × 2-3 hours = 8-12 hours

---

#### Change 21: contract-and-terms-system

**Priority:** MEDIUM (Post-MVP) | **Size:** M | **Estimated Effort:** 2 weeks

**Build After:** Legal requirements become clear from real user interactions

Legal protection for both parties in B2B transactions. Clear terms reduce disputes.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 21.1: Add ToS Acceptance

**Estimated Time:** 2 hours

**Goal:** Establish legal foundation by requiring Terms of Service acceptance.

**Ralphy-Plan Command:**

```

/ralphy-plan contract-iteration-1 "The platform needs legal protection through Terms of Service that users must accept. Implement ToS acceptance requirement during registration for legal compliance. Requirements: (1) Users must explicitly accept ToS before completing registration, (2) Acceptance must be recorded with timestamp for legal proof, (3) ToS text should be accessible for users to read before accepting, (4) Cannot bypass or skip ToS acceptance, (5) Acceptance record must be permanent for legal purposes. Propose: how to present ToS to users, acceptance mechanism (checkbox, button), where to store acceptance records, and how to make ToS text accessible. Test: verify users cannot register without accepting ToS and acceptance is properly recorded."

```

**Acceptance Criteria:**

- ToS acceptance is required for registration
- Users can read ToS before accepting
- Acceptance is recorded with timestamp
- Cannot complete registration without accepting
- Acceptance records are permanent and auditable

**Test:** Attempt to register without accepting ToS (should fail with clear message). Register with ToS acceptance (should succeed and store timestamp in database).

---

#### Iteration 21.2: Add Contract Model

**Estimated Time:** 2-3 hours

**Goal:** Enable gig-specific contract terms beyond standard platform ToS.

**Ralphy-Plan Command:**

```

/ralphy-plan contract-iteration-2 "Standard platform ToS may not cover all gig-specific requirements. Some clients need custom terms (confidentiality, IP ownership, specific deliverables). Build the foundation for gig-specific contracts. Requirements: (1) Must support standard platform terms plus optional custom terms per gig, (2) Must track which specialist accepted which contract version, (3) Should support contract versioning if terms change, (4) Clients should be able to add custom terms during gig creation, (5) Contract terms must be immutable after specialist accepts. Propose: database schema for contracts, how to handle versioning, where clients add custom terms, and how to ensure immutability. Test: verify gig-specific contracts can be created and associated correctly."

```

**Acceptance Criteria:**

- Gig-specific contracts can be created and stored
- Standard platform terms plus optional custom terms supported
- Contract acceptance is tracked per specialist
- Versioning supports contract updates
- Contracts are immutable after acceptance
- Clients can add custom terms during gig creation

**Test:** Create gig with custom contract terms, verify they're stored correctly and associated with gig. Verify contract version is tracked.

---

#### Iteration 21.3: Implement Contract Acceptance

**Estimated Time:** 3 hours

**Goal:** Ensure specialists explicitly agree to terms before work begins.

**Ralphy-Plan Command:**

```

/ralphy-plan contract-iteration-3 "Work should not begin until both parties agree to the terms. After a client accepts a specialist's application, the specialist must review and explicitly accept the contract before work starts. Requirements: (1) Specialist must see and review all contract terms (platform + custom), (2) Specialist must explicitly accept before gig transitions to IN_PROGRESS, (3) Contract acceptance must be recorded with timestamp, (4) Specialist should understand what they're agreeing to, (5) Cannot bypass contract acceptance. Propose: when to show contract to specialist, how to present terms clearly, acceptance mechanism, and how to enforce acceptance before work begins. Test: verify work cannot begin until specialist accepts contract and acceptance is properly recorded."

```

**Acceptance Criteria:**

- Specialist must review contract after application accepted
- All terms (platform + custom) are clearly presented
- Explicit acceptance is required before work begins
- Gig cannot transition to IN_PROGRESS without acceptance
- Acceptance is recorded with timestamp
- Contract terms are clear and understandable

**Test:** Accept application as client, verify specialist sees contract terms, verify gig remains in accepted state until specialist accepts contract, accept contract as specialist, verify gig transitions to IN_PROGRESS.

---

#### Iteration 21.4: Generate Contract PDFs

**Estimated Time:** 3-4 hours

**Goal:** Provide formal contract documents for legal record-keeping and compliance.

**Ralphy-Plan Command:**

```

/ralphy-plan contract-iteration-4 "B2B transactions require formal documentation for legal and accounting purposes. When a specialist accepts a contract, generate a formal PDF document that both parties can keep for their records. Requirements: (1) PDF must contain all contract terms (platform + custom), (2) Must include all relevant gig and party details, (3) Must include acceptance timestamp and parties' information, (4) Both parties should be able to download the contract, (5) PDF should be stored permanently for audit trail, (6) Document should be professionally formatted and legally appropriate. Propose: PDF generation approach, what information to include, document format/layout, storage strategy, and how parties access their contracts. Test: verify contract PDFs are generated correctly with all required information and both parties can download them."

```

**Acceptance Criteria:**

- Contract PDFs are generated when specialist accepts
- PDFs contain all terms (platform + custom)
- All relevant details included (gig, parties, dates, terms)
- Both client and specialist can download contract
- PDFs are stored permanently
- Document format is professional and legally appropriate

**Test:** Accept contract as specialist, verify PDF is generated automatically, download PDF as both client and specialist, verify all required information is present and correctly formatted.

---

**Total:** 4 iterations × 2-3 hours = 8-12 hours

---

#### Change 22: advanced-search-and-discovery

**Priority:** MEDIUM (Post-MVP) | **Size:** M | **Estimated Effort:** 2 weeks

**Build After:** Gig volume exceeds 100+ OPEN gigs (pagination becomes necessary)

Current gig browsing loads all OPEN gigs - not scalable beyond ~100 gigs.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 22.1: Add Pagination

**Estimated Time:** 2-3 hours

**Goal:** Handle growing gig volume without performance degradation.

**Ralphy-Plan Command:**

```

/ralphy-plan search-iteration-1 "Currently all open gigs load at once, which works for MVP but won't scale beyond ~100 gigs. As the platform grows, this will cause performance issues and poor user experience. Implement pagination to handle large gig volumes efficiently. Requirements: (1) Must load gigs in manageable chunks rather than all at once, (2) Users must be able to navigate between pages easily, (3) Performance should remain good even with 1000+ gigs, (4) Current page state should be clear to users, (5) Should work with existing filters and sorting. Propose: pagination approach (offset-based, cursor-based), page size, navigation UI, and how to maintain filter/sort state across pages. Test: verify pagination works correctly with large gig volumes and users can navigate efficiently."

```

**Acceptance Criteria:**

- Gigs load in manageable chunks (not all at once)
- Users can navigate between pages easily
- Performance is good even with large gig volumes
- Current page and total pages are clear
- Pagination works with existing filters and sorting
- Page state is maintained in URL for bookmarking

**Test:** Create 100+ gigs, verify pagination displays correctly, navigate between pages, verify performance is acceptable, apply filters and verify pagination still works.

---

#### Iteration 22.2: Implement Saved Searches

**Estimated Time:** 3 hours

**Goal:** Reduce friction for specialists who repeatedly search for similar gigs.

**Ralphy-Plan Command:**

```

/ralphy-plan search-iteration-2 "Specialists often look for similar types of gigs repeatedly (same tech stack, budget range, etc.). Manually setting filters each time is tedious. Allow specialists to save their filter combinations for quick reuse. Requirements: (1) Specialists should be able to save current filter state with a memorable name, (2) Saved searches should be easily accessible for quick reuse, (3) Should be able to manage (view, load, delete) saved searches, (4) Loading a saved search should apply all saved filters, (5) Should handle changes to available filters gracefully. Propose: where to store saved searches, UI for saving and managing them, how to handle filter changes over time, and where to display saved searches for easy access. Test: verify specialists can save, load, and manage their search preferences effectively."

```

**Acceptance Criteria:**

- Specialists can save current filter combinations with custom names
- Saved searches are easily accessible (e.g., on dashboard)
- Can load saved search to quickly apply filters
- Can manage saved searches (view list, delete unwanted ones)
- Loading saved search applies all saved filters correctly
- Handles filter schema changes gracefully

**Test:** Apply filters (budget range, tags), save search with name, navigate away, load saved search from dashboard, verify all filters are applied correctly. Delete saved search, verify it's removed.

---

#### Iteration 22.3: Add Gig Recommendations

**Estimated Time:** 3-4 hours

**Goal:** Help specialists discover relevant gigs they might miss through manual search.

**Ralphy-Plan Command:**

```

/ralphy-plan search-iteration-3 "Specialists may miss relevant gigs if they don't search at the right time or use the right filters. Proactively recommend gigs that match their skills and experience to increase engagement and application quality. Requirements: (1) Recommendations should be based on specialist's profile (tech stack, experience level, past applications), (2) Recommended gigs should be genuinely relevant (not random), (3) Should be displayed prominently but not intrusively, (4) Algorithm should be simple and maintainable (not over-engineered), (5) Should improve over time as more data is available. Propose: recommendation algorithm approach, what profile data to use, where to display recommendations, and how to measure relevance. Test: verify recommendations are relevant to specialist profiles and improve gig discovery."

```

**Acceptance Criteria:**

- Gigs are recommended based on specialist profile data
- Recommendations are genuinely relevant (match skills/experience)
- Displayed prominently on specialist dashboard
- Algorithm is simple and maintainable
- Recommendations help specialists discover relevant gigs
- Can be improved over time with more data

**Test:** View recommendations as specialist with specific tech stack, verify recommended gigs match profile skills. Compare recommendations for specialists with different profiles, verify they're personalized.

---

#### Iteration 22.4: Add Advanced Filters

**Estimated Time:** 2-3 hours

**Goal:** Enable more precise gig discovery as platform grows and needs diversify.

**Ralphy-Plan Command:**

```

/ralphy-plan search-iteration-4 "As the platform grows, specialists need more ways to find exactly what they're looking for. Current filters (budget, tags) are basic. Add more filter options to help specialists find relevant gigs efficiently. Requirements: (1) Additional filters should address real user needs (not just feature bloat), (2) Should include full-text search for finding specific keywords, (3) Filters should be intuitive and not overwhelming, (4) Should work efficiently even with large gig volumes, (5) May require additional gig fields to support new filters. Propose: which additional filters to add based on user needs, UI design to avoid overwhelming users, database schema changes if needed, and how to implement full-text search. Test: verify new filters help specialists find relevant gigs more efficiently."

```

**Acceptance Criteria:**

- Additional filter options address real user needs
- Full-text search works on gig titles and descriptions
- Filter UI is intuitive and not overwhelming
- Filters work efficiently with large gig volumes
- New filters improve gig discovery effectiveness
- Database schema supports new filter fields if needed

**Test:** Apply various filter combinations including new filters, verify results are accurate. Use full-text search to find gigs by keywords, verify relevant gigs are returned. Test performance with large gig volume.

---

**Total:** 4 iterations × 2-3 hours = 8-12 hours

---

#### Change 23: gig-management-enhancements

**Priority:** MEDIUM (Post-MVP) | **Size:** S | **Estimated Effort:** 1 week

**Build After:** Clients request ability to edit/cancel gigs

Clients need flexibility to manage their gigs.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 23.1: Implement Gig Editing

**Estimated Time:** 2-3 hours

**Goal:** Allow clients to fix mistakes or clarify requirements before specialists apply.

**Ralphy-Plan Command:**

```

/ralphy-plan gig-mgmt-iteration-1 "Clients sometimes realize they need to clarify or correct gig details after posting. Enable gig editing while protecting specialists from bait-and-switch tactics. Requirements: (1) Clients should be able to edit gig details when no applications exist yet, (2) Once specialists have applied, editing should be blocked to prevent changing terms after commitment, (3) All gig fields should be editable (title, description, budget, tags, requirements), (4) Changes should be saved atomically, (5) Should provide clear feedback about why editing is blocked if applications exist. Propose: which fields to allow editing, when to block editing, UI design, and how to communicate restrictions. Test: verify clients can edit gigs appropriately and editing is blocked when it should be."

```

**Acceptance Criteria:**

- Clients can edit gigs that have no applications
- Editing is blocked once applications are received
- All relevant gig fields are editable
- Clear feedback when editing is blocked
- Changes save correctly and atomically

**Test:** Edit gig with no applications, verify changes save. Apply to gig as specialist, try to edit as client, verify editing is blocked with clear message.

---

#### Iteration 23.2: Implement Gig Closure

**Estimated Time:** 2 hours

**Goal:** Allow clients to cancel gigs when circumstances change.

**Ralphy-Plan Command:**

```

/ralphy-plan gig-mgmt-iteration-2 "Sometimes clients need to cancel gigs (budget cuts, priorities change, found someone elsewhere). Enable client-initiated gig cancellation while handling pending applications fairly. Requirements: (1) Clients should be able to cancel OPEN gigs they no longer need, (2) All pending applications should be automatically rejected with notification, (3) Should require confirmation to prevent accidental cancellation, (4) Cancellation should be clearly distinguished from admin closure, (5) Cancelled gigs should remain visible for audit but marked as cancelled. Propose: cancellation workflow, how to handle pending applications, confirmation mechanism, and how to display cancelled gigs. Test: verify clients can cancel gigs and pending applications are handled appropriately."

```

**Acceptance Criteria:**

- Clients can cancel their own OPEN gigs
- Pending applications are automatically rejected
- Confirmation required to prevent accidents
- Cancellation is logged and auditable
- Cancelled gigs remain visible but clearly marked
- Different from admin closure (client-initiated)

**Test:** Create gig, receive applications, cancel gig as client, verify all pending applications are rejected and gig is marked as cancelled (not just closed).

---

#### Iteration 23.3: Add Gig Templates

**Estimated Time:** 3 hours

**Goal:** Reduce repetitive work for clients who post similar gigs regularly.

**Ralphy-Plan Command:**

```

/ralphy-plan gig-mgmt-iteration-3 "Clients who regularly post similar types of gigs waste time re-entering the same information. Enable gig templates so they can reuse common patterns. Requirements: (1) Clients should be able to save any gig as a reusable template, (2) Templates should store all gig details for quick reuse, (3) Clients should be able to manage their templates (view, edit, delete), (4) Creating a gig from a template should pre-fill all fields but allow modification, (5) Templates are personal to each client (not shared). Propose: what to store in templates, template management UI, how to create gigs from templates, and where to access templates. Test: verify clients can create, use, and manage templates effectively."

```

**Acceptance Criteria:**

- Clients can save gigs as reusable templates
- Templates store all relevant gig details
- Can create new gigs from templates (pre-filled but editable)
- Template management interface (view, edit, delete)
- Templates are private to each client
- Templates reduce time to create similar gigs

**Test:** Save gig as template with custom name, create new gig from template, verify all fields are pre-filled, modify and post new gig, verify template is unchanged. Delete template, verify it's removed.

---

#### Iteration 23.4: Implement Gig Duplication

**Estimated Time:** 2 hours

**Goal:** Enable quick reposting of similar gigs without template management overhead.

**Ralphy-Plan Command:**

```

/ralphy-plan gig-mgmt-iteration-4 "Sometimes clients want to post a gig very similar to an existing one (same project, different phase; similar requirements, different budget). Enable quick duplication without the overhead of template management. Requirements: (1) Clients should be able to duplicate any of their existing gigs with one action, (2) Duplication should create a new independent gig with all details copied, (3) New gig should start in OPEN status regardless of original status, (4) Clients should be able to modify the duplicated gig before or after posting, (5) Duplication should be quick and obvious from gig detail page. Propose: where to place duplication action, what to copy, what to reset, and user flow. Test: verify duplication creates correct independent gigs."

```

**Acceptance Criteria:**

- Clients can duplicate any of their gigs
- Duplication creates new independent gig (not linked to original)
- All gig details are copied to new gig
- New gig starts in OPEN status
- Duplication action is easily discoverable
- Duplicated gig can be modified independently

**Test:** Duplicate a completed gig, verify new gig is created with same details but OPEN status and new ID. Modify duplicated gig, verify original is unchanged. Post duplicated gig, verify it functions as independent gig.

---

**Total:** 4 iterations × 2-3 hours = 8-12 hours

---

#### Change 24: specialist-portfolio-and-showcase

**Priority:** MEDIUM (Post-MVP) | **Size:** M | **Estimated Effort:** 2 weeks

**Build After:** Specialists request better ways to showcase their work

**Note:** Keep profiles simple for MVP (text-based only). Avoid over-engineering.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 24.1: Add Portfolio Items Model

**Estimated Time:** 2-3 hours

**Goal:** Enable specialists to showcase their past work and experience.

**Ralphy-Plan Command:**

```

/ralphy-plan portfolio-iteration-1 "Text-based profiles are limited for showcasing technical work. Specialists need to demonstrate their capabilities through concrete examples of past projects. Build the foundation for portfolio items that specialists can use to showcase their work. Requirements: (1) Specialists should be able to add multiple portfolio items representing different projects, (2) Each item should capture key project information (what it was, technologies used, their role), (3) Should support linking to live projects or repositories, (4) Specialists should be able to manage their portfolio items (create, edit, delete), (5) Portfolio should be visible to clients evaluating specialists. Propose: what information to capture per portfolio item, data structure, management interface, and where to display portfolio. Test: verify specialists can build and manage their portfolio effectively."

```

**Acceptance Criteria:**

- Specialists can create portfolio items for past projects
- Each item captures relevant project information
- Can link to external resources (live sites, repos)
- Full CRUD functionality for portfolio management
- Portfolio is visible to clients
- Management interface is intuitive

**Test:** Create multiple portfolio items as specialist, edit one, delete one, verify all operations work correctly. View specialist profile as client, verify portfolio items are visible.

---

#### Iteration 24.2: Add Image Upload for Portfolio

**Estimated Time:** 3-4 hours

**Goal:** Enable visual demonstration of work quality through project screenshots.

**Ralphy-Plan Command:**

```

/ralphy-plan portfolio-iteration-2 "Text descriptions alone don't convey the quality and polish of technical work. Specialists need to show, not just tell. Add image upload capability so specialists can showcase their work visually. Requirements: (1) Specialists should be able to upload screenshots or images of their projects, (2) Should support multiple images per portfolio item, (3) Images must be stored securely and reliably, (4) Should support common image formats (JPG, PNG), (5) File size limits should be reasonable, (6) Images should display attractively on portfolio. Propose: file storage solution, upload mechanism, image display approach, and file size/format restrictions. Test: verify specialists can upload and display project images effectively."

```

**Acceptance Criteria:**

- Specialists can upload images to portfolio items
- Multiple images per portfolio item supported
- Images are stored securely and reliably
- Common image formats supported (JPG, PNG)
- Reasonable file size limits enforced
- Images display attractively on portfolio

**Test:** Upload multiple images (JPG and PNG) to portfolio item, verify they're stored correctly and display properly on portfolio page. Try uploading oversized file, verify size limit is enforced.

---

#### Iteration 24.3: Create Public Portfolio Page

**Estimated Time:** 3 hours

**Goal:** Enable specialists to share their portfolio outside the platform for broader reach.

**Ralphy-Plan Command:**

```

/ralphy-plan portfolio-iteration-3 "Specialists want to share their portfolio with potential clients outside the platform (LinkedIn, personal networks, etc.). Create public portfolio pages that showcase specialist capabilities without requiring login. Requirements: (1) Each specialist should have a unique shareable URL, (2) Page should be accessible without authentication, (3) Should display all portfolio items, profile information, and skills attractively, (4) Should be optimized for sharing (good preview images, meta tags), (5) Should encourage visitors to engage through the platform. Propose: URL structure, what information to display, page design, and how to drive platform engagement. Test: verify public portfolio pages are accessible and showcase specialists effectively."

```

**Acceptance Criteria:**

- Each specialist has unique shareable portfolio URL
- Page accessible without login
- Displays portfolio items, profile, and skills attractively
- Optimized for social sharing (meta tags, previews)
- Encourages platform engagement
- Professional and polished presentation

**Test:** Access specialist's public portfolio URL without logging in, verify all information displays correctly. Share URL on social media, verify preview looks good. Verify call-to-action for platform engagement is present.

---

#### Iteration 24.4: Add Certifications

**Estimated Time:** 2-3 hours

**Goal:** Enable specialists to demonstrate formal qualifications and continuous learning.

**Ralphy-Plan Command:**

```

/ralphy-plan portfolio-iteration-4 "Professional certifications signal expertise and commitment to continuous learning. Enable specialists to showcase their formal qualifications. Requirements: (1) Specialists should be able to add certifications with relevant details (name, issuer, date), (2) Should support uploading certification documents or linking to verification URLs, (3) Certifications should be displayed on portfolio, (4) Admins should be able to verify certifications for added trust, (5) Verified certifications should have visual indicator. Propose: what certification information to capture, how to handle documents/links, verification workflow, and display approach. Test: verify specialists can add certifications and admins can verify them."

```

**Acceptance Criteria:**

- Specialists can add certifications with relevant details
- Can upload documents or link to verification URLs
- Certifications display on portfolio page
- Admins can mark certifications as verified
- Verified certifications have visual trust indicator
- Certification management is straightforward

**Test:** Add certification as specialist with document upload, verify it displays on portfolio. As admin, mark certification as verified, verify verified badge appears on portfolio.

---

#### Iteration 24.5: Implement Skills Endorsement

**Estimated Time:** 2-3 hours

**Goal:** Build social proof for specialist skills through peer endorsements.

**Ralphy-Plan Command:**

```

/ralphy-plan portfolio-iteration-5 "Self-reported skills lack credibility. Enable users who've worked with specialists to endorse their skills, creating social proof. Requirements: (1) Users should be able to endorse skills listed on specialist profiles, (2) Each user can endorse each skill only once per specialist (prevent spam), (3) Endorsement counts should be visible next to each skill, (4) Should be simple and low-friction (one-click endorsement), (5) Endorsements should come from real users (not anonymous). Propose: endorsement mechanism, how to prevent abuse, where to display endorsement counts, and who can endorse. Test: verify endorsement system builds credible social proof without being gameable."

```

**Acceptance Criteria:**

- Users can endorse skills on specialist profiles
- One endorsement per skill per user (prevents spam)
- Endorsement counts display next to skills
- Endorsement is simple and low-friction
- Only authenticated users can endorse
- System is resistant to gaming/abuse

**Test:** Endorse multiple skills on specialist profile, verify counts update. Try to endorse same skill twice, verify it's prevented. View profile as different user, endorse skills, verify counts increment correctly.

---

**Total:** 5 iterations × 2-3 hours = 10-15 hours

---

#### Change 25: analytics-and-reporting

**Priority:** LOW (Post-MVP) | **Size:** M | **Estimated Effort:** 2 weeks

**Build After:** Need data-driven insights for growth decisions

---

### Implementation Iterations (Ralph Loop)

#### Iteration 25.1: Build Client Analytics

**Estimated Time:** 3 hours

**Goal:** Help clients understand their platform usage and spending patterns.

**Ralphy-Plan Command:**

```

/ralphy-plan analytics-iteration-1 "Clients need visibility into their platform usage to justify continued investment and make informed decisions. Build analytics dashboard that helps clients understand their spending and activity patterns. Requirements: (1) Should show key metrics that matter to clients (spending, gig volume, completion rates), (2) Metrics should be accurate and trustworthy, (3) Should support time-based filtering to see trends, (4) Should be performant even with large data volumes, (5) Should help clients see value they're getting from platform. Propose: which metrics to track, how to calculate them efficiently, dashboard design, and filtering capabilities. Test: verify analytics provide useful insights and calculations are accurate."

```

**Acceptance Criteria:**

- Clients can view their spending and activity metrics
- Key metrics are accurate and meaningful
- Date range filtering works correctly
- Dashboard is performant with large data volumes
- Metrics help clients understand platform value
- Calculations use efficient database aggregations

**Test:** View client analytics dashboard, verify metrics are accurate by comparing to actual data. Apply date range filters, verify filtered metrics are correct. Test with client who has many gigs, verify performance is acceptable.

---

#### Iteration 25.2: Build Specialist Analytics

**Estimated Time:** 3 hours

**Goal:** Help specialists track their earnings and optimize their platform strategy.

**Ralphy-Plan Command:**

```

/ralphy-plan analytics-iteration-2 "Specialists need to understand their performance to optimize their strategy (which gigs to apply for, pricing, etc.). Build analytics dashboard that helps specialists track earnings and success patterns. Requirements: (1) Should show metrics that help specialists improve (earnings, application success rate, etc.), (2) Should help specialists understand what's working and what's not, (3) Should support time-based analysis to see trends, (4) Should be accurate and trustworthy, (5) Should motivate continued platform engagement. Propose: which metrics matter most to specialists, how to calculate them, dashboard design, and insights to surface. Test: verify analytics help specialists understand and improve their performance."

```

**Acceptance Criteria:**

- Specialists can view their earnings and performance metrics
- Metrics help specialists optimize their strategy
- Application success rate and other key metrics are accurate
- Date range filtering enables trend analysis
- Dashboard motivates continued engagement
- Calculations are efficient and accurate

**Test:** View specialist analytics dashboard, verify earnings match actual payments. Check application success rate calculation. Apply date filters, verify metrics update correctly. Test with specialist who has many applications, verify performance is good.

---

#### Iteration 25.3: Build Admin Analytics

**Estimated Time:** 3 hours

**Goal:** Provide platform health visibility for data-driven operational decisions.

**Ralphy-Plan Command:**

```

/ralphy-plan analytics-iteration-3 "Admins need comprehensive platform health metrics to make informed decisions about growth, moderation, and resource allocation. Build admin analytics dashboard that provides visibility into platform performance. Requirements: (1) Should show key platform health indicators (revenue, user growth, engagement), (2) Should help identify problems early (declining metrics, abuse patterns), (3) Should support strategic decision-making with trend data, (4) Should include visual charts for easy pattern recognition, (5) Should be comprehensive but not overwhelming. Propose: which metrics are most important for platform health, how to visualize trends effectively, dashboard organization, and what alerts or thresholds to surface. Test: verify admin analytics provide actionable insights for platform management."

```

**Acceptance Criteria:**

- Admins can view comprehensive platform health metrics
- Key indicators help identify problems and opportunities
- Visual charts make trends easy to understand
- Metrics support strategic decision-making
- Dashboard is comprehensive but organized
- Calculations are accurate and efficient

**Test:** View admin analytics dashboard, verify all metrics are accurate. Check that charts display trends correctly. Verify metrics help identify platform health issues (e.g., declining engagement, revenue trends).

---

#### Iteration 25.4: Add Report Export

**Estimated Time:** 2-3 hours

**Goal:** Enable users to analyze data externally and maintain records for compliance.

**Ralphy-Plan Command:**

```

/ralphy-plan analytics-iteration-4 "Users need to export analytics data for external analysis, accounting, or compliance purposes. Enable report export functionality across all analytics dashboards. Requirements: (1) Users should be able to export currently displayed data, (2) Export format should be standard and widely compatible (CSV), (3) Exported data should match what's displayed on dashboard, (4) Should respect current filters and date ranges, (5) Export should be fast and reliable even with large datasets. Propose: export format, what data to include, how to handle large exports, and where to place export functionality. Test: verify exports are accurate and usable for external analysis."

```

**Acceptance Criteria:**

- Users can export analytics data from all dashboards
- Export format is standard and compatible (CSV)
- Exported data matches dashboard display
- Current filters and date ranges are respected
- Export works reliably with large datasets
- Export functionality is easily discoverable

**Test:** Export reports from client, specialist, and admin dashboards. Verify exported CSV data matches displayed metrics. Apply filters, export, verify filtered data is exported. Open exported files in spreadsheet software, verify format is correct.

---

**Total:** 4 iterations × 2-3 hours = 8-12 hours

---

#### Change 26: multi-milestone-gigs

**Priority:** LOW (Post-MVP) | **Size:** L | **Estimated Effort:** 3-4 weeks

**Build After:** Large projects (500k+ RUB) become common

**Note:** For MVP, large projects should be split into multiple gigs manually.

---

### Implementation Iterations (Ralph Loop)

#### Iteration 26.1: Add Milestone Model

**Estimated Time:** 2-3 hours

**Goal:** Enable breaking large projects into manageable phases with independent tracking.

**Ralphy-Plan Command:**

```

/ralphy-plan milestone-iteration-1 "Large projects (500k+ RUB) are risky to handle as single all-or-nothing deliverables. Enable breaking them into milestones for incremental progress and payment. Build the data foundation for milestone-based gigs. Requirements: (1) Must support multiple milestones per gig, each representing a distinct deliverable, (2) Each milestone needs its own budget, description, due date, and status, (3) Milestones must maintain order (phase 1, phase 2, etc.), (4) Must distinguish milestone-based gigs from simple gigs, (5) Should support future features like partial payments and independent approval. Propose: database schema for milestones, how to link to gigs, status tracking approach, and ordering mechanism. Test: verify milestone data can be stored with proper relationships and ordering."

```

**Acceptance Criteria:**

- Milestones can be created and linked to gigs
- Each milestone tracks budget, description, due date, and status
- Milestones maintain proper ordering
- Milestone-based gigs are distinguishable from simple gigs
- Data structure supports independent milestone workflow
- Relationships and ordering are enforced correctly

**Test:** Manually create gig with multiple milestones in database, verify they link correctly to gig, verify ordering is maintained, verify each milestone has independent status tracking.

---

#### Iteration 26.2: Implement Milestone Creation

**Estimated Time:** 3-4 hours

**Goal:** Enable clients to structure large projects into clear phases during gig creation.

**Ralphy-Plan Command:**

```

/ralphy-plan milestone-iteration-2 "Clients creating large projects need to break them into manageable phases upfront. Enable milestone definition during gig creation. Requirements: (1) Clients should be able to optionally create milestone-based gigs, (2) Should support adding/removing milestones dynamically in the form, (3) Each milestone needs title, description, budget, and due date, (4) Total milestone budgets must equal total gig budget (validation), (5) Should be intuitive and not overwhelming for clients who want simple gigs. Propose: UI design for milestone creation, validation approach, how to make it optional vs required, and user experience flow. Test: verify clients can create milestone-based gigs with proper validation."

```

**Acceptance Criteria:**

- Clients can optionally create milestone-based gigs
- Can dynamically add/remove milestones in creation form
- Each milestone captures necessary information
- Budget validation ensures milestones sum to total
- Simple gigs remain simple (milestones are optional)
- Form is intuitive and not overwhelming

**Test:** Create gig with 3 milestones, verify all data saves correctly. Try to create gig where milestone budgets don't sum to total (should fail validation). Create simple gig without milestones (should work normally).

---

#### Iteration 26.3: Implement Milestone Workflow

**Estimated Time:** 4 hours

**Goal:** Enable incremental progress tracking and approval for large projects.

**Ralphy-Plan Command:**

```

/ralphy-plan milestone-iteration-3 "Large projects need incremental progress validation, not all-or-nothing delivery. Implement independent workflow for each milestone so work can be reviewed and approved incrementally. Requirements: (1) Specialists should be able to submit individual milestones for review, (2) Clients should be able to approve or request changes per milestone, (3) Milestones should be completed in order (can't skip ahead), (4) Gig is only fully complete when all milestones are approved, (5) Both parties should have clear visibility into which milestones are pending/complete. Propose: milestone workflow states, submission/approval mechanism, ordering enforcement, and how to track overall gig progress. Test: verify milestone workflow enables incremental progress and approval."

```

**Acceptance Criteria:**

- Specialists can submit individual milestones for review
- Clients can approve or request changes per milestone
- Milestones must be completed in order
- Gig completion requires all milestones approved
- Clear visibility into milestone status for both parties
- Workflow is similar to simple gigs but at milestone level

**Test:** Create multi-milestone gig, submit first milestone as specialist, approve as client. Submit second milestone, request changes, resubmit, approve. Verify gig is only complete when all milestones approved.

---

#### Iteration 26.4: Integrate with Payment System

**Estimated Time:** 4-5 hours

**Goal:** Enable incremental payment releases to reduce risk for large projects.

**Ralphy-Plan Command:**

```

/ralphy-plan milestone-iteration-4 "Large projects with single payment at the end create cash flow problems for specialists and risk for clients. Integrate milestone workflow with payment system to enable incremental payment releases. Requirements: (1) When a milestone is approved, its portion of escrowed funds should be released, (2) Payment system must track which milestones have been paid, (3) Gig is only fully paid when all milestones are completed and paid, (4) Partial payments should be reflected in specialist earnings, (5) Must work with existing escrow and payment release mechanisms. Propose: how to calculate and release partial payments, payment tracking approach, integration with existing payment system, and how to handle payment failures. Test: verify partial payments are released correctly as milestones complete."

```

**Acceptance Criteria:**

- Milestone approval triggers partial payment release
- Payment system tracks milestone payment status
- Gig marked as fully paid only when all milestones paid
- Partial payments reflected in specialist earnings
- Integrates with existing escrow system
- Payment failures are handled gracefully

**Test:** Complete and approve first milestone, verify partial payment released to specialist. Complete remaining milestones, verify each releases its payment. Verify gig is marked as fully paid only after all milestones paid.

---

#### Iteration 26.5: Build Timeline Visualization

**Estimated Time:** 3-4 hours

**Goal:** Provide clear visibility into project progress for better coordination and expectations.

**Ralphy-Plan Command:**

```

/ralphy-plan milestone-iteration-5 "Multi-milestone projects need clear progress visualization so both parties understand where they are and what's next. Build timeline visualization that shows milestone progress at a glance. Requirements: (1) Should display all milestones with their status and due dates visually, (2) Should show overall project completion percentage, (3) Should make it easy to see what's done, what's in progress, and what's upcoming, (4) Should be visible to both client and specialist on gig detail page, (5) Should update in real-time as milestones progress. Propose: visualization approach (timeline, progress bar, checklist), what information to display, how to calculate completion percentage, and where to place it. Test: verify timeline provides clear understanding of project progress."

```

**Acceptance Criteria:**

- Visual timeline displays all milestones with status
- Overall completion percentage is calculated and displayed
- Easy to understand what's done, in progress, and upcoming
- Visible to both client and specialist
- Updates as milestones progress
- Timeline is intuitive and informative

**Test:** View multi-milestone gig detail page, verify timeline displays all milestones correctly. Complete a milestone, verify timeline updates and completion percentage increases. Verify both client and specialist see the same timeline.

---

**Total:** 5 iterations × 3-4 hours = 15-20 hours

---

## Conclusion

### Current State Summary

**Development Cycle: COMPLETE ✅**

Gigly has successfully completed its initial development cycle with **20 changes implemented** via ralphy-spec methodology. The platform is a **functional MVP** with:

- ✅ Complete core marketplace loop (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- ✅ All critical features implemented (messaging, structured requirements, applications)
- ✅ Three user roles fully functional (CLIENT, SPECIALIST, ADMIN)
- ✅ ~1,280 lines of clean, maintainable TypeScript code
- ✅ 95% alignment with strategic vision from project.md

**Current Phase: QA & Polish**

The project has transitioned from **feature development** to **production readiness**. Focus areas:

1. **Security Hardening** (WTBD-1) - Fix XSS, rate limiting, CSRF, password requirements
2. **Infrastructure Migration** (WTBD-2) - PostgreSQL, error tracking, production hosting
3. **Critical Features** (WTBD-3-5) - Email notifications, password reset, pagination
4. **Quality & Polish** (WTBD-6-7) - Test coverage, UI/UX implementation
5. **Production Validation** (WTBD-8) - Security audit, performance testing, beta testing

**Timeline to Production:** 2-3 months (depending on resource availability)

---

### Strategic Decision Point

**The organization must now decide:**

**Option A: Commit to Custom Code**
- **Pros:** Full control, no platform risk, better for Russian market, positions well for fundraising
- **Cons:** Requires security hardening, UI/UX work, ongoing maintenance
- **Timeline:** 2-3 months to production-ready
- **Cost:** 50-100k RUB for frontend dev (optional), infrastructure ~$50-100/month

**Option B: Pivot to Bubble.com for MVP Validation**
- **Pros:** Designers can build directly, faster to polished product, lower technical risk
- **Cons:** Platform risk (sanctions, access), vendor lock-in, migration cost later
- **Timeline:** 2-4 weeks to polished MVP
- **Cost:** $100-300/month subscription

**Option C: Hybrid Approach**
- Launch ugly beta with custom code (2-3 weeks)
- Validate with 10-20 friendly users
- Hire frontend dev when validated (50-100k RUB)
- Polish and scale

**Recommendation:** Given the functional codebase, desktop-only requirement, and geopolitical considerations for Russian startups, **Option A (commit to custom code)** or **Option C (hybrid)** are strategically superior to Bubble for long-term success.

---

### Immediate Next Steps (If Committing to Custom Code)

**Week 1-2: Critical Security Fixes**
1. Decide service fee (10% or 20%) and update code OR documentation
2. Add input sanitization (DOMPurify)
3. Add rate limiting (@upstash/ratelimit)
4. Create .env.example with documentation
5. Add password requirements

**Week 3-4: Infrastructure Setup**
1. Migrate to PostgreSQL (Neon, Supabase, or Railway)
2. Set up error tracking (Sentry)
3. Configure staging + production environments
4. Set up monitoring and logging

**Week 5-6: Critical Features**
1. Implement email notifications (SendGrid/Postmark)
2. Add password reset flow
3. Add pagination to gig browsing

**Week 7-10: UI/UX Implementation**
- **Option A:** AI-assisted with shadcn/ui (4-6 weeks, $20/month)
- **Option B:** Hire frontend dev (2-3 weeks, 50-100k RUB)
- **Option C:** Hybrid approach (3-4 weeks, 30-50k RUB)

**Week 11-12: Production Validation**
1. Security audit
2. Performance testing
3. Beta testing with 5-10 users
4. Fix critical issues
5. Launch

---

### Success Metrics to Track (Post-Launch)

**MVP Validation (First 3 Months):**

- **Organic Retention:** >30% clients post 2nd gig without nudging (KEY METRIC)
- **Core Loop Completion:** >60% of gigs reach COMPLETED
- **Time-to-Hire:** <7 days from post to accept
- **Application Quality:** 3-5 applications per gig
- **Ghosting Rate:** <5% specialists abandon after accept
- **Empty Bar Rate:** <15% gigs get 0 applications

**Post-MVP Growth (Months 3-12):**

- Active Clients: 10-20 → 100-200
- Specialist Pool: 50-100 → 500-1,000
- Monthly Gig Volume: 20-40 → 200-400
- Platform Revenue: 150k-300k → 1.5M-3M RUB/month (at 10% fee)

---

### Investment Required

**QA & Polish Phase (2-3 months):**

- Frontend developer (optional): 50-100k RUB one-time
- Infrastructure: ~$50-100/month (PostgreSQL, hosting, error tracking)
- Email service: ~$20-50/month
- **Total: 50-100k RUB + $70-150/month**

**Post-MVP Infrastructure (After Validation):**

- Payment gateway: ~$100-200/month + transaction fees
- Additional services: ~$100-200/month
- **Total: ~$300-600/month**

---

### Key Takeaways

**✅ What's Working:**
- Ralphy-spec methodology successfully generated 20 functional changes
- Core business logic is sound and well-implemented
- Strategic vision is 95% implemented in code
- Desktop-only requirement makes AI UI implementation viable
- Codebase is clean, maintainable, and extensible

**⚠️ What Needs Attention:**
- Security vulnerabilities must be fixed before production
- SQLite must be replaced with PostgreSQL
- UI/UX needs designer implementation
- Test coverage is zero (needs basic tests)
- Email notifications critical for user engagement

**🎯 Strategic Positioning:**
- Requirements clarity as differentiator is fully implemented
- "Project Success System" positioning is supported by features
- Platform is well-suited for Russian B2B market
- Full control over tech stack (no platform risk)
- Ready for fundraising conversations (you own your tech)

---

### Final Recommendation

**The codebase is good enough to commit to custom code development.**

With 20 completed changes, functional core loop, and solid architecture, Gigly has a strong foundation. The QA & Polish phase is standard software development work, not a rebuild.

**For a Russian B2B marketplace with long-term ambitions:**
- Custom code > Bubble (geopolitical risk, platform limitations)
- Desktop-only makes AI UI implementation viable
- 2-3 months to production is acceptable timeline
- Investment required (50-100k RUB + infrastructure) is reasonable

**Next action:** Decide whether to commit resources to QA & Polish phase, or pivot to alternative approach for faster market validation.

---

**End of Strategic Roadmap v3.0**

**Document Status:** Updated February 18, 2026 to reflect completion of development cycle and transition to QA & Polish phase.

_For questions or clarifications on any recommended change, refer to the ralphy-plan commands provided. All downgraded features remain strategic post-MVP goals and are NOT abandoned._
```
