'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { createNotification } from '@/lib/notifications'

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
  const reason = sanitizeInput((formData.get('reason') as string) || '').trim()

  if (!reason) {
    return { error: 'A reason is required to open a dispute.' }
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }
  if (gig.isExample) {
    return { error: 'Cannot open a dispute on an example gig.' }
  }
  if (!gig.assignedSpecialistId) {
    return { error: 'A dispute can only be opened once a specialist is assigned.' }
  }

  const isParticipant =
    gig.clientId === session.userId || gig.assignedSpecialistId === session.userId
  if (!isParticipant) {
    return { error: 'Only the client or the assigned specialist can open a dispute.' }
  }

  const existing = await prisma.dispute.findUnique({
    where: { gigId_openerId: { gigId, openerId: session.userId } },
  })
  if (existing) {
    return { error: 'You already have a dispute on this gig.' }
  }

  await prisma.dispute.create({
    data: { gigId, openerId: session.userId, reason },
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
    return { error: 'Only admins can resolve disputes.' }
  }

  const disputeId = formData.get('disputeId') as string
  const resolution = sanitizeInput((formData.get('resolution') as string) || '').trim()
  const statusRaw = (formData.get('status') as string) || 'RESOLVED'
  const status = statusRaw === 'REJECTED' ? 'REJECTED' : 'RESOLVED'

  if (!resolution) {
    return { error: 'A resolution note is required.' }
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { gig: true },
  })
  if (!dispute) {
    return { error: 'This dispute no longer exists or has been removed.' }
  }
  if (dispute.status !== 'OPEN') {
    return { error: 'This dispute has already been resolved.' }
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
        },
      })
    })
  } catch (error) {
    return { error: 'Failed to resolve the dispute. Please try again.' }
  }

  // Notify the opener (fire-and-forget).
  createNotification(dispute.openerId, dispute.gigId, 'STATUS_CHANGE', 'dispute_resolved', {
    status,
  })

  revalidatePath('/disputes')
  revalidatePath('/admin')
  redirect(`/gigs/${dispute.gigId}`)
}
