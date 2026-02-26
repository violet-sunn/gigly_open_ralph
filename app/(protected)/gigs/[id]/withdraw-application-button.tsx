'use client'

import { useActionState } from 'react'
import { withdrawApplication } from '@/app/actions/gig'

export function WithdrawApplicationButton({ applicationId }: { applicationId: string }) {
  const [state, formAction, isPending] = useActionState(withdrawApplication, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="applicationId" value={applicationId} />
      {state?.error && <p className="text-sm text-red-600 mb-2">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? 'Withdrawing...' : 'Withdraw Application'}
      </button>
    </form>
  )
}
