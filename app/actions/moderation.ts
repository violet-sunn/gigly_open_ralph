'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hasOpenDispute } from '@/lib/disputes'

export async function suspendUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    return { error: 'Действия модерации доступны только администраторам.' }
  }

  const userId = formData.get('userId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Укажите причину блокировки.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { error: 'Этот пользователь больше не существует или был удалён.' }
    }

    if (user.suspended) {
      return { error: 'Пользователь уже заблокирован.' }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { suspended: true }
      }),
      prisma.moderationLog.create({
        data: {
          action: 'SUSPEND_USER',
          reason: reason.trim(),
          adminId: session.userId,
          targetUserId: userId
        }
      })
    ])
  } catch (error) {
    return { error: 'Не удалось заблокировать пользователя. Попробуйте ещё раз; если проблема повторяется — обратитесь в поддержку.' }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin')
  redirect('/admin/users')
}

export async function unsuspendUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    return { error: 'Действия модерации доступны только администраторам.' }
  }

  const userId = formData.get('userId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Укажите причину разблокировки.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { error: 'Этот пользователь больше не существует или был удалён.' }
    }

    if (!user.suspended) {
      return { error: 'Пользователь не заблокирован.' }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { suspended: false }
      }),
      prisma.moderationLog.create({
        data: {
          action: 'UNSUSPEND_USER',
          reason: reason.trim(),
          adminId: session.userId,
          targetUserId: userId
        }
      })
    ])
  } catch (error) {
    return { error: 'Не удалось разблокировать пользователя. Попробуйте ещё раз; если проблема повторяется — обратитесь в поддержку.' }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin')
  redirect('/admin/users')
}

export async function closeGig(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    return { error: 'Действия модерации доступны только администраторам.' }
  }

  const gigId = formData.get('gigId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Укажите причину закрытия гига.' }
  }

  try {
    const gig = await prisma.gig.findUnique({ where: { id: gigId } })
    if (!gig) {
      return { error: 'Этот гиг больше не существует или был удалён.' }
    }

    if (gig.closedByAdmin) {
      return { error: 'Гиг уже закрыт.' }
    }

    await prisma.$transaction([
      prisma.gig.update({
        where: { id: gigId },
        data: {
          closedByAdmin: true,
          closedAt: new Date()
        }
      }),
      prisma.moderationLog.create({
        data: {
          action: 'CLOSE_GIG',
          reason: reason.trim(),
          adminId: session.userId,
          targetGigId: gigId
        }
      })
    ])
  } catch (error) {
    return { error: 'Не удалось закрыть гиг. Попробуйте ещё раз; если проблема повторяется — обратитесь в поддержку.' }
  }

  revalidatePath('/admin/gigs')
  revalidatePath('/admin')
  redirect('/admin/gigs')
}

// ---- Hard deletion (admin) ------------------------------------------------
// Suspend/close above are soft & reversible. The two actions below PURGE the entity: real removal for spam/abuse/junk.
// Deletion is FK-blocked by Restrict relations, so each runs a deliberate, ordered cascade inside one transaction, and
// writes a ModerationLog whose `reason` embeds the deleted identity (the targetGigId/targetUserId FK nulls out on
// delete, so the snapshot is the only durable record).

export interface GigDeletionImpact {
  applications: number
  messages: number
  reviews: number
  disputes: number
  /** True → deletion is blocked (an open dispute must be resolved first); mirrors the `deleteGig` guard. */
  hasOpenDispute: boolean
}

/** Read-only: how many dependents `deleteGig` would purge. ADMIN-only; returns null for a non-admin or missing gig. */
export async function getGigDeletionImpact(gigId: string): Promise<GigDeletionImpact | null> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return null

  const gig = await prisma.gig.findUnique({ where: { id: gigId }, select: { id: true } })
  if (!gig) return null

  const [applications, messages, reviews, disputes, openDispute] = await Promise.all([
    prisma.application.count({ where: { gigId } }),
    prisma.message.count({ where: { gigId } }),
    prisma.review.count({ where: { gigId } }),
    prisma.dispute.count({ where: { gigId } }),
    prisma.dispute.count({ where: { gigId, status: 'OPEN' } }),
  ])
  return { applications, messages, reviews, disputes, hasOpenDispute: openDispute > 0 }
}

export interface UserDeletionImpact {
  applications: number
  reviewsAuthored: number
  reviewsReceived: number
  disputesOpened: number
  ownedGigs: number
  /** Reasons the user cannot be deleted yet — any true → the confirm MUST be blocked. */
  blocked: {
    isAdmin: boolean
    isSelf: boolean
    ownsGigs: boolean
    hasOpenDispute: boolean
    activeAssignment: boolean
  }
}

/** Read-only: what `deleteUser` would purge + why it may be blocked. ADMIN-only; null for a non-admin or missing user. */
export async function getUserDeletionImpact(userId: string): Promise<UserDeletionImpact | null> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return null

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } })
  if (!user) return null

  const [applications, reviewsAuthored, reviewsReceived, disputesOpened, ownedGigs, openDisputes, activeAssignments] =
    await Promise.all([
      prisma.application.count({ where: { specialistId: userId } }),
      prisma.review.count({ where: { authorId: userId } }),
      prisma.review.count({ where: { targetId: userId } }),
      prisma.dispute.count({ where: { openerId: userId } }),
      prisma.gig.count({ where: { clientId: userId } }),
      prisma.dispute.count({
        where: {
          status: 'OPEN',
          OR: [{ openerId: userId }, { gig: { clientId: userId } }, { gig: { assignedSpecialistId: userId } }],
        },
      }),
      prisma.gig.count({ where: { assignedSpecialistId: userId, status: { in: ['IN_PROGRESS', 'REVIEW'] } } }),
    ])

  return {
    applications,
    reviewsAuthored,
    reviewsReceived,
    disputesOpened,
    ownedGigs,
    blocked: {
      isAdmin: user.role === 'ADMIN',
      isSelf: userId === session.userId,
      ownsGigs: ownedGigs > 0,
      hasOpenDispute: openDisputes > 0,
      activeAssignment: activeAssignments > 0,
    },
  }
}

export async function deleteGig(prevState: { error?: string } | null, formData: FormData) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    return { error: 'Действия модерации доступны только администраторам.' }
  }

  const gigId = formData.get('gigId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Укажите причину удаления гига.' }
  }

  try {
    const gig = await prisma.gig.findUnique({ where: { id: gigId } })
    if (!gig) {
      return { error: 'Этот гиг больше не существует или был удалён.' }
    }

    // A contested gig cannot be purged around the dispute — resolve it first (same discipline as blocking settlement).
    if (await hasOpenDispute(gigId)) {
      return { error: 'По гигу открыт спор — удалить его можно будет после решения модератора.' }
    }

    // The FK link (targetGigId) nulls out when the gig is deleted, so the durable audit record is this snapshot.
    const auditReason = `${reason.trim()} · [гиг ${gig.id}: «${gig.title}»]`

    // FK-safe order: the Restrict children (reviews → disputes → applications) go before the gig; Message and
    // Notification cascade automatically once the gig is gone.
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { gigId } }),
      prisma.dispute.deleteMany({ where: { gigId } }),
      prisma.application.deleteMany({ where: { gigId } }),
      prisma.moderationLog.create({
        data: { action: 'DELETE_GIG', reason: auditReason, adminId: session.userId, targetGigId: gigId },
      }),
      prisma.gig.delete({ where: { id: gigId } }),
    ])
  } catch (error) {
    return { error: 'Не удалось удалить гиг. Попробуйте ещё раз; если проблема повторяется — обратитесь в поддержку.' }
  }

  revalidatePath('/admin/gigs')
  revalidatePath('/admin')
  redirect('/admin/gigs')
}

export async function deleteUser(prevState: { error?: string } | null, formData: FormData) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    return { error: 'Действия модерации доступны только администраторам.' }
  }

  const userId = formData.get('userId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Укажите причину удаления пользователя.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { error: 'Этот пользователь больше не существует или был удалён.' }
    }

    // Self before role: the acting caller is always an admin, so check "self" first to give the accurate message.
    if (userId === session.userId) {
      return { error: 'Нельзя удалить собственную учётную запись.' }
    }
    if (user.role === 'ADMIN') {
      return { error: 'Администратора нельзя удалить через консоль.' }
    }

    // Owns gigs → refuse; the admin must delete those gigs first (each with its own preview). This is what keeps
    // deleteUser from ever reaching into other users' data on the deleted user's gigs.
    const ownedGigs = await prisma.gig.count({ where: { clientId: userId } })
    if (ownedGigs > 0) {
      return {
        error: `У пользователя есть гиги (${ownedGigs}). Сначала удалите их в разделе «Гиги», затем удалите аккаунт.`,
      }
    }

    const openDisputes = await prisma.dispute.count({
      where: {
        status: 'OPEN',
        OR: [{ openerId: userId }, { gig: { clientId: userId } }, { gig: { assignedSpecialistId: userId } }],
      },
    })
    if (openDisputes > 0) {
      return { error: 'По пользователю есть открытый спор — сначала решите его.' }
    }

    const activeAssignments = await prisma.gig.count({
      where: { assignedSpecialistId: userId, status: { in: ['IN_PROGRESS', 'REVIEW'] } },
    })
    if (activeAssignments > 0) {
      return { error: 'Пользователь назначен на активный гиг — сначала закройте или переназначьте его.' }
    }

    const auditReason = `${reason.trim()} · [пользователь ${user.id}: ${user.email}]`

    // FK-safe order. The only Restrict FKs a non-admin, gig-less user can hold are: authored/received reviews, opened
    // disputes, and their applications. Everything else (profiles, WorkExperience, sessions, notifications, favorite
    // categories) cascades on user.delete; Message.senderId / Gig.assignedSpecialistId / ModerationLog.targetUserId
    // null out.
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { OR: [{ authorId: userId }, { targetId: userId }] } }),
      prisma.dispute.deleteMany({ where: { openerId: userId } }),
      prisma.application.deleteMany({ where: { specialistId: userId } }),
      prisma.moderationLog.create({
        data: { action: 'DELETE_USER', reason: auditReason, adminId: session.userId, targetUserId: userId },
      }),
      prisma.user.delete({ where: { id: userId } }),
    ])
  } catch (error) {
    return {
      error: 'Не удалось удалить пользователя. Попробуйте ещё раз; если проблема повторяется — обратитесь в поддержку.',
    }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin')
  redirect('/admin/users')
}
