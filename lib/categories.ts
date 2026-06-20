import { prisma } from '@/lib/prisma'
import type { Category } from '@/app/components/blocks/view-models'

/**
 * The canonical five categories. Typed `slug: Category` (imported `import type` from the view-model
 * SSOT) so the set is compile-time-checked against the blocks' `Category` union — no runtime UI
 * coupling. SQLite has no native enums, so these are seeded as `Category` rows (enum-as-table).
 */
export const CATEGORIES: readonly { slug: Category; name: string; color: string }[] = [
  { slug: 'marketing', name: 'Маркетинг', color: 'blue' },
  { slug: 'design', name: 'Дизайн', color: 'rose' },
  { slug: 'programming', name: 'Программирование', color: 'green' },
  { slug: 'development', name: 'Разработка', color: 'teal' },
  { slug: 'coding', name: 'Кодинг', color: 'orange' },
] as const

/** Seed/upsert the five canonical categories (incl. their design `color`). Server-only; idempotent. */
export async function seedCategories() {
  for (const [i, c] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { slug: c.slug, name: c.name, order: i, color: c.color },
      update: { name: c.name, order: i, color: c.color },
    })
  }
}

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
