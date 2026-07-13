'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { isCategorySlug } from '@/lib/categories'

/**
 * setFavoriteCategories — a specialist sets their favorite categories (replace semantics).
 * Off-taxonomy slugs are filtered out; specialist-only. Fulfils the Profile «Избранные» contract.
 */
export async function setFavoriteCategories(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.role !== 'SPECIALIST') {
    return { error: 'Избранные категории могут выбирать только специалисты.' }
  }

  const slugs = (formData.getAll('categories') as string[]).filter(isCategorySlug)

  await prisma.user.update({
    where: { id: session.userId },
    data: { favoriteCategories: { set: slugs.map((slug) => ({ slug })) } },
  })

  return { success: true }
}
