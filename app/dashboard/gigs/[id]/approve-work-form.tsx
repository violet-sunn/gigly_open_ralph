'use client'

import { useActionState } from 'react'
import { approveWork } from '@/app/actions/gig'

export function ApproveWorkForm({ gigId }: { gigId: string }) {
  const [state, action, pending] = useActionState(approveWork, null)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="gigId" value={gigId} />

      {state?.error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Approving...' : 'Approve Work'}
      </button>
    </form>
  )
}
