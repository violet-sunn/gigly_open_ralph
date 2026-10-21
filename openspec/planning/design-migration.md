# Design Migration: from the transported prototype to DESIGN.md

**Created:** 2026-10-21
**Status:** PLANNED
**Supersedes:** `archive/transport-design-from-prototype.md` as the design source of truth (its method and its lessons stay)

## Problem

The live app is a faithful transport of `gigly_full_design/` (dark/light theme, blue brand accent, Handjet/Manrope). That campaign ended the drift between prototype and app, but it moved the *old* design. The product now has a new visual direction, recorded in `DESIGN.md` at the repo root: seasonal artwork sets each screen's light, one hue per scene, rendered (not faked) light, chamfered shape, Cyrillic-first type, music-video motion, two intensity modes (scene / workspace). None of the shipped screens follow it, and the old token engine (`openspec/specs/ui/design-tokens.json` → `scripts/generated-tokens.css`) cannot express it: it is hex-based, achromatic at the base, and theme-switched, while the new system is one OKLCH hue per season with fixed lightness steps.

## Why This Matters

`DESIGN.md` is the product's positioning made visible: top of the market, open to every company, beautiful because it is beautiful. A B2B marketplace whose UI reads as "another dark SaaS" undercuts the whole bet. Four earlier campaigns taught two lessons recorded in `transport-design-from-prototype.md`: reconstruction by eye drifts, and "E2E green" is not a design gate. This campaign keeps both lessons and adds a third from `DESIGN.md` §0: only the vector is law; micro-decisions are varied on the spot and recorded, never frozen into rules the agent follows blindly.

## Scope

**Affected systems:**
- **Tokens** — a new season-hue token layer (`app/tokens.season.css` + derived OKLCH scale) replaces `scripts/generated-tokens.css` as the thing Tailwind and components consume. The old engine is retired at the end, not at the start.
- **Design package** — `packages/design/` (or `app/_system/` if a workspace package is too much for the MVP): light layer, chamfer primitives, dichroic element, typography scale, base components (button L0/L1, input, card, status badge, player). Built in isolation; the app imports nothing from it until a screen migrates.
- **Lab** — `app/lab/` exploration route, excluded from the DoD script and from production builds. Where variants live before a decision.
- **Screens** — every route under `app/(protected)/`, `app/login`, `app/register`, `app/page.tsx`, `app/admin/*`. Each migrates in its own change, declaring mode, slot and L0.
- **Validators** — `scripts/design-system/validate-contrast.js` and `validate-tokens.js` are bound to the old JSON; they are ported to the OKLCH layer in change 1. `fidelity-diff.js` (pixelmatch) and the Playwright harness become the visual-regression gate. `design-dod.mjs` is the deterministic DoD.
- **Specs** — `openspec/specs/ui/spec.md` (8 486 lines, page-level requirements for the pre-redesign UI) is rewritten per screen as each migrates: the screen's visual requirements become a short section pointing at `DESIGN.md`, behaviour requirements stay.
- **Skills** — `design-taste-frontend` at exploration, `emil-design-eng` in workspace mode, `gigly-design-dod` at validation, Impeccable `/audit` on every changed surface (see `CLAUDE.md` §4).

**Dependencies:**
- Change 1 (tokens + validators) and change 2 (lab + exploration) are prerequisites for everything.
- Change 3 (design package) is a prerequisite for every screen change.
- Change 4 (pilot screen) is the go/no-go checkpoint; nothing after it starts until it is approved by the user on a screenshot.
- `DESIGN_PATH` in `design.config.ts` is `MVP` for the whole campaign; HOUSE-only work (palette extraction, foundry type, commissioned art) is listed as follow-ups.

**Process:**
- Dedicated branch `design/migration`; one change per commit or more; every screen revertable alone.
- `feat:` and `design:` changes never mix (`CLAUDE.md` §1). If a screen's migration reveals missing behaviour, that is a separate `feat:` change shipped first.
- Verification per change: `design-dod.mjs` + Impeccable `/audit` + Playwright screenshots at 390 and 1440 **reviewed by the user**, plus the existing E2E suite green. The agent never self-certifies that a screen "reads as Gigly".
- The old design stays live on every screen until that screen's change lands. The app is shippable at every commit.

**Non-goals / ground rules:**
- **No sixth UI system.** The design package is the one new substrate; nothing else is introduced. The `app/components/{primitives,blocks,templates,ui}` kit from earlier campaigns is retired as screens migrate, not extended.
- **No reconstruction by eye of DESIGN.md either.** Every number in it is an EXAMPLE; the lab decides the real values once, then the package carries them. Screens consume the package; they do not reinterpret the document.
- **No HOUSE work on MVP.** No commissioned art, no palette extraction script, no foundry licenses. Slots are filled with rendered light (DESIGN.md §11 MVP).
- **Desktop and mobile both**, unlike the transport campaign: DESIGN.md is mobile-first and the DoD checks 390 px.
- **Workbench routes** (`app/workbench/*`) are the old kit's showcase; they are deleted in the final change, not migrated.

**Risks / unknowns:**
- The light layer (canvas behind the DOM, additive compositing) is the one piece of real engineering risk. It is built and measured in change 3 before any screen depends on it; if it cannot hit Lighthouse ≥ 90 on mobile, the documented `box-shadow` fallback becomes the default on mobile and the plan is revised.
- Tailwind consumes `var(--token)` today; moving the vars to OKLCH keeps the utilities working, but every `rounded-*` and `shadow-*` utility in the codebase violates DESIGN.md §7/§5. The pilot screen measures how much of that is mechanical.
- The six status colours are fixed L2 tokens; the current status badges use the old hex palette. Change 1 maps them once; screens inherit.
- Fonts: Handjet/Manrope are self-hosted for the RF build cluster. Unbounded and Golos Text must be self-hosted the same way (change 1), never fetched from Google.

## Method (what a migration of one screen is)

1. **Declare before drawing.** The change's `proposal.md` names the screen's mode (`scene` / `workspace`), its artwork slot (DESIGN.md §2.2) and its single L0 action. Missing → the change is not ready.
2. **Behaviour untouched.** The `page.tsx → view-model → *Design.tsx` architecture stays. Only the `*Design.tsx` markup and styles change. If the VM lacks something the new design shows, stop and file a `feat:` change.
3. **Package, not page.** The screen is composed from `packages/design` components. A component the screen needs that the package lacks is added to the package in the same change, with its own exploration in `/lab` first.
4. **Deviations are written down.** Any departure from a DEFAULT in DESIGN.md gets one line in `proposal.md`. Unrecorded deviation = DoD failure.
5. **Verification is your eyes.** Screenshots at 390 and 1440 beside the previous baseline, `design-dod.mjs` clean, Impeccable `/audit` clean outside the ignore list, E2E green. The user approves on the screenshot; the agent reports, it does not grade.

**Pilot checkpoint.** Change 4 (gig search / feed) is the go/no-go for the method: it is a workspace screen with a slot (season strip), a status badge set (L2), one L0, and dense content, so it exercises every rule at once. If the light layer, the chamfer utilities and the token migration hold there, proceed. If the lift is heavier than assumed, pause and revise this plan before rolling further.

## Changes

### 1. Season-hue token layer and ported validators
```bash
/ralphy-plan design-tokens-season-hue "design: introduce the DESIGN.md §4 token layer without touching any screen. Requirements: (1) add app/tokens.season.css with --hue/--hue-contrast for MVP season 1 and the derived OKLCH scale (bg-0..2, line, fg-0..2, accent/deep/bloom, contrast, signal-*, status-* for the six display statuses in lib/view-models.ts, art-dim, cut-s/m/l, beat/sixteenth/hold-2f) plus the [data-mode=workspace] override; (2) load it from app/globals.css AFTER scripts/generated-tokens.css so existing screens are unaffected (new vars are additive); (3) self-host Unbounded and Golos Text WOFF2 under public/fonts with font-display optional and register --font-display/--font-text; (4) port scripts/design-system/validate-contrast.js to read the OKLCH layer (parse app/tokens.season.css, convert OKLCH→sRGB, check fg-0 on bg-0 >= 7:1, fg-1 >= 4.5:1, every status/signal on bg-1 >= 3:1 non-text); (5) port validate-tokens.js to assert the layer has every required var and no hex; (6) design-dod.mjs excludes app/_design and scripts/generated-tokens.css (legacy) — keep that. Non-goals: no component or screen changes; no removal of the old engine. Test: npm run lint:contrast and npm run validate:tokens pass on the new layer; existing E2E green; Playwright screenshots of / and /login unchanged versus baseline."
```

### 2. Lab route and the first exploration
```bash
/ralphy-plan design-lab-exploration "design: create the exploration space and the first style tile, no production screen touched. Requirements: (1) app/lab/page.tsx behind a NODE_ENV!==production guard (404 in prod), excluded from design-dod.mjs (already in its LEGACY list) and from E2E; (2) one exploration page with three variants side by side per DESIGN.md §16: scene hue (hue 232 / 40 / 305 as starting points), chamfer scale, display + text type at the three steps, the L0 button with the CSS-fallback dichroic, an L1 button, one gig card with a status badge, a thin season-light strip (CSS animated gradient placeholder for the shader), one glow using the box-shadow fallback; (3) each variant declares data-mode=workspace and exactly one data-level=0; (4) a toggle to view each variant in scene mode with a full-bleed liquid placeholder behind a glass form; (5) run design-taste-frontend on the page and Impeccable /audit, paste findings into proposal.md, resolve or record each. Non-goals: no light layer yet, no WebGL, no component package. Test: npm run build succeeds; node scripts/design-system/design-dod.mjs app/lab/page.tsx is skipped by design; screenshots at 390 and 1440 of all three variants attached for the user to choose. STOP after screenshots; the user picks a variant before change 3 starts."
```

### 3. Design package: light layer, chamfer, dichroic, type, base components
```bash
/ralphy-plan design-package-foundation "design: build packages/design (or app/_system if a workspace package is disproportionate for the MVP — decide and record) from the variant chosen in change 2. Requirements: (1) <LightLayer> per DESIGN.md §5: full-viewport canvas behind the DOM, data-emit registration via IntersectionObserver/ResizeObserver, luminance threshold + two-pass blur + additive composite, intensity by data-level (L0 1.0, L1 0.5, L3 0.35, L2 0.25), box-shadow fallback under prefers-reduced-motion or when canvas is unavailable; measure on a 390px mobile profile and record Lighthouse Performance; (2) chamfer utilities: a cut() helper producing clip-path polygons for --cut-s/m/l and a pseudo-element 1px edge; a Tailwind plugin or CSS classes .cut-s/.cut-m/.cut-l; (3) <Dichroic> element: CSS two-colour fallback driven by --spectrum-angle from pointer/scroll; WebGL thin-film LUT is a follow-up; (4) type scale classes .t-display/.t-title/.t-body/.t-meta with tabular-nums; (5) base components: Button (level 0/1 + ghost, all states, data-level), Input, Card, StatusBadge (six statuses → --status-* tokens, colour + text, never colour alone), Player shell (no audio yet); (6) a Storybook or Ladle story per component, each story declaring data-mode; (7) emil-design-eng rules applied to all workspace micro-interactions and review-animations run on the stories. Non-goals: no production screen imports the package yet; no shaders. Test: unit tests for cut() and the LUT fallback math; stories render; design-dod.mjs clean on the package; Lighthouse mobile >= 90 on a story page with the light layer active — if not, box-shadow becomes the mobile default and this is recorded in proposal.md."
```

### 4. Pilot: gig search / feed (workspace)
```bash
/ralphy-plan design-migrate-gig-search "design: migrate app/(protected)/gigs (search/feed) to DESIGN.md as the pilot. proposal.md MUST declare: mode=workspace; slot=horizontal season strip 6:1 at top under the glass header (MVP: animated season gradient placeholder, static fallback); L0=the gig card's primary action for the current role (specialist: Откликнуться on the focused card; client: Опубликовать гиг). Requirements: (1) replace the screen's *Design.tsx markup with package components; keep page.tsx and the view-model untouched; (2) status badges use StatusBadge/--status-* tokens; (3) art-dim applied to the strip; (4) no rounded-*/shadow-* utilities remain in the screen; (5) 390 and 1440 layouts per DESIGN.md §9 (8+4 columns desktop, single column mobile); (6) rewrite the 'Gig Browse Page' sections of openspec/specs/ui/spec.md: behaviour scenarios stay, visual requirements become a reference to DESIGN.md §2.1/§2.3 and the declared mode/slot/L0. Non-goals: no other route; no VM changes (file a feat: change if needed). Test: compose-gig-search.spec.ts and specialist-journey E2E green; design-dod.mjs clean; Impeccable /audit clean outside ignore list; lint:contrast passes; Playwright screenshots at 390/1440 saved for user review. GO/NO-GO: the campaign pauses here until the user approves the screenshots."
```

### 5. Shared shell: sidebar, header, notifications, player
```bash
/ralphy-plan design-migrate-shell "design: migrate app/_design/AppShellDesign.tsx and app/components/MainNav, NotificationBell, NotificationDropdown to the package. proposal.md declares: mode=workspace; slot=vertical fragment 1:3 under glass in the sidebar (MVP: season light); L0=none in the shell (the shell never carries the screen's L0; active nav item is L1). Requirements: (1) chamfered glass sidebar and header; (2) nav counts and notification bell keep their live behaviour (specs: Sidebar Nav Counts Are Live, Notification Bell Refreshes); (3) the Player shell mounted in a corner, no audio source yet, never overlapping an L0 on mobile; (4) role switcher and logout as L1/ghost buttons; (5) rewrite the Navigation Header / Notification Bell / Layout Container sections of ui/spec.md. Test: every protected route still renders inside the shell; attention-feed-lifecycle and auth-navigation E2E green; DoD, audit, contrast, screenshots."
```

### 6. Dashboards (client, specialist, admin)
```bash
/ralphy-plan design-migrate-dashboards "design: migrate app/(protected)/dashboard (both roles) and app/admin to the package. mode=workspace; slot=none or thin vertical edge strip 1:8; L0 per role: client=Опубликовать гиг, specialist=Найти гиг, admin=the moderation queue's primary action. Requirements: AttentionCardDesign and the attention feed rebuilt from Card + StatusBadge; payment status display per spec; no rounded/shadow utilities; ui/spec.md Role-Based Dashboard sections rewritten. Test: compose-client-dashboard, compose-specialist-dashboard, compose-admin-dashboard, admin-moderation E2E green; DoD, audit, contrast, screenshots."
```

### 7. Gig detail, applications, create/edit gig
```bash
/ralphy-plan design-migrate-gig-lifecycle "design: migrate app/(protected)/gigs/[id], gigs/[id]/applications, gigs/[id]/edit, gigs/new, gigs/new/success, my-gigs. mode=workspace for all; slot=none; L0 per screen: detail=role/status-dependent primary (Откликнуться / Принять работу / Отметить оплату), applications=Выбрать мастера, new/edit=Опубликовать гиг, my-gigs=none (list) or the focused card's action. Requirements: the Definition of Done block and the structured application form rendered with Input/Card; the 'Why submit is disabled' guidance and acceptance-criteria warning keep their behaviour; message composition per spec; gigs/new/success is the one place in this batch that may use scene mode (the accepted/published moment) — decide in proposal.md and, if scene, use the Dichroic element as the single spectral event; ui/spec.md Gig Detail / Gig Creation / Message sections rewritten. Test: compose-gig-detail-apply, compose-create-gig, compose-my-gigs, build-applications-screen, application-withdrawal, client-journey E2E green; DoD, audit, contrast, screenshots."
```

### 8. Work-accepted moment (scene)
```bash
/ralphy-plan design-accepted-scene "design: add the single full-screen spectrum moment per DESIGN.md §2.2 'Work accepted' to the gig detail accept flow. mode=scene; slot=full-screen state or modal 16:9/9:16; L0=the acceptance confirmation itself. Requirements: (1) a <AcceptedScene> in the package: season liquid full-bleed (CSS/animated gradient on MVP, shader as follow-up), the Dichroic element splitting light across the screen, one orchestrated entrance timed to --beat; (2) the threshold into it is a cut with holds per §10, not a fade; (3) prefers-reduced-motion collapses it to a <=150ms opacity cut; (4) Lighthouse mobile >= 90 on the gig detail route with the scene mounted; (5) this is the only place in the product where a data-level=0 element carries the full --spectrum. Non-goals: no sound. Test: the accept E2E flow green; DoD, audit; screenshot of the moment at 390 and 1440 for user review."
```

### 9. Auth: login, register, onboarding (scene)
```bash
/ralphy-plan design-migrate-auth "design: migrate app/login, app/register and app/_design/AuthDesign.tsx. mode=scene; slot=full viewport with the form overlaid (MVP: season liquid, same glass form as HOUSE); L0=Войти / Создать аккаунт respectively. Requirements: (1) glass form with chamfer and 1px edge, transmitting the background light, never over text that must be read — the form is the readable content, so the glass sits on the liquid, not on copy; (2) the three-step onboarding keeps its behaviour (spec: AuthDesign Screen); (3) credit line slot reserved in a corner for the HOUSE path (`Artwork — {Artist}`), empty on MVP; (4) auth-landing fragments (LandingFragments, LandingMotion, LandingFee) are not migrated here — they belong to change 10; (5) ui/spec.md Registration / AuthDesign sections rewritten. Test: auth-flow, auth-session, auth-navigation, compose-auth-onboarding E2E green; DoD, audit, contrast, screenshots."
```

### 10. Landing (scene) and the music player
```bash
/ralphy-plan design-landing-and-player "design: migrate app/page.tsx to DESIGN.md §11 MVP: hero = refractive glass prism in WebGL (Three.js transmission + dispersion) over the season liquid, headline lit by the light layer, copy and L0 (Создать аккаунт) anchored lower-left per §9; sections as scenes with cut thresholds; the one entrance moment per page. Player: wire one licensed track (owner supplies file + credit), Web Audio AnalyserNode driving light-layer intensity and --spectrum-angle, never autoplay, localStorage persistence in try/catch, never overlapping the L0 on mobile. Requirements: static PNG fallback for the prism when WebGL is unavailable; prefers-reduced-motion per §10; Lighthouse mobile >= 90 (if the prism cannot meet it on mobile, serve the static fallback on mobile and record it). Non-goals: no copy rewrite beyond §13 rules. Test: build; DoD, audit, contrast; screenshots at 390/1440; the user reviews the hero."
```

### 11. Remaining workspace routes
```bash
/ralphy-plan design-migrate-remaining "design: migrate chats, disputes (+new, +[id]), finances, profile (+[userId], +edit modals), settings modal, guide, help, privacy, terms, gigs/examples. mode=workspace for all; slot: profile=cover 3:1/2:1 (MVP season light, user-replaceable), chats=none, the rest=none; L0 per screen declared in proposal.md (chats=Отправить, disputes/new=Открыть спор, finances=none, profile=Сохранить inside modals). Requirements: LegalDoc rendered with the type scale; ConfirmDialog from the package with chamfer; ui/spec.md Profile / Settings sections rewritten. Test: compose-chats, compose-disputes, compose-finances, compose-profile, compose-settings, empty-states, error-scenarios E2E green; DoD, audit, contrast, screenshots."
```

### 12. Retire the old engine and the old kit
```bash
/ralphy-plan design-retire-legacy "design: remove what the migration made dead. Requirements: (1) delete scripts/generated-tokens.{js,css}, scripts/parse-design-tokens.js, openspec/specs/ui/design-tokens.json and the tokens:generate script; app/globals.css loads only app/tokens.season.css; (2) delete app/_design/tokens.css, fig-tokens.css, landing.css and any *Design.tsx no longer imported; delete app/components/{primitives,blocks,templates,ui} members with zero imports; delete app/workbench/* and its E2E; (3) remove Handjet/Manrope from public/fonts and app/fonts.ts; (4) remove design-dod.mjs LEGACY exclusions for app/_design and generated-tokens.css so the whole app/ is checked; (5) rewrite the head of openspec/specs/ui/spec.md: the Design Token System section becomes a reference to DESIGN.md §4; (6) move gigly_full_design/ to docs/archive/legacy-design/ with a one-line README noting it was the design source until this campaign. Test: build; full E2E suite green; design-dod.mjs clean on all of app/; lint:contrast and validate:tokens pass; bundle size reported before/after."
```

## Follow-ups (HOUSE path, not in this campaign)

- `scripts/design-system/palette.ts`: extract `--hue` / `--hue-contrast` from the season hero artwork (DESIGN.md §4 HOUSE).
- `scripts/design-system/thinfilm.ts` + WebGL dichroic LUT replacing the CSS two-colour fallback (§6).
- Liquid shaders replacing the animated-gradient placeholders in slots (§5).
- Foundry typefaces replacing Unbounded / Golos Text in the same scale (§8).
- Commissioned seasonal series and the campaign archive page (§11).
- Commissioned soundtrack; `--beat` recomputed from its BPM (§12).

## Status

- [ ] design-tokens-season-hue
- [ ] design-lab-exploration — **user picks a variant before continuing**
- [ ] design-package-foundation
- [ ] design-migrate-gig-search — **pilot checkpoint; user approves screenshots before continuing**
- [ ] design-migrate-shell
- [ ] design-migrate-dashboards
- [ ] design-migrate-gig-lifecycle
- [ ] design-accepted-scene
- [ ] design-migrate-auth
- [ ] design-landing-and-player
- [ ] design-migrate-remaining
- [ ] design-retire-legacy

**Progress:** 0/12 changes completed
