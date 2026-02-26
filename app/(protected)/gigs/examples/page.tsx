import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

export default async function ExampleGigsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  // No role check - accessible to both CLIENT and SPECIALIST

  const exampleGigs = await prisma.gig.findMany({
    where: {
      isExample: true,
      status: 'OPEN'
    },
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: {
          email: true,
          clientProfile: true
        }
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Example Gigs</h2>
          <p className="mt-2 text-sm text-gray-600">
            These are example gigs to help you understand what makes a good gig description.
            Use them as inspiration when creating your own gigs.
          </p>
        </div>

        {exampleGigs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-sm text-gray-500">No example gigs available.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {exampleGigs.map((gig) => (
              <li key={gig.id}>
                <Link
                  href={`/dashboard/gigs/${gig.id}?from=examples`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        ✨ Example
                      </span>
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
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
