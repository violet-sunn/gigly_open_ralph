'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'

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

      // Validate experienceLevel
      if (experienceLevel && !['MIDDLE', 'SENIOR'].includes(experienceLevel)) {
        return { error: 'Experience level must be MIDDLE or SENIOR.' }
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
        },
        update: {
          displayName,
          techStack,
          experienceLevel,
          bio,
        },
      })
    } else if (session.role === 'CLIENT') {
      // Extract and sanitize CLIENT fields
      const companyName = sanitizeInput((formData.get('companyName') as string) || '').trim()
      const inn = sanitizeInput((formData.get('inn') as string) || '').trim()
      const kpp = sanitizeInput((formData.get('kpp') as string) || '').trim()
      const contactPerson = sanitizeInput((formData.get('contactPerson') as string) || '').trim()
      const phoneNumber = sanitizeInput((formData.get('phoneNumber') as string) || '').trim()

      // Validate required fields
      if (!companyName || !inn) {
        return { error: 'Company name and INN are required.' }
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
        },
        update: {
          companyName,
          inn,
          kpp,
          contactPerson,
          phoneNumber,
        },
      })
    } else {
      return { error: 'Invalid user role.' }
    }
  } catch (error) {
    return { error: 'Failed to update profile. Please try again.' }
  }

  redirect('/dashboard/profile')
}
