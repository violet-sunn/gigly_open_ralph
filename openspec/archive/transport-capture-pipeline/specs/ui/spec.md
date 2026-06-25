# UI — Design Reference Capture (delta)

## ADDED Requirements

### Requirement: Reproducible Design Reference Capture
The repo MUST provide a committed, reproducible capture of the `gigly_full_design/` prototype's rendered screens, to serve as the canonical "transport source" for the design-transport initiative. The capture MUST be regenerable by a single command and MUST NOT require manual browser steps.

#### Scenario: A single command regenerates the full reference set
- **GIVEN** a clean checkout with dependencies installed
- **WHEN** a developer runs `npm run capture:design`
- **THEN** a Node script MUST serve `gigly_full_design/` over a local static HTTP server
- **AND** drive Playwright chromium at a 1512px viewport width
- **AND** navigate each captured state via `window.__giglyGo(...)`
- **AND** write, for every captured state, a fully-resolved page HTML file and a reference PNG into `design-reference/screens/`
- **AND** complete with **zero page errors** (no `pageerror`, no failed resource loads for prototype assets)

#### Scenario: Resolved HTML contains no unresolved template artifacts
- **GIVEN** a captured HTML file under `design-reference/screens/`
- **WHEN** its contents are inspected
- **THEN** it MUST contain the fully-expanded DOM (real markup from the component bundle)
- **AND** it MUST NOT contain unresolved `{{ }}` interpolations, `<x-import …>` tags, or `<sc-if>` / `<sc-for>` directives

### Requirement: Complete State Coverage
The capture MUST cover not only each screen's entry state but every distinct visual state it renders, so that transport never has to reconstruct an un-captured state by eye.

#### Scenario: All role-valid route entry states are captured
- **GIVEN** the prototype's 13 routes, scoped by role (e.g. `createGig`/`applications` company-only, `disputeResolve` admin-only)
- **WHEN** the capture runs
- **THEN** all **19 role-valid route-states** MUST be captured as HTML+PNG pairs

#### Scenario: Variant states are captured
- **GIVEN** screens that render multiple states from the same route
- **WHEN** the capture runs
- **THEN** it MUST capture `gigDetail` for each role × gig status (open, in_progress, review, completed, paid, rejected)
- **AND** `my-gigs` for each status tab plus its empty and loading states
- **AND** `search` for results, empty, filtered, and loading states
- **AND** both role variants of every dual-role screen
- **AND** any state not reachable via `__giglyGo` MUST be recorded in the state matrix as "capture-by-interaction" with the interaction needed

#### Scenario: Overlays are captured as their own states
- **GIVEN** the prototype's overlays
- **WHEN** the capture runs
- **THEN** it MUST capture the profile-edit modals (`bio`, `cats`, `stack`), the notifications dropdown, a success toast, and a destructive-confirmation dialog
- **AND** it MUST NOT capture the settings modal (out of scope this round)
- **AND** it MUST NOT capture `Auth.dc.html` screens (captured by the auth change)

### Requirement: Documented State → Trigger Matrix
The capture MUST be accompanied by a committed document mapping every captured state to the exact trigger that produces it, so the set is auditable and extensible.

#### Scenario: Each captured state has a documented trigger
- **GIVEN** `design-reference/STATE-MATRIX.md`
- **WHEN** it is reviewed against the captured output
- **THEN** every captured state MUST appear with its `__giglyGo` parameters (or its capture-by-interaction note)
- **AND** every entry in the matrix MUST correspond to a produced HTML+PNG pair (no orphans in either direction)
