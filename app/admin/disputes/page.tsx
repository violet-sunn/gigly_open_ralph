import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDisputeList } from '@/lib/disputes'
import { AdminDisputes } from './AdminDisputes'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

/**
 * Admin disputes («Споры») — the full dispute list (all statuses), with a status filter. ADMIN-only (mirrors the
 * /admin/users · /admin/gigs guard). Uses getDisputeList with NO participant scope, so an admin sees every dispute;
 * the optional `status` filter passes the raw status (OPEN / RESOLVED / REJECTED) to the data layer.
 */
export default async function AdminDisputesPage(props: { searchParams: SearchParams }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const sp = await props.searchParams
  const status = typeof sp.status === 'string' ? sp.status : undefined
  const data = await getDisputeList(status ? { status } : {})

  return <AdminDisputes rows={data.disputes} />
}
