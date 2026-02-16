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
      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p className="text-sm text-red-600">{state.error}</p>
        )}
      </form>
    </div>
  )
}
