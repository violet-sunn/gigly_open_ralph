# Gig Spec Delta — chat-on-acceptance

## MODIFIED Requirements

### Requirement: Accept Application Server Action
The system MUST provide an `acceptApplication` server action that allows the gig owner to accept a PENDING application, and MUST seed a system-authored opener message so a chat thread exists for both parties immediately after acceptance.

#### Scenario: Successful acceptance
- GIVEN an authenticated CLIENT user who owns the gig
- WHEN `acceptApplication` is called with a valid applicationId
- THEN the Application status MUST be updated to "ACCEPTED"
- AND the Gig status MUST be updated to "IN_PROGRESS"
- AND the Gig `assignedSpecialistId` MUST be set to the application's specialistId
- AND all other PENDING applications for that gig MUST be updated to "REJECTED"
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Acceptance seeds a system opener message
- GIVEN a successful acceptance (gig is now IN_PROGRESS with an assigned specialist)
- WHEN the acceptance transaction has committed
- THEN exactly one Message record MUST be created for that gig with:
  - `gigId` = the accepted gig's ID
  - `senderId` = `null` (system/platform authored)
  - `content` = a non-empty Russian platform opener (e.g. «Заявка принята. Обсудите здесь детали, первые шаги и сроки.»)
- AND the thread MUST therefore appear in `/chats` (`getConversations`) and in both dashboards' «Сообщения» panels (`getRecentMessages`) for BOTH the owning client and the assigned specialist
- AND a failure to write the opener MUST NOT roll back or fail the acceptance (fire-after-commit; log on error)

#### Scenario: Non-owner attempts to accept
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Принимать отклики может только заказчик, опубликовавший гиг.' }`
- AND no records MUST be modified

#### Scenario: Non-CLIENT user attempts to accept
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Управлять откликами могут только заказчики. Если вы специалист — дождитесь решения заказчика.' }`

#### Scenario: Unauthenticated user attempts to accept
- GIVEN no valid session
- WHEN `acceptApplication` is called
- THEN it MUST redirect to `/login`

#### Scenario: Accept application on non-OPEN gig
- GIVEN a gig with status other than "OPEN"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Этот гиг больше не принимает отклики — возможно, специалист уже назначен.' }`

#### Scenario: Accept non-PENDING application
- GIVEN an application with status "REJECTED" or "ACCEPTED"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Этот отклик уже принят или отклонён.' }`

#### Scenario: Application not found
- GIVEN an applicationId that does not exist
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Этот отклик больше не существует или был удалён.' }`

**Acceptance Criteria:**
- `acceptApplication` is exported from `app/actions/gig.ts` with `'use server'`
- All status updates (application status, gig status, auto-reject) MUST happen in a single Prisma transaction
- The system opener Message MUST be written AFTER that transaction commits (best-effort; not part of the transaction)
- On success: redirects to `/gigs/{gigId}`
- On failure: returns `{ error: string }`

## ADDED Requirements

### Requirement: System-Authored Message Support
The `Message` model and its view-model mapping MUST support platform/system-authored messages that have no user sender.

#### Scenario: Message schema allows a null sender
- GIVEN the `Message` model in `prisma/schema.prisma`
- THEN `senderId` MUST be nullable (`String?`) and the `sender` relation MUST be optional
- AND existing messages with a non-null sender MUST be unaffected (nullable widening, no data migration)

#### Scenario: System message maps to a system bubble
- GIVEN a Message row with `senderId = null`
- WHEN `toMessageBubble` maps it for any viewer
- THEN the resulting `MessageBubbleVM.direction` MUST be `"system"` (not `"in"`/`"out"`)
- AND the author MUST be a platform label (e.g. «Gigly»)

#### Scenario: MessageBubble renders the system direction distinctly
- GIVEN a `MessageBubbleVM` with `direction: "system"`
- WHEN `MessageBubble` renders it
- THEN it MUST be visually distinct from `in`/`out` (e.g. centered, muted) and MUST NOT be attributed to the client or specialist

#### Scenario: Recent-messages panel tolerates a null sender
- GIVEN a gig whose most recent Message has `senderId = null`
- WHEN `getRecentMessages` builds the dashboard «Сообщения» item
- THEN it MUST NOT throw on the null sender
- AND the `senderName` MUST be a platform label (e.g. «Gigly»)

#### Scenario: System opener is not counted as counterparty unread
- GIVEN a gig whose only message is the system opener (`senderId = null`)
- WHEN `getConversations` computes the conversation's `unread` count for either party
- THEN the system opener MUST NOT be counted as an unread message from the counterparty (it still lists the conversation and shows its preview)

### Requirement: Gig Detail Chat Entry Point
The gig detail page MUST expose an obvious control to open the gig's chat for the two participants while the engagement is active.

#### Scenario: Assigned specialist sees «Написать заказчику»
- GIVEN an authenticated SPECIALIST who is the gig's assigned specialist
- AND the gig status is "IN_PROGRESS" or "REVIEW"
- WHEN they view the gig detail
- THEN a «Написать заказчику» control MUST be shown
- AND activating it MUST navigate to `/chats?gig={gigId}`

#### Scenario: Owning client sees «Написать исполнителю»
- GIVEN an authenticated CLIENT who owns the gig
- AND the gig has an assigned specialist and status "IN_PROGRESS" or "REVIEW"
- WHEN they view the gig detail
- THEN a «Написать исполнителю» control MUST be shown
- AND activating it MUST navigate to `/chats?gig={gigId}`

#### Scenario: Non-participants and pre-assignment see no entry point
- GIVEN a viewer who is neither the gig owner nor the assigned specialist, OR a gig with no assigned specialist (OPEN)
- WHEN they view the gig detail
- THEN the «Написать …» control MUST NOT be shown
