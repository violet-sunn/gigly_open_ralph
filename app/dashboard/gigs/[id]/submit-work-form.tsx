'use client'

import { useActionState } from 'react'
import { submitWork } from '@/app/actions/gig'

export function SubmitWorkForm({ gigId }: { gigId: string }) {
  const [state, action, pending] = useActionState(submitWork, null)

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
        className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Submitting...' : 'Submit Work'}
      </button>
    </form>
  )
}
