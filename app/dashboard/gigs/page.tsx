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
    redirect(`/dashboard/gigs${query ? `?${query}` : ''}`)
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
    redirect(`/dashboard/gigs${query ? `?${query}` : ''}`)
  }

  // Check if any filters are active
  const hasActiveFilters = search || tags.length > 0 || minBudget || maxBudget

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Open Gigs</h2>
        </div>

        {/* Filter Panel */}
        <GigFilters />

        {/* Results Count */}
        {totalCount > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} gigs
          </p>
        )}

        {/* Gig List */}
        {gigs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-sm text-gray-500">
              {hasActiveFilters
                ? 'No gigs match your filters. Try adjusting your search criteria.'
                : 'No open gigs available.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
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
              const gigDetailUrl = `/dashboard/gigs/${gig.id}?${gigDetailParams.toString()}`

              return (
              <li key={gig.id}>
                <Link
                  href={gigDetailUrl}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                      {gig.isExample && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          ✨ Example
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-green-700">{formatRoubles(gig.budget)} ₽</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{gig.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      {gig.tags && gig.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{gig.createdAt.toLocaleDateString('ru-RU')}</span>
                  </div>
                </Link>
              </li>
              )
            })}
          </ul>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6">
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
