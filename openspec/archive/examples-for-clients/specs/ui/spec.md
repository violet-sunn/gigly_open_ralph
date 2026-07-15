# UI — Spec Delta (examples-for-clients)

> The create-gig examples link is **already required** by "Examples Page Back Navigation" (`ui/spec.md:2539`) and is
> simply missing from the code — lost in the re-ground to `CreateGigDesign.tsx`. The MODIFIED requirements below
> restate it against the re-grounded screen (Russian, token-pure, `?from=new`) and fix a route that does not exist.

## MODIFIED Requirements

### Requirement: Examples Page Entry Point and Back Navigation
The gig-creation screen MUST offer a visible, discoverable link to the example gigs, and the examples page MUST offer a way back to where the viewer came from. The link MUST open in a **new tab**: the creation screen holds the entire in-progress brief in client state, so an in-tab navigation would silently destroy a half-written gig.

#### Scenario: The gig-creation screen links to the examples
- GIVEN a CLIENT is on the gig-creation screen (`/gigs/new`, `CreateGigDesign`)
- WHEN the screen renders
- THEN it MUST display a visible link to the example gigs, in Russian (e.g. «💡 Посмотреть примеры»), positioned as inspiration for writing the brief
- AND the link MUST target `/gigs/examples?from=new`
- AND it MUST open in a new tab (`target="_blank"` + `rel="noopener"`), so the in-progress brief is not lost
- AND it MUST be token-pure (`gigly_full_design` skin), not kit classes

#### Scenario: The in-progress brief survives opening the examples
- GIVEN a CLIENT has partially filled the creation form (title, description, criteria chips)
- WHEN they open the examples link and return to the creation tab
- THEN every entered value MUST still be present
- AND the readiness checklist/counters (per "Legible «Why Submit Is Disabled» Guidance") MUST be unchanged

#### Scenario: An example gig's detail returns to the examples
- GIVEN a CLIENT opens an example gig from the examples list (`/gigs/{id}?from=examples`)
- WHEN the gig-detail screen renders its back control
- THEN it MUST read «← Назад к примерам» and return to `/gigs/examples`
- AND it MUST NOT return to `/gigs` — that is the SPECIALIST-only search, which redirects a CLIENT on to `/dashboard`, stranding them away from both the examples and their draft

#### Scenario: The gig-detail back control is unchanged without a from parameter
- GIVEN a gig detail opened without `?from` (the ordinary case)
- WHEN the back control renders
- THEN it MUST read «← Назад к гигам» and target `/gigs`, exactly as before

#### Scenario: BackButton no longer points at a route that does not exist
- GIVEN the shared `BackButton` component is rendered with `?from=examples`
- WHEN it computes its href
- THEN it MUST link to `/gigs/examples` — the route that exists
- AND it MUST NOT link to `/dashboard/gigs/examples`, which is not a route and yields a 404

#### Scenario: BackButton returns to the creation screen
- GIVEN a user is on `/gigs/examples?from=new`
- WHEN the BackButton renders
- THEN it MUST display Russian text returning to the creation screen (e.g. «← Назад к созданию гига»)
- AND it MUST link to `/gigs/new`

#### Scenario: BackButton still does not render without a from parameter
- GIVEN a user navigates to the examples page without a `from` query parameter
- WHEN the BackButton renders
- THEN it MUST return null (unchanged behavior)

**Acceptance Criteria:**
- `CreateGigDesign.tsx` renders the examples link; the C1 readiness machinery (checklist, counters, why-disabled, criteria auto-commit) is untouched — this change is purely additive
- `BackButton.tsx`: `from=examples` → `/gigs/examples`; new `from=new` → `/gigs/new` with Russian text
- The other BackButton contexts (browse/profile/dashboard/admin) are unchanged, including their English text — localizing them is a separate sweep
- The gig-detail return path is implemented on the screen's OWN back control, not on `BackButton`: the re-grounded `GigDetail` deliberately ships its own «Назад» link and never renders `BackButton`, so `?from=examples` was inert until the control was made context-aware. `from` is threaded from the server page rather than read with `useSearchParams`, keeping the data at the page layer
- The examples page is the only live consumer of `BackButton` (via `from=new`)

---

### Requirement: Example Gigs Page Empty State Enhancement
The example gigs page MUST show a dedicated empty state when no example gigs are available, in **Russian**.

> The original wording mandated *the `EmptyState` component*. That is no longer satisfiable alongside the token-purity
> requirement below: the shared `EmptyState` is a pre-reground kit component (`bg-surface-level-1`,
> `border-neutral-weak`, `text-white`) and rendering it would reintroduce exactly the classes this change removes. The
> requirement's intent — never show a bare empty list — is preserved; the mechanism is now the re-grounded screen's own
> empty state, matching how the other re-grounded screens (e.g. `DisputesDesign`) render theirs.

#### Scenario: No example gigs available
- GIVEN a user (CLIENT or SPECIALIST) is on `/gigs/examples`
- WHEN no example gigs exist in the database
- THEN the page MUST display an empty state with the «✨» icon and a Russian heading/description explaining that examples are not set up yet
- AND it MUST NOT display the English strings «No Example Gigs Available» / «Example gigs haven't been set up yet…»
- AND it MUST NOT render the kit `EmptyState` component, whose classes the token-purity requirement forbids

## ADDED Requirements

### Requirement: Example Gigs Page Is Localized and Re-grounded
The `/gigs/examples` page MUST be in Russian and rendered on the `gigly_full_design` skin, consistent with every other re-grounded screen. It is a client-facing inspiration surface reached while writing a brief; English kit copy makes it read as an unfinished internal page.

#### Scenario: The page is Russian
- GIVEN any viewer on `/gigs/examples`
- WHEN the page renders
- THEN the heading, the explanatory copy, and the per-card badge MUST be in Russian
- AND the English strings «Example Gigs» / «✨ Example» MUST NOT appear

#### Scenario: The page is token-pure
- GIVEN the page renders
- THEN it MUST use the `gigly_full_design` tokens/skin (`app/_design/tokens.css`), not the pre-reground kit classes (`bg-surface-level-*`, `text-neutral-strong`, …)
- AND it MUST pass the project's token/composition lint gates

#### Scenario: Example cards remain navigable with a return path
- GIVEN example gigs exist
- WHEN the list renders
- THEN each card MUST link to that gig's detail with `?from=examples`, so the detail's BackButton returns to `/gigs/examples`

#### Scenario: The page queries only what it renders
- GIVEN the page's Prisma query
- WHEN it fetches example gigs
- THEN it MUST NOT `include` the client's `email` / `clientProfile` while rendering neither — an unused personal-data include on a page with no role check
- AND it MUST still filter to `isExample: true` AND `status: 'OPEN'`, newest first

**Acceptance Criteria:**
- `app/(protected)/gigs/examples/page.tsx` is Russian, token-pure, and drops the unused `client` include
- Access is unchanged: no role gate is added (both CLIENT and SPECIALIST may reach the route, per the Empty State requirement above and the existing `SPECIALIST access` integration tests)
- The specialist empty-browse entry to examples (`ui/spec.md:2579-2586`) is untouched
