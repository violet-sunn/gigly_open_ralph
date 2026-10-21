# DESIGN.md — Gigly visual system

This file governs every UI decision in this repository. Read it fully before touching anything that renders. When a request conflicts with a LAW below, follow this file and say so. Everything else is yours to vary, as long as you record why and do not drift into the failure modes in section 14.

The manifesto (why) lives outside the repo; the designer brief (how, in Russian) too. This file is the agent-facing contract.

## 0. Rule hardness

Three levels. Only the vector is hard; the rest is meant to be varied on the spot.

| Level | What | How to treat it |
| --- | --- | --- |
| **LAW** | The macro decisions from the manifesto: the artwork sets the scene; one dominant hue per scene; light is emitted, not cast, and is rendered, not faked; spectrum is an event; screen-native, never photographic; three screen modes; exactly one L0 per screen; artwork is a work, never a mascot; no fake collaborations or imitated artists; no achromatic gray/black base | Non-negotiable. If a request conflicts, say so and follow the law |
| **DEFAULT** | Decisions made so you do not start from zero: chamfer instead of radius, Cyrillic-first typefaces and the declared pair, tempo from the soundtrack, cut-style thresholds, slot formats, L1/L2 budgets, the copy and "do not" lists | Apply unless you have a reason. Deviate when the screen needs it, record the reason in one line in the PR, and check the result against section 14 |
| **EXAMPLE** | Every concrete number: OKLCH lightness and chroma, chamfer sizes, type sizes, milliseconds, blur radii, ratios, grid columns | Starting values for the first exploration. Change freely; what gets approved becomes the token |

Reading rule: a "never" or "always" next to a number or a micro-detail is a DEFAULT or an EXAMPLE, not a LAW. The LAW list is only what this table and section 2 name.

When this file is silent on something and the obvious answer is "what dark sites usually do": stop, produce an exploration file with 2–3 variants, and ask. A pause beats a default.

## 1. Product context

Gigly is a B2B gig marketplace for the Russian IT market. Companies (legal entities) post scoped work with a mandatory Definition of Done; a vetted pool of Middle+/Senior specialists ("masters") applies with structured proposals. Lifecycle: create → applications → select → work → submit → accept → mark paid. Two surfaces: a marketing site and the product app. Both are web, mobile-first. Full product context: `PRODUCT.md`, `openspec/project.md`.

Positioning: top of the market, open to any company, selective only on the master side. One price, no tiers, no discounts. The words "premium" and "luxury" never appear in UI copy.

Current state of the codebase: the shipped prototype uses an older design (`gigly_full_design/`, `app/_design/`, `scripts/generated-tokens.css`). That is the CURRENT state, not the target. This file is the target. Migration happens screen by screen through `design:` changes (see `CLAUDE.md`).

## 2. Art direction

Working name: cyber-luxe. Loud, cinematic, screen-native color and light, led by commissioned artwork whose style changes by season (anime, abstraction, web art, digital painting, hyper-tribal, folk-print motifs) and whose criteria do not: bright, bold, luminous, stylish. The opposite of muted "safe premium" and the opposite of crypto-style neon on black. The emotional target is the moment in a music video when the beat drops and the screen floods with light.

Five principles, in priority order:

1. **The artwork sets the scene; the interface lives in its light.** The color source of any screen is the current seasonal artwork, not a palette picked from tokens. The artwork's hue defines shadows, surfaces, accents and glow; everything that is not art is rendered in the same light or in slight contrast to it. UI may partially overlay the art (a glass form over flowing hair) or sit beside it — decided per artwork composition, never by template.
2. **One dominant per scene.** Each screen is a scene with one dominant hue across the full lightness range (deep shadow to blown-out highlight) and one contrast point. Two saturated hues never blend in a gradient; they meet at an edge, or through shadow / blown-out white. Shadows are dark versions of the scene hue, never neutral black; there is no achromatic gray-black background in this system.
3. **Light is emitted, not cast.** Light sources are the artwork and the UI objects themselves. No top-down lighting, no drop shadows imitating a sun. Glow scales with the object's brightness and falls off into the scene's shadow. Hard outline + soft halo is the base formula for any glowing element.
4. **Spectrum is an event.** Full iridescent / dichroic color appears in exactly three places: the logo, the primary CTA, and the work-accepted state. Never more than one spectral element per screen.
5. **Screen-native, never photographic.** Anything that reads as photographed, printed or painted is out. Illustration is drawn or digital in any style; materials are glass, liquid and light; there are no photographs of people.

### 2.1 Screen modes

LAW. There is no fixed art-to-UI ratio. Every screen belongs to one of three modes and is designed for that mode. Which mode a given screen gets is a DEFAULT: move a screen between modes if its job calls for it, and say so.

| Mode | Screens | Artwork | Interface | Priority |
| --- | --- | --- | --- | --- |
| Scene | Site hero, sign-in / sign-up, work-accepted | Dominates, animated, most of the viewport | Minimal, liquid prismatic glass that transmits the art's light; placement follows the artwork's zones | Impact |
| Workspace | Gig search / feed, gig card, Definition of Done, applications, dashboard, settings | Confined to its slot (strip, edge, sidebar fragment); never under readable content | Dense opaque surfaces in the scene hue, high-contrast text; glass is never placed over content that must be read | Usability, legibility, speed |
| Threshold | Transitions between screens and state changes | Shows through for a beat | Flash, light leak, fall-off | Continuity |

All three modes share one light: moving from a scene into a workspace changes the amount of art, never the hue. Declare the mode on the screen root: `data-mode="scene" | "workspace"`.

### 2.2 Artwork slot map

DEFAULT, formats are EXAMPLES. A seasonal series is commissioned against this slot map. Each screen has one slot with a format; the artist receives the map and delivers a work or a crop per slot. Slots can move or change shape per season and per artwork; what stays is that every artwork has a declared slot and none appears where it is not a work.

| Screen | Mode | Slot | Format (desktop / mobile) | Behavior |
| --- | --- | --- | --- | --- |
| Landing hero | Scene | Full viewport | 16:9 / 9:16 | Animated (hair, liquid, light); copy and CTA placed in the artwork's open zones |
| Landing sections | Scene | Half viewport or strip | 1:1, 2:1 / 4:5 | Parallax, cropped by viewport edge |
| Sign-in / sign-up | Scene | Full viewport, form overlaid | 16:9 / 9:16 | Animated; glass form transmits light; credit `Gigly × {Artist}` in a corner |
| Gig search / feed | Workspace | Horizontal season strip at top | 6:1 / 3:1 | Slow motion or static; sits under the glass header |
| Gig card, DoD, applications | Workspace | None, or a thin vertical edge strip | 1:8 | Static; never under text |
| Master / company profile | Workspace | Profile cover | 3:1 / 2:1 | Static; artist credit in the cover corner |
| Sidebar menu | Workspace | Vertical fragment under glass | 1:3 | Static or slow light; menu items stay legible |
| Work accepted | Scene | Full-screen state or modal | 16:9 / 9:16 | The only spectrum moment in the app; light animation |
| Emails, empty states, icons | — | None | — | Art is never repeated where it is not a work |

A series is 6–8 works, some of them crops of one composition for several slots. All credited.

### 2.3 Functional light

The artwork lights the scene; the workflow lights itself. Target actions and points of interest have their own light layer, independent of the artwork, fixed across seasons, and governed by an attention hierarchy. In workspace mode this layer is the only thing allowed to be brighter than the artwork.

| Level | What | Light | Budget per screen |
| --- | --- | --- | --- |
| L0 Spectrum | The screen's single primary action: create gig, apply, accept work | `--spectrum` fill + two-layer bloom | Exactly 1 |
| L1 Accent | Secondary actions, active nav item, selected item, progress | `--accent` fill or outline + tight halo | 2–3 |
| L2 Signal | Gig statuses, deadlines, errors, notifications | Fixed semantic hues, as points only: badge, line, icon + text | As needed, never as area |
| L3 Focus | Hover and keyboard focus | `--accent` halo on a 1px outline | — |
| L4 Quiet | Everything else: surfaces, text, dividers, artwork in its slot | Scene shadow, no glow | — |

Rules:
- L2 semantic hues are the only exception to "one dominant per scene": fixed hues, identical in every season, small area only. They cover the six display statuses from `lib/view-models.ts` (`open`, `review`, `in-progress`, `verification`, `completed`, `rejected`) plus ok / warn / danger.
- In workspace mode the brightest pixel on screen is always L0. Artwork in workspace slots is clamped with `--art-dim` so it never competes with the action. In scene mode the clamp is lifted.
- Non-text contrast of L0–L2 elements against their surroundings ≥ 3:1 (WCAG 1.4.11). State is never conveyed by color alone: color + shape or text.
- The level of each element is declared in the component (`data-level="0..4"`); never promote an element for beauty.

## 3. Path flag

The repository declares which path it is on in `design.config.ts`:

```ts
export const DESIGN_PATH: 'MVP' | 'HOUSE' = 'MVP';
```

`MVP`: no commissioned series. Artwork slots are filled with rendered light (shaders, the prism, lit typography). The season hue is set by hand. Open Cyrillic typefaces. One licensed track.
`HOUSE`: commissioned seasonal series fill the slots; the season hue is extracted from the artwork; licensed foundry typefaces; commissioned track.

Everything in sections 4–10 is identical on both paths. Only sections 11–12 branch. Do not drop a LAW or a DEFAULT because the path is MVP: that is exactly how a crypto site happens. Varying EXAMPLE values is fine on either path.

## 4. Tokens and the season hue

All color is derived from one scene hue. There are no achromatic tokens: even the darkest background carries the hue. Lightness steps are fixed; hue is the only thing a season changes.

**HOUSE:** `--hue` and `--hue-contrast` are extracted from the season's hero artwork at build time by `scripts/design-system/palette.ts`: sample the image, convert to OKLCH, cluster by hue (k-means, k=4, weighted by chroma), take the cluster with the largest area as `--hue`, the most distant cluster with chroma > 0.08 as `--hue-contrast`, and the 99th-percentile lightness as the blown-out white reference. The script writes `app/tokens.season.css`. No human picks a hue.

**MVP:** `--hue` and `--hue-contrast` are set by hand in `app/tokens.season.css`, once per quarter. Choose from the edge of the sRGB gamut; never a muted hue.

```css
:root {
  /* season — the only hand-set or extracted values */
  --hue: 232;            /* MVP season 1 */
  --hue-contrast: 48;

  /* shadows and surfaces: the scene hue, never neutral */
  --bg-0: oklch(11% 0.07 var(--hue));
  --bg-1: oklch(17% 0.065 var(--hue));
  --bg-2: oklch(24% 0.06 var(--hue));
  --line: oklch(40% 0.09 var(--hue));

  /* text: the scene's light, tinted */
  --fg-0: oklch(97% 0.025 var(--hue));
  --fg-1: oklch(74% 0.06 var(--hue));
  --fg-2: oklch(54% 0.07 var(--hue));

  /* emissive accent */
  --accent: oklch(74% 0.24 var(--hue));
  --accent-deep: oklch(46% 0.19 var(--hue));
  --accent-bloom: oklch(93% 0.11 var(--hue));
  --contrast: oklch(72% 0.23 var(--hue-contrast));

  /* functional light (L2): fixed across seasons */
  --signal-ok: oklch(80% 0.21 148);
  --signal-warn: oklch(84% 0.19 84);
  --signal-danger: oklch(66% 0.25 22);
  --status-open: oklch(84% 0.16 200);          /* Открыт */
  --status-review: oklch(70% 0.22 300);        /* На рассмотрении (derived) */
  --status-in-progress: oklch(68% 0.22 262);   /* В работе */
  --status-verification: oklch(76% 0.24 340);  /* На проверке */
  --status-completed: oklch(90% 0.22 120);     /* Завершён */
  --status-rejected: oklch(60% 0.10 var(--hue)); /* Отклонён: a quiet shadow, not a signal */
  --art-dim: 0.55;

  /* shape: chamfer, not radius */
  --cut-s: 6px;
  --cut-m: 10px;
  --cut-l: 18px;

  /* tempo: derived from 138 BPM */
  --beat: 435ms;
  --sixteenth: 109ms;
  --hold-2f: 83ms;   /* two frames at 24fps */
}
[data-mode="workspace"] {
  --bg-0: oklch(12% 0.04 var(--hue));
  --bg-1: oklch(18% 0.04 var(--hue));
  --bg-2: oklch(25% 0.04 var(--hue));
}
```

Rules: components reference tokens only; no hex anywhere in `app/`; text never sits on a solid `--accent` fill without a contrast check; `--accent-deep` for pressed states, `--accent-bloom` for the inner halo. Status hues above are EXAMPLES; their assignment to statuses is a DEFAULT and must stay consistent across the product once chosen.

## 5. Light

LAW for the principle, EXAMPLES for the numbers. Light is rendered, not faked with shadows. Glowing elements emit into a shared light pass; sources add up, light falls on neighboring surfaces, and highlights blow out to white. This is the single most visible difference between Gigly and crypto-neon. The implementation below is one way to do it; a different pipeline that produces real additive light is equally fine.

- Implementation: a full-viewport canvas (`<LightLayer>`) behind the DOM. Every element with `data-emit` registers its bounding box, color and intensity. The layer renders emitters to an offscreen buffer, applies a luminance threshold, a two-pass Gaussian blur (radius from `--glow-r`, 24–48 px), and composites additively (`mix-blend-mode: screen` or a WebGL add pass). Emitters update on scroll/resize via `IntersectionObserver` and `ResizeObserver`, never via a scroll listener.
- Intensity follows the functional-light level (2.3): L0 emits at 1.0, L1 at 0.5, L3 (focus) at 0.35. L2 signals emit at 0.25 and only in their own hue. L4 never emits.
- Fallback (no canvas, `prefers-reduced-motion`, or low-power): `box-shadow` two-layer halo (`0 0 3px` at 80% and `0 0 36px` at 15% of the emitter color). The fallback is a fallback, never the default.
- Rim light replaces drop shadow on raised surfaces: `inset 0 1px 0 color-mix(in oklch, var(--fg-0) 14%, transparent)`.
- Glass: `backdrop-filter: blur(14px)` over `--bg-1` at 72–85% alpha, with a 1px `--line` edge and a chamfer (section 7). Never milky, never over text that must be read.
- Liquid backgrounds: a fragment shader (simplex or curl noise, 2 octaves) in `--hue` across the full lightness range, from `--bg-0` to `--accent-bloom`. One per scene. Static PNG fallback rendered at build time.
- Light leaks and flashes: scene transitions only (section 10). Never in workspace mode.

## 6. Dichroic

LAW for the two-color principle, EXAMPLES for the method. Dichroic glass has two colors, a transmitted one and a reflected one, and switches between them with the viewing angle. It is not a rainbow.

- Implementation: a 1D lookup texture of thin-film interference colors (generate with `scripts/design-system/thinfilm.ts`: film thickness 300–700 nm, refractive index 1.5, integrate over the visible spectrum, output 256 OKLCH samples). The fragment shader reads the LUT by `cos(viewAngle)`, where `viewAngle` is driven by pointer position (desktop) or device tilt / scroll progress (mobile).
- CSS fallback: `linear-gradient` between exactly two colors, transmitted `oklch(84% 0.17 200)` and reflected `oklch(78% 0.24 330)`, with the angle driven by `--spectrum-angle`. Never a conic rainbow.
- Applied only to `.logo`, `.cta-primary` (L0) and `.state-accepted`. One per screen.

## 7. Shape

DEFAULT. Corners are cut, not rounded. The brand symbol is a prism; every surface carries a facet. If a specific component reads better rounded, record why; what is not negotiable is one consistent corner system across the product.

- Chamfer 45° via `clip-path: polygon(...)` using `--cut-s` (controls, inputs), `--cut-m` (cards, panels), `--cut-l` (scene containers, modals). One scale, no exceptions; a shape lock.
- Chamfered elements keep a visible 1px edge: draw the outline with a pseudo-element using the same polygon, 1px inset, in `--line` or the emitter color.
- No `border-radius` anywhere except circular avatars. No pill buttons.
- Crisp lines: 1px outlines, no blur on edges. The only softness on screen is light.

## 8. Typography

DEFAULT, sizes are EXAMPLES. Cyrillic is the first language of this product; the typeface is chosen for its Cyrillic, not despite it. Display text behaves like opening-credit titles: wide, confident, lit from inside. Another face with the same logic is acceptable with a recorded reason; a default grotesk picked because it is familiar is not.

- **HOUSE:** license a display and a text face from a Cyrillic-native foundry (CSTM Fonts, Contrast Foundry, Paratype, Brownfox, type.today). Display: wide proportion. Text: humanist-leaning grotesk with tabular lining figures.
- **MVP:** open faces with the same logic. Display: Unbounded. Text: Golos Text (alternative: Onest). Self-hosted WOFF2 under `public/fonts/` (the RF build cluster must not depend on Google Fonts), `font-display: optional` to avoid layout shift. The prototype's Handjet / Manrope are the CURRENT state and are retired screen by screen.
- Scale, exactly three steps plus meta; no intermediate sizes:
  - display: `clamp(44px, 7.5vw, 112px)`, weight 700–800, letter-spacing −0.02em, line-height 0.95
  - title: `clamp(24px, 2.6vw, 36px)`, weight 600, letter-spacing −0.01em, line-height 1.15
  - body: 17px, line-height 1.55, max line length 72ch
  - meta: 13px, same text face, `font-variant-numeric: tabular-nums`, sentence case
- Numbers (amounts in ₽, dates, deadlines, IDs) use tabular figures of the text face. No monospace anywhere.
- No tracked uppercase eyebrows, no single highlighted word in a headline, no labels above content that the content already explains.

## 9. Layout

- Scenes compose like a film frame, not a grid. Default scene ratio 2.39:1 on desktop (letterboxed inside the viewport), 9:16 on mobile. Headline and primary action anchor to the lower-left of the frame, like end credits; the artwork's open zones decide the final position per scene.
- Workspace uses a grid sized to the task, not a 12-column template: gig card 8 columns + 4 for status and actions on desktop; single column on mobile. Base unit 8px; dense inside cards (12–16px), generous between blocks (≥ 96px desktop, ≥ 64px mobile).
- Mobile first. Breakpoints 390 / 768 / 1280 / 1440. No horizontal scroll. Touch targets ≥ 44px.
- Navigation one line on desktop, ≤ 72px tall; the hero fits the first viewport with the primary action visible.

## 10. Motion

DEFAULT, numbers are EXAMPLES. Motion is cut like a music video, not eased like a SaaS page. Tempo comes from the soundtrack: 138 BPM, one beat = 435 ms. Vary the cut pattern per scene; keep the idea that thresholds are events and workspace motion is quick and quiet.

- Scene transitions (thresholds): hold 2 frames (`--hold-2f`), cut to a flash frame in `--accent-bloom`, hold 2 frames, land. Total ≤ one beat. Easing `steps()` for the holds, linear for the flash. Never a crossfade, never easeOutExpo.
- Micro-interactions (workspace): one sixteenth (`--sixteenth`, 109 ms). Glow rises on hover/focus and falls on blur with `cubic-bezier(0.2, 0, 0, 1)` (fast in, no overshoot). Pressed state: `--accent-deep`, 2-frame hold. In workspace mode the `emil-design-eng` skill's rules apply on top of this: frequent actions may not animate at all.
- Scroll-driven motion on the site: parallax layers at 0.3–0.7× via CSS scroll-driven animations or GSAP ScrollTrigger; `IntersectionObserver` for reveals. `window.addEventListener('scroll')` is banned.
- Entrance animation: one orchestrated moment per page load (the scene lights up), not a fade-and-slide on every section.
- `prefers-reduced-motion: reduce`: thresholds become a single ≤150 ms opacity cut; shaders are replaced by static frames; parallax off; the light layer freezes at its default state.

## 11. Artwork (branches by path)

**HOUSE.** Seasonal series of 6–8 works by one commissioned artist, filling the slot map (2.2). Style changes by season. Fixed criteria: screen-native, high chroma, strong light, crisp form; bright, bold, luminous, stylish. Credited in-slot: `Artwork — {Artist}`. Figures are anonymous: no names, roles, story, mascots. The season hue is extracted from the hero work (section 4).

**MVP.** No series and no imitation of one. Slots are filled with rendered light:
- Landing hero: a refractive glass prism in WebGL (Three.js, transmission material with dispersion), the season liquid behind it, the headline lit from inside by the light layer. An object, not a character.
- Sign-in / sign-up: season liquid full-viewport, the same glass form as in HOUSE.
- Feed strip, profile cover, sidebar fragment: the season liquid shader in the slot's format; profile cover is user-replaceable.
- Work accepted: the prism splits light across the whole screen. Spectrum only.
- Optional: one licensed existing artwork for the hero, credited `Artwork — {Artist}`, licensed for web use. Never called a collaboration, never part of a "collection".
- Banned on MVP: generated images imitating a specific artist or studio; stock illustration; "friendly" illustration kits; placeholder art of any kind.

On both paths the moodboard frames in `brand-visuals/refs/` are for mood only. Never reproduce, trace, or embed them.

## 12. Sound (branches by path)

- Genre: new-wave synthwave and hyperpop, 130–150 BPM. No retro-80s melancholy, no retro visuals.
- **HOUSE:** one commissioned track or mini-album per season, credited; `--beat` is recomputed from its BPM.
- **MVP:** one licensed track in the genre, credited `Music — {Artist}`; `--beat` set from its BPM (default 138).
- Player: a compact chamfered glass object in a viewport corner. Never autoplay; starts only on user action; persists on/off and volume in `localStorage` (wrapped in try/catch). Never overlaps the primary action on mobile.
- When playing, drive the light layer's global intensity and `--spectrum-angle` from the Web Audio `AnalyserNode` amplitude (low band). Sound and light must read as one phenomenon.
- No third-party streaming embeds.

## 13. Copy

- Buttons name the action: «Опубликовать гиг», «Откликнуться», «Принять работу». Never «Начать», «Далее», «Submit». The same verb persists through the flow and its confirmation.
- Sentence case. No tracked uppercase labels. No em-dash flourishes in UI copy; use a plain sentence.
- No «→» after links or buttons. No «01 / 02 / 03» numbering unless the content is a real sequence. No «scroll to explore». No decorative status dots. No city / time / weather strips. No version labels.
- Errors say what happened and what to do, in the product's voice. Empty states invite one action.
- The words «премиум», «люкс», «luxury», «premium» never appear.

## 14. Do not

- No neutral gray or black anywhere; shadows are the scene hue.
- No `box-shadow` glow as the default light; the light layer is the default.
- No `border-radius` (except circular avatars); no pill buttons.
- No conic rainbow for dichroic.
- No easeOutExpo, no fade-and-slide entrances per section, no `window.addEventListener('scroll')`.
- No monospace; no tracked uppercase eyebrows; no single highlighted word in a headline.
- No glass over content that must be read.
- No cyberpunk grime, rain, glitch, HUD chrome; no retro-synthwave grids or sunsets; no purple-blue blob gradients, milky glassmorphism, particle backgrounds.
- No mascots, role characters, stickers; no photographs of people; no stock imagery.
- No fake collaborations, no AI art imitating a named artist.
- No hue outside the token system; no hard-coded hex.

## 15. Definition of done for any UI task

- [ ] `DESIGN_PATH` respected; nothing from a core section (4–10) was simplified because the path is MVP.
- [ ] Screen mode (2.1) declared via `data-mode`; artwork or light fills the slot from 2.2 in the right format.
- [ ] Exactly one scene hue, no achromatic colors, and at most one spectral element per screen.
- [ ] Every element declares its functional-light level (2.3); exactly one L0 per screen; `--art-dim` applied in workspace mode.
- [ ] Light rendered by the light layer; `box-shadow` present only as the documented fallback.
- [ ] All corners chamfered with the `--cut-*` scale; no `border-radius` except avatars.
- [ ] Motion timed to `--beat` / `--sixteenth`; thresholds are cuts with holds, not fades; one entrance moment per page.
- [ ] Typeface is the declared pair; three type steps plus meta; tabular figures for numbers; no monospace.
- [ ] Text contrast ≥ 7:1 primary, ≥ 4.5:1 secondary; non-text contrast ≥ 3:1 for L0–L2; state never conveyed by color alone (`npm run lint:contrast`).
- [ ] Every interactive element has default / hover / focus-visible / active / disabled; focus visible via glow.
- [ ] Works at 390px without horizontal scroll; touch targets ≥ 44px; hero fits the first viewport with the primary action visible.
- [ ] `prefers-reduced-motion` honored; WebGL and shaders have static fallbacks; no layout shift from fonts or canvases.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.
- [ ] Copy passes section 13; nothing from section 14 is present; Impeccable `/audit` reports zero findings outside the documented ignore list.

## 16. How to start a visual task

1. Read this file and `design.config.ts`. Note the path.
2. Load the moodboard frames (`brand-visuals/refs/`) for mood only. Put the soundtrack on if you can: the tempo is in the tokens for a reason.
3. Before writing code, write a short design read in the change's `proposal.md`: the screen's mode, its slot, the one L0 action, and which decisions from sections 4–10 the screen will make visible. If any of it reads like what you would do for any other dark site, change it.
4. For a new page or component, produce one exploration file under `app/lab/` with 2–3 variants (scene hue, chamfer scale, display type, the L0 button, a card, the prism element, one light effect) and stop for review. Do not build the full page before a variant is chosen.
5. Build with tokens. Run the definition of done. Report honestly what you could not satisfy and why.
