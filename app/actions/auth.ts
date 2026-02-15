'use server'

import { prisma } from '@/lib/prisma'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const user = await prisma.user.create({
      data: { email, password }
    })
    return { success: true, userId: user.id }
  } catch (error) {
    return { success: false, error: 'Registration failed' }
  }
}
