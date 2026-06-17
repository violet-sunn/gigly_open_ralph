# Gigly Design System Spec — the canonical SYSTEM (SSOT)

**Created:** 2026-06-14 · **Status:** canonical · **Reconciled to Figma:** 2026-06-17
**Produced by:** the `derive-design-system` change (Phase 0 #2 of the UI redesign plan).
**Authoritative source:** the Figma **`tokens`** frame (file `Drp803tesW5fIuA2Y21JVx`, node `3870:7654`) — exported to [`docs/figma-tokens-export.json`](./figma-tokens-export.json), serialized into `openspec/specs/ui/design-tokens.json`.
**Original substrate (superseded):** [`docs/DESIGN_SPECS.md`](./DESIGN_SPECS.md) → `screens/tokens.svg`, `screens/frames.svg` — the interim source before Figma MCP access. Where it and Figma disagree, **Figma wins**; the §1/§8 values below are corrected to Figma and the deltas are logged in **§10**.

> **This document is the single source of truth (SSOT) for the Gigly design system.** It is the canonical
> blueprint every later phase implements against — `design-token-engine` serializes its taxonomy, `layout-grammar`
> builds its templates, `ui-primitives`/`domain-blocks` build its vocabulary, and the Phase 2 screens compose from
> it. Where this document and any screenshot disagree, **this document wins** — the screens are *samples of an
> intended system, not the system itself*.

## What this is (and is not)

This is **reverse-engineering, not authoring.** Every canonical value here traces to the **raw observed**
substrate in [`docs/DESIGN_SPECS.md`](./DESIGN_SPECS.md) (and through it to a real SVG `fill`/`rx`/coordinate).
Normalization collapses near-duplicates, snaps off-grid one-offs, and promotes genuine intentional differences to
named **variants** — every raw value is accounted for (mapped or logged), none silently dropped.

- **It IS:** canonical scales (colour, radius, spacing, type), the semantic token taxonomy, the component
  vocabulary (primitives + blocks) with variant/state/size matrices, the layout grammar + screen-composition
  pattern, the typed block view-model contracts, a complete **Reconciliation Log**, and a **System Coverage
  Matrix**.
- **It is NOT:** the machine token source (`openspec/specs/ui/design-tokens.json` — that is `design-token-engine`),
  React components (`ui-primitives`/`domain-blocks`), screen code (Phase 2), or the font licence decision
  (`typography-system`). It is the contract those changes fulfill. **Documentation only.**

**Inputs (read-only):** `docs/DESIGN_SPECS.md` (raw substrate), `screens/tokens.svg` + `screens/frames.svg`
(component library), `screens/*.jpg` (12 sample screens), `docs/design-system/reference-renders/`,
`openspec/planning/ui-redesign-integration.md`.

---

# 1. Canonical Design Scales

Each scale collapses the raw observed values from `docs/DESIGN_SPECS.md` into a small canonical set. The mapping
columns are exhaustive: **every** observed value resolves to a canonical step or a logged reconciliation decision
(see §8). No canonical value is introduced that is not grep-findable in the SVGs.

## 1.1 Colour scale

Organized by **role family**. Canonical hex values are all real SVG fills (verified grep-present in
`screens/tokens.svg`/`screens/frames.svg`). The "Observed → canonical" column accounts for all 22 distinct
six-digit fills + `white` from `DESIGN_SPECS.md §2`.

### Surface ramp (page → elevated)
| Token | Canonical hex | Observed fill (count) | Role |
|---|---|---|---|
| `surface/level-0` | `#01030e` | `#01030e` (30) | Page / darkest background |
| `surface/level-1` | `#0e101a` | `#0e101a` (52) | Recessed surface (wells, inner fields) |
| `surface/level-2` | `#10121c` | `#10121c` (71) | **Card / input** surface (dominant surface) |
| `surface/level-3` | `#1a1a24` | `#1a1a24` (28) | Elevated surface (popovers, hover rows) |
| `surface/level-3-hover` | `#1a1d2a` | `#1a1d2a` (24) | Elevated **hover** variant — *promoted variant* (see §8 RC-1) |

### Text / neutral / border
| Token | Canonical hex | Observed fill (count) | Role |
|---|---|---|---|
| `text/strong` | `white` | `white` | Primary text, active glyphs |
| `text/inverse` | `white` | `white` | Text on brand/coloured fills |
| `text/muted` | `#8a8f99` | `#8a8f99` (699) | Muted text & icon strokes (primary neutral) |
| `text/subtle` | `#9fa0a4` | `#9fa0a4` (306) | De-emphasized text / progress track — *kept distinct* (see §8 RC-2) |
| `text/disabled` | `#3a3d45` | Figma `text/disabled` | Disabled text — **corrected**: this hex was previously mislabeled `border/default` (§10) |
| `border/default` | `#5a6070` | Figma `border/strong` | Borders / dividers — **corrected** from `#3a3d45` (§10) |

### Brand ramp (blue)
| Token | Canonical hex | Source | Role |
|---|---|---|---|
| `brand/default` | `#0088ff` | Figma `brand/default` | Brand primary — CTAs, active, accents |
| `brand/hover` | `#0099ff` | Figma `brand/hover` | Brand hover, +1 lightness step — **corrected** from `#4cacff` (§10) |
| `brand/pressed` | `#0077e6` | Figma `brand/active` | Brand dark — pressed |
| `brand/highlight` | `#4cacff` | Figma `color/primary/hover` | Light brand tint — link hover / highlight (was previously `brand/hover`) |
| `brand/dark-600` | `#1379f3` | Figma `dark/brand/600` | Dark-theme brand 600 step |
| `brand/subtle` | `#0088ff` @ low opacity | (derived) | Tint background for selected/focus (via `opacity/*`) |

**Figma reverses RC-3:** `#0099ff` and `#1379f3` were previously collapsed into `brand/default` as "accidental
near-duplicates"; Figma defines them as the real `brand/hover` and `dark/brand/600`. See §8 RC-3 (superseded) + §10.

### Status set (the 6 gig statuses)
| Token | Canonical hex | Observed fill (count) | Status (RU) |
|---|---|---|---|
| `status/open` | `#8a8f99` (neutral) | `white`/`#8a8f99` | Открыт |
| `status/review` | `#f59e0b` | `#f59e0b` (6) | На рассмотрении (amber) |
| `status/in-progress` | `#3b82f6` | `#3b82f6` (6) | В работе (blue) — **kept separate from `brand/default`** (see §8 RC-4) |
| `status/verification` | `#8b5cf6` | `#8b5cf6` (6) | На проверке (purple) |
| `status/completed` | `#10b981` | `#10b981` (6); `#0cc671` (4) collapsed | Завершён (green) |
| `status/rejected` | `#ef4444` | `#ef4444` (10); `#ff383c` (4) collapsed | Отклонён (red) |

### Category set (the 5 categories)
| Token | Canonical hex | Observed fill (count) | Category (RU) |
|---|---|---|---|
| `category/marketing` | `#0088ff` | `#0088ff`/`#3b82f6` (blue) | Маркетинг |
| `category/design` | `#f45fb1` | `#f45fb1` (28) | Дизайн (pink) |
| `category/programming` | `#0cc671` | `#0cc671` (4) | Программирование (green) |
| `category/development` | `#05c9e6` | `#05c9e6` (4) | Разработка (teal) |
| `category/coding` | `#f27c0d` | `#f27c0d` (4) | Кодинг (orange) |

> **Two greens, two roles.** `#10b981` (status/completed) and `#0cc671` (category/programming) are **not**
> collapsed — they are distinct *roles* that happen to be close. `#0cc671`'s appearance as an alt completed-green
> is the accidental near-duplicate (collapsed into `status/completed`); its canonical home is
> `category/programming`. See §8 RC-5.

**Coverage:** all 22 distinct six-digit fills + `white` are accounted for above (mapped to a canonical token, or
collapsed/promoted with a §8 entry). No observed fill is dropped; no canonical hex is absent from the SVGs.

### Overlay tints (translucent white — from Figma; the outlined SVGs carried no alpha)
Layered fills/strokes over dark surfaces. Stored as `rgba()` so the token pipeline's hex→rgba pass is a no-op.
| Token | Value | Source | Role |
|---|---|---|---|
| `overlay/fill` | `rgba(255,255,255,0.05)` | Figma ФОН 1 `#ffffff0d` | Subtle fill — tag/status bg, panel base |
| `overlay/line` | `rgba(255,255,255,0.08)` | Figma Контур `#ffffff14` | Hairline contour — gig card border |
| `overlay/line-strong` | `rgba(255,255,255,0.2)` | Figma frame stroke `#ffffff33` | Frame border — job-experience card |
| `overlay/header` | `rgba(255,255,255,0.01)` | Figma BG/Header 1 `#ffffff03` | Glass header fill |

### Accent
| Token | Canonical hex | Source | Role |
|---|---|---|---|
| `accent/pink` | `#ff2d55` | Figma Accents/Pink | Accent pink — gig company avatar fill |

## 1.2 Radius scale

The 13 observed `rx` values (`DESIGN_SPECS.md §3`) snap to a 7-step canonical scale. The dominant component
radius (`8px`) and the pill radius (`18px`) are preserved as canonical steps.

| Token | Canonical px | Observed `rx` snapped (count) | Role |
|---|---|---|---|
| `radius/xs` | 2 | 2 (27), 2.5 (3) | Tiny inner chips / accents, progress-bar track |
| `radius/sm` | 4 | 3 (3), 3.5 (10), 4 (8), 4.5 (39), 5 (6) | Tags, radios, small controls |
| `radius/md` | 8 | 8 (38) | **Cards / inputs / buttons** (dominant component radius) |
| `radius/lg` | 12 | 11 (4), 12 (16), 13 (2) | Panels / medium containers |
| `radius/xl` | 16 | 16 (2) | Large containers |
| `radius/pill` | 18 | 18 (4) | Pills / fully-rounded containers |
| `radius/circular` | 50% | avatars (24→r12, 32→r16) | Avatars — radius = half the dimension, not a fixed px |

Snaps logged in §8 (RC-6): `2.5→xs`, `3/3.5/4/4.5/5→sm`, `11/13→lg`. Avatar `rx=12`/`rx=16` are circular
(half-dimension), incidentally equal to `lg`/`xl` at 24/32px — see §8 RC-7.

## 1.3 Spacing scale + size tokens

Spacing is not a first-class block in the raw substrate (it is scattered through `DESIGN_SPECS.md §5` geometry
and screen-observed one-offs). The canonical spacing scale is a regular **base-4 grid**; observed one-offs snap to
the nearest step (logged in §8 RC-8). Non-spacing dimensions are captured as named **size tokens**.

### Spacing scale (base-4)
| Token | px | Provenance / observed use |
|---|---|---|
| `space/0` | 0 | flush |
| `space/1` | 4 | hairline gaps |
| `space/2` | 8 | tight gaps (icon↔label) |
| `space/3` | 12 | **standard inset** (nav icon left inset, control padding — §5) |
| `space/4` | 16 | standard gap; one-off `17→16` |
| `space/5` | 20 | one-offs `20`, `21→20` |
| `space/6` | 24 | section gap; one-off `24` |
| `space/8` | 32 | block gap; one-off `30→32` |
| `space/10` | 40 | large gap = control-height pitch |
| `space/12` | 48 | region gap; one-off `47→48` |

### Size tokens (fixed dimensions, not spacing)
| Token | px | Provenance (`DESIGN_SPECS.md §5`) |
|---|---|---|
| `size/control` | 40 | **standard control height** — button / input / status pill / dropdown all measure 40px tall |
| `size/icon` | 16 | standard icon (73 clipPath rects are exactly 16×16) |
| `size/icon-rail` | 20 | collapsed-rail nav icon (20×20) |
| `size/avatar-sm` | 24 | small avatar (24×24, `radius/circular`) |
| `size/avatar-lg` | 32 | large avatar (32×32, `radius/circular`) |

Observed one-offs `17 / 20 / 21 / 24 / 30 / 47` are each addressed in §8 (RC-8): `17→space/4`, `20/21→space/5`,
`24→space/6`, `30→space/8`, `47→space/12`. No off-grid one-off survives unlogged.

## 1.4 Type scale

Figma exposes the real text styles (size, line-height, weight, letter-spacing, per-role family). Each role maps to
a Figma style; the family axis is `sans` (**SF Compact**, the "primary" UI/body face) or `mono` (**NKDuy Mono**,
the "accent" display/data face). The SVG text was outlined to paths (`DESIGN_SPECS.md §7.3`), so these metrics
could not be recovered from the substrate — they come from Figma.

| Role token | Size px | LH px | Weight | Tracking | Family | Figma style · use |
|---|---|---|---|---|---|---|
| `type/display` | 32 | 37 | 600 | -0.5 | mono | Heading/H1 — page title |
| `type/h1` | 24 | 29 | 500 | -0.3 | mono | Heading/H2 — section heading |
| `type/h2` | 18 | 23 | 600 | 0 | sans | Heading/H3 — card titles |
| `type/title` | 16 | 22 | 600 | 0 | sans | *(retained — no Figma style at 16px)* panel title |
| `type/body` | 15 | 19 | 400 | 0 | sans | Body/Default — body copy |
| `type/label` | 13 | 15 | 500 | 0.3 | sans | Label/Default — labels, nav, buttons |
| `type/label-bioname` | 13 | 15 | 600 | 0.3 | sans | Label/Bioname — semibold label |
| `type/caption` | 11 | 11 | 400 | 0.2 | sans | Caption/Default — metadata, counts |
| `type/mono` | 14 | 17 | 400 | 0 | mono | Data/Default — tabular data (`30 000 ₽`) |
| `type/mono-small` | 12 | 13 | 400 | 0 | mono | Data/Small — small data |

- **Families:** `sans` = SF Compact covers h2/title/body/label/label-bioname/caption; `mono` = NKDuy Mono covers
  display/h1/mono/mono-small. **Display & section headings are set in the mono/accent face**, matching the screens
  (uppercase "ПРОФИЛЬ" page title, "Стек"/"Опыт" section headings).
- **Supersedes the earlier "structure-only" scale** (the `22px` auth-heading anchor is retired; `type/h1` is now
  the real 24px Figma Heading/H2).
- **Residual → `typography-system` (RC-9, now narrowed):** only the **font files + SF Compact web licence** remain
  capped; the scale metrics + per-role families + tracking are sourced from Figma and serialized into the token JSON.

---

# 2. Semantic Token Taxonomy

Tokens reference **meaning**, never a raw value. This taxonomy is the exact shape `design-token-engine` will
serialize into the token JSON — namespace names are stable and each leaf has exactly one canonical value.

## 2.1 Naming convention

**`namespace/role[-modifier]`** — lowercase, `/`-separated, `kebab` roles. A name encodes role/meaning
(`surface/level-2`, `text/muted`, `status/in-progress`, `radius/md`, `space/4`) and **never** the raw value
(never `blue-0088ff`, never `radius-8`). One canonical value per leaf; numeric scale steps are ordinal
(`level-0..3`, `space/1..12`), not pixel-named.

## 2.2 Namespaces

| Namespace | Covers | Source scale |
|---|---|---|
| `surface/*` | `level-0`, `level-1`, `level-2`, `level-3`, `level-3-hover` | §1.1 surface ramp |
| `text/*` | `strong`, `inverse`, `muted`, `subtle`, `disabled` | §1.1 text/neutral |
| `border/*` | `default` (`#5a6070`) | §1.1 border |
| `brand/*` | `default`, `hover`, `pressed`, `highlight`, `dark-600`, `subtle` | §1.1 brand ramp |
| `overlay/*` | `fill`, `line`, `line-strong`, `header` (translucent white) | §1.1 overlay tints |
| `accent/*` | `pink` | §1.1 accent |
| `status/*` | `open`, `review`, `in-progress`, `verification`, `completed`, `rejected` | §1.1 status set (6) |
| `category/*` | `marketing`, `design`, `programming`, `development`, `coding` | §1.1 category set (5) |
| `space/*` | `0,1,2,3,4,5,6,8,10,12,16` | §1.3 spacing |
| `radius/*` | `xs`, `sm`, `md`, `lg`, `xl`, `pill`, `full`, `circular` | §1.2 radius |
| `type/*` | `display`, `h1`, `h2`, `title`, `body`, `label`, `label-bioname`, `caption`, `mono`, `mono-small` (each: size/lh/weight/tracking/family) | §1.4 type |
| `size/*` | `control`, `icon`, `icon-rail`, `avatar-sm`, `avatar-lg` | §1.3 size tokens |
| `shadow/*` | `none`, `focus`, `card`, `md`, `popover` | §1.1 / Figma effects |
| `backdrop/*` | `glass`, `blur-bg` (backdrop-filter recipes — documentation; not token utilities) | Figma effects |
| `gradient/*` | `brand-glow`, `status-completed-glow` | Figma / derived |
| `z/*` | `base`, `sticky`, `dropdown`, `modal`, `toast` | structural |
| `opacity/*` | `disabled` (0.4), `subtle` (0.08), `overlay` (0.6) | structural |

Every canonical value from §1 maps to exactly one semantic name above; the 6 statuses and 5 categories are each
named. `shadow/*`, `z/*`, `opacity/*` are structural namespaces declared so the engine has stable slots even where
the flat SVGs encode no elevation/stacking value.

---

# 3. Component Vocabulary + Variant / State / Size Matrices

Two layers: **primitives** (the vocabulary) and **blocks** (domain phrases composed from primitives). Every
variant/state/size axis below is grounded in states **actually present** in the library (`DESIGN_SPECS.md §4` +
the SVGs) — none invented. Each block composes **only** primitives + tokens (no raw values).

## 3.1 Primitives

| Primitive | Variant | State | Size | Notes (provenance) |
|---|---|---|---|---|
| **Button** | `primary`, `secondary`, `ghost`, `link` | `default`, `hover`, `pressed`, `disabled` | `md` (40h) | §4 button states; "К проекту" 99×40 |
| **Input** | `text` | `default`, `focus`, `filled`, `disabled`, `error` | `md` (40h) | 40px control height |
| **PasswordInput** | = Input + reveal | + `revealed` | `md` | reveal `eye` icon = Figma residual (§7.5) |
| **SearchInput** | = Input + search-icon inset + clear | `default`, `focus`, `filled` | `md` | 800×40, icon 16@12px left, clear ✕ 16×16 right (§5) |
| **Select / FilterDropdown** | `default` | `collapsed`, `expanded`, `disabled`; option `default`/`hover`/`selected` | `md` (40h) | dropdown box 106×40 |
| **Filter / Radio** | `radio` | `off`, `hover`, `on`, `disabled` | — | FilterRadio states (§4) |
| **Tabs** | `underline` | tab `default`, `active` (+ optional count badge) | — | PageHeading tabs |
| **Toggle** | `switch` | `off`, `on`, `disabled` | — | Settings (library) |
| **Tag** (tech) | colour-variant set | `default` | `sm` | filled tech tags, 5 colours |
| **CategoryTag** | 5 category variants (left-accent) | `default` | `sm` | 60×23, left-accent in 5 category colours |
| **StatusBadge / Dot** | 6 status variants | form `pill` (126×40), `inline-dot` (8px); + "Текущий" current badge | — | StatusDot×6 (§4) |
| **Avatar** | `circular` (+ `online`) | `default`, `online` | `sm` (24, r12), `lg` (32, r16) | §5 avatar sizes |
| **Rating** | `stars` (+ `online`) | `default` | — | avatar + verified + ★×5 + count + experience tag |
| **ViewToggle** | `grid` / `list` | `grid-active`, `list-active` | — | 60×32, two 24px glyphs |
| **ProgressBar** | `track+fill` | value `0–100` | — | 1006×4, track `text/subtle`, fill `brand/default`, `radius/xs` |
| **ExperienceTag** | labelled pill | `default` | — | `[Senior Frontend Engineer]` |

> Reveal `eye` (PasswordInput) and `attach` (chat composer) icons are **Figma residuals** (`DESIGN_SPECS.md §7.5`)
> — the primitives' *matrices* are defined here; the missing icons route to Figma, not re-drawn.

## 3.2 Blocks

Each block lists its variant axes and the primitives it composes.

| Block | Variant axes | Composes (primitives / sub-blocks) |
|---|---|---|
| **GigCard** | status ×6 × layout `{grid, list}` | StatusBadge, Tag, CategoryTag, Rating, budget (`type/mono`), deadline, "К проекту" Button |
| **ProfileCard** / ProfileHeader | role × `{full, compact}` | Avatar, ExperienceTag, Rating, StatPanel |
| **SidebarNav** | role `{client, specialist}` × `{expanded, collapsed}` | NavMenuItem(+count), logo, ProfileCard, SupportCard, LogoutControl |
| **Topbar** | `default` | ProfileCard (avatar), bell, gear |
| **FilterBar** | `{search-only, full}` | SearchInput, Filter/Select, ViewToggle |
| **MessageBubble** | direction `{in, out}` | text, timestamp, read-state |
| **ConversationItem** | `{read, unread}` | Avatar, last-message, timestamp, unread count |
| **NotificationItem** | type-icon variants | type icon, body, timestamp |
| **MessagesPanel** | `{preview, full}` | ConversationItem·list |
| **ChatPanel** | `default` | MessageBubble·thread + Composer (Input + send + attach) |
| **BannerCard** | `default` | raster art (residual §7.2), headline (`type/display`), CTA Button |
| **StatPanel** | `{single, grid}` | stat tiles (label + value), Rating |
| **RequirementCard** | `default` | title, body, icon — `radius/lg` Panel |
| **CriteriaList** | `default` | checklist rows (icon + text) |
| **ClientCard** | `default` | Avatar, name, Rating, meta |
| **TermsTabs** | `{proposed, client}` | Tabs + structured term rows |
| **ApplyPanel** | `default` | Input(s), Button, structured fields |

### Mapping / admin entities (used by mock-less screens — generativity, §7)
| Block | Variant axes | Composes |
|---|---|---|
| **DataTable** | `{compact, default}` | rows + columns, StatusBadge, Filter |
| **LedgerTable** | `default` | DataTable specialization (amount/`type/mono`, date, status) |
| **DisputeList** / **DisputeDetail** | `{list, detail}` | rows + StatusBadge; detail = Panel + ClientCard + actions |
| **TagList** / **ExperienceList** / **CategoryTags** | `default` | Tag / ExperienceTag / CategoryTag collections |
| **StepIndicator** | step `1..N` (3 for onboarding) | numbered steps |
| **RoleCard** | `{client, specialist}` × `{default, selected}` | icon + label + Radio |
| **CreateGigCTA** | `default` | Button (primary) + label |
| **DangerAction** | `default` | Button (destructive) + confirm |

> **System additions from the generativity proof (`prove-extensibility-admin`, #29).** The admin moderation screens
> (`/admin`, `/admin/users`, `/admin/gigs` — mock-less) were rebuilt **purely from the kit**, surfacing exactly **one**
> genuine gap the spec had already anticipated here under "Mapping / admin entities": the generic **`DataTable`** block.
> It was implemented **on-system** — a token-pure semantic table composed from tokens + the `Panel` layout primitive,
> with `{ columns, rows: { id, cells: ReactNode[] }, empty }` (cells slot `StatusBadge`/`Tag`/text/inline action forms)
> — with **no new token, no new primitive, and no off-token literal** (the generativity gate `lint:generativity` asserts
> the admin screens carry zero off-system values). `LedgerTable` remains its specialization. No other block/primitive/
> token was added: the proof confirms the system is generative (it expresses a screen it was never designed for) and
> that its extensibility process is honest (the one gap is built on-system + recorded here, never patched in a screen).

---

# 4. Layout Grammar + Screen-Composition Pattern

## 4.1 Page templates

### `AppShell` (authenticated app)
Regions / slots: **`sidebar` slot** · **`topbar` slot** · **`content` region**.
States: sidebar **`expanded`** (full nav list) and sidebar **`collapsed`** (20px icon-rail). The content region
binds blocks; it never owns styling.

### `AuthLayout` (auth / register)
Regions: centered **`card` region** + **`footer`** (checkerboard pattern, `patterns/checkerboard.svg`). Used by
`auth`, `reg`, `reg-customer`, `reg-specialist`.

## 4.2 Content layout primitives

All express spacing via the canonical `space/*` scale (no raw px) and radius/padding via `radius/*`.

| Primitive | Axes | Role |
|---|---|---|
| **Stack** | axis `{row, column}`, gap `space/*` | linear flow |
| **Grid** | columns `n`, gap `space/*` | card grids (GigCard·grid) |
| **Split** | ratio, gap `space/*` | two-pane (list ↔ detail, thread ↔ composer) |
| **Section** | title, gap `space/*` | titled content region |
| **Panel** | surface `surface/*`, radius `radius/*`, padding `space/*` | bounded container |
| **Rail** | width `size/icon-rail`-based | narrow icon column (collapsed sidebar) |

## 4.3 Screen-composition pattern

**A screen = Template + slotted Blocks + data bindings.** Screen files contain **composition only** — **no
styling, no layout literals, and no raw markup**. Styling lives in tokens; arrangement lives in layout primitives;
data lives in view-models. (This is the rule the later composition lint in `layout-grammar` enforces, and Fidelity
DoD **F5**.)

---

# 5. Typed Block View-Model Contracts

Each block declares a typed, **schema-independent** view-model (field names + types) — the shape of the data it
*displays*, not Prisma tables. Blocks render from fixtures before Phase 1 models exist. The "Fulfilled by" column
notes the Phase 1 data change expected to provide the data (per the planning doc's data-model worklist), without
depending on it existing yet.

```ts
// — Cards & profile —
GigCardVM {
  id: string; title: string; category: Category; tags: string[];
  status: Status; budget: Money; deadlineDays: number;
  rating: { value: number; count: number; verified: boolean };
  clientName?: string; isCurrent?: boolean; layout: 'grid' | 'list';
}                                                   // Fulfilled by: ratings, categories, deadline-and-milestones
ProfileHeaderVM {
  avatar: ImageRef; name: string; roleTag: string; verified: boolean;
  memberSince: DateISO; location?: string; stats: StatVM[];
}                                                   // Fulfilled by: profile-evolution, ratings
ProfileCardVM { avatar: ImageRef; name: string; roleTag?: string; rating?: RatingVM }
ClientCardVM  { avatar: ImageRef; name: string; rating: RatingVM; meta?: KeyVal[] }
StatPanelVM   { stats: { label: string; value: string | number }[] }
RatingVM      { value: number; count: number; verified: boolean; online?: boolean }

// — Navigation & shell —
SidebarNavVM  { role: 'client' | 'specialist';
                items: { icon: IconRef; label: string; href: string; count?: number; active: boolean }[];
                collapsed: boolean; profile: ProfileCardVM }
TopbarVM      { profile: ProfileCardVM; unreadNotifications: number }
FilterBarVM   { query?: string; filters: FilterOptVM[]; view: 'grid' | 'list' }

// — Messaging —
MessageBubbleVM    { direction: 'in' | 'out'; author: string; timestamp: DateISO; body: string; readState?: 'sent' | 'read' }
ConversationItemVM { id: string; avatar: ImageRef; name: string; preview: string; timestamp: DateISO; unread: number }
NotificationItemVM { id: string; type: NotifType; body: string; timestamp: DateISO; read: boolean }
MessagesPanelVM    { conversations: ConversationItemVM[] }
ChatPanelVM        { thread: MessageBubbleVM[]; composer: { canAttach: boolean } }

// — Gig detail & onboarding —
RequirementCardVM { title: string; body: string; icon?: IconRef }
CriteriaListVM    { items: { label: string; met?: boolean }[] }
TermsTabsVM       { proposed: TermRow[]; client: TermRow[] }
ApplyPanelVM      { fields: FieldVM[]; submitLabel: string }
BannerCardVM      { headline: string; body?: string; cta?: { label: string; href: string }; art?: ImageRef }

// — Admin / mapping (generativity) —
DataTableVM   { columns: ColSpec[]; rows: Record<string, Cell>[] }
LedgerTableVM { entries: { date: DateISO; label: string; amount: Money; status: Status }[]; balance: Money }
DisputeListVM { disputes: { id: string; gig: string; status: Status; opener: string }[] }
StepIndicatorVM { steps: { label: string; done: boolean }[]; current: number }
```

`Money`, `DateISO`, `ImageRef`, `IconRef`, `Status`, `Category` are scalar/enum aliases (Status = the 6-status
enum; Category = the 5-category enum) — schema-independent. Each contract references displayed data, never query
shapes. Fulfilling Phase 1 changes: `ratings-reviews-model`, `category-taxonomy`, `gig-deadline-and-milestones`,
`profile-evolution`, `terms-negotiation`, `finances-ledger`, `disputes-flow`, `account-preferences`.

---

# 6. Screen-Composition Map (12 sample screens)

Each screen is an **instance** = `Template + Blocks + data bindings`. The screens are **regression instances**,
not the spec. (`customer-profile.jpg` from the planning doc does **not** exist — `screens/` holds exactly 12 JPGs;
it is excluded.)

| Screen (`screens/*.jpg`) | Template | Blocks (composition) |
|---|---|---|
| `auth` | AuthLayout | StepIndicator + Form primitives (Input, PasswordInput, Button) |
| `reg` | AuthLayout | StepIndicator + RoleCard + Form primitives |
| `reg-customer` | AuthLayout | StepIndicator(3) + Form primitives (client fields) |
| `reg-specialist` | AuthLayout | StepIndicator(3) + Form primitives + CategoryTags |
| `customer-dashboard` | AppShell | BannerCard + Tabs + GigCard·grid + CreateGigCTA + MessagesPanel |
| `customer-projects` | AppShell | FilterBar + Tabs + GigCard·list |
| `specialist-dashboard` | AppShell | BannerCard + Tabs(5+counts) + GigCard·grid + FilterBar + MessagesPanel |
| `specialist-gig-search` | AppShell | FilterBar + ViewToggle + GigCard·(grid/list) |
| `specialist-gig` | AppShell | ProfileHeader/GigHeader + RequirementCard·grid + CriteriaList + ClientCard + TermsTabs + ApplyPanel + ChatPanel |
| `specialist-projects` | AppShell | FilterBar + Tabs + GigCard·list |
| `specialist-chats` | AppShell | Split( ConversationItem·list + MessagesPanel ↔ ChatPanel ) |
| `specialist-progile` | AppShell | ProfileHeader + StatPanel + TagList + ExperienceList + CategoryTags + GigCard·grid |

All 12 share `SidebarNav` + `Topbar` via `AppShell` (except the 4 AuthLayout screens). Every block referenced is
defined in §3.2; every layout primitive in §4.2.

---

# 7. System Coverage Matrix

Proves nothing is left unaccounted: every library component, every screen element, and every raw value resolves to
a system entity — or is logged as a one-off (§8) or a system gap.

## 7.1 Library component → vocabulary (no orphan)

Every component in `DESIGN_SPECS.md §4` maps to a primitive, block, or composition:

| Library component (§4) | System entity |
|---|---|
| NavMenuItem (+count, states; expanded/collapsed) | part of **SidebarNav** block |
| SidebarNav (expanded list + collapsed icon-rail) | **SidebarNav** block × `{expanded, collapsed}` |
| TopbarProfileCard (avatar + bell + gear) | **Topbar** block (ProfileCard + bell + gear) |
| Tag (tech, 5 colours) | **Tag** primitive |
| CategoryTag (left-accent, 5) | **CategoryTag** primitive |
| FilterRadio (off/hover/on/disabled) | **Filter/Radio** primitive |
| FilterDropdown (collapsed/expanded) | **Select/FilterDropdown** primitive |
| StatusDot×6, "Текущий" badge | **StatusBadge/Dot** primitive |
| ProgressBar | **ProgressBar** primitive |
| SearchInput (with clear ✕) | **SearchInput** primitive |
| RatingRow (avatar+verified+★×5+count+exp tag, online) | **Rating** primitive |
| Button (primary/hover/pressed/secondary/ghost/disabled/link) | **Button** primitive |
| ExperienceTag | **ExperienceTag** primitive |
| ViewToggle (grid/list) | **ViewToggle** primitive |
| Sidebar (logo + «/» collapse + profile + nav + support) | **SidebarNav** block |
| SupportCard (help + input + send ✈) | sub-block within **SidebarNav** |
| LogoutControl | part of **SidebarNav** block |
| SearchBar (+ filter dropdowns) | **FilterBar** block |
| PageHeading (blue accent) + Tabs | **Tabs** primitive + Section |
| GigCard (6 status variants) | **GigCard** block |
| MessageBubble (in/out) | **MessageBubble** block |
| ConversationItem | **ConversationItem** block |
| NotificationsPanel | **NotificationItem** block ·list |

→ **No inventoried component is left without a vocabulary mapping.**

## 7.2 Raw value coverage (no silent drops)

- **Colour:** all 22 distinct six-digit fills + `white` → §1.1 (mapped) or §8 (collapsed/promoted). ✔
- **Radius:** all 13 observed `rx` → §1.2 (snapped to a step) + §8 RC-6/RC-7. ✔
- **Spacing one-offs:** `17/20/21/24/30/47` → §1.3 (snapped) + §8 RC-8. ✔

It is verifiable (greppable) that none was silently dropped — each appears in a mapping or a §8 entry.

## 7.3 Screen element coverage (no unaccounted one-offs)

Each of the 12 screens (§6) is expressed as `Template + Blocks + data bindings`; every distinct visual element
resolves to a system entity (token / primitive / block / layout primitive). Screen-level deviations from the
canonical scale (e.g. the spacing one-offs `17/21/30/47`, near-duplicate colour appearances) are **normalized to
the system** and recorded in §8 — there are **no unaccounted one-offs** enshrined as screenshot-specific values.

## 7.4 Generativity check (mock-less screens — `prove-extensibility-admin`)

The vocabulary must express the mock-less screens with **no new entity**:

| Mock-less screen | Composable from | New entity needed? |
|---|---|---|
| Admin moderation `/admin/*` | AppShell + DataTable + FilterBar + StatusBadge + Tabs | **none** |
| Финансы `/finances` | AppShell + StatPanel + LedgerTable | **none** |
| Споры `/disputes` | AppShell + DisputeList + DisputeDetail + StatusBadge | **none** |
| Settings `/settings` | AppShell + Select + Toggle·list + DangerAction | **none** |

**Result:** all four are expressible from the defined vocabulary with **zero new tokens/primitives/blocks**.
**System gaps recorded:** none required by these screens beyond what §3 defines. The `eye` (password reveal) and
`attach` (chat composer) **icons** remain Figma residuals (§7.5 of `DESIGN_SPECS.md`) — asset gaps, not vocabulary
gaps. This confirms the vocabulary is generativity-ready for `prove-extensibility-admin`.

---

# 8. Reconciliation Log

Complete log of every deviation surfaced in §§1–7. Each entry: **observed deviation → decision
(normalize / variant / flag) → canonical entity.** The system, not any screenshot, is authoritative.

| # | Observed deviation | Decision | Resolves to |
|---|---|---|---|
| RC-1 | Surface near-pair `#1a1a24` (28) vs `#1a1d2a` (24) | **promote-to-variant** — co-occur as elevated vs hover | `surface/level-3` + `surface/level-3-hover` |
| RC-2 | Neutral near-pair `#8a8f99` (699) vs `#9fa0a4` (306) | **keep distinct** — different roles (muted text vs subtle/track) | `text/muted` + `text/subtle` |
| RC-3 | Brand blues `#1379f3` (2), `#0099ff` (1) | **SUPERSEDED by Figma (§10)** — not dups; real tokens | `brand/dark-600` `#1379f3`, `brand/hover` `#0099ff` |
| RC-4 | Status-blue `#3b82f6` vs brand-blue `#0088ff` | **keep distinct** — distinct roles, must not collapse | `status/in-progress` ≠ `brand/default` |
| RC-5 | Green pair `#10b981` (status) vs `#0cc671` (category) | **keep distinct (two roles)**; `#0cc671`-as-completed is the accidental dup | `status/completed` `#10b981` + `category/programming` `#0cc671` |
| RC-5b | Red pair `#ef4444` (10) vs `#ff383c` (4) | **normalize** — same role, near-dup | collapsed into `status/rejected` `#ef4444` |
| RC-6 | Radius cluster `2/2.5` and `3/3.5/4/4.5/5` and `11/12/13` | **normalize (snap)** | `2.5→radius/xs`; `3/3.5/4/4.5/5→radius/sm`; `11/13→radius/lg` |
| RC-7 | Avatar `rx=12` (24px) / `rx=16` (32px) | **normalize** — circular = half-dimension, not fixed px | `radius/circular` (incidentally equals `lg`/`xl`) |
| RC-8 | Spacing one-offs `17 / 20 / 21 / 24 / 30 / 47` | **normalize (snap to base-4)** | `17→space/4`; `20/21→space/5`; `24→space/6`; `30→space/8`; `47→space/12` |
| RC-9 | Type outlined to paths; no font metrics/licence | **resolved (scale) via Figma (§10)**; licence still flagged | scale metrics §1.4; font files + SF Compact licence residual → `typography-system` |
| RC-10 | `eye` (reveal), `attach` (composer) icons absent from SVGs | **flag (asset residual)** | request from Figma (`DESIGN_SPECS.md §7.5`) — not re-drawn |
| RC-11 | Raster banner art not in SVGs (`<image>` nodes) | **flag (asset residual)** | export from Figma (`DESIGN_SPECS.md §7.2`); BannerCard `art` slot |
| RC-12 | `shadow/*` — flat fills in SVGs, no elevation values | **resolved via Figma (§10)** | `shadow/focus` + `shadow/md` from Figma; `backdrop/glass` + `blur-bg` documented |

**Completeness:** every near-duplicate colour pair, every radius snap, every spacing one-off, and every asset/font
residual is addressed above. No observed deviation is left unaddressed; no screen one-off is enshrined as a
screenshot-specific special case.

---

# 9. Forward dependencies (what later changes consume)

- `design-token-engine` — serializes the §2 taxonomy into `openspec/specs/ui/design-tokens.json` (this change does
  **not** create that file).
- `typography-system` — resolves RC-9 (font files + metrics + SF Compact web licence).
- `layout-grammar` — implements §4 templates + the composition lint enforcing §4.3.
- `ui-primitives` / `domain-blocks` — implement §3 matrices + §5 contracts.
- Phase 2 compositions — implement §6 per-screen maps.
- `prove-extensibility-admin` — exercises §7.4 generativity.

---

---

# 10. Figma Reconciliation (2026-06-17)

When Figma MCP access became available, the canonical values were re-sourced from the Figma **`tokens`** frame
(`3870:7654`, exported to [`docs/figma-tokens-export.json`](./figma-tokens-export.json)). The SVG substrate
(`DESIGN_SPECS.md`) was an interim stand-in; **where they disagree, Figma is authoritative.** Deltas applied to §1/§2/§8:

**Corrections (value was wrong):**
- `border/default` `#3a3d45` → **`#5a6070`** (Figma `border/strong`). The old hex is the real **`text/disabled`** (added).
- `brand/hover` `#4cacff` → **`#0099ff`** (Figma `brand/hover`). The old light tint is preserved as **`brand/highlight`**.

**Reversed reconciliation decisions:**
- **RC-3** collapsed `#0099ff`/`#1379f3` as accidental brand duplicates. Figma defines them as **`brand/hover`** and **`brand/dark-600`** — both restored as real tokens.

**New tokens (Figma defines; the outlined SVGs lacked them):** `accent/pink` `#ff2d55`; `overlay/{fill,line,line-strong,header}`
(translucent whites); `shadow/focus` + `shadow/md`; `backdrop/glass` + `backdrop/blur-bg`; `gradient/status-completed-glow`;
`space/16` (64px); `radius/full`.

**Type scale (RC-9):** the structure-only placeholder scale is replaced by real Figma metrics (size/lh/weight/tracking)
+ per-role family (`sans` SF Compact / `mono` NKDuy Mono), plus roles `type/label-bioname` and `type/mono-small`.
Only the font *files* + SF Compact web licence remain capped (`typography-system`).

**Unchanged (already matched Figma):** the full surface ramp, `brand/default`/`pressed`, all 6 statuses, all 5
categories, the spacing/radius/size scales, and §3–§7 (component vocabulary, layout grammar, view-model contracts,
screen maps, generativity) — none of which depend on the corrected values.

## 10.1 Screen-level reconciliation (2026-06-17, change `reconcile-design-tokens-from-figma`)

The §10 pass re-sourced the **`tokens` frame**. A subsequent import of the **18 composites + 14 screens**
([`docs/figma-components-export.md`](./figma-components-export.md), [`docs/figma-screens-export.md`](./figma-screens-export.md))
surfaced three values that live **raw in component/screen designs and were never Figma variables**, so the §10
token re-source could not see them. Each is resolved here; later block/screen changes inherit these token targets.

- **RC-S1 — third blue `#006ccb` → normalize to `brand/default` `#0088ff` (no new token).** The job-experience
  role text on `Профиль/specialist` (node `3088:3896`) used `#006ccb`, distinct from `brand/default #0088ff`,
  `brand/highlight #4cacff`, and the `Специальность` atom's `#0088ff`. It is an accidental near-duplicate of the
  brand/link blue, not a sanctioned tier. **Decision:** the JobExperienceCard role text and the specialty/role tag
  both bind **`brand/default`**; `#006ccb` is not added as a token. *(If the designer confirms it is intentional,
  add `brand/link #006ccb` and update this entry.)* All three blues now map: `#0088ff`→`brand/default`,
  `#4cacff`→`brand/highlight`, `#006ccb`→`brand/default` (normalized).

- **RC-S2 — non-token font families `Vremena Grotesk` / `IBM Plex Sans` / `Inter` → no new family tokens (MVP).**
  Seen raw in message/notification bodies + gig price/term values (Vremena), embedded gig titles + the file chip
  (IBM Plex), and attention-card emoji markers (Inter). The model binds only `font/family/sans` (SF Compact) and
  `font/family/mono` (NKDuy Mono). **Decision:** treat Vremena Grotesk and IBM Plex Sans as **designer placeholders**
  — map that text to **`font/family/sans`** (titles/data to existing roles) for the MVP; **`Inter` is already the
  dev-stage substitute for `sans`**, not a third family in code. **Flagged for designer confirmation**; revisit and
  add a family token only if a distinct family is confirmed intentional. The SF Compact / NKDuy Mono web licence
  remains the only type cap (owned by `typography-system`).

- **RC-S3 — category hues confirmed against component fills (no change).** The five `category/*` tokens
  (`marketing #0088ff`, `design #f45fb1`, `programming #0cc671`, `development #05c9e6`, `coding #f27c0d`) equal the
  `tag`/`Category` component-variant fills recorded in the import docs. The export's `marketing #0088ff` **vs**
  `Blue #4cacff` ambiguity is resolved: **`marketing = #0088ff` (brand)**; `#4cacff` is **`brand/highlight`**, the
  tint used for the "Стек" Blue tag *label*, not a category. Note the Figma hues are raw component fills (not bound
  variables), so this mapping is the authoritative binding by confirmation.

*Pipeline note:* the §10 reconcile edited `design-tokens.json` and regenerated `scripts/generated-tokens.{js,css}`
but those edits were **uncommitted** in the working tree (last commit 2026-06-14); RC-S1–S3 add **no token changes**,
so regeneration is a no-op beyond the timestamp and the §10 reconcile should be committed alongside this change.

## 10.2 Primitive-layer token decisions (2026-06-17, change `add-missing-primitives`)

Adding the missing primitives surfaced two token decisions:

- **RC-P1 — danger Button variant → reuse `status/rejected` (no new token).** The Figma session-delete button uses
  an iOS-red (`Colors/Red`) text + a 20% red tint; the palette has no `accents/red` (the nearest is
  `status/rejected`). **Decision:** the `danger` Button variant binds `status-rejected` (`bg-status-rejected/20`,
  `text-status-rejected`, `border/default`) — token-pure, no near-duplicate red minted. The iOS-red ↔
  status-rejected hue delta is accepted; revisit only if the designer confirms a distinct destructive red.
- **RC-P2 — added `surface/inverse` (`#ffffff`) token.** The `Специальность` specialty chip is a **white** chip on
  the dark profile; the surface ramp is all-dark. Per the generativity principle (a real gap is added to the
  system), a `surface/inverse` token was added to `design-tokens.json` (the surface mirror of `text/inverse`),
  regenerated into `scripts/generated-tokens.{js,css}` (33 colours), and consumed by `SpecialtyTag` as
  `bg-surface-inverse` — no raw `#ffffff` literal. Cited from `docs/figma-screens-export.md` / `figma-components-export.md`.

---

*Provenance: §3–§7 trace to the SVG substrate ([`docs/DESIGN_SPECS.md`](./DESIGN_SPECS.md)); the §1/§2 token values
are sourced from the Figma `tokens` frame ([`docs/figma-tokens-export.json`](./figma-tokens-export.json)) and
serialized into `openspec/specs/ui/design-tokens.json`. This SSOT supersedes any individual screenshot where they
conflict; where the SVG substrate and Figma disagree, Figma wins (§10).*
