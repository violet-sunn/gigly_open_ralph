# Implementation Tasks: layout-grammar

> **The syntax layer.** Implement `docs/DESIGN_SYSTEM_SPEC.md` §4: the `AppShell` + `AuthLayout` page templates,
> the content layout primitives (Stack/Grid/Split/Section/Panel/Rail) on the canonical token scale, and the
> screen-composition rule + `lint:composition`. Token-pure, presentational **components + a lint only** — no shell
> cutover (`compose-shell-cutover`), no domain blocks (`domain-blocks`), no primitives (`ui-primitives`), no real
> screens (Phase 2). Templates proven with **placeholder** blocks. F1 pixel-diff deferred to `fidelity-harness`.
> Friction: medium.

---

## Task 1: [x] Build the content layout primitives (token-pure)

**Implementation Notes:**
- Create `app/components/layout/{Stack,Grid,Split,Section,Panel,Rail}.tsx` as presentational components (no client
  hooks; server-safe). Axes per `DESIGN_SYSTEM_SPEC.md` §4.2:
  - **Stack** — `axis: 'row'|'column'`, `gap` → `space/*`; flex.
  - **Grid** — `columns: number`, `gap` → `space/*`; CSS grid.
  - **Split** — two-pane `ratio` + `gap` → `space/*`.
  - **Section** — `title?` + `gap` → `space/*` (titled region).
  - **Panel** — `surface` → `surface/*`, `radius` → `radius/*`, `padding` → `space/*` (bounded container).
  - **Rail** — narrow icon column, width from `size/icon-rail`.
- Express **all** spacing/radius/surface via canonical token Tailwind utilities (`gap-*`, `p-*`, `rounded-*`,
  `bg-surface-*`) — **no raw px, no off-token literals**. Map a small fixed set of `gap`/`columns` props to static
  utility classes (avoid dynamic class strings Tailwind can't see).

**Test Plan:**
```bash
for p in Stack Grid Split Section Panel Rail; do test -f "app/components/layout/$p.tsx" && echo "OK $p"; done
grep -rEn '#[0-9a-fA-F]{6}|[0-9]+px' app/components/layout && echo "CHECK raw literal" || echo "OK no raw literals"
```
Expected: six primitives render children with documented axes; output is token-pure.

---

## Task 2: [x] Build the AppShell template (expanded + collapsed)

**Implementation Notes:**
- Create `app/components/templates/AppShell.tsx` exposing `sidebar`, `topbar` slot props + content `children`, and
  a `collapsed?: boolean` (or `sidebarState: 'expanded'|'collapsed'`) prop.
- Layout: sidebar column (full width when expanded; `Rail` at `size/icon-rail` width when collapsed) + a main
  column with the topbar slot above the content region. Compose from the layout primitives; surfaces via
  `surface/*` tokens. **Do not** import SidebarNav/Topbar — they are slot props (placeholders for now).
- Per `docs/DESIGN_SPECS.md` §5: control/topbar height 40px, rail icon 20px (use size tokens).

**Test Plan:**
```bash
grep -qiE 'collapsed|expanded' app/components/templates/AppShell.tsx && echo "states present"
grep -qE 'sidebar|topbar|children' app/components/templates/AppShell.tsx && echo "slots present"
```
Expected: AppShell renders sidebar/topbar/content; expanded + collapsed states; blocks as slots.

---

## Task 3: [x] Build the AuthLayout template

**Implementation Notes:**
- Create `app/components/templates/AuthLayout.tsx`: a centered `card` region (Panel on `surface/*` + `radius/*`)
  for `children`, with a checkerboard `footer` using `public/assets/design-system/patterns/checkerboard.svg`
  (`<img>`/background, `aria-hidden`). Used later by `auth`/`reg`/`reg-customer`/`reg-specialist`.
- Token-pure; no raw px.

**Test Plan:**
```bash
test -f app/components/templates/AuthLayout.tsx && echo "AuthLayout present"
grep -qi 'checkerboard' app/components/templates/AuthLayout.tsx && echo "checkerboard footer"
```
Expected: AuthLayout renders centered card + checkerboard footer, token-pure.

---

## Task 4: [x] Implement the composition lint (`lint:composition`)

**Implementation Notes:**
- Create `scripts/design-system/validate-composition.js` enforcing: a **composed screen** (a `.tsx` file marked
  with a top-of-file `@composed-screen` comment) MUST import only from an allowlist
  (`@/app/components/templates/*`, `.../blocks/*`, `.../layout/*`, `.../primitives/*`, `react`, `next/*`, and
  data/view-model modules) AND MUST NOT contain `style=` attributes, off-token `className` styling, or raw
  structural markup (e.g. `<div className=…>`). Report file + reason; exit non-zero on violation.
- Scope to opt-in marked files so existing pre-redesign pages are not flagged (none are composed yet → passes
  vacuously). Document that Phase 2 screens carry the marker and a later change widens scope to all `page.tsx`
  after `compose-shell-cutover`.
- Add `"lint:composition": "node scripts/design-system/validate-composition.js"` to `package.json`.

**Test Plan:**
```bash
npm run lint:composition && echo "passes current tree (no composed screens)"
mkdir -p app/__compotest
printf '/* @composed-screen */\nimport x from "foo";\nexport default function S(){return <div className="p-4" style={{color:"red"}}>raw</div>;}\n' > app/__compotest/page.tsx
npm run lint:composition && echo "CHECK missed" || echo "OK fails on raw-markup screen"
rm -rf app/__compotest
```
Expected: lint passes the current tree + a compliant sample; fails a planted raw-markup screen, naming it.

---

## Task 5: [x] Render tests + verification (F2/F5 now, F1 deferred)

**Implementation Notes:**
- Add `__tests__/unit/layout-grammar.test.tsx` (jsdom) asserting: `AppShell` renders sidebar/topbar/content in
  both expanded and collapsed states; `AuthLayout` renders card + checkerboard; each layout primitive renders its
  children. Follow the existing render-test convention (`@vitest-environment jsdom`, `@testing-library/react`,
  `@/` alias, mock `next/link`/`next/image` if used).
- Confirm `npm run lint:tokens` still passes (new components are token-pure). Note that F1 pixel fidelity-diff on
  the empty shell is **deferred to `fidelity-harness`** (#9); this change covers structure (render) + F2 + F5.

**Test Plan:**
```bash
npx vitest run __tests__/unit/layout-grammar.test.tsx 2>&1 | tail -6
npm run lint:tokens 2>&1 | tail -1
```
Expected: render tests pass; token-purity holds.

---

## Task 6: [x] Full acceptance run + scope confirmation

**Implementation Notes:**
- Run the full deterministic suite from the spec delta's Test Plan (components present, token-purity, composition
  lint both directions, build, unit suite).
- Confirm scope discipline: components + lint only — **no** shell cutover (`app/(protected)/layout.tsx`
  unchanged), **no** domain blocks/primitives, **no** real screens. F1 deferred; F2/F5 enforced.

**Test Plan:**
```bash
npm run lint:tokens && echo "token-purity passes"
npm run lint:composition && echo "composition lint passes"
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
git status --porcelain | grep -q 'app/(protected)/layout.tsx' && echo "CHECK shell modified" || echo "OK shell untouched"
```
Expected: all gates green; shell untouched; four requirements satisfied; F1 deferred to fidelity-harness.

---

## Summary

Total tasks: 6
Estimated effort: 4–6 hours (friction: medium)

**Deliverables:**
- ✅ `AppShell` (expanded + collapsed; sidebar/topbar/content slots) + `AuthLayout` (card + checkerboard footer)
  templates under `app/components/templates/`.
- ✅ `Stack`/`Grid`/`Split`/`Section`/`Panel`/`Rail` layout primitives under `app/components/layout/`, token-pure.
- ✅ `lint:composition` enforcing the composition-only rule (opt-in `@composed-screen` scope; fails raw markup).
- ✅ Render tests; F2 (token-purity) + F5 (composition) enforced; F1 pixel-diff deferred to `fidelity-harness`.

**Critical path:** primitives (1) → AppShell (2) → AuthLayout (3) → composition lint (4) → render tests (5) →
acceptance (6).

**Scope guards (non-goals):**
- No shell cutover (`compose-shell-cutover`); no domain blocks (`domain-blocks`); no primitives (`ui-primitives`);
  no real screen composition (Phase 2); no pixel fidelity gate (`fidelity-harness`).

**Success criteria:**
- ✅ Templates + primitives exist, render with placeholders, token-pure
- ✅ Composition lint passes the tree + compliant sample, fails planted raw markup
- ✅ `npm run build` + `test:unit` + `lint:tokens` + `lint:composition` green; F1 deferred
