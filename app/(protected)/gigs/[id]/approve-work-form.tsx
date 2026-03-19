'use client'

import { useActionState } from 'react'
import { approveWork } from '@/app/actions/gig'

export function ApproveWorkForm({ gigId }: { gigId: string }) {
  const [state, action, pending] = useActionState(approveWork, null)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="gigId" value={gigId} />

      {state?.error && (
        <div className="text-sm text-error-400 bg-error-500/10 border border-error-500/20 p-3 rounded-md">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {pending ? 'Approving...' : 'Approve Work'}
      </button>
    </form>
  )
}
