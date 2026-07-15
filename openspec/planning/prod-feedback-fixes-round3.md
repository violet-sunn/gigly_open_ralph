# Prod Feedback Fixes — Stress-Test Round 3

**Created:** 2026-07-15
**Status:** PLANNED

## Problem

A third external stress-test pass (tester: Арсений, live notes 2026-07-14) surfaced a batch of issues concentrated in the **gig-creation / application / terms** flow plus a **systemic UI-freshness** problem. Ten items were reported and each was **verified against the current build** — code inspection + a live Playwright pass on seed data (and a dedicated dev-vs-prod diagnosis for the counters item), 2026-07-14/15. They break down as:

- **Create-gig is blocked with no feedback (critical)** — a gig cannot be created because the readiness checklist checkmark never appears and the submit button stays `disabled` when the description is too short, with **no message explaining why** (описание «скрытый счётчик»); and if the client writes **custom** acceptance criteria instead of picking suggested chips, they don't count toward the checklist (the typed text sits uncommitted in the input), so the gig can't be created either.
- **Validation asymmetry / limit bypass** — real field constraints live in the **client** checklist (`CreateGigDesign`), while the server (`parseGigForm`) is more lenient; the **edit** form has no checklist, so editing a gig **bypasses limits** that creation enforces. No character counters are rendered anywhere (`CharacterCounter` exists but is unused).
- **Application terms are broken** — «откликнуться на условиях заказчика» should mean the price/deadline are **fixed**, but the fields stay editable with a note «оставьте пустым = условия заказчика», which defeats the whole «свои условия» tab; and the apply form **pre-fills previous terms** (stale state).
- **UI does not refresh (systemic)** — counters (notification bell + sidebar badges) **never update while navigating the app**; only a full reload/re-login moves them. Application status updates on reload but not live. Reported as «серверные действия не обновляются» / «счётчики не работают».
- **Dispute unavailable after payment** — the «Открыть спор» CTA is hidden once the gig leaves IN_PROGRESS/REVIEW, so no dispute can be opened after a deal is paid/completed.
- **Examples unreachable for clients** — example gigs exist (`/gigs/examples`) but the page is orphaned (no discoverable entry), English/pre-reground, and the client who should see them **while creating a gig** has no link to them.

## Why This Matters

This is the third outside-user pass before the diploma defense (~2026-07-19). Two of these are **hard blockers of the core loop**: a client literally **cannot create a gig** (C1) when the description is short or the criteria are custom — with no explanation — and the whole app **looks broken because counters never move** (C2), which reads as «nothing works» even though the data is correct underneath. The terms tab (C3) currently makes the negotiation feature pointless, disputes vanish exactly when money is at stake (C4), and the inspiration feature clients were meant to have is invisible (C5). Closing these as one coordinated round — creation-blockers and UI-freshness first, then terms/disputes/examples — makes the build demo-solid for reviewers who will click exactly this flow.

## Live diagnosis on record (C2)

The counters item was diagnosed with a controlled Playwright run in **both dev and a real `next build && next start` production build** (seed: client `ivan.petrov@techcorp.ru`, specialist `andrey.sokolova@mail.ru`, `TestPass123`, gig `seed-open-gig-12`):

- **Write is fine** — a specialist's application persists the client's notification row immediately (7→8) in both dev and prod. The fire-and-forget-before-`redirect()` does **not** lose the write on a Node server. → not the cause.
- **In-session staleness confirmed (dev + prod)** — the client's bell stayed `4` with no reload and after client-side navigation, while the DB held the new notification. → **root: `NotificationBell` fetches `useEffect(…, [])` once and lives in a persistent layout that does not re-mount on client navigation; sidebar badges are computed in the layout, which likewise does not re-render on navigation.**
- **F5 updates locally (dev + prod)** — bell went `4→5` after a hard reload in both. So the tester's «F5 не помогает, только перезаход» is **not reproducible locally** → it is almost certainly an **Amvera deployment cache layer** (a proxy/CDN caching `/dashboard` by URL, missing the session cookie), not app logic. The C2 fix (live counters + `no-store`) neutralizes it regardless.

## Scope

Fixes defects across the running app; does **not** re-ground the design system or change the deploy pipeline. Affected systems (verified roots):

- **Create/edit-gig validation (SSOT)** — `app/actions/gig.ts` `parseGigForm` (L39; enforces only: title/description/criteria non-empty, criteria ≥50, budget>0, deadline 1–365, stages 1–50) vs `app/(protected)/gigs/new/CreateGigDesign.tsx` (client checklist enforces description ≥20, required goal/deliverables, criteria ≥50 via committed `criteria[]`), `character-counter.tsx` (unused, English), `updateGig` (L168, reuses parseGigForm but the edit UI `EditGigDesign.tsx` has no checklist → bypass). Root of the create-blocker, criteria, counters, and edit-bypass items.
- **Live counters / revalidation** — `app/components/NotificationBell.tsx` (`useEffect([])`), `app/(protected)/layout.tsx` (sidebar counts computed once), `app/_design/AppShellDesign.tsx`, notification read path `app/actions/notification.ts` (correct, uncached). Root of the UI-freshness item.
- **Apply terms** — `app/(protected)/gigs/[id]/GigDetail.tsx` apply form (L837+: `approach`/`questions` + optional proposed budget/deadline, editable on both tabs; `defaultValue`/prefill), `TermsTabs.tsx` (read-only display today). Root of the terms items.
- **Dispute CTA visibility** — `GigDetail.tsx` `showDisputeLink` (L108–113, gated to `IN_PROGRESS`/`REVIEW`); `app/actions/dispute.ts` `openDispute` (allows any assigned, non-example gig — no status gate). Root of the dispute-after-payment item.
- **Examples for clients** — `app/(protected)/gigs/examples/page.tsx` (works, but English/pre-reground, `No role check`), only linked from `BackButton.tsx` fallback; `CreateGigDesign.tsx` (no link). Root of the examples item.

**Dependencies:** C1 and C4 both edit `app/actions/gig.ts` (parseGigForm/updateGig vs showDispute is UI-only) — minor, but land C1 first. C1 and C5 both edit `CreateGigDesign.tsx` — sequence them (C1 validation first, then C5 adds the examples entry). C2 and C3 are independent. C4 backend check is in `dispute.ts`.

**Process:** Dedicated branch, one commit per cluster, so a bad fix is easy to revert. After each functional change, **verify live** in the running app (Playwright flow already used this round — seed logins above, `TestPass123`), not just via tests. Re-deploy to Amvera (`./deploy-to-amvera.sh`) at the end of the round, or per-cluster if incremental re-testing is wanted. **Note:** running `npm run build` while `npm run dev` is live corrupts `.next` — stop dev before any prod build.

**Risks / unknowns:**
- **C2 Amvera proxy cache is unconfirmed on the real deployment.** Local prod build refutes an app-logic F5 cache; the residual «F5 doesn't help» is deployment-layer. Optional: repeat the diagnosis against `gigly-m0jo.amvera.io` to confirm. The fix (live counters + `dynamic='force-dynamic'`/`no-store` on counter surfaces) covers it either way — do not skip the `no-store` hardening on the assumption it's only client-side.
- **C1 SSOT boundary. [DECIDED 2026-07-15]** Move the *real* rules to the server (`parseGigForm`) so create AND edit enforce them, with the client checklist/counters as a mirror. **Keep the current client-checklist minimums as-is** (description ≥20, goal + deliverables required, criteria ≥50) — port them to the server verbatim; do NOT raise or invent limits.
- **C1 custom-criteria UX.** Root is that typed text in `critInput` only counts once committed to `criteria[]` (Enter/«Добавить»). Fix can be (i) count `critInput` toward readiness, and/or (ii) auto-commit on blur/submit, and/or (iii) a clear «нажмите Добавить» hint. Baseline = auto-commit pending text on submit + a hint, so custom criteria always count.
- **C3 terms lock.** «От заказчика» tab must render price/deadline **read-only** (the gig's values); editing lives only on «Предложено». Confirm the empty-field semantics stay («пусто на Предложено = согласен с условиями заказчика») but remove the misleading editable client-terms fields.
- **C4 RESOLVED / claim retracted [2026-07-15].** The tester withdrew the "dispute after payment" claim — disputes are intentionally pre-payment only (while IN_PROGRESS/REVIEW), which is correct. The residual ask — "does the executor (assigned specialist) also see the button?" — was **verified live**: on IN_PROGRESS gigs as the assigned specialist, «Открыть спор» renders with a ≥44px target (screenshot confirmed, `workflow-gig-mobile-ui` + `seed-inprogress-gig-4`). `showDisputeLink` already gates on `(data.isOwner || data.isAssignedSpecialist)`. **No change needed — C4 drops from the round.**

## Non-goals / Deferred

- No design re-grounding or new UI kit (C5 re-grounds only the single orphaned examples page to match `gigly_full_design`).
- No change to the fixed-price application/terms **state machine** (Round 1/2 own it); C3 is display/lock + form-reset only.
- No new notification delivery channels (email/push); C2 makes existing in-app counters live.
- No general responsive work (Round 2 owns mobile).

## Changes

Each is a separate `/ralphy-plan` → `/ralphy-implement` cycle. Ordered by priority: **P0** creation-blocker + UI-freshness (C1, C2), then **P1** terms + disputes (C3, C4), then **P2** examples (C5). C1→C5 share `CreateGigDesign.tsx` (sequence); C1→C4 lightly share `gig.ts`.

### C1 — Gig-creation validation as server SSOT + visible counters (create-blocker, custom criteria, field limits, edit-bypass) — P0
```bash
/ralphy-plan gig-validation-ssot "Make gig create/edit validation truthful, server-authoritative, and legible so a gig can actually be created and edit cannot bypass creation limits (Round-3, Арсений). Verified roots: (1) create is silently blocked — app/(protected)/gigs/new/CreateGigDesign.tsx gates submit on a client checklist (description ≥20, required goal/deliverables, criteria.join ≥50) and renders the button disabled with only a vague «Добавьте: Описание», never a character count or the real minimum, so a short description = no checkmark, no submit, no explanation; CharacterCounter (app/(protected)/gigs/new/character-counter.tsx) EXISTS but is rendered nowhere and is English. (2) custom criteria don't count — criteria live in a criteria[] state; the checklist counts criteria.join('\\n').length ≥50, but text typed into the custom input (critInput) only joins criteria[] on Enter/«Добавить»; a client who types their own criteria without committing sees the checkmark stay off and cannot create. (3) limit bypass on edit — app/actions/gig.ts parseGigForm (L39) enforces only title/description/criteria non-empty + criteria≥50 + budget>0 + deadline 1–365 + stages 1–50; the real minimums (description length, required goal/deliverables) live ONLY in the client checklist; updateGig (L168) reuses parseGigForm but EditGigDesign.tsx has no checklist, so editing saves values creation would reject. Requirements: (a) move the real rules into parseGigForm as the single source of truth — description minimum length, required goal + deliverables, criteria ≥50 — so BOTH createGig and updateGig enforce them server-side (align to the current client checklist minimums; confirm exact numbers with the user, do not invent); (b) render a live, localized character counter (repurpose/rewrite CharacterCounter to Russian) on description and criteria with the minimum shown, and on any field with a max; (c) fix custom criteria — auto-commit pending critInput text on submit (and/or count it toward readiness) plus a «нажмите Добавить» hint, so typed criteria always count; (d) show WHY submit is disabled (which requirement is unmet + the shortfall), not just a disabled button; (e) give the edit form the same readiness/counters so it cannot bypass creation limits. Files: app/actions/gig.ts (parseGigForm, createGig, updateGig), app/(protected)/gigs/new/CreateGigDesign.tsx, app/(protected)/gigs/new/character-counter.tsx, app/(protected)/gigs/[id]/edit/EditGigDesign.tsx. Test plan: E2E — (i) short description → counter shows deficit + reason, button disabled; reaching the minimum enables it and creates; (ii) custom-only criteria (typed, not committed) still let the gig be created (counted/auto-committed); (iii) editing a gig cannot save a description/criteria that creation would reject (server rejects). Verify live."
```

### C2 — Live counters (notification bell + sidebar badges) + anti-cache hardening (UI does not refresh) — P0

> **✅ SHIPPED & ARCHIVED 2026-07-15** → `openspec/archive/live-counters/`. Canonical specs reconciled (`ui`: 3 ADDED
> requirements + the bell requirement amended to carry a freshness contract; `gig`: awaited notification writes).
> Live-verified **7/7 in dev AND a real prod build**: bell 3→4 on in-app navigation, 4→5 via the idle poll (URL
> asserted unchanged), «Чаты» 1→2, `no-store` on authenticated `/dashboard`, static assets still `immutable`.
> New tests: `__tests__/integration/live-counts.test.ts` (5) + `__tests__/unit/components/NotificationBell.test.tsx`
> (9, mutation-verified — reverting to the mount-only fetch fails 4 of them). Zero regressions (full integration
> suite identical with the change stashed: 72 failed / 651 passed both ways).
>
> **⚠️ OPEN — post-deploy only:** the Amvera proxy-cache theory is **still unconfirmed**. «F5 не помогает, только
> перезаход» never reproduced locally, so the `no-store` fix can only be confirmed against the real deployment.
> After the next `./deploy-to-amvera.sh`, re-run the tester's scenario on `gigly-m0jo.amvera.io`; if it still
> reproduces, the suspect is Amvera-side cache config (not app code) — capture `/dashboard` response headers as
> evidence before touching anything else.
```bash
/ralphy-plan live-counters "Make in-app counters update live so the app stops looking broken (Round-3 «серверные действия не обновляются»/«счётчики не работают»). Diagnosed live in dev AND a real prod build (next build && next start, seed client ivan.petrov@techcorp.ru / specialist andrey.sokolova@mail.ru / TestPass123 / gig seed-open-gig-12): the notification write PERSISTS immediately (7→8) — no write race; the bell stays STALE with no reload and after client-side navigation, and only a hard reload/re-login moves it; F5 updates locally in both dev and prod (so the tester's «F5 не помогает, только перезаход» on gigly-m0jo.amvera.io is an Amvera proxy/CDN cache layer, not app logic). Roots: app/components/NotificationBell.tsx fetches getUnreadCount() in useEffect(…, []) ONCE and lives in the persistent app/(protected)/layout.tsx shell that does not re-mount on client navigation; the sidebar gigs/chats badges are computed once in that layout (prisma.gig.count / getUnreadChatCount) and never re-render on navigation; the read path (app/actions/notification.ts) is itself correct and uncached. Requirements: (1) NotificationBell — refetch the count on every route change (add usePathname() to the effect deps) and after mutations; call router.refresh() (or re-fetch) so it updates without a manual reload; optionally a light interval poll (30–60s) as a backstop; (2) sidebar badges — make the gigs/chats counts live (a small client component that refetches on navigation, or trigger revalidation of the layout surface after the relevant mutations) instead of a once-per-mount server render; (3) anti-cache hardening for the deployment layer — set export const dynamic = 'force-dynamic' (or Cache-Control: no-store) on the counter-bearing surfaces so an Amvera proxy cannot serve a stale /dashboard by URL; (4) optional cheap insurance: await createNotification(...) before redirect() in the gig actions (write already works, but removes any future serverless-timing risk). Files: app/components/NotificationBell.tsx, app/components/NotificationDropdown.tsx, app/(protected)/layout.tsx, app/_design/AppShellDesign.tsx (counts wiring), relevant route segments for the dynamic directive, app/actions/gig.ts (optional await). Test plan: E2E — with a client on /dashboard, a specialist applies; the client's bell increments WITHOUT a reload (within the poll/refresh window) and after in-app navigation; application-status and «Мои гиги»/«Чаты» badges likewise update without a full reload. Verify live in BOTH dev and a prod build; optionally re-run against gigly-m0jo.amvera.io to confirm the proxy-cache fix."
```

### C3 — Lock «От заказчика» terms + reset stale apply form (terms tab is pointless; previous terms persist) — P1

> **✅ SHIPPED & ARCHIVED 2026-07-15** → `openspec/archive/apply-terms-lock/`. **The PRD's premise was wrong and the
> scope changed — read the proposal's correction table before citing this item.** Verified live: the terms panel has
> **no inputs** (identical 11 on both tabs), so there was nothing to "lock"; «От заказчика» was already read-only; the
> tabs are «Условия {company}» / «Мои условия». And clearing the re-apply pre-fill **contradicts a shipped MUST**
> (`gig/spec.md` "Proposed Terms Across the Application Lifecycle") that exists to stop a blank re-submit silently
> dropping the counter — **decided: keep the pre-fill, out of scope.**
>
> **The real defect** (a violation of the existing "Gig-Detail Terms Tabs Reflect the Counter"): `lib/view-models.ts`
> filled «Мои условия» with the gig's own figures via `?? gig.budget`, so it rendered the client's `140 000 ₽ / 25 дней`
> identically to «Условия СофтПро» — «убивает смысл вкладки». Fixed at the VM (no fallback, absence per field), plus an
> explicit «— не предложено» state and a live link so the tab reflects what is being typed in the apply form.
> New `lib/terms-display.ts` is the single source for the string + derivation.
>
> Live-verified on a real prod build: 8/8 terms + 5/5 re-apply/counter + 3/3 owner. Tests: 10 new `terms-display` unit
> tests (mutation-verified) + two suites **flipped because they encoded the bug** (`terms-negotiation` literally
> asserted «proposed == client»). Zero regressions (full integration 72/652/724, identical to baseline).
```bash
/ralphy-plan apply-terms-lock "Fix the application terms flow so 'apply on the client's terms' actually means fixed terms, and the form does not carry stale values (Round-3, Арсений). Verified: applyToGig (app/actions/gig.ts:270) treats proposed budget/deadline as OPTIONAL — absent → null → the specialist accepts the client's terms; the backend already supports both. But the apply UI in app/(protected)/gigs/[id]/GigDetail.tsx (form at L837+) leaves the price/deadline fields editable on BOTH the «Предложено» and «От заказчика» tabs, with a note «оставьте пустым — откликнетесь на условиях заказчика», which defeats the «свои условия» tab entirely (there's no fixed reference to compare against); and the fields pre-fill previous values (defaultValue / reused application row on re-apply), so an old proposal reappears. Requirements: (1) render the «От заказчика» tab as READ-ONLY, showing the gig's fixed budget/deadline (no inputs) — it is the reference, not an editable copy; keep editing ONLY on «Предложено»; (2) keep the semantics that leaving «Предложено» empty = apply on the client's terms, but make that unambiguous now that the client tab is fixed; (3) reset the apply form to a clean state on open (no stale prefilled proposed terms) unless the user is explicitly editing an existing proposal; on a reversible re-apply, start clean rather than resurrecting the old proposal. Files: app/(protected)/gigs/[id]/GigDetail.tsx (apply form + TermsTabs usage), app/components/blocks/TermsTabs.tsx if the tab needs a read-only mode, app/actions/gig.ts (applyToGig re-apply data — confirm it does not force old proposed terms). Test plan: E2E — open apply: «От заказчика» shows fixed budget/deadline with no inputs; «Предложено» is editable and starts empty; submitting empty applies on the client's terms; withdraw then re-apply starts clean (no old proposal). Verify live."
```

### C4 — ~~Allow opening a dispute after payment~~ → RESOLVED, NO CHANGE
**Claim retracted by the tester (2026-07-15).** Disputes are intentionally available only *before* payment (while IN_PROGRESS/REVIEW), which is correct. The residual concern — does the **executor (assigned specialist)** also see the «Открыть спор» button? — was **verified live**: yes, it renders for the assigned specialist on IN_PROGRESS gigs with a ≥44px target (`showDisputeLink` gates on `(data.isOwner || data.isAssignedSpecialist)`; screenshot-confirmed on `workflow-gig-mobile-ui` and `seed-inprogress-gig-4`). Do **not** run a `/ralphy-plan` for this — the round now covers **C1, C2, C3, C5**.

### C5 — Surface example gigs to clients from the create-gig flow + reground the page — P2

> **✅ SHIPPED & ARCHIVED 2026-07-16** → `openspec/archive/examples-for-clients/`.
>
> **It was a regression, not a missing feature.** `ui/spec.md` already mandated a «💡 View example gigs for inspiration» link on the creation form (added by the archived `link-examples-from-gig-form`); the re-ground to `CreateGigDesign.tsx` dropped it, and `gig-browse-access.spec.ts:74` was rewritten to `page.goto('/gigs/examples')` **with a comment admitting the link was gone** — the suite stayed green while the feature was unreachable, until the tester found it.
>
> **Two PRD premises below were wrong** (as in C3 — don't reuse this prompt): (a) *role-gate examples to CLIENT* was **rejected on evidence** — specialist access is deliberate (`describe('SPECIALIST access')`, E2E, and the spec scenario scoped to "CLIENT or SPECIALIST"); the complaint was «заказчик не видит», not «специалист видит лишнее». (b) The «использовать как шаблон» prefill was **deferred** (P2, defense ~19.07, and it would have risked C1's freshly-reworked validation SSOT).
>
> **A third defect surfaced only under live verification:** the re-grounded `GigDetail` ships its **own** back control and never renders `BackButton` (`[id]/page.tsx` documents this), so `?from=examples` had been **inert since the re-ground** — and the control always pushed `/gigs`, which is **SPECIALIST-only**, so a CLIENT opening an example and clicking back was redirected to `/dashboard`, stranded away from both the examples and their draft. Fixed by threading `from` from the server page into that control.
>
> **Shipped:** «💡 Посмотреть примеры» in the create-gig hint banner → `/gigs/examples?from=new`, **new tab** (the brief lives in `useState`; an in-tab nav would destroy a half-written gig — the old spec even conceded "link already opens in new tab"); new `ExamplesDesign.tsx` (Russian + `gigly_full_design` skin + Russian empty state); dropped the unused `client.email`/`clientProfile` include; `BackButton` `from=examples` → `/gigs/examples` (was the **non-existent** `/dashboard/gigs/examples`) + new `from=new`.
>
> **Verified:** live 21/21 on a prod build · E2E 5/5 (now **clicks** the link; + a new detail→back round-trip guard) · 9 new `ExamplesDesign` component tests (the **empty branch is unreachable live** — the seed always has examples) · full suite **72 failed / 1010 passed**, failures identical to the stashed baseline = zero regressions. **A third test found defending a defect** (`back-button.test.tsx:70` asserted the 404 route) — flipped, mutation-checked.
>
> **Spec reconciliation also caught two stale canonical blocks:** «Comfortable «Назад к гигам» Back Control» named the label as a fixed string (generalized — a specialist *can* reach `?from=examples`), and **«Gig Creation Form Visual Sections» still says `goal`/`deliverables` are *optional*, which C1 made required server-side** — flagged in-place for a follow-up, not silently rewritten (it describes the whole pre-reground kit form).
>
> **NOT yet committed** (C3 + C5 both pending).

```bash
/ralphy-plan examples-for-clients "Make example gigs discoverable to the client who is creating a gig (Round-3, Арсений: примеры существуют, но заказчик при создании гига их не видит; видеть должны только при создании). Verified: app/(protected)/gigs/examples/page.tsx works (lists isExample+OPEN gigs, 'No role check') but is ORPHANED — the only link anywhere is a fallback href in app/components/BackButton.tsx (to a stale /dashboard/gigs/examples path); CreateGigDesign.tsx has no reference to examples (grep empty); and the page itself is English + pre-reground kit («Example Gigs», «✨ Example»), not gigly_full_design. Requirements: (1) add a visible, discoverable entry point to examples FROM the gig-creation screen (app/(protected)/gigs/new/CreateGigDesign.tsx) — «Посмотреть примеры»/«Образцы гигов» — positioned as inspiration while writing the brief; (2) scope visibility to CLIENT and the creation context (per the tester: only when creating a gig) — role-gate the examples route to CLIENT and reach it from the create flow, not from specialist browse; (3) localize and re-ground app/(protected)/gigs/examples/page.tsx to Russian + gigly_full_design tokens/skin; (4) optional strong UX: «использовать как шаблон» that prefills the create-gig form from a chosen example. Files: app/(protected)/gigs/new/CreateGigDesign.tsx (entry point + optional prefill), app/(protected)/gigs/examples/page.tsx (localize/reground + CLIENT role gate), app/components/BackButton.tsx (fix/verify the return path). Test plan: E2E — a CLIENT on the create-gig screen finds and opens «Примеры», sees localized example gigs, and returns to creation; a SPECIALIST does not get the create-scoped examples entry. Verify live. Depends on C1 (both edit CreateGigDesign.tsx) — land after C1."
```
