'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { isTimezone, isSpecialization } from '@/lib/profiles'

export async function updateProfile(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  try {
    if (session.role === 'SPECIALIST') {
      // Extract and sanitize SPECIALIST fields
      const displayName = sanitizeInput((formData.get('displayName') as string) || '').trim()
      const techStack = sanitizeInput((formData.get('techStack') as string) || '').trim()
      const experienceLevel = (formData.get('experienceLevel') as string) || ''
      const bio = sanitizeInput((formData.get('bio') as string) || '').trim()

      // profile-evolution additive fields (all optional → defaults; existing callers unaffected)
      const avatarUrl = sanitizeInput((formData.get('avatarUrl') as string) || '').trim()
      const phoneNumber = sanitizeInput((formData.get('phoneNumber') as string) || '').trim()
      const phoneVerified =
        formData.get('phoneVerified') === 'true' || formData.get('phoneVerified') === 'on'
      const position = sanitizeInput((formData.get('position') as string) || '').trim()
      const specialization = sanitizeInput((formData.get('specialization') as string) || '').trim()
      const location = sanitizeInput((formData.get('location') as string) || '').trim()
      const timezone = sanitizeInput((formData.get('timezone') as string) || '').trim()

      // Validate experienceLevel
      if (experienceLevel && !['MIDDLE', 'SENIOR'].includes(experienceLevel)) {
        return { error: 'Уровень должен быть Middle или Senior. Выберите один из вариантов.' }
      }

      // Validate the new dropdown-backed fields against their canonical datasets (when supplied)
      if (timezone && !isTimezone(timezone)) {
        return { error: 'Выберите корректный часовой пояс.' }
      }
      if (specialization && !isSpecialization(specialization)) {
        return { error: 'Выберите корректную специализацию.' }
      }

      // Upsert SpecialistProfile
      await prisma.specialistProfile.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          displayName,
          techStack,
          experienceLevel,
          bio,
          avatarUrl,
          phoneNumber,
          phoneVerified,
          position,
          specialization,
          location,
          timezone,
        },
        update: {
          displayName,
          techStack,
          experienceLevel,
          bio,
          avatarUrl,
          phoneNumber,
          phoneVerified,
          position,
          specialization,
          location,
          timezone,
        },
      })
    } else if (session.role === 'CLIENT') {
      // Extract and sanitize CLIENT fields
      const companyName = sanitizeInput((formData.get('companyName') as string) || '').trim()
      const inn = sanitizeInput((formData.get('inn') as string) || '').trim()
      const kpp = sanitizeInput((formData.get('kpp') as string) || '').trim()
      const about = sanitizeInput((formData.get('about') as string) || '').trim()
      const contactPerson = sanitizeInput((formData.get('contactPerson') as string) || '').trim()
      const phoneNumber = sanitizeInput((formData.get('phoneNumber') as string) || '').trim()

      // profile-evolution additive fields (role-agnostic: avatar + logical verified)
      const avatarUrl = sanitizeInput((formData.get('avatarUrl') as string) || '').trim()
      const phoneVerified =
        formData.get('phoneVerified') === 'true' || formData.get('phoneVerified') === 'on'
      // design-onboarding client fields (Должность / Местоположение+часовой пояс).
      const position = sanitizeInput((formData.get('position') as string) || '').trim()
      const location = sanitizeInput((formData.get('location') as string) || '').trim()
      const timezone = sanitizeInput((formData.get('timezone') as string) || '').trim()

      // Validate required fields. INN is no longer required at signup — clients register with the design's
      // minimal set (company/ФИО/должность/локация) and ИНН/КПП are added later in profile-edit (their
      // verification is post-release per DATA-MODEL.md). Only the company name is mandatory.
      if (!companyName) {
        return { error: 'Укажите название компании, чтобы завершить профиль.' }
      }
      // Validate the dataset-backed timezone when supplied (mirrors the specialist branch).
      if (timezone && !isTimezone(timezone)) {
        return { error: 'Выберите корректный часовой пояс.' }
      }

      // Upsert ClientProfile
      await prisma.clientProfile.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          companyName,
          inn,
          kpp,
          about,
          contactPerson,
          position,
          phoneNumber,
          location,
          timezone,
          avatarUrl,
          phoneVerified,
        },
        update: {
          companyName,
          inn,
          kpp,
          about,
          contactPerson,
          position,
          phoneNumber,
          location,
          timezone,
          avatarUrl,
          phoneVerified,
        },
      })
    } else {
      return { error: 'Некорректная роль пользователя. Если видите эту ошибку — обратитесь в поддержку.' }
    }
  } catch (error) {
    return { error: 'Не удалось сохранить профиль. Проверьте данные и попробуйте ещё раз; если проблема повторяется — обратитесь в поддержку.' }
  }

  // The profile-screen edit modals submit with noRedirect=true and stay in place: they refresh + close client-side
  // on success (a redirect would unmount the modal mid-transition). All other callers navigate.
  if (formData.get('noRedirect') === 'true') {
    return { success: true }
  }

  // Most callers (profile-edit) land back on /profile; the onboarding step-3 setup passes redirectTo=/dashboard.
  // Only same-origin absolute paths are honoured (defends against open-redirect via a crafted form field).
  const requested = (formData.get('redirectTo') as string) || ''
  redirect(requested.startsWith('/') ? requested : '/profile')
}

/**
 * Replace the authenticated specialist's work history (ExperienceList / «Опыт работы»).
 *
 * Specialist-only, replace semantics (delete + recreate in a transaction) so the submitted list is
 * authoritative — mirrors `setFavoriteCategories`. The form serializes its rows into the `entries`
 * field as a JSON array. Requires the caller's SpecialistProfile to exist (created by `updateProfile`
 * / onboarding first), since WorkExperience.profileId → SpecialistProfile.userId.
 */
export async function setWorkExperience(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'SPECIALIST') {
    return { error: 'Редактировать опыт работы могут только специалисты.' }
  }

  let entries: {
    company?: string
    title?: string
    description?: string
    startYear?: number | string | null
    endYear?: number | string | null
  }[]
  try {
    entries = JSON.parse((formData.get('entries') as string) || '[]')
    if (!Array.isArray(entries)) {
      return { error: 'Некорректные данные об опыте работы.' }
    }
  } catch {
    return { error: 'Некорректные данные об опыте работы.' }
  }

  const nowYear = new Date().getFullYear()
  const clean: {
    company: string
    title: string
    description: string
    startYear: number | null
    endYear: number | null
    order: number
  }[] = []

  for (const [i, e] of entries.entries()) {
    const company = sanitizeInput((e.company ?? '').toString()).trim()
    if (!company) {
      return { error: 'У каждой записи об опыте укажите компанию.' }
    }
    const startYear = e.startYear == null || e.startYear === '' ? null : Number(e.startYear)
    const endYear = e.endYear == null || e.endYear === '' ? null : Number(e.endYear)
    if (startYear != null && (!Number.isInteger(startYear) || startYear < 1970 || startYear > nowYear)) {
      return { error: 'Некорректный год начала.' }
    }
    if (endYear != null && (!Number.isInteger(endYear) || endYear < 1970 || endYear > nowYear)) {
      return { error: 'Некорректный год окончания.' }
    }
    if (startYear != null && endYear != null && endYear < startYear) {
      return { error: 'Год окончания не может быть раньше года начала.' }
    }
    clean.push({
      company,
      title: sanitizeInput((e.title ?? '').toString()).trim(),
      description: sanitizeInput((e.description ?? '').toString()).trim(),
      startYear,
      endYear,
      order: i,
    })
  }

  try {
    await prisma.$transaction([
      prisma.workExperience.deleteMany({ where: { profileId: session.userId } }),
      ...(clean.length
        ? [
            prisma.workExperience.createMany({
              data: clean.map((c) => ({ ...c, profileId: session.userId })),
            }),
          ]
        : []),
    ])
  } catch (error) {
    return { error: 'Не удалось сохранить опыт работы. Попробуйте ещё раз.' }
  }

  return { success: true }
}
