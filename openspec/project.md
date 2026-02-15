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
- Middleware for auth route guards (protect `/dashboard`, redirect logged-in users from `/login` and `/register`)
- Passwords hashed with bcryptjs before storage
- `SESSION_SECRET` env var required for JWT signing
