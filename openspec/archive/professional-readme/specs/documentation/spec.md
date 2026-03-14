# Documentation Spec Delta

## ADDED Requirements

### Requirement: Project README
The project root MUST contain a comprehensive README.md file that enables new developers to understand and run the project.

#### Scenario: README contains project overview
**Given** a new developer opens the README.md file
**When** they read the "About Gigly" section
**Then** the README MUST explain what Gigly is (B2B freelance marketplace for Russian IT specialists)
**And** the README MUST explain the core value propositions (get work done fast, earn more as a senior, clarity upfront)
**And** the README MUST explain who the target users are (Russian IT companies and Middle+/Senior specialists)
**And** the README MUST be written in English for international developer accessibility

#### Scenario: README contains visual documentation
**Given** a new developer opens the README.md file
**When** they read the "Screenshots" section
**Then** the README MUST include at least 4 screenshots showing:
  - Gig browsing page (specialist view)
  - Gig detail page with applications (client view)
  - Gig creation form
  - Dashboard (either role)
**And** each screenshot MUST show actual platform UI with realistic seed data
**And** screenshots MUST be stored in `/public/screenshots/` directory
**And** screenshots MUST be referenced using relative paths (e.g., `![Gig Browsing](public/screenshots/gig-browsing.png)`)

#### Scenario: README contains setup instructions
**Given** a new developer wants to run the project locally
**When** they follow the "Getting Started" section
**Then** the README MUST include step-by-step instructions:
  1. Prerequisites (Node.js version, npm)
  2. Clone repository command
  3. Install dependencies command (`npm install`)
  4. Environment setup (copy `.env.example` to `.env`, set `SESSION_SECRET`)
  5. Database setup (`npx prisma migrate dev`, `npx prisma db seed`)
  6. Run development server (`npm run dev`)
  7. Access application (http://localhost:3000)
**And** each step MUST be a runnable command or clear action
**And** the instructions MUST result in a working local instance within 15 minutes

#### Scenario: README contains technology stack
**Given** a developer wants to understand the project architecture
**When** they read the "Tech Stack" section
**Then** the README MUST list all major technologies:
  - Framework: Next.js 15+ (App Router)
  - Language: TypeScript
  - Database: Prisma with SQLite
  - Styling: Tailwind CSS
  - Authentication: JWT with jose, bcryptjs
  - Testing: Vitest (unit/integration), Playwright (E2E)
**And** the README MUST include version numbers where relevant
**And** the README MUST explain the architecture choice (App Router, Server Components, Server Actions)

#### Scenario: README contains development workflow
**Given** a developer wants to contribute or modify the project
**When** they read the "Development" section
**Then** the README MUST document:
  - How to run tests (`npm test`, `npm run test:e2e`)
  - How to run linting (`npm run lint`)
  - How to access Prisma Studio (`npx prisma studio`)
  - How to create database migrations
  - Project structure overview (app/, prisma/, lib/, etc.)
**And** the README MUST reference `TESTING.md` for detailed testing documentation

#### Scenario: README contains seed data information
**Given** a developer wants to test the platform with realistic data
**When** they read the setup instructions
**Then** the README MUST explain that seed data is automatically created
**And** the README MUST list the seed user accounts:
  - Client account: email and password
  - Specialist account: email and password
  - Admin account: email and password
**And** the README MUST explain that 5 example gigs are created with applications

#### Scenario: README is concise and scannable
**Given** a developer opens the README.md file
**When** they scan the document
**Then** the README MUST use clear section headings (## for main sections)
**And** the README MUST use bullet points and numbered lists for readability
**And** the README MUST use code blocks for commands and code snippets
**And** the README MUST be no longer than 500 lines (concise, not exhaustive)
**And** the README MUST link to other documentation files for detailed information (TESTING.md, openspec/project.md)

#### Scenario: README contains project status
**Given** a stakeholder wants to understand project maturity
**When** they read the README
**Then** the README MUST include a "Project Status" section
**And** the section MUST clearly state this is an MVP
**And** the section MUST list implemented features (core gig lifecycle, messaging, admin moderation, etc.)
**And** the section MUST list deferred features (payment gateway, legal verification, etc.)
**And** the section MUST reference `openspec/project.md` for detailed product context

**Acceptance Criteria:**
- README.md file created in project root
- All required sections present and complete
- Screenshots directory created with at least 4 images
- Setup instructions tested by running through them on a fresh clone
- All commands in README are valid and work
- README is written in clear, professional English
- README uses proper Markdown formatting
- Links to screenshots and other docs are valid
