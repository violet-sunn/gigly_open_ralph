import { prisma } from '@/lib/prisma'
import { sanitizeInput } from '@/lib/sanitize'
import { messageRateLimiter, getRateLimitError } from '@/lib/ratelimit'

/**
 * chat-realtime — the shared message-write core used by BOTH send paths (`sendMessage` form action and the optimistic
 * `sendMessageLive`). Centralizes every guard so neither path can drift or weaken: rate limit (30/hr), sanitize, length
 * (≤2000) + non-empty validation, the gig gates (exists, not closedByAdmin, not PAID, has an assigned specialist — the
 * "after gig start" rule), participant authorization (owner or assigned specialist), the `Message` write, and the
 * recipient `Notification` upsert. Error strings are kept identical to the original `sendMessage` so callers/tests are
 * unchanged. Auth (session) is the caller's responsibility.
 */

export type PersistedMessage = {
  id: string
  gigId: string
  // Nullable to match the Message schema (system/platform messages have no sender); persistMessage itself always
  // writes a real user sender, so in practice this is non-null on the send path.
  senderId: string | null
  content: string
  createdAt: Date
}

export type PersistMessageResult = { message: PersistedMessage } | { error: string }

export async function persistMessage(
  userId: string,
  gigId: string,
  contentRaw: string,
): Promise<PersistMessageResult> {
  // Rate limit AFTER auth (caller), BEFORE validation — mirrors the original sendMessage ordering.
  const rateLimitResult = await messageRateLimiter.limit(userId)
  if (!rateLimitResult.success) {
    return { error: getRateLimitError(rateLimitResult.reset, 'messages') }
  }

  // Sanitize, then validate length on the sanitized (pre-trim) content, then require non-empty after trim.
  const contentSanitized = sanitizeInput(contentRaw || '')
  if (contentSanitized.length > 2000) {
    return { error: 'Сообщение слишком длинное. Максимум 2000 символов.' }
  }
  const content = contentSanitized.trim()
  if (!content) {
    return { error: 'Сообщение не может быть пустым. Введите текст.' }
  }

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: { id: true, clientId: true, assignedSpecialistId: true, closedByAdmin: true, status: true },
  })

  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }
  if (gig.closedByAdmin) {
    return { error: 'Нельзя писать в закрытый гиг — он закрыт администрацией.' }
  }
  // Terminal states — the engagement is finished, so the thread is read-only history. COMPLETED (work approved) and PAID
  // both close messaging; the active window is OPEN…REVIEW.
  if (gig.status === 'COMPLETED' || gig.status === 'PAID') {
    return { error: 'Нельзя писать в завершённый гиг — работа уже финализирована.' }
  }
  if (!gig.assignedSpecialistId) {
    return { error: 'Писать можно после назначения специалиста. Дождитесь, пока заказчик примет отклик.' }
  }

  const isOwner = gig.clientId === userId
  const isAssignedSpecialist = gig.assignedSpecialistId === userId
  if (!isOwner && !isAssignedSpecialist) {
    return { error: 'Писать в этот чат может только заказчик, опубликовавший гиг, или назначенный специалист.' }
  }

  const message = await prisma.message.create({
    data: { gigId, senderId: userId, content },
  })

  // Recipient = the other party. Upsert their unread Notification (fire-and-forget; mirrors original behavior).
  const recipientId = isOwner ? gig.assignedSpecialistId : gig.clientId
  try {
    await prisma.notification.upsert({
      where: { userId_gigId: { userId: recipientId!, gigId } },
      create: { userId: recipientId!, gigId, lastReadAt: null },
      update: { updatedAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to create/update notification:', error)
  }

  return { message }
}
