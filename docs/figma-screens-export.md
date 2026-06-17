# Figma Screen Import — full app screen catalog (composition specs)

**Date:** 2026-06-17 · **Status:** ✅ COMPLETE — 14 screens imported as composition specs + 9 new sub-atoms spec'd
**Figma source:** file **`gl9wHy8VGJQTmNuQZNukqg`** ("Gigly (Copy) (Copy)", Pro/Full seat, unmetered). Node IDs preserved from the original `Drp803tesW5fIuA2Y21JVx`.
**Method:** official Figma MCP `get_metadata` per screen (structure/layout tree) + `get_design_context` for the new sub-atoms. Screens are **fully composed from the catalog** in `figma-components-export.md` (Side bar, HEADER, Gig, Message, MESSAGE, attention card, input field, select, Button, bio, Category, tag, status, progress bar, file, Input Field) — so this doc captures **composition** (slots + layout grid + which blocks), not re-derived component styling. The genuinely-new pieces are spec'd in §1.

**Companion docs:** composites → `figma-components-export.md`; atomic primitives + coded-kit deltas → `figma-component-audit.md`; tokens → `docs/figma-tokens-export.json`. This doc is the input to the **UI-reconciliation plan** (align coded screens to these mockups).

---

## 0. The 14 screens (node-id → screen → likely coded route)

| Screen (Figma name) | node-id | Role | Likely route / file |
|---|---|---|---|
| create account *(role select)* | `3179:3179` | both | `/auth` register — role step |
| create account/specialist | `3179:3863` | specialist | `/auth` register — credentials |
| create account/company | `3195:4564` | company | `/auth` register — credentials |
| welcome/specialist *(onboarding)* | `3195:4282` | specialist | profile-setup / onboarding step |
| welcome/company *(onboarding)* | `3195:4704` | company | profile-setup / onboarding step |
| Профиль/specialist | `2860:2103` | specialist | `/profile`, `/profile/[userId]` |
| Дашборд/specialist | `2860:3751` | specialist | `/dashboard` |
| Дашборд/company | `3371:5387` | company | `/dashboard` |
| Поиск проектов/specialist *(gig browse)* | `2860:2056` | specialist | `/gigs` |
| Gig *(detail + apply)* | `2860:2243` | both | `/gigs/[id]` |
| Мои проекты/specialist | `2860:2192` | specialist | `/dashboard` projects tab / my-projects |
| Мои проекты/company | `3795:5947` | company | `/dashboard` projects tab / my-projects |
| Чаты *(chat)* | `2860:4702`, `3795:6890` | spec/co | messages — currently inline in `gigs/[id]` (ChatPanel) |

All app screens (not the 5 auth screens) share the shell: **`Side bar` (283w; collapses to ~78/126) + `HEADER` (104 or 168h) + `CONTENT`** at 1512×982 canvas. Route-mapping is *likely* — confirm during reconciliation.

---

## 1. NEW sub-atoms introduced by the screens (NOT in the composite catalog — build/verify these)

### H/H1/BLOCK (`3371:5248`) — the section header ⭐ used on nearly every screen
- Row, `justify-between`, pad `px md(16) py sm(8)`. Title = **`type/h2`** = `font/family/accent` **NKDuy Mono Medium 24**/29, ls −0.3, white. Optional trailing **icon 22** (e.g. `shield-lock`) and/or an optional counter chip ("H + counter" slot).
- This is the recurring "БЛОК"/section heading (Стек, Опыт, требования, критерии успеха, Активные задачи, Сообщения, …). **No coded counterpart as a named atom** — currently ad-hoc headings. Candidate: a `SectionHeader` block (title + optional icon + optional count).

### job experience (`3088:3896`) — profile work-history card
- Card: `border 1px var(--frame-stroke=rgba(255,255,255,.2))` (=border/default), radius/lg(12), pad 20, col gap 12. Header row `justify-between`: company `16` white + period `12` text/muted right. Role line `[Senior Frontend Developer]` (brackets) **`14` colour `#006ccb`** ⚠️. Body desc `14`/16 text/muted. **Font: `Vremena Grotesk Book`.**
- ⚠️ Role colour **`#006ccb`** is a *darker* blue than brand `#08f` and than the `Специальность` atom's `#08f` — inconsistency to reconcile.

### требование (`2932:7177`) — gig-detail "requirement" tile
- Card: same `frame-stroke` border, radius/md(8), pad 12, **h120**, `justify-between`. Title `IBM Plex Sans Medium 18` white; desc `IBM Plex Sans 14`/16 text/muted, ls −0.14, ellipsis. (Rendered as a 2-col grid of tiles on the gig screen.)

### критерий (`2932:7224`) — gig-detail numbered "success criterion" row
- Row, border on **B/R/T only** = `var(--color)=#08f` (left edge is the num block), radius/md, `overflow-clip`. Leading **num block**: bg `--color`, w22, full-height, number `NKDuy Mono SemiBold 16` on **`--color-2=#01030e`** (page-bg as on-accent text). Text col `Vremena Grotesk`: title `16` white + desc `14`/16 text/muted.

### welcome promo card / "pic" (`3082:3820`, company `3371:5394`) — dashboard onboarding cards
- Card: radius/lg(12), pad lg(24), gap md(16), bg `rgba(255,255,255,.05)` + `mix-blend-plus-lighter`. Decorative cut-out **person/sheets image** bleeds off the right with `mix-blend-color-dodge`. Title `type/h3` (SF Compact Semibold **18**/23) + subtitle `type/body` (15) text/secondary. Inline **progress bar** (see catalog) + a **Secondary `Button`** (`border/strong #5a6070`) with trailing pencil/arrow icon 20.
- Two per dashboard ("Заполните профиль / Клиенты ищут по стеку…" + "Как это работает"). Candidate: an `OnboardingCard` block.

### counter (`3179:3997`/`3179:3998`) — auth step indicator (step-dots)
- Row of dots, gap 4. **Active** = `var(--color)=#08f`, **8×8**, radius/lt(2). **Inactive** = `rgba(255,255,255,.3)`, **6×6**. 3 steps; the active dot is larger. (Distinct from the coded `StepIndicator` — verify geometry/colour.)

### terms tabs (`2860:2413`) — gig-apply "Условия Versel / Мои условия" 2-segment toggle
- Bar: bg `#01030e`, `border 1px rgba(16,18,28,.2)`, radius 5, gap 6, 2 equal segments. **Active** segment: bg `rgba(255,255,255,.2)`, radius/sm(4). Labels `NKDuy Mono SemiBold 14`/16 white. (Bespoke — *not* the `switch bar` atom; similar idea, different fill/geometry.)

### cover-letter textarea (`2860:2430`) — gig-apply message field
- Box: bg `--фон-1 = rgba(255,255,255,.05)`, `border 1px rgba(16,18,28,.2)`, radius/md(8), pad 12, `items-start` (multi-line). Placeholder `NKDuy Mono SemiBold 12`/14 @ **70% opacity**. (A multiline variant of the input field.)

### logomark (`3179:3571`) — auth-screen brand mark
- Image asset, **75×75** (size XS). Plus a wordmark "Frame"/"Group" lockup (`136×29`) top-left on auth screens (`logo + Gigly` text).

---

## 2. Per-screen composition

### Auth flow (no AppShell — centered 400w card on a 1512×982 page; bottom `Frame 339` = legal/page-footer links)

**create account — role select (`3179:3179`)**
- Center `HEADER` block (400w): `logomark` 75 → "H + disc" (H "Создайте свой аккаунт" + sub "Выберите свою роль в Gigly.") → `counter` (step 1/3).
- Two **`roleplay`** role-selector rows (the catalog `roleplay` atom) — pick specialist/company. A cursor-icon decoration. Vector wave graphic across the bottom (`3324:3941`).

**create account/specialist (`3179:3863`) & /company (`3195:4564`)** — identical layout
- `logomark` → H "Создайте свой аккаунт" + "Введите свои учётные данные." → `counter` (step 2/3) → **form**: 3× `input field` (catalog) → **buttons**: Primary `Button` (40h) + Tertiary `Button` (32h) stacked.

**welcome/specialist (`3195:4282`)** — onboarding step 3
- H "НАСТРОЙТЕ СВОЙ АККАУНТ" + "Введите данные" → `counter` (step 3/3) → form: `input field` + 2× `select` (catalog) → buttons: small back `Button` (52w) + Primary `Button` (188w) side-by-side.

**welcome/company (`3195:4704`)** — onboarding
- H "Добро пожаловать" + "Настройте свой аккаунт." → `counter` → form: `input field` (standalone) + fields group [`input field` + 2× `select`] → back + Primary buttons. (One extra lead input vs specialist.)

### Профиль/specialist (`2860:2103`)
- Shell: Side bar + HEADER(104) + CONTENT(1229w).
- **ID block** (h250): avatar frame (148×170 photo + `tag/status` offline pill w/ dot) | Summary (name `Иван Иванов` h2-ish + `Специальность` atom) + verify row (`patch-check` 16 + "Номер телефона верифицирован") + "/с 21 января 2021" | a "Здесь будет ваша статистика / Окно на стадии разработки" placeholder panel (right).
- **BLOCK** = 2 columns:
  - **col1**: `Стек` section (`H/H1/BLOCK` + 6× `tag`) · `Опыт` section (`H/H1/BLOCK` + description text + 2× `job experience`).
  - **col2**: `Стек` (`H/H1/BLOCK` + 5× `Category`) · `Опыт` (`H/H1/BLOCK` + a `Gig` card feed).

### Дашборд/specialist (`2860:3751`)
- Shell: Side bar + HEADER(168) + CONTENT.
- **WELCOME** (h234): greeting (name + h2 line) + **2× welcome promo cards** (the "pic" block).
- **BOARD** (2 col): **col1** "Активные задачи" = nested `HEADER` + feed of 4× `Gig` (compact, ~365w, status+bio+Category+heading+timeline). **col2** = "найти гиг" `HEADER` + "Сообщения" (`HEADER` + 5× `Message` feed + chevron-down "more").
- **WELCOME 2** (h363): `H/H1/BLOCK` + **row of 6× `attention card`** (the dashboard notification strip).

### Дашборд/company (`3371:5387`)
- Same shell + WELCOME promo cards. **BOARD col1** "Активные задачи": `H/H1/BLOCK` + `Menu/no/switcher` (tab strip) + `Gig` feed (full-width ~703w cards w/ price/term/Button). **col2**: "Найти новый проект" mini-card (`H/H1/BLOCK` + Button) + "Сообщения" (`H/H1/BLOCK` + 5× `Message`).
- Contains a **hidden** attention-card strip (`Frame 342`, `hidden=true`) — same 6-card row as specialist; not shown on company by default.

### Поиск проектов / gig browse (`2860:2056`)
- Shell: Side bar + HEADER(168) + CONTENT. **GIGS**: Header row = `H/H1/BLOCK` (1029w) + **`switcher`** (the 2-tab L/R atom, grid/list 60w). **Column 2** = a **grid of 6× `Gig`** cards (~559w, full status variants).

### Gig — detail + apply (`2860:2243`)
- Shell: Side bar + HEADER(104) + CONTENT(1213w). **BLOCK** = 2 columns:
  - **col1 (703w)**: `main` (heading h2 + 3× `tag` + long description) · `требования` (`H/H1/BLOCK` + 3× `требование` tiles, 2-col) · `критерии успеха` (`H/H1/BLOCK` + 3× `критерий` numbered rows) · `files` (`H/H1/BLOCK` + 4× `file` chips).
  - **col2 CONDITIONS (440w)**: COMPANY `bio` (acc-bio variant) · MAIN = **terms tabs** (Условия Versel / Мои условия) + срок (Срок выполнения "14 дней" + "[1 этап]") + бюджет ("200 400 ₽" + "фикс. цена") + **cover-letter textarea** + apply Primary `Button` (full-width) + disclaimer text · `files`/chat = `H/H1/BLOCK` + a `MESSAGE` thread (4 bubbles) + `Input Field` composer.

### Мои проекты — specialist (`2860:2192`) & company (`3795:5947`)
- Shell + HEADER(168). **BLOCK**: `Menu/no/switcher` tab strip + **Проекты** = 2 columns of `Gig` cards in mixed sizes (active w/ status+price+term+Button, and compact variants). Specialist vs company differ only by which `Gig` variants/role.

### Чаты (`2860:4702`, and `3795:6890`)
- Shell: Side bar + HEADER(104) + CONTENT. **BLOCK** = 2 panes:
  - **chatlist (400w)**: nested `HEADER`(144) + 6× `Message` (chat-preview variant, 160h).
  - **chat (765w)**: top `bio` (acc-bio: avatar + name + verify + rating + `Специальность`) · `dialog` = alternating `MESSAGE` bubbles (L/R) with a time divider · `Input Field` composer (h35).
- `3795:6890` is the richer/company copy (bio shows rating + specialty). Two near-identical chat layouts exist.

---

## 3. Cross-cutting findings (for the reconciliation plan)

1. **9 new sub-atoms have no first-class coded component** (§1). Highest-value to build/verify: `H/H1/BLOCK` SectionHeader (everywhere), `job experience`, `требование`, `критерий`, welcome `OnboardingCard`, auth `counter` step-dots, gig-apply `terms tabs` + cover-letter textarea, `logomark`. These are the "hickups" most likely causing visual drift.
2. **The shell is universal:** every app screen = `Side bar` + `HEADER` + a 1–2 column `CONTENT`. The coded `AppShell` should drive all of them; verify HEADER height variants (104 vs 168 — the taller one carries the search/switcher row).
3. **Blue inconsistencies:** brand `#08f` (buttons, accents, Специальность on profile) vs **`#006ccb`** (job-experience role text) vs `#4cacff` (tag/Category "Blue", brand/highlight). Pin the role/specialty blue with the designer.
4. **Bespoke toggles proliferate:** `switcher` (grid/list L/R), `Menu/no/switcher` (project tabs), `switch bar`/`switcher` (6-tab), and the gig-apply **terms tabs** are *four different* tab/segment treatments. Reconcile to a minimal set.
5. **Non-token fonts persist into screens:** `Vremena Grotesk` (job-experience, gig price/term, message bodies), `IBM Plex Sans` (требование, file). Same gap flagged in `figma-components-export.md` §findings — decide family tokens before building these atoms.
6. **New raw values seen at screen level:** `--frame-stroke rgba(255,255,255,.2)` (=border/default, used as card stroke), `--color-2 #01030e` (page-bg as on-accent text), terms-tab active `rgba(255,255,255,.2)`, textarea `--фон-1 rgba(255,255,255,.05)`. Map to tokens during build.
7. **Hidden/placeholder content in mockups:** profile "статистика" panel is an explicit "на стадии разработки" placeholder; company dashboard hides the attention strip; many `Gig` sub-frames are `hidden=true` (tags/description/info toggled off per context). Don't treat hidden frames as required.
