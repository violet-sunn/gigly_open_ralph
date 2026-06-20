import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { GigSearch } from './GigSearch'
import PaginationControls from '@/app/components/PaginationControls'
import { getGigSearch } from '@/lib/view-models'
import { CATEGORIES, isCategorySlug } from '@/lib/categories'
import type { SelectOption } from '@/app/components/primitives'

const PAGE_SIZE = 25

const categoryOptions: SelectOption[] = [
  { value: '', label: 'Все категории' },
  ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
]
const sortOptions: SelectOption[] = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'budget-desc', label: 'Дороже' },
  { value: 'budget-asc', label: 'Дешевле' },
]
const ratingOptions: SelectOption[] = [
  { value: '', label: 'Любой рейтинг' },
  { value: '4', label: '4★ и выше' },
  { value: '3', label: '3★ и выше' },
]

export default async function GigBrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Role-based access control: only SPECIALIST users can browse gigs
  if (session.role === 'CLIENT') {
    redirect('/dashboard?error=browse-gigs-specialists-only')
  }

  const params = await searchParams

  // Extract filter parameters from searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const tagsParam = typeof params.tags === 'string' ? params.tags : undefined
  const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean) : []
  const minBudgetParam = typeof params.minBudget === 'string' ? params.minBudget : undefined
  const minBudget = minBudgetParam ? parseInt(minBudgetParam, 10) : undefined
  const maxBudgetParam = typeof params.maxBudget === 'string' ? params.maxBudget : undefined
  const maxBudget = maxBudgetParam ? parseInt(maxBudgetParam, 10) : undefined
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'
  // compose-gig-search: design dimensions — category filter, Рейтинг (client min-rating) filter, grid/list view.
  const categoryParam = typeof params.category === 'string' ? params.category : undefined
  const category = categoryParam && isCategorySlug(categoryParam) ? categoryParam : undefined
  const minRatingParam = typeof params.minRating === 'string' ? params.minRating : undefined
  const minRating = minRatingParam ? parseInt(minRatingParam, 10) : undefined
  const view: 'grid' | 'list' = params.view === 'list' ? 'list' : 'grid'

  // Extract and validate page parameter
  const pageParam = typeof params.page === 'string' ? params.page : '1'
  const parsedPage = parseInt(pageParam, 10)
  const page = Math.max(1, parsedPage || 1)

  // Preserve every active filter param across redirects (page validation) and links.
  const preserved = (extra?: Record<string, string>) => {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (tagsParam) p.set('tags', tagsParam)
    if (minBudgetParam) p.set('minBudget', minBudgetParam)
    if (maxBudgetParam) p.set('maxBudget', maxBudgetParam)
    if (sort !== 'newest') p.set('sort', sort)
    if (category) p.set('category', category)
    if (minRatingParam) p.set('minRating', minRatingParam)
    if (view === 'list') p.set('view', 'list')
    for (const [k, v] of Object.entries(extra ?? {})) p.set(k, v)
    return p.toString()
  }

  // Redirect if page parameter is invalid (< 1)
  if (parsedPage < 1 || isNaN(parsedPage)) {
    const query = preserved()
    redirect(`/gigs${query ? `?${query}` : ''}`)
  }

  // Build dynamic Prisma where clause with nested AND/OR
  const andConditions: any[] = [{ status: 'OPEN' }]

  // Text search: title OR description
  if (search) {
    andConditions.push({
      OR: [{ title: { contains: search } }, { description: { contains: search } }],
    })
  }

  // Tag filtering: tag1 OR tag2 OR tag3
  if (tags.length > 0) {
    andConditions.push({ OR: tags.map((tag) => ({ tags: { contains: tag } })) })
  }

  // Budget range: combine min and max into single condition
  const budgetCondition: any = {}
  if (minBudget && !isNaN(minBudget) && minBudget > 0) budgetCondition.gte = minBudget * 100
  if (maxBudget && !isNaN(maxBudget) && maxBudget > 0) budgetCondition.lte = maxBudget * 100
  if (Object.keys(budgetCondition).length > 0) andConditions.push({ budget: budgetCondition })

  // Category filter (compose-gig-search)
  if (category) andConditions.push({ categorySlug: category })

  // Рейтинг filter (compose-gig-search): gigs whose OWNER's average review rating ≥ minRating.
  if (minRating && !isNaN(minRating) && minRating > 0) {
    const qualified = await prisma.review.groupBy({
      by: ['targetId'],
      _avg: { rating: true },
      having: { rating: { _avg: { gte: minRating } } },
    })
    andConditions.push({ clientId: { in: qualified.map((q) => q.targetId) } })
  }

  const where = { AND: andConditions }

  // Build dynamic orderBy
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'budget-desc') orderBy = { budget: 'desc' }
  if (sort === 'budget-asc') orderBy = { budget: 'asc' }

  // Execute queries in parallel: fetch paginated gigs and total count
  const [gigs, totalCount] = await Promise.all([
    prisma.gig.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        client: { select: { email: true, clientProfile: true } },
        _count: { select: { applications: true } }, // drives the «На рассмотрении» derived status
      },
    }),
    prisma.gig.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Redirect if page exceeds total pages
  if (page > totalPages && totalPages > 0) {
    const query = preserved({ page: totalPages.toString() })
    redirect(`/gigs${query ? `?${query}` : ''}`)
  }

  const data = await getGigSearch({
    gigs: gigs as any,
    count: totalCount,
    page,
    totalPages,
    perPage: PAGE_SIZE,
    view,
    query: search ?? '',
  })

  return (
    <>
      <Suspense fallback={null}>
        <GigSearch
          data={data}
          categoryOptions={categoryOptions}
          sortOptions={sortOptions}
          ratingOptions={ratingOptions}
        />
      </Suspense>
      {totalPages > 1 && (
        <Suspense fallback={<div className="h-10" />}>
          <PaginationControls currentPage={page} totalPages={totalPages} totalCount={totalCount} />
        </Suspense>
      )}
    </>
  )
}
