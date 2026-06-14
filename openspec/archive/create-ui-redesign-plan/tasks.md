# Tasks: Create UI Redesign Integration Planning Document

> **✅ COMPLETE (2026-06-13)** — All tasks executed. Planning document generated at
> `openspec/planning/ui-redesign-integration.md` (Status PLANNED, 26 changes across Phase 0/1/2, 0/26).
> Verified deterministically: the 5 required sections + creation date, the screen→route→gap table, the
> Phase 1 data worklist, the plan-only gate, MVP boundaries, testing friction, and designer-gap flags;
> 26 dependency-ordered `/ralphy-plan` commands each with a test plan + friction level; 12 Phase-2
> `Depends on:` lines; 26 unchecked status boxes. Plan-only: the listed commands run once the Figma
> design is locked.

> These tasks are executed during `/ralphy-implement create-ui-redesign-plan`. They analyze the
> 13 mockups in `/screens` and the current app, then emit `openspec/planning/ui-redesign-integration.md`.
> The dissection below is the working material — the implement step confirms and refines it.
>
> **Two product decisions are fixed (2026-06-13):**
> 1. **Full evolutionary revamp** — net-new features the design implies (ratings, categories, deadlines,
>    finances, disputes, onboarding fields, work history…) are **scheduled as real changes**, not stubbed.
> 2. **Plan only, execute nothing yet** — generate the planning document; start **no** implementation
>    (not even Phase 0) until the Figma design is marked final. Phases express dependency order only.

> **Design-system inputs (added 2026-06-13):** two component-library SVGs now live in `/screens` —
> these ARE the brief's §3 "library page", not a screen-flow map. Both are fully vectorized (no
> extractable `<text>`); render via `sharp` (tokens.svg) and inlined-SVG Chromium (frames.svg — librsvg
> rejects its markup with a `defs/svg` tag mismatch).
> - `tokens.svg` (1360×9175) — atomic components & states: sidebar nav-item (default/hover/active/collapsed),
>   tech-stack tag pills (5 colors), category tags (**Маркетинг, Дизайн, Программирование, Разработка,
>   Кодинг**), gig **status taxonomy with semantic colors** (Открыт=neutral, На рассмотрении=amber,
>   В работе=blue, На проверке=purple, Завершён=green, Отклонён=red), rating (stars + count + verified +
>   experience tag), filter dropdown states, "К проекту" button variants, grid/list view toggle,
>   progress bar, search input.
> - `frames.svg` (3940×11463) — assembled components & states: full sidebar (**expanded + collapsed
>   icon-rail**), profile card, support card, topbar (title + search + filters), tabs, gig card in every
>   status color, message bubbles (in/out + read receipts), conversation list item, inputs
>   (text/password + label), selects/dropdowns, toggle switch, radio/list items, notification list item,
>   and **account-settings** controls (language select «Русский», notification categories, "Удалить аккаунт").
> Two things appear here that are NOT in the 13 JPGs: a **Settings screen** and the **collapsed sidebar**
> state. The library is the authoritative source for `component-library-map`, `ui-primitives-library`,
> and the token/status/category facts below.

---

## Task 1: Confirm Screen Inventory (what IS on the screenshots)

**Objective:** Lock the catalogue of screens and their purpose before mapping to code.

**Implementation Notes — the 13 mockups, grouped:**

**A. Onboarding mini-flow** (public, full-screen, no shell; pixel `GIGLY` wordmark; checkerboard footer; 3-dot step indicator):
- `auth.jpg` — Step 1/3: **role selection** (Компания / Специалист cards).
- `reg.jpg` — Step 2/3: **credentials** (Email, Пароль, Подтвердите пароль with show/hide; "Зарегистрироваться" + "Войти").
- `reg-customer.jpg` — Step 3/3 (CLIENT): Компания, ФИО, Должность (dropdown), Местоположение и часовой пояс (dropdown); Back + "Продолжить".
- `reg-specialist.jpg` — Step 3/3 (SPECIALIST): ФИО, Специализация (dropdown), Местоположение и часовой пояс; Back + "Продолжить".

**B. App shell** (persistent across every internal screen):
- **Left sidebar**: `GIGLY` wordmark + collapse («); profile card (avatar, name, role label, notification bell + count, settings gear); role-specific nav with counts; "Поддержка" support card with input; logout (bottom).
- **Topbar**: page title with accent bar (ДАШБОРД / ПОИСК ГИГОВ / ПРОФИЛЬ); right-side panel toggle; on list pages a "Поиск чего угодно…" search + "Фильтр" dropdowns (and "Рейтинг" on search).
- Nav by role: **CLIENT** = Дашборд · Мои гиги · Чаты · Финансы · Споры. **SPECIALIST** = Дашборд · Поиск · Мои гиги · Чаты · Финансы · Споры.

**C. Internal screens:**
- `customer-dashboard.jpg` — CLIENT dashboard: welcome + profile-completion banner (40% / 10%); "Мои гиги" tabbed cards; "Создайте первый гиг" CTA; "Сообщения".
- `customer-profile.jpg` — **DUPLICATE of `customer-dashboard.jpg`** (flag; no real client-profile mock exists → request from designer).
- `customer-projects.jpg` — CLIENT gigs list: search + 4 filters; tabs (Все / Заявки / В работе / На проверке / Завершенные); cards incl. an expanded "Открыт" card with a category tag.
- `specialist-dashboard.jpg` — SPECIALIST dashboard: welcome banner; "Мои гиги" tabs (Все 7 / Заявки 1 / В работе 4 / На проверке 1 / Завершённые 1); 2-col gig cards with status badge; "Найти новый гиг" search; "Сообщения".
- `specialist-gig-search.jpg` — gig **search**: "Найдено 5" + grid/list toggle; rich cards (company + rating + age, title, tech tags, description, фикс. цена, срок, "К проекту").
- `specialist-gig.jpg` — gig **detail / apply**: title + tags + description; "Технические требования" cards; "Критерии успеха" numbered list; right rail: client card, "Условия / Мои условия" tabs, срок/бюджет, "Сопроводительное письмо", "Отправить заявку", inline "Чат".
- `specialist-projects.jpg` — SPECIALIST gigs list (specialist variant of `customer-projects`).
- `specialist-chats.jpg` — **messages**: two-pane inbox (list with search + status badges + unread counts) + active thread (bubbles, date separators, attach + send composer).
- `specialist-progile.jpg` — SPECIALIST **profile**: header (avatar, name, role tag, "Номер телефона верифицирован", "с 21 января 2021", online dot, stats placeholder); "Стек" chips; "Опыт" (bio + job history with dates); "Избранные категории" chips; "Реализованные проекты 1" gig card.

**Test Plan:** re-open each `/screens/*.jpg`; confirm grouping, the `customer-profile.jpg` duplicate, and the absent client-profile/admin mocks (note as designer gaps).

---

## Task 2: Map Screens → Routes → Gap (visual gap + net-new data it needs)

**Objective:** For each screen, fix the target route, current state, the visual gap, and the net-new data/feature it requires (which becomes Phase 1 work).

**Implementation Notes — mapping table (confirm against `prisma/schema.prisma` + `app/`):**

| Mockup | Target route (current) | Current state | Visual gap | Net-new data/feature (Phase 1) |
|---|---|---|---|---|
| auth (role select) | `/auth` | exists (role select) | full-screen wizard look; step indicator | — |
| reg (credentials) | `/register` | exists (1-step email/pw/role) | wizard step 2; confirm-password | — |
| reg-customer / reg-specialist | new wizard step 3 | profile is separate `/profile/edit` | new onboarding step | ФИО, Должность, Специализация, Location, Timezone + dropdown datasets |
| customer-dashboard | `/dashboard` (CLIENT) | server component, lists gigs | shell + banner + card layout | profile-completion %, ratings, deadlines |
| customer-projects | client gigs list | client gigs on dashboard only | dedicated filterable list | category taxonomy, status tabs |
| specialist-dashboard | `/dashboard` (SPECIALIST) | `SpecialistDashboardTabs` | shell + banner + card grid | tab counts, ratings |
| specialist-gig-search | `/gigs` | `GigBrowseClient` + filters | grid/list toggle + "Найдено N" | rating, deadline, category on card |
| specialist-gig (detail/apply) | `/gigs/[id]` | detail + apply + per-gig messages | structured req cards; right-rail apply; inline chat | terms negotiation («Условия/Мои условия»), milestones («этапы»), rating |
| specialist-projects | SPECIALIST gigs list | tabs on dashboard | dedicated filterable list | — |
| specialist-chats | **new** `/chats` (+ thread) | messaging is per-gig only | aggregated inbox over `Message` | conversation search, unread (has `Notification.lastReadAt`) |
| specialist-progile | `/profile` | exists (view) | rich portfolio layout | avatar, phone verification, work history, favorite categories, stats, reviews |
| Финансы | **new** `/finances` | none | new section in shell | finances ledger/view (logical amounts — MVP) |
| Споры | **new** `/disputes` | none (admin `ModerationLog` only) | new section in shell | user-facing dispute flow over moderation |
| Settings (from library) | **new** `/settings` | none (`/profile/edit` only) | reached via profile-card gear | notification preferences, locale, account deletion |

**Schema reality check (`prisma/schema.prisma`):** no Review/Rating, Category, WorkExperience, Finance, Dispute, or notification-preference models; `User`/profiles lack avatar, phone-verification, position, specialization, timezone, locale; `Gig` lacks deadline and milestones. Each becomes an **additive, backward-compatible** Phase 1 change scheduled **before** the screen that shows it.

**Design-system facts (from `tokens.svg` + `frames.svg`):** the **status taxonomy** is a 6-value semantic palette — Открыт (OPEN) · На рассмотрении (applications pending) · В работе (IN_PROGRESS) · На проверке (REVIEW) · Завершён (COMPLETED/PAID) · Отклонён (REJECTED) — each with a fixed colour; **categories** are exactly five (Маркетинг, Дизайн, Программирование, Разработка, Кодинг) rendered as left-accent tags, distinct from solid multi-colour **tech-stack** pills; the **sidebar** has expanded and collapsed icon-rail states; a full **primitive set** (card, badge, tag×2, input, password input, select, tabs, toggle, rating, view-toggle, message bubble, conversation item, notification item, button variants) is specified with states.

**Cross-cutting foundation gaps:** outdated tokens (re-export first) · fonts SF Compact + NKDy Mono (license check + fallback) · top-nav → sidebar+topbar shell (expanded + collapsed) · EN → RU as product language + a language selector exists (hardcoded-RU vs i18n decision) · desktop-only (retire/retain mobile-responsive code from commit `41320b2`).

**Test Plan:** every mockup element traces to an existing route/component or a named Phase 1 change; no unclassified elements; the data boundary is justified by a schema citation.

---

## Task 3: Sequence the Work, the Plan-Only Gate, and Testing Friction

**Objective:** Order the changes by dependency and encode the gate + test-stability strategy.

**Implementation Notes:**
- **Plan-only gate (decision 2026-06-13 + `DESIGNER_BRIEF.md`):** the document is produced now; **no change executes** until the design is locked. Phases are a dependency order, not a start signal.
- **Dependency order:**
  - **Phase 0 Foundation** (tokens → fonts → shell scaffold → screenshot harness → component map).
  - **Phase 1 Data & Backend** (ratings · categories · deadline+milestones · profile evolution · terms negotiation · finances · disputes) — each additive/backward-compatible.
  - **Phase 2 Screens** (shell cutover → shared gig card → dashboards → search → detail/apply → profile → chats → finances page → disputes page → onboarding wizard), each consuming real Phase 1 data. *Note:* shell cutover depends only on Phase 0; all data-displaying screens depend on their Phase 1 model.
- **MVP boundary (`project.md`):** Finances = logical ledger/view, **no** real gateway; Disputes builds on `ModerationLog`. Flag, don't cross.
- **Testing-friction by change type:** tokens/fonts **low** · additive models + server actions **low–medium** (new tests, existing green) · shell cutover/dashboards/lists/detail **high** (DOM restructure → preserve `data-testid`, headings, links, ARIA; expect Playwright updates) · new `/chats`,`/finances`,`/disputes` **low–medium** (additive routes) · auth/onboarding wizard **medium–high** (multi-step changes register E2E).
- **Mitigations:** additive migrations with defaults; keep server-action signatures + form `name`s stable; one screen per change behind the shell flag; run `npm run test:unit` + targeted E2E after each.

**Test Plan:** dependency graph acyclic; every Phase 2 screen lists the Phase 1 change(s) it depends on; each change names likely-affected tests + mitigation.

---

## Task 4: Write the Planning Document

**Objective:** Generate `openspec/planning/ui-redesign-integration.md` per `openspec/specs/planning/spec.md`.

**Implementation Notes:**
- Sections: **Problem**, **Why This Matters**, **Scope** (mapping table; Phase 1 data worklist; plan-only gate; MVP boundaries; testing friction), **Changes** (Phase 0 / Phase 1 / Phase 2, dependency-ordered), **Status** (`PLANNED`, creation date, `0/N`).
- Use the **command sequence in Task 5** as the starting point; refine names/requirements as the dissection is confirmed.
- State the **plan-only gate** prominently so no one begins execution before the design is locked.

**Test Plan:** all required sections present; creation date set; commands copy-pasteable and dependency-ordered; each carries a test plan + friction level.

---

## Task 5: Generate the Ralphy-Plan Commands (draft sequence)

**Objective:** Provide the executable, dependency-ordered commands the planning document will carry. (Authoring only — execution waits for design lock.)

### Phase 0 — Foundation

```bash
/ralphy-plan refresh-design-tokens "Re-export design tokens from the Figma file (Design Tokens plugin) and integrate. Requirements: (1) replace openspec/specs/ui/design-tokens.json with the fresh export, (2) run scripts/parse-design-tokens.js to regenerate Tailwind config + CSS variables, (3) reconcile renamed semantic tokens, document in docs/DESIGN_SYSTEM.md, (4) compatibility shim for token names still referenced in code, (5) capture the semantic status palette (Открыт/На рассмотрении/В работе/На проверке/Завершён/Отклонён) and the tag/category colours read from tokens.svg as named tokens. Test: parser clean, npm run build passes, unit suite green (friction: low)."
```
```bash
/ralphy-plan redesign-typography-fonts "Integrate redesign typography (SF Compact + NKDy Mono). Requirements: (1) verify SF Compact web-embedding license; if unavailable pick a licensed fallback (e.g. Inter / IBM Plex Mono), (2) add via next/font or @font-face, (3) bind families to typography tokens, (4) document license + sources. Test: fonts load, no layout shift, build passes (friction: low)."
```
```bash
/ralphy-plan app-shell-scaffold "Build the desktop shell (left Sidebar + Topbar) behind a feature flag, not yet replacing MainNav. Requirements: (1) Sidebar per the library — GIGLY wordmark, collapse control with BOTH expanded and collapsed icon-rail states, profile card (avatar/name/role/bell+count/settings-gear), role nav with count slots, Поддержка card, logout, (2) Topbar (accented title + optional search/filters), (3) desktop-only 1440px, (4) flag OFF preserves current MainNav exactly. Test: shell renders both roles in expanded + collapsed states, active states correct, flag off unchanged, nav E2E pass (friction: medium)."
```
```bash
/ralphy-plan visual-regression-harness "Stand up the screenshot-compare loop from the brief. Requirements: (1) store /screens mockups as 1440px references, (2) Playwright visual snapshots per redesigned screen, (3) compare script with diff artifacts, (4) document the assemble→compare→refine workflow. Test: harness runs, baseline captured, diffs reported (friction: low)."
```
```bash
/ralphy-plan component-library-map "Map the PROVIDED Figma component library (screens/tokens.svg + screens/frames.svg) to code in docs/COMPONENT_MAP.md. Requirements: (1) catalogue every library component with its states (sidebar expanded/collapsed, profile card, support card, topbar, tabs, gig card per status, badge/status-dot, tag×2, input/password, select/dropdown, toggle, radio, rating, view-toggle, button variants, message bubble, conversation item, notification item), (2) link each to an existing app/components file or mark 'to build', (3) note which Phase 1 data each consumes. Test: every library component appears with a code target (no code; friction: low)."
```
```bash
/ralphy-plan ui-primitives-library "Build the reusable presentational primitives from the library (component-first, before screens). Requirements: (1) Button (К проекту variants), Input + PasswordInput (label/icon/states), Select/Dropdown + Filter, Tabs, Toggle, Radio, Tag (tech pill) + CategoryTag (left-accent), StatusBadge/StatusDot (6-value palette), Rating, ViewToggle — all token-based, desktop-only, with the states shown in the library; (2) a /dev or Storybook-style preview page; (3) preserve data-testid conventions. Test: each primitive renders all states; matches the library; unit/render tests pass (friction: low)."
```

### Phase 1 — Data model & backend (each additive, backward-compatible; precedes its screen)

```bash
/ralphy-plan ratings-reviews-model "Add ratings/reviews. Requirements: (1) Review model (1–5 stars, author, target user, gig, comment), (2) leave-review server action after a gig reaches COMPLETED/PAID, one per party per gig, (3) aggregate rating + count on user, (4) seed sample reviews. Test: create/aggregate/authorization rules covered; existing suite green (friction: low–medium)."
```
```bash
/ralphy-plan category-taxonomy "Add the category taxonomy confirmed by the library — exactly five: Маркетинг, Дизайн, Программирование, Разработка, Кодинг (left-accent tag style, distinct from tech-stack pills). Requirements: (1) Category model + seed with these five, (2) gig⇄category relation, (3) specialist favorite categories ('Избранные категории'), (4) migration with safe defaults. Test: assign/query categories; gig create/edit accept categories; suite green (friction: low–medium)."
```
```bash
/ralphy-plan gig-deadline-and-milestones "Add срок выполнения + «этапы». Requirements: (1) Gig.deadlineDays (int) shown as 'Срок выполнения N дней', (2) milestone model or stageCount for '[N этап]', (3) gig create/edit inputs, (4) backward-compatible defaults for existing gigs. Test: create/display deadline+stages; legacy gigs render gracefully; suite green (friction: medium)."
```
```bash
/ralphy-plan profile-evolution "Extend profiles to the new design. Requirements: (1) avatar (upload or URL), (2) phone + verified flag (logical verification, no SMS gateway in MVP), (3) SPECIALIST position/role tag, specialization, location, timezone, (4) WorkExperience model (company, role, dates, summary) for «Опыт», (5) 'member since' from createdAt. All additive with defaults. Test: edit/display new fields; existing profiles unaffected; suite green (friction: medium)."
```
```bash
/ralphy-plan terms-negotiation "Add «Условия / Мои условия». Requirements: (1) application carries proposed terms (counter deadline/budget) vs client terms, (2) display both tabs on gig detail, (3) accept-with-terms updates the gig, (4) preserve existing accept/reject. Test: propose/counter/accept flow; lifecycle unchanged otherwise (friction: medium)."
```
```bash
/ralphy-plan finances-ledger "Add Финансы as a logical ledger/view (MVP: no real gateway). Requirements: (1) derive entries from gig budget/fee/PAID status, (2) balance + history summary per role, (3) read-only data layer + server action, (4) document the post-MVP gateway boundary. Test: ledger reflects gig payment statuses; no real transactions; suite green (friction: low–medium)."
```
```bash
/ralphy-plan disputes-flow "Add Споры over existing moderation. Requirements: (1) Dispute model (gig, opener, reason, status, resolution) linked to ModerationLog, (2) open-dispute server action for gig parties, (3) admin resolve action + audit log, (4) status surfaced to participants. Test: open/resolve/authorization covered; admin moderation unaffected (friction: medium)."
```
```bash
/ralphy-plan account-preferences "Add the backend for the Settings screen the library reveals. Requirements: (1) notification-preference fields/model (per-category toggles) with safe defaults, (2) user locale preference (RU default; powers the language selector), (3) a deleteAccount server action (cascade per schema, session teardown, confirmation), (4) all additive/backward-compatible. Test: read/update preferences; delete-account authorization + cascade covered; existing auth/profile flows green (friction: medium)."
```

### Phase 2 — Screen assembly (consumes Phase 0 + Phase 1; screenshot-compared)

```bash
/ralphy-plan redesign-shell-cutover "Replace MainNav in app/(protected)/layout.tsx with the Sidebar+Topbar shell. Requirements: (1) RU nav labels (incl. Финансы, Споры, and SPECIALIST Поиск), (2) live counts (gigs, unread chats), (3) all protected routes render inside the shell, (4) desktop-only, (5) preserve logout + notifications. Test: every route renders; active states correct; logout works; nav E2E updated (friction: high — preserve data-testid). Depends on: Phase 0."
```
```bash
/ralphy-plan redesign-gig-card "Build the shared gig card by composing ui-primitives-library. Requirements: (1) company avatar (initial fallback), title, фикс. цена, 'К проекту', progress, (2) StatusBadge using the 6-value palette (Открыт/На рассмотрении/В работе/На проверке/Завершён/Отклонён) per the library colours, (3) real rating (ratings-reviews-model), срок (gig-deadline-and-milestones), category left-accent tag + tech-stack pills (category-taxonomy), (4) graceful fallback when a value is absent. Test: renders across dashboards/lists/search; every status colour correct; missing values degrade gracefully (friction: medium). Depends on: ui-primitives-library, ratings, categories, deadline."
```
```bash
/ralphy-plan redesign-client-dashboard "Reskin /dashboard (CLIENT). Requirements: (1) welcome + profile-completion banner (real %), (2) 'Мои гиги' tabbed cards using redesign-gig-card, (3) 'Создать гиг' CTA, (4) 'Сообщения' panel from getRecentMessages. Test: matches mock; gig links + create flow work; tests green (friction: high). Depends on: shell, gig-card."
```
```bash
/ralphy-plan redesign-specialist-dashboard "Reskin /dashboard (SPECIALIST). Requirements: (1) welcome banner, (2) tabs Все/Заявки/В работе/На проверке/Завершённые mapped to existing states with counts, (3) gig card grid, (4) 'Найти новый гиг' search, (5) 'Сообщения' panel. Test: matches mock; tab parity with SpecialistDashboardTabs; tests green (friction: high). Depends on: shell, gig-card."
```
```bash
/ralphy-plan redesign-gig-search "Reskin /gigs browse/search. Requirements: (1) 'Найдено N' + grid/list toggle, (2) redesign-gig-card grid, (3) filter dropdowns mapped to tag/budget/sort + new category + Рейтинг, (4) preserve pagination. Test: search/filter/pagination parity; matches mock (friction: high). Depends on: gig-card, categories, ratings."
```
```bash
/ralphy-plan redesign-gig-detail-apply "Reskin /gigs/[id]. Requirements: (1) description + 'Технические требования'/'Критерии успеха' from acceptanceCriteria/goal/deliverables/constraints, (2) right-rail client card + apply form reusing structured fields, (3) «Условия/Мои условия» (terms-negotiation), milestones («этапы»), rating, (4) inline chat over existing messages. Test: apply works; owner sees applications; accept/reject/submit/approve unchanged (friction: high). Depends on: terms-negotiation, deadline+milestones, ratings."
```
```bash
/ralphy-plan redesign-profile "Reskin /profile to the portfolio layout. Requirements: (1) header (avatar, name, role tag, phone-verified, 'member since', stats placeholder per the mock), (2) 'Стек' from techStack, (3) 'Опыт' from WorkExperience + bio, (4) 'Избранные категории', (5) 'Реализованные проекты' from PAID/COMPLETED gigs, (6) aggregate rating. Test: new + existing profile data render; edit flow works (friction: medium). Depends on: profile-evolution, categories, ratings."
```
```bash
/ralphy-plan messaging-inbox-page "Add /chats aggregated inbox + thread over the Message model. Requirements: (1) conversation list (one row per gig with messages) + search, (2) thread reusing message-list/message-form, (3) unread via Notification.lastReadAt, (4) wire sidebar 'Чаты' count. Test: inbox lists gigs with messages; thread shows history; send works; per-gig messaging intact (friction: medium). Depends on: shell."
```
```bash
/ralphy-plan finances-page "Add /finances UI over finances-ledger. Requirements: (1) balance summary + transaction history per role, (2) shell-hosted, (3) empty state, (4) clear 'logical amounts, no real payments' framing. Test: page reflects ledger; nav active state; empty state renders (friction: low–medium). Depends on: shell, finances-ledger."
```
```bash
/ralphy-plan disputes-page "Add /disputes UI over disputes-flow. Requirements: (1) list of disputes for the user with status, (2) open-dispute entry from a gig, (3) admin resolve view, (4) shell-hosted + empty state. Test: open/list/resolve render; authorization respected (friction: medium). Depends on: shell, disputes-flow."
```
```bash
/ralphy-plan redesign-auth-onboarding "Reskin /auth + /register into the 3-step wizard. Requirements: (1) step indicator role → credentials → profile, (2) confirm-password, (3) RU copy + checkerboard footer, (4) step-3 writes profile-evolution fields (должность/специализация/location/timezone) + dropdown datasets, (5) keep loginUser/registerUser + validation. Test: register→dashboard flow; role preselect; validation errors display; auth E2E updated (friction: medium–high). Depends on: profile-evolution."
```
```bash
/ralphy-plan redesign-settings-page "Add /settings (reached from the profile-card gear) per the library. Requirements: (1) language selector (RU default) over account-preferences locale, (2) notification-category toggles bound to account-preferences, (3) 'Удалить аккаунт' danger action with confirm dialog calling deleteAccount, (4) shell-hosted, desktop-only. Test: read/update prefs from UI; delete-account confirm flow; nav active state (friction: medium). Depends on: shell, account-preferences."
```

**Test Plan:** each command is copy-pasteable, scoped to one concern, with numbered requirements, a deterministic test plan, a friction level, and (Phase 2) an explicit `Depends on:` line.

---

## Overall Test Plan

1. `openspec/planning/ui-redesign-integration.md` exists and follows `openspec/specs/planning/spec.md`.
2. Required sections present (Problem, Why, Scope, Changes, Status) with a creation date.
3. Scope contains the 13-screen mapping table, the Phase 1 data worklist, the plan-only gate, MVP boundaries, and testing friction.
4. Changes are grouped Phase 0 / Phase 1 / Phase 2 and dependency-ordered, with Phase 2 screens citing their Phase 1 dependencies.
5. Each change has a ralphy-plan command, a test plan, and a friction level + mitigation.
6. The provided component library (`tokens.svg` + `frames.svg`) is consumed by `component-library-map` + `ui-primitives-library`; the Settings screen and collapsed-sidebar state are scheduled; the `customer-profile.jpg` duplicate, the missing client-profile/admin mocks, and the Finances/Disputes MVP boundaries are flagged.
7. Status shows `PLANNED`, the creation date, and `0/N changes completed`.
