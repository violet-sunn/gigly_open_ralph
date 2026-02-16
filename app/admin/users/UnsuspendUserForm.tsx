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
        className="text-green-600 hover:text-green-800 font-medium"
      >
        Unsuspend
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Unsuspend User</h3>

            <form action={formAction}>
              <input type="hidden" name="userId" value={userId} />

              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for unsuspension *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter the reason for unsuspending this user..."
                />
              </div>

              {state?.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  {state.error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isPending ? 'Unsuspending...' : 'Unsuspend User'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
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
