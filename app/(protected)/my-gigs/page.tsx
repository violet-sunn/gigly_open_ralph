import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getMyGigs } from '@/lib/view-models'
import { MyGigsDesign } from './MyGigsDesign'

/**
 * «Мои гиги» (reconcile-my-projects) — the viewer's own gigs with the prototype's status tabs. Role-aware (CLIENT:
 * posted gigs; SPECIALIST: applied/assigned gigs) on one route. The public browse/search lives separately at /gigs.
 */
export default async function MyGigsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const data = await getMyGigs({ userId: session.userId, role: session.role })
  return <MyGigsDesign {...data} />
}
