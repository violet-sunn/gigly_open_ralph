import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

export default async function GigBrowsePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const gigs = await prisma.gig.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { email: true } } },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Open Gigs</h2>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
        {gigs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-sm text-gray-500">No open gigs available.</p>
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
