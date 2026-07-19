import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { getAdminUsers } from '@/lib/view-models'
import { AdminUsers } from './AdminUsers'
import PaginationControls from '@/app/components/PaginationControls'

const PAGE_SIZE = 30
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AdminUsersPage(props: { searchParams: SearchParams }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const sp = await props.searchParams
  const role = typeof sp.role === 'string' ? sp.role : undefined
  const status = typeof sp.status === 'string' ? sp.status : undefined

  const pageParam = typeof sp.page === 'string' ? sp.page : '1'
  const parsedPage = parseInt(pageParam, 10)
  const page = Math.max(1, parsedPage || 1)

  const withFilters = (p?: number) => {
    const q = new URLSearchParams()
    if (role) q.set('role', role)
    if (status) q.set('status', status)
    if (p) q.set('page', String(p))
    const s = q.toString()
    return `/admin/users${s ? `?${s}` : ''}`
  }

  if (parsedPage < 1 || isNaN(parsedPage)) {
    redirect(withFilters())
  }

  const data = await getAdminUsers({ role, status, page })

  if (page > data.totalPages && data.totalPages > 0) {
    redirect(withFilters(data.totalPages))
  }

  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, data.totalCount)

  return (
    <>
      {data.totalCount > 0 && (
        <p className="text-body font-body text-muted">
          Showing {from}-{to} of {data.totalCount} users
        </p>
      )}
      <AdminUsers rows={data.rows} selfId={session.userId} />
      {data.totalPages > 1 && (
        <Suspense fallback={null}>
          <PaginationControls currentPage={page} totalPages={data.totalPages} totalCount={data.totalCount} />
        </Suspense>
      )}
    </>
  )
}
