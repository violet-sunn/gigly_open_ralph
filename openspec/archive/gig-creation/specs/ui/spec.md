# UI Specification — Gig Creation Delta

## ADDED Requirements

### Requirement: Gig Creation Form
The system MUST provide a form at `/dashboard/gigs/new` for CLIENT users to create gigs.

#### Scenario: Form renders for CLIENT user
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN the page MUST display a form with:
  - Title input (text, required)
  - Description textarea (required)
  - Budget input (number, required, in roubles)
  - Tags input (text, optional, comma-separated)
  - A live fee preview showing: budget, service fee (20%), and total amount
  - A "Post Gig" submit button

#### Scenario: Live fee calculation preview
- GIVEN a CLIENT user is on the gig creation form
- WHEN they enter a budget value (e.g., 100000)
- THEN the form MUST display in real-time:
  - "Budget: 100,000 ₽"
  - "Service fee (20%): 20,000 ₽"
  - "Total: 120,000 ₽"

#### Scenario: Form shows loading state
- GIVEN a CLIENT user submits the gig form
- WHEN the server action is processing
- THEN the submit button MUST show "Posting..." text
- AND the button MUST be disabled

#### Scenario: Form shows error
- GIVEN a CLIENT user submits invalid data
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline on the form

#### Scenario: Non-CLIENT user visits gig creation page
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN they MUST be redirected to `/dashboard`

#### Scenario: Unauthenticated user visits gig creation page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs/new`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/new/page.tsx` exists
- Uses `useActionState` with `createGig` action
- Uses `useFormStatus` for pending state on submit button
- Budget input accepts roubles, displays fee breakdown in real-time
- Displays `state?.error` when present

---

## MODIFIED Requirements

### Requirement: Role-Based Dashboard (Client view update)
The Client Dashboard MUST link to the gig creation form and display the user's gigs.

#### Scenario: Client dashboard shows "Post a Gig" link
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the "Post a Gig" button MUST be an active link to `/dashboard/gigs/new` (no longer disabled)

#### Scenario: Client dashboard lists user's gigs
- GIVEN a CLIENT user has created gigs
- WHEN they visit `/dashboard`
- THEN the "My Gigs" section MUST list each gig with title, budget (formatted in ₽), status, and creation date
- AND if no gigs exist, it MUST show "No gigs posted yet."

**Acceptance Criteria:**
- `app/dashboard/page.tsx` queries gigs for the current user via Prisma
- "Post a Gig" is a `<Link>` to `/dashboard/gigs/new`
- Gigs are listed with title, formatted budget, status badge, and date
