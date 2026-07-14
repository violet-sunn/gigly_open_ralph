# Tasks — chat-on-acceptance

Order: schema/model → mapping/render → seed on acceptance → gig-detail entry point → verify. Land on a dedicated branch, one commit for the change. Seed login: `alexey.ivanov@mail.ru` (specialist) / `ivan.petrov@techcorp.ru` (client) / `TestPass123`.

## 1. Make `Message.senderId` nullable (system-authored support)
- [x] In `prisma/schema.prisma`, change `senderId String` → `senderId String?` and make the `sender User @relation("SentMessages", ...)` optional (`sender User? @relation(...)`).
- [x] Regenerate the client and apply locally: `npx prisma generate` + `npx prisma db push` (SQLite; nullable widening — no data loss).
- **Test plan:** `npx prisma generate` succeeds; `npx tsc --noEmit` surfaces every call site that assumed a non-null `sender` (fix in tasks 2–3). Confirm existing messages still have their senders in Prisma Studio.
- **Deploy note:** Amvera entrypoint runs `prisma db push` on boot (see `deploy-amvera-sqlite`), so the nullable column propagates on next deploy without a hand-written migration.

## 2. Add the `"system"` message direction (VM + render)
- [x] In `app/components/blocks/view-models.ts`, extend `MessageBubbleVM.direction` from `"in" | "out"` to `"in" | "out" | "system"`.
- [x] In `app/components/blocks/MessageBubble.tsx`, render `direction === "system"` as a centered, muted notice (token-pure; not attributed to either party, no `in`/`out` alignment).
- **Test plan:** `npx tsc --noEmit` clean; render a stub `system` bubble in the chat and eyeball it centered/muted.

## 3. Map null-sender rows to system in the VM layer
- [x] In `lib/view-models.ts` `toMessageBubble`: when `m.senderId == null` (or `m.sender == null`), return `direction: "system"`, `author: "Gigly"`. Keep the existing `out`/`in` logic for real senders.
- [x] In `lib/view-models.ts` `getConversations`: exclude system messages (`senderId == null`) from the `unread` tally so the opener does not read as a counterparty message. Preview/listing unchanged (it still passes `messages.length > 0`).
- [x] In `app/actions/message.ts` `getRecentMessages`: guard the now-nullable `message.sender` — when null, `senderName = "Gigly"` (do not dereference `sender.specialistProfile`/`clientProfile`/`email`).
- **Test plan:** `npx tsc --noEmit` clean. Unit-check `toMessageBubble` with a null-sender row → `{ direction: 'system', author: 'Gigly' }`. Unit-check `getConversations` unread with only a system opener → `unread === 0` and the conversation is still listed.

## 4. Seed the system opener in `acceptApplication`
- [x] In `app/actions/gig.ts` `acceptApplication`, AFTER the existing `prisma.$transaction([...])` commits (gig is now IN_PROGRESS with `assignedSpecialistId`), write one opener: `prisma.message.create({ data: { gigId: application.gigId, senderId: null, content: OPENER } })` where `OPENER` is a Russian platform greeting, e.g. «Заявка принята. Обсудите здесь детали, первые шаги и сроки.».
- [x] Wrap the write best-effort (try/catch + `console.error`) so a messaging failure never fails or rolls back the acceptance. Keep it before the existing `redirect(\`/gigs/${application.gigId}\`)`.
- [x] Do NOT route it through `persistMessage` (that gates on a participant sender and would reject a null sender); write directly.
- **Test plan:** Integration — call `acceptApplication` on a PENDING application → exactly one Message with `senderId === null` and the opener content exists for the gig; the application/gig/auto-reject effects are unchanged. Assert the opener does not block the redirect on a simulated create failure.

## 5. Add the «Написать» entry point on gig detail
- [x] In `app/(protected)/gigs/[id]/GigDetail.tsx`, add a chat entry control using the existing `messaging`/role data from `getGigDetail` (`messaging.assigned`, `isOwner`, `isAssignedSpecialist`, gig status). Show it when `messaging.assigned && (isOwner || isAssignedSpecialist)` and status ∈ {`IN_PROGRESS`, `REVIEW`}.
- [x] Label by role: specialist → «Написать заказчику»; client → «Написать исполнителю». Route via a `next/link` to `/chats?gig={gig.id}` (the `/chats` page selects by `?gig=`).
- [x] Style it as an obvious button/CTA (not a muted text link), consistent with the gig-detail design tokens. Inline the wiring (per the compose-screen inline-islands constraint).
- **Test plan:** Manual/E2E — as the assigned specialist and as the owning client on an IN_PROGRESS gig, the control is visible and navigates to `/chats?gig=<id>` opening that gig's thread; hidden for non-participants and on OPEN gigs.

## 6. Update the canonical spec delta
- [x] Ensure `openspec/changes/chat-on-acceptance/specs/gig/spec.md` matches what shipped (opener content, labels, statuses). Run `/ralphy-validate`.

## 7. Live verification (do not skip)
- [x] Run the app; log in as the client, accept a pending application on a seed gig.
- [x] Confirm the thread appears immediately in `/chats` for the client AND (log in as) the assigned specialist, and in each dashboard's «Сообщения» panel — with the system opener rendered as a centered/muted system bubble labeled «Gigly», not attributed to either party.
- [x] Confirm the gig detail shows «Написать заказчику» (specialist) / «Написать исполнителю» (client), each opening `/chats?gig=<id>`, and that both parties can send a normal message in the thread.
- [x] Regression: sending/receiving, `/chats` unread counts, and the dashboard panels behave for pre-existing gigs (non-null senders) exactly as before.
- **Seed/creds:** `alexey.ivanov@mail.ru` / `ivan.petrov@techcorp.ru` / `TestPass123`. Use a Playwright script inside the project dir (see `playwright-verify-script-location`).
