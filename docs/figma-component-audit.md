# Figma Component Catalog ↔ Coded Kit — Gap Audit

**Date:** 2026-06-17 · **Status:** audit only (no code changed)
**Figma source:** `tokens` section node `3870:7654` (+ `frames.svg` composites) · **Code:** `app/components/{primitives,blocks,layout}`, `templates/AppShell.tsx`, variant maps in `app/components/primitives/tokens.ts`.

Legend: ✅ match · ⚠️ partial (missing variant/axis/state or rename) · ❌ no code counterpart · ➕ code-extra (not in Figma)

This is the input to a component-reconciliation decision. Tokens + design-system docs are already synced to Figma (see `DESIGN_SYSTEM_SPEC.md` §10); this is the **component** layer.

---

## Headline
**6 of 17** catalog matrices map cleanly: **Button states, status (6), Input, progress bar, menupage, Menu.**
The rest diverge on a missing variant/axis/state or a rename. Two catalog atoms (`button_icon`, `Специальность`) have **no code home**; `Tetriary`/`switcher`/`bio` are structural shapes the kit lacks; the tag/Category colour-key **rename** is a subtle semantic risk.

---

## Primitives

| Figma | Code (path) | Code API | Delta |
|---|---|---|---|
| **Button** — Property {Primary, Secondary, Tetriary} × State {Default, Hover, Disabled}; Tetriary=32px, others=40px | `primitives/Button.tsx`, `tokens.ts` | `variant = primary\|secondary\|ghost\|link`; states hover/active/disabled/focus ✓; `size="md"` (40h) only | ⚠️ **Tetriary 32px missing** (size axis is a dead single-value union). ➕ `ghost`+`link` have no Figma equiv. Pri/Sec + states ✅ |
| **button_icon** — square 40×40, State {Default, Hover, Active} × BG {no, yes} | — | — | ❌ **No primitive.** Icon buttons faked via `<Button variant=ghost>` / bare `<Icon>`. No square geometry, BG axis, or Active state |
| **tag** (filled) — Color {Blue, rose, green, teal, orange} × Size {S} | `primitives/Tag.tsx` | `color?: Category` (5), `size?="sm"` | ⚠️ colour axis **rekeyed by domain** (`marketing/design/programming/development/coding`) vs Figma **hue**; 1:1 count but mapping implicit/unverified |
| **Category** (left-accent) — Color {5} × Size {S} | `primitives/CategoryTag.tsx` | `category: Category` (5) | ⚠️ same hue→domain rename; 5 colours ✅, Size S ✅ |
| **status** — 6 statuses (Открыт…Отклонён) | `primitives/StatusBadge.tsx` | `status` = 6 ✅; `variant = pill\|inline-dot\|current` | ✅ all 6 match. ➕ extra forms (inline-dot, «Текущий») |
| **Filter** — State {Default, Hover, Disabled} × Expand {no, yes} × Selected {no, yes} | `primitives/Filter.tsx` + `Radio.tsx` | checked/disabled/count; hover/disabled/focus ✓ | ⚠️ **Expand axis missing** (no group expand/collapse). State + Selected ✅ |
| **dropdown/item** — State {Default, Hover, Disabled} × Selected {no, yes} | `primitives/Select.tsx` | option Default/Hover/Selected ✓ | ⚠️ **item Disabled missing** (`SelectOption` has no `disabled`) |
| **Input Field** — State {default} | `primitives/Input.tsx` | `state = default\|focus\|filled\|disabled\|error` | ✅/➕ code is a superset (catalog only ships default) |
| **progress bar** | `primitives/ProgressBar.tsx` | `value 0–100` | ✅ |
| **switcher** — generic Active tab {L, R} | `primitives/ViewToggle.tsx` | `view = grid\|list` (icon-bound) | ⚠️ no **generic** L/R switcher; ViewToggle is hard-bound to grid/list icons |
| **Специальность** (specialty tag) — Size {S, XS} | — | — | ❌ **No component** (grep specialty → none) |

**Code-extra primitives (no audited Figma node):** `Toggle`, `Avatar` (sm/lg+online), `Rating`, `SearchInput`, `PasswordInput` (eye residual), `StepIndicator`, `Icon`.

## Blocks (only those mapping to a *named* Figma atom)

| Figma | Code | Delta |
|---|---|---|
| **menupage** — shorten {no,yes} × State {Default,Hover,Active} + count | `blocks/SidebarNav.tsx` → internal `NavMenuItem` | ✅ states+shorten+count present; not an isolated exported component |
| **Menu** — shorten × Active tab {0..6} | `blocks/SidebarNav.tsx` | ✅ (data-driven active index) |
| **profile frame** — view {Full, short} × State {Default,Hover,Focus,Active} | `blocks/ProfileCard.tsx` | ⚠️ view full/compact ✅ but **no interaction states** (static) |
| **bio** — "size for" {gig, acc bio} × USER {COMPANY, SPECIALIST} | *(none — inline in ProfileCard/ProfileHeader/ChatHeader/GigCard)* | ⚠️ **no component, no axes**; `roleTag` is an untyped string |

All other code blocks (`StatPanel`, `DataTable`, `LedgerTable`, `DisputeList/Detail`, `TermsTabs`, `ApplyPanel`, `ChatPanel`, `FilterBar`, `BannerCard`, `RoleCards`, `ToggleList`, `CategoryTags`, …) are §3.2 domain phrases — no 1:1 Figma atom, no delta expected.

## Layout primitives
`AppShell` (slots + `collapsed`), `Stack`, `Grid`, `Split`, `Section`, `Panel`, `Rail` — token-backed via `layout/scale.ts`. No Figma matrix targets these; no delta.

---

## Biggest divergences (most rework → least)
1. **`button_icon` has no code home (❌)** — a core atom; every icon button is ad-hoc. Add an `IconButton` primitive (`bg: no|yes` + Active), refactor call sites. *Highest effort, touches many blocks.*
2. **Button: missing `Tetriary` 32px tier (⚠️) + non-Figma `ghost`/`link` (➕)** — add a real size axis (`sm`=32→Tetriary); decide whether ghost/link are sanctioned extensions.
3. **tag/Category colour key renamed by domain, not hue (⚠️)** — `{Blue,rose,green,teal,orange}` vs `{marketing,…}`. Needs an explicit hue↔category reconciliation table (risk: "programming" ≠ "Blue").
4. **`switcher` + `bio` lack first-class components (⚠️)** — extract a generic 2-segment Switcher and a typed Bio (`USER {COMPANY|SPECIALIST}` × `size {gig|acc bio}`).
5. **Interaction-state gaps (⚠️)** — `ProfileCard` Hover/Focus/Active; `Filter` Expand axis; `Select` option Disabled. Small, localized additions.

## Code-extra (in code, not in Figma catalog)
Button `ghost`/`link`; StatusBadge `inline-dot`/`current`; `PasswordInput`, `StepIndicator`, `Toggle`; all domain-phrase blocks (by design).
