# Transport Design From Prototype

**Created:** 2026-06-25
**Status:** COMPLETE

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

1. **Settings — DEFERRED → ✅ RESOLVED (transport-settings, archived 2026-06-29).** The prototype exposes settings only as a small *appearance/theme modal* (gear icon), but the app has a richer `/settings` route with theme, language, currency, notifications, privacy, sessions, and delete-account. It was deferred from this initiative and then shipped as its own change — built against the **newer Figma settings popup** (node `3121:2609`), as a contained `?settings=1` modal opened from the shell gear, every control live-or-gray. One accepted gap remains (stored-but-not-consumed currency/language) — see the **Follow-ups** section.

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
- [x] 3. transport-dashboards-search
- [x] 4. transport-gig-lifecycle
- [x] 5. transport-chats-finance-profile
- [x] 6. transport-disputes
- [x] 7. transport-admin-console
- [x] 8. transport-auth

**Progress:** 8/8 changes completed
**Started:** 2026-06-25
**Completed:** 2026-06-29

## Deferred — now DONE

**Settings — ✅ SHIPPED (transport-settings, archived 2026-06-29).** The deferred settings work (Decision 1) was planned and implemented against the newer Figma settings popup (node `3121:2609`, not the prototype's small theme modal) as a contained `?settings=1` modal on app tokens, with every control either live-and-wired-or-grayed-and-inert, an expanded timezone dataset, and 3 cheap additive schema fields. Verified: build exit 0; 18 integration + 10 E2E green. Folded into `openspec/specs/ui/spec.md` ("ADDED Requirements (transport-settings …)"). See the follow-ups below for the one accepted gap.

## Follow-ups — settings that persist a preference but don't actually do anything

`transport-settings` shipped the popup and made the wired controls **persist**, but a full audit (2026-06-29) shows several preferences are stored yet **never consumed** — the app does not act on them. These are the real functionality gaps behind the settings UI. None of them is a defect in the transport (the popup is faithful); they are *missing downstream wiring* that predates or was deferred by this change. Captured here so nothing is silently dead. Each follow-up is honest about the real work (an FX decision, a translation layer, notification gating + an email channel) and fabricates no value.

**Audit of every settings control:**

| Control | Persists? | Consumed (does something)? | Disposition |
|---|---|---|---|
| **Имя** | ✅ | ✅ surfaced on the profile | Functional — keep |
| **Часовой пояс** | ✅ | ✅ surfaced on the profile | Functional — keep |
| **Активные сессии** / «Завершить все» | ✅ | ✅ real session rows terminated | Functional — keep |
| **Удалить аккаунт** / **Выйти** | ✅ | ✅ real | Functional — keep |
| **Валюта** | ✅ | ❌ all money still renders ₽ (`formatCurrency` hardcodes `ru-RU`/`RUB`) | **Gap A** — grayed/inert in MVP |
| **Язык интерфейса** | ✅ | ❌ no i18n layer; UI is hardcoded Russian | **Gap B** — grayed/inert in MVP |
| **Notification rows (5)** | ✅ | ⚠️ the 3 sourced rows now gate the bell live (`getUnreadNotifications` reads prefs, display-time); the 2 sourceless rows + email are still unwired | **Gap C — partially done**: in-app gating shipped; email deferred |
| **2FA / Email / Password / avatar upload** | — | — (no backend) | Honestly grayed already — see deferred list above |
| **showRatingInProfile / showOnlineStatus** | ✅ | ❌ not even rendered in the new modal; nothing reads them (profile hardcodes `online: false`, always shows rating) | **Gap D** — orphaned; wire or remove |

Currency (A) and Language (B) are **grayed/inert** in the live modal (owner decision, MVP scope) so they don't masquerade as functional. The notification rows (C) are now **partially wired** — the 3 sourced rows gate the bell live; the 2 sourceless rows are grayed. The orphaned fields (D) are documented-only (owner decision: leave in place).

### A. Currency is stored but the whole app still renders rubles
```bash
/ralphy-plan currency-display "Make the app render money in the user's chosen currency (user.currency, already persisted by transport-settings) instead of hardcoded rubles. Today lib/utils/currency.ts:formatCurrency hardcodes ru-RU/RUB and takes no preference, so every amount shows ₽ regardless of the setting. Requirements: (1) DECISION FIRST — amounts are stored in rubles, so changing the currency requires conversion, not just a symbol swap (relabelling 50000₽ as \$50000 would fabricate value — forbidden). Choose and document an FX source: RECOMMENDED a small fixed rate table (rub→usd/eur) in lib so display is deterministic and honest, with the rate/date shown; a live FX API is a heavier alternative. (2) Make formatCurrency(amount, currency?) preference-aware (convert + correct locale + symbol) and thread the viewer's currency through the ~10 call sites (finances, gig cards, gig detail, create-gig fee panel, disputes — see grep for formatCurrency/₽). (3) Server-render with the viewer's preference so SSR and client agree. Non-goals: editing/quoting gig budgets in foreign currency (display-only this round); per-gig currency. Test: build + existing E2E green; a user who selects USD sees converted \$ amounts across finances/gig cards/detail with the documented rate; rub users unchanged."
```

### B. Language is stored but there is no i18n layer (UI stays Russian)
```bash
/ralphy-plan i18n-foundation "Introduce an internationalization layer so user.locale (already persisted by transport-settings) actually switches the UI language. Today every screen hardcodes Russian string literals, so selecting English changes nothing visible. This is a foundation change, not a one-screen tweak. Requirements: (1) Adopt a lightweight i18n approach (RECOMMENDED next-intl or a small typed dictionary in lib/i18n with a useTranslations()/getTranslations() seam that reads the viewer's locale server-side and client-side); (2) Establish the ru + en catalogs and the key convention; (3) Migrate a FIRST vertical slice end-to-end as the proof — the settings modal + the app shell chrome — leaving a documented, repeatable pattern + a checklist of the remaining ~30 screens to migrate incrementally (do NOT attempt all screens in one change). (4) Default/fallback locale = ru; missing keys fall back to ru, never blank. Test: build + existing E2E green; with locale=en the migrated slice (settings + shell) renders in English and persists across reload; ru unchanged; a lint/test guards against missing keys in the migrated slice."
```

### C. Notification toggles — in-app gating DONE; email deferred
**✅ Done (2026-06-30):** the 3 notification rows with a real bell source now actually work — `getUnreadNotifications` (app/actions/notification.ts) reads the recipient's prefs and gates the bell at **display time** (MESSAGE→`notifyMessages`, APPLICATION→`notifyApplications`, STATUS_CHANGE→`notifyStatusChanges`), reversibly (no rows dropped at creation; covered by `notifications.test.ts`). The false «Email-уведомления» label was corrected to «Уведомления в приложении». The 2 sourceless rows (`notifyPlatformNews`/`notifyNewGigs`) stay **grayed/inert** because nothing generates those events yet.

**Still deferred (the remaining `notification-preferences` work):** (1) a real **email-delivery** channel (no nodemailer/resend/transport exists), and (2) **event sources** for platform-news / new-gig-match so those two toggles have something to gate. When ready:
```bash
/ralphy-plan notification-preferences "Finish the notification preferences. In-app (bell) gating already ships — getUnreadNotifications gates MESSAGE/APPLICATION/STATUS_CHANGE on the prefs (display-time, reversible), the section is relabelled «Уведомления в приложении», and the 2 sourceless rows (notifyPlatformNews/notifyNewGigs) are grayed. This change closes the two remaining gaps. Requirements: (1) EMAIL CHANNEL — introduce a real email transport (RECOMMENDED resend or nodemailer behind a lib/email seam) and send the enabled notification types to the user's email, honoring the same prefs as the bell; behind env/feature-flag so dev/test don't send. (2) EVENT SOURCES — generate the events the 2 sourceless toggles describe (platform news broadcast; a 'new gig matching your stack' notification on gig creation matched to specialist techStack), then un-gray those two rows and gate them like the others. Test: a user who disables a type gets neither the bell entry nor an email for it; enabled types deliver both; the two new event sources fire and respect their toggles; build + existing E2E green; no real email is sent in test."
```

### D. Orphaned privacy preferences (no UI, no consumer)
`showRatingInProfile` and `showOnlineStatus` exist on `Preferences` + `updatePreferences` and persist, but (a) the new settings modal does **not** render them (the Figma popup has no privacy section) and (b) nothing consumes them — `ProfileHeaderVM` hardcodes `online: false` and the profile always shows the rating. They are dead fields. **Decision needed (no code yet):** either *wire* them (add a privacy sub-section to the modal + have `getProfile`/`ProfileDesign` respect them) or *remove* them. **RECOMMENDED: remove** the two fields until the design actually calls for a privacy section — carrying stored-but-dead state invites exactly the confusion that surfaced here. Run a `/ralphy-plan` once the direction is chosen.
