# Implementation Tasks: domain-blocks

> **The phrases layer.** Implement `docs/DESIGN_SYSTEM_SPEC.md` §3.2 (17 blocks) + §5 (typed view-model contracts):
> domain composites under `app/components/blocks/`, each typed by its §5 VM, composed only from `ui-primitives`
> (`@/app/components/primitives`) + `layout-grammar` primitives (`@/app/components/layout`) + tokens (+ the §3.2
> sub-blocks), rendered from fixtures. Token-pure, controlled/presentational **blocks + contracts + fixtures + tests
> only** — no screens / shell cutover (Phase 2), no workbench (#8), no pixel gate (#9), no Phase 1 data, no
> admin/mapping blocks, no legacy removal. Automated F1 pixel-diff deferred; F2/F3/F4/F5 enforced now.
> Friction: medium.

---

## Task 1: [x] View-model contracts + scalar aliases + fixtures + barrel

**Implementation Notes:**
- Create `app/components/blocks/view-models.ts` with every block VM **verbatim from `DESIGN_SYSTEM_SPEC.md` §5**:
  `GigCardVM`, `ProfileHeaderVM`, `ProfileCardVM`, `ClientCardVM`, `StatPanelVM`, `RatingVM`, `SidebarNavVM`,
  `TopbarVM`, `FilterBarVM`, `MessageBubbleVM`, `ConversationItemVM`, `NotificationItemVM`, `MessagesPanelVM`,
  `ChatPanelVM`, `RequirementCardVM`, `CriteriaListVM`, `TermsTabsVM`, `ApplyPanelVM`, `BannerCardVM`.
- Define schema-independent scalar aliases: `type DateISO = string`, `type ImageRef = string`,
  `type IconRef = string` (an `ICON` key / asset path), `type Money = string` (pre-formatted display value, e.g.
  `"300 400 ₽"`), `StatVM`, `KeyVal`, `FilterOptVM` (`{ value, label, active?, count? }`), `FieldVM`
  (`{ name, label, placeholder?, required?, multiline? }`), `TermRow` (`{ label, value }`),
  `type NotifType = 'application' | 'status' | 'message'`. **Reuse** `Status`/`Category` from
  `@/app/components/primitives` (re-export from view-models for convenience).
- Create `app/components/blocks/fixtures.ts` — one typed sample VM per block **covering every variant axis** (e.g.
  `gigCardFixtures` = the 6 statuses × `{grid, list}`; `messageBubbleFixtures` = in/out; `sidebarNavFixtures` =
  client/specialist × expanded/collapsed). Pure data — **no** Prisma/server/`lib` imports.
- Create `app/components/blocks/index.ts` (barrel; fill in as blocks land).

**Test Plan:**
```bash
test -f app/components/blocks/view-models.ts && test -f app/components/blocks/fixtures.ts && echo "OK contracts + fixtures"
grep -cE 'VM(\b|\s*=|\s*\{)' app/components/blocks/view-models.ts | sed 's/^/VM aliases: /'
grep -rnE "from ['\"](@/lib|@/prisma|@/app/actions)" app/components/blocks/fixtures.ts && echo "CHECK backend import" || echo "OK fixtures backend-free"
```
Expected: all §5 VMs + scalar aliases defined; fixtures are pure data.

---

## Task 2: [x] Card blocks — ProfileCard, StatPanel, ClientCard, GigCard, BannerCard

**Implementation Notes:**
- **StatPanel** (`StatPanel.tsx`): `{single, grid}`; render `stats` as tiles (label `text-caption text-muted` +
  value `text-title font-title`) via `Grid`(grid) or `Stack`(single); optional Rating. (Build before ProfileCard.)
- **ProfileCard** (`ProfileCard.tsx`): `{full, compact}`. compact = `Avatar` + name (`text-title`) + `roleTag` +
  optional `Rating`. full (= ProfileHeader) = `Avatar size="lg"` + name + roleTag + verified + memberSince +
  `StatPanel`. Arrange with `Stack`/`Panel`.
- **ClientCard** (`ClientCard.tsx`): `Panel` + `Avatar` + name + `Rating` + `meta` (`KeyVal[]` rows).
- **GigCard** (`GigCard.tsx`): `status ×6 × {grid, list}`. `Panel radius="lg"` with a status accent
  (`border-t-4 border-status-{status}` via a static status→class map) composing `StatusBadge`, `CategoryTag`,
  `Tag`(s), `Rating`, budget (`font-mono text-mono`), deadline (`text-caption text-muted`), and a "К проекту"
  `Button`. `grid` = vertical `Stack`; `list` = horizontal row (`Stack axis="row"` / `Split`). `isCurrent` →
  `StatusBadge variant="current"`.
- **BannerCard** (`BannerCard.tsx`): `Panel` + headline (`text-display font-display`) + body + CTA `Button`
  (primary). `art` (raster residual §7.2) → render the `ImageRef` slot if present, else a token placeholder
  (`bg-brand-glow`); flag the residual in a comment (route to Figma, not redrawn).

**Test Plan:**
```bash
for b in StatPanel ProfileCard ClientCard GigCard BannerCard; do test -f "app/components/blocks/$b.tsx" && echo "OK $b"; done
grep -qE "grid|list" app/components/blocks/GigCard.tsx && grep -qE "status" app/components/blocks/GigCard.tsx && echo "GigCard layout+status axes"
grep -qiE "art|residual" app/components/blocks/BannerCard.tsx && echo "BannerCard art residual flagged"
grep -rEn '#[0-9a-fA-F]{3,8}\b|[0-9]+px' app/components/blocks/GigCard.tsx app/components/blocks/BannerCard.tsx && echo "CHECK literal" || echo "OK token-pure"
```
Expected: 5 card blocks render; GigCard 6 statuses × grid/list; token-pure; banner art slotted.

---

## Task 3: [x] Gig-detail blocks — RequirementCard, CriteriaList, TermsTabs, ApplyPanel

**Implementation Notes:**
- **RequirementCard** (`RequirementCard.tsx`): `Panel radius="lg"` + title (`text-title font-title`) + body
  (`text-body`) + optional `Icon` (from VM `icon`).
- **CriteriaList** (`CriteriaList.tsx`): `Stack` of rows; each row = an `Icon` (`verified` for `met`, a muted token
  dot for unmet) + label (`text-body`). (Dedicated check glyph, if any, is a future asset residual — noted.)
- **TermsTabs** (`TermsTabs.tsx`): `{proposed, client}` via the `Tabs` primitive (controlled `active`/`onSelect`) +
  the active tab's term rows (`Stack` of `TermRow` label/value).
- **ApplyPanel** (`ApplyPanel.tsx`): `Panel` + `fields` (`FieldVM[]` → `Input`, `multiline` → a token-styled
  `<textarea>` sharing the input base) + submit `Button` (`submitLabel`).

**Test Plan:**
```bash
for b in RequirementCard CriteriaList TermsTabs ApplyPanel; do test -f "app/components/blocks/$b.tsx" && echo "OK $b"; done
grep -qE "proposed|client" app/components/blocks/TermsTabs.tsx && echo "TermsTabs both tabs"
grep -rEn '#[0-9a-fA-F]{3,8}\b|[0-9]+px' app/components/blocks/RequirementCard.tsx app/components/blocks/CriteriaList.tsx app/components/blocks/TermsTabs.tsx app/components/blocks/ApplyPanel.tsx && echo "CHECK literal" || echo "OK token-pure"
```
Expected: 4 gig-detail blocks render their variants from fixtures; token-pure; composed from primitives.

---

## Task 4: [x] Messaging blocks — MessageBubble, ConversationItem, NotificationItem, MessagesPanel, ChatPanel

**Implementation Notes:**
- **MessageBubble** (`MessageBubble.tsx`): `{in, out}`. in = left, `bg-surface-level-2`; out = right,
  `bg-brand-default/10` (or brand tint). body + timestamp (`text-caption text-muted`) + optional readState.
- **ConversationItem** (`ConversationItem.tsx`): `{read, unread}`. `Avatar` + name + preview (`text-caption
  text-muted truncate`) + timestamp + unread count (a brand pill when `unread > 0`); unread → stronger weight.
- **NotificationItem** (`NotificationItem.tsx`): type icon via an internal `NotifType → ICON` map
  (`application→bell`, `status→star`, `message→chats` — all exported assets) + body + timestamp; read/unread.
- **MessagesPanel** (`MessagesPanel.tsx`): `{preview, full}`; composes a list of `ConversationItem` from
  `conversations` (preview = capped list).
- **ChatPanel** (`ChatPanel.tsx`): composes the `MessageBubble`·thread + a Composer (`Input` + send `Button`/`Icon`
  using `send` asset). `attach` (residual §7.5) → accessible fallback control (not a redrawn glyph), flagged when
  `composer.canAttach`.

**Test Plan:**
```bash
for b in MessageBubble ConversationItem NotificationItem MessagesPanel ChatPanel; do test -f "app/components/blocks/$b.tsx" && echo "OK $b"; done
grep -qE "in|out" app/components/blocks/MessageBubble.tsx && echo "MessageBubble direction axis"
grep -qiE "attach|residual" app/components/blocks/ChatPanel.tsx && echo "ChatPanel attach residual flagged"
grep -qE "ConversationItem" app/components/blocks/MessagesPanel.tsx && echo "MessagesPanel composes ConversationItem"
```
Expected: 5 messaging blocks; MessagesPanel·ConversationItem + ChatPanel·MessageBubble sub-composition; attach
residual flagged; token-pure.

---

## Task 5: [x] Shell blocks — SidebarNav, Topbar, FilterBar

**Implementation Notes:**
- **SidebarNav** (`SidebarNav.tsx`): role `{client, specialist}` × `{expanded, collapsed}`. expanded = `Stack` with
  logo (`<Icon src="/assets/design-system/brand/gigly-logo.svg" alt="Gigly" />`), NavMenuItem rows (internal: `Icon`
  + label + optional count, active state via `bg-surface-level-3`/brand accent), `ProfileCard`, a SupportCard
  sub-piece (internal: help + `Input` + send), and a LogoutControl (internal). collapsed = the `Rail` layout
  primitive with icon-only NavMenuItems (per `DESIGN_SPECS.md` §5 icon-rail). Items come from the VM (role-driven).
- **Topbar** (`Topbar.tsx`): `ProfileCard` (compact/avatar) + bell `Icon` (with `unreadNotifications` badge) + gear
  `Icon`.
- **FilterBar** (`FilterBar.tsx`): `{search-only, full}`. search-only = `SearchInput`; full = `SearchInput` +
  `Filter`/`Select` (from `filters`) + `ViewToggle` (`view`). Arrange with `Stack axis="row"` / `Split`.

**Test Plan:**
```bash
for b in SidebarNav Topbar FilterBar; do test -f "app/components/blocks/$b.tsx" && echo "OK $b"; done
grep -qE "collapsed|expanded" app/components/blocks/SidebarNav.tsx && echo "SidebarNav both states"
grep -qE "ProfileCard" app/components/blocks/Topbar.tsx && echo "Topbar composes ProfileCard"
grep -qE "SearchInput|ViewToggle" app/components/blocks/FilterBar.tsx && echo "FilterBar composes primitives"
```
Expected: 3 shell blocks; SidebarNav expanded+collapsed (Rail) × role; Topbar/SidebarNav compose ProfileCard;
token-pure.

---

## Task 6: [x] Barrel + render tests (all variants) + typed-contract rejection

**Implementation Notes:**
- Complete `app/components/blocks/index.ts` re-exporting all 17 blocks + the public VM types.
- Add `__tests__/unit/components/domain-blocks.test.tsx` (jsdom) following the convention
  (`__tests__/unit/components/ui-primitives.test.tsx`). For **each block**, render **every variant** from
  `fixtures.ts` and assert the composed primitives/tokens/assets (e.g. GigCard loop over the 6 statuses × grid/list
  → asserts `status-{s}` + a "К проекту" button; MessageBubble in vs out alignment; ConversationItem unread badge;
  SidebarNav collapsed → rail width `w-12`; MessagesPanel renders N ConversationItems; ChatPanel renders the thread
  + composer).
- Prove the typed contract rejects malformed VMs: a planted `__typetest.tsx` with an invalid `GigCardVM`
  (`layout:"masonry"` / missing `status`) + `tsc --noEmit` grep for the planted file (per the spec Test Plan).

**Test Plan:**
```bash
test -f app/components/blocks/index.ts && echo "barrel present"
npx vitest run __tests__/unit/components/domain-blocks.test.tsx 2>&1 | tail -8
# typed-contract rejection (plant → expect failure → revert)
printf 'import { GigCard } from "@/app/components/blocks";\nexport const X = <GigCard vm={{ id:"1", title:"t", category:"design", tags:[], status:"open", budget:"1 ₽", deadlineDays:1, rating:{value:5,count:1,verified:true}, layout:"masonry" }} />;\n' > app/components/blocks/__typetest.tsx
npx tsc --noEmit 2>&1 | grep "__typetest" && echo "OK malformed VM rejected" || echo "CHECK accepted"
rm -f app/components/blocks/__typetest.tsx
```
Expected: render tests cover every block × variant and pass; malformed VM fails `tsc`.

---

## Task 7: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec delta's Test Plan (blocks/contracts/fixtures present, token-purity
  with unchanged baseline, import-discipline/no-backend, typed-contract rejection, real assets, all-variants render,
  composition lint, build, unit suite).
- Confirm scope discipline: **blocks + contracts + fixtures + tests only** — no screen composition / shell cutover
  (`app/(protected)/layout.tsx` unchanged), no workbench/pixel gate, no Phase 1 models, no admin/mapping blocks
  (`DataTable.tsx` etc. absent), no legacy edits (`MainNav` unchanged). F1 automated pixel-diff deferred.

**Test Plan:**
```bash
npm run lint:tokens && echo "token-purity passes"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "baseline unchanged" || echo "CHECK baseline grew"
grep -rnE "from ['\"](@/app/\(|@/app/actions|@/lib|@/prisma|next/server)" app/components/blocks && echo "CHECK backend/route import" || echo "OK no backend/route imports"
npm run lint:composition && echo "composition lint passes"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
git status --porcelain | grep -E 'MainNav|\(protected\)/layout.tsx' && echo "CHECK legacy/shell modified" || echo "OK legacy + shell untouched"
test -f app/components/blocks/DataTable.tsx && echo "CHECK admin block (out of scope)" || echo "OK admin/mapping deferred"
```
Expected: all gates green; baseline unchanged; no backend imports; legacy + shell untouched; admin blocks deferred;
F1 deferred to `fidelity-harness`.

---

## Summary

Total tasks: 7
Estimated effort: 8–12 hours (friction: medium — 17 composites, but grounded in the existing primitives, layout
grammar, tokens, and §5 contracts)

**Deliverables:**
- ✅ `view-models.ts` (§5 typed contracts + scalar aliases) + `fixtures.ts` (one typed VM per block/variant) +
  `index.ts` barrel.
- ✅ 17 blocks under `app/components/blocks/` — GigCard (6×grid/list), ProfileCard (full/compact), ClientCard,
  BannerCard, StatPanel, RequirementCard, CriteriaList, TermsTabs, ApplyPanel, MessageBubble, ConversationItem,
  NotificationItem, MessagesPanel, ChatPanel, SidebarNav, Topbar, FilterBar — token-pure, composed from primitives +
  layout + §3.2 sub-blocks, real assets (F4).
- ✅ `__tests__/unit/components/domain-blocks.test.tsx` (all-variants render) + typed-contract rejection.
- ✅ F2 (token-purity, unchanged baseline) + F3 (all variants render) + F4 (real assets) + F5 (composition purity)
  enforced; F1 automated pixel-diff deferred to `fidelity-harness`.

**Critical path:** contracts + fixtures (1) → cards incl. ProfileCard/StatPanel (2) → gig-detail (3) → messaging
leaves → panels (4) → shell blocks compose ProfileCard (5) → barrel + tests (6) → acceptance (7).

**Scope guards (non-goals):**
- No screen composition / shell cutover (Phase 2); no workbench (#8); no pixel gate (#9); no Phase 1 data models; no
  admin/mapping blocks (§3.2 second table); no new tokens/primitives; no redrawn residual assets (banner raster,
  `attach`); no legacy removal.

**Success criteria:**
- ✅ 17 blocks exist, typed by §5 VMs, render every §3.2 variant from fixtures (GigCard 6×grid/list)
- ✅ Contracts type-check (malformed VM fails `tsc`); blocks import no backend; token-pure (baseline unchanged)
- ✅ `npm run build` + `test:unit` + `lint:tokens` + `lint:composition` green; legacy + shell untouched; F1 deferred
