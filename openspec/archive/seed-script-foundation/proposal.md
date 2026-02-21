# Proposal: Seed Script Foundation

## Problem Statement

The development database currently has minimal seed data (1 CLIENT user and 5 example gigs). This makes it difficult to:
- Test multi-user scenarios (client-specialist interactions, admin moderation)
- Develop features that require diverse user profiles
- Demonstrate the platform with realistic Russian market data
- Quickly reset to a known state during development

Developers need a comprehensive seed script that populates the database with realistic foundation users representing all roles and use cases.

## Proposed Solution

Enhance the existing `prisma/seed.ts` script to create a complete foundation dataset:

**Foundation Users:**
- 2 CLIENT users with company profiles (realistic Russian companies)
- 3 SPECIALIST users with profiles and tech stacks (Middle/Senior levels)
- 1 ADMIN user for moderation testing

**Key Features:**
- Use consistent test password ("TestPass123") for easy login
- Pre-computed bcrypt hash for performance (no dynamic hashing)
- Realistic Russian names, companies, and tech stacks
- Log all created users with credentials for reference
- Maintain existing example gigs with updated clientId references
- Idempotent via upsert (no destructive clearing)

## Constraints

- MUST use existing `prisma/seed.ts` file (extend, not replace)
- MUST preserve existing example gigs (they are valuable for testing)
- MUST use pre-computed bcrypt hash for "TestPass123" (performance optimization)
- MUST use realistic Russian market data (names, companies, tech stacks)
- MUST be idempotent via upsert (can run multiple times without errors)
- MUST NOT clear existing data (preserve developer's test data)
- MUST log created users in a clear, copy-pasteable format

## Non-Goals

- Creating gigs for the new users (existing 5 example gigs are sufficient)
- Creating applications or messages (these should be created manually during testing)
- Implementing seed data variations or randomization
- Creating a separate seed command (use existing `npx prisma db seed`)

## Success Criteria

- Run `npm run seed` (or `npx prisma db seed`) successfully
- Database contains at least 6 foundation users (2 CLIENT, 3 SPECIALIST, 1 ADMIN)
- All CLIENTs have complete ClientProfile records
- All SPECIALISTs have complete SpecialistProfile records
- All users can login with password "TestPass123"
- Console output shows all created users with emails and roles
- Running seed multiple times produces consistent results (idempotent)
- Example gigs are created/updated with correct clientId references
- Existing test data (applications, messages) is preserved
