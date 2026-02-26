'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendMessage } from '@/app/actions/gig'

interface MessageFormProps {
  gigId: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  )
}

export function MessageForm({ gigId }: MessageFormProps) {
  const [state, formAction] = useActionState(sendMessage, null)

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="gigId" value={gigId} />

      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{state.error}</p>
        </div>
      )}

      <textarea
        name="content"
        required
        maxLength={2000}
        rows={3}
        placeholder="Type your message..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <SubmitButton />
    </form>
  )
}
