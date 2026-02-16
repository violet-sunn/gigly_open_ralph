'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

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
      // Extract SPECIALIST fields
      const displayName = (formData.get('displayName') as string) || ''
      const techStack = (formData.get('techStack') as string) || ''
      const experienceLevel = (formData.get('experienceLevel') as string) || ''
      const bio = (formData.get('bio') as string) || ''
      const hourlyRateStr = formData.get('hourlyRate') as string

      // Validate experienceLevel
      if (experienceLevel && !['MIDDLE', 'SENIOR'].includes(experienceLevel)) {
        return { error: 'Experience level must be MIDDLE or SENIOR.' }
      }

      // Validate and convert hourlyRate
      let hourlyRate = 0
      if (hourlyRateStr) {
        const rate = parseFloat(hourlyRateStr)
        if (isNaN(rate) || rate < 0) {
          return { error: 'Hourly rate must be a positive number.' }
        }
        hourlyRate = Math.floor(rate * 100) // Convert roubles to kopecks
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
          hourlyRate,
        },
        update: {
          displayName,
          techStack,
          experienceLevel,
          bio,
          hourlyRate,
        },
      })
    } else if (session.role === 'CLIENT') {
      // Extract CLIENT fields
      const companyName = (formData.get('companyName') as string) || ''
      const inn = (formData.get('inn') as string) || ''
      const kpp = (formData.get('kpp') as string) || ''
      const contactPerson = (formData.get('contactPerson') as string) || ''
      const phoneNumber = (formData.get('phoneNumber') as string) || ''

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
