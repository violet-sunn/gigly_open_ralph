import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BackButton } from '@/app/components/BackButton'
import { Suspense } from 'react'
import { ExamplesDesign, type ExampleGigVM } from './ExamplesDesign'

function formatRoubles(kopecks: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(kopecks / 100)} ₽`
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
  })

  const gigs: ExampleGigVM[] = exampleGigs.map((gig) => ({
    id: gig.id,
    title: gig.title,
    description: gig.description,
    budget: formatRoubles(gig.budget),
    tags: gig.tags ? gig.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    created: gig.createdAt.toLocaleDateString('ru-RU'),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Suspense fallback={null}>
        <BackButton />
      </Suspense>
      <ExamplesDesign gigs={gigs} />
    </div>
  )
}
