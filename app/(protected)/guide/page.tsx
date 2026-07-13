import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { GuideDesign } from './GuideDesign'

export default async function GuidePage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const role = session.role === 'SPECIALIST' ? 'SPECIALIST' : 'CLIENT'
  return <GuideDesign role={role} />
}
