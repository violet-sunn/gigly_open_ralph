# Implementation Tasks: ui-primitives

> **The vocabulary layer.** Implement `docs/DESIGN_SYSTEM_SPEC.md` §3.1: the 16 variant-driven primitives with
> typed `variant`/`state`/`size` props, token-pure, covering every library state (`docs/DESIGN_SPECS.md` §4), built
> to the measured geometry (§5). Token-pure, controlled/presentational **components + tests only** — no domain
> blocks (`domain-blocks`), no screen composition / shell cutover (Phase 2), no legacy removal. Automated F1
> pixel-diff deferred to `fidelity-harness`; F2/F3/F4/F5 enforced now. Friction: low.

---

## Task 1: [x] Build the primitive token map (`tokens.ts`)

**Implementation Notes:**
- Create `app/components/primitives/tokens.ts` with static `variant → canonical-token Tailwind class` lookup tables,
  mirroring `app/components/layout/scale.ts` (literal strings so Tailwind's JIT emits them). Reuse/duplicate `cx`.
  Include at least:
  - **Button** variant map: `primary` → `bg-brand-default text-inverse hover:bg-brand-hover active:bg-brand-pressed`;
    `secondary` → `bg-surface-level-2 text-strong border border-border`; `ghost` → `bg-transparent text-strong`;
    `link` → `bg-transparent text-brand-default underline`. Disabled handled via `disabled:opacity-disabled`.
  - **Status** colour maps (6): `STATUS_BG`/`STATUS_TEXT`/`STATUS_DOT` keyed `open|review|in-progress|verification|
    completed|rejected` → `bg-status-*` / `text-status-*`.
  - **Category** accent map (5): `marketing|design|programming|development|coding` → `bg-category-*` (left accent).
  - **Tag** colour-variant set: the 5 `category-*` colours (filled tech tags).
  - Control geometry: `h-control` (40px), `rounded-md`; ProgressBar `h-1`(4px)/`rounded-xs`; avatar sizes
    `w-avatar-sm h-avatar-sm` / `w-avatar-lg h-avatar-lg` + `rounded-circular`; icon `w-icon h-icon`.
  - Typed unions: `ButtonVariant`, `ControlState`, `Status`, `Category`, `AvatarSize`, `TagColor`, etc.
- **No raw hex/px.** For `brand/subtle` tints use a Tailwind opacity modifier on the token (`bg-brand-default/…`) or
  the `opacity/subtle` token — never `rgba()`.

**Test Plan:**
```bash
test -f app/components/primitives/tokens.ts && echo "OK tokens.ts"
grep -rEn '#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(|[0-9]+px' app/components/primitives/tokens.ts && echo "CHECK raw literal" || echo "OK token-pure"
```
Expected: static maps of canonical token classes + typed unions; zero raw literals.

---

## Task 2: [x] Button primitive (all variants + states)

**Implementation Notes:**
- Create `app/components/primitives/Button.tsx`: typed `variant: 'primary'|'secondary'|'ghost'|'link'`,
  `size?: 'md'` (40h via `h-control`), `disabled?: boolean`; forward `onClick`, `type`, `children`, `aria-*`.
  `default/hover/pressed` via CSS pseudo-classes (`hover:`/`active:`), `disabled` via the `disabled:` utilities +
  `opacity-disabled`. Geometry per `DESIGN_SPECS.md` §5 ("К проекту" 99×40, `radius/md`). Token-pure (Task 1 map).

**Test Plan:**
```bash
grep -qE "primary|secondary|ghost|link" app/components/primitives/Button.tsx && echo "variants present"
grep -qE "h-control|rounded-md" app/components/primitives/Button.tsx && echo "control geometry"
```
Expected: Button renders all four variants; default/hover/pressed/disabled; 40h, `radius/md`; token-pure.

---

## Task 3: [x] Text-input family: Input, PasswordInput, SearchInput

**Implementation Notes:**
- **Input** (`Input.tsx`): typed `state: 'default'|'focus'|'filled'|'disabled'|'error'`, `size?: 'md'` (40h);
  `bg-surface-level-2`, `border border-border`, `rounded-md`, `text-body`; focus → `focus-visible:ring-2
  ring-brand-default`; error → `border-status-rejected`; disabled → `opacity-disabled`. Forward `value`,
  `onChange`, `placeholder`, `name`, `aria-*`.
- **PasswordInput** (`PasswordInput.tsx`): wraps Input, adds a reveal control toggling `type=password|text` with a
  `revealed` state. The `eye` glyph is a residual (`DESIGN_SPECS.md` §7.5) → ship an accessible **text/label
  fallback** (e.g. "Показать"/"Скрыть" with `aria-pressed`), flag the residual in a comment. (`"use client"` if it
  owns the toggle, or accept `revealed`/`onToggleReveal` as controlled props.)
- **SearchInput** (`SearchInput.tsx`): Input + `search.svg` icon inset 12px left (`pl-*`, icon `w-icon`) + `clear.svg`
  ✕ 16×16 right; `state: 'default'|'focus'|'filled'`; full-width (the 800px is layout-controlled). Use exported
  assets (F4) via `next/image` or `<img>`.

**Test Plan:**
```bash
for p in Input PasswordInput SearchInput; do test -f "app/components/primitives/$p.tsx" && echo "OK $p"; done
grep -qE "icons/(search|clear)" app/components/primitives/SearchInput.tsx && echo "search uses exported assets"
grep -qiE "eye|residual|показать|скрыть" app/components/primitives/PasswordInput.tsx && echo "reveal fallback/flag"
```
Expected: Input renders all 5 states; PasswordInput adds `revealed` with accessible fallback; SearchInput uses real
search/clear assets; token-pure.

---

## Task 4: [x] Selection controls: Select, Radio, Filter, Toggle

**Implementation Notes:**
- **Select** (`Select.tsx`, Select/FilterDropdown): typed `state: 'collapsed'|'expanded'|'disabled'`; option
  `default|hover|selected` (hover → `surface/level-3-hover`, selected → `brand` tint via opacity modifier). 106×40
  (`h-control`), `radius/md`. Controlled (`expanded`, `onToggle`, `value`, `options`).
- **Radio** (`Radio.tsx`): typed `state: 'off'|'hover'|'on'|'disabled'`; uses `radio-off.svg`/`radio-on.svg`
  assets (`w-icon`); accessible `role="radio"`/`aria-checked`.
- **Filter** (`Filter.tsx`): the FilterRadio row = Radio + label as a selectable filter option; same
  `off|hover|on|disabled` states (composes Radio).
- **Toggle** (`Toggle.tsx`): `switch` with track + knob; `state: 'off'|'on'|'disabled'`; track `bg-surface-*`→
  `bg-brand-default` on, knob via `size/*`; `role="switch"`/`aria-checked`.
- All token-pure; controlled (state as prop + optional callback).

**Test Plan:**
```bash
for p in Select Radio Filter Toggle; do test -f "app/components/primitives/$p.tsx" && echo "OK $p"; done
grep -qE "icons/radio-(off|on)" app/components/primitives/Radio.tsx && echo "radio uses exported assets"
grep -qE "collapsed|expanded" app/components/primitives/Select.tsx && echo "select states"
```
Expected: Select (collapsed/expanded/disabled + option states), Radio & Filter (off/hover/on/disabled with real
assets), Toggle (off/on/disabled); token-pure.

---

## Task 5: [x] Navigation & indicators: Tabs, ViewToggle, ProgressBar

**Implementation Notes:**
- **Tabs** (`Tabs.tsx`): `variant: 'underline'`; tab `default` (`text-muted`) / `active` (`text-strong` +
  `border-b-2 border-brand-default` accent); optional `count` badge per tab. Controlled (`active`, `onSelect`,
  `tabs: {label, count?}[]`).
- **ViewToggle** (`ViewToggle.tsx`): grid/list, 60×32, two 24px glyphs from `grid.svg`/`list.svg`; `state:
  'grid-active'|'list-active'` (active glyph `text-strong`/brand, inactive `text-muted`); `onChange('grid'|'list')`.
- **ProgressBar** (`ProgressBar.tsx`): track + fill, `h-1` (4px), `rounded-xs`; track `bg-text-subtle`, fill
  `bg-brand-default` width = `value` (0–100, via inline `style={{ width: ` + percentage + `%` }}` — a **percentage**,
  not a px literal, so token-pure); `role="progressbar"` + `aria-valuenow/min/max`.

**Test Plan:**
```bash
for p in Tabs ViewToggle ProgressBar; do test -f "app/components/primitives/$p.tsx" && echo "OK $p"; done
grep -qE "icons/(grid|list)" app/components/primitives/ViewToggle.tsx && echo "view-toggle uses exported assets"
grep -qE "bg-brand-default" app/components/primitives/ProgressBar.tsx && echo "progress fill token"
grep -qE "[0-9]+px" app/components/primitives/ProgressBar.tsx && echo "CHECK px literal" || echo "OK no px (percentage width)"
```
Expected: Tabs (default/active + count), ViewToggle (grid/list active with real assets), ProgressBar (token track/
fill, percentage width); token-pure.

---

## Task 6: [x] Data display: Tag, CategoryTag, StatusBadge/Dot, Avatar, Rating

**Implementation Notes:**
- **Tag** (`Tag.tsx`): filled tech tag, `size: 'sm'` (`radius/sm`), colour-variant set = the 5 `category-*` colours
  (typed `TagColor`); `text/caption`/`text/label`.
- **CategoryTag** (`CategoryTag.tsx`): 5 category variants with a **left accent** bar in `category-*` (60×23);
  typed `category: Category`.
- **StatusBadge** (`StatusBadge.tsx`): 6 status variants; `variant: 'pill'` (126×40, `h-control`, `rounded-pill`,
  `bg-status-*`/tinted) | `'inline-dot'` (8px dot from `status-dot.svg` tinted via `currentColor` = `text-status-*`)
  | a "Текущий" current badge. Typed `status: Status`.
- **Avatar** (`Avatar.tsx`): `circular`, `size: 'sm'`(24)/'lg'(32) via `avatar-*` tokens + `rounded-circular`;
  `online?: boolean` overlay dot (`status-completed`); image via exported/passed `src`, `alt`.
- **Rating** (`Rating.tsx`): avatar + `verified.svg` + ★×5 (`star.svg`) + count + experience tag (ExperienceTag
  folded in: a labelled pill, `radius/pill`); `online?`. Token-pure; uses exported star/verified assets.

**Test Plan:**
```bash
for p in Tag CategoryTag StatusBadge Avatar Rating; do test -f "app/components/primitives/$p.tsx" && echo "OK $p"; done
grep -qE "icons/(star|verified)" app/components/primitives/Rating.tsx && echo "rating uses exported assets"
grep -qE "bg-status-|text-status-" app/components/primitives/StatusBadge.tsx && echo "status tokens"
grep -qE "rounded-circular|avatar-(sm|lg)" app/components/primitives/Avatar.tsx && echo "avatar geometry"
```
Expected: Tag (5 colours), CategoryTag (5 left-accent), StatusBadge (6 × pill/dot/current), Avatar (sm/lg +
online), Rating (avatar+verified+stars+count+exp tag + online); token-pure with real assets.

---

## Task 7: [x] Barrel + render tests (all states) + typed-rejection check

**Implementation Notes:**
- Add `app/components/primitives/index.ts` re-exporting all 16 primitives + the public types.
- Add `__tests__/unit/components/ui-primitives.test.tsx` (jsdom) following the existing convention
  (`__tests__/unit/components/layout-grammar.test.tsx`: `@testing-library/react`, `@testing-library/jest-dom/vitest`,
  `@/` alias; mock `next/image`/`next/link` if used). For **each primitive**, render **every** documented
  variant/state/size and assert the expected token utility / asset (e.g. Button `primary` → `bg-brand-default`;
  Input `error` → `border-status-rejected`; StatusBadge `review` → `status-review`; ProgressBar value=50 →
  `bg-brand-default` + `aria-valuenow="50"`; Avatar `lg` → `w-avatar-lg`; ViewToggle `list-active`).
- Prove the typed API rejects off-system values: either a `*.test-d.tsx` with `// @ts-expect-error` on
  `<Button variant="purple" />`, or document the planted-value + `tsc --noEmit` check from the spec Test Plan.

**Test Plan:**
```bash
test -f app/components/primitives/index.ts && echo "barrel present"
npx vitest run __tests__/unit/components/ui-primitives.test.tsx 2>&1 | tail -8
# typed rejection (plant → expect failure → revert)
printf 'import {Button} from "@/app/components/primitives";\nexport const X = <Button variant="purple" />;\n' > app/components/primitives/__typetest.tsx
npx tsc --noEmit && echo "CHECK off-system accepted" || echo "OK off-system rejected"
rm -f app/components/primitives/__typetest.tsx
```
Expected: render tests cover every state of all 16 primitives and pass; off-system prop value fails `tsc`.

---

## Task 8: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec delta's Test Plan (primitives present, token-purity with unchanged
  baseline, typed rejection, real assets, render tests, composition lint, build, unit suite).
- Confirm scope discipline: **components + tests only** — no domain blocks (`app/components/blocks/` absent or
  untouched), no screen composition / shell cutover (`app/(protected)/layout.tsx` unchanged), no legacy edits
  (`app/components/ui/*`, `app/components/auth/*`, `MainNav`, `LoadingButton` unchanged). F1 automated pixel-diff
  deferred; F2/F3/F4/F5 enforced.

**Test Plan:**
```bash
npm run lint:tokens && echo "token-purity passes"
git diff --quiet scripts/design-system/token-purity-baseline.json && echo "baseline unchanged" || echo "CHECK baseline grew"
npm run lint:composition && echo "composition lint passes"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
git status --porcelain | grep -E 'components/(ui|auth)/|MainNav|LoadingButton|\(protected\)/layout.tsx' && echo "CHECK legacy/shell modified" || echo "OK legacy + shell untouched"
```
Expected: all gates green; baseline unchanged; legacy + shell untouched; the five requirements satisfied; F1
deferred to `fidelity-harness`.

---

## Summary

Total tasks: 8
Estimated effort: 5–8 hours (friction: low — grounded in existing tokens, assets, and the layout-grammar pattern)

**Deliverables:**
- ✅ `app/components/primitives/tokens.ts` — variant→canonical-token static maps + typed unions + `cx`.
- ✅ 16 primitives under `app/components/primitives/` (Button, Input, PasswordInput, SearchInput, Select, Radio,
  Filter, Tabs, Toggle, Tag, CategoryTag, StatusBadge/Dot, Avatar, Rating, ViewToggle, ProgressBar) — typed
  variant/state/size, token-pure, every library state, built to §5 geometry, real assets (F4).
- ✅ `index.ts` barrel + `__tests__/unit/components/ui-primitives.test.tsx` (all-states render) + typed-rejection check.
- ✅ F2 (token-purity, unchanged baseline) + F3 (all states render) + F4 (real assets) + F5 (composition-leaf
  purity) enforced; F1 automated pixel-diff deferred to `fidelity-harness`.

**Critical path:** token map (1) → Button (2) → input family (3) → selection controls (4) → nav/indicators (5) →
data display (6) → barrel + tests (7) → acceptance (8).

**Scope guards (non-goals):**
- No domain blocks (`domain-blocks`); no screen composition / shell cutover (Phase 2); no legacy removal; no new
  tokens; no redrawn residual icons (`eye`/`attach`); no automated pixel-fidelity gate (`fidelity-harness`).

**Success criteria:**
- ✅ 16 typed, variant-driven primitives exist, render every library state, token-pure (no new baseline)
- ✅ Typed API rejects off-system values (`tsc` fails on a planted value); icon primitives use exported assets
- ✅ `npm run build` + `test:unit` + `lint:tokens` + `lint:composition` green; legacy + shell untouched; F1 deferred
