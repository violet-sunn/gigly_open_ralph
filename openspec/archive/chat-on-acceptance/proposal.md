# Change: chat-on-acceptance

## Why

Accepting a specialist's application is the moment the deal starts — but today it opens **no chat**, and there is **no way to start one**. Reported in the second stress-test pass as «Не запускает чат с Заказчик и Исполнитель после принятия заявки» (Гигли баги #8), verified live against the build.

Root causes (verified 2026-07-14):

- **No conversation is created.** `acceptApplication` (`app/actions/gig.ts:531`) runs a single transaction that flips the application to `ACCEPTED`, the gig to `IN_PROGRESS`, sets `assignedSpecialistId`, auto-rejects the rest, and fires an `application_accepted` notification. It never writes a `Message`.
- **Every conversation list is Message-row-gated.** `/chats` `getConversations` filters `.filter(g => g.messages.length > 0)` (`lib/view-models.ts:1071`); both dashboards' «Сообщения» panels come from `getRecentMessages`, which filters `gig.messages.length > 0` (`app/actions/message.ts:45`). So an assigned gig with zero messages appears in **no** list for **either** party.
- **No entry point on the gig.** `app/(protected)/gigs/[id]/GigDetail.tsx` has no «Написать» control — grep finds no «Написать»/«Открыть чат». The only way into a thread is `/chats?gig=<id>`, which the gig detail never links.

Net effect: after hire, the core "talk to your counterparty" loop silently fails. For a "high-end B2B" marketplace this reads as unfinished.

## What Changes

Chosen approach (confirmed with the user): **seed a system/platform opener message** so the thread materializes for both parties immediately, plus a gig-detail entry point.

1. **System-authored message support.** `Message.senderId` becomes nullable (`String?`, relation optional). A `null` sender denotes a platform/system message. `toMessageBubble` maps a `null` sender to a new `direction: "system"`; `MessageBubble` renders it as a centered, muted notice (distinct from `in`/`out`). `getRecentMessages` guards the now-nullable `message.sender` (senderName → «Gigly»).
2. **Seed the opener on acceptance.** After the existing `acceptApplication` transaction commits (gig is now `IN_PROGRESS` with `assignedSpecialistId` set), persist one gig-scoped `Message` with `senderId: null` and a Russian platform opener (e.g. «Заявка принята. Обсудите здесь детали, первые шаги и сроки.»). This makes the thread pass all three `messages.length > 0` filters, so it surfaces in `/chats` and both dashboards' «Сообщения» for both parties at once.
3. **Gig-detail entry point.** Add a «Написать заказчику» (specialist view) / «Написать исполнителю» (client view) control on `GigDetail.tsx`, shown to the assigned specialist and the owning client while the gig is `IN_PROGRESS`/`REVIEW`, linking to `/chats?gig=<gigId>`.
4. **Unread hygiene.** The system opener is excluded from the counterparty "unread" tally in `getConversations` so it does not read as "your counterparty messaged you" — it still lists the conversation and shows its preview.

## Impact

- Affected specs: `gig` (Accept Application Server Action; new requirements for system-message rendering, opener seeding, and the gig-detail chat entry point).
- Affected code:
  - `prisma/schema.prisma` — `Message.senderId` → `String?`, `sender` relation optional.
  - `app/actions/gig.ts` — `acceptApplication` seeds the opener after the transaction.
  - `app/components/blocks/view-models.ts` — `MessageBubbleVM.direction` gains `"system"`.
  - `lib/view-models.ts` — `toMessageBubble` system branch; `getConversations` unread exclusion for system messages.
  - `app/actions/message.ts` — `getRecentMessages` null-sender guard.
  - `app/components/blocks/MessageBubble.tsx` — system-direction rendering.
  - `app/(protected)/gigs/[id]/GigDetail.tsx` — «Написать» entry point.
- Migration: nullable widening only (existing rows keep their senders). Amvera propagates it via the entrypoint's `prisma db push` — no data migration needed.

### Non-goals

- No change to the send/receive path, rate limiting, or messaging authorization rules (`persistMessage` untouched; the opener is written directly, bypassing the participant gate by design since it has no user sender).
- No real-time/SSE, no email/push delivery — in-app only.
- No change to the application/terms state machine or the acceptance transaction's existing effects.
- Not backfilling openers for gigs already assigned before this change (only future acceptances seed a thread).
