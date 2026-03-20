'use client'

import { useActionState, useState } from 'react'
import { unsuspendUser } from '@/app/actions/moderation'

export function UnsuspendUserForm({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(unsuspendUser, null)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-success-500 hover:text-success-400 font-medium"
      >
        Unsuspend
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Unsuspend User</h3>

            <form action={formAction}>
              <input type="hidden" name="userId" value={userId} />

              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-white mb-2">
                  Reason for unsuspension *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-navy-900 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter the reason for unsuspending this user..."
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
                  className="flex-1 bg-success-500 text-white px-4 py-2 rounded-md hover:bg-success-600 disabled:opacity-50 transition-colors font-medium"
                >
                  {isPending ? 'Unsuspending...' : 'Unsuspend User'}
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
