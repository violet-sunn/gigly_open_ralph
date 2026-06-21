import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getFinances } from '@/lib/view-models'
import { FinancesDesign } from './FinancesDesign'

export default async function FinancesPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const data = await getFinances({ userId: session.userId, role: session.role })

  return <FinancesDesign {...data} />
}
