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

- **RC-S3 — category hues confirmed against component fills (no change).** ⚠️ **SUPERSEDED on `marketing` by RC-T2
  (§10.9, 2026-06-19)** — the full `Category.jsx` source shows the Category `blue` variant is `rgb(76,172,255)` =
  **#4cacff**, so `marketing` was corrected to #4cacff; the rest of this entry stands. The five `category/*` tokens
  (`marketing #0088ff`, `design #f45fb1`, `programming #0cc671`, `development #05c9e6`, `coding #f27c0d`) equal the
  `tag`/`Category` component-variant fills recorded in the import docs. The export's `marketing #0088ff` **vs**
  `Blue #4cacff` ambiguity is resolved: ~~**`marketing = #0088ff` (brand)**~~ → **`marketing = #4cacff` (RC-T2)**;
  `#4cacff` is also `brand/highlight` (kept as a distinct semantic). Note the Figma hues are raw component fills (not
  bound variables), so this mapping is the authoritative binding by confirmation.

*Pipeline note:* the §10 reconcile edited `design-tokens.json` and regenerated `scripts/generated-tokens.{js,css}`
but those edits were **uncommitted** in the working tree (last commit 2026-06-14); RC-S1–S3 add **no token changes**,
so regeneration is a no-op beyond the timestamp and the §10 reconcile should be committed alongside this change.

## 10.9 Token re-ground to gigly_full_design (2026-06-19, change `reconcile-tokens-to-full-design`)

The full design handoff [`gigly_full_design/`](../gigly_full_design/) (complete `fig-tokens.css` 189-token set +
readable component sources) supersedes the partial export §10.1 worked from. The core values **agreed**; this pass
closes the residual additive gaps + one value correction.

- **RC-T1 — per-status radial/border triads added (text leaves unchanged).** For all 6 statuses, the Figma
  `--status-{name}-{bg-radial,border,text}` triad is now token-backed: `gradient.status-{name}-glow` (the 5 missing
  radials; `completed` already existed) + a new `color-semantic.status-border.{name}` namespace (6 × 30% tints).
  Figma keys mapped **new → open**, **testing → verification**. The existing `color-semantic.status.{name}` text
  leaves (and `text-/bg-/border-status-*` utilities) are **untouched** — additive only.
- **RC-T2 — `category.marketing` corrected `#0088ff` → `#4cacff`; SUPERSEDES RC-S3.** RC-S3 (from the *partial*
  export) bound `marketing = #0088ff (brand)` and treated `#4cacff` as `brand/highlight` only. The authoritative
  component source `gigly_full_design/design-system/source/Category.jsx` shows the **Category `blue` variant =
  `rgb(76,172,255)` = #4cacff**. Per "the full design is the source of truth," **marketing now = #4cacff** (= the
  value of `brand.highlight`, kept as a distinct semantic). The other four category hues (`design` rose #f45fb1,
  `programming` #0cc671, `development` #05c9e6, `coding` #f27c0d) match `Category.jsx` exactly; `design` was relabeled
  **pink → rose**. *(Reversible if the designer confirms marketing should track brand/default.)*
- **RC-T3 — `status.open` text kept gray `#8a8f99`, not the Figma white.** Figma `status/new/text` is white; the SSOT
  keeps gray for «Открыт» legibility (a sanctioned divergence). The open **radial + border** are still sourced from
  the Figma white-based stops, so the glow/border match while the label stays legible.
- **RC-T4 — scales completed (legacy keys kept).** Added `effect.shadow.sm`/`lg` (Figma Shadow/sm/lg; `card`/`popover`
  retained as aliases), `numbers.spacing` `20`(80px=5xl)/`24`(96px=6xl). `numbers.corner` already covered the Figma
  radii (xl 16 = `special`, xs 2 = `lt`) — verified + annotated, no change. No existing token key removed.

*Pipeline:* `design-tokens.json` edited + `scripts/generated-tokens.{js,css}` regenerated; `validate:tokens` reports
45 canonical colours (was 39; +6 `status-border`), in sync, no parody; `lint:tokens` baseline unchanged.

## 10.10 Runtime theming — the light theme (2026-06-19, change `add-light-theme`)

The net-new **light theme** (`gigly_full_design/ТЗ — Светлая тема.md`) made the token appearance layer
**runtime-switchable** instead of build-baked.

- **RC-T5 — appearance tokens are var-backed; theme switches on `[data-theme]`.** The parser now emits
  `tokens.colors/boxShadow/gradient` to Tailwind as `var(--<key>)` (was literal hex); the dark values live in
  `generated-tokens.css` `:root` and the light overrides in `[data-theme="light"]`; `app/globals.css` `@import`s that
  layer (it was previously unused). Every **token-pure** utility now themes for free. **Dark stays the default and is
  visually unchanged** (dark var values == the prior literals). The validator's drift check moved to the CSS-var layer.
- **RC-T6 — depth via shadow + grey, not glow; brand + Handjet invariant.** `light` siblings build light depth
  (surfaces `#f4f5f7`/`#fff`/`#eceef1`, hairlines `#e6e8ec`, navy-tinted shadows; the status radial glows → flat 8–10%
  fills; overlays → dark hairlines). `brand.default #0088ff` and the font families take **no** light override (the
  brand anchor); status hues stay one-to-one.
- **RC-T7 — `/opacity` modifiers can't apply to `var()` colours → `tint.*` tokens.** `bg-brand-default/10` (×3) and
  `bg-status-rejected/20|30` (danger) compiled to *nothing* once the colours became `var()`; replaced with full-value
  `tint/{brand,danger,danger-hover}` tokens (`brand` muted on light, ТЗ §4). General rule: **no Tailwind `/NN` opacity
  modifier on a var-backed colour — mint a tint token.**
- **Switch:** `lib/theme.ts` (`applyTheme`/`getStoredTheme`, `gigly-theme`) + a no-flash boot `<script>` in
  `app/layout.tsx` (applies the stored theme before paint) + the Settings → Внешний вид `Select`.
- **Deferred (NOT in this change):** the exhaustive per-screen visual review + WCAG-AA audit of every screen/modal in
  both themes (→ Phase-3 reconciliations + a `light-theme-screen-audit` follow-up); the 74 baselined legacy raw-literal
  occurrences (won't theme); the logo-on-light "плашка" decision (ТЗ §5, designer); `prefers-color-scheme` + transitions.

*Pipeline:* `validate:tokens` 48 colours (was 45; +3 `tint`), var-backed + dark/light layers in sync; `lint:tokens`
baseline unchanged; `theme-switch` E2E green (default dark, toggle→light persists across reload, switch back→dark).

## 10.11 Light-theme acceptance pass (2026-06-20, change `light-theme-screen-audit`)

Closes the `add-light-theme` deferred scope (ТЗ §3/§5/§8.4/§9): contrast enforcement, literal elimination, the logo,
and a both-themes render sweep.

- **RC-T8 — WCAG-AA contrast gate (both themes).** New `scripts/design-system/validate-contrast.js` (`lint:contrast`)
  computes the ratio for every text×surface token pair in dark + light: **body 4.5:1** (`text.strong/muted/subtle`),
  **large 3:1** for `status.*` labels (bold/emphasis pills — keeps the vivid one-to-one hues + leaves the shipped dark
  theme untouched, e.g. dark verification 4.41:1 passes large). Two documented exceptions (allowlist): white-on-brand
  button (~3.1:1, ТЗ §4 sanctioned) + the dark-theme specialty chip; `text.disabled` is WCAG-exempt.
- **RC-T9 — light tokens tightened for AA.** `text.muted`/`subtle` light → `#565c66` (AA body on near-white);
  `status.open`/`review`/`completed` light darkened (`#767b85`/`#b45309`/`#047857`, hue preserved) for AA-large on
  white. Dark values unchanged.
- **RC-T10 — purity flipped to fail-on-all (0 baseline).** The 74 legacy literals resolved: the **dead-duplicate auth
  trees** (`components/auth/*` + `app/components/auth/*`, both unimported) **deleted** (+ their dead unit tests);
  `app/login/page.tsx` + `app/components/ui/InfoIcon.tsx` **token-migrated** (login also themes now + a stray malformed
  SVG path fixed); `register`/`auth`/`profile` were already clean (stale baseline). `token-purity-baseline.json` emptied
  → any raw literal now fails `lint:tokens`. `login-role-param` + `auth-navigation` E2E updated to the token colours.
- **RC-T11 — logo on light.** Added `surface.logo-plate` (transparent on dark / `#01030e` dark-island on light, ТЗ §5);
  `Logomark` wraps the white mark in the plate so it reads on white. Brand + Handjet invariant.
- **Hydration fix.** Added `suppressHydrationWarning` to `<html>` (`app/layout.tsx`) — the theme boot script mutates the
  root before hydration (the standard next-themes pattern); the `theme-coverage` E2E surfaced the warning.
- **Coverage.** `theme-coverage` E2E loads the key public + protected routes under both themes, asserts the page bg
  switched (themed) + no console error, and captures per-(route×theme) screenshots.

*Pipeline:* `validate:tokens` 49 colours (+`logo-plate`); `lint:contrast` PASS (AA both themes); `lint:tokens` 0
baseline (fail-on-all); `lint:composition` + `build` + `test:unit` (911) + `theme-coverage`/`theme-switch`/auth E2E green.

## 10.12 Bio block (2026-06-20, change `add-bio-block`)

- **RC-S13 — `bio` (2931:2365) + `bio/message/COMPANY` (2931:2366) → one `Bio` block (user axis).** The design's
  identity row (Avatar + name + verify-patch + Rating stars + `Специальность`) is added as a single `Bio` block over
  the existing primitives, with `sizeFor: gig|acc-bio` × `user: specialist|company`. The two Figma nodes collapse into
  one block: the **`user: 'company'`** variant omits `Специальность` (covering `bio/message/COMPANY`) — the §3.2
  "reconcile to a minimal set" principle, avoiding a near-duplicate component. `ChatHeader` is re-implemented to render
  `Bio` (its `ChatHeaderVM` contract preserved, `+ optional specialty`), and the gig-detail CONDITIONS column adopts a
  company `Bio` (bound from `getGigDetail`'s new `bio: BioVM`). `ClientCard` stays (still used by the dispute detail).
  Verified by `Bio` 3-variant render tests + the `compose-chats` / `compose-gig-detail-apply` E2E.

*Pipeline:* `lint:tokens` (Bio token-pure) + `lint:composition` (GigDetail F5) + `build` + `test:unit` (921) +
`compose-chats`/`compose-gig-detail-apply` E2E green.

## 10.13 Gig-detail screen reconciliation (2026-06-20, change `reconcile-gig-detail-apply`)

Re-laid `/gigs/[id]` to the **prototype** `gigDetail` route (`gigly_full_design/Gigly App.dc.html` L437–641), read
directly — NOT the superseded `docs/figma-screens-export.md`. A 2-column composition: **col1** = the `main` GigHeader
(title + tags + description) + `SectionHeader` «Технические требования» (RequirementCard 2-col grid) + `SectionHeader`
«Критерии успеха» (numbered CriteriaList); **col2 «УСЛОВИЯ»** = company `Bio` + `ConditionsPanel` + the role action
rail + «Сообщения» chat.

- **RC-S14 — there is NO files/attachments section; this corrects the prior export-based claim.** The deleted
  pre-design draft carried a «Файлы» section (4 file chips / "sanctioned omission pending a backend"). The real
  prototype `gigDetail` has **no such section** — the only file references in the design are gig-description prose and
  dispute evidence. So there is nothing to render and nothing to defer: **the omission is a design fact**, recorded
  here to supersede the earlier reading. (E2E asserts `getByText('Файлы')` has count 0.)
- **RC-S15 — the conditions panel is a new `ConditionsPanel` block; срок/бюджет are `grotesk` (Manrope) numerics.**
  The prototype col2 «УСЛОВИЯ» panel (a two-tab toggle «Условия {company}» / «Мои условия» + a Статус row + Срок
  выполнения + Бюджет проекта as large numbers + sublabels) does not fit the generic term-row `TermsTabs`, so it is a
  dedicated `ConditionsPanel` block. **This is a sanctioned deviation from the change proposal's "no new component"**
  line — rendering the grotesk numerics + the Статус row + the fee breakdown token-purely in an F5-pure screen
  genuinely requires a block; `TermsTabs` stays in the kit (workbench/tests) untouched. The Срок/Бюджет figures bind
  the `font-grotesk` token (the design's Manrope numeric face, from `adopt-design-fonts`).
- **RC-S16 — the company (owner) sees the fee breakdown; the specialist does not.** The budget block adds **Сервисный
  сбор (10%)** + **Итого к оплате** (from the gig's `serviceFee` / `totalAmount`) only for the gig owner — gated in
  `getGigDetail` (`fee: isOwner ? … : undefined`).
- **RC-S17 — `GigHeader` reconciled to the `main` shape (+ description, − meta row).** `GigHeaderVM` gains
  `description`; the `main` block renders the brief body and **drops the former budget/deadline/posted meta row**
  (срок/бюджет live in `ConditionsPanel`). `getGigDetail` binds `header.description = gig.description`. The status
  label now appears in **two** legitimate places — the `GigHeader` badge and the `ConditionsPanel` Статус row — so the
  E2E status assertions use `.first()`.
- **RC-S18 — «Вернуть на доработку» is a flagged follow-up, NOT invented here.** The prototype owner action set
  includes a return-to-rework button (REVIEW→IN_PROGRESS), but there is **no coded `returnWork` server action**. Per
  "do not invent lifecycle semantics," it is flagged (a code comment in `GigDetail.tsx`) for a future change rather
  than fabricated. Every existing lifecycle flow (apply/withdraw, accept/reject, submit, approve, mark-as-paid,
  messaging, open-dispute) is preserved verbatim — only its column/position changed.

*Pipeline:* `lint:tokens` (GigDetail/GigHeader/Bio/ConditionsPanel token-pure) + `lint:composition` (GigDetail F5, 18
screens) + `build` (`/gigs/[id]`) + `test:unit` (923; the 1 `gig-browse-access` timeout is the known test-db pollution
flake, green in isolation) + `compose-gig-detail-apply` E2E (5/5) green. F1 = structural/overlay match to the
prototype; the absolute ≤1% pixel gate is now live (§10.22).

## 10.14 «Мои гиги» screen (2026-06-20, change `reconcile-my-projects`)

Reconciled the prototype `gigs` screen = **«Мои гиги»** (`ROUTES.md` L11/L27) as a new standalone route.

- **RC-S19 — «Мои гиги» lives at `/my-gigs` (both roles); `/gigs` stays the public browse/search.** The prototype's
  `gigs` "route" is an internal screen key in a single-file click-through, **not a URL contract**. In code `/gigs` is
  already the SPECIALIST browse/search (a real shipped feature the prototype doesn't draw). Per web-routing best practice
  (a bare plural collection route = "all"; a personal subset takes an explicit qualifier; never silently change an
  existing URL's meaning) the own-gigs screen is a **new** F5-pure `@composed-screen` at `/my-gigs` — confirmed with the
  product owner — and browse is untouched. The nav (`lib/nav.ts`) + fixtures now point «Мои гиги» → `/my-gigs` for both
  roles (correcting the prior `/gigs` (client) / `/projects` (specialist) disagreement; the CLIENT link had pointed at a
  route clients are redirected away from).
- **RC-S20 — role-aware content on one route; the prototype's five status tabs.** `getMyGigs(viewer)` factors the
  dashboards' own-gig logic (reuses `toGigCardVM` + `gigDisplayStatus`, same queries — no new gig semantics): CLIENT →
  posted gigs; SPECIALIST → PENDING applications + assigned gigs. Tabs **Все / Заявки / В работе / На проверке /
  Завершённые** with counts; the **«Заявки»** tab is role-aware (CLIENT = own OPEN gigs with applications → derived «На
  рассмотрении»; SPECIALIST = own PENDING applications). Cards whose status maps to no tab (a CLIENT's OPEN gig with 0
  applications) surface under «Все» only — nothing lost.
- **RC-S21 — prototype empty state + skeleton loading.** An empty tab renders «Здесь пока пусто» + «Гигов с таким
  статусом нет. Они появятся здесь, когда изменится статус работ.» (composed from `SectionHeader` + `Notice` — no
  dedicated `EmptyState` block was added; a first-class empty-state block remains a possible later kit addition). A
  `loading.tsx` renders the prototype's 2-column skeleton grid while `getMyGigs` resolves.
- **Deviation — no workbench-registry entry.** The workbench catalog (`app/workbench/registry.tsx`) registers
  blocks/primitives/tokens/templates/layout, **not** composed screens, so `MyGigs` is not catalogued there (matching every
  prior screen, e.g. `Chats`/`GigDetail`). The screen is instead covered by `compose-my-gigs` E2E + `lint:composition`.

*Pipeline:* `validate:tokens` (49) + `lint:tokens` (0 new) + `lint:composition` (MyGigs F5, 19 screens) + `build`
(`/my-gigs` 931 B) + `test:unit` (930) + `compose-my-gigs` E2E (3/3) green. F1 = structural vs the prototype `gigs`
frame; absolute ≤1% now gated live (§10.22).

## 10.15 Chats screen + thread-header Bio completion (2026-06-20, change `reconcile-chats`)

Reconciled `/chats` to the prototype chats screen and **completed** the thread-header `Bio` adoption begun by
`add-bio-block`.

- **RC-S22 — the thread-header `Bio` `user` axis is the counterparty's role, not a constant.** `ChatHeader` had
  hard-coded `user: "specialist"`; a company counterparty (a SPECIALIST viewing the chat) wrongly got specialist
  treatment. `ChatHeaderVM` now carries `counterparty: "specialist" | "company"`, which drives the `Bio` `user` axis —
  company collapses `Специальность`, specialist shows it.
- **RC-S23 — `getChatThread` binds `counterparty` + `specialty`.** It sets `counterparty` from the viewer role (CLIENT
  viewer → specialist counterparty; SPECIALIST viewer → company) and populates `specialty` from the specialist's profile
  (**position → specialization → experienceLevel**, never fabricated; undefined for a company). Presence stays the
  prototype's static «был(-а) недавно». All messaging semantics (sendMessage, participant-only auth, day separators)
  unchanged.
- **RC-S24 — the conversation-list item shows the gig status badge.** `ConversationItemVM` gains `status`;
  `ConversationItem` renders an `inline-dot` `StatusBadge` beside the name; `getConversations` derives it via
  `gigDisplayStatus` (these gigs are assigned → IN_PROGRESS+).

*Pipeline:* `lint:tokens` (0 new) + `lint:composition` (Chats F5) + `build` (`/chats`) + `test:unit` (930, incl. the new
chats-vm counterparty/specialty + domain-blocks ChatHeader axis tests) + `compose-chats` E2E (4/4) green. F1 =
structural vs the prototype `chats` frame; absolute ≤1% now gated live (§10.22).

## 10.16 Settings screen + real session tracking (2026-06-20, change `reconcile-settings`)

Reconciled `/settings` to the prototype «Настройки» and added a real session-tracking backend.

- **RC-S25 — the four prototype sections, kit-composed.** ВНЕШНИЙ ВИД (Тема + Язык via `CheckField`, kept on the
  `lib/theme.ts` `[data-theme]`/localStorage switch; **Валюта display-only ₽** — RUB-only product), УВЕДОМЛЕНИЯ (4
  `ToggleField`: «Новые отклики»/«Сообщения»/«Смена статуса гига»/«Уведомления об оплатах»), ПРИВАТНОСТЬ (2 `ToggleField`:
  «Показывать рейтинг в профиле»/«Показывать статус «онлайн»»), АККАУНТ («Выйти из аккаунта» via the existing
  `logoutUser` + the **preserved** delete-account flow).
- **RC-S26 — the planning assumption was corrected.** The prototype settings has **no** session list and uses inline
  toggles/button-groups, **not** the `SessionRow`/`ToggleField`/`CheckField` kit blocks (those exist in the kit, not the
  screen) — like the gig-detail no-files correction. This change *adopts* the blocks (kit-consistent) and the prefs grew
  by `notifyPayments`/`showRatingInProfile`/`showOnlineStatus` (User Booleans, default true) so they persist.
- **RC-S27 — real session tracking (owner-approved addition beyond the prototype).** New `Session` model;
  `createSession` captures user-agent + IP (`headers()`) and embeds the row id as the JWT `sid`; `getSession` is
  **backward-compatible** (reads `sid` when present, never requires a `Session` row — sid-less tokens + the test harness
  keep working); `destroySession`/`logoutUser` deletes the current row; `terminateSession(id)` is ownership-checked
  (self-logout when current). `getActiveSessions` → `SessionRowVM[]` (title = the UA parsed via `lib/user-agent.ts`,
  current = `active`). **Location is omitted** (no geo backend — not fabricated). The «Активные сессии» section is a
  sanctioned extension beyond the prototype.

*Pipeline:* `lint:tokens` (0 new) + `lint:composition` (Settings F5, 19 screens) + `build` (`/settings`) + `test:unit`
(937, incl. new `session-tracking` + extended `settings-vm`/`account-preferences`; auth suite green = backward-compat) +
`compose-settings` E2E (5/5) green. F1 = structural vs the prototype «Настройки»; absolute ≤1% now gated live (§10.22).

## 10.17 Company «Отклики» screen (2026-06-20, change `build-applications-screen`)

Lifted the company applicant list out of gig-detail into a dedicated, **gig-scoped** «Отклики» screen.

- **RC-S28 — the «Отклики» screen lives at `/gigs/[id]/applications` (gig-scoped, owner-only).** The prototype screen
  is per-gig («на проект «{title}»» + «← Назад к проекту» + the gig-detail «Смотреть отклики (N)» entry point), not a
  cross-gig inbox. The page is owner-gated (`getGigApplications` returns null → redirect to `/gigs/[id]` for non-owners).
  It renders «← Назад к проекту», a `SectionHeader` «Отклики» + count + the «на проект «{title}»» subtitle, a derived
  «Назначен {name} — гиг переходит «В работу». Остальные отклики отклонены автоматически.» success notice when assigned,
  the `ApplicantCard` list, and an «Откликов пока нет.» empty state.
- **RC-S29 — new `ApplicantCard` block.** Canonicalizes the repeated applicant card: a `ProfileCard` identity row +
  status pill, the tech tags, and **Подход / Уточняющие вопросы / Оценка трудозатрат** (`RequirementCard`), with an
  **`children` actions slot** the screen fills with the inline Принять/Отклонить forms (server-action wiring stays in the
  screen — F5; `compose-screen-inline-islands`).
- **RC-S30 — gig-detail's owner list → the «Смотреть отклики (N)» link; accept/reject reused verbatim.** Gig-detail no
  longer renders the inline `ApplicationEntry` owner list — it links to the new screen. `acceptApplication` /
  `rejectApplication` are unchanged (accept → assign + `IN_PROGRESS` + auto-reject others + notify; both redirect to
  `/gigs/[id]`). **Decision:** the prototype's in-place success notice is **derived** on the applications screen (shown on
  revisit), not produced by changing the shared action's redirect — keeping the action contract + its tests intact.

*Pipeline:* `lint:tokens` (0 new) + `lint:composition` (Applications F5, 20 screens) + `build`
(`/gigs/[id]/applications`) + `test:unit` (942, incl. new `gig-applications-vm` + the ApplicantCard render test) +
`build-applications-screen` (5/5) + `compose-gig-detail-apply` (5/5) E2E green. F1 = structural vs the prototype
`applications`; absolute ≤1% now gated live (§10.22).

## 10.18 Disputes flow UI (2026-06-20, change `reconcile-disputes-flow`)

Pure UI reconciliation over the complete dispute backend (the model + `openDispute`/`resolveDispute` + the VMs were
finished by `reconcile-data-model-to-design`).

- **RC-S31 — dedicated «Открыть спор» screen at `/disputes/new?gig=<id>`.** Participant-gated (`getNewDisputeContext`
  returns null → redirect); a reason `CheckField` (the six `DisputeReason` enum values) + a description `Textarea` → the
  unchanged `openDispute` (which normalizes the reason, freezes the amount, captures the openerRole, and writes the
  opening timeline entry). gig-detail's inline free-text `OpenDisputeAction` is replaced by the «Открыть спор» link.
- **RC-S32 — `DisputeDetail` renders the full prototype detail.** Render-only enhancement (the VM already carried the
  data): the frozen amount (Заморожено), the opener party, the evidence (Доказательства), and the role-labelled
  **timeline** (Хронология — Специалист / Заказчик / Модератор + text + date).
- **RC-S33 — admin verdict resolve UI.** The admin resolve panel on `/disputes/[id]` (admin-gated, OPEN-only) gains a
  verdict `CheckField` (specialist / company / split_50) submitted as `verdict` to the unchanged `resolveDispute`, which
  prefixes the verdict onto the resolution + writes the `ModerationLog` + a moderator timeline entry. **Decision:** the
  resolve stays **inline** on `/disputes/[id]` (the prototype's admin-only «РЕШЕНИЕ СПОРА» content), not a separate
  route — nothing displaced.

*Pipeline:* `lint:tokens` (0 new) + `lint:composition` (NewDispute F5, 21 screens) + `build` (`/disputes/new`) +
`test:unit` (944, incl. the verdict + timeline assertions) + `reconcile-disputes-flow` (3/3) + `compose-disputes` (6/6)
E2E green. F1 = structural vs the prototype dispute frames; absolute ≤1% now gated live (§10.22).

## 10.19 Create-gig guided brief (2026-06-20, change `reconcile-create-gig`)

Rebuilt `/gigs/new` (a pre-redesign raw Tailwind form) as the prototype «Создать гиг» guided brief. The `createGig`
validation + 10% fee + all Gig fields were already complete — this is a UI rebuild.

- **RC-S34 — `/gigs/new` is a two-column F5 guided brief.** A `@composed-screen` `Split`: left = the Definition-of-Done
  form (Что нужно сделать? / Как поймём, что готово? / Что важно учесть? / Условия — controlled `Input`/`Textarea`,
  category via `CheckField`, the «Готово, когда…» `CriteriaEditor`); right = live feedback (`ReadinessMeter` +
  `FeePanel`). Controlled fields both compute the live feedback and submit via `createGig` (criteria + category ride via
  hidden inputs). The old `gig-form.tsx` is removed.
- **RC-S35 — 3 new blocks + a ProgressBar tone.** `ReadinessMeter` (the «Готовность брифа» 7-point checklist over a
  `ProgressBar`, tone-coded ≥6 green / ≥4 brand / else amber), `FeePanel` (Бюджет → Сервисный сбор (10%) → Итого, live,
  mirroring the server's 10%), `CriteriaEditor` (input + «Добавить» + suggestion pills + removable rows). `ProgressBar`
  gains a backward-compatible `tone` prop (default brand; OnboardingCard unaffected).
- **RC-S36 — success screen + the createGig redirect.** New `/gigs/new/success` «Гиг опубликован» card + «К моим гигам»
  (→ `/my-gigs`) / «Создать ещё». `createGig`'s **only** change: the success redirect `/dashboard` → `/gigs/new/success`
  (PRG). The 4 createGig redirect-asserting test files (`gig-creation`/`gig-authorization`/`structured-fields`/
  `xss-protection`) updated to the new target; validation + fee assertions preserved.
- **Decisions:** category via `CheckField` (no new category block); the server `acceptanceCriteria` ≥50-char floor kept
  (the readiness «Критерии приёмки» check is ≥1, advisory — the server stays the gate); fee math reused, not
  re-implemented.

*Pipeline:* `lint:tokens` (0 new) + `lint:composition` (CreateGig + success F5, 23 screens) + `build` (`/gigs/new` +
`/gigs/new/success`) + `test:unit` (946; 4 test files retargeted to `/gigs/new/success`) + `compose-create-gig` E2E (2/2)
green. F1 = structural vs the prototype createGig; absolute ≤1% now gated live (§10.22).

## 10.22 F1 ≤1% fidelity gate live + generativity re-proof (2026-06-21, change `refidelity-from-full-design`)

The Phase-4 capstone — the deferred **F1 ≤1% visual-fidelity gate is now LIVE**, and the generativity proof is re-run
against the expanded kit + light theme. Closes the `full-design-reground`.

- **RC-S41 — the ≤1% gate is a self-referential golden-image regression.** `npm run test:fidelity` captures every
  workbench surface (`/workbench/{tokens,primitives,blocks,templates,layout,screens,generativity}` + the index) in BOTH
  themes at 1440px and diffs each vs a committed golden (`docs/design-system/fidelity/golden/*.png`) via the Phase-0
  `fidelity-diff.js` engine, asserting the differing-pixel ratio **≤ 1%** (emitting diff / side-by-side / overlay-50).
  `test:fidelity:update` (re)writes the goldens. Goldens are **environment-pinned** to the project's Playwright Chromium.
  **Decision (owner-confirmed):** the automated target is the app's own goldens (regression detection); the
  `gigly_full_design` prototype frames are the **human** F1 overlay/calibration reference (`registry.REF.*`,
  re-baselined off the lossy JPGs to `…/reference-renders/prototype/{ds-inventory,ds-nav,dashboard}.png`). Diffing the
  live app against the external `.dc.html` prototype at ≤1% is unsound (renderer/font/AA drift) and is NOT done.
- **RC-S42 — scope of the gate.** It covers every component + composition surface (the deterministic, fixture-driven
  workbench catalog, incl. the dashboard composition sample + the generativity probe) in dark + light. Live per-route
  screens stay covered by their `compose-*` E2E (F3 parity) + the human overlay review — gating their live data on golden
  pixels would add nondeterminism for little marginal value (a stability-driven, sanctioned scope).
- **RC-S43 — generativity re-proven in both themes.** `validate-generativity` (composition + token-purity over the
  `GenerativityProbe` + the admin screens + the expanded kit) passes → zero off-system values; because they are
  token-driven (F2), they hold in light AND dark, verified by the probe golden in both themes. The synthetic engine
  self-check (`fidelity-diff.js --selfcheck`: control passes / 4px offset fails) stays green.

*Pipeline:* `validate:tokens` + `lint:tokens` + `lint:composition` (23 screens) + `lint:generativity` + `build` +
`test:unit` (950) + `fidelity --selfcheck` + **`test:fidelity` (16/16 surface×theme ≤1%)** green. **Phase 4 complete —
the full-design-reground is closed.**

## 10.21 Onboarding wizard fidelity (2026-06-21, change `add-onboarding-screen`)

A **fidelity revision** of the onboarding wizard, NOT a new screen — a diff confirmed `Онбординг.dc.html` *is* the
`/register` 3-step wizard (role → credentials → role-aware profile), already reconciled by
`reconcile-auth-and-onboarding` (flow, `AuthStepDots`, the role-aware step-3 «Добро пожаловать»/«Настройте свой аккаунт»
headings). This closed the remaining gaps the diff surfaced.

- **RC-S39 — the wizard chrome is reconciled.** New **`AuthFooter`** block (the legal links «Политика
  конфиденциальности» · «Условия пользования» · «Помощь») rendered via the existing-but-unused `AuthLayout` `footer`
  slot; the **step-3 consent disclaimer** «Нажимая «Продолжить», вы соглашаетесь…»; the step-3 submit CTA renamed
  «Зарегистрироваться» → **«Продолжить»**.
- **RC-S40 — the richer field sets are kept (owner-confirmed).** The wizard's schema-backed step-3 fields (CLIENT:
  companyName/ИНН/contactPerson/phoneNumber; SPECIALIST: displayName/position/techStack/specialization/experienceLevel/
  timezone) are kept — they persist real B2B/specialist data the app consumes; the prototype's shorter list is treated
  as illustrative. `registerUser` + the schema are unchanged. This is the project principle in action: "it exists" ≠ done
  (the flow needed a real revision), but a faithful UI reconcile must not regress functional data.

*Pipeline:* `lint:tokens` (0 new) + `lint:composition` (RegisterWizard F5, 23 screens) + `build` (`/register`) +
`test:unit` (950; the AuthFooter render test) + `compose-onboarding` (2/2) + the existing register E2E green. F1 =
structural vs the prototype onboarding steps; absolute ≤1% now gated live (§10.22). **Phase 3 complete.**

## 10.20 Finances figures + admin console (2026-06-21, change `reconcile-finances-and-admin`)

UI + data-layer enrichment over complete backends (the finances lib, the admin stats + moderation actions +
`ModerationLog`, and the dispute list all existed).

- **RC-S37 — `/finances` shows 3 role-aware figures + lifecycle operations.** `getFinanceStats` returns the prototype
  tiles — **company**: Выплачено (PAID totalAmount) / В резерве (IN_PROGRESS + REVIEW totalAmount) / Сервисный сбор (PAID
  fee); **specialist**: Заработано (PAID budget) / На проверке (REVIEW budget) / В работе (IN_PROGRESS budget).
  `getLedger` now returns the operations across **IN_PROGRESS / REVIEW / COMPLETED / PAID** (not PAID-only) with the
  role-aware amount + a counterparty subtitle; the «Баланс» footer stays the realized (PAID) total. `LedgerTableVM`
  entries gain `subtitle` + `statusLabel` (the latter renders «Оплачено» for PAID, which has no design `Status`). The
  «Суммы логические…» MVP framing is kept.
- **RC-S38 — the admin dashboard adds the dispute queue + the moderation log.** `getAdminDashboard` is extended to return
  the OPEN dispute queue (`getDisputeList({ status: 'OPEN' })`) and the recent `ModerationLog` rows (RU action label +
  actor + time). `AdminDashboard` renders «Споры на модерации» (`DisputeList`, each row → `/disputes/[id]` to resolve) +
  «Журнал модерации» (`DataTable`), keeping the stats `StatPanel` + the «Пользователи»/«Гиги» links.
- **Decisions:** the paginated `/admin/users` + `/admin/gigs` pages are **kept** (an enhancement over the prototype's
  single-screen lists — the dashboard gains the sections, doesn't collapse them); the queue links to the existing
  `/disputes/[id]` resolve panel (no new route); **no new blocks** (`DisputeList`/`DataTable`/`StatPanel`), **no schema
  change**; moderation actions + `ModerationLog` unchanged.

*Pipeline:* `lint:tokens` (0 new) + `lint:composition` (Finances + AdminDashboard F5, 23 screens) + `build` (`/finances`
+ `/admin`) + `test:unit` (949; the finances role-figure + lifecycle tests rewritten, a new admin-dashboard VM test) +
`compose-finances` (3/3) + `compose-admin-dashboard` (2/2) + `admin-moderation` E2E green. F1 = structural vs the
prototype finance + admin frames; absolute ≤1% now gated live (§10.22).

## 10.5 Auth/onboarding screen reconciliation (2026-06-18, change `reconcile-auth-and-onboarding`)

- **RC-S4 — `AuthHeader` block added for the auth «HEADER» lockup.** The five Figma auth nodes
  (`3179:3179` / `3179:3863` / `3195:4564` / `3195:4282` / `3195:4704`) each lead with a HEADER block = Logomark →
  heading (`type/h1`) + subtitle (`type/body`, muted) → the `AuthStepDots` counter. Coded as the `AuthHeader`
  block so the composed `/register` wizard stays composition-pure (F5 forbids heading markup/`className` in the
  screen). The welcome step (3) sets `showLogomark:false` per its node.
- **RC-S5 — `RegisterWizard` swapped onto `AuthStepDots`; `StepIndicator` retired from the auth path.** Completing
  RC-B3, the `/register` wizard now renders the dot counter (`count=3`, `current=step`) via `AuthHeader`, NOT the
  labelled `StepIndicator`. `StepIndicator` remains in the kit/catalog for non-auth use but has no app consumer.
- **RC-S6 — welcome-step field set is a sanctioned content variant.** The Figma welcome node shows
  `Input + Select ×2`; the implemented step 3 keeps the **full profile contract** `registerUser` persists
  (specialist: displayName + position + techStack + 3× Select; company: companyName + inn + contactPerson +
  phoneNumber). Per the "system > single screen" mandate, the extra fields are a **sanctioned content variant** of
  the node's layout grammar (heading + counter + labelled fields + back/primary buttons) — no persisted field is
  dropped to match the mock's count. F3 parity for step 3 is asserted at the layout-grammar + flow level.

## 10.8 Gig-browse screen reconciliation (2026-06-18, change `reconcile-gig-browse`)

- **RC-S11 — `Section title="Поиск гигов"` → `SectionHeader` «Поиск проектов»; the grid/list switcher hoists from
  `FilterBar` into the header row; the functional filters are a sanctioned content variant.** Поиск
  проектов/specialist (`2860:2056`) leads with an `H/H1/BLOCK` header row = a `SectionHeader` («Поиск проектов») on
  the left + the grid/list `switcher` (`ViewToggle`) right-aligned in that same row, over a `GigCard` grid (`Grid
  columns={3}`, list = `Stack`) spanning the full `Status` set. The browse screen (`GigSearch.tsx`) drops the former
  `Section title="Поиск гигов"` page-title for the `SectionHeader`, and **moves** the switcher out of the `FilterBar`
  into the header row (the `ViewToggle` primitive is reused verbatim — same `view`/`onChange` contract, only its
  placement changes; it still drives the `view` URL param). `FilterBar` now renders its `ViewToggle` **only when
  `onViewChange` is wired**, so the filter bar shows no switcher on this screen. The node mock shows only the header +
  card grid (its filter UI collapsed); the functional `FilterBar` (search + category + sort + Рейтинг) is **retained
  as a sanctioned content variant** — functional filtering the static mock omits. No filter/search/sort/pagination
  semantics change.

## 10.7 Dashboard screen reconciliation (2026-06-18, change `reconcile-dashboards`)

- **RC-S9 — `BannerCard` → WELCOME (greeting + `OnboardingCard ×2`); page-title dropped.** Дашборд/specialist
  (`2860:3751`) + /company (`3371:5387`) lead with a WELCOME = a greeting `SectionHeader` (name-bound) + two
  `OnboardingCard`s (the "pic" tiles: a profile-completion tile carrying the real `completion` as its `ProgressBar`
  value + a how-it-works tile). The former `BannerCard` is removed from both dashboards (it stays a kit block for
  other surfaces), and the `Section title="Дашборд"` page-title is dropped (the node CONTENT leads with WELCOME).
  The BOARD becomes a 2-col `Split` — col1 «Активные задачи» (`SectionHeader` + Tabs + `GigCard` feed) ‖ col2
  «найти гиг»/«Найти новый проект» (`SearchPanel` specialist / `CreateGigCTA` company) + «Сообщения»
  (`MessagesPanel`), each section `SectionHeader`-led. New VM fields `greeting` + `onboarding` replace `banner`.
- **RC-S10 — specialist attention strip binds live notifications; company hides it; Tabs are the col1 Menu-switcher.**
  The WELCOME-2 «row of 6× attention card» binds the user's recent `Notification`s via `getDashboardAttention`
  (newest-first, cap 6; eventType→`AttentionType` accent; embed = the linked gig as a `GigCardVM`). It renders on
  the **specialist** dashboard when non-empty and is **not rendered** on the **company** dashboard (the mock's
  `Frame 342 hidden=true`). The company node shows a `Menu-switcher` tab strip in col1; the existing status Tabs are
  kept as that Menu-switcher for **both** roles — for the specialist (whose node shows a plain feed) the Tabs are a
  **sanctioned content variant** (functional filtering the static feed omits). No tab/count data changes.

## 10.6 Profile screen reconciliation (2026-06-18, change `reconcile-profile-screen`)

- **RC-S7 — ID-block real stats are a sanctioned content variant; placeholder honored.** Профиль/specialist
  (`2860:2103`) shows only the «на стадии разработки» analytics placeholder in the ID block. `getProfile` already
  splits analytics into that **placeholder** (`stats: statsPlaceholder()`, rendered in the ID-block right panel —
  *honored*) and the **real** numeric stats (`header.stats` = Рейтинг / Завершено задач / Повторные заказы, in
  `ProfileHeader`). Per "system > single screen", the real stats are kept as a **sanctioned content variant** (a
  functional enhancement the static mock lacks) — the placeholder is NOT dropped. F3 parity for the ID block is at
  the layout-grammar + flow level, not a literal element-count match.
- **RC-S8 — ID block adopts `SpecialtyTag` + a `tag/status` availability pill; page-title removed.** `ProfileHeader`
  now renders the specialty via the `SpecialtyTag` primitive (white `surface/inverse` chip, `brand/default` mono),
  NOT the ad-hoc `rounded-pill border` pill, and adds a token-pure availability pill (online → `status/completed`
  dot + «В сети», offline → `text/subtle` dot + «Не в сети», mirroring the `Avatar` online dot). The composed
  `/profile` screen drops the `Section title="Профиль"` heading — the node CONTENT leads with the ID block. The
  2-col BLOCK already reconciled via the Phase-0 blocks (`SectionHeader`/`JobExperienceCard`).

## 10.4 Onboarding/auth blocks (2026-06-18, change `add-onboarding-and-auth-blocks`)

- **RC-B2 — TermsTabs normalized to the canonical `Tabs` (no 5th toggle).** The Figma gig-apply toggle
  (`2860:2413`, a `#01030e` segmented pill with a 20%-white active segment) is a screen-level one-off. `TermsTabs`
  already composes the canonical `Tabs` primitive; the segmented-pill is **normalized to it**, NOT reproduced as a
  bespoke toggle. (Four tab/segment treatments already exist — switcher, Menu-switcher, switch-bar, Tabs — and no
  fifth is added.)
- **RC-B3 — AuthStepDots vs StepIndicator.** The Figma auth `counter` (`3179:3997`) is a minimal dot indicator
  (active 8px / inactive 6px). The pre-Figma `StepIndicator` (numbered + labelled) diverges; **AuthStepDots** is the
  Figma-authoritative auth indicator. `StepIndicator` is kept (labelled variant) but **superseded for auth** — the
  Phase-1 `reconcile-auth-and-onboarding` swaps `RegisterWizard` onto AuthStepDots. (Inactive dot 6px is sub-token —
  rendered as `h-1.5` smaller + dimmed; active 8px = `h-2`.)
- **RC-B4 — `Textarea` not `CoverLetterTextarea`.** The multi-line field is a generic `Textarea` primitive (sibling
  of `Input`, `overlay/fill` surface); the gig-apply cover letter is an instance — no domain-named bespoke block.

## 10.3 Attention palette (2026-06-17, change `reconcile-attention-card-and-settings-composites`)

- **RC-B1 — added the `attention/*` token group (6 colours + 6 glow gradients).** The AttentionCard's
  notification-**type** accents are a palette distinct from `status/*` (e.g. `attention/rejected #9ca3af` is
  neutral gray, NOT `status/rejected` red; `attention/accepted #16a34a` ≠ `status/completed #10b981`). Per the
  generativity principle, they were added as semantic tokens — `attention.{status-change #7c3aed, message
  #2563eb, deadline #ea580c, accepted #16a34a, rejected #9ca3af, payment #0891b2}` + matching
  `gradient/attention-*-glow` (radial, mirroring `status-completed-glow`). `AttentionCard` maps `type → token`
  in one component (no per-variant copies); the embedded gig/message block keeps its own gig-status styling.
  Cited from `docs/figma-components-export.md` (per-type attention map).

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
