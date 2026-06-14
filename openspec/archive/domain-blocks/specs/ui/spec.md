# UI Specification Delta: domain-blocks

This document contains specification changes for the `domain-blocks` change.

Scope note: these requirements implement the **domain block vocabulary** from `docs/DESIGN_SYSTEM_SPEC.md` §3.2 and
the **typed view-model contracts** from §5 — the 17 blocks (GigCard, ProfileCard, ClientCard, BannerCard, StatPanel,
RequirementCard, CriteriaList, TermsTabs, ApplyPanel, MessageBubble, ConversationItem, NotificationItem,
MessagesPanel, ChatPanel, SidebarNav, Topbar, FilterBar), each typed by its §5 view-model, composed only from
`ui-primitives` + `layout-grammar` primitives + tokens (+ the §3.2 sub-blocks), and rendered from fixtures. They
ship **blocks + contracts + fixtures + tests only**. They do **not** compose real screens or cut over the shell
(Phase 2), build the workbench (#8) or pixel gate (#9), add Phase 1 data models, build the admin/mapping blocks
(§3.2 second table), or remove the legacy route UI. F2 (token-purity), F3 (all-variants/logical parity), F4 (real
assets), and F5 (composition purity) are enforced here; the **automated F1 pixel-diff** is deferred to
`fidelity-harness` (#9) — blocks are built to §3.2/§6 + the reference crops now.

---

## ADDED Requirements

### Requirement: Domain Block Vocabulary — 17 Composites from Primitives
The kit MUST provide the 17 blocks of `docs/DESIGN_SYSTEM_SPEC.md` §3.2 under `app/components/blocks/`, each
exposing the typed variant axes named there and composed only from `ui-primitives` + `layout-grammar` primitives +
tokens (+ the sub-blocks §3.2 names). Each block is a controlled, presentational composite.

#### Scenario: All seventeen blocks exist and render from fixtures
- GIVEN the change is implemented
- WHEN each block is rendered with its fixture view-model
- THEN `GigCard`, `ProfileCard`, `ClientCard`, `BannerCard`, `StatPanel`, `RequirementCard`, `CriteriaList`,
  `TermsTabs`, `ApplyPanel`, `MessageBubble`, `ConversationItem`, `NotificationItem`, `MessagesPanel`, `ChatPanel`,
  `SidebarNav`, `Topbar`, and `FilterBar` MUST each exist under `app/components/blocks/` and render its output

#### Scenario: GigCard renders all six statuses across both layouts
- GIVEN the `GigCard` block
- WHEN it is rendered for each of the 6 statuses (`open`, `review`, `in-progress`, `verification`, `completed`,
  `rejected`) in both `grid` and `list` layouts
- THEN it MUST render each combination, composing StatusBadge (the status), Tag/CategoryTag, Rating, the budget in
  `type/mono`, the deadline, and a "К проекту" Button — with no status or layout variant missing

#### Scenario: Each block's documented variant axes render
- GIVEN a block with a §3.2 variant axis (e.g. ProfileCard `{full, compact}`; MessageBubble `{in, out}`;
  ConversationItem `{read, unread}`; MessagesPanel `{preview, full}`; SidebarNav role × `{expanded, collapsed}`;
  FilterBar `{search-only, full}`; TermsTabs `{proposed, client}`; StatPanel `{single, grid}`)
- WHEN each variant is requested
- THEN the block MUST render that variant from its fixture

#### Scenario: Sub-block composition follows §3.2
- GIVEN the blocks that §3.2 defines as composing sub-blocks
- WHEN their composition is inspected
- THEN `MessagesPanel` MUST compose `ConversationItem`, `ChatPanel` MUST compose `MessageBubble` (+ a Composer), and
  `SidebarNav`/`Topbar` MUST compose `ProfileCard` — as the defined vocabulary

**Acceptance Criteria:**
- All 17 blocks exist under `app/components/blocks/` and render every §3.2 variant from fixtures
- GigCard covers 6 statuses × `{grid, list}`; §3.2 sub-block compositions are present

---

### Requirement: Typed View-Model Contracts (schema-independent, fixture-driven)
Each block MUST declare a typed view-model exactly per `docs/DESIGN_SYSTEM_SPEC.md` §5, schema-independent (the data
it displays, not Prisma tables), and MUST render from typed fixtures with no backend dependency.

#### Scenario: View-models match §5 and are typed
- GIVEN `app/components/blocks/view-models.ts`
- WHEN the contracts are inspected
- THEN each block's VM (`GigCardVM`, `ProfileCardVM`, `ClientCardVM`, `StatPanelVM`, `SidebarNavVM`, `TopbarVM`,
  `FilterBarVM`, `MessageBubbleVM`, `ConversationItemVM`, `NotificationItemVM`, `MessagesPanelVM`, `ChatPanelVM`,
  `RequirementCardVM`, `CriteriaListVM`, `TermsTabsVM`, `ApplyPanelVM`, `BannerCardVM`) MUST be defined with the §5
  field names/types, using schema-independent scalar aliases (`Money`, `DateISO`, `ImageRef`, `IconRef`, `Status`,
  `Category`)

#### Scenario: A malformed view-model fails the type-checker
- GIVEN a block typed by its VM
- WHEN a fixture/usage supplies a VM missing a required field or with a wrong-typed field (e.g. a `GigCardVM`
  without `status`, or `layout: "masonry"`)
- THEN `tsc --noEmit` / `npm run build` MUST fail on it
- AND the clean tree (fixtures matching the contracts) MUST type-check and build green

#### Scenario: Blocks render from fixtures with no backend
- GIVEN the blocks and `app/components/blocks/fixtures.ts`
- WHEN a block is rendered in a test
- THEN it MUST render purely from a fixture VM, and MUST NOT import Prisma, server actions, or `lib/*` data modules

**Acceptance Criteria:**
- Every block's VM matches §5 and type-checks; a malformed VM fails `tsc`
- Blocks render from typed fixtures; no Prisma/server/`lib` imports in `app/components/blocks/`

---

### Requirement: Token Purity and Composition Purity (F2/F5)
Blocks MUST express styling **only via canonical tokens** (zero hardcoded values) and MUST be composed only from
primitives + layout primitives + tokens + the §3.2 sub-blocks — no raw styled markup, no route/server imports.

#### Scenario: Blocks are token-pure
- GIVEN the block source/output
- WHEN it is inspected
- THEN colour/spacing/radius/type/size MUST resolve to canonical token utilities only — no raw hex, `rgb()/hsl()`,
  or raw `px` literal
- AND `npm run lint:tokens` MUST pass with **no new baseline entries**

#### Scenario: Blocks compose only the allowed kit modules
- GIVEN a block file under `app/components/blocks/`
- WHEN its imports are inspected
- THEN it MUST import only from `@/app/components/primitives`, `@/app/components/layout`, sibling blocks
  (`@/app/components/blocks/*`), the view-model/fixture modules, `react`, and `next/*` — and MUST NOT import app
  routes, server actions, Prisma, or `lib/*`, nor contain `style=` raw styling or off-token `className` literals

**Acceptance Criteria:**
- No raw colour/px literals in `app/components/blocks/`; `lint:tokens` passes with an unchanged baseline file
- Import-discipline check passes (only primitives/layout/blocks/tokens/fixtures/react/next); no raw styled markup

---

### Requirement: Real Assets and Residual Handling (F4)
Icon/asset-bearing blocks MUST use the exported assets via the primitives' `Icon`/`ICON` registry, not redrawn
glyphs; the known asset residuals MUST be flagged rather than re-drawn.

#### Scenario: Icon-bearing blocks use exported assets
- GIVEN SidebarNav (nav icons + logo), Topbar (bell/gear), NotificationItem (type icon), ChatPanel composer (send),
  CriteriaList (met indicator)
- WHEN their icon usage is inspected
- THEN each MUST render via the primitives' `Icon`/`ICON` registry (exported `public/assets/design-system/*`), not
  an inline redrawn glyph

#### Scenario: Banner raster and attach residuals are flagged, not redrawn
- GIVEN the cosmic banner raster (`docs/DESIGN_SPECS.md` §7.2) and the `attach` icon (§7.5) are absent from the
  in-hand SVGs
- WHEN BannerCard and ChatPanel are implemented
- THEN BannerCard MUST render `art` as a slotted `ImageRef` (fixture/placeholder, not a redrawn illustration) and
  ChatPanel's composer MUST ship an accessible `attach` fallback — both flagged as residuals (routed to Figma)

**Acceptance Criteria:**
- Icon-bearing blocks use exported assets via `Icon`/`ICON`
- Banner `art` is a slot; ChatPanel `attach` has an accessible fallback; both residuals flagged, not redrawn

---

### Requirement: All-Variants Render Coverage and Deferred Fidelity
The blocks MUST be verified deterministically by a render-test suite covering **every block in every variant** from
fixtures, with the unit suite and build green, and the automated **F1 pixel-diff** explicitly deferred to
`fidelity-harness`.

#### Scenario: Render tests cover every block and variant
- GIVEN the render-test suite (`__tests__/unit/components/domain-blocks.test.tsx`, jsdom)
- WHEN `npm run test:unit` runs
- THEN it MUST render each block in every documented variant from fixtures and assert the composed primitives/tokens/
  assets are present (e.g. GigCard `review` → StatusBadge `status-review` + a "К проекту" Button; MessageBubble `out`
  vs `in`; SidebarNav `collapsed` → Rail/icon-rail)
- AND the overall unit suite MUST stay green

#### Scenario: Build and composition lint stay green
- GIVEN the new blocks
- WHEN `npm run build` and `npm run lint:composition` run
- THEN both MUST pass (blocks compile; the change adds no composed-screen violations)

#### Scenario: F1 automated fidelity is deferred; legacy untouched
- GIVEN `fidelity-harness` is not yet built and Phase 2 has not begun
- WHEN the verification scope is inspected
- THEN the change MUST verify F2/F3/F4/F5 now and explicitly defer the automated F1 pixel-diff (vs the reference
  crops in `docs/design-system/reference-renders/`) to `fidelity-harness` (#9)
- AND the legacy route UI (`MainNav`, pre-redesign pages) and the shell (`app/(protected)/layout.tsx`) MUST be
  unchanged

**Acceptance Criteria:**
- Render tests pass for every block × variant from fixtures; `npm run build` + `npm run test:unit` +
  `npm run lint:composition` green
- F2/F3/F4/F5 enforced now; automated F1 pixel-diff deferred to `fidelity-harness`; legacy + shell untouched

---

## Test Plan

This change ships blocks + contracts + fixtures + tests. Validation is by deterministic commands. Commands assume
the repo root.

### Blocks, contracts, fixtures present
```bash
for b in GigCard ProfileCard ClientCard BannerCard StatPanel RequirementCard CriteriaList TermsTabs ApplyPanel MessageBubble ConversationItem NotificationItem MessagesPanel ChatPanel SidebarNav Topbar FilterBar; do \
  test -f "app/components/blocks/$b.tsx" && echo "OK $b" || echo "CHECK $b"; done
test -f app/components/blocks/view-models.ts && test -f app/components/blocks/fixtures.ts && test -f app/components/blocks/index.ts && echo "contracts + fixtures + barrel present"
```

### Token purity (F2) — no new baseline
```bash
npm run lint:tokens && echo "token-purity passes"
grep -rEn '#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(|[0-9]+px' app/components/blocks && echo "CHECK raw literal" || echo "OK no raw literals"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "OK baseline unchanged" || echo "CHECK baseline grew"
```

### Composition purity (F5) — import discipline + no backend
```bash
# blocks must NOT import app routes, server actions, Prisma, or lib/*
grep -rnE "from ['\"](@/app/\(|@/app/actions|@/lib|@/prisma|next/server)" app/components/blocks && echo "CHECK backend/route import" || echo "OK no backend/route imports"
# blocks compose only primitives/layout/blocks/view-models/fixtures/react/next
grep -rhoE "from ['\"][^'\"]+['\"]" app/components/blocks | sort -u
npm run lint:composition && echo "composition lint passes"
```

### Typed contracts (§5) — malformed VM rejected
```bash
npx tsc --noEmit 2>&1 | grep -E "components/blocks" && echo "CHECK type error in blocks" || echo "OK blocks type-clean"
printf 'import { GigCard } from "@/app/components/blocks";\nexport const X = <GigCard vm={{ title: "x" } as any} />;\n// @ts-expect-error planted: layout missing/invalid\nexport const Y = <GigCard vm={{ id:"1", title:"t", category:"design", tags:[], status:"open", budget:"1 ₽", deadlineDays:1, rating:{value:5,count:1,verified:true}, layout:"masonry" }} />;\n' > app/components/blocks/__typetest.tsx
npx tsc --noEmit 2>&1 | grep "__typetest" && echo "OK malformed VM rejected" || echo "CHECK malformed VM accepted"
rm -f app/components/blocks/__typetest.tsx
```

### Real assets (F4)
```bash
grep -rq "@/app/components/primitives" app/components/blocks && echo "OK blocks render icons via primitives/Icon"
grep -rqiE 'attach|residual' app/components/blocks/ChatPanel.tsx && echo "OK ChatPanel attach residual flagged"
grep -rqiE 'art|residual' app/components/blocks/BannerCard.tsx && echo "OK BannerCard art slot/residual flagged"
```

### All-variants render + build + suite
```bash
npx vitest run __tests__/unit/components/domain-blocks.test.tsx 2>&1 | tail -6
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
```

### Scope confirmation
```bash
git status --porcelain | grep -E 'MainNav|\(protected\)/layout.tsx' && echo "CHECK legacy/shell modified" || echo "OK legacy + shell untouched"
test -f app/components/blocks/DataTable.tsx && echo "CHECK admin block built (out of scope)" || echo "OK admin/mapping blocks deferred"
```

### Manual review
1. Render each block in every variant from fixtures; confirm composition from primitives + layout primitives only,
   token-pure, real assets.
2. Confirm GigCard 6 statuses × grid/list; ProfileCard full/compact; MessageBubble in/out; SidebarNav
   client/specialist × expanded/collapsed; FilterBar search-only/full.
3. Confirm each VM matches §5 and the banner `art` / `attach` residuals are flagged (not redrawn).
4. Confirm the automated F1 pixel-diff is deferred to `fidelity-harness`.
