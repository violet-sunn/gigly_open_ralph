# UI Spec Delta

## MODIFIED Requirements

### Requirement: Homepage (Landing Page)
The homepage at `/` MUST clearly communicate Gigly's value proposition and guide users to registration, while adapting based on authentication state.

#### Scenario: Anonymous user sees enhanced landing page
**Given** no valid session cookie exists
**When** a user visits `/`
**Then** the page MUST display a hero section with:
  - Application name "Gigly" (large, prominent heading)
  - Tagline: "B2B Freelance Marketplace for Russian IT Specialists"
  - Value proposition: "Connect companies with vetted Middle+/Senior specialists. Get work done fast, earn more as a senior."
  - Primary CTA button: "Get Started" linking to `/register`
  - Secondary CTA button: "Sign In" linking to `/login`
**And** the hero section MUST use a clean, professional design with navy background
**And** the hero section MUST be responsive (mobile-friendly)

#### Scenario: Landing page shows "How It Works" section
**Given** an anonymous user visits `/`
**When** they scroll down from the hero section
**Then** the page MUST display a "How It Works" section
**And** the section MUST explain the gig lifecycle in 4-5 simple steps:
  1. "Post a Gig" - Companies describe work with clear requirements
  2. "Get Applications" - Specialists apply with technical approach and questions
  3. "Choose & Work" - Accept a specialist and collaborate via messaging
  4. "Submit & Approve" - Specialist submits work, client approves
  5. "Mark as Paid" - Track payment completion
**And** each step MUST have a short description (1-2 sentences)
**And** each step MUST have an icon or emoji for visual clarity
**And** the section MUST use a light background color (contrast with hero)

#### Scenario: Landing page shows "Why Gigly" section
**Given** an anonymous user visits `/`
**When** they scroll to the "Why Gigly" section
**Then** the page MUST display 3-4 key benefits focused on operational value:
  - "Get Work Done Fast" - Quickly find strong specialists for concrete tasks
  - "Earn More as a Senior" - Monetize seniority beyond salary ceilings
  - "Clarity Upfront" - Structured requirements and applications prevent disputes
  - "Transparent Process" - Clear gig lifecycle from creation to payment
**And** each benefit MUST have a heading and 2-3 sentence description
**And** the section MUST avoid marketing fluff (no "revolutionary", "game-changing", etc.)
**And** the section MUST focus on practical operational benefits

#### Scenario: Landing page has prominent CTAs throughout
**Given** an anonymous user visits `/`
**When** they view the landing page
**Then** the page MUST display CTA buttons in at least 3 locations:
  - Hero section (primary and secondary CTAs)
  - After "How It Works" section (e.g., "Ready to Get Started?")
  - Footer or bottom of page (final CTA)
**And** all CTAs MUST link to `/register` or `/login`
**And** CTAs MUST be visually prominent (blue buttons, good contrast)
**And** CTAs MUST have clear, action-oriented text ("Get Started", "Post Your First Gig", "Find Work")

#### Scenario: Landing page remains simple and focused
**Given** an anonymous user visits `/`
**When** they view the entire landing page
**Then** the page MUST NOT include:
  - Complex animations or carousels
  - Video content
  - Testimonials or social proof (not yet available)
  - Pricing tables (fee is explained during gig creation)
  - Blog or news sections
**And** the page MUST be a single scrollable page (no navigation to other marketing pages)
**And** the page MUST load quickly (< 2 seconds on 3G connection)

#### Scenario: Authenticated user sees simplified homepage
**Given** a user is logged in (valid session cookie)
**When** they visit `/`
**Then** the page MUST display:
  - Application name "Gigly"
  - User's email address
  - "Go to Dashboard" button linking to `/dashboard`
  - "Sign out" button
**And** the page MUST NOT show the full landing page content (How It Works, Why Gigly)
**And** the page MUST maintain the existing authenticated user experience

#### Scenario: Landing page is mobile responsive
**Given** an anonymous user visits `/` on a mobile device (320px width)
**When** the page renders
**Then** all sections MUST stack vertically
**And** text MUST remain readable (no horizontal scrolling)
**And** CTA buttons MUST be easily tappable (min 44px height)
**And** images or icons MUST scale appropriately
**And** the page MUST maintain visual hierarchy on small screens

#### Scenario: Landing page is accessible
**Given** a user with a screen reader visits `/`
**When** they navigate the page
**Then** all sections MUST have proper heading hierarchy (h1 for "Gigly", h2 for sections)
**And** all CTA buttons MUST have descriptive text (no "Click here")
**And** all images MUST have alt text
**And** the page MUST be keyboard navigable (tab through CTAs)
**And** color contrast MUST meet WCAG AA standards

#### Scenario: Landing page content is in English
**Given** an anonymous user visits `/`
**When** they read the landing page content
**Then** all text MUST be in English (for broader accessibility)
**And** the page MUST mention "Russian IT market" or "Russian specialists" to clarify target market
**And** currency MUST be shown as "₽" or "RUB" to indicate Russian market focus

**Acceptance Criteria:**
- `app/page.tsx` updated with new landing page sections
- Hero section with value proposition and dual CTAs
- "How It Works" section with 4-5 steps explaining gig lifecycle
- "Why Gigly" section with 3-4 operational benefits
- Multiple CTA placements throughout the page
- Responsive design (mobile, tablet, desktop)
- Accessible (WCAG AA, keyboard navigation, screen reader friendly)
- Simple, clean design without marketing fluff
- Authenticated user experience unchanged (shows dashboard link and logout)
- All existing auth flow (login, register, logout) continues to work
- Page loads quickly (no heavy assets or complex JavaScript)
- Content is in English with clear Russian market context
