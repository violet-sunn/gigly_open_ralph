# transport-shared-shell

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 2 of 8 — the shared frame every protected screen renders inside; prerequisite for changes 3–8).

## Why

The shared chrome (sidebar + header) must match the prototype, because every screen sits inside it. A version of it already exists — `app/_design/AppShellDesign.tsx`, built during the earlier campaign-4 effort **by eye, before the capture pipeline existed**, and already wired into `app/(protected)/layout.tsx` and `app/admin/layout.tsx`. Per the project's hard-won lesson ("it exists ≠ done"), a by-eye build is exactly what drifts. Now that change 1 has produced the authoritative captured reference (`design-reference/screens/`), this change **audits the existing shell against that reference and reconciles the divergences** — it does not rebuild from scratch and must not discard the working data wiring.

## What

Reconcile `app/_design/AppShellDesign.tsx` to the prototype's shell as captured in `design-reference/screens/` (the sidebar + header are present in every captured state; `dashboard.specialist`, `dashboard.company`, `dashboard.admin` show all three role framings).

- **Sidebar:** GIGLY logo, profile card (avatar + name/role + notifications bell with badge + settings gear), role framing, nav (icons, labels, counts, active-bar), support/help card, logout — each reconciled to the captured markup, **with static copy transported verbatim** (e.g. the support card's «Поддержка» heading and body text, not a paraphrase).
- **Header:** the title zone (blue accent bar + Handjet uppercase page title), the top-right control, and the conditional search bar (verbatim placeholder; correct set of screens).
- **Preserve all working wiring:** nav routing (`buildSidebarNav`/`buildAdminNav`/`markActive` over `usePathname`), the live `NotificationBell` + dropdown, `logoutUser`, theme toggle, and the settings gear → `/settings`.
- **Coverage:** confirm the shell continues to wrap every protected route and the admin routes (it already does via the two layouts).

## Constraints / Non-goals

- **Reconcile, don't rebuild.** Keep the existing component's data wiring; change only what diverges from the captured reference.
- **Do not restyle `/settings`** — the gear just navigates there (settings is deferred per the plan).
- **Reuse existing tokens** (`app/_design/tokens.css` / `fig-tokens.css`); no new token work.
- **Desktop-only** (1512px design width); no responsive work.
- Cleaning up now-dead legacy shell components (`app/components/templates/AppShell.tsx`, `blocks/SidebarNav*`, `TopbarLive`, `MainNav`) is **out of scope** unless a route still imports them.

## Open decision (confirm during implementation)

**Role switcher.** The prototype's sidebar shows an interactive 3-way switcher (Специалист / Компания / Админ) — a *prototype demo affordance* for previewing all roles. In the real app a user has a single role. **Recommended default:** keep the existing non-interactive **role indicator** (highlights the user's actual role; admin mode highlights Админ). Do not wire live role-switching unless the product actually supports it.

## Impact

- Modifies: `app/_design/AppShellDesign.tsx` (markup/copy reconciliation; wiring preserved).
- Possibly touches: `lib/nav.ts` only if nav labels/icons/counts diverge from the reference.
- No data-model or server-action changes. Existing E2E must stay green.
