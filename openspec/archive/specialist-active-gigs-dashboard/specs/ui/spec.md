# UI Specification - Specialist Active Gigs Dashboard

## ADDED Requirements

### Requirement: Active Gigs Section on Specialist Dashboard
The specialist dashboard MUST display an "Active Gigs" section showing all gigs where the user is the assigned specialist.

#### Scenario: Specialist with active gigs views dashboard
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is assigned to at least one gig (assignedSpecialistId === userId)
- WHEN they visit `/dashboard`
- THEN the page MUST display an "Active Gigs" section
- AND the section MUST be positioned above the "My Applications" section
- AND the section MUST have a heading "Active Gigs" or "My Active Gigs"
- AND each active gig MUST display:
  - Gig title (clickable link to `/dashboard/gigs/[id]`)
  - Budget (formatted in ₽)
  - Status badge (IN_PROGRESS, REVIEW, COMPLETED, or PAID)
  - Client company name (if clientProfile.companyName exists, otherwise client email)
  - Last updated date (formatted as locale date string)
- AND gigs MUST be ordered by most recent activity (updatedAt DESC)

#### Scenario: Specialist with no active gigs views dashboard
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is NOT assigned to any gigs
- WHEN they visit `/dashboard`
- THEN the page MUST display an "Active Gigs" section
- AND the section MUST show an empty state message
- AND the message MUST say "No active gigs yet. Browse and apply to gigs to get started."
- AND the message MUST include a link to `/dashboard/gigs` (Browse Gigs)

#### Scenario: Active gig shows IN_PROGRESS status
- GIVEN a specialist is assigned to a gig with status "IN_PROGRESS"
- WHEN they view their dashboard
- THEN the gig MUST display a status badge "In Progress"
- AND the badge MUST use blue color styling (e.g., bg-blue-100 text-blue-800)

#### Scenario: Active gig shows REVIEW status
- GIVEN a specialist is assigned to a gig with status "REVIEW"
- WHEN they view their dashboard
- THEN the gig MUST display a status badge "Under Review"
- AND the badge MUST use yellow/amber color styling (e.g., bg-amber-100 text-amber-800)

#### Scenario: Active gig shows COMPLETED status
- GIVEN a specialist is assigned to a gig with status "COMPLETED"
- WHEN they view their dashboard
- THEN the gig MUST display a status badge "Completed - Awaiting Payment"
- AND the badge MUST use green color styling (e.g., bg-green-100 text-green-800)

#### Scenario: Active gig shows PAID status
- GIVEN a specialist is assigned to a gig with status "PAID"
- WHEN they view their dashboard
- THEN the gig MUST display a status badge "Paid"
- AND the badge MUST use green color styling (e.g., bg-green-100 text-green-800)
- AND the gig MUST display the payment date (formatted from paidAt)

#### Scenario: Active gig links to detail page
- GIVEN a specialist views their dashboard with active gigs
- WHEN they click on an active gig title
- THEN the browser MUST navigate to `/dashboard/gigs/[id]`
- AND the gig detail page MUST load with full gig information

#### Scenario: Active gig shows client company name
- GIVEN a specialist is assigned to a gig
- AND the client has a clientProfile with companyName set
- WHEN they view their dashboard
- THEN the active gig MUST display the client's company name
- AND the company name MUST be visible (e.g., "Client: Acme Corp")

#### Scenario: Active gig shows client email when no company name
- GIVEN a specialist is assigned to a gig
- AND the client does NOT have a clientProfile or companyName is empty
- WHEN they view their dashboard
- THEN the active gig MUST display the client's email address
- AND the email MUST be visible (e.g., "Client: client@example.com")

#### Scenario: Active gigs ordered by recent activity
- GIVEN a specialist is assigned to multiple gigs
- AND the gigs have different updatedAt timestamps
- WHEN they view their dashboard
- THEN the active gigs MUST be ordered by updatedAt DESC (most recent first)
- AND the most recently updated gig MUST appear at the top of the list

#### Scenario: Active gig item shows hover state
- GIVEN a specialist views their dashboard with active gigs
- WHEN they hover over an active gig item
- THEN the item MUST visually indicate it is clickable
- AND the item MUST show a background color change (e.g., hover:bg-gray-50)
- AND the cursor MUST change to pointer

#### Scenario: Active Gigs section is visually distinct from Applications
- GIVEN a specialist views their dashboard
- WHEN they see both "Active Gigs" and "My Applications" sections
- THEN the two sections MUST be visually separated
- AND each section MUST have clear heading typography
- AND there MUST be adequate spacing between sections (e.g., mb-8 or space-y-8)

#### Scenario: Budget displayed in roubles
- GIVEN a specialist views an active gig on their dashboard
- WHEN the gig budget is displayed
- THEN the budget MUST be converted from kopecks to roubles
- AND the budget MUST be formatted with thousands separators (e.g., "100,000 ₽")
- AND the rouble symbol (₽) MUST be displayed

#### Scenario: Date formatting is consistent
- GIVEN a specialist views active gigs on their dashboard
- WHEN dates are displayed (updatedAt, paidAt)
- THEN dates MUST be formatted as locale date strings
- AND dates MUST use 'ru-RU' locale for consistency
- AND the format MUST match other date displays in the app (e.g., "17.02.2026")

**Acceptance Criteria:**
- `app/dashboard/page.tsx` queries active gigs for SPECIALIST users:
  ```typescript
  const activeGigs = await prisma.gig.findMany({
    where: {
      assignedSpecialistId: session.userId,
      status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
    },
    include: {
      client: {
        select: {
          email: true,
          clientProfile: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
  ```
- "Active Gigs" section positioned above "My Applications" section
- Each gig item is wrapped in `<Link href="/dashboard/gigs/{gig.id}">` with hover styling
- Status badges use consistent color coding:
  - IN_PROGRESS: blue (bg-blue-100 text-blue-800)
  - REVIEW: amber (bg-amber-100 text-amber-800)
  - COMPLETED: green (bg-green-100 text-green-800)
  - PAID: green (bg-green-100 text-green-800)
- Empty state shows helpful message with link to `/dashboard/gigs`
- Client name displays companyName if available, otherwise email
- Budget converted from kopecks to roubles and formatted with separators
- Dates formatted with 'ru-RU' locale
- PAID gigs show payment date from paidAt field
- Section uses consistent styling with existing dashboard sections
- Responsive design works on mobile devices (320px and up)
- Accessible to screen readers (proper heading hierarchy, link text)

---

## MODIFIED Requirements

None. This change only adds new functionality to the specialist dashboard without modifying existing requirements.

---

## REMOVED Requirements

None. This change is purely additive.
