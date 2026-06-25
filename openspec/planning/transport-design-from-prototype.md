# Transport Design From Prototype

**Created:** 2026-06-25
**Status:** IN_PROGRESS

## Problem

The live app's UI diverges from the `gigly_full_design/` prototype across most screens — layouts differ, some functionality is crooked. This is the residue of four successive design campaigns that each **reconstructed** screens in a foreign vocabulary (token-migrated Tailwind, then a kit/blocks library, then per-screen rebuilds) and measured "done" as "E2E flows pass" rather than "matches the prototype." Reconstruction guarantees drift, and the flow-based gate let every campaign report success while the visual result stayed wrong. The correct method — proven this session — is to stop reconstructing and **transport the prototype's own rendered markup** into the app.

## Why This Matters

`gigly_full_design/` is the authoritative design source-of-truth and represents a complete, navigable product across three roles. Every reconstruction restart threw the prior work away, costing weeks and leaving a route-level patchwork of competing UI systems. From `project.md`, Gigly positions as a "high-end" B2B marketplace ("Russian Toptal Lite") — a UI that visibly diverges from its own polished design undercuts that positioning. Transporting the real markup ends the restart loop structurally: there is nothing to "get wrong by eye" when you move the actual artifact.

## Scope

This initiative transports the prototype's UI into the live Next.js app, reusing the existing data layer. The prototype has **19 role-valid screen states** across its 13 routes — not every route exists for every role (e.g. `createGig` and `applications` are company-only; `disputeResolve` is admin-only). Beyond routes, the prototype also has **overlays** that are not screens: profile-edit modals (`bio` / `cats` / `stack`), the notifications dropdown, toasts, and confirmation dialogs — these are in scope and captured by the pipeline (change 1). (The prototype's settings modal is out of scope — see Decisions / Deferred.)

**Foundation (proven this session):**
- A headless render pipeline: serve `gigly_full_design/` over http + Playwright chromium @1512px → navigate via `window.__giglyGo({role, route, ...})` → `page.content()` yields fully-resolved concrete HTML (all bundle components expanded, no `{{ }}` / `<x-import>`), `page.screenshot()` yields the reference image. This session captured all **19 base route-states** clean (zero page errors), proving the pipeline. The **overlays** (profile-edit modals, notifications dropdown, toasts, confirmations) are reachable through the same hook (`__giglyGo`'s `modal` param such as `bio`/`cats`/`stack`, plus state flags like `notifOpen`) and are added to the committed pipeline in change 1 — they were *not* part of this session's proof capture.

**Affected systems:**
- **UI components** — `app/_design/*Design.tsx` (reuse/replace), `app/_design/AppShellDesign.tsx` (shared shell), shared parts (`GigCard`, `AttentionCardDesign`, message/status/tag components). These are *overwritten with transported markup*, not rebuilt anew.
- **Routing/data** — the existing `page.tsx → view-model → *Design.tsx` architecture is **kept**; only the markup inside each `*Design.tsx` is replaced. Server actions and VMs largely already exist and drifted far less than the markup — but per Method §3, transport may reveal fields/states the design shows that the VM does not yet supply; closing those gaps is in-scope work, not an assumed given.
- **Tokens/fonts** — `app/_design/tokens.css` + `fig-tokens.css` already provide Handjet/Manrope/system + the Figma token set; no token work needed.
- **Testing** — the existing E2E suite must stay green (run it to confirm the current baseline before changing a screen); selectors may need updating where markup changes.

**Dependencies:**
- The capture pipeline (change 1) is a prerequisite for all transport changes — it produces the committed transport source.
- The shared shell (change 2) is a prerequisite for every screen change (all screens render inside it).
- The auth change coordinates with the in-flight `reground-auth-to-design` work; its design source is `gigly_full_design/Auth.dc.html` (the login + 3-step onboarding shell), not the main `Gigly App.dc.html`.

**Process:**
- This is a multi-change initiative — run it on a dedicated branch, one commit (or more) per change, so a bad transport is easy to revert and the rollout never half-lands.
- The working tree currently carries the in-flight `reground-auth-to-design` change plus many modified/deleted test files. **Land, stash, or explicitly fold that auth work into change 8 before starting** — do not begin the rollout on top of a half-applied auth change.

**Non-goals / ground rules:**
- **No fifth UI system.** Reuse the existing `app/_design/` substrate; do not introduce a new kit or reconstruct by eye.
- **No pixel-diff fidelity gate.** We move the real artifact; a measurement harness solves a problem we no longer have. Verification is human-in-the-loop per Method §4: a faithful markup lift the agent can self-check, plus a screenshot of the running screen beside the reference PNG for the user to approve, plus working flows — not a measurement threshold the agent grades itself against.
- **Desktop-only.** Prototype is a fixed 1512px width; responsive/mobile is out of scope.
- **Not 19 fragmented changes.** Screens are grouped into 8 coherent changes below (1–2 are prerequisites; the rest are independent). Settings is deferred (see Decisions / Deferred).

**Risks / unknowns:**
- Transported HTML is large, flat, inline-styled markup. Where the same block recurs (gig card, status pill, message row), extract it to a shared component during transport to stay DRY — but do not let extraction become reconstruction.
- The prototype default theme is dark; the app supports light/dark. Transport against dark first, confirm light still themes via existing tokens.
- Some `*Design.tsx` already exist from campaign 4; treat them as scaffolding to overwrite, keeping only the VM-wiring that works.

## Method (how a transport actually works)

The premise — *move the real artifact, don't reconstruct* — only holds if every change obeys these four rules. They are the heart of this plan; a change that breaks one of them has silently slipped back into reconstruction.

1. **Capture every state, not one snapshot.** A screen is not a single picture. `gigDetail` alone is ~10 panels (role × gig status: open / in_progress / review / completed / paid / rejected); `my-gigs` has 5 status tabs + empty + loading; `search` has results / empty / filtered / loading; dashboards differ per role. Transport is faithful only if **every** such state is captured from the prototype (drive `__giglyGo` with `role` / `stage` / `tab` / `applied` / filter params) and then transported. Any state we don't capture, we'd rebuild by eye — the exact failure this initiative exists to kill.

2. **Keep static copy verbatim; bind only dynamic data.** The prototype's UI chrome — labels, section titles, button text, empty-state copy (e.g. «Дашборд», «Готовность брифа») — *is* the design and is transported as-is. Only genuinely dynamic content (gig titles, names, amounts, counts, statuses) is bound to the view-model. Do not hardcode the mock data; do not reword the labels.

3. **A missing data field is real work, not a markup swap.** The transported markup expresses the prototype's full data model (notification dots, message previews, attention triggers, readiness computation, fine-grained gig stage). Where the existing VM/action does not already supply a field or state the design shows, that VM/backend work is **in scope** for that change. "Wire to existing VMs" is the happy path, not a guarantee — each change first asks: does the data layer feed everything the markup needs?

4. **Verification is your eyes on a real screenshot — not the agent's judgment, not a pixel gate.** "Looks like the prototype" cannot be self-certified by an agent that can't see. Each transported screen is verified two ways: (a) the lifted markup is a faithful structural copy of the captured HTML (the agent can check this); (b) the agent renders the screen in the running app via the same Playwright harness and saves a screenshot beside the reference PNG, for **the user (you)** to eyeball and approve. Human-in-the-loop, with an artifact.

**Pilot checkpoint.** The first real screen — change 3, specialist dashboard — is a go/no-go for the whole method. If it transports and wires cleanly, proceed. If it surfaces large VM gaps or the lift is harder than assumed, **pause and revise this plan** before rolling further. Do not repeat the prior pattern of rolling out broadly and discovering it was wrong later.

## Decisions (prototype ↔ app divergences)

Two places where the app diverged from the prototype. Both are now decided (2026-06-25):

1. **Settings — DEFERRED.** The prototype exposes settings only as a small *appearance/theme modal* (gear icon), but the app has a richer `/settings` route (`app/(protected)/settings/SettingsDesign.tsx`) with theme, language, currency, notifications, privacy, sessions, and delete-account. **Decision: leave the current `/settings` page exactly as-is for now** — it is *not* part of this initiative and will be brought to the design language in a separate, later effort. The shell's gear icon (change 2) simply routes to the existing `/settings` page, unchanged. See the Deferred section.

2. **Profile editing — CONFIRMED: use the prototype's modals.** The prototype edits the profile via inline modals (`bio` / `cats` / `stack`) on the profile screen; there is **no standalone profile-edit screen** in the design. The app has a separate `/profile/edit` Tailwind page (`app/(protected)/profile/edit/`). **Decision: transport the profile screen *with* its edit modals**, route the existing profile-update actions through those modals, and redirect `/profile/edit` → `/profile` (reuse the route's server-side logic behind the modals; do not delete it). Handled by change 5.

## Changes

Each is a separate `/ralphy-plan` → `/ralphy-implement` cycle. Only changes **1 (capture)** and **2 (shell)** are hard prerequisites — everything depends on them. Changes 3–8 are independent of one another and may run in any order after the shell; the sequence below is a sensible default, not a dependency chain.

### 1. Capture pipeline + committed transport source
```bash
/ralphy-plan transport-capture-pipeline "Commit a reproducible capture of the gigly_full_design prototype. Requirements: (1) Add a Node script under scripts/ that serves gigly_full_design/ over a local static http server and drives Playwright chromium at 1512px width, navigating each state via window.__giglyGo; (2) Write the fully-resolved page HTML and a reference PNG for the 19 role-valid route-states (13 routes, role-scoped: e.g. createGig/applications company-only, disputeResolve admin-only) into a tracked repo location (e.g. design-reference/screens/); (2b) CRITICAL (see plan Method 1): also capture every VARIANT state each screen renders, not just its entry state — gigDetail for each role x gig status (open/in_progress/review/completed/paid/rejected), my-gigs each status tab + empty + loading, search results/empty/filtered/loading, both role variants of each dual-role screen — by driving __giglyGo with role/stage/tab/applied/filter params; if a state can't be reached via __giglyGo, note it for capture-by-interaction; (3) ALSO capture the overlays as their own states: profile-edit modals (modal=bio/cats/stack on the profile route), notifications dropdown (notifOpen), a success toast, and a destructive-confirmation dialog — discover exact triggers by reading Gigly App.dc.html (the settings modal is out of scope this round); (4) Add an npm script (e.g. capture:design) to run it; (5) Document the state->trigger matrix. Non-goals: no app code changes; the Auth.dc.html screens are captured by the auth change, not here. Test: running the npm script regenerates all route-state and overlay HTML+PNG pairs with zero page errors; output committed."
```

### 2. Shared shell (sidebar + header chrome)
```bash
/ralphy-plan transport-shared-shell "Transport the prototype's shared chrome into one layout. Requirements: (1) Replace app/_design/AppShellDesign.tsx with the prototype's sidebar (GIGLY logo, profile frame, role switcher, nav with counts/active bar, support card, logout) and top header (page title, notifications bell + dropdown, settings gear) lifted from the captured HTML; (2) React-ify markup (className, style objects, onClick, list keys); (3) Wire role switch, nav routing, and notifications to existing handlers/VMs; the settings gear simply navigates to the existing /settings page (settings is NOT being restyled in this initiative — leave that page untouched); (4) Every protected route renders inside this shell. Reuse existing tokens. Test: build passes; all protected routes render within the shell; nav/role-switch/notifications work; existing E2E green; matches design-reference shell visually."
```

### 3. Dashboards, search & my-gigs (+ shared feed components)
```bash
/ralphy-plan transport-dashboards-search "Transport the dashboard, search and my-gigs screens and the components they share. Requirements: (1) Transport DashboardDesign for specialist and company (onboarding tiles, gig feed with tabs, messages panel, attention cards); (2) Transport GigSearchDesign (filters: category/budget/sort, empty state, skeletons) and MyGigsDesign (status tabs, empty states); (3) Extract the recurring gig card, attention card and message row into shared app/_design components from the captured markup; (4) Wire to existing dashboard/search/my-gigs VMs and actions. Test: build + existing E2E green for these routes; feeds/filters/tabs work; screens match design-reference PNGs."
```

### 4. Gig lifecycle (detail, create, applications)
```bash
/ralphy-plan transport-gig-lifecycle "Transport the gig lifecycle screens. Requirements: (1) Transport gig detail into the EXISTING file app/(protected)/gigs/[id]/GigDetail.tsx (note: this one is named GigDetail.tsx, NOT *Design.tsx — keep that filename, do not create a new variant) with the role x status action panel (specialist apply/withdraw/submit; company view-applications/accept/return/mark-paid; dispute link in-progress/review; terminal states); (2) Transport CreateGigDesign (guided brief, live readiness panel, budget->10% fee->total) and its success screen; (3) Transport ApplicationsDesign (specialist cards -> accept assigns & rejects others / reject); (4) Wire all to existing gig/application server actions. Test: build + existing E2E green; full gig lifecycle works end-to-end; screens match design-reference PNGs."
```

### 5. Chats, finances & profile
```bash
/ralphy-plan transport-chats-finance-profile "Transport communication, finance and profile screens. Requirements: (1) Transport ChatsDesign (dialog list + thread, send via Enter/button, live search); (2) Transport FinancesDesign for specialist (earnings) and company (spend + fee) with the operations list; (3) Transport ProfileDesign — specialist (stack/experience/categories) and company (name/INN/KPP/about) — INCLUDING the prototype's inline edit modals (bio/cats/stack) triggered from the profile screen; (4) Resolve the profile-edit divergence per the plan's Decision 2 (confirmed): the prototype has NO standalone profile-edit screen — editing is modal-based, so route the existing profile-update actions through the transported modals and redirect the app's /profile/edit route to /profile (the legacy Tailwind app/(protected)/profile/edit/ page is being retired; confirm before deleting its server-side logic). Wire to existing messaging/finance/profile VMs and actions. Test: build + existing E2E green; messaging works; profile edits via modals persist; screens match design-reference PNGs."
```

### 6. Disputes (list, detail, new, admin resolve)
```bash
/ralphy-plan transport-disputes "Transport the full dispute flow. Requirements: (1) Transport DisputesDesign (list rows: reason/status/amount); (2) Transport DisputeDetailDesign (header + party timeline + evidence + moderator response); (3) Transport NewDisputeDesign (reason chips + description); (4) Transport the admin dispute-resolve screen (specialist/company/partial verdict + audit log). Wire to existing dispute server actions. Test: build + existing E2E green; open/view/resolve dispute flows work; screens match design-reference PNGs."
```

### 7. Admin console & tables
```bash
/ralphy-plan transport-admin-console "Transport the admin moderation surface. Requirements: (1) Transport the admin dashboard/moderation (stat tiles, disputes queue, moderation log) into AdminConsoleDesign; (2) Replace the kit composed-screen admin users and gigs tables with transported markup (block/unblock users, close gigs); (3) Wire to existing admin actions. Test: build + existing E2E green; admin moderation/user/gig actions work; screens match design-reference PNGs."
```

### 8. Auth (login + onboarding)
```bash
/ralphy-plan transport-auth "Transport the auth surface from gigly_full_design/Auth.dc.html (its own prototype file — login view + 3-step onboarding, a shared blue-G/Handjet/pixel-wave shell, login<->register state machine), coordinating with the in-flight reground-auth-to-design work. Requirements: (1) Transport the login view and 3-step onboarding state machine into AuthDesign from the captured Auth.dc.html markup (shared blue-G/Handjet/pixel-wave shell, login<->register state machine, back navigation); (2) Wire to existing two-phase registration + login actions; (3) Ensure /login and /register render the transported design and the stray /auth route stays removed. Test: build + existing auth E2E green; login/registration/onboarding flows work; screens match the Auth.dc.html reference."
```

## Status

- [x] 1. transport-capture-pipeline
- [x] 2. transport-shared-shell
- [ ] 3. transport-dashboards-search
- [ ] 4. transport-gig-lifecycle
- [ ] 5. transport-chats-finance-profile
- [ ] 6. transport-disputes
- [ ] 7. transport-admin-console
- [ ] 8. transport-auth

**Progress:** 2/8 changes completed
**Started:** 2026-06-25
**Completed:** Not completed

## Deferred (out of scope for now)

**Settings.** The app's richer `/settings` page is intentionally left as-is for this initiative (see Decision 1). When ready to bring it to the design language later, run:

```bash
/ralphy-plan transport-settings "Bring the existing /settings route to the design language. The app's /settings page (app/(protected)/settings/SettingsDesign.tsx) has more than the prototype's small appearance/theme modal (theme, language, currency, notifications, privacy, sessions, delete-account) — KEEP all of it. Requirements: (1) Restyle SettingsDesign.tsx to the prototype's visual language (tokens, Handjet/Manrope, surfaces/hairlines); (2) Optionally surface the prototype's appearance/theme modal as the shell gear's quick-toggle; (3) Wire to existing settings server actions. Test: build + existing E2E green; all settings actions work; appearance matches the design language."
```
