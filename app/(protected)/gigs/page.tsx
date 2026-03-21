import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import GigFilters from './components/GigFilters'
import PaginationControls from '@/app/components/PaginationControls'

const PAGE_SIZE = 25

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

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
  const tags = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : []
  const minBudgetParam = typeof params.minBudget === 'string' ? params.minBudget : undefined
  const minBudget = minBudgetParam ? parseInt(minBudgetParam, 10) : undefined
  const maxBudgetParam = typeof params.maxBudget === 'string' ? params.maxBudget : undefined
  const maxBudget = maxBudgetParam ? parseInt(maxBudgetParam, 10) : undefined
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'

  // Extract and validate page parameter
  const pageParam = typeof params.page === 'string' ? params.page : '1'
  const parsedPage = parseInt(pageParam, 10)
  const page = Math.max(1, parsedPage || 1)

  // Redirect if page parameter is invalid (< 1)
  if (parsedPage < 1 || isNaN(parsedPage)) {
    const redirectParams = new URLSearchParams()
    if (search) redirectParams.set('search', search)
    if (tagsParam) redirectParams.set('tags', tagsParam)
    if (minBudgetParam) redirectParams.set('minBudget', minBudgetParam)
    if (maxBudgetParam) redirectParams.set('maxBudget', maxBudgetParam)
    if (sort !== 'newest') redirectParams.set('sort', sort)
    const query = redirectParams.toString()
    redirect(`/gigs${query ? `?${query}` : ''}`)
  }

  // Build dynamic Prisma where clause with nested AND/OR
  const andConditions: any[] = [{ status: 'OPEN' }]

  // Text search: title OR description
  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    })
  }

  // Tag filtering: tag1 OR tag2 OR tag3
  if (tags.length > 0) {
    andConditions.push({
      OR: tags.map(tag => ({ tags: { contains: tag } }))
    })
  }

  // Budget range: combine min and max into single condition
  const budgetCondition: any = {}
  if (minBudget && !isNaN(minBudget) && minBudget > 0) {
    budgetCondition.gte = minBudget * 100
  }
  if (maxBudget && !isNaN(maxBudget) && maxBudget > 0) {
    budgetCondition.lte = maxBudget * 100
  }
  if (Object.keys(budgetCondition).length > 0) {
    andConditions.push({ budget: budgetCondition })
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
        client: {
          select: {
            email: true,
            clientProfile: true
          }
        }
      },
    }),
    prisma.gig.count({ where })
  ])

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Redirect if page exceeds total pages
  if (page > totalPages && totalPages > 0) {
    const redirectParams = new URLSearchParams()
    if (search) redirectParams.set('search', search)
    if (tagsParam) redirectParams.set('tags', tagsParam)
    if (minBudgetParam) redirectParams.set('minBudget', minBudgetParam)
    if (maxBudgetParam) redirectParams.set('maxBudget', maxBudgetParam)
    if (sort !== 'newest') redirectParams.set('sort', sort)
    redirectParams.set('page', totalPages.toString())
    const query = redirectParams.toString()
    redirect(`/gigs${query ? `?${query}` : ''}`)
  }

  // Check if any filters are active
  const hasActiveFilters = search || tags.length > 0 || minBudget || maxBudget

  return (
    <div className="min-h-screen bg-surface-level-0 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white leading-tight">Open Gigs</h2>
          <p className="text-sm text-neutral-strong mt-2">Browse and apply to available projects</p>
        </div>

        {/* Filter Panel */}
        <GigFilters />

        {/* Results Count */}
        {totalCount > 0 && (
          <p className="text-sm text-neutral-strong mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} gigs
          </p>
        )}

        {/* Gig List */}
        {gigs.length === 0 ? (
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8 text-center">
            <p className="text-sm text-neutral-strong">
              {hasActiveFilters
                ? 'No gigs match your filters. Try adjusting your search criteria.'
                : 'No open gigs available.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {gigs.map((gig) => {
              // Construct URL with navigation context and preserved filters
              const gigDetailParams = new URLSearchParams()
              gigDetailParams.set('from', 'browse')
              if (search) gigDetailParams.set('search', search)
              if (tagsParam) gigDetailParams.set('tags', tagsParam)
              if (minBudgetParam) gigDetailParams.set('minBudget', minBudgetParam)
              if (maxBudgetParam) gigDetailParams.set('maxBudget', maxBudgetParam)
              if (sort !== 'newest') gigDetailParams.set('sort', sort)
              if (page > 1) gigDetailParams.set('page', page.toString())
              const gigDetailUrl = `/gigs/${gig.id}?${gigDetailParams.toString()}`

              return (
              <Link
                key={gig.id}
                href={gigDetailUrl}
                className="flex justify-between items-start gap-6 bg-surface-level-1 border border-neutral-weak rounded-lg p-6 hover:bg-surface-level-2 hover:border-neutral-strong transition-colors duration-200"
              >
                {/* Left side: Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{gig.title}</h3>
                    {gig.isExample && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 flex-shrink-0">
                        ✨ Example
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-strong line-clamp-2 mb-3 leading-relaxed">{gig.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {gig.tags && gig.tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-weak mt-3">{gig.createdAt.toLocaleDateString('ru-RU')}</p>
                </div>

                {/* Right side: Price and Action */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-2xl font-bold text-white whitespace-nowrap">{formatRoubles(gig.budget)} ₽</span>
                  <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors">
                    Откликнуться →
                  </span>
                </div>
              </Link>
              )
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Suspense fallback={<div className="h-10" />}>
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}
