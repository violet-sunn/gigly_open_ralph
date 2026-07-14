# Gigly

A B2B freelance marketplace connecting Russian IT companies with vetted Middle+/Senior specialists. Built to solve the operational pain of outsourcing: get work done fast, earn more as a senior, with clarity upfront.

## About

Gigly is a high-end B2B freelance marketplace designed specifically for the Russian IT market. It connects legal entities (companies) with strong Middle+/Senior specialists who want to monetize their expertise beyond salary ceilings.

**The Problem:** Russian tech companies constantly need to outsource development work, but finding reliable Middle+/Senior specialists takes weeks. Projects fail due to unclear requirements, scope creep, and misaligned expectations. Meanwhile, experienced specialists hit salary ceilings in comfortable roles and want to earn more without burning out.

**The Solution:** Gigly provides a structured gig lifecycle with clear requirements (Definition of Done), structured applications (technical approach + questions), transparent status tracking from creation to payment, and lightweight terms negotiation. The platform focuses on operational value—helping companies actually get work done and specialists actually earn more—not just being a middleman taking fees.

**Target Market:** Russian IT companies (10-100 employees) and Middle+/Senior specialists (5+ years experience) in the Russian market. All transactions in RUB, focused on local context and culture.

The UI is built against a single authoritative design (`gigly_full_design/`) — a full Figma handoff transported into React with inline design tokens and self-hosted Cyrillic fonts (Handjet / Manrope), so the app runs without any external font/CDN dependencies.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, Server Components + Server Actions)
- **Language:** TypeScript (strict mode)
- **Database:** Prisma 7 ORM over SQLite, accessed through the `@prisma/adapter-libsql` driver adapter (`lib/prisma.ts`). Schema is applied with `prisma db push` (schema-first; no migration files are used as the source of truth).
- **Styling:** Tailwind CSS + inline design tokens (`app/_design/`), self-hosted fonts via `next/font/local`
- **Authentication:** JWT sessions with `jose` (HTTP-only cookies), password hashing with `bcryptjs`
- **Rate limiting:** in-memory sliding window (`lib/ratelimit.ts`), zero external dependencies
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **Deployment:** Docker image on **Amvera Cloud** (РФ PaaS) with SQLite on a persistent volume — see [`DEPLOY.md`](DEPLOY.md)
- **Package Manager:** npm

**Architecture Choices:**
- App Router with server components by default; Server Actions for mutations (no separate REST API layer)
- View-models in `lib/view-models.ts` assemble server-only data for each screen; UI components stay presentational
- SQLite everywhere (dev, test, prod) via the libsql adapter — simple, single-instance, no external DB service
- CSRF protection via Next.js 15 built-in Origin-header matching (no custom tokens)

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ (comes with Node.js)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gigly_open_ralph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set a secure `SESSION_SECRET`:
   ```bash
   # Generate a secure secret (run one of these):
   openssl rand -base64 32
   # OR
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Paste the generated secret into `.env`:
   ```
   SESSION_SECRET="your_generated_secret_here"
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Set up the database**
   ```bash
   # Apply the Prisma schema to the SQLite database
   npx prisma db push

   # Seed the database with the full development dataset
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Running Tests

```bash
# Unit + integration tests (watch mode)
npm test

# Run once (CI mode)
npm run test:unit

# E2E tests with Playwright (starts its own dev server)
npm run test:e2e

# Coverage report
npm run test:coverage

# Reset the isolated test database if integration tests start failing oddly
npm run clean:test-db
```

See [`TESTING.md`](TESTING.md) for the full testing guide and conventions.

### Code Quality

```bash
# ESLint
npm run lint

# Production build (also type-checks)
npm run build
```

> **Note:** don't run `npm run build` while `npm run dev` is live — they share `.next` and a concurrent build can corrupt it. Stop the dev server first.

### Database Management

```bash
# Visual database editor
npx prisma studio

# Re-apply the schema after editing prisma/schema.prisma
npx prisma db push

# Regenerate the Prisma client after schema changes
npx prisma generate
```

### Project Structure

```
gigly_open_ralph/
├── app/                    # Next.js App Router pages and layouts
│   ├── (protected)/       # Authenticated routes: gigs, my-gigs, dashboard, chats,
│   │                      #   disputes, finances, settings, profile, guide
│   ├── actions/           # Server Actions (gig, dispute, auth, settings, …)
│   ├── admin/             # Admin-only routes (users, gigs moderation)
│   ├── _design/           # Design tokens, fonts, and shared design primitives
│   └── page.tsx           # Landing page
├── lib/                   # Shared server utilities
│   ├── view-models.ts     # Screen view-model assembly (server-only)
│   ├── session.ts         # JWT session management
│   ├── prisma.ts          # Prisma client (SQLite via libsql adapter)
│   └── ratelimit.ts       # In-memory rate limiting
├── prisma/                # Database schema and seeds
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Full development seed
│   └── seed.prod.ts       # Minimal production seed (categories + example gigs + demo owner)
├── gigly_full_design/     # Authoritative design source (Figma handoff: prototype, tokens, JSX sources)
├── __tests__/             # unit / integration / e2e test suites + helpers
├── openspec/              # Product specs & change workflow
│   ├── specs/             # Canonical specifications by domain
│   ├── changes/           # In-flight change proposals
│   ├── archive/           # Completed (implemented) changes
│   └── planning/          # Strategic planning documents
├── Dockerfile, docker-entrypoint.sh, amvera.yaml   # Amvera deploy
└── DEPLOY.md              # Deployment guide
```

## Deployment

Gigly deploys to **Amvera Cloud** (a Russian PaaS) as a Docker container, with SQLite living on a persistent `/data` volume so data survives restarts. The container entrypoint applies the schema (`prisma db push`), seeds once (guarded), and starts the app.

Key env / behaviour:
- `SESSION_SECRET` — required (the entrypoint fails fast without it)
- `SEED_DEMO` — when set, seeds the full demo dataset; otherwise the **minimal production seed** runs (5 categories, an admin, a demo owner, and 5 example gigs)
- `RESET_DB` — one-time DB wipe, guarded by a marker file so it only runs once
- Fonts are self-hosted (no Google Fonts) so the build works from the РФ build cluster

Only the application (code, prisma, public, config) is pushed to the deploy remote — the `openspec/` specs and `gigly_full_design/` sources stay local. Full instructions are in [`DEPLOY.md`](DEPLOY.md).

## Seed Data

`npx prisma db seed` loads the **full development dataset** (rich gigs across every lifecycle state, applications with proposed terms, messages, notifications, disputes, and complete profiles for all roles). Production uses a separate **minimal** seed (`prisma/seed.prod.ts`).

All development accounts share the password **`TestPass123`**:

| Role | Email | Note |
|------|-------|------|
| Client | `ivan.petrov@techcorp.ru` | ТехКорп |
| Client | `maria.sokolova@digitalpro.ru` | ДиджиталПро |
| Specialist | `alexey.ivanov@mail.ru` | Frontend / React |
| Specialist | `dmitry.volkov@yandex.ru` | Backend / Python |
| Specialist | `sergey.morozov@gmail.com` | DevOps / Go |
| Admin | `admin@gigly.ru` | Platform moderation |

## Project Status

**Current Status:** MVP (Minimum Viable Product), actively iterated from live stress-test feedback.

### Implemented Features ✅

**Core Gig Lifecycle:**
- Gig creation with structured requirements (Definition of Done, goals, deliverables, constraints, deadline, stages)
- Gig browsing with filters (tech stack, budget range, search) and pagination
- Structured applications (technical approach, clarifying questions, effort estimate)
- **Terms negotiation:** specialists can propose their own budget/deadline («Мои условия»); the client sees the counter on the applicants screen and accepting adopts it into the gig's effective terms
- Application management (accept/reject with automatic status transitions and auto-reject of the rest)
- **Application withdrawal** with a **one-free-withdrawal-per-gig** rule: the first withdrawal is reversible («Отозвано», re-apply allowed); the second is final (confirmed via dialog, gig stays visible)
- Work submission → approval → mark-as-paid workflow (logical payment status)

**User Management:**
- Role-based authentication (CLIENT, SPECIALIST, ADMIN) with an in-surface onboarding flow
- User profiles (company info for clients; tech stack, experience, work history for specialists)
- Account & notification settings, active-session management

**Communication & Money:**
- Gig-scoped messaging / chat between clients and assigned specialists
- **In-app notifications:** unread badge + dropdown for application, status-change, message, and payment events
- Finances screen (earnings/payment overview)
- **Disputes:** open a dispute on a live gig, moderator resolution flow

**Admin Moderation:**
- User suspension/unsuspension, gig closure, moderation audit logs, platform statistics dashboard

**Quality & Security:**
- Password strength validation (Latin-only, 8+ chars, mixed case, numbers)
- Rate limiting on critical actions (login, registration, applications, messages)
- Comprehensive test coverage (Vitest integration + Playwright E2E)
- CSRF protection (Next.js 15 built-in)

### Deferred Features ⏸️

Planned for post-MVP once core value is validated:

- Real payment gateway integration and escrow (payment is a logical status for now)
- Legal entity verification (INN/KPP API validation)
- Contract generation, e-signatures, and invoicing
- Multi-milestone gigs
- Portfolio showcases and certifications
- Full rating/review system (rating display exists; review submission is not built out)
- Email notifications (in-app notifications are implemented)
- Advanced search and recommendations
- Rich messaging features (file uploads, read receipts)

**MVP Philosophy:** "We accept reasonable imperfections in legal/financial infrastructure to validate the core operational value proposition quickly. The goal is to prove that companies will use this to get work done and specialists will use this to earn more."

## Documentation

- **Product Context:** `openspec/project.md` — product vision, personas, business rules
- **Specifications:** `openspec/specs/` — technical specs by domain; `openspec/archive/` — implemented changes; `openspec/planning/` — planning docs
- **Testing Guide:** `TESTING.md`
- **Deployment:** `DEPLOY.md`

## Contributing

This is currently a private MVP project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved
