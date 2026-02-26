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
        className="text-green-500 hover:text-green-400 font-medium"
      >
        Unsuspend
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Unsuspend User</h3>

            <form action={formAction}>
              <input type="hidden" name="userId" value={userId} />

              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-muted-foreground mb-2">
                  Reason for unsuspension *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  className="w-full border border-input rounded-md px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter the reason for unsuspending this user..."
                />
              </div>

              {state?.error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                  {state.error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {isPending ? 'Unsuspending...' : 'Unsuspend User'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 disabled:opacity-50 transition-colors"
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
