# Gigly

A B2B freelance marketplace connecting Russian IT companies with vetted Middle+/Senior specialists. Built to solve the operational pain of outsourcing: get work done fast, earn more as a senior, with clarity upfront.

## About

Gigly is a high-end B2B freelance marketplace designed specifically for the Russian IT market. It connects legal entities (companies) with strong Middle+/Senior specialists who want to monetize their expertise beyond salary ceilings.

**The Problem:** Russian tech companies constantly need to outsource development work, but finding reliable Middle+/Senior specialists takes weeks. Projects fail due to unclear requirements, scope creep, and misaligned expectations. Meanwhile, experienced specialists hit salary ceilings in comfortable roles and want to earn more without burning out.

**The Solution:** Gigly provides a structured gig lifecycle with clear requirements (Definition of Done), structured applications (technical approach + questions), and transparent status tracking from creation to payment. The platform focuses on operational value—helping companies actually get work done and specialists actually earn more—not just being a middleman taking fees.

**Target Market:** Russian IT companies (10-100 employees) and Middle+/Senior specialists (5+ years experience) in the Russian market. All transactions in RUB, focused on local context and culture.

## Screenshots

> **Note:** Screenshots show the actual platform with seed data. All UI is functional and can be tested locally.

### Gig Browsing (Specialist View)
![Gig Browsing](public/screenshots/gig-browsing.png)
*Specialists can browse open gigs with filters for tech stack, budget range, and search*

### Gig Detail with Applications
![Gig Detail](public/screenshots/gig-detail.png)
*Full gig details showing requirements, applications, and messaging*

### Gig Creation Form
![Gig Creation](public/screenshots/gig-creation.png)
*Structured form helping clients define clear requirements and success criteria*

### Client Dashboard
![Client Dashboard](public/screenshots/dashboard-client.png)
*Client view showing posted gigs, applications, and status tracking*

### Specialist Dashboard
![Specialist Dashboard](public/screenshots/dashboard-specialist.png)
*Specialist view with tabs for Active Work, Pending Applications, and Archive*

### Application Form
![Application Form](public/screenshots/application-form.png)
*Structured application with technical approach, questions, and effort estimate*

## Tech Stack

- **Framework:** Next.js 15+ (App Router with Server Components)
- **Language:** TypeScript (strict mode)
- **Database:** Prisma ORM with SQLite (development) / PostgreSQL (production-ready)
- **Styling:** Tailwind CSS
- **Authentication:** JWT sessions with `jose`, password hashing with `bcryptjs`
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **Package Manager:** npm

**Architecture Choices:**
- App Router for modern React patterns and server-first architecture
- Server Components by default for better performance
- Server Actions for mutations (no separate API routes needed)
- SQLite for simple local development, easily swappable to PostgreSQL

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
   # Generate a secure secret (run one of these commands):
   openssl rand -base64 32
   # OR
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Paste the generated secret into `.env`:
   ```
   SESSION_SECRET="your_generated_secret_here"
   ```

4. **Set up the database**
   ```bash
   # Run migrations to create database schema
   npx prisma migrate dev

   # Seed the database with example data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

**Total setup time:** ~10-15 minutes on a fresh machine

## Development

### Running Tests

```bash
# Run all unit and integration tests (watch mode)
npm test

# Run tests once (CI mode)
npm run test:unit

# Run E2E tests with Playwright
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Type checking (Next.js does this automatically during build)
npm run build
```

### Database Management

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# Create a new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Project Structure

```
gigly_open_ralph/
├── app/                    # Next.js App Router pages and layouts
│   ├── (protected)/       # Protected routes (require authentication)
│   ├── actions/           # Server Actions (mutations)
│   ├── admin/             # Admin-only routes
│   └── page.tsx           # Landing page
├── lib/                   # Shared utilities
│   ├── session.ts         # JWT session management
│   ├── prisma.ts          # Prisma client singleton
│   └── ratelimit.ts       # Rate limiting utilities
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Migration history
│   └── seed.ts            # Seed data script
├── __tests__/             # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
└── openspec/              # Product specifications and documentation
```

## Seed Data

The database seed creates test accounts for all user roles. Use these credentials to explore the platform:

### Client Accounts
- **Email:** `ivan.petrov@techcorp.ru`
- **Password:** `TestPass123`
- **Company:** ТехКорп

- **Email:** `maria.sokolova@digitalpro.ru`
- **Password:** `TestPass123`
- **Company:** ДиджиталПро

### Specialist Accounts
- **Email:** `alexey.ivanov@mail.ru`
- **Password:** `TestPass123`
- **Stack:** Frontend/React

- **Email:** `dmitry.volkov@yandex.ru`
- **Password:** `TestPass123`
- **Stack:** Backend/Python

- **Email:** `sergey.morozov@gmail.com`
- **Password:** `TestPass123`
- **Stack:** DevOps/Go

### Admin Account
- **Email:** `admin@gigly.ru`
- **Password:** `TestPass123`

**Seed Data Includes:**
- 5 example gigs (OPEN status) with realistic requirements
- 5 workflow gigs in various states (IN_PROGRESS, REVIEW, COMPLETED, PAID)
- Applications from specialists on open gigs
- Complete user profiles for all accounts
- Messages on in-progress gigs

## Project Status

**Current Status:** MVP (Minimum Viable Product)

### Implemented Features ✅

**Core Gig Lifecycle:**
- Gig creation with structured requirements (Definition of Done, goals, deliverables, constraints)
- Gig browsing with filters (tech stack, budget range, search)
- Structured applications (technical approach, clarifying questions, effort estimate)
- Application management (accept/reject, automatic status transitions)
- Work submission and approval workflow
- Payment tracking (mark as paid, status display)

**User Management:**
- Role-based authentication (CLIENT, SPECIALIST, ADMIN)
- User profiles (company info for clients, tech stack for specialists)
- Profile completion hints on dashboard

**Communication:**
- Gig-scoped messaging between clients and assigned specialists
- Visual distinction between senders
- Message availability across all gig statuses

**Admin Moderation:**
- User suspension/unsuspension
- Gig closure (admin intervention)
- Moderation audit logs
- Platform statistics dashboard

**Quality & Security:**
- Password strength validation (Latin-only, 8+ chars, mixed case, numbers)
- Rate limiting on critical actions (login, registration, applications, messages)
- Comprehensive test coverage (Vitest + Playwright)
- CSRF protection (Next.js 15 built-in)

### Deferred Features ⏸️

These features are planned for post-MVP once core value is validated:

- Real payment gateway integration (Stripe, PayPal, etc.)
- Escrow account management
- Legal entity verification (INN/KPP API validation)
- Contract generation and e-signatures
- Invoice generation for accounting
- Multi-milestone gigs
- Portfolio showcases and certifications
- Rating/review system
- Advanced search and recommendations
- Email notification system
- Rich messaging features (file uploads, read receipts)

**MVP Philosophy:** "We accept reasonable imperfections in legal/financial infrastructure to validate the core operational value proposition quickly. The goal is to prove that companies will use this to get work done and specialists will use this to earn more."

## Documentation

- **Product Context:** See `openspec/project.md` for detailed product vision, user personas, and business rules
- **Testing Guide:** See `TESTING.md` for comprehensive testing documentation
- **Specifications:** See `openspec/specs/` for detailed technical specifications by domain

## Contributing

This is currently a private MVP project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved
