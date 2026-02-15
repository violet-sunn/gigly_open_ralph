'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSession, destroySession } from '@/lib/session'

export async function registerUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  if (!role || !['CLIENT', 'SPECIALIST'].includes(role)) {
    return { error: 'Please select a role.' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }
    })
    await createSession(user.id, user.email, user.role)
  } catch (error) {
    return { error: 'An account with this email already exists.' }
  }

  redirect('/dashboard')
}

export async function loginUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { error: 'Invalid email or password.' }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { error: 'Invalid email or password.' }
  }

  await createSession(user.id, user.email, user.role)
  redirect('/dashboard')
}

export async function logoutUser() {
  await destroySession()
  redirect('/')
}
