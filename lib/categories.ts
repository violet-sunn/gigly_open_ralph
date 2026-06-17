import { prisma } from '@/lib/prisma'
import type { Category } from '@/app/components/blocks/view-models'

/**
 * The canonical five categories. Typed `slug: Category` (imported `import type` from the view-model
 * SSOT) so the set is compile-time-checked against the blocks' `Category` union — no runtime UI
 * coupling. SQLite has no native enums, so these are seeded as `Category` rows (enum-as-table).
 */
export const CATEGORIES: readonly { slug: Category; name: string }[] = [
  { slug: 'marketing', name: 'Маркетинг' },
  { slug: 'design', name: 'Дизайн' },
  { slug: 'programming', name: 'Программирование' },
  { slug: 'development', name: 'Разработка' },
  { slug: 'coding', name: 'Кодинг' },
] as const

/** Type guard: is `s` one of the canonical five category slugs? */
export function isCategorySlug(s: string): s is Category {
  return CATEGORIES.some((c) => c.slug === s)
}

/** The five categories, ordered — fulfils the FilterBar option set. Server-only. */
export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: 'asc' } })
}

/** A user's favorite categories, ordered — fulfils the Profile «Избранные». Server-only. */
export async function getFavoriteCategories(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { favoriteCategories: { orderBy: { order: 'asc' } } },
  })
  return user?.favoriteCategories ?? []
}
