# Project Context

Gigly is a high-end B2B freelance marketplace for the Russian IT market. It connects legal entities (Clients) with vetted Middle+/Senior specialists.

## Product Vision & Philosophy

### Problem Statement

Russian tech companies (especially product teams and startups) constantly need to outsource development and related roles.
The market suffers from:

- A lack of reliable **Middle+/Senior specialists** available "per task" rather than only for full-time roles.
- Operational pain: work needs to be done **"yesterday"**, but finding and vetting people takes weeks.
- **Fuzzy requirements and unclear "definition of done"**: Most project failures stem from poorly specified tasks, not lack of talent. Non-technical stakeholders struggle to articulate clear requirements, leading to scope creep, disputes, and wasted effort.
- A gap between expectations and reality: missed deadlines, weak quality, misaligned deliverables.
- For Middle+/Senior specialists: a **salary ceiling** in otherwise comfortable roles and slow income growth in recent years. They want to monetize their seniority more, without quitting or burning out.

Full legal robustness and B2B document workflows are important in the long term, but **for the MVP they are not the primary pain**.
Right now the priority is to ensure that:
- companies **actually get work done** via outsourcing, and
- specialists **actually earn more** by leveraging their seniority.

### Solution Approach

Gigly is a B2B marketplace that:
- connects **legal entities** (Clients) with **strong Middle+/Senior specialists** (Specialists);
- provides a **transparent, structured gig lifecycle**: create → get applications → choose specialist → do the work → submit → approve → mark as paid;
- **helps clients define success upfront** through structured gig creation (required "Definition of Done", guided prompts for deliverables and constraints);
- **helps specialists demonstrate competence** through structured applications (approach, clarifying questions, time estimates);
- in the long run, aims to become a **financial and legal intermediary**, but at the MVP stage focuses on **operational value**: "quickly find a strong specialist and drive a specific piece of work to completion."

### Target Market

**Primary (MVP):**
- Russian IT companies and product teams (~10–100 employees) that constantly have more work than their core team can handle.
- Startups and small teams where "everything is on fire": lots of work that should have been done yesterday, but no in-house senior or friendly network of experts.

**Specialist pool:**
- Middle+/Senior engineers, architects, DevOps and related roles with ~5+ years of experience who want to:
  - increase their total income;
  - take on interesting, well-paid gigs on top of a comfortable primary job.

**CIS/global expansion is not a goal for now.** The focus is strictly on Russia (RUB, local market realities and culture).

### Competitive Positioning

- **vs Upwork:** Local Russian focus, RUB budgets, local context. For the MVP: simpler entry, less global bureaucracy.
- **vs FL.ru / Kwork / Habr Freelance:** Emphasis on **execution quality** (Middle+/Senior), not on sheer volume. More structured process (clear gig lifecycle). Over time: stronger B2B specifics (legal entities, documents), but not in the first release.
- **vs Toptal:** Reference model ("Russian Toptal Lite") in market positioning. Less exclusive/expensive, more accessible for Russian mid-market. Focus on operational efficiency over elite curation.

### Core Value Propositions (MVP Focus)

1. **Get Work Done Fast** – for companies: quickly find a strong specialist and get a concrete piece of work delivered.
2. **Earn More as a Senior** – for specialists: monetize seniority beyond salary ceilings without blowing up their current life.
3. **Clarity Upfront, Success at the End** – structured requirements (Definition of Done) and structured applications (Approach, Questions) create mutual understanding before work begins, reducing disputes and scope creep.
4. **Structured Gig Lifecycle** – a predictable process from gig creation to completion and "marked as paid."
5. **B2B-Oriented Mindset** – even in the MVP, we assume a B2B context: company clients, RUB pricing, clear statuses, transparent amounts.

### Service Fee Model

- The platform currently uses a **10% fee on top of the gig budget**, charged to the Client. The Specialist sees and receives the full budget amount.
- This is **not a sacred or final number**, but a temporary, mathematically convenient default.
- Service fee is currently set to 10% for simplicity and may be adjusted after real-market validation.

### MVP Philosophy

> "We accept reasonable imperfections in legal/financial infrastructure to validate the core operational value proposition quickly. The goal is to prove that companies will use this to get work done and specialists will use this to earn more, not to build a perfect LegalTech system on day one."

## User Personas

### CLIENT Persona: Tech Lead / PM / Founder at a Russian Company

**Who they are:**
- CTO, Tech Lead, Project Manager, HR/Recruiter or Founder in a product company / startup (~10–100 people).

**Pain points:**
- Constant need to offload parts of work to external specialists when the core team is overloaded.
- Hard to quickly find a strong senior through personal networks or recommendations.
- **Struggle to articulate clear requirements**: Non-technical stakeholders know what they want but can't translate it into technical specs, leading to misaligned expectations.
- **Scope creep and disputes**: Without clear "Definition of Done", projects expand endlessly or end in conflict over what was actually agreed upon.
- Missed deadlines and low quality when working with random freelancers.
- In startups – everything is urgent, there is no spare capacity, and no strong senior on staff.

**Needs:**
- Quickly find a **competent** specialist for a particular piece of work.
- **Help defining what "done" looks like** without feeling like they need a technical degree.
- Understand the final budget and platform fee upfront.
- Have a clear view of who is working on what and where each gig is in its lifecycle.

**Success criteria:**
- Work is done **on time** and with acceptable quality.
- **No surprises or disputes** about what was delivered vs. what was expected.
- Minimal time spent on search and coordination.
- Ability to come back to the same specialist again.

### SPECIALIST Persona: Senior Developer / Consultant

**Who they are:**
- 5–15 years of experience in development / architecture / DevOps.
- Already have a primary job or stable income, but have hit a salary ceiling.

**Pain points:**
- Salary in a "comfortable" full-time role grows slowly.
- They want to earn more, but without burning out or quitting.
- When working with clients directly:
  - risk of non-payment or long delays,
  - scope creep without extra pay,
  - conflicts around expectations and quality.
- **Tired of "salesy" freelancing**: Hate writing generic cover letters ("Hire me, I'm a rockstar!"), prefer concrete technical discussions.
- **Wasted time on fuzzy projects**: Apply to gigs only to discover the client has no idea what they actually want.

**Needs:**
- Opportunities to take **well-paid, bounded gigs** on top of their main income.
- **Clients who know what they want**: Clear requirements and Definition of Done upfront.
- **A way to demonstrate competence through substance, not marketing**: Show their approach and ask clarifying questions instead of generic pitches.
- More predictable clients and work than random one-off requests.
- A simple scheme at the MVP stage: clear budgets, minimal bureaucracy.

**Success criteria:**
- Noticeable increase in total income (thanks to "fat" gigs).
- Projects that are interesting and not pure chaos.
- **No scope creep or endless revisions** due to unclear requirements.
- Returning clients and a growing reputation.

### ADMIN Persona

**Who they are:**
- Platform operator / moderator.

**Responsibilities:**
- Keep the ecosystem healthy.
- Block obvious abuse, fraud and toxic behavior.
- Intervene in disputes when needed.

**MVP Tools:**
- Basic tools to suspend users and close problematic gigs are enough.

## Design Principles

1. **Clarity Through Structure (Not Bureaucracy)**
   - Requirements clarity is the foundation of project success. We guide clients to articulate clear "Definition of Done" and specialists to propose concrete approaches.
   - Structure is implemented through thoughtful UX (helpful prompts, examples, guided fields), not heavy tooling or mandatory templates.
   - This creates "good friction" that filters for quality on both sides: clients who care about outcomes, specialists who think before applying.

2. **Trust Through Transparency (but not legal perfection in the MVP)**
   - All money flows (budget, fee) are explicit and understandable.
   - Gig and application statuses are clear.
   - No hidden deductions from the Specialist's payout.

3. **Professional B2B Experience (long-term direction)**
   - The platform is designed for a B2B context: companies, projects, RUB contracts.
   - Legal documents and full compliance are an important **long-term goal**, but **not a hard MVP requirement**.

4. **Quality Over Quantity**
   - Focus on Middle+/Senior specialists rather than a mass influx of juniors.
   - Clients are companies, not random consumers.

5. **Russian Market First**
   - Everything is in RUB and tuned for Russian market realities and communication culture.
   - Future roadmap may include INN/KPP checks, integrations with local systems, etc., but not in the initial MVP.

6. **Simplicity in the Core Flow (MVP)**
   - The core loop must be straightforward: create gig → receive applications → accept one → work → submit → approve → mark as paid.
   - Complex features (milestones, detailed portfolios, advanced pricing tiers) are postponed until the core value is proven.

7. **MVP First, Legal Perfection Later**
   - Current priority: **solve today's operational pain** around outsourcing and senior income, not build a perfect LegalTech system.
   - The team accepts reasonable legal imperfections to validate the product hypothesis quickly.

8. **Productivity Tool, Not Useless Middleman**
   - Position as a tool that removes friction from outsourcing, not just a platform taking fees.
   - The 10% fee is for operational value (faster hiring, clear process, requirements structure), not gatekeeping.

## Business Rules & Constraints

### Service Fee Model

- **Current setting:** The Client pays **budget + 10% fee**. The Specialist sees and receives the full budget amount.
- **Status:** This is a **temporary MVP parameter**, not a long-term strategic constant. It can and will change based on data and unit economics.
- **Transparency:** The fee is clearly shown during gig creation and when accepting an application.

### Escrow / Payments (MVP)

- There is no real payment gateway integration yet. "Payment" is a **logical status** (`PAID`), not an actual financial transfer through the platform.
- The goal of the MVP is to learn to **manage statuses and confirmations correctly**, not to process real payments.
- In the future, a real payment system will be integrated behind the same lifecycle.

### Quality Standards

- **Positioning:** Middle+/Senior only is part of the brand. At the MVP stage this is a **soft constraint** implemented via profiles and messaging, not heavy-weight verification.
- **Minimum gig size:**
  - Minimum: ~10,000 RUB – smaller gigs don't justify the coordination overhead.
  - Expected average: 150k–200k RUB.
  - Larger projects should be **split into multiple gigs** manually ("Backend part 1", "Backend part 2").

### Legal / B2B Requirements (Long-Term)

- Clients are legal entities (or individual entrepreneurs).
- For the MVP, parts of legal checks and document workflows are **explicitly postponed**.
- Documentation should honestly state that this is not yet a full-blown legal infrastructure, but an operational MVP.

### Gig Lifecycle Rules

- `OPEN → IN_PROGRESS` – only when the Client accepts an application.
- `IN_PROGRESS → REVIEW` – only the assigned Specialist can submit work.
- `REVIEW → COMPLETED` – only the gig owner (Client) can approve.
- `COMPLETED → PAID` – only the gig owner can mark the gig as paid (logical flag, not a real transaction).
- Admin can **close** a gig at any time in case of violations.

### Application Constraints

- One application per Specialist per gig (enforced by a unique constraint).
- Applications only on `OPEN` gigs – not allowed for `IN_PROGRESS/REVIEW/COMPLETED/PAID` or admin-closed gigs.
- When one application is accepted, all others are automatically marked as `REJECTED`.

## Success Metrics (MVP Focus)

### Primary MVP Validation Metrics

1. **Organic Retention (KEY CONFIDENCE METRIC)**
   - % of clients who post a 2nd gig without sales nudging
   - Target: >30% within 3 months
   - This is the ultimate validation: if clients return organically, the operational value is proven

2. **Core Loop Completion Rate**
   - % of posted gigs that reach COMPLETED status
   - Target: >60%
   - Tracks end-to-end process health

3. **Time-to-Hire**
   - Days from gig posted to application accepted
   - Target: <7 days
   - Validates "fast" value proposition

4. **Application Quality**
   - Applications per gig (average)
   - Target: 3-5 applications per gig
   - Proves specialist interest and targeting quality

### Critical Failure Modes to Track

5. **"Ghosting"**
   - Specialist vanishes after application accepted
   - Track: % of IN_PROGRESS gigs abandoned by specialist
   - Target: <5%
   - Mitigation: Reputation system (post-MVP)

6. **"Empty Bar"**
   - Client posts gig, receives 0 applications
   - Track: % of gigs with 0 applications after 7 days
   - Target: <15%
   - Indicates targeting/positioning issues

### Secondary Metrics

7. **Dispute Rate**
   - % of gigs requiring admin intervention
   - Target: <10%

8. **Average Gig Value**
   - Mean budget in RUB
   - Target: 150k-200k RUB
   - Validates "high-end" positioning

## Constraints & Non-Goals

### What Gigly IS (MVP Scope)

✅ B2B marketplace for Middle+/Senior specialists
✅ Operational tool for managing outsourced work
✅ Russian market focused (RUB, local context)
✅ Quality-oriented (curated over volume)
✅ Transparent pricing (budget + 10% fee)
✅ Status-driven workflow with clear lifecycle
✅ **Simple in-platform communication** (Gig Chat/Context Comments to prevent platform leakage)

### What Gigly is NOT (Explicit Non-Goals)

❌ Not a job board (no permanent positions)
❌ Not B2C (legal entities only)
❌ Not global (Russian market only)
❌ Not a volume marketplace (quality over quantity)
❌ Not for juniors (Middle+/Senior only)
❌ Not a bidding platform (fixed-price gigs)
❌ Not a payment processor **in MVP** (logical status tracking)
❌ Not a LegalTech platform **in MVP** (legal infrastructure is post-MVP)
❌ Not a full-service agency (platform facilitates, doesn't manage)
❌ Not a freelancer community (no forums/social features)
❌ **Not a native mobile app** (responsive web only for MVP)

### Scope Boundaries

**✅ MUST HAVE in MVP:**
- **Simple Gig Chat / Context Comments** (CRITICAL: prevents Telegram leakage, maintains dispute context)
- Basic text-based profiles (no over-engineering)
- Core gig lifecycle (OPEN → PAID)
- Admin moderation tools

**⏸️ DEFERRED to Post-MVP (but NOT abandoned):**
- Real payment gateway integration (escrow is logical for now)
- Legal entity verification (INN/KPP API validation)
- Contract generation and e-signatures
- Invoice generation for accounting
- Multi-milestone gigs
- Portfolio showcases and certifications
- Rating/review system
- Advanced search and recommendations
- Rich messaging features (file uploads, notifications)
- Email notification system

**Scope Creep Risks:**
- ⚠️ **Over-engineering User Profiles** (GitHub integrations, complex portfolios) - Keep text-based and simple
- ⚠️ **Feature bloat in messaging** (read receipts, typing indicators, etc.) - Keep minimal
- ⚠️ **Premature payment integration** - Resist pressure to add real payments before validating core loop

### MVP Philosophy on Deferred Features

> "Deferred features are NOT abandoned - they are strategic post-MVP goals once core value is proven. We prioritize operational validation over infrastructure perfection."

## Market Context

### Russian IT Freelance Market (2026)

**Market Characteristics:**
- Large pool of strong Middle+/Senior developers (legacy of strong technical education)
- Salary ceilings in comfortable corporate roles (especially post-2022 economic shifts)
- Growing demand for project-based work as companies optimize costs
- Trust deficit in freelance relationships (payment delays, quality disputes)
- Preference for personal networks and recommendations over platforms
- **Cultural resistance to "useless middlemen"** - platforms must prove operational value, not just take fees

### Competitive Landscape

1. **Upwork** (Global)
   - Positioning: We're local, RUB-native, simpler for Russian companies

2. **FL.ru** (Russian, Volume-Oriented)
   - Positioning: We're quality-focused (Middle+/Senior only), cleaner process

3. **Habr Freelance** (Russian, Tech-Focused)
   - Positioning: We're more structured (clear lifecycle), broader tech stack

4. **Kwork** (Russian, Micro-Tasks)
   - Positioning: We're for substantial projects (150k+ RUB), not micro-tasks

5. **Toptal** (Global, Premium)
   - Reference model: "Russian Toptal Lite" in market positioning
   - We're less exclusive/expensive, more accessible for Russian mid-market
   - Focus on operational efficiency over elite curation

6. **Direct Hiring / Personal Networks**
   - Positioning: We're the "network effect" platform - discover beyond personal circles

### Gigly's Market Positioning

> "A productivity tool that removes friction from outsourcing, not just a middleman taking fees. We help companies get work done faster and specialists earn more - the 10% fee is for operational value, not gatekeeping."

### Market Size & MVP Targets

**Realistic MVP Targets (First 6 Months):**
- **Active Clients:** 10-20 companies posting gigs regularly
- **Vetted Specialists:** 50-100 strong Middle+/Senior specialists
- **Monthly Gig Volume:** 20-40 gigs posted
- **Platform Revenue:** ~150k-300k RUB/month (at 10% fee on 150k avg gigs)

**Post-MVP Scaling Targets (12-18 Months):**
- Active Clients: 100-200 companies
- Specialist Pool: 500-1,000 specialists
- Monthly Gig Volume: 200-400 gigs

**Total Addressable Market:**
- Russian IT companies (10-100 employees): ~5,000-10,000 companies
- Middle+/Senior specialists open to gigs: ~50,000-100,000 people





## Core Entities

Users & Roles
Client (Legal Entity):

Profile: Company Name, INN/KPP.
Action: Posts Gigs, Pays total (Budget + Fee).

Specialist (Freelancer):
Profile: Tech Stack, Experience Level (Middle/Senior).
Action: Browses Gigs, Applies, Gets paid the listed Budget.

Admin:
Action: Moderation, Dispute resolution.

The Gig (Order)
The central unit of work.

Fields:
title: Short summary.
description: Detailed scope.
budget: The amount the Specialist receives. (e.g., 100,000 ₽)
serviceFee: The amount Gigly earns. (Calculated based on budget, e.g., 10%)
totalAmount: The amount Client pays. (Budget + Fee)
status: OPEN -> IN_PROGRESS -> REVIEW -> COMPLETED -> PAID.
tags: Stack requirements (e.g., "React", "Python").

The Application
Links a Specialist to a Gig.

Fields:
status: PENDING -> ACCEPTED | REJECTED.
coverLetter: Optional free-text message.
Constraints: One application per specialist per gig. Only SPECIALIST role can apply. Only on OPEN gigs.

## Stack

- Language: TypeScript
- Framework: Next.js 15+ (App Router)
- Database: Prisma with SQLite
- Styling: Tailwind CSS
- Package manager: npm
- Auth: bcryptjs (password hashing), jose (JWT signing/verification)
- Sessions: JWT stored in HTTP-only cookies (`lib/session.ts`)
- Rate Limiting: In-memory sliding window (Map-based, single-instance)

## Conventions

- Code style: TypeScript strict mode, ESLint
- Testing: Vitest for unit/integration tests, Playwright for E2E tests (see `TESTING.md`)
- CI: TBD
- Authentication: Server Actions for auth operations (login, register, logout)
- Sessions: JWT via `jose`, managed in `lib/session.ts`, stored in HTTP-only cookies
- Route protection: Next.js middleware (`middleware.ts`)
- File structure: Next.js App Router conventions

### Prisma Query Conventions

- Use `include` for relations when you need the full related object
- Use `select` when you need specific fields only
- **NEVER mix `select` and `include` at the same nesting level** (will throw `PrismaClientValidationError`)
- Prefer `include` for simplicity unless performance requires field selection
- For conditional includes based on authorization, use `false` for the negative case (not `undefined`)

## Architecture

- App Router with server components by default
- Server Actions for mutations
- Prisma for database access
- SQLite for local development
- Middleware for auth route guards (protect `/dashboard`, `/admin`, redirect logged-in users from `/login` and `/register`)
- Passwords hashed with bcryptjs before storage
- `SESSION_SECRET` env var required for JWT signing
- Role included in JWT session payload (userId, email, role)
- Role is immutable after registration; ADMIN only assignable via DB
- Admin routes protected by middleware (requires ADMIN role)
- **CSRF Protection**: Next.js 15 provides built-in CSRF protection for Server Actions via Origin header matching. Next.js compares the `Origin` header to the `Host` header on all Server Action requests and rejects mismatches with 403 Forbidden. No CSRF tokens are used (Origin-based protection only). No custom implementation needed. Protection is enabled by default. Configuration risk: `serverActions.allowedOrigins` in `next.config.ts` should be avoided unless absolutely necessary (wildcards and untrusted domains weaken protection). Verification: E2E tests in `__tests__/e2e/csrf-protection.spec.ts` verify CSRF protection remains active.

## Completed Changes

1. **project-initialization** — Next.js 15+ with App Router, Prisma + SQLite, Tailwind CSS, User model, registration page with Server Action.
2. **homepage-and-registration-flow** — Landing page linking to `/register`, registration feedback (error/success), password hashing with bcryptjs.
3. **user-login-and-sessions** — Login page at `/login`, JWT sessions via `jose` in HTTP-only cookies, logout action, auto-login after registration, middleware route protection.
4. **role-selection-and-dashboards** — Role selector on registration (CLIENT / SPECIALIST), role persisted in session, role-based dashboards with placeholder CTAs.
5. **gig-creation** — Gig model (title, description, budget, serviceFee, totalAmount, status, tags), `createGig` server action, gig creation form at `/dashboard/gigs/new` (CLIENT only), client dashboard lists own gigs. Service fee: 20% of budget.
6. **specialist-gig-browsing** — Application model, gig browsing at `/dashboard/gigs` (OPEN gigs), gig detail at `/dashboard/gigs/[id]` with apply form (SPECIALIST only), specialist dashboard lists their applications, client dashboard shows application count per gig.
7. **application-management** — `acceptApplication` and `rejectApplication` server actions (CLIENT only), `assignedSpecialistId` on Gig, gig transitions OPEN → IN_PROGRESS on accept, auto-reject remaining PENDING applications, Accept/Reject buttons on gig detail for gig owner.
8. **client-gig-detail-link** — Client dashboard "My Gigs" list items are now clickable links to gig detail pages (`/dashboard/gigs/[id]`), enabling clients to navigate from their dashboard to manage applications.
9. **gig-work-submission-and-approval** — `submitWork` server action (SPECIALIST only, assigned specialist), `approveWork` server action (CLIENT only, gig owner), gig lifecycle transitions IN_PROGRESS → REVIEW → COMPLETED, Submit Work and Approve Work UI forms on gig detail pages.
10. **specialist-profiles** — ClientProfile and SpecialistProfile models with 1:1 relations to User, profile view/edit/public pages at `/dashboard/profile`, `updateProfile` server action with role-based validation, profile completion hints on dashboard, client company names on gig details, specialist profiles (tech stack, experience level) displayed in applications list.
11. **payment-tracking-simplified** — `paidAt` field on Gig model, `markAsPaid` server action (CLIENT only, gig owner), gig lifecycle transition COMPLETED → PAID, payment status display on gig detail and dashboards, "Mark as Paid" button for CLIENT owners on COMPLETED gigs. Simplified implementation without actual payment gateway integration.
12. **gig-filtering-and-search** — Filter panel component at `/dashboard/gigs` with text search (title/description), multi-tag filtering (React, Python, TypeScript, Node.js, Go, Rust, Docker, Kubernetes), budget range filtering (min/max in roubles), sort options (newest, highest budget, lowest budget), URL-based filter state for shareable/bookmarkable views, AND logic between filter types with OR logic within each type.
13. **admin-role-and-moderation** — ADMIN role implementation with full moderation capabilities. User.suspended field prevents login, Gig.closedByAdmin prevents applications, ModerationLog model tracks all moderation actions. Admin dashboard at `/admin` with statistics, user management page with suspend/unsuspend actions, gig management page with close action. Middleware protects admin routes. All moderation actions use transactions and create audit logs.
14. **messaging-iteration-1** — Message model for gig-scoped messaging between clients and assigned specialists. Database schema with Message table, relations to Gig and User (sender), foreign key constraints, and indexes on gigId and createdAt. Data layer only - no UI or server actions yet. Messages can be created and tested via Prisma Studio.
15. **messaging-iteration-3** — Complete message sending functionality with `sendMessage` server action, message form UI component, and validation. Content validation (required, max 2000 characters), authorization (only gig owner or assigned specialist), gig state checks (must have assigned specialist, not closed). Redirect on success to refresh message list. MessageForm component with maxLength attribute and error display. Messages displayed below gig details for authorized users.
16. **messaging-iteration-4** — Enhanced messaging UX with visual distinction between senders and edge case handling. Client messages left-aligned with blue accent, specialist messages right-aligned with green accent. Shows informational message when no specialist assigned ("Messaging will be available once a specialist is assigned to this gig"). Hides message form on closed gigs with appropriate notice. Messaging available across all gig statuses (IN_PROGRESS, REVIEW, COMPLETED, PAID) where specialist is assigned. Backend whitespace validation enforced.
17. **bug-fix-1** — Fixed PrismaClientValidationError in gig detail page caused by mixing `select` and `include` at the same nesting level. Refactored `prisma.gig.findUnique()` query in `/dashboard/gigs/[id]/page.tsx` to use `include` consistently throughout nested relations. Added Prisma query conventions to project documentation to prevent similar issues.
18. **requirements-iteration-2** — Added three optional structured requirement fields to help clients articulate requirements: goal (desired outcome), deliverables (specific outputs), and constraints (technical preferences/timeline). Fields added to Gig model with empty string defaults. Gig creation form includes "Additional Details (Optional)" section with helpful placeholders and examples. Gig detail page displays "Additional Requirements" section when fields are filled, positioned prominently for specialist visibility. All fields are optional, backward compatible (existing gigs display gracefully), and designed to guide non-technical clients without feeling like homework.
19. **structured-application-fields** — Replaced generic "Cover Letter" field with three structured fields: Technical Approach (required, 100-2000 chars), Clarifying Questions (required, 50-1000 chars), and Estimated Effort (optional, max 200 chars). Application model updated with `approach`, `questions`, `estimatedEffort` fields (all with @default("")). `applyToGig` server action validates structured fields with clear error messages. Application form redesigned with engineering-focused prompts, real-time character counters, and visual indicators for required/optional fields. Application display conditionally renders structured fields (with emoji icons 🔧 ❓ ⏱️) for new applications or cover letter for legacy applications. Backward compatible with existing applications. Aligns with SPECIALIST persona preference for substance over sales pitches.
20. **link-examples-from-gig-form** — Added discoverable link to example gigs in the "Requirements & Success Criteria" section header of the gig creation form. Link text "💡 View example gigs for inspiration" opens /dashboard/gigs in new tab (preserves form state). Section header uses flex layout with heading on left and link on right. Link styled with secondary indigo colors (text-sm text-indigo-600 hover:text-indigo-800 underline) to be visible but not intrusive. Opens in new tab (target="_blank") with security attributes (rel="noopener noreferrer"). Fully accessible via keyboard and screen readers. Helps users creating their first gig understand what good requirements look like by providing easy access to example gigs (from iteration 15.4) at the point of need.
21. **testing-framework-setup** — Comprehensive testing infrastructure with Vitest (unit/integration tests) and Playwright (E2E tests). Test database isolation using separate `test.db` file with automated reset. Test scripts: `npm test` (watch mode), `npm run test:unit`, `npm run test:e2e`, `npm run test:coverage`. Example tests demonstrating each layer: currency utilities (unit), user registration (integration), basic navigation (E2E). Coverage reporting via v8 with HTML reports. Complete testing documentation in `TESTING.md`. All configuration files: `vitest.config.ts`, `playwright.config.ts`, `.env.test`. Framework ready for writing tests for existing and new features.
22. **gig-creation-tests** — Comprehensive integration test suite for gig creation functionality (`__tests__/integration/gig-creation.test.ts`, 40 tests). Validates all required fields (title, description, acceptance criteria ≥50 chars, budget), budget conversion (roubles → kopecks), service fee calculation (10% as per documentation standard), structured requirement fields (goal, deliverables, constraints - all optional), tags storage with whitespace handling, role authorization (CLIENT only), gig ownership, and comprehensive whitespace trimming. Tests cover 31 spec scenarios plus 9 additional edge cases (129% coverage). All tests passing, follows TESTING.md patterns, uses test helpers (withAuthContext, withTestTransaction).
23. **payment-tracking-tests** — Comprehensive test coverage for payment tracking functionality, filling critical gaps in existing test suite. Added 6 new tests to `gig-lifecycle.test.ts`: SPECIALIST role validation, idempotency (already PAID), gig not found error, unauthenticated redirect, complete status validation (OPEN, IN_PROGRESS). Created new `payment-display.test.ts` with 6 tests: paidAt field inclusion, COMPLETED/PAID status display logic, Russian locale date formatting, null safety. Achieved 100% spec scenario coverage (18 total scenarios) for `markAsPaid` action and payment status display. All 12 new tests passing. Uses in-memory SQLite with per-worker isolation, follows established patterns (getTestPrismaClient, withAuthContext, cleanup). Coverage increased from ~40-50% to 100% of payment tracking spec scenarios.
24. **service-fee-fix** — Fixed critical service fee discrepancy where code implemented 20% fee but documentation stated 10%, resulting in client overcharging. Updated service fee calculation from 20% to 10% across entire codebase: server-side calculation (`app/actions/gig.ts`), client-side preview (`app/dashboard/gigs/new/gig-form.tsx`), seed data for all 5 example gigs (`prisma/seed.ts`), specifications (`openspec/specs/gig/spec.md`), integration tests (43 tests), E2E tests (26 tests), and UI text. All monetary calculations now consistent with documented 10% fee. For 100,000 ₽ gig: fee reduced from 20,000 ₽ to 10,000 ₽, total from 120,000 ₽ to 110,000 ₽. Comprehensive verification confirms zero remaining 20% references in active code. All 376 tests passing.
25. **rate-limiting** — Rate limiting on critical server actions (login, registration, application submission, message sending) using @upstash/ratelimit with Upstash Redis for persistent, serverless-compatible storage. Prevents brute force attacks, spam applications, message flooding, and bot account creation. Thresholds: login (15 attempts/15min, IP-based), registration (3 attempts/hour, IP-based), applications (10/hour, user-based), messages (30/hour, user-based). Login threshold accommodates offices with shared NAT IPs while protecting against brute force. Clear error messages with retry-after information in human-readable format (minutes/seconds). Rate limit checks happen before validation to prevent resource exhaustion. Comprehensive test coverage (14 integration tests) with global mocking in test infrastructure to prevent real Redis calls during testing. All tests passing (472/473 total). Environment variables documented in `.env.example`. Production-ready implementation awaiting manual testing with actual Upstash credentials.
26. **password-requirements** — Password strength validation enforcing Latin-only characters, minimum 8 characters, uppercase, lowercase, and number requirements. Prevents weak passwords like '123456' and rejects Unicode/Cyrillic characters during registration. Clear error messages guide users to create secure passwords. Backward compatible - existing users with weak passwords can still login. Comprehensive test coverage with unit and integration tests (14 unit tests, 7 registration integration tests, 1 backward compatibility test). Character whitelist validation happens first to reject invalid characters before other checks. Maximum 72 character limit prevents bcrypt DoS attacks. Validation order: character whitelist → max length → min length → uppercase → lowercase → number. All 493 tests passing.
27. **pagination-gig-browsing** — Offset-based pagination on gig browse page with 25 gigs per page, page number navigation, filter integration, and URL-based state management for bookmarkability. Implements parallel Prisma queries (findMany with skip/take + count) for efficient data fetching. PaginationControls client component uses useSearchParams() and usePathname() hooks (wrapped in Suspense boundary per Next.js 15 best practices). Pagination controls display Previous/Next buttons, page numbers with ellipsis logic (current ± 2 pages), and results count ("Showing X-Y of Z gigs"). Invalid page numbers redirect to valid pages. Filters reset pagination to page 1. URL structure: `/dashboard/gigs?page=2` with filter params preserved. Comprehensive test coverage: 7 integration tests for pagination logic, 8 E2E tests for user flows (navigation, filters, browser back/forward). Performance improvement: 75-95% reduction in query time for large datasets.
28. **pagination-admin-pages** — Offset-based pagination on admin user management and gig management pages with 30 items per page, page number navigation, filter integration, and URL-based state management. Reuses existing PaginationControls component for consistency. Implements parallel Prisma queries (findMany with skip/take + count) for efficient data fetching on both `/admin/users` and `/admin/gigs`. Pagination controls display Previous/Next buttons, page numbers, and results count ("Showing X-Y of Z users/gigs"). Invalid page numbers redirect to valid pages. Filter changes (role, status, closed) reset pagination to page 1 by removing page parameter from URL. URL structure: `/admin/users?role=CLIENT&page=2` and `/admin/gigs?status=OPEN&page=2`. Comprehensive test coverage: 16 integration tests (8 per page) for pagination logic with filters. Performance improvement: 70-90% reduction in query time for large datasets (100+ records).
29. **replace-upstash-with-local-ratelimit** — Replaced Upstash Redis rate limiting with in-memory Map-based implementation using sliding window algorithm. Removed external dependencies (@upstash/ratelimit, @upstash/redis) and environment variables (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN). Maintains exact same rate limits (login: 15/15min, register: 3/1hr, applications: 10/1hr, messages: 30/1hr) and interface compatibility. Zero-dependency solution suitable for MVP single-instance deployment. Trade-offs: state lost on restart, not distributed across instances. All 521 tests passing.

## Current State

The core marketplace loop is functional: Clients register, create gigs, review applications, accept a specialist, and approve completed work. Specialists register, browse open gigs with filtering and search capabilities, apply with structured technical proposals, and submit work for review. The full gig lifecycle (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID) is now implemented. Users can create and manage profiles with role-specific information (company details for clients, tech stack and experience for specialists). Clients can mark completed gigs as paid to track payment status. Specialists can efficiently find relevant gigs using text search, tag filters, budget range filters, and sorting options. Admins can moderate the platform by suspending users, closing gigs, and viewing audit logs. Gig-scoped messaging is fully functional with visual distinction between client and specialist messages, edge case handling, and availability across all gig statuses where a specialist is assigned. Gig creation includes optional structured requirement fields (goal, deliverables, constraints) to help clients articulate clear requirements, with a discoverable link to example gigs in the section header for inspiration. Application submissions now use structured fields (technical approach, clarifying questions, estimated effort) that emphasize engineering competence over sales pitches, aligning with the SPECIALIST persona's preference for concrete technical discussions. Critical server actions are protected by rate limiting to prevent brute force attacks, spam applications, message flooding, and bot account creation.

### Implemented

- User registration with role selection (CLIENT / SPECIALIST)
- Login / logout with JWT sessions
- Role-based dashboards with profile completion hints
- User profiles (ClientProfile and SpecialistProfile tables)
- Profile view, edit, and public profile pages
- Gig creation (CLIENT) with budget + 20% fee calculation
- Gig creation with optional structured requirement fields (goal, deliverables, constraints)
- Gig creation form includes link to example gigs in section header for inspiration (opens in new tab, preserves form state)
- Gig browsing and application (SPECIALIST)
- Gig filtering and search: text search, multi-tag filtering, budget range, sorting
- Application submission with structured fields: technical approach (100-2000 chars), clarifying questions (50-1000 chars), estimated effort (optional, max 200 chars)
- Application display with conditional rendering: structured fields for new applications, cover letter for legacy applications
- Application management: accept / reject (CLIENT)
- Gig lifecycle: OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID
- Work submission (SPECIALIST) and approval (CLIENT)
- Payment tracking: mark as paid (CLIENT), payment status display
- Client company names displayed on gig details
- Specialist profiles (tech stack, experience level) displayed in applications
- Structured requirement fields displayed on gig detail page when filled
- Structured application fields displayed with visual hierarchy (emoji icons, prominent technical content)
- Admin role and moderation: suspend/unsuspend users, close gigs, audit logging
- Admin dashboard with platform statistics
- User and gig management pages with filtering and pagination (30 items per page)
- Gig-scoped messaging: send/view messages between client and assigned specialist with validation
- Enhanced messaging UX: visual distinction (client left/blue, specialist right/green), edge case handling (no specialist, closed gigs), cross-status availability
- Pagination on gig browsing page (25 gigs per page, offset-based)

### Not Yet Implemented

- Actual payment gateway integration (Stripe, PayPal, etc.)
- Escrow account management
- Specialist notifications (email, in-app)
- Gig editing or deletion
- Password reset / email verification
- OAuth / social login
