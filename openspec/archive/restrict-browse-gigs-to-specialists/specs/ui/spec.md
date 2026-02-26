# UI Specification Delta: Restrict Browse Gigs to Specialists

## ADDED Requirements

### Requirement: Example Gigs Page
The system MUST provide a page at `/dashboard/gigs/examples` displaying example gigs for inspiration, accessible to both CLIENT and SPECIALIST users.

#### Scenario: CLIENT views example gigs
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs/examples`
- THEN the page MUST display a list of all gigs where `isExample: true`
- AND each gig MUST show: title, budget (formatted in ₽), tags, description preview, and creation date
- AND each gig MUST link to `/dashboard/gigs/[id]` (gig detail page)
- AND the page MUST display a heading "Example Gigs" with explanatory text
- AND the page MUST NOT show pagination (all example gigs on one page)

#### Scenario: SPECIALIST views example gigs
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs/examples`
- THEN the page MUST display the same list of example gigs as CLIENT users
- AND all functionality MUST be identical to CLIENT view

#### Scenario: No example gigs exist
- GIVEN no gigs with `isExample: true` exist in the database
- WHEN any authenticated user visits `/dashboard/gigs/examples`
- THEN the page MUST display "No example gigs available."

#### Scenario: CLIENT clicks example gigs link from gig creation form
- GIVEN an authenticated CLIENT user on `/dashboard/gigs/new`
- WHEN they click the "💡 View example gigs for inspiration" link
- THEN a new tab MUST open to `/dashboard/gigs/examples`
- AND the page MUST display all example gigs
- AND no error message MUST be shown

#### Scenario: Unauthenticated user visits example gigs page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs/examples`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/examples/page.tsx` exists as a new server component
- Page queries `prisma.gig.findMany({ where: { isExample: true, status: 'OPEN' } })`
- Page is accessible to both CLIENT and SPECIALIST roles (no role check)
- Page layout matches existing gig browse page styling
- Each gig card links to gig detail page
- Page includes explanatory text: "These are example gigs to help you understand what makes a good gig description. Use them as inspiration when creating your own gigs."
- No pagination needed (small number of example gigs)
- Link in gig creation form updated to point to `/dashboard/gigs/examples`

---

## MODIFIED Requirements

### Requirement: Gig Browse Page
The system MUST provide a page at `/dashboard/gigs` listing all OPEN gigs for browsing, accessible ONLY to SPECIALIST users.

#### Scenario: Specialist browses gigs
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs`
- THEN the page MUST display a list of all gigs with status "OPEN"
- AND each gig MUST show: title, budget (formatted in ₽), tags, and creation date
- AND each gig MUST link to `/dashboard/gigs/[id]`
- AND example gigs MUST be included in the list (no filtering)

#### Scenario: No open gigs available
- GIVEN no gigs with status "OPEN" exist
- WHEN a SPECIALIST visits `/dashboard/gigs`
- THEN the page MUST display "No open gigs available."

#### Scenario: CLIENT attempts to access browse page
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs`
- THEN they MUST be redirected to `/dashboard`
- AND a message MUST be displayed: "Browse Gigs is only available for specialists. As a client, you can post gigs and manage applications. To view example gigs, visit the Examples page."

#### Scenario: Unauthenticated user visits browse page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/page.tsx` checks session role before rendering
- CLIENT users are redirected to `/dashboard` with error message
- SPECIALIST users see the full gig list without changes
- Redirect uses Next.js `redirect()` function with query parameter for message
- Dashboard page displays the error message from query parameter
- All existing gig browsing functionality remains unchanged for SPECIALIST users
- Example gigs remain visible in the list (no filtering by `isExample`)

---

## MODIFIED Requirements

### Requirement: Gig Creation Form Visual Sections
The gig creation form MUST organize fields into three visually distinct sections with clear headings and boundaries to improve form comprehension and reduce cognitive load.

#### Scenario: Requirements & Success Criteria section structure
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Requirements & Success Criteria" section
- THEN the section MUST contain:
  - Heading: "Requirements & Success Criteria" (h3 or equivalent)
  - Link to example gigs: "💡 View example gigs for inspiration" (right-aligned in section header, opens `/dashboard/gigs/examples` in new tab)
  - Description: "Define what success looks like and help specialists understand your needs"
  - Fields: acceptanceCriteria (textarea with character counter and quality warning), goal (optional textarea), deliverables (optional textarea), constraints (optional textarea)
- AND the section header MUST use flex layout (flex items-center justify-between) with heading on left and example link on right
- AND the example link MUST open in new tab (target="_blank") with security attributes (rel="noopener noreferrer")
- AND the example link MUST use secondary styling (text-sm text-indigo-600 hover:text-indigo-800 underline)
- AND the example link MUST point to `/dashboard/gigs/examples` (not `/dashboard/gigs`)
- AND the section MUST be the second section in the form (after Basic Information)
- AND the section MUST have a light background color (e.g., bg-gray-50)
- AND the section MUST have a border (e.g., border-gray-200)
- AND all existing character counters and quality warnings MUST remain functional

**Acceptance Criteria:**
- Link in gig creation form updated from `/dashboard/gigs` to `/dashboard/gigs/examples`
- All other functionality remains unchanged

---

## Implementation Notes

### New Example Gigs Page
Create `app/dashboard/gigs/examples/page.tsx`:
```typescript
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ExampleGigsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const exampleGigs = await prisma.gig.findMany({
    where: {
      isExample: true,
      status: 'OPEN'
    },
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: {
          email: true,
          clientProfile: true
        }
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Example Gigs</h2>
          <p className="mt-2 text-sm text-gray-600">
            These are example gigs to help you understand what makes a good gig description.
            Use them as inspiration when creating your own gigs.
          </p>
        </div>

        {exampleGigs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-sm text-gray-500">No example gigs available.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {exampleGigs.map((gig) => (
              <li key={gig.id}>
                <Link
                  href={`/dashboard/gigs/${gig.id}?from=examples`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Gig card content - same as browse page */}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```

### Redirect Mechanism for Browse Page
Use Next.js `redirect()` with query parameter to pass error message:
```typescript
if (session.role === 'CLIENT') {
  redirect('/dashboard?error=browse-gigs-specialists-only')
}
```

### Dashboard Message Display
Update `/dashboard/page.tsx` to read and display error messages from query parameters:
```typescript
const errorParam = searchParams?.error
const errorMessage = errorParam === 'browse-gigs-specialists-only'
  ? 'Browse Gigs is only available for specialists. As a client, you can post gigs and manage applications. To view example gigs, visit the Examples page.'
  : null
```

### Update Gig Creation Form Link
Update `app/dashboard/gigs/new/gig-form.tsx`:
- Change link href from `/dashboard/gigs` to `/dashboard/gigs/examples`
- No other changes needed

### Testing Considerations
- Test CLIENT can access `/dashboard/gigs/examples`
- Test SPECIALIST can access `/dashboard/gigs/examples`
- Test CLIENT redirect from `/dashboard/gigs` with error message
- Test SPECIALIST access to `/dashboard/gigs` remains unchanged
- Test example gig link from gig creation form opens correct page
- Verify no regression in pagination, filtering, or search on main browse page
