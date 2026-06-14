# Change Proposal: domain-blocks

> Phase 0, change 7 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`).
> It is the **phrases** layer of the mechanism: the domain composites ("blocks") that screens are assembled from,
> each declaring a typed **view-model contract** and rendering from fixtures. It implements
> `docs/DESIGN_SYSTEM_SPEC.md` §3.2 (Blocks) + §5 (Typed Block View-Model Contracts), composed from the
> `ui-primitives` vocabulary (#6) and the `layout-grammar` primitives (#5) on the canonical tokens.

## Problem Statement

The atoms (tokens), syntax (layout grammar), and vocabulary (16 primitives) now exist, but there are **no domain
phrases** — the reusable, data-shaped composites (GigCard, SidebarNav, ChatPanel, …) that screens are built from.
Today:

- The only domain UI is the **legacy, pre-redesign** route markup (`MainNav`, the bespoke gig/profile/messaging
  pages) — hand-built per page, full of raw literals, sharing nothing reusable. It is exactly the non-modular
  dead-end the mechanism exists to replace.
- There is **nothing for Phase 2 screens to compose from.** A screen built today would reach down to primitives (or
  raw markup) and re-derive every card/panel by eye — re-creating the parody.
- The UI is **coupled to the schema.** There is no typed boundary describing *the data a block displays* (separate
  from Prisma tables), so blocks cannot be built or tested before Phase 1 models land, and they break when the
  schema changes.

`docs/DESIGN_SYSTEM_SPEC.md` §3.2 *defines* the block vocabulary (variant axes + composed primitives/sub-blocks) and
§5 *defines* each block's typed view-model. This change **implements** them so screens (Phase 2) become thin
compositions and the UI is decoupled from the backend by typed contracts.

## Proposed Solution

Build the 17 blocks as **token-pure, controlled, presentational** React composites under `app/components/blocks/`,
each typed by its `docs/DESIGN_SYSTEM_SPEC.md` §5 **view-model**, composed **only** from primitives + layout
primitives + tokens (+ the sub-blocks §3.2 names), and rendered from **fixtures** (no backend). Four deliverable
groups:

1. **Typed view-model contracts + scalar aliases** (`app/components/blocks/view-models.ts`) — every block's VM
   exactly per §5 (`GigCardVM`, `ProfileCardVM`/`ProfileHeaderVM`, `ClientCardVM`, `StatPanelVM`, `RatingVM`,
   `SidebarNavVM`, `TopbarVM`, `FilterBarVM`, `MessageBubbleVM`, `ConversationItemVM`, `NotificationItemVM`,
   `MessagesPanelVM`, `ChatPanelVM`, `RequirementCardVM`, `CriteriaListVM`, `TermsTabsVM`, `ApplyPanelVM`,
   `BannerCardVM`) + the schema-independent scalar/enum aliases (`Money`, `DateISO`, `ImageRef`, `IconRef`,
   `Status`/`Category` reused from `primitives/tokens.ts`, `StatVM`, `KeyVal`, `FilterOptVM`, `FieldVM`, `TermRow`,
   `NotifType`). Schema-independent — references displayed data, never query shapes.

2. **The 17 blocks** under `app/components/blocks/` (+ `index.ts` barrel), each per §3.2 variant axes and §6 usage:
   - **GigCard** — status ×6 × layout `{grid, list}`; composes StatusBadge, Tag, CategoryTag, Rating, budget
     (`type/mono`), deadline, "К проекту" Button.
   - **ProfileCard** / ProfileHeader — `{full, compact}`; Avatar, ExperienceTag (via Rating), Rating, StatPanel.
   - **ClientCard** — Avatar, name, Rating, meta.
   - **BannerCard** — headline (`type/display`), body, CTA Button, `art` slot (raster residual §7.2).
   - **StatPanel** — `{single, grid}`; stat tiles (label + value) + Rating.
   - **RequirementCard** — title, body, icon — `radius/lg` Panel.
   - **CriteriaList** — checklist rows (icon + text), `met` state.
   - **TermsTabs** — `{proposed, client}`; Tabs + structured term rows.
   - **ApplyPanel** — Input(s) + Button + structured fields.
   - **MessageBubble** — direction `{in, out}`; text, timestamp, read-state.
   - **ConversationItem** — `{read, unread}`; Avatar, preview, timestamp, unread count.
   - **NotificationItem** — type-icon variants; icon, body, timestamp, read.
   - **MessagesPanel** — `{preview, full}`; ConversationItem·list.
   - **ChatPanel** — MessageBubble·thread + Composer (Input + send + `attach` residual §7.5).
   - **SidebarNav** — role `{client, specialist}` × `{expanded, collapsed}`; NavMenuItem(+count), logo, ProfileCard,
     SupportCard, LogoutControl (sub-pieces internal to the block).
   - **Topbar** — ProfileCard (avatar) + bell + gear.
   - **FilterBar** — `{search-only, full}`; SearchInput, Filter/Select, ViewToggle.

3. **Fixtures** (`app/components/blocks/fixtures.ts`) — one typed sample VM per block (covering every variant axis:
   GigCard ×6 statuses × grid/list, MessageBubble in/out, ConversationItem read/unread, SidebarNav
   client/specialist × expanded/collapsed, etc.). Consumed by the render tests now and the `component-workbench` (#8)
   next. Pure data — no Prisma/server imports.

4. **Render + contract verification** — `__tests__/unit/components/domain-blocks.test.tsx` (jsdom) renders **every
   block in every variant** from fixtures and asserts the composed primitives/tokens/assets are present; a typed
   contract-rejection check proves a malformed VM fails the type-checker.

Blocks compose **other blocks where §3.2 specifies it** (MessagesPanel·ConversationItem, ChatPanel·MessageBubble,
SidebarNav/Topbar·ProfileCard) — that is the defined vocabulary, not a violation; the rule is **no raw styled
markup, no off-token literals, no route/server imports**. Icon/asset-bearing blocks use the exported assets via the
primitives' `Icon`/`ICON` registry (F4). The two asset residuals are flagged, not redrawn: BannerCard's raster
`art` (§7.2) renders as a slotted `ImageRef` (fixture/placeholder) and ChatPanel's composer `attach` (§7.5) ships an
accessible fallback — consistent with how `ui-primitives` handled the `eye` residual.

This change emits **blocks + contracts + fixtures + tests only**. It does **not** compose real screens or cut over
the shell (Phase 2 `compose-*`), build the workbench (`component-workbench` #8), add the automated pixel gate
(`fidelity-harness` #9), build Phase 1 data models, or touch/remove the legacy route UI. The admin/mapping blocks
(DataTable, LedgerTable, Dispute*, StepIndicator, RoleCard, CreateGigCTA, DangerAction — §3.2 second table) are
**out of scope** here (they belong to their Phase 2 screen changes / `prove-extensibility-admin`).

## Constraints

### MUST Requirements
- All **17 blocks** MUST exist under `app/components/blocks/`, each exposing the typed §3.2 variant axes and
  rendering them from fixtures; GigCard MUST render **all 6 status variants × both `{grid, list}` layouts**.
- Each block MUST declare a **typed view-model** exactly per `docs/DESIGN_SYSTEM_SPEC.md` §5 (schema-independent),
  and MUST render from a typed fixture with **no backend** (no Prisma/server-action/`lib` imports).
- Blocks MUST be **token-pure** and composed **only** from primitives + layout primitives + tokens + the §3.2
  sub-blocks — **no raw styled markup, no off-token literals**. `npm run lint:tokens` MUST pass with **no new
  baseline entries**.
- Icon/asset-bearing blocks MUST use the **exported assets** via the primitives' `Icon`/`ICON` (F4); the BannerCard
  raster `art` (§7.2) and ChatPanel `attach` (§7.5) residuals MUST be flagged (slot + accessible fallback), not
  redrawn.
- Render tests MUST cover **every block in every variant** from fixtures; `npm run build`, `npm run test:unit`, and
  `npm run lint:composition` MUST stay green; the typed contracts MUST type-check (a malformed VM fails `tsc`).

### SHOULD Requirements
- Blocks SHOULD be **controlled/presentational** (VM in, optional callbacks out; state as props), server-safe where
  possible; `"use client"` only where a block owns a DOM event, documented.
- Blocks SHOULD follow the established static-class pattern (no dynamic class concatenation) and reuse the layout
  primitives (`Stack`/`Grid`/`Split`/`Section`/`Panel`/`Rail`) for arrangement rather than ad-hoc flex/grid markup.
- Sub-pieces with no standalone contract (NavMenuItem, SupportCard, LogoutControl, Composer) SHOULD live **inside**
  their parent block file (per §7.1 they are "part of" that block), not as separate exported blocks.
- Blocks SHOULD be built to the §6 screen usage + library reference crops (`docs/design-system/reference-renders/`)
  for F1 readiness.

### Non-Goals
- **No screen composition / shell cutover** — Phase 2 (`compose-*`). Blocks are proven in isolation from fixtures.
- **No workbench** (`component-workbench` #8) and **no automated pixel gate** (`fidelity-harness` #9). F1 pixel-diff
  is deferred; F2/F3/F4/F5 enforced now.
- **No Phase 1 data models.** The VMs are *fulfilled by* later data changes (`ratings-reviews-model`,
  `category-taxonomy`, …) but this change depends on **none** of them — fixtures only.
- **No legacy removal.** `MainNav` and the pre-redesign route UI stay as-is (still baselined); Phase 2 recomposes.
- **No admin/mapping blocks** (§3.2 second table) and **no new tokens/primitives.** A gap is a `design-token-engine`
  / `ui-primitives` change, not an inline literal.
- **No redrawn residual assets** (banner raster, `attach`) — flagged and routed to Figma.

## Success Criteria

1. 17 blocks exist under `app/components/blocks/`, each typed by its §5 view-model, rendering every §3.2 variant
   from fixtures (render tests pass); GigCard covers 6 statuses × grid/list.
2. View-model contracts match §5, are schema-independent, and type-check; a malformed VM fails `tsc`; blocks import
   no backend (no Prisma/server/`lib`).
3. Output is token-pure (`lint:tokens` passes, **baseline unchanged**); blocks compose only primitives + layout +
   tokens + §3.2 sub-blocks (deterministic import-discipline check passes).
4. Icon/asset-bearing blocks use exported assets (F4); banner `art` + `attach` residuals flagged, not redrawn.
5. `npm run build`, `npm run test:unit`, `npm run lint:tokens`, `npm run lint:composition` all green; legacy + shell
   untouched; automated F1 pixel-diff explicitly deferred to `fidelity-harness`.

## Affected Areas

- `app/components/blocks/view-models.ts` (new — §5 typed contracts + scalar aliases)
- `app/components/blocks/fixtures.ts` (new — one typed sample VM per block / variant)
- `app/components/blocks/{GigCard,ProfileCard,ClientCard,BannerCard,StatPanel,RequirementCard,CriteriaList,TermsTabs,ApplyPanel,MessageBubble,ConversationItem,NotificationItem,MessagesPanel,ChatPanel,SidebarNav,Topbar,FilterBar}.tsx` (new)
- `app/components/blocks/index.ts` (new — barrel)
- `__tests__/unit/components/domain-blocks.test.tsx` (new — all-variants render + typed-contract rejection)
- read-only inputs: `docs/DESIGN_SYSTEM_SPEC.md` §3.2/§5/§6, the `ui-primitives` kit (`app/components/primitives/`),
  the `layout-grammar` primitives (`app/components/layout/`), the exported assets, the canonical tokens
- `openspec/specs/ui/spec.md` (spec delta)
- (NOT modified: `MainNav` + legacy route UI — Phase 2; `app/(protected)/layout.tsx` — `compose-shell-cutover`)

## Risks & Mitigations

**Risk**: A block needs data shaped differently from §5, tempting an ad-hoc prop that drifts from the contract.
**Mitigation**: VMs are defined **verbatim** from §5 in `view-models.ts`; blocks take `{ vm }` (or the VM fields)
and render from typed fixtures; a planted malformed-VM check fails `tsc`, locking blocks to the contract.

**Risk**: Blocks re-introduce raw literals / ad-hoc markup, eroding token purity (F2) and composition purity (F5).
**Mitigation**: Compose from primitives + layout primitives only; `lint:tokens` fails on any new literal and the
acceptance asserts the baseline file is unchanged; an import-discipline grep asserts blocks import only from the
allowed kit/data modules (no app routes, server actions, or `lib`).

**Risk**: Sub-block composition (MessagesPanel·ConversationItem, SidebarNav·ProfileCard) reads as an F5 violation.
**Mitigation**: §3.2 explicitly defines these sub-block compositions as the vocabulary; the proposal/spec scope this
as allowed (blocks compose primitives **and** §3.2 sub-blocks) — the rule is no *raw styled markup / off-token
literals / route imports*, which the checks enforce.

**Risk**: Two assets are missing from the in-hand SVGs — the cosmic banner raster (§7.2) and `attach` (§7.5).
**Mitigation**: Flag both as residuals (route to Figma). BannerCard renders `art` as a slotted `ImageRef`
(fixture/placeholder); ChatPanel's composer ships an accessible `attach` fallback — preserving the contract/variant
without redrawing (F4), exactly as `ui-primitives` handled `eye`.

**Risk**: "Fidelity DoD (F1)" can't run automated — `fidelity-harness` doesn't exist.
**Mitigation**: Build to §3.2 composition + §6 usage + the reference crops, verify F2/F3/F4/F5 deterministically
now, and explicitly defer the automated F1 pixel-diff to `fidelity-harness` (#9) — as `layout-grammar` and
`ui-primitives` did.

**Risk**: Interactive blocks (FilterBar, TermsTabs, ApplyPanel, SidebarNav, ChatPanel) drag client boundaries into
server components.
**Mitigation**: Blocks are controlled/presentational — VM in, handlers as optional passthrough props; `"use client"`
only where a block owns a DOM event. Render tests run in jsdom to confirm.
