'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSession, destroySession, type UserRole } from '@/lib/session'
import { loginRateLimiter, registerRateLimiter, getRateLimitError } from '@/lib/ratelimit'
import { validatePassword } from '@/lib/password'

/**
 * Phase 1 of the design's two-phase onboarding (Auth.dc.html step 2 «Зарегистрироваться»). Creates the account from
 * credentials + role ONLY and establishes the session (auto-login), then returns `{ ok: true }` WITHOUT redirecting so
 * the AuthDesign surface can advance to step-3 profile setup (which persists the role-specific profile via
 * `updateProfile`). Profile fields are no longer collected here.
 */
export async function registerUser(
  prevState: { error?: string; ok?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
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

  // Confirm-password match — enforced when a confirmPassword is supplied (the onboarding sends it).
  if (formData.has('confirmPassword') && (formData.get('confirmPassword') as string) !== password) {
    return { error: 'Пароли не совпадают.' }
  }

  // Role must be CLIENT or SPECIALIST (ADMIN is assignable only via the DB and is rejected here).
  if (!role || !['CLIENT', 'SPECIALIST'].includes(role)) {
    return { error: 'Выберите, кто вы — компания или специалист.' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    })
    await createSession(user.id, user.email, user.role as UserRole)
  } catch (error) {
    return { error: 'Аккаунт с таким email уже существует. Попробуйте войти.' }
  }

  // No redirect — the onboarding surface advances to step-3 setup with the user already authenticated.
  return { ok: true }
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
    return { error: 'Неверный email или пароль. Проверьте данные и попробуйте снова.' }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { error: 'Неверный email или пароль. Проверьте данные и попробуйте снова.' }
  }

  if (user.suspended) {
    return { error: 'Ваш аккаунт заблокирован. Обратитесь в поддержку: support@gigly.ru.' }
  }

  await createSession(user.id, user.email, user.role as UserRole)
  // ADMIN's home is the moderation console; CLIENT/SPECIALIST land on their dashboard.
  redirect(user.role === 'ADMIN' ? '/admin' : '/dashboard')
}

export async function logoutUser() {
  await destroySession()
  redirect('/')
}
