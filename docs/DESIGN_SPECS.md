# Gigly Design Specs — extracted from the in-hand SVGs

**Created:** 2026-06-14 · **Source of truth:** `screens/tokens.svg`, `screens/frames.svg`
**Produced by:** the `extract-svg-tokens-and-assets` change (Phase 0 #1 of the UI redesign plan).

This document records the **raw, observed** design-system substrate extracted directly from the two vector
SVGs we already have. Every value here is traceable to a concrete SVG fill or coordinate (grep-verifiable).
This is **not** a normalized/canonical token set — collapsing near-duplicates into canonical scales and
assigning semantic names is the next change (`derive-design-system` → `design-token-engine`). Until then,
this file + the `/screens` SVGs are the authoritative reference for new UI work.

> **Method:** values were read from the SVG source, never eyeballed. Colours = distinct `fill="#…"` values;
> radii = distinct `rx="…"` values; icon sizes = clipPath/coordinate bounding boxes. Renders were produced
> from the SVGs (`sharp` for `tokens.svg`; Chromium/Playwright for `frames.svg`, which libvips rejects).

---

## 1. Source inventory (what the SVGs actually contain)

| File | Canvas | Artboard label | Contents |
|---|---|---|---|
| `screens/tokens.svg` | 1360×9175 | **"tokens"** | Atomic library: nav menu items (+states), expanded sidebar, collapsed icon-rail, topbar profile card, tech tags, filter radio, filter dropdown, category tags, status dots, "Текущий" badge, progress bar, search input, rating row, buttons, experience tags, view-toggle. |
| `screens/frames.svg` | 3940×11463 | **"components"** | Composite components: sidebar (with **GIGLY** logo + **«/»** collapse), support card (with **send ✈**), logout icon, search bars + filter dropdowns, page headings, tabs, **GigCard** (all 6 status variants), **MessageBubble**/chat thread, conversation items, notifications panel. |
| `screens/*.jpg` (12) | — | — | **Lossy** assembled-screen mockups. |

> **Key finding (scope correction).** The SVGs contain the **component library**, *not* the assembled screen
> frames. The 12 screen JPGs exist only as **lossy JPGs**; the high-fidelity screen frames live in **Figma**
> and are a residual gap (see §7). This matches the planning doc ("the Figma frames are the fidelity source").

---

## 2. Colour palette (raw observed fills)

22 distinct six-digit hex fills + `white`, across both SVGs. Count = number of `fill="…"` occurrences
(a rough proxy for prominence). All values are grep-verifiable in the SVGs.

### Surface
| Hex | Count | Observed role |
|---|---|---|
| `#01030e` | 30 | Page / darkest background |
| `#0e101a` | 52 | Surface (recessed) |
| `#10121c` | 71 | Surface (card / input) |
| `#1a1a24` | 28 | Surface (elevated / hover) |
| `#1a1d2a` | 24 | Surface (alt elevated) |

### Neutral / text / border
| Hex | Count | Observed role |
|---|---|---|
| `#8a8f99` | 699 | Muted text & icon strokes (primary neutral) |
| `#9fa0a4` | 306 | Muted text (secondary neutral) |
| `#3a3d45` | 14 | Borders / dividers |
| `white` | — | Primary text / active glyphs (`fill="white"`) |

### Brand (blue)
| Hex | Count | Observed role |
|---|---|---|
| `#0088ff` | 215 | Brand primary (CTAs, active, accents) |
| `#4cacff` | 40 | Brand light (hover / highlight) |
| `#0077e6` | 13 | Brand dark (pressed) |
| `#1379f3` | 2 | Brand blue (alt) |
| `#0099ff` | 1 | Brand blue (alt) |

### Status (the 6 gig statuses)
| Status (RU) | Hex | Count |
|---|---|---|
| Открыт (neutral) | `white` / `#8a8f99` | — |
| На рассмотрении (amber) | `#f59e0b` | 6 |
| В работе (blue) | `#3b82f6` | 6 |
| На проверке (purple) | `#8b5cf6` | 6 |
| Завершён (green) | `#10b981` (also `#0cc671`) | 6 / 4 |
| Отклонён (red) | `#ef4444` (also `#ff383c`) | 10 / 4 |

### Tag / category
| Category (RU) | Accent hex | Count |
|---|---|---|
| Маркетинг | `#0088ff` / `#3b82f6` (blue) | — |
| Дизайн | `#f45fb1` (pink) | 28 |
| Программирование | `#0cc671` (green) | 4 |
| Разработка | `#05c9e6` (teal) | 4 |
| Кодинг | `#f27c0d` (orange) | 4 |

> **Deltas from the planning estimate:** `#1a1d2a`, `#3a3d45`, `#1379f3`, `#0099ff` are present in the SVGs
> but were **not** in the planning doc's colour list — confirming the "read the actual fills" discipline.
> The near-duplicate pairs (`#10b981`/`#0cc671`, `#ef4444`/`#ff383c`, the four blues) are recorded as-found;
> deciding which is canonical is `derive-design-system`'s job.

---

## 3. Radius set (raw observed `rx`)

13 distinct corner radii, spanning **2–18px**. Each is grep-verifiable as an `rx="…"` in the SVGs.

| `rx` (px) | Count | Observed context |
|---|---|---|
| 2 | 27 | Tiny chips / inner accents |
| 2.5 | 3 | Tiny chips |
| 3 | 3 | Small badges |
| 3.5 | 10 | Small badges |
| 4 | 8 | Tags / small controls |
| 4.5 | 39 | Tags, radios, small controls (most common small radius) |
| 5 | 6 | Small controls |
| 8 | 38 | Cards, inputs, buttons (the dominant component radius) |
| 11 | 4 | Medium containers |
| 12 | 16 | Cards / panels |
| 13 | 2 | Cards / panels |
| 16 | 2 | Large containers |
| 18 | 4 | Pills / large rounded containers |

> Presented as observed. `derive-design-system` will normalize this into a canonical scale (e.g. snapping
> 2/2.5/3/3.5 and 11/12/13 into fewer steps) and flag any genuine divergences as variants.

---

## 4. Component inventory (catalogued from the rendered SVGs)

From `tokens.svg` ("tokens"): NavMenuItem (default / hover / selected + count badge; expanded & collapsed),
SidebarNav (expanded list + collapsed icon-rail), TopbarProfileCard (avatar + bell + gear), Tag (tech,
filled, 5 colours), CategoryTag (left-accent, 5 categories), FilterRadio (off / hover / on / disabled),
FilterDropdown (collapsed / expanded with options), StatusDot×6, "Текущий" badge, ProgressBar, SearchInput
(with clear ✕), RatingRow (avatar + verified + ★×5 + count + experience tag, online variant), Button
(primary / hover / pressed / secondary / ghost / disabled / link), ExperienceTag (`[Senior Frontend Engineer]`),
ViewToggle (grid / list).

From `frames.svg` ("components"): Sidebar (GIGLY logo + «/» collapse + profile + nav + support), SupportCard
(help "?" + input + send ✈), LogoutControl, SearchBar (+ filter dropdowns), PageHeading (blue accent),
Tabs, GigCard (6 status variants: status-coloured top border, rating, tags, budget `300 400 ₽`, deadline
`14 дней`, "К проекту"), MessageBubble (in/out), ConversationItem, NotificationsPanel.

---

## 5. Measured geometry (from SVG coordinates — no estimates)

**Key finding — standard control height is `40px`** (buttons, inputs, status pills, and dropdowns all measure
exactly 40px tall in the coordinate data).

| Component | Measurement (W×H, px) | Radius | Notes / source |
|---|---|---|---|
| Standard control height | **·×40** | — | shared by button / input / status pill / dropdown |
| Primary button (`К проекту`) | **99×40** | rounded | path bbox x180–279, y8060–8100 |
| Search input (`Поиск…`) | **800×40** | 8 | path bbox x180–980, y7753–7793 |
| → search icon inset | **12px left** | — | icon x192 − box x180; icon 16×16 |
| → clear (✕) icon | **16×16, right** | — | at x952–968 |
| Status badge (pill) | **126×40** | rounded | path bbox x180–306, y6949–6989 |
| Status badge (inline) | dot + label | — | dot variant, no background |
| Filter option / dropdown box | **106×40** | 0 (inner) | `rect` 106×40 fill `#0E101A` |
| Category tag | **60×23** | 0 (accent) | `rect` 60×23 in 5 category colours |
| Progress bar | **1006×4** | 2 | track `#9FA0A4`, fill `#0088FF` (`rect` rx=2) |
| Avatar (small) | **24×24** | 12 (circle) | `rect` 24×24 rx=12 |
| Avatar (large) | **32×32** | 16 (circle) | `rect` 32×32 rx=16 |
| Icon badge / container | **16×16** | 8 | `rect` 16×16 rx=8 fill `#0088FF` |
| Standard icon | **16×16** | — | 73 clipPath rects are exactly 16×16 |
| Collapsed-rail nav icon | **20×20** | — | coordinate bbox (rail, y≈6563–7119) |
| Nav row vertical pitch | **40px** | — | dashboard icon @y540 → search @y579 (and 40px rows) |
| Nav icon left inset | **12px** | — | icon x192 − sidebar content x180 |
| View-toggle | **60×32** (two 24px glyphs) | — | coordinate bbox (x180–240, y8737–8769) |
| Status dot | **8px circle** | — | faithful synthesized dot (see §6) |

**Radius → component mapping** (from §3 + renders): cards / inputs / buttons = **8px**; tags / radios = **4.5px**;
panels = **12px**; pills = **18px**; avatars = half-size (circular); tiny inner chips = **2px**.

> All values above are read from SVG `rect` attributes or path coordinate bounding boxes — none estimated.
> Composite components that live only in `frames.svg` (GigCard, MessageBubble) sit inside `translate()` groups;
> their internal paddings/gaps require transform-resolved measurement and are the one remaining refinement here.

---

## 6. Asset library index (`public/assets/design-system/`)

**Icons** (`icons/`, 20 files, optimized SVG, `viewBox`, `role="img"`+`aria-label`):
- Sliced from `tokens.svg`: `dashboard, search, my-gigs, chats, finances, disputes` (nav set), `bell, gear,
  filter, radio-off, radio-on, clear, verified, star, view-toggle, grid, list`.
- Sliced from `frames.svg` (transform-resolved): `collapse` (« chevron), `send` (✈).
- Synthesized faithful `status-dot` (8px circle, tinted per status via `currentColor` — geometrically exact,
  not an approximation).

**Brand** (`brand/gigly-logo.svg`): GIGLY wordmark — the production asset from the auth-flow extraction of the
same design. *Note:* a direct `frames.svg` slice was attempted (the wordmark sits in the sidebar header), but
the pixel-font letterforms' overlapping fills do not isolate cleanly into a standalone SVG, so the verified
production wordmark is used; a clean `frames.svg` re-slice is deferred as a refinement.

**Pattern** (`patterns/checkerboard.svg`): decorative checkerboard (`aria-hidden`), from the same auth extraction.

---

## 7. Residual gaps (NOT recoverable from the in-hand SVGs → Figma / source)

Each item names what is missing, why, and where it must come from. Figma/Dev Mode is to be used **only** for
these — never to re-source a value the SVGs already encode.

1. **Assembled screen frames (high-fidelity).** The SVGs are the *component library*, not the 12 screen JPGs.
   Full screens exist only as **lossy JPGs** (`screens/*.jpg`). High-fidelity per-screen frames must be
   **exported from Figma**. (Interim lossy baselines from the JPGs are staged under
   `docs/design-system/reference-renders/frames/`, clearly marked lossy.)
2. **Raster banner art.** The cosmic banner imagery is raster — `frames.svg` contains **2 `<image>` nodes**
   (and `tokens.svg` 1). Export the source raster from Figma.
3. **Font metrics.** **Zero `font-family`** references — all text is **outlined to paths**, so SF Compact +
   NKDy Mono are unrecoverable here. Obtain font files + a web-embedding licence from Figma/source.
4. **Semantic token names.** The SVGs encode values, not names. Attach semantic names from a fresh Figma
   token export (this is `design-token-engine`'s input).
5. **Icons not present in the in-hand SVGs** (2 of the originally-named set):
   - `attach` — not found in either component sheet; expected in the chat composer (assembled screen → Figma).
   - `eye` (password reveal) — not in the component SVGs; appears only on the auth screen (JPG → Figma).

   *(Resolved — no longer gaps: `collapse` and `send` were successfully extracted from `frames.svg` via
   transform-resolved slicing and are in the library.)*
6. **Other components absent from the SVGs** — none found beyond the above: the `tokens.svg` + `frames.svg`
   library appears to cover the component set. Any redesign component discovered later to be missing from the
   SVGs routes here (→ request from Figma).

---

## 8. Reference renders (`docs/design-system/reference-renders/`)

- `components/library-full.png` + `library-tile-0..7.png` — full `tokens.svg` library at native fidelity,
  tiled for inspection (covers every atomic component).
- `components/` also stages the `frames.svg` ("components") render.
- `frames/` — interim **lossy** per-screen baselines from the JPGs, pending high-fidelity Figma export (§7.1).

> These are the fidelity baseline that `fidelity-harness` (Phase 0 #9) will diff against.
