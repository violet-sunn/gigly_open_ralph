'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { markAsPaid } from '@/app/actions/gig'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Marking as Paid...' : 'Mark as Paid'}
    </button>
  )
}

export function MarkAsPaidButton({ gigId }: { gigId: string }) {
  const [state, formAction] = useActionState(markAsPaid, null)

  return (
    <div className="mt-4">
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="gigId" value={gigId} />
        <SubmitButton />
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
      </form>
    </div>
  )
}
