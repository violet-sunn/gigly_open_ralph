import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GigFilters from './components/GigFilters'

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

  const gigs = await prisma.gig.findMany({
    where,
    orderBy,
    include: { client: { select: { email: true } } },
  })

  // Check if any filters are active
  const hasActiveFilters = search || tags.length > 0 || minBudget || maxBudget

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Open Gigs</h2>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filter Panel */}
        <GigFilters />

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
            {gigs.map((gig) => (
              <li key={gig.id}>
                <Link
                  href={`/dashboard/gigs/${gig.id}`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
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
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
