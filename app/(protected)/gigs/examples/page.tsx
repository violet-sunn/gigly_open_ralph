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
    <div className="min-h-screen bg-navy-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white leading-tight">Example Gigs</h2>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">
            These are example gigs to help you understand what makes a good gig description.
            Use them as inspiration when creating your own gigs.
          </p>
        </div>

        {exampleGigs.length === 0 ? (
          <div className="bg-navy-800 border border-gray-700 rounded-lg p-8 text-center shadow-md">
            <p className="text-sm text-gray-300">No example gigs available.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {exampleGigs.map((gig) => (
              <li key={gig.id}>
                <Link
                  href={`/dashboard/gigs/${gig.id}?from=examples`}
                  className="block bg-navy-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors duration-200 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-medium text-white">{gig.title}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                        ✨ Example
                      </span>
                    </div>
                    <span className="text-sm font-medium text-success-400">{formatRoubles(gig.budget)} ₽</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-300 line-clamp-2 leading-relaxed">{gig.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      {gig.tags && gig.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
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
