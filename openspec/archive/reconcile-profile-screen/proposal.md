# reconcile-profile-screen

**Type:** Regular change (UI / screen reconciliation)
**Created:** 2026-06-18
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 1, change #7
**Capability:** `ui` (reconciles the composed profile screen + the `ProfileHeader` block in `openspec/specs/ui/spec.md`)
**Depends on:** `add-profile-and-gig-detail-blocks` (archived — `SectionHeader`/`JobExperienceCard`), `add-missing-primitives` (archived — `SpecialtyTag`), `reconcile-design-tokens-from-figma` (archived).

## Why

`/profile` (`app/(protected)/profile/Profile.tsx`, shared by own + public `/profile/[userId]`) is already a
kit-composed `@composed-screen`, but it was built in Phase-2 **before Figma access** and before the Phase-0 blocks
landed. Most of the BLOCK section already reconciles — `TagList`, `CategoryTags`, and `ExperienceList` were
refactored in `add-profile-and-gig-detail-blocks` to adopt `SectionHeader` + `JobExperienceCard`, and the
`getProfile` builder already emits the `statsPlaceholder()` («Здесь будет ваша статистика»). The remaining drift
from **Профиль/specialist (`2860:2103`)** is concentrated in the **ID block** and one stray page-title:

| Figma ID-block element (`2860:2103`) | Built today | Action |
|---|---|---|
| `Специальность` atom (white chip, brand-blue mono) | generic bordered pill from `vm.roleTag` | **adopt `SpecialtyTag`** primitive |
| `tag/status` availability pill **with dot** by the avatar | `Avatar` online dot only (no pill) | **add a token-pure status pill** |
| verify row (`patch-check` + "Номер телефона верифицирован") | ✅ present | keep |
| "/с 21 января 2021" member-since | ✅ present | keep |
| analytics placeholder panel («…на стадии разработки») | ✅ `StatPanel` from `statsPlaceholder()` | keep (honor it) |
| — (node CONTENT leads with the ID block, **no page title**) | `Section title="Профиль"` h2 | **remove** the stray heading |
| 2-col BLOCK (Стек tags · Опыт job-exp \| Стек categories · Опыт gig feed) | ✅ via the Phase-0 blocks | keep / affirm |

This is the **reconciliation pass**, not a rebuild: the screen stays one kit-composed surface and the BLOCK
section is already faithful; we correct the ID block's specialty chip + status pill, drop the page-title the node
doesn't have, and lock the result behind F3/F5 while preserving the profile data + edit flow.

## What

- **`ProfileHeader` block** (the ID block, shared by own + public profile): render the specialty (`vm.roleTag`) via
  the **`SpecialtyTag`** primitive instead of the ad-hoc bordered pill; add a **token-pure availability status pill**
  (online/offline, with a dot) reflecting `vm.online`. Keep the verify row, member-since, avatar, and the optional
  owner edit affordance unchanged.
- **`Profile` screen**: remove the `Section title="Профиль"` page-title (the node leads with the ID block); keep the
  ID-block row (`ProfileHeader` | placeholder `StatPanel`) and the 2-col BLOCK composed from the Phase-0 blocks;
  honor the «на стадии разработки» placeholder.
- Preserve `getProfile` (no builder/VM-shape change required), the owner edit affordance → `/profile/edit`, the
  read-only public view, and all profile data binding.

No screen/block may carry off-token literals (F2) or bespoke markup in the screen (F5).

## Key reconciliation facts

- **Real numeric stats are a sanctioned content variant.** `getProfile` already splits the analytics into the
  mock's **placeholder** (`stats: statsPlaceholder()`, rendered in the ID-block's right panel — *honored*) and the
  **real** numeric stats (`header.stats` = Рейтинг / Завершено задач / Повторные заказы, rendered inside
  `ProfileHeader`). The static node shows only the "coming soon" placeholder; the real stats are a **functional
  enhancement the mock lacks** and are retained as a sanctioned content variant (the same "system > single screen"
  call as the welcome-step field-set in `reconcile-auth-and-onboarding`). Recorded in the reconciliation note.
- **Status pill, not a new primitive.** The Figma `tag/status` availability pill is rendered token-pure within
  `ProfileHeader` (the `Avatar` already carries the online/offline dot; the pill is a small inline token-pure
  element). No new primitive is introduced unless a faithful render demands one — if so it is added to the kit and
  flagged, not styled inline in the screen.
- **`/profile/[userId]` (public) shares the block.** Both views render `ProfileHeader`; the reconciliation applies
  to both. The public view keeps `isOwner=false` (no edit affordance).

## Scope

- **Reconciled block:** `app/components/blocks/ProfileHeader.tsx` (SpecialtyTag + status pill; token-pure).
- **Reconciled screen:** `app/(protected)/profile/Profile.tsx` (drop page-title; affirm ID-block + 2-col BLOCK).
- **Tests updated:** `__tests__/e2e/compose-profile.spec.ts` (assert the specialty chip / status pill; keep the
  data + edit-flow + read-only assertions); `__tests__/unit/components/domain-blocks.test.tsx` (ProfileHeader
  renders SpecialtyTag + status pill). Workbench `registry.tsx` if the ProfileHeader story needs the new states.

## Non-goals

- Changing `getProfile`, the `ProfileHeaderVM` field set (beyond what the status pill needs from existing `online`),
  the profile edit form, or the CLIENT profile semantics.
- Reconciling the dashboard/gig screens (separate Phase-1 changes).
- Building the real analytics widget (the placeholder stays — a deferred feature).
- The absolute F1 ≤1% pixel gate (Phase 2 `refidelity-from-figma-references`); here F1 = structural/overlay match
  to the node.

## References

`docs/figma-screens-export.md` §2 (Профиль/specialist `2860:2103`) + §1 (`Специальность`/`tag/status` atoms);
`app/(protected)/profile/Profile.tsx`; `app/components/blocks/{ProfileHeader,TagList,CategoryTags,ExperienceList,
SectionHeader,JobExperienceCard}.tsx`; `app/components/primitives/{SpecialtyTag,StatusBadge,Avatar}.tsx`;
`lib/view-models.ts` (`getProfile`, `ProfileData`, `statsPlaceholder`); tests
`__tests__/e2e/compose-profile.spec.ts`, `__tests__/integration/profile-{vm,evolution,sanitization}.test.ts`.
