'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function registerUser(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: { email, password: hashedPassword }
    })
  } catch (error) {
    return { error: 'An account with this email already exists.' }
  }

  redirect('/')
}
