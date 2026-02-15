# UI Specification — Specialist Gig Browsing Delta

## ADDED Requirements

### Requirement: Gig Browse Page
The system MUST provide a page at `/dashboard/gigs` listing all OPEN gigs for browsing.

#### Scenario: Specialist browses gigs
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs`
- THEN the page MUST display a list of all gigs with status "OPEN"
- AND each gig MUST show: title, budget (formatted in ₽), tags, and creation date
- AND each gig MUST link to `/dashboard/gigs/[id]`

#### Scenario: No open gigs available
- GIVEN no gigs with status "OPEN" exist
- WHEN a SPECIALIST visits `/dashboard/gigs`
- THEN the page MUST display "No open gigs available."

#### Scenario: CLIENT visits browse page
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs`
- THEN the page MUST also display the gig list (read-only, no apply action)

#### Scenario: Unauthenticated user visits browse page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/page.tsx` exists as a server component
- Queries `prisma.gig.findMany({ where: { status: 'OPEN' } })`
- Each gig links to its detail page
- Accessible to both CLIENT and SPECIALIST roles

---

### Requirement: Gig Detail Page
The system MUST provide a page at `/dashboard/gigs/[id]` showing full gig details.

#### Scenario: Specialist views gig detail
- GIVEN an authenticated SPECIALIST user
- WHEN they navigate to `/dashboard/gigs/[id]` for an existing gig
- THEN the page MUST display: title, description, budget (₽), tags, status, and client email
- AND it MUST display an "Apply" form with a cover letter textarea and submit button
- AND if the specialist has already applied, the form MUST be replaced with "You have already applied" message

#### Scenario: CLIENT views gig detail
- GIVEN an authenticated CLIENT user
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display the gig details
- AND it MUST NOT show the apply form
- AND if the CLIENT owns the gig, it MUST show the list of applications with specialist email, cover letter, status, and date

#### Scenario: Gig not found
- GIVEN a non-existent gig ID
- WHEN a user navigates to `/dashboard/gigs/[id]`
- THEN the page MUST show a "Gig not found" message with a link back to `/dashboard`

#### Scenario: Apply form shows loading state
- GIVEN a SPECIALIST submits the apply form
- WHEN the server action is processing
- THEN the submit button MUST show "Applying..." text
- AND the button MUST be disabled

#### Scenario: Apply form shows error
- GIVEN a SPECIALIST submits and the server action returns an error
- WHEN the error is returned
- THEN the error message MUST be displayed inline on the form

**Acceptance Criteria:**
- `app/dashboard/gigs/[id]/page.tsx` exists as a server component
- Queries gig by ID with `include: { client: true, applications: true }`
- SPECIALIST sees apply form (or "already applied" message)
- CLIENT who owns the gig sees applications list
- Uses `useActionState` with `applyToGig` action in a client component
- Uses `useFormStatus` for pending state

---

## MODIFIED Requirements

### Requirement: Role-Based Dashboard (Specialist view update)
The Specialist Dashboard MUST link to the gig browse page and list their applications.

#### Scenario: Specialist dashboard shows "Browse Gigs" link
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the "Browse Gigs" button MUST be an active link to `/dashboard/gigs` (no longer disabled)

#### Scenario: Specialist dashboard lists applications
- GIVEN a SPECIALIST user has submitted applications
- WHEN they visit `/dashboard`
- THEN the "My Applications" section MUST list each application with gig title, status, and date
- AND if no applications exist, it MUST show "No applications yet."

**Acceptance Criteria:**
- `app/dashboard/page.tsx` queries applications for SPECIALIST users via Prisma
- "Browse Gigs" is a `<Link>` to `/dashboard/gigs`
- Applications listed with gig title, status badge, and date

### Requirement: Role-Based Dashboard (Client gig list update)
The Client Dashboard gig list MUST show application count per gig.

#### Scenario: Client dashboard shows application count
- GIVEN a CLIENT user has gigs with applications
- WHEN they visit `/dashboard`
- THEN each gig in "My Gigs" MUST show the number of applications received

**Acceptance Criteria:**
- Gig query includes `_count: { applications: true }` or `include: { applications: true }`
- Application count displayed next to each gig
