'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function GigFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || ''
  const closedFilter = searchParams.get('closed') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset pagination when filters change
    params.delete('page')
    router.push(`/admin/gigs?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">Status</label>
        <select
          className="border border-gray-600 rounded-md px-3 py-2 bg-navy-800 text-white"
          value={statusFilter}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Closure Status</label>
        <select
          className="border border-gray-600 rounded-md px-3 py-2 bg-navy-800 text-white"
          value={closedFilter}
          onChange={(e) => updateFilter('closed', e.target.value)}
        >
          <option value="">All</option>
          <option value="false">Open</option>
          <option value="true">Closed by Admin</option>
        </select>
      </div>
    </div>
  )
}
