# Figma Component Import — `components` section / `frames` catalog (composites)

**Date:** 2026-06-17 · **Status:** ✅ COMPLETE (18 of 18 composites fully imported — the 4+attention-card backlog cleared on 2026-06-17)
**Figma source:** section **`2860:3572`** ("components") → frame `2860:3570` ("frames"). Confirmed it contains exactly **18** components (the atomic primitives live in the *sibling* frame `2860:3571`, audited separately — see `figma-component-audit.md`). One extra layout frame, `Frame 350` (`3863:6069`), is an arrangement artifact, not a catalog component.
**File key:** as of 2026-06-17 the working copy is **`gl9wHy8VGJQTmNuQZNukqg`** ("Gigly (Copy) (Copy)"). The original `Drp803tesW5fIuA2Y21JVx` was on a rate-limited Starter seat; the project was copied to a **Pro/Full seat** (`elnoravlrxb@gmx.com`) where read access is unmetered. **Node IDs are preserved across the copy** — every node-id in this doc resolves unchanged in the new file.
**Method:** official Figma MCP `get_design_context` (OAuth, HTTP) per node → React/Tailwind reference code + screenshot, distilled to token-mapped specs. Earlier 13 used Framelink `get_figma_data`. Values mapped to reconciled token names (see `DESIGN_SYSTEM_SPEC.md` §1/§10).

> ✅ **Rate-limit resolved.** The original account was Figma **Starter** with a Viewer seat; both the hosted MCP and Framelink REST 429'd (~4.6d `Retry-After`). Re-authenticating the official MCP against a **Pro/Full seat** on a copied file cleared the backlog — all 5 remaining composites (toggle field, check field, session, file, + full attention-card styling) were imported in one pass.

---

## ✅ Imported (18 full)

### Side bar (`2802:4051`)
- **Variants:** `Property1` {full, short} × `noti` {no, yes} (4). Composes `Menu` + `profile frame` + `Massage`.
- **Structure:** root (surface/level-0, h982) → rail [LogoArea(logo + collapse `button_icon`) · profile frame · `Menu`] + [`Massage` · logout `button_icon`]. `noti=yes` adds an absolute notifications panel (glass header + scrollable Notification list).
- **Styling:** rail gap space/4xl(64), px space/lg(24) py space/xl(32); widths full=283 / short=126. Profile frame: surface/level-2, radius/md, px space/md py space/sm2, gap space/sm2; avatar radius/full. Menu item `<a>`: h32, radius/sm, label `type/label` text/muted, trailing count `type/mono` text/muted, icons size/icon(16). Logout/collapse `button_icon`: surface/level-2, 40×40, radius/sm, icon 20.
- **⚠️ Off-token / gaps:** **no active/hover nav-item styling is emitted** (all items render muted; coded version must add active state). Notification panel + counter digits use **Vremena Grotesk** (non-token font). Heights 982/158, avatar 46/48, badge radius 484px, logo dims — off-token.

### HEADER (`3024:2775`)
- **Variants:** `type` {Header 1, Header 2, type3} × `collapsed`, + flags `button`/`counter`/`search`/`switcher`. (Node returned Header 2 / not-collapsed; H1/type3 in same source.)
- **Structure:** glass bar → title(+counter) ↔ trailing `button_icon` → optional `switcher` → full-width search Input.
- **Styling:** container `backdrop-blur 50px` over `overlay/header`; H2 padding space/lg, H1/type3 space/xl. Title: H1 → `type/display`(32, accent/mono, ls −0.5, uppercase); H2 → `type/h1`(24, accent/mono, ls −0.3). Counter badge: brand/default, radius/sm, value `type/mono`. `button_icon`: surface/level-2 40 radius/sm icon 20. Search Input: **right-border 4px brand/default**, h40, radius/sm, placeholder `type/body` text/muted, search/clear icons 16.
- **⚠️ Off-token:** accent border is **4px** (left on H1 row, right on search field). Widths 1213/1386 (layout). Counter min-w 22.

### Gig (gig card) (`2802:3367`) — the headline composite
- **Variants:** Status {Открыт, На рассмотрении, В работе, На проверке, Завершён, Отклонён} (6) + boolean toggles postingDate/tags/description/timeline/bottomInfo.
- **Structure:** card → [header (status pill ↔ posting-date)] → [glass body panel: (Bio ↔ Category chip) + heading + tags + description + timeline] → [bottom info: price | deadline | CTA]. Per-status **radial glow** layer behind.
- **Styling:** container w542(layout), **radius/xl(16)**, bg surface/level-3, 1px border = status-colour @30%, drop-shadow `0 4px 24px rgba(0,0,0,.4)` (glass). **Per-status glow:** absolute radial, opacity .8, stops status@.5→@.1→@0; blend `color-dodge` (in-progress, rejected) else `lighten`. Body panel: `backdrop-blur 8px`, surface/level-3, radius/xl, pad space/lg·md, inset highlights `overlay/line` + top `rgba(255,255,255,.06)`. Bio: avatar size/avatar-sm white w/ initial; name `type/label` 600 text/strong; verify icon 16; rating 5★(12) + count `type/caption` text/muted. Category chip: L+R 2px borders category-colour, radius/xs, `type/label` in category colour. Heading `type/h2` 600 text/strong. Tags: bg brand/default@15%, pad space/sm·xs, label `type/label` colour **brand/highlight `#4cacff`**. Description `type/body` text/muted @0.7. Timeline: track h4 radius/full text/subtle@50%, fill text/subtle; dates `type/mono-small` text/subtle. Bottom: labels `type/caption` text/subtle, values `type/body` 600 text/strong. CTA "К проекту": brand/default, radius/md, h size/control, `type/label` text/strong.
- **Status accent map:** open=text/muted(neutral), review=`#f59e0b`, in-progress=`#3b82f6`, verification=`#8b5cf6`, completed=`#10b981` (the green glow), rejected=`#ef4444` — applied to pill text/dot + border + glow.
- **⚠️ Off-token:** w542; gaps 5/6/10px; the glow needs CSS `radial-gradient(ellipse at top,…)` + per-status blend-mode.

### Message (dashboard/chat preview) (`2866:2507`)
- **Variants:** `view` {dashboard, chat} × `counter` (unread).
- **Structure:** card → top(bio ↔ counter | status pill) [+ gig title, chat] → info(preview + sender ↔ time).
- **Styling:** w275(layout), radius/md, pad space/md·sm2, surface/level-3 + `plus-lighter`. Compact bio avatar 26 (OFF), name `type/label`. Counter brand/default radius/full size22(OFF) `type/mono-small`. Preview `type/mono` text/strong (2-line). Meta `type/mono-small` text/subtle.
- **⚠️ Off-token:** **Vremena Grotesk** font; avatar 26, badge 22.

### MESSAGE (chat bubble) (`2868:4368`)
- **Variants:** `side` {L (in), R (out)}.
- **Structure:** row gap space/sm2 items-end; L=avatar→bubble, R=bubble→avatar; bubble = text + info(time; R adds read-receipt check).
- **Styling:** avatar 36 (OFF) white, initial colour surface/level-1. Bubble bg **overlay/fill** + `plus-lighter`, pad space/sm2; radius top both radius/md, the **squared bottom corner marks the speaker's side**. Text `type/mono` text/strong; time `type/mono-small` text/subtle; read-receipt icon 16.
- **⚠️ Off-token:** Vremena Grotesk; row 362, avatar 36, gap 6.

### Notification (`3112:2712`)
- **Variants:** single.
- **Structure:** card → header(title ↔ time ↔ x-circle close) + body.
- **Styling:** w636(layout), radius/md, pad space/sm2·md, bg **overlay/fill** + `plus-lighter`. Title `type/h2` text/strong. Time `type/mono-small` at text/subtle **@70%** (OFF). Body `type/mono` text/subtle. Close icon 16.
- **⚠️ Off-token:** Vremena Grotesk; 70%-alpha timestamp.

### massage (support widget) (`3857:5793`)
- **Variants:** `shorten` {no, yes} × `state` {Default, Hover}. short+Hover shows a detached tooltip.
- **Styling:** full: surface/level-2, radius/lg, pad space/lg, gap space/md, w235. short: 78×78 radius/md. Tooltip: surface/level-3-hover, radius/md. Title "Поддержка" `type/h2`(18) 600 text/strong; body `type/label` text/muted. Input "Что случилось?": **right-border 2px brand/default**, radius/sm, h35(OFF), scrim surface/level-1 + `plus-lighter`, placeholder `type/body` text/muted, send icon 16.
- **⚠️ Off-token:** input h35; short-state icon 24.

### switch bar (tab atom) (`3972:5628`)
- **Variants:** `active` × `state` {Default, Hover} × `counter`.
- **Styling:** pill h32, px space/sm, gap space/sm, radius/md, w110(OFF). **active → bg surface/level-3-hover, text/strong; hover(!active) → bg surface/level-1, text/muted; default(!active) → transparent, text/muted.** Label + count `type/label`.

### switcher (6-tab group) (`3972:5655`)
- **Variants:** `activeTab` {0..6} (0 = none).
- **Styling:** flex row of 6 `flex-1` switch-bar atoms (override the atom's 110px); active tab → surface/level-3-hover fill; w1440(OFF, full-bleed). No hover wired at the group level.

### search + filters (`2999:4376`)
- **Variants:** `filters` (bool).
- **Structure:** flex-1 search Input + right group of 4 `Filter` chips.
- **Styling:** row gap space/md, h40. Search Input **right-border 4px brand/default**, radius/sm, scrim surface/level-2 + plus-lighter, search icon 16. Filter chip: surface/level-1, radius/md, h40, pad space/sm2·sm, `filter-circle` icon 20 + label `type/label` text/muted + `chevron-down` 16.
- **⚠️ Off-token:** Vremena Grotesk placeholder; w1149 (layout).

### input field (`3124:2858`) — form text input
- **Variants:** `state` {Default, input, filled}. Props: `icon L` (bool, def false), `icon R` (bool, def true), `label` (bool, def true), `label txt`, `input text`, `role` (bool, def false — a leading role badge).
- **Structure:** column gap space/xs(4) → [optional **label** row (pad 2/12): "Label" text] + [**input** row: gap space/sm2(12), pad `6px 12px 6px 0`, h40, radius/sm(4), 1px border → (icon-L `search` 16) · (optional **role** badge: surface/accent fill, right-border 1px white, pad space/sm2, `person-bounding-box` 16) · (Frame338: `input text`, fills width) · (icon-R `x-square` 16)].
- **Styling per state:**
  - **Default** — input border `rgba(255,255,255,.2)` (= border/default / overlay-line); label `#FFFFFF` text/strong; input text `rgba(159,160,164,.7)` = **text/muted @70%** placeholder, `type/mono`(14 regular).
  - **input** (focused/typing) — input border **`#0088FF` brand/default** (focus ring); label drops to `#9FA0A4` text/muted; value `••••••` white, mono 14.
  - **filled** — **no border** (border removed once filled); label `#9FA0A4` text/muted; value white, `type/mono` **16 medium** (note the 14→16 size bump vs placeholder).
- **Label text:** `NKDuy Mono` Medium 14 (`type/label`/mono). Icons 16 = size/icon. Role badge = the same `color/surface/accent` (`rgba(255,255,255,.05)`) + 1px white right-border affordance shared with `roleplay`.
- **⚠️ Off-token:** focus border is **brand/default** (consistent with HEADER/search affordance but here a *full 1px box*, not the 4px side-accent). Filled value jumps to 16px (off the 14 mono step). Set-frame width 1336 + dashed `#9747FF` stroke = Figma component-set chrome, **not** tokens.

### select (`3195:4537`) — dropdown field
- **Variants:** `State` {Default, chosen}. Props: `Label` (bool, def **false**), `Label txt`.
- **Structure:** column gap space/xs(4) → [optional **label** row (pad 2/12, hidden by default)] + [**field** row: gap space/sm2(12), pad `6px 12px`, h40, radius/sm(4), 1px border → value text (fills) + `chevron-down` 16].
- **Styling per state:** identical pattern to `input field` —
  - **Default** — border `rgba(255,255,255,.2)` border/default; value "Русский" `rgba(159,160,164,.7)` text/muted @70%, `type/mono` 14 regular.
  - **chosen** — border **`#0088FF` brand/default**; value `#FFFFFF` text/strong, `type/mono` **16 medium**.
- **⚠️ Off-token:** same brand/default focus box + 14→16 bump as input field. chevron 16 = size/icon.

### roleplay (role-selector row) (`3179:3687`) — segmented role pill
- **Variants:** `State` {Default, hover}. No props.
- **Structure:** row h40, alignSelf stretch → [**icon** cell: `color/surface/accent` fill, **right-border 1px white**, pad `6px 12px`, `person-bounding-box` 16] + [**role** cell: `color/surface/accent` fill, pad `6px 12px`, fills width, "Специалист" `type/mono` 16 medium, text/strong].
- **Styling per state:**
  - **Default** — row transparent (cells carry the surface/accent fill); no outer border.
  - **hover** — row gains fill **`rgba(19,121,243,.3)` over `#01030E`** (a brand-blue tint scrim over page-bg) + **1px border `#0088FF` brand/default**, radius/sm(4). This is the row hover/active affordance.
- **⚠️ Off-token:** hover fill is a **2-layer composite** (blue@30% over the page background `#01030E`) — model as a brand-tinted overlay, not a flat token. The leading `surface/accent` + right-border-white icon cell is the same atom reused inside `input field`'s role badge.

### attention card (`3367:3916`) — ✅ FULL STYLING CAPTURED (was taxonomy-only)
The notification card surfaced on the dashboard. **Two independent colour systems:** (a) the *notification-type accent* drives the marker block, the left inset border, and the card's ambient glow; (b) the *embedded gig/message block* keeps its own *gig-status* glow, unrelated to (a).

- **Variants (12):** `Property` (notification type) × `USER` {SPECIALIST, COMPANY}. Verified against the 6 SPECIALIST variants; the 6 COMPANY variants share the identical shell + per-type accent and swap the embedded block / CTA copy (not individually re-fetched — see note).
- **Shell (all variants):** w280 h262, radius/xl(12), `border 1px rgba(255,255,255,.1)`, `overflow-clip`, pb space/sm2(12), col gap space/sm2. Base fill `rgba(255,255,255,.05)`; ambient glow = absolute radial-gradient (top-left origin, `opacity .21`, `mix-blend-screen`) seeded with the **type accent**. **Left accent = `box-shadow: inset 4px 0 0 <type-accent>`** (the same 4px brand-side-accent affordance seen on Header/search, here recoloured per type).
- **Header row:** `marker` block (w34, full-height, radius/xl, `bg = type-accent`, centered **emoji** in `Inter` 22px on black) + `DM` (pad space/sm2: bold title `NKDuy Mono SemiBold` 16/20 white + right-aligned relative date `NKDuy Mono` 12 text/muted).
- **Content (pl 16 / pr 12):** an **embedded block** that differs by type (see map). Embeds reuse existing atoms — the in-progress *attention block* (radius/md, `border overlay/line`, bg **`--gig-bg #1A1A24`** + own status-colour radial glow `color-dodge`), the full *Gig card* (radius/lg + the `glass` effect: blur16 / drop-shadow `0 4px 24px #00000066` / inner-shadows `#FFFFFF0F` + `#FFFFFF14`), or the *Message attention block* (radius/md, `rgba(255,255,255,.05)` + `plus-lighter`, bio + counter badge + 2-line preview).
- **CTA (pl 16 / pr 12):** full-width `Button` h40, radius/md, `bg = var(--color) = type-accent`, label `type/label` (SF Compact Medium 13) white. Copy is per-type.

**Per-type accent + content map (SPECIALIST, all confirmed from fills):**
| Property | accent (marker/inset/glow) | emoji | title | embedded block | CTA |
|---|---|---|---|---|---|
| Смена статуса | **`#7c3aed`** purple | 👀 | Новый статус | in-progress attention block (blue inner glow) | К проекту |
| Новое сообщение | **`#2563eb`** blue | 💬 | Новые сообщения | Message attention block (counter=5) | Ответить |
| Приближается дедлайн | **`#ea580c`** orange | ⏳ | Скоро дедлайн | in-progress block + timeline + "Остался 1 день" | Сдать |
| Заявка принята | **`#16a34a`** green | 🤝 | Заявка принята | in-progress block + price/term (blue inner glow) | Приступить |
| Заявка отклонена | **`#9ca3af`** gray | ⛔ | Заявка отклонена | full Gig card "В работе" (red inner glow) | Найти проекты |
| Получена оплата | **`#0891b2`** cyan | 💰 | Получена оплата | full Gig card "На рассмотрении" (cyan inner glow, `lighten`) | Оставить отзыв |

- **⚠️ Note / known approximation:** the **type accent is its OWN palette** (purple/blue/orange/green/gray/cyan), distinct from the Gig-card *gig-status* accents — the earlier inferred map (mapping types to gig-status colours) was **wrong**; use this table. Rejected uses a **neutral gray** marker, not red (red appears only in the embedded gig's inner glow). The 6 COMPANY variants were not individually re-fetched (taxonomy: Нет ответа · Новое сообщение · Нет заявок · Ждёт проверки · Получена оплата · Заявка отклонена) — re-fetch each if its accent/emoji/CTA is needed verbatim.
- **⚠️ Off-token:** `Inter` (emoji marker) + `IBM Plex Sans` (embedded title/desc) + `Vremena Grotesk` — three more non-token families; `--gig-bg #1A1A24` (a new surface value, see findings); marker w34, emoji 22.

### toggle field (`3138:3199`) — settings toggle row
- **Variants:** single. **Structure:** row h52, gap space/sm2(12), pad `6px 12px`, radius/sm(4) → [`txt` column gap space/sm(8): title `NKDuy Mono Medium` 16 white (1-line, ellipsis) + description `Vremena Grotesk Book` 14 text/muted(`#9fa0a4`)] + [trailing toggle `button` 24×24 (the switch knob asset)].
- **⚠️ Off-token:** Vremena Grotesk; title 16 (off the 14 mono step, matches input-field "filled" bump); switch 24.

### check field (`3138:3148`) — settings checkbox/radio list
- **Props:** `list 1 txt`, `list 2 txt`, `list 2` (bool, def true — whether the 2nd row renders).
- **Structure:** column gap space/xs(4) → up to two `input` rows, each h40, gap space/sm2, pad `6px 12px`, radius/sm → [icon 16 (`circle` unchecked / `check-circle` checked) + label `NKDuy Mono Medium` 16 white]. In the default props the 1st row is unchecked (`circle`) and the 2nd is checked (`check-circle`) — i.e. a single-select/radio list.
- **⚠️ Off-token:** label 16.

### session (`3149:2645`) — settings session / destructive row
- **Variants:** `state` {Default, active, delete}. Base row w1244(layout), gap space/sm2, pad space/sm2, radius/sm, bg **`#01030e`** (page bg).
- **Default:** items-center → [`txt` (title `NKDuy Mono Medium` 16 white + desc `Vremena Grotesk Book` 14 text/muted)] + trailing **x-circle** icon 16 (remove affordance).
- **active:** adds `border 1px var(--color) brand/default(#08f)` + trailing **status pill** ("Текущий" — the dot+label `status` atom `3149:2657`: `bg rgba(0,136,255,.1)`, radius/full, dot 8, label `type/label` `#08f`). No x-circle.
- **delete:** `flex-col` (stacks) → [`txt` full-width: title "Удалить аккаунт" + desc] + a **destructive Button**: `bg rgba(255,56,60,.2)`, `border 1px border/strong(#5a6070)`, radius/md, h40, label `accents/red #FF383C` + trailing `arrow-down-right-square` icon 20.
- **⚠️ Off-token:** Vremena Grotesk; title 16; destructive button is a bespoke red-tint variant (not the standard Button — candidate for a `danger` Button variant).

### file (`3600:5262`) — chat/composer attachment chip
- **Variants:** single (prop `iconType` slot). **Structure:** row gap space/sm2, pad `6px 12px`, radius/md(8), bg **`overlay/line` (`rgba(255,255,255,.08)`** — labelled `контур`/"contour") → [file-type icon 24 (`file-earmark-font` default)] + [text col gap 2: filename `IBM Plex Sans Regular` 14/16 white `ls -0.14px` + filesize `IBM Plex Sans` 12 text/muted].
- **⚠️ Off-token:** IBM Plex Sans; the `rgba(255,255,255,.08)` fill is the `overlay/line` token used as a *surface* here (it's normally a border).

---

## ✅ Atomic primitives (frame `2860:3571`) — already audited; two no-code-home atoms spec'd here
The atomic frame's full variant matrices + code deltas are in **`figma-component-audit.md`** (17 sets, 6 clean matches). It does **not** need re-importing. Captured here are the two atoms the audit flagged as **❌ no code home** (need building) plus the tag/Category hue finding.

### button_icon (`3828:11151`) — square icon button — ❌ no code primitive yet
- **Variants:** `State` {Default, Hover, Active} × `BG` {no, yes}; prop `counter` (bool).
- **Styling:** **40×40**, radius/sm(4), pad space/xs(4), icon **20**. `BG=yes` → `bg surface/secondary(#10121c)`; `BG=no` → transparent. Optional `counter`: absolute top-right 16×16 badge, `bg var(--color) brand/default`, radius/full, digit `Vremena Grotesk` ~8.7px white. (Hover/Active fills come from the surface-hover convention; re-fetch the Hover/Active variants for exact fills if needed.)
- **Build note:** this is the missing `IconButton` primitive (audit divergence #1) — square geometry + `bg: no|yes` + Active state + counter slot. Every current icon button is faked via `<Button variant=ghost>` / bare `<Icon>`.

### Специальность / specialty (`3435:5794`) — ❌ no component
- **Variants:** `Size` {S, XS}. **Styling (S):** `bg white`, px space/sm(8) py 0, text = the specialty in **brackets** "[Senior Frontend Engineer]", `NKDuy Mono Regular` (`font/family/accent`) **14**/17 (`type/default-data`), colour **brand/default `#08f`**, ls 0. XS is the same at the smaller data step.
- **Build note:** a white-chip, brand-blue monospace "specialty/role" tag — distinct from `Tag`/`Category`. No code counterpart (grep specialty → none).

### tag / Category hue mapping — ⚠️ confirmed risk
`get_variable_defs` on both `tag` (`2802:3300`) and `Category` (`2868:3724`) returned **only layout/type tokens — no colour variables**. The 5 hue fills (Blue/rose/green/teal/orange) are **raw hex, not bound to design tokens**. This confirms audit divergence #3: the coded kit rekeys these by *domain* (`marketing/design/programming/development/coding`); since Figma has no hue→token binding, the hue↔domain mapping must be pinned down **manually with the designer** — there is no source-of-truth variable to diff against.

---

## Cross-cutting findings (for reconciliation)
1. **NON-TOKEN font families — now FOUR beyond the two tokens (`SF Compact` sans / `NKDuy Mono` mono).** Confirmed across the final import pass:
   - **`Vremena Grotesk`** — messaging/notification body, search placeholders, counter digits, settings descriptions, gig price/term values.
   - **`IBM Plex Sans`** — embedded gig titles/descriptions inside attention cards + the `file` chip filename/size.
   - **`Inter`** — the attention-card emoji marker glyphs (22px).
   These are unmodeled **token gaps**. Size scale still maps cleanly (h2=18, body=15, mono=14, mono-small=12, caption=11); the *families* need either new family tokens or a designer decision to collapse them. (Several may be incidental/placeholder — confirm intent before adding 3 family tokens.)
0. **NEW surface value — `--gig-bg #1A1A24`** (Figma name "GIG/IN PROGRESS" / "GIG/REJECTED" — same hex for both). The base fill behind a Gig card's status glow. Not in the current surface ramp (`level-0..3`) — add as `surface/gig` or fold into the ramp.
2. **Active/selected convention:** `surface/level-3-hover` (`#1a1d2a`) is the "selected tab" fill across switch bar / switcher / sidebar tooltip. Note it is *lighter than* the hover fill (`surface/level-1`).
3. **Glass recipe (consistent):** `backdrop-blur 50px` over `overlay/header` for HEADER + notification panel; cards use `overlay/fill` + `mix-blend-plus-lighter` or solid `surface/level-3` + `backdrop-blur 8px`. No box-shadows except the Gig card drop-shadow (= the `glass`/`shadow/md` effect).
4. **Accent border = focus/active affordance:** brand/default, **4px** on search fields & Header-1 row, **2px** on the support input; side varies (right on inputs, left on header title rows).
5. **Recurring off-token values:** fixed component widths (542/275/362/636/1149/1213/1440 — Figma frame widths, treat as fluid/max in code); avatar 26/36/46/48 (vs tokens 24/32); badge 22; small gaps 5/6/10; counter badge radius 484px. A coded version should normalize these to tokens or flag intentional exceptions.
6. **Sidebar nav has no active state in Figma export** — the coded `SidebarNav` already implements `active`; keep it (Figma omission, not a removal).
