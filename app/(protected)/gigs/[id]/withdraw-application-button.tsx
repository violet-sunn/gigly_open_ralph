'use client'

import { useActionState } from 'react'
import { withdrawApplication } from '@/app/actions/gig'

export function WithdrawApplicationButton({ applicationId }: { applicationId: string }) {
  const [state, formAction, isPending] = useActionState(withdrawApplication, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="applicationId" value={applicationId} />
      {state?.error && <p className="text-sm text-destructive mb-2">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Withdrawing...' : 'Withdraw Application'}
      </button>
    </form>
  )
}
