'use client'

import { useActionState, useState } from 'react'
import { closeGig } from '@/app/actions/moderation'

export function CloseGigForm({ gigId }: { gigId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(closeGig, null)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-error-500 hover:text-error-400 font-medium"
      >
        Close
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Close Gig</h3>

            <form action={formAction}>
              <input type="hidden" name="gigId" value={gigId} />

              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-white mb-2">
                  Reason for closing *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-surface-level-0 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter the reason for closing this gig..."
                />
              </div>

              {state?.error && (
                <div className="mb-4 p-3 bg-error-500/10 border border-error-500/20 rounded-md text-error-500 text-sm">
                  {state.error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-error-500 text-white px-4 py-2 rounded-md hover:bg-error-600 disabled:opacity-50 transition-colors font-medium"
                >
                  {isPending ? 'Closing...' : 'Close Gig'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="flex-1 bg-navy-700 text-white px-4 py-2 rounded-md hover:bg-navy-600 disabled:opacity-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
