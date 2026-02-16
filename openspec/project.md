# Project Context

Gigly is a high-end B2B freelance marketplace for the Russian IT market. It connects legal entities (Clients) with vetted Middle+/Senior specialists.

## Product Vision & Philosophy

Order-First: Clients post tasks (Gigs); Specialists apply to them.
B2B Focus: Clients are legal entities requiring invoices and reliability. Specialists are high-level professionals.
Escrow Model: Gigly acts as the financial guarantor.
Revenue Model (Client-Side Fee):
Transparent to Client: The Client sets a budget for the work and pays a separate platform fee on top.
Net for Specialist: The Specialist sees the full budget amount as their reward. No hidden deductions from their pay.

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
serviceFee: The amount Gigly earns. (Calculated based on budget, e.g., 20%)
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

## Conventions

- Code style: TypeScript strict mode, ESLint
- Testing: Integration test scripts in `scripts/` (run via `npx tsx`), unit tests as needed
- CI: TBD
- Authentication: Server Actions for auth operations (login, register, logout)
- Sessions: JWT via `jose`, managed in `lib/session.ts`, stored in HTTP-only cookies
- Route protection: Next.js middleware (`middleware.ts`)
- File structure: Next.js App Router conventions

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

## Current State

The core marketplace loop is functional: Clients register, create gigs, review applications, accept a specialist, and approve completed work. Specialists register, browse open gigs with filtering and search capabilities, apply, and submit work for review. The full gig lifecycle (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID) is now implemented. Users can create and manage profiles with role-specific information (company details for clients, tech stack and experience for specialists). Clients can mark completed gigs as paid to track payment status. Specialists can efficiently find relevant gigs using text search, tag filters, budget range filters, and sorting options. Admins can moderate the platform by suspending users, closing gigs, and viewing audit logs.

### Implemented

- User registration with role selection (CLIENT / SPECIALIST)
- Login / logout with JWT sessions
- Role-based dashboards with profile completion hints
- User profiles (ClientProfile and SpecialistProfile tables)
- Profile view, edit, and public profile pages
- Gig creation (CLIENT) with budget + 20% fee calculation
- Gig browsing and application (SPECIALIST)
- Gig filtering and search: text search, multi-tag filtering, budget range, sorting
- Application management: accept / reject (CLIENT)
- Gig lifecycle: OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID
- Work submission (SPECIALIST) and approval (CLIENT)
- Payment tracking: mark as paid (CLIENT), payment status display
- Client company names displayed on gig details
- Specialist profiles (tech stack, experience level) displayed in applications
- Admin role and moderation: suspend/unsuspend users, close gigs, audit logging
- Admin dashboard with platform statistics
- User and gig management pages with filtering

### Not Yet Implemented

- Actual payment gateway integration (Stripe, PayPal, etc.)
- Escrow account management
- Specialist notifications (email, in-app)
- Pagination on gig browsing
- Gig editing or deletion
- Password reset / email verification
- OAuth / social login
- Messaging between client and specialist
