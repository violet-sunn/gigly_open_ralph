'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { createNotification } from '@/lib/notifications'

/** The six DATA-MODEL dispute reasons. A submitted reason not in this set normalizes to «Другое». */
const DISPUTE_REASONS = [
  'Оплата не поступила',
  'Результат не соответствует ТЗ',
  'Заказчик не выходит на связь',
  'Исполнитель не выходит на связь',
  'Просрочен срок выполнения',
  'Другое',
] as const
const normalizeReason = (r: string): string =>
  (DISPUTE_REASONS as readonly string[]).includes(r) ? r : 'Другое'

/**
 * Open a dispute on a gig. Participant-only (the gig's client or assigned specialist), one per [gigId, openerId],
 * on a real two-party engagement (an assigned specialist exists). The other participant is notified (fire-and-forget).
 */
export async function openDispute(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const gigId = formData.get('gigId') as string
  const rawReason = sanitizeInput((formData.get('reason') as string) || '').trim()
  const description = sanitizeInput((formData.get('description') as string) || '').trim()
  const evidence = sanitizeInput((formData.get('evidence') as string) || '').trim() // CSV of file names (optional)

  if (!rawReason && !description) {
    return { error: 'Укажите причину открытия спора.' }
  }
  // Normalize to the DATA-MODEL enum; a free-text legacy reason becomes «Другое» + the opening timeline entry.
  const reason = normalizeReason(rawReason)
  const openingText = description || (reason === 'Другое' ? rawReason : '')

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }
  if (gig.isExample) {
    return { error: 'Нельзя открыть спор по демонстрационному гигу.' }
  }
  if (!gig.assignedSpecialistId) {
    return { error: 'Спор можно открыть только после назначения специалиста.' }
  }

  const isParticipant =
    gig.clientId === session.userId || gig.assignedSpecialistId === session.userId
  if (!isParticipant) {
    return { error: 'Открыть спор может только заказчик или назначенный специалист.' }
  }

  const existing = await prisma.dispute.findUnique({
    where: { gigId_openerId: { gigId, openerId: session.userId } },
  })
  if (existing) {
    return { error: 'У вас уже есть спор по этому гигу.' }
  }

  // Capture role + amount at open (point-in-time, per DATA-MODEL).
  const openerRole = gig.clientId === session.userId ? 'company' : 'specialist'
  await prisma.dispute.create({
    data: {
      gigId,
      openerId: session.userId,
      openerRole,
      amount: gig.budget,
      reason,
      evidence,
      ...(openingText
        ? { timeline: { create: { authorRole: openerRole, authorName: '', text: openingText } } }
        : {}),
    },
  })

  // Notify the other participant (fire-and-forget).
  const otherId =
    gig.clientId === session.userId ? gig.assignedSpecialistId : gig.clientId
  if (otherId) {
    createNotification(otherId, gigId, 'STATUS_CHANGE', 'dispute_opened', {
      openerId: session.userId,
    })
  }

  redirect(`/gigs/${gigId}`)
}

/**
 * Resolve a dispute (admin-only). Writes a ModerationLog audit entry and links it via Dispute.resolutionLogId,
 * in one interactive transaction. Notifies the opener (fire-and-forget).
 */
export async function resolveDispute(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    return { error: 'Разрешать споры могут только администраторы.' }
  }

  const disputeId = formData.get('disputeId') as string
  const note = sanitizeInput((formData.get('resolution') as string) || '').trim()
  const statusRaw = (formData.get('status') as string) || 'RESOLVED'
  const status = statusRaw === 'REJECTED' ? 'REJECTED' : 'RESOLVED'
  // The moderator verdict (DATA-MODEL): in favour of specialist / company / a 50% split. Prefixed onto the resolution.
  const VERDICTS: Record<string, string> = {
    specialist: 'В пользу специалиста',
    company: 'В пользу заказчика',
    split_50: 'Частичный возврат 50%',
  }
  const verdict = VERDICTS[(formData.get('verdict') as string) || '']
  const resolution = verdict ? (note ? `${verdict} — ${note}` : verdict) : note

  if (!resolution) {
    return { error: 'Укажите решение по спору.' }
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { gig: true },
  })
  if (!dispute) {
    return { error: 'Этот спор больше не существует или был удалён.' }
  }
  if (dispute.status !== 'OPEN') {
    return { error: 'Этот спор уже разрешён.' }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const log = await tx.moderationLog.create({
        data: {
          action: 'RESOLVE_DISPUTE',
          reason: resolution,
          adminId: session.userId,
          targetGigId: dispute.gigId,
          targetUserId: dispute.openerId,
        },
      })
      await tx.dispute.update({
        where: { id: disputeId },
        data: {
          status,
          resolution,
          resolvedById: session.userId,
          resolutionLogId: log.id,
          // Closing timeline entry (DATA-MODEL DisputeEntry, moderator).
          timeline: { create: { authorRole: 'moderator', authorName: 'Модератор', text: resolution } },
        },
      })
    })
  } catch (error) {
    return { error: 'Не удалось разрешить спор. Попробуйте ещё раз.' }
  }

  // Notify the opener (fire-and-forget).
  createNotification(dispute.openerId, dispute.gigId, 'STATUS_CHANGE', 'dispute_resolved', {
    status,
  })

  revalidatePath('/disputes')
  revalidatePath('/admin')
  redirect(`/gigs/${dispute.gigId}`)
}
