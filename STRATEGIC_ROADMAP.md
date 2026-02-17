# Gigly Strategic Roadmap & Next Steps

**Document Version:** 2.0 (Updated for MVP-First Philosophy)
**Date:** February 16, 2026
**Current Project State:** 13 completed changes, Advanced Presentational MVP

---

## Executive Summary

This document provides a comprehensive strategic assessment of the Gigly platform's current state and recommends prioritized next steps for achieving **MVP validation and market launch**.

**Key Strategic Shift:** The roadmap now reflects an **MVP-first philosophy** where the priority is to **validate operational value** (companies get work done, specialists earn more) rather than build complete legal/financial infrastructure upfront.

All recommendations are aligned with the project's core mission: connecting Russian IT companies with Middle+/Senior specialists through a structured, transparent gig lifecycle.

**Critical Insight:** Payment processing, legal entity verification, and contract systems are **strategic post-MVP goals**, not MVP blockers. The MVP focuses on proving the core operational loop works with logical status tracking.

**Requirements Clarity as Core Value:** Gigly differentiates by helping clients define success upfront (structured requirements, Definition of Done) and specialists demonstrate competence (approach, clarifying questions). This "Project Success System" reduces disputes and scope creep.

---

## Product-Market-Fit Assessment

### Current Stage: Advanced Presentational MVP → Ready for Operational Validation

**Strengths:**

- ✅ Complete core marketplace loop functional
- ✅ All three user roles (CLIENT, SPECIALIST, ADMIN) fully implemented
- ✅ Professional UI with proper UX patterns
- ✅ Full gig lifecycle with state management (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- ✅ Admin moderation and audit logging
- ✅ Profile system with role-specific data
- ✅ Search and filtering capabilities

**Critical Gaps for MVP Launch:**

- ❌ **No in-platform communication** (CRITICAL: prevents platform leakage to Telegram, loses dispute context)
- ❌ **No structured requirements/applications** (CRITICAL: fuzzy requirements cause disputes, scope creep, and project failures)

**Post-MVP Goals (Important but NOT MVP Blockers):**

- ⏸️ No actual payment processing (logical status tracking sufficient for MVP)
- ⏸️ No legal entity verification (manual handling acceptable for MVP)
- ⏸️ No contract/agreement system (deferred to post-MVP)
- ⏸️ No notification system (nice-to-have, not critical)
- ⏸️ SQLite acceptable for MVP (PostgreSQL for scaling post-MVP)
- ⏸️ No rating/review system (reputation building is post-MVP)

**Verdict:** The platform can **onboard real users for MVP validation** with two critical additions:

1. **Simple in-platform messaging** to prevent platform leakage and maintain context for disputes
2. **Structured requirements and applications** to reduce disputes, scope creep, and project failures

Payment processing, legal infrastructure, and advanced features are strategic post-MVP goals once operational value is proven.

---

## Implementation Strategy

### MVP Philosophy

> "Validate operational value first: prove companies use this to get work done and specialists use this to earn more. Build legal/financial infrastructure after core value is proven, not before."

**Key Principle:** Deferred features are NOT abandoned - they are strategic post-MVP goals. We prioritize operational validation over infrastructure perfection.

### Immediate Priority (Next 1-2 Weeks) - MVP LAUNCH CRITICAL

**Goal:** Enable real user testing with operational MVP

1. **messaging-system** (Change 14) - **CRITICAL UPGRADE**
   - Prevents platform leakage (Telegram negotiations)
   - Maintains dispute context
   - Simple "Gig Chat" or "Context Comments" sufficient
   - **This is a blocking feature for MVP launch**

2. **structured-requirements-and-applications** (Change 15) - **CRITICAL UPGRADE**
   - Reduces disputes and scope creep (root cause of project failures)
   - Creates quality filter on both sides (good friction)
   - Structured gig creation (required Definition of Done field)
   - Structured applications (approach, questions, time estimate)
   - **This is a blocking feature for MVP launch**

### Short-Term Priority (Post-MVP, 1-3 Months) - VALIDATION PHASE

**Goal:** Gather data, validate metrics, iterate based on feedback

2. **Monitor MVP Success Metrics:**
   - Organic Retention (>30% clients post 2nd gig)
   - Core Loop Completion Rate (>60%)
   - Time-to-Hire (<7 days)
   - Track failure modes: "Ghosting" and "Empty Bar"

3. **Iterate based on user feedback:**
   - Identify friction points in core loop
   - Simplify where needed
   - Resist feature creep

### Medium-Term Priority (3-6 Months) - INFRASTRUCTURE PHASE

**Goal:** Build legal/financial infrastructure after operational value is proven

3. **payment-gateway-integration** (Change 16) - **DOWNGRADED FROM CRITICAL**
   - Note: MVP uses logical PAID status, not real payments
   - Build this AFTER validating users complete the core loop
   - Strategic post-MVP goal, not MVP blocker

4. **production-database-migration** (Change 18) - **DOWNGRADED FROM HIGH**
   - Note: SQLite is acceptable for MVP (10-20 clients, 50-100 specialists)
   - Migrate to PostgreSQL when scaling beyond MVP targets
   - Strategic post-MVP goal, not MVP blocker

5. **notification-system** (Change 17) - **DOWNGRADED FROM HIGH**
   - Note: Nice-to-have, not critical for MVP
   - Users can check platform manually initially
   - Strategic post-MVP goal, not MVP blocker

### Long-Term Priority (6+ Months) - TRUST & SCALE PHASE

**Goal:** Build trust mechanisms and scale features

6. **legal-entity-verification** (Change 19) - **DOWNGRADED FROM HIGH**
   - Note: Manual handling acceptable for MVP
   - Build automated INN/KPP validation after proving market fit
   - Strategic post-MVP goal, not MVP blocker

7. **rating-and-review-system** (Change 20)
8. **contract-and-terms-system** (Change 21)
9. **advanced-search-and-discovery** (Change 22)
10. **Other enhancements** (Changes 23-26)

### Priority Adjustment Summary

**UPGRADED:**

- ✅ **messaging-system** (Change 14): Now recognized as MVP blocker
- ✅ **structured-requirements-and-applications** (Change 15): Now recognized as MVP blocker

**DOWNGRADED (but NOT abandoned):**

- ⏸️ **payment-gateway-integration** (Change 16): Post-MVP, logical status sufficient for MVP
- ⏸️ **notification-system** (Change 17): Post-MVP, nice-to-have
- ⏸️ **production-database-migration** (Change 18): Post-MVP, SQLite fine for MVP scale
- ⏸️ **legal-entity-verification** (Change 19): Post-MVP, manual handling acceptable

**Important Note:** All downgrades are **MVP-only**. These features remain **strategic post-MVP goals** and are NOT abandoned. We prioritize operational validation before building heavy infrastructure.

---

## Recommended Changes (Detailed)

### Phase 1: MVP Launch (CRITICAL - Week 1-2)

---

#### Change 14: messaging-system

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

**Goal:** Create database structure for messages and verify data persistence.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-1 "Create database structure for storing messages between client and assigned specialist on a gig. Messages should link to gig and sender, include content and timestamp. Create migration and verify data persists. No UI yet - just data layer. Test: manually create messages via Prisma Studio, verify they persist and link correctly to gigs and users."
```

**Acceptance Criteria:**

- Message model exists in schema
- Migration runs successfully
- Can create messages via Prisma Studio
- Messages have proper relations to Gig and User

**Test:** Open Prisma Studio, manually create a message, verify it appears in database.

---

#### Iteration 14.2: Display Messages on Gig Detail Page

**Estimated Time:** 2-3 hours

**Goal:** Show existing messages to users (read-only).

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-2 "Display messages on gig detail page in chronological order. Show sender name and timestamp. Only visible when user is client OR assigned specialist. Use simple list rendering. Test with seeded messages from iteration 1. See project.md for access control principles."
```

**Acceptance Criteria:**

- Messages display on `/dashboard/gigs/[id]` page
- Only client and assigned specialist see messages
- Messages show sender, content, timestamp
- Chronological order (oldest first)

**Test:** Navigate to gig detail page as client, verify messages appear. Navigate as non-assigned specialist, verify messages don't appear.

---

#### Iteration 14.3: Add Message Sending Form

**Estimated Time:** 2-3 hours

**Goal:** Allow users to send new messages.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-3 "Add message sending capability below message list. Simple form with textarea and submit button. Use useActionState pattern. On success, redirect to refresh messages. Basic validation: content required, reasonable max length. Only client and assigned specialist can send. See project.md for server action patterns."
```

**Acceptance Criteria:**

- Form appears below message list
- sendMessage action creates message in database
- Page refreshes after send, new message appears
- Error handling for empty messages
- Role-based access control

**Test:** Send message as client, verify it appears. Send as specialist, verify it appears. Try as non-assigned user, verify error.

---

#### Iteration 14.4: Polish and Edge Cases

**Estimated Time:** 1-2 hours

**Goal:** Handle edge cases and improve UX.

**Ralphy-Plan Command:**

```
/ralphy-plan messaging-iteration-4 "Handle edge cases: show appropriate message when no messages exist yet, when specialist not assigned yet. Trim whitespace from messages. Add simple visual distinction between client and specialist messages. Test across all gig statuses (OPEN, IN_PROGRESS, COMPLETED, etc)."
```

**Acceptance Criteria:**

- Empty state message when no messages
- Clear messaging when specialist not assigned
- Messages visually distinguish client vs specialist
- Works across all gig statuses

**Test:** Check messaging on OPEN gig (no specialist), IN_PROGRESS gig (has specialist), COMPLETED gig.

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

**Goal:** Add required acceptanceCriteria field to database and gig creation form.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-1 "Add required acceptance criteria field to gig creation. This should be a separate field from description, clearly labeled as 'Definition of Done' or 'Acceptance Criteria'. Enforce minimum length (suggest 50+ chars). Update gig creation form and display on gig detail page. Test: cannot create gig without acceptance criteria. See project.md Design Principle #1 (Clarity Through Structure)."
```

**Acceptance Criteria:**

- acceptanceCriteria field exists in Gig model
- Gig creation form has acceptanceCriteria textarea
- Form validation prevents submission without it
- Acceptance criteria displays on gig detail page

**Test:** Try to create gig without acceptance criteria (should fail). Create gig with acceptance criteria, verify it saves and displays.

---

#### Iteration 15.2: Add Optional Structured Fields to Gig Creation

**Estimated Time:** 2-3 hours

**Goal:** Add optional guided fields (goal, deliverables, constraints) with helpful prompts.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-2 "Add optional structured fields to help clients articulate requirements: goal/outcome, specific deliverables, constraints/preferences. Make these optional but encourage use through helpful placeholder text and prompts. Display on gig detail page when filled. Goal: guide non-technical clients without making form feel like homework. See project.md CLIENT persona pain points."
```

**Acceptance Criteria:**

- goal, deliverables, constraints fields in Gig model
- Form has optional textareas with helpful placeholders
- Fields display on gig detail when filled
- Can create gig without these fields (optional)

**Test:** Create gig with all fields filled, verify display. Create gig with only required fields, verify it works.

---

#### Iteration 15.3: Add Structured Fields to Application Form

**Estimated Time:** 2-3 hours

**Goal:** Add required approach and clarifyingQuestions fields to applications.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-3 "Update application form to require: technical approach/methodology, clarifying questions about requirements. Add optional estimated effort field. Use prompts that emphasize engineering competence over sales pitches. Display these fields in application list for client review. See project.md SPECIALIST persona - they prefer concrete technical discussions over marketing fluff."
```

**Acceptance Criteria:**

- approach, clarifyingQuestions, estimatedEffort in Application model
- Application form has required textareas with prompts
- Cannot submit application without approach and questions
- Fields display in application list for client review

**Test:** Try to apply without approach (should fail). Apply with all fields, verify client sees them on gig detail page.

---

#### Iteration 15.4: Create Seed Example Gigs

**Estimated Time:** 2-3 hours

**Goal:** Seed 3-5 realistic example gigs demonstrating clear requirements.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-4 "Create 3-5 example gigs that demonstrate excellent requirements. Cover different project types (backend, frontend, DevOps, etc). Each should show: clear acceptance criteria, well-defined goals, specific deliverables, realistic constraints. Make them visible on gig browsing with visual indicator. These teach clients what good requirements look like."
```

**Acceptance Criteria:**

- Seed script creates 3-5 example gigs
- Examples demonstrate clear, specific requirements
- Examples cover different project types
- Visible on gig browsing with visual indicator

**Test:** Run seed script, browse gigs, verify examples appear and demonstrate quality requirements.

---

#### Iteration 15.5: Add UX Polish and Soft Validation

**Estimated Time:** 2-3 hours

**Goal:** Add helpful warnings and improve form UX.

**Ralphy-Plan Command:**

```
/ralphy-plan requirements-iteration-5 "Add soft validation to guide clients: warn if acceptance criteria seems too short or vague (don't block, just suggest). Add character counters to help gauge completeness. Improve form layout with clear sections. Add link to example gigs from creation form. Test across different user flows and browsers."
```

**Acceptance Criteria:**

- Soft warning for short acceptance criteria
- Character counters on textareas
- Clear form sections with helpful copy
- Link to example gigs from creation form
- Works on all browsers

**Test:** Create gig with short acceptance criteria (see warning). Create with detailed criteria (no warning). Check form UX on desktop.

---

**Total for Change 15:** 5 iterations × 2-3 hours = 10-15 hours (matches original estimate)

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

**Goal:** Choose Russian payment provider and understand integration requirements.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-1 "Research Russian payment providers suitable for B2B marketplace with escrow (YooKassa, Tinkoff, Sberbank). Compare fees, escrow support, B2B features, API quality. Select provider and document rationale. Set up test account and verify API access works. Document integration requirements. No code yet - just research and setup."
```

**Acceptance Criteria:**

- Provider selected with documented rationale
- Test account created and verified
- API documentation reviewed
- Integration requirements documented

**Test:** Successfully authenticate with test API credentials.

---

#### Iteration 16.2: Add Payment Model to Database

**Estimated Time:** 2-3 hours

**Goal:** Create database structure for tracking payments.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-2 "Create database structure for tracking payment transactions. Should link to gig, track payment status (pending/held/released/refunded), store provider transaction ID, invoice URL, and relevant timestamps. Test by manually creating payment records and verifying relations work correctly."
```

**Acceptance Criteria:**

- Payment model exists with all fields
- Relation to Gig works correctly
- Can create payment records manually
- Migration runs successfully

**Test:** Create payment record in Prisma Studio, verify it links to gig correctly.

---

#### Iteration 16.3: Implement Basic Payment Initiation

**Estimated Time:** 3-4 hours

**Goal:** Charge client when they accept application (test mode).

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-3 "Integrate payment charging when client accepts application. Call payment provider API to charge totalAmount in TEST mode. Store transaction details. Handle API errors gracefully - if payment fails, application acceptance should be blocked. Test with provider's test card numbers. See project.md for service fee model (10% on top of budget)."
```

**Acceptance Criteria:**

- initiatePayment action exists
- Calls payment provider API in test mode
- Creates Payment record on success
- Handles API errors without breaking app
- Application acceptance blocked if payment fails

**Test:** Accept application with test card, verify payment record created. Try with invalid card, verify error handling.

---

#### Iteration 16.4: Implement Payment Release

**Estimated Time:** 2-3 hours

**Goal:** Release funds to specialist when gig marked as PAID.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-4 "Implement escrow release when client marks gig as PAID. Call payment provider API to release held funds. Update payment status and timestamp. Handle API errors gracefully (log but don't block - can retry manually). Test with test transactions."
```

**Acceptance Criteria:**

- releasePayment action exists
- Calls payment provider release API
- Updates Payment record status
- Handles errors gracefully
- Logs release timestamp

**Test:** Mark gig as PAID, verify payment release API called, verify Payment record updated.

---

#### Iteration 16.5: Add Invoice Generation

**Estimated Time:** 3-4 hours

**Goal:** Generate PDF invoices for legal entities.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-5 "Implement PDF invoice generation for B2B compliance. Invoice should include company details (INN/KPP from ClientProfile), gig details, budget breakdown, service fee, total amount, payment date. Generate when payment initiated, store URL. Add download link for client. See project.md for B2B context and Russian market requirements."
```

**Acceptance Criteria:**

- PDF generation library integrated
- Invoice template includes all required fields
- PDF generated on payment initiation
- Invoice URL stored in database
- Client can download invoice

**Test:** Initiate payment, verify PDF generated, download invoice, verify all fields correct.

---

#### Iteration 16.6: Implement Refund Handling

**Estimated Time:** 2-3 hours

**Goal:** Allow admin to refund payments in disputes.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-6 "Add admin refund capability for dispute resolution. Create refund action (ADMIN only) that calls payment provider refund API. Update payment status and create moderation log entry with reason. Add refund UI to admin gig view. Test refund flow with test transactions."
```

**Acceptance Criteria:**

- refundPayment action exists (ADMIN only)
- Calls payment provider refund API
- Updates Payment status
- Creates ModerationLog entry
- Admin UI has refund button

**Test:** As admin, refund a payment, verify API called, verify Payment status updated, verify ModerationLog created.

---

#### Iteration 16.7: Add Payment Webhooks

**Estimated Time:** 3-4 hours

**Goal:** Handle payment provider callbacks for status updates.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-7 "Create webhook endpoint to receive payment provider callbacks. Verify webhook signatures for security. Handle payment events (succeeded, failed, refunded) and update database accordingly. Register webhook URL with payment provider. Test using provider's webhook testing tools."
```

**Acceptance Criteria:**

- Webhook endpoint exists
- Signature verification works
- Handles payment events correctly
- Updates database on events
- Logs all webhook calls

**Test:** Use payment provider's webhook testing tool, send test events, verify database updates.

---

#### Iteration 16.8: Production Mode and Testing

**Estimated Time:** 4-6 hours

**Goal:** Switch to production mode and conduct end-to-end testing.

**Ralphy-Plan Command:**

```
/ralphy-plan payment-iteration-8 "Switch to production mode with real API keys. Test complete payment flow end-to-end: charge → hold → release. Test refund flow. Test error scenarios. Document production setup and add monitoring for payment failures. Conduct final verification with small real payment."
```

**Acceptance Criteria:**

- Production API keys configured
- End-to-end payment flow works
- Refund flow works
- Error handling tested
- Monitoring in place

**Test:** Complete full gig lifecycle with real (small) payment. Verify all steps work. Test refund.

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

**Goal:** Configure email service and verify it works.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-1 "Set up email delivery infrastructure for the platform. Choose and configure an email service provider suitable for transactional emails. Verify emails can be sent and delivered successfully. Document the setup process. This is infrastructure only - no user-facing features yet. Test: send test email to yourself, verify it arrives in inbox."
```

**Test:** Send test email, verify it arrives in inbox.

---

#### Iteration 17.2: Create Notification Preferences Model

**Estimated Time:** 2 hours

**Goal:** Allow users to opt in/out of notification types.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-2 "Create database structure and UI for managing notification preferences. Users should be able to control which types of events trigger email notifications (applications, messages, status changes). Preferences should default to enabled. Build a settings page where users can toggle these preferences on/off. Test: change preferences, verify they persist after page refresh."
```

**Test:** Toggle notification preferences, verify they persist after page refresh.

---

#### Iteration 17.3: Implement Application Notifications

**Estimated Time:** 2-3 hours

**Goal:** Send emails when applications are received/accepted/rejected.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-3 "Implement email notifications for the application lifecycle. When a specialist applies to a gig, notify the client. When a client accepts or rejects an application, notify the specialist. Emails should include relevant context and links back to the platform. Respect user notification preferences. Test with real email addresses to verify delivery and content."
```

**Test:** Apply to gig, verify client receives email. Accept application, verify specialist receives email.

---

#### Iteration 17.4: Implement Work Status Notifications

**Estimated Time:** 2-3 hours

**Goal:** Send emails for work submission and approval.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-4 "Implement email notifications for work lifecycle events. When a specialist submits work for review, notify the client. When a client approves work, notify the specialist. When payment is marked as complete, notify the specialist. Emails should provide context and links to the gig. Respect user preferences. Test: complete full gig workflow, verify emails sent at each transition."
```

**Test:** Complete gig workflow, verify emails sent at each step.

---

#### Iteration 17.5: Implement Message Notifications

**Estimated Time:** 2 hours

**Goal:** Send email when new message received.

**Ralphy-Plan Command:**

```
/ralphy-plan notification-iteration-5 "Implement email notifications for new messages between client and specialist on a gig. When a message is sent, notify the recipient via email. Include message preview and link to the gig conversation. Respect user preferences. Add rate limiting to prevent notification spam when multiple messages are sent in quick succession. Test: send messages, verify recipient gets email. Send multiple messages quickly, verify rate limiting works."
```

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

**Goal:** Provision PostgreSQL database and verify connectivity.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-1 "Provision a PostgreSQL database instance for production use. Choose a hosting provider suitable for the project. Verify you can connect to the database from your local development environment. Create a backup of the current SQLite database before proceeding. Document connection details securely. This is infrastructure setup only - no schema changes yet. Test: connect to PostgreSQL from local machine using a database client."
```

**Test:** Connect to PostgreSQL from local machine using psql or database client.

---

#### Iteration 18.2: Update Prisma Schema for PostgreSQL

**Estimated Time:** 2 hours

**Goal:** Change datasource to PostgreSQL and handle dialect differences.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-2 "Migrate the Prisma schema from SQLite to PostgreSQL. Update the datasource configuration and handle any database dialect differences between SQLite and PostgreSQL. Run migrations to create the schema in PostgreSQL. Verify all tables and relationships are created correctly. Test: run migration, verify all tables exist in PostgreSQL using a database client."
```

**Test:** Run migration, verify all tables exist in PostgreSQL using database client.

---

#### Iteration 18.3: Add Performance Indexes

**Estimated Time:** 2-3 hours

**Goal:** Add indexes on frequently queried fields.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-3 "Optimize database query performance by adding indexes on frequently queried fields. Identify which fields are used in WHERE clauses, JOIN conditions, and ORDER BY statements throughout the application. Add appropriate indexes to the Prisma schema. Create and run the migration. Test query performance with a large dataset to verify indexes are being used effectively. Test: seed large dataset (1000+ records), run common queries, verify they use indexes."
```

**Test:** Seed large dataset, run queries, verify they use indexes (EXPLAIN ANALYZE).

---

#### Iteration 18.4: Migrate Data from SQLite

**Estimated Time:** 3-4 hours

**Goal:** Transfer existing data to PostgreSQL.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-4 "Create and execute a data migration script to transfer all existing data from SQLite to PostgreSQL. Export data from SQLite preserving all relationships and IDs. Import into PostgreSQL ensuring referential integrity is maintained. Verify data integrity by comparing record counts and checking that relationships are intact. Test the application with PostgreSQL to ensure all features work identically to SQLite. Test: run migration script, verify record counts match between databases, test all application features with PostgreSQL."
```

**Test:** Run migration script, verify record counts match, test all app features with PostgreSQL.

---

#### Iteration 18.5: Configure Connection Pooling

**Estimated Time:** 2 hours

**Goal:** Set up connection pooling for production performance.

**Ralphy-Plan Command:**

```
/ralphy-plan database-iteration-5 "Configure database connection pooling to handle concurrent users efficiently in production. Set up connection pooling using appropriate tools for PostgreSQL. Update the database connection configuration. Test under load by simulating multiple concurrent users. Monitor connection usage to ensure pooling is working correctly. Document the pooling configuration for production deployment. Test: simulate concurrent requests (50+ users), verify connection pooling works, check connection limits aren't exceeded."
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

**Goal:** Add database fields for tracking verification status.

**Ralphy-Plan Command:**

```
/ralphy-plan verification-iteration-1 "Create database structure to track legal entity verification status for clients. Add fields to store verification state (pending, verified, rejected) and timestamp. Create migration. Add visual indicator (badge) on client profiles and gig listings to show verified status. Test: manually set verification status in database, verify badge displays correctly on profiles and gig listings."
```

**Test:** Set client to VERIFIED in database, verify badge shows on profile and gigs.

---

#### Iteration 19.2: Create Verification Request Flow

**Estimated Time:** 3 hours

**Goal:** Allow clients to request verification.

**Ralphy-Plan Command:**

```
/ralphy-plan verification-iteration-2 "Build the client-facing verification request flow. Clients should be able to submit a verification request with their legal entity information (INN required). Create the server action and UI form. When submitted, update the client's verification status to pending. Display the pending status to the client. Test: as a client, submit verification request, verify status changes to pending and is visible in the UI."
```

**Test:** As client, request verification, verify status shows as PENDING.

---

#### Iteration 19.3: Build Admin Verification Workflow

**Estimated Time:** 3-4 hours

**Goal:** Allow admin to approve/reject verification requests.

**Ralphy-Plan Command:**

```
/ralphy-plan verification-iteration-3 "Build the admin interface for reviewing and processing verification requests. Create a page listing all pending verification requests with relevant client information. Admins should be able to approve or reject requests with a reason. On approval, mark the client as verified with timestamp. On rejection, update status and log the reason. Both actions should create moderation log entries. Test: as admin, approve a verification request and verify client sees verified badge. Reject one and verify status updates correctly."
```

**Test:** As admin, approve a verification request, verify client sees VERIFIED badge. Reject one, verify status updates.

---

#### Iteration 19.4: Integrate INN Validation API

**Estimated Time:** 4-5 hours

**Goal:** Automatically validate INN against Russian tax service database.

**Ralphy-Plan Command:**

```
/ralphy-plan verification-iteration-4 "Integrate automated INN validation to verify legal entity information. Research and integrate with an appropriate INN validation service (Russian tax service database or third-party API). When a client submits a verification request, validate the INN format and check if the company exists in the registry. If invalid or not found, show an error immediately. If valid, proceed to pending status for admin review. Store company information retrieved from the API. Test with valid INNs (should succeed), invalid format INNs (should fail), and non-existent INNs (should fail)."
```

**Test:** Submit verification with valid INN (should succeed), invalid INN (should fail), non-existent INN (should fail).

---

#### Iteration 19.5: Add Document Upload (Optional)

**Estimated Time:** 3-4 hours

**Goal:** Allow clients to upload registration documents.

**Ralphy-Plan Command:**

```
/ralphy-plan verification-iteration-5 "Add optional document upload capability to the verification request process. Clients should be able to upload supporting documents (registration certificate, charter, etc.) to support their verification request. Integrate with a file storage solution. Store document references in the database. Make uploaded documents accessible to admins during the verification review process. Test: upload documents during verification request, verify admin can view them on the verification review page."
```

**Test:** Upload document during verification request, verify admin can view it.

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

**Time:** 2-3 hours | **Goal:** Create database structure for reviews.

**Command:** `/ralphy-plan review-iteration-1 "Create database structure for storing reviews and ratings. Reviews should link to a gig and track both the reviewer and reviewee. Include rating (1-5 scale) and optional comment. Support bidirectional reviews (client reviews specialist, specialist reviews client). Create migration. Test: manually create reviews in database, verify data structure supports all required relationships."`

---

#### Iteration 20.2: Implement Review Submission

**Time:** 3 hours | **Goal:** Allow users to submit reviews after gig completion.

**Command:** `/ralphy-plan review-iteration-2 "Build the review submission flow for completed gigs. After a gig is marked as paid, both client and specialist should be able to review each other. Create the server action and UI form for submitting reviews with rating and optional comment. Ensure users can only review gigs they participated in and only after completion. Test: submit reviews as both client and specialist, verify they save correctly and are associated with the right gig and users."`

---

#### Iteration 20.3: Display Reviews on Profiles

**Time:** 2-3 hours | **Goal:** Show reviews and average rating on user profiles.

**Command:** `/ralphy-plan review-iteration-3 "Display reviews and ratings on user profile pages. Calculate and show the average rating prominently on profiles. List all reviews with pagination. Both client and specialist profiles should display their reviews. Test: verify average rating calculations are correct, pagination works properly, and reviews display with all relevant information."`

---

#### Iteration 20.4: Add Admin Moderation

**Time:** 2 hours | **Goal:** Allow admin to hide inappropriate reviews.

**Command:** `/ralphy-plan review-iteration-4 "Build admin moderation capability for reviews. Admins should be able to hide reviews that violate platform policies or contain inappropriate content. Hidden reviews should remain in the database but not display publicly. Create the admin interface and server action for hiding reviews. Test: as admin, hide a review and verify it no longer displays publicly but remains in the database."`

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

**Time:** 2 hours | **Goal:** Require ToS acceptance on registration.

**Command:** `/ralphy-plan contract-iteration-1 "Implement Terms of Service acceptance requirement during user registration. Users should not be able to complete registration without accepting the ToS. Store the acceptance timestamp for legal compliance. Add a checkbox to the registration form that must be checked before submission. Test: attempt to register without accepting ToS (should fail), register with ToS acceptance (should succeed and store timestamp)."`

---

#### Iteration 21.2: Add Contract Model

**Time:** 2-3 hours | **Goal:** Create structure for gig-specific contracts.

**Command:** `/ralphy-plan contract-iteration-2 "Create database structure for storing gig-specific contract terms. Contracts should be associated with gigs and track acceptance by the specialist. Support versioning for contract updates. Allow clients to optionally add custom terms when creating a gig (beyond the standard platform terms). Test: create gigs with custom contract terms, verify they're stored correctly and associated with the gig."`

---

#### Iteration 21.3: Implement Contract Acceptance

**Time:** 3 hours | **Goal:** Require specialist to accept contract before work starts.

**Command:** `/ralphy-plan contract-iteration-3 "Implement contract acceptance flow for specialists. After a client accepts a specialist's application, the specialist must review and accept the contract terms before work can begin. Display the contract (platform terms plus any custom gig-specific terms) to the specialist. Create the acceptance action. The gig should not transition to in-progress status until the contract is accepted. Test: accept an application, verify specialist sees contract, accept contract, verify gig status updates to in-progress."`

---

#### Iteration 21.4: Generate Contract PDFs

**Time:** 3-4 hours | **Goal:** Create downloadable contract documents.

**Command:** `/ralphy-plan contract-iteration-4 "Implement PDF generation for contracts. When a specialist accepts a contract, generate a PDF document containing all contract terms, gig details, and both parties' information. Integrate with a PDF generation library. Store the generated PDF and provide download links to both parties. Test: accept a contract, verify PDF is generated correctly with all required information, download and review the PDF document."`

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

**Time:** 2-3 hours | **Goal:** Paginate gig browsing.

**Command:** `/ralphy-plan search-iteration-1 "Implement pagination for gig browsing to handle large numbers of gigs. Currently all open gigs load at once, which won't scale beyond ~100 gigs. Add pagination controls to the gig browsing interface. Implement server-side pagination in the database queries. Test: create a large number of gigs (100+), verify pagination works correctly and users can navigate between pages."`

---

#### Iteration 22.2: Implement Saved Searches

**Time:** 3 hours | **Goal:** Allow specialists to save filter combinations.

**Command:** `/ralphy-plan search-iteration-2 "Build saved search functionality for specialists. Allow specialists to save their filter combinations (budget range, tags, etc.) with a custom name for quick access later. Create database structure to store saved searches. Add UI for saving, loading, and deleting saved searches. Display saved searches on the specialist dashboard for easy access. Test: create a saved search with specific filters, navigate away, load the saved search later and verify filters are applied correctly."`

---

#### Iteration 22.3: Add Gig Recommendations

**Time:** 3-4 hours | **Goal:** Recommend gigs based on specialist profile.

**Command:** `/ralphy-plan search-iteration-3 "Implement a recommendation system to suggest relevant gigs to specialists. Match gig requirements with specialist skills and experience from their profile. Display recommended gigs prominently on the specialist dashboard. The recommendation algorithm should consider tags, tech stack, and other relevant profile information. Test: verify recommendations are relevant to the specialist's profile and skills."`

---

#### Iteration 22.4: Add Advanced Filters

**Time:** 2-3 hours | **Goal:** Add more filter options.

**Command:** `/ralphy-plan search-iteration-4 "Expand filtering capabilities for gig search. Add additional filter criteria beyond the current basic filters (budget, tags). Consider filters like experience level required, deadline, location preferences, and remote work options. Implement full-text search on gig titles and descriptions. Update the database schema if needed to support new filter fields. Test: apply various filter combinations, verify results are accurate and full-text search works correctly."`

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

**Time:** 2-3 hours | **Goal:** Allow clients to edit gigs before applications received.

**Command:** `/ralphy-plan gig-mgmt-iteration-1 "Build gig editing capability for clients. Clients should be able to modify gig details (title, description, budget, tags) before any applications have been received. Once applications exist, editing should be disabled to prevent changing terms after specialists have applied. Create the edit page and server action. Test: edit a gig with no applications and verify changes save. Try editing a gig with applications and verify it's blocked with an appropriate error message."`

---

#### Iteration 23.2: Implement Gig Closure

**Time:** 2 hours | **Goal:** Allow clients to cancel OPEN gigs.

**Command:** `/ralphy-plan gig-mgmt-iteration-2 "Build gig cancellation capability for clients. Clients should be able to cancel open gigs that are no longer needed. This is different from admin closure - it's client-initiated. When a gig is closed, automatically reject all pending applications. Add a cancellation button with confirmation dialog to prevent accidental closures. Test: cancel an open gig, verify status changes to closed and all pending applications are rejected."`

---

#### Iteration 23.3: Add Gig Templates

**Time:** 3 hours | **Goal:** Allow clients to save gigs as templates for reuse.

**Command:** `/ralphy-plan gig-mgmt-iteration-3 "Build gig template functionality for clients who frequently post similar gigs. Clients should be able to save a gig as a template with a custom name. Templates should store all gig details (title, description, tags, budget) for reuse. Create a template management page where clients can view, edit, and delete their templates. Allow clients to create new gigs from saved templates. Test: save a gig as a template, create a new gig from that template, verify all details are copied correctly."`

---

#### Iteration 23.4: Implement Gig Duplication

**Time:** 2 hours | **Goal:** Allow clients to duplicate existing gigs.

**Command:** `/ralphy-plan gig-mgmt-iteration-4 "Build gig duplication functionality for clients. Clients should be able to quickly create a new gig based on an existing one. Add a duplication button on the gig detail page. When duplicated, copy all gig details (title, description, budget, tags) but create a new gig with open status. The new gig should be independent of the original. Test: duplicate a gig, verify a new gig is created with the same details but as a separate entity with open status."`

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

**Time:** 2-3 hours | **Goal:** Create structure for portfolio items.

**Command:** `/ralphy-plan portfolio-iteration-1 "Create database structure for specialists to showcase their work through portfolio items. Each portfolio item should represent a project or work sample with title, description, link, and technologies used. Build CRUD functionality so specialists can create, edit, and delete their portfolio items. Create a portfolio management page for specialists. Test: create, edit, and delete portfolio items, verify all operations work correctly."`

---

#### Iteration 24.2: Add Image Upload for Portfolio

**Time:** 3-4 hours | **Goal:** Allow specialists to upload project images.

**Command:** `/ralphy-plan portfolio-iteration-2 "Add image upload capability to portfolio items. Specialists should be able to upload screenshots or images of their work to showcase visually. Integrate with a file storage solution for storing images. Update the portfolio item structure to support multiple images per item. Display uploaded images on portfolio items. Test: upload images to a portfolio item, verify they're stored correctly and display properly."`

---

#### Iteration 24.3: Create Public Portfolio Page

**Time:** 3 hours | **Goal:** Build shareable portfolio page for specialists.

**Command:** `/ralphy-plan portfolio-iteration-3 "Create public-facing portfolio pages for specialists. Each specialist should have a shareable URL where they can showcase their profile, portfolio items, and skills. The page should be accessible without login and optimized for sharing with potential clients. Display all portfolio items, profile information, and tech stack in an attractive layout. Test: access a specialist's public portfolio page, verify all information displays correctly and the page is accessible without authentication."`

---

#### Iteration 24.4: Add Certifications

**Time:** 2-3 hours | **Goal:** Allow specialists to upload certifications.

**Command:** `/ralphy-plan portfolio-iteration-4 "Build certification management for specialists. Specialists should be able to upload professional certifications, courses, and credentials to strengthen their profiles. Create database structure to store certification details (name, issuer, file/link). Integrate file upload for certification documents. Display certifications on the specialist's portfolio page. Add admin capability to mark certifications as verified. Test: upload a certification, verify it displays on the portfolio, have admin mark it as verified."`

---

#### Iteration 24.5: Implement Skills Endorsement

**Time:** 2-3 hours | **Goal:** Allow users to endorse specialist skills.

**Command:** `/ralphy-plan portfolio-iteration-5 "Build a skills endorsement system where users can vouch for a specialist's skills. Create database structure to track endorsements (who endorsed which skill for which specialist). Add endorsement buttons on specialist profiles for each listed skill. Display endorsement counts next to each skill. Users should only be able to endorse each skill once per specialist. Test: endorse skills on a specialist profile, verify endorsement counts update correctly and duplicate endorsements are prevented."`

---

**Total:** 5 iterations × 2-3 hours = 10-15 hours

---

#### Change 25: analytics-and-reporting

**Priority:** LOW (Post-MVP) | **Size:** M | **Estimated Effort:** 2 weeks

**Build After:** Need data-driven insights for growth decisions

---

### Implementation Iterations (Ralph Loop)

#### Iteration 25.1: Build Client Analytics

**Time:** 3 hours | **Goal:** Show spending and activity metrics to clients.

**Command:** `/ralphy-plan analytics-iteration-1 "Build an analytics dashboard for clients to track their spending and activity on the platform. Display key metrics like total spending, number of active gigs, completed gigs, and average gig value. Use database aggregations to calculate these metrics efficiently. Add date range filtering so clients can view metrics for specific time periods. Test: verify all calculations are accurate, test date range filtering works correctly."`

---

#### Iteration 25.2: Build Specialist Analytics

**Time:** 3 hours | **Goal:** Show earnings and performance metrics to specialists.

**Command:** `/ralphy-plan analytics-iteration-2 "Build an analytics dashboard for specialists to track their earnings and performance on the platform. Display key metrics like total earnings, application success rate, average rating, and earnings breakdown by time period. Use database aggregations to calculate these metrics efficiently. Add date range filtering so specialists can view metrics for specific time periods. Test: verify all calculations are accurate, test date range filtering works correctly."`

---

#### Iteration 25.3: Build Admin Analytics

**Time:** 3 hours | **Goal:** Show platform health metrics to admin.

**Command:** `/ralphy-plan analytics-iteration-3 "Build an analytics dashboard for admins to monitor overall platform health and growth. Display key platform metrics like total revenue, user growth trends, gig volume, and top performing users. Add visual charts to make trends easy to understand. Use database aggregations to calculate these metrics efficiently. Test: verify all metrics are accurate and charts display correctly."`

---

#### Iteration 25.4: Add Report Export

**Time:** 2-3 hours | **Goal:** Allow users to export reports.

**Command:** `/ralphy-plan analytics-iteration-4 "Implement report export functionality for all analytics dashboards. Users should be able to export their analytics data for external analysis or record-keeping. Generate exports in a standard format (CSV) containing the currently filtered data. Add export buttons to all analytics pages (client, specialist, and admin). Test: export reports from each analytics page, verify the exported data matches what's displayed and is correctly formatted."`

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

**Time:** 2-3 hours | **Goal:** Create database structure for milestones.

**Command:** `/ralphy-plan milestone-iteration-1 "Create database structure to support breaking large gigs into multiple milestones. Each milestone should represent a distinct deliverable with its own budget, description, due date, and status tracking. Milestones should be ordered and linked to their parent gig. Add a flag to gigs to indicate whether they use milestones. Create migration. Test: manually create milestones in database, verify they link correctly to gigs and maintain proper ordering."`

---

#### Iteration 26.2: Implement Milestone Creation

**Time:** 3-4 hours | **Goal:** Allow clients to define milestones during gig creation.

**Command:** `/ralphy-plan milestone-iteration-2 "Build the UI and logic for clients to define milestones when creating a gig. Clients should be able to optionally break their gig into multiple milestones, each with its own title, description, budget, and due date. The form should support dynamically adding and removing milestones. Validate that the sum of all milestone budgets equals the total gig budget. Test: create a gig with multiple milestones, verify all milestone data is saved correctly and budget validation works."`

---

#### Iteration 26.3: Implement Milestone Workflow

**Time:** 4 hours | **Goal:** Add submit/approve actions per milestone.

**Command:** `/ralphy-plan milestone-iteration-3 "Build the workflow for completing milestones independently. Each milestone should have its own submission and approval cycle, similar to how single gigs work but at the milestone level. Specialists should be able to submit individual milestones for review. Clients should be able to approve or request changes for each milestone independently. The gig should only be fully complete when all milestones are approved. Test: complete a multi-milestone gig by submitting and approving each milestone one by one, verify the workflow works correctly."`

---

#### Iteration 26.4: Integrate with Payment System

**Time:** 4-5 hours | **Goal:** Release partial payments per milestone.

**Command:** `/ralphy-plan milestone-iteration-4 "Integrate milestone-based gigs with the payment system to support partial payment releases. When a milestone is approved, the corresponding portion of the escrowed funds should be released to the specialist. The payment system should track which milestones have been paid and which are still pending. The full gig is only marked as paid when all milestones are completed and paid. Test: complete and approve a milestone, verify the partial payment is released correctly. Complete all milestones, verify the full gig is marked as paid."`

---

#### Iteration 26.5: Build Timeline Visualization

**Time:** 3-4 hours | **Goal:** Show milestone progress visually.

**Command:** `/ralphy-plan milestone-iteration-5 "Build a visual timeline component to display milestone progress for multi-milestone gigs. The timeline should show all milestones with their status, due dates, and completion progress. Display this timeline on the gig detail page so both client and specialist can track overall progress. Calculate and display overall completion percentage (e.g., 2 of 5 milestones completed). Test: view a multi-milestone gig, verify the timeline displays correctly and updates as milestones are completed."`

---

**Total:** 5 iterations × 3-4 hours = 15-20 hours

---

## Conclusion

### Current State Summary

Gigly is a **well-architected, feature-complete presentational MVP** ready for operational validation with two critical additions: **simple in-platform messaging** and **structured requirements/applications**.

### Critical Path to MVP Launch (Ralph Loop Methodology)

**The roadmap now follows Ralph loop iterations: each iteration is 2-4 hours of work with independent testability.**

**Week 1: Messaging System (Change 14)**

- Iteration 14.1: Add Message Model (2-3 hours)
- Iteration 14.2: Display Messages (2-3 hours)
- Iteration 14.3: Add Sending Form (2-3 hours)
- Iteration 14.4: Polish & Edge Cases (1-2 hours)
- **Total: 8-12 hours across 4 iterations**

**Week 2: Structured Requirements (Change 15)**

- Iteration 15.1: Add Acceptance Criteria Field (2-3 hours)
- Iteration 15.2: Add Optional Structured Fields (2-3 hours)
- Iteration 15.3: Update Application Form (2-3 hours)
- Iteration 15.4: Seed Example Gigs (2-3 hours)
- Iteration 15.5: UX Polish & Validation (2-3 hours)
- **Total: 10-15 hours across 5 iterations**

**MVP Launch (Week 3):**

- Deploy to production (SQLite is fine for MVP scale)
- Onboard 10-20 pilot clients
- Recruit 50-100 vetted specialists

**Validation Phase (Months 1-3):**

- Monitor success metrics:
  - Organic Retention (>30%)
  - Core Loop Completion (>60%)
  - Time-to-Hire (<7 days)
  - Track "Ghosting" and "Empty Bar" failures
- Gather qualitative feedback
- Iterate on core loop based on data

**Post-MVP Infrastructure (Months 3-6):**

- Build Changes 16-19 AFTER validation:
  - Payment gateway integration (8 iterations)
  - Notification system (5 iterations)
  - Database migration to PostgreSQL (5 iterations)
  - Legal entity verification (5 iterations)

### Ralph Loop Best Practices

**Each iteration should:**

- ✅ Take 2-4 hours maximum
- ✅ Have ONE clear, testable outcome
- ✅ Be independently verifiable
- ✅ Allow course correction if needed

**How to use the commands:**

1. Start an iteration: `/ralphy-plan [iteration-name]` (copy command from roadmap)
2. Review the agent's proposal
3. Implement: `/ralphy-implement [iteration-name]`
4. Test the outcome (use test plan from iteration description)
5. If successful, move to next iteration
6. If issues found, fix before proceeding

**Why this matters:**

- Small iterations = faster feedback
- Easy to spot problems early
- Can pivot if approach is wrong
- Lower risk, less rework

### Success Metrics to Track

**MVP Validation (First 3 Months):**

- **Organic Retention:** >30% clients post 2nd gig without nudging
- **Core Loop Completion:** >60% of gigs reach COMPLETED
- **Time-to-Hire:** <7 days from post to accept
- **Application Quality:** 3-5 applications per gig
- **Ghosting Rate:** <5% specialists abandon after accept
- **Empty Bar Rate:** <15% gigs get 0 applications

**Post-MVP Growth (Months 3-12):**

- Active Clients: 10-20 → 100-200
- Specialist Pool: 50-100 → 500-1,000
- Monthly Gig Volume: 20-40 → 200-400
- Platform Revenue: 150k-300k → 1.5M-3M RUB/month

### Investment Required (MVP Phase)

**Development Resources:**

- 2-3 weeks for Changes 14-15 (messaging + requirements)
- Working in 2-4 hour iterations
- Minimal infrastructure costs (SQLite, basic hosting)

**External Services (MVP):**

- Hosting: ~$20-50/month (Vercel, Railway, or similar)
- Domain: ~$10/year
- **Total MVP Cost:** <$100/month

**Post-MVP Services (After Validation):**

- Payment gateway: ~$100-200/month + transaction fees
- Email service: ~$50-100/month
- Database hosting: ~$50-100/month (PostgreSQL)
- **Total Post-MVP Cost:** ~$300-600/month

### Final Recommendation

**Gigly has strong product-market fit potential for the Russian B2B IT freelance market.**

**Recommended immediate action:**

1. ✅ Start with Change 14, Iteration 14.1 (2-3 hours)
2. ✅ Complete each iteration before moving to next
3. ✅ Test thoroughly after each iteration
4. ✅ Launch MVP after completing Changes 14-15
5. ⏸️ Build infrastructure (payments, legal, notifications) AFTER proving core value

**Key success factor:** Follow Ralph loop discipline. Each iteration should be 2-4 hours and independently testable. Don't combine iterations or skip testing. The methodology's power comes from rapid feedback and course correction.

**The platform is TWO FEATURES away from MVP launch.** Focus on messaging and requirements structure, working in small iterations, launch, and learn.

**Positioning Advantage:** By making requirements clarity a first-class concern, Gigly differentiates as a "Project Success System" (not just a job board). The 10% fee is justified by operational value: faster hiring, clear process, and structure that makes projects succeed.

---

**End of Strategic Roadmap**

_For questions or clarifications on any recommended change, refer to the ralphy-plan commands provided. All downgraded features remain strategic post-MVP goals and are NOT abandoned._
