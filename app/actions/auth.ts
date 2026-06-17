'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSession, destroySession, type UserRole } from '@/lib/session'
import { loginRateLimiter, registerRateLimiter, getRateLimitError } from '@/lib/ratelimit'
import { validatePassword } from '@/lib/password'
import { sanitizeInput } from '@/lib/sanitize'
import { isSpecialization, isExperienceLevel, isTimezone } from '@/lib/profiles'

/**
 * Build the role-specific profile nested-create from the wizard's step-3 fields (compose-auth-onboarding). Returns
 * undefined when no profile fields are present (backward-compatible with single-step callers). Free text is sanitized;
 * dropdown values are validated against the datasets (invalid → '' rather than persisted verbatim).
 */
function buildProfileCreate(role: string, formData: FormData) {
  if (role === 'CLIENT') {
    if (!formData.has('companyName')) return undefined
    const inn = sanitizeInput((formData.get('inn') as string) || '').trim()
    return {
      clientProfile: {
        create: {
          companyName: sanitizeInput((formData.get('companyName') as string) || '').trim(),
          inn,
          contactPerson: sanitizeInput((formData.get('contactPerson') as string) || '').trim(),
          phoneNumber: sanitizeInput((formData.get('phoneNumber') as string) || '').trim(),
        },
      },
    }
  }
  if (role === 'SPECIALIST') {
    if (!formData.has('displayName')) return undefined
    const specialization = (formData.get('specialization') as string) || ''
    const experienceLevel = (formData.get('experienceLevel') as string) || ''
    const timezone = (formData.get('timezone') as string) || ''
    return {
      specialistProfile: {
        create: {
          displayName: sanitizeInput((formData.get('displayName') as string) || '').trim(),
          position: sanitizeInput((formData.get('position') as string) || '').trim(),
          techStack: sanitizeInput((formData.get('techStack') as string) || '').trim(),
          specialization: isSpecialization(specialization) ? specialization : '',
          experienceLevel: isExperienceLevel(experienceLevel) ? experienceLevel : '',
          timezone: isTimezone(timezone) ? timezone : '',
        },
      },
    }
  }
  return undefined
}

export async function registerUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  // Get IP address for rate limiting
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') ||
                    headersList.get('x-real-ip') ||
                    'unknown'

  // Check rate limit BEFORE validation
  const rateLimitResult = await registerRateLimiter.limit(ipAddress)
  if (!rateLimitResult.success) {
    return { error: getRateLimitError(rateLimitResult.reset, 'registration attempts') }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  // Validate password strength BEFORE hashing
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.error }
  }

  // Confirm-password match — only enforced when a confirmPassword is supplied (the onboarding wizard sends it;
  // single-step callers do not, so their behaviour is unchanged).
  if (formData.has('confirmPassword') && (formData.get('confirmPassword') as string) !== password) {
    return { error: 'Пароли не совпадают.' }
  }

  if (!role || !['CLIENT', 'SPECIALIST'].includes(role)) {
    return { error: 'Please select whether you\'re a client or specialist.' }
  }

  // Explicitly reject ADMIN role during registration
  if (role === 'ADMIN') {
    return { error: 'Please select whether you\'re a client or specialist.' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    // Persist the step-3 role-specific profile (when present) in the same create as the User (one transaction).
    const profile = buildProfileCreate(role, formData)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role, ...profile }
    })
    await createSession(user.id, user.email, user.role as UserRole)
  } catch (error) {
    return { error: 'An account with this email already exists. Try logging in instead.' }
  }

  redirect('/dashboard')
}

export async function loginUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  // Get IP address for rate limiting
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') ||
                    headersList.get('x-real-ip') ||
                    'unknown'

  // Check rate limit BEFORE password validation
  const rateLimitResult = await loginRateLimiter.limit(ipAddress)
  if (!rateLimitResult.success) {
    return { error: getRateLimitError(rateLimitResult.reset, 'login attempts') }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { error: 'Invalid email or password. Check your credentials and try again.' }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { error: 'Invalid email or password. Check your credentials and try again.' }
  }

  if (user.suspended) {
    return { error: 'Your account has been suspended. Contact support at support@gigly.ru for assistance.' }
  }

  await createSession(user.id, user.email, user.role as UserRole)
  redirect('/dashboard')
}

export async function logoutUser() {
  await destroySession()
  redirect('/')
}
