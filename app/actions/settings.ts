'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession, destroySession } from '@/lib/session'
import { isLocale, isCurrency } from '@/lib/preferences'
import { isTimezone } from '@/lib/profiles'
import { sanitizeInput } from '@/lib/sanitize'
import { getSettings, type SettingsData } from '@/lib/view-models'

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
    currency?: string
    notifyPlatformNews?: boolean
    notifyNewGigs?: boolean
  } = {}

  if (formData.has('locale')) {
    const locale = (formData.get('locale') as string) || ''
    if (!isLocale(locale)) {
      return { error: 'Выберите поддерживаемый язык.' }
    }
    data.locale = locale
  }

  // transport-settings — «Валюта получения выплат» (Платежные данные).
  if (formData.has('currency')) {
    const currency = (formData.get('currency') as string) || ''
    if (!isCurrency(currency)) {
      return { error: 'Выберите поддерживаемую валюту.' }
    }
    data.currency = currency
  }

  const asBool = (v: FormDataEntryValue | null) => v === 'true' || v === 'on'
  if (formData.has('notifyApplications')) data.notifyApplications = asBool(formData.get('notifyApplications'))
  if (formData.has('notifyStatusChanges')) data.notifyStatusChanges = asBool(formData.get('notifyStatusChanges'))
  if (formData.has('notifyMessages')) data.notifyMessages = asBool(formData.get('notifyMessages'))
  if (formData.has('notifyPayments')) data.notifyPayments = asBool(formData.get('notifyPayments'))
  if (formData.has('showRatingInProfile')) data.showRatingInProfile = asBool(formData.get('showRatingInProfile'))
  if (formData.has('showOnlineStatus')) data.showOnlineStatus = asBool(formData.get('showOnlineStatus'))
  // transport-settings — the two extra Email-уведомления rows.
  if (formData.has('notifyPlatformNews')) data.notifyPlatformNews = asBool(formData.get('notifyPlatformNews'))
  if (formData.has('notifyNewGigs')) data.notifyNewGigs = asBool(formData.get('notifyNewGigs'))

  await prisma.user.update({ where: { id: session.userId }, data })

  return { success: true }
}

/**
 * transport-settings — «Имя» (Учетные данные). Partial-safe: updates ONLY the name field (so it never clobbers other
 * profile fields the full `updateProfile` upsert would). SPECIALIST → `displayName`; CLIENT → `contactPerson`.
 */
export async function updateAccountName(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const name = sanitizeInput((formData.get('name') as string) || '').trim()
  try {
    if (session.role === 'SPECIALIST') {
      await prisma.specialistProfile.upsert({
        where: { userId: session.userId },
        create: { userId: session.userId, displayName: name },
        update: { displayName: name },
      })
    } else if (session.role === 'CLIENT') {
      // companyName is required on create, so update-only (the profile exists post-onboarding) — partial + non-clobbering.
      await prisma.clientProfile.update({ where: { userId: session.userId }, data: { contactPerson: name } })
    } else {
      return { error: 'Эта учётная запись не редактируется здесь.' }
    }
  } catch {
    return { error: 'Не удалось сохранить имя. Попробуйте ещё раз.' }
  }
  return { success: true }
}

/**
 * transport-settings — «Часовой пояс» (Язык и регион). Partial-safe like `updateAccountName`: writes ONLY `timezone`
 * (a personal preference on the profile, also surfaced on the profile page) without clobbering other profile fields.
 */
export async function updateTimezone(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const timezone = sanitizeInput((formData.get('timezone') as string) || '').trim()
  if (timezone && !isTimezone(timezone)) {
    return { error: 'Выберите корректный часовой пояс.' }
  }
  try {
    if (session.role === 'SPECIALIST') {
      await prisma.specialistProfile.upsert({
        where: { userId: session.userId },
        create: { userId: session.userId, timezone },
        update: { timezone },
      })
    } else if (session.role === 'CLIENT') {
      await prisma.clientProfile.update({ where: { userId: session.userId }, data: { timezone } })
    } else {
      return { error: 'Эта учётная запись не редактируется здесь.' }
    }
  } catch {
    return { error: 'Не удалось сохранить часовой пояс.' }
  }
  return { success: true }
}

/**
 * transport-settings — «Завершить все неактивные сеансы» (Безопасность). Deletes every session of the caller EXCEPT
 * the current one (its id === the JWT `sid`), so the user stays logged in. Ownership-scoped by `userId`.
 */
export async function terminateInactiveSessions() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  await prisma.session.deleteMany({
    where: { userId: session.userId, ...(session.sid ? { NOT: { id: session.sid } } : {}) },
  })

  return { success: true }
}

/**
 * transport-settings — lazy data load for the «Настройки» modal (opened via `?settings=1` from the shell). Returns the
 * same `SettingsData` the `/settings` route uses, for the current session.
 */
export async function loadSettings(): Promise<SettingsData> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return getSettings({ userId: session.userId, email: session.email, sid: session.sid })
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
    return { error: 'Сессия не найдена.' }
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
    return { error: 'Введите email вашего аккаунта, чтобы подтвердить удаление.' }
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
