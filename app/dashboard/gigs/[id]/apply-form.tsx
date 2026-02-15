'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { applyToGig } from '@/app/actions/gig'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Applying...' : 'Apply'}
    </button>
  )
}

export function ApplyForm({ gigId }: { gigId: string }) {
  const [state, formAction] = useActionState(applyToGig, null)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="gigId" value={gigId} />
      {state?.error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}
      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
          Cover Letter <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
          placeholder="Tell the client why you're a great fit..."
        />
      </div>
      <SubmitButton />
    </form>
  )
}
