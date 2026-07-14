# Change Proposal: Responsive Dashboard & «Мои гиги» at Phone Widths

## Problem Statement

On a phone-width viewport the dashboard and the specialist «Мои гиги» screen are broken and unscrollable. Reported in the round-2 stress test as **«Съехал UI в Мои гиги и нет возможности прокрутки»** (Гигли баги #5).

Verified live at 390px: the app renders its **desktop layout** — the full 283px sidebar (`AppShellDesign` is a `flexDirection: "row"` shell whose `<aside>` never collapses at narrow widths), the header's four non-shrinking filter chips (`flex: "none"`) beside a 48px search field, and multi-column content grids. The result is horizontal overflow (`document.scrollWidth ≈ 1068` vs `clientWidth 390`), content cut off past the right edge, and no working scroll. This same desktop-on-mobile root is why the other phone screenshots in the report look «съехавшими».

Root causes, concretely:

- **`app/_design/AppShellDesign.tsx`** — fixed-width sidebar (283px expanded / 76px collapsed) laid out in a row, plus a header search row of four `flex: "none"` filter chips + a fixed 48px search input and fixed horizontal paddings (`40px 48px 0 24px`, content `24px 48px 48px 24px`). Together these force a minimum width far above 390px.
- **`app/(protected)/dashboard/DashboardDesign.tsx`** — the WELCOME row uses a fixed `width: 317` left column; the BOARD row pins a `width: 400, flex: "none"` right rail beside a `flex: 1` column; both gig feeds use a hard `gridTemplateColumns: "1fr 1fr"`.
- **`app/(protected)/my-gigs/MyGigsDesign.tsx`** — a hard `gridTemplateColumns: "1fr 1fr"` two-column grid.

Round 1 kept the app **desktop-first**, so mobile support is a new scope decision. Per the scope decision taken with the user, this change is **targeted**: fix the dashboard, the specialist «Мои гиги», and the shared app shell at phone widths only. A general responsive pass across all authenticated screens is tracked separately and is explicitly out of scope here.

## Proposed Solution

Make the app shell and the two target screens **reflow** below a `1024px` breakpoint while leaving the desktop layout byte-for-byte unchanged at `≥1024px`.

1. **Shared narrow-viewport mechanism.** Add a small client hook (e.g. `useIsNarrow()` backed by `window.matchMedia("(max-width: 1023px)")`) that all three already-`"use client"` components branch their inline style objects on. Default to the desktop branch during SSR / before mount (guarded by a mounted flag) so the desktop render is untouched and there is no `!important` fight against the ported inline styles. A CSS-class + media-query stylesheet is an acceptable alternative where it is cleaner (e.g. grid templates), but MUST NOT alter the `≥1024px` result.
2. **App shell (`AppShellDesign`).** At narrow widths, take the sidebar out of the horizontal flow — stack the shell to a column and render the sidebar as a collapsed/adaptive top bar or an off-canvas drawer (icon-only rail is acceptable), so the main column gets the full viewport width. Let the header search row wrap (allow the filter chips to wrap or move behind a control) and reduce the fixed horizontal paddings so content fits within 360–414px.
3. **Dashboard (`DashboardDesign`).** Stack the WELCOME row (drop the fixed 317px column to full width), stack the BOARD (the `flex: 1` feed column above the `width: 400` right rail, both full width), and collapse the gig grids from `1fr 1fr` to a single column at narrow widths.
4. **«Мои гиги» (`MyGigsDesign`).** Collapse the `1fr 1fr` grid to a single column at narrow widths; the tab row already wraps.
5. **No horizontal overflow, working vertical scroll.** At 360–414px the target screens MUST satisfy `scrollWidth ≈ clientWidth` (no horizontal scrollbar) and all content MUST be reachable by vertical scroll.

## Design Constraints

- **MUST** leave the desktop layout unchanged at `≥1024px` (visual and DOM-measurable parity with today).
- **MUST** produce no horizontal overflow on the dashboard and specialist «Мои гиги» at 360–414px: `document.documentElement.scrollWidth` MUST be within ~2px of `clientWidth`.
- **MUST** keep all content reachable via vertical scroll at phone widths (no clipped/cut-off content, no `overflow: hidden` trap on the scroll container).
- **MUST** stack multi-column layouts to a single column and use fluid widths at narrow widths (no fixed desktop grid, no fixed px column widths that exceed the viewport).
- **MUST** collapse / adapt the sidebar at narrow widths so it does not occupy fixed horizontal space alongside content.
- **MUST** preserve all existing behaviour and wiring (nav, notification bell, theme toggle, settings modal, search, tab filtering, header filter chips, logout).
- **SHOULD** use a single shared breakpoint (`1024px`) and mechanism across the three files rather than ad-hoc per-component values.
- **SHOULD** avoid a hydration flash by defaulting to the desktop branch until mounted.
- **SHOULD** keep the horizontally-scrolling «Требует внимания» rail (its `overflowX: "auto"` is intentional and is not page-level overflow).

## Success Criteria

1. At 390px the dashboard has `scrollWidth ≈ clientWidth` (no horizontal overflow), columns stacked single-column, all content reachable by vertical scroll.
2. At 390px the specialist «Мои гиги» has `scrollWidth ≈ clientWidth`, a single-column card grid, all content reachable by vertical scroll.
3. The sidebar is collapsed/adapted at narrow widths and does not force horizontal overflow.
4. At 360px and 414px (range edges) both screens still have no horizontal overflow.
5. At `≥1024px` (e.g. 1280px) both screens and the shell are visually and structurally unchanged from today.
6. All existing tests pass without modification; live verification passes at both mobile (390px) and desktop viewports.

## Non-Goals

- A general responsive pass across all other authenticated screens (gig detail, browse, profile, chats, finances, disputes, admin, create-gig, settings). Tracked separately.
- A native mobile app or mobile-specific navigation redesign beyond collapsing/adapting the existing sidebar.
- Any change to desktop layout, spacing, or visuals at `≥1024px`.
- Touch gestures, swipe navigation, or mobile-only features.
- Changing data fetching, view-models, server actions, or business logic.

## Impact Assessment

**User Experience**: Directly fixes bug #5 — the dashboard and «Мои гиги» become usable and scrollable on phones, removing the «съехавший» horizontal-overflow experience.

**Performance**: Negligible — a `matchMedia` listener and conditional inline styles; no extra data or network.

**Maintenance**: Low — one shared hook/breakpoint reused by three components; establishes the pattern a later general pass can extend.

**Risk**: Contained — desktop is gated behind the breakpoint and defaults to the current branch, so `≥1024px` is provably untouched.

## Dependencies

- Existing `"use client"` components: `AppShellDesign`, `DashboardDesign`, `MyGigsDesign`.
- `app/_design/tokens.css` (shared design tokens/fonts) — may host optional responsive CSS.
- Next.js 15 default viewport meta (`width=device-width`) is already emitted; no viewport change needed.

## Alternatives Considered

**Alternative 1: `!important` CSS media queries overriding inline styles.**
Rejected as the primary approach — fighting the ported inline styles with `!important` is brittle and hard to reason about; a JS width branch on the already-client components is cleaner. CSS classes are still fine where they don't need to override an inline value (e.g. a grid container that moves its template to a class).

**Alternative 2: General responsive pass now (option B).**
Rejected for this change — larger surface, higher regression risk, slower to verify. Tracked as a separate follow-up so bug #5 ships as a contained, verifiable deliverable.

**Alternative 3: Server-side device detection to pick a layout.**
Rejected — adds server complexity and cache-variance; client `matchMedia` on already-client components is simpler and matches the codebase.
