'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSession, destroySession, type UserRole } from '@/lib/session'
import { loginRateLimiter, registerRateLimiter, getRateLimitError } from '@/lib/ratelimit'
import { validatePassword } from '@/lib/password'

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

  if (!role || !['CLIENT', 'SPECIALIST'].includes(role)) {
    return { error: 'Please select whether you\'re a client or specialist.' }
  }

  // Explicitly reject ADMIN role during registration
  if (role === 'ADMIN') {
    return { error: 'Please select whether you\'re a client or specialist.' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }
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
