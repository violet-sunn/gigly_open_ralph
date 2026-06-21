import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDisputes } from '@/lib/view-models'
import { DisputesDesign } from './DisputesDesign'

export default async function DisputesPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const data = await getDisputes({ userId: session.userId, role: session.role })

  return <DisputesDesign {...data} />
}
