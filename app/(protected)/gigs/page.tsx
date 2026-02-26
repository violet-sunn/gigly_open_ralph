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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground leading-tight">Open Gigs</h2>
          <p className="text-sm text-muted-foreground mt-2">Browse and apply to available projects</p>
        </div>

        {/* Filter Panel */}
        <GigFilters />

        {/* Results Count */}
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} gigs
          </p>
        )}

        {/* Gig List */}
        {gigs.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? 'No gigs match your filters. Try adjusting your search criteria.'
                : 'No open gigs available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="block bg-card border border-border rounded-lg p-8 hover:border-primary transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">{gig.title}</h3>
                    {gig.isExample && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary flex-shrink-0">
                        ✨ Example
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{gig.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.tags && gig.tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-lg font-bold text-foreground">{formatRoubles(gig.budget)} ₽</span>
                  <span className="text-xs text-muted-foreground">{gig.createdAt.toLocaleDateString('ru-RU')}</span>
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
