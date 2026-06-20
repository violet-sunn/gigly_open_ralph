'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession, destroySession } from '@/lib/session'
import { isLocale } from '@/lib/preferences'

/**
 * Update the authenticated user's account preferences (locale + notification toggles). Partial-safe: only fields
 * present in the form are updated (the Phase-2 Toggle submits explicit 'true'/'false'). Save-in-place.
 */
export async function updatePreferences(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const data: {
    locale?: string
    notifyApplications?: boolean
    notifyStatusChanges?: boolean
    notifyMessages?: boolean
    notifyPayments?: boolean
    showRatingInProfile?: boolean
    showOnlineStatus?: boolean
  } = {}

  if (formData.has('locale')) {
    const locale = (formData.get('locale') as string) || ''
    if (!isLocale(locale)) {
      return { error: 'Please choose a supported language.' }
    }
    data.locale = locale
  }

  const asBool = (v: FormDataEntryValue | null) => v === 'true' || v === 'on'
  if (formData.has('notifyApplications')) data.notifyApplications = asBool(formData.get('notifyApplications'))
  if (formData.has('notifyStatusChanges')) data.notifyStatusChanges = asBool(formData.get('notifyStatusChanges'))
  if (formData.has('notifyMessages')) data.notifyMessages = asBool(formData.get('notifyMessages'))
  if (formData.has('notifyPayments')) data.notifyPayments = asBool(formData.get('notifyPayments'))
  if (formData.has('showRatingInProfile')) data.showRatingInProfile = asBool(formData.get('showRatingInProfile'))
  if (formData.has('showOnlineStatus')) data.showOnlineStatus = asBool(formData.get('showOnlineStatus'))

  await prisma.user.update({ where: { id: session.userId }, data })

  return { success: true }
}

/**
 * Terminate one of the authenticated user's sessions (reconcile-settings). Ownership-enforced: deletes the `Session`
 * row only if it belongs to the caller. If the terminated session is the caller's current one (its id === the JWT
 * `sid`), the cookie is cleared and the caller is redirected to /login.
 */
export async function terminateSession(sessionId: string) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const row = await prisma.session.findUnique({ where: { id: sessionId } })
  if (!row || row.userId !== session.userId) {
    return { error: 'Session not found.' }
  }

  await prisma.session.delete({ where: { id: sessionId } })

  if (session.sid === sessionId) {
    await destroySession()
    redirect('/login')
  }

  return { success: true }
}

/**
 * Delete the authenticated user's OWN account. Requires `confirmEmail` to equal the caller's email. Deletes the
 * caller's full footprint in a transaction (FK-safe order, mirroring resetTestDatabase) — records that reference the
 * user or are on the user's gigs — unassigns the user from others' gigs, deletes the user's gigs, then the user
 * (profiles / work experience / favorite categories cascade). Tears down the session and redirects.
 */
export async function deleteAccount(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const confirmEmail = ((formData.get('confirmEmail') as string) || '').trim()
  if (confirmEmail !== session.email) {
    return { error: 'Please type your account email to confirm deletion.' }
  }

  const userId = session.userId
  const owned = await prisma.gig.findMany({ where: { clientId: userId }, select: { id: true } })
  const gigIds = owned.map((g) => g.id)

  await prisma.$transaction(async (tx) => {
    await tx.dispute.deleteMany({
      where: { OR: [{ openerId: userId }, { resolvedById: userId }, { gigId: { in: gigIds } }] },
    })
    await tx.review.deleteMany({
      where: { OR: [{ authorId: userId }, { targetId: userId }, { gigId: { in: gigIds } }] },
    })
    await tx.notification.deleteMany({
      where: { OR: [{ userId }, { gigId: { in: gigIds } }] },
    })
    await tx.message.deleteMany({
      where: { OR: [{ senderId: userId }, { gigId: { in: gigIds } }] },
    })
    await tx.application.deleteMany({
      where: { OR: [{ specialistId: userId }, { gigId: { in: gigIds } }] },
    })
    await tx.moderationLog.deleteMany({
      where: { OR: [{ adminId: userId }, { targetUserId: userId }, { targetGigId: { in: gigIds } }] },
    })
    // Unassign the user from gigs owned by others (do not delete those gigs).
    await tx.gig.updateMany({ where: { assignedSpecialistId: userId }, data: { assignedSpecialistId: null } })
    // Delete the user's own gigs (their child records are gone above).
    await tx.gig.deleteMany({ where: { clientId: userId } })
    // Profiles / WorkExperience / favoriteCategories cascade via the existing onDelete: Cascade.
    await tx.user.delete({ where: { id: userId } })
  })

  await destroySession()
  redirect('/')
}
