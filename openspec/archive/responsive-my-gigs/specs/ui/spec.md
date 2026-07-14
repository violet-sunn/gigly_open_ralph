# UI Specification — Responsive Dashboard & «Мои гиги» (Delta)

This delta adds phone-width responsive behaviour to the shared app shell, the dashboard, and the
specialist «Мои гиги» screen. Scope is targeted (these surfaces only); a general responsive pass is
tracked separately. The desktop layout at `≥1024px` is unchanged.

## ADDED Requirements

### Requirement: App shell reflows and collapses the sidebar at narrow viewports
The protected app shell (`AppShellDesign`) MUST reflow below a `1024px` breakpoint so the sidebar no
longer occupies fixed horizontal space beside the content, giving the main column the full viewport
width. The shell MUST NOT introduce horizontal overflow at phone widths.

#### Scenario: Sidebar does not force horizontal overflow at 390px
- GIVEN an authenticated user on any protected route at a 390px-wide viewport
- WHEN the app shell renders
- THEN the sidebar MUST NOT sit as a fixed-width (283px/76px) column in a row beside the content
- AND the sidebar MUST be collapsed/adapted (e.g. a top bar, off-canvas drawer, or icon-only rail)
- AND `document.documentElement.scrollWidth` MUST be within ~2px of `document.documentElement.clientWidth`
- AND all sidebar affordances (nav, notification bell, settings, logout) MUST remain reachable

#### Scenario: Header search/filter row wraps instead of overflowing
- GIVEN the dashboard, browse, or «Мои гиги» route at a 390px-wide viewport
- WHEN the header search + filter-chip row renders
- THEN the four filter chips MUST NOT remain `flex: "none"` in a single non-wrapping row that exceeds the viewport
- AND the row MUST wrap (or move filters behind a control) so no horizontal overflow results
- AND the search input and filter controls MUST remain usable

#### Scenario: Shell is unchanged at desktop widths
- GIVEN an authenticated user at a `≥1024px` viewport (e.g. 1280px)
- WHEN the app shell renders
- THEN the sidebar MUST render as today (283px expanded / 76px collapsed, in-row)
- AND the header, paddings, and search/filter row MUST match the current desktop layout

### Requirement: Dashboard reflows to a single column at narrow viewports
The dashboard (`DashboardDesign`) MUST stack its multi-column regions and collapse its gig grids to a
single column below `1024px`, using fluid widths, so all content fits within 360–414px with no
horizontal overflow and is reachable by vertical scroll.

#### Scenario: Dashboard has no horizontal overflow at 390px
- GIVEN an authenticated user on `/dashboard` at a 390px-wide viewport
- WHEN the dashboard renders
- THEN the WELCOME row MUST NOT keep its fixed 317px left column beside the tiles
- AND the BOARD MUST stack the feed column and the 400px right rail vertically at full width
- AND each gig feed grid MUST collapse from `1fr 1fr` to a single column
- AND `document.documentElement.scrollWidth` MUST be within ~2px of `clientWidth`
- AND all sections (WELCOME, «Мои гиги», role panel, «Сообщения», «Требует внимания») MUST be reachable by vertical scroll

#### Scenario: Attention rail keeps its intentional horizontal scroll
- GIVEN the specialist dashboard at a 390px-wide viewport with «Требует внимания» cards
- WHEN the attention rail renders
- THEN the rail MAY scroll horizontally within its own `overflowX: auto` container
- AND this MUST NOT cause the page (`documentElement`) to overflow horizontally

#### Scenario: Dashboard is unchanged at desktop widths
- GIVEN an authenticated user on `/dashboard` at a `≥1024px` viewport
- WHEN the dashboard renders
- THEN the WELCOME row, the two-column BOARD (feed + 400px rail), and the `1fr 1fr` gig grids MUST match the current desktop layout

### Requirement: Specialist «Мои гиги» reflows to a single column at narrow viewports
The specialist «Мои гиги» screen (`MyGigsDesign`) MUST collapse its `1fr 1fr` card grid to a single
column below `1024px` so cards fit within 360–414px with no horizontal overflow and all cards are
reachable by vertical scroll.

#### Scenario: «Мои гиги» has no horizontal overflow at 390px
- GIVEN an authenticated specialist on `/my-gigs` at a 390px-wide viewport
- WHEN the screen renders with gig cards
- THEN the card grid MUST collapse from `1fr 1fr` to a single column
- AND `document.documentElement.scrollWidth` MUST be within ~2px of `clientWidth`
- AND every gig card MUST be reachable by vertical scroll
- AND the status tab row MUST remain usable (it already wraps)

#### Scenario: «Мои гиги» is unchanged at desktop widths
- GIVEN an authenticated specialist on `/my-gigs` at a `≥1024px` viewport
- WHEN the screen renders
- THEN the card grid MUST render as the current two-column `1fr 1fr` layout

### Requirement: No horizontal overflow across the phone-width range
The dashboard and specialist «Мои гиги» MUST have no page-level horizontal overflow across the full
360–414px range, not only at 390px.

#### Scenario: No horizontal overflow at the range edges
- GIVEN the dashboard and `/my-gigs` rendered at 360px and again at 414px
- WHEN each screen is measured
- THEN `document.documentElement.scrollWidth` MUST be within ~2px of `clientWidth` at both widths
- AND no element MUST extend beyond the right viewport edge
