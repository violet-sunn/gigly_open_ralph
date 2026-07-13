# transport-chats-finance-profile

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 5 of 8 — communication, finance, and profile, plus the modal-based profile-edit migration that retires the last kit/Tailwind route in this area).

## Why

The chats, finances, and profile screens already exist and are **already built on the prototype's inline-styled markup + `app/_design/tokens.css`** (like changes 3–4), wired to real VMs/actions — so they need **reconciling to the captured reference**, not rebuilding. The exception is **profile editing**: it still lives on a separate `/profile/edit` route in the old kit/Tailwind vocabulary, whereas the prototype has **no standalone edit screen** — editing is **modal-based** on the profile screen itself (Decision 2 in the plan, confirmed). This change reconciles the three screens and migrates profile editing into the prototype's modals, retiring `/profile/edit`.

## Reference mapping (CRITICAL — note `finance.*` is singular)

| App route / role | App component (EXISTING — reconcile in place) | Captured reference |
|---|---|---|
| `/chats` SPECIALIST | `app/(protected)/chats/ChatsDesign.tsx` | `chats.specialist.{png,html}` |
| `/chats` COMPANY | `ChatsDesign.tsx` | `chats.company.{png,html}` |
| `/finances` SPECIALIST | `app/(protected)/finances/FinancesDesign.tsx` | `finance.specialist.{png,html}` |
| `/finances` COMPANY | `FinancesDesign.tsx` | `finance.company.{png,html}` |
| `/profile` SPECIALIST | `app/(protected)/profile/ProfileDesign.tsx` | `profile.specialist.{png,html}` + edit modals (below) |
| `/profile` COMPANY | `ProfileDesign.tsx` | `profile.company.{png,html}` + a NEW company requisites modal (design-vocab, no capture) |
| Profile-edit (specialist) modals | (added to `ProfileDesign`) | `profile.specialist.modal-bio` («Редактировать описание»), `profile.specialist.modal-cats` («Избранные категории»), `overlay.profStack` («Редактировать стек») |
| `/profile/edit` | RETIRED → redirect to `/profile` | (none — no standalone edit screen in the design) |

## What

Reconcile to the captured reference, preserving all data/action wiring:

- **Chats** (`ChatsDesign`): diff vs `chats.{specialist,company}` and fix the two-pane layout — the dialog list («Сообщения» + count + live client-side search + items) and the thread (counterparty header, day-separated bubbles with out/read treatment, composer). Wire fix: **after sending, stay in `/chats`** (today `sendMessage` redirects to `/gigs/[id]`, bouncing the user out of chats).
- **Finances** (`FinancesDesign`): diff vs `finance.{specialist,company}` and fix the stat tiles + the «Операции» ledger, for both the SPECIALIST (earnings) and COMPANY (spend + fee) variants. Logical-amounts only (no real payments) — unchanged.
- **Profile** (`ProfileDesign`): diff vs `profile.{specialist,company}` and fix the ID card, the specialist blocks (Стек / Опыт / Избранные категории / Реализованные проекты) and the company Реквизиты panel. **Add the edit modals**, triggered by the existing pencils:
  - **bio** («Редактировать описание») → `updateProfile` (bio).
  - **cats** («Избранные категории») → `setFavoriteCategories` (currently orphaned — wire it).
  - **stack** («Редактировать стек») → `updateProfile` (techStack).
  - **company requisites** (NEW, design-vocab) → `updateProfile` (companyName/inn/kpp/contactPerson/phoneNumber).
- **Retire `/profile/edit`**: the profile pencils open the modals instead of routing to `/profile/edit`; `/profile/edit` redirects to `/profile`.

## Constraints / Non-goals

- **Reconcile, don't rebuild; keep filenames.** Keep `ChatsDesign` / `FinancesDesign` / `ProfileDesign` and the `page.tsx → VM → component` wiring. Implement the modals INLINE in `ProfileDesign` (or co-located, NOT imported as a sibling island — matches the project's inline-island constraint).
- **Modals must not clobber sibling fields.** `updateProfile` is a role-branched **upsert**, so the bio/stack/requisites modals MUST submit the profile's *other* fields as hidden current values (the edited field bound to the input), so an edit to one field doesn't blank the others. The cats modal uses the dedicated `setFavoriteCategories` (replace semantics) and the bio→`updateProfile`/cats→`setFavoriteCategories` split is intentional.
- **Edit surface matches the prototype (documented narrowing).** The captured modals cover bio / categories / stack (+ the new company requisites). `displayName` and `experienceLevel` are NOT in any captured modal — the modals PRESERVE them (hidden current values) but do not expose them for post-onboarding UI editing (a deliberate divergence from the retired kit form; no data lost). `setWorkExperience` (structured work-history entries) has **no captured modal** and stays orphaned / out of scope (the «Опыт» entries were already non-editable in the app).
- **`sendMessage` change is additive.** Add an optional `redirectTo` (mirroring `updateProfile`) so chats stays on `/chats` after send while gig-detail keeps its `/gigs/[id]` behavior; no messaging/auth/rate-limit logic change.
- **`/profile/edit` retirement.** Redirect the route to `/profile`. Per the PRD, **confirm before deleting** `ProfileEditForm.tsx` / `ProfileEditHeader.tsx` / the route's server-side logic; the `updateProfile` action itself STAYS (the modals call it). Until confirmed, leave the components dormant behind the redirect.
- **Data gaps additive only (Method §3).** Touch `lib/view-models.ts` only if the design shows a field the VMs genuinely lack (expected rare).
- **Out of scope:** disputes (6), admin (7), auth (8); settings (deferred). Don't restyle other screens beyond shared-component changes.
- Desktop-only (1512px); reuse existing tokens; no new UI system.

## Impact

- Modifies: `app/(protected)/chats/ChatsDesign.tsx`, `app/(protected)/finances/FinancesDesign.tsx`, `app/(protected)/profile/ProfileDesign.tsx` (+ inline modals), `app/(protected)/profile/edit/page.tsx` (→ redirect).
- Server actions: `app/actions/gig.ts` `sendMessage` (additive `redirectTo`); wires the existing `setFavoriteCategories` (`app/actions/category.ts`) and confirms `updateProfile` (`app/actions/profile.ts`) for the modals. No new actions; no data-model change.
- Possibly retires (pending confirmation): `app/(protected)/profile/edit/ProfileEditForm.tsx` + `ProfileEditHeader.tsx`.
- Existing E2E for these routes (chats / finances / profile / profile-edit) must stay green; selectors updated only where markup changed.
