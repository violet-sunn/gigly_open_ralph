# Tasks — transport-chats-finance-profile

Reconcile in place against `design-reference/screens/*` (HTML + PNG). Method = transport, don't rebuild; verification = build + lint + user eyeball + E2E. Token-NAME differences are not discrepancies.

## 1. Diff pass (no edits) — produce per-screen punch-lists

- [x] 1.1 Diff `ChatsDesign.tsx` vs `chats.specialist` + `chats.company`. Deltas: active-row tint (→ `rgba(0,136,255,0.08)`); missing composer paperclip icon. Rest matches.
- [x] 1.2 Diff `FinancesDesign.tsx` vs `finance.*`. Deltas (both roles): missing stat-tile caption line; COMPLETED row needs the #34C759 awaiting-payment green + role-aware «Ожидает оплаты»/«К оплате» label.
- [x] 1.3 Diff `ProfileDesign.tsx` vs `profile.*`. Deltas: specialist extra name pencil + centered (should be space-between) ID column + flat-blue stack tags (should be per-tag coloured); company missing «about» paragraph.
- [x] 1.4 Extracted modal shell + bio/cats/stack field inventory (shared 14px Handjet title, ✕ close, full-width «Сохранить»; bio 520/textarea, cats 460/chip grid «Выберите направления», stack 460/tag editor «Добавить технологию и Enter»).
- [x] **Test:** none (analysis). Punch-lists drove §2–4.

## 2. Chats reconcile + send-stays-in-chats

- [x] 2.1 Active-row tint → `rgba(0,136,255,0.08)`; added the composer paperclip icon. VM props + search + Enter-to-send unchanged.
- [x] 2.2 `sendMessage`: added optional `redirectTo` (same-origin guard; default `/gigs/[id]`).
- [x] 2.3 `ChatsDesign` send form passes hidden `redirectTo=/chats?gig=<id>`.
- [x] **Test:** build green. Chats E2E updated (send now asserts stay-on-`/chats`); runs at validate.

## 3. Finances reconcile

- [x] 3.1 `StatVM.caption` + `LedgerTableVM.statusColor` (additive); `getFinanceStats` captions (both roles); `getLedger` COMPLETED → role-aware awaiting-payment label + #34C759; `FinancesDesign` renders the caption + prefers `statusColor`.
- [x] **Test:** build green. Finances E2E extended (COMPLETED gig + caption + «К оплате»/«Ожидает оплаты»); runs at validate.

## 4. Profile reconcile + modal migration

- [x] 4.1 Profile reconciled: specialist ID-column space-between (name+roleTag top / verified+since bottom), removed the specialist name pencil, per-tag stack colours (`tagRgb`, 0.12 tint); company «about» paragraph added (new `ClientProfile.about` column + `updateProfile`/`getProfile`/render).
- [x] 4.2 Added the three specialist modals INLINE in `ProfileDesign`, opened by the card pencils (Стек→stack, Опыт→bio, Категории→cats): bio→`updateProfile`(bio), stack→`updateProfile`(techStack tag editor), cats→`setFavoriteCategories` (wired the orphaned action).
- [x] 4.3 Added the company «Редактировать реквизиты» modal (design-vocab) on the name pencil → `updateProfile` (companyName/inn/kpp/about).
- [x] 4.4 No-clobber: added owner-only `ProfileData.editFields` snapshot + `HiddenFields` renders hidden inputs for every field the upsert touches except the edited one; `updateProfile` gained an additive `noRedirect` so modals refresh+close in place.
- [x] **Test:** build green. Profile E2E rewritten for the modal flow (bio + company round-trips, about paragraph); runs at validate.

## 5. Retire `/profile/edit`

- [x] 5.1 `app/(protected)/profile/edit/page.tsx` → `redirect('/profile')`.
- [x] 5.2 **CONFIRMED + DONE** — deleted `ProfileEditForm.tsx` / `ProfileEditHeader.tsx`; repointed the in-app `/profile/edit` links (`ProfileCompletionCard`, profile-not-set-up notice) → `/profile`; updated the `ProfileCompletionCard` unit test (15 passed) and repointed the `loading-states` e2e to the bio modal's pending Save button (1 passed). `updateProfile` retained.
- [x] 5.3 Profile E2E updated: added a `/profile/edit`→`/profile` redirect test; replaced the old navigate-to-edit-form test with modal round-trips.
- [x] **Test:** build green; redirect asserted in E2E (runs at validate).

## 6. Validate

- [x] 6.1 `npm run build` green (Prisma client regenerated + `about` column pushed to dev.db).
- [x] 6.2 E2E green: `compose-chats` (5) + `compose-finances` (3) + `compose-profile` (6) + `messaging-flow-e2e` (1) = 15/15; `loading-states` (1) + `ProfileCompletionCard` unit (15) after the retirement.
- [x] 6.3 User eyeballed the screens + modals live (profile modals confirmed working after a hard refresh).
- [x] **Test:** all green.
