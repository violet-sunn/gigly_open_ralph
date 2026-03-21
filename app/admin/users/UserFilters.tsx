'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function UserFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleFilter = searchParams.get('role') || ''
  const statusFilter = searchParams.get('status') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset pagination when filters change
    params.delete('page')
    router.push(`/admin/users?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">Role</label>
        <select
          className="border border-neutral-weak rounded-md px-3 py-2 bg-surface-level-1 text-white"
          value={roleFilter}
          onChange={(e) => updateFilter('role', e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="CLIENT">Client</option>
          <option value="SPECIALIST">Specialist</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Status</label>
        <select
          className="border border-neutral-weak rounded-md px-3 py-2 bg-surface-level-1 text-white"
          value={statusFilter}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
    </div>
  )
}
