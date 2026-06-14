# UI Specification Delta: layout-grammar

This document contains specification changes for the `layout-grammar` change.

Scope note: these requirements implement the **layout grammar** from `docs/DESIGN_SYSTEM_SPEC.md` §4 — the
`AppShell` and `AuthLayout` page templates, the content layout primitives (Stack/Grid/Split/Section/Panel/Rail) on
the canonical spacing/token scale, and the screen-composition rule + composition lint. They ship **token-pure,
presentational components + a lint only**. They do **not** cut over the live shell (`compose-shell-cutover`), build
domain blocks (`domain-blocks`) or primitives (`ui-primitives`), or compose real screens (Phase 2) — templates are
proven with **placeholder** blocks. F1 pixel-fidelity is deferred to `fidelity-harness`; F2 (token-purity) and F5
(composition-only) are enforced here.

---

## ADDED Requirements

### Requirement: Page Templates (AppShell and AuthLayout)
The layout grammar MUST provide an `AppShell` template (sidebar slot + topbar slot + content region; expanded and
collapsed sidebar states) and an `AuthLayout` template (centered card region + checkerboard footer), per
`docs/DESIGN_SYSTEM_SPEC.md` §4.1. Templates accept blocks as slots; they do not build the blocks.

#### Scenario: AppShell exposes slots and both sidebar states
- GIVEN the `AppShell` template
- WHEN it is rendered with placeholder `sidebar`, `topbar`, and content
- THEN it MUST render all three regions (sidebar slot, topbar slot, content region)
- AND it MUST support a sidebar `expanded` state and a `collapsed` (icon-rail) state, selectable via a prop
- AND the collapsed state MUST present the sidebar as a narrow rail (icon-rail width per `docs/DESIGN_SPECS.md` §5)

#### Scenario: AuthLayout exposes a centered card + checkerboard footer
- GIVEN the `AuthLayout` template
- WHEN it is rendered with placeholder card content
- THEN it MUST render a centered card region
- AND it MUST render a checkerboard footer using `public/assets/design-system/patterns/checkerboard.svg`

#### Scenario: Templates take blocks as slots, not built-in
- GIVEN the templates
- WHEN their props are inspected
- THEN `AppShell` MUST accept `sidebar` and `topbar` (and content/children) as slot props rather than importing
  concrete SidebarNav/Topbar blocks
- AND the templates MUST render with placeholder blocks (the real blocks arrive in `domain-blocks`)

**Acceptance Criteria:**
- `AppShell` renders sidebar/topbar/content with expanded + collapsed states; `AuthLayout` renders card + checkerboard footer
- Templates accept blocks as slot props and render with placeholders

---

### Requirement: Content Layout Primitives on the Canonical Scale
The grammar MUST provide the content layout primitives `Stack`, `Grid`, `Split`, `Section`, `Panel`, and `Rail`,
each expressing spacing/radius/surface **only via canonical tokens** (no raw px / off-token literals).

#### Scenario: All six primitives exist and render
- GIVEN the change is implemented
- WHEN the layout primitives are rendered with children
- THEN `Stack` (axis + gap), `Grid` (columns + gap), `Split` (two-pane ratio + gap), `Section` (title + gap),
  `Panel` (surface + radius + padding), and `Rail` (narrow icon column) MUST each render their children
- AND each MUST expose the axes named in `docs/DESIGN_SYSTEM_SPEC.md` §4.2

#### Scenario: Primitives are token-pure
- GIVEN the rendered primitive output
- WHEN its classes/styles are inspected
- THEN spacing MUST be expressed via the canonical `space/*` scale (Tailwind token utilities), radius via
  `radius/*`, and surface via `surface/*` — with no raw px or off-token colour literal
- AND `npm run lint:tokens` MUST still pass with these components in `app/`

#### Scenario: Spacing flows from the token scale
- GIVEN a primitive's `gap`/`padding` prop
- WHEN it maps to output
- THEN the value MUST resolve to a canonical spacing token (e.g. `gap` → `space/*`), not a hardcoded pixel value

**Acceptance Criteria:**
- Stack/Grid/Split/Section/Panel/Rail exist and render children with their documented axes
- Output is token-pure (space/radius/surface tokens only); `lint:tokens` passes

---

### Requirement: Screen-Composition Pattern and Composition Lint
The change MUST encode the rule that a screen = Template + slotted Blocks + data bindings (composition-only: no
styling, no layout literals, no raw markup) and MUST enforce it with a composition lint.

#### Scenario: Composition rule is documented and lint exists
- GIVEN the change is implemented
- WHEN the repo is inspected
- THEN there MUST be a `lint:composition` script (e.g. `scripts/design-system/validate-composition.js`)
- AND it MUST encode the rule: a composed screen imports only from templates/blocks/primitives/data and contains
  no `style=` attributes, no off-token `className` styling, and no raw structural markup

#### Scenario: Lint fails on a raw-markup screen
- GIVEN a planted composed-screen file containing raw styled markup (e.g. `<div className="p-4" style={{…}}>` or a
  disallowed import)
- WHEN `lint:composition` runs
- THEN it MUST report the violation and exit non-zero (fail)
- AND the message MUST identify the offending file and reason

#### Scenario: Lint passes compliant screens and does not block existing pages
- GIVEN composed screens are identified by opt-in (a `@composed-screen` marker) and none exist yet
- WHEN `lint:composition` runs against the current tree
- THEN it MUST pass (it MUST NOT flag existing pre-redesign pages, which are not yet composed)
- AND a compliant composed screen (template + slotted blocks + data, no raw markup) MUST pass

**Acceptance Criteria:**
- `lint:composition` exists, encodes the composition-only rule, passes the current tree + a compliant sample
- It fails a planted raw-markup screen, naming it; existing pages are not blocked

---

### Requirement: Verification and Deferred Fidelity
The templates and primitives MUST be verified deterministically (render tests + token-purity + composition lint),
with the F1 pixel fidelity-diff explicitly deferred to `fidelity-harness`.

#### Scenario: Render tests cover templates and primitives
- GIVEN the components
- WHEN `npm run test:unit` runs
- THEN render tests MUST confirm `AppShell` (expanded + collapsed) and `AuthLayout` render their slots, and each
  layout primitive renders its children
- AND the overall unit suite MUST stay green

#### Scenario: Build stays green
- GIVEN the new components
- WHEN `npm run build` runs
- THEN it MUST pass (the components compile as presentational/server-safe components)

#### Scenario: F1 fidelity is deferred and noted
- GIVEN `fidelity-harness` (the pixel-diff gate) is not yet built
- WHEN the verification scope is inspected
- THEN the change MUST verify structure (render), token-purity (F2), and composition (F5) now
- AND it MUST explicitly defer the F1 pixel fidelity-diff on the empty shell to `fidelity-harness`

**Acceptance Criteria:**
- Render tests pass for templates (expanded+collapsed) and all primitives; `npm run build` + `npm run test:unit` green
- F2 (token-purity) + F5 (composition) enforced; F1 pixel-diff deferred to `fidelity-harness`

---

## Test Plan

This change ships components + a lint. Validation is by deterministic commands. Commands assume the repo root.

### Components present
```bash
test -f app/components/templates/AppShell.tsx && test -f app/components/templates/AuthLayout.tsx && echo "templates present"
for p in Stack Grid Split Section Panel Rail; do test -f "app/components/layout/$p.tsx" && echo "OK $p" || echo "CHECK $p"; done
grep -qi 'checkerboard' app/components/templates/AuthLayout.tsx && echo "AuthLayout uses checkerboard"
grep -qiE 'collapsed|expanded' app/components/templates/AppShell.tsx && echo "AppShell has both states"
```

### Token-purity of new components
```bash
npm run lint:tokens && echo "token-purity passes (no raw literals in new components)"
# new components reference token utilities, not raw px
grep -rEn '#[0-9a-fA-F]{6}|[0-9]+px' app/components/templates app/components/layout && echo "CHECK raw literal" || echo "OK no raw literals"
```

### Composition lint (both directions)
```bash
npm run lint:composition && echo "composition lint passes current tree"
# plant a non-compliant composed screen, expect non-zero, then remove
mkdir -p app/__compotest
printf '/* @composed-screen */\nimport x from "foo";\nexport default function S(){return <div className="p-4" style={{color:"red"}}>raw</div>;}\n' > app/__compotest/page.tsx
npm run lint:composition && echo "CHECK lint missed raw markup" || echo "OK lint fails on raw-markup screen"
rm -rf app/__compotest
```

### Build + suite
```bash
npm run build && echo "build passes"
npm run test:unit && echo "unit suite green"
```

### Manual review
1. Render `AppShell` expanded and collapsed with placeholder blocks; confirm sidebar/topbar/content slots and the
   icon-rail collapsed state.
2. Render `AuthLayout`; confirm centered card + checkerboard footer.
3. Confirm each primitive maps its props to canonical token utilities (no raw px).
4. Confirm `lint:composition` rule + that F1 pixel fidelity-diff is deferred to `fidelity-harness`.
