# Change Proposal: Project Initialization

## Why
Bootstrap the Gigly project with a modern web stack and basic user authentication capabilities. This establishes the foundation for all future features.

## What
Set up Next.js 15+ with App Router, Prisma ORM with SQLite database, Tailwind CSS for styling, and implement basic user registration functionality.

## Scope
### In Scope
- Next.js 15+ project initialization with App Router
- Prisma setup with SQLite database
- Tailwind CSS configuration
- User model with authentication fields
- Registration page with form UI
- Server Action for user creation
- Visual verification of registration form

### Out of Scope (Non-Goals)
- Login functionality
- Session management
- Password hashing/encryption
- Email verification
- OAuth providers
- User profile pages
- Password reset flow
- Authorization/permissions beyond role field

## Constraints
- MUST use Next.js 15 or higher
- MUST use App Router (not Pages Router)
- MUST use SQLite for database
- MUST use Server Actions for form submission
- MUST be visually verifiable via screenshot

## Success Criteria
- Project runs with `npm run dev`
- Database migrations apply successfully
- Registration form renders at /register
- Form submission creates user in database
- Screenshot shows functional registration form
