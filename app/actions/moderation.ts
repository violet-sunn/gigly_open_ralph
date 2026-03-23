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
    return { error: 'Only admins can perform moderation actions.' }
  }

  const userId = formData.get('userId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Reason is required for suspension.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { error: 'This user no longer exists or has been removed.' }
    }

    if (user.suspended) {
      return { error: 'User is already suspended.' }
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
    return { error: 'Failed to suspend user. Please try again. If the problem persists, contact technical support.' }
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
    return { error: 'Only admins can perform moderation actions.' }
  }

  const userId = formData.get('userId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Reason is required for unsuspension.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { error: 'This user no longer exists or has been removed.' }
    }

    if (!user.suspended) {
      return { error: 'User is not suspended.' }
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
    return { error: 'Failed to unsuspend user. Please try again. If the problem persists, contact technical support.' }
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
    return { error: 'Only admins can perform moderation actions.' }
  }

  const gigId = formData.get('gigId') as string
  const reason = formData.get('reason') as string

  if (!reason || reason.trim() === '') {
    return { error: 'Reason is required for closing a gig.' }
  }

  try {
    const gig = await prisma.gig.findUnique({ where: { id: gigId } })
    if (!gig) {
      return { error: 'This gig no longer exists or has been removed.' }
    }

    if (gig.closedByAdmin) {
      return { error: 'Gig is already closed.' }
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
    return { error: 'Failed to close gig. Please try again. If the problem persists, contact technical support.' }
  }

  revalidatePath('/admin/gigs')
  revalidatePath('/admin')
  redirect('/admin/gigs')
}
