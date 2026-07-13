'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

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
