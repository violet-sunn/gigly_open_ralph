'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { isTimezone, isSpecialization } from '@/lib/profiles'

export async function updateProfile(
  prevState: { error?: string } | null,
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
        return { error: 'Experience level must be Middle or Senior. Please select one of these options.' }
      }

      // Validate the new dropdown-backed fields against their canonical datasets (when supplied)
      if (timezone && !isTimezone(timezone)) {
        return { error: 'Please choose a valid timezone.' }
      }
      if (specialization && !isSpecialization(specialization)) {
        return { error: 'Please choose a valid specialization.' }
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
      const contactPerson = sanitizeInput((formData.get('contactPerson') as string) || '').trim()
      const phoneNumber = sanitizeInput((formData.get('phoneNumber') as string) || '').trim()

      // profile-evolution additive fields (role-agnostic: avatar + logical verified)
      const avatarUrl = sanitizeInput((formData.get('avatarUrl') as string) || '').trim()
      const phoneVerified =
        formData.get('phoneVerified') === 'true' || formData.get('phoneVerified') === 'on'

      // Validate required fields
      if (!companyName || !inn) {
        return { error: 'Company name and INN are required. Please fill in these fields to complete your profile.' }
      }

      // Upsert ClientProfile
      await prisma.clientProfile.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          companyName,
          inn,
          kpp,
          contactPerson,
          phoneNumber,
          avatarUrl,
          phoneVerified,
        },
        update: {
          companyName,
          inn,
          kpp,
          contactPerson,
          phoneNumber,
          avatarUrl,
          phoneVerified,
        },
      })
    } else {
      return { error: 'Invalid user role. Please contact support if you see this error.' }
    }
  } catch (error) {
    return { error: 'Failed to update profile. Please check your information and try again. If the problem persists, contact support.' }
  }

  redirect('/profile')
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
    return { error: 'Only specialists can edit work experience.' }
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
      return { error: 'Invalid work experience data.' }
    }
  } catch {
    return { error: 'Invalid work experience data.' }
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
      return { error: 'Each work experience entry needs a company.' }
    }
    const startYear = e.startYear == null || e.startYear === '' ? null : Number(e.startYear)
    const endYear = e.endYear == null || e.endYear === '' ? null : Number(e.endYear)
    if (startYear != null && (!Number.isInteger(startYear) || startYear < 1970 || startYear > nowYear)) {
      return { error: 'Start year is invalid.' }
    }
    if (endYear != null && (!Number.isInteger(endYear) || endYear < 1970 || endYear > nowYear)) {
      return { error: 'End year is invalid.' }
    }
    if (startYear != null && endYear != null && endYear < startYear) {
      return { error: 'End year cannot be before start year.' }
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
    return { error: 'Failed to save work experience. Please try again.' }
  }

  return { success: true }
}
